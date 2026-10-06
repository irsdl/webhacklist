/* Web Hacking Techniques Index — dependency-free 3D research constellation. */

(function attachConstellation3D() {
  "use strict";

  const TAU = Math.PI * 2;
  const STANDARD_ORBIT_SPEED = 0.000055;
  const ORBIT_SPEED_SETTLE_MS = 1200;
  const MIN_PINCH_SPAN = 24;
  const MAX_PINCH_RATIO = 1.4;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const cross = (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  });
  const normalize = (vector) => {
    const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
    return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
  };
  const addScaled = (point, vector, amount) => {
    point.x += vector.x * amount;
    point.y += vector.y * amount;
    point.z += vector.z * amount;
  };
  const ease = (value) => 1 - Math.pow(1 - value, 3);
  const WINNER_GOLD = "#f6c96b";
  const isTopTen = (item) => item?.section === "winner" || (Number.isFinite(item?.rank) && item.rank > 0);
  // app.js resolves the system default and any explicit visitor override into
  // this class. Trust that resolved preference so a visitor can restore motion
  // even when the operating system asks sites to reduce it.
  const motionReduced = () => document.body.classList.contains("reduce-motion");

  function seedNumber(value) {
    let hash = 2166136261;
    const input = String(value);
    for (let index = 0; index < input.length; index++) {
      hash = Math.imul(hash ^ input.charCodeAt(index), 16777619);
    }
    return hash >>> 0;
  }

  function randomFrom(seed) {
    let state = seedNumber(seed) || 1;
    return () => {
      state += 0x6D2B79F5;
      let number = state;
      number = Math.imul(number ^ (number >>> 15), number | 1);
      number ^= number + Math.imul(number ^ (number >>> 7), number | 61);
      return ((number ^ (number >>> 14)) >>> 0) / 4294967296;
    };
  }

  function withAlpha(color, alpha) {
    const hex = String(color || "#82f5b2").replace("#", "");
    const full = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(130,245,178,${alpha})`;
    const value = Number.parseInt(full, 16);
    return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`;
  }

  function shortened(value, limit = 54) {
    const text = String(value || "Untitled artifact");
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
  }

  class Constellation3D {
    constructor({ canvas, shell, items = [], topics = [], onArtifact, onFavourite, onToast, onRestoreMotion }) {
      this.canvas = canvas;
      this.shell = shell;
      this.ctx = canvas?.getContext("2d", { alpha: false });
      this.items = items;
      this.topics = topics;
      this.onArtifact = onArtifact || (() => {});
      this.onFavourite = onFavourite || (() => {});
      this.onToast = onToast || (() => {});
      this.onRestoreMotion = onRestoreMotion || (() => {});
      this.abortController = new AbortController();
      this.signal = this.abortController.signal;
      this.resizeObserver = null;
      this.frame = 0;
      this.lastTime = 0;
      this.visualTime = 0;
      this.width = 1;
      this.height = 1;
      this.pixelRatio = 1;
      this.focalLength = 700;
      this.hits = [];
      this.hovered = null;
      this.selected = null;
      this.drag = null;
      this.pointers = new Map();
      this.pinch = null;
      this.keys = new Set();
      this.navActions = new Set();
      this.flight = null;
      this.showLabels = false;
      this.fishTank = false;
      this.fishSequence = "";
      this.fishSequenceTime = 0;
      this.mobileDive = null;
      this.aquariumPointer = null;
      this.hookedFish = null;
      this.hookOffset = { x: 0, y: 0 };
      this.hookRelease = null;
      this.catchFlashTime = 0;
      this.catchFlashLabel = "";
      this.caughtFishIds = new Set();
      this.comets = [];
      this.cometRandom = randomFrom(`comets-${this.items[0]?.year || "archive"}`);
      this.nextComet = performance.now() + 6500 + this.cometRandom() * 7500;
      this.camera = {
        target: { x: 0, y: 0, z: 0 },
        yaw: -0.46,
        pitch: 0.18,
        roll: 0,
        distance: 720
      };
      this.defaultCamera = {
        target: { x: 0, y: 0, z: 0 },
        yaw: -0.46,
        pitch: 0.18,
        roll: 0,
        distance: 720
      };
      // Automatic motion begins on the familiar horizontal orbit. A manual
      // orbit gesture replaces this vector, so releasing an upward, downward
      // or diagonal drag continues around the axis the visitor chose.
      this.orbitDirection = { yaw: 1, pitch: 0 };
      this.orbitSpeed = STANDARD_ORBIT_SPEED;
      this.autoRotate = !motionReduced();
      this.buildScene();
      this.cacheControls();
    }

    cacheControls() {
      const find = (selector) => this.shell?.querySelector(selector);
      this.controls = {
        distance: find("#space-camera-distance"),
        reset: find("#space-reset"),
        auto: find("#space-autorotate"),
        labels: find("#space-labels"),
        focus: find("#space-focus"),
        zoomIn: find("#space-zoom-in"),
        zoomOut: find("#space-zoom-out"),
        zoomRange: find("#space-zoom-range"),
        selection: find("#space-selection"),
        selectionMeta: find("#space-selection-meta"),
        selectionTitle: find("#space-selection-title"),
        selectionPublisher: find("#space-selection-publisher"),
        open: find("#space-open-artifact"),
        favourite: find("#space-favourite-artifact"),
        fly: find("#space-fly-artifact"),
        tidy: find("#space-tidy"),
        navigatorButtons: [...(this.shell?.querySelectorAll("[data-space-nav]") || [])]
      };
    }

    buildScene() {
      this.nodes = [];
      this.hubs = [];
      this.connections = [];

      const activeNames = [...new Set(this.items.map((item) => item.topic))];
      const topicLookup = new Map(this.topics.map((topic, index) => [topic.name, { ...topic, index }]));
      const fullCount = Math.max(this.topics.length, 1);

      activeNames.forEach((name) => {
        const topic = topicLookup.get(name) || { name, color: "#93aaa2", index: this.hubs.length };
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const vertical = 1 - (2 * (topic.index + 0.5)) / fullCount;
        const radial = Math.sqrt(Math.max(0, 1 - vertical * vertical));
        const angle = topic.index * goldenAngle;
        const radius = activeNames.length === 1 ? 0 : 330;
        this.hubs.push({
          type: "hub",
          name,
          color: topic.color,
          x: Math.cos(angle) * radial * radius,
          y: vertical * radius * 0.76,
          z: Math.sin(angle) * radial * radius,
          radius: 8
        });
      });

      const hubs = new Map(this.hubs.map((hub) => [hub.name, hub]));
      const groups = new Map();
      this.items.forEach((item) => {
        const list = groups.get(item.topic) || [];
        list.push(item);
        groups.set(item.topic, list);
      });

      groups.forEach((group, topicName) => {
        const hub = hubs.get(topicName);
        if (!hub) return;
        group.forEach((item, index) => {
          const random = randomFrom(`${item.id}-${item.title}`);
          const ring = Math.floor(Math.sqrt(index));
          const angle = index * 2.399963 + random() * 0.65;
          const radius = 62 + ring * 24 + random() * 46;
          const vertical = (random() - 0.5) * (86 + ring * 10);
          const depth = (random() - 0.5) * (126 + ring * 12);
          const x = hub.x + Math.cos(angle) * radius;
          const y = hub.y + Math.sin(angle) * radius * 0.58 + vertical;
          const z = hub.z + Math.sin(angle * 1.47) * radius * 0.48 + depth;
          const node = {
            type: "article",
            item,
            color: item.topicColor || hub.color,
            x,
            y,
            z,
            homeX: x,
            homeY: y,
            homeZ: z,
            anchorX: x,
            anchorY: y,
            anchorZ: z,
            velocityX: 0,
            velocityY: 0,
            velocityZ: 0,
            radius: isTopTen(item) ? 10.2 + (11 - (item.rank || 10)) * 0.42 : 3.4 + random() * 1.9,
            pulse: random() * TAU,
            twinkle: 0.6 + random() * 0.8,
            pattern: Math.floor(random() * 6),
            patternTilt: (random() - 0.5) * 1.3,
            patternPhase: random() * TAU,
            moon: random() > 0.82
          };
          this.nodes.push(node);
          this.connections.push({ from: hub, to: node });
        });
      });

      this.separateArticleNodes();

      const backgroundRandom = randomFrom(`deep-space-${this.items[0]?.year || "archive"}`);
      this.backgroundStars = Array.from({ length: 520 }, (_, index) => {
        const radius = 780 + backgroundRandom() * 1500;
        const longitude = backgroundRandom() * TAU;
        const latitude = Math.acos(2 * backgroundRandom() - 1);
        return {
          x: Math.sin(latitude) * Math.cos(longitude) * radius,
          y: Math.cos(latitude) * radius,
          z: Math.sin(latitude) * Math.sin(longitude) * radius,
          size: 0.35 + backgroundRandom() * (index % 19 === 0 ? 2.1 : 1.05),
          alpha: 0.18 + backgroundRandom() * 0.6,
          phase: backgroundRandom() * TAU
        };
      });
    }

    separateArticleNodes() {
      // Deterministically relax close neighbours after the seeded cluster layout.
      // Z contributes less because projected overlap is primarily an X/Y problem.
      for (let iteration = 0; iteration < 8; iteration++) {
        for (let leftIndex = 0; leftIndex < this.nodes.length; leftIndex++) {
          const left = this.nodes[leftIndex];
          for (let rightIndex = leftIndex + 1; rightIndex < this.nodes.length; rightIndex++) {
            const right = this.nodes[rightIndex];
            let dx = right.x - left.x;
            let dy = right.y - left.y;
            let dz = right.z - left.z;
            let distance = Math.hypot(dx, dy, dz * 0.42);
            const required = left.radius + right.radius + (left.item.topic === right.item.topic ? 26 : 18);
            if (distance >= required) continue;
            if (distance < 0.001) {
              const angle = seedNumber(`${left.item.id}-${right.item.id}`) / 4294967296 * TAU;
              dx = Math.cos(angle);
              dy = Math.sin(angle);
              dz = Math.sin(angle * 1.7) * 0.35;
              distance = 1;
            }
            const push = (required - distance) * 0.52;
            const scale = push / distance;
            left.x -= dx * scale;
            left.y -= dy * scale;
            left.z -= dz * scale * 0.42;
            right.x += dx * scale;
            right.y += dy * scale;
            right.z += dz * scale * 0.42;
          }
        }
      }
      this.nodes.forEach((node) => {
        node.homeX = node.x;
        node.homeY = node.y;
        node.homeZ = node.z;
        node.anchorX = node.x;
        node.anchorY = node.y;
        node.anchorZ = node.z;
      });
    }

    mount() {
      if (!this.canvas || !this.shell || !this.ctx) return;
      this.bindEvents();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.shell);
      this.resize();
      this.updateControlState();
      this.render(performance.now());
      this.frame = requestAnimationFrame((time) => this.loop(time));
    }

    bindEvents() {
      const options = { signal: this.signal };
      this.canvas.addEventListener("pointerdown", (event) => this.onPointerDown(event), options);
      this.canvas.addEventListener("pointermove", (event) => this.onPointerMove(event), options);
      this.canvas.addEventListener("pointerup", (event) => this.onPointerUp(event), options);
      this.canvas.addEventListener("pointercancel", (event) => this.onPointerUp(event), options);
      this.canvas.addEventListener("lostpointercapture", () => {
        if (this.pointers.size) this.clearInteractionState();
      }, options);
      this.canvas.addEventListener("dblclick", (event) => {
        const node = this.pick(event.clientX, event.clientY);
        if (node) {
          this.select(node);
          this.focusSelected();
        }
      }, options);
      this.canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        this.stopFlight();
        this.setDistance(this.camera.distance * Math.exp(event.deltaY * 0.0011));
      }, { ...options, passive: false });
      this.canvas.addEventListener("contextmenu", (event) => event.preventDefault(), options);
      this.canvas.addEventListener("mouseleave", (event) => {
        const bounds = this.canvas.getBoundingClientRect();
        if (event.clientX >= bounds.left && event.clientX <= bounds.right &&
            event.clientY >= bounds.top && event.clientY <= bounds.bottom) return;
        if (!this.drag) this.hovered = null;
        this.releaseHook();
        this.aquariumPointer = null;
      }, options);

      this.shell.addEventListener("keydown", (event) => this.onKeyDown(event), options);
      document.addEventListener("keydown", (event) => this.onSecretKeyDown(event), options);
      this.shell.addEventListener("keyup", (event) => this.keys.delete(event.code), options);
      this.shell.addEventListener("blur", () => this.keys.clear(), options);
      window.addEventListener?.("blur", () => this.clearInteractionState(), options);
      document.addEventListener?.("visibilitychange", () => {
        if (document.hidden) this.clearInteractionState();
      }, options);

      this.controls.reset?.addEventListener("click", () => this.resetCamera(), options);
      this.controls.tidy?.addEventListener("click", () => this.tidyStars(), options);
      this.controls.auto?.addEventListener("click", () => {
        if (motionReduced()) {
          this.onRestoreMotion();
          return;
        }
        this.stopFlight();
        this.setAutoRotate(!this.autoRotate);
      }, options);
      this.controls.focus?.addEventListener("click", () => this.focusSelected(), options);
      this.controls.labels?.addEventListener("click", () => {
        this.showLabels = !this.showLabels;
        this.updateControlState();
        this.onToast(this.showLabels ? "Smart research titles enabled." : "Research titles return to hover mode.");
      }, options);
      this.controls.zoomIn?.addEventListener("click", () => {
        this.stopFlight();
        this.setDistance(this.camera.distance * 0.78);
      }, options);
      this.controls.zoomOut?.addEventListener("click", () => {
        this.stopFlight();
        this.setDistance(this.camera.distance * 1.28);
      }, options);
      if (this.controls.zoomRange) {
        let zoomPointer = null;
        const setZoomFromPointer = (event) => {
          const bounds = this.controls.zoomRange.getBoundingClientRect();
          const position = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1), 0, 1);
          this.stopFlight();
          this.setDistance(120 * Math.pow(1500 / 120, position));
        };
        this.controls.zoomRange.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          zoomPointer = event.pointerId;
          this.controls.zoomRange.setPointerCapture?.(event.pointerId);
          this.controls.zoomRange.classList.add("is-active");
          setZoomFromPointer(event);
        }, options);
        this.controls.zoomRange.addEventListener("pointermove", (event) => {
          if (event.pointerId === zoomPointer) setZoomFromPointer(event);
        }, options);
        const releaseZoom = (event) => {
          if (event.pointerId !== zoomPointer) return;
          zoomPointer = null;
          this.controls.zoomRange.classList.remove("is-active");
        };
        this.controls.zoomRange.addEventListener("pointerup", releaseZoom, options);
        this.controls.zoomRange.addEventListener("pointercancel", releaseZoom, options);
        this.controls.zoomRange.addEventListener("keydown", (event) => {
          const actions = {
            ArrowUp: () => this.setDistance(this.camera.distance * 0.88),
            ArrowDown: () => this.setDistance(this.camera.distance * 1.14),
            PageUp: () => this.setDistance(this.camera.distance * 0.7),
            PageDown: () => this.setDistance(this.camera.distance * 1.42),
            Home: () => this.setDistance(120),
            End: () => this.setDistance(1500)
          };
          if (!Object.hasOwn(actions, event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          this.stopFlight();
          actions[event.key]();
        }, options);
      }
      this.controls.open?.addEventListener("click", () => {
        if (this.selected?.item) this.onArtifact(this.selected.item.id);
      }, options);
      this.controls.favourite?.addEventListener("click", () => {
        if (!this.selected?.item) return;
        this.onFavourite(this.selected.item.id);
        this.select(this.selected);
      }, options);
      this.controls.fly?.addEventListener("click", () => this.focusSelected(), options);
      this.controls.navigatorButtons.forEach((button) => {
        const action = button.dataset.spaceNav;
        const release = () => {
          this.navActions.delete(action);
          button.classList.remove("is-active");
        };
        button.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          this.shell.focus({ preventScroll: true });
          this.stopFlight();
          this.navActions.add(action);
          button.classList.add("is-active");
          button.setPointerCapture?.(event.pointerId);
          this.applyNavigation(action, 65);
        }, options);
        button.addEventListener("pointerup", release, options);
        button.addEventListener("pointercancel", release, options);
        button.addEventListener("lostpointercapture", release, options);
        button.addEventListener("click", (event) => {
          if (event.detail === 0) this.applyNavigation(action, 110);
        }, options);
      });
    }

    onPointerDown(event) {
      this.rememberAquariumPointer(event);
      this.shell.focus({ preventScroll: true });
      // A secondary click is an explicit, persistent rotation toggle. Treating
      // it as a hold was almost impossible to notice because an ordinary right
      // click is released before another animation frame is drawn.
      if (event.button === 2) {
        event.preventDefault();
        this.stopFlight();
        this.setAutoRotate(!this.autoRotate);
        this.onToast(this.autoRotate ? "Constellation rotation resumed." : "Constellation rotation paused.");
        return;
      }
      this.canvas.setPointerCapture?.(event.pointerId);
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      this.stopFlight();

      if (this.pointers.size === 2) {
        this.cancelMobileDive();
        const points = [...this.pointers.values()];
        const vectorX = points[1].x - points[0].x;
        const vectorY = points[1].y - points[0].y;
        const distance = Math.hypot(vectorX, vectorY);
        this.pinch = {
          distance,
          vectorX,
          vectorY,
          centerX: (points[0].x + points[1].x) / 2,
          centerY: (points[0].y + points[1].y) / 2,
          suspended: distance < MIN_PINCH_SPAN
        };
        this.drag = null;
        this.shell.classList.remove("is-star-tugging");
        this.shell.classList.add("is-navigating");
        return;
      }

      const picked = !event.shiftKey ? this.pick(event.clientX, event.clientY, Boolean(this.hookedFish)) : null;
      this.releaseHook();
      this.drag = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        pan: event.shiftKey,
        // In a dense year almost every point is over a star. Plain dragging
        // must therefore always orbit the whole constellation. Alt preserves
        // the specialist star-tug interaction without stealing mouse or touch
        // steering from the primary gesture.
        node: (this.fishTank || event.altKey) && picked?.type === "article" ? picked : null,
        lastMoveTime: event.timeStamp,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        orbitSamples: 0,
        orbitSpeed: null,
        lastOrbitTime: event.timeStamp
      };
      if (this.drag.node) {
        this.select(this.drag.node);
        this.shell.classList.add("is-star-tugging");
      } else {
        this.shell.classList.add("is-navigating");
      }
      this.startMobileDive(event);
    }

    startMobileDive(event) {
      if (event.pointerType !== "touch" || this.pointers.size !== 1) return;
      const bounds = this.canvas.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      if (Math.hypot(event.clientX - centerX, event.clientY - centerY) > 24) return;
      const pointerId = event.pointerId;
      const timer = setTimeout(() => {
        if (this.mobileDive?.pointerId !== pointerId || this.pointers.size !== 1 || !this.pointers.has(pointerId)) return;
        this.cancelMobileDive();
        this.drag = null;
        this.shell.classList.remove("is-navigating", "is-star-tugging");
        this.toggleFishTank("touch");
      }, 1500);
      this.mobileDive = { pointerId, x: event.clientX, y: event.clientY, timer };
      this.shell.classList.add("is-dive-arming");
    }

    cancelMobileDive() {
      if (!this.mobileDive) return;
      clearTimeout(this.mobileDive.timer);
      this.mobileDive = null;
      this.shell.classList.remove("is-dive-arming");
    }

    onPointerMove(event) {
      this.rememberAquariumPointer(event);
      if (!this.pointers.has(event.pointerId)) {
        this.hovered = this.pick(event.clientX, event.clientY);
        this.shell.classList.toggle("has-star-hover", Boolean(this.hovered));
        return;
      }

      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.mobileDive?.pointerId === event.pointerId) {
        const distance = Math.hypot(event.clientX - this.mobileDive.x, event.clientY - this.mobileDive.y);
        if (distance <= 12) return;
        this.cancelMobileDive();
      }
      if (this.pointers.size >= 2) {
        const points = [...this.pointers.values()].slice(0, 2);
        const vectorX = points[1].x - points[0].x;
        const vectorY = points[1].y - points[0].y;
        const currentDistance = Math.hypot(vectorX, vectorY);
        const centerX = (points[0].x + points[1].x) / 2;
        const centerY = (points[0].y + points[1].y) / 2;
        if (this.pinch) {
          const crossed = this.pinch.vectorX * vectorX + this.pinch.vectorY * vectorY <= 0;
          const suspended = this.pinch.suspended || currentDistance < MIN_PINCH_SPAN || crossed;
          if (!suspended && this.pinch.distance >= MIN_PINCH_SPAN) {
            const ratio = clamp(this.pinch.distance / currentDistance, 1 / MAX_PINCH_RATIO, MAX_PINCH_RATIO);
            this.setDistance(this.camera.distance * ratio);
          }
          // A pinch is zoom-only. Applying each finger's midpoint movement as
          // pan made the target drift twice during a symmetric gesture and
          // could leave the entire constellation off-screen on a phone.
          this.pinch = { distance: currentDistance, vectorX, vectorY, centerX, centerY, suspended };
        } else {
          this.pinch = {
            distance: currentDistance,
            vectorX,
            vectorY,
            centerX,
            centerY,
            suspended: currentDistance < MIN_PINCH_SPAN
          };
        }
        return;
      }

      if (!this.drag || this.drag.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - this.drag.x;
      const deltaY = event.clientY - this.drag.y;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
      if (Math.hypot(event.clientX - this.drag.startX, event.clientY - this.drag.startY) > 4) this.drag.moved = true;
      // Wait for a deliberate one-pointer drag: a second touch may start a
      // pinch, which should preserve the user's drift setting like other zooms.
      if (!this.drag.moved || (!deltaX && !deltaY)) return;
      if (this.drag.node) {
        this.tugNode(this.drag.node, deltaX, deltaY, event.timeStamp);
      } else if (this.drag.pan || event.shiftKey) {
        this.panBy(deltaX, deltaY);
      } else {
        this.rememberOrbitDirection(deltaX, deltaY, event.timeStamp);
        this.orbitBy(-deltaX * 0.006, deltaY * 0.005);
      }
    }

    onPointerUp(event) {
      this.rememberAquariumPointer(event);
      this.cancelMobileDive();
      const wasClick = this.drag?.pointerId === event.pointerId && !this.drag.moved;
      const releasedNode = this.drag?.pointerId === event.pointerId ? this.drag.node : null;
      if (releasedNode) {
        const reduced = motionReduced();
        releasedNode.anchorX = releasedNode.x;
        releasedNode.anchorY = releasedNode.y;
        releasedNode.anchorZ = releasedNode.z;
        releasedNode.velocityX = reduced ? 0 : this.drag.velocityX;
        releasedNode.velocityY = reduced ? 0 : this.drag.velocityY;
        releasedNode.velocityZ = reduced ? 0 : this.drag.velocityZ;
        if (this.fishTank && event.type !== "pointercancel") {
          if (event.pointerType === "touch") this.recordCatch(releasedNode, true);
          else this.catchFish(releasedNode);
        }
      }
      this.pointers.delete(event.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      if (wasClick) this.select(this.pick(event.clientX, event.clientY));
      if (this.pointers.size === 1) {
        const [pointerId, point] = this.pointers.entries().next().value;
        this.drag = { pointerId, x: point.x, y: point.y, startX: point.x, startY: point.y, moved: true, pan: false };
      } else if (this.drag?.pointerId === event.pointerId) {
        this.drag = null;
      }
      this.shell.classList.toggle("is-navigating", this.pointers.size > 0);
      this.shell.classList.remove("is-star-tugging");
    }

    clearInteractionState() {
      this.cancelMobileDive();
      this.releaseHook();
      this.aquariumPointer = null;
      this.pointers.clear();
      this.pinch = null;
      this.drag = null;
      this.keys.clear();
      this.navActions.clear();
      this.shell.classList.remove("is-navigating", "is-star-tugging");
      this.updateControlState();
    }

    rememberAquariumPointer(event) {
      if (!this.fishTank || event.pointerType === "touch") return;
      const bounds = this.canvas.getBoundingClientRect();
      this.aquariumPointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: performance.now() };
    }

    catchFish(node) {
      const pointer = this.aquariumPointer;
      if (!pointer) return;
      const projected = this.project(node, this.cameraBasis());
      const fish = projected && this.fishPosition(node, projected, this.visualTime);
      this.hookedFish = node;
      this.hookOffset = fish ? { x: fish.x - pointer.x, y: fish.y - pointer.y } : { x: 0, y: 0 };
      this.recordCatch(node);
    }

    recordCatch(node, touch = false) {
      this.catchFlashTime = performance.now();
      const identity = node.item?.id || node.item?.title;
      const newCatch = !this.caughtFishIds.has(identity);
      if (newCatch) this.caughtFishIds.add(identity);
      this.catchFlashLabel = newCatch ? "NEW CATCH" : "CAUGHT AGAIN";
      if (newCatch && this.caughtFishIds.size === Math.min(5, this.nodes.length)) {
        this.onToast("School complete! Keep exploring the tank.");
      } else if (touch && newCatch) {
        this.onToast(`New catch! ${this.caughtFishIds.size}/${Math.min(5, this.nodes.length)}`);
      }
    }

    releaseHook() {
      if (!this.hookedFish) return;
      const node = this.hookedFish;
      const projected = this.project(node, this.cameraBasis());
      const position = projected && this.fishPosition(node, projected, this.visualTime);
      this.hookedFish = null;
      if (position) this.hookRelease = { node, x: position.x, y: position.y, time: performance.now() };
    }

    onKeyDown(event) {
      if (["INPUT", "BUTTON", "SELECT", "A"].includes(event.target.tagName)) return;
      const handled = [
        "KeyW", "KeyS", "KeyA", "KeyD", "KeyQ", "KeyE",
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyR", "KeyF", "Enter", "Escape"
      ];
      if (!handled.includes(event.code)) return;
      event.preventDefault();

      if (event.code === "KeyR") return this.resetCamera();
      if (event.code === "KeyF") return this.focusSelected();
      if (event.code === "Enter" && this.selected?.item) return this.onArtifact(this.selected.item.id);
      if (event.code === "Escape") return this.select(null);
      this.stopFlight();
      this.keys.add(event.code);
    }

    onSecretKeyDown(event) {
      const target = event.target;
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey ||
          target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) {
        this.fishSequence = "";
        return;
      }
      const letter = String(event.key || "").toLowerCase();
      if (!/^[a-z]$/.test(letter)) {
        this.fishSequence = "";
        return;
      }
      const now = performance.now();
      this.fishSequence = now - this.fishSequenceTime > 2000 ? "" : this.fishSequence;
      this.fishSequenceTime = now;
      this.fishSequence = (this.fishSequence + letter).slice(-4);
      if (this.fishSequence !== "fish") return;
      this.fishSequence = "";
      this.toggleFishTank();
    }

    toggleFishTank(source = "keyboard") {
      this.fishTank = !this.fishTank;
      if (!this.fishTank) {
        this.releaseHook();
        this.hookRelease = null;
        this.caughtFishIds.clear();
      }
      this.aquariumPointer = null;
      this.stopFlight();
      this.shell.classList.toggle("is-fish-tank", this.fishTank);
      this.shell.setAttribute("aria-label", this.fishTank
        ? "Interactive fish tank game. Catch five different fish. On a mouse, a caught fish follows the hook within its school; click open water to release it. On touch, tap fish to catch them. Type fish or hold the centre reticle to return to the constellation."
        : "Navigable three-dimensional research constellation. Drag in any direction to set the continuing orbit direction. Right-click to pause or resume rotation.");
      this.onToast(this.fishTank
        ? source === "touch" ? "Catch five fish. Hold the centre again to return." : "Catch five fish. Click one, move your hook, then click water to release."
        : "Back among the stars.");
    }

    resize() {
      const bounds = this.shell.getBoundingClientRect();
      this.width = Math.max(1, Math.round(bounds.width));
      this.height = Math.max(1, Math.round(bounds.height));
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.round(this.width * this.pixelRatio);
      const targetHeight = Math.round(this.height * this.pixelRatio);
      if (this.canvas.width !== targetWidth) this.canvas.width = targetWidth;
      if (this.canvas.height !== targetHeight) this.canvas.height = targetHeight;
      this.focalLength = Math.max(480, Math.min(this.width, this.height) * 1.05);
    }

    cameraBasis() {
      const cosine = Math.cos(this.camera.pitch);
      const position = {
        x: this.camera.target.x + Math.sin(this.camera.yaw) * cosine * this.camera.distance,
        y: this.camera.target.y + Math.sin(this.camera.pitch) * this.camera.distance,
        z: this.camera.target.z - Math.cos(this.camera.yaw) * cosine * this.camera.distance
      };
      const forward = normalize(subtract(this.camera.target, position));
      let right = normalize(cross(forward, { x: 0, y: 1, z: 0 }));
      if (!Number.isFinite(right.x)) right = { x: 1, y: 0, z: 0 };
      let up = normalize(cross(right, forward));
      if (this.camera.roll) {
        const baseRight = right;
        const cosine = Math.cos(this.camera.roll);
        const sine = Math.sin(this.camera.roll);
        right = {
          x: baseRight.x * cosine + up.x * sine,
          y: baseRight.y * cosine + up.y * sine,
          z: baseRight.z * cosine + up.z * sine
        };
        up = {
          x: up.x * cosine - baseRight.x * sine,
          y: up.y * cosine - baseRight.y * sine,
          z: up.z * cosine - baseRight.z * sine
        };
      }
      return { position, forward, right, up };
    }

    orbitBy(yawDelta, pitchDelta) {
      this.camera.yaw += yawDelta;
      this.camera.pitch += pitchDelta;
      const pole = Math.PI / 2;
      // Spherical yaw/pitch coordinates reflect at a pole. Applying the
      // equivalent yaw and roll half-turn preserves both camera position and
      // screen orientation, so a vertical orbit passes over the pole instead
      // of stopping against a pitch clamp or visibly flipping the scene.
      while (this.camera.pitch > pole || this.camera.pitch < -pole) {
        if (this.camera.pitch > pole) this.camera.pitch = Math.PI - this.camera.pitch;
        else this.camera.pitch = -Math.PI - this.camera.pitch;
        this.camera.yaw += Math.PI;
        this.camera.roll += Math.PI;
        this.orbitDirection.pitch *= -1;
      }
      // Avoid the singular exact-pole basis if a synthetic or unusually even
      // pointer delta lands on it exactly.
      if (Math.abs(Math.abs(this.camera.pitch) - pole) < 1e-7) {
        this.camera.pitch -= Math.sign(this.camera.pitch || 1) * 1e-7;
      }
    }

    project(point, basis) {
      const relative = subtract(point, basis.position);
      const z = dot(relative, basis.forward);
      if (z < 8) return null;
      const scale = this.focalLength / z;
      return {
        x: this.width / 2 + dot(relative, basis.right) * scale,
        y: this.height / 2 - dot(relative, basis.up) * scale,
        z,
        scale
      };
    }

    panBy(deltaX, deltaY) {
      const basis = this.cameraBasis();
      const scale = this.camera.distance / Math.max(this.height, 300) * 0.9;
      addScaled(this.camera.target, basis.right, -deltaX * scale);
      addScaled(this.camera.target, basis.up, deltaY * scale);
    }

    rememberOrbitDirection(deltaX, deltaY, timeStamp) {
      // Weight the components by the same angular sensitivity used for the
      // direct camera movement. A little smoothing ignores the final one-pixel
      // wobble that often occurs as a mouse or finger is released.
      const yaw = -deltaX * 0.006;
      const pitch = deltaY * 0.005;
      const magnitude = Math.hypot(yaw, pitch);
      if (magnitude < 0.0001) return;
      const next = { yaw: yaw / magnitude, pitch: pitch / magnitude };
      const samples = this.drag?.orbitSamples || 0;
      if (!samples) {
        this.orbitDirection = next;
      } else {
        const blend = 0.42;
        const blendedYaw = mix(this.orbitDirection.yaw, next.yaw, blend);
        const blendedPitch = mix(this.orbitDirection.pitch, next.pitch, blend);
        const blendedMagnitude = Math.hypot(blendedYaw, blendedPitch) || 1;
        this.orbitDirection = {
          yaw: blendedYaw / blendedMagnitude,
          pitch: blendedPitch / blendedMagnitude
        };
      }
      if (this.drag) {
        const now = Number.isFinite(timeStamp) ? timeStamp : performance.now();
        const previousTime = Number.isFinite(this.drag.lastOrbitTime) ? this.drag.lastOrbitTime : now - 16;
        const elapsed = clamp(now - previousTime, 4, 250);
        const measuredSpeed = magnitude / elapsed;
        const previousSpeed = this.drag.orbitSpeed;
        // Smooth consecutive pointer samples, but retain a wide range so a
        // deliberate slow turn does not get promoted immediately to cruising
        // speed and a quick flick still feels responsive.
        const sampledSpeed = previousSpeed === null
          ? measuredSpeed
          : mix(previousSpeed, measuredSpeed, 0.46);
        this.orbitSpeed = clamp(sampledSpeed, STANDARD_ORBIT_SPEED * 0.08, 0.0045);
        this.drag.orbitSpeed = this.orbitSpeed;
        this.drag.lastOrbitTime = now;
        this.drag.orbitSamples = samples + 1;
      }
    }

    tugNode(node, deltaX, deltaY, timeStamp) {
      const basis = this.cameraBasis();
      const projected = this.project(node, basis);
      if (!projected) return;
      const scale = projected.z / this.focalLength;
      const movement = {
        x: basis.right.x * deltaX * scale - basis.up.x * deltaY * scale,
        y: basis.right.y * deltaX * scale - basis.up.y * deltaY * scale,
        z: basis.right.z * deltaX * scale - basis.up.z * deltaY * scale
      };
      node.x += movement.x;
      node.y += movement.y;
      node.z += movement.z;

      const maximum = isTopTen(node.item) ? 112 : 78;
      const offsetX = node.x - node.homeX;
      const offsetY = node.y - node.homeY;
      const offsetZ = node.z - node.homeZ;
      const distance = Math.hypot(offsetX, offsetY, offsetZ);
      if (distance > maximum) {
        const amount = maximum / distance;
        node.x = node.homeX + offsetX * amount;
        node.y = node.homeY + offsetY * amount;
        node.z = node.homeZ + offsetZ * amount;
      }

      const elapsed = clamp(timeStamp - this.drag.lastMoveTime, 8, 40) / 1000;
      this.drag.velocityX = movement.x / elapsed * 0.16;
      this.drag.velocityY = movement.y / elapsed * 0.16;
      this.drag.velocityZ = movement.z / elapsed * 0.16;
      this.drag.lastMoveTime = timeStamp;
      if (this.controls.tidy) this.controls.tidy.disabled = false;
    }

    setDistance(value) {
      this.camera.distance = clamp(Number(value) || this.camera.distance, 120, 1500);
      this.updateControlState();
    }

    applyNavigation(action, delta) {
      const basis = this.cameraBasis();
      const movement = delta * Math.max(0.055, this.camera.distance / 1100);
      if (action === "forward") this.setDistance(this.camera.distance - movement * 1.15);
      if (action === "back") this.setDistance(this.camera.distance + movement * 1.15);
      if (action === "turn-left") this.camera.yaw -= delta * 0.0018;
      if (action === "turn-right") this.camera.yaw += delta * 0.0018;
      if (action === "left") addScaled(this.camera.target, basis.right, -movement * 0.42);
      if (action === "right") addScaled(this.camera.target, basis.right, movement * 0.42);
      if (action === "up") addScaled(this.camera.target, basis.up, movement * 0.42);
      if (action === "down") addScaled(this.camera.target, basis.up, -movement * 0.42);
    }

    updateControlState() {
      if (this.controls.distance) this.controls.distance.textContent = Math.round(this.camera.distance);
      if (this.controls.zoomRange) {
        const position = Math.log(this.camera.distance / 120) / Math.log(1500 / 120) * 100;
        this.controls.zoomRange.style.setProperty("--zoom-position", `${clamp(position, 0, 100)}%`);
        this.controls.zoomRange.setAttribute("aria-valuenow", String(Math.round(this.camera.distance)));
        this.controls.zoomRange.setAttribute("aria-valuetext", `${Math.round(this.camera.distance)} astronomical units`);
      }
      if (this.controls.auto) {
        const reduced = motionReduced();
        const enabled = this.autoRotate && !reduced;
        const held = enabled && this.isInteracting();
        this.controls.auto.setAttribute("aria-pressed", String(enabled));
        this.controls.auto.setAttribute("aria-label", reduced ? "Restore motion and play rotation" : held ? "Rotation resumes on release" : enabled ? "Pause rotation" : "Play rotation");
        const autoText = reduced ? "▶ Play rotation" : held ? "Release to resume" : enabled ? "⏸ Pause rotation" : "▶ Play rotation";
        if (this.controls.auto.textContent !== autoText) this.controls.auto.textContent = autoText;
        this.controls.auto.disabled = false;
        this.controls.auto.title = reduced ? "Restore ambient motion and play rotation" : held ? "Automatic rotation resumes when the pointer or key is released" : enabled ? "Pause automatic rotation" : "Resume automatic rotation";
      }
      if (this.controls.labels) {
        this.controls.labels.setAttribute("aria-pressed", String(this.showLabels));
        this.controls.labels.textContent = this.showLabels ? "Titles on" : "Titles off";
      }
    }

    setAutoRotate(value) {
      this.autoRotate = Boolean(value);
      this.updateControlState();
    }

    isInteracting() {
      return this.pointers.size > 0 || this.keys.size > 0 || this.navActions.size > 0;
    }

    stopFlight() {
      this.flight = null;
    }

    beginFlight(target, distance, yaw = this.camera.yaw, pitch = this.camera.pitch, roll = this.camera.roll) {
      this.flight = {
        started: performance.now(),
        duration: motionReduced() ? 1 : 1050,
        fromTarget: { ...this.camera.target },
        target: { ...target },
        fromDistance: this.camera.distance,
        distance,
        fromYaw: this.camera.yaw,
        yaw,
        fromPitch: this.camera.pitch,
        pitch,
        fromRoll: this.camera.roll,
        roll
      };
    }

    resetCamera() {
      this.orbitDirection = { yaw: 1, pitch: 0 };
      this.orbitSpeed = STANDARD_ORBIT_SPEED;
      this.beginFlight(
        this.defaultCamera.target,
        this.defaultCamera.distance,
        this.defaultCamera.yaw,
        this.defaultCamera.pitch,
        this.defaultCamera.roll
      );
      this.onToast("Flight path reset to the full archive constellation.");
    }

    tidyStars() {
      const reduced = motionReduced();
      this.nodes.forEach((node) => {
        node.anchorX = node.homeX;
        node.anchorY = node.homeY;
        node.anchorZ = node.homeZ;
        node.velocityX = reduced ? 0 : (node.homeX - node.x) * 1.25;
        node.velocityY = reduced ? 0 : (node.homeY - node.y) * 1.25;
        node.velocityZ = reduced ? 0 : (node.homeZ - node.z) * 1.25;
        if (reduced) {
          node.x = node.homeX;
          node.y = node.homeY;
          node.z = node.homeZ;
        }
      });
      if (this.controls.tidy) this.controls.tidy.disabled = true;
      this.onToast("Research stars are returning to their original clusters.");
    }

    focusSelected() {
      if (!this.selected) {
        this.onToast("Select a research star before plotting a flight.");
        return;
      }
      this.beginFlight(this.selected, this.selected.type === "hub" ? 210 : 145);
    }

    pick(clientX, clientY, ignoreHooked = false) {
      const bounds = this.canvas.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      let nearest = null;
      let nearestDistance = Infinity;
      this.hits.forEach((hit) => {
        if (ignoreHooked && hit.node === this.hookedFish) return;
        const distance = Math.hypot(hit.x - x, hit.y - y);
        if (distance <= hit.hitRadius && distance < nearestDistance) {
          nearest = hit.node;
          nearestDistance = distance;
        }
      });
      return nearest;
    }

    select(node) {
      this.selected = node || null;
      const selection = this.controls.selection;
      if (!node) {
        if (selection) selection.hidden = true;
        if (this.controls.focus) this.controls.focus.disabled = true;
        return;
      }

      if (this.controls.focus) this.controls.focus.disabled = false;
      if (!selection) return;
      selection.hidden = false;
      if (node.type === "hub") {
        this.controls.selectionMeta.textContent = "Technique family / navigation beacon";
        this.controls.selectionTitle.textContent = node.name;
        this.controls.selectionPublisher.textContent = `${this.nodes.filter((candidate) => candidate.item.topic === node.name).length} research stars in this cluster`;
        this.controls.open.hidden = true;
        if (this.controls.favourite) this.controls.favourite.hidden = true;
      } else {
        const item = node.item;
        this.controls.selectionMeta.textContent = `${item.yearLabel || item.year} / ${item.topic}${isTopTen(item) ? ` / Top 10${item.rank ? ` #${item.rank}` : ""}` : item.preliminary ? " / preliminary · unranked" : " / nominee"}`;
        this.controls.selectionTitle.textContent = item.title;
        // A star is a painted dot, so the recording cannot be a glyph out
        // there; it is spelled into the readout beside the star's other facts,
        // keeping the archive's own distinction between a match it is sure of
        // and one it is only offering.
        const recording = item.videos?.length
          ? item.videos.some((video) => video.confidence === "confirmed") ? " · ▶ Recorded" : " · ▶ Possible recording"
          : "";
        this.controls.selectionPublisher.textContent = `${item.publisher || "Unknown publisher"} · ${item.kind || "Web research"} · ${item.read ? "Read" : "Unread"}${item.favourite ? " · Favourite" : ""}${recording}`;
        this.controls.open.hidden = false;
        if (this.controls.favourite) {
          this.controls.favourite.hidden = false;
          this.controls.favourite.setAttribute("aria-pressed", String(Boolean(item.favourite)));
          this.controls.favourite.textContent = item.favourite ? "★ Favourite" : "☆ Add favourite";
        }
      }
    }

    refreshReadState() {
      if (this.selected?.item) this.select(this.selected);
    }

    refreshFavouriteState() {
      if (this.selected?.item) this.select(this.selected);
    }

    spawnComet() {
      const fromLeft = this.cometRandom() > 0.5;
      const speed = 0.000052 + this.cometRandom() * 0.000028;
      this.comets.push({
        x: fromLeft ? -0.18 : 1.18,
        y: 0.14 + this.cometRandom() * 0.58,
        velocityX: fromLeft ? speed : -speed,
        velocityY: (this.cometRandom() - 0.5) * 0.000026,
        tail: 105 + this.cometRandom() * 125,
        size: 1.7 + this.cometRandom() * 1.8,
        color: this.topics[Math.floor(this.cometRandom() * Math.max(this.topics.length, 1))]?.color || "#b9ffe1",
        shimmer: this.cometRandom() * TAU
      });
    }

    updateComets(delta, time) {
      if (motionReduced()) {
        this.comets = [];
        return;
      }
      if (time >= this.nextComet && this.comets.length === 0) {
        this.spawnComet();
        this.nextComet = time + 38000 + this.cometRandom() * 52000;
      }
      this.comets.forEach((comet) => {
        comet.x += comet.velocityX * delta;
        comet.y += comet.velocityY * delta;
      });
      this.comets = this.comets.filter((comet) => comet.x > -0.28 && comet.x < 1.28 && comet.y > -0.2 && comet.y < 1.2);
    }

    update(delta, time, orbitDelta = delta) {
      if (this.flight) {
        const progress = motionReduced() ? 1 : clamp((time - this.flight.started) / this.flight.duration, 0, 1);
        const amount = ease(progress);
        this.camera.target.x = mix(this.flight.fromTarget.x, this.flight.target.x, amount);
        this.camera.target.y = mix(this.flight.fromTarget.y, this.flight.target.y, amount);
        this.camera.target.z = mix(this.flight.fromTarget.z, this.flight.target.z, amount);
        this.camera.distance = mix(this.flight.fromDistance, this.flight.distance, amount);
        this.camera.yaw = mix(this.flight.fromYaw, this.flight.yaw, amount);
        this.camera.pitch = mix(this.flight.fromPitch, this.flight.pitch, amount);
        this.camera.roll = mix(this.flight.fromRoll, this.flight.roll, amount);
        if (progress >= 1) this.flight = null;
      } else {
        if (this.autoRotate && !motionReduced() && !this.isInteracting()) {
          // Preserve the release velocity at first, then converge smoothly on
          // the established ambient speed without a visible gear change.
          const settle = 1 - Math.exp(-orbitDelta / ORBIT_SPEED_SETTLE_MS);
          this.orbitSpeed = mix(this.orbitSpeed, STANDARD_ORBIT_SPEED, settle);
          const orbitStep = orbitDelta * this.orbitSpeed;
          this.orbitBy(this.orbitDirection.yaw * orbitStep, this.orbitDirection.pitch * orbitStep);
        }
        const movement = delta * Math.max(0.03, this.camera.distance / 1000);
        if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) this.setDistance(this.camera.distance - movement * 0.65);
        if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) this.setDistance(this.camera.distance + movement * 0.65);
        if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) this.camera.yaw -= delta * 0.00125;
        if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) this.camera.yaw += delta * 0.00125;
        if (this.keys.has("KeyQ") || this.keys.has("KeyE")) {
          const basis = this.cameraBasis();
          addScaled(this.camera.target, basis.up, (this.keys.has("KeyQ") ? 1 : -1) * movement * 0.2);
        }
        this.navActions.forEach((action) => this.applyNavigation(action, delta));
      }
      this.updateNodePhysics(delta);
      this.updateComets(delta, time);
      this.updateControlState();
    }

    updateNodePhysics(delta) {
      const reduced = motionReduced();
      const seconds = Math.min(delta, 32) / 1000;
      const damping = Math.exp(-7.5 * seconds);
      const grabbed = this.drag?.node;
      this.nodes.forEach((node) => {
        if (node === grabbed) return;
        if (reduced) {
          node.x = node.anchorX;
          node.y = node.anchorY;
          node.z = node.anchorZ;
          node.velocityX = node.velocityY = node.velocityZ = 0;
          return;
        }
        node.velocityX += (node.anchorX - node.x) * 15 * seconds;
        node.velocityY += (node.anchorY - node.y) * 15 * seconds;
        node.velocityZ += (node.anchorZ - node.z) * 15 * seconds;
        node.velocityX *= damping;
        node.velocityY *= damping;
        node.velocityZ *= damping;
        node.x += node.velocityX * seconds;
        node.y += node.velocityY * seconds;
        node.z += node.velocityZ * seconds;
        const maximum = isTopTen(node.item) ? 112 : 78;
        const offsetX = node.x - node.homeX;
        const offsetY = node.y - node.homeY;
        const offsetZ = node.z - node.homeZ;
        const distance = Math.hypot(offsetX, offsetY, offsetZ);
        if (distance > maximum) {
          const amount = maximum / distance;
          node.x = node.homeX + offsetX * amount;
          node.y = node.homeY + offsetY * amount;
          node.z = node.homeZ + offsetZ * amount;
          node.velocityX *= -0.18;
          node.velocityY *= -0.18;
          node.velocityZ *= -0.18;
        }
        if (Math.hypot(node.velocityX, node.velocityY, node.velocityZ) < 0.015 &&
            Math.hypot(node.anchorX - node.x, node.anchorY - node.y, node.anchorZ - node.z) < 0.015) {
          node.x = node.anchorX;
          node.y = node.anchorY;
          node.z = node.anchorZ;
          node.velocityX = 0;
          node.velocityY = 0;
          node.velocityZ = 0;
        }
      });
    }

    drawBackdrop(time, basis) {
      if (this.fishTank) return this.drawAquariumBackdrop(time);
      const ctx = this.ctx;
      const background = ctx.createLinearGradient(0, 0, 0, this.height);
      background.addColorStop(0, "#020807");
      background.addColorStop(0.52, "#05120f");
      background.addColorStop(1, "#010504");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, this.width, this.height);

      const nebula = ctx.createRadialGradient(
        this.width * (0.58 + Math.sin(this.camera.yaw) * 0.09),
        this.height * 0.42,
        10,
        this.width * 0.56,
        this.height * 0.43,
        Math.max(this.width, this.height) * 0.68
      );
      nebula.addColorStop(0, "rgba(49,143,111,.16)");
      nebula.addColorStop(0.38, "rgba(24,75,68,.075)");
      nebula.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.globalCompositeOperation = "lighter";
      this.backgroundStars.forEach((star) => {
        const projected = this.project(star, basis);
        if (!projected || projected.x < -4 || projected.x > this.width + 4 || projected.y < -4 || projected.y > this.height + 4) return;
        const flicker = 0.88 + Math.sin(time * 0.0012 + star.phase) * 0.12;
        const size = clamp(star.size * (0.55 + projected.scale * 0.75), 0.35, 2.8);
        ctx.globalAlpha = star.alpha * flicker * clamp(1400 / projected.z, 0.25, 1);
        ctx.fillStyle = "#d9fff0";
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size, 0, TAU);
        ctx.fill();
      });
      this.drawComets(time);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    drawAquariumBackdrop(time) {
      const ctx = this.ctx;
      const water = ctx.createLinearGradient(0, 0, 0, this.height);
      water.addColorStop(0, "#063847");
      water.addColorStop(0.55, "#075466");
      water.addColorStop(1, "#062c37");
      ctx.fillStyle = water;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      const sway = motionReduced() ? 0 : Math.sin(time * 0.0004) * this.width * 0.025;
      for (let ray = 0; ray < 5; ray++) {
        const top = this.width * (ray + 0.35) / 5 + sway;
        const beam = ctx.createLinearGradient(top, 0, top + this.width * 0.13, this.height);
        beam.addColorStop(0, "rgba(194,253,255,.15)");
        beam.addColorStop(1, "rgba(194,253,255,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(top, 0);
        ctx.lineTo(top + this.width * 0.09, 0);
        ctx.lineTo(top + this.width * 0.28, this.height);
        ctx.lineTo(top + this.width * 0.02, this.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#092b2b";
      ctx.beginPath();
      ctx.moveTo(0, this.height * 0.96);
      for (let x = 0; x <= this.width + 12; x += 12) {
        ctx.lineTo(x, this.height * (0.955 + Math.sin(x * 0.027) * 0.009));
      }
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.fill();
      for (let plant = 0; plant < 12; plant++) {
        const x = this.width * (plant + 0.4) / 12;
        const height = this.height * (0.09 + (plant % 4) * 0.025);
        const wave = motionReduced() ? 0 : Math.sin(time * 0.001 + plant) * 7;
        ctx.strokeStyle = plant % 3 ? "rgba(61,172,119,.48)" : "rgba(91,201,156,.56)";
        ctx.lineWidth = 2 + plant % 3;
        ctx.beginPath();
        ctx.moveTo(x, this.height * 0.97);
        ctx.quadraticCurveTo(x + wave - 9, this.height - height * 0.5, x + wave, this.height - height);
        ctx.stroke();
      }
      for (let bubble = 0; bubble < 46; bubble++) {
        const seed = this.backgroundStars[bubble];
        const drift = motionReduced() ? 0 : time * (0.000018 + seed.size * 0.000006);
        const x = ((seed.x * 0.23 + this.width * 5) % this.width);
        const y = (this.height * (1 - ((bubble * 0.618 + drift) % 1)));
        const radius = 1.2 + seed.size * 1.7;
        ctx.strokeStyle = `rgba(191,244,241,${0.13 + seed.alpha * 0.22})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawComets(time) {
      const ctx = this.ctx;
      this.comets.forEach((comet) => {
        const headX = comet.x * this.width;
        const headY = comet.y * this.height;
        const velocityLength = Math.hypot(comet.velocityX, comet.velocityY) || 1;
        const directionX = comet.velocityX / velocityLength;
        const directionY = comet.velocityY / velocityLength;
        const tailX = headX - directionX * comet.tail;
        const tailY = headY - directionY * comet.tail;
        const trail = ctx.createLinearGradient(tailX, tailY, headX, headY);
        trail.addColorStop(0, "rgba(180,255,224,0)");
        trail.addColorStop(0.55, withAlpha(comet.color, 0.12));
        trail.addColorStop(0.9, withAlpha(comet.color, 0.62));
        trail.addColorStop(1, "rgba(245,255,250,.96)");
        ctx.globalAlpha = 0.75 + Math.sin(time * 0.002 + comet.shimmer) * 0.16;
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.quadraticCurveTo(
          mix(tailX, headX, 0.55),
          mix(tailY, headY, 0.55) + Math.sin(time * 0.0007 + comet.shimmer) * 5,
          headX,
          headY
        );
        ctx.stroke();
        ctx.shadowColor = comet.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#f4fff9";
        ctx.beginPath();
        ctx.arc(headX, headY, comet.size, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    drawOrbit(basis, axis, radius, alpha) {
      const ctx = this.ctx;
      ctx.beginPath();
      let drawing = false;
      for (let index = 0; index <= 80; index++) {
        const angle = index / 80 * TAU;
        const point = axis === "horizontal"
          ? { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius }
          : { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 };
        const projected = this.project(point, basis);
        if (!projected) {
          drawing = false;
          continue;
        }
        if (drawing) ctx.lineTo(projected.x, projected.y);
        else ctx.moveTo(projected.x, projected.y);
        drawing = true;
      }
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = `rgba(130,245,178,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawScene(time, basis) {
      if (this.fishTank) return this.drawAquariumScene(time, basis);
      const ctx = this.ctx;
      this.hits = [];
      this.drawOrbit(basis, "horizontal", 365, 0.075);
      this.drawOrbit(basis, "vertical", 305, 0.045);

      this.connections.forEach((connection) => {
        const from = this.project(connection.from, basis);
        const to = this.project(connection.to, basis);
        if (!from || !to) return;
        // Large preliminary collections can contain hundreds of spokes. Fade
        // the whole web as it grows so stars and cluster labels remain primary.
        const density = clamp(125 / Math.max(this.connections.length, 1), 0.4, 1);
        const alpha = clamp(0.24 - Math.max(from.z, to.z) / 6000, 0.035, 0.17) * density;
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, withAlpha(connection.from.color, alpha * 1.5));
        const winner = isTopTen(connection.to.item);
        gradient.addColorStop(1, withAlpha(winner ? WINNER_GOLD : connection.to.color, alpha * (winner ? 0.78 : 0.35)));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = (winner ? 0.82 : 0.65) * (0.75 + density * 0.25);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      const drawables = [...this.nodes, ...this.hubs]
        .map((node) => ({ node, projected: this.project(node, basis) }))
        .filter(({ projected }) => projected && projected.x > -80 && projected.x < this.width + 80 && projected.y > -80 && projected.y < this.height + 80)
        .sort((left, right) => right.projected.z - left.projected.z);

      drawables.forEach(({ node, projected }) => {
        if (node.type === "hub") this.drawHub(node, projected, time);
        else this.drawNode(node, projected, time);
      });
      const badgeRects = [];
      drawables
        .filter(({ node }) => node.type === "article" && isTopTen(node.item))
        .sort((left, right) => (left.node.item.rank || 99) - (right.node.item.rank || 99))
        .forEach(({ node, projected }) => {
          const pulse = 0.96 + Math.sin(time * 0.0016 * node.twinkle + node.pulse) * 0.04;
          const size = clamp(node.radius * projected.scale * pulse, 6.2, 35);
          const visibility = clamp(1.16 - projected.z / 2700, 0.46, 1);
          this.drawWinnerBadge(node, projected, size, visibility, badgeRects);
        });

      const labels = [];
      const occupied = [];
      const addLabel = (entry, force = false) => {
        if (!entry || labels.some((candidate) => candidate.node === entry.node)) return;
        const collision = occupied.some((point) => Math.abs(point.x - entry.projected.x) < 135 && Math.abs(point.y - entry.projected.y) < 42);
        if (!force && collision) return;
        labels.push(entry);
        occupied.push({ x: entry.projected.x, y: entry.projected.y });
      };

      drawables.filter(({ node }) => node.type === "hub").forEach((entry) => addLabel(entry));
      addLabel(drawables.find(({ node }) => node === this.hovered), true);
      addLabel(drawables.find(({ node }) => node === this.selected), true);
      if (this.showLabels) {
        const limit = this.camera.distance > 900 ? 9 : this.camera.distance > 560 ? 15 : this.camera.distance > 300 ? 24 : 38;
        drawables
          .filter(({ node }) => node.type === "article")
          .sort((left, right) => Number(isTopTen(right.node.item)) - Number(isTopTen(left.node.item)) || left.projected.z - right.projected.z)
          .slice(0, limit * 3)
          .forEach((entry) => {
            if (labels.length < limit + this.hubs.length) addLabel(entry);
          });
      }
      labels.sort((left, right) => right.projected.z - left.projected.z).forEach(({ node, projected }) => this.drawLabel(node, projected));
    }

    drawAquariumScene(time, basis) {
      const drawables = [...this.nodes, ...this.hubs]
        .map((node) => {
          const projected = this.project(node, basis);
          return { node, projected: projected && node.type === "article" ? this.fishPosition(node, projected, time) : projected };
        })
        .filter(({ projected }) => projected && projected.x > -80 && projected.x < this.width + 80 && projected.y > -80 && projected.y < this.height + 80)
        .sort((left, right) => right.projected.z - left.projected.z);
      this.hits = [];
      drawables.forEach(({ node, projected }) => {
        if (node.type === "hub") this.drawCoral(node, projected, time);
        else this.drawFish(node, projected, time);
      });
      const badgeRects = [];
      drawables.filter(({ node }) => node.type === "article" && isTopTen(node.item))
        .sort((left, right) => (left.node.item.rank || 99) - (right.node.item.rank || 99))
        .forEach(({ node, projected }) => {
          const size = clamp(node.radius * projected.scale * 1.25, 13, 35);
          this.drawWinnerBadge(node, projected, size, 1, badgeRects);
        });
      drawables.filter(({ node }) => node.type === "hub" || node === this.hovered || node === this.selected)
        .forEach(({ node, projected }) => this.drawLabel(node, projected));
      this.drawAquariumHook();
      this.drawAquariumHud();
    }

    hookRadius(node, projected) {
      return clamp(72 + node.radius * projected.scale * 1.35, 78, 125);
    }

    drawAquariumHud() {
      const ctx = this.ctx;
      const progress = this.caughtFishIds.size;
      const goal = Math.min(5, this.nodes.length);
      const width = Math.min(252, this.width - 24);
      const left = (this.width - width) / 2;
      const top = this.width < 700 ? 65 : 14;
      ctx.save();
      ctx.fillStyle = "rgba(2,27,37,.82)";
      ctx.strokeStyle = progress >= goal && goal ? "#ffdf8a" : "rgba(159,237,230,.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(left, top, width, 43, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = progress >= goal && goal ? "#ffebae" : "#d7fff1";
      ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(progress >= goal && goal ? "SCHOOL COMPLETE" : `HOOK THE SCHOOL  ${progress}/${goal}`, left + 12, top + 17);
      ctx.fillStyle = "#a9d4ce";
      ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(window.matchMedia?.("(pointer: coarse)")?.matches
        ? "Tap fish • hold centre to leave"
        : "Unique fish • click water to release", left + 12, top + 32);
      ctx.restore();
    }

    drawAquariumHook() {
      const pointer = this.aquariumPointer;
      if (!pointer) return;
      const caughtNode = this.drag?.node || this.hookedFish;
      const caught = caughtNode && this.hits.find((hit) => hit.node === caughtNode);
      const x = caught?.x ?? pointer.x;
      const y = caught?.y ?? pointer.y;
      const ctx = this.ctx;
      ctx.save();
      if (caughtNode && caught) {
        const base = this.project(caughtNode, this.cameraBasis());
        if (base) {
          ctx.strokeStyle = "rgba(255,232,161,.26)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 6]);
          ctx.beginPath();
          ctx.arc(base.x, base.y, this.hookRadius(caughtNode, base), 0, TAU);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.strokeStyle = caught ? "#fff0b8" : "#d0e8e5";
      ctx.lineWidth = caught ? 1.7 : 1.25;
      ctx.shadowColor = caught ? "#ffd778" : "#a4e2e4";
      ctx.shadowBlur = caught ? 9 : 4;
      ctx.beginPath();
      ctx.moveTo(x - 9, 0);
      ctx.quadraticCurveTo(x - 14, y * 0.55, x, y - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 3);
      ctx.quadraticCurveTo(x, y + 12, x + 8, y + 8);
      ctx.lineTo(x + 10, y + 3);
      ctx.stroke();
      const flashAge = performance.now() - this.catchFlashTime;
      if (caught && flashAge < 850) {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = clamp(1 - flashAge / 850, 0, 1);
        ctx.fillStyle = "#fff4c2";
        ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(this.catchFlashLabel, x + 17, y - 21 - (motionReduced() ? 0 : flashAge * 0.018));
      }
      ctx.restore();
    }

    fishPosition(node, projected, time) {
      if (node === this.hookedFish && this.aquariumPointer) {
        const dx = this.aquariumPointer.x + this.hookOffset.x - projected.x;
        const dy = this.aquariumPointer.y + this.hookOffset.y - projected.y;
        const distance = Math.hypot(dx, dy);
        const reach = this.hookRadius(node, projected);
        const limit = distance > reach ? reach / distance : 1;
        return {
          ...projected,
          x: projected.x + dx * limit,
          y: projected.y + dy * limit,
          direction: node.pattern % 2 ? -1 : 1
        };
      }
      if (motionReduced()) return { ...projected, direction: node.pattern % 2 ? -1 : 1 };
      const phase = time * (0.00064 + node.pattern * 0.00007) + node.pulse;
      const travel = 10 + node.pattern % 3 * 4;
      const position = {
        ...projected,
        x: projected.x + Math.sin(phase) * travel,
        y: projected.y + Math.sin(phase * 0.7 + node.patternPhase) * (3 + node.pattern % 3 * 1.5),
        direction: Math.cos(phase) >= 0 ? 1 : -1
      };
      if (this.hookRelease?.node === node) {
        const age = Math.max(0, time - this.hookRelease.time);
        if (age < 750) {
          const weight = Math.exp(-age / 180);
          position.x = mix(position.x, this.hookRelease.x, weight);
          position.y = mix(position.y, this.hookRelease.y, weight);
          return position;
        }
        this.hookRelease = null;
      }
      const pointer = this.aquariumPointer;
      if (!pointer || this.pointers.size || node === this.selected) return position;
      const age = Math.max(0, time - pointer.time);
      if (age > 1000) return position;
      const dx = position.x - pointer.x;
      const dy = position.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= 75) return position;
      const strength = Math.pow(1 - distance / 75, 2) * 12 * Math.exp(-age / 260);
      const direction = distance > 0.001 ? { x: dx / distance, y: dy / distance } : { x: position.direction, y: 0 };
      position.x += direction.x * strength;
      position.y += direction.y * strength;
      return position;
    }

    drawFish(node, projected, time) {
      const ctx = this.ctx;
      const selected = node === this.selected;
      const winner = isTopTen(node.item);
      const size = clamp(node.radius * projected.scale * 1.25, winner ? 13 : 7, winner ? 35 : 20);
      const direction = projected.direction;
      const wiggle = motionReduced() ? 0 : Math.sin(time * 0.005 + node.pulse) * 0.16;
      const kind = node.pattern % 3;
      const bodyHeight = [0.65, 0.82, 0.48][kind];
      const nose = [1, 0.86, 1.22][kind];
      const tailHeight = [0.64, 0.82, 0.48][kind];
      const visibility = clamp(1.25 - projected.z / 2900, 0.55, 1);
      ctx.save();
      ctx.globalAlpha = visibility;
      ctx.translate(projected.x, projected.y);
      ctx.scale(direction, 1);
      ctx.shadowColor = winner ? WINNER_GOLD : node.color;
      ctx.shadowBlur = selected ? 18 : winner ? 12 : 5;
      ctx.fillStyle = withAlpha(node.color, 0.82);
      ctx.strokeStyle = winner ? WINNER_GOLD : withAlpha(node.color, 0.95);
      ctx.lineWidth = winner ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.moveTo(-size * 0.65, 0);
      ctx.lineTo(-size * (1.48 + wiggle), -size * tailHeight);
      ctx.lineTo(-size * (1.22 - wiggle), 0);
      ctx.lineTo(-size * (1.48 + wiggle), size * tailHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.68, 0);
      ctx.bezierCurveTo(-size * 0.4, -size * bodyHeight * 1.15, size * 0.72, -size * bodyHeight, size * nose, 0);
      ctx.bezierCurveTo(size * 0.72, size * bodyHeight, -size * 0.4, size * bodyHeight * 1.15, -size * 0.68, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(226,255,241,.72)";
      ctx.beginPath();
      ctx.moveTo(-size * 0.13, -size * bodyHeight * 0.82);
      ctx.lineTo(size * (kind === 1 ? -0.08 : 0.23), -size * (kind === 2 ? 0.66 : 0.92));
      ctx.lineTo(size * 0.43, -size * bodyHeight * 0.72);
      ctx.fill();
      if (node.pattern >= 3) {
        ctx.strokeStyle = withAlpha(node.color, 0.9);
        ctx.lineWidth = Math.max(0.8, size * 0.07);
        for (let stripe = 0; stripe < 2; stripe++) {
          const x = size * (-0.22 + stripe * 0.3);
          ctx.beginPath();
          ctx.moveTo(x, -size * bodyHeight * 0.45);
          ctx.quadraticCurveTo(x + size * 0.08, 0, x, size * bodyHeight * 0.45);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "#f8ffed";
      ctx.beginPath();
      ctx.arc(size * nose * 0.55, -size * 0.12, Math.max(1.2, size * 0.09), 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#05232a";
      ctx.beginPath();
      ctx.arc(size * nose * 0.58, -size * 0.12, Math.max(0.6, size * 0.042), 0, TAU);
      ctx.fill();
      if (selected || node === this.hovered || node.item.favourite || node.item.read) {
        ctx.strokeStyle = selected ? "#ffffff" : node.item.favourite ? "#ffb454" : "#d9fff1";
        ctx.lineWidth = selected ? 1.5 : 1;
        ctx.setLineDash(selected ? [4, 4] : []);
        ctx.beginPath();
        ctx.ellipse(-size * 0.1, 0, size * 1.65, size * 1.15, 0, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
      this.hits.push({ node, x: projected.x, y: projected.y, hitRadius: Math.max(24, size * 1.8) });
    }

    drawCoral(node, projected, time) {
      const ctx = this.ctx;
      const size = clamp(node.radius * projected.scale * 2, 17, 38);
      ctx.save();
      ctx.translate(projected.x, projected.y);
      ctx.strokeStyle = node.color;
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2, size * 0.13);
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      for (let branch = -2; branch <= 2; branch++) {
        const wave = motionReduced() ? 0 : Math.sin(time * 0.001 + branch) * 2;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.6);
        ctx.quadraticCurveTo(branch * size * 0.13, -size * 0.25, branch * size * 0.35 + wave, -size * (0.6 + (branch % 2) * 0.17));
        ctx.stroke();
      }
      ctx.restore();
      this.hits.push({ node, x: projected.x, y: projected.y, hitRadius: size });
    }

    drawNode(node, projected, time) {
      const ctx = this.ctx;
      const pulse = 0.96 + Math.sin(time * 0.0016 * node.twinkle + node.pulse) * 0.04;
      const winner = isTopTen(node.item);
      const size = clamp(node.radius * projected.scale * pulse, winner ? 6.2 : 2.4, winner ? 35 : 23);
      const selected = node === this.selected;
      const hovered = node === this.hovered;
      const visibility = clamp(1.16 - projected.z / 2700, 0.46, 1);

      if (winner) this.drawWinnerHalo(node, projected, size, time, visibility);

      const compactStar = !winner && size < 5.2;
      const atmosphereRadius = size * (winner ? 2.15 : selected || hovered ? 2 : compactStar ? 1.65 : 1.8);
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      const atmosphere = ctx.createRadialGradient(projected.x, projected.y, size * 0.72, projected.x, projected.y, atmosphereRadius);
      atmosphere.addColorStop(0, withAlpha(node.color, selected ? 0.28 : hovered ? 0.22 : compactStar ? 0.12 : 0.16));
      atmosphere.addColorStop(0.52, withAlpha(node.color, compactStar ? 0.055 : 0.075));
      atmosphere.addColorStop(1, withAlpha(node.color, 0));
      ctx.globalAlpha = visibility;
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, atmosphereRadius, 0, TAU);
      ctx.fill();
      ctx.restore();

      const hasRing = node.pattern === 0 || (winner && node.item.rank === 1);
      if (hasRing && size > 4) {
        ctx.save();
        ctx.translate(projected.x, projected.y);
        ctx.rotate(node.patternTilt);
        ctx.strokeStyle = withAlpha(node.color, 0.38 * visibility);
        ctx.lineWidth = Math.max(0.7, size * 0.11);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.72, size * 0.43, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = visibility;
      const sphere = ctx.createRadialGradient(
        projected.x - size * 0.34,
        projected.y - size * 0.38,
        size * 0.06,
        projected.x,
        projected.y,
        size
      );
      sphere.addColorStop(0, "rgba(255,255,255,.98)");
      sphere.addColorStop(0.16, withAlpha(node.color, 0.98));
      sphere.addColorStop(0.64, withAlpha(node.color, 0.82));
      sphere.addColorStop(0.88, withAlpha(node.color, 0.38));
      sphere.addColorStop(1, "rgba(0,5,4,1)");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, TAU);
      ctx.fill();

      ctx.globalAlpha = visibility * (selected || hovered ? 1 : 0.78);
      ctx.strokeStyle = withAlpha(node.color, selected ? 0.98 : hovered ? 0.86 : 0.58);
      ctx.lineWidth = selected ? 1.4 : hovered ? 1.05 : 0.7;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, Math.max(0.8, size - 0.35), 0, TAU);
      ctx.stroke();

      if (compactStar) {
        ctx.globalAlpha = visibility * 0.5;
        ctx.strokeStyle = withAlpha(node.color, 0.68);
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(projected.x, projected.y - size * 1.45);
        ctx.lineTo(projected.x, projected.y + size * 1.45);
        ctx.moveTo(projected.x - size * 1.12, projected.y);
        ctx.lineTo(projected.x + size * 1.12, projected.y);
        ctx.stroke();
      }

      if (size > 5.4) this.drawPlanetPattern(node, projected, size, time);

      if (hasRing && size > 4) {
        ctx.save();
        ctx.translate(projected.x, projected.y);
        ctx.rotate(node.patternTilt);
        ctx.strokeStyle = withAlpha(node.color, 0.9 * visibility);
        ctx.lineWidth = Math.max(0.75, size * 0.1);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.72, size * 0.43, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      if (node.moon && size > 6) {
        const moonAngle = node.patternPhase + time * 0.00008;
        const moonX = projected.x + Math.cos(moonAngle) * size * 1.75;
        const moonY = projected.y + Math.sin(moonAngle) * size * 0.72;
        ctx.globalAlpha = visibility * 0.9;
        ctx.fillStyle = "#e7fff0";
        ctx.beginPath();
        ctx.arc(moonX, moonY, clamp(size * 0.13, 1, 2.6), 0, TAU);
        ctx.fill();
      }

      if (node.item.read) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "#e8fff1";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size + 4.5, -0.4, TAU - 0.4);
        ctx.stroke();
      }
      if (node.item.favourite) {
        ctx.globalAlpha = 0.94;
        ctx.strokeStyle = "#ffb454";
        ctx.lineWidth = 1.6;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size + (node.item.read ? 7.5 : 4.8), 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (selected) {
        const orbit = size * 3.1 + Math.sin(time * 0.004) * 2;
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, orbit, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
      this.hits.push({ node, x: projected.x, y: projected.y, hitRadius: Math.max(11, size * 2.6) });
    }

    drawWinnerHalo(node, projected, size, time, visibility) {
      const ctx = this.ctx;
      const shimmer = 0.97 + Math.sin(time * 0.0017 + node.pulse) * 0.03;
      const prominence = node.item.rank === 1 ? 1.08 : 1;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = visibility * shimmer * 0.42;
      const halo = ctx.createRadialGradient(projected.x, projected.y, size * 0.72, projected.x, projected.y, size * 3.15 * prominence);
      halo.addColorStop(0, "rgba(255,255,238,.25)");
      halo.addColorStop(0.24, withAlpha(WINNER_GOLD, 0.2));
      halo.addColorStop(0.6, withAlpha(WINNER_GOLD, 0.055));
      halo.addColorStop(1, withAlpha(WINNER_GOLD, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * 3.15 * prominence, 0, TAU);
      ctx.fill();

      ctx.translate(projected.x, projected.y);
      ctx.rotate(time * 0.00008 + node.patternPhase);
      ctx.strokeStyle = "rgba(255,250,218,.38)";
      ctx.lineWidth = node.item.rank === 1 ? 1 : 0.75;
      const rayCount = 4;
      for (let ray = 0; ray < rayCount; ray++) {
        ctx.rotate(TAU / rayCount);
        ctx.beginPath();
        ctx.moveTo(size * 1.42, 0);
        ctx.lineTo(size * (1.86 + prominence * 0.28), 0);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255,244,184,.58)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.48, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = withAlpha(WINNER_GOLD, 0.34);
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.95, size * 1.58, -time * 0.00012, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    drawWinnerBadge(node, projected, size, visibility, occupied = []) {
      const ctx = this.ctx;
      const label = node.item.rank ? `✦ #${node.item.rank}` : "✦ TOP";
      const badgeWidth = node.item.rank === 10 ? 38 : 34;
      const halfWidth = badgeWidth / 2;
      const right = projected.x + size + halfWidth + 6;
      const left = projected.x - size - halfWidth - 6;
      const upper = projected.y - size * 0.78;
      const lower = projected.y + size * 0.78;
      const candidates = [
        { x: right, y: upper },
        { x: left, y: upper },
        { x: right, y: lower },
        { x: left, y: lower },
        { x: projected.x, y: projected.y - size - 14 }
      ].map((candidate) => ({
        x: clamp(candidate.x, halfWidth + 7, this.width - halfWidth - 58),
        y: clamp(candidate.y, 13, this.height - 13)
      }));
      const overlapScore = (candidate) => occupied.reduce((score, rect) => {
        const overlapX = Math.max(0, Math.min(candidate.x + halfWidth + 3, rect.right) - Math.max(candidate.x - halfWidth - 3, rect.left));
        const overlapY = Math.max(0, Math.min(candidate.y + 11, rect.bottom) - Math.max(candidate.y - 11, rect.top));
        return score + overlapX * overlapY;
      }, 0);
      const position = candidates.reduce((best, candidate) => overlapScore(candidate) < overlapScore(best) ? candidate : best, candidates[0]);
      const badgeX = position.x;
      const badgeY = position.y;
      occupied.push({ left: badgeX - halfWidth, right: badgeX + halfWidth, top: badgeY - 8, bottom: badgeY + 8 });
      ctx.save();
      ctx.globalAlpha = visibility;
      ctx.fillStyle = "rgba(25,17,4,.92)";
      ctx.strokeStyle = "rgba(255,226,142,.72)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.roundRect(badgeX - badgeWidth / 2, badgeY - 8, badgeWidth, 16, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffe7a0";
      ctx.font = "800 8px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, badgeX, badgeY + 0.5);
      ctx.restore();
    }

    drawPlanetPattern(node, projected, size, time) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size - 0.35, 0, TAU);
      ctx.clip();
      ctx.translate(projected.x, projected.y);
      ctx.rotate(node.patternTilt + Math.sin(time * 0.00012 + node.patternPhase) * 0.08);
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.34;

      if (node.pattern === 0 || node.pattern === 1) {
        ctx.strokeStyle = "rgba(2,11,8,.9)";
        ctx.lineWidth = Math.max(0.55, size * 0.09);
        for (let index = -2; index <= 2; index++) {
          ctx.beginPath();
          ctx.ellipse(0, index * size * 0.32, size * 1.12, size * (0.11 + Math.abs(index) * 0.018), 0, 0, TAU);
          ctx.stroke();
        }
      }

      if (node.pattern === 1) {
        ctx.strokeStyle = "rgba(238,255,245,.42)";
        ctx.lineWidth = Math.max(0.45, size * 0.045);
        [-0.48, 0, 0.48].forEach((offset) => {
          ctx.beginPath();
          ctx.ellipse(offset * size, 0, size * 0.28, size * 1.1, 0, 0, TAU);
          ctx.stroke();
        });
      }

      if (node.pattern === 2) {
        for (let index = 0; index < 7; index++) {
          const angle = node.patternPhase + index * 2.17;
          const radial = size * (0.18 + (index % 3) * 0.22);
          ctx.fillStyle = index % 2 ? "rgba(2,10,7,.58)" : "rgba(240,255,247,.25)";
          ctx.beginPath();
          ctx.ellipse(Math.cos(angle) * radial, Math.sin(angle) * radial * 0.74, size * (0.08 + (index % 3) * 0.025), size * 0.055, angle, 0, TAU);
          ctx.fill();
        }
      }

      if (node.pattern === 3) {
        ctx.strokeStyle = "rgba(244,255,249,.32)";
        ctx.lineWidth = Math.max(0.7, size * 0.1);
        for (let offset = -2; offset <= 2; offset++) {
          ctx.beginPath();
          ctx.moveTo(-size * 1.2, offset * size * 0.38 - size * 0.55);
          ctx.lineTo(size * 1.2, offset * size * 0.38 + size * 0.55);
          ctx.stroke();
        }
      }

      if (node.pattern === 4) {
        ctx.strokeStyle = "rgba(0,7,5,.72)";
        ctx.lineWidth = Math.max(0.45, size * 0.055);
        for (let ray = 0; ray < 6; ray++) {
          const angle = node.patternPhase + ray * 1.13;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * size * 0.08, Math.sin(angle) * size * 0.08);
          ctx.lineTo(Math.cos(angle + 0.18) * size * 0.43, Math.sin(angle + 0.18) * size * 0.43);
          ctx.lineTo(Math.cos(angle - 0.08) * size * 0.88, Math.sin(angle - 0.08) * size * 0.88);
          ctx.stroke();
        }
      }

      if (node.pattern === 5) {
        ctx.fillStyle = "rgba(1,12,8,.48)";
        for (let island = 0; island < 4; island++) {
          const angle = node.patternPhase + island * 1.77;
          const x = Math.cos(angle) * size * 0.4;
          const y = Math.sin(angle) * size * 0.35;
          ctx.beginPath();
          ctx.moveTo(x - size * 0.18, y);
          ctx.quadraticCurveTo(x, y - size * 0.24, x + size * 0.24, y - size * 0.04);
          ctx.quadraticCurveTo(x + size * 0.1, y + size * 0.2, x - size * 0.18, y);
          ctx.fill();
        }
      }

      const terminator = ctx.createLinearGradient(-size, 0, size, 0);
      terminator.addColorStop(0, "rgba(255,255,255,.12)");
      terminator.addColorStop(0.52, "rgba(0,0,0,0)");
      terminator.addColorStop(1, "rgba(0,5,4,.58)");
      ctx.globalAlpha = 0.74;
      ctx.fillStyle = terminator;
      ctx.fillRect(-size, -size, size * 2, size * 2);
      ctx.restore();
    }

    drawHub(node, projected, time) {
      const ctx = this.ctx;
      const size = clamp(node.radius * projected.scale, 8, 20);
      const selected = node === this.selected;
      const visibility = clamp(1.2 - projected.z / 1800, 0.5, 1);
      ctx.save();
      ctx.globalAlpha = visibility;
      const aura = ctx.createRadialGradient(projected.x, projected.y, size * 0.62, projected.x, projected.y, size * (selected ? 2.15 : 1.75));
      aura.addColorStop(0, withAlpha(node.color, selected ? 0.24 : 0.14));
      aura.addColorStop(1, withAlpha(node.color, 0));
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * (selected ? 2.15 : 1.75), 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = visibility;
      const core = ctx.createRadialGradient(projected.x - size * 0.35, projected.y - size * 0.4, 1, projected.x, projected.y, size);
      core.addColorStop(0, "rgba(255,255,255,.94)");
      core.addColorStop(0.18, withAlpha(node.color, 0.82));
      core.addColorStop(0.7, withAlpha(node.color, 0.24));
      core.addColorStop(1, "rgba(1,8,6,.98)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(projected.x, projected.y, size * 0.45, size, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(projected.x, projected.y, size, size * 0.34, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.ellipse(projected.x, projected.y, size * 2.25, size * 0.72, time * 0.00015, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 2.3, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
      this.hits.push({ node, x: projected.x, y: projected.y, hitRadius: Math.max(17, size * 2.3) });
    }

    drawLabel(node, projected) {
      const ctx = this.ctx;
      const isHub = node.type === "hub";
      const selected = node === this.selected || node === this.hovered;
      const titleLimit = selected ? 72 : this.camera.distance < 300 ? 64 : this.camera.distance < 600 ? 50 : 34;
      const title = isHub ? node.name.toUpperCase() : shortened(node.item.title, titleLimit);
      const subline = isHub
        ? `${this.nodes.filter((candidate) => candidate.item.topic === node.name).length} ${this.fishTank ? "FISH SCHOOL" : "STAR CLUSTER"}`
        : `${node.item.yearLabel || node.item.year} · ${node.item.topic}${node.item.rank ? ` · #${node.item.rank}` : node.item.preliminary ? " · PRELIMINARY" : ""}`;
      const fontSize = isHub ? clamp(9.5 + projected.scale, 10, 13) : clamp(8.5 + projected.scale * 1.25, 9, 14);
      ctx.font = `${isHub ? 700 : 600} ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      const width = Math.max(ctx.measureText(title).width, ctx.measureText(subline).width) + 18;
      const height = fontSize + 27;
      const screenRadius = isHub
        ? clamp(node.radius * projected.scale, 8, 20)
        : clamp(node.radius * projected.scale, 2.4, 35);
      const left = clamp(projected.x + screenRadius + 11, 8, this.width - width - 8);
      const top = clamp(projected.y - height * 0.45, 8, this.height - height - 8);
      const connectorX = left > projected.x ? left : left + width;
      const connectorY = clamp(projected.y, top + 7, top + height - 7);
      ctx.globalAlpha = isHub ? 0.88 : 0.96;
      ctx.strokeStyle = withAlpha(node.color, selected ? 0.72 : 0.34);
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(projected.x + (connectorX > projected.x ? screenRadius : -screenRadius), projected.y);
      ctx.lineTo(connectorX, connectorY);
      ctx.stroke();
      ctx.fillStyle = "rgba(2,9,7,.91)";
      ctx.strokeStyle = withAlpha(node.color, selected ? 0.72 : 0.42);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(left, top, width, height, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isHub ? node.color : "#edfff4";
      ctx.fillText(title, left + 9, top + fontSize + 4);
      ctx.fillStyle = withAlpha(node.color, 0.82);
      ctx.font = `${clamp(fontSize - 2.5, 7.5, 10)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText(subline, left + 9, top + fontSize + 17);
      ctx.globalAlpha = 1;
    }

    render(time) {
      if (!motionReduced()) this.visualTime = time;
      time = this.visualTime;
      const ctx = this.ctx;
      ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);
      const basis = this.cameraBasis();
      this.drawBackdrop(time, basis);
      this.drawScene(time, basis);
    }

    loop(time) {
      try {
        // The modal backdrop already covers the map. Redrawing its stars under
        // a blur every frame wastes CPU, especially in software-rendered WebKit.
        if (document.body.classList.contains("document-dialog-open")) {
          this.lastTime = time;
          this.frame = requestAnimationFrame((nextTime) => this.loop(nextTime));
          return;
        }
        const elapsed = this.lastTime ? Math.max(0, time - this.lastTime) : 16;
        const delta = Math.min(40, elapsed);
        this.lastTime = time;
        // Keep camera drift tied to elapsed time when a frame takes longer to
        // paint. Physics stays capped so a resumed tab cannot fling nodes.
        this.update(delta, time, Math.min(120, elapsed));
        this.render(time);
        this.frame = requestAnimationFrame((nextTime) => this.loop(nextTime));
      } catch (error) {
        this.shell.dataset.renderError = error?.message || "Unknown canvas error";
        console.error("Constellation renderer stopped:", error);
      }
    }

    destroy() {
      this.cancelMobileDive();
      cancelAnimationFrame(this.frame);
      this.resizeObserver?.disconnect();
      this.abortController.abort();
      this.keys.clear();
      this.pointers.clear();
    }
  }

  window.Constellation3D = Constellation3D;
})();
