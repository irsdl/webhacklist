import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
const source = await readFile(new URL("shortlist.js", import.meta.url), "utf8");
const app = await readFile(new URL("app.js", import.meta.url), "utf8");
const context = vm.createContext({URL,TextEncoder});
vm.runInContext(source, context);
for (const name of ["normalizeUrl", "itemStanding", "itemStandingLabel"]) {
  const start = app.indexOf(`function ${name}(`), end = app.indexOf("\n}", start)+2;
  vm.runInContext(app.slice(start, end), context);
}
const lib = vm.runInContext("ShortlistBibliography", context);
const normalize = vm.runInContext("normalizeUrl", context), standing = vm.runInContext("itemStandingLabel", context);
const item = overrides => ({id:"story-a",year:"2024",title:"A paper",originalUrl:"https://example.test/paper",authors:["One","Two"],publisher:"Publisher",links:[],...overrides});
const rows = items => lib.records(items, normalize, standing);
function parseCsv(data) {
  const result = []; let row = [], cell = "", quoted = false;
  for (let i=0; i<data.length; i++) {
    const c = data[i];
    if (c === '"') { if (quoted && data[i+1] === '"') { cell+='"'; i++; } else quoted=!quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell=""; }
    else if (c === '\r' && data[i+1] === '\n' && !quoted) { row.push(cell); result.push(row); row=[]; cell=""; i++; }
    else cell+=c;
  }
  assert.equal(quoted,false); return result;
}
test("shared standings retain preliminary priority, winners, nominations, held-out and later additions", () => {
  const result=rows([item({id:"p",preliminary:true,section:"winner",rank:1}),item({id:"w",section:"winner",rank:2}),item({id:"n"}),item({id:"h",excluded:true}),item({id:"a",section:"missed"})]);
  assert.deepEqual(Array.from(result,row=>row.standing),["Provisional · unranked · subject to change","Official Top 10 · #2","Official nomination","Held out — conflict of interest","Additional research"]);
});
test("normalized story dedup preserves deterministic input order and distinct contributions/collections sharing a document", () => {
  const a=item({identityUrl:"https://EXAMPLE.test/work/#a"}), duplicate=item({identityUrl:"https://example.test/work"});
  const result=rows([a,duplicate,item({id:"story-b",identityUrl:a.identityUrl}),item({year:"2023",identityUrl:a.identityUrl})]);
  assert.equal(result.length,3); assert.deepEqual(Array.from(result,row=>row.id),["story-a","story-b","story-a"]);
});
test("changed main source retains main label and individual source credits, all links, unknown credits honestly", () => {
  const result=rows([item({identityUrl:"https://example.test/talk",links:[{url:"https://example.test/paper",label:"Whitepaper",details:{authors:["Paper One","Paper Two"],publisher:"Paper press"}},{url:"https://example.test/talk",label:"Talk",details:{authors:["Speaker"],publisher:"Conference"}},{url:"https://example.test/no-credit",label:"Companion",details:{}}]})]);
  assert.equal(result[0].links[0].label,"Whitepaper"); assert.equal(result[0].links.length,3);
  const output=lib.markdown(result,"saved");
  assert.match(output,/Paper One; Paper Two/); assert.match(output,/Speaker/); assert.match(output,/Author not stated; publisher \/ host: Not stated/); assert.doesNotMatch(output,/Original citation/);
});
test("Markdown and print escape active markup, link delimiters, metadata and newlines", () => {
  const result=rows([item({title:'<img onerror=x> [title]*\n#heading',authors:['A [B]','C\nD'],links:[{url:'https://example.test/a?x=<z>&y=1',label:'[bad]*',details:{}}]})]);
  const md=lib.markdown(result,'q: <script>\n#bad');
  assert.ok(md.includes('&lt;img')); assert.ok(md.includes('\\[title\\]\\*')); assert.ok(md.includes('%3Cz%3E')); assert.doesNotMatch(md,/\n#heading|<script>/);
  const html=lib.printHtml(result,'<script>');
  assert.ok(html.includes('&lt;script&gt;')); assert.doesNotMatch(html,/<img|<script>/);
});
test("CSV round trips quotes/newlines and protects spreadsheet formula fields after whitespace", () => {
  for (const title of [' =SUM(1,2)','+evil','@evil','-evil','\tformula','\nformula','A "quoted", title\nsecond line']) {
    const result=rows([item({title,authors:['One "quote"','Two\nlines']})]);
    const csv=parseCsv(lib.csv(result,'=filters'));
    assert.equal(csv.length,2); assert.equal(csv[0].length,15); assert.equal(csv[1].length,15);
    assert.equal(csv[1][0],/^(?:\s*[=+@-]|[\t\r\n])/.test(title)?"'"+title:title);
    assert.equal(csv[1][1],'One "quote"\nTwo\nlines'); assert.equal(csv[1][7],"'=filters"); assert.equal(csv[1][9],"1");
  }
});
test("bounds reject oversized sets, fields, output and unsafe URLs rather than truncating", () => {
  assert.throws(()=>rows(Array(5001).fill(item())),/5,000/);
  assert.throws(()=>rows([item({title:"x".repeat(20001)})]),/20,000/);
  for(const address of ["javascript:alert(1)","https://u:p@example.test/a","file:///secret"]) assert.throws(()=>rows([item({originalUrl:address})]));
  const result=rows(Array.from({length:500},(_,i)=>item({id:String(i),title:"x".repeat(20000)})));
  assert.throws(()=>lib.markdown(result,"all"),/8 MiB/);
});
test("official context resolves by row collection, keeps researcher columns intact and escapes all output formats", () => {
  const items=[item({year:"2025"}),item({id:"second",year:"2024"})];
  const result=lib.records(items,normalize,standing,year=>({organiser:year==="2025"?' =formula <b>':'Historical organiser',checked:"2026-11-18",links:[{label:`Official ${year} [context]`,url:`https://portswigger.net/research/${year}`}]}));
  assert.equal(result[0].links.length,1);assert.equal(result[0].links[0].url,items[0].originalUrl);
  const parsed=parseCsv(lib.csv(result,"saved"));
  assert.equal(parsed[1][5],items[0].originalUrl);assert.equal(parsed[1][10],"story-a");
  assert.equal(parsed[1][11],"' =formula <b>");assert.match(parsed[1][12],/2025/);assert.match(parsed[2][12],/2024/);
  const markdown=lib.markdown(result,"saved"),print=lib.printHtml(result,"saved");
  assert.match(markdown,/Official context/);assert.match(markdown,/&lt;b&gt;/);assert.doesNotMatch(print,/<b>/);
  assert.match(print,/Official 2024/);assert.match(print,/&lt;b&gt;/);
});
