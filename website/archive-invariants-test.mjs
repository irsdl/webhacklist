import assert from "node:assert/strict";
import test from "node:test";
import { assertNominationRelationships, assertWinnerPriority } from "./archive-invariants.mjs";

const availability = (a, b) => Number(b.archived) - Number(a.archived);
const standing = {
  byRankThenTitle: (a, b) => (a.rank || 999) - (b.rank || 999) || availability(a, b) || a.title.localeCompare(b.title),
  investigationFeatured: item => item.section === "winner" || item.archived
};
standing.byStanding = (a, b) => Number(b.section === "winner") - Number(a.section === "winner") || standing.byRankThenTitle(a, b);

test("publishing rejects the original availability-first sort and board demotion", () => {
  assert.doesNotThrow(() => assertWinnerPriority(standing));
  assert.throws(() => assertWinnerPriority({ ...standing, byStanding: (a, b) => availability(a, b) || standing.byStanding(a, b) }), /standing and rank/);
  assert.throws(() => assertWinnerPriority({ ...standing, byRankThenTitle: (a, b) => availability(a, b) || standing.byRankThenTitle(a, b) }), /rank order/);
  assert.throws(() => assertWinnerPriority({ ...standing, investigationFeatured: item => item.archived }), /Every winner/);
});

function fixture() {
  const a = { id: "a", title: "Article", originalUrl: "https://example.test/article" };
  const b = { id: "b", title: "Talk", identityUrl: "https://example.test/talk", originalUrl: "https://example.test/paper.pdf" };
  a.repeatedNominations = [{ id: "b", title: b.title, reason: "Same research in the original round" }];
  b.repeatedNominations = [{ id: "a", title: a.title, reason: "Same research in the original round" }];
  return {
    collections: [{ record: { id: "2015", status: "final", ranked: true }, items: [a, b] }],
    decisions: [{ collection: "2015", urls: [a.originalUrl, b.identityUrl], reason: a.repeatedNominations[0].reason, evidence: ["https://example.test/announcement"] }]
  };
}
const normalize = value => new URL(value).href;
function check({ collections, decisions }) { assertNominationRelationships(collections, decisions, normalize); }

test("publishing retains reciprocal links and original identity when the main reading source changes", () => {
  assert.doesNotThrow(() => check(fixture()));
});

for (const [name, mutate] of [
  ["a dropped relationship", value => { delete value.collections[0].items[0].repeatedNominations; }],
  ["both relationships silently dropped", value => { for (const item of value.collections[0].items) delete item.repeatedNominations; }],
  ["an incorrect target ID", value => { value.collections[0].items[0].repeatedNominations[0].id = "missing"; }],
  ["an incorrect title", value => { value.collections[0].items[0].repeatedNominations[0].title = "Unrelated research"; }],
  ["a missing explanation", value => { delete value.collections[0].items[0].repeatedNominations[0].reason; }],
  ["an unreviewed automatic duplicate label", value => { value.decisions = []; }],
  ["an ambiguous citation", value => { value.collections[0].items.push({ ...value.collections[0].items[0], id: "distinct-technique" }); }],
  ["a missing nominated entry", value => { value.collections[0].items.pop(); }],
  ["overlapping decisions", value => { value.decisions.push(value.decisions[0]); }],
  ["missing evidence", value => { value.decisions[0].evidence = []; }],
  ["a preliminary collection", value => { value.collections[0].record.status = "preliminary"; }]
]) {
  test(`publishing rejects ${name}`, () => {
    const value = fixture();
    mutate(value);
    assert.throws(() => check(value));
  });
}
