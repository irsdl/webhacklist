// Maintained publication and annual lifecycle policy. No live availability probes.
const stages = new Set(["preliminary", "nominations-open", "voting-open", "frozen", "results-announced", "official-results"]);
const exclusionStages = new Set(["before-nominations", "declined-final-ranking", "after-shortlist-before-panel", "after-shortlist-before-final-ten"]);
export function checkedDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw Error("Invalid policy checked date");
  return value;
}
function publicUrl(value) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || /[\s<>\u0000-\u001f]/.test(value)) throw Error("Invalid policy URL");
  return url.href;
}
export function resultsImportNotBefore(lifecycle) {
  return new Date(Date.parse(lifecycle.resultsAnnouncedAt) + lifecycle.importDelayDays * 86400000).toISOString();
}
function instant(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== (value.includes(".") ? value : value.replace("Z", ".000Z"))) throw Error("Invalid results timestamp");
  return value;
}
export function validateLifecycle(record, registry, {now = new Date()} = {}) {
  const value = record.lifecycle;
  if (!value) {
    if (record.status === "final" && registry.delayedOfficialImports?.includes(record.id)) throw Error("This annual collection requires delayed-import lifecycle evidence");
    if (record.status === "preliminary") throw Error("Preliminary collection requires lifecycle metadata");
    return;
  }
  if (!stages.has(value.stage) || (record.status === "preliminary" ? record.ranked !== false : record.status !== "final" || record.ranked !== true || value.stage !== "official-results")) throw Error("Invalid collection lifecycle");
  checkedDate(value.checked);
  if (value.importDelayDays !== 14) throw Error("Official results import requires a fourteen-day waiting period");
  if (!/^\d{4}-01-\d{2}T00:00:00Z$/.test(value.freezeAt) || !Number.isFinite(Date.parse(value.freezeAt)) || new Date(value.freezeAt).toISOString().replace(".000Z", "Z") !== value.freezeAt || Number(value.freezeAt.slice(0,4)) !== Number(record.id.slice(0,4)) + 1) throw Error("Freeze date must be an explicit January UTC date after the research year");
  if (value.destination !== "https://portswigger.net/research/top-10-web-hacking-techniques") throw Error("Invalid official hub");
  for (const [key, stage] of [["nomination", "nominations-open"], ["voting", "voting-open"]]) {
    const round = value[key];
    if (round) {
      const url = new URL(publicUrl(round.url));
      checkedDate(round.checked);
      if (url.origin !== "https://portswigger.net" || !url.pathname.includes(record.id.slice(0,4)) || round.verifiedOpen !== true || !round.evidence) throw Error("Participation requires a verified year-specific open round");
    }
    if (value.stage === stage && !round) throw Error("Open stage has no verified participation destination");
  }
  const announced = ["results-announced", "official-results"].includes(value.stage);
  if (announced) {
    instant(value.resultsAnnouncedAt);
    const announcement = new URL(publicUrl(value.resultsAnnouncement));
    if (announcement.origin !== "https://portswigger.net" || !announcement.pathname.startsWith(`/research/top-10-web-hacking-techniques-of-${record.id.slice(0,4)}`) || Date.parse(value.resultsAnnouncedAt) > now.getTime()) throw Error("Results require a verified, dated PortSwigger winner announcement");
  } else if (value.resultsAnnouncedAt || value.resultsAnnouncement || value.resultsImportedAt) throw Error("Result evidence requires the results-announced stage");
  if (value.stage === "official-results") {
    instant(value.resultsImportedAt);
    if (Date.parse(value.resultsImportedAt) < Date.parse(resultsImportNotBefore(value)) || Date.parse(value.resultsImportedAt) > now.getTime()) throw Error("Import must occur at least fourteen days after the winner announcement");
    const official = registry.years.find(year => year.id === value.officialCollection);
    if (!official || official.id !== record.id.slice(0,4) || official.status !== "final" || official.ranked !== true) throw Error("Official transition must point to the final annual collection");
  } else if (value.officialCollection || value.resultsImportedAt) throw Error("Official collection is only valid after the delayed results import");
}

export function validateResearchContext(value, registry) {
  if (value?.schema !== 1 || !Array.isArray(value.publications) || !Array.isArray(value.exclusions)) throw Error("Invalid research context");
  const seen = new Set();
  for (const publication of value.publications) {
    const key = publicUrl(publication.citation);
    if (seen.has(key) || !["live", "unverified", "dead", "replaced"].includes(publication.availability)) throw Error("Duplicate or invalid publication availability");
    seen.add(key);
    publicUrl(publication.originalUrl);
    checkedDate(publication.checked);
    if (!publication.evidence) throw Error("Publication availability needs evidence");
    if (publication.snapshot) {
      const snapshot = publication.snapshot;
      const url = publicUrl(snapshot.url);
      const replay = url.match(/^https:\/\/web\.archive\.org\/web\/\d{14}\/(https?:\/\/.+)$/);
      if (!replay || snapshot.verified !== true || !snapshot.evidence || publicUrl(replay[1]) !== publicUrl(publication.originalUrl)) throw Error("Snapshot needs verified identity matching the original URL");
      checkedDate(snapshot.checked);
    }
  }
  seen.clear();
  for (const exclusion of value.exclusions) {
    const key = `${exclusion.year}:${publicUrl(exclusion.citation)}`;
    if (seen.has(key) || !registry.years.some(year => year.id === exclusion.year && year.status === "final") || exclusion.reason !== "conflict-of-interest" || !exclusionStages.has(exclusion.stage) || !exclusion.explanation) throw Error("Invalid historical exclusion");
    seen.add(key);
    checkedDate(exclusion.checked);
    const evidence = new URL(publicUrl(exclusion.evidence));
    if (evidence.origin !== "https://portswigger.net" || !evidence.pathname.startsWith("/research/top-10-web-hacking-techniques-of-")) throw Error("Exclusion needs original organiser evidence");
  }
}
