import { access, readdir, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import "./pdf-reader-polyfills-test.mjs";
import { safePdfUrl as safePdfReaderUrl } from "./pdf-reader-url.mjs";

const root = process.cwd();
const yearRegistry = JSON.parse(await readFile(path.join(root, "website/archive-years.json"), "utf8"));
const yearRecords = yearRegistry.years || [];
const years = yearRecords.map((record) => record.id);
// Empty is the healthy state: paths come from the archive's own rule below.
const knownMissingPaths = new Set([]);

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

async function exists(file) {
  try {
    await access(path.join(root, file), constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

const manifest = JSON.parse(await readFile(path.join(root, "archived-references/manifest.json"), "utf8"));
const lookup = new Map();
const unsafeManifestPaths = [];

// The same rule app.js uses: open the exact safe path advertised by the
// manifest. This matters when a reference is cited by more than one year and
// its citation ordering differs from the collection that owns its files.
const noPdfKinds = new Set(["video"]);
// Both halves of a translated pair are published, so both are path-checked here.
function archivePathsFor(record) {
  if (!record?.slug || !record?.grade || !record?.content_sha256) return { md: "", pdf: "", translatedMd: "", translatedPdf: "" };
  const noPdf = noPdfKinds.has(record.kind || "");
  return {
    md: record.steps?.render?.file || "",
    pdf: noPdf ? "" : record.steps?.pdf?.file || "",
    translatedMd: record.steps?.render?.translation_file || "",
    translatedPdf: noPdf ? "" : record.steps?.["pdf-translation"]?.file || ""
  };
}

for (const [url, record] of Object.entries(manifest.urls || {})) {
  const aliases = [url, ...(record.spellings || []), record.health?.final_url, ...(record.also_at || [])].filter(Boolean);
  for (const alias of aliases) {
    const key = normalizeUrl(alias);
    if (!lookup.has(key) || record.content_sha256 || !lookup.get(key).content_sha256) lookup.set(key, record);
  }
  const { md: mdPath, pdf: pdfPath, translatedMd, translatedPdf } = archivePathsFor(record);
  for (const candidate of [mdPath, translatedMd]) {
    if (candidate && !/^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/i.test(candidate)) unsafeManifestPaths.push(candidate);
  }
  for (const candidate of [pdfPath, translatedPdf]) {
    if (candidate && !/^archived-references\/pdf\/[a-z0-9-]+\/[a-z0-9._-]+\.pdf$/i.test(candidate)) unsafeManifestPaths.push(candidate);
  }
}

for (const [url, record] of Object.entries(manifest.urls || {})) {
  if (record.content_sha256 || !lookup.has(normalizeUrl(url))) lookup.set(normalizeUrl(url), record);
}

// One bullet is one research, however many links it carries - the same grouping
// app.js parses, so the counts here are the counts the page shows.
// Escaped brackets in a label are part of it - see app.js parseYearMarkdown.
const LINK_RE = /\[((?:[^\]\\]|\\.)+)\]\((?:<(https?:\/\/[^>\s]+)>|(https?:\/\/[^)\s]+))\)/g;
const artifacts = [];
for (const year of years) {
  const markdown = await readFile(path.join(root, `${year}.md`), "utf8");
  const yearRecord = yearRecords.find((record) => record.id === year) || {};
  let inContentRange = !yearRecord.contentStart;
  for (const line of markdown.split(/\r?\n/)) {
    if (yearRecord.contentStart && line.trim() === yearRecord.contentStart) {
      inContentRange = true;
      continue;
    }
    if (inContentRange && yearRecord.contentEnd && line.trim() === yearRecord.contentEnd) break;
    if (!inContentRange) continue;
    if (!/^\s*-\s/.test(line)) continue;
    const links = [...line.matchAll(LINK_RE)].map((match) => ({ title: match[1], url: match[2] || match[3] }));
    if (!links.length) continue;
    artifacts.push({
      year,
      rank: /\*\*#(\d+)\*\*/.exec(line)?.[1] || null,
      title: links[0].title,
      originalUrl: links[0].url,
      record: lookup.get(normalizeUrl(links[0].url)),
      links: links.map((link) => ({ ...link, record: lookup.get(normalizeUrl(link.url)) }))
    });
  }
}

const missingLocalFiles = [];
let markdownCount = 0;
let pdfCount = 0;
for (const artifact of artifacts) {
  // A reader opens the first preserved copy across the research's links.
  const resolved = artifact.links.map((link) => archivePathsFor(link.record));
  const md = resolved.map((paths) => paths.md).find((file) => file && !knownMissingPaths.has(file)) || "";
  const pdf = resolved.map((paths) => paths.pdf).find((file) => file && !knownMissingPaths.has(file)) || "";
  if (md) {
    markdownCount++;
    if (!(await exists(md))) missingLocalFiles.push(md);
  }
  if (pdf) {
    pdfCount++;
    if (!(await exists(pdf))) missingLocalFiles.push(pdf);
  }
}

const annualPdfFiles = yearRecords.filter((record) => record.ranked !== false).map(({ id: year }) => {
  const combined = ["2006", "2012", "2013", "2014", "2015"].includes(year);
  return `original-listings/${year}-${combined ? "nominees-and-top10" : "top10"}.pdf`;
});
const missingAnnualPdfs = [];
for (const file of annualPdfFiles) if (!(await exists(file))) missingAnnualPdfs.push(file);
const mockupFiles = [
  "website/404.html",
  "website/index.html",
  "website/archive-years.json",
  "website/brand-mark.svg",
  "website/styles.css",
  "website/app.js",
  "website/discovery.js",
  "website/discovery.css",
  "website/constellation.js",
  "website/pdf-reader.html",
  "website/pdf-reader.css",
  "website/pdf-reader.mjs",
  "website/pdf-reader-polyfills.mjs",
  "website/pdf-reader-url.mjs",
  "website/pdf-worker.mjs",
  "website/vendor/pdfjs/LICENSE",
  "website/vendor/pdfjs/build/pdf.mjs",
  "website/vendor/pdfjs/build/pdf.worker.mjs",
  "website/build-site.mjs",
  "website/hosting.json",
  "website/site.webmanifest",
  "website/_headers"
];
const missingMockupFiles = [];
for (const file of mockupFiles) if (!(await exists(file))) missingMockupFiles.push(file);
const indexSource = await readFile(path.join(root, "website/index.html"), "utf8");
const appSource = await readFile(path.join(root, "website/app.js"), "utf8");
const discoverySource = await readFile(path.join(root, "website/discovery.js"), "utf8");
const constellationSource = await readFile(path.join(root, "website/constellation.js"), "utf8");
const stylesSource = await readFile(path.join(root, "website/styles.css"), "utf8");
const pdfReaderHtmlSource = await readFile(path.join(root, "website/pdf-reader.html"), "utf8");
const pdfReaderCssSource = await readFile(path.join(root, "website/pdf-reader.css"), "utf8");
const pdfReaderSource = await readFile(path.join(root, "website/pdf-reader.mjs"), "utf8");
const pdfReaderPolyfillsSource = await readFile(path.join(root, "website/pdf-reader-polyfills.mjs"), "utf8");
const pdfWorkerSource = await readFile(path.join(root, "website/pdf-worker.mjs"), "utf8");
const buildSiteSource = await readFile(path.join(root, "website/build-site.mjs"), "utf8");
const headersSource = await readFile(path.join(root, "website/_headers"), "utf8");
const notFoundSource = await readFile(path.join(root, "website/404.html"), "utf8");
const clientContext = vm.createContext({
  URL,
  location: { href: "https://archive.example/website/#museum" },
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [] },
  navigator: {}
});
vm.runInContext(discoverySource, clientContext);
vm.runInContext(appSource.replace(/\nloadArchive\(\);\s*$/, ""), clientContext);
const clientEval = (expression) => vm.runInContext(expression, clientContext);
clientContext.__yearRecords = yearRecords;
clientEval("YEAR_RECORDS = __yearRecords; YEAR_FILES = YEAR_RECORDS.map((record) => record.id)");
assert.equal(clientEval('JSON.stringify(sourceDetailsFor({authors: []}, {authors: ["Withdrawn credit"]}).authors || [])'), "[]",
  "An explicit withdrawal must not fall back to companion credits");
assert.equal(clientEval('JSON.stringify(sourceDetailsFor({}, {authors: ["Alice", "Bob"]}).authors)'), '["Alice","Bob"]',
  "Missing archive metadata may use a separately credited companion's full byline");
assert.equal(clientEval('JSON.stringify(sourceDetailsFor({authors: ["Alice", "Bob"]}, {authors: ["Other"]}).authors)'), '["Alice","Bob"]',
  "The document's full byline takes precedence over companion metadata");
clientContext.__longByline = Array.from({ length: 15 }, (_, i) => `Researcher ${i + 1}`);
assert.deepEqual(JSON.parse(clientEval('JSON.stringify(sourceDetailsFor({authors: __longByline}).authors)')), clientContext.__longByline,
  "All authors must survive publication, including names beyond the eighth");
const progressiveCatalogue = JSON.parse(await readFile(path.join(root, "website/data/catalogue.json"), "utf8"));
// Companion metadata is optional at runtime, but every published shard must
// match its collection and expose only the public reading fields.
const sourceFields = new Set(["title", "publisher", "published", "kind", "language", "authors", "summary", "tags", "updated", "alsoAt", "relationship", "sourceKind", "preservation", "context", "sequence", "channel", "minutes"]);
let sourceBytes = 0;
const sourceCredits = new Map();
let compactSourceDefaults = 0;
for (const record of progressiveCatalogue.years) {
  assert.equal(record.sources.file, `data/sources/${record.id}.json`);
  const body = await readFile(path.join(root, "website", record.sources.file));
  sourceBytes += body.length;
  assert.equal(body.length, record.sources.bytes);
  assert.ok(body.length <= 500000, `${record.id}: source shard exceeds 500 KB`);
  assert.equal(createHash("sha256").update(body).digest("hex"), record.sources.sha256);
  const sources = JSON.parse(body);
  const collection = JSON.parse(await readFile(path.join(root, `website/data/collections/${record.id}.json`), "utf8"));
  assert.equal(sources.schema, 1);
  assert.equal(sources.version, progressiveCatalogue.version);
  assert.equal(sources.year, record.id);
  assert.deepEqual(Object.keys(sources.items).sort(), collection.items.map(item => item.id).sort());
  for (const wireItem of collection.items) {
    clientContext.__wireItem = wireItem;
    const item = JSON.parse(clientEval("JSON.stringify(expandArchiveItem(__wireItem))"));
    assert.ok(item.links.every(link => !Object.hasOwn(link, "sourceId")), "Stable source IDs load with optional source details, not the initial collection");
    for (const field of ["mdVersion", "pdfVersion", "originalPdfVersion"]) {
      if (item[field]) assert.match(item[field], /^\d{14}$/, `${field} should use the exact client cache token`);
    }
    assert.equal(sources.items[item.id].length, item.sourceCount || item.links.length);
    assert.ok(item.links.every(link => sources.items[item.id].some(source => source.url === link.url)));
    assert.equal(sources.items[item.id].filter(source => source.main).length, 1);
    for (const source of sources.items[item.id]) {
      if (!source.main || !Object.hasOwn(source.details, "preservation") || !Object.hasOwn(source.details, "relationship")) compactSourceDefaults += 1;
      assert.ok(Object.keys(source.details).every(key => sourceFields.has(key)), "Source metadata must not contain evaluation or acquisition internals");
      assert.match(source.sourceId, /^source-[a-f0-9]{20}$/);
      for (const field of ["mdVersion", "pdfVersion", "originalPdfVersion"]) {
        if (source[field]) assert.match(source[field], /^\d{14}$/, `${field} should use the exact client cache token`);
      }
      const archiveRecord = lookup.get(normalizeUrl(source.url));
      if (archiveRecord && Object.hasOwn(archiveRecord, "authors")) {
        assert.deepEqual(source.details.authors || [], archiveRecord.authors,
          `${source.url}: publish every recorded author in order`);
      }
      if (sourceCredits.has(source.sourceId)) {
        assert.deepEqual(source.details.authors || [], sourceCredits.get(source.sourceId),
          `${source.url}: the same source must have consistent credits across stories`);
      }
      sourceCredits.set(source.sourceId, source.details.authors || []);
      if (source.details.preservation === "link-only") assert.ok(!source.mdPath && !source.pdfPath, "Media/downloads must not borrow a document capture");
    }
    const readingSource = sources.items[item.id].find(source => item.mdPath && source.mdPath === item.mdPath)
      || sources.items[item.id].find(source => item.pdfPath && source.pdfPath === item.pdfPath);
    if (readingSource) assert.deepEqual(item.authors || [], readingSource.details.authors || [],
      `${item.id}: the article card and its reading source must show the same authors`);
    assert.ok(item.links.every(link => !Object.hasOwn(link, "details")), "Details must remain outside initial collection loads");
  }
}
assert.ok(sourceBytes <= 4000000, "Source metadata exceeds its 4 MB total budget");
assert.ok(compactSourceDefaults > 0, "Generated source shards should omit repeated default fields");
const progressiveRecord = [...progressiveCatalogue.years].reverse().find((record) => record.status === "final") || progressiveCatalogue.years.at(-1);
const progressiveShard = JSON.parse(await readFile(path.join(root, `website/data/collections/${progressiveRecord.id}.json`), "utf8"));
const progressiveWireKeysAbsent = ["readKey", "read", "favouriteKey", "favourite"].every((key) => !Object.hasOwn(progressiveShard.items[0], key));
const sourceBundle = `${indexSource}\n${appSource}\n${discoverySource}`;
const unsafeBlankTargets = sourceBundle.match(/<a\b(?=[^>]*target=["']_blank["'])(?![^>]*rel=["'][^"']*noopener)[^>]*>/gi) || [];

// Exercise the actual URL and Markdown renderers without a browser. All source
// content begins as untrusted text; only the allowlisted tags emitted by the
// renderer may reach an innerHTML sink.
const linkFixture = {
  title: "Research", originalUrl: "https://research.example/article",
  mdPath: "archived-references/md/2026-ai/article_translate.md",
  pdfPath: "archived-references/pdf/2026-ai/article_translate.pdf",
  links: [
    { label: "Research", url: "https://research.example/article", mdPath: "archived-references/md/2026-ai/article_translate.md", pdfPath: "archived-references/pdf/2026-ai/article_translate.pdf" },
    { label: "Original-language paper", url: "https://research.example/paper", pdfPath: "archived-references/pdf/2026-ai/article.pdf" },
    { label: "Unarchived companion", url: "https://research.example/companion" }
  ]
};
clientContext.__linkFixture = linkFixture;
assert.deepEqual(JSON.parse(clientEval("JSON.stringify(expandArchiveItem(compactArchiveItem(__linkFixture)))")), linkFixture);
assert.deepEqual(JSON.parse(clientEval("JSON.stringify(expandArchiveItem(__linkFixture))")), linkFixture);
assert.ok(progressiveShard.items.some((item) => item.links.some((link) => link.fromItem?.length)), "Generated shards should share repeated link fields");
assert.throws(() => clientEval('expandArchiveItem({links:[{fromItem:["__proto__"]}]})'), /Invalid shared archive link field/);
for (const defaults of [
  { note: "", rank: null, excluded: false, kind: "article", language: "", published: "", grade: "research", depth: "full", health: "unknown", archiveStatus: "preserved", archived: true, section: "candidate", figuresInPdf: true },
  { note: "A distinct note", rank: 1, excluded: true, kind: "paper", language: "en", archived: false, section: "winner" }
]) {
  clientContext.__defaultFixture = { ...linkFixture, ...defaults };
  assert.deepEqual(JSON.parse(clientEval("JSON.stringify(expandArchiveItem(compactArchiveItem(__defaultFixture)))")), clientContext.__defaultFixture);
}
assert.equal(clientEval("expandArchiveItem({defaults:2047}).section"), undefined, "Older cached masks must not gain a candidate section");
assert.equal(clientEval("expandArchiveItem({defaults:4095}).figuresInPdf"), undefined, "Older cached masks must not gain a PDF-figures flag");
for (const defaults of [-1, 0, 8192, 1.5, "1"]) {
  clientContext.__invalidDefaults = defaults;
  assert.throws(() => clientEval("expandArchiveItem({defaults:__invalidDefaults})"), /Invalid archive item defaults/);
}
assert.throws(() => clientEval('expandArchiveItem({defaults:1,note:"override"})'), /Conflicting archive item default/);
const collectionFixture = {
  ...linkFixture, year: "2026-ai", line: 42, citedBy: ["2026-ai.md:42"], yearLabel: "2026 AI",
  preliminary: true, provenance: "AI-collected", id: "2026-ai-11", title: "Remote code execution in a server", topic: "Server",
  topicColor: "#80adff", publisher: "research.example"
};
clientContext.__collectionFixture = collectionFixture;
assert.equal(clientEval("compactArchiveItem(__collectionFixture).collectionDefaults"), 127);
assert.deepEqual(JSON.parse(clientEval("JSON.stringify(expandArchiveItem(compactArchiveItem(__collectionFixture)))")), collectionFixture);
assert.equal(clientEval('expandArchiveItem({year:"2026-ai",collectionDefaults:15}).topicColor'), undefined, "Older cached masks must not gain newer derived fields");
for (const defaults of [-1, 0, 128, 1.5, "1"]) {
  clientContext.__invalidCollectionDefaults = defaults;
  assert.throws(() => clientEval("expandArchiveItem({collectionDefaults:__invalidCollectionDefaults})"), /Invalid archive collection defaults/);
}
assert.throws(() => clientEval('expandArchiveItem({year:"2026-ai",collectionDefaults:1,yearLabel:"override"})'), /Conflicting archive collection default/);
const pairedPaths = {
  mdPath: "archived-references/md/2026-ai/example.md",
  pdfPath: "archived-references/pdf/2026-ai/example.pdf",
  links: [{ pdfPath: "archived-references/pdf/2026-ai/example.pdf" }]
};
clientContext.__pairedPaths = pairedPaths;
assert.equal(clientEval("compactArchiveItem(__pairedPaths).pdfFromMd"), true);
assert.deepEqual(JSON.parse(clientEval("JSON.stringify(expandArchiveItem(compactArchiveItem(__pairedPaths)))")), pairedPaths);
for (const invalid of [
  { pdfFromMd: false, mdPath: pairedPaths.mdPath },
  { pdfFromMd: true, mdPath: "https://example.com/article.md" },
  { pdfFromMd: true, mdPath: "archived-references/md/../secret.md" },
  { pdfFromMd: true, mdPath: "ARCHIVED-REFERENCES/MD/2020/a.MD" },
  { pdfFromMd: true, mdPath: pairedPaths.mdPath, pdfPath: pairedPaths.pdfPath }
]) {
  clientContext.__invalidPath = invalid;
  assert.throws(() => clientEval("expandArchiveItem(__invalidPath)"), /Invalid shared archive PDF path/);
}
let progressiveRequestUrl = "";
clientContext.__progressiveCatalogue = progressiveCatalogue;
clientContext.__progressiveShard = progressiveShard;
clientContext.__progressiveYear = progressiveRecord.id;
clientContext.fetch = async (url) => {
  progressiveRequestUrl = String(url);
  return { ok: true, json: async () => progressiveShard };
};
const progressiveLoad = JSON.parse(await clientEval(`
  ARCHIVE_CATALOGUE = __progressiveCatalogue;
  YEAR_RECORDS = ARCHIVE_CATALOGUE.years;
  YEAR_FILES = YEAR_RECORDS.map((record) => record.id);
  state.archiveTotal = ARCHIVE_CATALOGUE.total;
  ensureCollection(__progressiveYear).then((items) => JSON.stringify({
    count: items.length,
    loaded: loadedCollections.has(__progressiveYear),
    year: items[0]?.year,
    readKey: items[0]?.readKey,
    favouriteKey: items[0]?.favouriteKey,
    originalUrl: items[0]?.originalUrl,
    firstSourceUrl: items[0]?.links[0]?.url,
    read: items[0]?.read,
    favourite: items[0]?.favourite
  }))
`));
assert.equal(progressiveLoad.firstSourceUrl, progressiveLoad.originalUrl, "Loaded shared source links must retain their URL");
const newestFirstYearIds = JSON.parse(clientEval(`JSON.stringify(newestFirstYearRecords().map((record) => record.id))`));
const newestFirstYearPillIds = [...clientEval(`yearPills("2025")`).matchAll(/data-year="([^"]+)"/g)].map((match) => match[1]);
const hostileMarkdown = [
  "# <img src=x onerror=globalThis.pwned=1>",
  "<script>globalThis.pwned=2</script>",
  "[script link](javascript:globalThis.pwned=3)",
  "![breaker](https://example.test/x\" onerror=\"globalThis.pwned=4)",
  "[breaker](https://example.test/x\" onmouseover=\"globalThis.pwned=5)",
  "<svg onload=globalThis.pwned=6></svg>",
  "```constructor\n<img src=x onerror=globalThis.pwned=9>\n```",
  "<https://example.test/?a=1&b=2>"
].join("\n\n");
const hostileHtml = clientEval(`markdownDocument(${JSON.stringify(hostileMarkdown)}).html`);
const externalImageHtml = clientEval(`markdownDocument("![private probe](https://127.0.0.1/admin)").html`);
const localFigureHtml = clientEval(`markdownDocument("![Preserved figure](../../figures/2010/bad-memories/figure-02.png)").html`);
const unsafeFigureHtml = clientEval(`markdownDocument("![Traversal](../../figures/2010/../private.png)").html`);
const diagramHtml = clientEval(`(() => {
  const previous = ARCHIVE_DIAGRAMS;
  ARCHIVE_DIAGRAMS = { "flowchart LR\\nA-->B": "archived-references/diagrams/${"a".repeat(64)}.svg" };
  const result = markdownDocument(${JSON.stringify("```mermaid\nflowchart LR\nA-->B\n```")}).html;
  ARCHIVE_DIAGRAMS = previous;
  return result;
})()`);
const unknownDiagramHtml = clientEval(`markdownDocument(${JSON.stringify("```mermaid\n<script>alert(1)</script>\n```")}).html`);
const technicalTableHtml = clientEval(`markdownDocument(${JSON.stringify("| Feature | Example |\n| --- | --- |\n| minimum_[chrome\\|edge]_version | `left || right` |\n| literal | ``a|`b`` |")}).html`);
const mutationMarkdown = "[**label**](https://example.test/a__b**c) and `code`";
const mutationHtml = clientEval(`markdownDocument(${JSON.stringify(mutationMarkdown)}).html`);
const hostileRegistryRecord = [{ id: "2025", label: '"><img src=x onerror=globalThis.pwned=7>', status: "final" }];
const hostileYearPills = clientEval(`YEAR_RECORDS = ${JSON.stringify(hostileRegistryRecord)}; yearPills("2025")`);
const summaryCardMarkup = clientEval(`artifactCard({
  id: "2025-0", year: "2025", yearLabel: "2025", topic: "HTTP",
  title: "A title", summary: "A <finding> & its impact", archiveStatus: "preserved",
  authors: ["Researcher"], kind: "article", read: false, favourite: false
})`);
const compactSummaryCardMarkup = clientEval(`artifactCard({
  id: "2025-1", year: "2025", yearLabel: "2025", topic: "HTTP",
  title: "A compact title", summary: "This stays in the record dialog",
  archiveStatus: "preserved", kind: "article", read: false, favourite: false
}, true)`);
// The collection id reaches data-year/data-signal-year/data-term-command as an
// attribute value, so it has to be escaped at the sink and not only validated
// on the way in from the catalogue.
const hostileIdRecord = [{ id: '"><img src=x onerror=globalThis.pwned=8>', label: "2025", status: "final" }];
const hostileIdMarkup = clientEval(`
  YEAR_RECORDS = ${JSON.stringify(hostileIdRecord)};
  YEAR_FILES = YEAR_RECORDS.map((record) => record.id);
  yearPills(YEAR_FILES[0]) + terminalRootListing()
`);
const artifactShareUrl = clientEval(`state.view = "library"; documentShareUrl({ id: "2025-0" }, "artifact")`);
const readerShareUrl = clientEval(`state.view = "signals"; state.readingTheme = "light"; documentShareUrl({ id: "2025-0" }, "reader")`);
const resultsShareUrl = clientEval(`state.pdfPath = "original-listings/2025-top10.pdf"; documentShareUrl(null, "results")`);
const repositoryArchiveUrl = clientEval(`archiveUrl("archived-references/md/2025/example.md", "md")`);
const deployedArchiveUrl = clientEval(`location.href = "https://archive.example/webhacklist/#museum"; archiveUrl("archived-references/md/2025/example.md", "md")`);
const terminalPaths = clientEval(`YEAR_FILES = ["2016-17", "2024"]; state.terminalCwd = "/2024"; state.terminalPreviousCwd = "/"; JSON.stringify([resolveTerminalPath(".."), resolveTerminalPath("/"), resolveTerminalPath("../2016"), terminalPathExists("/favourites")])`);
const exactTagMatches = JSON.parse(clientEval(`JSON.stringify(queryItems([
  { id: "exact", title: "Exact", tags: ["xss"], authors: [] },
  { id: "substring", title: "Substring", tags: ["xssearch"], authors: [] },
  { id: "mention", title: "An XSS mention", tags: ["browser"], authors: [] }
], "tag:xss").map((item) => item.id))`));
const tagClickBehaviour = JSON.parse(clientEval(`(() => {
  const originalQuerySelector = document.querySelector;
  const originalEnsureAllCollections = ensureAllCollections;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalYears = YEAR_FILES;
  const originalLoadedCollections = [...loadedCollections];
  const originalItems = state.items;
  const originalQuery = state.query;
  const search = { value: "" };
  const label = { textContent: "" };
  const list = { innerHTML: "", scrollTop: -1 };
  const panel = { hidden: true, focused: false, focus() { this.focused = true; } };
  const dialog = { open: true, closed: false, close() { this.open = false; this.closed = true; } };
  const elements = new Map([
    ["#global-search", search], ["#global-results-label", label],
    ["#global-results-list", list], ["#global-results", panel],
    ["#artifact-dialog", dialog]
  ]);
  try {
    document.querySelector = (selector) => elements.get(selector) || null;
    globalThis.requestAnimationFrame = (callback) => callback();
    ensureAllCollections = () => new Promise(() => {});
    YEAR_FILES = [];
    loadedCollections.clear();
    state.items = [{ id: "one", title: "One", tags: ["xss"], authors: [], year: "2025", topic: "XSS" }];
    handleArtifactTagClick({ target: { closest: () => ({ dataset: { tag: "XSS" } }) } });
    return JSON.stringify({ query: state.query, value: search.value, label: label.textContent, hidden: panel.hidden, focused: panel.focused, closed: dialog.closed, scrollTop: list.scrollTop });
  } finally {
    document.querySelector = originalQuerySelector;
    ensureAllCollections = originalEnsureAllCollections;
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    YEAR_FILES = originalYears;
    loadedCollections.clear();
    originalLoadedCollections.forEach((year) => loadedCollections.add(year));
    state.items = originalItems;
    state.query = originalQuery;
  }
})()`));
const backdropDialogBehaviour = JSON.parse(clientEval(`(() => {
  const dialog = {
    open: true,
    closes: 0,
    close() { this.closes++; },
    getBoundingClientRect() { return { left: 20, right: 120, top: 10, bottom: 90 }; }
  };
  closeDialogFromBackdrop({ currentTarget: dialog, target: dialog, clientX: 5, clientY: 50 });
  const outsideCloses = dialog.closes;
  closeDialogFromBackdrop({ currentTarget: dialog, target: dialog, clientX: 50, clientY: 50 });
  const insideCloses = dialog.closes;
  closeDialogFromBackdrop({ currentTarget: dialog, target: {}, clientX: 5, clientY: 50 });
  return JSON.stringify({ outsideCloses, insideCloses, childCloses: dialog.closes });
})()`));
// Favourites and read state are two independent browser-local lists, and both
// filter across any combination of years and topics.
const savedFilters = JSON.parse(clientEval(`
  state.items = [
    { id: "a", year: "2024", topic: "XSS", title: "A", rank: null, favourite: true, read: false },
    { id: "b", year: "2024", topic: "HTTP", title: "B", rank: null, favourite: false, read: true },
    { id: "c", year: "2019", topic: "XSS", title: "C", rank: null, favourite: true, read: true },
    { id: "d", year: "2011", topic: "HTTP", title: "D", rank: null, favourite: false, read: false }
  ];
  state.savedYears = new Set();
  state.savedTopics = new Set();
  const favourites = savedItems("favourites").length;
  const read = savedItems("read").length;
  const both = savedItems("all").length;
  state.savedMode = "all";
  state.savedYears = new Set(["2024", "2019"]);
  const twoYears = savedFilteredItems().length;
  state.savedYears = new Set(["2019"]);
  const oneYear = savedFilteredItems().length;
  state.savedYears = new Set(["2024", "2019"]);
  state.savedTopics = new Set(["XSS"]);
  const yearAndTopic = savedFilteredItems().length;
  state.items = [];
  state.savedMode = "favourites";
  state.savedYears = new Set();
  state.savedTopics = new Set();
  JSON.stringify({ favourites, read, both, twoYears, oneYear, yearAndTopic })
`));

// The museum room's colour key is also its filter. Topics OR together, and the
// recordings chip ANDs over whatever they left — so a topic that holds no
// recording must come back EMPTY and say so, rather than quietly widening back
// out to the whole room, which is the failure mode that makes a filter lie.
const roomFilters = JSON.parse(clientEval(`
  const roomFixture = [
    { id: "a", year: "2024", topic: "XSS", title: "A", videos: [{ url: "https://youtu.be/aaaaaaaaaaa", confidence: "confirmed" }] },
    { id: "b", year: "2024", topic: "XSS", title: "B" },
    { id: "c", year: "2024", topic: "HTTP", title: "C", videos: [{ url: "https://youtu.be/bbbbbbbbbbb", confidence: "possible" }] },
    { id: "d", year: "2024", topic: "Crypto", title: "D" }
  ];
  state.roomTopics = new Set();
  state.roomVideoOnly = false;
  const unfiltered = filterRoom(roomFixture).length;
  const inactive = roomFilterActive();
  const restingKey = topicKey(roomFixture, roomFixture);
  state.roomTopics = new Set(["XSS"]);
  const oneTopic = filterRoom(roomFixture).length;
  state.roomTopics = new Set(["XSS", "Crypto"]);
  const twoTopics = filterRoom(roomFixture).length;
  state.roomTopics = new Set();
  state.roomVideoOnly = true;
  const recordedOnly = filterRoom(roomFixture).length;
  state.roomTopics = new Set(["XSS"]);
  const topicAndRecorded = filterRoom(roomFixture).length;
  state.roomTopics = new Set(["Crypto"]);
  const impossible = filterRoom(roomFixture).length;
  const emptyKey = topicKey(roomFixture, filterRoom(roomFixture));
  state.roomTopics = new Set();
  state.roomVideoOnly = false;
  JSON.stringify({ unfiltered, inactive, restingKey, oneTopic, twoTopics, recordedOnly, topicAndRecorded, impossible, emptyKey })
`));

// The constellation's recording control, which has to survive reaching zero:
// pressed, it can empty the field, and a control that rendered only while it
// had something to count would vanish exactly when it is the one thing left to
// press to get back out.
const starFilters = JSON.parse(clientEval(`
  state.starRecordedOnly = false;
  const resting = recordedFilterButton(3);
  const nothingToFilter = recordedFilterButton(0);
  state.starRecordedOnly = true;
  const pressed = recordedFilterButton(3);
  const pressedAtZero = recordedFilterButton(0);
  state.starRecordedOnly = false;
  JSON.stringify({ resting, nothingToFilter, pressed, pressedAtZero })
`));

// The recording mark, which every view draws from one function so the seven
// rooms cannot drift into meaning slightly different things by it.
const marks = JSON.parse(clientEval(`
  const sure = { videos: [{ url: "https://youtu.be/aaaaaaaaaaa", confidence: "confirmed" }] };
  const guess = { videos: [{ url: "https://youtu.be/bbbbbbbbbbb", confidence: "possible" }] };
  const mixed = { videos: [guess.videos[0], sure.videos[0]] };
  JSON.stringify({
    sure: videoMark(sure), guess: videoMark(guess), mixed: videoMark(mixed),
    none: videoMark({}), scoped: videoMark(sure, "card-video"),
    sureLabel: videoLabel(sure), guessLabel: videoLabel(guess), noLabel: videoLabel({}),
    counted: recordedCount([sure, {}, guess, {}])
  })
`));
const emittedTags = hostileHtml.match(/<[^>]+>/g) || [];
const unsafeRenderedTags = emittedTags.filter((tag) =>
  /<(?:script|iframe|svg|object|embed)\b/i.test(tag)
  || /\son[a-z]+\s*=/i.test(tag)
  || /\s(?:href|src)\s*=\s*["']\s*(?:javascript|data):/i.test(tag)
);
const activeClientSecurityChecks = [
  clientEval(`safeExternalUrl("javascript:alert(1)")`) === "",
  clientEval(`safeExternalUrl("vbscript:msgbox(1)")`) === "",
  clientEval(`safeExternalUrl("data:text/html,<script>alert(1)</script>")`) === "",
  clientEval(`safeExternalUrl("blob:https://example.test/id")`) === "",
  clientEval(`safeExternalUrl("//example.test/path")`) === "",
  clientEval(`safeExternalUrl("https://user:pass@example.test/")`) === "",
  clientEval(`safeExternalUrl("https://user%3Apass@example.test/")`) === "",
  clientEval(`safeArchivePath("../app.js", "md")`) === "",
  clientEval(`safeArchivePath("archived-references/md/2025/example.md", "md")`) === "archived-references/md/2025/example.md",
  unsafeRenderedTags.length === 0,
  hostileHtml.includes("&lt;script&gt;"),
  hostileHtml.includes("https://example.test/?a=1&amp;b=2"),
  !hostileYearPills.includes("<img") && hostileYearPills.includes("&lt;img"),
  !hostileIdMarkup.includes('"><img') && hostileIdMarkup.includes("&lt;img"),
  artifactShareUrl === "https://archive.example/website/#library/2025-0",
  readerShareUrl === "https://archive.example/website/?reader=2025-0&theme=light#signals/2025-0",
  resultsShareUrl === "https://archive.example/website/?results=2025&theme=light#signals",
  repositoryArchiveUrl === "https://archive.example/archived-references/md/2025/example.md",
  deployedArchiveUrl === "https://archive.example/webhacklist/archived-references/md/2025/example.md",
  clientEval(`compileSafeGrep("/xss|csrf/i").regex.test("XSS research")`) === true,
  Boolean(clientEval(`compileSafeGrep("(a+)+$").error`)),
  Boolean(clientEval(`compileSafeGrep("(a|aa)+$").error`)),
  Boolean(clientEval(`compileSafeGrep("a.*b").error`)),
  Boolean(clientEval(`compileSafeGrep("a+a?$").error`)),
  clientEval(`compileSafeGrep("^CVE-\\\\d{4}-\\\\d{1,7}$").regex.test("CVE-2026-12345")`) === true,
  !externalImageHtml.includes("<img") && externalImageHtml.includes("external-image-reference") && externalImageHtml.includes("target=\"_blank\""),
  localFigureHtml.includes('<img src="http') && localFigureHtml.includes("archived-references/figures/2010/bad-memories/figure-02.png"),
  !unsafeFigureHtml.includes("<img"),
  diagramHtml.includes('<img src="http') && diagramHtml.includes("Diagram source") && diagramHtml.includes("a".repeat(64) + ".svg"),
  !unknownDiagramHtml.includes("<img") && unknownDiagramHtml.includes("&lt;script&gt;"),
  (technicalTableHtml.match(/<td>/g) || []).length === 4 && technicalTableHtml.includes("minimum_[chrome|edge]_version") && technicalTableHtml.includes("left || right"),
  !mutationHtml.match(/(?:href|src)="[^"]*</) && mutationHtml.includes("<strong>label</strong>") && mutationHtml.includes("<code>code</code>"),
  terminalPaths === '["/","/","/2016-17",true]',
  clientEval(`tagSearchQuery(" XSS ")`) === "tag:xss",
  JSON.stringify(exactTagMatches) === '["exact"]',
  tagClickBehaviour.query === "tag:xss" && tagClickBehaviour.value === "tag:xss",
  tagClickBehaviour.label === "1 research item tagged “xss”",
  tagClickBehaviour.hidden === false && tagClickBehaviour.focused && tagClickBehaviour.closed && tagClickBehaviour.scrollTop === 0,
  backdropDialogBehaviour.outsideCloses === 1,
  backdropDialogBehaviour.insideCloses === 1 && backdropDialogBehaviour.childCloses === 1,
  // Route names must be own properties: a bare VIEWS[name] lookup also answers
  // for every Object.prototype key, so "#__proto__" would pass the guard.
  clientEval(`isViewName("__proto__") || isViewName("constructor") || isViewName("toString")`) === false,
  clientEval(`resolveViewHash("__proto__") === null && resolveViewHash("constructor") === null`) === true,
  // Query qualifiers and fenced-code language names are untrusted strings.
  // Inherited Object properties must never be treated as field pickers or
  // keyword tables: doing so used to turn these inputs into client-side DoS.
  clientEval(`parseQuery("__proto__:x constructor:y").every((term) => term.pick === null)`) === true,
  clientEval(`highlightCode("<img src=x>", "constructor")`) === "&lt;img src=x&gt;",
  clientEval(`highlightCode("<img src=x>", "__proto__")`) === "&lt;img src=x&gt;",
  clientEval(`(() => { const q = String.fromCharCode(96); const md = q.repeat(4) + "md\\n" + q.repeat(3) + "\\n[example](https://example.com)\\n" + q.repeat(3) + "\\n" + q.repeat(4); const html = markdownDocument(md).html; return (html.match(/<pre>/g) || []).length === 1 && !html.includes('href="https://example.com"'); })()`) === true,
  clientEval(`issueUrl("__proto__", { title: "x" })`) === "https://github.com/irsdl/webhacklist/issues/new/choose",
  clientEval(`(() => { try { markdownDocument("x".repeat(MAX_MARKDOWN_BYTES + 1)); return false; } catch (error) { return error.message.includes("size limit"); } })()`) === true,
  clientEval(`(() => { try { markdownDocument("x\\n".repeat(MAX_MARKDOWN_LINES + 1)); return false; } catch (error) { return error.message.includes("line limit"); } })()`) === true,
  clientEval(`(() => { try { markdownDocument("[".repeat(MAX_INLINE_MARKERS + 1)); return false; } catch (error) { return error.message.includes("inline-complexity limit"); } })()`) === true,
  clientEval(`resolveViewHash("museum").view`) === "museum",
  clientEval(`JSON.stringify(resolveViewHash("read"))`) === '{"view":"favourites","savedMode":"read"}',
  progressiveLoad.count === progressiveRecord.count,
  progressiveLoad.loaded && progressiveLoad.year === progressiveRecord.id,
  progressiveWireKeysAbsent,
  progressiveLoad.readKey === progressiveLoad.favouriteKey && progressiveLoad.readKey === clientEval(`normalizeUrl(${JSON.stringify(progressiveLoad.originalUrl)})`),
  progressiveLoad.read === false && progressiveLoad.favourite === false,
  progressiveRequestUrl === `data/collections/${progressiveRecord.id}.json?v=${progressiveCatalogue.version}`
];
const securityChecks = [
  indexSource.includes("Content-Security-Policy"),
  indexSource.includes("script-src-attr 'none'") && headersSource.includes("script-src-attr 'none'"),
  indexSource.includes("object-src 'none'"),
  indexSource.includes("frame-src 'self'"),
  indexSource.includes("img-src 'self' data:") && !indexSource.includes("img-src 'self' data: https:"),
  indexSource.includes('id="pdf-dialog"'),
  indexSource.includes('id="pdf-frame"') && !/<iframe\b(?=[^>]*\bid="pdf-frame")[^>]*\bsandbox=/i.test(indexSource),
  // The sandbox now travels with the navigation rather than being set on a
  // long-lived element: the separate-origin reader must be given it, and the
  // browser-native viewer - which cannot start inside one - must not be.
  appSource.includes("navigatePdfFrame(inSitePdfReaderUrl(documentUrl), PDF_READER_SANDBOX)")
    && appSource.includes('if (sandbox) frame.setAttribute("sandbox", sandbox);')
    && appSource.includes('else frame.removeAttribute("sandbox");')
    && /navigatePdfFrame\(`\$\{documentUrl\}#[^`]*`\);/.test(appSource),
  appSource.includes('const PDF_READER_ORIGIN = "https://irsdl.github.io"'),
  // The COMPLETE frame-src, in both places it is declared. Asserting the whole
  // value rather than a prefix is the point: a prefix check passes no matter
  // what gets appended, and this is the one directive the archive widens.
  // Exactly two third parties are allowed - the PDF reader and the video player.
  ["frame-src 'self' https://irsdl.github.io https://www.youtube-nocookie.com;",
   "frame-src 'self' https://irsdl.github.io https://www.youtube-nocookie.com;"]
    .every((value, index) => (index === 0 ? indexSource : headersSource).includes(value)),
  // The player is reached through a locally drawn facade, so no image, script or
  // connection host is opened up for it.
  !indexSource.includes("ytimg") && !headersSource.includes("ytimg")
    && !headersSource.includes("script-src 'self' https://"),
  pdfReaderHtmlSource.includes("default-src 'none'") && pdfReaderHtmlSource.includes("worker-src 'self'") && pdfReaderHtmlSource.includes("font-src data: blob:"),
  pdfReaderSource.includes('import "./pdf-reader-polyfills.mjs"') && pdfReaderSource.includes('import { safePdfUrl } from "./pdf-reader-url.mjs"') && pdfReaderSource.includes("isEvalSupported: false"),
  pdfReaderSource.includes('new URL("./pdf-worker.mjs", import.meta.url)') && pdfWorkerSource.includes('import "./pdf-reader-polyfills.mjs"'),
  ["Promise.withResolvers", "Promise.try", "Uint8Array.fromBase64", "toBase64", "toHex", "Math.sumPrecise", "Set.prototype.intersection", "transferToFixedLength", "AbortSignal.any", "Response.prototype.bytes"].every((name) => pdfReaderPolyfillsSource.includes(name)),
  safePdfReaderUrl("https://webhacklist.com/archived-references/pdf/2025/example.pdf?v=20260816")?.pathname === "/archived-references/pdf/2025/example.pdf",
  safePdfReaderUrl("https://irsdl.github.io/webhacklist/original-listings/2025-top10.pdf")?.hostname === "irsdl.github.io",
  safePdfReaderUrl("javascript:alert(1)") === null && safePdfReaderUrl("https://evil.example/archived-references/pdf/2025/example.pdf") === null,
  safePdfReaderUrl("https://webhacklist.com/archived-references/pdf/2025/example.pdf?redirect=https://evil.example") === null,
  pdfReaderSource.includes("MAX_RENDERED_PAGES") && pdfReaderSource.includes("IntersectionObserver"),
  pdfReaderSource.includes('parent.postMessage({ type: "pdf-reader-loaded" }, "https://webhacklist.com")'),
  !/<a\b(?=[^>]*target=["']_blank["'])(?![^>]*rel=["'][^"']*noopener)[^>]*>/i.test(pdfReaderHtmlSource),
  appSource.includes("function safeArchivePath"),
  appSource.includes('method: "HEAD"'),
  !/img-src[^;]*\bhttp:/.test(indexSource),
  !hostileHtml.includes("<img"),
  appSource.includes('`md-${'),
  !/\beval\s*\(|new\s+Function\s*\(|document\.write\s*\(/.test(sourceBundle),
  unsafeBlankTargets.length === 0,
  ...activeClientSecurityChecks
];
const constellationChecks = [
  constellationSource.includes("tugNode(node, deltaX, deltaY, timeStamp)"),
  constellationSource.includes("tidyStars()"),
  constellationSource.includes("separateArticleNodes() {"),
  constellationSource.includes("const radius = 62 + ring * 24 + random() * 46"),
  constellationSource.includes("drawWinnerHalo(node, projected, size, time, visibility)"),
  constellationSource.includes("const compactStar = !winner && size < 5.2"),
  constellationSource.includes("size * 3.15 * prominence"),
  constellationSource.includes("const badgeRects = []"),
  !constellationSource.includes("ctx.shadowBlur = selected ? 28 : hovered ? 20 : 10"),
  constellationSource.includes('const isTopTen = (item) => item?.section === "winner"'),
  constellationSource.includes("prefers-reduced-motion: reduce"),
  constellationSource.includes("refreshFavouriteState()"),
  constellationSource.includes("node.item.favourite"),
  appSource.includes('id="space-tidy" type="button" disabled'),
  appSource.includes("GOLD HALO / TOP 10"),
  appSource.includes('data-star-status="top10"'),
  appSource.includes('starStatus: "all"'),
  stylesSource.includes(".is-star-tugging"),
  // THE FIELD'S RECORDING FILTER, the museum's Recorded chip and the
  // observatory's Recorded button asked in the third room that filters. It ANDs
  // over the chosen topic and the chosen standing, exactly as those two do.
  appSource.includes("starRecordedOnly: false"),
  appSource.includes("state.starRecordedOnly ? standingItems.filter((item) => item.videos?.length) : standingItems"),
  appSource.includes('event.target.closest("[data-star-recorded]")'),
  // ...and it is not cleared by the topic, year or standing controls, which
  // answer a different question.
  !/starStatusTarget[\s\S]{0,400}state\.starRecordedOnly = false/.test(appSource),
  !/topicTarget[\s\S]{0,400}state\.starRecordedOnly = false/.test(appSource),
  starFilters.resting.includes("data-star-recorded") && starFilters.resting.includes('aria-pressed="false"') && starFilters.resting.includes("<b>3</b>"),
  starFilters.pressed.includes('aria-pressed="true"'),
  // Nothing to filter and not filtering: no control. Filtering and nothing
  // left: the control stays, or the reader is stranded in an empty field.
  starFilters.nothingToFilter === "",
  starFilters.pressedAtZero.includes('aria-pressed="true"') && starFilters.pressedAtZero.includes("<b>0</b>"),
  // The preliminary years filter too - they are the ones a recording is most
  // often the only published artefact of.
  appSource.includes("${recordedFilterButton(recordedHere)}</div>"),
  stylesSource.includes(".star-recorded-filter")
];
const requestedViews = [...indexSource.matchAll(/data-view="([^"]+)"/g)].map((match) => match[1]);
const experienceChecks = [
  JSON.stringify(requestedViews) === JSON.stringify(["evidence", "museum", "library", "time", "signals", "constellation", "terminal", "desk", "favourites"]),
  newestFirstYearIds[0] === "2026-ai" && newestFirstYearIds[1] === "2025" && newestFirstYearIds.at(-1) === "2006",
  newestFirstYearIds.every((year, index) => index === 0 || Number.parseInt(newestFirstYearIds[index - 1], 10) >= Number.parseInt(year, 10)),
  JSON.stringify(newestFirstYearPillIds) === JSON.stringify(newestFirstYearIds),
  indexSource.includes('src="brand-mark.svg"'),
  indexSource.includes("WEB HACKING"),
  !indexSource.includes("brand-glyph"),
  stylesSource.includes("--accent: #ffb454"),
  stylesSource.includes("--signal: #7899ff"),
  !indexSource.includes('src="castle.js"'),
  !appSource.includes("function renderCastle"),
  !appSource.includes("function renderTimeline"),
  !appSource.includes("function renderDig"),
  !appSource.includes("function renderCatalogue"),
  appSource.includes('title: "The Hacker Terminal"'),
  appSource.includes('title: "The Investigation Board"'),
  appSource.includes('title: "Signal Observatory"'),
  // The page is named for the archive, not for the room being viewed. The one
  // h1 is the masthead's site name; over the records a small h2 names the mode,
  // and no display heading repeats the site name there.
  indexSource.includes('<h1 class="brand-copy"><strong>WEB HACKING</strong><b>TECHNIQUES INDEX</b>'),
  (indexSource.match(/<h1[ >]/g) || []).length === 2, // the masthead, plus the boot screen app.js removes
  indexSource.includes('<h2 class="view-mode" id="view-mode">'),
  !indexSource.includes("view-title"),
  !appSource.includes("#view-title"),
  !stylesSource.includes(".view-intro h1"),
  appSource.includes('$("#view-mode").textContent = copy.title'),
  appSource.includes("document.title = SITE_DOCUMENT_TITLE"),
  !appSource.includes("${copy.title} — Web Hacking Techniques Index"),
  clientEval("SITE_DOCUMENT_TITLE") === (indexSource.match(/<title>([^<]*)<\/title>/) || [])[1],
  stylesSource.includes(".view-intro .view-mode"),
  appSource.includes("function renderSignals"),
  appSource.includes('signalStatus: "all"'),
  appSource.includes('data-signal-status="top10"'),
  appSource.includes('data-signal-status="nominee"'),
  appSource.includes("data-signal-more"),
  // Summaries are visible where there is room to read them, but the dense
  // nomination wall stays compact. Record details remain summary-first, and
  // library/search previews explain the article before a reader opens it.
  summaryCardMarkup.includes('class="card-summary"') && summaryCardMarkup.includes("A &lt;finding&gt; &amp; its impact"),
  !compactSummaryCardMarkup.includes('class="card-summary"'),
  appSource.includes("<h3>What the research found</h3>"),
  appSource.includes('class="shelf-plate-summary"'),
  indexSource.indexOf('id="artifact-digest"') < indexSource.indexOf('id="artifact-actions"'),
  indexSource.indexOf('id="artifact-actions"') < indexSource.indexOf('id="artifact-context"'),
  indexSource.includes('id="global-results"') && indexSource.includes('tabindex="-1"'),
  appSource.includes("dialog.dataset.view = state.view"),
  appSource.includes('$("#artifact-digest").addEventListener("click", handleArtifactTagClick)'),
  appSource.includes('aria-controls="global-results"'),
  appSource.includes("document.documentElement.dataset.view = state.view"),
  appSource.includes("wireDialogDismissal($(id))"),
  // The record dialog and the report that opens on top of it share ONE per-room
  // palette, so the selector carries both. Asserting the text keeps a later
  // edit from theming the record and leaving the report in the contribution
  // form's mint, which is exactly how the two came apart the first time.
  stylesSource.includes(':is(.artifact-dialog, .report-dialog):is([data-view="museum"],[data-view="signals"])'),
  stylesSource.includes(':is(.artifact-dialog, .report-dialog)[data-view="constellation"]'),
  stylesSource.includes("*::-webkit-scrollbar-thumb"),
  appSource.includes("function documentShareUrl"),
  appSource.includes("function shareDocument"),
  indexSource.includes('id="pdf-share"'),
  appSource.includes('id="reader-share"'),
  appSource.includes("function terminalCompletion"),
  appSource.includes("function compileSafeGrep"),
  appSource.includes("function resolveTerminalPath"),
  appSource.includes("terminalYear ? preliminaryNotice(terminalYear)"),
  appSource.includes("function renderFavourites"),
  appSource.includes("function setFavouriteState"),
  appSource.includes('fetch("data/catalogue.json"'),
  !appSource.includes('fetch("../archived-references/manifest.json"'),
  appSource.includes("scheduleArchivePrefetch"),
  appSource.includes("connection?.saveData"),
  indexSource.includes('id="favourite-count"'),
  indexSource.includes('id="read-count"'),
  appSource.includes("function savedItems"),
  appSource.includes("function readItems"),
  appSource.includes('const SAVED_MODES = ["favourites", "read", "all"]'),
  appSource.includes("state.savedYears.has(item.year)"),
  appSource.includes("state.savedTopics.has(item.topic)"),
  appSource.includes('data-saved-mode="'),
  appSource.includes("data-saved-year="),
  appSource.includes("data-saved-topic="),
  appSource.includes("data-saved-unread="),
  stylesSource.includes(".saved-modes"),
  stylesSource.includes(".saved-filter-note"),
  savedFilters.favourites === 2 && savedFilters.read === 2 && savedFilters.both === 3,
  savedFilters.twoYears === 3 && savedFilters.oneYear === 1 && savedFilters.yearAndTopic === 2,
  indexSource.includes('href="https://github.com/irsdl/webhacklist"'),
  indexSource.includes('href="https://github.com/irsdl/webhacklist/blob/master/.claude/skills/webseclist-judge-reference/SKILL.md"'),
  indexSource.includes('href="https://x.com/irsdl"'),
  indexSource.includes('class="site-footer"'),
  // Support asks: a sponsor entry in both navigations, and a footer block that
  // pairs the free ask (star) with the paid one.
  (indexSource.match(/href="https:\/\/github\.com\/sponsors\/irsdl"/g) || []).length === 3,
  indexSource.includes('class="support-actions"'),
  indexSource.includes('class="support-action is-star"') && indexSource.includes("Star it on GitHub"),
  indexSource.includes('class="support-action is-sponsor"'),
  indexSource.includes('href="https://github.com/irsdl/webhacklist/blob/master/SUPPORT.md"'),
  stylesSource.includes(".support-action.is-star") && stylesSource.includes(".support-action.is-sponsor"),
  indexSource.includes("Jeremiah Grossman") && indexSource.includes("created the list and curated 2006–2015"),
  indexSource.includes("James Kettle") && indexSource.includes("PortSwigger") && indexSource.includes("curators since 2016"),
  indexSource.includes("Every researcher behind the 1,100+ techniques collected here"),
  indexSource.includes("Soroush Dalili (@irsdl)"),
  appSource.includes("openReader(item)"),
  appSource.includes("openPdfViewer(item)"),
  appSource.includes("function layoutInvestigationBoard"),
  appSource.includes("function makeInvestigationCardDraggable"),
  stylesSource.includes(".hacker-terminal"),
  stylesSource.includes(".investigation-board"),
  stylesSource.includes(".signal-observatory"),
  !stylesSource.includes(".artifact-dialog.signal-artifact"),
  stylesSource.includes(".signal-status-filter")
];
// Search engines print ONE name above the result, and they pick it from these
// signals together. They have to agree, or the name of whichever archive mode
// happens to be open gets printed as the name of the site.
const SITE_NAME = "Web Hacking Techniques Index";
const structuredData = JSON.parse((indexSource.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1] || "null");
const webManifest = JSON.parse(await readFile(path.join(root, "website/site.webmanifest"), "utf8"));
const metaContent = (name) => (indexSource.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`)) || [])[1];
const documentTitle = (indexSource.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
const viewTitles = Object.values(JSON.parse(clientEval("JSON.stringify(VIEWS)"))).map((view) => view.title);
const interfaceAssetVersions = [...indexSource.matchAll(/(?:href|src)="(?:styles\.css|app\.js|constellation\.js|discovery\.(?:js|css))\?v=(\d{8}\.\d+)"/g)].map((match) => match[1]);
const deploymentChecks = [
  structuredData?.["@type"] === "WebSite",
  structuredData?.name === SITE_NAME,
  structuredData?.alternateName === "Web Hack List",
  structuredData?.url === "https://webhacklist.com/",
  metaContent("og:site_name") === SITE_NAME,
  metaContent("og:title") === SITE_NAME,
  metaContent("application-name") === SITE_NAME,
  webManifest.name === SITE_NAME,
  clientEval("SITE_TITLE") === SITE_NAME,
  documentTitle.startsWith(SITE_NAME),
  viewTitles.length === 9,
  !viewTitles.some((title) => `${documentTitle} ${metaContent("og:site_name")} ${structuredData?.name}`.includes(title)),
  indexSource.includes('rel="canonical" href="https://webhacklist.com/"'),
  indexSource.includes('rel="manifest" href="site.webmanifest"'),
  indexSource.includes('id="site-fullscreen"'),
  indexSource.includes('id="view-fullscreen"'),
  clientEval('["desk", "time"].every((view) => FULLSCREEN_VIEWS.has(view))'),
  clientEval(`[...FULLSCREEN_VIEWS].every((view) => Object.hasOwn(VIEWS, view)) && Object.keys(VIEWS).every((view) => FULLSCREEN_VIEWS.has(view))`) === true,
  appSource.includes("function toggleSiteFullscreen"),
  appSource.includes("requestFullscreen(document.documentElement)"),
  appSource.includes("function toggleViewFullscreen"),
  appSource.includes("function setViewFullscreenFallback") && appSource.includes("viewButton.hidden = !supportedView"),
  stylesSource.includes("height: 100dvh"),
  appSource.includes("function syncDialogScrollLock") && appSource.includes("function showLockedModal"),
  clientEval(`usesInSitePdfReader("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)")`) === true,
  clientEval(`usesInSitePdfReader("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)", 390)`) === true,
  clientEval(`usesInSitePdfReader("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)", 1440)`) === false,
  clientEval(`inSitePdfReaderUrl("https://webhacklist.com/archived-references/pdf/2025/example.pdf?v=20260816", "light")`) === "https://irsdl.github.io/webhacklist/pdf-reader.html?file=https%3A%2F%2Fwebhacklist.com%2Farchived-references%2Fpdf%2F2025%2Fexample.pdf%3Fv%3D20260816&theme=light",
  !appSource.includes('window.open(externalUrl, "_blank"'),
  // A view change rewrites only the fragment of the PDF's address, and a
  // fragment-only change is a same-document navigation: unless the element is
  // replaced the frame keeps the document it has, fires no `load`, and the
  // overlay stays up until the fallback buries a working document.
  appSource.includes("const frame = current.cloneNode(false);") && appSource.includes("current.replaceWith(frame);"),
  // Chrome's viewer reads `view` and ignores a non-numeric `zoom`; pdf.js reads
  // `zoom` and ignores `view`. One button has to state both spellings.
  clientEval(`PDF_OPEN_PARAMETERS["page-width"]`) === "view=FitH&zoom=page-width",
  clientEval(`PDF_OPEN_PARAMETERS["page-fit"]`) === "view=Fit&zoom=page-fit",
  // A large file buys proportionally longer than the base wait before the
  // fallback message replaces a document that was still arriving, up to a bound.
  clientEval(`(state.pdfBytes = 0, pdfLoadTimeout(9000))`) === 9000,
  clientEval(`(state.pdfBytes = 4_000_000, pdfLoadTimeout(9000))`) === 17000,
  clientEval(`(state.pdfBytes = 900_000_000, pdfLoadTimeout(9000))`) === 45000,
  clientEval(`(state.pdfBytes = 0, state.pdfBytes)`) === 0,
  // The two off-Cloudflare backups are never probed, so the limit they exceeded
  // stands in for the size no HEAD request will report.
  appSource.includes("state.pdfBytes = Number(ARCHIVE_CATALOGUE?.hosting?.cloudflareMaxAssetBytes) || 0;"),
  indexSource.includes('id="pdf-fallback-open"'),
  interfaceAssetVersions.length === 5 && new Set(interfaceAssetVersions).size === 1,
  (indexSource.match(/id="mobile-menu-backdrop"/g) || []).length === 1,
  appSource.includes('$("#mobile-menu-backdrop").addEventListener("click", () => {') && appSource.includes('focusWithoutScroll($("#mobile-menu"))'),
  stylesSource.includes("body.menu-open .mobile-menu-backdrop") && stylesSource.includes("pointer-events: auto"),
  appSource.includes('$("#concept-sidebar").toggleAttribute("inert", compact && !isOpen)') && appSource.includes('event.target.closest("a, button")'),
  appSource.includes('window.matchMedia("(max-width: 820px)").addEventListener("change", () => setMobileMenuOpen(false))'),
  appSource.includes('document.addEventListener("pointerdown"') && appSource.includes('event.target.closest?.("#global-results, .global-search")'),
  indexSource.includes('id="pdf-links-backdrop"') && indexSource.includes('id="pdf-links-toggle" type="button" aria-controls="pdf-links"'),
  appSource.includes('$("#pdf-dialog").addEventListener("cancel"') && appSource.includes('$("#pdf-links-backdrop").hidden = !show'),
  stylesSource.includes(".pdf-links-backdrop[hidden] { display: none; }") && stylesSource.includes(".pdf-links header button { width: 42px; height: 42px; }"),
  pdfReaderHtmlSource.includes(`src="pdf-reader.mjs?v=${interfaceAssetVersions[0]}"`) && pdfReaderHtmlSource.includes(`href="pdf-reader.css?v=${interfaceAssetVersions[0]}"`),
  pdfReaderCssSource.includes("overscroll-behavior: contain") && pdfReaderCssSource.includes("-webkit-overflow-scrolling: touch"),
  stylesSource.includes("body.document-dialog-open") && stylesSource.includes("overscroll-behavior: contain"),
  stylesSource.includes(".reader-dialog[open] { display: grid") && stylesSource.includes(".pdf-dialog[open] { display: grid"),
  stylesSource.includes(".markdown-body a { color: var(--document-accent); overflow-wrap: anywhere"),
  indexSource.indexOf('id="pdf-new-tab"') < indexSource.indexOf('id="pdf-theme-toggle"'),
  // record, reader, PDF, contribute, report
  (indexSource.match(/<dialog\b[^>]*tabindex="-1"/g) || []).length === 5,
  stylesSource.includes(".investigation-board { display: grid; width: 100%; min-height: 0 !important; grid-template-columns: minmax(0,1fr)"),
  stylesSource.includes("main:fullscreen .favourites-view"),
  stylesSource.includes("main:fullscreen .museum-map"),
  stylesSource.includes("main.view-fullscreen-fallback .museum-map") && stylesSource.includes("main.view-fullscreen-fallback .library-hall"),
  progressiveCatalogue.hosting?.cloudflareMaxAssetBytes === 26214400,
  Object.keys(progressiveCatalogue.hosting?.largePdfFallbacks || {}).length >= 1,
  Object.values(progressiveCatalogue.hosting?.largePdfFallbacks || {}).every((url) => String(url).startsWith("https://irsdl.github.io/webhacklist/")),
  buildSiteSource.includes('target === "cloudflare" && stat.size > assetLimit'),
  buildSiteSource.includes("fileCount > 20000"),
  buildSiteSource.includes('target === "github"') && buildSiteSource.includes("Object.keys(largeFallbacks)"),
  buildSiteSource.includes('const PDF_READER_FILES = ["pdf-reader.css", "pdf-reader.html", "pdf-reader.mjs", "pdf-reader-polyfills.mjs", "pdf-reader-url.mjs", "pdf-worker.mjs"]'),
  buildSiteSource.includes('const STATIC_DIRECTORIES = ["vendor/pdfjs"]'),
  buildSiteSource.includes("GitHub Pages site-size limit exceeded"),
  buildSiteSource.includes("default-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'"),
  headersSource.includes("frame-ancestors 'self'"),
  headersSource.includes("Cross-Origin-Opener-Policy: same-origin"),
  headersSource.includes("Cross-Origin-Resource-Policy: same-origin"),
  headersSource.includes("Origin-Agent-Cluster: ?1"),
  headersSource.includes("Strict-Transport-Security: max-age=31536000"),
  // Fullscreen stays the site's own, plus the video player it now hosts.
  headersSource.includes('fullscreen=(self "https://www.youtube-nocookie.com")'),
  notFoundSource.includes("default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; object-src 'none'"),
  headersSource.includes("/data/collections/*"),
  headersSource.includes("max-age=31536000, immutable"),
  headersSource.includes("/vendor/pdfjs/*")
];

// The submission route crosses two files that nothing else keeps in step: the
// app prefills GitHub's issue form by field id, and a renamed field there would
// drop the answer silently rather than fail. So the ids, the template filenames
// and the year options are checked against each other here.
const submissionFormSource = await readFile(path.join(root, ".github/ISSUE_TEMPLATE/01-submit-research.yml"), "utf8");
// config.yml is the chooser's own configuration, not one of the forms.
const issueTemplateFiles = new Set((await readdir(path.join(root, ".github/ISSUE_TEMPLATE"))).filter((name) => name.endsWith(".yml") && name !== "config.yml"));
const submissionFieldIds = [...submissionFormSource.matchAll(/^ {4}id:\s*([a-z0-9-]+)\s*$/gm)].map((match) => match[1]);
const submissionFormYears = [...submissionFormSource.matchAll(/^ {8}- "(\d{4})"$/gm)].map((match) => match[1]);
// The inaccuracy form's own fields and fault list. Both are stated twice - in
// the page and in the issue template - and a prefill only lands if the two
// agree exactly, so the test compares them rather than trusting either.
const inaccuracyFormSource = await readFile(path.join(root, ".github/ISSUE_TEMPLATE/06-record-inaccuracy.yml"), "utf8");
const inaccuracyFieldIds = [...inaccuracyFormSource.matchAll(/^ {4}id:\s*([a-z0-9-]+)\s*$/gm)].map((match) => match[1]);
const inaccuracyFaults = [...inaccuracyFormSource.matchAll(/^ {8}- (.+)$/gm)].map((match) => match[1].trim());
const reportFaults = JSON.parse(clientEval("JSON.stringify(REPORT_FAULTS)"));
const appTemplateNames = [...appSource.matchAll(/"(\d\d-[a-z0-9-]+\.yml)"/g)].map((match) => match[1]);
const indexTemplateNames = [...indexSource.matchAll(/issues\/new\?template=([0-9a-z-]+\.yml)/g)].map((match) => match[1]);
const catalogueYearIds = progressiveCatalogue.years.map((record) => record.id);
const offeredYears = JSON.parse(clientEval(`YEAR_FILES = ${JSON.stringify(catalogueYearIds)}; JSON.stringify(submissionYears())`));
const prefilledIssueUrl = clientEval(`issueUrl("research", {
  title: "[Research] Example",
  "research-url": "https://example.test/post",
  year: "2019",
  "whats-new": "line one\\n\\nline two"
})`);
// Six fields at the per-field cap would make an address GitHub answers with an
// error page instead of a form, so the overflow has to be dropped whole.
const floodedIssueUrl = clientEval(`issueUrl("research", Object.fromEntries(
  ["title", "research-url", "research-title", "researchers", "whats-new", "prior-art"].map((field) => [field, "x".repeat(9000)])
))`);
const submissionMatching = JSON.parse(clientEval(`
  state.items = [{
    id: "2019-1", year: "2019", yearLabel: "2019", rank: 1, topic: "HTTP",
    title: "HTTP Desync Attacks: Request Smuggling Reborn",
    originalUrl: "https://portswigger.net/research/http-desync-attacks",
    links: [{ url: "https://portswigger.net/research/http-desync-attacks" }, { url: "https://youtu.be/example" }]
  }, {
    id: "2008-4", year: "2008", yearLabel: "2008", rank: null, topic: "Other",
    title: "A blog on query-string permalinks",
    originalUrl: "https://oldblog.test/?p=123",
    links: [{ url: "https://oldblog.test/?p=123" }]
  }];
  submissionIndexCache = null;
  const match = (url, title = "") => submissionMatches({ url: safeExternalUrl(url), title });
  const result = {
    exact: match("https://portswigger.net/research/http-desync-attacks").exact?.id || "",
    loose: match("http://www.portswigger.net/research/http-desync-attacks/").exact?.id || "",
    tracked: match("https://portswigger.net/research/http-desync-attacks?utm_source=newsletter&fbclid=x").exact?.id || "",
    replayed: match("https://web.archive.org/web/20200101/https://portswigger.net/research/http-desync-attacks").exact?.id || "",
    secondLink: match("https://youtu.be/example").exact?.id || "",
    unrelated: match("https://example.test/nothing-like-it").exact?.id || "",
    // The query IS the article on a blog of that era, so a different post on
    // the same host is a different record - not a duplicate of it.
    permalink: match("https://oldblog.test/?p=123").exact?.id || "",
    otherPermalink: match("https://oldblog.test/?p=456").exact?.id || "",
    similar: match("https://example.test/nothing-like-it", "Request smuggling reborn, revisited").similar.map((item) => item.id),
    unrelatedTitle: match("https://example.test/nothing-like-it", "Prototype pollution in the wild").similar.length
  };
  state.items = [];
  submissionIndexCache = null;
  JSON.stringify(result)
`));
const contributionChecks = [
  // Every route the page offers has a form behind it, and every form the app
  // names is a file that exists.
  // research, dead link, faulty capture, credit, website, record inaccuracy
  issueTemplateFiles.size === 6,
  appTemplateNames.length === 6 && appTemplateNames.every((name) => issueTemplateFiles.has(name)),
  indexTemplateNames.length >= 6 && indexTemplateNames.every((name) => issueTemplateFiles.has(name)),
  (await exists(".github/ISSUE_TEMPLATE/config.yml")) && (await exists(".github/PULL_REQUEST_TEMPLATE.md")) && (await exists("CONTRIBUTING.md")),
  ["research-url", "research-title", "year", "researchers", "whats-new", "prior-art"].every((id) => submissionFieldIds.includes(id)),
  // A year the site can offer but the form cannot accept loses that answer.
  offeredYears.length >= 20 && offeredYears.every((year) => submissionFormYears.includes(year)),
  JSON.stringify(offeredYears.slice(0, 3)) === JSON.stringify([...offeredYears].sort((a, b) => Number(b) - Number(a)).slice(0, 3)),
  prefilledIssueUrl.startsWith("https://github.com/irsdl/webhacklist/issues/new?template=01-submit-research.yml"),
  prefilledIssueUrl.includes("research-url=https%3A%2F%2Fexample.test%2Fpost") && prefilledIssueUrl.includes("year=2019"),
  prefilledIssueUrl.includes("whats-new=line+one%0A%0Aline+two"),
  clientEval(`issueUrl("no-such-form")`) === "https://github.com/irsdl/webhacklist/issues/new/choose",
  floodedIssueUrl.length <= 6000 && floodedIssueUrl.includes("template=01-submit-research.yml"),
  // A submitted address is not a URL the page will follow, but it is still
  // validated before it is written into an outbound link.
  clientEval(`submissionIssueUrl({ url: safeExternalUrl("javascript:alert(1)"), title: "", year: "", researchers: "", whatsNew: "" })`) === "https://github.com/irsdl/webhacklist/issues/new?template=01-submit-research.yml",
  clientEval(`issueFieldText("a\\u202Eb\\u0007c")`) === "abc",
  clientEval(`issueFieldText("first\\n\\n\\n\\nsecond")`) === "first\n\nsecond",
  // THE INACCURACY REPORT COVERS THE WHOLE RECORD. It began as a video desk -
  // four of its seven faults were about a recording, and the one fault that
  // actually breaks a record for every later reader, a preserved Markdown copy
  // that no longer says what its own PDF says, was not on the list at all.
  reportFaults[0] === "The Markdown and the PDF do not match",
  // Exactly one fault is ABOUT a video. "Something is missing — a copy, a link
  // or a recording" names one too, but it is the catch-all for the whole
  // record, so the count is of the video-specific option.
  reportFaults.filter((fault) => /\bvideo\b/i.test(fault)).length === 1,
  reportFaults.some((fault) => /link/i.test(fault)) && reportFaults.some((fault) => /author, publisher or title/i.test(fault)),
  // Every fault the page offers must exist in the dropdown the prefill lands
  // on, or GitHub drops the answer and the report arrives blank.
  reportFaults.every((fault) => inaccuracyFaults.includes(fault)),
  inaccuracyFaults.length === reportFaults.length,
  // ...and the same for the fields.
  ["record", "fault", "part", "replacement", "notes"].every((id) => inaccuracyFieldIds.includes(id)),
  !inaccuracyFieldIds.includes("video-url") && !appSource.includes('"video-url"'),
  indexSource.includes('id="report-part"') && !indexSource.includes('id="report-video"'),
  // The part picker offers the whole record, not just its recordings.
  appSource.includes("function reportParts") && appSource.includes('add("Preserved Markdown", item.mdPath)') && appSource.includes('add("Preserved PDF", item.pdfPath)'),
  // It opens on top of the record, so it wears that record's room and accent
  // rather than the contribution form's mint.
  indexSource.includes('class="contribute-dialog report-dialog"'),
  /function openReportDialog[\s\S]*?dialog\.dataset\.view = state\.view/.test(appSource),
  stylesSource.includes(".report-dialog .artifact-actions a") && !stylesSource.includes(".report-dialog .artifact-actions a, .report-dialog .artifact-actions button { color: #041a10"),
  // And it dismisses the way every other modal here does.
  appSource.includes("function wireDialogDismissal(dialog)"),
  submissionMatching.exact === "2019-1",
  submissionMatching.loose === "2019-1",
  submissionMatching.tracked === "2019-1",
  submissionMatching.replayed === "2019-1",
  submissionMatching.secondLink === "2019-1",
  submissionMatching.unrelated === "",
  submissionMatching.permalink === "2008-4",
  submissionMatching.otherPermalink === "",
  JSON.stringify(submissionMatching.similar) === '["2019-1"]',
  submissionMatching.unrelatedTitle === 0,
  indexSource.includes('id="contribute-dialog"'),
  (indexSource.match(/data-contribute\b/g) || []).length === 3,
  indexSource.includes('id="contribute-issue"') && indexSource.includes('id="contribute-check"'),
  appSource.includes("function openSubmissionDialog"),
  appSource.includes("function submissionMatches"),
  appSource.includes('if (next === "submit")'),
  stylesSource.includes(".contribute-check.is-match") && stylesSource.includes(".contribute-check.is-clear"),
  stylesSource.includes(".support-action.is-contribute")
];

// TALK RECORDINGS. The video is stored on the reference, not on the year list,
// so the two ways it can silently disappear are the shard dropping the field and
// the dialog dropping the control. Both are asserted, along with the two rules
// that make an off-site link safe to offer and an uncertain one honest.
// A talk belongs to this story only when its reviewed media source says so.
const sourceGroups = JSON.parse(await readFile(path.join(root, "archived-references/source-groups.json"), "utf8"));
const oldVimeoUrl = "https://vimeo.com/ondemand/44conlondon2015/142249673";
const asyncResearch = Object.values(sourceGroups.groups).find(group => group.identity === oldVimeoUrl);
assert.ok(asyncResearch, "Historical asynchronous research identity is preserved");
assert.equal(asyncResearch.sources.find(source => source.id === asyncResearch.main)?.url,
  "https://portswigger.net/research/hunting-asynchronous-vulnerabilities");
assert.ok(!asyncResearch.sources.some(source => source.url === oldVimeoUrl), "Mismatched Vimeo presentation must not remain an active research source");
assert.ok(asyncResearch.sources.some(source => source.url === "https://www.youtube.com/watch?v=ha6LD1-RiJU" && source.relation === "same-work"));
// Regression: even a confirmed recording on a background paper must not
// create a talk player, badge or filter match for the article citing it.
const recordingIsolation = clientEval(`(() => {
  const article = "https://example.org/article";
  const background = "https://example.org/earlier-paper";
  const video = "https://www.youtube.com/watch?v=abcdefghijk";
  const lookup = new Map([[normalizeUrl(background), {videos: [{url: video, confidence: "confirmed"}]}]]);
  const base = {id: "article", url: article, label: "Article", relation: "same-work", kind: "article"};
  const prior = {id: "prior", url: background, label: "Earlier work", relation: "background", kind: "paper"};
  const clip = {id: "clip", url: video, label: "Related recording", relation: "background", kind: "video", recording: {confidence: "confirmed"}};
  const group = {main: "article", sources: [base, prior, clip]};
  const parse = () => parseYearMarkdown("- [Article](" + article + ")", "2024", lookup, {status: "final"}, {"2024.md:1": group})[0];
  const backgroundItem = parse();
  clip.relation = "same-work";
  const sameWorkItem = parse();
  delete clip.recording;
  const demoItem = parse();
  return {
    background: backgroundItem.videos?.length || 0,
    backgroundPlayer: Boolean(playableTalk(backgroundItem)),
    backgroundBadge: videoMark(backgroundItem),
    sameWork: sameWorkItem.videos?.length || 0,
    demo: demoItem.videos?.length || 0,
    companionRetained: backgroundItem.links.some(link => link.url === video)
  };
})()`);
assert.deepEqual(JSON.parse(JSON.stringify(recordingIsolation)), {
  background: 0, backgroundPlayer: false, backgroundBadge: "", sameWork: 1,
  demo: 0, companionRetained: true
});
assert.equal(clientEval('youtubeStartSeconds("https://youtu.be/abcdefghijk?t=1516")'), 1516);
assert.equal(clientEval('youtubeStartSeconds("https://youtu.be/abcdefghijk?t=1h2m3s")'), 3723);
assert.equal(clientEval('youtubeStartSeconds("https://youtu.be/abcdefghijk?t=999999")'), 0);
assert.equal(clientEval('youtubeStartSeconds("https://youtu.be/abcdefghijk?t=bad")'), 0);
const expectedVideoRecords = Object.values(sourceGroups.groups).reduce((count, group) => count +
  (group.sources.some(source => source.kind === "video" && source.relation === "same-work" && source.recording?.confidence === "confirmed") ? group.citations.length : 0), 0);
const shardVideoRows = [];
for (const record of yearRecords) {
  const shard = JSON.parse(await readFile(path.join(root, `website/data/collections/${record.id}.json`), "utf8"));
  for (const item of shard.items || []) shardVideoRows.push(...(item.videos || []));
}
const shardVideoRecords = new Set();
for (const record of yearRecords) {
  const shard = JSON.parse(await readFile(path.join(root, `website/data/collections/${record.id}.json`), "utf8"));
  for (const item of shard.items || []) if (item.videos?.length) shardVideoRecords.add(item.id);
}
const manifestVideoUrls = new Set(
  Object.values(manifest.urls || {}).flatMap((record) => (record.videos || []).map((video) => video.url)));
// Within one confidence band the longer recording must come first.
const confidenceRank = { confirmed: 0, likely: 1, possible: 2 };
const videoOrderViolations = [];
for (const record of Object.values(manifest.urls || {})) {
  const videos = record.videos || [];
  for (let index = 1; index < videos.length; index++) {
    const previous = videos[index - 1];
    const current = videos[index];
    if (confidenceRank[previous.confidence] !== confidenceRank[current.confidence]) continue;
    if ((previous.seconds || 0) < (current.seconds || 0)) videoOrderViolations.push(current.url);
  }
}
const videoChecks = [
  shardVideoRecords.size > 0,
  // The shard carries every research the manifest gave a recording to; a
  // dropped allowlist key would show up here and nowhere else.
  shardVideoRecords.size === expectedVideoRecords,
  shardVideoRows.every((video) => /^https:\/\//.test(video.url)),
  shardVideoRows.every((video) => video.confidence === "confirmed"),
  // Every video the page offers is one the archive actually recorded.
  shardVideoRows.every((video) => manifestVideoUrls.has(video.url)),
  // A channel is not a venue, and these buckets were judging aids, not names.
  shardVideoRows.every((video) => !["conference upload", "PortSwigger research"].includes(video.conference || "")),
  // A proof-of-concept clip is not a talk. Nothing under five minutes ships.
  shardVideoRows.every((video) => !video.minutes || video.minutes >= 5),
  // Every stored recording is tied to the author, their company, or a stage
  // they stood on - never a third party retelling the research.
  Object.values(manifest.urls || {}).flatMap((record) => record.videos || [])
    .every((video) => ["author", "company", "conference stage", "links the article"].includes(video.by)),
  // Ordered longest-first within a confidence band, so the talk outranks the clip.
  shardVideoRecords.size > 0 && [...videoOrderViolations].length === 0,
  // Only a confirmed match may be called a talk; everything else is offered as
  // a potential related video, without naming a venue it may never have been at.
  appSource.includes('? "Potential related video"'),
  appSource.includes('video.confidence !== "confirmed"'),
  stylesSource.includes(".video-action.is-potential"),
  // Reporting an inaccuracy: a button on every record, a form, and a template
  // that actually exists in the repository.
  appSource.includes('id="report-inaccuracy"'),
  appSource.includes("function openReportDialog") && appSource.includes("function reportIssueUrl"),
  appSource.includes('inaccuracy: "06-record-inaccuracy.yml"'),
  indexSource.includes('id="report-dialog"') && indexSource.includes('id="report-fault"'),
  await exists(".github/ISSUE_TEMPLATE/06-record-inaccuracy.yml"),
  // CLICK TO LOAD. The page must ship no video iframe of its own, and the only
  // one it ever creates must be built in the click handler, from -nocookie.
  !/<iframe\b[^>]*youtube/i.test(indexSource),
  appSource.includes('frame.src = `https://www.youtube-nocookie.com/embed/'),
  appSource.includes("function renderTalkPanel") && appSource.includes('panel.querySelector(".talk-play-action").addEventListener("click"'),
  // The embedded talk is offered once. Repeating it as a button directly under
  // its own player is what made the block read as bolted on.
  appSource.includes("if (embedded && video.url === embedded.url) return;"),
  // Its new-tab route rides on the block instead.
  appSource.includes('class="talk-open"'),
  // Only a confirmed match gets a player; a guess stays a link.
  appSource.includes('(item.videos || []).find((video) => video.confidence === "confirmed" && youtubeId(video.url))'),
  indexSource.includes('id="artifact-talk"') && stylesSource.includes(".talk-card") && stylesSource.includes(".talk-play-action"),
  // The block sits ABOVE the action row, so the reader meets the talk without
  // scrolling a height-capped dialog.
  indexSource.indexOf('id="artifact-talk"') < indexSource.indexOf('id="artifact-actions"'),
  appSource.includes('class="secondary video-action${uncertain}"'),
  appSource.includes('target="_blank" rel="noopener noreferrer" title="${h(hint)}"'),
  appSource.includes('video.confidence === "confirmed"'),
  stylesSource.includes(".video-action"),
  // CLOSING THE RECORD STOPS THE TALK. A dismissed dialog only hides its
  // contents, so an iframe inside one keeps playing: the reader loses the
  // picture and the controls and keeps the sound. Destroying the frame is what
  // actually stops it, and it has to be wired to the dialog's own close event.
  appSource.includes("function stopTalkPlayback"),
  /function stopTalkPlayback\(\)[\s\S]*?panel\.innerHTML = "";/.test(appSource),
  /\$\("#artifact-dialog"\)\.addEventListener\("close", \(\) => \{\s*if \(!\$\("#artifact-dialog"\)\.open\) stopTalkPlayback\(\);\s*\}\)/.test(appSource),
  // THE MARK, drawn once and shown in every room. A record with a recording
  // should be visible as such while scanning any view, not only after opening
  // it — and the mark keeps the confidence distinction the record dialog makes
  // in words, so a guess never looks like a fact anywhere.
  marks.sure.includes("record-video") && !marks.sure.includes("is-potential"),
  marks.guess.includes("is-potential"),
  // One confirmed match among guesses makes the record's mark a confirmed one.
  marks.mixed.includes("record-video") && !marks.mixed.includes("is-potential"),
  marks.none === "",
  marks.scoped.includes("record-video card-video"),
  marks.sureLabel === ", has a talk recording" && marks.guessLabel === ", has a possible related recording" && marks.noLabel === "",
  marks.counted === 2,
  // Every room that lists records draws it: museum and favourites cards, the
  // library spine and its plate, signals findings, the investigation board,
  // global search, the terminal listing and detail, and the star readout.
  appSource.includes('videoMark(item, "card-video")'),
  appSource.includes('videoMark(item, "book-video")') && appSource.includes('"▶ recorded" : "▶ possible recording"'),
  appSource.includes('videoMark(item, "signal-video")'),
  appSource.includes('videoMark(item, "evidence-video")'),
  appSource.includes('videoMark(item, "result-video")'),
  appSource.includes('item.videos?.length ? " · ▶" : ""') && appSource.includes("<span>video</span>"),
  constellationSource.includes("▶ Recorded") && constellationSource.includes("▶ Possible recording"),
  stylesSource.includes(".record-video {") && stylesSource.includes(".record-video.is-potential"),
  // IT IS A BADGE, NOT A BARE GLYPH. The mark used to be a lone triangle set at
  // half a rem in the room's own ink; on a book spine that read as a speck of
  // grain and beside a card's status line as nothing at all, so a fact carried
  // in seven views was legible in none of them. Filled for a confirmed talk,
  // outlined for a guess - the same distinction, at a contrast a reader can
  // actually see.
  stylesSource.includes("--record-color: var(--cyan)") && stylesSource.includes("--record-ink:"),
  /\.record-video \{[^}]*display: inline-flex;[^}]*background: var\(--record-color\)/.test(stylesSource),
  /\.record-video\.is-potential \{[^}]*border-style: dashed/.test(stylesSource),
  // A light surface punches the glyph out of the badge rather than inheriting
  // the dark ink the dark rooms are drawn with.
  /\.book \.book-video \{[^}]*--record-ink:/.test(stylesSource),
  /\.investigation-card \.evidence-video \{[^}]*--record-ink:/.test(stylesSource),
  !/(?:book-video|evidence-video) \{[^}]*font-size: \.5rem/.test(stylesSource),
  // The signals row emits its recording slot even when empty; a slot that came
  // and went would move the arrow beside it into a different grid column on
  // every other row.
  appSource.includes('|| `<i class="signal-video" aria-hidden="true"></i>`'),
  stylesSource.includes("46px minmax(0,1fr) minmax(130px,190px) 10px 18px"),
  // ...which means the rules for that arrow have to name the arrow.
  stylesSource.includes(".signal-finding > i:last-child") && !stylesSource.includes(".signal-finding > i {"),
  // THE SIGNALS RECORDING FILTER, the museum's Recorded chip on the other view
  // that filters. It ANDs over the tuned topic and the chosen standing.
  appSource.includes("signalRecordedOnly: false"),
  appSource.includes("state.signalRecordedOnly ? standingItems.filter((item) => item.videos?.length) : standingItems"),
  appSource.includes('event.target.closest("[data-signal-recorded]")'),
  appSource.includes("data-signal-recorded") && appSource.includes("signal-recorded-filter"),
  // It states what it withheld, and survives a change of year or topic - unlike
  // signalStatus, which those controls reset.
  appSource.includes("without a recording hidden"),
  !/signalTopicTarget[\s\S]{0,400}state\.signalRecordedOnly = false/.test(appSource),
  stylesSource.includes(".signal-recorded-filter")
];

// The room filter, which is the colour key made pressable.
const roomFilterChecks = [
  roomFilters.unfiltered === 4 && roomFilters.inactive === false,
  roomFilters.oneTopic === 2,
  // Two topics are a union, not an intersection.
  roomFilters.twoTopics === 3,
  // With no topic chosen, recordings alone open the whole room back up and then
  // narrow it to the records that have one.
  roomFilters.recordedOnly === 2,
  roomFilters.topicAndRecorded === 1,
  // Crypto holds no recording, so Crypto AND Recorded is honestly empty...
  roomFilters.impossible === 0,
  // ...and the strip says so, because a filtered room otherwise looks exactly
  // like a small one.
  roomFilters.emptyKey.includes("all 4 hidden"),
  // Read the status line itself, not the whole strip: every chip carries an
  // aria-hidden glyph, so a bare search for "hidden" always matches.
  roomFilters.restingKey.includes('role="status">4 on the wall<'),
  // A reset only exists while something is filtered.
  roomFilters.emptyKey.includes('data-room-filter="reset"') && !roomFilters.restingKey.includes('data-room-filter="reset"'),
  // A SELECTED topic stays on the strip even at zero, or a year that does not
  // hold it would leave a filter running with no control left to switch it off.
  roomFilters.emptyKey.includes('data-room-filter="Crypto"'),
  roomFilters.emptyKey.includes('data-room-filter="recorded"'),
  // Pressed state is announced, not just coloured.
  (roomFilters.emptyKey.match(/aria-pressed="true"/g) || []).length === 2,
  (roomFilters.restingKey.match(/aria-pressed="true"/g) || []).length === 0,
  appSource.includes('const roomFilterTarget = event.target.closest("[data-room-filter]")'),
  appSource.includes("function applyRoomFilter") && appSource.includes("function roomFilterActive"),
  appSource.includes("roomTopics: new Set()") && appSource.includes("roomVideoOnly: false"),
  stylesSource.includes('.topic-key li button[aria-pressed="true"]'),
  stylesSource.includes(".topic-key-reset") && stylesSource.includes("p.topic-key-state"),
  // Chips are thumb targets on a phone, not a printed legend.
  stylesSource.includes(".topic-key li button, .topic-key-reset { min-height: 36px"),
  // The marquee keeps stating what the ROOM holds, so the key's counts always
  // have an unfiltered figure to be read against.
  appSource.includes("const roomWinners = roomItems.filter"),
  appSource.includes("${topicKey(roomItems, items)}")
];

const joined = artifacts.filter((artifact) => artifact.record).length;
const preliminaryRecords = yearRecords.filter((record) => record.status === "preliminary");
const preliminaryArtifacts = artifacts.filter((artifact) => preliminaryRecords.some((record) => record.id === artifact.year));
console.log(`Artifact titles:     ${artifacts.length}`);
console.log(`Manifest matches:    ${joined}`);
console.log(`Markdown actions:    ${markdownCount}`);
console.log(`PDF actions:         ${pdfCount}`);
console.log(`Original actions:    ${artifacts.length}`);
console.log(`Talk recordings:     ${shardVideoRows.length} on ${shardVideoRecords.size} record(s), ${videoChecks.filter(Boolean).length}/${videoChecks.length} checks`);
console.log(`Annual result PDFs:  ${annualPdfFiles.length}`);
console.log(`Preliminary leads:   ${preliminaryArtifacts.length}`);
console.log(`Interface assets:     ${mockupFiles.length}`);
console.log(`Security checks:     ${securityChecks.filter(Boolean).length}/${securityChecks.length}`);
console.log(`Constellation UX:    ${constellationChecks.filter(Boolean).length}/${constellationChecks.length}`);
console.log(`Requested views:     ${experienceChecks.filter(Boolean).length}/${experienceChecks.length}`);
console.log(`Mobile/deployment:   ${deploymentChecks.filter(Boolean).length}/${deploymentChecks.length}`);
console.log(`Contribution route:  ${contributionChecks.filter(Boolean).length}/${contributionChecks.length}`);
console.log(`Room filter:         ${roomFilterChecks.filter(Boolean).length}/${roomFilterChecks.length}`);

if (artifacts.length < 1000) throw new Error("Expected at least 1,000 artifact titles.");
if (!preliminaryRecords.length || preliminaryRecords.some((record) => record.ranked !== false || !record.notice || !record.contentStart || !record.contentEnd)) throw new Error("Every preliminary collection must be unranked, bounded, and carry a visible notice.");
if (!preliminaryArtifacts.length) throw new Error("No preliminary artifacts were parsed.");
if (preliminaryArtifacts.some((artifact) => artifact.rank !== null)) throw new Error("Preliminary artifacts cannot carry Top 10 ranks.");
if (joined < 900) throw new Error("Too few year-list URLs matched the preservation manifest.");
if (missingLocalFiles.length) throw new Error(`Missing ${missingLocalFiles.length} referenced archive file(s):\n${missingLocalFiles.slice(0, 10).join("\n")}`);
if (missingAnnualPdfs.length) throw new Error(`Missing annual result PDFs:\n${missingAnnualPdfs.join("\n")}`);
if (missingMockupFiles.length) throw new Error(`Missing mockup files:\n${missingMockupFiles.join("\n")}`);
if (unsafeManifestPaths.length) throw new Error(`Unsafe archive path(s) in manifest:\n${unsafeManifestPaths.slice(0, 10).join("\n")}`);
// EVERY failing index, not just the first. Each of these arrays covers several
// unrelated things at once, and a message naming one of them is how the second
// gets fixed a rerun later — or missed altogether.
const failedIndices = (checks) => checks.flatMap((passed, index) => passed ? [] : [index]).join(", ");
if (securityChecks.some((passed) => !passed)) throw new Error(`Security checks failed at index ${failedIndices(securityChecks)}. Unsafe target=_blank tags: ${unsafeBlankTargets.length}; unsafe rendered tags: ${unsafeRenderedTags.join(" ") || "none"}`);
if (constellationChecks.some((passed) => !passed)) throw new Error(`Constellation interaction checks failed at index ${failedIndices(constellationChecks)}.`);
if (experienceChecks.some((passed) => !passed)) throw new Error(`Requested experience checks failed at index ${failedIndices(experienceChecks)}. Views found: ${requestedViews.join(", ")}`);
if (deploymentChecks.some((passed) => !passed)) throw new Error(`Mobile/full-screen/deployment checks failed at index ${failedIndices(deploymentChecks)}.`);
if (contributionChecks.some((passed) => !passed)) throw new Error(`Contribution route checks failed at index ${failedIndices(contributionChecks)}.`);
if (videoChecks.some((passed) => !passed)) throw new Error(`Talk recording checks failed at index ${failedIndices(videoChecks)}.`);
if (roomFilterChecks.some((passed) => !passed)) throw new Error(`Room filter checks failed at index ${failedIndices(roomFilterChecks)}.`);

console.log("Smoke test:          PASS");
