// Real browser HTTP-cache migration test, without request interception or
// clearing browser data. Old fixed paths become unavailable at the server;
// their still-fresh cached bytes must not be needed by the upgraded reader.
import assert from "node:assert/strict";
import http from "node:http";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { browserName, launchBrowser } from "./browser-test.mjs";
import { pdfjsReleaseFiles } from "./pdfjs-release-build.mjs";

const release = await pdfjsReleaseFiles();
const legacy = new Map([...release.files].filter(([name]) => !name.startsWith("pdf-"))
  .map(([name, body]) => ["vendor/pdfjs/" + name, body]));
for (const name of ["pdf-worker.mjs", "pdf-reader-polyfills.mjs"]) legacy.set(name, await readFile(new URL(name, import.meta.url)));
const hits = { old: 0, current: 0 };
let upgraded = false;
const server = http.createServer((request, response) => {
  const name = new URL(request.url, "http://localhost").pathname.slice(1);
  if (["warm", "settle", "upgrade"].includes(name)) {
    response.writeHead(200, { "content-type": "text/html", "cache-control": "no-store" });
    response.end('<!doctype html><title>Vendor release cache regression</title><canvas></canvas>'); return;
  }
  let body;
  if (name.startsWith(release.releasePath + "/")) {
    hits.current++; body = release.files.get(name.slice(release.releasePath.length + 1));
  } else if (legacy.has(name)) {
    hits.old++;
    if (upgraded) { response.writeHead(410).end("Old fixed release removed by regression fixture"); return; }
    body = legacy.get(name);
  }
  if (!body) { response.writeHead(404).end(); return; }
  response.writeHead(200, { "content-type": name.endsWith(".mjs") || name.endsWith(".js") ? "text/javascript" : name.endsWith(".wasm") ? "application/wasm" : "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable", "content-length": Buffer.byteLength(body) });
  response.end(body);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

function pdfBytes() {
  const stream = "BT /F1 18 Tf 30 70 Td (Vendor release cache test) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 100] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n` + offsets.slice(1).map(n => `${String(n).padStart(10, "0")} 00000 n \n`).join("");
  return [...Buffer.from(pdf + `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`)];
}
const browser = await launchBrowser();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  async function inspect(paths) {
    return page.evaluate(async paths => {
      const result = {};
      for (const name of paths) {
        const response = await fetch("/" + name);
        if (!response.ok) throw Error(`${name}: HTTP ${response.status}`);
        const bytes = await response.arrayBuffer();
        result[name] = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(n => n.toString(16).padStart(2, "0")).join("");
      }
      return result;
    }, paths);
  }
  async function render(root, worker, polyfill) {
    return page.evaluate(async ({ root, worker, polyfill, data }) => {
      await import(polyfill);
      const pdfjs = await import(root + "build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = worker;
      const document = await pdfjs.getDocument({ data: new Uint8Array(data), useSystemFonts: false,
        cMapUrl: root + "web/cmaps/", cMapPacked: true, standardFontDataUrl: root + "web/standard_fonts/", wasmUrl: root + "web/wasm/", isEvalSupported: false }).promise;
      const first = await document.getPage(1);
      const canvas = window.document.querySelector("canvas");
      const viewport = first.getViewport({ scale: 1 }); canvas.width = viewport.width; canvas.height = viewport.height;
      await first.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      const text = (await first.getTextContent()).items.map(item => item.str).join(" ");
      await document.destroy(); return text;
    }, { root, worker, polyfill, data: pdfBytes() });
  }
  await page.goto(origin + "/warm");
  await page.evaluate(() => localStorage.setItem("retained-browser-state", "old-release"));
  const warm = await inspect([...legacy.keys()]);
  await page.goto(origin + "/settle");
  const probe = legacy.keys().next().value, warmNetworkRequests = hits.old;
  assert.deepEqual(await inspect([probe]), {[probe]:warm[probe]});
  const retainedHttpCache = hits.old === warmNetworkRequests;
  if (!retainedHttpCache) assert.equal(browserName, "webkit", "the browser fixture must retain immutable HTTP responses");
  assert.equal(await render(origin + "/vendor/pdfjs/", origin + "/pdf-worker.mjs", origin + "/pdf-reader-polyfills.mjs"), "Vendor release cache test");
  upgraded = true;
  hits.old = 0;
  await page.goto(origin + "/upgrade");
  assert.equal(await page.evaluate(() => localStorage.getItem("retained-browser-state")), "old-release");
  // A normal fetch still gets the old immutable responses even though the
  // server now rejects those paths when this WebKit runtime provides a cache.
  if (retainedHttpCache) {
    assert.deepEqual(await inspect([...legacy.keys()]), warm);
    assert.equal(hits.old, 0, "old immutable cache stays warm without contacting the changed server");
  }
  const current = await inspect([...release.files.keys()].map(name => release.releasePath + "/" + name));
  for (const [name, bytes] of release.files) assert.equal(current[release.releasePath + "/" + name], createHash("sha256").update(bytes).digest("hex"), name);
  const root = origin + "/" + release.releasePath + "/";
  assert.equal(await render(root, root + "pdf-worker.mjs", root + "pdf-reader-polyfills.mjs"), "Vendor release cache test");
  assert.equal(hits.old, 0, "upgraded display, actual worker and standard-font render never request old paths");
  assert.ok(hits.current >= release.files.size, "every release file was fetched through the new root");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ pass: true, browser: browser.version(), release: release.releasePath,
    warmFixedFiles: legacy.size, verifiedReleaseFiles: release.files.size, oldNetworkRequestsAfterUpgrade: hits.old,
    actualWorkerAndStandardFontRender: true, ancillaryCoverage: "all cmaps, standard fonts, WASM and fallback JS checked byte-for-byte",
    retainedBrowserData: true, retainedHttpCache }));
  await context.close();
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
