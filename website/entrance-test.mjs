// Focused contracts for the research entrance and explicit starting-view setting.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {launchBrowser, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const key = "websec-preferred-view-v1";
const errors = [];
let checks = 0;
const axe = await readFile(process.env.AXE_SOURCE, "utf8");
async function ready(page, view) {
  await page.waitForFunction(view => state.view === view && !document.querySelector("#boot-screen") && !restoringRoute && !documentDismissal, view);
  if (view === "desk") await page.waitForSelector("#desk-query");
  checks++;
}
async function enter(control) { await control.focus(); await control.press("Enter"); }
async function settings(page, width) {
  if (width < 821) await enter(page.locator("#mobile-menu"));
  if (!await page.locator("#view-preferences").evaluate(el => el.open)) await enter(page.locator("#view-preferences summary"));
}
async function closeSettings(page, width) {
  if (width < 821) {
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.activeElement.id), "mobile-menu");
  }
}
async function audit(page, label) {
  await page.evaluate(axe);
  const violations = await page.evaluate(() => axe.run(document, {runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
  assert.deepEqual(violations.violations.map(v => ({id:v.id,targets:v.nodes.map(n => n.target)})), [], label);
  checks++;
}
async function capture(page, name) {
  if (process.env.WEBSEC_ENTRANCE_CAPTURE !== "1") return;
  const data = await page.screenshot({type:"png", fullPage:false});
  assert.ok(data.length < 1024 * 1024, "Bounded screenshot");
  console.log("ENTRANCE_CAPTURE " + JSON.stringify({name,width:page.viewportSize().width,height:page.viewportSize().height,data:data.toString("base64")}));
}
try {
  for (const width of [1440,320]) {
    const context = await browser.newContext({viewport:{width,height:width === 320 ? 568 : 1000},isMobile:width === 320 && mobileEmulation,hasTouch:width === 320,reducedMotion:"reduce"});
    // This suite intentionally performs many full-page navigations. Disable
    // optional idle prefetch so WebKit does not report cancelled background
    // requests as access-control page errors unrelated to entrance behaviour.
    await context.addInitScript(() => Object.defineProperty(navigator, "connection", {value:{saveData:true}, configurable:true}));
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/archived-references/md/**", route => route.fulfill({contentType:"text/plain",body:"# First-party entrance test\n\nA synthetic reader document.\n\n## Reading\n\nDirect links keep their chosen view."}));
    await page.goto(base);
    await ready(page,"evidence");
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null);
    assert.ok(await page.locator("#find-research").isVisible());
    assert.ok(await page.locator("#find-research").evaluate(el => {const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));
    await capture(page, `home-${width}`);
    await enter(page.locator("#find-research"));
    await ready(page,"desk");
    assert.equal(await page.evaluate(() => document.activeElement.id),"desk-query");
    await page.evaluate(() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    // Progressive collection loading replaces this form. Resolve the current
    // input inside the measurement task rather than keeping a detached handle.
    const searchGeometry=await page.evaluate(()=>{
      const el=document.getElementById("desk-query");
      const r=el.getBoundingClientRect(),header=document.querySelector(".topbar").getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,headerBottom:header.bottom,height:innerHeight,left:r.left,right:r.right,width:innerWidth};
    });
    assert.ok(searchGeometry.top>=searchGeometry.headerBottom-1&&searchGeometry.bottom<=searchGeometry.height&&searchGeometry.left>=0&&searchGeometry.right<=searchGeometry.width,
      "Entrance search focus is fully visible below the measured sticky header: "+JSON.stringify(searchGeometry));
    assert.equal(new URL(page.url()).hash,"#desk");
    if (width === 320) assert.match(await page.locator("#mobile-menu").getAttribute("aria-label"),/Current view: Research Desk/);
    await page.goBack(); await ready(page,"evidence");
    await page.goForward(); await ready(page,"desk");
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null,"Visiting Desk does not save it");
    await settings(page,width);
    // Closed settings skip their fields; open settings put the select and
    // reset action directly after their summary in sequential keyboard order.
    await enter(page.locator("#view-preferences summary"));
    await page.keyboard.press("Tab");
    assert.ok(await page.locator('.nav-item[data-view="evidence"]').evaluate(el=>el===document.activeElement));
    await enter(page.locator("#view-preferences summary"));
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(()=>document.activeElement.id),"preferred-view");
    // Use actual keyboard events to choose Research Desk in the native select.
    await page.locator("#preferred-view").focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await page.waitForFunction(key => localStorage.getItem(key)==="desk",key);
    assert.equal(await page.evaluate(() => document.activeElement.id),"reset-preferred-view");
    await page.keyboard.press("Tab");
    assert.ok(await page.locator('.nav-item[data-view="evidence"]').evaluate(el=>el===document.activeElement));
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(()=>document.activeElement.id),"reset-preferred-view");
    if (width === 320) assert.equal(await page.locator("#mobile-menu").getAttribute("aria-expanded"),"true","Settings keep the drawer open");
    await audit(page,`starting view controls/${width}`);
    await capture(page,`settings-${width}`);
    await closeSettings(page,width);
    await page.goto(base); await ready(page,"desk");
    await page.reload(); await ready(page,"desk");
    await page.goto(`${base}#library`); await ready(page,"library");
    assert.equal(await page.evaluate(key => localStorage.getItem(key),key),"desk","Explicit routes do not rewrite preference");
    await page.goto(`${base}#read`); await ready(page,"favourites");
    assert.equal(await page.evaluate(() => state.savedMode),"read");
    await page.goto(`${base}#desk`); await ready(page,"desk");
    const id=await page.evaluate(() => state.items.find(item=>item.mdPath).id);
    await page.goto(`${base}?reader=${encodeURIComponent(id)}#museum/${encodeURIComponent(id)}`);
    await ready(page,"museum");
    await page.waitForSelector("#reader-dialog[open] #reader-content h2");
    await page.reload(); await ready(page,"museum");
    await page.waitForSelector("#reader-dialog[open] #reader-content h2");
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>!document.querySelector("dialog[open]")&&!documentDismissal&&!restoringRoute&&!history.state?.archiveDocument);
    await ready(page,"museum");
    await page.goForward(); await page.waitForSelector("#reader-dialog[open] #reader-content h2");
    await page.goto(`${base}?reader=${encodeURIComponent(id)}`); await ready(page,"evidence");
    await page.waitForSelector("#reader-dialog[open] #reader-content h2");
    await page.goto(base); await ready(page,"desk");
    await settings(page,width);
    await enter(page.locator("#reset-preferred-view"));
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
    assert.equal(await page.locator("#preferred-view").inputValue(),"");
    await closeSettings(page,width);
    await page.goto(base); await ready(page,"evidence");
    await page.reload(); await ready(page,"evidence");
    for (const malformed of ["__proto__","null",'{"view":"desk"}',"x".repeat(10000)]) {
      await page.evaluate(({key,malformed})=>localStorage.setItem(key,malformed),{key,malformed});
      await page.goto(base); await ready(page,"evidence");
    }
    await page.evaluate(key=>localStorage.removeItem(key),key);
    // A bare-home history entry remembers its resolved view even if the visitor
    // changes the next-visit preference in the meantime.
    await page.goto(base); await ready(page,"evidence");
    await settings(page,width);
    await page.locator("#preferred-view").selectOption("desk");
    await closeSettings(page,width);
    await enter(page.locator("#find-research")); await ready(page,"desk");
    await page.goBack(); await ready(page,"evidence");
    await page.goForward(); await ready(page,"desk");
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"No horizontal overflow");
    if (width===320) {
      await settings(page,width);
      await page.locator("#close-mobile-menu").focus();
      await page.keyboard.press("Shift+Tab");
      assert.ok(await page.locator("#concept-sidebar").evaluate(el=>el.contains(document.activeElement)),"Reverse Tab stays in drawer");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(()=>document.activeElement.id),"close-mobile-menu","Last control wraps to first");
      await closeSettings(page,width);
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(()=>document.activeElement.id),"find-research","Find research follows Themes in mobile keyboard order");
    }
    await audit(page,`entrance/${width}`);
    await context.close();
    console.log(`Entrance: ${width}px first visit, keyboard shortcut/settings, saved preference/reload/reset, malformed storage, explicit view/reader, Back/Forward and axe pass`);
  }
  // Short-viewport geometry represents the space available at 400% desktop
  // zoom; this focused check does not claim to change actual browser zoom.
  {
    const context=await browser.newContext({viewport:{width:360,height:250},reducedMotion:"reduce"});
    const page=await context.newPage();
    await page.goto(base); await ready(page,"evidence");
    await enter(page.locator("#find-research")); await ready(page,"desk");
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(()=>document.activeElement.id),"desk-query");
    const geometry=await page.evaluate(()=>{
      const el=document.getElementById("desk-query");
      const r=el.getBoundingClientRect(),header=document.querySelector(".topbar").getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,headerBottom:header.bottom,viewportHeight:innerHeight,centerIsQuery:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===el};
    });
    assert.ok(geometry.top>=geometry.headerBottom-1&&geometry.bottom<=geometry.viewportHeight&&geometry.centerIsQuery,JSON.stringify(geometry));
    await settings(page,360);
    await page.locator("#preferred-view").focus(); await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(()=>document.activeElement.id),"reset-preferred-view");
    await closeSettings(page,360);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await audit(page,"360x250 entrance and settings");
    console.log("Short viewport entrance: "+JSON.stringify(geometry));
    await context.close();
  }
  // Denied reads and writes are distinct from malformed stored values.
  for (const deny of ["all","set","remove"]) {
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.addInitScript(({key,deny})=>{
      if (deny !== "all") localStorage.setItem(key,"desk");
      for(const method of deny === "all" ? ["getItem","setItem","removeItem"] : [deny === "set" ? "setItem" : "removeItem"]) {
        Storage.prototype[method]=()=>{throw new DOMException("Test denied storage","SecurityError");};
      }
    },{key,deny});
    await page.goto(base); await ready(page,deny === "all" ? "evidence" : "desk");
    await settings(page,1440);
    if(deny === "remove") await enter(page.locator("#reset-preferred-view"));
    else await page.locator("#preferred-view").selectOption("library");
    assert.match(await page.locator("#preferred-view-status").textContent(),/could not be changed/);
    assert.equal(await page.locator("#preferred-view").inputValue(),deny === "all" ? "" : "desk");
    await page.reload(); await ready(page,deny === "all" ? "evidence" : "desk");
    await context.close();
  }
  assert.deepEqual(errors,[]);
  console.log(`Entrance contracts: ${checks} readiness/audit checks passed; denied reads, writes and removal pass`);
} finally {await browser.close();}
