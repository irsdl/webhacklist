// Optional browser regression checks; see README.md for the isolated setup.
import assert from "node:assert/strict";
import {launchBrowser} from "./browser-test.mjs";
const browser = await launchBrowser();
const baseUrl = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:8000/website/";
const views = ["museum", "library", "signals", "constellation", "terminal", "evidence", "favourites", "desk", "time"];
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => errors.push(error.message));

async function keyboardClick(selector) {
  const control = page.locator(selector).first();
  await control.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction((selector) => document.activeElement.matches(selector), selector);
}

try {
  const opening = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: "no-preference"});
  await opening.goto(new URL("#constellation", baseUrl).href);
  await opening.waitForFunction(() => !document.querySelector("#boot-screen") && typeof constellationExperience !== "undefined" && constellationExperience);
  const openingMotion = await opening.evaluate(() => ({
    yaw: constellationExperience.camera.yaw,
    time: constellationExperience.visualTime,
    playing: constellationExperience.autoRotate,
    reduced: document.body.classList.contains("reduce-motion")
  }));
  assert.equal(openingMotion.reduced, false);
  assert.equal(openingMotion.playing, true);
  await opening.waitForFunction((before) =>
    constellationExperience.camera.yaw !== before.yaw && constellationExperience.visualTime > before.time, openingMotion);
  await opening.close();
  console.log("Constellation: a direct page open starts ambient rotation");
  const reducedOpening = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: "reduce"});
  await reducedOpening.goto(new URL("#constellation", baseUrl).href);
  await reducedOpening.waitForFunction(() => !document.querySelector("#boot-screen") && typeof constellationExperience !== "undefined" && constellationExperience);
  assert.equal(await reducedOpening.locator("#space-autorotate").isEnabled(), true);
  await reducedOpening.locator("#space-autorotate").click();
  await reducedOpening.waitForFunction(() => !document.body.classList.contains("reduce-motion") && constellationExperience.autoRotate);
  await reducedOpening.reload();
  await reducedOpening.waitForFunction(() => !document.querySelector("#boot-screen") && typeof constellationExperience !== "undefined" && constellationExperience);
  const restoredYaw = await reducedOpening.evaluate(() => constellationExperience.camera.yaw);
  await reducedOpening.waitForFunction((yaw) => !document.body.classList.contains("reduce-motion") && constellationExperience.camera.yaw !== yaw, restoredYaw);
  await reducedOpening.close();
  console.log("Constellation: rotation control restores motion and remembers it on reopen");
  await page.goto(baseUrl);
  await page.waitForSelector("#app-shell:not([hidden])");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const view of views) {
      if (process.env.WEBSEC_TEST_DEBUG) console.log(`Layout: ${view} at ${width}px`);
      await page.evaluate((view) => setView(view), view);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        view: document.documentElement.dataset.view,
        heading: document.querySelector("#view-mode").textContent,
        scheme: getComputedStyle(document.documentElement).colorScheme
      }));
      assert.equal(layout.overflow, false, `${view} overflows at ${width}px`);
      assert.equal(layout.view, view);
      assert.ok(layout.heading);
      assert.equal(layout.scheme, "dark");
    }
    console.log(`Layouts: all 9 views fit at ${width}px`);
  }
  console.log("Layouts: 9 views at 4 viewport widths passed");
  await page.evaluate(async () => {
    await setView("terminal");
    await setView("museum");
    await new Promise(requestAnimationFrame);
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => setView("museum"));
  await keyboardClick('[data-room-filter="XSS"]');
  assert.equal(await page.locator('[data-room-filter="XSS"]').getAttribute("aria-pressed"), "true");
  await page.locator('[data-room-filter="reset"]').focus();
  await page.keyboard.press("Enter");
  assert.ok(await page.evaluate(() => document.activeElement.hasAttribute("data-room-filter")));
  for (const view of ["museum", "library", "constellation", "evidence"]) {
    await page.evaluate((view) => setView(view), view);
    await keyboardClick('[data-year="2024"]');
  }
  await page.evaluate(() => setView("signals"));
  await keyboardClick('[data-signal-topic="HTTP"]');
  await keyboardClick('[data-signal-year="2024"]');
  console.log("Keyboard: topic, reset and year controls retain focus");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => setView("constellation"));
  await keyboardClick('[data-year="2026-ai"]');
  await page.evaluate(() => scrollTo({top:0,behavior:"instant"}));
  const openingField = await page.locator("#constellation-space").evaluate((field) => {
    const rect = field.getBoundingClientRect();
    return {top:rect.top,bottom:rect.bottom,viewport:innerHeight};
  });
  assert.ok(openingField.top >= 0 && openingField.bottom <= openingField.viewport + 1,
    "the complete 2026 constellation fits the opening laptop viewport without scrolling");
  console.log("Constellation: complete 2026 field fits the opening 1440x900 viewport");
  await page.locator("#constellation-space").focus();
  const beforeFish = await page.evaluate(() => constellationExperience.visualTime);
  await page.keyboard.type("fish");
  await page.waitForFunction((before) => constellationExperience.fishTank && constellationExperience.hits.length > 0 && constellationExperience.visualTime > before, beforeFish);
  assert.equal(await page.locator("#constellation-space").evaluate((field) => field.classList.contains("is-fish-tank")), true);
  assert.equal(await page.locator("#constellation-space").getAttribute("data-render-error"), null);
  await page.waitForFunction(() => {
    const pixel = document.querySelector("#constellation-canvas").getContext("2d").getImageData(5, 5, 1, 1).data;
    return pixel[2] > pixel[1];
  });
  const tankPixel = await page.locator("#constellation-canvas").evaluate((canvas) => [...canvas.getContext("2d").getImageData(5, 5, 1, 1).data]);
  assert.ok(tankPixel[2] > tankPixel[1], "the underwater blue backdrop was painted");
  const firstSwim = await page.evaluate(() => {
    constellationExperience.setAutoRotate(false);
    return {
      time: constellationExperience.visualTime,
      hits: constellationExperience.hits.filter(({node}) => node.type === "article").slice(0, 12)
        .map(({node, x, y}) => ({id: node.item.id, x, y}))
    };
  });
  await page.waitForFunction((before) => constellationExperience.visualTime > before + 600, firstSwim.time);
  const swim = await page.evaluate(() => ({
    hits: constellationExperience.hits.filter(({node}) => node.type === "article").slice(0, 12)
      .map(({node, x, y}) => ({id: node.item.id, x, y})),
    error: constellationExperience.shell.dataset.renderError || null
  }));
  assert.equal(swim.error, null);
  assert.ok(swim.hits.some((hit) => {
    const before = firstSwim.hits.find((entry) => entry.id === hit.id);
    return before && Math.hypot(hit.x - before.x, hit.y - before.y) > 2;
  }), "fish keep swimming while camera rotation is paused");
  const hookTarget = await page.evaluate(() => {
    const scene = constellationExperience;
    const bounds = scene.canvas.getBoundingClientRect();
    const hit = scene.hits.find(({node, x, y}) => node.type === "article" &&
      x > 45 && x < scene.width - 45 && y > 60 && y < scene.height - 45 &&
      document.elementFromPoint(bounds.left + x, bounds.top + y) === scene.canvas);
    return hit && {x: hit.x, y: hit.y};
  });
  assert.ok(hookTarget, "a reachable fish is visible in the tank");
  const hookBounds = await page.locator("#constellation-canvas").boundingBox();
  await page.mouse.move(hookBounds.x + hookTarget.x, hookBounds.y + hookTarget.y);
  assert.equal(await page.locator("#constellation-canvas").evaluate(canvas => getComputedStyle(canvas).cursor), "none");
  await page.mouse.down();
  const caughtFish = await page.evaluate(() => constellationExperience.drag?.node?.type === "article" && constellationExperience.drag.node.item.id);
  assert.ok(caughtFish, "a plain pointer press catches the fish under the hook");
  const caughtYaw = await page.evaluate(() => constellationExperience.camera.yaw);
  await page.mouse.move(hookBounds.x + hookTarget.x + 34, hookBounds.y + hookTarget.y - 22, {steps: 3});
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), caughtYaw, "reeling a fish does not turn the tank");
  await page.mouse.up();
  assert.equal(await page.evaluate(() => constellationExperience.drag), null);
  assert.equal(await page.evaluate(() => constellationExperience.hookedFish?.item.id), caughtFish,
    "the caught fish remains on the hook after the click ends");
  const hookReachPoint = await page.evaluate(() => {
    const scene = constellationExperience, bounds = scene.canvas.getBoundingClientRect();
    const fish = scene.hits.find(hit => hit.node === scene.hookedFish);
    let farthest = null;
    for (let y = 65; y < scene.height - 65; y += 55) for (let x = 65; x < scene.width - 65; x += 55) {
      if (document.elementFromPoint(bounds.left + x, bounds.top + y) !== scene.canvas) continue;
      const distance = Math.hypot(x - fish.x, y - fish.y);
      if (!farthest || distance > farthest.distance) farthest = {x, y, distance};
    }
    return farthest;
  });
  assert.ok(hookReachPoint, "the hook has open water to move through");
  const hookFrame = await page.evaluate(() => constellationExperience.visualTime);
  await page.mouse.move(hookBounds.x + hookReachPoint.x, hookBounds.y + hookReachPoint.y);
  await page.waitForFunction(before => constellationExperience.visualTime > before, hookFrame);
  const tethered = await page.evaluate(() => {
    const scene = constellationExperience;
    const node = scene.hookedFish;
    const base = scene.project(node, scene.cameraBasis());
    const fish = scene.hits.find(hit => hit.node === node);
    return {distance: Math.hypot(fish.x - base.x, fish.y - base.y), reach: scene.hookRadius(node, base), unique: scene.caughtFishIds.size};
  });
  assert.ok(tethered.distance <= tethered.reach + 1, "the fish follows the hook within its school radius");
  assert.equal(tethered.unique, 1, "the game counts a new fish catch");
  const openWater = await page.evaluate(() => {
    const scene = constellationExperience, bounds = scene.canvas.getBoundingClientRect();
    for (let y = 80; y < scene.height - 80; y += 38) for (let x = 80; x < scene.width - 80; x += 38) {
      if (!scene.pick(bounds.left + x, bounds.top + y, true) &&
          document.elementFromPoint(bounds.left + x, bounds.top + y) === scene.canvas) return {x, y};
    }
    return null;
  });
  assert.ok(openWater, "open water is available to release the catch");
  await page.mouse.click(hookBounds.x + openWater.x, hookBounds.y + openWater.y);
  assert.equal(await page.evaluate(() => constellationExperience.hookedFish), null, "clicking water releases the fish");
  await page.evaluate(() => constellationExperience.select(null));
  const tankYaw = await page.evaluate(() => constellationExperience.camera.yaw);
  const tankBounds = await page.locator("#constellation-canvas").boundingBox();
  await page.mouse.move(tankBounds.x + openWater.x, tankBounds.y + openWater.y);
  await page.mouse.down();
  await page.mouse.move(tankBounds.x + openWater.x - 40, tankBounds.y + openWater.y - 15, {steps: 3});
  await page.mouse.up();
  assert.notEqual(await page.evaluate(() => constellationExperience.camera.yaw), tankYaw, "drag still orbits in the tank");
  await page.evaluate(() => constellationExperience.setAutoRotate(true));
  await page.keyboard.type("fish");
  await page.waitForFunction(() => !constellationExperience.fishTank);
  console.log("Constellation: fish sequence toggles a rendered, interactive tank");
  for (const [label, zoom] of [
    ["zoom in", () => page.locator("#space-zoom-in").click()],
    ["zoom out", () => page.locator("#space-zoom-out").click()],
    ["wheel", async () => {
      await page.locator("#constellation-canvas").hover();
      await page.mouse.wheel(0, -100);
    }],
    ["slider pointer", () => page.locator("#space-zoom-range").click({position: {x: 5, y: 20}})],
    ["slider keyboard", async () => {
      await page.locator("#space-zoom-range").focus();
      await page.keyboard.press("ArrowDown");
    }]
  ]) {
    const distance = await page.evaluate(() => constellationExperience.camera.distance);
    await zoom();
    await page.waitForFunction((before) => constellationExperience.camera.distance !== before, distance);
    assert.equal(await page.locator("#space-autorotate").getAttribute("aria-pressed"), "true", `${label} preserves drift`);
    const frame = await page.evaluate(() => ({yaw: constellationExperience.camera.yaw, time: constellationExperience.visualTime}));
    await page.waitForFunction((before) => constellationExperience.camera.yaw > before.yaw && constellationExperience.visualTime > before.time, frame);
    assert.equal(await page.locator("#constellation-canvas").evaluate((canvas) => canvas.closest("[data-render-error]")?.dataset.renderError || null), null);
  }
  console.log("Constellation: rotation and animation continue after button, wheel and slider zoom");

  await page.evaluate(() => {
    constellationExperience.camera.pitch = Math.PI / 2 - 0.006;
    constellationExperience.camera.roll = 0;
    constellationExperience.orbitDirection = {yaw:0,pitch:1};
    constellationExperience.orbitSpeed = 0.001;
  });
  await page.waitForFunction(() => constellationExperience.camera.roll > 3);
  const polePitch = await page.evaluate(() => constellationExperience.camera.pitch);
  await page.waitForFunction((before) => constellationExperience.camera.pitch < before, polePitch);
  assert.equal(await page.locator("#constellation-canvas").evaluate((canvas) => canvas.closest("[data-render-error]")?.dataset.renderError || null), null);
  await page.evaluate(() => {
    constellationExperience.resetCamera();
    constellationExperience.flight.duration = 1;
    constellationExperience.flight.started = performance.now() - 10;
  });
  await page.waitForFunction(() => constellationExperience.flight === null);
  console.log("Constellation: vertical desktop orbit crosses its pole and keeps moving");

  const rotation = page.locator(".space-navigator #space-autorotate");
  assert.equal(await rotation.count(), 1, "rotation control belongs to the navigator");
  await page.locator("#constellation-canvas").scrollIntoViewIfNeeded();
  const empty = await page.evaluate(() => {
    const canvas = document.querySelector("#constellation-canvas");
    const bounds = canvas.getBoundingClientRect();
    for (let y = bounds.top + 120; y < Math.min(bounds.bottom - 120, innerHeight - 50); y += 25) {
      for (let x = bounds.left + 210; x < bounds.right - 130; x += 25) {
        if (document.elementFromPoint(x, y) === canvas && !constellationExperience.pick(x, y)) return {x, y};
      }
    }
    throw Error("No unobstructed empty space for orbit drag");
  });
  await page.mouse.move(empty.x, empty.y);
  await page.mouse.down();
  await page.mouse.move(empty.x + 55, empty.y + 15, {steps: 5});
  assert.match(await rotation.textContent(), /Release to resume/);
  const heldYaw = await page.evaluate(() => constellationExperience.camera.yaw);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), heldYaw);
  await page.mouse.up();
  await page.waitForFunction((before) => constellationExperience.camera.yaw < before, heldYaw);
  assert.match(await rotation.textContent(), /Pause rotation/);

  await page.mouse.move(empty.x, empty.y);
  await page.mouse.down({button:"right"});
  assert.equal(await rotation.getAttribute("aria-pressed"), "false");
  assert.match(await rotation.textContent(), /Play rotation/);
  const rightPausedYaw = await page.evaluate(() => constellationExperience.camera.yaw);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), rightPausedYaw);
  await page.mouse.up({button:"right"});
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), rightPausedYaw, "right-click pause persists after release");
  await page.mouse.down({button:"right"});
  await page.mouse.up({button:"right"});
  assert.equal(await rotation.getAttribute("aria-pressed"), "true");
  await page.waitForFunction((before) => constellationExperience.camera.yaw < before, rightPausedYaw);

  await rotation.focus();
  await page.keyboard.press("Space");
  assert.equal(await rotation.getAttribute("aria-pressed"), "false");
  await page.keyboard.press("Enter");
  assert.equal(await rotation.getAttribute("aria-pressed"), "true");
  console.log("Constellation: drag sets continuing direction; right-click, Space and Enter toggle rotation");

  await page.locator("#motion-toggle").click();
  await page.waitForFunction(() => document.querySelector("#space-autorotate").getAttribute("aria-label") === "Restore motion and play rotation");
  assert.equal(await rotation.isEnabled(), true);
  const yaw = await page.evaluate(() => constellationExperience.camera.yaw);
  const visualTime = await page.evaluate(() => constellationExperience.visualTime);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), yaw);
  assert.equal(await page.evaluate(() => constellationExperience.visualTime), visualTime);
  assert.equal(await page.locator("#space-autorotate").getAttribute("aria-pressed"), "false");
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
  await rotation.click();
  await page.waitForFunction((before) => !document.body.classList.contains("reduce-motion") && constellationExperience.camera.yaw !== before, yaw);
  assert.equal(await rotation.getAttribute("aria-pressed"), "true");
  await page.locator("#motion-toggle").click();
  await page.reload();
  await page.waitForSelector("#app-shell:not([hidden])");
  assert.equal(await page.locator("#motion-toggle").getAttribute("aria-pressed"), "true");
  await page.waitForFunction(() => !document.querySelector("#boot-screen"));
  await page.locator("#motion-toggle").click();
  await page.evaluate(() => localStorage.removeItem("websec-reduced-motion-v1"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForSelector("#app-shell:not([hidden])");
  await page.waitForFunction(() => !document.querySelector("#boot-screen") && typeof constellationExperience !== "undefined" && constellationExperience);
  assert.equal(await page.locator("#motion-toggle").getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("#motion-toggle").isEnabled(), true);
  assert.equal(await page.locator("#motion-toggle").getAttribute("aria-label"), "Restore ambient motion");
  const systemReducedYaw = await page.evaluate(() => constellationExperience.camera.yaw);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), systemReducedYaw);
  await page.locator("#motion-toggle").click();
  assert.equal(await page.locator("#motion-toggle").getAttribute("aria-pressed"), "false");
  await page.waitForFunction((before) => constellationExperience.camera.yaw !== before, systemReducedYaw);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  assert.equal(await page.locator("#motion-toggle").getAttribute("aria-pressed"), "false");
  console.log("Motion: camera pauses, preference persists, and visitors can override the system default");

  // Test the actual reader controls with a small, benign document. Archive file
  // availability is checked separately by smoke-test.mjs.
  await page.route("**/archived-references/md/**", (route) => route.fulfill({
    contentType: "text/plain", body: "# Theme review\n\n[Research source](https://example.org/)\n\n## Details\n\nA readable document."
  }));
  for (const view of views) {
    await page.evaluate((view) => setView(view), view);
    await page.evaluate(() => openReader(state.items.find((item) => item.mdPath)));
    await page.waitForSelector("#reader-content a");
    if (view === "constellation") {
      const frame = await page.evaluate(() => ({yaw:constellationExperience.camera.yaw,time:constellationExperience.visualTime}));
      await page.waitForTimeout(150);
      assert.deepEqual(await page.evaluate(() => ({yaw:constellationExperience.camera.yaw,time:constellationExperience.visualTime})), frame,
        "Opening a reader pauses the background map instead of repainting under its blur");
    }
    for (const theme of ["light", "dark"]) {
      await page.evaluate((theme) => { state.readingTheme = theme; applyReadingTheme(); }, theme);
      const contrast = await page.evaluate(() => {
        const luminance = (color) => {
          const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
            v /= 255;
            return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
          });
          return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
        };
        const link = getComputedStyle(document.querySelector("#reader-content a")).color;
        const background = getComputedStyle(document.querySelector("#reader-scroll")).backgroundColor;
        // Dark reader scroll areas are transparent; their dialog owns the fill.
        const canvas = document.createElement("canvas").getContext("2d");
        const backdrop = background === "rgba(0, 0, 0, 0)"
          ? getComputedStyle(document.querySelector("#reader-dialog")).backgroundColor : background;
        const rgb = (color) => {
          canvas.fillStyle = color;
          canvas.fillRect(0, 0, 1, 1);
          return `rgb(${[...canvas.getImageData(0, 0, 1, 1).data].slice(0, 3).join(",")})`;
        };
        const a = luminance(rgb(link)), b = luminance(rgb(backdrop));
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      });
      assert.ok(contrast >= 4.5, `${view} ${theme} link contrast is ${contrast.toFixed(2)}:1`);
    }
    await page.evaluate(() => new Promise((resolve) => {
      const dialog = document.querySelector("#reader-dialog");
      dialog.addEventListener("close", resolve, { once: true });
      dialog.close();
    }));
  }
  await page.evaluate(() => openReader(state.items.find((item) => item.mdPath)));
  await page.locator("#reader-theme-toggle").click();
  assert.equal(await page.evaluate(() => localStorage.getItem(READING_THEME_STORAGE_KEY)), "light");
  assert.equal(new URL(page.url()).searchParams.get("theme"), "light");
  assert.equal(await page.locator("#pdf-dialog").getAttribute("data-reading-theme"), "light");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 800 });
    assert.ok(await page.evaluate(() => {
      const box = document.querySelector("#reader-dialog").getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth && box.bottom <= innerHeight;
    }), `Reader fits at ${width}px`);
  }
  console.log("Readers: light/dark link contrast passes in every view; theme sharing and phone layouts pass");
  assert.deepEqual(errors, []);
  console.log("Theme test: PASS (no browser errors)");
} finally {
  await browser.close();
}
