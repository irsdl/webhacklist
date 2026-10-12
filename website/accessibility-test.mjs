import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {launchBrowser} from "./browser-test.mjs";
const axeSource = await readFile(process.env.AXE_SOURCE || fileURLToPath(import.meta.resolve("axe-core/axe.min.js")), "utf8");
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const url = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:8000/website/";
const violations = [];
const views = ["museum", "library", "signals", "constellation", "terminal", "evidence", "favourites", "desk", "time"];
const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
// WCAG text-spacing values; injected only in the isolated test page.
const spacing = `* {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}`;
let checks = 0;
async function audit(label, surface = page) {
  // Palette controls animate colour changes; audit their settled appearance,
  // not a mixed frame from the old foreground and new background.
  await surface.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    await Promise.all(document.getAnimations().filter(animation => typeof CSSTransition !== 'undefined' && animation instanceof CSSTransition).map(animation => animation.finished.catch(() => {})));
  });
  const found = await surface.evaluate(tags => axe.run(document, { runOnly: { type: "tag", values: tags } }), tags);
  violations.push(...found.violations.map((item) => ({ label, id: item.id, nodes: item.nodes.map((node) => ({ target: node.target, failure: node.failureSummary })) })));
  checks++;
}
async function fits(label, surface = page) {
  assert.ok(await surface.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: document horizontal overflow`);
}
async function focusVisible(control, label) {
  await control.focus();
  // An actual keyboard key activates :focus-visible in engines which distinguish pointer focus.
  await control.press("Shift");
  const state = await control.evaluate(async element => {
    // Outline widths may animate with a control's transition; inspect the settled indicator.
    for (let i = 0; i < 60 && parseFloat(getComputedStyle(element).outlineWidth) < 2; i++) await new Promise(requestAnimationFrame);
    const style = getComputedStyle(element);
    return {focused: document.activeElement === element, visible:element.matches(':focus-visible'), width:parseFloat(style.outlineWidth), style:style.outlineStyle};
  });
  assert.ok(state.focused && state.width >= 2 && state.style !== "none", `${label}: visible keyboard focus ${JSON.stringify(state)}`);
}
async function actionFits(selector, label, surface = page) {
  const clipped = await surface.evaluate(selector => [...document.querySelectorAll(selector)].filter(element => {
    const box = element.getBoundingClientRect();
    return box.width && box.height && (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2);
  }).map(element => ({text:element.textContent.trim(),width:element.clientWidth,height:element.clientHeight})), selector);
  assert.deepEqual(clipped, [], `${label}: critical control text clipped`);
}
function syntheticPdf() {
  const stream = "BT /F1 18 Tf 30 740 Td (Accessible token: first-party test document.) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object,index) => {offsets.push(pdf.length);pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;});
  const xref = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf);
}
async function close(id) {
  await page.evaluate((id) => new Promise((resolve) => {
    const dialog = document.getElementById(id);
    dialog.addEventListener("close", resolve, { once: true });
    dialog.close();
  }), id);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.waitForFunction(() => !documentDismissal && !restoringRoute);
}
try {
  await page.goto(`${url}#desk`);
  await page.waitForSelector(".discovery-record");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  // Playwright accepts forced-colour emulation for WebKit even though WebKit 26
  // does not implement the CSS feature. Gate palette assertions on real support.
  const supportsForcedColors = await page.evaluate(() => CSS.supports("forced-color-adjust", "auto"));
  await page.evaluate(axeSource);
  for (const view of views) {
    await page.waitForFunction(() => !documentDismissal && !restoringRoute && !document.querySelector('#concept-sidebar').inert);
    await page.evaluate((view) => setView(view), view);
    if (!["desk", "time"].includes(view)) {
      await audit(`${view}/dark/page`);
      continue;
    }
    for (const theme of ["light", "dark"]) {
      await page.locator(`[data-discovery-action="theme"][data-discovery-value="${theme}"]`).click();
      await audit(`${view}/${theme}/page`);
      await page.locator(".discovery-record [data-artifact]").first().click();
      await page.waitForSelector("#artifact-dialog[open]");
      await audit(`${view}/${theme}/record`);
      await page.locator("#report-inaccuracy").click();
      await page.waitForSelector("#report-dialog[open]");
      await audit(`${view}/${theme}/report`);
      await close("report-dialog");
      await close("artifact-dialog");
      await page.locator(".topbar [data-contribute]").click();
      await page.waitForSelector("#contribute-dialog[open]");
      await audit(`${view}/${theme}/submit`);
      await close("contribute-dialog");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await audit(`${view}/mobile`);
    await page.locator("#mobile-menu").click();
    await audit(`${view}/mobile-menu`);
    await page.locator("#close-mobile-menu").click();
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  assert.equal(await page.locator("#view-root").getAttribute("aria-live"), null, "the whole replacement subtree is not live");
  assert.equal(await page.locator(".view-metric").getAttribute("aria-atomic"), "true");
  // Exercise real key activation and rerendered focus in every view.
  const controls = {museum:'[data-room-filter="XSS"]',library:'[data-year="2024"]',signals:'[data-signal-topic="HTTP"]',constellation:'[data-topic-filter="XSS"]',evidence:'[data-year="2024"]',favourites:'[data-saved-mode="read"]',time:'[data-discovery-action="time-expand"]'};
  for (const view of views) {
    console.log(`Keyboard view: ${view}`);
    await page.waitForFunction(() => !documentDismissal && !restoringRoute && !document.querySelector('#concept-sidebar').inert);
    await page.locator(`.nav-item[data-view="${view}"]`).focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(view => document.documentElement.dataset.view === view && document.activeElement.id === (view === "terminal" ? "terminal-command" : "main-content") && !documentDismissal && !restoringRoute, view);
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => document.querySelector("#main-content").contains(document.activeElement)), `${view}: Tab enters view controls`);
    const control = page.locator(controls[view] || (view === "desk" ? "#desk-query" : "#terminal-command")).first();
    await focusVisible(control, view);
    if (view === "terminal") { await control.fill("help"); await control.press("Enter"); await page.waitForFunction(() => !state.terminalBusy); }
    else if (view === "desk") { await control.fill("token"); }
    else { await control.press("Enter"); await page.waitForFunction(selector => document.activeElement.matches(selector), controls[view]); }
    await fits(`${view}/keyboard`);
  }
  console.log("Keyboard: navigation, Tab entry, visible focus and view actions passed in all nine views");
  await page.evaluate(() => setView("desk"));
  await page.evaluate(() => { window.accessibilityStatusNode = document.querySelector(".view-metric"); });
  await page.locator('#desk-query').fill("no-match-accessibility-zzzz");
  assert.equal(await page.locator("#view-count").innerText(), "0");
  assert.match(await page.locator(".view-metric").innerText(), /Research Desk.*0.*matching research records/s);
  await page.locator('#desk-query').fill("");
  await page.locator('#desk-topic').selectOption("XSS");
  assert.equal(await page.locator("#view-count").innerText(), await page.evaluate(() => deskFilteredRecords().length.toLocaleString()));
  await page.locator('#desk-topic').selectOption("all");
  await page.locator('[data-discovery-action="desk-next"]').focus();
  await page.keyboard.press("Enter");
  assert.match(await page.locator("#view-count-label").innerText(), /showing 21–40.*page 2/);
  assert.ok(await page.evaluate(() => window.accessibilityStatusNode === document.querySelector(".view-metric")), "status node survives results replacements");
  console.log("Status DOM: query, filter, page range and persistent atomic node passed; this does not test spoken announcements");
  for (const mode of ["mobile", "200%-reflow", "400%-reflow", "text-spacing", "forced-colours"]) {
    // Zoom emulation uses the CSS viewport of a 1440×1000 browser at 200/400%.
    // This tests reflow, not the browser UI's zoom or physical device rendering.
    const viewport = mode === "200%-reflow" ? {width:720,height:500} : mode === "400%-reflow" ? {width:360,height:250} : mode === "mobile" ? {width:320,height:568} : {width:1440,height:1000};
    await page.setViewportSize(viewport);
    await page.emulateMedia({forcedColors:mode === "forced-colours" ? "active" : "none"});
    const spacingStyle = mode === "text-spacing" ? await page.addStyleTag({content:spacing}) : null;
    for (const view of views) {
      await page.evaluate(view => setView(view), view);
      await fits(`${view}/${mode}`);
      if (mode === "mobile" || (mode === "forced-colours" && supportsForcedColors)) await audit(`${view}/${mode}`);
      if (view === "constellation") {
        await actionFits('.constellation-filters button', `${view}/${mode}`);
        const textSizes = await page.locator('.constellation-filters button').evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
        assert.ok(textSizes.every(size => size >= 12), `${mode}: readable constellation filters`);
        await focusVisible(page.locator('[data-topic-filter="all"]'), `${view}/${mode}`);
        if (mode === "forced-colours" && supportsForcedColors) assert.equal(await page.locator('[data-topic-filter="XSS"]').evaluate(element => getComputedStyle(element).forcedColorAdjust), "auto", "pressed topic lets the browser honor the system palette");
      }
    }
    await spacingStyle?.evaluate(element => element.remove());
    console.log(`Layout: all nine views passed ${mode}${mode.includes("reflow") ? " (CSS viewport emulation only)" : ""}`);
  }
  await page.emulateMedia({forcedColors:"none"});
  // Both reader documents use benign first-party synthetic fixtures.
  await page.route("**/archived-references/md/**", route => route.fulfill({contentType:"text/plain",body:"# Accessibility fixture\n\nA readable first-party document.\n\n## Details\n\n[Reference link](https://example.org/)\n\nA second paragraph for spacing checks."}));
  for (const view of views) {
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(view => setView(view), view);
    await page.evaluate(() => openReader(state.items.find(item => item.mdPath)));
    await page.waitForSelector("#reader-content a");
    for (const theme of ["light", "dark"]) {
      await page.evaluate(theme => {state.readingTheme=theme;applyReadingTheme();}, theme);
      await page.evaluate(() => {setReadState(state.readerItem,true);setFavouriteState(state.readerItem,true);});
      assert.equal(await page.locator('#reader-read-toggle').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('#reader-favourite-toggle').getAttribute('aria-pressed'),'true');
      await audit(`${view}/markdown/${theme}`);
    }
    await close("reader-dialog");
  }
  await page.evaluate(() => setView("desk"));
  const opener = page.locator('.discovery-record [data-discovery-action="read"]').first();
  await opener.focus(); await opener.press("Enter");
  await page.waitForSelector("#reader-content a");
  for (const theme of ["light", "dark"]) for (const width of [720,360,320]) {
    await page.setViewportSize({width,height:width === 360 ? 250 : 568});
    await page.evaluate(theme => {state.readingTheme=theme;applyReadingTheme();}, theme);
    const style = await page.addStyleTag({content:spacing});
    await fits(`markdown/${theme}/${width}/spacing`);
    assert.ok(await page.locator('#reader-scroll').evaluate(element => element.clientHeight >= 40), `Markdown/${width}: reading area remains available`);
    await actionFits('#reader-actions :is(button,a)', `markdown/${theme}/${width}/spacing`);
    await audit(`markdown/${theme}/${width}/spacing`);
    await focusVisible(page.locator('#reader-theme-toggle'), "Markdown theme");
    await style.evaluate(element => element.remove());
  }
  await page.emulateMedia({forcedColors:"active"});
  if (supportsForcedColors) await audit("markdown/forced-colours");
  await focusVisible(page.locator('#reader-read-toggle'), "Markdown forced-colours");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector('#reader-dialog').open);
  await page.waitForFunction(() => document.activeElement.matches('[data-discovery-action="read"]'));
  await page.emulateMedia({forcedColors:"none"});
  const pdf = syntheticPdf();
  await page.context().route("**/original-listings/2099-top10.pdf*", route => route.fulfill({contentType:"application/pdf",headers:{"access-control-allow-origin":"*","content-length":String(pdf.length)},body:pdf}));
  await page.context().route("**/archived-references/pdf/**", route => route.fulfill({contentType:"application/pdf",headers:{"access-control-allow-origin":"*","content-length":String(pdf.length)},body:pdf}));
  // Listing-only reader audits have no record state actions. Audit the host
  // document with actual pressed record controls in every inherited palette,
  // including its note; an iframe-only audit cannot see those controls.
  for (const view of views) {
    await page.setViewportSize({width:720,height:1000});
    await page.evaluate(view => {setView(view);const item=state.items.find(item=>item.mdPath&&item.pdfPath);setReadState(item,true);setFavouriteState(item,true);openPdfViewer(item);},view);
    await page.frameLocator('#pdf-frame').locator('#text-mode:not([disabled])').waitFor();
    assert.equal(await page.locator('#pdf-read-toggle').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#pdf-favourite-toggle').getAttribute('aria-pressed'),'true');
    for (const theme of ['light','dark']) {
      await page.evaluate(theme=>{state.readingTheme=theme;applyReadingTheme();syncPdfReaderPreferences();},theme);
      await audit(`${view}/pdf-host/${theme}/pressed`);
    }
    await close('pdf-dialog');
  }
  await page.evaluate(()=>setView('desk'));
  // Keep the iframe's style-src 'self' boundary intact while emulating a user stylesheet.
  await page.context().route("**/__accessibility-spacing.css", route => route.fulfill({contentType:"text/css",body:spacing}));
  await page.setViewportSize({width:720,height:500});
  await page.evaluate(() => openPdfViewer(null,{path:"original-listings/2099-top10.pdf",kind:"listingPdf",title:"First-party accessibility fixture"}));
  await page.frameLocator('#pdf-frame').locator('canvas').first().waitFor({state:'visible'});
  const frame = page.frames().find(frame => frame.url().includes('pdf-reader.html'));
  assert.ok(frame && new URL(frame.url()).origin !== new URL(page.url()).origin, "isolated PDF reader origin");
  await frame.evaluate(axeSource);
  for (const theme of ["light","dark"]) {
    await page.evaluate(theme => {state.readingTheme=theme;applyReadingTheme();syncPdfReaderPreferences();},theme);
    await frame.waitForFunction(theme => document.documentElement.dataset.theme === theme,theme);
    await audit(`pdf-frame/${theme}/visual`,frame);
  }
  await frame.locator('#text-mode').focus(); await page.keyboard.press('Enter');
  await frame.locator('#text-query:not([disabled])').waitFor();
  await frame.locator('#text-query').fill('token'); await frame.locator('#text-query').press('Enter');
  await frame.waitForFunction(() => document.activeElement.tagName === 'MARK');
  for (const theme of ["light","dark"]) for (const width of [720,360,320]) {
    await page.setViewportSize({width,height:width === 360 ? 250 : 568});
    await page.evaluate(theme => {state.readingTheme=theme;applyReadingTheme();syncPdfReaderPreferences();}, theme);
    await frame.waitForFunction(theme => document.documentElement.dataset.theme === theme, theme);
    const outer = await page.addStyleTag({content:spacing}), inner = await frame.addStyleTag({url:new URL('/__accessibility-spacing.css',frame.url()).href});
    await fits(`pdf/${theme}/${width}/spacing`); await fits(`pdf-frame/${theme}/${width}/spacing`,frame);
    assert.ok(await page.locator('#pdf-frame').evaluate(element => element.clientHeight >= 40), `PDF/${width}: frame remains available`);
    assert.ok(await frame.locator('#document-scroll').evaluate(element => element.clientHeight >= 40), `PDF/${width}: text reading area remains available`);
    await actionFits('#pdf-actions :is(button,a)',`PDF host/${width}/spacing`);
    await actionFits('.reader-toolbar button,#text-search button',`PDF frame/${width}/spacing`,frame);
    await audit(`pdf-host/${theme}/${width}`); await audit(`pdf-frame/${theme}/${width}`,frame);
    await focusVisible(frame.locator('#text-find'), `PDF search/${width}`);
    await outer.evaluate(element => element.remove()); await inner.evaluate(element => element.remove());
  }
  await page.emulateMedia({forcedColors:'active'});
  if (supportsForcedColors) {
    await audit('pdf-host/forced-colours');
    await audit('pdf-frame/forced-colours',frame);
  }
  await focusVisible(frame.locator('#text-mode'),'PDF forced-colours');
  if (supportsForcedColors) assert.equal(await frame.locator('#text-mode').evaluate(element => getComputedStyle(element).forcedColorAdjust),'auto','pressed PDF mode lets the browser honor the system palette');
  assert.ok(await frame.locator('#previous-page').isDisabled());
  if (supportsForcedColors) assert.equal(await frame.locator('#previous-page').evaluate(element => getComputedStyle(element).color), await frame.evaluate(() => {
    const sample = document.createElement('span'); sample.style.setProperty('color','GrayText','important'); document.body.append(sample);
    const color = getComputedStyle(sample).color; sample.remove(); return color;
  }), 'disabled PDF controls retain system GrayText');
  await page.locator('.pdf-close').focus(); await page.keyboard.press('Enter');
  await page.waitForFunction(() => !document.querySelector('#pdf-dialog').open);
  console.log('Readers: all nine Markdown palettes/light-dark, both reader spacing/reflow/mobile, PDF text search/keyboard and forced-colours emulation passed');
  assert.deepEqual(violations.map(({label,id,nodes}) => ({label,id,count:nodes.length,examples:nodes.slice(0,2)})), []);
  console.log(`Accessibility: ${checks} page, popup and mobile checks passed (zero automated WCAG A/AA violations)`);
} finally { await browser.close(); }
