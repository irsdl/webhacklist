# Maintainer setup and validation

Run commands from the repository root. Use Node **22.18.0** (22+ supported),
Python **3.10+** (CI uses 3.13), Git and a running Docker daemon. Source parsing,
data generation and archive/browser tests use the
[approved isolation boundary](../.claude/source-security.md).

1. Install the host instruction-check dependency, preferably in a virtual
   environment: `python -m pip install -r tools/requirements.txt`.
2. Keep approved browser packages outside the checkout. CI installs
   `playwright@1.55.0`, `playwright-core@1.55.0` and `axe-core@4.13.0` with
   `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` and `--ignore-scripts`. For an approved
   local installation, use `npm install --prefix /path/to/websec-browser-tests
   --no-audit --no-fund --ignore-scripts --save-exact playwright@1.55.0
   playwright-core@1.55.0 axe-core@4.13.0` with that environment variable set.
   No host browser is needed.
3. Prepare Docker images through the existing runners below. Their first run
   builds missing images using network access for dependencies; actual source
   processing and tests run offline. The cross-browser image pins the official
   Playwright base and installs Chrome/Edge stable at build time. Rebuild it to
   refresh those channels. See the [browser guide](../website/README.md#run-it).
4. Check the environment without installing, building, fetching or launching
   a browser:

   ```sh
   python tools/maintainer_preflight.py --node-modules /path/to/websec-browser-tests/node_modules
   python tools/maintainer_preflight.py --node-modules /path/to/websec-browser-tests/node_modules --browsers all --json
   ```

Preflight exits nonzero for missing Node/Python/PyYAML/Git, an inaccessible Docker
daemon, absent required image tags, mismatched test packages or missing package
entrypoints. It checks the
image family against the requested browser selection. Actual browser executable
availability and versions are checked by the isolated suites when they launch;
the preflight does not certify a browser run. Set your usual `DOCKER_CONFIG` or
Docker context explicitly if the default is unavailable; never copy credentials
into the checkout. The read-only preflight intentionally fails before first-time
image preparation.

## Checks before a pull request

```sh
python tools/check_skills.py
python -m unittest discover -s tools/tests
node --test website/constellation-test.mjs website/generated-data-guard-test.mjs website/pdf-reader-polyfills-test.mjs website/review-regression-test.mjs
python website/container-build.py
python tools/references/container_tests.py
python website/container-tests.py --node-modules /path/to/websec-browser-tests/node_modules --suites smoke-test.mjs pdf-state-test.mjs review-browser-test.mjs discovery-test.mjs accessibility-test.mjs preview-test.mjs
```

The build runner stages only public inputs and checks JavaScript syntax,
story-identity freshness, generated data, README counts, crawlable pages, and
both host staging targets. All outputs stay in bounded container temporary
storage; it does not write generated data into the checkout. The browser runner
also generates its own data offline, so neither runner depends on a previous
local build. The separate unit gate checks the real Git index for accidentally
tracked `website/data/` files. Never commit generated data.

For theme, navigation, reader or popup changes, run the complete browser suite;
use `--browsers all` for the five-engine matrix. Reference-tool tests use their
own offline container, including tests that inspect the real archive corpus.

[Validate repository](../.github/workflows/validate.yml) runs on pull requests and
direct `master` pushes. It runs the synthetic
contracts, skill check, offline builds, reference tests and the configured focused
Chromium suites, including sources/nomination regressions. Fork PRs are covered.
It has only `contents: read`, retains no
checkout credentials and never deploys. Weekly Monday runs at **05:23 UTC** and
manual dispatch also run every suite across Chromium, Chrome, Edge, Firefox and
WebKit. The stable PR check names are `contracts` and `isolated`; repository
administrators can require both in branch protection. Adding the workflow does
not configure branch protection or change Cloudflare's deployment settings.

Skill structure errors fail the gate; recommended entrypoint length warnings
remain visible. Use `python tools/check_skills.py --strict` for authoring cleanup:
two existing entrypoints exceed the 500-line recommendation, so that stricter
check currently fails on warnings.

Source retrieval remains a separate operation. For capture setup, consult
[capture tooling](README.md#capture_pdfpy); only an explicitly selected
`python tools/capture_pdf.py doctor --smoke` performs its public-network capture.
The environment preflight does not read research bodies or run that smoke check.
