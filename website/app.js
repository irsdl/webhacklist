/* Web Hacking Techniques Index — dependency-free and powered by the real research archive. */

let YEAR_RECORDS = [];
let YEAR_FILES = [];
let ARCHIVE_CATALOGUE = null;
let ARCHIVE_DIAGRAMS = Object.create(null);
let diagramRequest = null;
let LARGE_PDF_FALLBACKS = new Map();
const loadedCollections = new Set();
const collectionRequests = new Map();

// A path the manifest advertises through an old step record but the working
// archive does not hold. Empty is the healthy state: paths come from the
// archive's own rule (see archivePathsFor), not from a step record that a
// later rename or withdrawal left behind.
const KNOWN_MISSING_PATHS = new Set([]);
// Kinds the archive never prints a PDF for - `config.json -> pdf.skip_kinds`.
const NO_PDF_KINDS = new Set(["video"]);
// The archive's own name, never the name of the mode being viewed. The browser
// tab reads the same in every room; the mode names itself in the heading above
// the records, and in the masthead h1 the site names itself once.
const SITE_TITLE = "Web Hacking Techniques Index";
const SITE_DOCUMENT_TITLE = `${SITE_TITLE} — Research archive`;
const READ_STORAGE_KEY = "technique-vault-read-v1";
const FAVOURITE_STORAGE_KEY = "websec-favourites-v1";
const READING_THEME_STORAGE_KEY = "technique-vault-reading-theme-v1";
const MOTION_STORAGE_KEY = "websec-reduced-motion-v1";
// Every archive mode can fill the screen. The four immersive views additionally
// get a focused full-screen layout in styles.css; the reading views (Museum,
// Library and the personal collection) simply gain the whole viewport.
const FULLSCREEN_VIEWS = new Set(["museum", "library", "signals", "constellation", "terminal", "evidence", "favourites", "desk", "time"]);
// Which personal collection view 09 is showing. Favourites and read state are
// two independent browser-local lists over the same records.
const SAVED_MODES = ["favourites", "read", "all"];

// Contributing runs through GitHub's issue forms: this site is static and stays
// static, so nothing here posts anything anywhere. The form ids below are the
// prefill parameter names in .github/ISSUE_TEMPLATE/01-submit-research.yml -
// renaming a field there without renaming it here silently drops the answer.
const REPOSITORY_URL = "https://github.com/irsdl/webhacklist";
const CONTRIBUTION_FORMS = {
  research: "01-submit-research.yml",
  link: "02-dead-or-changed-link.yml",
  capture: "03-faulty-capture.yml",
  credit: "04-author-credit.yml",
  website: "05-website-feedback.yml",
  inaccuracy: "06-record-inaccuracy.yml"
};

// The wording here is the reader's, not the archive's: they see a preserved
// copy that reads nothing like the article, not a failed extraction. Ordered by
// what actually damages the archive - a Markdown copy that disagrees with its
// own PDF, or a link that goes nowhere, breaks the record for everyone, while a
// mismatched recording is one line on it. A recording therefore gets ONE entry
// here rather than the four it used to, which made the form look like a video
// complaints desk. Kept in the same order as the issue form's dropdown so the
// prefill lands on a real option.
const REPORT_FAULTS = [
  "The Markdown and the PDF do not match",
  "The preserved copy is not this research",
  "A link on this record is wrong or dead",
  "The author, publisher or title shown is wrong",
  "The summary or tags misdescribe the research",
  "A linked video is wrong or will not play",
  "Something is missing — a copy, a link or a recording",
  "Something else (described below)"
];
// GitHub answers an over-long issue address with an error page rather than a
// form. A field that would push the address past this is dropped whole, not
// truncated: half a sentence sitting in a form field reads as the submitter's
// own words and is worse than an empty box they can see is empty.
const ISSUE_URL_LIMIT = 6000;
const ISSUE_FIELD_LIMIT = 1200;

function loadStoredKeys(storageKey) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const safeKeys = Array.isArray(saved)
      ? saved.filter((key) => typeof key === "string" && key.length > 0 && key.length <= 2048).slice(0, 5000)
      : [];
    return new Set(safeKeys);
  } catch {
    return new Set();
  }
}

function loadReadKeys() {
  return loadStoredKeys(READ_STORAGE_KEY);
}

function loadFavouriteKeys() {
  return loadStoredKeys(FAVOURITE_STORAGE_KEY);
}

function loadReadingTheme() {
  try {
    return localStorage.getItem(READING_THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyMotionPreference() {
  const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let savedReduced = false;
  try { savedReduced = localStorage.getItem(MOTION_STORAGE_KEY) === "true"; } catch {}
  state.motionReduced = systemReduced || savedReduced;
  document.body.classList.toggle("reduce-motion", state.motionReduced);
  document.documentElement.classList.toggle("reduce-motion", state.motionReduced);
  const button = $("#motion-toggle");
  button.setAttribute("aria-pressed", String(state.motionReduced));
  button.disabled = systemReduced;
  button.title = systemReduced ? "Motion reduced by your system preference" : "Reduce ambient motion";
}

const VIEWS = {
  ...DISCOVERY_VIEWS,
  museum: {
    kicker: "Room 02 / exhibition mode",
    title: "Museum at Night",
    description: "Walk through twenty years of research as rooms, illuminated winners and recovered artifacts."
  },
  library: {
    kicker: "Stack 03 / reading mode",
    title: "Infinite Security Library",
    description: "Pull a title from the shelves, browse by subject and turn a very large collection into something tactile."
  },
  signals: {
    kicker: "Scope 05 / trend mode",
    title: "Signal Observatory",
    description: "Tune across twenty years of research, spot rising technique families and open the papers behind every change in frequency."
  },
  constellation: {
    kicker: "Field 06 / relationship mode",
    title: "Research Constellation",
    description: "Fly through individual papers as stars gathered around recurring technique families and follow unexpected neighbours in three dimensions."
  },
  terminal: {
    kicker: "Shell 07 / query mode",
    title: "The Hacker Terminal",
    description: "Find research with commands or quick actions. Open, read and save papers from one console."
  },
  evidence: {
    kicker: "Case 01 / investigation mode",
    title: "The Investigation Board",
    description: "Open one corkboard case per year, rearrange its evidence and follow the red thread through the winning research."
  },
  favourites: {
    kicker: "Collection 09 / saved research",
    title: "Favourite Research",
    description: "Keep a durable shortlist across every archive view, then return to the papers that matter most."
  }
};

// View 09 is one surface over two browser-local lists. The copy follows the
// selected list so the page never claims a reading history is a shortlist.
const SAVED_VIEW_COPY = {
  favourites: VIEWS.favourites,
  read: {
    kicker: "Collection 09 / reading history",
    title: "Research You Have Read",
    description: "Every record you marked as read, across as many years as you want to compare at once."
  },
  all: {
    kicker: "Collection 09 / personal archive",
    title: "Saved And Read Research",
    description: "Your shortlist and your reading history together, filtered by any combination of years and topics."
  }
};

// Deep links into the two other collections. `favourites` stays the canonical
// view name so existing #favourites links keep working.
const VIEW_HASHES = {
  read: { view: "favourites", savedMode: "read" },
  saved: { view: "favourites", savedMode: "all" }
};

const TOPICS = [
  { name: "XSS", color: "#ff8e73", test: /\b(xss|cross[- ]site scripting|script injection|csp|css exfil|xs.leak|dom clobber)/i },
  { name: "HTTP", color: "#6ee7e7", test: /\b(http|request smuggling|desync|cache poison|cache deception|header|proxy|cdn|websocket|quic)/i },
  { name: "Identity", color: "#bda7ff", test: /\b(oauth|saml|authentication|authorization|account takeover|session|cookie|jwt|sso|passkey|permission)/i },
  { name: "Injection", color: "#f6c96b", test: /\b(sql|injection|ssti|template|xxe|deserialize|prototype pollution|parser differential|command execution)/i },
  { name: "Browser", color: "#82f5b2", test: /\b(browser|chrome|firefox|safari|edge|dom|iframe|same.origin|clickjack|extension|client.side)/i },
  { name: "Supply", color: "#ffb4d1", test: /\b(supply chain|dependency|package|npm|github action|repository|ci\/cd)/i },
  { name: "Server", color: "#80adff", test: /\b(ssrf|server|cloud|file upload|path traversal|rce|remote code|framework|java|php|\.net|node\.js)/i },
  { name: "Crypto", color: "#c7ee83", test: /\b(tls|ssl|crypto|certificate|padding oracle|entropy|encryption|hash|breach|crime|beast)/i },
  { name: "AI", color: "#ff9f7a", test: /\b(ai|llm|agentic|prompt injection|mcp|model context protocol|vllm|gptcache)\b/i },
  { name: "Other", color: "#93aaa2", test: /.*/ }
];

const state = {
  items: [],
  archiveTotal: 0,
  manifestCount: 0,
  view: "evidence",
  year: "",
  query: "",
  starYear: "",
  starTopic: "all",
  starStatus: "all",
  // The recordings axis in the field, on the same terms the museum and the
  // observatory already offer it: a third, independent question -- not which
  // stars, but which of them was filmed -- so it is a toggle beside the
  // standing rather than another value the standing could take.
  starRecordedOnly: false,
  signalYear: "",
  signalTopic: "all",
  signalStatus: "all",
  // The recordings axis, the same one the museum's colour key carries. Signals
  // already tunes a topic and a standing; whether the work was also presented
  // is a third, independent question, so it is a toggle beside them rather than
  // another value either of them could take.
  signalRecordedOnly: false,
  signalVisibleCount: 12,
  savedMode: "favourites",
  // Empty means "every year" / "every topic". Both filters are multi-select so
  // a shortlist can be read across several years at once.
  savedYears: new Set(),
  savedTopics: new Set(),
  // The museum room's own filter, driven by the colour key above the walls.
  // Empty means the whole room. Topics OR together; `roomVideoOnly` is an AND
  // over whatever they left, so Injection + Recorded asks for recorded
  // injection research rather than for both lists at once.
  roomTopics: new Set(),
  roomVideoOnly: false,
  terminalDraft: "",
  terminalBusy: false,
  terminalLines: [],
  terminalHistory: [],
  terminalHistoryIndex: 0,
  terminalCwd: "/",
  terminalPreviousCwd: "/",
  evidenceDense: false,
  motionReduced: false,
  readingTheme: loadReadingTheme(),
  readKeys: loadReadKeys(),
  favouriteKeys: loadFavouriteKeys(),
  readerItem: null,
  readerOriginal: false,
  pdfItem: null,
  pdfPath: "",
  pdfKind: "pdf",
  pdfVersion: "",
  pdfOriginal: false,
  pdfVerified: false,
  pdfBytes: 0,
  pdfFrameUrl: "",
  pdfUsesInSiteReader: false,
  // A full page is the useful first view on a phone; page-width remains the
  // roomier desktop default and either toolbar control can change it.
  pdfViewMode: typeof globalThis.innerWidth === "number" && globalThis.innerWidth <= 760
    ? "page-fit"
    : "page-width"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const h = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
// Markdown escapes are for the file, not for the reader: a title written
// `\[EN\] ...` in a list is read as `[EN] ...`.
const compact = (value = "") => String(value).replace(/\s+/g, " ").trim()
  .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1");
const short = (value, length = 58) => value.length > length ? `${value.slice(0, length - 1)}…` : value;
const byRankThenTitle = (a, b) => (a.rank || 999) - (b.rank || 999) || a.title.localeCompare(b.title);
let constellationExperience = null;
let investigationResizeObserver = null;
let investigationCardInfo = new Map();
let pdfLoadTimer = null;
let pdfVerifyToken = 0;
let readerRequestToken = 0;
let lockedDialogScrollY = null;
let dialogUnlockFrame = null;
// Where the reader was in the result list when they opened a document from it.
let globalResultsScroll = 0;
let searchResumable = false;

function focusWithoutScroll(element) {
  try { element.focus({ preventScroll: true }); }
  catch { element.focus(); }
}

// Mobile WebKit still lets the page behind a top-layer <dialog> rubber-band in
// some browser-chrome states. Pin the document at its current position while a
// modal is open, then restore that exact position when the last modal closes.
function syncDialogScrollLock() {
  const modalOpen = $$('dialog[open]').length > 0;
  if (modalOpen) {
    if (dialogUnlockFrame !== null) cancelAnimationFrame(dialogUnlockFrame);
    dialogUnlockFrame = null;
    if (lockedDialogScrollY === null) {
      lockedDialogScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
      document.body.style.setProperty("--dialog-scroll-offset", `-${lockedDialogScrollY}px`);
      document.body.classList.add("document-dialog-open");
    }
    return;
  }
  if (lockedDialogScrollY === null || dialogUnlockFrame !== null) return;

  // A record, Markdown and PDF switch closes one dialog immediately before it
  // opens the next. Waiting one frame avoids briefly unlocking (and jumping)
  // the page in the middle of that hand-off.
  dialogUnlockFrame = requestAnimationFrame(() => {
    dialogUnlockFrame = null;
    if ($$('dialog[open]').length || lockedDialogScrollY === null) return;
    dismissDocumentHistory();
    if (documentDismissal) {
      documentDismissal.then(syncDialogScrollLock);
      return;
    }
    const restoreY = lockedDialogScrollY;
    lockedDialogScrollY = null;
    document.body.classList.remove("document-dialog-open");
    document.body.style.removeProperty("--dialog-scroll-offset");
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, restoreY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}

function showLockedModal(dialog) {
  if (!dialog.open) dialog.showModal();
  syncDialogScrollLock();
  // Focusing the dialog surface keeps browsers from auto-focusing the first
  // toolbar action and drawing a misleading selected-looking focus halo.
  focusWithoutScroll(dialog);
}

function yearRecordFor(year) {
  return YEAR_RECORDS.find((record) => record.id === year) || { id: year, label: year, status: "final", ranked: true };
}

function compareCollectionsNewestFirst(a, b) {
  const first = String(a?.id ?? a);
  const second = String(b?.id ?? b);
  const firstYear = Number(/^\d{4}/.exec(first)?.[0] || 0);
  const secondYear = Number(/^\d{4}/.exec(second)?.[0] || 0);
  return secondYear - firstYear || second.localeCompare(first);
}

// The registry stays in canonical publishing order. Archive controls use a
// separate copy so the collection a visitor is most likely to want is first.
function newestFirstYearRecords(records = YEAR_RECORDS) {
  return [...records].sort(compareCollectionsNewestFirst);
}

function newestFirstYearFiles(years = YEAR_FILES) {
  return [...years].sort(compareCollectionsNewestFirst);
}

function yearLabel(year, short = false) {
  const record = yearRecordFor(year);
  return short && record.shortLabel ? record.shortLabel : record.label || record.id;
}

function isPreliminaryYear(year) {
  return yearRecordFor(year).status === "preliminary";
}

function preliminaryNotice(year) {
  const record = yearRecordFor(year);
  if (record.status !== "preliminary") return "";
  return `<aside class="preliminary-notice" role="note"><b>PRELIMINARY · SUBJECT TO CHANGE</b><span>${h(record.notice || "This collection is incomplete, unranked, and not a finalized Top 10.")}</span></aside>`;
}

function safeExternalUrl(value) {
  try {
    const url = new URL(String(value));
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return "";
    return url.href;
  } catch {
    return "";
  }
}

// `inlineMarkdown` works on text after `h()` has escaped it. Decode exactly
// that one escaping layer before URL parsing, then escape the canonical URL
// again at the HTML sink. This prevents quote/entity tricks from manufacturing
// an attribute while keeping ordinary query strings intact.
function safeMarkdownUrl(value) {
  const decoded = String(value || "")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
  const safe = safeExternalUrl(decoded);
  return safe || "";
}

function safeArchivePath(value, kind) {
  if (typeof value !== "string" || !value || value.length > 500) return "";
  if (/[\\?#%\u0000-\u001f]/.test(value) || value.startsWith("/") || value.split("/").includes("..")) return "";
  const expected = kind === "md"
    ? /^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/i
    : kind === "figure"
      ? /^archived-references\/figures\/[a-z0-9-]+\/[a-z0-9._-]+\/[a-z0-9_-][a-z0-9._-]*\.png$/i
    : kind === "diagram"
      ? /^archived-references\/diagrams\/[a-f0-9]{64}\.svg$/
    : kind === "listingPdf"
      ? /^original-listings\/[0-9-]+-(?:top10|nominees-and-top10)\.pdf$/i
      : /^archived-references\/pdf\/[a-z0-9-]+\/[a-z0-9._-]+\.pdf$/i;
  return expected.test(value) ? value : "";
}

// A REDEPLOYED DOCUMENT NEEDS A NEW URL, or nobody sees it. Preserved documents
// are served `max-age=86400, stale-while-revalidate=604800`, which is right for
// files that almost never change - and means that when one DOES change, the edge
// keeps serving the old bytes for a day and revalidates lazily for a week. A
// reprint that replaced a text render with the publisher's own paper was invisible
// on the live site while the app around it had already updated, because the shell
// revalidates on every load and the documents do not.
//
// So the version travels in the URL, exactly as the collection shards already do.
// PER DOCUMENT rather than one token for the whole archive: the token is the
// moment that file was written, so adding one reference does not invalidate 1,500
// unchanged documents, and a 27 MiB PDF is re-fetched only when it is reprinted.
function versionToken(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? digits.slice(0, 14) : "";
}

function archiveUrl(path, kind, version = "") {
  const safePath = safeArchivePath(path, kind);
  if (!safePath) return "";
  const pageDirectory = new URL(".", location.href);
  // In the repository the app lives at /website/ beside the archive. The
  // Pages workflow publishes website/* at the deployment root together with
  // those archive directories. Support both layouts without a domain-specific
  // base URL so custom domains and project Pages URLs behave identically.
  const archiveRoot = /\/website\/$/i.test(pageDirectory.pathname)
    ? new URL("../", pageDirectory)
    : pageDirectory;
  const url = new URL(safePath, archiveRoot);
  const token = versionToken(version);
  if (token) url.search = `v=${token}`;
  return url.href;
}

function documentShareUrl(item, format = "artifact") {
  const url = new URL(location.href);
  const selectedYear = url.searchParams.get("year");
  url.search = "";
  if (selectedYear) url.searchParams.set("year", selectedYear);
  if (format === "reader" && item?.id) url.searchParams.set("reader", item.id);
  if (format === "pdf" && item?.id) url.searchParams.set("pdf", item.id);
  if (["reader", "pdf"].includes(format) && (item?.sourceId || Number.isInteger(item?.sourceIndex))) url.searchParams.set("source", item.sourceId || String(item.sourceIndex));
  if (format === "results") {
    const year = /^original-listings\/([0-9-]+)-(?:top10|nominees-and-top10)\.pdf$/i.exec(state.pdfPath)?.[1];
    if (year) url.searchParams.set("results", year);
  }
  if (["reader", "pdf", "results"].includes(format)) url.searchParams.set("theme", state.readingTheme);
  const route = viewHash();
  url.hash = item?.id ? `${route}/${encodeURIComponent(item.id)}` : route;
  return url.href;
}

let activeDocumentUrl = "";
let handledRouteUrl = "";
let routeRevision = 0;
let restoringRoute = 0;
let documentDismissal = null;
let finishDocumentDismissal = null;

const YEAR_VIEW_FIELDS = { evidence: "year", museum: "year", library: "year", constellation: "starYear", signals: "signalYear" };

function selectedArchiveYear(view = state.view) {
  if (Object.hasOwn(YEAR_VIEW_FIELDS, view)) return state[YEAR_VIEW_FIELDS[view]];
  if (view === "desk") return discoveryState.deskYear;
  if (view === "time") return discoveryState.timeYear || "all";
  if (view === "terminal") return state.terminalBrowse || "all";
  return [...state.savedYears].sort().join(",") || "all";
}

function validArchiveYear(value, view = state.view) {
  if (value === "all" && !Object.hasOwn(YEAR_VIEW_FIELDS, view)) return value;
  const years = typeof value === "string" ? value.split(",") : [];
  return years.length && (view === "favourites" || years.length === 1) && years.every(year => YEAR_FILES.includes(year))
    ? [...new Set(years)].sort().join(",") : "";
}

function rememberArchiveYear() {
  const year = selectedArchiveYear();
  if (history.state?.archiveYear !== year) history.replaceState({ ...history.state, archiveYear: year }, "", location.href);
}

function applyArchiveYear(view, year) {
  if (Object.hasOwn(YEAR_VIEW_FIELDS, view)) state[YEAR_VIEW_FIELDS[view]] = year;
  else if (view === "desk") { discoveryState.deskYear = year; discoveryState.deskPage = 1; }
  else if (view === "time") discoveryState.timeYear = year;
  else if (view === "terminal") state.terminalBrowse = year === "all" ? "" : year;
  else state.savedYears = new Set(year === "all" ? [] : year.split(","));
  if (view === "signals") { state.signalStatus = "all"; state.signalVisibleCount = 12; }
}

async function selectArchiveYear(value) {
  if (documentDismissal) await documentDismissal;
  const view = state.view, year = validArchiveYear(value, view), startUrl = location.href;
  if (!year || year === selectedArchiveYear()) return;
  const revision = ++routeRevision;
  if (year !== "all") await Promise.all(year.split(",").map(ensureCollection));
  if (revision !== routeRevision || view !== state.view || location.href !== startUrl) return;
  rememberArchiveYear();
  applyArchiveYear(view, year);
  const url = new URL(archiveViewUrl());
  if (year === "all") url.searchParams.delete("year");
  else url.searchParams.set("year", year);
  history.pushState({ archiveYear: year }, "", url.href);
  handledRouteUrl = location.href;
  if (view === "terminal") await runTerminalCommand(`ls /${year === "all" ? "" : year}`);
  else if (isDiscoveryView()) discoveryRefresh();
  else render();
  if (view === "time") discoveryJump(year === "all" ? "main-content" : `time-${year}`);
}

function archiveViewUrl() {
  const url = new URL(location.href);
  ["reader", "pdf", "results", "theme", "source"].forEach((key) => url.searchParams.delete(key));
  url.hash = viewHash();
  return url.href;
}

function syncDocumentUrl(item, format) {
  const url = documentShareUrl(item, format);
  if (!history.state?.archiveDocument) {
    rememberArchiveYear();
    // Also give a directly opened share link a local view to return to.
    const base = archiveViewUrl();
    if (location.href !== base) history.replaceState(history.state, "", base);
    history.pushState({ ...history.state, archiveDocument: true }, "", url);
  } else if (location.href !== url) {
    // Formats and companion sources share one popup visit: Back closes it.
    // Skip unchanged URLs, especially during Forward: WebKit rate-limits writes.
    history.replaceState(history.state, "", url);
  }
  activeDocumentUrl = handledRouteUrl = location.href;
}

function dismissDocumentHistory() {
  if (documentDialogOpen() || restoringRoute || documentDismissal || !history.state?.archiveDocument || location.href !== activeDocumentUrl) return;
  documentDismissal = new Promise((resolve) => { finishDocumentDismissal = resolve; });
  history.back();
}

function closeDocumentDialogs() {
  ["#report-dialog", "#artifact-dialog", "#reader-dialog", "#pdf-dialog"].forEach((id) => $(id).close());
}

async function restoreArchiveRoute() {
  if (handledRouteUrl === location.href) return;
  handledRouteUrl = location.href;
  const revision = ++routeRevision;
  restoringRoute = revision;
  try {
    const params = new URLSearchParams(location.search);
    const [next, sharedArtifact] = location.hash.slice(1).split("/");
    closeDocumentDialogs();
    setMobileMenuOpen(false);
    if (next === "submit") return openSubmissionDialog();
    const requested = resolveViewHash(next) || { view: state.view };
    const year = validArchiveYear(params.get("year"), requested.view)
      || validArchiveYear(history.state?.archiveYear, requested.view);
    const yearChanged = Boolean(year && year !== selectedArchiveYear(requested.view));
    const viewChanged = requested.view !== state.view;
    if (year && year !== "all") await Promise.all(year.split(",").map(ensureCollection));
    if (requested.view === "time" && year && year !== "all") await ensureAllCollections();
    if (revision !== routeRevision) return;
    if (yearChanged) {
      applyArchiveYear(requested.view, year);
      if (requested.view === "terminal") {
        state.terminalLines.push(year === "all" ? terminalRootListing()
          : `<p class="term-bright">== ${h(yearLabel(year))} ==</p>${terminalRows(itemsForYear(year).sort(byRankThenTitle))}`);
        state.terminalLines = state.terminalLines.slice(-260);
      }
    }
    const previousMode = state.savedMode;
    if (requested.savedMode) state.savedMode = requested.savedMode;
    else if (requested.view === "favourites") state.savedMode = "favourites";
    if (viewChanged) await setView(requested.view, false);
    else if (yearChanged || state.savedMode !== previousMode) render();
    if (requested.view === "time" && (yearChanged || viewChanged) && year) discoveryJump(year === "all" ? "main-content" : `time-${year}`);
    const theme = params.get("theme");
    if (["light", "dark"].includes(theme)) { state.readingTheme = theme; applyReadingTheme(); }
    const readerId = params.get("reader"), pdfId = params.get("pdf");
    const id = readerId || pdfId || sharedArtifact;
    if (id) {
      const item = await requestedSource(await ensureItemLoaded(id), params);
      if (revision !== routeRevision || !item) return;
      if (readerId && item.mdPath) { openReader(item); return; }
      if (pdfId && item.pdfPath) return openPdfViewer(item);
      return await openArtifact(item.id);
    }
    const resultsYear = params.get("results");
    const path = resultsYear && annualPdfPath(resultsYear);
    if (path && revision === routeRevision) return openPdfViewer(null, {
      path, kind: "listingPdf", title: `${resultsYear} Top 10 results`, kicker: `Official archive listing / ${resultsYear}`
    });
  } finally {
    if (restoringRoute === revision) restoringRoute = 0;
    syncDialogScrollLock();
  }
}

function fallbackCopy(value) {
  const input = document.createElement("textarea");
  input.value = value;
  input.readOnly = true;
  input.setAttribute("aria-hidden", "true");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand?.("copy") === true;
  input.remove();
  return copied;
}

async function shareDocument(item, format = "artifact") {
  const shareUrl = documentShareUrl(item, format);
  const formatLabel = format === "reader" ? "Markdown reader" : format === "pdf" ? "PDF viewer" : format === "results" ? "results PDF" : "archive record";
  const title = item?.title || $("#pdf-title")?.textContent || "Web Hacking Techniques Index";
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text: `Open this ${formatLabel} in the Web Hacking Techniques Index.`, url: shareUrl });
      toast("Share sheet opened");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(shareUrl);
    toast(`${formatLabel} link copied`);
  } catch {
    toast(fallbackCopy(shareUrl) ? `${formatLabel} link copied` : "Sharing is unavailable in this browser");
  }
}

// The publishing host, with a Wayback replay unwrapped to what it replays -
// otherwise every source cited as a capture reads as published by the archive.
function hostOf(value) {
  try {
    const replayed = /^https?:\/\/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i.exec(String(value));
    return new URL(replayed ? replayed[1] : value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Who to credit in one line. The researcher leads and the publisher follows,
// because a name is what a reader recognises and a host is only where the file
// sat. Falls back to the publisher alone, which is every reference whose source
// declared no author.
function creditOf(item) {
  const names = (item.authors || []).join(", ");
  if (!names) return item.publisher || "";
  return item.publisher ? `${names} · ${item.publisher}` : names;
}

// The same credit for a slot too narrow to hold both. A card foot truncates at
// 25 characters, where a name and a domain together are cut off through the
// middle of the domain: the name alone is the part worth the space.
function briefCreditOf(item) {
  return (item.authors || []).join(", ") || item.publisher || "";
}

// Preserve every recorded author, in source order, in the published data.
// Compact card layouts may clip visually; source details retain the full credit.
function creditList(authors) {
  return [...authors];
}

/**
 * A document's tags, plus the OWASP Top 10 categories they earn.
 *
 * The mapping is injected by build-data.mjs from
 * archived-references/tag-vocabulary.json, which is where a maintainer edits
 * it. When it is absent - in the browser, where these items arrive already
 * built - the tags are returned untouched rather than guessed at.
 */
function withOwaspCategories(tags) {
  const source = [...tags];
  const map = typeof __owasp === "object" && __owasp ? __owasp : null;
  if (!map) return source;
  const derived = [];
  for (const tag of source) {
    const key = String(tag).toLowerCase();
    const categories = Object.hasOwn(map, key) && Array.isArray(map[key]) ? map[key] : [];
    for (const category of categories) {
      if (!source.includes(category) && !derived.includes(category)) derived.push(category);
    }
  }
  return [...source, ...derived.sort()];
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return String(value).replace(/\/$/, "");
  }
}

function topicFor(title) {
  return TOPICS.find((topic) => topic.test.test(title)) || TOPICS.at(-1);
}

// Use the exact paths the archive manifest advertises. Inferring a directory
// from `cited_by[0]` breaks references cited in more than one collection: the
// citation list can be re-sorted while the preserved file correctly stays in
// its original collection. The strict path allowlist keeps manifest text from
// becoming an arbitrary client-side URL.
// The archive keeps a translation as a SECOND file beside the original, never as
// a section inside it (see the archive skill: `<slug>_translate.md`). This site
// is read in English, so where that English file exists it IS the document the
// reader opens, and the source's own words stay one action away. A translation
// only ever replaces the file it was made from: a reference whose Markdown was
// translated but whose PDF was not still offers its original PDF, unlabelled.
function archivePathsFor(record) {
  const empty = { mdPath: "", pdfPath: "", originalMdPath: "", originalPdfPath: "", translated: false };
  if (!record?.slug || !record?.grade || !record?.content_sha256) return empty;
  const noPdf = NO_PDF_KINDS.has(record.kind || "");
  const usable = (value, kind) => (value && !KNOWN_MISSING_PATHS.has(value) ? safeArchivePath(value, kind) : "");
  const sourceMd = usable(record.steps?.render?.file || "", "md");
  const sourcePdf = noPdf ? "" : usable(record.steps?.pdf?.file || "", "pdf");
  const englishMd = usable(record.steps?.render?.translation_file || "", "md");
  const englishPdf = noPdf ? "" : usable(record.steps?.["pdf-translation"]?.file || "", "pdf");
  // The moment each file was written, so the URL changes exactly when the file
  // does. `render` writes the Markdown and its translation together, so both
  // share its timestamp; the two PDFs are printed in separate passes.
  const renderedAt = record.steps?.render?.utc || "";
  const printedAt = record.steps?.pdf?.utc || "";
  const translatedAt = record.steps?.["pdf-translation"]?.utc || "";
  return {
    mdPath: englishMd || sourceMd,
    pdfPath: englishPdf || sourcePdf,
    mdVersion: renderedAt,
    pdfVersion: englishPdf ? translatedAt : printedAt,
    originalMdPath: englishMd ? sourceMd : "",
    originalPdfPath: englishPdf ? sourcePdf : "",
    originalPdfVersion: englishPdf ? printedAt : "",
    translated: Boolean(englishMd || englishPdf)
  };
}

function parseYearMarkdown(markdown, year, recordLookup, yearRecord = yearRecordFor(year), sourceGroups = {}) {
  const preliminary = yearRecord.status === "preliminary";
  let section = preliminary ? "candidate" : "other";
  let position = 0;
  const items = [];
  // A label may hold ESCAPED brackets - three 2024 nominees are titled
  // `\[EN\] ...` and `\[Quick note\] ...`. A label pattern of `[^\]]+` stops at
  // the escaped `]`, finds no `(` after it, and the whole bullet then parses as
  // having no links at all, so those three researches were missing from the page.
  const LINK_RE = /\[((?:[^\]\\]|\\.)+)\]\((?:<(https?:\/\/[^>\s]+)>|(https?:\/\/[^)\s]+))\)/g;

  let inContentRange = !yearRecord.contentStart;
  for (const [lineIndex, line] of markdown.split(/\r?\n/).entries()) {
    if (yearRecord.contentStart && line.trim() === yearRecord.contentStart) {
      inContentRange = true;
      continue;
    }
    if (inContentRange && yearRecord.contentEnd && line.trim() === yearRecord.contentEnd) break;
    if (!inContentRange) continue;
    if (/^##\s+Top 10/i.test(line)) section = "winner";
    if (/^##\s+Other nominations/i.test(line)) section = "other";
    if (!/^\s*-\s/.test(line)) continue;

    let body = line.replace(/^\s*-\s*/, "");
    const rankMatch = body.match(/\*\*#(\d+)\*\*/);
    const rank = rankMatch ? Number(rankMatch[1]) : null;
    if (rankMatch) body = body.replace(rankMatch[0], "");

    // Trailing editorial note — **(...)** or (** ... **); its links are
    // references, not part of this research.
    let note = "";
    const noteMatch = body.match(/(?:\*\*\((?!#)([^)]*)\)\*\*|\(\*\*(.*?)\*\*\))\s*$/);
    if (noteMatch) {
      note = compact((noteMatch[1] ?? noteMatch[2] ?? "").replace(LINK_RE, "$1"));
      body = body.slice(0, noteMatch.index);
    }

    // One bullet = one research; every markdown link on it belongs to it
    // (talk video + slides + whitepaper, part II, ...).
    const links = [];
    let firstIndex = -1;
    for (const m of body.matchAll(LINK_RE)) {
      const url = safeExternalUrl(m[2] || m[3]);
      if (!url) continue;
      if (firstIndex === -1) firstIndex = m.index;
      const record = recordLookup.get(normalizeUrl(url));
      links.push({ label: compact(m[1]), url, record, ...archivePathsFor(record) });
    }
    if (!links.length) continue;

    const lead = compact(body.slice(0, firstIndex)).replace(/^[-* ]+|[-*: ]+$/g, "");
    const title = lead.length >= 4 ? lead : links[0].label;
    const group = sourceGroups[`${year}.md:${lineIndex + 1}`];
    if (group) {
      const listed = new Set(links.map(link => normalizeUrl(link.url)));
      const members = [...group.sources].sort((a, b) => Number(b.id === group.main) - Number(a.id === group.main));
      links.length = 0;
      for (const source of members) {
        const url = safeExternalUrl(source.url);
        if (!url) continue;
        const record = recordLookup.get(normalizeUrl(url));
        const preserve = source.preservation !== "link-only";
        links.push({ label: source.label, url, record,
          ...archivePathsFor(preserve ? record : null), source,
          listed: listed.has(normalizeUrl(url)) || source.id === group.main });
      }
    }
    const originalUrl = links[0].url;
    const excluded = /excluded|held out/i.test(note) || /excluded|held out/i.test(body.slice(firstIndex));
    const record = links[0].record || links.find((link) => link.record)?.record;
    const topic = topicFor(title);
    // the reader opens the first preserved copy across the research's links
    const documentLink = links.find((link) => link.mdPath) || links.find((link) => link.pdfPath) || links[0];
    // The PDF can come from a different link than the Markdown, so its
    // original-language counterpart has to be read off that same link - pairing
    // it with the Markdown's link would offer the wrong document.
    const pdfLink = links.find((link) => link.pdfPath) || documentLink;
    const mdPath = documentLink.mdPath || "";
    const pdfPath = pdfLink.pdfPath || "";
    const originalMdPath = documentLink.originalMdPath || "";
    const originalPdfPath = pdfLink.originalPdfPath || "";
    // Read off the SAME link as the path each one versions.
    const mdVersion = documentLink.mdVersion || "";
    const pdfVersion = pdfLink.pdfVersion || "";
    const originalPdfVersion = pdfLink.originalPdfVersion || "";

    // Recordings are admitted for this story by the relationship builder.
    // Never inherit a background paper's talk or promote an embedded video
    // merely because its author, subject or page matches.
    const videos = [];
    const seenVideos = new Set();
    for (const link of links) {
      const video = link.source?.recording;
      if (link.source?.relation !== "same-work" || link.source?.kind !== "video" || video?.confidence !== "confirmed") continue;
      const url = safeExternalUrl(link.url);
      if (!url || seenVideos.has(url)) continue;
      seenVideos.add(url);
      videos.push({
        url,
        confidence: "confirmed",
        // Minutes are enough to show the reading-time commitment.
        ...(video.seconds ? { minutes: Math.round(video.seconds / 60) } : {}),
        ...(video.title ? { videoTitle: video.title } : {}),
        ...(video.channel ? { channel: video.channel } : {}),
        ...(video.conference ? { conference: video.conference } : {})
      });
    }

    items.push({
      id: `${year}-${position++}`,
      year,
      yearLabel: yearRecord.label || year,
      preliminary,
      provenance: yearRecord.provenance || "community-curated",
      line: lineIndex + 1,
      title,
      originalUrl,
      ...(group && normalizeUrl(group.identity) !== normalizeUrl(originalUrl) ? { identityUrl: group.identity } : {}),
      // An explicit allowlist: `record` is the whole manifest entry and must not
      // reach the shard. Translation keys are emitted only where they apply, so
      // the 72 translated references cost payload and the other 1,600 do not.
      links: links.map((link) => ({
        label: link.label,
        url: link.url,
        mdPath: link.mdPath,
        pdfPath: link.pdfPath,
        details: sourceDetailsFor(link.record, link.source),
        ...(link.source ? { sourceId: link.source.id, main: link.source.id === group.main, listed: link.listed } : {}),
        ...(link.mdVersion ? { mdVersion: link.mdVersion } : {}),
        ...(link.pdfVersion ? { pdfVersion: link.pdfVersion } : {}),
        ...(link.translated
          ? { originalMdPath: link.originalMdPath, originalPdfPath: link.originalPdfPath, originalPdfVersion: link.originalPdfVersion, translated: true }
          : {})
      })),
      note,
      rank,
      section,
      excluded,
      topic: topic.name,
      topicColor: topic.color,
      // Whoever published the document the reader can OPEN. The citation's own
      // link is often a talk the archive cannot keep, and naming its video host
      // attributes the research to YouTube rather than to Black Hat or the
      // author's own site.
      // The page's own <title> is NOT a publisher: probing a dead or taken-over
      // source records the error page's title, so that fallback printed
      // "404 Not Found", "wrong number (404)" and a squatter's gambling-site
      // name as the publisher of 16 references. The host is always honest.
      publisher: documentLink.record?.publisher || hostOf(documentLink.url),
      // WHO DID THE RESEARCH, where the archive knows. The publisher above is a
      // host for most references, and a host credits a domain rather than a
      // person: whole runs of nominations read as the work of a parked domain
      // that outlived the blog on it. Read off the same link as the publisher,
      // because it is the copy the reader opens. Emitted only where known, for
      // the payload reason above: a reference that names nobody looks exactly as
      // it did, and falls back to its publisher everywhere.
      ...(documentLink.record?.authors?.length
        ? { authors: creditList(documentLink.record.authors) }
        : {}),
      // WHAT THE SOURCE FOUND, in the archive's own words, and the controlled
      // tags that make it findable. Both are read out of the archived document
      // by a reviewer, because nothing mechanical can tell you a 40KB page is
      // about a parser differential. Taken from the same link as the byline -
      // the copy the reader opens - and emitted only where written, so the
      // 1,684-item payload does not carry a key per reference for a summary
      // nobody has got to yet.
      ...(documentLink.record?.digest?.text
        ? { summary: documentLink.record.digest.text }
        : {}),
      // The OWASP Top 10 categories ride along with the tags rather than in a
      // key of their own: they ARE tags, derived from the techniques by the
      // mapping in archived-references/tag-vocabulary.json, so `tag:owasp-a03-2021`
      // searches and the tag pills both work with no extra machinery. Empty in
      // the browser, where no mapping is injected - the build is what bakes them
      // in, exactly as it bakes in every other field here.
      ...(documentLink.record?.digest?.tags?.length
        ? { tags: withOwaspCategories(documentLink.record.digest.tags) }
        : {}),
      ...(videos.length ? { videos } : {}),
      kind: record?.kind || "link",
      language: record?.language || "",
      published: record?.published || "",
      grade: record?.grade || "",
      depth: record?.depth || "",
      health: record?.health?.status || "unknown",
      archiveStatus: mdPath && pdfPath ? "preserved" : mdPath || pdfPath ? "partial" : record?.health?.status === "ok" ? "live" : "missing",
      mdPath,
      pdfPath,
      ...(mdVersion ? { mdVersion } : {}),
      ...(pdfVersion ? { pdfVersion } : {}),
      // The Markdown hotlinks the publisher's images, because publishing 4,500
      // of them would double this repository. Where the archive holds its own
      // re-encoded copies they are printed into the PDF, so a picture the
      // reader cannot load has somewhere to send them. Emitted only where true,
      // for the same payload reason as the translation keys.
      ...(pdfLink.record?.steps?.images?.bytes > 0 ? { figuresInPdf: true } : {}),
      ...(originalMdPath || originalPdfPath
        ? { originalMdPath, originalPdfPath, originalPdfVersion, translated: true }
        : {}),
      archived: Boolean(mdPath || pdfPath),
      citedBy: record?.cited_by || [`${year}.md:${lineIndex + 1}`]
    });
  }

  return items;
}

// Public reading metadata only. Never serialize the manifest's evaluation or
// acquisition internals into a source detail response.
function sourceDetailsFor(record, source) {
  if (!record && !source) return {};
  record = record || {};
  const details = {};
  for (const key of ["title", "publisher", "published", "kind", "language"]) {
    if (typeof record[key] === "string" && record[key]) details[key] = record[key];
  }
  if (record.authors?.length) details.authors = creditList(record.authors);
  if (record.digest?.text) details.summary = record.digest.text;
  if (record.digest?.tags?.length) details.tags = withOwaspCategories(record.digest.tags);
  if (record.steps?.render?.utc) details.updated = record.steps.render.utc;
  const alsoAt = (record.also_at || []).map(safeExternalUrl).filter(Boolean);
  if (alsoAt.length) details.alsoAt = [...new Set(alsoAt)];
  if (source) {
    for (const key of ["title", "authors", "publisher", "published", "summary"]) {
      // An explicit empty author list withdraws a credit. Companion metadata
      // must not resurrect it; only a missing field permits the fallback.
      if (key === "authors" && Object.hasOwn(record, "authors")) continue;
      if (!details[key] && source[key]) details[key] = source[key];
    }
    details.relationship = source.relation;
    details.sourceKind = source.kind;
    details.preservation = source.preservation;
    if (source.reason) details.context = source.reason;
    if (source.sequence) details.sequence = source.sequence;
    if (source.channel) details.channel = source.channel;
    if (source.seconds) details.minutes = Math.round(source.seconds / 60);
  }
  return details;
}

const sourceDetailRequests = new Map();
const loadedSourceDetails = new Set();

async function ensureSourceDetails(year) {
  if (loadedSourceDetails.has(year)) return;
  if (sourceDetailRequests.has(year)) return sourceDetailRequests.get(year);
  const record = collectionSummaryFor(year);
  if (!record?.sources || record.sources.file !== `data/sources/${year}.json`) return;
  const request = (async () => {
    await ensureCollection(year);
    const response = await fetch(`${record.sources.file}?v=${encodeURIComponent(ARCHIVE_CATALOGUE.version)}`, { credentials: "same-origin", cache: "default" });
    if (!response.ok) throw new Error(`Source details returned ${response.status}`);
    const shard = await response.json();
    const items = itemsForYear(year);
    if (shard.schema !== 1 || shard.version !== ARCHIVE_CATALOGUE.version || shard.year !== year || !shard.items || typeof shard.items !== "object") throw new Error("Source details do not match this catalogue");
    // Validate the whole response before applying any part of it.
    for (const item of items) {
      const sources = shard.items[item.id];
      if (!Array.isArray(sources) || !sources.length || sources.length !== (item.sourceCount || item.links.length)
        || sources.some(source => !safeExternalUrl(source?.url) || !/^source-[a-f0-9]{20}$/.test(source.sourceId) || !source.details || typeof source.details !== "object" || Array.isArray(source.details))
        || new Set(sources.map(source => source.sourceId)).size !== sources.length
        || sources.filter(source => source.main).length !== 1
        || item.links.some(link => !sources.some(source => source.url === link.url))) throw new Error("Source details do not match this record");
    }
    for (const item of items) item.links = shard.items[item.id].map(source => ({
      url: source.url, label: source.label, details: { preservation: "archive", ...source.details },
      sourceId: source.sourceId, main: source.main === true,
      mdPath: safeArchivePath(source.mdPath, "md"), pdfPath: safeArchivePath(source.pdfPath, "pdf"),
      mdVersion: source.mdVersion || "", pdfVersion: source.pdfVersion || "",
      originalMdPath: safeArchivePath(source.originalMdPath, "md"), originalPdfPath: safeArchivePath(source.originalPdfPath, "pdf"),
      originalPdfVersion: source.originalPdfVersion || "", translated: Boolean(source.translated)
    })).sort((left, right) => Number(Boolean(right.main)) - Number(Boolean(left.main)));
    loadedSourceDetails.add(year);
  })();
  sourceDetailRequests.set(year, request);
  try { await request; } finally { sourceDetailRequests.delete(year); }
}

function sourceItemFor(item, index) {
  if (!Number.isInteger(index) || index < 0 || !item?.links?.[index]) return null;
  const link = item.links[index];
  const details = link.details || {};
  // Keep the research's identity/read state, but every document field belongs
  // to the selected source. A PDF-only companion must never borrow its sibling's MD.
  return {
    ...item, sourceIndex: index, sourceId: link.sourceId, title: details.title || link.label,
    originalUrl: link.url, authors: details.authors || [], publisher: details.publisher || hostOf(link.url),
    summary: details.summary || "", tags: details.tags || [], kind: details.kind || "link", language: details.language || "",
    mdPath: safeArchivePath(link.mdPath, "md"), pdfPath: safeArchivePath(link.pdfPath, "pdf"),
    mdVersion: link.mdVersion || (link.mdPath === item.mdPath ? item.mdVersion : ""),
    pdfVersion: link.pdfVersion || (link.pdfPath === item.pdfPath ? item.pdfVersion : ""),
    originalMdPath: safeArchivePath(link.originalMdPath, "md"), originalPdfPath: safeArchivePath(link.originalPdfPath, "pdf"),
    originalPdfVersion: link.originalPdfVersion || "", translated: Boolean(link.translated), links: [link]
  };
}

async function requestedSource(item, params) {
  if (!item || !params.has("source")) return item;
  const value = params.get("source");
  if (!/^(?:source-[a-f0-9]{20}|0|[1-9]\d*)$/.test(value)) return null;
  try { await ensureSourceDetails(item.year); } catch { /* Copies still open without optional metadata. */ }
  const index = value.startsWith("source-") ? item.links.findIndex(link => link.sourceId === value) : Number(value);
  return sourceItemFor(item, index);
}

function collectionSummaryFor(year) {
  return YEAR_RECORDS.find((record) => record.id === year) || null;
}

function archiveFieldTotal(field) {
  return YEAR_RECORDS.reduce((sum, record) => sum + Number(record?.[field] || 0), 0);
}

function collectionYearForItem(id) {
  const value = String(id || "");
  return [...YEAR_FILES].sort((a, b) => b.length - a.length).find((year) => value === year || value.startsWith(`${year}-`)) || "";
}

function collectionUrl(year) {
  const record = collectionSummaryFor(year);
  if (!record || !/^\d{4}(?:-\d{2}|-ai)?$/.test(record.id)) return "";
  const version = encodeURIComponent(String(ARCHIVE_CATALOGUE?.version || ""));
  return `data/collections/${record.id}.json?v=${version}`;
}

const ARCHIVE_LINK_ITEM_FIELDS = Object.freeze({
  label: "title", url: "originalUrl", mdPath: "mdPath", pdfPath: "pdfPath"
});
// Field order defines the wire bit positions. Append fields; keep existing
// positions stable so already cached collection shards still decode correctly.
const ARCHIVE_ITEM_DEFAULTS = Object.freeze({
  note: "", rank: null, excluded: false, kind: "article", language: "",
  published: "", grade: "research", depth: "full", health: "unknown",
  archiveStatus: "preserved", archived: true, section: "candidate"
});
const ARCHIVE_COLLECTION_DEFAULTS = Object.freeze({
  yearLabel: (item) => yearRecordFor(item.year)?.label || item.year,
  preliminary: (item) => yearRecordFor(item.year)?.status === "preliminary",
  provenance: (item) => yearRecordFor(item.year)?.provenance || "community-curated",
  citedBy: (item) => [`${item.year}.md:${item.line}`],
  topic: (item) => topicFor(item.title).name,
  topicColor: (item) => topicFor(item.title).color,
  publisher: (item) => {
    try { return new URL(item.originalUrl).hostname.replace(/^www\./, ""); }
    catch { return ""; }
  }
});

function compactArchiveItem(item) {
  const result = { ...item, links: (item.links || []).map((link) => {
    const compact = { ...link };
    const fromItem = Object.entries(ARCHIVE_LINK_ITEM_FIELDS)
      .filter(([field, itemField]) => typeof link[field] === "string" && link[field] === item[itemField])
      .map(([field]) => field);
    if (fromItem.length) {
      fromItem.forEach((field) => { delete compact[field]; });
      compact.fromItem = fromItem;
    }
    return compact;
  }) };
  let defaults = 0;
  Object.entries(ARCHIVE_ITEM_DEFAULTS).forEach(([field, value], index) => {
    if (Object.hasOwn(item, field) && item[field] === value) {
      delete result[field];
      defaults |= 1 << index;
    }
  });
  if (defaults) result.defaults = defaults;
  let collectionDefaults = 0;
  Object.entries(ARCHIVE_COLLECTION_DEFAULTS).forEach(([field, resolve], index) => {
    const resolved = resolve(item);
    const matches = Array.isArray(resolved)
      ? Array.isArray(item[field]) && item[field].length === resolved.length
        && item[field].every((value, valueIndex) => value === resolved[valueIndex])
      : item[field] === resolved;
    if (Object.hasOwn(item, field) && matches) {
      delete result[field];
      collectionDefaults |= 1 << index;
    }
  });
  if (collectionDefaults) result.collectionDefaults = collectionDefaults;
  // Markdown and PDF copies normally share a collection and filename stem.
  // Store that relationship once while leaving exceptional paths explicit.
  if (/^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/.test(item.mdPath || "")
      && item.pdfPath === item.mdPath.replace("/md/", "/pdf/").replace(/\.md$/, ".pdf")) {
    delete result.pdfPath;
    result.pdfFromMd = true;
  }
  return result;
}

function expandArchiveItem(item) {
  if (Object.hasOwn(item, "pdfFromMd")) {
    if (item.pdfFromMd !== true || Object.hasOwn(item, "pdfPath")
        || !/^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/.test(item.mdPath || "")) {
      throw new Error("Invalid shared archive PDF path");
    }
    item = { ...item, pdfPath: item.mdPath.replace("/md/", "/pdf/").replace(/\.md$/, ".pdf") };
    delete item.pdfFromMd;
  }
  if (Object.hasOwn(item, "defaults")) {
    const values = Object.entries(ARCHIVE_ITEM_DEFAULTS);
    if (!Number.isInteger(item.defaults) || item.defaults < 1 || item.defaults >= 2 ** values.length) {
      throw new Error("Invalid archive item defaults");
    }
    const expanded = { ...item };
    values.forEach(([field, value], index) => {
      if (item.defaults & (1 << index)) {
        if (Object.hasOwn(item, field)) throw new Error("Conflicting archive item default");
        expanded[field] = value;
      }
    });
    delete expanded.defaults;
    item = expanded;
  }
  if (Object.hasOwn(item, "collectionDefaults")) {
    const values = Object.entries(ARCHIVE_COLLECTION_DEFAULTS);
    if (!Number.isInteger(item.collectionDefaults) || item.collectionDefaults < 1 || item.collectionDefaults >= 2 ** values.length) {
      throw new Error("Invalid archive collection defaults");
    }
    const expanded = { ...item };
    values.forEach(([field, resolve], index) => {
      if (item.collectionDefaults & (1 << index)) {
        if (Object.hasOwn(item, field)) throw new Error("Conflicting archive collection default");
        expanded[field] = resolve(item);
      }
    });
    delete expanded.collectionDefaults;
    item = expanded;
  }
  return { ...item, links: (item.links || []).map((link) => {
    if (!Array.isArray(link.fromItem)) return link;
    const expanded = { ...link };
    for (const field of link.fromItem) {
      if (!Object.hasOwn(ARCHIVE_LINK_ITEM_FIELDS, field)
          || typeof item[ARCHIVE_LINK_ITEM_FIELDS[field]] !== "string") {
        throw new Error("Invalid shared archive link field");
      }
      expanded[field] = item[ARCHIVE_LINK_ITEM_FIELDS[field]];
    }
    delete expanded.fromItem;
    return expanded;
  }) };
}

function applyStoredState(item) {
  item = expandArchiveItem(item);
  // The keys are deterministic, so reconstruct them instead of repeating them
  // (and two default-false flags) in every generated collection record.
  const lookupKey = normalizeUrl(item.identityUrl || item.originalUrl);
  item.readKey = lookupKey;
  item.favouriteKey = lookupKey;
  item.read = state.readKeys.has(lookupKey);
  item.favourite = state.favouriteKeys.has(lookupKey);
  return item;
}

async function ensureCollection(year) {
  if (loadedCollections.has(year)) return itemsForYear(year);
  if (collectionRequests.has(year)) return collectionRequests.get(year);
  const record = collectionSummaryFor(year);
  const url = collectionUrl(year);
  if (!record || !url) throw new Error(`Unknown archive collection: ${year}`);

  const request = (async () => {
    const response = await fetch(url, { credentials: "same-origin", cache: "default" });
    if (!response.ok) throw new Error(`${year} collection returned ${response.status}`);
    const shard = await response.json();
    if (shard?.schema !== 1 || shard.version !== ARCHIVE_CATALOGUE.version || shard.collection?.id !== year || !Array.isArray(shard.items)) {
      throw new Error(`${year} collection does not match catalogue ${ARCHIVE_CATALOGUE.version}`);
    }
    if (shard.items.length !== Number(record.count) || shard.items.some((item) => item?.year !== year || typeof item?.id !== "string")) {
      throw new Error(`${year} collection failed its count or record validation`);
    }
    const items = shard.items.map(applyStoredState);
    state.items = state.items.filter((item) => item.year !== year).concat(items);
    loadedCollections.add(year);
    updateReadingProgress();
    updateFavouriteCount();
    return items;
  })();
  collectionRequests.set(year, request);
  try {
    return await request;
  } finally {
    collectionRequests.delete(year);
  }
}

async function ensureAllCollections() {
  await Promise.all(YEAR_FILES.map(ensureCollection));
  return state.items;
}

async function ensureItemLoaded(id) {
  const existing = state.items.find((item) => item.id === id);
  if (existing) return existing;
  const year = collectionYearForItem(id);
  if (!year) return null;
  await ensureCollection(year);
  return state.items.find((item) => item.id === id) || null;
}

function shouldPrefetchArchive() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return !connection?.saveData && !/^(slow-)?2g$/.test(connection?.effectiveType || "");
}

function scheduleArchivePrefetch() {
  if (!shouldPrefetchArchive()) return;
  const queue = YEAR_FILES.filter((year) => !loadedCollections.has(year));
  const schedule = window.requestIdleCallback
    ? (callback) => window.requestIdleCallback(callback, { timeout: 2500 })
    : (callback) => setTimeout(callback, 800);
  const next = () => {
    const year = queue.shift();
    if (!year) return;
    ensureCollection(year).then(() => {
      if (state.query) updateGlobalSearch();
      if (state.view === "favourites" && !queue.length) renderFavourites();
    }).catch((error) => console.warn(`Background archive load failed for ${year}:`, error)).finally(() => schedule(next));
  };
  schedule(next);
}

async function loadArchive() {
  const bootStatus = $("#boot-status");
  try {
    bootStatus.textContent = "Reading the progressive archive catalogue…";
    const catalogueResponse = await fetch("data/catalogue.json", { credentials: "same-origin", cache: "no-cache" });
    if (!catalogueResponse.ok) throw new Error(`Archive catalogue returned ${catalogueResponse.status}`);
    const catalogue = await catalogueResponse.json();
    const catalogueYears = Array.isArray(catalogue?.years) ? catalogue.years : [];
    const validIds = catalogueYears.map((record) => record?.id).filter((id) => typeof id === "string" && /^\d{4}(?:-\d{2}|-ai)?$/.test(id));
    if (catalogue?.schema !== 1 || typeof catalogue.version !== "string" || !validIds.length || validIds.length !== catalogueYears.length || new Set(validIds).size !== validIds.length) {
      throw new Error("Archive catalogue is empty or invalid");
    }
    ARCHIVE_CATALOGUE = catalogue;
    YEAR_RECORDS = catalogueYears;
    YEAR_FILES = validIds;
    LARGE_PDF_FALLBACKS = new Map(Object.entries(catalogue?.hosting?.largePdfFallbacks || {}).flatMap(([path, value]) => {
      const safePath = safeArchivePath(path, "pdf");
      const safeUrl = safeExternalUrl(value);
      return safePath && safeUrl?.startsWith("https://") ? [[safePath, safeUrl]] : [];
    }));
    state.archiveTotal = Number(catalogue.total) || YEAR_RECORDS.reduce((sum, record) => sum + Number(record.count || 0), 0);
    state.manifestCount = Number(catalogue.manifestCount) || 0;
    const newestRecords = newestFirstYearRecords();
    const latestFinal = newestRecords.find((record) => record.status === "final")?.id || newestRecords[0]?.id;
    state.year = latestFinal;
    state.starYear = latestFinal;
    state.signalYear = latestFinal;

    const requestedDocument = new URLSearchParams(location.search);
    const requestedTheme = requestedDocument.get("theme");
    if (["light", "dark"].includes(requestedTheme)) state.readingTheme = requestedTheme;
    const [hashView, sharedArtifact] = location.hash.replace("#", "").split("/");
    const requestedView = resolveViewHash(hashView);
    if (requestedView) {
      state.view = requestedView.view;
      if (requestedView.savedMode) state.savedMode = requestedView.savedMode;
    }
    const readerId = requestedDocument.get("reader");
    const pdfId = requestedDocument.get("pdf");
    const initialDocument = readerId || pdfId || sharedArtifact;
    const initialYear = collectionYearForItem(initialDocument) || latestFinal;

    bootStatus.textContent = `Opening ${yearLabel(initialYear)}…`;
    await ensureCollection(initialYear);
    if (state.view === "favourites") await ensureAllCollections();
    $("#sidebar-count").textContent = state.archiveTotal.toLocaleString();
    updateReadingProgress();
    updateFavouriteCount();

    wireShell();
    applyReadingTheme();
    render();
    $("#app-shell").hidden = false;
    await restoreArchiveRoute();
    requestAnimationFrame(() => $("#boot-screen").classList.add("done"));
    setTimeout(() => $("#boot-screen").remove(), 700);
    scheduleArchivePrefetch();
  } catch (error) {
    console.error(error);
    bootStatus.innerHTML = `The archive could not be loaded. Serve the <strong>repository root</strong> with <code>python3 -m http.server 4173</code>, then open <code>/website/</code>.<br><br><small>${h(error.message)}</small>`;
  }
}

function setMobileMenuOpen(open) {
  const compact = window.matchMedia("(max-width: 820px)").matches;
  const isOpen = compact && Boolean(open);
  document.body.classList.toggle("menu-open", isOpen);
  const trigger = $("#mobile-menu");
  $("#concept-sidebar").toggleAttribute("inert", compact && !isOpen);
  trigger.setAttribute("aria-expanded", String(isOpen));
  trigger.setAttribute("aria-label", isOpen ? "Close themes menu" : "Choose from 8 archive themes");
  $(".workspace").inert = isOpen;
  const sidebar = $("#concept-sidebar");
  if (isOpen) {
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    if (!$("#global-results").hidden) closeGlobalSearch();
    focusWithoutScroll($(".nav-item.active"));
    sidebar.scrollTop = 0;
  } else {
    sidebar.removeAttribute("role");
    sidebar.removeAttribute("aria-modal");
  }
}

function wireShell() {
  // Theme fonts, safe-area insets and the mobile chooser all affect this height.
  // Keep search results and sticky filters below the actual header.
  new ResizeObserver(([entry]) => {
    document.documentElement.style.setProperty("--topbar-height", `${entry.target.getBoundingClientRect().height}px`);
  }).observe($(".topbar"));
  $("#discovery-appearance").addEventListener("click", handleDiscoveryClick);
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

  setMobileMenuOpen(false);
  $("#mobile-menu").addEventListener("click", () => {
    setMobileMenuOpen(!document.body.classList.contains("menu-open"));
  });
  $("#mobile-menu-backdrop").addEventListener("click", () => {
    setMobileMenuOpen(false);
    focusWithoutScroll($("#mobile-menu"));
  });
  $("#close-mobile-menu").addEventListener("click", () => {
    setMobileMenuOpen(false);
    focusWithoutScroll($("#mobile-menu"));
  });
  // Every actionable route in the shared drawer dismisses it, including the
  // project links and Resume button that do not go through setView().
  $("#concept-sidebar").addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !document.body.classList.contains("menu-open")) return;
    const controls = $$("#concept-sidebar a, #concept-sidebar button").filter((el) => el.getClientRects().length && !el.disabled);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  $("#concept-sidebar").addEventListener("click", (event) => {
    if (event.target.closest("a, button")) setMobileMenuOpen(false);
  });
  window.matchMedia("(max-width: 820px)").addEventListener("change", () => setMobileMenuOpen(false));

  $("#global-search").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    updateGlobalSearch();
    if (state.query) {
      const query = state.query;
      ensureAllCollections().then(() => {
        if (state.query === query) updateGlobalSearch();
      }).catch((error) => toast(`The full search index could not be loaded: ${error.message}`));
    }
  });
  $("#global-search").addEventListener("focus", updateGlobalSearch);
  $("#close-global-results").addEventListener("click", closeGlobalSearch);
  document.addEventListener("pointerdown", (event) => {
    const panel = $("#global-results");
    if (!panel.hidden && !event.target.closest?.("#global-results, .global-search")) closeGlobalSearch();
  });
  $("#global-results-list").addEventListener("click", (event) => {
    const target = event.target.closest("[data-artifact]");
    if (!target) return;
    hideGlobalResults();
    openArtifact(target.dataset.artifact);
  });
  $("#artifact-digest").addEventListener("click", handleArtifactTagClick);
  $("#artifact-previous").addEventListener("click", () => navigateArtifact(-1));
  $("#artifact-next").addEventListener("click", () => navigateArtifact(1));
  $("#artifact-dialog").addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing
      || !["ArrowLeft", "ArrowRight"].includes(event.key)
      || event.target.closest("input, textarea, select, [contenteditable], video, audio, iframe, [role='slider'], [role='tablist']")
      || !canNavigateArtifact()) return;
    event.preventDefault();
    if (!event.repeat) navigateArtifact(event.key === "ArrowLeft" ? -1 : 1);
  });

  $("#random-artifact").addEventListener("click", async () => {
    let offset = Math.floor(Math.random() * Math.max(1, state.archiveTotal));
    const record = YEAR_RECORDS.find((entry) => {
      offset -= Number(entry.count || 0);
      return offset < 0;
    }) || YEAR_RECORDS.at(-1);
    const items = await ensureCollection(record.id);
    const item = items[Math.floor(Math.random() * items.length)];
    if (item) openArtifact(item.id);
  });

  applyMotionPreference();
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", applyMotionPreference);
  $("#motion-toggle").addEventListener("click", () => {
    state.motionReduced = !state.motionReduced;
    try { localStorage.setItem(MOTION_STORAGE_KEY, String(state.motionReduced)); }
    catch { toast("Motion preference could not be saved in this browser"); }
    document.body.classList.toggle("reduce-motion", state.motionReduced);
    document.documentElement.classList.toggle("reduce-motion", state.motionReduced);
    $("#motion-toggle").setAttribute("aria-pressed", String(state.motionReduced));
    toast(state.motionReduced ? "Ambient motion reduced" : "Ambient motion restored");
  });

  $$("[data-contribute]").forEach((button) => button.addEventListener("click", () => {
    setMobileMenuOpen(false);
    openSubmissionDialog();
  }));
  ["#contribute-url", "#contribute-research-title", "#contribute-year", "#contribute-authors", "#contribute-why"]
    .forEach((selector) => $(selector).addEventListener("input", scheduleSubmissionCheck));
  $("#contribute-is-author").addEventListener("change", () => {
    $("#contribute-issue").href = submissionIssueUrl(submissionDraft());
  });
  $("#contribute-check").addEventListener("click", (event) => {
    const target = event.target.closest("[data-artifact]");
    if (!target) return;
    // One modal at a time: the record answers the question the check raised, and
    // the form is one click from being reopened with everything still typed in.
    $("#contribute-dialog").close();
    openArtifact(target.dataset.artifact);
  });
  $("#contribute-copy").addEventListener("click", copySubmissionDraft);

  $("#view-fullscreen").addEventListener("click", toggleViewFullscreen);
  $("#site-fullscreen").addEventListener("click", toggleSiteFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreenControls);
  document.addEventListener("webkitfullscreenchange", syncFullscreenControls);

  $("#browse-unread").addEventListener("click", async () => {
    await ensureAllCollections();
    const unread = state.items.filter((item) => !item.read);
    if (unread.length) openArtifact(unread[Math.floor(Math.random() * unread.length)].id);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/input|select|textarea/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      $("#global-search").focus();
    }
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMobileMenuOpen(false);
      $("#mobile-menu").focus();
    } else if (event.key === "Escape" && viewFullscreenFallbackActive()) {
      setViewFullscreenFallback(false);
      syncFullscreenControls();
    } else if (event.key === "Escape" && !$("#global-results").hidden) closeGlobalSearch();
  });

  const navigate = () => {
    finishDocumentDismissal?.();
    documentDismissal = finishDocumentDismissal = null;
    restoreArchiveRoute().catch((error) => toast(`The shared document could not be opened: ${error.message}`));
  };
  window.addEventListener("popstate", navigate);
  window.addEventListener("hashchange", navigate);

  $("#view-root").addEventListener("click", handleViewClick);
  $("#view-root").addEventListener("input", handleDiscoveryInput);
  $("#view-root").addEventListener("keydown", (event) => {
    const artifactTarget = event.target.closest("[data-artifact]");
    if (artifactTarget && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openArtifact(artifactTarget.dataset.artifact);
    }
  });
  $("#view-root").addEventListener("pointerover", (event) => {
    const book = event.target.closest?.(".book");
    if (book) showShelfPlate(book);
    else hideShelfPlates();
  });
  $("#view-root").addEventListener("pointerleave", () => hideShelfPlates());
  $("#view-root").addEventListener("focusin", (event) => {
    const book = event.target.closest?.(".book");
    if (book) showShelfPlate(book);
    else hideShelfPlates();
  });
  $("#view-root").addEventListener("scroll", trackShelfScroll, true);
  $("#reader-scroll").addEventListener("scroll", (event) => {
    const element = event.currentTarget;
    const progress = element.scrollTop / Math.max(1, element.scrollHeight - element.clientHeight);
    $("#reader-progress-bar").style.width = `${clampNumber(progress * 100, 0, 100)}%`;
  });
  $("#reader-toc").addEventListener("click", (event) => {
    const target = event.target.closest("[data-reader-target]");
    if (target) $("#reader-content").querySelector(`#${CSS.escape(target.dataset.readerTarget)}`)?.scrollIntoView({ behavior: state.motionReduced ? "instant" : "smooth", block: "start" });
  });
  $("#reader-dialog").addEventListener("close", () => {
    if ($("#reader-dialog").open) return;
    readerRequestToken++;
    state.readerItem = null;
  });

  // The report form opens from ON TOP of the record dialog, so closing it must
  // not restore the search panel - the record is still open behind it.
  ["#artifact-dialog", "#reader-dialog", "#pdf-dialog", "#contribute-dialog",
   "#report-dialog"].forEach((id) => {
    wireDialogDismissal($(id));
    $(id).addEventListener("close", () => {
      syncDialogScrollLock();
      // Finish iframe/player cleanup before requesting a history traversal.
      if (["#artifact-dialog", "#reader-dialog", "#pdf-dialog"].includes(id)) queueMicrotask(dismissDocumentHistory);
      if (id !== "#contribute-dialog" && id !== "#report-dialog") requestAnimationFrame(restoreGlobalSearch);
    });
  });
  // Dismissing a modal only hides it. An iframe inside a hidden dialog keeps
  // running, so closing a record with the talk playing left the reader with no
  // picture, no controls and the sound still going.
  $("#artifact-dialog").addEventListener("close", () => {
    if (!$("#artifact-dialog").open) stopTalkPlayback();
  });

  window.addEventListener("message", (event) => {
    const frame = $("#pdf-frame");
    if (event.origin !== PDF_READER_ORIGIN || event.source !== frame.contentWindow || event.data?.type !== "pdf-reader-loaded") return;
    if (!state.pdfPath || !state.pdfUsesInSiteReader || !state.pdfFrameUrl || frame.src !== state.pdfFrameUrl) return;
    clearTimeout(pdfLoadTimer);
    $("#pdf-loading").hidden = true;
    $("#pdf-fallback").hidden = true;
    frame.hidden = false;
    frame.contentWindow?.postMessage({ type: "pdf-reader-theme", theme: state.readingTheme, palette: isDiscoveryView() ? state.view : "" }, PDF_READER_ORIGIN);
  });
  $("#pdf-dialog").addEventListener("close", clearPdfViewer);
  $("#pdf-dialog").addEventListener("cancel", (event) => {
    if ($("#pdf-links").hidden) return;
    event.preventDefault();
    closePdfLinksAndRestoreFocus();
  });
  $("#pdf-links-toggle").addEventListener("click", () => togglePdfLinks());
  $("#pdf-links-close").addEventListener("click", closePdfLinksAndRestoreFocus);
  $("#pdf-links-backdrop").addEventListener("click", closePdfLinksAndRestoreFocus);
  $("#pdf-fit-width").addEventListener("click", () => setPdfView("page-width"));
  $("#pdf-fit-page").addEventListener("click", () => setPdfView("page-fit"));
  $("#pdf-read-toggle").addEventListener("click", () => {
    if (state.pdfItem) setReadState(state.pdfItem);
  });
  $("#pdf-favourite-toggle").addEventListener("click", () => {
    if (state.pdfItem) setFavouriteState(state.pdfItem);
  });
  $("#pdf-open-markdown").addEventListener("click", () => {
    const item = state.pdfItem;
    if (!item?.mdPath) return;
    $("#pdf-dialog").close();
    openReader(item);
  });
  $("#pdf-sources").addEventListener("click", async () => {
    if (state.pdfItem) await openSourceDetails(state.pdfItem);
  });
  $("#pdf-theme-toggle").addEventListener("click", toggleReadingTheme);
  $("#pdf-share").addEventListener("click", () => shareDocument(state.pdfItem, state.pdfKind === "listingPdf" ? "results" : "pdf"));
}

function toggleInSet(set, value) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return set;
}

async function handleViewClick(event) {
  if (handleDiscoveryClick(event)) return;
  const roomFilterTarget = event.target.closest("[data-room-filter]");
  if (roomFilterTarget) {
    applyRoomFilter(roomFilterTarget.dataset.roomFilter);
    return;
  }

  const favouriteTarget = event.target.closest("[data-favourite]");
  if (favouriteTarget) {
    const item = state.items.find((entry) => entry.id === favouriteTarget.dataset.favourite);
    if (item) setFavouriteState(item);
    return;
  }

  const unreadTarget = event.target.closest("[data-saved-unread]");
  if (unreadTarget) {
    const item = state.items.find((entry) => entry.id === unreadTarget.dataset.savedUnread);
    if (item) setReadState(item, false);
    return;
  }

  const artifactTarget = event.target.closest("[data-artifact]");
  if (artifactTarget) {
    if (artifactTarget.dataset.dragged === "true") {
      artifactTarget.dataset.dragged = "";
      return;
    }
    openArtifact(artifactTarget.dataset.artifact);
    return;
  }

  const yearTarget = event.target.closest("[data-year]");
  if (yearTarget) {
    await selectArchiveYear(yearTarget.dataset.year);
    return;
  }

  const topicTarget = event.target.closest("[data-topic-filter]");
  if (topicTarget) {
    state.starTopic = topicTarget.dataset.topicFilter;
    render();
    return;
  }

  const starStatusTarget = event.target.closest("[data-star-status]");
  if (starStatusTarget) {
    state.starStatus = starStatusTarget.dataset.starStatus;
    render();
    return;
  }

  // Survives a change of topic, year or standing, exactly as the observatory's
  // does: a reader flying across years to see what was presented should not
  // have to re-press it at every stop.
  if (event.target.closest("[data-star-recorded]")) {
    state.starRecordedOnly = !state.starRecordedOnly;
    render();
    return;
  }

  const signalTopicTarget = event.target.closest("[data-signal-topic]");
  if (signalTopicTarget) {
    const topic = signalTopicTarget.dataset.signalTopic;
    if (topic === "all" || TOPICS.some((entry) => entry.name === topic)) state.signalTopic = topic;
    state.signalStatus = "all";
    state.signalVisibleCount = 12;
    render();
    return;
  }

  const signalYearTarget = event.target.closest("[data-signal-year]");
  if (signalYearTarget && YEAR_FILES.includes(signalYearTarget.dataset.signalYear)) {
    await selectArchiveYear(signalYearTarget.dataset.signalYear);
    return;
  }

  const signalStatusTarget = event.target.closest("[data-signal-status]");
  if (signalStatusTarget && ["all", "top10", "nominee"].includes(signalStatusTarget.dataset.signalStatus)) {
    state.signalStatus = signalStatusTarget.dataset.signalStatus;
    state.signalVisibleCount = 12;
    render();
    return;
  }

  // Not cleared by the topic, year or standing controls above, unlike
  // `signalStatus`: those three answer "which records", and this answers
  // "which of them was filmed". A reader tuning across years to see what was
  // presented should not have to re-press it at every stop.
  if (event.target.closest("[data-signal-recorded]")) {
    state.signalRecordedOnly = !state.signalRecordedOnly;
    state.signalVisibleCount = 12;
    render();
    return;
  }

  if (event.target.closest("[data-signal-more]")) {
    state.signalVisibleCount += 12;
    render();
    return;
  }

  const savedModeTarget = event.target.closest("[data-saved-mode]");
  if (savedModeTarget) {
    setSavedMode(savedModeTarget.dataset.savedMode);
    return;
  }

  const savedYearTarget = event.target.closest("[data-saved-year]");
  if (savedYearTarget) {
    const year = savedYearTarget.dataset.savedYear;
    const years = new Set(state.savedYears);
    if (year === "all") years.clear();
    else if (YEAR_FILES.includes(year)) toggleInSet(years, year);
    await selectArchiveYear([...years].sort().join(",") || "all");
    return;
  }

  const savedTopicTarget = event.target.closest("[data-saved-topic]");
  if (savedTopicTarget) {
    const topic = savedTopicTarget.dataset.savedTopic;
    if (topic === "all") state.savedTopics.clear();
    else if (TOPICS.some((entry) => entry.name === topic)) toggleInSet(state.savedTopics, topic);
    render();
    return;
  }

  if (event.target.closest("[data-saved-clear]")) {
    await selectArchiveYear("all");
    state.savedTopics.clear();
    render();
    return;
  }

}

// Route names are looked up with hasOwn: a plain `VIEWS[name]` also answers for
// every inherited Object.prototype key, so `#__proto__` or `#constructor` would
// pass the guard and then break rendering.
function isViewName(value) {
  return typeof value === "string" && Object.hasOwn(VIEWS, value);
}

function resolveViewHash(value) {
  const name = String(value || "");
  if (isViewName(name)) return { view: name };
  if (Object.hasOwn(VIEW_HASHES, name)) return { ...VIEW_HASHES[name] };
  return null;
}

function viewHash(view = state.view) {
  if (view !== "favourites") return view;
  return state.savedMode === "read" ? "read" : state.savedMode === "all" ? "saved" : "favourites";
}

function viewCopy(view = state.view) {
  if (view === "favourites") {
    return Object.hasOwn(SAVED_VIEW_COPY, state.savedMode) ? SAVED_VIEW_COPY[state.savedMode] : SAVED_VIEW_COPY.favourites;
  }
  return isViewName(view) ? VIEWS[view] : VIEWS.evidence;
}

function setSavedMode(mode) {
  if (!SAVED_MODES.includes(mode) || mode === state.savedMode) return;
  rememberArchiveYear();
  state.savedMode = mode;
  history.pushState({ archiveYear: selectedArchiveYear() }, "", archiveViewUrl());
  handledRouteUrl = location.href;
  render();
}

async function setView(view, updateHash = true) {
  if (!isViewName(view)) return;
  if (documentDismissal) await documentDismissal;
  if (updateHash) { rememberArchiveYear(); ++routeRevision; restoringRoute = 0; closeDocumentDialogs(); }
  if (constellationExperience) {
    constellationExperience.destroy();
    constellationExperience = null;
  }
  destroyInvestigationLayout();
  state.view = view;
  setMobileMenuOpen(false);
  if (updateHash) {
    const url = new URL(archiveViewUrl());
    url.searchParams.delete("year");
    history.pushState({ archiveYear: selectedArchiveYear() }, "", url.href);
    handledRouteUrl = location.href;
  }
  render();
  if (updateHash) {
    // A selected route starts at its controls, even after reading far down
    // another view. Move focus out of the now-inert mobile drawer too.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    $("#main-content").scrollTo({ top: 0, left: 0, behavior: "instant" });
    focusWithoutScroll($("#main-content"));
  }
  if (view === "favourites" && loadedCollections.size !== YEAR_FILES.length) {
    await ensureAllCollections();
    if (state.view === view) renderFavourites();
  }
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function fullscreenAvailable(target = document.documentElement) {
  return Boolean(target && (target.requestFullscreen || target.webkitRequestFullscreen));
}

function viewFullscreenFallbackActive() {
  return $("#main-content")?.classList.contains("view-fullscreen-fallback") || false;
}

function setViewFullscreenFallback(active) {
  const target = $("#main-content");
  target?.classList.toggle("view-fullscreen-fallback", Boolean(active));
  document.body.classList.toggle("view-fullscreen-fallback-open", Boolean(active));
}

function updateFullscreenButton(button, active, title) {
  if (!button) return;
  button.setAttribute("aria-pressed", String(active));
  button.innerHTML = active
    ? '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/></svg><span class="action-label">Exit full screen</span>'
    : '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg><span class="action-label">Full screen</span>';
  button.title = active ? "Exit full screen" : title;
}

function syncFullscreenControls() {
  const current = fullscreenElement();
  const active = Boolean(current);
  const siteButton = $("#site-fullscreen");
  siteButton.hidden = !fullscreenAvailable(document.documentElement);
  updateFullscreenButton(siteButton, active, "Fill the screen with the complete website");

  const viewButton = $("#view-fullscreen");
  const supportedView = FULLSCREEN_VIEWS.has(state.view);
  // Focus mode is a safe CSS fallback when a browser exposes no Fullscreen API
  // (or refuses it because of browser UI policy). Every real archive view keeps
  // the control, including the Museum and Library reading views.
  viewButton.hidden = !supportedView;
  updateFullscreenButton(viewButton, active || viewFullscreenFallbackActive(), "Fill the screen with this archive mode");
}

async function requestFullscreen(target) {
  if (target?.requestFullscreen) await target.requestFullscreen({ navigationUI: "hide" });
  else if (target?.webkitRequestFullscreen) await target.webkitRequestFullscreen();
}

async function exitFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (exit) await exit.call(document);
}

async function toggleSiteFullscreen() {
  try {
    if (viewFullscreenFallbackActive()) setViewFullscreenFallback(false);
    if (fullscreenElement()) await exitFullscreen();
    else await requestFullscreen(document.documentElement);
  } catch (error) {
    toast(`Full screen is unavailable: ${error.message}`);
  }
  syncFullscreenControls();
}

async function toggleViewFullscreen() {
  const target = $("#main-content");
  if (viewFullscreenFallbackActive()) {
    setViewFullscreenFallback(false);
    syncFullscreenControls();
    return;
  }
  try {
    if (fullscreenElement()) await exitFullscreen();
    else if (FULLSCREEN_VIEWS.has(state.view) && fullscreenAvailable(target)) await requestFullscreen(target);
    else if (FULLSCREEN_VIEWS.has(state.view)) setViewFullscreenFallback(true);
  } catch (error) {
    // A rejected native request still gets a full-window, scrollable mode. It
    // does not claim access to browser chrome; it only keeps the archive usable.
    setViewFullscreenFallback(true);
    toast("Browser full screen was unavailable; using full-window focus mode");
  }
  syncFullscreenControls();
}

function applyReadingTheme() {
  const light = state.readingTheme === "light";
  [$("#reader-dialog"), $("#pdf-dialog")].filter(Boolean).forEach((dialog) => {
    dialog.dataset.readingTheme = state.readingTheme;
  });
  [$("#reader-theme-toggle"), $("#pdf-theme-toggle")].filter(Boolean).forEach((button) => {
    button.classList.toggle("is-light", light);
    button.textContent = light ? "☾ Dark" : "☀ Light";
    button.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} reading theme`);
    button.title = button.id === "pdf-theme-toggle"
      ? "Changes the viewer controls and surround; PDF page colours remain original"
      : `Switch to ${light ? "dark" : "light"} reading theme`;
  });
}

function toggleReadingTheme() {
  state.readingTheme = state.readingTheme === "light" ? "dark" : "light";
  try { localStorage.setItem(READING_THEME_STORAGE_KEY, state.readingTheme); }
  catch { toast("Reading theme could not be saved in this browser"); }
  applyReadingTheme();
  if ($("#pdf-dialog").open && state.pdfUsesInSiteReader) {
    $("#pdf-frame").contentWindow?.postMessage({ type: "pdf-reader-theme", theme: state.readingTheme, palette: isDiscoveryView() ? state.view : "" }, PDF_READER_ORIGIN);
  }
  if ($("#reader-dialog").open && state.readerItem) syncDocumentUrl(state.readerItem, "reader");
  else if ($("#pdf-dialog").open) syncDocumentUrl(state.pdfItem, state.pdfKind === "listingPdf" ? "results" : "pdf");
  toast(`${state.readingTheme === "light" ? "Light" : "Dark"} reading theme`);
}

// These controls are replaced when a view redraws. Keep keyboard navigation on
// the selected control, or its group when a reset removes the original button.
function captureViewFocus() {
  const active = document.activeElement;
  if (!$("#view-root")?.contains(active)) return null;
  const attribute = ["data-year", "data-room-filter", "data-topic-filter", "data-star-status",
    "data-star-recorded", "data-signal-topic", "data-signal-year", "data-signal-status",
    "data-signal-recorded", "data-saved-mode", "data-saved-year", "data-saved-topic"]
    .find((name) => active.hasAttribute(name));
  return attribute ? { attribute, value: active.getAttribute(attribute) } : null;
}

function restoreViewFocus(focus) {
  if (!focus) return;
  const controls = $$(`#view-root [${focus.attribute}]`);
  const target = controls.find((control) => control.getAttribute(focus.attribute) === focus.value)
    || controls.find((control) => !control.disabled);
  if (target) focusWithoutScroll(target);
}

function render() {
  const focus = captureViewFocus();
  const copy = viewCopy();
  // The document-level palette also owns native controls such as scrollbars.
  // Set it before rendering so a room change has no one-frame colour mismatch.
  document.documentElement.dataset.view = state.view;
  updateDiscoveryAppearance();
  $("#view-kicker").textContent = copy.kicker;
  $("#view-mode").textContent = copy.title;
  $("#view-description").textContent = copy.description;
  $("#discovery-appearance").hidden = !isDiscoveryView();
  $("#discovery-appearance").innerHTML = isDiscoveryView() ? discoveryAppearance() : "";
  document.title = SITE_DOCUMENT_TITLE;
  $$(".nav-item").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  $("#mobile-current-theme").textContent = $(".nav-item.active strong").textContent;

  const renderers = {
    desk: renderDiscovery,
    time: renderDiscovery,
    museum: renderMuseum,
    library: renderLibrary,
    signals: renderSignals,
    constellation: renderConstellation,
    terminal: renderTerminal,
    evidence: renderEvidence,
    favourites: renderFavourites
  };
  (Object.hasOwn(renderers, state.view) ? renderers[state.view] : renderMuseum)();
  restoreViewFocus(focus);
  syncFullscreenControls();
}

function updateGlobalSearch() {
  const panel = $("#global-results");
  const results = state.query ? queryItems(state.items, state.query) : [];
  if (!state.query) {
    panel.hidden = true;
    return;
  }
  const complete = loadedCollections.size === YEAR_FILES.length;
  const exactTag = /^tag:([^\s]+)$/i.exec(state.query)?.[1] || "";
  $("#global-results-label").textContent = exactTag
    ? complete
      ? `${results.length.toLocaleString()} research item${results.length === 1 ? "" : "s"} tagged “${exactTag}”`
      : `${results.length.toLocaleString()} tagged item${results.length === 1 ? "" : "s"} so far · loading ${YEAR_FILES.length - loadedCollections.size} collection(s)…`
    : complete
      ? `${results.length.toLocaleString()} result${results.length === 1 ? "" : "s"} for “${state.query}”`
      : `${results.length.toLocaleString()} result${results.length === 1 ? "" : "s"} so far · loading ${YEAR_FILES.length - loadedCollections.size} collection(s)…`;
  // YEAR, TITLE, RESEARCHER. The name sits under the title rather than beside
  // the publisher, because the two are not the same fact and the narrow layout
  // drops the trailing column entirely: fusing them meant a phone showed the
  // one credit line the archive has and then hid it.
  $("#global-results-list").innerHTML = results.length
    ? results.slice(0, 40).map((item) => {
        const names = (item.authors || []).join(", ");
        return `
        <button type="button" data-artifact="${h(item.id)}" aria-label="${h(`Open ${item.title}${videoLabel(item)}`)}">
          <span><b>${h(item.yearLabel || item.year)}</b>${item.favourite ? "★ favourite" : item.rank ? `#${item.rank}` : item.preliminary ? "preliminary" : "nominee"}</span>
          <div><strong>${h(item.title)}</strong>${item.summary ? `<p>${h(item.summary)}</p>` : ""}${names ? `<em>${h(names)}</em>` : ""}</div>
          <small>${h(item.publisher || item.topic)}${videoMark(item, "result-video")}</small>
        </button>`;
      }).join("") + (results.length > 40 ? `<p>Showing the first 40 results. Add another word to narrow the index.</p>` : "")
    : `<p>No archive records matched those words. A word can name its field —
       <b>author:</b>, <b>publisher:</b>, <b>title:</b>, <b>year:</b>, <b>topic:</b> or <b>tag:</b>.</p>`;
  panel.hidden = false;
}

function closeGlobalSearch() {
  state.query = "";
  searchResumable = false;
  $("#global-search").value = "";
  $("#global-results").hidden = true;
}

function tagSearchQuery(value) {
  const tag = String(value || "").trim().toLowerCase();
  return tag ? `tag:${tag}` : "";
}

// Tags are promises of navigation, not decoration: selecting one closes the
// record and opens the complete archive search for that exact controlled term.
// Focus moves to the result region instead of the input so a phone does not
// cover the list with its keyboard.
function handleArtifactTagClick(event) {
  const target = event.target.closest("[data-tag]");
  const query = tagSearchQuery(target?.dataset.tag);
  if (!query) return;

  searchResumable = false;
  globalResultsScroll = 0;
  if ($("#artifact-dialog").open) $("#artifact-dialog").close();
  state.query = query;
  $("#global-search").value = query;
  updateGlobalSearch();
  $("#global-results-list").scrollTop = 0;
  requestAnimationFrame(() => $("#global-results").focus({ preventScroll: true }));

  ensureAllCollections().then(() => {
    if (state.query !== query) return;
    updateGlobalSearch();
    $("#global-results-list").scrollTop = 0;
  }).catch((error) => toast(`The full search index could not be loaded: ${error.message}`));
}

// Opening a record from a search is not the end of the search. The list is put
// away rather than thrown away, so closing the document returns the reader to
// the results they came from - same words, same place in the list - instead of
// an empty box they have to type into again.
function hideGlobalResults() {
  const panel = $("#global-results");
  if (panel.hidden) return;
  globalResultsScroll = $("#global-results-list").scrollTop;
  searchResumable = Boolean(state.query);
  panel.hidden = true;
}

function documentDialogOpen() {
  return ["#artifact-dialog", "#reader-dialog", "#pdf-dialog"].some((id) => $(id).open);
}

// Called a frame after a document dialog closes, because moving between the
// record, the reader and the PDF viewer closes one dialog before opening the
// next - and mid-move is not a closed document.
function restoreGlobalSearch() {
  if (!searchResumable || !state.query || documentDialogOpen()) return;
  searchResumable = false;
  updateGlobalSearch();
  $("#global-results-list").scrollTop = globalResultsScroll;
}

// Native dialogs retarget backdrop events to the dialog element. Coordinate
// checks distinguish the backdrop from padding, borders and empty pane space.
function isDialogBackdropEvent(event) {
  const dialog = event.currentTarget;
  const hitSurface = event.target?.parentElement === dialog && event.target.classList?.contains("dialog-backdrop-hit");
  if ((event.target !== dialog && !hitSurface) || !dialog.open) return false;
  const bounds = dialog.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX >= bounds.right
    || event.clientY < bounds.top || event.clientY >= bounds.bottom;
}

function closeDialogFromBackdrop(event) {
  if (isDialogBackdropEvent(event)) event.currentTarget.close();
}

function wireDialogDismissal(dialog) {
  // Give touch browsers a real backdrop target: otherwise near-edge taps can
  // be redirected into the embedded PDF frame. Keep it behind the pane and
  // out of keyboard navigation; the labelled close button serves that route.
  const backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.tabIndex = -1;
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.className = "dialog-backdrop-hit";
  dialog.append(backdrop);
  let pressedOnBackdrop = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressedOnBackdrop = event.button === 0 && event.isPrimary !== false && isDialogBackdropEvent(event);
  });
  dialog.addEventListener("pointercancel", () => { pressedOnBackdrop = false; });
  dialog.addEventListener("close", () => { pressedOnBackdrop = false; });
  dialog.addEventListener("click", (event) => {
    // Both ends of a click must be outside. Text selection or a drag that
    // starts in the pane and ends outside must keep the document open.
    if (pressedOnBackdrop) closeDialogFromBackdrop(event);
    pressedOnBackdrop = false;
  });
}

function setMetric(count, label) {
  $("#view-count").textContent = Number(count).toLocaleString();
  $("#view-count-label").textContent = label;
}

function itemsForYear(year) {
  return state.items.filter((item) => item.year === year);
}

// A word may name the PART OF THE RECORD it is asking about. Free text searches
// everything and cannot say which field it meant, so "kettle" answers with the
// research of a person and any title that happens to use the word. Naming the
// field is how a reader asks the question the byline made possible - who wrote
// this - rather than a question that merely tends to find them.
const SEARCH_FIELDS = {
  author: (item) => (item.authors || []).join(" "),
  publisher: (item) => item.publisher || "",
  title: (item) => item.title || "",
  year: (item) => String(item.yearLabel || item.year || ""),
  topic: (item) => item.topic || "",
  // `tag:` is the one field worth asking about exactly. A title says what a
  // researcher called their finding, which is often a joke or a brand; the tag
  // says what it IS. Free text already sees the tags, so this qualifier exists
  // for the reader who wants xsleak and not every page that mentions leaking.
  tag: (item) => (item.tags || []).join(" "),
};

// "author:" while it is still being typed is not a request for nothing, so a
// qualifier with no word yet is dropped rather than matched against "".
function parseQuery(query) {
  return query.toLowerCase().split(/\s+/).filter(Boolean).map((word) => {
    const mark = word.indexOf(":");
    const field = mark > 0 ? word.slice(0, mark) : "";
    return Object.hasOwn(SEARCH_FIELDS, field) && typeof SEARCH_FIELDS[field] === "function"
      ? { field, pick: SEARCH_FIELDS[field], word: word.slice(mark + 1) }
      : { field: "", pick: null, word };
  }).filter((term) => term.word);
}

function queryItems(items, query = state.query) {
  if (!query) return items;
  const terms = parseQuery(query);
  if (!terms.length) return items;
  return items.filter((item) => {
    // Searching a research archive by researcher is the obvious question, and
    // until the author reached the shard the only way to ask it was to know
    // which domain they blogged on twenty years ago.
    // The summary and tags join the haystack because they are the only text
    // here written to describe the FINDING. A title is what the researcher
    // chose to call it, and a good half of this archive is called something
    // like "Bad things happen" - searching those alone answers questions about
    // naming rather than about research.
    const haystack = (`${item.title} ${creditOf(item)} ${item.topic} ${item.year} ${item.kind} `
      + `${item.summary || ""} ${(item.tags || []).join(" ")}`).toLowerCase();
    return terms.every((term) => {
      if (term.field === "tag") return (item.tags || []).some((tag) => tag.toLowerCase() === term.word);
      return term.pick ? term.pick(item).toLowerCase().includes(term.word) : haystack.includes(term.word);
    });
  });
}

function setReadState(item, nextState = !state.readKeys.has(item?.readKey)) {
  if (!item) return;
  item.read = nextState;
  if (nextState) state.readKeys.add(item.readKey);
  else state.readKeys.delete(item.readKey);
  state.items.forEach((entry) => {
    if (entry.readKey === item.readKey) entry.read = nextState;
  });
  try { localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...state.readKeys])); }
  catch { toast("Read status could not be saved in this browser"); }
  state.items.filter((entry) => entry.readKey === item.readKey).forEach((entry) => {
    $$(`[data-artifact="${CSS.escape(entry.id)}"]`).forEach((element) => {
      element.classList.toggle("is-read", nextState);
      if (element.classList.contains("artifact-card")) {
        element.querySelector(".card-read")?.remove();
        if (nextState) element.insertAdjacentHTML("beforeend", `<span class="card-read">✓ read</span>`);
      }
    });
  });
  constellationExperience?.refreshReadState?.();
  syncReadButtons(item);
  updateReadingProgress();
  if (state.view === "favourites") renderFavourites();
  if (isDiscoveryView()) discoveryRefresh();
  toast(nextState ? "Marked as read" : "Marked as unread");
}

function setFavouriteState(item, nextState = !state.favouriteKeys.has(item?.favouriteKey)) {
  if (!item) return;
  item.favourite = nextState;
  if (nextState) state.favouriteKeys.add(item.favouriteKey);
  else state.favouriteKeys.delete(item.favouriteKey);
  const related = state.items.filter((entry) => entry.favouriteKey === item.favouriteKey);
  related.forEach((entry) => { entry.favourite = nextState; });
  try { localStorage.setItem(FAVOURITE_STORAGE_KEY, JSON.stringify([...state.favouriteKeys])); }
  catch { toast("Favourite status could not be saved in this browser"); }
  related.forEach((entry) => {
    $$(`[data-artifact="${CSS.escape(entry.id)}"]`).forEach((element) => {
      element.classList.toggle("is-favourite", nextState);
      if (element.classList.contains("artifact-card")) {
        element.querySelector(".card-favourite")?.remove();
        if (nextState) element.insertAdjacentHTML("beforeend", `<span class="card-favourite" aria-label="Favourite">★</span>`);
      }
      if (element.classList.contains("investigation-card")) {
        element.querySelector(".evidence-favourite")?.remove();
        if (nextState) element.insertAdjacentHTML("beforeend", `<b class="evidence-favourite">★ SAVED</b>`);
      }
    });
  });
  constellationExperience?.refreshFavouriteState?.();
  syncFavouriteButtons(item);
  updateFavouriteCount();
  toast(nextState ? "Added to favourites" : "Removed from favourites");
  if (state.view === "favourites") renderFavourites();
  if (isDiscoveryView()) discoveryRefresh();
}

function favouriteItems() {
  return state.items.filter((item) => item.favourite);
}

function readItems() {
  return state.items.filter((item) => item.read);
}

// The records view 09 lists for the selected personal collection.
function savedItems(mode = state.savedMode) {
  if (mode === "read") return readItems();
  if (mode === "all") return state.items.filter((item) => item.favourite || item.read);
  return favouriteItems();
}

// An empty year or topic selection means "all of them", so several years can be
// combined into one shortlist instead of paging through them one at a time.
function savedFilteredItems(items = savedItems()) {
  return items.filter((item) =>
    (!state.savedYears.size || state.savedYears.has(item.year))
    && (!state.savedTopics.size || state.savedTopics.has(item.topic))
  ).sort((a, b) => b.year.localeCompare(a.year) || byRankThenTitle(a, b));
}

function updateFavouriteCount() {
  const count = loadedCollections.size === YEAR_FILES.length
    ? favouriteItems().length
    : Math.min(state.archiveTotal || state.favouriteKeys.size, state.favouriteKeys.size);
  const label = $("#favourite-count");
  if (label) label.textContent = count.toLocaleString();
}

function updateReadingProgress() {
  const total = state.archiveTotal || state.items.length;
  const read = loadedCollections.size === YEAR_FILES.length
    ? state.items.filter((item) => item.read).length
    : Math.min(total, state.readKeys.size);
  const progress = total ? read / total * 100 : 0;
  const label = $("#reading-progress-label");
  const bar = $("#reading-progress-bar");
  const button = $("#browse-unread");
  const navCount = $("#read-count");
  if (navCount) navCount.textContent = read.toLocaleString();
  if (label) label.textContent = `${read.toLocaleString()} / ${total.toLocaleString()}`;
  if (bar) bar.style.width = `${clampNumber(progress, 0, 100)}%`;
  if (button) {
    button.disabled = Boolean(total && read === total);
    button.textContent = total && read === total ? "Archive reading complete ✓" : "Resume with an unread record →";
  }
}

function syncReadButtons(item) {
  const current = state.readKeys.has(item.readKey);
  [$("#artifact-read-toggle"), $("#reader-read-toggle"), $("#pdf-read-toggle")].filter(Boolean).forEach((button) => {
    button.setAttribute("aria-pressed", String(current));
    button.textContent = current ? "✓ Read" : "○ Mark as read";
  });
}

function syncFavouriteButtons(item) {
  const current = state.favouriteKeys.has(item.favouriteKey);
  [$("#artifact-favourite-toggle"), $("#reader-favourite-toggle"), $("#pdf-favourite-toggle")].filter(Boolean).forEach((button) => {
    button.setAttribute("aria-pressed", String(current));
    button.textContent = current ? "★ Favourite" : "☆ Add favourite";
  });
}

function archiveLabel(item) {
  return item.archiveStatus === "preserved" ? "MD + PDF" : item.archiveStatus === "partial" ? "Partial copy" : item.archiveStatus === "live" ? "Original live" : "Link only";
}

function statusMarkup(item) {
  const className = item.archiveStatus === "preserved" ? "" : item.archiveStatus;
  return `<span><i class="status-dot ${h(className)}"></i>${h(archiveLabel(item))}</span>`;
}

// ONE GLYPH, ONE FACT, IN EVERY ROOM. The archive knows a talk exists for 298
// records; a reader scanning any of the archive views should be able to see that
// without opening one. The mark is stated once here rather than per view, so
// the views cannot drift into meaning slightly different things — and it keeps
// the site's own distinction: a solid mark where the archive is certain, a
// faded one where its best match is still a guess.
function videoMark(item, extraClass = "") {
  if (!item.videos?.length) return "";
  const confirmed = item.videos.some((video) => video.confidence === "confirmed");
  const label = confirmed
    ? "A talk recording is linked on this record"
    : "A possible related recording is linked on this record";
  return `<i class="record-video${extraClass ? ` ${h(extraClass)}` : ""}${confirmed ? "" : " is-potential"}" aria-hidden="true" title="${h(label)}">▶</i>`;
}

// The same fact for a screen reader, which cannot see the glyph. Appended to
// the control's own label rather than given a label of its own, because it
// describes the record and is not a thing to be pressed.
function videoLabel(item) {
  if (!item.videos?.length) return "";
  return item.videos.some((video) => video.confidence === "confirmed")
    ? ", has a talk recording"
    : ", has a possible related recording";
}

function recordedCount(items) {
  return items.filter((item) => item.videos?.length).length;
}

// THE FIELD'S RECORDING CONTROL. The museum filters its room by recording and
// the observatory filters its frequency by it; the constellation offered every
// other axis the two of them do and not this one, so the same question asked in
// two rooms had no answer in the third. Rendered while the standing holds
// something to filter, AND while the filter is still running after it stops
// holding anything: a control that vanished at zero would leave a reader in an
// empty field with nothing left to press to get out of it.
function recordedFilterButton(count) {
  if (!count && !state.starRecordedOnly) return "";
  const title = state.starRecordedOnly ? "Stop filtering by recording" : "Show only research with a talk recording";
  return `<button class="star-recorded-filter ${state.starRecordedOnly ? "active" : ""}" type="button" data-star-recorded aria-pressed="${state.starRecordedOnly}" title="${h(title)}"><i aria-hidden="true">▶</i><span class="full-label">Recorded</span><span class="short-label">Rec</span> <b>${count}</b></button>`;
}

function artifactCard(item, compactCard = false) {
  const rank = item.rank ? `<span class="rank-token">#${item.rank}</span>` : item.preliminary ? `<span class="preliminary-token">PRELIMINARY</span>` : `<span>${h(item.kind)}</span>`;
  // The roomy winner and personal-collection cards should answer the first
  // question a title raises: what did this research actually find? Dense
  // nomination walls keep their scanning rhythm and expose the same summary in
  // the record dialog instead of turning 70+ cards into a page of paragraphs.
  const summary = !compactCard && item.summary
    ? `<p class="card-summary">${h(item.summary)}</p>`
    : "";
  return `
    <div class="artifact-card topic-${h(item.topic)} ${compactCard ? "compact-card" : ""} ${item.read ? "is-read" : ""} ${item.favourite ? "is-favourite" : ""}" data-artifact="${h(item.id)}" tabindex="0" role="button" aria-label="Open ${h(item.title)}${item.favourite ? ", favourite" : ""}${h(videoLabel(item))}">
      <div class="card-top"><span>${h(item.yearLabel || item.year)} / ${h(item.topic)}</span>${rank}</div>
      <h3>${h(item.title)}</h3>
      ${summary}
      <div class="card-foot"><span>${h(short(briefCreditOf(item) || "Unknown publisher", 25))}</span><span class="card-foot-meta">${statusMarkup(item)}${videoMark(item, "card-video")}</span></div>
      ${item.favourite ? `<span class="card-favourite" aria-label="Favourite">★</span>` : ""}
      ${item.read ? `<span class="card-read">✓ read</span>` : ""}
    </div>`;
}

function yearPills(selected) {
  return newestFirstYearRecords().map((record) => `<button class="year-pill ${record.id === selected ? "active" : ""} ${record.status === "preliminary" ? "preliminary" : ""}" data-year="${h(record.id)}" aria-pressed="${record.id === selected}" title="${h(record.status === "preliminary" ? "Preliminary, unranked, and subject to change" : `Finalized ${record.label} archive`)}"><span>${h(record.label)}</span>${record.status === "preliminary" ? `<small>PRELIM</small>` : ""}</button>`).join("");
}

// A card's colour is its research topic and nothing else — the same topic named
// in the card's own header. Listing only the topics the room holds keeps the key
// short and makes it describe the cards actually in front of the reader.
//
// The key is ALSO the room's filter. The colours already answered "what is in
// this room"; the question a reader asks next is "show me only those", and a
// second control repeating the same nine words would have been the wrong way to
// offer it. Selections are multiple and they OR together. `Recorded` is not a
// tenth colour but a different axis, so it ANDs over whatever the topics left -
// which is why Injection + Recorded can honestly come back empty, and says so
// rather than quietly widening back out to everything.
function roomFilterActive() {
  return state.roomTopics.size > 0 || state.roomVideoOnly;
}

function filterRoom(items) {
  return items.filter((item) =>
    (!state.roomTopics.size || state.roomTopics.has(item.topic))
    && (!state.roomVideoOnly || Boolean(item.videos?.length)));
}

function topicKey(items, shown) {
  const present = TOPICS
    .map((topic) => ({ ...topic, count: items.filter((item) => item.topic === topic.name).length }))
    // A topic this room does not hold is not offered — but one the reader has
    // SELECTED stays on the strip at zero, because a year that lacks it would
    // otherwise leave a filter running with no control left to switch it off.
    .filter((topic) => topic.count || state.roomTopics.has(topic.name));
  if (!present.length) return "";
  const recorded = items.filter((item) => item.videos?.length).length;
  const hidden = items.length - shown.length;
  // WHAT IS NOT ON THE WALL. A filtered room looks exactly like a small one, so
  // the count of what it is holding back is stated rather than implied by a
  // pressed button somewhere above.
  const status = !roomFilterActive()
    ? `${items.length} on the wall`
    : shown.length
      ? `${shown.length} of ${items.length} shown · ${hidden} hidden`
      : `Nothing here matches · all ${items.length} hidden`;
  const chip = (topic) => `
    <li style="--topic-color:${h(topic.color)}">
      <button type="button" data-room-filter="${h(topic.name)}" aria-pressed="${state.roomTopics.has(topic.name)}" title="${h(state.roomTopics.has(topic.name) ? `Stop filtering by ${topic.name}` : `Show only ${topic.name} research`)}"><i aria-hidden="true"></i>${h(topic.name)} <b>${topic.count}</b></button>
    </li>`;
  return `
    <div class="topic-key${roomFilterActive() ? " is-filtering" : ""}" role="group" aria-label="Filter this room by research topic">
      <p>Filter the room<b>card colour = topic</b></p>
      <ul>
        ${present.map(chip).join("")}
        ${recorded ? `<li class="key-recorded"><button type="button" data-room-filter="recorded" aria-pressed="${state.roomVideoOnly}" title="${h(state.roomVideoOnly ? "Stop filtering by recording" : "Show only research with a talk recording")}"><i aria-hidden="true">▶</i>Recorded <b>${recorded}</b></button></li>` : ""}
      </ul>
      <p class="topic-key-state" role="status">${h(status)}</p>
      ${roomFilterActive() ? `<button class="topic-key-reset" type="button" data-room-filter="reset">↺ Reset filter</button>` : ""}
    </div>`;
}

// A filter click rewrites the whole room, and the walls above and below the key
// change height as it does. Put the key back under the pointer that pressed it
// instead of letting the page jump to wherever the new content lands.
function applyRoomFilter(token) {
  const focus = captureViewFocus();
  if (token === "reset") {
    state.roomTopics.clear();
    state.roomVideoOnly = false;
  } else if (token === "recorded") {
    state.roomVideoOnly = !state.roomVideoOnly;
  } else {
    toggleInSet(state.roomTopics, token);
  }
  const before = $(".topic-key")?.getBoundingClientRect().top;
  renderMuseum();
  restoreViewFocus(focus);
  const after = $(".topic-key")?.getBoundingClientRect().top;
  if (typeof before !== "number" || typeof after !== "number") return;
  // Full-screen mode moves the scrolling box from the page onto <main>, so the
  // shift is applied to whichever of the two actually moved.
  const drift = after - before;
  const main = $("#main-content");
  if (main && main.scrollHeight > main.clientHeight) main.scrollTop += drift;
  else globalThis.scrollBy?.(0, drift);
}

function renderMuseum() {
  const roomItems = itemsForYear(state.year);
  const items = filterRoom(roomItems);
  const filtering = roomFilterActive();
  const preliminary = isPreliminaryYear(state.year);
  const winners = items.filter((item) => item.section === "winner").sort(byRankThenTitle);
  const nominees = items.filter((item) => item.section !== "winner");
  setMetric(items.length, filtering
    ? `of ${roomItems.length} in room ${yearLabel(state.year)}`
    : preliminary ? `preliminary leads · ${yearLabel(state.year)}` : `artifacts in room ${yearLabel(state.year)}`);
  // The marquee states what the ROOM holds, not what the filter left, so the
  // reader always has the unfiltered figure to read the key's counts against.
  const roomWinners = roomItems.filter((item) => item.section === "winner").length;
  $("#view-root").innerHTML = `
    <section class="museum-map">
      <div class="museum-years" aria-label="Museum rooms">${yearPills(state.year)}</div>
      ${preliminaryNotice(state.year)}
      <div class="room-marquee">
        <p class="eyebrow">${preliminary ? "Research snapshot" : "Gallery room"}</p>
        <div class="room-number">${h(yearLabel(state.year))}</div>
        <p>${preliminary ? `${roomItems.length} ${h(yearRecordFor(state.year).provenance || "preliminary")} leads · no ranking · subject to change` : `${roomWinners} winning exhibits · ${roomItems.length - roomWinners} nominated works`} · ${roomItems.filter((item) => item.archived).length} preserved locally</p>
      </div>
      ${topicKey(roomItems, items)}

      ${preliminary ? "" : `<div class="section-head"><div><p class="eyebrow">The central gallery</p><h2>Top 10 illuminated exhibits</h2></div><p>Selected by community vote and panel</p></div>
      <div class="winner-plinths">${winners.map((item) => artifactCard(item)).join("") || empty(filtering ? "No ranked exhibit in this room matches the filter." : "No ranked exhibits recorded for this room.")}</div>`}

      <div class="section-head"><div><p class="eyebrow">${preliminary ? "Open review" : "The long gallery"}</p><h2>${preliminary ? "Preliminary research leads" : "Every other nomination"}</h2></div><p>${nominees.length} ${preliminary ? "changeable leads" : "artifacts on the wall"}</p></div>
      <div class="nominee-wall">${nominees.map((item) => artifactCard(item, true)).join("") || empty(filtering ? "Nothing else in this room matches the filter." : preliminary ? "No preliminary leads recorded." : "No other nominations recorded.")}</div>
    </section>`;
}

function renderLibrary() {
  platedBook = null;
  const items = itemsForYear(state.year);
  const preliminary = isPreliminaryYear(state.year);
  const groups = TOPICS.map((topic) => ({ ...topic, items: items.filter((item) => item.topic === topic.name) })).filter((group) => group.items.length);
  setMetric(items.length, `${preliminary ? "preliminary volumes" : "volumes shelved"} for ${yearLabel(state.year)}`);

  $("#view-root").innerHTML = `
    ${preliminaryNotice(state.year)}
    <div class="library-desk">
      <section class="librarian-note">
        <p class="eyebrow">Curator's desk / shelf ${h(yearLabel(state.year))}</p>
        <h2>Browse by title, not by filename.</h2>
        <p>Each spine is one real technique. Pull it from the shelf to choose the preserved Markdown, printable PDF or original source.</p>
      </section>
      <div class="checkout-card">
        <p class="eyebrow">Reading room card</p>
        <p><strong>${items.length}</strong> volumes<br><strong>${groups.length}</strong> subject shelves<br><strong>${items.filter((item) => item.archived).length}</strong> locally preserved</p>
      </div>
    </div>
    <div class="control-strip" aria-label="Select library year">${yearPills(state.year)}</div>
    <section class="library-hall">
      ${groups.map((group) => `
        <div class="shelf-section">
          <div class="shelf-label"><span>${h(group.name)} studies</span><span>${group.items.length} volumes</span></div>
          <div class="book-shelf">
            ${group.items.map((item, index) => `<button class="book ${item.read ? "is-read" : ""} ${item.favourite ? "is-favourite" : ""}" data-artifact="${h(item.id)}" aria-label="Open ${h(item.title)}${item.read ? ", read" : ""}${item.favourite ? ", favourite" : ""}${h(videoLabel(item))}" style="--book-height:${125 + ((index * 19) % 48)}px;--book-color:${h(group.color)}">${h(short(item.title, 48))}${videoMark(item, "book-video")}<b>${h(yearLabel(item.year, true))}</b></button>`).join("")}
          </div>
          <div class="shelf-plate" aria-hidden="true"><i class="shelf-plate-notch"></i><b class="shelf-plate-title"></b><span class="shelf-plate-summary"></span><span class="shelf-plate-meta"></span></div>
        </div>`).join("")}
    </section>`;
}

// A spine read vertically is slow, so hovering or focusing one drops a label into
// the shelf-edge holder directly beneath it — horizontal, full title, never clipped.
let platedBook = null;

function positionShelfPlate(plate, shelf, book) {
  const shelfBox = shelf.getBoundingClientRect();
  const bookBox = book.getBoundingClientRect();
  const centre = bookBox.left - shelfBox.left + bookBox.width / 2;
  const width = plate.offsetWidth;
  const left = Math.max(0, Math.min(centre - width / 2, shelfBox.width - width));
  plate.style.setProperty("--plate-x", `${Math.round(left)}px`);
  plate.style.setProperty("--notch-x", `${Math.round(Math.min(Math.max(centre - left, 14), Math.max(width - 14, 14)))}px`);
}

function showShelfPlate(book) {
  const shelf = book.closest(".book-shelf");
  const plate = shelf?.parentElement?.querySelector(".shelf-plate");
  const item = plate && state.items.find((entry) => entry.id === book.dataset.artifact);
  if (!item) return;
  hideShelfPlates(plate);
  plate.querySelector(".shelf-plate-title").textContent = item.title;
  const summary = plate.querySelector(".shelf-plate-summary");
  summary.textContent = item.summary || "";
  summary.hidden = !item.summary;
  const standing = item.rank ? `#${item.rank}` : item.preliminary ? "PRELIMINARY" : item.kind;
  plate.querySelector(".shelf-plate-meta").textContent = [
    standing,
    item.publisher || "Unknown publisher",
    `${item.yearLabel || item.year} · ${item.topic}`,
    archiveLabel(item),
    // The plate is text, not markup, so the glyph on the spine is spelled out
    // here rather than repeated — and it keeps the archive's own distinction.
    item.videos?.length
      ? item.videos.some((video) => video.confidence === "confirmed") ? "▶ recorded" : "▶ possible recording"
      : ""
  ].filter(Boolean).join("  ·  ");
  plate.classList.add("is-open");
  positionShelfPlate(plate, shelf, book);
  platedBook = book;
}

function hideShelfPlates(except = null) {
  if (!platedBook) return;
  $$(".shelf-plate.is-open").forEach((plate) => {
    if (plate !== except) plate.classList.remove("is-open");
  });
  if (!except) platedBook = null;
}

function trackShelfScroll(event) {
  const shelf = event.target;
  if (!shelf.classList?.contains("book-shelf")) return;
  const plate = shelf.parentElement?.querySelector(".shelf-plate.is-open");
  if (!plate || !platedBook || !shelf.contains(platedBook)) return;
  positionShelfPlate(plate, shelf, platedBook);
}

const SAVED_MODE_COPY = {
  favourites: {
    label: "★ Favourites",
    noun: "favourite",
    lead: "Your research shortlist",
    heading: "Build a shortlist from any archive view",
    help: `Favourites stay in this browser. Open any record elsewhere and use <b>☆ Add favourite</b>; the terminal also supports <code>fav &lt;id&gt;</code>.`,
    blank: "Nothing saved yet. Open a research record in Museum, Library, Signals, Constellation, Terminal, or Investigation Board to add it here."
  },
  read: {
    label: "✓ Read",
    noun: "read",
    lead: "Your reading history",
    heading: "Mark records as read to build a history",
    help: `Read state stays in this browser. Open any record and use <b>○ Mark as read</b> in the record, Markdown reader or PDF viewer.`,
    blank: "Nothing marked as read yet. Open a research record and use ○ Mark as read to track what you have been through."
  },
  all: {
    label: "Both",
    noun: "saved or read",
    lead: "Your personal archive",
    heading: "Save or read a record to collect it here",
    help: `Both lists stay in this browser. A record appears here once it is a favourite, marked as read, or both.`,
    blank: "Nothing collected yet. Add a favourite or mark a record as read from any archive view."
  }
};

function renderFavourites() {
  if (!SAVED_MODES.includes(state.savedMode)) state.savedMode = "favourites";
  const copy = SAVED_MODE_COPY[state.savedMode];
  const counts = {
    favourites: favouriteItems().length,
    read: readItems().length,
    all: savedItems("all").length
  };
  const all = savedItems();
  // Drop selections that no longer describe anything the registry still knows,
  // so a retired year or renamed topic cannot leave the view permanently empty.
  [...state.savedYears].forEach((year) => { if (!YEAR_FILES.includes(year)) state.savedYears.delete(year); });
  [...state.savedTopics].forEach((topic) => { if (!TOPICS.some((entry) => entry.name === topic)) state.savedTopics.delete(topic); });
  const filtered = savedFilteredItems(all);
  // Offer every year/topic this collection holds, plus any still-selected one it
  // no longer holds, so a selection left over from the other list stays visible
  // and clickable instead of silently emptying the grid.
  const yearRecords = newestFirstYearRecords().filter((record) => state.savedYears.has(record.id) || all.some((item) => item.year === record.id));
  const topicRecords = TOPICS.filter((topic) => state.savedTopics.has(topic.name) || all.some((item) => item.topic === topic.name));
  const filtering = Boolean(state.savedYears.size || state.savedTopics.size);
  const selectedYearCount = state.savedYears.size;
  setMetric(all.length, `${copy.noun} record${all.length === 1 ? "" : "s"} saved in this browser`);
  $("#view-root").innerHTML = `
    <section class="favourites-view">
      <header class="favourites-summary">
        <div><p class="eyebrow">${h(copy.lead)}</p><h2>${all.length ? `${all.length.toLocaleString()} ${h(copy.noun)} record${all.length === 1 ? "" : "s"}` : h(copy.heading)}</h2><p>${copy.help}</p></div>
        <span aria-hidden="true">${state.savedMode === "read" ? "✓" : "★"}</span>
      </header>
      <div class="saved-modes" role="group" aria-label="Choose a personal collection">
        ${SAVED_MODES.map((mode) => `<button type="button" class="${state.savedMode === mode ? "active" : ""}" data-saved-mode="${mode}" aria-pressed="${state.savedMode === mode}">${h(SAVED_MODE_COPY[mode].label)} <b>${counts[mode].toLocaleString()}</b></button>`).join("")}
      </div>
      ${all.length ? `<div class="favourite-filters">
        <div role="group" aria-label="Filter by one or more years"><span>Years</span><button type="button" class="${selectedYearCount ? "" : "active"}" data-saved-year="all" aria-pressed="${!selectedYearCount}">All years <b>${all.length}</b></button>${yearRecords.map((record) => {
          const active = state.savedYears.has(record.id);
          const count = all.filter((item) => item.year === record.id).length;
          return `<button type="button" class="${active ? "active" : ""}" data-saved-year="${h(record.id)}" aria-pressed="${active}">${h(record.shortLabel || record.label || record.id)} <b>${count}</b></button>`;
        }).join("")}</div>
        <div role="group" aria-label="Filter by one or more topics"><span>Topics</span><button type="button" class="${state.savedTopics.size ? "" : "active"}" data-saved-topic="all" aria-pressed="${!state.savedTopics.size}">All topics</button>${topicRecords.map((topic) => {
          const active = state.savedTopics.has(topic.name);
          const count = all.filter((item) => item.topic === topic.name).length;
          return `<button type="button" class="${active ? "active" : ""}" data-saved-topic="${h(topic.name)}" aria-pressed="${active}" style="--topic-color:${h(topic.color)}">${h(topic.name)} <b>${count}</b></button>`;
        }).join("")}</div>
        <p class="saved-filter-note">${filtering
          ? `Showing <b>${filtered.length.toLocaleString()}</b> of ${all.length.toLocaleString()} · ${selectedYearCount ? `${selectedYearCount} year${selectedYearCount === 1 ? "" : "s"}` : "all years"}${state.savedTopics.size ? ` · ${state.savedTopics.size} topic${state.savedTopics.size === 1 ? "" : "s"}` : ""} <button type="button" class="saved-clear" data-saved-clear>Clear filters</button>`
          : "Select several years or topics to combine them."}</p>
      </div>` : ""}
      <div class="favourite-grid mode-${h(state.savedMode)}">
        ${filtered.map((item) => `<div class="favourite-entry">${artifactCard(item)}<div class="saved-actions"><span class="saved-flags">${item.favourite ? "★" : ""}${item.read ? "✓" : ""}</span>${item.favourite ? `<button class="remove-favourite" type="button" data-favourite="${h(item.id)}" aria-label="Remove ${h(item.title)} from favourites">★ Remove</button>` : ""}${item.read ? `<button class="remove-favourite" type="button" data-saved-unread="${h(item.id)}" aria-label="Mark ${h(item.title)} as unread">✓ Unread</button>` : ""}</div></div>`).join("")
          || empty(all.length ? "No records match those filters." : copy.blank)}
      </div>
    </section>`;
}

function terminalWelcome() {
  return [
    `<div class="terminal-welcome"><p class="terminal-eyebrow">RESEARCH CONSOLE / READY</p><h3>The archive is at your fingertips.</h3><p>Choose a quick action, or type a command below.</p><p class="terminal-example">Try <button data-term-command="grep HTTP">grep HTTP</button> to find research, or <button data-term-command="ls /">ls /</button> to browse the collections.</p></div>`
  ];
}

function renderTerminal() {
  if (state.view !== "terminal") return;
  setMetric(state.archiveTotal, "records available to query");
  if (!state.terminalLines.length) state.terminalLines = terminalWelcome();
  const mdCount = archiveFieldTotal("markdown");
  const pdfCount = archiveFieldTotal("pdf");
  const terminalYear = YEAR_FILES.includes(state.terminalCwd.slice(1)) ? state.terminalCwd.slice(1) : "";
  $("#view-root").innerHTML = `
    ${terminalYear ? preliminaryNotice(terminalYear) : ""}
    <section class="hacker-terminal" aria-label="Interactive Hacker Terminal">
      <header class="hacker-terminal-head">
        <div class="terminal-identity"><span class="terminal-lamp" aria-hidden="true"></span><strong>HACKER TERMINAL</strong><span class="terminal-status" role="status">${state.terminalBusy ? "Working…" : "Ready"}</span></div>
        <label class="terminal-collection-label" for="terminal-collection">Collection<select id="terminal-collection" aria-label="List a collection"><option value="">Choose…</option>${newestFirstYearFiles().map((year) => `<option value="${h(year)}" ${state.terminalBrowse === year ? "selected" : ""}>${h(yearLabel(year))}</option>`).join("")}</select></label>
        <nav class="terminal-shortcuts" aria-label="Quick terminal actions"><button type="button" data-term-fill="grep ">Search</button><button type="button" data-term-command="ls /">Browse</button><button type="button" data-term-command="random">Random paper</button><button type="button" data-term-command="favorites">Saved</button><button type="button" data-term-command="help">Help</button><button type="button" data-term-command="clear">Clear</button></nav>
      </header>
      <div class="terminal-output" id="terminal-output" role="log" aria-label="Command results" aria-live="polite" aria-busy="${state.terminalBusy}" tabindex="0">${state.terminalLines.join("")}</div>
      <form class="terminal-input" id="terminal-form">
        <label for="terminal-command"><span class="terminal-user">guest@archive</span><span>${h(terminalPromptPath())}</span><b aria-hidden="true">$</b></label>
        <input id="terminal-command" type="text" value="${h(state.terminalDraft)}" maxlength="500" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type help to get started" aria-label="Terminal command" aria-describedby="terminal-input-help">
        <button class="terminal-run" type="submit">${state.terminalBusy ? "Working…" : "Run ↵"}</button>
        <div class="terminal-input-help" id="terminal-input-help"><span>Enter to run · ↑ ↓ history · Tab to complete</span><button id="terminal-complete" type="button">Complete command</button></div>
      </form>
      <footer class="hacker-terminal-foot"><span><b>${state.archiveTotal.toLocaleString()}</b> records</span><span>${mdCount.toLocaleString()} Markdown · ${pdfCount.toLocaleString()} PDF</span><span>Archive commands only</span></footer>
    </section>`;

  $("#terminal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#terminal-command");
    runTerminalCommand(input.value);
  });
  $$("[data-term-command]", $("#view-root")).forEach((button) => button.addEventListener("click", () => runTerminalCommand(button.dataset.termCommand)));
  $$('[data-terminal-md]', $("#view-root")).forEach((button) => button.addEventListener("click", () => {
    const item = state.items.find((entry) => entry.id === button.dataset.terminalMd);
    if (item?.mdPath) openReader(item);
  }));
  $$('[data-terminal-pdf]', $("#view-root")).forEach((button) => button.addEventListener("click", () => {
    const item = state.items.find((entry) => entry.id === button.dataset.terminalPdf);
    if (item?.pdfPath) openPdfViewer(item);
  }));
  $$('[data-terminal-web]', $("#view-root")).forEach((button) => button.addEventListener("click", () => {
    const item = state.items.find((entry) => entry.id === button.dataset.terminalWeb);
    const url = safeExternalUrl(item?.originalUrl);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }));
  const input = $("#terminal-command");
  const rememberDraft = () => { state.terminalDraft = input.value; };
  input.addEventListener("input", rememberDraft);
  $("#terminal-collection").addEventListener("change", (event) => {
    if (!event.target.value) return;
    selectArchiveYear(event.target.value);
  });
  $("[data-term-fill]").addEventListener("click", () => {
    input.value = "grep ";
    rememberDraft();
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
  $("#terminal-complete").addEventListener("click", () => {
    input.value = terminalCompletion(input.value);
    rememberDraft();
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
  input.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!state.terminalHistory.length) return;
      event.preventDefault();
      if (state.terminalHistoryIndex === state.terminalHistory.length) state.terminalHistoryDraft = input.value;
      const delta = event.key === "ArrowUp" ? -1 : 1;
      state.terminalHistoryIndex = clampNumber(state.terminalHistoryIndex + delta, 0, state.terminalHistory.length);
      input.value = state.terminalHistory[state.terminalHistoryIndex] ?? state.terminalHistoryDraft ?? "";
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === "Tab" && !event.shiftKey && input.value.trim()) {
      const completed = terminalCompletion(input.value);
      if (completed !== input.value) { event.preventDefault(); input.value = completed; }
    }
    rememberDraft();
  });
  $$(".hacker-terminal button,.hacker-terminal input,.hacker-terminal select").forEach((control) => { control.disabled = state.terminalBusy; });
  requestAnimationFrame(() => {
    const output = $("#terminal-output");
    // A route change can remove this terminal before the next frame runs.
    if (!input.isConnected || !output) return;
    output.scrollTop = output.scrollHeight;
    if (!state.terminalBusy && !documentDialogOpen() && !window.matchMedia("(pointer: coarse)").matches) input.focus({ preventScroll: true });
  });
}

function terminalPromptPath() {
  return state.terminalCwd === "/" ? "~" : state.terminalCwd;
}

function resolveTerminalPath(rawPath = ".") {
  let value = String(rawPath || ".").trim();
  if (value === "-") return state.terminalPreviousCwd;
  if (value === "~") value = "/";
  else if (value.startsWith("~/")) value = `/${value.slice(2)}`;
  const segments = value.startsWith("/") ? [] : state.terminalCwd.split("/").filter(Boolean);
  value.split("/").forEach((part) => {
    if (!part || part === ".") return;
    if (part === "..") segments.pop();
    else segments.push(part);
  });
  if (segments.length === 1 && ["2016", "2017"].includes(segments[0])) segments[0] = "2016-17";
  return `/${segments.join("/")}`;
}

function terminalPathExists(path) {
  const name = path.split("/").filter(Boolean)[0] || "";
  return path === "/" || path === "/favourites" || path === "/favorites" || (path === `/${name}` && YEAR_FILES.includes(name));
}

function terminalItemsAtPath(path = state.terminalCwd) {
  const name = path.split("/").filter(Boolean)[0] || "";
  if (path === "/") return state.items;
  if (["/favourites", "/favorites"].includes(path)) return favouriteItems();
  return YEAR_FILES.includes(name) ? itemsForYear(name) : [];
}

function terminalTokens(command) {
  const tokens = [];
  let token = "";
  let quote = "";
  for (const character of command) {
    if (quote) {
      if (character === quote) quote = "";
      else token += character;
    } else if (character === "'" || character === '"') quote = character;
    else if (/\s/.test(character)) {
      if (token) { tokens.push(token); token = ""; }
    } else token += character;
  }
  if (quote) return { tokens: [], error: "unterminated quote" };
  if (token) tokens.push(token);
  return { tokens, error: "" };
}

// JavaScript regexes cannot be interrupted once running. Keep grep inside a
// deliberately conservative, FINITE subset: no assertions/backreferences,
// no quantified groups and no unbounded *, + or {n,} repetition. A small
// number of bounded atom repeats remains useful for CVEs and similar records.
function regexSafetyIssue(source) {
  let inClass = false;
  let previous = "start";
  let quantifiers = 0;
  let rangedRepeats = 0;
  let alternatives = 0;
  const groups = [];

  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (character === "\\") {
      const escaped = source[index + 1] || "";
      if (!inClass && (/[1-9]/.test(escaped) || (escaped === "k" && source[index + 2] === "<"))) {
        return "backreferences are disabled for ReDoS safety";
      }
      index++;
      previous = "atom";
      continue;
    }
    if (inClass) {
      if (character === "]") { inClass = false; previous = "atom"; }
      continue;
    }
    if (character === "[") { inClass = true; continue; }
    if (character === "(") {
      if (source[index + 1] === "?") {
        if (source[index + 2] !== ":") return "lookarounds and special groups are disabled for ReDoS safety";
        index += 2;
      }
      groups.push(index);
      previous = "group-open";
      continue;
    }
    if (character === ")") {
      groups.pop();
      previous = "group";
      continue;
    }
    if (character === "|") {
      if (++alternatives > 12) return "pattern has too many alternatives for the safe grep engine";
      previous = "alternative";
      continue;
    }
    if (character === "*" || character === "+") return "unbounded repetition is disabled for ReDoS safety; use a bounded repeat such as {0,32}";

    let repeat = null;
    if (character === "{") repeat = /^\{(\d+)(?:,(\d*))?\}/.exec(source.slice(index));
    if (character === "?" || repeat) {
      if (previous === "group") return "quantified groups are disabled for ReDoS safety";
      if (previous === "quantifier") return "stacked quantifiers are disabled for ReDoS safety";
      if (++quantifiers > 4) return "pattern is too complex for the safe grep engine";
      if (repeat) {
        const lower = Number(repeat[1]);
        const upper = repeat[2] === undefined ? lower : repeat[2] === "" ? Infinity : Number(repeat[2]);
        if (!Number.isFinite(upper)) return "unbounded repetition is disabled for ReDoS safety";
        if (lower > 64 || upper > 64 || upper < lower) return "repeat bounds must be ordered and no greater than 64";
        if (repeat[2] !== undefined && ++rangedRepeats > 1) return "multiple ranged repeats are disabled for ReDoS safety";
        index += repeat[0].length - 1;
      }
      previous = "quantifier";
      continue;
    }
    previous = "atom";
  }
  return "";
}

function compileSafeGrep(expression, insensitive = true) {
  let source = String(expression || "");
  let flags = insensitive ? "i" : "";
  const slashPattern = source.match(/^\/(.*)\/([a-z]*)$/s);
  if (slashPattern) {
    source = slashPattern[1];
    flags = slashPattern[2];
  }
  if (!source) return { error: "empty regular expression" };
  if (source.length > 160) return { error: "pattern exceeds the 160-character safety limit" };
  if (/[^im]/.test(flags) || new Set(flags).size !== flags.length) return { error: "only the i and m regex flags are supported" };
  const safetyIssue = regexSafetyIssue(source);
  if (safetyIssue) return { error: safetyIssue };
  try { return { regex: new RegExp(source, flags), source, flags }; }
  catch (error) { return { error: `invalid regular expression: ${error.message}` }; }
}

function terminalRows(items, limit = 60) {
  if (!items.length) return `<p class="term-error">No records matched.</p>`;
  return items.slice(0, limit).map((item, index) => `<div class="term-row ${item.favourite ? "is-favourite" : ""}"><span>${String(index + 1).padStart(3, "0")}</span><b>${item.favourite ? `★${item.rank ? `#${item.rank}` : ""}` : item.rank ? `#${item.rank}` : item.preliminary ? "PRE" : "·"}</b><button data-term-command="open ${h(item.id)}">${h(item.title)}</button><small>${h(yearLabel(item.year, true))}${item.videos?.length ? " · ▶" : ""}${item.archived ? "" : " · not archived"}</small></div>`).join("") + (items.length > limit ? `<p class="term-dim">… ${items.length - limit} more result(s). Refine the query to narrow them.</p>` : "");
}

function terminalRootListing() {
  return `<p class="term-bright">total ${YEAR_FILES.length + 1} directories, ${state.archiveTotal} documents</p>${newestFirstYearFiles().map((year) => {
    const summary = collectionSummaryFor(year);
    const count = Number(summary?.count || 0);
    const archived = Number(summary?.archived || 0);
    const bars = Math.round(archived / Math.max(1, count) * 10);
    return `<div class="term-volume"><span>drwx</span><button data-term-command="ls /${h(year)}">${h(yearLabel(year, true))}/</button><small>${String(count).padStart(3, " ")} docs${isPreliminaryYear(year) ? " · PRELIM" : ""}</small><i>[${"█".repeat(bars)}${"░".repeat(10 - bars)}] ${Math.round(archived / Math.max(1, count) * 100)}% archived</i></div>`;
  }).join("")}<div class="term-volume"><span>drwx</span><button data-term-command="ls /favourites">favourites/</button><small>${String(state.favouriteKeys.size).padStart(3, " ")} saved</small><i>browser-local shortlist</i></div>`;
}

function terminalGrep(args) {
  let insensitive = true;
  let inverted = false;
  while (args[0]?.startsWith("-") && !args[0].startsWith("/")) {
    const option = args.shift();
    if (option === "-i") insensitive = true;
    else if (option === "-v") inverted = true;
    else return `<p class="term-error">grep: unsupported option '${h(option)}' (supported: -i, -v)</p>`;
  }
  let scopePath = state.terminalCwd;
  if (args.length > 1) {
    const possiblePath = resolveTerminalPath(args.at(-1));
    if (terminalPathExists(possiblePath)) {
      scopePath = possiblePath;
      args.pop();
    }
  }
  const expression = args.join(" ");
  const compiled = compileSafeGrep(expression, insensitive);
  if (compiled.error) return `<p class="term-error">grep: ${h(compiled.error)}. Try a shorter expression such as <button data-term-command="grep /xss|csrf/i">grep /xss|csrf/i</button>.</p>`;
  const matches = terminalItemsAtPath(scopePath).filter((item) => {
    const haystack = `${item.title}\n${creditOf(item)}\n${item.topic}\n${item.year}\n${item.kind}\n${item.originalUrl}`.slice(0, 2048);
    compiled.regex.lastIndex = 0;
    const matched = compiled.regex.test(haystack);
    return inverted ? !matched : matched;
  });
  const shownPattern = `/${compiled.source}/${compiled.flags}`;
  return `<p class="term-bright">${matches.length} match${matches.length === 1 ? "" : "es"} for ${h(shownPattern)} in ${h(scopePath)}</p>${terminalRows(matches, 60)}`;
}

async function runTerminalCommand(rawCommand) {
  if (state.terminalBusy || !String(rawCommand || "").trim()) return;
  state.terminalBusy = true;
  state.terminalDraft = "";
  renderTerminal();
  try { await executeTerminalCommand(rawCommand); }
  finally { state.terminalBusy = false; renderTerminal(); }
}

async function executeTerminalCommand(rawCommand) {
  const command = String(rawCommand || "").trim().slice(0, 500);
  if (!command) return;
  const parsed = terminalTokens(command);
  const [verbRaw = "", ...args] = parsed.tokens;
  const verb = verbRaw.toUpperCase();
  const promptPath = terminalPromptPath();
  state.terminalHistory.push(command);
  state.terminalHistory = state.terminalHistory.slice(-80);
  state.terminalHistoryIndex = state.terminalHistory.length;
  state.terminalLines.push(`<p class="term-echo"><span>guest@top10:${h(promptPath)}$</span> ${h(command)}</p>`);

  try {
    if (!parsed.error) {
      const recordCommands = ["OPEN", "CAT", "SHOW", "FAV", "FAVOURITE", "FAVORITE", "UNFAV", "UNFAVOURITE", "UNFAVORITE"];
      if (recordCommands.includes(verb) && args[0]) await ensureItemLoaded(args[0]);
      if (["STATS", "FAVOURITES", "FAVORITES", "FAVS"].includes(verb)) await ensureAllCollections();
      if (["LS", "DIR", "LIST", "WINNERS"].includes(verb)) {
        const path = resolveTerminalPath(args[0] || (verb === "WINNERS" ? state.terminalCwd : "."));
        if (["/favourites", "/favorites"].includes(path)) await ensureAllCollections();
        else if (YEAR_FILES.includes(path.slice(1))) await ensureCollection(path.slice(1));
      }
      if (["FIND", "GREP", "SEARCH"].includes(verb)) {
        const possiblePath = args.length > 1 ? resolveTerminalPath(args.at(-1)) : "";
        const path = terminalPathExists(possiblePath) ? possiblePath : state.terminalCwd;
        if (["/", "/favourites", "/favorites"].includes(path)) await ensureAllCollections();
        else if (YEAR_FILES.includes(path.slice(1))) await ensureCollection(path.slice(1));
      }
      if (["RANDOM", "LUCKY"].includes(verb)) {
        if (["/", "/favourites", "/favorites"].includes(state.terminalCwd)) await ensureAllCollections();
        else if (YEAR_FILES.includes(state.terminalCwd.slice(1))) await ensureCollection(state.terminalCwd.slice(1));
      }
    }
  } catch (error) {
    state.terminalLines.push(`<p class="term-error">archive load failed: ${h(error.message)}</p>`);
    renderTerminal();
    return;
  }

  if (parsed.error) {
    state.terminalLines.push(`<p class="term-error">sh: ${h(parsed.error)}</p>`);
  } else if (["HELP", "MAN", "?"].includes(verb)) {
    state.terminalLines.push(`<p class="term-bright">Available commands</p><div class="terminal-man"><button data-term-command="pwd">pwd</button><span>print the current archive directory</span><button data-term-command="cd /2024">cd &lt;year|..|/&gt;</button><span>move between root, year and favourites directories</span><button data-term-command="ls">ls [path]</button><span>list the current or named directory</span><button data-term-command="grep /xss|csrf/i">grep [-i|-v] &lt;regex&gt; [path]</button><span>safe regex search in the current or named directory</span><button data-term-command="open ${h(state.items[0]?.id || "")}">open &lt;id&gt; [--md|--pdf|--web]</button><span>show or open a preserved record</span><button data-term-command="fav ${h(state.items[0]?.id || "")}">fav / unfav &lt;id&gt;</button><span>add or remove a browser-local favourite</span><button data-term-command="favorites">favorites</button><span>list the favourites directory</span><button data-term-command="history">history</button><span>show recent commands</span><button data-term-command="random">random</button><span>surface one document from the current directory</span><button data-term-command="clear">clear</button><span>wipe the screen</span></div><p class="term-dim">Aliases: dir/list, cat/show, search/find, favourite/favorite, lucky, cls · regexes are bounded and risky constructs are rejected before execution.</p>`);
  } else if (verb === "PWD") {
    state.terminalLines.push(`<p>${h(state.terminalCwd)}</p>`);
  } else if (verb === "CD") {
    const destination = resolveTerminalPath(args[0] || "/");
    if (!terminalPathExists(destination)) state.terminalLines.push(`<p class="term-error">cd: ${h(args[0] || "")}: no such directory</p>`);
    else {
      state.terminalPreviousCwd = state.terminalCwd;
      state.terminalCwd = destination === "/favorites" ? "/favourites" : destination;
    }
  } else if (verb === "STATS") {
    const preserved = state.items.filter((item) => item.archived).length;
    state.terminalLines.push(`<p>${state.archiveTotal} techniques / ${YEAR_FILES.length} year files / ${preserved} locally preserved / ${favouriteItems().length} favourites / ${new Set(state.items.map((item) => item.publisher)).size} publishers</p>`);
  } else if (["LS", "DIR", "LIST"].includes(verb)) {
    const requestedPath = resolveTerminalPath(args[0] || ".");
    if (!terminalPathExists(requestedPath)) state.terminalLines.push(`<p class="term-error">ls: cannot access '${h(args[0] || requestedPath)}': no such directory. Run <button data-term-command="ls /">ls /</button>.</p>`);
    else if (requestedPath === "/") state.terminalLines.push(terminalRootListing());
    else {
      const items = [...terminalItemsAtPath(requestedPath)].sort((a, b) => Number(b.section === "winner") - Number(a.section === "winner") || byRankThenTitle(a, b));
      const name = requestedPath === "/favourites" || requestedPath === "/favorites" ? "FAVOURITES" : yearLabel(requestedPath.slice(1));
      state.terminalLines.push(`<p class="term-bright">== ${h(name)} · ${items.length} document${items.length === 1 ? "" : "s"}${requestedPath.startsWith("/20") && isPreliminaryYear(requestedPath.slice(1)) ? " · PRELIMINARY / UNRANKED / SUBJECT TO CHANGE" : ""} ==</p>${terminalRows(items)}`);
    }
  } else if (verb === "WINNERS") {
    const path = args[0] ? resolveTerminalPath(args[0]) : state.terminalCwd;
    const year = path.slice(1);
    if (!YEAR_FILES.includes(year)) state.terminalLines.push(`<p class="term-error">winners: enter or name a finalized year directory first</p>`);
    else state.terminalLines.push(isPreliminaryYear(year)
      ? `<p class="term-error">${h(yearLabel(year))} has no winners or Top 10. It is an AI-collected, unranked snapshot subject to change.</p>`
      : terminalRows(itemsForYear(year).filter((item) => item.section === "winner").sort(byRankThenTitle)));
  } else if (["FIND", "GREP", "SEARCH"].includes(verb)) {
    state.terminalLines.push(terminalGrep([...args]));
  } else if (["OPEN", "CAT", "SHOW"].includes(verb)) {
    const item = state.items.find((entry) => entry.id.toLowerCase() === (args[0] || "").toLowerCase());
    const flag = args[1]?.toLowerCase();
    if (!item) state.terminalLines.push(`<p class="term-error">open: no document '${h(args[0] || "")}'. Try <button data-term-command="grep xss">grep xss</button>.</p>`);
    else if (flag && !["--md", "--pdf", "--web", "--www"].includes(flag)) state.terminalLines.push(`<p class="term-error">open: unknown flag '${h(flag)}' (use --md, --pdf or --web)</p>`);
    else if (flag === "--md" || flag === "--pdf") {
      const available = flag === "--md" ? item.mdPath : item.pdfPath;
      state.terminalLines.push(`<p class="term-dim">${available ? `opening the shared ${flag === "--md" ? "Markdown reader" : "PDF viewer"} for ${h(item.id)}…` : `${h(item.id)} has no ${flag.slice(2).toUpperCase()} copy.`}</p>`);
      renderTerminal();
      if (available) (flag === "--md" ? openReader(item) : openPdfViewer(item));
      return;
    } else if (["--web", "--www"].includes(flag)) {
      const url = safeExternalUrl(item.originalUrl);
      state.terminalLines.push(`<p class="term-dim">${url ? `opening ${h(url)}…` : "unsafe original URL rejected."}</p>`);
      renderTerminal();
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    } else state.terminalLines.push(terminalDetail(item));
  } else if (["FAV", "FAVOURITE", "FAVORITE"].includes(verb) || ["UNFAV", "UNFAVOURITE", "UNFAVORITE"].includes(verb)) {
    const item = state.items.find((entry) => entry.id.toLowerCase() === (args[0] || "").toLowerCase());
    if (!item) state.terminalLines.push(`<p class="term-error">${h(verb.toLowerCase())}: supply a valid document id</p>`);
    else {
      const adding = ["FAV", "FAVOURITE", "FAVORITE"].includes(verb);
      setFavouriteState(item, adding);
      state.terminalLines.push(`<p>${adding ? "★ added" : "☆ removed"} ${h(item.id)} ${adding ? "to" : "from"} favourites</p>`);
    }
  } else if (["FAVOURITES", "FAVORITES", "FAVS"].includes(verb)) {
    state.terminalLines.push(`<p class="term-bright">== FAVOURITES · ${favouriteItems().length} saved ==</p>${terminalRows(favouriteItems())}`);
  } else if (verb === "HISTORY") {
    state.terminalLines.push(state.terminalHistory.slice(-20).map((entry, index) => `<p><span class="term-dim">${String(index + 1).padStart(3, " ")}</span> ${h(entry)}</p>`).join(""));
  } else if (verb === "ECHO") {
    state.terminalLines.push(`<p>${h(args.join(" "))}</p>`);
  } else if (["RANDOM", "LUCKY"].includes(verb)) {
    const pool = terminalItemsAtPath();
    if (!pool.length) state.terminalLines.push(`<p class="term-error">random: ${h(state.terminalCwd)} contains no documents</p>`);
    else {
      const item = pool[Math.floor(Math.random() * pool.length)];
      state.terminalLines.push(`<p class="term-dim">/dev/urandom says: ${h(item.id)} (${h(yearLabel(item.year))})</p>${terminalDetail(item)}`);
    }
  } else if (["CLEAR", "CLS"].includes(verb)) state.terminalLines = terminalWelcome();
  else if (verb === "WHOAMI") state.terminalLines.push(`<p>guest (read-only shell — the archive is watching you back)</p>`);
  else if (["EXIT", "LOGOUT"].includes(verb)) state.terminalLines.push(`<p class="term-dim">There is no exit. There is only more web hacking research.</p>`);
  else state.terminalLines.push(`<p class="term-error">sh: ${h(verb.toLowerCase())}: command not found — try <button data-term-command="help">help</button>.</p>`);

  state.terminalLines = state.terminalLines.slice(-260);
  renderTerminal();
}

function terminalDetail(item) {
  const mdAction = item.mdPath ? `<button data-terminal-md="${h(item.id)}">[md reader]</button>` : `<span>[md unavailable]</span>`;
  const pdfAction = item.pdfPath ? `<button data-terminal-pdf="${h(item.id)}">[pdf viewer]</button>` : `<span>[pdf unavailable]</span>`;
  const original = safeExternalUrl(item.originalUrl);
  const webAction = original ? `<button data-terminal-web="${h(item.id)}">[www]</button>` : `<span>[www blocked]</span>`;
  const favouriteAction = `<button data-term-command="${item.favourite ? "unfav" : "fav"} ${h(item.id)}">[${item.favourite ? "★ remove favourite" : "☆ add favourite"}]</button>`;
  const standing = item.rank
    ? `<b class="term-gold">★ TOP 10 · rank #${item.rank}</b>`
    : item.preliminary ? `<b class="term-warn">PRELIMINARY · UNRANKED · SUBJECT TO CHANGE</b>` : `<i>nominee</i>`;
  // A shell prints a field, so the recording is a field rather than a glyph -
  // and it says which it is, because the confidence band is the whole point of
  // the record. The URL goes through the same validator as every other outbound
  // address here; a rejected one is simply absent.
  const talk = (item.videos || []).find((video) => safeExternalUrl(video.url));
  const talkLine = talk
    ? `<p><span>video</span>${talk.confidence === "confirmed" ? `<b class="term-gold">▶ recorded</b>` : `<i>▶ possible match</i>`}${talk.conference ? ` · ${h(talk.conference)}` : ""}${talk.minutes ? ` · ${talk.minutes} min` : ""} <small>${h(safeExternalUrl(talk.url))}</small></p>`
    : "";
  return `<section class="terminal-detail"><p class="term-dim">┌─ ${h(item.id)} ─────────────────────────</p><p><span>title</span><strong>${h(item.title)}</strong></p><p><span>year</span>${h(yearLabel(item.year))} ${standing}</p><p><span>source</span>${h(item.publisher || "unknown")} · ${h(item.kind)}</p><p><span>topic</span>${h(item.topic)} · ${h(item.archiveStatus)}${item.favourite ? " · ★ favourite" : ""}</p><p><span>url</span><small>${h(original || "blocked unsafe URL")}</small></p>${talkLine}<p><span>actions</span>${mdAction}${pdfAction}${webAction}${favouriteAction}<button data-artifact="${h(item.id)}">[full record]</button></p><p class="term-dim">└────────────────────────────────────────</p></section>`;
}

function terminalCompletion(value) {
  const source = String(value || "").trimStart();
  const parts = source.split(/\s+/);
  const commands = ["help", "pwd", "cd", "ls", "open", "grep", "fav", "unfav", "favorites", "random", "stats", "winners", "history", "echo", "clear", "whoami", "exit"];
  let options = commands;
  if (parts.length > 1 && ["cd", "ls", "list", "winners"].includes(parts[0].toLowerCase())) options = ["/", "..", "-", "/favourites", ...newestFirstYearFiles().map((year) => `/${year}`)];
  if (parts.length > 1 && ["open", "cat", "show", "fav", "favourite", "favorite", "unfav"].includes(parts[0].toLowerCase())) options = parts.length > 2 ? ["--md", "--pdf", "--web"] : terminalItemsAtPath().map((item) => item.id);
  const stem = parts.at(-1).toLowerCase();
  const match = options.find((option) => option.toLowerCase().startsWith(stem));
  if (!match) return value;
  parts[parts.length - 1] = match;
  return parts.join(" ");
}

function hashString(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ mixed >>> 15, mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}

function renderSignals() {
  const chartYears = newestFirstYearFiles();
  if (!YEAR_FILES.includes(state.signalYear)) state.signalYear = chartYears[0];
  const activeTopic = state.signalTopic === "all" ? null : TOPICS.find((topic) => topic.name === state.signalTopic);
  const signalColor = activeTopic?.color || "#7899ff";
  const topicLabel = activeTopic?.name || "All research";
  const chart = chartYears.map((year) => {
    const summary = collectionSummaryFor(year);
    const allItems = year === state.signalYear ? itemsForYear(year) : [];
    const items = activeTopic ? allItems.filter((item) => item.topic === activeTopic.name) : allItems;
    const count = activeTopic ? Number(summary?.topicCounts?.[activeTopic.name] || 0) : Number(summary?.count || 0);
    return { year, items, count, preliminary: isPreliminaryYear(year) };
  });
  const maxCount = Math.max(1, ...chart.map((point) => point.count));
  const total = chart.reduce((sum, point) => sum + point.count, 0);
  const peak = chart.reduce((best, point) => point.count > best.count ? point : best, chart[0]);
  const selectedPoint = chart.find((point) => point.year === state.signalYear) || chart[0];
  const selectedItems = selectedPoint.items;
  const selectedArchived = selectedItems.filter((item) => item.archived).length;
  const selectedRead = selectedItems.filter((item) => item.read).length;
  const selectedWinners = selectedPoint.preliminary ? 0 : selectedItems.filter((item) => item.section === "winner").length;
  const chartWidth = Math.max(1080, chart.length * 72);
  const viewWidth = Math.max(100, chart.length * 100);
  const wavePoints = chart.map((point, index) => {
    const level = point.count / maxCount;
    return `${index * 100 + 50},${(88 - level * 64).toFixed(2)}`;
  }).join(" ");
  const distribution = TOPICS.map((topic) => ({
    ...topic,
    count: itemsForYear(state.signalYear).filter((item) => item.topic === topic.name).length
  })).sort((a, b) => b.count - a.count);
  const distributionMax = Math.max(1, ...distribution.map((topic) => topic.count));
  const winnerItems = selectedPoint.preliminary ? [] : selectedItems.filter((item) => item.section === "winner");
  const nomineeItems = selectedPoint.preliminary ? [] : selectedItems.filter((item) => item.section !== "winner");
  if (selectedPoint.preliminary || (state.signalStatus === "top10" && !winnerItems.length) || (state.signalStatus === "nominee" && !nomineeItems.length)) state.signalStatus = "all";
  const standingItems = state.signalStatus === "top10" ? winnerItems : state.signalStatus === "nominee" ? nomineeItems : selectedItems;
  // ANDs over the topic and the standing, exactly as the museum's Recorded chip
  // does — so a year whose Top 10 was never filmed comes back empty and says so,
  // rather than dropping a filter the reader can still see pressed.
  const recordedHere = recordedCount(standingItems);
  const statusItems = state.signalRecordedOnly ? standingItems.filter((item) => item.videos?.length) : standingItems;
  const sortedStatusItems = [...statusItems].sort((a, b) =>
    Number(b.section === "winner") - Number(a.section === "winner") || byRankThenTitle(a, b)
  );
  // In All mode, reveal enough results to get beyond the ranked block. This
  // makes the wider nomination field visible immediately instead of presenting
  // a Top-10-looking slice while silently hiding the rest.
  const visibleLimit = state.signalStatus === "all" && !selectedPoint.preliminary
    ? Math.max(state.signalVisibleCount, winnerItems.length + 4)
    : state.signalVisibleCount;
  const focusItems = sortedStatusItems.slice(0, visibleLimit);
  const remainingItems = Math.max(0, sortedStatusItems.length - focusItems.length);
  const filteredArchived = statusItems.filter((item) => item.archived).length;
  const statusLabel = selectedPoint.preliminary
    ? "Preliminary leads"
    : state.signalStatus === "top10" ? "Top 10" : state.signalStatus === "nominee" ? "Other nominations" : topicLabel;

  setMetric(total, `${topicLabel.toLowerCase()} signals across ${chart.length} collections`);
  $("#view-root").innerHTML = `
    <section class="signal-observatory" style="--signal-color:${h(signalColor)}">
      <header class="signal-console">
        <div class="signal-console-mark" aria-hidden="true"><span>03</span><i></i></div>
        <div>
          <p class="eyebrow">Longitudinal research receiver</p>
          <h2>What is getting louder?</h2>
          <p>Each pulse is a real paper or nomination. Tune one technique family, move across the years, then open the research behind the shape.</p>
        </div>
        <dl>
          <div><dt>Frequency</dt><dd>${h(topicLabel)}</dd></div>
          <div><dt>Peak</dt><dd>${h(yearLabel(peak.year, true))} · ${peak.count}</dd></div>
          <div><dt>Sample</dt><dd>${total.toLocaleString()} records</dd></div>
        </dl>
      </header>

      <div class="signal-tuner" role="group" aria-label="Tune a research topic">
        <button class="${state.signalTopic === "all" ? "active" : ""}" data-signal-topic="all" aria-pressed="${state.signalTopic === "all"}" style="--topic-color:#7899ff"><i></i><span>All traffic</span><b>${state.items.length.toLocaleString()}</b></button>
        ${TOPICS.map((topic) => {
          const count = state.items.filter((item) => item.topic === topic.name).length;
          return `<button class="${state.signalTopic === topic.name ? "active" : ""}" data-signal-topic="${h(topic.name)}" aria-pressed="${state.signalTopic === topic.name}" style="--topic-color:${h(topic.color)}"><i></i><span>${h(topic.name)}</span><b>${count.toLocaleString()}</b></button>`;
        }).join("")}
      </div>

      <section class="signal-chart" aria-label="${h(topicLabel)} records by collection">
        <header><div><span class="signal-live"><i></i> Live archive signal</span><strong>${h(topicLabel)}</strong></div><p>Select a year to inspect its papers</p></header>
        <div class="signal-chart-scroll">
          <div class="signal-chart-canvas" style="width:${chartWidth}px">
            <svg viewBox="0 0 ${viewWidth} 100" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="signal-wave-gradient" x1="0" x2="1"><stop stop-color="#ffb454"/><stop offset=".25" stop-color="${h(signalColor)}"/><stop offset="1" stop-color="#6ee7e7"/></linearGradient></defs>
              <polyline points="${wavePoints}" vector-effect="non-scaling-stroke"></polyline>
            </svg>
            <div class="signal-year-columns" style="grid-template-columns:repeat(${chart.length},minmax(0,1fr))">
              ${chart.map((point) => {
                const level = point.count / maxCount;
                const active = point.year === state.signalYear;
                return `<button class="${active ? "active" : ""} ${point.preliminary ? "preliminary" : ""}" data-signal-year="${h(point.year)}" aria-pressed="${active}" title="${h(`${yearLabel(point.year)}: ${point.count} ${topicLabel.toLowerCase()} record${point.count === 1 ? "" : "s"}`)}" style="--signal-level:${level.toFixed(3)}">
                  <span>${h(yearLabel(point.year, true))}</span><i><b></b></i><strong>${point.count}</strong>${point.preliminary ? "<small>PRELIM</small>" : ""}
                </button>`;
              }).join("")}
            </div>
          </div>
        </div>
        <footer><span>QUIET</span><i></i><span>PEAK ${maxCount}</span></footer>
      </section>

      <section class="signal-focus">
        ${selectedPoint.preliminary ? preliminaryNotice(selectedPoint.year) : ""}
        <div class="signal-focus-grid">
          <div class="signal-readout">
            <p class="signal-lock"><i></i> Frequency locked</p>
            <strong>${h(yearLabel(selectedPoint.year))}</strong>
            <span>${h(topicLabel)} / ${selectedItems.length} record${selectedItems.length === 1 ? "" : "s"}</span>
            <dl>
              <div><dt>Preserved</dt><dd>${selectedArchived}</dd></div>
              <div><dt>Read</dt><dd>${selectedRead}</dd></div>
              <div><dt>${selectedPoint.preliminary ? "Status" : "Top 10"}</dt><dd>${selectedPoint.preliminary ? "Open" : selectedWinners}</dd></div>
            </dl>
            <div class="signal-distribution" aria-label="Topic distribution for ${h(yearLabel(selectedPoint.year))}">
              ${distribution.map((topic) => `<div title="${h(`${topic.name}: ${topic.count}`)}"><span>${h(topic.name)}</span><i><b style="width:${(topic.count / distributionMax * 100).toFixed(1)}%;background:${h(topic.color)}"></b></i><strong>${topic.count}</strong></div>`).join("")}
            </div>
          </div>
          <div class="signal-findings">
            <header><div><p class="eyebrow">Papers on this frequency</p><h3>${h(statusLabel)} in ${h(yearLabel(selectedPoint.year))}</h3></div><span>${filteredArchived}/${statusItems.length} preserved</span></header>
            <div class="signal-result-tools">
              ${selectedPoint.preliminary
                ? `<div class="signal-preliminary-filter" role="status"><i></i><span>All ${selectedItems.length} preliminary leads</span></div>`
                : `<div class="signal-status-filter" role="group" aria-label="Show all research, Top 10 selections, or other nominations">
                    <span>Show</span>
                    <button class="${state.signalStatus === "all" ? "active" : ""}" data-signal-status="all" aria-pressed="${state.signalStatus === "all"}">All <b>${selectedItems.length}</b></button>
                    <button class="${state.signalStatus === "top10" ? "active" : ""}" data-signal-status="top10" aria-pressed="${state.signalStatus === "top10"}" ${winnerItems.length ? "" : "disabled"}>Top 10 <b>${winnerItems.length}</b></button>
                    <button class="${state.signalStatus === "nominee" ? "active" : ""}" data-signal-status="nominee" aria-pressed="${state.signalStatus === "nominee"}" ${nomineeItems.length ? "" : "disabled"}>Other nominations <b>${nomineeItems.length}</b></button>
                  </div>`}
              ${recordedHere || state.signalRecordedOnly
                ? `<button class="signal-recorded-filter ${state.signalRecordedOnly ? "active" : ""}" type="button" data-signal-recorded aria-pressed="${state.signalRecordedOnly}" title="${h(state.signalRecordedOnly ? "Stop filtering by recording" : "Show only research with a talk recording")}"><i aria-hidden="true">▶</i> Recorded <b>${recordedHere}</b></button>`
                : ""}
              <p>Showing <b>${focusItems.length}</b> of ${statusItems.length}${state.signalRecordedOnly ? ` · ${standingItems.length - statusItems.length} without a recording hidden` : state.signalStatus === "all" && winnerItems.length ? " · Top 10 first" : ""}</p>
            </div>
            <div>
              ${focusItems.map((item) => `<button class="signal-finding ${item.read ? "is-read" : ""} ${item.favourite ? "is-favourite" : ""}" data-artifact="${h(item.id)}" aria-label="${h(`Open ${item.title}${videoLabel(item)}`)}">
                <span>${item.rank ? `#${item.rank}` : item.preliminary ? "PRELIM" : "NOM"}</span><strong>${h(item.title)}</strong><small>${h(item.publisher || item.topic)} · ${h(item.archiveStatus)}</small>${videoMark(item, "signal-video") || `<i class="signal-video" aria-hidden="true"></i>`}<i aria-hidden="true">↗</i>
              </button>`).join("") || empty(state.signalRecordedOnly
                ? `No ${statusLabel.toLowerCase()} in ${yearLabel(selectedPoint.year)} has a recording on file.`
                : `No ${statusLabel.toLowerCase()} are filed in ${yearLabel(selectedPoint.year)}.`)}
              ${remainingItems ? `<button class="signal-more" type="button" data-signal-more>Show 12 more <span>${remainingItems} remaining</span></button>` : statusItems.length ? `<p class="signal-end">All ${statusItems.length} matching records are shown</p>` : ""}
            </div>
          </div>
        </div>
      </section>
    </section>`;
  requestAnimationFrame(() => {
    const scroll = $(".signal-chart-scroll");
    const activeYear = $(".signal-year-columns button.active");
    if (scroll && activeYear) scroll.scrollLeft = Math.max(0, activeYear.offsetLeft - (scroll.clientWidth - activeYear.clientWidth) / 2);
  });
}

function renderConstellation() {
  const yearRecord = yearRecordFor(state.starYear);
  const preliminary = yearRecord.status === "preliminary";
  if (preliminary) state.starStatus = "all";
  const yearItems = itemsForYear(state.starYear);
  let topicItems = yearItems;
  if (state.starTopic !== "all") topicItems = topicItems.filter((item) => item.topic === state.starTopic);
  const winnerCount = topicItems.filter((item) => item.section === "winner").length;
  const nomineeCount = topicItems.length - winnerCount;
  if (state.starStatus === "top10" && winnerCount === 0) state.starStatus = "all";
  if (state.starStatus === "nominee" && nomineeCount === 0) state.starStatus = "all";
  let standingItems = topicItems;
  if (state.starStatus === "top10") standingItems = standingItems.filter((item) => item.section === "winner");
  if (state.starStatus === "nominee") standingItems = standingItems.filter((item) => item.section !== "winner");
  // ANDs over the topic and the standing, as the museum's chip and the
  // observatory's button both do -- so a year whose Top 10 was never filmed
  // empties the field and leaves the control pressed, rather than quietly
  // widening back out to every star.
  const recordedHere = recordedCount(standingItems);
  const items = state.starRecordedOnly ? standingItems.filter((item) => item.videos?.length) : standingItems;
  const statusLabel = preliminary ? "preliminary stars" : state.starStatus === "top10" ? "Top 10 stars" : state.starStatus === "nominee" ? "nominee stars" : "stars";
  setMetric(items.length, `${state.starRecordedOnly ? "recorded " : ""}${statusLabel} visible for ${yearLabel(state.starYear)}`);

  $("#view-root").innerHTML = `
    <div class="sky-controls">
      <div class="control-strip" style="margin:0">${yearPills(state.starYear)}</div>
      <p class="eyebrow">Drag space to orbit · tug a star to move it · double-click to approach</p>
    </div>
    ${preliminaryNotice(state.starYear)}
    <section class="constellation-frame space-3d" id="constellation-space" tabindex="0" aria-label="Navigable three-dimensional research constellation. Drag empty space to orbit, or drag a research star to move it within its cluster.">
      <canvas id="constellation-canvas" class="constellation-canvas"></canvas>
      <div class="space-reticle" aria-hidden="true"><i></i><i></i></div>
      <div class="space-coordinates">
        <span>CAMERA / <b id="space-camera-distance">650</b> AU</span>
        <span>VISIBLE / <b>${items.length}</b> RESEARCH STARS</span>
        <span>YEAR / <b>${h(yearLabel(state.starYear))}</b></span>
        ${preliminary ? `<span class="space-preliminary-key"><b>△</b> UNRANKED SNAPSHOT</span>` : `<span class="space-winner-key"><b>✦</b> GOLD HALO / TOP 10</span>`}
      </div>
      <div class="space-toolbar">
        <button id="space-reset" type="button">Reset view <kbd>R</kbd></button>
        <button id="space-labels" type="button" aria-pressed="false">Titles off</button>
        <button id="space-focus" type="button" disabled>Focus star <kbd>F</kbd></button>
        <button id="space-tidy" type="button" disabled>Tidy stars</button>
      </div>
      <div class="space-zoom" aria-label="Camera zoom">
        <button id="space-zoom-in" aria-label="Zoom in">+</button>
        <div class="space-zoom-track" id="space-zoom-range" role="slider" tabindex="0" aria-label="Camera distance: near at the top, far at the bottom" aria-orientation="vertical" aria-valuemin="120" aria-valuemax="1500" aria-valuenow="720"><i aria-hidden="true"></i></div>
        <button id="space-zoom-out" aria-label="Zoom out">−</button>
      </div>
      <div class="space-navigator" role="group" aria-label="Spatial navigation controller">
        <span class="space-nav-title">ORBITAL NAV</span>
        <div class="space-nav-dial">
          <button class="nav-up" data-space-nav="up" aria-label="Move up" title="Move up">↑<small>UP</small></button>
          <button class="nav-left" data-space-nav="left" aria-label="Move left" title="Move left">←</button>
          <button class="nav-right" data-space-nav="right" aria-label="Move right" title="Move right">→</button>
          <button class="nav-down" data-space-nav="down" aria-label="Move down" title="Move down">↓<small>DOWN</small></button>
          <button class="nav-turn-left" data-space-nav="turn-left" aria-label="Turn left" title="Turn left">↶</button>
          <button class="nav-turn-right" data-space-nav="turn-right" aria-label="Turn right" title="Turn right">↷</button>
          <div class="nav-thrust">
            <button data-space-nav="forward" aria-label="Fly forward" title="Fly forward">▲</button>
            <span>FLY</span>
            <button data-space-nav="back" aria-label="Fly backward" title="Fly backward">▼</button>
          </div>
          <i class="nav-sweep" aria-hidden="true"></i>
        </div>
        <small class="space-nav-hint">HOLD TO MANOEUVRE</small>
        <button id="space-autorotate" class="space-rotation" type="button" aria-label="Pause rotation" aria-pressed="true">⏸ Pause rotation</button>
      </div>
      <aside class="space-selection" id="space-selection" hidden>
        <p class="eyebrow" id="space-selection-meta">Selected star</p>
        <h3 id="space-selection-title"></h3>
        <p id="space-selection-publisher"></p>
        <div><button id="space-open-artifact">Inspect artifact</button><button id="space-favourite-artifact">☆ Add favourite</button><button id="space-fly-artifact">Fly closer</button></div>
      </aside>
      <div class="sky-legend">
        <button class="${state.starTopic === "all" ? "active" : ""}" data-topic-filter="all" aria-pressed="${state.starTopic === "all"}" style="--topic-color:#edf9f1">ALL</button>
        ${TOPICS.map((topic) => `<button class="${state.starTopic === topic.name ? "active" : ""}" data-topic-filter="${h(topic.name)}" aria-pressed="${state.starTopic === topic.name}" style="--topic-color:${h(topic.color)}">${h(topic.name.toUpperCase())}</button>`).join("")}
      </div>
      ${preliminary ? `<div class="star-rank-filter preliminary-filter" role="status"><span>UNRANKED</span><button class="active" data-star-status="all" aria-pressed="true">Preliminary <b>${topicItems.length}</b></button>${recordedFilterButton(recordedHere)}</div>` : `<div class="star-rank-filter" role="group" aria-label="Filter research by Top 10 status and by talk recording">
          <span>SHOW</span>
          <button class="${state.starStatus === "all" ? "active" : ""}" data-star-status="all" aria-pressed="${state.starStatus === "all"}">All <b>${topicItems.length}</b></button>
          <button class="top-ten ${state.starStatus === "top10" ? "active" : ""}" data-star-status="top10" aria-pressed="${state.starStatus === "top10"}" ${winnerCount ? "" : "disabled"}><i aria-hidden="true">✦</i> Top 10 <b>${winnerCount}</b></button>
          <button class="${state.starStatus === "nominee" ? "active" : ""}" data-star-status="nominee" aria-pressed="${state.starStatus === "nominee"}" ${nomineeCount ? "" : "disabled"}><span class="full-label">Nominees</span><span class="short-label">Rest</span> <b>${nomineeCount}</b></button>
          ${recordedFilterButton(recordedHere)}
        </div>`}
      <div class="space-help"><span><kbd>Drag space</kbd> orbit</span><span><kbd>Drag star</kbd> tug</span><span><kbd>Shift + drag</kbd> pan</span><span><kbd>Wheel / pinch</kbd> zoom</span></div>
    </section>`;

  if (constellationExperience) constellationExperience.destroy();
  if (!window.Constellation3D) {
    $("#constellation-space").insertAdjacentHTML("beforeend", empty("The 3D space renderer could not be loaded."));
    return;
  }
  constellationExperience = new window.Constellation3D({
    canvas: $("#constellation-canvas"),
    shell: $("#constellation-space"),
    items,
    topics: TOPICS,
    onArtifact: (id) => openArtifact(id),
    onFavourite: (id) => {
      const item = state.items.find((entry) => entry.id === id);
      if (item) setFavouriteState(item);
    },
    onToast: (message) => toast(message)
  });
  constellationExperience.mount();
}

function renderEvidence() {
  destroyInvestigationLayout();
  const preliminary = isPreliminaryYear(state.year);
  const items = itemsForYear(state.year);
  const winners = items.filter((item) => item.section === "winner");
  const nominees = items.filter((item) => item.section !== "winner");
  const archived = items.filter((item) => item.archived).length;
  setMetric(items.length, `${preliminary ? "preliminary leads" : "case files"} pinned for ${yearLabel(state.year)}`);
  $("#view-root").innerHTML = `
    <section class="investigation-shell">
      <header class="investigation-tools">
        <div><strong>THE <span>INVESTIGATION</span> BOARD</strong><small>evidence archive 2006–2026 · preliminary material flagged</small></div>
        <div><button id="investigation-search" type="button">⌕ case index <kbd>/</kbd></button><button id="investigation-dense" type="button" aria-pressed="${state.evidenceDense}">⌗ dense</button><button id="investigation-reset" type="button">↺ reset layout</button></div>
      </header>
      <nav class="case-tabs" aria-label="Case files by year">${newestFirstYearFiles().map((year) => `<button class="case-tab ${isPreliminaryYear(year) ? "preliminary" : ""}" data-year="${h(year)}" aria-current="${year === state.year}">CASE ${h(yearLabel(year, true))}</button>`).join("")}</nav>
      ${preliminaryNotice(state.year)}
      <div class="case-slip ${preliminary ? "preliminary" : ""}"><b>CASE ${h(yearLabel(state.year))}</b><strong>${preliminary ? "PRELIMINARY WEB RESEARCH LEADS" : "TOP 10 WEB HACKING TECHNIQUES"}</strong><span>${preliminary ? `${items.length} unranked leads · AI-collected · subject to change` : `${winners.length} exhibits pinned · ${nominees.length} supporting leads`} · ${archived}/${items.length} on file</span></div>
      <div class="investigation-board-frame"><div class="investigation-board ${state.evidenceDense ? "dense" : ""}" id="investigation-board"><svg id="investigation-strings" aria-hidden="true"></svg></div></div>
      <footer class="investigation-key">${preliminary ? `<span><i class="gold"></i> Preliminary, unranked lead</span>` : `<span><i class="red"></i> Top 10 evidence</span><span><i class="gold"></i> Supporting lead</span>`}<span><i class="grey"></i> Local copy missing</span><span>Drag cards to rearrange the case. Select one to inspect its Markdown, PDF and source.</span></footer>
    </section>`;

  $("#investigation-dense").addEventListener("click", () => {
    state.evidenceDense = !state.evidenceDense;
    $("#investigation-dense").setAttribute("aria-pressed", String(state.evidenceDense));
    $("#investigation-board").classList.toggle("dense", state.evidenceDense);
    layoutInvestigationBoard();
  });
  $("#investigation-reset").addEventListener("click", layoutInvestigationBoard);
  $("#investigation-search").addEventListener("click", () => $("#global-search").focus());
  investigationResizeObserver = new ResizeObserver((entries) => {
    const width = Math.round(entries[0]?.contentRect.width || 0);
    const previous = Number($("#investigation-board")?.dataset.layoutWidth || 0);
    if (width && Math.abs(width - previous) > 16) layoutInvestigationBoard();
  });
  investigationResizeObserver.observe($("#investigation-board"));
  requestAnimationFrame(() => {
    $(".case-tab[aria-current='true']")?.scrollIntoView({ block: "nearest", inline: "center" });
    layoutInvestigationBoard();
  });
}

function investigationMetrics() {
  return state.evidenceDense
    ? { cellW: 112, cellH: 92, topW: 128, nomineeW: 98, pad: 18, topPad: 24 }
    : { cellW: 178, cellH: 158, topW: 204, nomineeW: 150, pad: 24, topPad: 30 };
}

function layoutInvestigationBoard() {
  const board = $("#investigation-board");
  if (!board || state.view !== "evidence") return;
  const items = [...itemsForYear(state.year)].sort((a, b) => Number(b.section === "winner") - Number(a.section === "winner") || byRankThenTitle(a, b));
  const metrics = investigationMetrics();
  const boardWidth = Math.max(280, board.clientWidth || 900);
  const columns = Math.max(2, Math.floor((boardWidth - metrics.pad * 2) / metrics.cellW));
  const rows = Math.max(2, Math.ceil(items.length / columns));
  const boardHeight = rows * metrics.cellH + metrics.topPad + metrics.pad + 36;
  const centreX = (columns - 1) / 2;
  const centreY = (rows - 1) / 2;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = (column - centreX) * metrics.cellW;
      const y = (row - centreY) * metrics.cellH;
      cells.push({ row, column, distance: Math.hypot(x, y) });
    }
  }
  cells.sort((a, b) => a.distance - b.distance);
  investigationCardInfo = new Map();
  board.dataset.layoutWidth = String(Math.round(boardWidth));
  board.style.minHeight = `${boardHeight}px`;
  board.innerHTML = `<svg id="investigation-strings" aria-hidden="true"></svg>${items.map((item, index) => {
    const cell = cells[index] || cells.at(-1);
    const random = seededRandom(hashString(item.id));
    const winner = item.section === "winner";
    const width = winner ? metrics.topW : metrics.nomineeW;
    const x = clampNumber(metrics.pad + cell.column * metrics.cellW + (metrics.cellW - width) / 2 + (random() - .5) * metrics.cellW * .34, 4, boardWidth - width - 4);
    const y = clampNumber(metrics.topPad + cell.row * metrics.cellH + (random() - .5) * metrics.cellH * .26, 4, boardHeight - 60);
    const rotation = state.motionReduced ? 0 : (random() - .5) * (winner ? 6.5 : 9);
    const pinOffset = (random() - .5) * width * .4;
    investigationCardInfo.set(item.id, { item, x, y, width, pinOffset, winner, missing: !item.archived });
    return `<button type="button" class="investigation-card ${winner ? "top-evidence" : "supporting-evidence"} ${item.archived ? "" : "evidence-stub"} ${item.read ? "is-read" : ""} ${item.favourite ? "is-favourite" : ""}" data-artifact="${h(item.id)}" style="--card-rotation:${rotation.toFixed(2)}deg;left:${Math.round(x)}px;top:${Math.round(y)}px" aria-label="${h(`${item.rank ? `Rank ${item.rank}: ` : ""}${item.title}. ${item.archived ? "Local copy on file." : "Original source only."}${item.favourite ? " Favourite." : ""}`)}"><i class="evidence-pin ${item.archived ? winner ? "red" : "gold" : "grey"}" style="left:calc(50% + ${Math.round(pinOffset)}px)"></i>${winner ? `<span class="evidence-stamp">RANK #${item.rank}</span>` : ""}<strong>${h(item.title)}</strong>${item.archived ? `<small>${h(item.publisher || item.topic)} · ${h(item.kind)}</small>` : `<small class="missing-label">Evidence missing — original link only</small>`}${videoMark(item, "evidence-video")}${item.favourite ? `<b class="evidence-favourite">★ SAVED</b>` : ""}${item.read ? `<b class="evidence-read">READ</b>` : ""}</button>`;
  }).join("")}`;

  if (!window.matchMedia("(max-width: 560px)").matches) {
    $$(".investigation-card", board).forEach(makeInvestigationCardDraggable);
  }
  drawInvestigationStrings();
}

function investigationPinPoint(info) {
  return { x: info.x + info.width / 2 + info.pinOffset, y: info.y + (state.evidenceDense ? 7 : 11) };
}

function drawInvestigationStrings() {
  const board = $("#investigation-board");
  const svg = $("#investigation-strings");
  if (!board || !svg) return;
  const entries = [...investigationCardInfo.values()];
  const hub = entries.filter((info) => info.winner && !info.missing).sort((a, b) => (a.item.rank || 99) - (b.item.rank || 99))[0];
  svg.setAttribute("viewBox", `0 0 ${board.clientWidth} ${board.clientHeight}`);
  svg.replaceChildren();
  if (!hub) return;
  const start = investigationPinPoint(hub);
  const pathData = entries.filter((info) => info.winner && !info.missing && info !== hub).map((info) => {
    const end = investigationPinPoint(info);
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    return `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q${((start.x + end.x) / 2).toFixed(1)} ${((start.y + end.y) / 2 + Math.min(64, 14 + distance * .1)).toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
  }).join(" ");
  if (!pathData) return;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#c0232c");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("opacity", ".92");
  svg.appendChild(path);
}

function makeInvestigationCardDraggable(card) {
  const info = investigationCardInfo.get(card.dataset.artifact);
  if (!info) return;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let originalX = 0;
  let originalY = 0;
  let moving = false;
  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    originalX = info.x;
    originalY = info.y;
    moving = false;
    card.setPointerCapture?.(pointerId);
  });
  card.addEventListener("pointermove", (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!moving && Math.hypot(deltaX, deltaY) > 6) {
      moving = true;
      card.classList.add("dragging");
    }
    if (!moving) return;
    const board = $("#investigation-board");
    info.x = clampNumber(originalX + deltaX, 2, board.clientWidth - info.width - 2);
    info.y = clampNumber(originalY + deltaY, 2, board.clientHeight - 40);
    card.style.left = `${Math.round(info.x)}px`;
    card.style.top = `${Math.round(info.y)}px`;
    if (info.winner && !info.missing) drawInvestigationStrings();
  });
  const finish = (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    card.releasePointerCapture?.(pointerId);
    pointerId = null;
    if (moving) {
      card.classList.remove("dragging");
      card.dataset.dragged = "true";
      drawInvestigationStrings();
    }
    moving = false;
  };
  card.addEventListener("pointerup", finish);
  card.addEventListener("pointercancel", finish);
}

function destroyInvestigationLayout() {
  investigationResizeObserver?.disconnect();
  investigationResizeObserver = null;
  investigationCardInfo = new Map();
}

function annualPdfPath(year) {
  if (!YEAR_FILES.includes(year) || yearRecordFor(year).ranked === false) return "";
  const combined = ["2006", "2012", "2013", "2014", "2015"];
  const file = combined.includes(year) ? `${year}-nominees-and-top10.pdf` : `${year}-top10.pdf`;
  return `original-listings/${file}`;
}

function sourcePanelMarkup(item) {
  const relations = { "same-work": "Same research", part: "Series part", "follow-up": "Follow-up", analysis: "Additional analysis", reproduction: "Reproduction", background: "Earlier or background research", translation: "Translation", alternate: "Alternate edition", related: "Related source" };
  return `<h3 id="artifact-sources-title">Sources and further reading <span>${item.links.length}</span></h3>
    <p class="source-intro">Read the main source, follow the series, or explore related explanations and recordings. Each source has its own credit and available copies.</p>
    <div class="source-list">${item.links.map((link, index) => {
      const details = link.details || {};
      const title = details.title || link.label;
      const byline = [...new Set([...(details.authors || []), details.publisher || hostOf(link.url)])].filter(Boolean).join(" · ");
      const original = safeExternalUrl(link.url);
      const md = safeArchivePath(link.mdPath, "md"), pdf = safeArchivePath(link.pdfPath, "pdf");
      const facts = [["Relationship", relations[details.relationship]], ["Part", details.sequence], ["Published", details.published], ["Source type", details.sourceKind || details.kind], ["Language", details.language], ["Channel", details.channel], ["Duration", details.minutes ? `${details.minutes} minutes` : ""], ["Archive updated", details.updated?.slice(0, 10)]].filter(([, value]) => value);
      const alternates = (details.alsoAt || []).map(safeExternalUrl).filter((url) => url && url !== original);
      return `<details class="source-card" data-source-index="${index}">
        <summary><span class="source-role">${link.main || index === 0 ? "Main source" : h(link.label === title ? relations[details.relationship] || "Related source" : link.label)}${details.sourceKind ? ` · ${h(details.sourceKind)}` : ""}</span><strong>${h(title)}</strong><span class="source-byline">${h(byline)}${details.published ? ` · ${h(details.published)}` : ""}</span></summary>
        <div class="source-body">
          ${details.context ? `<p class="source-context">${h(details.context)}</p>` : ""}
          ${details.summary ? `<p class="source-summary">${h(details.summary)}</p>` : ""}
          ${facts.length ? `<dl class="source-facts">${facts.map(([label, value]) => `<div><dt>${h(label)}</dt><dd>${h(value)}</dd></div>`).join("")}</dl>` : ""}
          ${details.tags?.length ? `<p class="source-topics"><b>Topics:</b> ${details.tags.map(h).join(", ")}</p>` : ""}
          <div class="source-actions">
            ${md ? `<button type="button" data-source-read="${index}">Read Markdown</button>` : ""}
            ${pdf ? `<button type="button" data-source-pdf="${index}">View PDF</button>` : ""}
            ${original ? `<a href="${h(original)}" target="_blank" rel="noopener noreferrer">${details.sourceKind === "video" ? "Watch video" : details.sourceKind === "audio" ? "Listen" : "Original source"} ↗</a>` : ""}
          </div>
          ${!md && !pdf ? `<p class="source-note">${details.preservation === "link-only" ? "External resource · kept as a link." : "No preserved copy is available for this source."}</p>` : ""}
          ${alternates.length ? `<p class="source-alternates">Also available at: ${alternates.map((url) => `<a href="${h(url)}" target="_blank" rel="noopener noreferrer">${h(hostOf(url))} ↗</a>`).join(" · ")}</p>` : ""}
        </div>
      </details>`;
    }).join("")}</div>`;
}

function renderArtifactSources(item, error = "") {
  const panel = $("#artifact-sources");
  const focused = panel.contains(document.activeElement) ? document.activeElement : null;
  const focusedIndex = focused?.closest("details")?.dataset.sourceIndex;
  const focusSelector = focused?.id === "artifact-sources-title" ? "#artifact-sources-title"
    : focused?.hasAttribute("data-source-read") ? `[data-source-read="${focusedIndex}"]`
    : focused?.hasAttribute("data-source-pdf") ? `[data-source-pdf="${focusedIndex}"]`
    : focused?.tagName === "SUMMARY" ? `[data-source-index="${focusedIndex}"] summary` : "";
  const expanded = new Set(panel.dataset.item === item.id ? $$("details[open]", panel).map((node) => node.dataset.sourceIndex) : []);
  panel.dataset.item = item.id;
  panel.innerHTML = sourcePanelMarkup(item) + (error ? `<p class="source-note" role="status">Additional details could not be loaded. Source links and available copies still work. <button type="button" data-source-retry>Retry</button></p>` : "");
  $$("details", panel).forEach((node) => { node.open = expanded.has(node.dataset.sourceIndex); });
  if (focusSelector) {
    const replacement = $(focusSelector, panel);
    if (replacement) { if (replacement.tagName === "H3") replacement.tabIndex = -1; replacement.focus({ preventScroll: true }); }
  }
  panel.onclick = (event) => {
    const read = event.target.closest("[data-source-read]"), pdf = event.target.closest("[data-source-pdf]");
    if (read || pdf) {
      const source = sourceItemFor(item, Number(read ? read.dataset.sourceRead : pdf.dataset.sourcePdf));
      if (source) read ? openReader(source) : openPdfViewer(source);
    }
    if (event.target.closest("[data-source-retry]")) refreshSourcePanel(item);
  };
}

async function refreshSourcePanel(item) {
  let error = "";
  try { await ensureSourceDetails(item.year); } catch (failure) { error = failure.message; }
  if ($("#artifact-dialog").open && $("#artifact-sources").dataset.item === item.id) renderArtifactSources(item, error);
}

function focusArtifactSources() {
  const heading = $("#artifact-sources-title");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: "start", behavior: "instant" });
}

async function openSourceDetails(item) {
  await openArtifact(item.id);
  focusArtifactSources();
}

let artifactSequence = [];
let artifactCurrentId = "";
let artifactNavigationBusy = false;

function artifactBrowseSequence(item) {
  // Snapshot the originating results so marking read or saving a record does
  // not move its neighbours during this visit. Desk navigation spans pages.
  let ids;
  if (state.query && (searchResumable || !$("#global-results").hidden)) {
    ids = queryItems(state.items, state.query).map(entry => entry.id);
  } else if (state.view === "desk") {
    ids = deskFilteredRecords().map(entry => entry.id);
  } else if (state.view === "constellation" && constellationExperience) {
    ids = constellationExperience.items.map(entry => entry.id);
  } else {
    ids = [...$("#view-root").querySelectorAll("[data-artifact], .term-row [data-term-command]")]
      .filter(element => element.getClientRects().length)
      .map(element => element.dataset.artifact || element.dataset.termCommand.slice("open ".length));
  }
  // Shared links and random records may not belong to the visible results.
  if (!ids.includes(item.id)) ids = itemsForYear(item.year).map(entry => entry.id);
  return [...new Set(ids)];
}

function canNavigateArtifact() {
  return $("#artifact-dialog").open
    && !document.querySelector("dialog[open]:not(#artifact-dialog)")
    && !$("#artifact-talk").classList.contains("is-playing");
}

function updateArtifactNavigation() {
  const index = artifactSequence.indexOf(artifactCurrentId);
  const playing = $("#artifact-talk").classList.contains("is-playing");
  for (const [selector, offset] of [["#artifact-previous", -1], ["#artifact-next", 1]]) {
    const button = $(selector);
    button.disabled = artifactNavigationBusy || playing || index < 0 || !artifactSequence[index + offset];
    button.title = playing ? "Article navigation is paused during video playback" : offset < 0 ? "Previous article (←)" : "Next article (→)";
  }
  $("#artifact-position").textContent = index < 0 ? "" : `${index + 1} / ${artifactSequence.length}`;
}

async function navigateArtifact(offset) {
  if (artifactNavigationBusy || !canNavigateArtifact()) return;
  const id = artifactSequence[artifactSequence.indexOf(artifactCurrentId) + offset];
  if (!id) return;
  const focused = document.activeElement;
  artifactNavigationBusy = true;
  updateArtifactNavigation();
  try {
    await openArtifact(id, { sequence: artifactSequence });
  } catch (error) {
    toast(`The article could not be opened: ${error.message}`);
  } finally {
    artifactNavigationBusy = false;
    updateArtifactNavigation();
    if (canNavigateArtifact() && focused?.matches(".artifact-navigation button") && !focused.disabled) focusWithoutScroll(focused);
  }
}

async function openArtifact(id, { sequence } = {}) {
  if (documentDismissal) await documentDismissal;
  const revision = routeRevision;
  const item = await ensureItemLoaded(id);
  if (!item || revision !== routeRevision) return;
  artifactSequence = sequence ? [...sequence] : artifactBrowseSequence(item);
  artifactCurrentId = item.id;
  $("#reader-dialog").close();
  $("#pdf-dialog").close();
  const dialog = $("#artifact-dialog");
  // The room owns the panel surface; the research topic still owns the narrow
  // record accent. Keeping those as separate signals stops a Museum record from
  // turning green while preserving the useful topic-colour cue.
  dialog.dataset.view = state.view;
  dialog.style.setProperty("--dialog-color", item.topicColor);
  $("#artifact-eyebrow").textContent = `${item.yearLabel || item.year} / ${item.preliminary ? "Preliminary · unranked · subject to change" : item.section === "winner" ? `Top 10 rank #${item.rank}` : item.excluded ? "Held out of vote" : "Other nomination"}`;
  $("#artifact-title").textContent = item.title;
  $("#artifact-badges").innerHTML = [item.topic, item.kind, item.archiveStatus, item.language, item.translated ? "English translation" : ""].filter(Boolean).map((badge) => `<span>${h(badge)}</span>`).join("");
  const contextText = item.preliminary
    ? `This is a ${item.provenance || "provisional"} research lead, not a nomination or Top 10 result. ${yearRecordFor(item.year).notice}`
    : item.rank
    ? `This technique placed #${item.rank} in the ${item.year} Top 10. The archive connects the curated listing to the preserved research and its original source.`
    : `This work was nominated in ${item.year}. It remains part of the long tail of research preserved alongside the winning techniques.`;
  $("#artifact-context").textContent = item.note ? `${contextText} Listing note: ${item.note}.` : contextText;
  // WHAT THE RESEARCH FOUND, above the provenance. Everything else in this
  // dialog describes the archive's handling of the reference; this is the only
  // line about the work itself, so it goes first and it is absent rather than
  // stubbed where nobody has written one yet. Tags are buttons: a reader who
  // recognises the technique should be able to ask for the rest of it without
  // learning the query syntax.
  const digestBox = $("#artifact-digest");
  if (digestBox) {
    const tags = (item.tags || []).map((tag) =>
      `<button type="button" class="tag" data-tag="${h(tag)}" aria-controls="global-results" aria-label="Search all research tagged ${h(tag)}" title="Find all research tagged “${h(tag)}”"><span aria-hidden="true">#</span>${h(tag)}</button>`).join("");
    const collapsible = Boolean(item.summary && item.summary.length > 280);
    digestBox.className = `artifact-digest${collapsible ? " is-collapsible" : ""}`;
    digestBox.innerHTML = item.summary
      ? `<h3>What the research found</h3><p class="artifact-summary">${h(item.summary)}</p>${collapsible ? `<button class="digest-toggle" type="button" aria-expanded="false">Read full summary</button>` : ""}${tags ? `<div class="tags" aria-label="Research topics">${tags}</div>` : ""}`
      : tags ? `<h3>Research topics</h3><div class="tags" aria-label="Research topics">${tags}</div>` : "";
    digestBox.hidden = !(item.summary || tags);
    digestBox.querySelector(".digest-toggle")?.addEventListener("click", (event) => {
      const expanded = digestBox.classList.toggle("is-expanded");
      event.currentTarget.setAttribute("aria-expanded", String(expanded));
      event.currentTarget.textContent = expanded ? "Show less" : "Read full summary";
    });
  }
  const credited = (item.authors || []).join(", ");
  $("#artifact-facts").innerHTML = `
    ${credited ? `<div><dt>Author</dt><dd title="${h(credited)}">${h(credited)}</dd></div>` : ""}
    <div><dt>Publisher</dt><dd title="${h(item.publisher)}">${h(item.publisher || "Unknown")}</dd></div>
    ${item.published ? `<div><dt>Published</dt><dd>${h(item.published)}</dd></div>` : ""}
    <div><dt>Source type</dt><dd>${h(item.kind)}</dd></div>
    <div><dt>Preservation</dt><dd>${h(item.archiveStatus)}</dd></div>
    <div><dt>List citation</dt><dd>${h(`${item.year}.md:${item.line}`)}</dd></div>`;

  const actions = [];
  if (item.mdPath) actions.push(`<button id="open-reader" type="button">▤ Read article</button>`);
  else actions.push(`<span class="disabled">MD unavailable</span>`);
  if (item.pdfPath) actions.push(`<button class="secondary" id="open-pdf-reader" type="button">▧ View PDF</button>`);
  else actions.push(`<span class="disabled">PDF unavailable</span>`);
  // The two buttons above open the English translation for a translated
  // reference; these reach the words the author actually published.
  if (item.originalMdPath) actions.push(`<button class="secondary" id="open-original-reader" type="button">▤ Original ${h(item.language || "language")}</button>`);
  if (item.originalPdfPath) actions.push(`<button class="secondary" id="open-original-pdf" type="button">▧ Original ${h(item.language || "language")} PDF</button>`);
  // THE TALK, where one exists. A plain link rather than an embed, on purpose:
  // the site's CSP allows frames only from itself, and widening frame-src to a
  // video host on a web-security archive is a poor trade for an inline player.
  // Opening out also does the right thing on a phone, where the URL is handed
  // to whichever app the reader has installed rather than to a cramped iframe.
  // Confidence is shown whenever the archive is not certain, so a maybe never
  // looks like a fact.
  // The talk that plays in the block above is NOT repeated here. It was offered
  // twice, one control directly under the other, both opening the same video -
  // which is what made the panel read as bolted on rather than part of the
  // record. Its own open-in-a-new-tab control lives on the block.
  const embedded = playableTalk(item);
  (item.videos || []).forEach((video) => {
    if (embedded && video.url === embedded.url) return;
    const href = safeExternalUrl(video.url);
    if (!href) return;
    // ONLY A CONFIRMED MATCH IS CALLED A TALK. Below that the archive is
    // guessing, and a button that says "DEF CON talk" is a claim; "potential
    // related video" is the same link without the claim, which is what the
    // reader needs to judge it. Name the conference only where the archive is
    // certain - and never a channel name, since "WhiteHat DAST by Synopsys
    // talk" reads as a venue the research never appeared at.
    const label = video.confidence !== "confirmed"
      ? "Potential related video"
      : video.conference ? `${short(video.conference, 24)} talk` : "Watch recording";
    // Runtime belongs on the control, not in a tooltip: it is what tells a
    // reader whether this is the talk or a five-minute lightning slot, and it
    // is the difference the archive sorts these by.
    const runtime = video.minutes ? ` · ${video.minutes} min` : "";
    const hint = video.videoTitle
      ? `${video.videoTitle}${video.channel ? ` — ${video.channel}` : ""} — opens on ${hostOf(href)}`
      : `Opens the recording on ${hostOf(href)}`;
    // The wording already carries the doubt, so the class only needs to keep
    // the two apart visually.
    const uncertain = video.confidence === "confirmed" ? "" : " is-potential";
    actions.push(`<a class="secondary video-action${uncertain}" href="${h(href)}" target="_blank" rel="noopener noreferrer" title="${h(hint)}">▶ ${h(label)}${h(runtime)}</a>`);
  });

  // A rejected URL must not become `href=""`, which silently reloads the app.
  const originalUrl = safeExternalUrl(item.originalUrl);
  actions.push(originalUrl
    ? `<a class="secondary" href="${h(originalUrl)}" target="_blank" rel="noopener noreferrer">↗ Original source</a>`
    : `<span class="disabled">Original source blocked</span>`);
  actions.push(`<button class="secondary" id="open-artifact-sources" type="button" aria-controls="artifact-sources">Sources &amp; details (${item.sourceCount || item.links.length})</button>`);
  const resultsPdf = annualPdfPath(item.year);
  if (resultsPdf) actions.push(`<button class="secondary" id="open-results-pdf" type="button">◇ ${h(item.year)} results</button>`);
  actions.push(`<button class="secondary read-toggle" id="artifact-read-toggle" type="button" aria-pressed="${item.read}">${item.read ? "✓ Read" : "○ Mark as read"}</button>`);
  actions.push(`<button class="secondary favourite-toggle" id="artifact-favourite-toggle" type="button" aria-pressed="${item.favourite}">${item.favourite ? "★ Favourite" : "☆ Add favourite"}</button>`);
  actions.push(`<button class="secondary" id="share-artifact" type="button">⌁ Share record</button>`);
  // Last, with the other actions ABOUT the record rather than into it. Placed
  // among the links it splits the recordings from the original source, and a
  // reader scanning for somewhere to read is made to step over a complaint form.
  actions.push(`<button class="secondary" id="report-inaccuracy" type="button">⚑ Report an inaccuracy</button>`);
  $("#artifact-actions").innerHTML = actions.join("");
  renderArtifactSources(item);
  $("#open-artifact-sources").addEventListener("click", focusArtifactSources);

  $("#open-reader")?.addEventListener("click", () => openReader(item));
  $("#open-pdf-reader")?.addEventListener("click", () => openPdfViewer(item));
  $("#open-original-reader")?.addEventListener("click", () => openReader(item, { original: true }));
  $("#open-original-pdf")?.addEventListener("click", () => openPdfViewer(item, { path: item.originalPdfPath, original: true }));
  $("#open-results-pdf")?.addEventListener("click", () => openPdfViewer(null, {
    path: resultsPdf,
    kind: "listingPdf",
    title: `${item.year} Top 10 results`,
    kicker: `Official archive listing / ${item.year}`
  }));
  renderTalkPanel(item);
  updateArtifactNavigation();
  $("#report-inaccuracy")?.addEventListener("click", () => openReportDialog(item));
  $("#artifact-read-toggle").addEventListener("click", () => setReadState(item));
  $("#artifact-favourite-toggle").addEventListener("click", () => setFavouriteState(item));

  $("#share-artifact").addEventListener("click", () => shareDocument(item));

  syncDocumentUrl(item, "artifact");
  showLockedModal(dialog);
  // A closed dialog has no layout box, so resetting it before showModal()
  // leaves its previous scroll offset intact. Reset after opening and focus,
  // instantly, so every record starts at its heading in every theme.
  // Assign the offsets directly: WebKit can ignore scrollTo() when reopening
  // the same dialog content after an earlier programmatic scroll.
  dialog.scrollTop = 0;
  dialog.scrollLeft = 0;
  refreshSourcePanel(item);
}

function showPdfFallback(message = "The preserved file is still available using the Open PDF or Download controls above.") {
  clearTimeout(pdfLoadTimer);
  $("#pdf-loading").hidden = true;
  $("#pdf-frame").hidden = true;
  $("#pdf-fallback").hidden = false;
  $("#pdf-fallback-message").textContent = message;
}

// Some iPhone browsers can request a desktop user agent, so the UA alone is
// not a dependable signal. A narrow viewport gets the page-by-page reader too;
// the browser-native viewer remains available on normal desktop widths.
function usesInSitePdfReader(userAgent = navigator.userAgent, viewportWidth = globalThis.innerWidth) {
  const iphone = /\b(?:iPhone|iPod)\b/i.test(String(userAgent || ""));
  const narrowViewport = typeof viewportWidth === "number" && viewportWidth > 0 && viewportWidth <= 820;
  return iphone || narrowViewport;
}

const PDF_READER_ORIGIN = "https://irsdl.github.io";
const PDF_READER_PATH = "/webhacklist/pdf-reader.html";
const PDF_READER_SANDBOX = "allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox";

// PDF.js parses archived third-party PDFs on a separate origin. The surrounding
// app therefore keeps its storage and DOM isolated even if a hostile document
// finds a defect in the renderer.
function inSitePdfReaderUrl(pdfUrl, theme = state.readingTheme) {
  const reader = new URL(PDF_READER_PATH, PDF_READER_ORIGIN);
  reader.searchParams.set("file", pdfUrl);
  reader.searchParams.set("theme", theme === "light" ? "light" : "dark");
  if (isDiscoveryView()) reader.searchParams.set("palette", state.view);
  return reader.href;
}

async function verifyPdf(mode, url, path) {
  const token = ++pdfVerifyToken;
  try {
    const response = await fetch(url, { method: "HEAD", credentials: "same-origin", redirect: "error", cache: "default" });
    const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (!response.ok || contentType !== "application/pdf") throw new Error(`Unexpected PDF response (${response.status || "network"}, ${contentType || "unknown type"})`);
    if (token !== pdfVerifyToken || path !== state.pdfPath) return;
    state.pdfBytes = Number(response.headers.get("content-length")) || 0;
    state.pdfVerified = true;
    setPdfView(mode);
  } catch (error) {
    if (token !== pdfVerifyToken || path !== state.pdfPath) return;
    const externalFallback = LARGE_PDF_FALLBACKS.get(path);
    if (externalFallback) {
      $("#pdf-new-tab").href = externalFallback;
      $("#pdf-new-tab").textContent = "Open backup ↗";
      $("#pdf-fallback-open").href = externalFallback;
      $("#pdf-download").href = externalFallback;
      $("#pdf-download").removeAttribute("download");
      $("#pdf-download").target = "_blank";
      $("#pdf-download").rel = "noopener noreferrer";
      $("#pdf-download").textContent = "Backup PDF";
      showPdfFallback("This large document is hosted by the archive's GitHub Pages backup because it exceeds Cloudflare Pages' per-file limit. Open the verified backup in a new tab.");
      return;
    }
    showPdfFallback(`The document could not be safely verified: ${error.message}. Use Open PDF or Download if you trust this local file.`);
  }
}

// Chrome's built-in viewer implements Adobe's `view` parameter and ignores a
// `zoom` it cannot read as a percentage; Firefox's pdf.js implements `zoom` and
// ignores `view`. Stating both is what makes one button fit the page in either
// viewer - the pdf.js spellings on their own did nothing at all in Chrome.
const PDF_OPEN_PARAMETERS = {
  "page-width": "view=FitH&zoom=page-width",
  "page-fit": "view=Fit&zoom=page-fit"
};

// The browser reports its document is in place, which for a large file over a
// slow link can outlast a fixed wait - and the fallback then replaces a
// document that was still on its way. Spend the size the probe advertised as
// extra patience, bounded so a genuine failure still resolves.
function pdfLoadTimeout(base) {
  const megabytes = state.pdfBytes > 0 ? state.pdfBytes / 1_000_000 : 0;
  return Math.min(base + Math.round(megabytes * 2000), 45000);
}

function handlePdfFrameLoad(event) {
  const frame = event.currentTarget;
  // A frame a later view change has already replaced can still settle. Only
  // the one currently in the document may clear the overlay.
  if (frame !== $("#pdf-frame") || !state.pdfPath || !state.pdfFrameUrl || frame.src !== state.pdfFrameUrl) return;
  // A cross-origin reader announces that its own script started. Waiting for
  // that message keeps a transient GitHub error page from looking successful.
  if (state.pdfUsesInSiteReader) return;
  clearTimeout(pdfLoadTimer);
  $("#pdf-loading").hidden = true;
  $("#pdf-fallback").hidden = true;
  frame.hidden = false;
}

// THE TWO VIEW MODES DIFFER ONLY IN THE URL FRAGMENT, and a fragment-only
// change is a same-document navigation: the frame keeps the document it already
// holds, fires no `load` event, and no viewer re-reads its open parameters.
// Assigning `src` in place therefore left the overlay up until the fallback
// timer replaced a perfectly good document with "Open full PDF", and pressing
// the other button could not recover because that assignment was fragment-only
// too. Replacing the element is what forces a real navigation.
//
// The address itself never changes, so that navigation is served from the HTTP
// cache: a view change costs no second download of a multi-megabyte file, which
// a cache-busting parameter would.
function navigatePdfFrame(url, sandbox = "") {
  const current = $("#pdf-frame");
  const frame = current.cloneNode(false);
  frame.removeAttribute("src");
  if (sandbox) frame.setAttribute("sandbox", sandbox);
  else frame.removeAttribute("sandbox");
  frame.hidden = true;
  frame.addEventListener("load", handlePdfFrameLoad);
  current.replaceWith(frame);
  state.pdfFrameUrl = url;
  frame.src = url;
}

function setPdfView(mode) {
  if (!state.pdfPath || !["page-width", "page-fit"].includes(mode)) return;
  const url = archiveUrl(state.pdfPath, state.pdfKind, state.pdfVersion);
  if (!url) return showPdfFallback();
  const documentUrl = LARGE_PDF_FALLBACKS.get(state.pdfPath) || url;
  state.pdfViewMode = mode;
  const frame = $("#pdf-frame");
  $("#pdf-fit-width").classList.toggle("active", mode === "page-width");
  $("#pdf-fit-page").classList.toggle("active", mode === "page-fit");
  $("#pdf-loading").hidden = false;
  $("#pdf-fallback").hidden = true;
  frame.hidden = true;
  clearTimeout(pdfLoadTimer);
  if (!state.pdfVerified) {
    if (LARGE_PDF_FALLBACKS.has(state.pdfPath)) {
      // A backup copy answers no same-origin probe, so nothing here measures
      // it. Being on that list is the measurement: the file is hosted off
      // Cloudflare precisely because it outgrew the per-asset limit.
      state.pdfBytes = Number(ARCHIVE_CATALOGUE?.hosting?.cloudflareMaxAssetBytes) || 0;
      state.pdfVerified = true;
      setPdfView(mode);
      return;
    }
    verifyPdf(mode, url, state.pdfPath);
    return;
  }
  if (state.pdfUsesInSiteReader) {
    navigatePdfFrame(inSitePdfReaderUrl(documentUrl), PDF_READER_SANDBOX);
    pdfLoadTimer = setTimeout(() => showPdfFallback("The in-site page reader did not start. Open the full PDF with the browser or another app instead."), pdfLoadTimeout(12000));
    return;
  }
  if (navigator.pdfViewerEnabled === false) return showPdfFallback();
  navigatePdfFrame(`${documentUrl}#toolbar=1&navpanes=0&${PDF_OPEN_PARAMETERS[mode]}`);
  pdfLoadTimer = setTimeout(showPdfFallback, pdfLoadTimeout(9000));
}

async function openPdfViewer(item, options = {}) {
  if (documentDismissal) await documentDismissal;
  const kind = options.kind === "listingPdf" ? "listingPdf" : "pdf";
  const path = safeArchivePath(options.path || item?.pdfPath, kind);
  // An annual results PDF is not a preserved reference and carries no token.
  const version = kind === "listingPdf" ? ""
    : options.original ? (item?.originalPdfVersion || "") : (item?.pdfVersion || "");
  const url = archiveUrl(path, kind, version);
  if (!path || !url) {
    toast("This PDF path is unavailable or did not pass validation");
    return;
  }

  const externalUrl = LARGE_PDF_FALLBACKS.get(path) || url;

  state.pdfItem = item || null;
  state.pdfPath = path;
  state.pdfKind = kind;
  // The token belongs to the path, so it is held beside it: the verify probe,
  // the frame and the download link must all ask for the same URL.
  state.pdfVersion = options.original ? (item?.originalPdfVersion || "") : (item?.pdfVersion || "");
  state.pdfVerified = false;
  state.pdfFrameUrl = "";
  state.pdfBytes = 0;
  state.pdfUsesInSiteReader = usesInSitePdfReader();
  const title = options.title || item?.title || "Preserved PDF";
  $("#pdf-title").textContent = title;
  const pdfLanguageNote = !item?.translated
    ? "PDF"
    : options.original
      ? `original ${item.language || "source"} PDF`
      : "English translation PDF";
  $("#pdf-kicker").textContent = options.kicker || `${item?.year || "Archive"} / ${(item && creditOf(item)) || item?.topic || "local preservation"} / ${pdfLanguageNote}`;
  const readButton = $("#pdf-read-toggle");
  readButton.hidden = !item;
  const favouriteButton = $("#pdf-favourite-toggle");
  favouriteButton.hidden = !item;
  if (item) {
    readButton.setAttribute("aria-pressed", String(item.read));
    readButton.textContent = item.read ? "✓ Read" : "○ Mark as read";
    favouriteButton.setAttribute("aria-pressed", String(item.favourite));
    favouriteButton.textContent = item.favourite ? "★ Favourite" : "☆ Add favourite";
  }
  $("#pdf-open-markdown").hidden = !item?.mdPath;
  $("#pdf-sources").hidden = !item;
  state.pdfOriginal = Boolean(options.original);
  $("#pdf-links-toggle").hidden = !item?.mdPath;
  togglePdfLinks(false);
  $("#pdf-links").dataset.path = "";
  $("#pdf-new-tab").href = externalUrl;
  $("#pdf-new-tab").textContent = "Open PDF ↗";
  $("#pdf-fallback-open").href = externalUrl;
  $("#pdf-download").href = externalUrl;
  $("#pdf-download").textContent = "Download";
  $("#pdf-download").removeAttribute("target");
  $("#pdf-download").removeAttribute("rel");
  $("#pdf-download").setAttribute("download", path.split("/").at(-1));
  const inSiteReader = state.pdfUsesInSiteReader;
  $("#pdf-fit-width").hidden = inSiteReader;
  $("#pdf-fit-page").hidden = inSiteReader;
  $("#pdf-viewer-note").innerHTML = inSiteReader
    ? "<span>In-site page reader</span> Scroll through every page here. Open PDF uses the browser or system viewer; Download saves a copy for another app."
    : "<span>Browser-native viewer</span> Open PDF uses the browser or system viewer; Download saves a copy for another app. The embedded viewer has its own navigation, search and zoom.";

  [$("#artifact-dialog"), $("#reader-dialog")].forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
  syncDocumentUrl(item, kind === "listingPdf" ? "results" : "pdf");
  const dialog = $("#pdf-dialog");
  showLockedModal(dialog);
  setPdfView(state.pdfViewMode);
}

// A LINK INSIDE AN EMBEDDED PDF CANNOT OPEN A NEW TAB, and that is the viewer's
// decision rather than ours: the browser's own PDF viewer gives its links no
// target, so a click navigates the frame they sit in - which this page's
// `frame-src 'self'` then refuses, so the click does nothing at all.
//
// The alternative is shipping a JavaScript PDF viewer and telling it to target
// a new tab. That would run third-party PDFs - the actual subject matter of this
// archive - as script in this origin, next to the reader's own data, in place of
// the browser's sandboxed viewer process. Not for a link target.
//
// So the links get a route of their own. They are read from the preserved
// Markdown, which for a rendered PDF is the very document that was printed, and
// for a preserved original is the text extracted from it.
const PDF_LINK_LIMIT = 400;
const MAX_MARKDOWN_BYTES = 2_000_000;
const MAX_MARKDOWN_LINES = 20_000;
const MAX_INLINE_MARKERS = 5_000;

// Archived text is untrusted and can otherwise turn a small fetch into a very
// large DOM (for example, one list item per line). Bound both the source and
// the number of structural units before parsing it in either document view.
function validatedMarkdownText(value) {
  const text = String(value ?? "");
  if (text.length > MAX_MARKDOWN_BYTES) {
    throw new Error("Markdown exceeds the safe reader size limit");
  }
  let lines = 1;
  for (let index = 0; index < text.length; index++) {
    if (text.charCodeAt(index) === 10 && ++lines > MAX_MARKDOWN_LINES) {
      throw new Error("Markdown exceeds the safe reader line limit");
    }
  }
  return text;
}

async function responseMarkdownText(response) {
  const advertisedSize = Number(response.headers.get("content-length") || 0);
  if (advertisedSize > MAX_MARKDOWN_BYTES) {
    throw new Error("Markdown exceeds the safe reader size limit");
  }
  return validatedMarkdownText(await response.text());
}

function linksInMarkdown(markdown) {
  const found = new Map();
  const remember = (url, label) => {
    // Raw Markdown, so no HTML escaping layer to undo first.
    const safe = safeExternalUrl(url);
    if (!safe || found.has(safe) || found.size >= PDF_LINK_LIMIT) return;
    found.set(safe, (label || "").replace(/[*_`]/g, "").trim() || safe);
  };
  const body = validatedMarkdownText(markdown);
  for (const match of body.matchAll(/\[([^\]\n]{1,120})\]\((https?:\/\/[^\s)]+)\)/g)) {
    remember(match[2], match[1]);
  }
  for (const match of body.matchAll(/<(https?:\/\/[^>\s]+)>/g)) remember(match[1], "");
  for (const match of body.matchAll(/(?<![("<[])\bhttps?:\/\/[^\s)<>"'\]]+/g)) {
    remember(match[0], "");
  }
  return [...found].map(([url, label]) => ({ url, label }));
}

async function togglePdfLinks(force) {
  const panel = $("#pdf-links");
  const button = $("#pdf-links-toggle");
  const show = force ?? panel.hidden;
  panel.hidden = !show;
  $("#pdf-links-backdrop").hidden = !show;
  button.setAttribute("aria-expanded", String(show));
  button.classList.toggle("active", show);
  if (show) requestAnimationFrame(() => focusWithoutScroll($("#pdf-links-close")));
  if (!show || panel.dataset.path === state.pdfPath) return;

  const list = $("#pdf-links-list");
  const item = state.pdfItem;
  const markdownUrl = archiveUrl(state.pdfOriginal ? item?.originalMdPath : item?.mdPath, "md",
                                 item?.mdVersion);
  if (!markdownUrl) {
    list.innerHTML = `<p>No preserved text accompanies this document, so its links could not be listed.</p>`;
    return;
  }
  list.innerHTML = `<p>Reading the preserved text…</p>`;
  panel.dataset.path = state.pdfPath;
  try {
    const response = await fetch(markdownUrl, { credentials: "same-origin", cache: "default" });
    if (!response.ok) throw new Error(`Markdown returned ${response.status}`);
    const links = linksInMarkdown(await responseMarkdownText(response));
    if (panel.dataset.path !== state.pdfPath) return;
    list.innerHTML = links.length
      ? links.map((link) => `<a href="${h(link.url)}" target="_blank" rel="noopener noreferrer">${h(short(link.label, 70))}<small>${h(link.url)}</small></a>`).join("")
      : `<p>This document carries no outbound links.</p>`;
  } catch (error) {
    panel.dataset.path = "";
    list.innerHTML = `<p>The preserved text could not be read. ${h(error.message)}</p>`;
  }
}

function closePdfLinksAndRestoreFocus() {
  togglePdfLinks(false);
  requestAnimationFrame(() => {
    const button = $("#pdf-links-toggle");
    if (!button.hidden) focusWithoutScroll(button);
  });
}

function clearPdfViewer() {
  if ($("#pdf-dialog").open) return;
  clearTimeout(pdfLoadTimer);
  pdfVerifyToken++;
  pdfLoadTimer = null;
  state.pdfItem = null;
  state.pdfPath = "";
  state.pdfVersion = "";
  state.pdfVerified = false;
  state.pdfBytes = 0;
  state.pdfFrameUrl = "";
  state.pdfUsesInSiteReader = false;
  // Removing src from a live iframe navigates it to about:blank and can add a
  // joint browser-history entry just as the user goes Back. Discard its browsing
  // context instead, so a closed PDF cannot insert another navigation.
  const current = $("#pdf-frame");
  const frame = current.cloneNode(false);
  frame.hidden = true;
  frame.removeAttribute("src");
  frame.removeAttribute("sandbox");
  current.replaceWith(frame);
  $("#pdf-loading").hidden = true;
  $("#pdf-fallback").hidden = true;
  $("#pdf-links").hidden = true;
  $("#pdf-links-backdrop").hidden = true;
  $("#pdf-links").dataset.path = "";
  $("#pdf-links-toggle").setAttribute("aria-expanded", "false");
  $("#pdf-links-toggle").classList.remove("active");
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// SYNTAX HIGHLIGHTING, WITHOUT A LIBRARY. The Content-Security-Policy is
// script-src 'self', so a CDN highlighter is not an option and vendoring one
// for a handful of token classes is not worth the weight. This scans the RAW
// source and escapes every piece as it emits it - never the other way round.
// Highlighting escaped text would mean matching against &quot; and &amp;, and
// one wrong boundary there turns archived exploit text into live markup.
const HL_KEYWORDS = {
  python: "and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield None True False self print",
  javascript: "async await break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return static super switch this throw try typeof var void while with yield null true false undefined",
  php: "abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile extends final finally fn for foreach function global if implements include include_once instanceof insteadof interface isset list namespace new or print private protected public require require_once return static switch throw trait try unset use var while xor yield null true false",
  java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while null true false",
  ruby: "alias and begin break case class def defined do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield puts require",
  elixir: "after and case catch cond def defmodule defp do else end fn for if import in not or quote raise rescue require try unless unquote use when nil true false",
  sql: "select from where insert update delete into values join left right inner outer on group by order having limit union all as and or not null convert cast char varchar int",
  bash: "if then else elif fi for while do done case esac function return export local echo cd exit",
  go: "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false",
};
HL_KEYWORDS.js = HL_KEYWORDS.javascript;
HL_KEYWORDS.nodejs = HL_KEYWORDS.javascript;
HL_KEYWORDS.jinja = HL_KEYWORDS.python;
HL_KEYWORDS.py = HL_KEYWORDS.python;
HL_KEYWORDS.sh = HL_KEYWORDS.bash;
HL_KEYWORDS.shell = HL_KEYWORDS.bash;

// Which comment openers are real for a language: '#' starts a comment in Python
// and Ruby but is a fragment in a URL and an id selector in CSS, so treating it
// as a comment everywhere greys out half of an HTTP listing.
const HL_HASH = new Set(["python", "py", "ruby", "bash", "sh", "shell", "php", "yaml", "jinja"]);
const HL_SLASH = new Set(["javascript", "js", "nodejs", "java", "php", "go", "c", "cpp", "csharp", "rust", "kotlin", "swift", "scala"]);

function highlightCode(code, language) {
  const lang = String(language || "").toLowerCase();
  const words = Object.hasOwn(HL_KEYWORDS, lang) && typeof HL_KEYWORDS[lang] === "string"
    ? HL_KEYWORDS[lang]
    : "";
  // An unknown or deliberately plain language still gets escaped, just not lit.
  if (!words && !HL_HASH.has(lang) && !HL_SLASH.has(lang)) return h(code);
  const keywords = new Set((words || "").split(" ").filter(Boolean));
  const parts = ["(\\/\\*[\\s\\S]*?\\*\\/|<!--[\\s\\S]*?-->)"];
  const lineComment = [HL_SLASH.has(lang) ? "\\/\\/[^\\n]*" : "", HL_HASH.has(lang) ? "#[^\\n]*" : ""]
    .filter(Boolean).join("|");
  parts.push(lineComment ? `(${lineComment})` : "(?!)()");
  parts.push('("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)');
  parts.push("(\\b\\d[\\w.]*\\b)");
  parts.push("([A-Za-z_$][\\w$]*)");
  const scanner = new RegExp(parts.join("|"), "g");
  let out = "", last = 0, match;
  while ((match = scanner.exec(code))) {
    out += h(code.slice(last, match.index));
    const [text, block, line, string, number, word] = match;
    if (block || line) out += `<span class="tok-com">${h(text)}</span>`;
    else if (string) out += `<span class="tok-str">${h(text)}</span>`;
    else if (number) out += `<span class="tok-num">${h(text)}</span>`;
    else if (word && keywords.has(word)) out += `<span class="tok-kw">${h(text)}</span>`;
    else out += h(text);
    last = match.index + text.length;
  }
  return out + h(code.slice(last));
}

function formatInlineEmphasis(value) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,!?:;])/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
}

function inlineMarkdown(value) {
  // Inline syntax can multiply a short source into several DOM nodes. Reject a
  // deliberately marker-dense paragraph before any regex or token expansion;
  // ordinary prose and the archive's long code-bearing lines remain far below
  // this ceiling.
  let markerCount = 0;
  for (const character of String(value ?? "")) {
    if ((character === "`" || character === "[") && ++markerCount > MAX_INLINE_MARKERS) {
      throw new Error("Markdown exceeds the safe inline-complexity limit");
    }
  }
  const safeTokens = [];
  const hold = (html) => {
    const token = `%%<inline:${safeTokens.length}>%%`;
    safeTokens.push(html);
    return token;
  };
  // The raw "<" in the placeholder cannot appear in escaped text, so document
  // content can never collide with (or forge) one of these trusted tokens.
  let output = h(value).replace(/`([^`\n]{1,10000})`/g, (_, code) => {
    return hold(`<code>${code}</code>`);
  });

  // Only repository-owned figure crops can load automatically. The exact
  // relative syntax cannot resolve to an arbitrary URL or escape the archive.
  output = output.replace(/!\[([^\[\]\n]{0,500})\]\(\.\.\/\.\.\/(figures\/[a-z0-9-]+\/[a-z0-9._-]+\/[a-z0-9_-][a-z0-9._-]*\.png)\)/gi, (_, alt, relative) => {
    const path = safeArchivePath(`archived-references/${relative}`, "figure");
    return path ? hold(`<span class="archive-figure"><img src="${h(archiveUrl(path, "figure"))}" alt="${alt}" loading="lazy" decoding="async"></span>`) : alt;
  });

  // Preserved Markdown is third-party input. Loading its images automatically
  // would let a document probe private-network URLs, make cookie-bearing image
  // requests, or track every reader. Keep the URL available behind an explicit
  // click; the archived PDF remains the durable visual copy where one exists.
  output = output.replace(/!\[([^\[\]\n]{0,500})\]\((https?:\/\/[^\s)]{1,2048})(?:\s+&quot;[^&\n]{0,500}&quot;)?\)/g, (_, alt, url) => {
    const linkUrl = safeMarkdownUrl(url);
    if (!linkUrl) return alt;
    const label = formatInlineEmphasis(alt || "External article image");
    return hold(`<span class="external-image-reference"><span>${label}</span><a href="${h(linkUrl)}" target="_blank" rel="noopener noreferrer">Open publisher image ↗</a></span>`);
  });
  output = output.replace(/\[([^\[\]\n]{1,500})\]\((https?:\/\/[^\s)]{1,2048})(?:\s+&quot;[^&\n]{0,500}&quot;)?\)/g, (_, label, url) => {
    const safe = safeMarkdownUrl(url);
    return safe ? hold(`<a href="${h(safe)}" target="_blank" rel="noopener noreferrer">${formatInlineEmphasis(label)}</a>`) : label;
  });
  output = output.replace(/&lt;(https?:\/\/[^&\s]{1,2048})&gt;/g, (_, url) => {
    const safe = safeMarkdownUrl(url);
    return safe ? hold(`<a href="${h(safe)}" target="_blank" rel="noopener noreferrer">${h(safe)}</a>`) : url;
  });
  output = formatInlineEmphasis(output);
  // Function form means "$&", "$'" etc. inside untrusted code spans are not
  // replacement patterns. A link can contain one earlier code token in its
  // label, hence two bounded passes; replacing one token at a time was
  // quadratic and let a marker-dense article freeze the reader.
  const tokenPattern = /%%<inline:(\d+)>%%/g;
  const restoreTokens = (current) => current.replace(tokenPattern, (token, index) =>
    Number(index) < safeTokens.length ? safeTokens[Number(index)] : token);
  output = restoreTokens(restoreTokens(output));
  return output;
}

function demotedHeading(line) {
  return line.length > 300 && /^#{1,6}\s+/.test(line)
    ? line.replace(/^#{1,6}\s*/, "")
    : line;
}

async function ensureDiagramIndex() {
  if (!ARCHIVE_CATALOGUE?.diagramIndex) return;
  if (!diagramRequest) {
    diagramRequest = (async () => {
      const response = await fetch(`data/diagrams.json?v=${encodeURIComponent(ARCHIVE_CATALOGUE.version)}`, { credentials: "same-origin", cache: "default" });
      if (!response.ok) throw new Error(`Diagram index returned ${response.status}`);
      const index = await response.json();
      if (index?.schema !== 1 || index.version !== ARCHIVE_CATALOGUE.version || !index.diagrams || typeof index.diagrams !== "object" || Array.isArray(index.diagrams)) throw new Error("Diagram index does not match this archive");
      for (const value of Object.values(index.diagrams)) if (!safeArchivePath(value, "diagram")) throw new Error("Invalid preserved diagram path");
      ARCHIVE_DIAGRAMS = index.diagrams;
    })().catch((error) => { diagramRequest = null; throw error; });
  }
  return diagramRequest;
}

function markdownDocument(markdown) {
  let body = validatedMarkdownText(markdown).replace(/^\uFEFF/, "");
  if (body.startsWith("---\n") || body.startsWith("---\r\n")) {
    const end = body.indexOf("\n---", 4);
    if (end !== -1) body = body.slice(body.indexOf("\n", end + 1) + 1);
  }

  const lines = body.split(/\r?\n/);
  const html = [];
  const headings = [];
  const usedSlugs = new Map();
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const makeSlug = (title) => {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = usedSlugs.get(base) || 0;
    usedSlugs.set(base, count + 1);
    // The md- namespace keeps untrusted heading ids from colliding with (and
    // clobbering lookups of) the application's own element ids.
    return `md-${count ? `${base}-${count + 1}` : base}`;
  };

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const next = lines[index + 1] || "";
    const openingFence = line.trim().match(/^(`{3,}|~{3,})(.*)$/);
    if (openingFence) {
      flushParagraph();
      const fence = openingFence[1];
      const language = openingFence[2].replace(/[^a-z0-9_-]/gi, "");
      const code = [];
      index++;
      while (index < lines.length) {
        const closing = lines[index].trim().match(/^(`+|~+)$/);
        if (closing && closing[1][0] === fence[0] && closing[1].length >= fence.length) break;
        code.push(lines[index++]);
      }
      const source = code.join("\n");
      const diagrams = ARCHIVE_DIAGRAMS;
      const diagramPath = language === "mermaid" && Object.hasOwn(diagrams, source.trim())
        ? safeArchivePath(diagrams[source.trim()], "diagram") : "";
      const listing = `<pre><code${language ? ` class="language-${h(language)}"` : ""}>${highlightCode(source, language)}</code></pre>`;
      html.push(diagramPath
        ? `<figure class="archive-figure"><img src="${h(archiveUrl(diagramPath, "diagram"))}" alt="Diagram reconstructed from the preserved source" loading="lazy"><details><summary>Diagram source</summary>${listing}</details></figure>`
        : listing);
      continue;
    }
    // A HEADING THE LENGTH OF AN ARTICLE IS NOT A HEADING. Some sources put a
    // whole slide's transcript inside an `<h2>`, and one blog leaves its article
    // in a hidden element as Markdown source whose newlines HTML collapses: the
    // reader then renders thousands of words as one wall of display type.
    // Measured over 13,865 archived headings, the median is 24 characters and the
    // 99th percentile is 206, so nothing above 300 is a title anybody wrote - it
    // is 30 lines across 13 documents, every one of them a flattened paragraph.
    // The ARCHIVE keeps what the source said; only the rendering is capped.
    const heading = line.length <= 300 ? line.match(/^(#{1,4})\s+(.+)$/) : null;
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const title = heading[2].replace(/\s+#+$/, "");
      const slug = makeSlug(title);
      headings.push({ level, title: title.replace(/[*_`]/g, ""), slug });
      html.push(`<h${level} id="${slug}">${inlineMarkdown(title)}</h${level}>`);
      continue;
    }
    if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(line)) {
      flushParagraph();
      html.push("<hr>");
      continue;
    }
    if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(next)) {
      flushParagraph();
      const splitRow = (row) => {
        const source = row.trim().replace(/^\|/, "");
        const cells = [];
        let cell = "";
        let codeTicks = 0;
        for (let offset = 0; offset < source.length; offset++) {
          const character = source[offset];
          if (character === "\\" && source[offset + 1] === "|") {
            cell += "|";
            offset++;
          } else if (character === "`") {
            let count = 1;
            while (source[offset + count] === "`") count++;
            if (!codeTicks) codeTicks = count;
            else if (codeTicks === count) codeTicks = 0;
            cell += "`".repeat(count);
            offset += count - 1;
          } else if (character === "|" && !codeTicks) {
            cells.push(cell.trim());
            cell = "";
          } else {
            cell += character;
          }
        }
        if (cell.trim() || !source.endsWith("|")) cells.push(cell.trim());
        return cells;
      };
      const headers = splitRow(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(splitRow(lines[index++]));
      index--;
      html.push(`<table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^\s*>/.test(line)) {
      flushParagraph();
      const quote = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ""));
      index--;
      html.push(`<blockquote><p>${inlineMarkdown(quote.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\s*[-+*]\s+/.test(line)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^\s*[-+*]\s+/.test(lines[index])) items.push(lines[index++].replace(/^\s*[-+*]\s+/, ""));
      index--;
      html.push(`<ul>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) items.push(lines[index++].replace(/^\s*\d+[.)]\s+/, ""));
      index--;
      html.push(`<ol>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ol>`);
      continue;
    }
    if (!line.trim()) flushParagraph();
    // An over-long heading reaches here instead of the heading branch above, and
    // printing its `##` markers in front of the prose is worse than the prose.
    // Conditional on it BEING one: `#nofilter` in a sentence is not a heading and
    // must keep its hash.
    else paragraph.push(demotedHeading(line).trim());
  }
  flushParagraph();
  return { html: html.join("\n"), headings };
}

// `options.original` opens the source-language file of a translated reference.
// Everything else about the view is identical - it is the same preserved
// document, in the words the author wrote it in.
async function openReader(item, options = {}) {
  if (documentDismissal) await documentDismissal;
  const showOriginal = Boolean(options.original && item?.originalMdPath);
  const readerPath = showOriginal ? item.originalMdPath : item?.mdPath;
  if (!readerPath) return;
  const markdownUrl = archiveUrl(readerPath, "md", item?.mdVersion);
  if (!markdownUrl) return toast("This Markdown path did not pass validation");
  const requestToken = ++readerRequestToken;
  const originalUrl = safeExternalUrl(item.originalUrl);
  state.readerItem = item;
  state.readerOriginal = showOriginal;
  const dialog = $("#reader-dialog");
  const scroll = $("#reader-scroll");
  $("#reader-title").textContent = item.title;
  const languageNote = !item.translated
    ? "preserved Markdown"
    : showOriginal
      ? `original ${item.language || "source"} text`
      : "English translation";
  $("#reader-kicker").textContent = `${yearLabel(item.year)} / ${creditOf(item) || item.topic} / ${languageNote}`;
  $("#reader-content").innerHTML = `<div class="reader-loading"><i></i><p>Opening preserved Markdown…</p></div>`;
  $("#reader-toc").innerHTML = "";
  $("#reader-progress-bar").style.width = "0";
  // The switch to the other view of the same document leads, and sits in the
  // same first position in the PDF viewer, so one place on the toolbar always
  // moves between Markdown and PDF.
  $("#reader-actions").innerHTML = `
    ${item.pdfPath ? `<button id="reader-open-pdf" type="button">▧ PDF</button>` : ""}
    <button id="reader-sources" type="button">Sources &amp; details</button>
    <button class="reading-theme-toggle" id="reader-theme-toggle" type="button" aria-label="Switch to light reading theme">☀ Light</button>
    <button id="reader-share" type="button" title="Share this exact Markdown view">⌁ Share</button>
    <button id="reader-read-toggle" type="button" aria-pressed="${item.read}">${item.read ? "✓ Read" : "○ Mark as read"}</button>
    <button id="reader-favourite-toggle" type="button" aria-pressed="${item.favourite}">${item.favourite ? "★ Favourite" : "☆ Add favourite"}</button>
    <a href="${h(markdownUrl)}" target="_blank" rel="noopener noreferrer">Raw MD</a>
    ${item.originalMdPath ? `<button id="reader-language-toggle" type="button">${showOriginal ? "⇄ English" : `⇄ ${h(item.language ? item.language.toUpperCase() : "Original language")}`}</button>` : ""}
    ${originalUrl ? `<a href="${h(originalUrl)}" target="_blank" rel="noopener noreferrer">Original ↗</a>` : `<span class="disabled">Original blocked</span>`}`;
  $("#reader-theme-toggle").addEventListener("click", toggleReadingTheme);
  $("#reader-sources").addEventListener("click", () => openSourceDetails(item));
  $("#reader-share").addEventListener("click", () => shareDocument(item, "reader"));
  $("#reader-read-toggle").addEventListener("click", () => setReadState(item));
  $("#reader-favourite-toggle").addEventListener("click", () => setFavouriteState(item));
  $("#reader-open-pdf")?.addEventListener("click", () => openPdfViewer(item));
  $("#reader-language-toggle")?.addEventListener("click", () => openReader(item, { original: !showOriginal }));
  applyReadingTheme();
  if ($("#artifact-dialog").open) $("#artifact-dialog").close();
  if ($("#pdf-dialog").open) $("#pdf-dialog").close();
  syncDocumentUrl(item, "reader");
  showLockedModal(dialog);
  scroll.scrollTop = 0;

  try {
    const response = await fetch(markdownUrl, { credentials: "same-origin", cache: "default" });
    if (!response.ok) throw new Error(`Markdown returned ${response.status}`);
    const markdown = await responseMarkdownText(response);
    if (requestToken !== readerRequestToken || state.readerItem !== item) return;
    if (/^```mermaid\s*$/m.test(markdown)) {
      // If the optional figures are unavailable, retain readable source code.
      await ensureDiagramIndex().catch((error) => console.warn(error.message));
      if (requestToken !== readerRequestToken || state.readerItem !== item) return;
    }
    const documentView = markdownDocument(markdown);
    $("#reader-content").innerHTML = `<div class="archive-warning">Safe reader mode: third-party HTML is escaped, scripts cannot run, and external links and images require a separate click.</div>${documentView.html}`;
    $("#reader-toc").innerHTML = documentView.headings.slice(0, 40).map((heading) => `<button class="${heading.level > 2 ? "sub" : ""}" data-reader-target="${h(heading.slug)}">${h(short(heading.title, 52))}</button>`).join("");
  } catch (error) {
    if (requestToken !== readerRequestToken) return;
    $("#reader-content").innerHTML = `<div class="empty-state"><p>The preserved Markdown could not be opened.</p><small>${h(error.message)}</small></div>`;
  }
}

// —— Research submission ————————————————————————————————————————————————
// The archive cannot take a submission itself and should not try to. What it
// can do is the part GitHub cannot: answer the question worth asking first -
// is this source already recorded? - before anyone writes a report out, and
// then hand the issue form everything the page already knows.

function issueFieldText(value, limit = ISSUE_FIELD_LIMIT) {
  return String(value ?? "")
    .replace(/\r/g, "")
    // Everything Unicode calls "other" - control, format, bidi override -
    // except the newline a textarea legitimately holds.
    .replace(/[^\P{C}\n]/gu, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limit);
}

function issueUrl(form, fields = {}) {
  const template = Object.hasOwn(CONTRIBUTION_FORMS, form) ? CONTRIBUTION_FORMS[form] : "";
  if (!template) return `${REPOSITORY_URL}/issues/new/choose`;
  const url = new URL(`${REPOSITORY_URL}/issues/new`);
  url.searchParams.set("template", template);
  for (const [field, value] of Object.entries(fields)) {
    const text = issueFieldText(value);
    if (!text) continue;
    url.searchParams.set(field, text);
    if (url.href.length > ISSUE_URL_LIMIT) url.searchParams.delete(field);
  }
  return url.href;
}

function submissionDraft() {
  const typedUrl = $("#contribute-url").value.trim();
  return {
    typedUrl,
    url: safeExternalUrl(typedUrl),
    title: $("#contribute-research-title").value.trim(),
    year: $("#contribute-year").value,
    researchers: $("#contribute-authors").value.trim(),
    isAuthor: $("#contribute-is-author").checked,
    whatsNew: $("#contribute-why").value.trim()
  };
}

function submissionIssueUrl(draft) {
  const heading = compact(draft.title || hostOf(draft.url)).slice(0, 120);
  return issueUrl("research", {
    relationship: draft.isAuthor ? "I am the author or a co-author" : "",
    title: heading ? `[Research] ${heading}` : "",
    "research-url": draft.url,
    "research-title": draft.title,
    year: draft.year,
    researchers: draft.researchers,
    "whats-new": draft.whatsNew
  });
}

// The same draft for somewhere that is not GitHub - a mail, a DM, a note to
// self. Empty when there is nothing to carry, so the button can say so.
function submissionMarkdown(draft) {
  if (!draft.url && !draft.title) return "";
  return [
    `**${draft.title || "Untitled research"}**`,
    draft.url ? `Source: ${draft.url}` : "",
    draft.year ? `Year published: ${draft.year}` : "",
    draft.researchers ? `Researcher(s): ${draft.researchers}` : "",
    draft.isAuthor ? "Your connection to this research: I am the author or a co-author" : "",
    draft.whatsNew ? `\nWhat is new about it:\n${draft.whatsNew}` : ""
  ].filter(Boolean).join("\n");
}

// The years a submission can name, read off the published collections so that
// adding a year needs no second list here. One collection can cover two years -
// 2016-17 - and answers for both.
function submissionYears() {
  const years = new Set();
  for (const id of YEAR_FILES) {
    const match = /^(\d{4})(?:-(\d{2}))?/.exec(id);
    if (!match) continue;
    const start = Number(match[1]);
    const end = match[2] ? Number(`${match[1].slice(0, 2)}${match[2]}`) : start;
    for (let year = start; year <= Math.max(start, end); year++) years.add(String(year));
  }
  return [...years].sort((a, b) => Number(b) - Number(a));
}

// Words that would match half the archive. A title term that survives this is
// worth comparing; "the web attack" is not.
const SUBMISSION_STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "into", "your", "you", "that", "this", "how", "why", "what", "when",
  "are", "was", "not", "all", "new", "novel", "using", "use", "via", "web", "http", "https", "www",
  "attack", "attacks", "attacking", "security", "part", "revisited", "introduction", "research", "technique", "techniques"
]);

function submissionTokens(value) {
  return (String(value || "").toLowerCase().match(/[a-z0-9][a-z0-9+#.'-]{2,}/g) || [])
    .filter((word) => !SUBMISSION_STOPWORDS.has(word));
}

// Parameters that name where a reader came from rather than what they are
// reading. Only these are dropped: a query is not decoration on a blog of the
// era this archive covers - `?p=123` IS the article, and discarding it would
// report every post on such a site as the same research.
const TRACKING_PARAMETERS = /^(utm_|mc_|_hs)|^(ref|referrer|source|share|fbclid|gclid|igshid|mkt_tok|spm)$/i;

// A submitted URL rarely matches a cited one character for character: the same
// article arrives as http, with www, with a campaign tag, or wrapped in a
// Wayback replay. The loose key answers those. The exact key is tried first, so
// a looser reading never overrides a literal match.
function submissionUrlKeys(value) {
  const direct = safeExternalUrl(value);
  if (!direct) return [];
  const replayed = /^https?:\/\/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i.exec(direct);
  const target = (replayed && safeExternalUrl(replayed[1])) || direct;
  const keys = [normalizeUrl(target)];
  try {
    const url = new URL(target);
    for (const key of [...url.searchParams.keys()]) if (TRACKING_PARAMETERS.test(key)) url.searchParams.delete(key);
    const rest = url.searchParams.toString();
    keys.push(`${url.hostname.replace(/^www\./i, "").toLowerCase()}${url.pathname.replace(/\/+$/, "")}${rest ? `?${rest}` : ""}`);
  } catch { /* the exact key alone still answers */ }
  return keys;
}

let submissionIndexCache = null;
function submissionIndex() {
  if (submissionIndexCache?.size === state.items.length) return submissionIndexCache;
  const urls = new Map();
  const titles = [];
  for (const item of state.items) {
    // Every link on the research, not only the one the reader opens: a talk is
    // cited as its video and submitted as its slides just as often.
    for (const link of [item, ...(item.links || [])]) {
      for (const key of submissionUrlKeys(link.url || link.originalUrl)) {
        if (!urls.has(key)) urls.set(key, item);
      }
    }
    titles.push({ item, tokens: new Set(submissionTokens(item.title)) });
  }
  submissionIndexCache = { size: state.items.length, urls, titles };
  return submissionIndexCache;
}

function submissionMatches(draft) {
  const index = submissionIndex();
  const exact = submissionUrlKeys(draft.url).map((key) => index.urls.get(key)).find(Boolean) || null;
  const wanted = new Set(submissionTokens(draft.title));
  const similar = wanted.size < 2 ? [] : index.titles
    .map((entry) => ({ item: entry.item, score: [...wanted].filter((word) => entry.tokens.has(word)).length }))
    .filter((entry) => entry.score >= 2 && entry.item !== exact)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.item);
  return { exact, similar };
}

function submissionRecordButton(item, note = "") {
  return `
    <button type="button" data-artifact="${h(item.id)}">
      <span>${h(item.yearLabel || item.year)}</span>
      <b>${h(short(item.title, 76))}</b>
      <em>${h(note || briefCreditOf(item) || item.topic)}</em>
    </button>`;
}

function renderSubmissionCheck(draft) {
  const panel = $("#contribute-check");
  const { exact, similar } = submissionMatches(draft);
  if (exact) {
    const standing = exact.rank ? `Top 10 · #${exact.rank}` : exact.preliminary ? "preliminary collection" : "nominated";
    panel.className = "contribute-check is-match";
    panel.innerHTML = `<p><b>This source is already in the archive.</b> Open the record to confirm it is the same research. If the entry itself is wrong — dead link, bad capture, missing credit — one of the routes at the bottom of this form fits better than a new submission.</p>${submissionRecordButton(exact, standing)}`;
  } else if (similar.length) {
    panel.className = "contribute-check is-near";
    panel.innerHTML = `<p><b>No record holds that address.</b> These titles are the closest already here — worth opening first, in case the same work is recorded under a different link.</p>${similar.map((item) => submissionRecordButton(item)).join("")}`;
  } else {
    panel.className = "contribute-check is-clear";
    panel.innerHTML = `<p><b>Nothing here matches that ${draft.title ? "source or title" : "source"}.</b> ${state.items.length.toLocaleString()} records searched. Worth filing.</p>`;
  }
  panel.hidden = false;
}

let submissionCheckToken = 0;
async function updateSubmissionCheck() {
  const panel = $("#contribute-check");
  const draft = submissionDraft();
  $("#contribute-issue").href = submissionIssueUrl(draft);
  const token = ++submissionCheckToken;
  if (!draft.typedUrl && !draft.title) {
    panel.className = "contribute-check";
    panel.hidden = true;
    return;
  }
  if (draft.typedUrl && !draft.url) {
    panel.className = "contribute-check is-warning";
    panel.innerHTML = `<p><b>That is not an address the archive can follow.</b> A submission needs an <code>https://</code> link to the original publication.</p>`;
    panel.hidden = false;
    return;
  }
  const pending = YEAR_FILES.length - loadedCollections.size;
  if (pending) {
    panel.className = "contribute-check is-loading";
    panel.innerHTML = `<p>Searching the archive… <small>${pending} collection${pending === 1 ? "" : "s"} still loading</small></p>`;
    panel.hidden = false;
    // A collection that will not load leaves the check narrower, not broken:
    // report against what did load rather than refusing to answer at all.
    try { await ensureAllCollections(); } catch { /* answer from what loaded */ }
    if (token !== submissionCheckToken) return;
  }
  renderSubmissionCheck(draft);
}

let submissionCheckTimer;
function scheduleSubmissionCheck() {
  // The outbound link is rebuilt on the keystroke; only the archive search waits
  // for a pause, so the button is never one edit behind what the form shows.
  $("#contribute-issue").href = submissionIssueUrl(submissionDraft());
  clearTimeout(submissionCheckTimer);
  submissionCheckTimer = setTimeout(updateSubmissionCheck, 260);
}

async function copySubmissionDraft() {
  const markdown = submissionMarkdown(submissionDraft());
  if (!markdown) {
    toast("Add the source URL or the title first");
    return;
  }
  try {
    await navigator.clipboard.writeText(markdown);
    toast("Submission copied as Markdown");
  } catch {
    toast(fallbackCopy(markdown) ? "Submission copied as Markdown" : "Copying is unavailable in this browser");
  }
}

// --- The talk, played in place ----------------------------------------------
// CLICK TO LOAD, ALWAYS. The panel below is drawn from the archive's own record
// - title, venue, runtime - and contacts nothing. YouTube is reached only when
// the reader presses play, so opening a record costs them no third-party request
// and no cookie for a talk they never watch. That is also why the poster frame
// is not fetched: a thumbnail from ytimg would leak the visit at render time and
// force `img-src` open for the sake of a picture.

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?(?:[^&]*&)*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function youtubeId(url) {
  const match = YOUTUBE_ID.exec(String(url || ""));
  return match ? match[1] : "";
}

// The collection builder admits only reviewed same-work talks. Keep the
// confidence check here as well so other callers cannot embed guesses.
function playableTalk(item) {
  return (item.videos || []).find((video) => video.confidence === "confirmed" && youtubeId(video.url));
}

function youtubeStartSeconds(url) {
  try {
    const parsed = new URL(url);
    const value = parsed.searchParams.get("start") || parsed.searchParams.get("t") || parsed.hash.match(/^#t=(.+)$/)?.[1] || "";
    const match = /^(?:(\d{1,5})h)?(?:(\d{1,5})m)?(?:(\d{1,6})s)?$/.exec(value);
    const seconds = /^\d{1,6}$/.test(value) ? Number(value)
      : match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
    return seconds <= 86400 ? seconds : 0;
  } catch { return 0; }
}

// Tearing the iframe out is what actually stops the audio. Pausing through the
// player would mean speaking the YouTube iframe API's postMessage protocol,
// which is a much wider contract than a click-to-load facade should carry - and
// a destroyed frame cannot keep playing whatever the embed decides to do.
function stopTalkPlayback() {
  const panel = $("#artifact-talk");
  if (!panel) return;
  panel.classList.remove("is-playing");
  panel.innerHTML = "";
  panel.hidden = true;
}

function renderTalkPanel(item) {
  const panel = $("#artifact-talk");
  if (!panel) return;
  const talk = playableTalk(item);
  stopTalkPlayback();
  panel.hidden = !talk;
  if (!talk) return;

  // A BLOCK, not a bar. The dialog already states things in one shape - an
  // eyebrow over its content, which is what `What the research found` is - so
  // the talk says itself the same way instead of being wedged between the tags
  // and the buttons with nothing to separate it from either.
  const meta = [talk.conference, talk.minutes ? `${talk.minutes} min` : ""].filter(Boolean).join(" · ");
  const heading = talk.conference ? "The talk" : "The recording";
  panel.innerHTML = `
    <h3>${h(heading)}</h3>
    <div class="talk-card">
      <button class="talk-play-action" type="button" aria-label="Play here: ${h(talk.videoTitle || item.title)}">
        <span class="talk-play" aria-hidden="true">▶</span>
        <span class="talk-copy">
          <b>${h(talk.videoTitle || item.title)}</b>
          <small>${h(meta)}</small>
        </span>
      </button>
      <a class="talk-open" href="${h(talk.url)}" target="_blank" rel="noopener noreferrer" title="Open on ${h(hostOf(talk.url))} in a new tab" aria-label="Open the recording on ${h(hostOf(talk.url))} in a new tab">↗</a>
    </div>
    <p class="talk-note">Nothing is requested from ${h(hostOf(talk.url))} until you press play.</p>`;

  panel.querySelector(".talk-play-action").addEventListener("click", () => {
    const frame = document.createElement("iframe");
    // Preserve a reviewed segment's start time in a longer conference stream.
    const start = youtubeStartSeconds(talk.url);
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId(talk.url))}?autoplay=1&rel=0${start ? `&start=${start}` : ""}`;
    frame.title = talk.videoTitle || `Recording: ${item.title}`;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    const card = panel.querySelector(".talk-card");
    card.innerHTML = "";
    card.append(frame);
    panel.classList.add("is-playing");
    updateArtifactNavigation();
    // The promise has been kept; repeating it under a playing video is noise.
    panel.querySelector(".talk-note")?.remove();
  });
}

// --- Reporting an inaccuracy on a record ------------------------------------
// The reader is already looking at the record, so the form starts filled in.
// Everything it can state for them - which record, which part of it - it states,
// leaving only the judgement they came to give.
//
// THE WHOLE RECORD, not the recording on it. The form began as a video-report
// desk and read like one: four of its seven faults were about a video, and the
// one thing that actually breaks a record for every later reader - a preserved
// Markdown copy that no longer says what its own PDF says - was not on the list
// at all. The recording is now one line among the rest.

// Every part of the record the reader can point at, named the way they just saw
// it. The value carries the address as well as the name, because "Preserved PDF"
// on its own does not tell a maintainer which file to open.
function reportParts(item) {
  const parts = [];
  const add = (label, target) => { if (label && target) parts.push(`${label} — ${target}`); };
  add("Preserved Markdown", item.mdPath);
  add("Preserved PDF", item.pdfPath);
  if (item.translated) {
    add(`Original ${item.language || "language"} Markdown`, item.originalMdPath);
    add(`Original ${item.language || "language"} PDF`, item.originalPdfPath);
  }
  add("Original source", item.originalUrl);
  (item.links || []).slice(1).forEach((link) => add(short(link.label, 42), link.url));
  // Named exactly as the record names them, down to the doubt: a reader
  // reporting the button that said "potential related video" should find that
  // wording here rather than have to work out which entry it was.
  (item.videos || []).forEach((video) => {
    const name = video.confidence === "confirmed"
      ? (video.conference ? `${video.conference} talk` : "Recording")
      : "Potential related video";
    add(`${name}${video.minutes ? ` · ${video.minutes} min` : ""}`, video.url);
  });
  add("The byline", (item.authors || []).join(", ") || item.publisher);
  return parts;
}

function reportDraft(item) {
  return {
    record: `${item.yearLabel || item.year} — "${item.title}"`,
    fault: $("#report-fault").value,
    part: $("#report-part").value,
    replacement: safeExternalUrl($("#report-replacement").value.trim()),
    notes: $("#report-notes").value.trim()
  };
}

function reportIssueUrl(draft) {
  return issueUrl("inaccuracy", {
    title: `[Inaccuracy] ${compact(draft.record).slice(0, 110)}`,
    record: draft.record,
    fault: draft.fault,
    part: draft.part,
    replacement: draft.replacement,
    notes: draft.notes
  });
}

function reportMarkdown(draft) {
  return [
    `**Inaccuracy on ${draft.record}**`,
    draft.fault ? `What is wrong: ${draft.fault}` : "",
    draft.part ? `Which part: ${draft.part}` : "",
    draft.replacement ? `Should be: ${draft.replacement}` : "",
    draft.notes ? `\n${draft.notes}` : ""
  ].filter(Boolean).join("\n");
}

function openReportDialog(item) {
  const dialog = $("#report-dialog");
  // It opens ON TOP of the record, so it wears the room the record is wearing
  // and takes the record's own topic accent. See the .report-dialog rules.
  dialog.dataset.view = state.view;
  dialog.style.setProperty("--dialog-color", item.topicColor);
  $("#report-record").value = `${item.yearLabel || item.year} — ${item.title}`;
  $("#report-fault").innerHTML = REPORT_FAULTS
    .map((fault) => `<option value="${h(fault)}">${h(fault)}</option>`).join("");
  // The neutral answer leads, because most faults are about the record rather
  // than one addressable piece of it, and a preselected part would put words in
  // the reporter's mouth.
  $("#report-part").innerHTML = `<option value="">Not sure / the record as a whole</option>`
    + reportParts(item).map((part) => `<option value="${h(part)}">${h(part)}</option>`).join("");
  $("#report-replacement").value = "";
  $("#report-notes").value = "";
  const refresh = () => { $("#report-issue").href = reportIssueUrl(reportDraft(item)); };
  for (const id of ["#report-fault", "#report-part", "#report-replacement", "#report-notes"]) {
    $(id).oninput = refresh;
    $(id).onchange = refresh;
  }
  $("#report-copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(reportMarkdown(reportDraft(item)));
      toast("Report copied as Markdown");
    } catch { toast("Copying is blocked in this browser"); }
  };
  refresh();
  dialog.scrollTop = 0;
  showLockedModal(dialog);
}

function openSubmissionDialog() {
  const dialog = $("#contribute-dialog");
  const yearSelect = $("#contribute-year");
  if (!yearSelect.options.length) {
    yearSelect.innerHTML = `<option value="">Choose a year…</option>${
      submissionYears().map((year) => `<option value="${h(year)}">${h(year)}</option>`).join("")
    }<option value="Not sure">Not sure</option>`;
  }
  updateSubmissionCheck();
  dialog.scrollTop = 0;
  showLockedModal(dialog);
  requestAnimationFrame(() => $("#contribute-url").focus());
}

function empty(message) {
  return `<div class="empty-state"><p>${h(message)}</p></div>`;
}

let toastTimer;
function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 1900);
}

loadArchive();
