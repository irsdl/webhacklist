/* Human-readable bibliography, separate from the saved-state JSON backup. */
const ShortlistBibliography = (() => {
  const MAX_RECORDS = 5000, MAX_TEXT = 20000, MAX_BYTES = 8 * 1024 * 1024;
  function text(value) {
    const result = String(value ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (result.length > MAX_TEXT) throw Error("A bibliography field exceeds 20,000 characters.");
    return result;
  }
  function url(value) {
    const original = text(value);
    if (!original || original.length > 8192) throw Error("A source URL is missing or too long.");
    const parsed = new URL(original);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw Error("Source links must be HTTP or HTTPS URLs without credentials.");
    return parsed.href;
  }
  function records(items, normalize, standing, officialFor = () => null) {
    if (!Array.isArray(items) || items.length > MAX_RECORDS) throw Error("A bibliography can contain at most 5,000 records.");
    const seen = new Set();
    return items.flatMap(item => {
      // A document can contribute to several distinct curated stories. Only
      // duplicate occurrences of the same story in the same collection collapse.
      const identity = normalize(item.identityUrl || item.originalUrl);
      const key = JSON.stringify([text(item.year), text(item.id), identity]);
      if (seen.has(key)) return [];
      seen.add(key);
      const links = [], seenLinks = new Set();
      for (const link of [{url:item.originalUrl, label:(item.links || []).find(link => link.url === item.originalUrl)?.label || "Main reading source"}, ...(item.links || [])]) {
        const address = url(link.url);
        if (seenLinks.has(address)) continue;
        seenLinks.add(address);
        const details = (item.links || []).find(source => url(source.url) === address)?.details;
        links.push({url:address, label:text(link.label || "Original source"), authors:(details?.authors || []).map(text), publisher:text(details?.publisher), metadata:details ? "Recorded source metadata" : "Source credits unavailable in catalogue"});
      }
      const context = officialFor(item.year);
      if (context && (!Array.isArray(context.links) || context.links.length > 6)) throw Error("Invalid bibliography official context.");
      const official = context ? {organiser:text(context.organiser || ""),checked:text(context.checked || ""),links:context.links.map(link => ({label:text(link.label),url:url(link.url)}))} : {organiser:"",checked:"",links:[]};
      return [{title:text(item.title), authors:(item.authors || []).map(text), publisher:text(item.publisher), collection:text(item.yearLabel || item.year), standing:text(standing(item)), identity, id:text(item.id), links, official}];
    });
  }
  const md = value => text(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([\\`*_{}\[\]()#+.!|~-])/g, "\\$1").replace(/\n/g, " ");
  const html = value => text(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const destination = value => url(value).replace(/[<>\s\\]/g, char => encodeURIComponent(char));
  function bounded(value) {
    if (new TextEncoder().encode(value).length > MAX_BYTES) throw Error("The bibliography exceeds 8 MiB; narrow the filters.");
    return value;
  }
  function markdown(rows, selection) {
    return bounded(`# WebHackList research shortlist\n\n${rows.length} records. Full matching set, including every results page.\n\nSelection: ${md(selection)}\n\nCredits reflect recorded catalogue metadata; missing credits are stated. Collection years are not publication dates.\n\n${rows.map((row, index) => `## ${index + 1}. ${md(row.title)}\n\nAuthors: ${row.authors.length ? row.authors.map(md).join("; ") : "Author not stated"}\n\nPublisher / host: ${md(row.publisher || "Not stated")}\n\nCollection: ${md(row.collection)}\n\nStanding: ${md(row.standing)}\n\n${row.official?.links.length ? `Official context${row.official.organiser ? ` — ${md(row.official.organiser)}` : ""}${row.official.checked ? ` (source identity checked ${md(row.official.checked)})` : ""}:\n\n${row.official.links.map(link => `- [${md(link.label)}](<${destination(link.url)}>)`).join("\n")}\n\n` : ""}${row.links.map(link => `- [${md(link.label)}](<${destination(link.url)}>) - ${link.authors.length ? link.authors.map(md).join("; ") : "Author not stated"}; publisher / host: ${md(link.publisher || "Not stated")}. ${md(link.metadata)}.`).join("\n")}\n`).join("\n")}`);
  }
  function csv(rows, selection) {
    // Neutralize spreadsheet formulas even after leading spaces/newlines. Every
    // field is quoted; embedded quotes/newlines round-trip as RFC 4180 cells.
    const cell = value => { let field = text(value); if (/^\s*[=+@-]/.test(field) || /^[\t\r\n]/.test(field)) field = "'" + field; return `"${field.replace(/"/g, '""')}"`; };
    const header = ["Title", "Authors (one per line)", "Publisher / host", "Collection", "Standing", "Original source URLs (one per line)", "Source credits (one per line)", "Selection", "Scope", "Record count", "Record identity", "Official organiser", "Official context URLs (one per line)", "Official context labels (one per line)", "Official context checked"];
    return bounded([header, ...rows.map(row => [row.title, row.authors.join("\n") || "Author not stated", row.publisher || "Not stated", row.collection, row.standing, row.links.map(link => link.url).join("\n"), row.links.map(link => `${link.url} | ${link.authors.join("; ") || "Author not stated"} | ${link.publisher || "Not stated"} | ${link.metadata}`).join("\n"), selection, "Full matching set, including every results page", rows.length, row.id, row.official?.organiser || "", (row.official?.links || []).map(link => link.url).join("\n"), (row.official?.links || []).map(link => link.label).join("\n"), row.official?.checked || ""])].map(fields => fields.map(cell).join(",")).join("\r\n") + "\r\n");
  }
  function printHtml(rows, selection) {
    return bounded(`<header><p>WebHackList / Research Desk</p><h1>Research shortlist</h1><p>${rows.length} records. Full matching set, including every results page.</p><p>Selection: ${html(selection)}</p><p>Credits reflect recorded catalogue metadata; missing credits are stated. Collection years are not publication dates.</p></header><ol>${rows.map(row => `<li><article><h2>${html(row.title)}</h2><p><strong>Authors:</strong> ${html(row.authors.join("; ") || "Author not stated")}</p><p><strong>Publisher / host:</strong> ${html(row.publisher || "Not stated")}</p><p><strong>Collection:</strong> ${html(row.collection)}<br><strong>Standing:</strong> ${html(row.standing)}</p>${row.official?.links.length ? `<p><strong>Official context${row.official.organiser ? ` — ${html(row.official.organiser)}` : ""}:</strong> ${row.official.links.map(link => `<a href="${html(link.url)}">${html(link.label)}</a>`).join(" · ")}${row.official.checked ? ` (source identity checked ${html(row.official.checked)})` : ""}</p>` : ""}<ul>${row.links.map(link => `<li><p>${html(link.label)}: <a href="${html(link.url)}">${html(link.url)}</a></p><p>${html(link.authors.join("; ") || "Author not stated")} | ${html(link.publisher || "Not stated")} | ${html(link.metadata)}</p></li>`).join("")}</ul></article></li>`).join("")}</ol>`);
  }
  return {MAX_RECORDS, MAX_TEXT, MAX_BYTES, records, markdown, csv, printHtml};
})();
