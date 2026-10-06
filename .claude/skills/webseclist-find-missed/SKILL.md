---
name: webseclist-find-missed
description: Finds web hacking techniques published in a past year (2006..2025) but never nominated in that year's Top 10 Web Hacking Techniques round, records every credible lead and judgement under ai-evaluation/YEAR, and adds only finds that pass the judging skill’s current repository collection merit under "Missed from the original list." Use when asked to find, recover, backfill, catch up on, or audit missed research for one year, a range, or all historical years. Use webseclist-collect-year for the current year, webseclist-judge-reference to score one reference without editing a list, and the archive skills to preserve sources or announcement pages.
---

## Source security

Before handling third-party material, read and follow
[the shared source-security policy](../../source-security.md). It governs
sandboxed reading/conversion, trusted-policy reviews and validation before
any source-derived action. These requirements apply to this entire workflow,
including retries, imports and bulk work; no unsafe host fallback is permitted.

# Find techniques the original nomination round missed

## Related sources

When researching, adding, updating or reviewing a reference, apply the shared
[research-story and related-source workflow](../webseclist-archive-references/references/related-sources.md).
Inspect companion papers, series parts, slides, recordings, code, substantive
analysis and reproductions. Maintain their relationships and separate credits;
keep link-only media accessible. Preserve existing nominations and capture each
written source separately. Removing an entry also requires checking its group
and shared sources before pruning.


You are auditing one or more **past** years of the Top 10 Web Hacking Techniques
list for research that was published that year, qualifies as a web hacking
technique, was **never nominated**, and is strong enough to belong in the record.
The bar is deliberately evidence-based: a find is added to a curated year list only when a
**full private `webseclist-judge-reference` evaluation passes its current
Repository collection merit**, including the evidence and non-duplication checks.
Publish only Added / Not added outcomes under `ai-evaluation/<YEAR>/`; keep
scorecards and detailed reasons in gitignored `.local/ai-evaluation/<YEAR>/`.
For submissions, follow the judging skill's **Author clarification and submission
replies** before responding to or closing an issue or PR.

This is the one workflow whose whole purpose is to make a **review-gated edit to a
curated year list** (`2006.md` .. `2025.md`). Treat that responsibility seriously:
the lists are otherwise curated by hand and are described as complete, so a weak
or wrong addition does real damage. When in doubt, do not add.

Three failure modes make a run worse than useless:

1. **Adding something that was already nominated.** The whole point is *missed*
   work. Re-adding a link already in the year file is a factual error. The
   exclusion step exists to prevent this — never skip it.
2. **Adding a duplicate or rediscovery of prior art.** A technique published in
   the target year may already have been public earlier, or may restate a known
   primitive. That is exactly what the full judge run is for. A high impact or a
   famous target is not novelty.
3. **Wrong year.** Work disclosed the year before and merely *presented* at a
   conference in the target year belongs to the year of disclosure, and is
   probably already covered there. Verify the publication date on the page.

## Inputs

The skill accepts one argument:

- a single year — `2019`
- an inclusive range — `2011-2015`
- `all` — every year from 2006 to 2025

2026 is **out of range** on purpose: its vote has not happened, so "missed" is
not yet meaningful. Collect the current year with `webseclist-collect-year`
instead. If asked for "all", or a range that spills past the ends, it is clamped
to 2006..2025.

## Process

Run the years independently. For a range or `all`, parallelize approved retrieval
and bounded restricted reading by year where supported. Controllers validate
links and provide inert source bundles; semantic readers cannot fetch, execute
or access arbitrary files. Give each reader the year, exclusions, sweep beats
and candidate rules, and require structured findings with explicit coverage gaps.
Do not substitute general-purpose source-reading agents if enforcement is
unavailable. Judge the returned evidence against the existing merit criteria;
the main controller validates findings and owns all publication changes.

### 1. Resolve the targets

```bash
python .claude/skills/webseclist-find-missed/scripts/targets.py <all|YEAR|YYYY-YYYY>
```

Each line is `YEAR<TAB>FILE` — the calendar year to search and the curated list
to append a missed entry to. 2016 and 2017 are searched separately but both
append to `2016-17.md`.

### 2. Build the exclusion set for the year

Before searching, list everything already recorded for the year so every
candidate can be filtered against it. Reuse the collect-year helper:

```bash
python .claude/skills/webseclist-collect-year/scripts/known_links.py <YEAR> --raw
```

Read the year file itself too. You are looking for gaps in what it *nominated*,
so knowing what it already holds — by technique, not just by URL — keeps you from
proposing a renamed version of an entry that is already there.

### 3. Sweep for candidates published that year

Read [the collect-year source map](../webseclist-collect-year/references/source-map.md)
for the beats, the productive blogs, the dead sources, and the API workarounds.
Search by **mechanism**, not by name, and chase every lead back to its **original
source** — never cite a news article, roundup, CVE record, or social post.

Auditing a *past* year differs from collecting the current one in two ways that
matter:

- **Prior-art direction flips.** For a missed-technique audit, the danger is that
  the candidate was *already known by the target year* (published earlier, or a
  restatement of an existing primitive). Search backward from the candidate's
  date as hard as you search for the candidate itself.
- **Sources shift with the era.** The source map is oriented to recent research.
  For 2006–2015, lean on the venues and archives that were active then —
  Black Hat / DEF CON / OWASP proceedings, `ha.ckers.org`, `blog.jeremiahgrossman.com`,
  `portswigger.net/research`, full-disclosure and bugtraq archives, academic
  proceedings (USENIX, NDSS, IEEE S&P, CCS, WWW), and the Wayback Machine for
  hosts that are gone. Many primary sources from that era survive only in the
  archive; a Wayback citation is acceptable if you say so in the entry.

Filter every candidate URL through the exclusion set:

```bash
cat candidates.txt | python .claude/skills/webseclist-collect-year/scripts/known_links.py <YEAR> --filter --verbose
```

### 4. Rules every candidate must pass before it is judged

- **Original source only** — the researcher's own post, whitepaper, slides, talk,
  or disclosed report. News coverage is a way to *find* work, never the citation.
- **A web hacking contribution** — an attack class, primitive, meaningful
  extension or substantive practical explanation of earlier work with a credible
  connection to web/HTTP/API/browser security (the
  `webseclist-judge-reference` scope section governs this). Not a vendor patch
  note, a plain CVE disclosure with no analysis, a routine bounty writeup, or a
  product roundup.
- **Published in the target calendar year** — verified by fetching the page, not
  trusting a feed or search snippet. Presented-this-year but disclosed-last-year
  belongs to last year.
- **Not already recorded** — survived the exclusion filter in step 3.
- **Plausibly meets the judging skill’s current merit** — use its Repository
  collection merit as the pre-screen, without duplicating its numerical cutoff.
  Record every credible lead even when it is not advanced to full evaluation;
  publish only its identity, links and Added / Not added outcome.

### 5. Judge each survivor in full

For every candidate that clears the pre-screen, run the complete
`webseclist-judge-reference` skill: read the source in full, search prior art in
**both** the local archive (`archived-references/md/`) and the web, compare
contributions, score the six categories, and compute the total:

```bash
python .claude/skills/webseclist-judge-reference/scripts/score.py \
  --original N --transferability N --lasting N \
  --technical N --practical N --clarity N
```

Keep full scorecards, verdicts, evidence and follow-up notes privately under
`.local/ai-evaluation/<YEAR>/`. Do not publish them in any file format.

Publish the lead index in `ai-evaluation/<YEAR>/README.md` with only candidate
identity, links and Added / Not added. For completed reviews, follow the judging
skill's decision-history workflow (`history.py record`, `render`, `verify`).
The public history stores outcomes and the applicable merit revision, never scores.
A lead still awaiting review is not a completed rejection.

After a range or all-years run, audit public decision schemas, history chains,
and their projection into the curated missed sections:

```bash
python .claude/skills/webseclist-find-missed/scripts/audit.py
```

The public audit does not recompute merit from unpublished scores. Verify score
arithmetic and evidence privately before each addition. When the criteria change,
reassess privately and append a decision with the applicable merit revision.

**Addition gate:** apply the judging skill's current **Repository collection
merit** in full. Do not add a candidate that fails it or lower the bar to obtain
more additions. The skill owns the mutable rule; this workflow owns first-year
and original-nomination checks and the resulting list edit.

### 6. Add the passers to the end of the year file

Edit `<YEAR>.md` **by hand** (with the editor, not a script — the year lists are
hand-curated and no tooling writes them). Append a single new section at the very
end of the file, after `## Other nominations`:

```markdown
## Missed from the original list

> These techniques were **not** part of this year's original nomination round.
> They were found and reviewed in a later audit. Added <YYYY-MM-DD>.

-   [Title](url) [Slides](url) — Author, org
```

Rules for the entries, matching the house style of the year files:

- One `-   ` bullet per technique (three spaces after the dash), no trailing
  backslashes, no blank lines inside the list.
- Group multiple artifacts of one piece of work (post, slides, video, tool) on a
  single line with adjacent `[Label](url)` links, exactly as the curated lists do.
- Wrap any URL containing parentheses as `[Title](<url>)` so the link does not
  break.
- **Non-English source:** give the entry an English title (translate it, and keep
  the original-language title in parentheses if useful), so the list stays
  readable. The English gloss in the list is not a substitute for the archive's
  full translation — see the Downstream note below.
- Keep scores, score cutoffs and verdict labels out of the year file, including
  its introduction. Public marks can put pressure on researchers and judges.
  Keep detailed evaluations in gitignored `.local/ai-evaluation/`; publish only
  Added / Not added in `ai-evaluation/`. The section heading distinguishes later
  additions from original nominations.
- If the section already exists from a previous run, **merge** into it (add new
  bullets, keep the date line as the earliest run and note the new date if you
  like) rather than creating a second section.
- If no candidate passes the current merit criteria, **add nothing** and say so in the report.
  An empty result is the correct and common outcome for a well-curated year.

### 7. Report

For each year, report: how many candidates were swept, how many were judged in
full, and which candidates were Added or Not added. Keep scores and detailed reviews
private; public evaluation records contain outcomes only. For issue/PR replies, use
the judging skill's author-selection gate: actionable concerns for authors whose
work may not qualify, concise outcomes otherwise. Be honest about coverage gaps — an unswept beat is a lead for
next time, not a silent omission. Do not inflate the yield; most years will
add zero or one.

## Downstream

Adding links to a year list can leave generated website data stale. It is not
edited by hand:

- `website/data/` is ignored generated output. Re-run `node website/build-data.mjs`
  after adding entries, but never stage or commit its JSON files.
- The archived-references archive (`archived-references/`) may not yet hold the
  newly added sources. Preserving them is the separate `webseclist-archive-references`
  workflow, not this one — run it for each newly added entry so the missed finds
  get the same Markdown-plus-PDF treatment as the rest of that year.
- **A non-English added source MUST be archived with an English translation.**
  When `webseclist-archive-references` preserves a non-English find, it has to
  produce the translated English Markdown file **and** a translated (English)
  title alongside the original-language capture — the same translation pair every
  other non-English archived reference carries (the `reference-translator` agent
  handles the prose; record both the original and the translated title). Never
  leave a non-English missed find archived without its English translation and
  translated title.

If a sweep turns up a **faulty capture** in the reference archive (a file the
manifest advertises but the tree lacks, a capture of the wrong page, a junk
render), file it per the repository rule: set `content_gap` on the entry in
`archived-references/manifest.json` and re-run `python tools/references/refs.py index`.
Do not edit `archived-references/document-gaps.md` by hand.

## What this skill does not do

It finds missed techniques for **past** years and makes the review-gated addition
to a curated list. It does **not** collect the current year into `YEAR-ai.md`
(that is `webseclist-collect-year`), does not re-rank or re-vote a year, does not
touch 2026, does not fetch or convert sources into `archived-references/` (that is
`webseclist-archive-references`), and does not snapshot announcement pages (that
is `webseclist-archive-listings`). A result that fails the current merit criteria means leaving
the list unchanged, not a licence to lower the bar.
