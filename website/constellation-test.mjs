// Synthetic DOM events exercise the production handlers and animation loop.
// No archive data, browser installation or third-party packages are needed.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {setMaxListeners} from "node:events";
import {test} from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("./constellation.js", import.meta.url), "utf8");

class Element extends EventTarget {
  constructor(tagName = "DIV") {
    super();
    this.tagName = tagName;
    this.dataset = {};
    this.attributes = new Map();
    const classes = new Set();
    this.classList = {
      add: (name) => classes.add(name), remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle: (name, on) => on ? classes.add(name) : classes.delete(name)
    };
    this.style = {setProperty() {}};
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name); }
  getBoundingClientRect() { return {left: 0, top: 0, width: 200, height: 200}; }
  setPointerCapture() {}
  focus() {}
}

function fire(target, type, properties = {}) {
  const event = new Event(type, {cancelable: true});
  const {timeStamp, ...assignable} = properties;
  if (timeStamp !== undefined) Object.defineProperty(event, "timeStamp", {value: timeStamp});
  Object.assign(event, assignable);
  target.dispatchEvent(event);
}

function fixture({auto = true, motion = "normal"} = {}) {
  const controls = new Map(["auto", "zoom-in", "zoom-out", "zoom-range"].map((id) =>
    [`#space-${id === "auto" ? "autorotate" : id}`, new Element(id === "zoom-range" ? "DIV" : "BUTTON")]));
  const nav = ["forward", "back", "turn-left"].map((action) => {
    const button = new Element("BUTTON");
    button.dataset.spaceNav = action;
    return button;
  });
  const shell = new Element();
  shell.querySelector = (selector) => controls.get(selector);
  shell.querySelectorAll = () => nav;
  const canvas = new Element("CANVAS");
  canvas.getContext = () => ({setTransform() {}, clearRect() {}});
  const body = new Element("BODY");
  if (motion === "user") body.classList.add("reduce-motion");
  let nextFrame;
  const context = vm.createContext({
    window: {matchMedia: () => ({matches: motion === "system"})},
    document: {body}, AbortController, performance, console,
    requestAnimationFrame: (callback) => { nextFrame = callback; return 1; },
    cancelAnimationFrame() {}
  });
  vm.runInContext(source, context);
  const scene = new context.window.Constellation3D({canvas, shell});
  setMaxListeners(0, scene.signal);
  // Painting is a browser concern; retain the real render clock and loop.
  scene.drawBackdrop = scene.drawScene = () => {};
  scene.setAutoRotate(auto);
  scene.bindEvents();
  scene.loop(100);
  return {scene, canvas, shell, controls, nav, tick: () => nextFrame(scene.lastTime + 16)};
}

const pointer = (pointerId, clientX, clientY, button = 0, timeStamp) => ({pointerId, clientX, clientY, button, ...(timeStamp === undefined ? {} : {timeStamp})});
const actions = [
  ["wheel in", (f) => fire(f.canvas, "wheel", {deltaY: -100})],
  ["wheel out", (f) => fire(f.canvas, "wheel", {deltaY: 100})],
  ...["zoom-in", "zoom-out"].map((id) => [id, (f) => fire(f.controls.get(`#space-${id}`), "click")]),
  ["slider drag", (f) => {
    const slider = f.controls.get("#space-zoom-range");
    fire(slider, "pointerdown", pointer(1, 100, 100));
    fire(slider, "pointermove", pointer(1, 100, 60));
    fire(slider, "pointerup", pointer(1, 100, 60));
    assert.equal(slider.classList.contains("is-active"), false);
  }],
  ...["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].map((key) =>
    [`slider ${key}`, (f) => fire(f.controls.get("#space-zoom-range"), "keydown", {key})]),
  ...["KeyW", "KeyS", "ArrowUp", "ArrowDown"].map((code) => [`camera ${code}`, (f) => {
    fire(f.shell, "keydown", {code}); f.tick(); fire(f.shell, "keyup", {code});
  }]),
  ...["forward", "back"].map((action) => [`navigator ${action}`, (f) => {
    const button = f.nav.find((button) => button.dataset.spaceNav === action);
    fire(button, "pointerdown", pointer(1, 0, 0));
    f.tick();
    fire(button, "pointerup", pointer(1, 0, 0));
  }]),
  ["pinch", (f) => {
    fire(f.canvas, "pointerdown", pointer(1, 50, 100));
    fire(f.canvas, "pointerdown", pointer(2, 150, 100));
    fire(f.canvas, "pointermove", pointer(2, 180, 100));
    fire(f.canvas, "pointerup", pointer(2, 180, 100));
    fire(f.canvas, "pointerup", pointer(1, 50, 100));
    assert.equal(f.scene.pointers.size, 0);
    assert.equal(f.scene.drag, null);
  }]
];

for (const [label, action] of actions) {
  for (const options of [{auto: true}, {auto: false}, {auto: true, motion: "user"}, {auto: true, motion: "system"}]) {
    test(`${label}: preserves drift ${options.auto}, motion ${options.motion || "normal"}`, () => {
      const f = fixture(options);
      const before = f.scene.camera.distance;
      action(f);
      assert.notEqual(f.scene.camera.distance, before, "zoom changes distance");
      assert.equal(f.scene.autoRotate, options.auto, "zoom preserves the chosen drift setting");
      const yaw = f.scene.camera.yaw, visualTime = f.scene.visualTime;
      f.tick();
      const moving = options.auto && !options.motion;
      assert.equal(f.scene.camera.yaw > yaw, moving, "rotation continues only when enabled");
      assert.equal(f.scene.visualTime > visualTime, !options.motion, "animation respects reduced motion");
      assert.equal(f.controls.get("#space-autorotate").getAttribute("aria-pressed"), String(moving));
      assert.equal(f.controls.get("#space-zoom-range").getAttribute("aria-valuenow"), String(Math.round(f.scene.camera.distance)));
      assert.equal(f.shell.dataset.renderError, undefined);
      f.scene.destroy();
    });
  }
  test(`${label}: interrupts a flight so zoom is retained`, () => {
    const f = fixture();
    f.scene.beginFlight({x: 10, y: 0, z: 0}, 140);
    action(f);
    assert.equal(f.scene.flight, null);
    const distance = f.scene.camera.distance;
    f.tick();
    assert.equal(f.scene.camera.distance, distance);
    f.scene.destroy();
  });
}

test("manual orbit pauses drift only while the pointer is held", () => {
  const f = fixture();
  const before = f.scene.camera.yaw;
  fire(f.canvas, "pointerdown", pointer(1, 50, 100));
  f.tick();
  assert.equal(f.scene.camera.yaw, before, "contact pauses automatic rotation");
  fire(f.canvas, "pointermove", pointer(1, 90, 100));
  const held = f.scene.camera.yaw;
  f.tick();
  assert.equal(f.scene.camera.yaw, held, "dragging does not fight automatic rotation");
  fire(f.canvas, "pointerup", pointer(1, 90, 100));
  assert.equal(f.scene.autoRotate, true, "drag preserves the rotation preference");
  f.tick();
  assert.ok(f.scene.camera.yaw < held, "rotation resumes in the drag direction on release");
  f.scene.destroy();
});

test("right-click persistently pauses and resumes rotation without moving the camera", () => {
  const f = fixture();
  const before = f.scene.camera.yaw;
  fire(f.canvas, "pointerdown", pointer(1, 50, 100, 2));
  f.tick();
  assert.equal(f.scene.camera.yaw, before);
  assert.equal(f.scene.autoRotate, false);
  assert.equal(f.controls.get("#space-autorotate").textContent, "▶ Play rotation");
  fire(f.canvas, "pointerdown", pointer(2, 50, 100, 2));
  assert.equal(f.scene.autoRotate, true);
  f.tick();
  assert.ok(f.scene.camera.yaw > before);
  f.scene.destroy();
});

test("plain diagonal drag orbits northwest even when it starts over a star", () => {
  const f = fixture();
  const star = {type: "article", x: 0, y: 0, z: 0, item: {}};
  f.scene.pick = () => star;
  const yaw = f.scene.camera.yaw;
  const pitch = f.scene.camera.pitch;
  fire(f.canvas, "pointerdown", pointer(1, 100, 100));
  fire(f.canvas, "pointermove", pointer(1, 60, 60));
  assert.ok(f.scene.camera.yaw > yaw, "westward movement turns west");
  assert.ok(f.scene.camera.pitch < pitch, "northward movement turns north");
  assert.equal(f.scene.drag.node, null, "a star does not capture the primary orbit gesture");
  f.scene.destroy();
});

for (const [name, destination, comparison] of [
  ["upward", 55, (after, before) => after < before],
  ["downward", 145, (after, before) => after > before]
]) {
  test(`${name} release continues on its vertical orbit axis`, () => {
    const f = fixture();
    fire(f.canvas, "pointerdown", pointer(1, 100, 100));
    fire(f.canvas, "pointermove", pointer(1, 100, destination));
    fire(f.canvas, "pointerup", pointer(1, 100, destination));
    const yaw = f.scene.camera.yaw;
    const pitch = f.scene.camera.pitch;
    f.tick();
    assert.equal(f.scene.camera.yaw, yaw, "vertical release does not revert to left/right rotation");
    assert.ok(comparison(f.scene.camera.pitch, pitch), `${name} rotation continues after release`);
    f.scene.destroy();
  });
}

test("released orbit inherits gesture speed and eases back to ambient speed", () => {
  const fast = fixture();
  fire(fast.canvas, "pointerdown", pointer(1, 100, 100, 0, 1000));
  fire(fast.canvas, "pointermove", pointer(1, 100, 60, 0, 1016));
  fire(fast.canvas, "pointerup", pointer(1, 100, 60, 0, 1017));

  const slow = fixture();
  fire(slow.canvas, "pointerdown", pointer(1, 100, 100, 0, 1000));
  for (let step = 1; step <= 6; step++) {
    fire(slow.canvas, "pointermove", pointer(1, 100, 100 - step, 0, 1000 + step * 100));
  }
  fire(slow.canvas, "pointerup", pointer(1, 100, 94, 0, 1601));

  const standard = 0.000055;
  assert.ok(fast.scene.orbitSpeed > standard, "a fast flick starts above ambient speed");
  assert.ok(slow.scene.orbitSpeed < standard, "a slow turn starts below ambient speed");
  const fastPitch = fast.scene.camera.pitch;
  const slowPitch = slow.scene.camera.pitch;
  fast.tick();
  slow.tick();
  assert.ok(fastPitch - fast.scene.camera.pitch > slowPitch - slow.scene.camera.pitch, "release speed affects the initial coast");

  const initialDifference = Math.abs(fast.scene.orbitSpeed - standard);
  for (let frame = 0; frame < 250; frame++) fast.tick();
  assert.ok(Math.abs(fast.scene.orbitSpeed - standard) < initialDifference * 0.05, "speed settles near ambient after a few seconds");
  fast.scene.destroy();
  slow.scene.destroy();
});

test("rotation button remains the explicit persistent Play/Pause preference", () => {
  const f = fixture();
  const button = f.controls.get("#space-autorotate");
  fire(button, "click");
  assert.equal(button.textContent, "▶ Play rotation");
  assert.equal(button.getAttribute("aria-label"), "Play rotation");
  const paused = f.scene.camera.yaw;
  f.tick();
  assert.equal(f.scene.camera.yaw, paused);
  fire(button, "click");
  f.tick();
  assert.ok(f.scene.camera.yaw > paused);
  assert.equal(button.textContent, "⏸ Pause rotation");
  assert.equal(button.getAttribute("aria-label"), "Pause rotation");
  f.scene.destroy();
});

test("camera flights temporarily pause and then resume the chosen rotation", () => {
  const f = fixture();
  f.scene.beginFlight({x: 10, y: 0, z: 0}, 140);
  f.scene.flight.duration = 1;
  f.scene.flight.started = f.scene.lastTime - 10;
  const yaw = f.scene.camera.yaw;
  f.tick();
  assert.equal(f.scene.flight, null);
  assert.equal(f.scene.camera.yaw, yaw);
  f.tick();
  assert.ok(f.scene.camera.yaw > yaw);
  f.scene.destroy();
});

for (const motion of ["user", "system"]) {
  test(`rotation control respects ${motion} reduced motion`, () => {
    const f = fixture({motion});
    const button = f.controls.get("#space-autorotate");
    assert.equal(button.disabled, true);
    assert.equal(button.textContent, "Rotation paused");
    const yaw = f.scene.camera.yaw;
    fire(button, "click");
    f.tick();
    assert.equal(f.scene.camera.yaw, yaw);
    assert.equal(button.getAttribute("aria-pressed"), "false");
    f.scene.destroy();
  });
}
