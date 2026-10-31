// Real browser acceptance for the ambient world and optional hacker horror lab.
// These assertions observe rendered pixels, hit targets and visitor workflows;
// they do not mistake the presence of animation code for working animation.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {launchBrowser} from "./browser-test.mjs";

const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const campaign = {enabled:true,startsAt:"2026-10-24T00:00:00Z",endsAt:"2026-11-02T00:00:00Z"};
const instant = new Date("2026-10-31T12:00:00Z");
const preference = "websec-halloween-v1";
const views = ["evidence","museum","library","time","signals","constellation","terminal","desk","favourites"];
assert.ok(process.env.AXE_SOURCE,"immersive seasonal accessibility requires approved axe-core");
const axeSource = await readFile(process.env.AXE_SOURCE,"utf8");
const browser = await launchBrowser();
const errors = [];
const captures = new Set();
const labScrollPositions = new WeakMap();
let phase = "initialisation";

async function fixture(options = {}, config = campaign) {
  const context = await browser.newContext(options);
  await context.route("**/halloween-config.js*",route => route.fulfill({status:200,
    contentType:"text/javascript",body:`window.WEBHACKLIST_HALLOWEEN=Object.freeze(${JSON.stringify(config)});`}));
  context.on("page",page => page.on("pageerror",error => errors.push({message:error.message,url:page.url(),phase})));
  return context;
}
async function newPage(context) {
  const page = await context.newPage();
  await page.clock.setFixedTime(instant);
  return page;
}
async function ready(page) {
  await page.waitForSelector("#app-shell:not([hidden])");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  // A cold Desk/Time boot exposes working controls before its progressive
  // collection requests finish. Their completion calls discoveryRefresh(),
  // which replaces those controls. Wait for that real loading lifecycle before
  // measuring or scrolling a query field; keep the actual pointer hit test.
  await page.waitForFunction(() => !isDiscoveryView() ||
    (!discoveryLoadState().missing.length && discoveryState.requests.size===0 && collectionRequests.size===0));
  await page.evaluate(() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function on(page) {
  await page.waitForFunction(() => document.documentElement.dataset.halloween === "on");
  await page.locator("#halloween-world-canvas").waitFor({state:"visible"});
  assert.equal(await page.locator("#halloween-toggle").getAttribute("aria-pressed"),"true");
}
async function off(page) {
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-halloween"));
  assert.equal(await page.locator("#halloween-world:visible").count(),0,"off removes the ambient world from view");
  assert.equal(await page.locator("#halloween-lab[open]").count(),0,"off dismisses the optional horror lab");
}
async function toggle(page) {
  const button = page.locator("#halloween-toggle");
  await button.scrollIntoViewIfNeeded();
  await button.click();
}
async function changeView(page,view) {
  await page.evaluate(async view => { await setView(view); },view);
  await page.waitForFunction(view => document.documentElement.dataset.view === view,view);
}
async function noOverflow(page,label) {
  const sizes = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(sizes.scroll <= sizes.width + 1,`${label}: no horizontal overflow (${JSON.stringify(sizes)})`);
}
async function worldFits(page,label) {
  await on(page);
  await noOverflow(page,label);
  const world = await page.locator("#halloween-world").evaluate(node => {
    const rect=node.getBoundingClientRect(),canvas=node.querySelector("canvas"),paper=canvas.getBoundingClientRect();
    return {position:getComputedStyle(node).position,events:getComputedStyle(node).pointerEvents,
      canvasEvents:getComputedStyle(canvas).pointerEvents,hidden:node.getAttribute("aria-hidden"),
      left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:innerWidth,height:innerHeight,
      canvasLeft:paper.left,canvasTop:paper.top,canvasRight:paper.right,canvasBottom:paper.bottom};
  });
  assert.equal(world.position,"fixed",`${label}: ambient layer stays fixed to the viewport`);
  assert.equal(world.events,"none",`${label}: ambient world cannot capture pointer input`);
  assert.equal(world.canvasEvents,"none",`${label}: canvas cannot capture pointer input`);
  assert.equal(world.hidden,"true",`${label}: atmospheric artwork is hidden from assistive technology`);
  assert.ok(Math.abs(world.left) <= 1 && Math.abs(world.top) <= 1 && Math.abs(world.right-world.width) <= 1 && Math.abs(world.bottom-world.height) <= 1,`${label}: world fits viewport ${JSON.stringify(world)}`);
  assert.ok(world.canvasLeft >= -1 && world.canvasTop >= -1 && world.canvasRight <= world.width+1 && world.canvasBottom <= world.height+1,`${label}: canvas stays inside viewport`);
}
async function hitTarget(page,selector,label) {
  const control=page.locator(selector).first();
  await control.scrollIntoViewIfNeeded();
  await page.waitForFunction(selector => {
    const node=document.querySelector(selector);
    if (!node) return false;
    const rect=node.getBoundingClientRect();
    const hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
    return rect.width>0 && rect.height>0 && (hit===node || node.contains(hit));
  },selector);
  assert.ok(await control.isVisible(),`${label}: real control remains visible and receives pointer input`);
  return control;
}
async function pixels(page) {
  return page.locator("#halloween-world-canvas").evaluate(canvas => {
    const rgba=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data;
    let hash=2166136261,painted=0;
    // Include every channel so a stationary background cannot disguise moving
    // spirits and insects. Return only a bounded digest, never canvas bytes.
    for (let index=0;index<rgba.length;index++) hash=Math.imul(hash^rgba[index],16777619)>>>0;
    for (let index=3;index<rgba.length;index+=4) if (rgba[index]) painted++;
    return {hash,painted,width:canvas.width,height:canvas.height};
  });
}
async function moving(page,label) {
  await page.waitForTimeout(150);
  const first=await pixels(page);
  await page.waitForTimeout(550);
  const second=await pixels(page);
  assert.ok(first.width>0 && first.height>0 && first.painted>30,`${label}: world paints actual artwork`);
  assert.notEqual(first.hash,second.hash,`${label}: rendered ghost/bug pixels move over real time`);
}
async function still(page,label) {
  // Permit the last frame to settle after a media, dialog or visibility event.
  await page.waitForTimeout(180);
  const first=await pixels(page);
  await page.waitForTimeout(550);
  const second=await pixels(page);
  assert.equal(first.hash,second.hash,`${label}: actual ambient pixels stop changing`);
}
async function capture(page,name) {
  if (process.env.WEBSEC_CASE_CAPTURE!=="1" || captures.has(name)) return;
  const bytes=await page.screenshot({type:"jpeg",quality:65,fullPage:false});
  assert.ok(bytes.length<512*1024,`${name}: bounded acceptance screenshot`);
  console.log("CASE_CAPTURE "+JSON.stringify({name:`halloween-immersive-${name}`,format:"jpeg",bytes:bytes.length,data:bytes.toString("base64")}));
  captures.add(name);
}
async function openLab(page) {
  const launcher=await hitTarget(page,"[data-haunt-open]","horror lab launcher");
  await launcher.focus();
  labScrollPositions.set(page,await page.evaluate(()=>({x:scrollX,y:scrollY})));
  await launcher.click();
  await page.waitForSelector("#halloween-lab[open]");
  await page.waitForFunction(() => document.querySelector("#halloween-lab").contains(document.activeElement));
  return launcher;
}
async function closedLab(page,launcher) {
  await page.waitForSelector("#halloween-lab[open]",{state:"hidden"});
  // Native focus return can precede the queued close event that unlocks body
  // scrolling. Observe that cleanup before checking the restored page position.
  await page.waitForFunction(() => document.activeElement===document.querySelector("[data-haunt-open]") &&
    !document.documentElement.classList.contains("haunt-lab-open"));
  assert.ok(await launcher.isVisible(),"lab dismissal returns to a visible launcher");
  const previous=labScrollPositions.get(page);
  await page.waitForFunction(({x,y})=>Math.abs(scrollX-x)<=1 && Math.abs(scrollY-y)<=1,previous);
  const restored=await page.evaluate(()=>({x:scrollX,y:scrollY}));
  assert.ok(Math.abs(restored.x-previous.x)<=1 && Math.abs(restored.y-previous.y)<=1,
    `lab dismissal restores the research page position ${JSON.stringify({previous,restored})}`);
}
async function scene(page,name) {
  await page.locator(`button[data-haunt-scene="${name}"]`).click();
  await page.locator(`section[data-haunt-panel="${name}"]:not([hidden])`).waitFor({state:"visible"});
  assert.equal(await page.locator(`button[data-haunt-scene="${name}"]`).getAttribute("aria-selected"),"true");
  assert.equal(await page.locator("section[data-haunt-panel]:visible").count(),1,"only the selected horror scene is exposed");
}
async function auditLab(page,label) {
  await page.evaluate(axeSource);
  const violations=await page.evaluate(async () => (await axe.run(document.querySelector("#halloween-lab"),{
    runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}})).violations);
  assert.deepEqual(violations,[],`${label}: lab accessibility`);
}
async function labFits(page,label) {
  await noOverflow(page,label);
  const geometry=await page.locator("#halloween-lab").evaluate(dialog => {
    const rect=dialog.getBoundingClientRect();
    return {left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:innerWidth,height:innerHeight,
      overflow:dialog.scrollWidth>dialog.clientWidth+1,modal:dialog.matches(":modal")};
  });
  assert.equal(geometry.modal,true,`${label}: the optional experience is a native modal dialog`);
  assert.equal(geometry.overflow,false,`${label}: horror lab has no horizontal overflow`);
  assert.ok(geometry.left>=-1 && geometry.top>=-1 && geometry.right<=geometry.width+1 && geometry.bottom<=geometry.height+1,`${label}: lab fits viewport ${JSON.stringify(geometry)}`);
}
function syntheticPdf() {
  const stream="BT /F1 18 Tf 30 740 Td (Haunted archive reading fixture) Tj ET";
  const objects=["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let source="%PDF-1.4\n";const offsets=[0];
  objects.forEach((object,index)=>{offsets.push(source.length);source+=`${index+1} 0 obj\n${object}\nendobj\n`;});
  const start=source.length;
  source+=`xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
  return Buffer.from(source);
}

const context=await fixture({viewport:{width:1440,height:1000}});
const page=await newPage(context);
try {
  phase="whole-site responsive archive modes";
  await page.goto(base);await ready(page);await on(page);
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:width<600?844:1000});
    for (const view of views) {
      phase=`${view} at ${width}px`;
      await changeView(page,view);await worldFits(page,phase);
      await toggle(page);await off(page);await noOverflow(page,`${phase} off`);
      assert.equal(await page.locator("html").getAttribute("data-view"),view,"opting out preserves chosen archive mode");
      await toggle(page);await on(page);
      if (["desk","time"].includes(view)) {
        for (const theme of ["light","dark"]) {
          await page.locator(`[data-discovery-action="theme"][data-discovery-value="${theme}"]`).click();
          await worldFits(page,`${phase} ${theme}`);
          await toggle(page);await off(page);
          assert.equal(await page.locator("html").getAttribute("data-discovery-theme"),theme,"Halloween preference preserves discovery appearance");
          await toggle(page);await on(page);
        }
      }
    }
  }
  console.log("Halloween immersion: nine archive modes fit four widths, both discovery appearances and opt-out");

  phase="canvas motion and motion preferences";
  await page.setViewportSize({width:1440,height:1000});await changeView(page,"evidence");
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
  await moving(page,"ordinary ambient motion");
  await capture(page,"desktop-world-1");await page.waitForTimeout(550);await capture(page,"desktop-world-2");
  await page.emulateMedia({reducedMotion:"reduce"});
  await still(page,"OS reduced motion");
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.waitForFunction(()=>!document.body.classList.contains("reduce-motion"));
  await moving(page,"restored OS motion");
  await page.locator("#motion-toggle").click();
  await page.waitForFunction(()=>document.body.classList.contains("reduce-motion"));
  await still(page,"site reduced motion");
  await page.locator("#motion-toggle").click();
  await page.waitForFunction(()=>!document.body.classList.contains("reduce-motion"));
  await moving(page,"restored site motion");
  // Portable visibility event fixture: headless engines disagree on whether a
  // second tab backgrounds the first. Exercise the real visibility listener.
  await page.evaluate(()=>{
    Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});
    Object.defineProperty(document,"visibilityState",{configurable:true,get:()=>"hidden"});
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await still(page,"background document");
  await page.evaluate(()=>{delete document.hidden;delete document.visibilityState;document.dispatchEvent(new Event("visibilitychange"));});
  await moving(page,"foreground document");

  for (const width of [1440,320]) {
    phase=`interactive hacker horror lab at ${width}px`;
    await page.setViewportSize({width,height:width===320?844:1000});await changeView(page,"desk");
    const archiveUrl=page.url();
    const launcher=await openLab(page);await labFits(page,phase);
    // Room memory is a visitor preference; choose the capture subject without
    // requiring the runtime to forget the visitor's last selected room.
    await scene(page,"outbreak");
    await capture(page,width===1440?"desktop-outbreak":"phone-outbreak");
    await still(page,"ambient world while lab is open");
    const copy=await page.locator("#halloween-lab").innerText();
    assert.match(copy,/fiction|simulation/i,"horror scenario is clearly fictional");
    for (let index=0;index<12;index++) {
      await page.keyboard.press("Tab");
      const focus=await page.evaluate(()=>{
        const active=document.activeElement;
        return {inside:document.querySelector("#halloween-lab").contains(active),id:active?.id,
          tag:active?.tagName,label:active?.getAttribute("aria-label"),text:active?.textContent?.trim().slice(0,100)};
      });
      assert.ok(focus.inside,`${phase}: native modal traps sequential keyboard focus ${JSON.stringify({tab:index+1,...focus})}`);
    }
    await scene(page,"outbreak");await auditLab(page,`${width}px outbreak`);
    const breach=page.locator("[data-haunt-release]");
    await breach.click();assert.equal(await breach.getAttribute("aria-pressed"),"true","visitor can unleash the fictional holiday outbreak");
    await breach.click();assert.equal(await breach.getAttribute("aria-pressed"),"false","visitor can contain the fictional holiday outbreak");
    await scene(page,"graveyard");
    const epitaphs=new Set();
    for (const tomb of ["endpoint","header","race","exception"]) {
      const grave=page.locator(`[data-haunt-epitaph="${tomb}"]`);
      await grave.focus();
      const outerScroll=await page.evaluate(()=>({x:scrollX,y:scrollY}));
      await grave.click();
      assert.equal(await grave.getAttribute("aria-pressed"),"true");
      const epitaph=(await page.locator("#haunt-lab-epitaph").innerText()).trim();
      assert.ok(epitaph.length>30,"each vulnerability grave reveals a readable epitaph");
      epitaphs.add(epitaph);
      const reveal=await page.locator("#haunt-lab-epitaph").evaluate(output=>{
        const text=output.getBoundingClientRect(),pane=output.closest(".haunt-lab-content").getBoundingClientRect();
        return {top:text.top,bottom:text.bottom,paneTop:pane.top,paneBottom:pane.bottom,x:scrollX,y:scrollY};
      });
      assert.ok(reveal.top>=reveal.paneTop-1 && reveal.bottom<=reveal.paneBottom+1,
        `${width}px ${tomb}: selecting a grave reveals its full inscription inside the lab ${JSON.stringify(reveal)}`);
      assert.deepEqual({x:reveal.x,y:reveal.y},outerScroll,"revealing an epitaph does not move the archive page");
      assert.ok(await grave.evaluate(button=>document.activeElement===button),"revealing an epitaph preserves keyboard focus on its grave");
    }
    assert.equal(epitaphs.size,4,"each overlooked vulnerability has its own epitaph");
    await labFits(page,`${width}px graveyard`);await auditLab(page,`${width}px graveyard`);
    if (width===1440) await capture(page,"desktop-graveyard");
    await scene(page,"zombies");
    await page.locator("[data-haunt-reset]").click();
    assert.match(await page.locator("[data-haunt-contained]").innerText(),/0\s*\/\s*3/);
    for (const id of ["1","2","3"]) {
      await page.locator(`[data-haunt-patch="${id}"]`).click();
      await page.waitForFunction(id=>document.querySelector(`[data-haunt-zombie="${id}"]`).dataset.hauntZombieState==="resurrected",id);
      assert.match(await page.locator(`[data-haunt-zombie-status="${id}"]`).innerText(),/patch|resurrect|return|fail|unpatch|unsupported/i,"a patch cannot cure the fictional zombie box");
    }
    if (width===320) await capture(page,"phone-zombies");
    for (const id of ["1","2","3"]) {
      await page.locator(`[data-haunt-isolate="${id}"]`).click();
      assert.equal(await page.locator(`[data-haunt-zombie="${id}"]`).getAttribute("data-haunt-zombie-state"),"contained");
    }
    assert.match(await page.locator("[data-haunt-contained]").innerText(),/3\s*\/\s*3/);
    await labFits(page,`${width}px zombie containment`);await auditLab(page,`${width}px zombies`);
    assert.equal(page.url(),archiveUrl,"horror lab never replaces research routing");
    await page.keyboard.press("Escape");await closedLab(page,launcher);
    await openLab(page);await page.locator("[data-haunt-close]:visible").first().click();await closedLab(page,launcher);
    await openLab(page);
    const outside=await page.locator("#halloween-lab").evaluate(dialog=>{
      const rect=dialog.getBoundingClientRect();
      return rect.left>2?{x:rect.left/2,y:innerHeight/2}:rect.top>2?{x:innerWidth/2,y:rect.top/2}:null;
    });
    assert.ok(outside,"dialog leaves a backdrop dismissal target");
    await page.mouse.click(outside.x,outside.y);await closedLab(page,launcher);
    await moving(page,"ambient motion resumes after closing lab");
  }
  console.log("Halloween immersion: native lab keyboard/backdrop dismissal, four epitaphs, unpatchable zombies, containment and six accessibility audits pass");

  phase="ordinary phone research with moving world";
  await page.setViewportSize({width:390,height:844});await changeView(page,"museum");
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));await capture(page,"phone-world");
  await (await hitTarget(page,"#find-research","Find research")).click();
  await page.waitForFunction(()=>document.activeElement===document.querySelector("#desk-query"));
  await (await hitTarget(page,"#desk-query","query field")).fill("halloween-immersion-no-record");
  assert.equal(await page.locator(".discovery-record").count(),0);
  await page.locator('[data-discovery-action="desk-reset"]').click();
  await page.waitForSelector(".discovery-record");
  await (await hitTarget(page,"#desk-year","year filter")).selectOption("2024");
  assert.ok(await page.locator(".discovery-record").count()>0);
  await page.locator('[data-discovery-action="desk-reset"]').click();
  const saved=await hitTarget(page,".discovery-record [data-favourite]","save research");
  const savedId=await saved.getAttribute("data-favourite");await saved.click();
  assert.equal(await page.locator(`[data-favourite="${savedId}"]`).first().getAttribute("aria-pressed"),"true");
  await (await hitTarget(page,".discovery-record [data-artifact]","research details")).click();
  await page.waitForSelector("#artifact-dialog[open]");await still(page,"ambient world behind ordinary research dialog");
  await page.keyboard.press("Escape");
  await page.waitForFunction(()=>!document.querySelector("#artifact-dialog").open && !documentDismissal && !restoringRoute && dialogUnlockFrame===null && lockedDialogScrollY===null);
  await on(page);
  const readerUrl=await page.evaluate(()=>documentShareUrl(state.items.find(item=>item.mdPath),"reader"));
  await page.goto(readerUrl);await page.waitForSelector("#reader-dialog[open] .archive-warning");
  await page.waitForFunction(()=>document.querySelector("#reader-content").textContent.length>100);
  await still(page,"ambient world behind article reader");
  await page.keyboard.press("Escape");
  await page.waitForFunction(()=>!document.querySelector("#reader-dialog").open && !documentDismissal && !restoringRoute && dialogUnlockFrame===null && lockedDialogScrollY===null);
  await on(page);

  phase="landscape fullscreen containment";
  await page.setViewportSize({width:667,height:375});
  await page.evaluate(()=>{
    Object.defineProperty(Element.prototype,"requestFullscreen",{value:undefined,configurable:true});
    Object.defineProperty(Element.prototype,"webkitRequestFullscreen",{value:undefined,configurable:true});
  });
  for (const view of ["terminal","constellation"]) {
    await changeView(page,view);await page.locator("#view-fullscreen").click();
    await page.waitForSelector("main.view-fullscreen-fallback");await worldFits(page,`${view} fullscreen`);
    const exit=await hitTarget(page,"#view-fullscreen",`${view} fullscreen exit`);
    await toggle(page);await off(page);
    assert.equal(await page.locator("main.view-fullscreen-fallback").count(),1,"opting out preserves fullscreen working area");
    await toggle(page);await on(page);
    const labTrigger=await openLab(page);
    await page.keyboard.press("/");
    assert.ok(await page.evaluate(()=>document.querySelector("#halloween-lab").contains(document.activeElement)),"archive search shortcut does not steal focus from the horror lab");
    await page.keyboard.press("Escape");await closedLab(page,labTrigger);
    assert.equal(await page.locator("main.view-fullscreen-fallback").count(),1,"one Escape closes the horror lab and preserves archive fullscreen");
    await exit.click();
    await page.waitForSelector("main.view-fullscreen-fallback",{state:"hidden"});
  }

  phase="static pages with immersive world";
  await page.setViewportSize({width:320,height:844});
  await page.goto(new URL("research/2024/",base).href);
  const reference=await page.locator('a[href^="/reference/"]').first().getAttribute("href");
  assert.ok(reference,"generated collection has an archived reference link");
  for (const route of ["reuse.html","research/","research/2024/","security/",reference,"404.html"]) {
    phase=`static immersion ${route}`;
    await page.goto(new URL(route,base).href);await worldFits(page,phase);
    assert.ok(await page.locator("main h1").isVisible(),`${route}: research heading remains readable`);
    const launcher=await openLab(page);await labFits(page,route);await page.keyboard.press("Escape");await closedLab(page,launcher);
    await toggle(page);await off(page);await page.reload();await page.waitForSelector("#halloween-toggle");await off(page);
    await toggle(page);await on(page);
  }

  phase="standalone and embedded PDF readers";
  const pdfOrigin=new URL("pdf-reader.html",base);pdfOrigin.port=process.env.WEBSEC_READER_PORT||"4174";
  const pdf=new URL("/archived-references/pdf/2024/halloween-immersion-fixture.pdf",base).href;
  await context.route(pdf,route=>route.fulfill({status:200,contentType:"application/pdf",headers:{"access-control-allow-origin":pdfOrigin.origin},body:syntheticPdf()}));
  const standalone=await newPage(context);await standalone.setViewportSize({width:320,height:844});
  const loadedPdf=new URL(pdfOrigin);loadedPdf.searchParams.set("file",pdf);
  await standalone.goto(loadedPdf.href);await standalone.locator(".pdf-page canvas").first().waitFor({state:"visible"});
  await worldFits(standalone,"320px standalone PDF");
  assert.ok(await standalone.locator("#document-scroll").evaluate(node=>node.clientHeight>100),"atmosphere leaves useful PDF reading space");
  assert.ok(await standalone.locator("#text-mode").isEnabled(),"PDF text control remains available");
  await toggle(standalone);await off(standalone);
  assert.ok(await standalone.locator(".pdf-page canvas").first().isVisible(),"opting out leaves the rendered PDF intact");
  await standalone.close();await context.unroute(pdf);
  await page.goto(base);await ready(page);await on(page);
  await page.evaluate(url=>{const frame=document.createElement("iframe");frame.id="immersion-embedded-reader";frame.src=url;document.body.append(frame);},pdfOrigin.href);
  const embedded=page.frameLocator("#immersion-embedded-reader");await embedded.locator(".reader-toolbar").waitFor();
  assert.equal(await embedded.locator("#halloween-world, #halloween-lab, [data-haunt-open]").count(),0,"embedded reader never duplicates immersive effects");
  await page.evaluate(()=>document.querySelector("#immersion-embedded-reader").remove());

  phase="cross-tab opt-out dismisses active lab";
  await page.setViewportSize({width:390,height:844});const launcher=await openLab(page);
  const sibling=await newPage(context);await sibling.goto(new URL("reuse.html",base).href);await on(sibling);
  await toggle(sibling);await off(sibling);await off(page);
  await toggle(sibling);await on(sibling);await on(page);await sibling.close();
  assert.ok(await launcher.isVisible(),"global preference dismissal keeps original page controls");

  for (const [label,config] of [["master disabled",{...campaign,enabled:false}],["expired",{...campaign,endsAt:"2026-10-31T11:59:59Z"}]]) {
    phase=`${label} independent fixture`;
    const disabled=await fixture({viewport:{width:320,height:844}},config);
    try {
      await disabled.addInitScript(({key,origin})=>{
        // Context init scripts also run in the initial opaque about:blank.
        // Seed only the actual same-origin archive document; its storage
        // failures must remain visible to the uncaught-error monitor.
        if (location.origin===origin) localStorage.setItem(key,"on");
      },{key:preference,origin:new URL(base).origin});
      const target=await newPage(disabled);await target.goto(new URL("#desk",base).href);await ready(target);
      assert.equal(await target.evaluate(key=>localStorage.getItem(key),preference),"on",`${label}: inactive-campaign fixture has stored visitor opt-in`);
      await off(target);assert.equal(await target.locator("#halloween-world, #halloween-lab").count(),0,`${label}: no immersive runtime mounts`);
      await (await hitTarget(target,"#desk-query",label)).fill("ordinary-research-still-works");
      assert.equal(await target.locator(".discovery-record").count(),0);
    } finally {await disabled.close();}
  }
  phase="live expiry removes an already-mounted world and lab";
  const timed=await fixture({viewport:{width:390,height:844}});
  try {
    const target=await timed.newPage();await target.clock.install({time:new Date("2026-11-01T23:59:00Z")});
    await target.goto(new URL("reuse.html",base).href);await on(target);await openLab(target);
    await target.clock.fastForward(61000);await off(target);
    assert.ok(await target.locator("main h1").isVisible(),"live seasonal expiry preserves ordinary page content");
  } finally {await timed.close();}
  phase="denied preference storage";
  const denied=await fixture({viewport:{width:320,height:844}});
  try {
    await denied.addInitScript(()=>{
      Object.defineProperty(Storage.prototype,"getItem",{configurable:true,value(){throw new DOMException("blocked","SecurityError");}});
      Object.defineProperty(Storage.prototype,"setItem",{configurable:true,value(){throw new DOMException("blocked","SecurityError");}});
    });
    const target=await newPage(denied);await target.goto(new URL("#desk",base).href);await ready(target);await on(target);
    await toggle(target);await off(target);await changeView(target,"time");await off(target);
    await target.evaluate(()=>dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true})));await off(target);
    await toggle(target);await on(target);await openLab(target);await target.keyboard.press("Escape");
  } finally {await denied.close();}
  for (const asset of ["halloween-world.js","halloween-lab.js"]) {
    phase=`optional ${asset} unavailable`;
    const unavailable=await fixture({viewport:{width:390,height:844}});
    let attempts=0;
    try {
      await unavailable.route(`**/${asset}*`,route=>{attempts++;return route.abort("failed");});
      const target=await newPage(unavailable);await target.goto(new URL("#desk",base).href);await ready(target);
      await target.waitForSelector("#halloween-toggle");
      if (asset==="halloween-lab.js") {
        const launch=target.locator("[data-haunt-open]");
        if (await launch.isVisible() && await launch.isEnabled()) await launch.click();
      }
      await target.waitForLoadState("networkidle");
      assert.ok(attempts>0,`${asset}: optional failure fixture was actually requested`);
      assert.equal(await target.locator("#halloween-lab[open]").count(),0,"failed optional asset leaves no blocking horror dialog");
      await (await hitTarget(target,"#desk-query",`${asset} failure`)).fill("optional-effects-never-block-research");
      assert.equal(await target.locator(".discovery-record").count(),0,"research works when an optional immersive module cannot load");
      await toggle(target);await off(target);
    } finally {await unavailable.close();}
  }
  assert.deepEqual(errors,[],"immersive Halloween workflows produce no uncaught errors");
  console.log("Halloween immersion: moving pixels, motion pauses, ordinary research/reading, fullscreen, six static pages, PDF isolation, storage denial, cross-tab opt-out and live expiry pass");
} catch (error) {
  console.log("HALLOWEEN_IMMERSION_FAILURE "+JSON.stringify({phase,message:error.message,url:page.url()}));
  throw error;
} finally {
  await context.close();await browser.close();
}
