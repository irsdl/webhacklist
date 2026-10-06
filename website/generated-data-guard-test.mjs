import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { assertGeneratedDataUntracked } from "./generated-data-guard.mjs";

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "webhacklist-data-guard-"));
  t.after(() => {
    if (!path.resolve(root).startsWith(`${path.resolve(tmpdir())}${path.sep}`)) throw new Error("unsafe test cleanup path");
    rmSync(root, { recursive: true, force: true });
  });
  mkdirSync(path.join(root, "website", "data"), { recursive: true });
  writeFileSync(path.join(root, ".gitignore"), "website/data/\n");
  execFileSync("git", ["init", "-q"], { cwd: root });
  return root;
}

test("generated data stays ignored and untracked", (t) => {
  const root = fixture(t);
  assert.doesNotThrow(() => assertGeneratedDataUntracked(root));
});

test("a forced add of generated JSON fails the build guard", (t) => {
  const root = fixture(t);
  writeFileSync(path.join(root, "website", "data", "catalogue.json"), "{}\n");
  execFileSync("git", ["-c", "core.excludesFile=", "-c", "core.autocrlf=false", "add", "-f", "website/data/catalogue.json"], { cwd: root });
  assert.throws(() => assertGeneratedDataUntracked(root), /generated website\/data\/ files are tracked/);
});

test("removed or overridden ignore rules fail the build guard", (t) => {
  const root = fixture(t);
  writeFileSync(path.join(root, ".gitignore"), "");
  assert.throws(() => assertGeneratedDataUntracked(root), /must remain in .gitignore/);
  writeFileSync(path.join(root, ".gitignore"), "website/data/\n!website/data/\n");
  assert.throws(() => assertGeneratedDataUntracked(root), /is not ignored by Git/);
});
