// A compatibility design fixture, not a production matching/migration service.
import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {registerStoryIdentity} from "./story-identity.mjs";
import {parserContext} from "./build-data.mjs";
test("future matched, unmatched and ambiguous appearances preserve provisional navigation and saved-state identities",async () => {
  const registry={schema:1,collections:{}};
  const old=["matched","unmatched","ambiguous"].map(name=>({year:"2026-ai",title:name,identityUrl:`https://example.test/${name}`,originalUrl:`https://example.test/${name}`,section:"candidate",preliminary:true,rank:null,provenance:"AI-collected",links:[],mdPath:`archived-references/md/2026-ai/${name}.md`,pdfPath:`archived-references/pdf/2026-ai/${name}.pdf`,id:registerStoryIdentity(registry,"2026-ai",`https://example.test/${name}`)}));
  const originals=structuredClone(old);
  const context=parserContext(await readFile(new URL("app.js",import.meta.url),"utf8"),await readFile(new URL("discovery.js",import.meta.url),"utf8"),{years:[{id:"2026-ai",label:"2026 AI",status:"preliminary"},{id:"2026",label:"2026",status:"final"}]},{},{});
  context.URLSearchParams=URLSearchParams;context.TextEncoder=TextEncoder;
  vm.runInContext(await readFile(new URL("saved-state.js",import.meta.url),"utf8"),context);
  const run=code=>vm.runInContext(code,context);context.__old=old;
  run('state.items=__old; loadedCollections.add("2026-ai"); loadedCollections.add("2026"); state.view="desk"');
  const shares=old.map(item=>{context.__item=item;return ["artifact","reader","pdf"].map(format=>run(`documentShareUrl(__item,"${format}")`));});
  // Explicit reviewed identity, not title-based or topic-based matching.
  const official={...old[0],year:"2026",preliminary:false,section:"other",provenance:"Official nomination",id:registerStoryIdentity(registry,"2026",old[0].identityUrl)};
  const reviewedRelationship={provisional:old[0].id,official:official.id,evidence:"Synthetic official nomination evidence"};
  context.__official=official;run('state.items=[...__old,__official]');
  assert.notEqual(official.id,old[0].id);assert.equal(official.rank,null,"nomination alone is not an award");
  assert.equal(reviewedRelationship.provisional,old[0].id);
  for (let index=0;index<old.length;index++) {
    context.__item=old[index];
    assert.equal((await run('ensureItemLoaded(__item.id)')).id,old[index].id);
    assert.deepEqual(["artifact","reader","pdf"].map(format=>run(`documentShareUrl(__item,"${format}")`)),shares[index]);
  }
  assert.deepEqual(old,originals,"all provisional records and discovery history survive");
  assert.equal(registry.collections["2026"][old[1].identityUrl],undefined,"unmatched work remains provisional");
  assert.equal(registry.collections["2026"][old[2].identityUrl],undefined,"ambiguous work waits for evidence");
  const lib=run("SavedStateBackup");
  const backup=lib.serialize([old[0].identityUrl],[old[1].identityUrl],[old[2].identityUrl],[old[0].identityUrl]);
  const restored=lib.parse(backup);
  assert.ok(restored.read.has(old[0].identityUrl));assert.ok(restored.favourites.has(old[1].identityUrl));
  assert.ok(restored.unread.has(old[2].identityUrl));assert.ok(restored.unfavourited.has(old[0].identityUrl));
  context.__read=[...restored.read];context.__favourites=[...restored.favourites];
  run('state.readKeys=new Set(__read); state.favouriteKeys=new Set(__favourites)');
  assert.equal(run('applyStoredState(__official).read'),true,"a matched new appearance keeps the reviewed original identity");
  assert.equal(run('applyStoredState(__official).favourite'),false,"an explicit removal remains removed");
  official.section="winner";official.rank=2;
  assert.equal(old[0].rank,null,"later final ranking cannot retroactively rank the provisional appearance");
});
