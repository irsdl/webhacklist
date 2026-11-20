// Synthetic policy fixtures: no third-party source processing on the host.
import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {parserContext} from "./build-data.mjs";
import {validateLifecycle, validateResearchContext, resultsImportNotBefore} from "./publishing-policy.mjs";

const app = await readFile(new URL("app.js", import.meta.url), "utf8");
const discovery = await readFile(new URL("discovery.js", import.meta.url), "utf8");
const year = {id:"2026-ai", label:"2026 AI", status:"preliminary", ranked:false, notice:"As of 18 November 2026: incomplete, unranked, not community-vetted, subject to change.", lifecycle:{stage:"preliminary",checked:"2026-11-20",freezeAt:"2027-01-01T00:00:00Z",destination:"https://portswigger.net/research/top-10-web-hacking-techniques",importDelayDays:14,resultsAnnouncedAt:null,resultsAnnouncement:null,resultsImportedAt:null,nomination:null,voting:null}};
const context = parserContext(app, discovery, {years:[year,{id:"2025",status:"final",ranked:true}]}, {}, {});
const run = code => vm.runInContext(code, context);
const plain = value => JSON.parse(JSON.stringify(value));
const original = "https://research.example/article";
const snapshot = {url:`https://web.archive.org/web/20241101000000/${original}`,verified:true,checked:"2026-11-20",evidence:"Identity reviewed in isolated source reader"};

test("publisher routing distinguishes unknown, live, confirmed dead, and verified snapshots", () => {
  for (const availability of [undefined,"unverified","live"]) {
    context.item = {originalUrl:original,health:"dead",publication:{availability,snapshot}};
    assert.equal(run("readingDestination(item).url"), original);
    assert.equal(run("readingDestination(item).label"), "Read article");
  }
  for (const availability of ["dead","replaced"]) {
    context.item = {originalUrl:original,publication:{availability,snapshot}};
    assert.equal(run("readingDestination(item).url"), snapshot.url);
    assert.equal(run("readingDestination(item).label"), "Read article — Web Archive");
    for (const invalid of [undefined,{...snapshot,verified:false},{...snapshot,url:"https://attacker.example/"},{...snapshot,checked:""}]) {
      context.item.publication.snapshot = invalid;
      assert.equal(run("readingDestination(item).url"), "");
      assert.match(run("readingDestination(item).message"), /preserved copies/);
    }
  }
  context.item = {originalUrl:"javascript:alert(1)"};
  assert.equal(run("readingDestination(item).url"), "");
  for (const stamp of ["20240101/","20240101000000id_/",""]) {
    context.item = {originalUrl:`https://web.archive.org/web/${stamp}${original}`};
    assert.equal(run("readingDestination(item).url"),original,"An unreviewed replay citation retains identity while the primary action tries the publisher");
  }
});

test("repository links use actual archive paths, branch, and URL encoding", () => {
  context.file = "archived-references/md/2025/research.md";
  assert.equal(run("repositoryFileUrl(file)"), "https://github.com/irsdl/webhacklist/blob/master/archived-references/md/2025/research.md");
  context.file = "archived-references/pdf/2025/research.pdf";
  assert.match(run("repoCopyControl(file, 'Copy Repo PDF Link')"), /data-copy-repo="https:\/\/github.com\/irsdl\/webhacklist\/blob\/master\/archived-references\/pdf/);
  for (const file of ["",undefined,"../secret.md","archived-references/md/2025/../../secret.md","https://example.test/file.pdf"]) {
    context.file = file;
    assert.equal(run("repoCopyControl(file, 'Copy Repo MD Link')"), "");
  }
});

test("exclusion membership is explicit, survives compaction, and preserves historical rank", () => {
  context.reviewed = {year:"2025",citation:original,stage:"before-nominations",reason:"conflict-of-interest",explanation:"Excluded before nominations",evidence:"https://portswigger.net/research/top-10-web-hacking-techniques-of-2025",checked:"2026-11-20"};
  run("RESEARCH_CONTEXT = {publications:[],exclusions:[reviewed]}");
  context.markdown = `## Top 10\n- [Winner](https://research.example/winner) **#1**\n## Missed from the original list\n- [Held](${original})\n- [Unreviewed](https://research.example/unreviewed) **(excluded)**`;
  const items = plain(run(`parseYearMarkdown(markdown, '2025', new Map()).map(item => expandArchiveItem(compactArchiveItem(item)))`));
  context.held = items[1];
  assert.equal(items[0].rank,1);
  assert.equal(items[1].rank,null);
  assert.equal(run("itemListMembership(held)"),"original");
  assert.equal(run("itemStandingLabel(held)"),"Held out — conflict of interest");
  assert.deepEqual(items[1].tags,["original-list"]);
  assert.equal(items[2].excluded,false);
});

test("annual participation and freeze states use explicit metadata and an injectable time", () => {
  validateLifecycle(year,{years:[year]});
  for (const [stage,round,label] of [["preliminary",null,null],["nominations-open","nomination","Nominate research"],["voting-open","voting","Vote on research"],["frozen",null,null]]) {
    context.record = structuredClone(year);
    context.record.lifecycle.stage = stage;
    if (round) context.record.lifecycle[round] = {url:`https://portswigger.net/research/2026-${round}`,checked:"2026-12-20",verifiedOpen:true,evidence:"Reviewed open round"};
    validateLifecycle(context.record,{years:[context.record]});
    run("YEAR_RECORDS = [record]");
    const notice = run("preliminaryNotice('2026-ai', new Date('2026-12-21T00:00:00Z'))");
    assert.match(notice,new RegExp(`data-collection-stage="${stage}"`));
    assert.equal(notice.includes('class="participation-action"'),Boolean(label));
    if (label) assert.ok(notice.includes(label));
    const frozen = run("preliminaryNotice('2026-ai', new Date('2027-01-01T00:00:00Z'))");
    assert.match(frozen,/frozen snapshot/);
    assert.match(frozen,/1 January 2027/);
    assert.doesNotMatch(frozen,/planning estimate|mid-January/);
    assert.match(frozen,/two weeks after PortSwigger announces the winners/);
    assert.equal(frozen.includes('class="participation-action"'),Boolean(label),"Verified official participation remains available while local updates are frozen");
  }
  context.record = structuredClone(year);
  run("YEAR_RECORDS = [record]");
  assert.equal(run("collectionStage(record, new Date('2026-12-31T23:59:59Z'))"),"preliminary");
  assert.equal(run("collectionStage(record, new Date('2027-01-01T00:00:00Z'))"),"frozen");
  assert.equal(run("collectionStage(record, new Date('2027-03-31T23:59:59Z'))"),"frozen","Only verified official results end the waiting phase");
  context.record.lifecycle.stage = "results-announced";
  context.record.lifecycle.resultsAnnouncedAt = "2027-01-15T10:00:00Z";
  context.record.lifecycle.resultsAnnouncement = "https://portswigger.net/research/top-10-web-hacking-techniques-of-2026";
  const duringHold = {now:new Date("2027-01-29T09:59:59Z")};
  validateLifecycle(context.record,{years:[context.record]},duringHold);
  assert.equal(resultsImportNotBefore(context.record.lifecycle),"2027-01-29T10:00:00.000Z");
  assert.equal(run("officialImportNotBefore(record)"),"2027-01-29T10:00:00.000Z");
  const waiting = run("preliminaryNotice('2026-ai', new Date('2027-01-29T09:59:59Z'))");
  assert.match(waiting,/data-collection-stage="results-announced"/);
  assert.match(waiting,/frozen snapshot/);
  assert.match(waiting,/no earlier than 29 January 2027/);
  assert.doesNotMatch(waiting,/Official 2026 collection/);
  assert.match(run("preliminaryNotice('2026-ai', new Date('2027-01-29T10:00:00Z'))"),/waiting period has ended; the results import is pending/);
  const final = {...structuredClone(context.record),id:"2026",status:"final",ranked:true};
  assert.throws(()=>validateLifecycle({id:"2026",status:"final",ranked:true},{years:[],delayedOfficialImports:["2026"]}),/delayed-import lifecycle evidence/);
  final.lifecycle.stage = "official-results";
  final.lifecycle.officialCollection = "2026";
  final.lifecycle.resultsImportedAt = "2027-01-29T09:59:59Z";
  assert.throws(()=>validateLifecycle(final,{years:[final]},duringHold),/fourteen days/);
  final.lifecycle.resultsImportedAt = "2027-01-29T10:00:00Z";
  const afterHold = {now:new Date("2027-01-29T10:00:00Z")};
  validateLifecycle(final,{years:[final]},afterHold);
  validateLifecycle({...final,lifecycle:{...final.lifecycle,resultsImportedAt:resultsImportNotBefore(final.lifecycle)}},{years:[final]},afterHold);
  assert.throws(()=>validateLifecycle(final,{years:[]},afterHold),/final annual collection/);
  assert.throws(()=>validateLifecycle({...final,lifecycle:{...final.lifecycle,resultsAnnouncedAt:null}},{years:[final]},afterHold),/timestamp/);
  assert.throws(()=>validateLifecycle({...final,lifecycle:{...final.lifecycle,importDelayDays:0}},{years:[final]},afterHold),/fourteen-day/);

});

test("maintained publication metadata requires separate original and verified snapshot provenance", () => {
  const publication = {citation:original,originalUrl:original,availability:"dead",checked:"2026-11-20",evidence:"Confirmed removed",snapshot};
  validateResearchContext({schema:1,publications:[publication],exclusions:[]},{years:[]});
  assert.throws(()=>validateResearchContext({schema:1,publications:[{...publication,snapshot:{...snapshot,url:"https://web.archive.org/web/20241101000000/https://other.example/"}}],exclusions:[]},{years:[]}),/identity/);
  assert.throws(()=>validateLifecycle({...year,lifecycle:{...year.lifecycle,stage:"voting-open"}},{years:[year]}),/no verified/);
});
