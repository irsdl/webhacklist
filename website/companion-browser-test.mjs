// Bounded offline before/after evidence; use --case-captures to retain images.
import assert from "node:assert/strict";
import {launchBrowser} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const page = await browser.newPage({viewport:{width:1440,height:900}, reducedMotion:"reduce"});
const views = ["evidence","museum","library","time","signals","constellation","terminal","desk","favourites"];
const baseline = false;
async function capture(name, extra = {}) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const state = await page.evaluate(() => ({route:location.pathname + location.search + location.hash, width:innerWidth, height:innerHeight, theme:typeof discoveryState === "undefined" ? "static" : discoveryState.theme, year:typeof state === "undefined" ? "" : state.year, motion:"reduce"}));
  console.log("COMPANION_CASE " + JSON.stringify({name,...state,...extra}));
  if (process.env.WEBSEC_CASE_CAPTURE === "1") {
    const bytes = await page.screenshot({type:"jpeg",quality:65});
    assert.ok(bytes.length < 512 * 1024);
    console.log("CASE_CAPTURE " + JSON.stringify({name,format:"jpeg",bytes:bytes.length,data:bytes.toString("base64")}));
  }
}
async function fits(label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label + ": page fits");
  for (const dialog of await page.locator("dialog[open]").all()) {
    assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1), label + ": dialog fits");
  }
}
try {
  if (baseline) await page.route("**/data/catalogue.json",async route => {
    const response=await route.fetch(), catalogue=await response.json();
    catalogue.officialHub="https://portswigger.net/research/top-10-web-hacking-techniques";
    for (const year of catalogue.years) year.officialContext={schema:1,organiser:"Synthetic optional context",checked:"2026-11-18",links:[{kind:"top10",mode:"publication",url:catalogue.officialHub}]};
    await route.fulfill({json:catalogue});
  });
  await page.goto(base + "#evidence");
  await page.waitForSelector(".case-slip");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  if (!baseline) assert.equal(await page.evaluate(() => typeof officialContextFor),"function");
  await page.evaluate(() => ensureAllCollections());
  for (const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:568}]) {
    await page.setViewportSize(viewport);
    await page.evaluate(async () => {await setView("evidence"); await selectArchiveYear("2026-ai");});
    await capture(`${viewport.width}-default-board`);
    await page.evaluate(async () => {await setView("constellation"); await selectArchiveYear("2026-ai");});
    await capture(`${viewport.width}-initial-constellation`);
    for (const view of views) {
      await page.evaluate(async view => {await setView(view); if (!["time","favourites"].includes(view)) await selectArchiveYear("2025");}, view);
      await fits(view);
      if (!baseline) {
        assert.ok(await page.locator(".companion-attribution a").isVisible(),"companion hub visible without drawer");
        if (!["time","favourites"].includes(view)) assert.ok((await page.locator("#official-view-context").innerText()).includes("2025"),view + ": own annual scope");
        if (view === "time") {
          assert.equal((await page.locator("#official-view-context").innerText()).trim(),"");
          assert.ok((await page.locator("#time-2025 .official-context").innerText()).includes("2025"));
        }
      }
      await capture(`${viewport.width}-${view}`);
      if (view === "desk" || view === "time") {
        await page.evaluate(() => {discoveryState.theme = "light"; render();});
        await fits(view + " light"); await capture(`${viewport.width}-${view}-light`);
        await page.evaluate(() => {discoveryState.theme = "dark"; render();});
      }
    }
    await page.evaluate(() => { const item = state.items.find(item => item.year === "2025" && item.mdPath && item.pdfPath); globalThis.companionFixture = item.id; openArtifact(item.id); });
    await page.waitForSelector("#artifact-dialog[open]");
    const referenceSlug=await page.evaluate(() => state.items.find(item => item.id === companionFixture).mdPath.split("/").at(-1).replace(/\.md$/,""));
    assert.match(referenceSlug,/^[a-z0-9._-]+$/);
    await fits("details"); await capture(`${viewport.width}-details`);
    await page.evaluate(() => openReader(state.items.find(item => item.id === companionFixture)));
    await page.waitForSelector("#reader-dialog[open]");
    if (!baseline) {
      await page.locator("#reader-dialog .document-official > summary").click();
      assert.ok((await page.locator("#reader-official-context").innerText()).includes("2025"));
      await fits("expanded reader context");
      assert.ok(await page.locator("#reader-scroll").evaluate(element => element.clientHeight >= 40),"expanded context preserves reading space");
      await page.locator("#reader-dialog .document-official > summary").click();
    }
    await fits("reader"); await capture(`${viewport.width}-reader`);
    await page.evaluate(() => document.querySelector("#reader-dialog").close());
    await page.waitForFunction(() => !documentDismissal);
    await page.evaluate(() => { document.querySelector("#artifact-dialog").close(); });
    await page.evaluate(() => openPdfViewer(state.items.find(item => item.id === companionFixture)));
    await page.waitForSelector("#pdf-dialog[open]");
    await fits("pdf"); await capture(`${viewport.width}-pdf`);
    await page.evaluate(() => document.querySelector("#pdf-dialog").close());
    await page.waitForFunction(() => !documentDismissal);
    await page.evaluate(() => openSubmissionDialog());
    await fits("suggestion"); await capture(`${viewport.width}-suggestion`);
    await page.evaluate(() => document.querySelector("#contribute-dialog").close());
    for (const route of ["research/", "research/2025/", "research/2013/", "research/2016-17/", `reference/${referenceSlug}/`]) {
      await page.goto(new URL(route,base).href); await fits(route);
      await capture(`${viewport.width}-static-${route.startsWith("reference/") ? "record" : route.replaceAll("/","-")}`);
    }
    await page.goto(base + "#desk"); await page.waitForSelector(".discovery-record");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    await page.evaluate(() => ensureAllCollections());
  }
  if (!baseline) {
    await page.evaluate(async () => {
      await setView("terminal"); await runTerminalCommand("cd /2025"); await runTerminalCommand("ls /2024");
      globalThis.companionHistory = state.terminalLines.at(-1);
      await runTerminalCommand("ls /"); await runTerminalCommand("grep xss /2023"); await runTerminalCommand("winners /2024"); await runTerminalCommand("favorites");
    });
    assert.equal(await page.evaluate(() => state.terminalCwd),"/2025");
    assert.match(await page.evaluate(() => companionHistory),/2024.*Official results/);
    assert.equal(await page.evaluate(() => state.terminalLines.includes(companionHistory)),true,"later commands retain earlier annual attribution");
    await page.evaluate(async () => {await setView("favourites"); state.savedYears=new Set(["2025"]); render();});
    assert.match(await page.locator("#official-view-context").innerText(),/2025/);
    await page.evaluate(() => {state.savedYears=new Set(["2024","2025"]); render();});
    assert.equal((await page.locator("#official-view-context").innerText()).trim(),"","multi-year saved results use shell hub");
    await page.goto(base + "?results=2013#desk");
    await page.waitForSelector("#pdf-dialog[open]");
    assert.match(await page.locator("#pdf-title").innerText(),/Preserved nominations and results/);
    assert.equal(await page.locator("#pdf-read-toggle").isVisible(),false);
    await page.locator("#pdf-dialog .document-official > summary").click();
    assert.match(await page.locator("#pdf-official-context").innerText(),/WhiteHat Security/);
    await page.evaluate(() => document.querySelector("#pdf-dialog").close());
    await page.waitForFunction(() => !documentDismissal);
    await page.setViewportSize({width:844,height:390});
    await page.evaluate(() => setView("terminal"));
    await page.locator("#view-fullscreen").click();
    await fits("landscape fullscreen");
    assert.ok(await page.locator(".companion-attribution a").isVisible());
    await capture("844-landscape-fullscreen");
    const credits=await browser.newPage();
    await credits.goto(base+"?year=2025#desk");await credits.waitForSelector(".discovery-record");
    await credits.evaluate(() => openArtifact(state.items.find(item => item.year === "2025" && item.mdPath).id));
    await credits.waitForSelector("#artifact-dialog[open]");
    await credits.waitForFunction(() => loadedSourceDetails.has("2025"));
    const provenance=credits.locator("#artifact-sources [data-official-provenance]");
    await provenance.evaluate(element => {element.open=true;});
    await provenance.locator(":scope > summary").focus();
    await credits.evaluate(() => renderArtifactSources(state.items.find(item => item.id === artifactCurrentId)));
    assert.ok(await provenance.locator(":scope > summary").evaluate(element => document.activeElement===element));
    assert.ok(await provenance.evaluate(element => element.open),"provenance disclosure survives metadata hydration");
    const organiserLink=credits.locator("#artifact-sources .official-context > p a").first();
    const destination=await organiserLink.getAttribute("href");await organiserLink.focus();
    await credits.evaluate(() => renderArtifactSources(state.items.find(item => item.id === artifactCurrentId)));
    assert.equal(await credits.evaluate(() => document.activeElement.getAttribute("href")),destination,"official anchor focus survives metadata hydration");
    await credits.close();console.log("SOURCE_CONTEXT_CASE disclosure and anchor focus survive lazy metadata rerenders");
    for (const mode of ["missing","invalid"]) {
      const cached=await browser.newPage();
      await cached.route("**/data/catalogue.json",async route => {
        const response=await route.fetch(), catalogue=await response.json();
        delete catalogue.officialHub;
        for (const year of catalogue.years) {delete year.officialContext;if(mode==="invalid")year.officialContext={schema:999};}
        await route.fulfill({json:catalogue});
      });
      await cached.goto(base+"?year=2025#desk");await cached.waitForSelector(".discovery-record");
      await cached.waitForFunction(() => !document.querySelector("#boot-screen"));
      assert.equal(await cached.evaluate(() => officialContextFor("2025")),null);
      assert.equal(await cached.locator(".companion-attribution a").getAttribute("href"),"https://portswigger.net/research/top-10-web-hacking-techniques");
      await cached.evaluate(() => openReader(state.items.find(item => item.year === "2025" && item.mdPath)));
      await cached.waitForSelector("#reader-dialog[open]");
      assert.ok((await cached.locator("#reader-title").innerText()).length>0,"matching research opens without optional context");
      await cached.close();
      console.log("CACHE_CASE new client / "+mode+" optional context: matching research and reader available");
    }
    const stale=await browser.newPage();let mismatch=true;
    await stale.route("**/data/collections/*.json?*",async route => {
      if(!mismatch)return route.continue();const response=await route.fetch(), shard=await response.json();shard.version="00000000000000000000";await route.fulfill({json:shard});
    });
    await stale.goto(base+"?year=2025#evidence");await stale.waitForSelector("#boot-retry");
    assert.match(await stale.locator("#boot-status").innerText(),/could not be loaded/);
    mismatch=false;await stale.locator("#boot-retry").click();
    await stale.waitForSelector(".case-slip");await stale.waitForFunction(() => !document.querySelector("#boot-screen"));
    await stale.close();console.log("CACHE_CASE mismatched required shard refused; retry restores matching research");
  }
  if(baseline) {
    await page.setViewportSize({width:844,height:390});await page.evaluate(() => setView("terminal"));
    await page.locator("#view-fullscreen").click();await fits("landscape fullscreen");await capture("844-landscape-fullscreen");
    console.log("CACHE_CASE original client accepts additive optional catalogue fields");
  }
} finally { await browser.close(); }
