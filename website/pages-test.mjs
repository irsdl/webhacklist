/**
 * Checks the generated crawlable surface (build-pages.mjs).
 *
 * The point of these pages is that a search engine can read them, so the things
 * worth asserting are the ones a crawler acts on: one title, one canonical, a
 * canonical that matches the path the file is served from, valid structured
 * data, no page reproducing the preserved article body, and no link pointing at
 * a file this site does not stage.
 *
 * Run from the repository root: node website/pages-test.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { buildPages, ORIGIN } from "./build-pages.mjs";

const root = process.cwd();
const files = await buildPages();
const fail = [];
const check = (condition, message) => { if (!condition) fail.push(message); };

const html = [...files].filter(([name]) => name.endsWith(".html"));
const catalogue = JSON.parse(await readFile(path.join(root, "website/data/catalogue.json"), "utf8"));
for (const year of catalogue.years.filter((year) => year.status === "preliminary")) {
  const appearance = `href="/research/${year.id}/">`;
  const references = html.filter(([name, body]) => name.startsWith("reference/") && body.includes(appearance));
  check(references.length > 0, `${year.id}: no preliminary reference pages`);
  for (const [name, body] of references) {
    check(body.includes(`${appearance}Collected in the `), `${name}: preliminary appearance must be described as collected research`);
    check(!body.includes(`${appearance}Nominated`) && !body.includes(`${appearance}Ranked`), `${name}: preliminary research must not claim nomination or ranking`);
    if (body.includes('<p class="notice">')) {
      check(body.includes('<p class="eyebrow">Preliminary research</p>'), `${name}: preliminary research must not have a nominee badge`);
    }
  }
}
check(html.length > 1000, `expected over 1,000 generated pages, got ${html.length}`);
check(files.has("sitemap.xml"), "no sitemap was generated");
check(files.has("pages.css"), "no stylesheet was generated");
check(files.has(".well-known/security.txt"), "no security.txt was generated");
check(files.has("security/index.html"), "no security policy page was generated");
check(files.has("research/index.html"), "no research hub was generated");

/* ------------------------------------------------------- per-page contract */

const canonicals = new Set();
for (const [name, body] of html) {
  const titles = body.match(/<title>/g) || [];
  const canonical = body.match(/<link rel="canonical" href="([^"]+)">/);
  const h1 = body.match(/<h1>/g) || [];
  const description = body.match(/<meta name="description" content="([^"]*)">/);

  check(titles.length === 1, `${name}: expected exactly one <title>, got ${titles.length}`);
  check(h1.length === 1, `${name}: expected exactly one <h1>, got ${h1.length}`);
  check(Boolean(canonical), `${name}: no canonical URL`);
  check(Boolean(description?.[1]), `${name}: empty meta description`);
  check((description?.[1].length ?? 0) <= 200, `${name}: meta description is ${description?.[1].length} characters`);
  check(body.includes(`<meta property="og:image" content="${ORIGIN}/social-preview.png">`), `${name}: missing social preview image`);

  // A canonical that does not name the URL the file is served from is the one
  // mistake that silently removes a page from the index.
  const served = `${ORIGIN}/${name.replace(/index\.html$/, "")}`;
  check(canonical?.[1] === served, `${name}: canonical ${canonical?.[1]} does not match served URL ${served}`);
  check(!canonicals.has(canonical?.[1]), `${name}: duplicate canonical ${canonical?.[1]}`);
  canonicals.add(canonical?.[1]);

  // Generated pages run no JavaScript. An inline script would also have to be
  // reconciled with the page CSP, which deliberately forbids one.
  const scripts = [...body.matchAll(/<script(?:\s[^>]*)?>/g)].map((match) => match[0]);
  check(scripts.every((tag) => tag.includes('type="application/ld+json"')), `${name}: contains an executable script tag`);

  for (const block of body.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      fail.push(`${name}: invalid JSON-LD (${error.message})`);
    }
  }
  check(!/<\/script/i.test(body.replace(/<\/script>/g, "")), `${name}: an unescaped </script may end a data block early`);
}

/* ----------------------------------------------- the copies stay uncrawled */

// These pages carry the archive's own summary, never the preserved article. If
// a whole document body ever leaks into one, this domain starts competing in
// search with the researcher who wrote it.
const headers = await readFile(path.join(root, "website/_headers"), "utf8");
for (const prefix of ["/archived-references/*", "/original-listings/*"]) {
  const block = headers.split(/\n(?=\S)/).find((section) => section.startsWith(prefix));
  check(/X-Robots-Tag:\s*noindex/.test(block || ""), `${prefix} must carry X-Robots-Tag: noindex`);
}

const biggest = html.reduce((worst, entry) => (entry[1].length > worst[1].length ? entry : worst));
check(biggest[1].length < 400_000, `${biggest[0]} is ${biggest[1].length} bytes — a preserved body may have leaked in`);

/* -------------------------------------------------------------- the sitemap */

const sitemap = files.get("sitemap.xml") || "";
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(locs.length === canonicals.size + 1, `sitemap lists ${locs.length} URLs for ${canonicals.size} pages plus the home page`);
check(new Set(locs).size === locs.length, "sitemap contains a duplicate URL");
check(locs.includes(`${ORIGIN}/`), "sitemap omits the home page");
check(locs.every((loc) => loc.startsWith(`${ORIGIN}/`)), "sitemap contains an off-origin URL");
check(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(sitemap), "sitemap contains an unescaped ampersand");
for (const loc of locs) {
  if (loc === `${ORIGIN}/`) continue;
  check(canonicals.has(loc), `sitemap lists ${loc}, which no generated page declares as its canonical`);
}

// Every sitemap URL must resolve to a page that is actually published.
for (const canonical of canonicals) check(locs.includes(canonical), `${canonical} is generated but missing from the sitemap`);

/* --------------------------------------------------------- internal links */

const staged = new Set(files.keys());
const archive = new Set(JSON.parse(await readFile(path.join(root, "website/data/catalogue.json"), "utf8")).years.map((year) => year.id));
check(archive.size > 0, "catalogue lists no collections");
for (const id of archive) check(staged.has(`research/${id}/index.html`), `no generated page for collection ${id}`);

const missing = new Set();
for (const [name, body] of html) {
  for (const match of body.matchAll(/href="\/([^"#?]*)(?:[^"]*)"/g)) {
    const target = match[1];
    if (!target || target.startsWith("archived-references/") || target.startsWith("original-listings/")) continue;
    const candidates = [target, `${target}index.html`, `${target}/index.html`];
    if (!candidates.some((candidate) => staged.has(candidate)) && !["brand-mark.svg", "pages.css"].includes(target)) {
      missing.add(`${name} -> /${target}`);
    }
  }
}
check(missing.size === 0, `generated pages link to ${missing.size} path(s) this build does not stage: ${[...missing].slice(0, 5).join(", ")}`);

/* ------------------------------------------------------------- security.txt */

const securityTxt = files.get(".well-known/security.txt") || "";
const expires = securityTxt.match(/^Expires:\s*(.+)$/m);
check(/^Contact:\s*https:\/\/github\.com\/irsdl\/webhacklist\/security\/advisories$/m.test(securityTxt), "security.txt must point at the GitHub advisory form");
check(Boolean(expires), "security.txt has no Expires field (RFC 9116 requires one)");
check(new Date(expires?.[1]) > new Date(), `security.txt Expires is not in the future: ${expires?.[1]}`);
check(/^Policy:\s*https:\/\/webhacklist\.com\/security\/$/m.test(securityTxt), "security.txt must link the human-readable policy");
check(/no bug bounty/i.test(files.get("security/index.html") || ""), "the security page must say there is no bug bounty");

/* ----------------------------------------------------------------- report */

const bytes = [...files.values()].reduce((sum, body) => sum + Buffer.byteLength(body), 0);
console.log(`Generated pages:     ${html.length}`);
console.log(`Sitemap URLs:        ${locs.length}`);
console.log(`Collections:         ${archive.size}`);
console.log(`Total bytes:         ${bytes}`);

if (fail.length) {
  console.error(`\n${fail.length} failure(s):`);
  for (const message of fail.slice(0, 25)) console.error(`  - ${message}`);
  throw new Error(`pages test failed with ${fail.length} failure(s)`);
}
console.log("Pages test:          PASS");
