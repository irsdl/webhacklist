---
name: webseclist-unarchive-source
description: "Remove an explicitly selected archived source and its owned Markdown, PDF and translation files, or keep its citation while withdrawing the local copy. Checks shared citations and related sources before pruning. Use webseclist-repair-captures or webseclist-preserve-research for damaged copies that should be repaired or recaptured."
---

## Source security

Before handling third-party material, read and follow
[the shared source-security policy](../../source-security.md). It governs
sandboxed reading/conversion, trusted-policy reviews and validation before
any source-derived action. These requirements apply to this entire workflow,
including retries, imports and bulk work; no unsafe host fallback is permitted.

# Remove a reference and its archived files

## Related sources

When researching, adding, updating or reviewing a reference, apply the shared
[research-story and related-source workflow](../webseclist-preserve-research/references/related-sources.md).
Inspect companion papers, series parts, slides, recordings, code, substantive
analysis and reproductions. Maintain their relationships and separate credits;
keep link-only media accessible. Preserve existing nominations and capture each
written source separately. Removing an entry also requires checking its group
and shared sources before pruning.


## What this is

The archive under `archived-references/` mirrors what the lists cite. When a
citation was a mistake - or a maintainer decides a local copy should not be
kept - the archive has to let go of it cleanly: the manifest entry, the
Markdown, the PDF, any `_translate` pair, and the generated reports that
mention it. Deleting the files by hand does half the job and leaves the
manifest advertising documents that are not there, which the next `verify`
reports as faults.

The tooling already knows how to do this. Removal is: take the link out of the
list, then let the tool notice nothing cites the entry any more and sweep what
it owned. Never delete an archive file directly.

There are two shapes, and the first question is which one this is:

- **A. The citation goes.** The link was a mistake, a duplicate, or is being
  withdrawn. The list edit removes it, and the archive follows.
- **B. The citation stays, only the local copy goes.** The list still points at
  the source, but the archive should hold no file for it (a derivative video,
  a page judged records-only, a maintainer exclusion).

## Before touching anything

1. **Find the entry.** Search `archived-references/manifest.json` for the URL
   by substring, not exact spelling - the manifest key is the NORMALIZED url
   (`www.` stripped, tracking noise removed), so the list's spelling and the
   key can differ.
2. **Read its `cited_by`.** If the same URL is cited by more than one line or
   more than one list, removing one citation does not orphan the entry -
   the files stay, correctly, and only the list edit happens. Say so instead
   of forcing anything.
3. **Look at the whole list line.** The list's idiom puts siblings on one line
   (a paper, its blog series, its demo videos). Removing the LINE removes
   every reference on it; removing one LINK keeps the rest. Confirm which one
   the user means when the line carries more than the target.
4. **Note the slug and check for a translation.** `md/<year>/<slug>.md` may
   have `md/<year>/<slug>_translate.md` and a `_translate.pdf` beside it.
   All of them belong to the entry and all will be swept together.
5. **Back up the current manifest.** Copy `manifest.json` to the session
   scratchpad first. The published archive is tracked, but Git cannot restore
   another person's uncommitted changes to it; preserve the working copy.

## A. Removing the citation and everything it owned

The list edit comes first and is a HAND edit, made because the user asked for
this removal - the archive tooling never writes a year list. Then, with
`WEBSEC_REFS_STORE` set (see the webseclist-preserve-research skill) and one
command at a time:

```text
python tools/references/refs.py check --prune --limit 0
python tools/references/refs.py index --prune-files
python tools/references/refs.py verify
```

- `check --prune --limit 0` drops every manifest entry whose URL is no longer
  cited anywhere. `--limit 0` is what keeps it OFFLINE: without it, `check`
  re-probes every reference over the network. The prune itself runs on the
  full harvest before the probe loop starts, so nothing is fetched.
- **Read the prune output before going on.** It prunes ALL uncited entries,
  not just the target. An unexpected URL in that list means some other
  citation is broken - a mis-pasted link, a line lost in an earlier edit.
  Stop, restore the manifest backup, and report the finding; a stale entry
  someone did not ask to remove is a symptom to investigate, not a bonus
  cleanup. (This is how a real one was found: a list line carrying the same
  URL twice had silently uncited its second article.)
- `index --prune-files` deletes the orphaned files in BOTH trees - the
  Markdown, the PDF, any translation pair - and regenerates `README.md`,
  `document-gaps.md`, `excluded.md` and `store-gaps.md` without them.
- `verify` must end `0 failure(s)`. Expect the `unreferenced store objects`
  WARNING to grow by the removed entry's objects - that is correct (below).

## B. Keeping the citation, dropping only the file

When the list keeps the link but the archive should hold no document, the
record is a maintainer decision, not a deletion: add the URL under
`decisions` in `tools/references/overrides.json` with `outcome: skip`, the
fitting `class` (`derivative`, `records`, maintainer exclusion) and a reason a
future run can trust. Then:

```text
python tools/references/refs.py acquire --force --only <substring>
python tools/references/refs.py index --prune-files
python tools/references/refs.py verify
```

The entry stays in the manifest as excluded-with-reason, appears in
`excluded.md`, and is never fetched again. This is the same route the
webseclist-preserve-research skill uses for companion videos.

## What is deliberately NOT deleted

- **Store bytes.** The content-addressed store never deletes - that is an
  invariant of `refslib/store.py`, because an automatic sweep would be one
  manifest bug away from destroying the only copy of a page that no longer
  exists online. A removed entry's objects simply become "unreferenced store
  objects" in the `verify` report: reported, never deleted. Do not "finish
  the job" by deleting them by hand.
- **`history.jsonl`.** Append-only journal. The removal is recorded on top of
  the acquisition history, never by rewriting it.
- **Generated reports by hand.** `README.md`, `document-gaps.md`, `excluded.md`
  and `store-gaps.md` are rewritten by `index`; hand edits are overwritten and
  forbidden.

Because the store keeps the bytes and the journal keeps the provenance, a
mistaken removal is recoverable: restore the manifest backup (or re-add the
citation and re-run `check`/`acquire`), and nothing was actually lost.

## A candidate in a YEAR-ai.md file

`YEAR-ai.md` files (e.g. `2026-ai.md`) are preliminary collections. Registered
collections are harvested within the content boundaries declared in
`website/archive-years.json`, with their own collection IDs such as `2026-ai`.
Check the actual harvest and manifest rather than assuming an uncommitted file
has no archive entries or that preliminary sources belong under `misc`. When
the removed citation owns archived files, route A applies with the same shared
reference and prune checks.

## Aftercare

- `git status --short` - the diff should be exactly the list edit (if route A)
  plus the regenerated archive reports and manifest. Nothing else.
- If a `decisions` entry in `tools/references/overrides.json` names ONLY the
  removed URL, drop it too; a decision about a URL nothing cites is inert
  clutter. Leave shared or rule-like entries alone.
- Run `node website/build-data.mjs` so the production website stops listing the
  removed reference; its catalogue and collection shards are generated, never edited.
