// Functional and popup tests against the real local archive. No external requests
// are needed: the mobile PDF checks reproduce production origins with local files.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {launchBrowser} from "./browser-test.mjs";
import {pdfjsReleaseFiles} from "./pdfjs-release-build.mjs";
const browser = await launchBrowser();
const url = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:8000/website/";
const views = ["desk", "time"];
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(`${message.text()} (${message.location().url})`); });
const action = (name, value) => `[data-discovery-action="${name}"]${value === undefined ? "" : `[data-discovery-value="${value}"]`}`;
async function go(view) {
  await page.goto(`${url}#${view}`);
  await page.waitForSelector(".discovery-record");
  await page.waitForFunction(() => loadedCollections.size === YEAR_FILES.length);
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
}
async function closeDialog(id) {
  await page.evaluate((id) => new Promise((resolve) => {
    const dialog = document.getElementById(id);
    if (!dialog.open) return resolve();
    dialog.addEventListener("close", resolve, { once: true });
    dialog.close();
  }), id);
}
async function displayedItems(selector = "[data-discovery-record]") {
  return page.locator(selector).evaluateAll((elements) => elements.map((element) => {
    const item = state.items.find((item) => item.id === element.dataset.discoveryRecord);
    return { id: item.id, year: item.year, topic: item.topic, rank: item.rank, preliminary: item.preliminary, read: item.read, favourite: item.favourite };
  }));
}
try {
  for (const view of views) {
    await go(view);
    assert.equal(await page.locator(".nav-item[aria-current=page]").getAttribute("data-view"), view);
    if (view === "desk") await page.selectOption("#desk-video", "with");
    const markers = await page.locator("[data-discovery-record]").evaluateAll((cards) => cards.map((card) => {
      const item = state.items.find((item) => item.id === card.dataset.discoveryRecord);
      const confirmed = item.videos?.some((video) => video.confidence === "confirmed");
      const badge = card.querySelector(".record-video");
      return { hasVideo:Boolean(item.videos?.length), hasBadge:Boolean(badge), potential:badge?.classList.contains("is-potential") || false, expectedPotential:Boolean(item.videos?.length) && !confirmed, label:card.querySelector("[data-artifact]").getAttribute("aria-label") };
    }));
    assert.ok(markers.some((item) => item.hasVideo), `${view} has recorded fixtures`);
    assert.ok(markers.every((item) => item.hasBadge === item.hasVideo && item.potential === item.expectedPotential));
    assert.ok(markers.filter((item) => item.hasVideo).every((item) => item.label.includes("recording")));
  }
  await go("desk");
  assert.equal(await page.locator("[data-discovery-record]").count(), 20);
  const firstPage = await displayedItems();
  await page.locator(action("desk-next")).click();
  const secondPage = await displayedItems();
  assert.equal(secondPage.length, 20);
  assert.ok(secondPage.every((item) => !firstPage.some((first) => first.id === item.id)));
  await page.locator(action("desk-prev")).click();
  assert.deepEqual(await displayedItems(), firstPage);
  await page.selectOption("#desk-video", "with");
  assert.equal(await page.locator(".discovery-record .record-video").count(), await page.locator(".discovery-record").count());
  assert.equal(await page.evaluate(() => deskFilteredRecords().length), await page.evaluate(() => state.items.filter((item) => item.videos?.length).length));
  await page.locator(action("desk-next")).click();
  assert.equal(await page.locator(".discovery-record .record-video").count(), await page.locator(".discovery-record").count());
  await page.selectOption("#desk-video", "without");
  assert.equal(await page.locator(".discovery-record .record-video").count(), 0);
  await page.locator(action("desk-reset")).click();
  assert.equal(await page.locator("#desk-video").inputValue(), "all");
  await page.selectOption("#desk-year", "2024");
  await page.selectOption("#desk-standing", "winner");
  assert.equal(await page.locator("[data-discovery-record]").count(), 10);
  assert.ok((await displayedItems()).every((item) => item.year === "2024" && item.rank));
  await page.selectOption("#desk-video", "with");
  const combined = await page.evaluate(() => deskFilteredRecords());
  assert.ok(combined.length && combined.every((item) => item.year === "2024" && item.rank && item.videos?.length));
  await page.selectOption("#desk-topic", "HTTP");
  assert.ok((await displayedItems()).every((item) => item.topic === "HTTP"));
  await page.locator("#desk-query").fill("no-such-research-theme-regression");
  assert.equal(await page.locator("[data-discovery-record]").count(), 0);
  await page.locator(action("desk-reset")).click();
  await page.locator("#desk-author").fill("James Kettle");
  assert.ok(await page.locator("[data-discovery-record]").count());
  assert.ok((await page.locator(".discovery-credit").allTextContents()).every((text) => text.includes("James Kettle")));
  await page.locator(action("desk-reset")).click();
  await page.selectOption("#desk-sort", "title");
  const titles = await page.locator(".discovery-record h3").allTextContents();
  // ICU versions collate punctuation differently. Compare with the reader's
  // browser locale, rather than Node's separate collation implementation.
  assert.deepEqual(titles, await page.evaluate(titles => [...titles].sort((a, b) => a.localeCompare(b)), titles));
  await page.locator(action("desk-compact")).click();
  assert.equal(await page.locator(".discovery-summary:visible").count(), 0);
  const savedId = (await displayedItems())[0].id;
  await page.locator(`[data-favourite="${savedId}"]`).click();
  await page.locator(action("mark", savedId)).click();
  await page.selectOption("#desk-read", "read");
  assert.ok((await displayedItems()).every((item) => item.read));
  assert.ok((await displayedItems()).some((item) => item.id === savedId && item.favourite));
  await go("desk");
  assert.ok(await page.evaluate((id) => state.items.some((item) => item.id === id && item.read && item.favourite), savedId));
  console.log("Desk: pagination, combined filters, author search, sorting, video filtering and badges, empty/reset, density, and saved/read persistence pass");

  await go("time");
  assert.equal(await page.locator(".time-stop").first().getAttribute("id"), "time-2006");
  await page.selectOption("#time-order", "newest");
  assert.equal(await page.locator(".time-stop").first().getAttribute("id"), "time-2026-ai");
  await page.selectOption("#time-topic", "Crypto");
  assert.ok((await displayedItems()).every((item) => item.topic === "Crypto"));
  await page.selectOption("#time-jump", "2016-17");
  assert.equal(await page.evaluate(() => document.activeElement.id), "time-2016-17");
  assert.equal(new URL(page.url()).hash, "#time");
  await page.selectOption("#time-topic", "all");
  await page.locator(action("time-expand", "2025")).click();
  assert.equal(await page.locator("#time-2025 [data-discovery-record]").count(), await page.evaluate(() => state.items.filter((item) => item.year === "2025").length));
  await page.locator(action("time-expand", "2025")).click();
  assert.equal(await page.locator("#time-2025 [data-discovery-record]").count(), 3);
  console.log("Time Machine: chronology, subject comparisons, year jumps, expansion and collapse pass");

  for (const view of views) {
    await go(view);
    for (const theme of ["light", "dark"]) {
      await page.locator(action("theme", theme)).click();
      const palette = await page.evaluate(() => ({ accent:getComputedStyle(document.documentElement).getPropertyValue("--view-accent").trim(), paper:getComputedStyle(document.body).backgroundColor }));
      await page.locator(".discovery-record [data-artifact]").first().click();
      await page.waitForSelector("#artifact-dialog[open]");
      assert.deepEqual(await page.locator("#artifact-dialog").evaluate((dialog) => ({accent:getComputedStyle(dialog).getPropertyValue("--dialog-theme").trim(),paper:getComputedStyle(dialog).backgroundColor})), palette);
      await page.locator("#report-inaccuracy").click();
      assert.deepEqual(await page.locator("#report-dialog").evaluate((dialog) => ({accent:getComputedStyle(dialog).getPropertyValue("--dialog-theme").trim(),paper:getComputedStyle(dialog).backgroundColor})), palette);
      await closeDialog("report-dialog");
      await closeDialog("artifact-dialog");
      await page.locator(".topbar [data-contribute]").click();
      assert.deepEqual(await page.locator("#contribute-dialog").evaluate((dialog) => ({accent:getComputedStyle(dialog).getPropertyValue("--dialog-theme").trim(),paper:getComputedStyle(dialog).backgroundColor})), palette);
      await closeDialog("contribute-dialog");
      await page.locator("#global-search").fill("cache");
      await page.locator("#global-results:not([hidden])").waitFor();
      assert.equal(await page.locator("#global-results").evaluate((element) => getComputedStyle(element).backgroundColor), await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--panel").trim()).then((color) => page.evaluate((color) => { const el=document.createElement("span"); el.style.color=color; document.body.append(el); const rgb=getComputedStyle(el).color; el.remove(); return rgb; }, color)));
      await page.locator("#close-global-results").click();
    }
    await page.reload();
    await page.waitForSelector(".discovery-record");
    assert.equal(await page.locator("html").getAttribute("data-discovery-theme"), "dark");
    await page.setViewportSize({width:390,height:844});
    await page.locator("#mobile-menu").click();
    await page.locator(`.nav-item[data-view="${view}"]`).click();
    assert.equal(await page.locator("#mobile-menu").getAttribute("aria-expanded"), "false");
    await page.setViewportSize({width:1440,height:1000});
  }
  console.log("Overlays: record/report/submission/search palettes match all 4 page palettes; appearance persistence and mobile navigation pass");

  await go("time");
  const shared = await page.evaluate(() => {
    state.readingTheme = "light";
    const item = state.items.find((item) => item.mdPath);
    return {url:documentShareUrl(item, "reader"),title:item.title};
  });
  await page.goto(shared.url);
  await page.waitForSelector("#reader-dialog[open] .archive-warning");
  assert.equal(await page.locator("#reader-title").innerText(), shared.title);
  assert.equal(await page.locator("#reader-dialog").getAttribute("data-reading-theme"), "light");
  assert.equal(await page.locator("html").getAttribute("data-view"), "time");
  await closeDialog("reader-dialog");
  const recoveryContext = await browser.newContext();
  await recoveryContext.addInitScript(() => Object.defineProperty(navigator, "connection", {value:{saveData:true}, configurable:true}));
  let failCollection = true;
  await recoveryContext.route("**/data/collections/2024.json*", (route) => failCollection
    ? route.fulfill({status:503,body:"Simulated temporary failure"}) : route.continue());
  const recovery = await recoveryContext.newPage();
  await recovery.goto(`${url}#desk`);
  await recovery.waitForSelector('[data-discovery-action="retry"]');
  await recovery.waitForFunction(() => !document.querySelector("#boot-screen"));
  failCollection = false;
  await recovery.locator('[data-discovery-action="retry"]').click();
  await recovery.waitForFunction(() => loadedCollections.size === YEAR_FILES.length);
  assert.equal(await recovery.locator('[data-discovery-action="retry"]').count(), 0);
  await recoveryContext.close();
  console.log("Resilience: shared readers restore the view/theme and a failed collection recovers through Retry");

  // Keep one real shard unresolved while other requests settle. Collection
  // scope, rather than the speed of the whole archive, controls Desk readiness.
  const progressiveContext = await browser.newContext();
  await progressiveContext.addInitScript(() => Object.defineProperty(navigator, "connection", {value:{saveData:true}, configurable:true}));
  let releaseSlow;
  const slow = new Promise(resolve => { releaseSlow = resolve; });
  let failOther = true, failSelected = true;
  await progressiveContext.route("**/data/collections/2006.json*", async route => { await slow; await route.continue(); });
  await progressiveContext.route("**/data/collections/2007.json*", route => failOther
    ? route.fulfill({status:503,body:"Simulated unrelated failure"}) : route.continue());
  await progressiveContext.route("**/data/collections/2023.json*", route => failSelected
    ? route.fulfill({status:503,body:"Simulated selected failure"}) : route.continue());
  const progressive = await progressiveContext.newPage();
  const progressiveErrors = [];
  progressive.on("pageerror", error => progressiveErrors.push(error.message));
  await progressive.goto(`${url}?year=2024#desk`);
  await progressive.waitForSelector(".discovery-record");
  await progressive.evaluate(() => { void ensureCollection("2006").catch(() => {}); });
  await progressive.waitForFunction(() => !document.querySelector("#boot-screen") && collectionRequests.has("2006"));
  assert.ok((await progressive.locator(".discovery-meta").allTextContents()).every(text => text.includes("2024")));
  assert.match(await progressive.locator("#desk-results").innerText(), /2024 collection fully loaded/);
  assert.equal(await progressive.locator('[data-discovery-action="retry"]').count(), 0);
  assert.equal(await progressive.evaluate(() => loadedCollections.size), 1, "selected Desk does not eagerly request every shard");

  await progressive.selectOption("#desk-year", "all");
  await progressive.waitForSelector('[data-discovery-action="retry"]');
  assert.ok(await progressive.locator(".discovery-record").count(), "loaded records remain available after an unrelated failure");
  assert.match(await progressive.locator("#desk-results").innerText(), /Results are incomplete.*Loading/s);
  assert.doesNotMatch(await progressive.locator("#desk-results").innerText(), /Results are complete/);
  await progressive.locator("#desk-query").fill("no-such-research-theme-progressive");
  assert.match(await progressive.locator("#desk-results").innerText(), /No matching records in the loaded collections yet/);
  await progressive.locator("#desk-query").fill("cache");
  assert.match(await progressive.locator("#desk-result-count").innerText(), /results so far/);
  const sourceDetails = progressive.locator('.discovery-record').first().locator('[data-artifact]').nth(1);
  const focusedRecord = await sourceDetails.getAttribute("data-artifact");
  await sourceDetails.focus();
  await progressive.evaluate(() => discoveryRefresh());
  assert.deepEqual(await progressive.evaluate(() => ({id:document.activeElement.dataset.artifact,text:document.activeElement.textContent})), {id:focusedRecord,text:await progressive.locator('.discovery-record').first().locator('[data-artifact]').nth(1).textContent()}, "refresh keeps the focused Sources & details button rather than the other artifact button");

  // A failed selected collection must show no stale records from other years.
  await progressive.selectOption("#desk-year", "2023");
  await progressive.waitForFunction(() => discoveryState.errors.has("2023"));
  assert.equal(await progressive.locator(".discovery-record").count(), 0);
  assert.match(await progressive.locator("#desk-results").innerText(), /Could not load 2023/);
  failSelected = false;
  await progressive.locator('[data-discovery-action="retry"]').click();
  await progressive.waitForFunction(() => loadedCollections.has("2023"));
  assert.match(await progressive.locator("#desk-results").innerText(), /2023 collection fully loaded/);
  assert.equal(await progressive.locator('[data-discovery-action="retry"]').count(), 0, "unrelated failures do not contaminate selected completeness");

  await progressive.selectOption("#desk-year", "all");
  await progressive.waitForSelector('[data-discovery-action="retry"]');
  await progressive.locator("#desk-query").focus();
  await progressive.locator("#desk-query").evaluate(input => input.setSelectionRange(1, 3, "backward"));
  releaseSlow();
  await progressive.waitForFunction(() => loadedCollections.has("2006") && !discoveryState.requests.has("2006"));
  assert.deepEqual(await progressive.locator("#desk-query").evaluate(input => ({focused:document.activeElement === input,value:input.value,start:input.selectionStart,end:input.selectionEnd,direction:input.selectionDirection})), {focused:true,value:"cache",start:1,end:3,direction:"backward"}, "background shard refresh preserves query and caret selection");
  failOther = false;
  await progressive.locator('[data-discovery-action="retry"]').click();
  await progressive.waitForFunction(() => loadedCollections.size === YEAR_FILES.length);
  assert.match(await progressive.locator("#desk-results").innerText(), /All collections loaded. Results are complete/);
  assert.doesNotMatch(await progressive.locator("#desk-result-count").innerText(), /so far/);
  assert.deepEqual(progressiveErrors, []);
  await progressiveContext.close();

  // Direct selected-year failure exposes the Desk controls and Retry, rather
  // than turning a recoverable shard failure into an archive boot failure.
  const selectedContext = await browser.newContext();
  let selectedFailure = true;
  await selectedContext.route("**/data/collections/2024.json*", route => selectedFailure
    ? route.fulfill({status:503,body:"Simulated direct selected failure"}) : route.continue());
  const selected = await selectedContext.newPage();
  await selected.goto(`${url}?year=2024#desk`);
  await selected.waitForSelector('#desk-year');
  await selected.waitForFunction(() => !document.querySelector("#boot-screen"));
  assert.equal(await selected.locator("#desk-year").inputValue(), "2024");
  assert.equal(await selected.locator(".discovery-record").count(), 0);
  assert.match(await selected.locator("#desk-results").innerText(), /Could not load 2024/);
  selectedFailure = false;
  await selected.locator('[data-discovery-action="retry"]').click();
  await selected.waitForFunction(() => loadedCollections.has("2024"));
  assert.match(await selected.locator("#desk-results").innerText(), /2024 collection fully loaded/);
  await selectedContext.close();

  const timelineContext = await browser.newContext();
  await timelineContext.addInitScript(() => Object.defineProperty(navigator, "connection", {value:{saveData:true}, configurable:true}));
  let releaseTimeline;
  const timelineSlow = new Promise(resolve => { releaseTimeline = resolve; });
  let timelineFailure = true;
  await timelineContext.route("**/data/collections/2006.json*", async route => { await timelineSlow; await route.continue(); });
  await timelineContext.route("**/data/collections/2007.json*", route => timelineFailure
    ? route.fulfill({status:503,body:"Simulated timeline failure"}) : route.continue());
  const timeline = await timelineContext.newPage();
  await timeline.goto(`${url}?year=2024#time`);
  await timeline.waitForSelector('[data-discovery-action="retry"]');
  await timeline.waitForFunction(() => !document.querySelector("#boot-screen"));
  assert.equal(await timeline.locator(".time-stop").count(), 0, "timeline never presents incomplete annual comparisons");
  assert.match(await timeline.locator("#view-root").innerText(), /Opening all collections for the timeline.*Results are incomplete/s);
  timelineFailure = false;
  await timeline.locator('[data-discovery-action="retry"]').click();
  releaseTimeline();
  await timeline.waitForSelector("#time-2024");
  await timeline.waitForFunction(() => document.activeElement.id === "time-2024");
  assert.equal(await timeline.evaluate(() => loadedCollections.size), await timeline.evaluate(() => YEAR_FILES.length));
  assert.equal(await timeline.evaluate(() => document.activeElement.id), "time-2024");
  await timelineContext.close();
  console.log("Progressive loading: selected Desk stays complete with a slow unrelated shard; partial all-year search, selected/direct failures and Retry pass; Time Machine waits for all years and restores its jump");

  // Use the real files and production origin rules to exercise the isolated PDF
  // reader entirely offline, including theme messages between frame and parent.
  const offline = await browser.newContext({viewport:{width:390,height:844}});
  const root = process.cwd();
  const release = await pdfjsReleaseFiles();
  const mime = {".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".json":"application/json", ".css":"text/css", ".svg":"image/svg+xml", ".pdf":"application/pdf", ".md":"text/plain", ".wasm":"application/wasm", ".bcmap":"application/octet-stream"};
  await offline.route("**/*", async (route) => {
    const request = new URL(route.request().url());
    if (!["webhacklist.com", "irsdl.github.io"].includes(request.hostname)) return route.abort();
    let relative = decodeURIComponent(request.pathname).replace(/^\/webhacklist\//, "").replace(/^\//, "");
    if (!relative) relative = "index.html";
    if (relative.startsWith(release.releasePath + "/")) {
      const name = relative.slice(release.releasePath.length + 1), body = release.files.get(name);
      if (!body) return route.fulfill({status:404,body:"Local release file not found"});
      return route.fulfill({status:200,contentType:mime[path.extname(name)] || "application/octet-stream",headers:{"access-control-allow-origin":"*"},body});
    }
    const file = path.resolve(root, /^(archived-references|original-listings)\//.test(relative) ? relative : `website/${relative}`);
    if (!file.startsWith(`${root}${path.sep}`)) return route.abort();
    try {
      const body = await readFile(file);
      await route.fulfill({status:200,contentType:mime[path.extname(file)] || "application/octet-stream",headers:{"access-control-allow-origin":"*"},body});
    } catch { await route.fulfill({status:404,body:"Local test file not found"}); }
  });
  const mobile = await offline.newPage();
  mobile.on("pageerror", (error) => errors.push(error.message));
  mobile.on("console", (message) => { if (message.type() === "error") errors.push(`${message.text()} (${message.location().url})`); });
  await mobile.goto("https://webhacklist.com/#desk");
  await mobile.waitForSelector(".discovery-record");
  const candidates = await mobile.evaluate(() => state.items.filter((item) => item.pdfPath && item.mdPath).map((item) => ({id:item.id,pdfPath:item.pdfPath})));
  const sizes = await Promise.all(candidates.map(async (item) => ({...item,size:(await stat(path.join(root,item.pdfPath))).size})));
  const small = sizes.sort((a,b) => a.size-b.size)[0];
  for (const view of views) {
    await mobile.evaluate((view) => setView(view), view);
    await mobile.evaluate((id) => openPdfViewer(state.items.find((item) => item.id === id)), small.id);
    await mobile.waitForFunction(() => document.querySelector("#pdf-frame")?.contentWindow && !document.querySelector("#pdf-frame").hidden);
    const frame = mobile.frameLocator("#pdf-frame");
    try { await frame.locator("canvas").first().waitFor({state:"visible"}); }
    catch (error) { console.log(await frame.locator("body").innerText()); throw error; }
    assert.equal(await frame.locator("html").getAttribute("data-palette"), view);
    await mobile.locator("#pdf-theme-toggle").click();
    await frame.locator('html[data-theme="light"]').waitFor();
    await mobile.locator("#pdf-open-markdown").click();
    await mobile.waitForSelector("#reader-content .archive-warning");
    assert.equal(await mobile.locator("#reader-dialog").getAttribute("data-reading-theme"), "light");
    await mobile.locator("#reader-theme-toggle").click();
    await mobile.evaluate(() => new Promise((resolve) => { const dialog=document.querySelector("#reader-dialog"); dialog.addEventListener("close",resolve,{once:true}); dialog.close(); }));
  }
  await offline.close();
  console.log("Documents: real PDF rendering in an isolated mobile frame, both palettes, theme messages and Markdown switching pass offline");
  assert.deepEqual(errors, []);
  console.log("Discovery test: PASS");
} finally { await browser.close(); }
