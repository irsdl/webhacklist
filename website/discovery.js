/* Two accessible entrances to the same archive. Loaded before app.js. */
const DISCOVERY_VIEWS = {
  desk: { kicker: "Workspace 08 / find and read", title: "Research Desk", description: "Search the archive, save papers and track your reading." },
  time: { kicker: "Journey 04 / the archive through time", title: "Time Machine", description: "Explore annual collections and follow a subject through the years." },
};
const DESK_STANDING_OPTIONS = Object.freeze([["all", "All research"], ["winner", "Official Top 10"], ["nominee", "Official nominations"], ["addition", "Additional research"], ["held", "Held out of vote"], ["preliminary", "Provisional · unranked"]]);
const DESK_LISTING_OPTIONS = Object.freeze([["all", "All list memberships"], ["original", "Original list (incl. Top 10)"], ["addition", "Later additions"]]);
function isDiscoveryView(view = state.view) { return Object.hasOwn(DISCOVERY_VIEWS, view); }
function storedDiscoveryTheme() {
  try { return localStorage.getItem("websec-discovery-theme-v1") === "light" ? "light" : "dark"; } catch { return "dark"; }
}
const discoveryState = {
  theme: storedDiscoveryTheme(), requests: new Map(), errors: new Map(),
  deskQuery: "", deskAuthor: "", deskYear: "all", deskTopic: "all", deskStanding: "all", deskListing: "all", deskSaved: "all", deskRead: "all", deskSort: "newest", deskVideo: "all", deskCompact: false, deskPage: 1,
  timeTopic: "all", timeOrder: "oldest", timeYear: "all", timeExpanded: new Set()
};
// Only these bounded fields travel in a Desk link. Local saved/read records do not.
const DESK_URL_FIELDS = {
  q: ["deskQuery", "", 300], author: ["deskAuthor", "", 120],
  year: ["deskYear", "all", () => ["all", ...YEAR_FILES]],
  topic: ["deskTopic", "all", () => ["all", ...TOPICS.map(topic => topic.name)]],
  standing: ["deskStanding", "all", ["all", "winner", "nominee", "addition", "held", "preliminary"]],
  listing: ["deskListing", "all", ["all", "original", "addition"]],
  saved: ["deskSaved", "all", ["all", "saved", "unsaved"]],
  read: ["deskRead", "all", ["all", "read", "unread"]],
  sort: ["deskSort", "newest", ["newest", "oldest", "title", "rank"]],
  video: ["deskVideo", "all", ["all", "with", "without"]],
  page: ["deskPage", 1], compact: ["deskCompact", false]
};
function deskRouteState(search = location.search) {
  const params = new URLSearchParams(search.length <= 8192 ? search : "");
  return Object.fromEntries(Object.entries(DESK_URL_FIELDS).map(([name, [field, fallback, allowed]]) => {
    const value = params.getAll(name).length === 1 ? params.get(name) : null;
    if (value === null) return [field, fallback];
    if (name === "page") return [field, /^[1-9]\d{0,4}$/.test(value) && Number(value) <= 10000 ? Number(value) : fallback];
    if (name === "compact") return [field, value === "1"];
    if (typeof allowed === "number") return [field, value.length <= allowed && !/[\u0000-\u001f\u007f]/.test(value) ? value : fallback];
    return [field, (typeof allowed === "function" ? allowed() : allowed).includes(value) ? value : fallback];
  }));
}
function writeDeskRoute(url, values = discoveryState) {
  for (const [name, [field, fallback]] of Object.entries(DESK_URL_FIELDS)) {
    url.searchParams.delete(name);
    if (values[field] !== fallback) url.searchParams.set(name, name === "compact" ? "1" : String(values[field]));
  }
  return url;
}
function deskShareUrl(values = discoveryState) {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "desk";
  return writeDeskRoute(url, values).href;
}
let deskTypingField = "", deskTypingUntil = 0;
function syncDeskRoute(typingField = "", replace = false) {
  if (state.view !== "desk" || restoringRoute || documentDialogOpen() || $("#app-shell").hidden) return;
  const url = new URL(archiveViewUrl());
  writeDeskRoute(url);
  const coalesce = typingField && typingField === deskTypingField && Date.now() < deskTypingUntil;
  deskTypingField = typingField;
  deskTypingUntil = typingField ? Date.now() + 800 : 0;
  if (location.href === url.href) return;
  history[replace || coalesce ? "replaceState" : "pushState"]({ ...history.state, archiveYear: discoveryState.deskYear, archiveView: "desk" }, "", url.href);
  handledRouteUrl = location.href;
}
function deskLocalStateNotice() {
  return `<p class="discovery-note" id="desk-local-state-note">Read and saved filters use each recipient’s local browser records. Sharing this search does not share your reading history or saved papers.</p>`;
}
async function shareDeskSearch() {
  syncDeskRoute();
  const url = deskShareUrl();
  const control = document.activeElement;
  const message = "Search link copied. Read and saved filters use the recipient’s local browser records.";
  try { await navigator.clipboard.writeText(url); toast(message); }
  catch {
    toast(fallbackCopy(url) ? message : "Copy this search’s address from the address bar. Read and saved filters use local browser records.", 5000);
    if (control?.isConnected) focusWithoutScroll(control);
  }
}
function discoveryAppearance() {
  return `<div class="discovery-appearance" role="group" aria-label="Page appearance"><span>Appearance</span>${["light", "dark"].map((mode) => `<button type="button" data-discovery-action="theme" data-discovery-value="${mode}" aria-pressed="${discoveryState.theme === mode}">${mode === "light" ? "Light" : "Dark"}</button>`).join("")}</div>`;
}
function updateDiscoveryAppearance() {
  const root = document.documentElement;
  if (isDiscoveryView()) root.dataset.discoveryTheme = discoveryState.theme;
  else delete root.dataset.discoveryTheme;
  const themeColor = $('meta[name="theme-color"]');
  if (themeColor) themeColor.content = getComputedStyle(root).getPropertyValue("--paper").trim();
}
function discoverySelect(id, label, value, options) {
  return `<label class="discovery-field" for="${id}"><span>${label}</span><select id="${id}">${options.map(([key, title]) => `<option value="${h(key)}" ${key === value ? "selected" : ""}>${h(title)}</option>`).join("")}</select></label>`;
}
function discoveryYears() { return [["all", "Every collection"], ...newestFirstYearRecords().map((record) => [record.id, yearLabel(record.id)])]; }
function discoveryTopics() { return [["all", "Every subject"], ...TOPICS.map((topic) => [topic.name, topic.name])]; }
function discoveryStatus(item) { return itemStandingLabel(item); }
function discoveryRecord(item, mode = "card") {
  return `<article class="discovery-record ${mode === "row" ? "discovery-row" : ""}" data-discovery-record="${h(item.id)}">
    <div class="discovery-record-copy"><p class="discovery-meta"><span>${h(item.yearLabel || item.year)}</span><span>${h(item.topic)}</span><span>${h(discoveryStatus(item))}</span>${listMembershipMark(item)}${item.videos?.length ? `<span class="discovery-video">${videoMark(item)}${item.videos.some((video) => video.confidence === "confirmed") ? "Video available" : "Possible video"}</span>` : ""}</p>
    <h3><button type="button" data-artifact="${h(item.id)}" aria-label="${h(`Open ${item.title}${videoLabel(item)}`)}">${h(item.title)}</button></h3><p class="discovery-credit">${h(creditOf(item) || "Author not stated")}</p>
    ${item.summary ? `<p class="discovery-summary">${h(short(item.summary, 240))}</p>` : ""}</div>
    <div class="discovery-record-actions"><button type="button" data-discovery-action="read" data-discovery-value="${h(item.id)}">${item.mdPath ? "Read article" : "Open record"}</button><button type="button" data-artifact="${h(item.id)}">Sources &amp; details (${item.sourceCount || item.links.length})</button><button type="button" data-favourite="${h(item.id)}" aria-pressed="${item.favourite}" aria-label="${h(`${item.favourite ? "Remove saved" : "Save"}: ${item.title}`)}">${item.favourite ? "★ Saved" : "☆ Save"}</button><button type="button" data-discovery-action="mark" data-discovery-value="${h(item.id)}" aria-pressed="${item.read}" aria-label="${h(`Mark ${item.read ? "unread" : "read"}: ${item.title}`)}">${item.read ? "✓ Read" : "Mark read"}</button></div>
  </article>`;
}
function discoveryEmpty(message) { return `<p class="discovery-empty">${h(message)}</p>`; }
function discoverySorted(items, order = "newest") {
  return [...items].sort((a, b) => {
    if (order === "title") return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
    if (order === "rank") return byRankThenTitle(a, b) || a.id.localeCompare(b.id);
    const years = compareCollectionsNewestFirst(yearRecordFor(a.year), yearRecordFor(b.year));
    return (order === "oldest" ? -years : years) || byRankThenTitle(a, b) || a.id.localeCompare(b.id);
  });
}

function discoveryRequiredCollections() {
  return state.view === "desk" && discoveryState.deskYear !== "all" ? [discoveryState.deskYear] : YEAR_FILES;
}
function discoveryLoadState() {
  const years = discoveryRequiredCollections();
  const missing = years.filter((year) => !loadedCollections.has(year));
  return { years, missing, failed: missing.filter((year) => discoveryState.errors.has(year)) };
}
function discoveryLoadingNotice() {
  const { years, missing, failed } = discoveryLoadState();
  if (!missing.length) return `<p class="discovery-note">${years.length === 1 ? `${h(yearLabel(years[0]))} collection fully loaded.` : "All collections loaded. Results are complete."}</p>`;
  const loaded = years.length - missing.length, pending = missing.length - failed.length;
  return `<div class="discovery-note"><p>${loaded} of ${years.length} collection${years.length === 1 ? "" : "s"} loaded. Results are incomplete.${pending ? ` Loading ${pending} collection${pending === 1 ? "" : "s"}…` : ""}</p>${failed.length ? `<p>Could not load ${failed.map((year) => h(yearLabel(year))).join(", ")}. <button type="button" data-discovery-action="retry">Retry</button></p>` : ""}</div>`;
}
function loadDiscoveryCollections() {
  for (const year of discoveryLoadState().missing) {
    if (discoveryState.requests.has(year) || discoveryState.errors.has(year)) continue;
    const request = ensureCollection(year).then(() => {
      discoveryState.errors.delete(year);
    }).catch((error) => {
      discoveryState.errors.set(year, error.message);
    }).finally(() => {
      discoveryState.requests.delete(year);
      if (isDiscoveryView() && discoveryRequiredCollections().includes(year)) {
        discoveryRefresh();
        if (state.view === "time" && !discoveryLoadState().missing.length && discoveryState.timeYear !== "all") discoveryJump(`time-${discoveryState.timeYear}`);
      }
    });
    discoveryState.requests.set(year, request);
  }
}
function renderDiscovery() {
  loadDiscoveryCollections();
  if (state.view === "time" && discoveryLoadState().missing.length) {
    setMetric(loadedCollections.size, `collections loaded · timeline incomplete${discoveryLoadState().failed.length ? " · collection load failed; Retry available" : " · loading"}`);
    $("#view-root").innerHTML = `<section class="discovery-view"><p class="discovery-empty">Opening all collections for the timeline…</p>${discoveryLoadingNotice()}</section>`;
    return;
  }
  ({ desk: renderResearchDesk, time: renderTimeMachine })[state.view]();
}
function deskFilteredRecords() {
  return discoverySorted(queryItems(state.items, discoveryState.deskQuery).filter((item) =>
    (discoveryState.deskYear === "all" || item.year === discoveryState.deskYear)
    && (discoveryState.deskTopic === "all" || item.topic === discoveryState.deskTopic)
    && (!discoveryState.deskAuthor || (item.authors || []).join(" ").toLowerCase().includes(discoveryState.deskAuthor.toLowerCase()))
    && (discoveryState.deskVideo === "all" || (discoveryState.deskVideo === "with" ? Boolean(item.videos?.length) : !item.videos?.length))
    && (discoveryState.deskRead === "all" || item.read === (discoveryState.deskRead === "read"))
    && (discoveryState.deskSaved === "all" || item.favourite === (discoveryState.deskSaved === "saved"))
    && (discoveryState.deskStanding === "all" || itemStanding(item) === discoveryState.deskStanding)
    && (discoveryState.deskListing === "all" || itemListMembership(item) === discoveryState.deskListing)
  ), discoveryState.deskSort);
}
function deskResults() {
  const items = deskFilteredRecords(), pageSize = 20, pages = Math.max(1, Math.ceil(items.length / pageSize));
  const incomplete = discoveryLoadState().missing.length > 0;
  if (!incomplete && discoveryState.deskPage > pages) {
    discoveryState.deskPage = pages;
    syncDeskRoute("", true);
  }
  const start = (discoveryState.deskPage - 1) * pageSize;
  const visible = items.slice(start, start + pageSize);
  const range = visible.length ? ` · showing ${start + 1}–${start + visible.length}` : "";
  const pageLabel = `Page ${discoveryState.deskPage}${incomplete ? ` · ${pages} page${pages === 1 ? "" : "s"} available so far` : ` of ${pages}`}`;
  setMetric(items.length, `matching research records${incomplete ? ` so far · results incomplete${discoveryLoadState().failed.length ? " · collection load failed; Retry available" : " · loading"}` : ""}${range} · ${pageLabel.toLowerCase()}`);
  return `${discoveryLoadingNotice()}${deskBibliographyControls(items.length, incomplete)}<div class="desk-result-heading"><p id="desk-result-count" tabindex="-1">${items.length.toLocaleString()} results${incomplete ? " so far" : ""}${range}</p><span>Collection years, newest first by default</span></div>
    <div class="desk-records ${discoveryState.deskCompact ? "is-compact" : ""}">${visible.length ? visible.map((item) => discoveryRecord(item, "row")).join("") : discoveryEmpty(incomplete ? "No matching records in the loaded collections yet for this page. Results are incomplete; your requested page is preserved." : "No records match these filters. Try another subject or reset the filters.")}</div>
    <nav class="discovery-pagination" aria-label="Research results pages"><button type="button" data-discovery-action="desk-prev" ${discoveryState.deskPage === 1 ? "disabled" : ""}>← Previous</button><span>${pageLabel}</span><button type="button" data-discovery-action="desk-next" ${discoveryState.deskPage >= pages ? "disabled" : ""}>Next →</button></nav>`;
}
let shortlistPreparing = false, shortlistPrintReady = false, shortlistPrintControl = null, shortlistRequest = null;
function cancelStaleShortlistPreparation() {
  if (shortlistRequest && (state.view !== "desk" || deskBibliographySelection() !== shortlistRequest.selection
    || JSON.stringify(deskFilteredRecords().map(item => item.id)) !== shortlistRequest.ids)) shortlistRequest.cancelled = true;
}
function deskBibliographyControls(count, incomplete) {
  const disabled = incomplete || !count || shortlistPreparing;
  return `<section class="desk-bibliography" aria-label="Shortlist bibliography"><p id="desk-bibliography-note">${incomplete ? "Bibliography downloads and printing are unavailable until every selected collection loads. Use Retry above if a collection failed." : `${count.toLocaleString()} matching records across every results page. Downloads and printing include the full filtered set; use Saved status to create a saved shortlist.`} These are reading lists; JSON reading-state backups are in Saved.</p><div class="desk-filter-actions">${[["markdown", "Download Markdown"], ["csv", "Download CSV"], ["print", "Print shortlist"]].map(([format, label]) => `<button type="button" data-discovery-action="desk-bibliography" data-discovery-value="${format}" aria-describedby="desk-bibliography-note" ${disabled ? "disabled" : ""}>${label}</button>`).join("")}</div><p id="desk-bibliography-status" role="status">${shortlistPreparing ? "Preparing source credits for the complete shortlist…" : ""}</p></section>`;
}
function deskBibliographySelection() {
  const labels = {deskQuery:"Search", deskAuthor:"Author", deskYear:"Collection", deskTopic:"Subject", deskStanding:"Selection", deskListing:"Original list membership", deskSaved:"Saved status", deskRead:"Reading status", deskVideo:"Video", deskSort:"Sort"};
  return Object.entries(labels).map(([field, label]) => `${label}: ${field === "deskStanding" ? DESK_STANDING_OPTIONS.find(([value]) => value === discoveryState[field])?.[1] || "All research" : field === "deskListing" ? DESK_LISTING_OPTIONS.find(([value]) => value === discoveryState[field])?.[1] || "All list memberships" : field === "deskYear" && discoveryState[field] !== "all" ? yearLabel(discoveryState[field]) : discoveryState[field] || "any"}`).join("; ");
}
function shortlistPrintArea() {
  let area = $("#shortlist-print");
  if (!area) { area = document.createElement("section"); area.id = "shortlist-print"; document.body.append(area); }
  return area;
}
async function exportDeskBibliography(format, control) {
  if (!["markdown", "csv", "print"].includes(format) || shortlistPreparing) return;
  if (discoveryLoadState().missing.length) { toast("Load every selected collection before exporting the full shortlist. Retry failed collections above."); return; }
  const items = deskFilteredRecords(), selection = deskBibliographySelection();
  if (!items.length) { toast("No records match these filters."); return; }
  shortlistPreparing = true;
  const request = shortlistRequest = {selection, ids:JSON.stringify(items.map(item => item.id)), cancelled:false};
  $("#desk-bibliography-status").textContent = "Preparing source credits for the complete shortlist…";
  $$('[data-discovery-action="desk-bibliography"]').forEach(button => { button.disabled = true; });
  try {
    // Source details are lazy. Never label unloaded metadata as a missing byline,
    // and never silently export fewer companion sources after a fetch failure.
    await Promise.all([...new Set(items.map(item => item.year))].map(ensureSourceDetails));
    cancelStaleShortlistPreparation();
    if (request.cancelled || document.querySelector("dialog[open]")) { toast("Bibliography preparation cancelled because the view or shortlist changed, or a dialog opened. Prepare the current shortlist again.", 6000); return; }
    const rows = ShortlistBibliography.records(items, normalizeUrl, itemStandingLabel, officialBibliographyContext);
    if (format === "print") {
      shortlistPrintArea().innerHTML = ShortlistBibliography.printHtml(rows, selection);
      shortlistPrintReady = true;
      shortlistPrintControl = control;
      window.print();
    } else {
      const content = format === "csv" ? ShortlistBibliography.csv(rows, selection) : ShortlistBibliography.markdown(rows, selection);
      const address = URL.createObjectURL(new Blob([content], {type:format === "csv" ? "text/csv;charset=utf-8" : "text/markdown;charset=utf-8"}));
      const link = document.createElement("a");
      link.href = address; link.download = `webhacklist-shortlist.${format === "csv" ? "csv" : "md"}`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(address), 30000);
    }
    toast(`${rows.length.toLocaleString()} records prepared from the full matching set.`);
  } catch (error) {
    toast(`Bibliography could not be prepared: ${error.message} Try the download or print action again to retry.`, 8000);
  } finally {
    shortlistPreparing = false;
    shortlistRequest = null;
    const restoreFocus = document.activeElement === control || document.activeElement === document.body || document.activeElement === document.documentElement;
    if (state.view === "desk") discoveryRefresh();
    const replacement = $$('[data-discovery-action="desk-bibliography"]').find(button => button.dataset.discoveryValue === format);
    if (replacement && !document.querySelector("dialog[open]")) { if (restoreFocus) focusWithoutScroll(replacement); if (format === "print") shortlistPrintControl = replacement; }
  }
}
if (typeof window !== "undefined") window.addEventListener("beforeprint", () => {
  if (!shortlistPrintReady || document.querySelector("dialog[open]")) shortlistPrintArea().innerHTML = `<h1>Research shortlist</h1><p>Close any open document or dialog, then use Print shortlist in Research Desk to prepare the full filtered set with source credits. All selected collections must finish loading first.</p>`;
});
if (typeof window !== "undefined") window.addEventListener("afterprint", () => {
  shortlistPrintReady = false;
  shortlistPrintArea().replaceChildren();
  if (shortlistPrintControl?.isConnected && !document.querySelector("dialog[open]")) focusWithoutScroll(shortlistPrintControl);
  shortlistPrintControl = null;
});
function renderResearchDesk() {
  $("#view-root").innerHTML = `<section class="discovery-view research-desk">
    <form id="desk-filter-form" class="desk-filters" role="search" aria-label="Filter the Research Desk">
      <label class="discovery-field desk-query"><span>Search the archive</span><input id="desk-query" type="search" maxlength="300" value="${h(discoveryState.deskQuery)}" placeholder="Title, subject, publisher, or a phrase…" autocomplete="off"></label>
      <label class="discovery-field"><span>Author name</span><input id="desk-author" type="search" maxlength="120" value="${h(discoveryState.deskAuthor)}" placeholder="Any author" autocomplete="off"></label>
      ${discoverySelect("desk-year", "Collection", discoveryState.deskYear, discoveryYears())}${discoverySelect("desk-topic", "Subject", discoveryState.deskTopic, discoveryTopics())}
      ${discoverySelect("desk-standing", "Selection", discoveryState.deskStanding, DESK_STANDING_OPTIONS)}
      ${discoverySelect("desk-listing", "Original list membership", discoveryState.deskListing, DESK_LISTING_OPTIONS)}
      ${discoverySelect("desk-read", "Reading status", discoveryState.deskRead, [["all", "Read and unread"], ["unread", "Unread"], ["read", "Read"]])}
      ${discoverySelect("desk-saved", "Saved status", discoveryState.deskSaved, [["all", "Saved and unsaved"], ["saved", "Saved"], ["unsaved", "Unsaved"]])}
      ${discoverySelect("desk-sort", "Sort by", discoveryState.deskSort, [["newest", "Newest collection"], ["oldest", "Oldest collection"], ["title", "Title A–Z"], ["rank", "Rank, then title"]])}
      ${discoverySelect("desk-video", "Video", discoveryState.deskVideo, [["all", "All research"], ["with", "With video links"], ["without", "No video links"]])}
      <div class="desk-filter-actions"><button type="button" data-discovery-action="desk-share" aria-describedby="desk-local-state-note">Share this search</button><button type="button" data-discovery-action="desk-compact" aria-pressed="${discoveryState.deskCompact}">Compact rows</button><button type="button" data-discovery-action="desk-reset">Reset filters</button></div>
    </form>${deskLocalStateNotice()}<div id="desk-results">${deskResults()}</div></section>`;
  $("#desk-filter-form").addEventListener("submit", (event) => event.preventDefault());
  $("#desk-filter-form").addEventListener("focusout", () => { deskTypingField = ""; });
}
function renderTimeMachine() {
  const items = state.items.filter((item) => discoveryState.timeTopic === "all" || item.topic === discoveryState.timeTopic);
  const records = [...newestFirstYearRecords()];
  if (discoveryState.timeOrder === "oldest") records.reverse();
  const chronological = discoverySorted(items.filter((item) => !item.preliminary), "oldest");
  const first = chronological[0], lastYear = chronological.at(-1)?.year;
  const last = discoverySorted(chronological.filter((item) => item.year === lastYear))[0];
  setMetric(items.length, "records across the years");
  $("#view-root").innerHTML = `<section class="discovery-view time-machine">
    <div class="discovery-toolbar">${discoverySelect("time-topic", "Follow a subject", discoveryState.timeTopic, discoveryTopics())}${discoverySelect("time-order", "Travel direction", discoveryState.timeOrder, [["oldest", "Earlier to later"], ["newest", "Later to earlier"]])}${discoverySelect("time-jump", "Jump to a collection", discoveryState.timeYear === "all" ? "" : discoveryState.timeYear, [["", "Choose a year…"], ...discoveryYears().slice(1)])}</div>
    <p class="discovery-note">Dates below are collection years, not necessarily publication dates. Comparisons show archive appearances and do not imply that one paper builds on another.</p>
    ${first && last && first.year !== last.year ? `<section class="time-comparison" aria-label="Earlier and later research"><div><p class="eyebrow">Earlier in the archive</p>${discoveryRecord(first)}</div><div><p class="eyebrow">Later in the archive</p>${discoveryRecord(last)}</div></section>` : ""}
    <div class="time-spine">${records.map((record) => {
      const yearItems = discoverySorted(items.filter((item) => item.year === record.id));
      const expanded = discoveryState.timeExpanded.has(record.id);
      return `<section class="time-stop" id="time-${h(record.id)}" tabindex="-1"><header><p class="time-year">${h(yearLabel(record.id))}</p><div><p class="eyebrow">${record.status === "final" ? "Annual collection" : "Preliminary collection · unranked"}</p><h2>${yearItems.length} ${discoveryState.timeTopic === "all" ? "research records" : `${h(discoveryState.timeTopic)} records`}</h2><p>${record.status === "final" ? `${yearItems.filter((item) => item.rank).length} Top 10 selections in this view` : "Provisional research leads; subject to change"}</p></div></header>
      ${officialContextMarkup(record.id)}<div class="discovery-grid">${yearItems.slice(0, expanded ? yearItems.length : 3).map((item) => discoveryRecord(item)).join("") || discoveryEmpty("No records for this subject in this collection.")}</div>
      ${yearItems.length > 3 ? `<button class="discovery-more" type="button" data-discovery-action="time-expand" data-discovery-value="${h(record.id)}" aria-expanded="${expanded}">${expanded ? "Show highlights" : `Explore all ${yearItems.length} records from ${h(yearLabel(record.id))}`}</button>` : ""}</section>`;
    }).join("")}</div></section>`;
}
function discoveryRefresh() {
  if (!isDiscoveryView()) return;
  const active = document.activeElement;
  const id = active?.id;
  const action = active?.getAttribute("data-discovery-action"), value = active?.getAttribute("data-discovery-value"), favourite = active?.getAttribute("data-favourite"), artifact = active?.getAttribute("data-artifact");
  const artifactIndex = artifact ? $$("#view-root button").filter(button => button.dataset.artifact === artifact).indexOf(active) : -1;
  const selection = active?.matches("input[type='search'], input[type='text'], textarea")
    ? { start: active.selectionStart, end: active.selectionEnd, direction: active.selectionDirection } : null;
  const inside = $("#view-root").contains(active);
  render();
  if (!inside) return;
  const controls = $$("#view-root button");
  const target = id ? document.getElementById(id) : artifact ? controls.filter(button => button.dataset.artifact === artifact)[artifactIndex]
    : controls.find((button) => favourite ? button.dataset.favourite === favourite : action && button.dataset.discoveryAction === action && button.dataset.discoveryValue === value);
  const fallback = $("#desk-result-count") || $("#view-root");
  if (target && !target.disabled) {
    focusWithoutScroll(target);
    if (selection) target.setSelectionRange(selection.start, selection.end, selection.direction);
  }
  else { fallback.setAttribute("tabindex", "-1"); focusWithoutScroll(fallback); }
}
function discoveryJump(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: state.motionReduced ? "instant" : "smooth", block: "start" });
  focusWithoutScroll(target);
}
function handleDiscoveryClick(event) {
  const button = event.target.closest("[data-discovery-action]");
  if (!button) return false;
  const { discoveryAction: action, discoveryValue: value } = button.dataset;
  if (action === "desk-bibliography") { exportDeskBibliography(value, button); return true; }
  if (action === "desk-share") {
    shareDeskSearch();
    return true;
  }
  if (action === "read" || action === "mark") {
    const item = state.items.find((entry) => entry.id === value);
    if (item) {
      if (action === "mark") setReadState(item);
      else if (item.mdPath) openReader(item);
      else openArtifact(item.id);
    }
    return true;
  }
  if (action === "retry") {
    discoveryRequiredCollections().forEach((year) => discoveryState.errors.delete(year));
    discoveryRefresh();
    if (state.view === "time" && !discoveryLoadState().missing.length && discoveryState.timeYear !== "all") discoveryJump(`time-${discoveryState.timeYear}`);
    return true;
  }
  if (action === "theme" && ["light", "dark"].includes(value)) {
    discoveryState.theme = value;
    try { localStorage.setItem("websec-discovery-theme-v1", value); } catch { toast("Appearance could not be saved in this browser"); }
    updateDiscoveryAppearance();
    $$("[data-discovery-action='theme']").forEach((control) => control.setAttribute("aria-pressed", String(control.dataset.discoveryValue === value)));
    return true;
  } else if (action === "desk-reset") {
    Object.assign(discoveryState, deskRouteState(""));
  } else if (action === "desk-compact") discoveryState.deskCompact = !discoveryState.deskCompact;
  else if (action === "desk-next") discoveryState.deskPage++;
  else if (action === "desk-prev") discoveryState.deskPage--;
  else if (action === "time-expand" && YEAR_FILES.includes(value)) toggleInSet(discoveryState.timeExpanded, value);
  if (action.startsWith("desk-")) syncDeskRoute();
  discoveryRefresh();
  return true;
}
function handleDiscoveryInput(event) {
  const mapping = { "desk-query": "deskQuery", "desk-author": "deskAuthor", "desk-year": "deskYear", "desk-topic": "deskTopic", "desk-standing": "deskStanding", "desk-listing": "deskListing", "desk-saved": "deskSaved", "desk-read": "deskRead", "desk-sort": "deskSort", "desk-video": "deskVideo", "time-topic": "timeTopic", "time-order": "timeOrder" };
  if (event.target.id === "time-jump") { selectArchiveYear(event.target.value || "all"); return; }
  if (event.target.id === "desk-year") { selectArchiveYear(event.target.value); return; }
  const key = mapping[event.target.id];
  if (!key) return;
  discoveryState[key] = event.target.value;
  if (state.view === "desk") {
    discoveryState.deskPage = 1;
    cancelStaleShortlistPreparation();
    syncDeskRoute(["desk-query", "desk-author"].includes(event.target.id) ? event.target.id : "");
    $("#desk-results").innerHTML = deskResults();
  }
  else discoveryRefresh();
}
