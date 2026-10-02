# Web Hacking Techniques Index

`website/` is the production, dependency-free interface for exploring the Top 10 Web
Hacking Techniques archive. Generated collection shards keep it synchronized with the
repository's real year lists, preliminary collection registry, and reference manifest.

One list bullet represents one research contribution. Its first link establishes
the story identity; a reviewed source policy can choose a fuller main reading
source. Additional labelled sources are companions (for example, an advisory,
independent analysis, slides or a follow-up). Prefer the fullest reliable account
as the main source, preserve each author's credit, and describe what each companion
adds. Sharing a product or vulnerability name alone does not make distinct research
contributions duplicates.

Every theme's record panel includes **Sources and further reading**, with each
source's own summary, author, publisher, publication date, topics, original link
and available Markdown/PDF copies. Reader and PDF toolbars return to these details.
Companion document share links retain the selected source. Research Desk and Time
Machine also expose a **Sources & details** action on each record.

`tools/references/related-sources.json` maintains source relationships without
rewriting historical lists. `python3 tools/references/related_sources.py build`
generates complete `archived-references/source-groups.json` coverage from those
decisions, listed companions and confirmed recordings. `build-data.mjs` generates
`data/sources/<collection>.json` from these groups and public archive metadata. These versioned shards load only when details are requested; the main
collection shards retain document links for use if metadata loading fails. The
smoke test checks source matching, checksums, public field allowlisting, and budgets
of 500 KB per source shard and 4 MB in total. Scores and private review data are
never included. The isolated regression runner below includes companion navigation checks.

## Run it

For a complete local preview, including the phone PDF viewer:

```bash
node website/preview.mjs
```

Open <http://127.0.0.1:4173/#desk>. This starts a second localhost-only server
on port 4174 for the isolated PDF reader. Production URLs are replaced only in
the served preview copies; the production files and reader restrictions stay
intact. Only website assets and published archive paths are served. Set
`WEBSEC_PREVIEW_PORT` and `WEBSEC_READER_PORT` to choose different ports.

The isolated regression runner checks the complete PDF flow using its own preview.
Automated agents must use that container route when inspecting archived content;
the preview commands here are for ordinary interactive website development.

Serve the repository root (not this directory) so the mockup can load the archive:

```bash
python3 -m http.server 8000
```

Then open:

<http://localhost:8000/website/>

Run the archive/link smoke test with:

```bash
node website/smoke-test.mjs
```

## The crawlable surface

The app renders every view from JSON behind one URL, resets `document.title` to a
single constant, and declares one canonical URL for the whole origin. A search
engine therefore sees exactly one page however many archive URLs it is handed —
a sitemap of `?reader=` links would consolidate straight back into the home page.

`build-pages.mjs` generates the indexable layer instead: one plain HTML document
per preserved reference (`/reference/<slug>/`) and per collection
(`/research/<collection>/`), plus the research hub, the security policy and the
sitemap that indexes them. Each page has its own title, description, canonical
URL and `schema.org` data, runs no JavaScript, and is reachable from the app's
own footer so a crawler can walk to it rather than only be told about it.

These pages carry the archive's **own** writing — the curated summary, byline,
topic and ranking context — and never the body of the preserved article.
Reproducing that text would put this domain into search results competing with
the researcher who wrote it. The preserved Markdown and PDF stay one click away
from each record and are served `X-Robots-Tag: noindex` (see `_headers`), as are
the original listings. The GitHub file origin gets `Disallow: /` for the same
reason: it exists to serve oversized PDFs, not to be a second indexable copy.

Nothing generated here is committed. `build-site.mjs` calls `buildPages()` and
writes the result straight into the staged tree, so the crawlable surface is
rebuilt from the same catalogue on every deploy and cannot go stale. Preview the
output without staging the whole archive:

```bash
node website/build-pages.mjs --out /tmp/pages-preview
```

Check the contract a crawler actually acts on — one title and one `h1` per page,
a canonical that matches the served path, valid JSON-LD, a sitemap that agrees
with the pages, no link to an unstaged file, and an unexpired `security.txt`:

```bash
node website/pages-test.mjs
```

Run the dependency-free constellation interaction regressions with
`node --test website/constellation-test.mjs`. Synthetic events exercise zoom
buttons, wheel, slider, keyboard navigation and pinch handling against the real
animation loop, including drift preferences, reduced motion and interrupted
camera flights. Canvas painting still requires browser validation.

Browser theme checks cover all nine views at desktop and phone widths, keyboard
focus after filtering, motion preferences, and reader contrast. Keep the approved
Playwright, playwright-core and axe-core packages in a directory outside the
repository. Run the complete test matrix with:

```bash
python3 website/container-tests.py --node-modules /tmp/websec-browser-tests/node_modules
```

The runner starts its own preview and Chromium inside Docker. To run the same
contracts in Chromium, Google Chrome, Microsoft Edge, Firefox and WebKit:

```bash
python3 website/container-tests.py --node-modules /tmp/websec-browser-tests/node_modules --browsers all
```

The cross-browser image requires Playwright and playwright-core **1.55.0**, matching
its pinned official Playwright base image. It installs Chrome and Edge stable when
first built; each suite prints the actual browser version. Rebuild
`webseclist-browser-tests:cross-browser-1.55.0` to refresh those stable channels.
Use `--browsers firefox webkit` for selected engines and, for example,
`--suites theme-test.mjs mobile-test.mjs dialog-test.mjs` for a focused run.
Missing browsers and failed suites fail the command; they are never silently skipped.
Add `--debug` for browser-process and per-layout diagnostics. Each container has
256 MB of shared memory for composited layers, within its 2 GB memory limit.
WebKit uses its GTK backend in an isolated Xvfb display to avoid WPE headless
animation-frame stalls during repeated viewport changes; no host display is mounted.

Both runners mount staged
public website/test files, published archive files and those three dependency
packages read-only. It has no network, credentials, repository checkout, Docker
socket or writable host output mount. Browser output is bounded and temporary
files stay in capped container storage. No host browser installation is needed.
Do not replace this route with a host Playwright process for archive inspection.
Dependency installation remains subject to the repository's dependency policy;
source content cannot select packages or installation commands.

`interface-test.mjs` checks the requested navigation order, consecutive indices and
identical sidebar positions, row heights and font sizes across every theme at four
screen sizes. It also covers Terminal command submission, completion without a Tab
trap, history, draft retention, busy state and commands finishing after a route change.
Set `AXE_SOURCE` to include its Terminal accessibility checks.

`dialog-test.mjs` runs against the complete preview on ports 4173/4174. It checks
record, Markdown, PDF, report and submission panes in all nine themes at desktop
and phone widths, including both discovery appearances. Genuine backdrop clicks
close only the topmost pane; interior clicks and drags across its edge keep it
open. It also checks SVG close-icon centring, scroll restoration and reader cleanup.

`history-test.mjs` checks Back/Forward in all nine views at desktop and phone
widths. Opening an article, Markdown or PDF creates one popup history entry;
switching format or source replaces that entry. Back closes the popup, Forward
restores it, and X/Escape/backdrop dismissal returns to the underlying view without
leaving an extra Back step. Direct share links also have a local view to return to.

`year-history-test.mjs` checks year tabs and collection selectors in all nine
views at desktop and phone widths. Year choices create history entries, retain
`?year=` in shared article links, and survive Back/Forward and reload. It also
checks return from another theme, multi-year saved filters, and delayed loads
that finish after navigation has moved elsewhere.

`article-scroll-test.mjs` checks that new and reopened records start at their heading
after scrolling another record or opening its video player, across all nine views
at desktop and phone widths. It verifies player teardown and preservation of the
background page position. The external video frame uses a local response fixture.
It also checks overview navigation with Previous/Next buttons and left/right arrow
keys, endpoint behaviour, share URLs, empty-summary spacing, and close-button
insets before and after scrolling. Navigation follows the current results (across
pages in Research Desk), or the record's collection for a direct link outside those
results. It pauses during embedded video playback; Markdown/PDF readers and forms
keep their own keyboard behaviour.

`mobile-test.mjs` uses touch input to open all nine routes at 320, 390 and 768px,
checks direct-link reloads, popup bounds, default and saved appearance, rotation,
and entering/exiting fullscreen in landscape without the native Fullscreen API.
It also checks that switching views resets the reading position and that the two
compact views expose their primary filter near the top of the screen.
Scrolling checks keep content (including elevated Investigation Board cards)
behind the whole top menu, search results and theme chooser in every view.

Set `WEBSEC_TEST_URL` to use a different local preview URL. The production website
still needs no JavaScript dependencies.

### Regression coverage for future website changes

Use the Docker command above to run all twelve suites. The underlying
`regression-test.mjs` entrypoint runs inside that container.

The runner uses the complete preview at port 4173 for every suite, includes Terminal
accessibility checks, and fails on the first failed suite. It clears the focused
`WEBSEC_DIALOG_WIDTH` override so the complete popup viewport matrix always runs.
These are shared interface contracts: preserve them when adding or changing themes.

| Behaviour to preserve | Regression coverage |
|---|---|
| Field Guide/Gazette removed; Research Desk/Time Machine retained; dark default and saved appearance | `mobile-test.mjs`, `discovery-test.mjs` |
| Compact headers with useful controls near the top; all views fit phone widths and support navigation, rotation and fullscreen | `mobile-test.mjs`, `theme-test.mjs` |
| Requested theme order, consecutive numbering and identical sidebar spacing/fonts | `interface-test.mjs` |
| Recording markers in Desk/Time Machine, including uncertain matches; Desk video filter combined with other filters | `discovery-test.mjs` |
| Terminal caret, Run/help/search controls, keyboard history, completion without a Tab trap, retained drafts and safe route changes during pending commands | `interface-test.mjs` |
| Theme colours in records, forms, search and readers; readable light/dark contrast | `discovery-test.mjs`, `theme-test.mjs`, `accessibility-test.mjs` |
| Outside click/tap closes only the topmost popup in every view; inside clicks and selection drags keep it open; close icons stay centred | `dialog-test.mjs` |
| Year tabs and collection selection support Back/Forward, article return and reload | `year-history-test.mjs` |
| Article Back/Forward, format switches, explicit dismissal and shared-link reloads | `history-test.mjs` |
| New/reopened articles start at the heading after scrolling or opening a video; previous video frame is removed; background page position is preserved | `article-scroll-test.mjs` |
| Mobile PDFs render through the isolated local reader, including when dedicated workers are unavailable; viewer switching and theme changes work | `preview-test.mjs`, `discovery-test.mjs`, `dialog-test.mjs` |

The browser matrix covers desktop and touch layouts at phone and tablet widths,
plus portrait/landscape changes. Firefox supports touch and viewport resizing but
not Playwright's `isMobile` emulation, so its narrow-screen runs use the former.
WebKit phone navigation uses `isMobile`; its live rotation checks use a separate
touch context because GTK mobile emulation retains the initial visual viewport
after a resize. Landscape fullscreen is also checked in a fresh mobile context.
WebKit provides Safari engine coverage, not a native Safari or physical iPhone test;
those checks remain manual. See [Playwright's browser support](https://playwright.dev/docs/browsers).
The video scroll regression substitutes a local iframe response; it checks the
app's player lifecycle, not playback on YouTube. Phone field-size assertions guard
against iOS focus zoom; pinch zoom remains enabled.

### Preserved research diagrams and figures

The Markdown reader displays repository-owned PNG figure crops and pre-rendered
Mermaid diagrams. External images remain explicit outbound links. Genuine code
stays in fenced listings; an unrecognized diagram is shown as source code.

After changing a Mermaid fence in a published reference, render its static asset
before regenerating the website data:

```bash
python3 tools/references/render_diagrams.py --bundle /path/to/mermaid.min.js
```

Use `dist/mermaid.min.js` from Mermaid **11.16.0**. The renderer requires SHA-256
`74d7c46dabca328c2294733910a8aa1ed0c37451776e8d5295da38a2b758fb9b` and fails for
other bytes. Keep the downloaded bundle and its license outside tracked output.
It executes in the archive toolbox with networking disabled, validates the SVGs,
and writes `archived-references/diagrams/` plus `diagram-assets.json`. The site
build checks both source and asset hashes and copies only referenced assets.
No Mermaid runtime or remote image request is added to the public reader.

The generated `data/diagrams.json` index loads only when opening Markdown with a Mermaid fence. The startup catalogue holds its versioned descriptor, keeping diagram source text out of the initial download. Unavailable diagram assets leave the readable source intact.

Regenerate or check the progressive data with:

```bash
python3 tools/references/related_sources.py build
node website/build-data.mjs
node website/build-data.mjs --check
```

Build the same static output used by the production hosts with:

```bash
node website/build-site.mjs --target cloudflare  # writes dist/
node website/build-site.mjs --target github      # writes _site/
```

## Publish webhacklist.com with Cloudflare Pages

Cloudflare Pages is the preferred public host for `webhacklist.com`: the app has no
server functions, and static asset requests are free and unlimited. Create a Pages
project connected to this repository with these settings:

- Production branch: `master`
- Build command: `node website/build-data.mjs && node website/build-site.mjs --target cloudflare`
- Build output directory: `dist`
- Root directory: the repository root

Add `webhacklist.com` in **Workers & Pages → Custom domains**. For the apex domain,
Cloudflare requires the domain to be a Cloudflare zone using Cloudflare nameservers.
Add `www.webhacklist.com` separately if it should resolve too, and redirect it to the
apex in Cloudflare.

The build enforces the free plan's 20,000-file and 25 MiB-per-asset limits. Two
preserved PDFs currently exceed 25 MiB. Cloudflare omits those exact files and the app
offers their GitHub Pages copies after its same-origin check fails. The allowlist lives
in `hosting.json`; a newly oversized file fails the build instead of disappearing.
Cloudflare's `_headers` file applies security headers, immediately revalidates the tiny
catalogue, caches versioned year shards for a year, and gives archive documents a
one-day cache with stale revalidation.

Cloudflare's bot **JavaScript detections** inserts an inline `<script>` into every
HTML response it serves, and that policy carries no `'unsafe-inline'`, no nonce and
no hash for it, so the browser refuses it and logs a content-security-policy error
on each page load. The refused script is Cloudflare's, not the app's: nothing on
the page depends on it, and the injected tag carries per-response tokens, so no
fixed hash can ever cover it. Cloudflare adds a nonce to what it injects only when
it can read one from the CSP response header, which a static `_headers` file cannot
produce - a per-request nonce would mean routing every asset through a Pages
function, and the rules-language `uuidv4()` that would otherwise mint one is
allowed in URL rewrites only, never in a response-header rule.

Switch the injection off rather than loosening the policy for it. The control sits
in **Security -> Settings**, filtered by **Bot traffic**. Super Bot Fight Mode and
Enterprise Bot Management expose **JS detections** as its own toggle, so the rest
of the bot protection survives; under plain Bot Fight Mode the injection is
bundled and the only switch is Bot Fight Mode itself. Turning that off costs this
site little - static assets served from Cloudflare's edge have no origin to
protect - and `curl -s https://webhacklist.com/ | grep -c '__CF\$cv\$params'`
returns 0 once the injection stops.

## The name search engines print

Google, Bing and the rest take the site name from the home page only, and from
several signals at once: `WebSite` structured data in `index.html`, `og:site_name`,
`application-name`, the `<title>`, the manifest `name`, and the page's single `h1` —
the masthead one, which is why the reading area heads its records with an `h2` naming
the mode instead. All of them say **Web Hacking Techniques Index**, with
`alternateName` and the manifest `short_name` keeping *Web Hack List* eligible as the
domain-shaped short form. Never let an archive mode's name reach one of those fields:
a search engine would print it as the name of the site. The smoke test fails if any
signal disagrees, if a view title leaks in, or if a second `h1` appears.

A search engine may take days or weeks to re-crawl and adopt a changed site name.

## Publish the backup with GitHub Pages

The repository workflow in `.github/workflows/pages.yml` publishes the contents of this
directory at the Pages site root and stages every archive document used by the generated
collections plus the annual listing PDFs. Keep this deployment on its default
`https://irsdl.github.io/webhacklist/` URL: it is the backup origin for the two PDFs
that exceed Cloudflare's per-file limit.

In repository **Settings → Pages**, select **GitHub Actions** as the source. Add the
custom domain to Cloudflare Pages, not to this backup deployment. The workflow may also
be started manually.

## Mobile and full-screen use

The sticky mobile header includes a labelled **Themes** chooser, the eight-theme
count and the current view. Its drawer puts themes before project links, keeps
Favourites & Read alongside them, and supports keyboard focus containment and
Escape dismissal. Search stays on its own row with a usable input width.

All archive routes support 320 px-wide screens. The Investigation Board becomes a
single-column tap list on narrow phones; the Terminal, Constellation, readers and PDF
viewer use dynamic viewport units and safe-area insets. Normal desktop browsers show
a persistent top-bar control that puts the complete website into full screen. Signals,
Constellation, Terminal and Investigation Board also show a mode-level control for a
focused, interface-free view. The web app manifest enables an installed standalone
window from a phone's **Add to Home Screen** action, including on iPhones where element
fullscreen is unavailable.

## Archive routes

The navigation order is Investigation Board (01), Museum (02), Library (03),
Time Machine (04), Signals (05), Constellation (06), Hacker Terminal (07), and
Research Desk (08), followed by the Favourites & Read utility (09).

Popup behaviour also belongs to the shared shell. Every modal uses
`wireDialogDismissal` and the `.close-icon` SVG treatment: use the same outside-click
contract and centred close controls when adding a theme or popup. Phone readers
keep a visible outer margin so the backdrop can be tapped. Keep existing
close handlers responsible for playback, iframe, URL and scroll cleanup.
Reset article scroll only after opening and focusing the dialog: a hidden dialog
has no layout box, so a reset before `showModal()` cannot clear the previous offset.

Sidebar geometry belongs to the shared shell: themes can change its palette,
but must not override its row heights, typography, gaps or brand spacing. Keep the
navigation indices and view kickers synchronized. `interface-test.mjs` enforces this.

Two discovery views share the original archive's records and saved/read state:

- `#desk` — **Research Desk**, a blue catalogue with search, author, collection,
  subject, selection, reading-status and video filters; sorting, pagination and compact rows.
- `#time` — **Time Machine**, a violet chronological view with subject filters,
  year jumps, expandable collections and earlier/later archive comparisons.

Both default to dark mode, remember an explicit light/dark preference, and put filters
directly below a compact title and appearance bar. Shared record, report,
submission and search panels use the active palette. The independent reading
theme keeps that colour family in Markdown and the isolated mobile PDF reader.
Preliminary collections remain explicitly unranked. Dates represent collection
years rather than necessarily publication dates. Both views use the shared play
badge and accessible recording labels: confirmed recordings and possible matches
remain distinct. Desk's video filter includes both kinds of link, combines with
its other filters, and clears through Reset filters.

`discovery-test.mjs` checks functional controls, popup palettes, persistence and
mobile navigation. It also tests the real isolated PDF reader and Markdown
switching using production origins intercepted with local files, without fetching
third-party content or weakening the deployed reader's origin restrictions.

Every route is a way into the same archive, so the browser tab always reads
*Web Hacking Techniques Index* and the archive names itself once, in the masthead
heading beside the brand mark. Above the records a route shows only its own name, as
the mode currently open — never as the name of the site.

- Museum at Night — one room per collection, styled in the Signal Observatory's
  instrument theme so both views read as the same receiver
- Infinite Security Library
- Signal Observatory — a longitudinal frequency map for comparing technique
  families across every collection and opening the research behind each peak
- Research Constellation — a freely navigable 3D map of every selected year
- The Hacker Terminal — a green archive console with quick actions, collection
  browsing, readable results, a native text caret and a Run button. Enter runs a
  command; arrows recall history; Tab completes an unfinished prefix and otherwise
  moves focus normally. Complete command also works by touch. Draft input survives
  switching views, and pending commands cannot replace a different active theme.
- The Investigation Board — a draggable corkboard archive view and a compact tap list
  on narrow phones
- Favourite Research — a browser-persistent shortlist shared by every view

This directory is the single production website source and is intended to be committed.

Every artifact can be marked read. Read status persists across all concepts and
appears on exhibits, books, stars and case files. Preserved Markdown opens
in a shared formatted reader with a table of contents, reading progress, code and
table formatting, and links to the raw Markdown, PDF and original source.
The Markdown and PDF viewers share a persistent light/dark reading-theme control.
Light readers use darker variants of each archive view's accent for readable
links, labels and focus indicators. The ambient-motion control remembers your
choice and pauses constellation drift and animated navigation; a system request
for reduced motion takes precedence and updates immediately.
Ambient effects also pause behind open dialogs, avoiding continuous redraws under
their blurred backdrops while a document is being read.
For PDFs the theme changes the viewer controls and surrounding stage while the
browser-native document keeps its original page colours.

Every artifact can also be added to or removed from favourites in the shared
record panel, Markdown reader, PDF viewer, constellation selection and terminal.
Favourite markers appear in every concept, and the Favourites section filters
the saved shortlist by year or topic. The shortlist is stored only in the local
browser and uses normalized source URLs so the same research stays synchronized
when it appears in more than one collection.

## Submitting research

The top bar, the phone menu and the footer all open one submission form
(`#contribute-dialog`, deep-linkable as `#submit`). It is a static page throughout:
nothing is posted from here. The form does the one thing GitHub cannot — as a source URL
is typed it is matched against every loaded collection, reporting an exact record, the
closest titles, or nothing at all — and then builds a prefilled link to the issue form in
[`.github/ISSUE_TEMPLATE/01-submit-research.yml`](../.github/ISSUE_TEMPLATE/01-submit-research.yml).

A URL matches on two keys: the exact normalized address, and a looser host-and-path key
that sees through `http`, `www.`, a trailing slash, a campaign parameter or a Wayback
replay wrapper. Query strings that are not tracking parameters are kept — on a blog of
the era this archive covers, `?p=123` *is* the article.

The prefill parameter names are the field ids in that YAML file, and the year options
must cover the years the collections span; both couplings are asserted by
`smoke-test.mjs`, because a renamed field would otherwise drop an answer silently.

Every selected record has a share action. Sharing from the artifact panel
restores that record in the current archive concept; sharing from the Markdown
reader or PDF viewer restores the exact format and light/dark reading theme.
Yearly results PDFs are shareable too. Browsers with Web Share use the native
share sheet, with a clipboard copy fallback on desktop.

The shared record panel adopts the background palette of the archive concept it
was opened from while retaining the research topic as its narrow accent. Clicking
the dimmed page outside the panel dismisses it, matching the close button.
Research tags are navigation controls: selecting one dismisses the record and
opens an exact, archive-wide tag search without summoning a phone keyboard.

### Signal Observatory controls

- Tune **All traffic** or one topic family to redraw the twenty-year waveform.
- Select a year pulse to inspect its preservation, reading progress and topic
  distribution without losing the longitudinal context.
- The paper list defaults to **All**, visibly carries the Top 10 block into the
  wider research field, and offers counted **Top 10** and **Other research**
  filters. Record markers still distinguish original nominees from work added
  to the archive after the original list. Long lists expand 12 records at a time
  instead of being silently cut.
- Open any paper on the selected frequency in the same artifact, Markdown and
  PDF flow used by every other archive concept.
- Preliminary collections remain explicitly labelled and never show Top 10
  counts or ranking semantics.

### Hacker Terminal controls

- Type `help` for the complete command list.
- `pwd`, `cd /2024`, `cd ..`, `cd /`, and path-aware `ls` navigate a read-only
  virtual filesystem with one directory per collection plus `/favourites`.
- `grep /xss|csrf/i [/path]` searches titles, publishers, topics and URLs with
  regular expressions. Pattern length and input are bounded, while assertions,
  backreferences, repeated groups and ambiguous quantifier combinations are
  rejected before JavaScript's regex engine runs.
- `fav <id>`, `unfav <id>` and `favorites` manage the shared shortlist.
- `open <id> --md` and `open <id> --pdf` use the same shared viewers as every
  other concept; `open <id> --web` opens the original source.
- `history` prints recent commands; Up/down recalls them and Tab completes
  commands, paths and ids.

### Investigation Board controls

- Select a case-folder tab to switch year.
- Drag cards to rearrange the case; the winning evidence remains joined by live
  red string.
- Dense mode fits more evidence on screen, and Reset layout restores the
  deterministic case arrangement.
- Select any card to open the shared artifact panel, Markdown reader or PDF viewer.

### PDF viewer and safety boundary

Preserved PDFs and yearly result listings open in a large viewer with Markdown
switching, read-state, download and separate-tab controls. Desktop browsers keep
their native PDF viewer and its fit controls. Those controls name the view in both
dialects the two viewers read - Chrome takes Adobe's `view` parameter and ignores a
`zoom` it cannot read as a percentage, Firefox's pdf.js takes `zoom` and ignores
`view` - and each change replaces the frame element, because rewriting only a URL
fragment is a same-document navigation that no viewer reloads for and no `load`
event follows. Narrow screens use the archive's page-by-page PDF.js reader so
iPhone WebKit does not stop at an iframe's first page. The application verifies a
local file with a same-origin `HEAD` request and an `application/pdf` response
before embedding it, and waits for the size that probe reports rather than a fixed
few seconds before offering the file to another app instead.

Archive paths are restricted to the expected local Markdown, PDF and yearly-list
directories. External links accept HTTP(S) only and use opener isolation. Raw
Markdown is escaped before formatting, capped at 8 MB, and protected from stale
request races; generated heading ids are namespaced so archived content cannot
clobber the application's own elements. Remote images embed over HTTPS only
(http-only images become links) with referrers suppressed. PDF.js and the
untrusted PDF are hosted in a sandboxed frame on the archive's separate GitHub
Pages file origin; that reader validates its input URL, disables dynamic
JavaScript evaluation, bounds live canvas memory, and cannot access this
application's DOM or storage.
A restrictive content-security policy blocks inline scripts, objects,
unapproved cross-origin frames, forms, media, workers in the main app and
cleartext image loads. The smoke test validates these invariants, actively
exercises hostile Markdown and URL payloads, and validates every referenced
local file.

### Constellation controls

- Drag empty space to orbit; drag a research star to tug it into a nearby position
- Use **Tidy stars** to spring moved research back to its original cluster layout
- Scroll, pinch, use the logarithmic on-screen zoom rail, or press `W` / `S` to fly in and out
- `A` / `D` or left/right arrows orbit; `Q` / `E` move vertically
- Click a research star to identify it; double-click or press `F` to fly to it
- Press `Enter` to inspect the selected article and `R` to return to the full map
- Hold the circular navigator's arrows to move up, down, left or right; use its
  curved arrows to turn and its central thrusters to fly forward or backward
- Toggle **Titles** for collision-aware labels whose size and density respond to
  camera depth
- Use the bottom **All / Top 10 / Other research** filter independently of the
  topic buttons to isolate ranked research or the wider archive field

Topic buttons isolate one cluster without losing its three-dimensional layout. The
year buttons rebuild the map from that year's real titles, while read markers stay
synchronized with every other archive view. Article stars are shaded miniature
planets with deterministic surface bands, grids, continents, fractures, rings and
occasional moons. Top 10 selections are larger and carry restrained white-gold
coronas, crisp rays and compact `✦ #rank` markers. Tugged stars
remain close to their home cluster and settle with a
small spring, while reduced-motion preferences remove the animated return. Rare
comets cross the background slowly, with reduced-motion preferences respected.
