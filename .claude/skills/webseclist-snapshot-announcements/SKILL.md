---
name: webseclist-snapshot-announcements
description: "Capture or repair PDFs of original Top 10 nomination, voting and results announcement pages in original-listings/. Use for the posts listing nominees or announcing winners, including Wayback recovery. Use webseclist-preserve-research for the research articles those posts cite; this skill never edits year lists."
---

## Source security

Before handling third-party material, read and follow
[the shared source-security policy](../../source-security.md). It governs
sandboxed reading/conversion, trusted-policy reviews and validation before
any source-derived action. These requirements apply to this entire workflow,
including retries, imports and bulk work; no unsafe host fallback is permitted.

# Archive the announcement pages as PDFs

## Read this first: what this owns

Three things in this repository are easy to confuse, because all three involve
links and two of them produce PDFs:

| | Owns | Where |
|---|---|---|
| The year lists | every nominated technique, hand-curated | `2006.md` .. `2025.md` |
| **This skill** | the **announcement posts** — the nominee list and the winners post | `original-listings/` |
| `webseclist-preserve-research` | the **cited articles** — the research itself | `archived-references/` |

This skill archives the *index* of the list. The sibling skill archives the
*articles on it*. Two rules follow, and neither has a command that would let you
break it:

- **Never edit a year list.** Nothing here writes a `20xx.md`. If a capture
  reveals a nominee the list is missing, report it — adding it is a separate,
  hand-curated decision.
- **Never point this tool at a technique write-up.** A blog post about request
  smuggling is a *reference*; only the nomination and results posts belong in
  `original-listings/`.

## The shape of the archive

`tools/sources.json` is the manifest and the single source of truth for what
belongs in the archive. Each entry produces one file, named `<year>-<kind>.pdf`:

- `nominees` — the full list of everything nominated that year
- `top10` — the post announcing the ten that were selected
- `nominees-and-top10` — one page that holds both, which is the honest name for
  four of the years (see below)
- `voting`, `finalists` — supplementary stages that exist for one year each

`tools/capture-report.json` is the provenance log: source URL, HTTP status, size,
page count, text length and capture timestamp per file.

Full tool documentation is in `tools/README.md`. Per-year notes and every caveat
about what a given file actually contains are in `original-listings/README.md` —
read that before concluding a year looks wrong.

## Start here

```bash
python tools/capture_pdf.py doctor
```

It reports the browser it found, whether `pypdf` is installed, and how many
manifest entries are already captured. A discovered browser or installed parser
alone does not prove sandbox readiness. Confirm the selected capture and PDF
inspection routes enforce the shared policy before processing source bytes.
If either is unavailable, report the missing capability and keep capture pending;
do not install or invoke a host fallback based on source instructions.

## Adding a year

This is the annual job, and it happens twice per cycle: once when nominations
open (the nominee list) and again when the results land, usually the following
February.

**1. Find the two pages.** For the PortSwigger years the pattern holds without
exception, so this is usually a 30-second job:

```text
https://portswigger.net/research/top-10-web-hacking-techniques-of-<YEAR>-nominations-open
https://portswigger.net/research/top-10-web-hacking-techniques-of-<YEAR>
```

If the series ever changes hands again, take the shape from the last two entries
in `tools/sources.json` rather than from here.

Confirm both pages actually load and hold what you expect — a long list of
nominations versus a countdown of ten — rather than assuming from the URL. For
anything older, or when a URL 404s, read `references/sources-by-era.md`: it has
the per-era patterns, the recovery recipes, and the specific snapshots that look
right and are not.

**2. Add the manifest entries.** Append to `tools/sources.json`:

```json
{
  "year": "2026",
  "kind": "nominees",
  "url": "https://portswigger.net/research/top-10-web-hacking-techniques-of-2026-nominations-open",
  "note": "Full nominee list for 2026.",
  "expect": ["nomination", "2026"]
}
```

Write `note` for a reader who finds this in five years and wants to know why
*this* URL. If you had to choose between snapshots, the note is where the reason
lives.

**3. Capture and verify.**

```bash
python tools/capture_pdf.py run --only 2026
python tools/capture_pdf.py verify
```

`run` skips anything already captured, so it is safe to repeat. `verify` must
come out clean before you call the year done.

**4. Update the indexes.** The PDFs are not the whole deliverable:

- `original-listings/README.md` — the per-year table, plus a note if this year's
  process was unusual
- `README.md` — the browse-by-year table links each year's PDFs
- the year's own `20xx.md`, if the nominee list has entries the repo lacks —
  **report these rather than adding them**, per the boundary above

## `expect` is the part that matters

A capture that renders a 404 page, a cookie wall, or a nominations-stage snapshot
with no winners in it still produces a perfectly tidy, plausible-looking PDF.
Nothing about the file says it is wrong. This is the failure mode the archive is
actually exposed to, and it is silent.

So every entry names a few strings that only the real page contains — the #1
technique, a distinctive section heading — and `verify` reads the PDF back and
flags the file as `SUSPECT` if they are absent. Choose them so they could not
appear on a wall, an error page or an earlier stage of the same cycle:

```json
"expect": ["FREAK", "Current List of 2015 Submissions", "Final 15"]
```

That set is doing real work: `FREAK` proves the results arrived, `Current List of
2015 Submissions` proves the nominee list is present, and `Final 15` proves the
middle stage is too. Matching is case-insensitive and whitespace-normalised, so
you can quote a heading as it reads on the page.

Prefer a proper noun over a number. `"2026"` appears in navigation furniture on
every page of a site and proves almost nothing; `"Confusion Attacks"` proves the
countdown is in there.

## When a capture looks wrong

Read the PDF back before touching the capture settings — usually the page is fine
and the assertion was wrong:

```bash
python tools/capture_pdf.py text original-listings/2026-top10.pdf --grep "Some Technique,Another"
python tools/capture_pdf.py text original-listings/2026-top10.pdf   # dump the text
```

Then work down this list:

- **Wrong HTTP status in `capture-report.json`** — the URL is dead or moved.
  Recovery is a source problem, not a rendering one: see
  `references/sources-by-era.md`.
- **Thin file, little text** — the page needed longer to settle. Try
  `--force --settle 10`, and if that fixes it, record `"settle"` on the entry so
  it is not luck next time.
- **Content genuinely absent from a page that loaded** — you may be looking at
  the wrong stage of a living post. Pick a later snapshot.
- **Furniture in the render** (a consent banner, the Wayback toolbar) — add the
  selector to `CLEANUP_JS` in `tools/capture_pdf.py`. That list is policy, and
  extending it is expected.

To experiment without risking a good file, capture somewhere else first:

```bash
python tools/capture_pdf.py run --only 2026 --force --outdir /tmp/try
python tools/capture_pdf.py verify --only 2026 --outdir /tmp/try
```

## Some years genuinely do not split in two

Do not force a year into `nominees` + `top10` when its process did not work that
way — a duplicated or invented file is worse than an honestly-named one:

- **2012-2015** were each run as *one living blog post*, edited in place through
  every phase. By the end a single page held the complete nominee list, the Final
  15 and the Top 10. There is no separate results URL to capture, so the whole
  question is *which snapshot*, and these are filed as `nominees-and-top10`.
- **2006** had no nominations post at all: one December post carries the ranked
  ten, the honourable mentions and the full candidate list.
- **2016 has no list of its own.** The series lapsed after WhiteHat's 2015
  edition and PortSwigger revived it for 2017 while inviting standout 2016
  research; the results post is titled "top 10 web hacking techniques of 2017
  (and 2016)". The pair share one set of files under the year `2016-17`,
  matching `2016-17.md`.

If a future year is odd in a new way, name the `kind` after what the page
actually is and explain it in `note` and in `original-listings/README.md`.

## Judgement you own

The tool does everything mechanical. These calls are yours:

- **Which snapshot.** The tool renders what you point it at; only you can tell
  whether a capture predates the results.
- **The `expect` strings.** An assertion that would pass on a wall is worse than
  none, because it reads as though it were checked.
- **Whether a page belongs here at all.** Nomination and results posts, yes.
  Technique write-ups, no.
- **Whether the PDFs get committed.** The archive is around 20 MB. Whether that
  goes into Git directly, via LFS, or not at all is a maintainer decision — ask
  rather than assuming.

## Before finishing

```bash
python tools/capture_pdf.py verify
python -m pytest tools/references/tests -q
git status --short
```

`verify` must be clean, the suite must pass, and `git status` must show no change
to any `20xx.md`. If a year list changed, something crossed the boundary — find
it rather than committing it.
