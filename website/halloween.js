/* Optional decoration only: no archive state, navigation or reader dependency. */
(() => {
  "use strict";
  // Embedded document pages keep their original rendering. The host archive
  // supplies the seasonal surround and its preference control.
  if (window.self !== window.top) return;
  const root = document.documentElement;
  const config = window.WEBHACKLIST_HALLOWEEN;
  const assetBase = new URL(".", document.currentScript.src);
  const key = "websec-halloween-v1";
  let preference;
  let banner;
  let timer;
  let assets;
  let hauntReady = false;
  function loadAsset(file, style) {
    return new Promise((resolve, reject) => {
      const element = document.createElement(style ? "link" : "script");
      const url = new URL(file + "?v=20261031.2", assetBase).href;
      if (style) { element.rel = "stylesheet"; element.href = url; }
      else { element.src = url; element.async = true; }
      element.onload = resolve;
      element.onerror = () => { element.remove(); reject(Error("Optional haunting asset unavailable")); };
      document.head.append(element);
    });
  }
  function updateHaunt(active) {
    if (!document.body) return;
    if (hauntReady || !active) {
      window.WebHackHalloweenWorld?.setActive(active && hauntReady);
      window.WebHackHalloweenLab?.setActive(active && hauntReady);
    }
    if (!active || assets) return;
    assets = Promise.all([
      loadAsset("halloween-world.css", true), loadAsset("halloween-lab.css", true),
      loadAsset("halloween-world.js", false), loadAsset("halloween-lab.js", false)
    ]).then(() => {
      hauntReady = true;
      const current = inSeason() && preference !== "off";
      window.WebHackHalloweenWorld?.setActive(current);
      window.WebHackHalloweenLab?.mount();
      window.WebHackHalloweenLab?.setActive(current);
      if (banner) banner.querySelector("[data-haunt-open]").disabled = false;
    }).catch(() => {
      window.WebHackHalloweenWorld?.setActive(false);
      window.WebHackHalloweenLab?.setActive(false);
      if (banner) banner.querySelector("[data-haunt-open]").hidden = true;
      // Searching, reading, saving and opting out have no asset dependency.
    });
  }
  function readPreference() {
    try { return localStorage.getItem(key); } catch { return undefined; }
  }
  function syncPreference() {
    const saved = readPreference();
    // A storage denial must not undo the choice still held by this page when
    // the browser restores it from its back/forward cache.
    if (saved !== undefined) preference = saved;
    refresh();
  }
  function seasonWindow(now) {
    if (config?.enabled !== true || config.schedule !== "annual") return null;
    let year = new Date(now).getUTCFullYear();
    // After the last Halloween ends, schedule next year's opening immediately.
    if (now >= Date.UTC(year, 10, 1, 12)) year += 1;
    return {
      startsAt: Date.UTC(year, 9, 29, 10), // October 30, 00:00 in UTC+14.
      endsAt: Date.UTC(year, 10, 1, 12) // November 1, 00:00 in UTC-12.
    };
  }
  function inSeason(now = Date.now()) {
    const season = seasonWindow(now);
    return Boolean(season && now >= season.startsAt && now < season.endsAt);
  }
  function apply() {
    const now = Date.now();
    const available = inSeason(now);
    const active = available && preference !== "off";
    if (active) root.dataset.halloween = "on";
    else root.removeAttribute("data-halloween");
    if (banner) {
      banner.hidden = !available;
      const button = banner.querySelector("button");
      button.setAttribute("aria-pressed", String(active));
      button.textContent = `Halloween ${active ? "on" : "off"}`;
    }
    updateHaunt(active);
    clearTimeout(timer);
    // Recheck boundaries without leaving an already-open page haunted forever.
    const season = seasonWindow(now);
    if (season) {
      const boundary = now < season.startsAt ? season.startsAt : season.endsAt;
      const remaining = boundary - now;
      if (remaining > 0) timer = setTimeout(refresh, Math.min(remaining + 10, 2147483647));
    }
  }
  function mount() {
    if (banner || !inSeason()) return;
    banner = document.createElement("section");
    banner.className = "halloween-banner";
    banner.setAttribute("aria-label", "Halloween appearance");
    // All markup is first-party artwork; no content from the archive enters it.
    banner.innerHTML = `
      <div class="halloween-copy"><p class="halloween-eyebrow">Halloween / fictional outbreak</p>
        <p class="halloween-title">The zero-days <em>escaped.</em></p>
        <p class="halloween-whisper">Patch window closed. The bugs are waking up.</p></div>
      <svg id="halloween-scene" viewBox="0 0 620 180" aria-hidden="true" focusable="false">
        <defs><radialGradient id="halloween-moon-light"><stop stop-color="#ffcd90"/><stop offset=".65" stop-color="#f47143"/><stop offset="1" stop-color="#a12838"/></radialGradient></defs>
        <g class="halloween-moon"><circle cx="408" cy="77" r="61" fill="url(#halloween-moon-light)"/><g fill="#7e2539" opacity=".3"><circle cx="386" cy="47" r="12"/><circle cx="432" cy="94" r="17"/><circle cx="382" cy="104" r="7"/></g></g>
        <g class="halloween-bats" fill="#140e20"><path d="M362 58q-16-27-34-12 10 0 11 17 12-7 23 5 11-12 23-5 1-17 11-17-18-15-34 12Z"/><path d="M461 40q-11-18-23-8 7 0 7 12 9-5 16 3 8-8 16-3 1-12 8-12-13-10-24 8Z"/><path d="M440 105q-10-17-22-8 7 0 7 11 8-4 15 3 7-7 15-3 1-11 8-11-12-9-23 8Z"/></g>
        <g class="halloween-branches" fill="none" stroke="#171020" stroke-width="5"><path d="M575 180 551 76 571 35M552 82 521 49 519 17M557 101 591 73 611 72M565 130 532 111 513 86M523 50 541 32M573 35 571 13M591 73 599 47M40 180 67 121 60 80M67 125 95 104 106 76M62 153 32 134 18 109"/></g>
        <path class="halloween-ground" d="M0 177q90-18 180-3t180-6 260 4v8H0Z" fill="#140e20"/>
        <g fill="#21162c" stroke="#5b3b53" stroke-width="1"><path d="m474 174-4-36a13 13 0 0 1 26-3l4 37Z"/><path d="m515 174 3-21a10 10 0 0 1 20 3l-2 17Z"/></g>
        <g stroke="#967a8b" stroke-width="2"><path d="m483 141 2 19m-8-10 14-1m39 8-1 12m-4-7 10 1"/></g>
        <g class="halloween-ghost"><path d="M295 143v-17a17 17 0 0 1 34 0v32l-8-6-9 6-9-6-8 6Z" fill="#e9dce8" opacity=".8"/><g fill="#28152e"><ellipse cx="306" cy="128" rx="3" ry="5"/><ellipse cx="319" cy="128" rx="3" ry="5"/><ellipse cx="313" cy="141" rx="3" ry="4"/></g></g>
        <g class="halloween-pumpkin"><path d="m375 143 3-13 7-3" fill="none" stroke="#9aab69" stroke-width="5"/><ellipse cx="380" cy="158" rx="28" ry="21" fill="#cc4f26"/><ellipse cx="380" cy="158" rx="15" ry="21" fill="#ed7737"/><path d="m361 155 12-9 1 12Zm24 3 3-12 11 9Zm-22 7 11 3 6-3 7 3 11-3-9 10h-17Z" fill="#ffe4a0"/></g>
        <g class="halloween-web" fill="none" stroke="#baa5bd" opacity=".42"><path d="M620 0H490m130 0-120 55M620 0l-78 100M620 0l-30 126M620 0v135M590 0q-1 15 3 13 2 13 10 9 5 11 11 7M561 0q-1 25 5 25 1 21 20 19 6 19 21 14M528 0q1 42 12 37 2 35 28 31 11 27 30 22M494 0q5 55 21 48 0 52 36 46 15 38 37 32"/></g>
        <g class="halloween-spider" stroke="#c6a4b6" stroke-width="1.5" fill="none"><path d="M507 0v77m0 9-12-7-4-10m16 17-13 1-8-7m21 6-12 9-2 9m14-18 12-7 4-10m-16 17 13 1 8-7m-21 6 12 9 2 9"/><ellipse cx="507" cy="86" rx="5" ry="8" fill="#311a2c"/><path d="M505 83h1m2 0h1" stroke="#ffb777"/></g>
      </svg>
      <div class="halloween-switch"><span class="halloween-switch-note" id="halloween-note">Ghosts roam. Dead code rises.</span>
        <button id="halloween-toggle" type="button" aria-pressed="true" aria-describedby="halloween-note">Halloween on</button>
        <button class="haunt-launch" data-haunt-open type="button" aria-haspopup="dialog" aria-controls="halloween-lab" disabled>Enter quarantine <span aria-hidden="true">↗</span></button>
        <span class="halloween-storage-note" role="status"></span></div>`;
    const main = document.querySelector("#main-content, main");
    if (document.querySelector("#document-scroll")) {
      // A separate grid row keeps the choice reachable even when the PDF's
      // error surface is visible. Never put decoration into the PDF itself.
      root.dataset.halloweenReader = "standalone";
      document.body.prepend(banner);
    } else if (main) {
      const placeBanner = () => {
        // Immersive views already budget the viewport for their canvas and
        // Exit control. Keep their original working space and put the seasonal
        // choice immediately after it, still inside the scrollable main area.
        if (main.id === "main-content" && (root.dataset.view === "constellation" || main.matches(":fullscreen, .view-fullscreen-fallback"))) {
          if (main.lastElementChild !== banner) main.append(banner);
        } else {
          const filters = main.id === "main-content" && main.querySelector("#desk-filter-form, .time-machine > .discovery-toolbar");
          // Keep discovery's primary filters in their original opening position.
          if (filters) {
            if (filters.nextElementSibling !== banner) filters.after(banner);
          } else if (main.firstElementChild !== banner) main.prepend(banner);
        }
      };
      placeBanner();
      if (main.id === "main-content") {
        new MutationObserver(placeBanner).observe(root, { attributes: true, attributeFilter: ["data-view"] });
        new MutationObserver(placeBanner).observe(main, { attributes: true, attributeFilter: ["class"] });
        document.addEventListener("fullscreenchange", placeBanner);
        document.addEventListener("webhacklist:view-rendered", placeBanner);
      }
    } else document.body.prepend(banner);
    banner.querySelector("button").addEventListener("click", () => {
      preference = root.dataset.halloween === "on" ? "off" : "on";
      let saved = true;
      try { localStorage.setItem(key, preference); } catch { saved = false; }
      apply();
      banner.querySelector(".halloween-storage-note").textContent = saved ? "" : "Changed for this page. This browser could not save your choice.";
    });
    banner.querySelector("[data-haunt-open]").addEventListener("click", event => {
      if (root.dataset.halloween === "on") window.WebHackHalloweenLab?.open(event.currentTarget);
    });
  }
  function refresh() {
    if (document.readyState !== "loading") mount();
    apply();
  }
  preference = readPreference();
  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh, { once: true });
  else refresh();
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) syncPreference();
  });
  window.addEventListener("pageshow", syncPreference);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
})();
