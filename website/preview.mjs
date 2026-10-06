// Local production-shaped preview. The page and PDF parser keep separate origins;
// substitutions happen only in served copies, never in production source files.
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.WEBSEC_PREVIEW_PORT || 4173);
const readerPort = Number(process.env.WEBSEC_READER_PORT || 4174);
if (![port, readerPort].every((value) => Number.isInteger(value) && value >= 1024 && value <= 65535) || port === readerPort) throw Error("Choose two different ports between 1024 and 65535");
const origin = `http://127.0.0.1:${port}`;
const readerOrigin = `http://127.0.0.1:${readerPort}`;
const appAssets = new Set(["index.html", "404.html", "app.js", "discovery.js", "constellation.js", "styles.css", "discovery.css", "brand-mark.svg", "social-preview.png", "site.webmanifest", "archive-years.json"]);
const readerAssets = new Set(["pdf-reader.html", "pdf-reader.css", "pdf-reader.mjs", "pdf-reader-polyfills.mjs", "pdf-reader-url.mjs", "pdf-worker.mjs"]);
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".mjs":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json", ".webmanifest":"application/manifest+json", ".svg":"image/svg+xml", ".pdf":"application/pdf", ".md":"text/plain; charset=utf-8", ".png":"image/png", ".wasm":"application/wasm", ".ttf":"font/ttf" };
const servers = [];

function localize(source) {
  return source.replaceAll("https://webhacklist.com", origin)
    .replaceAll("https://irsdl.github.io", readerOrigin);
}
function fileFor(pathname, reader) {
  let relative = decodeURIComponent(pathname).replace(/^\/(?:website\/|webhacklist\/)?/, "");
  if (!relative) relative = "index.html";
  const archivePdf = /^(?:archived-references\/pdf\/[a-z0-9-]+\/[a-z0-9._-]+|original-listings\/[0-9-]+-(?:top10|nominees-and-top10))\.pdf$/i.test(relative);
  const archiveMd = /^archived-references\/md\/[a-z0-9-]+\/[a-z0-9._-]+\.md$/i.test(relative);
  const archiveFigure = /^archived-references\/figures\/[a-z0-9-]+\/[a-z0-9._-]+\/[a-z0-9_-][a-z0-9._-]*\.png$/i.test(relative);
  const archiveDiagram = /^archived-references\/diagrams\/[a-f0-9]{64}\.svg$/.test(relative);
  if (archivePdf || (!reader && (archiveMd || archiveFigure || archiveDiagram))) return path.join(root, relative);
  const data = /^data\/(?:(?:catalogue|diagrams)\.json|(?:collections|sources)\/[a-z0-9-]+\.json)$/.test(relative);
  const vendor = /^vendor\/pdfjs\/[a-z0-9_./-]+$/i.test(relative) && !relative.split("/").includes("..");
  if ((reader && (readerAssets.has(relative) || vendor)) || (!reader && (appAssets.has(relative) || data))) return path.join(root, "website", relative);
  return null;
}

for (const reader of [false, true]) {
  const server = http.createServer(async (request, response) => {
    try {
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) { response.writeHead(405).end(); return; }
      const requested = new URL(request.url, reader ? readerOrigin : origin);
      const file = fileFor(requested.pathname, reader);
      if (!file) { response.writeHead(404).end("Not found"); return; }
      const info = await stat(file);
      if (!info.isFile()) { response.writeHead(404).end("Not found"); return; }
      const type = path.extname(file);
      const headers = { "content-type":mime[type] || "application/octet-stream", "cache-control":"no-store", "x-content-type-options":"nosniff", "access-control-allow-origin":readerOrigin };
      if (request.method === "OPTIONS") { response.writeHead(204, headers).end(); return; }
      if ([".html", ".js", ".mjs"].includes(type) && !file.includes(`${path.sep}vendor${path.sep}`)) {
        const body = localize(await readFile(file, "utf8"));
        response.writeHead(200, {...headers,"content-length":Buffer.byteLength(body)});
        response.end(request.method === "HEAD" ? undefined : body);
        return;
      }
      if (file.endsWith(`${path.sep}catalogue.json`)) {
        const catalogue = JSON.parse(await readFile(file, "utf8"));
        for (const [key, value] of Object.entries(catalogue.hosting?.largePdfFallbacks || {})) catalogue.hosting.largePdfFallbacks[key] = localize(value);
        const body = JSON.stringify(catalogue);
        response.writeHead(200, {...headers,"content-length":Buffer.byteLength(body)});
        response.end(request.method === "HEAD" ? undefined : body);
        return;
      }
      let start = 0, end = info.size - 1, status = 200;
      if (type === ".pdf" && request.headers.range) {
        const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range);
        if (!range || Number(range[1]) >= info.size || (range[2] && Number(range[2]) < Number(range[1]))) { response.writeHead(416,{"content-range":`bytes */${info.size}`}).end(); return; }
        start = Number(range[1]);
        end = range[2] ? Math.min(Number(range[2]), end) : end;
        status = 206;
        headers["content-range"] = `bytes ${start}-${end}/${info.size}`;
      }
      response.writeHead(status, {...headers,"accept-ranges":"bytes","content-length":end-start+1});
      if (request.method === "HEAD") response.end();
      else {
        const stream = createReadStream(file, {start,end});
        stream.on("error", () => response.destroy());
        response.on("close", () => stream.destroy());
        stream.pipe(response);
      }
    } catch (error) {
      if (!response.headersSent) response.writeHead(error.code === "ENOENT" ? 404 : 400).end("File unavailable");
      else response.destroy();
    }
  });
  servers.push(server);
  server.on("error", (error) => { console.error(error.message); servers.forEach((entry) => entry.close()); process.exitCode = 1; });
  server.listen(reader ? readerPort : port, "127.0.0.1", () => console.log(`${reader ? "Isolated PDF reader" : "Website preview"}: ${reader ? readerOrigin : origin}/`));
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => servers.forEach((server) => server.close()));
