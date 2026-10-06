#!/usr/bin/env node
/**
 * Stage one dependency-free static site for GitHub Pages or Cloudflare Pages.
 * Only archive documents referenced by generated collection shards are copied.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { buildPages } from "./build-pages.mjs";

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(APP_DIR);
const STATIC_FILES = [
  ".nojekyll",
  // Cloudflare Pages serves index.html for any unmatched path when no 404 page
  // is present, and this app resolves its assets relatively - so a mistyped
  // path rendered an unstyled shell whose script could not parse. Staged for
  // the Cloudflare target only; the GitHub origin writes its own index.
  "404.html",
  "_headers",
  "app.js",
  "discovery.js",
  "discovery.css",
  "brand-mark.svg",
  "constellation.js",
  "index.html",
  "pdf-reader.css",
  "pdf-reader.html",
  "pdf-reader.mjs",
  "pdf-reader-polyfills.mjs",
  "pdf-reader-url.mjs",
  "pdf-worker.mjs",
  "robots.txt",
  "site.webmanifest",
  "styles.css"
];
// sitemap.xml is deliberately absent above: build-pages.mjs generates it along
// with the crawlable pages it indexes, so the two can never disagree.
const PDF_READER_FILES = ["pdf-reader.css", "pdf-reader.html", "pdf-reader.mjs", "pdf-reader-polyfills.mjs", "pdf-reader-url.mjs", "pdf-worker.mjs"];
const STATIC_DIRECTORIES = ["vendor/pdfjs"];
const GITHUB_INDEX = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'"><title>Web Hack List file origin</title></head>
<body><main><h1>Web Hack List file origin</h1><p>This GitHub Pages project serves only oversized preserved files for <a href="https://webhacklist.com/" rel="noreferrer">webhacklist.com</a>.</p></main></body>
</html>
`;
// This origin exists to hand webhacklist.com the handful of PDFs that exceed
// Cloudflare's per-asset limit. Indexing it would put preserved copies into
// search results on a second domain, competing with both the researcher who
// wrote them and the archive itself. The index page carries `noindex`; this
// keeps a crawler away from the files too.
const GITHUB_ROBOTS = `User-agent: *
Disallow: /
`;

function parseArguments() {
  const args = process.argv.slice(2);
  const targetIndex = args.indexOf("--target");
  const outputIndex = args.indexOf("--output");
  const target = targetIndex >= 0 ? args[targetIndex + 1] : "cloudflare";
  const outputName = outputIndex >= 0 ? args[outputIndex + 1] : target === "github" ? "_site" : "dist";
  const consumed = new Set();
  if (targetIndex >= 0) { consumed.add(targetIndex); consumed.add(targetIndex + 1); }
  if (outputIndex >= 0) { consumed.add(outputIndex); consumed.add(outputIndex + 1); }
  const unknown = args.filter((_, index) => !consumed.has(index));
  if (!new Set(["cloudflare", "github"]).has(target)) throw new Error("--target must be cloudflare or github");
  if (!new Set(["dist", "_site"]).has(outputName)) throw new Error("--output must be dist or _site");
  if (unknown.length) throw new Error(`unknown argument(s): ${unknown.join(", ")}`);
  return { target, output: path.join(REPO, outputName) };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function expandCollectionWireItem(item, year) {
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

function validateRelative(relative) {
  if (typeof relative !== "string" || !relative || path.isAbsolute(relative) || relative.includes("\\") || relative.split("/").includes("..")) {
    throw new Error(`unsafe staged path: ${relative}`);
  }
  return relative;
}

// A translated reference publishes BOTH files: the English one the reader opens
// and the source-language original it was made from. Staging only the served
// path would leave the app's "Original language" action pointing at a 404.
function archivePaths(items, parent = null) {
  const paths = new Set();
  const pairedPdf = (holder) => holder?.p === true && /^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/i.test(holder.mdPath || "")
    ? holder.mdPath.replace("/md/", "/pdf/").replace(/\.md$/i, ".pdf") : holder?.pdfPath;
  const add = (holder, shared = holder) => {
    // Source-detail shards use a/b for mdPath/pdfPath to stay within their
    // payload budget; collection shards and older catalogues keep long names.
    const sharedMask = Number.isInteger(holder?.f) ? holder.f : 0;
    for (const archivePath of [
      holder?.mdPath, pairedPdf(holder), holder?.a, holder?.b,
      sharedMask & 4 ? shared?.mdPath : "",
      sharedMask & 8 ? pairedPdf(shared) : "",
      holder?.originalMdPath, holder?.originalPdfPath
    ]) {
      if (archivePath) paths.add(validateRelative(archivePath));
    }
  };
  for (const item of items) {
    add(item, parent || item);
    for (const link of item?.links || []) add(link, item);
  }
  return paths;
}

function manifestFaultPaths(manifest) {
  const faults = new Map();
  for (const record of Object.values(manifest?.urls || {})) {
    if (!record || typeof record !== "object" || !String(record.content_gap || "").includes("faulty capture:")) continue;
    for (const archivePath of [record.steps?.render?.file, record.steps?.pdf?.file]) {
      if (archivePath) faults.set(archivePath, record.content_gap);
    }
  }
  return faults;
}

async function listFiles(directory, prefix = "") {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await listFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) result.push(relative);
    else throw new Error(`refusing to stage non-regular file: ${path.join(directory, relative)}`);
  }
  return result;
}

async function main() {
  const { target, output } = parseArguments();
  const [catalogue, manifest] = await Promise.all([
    readJson(path.join(APP_DIR, "data", "catalogue.json")),
    readJson(path.join(REPO, "archived-references", "manifest.json"))
  ]);
  if (catalogue?.schema !== 1 || !Array.isArray(catalogue.years) || catalogue.hosting?.schema !== 1) {
    throw new Error("generated catalogue is missing or invalid; run node website/build-data.mjs first");
  }

  const assetLimit = Number(catalogue.hosting.cloudflareMaxAssetBytes);
  const largeFallbacks = catalogue.hosting.largePdfFallbacks || {};
  const faults = manifestFaultPaths(manifest);
  const archive = new Set();
  for (const year of catalogue.years) {
    const shard = await readJson(path.join(APP_DIR, year.file));
    if (shard?.version !== year.version || shard?.collection?.id !== year.id || !Array.isArray(shard.items)) {
      throw new Error(`${year.file} does not match catalogue entry ${year.version}`);
    }
    const expandedItems = shard.items.map((item) => expandCollectionWireItem(item, year.id));
    archivePaths(expandedItems).forEach((archivePath) => archive.add(archivePath));
    const sources = await readJson(path.join(APP_DIR, validateRelative(year.sources.file)));
    if (sources?.version !== year.sources.version || sources?.year !== year.id || !sources.items) {
      throw new Error(`${year.sources.file} does not match catalogue entry ${year.sources.version}`);
    }
    const itemsById = new Map(expandedItems.map((item) => [item.id, item]));
    for (const [id, sourceList] of Object.entries(sources.items)) {
      archivePaths(sourceList, itemsById.get(id)).forEach((archivePath) => archive.add(archivePath));
    }
  }

  for (const file of [...archive].filter((file) => file.endsWith(".md"))) {
    const markdown = await fs.readFile(path.join(REPO, file), "utf8").catch((error) => {
      if (error.code === "ENOENT") return "";
      throw error;
    });
    for (const match of markdown.matchAll(/!\[[^\[\]\n]*\]\(\.\.\/\.\.\/(figures\/[a-z0-9-]+\/[a-z0-9._-]+\/[a-z0-9_-][a-z0-9._-]*\.png)\)/gi)) {
      archive.add(validateRelative(`archived-references/${match[1]}`));
    }
  }
  const diagramIndex = await readJson(path.join(APP_DIR, "data", "diagrams.json"));
  if (diagramIndex.schema !== 1 || diagramIndex.version !== catalogue.diagramIndex.version) throw new Error("diagram index does not match catalogue");
  for (const diagram of Object.values(diagramIndex.diagrams || {})) {
    if (!/^archived-references\/diagrams\/[a-f0-9]{64}\.svg$/.test(diagram)) throw new Error("invalid diagram path");
    archive.add(diagram);
  }

  const tasks = [];
  if (target === "github") {
    // GitHub Pages is deliberately a small, separate file origin rather than a
    // duplicate site. It publishes the isolated mobile reader bundle and the
    // PDFs that exceed Cloudflare's per-file limit; Cloudflare owns everything
    // else in the archive.
    tasks.push({ source: path.join(APP_DIR, ".nojekyll"), relative: ".nojekyll", required: true });
    for (const filename of PDF_READER_FILES) {
      tasks.push({ source: path.join(APP_DIR, filename), relative: filename, required: true });
    }
    for (const archivePath of Object.keys(largeFallbacks).sort()) {
      validateRelative(archivePath);
      if (!archive.has(archivePath)) throw new Error(`GitHub fallback is not referenced by generated data: ${archivePath}`);
      tasks.push({ source: path.join(REPO, archivePath), relative: archivePath, required: true });
    }
  } else {
    for (const filename of STATIC_FILES) tasks.push({ source: path.join(APP_DIR, filename), relative: filename, required: true });
    for (const filename of await listFiles(path.join(APP_DIR, "data"))) {
      tasks.push({ source: path.join(APP_DIR, "data", filename), relative: `data/${filename}`, required: true });
    }
    for (const archivePath of [...archive].sort()) {
      tasks.push({ source: path.join(REPO, archivePath), relative: archivePath, required: /\.(?:png|svg)$/.test(archivePath) });
    }
    for (const filename of (await fs.readdir(path.join(REPO, "original-listings"))).filter((name) => name.endsWith(".pdf")).sort()) {
      tasks.push({ source: path.join(REPO, "original-listings", filename), relative: `original-listings/${filename}`, required: true });
    }
  }
  for (const directory of STATIC_DIRECTORIES) {
    for (const filename of await listFiles(path.join(APP_DIR, directory))) {
      tasks.push({ source: path.join(APP_DIR, directory, filename), relative: `${directory}/${filename}`, required: true });
    }
  }

  // Large staged trees on mounted filesystems can briefly report ENOTEMPTY as
  // directory entries settle. Node retries that documented transient class
  // only when maxRetries is set.
  await fs.rm(output, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  await fs.mkdir(output, { recursive: true });
  const skippedLarge = [];
  const skippedFaults = [];
  let totalBytes = 0;
  let fileCount = 0;
  if (target === "github") {
    for (const [relative, body] of [["index.html", GITHUB_INDEX], ["robots.txt", GITHUB_ROBOTS]]) {
      await fs.writeFile(path.join(output, relative), body, "utf8");
      totalBytes += Buffer.byteLength(body);
      fileCount++;
    }
  }
  for (const task of tasks) {
    validateRelative(task.relative);
    let stat;
    try {
      stat = await fs.lstat(task.source);
    } catch (error) {
      if (error.code === "ENOENT" && !task.required && faults.has(task.relative)) {
        skippedFaults.push(task.relative);
        continue;
      }
      throw new Error(`staged source is missing: ${task.relative}`);
    }
    if (!stat.isFile()) throw new Error(`staged source is not a regular file: ${task.relative}`);
    if (target === "cloudflare" && stat.size > assetLimit) {
      if (!Object.hasOwn(largeFallbacks, task.relative)) {
        throw new Error(`${task.relative} is ${stat.size} bytes, over Cloudflare's ${assetLimit}-byte limit, and has no configured fallback`);
      }
      skippedLarge.push(task.relative);
      continue;
    }
    const destination = path.join(output, task.relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(task.source, destination);
    totalBytes += stat.size;
    fileCount++;
  }

  // The crawlable surface is generated straight into the staged tree rather
  // than committed, so it is rebuilt from the same catalogue every deploy and
  // cannot drift from the collections it indexes.
  let pageCount = 0;
  if (target === "cloudflare") {
    for (const [relative, body] of await buildPages({ appDir: APP_DIR, repoDir: REPO })) {
      validateRelative(relative);
      const destination = path.join(output, relative);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, body, "utf8");
      totalBytes += Buffer.byteLength(body);
      fileCount++;
      pageCount++;
    }
  }

  if (target === "cloudflare" && fileCount > 20000) throw new Error(`Cloudflare free-site file limit exceeded: ${fileCount} files`);
  if (target === "github" && totalBytes >= 1_000_000_000) throw new Error(`GitHub Pages site-size limit exceeded: ${totalBytes} bytes`);
  console.log(`${target} site staged in ${path.relative(REPO, output)}/: ${fileCount} files, ${totalBytes} bytes${pageCount ? ` (${pageCount} generated crawlable)` : ""}`);
  if (skippedLarge.length) console.log(`large PDFs delegated to GitHub Pages: ${skippedLarge.join(", ")}`);
  if (skippedFaults.length) console.warn(`filed faulty captures omitted: ${skippedFaults.length} (${skippedFaults.join(", ")})`);
}

main().catch((error) => {
  console.error(`build-site failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
