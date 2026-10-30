// Publishing contracts shared by both production builds. These validate reviewed
// relationships; they do not infer that two pieces of research are duplicates.
import assert from "node:assert/strict";

export function assertWinnerPriority({ byStanding, byRankThenTitle, investigationFeatured }) {
  const records = [
    { id: "external", title: "A", section: "other", archived: false },
    { id: "nominee", title: "B", section: "other", archived: true },
    { id: "last", title: "C", section: "winner", rank: 10, archived: true },
    { id: "first", title: "D", section: "winner", rank: 1, archived: false }
  ];
  assert.deepEqual([...records].sort(byStanding).map(item => item.id),
    ["first", "last", "nominee", "external"], "Winner standing and rank must precede archive availability");
  assert.deepEqual(records.filter(item => item.section === "winner").sort(byRankThenTitle).map(item => item.rank),
    [1, 10], "Missing local copies must not change winner rank order");
  for (const item of records) {
    assert.equal(Boolean(investigationFeatured(item)), item.section === "winner" || item.archived,
      "Every winner belongs in the main board even without a local copy");
  }
}

export function assertNominationRelationships(collections, decisions, normalize) {
  assert.ok(Array.isArray(decisions), "repeatedNominations policy must be an array");
  const expected = new Map();
  for (const decision of decisions) {
    const collection = collections.find(entry => entry.record.id === decision.collection);
    assert.ok(collection?.record.status === "final" && collection.record.ranked === true,
      "Repeated nominations must belong to a finalized ranked collection");
    assert.ok(Array.isArray(decision.urls) && decision.urls.length >= 2,
      "Repeated nominations need at least two citation URLs");
    assert.ok(typeof decision.reason === "string" && decision.reason.trim()
      && Array.isArray(decision.evidence) && decision.evidence.length,
      "Repeated nominations need a reason and evidence");
    const members = decision.urls.map(url => {
      const matches = collection.items.filter(item => normalize(item.identityUrl || item.originalUrl) === normalize(url));
      assert.equal(matches.length, 1, "Each repeated nomination must resolve to exactly one active story");
      return matches[0];
    });
    assert.equal(new Set(members.map(item => item.id)).size, members.length,
      "Repeated nominations must retain distinct story IDs");
    for (const item of members) {
      const key = `${decision.collection}/${item.id}`;
      assert.ok(!expected.has(key), "Repeated-nomination decisions must not overlap");
      expected.set(key, members.filter(other => other !== item).map(other => ({
        id: other.id, title: other.title, reason: decision.reason
      })));
    }
  }
  for (const collection of collections) {
    for (const item of collection.items) {
      const links = item.repeatedNominations || [];
      const required = expected.get(`${collection.record.id}/${item.id}`) || [];
      assert.deepEqual(links, required,
        `Reviewed repeated-nomination links must survive generation, with reciprocal IDs and explanations: ${item.id}`);
    }
  }
}
