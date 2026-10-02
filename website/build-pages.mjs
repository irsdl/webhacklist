#!/usr/bin/env node
/**
 * Pre-render the crawlable surface of the archive.
 *
 * The app is a single HTML shell that renders every view from JSON, resets
 * document.title to one constant, and declares one canonical URL for the whole
 * origin. A crawler therefore sees exactly one page no matter how many archive
 * URLs it is given, so a sitemap of `?reader=` links would consolidate straight
 * back into the home page.
 *
 * These generated pages are the answer: one static HTML document per preserved
 * reference and per collection, each with its own title, description, canonical
 * URL and structured data. They carry the archive's OWN writing - the curated
 * summary, byline, topic and ranking context - and deliberately NOT the body of
 * the preserved article. Reproducing the article text would put this domain
 * into search results competing against the researcher who wrote it, which is
 * both a duplicate-content risk here and unfair there. The preserved Markdown
 * and PDF stay one click away and stay `noindex` (see website/_headers).
 *
 * Nothing here is committed. build-site.mjs calls buildPages() and writes the
 * result into the staged output, so the crawlable surface cannot go stale
 * against the data it is generated from.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(APP_DIR);

export const ORIGIN = "https://webhacklist.com";
const REPO_URL = "https://github.com/irsdl/webhacklist";
const ADVISORY_URL = `${REPO_URL}/security/advisories`;
const SITE_NAME = "Web Hacking Techniques Index";
const WEBSITE_ID = `${ORIGIN}/#website`;

// Mirrors the app shell: no inline script anywhere in a generated page, so the
// strictest policy that still allows the shared stylesheet is the right one.
const PAGE_CSP = "default-src 'none'; style-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'";

const KIND_LABELS = {
  whitepaper: "Whitepaper",
  paper: "Paper",
  slides: "Slides",
  video: "Recording",
  advisory: "Advisory",
  repo: "Repository",
  code: "Code"
};

const SECTION_LABELS = {
  winner: "Top 10 winner",
  candidate: "Preliminary research lead",
  other: "Other nomination",
  missed: "Later archive addition"
};

/** Lower wins: a document cited twice in one year keeps its highest standing. */
const SECTION_RANK = { winner: 0, other: 1, missed: 2, candidate: 3 };

function expandCollectionItemId(item, year) {
  const expanded = { ...item };
  const aliases = {
    t: "title", u: "originalUrl", m: "mdPath", l: "line",
    s: "summary", a: "authors", g: "tags", r: "publisher",
    n: "language", b: "published", v: "mdVersion", w: "pdfVersion"
  };
  for (const [wireField, field] of Object.entries(aliases)) {
    if (!Object.hasOwn(item || {}, wireField)) continue;
    if (Object.hasOwn(item, field)) throw new Error(`${year} collection contains a conflicting compact field`);
    expanded[field] = item[wireField];
    delete expanded[wireField];
  }
  if (typeof item?.id === "string" && !Object.hasOwn(item, "i")) return expanded;
  if (!Object.hasOwn(item || {}, "id") && Number.isSafeInteger(item?.i) && item.i >= 0) {
    expanded.id = `${year}-${item.i}`;
    delete expanded.i;
    return expanded;
  }
  throw new Error(`${year} collection contains an invalid compact record id`);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function escapeXml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[character]);
}

// A data block, not a script, but `</script` inside it would still end the
// element early. Escaping every `<` is the cheap, complete fix.
function jsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

/**
 * Citation URLs come from the year lists and the manifest, which this workflow
 * treats as evidence rather than as trusted input. Anything that is not plain
 * http(s) is dropped rather than rendered into an href.
 */
function safeExternalUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function collapse(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

/** Trim to a whole word so a meta description never ends mid-token. */
function truncate(value, limit) {
  const text = collapse(value);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > limit * 0.6 ? cut.slice(0, boundary) : cut).replace(/[\s,;:.–-]+$/, "")}…`;
}

function slugify(value) {
  return collapse(value).toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "reference";
}

function isoDate(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function displayDate(value) {
  const date = isoDate(value);
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function formatList(values) {
  const items = (values || []).map(collapse).filter(Boolean);
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

/* ------------------------------------------------------------------ shell */

/** "2026 AI" is the archive's own badge for a collection. Prose wants the year. */
function proseLabel(label) {
  return collapse(label).replace(/\s+AI$/i, "");
}

function page({ title, description, canonical, ogType = "website", robots = "", extraHead = "", body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${PAGE_CSP}">
<meta name="theme-color" content="#0c0e15">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${robots ? `<meta name="robots" content="${escapeHtml(robots)}">\n` : ""}<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="${escapeHtml(ogType)}">
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/brand-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/pages.css">
${extraHead}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
  <a class="wordmark" href="/"><img src="/brand-mark.svg" alt="" width="26" height="26"><span>Web Hack List</span></a>
  <nav aria-label="Archive">
    <a href="/research/">All years</a>
    <a href="/">Interactive archive</a>
  </nav>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <p><strong>${escapeHtml(SITE_NAME)}</strong> — an independent archive of the Top 10 Web Hacking Techniques, its nominees, later additions and sources. Every technique belongs to the researcher who published it.</p>
  <p class="foot-links">
    <a href="/">Interactive archive</a>
    <a href="/research/">Browse by year</a>
    <a href="/security/">Report a security issue</a>
    <a href="${escapeHtml(REPO_URL)}" rel="noopener">Source on GitHub</a>
  </p>
</footer>
</body>
</html>
`;
}

function crumbs(trail) {
  const links = trail.map((entry, index) => (index === trail.length - 1
    ? `<li aria-current="page">${escapeHtml(entry.label)}</li>`
    : `<li><a href="${escapeHtml(entry.href)}">${escapeHtml(entry.label)}</a></li>`)).join("");
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.label,
      ...(entry.href ? { item: `${ORIGIN}${entry.href}` } : {})
    }))
  };
  return {
    html: `<nav class="crumbs" aria-label="Breadcrumb"><ol>${links}</ol></nav>`,
    schema
  };
}

/* ------------------------------------------------------------- page models */

/**
 * Fold the per-collection rows into one record per preserved document.
 *
 * A reference cited by more than one year list is one document with several
 * appearances, not several pages - giving it a URL per year would make this
 * site compete with itself for the same title.
 */
function collectDocuments(collections) {
  const documents = new Map();
  const slugs = new Map();
  for (const { year, items, sources } of collections) {
    for (const item of items) {
      const key = item.mdPath || item.pdfPath || safeExternalUrl(item.originalUrl) || `${year.id}:${item.id}`;
      let record = documents.get(key);
      if (!record) {
        const stem = item.mdPath || item.pdfPath
          ? path.basename(item.mdPath || item.pdfPath).replace(/\.(?:md|pdf)$/i, "")
          : slugify(item.title);
        // Two collections can hold different documents whose file stems match.
        // The first to claim a stem keeps it; the next is qualified by its
        // collection so neither page silently overwrites the other.
        let slug = stem;
        if (slugs.has(slug) && slugs.get(slug) !== key) slug = `${stem}-${year.id}`;
        let guard = 2;
        while (slugs.has(slug) && slugs.get(slug) !== key) slug = `${stem}-${year.id}-${guard++}`;
        slugs.set(slug, key);
        record = {
          key,
          slug,
          // The year list names the TECHNIQUE ("JavaScript Port Scanning");
          // the document has its own title ("Hacking Intranet Websites from
          // the Outside"). Both are how people search for this, so the
          // technique name leads and the document title is kept beside it.
          title: collapse(item.title) || stem,
          documentTitle: "",
          summary: collapse(item.summary),
          authors: (item.authors || []).map(collapse).filter(Boolean),
          publisher: collapse(item.publisher),
          published: isoDate(item.published),
          kind: item.kind || "",
          topic: item.topic || "",
          tags: (item.tags || []).filter((tag) => typeof tag === "string"),
          originalUrl: safeExternalUrl(item.originalUrl),
          mdPath: item.mdPath || "",
          pdfPath: item.pdfPath || "",
          updated: isoDate(item.mdVersion) || isoDate(item.pdfVersion) || "",
          companions: [],
          appearances: []
        };
        documents.set(key, record);
      }
      const appearance = {
        yearId: year.id,
        yearLabel: year.label,
        status: year.status,
        ranked: year.ranked !== false,
        rank: Number.isInteger(item.rank) ? item.rank : null,
        section: item.section || "other",
        itemId: item.id
      };
      // One list can cite the same document from its winners table AND from its
      // nominee table. That is one appearance in that year, at its highest
      // standing - printing both would read as two separate honours.
      const existing = record.appearances.find((entry) => entry.yearId === year.id);
      if (!existing) record.appearances.push(appearance);
      else if (SECTION_RANK[appearance.section] < SECTION_RANK[existing.section]) {
        Object.assign(existing, appearance);
      }

      for (const link of sources[item.id] || []) {
        const url = safeExternalUrl(link.url);
        const label = collapse(link.details?.title || link.label);
        if (!url) continue;
        if (url === record.originalUrl) {
          if (!record.documentTitle) record.documentTitle = collapse(link.details?.title);
          continue;
        }
        // Individually credited companions - series parts, slides beside a
        // whitepaper, a recording of the same talk - are listed so a reader
        // lands on the whole story rather than one of its pieces.
        if (!label || record.companions.some((companion) => companion.url === url)) continue;
        record.companions.push({ url, label, kind: link.details?.kind || "" });
      }
    }
  }
  return [...documents.values()];
}

function documentDescription(record) {
  if (record.summary) return truncate(record.summary, 155);
  const byline = formatList(record.authors) || record.publisher;
  const year = record.published.slice(0, 4);
  return truncate(`${record.title}${byline ? ` by ${byline}` : ""}${year ? `, ${year}` : ""} — preserved in the Top 10 Web Hacking Techniques archive.`, 155);
}

function documentTitle(record) {
  const byline = formatList(record.authors) || record.publisher;
  const head = byline ? `${record.title} — ${byline}` : record.title;
  return `${truncate(head, 92)} | Web Hack List`;
}

export function appearanceLine(appearance) {
  const label = proseLabel(appearance.yearLabel);
  if (appearance.status === "preliminary") return `Collected in the ${label} preliminary research sweep`;
  if (appearance.section === "winner") {
    return appearance.rank
      ? `Ranked #${appearance.rank} in the ${label} Top 10 Web Hacking Techniques`
      : `Named in the ${label} Top 10 Web Hacking Techniques`;
  }
  if (appearance.section === "other") return `Nominated for the ${label} Top 10 Web Hacking Techniques`;
  if (appearance.section === "missed") return `Added to the ${label} archive after the original list was published`;
  return `Collected in the ${label} research round`;
}

/**
 * A PDF over Cloudflare's per-asset limit is not staged here at all - it is
 * served from the GitHub file origin instead. Linking the local path would be a
 * guaranteed 404, so the configured fallback is used for exactly those files.
 */
function pdfHref(pdfPath, fallbacks) {
  const fallback = safeExternalUrl(fallbacks[pdfPath]);
  return fallback || `/${pdfPath}`;
}

function documentPage(record, notices, fallbacks) {
  const canonical = `${ORIGIN}/reference/${record.slug}/`;
  const description = documentDescription(record);
  const byline = formatList(record.authors);
  const trail = crumbs([
    { label: "Archive", href: "/" },
    { label: "Research", href: "/research/" },
    { label: record.appearances[0].yearLabel, href: `/research/${record.appearances[0].yearId}/` },
    { label: record.title }
  ]);

  const sourceTitle = record.documentTitle && record.documentTitle !== record.title ? record.documentTitle : "";
  const facts = [];
  if (sourceTitle) facts.push(["Document", escapeHtml(sourceTitle)]);
  if (byline) facts.push(["Researcher", escapeHtml(byline)]);
  if (record.publisher) facts.push(["Published by", escapeHtml(record.publisher)]);
  if (record.published) facts.push(["Date", `<time datetime="${escapeHtml(record.published)}">${escapeHtml(displayDate(record.published))}</time>`]);
  if (KIND_LABELS[record.kind]) facts.push(["Format", escapeHtml(KIND_LABELS[record.kind])]);
  if (record.topic) facts.push(["Topic", escapeHtml(record.topic)]);

  const preliminary = record.appearances.some((appearance) => appearance.status === "preliminary")
    && record.appearances.every((appearance) => appearance.status === "preliminary");

  const actions = [];
  if (record.originalUrl) {
    actions.push(`<a class="action primary" href="${escapeHtml(record.originalUrl)}" rel="noopener">Read the original ↗</a>`);
  }
  const reader = record.appearances[0];
  actions.push(`<a class="action" href="/?year=${encodeURIComponent(reader.yearId)}&amp;reader=${encodeURIComponent(reader.itemId)}">Open in the archive</a>`);
  if (record.mdPath) actions.push(`<a class="action" href="/${escapeHtml(record.mdPath)}">Preserved Markdown</a>`);
  if (record.pdfPath) actions.push(`<a class="action" href="${escapeHtml(pdfHref(record.pdfPath, fallbacks))}" rel="noopener">Preserved PDF</a>`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    url: canonical,
    name: record.title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    // The page is this archive's record ABOUT the research. The work itself is
    // the main entity, and it keeps its own author, publisher and URL so a
    // search engine attributes it to the researcher, not to this domain.
    mainEntity: {
      "@type": record.kind === "paper" || record.kind === "whitepaper" ? "ScholarlyArticle" : "CreativeWork",
      name: record.title,
      ...(sourceTitle ? { alternateName: sourceTitle } : {}),
      ...(record.originalUrl ? { url: record.originalUrl } : {}),
      ...(record.authors.length ? { author: record.authors.map((name) => ({ "@type": "Person", name })) } : {}),
      ...(record.publisher ? { publisher: { "@type": "Organization", name: record.publisher } } : {}),
      ...(record.published ? { datePublished: record.published } : {}),
      ...(record.tags.length ? { keywords: record.tags.join(", ") } : {}),
      ...(record.summary ? { abstract: record.summary } : {})
    }
  };

  const body = `${trail.html}
<article class="record">
  <p class="eyebrow">${escapeHtml(preliminary ? "Preliminary research" : SECTION_LABELS[record.appearances[0].section] || "Preserved reference")}</p>
  <h1>${escapeHtml(record.title)}</h1>
  ${sourceTitle ? `<p class="alt-title">${escapeHtml(sourceTitle)}</p>` : ""}
  ${byline ? `<p class="byline">${escapeHtml(byline)}${record.publisher ? ` · ${escapeHtml(record.publisher)}` : ""}${record.published ? ` · <time datetime="${escapeHtml(record.published)}">${escapeHtml(displayDate(record.published))}</time>` : ""}</p>` : ""}
  ${preliminary ? `<p class="notice">${escapeHtml(notices.get(record.appearances[0].yearId) || "Preliminary, unranked and not community-vetted.")}</p>` : ""}
  ${record.summary ? `<p class="summary">${escapeHtml(record.summary)}</p>` : ""}
  <div class="actions">${actions.join("")}</div>
  ${facts.length ? `<h2>Record</h2>
  <dl class="facts">${facts.map(([term, value]) => `<div><dt>${escapeHtml(term)}</dt><dd>${value}</dd></div>`).join("")}</dl>` : ""}
  <h2>In the archive</h2>
  <ul class="appearances">${record.appearances.map((appearance) => `<li><a href="/research/${escapeHtml(appearance.yearId)}/">${escapeHtml(appearanceLine(appearance))}</a></li>`).join("")}</ul>
  ${record.companions.length ? `<h2>Related sources</h2>
  <ul class="companions">${record.companions.map((companion) => `<li><a href="${escapeHtml(companion.url)}" rel="noopener">${escapeHtml(companion.label)}</a>${KIND_LABELS[companion.kind] ? ` <span class="tag">${escapeHtml(KIND_LABELS[companion.kind])}</span>` : ""}</li>`).join("")}</ul>` : ""}
  ${record.tags.length ? `<h2>Tags</h2>
  <ul class="tags">${record.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
  <p class="provenance">This page is the archive's own catalogue record. The research is the work of ${escapeHtml(byline || record.publisher || "its author")}${record.originalUrl ? `, first published at <a href="${escapeHtml(record.originalUrl)}" rel="noopener">the original source</a>` : ""}. Preserved copies are kept so the citation survives its host${record.updated ? `; this one was last captured on <time datetime="${escapeHtml(record.updated)}">${escapeHtml(displayDate(record.updated))}</time>` : ""}.</p>
</article>`;

  return {
    file: `reference/${record.slug}/index.html`,
    canonical,
    lastmod: record.updated || record.published,
    html: page({
      title: documentTitle(record),
      description,
      canonical,
      ogType: "article",
      extraHead: `<script type="application/ld+json">\n${jsonLd(schema)}\n</script>\n<script type="application/ld+json">\n${jsonLd(trail.schema)}\n</script>\n`,
      body
    })
  };
}

function yearPage(year, records, notice) {
  const canonical = `${ORIGIN}/research/${year.id}/`;
  const preliminary = year.status === "preliminary";
  const winners = records.filter((entry) => entry.appearance.section === "winner")
    .sort((a, b) => (a.appearance.rank || 99) - (b.appearance.rank || 99));
  const byTitle = (a, b) => a.record.title.localeCompare(b.record.title);
  const nominees = preliminary ? [] : records.filter((entry) => entry.appearance.section === "other").sort(byTitle);
  const additions = preliminary ? [] : records.filter((entry) => entry.appearance.section === "missed").sort(byTitle);
  const collected = records.filter((entry) => entry.appearance.section !== "winner"
    && (preliminary || !["other", "missed"].includes(entry.appearance.section))).sort(byTitle);
  const rest = [...nominees, ...additions, ...collected];
  const name = proseLabel(year.label);
  const breakdown = formatList([
    winners.length ? `${winners.length} Top 10 selection${winners.length === 1 ? "" : "s"}` : "",
    nominees.length ? `${nominees.length} other nomination${nominees.length === 1 ? "" : "s"}` : "",
    additions.length ? `${additions.length} later archive addition${additions.length === 1 ? "" : "s"}` : "",
    collected.length ? `${collected.length} other collected record${collected.length === 1 ? "" : "s"}` : ""
  ]);
  const description = preliminary
    ? truncate(`${records.length} web security research leads collected for ${name} — preliminary, unranked and not community-vetted.`, 155)
    : truncate(`The ${name} Top 10 Web Hacking Techniques: ${breakdown}, each with its researcher, summary and source.`, 155);
  const trail = crumbs([
    { label: "Archive", href: "/" },
    { label: "Research", href: "/research/" },
    { label: year.label }
  ]);

  const entryHtml = (entry, showRank) => {
    const { record, appearance } = entry;
    const byline = formatList(record.authors) || record.publisher;
    return `<li>
    ${showRank && appearance.rank ? `<span class="rank">#${appearance.rank}</span>` : ""}
    <a class="entry-title" href="/reference/${escapeHtml(record.slug)}/">${escapeHtml(record.title)}</a>
    ${byline ? `<span class="entry-by">${escapeHtml(byline)}</span>` : ""}
    ${record.summary ? `<p>${escapeHtml(truncate(record.summary, 220))}</p>` : ""}
  </li>`;
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: preliminary ? `${name} web security research collection` : `${name} Top 10 Web Hacking Techniques`,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: records.length,
      itemListElement: (winners.length ? winners : rest.slice(0, 10)).map((entry, index) => ({
        "@type": "ListItem",
        position: entry.appearance.rank || index + 1,
        name: entry.record.title,
        url: `${ORIGIN}/reference/${entry.record.slug}/`
      }))
    }
  };

  const body = `${trail.html}
<div class="year">
  <p class="eyebrow">${escapeHtml(preliminary ? "Preliminary collection" : "Top 10 Web Hacking Techniques")}</p>
  <h1>${escapeHtml(year.label)}</h1>
  <p class="lede">${escapeHtml(description)}</p>
  ${notice ? `<p class="notice">${escapeHtml(notice)}</p>` : ""}
  <p class="counts">${records.length} record${records.length === 1 ? "" : "s"}${preliminary ? "" : ` · ${winners.length} in the top ten · ${nominees.length} other nomination${nominees.length === 1 ? "" : "s"} · ${additions.length} later addition${additions.length === 1 ? "" : "s"}`} · <a href="/?year=${escapeHtml(year.id)}">open this year in the interactive archive</a></p>
  ${winners.length ? `<h2>The top ten</h2>
  <ol class="entries ranked">${winners.map((entry) => entryHtml(entry, true)).join("")}</ol>` : ""}
  ${nominees.length ? `<h2>Other nominations</h2>
  <ul class="entries">${nominees.map((entry) => entryHtml(entry, false)).join("")}</ul>` : ""}
  ${additions.length ? `<h2>Added after the original list</h2>
  <ul class="entries">${additions.map((entry) => entryHtml(entry, false)).join("")}</ul>` : ""}
  ${collected.length ? `<h2>${preliminary ? "Collected research" : "Other collected research"}</h2>
  <ul class="entries">${collected.map((entry) => entryHtml(entry, false)).join("")}</ul>` : ""}
</div>`;

  return {
    file: `research/${year.id}/index.html`,
    canonical,
    html: page({
      title: `${preliminary ? `${name} web security research` : `${name} Top 10 Web Hacking Techniques`} | Web Hack List`,
      description,
      canonical,
      extraHead: `<script type="application/ld+json">\n${jsonLd(schema)}\n</script>\n<script type="application/ld+json">\n${jsonLd(trail.schema)}\n</script>\n`,
      body
    })
  };
}

function researchIndexPage(years, total) {
  const canonical = `${ORIGIN}/research/`;
  const description = truncate(`Every year of the Top 10 Web Hacking Techniques, 2006 onwards — ${total} ranked, nominated and later-added research records, credited to their researchers.`, 155);
  const trail = crumbs([{ label: "Archive", href: "/" }, { label: "Research" }]);
  const body = `${trail.html}
<div class="year">
  <p class="eyebrow">Browse the archive</p>
  <h1>Web hacking research by year</h1>
  <p class="lede">${escapeHtml(description)}</p>
  <ul class="years">${years.map(({ year, count, winners, nominees, additions }) => `<li>
    <a href="/research/${escapeHtml(year.id)}/"><b>${escapeHtml(proseLabel(year.label))}</b></a>
    <span>${count} record${count === 1 ? "" : "s"}${year.status === "preliminary" ? " · preliminary" : `${winners ? ` · ${winners} in the top ten` : ""}${nominees ? ` · ${nominees} other nomination${nominees === 1 ? "" : "s"}` : ""}${additions ? ` · ${additions} later addition${additions === 1 ? "" : "s"}` : ""}`}</span>
  </li>`).join("")}</ul>
</div>`;
  return {
    file: "research/index.html",
    canonical,
    html: page({
      title: "Web hacking research by year | Web Hack List",
      description,
      canonical,
      extraHead: `<script type="application/ld+json">\n${jsonLd(trail.schema)}\n</script>\n`,
      body
    })
  };
}

function securityPage() {
  const canonical = `${ORIGIN}/security/`;
  const description = "How to report a security issue in the Web Hack List website or tooling: use GitHub private security advisories. Open source, no bug bounty, no payment.";
  const trail = crumbs([{ label: "Archive", href: "/" }, { label: "Security" }]);
  const body = `${trail.html}
<div class="prose">
  <p class="eyebrow">Security</p>
  <h1>Reporting a security issue</h1>
  <p class="lede">${escapeHtml(description)}</p>

  <h2>Where to report</h2>
  <p>Report privately through GitHub security advisories on the repository that runs this site:</p>
  <p><a class="action primary" href="${escapeHtml(ADVISORY_URL)}" rel="noopener">Open a private security advisory ↗</a></p>
  <p>That form is private between you and the maintainer until an advisory is published. Please use it rather than a public issue for anything exploitable. If you cannot use GitHub at all, open a normal issue that says only that you have a security report and asks for a contact route — do not put the details in it.</p>

  <h2>Please read this first</h2>
  <ul>
    <li><strong>This is a volunteer open-source project. There is no bug bounty and no payment of any kind.</strong> Reports are welcome on those terms and credited in the published advisory if you want the credit.</li>
    <li>The site is a static archive. It has no accounts, no login, no database and no server-side code — it serves files. Findings that assume a backend usually do not apply here.</li>
    <li>Automated scanner output pasted without a working proof of concept will be closed. So will missing-header reports that have no exploitable consequence on a static, cookieless, credential-free origin.</li>
  </ul>

  <h2>In scope</h2>
  <ul>
    <li><code>webhacklist.com</code> and its published assets.</li>
    <li>The site code in the repository — the app shell, the archive reader, the PDF viewer and the build and reference tooling.</li>
    <li>Anything that lets preserved content escape its context: script execution from an archived document, the PDF reader, or the content-security policy.</li>
  </ul>

  <h2>Out of scope</h2>
  <ul>
    <li>Vulnerabilities in the <em>preserved research itself</em>. The archive stores copies of published security research; exploit code and payloads inside a preserved document are the evidence, are meant to be there, and are served as inert text.</li>
    <li>Findings against the original websites the archive links to. Those belong to their own owners — report to them.</li>
    <li>Denial of service, volumetric testing, and anything that would degrade the service for others.</li>
    <li>Social engineering, physical attacks, and reports about the maintainer's personal accounts.</li>
  </ul>

  <h2>Testing rules</h2>
  <p>Test only against your own copy where you can — the whole site builds and runs locally from the repository. Against the live site, keep it to what a single browser can do by hand. Do not run scanners or floods against it, and do not attempt to reach anything beyond the public files.</p>

  <h2>What to expect</h2>
  <p>This is maintained in spare time, so a first reply may take a couple of weeks. Valid issues are fixed and published as a GitHub advisory with credit to the reporter unless you ask otherwise. Not every report will be treated as a vulnerability, and the reasoning will be explained when it is not.</p>

  <h2>Other kinds of report</h2>
  <p>A wrong byline, a bad capture, a dead link or a misattributed technique is not a security issue and is very welcome as a normal <a href="${escapeHtml(REPO_URL)}/issues" rel="noopener">GitHub issue</a>. If you are an author who wants a preserved copy of your own work changed or removed, open an issue and say so — that is honoured.</p>
</div>`;
  return {
    file: "security/index.html",
    canonical,
    html: page({
      title: "Reporting a security issue | Web Hack List",
      description,
      canonical,
      extraHead: `<script type="application/ld+json">\n${jsonLd(trail.schema)}\n</script>\n`,
      body
    })
  };
}

// RFC 9116. The Expires field is mandatory and must be in the future, so it is
// derived from the build date rather than pinned to a date that would quietly
// expire and make the file invalid.
function securityTxt(now) {
  const expires = new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth(), now.getUTCDate()));
  return `# Security policy for webhacklist.com
# Open source, maintained by volunteers. There is no bug bounty.
Contact: ${ADVISORY_URL}
Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}
Preferred-Languages: en
Canonical: ${ORIGIN}/.well-known/security.txt
Policy: ${ORIGIN}/security/
`;
}

function sitemap(entries) {
  const urls = entries.map(({ canonical, lastmod, priority }) => `  <url>
    <loc>${escapeXml(canonical)}</loc>${lastmod ? `
    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}${priority ? `
    <priority>${priority}</priority>` : ""}
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const PAGES_CSS = `:root{color-scheme:dark;--ink:#f4efe6;--muted:#a5adbd;--faint:#626b7e;--paper:#0c0e15;--panel:#131722;--panel-2:#1a2030;--line:rgba(182,191,218,.14);--line-strong:rgba(182,191,218,.3);--accent:#ffb454;--signal:#7899ff;--radius:18px;--sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"Cascadia Code","SFMono-Regular",Consolas,monospace}
*,*::before,*::after{box-sizing:border-box}
body,h1,h2,p,ul,ol,dl,dd,figure{margin:0}
img,svg{display:block;max-width:100%}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.65;-webkit-text-size-adjust:100%;text-size-adjust:100%}
a{color:var(--signal)}
a:hover{color:var(--accent)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:16px;top:16px;z-index:5;background:var(--panel-2);padding:10px 16px;border-radius:10px}
.masthead{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--line)}
.wordmark{display:flex;gap:10px;align-items:center;color:var(--ink);text-decoration:none;font-weight:650;letter-spacing:.01em}
.masthead nav{display:flex;gap:20px;font-size:15px}
main{max-width:52rem;margin:0 auto;padding:36px 24px 56px}
.crumbs ol{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;font-size:13.5px;color:var(--faint)}
.crumbs li+li::before{content:"/";margin-right:8px;color:var(--faint)}
.crumbs a{color:var(--muted);text-decoration:none}
.crumbs a:hover{color:var(--accent)}
.eyebrow{margin-top:26px;text-transform:uppercase;letter-spacing:.14em;font-size:12px;font-weight:650;color:var(--accent)}
h1{margin-top:8px;font-size:clamp(1.9rem,1.3rem + 2.2vw,2.9rem);line-height:1.15;letter-spacing:-.02em;text-wrap:balance}
h2{margin-top:38px;font-size:1.1rem;letter-spacing:.02em;text-transform:uppercase;color:var(--muted);font-weight:650}
.alt-title{margin-top:10px;color:var(--muted);font-size:1.05rem;font-style:italic}
.byline{margin-top:14px;color:var(--muted);font-size:15.5px}
.lede,.summary{margin-top:20px;font-size:1.06rem;color:#ddd7cc}
.notice{margin-top:20px;padding:12px 16px;border:1px solid var(--line-strong);border-left:3px solid var(--accent);border-radius:8px;background:var(--panel);color:var(--muted);font-size:15px}
.counts{margin-top:16px;color:var(--muted);font-size:15px}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.action{display:inline-block;padding:10px 18px;border:1px solid var(--line-strong);border-radius:999px;background:var(--panel);color:var(--ink);text-decoration:none;font-size:15px}
.action:hover{border-color:var(--accent);color:var(--accent)}
.action.primary{background:var(--accent);border-color:var(--accent);color:#1a1208;font-weight:650}
.action.primary:hover{filter:brightness(1.08);color:#1a1208}
.facts{margin-top:16px;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.facts>div{display:flex;flex-wrap:wrap;gap:6px 18px;padding:12px 18px;border-bottom:1px solid var(--line)}
.facts>div:last-child{border-bottom:0}
.facts dt{min-width:9rem;color:var(--faint);font-size:14px}
.facts dd{margin:0}
.appearances,.companions,.years,.prose ul{margin-top:16px;padding-left:0;list-style:none}
.appearances li,.companions li{padding:9px 0;border-bottom:1px solid var(--line)}
.prose ul{padding-left:20px;list-style:disc}
.prose li{margin-top:9px;color:#ddd7cc}
.prose p{margin-top:16px;color:#ddd7cc}
.prose code{font-family:var(--mono);font-size:.92em;background:var(--panel-2);padding:2px 6px;border-radius:5px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;padding:0;list-style:none}
.tags li,.tag{padding:4px 11px;border:1px solid var(--line);border-radius:999px;background:var(--panel);font-size:13px;color:var(--muted);font-family:var(--mono)}
.provenance{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);color:var(--faint);font-size:14.5px}
.entries{margin-top:16px;padding-left:0;list-style:none;counter-reset:none}
.entries li{padding:16px 0;border-bottom:1px solid var(--line)}
.entries p{margin-top:6px;color:var(--muted);font-size:15px}
.rank{display:inline-block;margin-right:10px;font-family:var(--mono);color:var(--accent);font-weight:650}
.entry-title{font-size:1.05rem;font-weight:600;text-decoration:none}
.entry-by{display:block;margin-top:3px;color:var(--faint);font-size:14px}
.years li{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--line)}
.years b{font-size:1.05rem}
.years span{color:var(--muted);font-size:14.5px}
.foot{max-width:52rem;margin:0 auto;padding:26px 24px 48px;border-top:1px solid var(--line);color:var(--faint);font-size:14.5px}
.foot-links{display:flex;flex-wrap:wrap;gap:18px;margin-top:12px}
@media (max-width:640px){body{font-size:16px}main{padding:26px 18px 44px}.masthead{padding:14px 18px}.facts>div{flex-direction:column;gap:2px}}
`;

/* ----------------------------------------------------------------- build */

/**
 * @returns {Promise<Map<string, string>>} staged relative path -> file body.
 */
export async function buildPages({ appDir = APP_DIR, repoDir = REPO, now = new Date() } = {}) {
  const catalogue = await readJson(path.join(appDir, "data", "catalogue.json"));
  if (catalogue?.schema !== 1 || !Array.isArray(catalogue.years) || !catalogue.years.length) {
    throw new Error("generated catalogue is missing or invalid; run node website/build-data.mjs first");
  }
  const registry = await readJson(path.join(appDir, "archive-years.json"));
  const notices = new Map((registry.years || []).map((year) => [year.id, collapse(year.notice)]));

  const collections = [];
  for (const year of catalogue.years) {
    const shard = await readJson(path.join(appDir, year.file));
    const sources = await readJson(path.join(appDir, year.sources.file));
    if (shard?.version !== catalogue.version || !Array.isArray(shard.items)) {
      throw new Error(`${year.file} does not match catalogue ${catalogue.version}`);
    }
    collections.push({ year, items: shard.items.map((item) => expandCollectionItemId(item, year.id)), sources: sources.items || {} });
  }

  const documents = collectDocuments(collections);
  const bySlug = new Map(documents.map((record) => [record.key, record]));
  const files = new Map();
  const sitemapEntries = [{ canonical: `${ORIGIN}/`, priority: "1.0" }];

  const researchYears = [];
  for (const { year, items } of collections) {
    // Rows, not documents: a list that cites one document from both its winners
    // table and its nominee table has two rows for it. The page shows it once,
    // at the standing collectDocuments() settled on.
    const seen = new Set();
    const records = [];
    for (const item of items) {
      const key = item.mdPath || item.pdfPath || safeExternalUrl(item.originalUrl) || `${year.id}:${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const record = bySlug.get(key);
      records.push({ record, appearance: record.appearances.find((entry) => entry.yearId === year.id) });
    }
    const built = yearPage(year, records, notices.get(year.id));
    files.set(built.file, built.html);
    sitemapEntries.push({ canonical: built.canonical, priority: "0.8" });
    researchYears.push({
      year,
      count: records.length,
      winners: records.filter((entry) => entry.appearance.section === "winner").length,
      nominees: records.filter((entry) => entry.appearance.section === "other").length,
      additions: records.filter((entry) => entry.appearance.section === "missed").length
    });
  }

  const hub = researchIndexPage(researchYears, documents.length);
  files.set(hub.file, hub.html);
  sitemapEntries.push({ canonical: hub.canonical, priority: "0.9" });

  const fallbacks = catalogue.hosting?.largePdfFallbacks || {};
  for (const record of documents) {
    const built = documentPage(record, notices, fallbacks);
    if (files.has(built.file)) throw new Error(`duplicate generated page: ${built.file}`);
    files.set(built.file, built.html);
    sitemapEntries.push({ canonical: built.canonical, lastmod: built.lastmod, priority: "0.6" });
  }

  const security = securityPage();
  files.set(security.file, security.html);
  sitemapEntries.push({ canonical: security.canonical, priority: "0.3" });

  files.set("pages.css", PAGES_CSS);
  files.set(".well-known/security.txt", securityTxt(now));
  files.set("sitemap.xml", sitemap(sitemapEntries));

  // A sitemap is capped at 50,000 URLs and 50 MB uncompressed. The archive is
  // far below both, and a split index is only worth building once it is not.
  if (sitemapEntries.length > 50000) throw new Error(`sitemap needs splitting: ${sitemapEntries.length} URLs`);
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf("--out");
  const output = outIndex >= 0 ? args[outIndex + 1] : "";
  const unknown = args.filter((_, index) => index !== outIndex && index !== outIndex + 1);
  if (unknown.length) throw new Error(`unknown argument(s): ${unknown.join(", ")}`);
  const files = await buildPages();
  if (output) {
    for (const [relative, body] of files) {
      const destination = path.join(output, relative);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, body, "utf8");
    }
  }
  const bytes = [...files.values()].reduce((sum, body) => sum + Buffer.byteLength(body), 0);
  console.log(`crawlable pages: ${files.size} files, ${bytes} bytes${output ? ` written to ${output}` : " (dry run)"}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`build-pages failed: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}
