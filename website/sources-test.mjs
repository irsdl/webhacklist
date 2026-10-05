// Per-source attribution, document selection and progressive loading across views.
import assert from "node:assert/strict";
import {launchBrowser} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const views = ["evidence", "museum", "library", "time", "signals", "constellation", "terminal", "desk", "favourites"];
const errors = [];
let checks = 0;
let savedSourceUrl = "";
try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    const requests = [];
    page.on("request", request => { if (request.url().includes("/data/sources/")) requests.push(request.url()); });
    await page.goto(`${base}#desk`);
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    assert.equal(requests.length, 0, "Browsing collections does not load source details");
    await page.evaluate(() => ensureAllCollections());
    // An explicitly cited video needs no companion-talk metadata to be playable.
    await context.route("https://www.youtube-nocookie.com/embed/**", route => route.fulfill({
      contentType: "text/html", body: "<!doctype html><title>Local video fixture</title>"
    }));
    const windsurf = await page.evaluate(() => state.items.find(item => item.originalUrl === "https://www.youtube.com/watch?v=23Mz7qcRz50")?.id);
    assert.ok(windsurf, "Windsurf video-only regression fixture exists");
    for (const year of await page.evaluate(() => YEAR_FILES)) {
      await page.evaluate(async year => { await setView("evidence"); await selectArchiveYear(year); }, year);
      const ordered = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".investigation-card")];
        const saved = cards.filter(card => !card.classList.contains("evidence-stub"));
        const external = cards.filter(card => card.classList.contains("evidence-stub"));
        return !saved.length || !external.length ||
          Math.max(...saved.map(card => card.offsetTop)) < Math.min(...external.map(card => card.offsetTop));
      });
      assert.ok(ordered, `${year}/${width}: external-only cards are below all preserved cards`);
    }
    await page.evaluate(() => selectArchiveYear("2025"));
    const videoCard = page.locator(`[data-artifact="${windsurf}"]`);
    assert.equal(await videoCard.locator(".record-video").count(), 1);
    assert.match(await videoCard.innerText(), /Video — play in details/i);
    await videoCard.click();
    await page.locator("#artifact-talk .talk-play-action").click();
    assert.match(await page.locator("#artifact-talk iframe").getAttribute("src"), /\/embed\/23Mz7qcRz50\?/);
    await page.locator("#artifact-dialog .dialog-close").click();
    await page.waitForFunction(() => !document.querySelector("#artifact-dialog").open && !document.querySelector("#artifact-talk iframe"));
    assert.equal(await page.locator("#artifact-talk iframe").count(), 0, "Closing the record removes its player");
    // Subsequent checks track progressive fetching for their own collection.
    requests.length = 0;
    await page.evaluate(() => selectArchiveYear("2026-ai"));
    const id = await page.evaluate(() => state.items.find(item => item.links.some(link => link.url === "https://wp2shell.com/"))?.id);
    assert.ok(id, "wp2shell research fixture exists");
    for (const view of views) {
      await page.evaluate(view => setView(view), view);
      for (const appearance of ["desk", "time"].includes(view) ? ["dark", "light"] : ["dark"]) {
        if (["desk", "time"].includes(view)) await page.locator(`[data-discovery-value="${appearance}"]`).click();
        await page.evaluate(id => openArtifact(id), id);
        await page.waitForFunction(() => loadedSourceDetails.has("2026-ai"));
        await page.locator("#open-artifact-sources").click();
        assert.ok(await page.locator(".source-card").count() >= 4);
        const main = page.locator('.source-card[data-source-index="0"]');
        const companion = page.locator('.source-card[data-source-index="3"]');
        assert.match(await main.locator("summary").innerText(), /Main source[\s\S]*Adam Kues/);
        assert.match(await companion.locator("summary").innerText(), /Escalation to root \(Calif\)[\s\S]*The WordPress Chain Massacre[\s\S]*Calif/);
        await companion.locator("summary").focus();
        await page.keyboard.press("Enter");
        assert.ok(await companion.evaluate(node => node.open), "Keyboard opens source details");
        assert.match(await companion.locator(".source-summary").innerText(), /Serializable/);
        assert.equal(await companion.locator(".source-actions a").getAttribute("href"), "https://blog.calif.io/p/the-wordpress-chain-massacre");
        assert.ok(await page.locator("#artifact-dialog").evaluate(node => node.scrollWidth <= node.clientWidth + 1), `${view}/${width}: source panel fits`);
        await page.locator('[data-source-read="3"]').click();
        await page.waitForSelector("#reader-dialog[open] .archive-warning");
        assert.equal(await page.locator("#reader-title").innerText(), "The WordPress Chain Massacre");
        assert.match(await page.locator("#reader-kicker").innerText(), /Calif/i);
        assert.match(new URL(page.url()).searchParams.get("source"), /^source-[a-f0-9]{20}$/);
        await page.locator("#reader-sources").click();
        await page.waitForSelector("#artifact-dialog[open]");
        assert.ok(!await page.locator("#reader-dialog").evaluate(node => node.open));
        // Close rows for the next theme's keyboard-open check.
        await page.evaluate(() => document.querySelectorAll(".source-card").forEach(node => { node.open = false; }));
        await page.locator("#artifact-dialog .dialog-close").click();
        checks++;
      }
    }
    assert.equal(requests.length, 1, "A collection's details are fetched once across themes");
    const cacheInjection = await page.evaluate(() => state.items.find(item => item.links.some(link => link.url === "https://www.yeswehack.com/lab/research-cache-key-injection"))?.id);
    assert.ok(cacheInjection, "Cache key injection regression fixture exists");
    for (const view of views) {
      await page.evaluate(view => setView(view), view);
      await page.evaluate(id => openArtifact(id), cacheInjection);
      assert.ok(await page.locator("#artifact-talk").isHidden(), `${view}/${width}: background paper does not lend its talk player`);
      assert.equal(await page.locator("#artifact-actions .video-action").count(), 0);
      assert.ok(await page.evaluate(id => {
        const item = state.items.find(item => item.id === id);
        return !item.videos?.length && !videoMark(item) && !videoLabel(item);
      }, cacheInjection), "Background talk does not create a recording badge or filter match");
      await page.locator("#open-artifact-sources").click();
      assert.match(await page.locator("#artifact-sources").innerText(), /Web Cache Entanglement/);
      await page.locator("#artifact-dialog .dialog-close").click();
    }
    if (width === 1440) {
      await page.evaluate(id => openArtifact(id), id);
      await page.locator('[data-source-index="2"] summary').click();
      await page.locator('[data-source-read="2"]').click();
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      for (const selected of [true, false]) {
        await page.locator("#reader-read-toggle").click();
        await page.locator("#reader-favourite-toggle").click();
        assert.equal(await page.locator("#reader-read-toggle").getAttribute("aria-pressed"), String(selected));
        assert.equal(await page.locator("#reader-favourite-toggle").getAttribute("aria-pressed"), String(selected));
        assert.ok(await page.evaluate(selected => {
          const source = state.readerItem;
          const parent = state.items.find(item => item.id === source.id);
          return source.read === selected && parent.read === selected && source.favourite === selected && parent.favourite === selected;
        }, selected), "Read/save toggles update both the selected source and its research record");
      }
      const shared = page.url();
      savedSourceUrl = shared;
      await page.reload();
      await page.waitForSelector("#reader-dialog[open] .archive-warning");
      assert.equal(page.url(), shared, "Companion Markdown deep link survives reload");
      assert.equal(await page.evaluate(() => state.readerItem.originalUrl), "https://wp2shell.com/");
      await page.locator("#reader-open-pdf").click();
      await page.waitForSelector("#pdf-dialog[open]");
      assert.equal(await page.evaluate(() => state.pdfItem.sourceIndex), 2);
      const pdfShared = page.url();
      await page.reload();
      await page.waitForSelector("#pdf-dialog[open]");
      assert.equal(page.url(), pdfShared, "Companion PDF deep link survives reload");
      assert.equal(await page.evaluate(() => state.pdfItem.originalUrl), "https://wp2shell.com/");
      await page.locator("#pdf-open-markdown").click();
      await page.waitForSelector("#reader-dialog[open]");
      assert.equal(await page.evaluate(() => state.readerItem.sourceIndex), 2);
      await page.locator("#reader-open-pdf").click();
      await page.locator("#pdf-sources").click();
      await page.waitForSelector("#artifact-dialog[open]");
      assert.ok(!await page.locator("#pdf-dialog").evaluate(node => node.open));
      const isolated = await page.evaluate(id => {
        const parent = state.items.find(item => item.id === id);
        const fixture = { ...parent, links: [{ label: "PDF only", url: "https://example.org/paper", pdfPath: parent.pdfPath }] };
        const source = sourceItemFor(fixture, 0);
        const markup = sourcePanelMarkup({ ...fixture, links: [{ ...fixture.links[0], url: "javascript:alert(1)", details: { title: '<img src=x onerror="alert(1)">', summary: '<script>alert(1)</script>' } }] });
        return { md: source.mdPath, authors: source.authors, summary: source.summary, invalid: sourceItemFor(fixture, 1), markup };
      }, id);
      assert.equal(isolated.md, "", "PDF-only source never borrows sibling Markdown");
      assert.deepEqual(isolated.authors, []);
      assert.equal(isolated.summary, "");
      assert.equal(isolated.invalid, null);
      assert.ok(!isolated.markup.includes("<script>") && !isolated.markup.includes("<img") && !isolated.markup.includes('href="javascript:'));
      await page.screenshot({ path: "/tmp/wp2shell-sources-desktop.png" });
    }
    await context.close();
  }
  // Metadata outages retain original/copy actions; retry and stale responses
  // must not overwrite a different record opened while the request was pending.
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  let fail = true;
  await page.route("**/data/sources/2026-ai.json?*", route => fail ? route.fulfill({ status: 503, body: "unavailable" }) : route.continue());
  await page.goto(`${base}#desk`);
  await page.waitForSelector(".discovery-record");
  const id = await page.evaluate(() => state.items.find(item => item.links.some(link => link.url === "https://wp2shell.com/"))?.id);
  await page.evaluate(id => openArtifact(id), id);
  await page.waitForSelector("[data-source-retry]");
  assert.equal(await page.locator(".source-actions a").count(), 4);
  assert.equal(await page.locator("[data-source-read]").count(), 4);
  fail = false;
  await page.locator("[data-source-retry]").click();
  await page.waitForFunction(() => loadedSourceDetails.has("2026-ai"));
  await page.waitForSelector("[data-source-retry]", { state: "detached" });
  await page.evaluate(() => loadedSourceDetails.delete("2026-ai"));
  await page.unroute("**/data/sources/2026-ai.json?*");
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route("**/data/sources/2026-ai.json?*", async route => { await gate; await route.continue(); });
  await page.evaluate(id => openArtifact(id), id);
  await page.waitForFunction(() => sourceDetailRequests.has("2026-ai"));
  const other = await page.evaluate(async () => { const item = state.items.find(item => item.year === "2006"); await openArtifact(item.id); return item.id; });
  release();
  await page.waitForFunction(() => loadedSourceDetails.has("2026-ai"));
  assert.equal(await page.locator("#artifact-sources").getAttribute("data-item"), other);
  await context.close();
  // Stable source IDs survive changes in companion ordering.
  const reorderedContext = await browser.newContext();
  const reorderedPage = await reorderedContext.newPage();
  reorderedPage.on("pageerror", error => errors.push(error.message));
  await reorderedPage.route("**/data/sources/2026-ai.json?*", async route => {
    const response = await route.fetch();
    const body = await response.json();
    for (const sources of Object.values(body.items)) sources.reverse();
    await route.fulfill({ response, json: body });
  });
  await reorderedPage.goto(savedSourceUrl);
  await reorderedPage.waitForSelector("#reader-dialog[open] .archive-warning");
  assert.equal(await reorderedPage.evaluate(() => state.readerItem.originalUrl), "https://wp2shell.com/", "Reordering must not change the shared document");
  await reorderedPage.locator("#reader-sources").click();
  assert.match(await reorderedPage.locator('.source-card[data-source-index="0"] summary').innerText(), /Main source[\s\S]*Adam Kues/);
  const outbound = await reorderedPage.evaluate(() => {
    const item = state.items.find(item => item.links.some(link => link.url === "https://wp2shell.com/"));
    return item.links.map((link, index) => ({ link, index })).find(({ link }) => link.details?.preservation === "link-only")?.index;
  });
  assert.ok(Number.isInteger(outbound), "Fixture has a deliberately outbound companion");
  assert.equal(await reorderedPage.locator(`[data-source-index="${outbound}"] [data-source-read], [data-source-index="${outbound}"] [data-source-pdf]`).count(), 0);
  await reorderedContext.close();
  assert.deepEqual(errors, []);
  console.log(`Source panels: PASS (${checks} theme/viewport/appearance combinations, companion MD/PDF deep links, lazy loads, retry, stale responses and source isolation)`);
} finally {
  await browser.close();
}
