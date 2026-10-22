// Browser navigation is part of the shared popup contract, including same-hash
// reader URLs, direct links, manual dismissal and prior theme visits.
import assert from "node:assert/strict";
import {launchBrowser, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const views = ["evidence", "museum", "library", "time", "signals", "constellation", "terminal", "desk", "favourites"];
const errors = [];
let diagnosticPage;
async function preparePage(context) {
  const page = await context.newPage();
  diagnosticPage = page;
  await page.addInitScript(() => {
    window.historyTrace = [];
    const record = type => {
      historyTrace.push({type, url: location.search + location.hash, state: history.state});
      if (historyTrace.length > 30) historyTrace.shift();
    };
    for (const name of ["pushState", "replaceState"]) {
      const original = history[name].bind(history);
      history[name] = (...args) => { const result = original(...args); record(name); return result; };
    }
    for (const event of ["popstate", "hashchange"]) addEventListener(event, () => record(event));
  });
  page.on("pageerror", error => { errors.push(error.message); console.log("Browser error:", error.message); });
  await page.route("**/archived-references/md/**", route => route.fulfill({contentType: "text/plain", body: "# History fixture\n\nA benign local reader fixture."}));
  return page;
}
async function closed(page, view) {
  await page.waitForFunction(view => !document.querySelector('dialog[open]') && !document.body.classList.contains("document-dialog-open") && !documentDismissal && !history.state?.archiveDocument && state.view === view, view, {timeout: 10000}).catch(async error => {
    console.log("History failure", {expectedView: view, url: page.url(), errors, actual: await page.evaluate(() => ({view: state.view, state: history.state, pending: Boolean(documentDismissal), dialogs: [...document.querySelectorAll("dialog[open]")].map(el => el.id), locked: document.body.classList.contains("document-dialog-open")}))});
    throw error;
  });
  assert.equal(new URL(page.url()).hash, `#${view}`);
  assert.equal(new URL(page.url()).search, "");
}
async function back(page, view) { await page.goBack(); await closed(page, view); }
try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({viewport: {width, height: 900}, hasTouch: width < 820, isMobile: width < 820 && mobileEmulation});
    // A new tab has only its initial collection. Idle prefetch must not hide
    // a mismatch between that collection and the year rendered behind a link.
    for (const view of views) {
      for (const format of ["artifact", "reader", "pdf"]) {
        const direct = await preparePage(context);
        await direct.addInitScript(() => {
          Object.defineProperty(navigator, "connection", {configurable: true, value: {saveData: true}});
        });
        const id = "2026-ai-r-227f84b75a2a7800ab63abef";
        const link = new URL(base);
        link.hash = `${view}/${id}`;
        if (format !== "artifact") {
          link.searchParams.set(format, id);
          link.searchParams.set("theme", width === 390 ? "light" : "dark");
        }
        await direct.goto(link.href);
        await direct.waitForSelector(`#${format}-dialog[open]`);
        await direct.waitForFunction(() => !document.querySelector("#boot-screen"));
        if (Object.hasOwn({evidence: 1, museum: 1, library: 1, signals: 1, constellation: 1}, view)) {
          assert.equal(await direct.evaluate(() => selectedArchiveYear()), "2026-ai", `${view}: shared ${format} opens its own year behind the dialog`);
          assert.ok(await direct.evaluate(() => itemsForYear(selectedArchiveYear()).length > 0));
        }
        await direct.locator(`#${format}-dialog .${format === "artifact" ? "dialog" : format}-close`).click();
        await closed(direct, view);
        assert.ok(await direct.locator("#view-root").innerText(), `${view}: closing a new-tab link leaves a rendered view`);
        if (["evidence", "museum", "library", "signals"].includes(view)) {
          assert.ok(await direct.locator("#view-root [data-artifact]").count(), `${view}: research remains available without refresh`);
        }
        if (view === "constellation") assert.ok(await direct.evaluate(() => constellationExperience.items.length > 0));
        await direct.close();
      }
    }
    console.log(`History: cold article, Markdown and PDF links close to populated views in all 9 themes at ${width}px`);
    let page = await preparePage(context);
    await page.goto(`${base}#desk`);
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    const id = await page.evaluate(() => state.items.find(item => item.mdPath && item.pdfPath).id);
    for (const view of views) {
      console.log(`History checking ${view} at ${width}px`);
      await page.evaluate(() => setView("library"));
      await page.evaluate(view => setView(view), view);
      const length = await page.evaluate(() => history.length);
      await page.evaluate(id => openArtifact(id), id);
      assert.equal(await page.evaluate(() => history.length), length + 1);
      const share = page.url();
      await back(page, view);
      await page.goForward();
      await page.waitForSelector("#artifact-dialog[open]");
      assert.equal(page.url(), share);
      await page.locator("#open-reader").click();
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      await page.locator("#reader-theme-toggle").click();
      const readerShare = page.url();
      assert.equal(await page.evaluate(() => history.length), length + 1, "Format and appearance switches do not add Back steps");
      await back(page, view);
      await page.goForward();
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      assert.equal(page.url(), readerShare);
      assert.equal(await page.locator("#artifact-dialog[open]").count(), 0);
      await page.locator("#reader-open-pdf").click();
      await page.waitForSelector("#pdf-dialog[open]");
      const pdfShare = page.url();
      await back(page, view);
      assert.equal(await page.locator("#pdf-frame").getAttribute("src"), null);
      await page.goForward();
      await page.waitForSelector("#pdf-dialog[open]");
      assert.equal(page.url(), pdfShare);
      await page.locator(".pdf-close").click();
      await closed(page, view);
      // Closing by X consumes the popup entry: Back now reaches the prior theme.
      await back(page, "library");
      await page.goForward();
      await closed(page, view);
      await page.evaluate(id => openArtifact(id), id);
      await page.keyboard.press("Escape");
      await closed(page, view);
      // Reopening immediately after close must wait for the pending traversal.
      await page.evaluate(id => openArtifact(id), id);
      await page.evaluate(id => { document.querySelector("#artifact-dialog").close(); setTimeout(() => openArtifact(id), 0); }, id);
      await page.waitForSelector("#artifact-dialog[open]");
      await back(page, view);
    }
    // An actual card click and query-only Forward navigation use the same route.
    await page.evaluate(() => setView("desk"));
    await page.locator("#view-root [data-artifact]").first().click();
    await page.waitForSelector("#artifact-dialog[open]");
    await back(page, "desk");
    // WebKit can abort a top-level navigation after this deliberately dense
    // Back/Forward sequence. Use a fresh page for the independent direct-link
    // contract, with a real Desk entry behind it for the checks below.
    await page.close();
    page = await preparePage(context);
    await page.goto(`${base}#desk`);
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    const link = new URL(base);
    link.hash = `desk/${id}`;
    link.searchParams.set("reader", id);
    link.searchParams.set("theme", "light");
    await page.goto(link.href);
    await page.waitForSelector("#reader-dialog[open] .archive-warning");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    assert.equal(await page.locator("#artifact-dialog[open]").count(), 0);
    await page.reload();
    await page.waitForSelector("#reader-dialog[open] .archive-warning");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    await back(page, "desk");
    await page.goForward();
    await page.waitForSelector("#reader-dialog[open]");
    await page.locator("#reader-sources").click();
    await page.waitForSelector("#artifact-dialog[open]");
    await back(page, "desk");
    // Reproduce a browser delivering the old close event while Forward is
    // waiting for collection data. It must not start another Back traversal.
    await page.evaluate(() => {
      const original = ensureItemLoaded;
      ensureItemLoaded = async (...args) => {
        ensureItemLoaded = original;
        await new Promise(resolve => { window.releaseHistoryRoute = resolve; });
        return original(...args);
      };
    });
    await page.goForward();
    await page.waitForFunction(() => Boolean(window.releaseHistoryRoute));
    await page.evaluate(() => document.querySelector("#artifact-dialog").dispatchEvent(new Event("close")));
    assert.equal(await page.evaluate(() => Boolean(documentDismissal)), false, "A late close event cannot dismiss the route being restored");
    await page.evaluate(() => window.releaseHistoryRoute());
    await page.waitForSelector("#artifact-dialog[open]");
    await back(page, "desk");
    await context.close();
    console.log(`History: all 9 themes at ${width}px; Back/Forward, X, Escape, format switches, immediate reopen and share-link reload pass`);
  }
  assert.deepEqual(errors, []);
} catch (error) {
  if (diagnosticPage && !diagnosticPage.isClosed()) console.log("History trace:", await diagnosticPage.evaluate(() => ({
    events: window.historyTrace, url: location.href, state: history.state,
    restoring: restoringRoute, pending: Boolean(documentDismissal), view: state.view,
    toast: document.querySelector("#toast")?.textContent
  })));
  throw error;
} finally { await browser.close(); }
