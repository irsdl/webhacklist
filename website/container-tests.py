#!/usr/bin/env python3
"""Run website regressions without giving archived content a host browser.

Mount only public archive inputs, staged website/test code and the three
already-approved test dependency packages. No network, checkout, credentials,
Docker socket or writable host output mount enters the test container.
"""
import argparse
import json
from pathlib import Path
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools/references"))
from refslib import toolbox

IMAGE = "webseclist-browser-tests:source-workers-4"
CROSS_IMAGE = "webseclist-browser-tests:cross-browser-1.55.0"
BROWSERS = ("chromium", "chrome", "msedge", "firefox", "webkit")
SUITES = ("smoke-test.mjs", "theme-test.mjs", "discovery-test.mjs", "shareable-discovery-test.mjs", "entrance-test.mjs", "saved-portability-test.mjs", "shortlist-browser-test.mjs", "installation-test.mjs", "review-browser-test.mjs", "pdf-state-test.mjs", "interface-test.mjs",
          "dialog-test.mjs", "history-test.mjs", "year-history-test.mjs", "sources-test.mjs", "article-scroll-test.mjs", "mobile-test.mjs",
          "accessibility-test.mjs", "accessibility-cases-test.mjs", "preview-test.mjs", "vendor-cache-test.mjs")
ADAPTER = '''import * as real from "/deps/node_modules/playwright/index.mjs";
export const chromium = {launch: options => real.chromium.launch({...options,
 executablePath:"/usr/bin/chromium-browser", args:[...(options?.args || []),
 "--disable-dev-shm-usage"]})};
'''
PERSISTENT_ADAPTER = '''import fs from "node:fs";
for (const name of ["playwright", "playwright-core"]) {
 const info = JSON.parse(fs.readFileSync(`/opt/browser-tests/node_modules/${name}/package.json`, "utf8"));
 if (info.version !== "1.55.0") throw Error("Installed image package version mismatch");
}
export * from "/opt/browser-tests/node_modules/playwright/index.mjs";
'''
BOOTSTRAP = '''import os,shutil,subprocess,time,urllib.request
shutil.copytree('/work/website', '/tmp/work/website', ignore=shutil.ignore_patterns('data'))
for name in os.listdir('/work'):
 if name != 'website': os.symlink('/work/'+name, '/tmp/work/'+name)
os.chdir('/tmp/work')
subprocess.run(['node','website/build-data.mjs'],check=True)
environment=dict(os.environ,PLAYWRIGHT_MODULE="/deps/adapter.mjs",
 AXE_SOURCE="/deps/node_modules/axe-core/axe.min.js",WEBSEC_TEST_URL="http://127.0.0.1:4173/")
preview=subprocess.Popen(["node","website/preview.mjs"],env=environment)
try:
 for attempt in range(100):
  try:
   urllib.request.urlopen("http://127.0.0.1:4173/",timeout=1).close();break
  except OSError: time.sleep(.1)
 else: raise RuntimeError("test preview did not start")
 test_command=["node","website/regression-test.mjs"]
 if environment.get("WEBSEC_TEST_HEADED") == "1":
  test_command=["xvfb-run","--auto-servernum","--server-args=-screen 0 1920x1080x24 -nolisten tcp"]+test_command
 result=subprocess.call(test_command,env=environment)
finally:
 preview.terminate();preview.wait(timeout=10)
raise SystemExit(result)
'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--node-modules", type=Path, required=True,
                        help="controller-selected directory containing approved playwright, playwright-core and axe-core")
    parser.add_argument("--browsers", nargs="+", choices=(*BROWSERS, "all"), default=["chromium"],
                        help="all selects Chromium, Google Chrome, Microsoft Edge, Firefox and WebKit")
    parser.add_argument("--suites", nargs="+", choices=SUITES,
                        help="optional focused suites; omit for the complete regression suite")
    parser.add_argument("--debug", action="store_true", help="include browser process and layout diagnostics")
    parser.add_argument("--case-captures", action="store_true", help="emit bounded acceptance screenshots from the accessibility case suite")
    args = parser.parse_args()
    for name in ("playwright", "playwright-core", "axe-core"):
        if not (args.node_modules / name / "package.json").is_file():
            parser.error("missing approved test dependency: " + name)
    browsers = list(BROWSERS) if "all" in args.browsers else list(dict.fromkeys(args.browsers))
    # The acceptance suite (included by the default full run) needs bundled
    # Chromium's extension support and full persistent-context exports, rather
    # than the legacy launch shim.
    acceptance = "accessibility-cases-test.mjs" in (args.suites or SUITES)
    cross_browser = browsers != ["chromium"] or acceptance
    image = CROSS_IMAGE if cross_browser else IMAGE
    if cross_browser:
        for name in ("playwright", "playwright-core"):
            if json.loads((args.node_modules / name / "package.json").read_text())["version"] != "1.55.0":
                parser.error("cross-browser image requires matching Playwright 1.55.0 packages")
    else:
        toolbox.ensure_image()
    present = subprocess.run(["docker", "image", "inspect", image], capture_output=True)
    if present.returncode:
        print("Building the isolated browser-test image", flush=True)
        dockerfile = "Dockerfile.cross-browser-tests" if cross_browser else "Dockerfile.tests"
        subprocess.run(["docker", "build", "-t", image, "-"],
                       input=(ROOT / "website" / dockerfile).read_bytes(), check=True, timeout=900)
    with tempfile.TemporaryDirectory(prefix="websec_browser_tests_") as folder:
        scratch = Path(folder)
        os.chmod(scratch, 0o755)
        stage = scratch / "work"
        stage.mkdir()
        for name in ("archived-references", "original-listings"):
            (stage / name).mkdir()
        shutil.copytree(ROOT / "website", stage / "website",
                        ignore=shutil.ignore_patterns("data", "node_modules", ".tmp", ".env*", "__pycache__"))
        shutil.copyfile(ROOT / ".gitignore", stage / ".gitignore")
        shutil.copyfile(ROOT / "LICENSE", stage / "LICENSE")
        (stage / "tools/references").mkdir(parents=True)
        shutil.copyfile(ROOT / "tools/references/related-sources.json", stage / "tools/references/related-sources.json")
        for path in ROOT.glob("*.md"):
            if re.fullmatch(r"\d{4}(?:-\d{2}|-ai)?\.md", path.name) or path.name in ("README.md", "CONTRIBUTING.md"):
                shutil.copyfile(path, stage / path.name)
        shutil.copytree(ROOT / ".github/ISSUE_TEMPLATE", stage / ".github/ISSUE_TEMPLATE")
        shutil.copyfile(ROOT / ".github/PULL_REQUEST_TEMPLATE.md", stage / ".github/PULL_REQUEST_TEMPLATE.md")
        adapter = scratch / "adapter.mjs"
        # The approved cross-browser image owns the matching runtime. Host
        # dependency metadata is sufficient; entrypoints need not be present.
        adapter.write_text(PERSISTENT_ADAPTER if cross_browser else ADAPTER)
        command = ["docker", "run"] + toolbox.run_args()
        command[command.index("--network") + 1] = "none"
        command[command.index("--memory") + 1] = "2g"
        command[command.index("--pids-limit") + 1] = "1024"
        command[command.index("--tmpfs") + 1] = "/tmp:rw,noexec,nosuid,size=512m"
        # Give composited layers room beyond Docker's 64 MB default while
        # retaining a separate shared-memory bound inside the total memory cap.
        command += ["--shm-size", "256m"]
        command += ["-v", str(stage) + ":/work:ro", "-v", str(adapter) + ":/deps/adapter.mjs:ro"]
        for name in ("archived-references", "original-listings"):
            command += ["-v", str(ROOT / name) + ":/work/" + name + ":ro"]
        for name in ("playwright", "playwright-core", "axe-core"):
            command += ["-v", str((args.node_modules / name).resolve()) + ":/deps/node_modules/" + name + ":ro"]
        if args.suites:
            command += ["-e", "WEBSEC_TEST_SUITES=" + ",".join(args.suites)]
        if args.debug:
            command += ["-e", "DEBUG=pw:browser", "-e", "WEBSEC_TEST_DEBUG=1"]
        if args.case_captures:
            command += ["-e", "WEBSEC_CASE_CAPTURE=1"]
        status = 0
        for browser in browsers:
            print("Running isolated browser matrix: " + browser, flush=True)
            # Use WebKit's GTK display backend in a private virtual display;
            # WPE headless can stall animation frames during repeated resizes.
            display = ["-e", "WEBSEC_TEST_HEADED=1"] if browser == "webkit" else []
            invocation = command + display + ["-e", "WEBSEC_TEST_BROWSER=" + browser, "--workdir", "/work",
                                    image, "python3", "-I", "-c", BOOTSTRAP]
            # The full theme/dialog/history matrix can exceed 15 minutes in
            # WebKit. Keep a bounded 30-minute allowance per browser.
            result = toolbox._run_container(invocation, timeout=1800)
            sys.stdout.write(result.stdout.decode("utf-8", "replace"))
            sys.stderr.write(result.stderr.decode("utf-8", "replace"))
            sys.stdout.flush()
            status = status or result.returncode
        return status


if __name__ == "__main__":
    sys.exit(main())
