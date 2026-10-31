// Exercise shared search URLs through the production UI, in the offline browser.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {launchBrowser, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const action = name => `[data-discovery-action="${name}"]`;
const errors = [];
const axeSource = await readFile(process.env.AXE_SOURCE || fileURLToPath(import.meta.resolve("axe-core/axe.min.js")), "utf8");
async function auditHandoff(page, label) {
  await page.evaluate(axeSource);
  const violations = await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(a => typeof CSSTransition !== "undefined" && a instanceof CSSTransition).map(a => a.finished.catch(() => {})));
    return (await axe.run("#global-results", {runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}})).violations;
  });
  assert.deepEqual(violations.map(v => ({id:v.id,nodes:v.nodes.map(n => n.target)})), [], label);
}
async function makeContext(options = {}) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {value:{saveData:true}, configurable:true});
    Object.defineProperty(navigator, "clipboard", {value:{writeText:async text => { window.copiedSearch = text; }}, configurable:true});
  });
  context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
  return context;
}
async function open(page, search = "") {
  await page.goto(`${base}${search}#desk`);
  await page.waitForSelector("#desk-query");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
}
async function complete(page) {
  await page.waitForFunction(() => loadedCollections.size === YEAR_FILES.length);
}
async function documentDismissed(page) {
  // A native dialog's open flag clears before its close event, queued history
  // traversal and route/focus restoration finish. Begin the next UI action only
  // once the original Desk visit, including its unlocked scroll, has returned.
  await page.waitForFunction(() => !document.querySelector("dialog[open]")
    && !documentDismissal && !restoringRoute && !history.state?.archiveDocument
    && dialogUnlockFrame === null && lockedDialogScrollY === null);
}
async function ui(page) {
  return page.evaluate(() => ({
    q:document.querySelector("#desk-query").value, author:document.querySelector("#desk-author").value,
    year:document.querySelector("#desk-year").value, topic:document.querySelector("#desk-topic").value,
    standing:document.querySelector("#desk-standing").value, saved:document.querySelector("#desk-saved").value,
    read:document.querySelector("#desk-read").value, sort:document.querySelector("#desk-sort").value,
    video:document.querySelector("#desk-video").value,
    compact:document.querySelector('[data-discovery-action="desk-compact"]').getAttribute("aria-pressed"),
    ids:[...document.querySelectorAll("[data-discovery-record]")].map(el => el.dataset.discoveryRecord)
  }));
}
try {
  const context = await makeContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  await open(page);
  assert.equal(await page.locator("#desk-query").getAttribute("maxlength"), "300");
  assert.equal(await page.locator("#desk-author").getAttribute("maxlength"), "120");
  await complete(page);
  const candidate = await page.evaluate(() => {
    const item = state.items.find(item => item.year === "2024" && item.rank && item.authors?.length && item.videos?.length && item.mdPath);
    return {id:item.id,topic:item.topic,author:item.authors[0],word:item.title.split(/\s+/)[0]};
  });
  await page.selectOption("#desk-year", "2024");
  await page.locator(`[data-favourite="${candidate.id}"]`).click();
  await page.locator(`${action("mark")}[data-discovery-value="${candidate.id}"]`).click();
  await page.locator("#desk-query").fill(candidate.word);
  await page.locator("#desk-author").fill(candidate.author);
  for (const [name, value] of Object.entries({topic:candidate.topic,standing:"winner",read:"read",saved:"saved",sort:"title",video:"with"})) {
    await page.selectOption(`#desk-${name}`, value);
  }
  await page.locator(action("desk-compact")).click();
  const combined = await ui(page);
  assert.ok(combined.ids.includes(candidate.id), "all combined filters retain the matching saved/read record");
  assert.match(await page.locator("#desk-local-state-note").innerText(), /recipient.*local browser records.*does not share/s);
  await page.locator(action("desk-share")).focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => typeof copiedSearch === "string");
  const shared = await page.evaluate(() => copiedSearch);
  const params = new URL(shared).searchParams;
  assert.equal(params.get("q"), candidate.word);
  assert.equal(params.get("author"), candidate.author);
  assert.equal(params.get("saved"), "saved");
  assert.equal(params.get("compact"), "1");
  await page.reload();
  await page.waitForSelector("#desk-query");
  assert.deepEqual(await ui(page), combined, "combined search and locally persisted records restore on reload");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  const recipient = await makeContext();
  const other = await recipient.newPage();
  await other.goto(shared);
  await other.waitForSelector("#desk-query");
  assert.deepEqual({...await ui(other),ids:[]}, {...combined,ids:[]});
  assert.equal(await other.locator(".discovery-record").count(), 0, "recipient does not inherit the sender's local saved/read records");
  await recipient.close();

  // Opening a document adds one visit; closing/Forward restores its Desk and theme.
  const deskUrl = page.url();
  await page.locator(`${action("read")}[data-discovery-value="${candidate.id}"]`).click();
  await page.waitForSelector("#reader-dialog[open] .archive-warning");
  assert.equal(new URL(page.url()).searchParams.get("saved"), "saved");
  assert.equal(new URL(page.url()).searchParams.get("q"), candidate.word);
  await page.locator("#reader-theme-toggle").click();
  const readerUrl = page.url();
  await page.keyboard.press("Escape");
  await page.waitForURL(deskUrl);
  await documentDismissed(page);
  assert.deepEqual(await ui(page), combined);
  await page.goForward();
  await page.waitForSelector("#reader-dialog[open]");
  assert.equal(page.url(), readerUrl);
  const readingTheme = await page.locator("#reader-dialog").getAttribute("data-reading-theme");
  await page.reload();
  await page.waitForSelector("#reader-dialog[open] .archive-warning");
  assert.equal(await page.locator("#reader-dialog").getAttribute("data-reading-theme"), readingTheme);
  assert.deepEqual(await ui(page), combined);
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("#reader-dialog").open);
  await documentDismissed(page);
  await page.locator('.discovery-record [data-artifact]').nth(1).click();
  await page.waitForSelector("#artifact-dialog[open]");
  assert.equal(new URL(page.url()).searchParams.get("author"), candidate.author);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("#artifact-dialog").open);
  await documentDismissed(page);

  // Handoff clears restrictive Desk state, and the link itself works in a fresh tab.
  await page.locator("#global-search").fill("HTTP");
  await page.waitForFunction(() => document.querySelectorAll("#global-results-list [data-artifact]").length === 40).catch(async error => {
    console.log("SHAREABLE_SEARCH_DIAGNOSTIC " + JSON.stringify(await page.evaluate(() => ({
      url:location.href,query:state.query,input:document.querySelector("#global-search").value,
      results:document.querySelectorAll("#global-results-list [data-artifact]").length,
      label:document.querySelector("#global-results-label").textContent,
      hidden:document.querySelector("#global-results").hidden,
      loaded:loadedCollections.size,total:YEAR_FILES.length,availableHttpResults:queryItems(state.items,"HTTP").length,
      dialogs:[...document.querySelectorAll("dialog[open]")].map(node => node.id),
      routeBusy:{dismissal:Boolean(documentDismissal),restoring:restoringRoute,unlockFrame:dialogUnlockFrame,lockedY:lockedDialogScrollY},
      history:history.state,view:state.view,focused:document.activeElement?.id,
      desk:{query:discoveryState.deskQuery,author:discoveryState.deskAuthor,year:discoveryState.deskYear,saved:discoveryState.deskSaved,read:discoveryState.deskRead}
    }))));
    throw error;
  });
  assert.match(await page.locator("#global-results-label").innerText(), /showing the first 40/i);
  await auditHandoff(page, "dark Desk global handoff");
  await page.locator("#close-global-results").click();
  await page.locator('[data-discovery-action="theme"][data-discovery-value="light"]').click();
  await page.locator("#global-search").fill("HTTP");
  await auditHandoff(page, "light Desk global handoff");
  const handoff = page.locator("[data-desk-handoff]");
  const handoffUrl = await handoff.getAttribute("href");
  assert.equal(new URL(handoffUrl).searchParams.get("q"), "HTTP");
  assert.deepEqual([...new URL(handoffUrl).searchParams.keys()], ["q"]);
  const originalUrl = page.url();
  const opened = context.waitForEvent("page");
  await handoff.click({modifiers:["Control"]});
  const linked = await opened;
  await linked.waitForSelector("#desk-query");
  await complete(linked);
  assert.equal(await linked.locator("#desk-query").inputValue(), "HTTP", "modified click follows the full URL into a separate Desk tab");
  assert.equal(await linked.locator("#desk-year").inputValue(), "all");
  assert.equal(page.url(), originalUrl, "modified click does not replace the sender's restrictive Desk route");
  await linked.close();
  await handoff.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.querySelector("#desk-query").value === "HTTP" && document.activeElement.id === "desk-query");
  await complete(page);
  const allHttp = await ui(page);
  assert.equal(allHttp.year, "all");
  assert.equal(allHttp.saved, "all");
  assert.equal(allHttp.read, "all");
  assert.equal(allHttp.compact, "false");
  assert.ok(Number((await page.locator("#desk-result-count").innerText()).replace(/[^0-9].*$/s, "")) > 40);
  await page.locator(action("desk-next")).click();
  await page.locator(action("desk-next")).click();
  assert.equal(new URL(page.url()).searchParams.get("page"), "3");
  const thirdPage = await ui(page);
  await page.reload();
  await page.waitForSelector("#desk-query");
  await complete(page);
  assert.deepEqual(await ui(page), thirdPage, "page 3 survives progressive reload");
  assert.match(await page.locator(".discovery-pagination").innerText(), /Page 3 of/);
  await page.selectOption("#desk-sort", "oldest");
  await page.goBack();
  await page.waitForFunction(() => document.querySelector("#desk-sort").value === "newest");
  assert.deepEqual(await ui(page), thirdPage);
  await page.goForward();
  await page.waitForFunction(() => document.querySelector("#desk-sort").value === "oldest");
  await page.locator(action("desk-reset")).click();
  const beforeTyping = await page.evaluate(() => history.length);
  await page.locator("#desk-query").pressSequentially("cache", {delay:40});
  assert.equal(await page.evaluate(() => history.length), beforeTyping + 1, "typing a burst makes one history entry");
  await page.goBack();
  await page.waitForFunction(() => document.querySelector("#desk-query").value === "");
  await page.goForward();
  await page.waitForFunction(() => document.querySelector("#desk-query").value === "cache");
  const restrictedQuery = await page.evaluate(() => `year:2006 ${state.items.find(item => item.year === "2006").title.split(/\s+/).map(word => `title:${word}`).join(" ")}`);
  console.log("Shared Desk: combined filters, recipient-local disclosure, copied link, reload, read/artifact routes, reader theme, history, typing coalescing and >40 global handoff pass");
  await context.close();

  // Hold one relevant shard and fail another. A page request is not inferred from
  // partial counts, including when the available matching count is initially zero.
  const partialContext = await makeContext();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let failed = true;
  await partialContext.route("**/data/collections/2006.json*", async route => { await held; await route.continue(); });
  await partialContext.route("**/data/collections/2007.json*", route => failed ? route.fulfill({status:503,body:"Synthetic failure"}) : route.continue());
  const partial = await partialContext.newPage();
  await open(partial, `?q=${encodeURIComponent(restrictedQuery)}&page=3`);
  await partial.waitForSelector(action("retry"));
  assert.equal(new URL(partial.url()).searchParams.get("page"), "3");
  assert.match(await partial.locator(".discovery-pagination").innerText(), /Page 3/);
  assert.match(await partial.locator("#desk-results").innerText(), /requested page is preserved/);
  release();
  await partial.waitForFunction(() => loadedCollections.has("2006"));
  assert.equal(new URL(partial.url()).searchParams.get("page"), "3", "a failed relevant collection preserves page even after other shards finish");
  failed = false;
  await partial.locator(action("retry")).click();
  await complete(partial);
  await partial.waitForFunction(() => !new URL(location.href).searchParams.has("page"));
  assert.match(await partial.locator(".discovery-pagination").innerText(), /Page 1 of 1/);
  assert.ok(await partial.locator(".discovery-record").count());
  await partialContext.close();
  console.log("Progressive URL pages: delayed and failed relevant shards preserve page 3; Retry and complete results legitimately clamp to page 1");

  const invalidContext = await makeContext({viewport:{width:320,height:568}, ...(mobileEmulation ? {isMobile:true,hasTouch:true} : {})});
  const invalid = await invalidContext.newPage();
  await open(invalid, "?year=2024&q=one&q=two&author=%00evil&topic=constructor&standing=bad&read=yes&saved=bad&sort=random&video=yes&page=10001&compact=2&unexpected=active");
  const defaults = await ui(invalid);
  assert.equal(defaults.q, "");
  assert.equal(defaults.author, "");
  assert.equal(defaults.topic, "all");
  assert.equal(defaults.standing, "all");
  assert.equal(defaults.saved, "all");
  assert.equal(defaults.read, "all");
  assert.equal(defaults.sort, "newest");
  assert.equal(defaults.video, "all");
  assert.equal(defaults.compact, "false");
  await invalid.locator(action("desk-share")).click();
  assert.equal(new URL(await invalid.evaluate(() => copiedSearch)).search, "?year=2024");
  await open(invalid, `?year=2024&q=${"x".repeat(301)}&author=${"y".repeat(121)}&page=-3`);
  assert.equal(await invalid.locator("#desk-query").inputValue(), "");
  assert.equal(await invalid.locator("#desk-author").inputValue(), "");
  await open(invalid, `?year=2024&unknown=${"x".repeat(8300)}&q=HTTP`);
  assert.equal(await invalid.locator("#desk-query").inputValue(), "");
  assert.equal(await invalid.locator("#desk-year").inputValue(), "all");
  const hostile = '<img src=x onerror="window.searchExecuted=true">';
  await open(invalid, `?year=2024&q=${encodeURIComponent(hostile)}`);
  assert.equal(await invalid.locator("#desk-query").inputValue(), hostile);
  assert.equal(await invalid.locator("#desk-filter-form img").count(), 0);
  assert.equal(await invalid.evaluate(() => window.searchExecuted), undefined);
  await invalid.locator(action("desk-reset")).click();
  await invalid.locator("#global-search").fill("HTTP");
  await invalid.waitForSelector("[data-desk-handoff]");
  await auditHandoff(invalid, "320px phone global handoff");
  await invalid.locator("[data-desk-handoff]").click();
  await invalid.waitForFunction(() => document.activeElement.id === "desk-query");
  await complete(invalid);
  assert.equal(await invalid.locator("#desk-query").inputValue(), "HTTP");
  assert.equal(await invalid.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "new controls fit a 320px phone");
  await invalid.locator(action("desk-share")).focus();
  await invalid.keyboard.press("Enter");
  assert.equal(new URL(await invalid.evaluate(() => copiedSearch)).searchParams.get("q"), "HTTP");
  assert.equal(await invalid.locator(action("desk-share")).evaluate(el => Boolean(el.closest("[inert]"))), false);
  await invalid.evaluate(() => {
    navigator.clipboard.writeText = async () => { throw new Error("Synthetic clipboard denial"); };
    document.execCommand = () => false;
  });
  await invalid.keyboard.press("Enter");
  await invalid.waitForFunction(() => document.querySelector("#toast").textContent.includes("address bar"));
  assert.doesNotMatch(await invalid.locator("#toast").innerText(), /link copied/i);
  assert.equal(new URL(invalid.url()).searchParams.get("q"), "HTTP", "address bar remains a usable share fallback");
  assert.equal(await invalid.evaluate(() => document.activeElement.dataset.discoveryAction), "desk-share");
  await invalid.evaluate(() => { document.execCommand = command => { if (command !== "copy") return false; window.fallbackSearch = document.activeElement.value; return true; }; });
  await invalid.keyboard.press("Enter");
  await invalid.waitForFunction(() => typeof fallbackSearch === "string");
  assert.equal(new URL(await invalid.evaluate(() => fallbackSearch)).searchParams.get("q"), "HTTP");
  assert.match(await invalid.locator("#toast").innerText(), /Search link copied/);
  await invalidContext.close();
  assert.deepEqual(errors, []);
  console.log("Boundaries/mobile: malformed, duplicate, oversized and inert parameters; 320px handoff, share and keyboard controls pass");
  console.log("Shareable discovery test: PASS");
} finally { await browser.close(); }
