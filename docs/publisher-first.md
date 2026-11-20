# WebHackList publishing policy

WebHackList is an independent directory and preservation archive: **Web hacking
research lists and archive**. PortSwigger runs the
[official initiative](https://portswigger.net/research/top-10-web-hacking-techniques).
Keep its official project name, historical results, titles, rankings and credits.
Use WebHackList for this repository, its website, installed shortcut and sharing.

## Reading and preserved copies

The action order is **Read article ↗ · Sources & details · View Markdown · View
PDF**. Opening a record remains separate from reading a source. Existing record,
Markdown, PDF and companion deep links retain their meaning. Annual announcement
PDFs belong in the year's announcement provenance, never the article action row.

`website/research-context.json` maintains reviewed publication destinations and
organiser-documented exclusions. It supplements the archive manifest; it does not
change source identity or story IDs. A publication override has `citation`,
`originalUrl`, `availability` (`live`, `unverified`, `dead`, or `replaced`),
`checked` (ISO date) and factual `evidence`. Its optional `snapshot` has `url`,
`verified: true`, `checked` and identity-review `evidence`. The replay must be for
the same original URL. Review source identity through the source-security workflow
before adding one. Keep transient fetch failures and browser restrictions separate
from confirmed dead/replaced publications. An empty publications array means no
overrides have been verified; old manifest health probes are not silently promoted.
Historical Wayback citations retain their identity, but without reviewed availability
metadata the reading action tries the underlying publication.

Known live and unverified publications open the publisher. Confirmed dead/replaced
ones open only a verified replay, labelled **Read article — Web Archive**. Without
one, explain the missing destination and offer any preserved copies. Never perform
an availability probe on a click. Apply this rule separately to each companion.

Readers identify preserved copies, original authors, publishers and publication
links; translations identify both English and original-language copies. Repository
copy controls use the actual archived path on `irsdl/webhacklist`'s `master` branch,
with each URL component encoded. The data build rejects missing advertised files;
file an archive fault under `CLAUDE.md` before repairing one. No file means no copy
control. Clipboard failure leaves an explicitly labelled selectable URL; static
pages also retain ordinary GitHub file links without JavaScript.

## Original-list membership and exclusions

Original list means original nominations and winners **plus organiser-documented
conflict-of-interest exclusions**. It does not assert that every item reached the
nomination list. Exclusions require a citation, year, stage, reason, explanation,
organiser announcement and checked date. Never infer one from prose or publisher.
They receive **Held out — conflict of interest**, retain their stable IDs and have
no invented final rank. Later discoveries remain later additions.

The seven initial records were checked on 20 November 2026 against these primary
announcements:

- [2016/17](https://portswigger.net/research/top-10-web-hacking-techniques-of-2017):
  Cracking the Lens and XSS without HTML were excluded before nominations; the
  later recusal system arrived too late to reintroduce them.
- [2019](https://portswigger.net/research/top-10-web-hacking-techniques-of-2019):
  HTTP Desync Attacks was the community favourite; its author declined a final
  Top 10 ranking for his own research.
- [2024](https://portswigger.net/research/top-10-web-hacking-techniques-of-2024):
  three PortSwigger entries reached the community's final fifteen and were then
  withheld from the panel vote.
- [2025](https://portswigger.net/research/top-10-web-hacking-techniques-of-2025):
  HTTP/1.1 Must Die reached the final fifteen and was excluded from the final ten.

## Preliminary collection lifecycle

`website/archive-years.json` owns lifecycle metadata. The 2026 research collection
freezes at **00:00 UTC on 1 January 2027** so PortSwigger's submissions and voting
can proceed without confusion from changes to this independent list. Keep routine
collection updates frozen through those rounds **and for fourteen days after
PortSwigger announces the winners**. Keep the existing as-of date and preliminary notice.
Factual, attribution, preservation and broken-link corrections remain available.
Check the freeze before discovery or merging additions, including repeated
whole-year sweeps; do not silently advance or unfreeze it.

Supported stages are `preliminary`, `nominations-open`, `voting-open`, `frozen`,
`results-announced` and `official-results`. Maintain the official hub destination and `checked` date.
An open stage requires the corresponding `nomination` or `voting` object with a
year-specific PortSwigger `url`, `verifiedOpen: true`, `checked` date and `evidence`.
Verify that stage is still open when maintaining it; clear it on closure. Calendar
dates and last year's pages cannot establish participation. Until a round is
verified, show the hub link. Local additions stay frozen while verified official
nomination or voting links remain available; these are separate states.

When the actual winner announcement is verified, record its primary URL in
`resultsAnnouncement`, its actual publication timestamp in `resultsAnnouncedAt`
(UTC), and set `stage: "results-announced"`. Keep `importDelayDays: 14` and leave
`officialCollection` and `resultsImportedAt` empty. Derive the earliest import
instant from the announcement plus fourteen complete days. Do not use the page's
later update time or the calendar alone as evidence.
An elapsed waiting period makes the import eligible; it does not publish results
automatically or permit routine updates to the frozen AI list.
The registry's `delayedOfficialImports` list keeps the requirement attached to
`2026` after the active AI entry is replaced; a final entry without its announcement
and import evidence is rejected.

After that waiting period, import the verified official results and **replace the
active `2026-ai.md` collection with `2026.md`**. Preserve the frozen AI list outside
the active root year lists, for example as `collection-snapshots/2026-ai.md`, with
its original unranked status and provenance. Remove its separate active registry
entry; publish the new `2026` entry as final and ranked. Carry its lifecycle
metadata into the new entry, set `stage: "official-results"`,
`officialCollection: "2026"`, and record the actual `resultsImportedAt` timestamp.
The build rejects imports before the fourteen-day boundary. The official `2026`
collection then becomes the default.

Reconcile entries using stable story/source identities and explicit aliases in
`story-identities.json`. Provide compatibility for old `2026-ai` site links and
record IDs, and retain researcher credits, saved-state identities and existing
preserved-file paths/history. Review relationships before assigning shared
identities. Only official results establish rank; archive-only additions remain
separate. The archived AI snapshot must never be presented as an official ranking.

## Indexing limits and validation

Cloudflare's configured `X-Robots-Tag: noindex` covers preserved MD/PDF files and
announcement copies. The standalone PDF reader also has a noindex meta tag and
Cloudflare header. Interactive reader/PDF/results routes set noindex while open.
Catalogue pages contain archive summaries and original attribution, not research
bodies; structured data identifies the research's author, publisher and original
URL. Raw copies and reader URLs stay out of the sitemap.

Allow crawling so crawlers can observe noindex, as explained by
[Google's guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
GitHub Pages ignores `_headers`: the alternate reader has a noindex meta tag, but
**raw oversized PDFs on that origin have no configurable noindex response header**.
The project's `/webhacklist/robots.txt` cannot replace the origin-root robots policy.
GitHub repository file pages also use GitHub's own indexing and response policy.
This project cannot guarantee their exclusion or changes to search rankings.
After an authorised deployment, inspect actual headers on both origins and all
exact oversized fallback URLs; local staging does not prove deployment behavior.

Use `python website/container-build.py --refresh` to regenerate source groups and
website data and validate both hosting targets offline. Workers receive selected
read-only public inputs; generated files return through a bounded, validated
controller stream. The catalogue publishes after its shards. Run
`publisher-first-test.mjs` and `publisher-first-browser-test.mjs` for destination,
clipboard, translation, stage, exclusion, desktop/mobile and keyboard contracts.
Keep `website/data/` ignored. Publication requires the task's authorisation.
