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
  getBoundingClientRect() { return {left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200}; }
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
  const readout = new Element();
  readout.getBoundingClientRect = () => ({left:10,top:10,right:110,bottom:60,width:100,height:50});
  controls.set(".space-coordinates", readout);
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
  if (motion === "user" || motion === "system") body.classList.add("reduce-motion");
  let nextFrame;
  const window = new EventTarget();
  window.matchMedia = () => ({matches: motion === "system"});
  const document = new EventTarget();
  document.body = body;
  document.hidden = false;
  const context = vm.createContext({
    window,
    document, AbortController, performance, console,
    requestAnimationFrame: (callback) => { nextFrame = callback; return 1; },
    cancelAnimationFrame() {}
  });
  vm.runInContext(source, context);
  const scene = new context.window.Constellation3D({canvas, shell, onRestoreMotion: () => {
    body.classList.remove("reduce-motion");
    scene.setAutoRotate(true);
  }});
  setMaxListeners(0, scene.signal);
  // Painting is a browser concern; retain the real render clock and loop.
  scene.drawBackdrop = scene.drawScene = () => {};
  scene.setAutoRotate(auto);
  scene.bindEvents();
  scene.loop(100);
  return {scene, canvas, shell, document, controls, nav, tick: () => nextFrame(scene.lastTime + 16)};
}

test("typing fish toggles the aquarium and leaves ordinary page typing alone", () => {
  const f = fixture();
  for (const key of "FiSh") fire(f.document, "keydown", {key});
  assert.equal(f.scene.fishTank, true);
  assert.equal(f.shell.classList.contains("is-fish-tank"), true);
  for (const key of "fish") fire(f.document, "keydown", {key});
  assert.equal(f.scene.fishTank, false);
  for (const key of "fissh") fire(f.document, "keydown", {key});
  assert.equal(f.scene.fishTank, false, "only the exact sequence toggles the tank");
  f.scene.onSecretKeyDown({key: "f", target: new Element("INPUT")});
  for (const key of "ish") fire(f.document, "keydown", {key});
  assert.equal(f.scene.fishTank, false, "typing in an input is not counted");
  f.scene.destroy();
});

test("aquarium rendering keeps research fish and topic coral pickable", () => {
  const f = fixture();
  const scene = f.scene;
  const gradient = {addColorStop() {}};
  scene.ctx = new Proxy({
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    measureText: (value) => ({width: value.length * 7})
  }, {get: (target, property) => target[property] ?? (() => {})});
  delete scene.drawBackdrop;
  delete scene.drawScene;
  scene.width = 800;
  scene.height = 500;
  scene.focalLength = 520;
  scene.fishTank = true;
  scene.hubs = [{type: "hub", name: "XSS", color: "#82f5b2", x: -60, y: 0, z: 0, radius: 8}];
  scene.nodes = [{type: "article", item: {id: "fish", title: "Research fish", topic: "XSS", year: 2026, rank: 1, section: "winner"},
    color: "#82f5b2", x: 60, y: 0, z: 0, radius: 12, pattern: 0, patternPhase: 0, pulse: 0}];
  scene.render(100);
  assert.equal(scene.hits.length, 2);
  const first = scene.hits.find(({node}) => node.item?.id === "fish");
  assert.ok(Number.isFinite(first.x) && Number.isFinite(first.y));
  assert.equal(scene.pick(first.x, first.y), scene.nodes[0], "a moving fish remains selectable");
  scene.render(1100);
  const next = scene.hits.find(({node}) => node.item?.id === "fish");
  assert.ok(Math.hypot(next.x - first.x, next.y - first.y) > 3, "fish swim while their research nodes remain anchored");
  const projected = scene.project(scene.nodes[0], scene.cameraBasis());
  const swimming = scene.fishPosition(scene.nodes[0], projected, 1200);
  scene.aquariumPointer = {x: swimming.x, y: swimming.y, time: 1200};
  const fleeing = scene.fishPosition(scene.nodes[0], projected, 1200);
  assert.ok(Math.hypot(fleeing.x - swimming.x, fleeing.y - swimming.y) > 10, "a nearby pointer makes the fish dart away");
  scene.render(1200);
  assert.equal(scene.pick(swimming.x, swimming.y), scene.nodes[0], "the fish remains selectable during its dart");
  const settled = scene.fishPosition(scene.nodes[0], projected, 2300);
  scene.aquariumPointer = null;
  const normal = scene.fishPosition(scene.nodes[0], projected, 2300);
  assert.equal(settled.x, normal.x, "the pointer reaction expires rather than trapping the fish away");
  f.scene.destroy();
});

const pointer = (pointerId, clientX, clientY, button = 0, timeStamp) => ({pointerId, clientX, clientY, button, ...(timeStamp === undefined ? {} : {timeStamp})});

test("five taps on the year readout toggle the hidden mode without consuming ordinary touch gestures", () => {
  const f = fixture();
  const touch = (id, x, y) => ({...pointer(id, x, y), pointerType: "touch"});
  const tap = (id, x = 50, y = 35) => {
    fire(f.canvas, "pointerdown", touch(id, x, y));
    fire(f.canvas, "pointerup", touch(id, x, y));
  };
  for (let id = 1; id <= 4; id++) tap(id);
  assert.equal(f.scene.fishTank, false, "four taps do not reveal the mode");
  assert.equal(f.scene.readoutTapCount, 4);

  const yaw = f.scene.camera.yaw;
  fire(f.canvas, "pointerdown", touch(5, 50, 35));
  fire(f.canvas, "pointermove", touch(5, 90, 35));
  assert.equal(f.scene.readoutTapCount, 0, "a drag cancels the sequence");
  assert.notEqual(f.scene.camera.yaw, yaw, "the drag still orbits");
  fire(f.canvas, "pointerup", touch(5, 90, 35));

  fire(f.canvas, "pointerdown", touch(6, 50, 35));
  fire(f.canvas, "pointerdown", touch(7, 150, 35));
  assert.equal(f.scene.readoutTapCount, 0, "a second finger cancels the sequence");
  assert.ok(f.scene.pinch, "pinch navigation continues");
  assert.equal(f.scene.fishTank, false);
  fire(f.canvas, "pointerup", touch(7, 150, 35));
  fire(f.canvas, "pointerup", touch(6, 50, 35));

  tap(8, 100, 100);
  assert.equal(f.scene.fishTank, false, "the centre crosshair is no longer a hidden target");
  for (let id = 9; id <= 12; id++) tap(id);
  assert.equal(f.scene.fishTank, false);
  fire(f.canvas, "pointerdown", touch(13, 50, 35));
  fire(f.canvas, "pointermove", touch(13, 57, 41));
  fire(f.canvas, "pointerup", touch(13, 57, 41));
  assert.equal(f.scene.fishTank, true, "small finger jitter is allowed on the fifth tap");
  assert.equal(f.scene.drag, null, "readout taps cannot select a research node");
  for (let id = 14; id <= 18; id++) tap(id);
  assert.equal(f.scene.fishTank, false, "five more taps return to the constellation");
  tap(19);
  f.scene.readoutTapTime = performance.now() - 1000;
  tap(20);
  assert.equal(f.scene.readoutTapCount, 1, "a long pause resets the sequence");
  fire(f.canvas, "pointerdown", touch(21, 50, 35));
  f.scene.drag.tapStarted = performance.now() - 500;
  fire(f.canvas, "pointerup", touch(21, 50, 35));
  assert.equal(f.scene.readoutTapCount, 0, "a long press cancels the tap sequence");
  assert.equal(f.scene.pointers.size, 0);
  f.scene.destroy();
});

test("touch catches fish and advances the tank goal", () => {
  const f = fixture();
  const fish = {type: "article", item: {id: "mobile-fish"}, x: 0, y: 0, z: 0,
    radius: 10, pattern: 0, pulse: 0, patternPhase: 0};
  f.scene.fishTank = true;
  f.scene.nodes = [fish];
  f.scene.pick = () => fish;
  fire(f.canvas, "pointerdown", {...pointer(1, 75, 80), pointerType: "touch"});
  fire(f.canvas, "pointerup", {...pointer(1, 75, 80), pointerType: "touch"});
  assert.equal(f.scene.caughtFishIds.size, 1);
  assert.equal(f.scene.hookedFish, null, "a touch catch releases when the finger lifts");
  f.scene.destroy();
});
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

test("a fish can be caught with a plain drag and released without turning the camera", () => {
  const f = fixture();
  const fish = {type: "article", x: 0, y: 0, z: 0, homeX: 0, homeY: 0, homeZ: 0,
    anchorX: 0, anchorY: 0, anchorZ: 0, radius: 10, pattern: 0, pulse: 0, patternPhase: 0,
    item: {id: "research-fish", title: "Research fish", topic: "XSS"}};
  f.scene.fishTank = true;
  f.scene.nodes = [fish];
  f.scene.pick = () => fish;
  const yaw = f.scene.camera.yaw;
  fire(f.canvas, "pointerdown", {...pointer(1, 100, 100), pointerType: "mouse"});
  assert.equal(f.scene.drag.node, fish);
  assert.equal(f.scene.aquariumPointer.x, 100);
  fire(f.canvas, "pointermove", {...pointer(1, 130, 80), pointerType: "mouse"});
  assert.notEqual(fish.x, 0);
  assert.equal(f.scene.camera.yaw, yaw);
  fire(f.canvas, "pointerup", {...pointer(1, 130, 80), pointerType: "mouse"});
  assert.equal(f.scene.drag, null);
  assert.equal(fish.anchorX, fish.x);
  assert.equal(f.scene.hookedFish, fish, "the fish stays on the hook after pointer release");
  assert.equal(f.scene.caughtFishIds.size, 1);
  fire(f.canvas, "mouseleave", {clientX: 100, clientY: 100});
  assert.equal(f.scene.hookedFish, fish, "an overlay inside the tank does not drop the catch");
  fire(f.canvas, "pointermove", {...pointer(1, 500, 500), pointerType: "mouse"});
  const base = f.scene.project(fish, f.scene.cameraBasis());
  const held = f.scene.fishPosition(fish, base, f.scene.visualTime);
  assert.ok(Math.hypot(held.x - base.x, held.y - base.y) <= f.scene.hookRadius(fish, base) + 0.001,
    "the hooked fish moves with the pointer inside its school radius");
  f.scene.pick = () => null;
  fire(f.canvas, "pointerdown", {...pointer(2, 500, 500), pointerType: "mouse"});
  assert.equal(f.scene.hookedFish, null, "clicking water releases the fish");
  assert.equal(f.scene.hookRelease.node, fish);
  fire(f.canvas, "pointerup", {...pointer(2, 500, 500), pointerType: "mouse"});
  f.scene.catchFish(fish);
  fire(f.canvas, "mouseleave", {clientX: 220, clientY: 220});
  assert.equal(f.scene.hookedFish, null, "leaving the tank lets the fish go");
  f.scene.destroy();
});

test("automatic rotation follows elapsed time through a slow frame", () => {
  const f = fixture();
  const yaw = f.scene.camera.yaw;
  f.scene.loop(f.scene.lastTime + 80);
  assert.ok(Math.abs(f.scene.camera.yaw - yaw - 80 * 0.000055) < 1e-7);
  const afterSlowFrame = f.scene.camera.yaw;
  f.scene.loop(f.scene.lastTime + 1000);
  assert.ok(Math.abs(f.scene.camera.yaw - afterSlowFrame - 120 * 0.000055) < 1e-7,
    "returning from a suspended tab does not jump through the skipped time");
  f.scene.destroy();
});

test("the tank game counts different fish and completes its five-fish goal", () => {
  const f = fixture();
  const messages = [];
  f.scene.onToast = message => messages.push(message);
  f.scene.fishTank = true;
  f.scene.aquariumPointer = {x: 100, y: 100, time: performance.now()};
  f.scene.nodes = Array.from({length: 5}, (_, index) => ({
    type: "article", item: {id: `fish-${index}`}, x: index * 20, y: 0, z: 0,
    radius: 10, pattern: 0, pulse: 0, patternPhase: 0
  }));
  for (const fish of f.scene.nodes) {
    f.scene.catchFish(fish);
    f.scene.releaseHook();
  }
  assert.equal(f.scene.caughtFishIds.size, 5);
  assert.equal(messages.filter(message => message.includes("School complete")).length, 1);
  f.scene.catchFish(f.scene.nodes[0]);
  assert.equal(f.scene.caughtFishIds.size, 5, "catching the same fish does not add progress");
  assert.equal(f.scene.catchFlashLabel, "CAUGHT AGAIN");
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

test("pinch zoom never pans, jumps at a crossed span, or loses the constellation", () => {
  const f = fixture();
  f.scene.width = 390;
  f.scene.height = 600;
  const target = {...f.scene.camera.target};
  fire(f.canvas, "pointerdown", pointer(1, 90, 280));
  fire(f.canvas, "pointerdown", pointer(2, 300, 280));
  const before = f.scene.camera.distance;
  // Both contacts move down as they close. This used to pan the target while
  // zooming and could move every research node beyond the phone viewport.
  fire(f.canvas, "pointermove", pointer(1, 150, 340));
  fire(f.canvas, "pointermove", pointer(2, 240, 340));
  assert.ok(f.scene.camera.distance > before, "closing fingers zooms out");
  assert.deepEqual(
    [f.scene.camera.target.x, f.scene.camera.target.y, f.scene.camera.target.z],
    [target.x, target.y, target.z],
    "pinch midpoint drift does not pan"
  );
  // Once contacts become nearly coincident the direction is ambiguous. Freeze
  // this gesture rather than letting crossed fingers reverse into a huge zoom.
  fire(f.canvas, "pointermove", pointer(1, 192, 340));
  fire(f.canvas, "pointermove", pointer(2, 198, 340));
  const safeDistance = f.scene.camera.distance;
  fire(f.canvas, "pointermove", pointer(1, 270, 340));
  fire(f.canvas, "pointermove", pointer(2, 120, 340));
  assert.equal(f.scene.camera.distance, safeDistance, "crossing contacts cannot reverse or jump the zoom");
  assert.deepEqual(
    [f.scene.camera.target.x, f.scene.camera.target.y, f.scene.camera.target.z],
    [target.x, target.y, target.z]
  );
  fire(f.canvas, "pointerup", pointer(2, 120, 340));
  fire(f.canvas, "pointerup", pointer(1, 270, 340));
  f.scene.destroy();
});

test("vertical automatic orbit crosses a pole instead of stopping", () => {
  const f = fixture();
  f.scene.camera.pitch = Math.PI / 2 - 0.006;
  f.scene.orbitDirection = {yaw: 0, pitch: 1};
  f.scene.orbitSpeed = 0.001;
  const before = f.scene.cameraBasis().position;
  f.tick();
  const crossed = f.scene.cameraBasis().position;
  assert.ok(f.scene.camera.roll > 3, "camera orientation is compensated at the pole");
  assert.equal(f.scene.orbitDirection.pitch, -1, "coordinate direction reflects to preserve physical travel");
  assert.ok(Math.hypot(crossed.x - before.x, crossed.y - before.y, crossed.z - before.z) > 0.1);
  f.tick();
  const continued = f.scene.cameraBasis().position;
  assert.ok(Math.hypot(continued.x - crossed.x, continued.y - crossed.y, continued.z - crossed.z) > 0.1,
    "the orbit continues on the far side of the pole");
  f.scene.destroy();
});

test("losing pointer capture cannot leave desktop rotation blocked", () => {
  const f = fixture();
  fire(f.canvas, "pointerdown", pointer(7, 100, 100));
  assert.equal(f.scene.pointers.size, 1);
  fire(f.canvas, "lostpointercapture");
  assert.equal(f.scene.pointers.size, 0);
  assert.equal(f.scene.drag, null);
  const yaw = f.scene.camera.yaw;
  f.tick();
  assert.notEqual(f.scene.camera.yaw, yaw, "automatic rotation resumes after capture loss");
  f.scene.destroy();
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
  test(`rotation control can restore ${motion} reduced motion on request`, () => {
    const f = fixture({motion});
    const button = f.controls.get("#space-autorotate");
    assert.equal(button.disabled, false);
    assert.equal(button.textContent, "\u25b6 Play rotation");
    const yaw = f.scene.camera.yaw;
    fire(button, "click");
    f.tick();
    assert.ok(f.scene.camera.yaw > yaw);
    assert.equal(button.getAttribute("aria-pressed"), "true");
    f.scene.destroy();
  });
}
