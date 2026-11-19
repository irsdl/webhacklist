import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {normalizeOfficialSources, officialUrl, OFFICIAL_HUB} from "./official-sources.mjs";
import {parserContext} from "./build-data.mjs";
const app = await readFile(new URL("app.js",import.meta.url),"utf8");
const discovery = await readFile(new URL("discovery.js",import.meta.url),"utf8");
const registry = {years:[{id:"2025",label:"2025",status:"final"},{id:"2013",label:"2013",status:"final"},{id:"2026-ai",status:"preliminary"}]};
const sources = {entries:[{year:"2025",kind:"top10",url:"https://portswigger.net/research/result"},{year:"2013",kind:"nominees-and-top10",url:"https://web.archive.org/web/20160312115418/https://www.whitehatsec.com/blog/results/",original_url:"https://www.whitehatsec.com/blog/results/"}]};
const input = () => ({schema:1,hub:OFFICIAL_HUB,collections:[{id:"2025",organiser:"PortSwigger Research",checked:"2026-11-18",sources:[{kind:"top10",mode:"publication",evidence:"Primary results page checked."}]},{id:"2013",organiser:"WhiteHat Security",checked:"2026-11-18",sources:[{kind:"nominees-and-top10",mode:"replay",evidence:"Preserved combined announcement checked."}]}]});
const normalize = (reviewed = input(), index = sources) => normalizeOfficialSources(reviewed,index,registry,{repoDir:"/synthetic",exists:async file => file.endsWith("2025-top10.pdf")});
test("modern, combined historical, preliminary and missing snapshots normalize without capture notes",async () => {
  const output = await normalize();
  assert.equal(output.hub,OFFICIAL_HUB); assert.equal(output.contexts["2026-ai"],undefined);
  assert.equal(output.contexts["2025"].links[0].snapshot,"original-listings/2025-top10.pdf");
  assert.equal(output.contexts["2013"].links.length,1); assert.equal(output.contexts["2013"].links[0].snapshot,undefined);
  assert.doesNotMatch(JSON.stringify(output),/evidence|expect|note|synthetic/);
  const reviewed=input();reviewed.collections[1].sources[0].availability="unverified";
  assert.equal((await normalize(reviewed)).contexts["2013"].links[0].availability,"unverified");
  reviewed.collections[1].sources[0].availability="definitely-working";
  await assert.rejects(normalize(reviewed));
});
test("reviewed input rejects duplicate/unknown/unresolved selectors, schemas, markup, invalid dates and unreviewed participation",async () => {
  const changes = [x=>x.schema=2,x=>x.collections.push(x.collections[0]),x=>x.collections[0].id="2099",x=>x.collections[0].sources.push(x.collections[0].sources[0]),x=>x.collections[0].sources[0].kind="voting",x=>x.collections[0].organiser="<img onerror=x>",x=>x.collections[0].checked="2026-02-30",x=>x.collections[0].checked="bad",x=>x.collections[0].sources[0].mode="replay",x=>x.collections[0].participation={status:"open"},x=>x.collections[0].sources[0].evidence="",x=>x.collections[0].sources[0].kind="__proto__"];
  for (const change of changes) {const value=input();change(value);await assert.rejects(normalize(value));}
  await assert.rejects(normalize(input(),{entries:[...sources.entries,sources.entries[0]]}));
});
test("official URLs reject executable, credential, private and nested-replay destinations",() => {
  for (const value of ["javascript:alert(1)","https://u:p@portswigger.net/a","http://127.0.0.1/a","http://169.254.169.254/latest","https://portswigger.net:8080/a","https://portswigger.net.evil.test/a","https://web.archive.org/web/20160312115418/http://localhost/a","https://web.archive.org/web/20160312115418/https://web.archive.org/web/20160312115418/https://portswigger.net/a"]) assert.throws(()=>officialUrl(value));
});
test("migrated publication keeps HTTPS primary and labels its earlier URL separately",async () => {
  const value=input();value.collections=value.collections.slice(0,1);value.collections[0].sources[0].mode="migrated";
  const result=await normalize(value,{entries:[{year:"2025",kind:"top10",url:"https://blog.jeremiahgrossman.com/results",original_url:"http://jeremiahgrossman.blogspot.com/results"}]});
  assert.equal(result.contexts["2025"].links[0].mode,"migrated");
});
test("optional runtime context fails safely across cached versions without affecting research decoding",async () => {
  const output=await normalize();const context=parserContext(app,discovery,registry,{},{});
  context.__official=output.contexts["2025"];
  const run=source=>vm.runInContext(source,context);
  assert.equal(run('officialContextMarkup("2025")'),"");
  run('YEAR_RECORDS[0].officialContext=__official');
  assert.match(run('officialContextMarkup("2025",true)'),/Official results/);
  for (const mutation of ['YEAR_RECORDS[0].officialContext={schema:2}','YEAR_RECORDS[0].officialContext={...__official,links:[{kind:"top10",url:"javascript:alert(1)",mode:"publication"}]}','YEAR_RECORDS[0].officialContext={...__official,organiser:"<b>bad</b>"}']) {
    run(mutation); assert.equal(run('officialContextMarkup("2025")'),""); assert.match(run('officialContextMarkup("2025",true)'),/Official Top 10 process/); assert.doesNotMatch(run('officialContextMarkup("2025",true)'),/javascript|<b>|undefined/);
    assert.equal(run('expandArchiveItem({title:"Available record",links:[]}).title'),"Available record");
  }
  assert.equal(run("OFFICIAL_HUB"),OFFICIAL_HUB);
  context.__historical=output.contexts["2013"];
  run('YEAR_RECORDS[1].officialContext=__historical');
  assert.equal(run('annualPdfPath("2013")'),"","reviewed missing snapshot is not advertised or routed");
  run('delete YEAR_RECORDS[1].officialContext');
  assert.equal(run('annualPdfPath("2013")'),"original-listings/2013-nominees-and-top10.pdf","older catalogue retains legacy combined routing");
  assert.ok(app.includes('shard.version !== record.version'),"required shard mismatch rejection retained");
  let domReads=0;context.document={querySelector:()=>{domReads++;return {innerHTML:"active Desk context"};}};
  run('state.view="desk"; renderTerminal()');
  assert.equal(domReads,0,"late terminal completion cannot overwrite another view's context");
});
test("historical participation remains neutral and unsupported deadlines cannot enable a live call",async () => {
  const context=parserContext(app,discovery,registry,{},{});context.__official=(await normalize()).contexts["2025"];
  vm.runInContext('YEAR_RECORDS[0].officialContext=__official',context);
  const markup=vm.runInContext('officialContextMarkup("2025",true)',context);
  assert.doesNotMatch(markup,/Nominations open|Vote now|Nominate now/);
  for (const deadline of ["2026-01-01T00:00:00Z","2026-11-18T00:00:00Z","2027-01-01T00:00:00Z",null,"bad"]) {
    const value=input();value.collections[0].participation={status:"open",deadline};
    await assert.rejects(normalize(value));
  }
});
