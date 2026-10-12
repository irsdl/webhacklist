import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
const context = vm.createContext({ URL });
vm.runInContext(`
  class ReadableStream {
    constructor(values = []) { this.valuesToRead = [...values]; this.cancelled = false; this.released = false; }
    getReader() {
      const stream = this;
      return {
        async read() { return stream.valuesToRead.length ? {done:false,value:stream.valuesToRead.shift()} : {done:true}; },
        async cancel() { stream.cancelled = true; },
        releaseLock() { stream.released = true; }
      };
    }
  }
  globalThis.ReadableStream = ReadableStream;
`, context);
vm.runInContext("delete Map.prototype.getOrInsertComputed; delete WeakMap.prototype.getOrInsertComputed;", context);
vm.runInContext(await readFile(new URL("./pdf-reader-polyfills.mjs", import.meta.url), "utf8"), context);
const results = vm.runInContext(`
  const checks = [];
  for (const Type of [Map, WeakMap]) {
    const cache = new Type(), key = {};
    let calls = 0;
    checks.push(cache.getOrInsertComputed(key, () => { calls++; return undefined; }) === undefined);
    checks.push(cache.getOrInsertComputed(key, () => { calls++; return 2; }) === undefined && calls === 1);
    const other = {};
    checks.push(cache.getOrInsertComputed(other, () => { cache.set(other, 1); return 2; }) === 2 && cache.get(other) === 2);
    try { cache.getOrInsertComputed(key, null); checks.push(false); } catch (error) { checks.push(error instanceof TypeError); }
    const failed = {};
    try { cache.getOrInsertComputed(failed, () => { throw Error("no value"); }); } catch {}
    checks.push(!cache.has(failed));
  }
  const numeric = new Map();
  checks.push(numeric.getOrInsertComputed(-0, (key) => Object.is(key, 0)) === true);
  checks.push(numeric.getOrInsertComputed(NaN, () => 3) === 3 && numeric.getOrInsertComputed(NaN, () => 4) === 3);
  let called = false;
  try { new WeakMap().getOrInsertComputed(1, () => { called = true; }); checks.push(false); }
  catch (error) { checks.push(error instanceof TypeError && !called); }
  checks;
`, context);
assert.ok(results.every(Boolean), "PDF cache compatibility checks failed");
const streamResults = await vm.runInContext(`(async () => {
  const complete = new ReadableStream([1, 2]), values = [];
  for await (const value of complete) values.push(value);
  const partial = new ReadableStream([3, 4]);
  for await (const value of partial) break;
  return [values.join(",") === "1,2", complete.released, !complete.cancelled, partial.released, partial.cancelled];
})()`, context);
assert.ok(streamResults.every(Boolean), "PDF stream compatibility checks failed");
console.log(`PDF compatibility: ${results.length + streamResults.length} checks passed`);
