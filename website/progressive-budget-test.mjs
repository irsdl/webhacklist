// Corpus checks run only inside the approved offline build runner.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {gzipSync} from "node:zlib";
const body = await readFile(new URL("data/catalogue.json",import.meta.url));
const catalogue = JSON.parse(body);
assert.ok(body.length <= 32000, `Catalogue ${body.length} exceeds 32,000 bytes`);
for (const [field,totalLimit] of [["file",5000000],["sources",4000000]]) {
  let total = 0;
  for (const year of catalogue.years) {
    const file = field === "file" ? year.file : year.sources.file;
    const shard = await readFile(new URL(file,import.meta.url)); total += shard.length;
    assert.ok(shard.length <= 1500000, `${file}: raw budget exceeded`);
    assert.ok(gzipSync(shard).length <= 300000, `${file}: gzip budget exceeded`);
  }
  assert.ok(total <= totalLimit, `${field}: total raw budget exceeded (${total})`);
  console.log(`Progressive budget ${field}: ${total} raw bytes`);
}
console.log(`Catalogue budget: ${body.length} / 32000 bytes`);
