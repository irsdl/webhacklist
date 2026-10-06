// Shared popup contract: genuine outside clicks dismiss the topmost pane;
// inside clicks, selection drags and nested panes keep the right dialog open.
import assert from "node:assert/strict";
import {launchBrowser, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const views = ["evidence","museum","library","time","signals","constellation","terminal","desk","favourites"];
const errors = [];
let checks = 0;
async function outsidePoint(page, id) {
  return page.locator(`#${id}`).evaluate(dialog=>{
    const r=dialog.getBoundingClientRect();
    if(r.left>1) return {x:r.left/2,y:innerHeight/2};
    if(r.top>1) return {x:innerWidth/2,y:r.top/2};
    if(r.right<innerWidth-1) return {x:(r.right+innerWidth)/2,y:innerHeight/2};
    throw Error("No accessible backdrop around "+dialog.id+" "+JSON.stringify({rect:r.toJSON(),width:innerWidth,height:innerHeight,visualScale:visualViewport?.scale,dialogWidth:getComputedStyle(dialog).width}));
  });
}
async function press(page, point, touch) {
  if(touch) await page.touchscreen.tap(point.x,point.y);
  else await page.mouse.click(point.x,point.y);
}
async function centered(page, selector) {
  assert.ok(await page.locator(selector).getAttribute("aria-label"),`${selector} has an accessible name`);
  const error = await page.locator(selector).evaluate(button=>{
    const a=button.getBoundingClientRect(),b=button.querySelector(".close-icon").getBoundingClientRect();
    return {x:Math.abs(a.x+a.width/2-b.x-b.width/2),y:Math.abs(a.y+a.height/2-b.y-b.height/2),width:b.width,height:b.height};
  });
  assert.ok(error.x<=0.5 && error.y<=0.5 && error.width===18 && error.height===18, `${selector} icon is centered: ${JSON.stringify(error)}`);
}
async function toolbarContained(page, kind, touch) {
  const result=await page.locator(`#${kind}-dialog`).evaluate((dialog,{kind,touch})=>{
    const bar=dialog.querySelector(`.${kind}-bar`);
    const actions=dialog.querySelector(`.${kind}-actions`);
    const bounds=bar.getBoundingClientRect();
    const inside=element=>{
      const r=element.getBoundingClientRect();
      return r.left>=bounds.left-1 && r.right<=bounds.right+1 && r.top>=bounds.top-1 && r.bottom<=bounds.bottom+1;
    };
    const controls=[...actions.children].filter(element=>element.getClientRects().length);
    const fixed=[bar.firstElementChild,bar.querySelector("form"),actions].every(inside);
    if(!touch) return {fixed,controls:controls.every(inside),scrolls:actions.scrollWidth<=actions.clientWidth+1};
    actions.scrollLeft=0;
    const first=inside(controls[0]);
    actions.scrollLeft=actions.scrollWidth;
    return {fixed,first,last:inside(controls.at(-1)),scrolls:actions.scrollWidth>actions.clientWidth};
  },{kind,touch});
  assert.ok(result.fixed,`${kind}: title, close button and action strip stay inside popup: ${JSON.stringify(result)}`);
  if(touch) assert.ok(result.first && result.last,`${kind}: first and last actions are reachable by scrolling: ${JSON.stringify(result)}`);
  else assert.ok(result.controls && result.scrolls,`${kind}: all actions fit inside popup: ${JSON.stringify(result)}`);
}
async function exercise(page,id,closeSelector,touch,underlying="") {
  if (process.env.WEBSEC_TEST_DEBUG) console.log(`Popup: ${id}`);
  const pane=page.locator(`#${id}`);
  await pane.waitFor({state:"visible"});
  await centered(page,closeSelector);
  // An empty interior edge is part of the pane, not the backdrop.
  const r=await pane.boundingBox();
  const inside={x:r.x+2,y:r.y+Math.min(r.height/2,80)};
  await press(page,inside,touch);
  assert.ok(await pane.evaluate(el=>el.open), `${id}: interior click does not dismiss`);
  const outside=await outsidePoint(page,id);
  if(!touch) {
    await page.mouse.move(inside.x,inside.y);
    await page.mouse.down();
    await page.mouse.move(outside.x,outside.y,{steps:3});
    await page.mouse.up();
    assert.ok(await pane.evaluate(el=>el.open),`${id}: drag out does not dismiss`);
    await page.mouse.move(outside.x,outside.y);
    await page.mouse.down();
    await page.mouse.move(inside.x,inside.y,{steps:3});
    await page.mouse.up();
    assert.ok(await pane.evaluate(el=>el.open),`${id}: drag in does not dismiss`);
  }
  const hit=await outsidePoint(page,id);
  await press(page,hit,touch);
  await page.waitForFunction(id=>!document.getElementById(id).open,id,{timeout:2500});
  if(underlying) {
    assert.ok(await page.locator(`#${underlying}`).evaluate(el=>el.open), "Only the topmost pane closes");
    assert.ok(await page.evaluate(()=>document.body.classList.contains("document-dialog-open")));
  } else {
    await page.waitForFunction(()=>!document.body.classList.contains("document-dialog-open"));
  }
  checks++;
}
try {
  for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:568}]) {
    if(process.env.WEBSEC_DIALOG_WIDTH && viewport.width !== Number(process.env.WEBSEC_DIALOG_WIDTH)) continue;
    const touch=viewport.width<820;
    const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch && mobileEmulation});
    const page=await context.newPage();
    page.on("pageerror",e=>errors.push(e.message));
    page.on("console",m=>{if(m.type()==="error") errors.push(m.text());});
    await page.goto(`${base}#desk`);
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(()=>!document.querySelector("#boot-screen"));
    const fixture=await page.evaluate(()=>state.items.find(item=>item.pdfPath?.endsWith("kuza55-blogspot-com-cookie-path-traversal.pdf"))?.id);
    assert.ok(fixture,"Real local PDF fixture is present");
    async function record() {
      await page.evaluate(id=>openArtifact(id),fixture);
      await page.waitForSelector("#artifact-dialog[open]");
    }
    for(const view of views) {
      await page.evaluate(view=>setView(view),view);
      await page.locator("#global-search").fill("HTTP");
      await page.waitForSelector("#global-results:not([hidden])");
      await centered(page,"#close-global-results");
      await page.locator("#close-global-results").click();
      await page.locator("#global-search").fill("");
      await page.locator("#global-search").blur();
      for(const appearance of (["desk","time"].includes(view)?["dark","light"]:["dark"])) {
        if (process.env.WEBSEC_TEST_DEBUG) console.log(`Dialogs: ${view}/${appearance} at ${viewport.width}px`);
        if(["desk","time"].includes(view)) await page.locator(`[data-discovery-value="${appearance}"]`).click();
        await page.evaluate(()=>scrollTo({top:180,behavior:"instant"}));
        const startScroll=await page.evaluate(()=>scrollY);
        await record();
        await exercise(page,"artifact-dialog","#artifact-dialog .dialog-close",touch);
        assert.ok(Math.abs(await page.evaluate(()=>scrollY)-startScroll)<2,"Closing restores the reading position");

        await record();
        await page.locator("#open-reader").click();
        await page.waitForSelector("#reader-dialog[open] .archive-warning");
        const readerUrl = page.url();
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowLeft");
        assert.equal(page.url(), readerUrl, "Arrow keys in Markdown do not change articles");
        await page.locator("#reader-theme-toggle").click();
        await toolbarContained(page,"reader",touch);
        await exercise(page,"reader-dialog",".reader-close",touch);
        assert.equal(new URL(page.url()).searchParams.has("reader"),false);
        assert.equal(await page.evaluate(()=>state.readerItem),null);

        await record();
        await page.locator("#open-pdf-reader").click();
        await page.waitForFunction(()=>document.querySelector("#pdf-dialog").open && document.querySelector("#pdf-loading").hidden);
        const pdfUrl = page.url();
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowLeft");
        assert.equal(page.url(), pdfUrl, "Arrow keys in PDF do not change articles");
        if(await page.evaluate(()=>state.pdfUsesInSiteReader)) {
          await page.frameLocator("#pdf-frame").locator("canvas").first().waitFor({state:"visible"});
        } else {
          // Browser-test builds may lack a working native PDF plugin, even
          // when pdfViewerEnabled is true. Check the actual verified-document
          // state: either the frame or its explicit Open PDF fallback is shown.
          assert.ok(await page.evaluate(()=>state.pdfVerified && (
            !document.querySelector("#pdf-frame").hidden || (
              !document.querySelector("#pdf-fallback").hidden &&
              document.querySelector("#pdf-fallback-open").href === document.querySelector("#pdf-new-tab").href
            )
          )), "The verified PDF has a visible viewer or matching Open PDF action");
        }
        await page.locator("#pdf-theme-toggle").click();
        await toolbarContained(page,"pdf",touch);
        await page.locator("#pdf-links-toggle").click();
        await page.waitForSelector("#pdf-links:not([hidden])");
        await centered(page,"#pdf-links-close");
        await page.locator("#pdf-links-close").click();
        assert.ok(await page.locator("#pdf-dialog").evaluate(el=>el.open));
        await exercise(page,"pdf-dialog",".pdf-close",touch);
        assert.equal(await page.locator("#pdf-frame").getAttribute("src"),null);
        assert.equal(await page.evaluate(()=>state.pdfPath),"");
        assert.equal(new URL(page.url()).searchParams.has("pdf"),false);

        await record();
        await page.locator("#report-inaccuracy").click();
        await exercise(page,"report-dialog","#report-dialog .dialog-close",touch,"artifact-dialog");
        await page.locator("#artifact-dialog .dialog-close").click();
        await page.waitForFunction(()=>!document.body.classList.contains("document-dialog-open"));

        await page.evaluate(()=>openSubmissionDialog());
        await exercise(page,"contribute-dialog","#contribute-dialog .dialog-close",touch);
        assert.equal(await page.locator("html").getAttribute("data-view"),view);
      }
    }
    // The close button and Escape remain alternatives to outside dismissal.
    await record();
    await page.locator("#artifact-dialog .dialog-close").click();
    await page.waitForFunction(()=>!document.querySelector("#artifact-dialog").open);
    await record();
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>!document.querySelector("#artifact-dialog").open);
    await context.close();
    console.log(`Dialogs: all 9 themes at ${viewport.width}px pass outside dismissal, inside/drag protection, centered close icons, nested panes and reader cleanup`);
  }
  assert.deepEqual(errors,[]);
  console.log(`Dialog test: ${checks} themed popup checks passed with no browser errors`);
} finally {await browser.close();}
