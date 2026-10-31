/* A fictional, optional Halloween exhibit. It never reads or changes archive data. */
(() => {
  "use strict";
  if (window.WebHackHalloweenLab) return;

  let dialog;
  let active = false;
  let preferredHost;
  let returnFocus;
  let lockedScroll;
  let backdropPointer = false;
  let released = false;
  const isolated = new Set();
  const scenes = ["outbreak", "graveyard", "zombies"];
  const epitaphs = {
    endpoint: {
      title: "The forgotten endpoint",
      inscription: "“Nobody uses that route anymore.”",
      story: "It disappeared from the documentation. It never disappeared from the internet.",
      tag: "Here lies an assumption."
    },
    header: {
      title: "The trusted header",
      inscription: "“Severity: low. Blast radius: everything.”",
      story: "One layer trusted what the next layer had never checked. The boundary was only a line on a diagram.",
      tag: "Here lies implicit trust."
    },
    race: {
      title: "The race nobody ran",
      inscription: "“Could not reproduce. Closed.”",
      story: "The test knocked once. The bug waited for two requests to arrive together.",
      tag: "Here lies the happy path."
    },
    exception: {
      title: "The forever exception",
      inscription: "“Will fix next sprint. Last seen: 2011.”",
      story: "The temporary workaround outlived its owner, its ticket, and the machine it was meant to protect.",
      tag: "Here lies ‘temporary’."
    }
  };

  const skull = `<path d="M22 44C8 44 5 33 6 22 7 8 16 3 29 3s22 5 23 19c1 11-2 22-16 22v10H22Z" fill="currentColor"/><path d="m12 24 13 2-3 11H13Zm32 0-13 2 3 11h9ZM25 41l4-8 4 8Zm0 5v8m8-8v8" fill="#0c1416" stroke="#0c1416" stroke-width="2"/>`;
  const graveArt = (kind) => kind === "race"
    ? `<path d="m10 33 14-15-4 13h16L23 47l4-14Z" fill="currentColor"/><path d="M5 12h11m18 37h11M6 45h8m24-32h8" stroke="currentColor" stroke-width="2"/>`
    : kind === "header"
      ? `<path d="M28 5 7 14v17c0 13 21 22 21 22s21-9 21-22V14Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 24 8 8 8-8m-8 8v10" fill="none" stroke="currentColor" stroke-width="3"/>`
      : kind === "exception"
        ? `<path d="M28 4C13 4 5 16 5 28s8 24 23 24 23-12 23-24S43 4 28 4Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M28 14v15l10 5M14 8 5 6m37 2 9-2" fill="none" stroke="currentColor" stroke-width="3"/>`
        : skull;

  function rackArt(index) {
    return `<svg class="haunt-lab-rack" viewBox="0 0 280 300" aria-hidden="true" focusable="false">
      <g class="haunt-lab-rack-arms" fill="none" stroke="#6d8c68" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <path d="M66 132 33 151 27 124 9 114m18 10 6-18m-6 18-15 1M212 135l27 18 14-30 16-4m-16 4 1-16m-1 16 14 10"/>
      </g>
      <g class="haunt-lab-rack-machine">
        <path d="m82 251-8 32-22 6m133-38 9 32 23 5" fill="none" stroke="#758a63" stroke-width="11" stroke-linecap="round"/>
        <rect x="65" y="24" width="150" height="236" rx="7" fill="#132027" stroke="#728481" stroke-width="2"/>
        <path d="M72 28h136v14H72Z" fill="#2c3b3e"/><path d="M75 29v224m130-224v224" stroke="#56706a" stroke-width="2"/>
        <rect x="83" y="48" width="114" height="79" rx="5" fill="#060d11" stroke="#3b5951"/>
        <g class="haunt-lab-rack-face" fill="#afff91">
          <path d="m99 70 31 9-5 17-27-4Zm82 0-31 9 5 17 27-4Z"/>
          <path d="M114 106h52v8h-9v-5h-9v7h-9v-7h-9v5h-9v-5h-7Z"/>
        </g>
        <path d="M88 134h105v28H88Zm0 35h105v28H88Zm0 35h105v28H88Z" fill="#0b1519" stroke="#345147"/>
        <g stroke="#39574b" stroke-width="2"><path d="M111 143h57m-57 7h57m-57 28h57m-57 7h57m-57 28h57m-57 7h57"/></g>
        <g class="haunt-lab-rack-lights" fill="#b9ff8a"><circle cx="98" cy="147" r="3"/><circle cx="98" cy="182" r="3"/><circle cx="98" cy="217" r="3"/></g>
        <g fill="#e1a565"><circle cx="182" cy="147" r="2"/><circle cx="182" cy="182" r="2"/></g>
        <path d="M185 27v27l-11 9m-89 72 14 9-7 16m114 31-15 15 9 21M106 245h69" fill="none" stroke="#7e5b51" stroke-width="2"/>
        <path class="haunt-lab-rack-vines" d="M74 260q-22-36 3-69t-4-67m130 136q23-42 2-63t7-50M77 203l13-9m-13-5-12-8m139 42-17-8m17-17 15-9" fill="none" stroke="#6a8555" stroke-width="3"/>
        <text x="140" y="247" fill="#a7b8aa" font-family="monospace" font-size="8" text-anchor="middle">NO VENDOR / NO PATCH / 0${index}</text>
      </g>
      <g class="haunt-lab-rack-cage" fill="none" stroke="#a4f7cc" stroke-width="2"><path d="M47 20h188v245H47Zm0 38h188M47 228h188M79 20v245m124-245v245m-62-245v245"/><rect x="119" y="135" width="44" height="33" rx="4" fill="#09281f"/><path d="M128 135v-9a13 13 0 0 1 26 0v9"/><circle cx="141" cy="149" r="3" fill="#a4f7cc"/></g>
      <ellipse cx="140" cy="290" rx="98" ry="7" fill="#000" opacity=".5"/>
    </svg>`;
  }

  function markup() {
    const graves = [
      ["endpoint", "Forgotten", "endpoint", "UNDOCUMENTED"],
      ["header", "Trusted", "header", "UNQUESTIONED"],
      ["race", "Unreproducible", "race", "UNTESTED"],
      ["exception", "Temporary", "exception", "UNOWNED"]
    ];
    const zombies = [
      ["1", "LEGACY-01", "The vendor vanished", "Its support contract expired. Its network connection did not."],
      ["2", "APPLIANCE-02", "The firmware forgot", "Sealed hardware. An eternal uptime. A very mortal perimeter."],
      ["3", "BUILD-03", "The image returned", "Rebuilt from the same old image. Every resurrection brings the bug back."]
    ];
    return `
      <header class="haunt-lab-header">
        <div class="haunt-lab-brand"><span class="haunt-lab-sigil" aria-hidden="true">⌁</span><div><p class="haunt-lab-kicker">WEBHACKLIST / AFTER HOURS</p><h2 id="haunt-lab-title">The unpatched hour</h2></div></div>
        <button class="haunt-lab-exit" type="button" data-haunt-close autofocus><span>Exit quarantine</span><b aria-hidden="true">×</b></button>
      </header>
      <div class="haunt-lab-disclaimer" id="haunt-lab-fiction"><span aria-hidden="true">●</span> Fictional Halloween simulation <span class="haunt-lab-disclaimer-note">The real archive is safe to explore.</span></div>
      <nav class="haunt-lab-tabs" role="tablist" aria-label="Halloween rooms">
        <button type="button" role="tab" id="haunt-lab-tab-outbreak" data-haunt-scene="outbreak" aria-controls="haunt-lab-panel-outbreak" aria-selected="true" tabindex="0"><span>01</span><b>Zero-day outbreak</b><i aria-hidden="true">↗</i></button>
        <button type="button" role="tab" id="haunt-lab-tab-graveyard" data-haunt-scene="graveyard" aria-controls="haunt-lab-panel-graveyard" aria-selected="false" tabindex="-1"><span>02</span><b>The bug graveyard</b><i aria-hidden="true">↗</i></button>
        <button type="button" role="tab" id="haunt-lab-tab-zombies" data-haunt-scene="zombies" aria-controls="haunt-lab-panel-zombies" aria-selected="false" tabindex="-1"><span>03</span><b>Zombie machines</b><i aria-hidden="true">↗</i></button>
      </nav>
      <div class="haunt-lab-content">
        <section class="haunt-lab-panel" id="haunt-lab-panel-outbreak" data-haunt-panel="outbreak" role="tabpanel" aria-labelledby="haunt-lab-tab-outbreak" tabindex="0">
          <div class="haunt-lab-outbreak">
            <svg class="haunt-lab-outbreak-art" viewBox="0 0 760 480" aria-hidden="true" focusable="false">
              <defs><radialGradient id="haunt-lab-moon"><stop stop-color="#ffddb1"/><stop offset=".55" stop-color="#ff8556"/><stop offset="1" stop-color="#a83950"/></radialGradient><radialGradient id="haunt-lab-spirit"><stop stop-color="#f2ffed"/><stop offset=".55" stop-color="#8bdfd0"/><stop offset="1" stop-color="#7187ad"/></radialGradient><linearGradient id="haunt-lab-portal" x2="0" y2="1"><stop stop-color="#a7a1ff"/><stop offset="1" stop-color="#407573" stop-opacity="0"/></linearGradient></defs>
              <circle cx="490" cy="170" r="145" fill="#a84651" opacity=".08"/><circle cx="490" cy="170" r="122" fill="url(#haunt-lab-moon)" opacity=".8"/>
              <g fill="#712b4b" opacity=".35"><circle cx="450" cy="100" r="21"/><circle cx="550" cy="171" r="32"/><circle cx="469" cy="219" r="14"/></g>
              <g class="haunt-lab-orbit" fill="none" stroke="#efbca1"><circle cx="490" cy="170" r="150" stroke-dasharray="2 14" opacity=".4"/><path d="M334 170h-16m172-156V0m156 170h16M490 326v16" opacity=".65"/></g>
              <g fill="#080d16"><path d="m674 413-34-152-17-33 7-59-9-51 20 34 8 87 26-44 5-38 11-12-1 59-22 52 15 49 17-19 9-56 17-24-7 74-27 55 25 68Z"/><path d="m708 238 28-41 24-14-17 26-31 55ZM646 260l-37-19-21-40 25 24 33 8ZM624 175l-28-25-7-40 16 34 24 13Z"/></g>
              <g class="haunt-lab-bats" fill="#1c1326"><path d="M392 74q-21-31-39-11 14-3 15 19 11-9 24 5 12-14 24-5 1-22 15-19-18-20-39 11Z"/><path d="M577 68q-14-22-28-8 10-2 11 14 8-6 17 3 9-9 17-3 1-16 11-14-14-14-28 8Z"/></g>
              <path d="M222 434q190-54 538-19v65H222Z" fill="#0a1118"/><path d="M292 435q206-34 468-3" fill="none" stroke="#50736d" opacity=".3"/>
              <g class="haunt-lab-door" fill="none" stroke="url(#haunt-lab-portal)"><path d="M359 417V239a97 97 0 0 1 194 0v178" stroke-width="16" opacity=".15"/><path d="M365 417V239a91 91 0 0 1 182 0v178" stroke-width="3"/><path d="M378 417V241a78 78 0 0 1 156 0v176" stroke-width="1" stroke-dasharray="4 9"/></g>
              <g class="haunt-lab-wraith">
                <path d="M406 358q-26-31-22-65 4-25 24-36v-24c0-41 27-65 58-65s60 25 60 66v25q22 17 22 43-2 28-24 40l7 51-30-16-25 22-26-21-23 16 4-40Z" fill="url(#haunt-lab-spirit)" opacity=".88"/>
                <path d="M407 253q-24 11-38 2l-24-22q-2 28 20 49l31 12m126-43q23 6 35-3l21-22q2 33-21 50l-22 12" fill="#8ebfcb" opacity=".8"/>
                <path d="m422 228 31 10-10 21-19-5Zm80 0-31 10 10 21 19-5Z" fill="#13253a"/><path d="m460 259-9 15h20Zm-20 28q27 17 51-2l-8 28-13-9-9 12-12-10Z" fill="#13253a"/>
                <path d="M433 199q32-23 62 3m-81 122 10 26m83-19 2 29" fill="none" stroke="#fff" opacity=".25" stroke-width="3"/>
                <g class="haunt-lab-spirit-code" fill="#173d47" font-family="monospace" font-size="10"><text x="435" y="332">NO PATCH</text><text x="444" y="347">0xDEAD</text></g>
              </g>
              <g class="haunt-lab-chains" fill="none" stroke="#a0a7a7" stroke-width="3" opacity=".7"><path d="m397 282-43 52-43 26m217-79 49 48 30 37" stroke-dasharray="7 5"/><path d="m398 282-44 53-43 26m217-79 49 48 30 37" stroke="#233940" stroke-width="1"/></g>
              <g class="haunt-lab-console-art"><path d="m309 377 296-2 22 55H289Z" fill="#1d2f33" stroke="#668783"/><path d="m318 386 277-1 10 26H305Z" fill="#070f15" stroke="#385455"/><path d="m326 394 38 0m12 0h36m12 0h36m12 0h36m12 0h36m12 0h26m-246 8h85m13 0h65m13 0h65" stroke="#78af91" stroke-width="2" opacity=".65"/><path d="M299 430h317l-13 36H313Z" fill="#101c25" stroke="#385455"/><path d="M373 439h168" stroke="#80c09a" stroke-width="3"/></g>
              <g class="haunt-lab-spider-art" fill="none" stroke="#a5a3bd" stroke-width="2"><path d="M716 0v115m0 12-23-15-9-18m32 33-27 0-12-11m39 11-24 15-6 16m30-31 23-15 9-18m-32 33h27l12-11m-39 11 24 15 6 16"/><ellipse cx="716" cy="126" rx="9" ry="13" fill="#252138"/><path d="M711 121h2m6 0h2" stroke="#ffba7d" stroke-width="3"/></g>
            </svg>
            <div class="haunt-lab-outbreak-copy"><p class="haunt-lab-eyebrow"><span aria-hidden="true">◷</span> 31 OCT / 00:00:00</p><h3>They waited until<br>everyone <em>logged off.</em></h3><p>The holiday freeze has begun. The patch queue is empty. The things behind the firewall are waking up.</p><div class="haunt-lab-release-shell"><button class="haunt-lab-primary" type="button" data-haunt-release aria-pressed="false"><span aria-hidden="true">⏣</span> Release the zero-days <b aria-hidden="true">↗</b></button><span class="haunt-lab-release-hint">A fictional breach. A very restless night.</span></div></div>
            <div class="haunt-lab-threat-stamp" aria-hidden="true"><span>PATCH STATUS</span><strong>NONE</strong><span>HOLIDAY RELEASE</span></div>
          </div>
          <div class="haunt-lab-terminal"><div class="haunt-lab-terminal-title"><span><i aria-hidden="true"></i> midnight / breach-console</span><span class="haunt-lab-console-state" data-haunt-breach-state>PERIMETER SEALED</span></div><div class="haunt-lab-log" aria-hidden="true"><p><b>00:00:00</b> <span>holiday_freeze</span> → enabled</p><p><b>00:00:01</b> <span>patch_queue</span> → no supported fix</p><p data-haunt-log><b>00:00:02</b> <span>perimeter</span> → awaiting operator</p></div><p class="haunt-lab-status" data-haunt-breach-status role="status">The breach is sealed. You decide what gets out.</p></div>
          <button class="haunt-lab-next" type="button" data-haunt-go="graveyard">Follow the dead code <span aria-hidden="true">→</span></button>
        </section>
        <section class="haunt-lab-panel" id="haunt-lab-panel-graveyard" data-haunt-panel="graveyard" role="tabpanel" aria-labelledby="haunt-lab-tab-graveyard" tabindex="0" hidden>
          <div class="haunt-lab-room-title"><p class="haunt-lab-eyebrow">CEMETERY / UNRESOLVED FOREVER</p><h3>The bugs they <em>buried.</em></h3><p>Closed tickets. Forgotten endpoints. Nothing stays dead just because somebody stopped looking. Touch a headstone.</p></div>
          <div class="haunt-lab-cemetery">
            <svg class="haunt-lab-cemetery-sky" viewBox="0 0 1100 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><circle cx="817" cy="116" r="82" fill="#bd98e6" opacity=".08"/><circle cx="817" cy="116" r="62" fill="#9e8eb2" opacity=".28"/><circle cx="837" cy="102" r="60" fill="#131320"/><g class="haunt-lab-cemetery-bats" fill="#8b81a9"><path d="M715 89q-17-23-32-7 12-3 12 14 10-6 20 4 10-10 20-4 0-17 12-14-15-16-32 7Z"/><path d="M878 155q-11-16-22-5 8-2 9 9 6-4 13 3 7-7 13-3 1-11 9-9-11-11-22 5Z"/></g><g fill="none" stroke="#293439" stroke-width="9" stroke-linecap="round"><path d="M90 400 105 253 68 176 74 98m27 156 69-80 6-68m-75 150-69-8-29-31m69-42-41-40-3-40m135 88 62-10 26-30M1039 400l-10-155 45-62 8-79m-53 143-58-79-5-64m59 101-75 4-34-20m162-30 35-14m-148 24-34-30"/></g><g fill="none" stroke="#38413e" stroke-width="2"><path d="M0 327h1100M0 345h1100M17 324v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76m32-76v76"/></g><path d="M0 380q190-34 390-8t400-2 310 0v30H0Z" fill="#15211e"/><g class="haunt-lab-cemetery-eyes" fill="#c5faab"><ellipse cx="97" cy="314" rx="3" ry="2"/><ellipse cx="111" cy="314" rx="3" ry="2"/><ellipse cx="1001" cy="291" rx="3" ry="2"/><ellipse cx="1015" cy="291" rx="3" ry="2"/></g></svg>
            <div class="haunt-lab-cemetery-fog" aria-hidden="true"></div>
            <div class="haunt-lab-graves">${graves.map(([key, first, last, tag], i) => `<button class="haunt-lab-grave haunt-lab-grave-${i + 1}" type="button" data-haunt-epitaph="${key}" aria-pressed="false" aria-controls="haunt-lab-epitaph"><span class="haunt-lab-grave-soul" aria-hidden="true"><i></i><i></i></span><span class="haunt-lab-grave-inner"><svg viewBox="0 0 58 58" aria-hidden="true" focusable="false">${graveArt(key)}</svg><span class="haunt-lab-grave-name">${first}<br><b>${last}</b></span><small>${tag}</small><span class="haunt-lab-grave-mark" aria-hidden="true">✝</span><span class="haunt-lab-grave-invite">Read epitaph <span aria-hidden="true">↗</span></span></span></button>`).join("")}</div>
            <svg class="haunt-lab-roots" viewBox="0 0 1100 75" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 0h1100v75H0Z" fill="#091311"/><g fill="none" stroke="#344334" stroke-width="2"><path d="M140 0v19l-31 22-27 5m58-28 22 12 8 26m-61-15 2 25m59-10 27 12M387 0l-7 27-27 22-19 4m46-26 31 24 7 24m-7-24 27 1M662 0l10 18-20 31-28 12m48-43 23 10 8 38m-51-17 8 23M913 0l-8 27-29 17-13 25m42-42 27 20 37 4m-37-4 3 24"/></g></svg>
          </div>
          <div class="haunt-lab-epitaph" id="haunt-lab-epitaph" aria-live="polite" aria-atomic="true"><span class="haunt-lab-epitaph-index" aria-hidden="true">R.I.P.</span><div><p class="haunt-lab-eyebrow">EVERY CLOSED TICKET HAS A STORY</p><h4>Choose a headstone.</h4><p>The bugs remember what the backlog forgot.</p></div></div>
          <button class="haunt-lab-next" type="button" data-haunt-go="zombies">Something is still answering <span aria-hidden="true">→</span></button>
        </section>
        <section class="haunt-lab-panel" id="haunt-lab-panel-zombies" data-haunt-panel="zombies" role="tabpanel" aria-labelledby="haunt-lab-tab-zombies" tabindex="0" hidden>
          <div class="haunt-lab-room-title"><p class="haunt-lab-eyebrow">SUB-BASEMENT / END OF LIFE</p><h3>You cannot patch <em>the dead.</em></h3><p>Three abandoned machines still answer the network. Try a patch. Watch them come back. Then cut their connections.</p></div>
          <div class="haunt-lab-containment"><div><span class="haunt-lab-eyebrow">CONTAINMENT</span><strong data-haunt-contained>0 / 3 isolated</strong></div><progress max="3" value="0" aria-label="Zombie machines isolated"></progress><button type="button" class="haunt-lab-reset" data-haunt-reset>Reset simulation <span aria-hidden="true">↺</span></button></div>
          <div class="haunt-lab-zombies">${zombies.map(([id, name, title, story]) => `<article class="haunt-lab-zombie" data-haunt-zombie="${id}" data-haunt-zombie-state="restless"><div class="haunt-lab-zombie-identity"><span>${name}</span><span class="haunt-lab-zombie-signal"><i aria-hidden="true"></i> <span data-haunt-signal="${id}">ONLINE</span></span></div><div class="haunt-lab-rack-stage">${rackArt(id)}<span class="haunt-lab-rack-warning" aria-hidden="true">END OF LIFE ≠ END OF THREAT</span></div><div class="haunt-lab-zombie-copy"><h4>${title}</h4><p>${story}</p><p class="haunt-lab-zombie-status" data-haunt-zombie-status="${id}" role="status">Still answering. No supported patch.</p><div class="haunt-lab-zombie-actions"><button type="button" data-haunt-patch="${id}" aria-label="Try a patch on ${name}"><span aria-hidden="true">↻</span> Try a patch</button><button type="button" data-haunt-isolate="${id}" aria-label="Isolate ${name}"><span aria-hidden="true">⊘</span> Isolate</button></div></div></article>`).join("")}</div>
          <p class="haunt-lab-final-status" data-haunt-final-status role="status">Patches cannot resurrect support. Containment can stop the haunting.</p>
        </section>
      </div>
      <footer class="haunt-lab-footer"><span><i aria-hidden="true"></i> FICTIONAL MACHINES. REAL NIGHTMARES.</span><button type="button" data-haunt-close>Return to the archive <span aria-hidden="true">↗</span></button></footer>`;
  }

  function emit(phase, extra = {}) {
    document.dispatchEvent(new CustomEvent("webhacklist:haunt-breach", {
      detail: { source: "halloween-lab", phase, intensity: phase === "released" ? 1 : 0, ...extra }
    }));
  }

  function pause() {
    dialog?.classList.toggle("haunt-lab-paused", document.hidden || !dialog.open);
  }

  function lockScroll() {
    if (lockedScroll) return;
    lockedScroll = { x: window.scrollX || 0, y: Math.max(0, window.scrollY || window.pageYOffset || 0) };
    document.documentElement.style.setProperty("--haunt-lab-scroll-y", `-${lockedScroll.y}px`);
    document.documentElement.classList.add("haunt-lab-open");
  }

  function unlockScroll() {
    if (!lockedScroll) return;
    const saved = lockedScroll;
    lockedScroll = undefined;
    const root = document.documentElement;
    root.classList.remove("haunt-lab-open");
    root.style.removeProperty("--haunt-lab-scroll-y");
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(saved.x, saved.y);
    root.style.scrollBehavior = previousBehavior;
  }

  function selectScene(name, focusTab = false) {
    if (!dialog || !scenes.includes(name)) return;
    dialog.querySelectorAll("[data-haunt-scene]").forEach(button => {
      const selected = button.dataset.hauntScene === name;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) button.focus({ preventScroll: true });
    });
    dialog.querySelectorAll("[data-haunt-panel]").forEach(panel => {
      panel.hidden = panel.dataset.hauntPanel !== name;
    });
    dialog.querySelector(".haunt-lab-content").scrollTop = 0;
  }

  function release() {
    released = !released;
    dialog.classList.toggle("haunt-lab-breached", released);
    const button = dialog.querySelector("[data-haunt-release]");
    button.setAttribute("aria-pressed", String(released));
    button.innerHTML = released
      ? `<span aria-hidden="true">⊘</span> Seal the breach <b aria-hidden="true">↙</b>`
      : `<span aria-hidden="true">⏣</span> Release the zero-days <b aria-hidden="true">↗</b>`;
    dialog.querySelector("[data-haunt-breach-state]").textContent = released ? "BREACH / UNPATCHED" : "PERIMETER SEALED";
    dialog.querySelector("[data-haunt-log]").innerHTML = released
      ? `<b>00:00:02</b> <span>unpatched_entities</span> → RELEASED / do not follow the whispers`
      : `<b>00:00:03</b> <span>perimeter</span> → sealed / the whispers remain`;
    dialog.querySelector("[data-haunt-breach-status]").textContent = released
      ? "The fictional zero-days are loose. The ghosts have crossed the perimeter. Seal the breach when you are ready."
      : "The breach is sealed. Something is still knocking from the other side.";
    emit(released ? "released" : "contained", { reason: "perimeter" });
  }

  function revealEpitaph(key) {
    const epitaph = epitaphs[key];
    if (!epitaph) return;
    dialog.querySelectorAll("[data-haunt-epitaph]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.hauntEpitaph === key));
    });
    const output = dialog.querySelector("#haunt-lab-epitaph");
    // These strings are authored above; the archive never enters this surface.
    output.innerHTML = `<span class="haunt-lab-epitaph-index" aria-hidden="true">R.I.P.</span><div><p class="haunt-lab-eyebrow">${epitaph.tag}</p><h4>${epitaph.title}</h4><blockquote>${epitaph.inscription}</blockquote><p>${epitaph.story}</p></div>`;
    // Keep the revealed story in the room's bounded viewport. scrollIntoView
    // could also move the archive behind the modal, losing the reader's place.
    const viewport = dialog.querySelector(".haunt-lab-content");
    const visible = viewport.getBoundingClientRect();
    const inscription = output.getBoundingClientRect();
    const gap = 10;
    let top = viewport.scrollTop;
    if (inscription.height > viewport.clientHeight - gap * 2 || inscription.top < visible.top + gap) {
      top += inscription.top - visible.top - gap;
    } else if (inscription.bottom > visible.bottom - gap) {
      top += inscription.bottom - visible.bottom + gap;
    }
    viewport.scrollTo({ top: Math.max(0, Math.min(top, viewport.scrollHeight - viewport.clientHeight)), behavior: "instant" });
  }

  function patchZombie(id) {
    if (isolated.has(id)) return;
    const zombie = dialog.querySelector(`[data-haunt-zombie="${id}"]`);
    if (!zombie) return;
    zombie.dataset.hauntZombieState = "resurrected";
    zombie.querySelector("[data-haunt-zombie-status]").textContent = "PATCH REJECTED. Unsupported. It came back hungrier. Isolate this machine.";
    zombie.querySelector("[data-haunt-signal]").textContent = "REANIMATED";
  }

  function updateContainment() {
    const complete = isolated.size === 3;
    dialog.querySelector("[data-haunt-contained]").textContent = `${isolated.size} / 3 isolated`;
    dialog.querySelector("progress").value = isolated.size;
    dialog.querySelector(".haunt-lab-containment").classList.toggle("haunt-lab-complete", complete);
    dialog.querySelector("[data-haunt-final-status]").textContent = complete
      ? "ALL THREE ISOLATED. The machines are still unpatchable. Their reach is gone. You made it through the unpatched hour."
      : "Patches cannot resurrect support. Containment can stop the haunting.";
  }

  function isolateZombie(id) {
    const zombie = dialog.querySelector(`[data-haunt-zombie="${id}"]`);
    if (!zombie || isolated.has(id)) return;
    isolated.add(id);
    zombie.dataset.hauntZombieState = "contained";
    zombie.querySelector("[data-haunt-zombie-status]").textContent = "ISOLATED. Still unpatchable. No longer reaching the network.";
    zombie.querySelector("[data-haunt-signal]").textContent = "ISOLATED";
    zombie.querySelector("[data-haunt-patch]").disabled = true;
    const button = zombie.querySelector("[data-haunt-isolate]");
    button.disabled = true;
    button.innerHTML = `<span aria-hidden="true">✓</span> Isolated`;
    updateContainment();
    if (isolated.size === 3) emit("contained", { reason: "zombies", isolated: 3 });
  }

  function resetZombies() {
    isolated.clear();
    dialog.querySelectorAll("[data-haunt-zombie]").forEach(zombie => {
      zombie.dataset.hauntZombieState = "restless";
      zombie.querySelector("[data-haunt-zombie-status]").textContent = "Still answering. No supported patch.";
      zombie.querySelector("[data-haunt-signal]").textContent = "ONLINE";
      zombie.querySelector("[data-haunt-patch]").disabled = false;
      const button = zombie.querySelector("[data-haunt-isolate]");
      button.disabled = false;
      button.innerHTML = `<span aria-hidden="true">⊘</span> Isolate`;
    });
    updateContainment();
  }

  function outside(event) {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  function mount(options = {}) {
    if (options?.host instanceof Element) preferredHost = options.host;
    if (!dialog && document.body) {
      dialog = document.createElement("dialog");
      dialog.id = "halloween-lab";
      dialog.className = "haunt-lab-paused";
      dialog.setAttribute("aria-labelledby", "haunt-lab-title");
      dialog.setAttribute("aria-describedby", "haunt-lab-fiction");
      dialog.hidden = !active;
      dialog.innerHTML = markup();
      (preferredHost?.isConnected ? preferredHost : document.body).append(dialog);
      dialog.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (button?.hasAttribute("data-haunt-close")) close();
        else if (button?.dataset.hauntScene) selectScene(button.dataset.hauntScene);
        else if (button?.dataset.hauntGo) selectScene(button.dataset.hauntGo, true);
        else if (button?.hasAttribute("data-haunt-release")) release();
        else if (button?.dataset.hauntEpitaph) revealEpitaph(button.dataset.hauntEpitaph);
        else if (button?.dataset.hauntPatch) patchZombie(button.dataset.hauntPatch);
        else if (button?.dataset.hauntIsolate) isolateZombie(button.dataset.hauntIsolate);
        else if (button?.hasAttribute("data-haunt-reset")) resetZombies();
        else if (event.target === dialog && backdropPointer && outside(event)) close();
        backdropPointer = false;
      });
      dialog.addEventListener("pointerdown", event => {
        backdropPointer = event.target === dialog && outside(event);
      });
      dialog.addEventListener("keydown", event => {
        // The optional room owns its keystrokes; archive search/fullscreen
        // shortcuts must not react behind it. Browser defaults still apply.
        event.stopPropagation();
        if (event.key === "Tab") {
          // Native modal focus stays in the document, but some browsers hand
          // sequential focus to their chrome after the last control. Wrap the
          // two boundaries explicitly so the exit controls stay reachable.
          const controls = [...dialog.querySelectorAll(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]'
          )].filter(element => element.tabIndex >= 0
            && !element.closest("[hidden], [inert]")
            && element.getClientRects().length
            && getComputedStyle(element).visibility !== "hidden");
          const first = controls[0];
          const last = controls.at(-1);
          const focused = document.activeElement;
          if (first && (event.shiftKey ? focused === first || !dialog.contains(focused) : focused === last || !dialog.contains(focused))) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus({ preventScroll: true });
          }
          return;
        }
        const tab = event.target.closest("[data-haunt-scene]");
        if (!tab || event.altKey || event.ctrlKey || event.metaKey) return;
        const current = scenes.indexOf(tab.dataset.hauntScene);
        let next;
        if (event.key === "ArrowRight") next = (current + 1) % scenes.length;
        else if (event.key === "ArrowLeft") next = (current + scenes.length - 1) % scenes.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = scenes.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectScene(scenes[next], true);
      });
      dialog.addEventListener("close", () => {
        // A queued close event can arrive after an immediate programmatic
        // reopen. It must not unlock or return focus out of that new modal.
        if (dialog.open) return;
        unlockScroll();
        pause();
        const target = returnFocus;
        returnFocus = undefined;
        if (target?.isConnected && !target.closest("[inert]") && target.getClientRects().length) target.focus({ preventScroll: true });
      });
      document.addEventListener("visibilitychange", pause);
    }
    if (typeof options?.active === "boolean") setActive(options.active);
    return api;
  }

  function open(trigger) {
    if (!active) return false;
    mount();
    if (!dialog || document.querySelector('dialog[open]:not(#halloween-lab)')) return false;
    if (dialog.open) return true;
    // Native fullscreen elements own their own top-layer subtree. Keep the
    // optional room in that subtree without changing the archive's fullscreen.
    const host = preferredHost?.isConnected ? preferredHost
      : document.fullscreenElement || document.querySelector("main.view-fullscreen-fallback") || document.body;
    if (dialog.parentElement !== host) host.append(dialog);
    returnFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    dialog.hidden = false;
    lockScroll();
    try { dialog.showModal(); } catch { unlockScroll(); returnFocus = undefined; return false; }
    pause();
    return true;
  }

  function close() {
    if (!dialog?.open) return false;
    dialog.close();
    unlockScroll();
    pause();
    return true;
  }

  function setActive(value) {
    active = value === true;
    if (!active) close();
    if (dialog) dialog.hidden = !active;
    return active;
  }

  const api = Object.freeze({ mount, open, close, setActive });
  window.WebHackHalloweenLab = api;
})();
