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
  await page.waitForFunction(() => document.querySelector("#space-autorotate").disabled);
  assert.equal(await rotation.textContent(), "Rotation paused");
  const yaw = await page.evaluate(() => constellationExperience.camera.yaw);
  const visualTime = await page.evaluate(() => constellationExperience.visualTime);
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => constellationExperience.camera.yaw), yaw);
  assert.equal(await page.evaluate(() => constellationExperience.visualTime), visualTime);
  assert.equal(await page.locator("#space-autorotate").getAttribute("aria-pressed"), "false");
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
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
