// Run after data generation, inside the approved source-processing sandbox.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = name => readFile(new URL(name, root), "utf8");
const readme = await read("README.md");
const registry = JSON.parse(await read("website/archive-years.json"));
const catalogue = JSON.parse(await read("website/data/catalogue.json"));
const rows = new Map([...readme.matchAll(/^\| \[[^\]]+\]\(([^)]+)\.md\) \| (\d+) \| (\d+) \| (\d+) \|/gm)]
  .map(match => [match[1], match.slice(2).map(Number)]));
const totals = [0, 0, 0];
const finalized = registry.years.filter(year => year.status === "final");
assert.equal(rows.size, finalized.length, "README must list every finalized collection exactly once");
for (const year of finalized) {
  const shard = JSON.parse(await read(`website/data/collections/${year.id}.json`));
  const additions = shard.items.filter(item => item.section === "missed").length;
  const expected = [shard.items.length - additions, additions, shard.items.length];
  assert.deepEqual(rows.get(year.id), expected, `${year.id}: README nominations/additions/total drifted`);
  expected.forEach((count, index) => totals[index] += count);
}
const totalRow = readme.match(/^\| \*\*Total\*\* \| \*\*([\d,]+)\*\* \| \*\*([\d,]+)\*\* \| \*\*([\d,]+)\*\* \|/m);
assert.ok(totalRow, "README total row is missing");
assert.deepEqual(totalRow.slice(1).map(value => Number(value.replaceAll(",", ""))), totals);
const format = count => count.toLocaleString("en-US");
for (const phrase of [`**${format(totals[0])} original nomination records**`, `**${format(totals[2])} records**`]) {
  assert.ok(readme.includes(phrase), `README opening must contain ${phrase}`);
}
assert.match(readme, new RegExp(`\\*\\*${format(totals[1])} additional\\s+research records\\*\\*`));
assert.ok(readme.includes(`across ${finalized.length} finalized collections`));
const preliminary = catalogue.years.filter(year => year.status === "preliminary");
assert.equal(preliminary.length, 1, "Update README's preliminary summary when publishing another collection");
assert.ok(readme.includes(`A further **${format(preliminary[0].count)}** AI-collected leads`), "README preliminary lead count drifted");
assert.ok(readme.includes(`](${preliminary[0].id}.md)`), "README preliminary collection link drifted");
console.log(`README counts: ${finalized.length} finalized collections, ${totals.join(" / ")} records; ${preliminary[0].count} preliminary leads`);
