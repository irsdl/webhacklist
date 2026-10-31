import assert from "node:assert/strict";
import {launchBrowser, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const views = ["evidence", "museum", "library", "signals", "constellation", "desk", "time", "terminal", "favourites"];
const errors = [];
async function settled(page, view, year) {
  try {
    await page.waitForFunction(({view,year}) => state.view === view && selectedArchiveYear() === year && !restoringRoute && !documentDismissal && !document.querySelector('dialog[open]'), {view,year});
  } catch (error) {
    console.error("Year navigation did not settle", {expected:{view,year},actual:await page.evaluate(() => ({
      url:location.href,view:state.view,year:selectedArchiveYear(),entry:history.state,routeRevision,restoringRoute,
      dismissing:Boolean(documentDismissal),dialogs:[...document.querySelectorAll('dialog[open]')].map(dialog => dialog.id),
      pendingCollections:[...collectionRequests.keys()],loadedCollections:[...loadedCollections],
      pendingBoardResize:investigationResizeFrame,lockedY:lockedDialogScrollY,unlockFrame:dialogUnlockFrame,
      attempt:window.yearNavigationAttempt,events:window.yearNavigationEvents
    }))});
    throw error;
  }
}
// Firefox's Playwright Page.reload can insert a new entry with null state:
// https://github.com/microsoft/playwright/issues/22640
// Use the browser's native reload and verify that the current entry survives.
async function reload(page) {
  await page.evaluate(() => ensureAllCollections());
  const before = await page.evaluate(() => ({length:history.length,entry:history.state}));
  await Promise.all([page.waitForEvent("load"), page.evaluate(() => location.reload())]);
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  assert.deepEqual(await page.evaluate(() => ({length:history.length,entry:history.state})),before);
}
async function choose(page, view, year) {
  await page.evaluate(({view,year}) => {
    window.yearNavigationAttempt = {view,year,before:{url:location.href,view:state.view,year:selectedArchiveYear(),routeRevision,restoringRoute,pendingCollections:[...collectionRequests.keys()]}};
    if (!window.yearNavigationEvents) {
      window.yearNavigationEvents = [];
      const record = event => {
        const control = event.target.closest('[data-year],[data-signal-year],[data-saved-year],#desk-year,#time-jump,#terminal-collection');
        if (!control) return;
        const row = {type:event.type,time:performance.now(),x:event.clientX,y:event.clientY,
          target:{tag:event.target.tagName,id:event.target.id,class:event.target.className},
          control:{tag:control.tagName,id:control.id,year:control.dataset.year || control.dataset.signalYear || control.dataset.savedYear || control.value,rect:control.getBoundingClientRect().toJSON()},
          beforeBubble:{url:location.href,year:selectedArchiveYear(),routeRevision,pendingCollections:[...collectionRequests.keys()]}};
        window.yearNavigationEvents.push(row);
        if (window.yearNavigationEvents.length > 12) window.yearNavigationEvents.shift();
        queueMicrotask(() => { row.afterBubble = {url:location.href,year:selectedArchiveYear(),routeRevision,pendingCollections:[...collectionRequests.keys()]}; });
      };
      for (const type of ['pointerdown','pointerup','click','change']) document.addEventListener(type,record,{capture:true});
    }
  },{view,year});
  if (view === "desk") await page.selectOption("#desk-year", year);
  else if (view === "time") await page.selectOption("#time-jump", year);
  else if (view === "terminal") await page.selectOption("#terminal-collection", year);
  else {
    const control = page.locator(`[${view === "signals" ? "data-signal-year" : view === "favourites" ? "data-saved-year" : "data-year"}="${year}"]`);
    // A horizontal year rail can still be scrolling after the previous choice.
    // Finish the normal pre-click scroll and observe its hit target across three
    // frames before issuing the single real click; no selection is retried.
    await control.scrollIntoViewIfNeeded();
    const stable = await control.evaluate(async node => {
      let previous = "", frames = 0; const deadline = performance.now() + 3000;
      do {
        await new Promise(requestAnimationFrame);
        const rect = node.getBoundingClientRect(),position = [rect.left,rect.top,rect.width,rect.height].join(","),hit = document.elementFromPoint(rect.left + rect.width/2,rect.top + rect.height/2);
        frames = node.isConnected && hit && (node === hit || node.contains(hit)) && position === previous ? frames + 1 : 0;
        previous = position;
        if (frames >= 3) return true;
      } while (performance.now() < deadline);
      return false;
    });
    await control.evaluate(node => { window.yearNavigationAttempt.control = {tag:node.tagName,id:node.id,
      year:node.dataset.year || node.dataset.signalYear || node.dataset.savedYear,
      connected:node.isConnected,rect:node.getBoundingClientRect().toJSON(),routeRevision,pendingCollections:[...collectionRequests.keys()]}; });
    if (!stable) console.error("Year control did not stabilize",await page.evaluate(() => ({attempt:window.yearNavigationAttempt,events:window.yearNavigationEvents})));
    assert.equal(stable,true,`${view} ${year}: year control settles before its real click`);
    await control.click();
  }
  await settled(page, view, view === "favourites" && year === "2023" ? "2023,2024" : year);
}
try {
  for (const width of [1440, 390]) {
    for (const view of views) {
      const context = await browser.newContext({viewport:{width,height:900},hasTouch:width<820,isMobile:width<820 && mobileEmulation});
      const page = await context.newPage();
      page.on("pageerror", e => errors.push(`${view} at ${width}px: ${e.message}`));
      await page.route("**/before-archive", route => route.fulfill({contentType:"text/html",body:"<!doctype html><title>Previous site</title><p>Previous page</p>"}));
      await page.route("**/archived-references/md/**", route => route.fulfill({contentType:"text/plain",body:"# Year navigation fixture\n\nA benign local reader document."}));
      await page.goto(new URL("before-archive",base).href);
      await page.goto(`${base}#${view}`);
      await page.waitForSelector("#app-shell:not([hidden])");
      await page.waitForFunction(() => !document.querySelector("#boot-screen"));
      if (["desk","time"].includes(view)) await page.waitForSelector(".discovery-record");
      if (view === "favourites") await page.evaluate(async () => {
        await ensureAllCollections();
        for (const year of ["2024", "2023"]) setFavouriteState(itemsForYear(year)[0], true);
      });
      const initial = await page.evaluate(() => selectedArchiveYear());
      const initialUrl = page.url();
      await choose(page,view,"2024");
      const selectedUrl = page.url();
      assert.equal(new URL(selectedUrl).searchParams.get("year"),"2024");
      const length = await page.evaluate(() => history.length);
      if (view !== "favourites") {
        await choose(page,view,"2024");
        assert.equal(await page.evaluate(() => history.length),length,"Reselecting the current year does not add a Back step");
      }
      await choose(page,view,"2023");
      const second = view === "favourites" ? "2023,2024" : "2023";
      await page.goBack();
      await settled(page,view,"2024");
      assert.equal(page.url(),selectedUrl);
      await page.goBack();
      await settled(page,view,initial);
      assert.equal(page.url(),initialUrl,"Back returns to the original collection before leaving the archive");
      await page.goForward();
      await settled(page,view,"2024");
      await page.goForward();
      await settled(page,view,second);
      const id = await page.evaluate(() => itemsForYear("2023").find(item => item.mdPath).id);
      await page.evaluate(id => openArtifact(id),id);
      await page.locator("#open-reader").click();
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      assert.equal(new URL(page.url()).searchParams.get("year"),second,"Article share links retain the selected collection");
      await reload(page);
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      await page.waitForFunction(() => !document.querySelector("#boot-screen"));
      await page.goBack();
      await settled(page,view,second);
      await page.goBack();
      await settled(page,view,"2024");
      await reload(page);
      await page.waitForFunction(() => !document.querySelector("#boot-screen"));
      await settled(page,view,"2024");
      assert.equal(page.url(),selectedUrl,"A year deep link survives reload");
      // Visiting another theme must not overwrite the previous theme's year.
      await page.evaluate(() => setView("library"));
      await page.goBack();
      await settled(page,view,"2024");
      if (view === "terminal") assert.ok((await page.locator("#terminal-output").innerText()).includes("2024"));
      if (view === "time") assert.equal(await page.locator("#time-jump").inputValue(),"2024");
      // Finish background collection loading before tearing down the page.
      await page.evaluate(() => ensureAllCollections());
      await context.close();
      console.log(`Year history: ${view} at ${width}px passes tabs/selection, Back/Forward, article return, reload and theme return`);
    }
  }
  // A slow old selection must not undo a later navigation.
  const page = await browser.newPage();
  await page.goto(`${base}#evidence`);
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  await page.evaluate(() => {
    const original = ensureCollection;
    ensureCollection = async year => {
      if (year === "2024") await new Promise(resolve => { window.releaseYearLoad = resolve; });
      return original(year);
    };
    window.pendingYear = selectArchiveYear("2024");
  });
  await page.waitForFunction(() => Boolean(window.releaseYearLoad));
  await page.evaluate(() => setView("museum"));
  await page.evaluate(async () => { window.releaseYearLoad(); await window.pendingYear; });
  assert.equal(await page.locator("html").getAttribute("data-view"),"museum");
  assert.equal(new URL(page.url()).searchParams.has("year"),false);
  await page.close();
  assert.deepEqual(errors,[]);
  console.log("Year history: delayed selection cannot replace a newer route; no browser errors");
} finally { await browser.close(); }
