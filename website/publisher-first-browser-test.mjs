import assert from "node:assert/strict";
import {launchBrowser} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.addInitScript(() => {
  globalThis.copiedRepositoryUrl = "";
  Object.defineProperty(navigator, "clipboard", {configurable:true,value:{writeText:async value => {
    if (globalThis.rejectClipboard) throw Error("Synthetic clipboard denial");
    globalThis.copiedRepositoryUrl = value;
  }}});
});
async function closeDocuments() {
  await page.evaluate(() => Promise.all([...document.querySelectorAll("dialog[open]")].map(dialog => new Promise(resolve => {
    dialog.addEventListener("close",resolve,{once:true});
    dialog.close();
  }))));
  await page.waitForFunction(() => !documentDismissal);
}
async function fits(label) {
  const size = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(size.scroll <= size.width + 1,`${label}: document overflows ${JSON.stringify(size)}`);
}
try {
  await page.goto(base + "?year=2026-ai#desk");
  await page.waitForSelector(".discovery-record");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  await page.evaluate(async () => {
    await ensureAllCollections();
    globalThis.publisherFixtureId = state.items.find(item => item.year === "2026-ai" && item.mdPath && item.pdfPath && !item.translated).id;
  });
  for (const viewport of [{width:1440,height:1000},{width:320,height:568}]) {
    await page.setViewportSize(viewport);
    for (const view of ["museum","library","signals","constellation","terminal","evidence","desk","time","favourites"]) {
      await page.evaluate(async view => {
        await setView(view);
        if (view === "time") discoveryState.timeYear = "2026-ai";
        else if (view === "favourites") state.savedYears = new Set(["2026-ai"]);
        else await selectArchiveYear("2026-ai");
        render();
      },view);
      assert.ok(await page.locator("#collection-notice .preliminary-notice").isVisible(),view+": shared notice");
      assert.match(await page.locator("#collection-notice").innerText(),/1 January 2027/);
      assert.doesNotMatch(await page.locator("#collection-notice").innerText(),/planning estimate|mid-January/);
      assert.match(await page.locator("#collection-notice").innerText(),/two weeks after PortSwigger announces the winners/);
      assert.equal(await page.locator("#collection-notice .participation-action").count(),0);
      await fits(`${view} ${viewport.width}`);
      if (view === "desk" && process.env.WEBSEC_CASE_CAPTURE === "1") console.log(`PUBLISHER_SCREENSHOT ${viewport.width}-collection ${(await page.screenshot()).toString("base64")}`);
      await page.evaluate(() => openArtifact(publisherFixtureId));
      await page.waitForSelector("#artifact-dialog[open]");
      await page.waitForFunction(() => loadedSourceDetails.has("2026-ai"));
      const actions = page.locator("#artifact-actions");
      assert.deepEqual(await actions.locator("a, button").evaluateAll(nodes => nodes.slice(0,4).map(node => node.textContent.trim())),["Read article ↗","Sources & details ("+await page.evaluate(()=>{const item=state.items.find(item=>item.id===publisherFixtureId);return item.sourceCount||item.links.length;})+")","View Markdown","View PDF"]);
      assert.equal(await page.locator("#open-results-pdf").count(),0);
      if (view === "desk" && process.env.WEBSEC_CASE_CAPTURE === "1") {
        const capture = viewport.width < 600 ? actions.locator(".artifact-copy-group").first() : actions;
        console.log(`PUBLISHER_SCREENSHOT ${viewport.width}-record ${(await capture.screenshot()).toString("base64")}`);
      }
      assert.equal(await actions.locator("[data-read-article]").getAttribute("href"), await page.evaluate(()=>readingDestination(state.items.find(item=>item.id===publisherFixtureId)).url));
      await actions.locator("[data-read-article]").focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(()=>document.activeElement.id),"open-artifact-sources");
      const copy = actions.getByRole("button",{name:"Copy Repo MD Link",exact:true});
      const expected = await copy.getAttribute("data-copy-repo");
      await copy.click();
      await page.waitForFunction(expected => copiedRepositoryUrl === expected,expected);
      await page.locator("#open-reader").click();
      await page.waitForSelector("#reader-dialog[open]");
      assert.match(await page.locator("#reader-copy-credit").innerText(),/Preserved Markdown copy/);
      assert.equal(await page.locator('meta[data-reader-indexing]').getAttribute("content"),"noindex");
      assert.ok(await page.locator("#reader-copy-credit a").first().getAttribute("href"));
      assert.equal(await page.locator("#reader-actions [data-copy-repo]").getAttribute("data-copy-repo"),expected);
      assert.ok(await page.locator("#reader-scroll").evaluate(node => node.clientHeight >= 40),view+": reading space");
      await fits(`${view} reader ${viewport.width}`);
      await closeDocuments();
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  // Following the primary action opens its exact external destination.
  await page.evaluate(() => openArtifact(publisherFixtureId));
  const destination = await page.locator("#artifact-actions [data-read-article]").getAttribute("href");
  await page.context().route(destination, route => route.fulfill({contentType:"text/html",body:"<title>Synthetic publisher destination</title>"}));
  const opened = page.waitForEvent("popup");
  await page.locator("#artifact-actions [data-read-article]").click();
  const publisher = await opened;
  await publisher.waitForLoadState();
  assert.equal(publisher.url(),destination);
  await publisher.close();
  await closeDocuments();
  await page.evaluate(() => {
    const item = state.items.find(item => item.id === publisherFixtureId);
    item.publication = {originalUrl:item.originalUrl,availability:"dead",checked:"2026-11-20"};
    openArtifact(item.id);
  });
  assert.equal(await page.locator("#artifact-actions [data-read-article]").count(),0);
  assert.match(await page.locator("#artifact-actions").innerText(),/No verified Web Archive snapshot/);
  await closeDocuments();
  await page.evaluate(() => {
    const sample = state.items.find(item => item.id === publisherFixtureId);
    const linkOnly = {...sample,id:"2026-ai-r-synthetic-link-only",title:"Synthetic link-only source",originalUrl:"https://research.example/link-only",publication:undefined,archiveStatus:"link-only",mdPath:"",pdfPath:"",originalMdPath:"",originalPdfPath:"",links:[{url:"https://research.example/link-only",label:"External source",details:{preservation:"link-only"}}]};
    state.items.push(linkOnly);
    openArtifact(linkOnly.id);
  });
  assert.equal(await page.locator("#artifact-actions [data-copy-repo]").count(),0);
  assert.equal(await page.locator("#open-reader, #open-pdf-reader").count(),0);
  assert.equal(await page.locator("#artifact-actions [data-read-article]").getAttribute("href"),"https://research.example/link-only");
  await closeDocuments();
  await page.evaluate(() => {
    const item = state.items.find(item => item.id === publisherFixtureId);
    item.publication.snapshot = {url:`https://web.archive.org/web/20250101000000/${item.originalUrl}`,verified:true,checked:"2026-11-20"};
    openArtifact(item.id);
  });
  assert.match(await page.locator("#artifact-actions [data-read-article]").innerText(),/Read article — Web Archive/);
  assert.match(await page.locator("#artifact-actions [data-read-article]").getAttribute("href"),/^https:\/\/web.archive.org/);
  await page.evaluate(() => {globalThis.rejectClipboard=true;document.execCommand=()=>{throw Error("Synthetic legacy clipboard denial");};});
  await page.locator("#artifact-actions [data-copy-repo]").first().click();
  const fallback = page.locator("#artifact-dialog .repo-copy-fallback input");
  await fallback.waitFor();
  assert.match(await fallback.inputValue(),/^https:\/\/github.com\/irsdl\/webhacklist\/blob\/master\//);
  assert.ok(await fallback.evaluate(node => document.activeElement === node));
  await closeDocuments();
  // Translations and companion documents use their own paths and credits.
  await page.evaluate(async () => {
    const item = state.items.find(item=>item.translated && item.originalMdPath && item.originalPdfPath);
    globalThis.translationFixtureId=item.id;
    await openArtifact(item.id);
  });
  await page.waitForSelector("#open-original-reader");
  assert.ok(await page.locator("#artifact-actions").getByRole("button",{name:"Copy Repo MD Link (original language)",exact:true}).count());
  await page.locator("#open-original-reader").click();
  await page.waitForSelector("#reader-dialog[open]");
  assert.match(await page.locator("#reader-copy-credit").innerText(),/Original .* preserved copy/);
  await closeDocuments();
  await page.evaluate(() => openArtifact(state.items.find(item=>item.year==="2025" && item.rank===1).id));
  await page.waitForSelector("#artifact-dialog[open]");
  assert.equal(await page.locator("#open-results-pdf").count(),0);
  assert.ok(await page.locator("#artifact-sources [data-official-provenance] a[href$='.pdf']").count());
  await closeDocuments();
  for (const year of ["2016-17","2019","2024","2025"]) {
    const reviewed = await page.evaluate(year => state.items.filter(item=>item.year===year && item.exclusion).map(item=>({rank:item.rank,membership:itemListMembership(item),label:itemStandingLabel(item),explanation:itemStandingContext(item)})),year);
    assert.equal(reviewed.length,year==="2016-17" ? 2 : year==="2024" ? 3 : 1);
    assert.ok(reviewed.every(item=>item.rank===null && item.membership==="original" && item.label==="Held out — conflict of interest" && item.explanation.length>40));
  }
  const staticFixture = await page.evaluate(() => {
    const item = state.items.find(item => item.id === publisherFixtureId);
    return {id:item.id,md:item.mdPath,pdf:item.pdfPath};
  });
  const standaloneReader = await page.evaluate(() => inSitePdfReaderUrl("https://webhacklist.com/archived-references/pdf/2025/example.pdf").split("?")[0]);
  await page.goto(new URL("research/2026-ai/",base).href);
  assert.match(await page.locator(".preliminary-notice").innerText(),/1 January 2027/);
  const raw = await page.request.get(standaloneReader);
  assert.equal(raw.status(),200);
  assert.match(await raw.text(),/<meta name="robots" content="noindex">/);
  for (const file of [staticFixture.md,staticFixture.pdf,"original-listings/2025-top10.pdf"]) {
    const response = await page.request.head(new URL(file,base).href);
    assert.equal(response.status(),200);
    assert.equal(response.headers()["x-robots-tag"],"noindex");
  }
  const recordUrl = await page.locator(`a.entry-title[href$="#appearance-${encodeURIComponent(staticFixture.id)}"]`).getAttribute("href");
  await page.goto(new URL(recordUrl,base).href);
  assert.deepEqual(await page.locator(".record > .actions").first().locator("a").allTextContents(),["Read article ↗","Sources & details","View Markdown","View PDF"]);
  const staticCopy = page.getByRole("button",{name:"Copy Repo MD Link",exact:true}).first();
  const expectedRepoUrl = await staticCopy.getAttribute("data-copy-repo");
  await staticCopy.click();
  await page.waitForFunction(url => copiedRepositoryUrl === url,expectedRepoUrl);
  await page.evaluate(() => {globalThis.rejectClipboard=true;});
  await staticCopy.click();
  const staticFallback = page.locator("[data-copy-fallback]");
  await staticFallback.waitFor();
  assert.equal(await staticFallback.inputValue(),expectedRepoUrl);
  assert.match(await page.locator("[data-copy-status]").innerText(),/Clipboard unavailable/);
  console.log("Publisher first: every theme at desktop/320px, keyboard order, repo clipboard success/failure, preserved readers, translations, exclusions, annual provenance and static banner passed");
  assert.deepEqual(errors,[]);
} finally { await browser.close(); }
