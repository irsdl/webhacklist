import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildPages } from "./build-pages.mjs";
import { browserName, launchBrowser } from "./browser-test.mjs";

const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const read404 = await readFile(new URL("./404.html", import.meta.url), "utf8");
const browser = await launchBrowser();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${base}#desk`);
  await page.waitForSelector(".discovery-record");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  for (const standing of ["winner", "nominee", "addition", "held", "preliminary"]) {
    await page.selectOption("#desk-standing", standing);
    const expected = await page.evaluate(standing => state.items.filter(item => itemStanding(item) === standing).length, standing);
    assert.ok(expected > 0, `${standing}: live records exist`);
    assert.match(await page.locator("#desk-result-count").innerText(), new RegExp(`^${expected.toLocaleString()} results`));
    assert.ok(await page.locator("[data-discovery-record]").evaluateAll((cards, standing) => cards.every(card => {
      const item = state.items.find(item => item.id === card.dataset.discoveryRecord);
      return itemStanding(item) === standing && card.innerText.includes(itemStandingLabel(item));
    }), standing));
  }
  assert.deepEqual(errors, []);
  await context.close();

  for (const width of [1440, 390]) {
    const denied = await browser.newContext({ viewport: { width, height: 900 } });
    await denied.addInitScript(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (["websec-favourites-v1", "technique-vault-read-v1"].some(prefix => key === prefix || key.startsWith(`${prefix}:item:`))) throw new DOMException("Denied", "QuotaExceededError");
        return write.call(this, key, value);
      };
    });
    const page = await denied.newPage();
    await page.goto(`${base}#desk`);
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    const first = page.locator("[data-discovery-record]").first();
    const id = await first.getAttribute("data-discovery-record");
    await first.locator("[data-favourite]").click();
    assert.equal(await first.locator("[data-favourite]").getAttribute("aria-pressed"), "true");
    assert.match(await page.locator("#toast").innerText(), /session only/);
    await first.locator('[data-discovery-action="mark"]').click();
    assert.equal(await first.locator('[data-discovery-action="mark"]').getAttribute("aria-pressed"), "true");
    assert.match(await page.locator("#toast").innerText(), /session only/);
    assert.ok(await page.locator("#storage-status").isVisible());
    const toastBox = await page.locator("#toast").boundingBox();
    const noticeBox = await page.locator("#storage-status").boundingBox();
    assert.ok(toastBox.y + toastBox.height <= noticeBox.y,
      `the persistent notice does not cover the toast at ${width}px: ${JSON.stringify({ toastBox, noticeBox })}`);
    await first.locator("[data-artifact]").first().click();
    assert.ok(await page.locator("#artifact-dialog [data-storage-status]").isVisible(), "storage failure remains visible in the modal top layer");
    await page.reload();
    await page.waitForSelector(".discovery-record");
    await page.waitForFunction(id => state.items.some(item => item.id === id), id);
    assert.deepEqual(await page.evaluate(id => {
      const item = state.items.find(item => item.id === id);
      return [item.read, item.favourite];
    }, id), [false, false]);
    await denied.close();
  }

  for (const target of ["catalogue", "collection"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    let failing = true;
    await page.route(target === "catalogue" ? "**/data/catalogue.json" : "**/data/collections/*.json?*", route => failing ? route.fulfill({ status: 503, body: "Synthetic failure" }) : route.continue());
    await page.goto(`${base}#evidence`);
    await page.locator("#boot-retry").waitFor();
    assert.match(await page.locator("#boot-status").innerText(), /could not be loaded/);
    assert.doesNotMatch(await page.locator("#boot-status").innerText(), /http\.server/);
    assert.equal(await page.locator('#boot-status a').getAttribute("href"), "/research/");
    failing = false;
    await page.locator("#boot-retry").focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    assert.ok(await page.locator("#app-shell").isVisible());
    await context.close();
  }

  // Exercise the actual generated JavaScript-free surface using local responses.
  const pages = await buildPages();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  await noScript.route("**/research/**", route => {
    const key = new URL(route.request().url()).pathname.slice(1) + "index.html";
    return route.fulfill({ contentType: "text/html", body: pages.get(key) });
  });
  await noScript.route("**/reference/**", route => {
    const key = new URL(route.request().url()).pathname.slice(1) + "index.html";
    return route.fulfill({ contentType: "text/html", body: pages.get(key) });
  });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base);
  assert.ok(await staticPage.locator("noscript").isVisible());
  // With page JavaScript disabled, WebKit stalls Playwright's animation-frame
  // stability waiter. Check visibility explicitly, then send the real click;
  // each following selector still verifies that browser navigation succeeded.
  for (const selector of ['#boot-screen a[href="/research/"]', 'a[href^="/research/20"]', 'a[href^="/reference/"]']) {
    const link = staticPage.locator(selector).first();
    await link.waitFor({ state: "visible" });
    await link.click({ force: browserName === "webkit" });
  }
  assert.ok(await staticPage.locator("h1").isVisible());
  await noScript.close();

  const recovery = await browser.newContext();
  const missing = await recovery.newPage();
  await missing.route("**/mistyped/", route => route.fulfill({ status: 404, contentType: "text/html", body: read404 }));
  await missing.goto(new URL("mistyped/", base).href);
  assert.equal(await missing.locator('meta[http-equiv="refresh"]').count(), 0);
  assert.equal(await missing.locator('a[href="/research/"]').count(), 1);
  assert.equal(await missing.locator('a[href="/#desk"]').count(), 1);
  await recovery.close();
  console.log("Review browser regressions: standings, denied storage, reload, both boot retries, no-script reading and 404 recovery PASS");
} finally {
  await browser.close();
}
