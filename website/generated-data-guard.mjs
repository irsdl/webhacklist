import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function assertGeneratedDataUntracked(repo) {
  const ignore = readFileSync(path.join(repo, ".gitignore"), "utf8");
  if (!ignore.split(/\r?\n/).some((line) => line.trim() === "website/data/")) {
    throw new Error("website/data/ must remain in .gitignore; generated JSON belongs only in build output");
  }

  // Deployed source archives may omit Git metadata. In a checkout, inspect the
  // index too: an ignore rule does not stop a forced add or untrack old files.
  if (!existsSync(path.join(repo, ".git"))) return;
  for (const filename of ["catalogue.json", "diagrams.json", "collections/probe.json", "sources/probe.json"]) {
    try {
      execFileSync("git", ["-c", "core.excludesFile=", "check-ignore", "-q", "--no-index", "--", `website/data/${filename}`], { cwd: repo });
    } catch {
      throw new Error(`website/data/${filename} is not ignored by Git; restore the website/data/ ignore rule`);
    }
  }
  const tracked = execFileSync("git", ["ls-files", "-z", "--", "website/data"], { cwd: repo })
    .toString("utf8").split("\0").filter(Boolean);
  if (tracked.length) {
    throw new Error(`generated website/data/ files are tracked by Git:\n${tracked.join("\n")}\nRemove them from the index with git rm --cached -r website/data`);
  }
}
