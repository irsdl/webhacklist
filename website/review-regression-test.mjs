// First-party functions with synthetic records; no source bytes or browser needed.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { registerStoryIdentity } from "./story-identity.mjs";

const app = (await readFile(new URL("./app.js", import.meta.url), "utf8")).replace(/\nloadArchive\(\);\s*$/, "\n");
const discovery = await readFile(new URL("./discovery.js", import.meta.url), "utf8");
const index = await readFile(new URL("./index.html", import.meta.url), "utf8");
const feedback = await readFile(new URL("../.github/ISSUE_TEMPLATE/05-website-feedback.yml", import.meta.url), "utf8");
function fixture({ storage = new Map(), denied = false } = {}) {
  const messages = [], notice = { hidden: true, textContent: "" };
  const toast = { classList: { add() {}, remove() {} }, set textContent(value) { messages.push(value); } };
  const context = vm.createContext({
    URL, URLSearchParams, console, CSS: { escape: value => value },
    location: { href: "https://example.test/#desk", hash: "#desk", search: "" },
    document: { querySelector: selector => selector === "#storage-status" ? notice : selector === "#toast" ? toast : null, querySelectorAll: () => [] },
    localStorage: { get length() { return storage.size; }, key: index => [...storage.keys()][index] ?? null, getItem: key => storage.get(key) ?? null, setItem: (key, value) => { if (denied) throw Error("denied"); storage.set(key, value); } },
    setTimeout: () => 1, clearTimeout() {}, __registry: { schema: 1, collections: {} },
    __register: registerStoryIdentity
  });
  vm.runInContext(discovery, context);
  vm.runInContext(app, context);
  const run = code => vm.runInContext(code, context);
  run('YEAR_FILES = ["2025"]; YEAR_RECORDS = [{ id: "2025", status: "final", notice: "Synthetic" }]; state.view = "evidence";');
  return { run, context, messages, notice, storage };
}

test("registered story links retain identity after insertion, reorder, title/rank and reader changes", async () => {
  const { run, context } = fixture();
  context.__before = "## Other nominations\n- [Record B](https://example.test/b)";
  context.__after = "## Top 10\n- **#1** [Record A](https://example.test/a)\n- **#2** [Renamed B](https://example.test/b)";
  run(`
    const parse = text => parseYearMarkdown(text, "2025", new Map(), yearRecordFor("2025"), {},
      (url, title) => __register(__registry, "2025", normalizeStoryCitation(url), { title }));
    const before = parse(__before)[0];
    globalThis.links = ["artifact", "reader", "pdf"].map(format => documentShareUrl({ ...before, sourceId: "companion" }, format));
    state.items = parse(__after);
    loadedCollections.add("2025");
  `);
  for (const link of context.links) {
    const url = new URL(link), id = url.searchParams.get("reader") || url.searchParams.get("pdf") || decodeURIComponent(url.hash.split("/")[1]);
    context.__id = id;
    assert.equal((await run("ensureItemLoaded(__id)")).title, "Renamed B");
    if (url.searchParams.has("reader") || url.searchParams.has("pdf")) assert.equal(url.searchParams.get("source"), "companion");
  }
  const id = run('state.items.find(item => item.title === "Renamed B").id');
  run('state.items = parse("- [Renamed B](https://example.test/b)\\n- [Record A](https://example.test/a)");');
  context.__id = id;
  assert.equal((await run("ensureItemLoaded(__id)")).title, "Renamed B", "reordering preserves identity");
  run('state.items = parse("- [Record A](https://example.test/a)\\n- [Renamed B](https://example.test/b)");');
  run('state.items = parse("- [Renamed B](https://example.test/b)");');
  assert.equal((await run("ensureItemLoaded(__id)")).title, "Renamed B", "deleting a preceding record preserves identity");
  run(`__registry.collections["2025"]["https://example.test/new-b"] = ${JSON.stringify(id)};`);
  context.__after = "- [Renamed B](https://example.test/new-b)";
  assert.equal(run("parse(__after)[0].id"), id, "explicit URL alias keeps the registered story ID");
  context.__group = { main: "other", sources: [{ id: "other", url: "https://example.test/fuller", label: "Fuller source" }] };
  assert.equal(run('parseYearMarkdown(__before, "2025", new Map(), yearRecordFor("2025"), {"2025.md:2": __group}, url => __register(__registry, "2025", normalizeStoryCitation(url)))[0].id'), id);
  assert.equal(await run('ensureItemLoaded("2025-0")'), null, "ambiguous positional links never open today's record at that position");
  assert.throws(() => registerStoryIdentity({ collections: {} }, "2025", "https://example.test/new", { checkOnly: true }), /Unregistered/);
});

test("shared-document stories and fragment-addressed articles retain distinct registered IDs", () => {
  const registry = { collections: {}, disambiguators: { "2006": { "https://example.test/shared.pdf": { "Story A": "a", "Story B": "b", "Renamed A": "a" } } } };
  const a = registerStoryIdentity(registry, "2006", "https://example.test/shared.pdf", { title: "Story A" });
  const b = registerStoryIdentity(registry, "2006", "https://example.test/shared.pdf", { title: "Story B" });
  assert.notEqual(a, b);
  assert.equal(registerStoryIdentity(registry, "2006", "https://example.test/shared.pdf", { title: "Renamed A" }), a);
  assert.throws(() => registerStoryIdentity(registry, "2006", "https://example.test/shared.pdf", { title: "Unknown" }), /explicit story disambiguator/);
  const { run } = fixture();
  assert.notEqual(run('normalizeStoryCitation("https://example.test/archive#article-a")'), run('normalizeStoryCitation("https://example.test/archive#article-b")'));
});

test("all five standings agree between detail labels, Desk filters and both discovery record views", () => {
  const { run } = fixture();
  run(`state.items = [
    { id: "winner", section: "winner", rank: 1 },
    { id: "nominee", section: "other" },
    { id: "addition", section: "missed" },
    { id: "held", section: "other", excluded: true },
    { id: "preliminary", section: "candidate", preliminary: true, rank: 1 }
  ].map(item => ({ ...item, title: item.id, year: "2025", topic: "Other", links: [] }));`);
  for (const [standing, label] of [["winner", "Top 10 rank #1"], ["nominee", "Other nomination"], ["addition", "Later archive addition"], ["held", "Held out of vote"], ["preliminary", "Preliminary"]]) {
    assert.equal(run(`discoveryState.deskStanding = "${standing}"; deskFilteredRecords().map(item => item.id).join(",")`), standing);
    assert.ok(run(`discoveryStatus(state.items.find(item => item.id === "${standing}"))`).startsWith(label));
    for (const mode of ["card", "row"]) assert.ok(run(`discoveryRecord(state.items.find(item => item.id === "${standing}"), "${mode}")`).includes(label));
  }
});

test("website feedback covers every visible archive view", () => {
  const labels = [...index.matchAll(/<button[^>]*data-view="[^"]+"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/g)].map(match => match[1].replaceAll("&amp;", "&"));
  assert.equal(labels.length, 9);
  const options = [...feedback.matchAll(/^        - (.+)$/gm)].map(match => match[1]);
  for (const label of labels) assert.ok(options.some(option => option === label || option.startsWith(`${label} (`)), `Missing feedback area: ${label}`);
});

test("winner standing and rank survive missing copies; external-only nominees stay last", () => {
  const { run } = fixture();
  run(`globalThis.ranked = [
    {id:"nominee", title:"A", section:"other", archived:true},
    {id:"four", title:"B", section:"winner", rank:4, archived:false},
    {id:"ten", title:"C", section:"winner", rank:10, archived:true},
    {id:"external", title:"D", section:"other", archived:false},
    {id:"one", title:"E", section:"winner", rank:1, archived:true}
  ];`);
  assert.equal(run('ranked.sort(byStanding).map(item => item.id).join(",")'), "one,four,ten,nominee,external");
  assert.equal(run('ranked.filter(investigationFeatured).map(item => item.id).join(",")'), "one,four,ten,nominee");
  assert.equal(run('ranked.filter(item => item.section === "winner").sort(byRankThenTitle).map(item => item.rank).join(",")'), "1,4,10");
});

test("reviewed repeated nominations preserve distinct IDs through shard roundtrip and show safe reciprocal links", () => {
  const { run, context } = fixture();
  context.__markdown = "## Other nominations\n- [Article](https://example.test/article)\n- [Talk](https://example.test/talk)";
  context.__groups = {
    "2025.md:2": { identity: "https://example.test/article", main: "a", sources: [{id:"a",url:"https://example.test/article",label:"Article"}],
      repeatedNominations: [{collection:"2025",identity:"https://example.test/talk",title:"Talk",reason:'Same work <script>bad()</script>'}] },
    "2025.md:3": { identity: "https://example.test/talk", main: "b", sources: [{id:"b",url:"https://example.test/talk",label:"Talk"}],
      repeatedNominations: [{collection:"2025",identity:"https://example.test/article",title:"Article",reason:"Same work"}] }
  };
  run(`globalThis.records = parseYearMarkdown(__markdown, "2025", new Map(), yearRecordFor("2025"), __groups,
    (url,title) => __register(__registry,"2025",normalizeStoryCitation(url),{title}));`);
  assert.equal(run('records[0].repeatedNominations[0].id === records[1].id'), true);
  assert.equal(run('records[1].repeatedNominations[0].id === records[0].id'), true);
  assert.equal(run('records[0].id !== records[1].id'), true);
  assert.equal(run('expandArchiveItem(compactArchiveItem(records[0]), "2025").repeatedNominations[0].id === records[1].id'), true);
  const markup = run('sourcePanelMarkup(records[0])');
  assert.match(markup, /data-repeated-nomination=/);
  assert.ok(!markup.includes("<script>"));
  run('for (const group of Object.values(__groups)) group.repeatedNominations[0].collection = "2024";');
  assert.equal(run('parseYearMarkdown(__markdown,"2025",new Map(),yearRecordFor("2025"),__groups)[0].repeatedNominations'), undefined);
});

for (const kind of ["Read", "Favourite"]) {
  for (const next of [true, false]) {
    test(`${kind} denied ${next ? "addition" : "removal"} stays session only, emits one message and reloads persisted state`, () => {
      const key = kind === "Read" ? "technique-vault-read-v1" : "websec-favourites-v1";
      const storage = new Map([[key, JSON.stringify(next ? [] : ["https://example.test/b"])]]);
      const { run, messages, notice } = fixture({ storage, denied: true });
      run('state.items = [applyStoredState({ id: "2025-r-b", originalUrl: "https://example.test/b", links: [] })];');
      const result = run(`set${kind}State(state.items[0], ${next})`);
      assert.equal(result.persisted, false);
      assert.equal(run(`state.items[0].${kind === "Read" ? "read" : "favourite"}`), next);
      assert.equal(messages.length, 1);
      assert.match(messages[0], /session only/);
      assert.equal(notice.hidden, false);
      const reload = fixture({ storage });
      assert.equal(reload.run(`load${kind === "Read" ? "Read" : "Favourite"}Keys().has("https://example.test/b")`), !next);
    });
  }
}

test("successful persistence clears only the recovered storage notice and survives reload", () => {
  const { run, storage, notice, context } = fixture({ denied: true });
  run('state.items = [applyStoredState({ id: "2025-r-b", originalUrl: "https://example.test/b", links: [] })]; setReadState(state.items[0], true); setFavouriteState(state.items[0], true);');
  context.localStorage.setItem = (key, value) => storage.set(key, value);
  assert.equal(run("setReadState(state.items[0], true).persisted"), true);
  assert.equal(notice.hidden, false, "favourite writes are still unsaved");
  assert.equal(run("setFavouriteState(state.items[0], true).persisted"), true);
  assert.equal(notice.hidden, true);
  const reload = fixture({ storage });
  assert.equal(reload.run('loadReadKeys().has("https://example.test/b") && loadFavouriteKeys().has("https://example.test/b")'), true);
});

for (const kind of ["Read", "Favourite"]) {
  test(`${kind} concurrent independent writes and legacy removals survive stale tabs`, () => {
    const key = kind === "Read" ? "technique-vault-read-v1" : "websec-favourites-v1";
    const storage = new Map([[key, '["https://example.test/old"]']]);
    const a = fixture({ storage }), b = fixture({ storage });
    for (const tab of [a, b]) tab.run(`state.items = ["a", "b", "old"].map(id => applyStoredState({ id, originalUrl: "https://example.test/" + id, links: [] }));`);
    a.run(`set${kind}State(state.items[0], true)`);
    b.run(`set${kind}State(state.items[1], true)`); // No storage event yet.
    a.run(`set${kind}State(state.items[2], false)`);
    b.run(`set${kind}State(state.items[1], false)`);
    const reload = fixture({ storage });
    assert.equal(reload.run(`loadStoredKeys(${JSON.stringify(key)}).has("https://example.test/a")`), true);
    assert.equal(reload.run(`loadStoredKeys(${JSON.stringify(key)}).has("https://example.test/b")`), false);
    assert.equal(reload.run(`loadStoredKeys(${JSON.stringify(key)}).has("https://example.test/old")`), false, "a tombstone overrides the unchanged legacy array");
    b.run(`set${kind}State(state.items[0], false)`);
    a.run(`set${kind}State(state.items[0], true)`);
    assert.equal(fixture({ storage }).run(`loadStoredKeys(${JSON.stringify(key)}).has("https://example.test/a")`), true, "same-record conflicts use the last successful write");
  });
}

test("invalid storage values are ignored and session edits survive external refresh", () => {
  const storage = new Map([
    ["websec-favourites-v1", "invalid-json"],
    ["websec-favourites-v1:item:https://example.test/a", "true"],
    ["websec-favourites-v1:item:https://example.test/b", "{\"active\":true}"],
    ["websec-favourites-v1:item:", "true"]
  ]);
  const { run } = fixture({ storage, denied: true });
  assert.equal(run('loadFavouriteKeys().size'), 1);
  run('state.items = [applyStoredState({ id: "b", originalUrl: "https://example.test/b", links: [] })]; setFavouriteState(state.items[0], true)');
  storage.set("websec-favourites-v1:item:https://example.test/a", "false");
  run("synchronizeReadingState()");
  assert.equal(run('state.favouriteKeys.has("https://example.test/a")'), false);
  assert.equal(run('state.favouriteKeys.has("https://example.test/b")'), true);
  assert.equal(run('state.items[0].favourite'), true);
  storage.set("technique-vault-read-v1:item:https://example.test/b", "true");
  run("synchronizeReadingState()");
  assert.equal(run('state.items[0].read'), true, "external state updates the existing record instance");
});

test("partial recovery reports successful new edits accurately while retaining older session edits", () => {
  const { run, context, storage, notice, messages } = fixture();
  context.localStorage.setItem = (key, value) => {
    if (key.endsWith("https://example.test/a")) throw Error("denied");
    storage.set(key, value);
  };
  run('state.items = ["a", "b"].map(id => applyStoredState({ id, originalUrl: "https://example.test/" + id, links: [] }));');
  assert.equal(run("setReadState(state.items[0], true).persisted"), false);
  assert.equal(run("setReadState(state.items[1], true).persisted"), true);
  assert.doesNotMatch(messages.at(-1), /session only/);
  assert.equal(notice.hidden, false, "the older failed write is still visible");
  assert.equal(run("state.items.every(item => item.read)"), true);
  assert.equal(fixture({ storage }).run("loadReadKeys().size"), 1);
});
