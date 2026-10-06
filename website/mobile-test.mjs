// Touch navigation and compact-header regressions against the local website.
import assert from "node:assert/strict";
import {launchBrowser, browserName, mobileEmulation} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:8000/website/";
const views = ["desk", "time", "museum", "library", "signals", "constellation", "terminal", "evidence", "favourites"];
const errors = [];
const screens = [{width:320,height:568},{width:390,height:844},{width:768,height:1024}];
async function ready(page, view) {
  await page.waitForFunction((view) => document.documentElement.dataset.view === view && document.querySelector('#view-root').textContent.trim().length > 50, view);
  if (["desk","time"].includes(view)) await page.waitForSelector(".discovery-record");
  if (view === "constellation") await page.waitForSelector("#constellation-canvas");
}
async function fits(page, selector, label) {
  assert.ok(await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left >= -1 && rect.right <= innerWidth + 1 && rect.width > 0;
  }), `${label} fits the viewport`);
}
async function headerStaysAboveContent(page, view) {
  // Include the board's elevated interaction state: touch browsers can retain
  // hover after a tap, and dragging uses an even higher content layer.
  const target = page.locator(view === "evidence"
    ? ".investigation-card.top-evidence" : "#view-root button:visible").first();
  if (view === "evidence") await target.evaluate(element => element.classList.add("dragging"));
  try {
    for (const offset of [12, 65]) {
      await target.evaluate((element, offset) => {
        scrollTo({top:scrollY + element.getBoundingClientRect().top - offset,behavior:"instant"});
      }, offset);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      const covered = await page.locator(".topbar").evaluate(header => {
        const rect = header.getBoundingClientRect();
        const failures = [];
        for (let y = rect.top + 5; y < rect.bottom; y += 12) {
          for (let x = 5; x < innerWidth; x += 20) {
            const hit = document.elementFromPoint(x, y);
            if (!header.contains(hit)) failures.push(hit?.className || hit?.tagName);
          }
        }
        return [...new Set(failures)];
      });
      assert.deepEqual(covered, [], `${view}: scrolling content stays behind the entire top menu at ${offset}px`);
    }
    await page.locator("#global-search").fill("HTTP");
    await page.waitForSelector("#global-results:not([hidden])");
    assert.ok(await page.locator("#global-results").evaluate(results => {
      const rect = results.getBoundingClientRect();
      return results.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + 20));
    }), `${view}: search results stay above scrolling content`);
    await page.locator("#close-global-results").tap();
    await page.locator("#global-search").fill("");
    await page.locator("#global-search").blur();
    await page.locator("#mobile-menu").tap();
    await page.locator("#close-mobile-menu").tap();
  } finally {
    if (view === "evidence") await target.evaluate(element => element.classList.remove("dragging"));
    await page.evaluate(() => scrollTo({top:0,behavior:"instant"}));
  }
}
try {
  for (const viewport of screens) {
    const context = await browser.newContext({viewport,hasTouch:true,isMobile:mobileEmulation,deviceScaleFactor:1});
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`${base}#desk`);
    await ready(page,"desk");
    await page.waitForFunction(() => !document.querySelector("#boot-screen"));
    assert.equal(await page.locator("html").getAttribute("data-discovery-theme"), "dark");
    assert.equal(await page.locator(".nav-item").count(), 9);
    assert.equal(await page.locator('.nav-item[data-view="guide"],.nav-item[data-view="gazette"]').count(), 0);
    await page.locator("#global-search").fill("HTTP");
    await page.waitForSelector("#global-results:not([hidden])");
    assert.ok(await page.evaluate(() => {
      const results = document.querySelector("#global-results").getBoundingClientRect();
      const header = document.querySelector(".topbar").getBoundingClientRect();
      return results.top >= header.bottom - 1 && results.bottom <= innerHeight;
    }), "Search results stay below the theme chooser and inside the viewport");
    await page.locator("#close-global-results").tap();
    await page.locator("#global-search").fill("");
    await page.locator("#global-search").blur();
    // Give the personal collection a record, through the actual Save control.
    await page.locator(".discovery-record [data-favourite]").first().tap();
    for (const view of views) {
      await page.evaluate(() => scrollTo({top:600,behavior:"instant"}));
      assert.ok(await page.locator("#mobile-menu").isVisible());
      assert.ok((await page.locator("#mobile-menu").innerText()).includes("Themes"));
      assert.equal(await page.locator(".mobile-theme-label b").innerText(), "8");
      assert.ok((await page.locator("#mobile-menu").boundingBox()).height >= 44);
      await page.locator("#mobile-menu").tap();
      assert.equal(await page.locator("#concept-sidebar").getAttribute("aria-modal"), "true");
      assert.ok(await page.evaluate(() => document.activeElement.matches(".nav-item.active")));
      assert.ok(await page.evaluate(() => document.querySelector(".concept-nav").getBoundingClientRect().top < document.querySelector(".sidebar-project-links").getBoundingClientRect().top));
      await page.locator(`.nav-item[data-view="${view}"]`).tap();
      await ready(page,view);
      assert.equal(await page.locator("#mobile-current-theme").innerText(), await page.locator(".nav-item.active strong").innerText());
      assert.equal(await page.locator("#mobile-menu").getAttribute("aria-expanded"), "false");
      assert.equal(await page.locator("#concept-sidebar").getAttribute("inert"), "");
      assert.ok(await page.evaluate(() => scrollY < 2), `${view} opens at its top after mobile navigation`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${view}/${viewport.width} has no page overflow`);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), "dark");
      const smallFields = await page.locator('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):visible,select:visible,textarea:visible').evaluateAll(elements =>
        elements.filter(element => parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.id));
      assert.deepEqual(smallFields, [], `${view} phone fields avoid iOS focus zoom`);
      if (["desk","time"].includes(view)) {
        assert.equal(await page.locator(".discovery-lead").count(),0);
        const control = view === "desk" ? "#desk-query" : "#time-topic";
        assert.ok((await page.locator(control).boundingBox()).y < 320, `${view} primary filter is near the top`);
        await fits(page,".view-intro",`${view} header`);
      }
      const record = page.locator("#view-root [data-artifact]:visible").first();
      if (await record.count()) {
        await record.tap();
        await page.waitForSelector("#artifact-dialog[open]");
        await fits(page,"#artifact-dialog",`${view} record popup`);
        if (viewport.width <= 390) {
          const actionLayout = await page.locator("#artifact-actions > *").evaluateAll((actions) => actions.map((action) => {
            const rect = action.getBoundingClientRect();
            return {width:rect.width,height:rect.height,icon:Boolean(action.querySelector(".artifact-action-icon"))};
          }));
          assert.ok(actionLayout.every(({width,height}) => width >= 200 && height < 100), `${view}: phone record actions stay in readable rows`);
          assert.ok(actionLayout.filter(({icon}) => icon).length >= 6, `${view}: phone record actions use clear icons`);
        }
        await page.locator("#artifact-dialog .dialog-close").tap();
        await page.waitForSelector("#artifact-dialog[open]",{state:"hidden"});
        await page.waitForFunction(() => !documentDismissal && !document.body.classList.contains("document-dialog-open"));
      }
      if (view === "constellation") {
        const before = await page.evaluate(() => constellationExperience.camera.distance);
        await page.locator("#space-zoom-in").tap();
        assert.ok(await page.evaluate((before) => constellationExperience.camera.distance < before, before));
        const rotation = page.locator(".space-navigator #space-autorotate");
        const canvas = page.locator("#constellation-canvas");
        const box = await canvas.boundingBox();
        const gesture = {pointerId:41,pointerType:"touch",isPrimary:true,button:0,clientX:box.x + box.width * .55,clientY:box.y + box.height * .45};
        // Synthetic PointerEvents are not registered as active OS pointers, so
        // Chromium rejects setPointerCapture even though the handlers are real.
        await canvas.evaluate((element) => { element.testSetPointerCapture = element.setPointerCapture; element.setPointerCapture = () => {}; });
        await canvas.dispatchEvent("pointerdown", gesture);
        await canvas.dispatchEvent("pointermove", {...gesture,clientX:gesture.clientX + 45,clientY:gesture.clientY + 20});
        assert.equal(await page.evaluate(() => constellationExperience.pointers.size), 1, "touch contact is tracked");
        const heldYaw = await page.evaluate(() => constellationExperience.camera.yaw);
        await page.waitForTimeout(100);
        assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), heldYaw, "touch pauses rotation only while held");
        await canvas.dispatchEvent("pointerup", {...gesture,clientX:gesture.clientX + 45,clientY:gesture.clientY + 20});
        await canvas.evaluate((element) => { element.setPointerCapture = element.testSetPointerCapture; delete element.testSetPointerCapture; });
        assert.equal(await page.evaluate(() => constellationExperience.pointers.size), 0, "touch release clears interaction state");
        assert.equal(await rotation.getAttribute("aria-pressed"), "true");
        const pinchResult = await page.evaluate(() => {
          const scene = constellationExperience;
          const canvas = document.querySelector("#constellation-canvas");
          const bounds = canvas.getBoundingClientRect();
          const centerX = bounds.left + bounds.width / 2;
          const centerY = bounds.top + bounds.height / 2;
          const dispatch = (type, pointerId, x, y) => canvas.dispatchEvent(new PointerEvent(type, {
            bubbles: true, cancelable: true, pointerId, pointerType: "touch", isPrimary: pointerId === 51,
            button: 0, clientX: x, clientY: y
          }));
          const originalCapture = canvas.setPointerCapture;
          canvas.setPointerCapture = () => {};
          scene.resetCamera();
          scene.stopFlight();
          const target = {...scene.camera.target};
          dispatch("pointerdown", 51, centerX - 90, centerY - 40);
          dispatch("pointerdown", 52, centerX + 90, centerY - 40);
          dispatch("pointermove", 51, centerX - 38, centerY + 35);
          dispatch("pointermove", 52, centerX + 38, centerY + 35);
          const zoomedOut = scene.camera.distance;
          const targetAfterDrift = {...scene.camera.target};
          dispatch("pointermove", 51, centerX - 4, centerY + 35);
          dispatch("pointermove", 52, centerX + 4, centerY + 35);
          const safeDistance = scene.camera.distance;
          dispatch("pointermove", 51, centerX + 70, centerY + 35);
          dispatch("pointermove", 52, centerX - 70, centerY + 35);
          const crossedDistance = scene.camera.distance;
          dispatch("pointerup", 52, centerX - 70, centerY + 35);
          dispatch("pointerup", 51, centerX + 70, centerY + 35);
          canvas.setPointerCapture = originalCapture;
          scene.render(performance.now());
          const basis = scene.cameraBasis();
          const visible = scene.nodes.filter((node) => {
            const point = scene.project(node, basis);
            return point && point.x >= 0 && point.x <= scene.width && point.y >= 0 && point.y <= scene.height;
          }).length;
          return {target, targetAfterDrift, zoomedOut, safeDistance, crossedDistance, visible, pointers:scene.pointers.size};
        });
        assert.deepEqual(pinchResult.targetAfterDrift, pinchResult.target, "two-finger zoom does not pan the constellation away");
        assert.ok(pinchResult.zoomedOut > 720, "closing fingers zooms out on touch");
        assert.equal(pinchResult.crossedDistance, pinchResult.safeDistance, "near-crossed fingers cannot reverse or jump zoom");
        assert.ok(pinchResult.visible > 0, "research nodes remain visible after an extreme pinch");
        assert.equal(pinchResult.pointers, 0, "extreme pinch releases both contacts");
        // The selected-star panel must leave the navigator control tappable.
        await page.evaluate(() => constellationExperience.select(constellationExperience.nodes[0]));
        await rotation.tap();
        assert.equal(await rotation.getAttribute("aria-pressed"), "false");
        assert.ok((await rotation.boundingBox()).height >= 44, "rotation has a full touch target");
        await rotation.tap();
        assert.equal(await rotation.getAttribute("aria-pressed"), "true");
        const yaw = await page.evaluate(() => constellationExperience.camera.yaw);
        await page.waitForFunction((before) => Math.abs(constellationExperience.camera.yaw - before) > 0.00001, yaw);
        // Five taps on the visible year readout reveal the hidden mode.
        // Normal steering above must leave the main constellation intact.
        const readout = page.locator(".space-coordinates");
        const readoutBox = await readout.boundingBox();
        const readoutTouch = {pointerId:61,pointerType:"touch",isPrimary:true,button:0,
          clientX:readoutBox.x + readoutBox.width / 2,clientY:readoutBox.y + readoutBox.height / 2};
        await canvas.evaluate((element) => { element.testSetPointerCapture = element.setPointerCapture; element.setPointerCapture = () => {}; });
        const syntheticTap = async () => {
          await canvas.dispatchEvent("pointerdown", readoutTouch);
          await canvas.dispatchEvent("pointerup", readoutTouch);
        };
        for (let count = 0; count < 4; count++) await syntheticTap();
        assert.equal(await page.evaluate(() => constellationExperience.fishTank), false, "four readout taps keep the constellation");
        await syntheticTap();
        assert.equal(await page.locator("#constellation-space").evaluate((element) => element.classList.contains("is-fish-tank")), true);
        for (let count = 0; count < 5; count++) await syntheticTap();
        assert.equal(await page.evaluate(() => constellationExperience.fishTank), false, "five more taps restore the constellation");
        await canvas.evaluate((element) => { element.setPointerCapture = element.testSetPointerCapture; delete element.testSetPointerCapture; });
        assert.equal(await page.evaluate(() => constellationExperience.pointers.size), 0, "the taps release touch state");
        if (viewport.width === 390) {
          await page.evaluate(() => {
            constellationExperience.select(null);
            window.getSelection()?.removeAllRanges();
          });
          await readout.scrollIntoViewIfNeeded();
          const actualBox = await readout.boundingBox();
          const actualX = actualBox.x + actualBox.width / 2;
          const actualY = actualBox.y + actualBox.height / 2;
          assert.equal(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.id, {x:actualX,y:actualY}),
            "constellation-canvas", "the readout leaves touch events on the canvas");
          for (let count = 0; count < 5; count++) await page.touchscreen.tap(actualX, actualY);
          assert.equal(await page.evaluate(() => constellationExperience.fishTank), true, "five real touches enter the hidden mode");
          assert.equal(await page.evaluate(() => constellationExperience.pointers.size), 0, "real taps release their pointers");
          assert.equal(await page.evaluate(() => window.getSelection()?.toString() || ""), "", "the taps do not select page text");
          for (let count = 0; count < 5; count++) await page.touchscreen.tap(actualX, actualY);
          assert.equal(await page.evaluate(() => constellationExperience.fishTank), false, "five real touches return to the constellation");
        }
      }
      if (view === "terminal") {
        await page.locator("#terminal-command").fill("help");
        await page.locator("#terminal-command").press("Enter");
        await page.waitForFunction(() => document.querySelector("#terminal-output").textContent.includes("Available commands"));
      }
      await headerStaysAboveContent(page, view);
      // Direct-link refresh must reopen the same route on a phone.
      await page.reload();
      await ready(page,view);
      await page.waitForFunction(() => !document.querySelector("#boot-screen"));
      await fits(page,"#main-content",`${view} direct link`);
    }
    await page.goto(`${base}#desk`);
    await ready(page,"desk");
    await page.locator('[data-discovery-value="light"]').tap();
    await page.reload();
    await ready(page,"desk");
    assert.equal(await page.locator("html").getAttribute("data-discovery-theme"), "light");
    await page.locator('[data-discovery-value="dark"]').tap();
    // GTK WebKit's isMobile emulation retains its initial visual viewport when
    // resized (320px even when innerWidth becomes 844px). Test live breakpoint
    // changes in a touch context; the portrait checks above keep isMobile on.
    const rotationContext = browserName === "webkit" ? await browser.newContext({viewport,hasTouch:true}) : null;
    const rotation = rotationContext ? await rotationContext.newPage() : page;
    if (rotationContext) {
      await rotation.goto(`${base}#desk`);
      await ready(rotation,"desk");
      await rotation.waitForFunction(() => !document.querySelector("#boot-screen"));
    }
    await rotation.setViewportSize({width:844,height:390});
    await fits(rotation,"#main-content","landscape layout");
    await rotation.waitForSelector("#concept-sidebar:not([inert])");
    await rotation.setViewportSize(viewport);
    await rotation.waitForSelector("#concept-sidebar[inert]",{state:"attached"});
    await rotation.locator("#mobile-menu").tap();
    await rotation.locator("#close-mobile-menu").tap();
    assert.equal(await rotation.locator("#mobile-menu").getAttribute("aria-expanded"), "false");
    await rotationContext?.close();
    await context.close();
    console.log(`Mobile ${browserName}: all 9 themes at ${viewport.width}px; touch navigation, direct links, popups, dark default, saved appearance and rotation pass`);
  }
  // Exercise the CSS fullscreen fallback used when element fullscreen is
  // unavailable, including a short landscape phone where Exit must stay visible.
  const fallback = await browser.newContext({viewport:{width:667,height:375},hasTouch:true,isMobile:mobileEmulation});
  await fallback.addInitScript(() => {
    Object.defineProperty(Element.prototype,"requestFullscreen",{value:undefined,configurable:true});
    Object.defineProperty(Element.prototype,"webkitRequestFullscreen",{value:undefined,configurable:true});
  });
  const landscape = await fallback.newPage();
  landscape.on("pageerror",(error) => errors.push(error.message));
  await landscape.goto(`${base}#desk`);
  await ready(landscape,"desk");
  await landscape.waitForFunction(() => !document.querySelector("#boot-screen"));
  for (const view of views) {
    await landscape.locator("#mobile-menu").tap();
    await landscape.locator(`.nav-item[data-view="${view}"]`).tap();
    await ready(landscape,view);
    await landscape.locator("#view-fullscreen").tap();
    await landscape.waitForSelector("main.view-fullscreen-fallback");
    if (view === "terminal") assert.ok((await landscape.locator("#terminal-output").boundingBox()).height >= 100, "Terminal results stay visible in landscape fullscreen");
    assert.ok(await landscape.locator("#view-fullscreen").isVisible(), `${view} landscape fallback keeps its Exit control visible`);
    await landscape.locator("#view-fullscreen").tap();
    await landscape.waitForSelector("main.view-fullscreen-fallback",{state:"hidden"});
  }
  await fallback.close();
  console.log("Mobile landscape: all 9 themes enter and exit fullscreen without the native Fullscreen API");
  assert.deepEqual(errors,[]);
} finally { await browser.close(); }
