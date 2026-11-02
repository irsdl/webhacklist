// The seasonal layer must leave every research surface usable, including when
// visitors decline it, storage fails, or the campaign has ended.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {launchBrowser} from "./browser-test.mjs";

const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const preference = "websec-halloween-v1";
const halloween = new Date("2026-10-31T12:00:00Z");
const campaign = {enabled:true,schedule:"annual"};
// The master switch may retire the season. Active-season UI checks use an
// enabled fixture, while recurrence checks below use the deployed configuration.
const configurationWindow = {window:{}};
vm.runInNewContext(await readFile(new URL("./halloween-config.js",import.meta.url),"utf8"),configurationWindow,{timeout:1000});
const deployedCampaign = configurationWindow.window.WEBHACKLIST_HALLOWEEN;
assert.ok(deployedCampaign && typeof deployedCampaign === "object","deployed seasonal configuration exists");
assert.equal(typeof deployedCampaign.enabled,"boolean","deployed seasonal master switch accepts true or false");
assert.equal(deployedCampaign.schedule,"annual","deployed season repeats annually");
const browser = await launchBrowser();

async function seasonalContext(options = {}) {
  const fixture = await browser.newContext(options);
  await fixture.route("**/halloween-config.js*",route => route.fulfill({status:200,contentType:"text/javascript",body:`window.WEBHACKLIST_HALLOWEEN = Object.freeze(${JSON.stringify(campaign)});`}));
  return fixture;
}
const views = ["evidence", "museum", "library", "time", "signals", "constellation", "terminal", "desk", "favourites"];
assert.ok(process.env.AXE_SOURCE,"seasonal accessibility audit requires approved axe-core");
const axeSource = await readFile(process.env.AXE_SOURCE,"utf8");
const errors = [];
const errorDiagnostics = [];
let phase = "initial archive boot";
let step = "navigation";
const context = await seasonalContext({viewport:{width:1440,height:1000}});
if (process.env.WEBSEC_TEST_DEBUG === "1") {
  await context.addInitScript(() => {
    const NativeResizeObserver = globalThis.ResizeObserver;
    globalThis.__halloweenResizeObservations = [];
    globalThis.ResizeObserver = class extends NativeResizeObserver {
      constructor(callback) {
        const source = Function.prototype.toString.call(callback).slice(0,450);
        super((entries,observer) => {
          const recent = globalThis.__halloweenResizeObservations;
          recent.push({time:performance.now(),callback:source,targets:entries.map(entry => ({
            id:entry.target.id,class:entry.target.className?.baseVal ?? entry.target.className,
            width:entry.contentRect.width,height:entry.contentRect.height}))});
          if (recent.length > 12) recent.splice(0,recent.length - 12);
          Reflect.apply(callback,observer,[entries,observer]);
        });
      }
    };
  });
}
const page = await context.newPage();
page.on("pageerror", error => {
  const diagnostic = {message:error.message,phase,step,url:page.url(),stack:error.stack?.slice(0,1800)};
  errors.push(diagnostic);
  const pending = page.evaluate(() => ({view:document.documentElement.dataset.view || null,
    width:innerWidth,height:innerHeight,readyState:document.readyState,
    focused:document.activeElement?.id || document.activeElement?.tagName,
    dialogs:[...document.querySelectorAll("dialog[open]")].map(node => node.id),
    recentResizeObservers:globalThis.__halloweenResizeObservations || null}))
    .then(observed => Object.assign(diagnostic,observed))
    .catch(observationError => { diagnostic.observationError = observationError.message; })
    .finally(() => console.log("HALLOWEEN_PAGE_ERROR " + JSON.stringify(diagnostic)));
  errorDiagnostics.push(pending);
});
await page.clock.setFixedTime(halloween);
const captureNames = new Set();

async function ready(target = page) {
  if (target === page) step = "waiting for archive boot";
  await target.waitForSelector("#app-shell:not([hidden])");
  await target.waitForFunction(() => !document.querySelector("#boot-screen"));
}

async function enabled(target, value) {
  if (target === page) step = `waiting for Halloween ${value ? "on" : "off"}`;
  await target.waitForFunction(value => document.documentElement.dataset.halloween === (value ? "on" : undefined), value);
  assert.equal(await target.locator("#halloween-toggle").getAttribute("aria-pressed"), String(value));
  assert.match(await target.locator("#halloween-toggle").innerText(), value ? /Halloween on/i : /Halloween off/i);
}

async function toggle(target = page) {
  if (target === page) step = "clicking visitor preference";
  const button = target.locator("#halloween-toggle");
  await button.scrollIntoViewIfNeeded();
  await button.click();
}

async function fits(target = page, label = "surface") {
  if (target === page) step = `measuring ${label}`;
  const geometry = await target.evaluate(() => {
    const button = document.querySelector("#halloween-toggle"), rect = button.getBoundingClientRect();
    const scene = document.querySelector("#halloween-scene");
    return {overflow:document.documentElement.scrollWidth > innerWidth + 1,
      left:rect.left,right:rect.right,width:rect.width,height:rect.height,
      sceneHidden:scene?.getAttribute("aria-hidden"),events:scene && getComputedStyle(scene).pointerEvents};
  });
  assert.equal(geometry.overflow, false, `${label}: horizontal overflow`);
  assert.ok(geometry.left >= -1 && geometry.right <= await target.evaluate(() => innerWidth) + 1, `${label}: toggle fits viewport`);
  assert.ok(geometry.width >= 44 && geometry.height >= 44, `${label}: toggle has a 44px touch target`);
  assert.equal(geometry.sceneHidden, "true", `${label}: scene is decorative`);
  assert.equal(geometry.events, "none", `${label}: decoration cannot intercept research controls`);
}

async function capture(name) {
  if (process.env.WEBSEC_CASE_CAPTURE !== "1" || captureNames.has(name)) return;
  await page.evaluate(() => scrollTo({top:0,behavior:"instant"}));
  const bytes = await page.screenshot({type:"jpeg",quality:65,animations:"disabled",fullPage:false});
  assert.ok(bytes.length < 512 * 1024, "bounded seasonal screenshot");
  console.log("CASE_CAPTURE " + JSON.stringify({name:`halloween-${name}`,format:"jpeg",bytes:bytes.length,data:bytes.toString("base64")}));
  captureNames.add(name);
}

async function auditBanner(target, label) {
  const result = await target.evaluate(() => axe.run(document.querySelector(".halloween-banner"),{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
  assert.deepEqual(result.violations,[],label);
}

function syntheticPdf() {
  // Entirely first-party inert fixture: one page, one text line, no attachments.
  const stream = "BT /F1 18 Tf 30 740 Td (Halloween reader fixture) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let source = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object,index) => { offsets.push(source.length); source += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = source.length;
  source += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(source);
}

async function configCase(name, config, instant, saved = "on") {
  const isolated = await seasonalContext({viewport:{width:390,height:844}});
  const target = await isolated.newPage();
  try {
    await target.clock.setFixedTime(new Date(instant));
    await isolated.addInitScript(({key,value}) => localStorage.setItem(key,value), {key:preference,value:saved});
    await isolated.route("**/halloween-config.js*", route => route.fulfill({status:200,contentType:"text/javascript",body:`window.WEBHACKLIST_HALLOWEEN = ${JSON.stringify(config)};`}));
    await target.goto(new URL("#desk",base).href);
    await ready(target);
    assert.equal(await target.locator("html").getAttribute("data-halloween"), null, `${name}: no seasonal overlay`);
    assert.equal(await target.locator("#halloween-toggle:visible").count(), 0, `${name}: campaign controls hidden`);
    assert.ok(await target.locator("#desk-query").isVisible(), `${name}: research remains usable`);
  } finally { await isolated.close(); }
}

try {
  await page.goto(base);
  await ready();
  await enabled(page,true);
  assert.equal(await page.locator(".halloween-banner").count(),1);
  assert.equal(await page.locator("#main-content .halloween-banner").count(),1,"app banner belongs to main reading area");
  const originalUrl = page.url(), originalHistory = await page.evaluate(() => history.length);
  await page.locator("#halloween-toggle").focus();
  await page.keyboard.press("Enter");
  await enabled(page,false);
  assert.equal(await page.evaluate(key => localStorage.getItem(key),preference),"off");
  assert.equal(page.url(),originalUrl,"toggle does not change route");
  assert.equal(await page.evaluate(() => history.length),originalHistory,"toggle adds no history entry");
  assert.equal(await page.locator("#halloween-scene").isVisible(),false,"off switch hides scenery");
  phase = "opt-out persistence reload"; step = "waiting for in-flight archive requests before reload";
  await page.waitForLoadState("networkidle");
  await page.reload(); await ready(); await enabled(page,false);
  step = "waiting for in-flight archive requests before cross-page navigation";
  await page.waitForLoadState("networkidle");

  // Persist through real document navigation, not only in-memory theme changes.
  for (const route of ["reuse.html","research/","research/2024/","security/","404.html"]) {
    phase = `persisted opt-out on ${route}`; step = "cross-page navigation";
    const response = await page.goto(new URL(route,base).href);
    assert.ok(response && response.status() === 200, `${route}: published preview surface`);
    await page.waitForSelector("#halloween-toggle");
    await enabled(page,false);
    await fits(page,route);
    assert.ok(await page.locator("main h1").isVisible(),`${route}: primary content remains visible`);
  }
  await page.goto(new URL("research/",base).href);
  const referenceLinks = page.locator('a[href^="/reference/"]');
  const referenceLink = await referenceLinks.count() ? await referenceLinks.first().getAttribute("href") : null;
  // The hub may link collections first; a collection always lists its records.
  let reference = referenceLink;
  if (!reference) {
    await page.goto(new URL("research/2024/",base).href);
    reference = await page.locator('a[href^="/reference/"]').first().getAttribute("href");
  }
  assert.ok(reference,"generated collection exposes a reference page");
  await page.goto(new URL(reference,base).href); await page.waitForSelector("#halloween-toggle");
  await enabled(page,false); await fits(page,"reference page");

  // Static content has different layout and style rules from the interactive
  // shell; exercise its real mobile opt-out, touch geometry and contrast too.
  for (const width of [320,390]) {
    await page.setViewportSize({width,height:844});
    for (const route of ["reuse.html","research/","research/2024/","security/",reference,"404.html"]) {
      phase = `mobile static ${route} at ${width}px`; step = "cross-page navigation";
      await page.goto(new URL(route,base).href); await page.waitForSelector("#halloween-toggle");
      await page.evaluate(axeSource);
      await enabled(page,false); await fits(page,`${route} ${width}px off`);
      await auditBanner(page,`${route} ${width}px off accessibility`);
      await toggle(); await enabled(page,true); await fits(page,`${route} ${width}px on`);
      await auditBanner(page,`${route} ${width}px on accessibility`);
      assert.ok(await page.locator("main h1").isVisible(),`${route}: seasonal appearance leaves primary mobile content visible`);
      await toggle(); await enabled(page,false);
    }
  }
  console.log("Halloween: six static page types fit 320/390px on and off, with 24 accessibility audits");
  await toggle(); await enabled(page,true);
  phase = "return from static pages to archive"; step = "navigation";
  await page.goto(base); await ready(); await enabled(page,true);

  // Same-origin tabs observe the visitor's preference without a reload.
  const sibling = await context.newPage(); await sibling.clock.setFixedTime(halloween);
  phase = "cross-tab preference synchronization";
  await sibling.goto(new URL("reuse.html",base).href); await sibling.waitForSelector("#halloween-toggle");
  await enabled(sibling,true);
  await toggle(); await enabled(page,false); await enabled(sibling,false);
  await toggle(sibling); await enabled(sibling,true); await enabled(page,true);
  await sibling.close();

  // All archive modes, both discovery appearances and narrow phones retain
  // normal routing and a directly operable opt-out.
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:1000});
    for (const view of views) {
      phase = `interactive ${view} at ${width}px`; step = "changing archive view";
      await page.evaluate(async view => { await setView(view); },view);
      await page.waitForFunction(view => document.documentElement.dataset.view === view,view);
      await enabled(page,true); await fits(page,`${view} ${width}px`);
      const heading = await page.locator("#view-mode").innerText();
      await toggle(); await enabled(page,false); await fits(page,`${view} off ${width}px`);
      assert.equal(await page.locator("#view-mode").innerText(),heading,"opt-out preserves selected view");
      await toggle(); await enabled(page,true);
      if (["desk","time"].includes(view)) {
        for (const theme of ["light","dark"]) {
          await page.locator(`[data-discovery-action="theme"][data-discovery-value="${theme}"]`).click();
          assert.equal(await page.locator("html").getAttribute("data-discovery-theme"),theme);
          await fits(page,`${view} ${theme} ${width}px`);
        }
      }
      if ((width === 1440 && ["evidence","museum","desk"].includes(view)) || (width === 390 && ["evidence","terminal"].includes(view))) await capture(`${width}-${view}`);
    }
  }
  console.log("Halloween: all nine views fit four desktop/mobile widths, with on/off and both discovery appearances");

  // Immersive fullscreen moves decoration after the working area. The switch
  // must remain reachable in that scroll container without leaving fullscreen.
  await page.setViewportSize({width:667,height:375});
  await page.evaluate(() => {
    Object.defineProperty(Element.prototype,"requestFullscreen",{value:undefined,configurable:true});
    Object.defineProperty(Element.prototype,"webkitRequestFullscreen",{value:undefined,configurable:true});
  });
  for (const view of ["terminal","constellation"]) {
    phase = `landscape fullscreen ${view}`; step = "changing archive view";
    await page.evaluate(async view => { await setView(view); },view);
    await page.locator("#view-fullscreen").click();
    await page.waitForSelector("main.view-fullscreen-fallback");
    await page.waitForFunction(() => Boolean(document.querySelector("#view-root").compareDocumentPosition(document.querySelector(".halloween-banner")) & Node.DOCUMENT_POSITION_FOLLOWING));
    await toggle(); await enabled(page,false);
    assert.equal(await page.locator("main.view-fullscreen-fallback").count(),1,"opt-out preserves fullscreen");
    await toggle(); await enabled(page,true);
    await page.locator("#view-fullscreen").click();
    await page.waitForSelector("main.view-fullscreen-fallback",{state:"hidden"});
  }
  console.log("Halloween: terminal and constellation fullscreen keep seasonal choice reachable after working area");

  // Research controls still operate with the decoration enabled.
  await page.setViewportSize({width:390,height:844});
  phase = "mobile research controls"; step = "Find research and search/save/dialog";
  await page.evaluate(() => setView("museum"));
  await page.locator("#find-research").click();
  await page.waitForFunction(() => document.activeElement === document.querySelector("#desk-query"));
  await page.locator("#desk-query").fill("halloween-no-such-research-fixture");
  assert.equal(await page.locator(".discovery-record").count(),0);
  await page.locator('[data-discovery-action="desk-reset"]').click();
  await page.waitForSelector(".discovery-record");
  const savedButton = page.locator(".discovery-record [data-favourite]").first();
  const savedId = await savedButton.getAttribute("data-favourite");
  await savedButton.click();
  assert.equal(await page.locator(`[data-favourite="${savedId}"]`).first().getAttribute("aria-pressed"),"true");
  await page.locator(".discovery-record [data-artifact]").first().click();
  await page.waitForSelector("#artifact-dialog[open]");
  await page.keyboard.press("Escape");
  await page.waitForSelector("#artifact-dialog[open]",{state:"hidden"});
  await enabled(page,true);

  // Both the OS preference and the site's existing motion control stop all
  // seasonal animation; opting out also removes the decorative surface.
  // The existing ambient-motion control is desktop-only in the archive header.
  await page.setViewportSize({width:1440,height:1000});
  phase = "OS reduced motion"; step = "emulating reduced motion";
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.waitForFunction(() => document.body.classList.contains("reduce-motion"));
  await page.waitForFunction(() => [...document.querySelectorAll("#halloween-scene .halloween-bats, #halloween-scene .halloween-ghost")].every(node => getComputedStyle(node).animationName === "none") && document.querySelector("#halloween-scene").getAnimations({subtree:true}).every(animation => animation.playState !== "running"));
  await page.emulateMedia({reducedMotion:"no-preference"});
  phase = "site reduced motion"; step = "restoring system motion and clicking motion control";
  await page.waitForFunction(() => !document.body.classList.contains("reduce-motion"));
  await page.locator("#motion-toggle").click();
  await page.waitForFunction(() => document.body.classList.contains("reduce-motion"));
  await page.waitForFunction(() => [...document.querySelectorAll("#halloween-scene .halloween-bats, #halloween-scene .halloween-ghost")].every(node => getComputedStyle(node).animationName === "none") && document.querySelector("#halloween-scene").getAnimations({subtree:true}).every(animation => animation.playState !== "running"));
  await page.locator("#motion-toggle").click();
  await page.waitForFunction(() => !document.body.classList.contains("reduce-motion"));

  await page.evaluate(axeSource);
  phase = "interactive banner accessibility";
  for (const theme of ["light","dark"]) {
    await page.evaluate(theme => { discoveryState.theme = theme; updateDiscoveryAppearance(); },theme);
    for (const active of [true,false]) {
      if ((await page.locator("#halloween-toggle").getAttribute("aria-pressed")) !== String(active)) await toggle();
      await auditBanner(page,`${theme} seasonal ${active ? "on" : "off"} accessibility`);
    }
  }
  console.log("Halloween: search, saved state, record dialogs, reduced motion and four accessibility audits passed");
  await toggle(); await enabled(page,true);

  // PDF rendering keeps its original controls and paper. Embedded readers use
  // the app's surrounding controls; standalone readers expose their own switch.
  const readerUrl = new URL("pdf-reader.html",base);
  phase = "standalone PDF reader"; step = "separate-origin PDF page";
  readerUrl.port = process.env.WEBSEC_READER_PORT || "4174";
  const pdfPage = await context.newPage(); await pdfPage.clock.setFixedTime(halloween);
  await pdfPage.goto(readerUrl.href); await pdfPage.waitForSelector("#halloween-toggle");
  await enabled(pdfPage,true); await fits(pdfPage,"standalone PDF reader");
  assert.ok(await pdfPage.locator(".reader-toolbar").isVisible());
  await toggle(pdfPage); await enabled(pdfPage,false); await pdfPage.reload();
  await pdfPage.waitForSelector("#halloween-toggle"); await enabled(pdfPage,false);
  await pdfPage.setViewportSize({width:320,height:844});
  await fits(pdfPage,"320px standalone PDF error with Halloween off");
  await toggle(pdfPage); await enabled(pdfPage,true); await fits(pdfPage,"320px standalone PDF error with Halloween on");
  const fixtureUrl = new URL("/archived-references/pdf/2024/halloween-fixture.pdf",base).href;
  await context.route(fixtureUrl,route => route.fulfill({status:200,contentType:"application/pdf",headers:{"access-control-allow-origin":readerUrl.origin},body:syntheticPdf()}));
  const documentUrl = new URL(readerUrl); documentUrl.searchParams.set("file",fixtureUrl);
  await pdfPage.goto(documentUrl.href);
  await pdfPage.locator(".pdf-page canvas").first().waitFor({state:"visible"});
  await enabled(pdfPage,true); await fits(pdfPage,"320px loaded standalone PDF");
  assert.equal(await pdfPage.locator("#text-mode").isEnabled(),true,"loaded PDF retains text controls");
  assert.ok(await pdfPage.locator("#document-scroll").evaluate(node => node.clientHeight > 100),"standalone PDF retains useful reading space");
  const originalPaper = await pdfPage.locator(".pdf-page").first().evaluate(node => getComputedStyle(node).backgroundColor);
  await toggle(pdfPage); await enabled(pdfPage,false);
  assert.equal(await pdfPage.locator(".pdf-page").first().evaluate(node => getComputedStyle(node).backgroundColor),originalPaper,"seasonal opt-out preserves PDF page colors");
  assert.ok(await pdfPage.locator(".pdf-page canvas").first().isVisible(),"seasonal opt-out preserves rendered document");
  await context.unroute(fixtureUrl);
  await pdfPage.close();
  phase = "embedded PDF reader"; step = "return to archive";
  await page.goto(base); await ready();
  await page.evaluate(url => { const frame = document.createElement("iframe"); frame.id = "seasonal-embedded-reader"; frame.src = url; document.body.append(frame); },readerUrl.href);
  const embedded = page.frameLocator("#seasonal-embedded-reader");
  await embedded.locator(".reader-toolbar").waitFor();
  assert.equal(await embedded.locator("#halloween-toggle").count(),0,"embedded reader has no duplicate seasonal controls");
  assert.equal(await embedded.locator("html").getAttribute("data-halloween"),null,"embedded PDF paper is unaffected");
  await page.evaluate(() => document.querySelector("#seasonal-embedded-reader").remove());

  phase = "independent campaign schedule contexts"; step = "main archive remains open";
  await configCase("master disabled",{...campaign,enabled:false},halloween.toISOString());
  await configCase("before campaign",campaign,"2026-10-29T09:59:59Z");
  await configCase("campaign expired",campaign,"2026-11-01T12:00:00Z");
  await configCase("disabled now",deployedCampaign,"2026-11-02T00:00:00Z");
  await configCase("invalid schedule",{...campaign,schedule:"invalid"},halloween.toISOString());
  console.log("Halloween: site-wide kill switch and schedule override stored opt-in");

  // Exercise the actual deployed configuration at exact worldwide boundaries,
  // future leap years and opposite browser time zones, including saved opt-ins.
  for (const timezoneId of ["Pacific/Kiritimati","Pacific/Pago_Pago"]) {
    const annual = await browser.newContext({timezoneId});
    try {
      await annual.addInitScript(key => localStorage.setItem(key,"on"),preference);
      const target = await annual.newPage();
      for (const year of [2027,2028,2032]) {
        for (const [instant,active] of [
          [`${year}-01-01T00:00:00Z`,false],
          [`${year}-10-29T09:59:59.999Z`,false],
          [`${year}-10-29T10:00:00Z`,true],
          [`${year}-10-30T12:00:00Z`,true],
          [`${year}-10-31T12:00:00Z`,true],
          [`${year}-11-01T11:59:59.999Z`,true],
          [`${year}-11-01T12:00:00Z`,false]
        ]) {
          await target.clock.setFixedTime(new Date(instant));
          await target.goto(new URL("reuse.html",base).href);
          const expected = active && deployedCampaign.enabled;
          assert.equal(await target.locator("html").getAttribute("data-halloween"),expected ? "on" : null,`${timezoneId} ${instant}: annual appearance`);
          assert.equal(await target.locator("#halloween-toggle:visible").count(),expected ? 1 : 0,`${timezoneId} ${instant}: annual controls`);
          assert.ok(await target.locator("main h1").isVisible(),"annual schedule preserves ordinary page content");
        }
      }
    } finally { await annual.close(); }
  }
  console.log("Halloween: deployed annual schedule covers October 30 worldwide through the final October 31 across future and leap years");

  // Exercise the live boundary timers in an already-open static page. A minute
  // before each boundary leaves ample real loading time without a wall-clock wait.
  for (const boundary of ["start","end"]) {
    const timed = await seasonalContext(); const timedPage = await timed.newPage();
    try {
      await timedPage.clock.install({time:new Date(boundary === "start" ? "2026-10-29T09:59:00Z" : "2026-11-01T11:59:00Z")});
      await timedPage.goto(new URL("reuse.html",base).href);
      if (boundary === "start") {
        assert.equal(await timedPage.locator("html").getAttribute("data-halloween"),null,"before start no decoration is mounted");
        assert.equal(await timedPage.locator("#halloween-toggle:visible").count(),0);
      } else {
        await timedPage.waitForSelector("#halloween-toggle"); await enabled(timedPage,true);
      }
      await timedPage.clock.fastForward(61000);
      if (boundary === "start") {
        await timedPage.waitForSelector("#halloween-toggle"); await enabled(timedPage,true);
      } else {
        await timedPage.waitForFunction(() => !document.documentElement.hasAttribute("data-halloween"));
        assert.equal(await timedPage.locator("#halloween-toggle:visible").count(),0,"open page retires its seasonal controls at expiry");
        // Expiry must rearm the next year's timer despite the browser's maximum
        // timeout delay, even if this page stays open through the intervening year.
        const nextStart = new Date("2027-10-29T10:00:01Z").getTime();
        // Playwright's clock truncates a single jump beyond signed 32-bit
        // milliseconds; advance in bounded steps to actually reach next year.
        let remaining;
        while ((remaining = nextStart - await timedPage.evaluate(() => Date.now())) > 0) {
          await timedPage.clock.fastForward(Math.min(remaining, 2_000_000_000));
        }
        await timedPage.waitForSelector("#halloween-toggle"); await enabled(timedPage,true);
      }
      assert.ok(await timedPage.locator("main h1").isVisible(),"boundary transition preserves page content");
    } finally { await timed.close(); }
  }
  console.log("Halloween: already-open pages activate and expire on schedule without reload");

  const denied = await seasonalContext({viewport:{width:320,height:844}});
  phase = "independent blocked-storage context"; step = "main archive remains open";
  const deniedPage = await denied.newPage(); await deniedPage.clock.setFixedTime(halloween);
  try {
    await denied.addInitScript(() => {
      Object.defineProperty(Storage.prototype,"getItem",{configurable:true,value(){throw new DOMException("Storage blocked","SecurityError");}});
      Object.defineProperty(Storage.prototype,"setItem",{configurable:true,value(){throw new DOMException("Storage blocked","SecurityError");}});
    });
    await deniedPage.goto(base); await ready(deniedPage); await enabled(deniedPage,true);
    await toggle(deniedPage); await enabled(deniedPage,false); await fits(deniedPage,"blocked storage");
    await deniedPage.evaluate(() => dispatchEvent(new PageTransitionEvent("pageshow", {persisted:true})));
    await enabled(deniedPage,false);
    await deniedPage.evaluate(() => setView("desk"));
    await enabled(deniedPage,false);
    assert.ok(await deniedPage.locator("#desk-query").isVisible(),"blocked preference storage does not break research");
    await toggle(deniedPage); await enabled(deniedPage,true);
  } finally { await denied.close(); }

  const unavailable = await seasonalContext(); const unavailablePage = await unavailable.newPage();
  phase = "independent optional-script failure context";
  await unavailablePage.clock.setFixedTime(halloween);
  try {
    await unavailable.route("**/halloween.js*",route => route.abort("failed"));
    await unavailablePage.goto(new URL("#desk",base).href); await ready(unavailablePage);
    assert.ok(await unavailablePage.locator("#desk-query").isVisible(),"optional seasonal script failure leaves app functional");
    assert.equal(await unavailablePage.locator("#halloween-toggle").count(),0);
  } finally { await unavailable.close(); }

  const noScript = await seasonalContext({javaScriptEnabled:false,viewport:{width:320,height:844}});
  phase = "independent no-JavaScript context";
  const noScriptPage = await noScript.newPage();
  try {
    for (const route of ["reuse.html","research/","research/2024/","security/",reference,"404.html"]) {
      await noScriptPage.goto(new URL(route,base).href);
      assert.ok(await noScriptPage.locator("main h1").isVisible(),`${route}: no-JavaScript content remains readable`);
      assert.ok(await noScriptPage.locator("main a[href]").count(),`${route}: no-JavaScript navigation remains available`);
      assert.equal(await noScriptPage.locator("html").getAttribute("data-halloween"),null);
      assert.equal(await noScriptPage.locator("#halloween-toggle:visible").count(),0);
    }
    await noScriptPage.goto(base);
    assert.ok(await noScriptPage.locator('#boot-screen a[href="/research/"]').isVisible(),"no-JavaScript app keeps directory fallback");
  } finally { await noScript.close(); }
  await Promise.all(errorDiagnostics);
  assert.deepEqual(errors,[],"seasonal interactions produce no uncaught page errors");
  console.log("Halloween: blocked storage, optional-script failure, standalone/embedded PDF and no-JavaScript pages passed");
} finally { await context.close(); await browser.close(); }
