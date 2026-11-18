// Reviewed presentation metadata only. Research standing never comes from here.
import {stat} from "node:fs/promises";
import path from "node:path";
export const OFFICIAL_HUB = "https://portswigger.net/research/top-10-web-hacking-techniques";
export const OFFICIAL_KINDS = Object.freeze({top10:"Official results",nominees:"Official nomination material","nominees-and-top10":"Official nominations and results",voting:"Official voting stage",finalists:"Official finalists"});
const hosts = new Set(["portswigger.net","web.archive.org","blog.jeremiahgrossman.com","jeremiahgrossman.blogspot.com","www.whitehatsec.com","whitehatsec.com"]);
export function officialUrl(value) {
  if (typeof value !== "string" || value.length > 2048 || /[\s<>\u0000-\u001f\u007f]/.test(value)) throw Error("Invalid official URL");
  const url = new URL(value);
  if (!["https:","http:"].includes(url.protocol) || url.username || url.password || url.port || !hosts.has(url.hostname)) throw Error("Unsafe official destination");
  if (url.hostname === "web.archive.org") {
    const match = url.pathname.match(/^\/web\/\d{14}\/(https?:\/\/.+)$/);
    if (!match || new URL(match[1]).hostname === "web.archive.org") throw Error("Invalid official replay");
    officialUrl(match[1]);
  }
  return url.href;
}
function fields(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key))) throw Error("Unsupported official metadata field");
}
function text(value, max = 160) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[<>\u0000-\u001f\u007f]/.test(value)) throw Error("Invalid official metadata text");
  return value;
}
function date(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value + "T00:00:00Z").toISOString().slice(0,10) !== value) throw Error("Invalid official checked date");
  return value;
}
export async function normalizeOfficialSources(reviewed, sources, registry, {repoDir, exists = async file => (await stat(file).catch(() => null))?.isFile() === true} = {}) {
  fields(reviewed,["schema","hub","collections"]);
  if (reviewed.schema !== 1 || reviewed.hub !== OFFICIAL_HUB || !Array.isArray(reviewed.collections) || reviewed.collections.length > 100) throw Error("Unsupported official context schema");
  const selectors = new Map(), ids = new Set(registry.years.map(year => year.id)), contexts = {};
  for (const entry of sources.entries) {
    const key = `${entry.year}:${entry.kind}`;
    if (selectors.has(key)) throw Error("Duplicate official source selector");
    selectors.set(key,entry);
  }
  for (const collection of reviewed.collections) {
    fields(collection,["id","organiser","checked","sources"]);
    if (!ids.has(collection.id) || Object.hasOwn(contexts,collection.id)) throw Error("Unknown or duplicate official collection");
    if (!Array.isArray(collection.sources) || !collection.sources.length || collection.sources.length > 5) throw Error("Invalid official source list");
    const used = new Set(), links = [];
    for (const selector of collection.sources) {
      fields(selector,["kind","mode","evidence","availability"]);
      if (selector.availability !== undefined && selector.availability !== "unverified") throw Error("Unsupported official availability");
      if (!Object.hasOwn(OFFICIAL_KINDS,selector.kind) || used.has(selector.kind)) throw Error("Duplicate or unsupported official kind");
      used.add(selector.kind);
      const entry = selectors.get(`${collection.id}:${selector.kind}`);
      if (!entry) throw Error("Unresolved official source selector");
      text(selector.evidence,1200);
      const url = officialUrl(entry.url);
      if (!["publication","migrated","replay"].includes(selector.mode) || (new URL(url).hostname === "web.archive.org") !== (selector.mode === "replay")) throw Error("Official destination mode mismatch");
      const link = {kind:selector.kind,url,mode:selector.mode};
      if (selector.availability) link.availability = selector.availability;
      if (entry.original_url && entry.original_url !== url) link.originalUrl = officialUrl(entry.original_url);
      if (selector.mode !== "publication" && !link.originalUrl) throw Error("Missing historical official URL");
      // Only existing results/combined PDFs have supported app and preview routes.
      if (["top10","nominees-and-top10"].includes(selector.kind)) {
        const snapshot = `original-listings/${collection.id}-${selector.kind}.pdf`;
        if (await exists(path.join(repoDir,snapshot))) link.snapshot = snapshot;
      }
      links.push(link);
    }
    links.sort((a,b) => ["top10","nominees-and-top10","nominees","voting","finalists"].indexOf(a.kind) - ["top10","nominees-and-top10","nominees","voting","finalists"].indexOf(b.kind));
    contexts[collection.id] = {schema:1,organiser:text(collection.organiser),checked:date(collection.checked),links};
  }
  return {hub:OFFICIAL_HUB,contexts};
}
