// Run the shared theme contracts together so new fixes do not displace earlier ones.
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = {...process.env, WEBSEC_TEST_URL:process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/"};
// The full suite must not inherit a focused debugging run's viewport restriction.
delete env.WEBSEC_DIALOG_WIDTH;
try {
  env.AXE_SOURCE ||= fileURLToPath(import.meta.resolve("axe-core/axe.min.js"));
} catch {
  throw Error("Install the optional browser-test dependencies and set AXE_SOURCE as documented in website/README.md.");
}

const allSuites = [
  "smoke-test.mjs",
  "theme-test.mjs",
  "halloween-test.mjs",
  "halloween-immersion-test.mjs",
  "discovery-test.mjs",
  "shareable-discovery-test.mjs",
  "entrance-test.mjs",
  "saved-portability-test.mjs",
  "shortlist-browser-test.mjs",
  "installation-test.mjs",
  "review-browser-test.mjs",
  "pdf-state-test.mjs",
  "interface-test.mjs",
  "dialog-test.mjs",
  "history-test.mjs",
  "year-history-test.mjs",
  "sources-test.mjs",
  "article-scroll-test.mjs",
  "mobile-test.mjs",
  "accessibility-test.mjs",
  "preview-test.mjs",
  "vendor-cache-test.mjs"
];
// The real-zoom acceptance matrix is opt-in and needs the approved bundled
// Chromium image with full Playwright persistent-context exports.
const knownSuites = [...allSuites, "accessibility-cases-test.mjs"];
const suites = process.env.WEBSEC_TEST_SUITES?.split(",") || allSuites;
for (const suite of suites) {
  if (!knownSuites.includes(suite)) throw Error(`Unknown regression suite: ${suite}`);
}

for (const suite of suites) {
  console.log(`\nRegression suite: ${suite}`);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`website/${suite}`], {cwd:root, env, stdio:"inherit"});
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(Error(`${suite} failed (${signal || `exit ${code}`})`));
    });
  });
}
console.log(`\nWebsite regression suite: all ${suites.length} suites passed`);
