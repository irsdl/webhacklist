// Corpus/cache invariants: invoked only inside container-build.py.
import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {execFileSync} from "node:child_process";
const policy=new URL("official-context.json",import.meta.url), catalogue=new URL("data/catalogue.json",import.meta.url);
const original=await readFile(policy), before=await readFile(catalogue), parsed=JSON.parse(before);
const shardState=value=>value.years.map(year=>[year.id,year.count,year.winners,year.version,year.sha256,year.bytes,year.sources]);
try {
  const changed=JSON.parse(original);changed.collections[0].organiser+=" (synthetic cache check)";
  await writeFile(policy,JSON.stringify(changed));
  execFileSync(process.execPath,["website/build-data.mjs"],{stdio:"pipe"});
  const after=JSON.parse(await readFile(catalogue));
  assert.equal(after.schema,1,"extension stays additive for existing clients");
  assert.notEqual(after.version,parsed.version,"changed public context invalidates the catalogue");
  assert.deepEqual(shardState(after),shardState(parsed),"summary-only context leaves research/source shards and standing unchanged");
} finally {
  await writeFile(policy,original);
  execFileSync(process.execPath,["website/build-data.mjs"],{stdio:"pipe"});
}
assert.deepEqual(await readFile(catalogue),before,"restoring input reproduces identical catalogue bytes");
console.log("Companion build: additive schema, per-file versions, membership/standing and deterministic output pass");
