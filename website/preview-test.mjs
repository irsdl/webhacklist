import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {launchBrowser} from "./browser-test.mjs";
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const browser = await launchBrowser();
const page = await browser.newPage({viewport:{width:390,height:844}});
const errors = [];
const expected404s = new Set();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() !== "error") return;
  const location = message.location().url;
  if (message.text().includes("Failed to load resource") && expected404s.has(location)) return;
  errors.push(`${message.text()}${location ? ` (${location})` : ""}`);
});
try {
  await page.goto(`${base}#desk`);
  await page.waitForSelector(".discovery-record");
  const licence = await fetch(new URL("licence.txt", base));
  assert.equal(licence.status, 200);
  assert.equal(licence.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(licence.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(Buffer.from(await licence.arrayBuffer()), await readFile(new URL("../LICENSE", import.meta.url)), "preview serves canonical licence bytes unchanged");
  for (const [asset, type] of [["reuse.html", /text\/html/], ["reuse.css", /text\/css/], ["vendor/pdfjs/LICENSE", /text\/plain/]]) {
    const response = await fetch(new URL(asset, base));
    assert.equal(response.status, 200); assert.match(response.headers.get("content-type"), type);
  }
  const axe = await readFile(process.env.AXE_SOURCE, "utf8");
  let reuseAudits = 0;
  for (const width of [320, 1440]) {
    await page.setViewportSize({width, height:width === 320 ? 568 : 1000});
    const link = page.locator('.site-footer a[href="/reuse.html"]');
    await link.focus(); await link.press("Shift");
    assert.equal(await link.evaluate(node => document.activeElement === node && node.matches(":focus-visible")), true);
    await Promise.all([page.waitForURL("**/reuse.html"), page.keyboard.press("Enter")]);
    assert.equal(await page.locator("h1").innerText(), "Reuse & licences");
    const guidance = await page.locator("main").innerText();
    assert.match(guidance, /Original website and tooling code/);
    assert.match(guidance, /MIT licence does not relicense these works/);
    assert.match(guidance, /Vendored components/);
    assert.match(guidance, /Exporting a bibliography does not transfer copyright/);
    assert.match(guidance, /source-derived text/);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "/");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute("href")), "/licence.txt");
    assert.equal(await page.evaluate(() => document.activeElement.matches(":focus-visible") && parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 2), true);
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({colorScheme}); await page.evaluate(axe);
      const result = await page.evaluate(() => axe.run(document, {runOnly:{type:"tag", values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
      assert.deepEqual(result.violations, []); reuseAudits++;
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "reuse page fits narrow viewport");
      if (process.env.WEBSEC_REUSE_CAPTURE === "1") {
        const png = await page.screenshot({fullPage:true}); assert.ok(png.length < 1024 * 1024);
        console.log("REUSE_CAPTURE " + JSON.stringify({name:`reuse-${width}-${colorScheme}`,width,data:png.toString("base64")}));
      }
    }
    await page.goBack(); await page.waitForSelector(".discovery-record");
    assert.equal(page.url(), `${base}#desk`);
    await page.goForward(); await page.waitForURL("**/reuse.html");
    await page.goBack(); await page.waitForSelector(".discovery-record");
  }
  await page.emulateMedia({colorScheme:null}); await page.setViewportSize({width:390,height:844});
  const reader = new URL(base); reader.port = process.env.WEBSEC_READER_PORT || "4174";
  for (const asset of ["licence.txt", "reuse.html", "reuse.css"]) {
    const expected404 = new URL(asset, reader);
    expected404s.add(expected404.href);
    assert.equal((await fetch(expected404)).status, 404, "reuse guidance stays off isolated reader origin");
  }
  console.log(`Reuse terms: canonical licence bytes/MIME, app-only guidance routes, 320/1440px keyboard navigation and Back/Forward, separate rights and export wording passed; ${reuseAudits} axe audits.`);
  const backupAsset = await fetch(new URL("saved-state.js", base));
  assert.equal(backupAsset.status, 200);
  assert.match(backupAsset.headers.get("content-type"), /javascript/);
  assert.match(await backupAsset.text(), /const SavedStateBackup/);
  const shortlistAsset = await fetch(new URL("shortlist.js", base));
  assert.equal(shortlistAsset.status, 200);
  assert.match(shortlistAsset.headers.get("content-type"), /javascript/);
  assert.match(await shortlistAsset.text(), /const ShortlistBibliography/);
  const id = await page.evaluate(() => state.items.find((item) => item.pdfPath?.endsWith("kuza55-blogspot-com-cookie-path-traversal.pdf"))?.id);
  assert.ok(id, "Local PDF fixture is available");
  for (const view of ["desk", "time"]) {
    await page.evaluate((view) => setView(view), view);
    await page.locator("#view-fullscreen").click();
    await page.waitForSelector('#view-fullscreen[aria-pressed="true"]');
    assert.equal(await page.evaluate(() => Boolean(document.fullscreenElement) || viewFullscreenFallbackActive()), true);
    await page.locator("#view-fullscreen").click();
    await page.waitForSelector('#view-fullscreen[aria-pressed="false"]');
    assert.equal(await page.locator("#view-fullscreen svg").count(), 1);
    await page.evaluate((id) => openPdfViewer(state.items.find((item) => item.id === id)), id);
    const frame = page.frameLocator("#pdf-frame");
    await frame.locator("canvas").first().waitFor({state:"visible"});
    const frameUrl = new URL(await page.locator("#pdf-frame").getAttribute("src"));
    assert.notEqual(frameUrl.origin, new URL(base).origin);
    assert.equal(frameUrl.hostname, "127.0.0.1");
    assert.equal(await frame.locator("html").getAttribute("data-palette"), view);
    await page.locator("#pdf-theme-toggle").click();
    await frame.locator('html[data-theme="light"]').waitFor();
    await page.locator("#pdf-open-markdown").click();
    await page.waitForSelector("#reader-dialog[open] .archive-warning");
    await page.locator("#reader-theme-toggle").click();
    await page.evaluate(() => new Promise((resolve) => { const dialog=document.querySelector("#reader-dialog"); dialog.addEventListener("close",resolve,{once:true}); dialog.close(); }));
  }
  const pdfPath = await page.evaluate((id) => state.items.find((item) => item.id === id).pdfPath, id);
  const partial = await fetch(new URL(pdfPath, base), {headers:{Range:"bytes=0-15"}});
  assert.equal(partial.status, 206);
  assert.equal((await partial.arrayBuffer()).byteLength, 16);
  const diagramResponse = await fetch(new URL("data/diagrams.json", base));
  assert.equal(diagramResponse.status, 200);
  const diagramIndex = await diagramResponse.json();
  const diagramPath = Object.values(diagramIndex.diagrams)[0];
  assert.ok(diagramPath, "Preserved diagram fixture is available");
  const diagram = await fetch(new URL(diagramPath, base));
  assert.equal(diagram.status, 200);
  assert.match(diagram.headers.get("content-type"), /image\/svg\+xml/);
  // Browsers can deny dedicated workers. PDF.js must still render within the
  // isolated reader frame, using the handler exported by our worker wrapper.
  const fallback = await browser.newContext({viewport:{width:390,height:844}});
  await fallback.addInitScript(() => {
    window.Worker = class { constructor() { throw new Error("Dedicated worker disabled by regression test"); } };
  });
  const fallbackPage = await fallback.newPage();
  fallbackPage.on("pageerror", error => errors.push(error.message));
  await fallbackPage.goto(`${base}#desk`);
  await fallbackPage.waitForSelector(".discovery-record");
  await fallbackPage.evaluate(id => openPdfViewer(state.items.find(item => item.id === id)), id);
  const fallbackFrame = fallbackPage.frameLocator("#pdf-frame");
  await fallbackFrame.locator("canvas").first().waitFor({state:"visible"});
  assert.equal(await fallbackFrame.locator("#reader-error").isVisible(), false);
  await fallback.close();
  assert.deepEqual(errors, []);
  console.log("Local preview: both palettes, fullscreen controls, isolated PDF rendering (including unavailable workers), theme messages, Markdown switching and PDF range requests pass");
} finally { await browser.close(); }
