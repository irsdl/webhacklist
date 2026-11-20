// Synthetic policy fixtures only: no third-party archive inputs are read here.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {parserContext} from "./build-data.mjs";

const [app, discovery] = await Promise.all(["app.js", "discovery.js"].map(name => readFile(new URL(name, import.meta.url), "utf8")));
const years = [2026, 2027, 2031].flatMap(year => [
  {id:String(year), label:String(year), status:"final", ranked:true},
  {id:`${year}-ai`, label:`${year} AI`, status:"preliminary", ranked:false}
]);
const context = parserContext(app, discovery, {years}, {urls:{}}, {});
context.URLSearchParams = URLSearchParams;
const run = source => vm.runInContext(source, context);
const plain = value => JSON.parse(JSON.stringify(value));
run(`globalThis.fixture = [
  "## Top 10", "- **#1** [Winner](https://example.test/winner)",
  "## Other nominations", "- [Nominee](https://example.test/nominee)",
  "- [Held](https://example.test/held) **(held out of vote)**",
  "## Missed from the original list", "- [Addition](https://example.test/addition)"
].join("\\n");`);
for (const year of [2026, 2027, 2031]) {
  run(`RESEARCH_CONTEXT = {publications:[],exclusions:[{year:"${year}",citation:"https://example.test/held",reason:"conflict-of-interest",stage:"before-nominations",explanation:"Before nomination fixture"}]}`);
  const final = plain(run(`parseYearMarkdown(fixture, "${year}", new Map()).map(item => ({
    membership:itemListMembership(item), standing:itemStanding(item), tags:item.tags,
    label:listMembershipLabel(item), id:item.id
  }))`));
  assert.deepEqual(final.map(item => item.membership), ["original", "original", "original", "addition"]);
  assert.deepEqual(final.map(item => item.standing), ["winner", "nominee", "held", "addition"]);
  assert.deepEqual(final.map(item => item.tags), [["original-list"], ["original-list"], ["original-list"], ["later-addition"]]);
  const preliminary = plain(run(`parseYearMarkdown(fixture, "${year}-ai", new Map()).map(item => ({
    membership:itemListMembership(item), tags:item.tags, standing:itemStanding(item)
  }))`));
  assert.ok(preliminary.every(item => item.membership === "" && item.standing === "preliminary"));
  assert.ok(preliminary.every(item => item.tags.length === 0));
  assert.equal(run(`listMembershipMark({preliminary:true})`), "");
  assert.equal(run(`listMembershipLabel({preliminary:true}, ", ")`), "");
  // A collection's publication status decides membership, even if its file
  // keeps its old -ai suffix during an editorial transition.
  assert.equal(run(`itemListMembership(parseYearMarkdown(fixture, "${year}-ai", new Map(), {status:"final", ranked:true})[0])`), "original");
}
assert.deepEqual(plain(run(`withListMembershipTags({section:"missed"}, ["xss", "original-list", "awaiting-official-list", "xss"])`)), ["xss", "later-addition"]);
assert.deepEqual(plain(run(`withListMembershipTags({preliminary:true}, ["xss", "original-list", "later-addition", "awaiting-official-list"])`)), ["xss"], "Old cached membership tags are removed from preliminary records");
run(`state.items = parseYearMarkdown(fixture, "2027", new Map()).concat(parseYearMarkdown(fixture, "2027-ai", new Map()));`);
for (const [tag, expected] of [["original-list", 3], ["later-addition", 1], ["awaiting-official-list", 0]]) {
  assert.equal(run(`queryItems(state.items, "tag:${tag}").length`), expected);
}
for (const [listing, expected] of [["original", 3], ["addition", 1], ["all", 8]]) {
  run(`discoveryState.deskListing = "${listing}";`);
  assert.equal(run(`deskFilteredRecords().length`), expected);
  const url = run(`deskShareUrl()`);
  assert.equal(new URL(url).searchParams.get("listing"), listing === "all" ? null : listing);
  assert.equal(run(`deskRouteState(${JSON.stringify(new URL(url).search)}).deskListing`), listing);
}
assert.equal(run(`deskRouteState("?listing=invalid").deskListing`), "all");
assert.equal(run(`deskRouteState("?listing=pending").deskListing`), "all", "Retired links reset to all research");
assert.deepEqual(plain(run(`DESK_LISTING_OPTIONS.map(([value]) => value)`)), ["all", "original", "addition"]);
assert.equal(run(`deskRouteState("?listing=original&listing=addition").deskListing`), "all");
run(`discoveryState.deskListing = "original"; discoveryState.deskStanding = "winner";`);
assert.equal(run(`deskFilteredRecords().length`), 1);
run(`discoveryState.deskListing = "addition";`);
assert.equal(run(`deskFilteredRecords().length`), 0, "Membership combines with the existing selection filter");
assert.match(run(`deskBibliographySelection()`), /Original list membership: Later additions/);
console.log("List membership: winners, nominees, held entries, additions, future preliminary/final transitions, tags and shared filters pass");
