# Contributing

This archive exists because people keep pointing at things it got wrong or left out.
Every route below ends in the same place: a GitHub issue with enough detail to act on.

**The quickest way in** is the **Submit research** button on
[webhacklist.com](https://webhacklist.com/). It searches the archive as you type — so
you find out immediately whether a source is already recorded — and then opens one of
the forms below with your answers already filled in.

| You want to | File this |
|---|---|
| Propose a technique a year's nomination round missed | [Submit research](https://github.com/irsdl/webhacklist/issues/new?template=01-submit-research.yml) |
| Report a cited link that died or now points somewhere else | [Dead or wrong link](https://github.com/irsdl/webhacklist/issues/new?template=02-dead-or-changed-link.yml) |
| Report a preserved copy that captured the wrong page | [Faulty archived copy](https://github.com/irsdl/webhacklist/issues/new?template=03-faulty-capture.yml) |
| Fix a byline, or add a researcher who is missing from one | [Researcher credit](https://github.com/irsdl/webhacklist/issues/new?template=04-author-credit.yml) |
| Report a website bug, or suggest something | [Website bug or idea](https://github.com/irsdl/webhacklist/issues/new?template=05-website-feedback.yml) |

A pull request is welcome for any of these too — see [Pull requests](#pull-requests) for
which files are hand-edited and which are generated.

## Submitting research

### What the lists already contain

The year lists are **complete with respect to the official rounds**: everything that was
nominated for a given year is already in that year's file. Submitting a technique that
was nominated will find it already there.

What the rounds *missed* is the open question. Research gets overlooked — published late
in the year, posted somewhere the nominators did not read, written in a language the
round did not cover. Those are the additions this repository is still making, and they
are what the submission form is for.

### The bar

A submission is judged as a **technique**, on the evidence, against six weighted
categories — originality, transferability, lasting value, technical soundness,
practical usability and clarity/reproducibility. It is
added only if it passes the judging skill’s current Repository collection merit
and the source, year and non-duplication checks. The merit criteria may change. In practice that means:

- **It is a method, not an incident.** A reusable technique other researchers can apply,
  rather than one site's bug report, a product launch, or a CVE with no new method behind
  it.
- **It was genuinely new when published.** Independent rediscovery of an existing
  technique is honest work and still does not qualify — the check is against prior art,
  not against how well known the technique was at the time.
- **The source is the original.** The researcher's own publication: their post, paper,
  advisory, slides or talk. Not a newsletter, aggregator, or a summary written by someone
  else.
- **It belongs to the year it was published**, whatever year you found it.

Submitting your own research is welcome and uses the same criteria. Tick the author
box on the website or select your connection on GitHub so we can ask you if needed.

### What happens after you file

1. **Triage.** Obvious duplicates and out-of-scope reports are closed with a reason. If
   the source is already in the archive you will be pointed at the entry.
2. **Judgement.** The submission is scored in full, with every result re-verified against
   the primary source rather than taken from the write-up, and checked against prior art
   and against the existing entries for the surrounding years.
   If you selected **I am the author or a co-author** and the work may not qualify,
   we explain the specific concerns, relevant evidence and what would clarify them.
   We keep the submission open for answers to material questions before deciding.
   An explanation or existing link is welcome; no formal rebuttal is needed.
3. **The record.** Public [`ai-evaluation/<year>/`](ai-evaluation/) records show
   candidate links and **Added / Not added**, with decision dates and merit
   revisions in history. Without the author selection, issue and PR replies give a
   concise outcome for each submission. Full evaluations and scores stay in private
   local notes. A lead
   awaiting review is not added, but has not necessarily failed evaluation.
4. **Addition.** Anything that clears the bar joins its year under
   **"Missed from the original list"** — a section kept visibly separate from the
   original nominations, because the archive never blurs what was nominated with what was
   added later.
5. **Preservation.** The source is then captured into
   [`archived-references/`](archived-references/) as readable Markdown and as a PDF of the
   page as published, so the entry survives its host.

Expect this to take a while. Judging one submission properly is slower than filing it.

## Reporting a dead link or a bad capture

These two look similar and are handled differently, so the forms ask different things:

- A **dead link** is a *citation* problem — the URL in a year list no longer reaches the
  research. The fix is a replacement URL: the author's new domain, a mirror they
  published, or a Wayback Machine capture.
- A **faulty capture** is an *archive* problem — the preserved copy exists but holds the
  wrong thing: a consent wall, an error page, a parked domain, a truncated render. The
  fix is a recapture, and the reference is filed for one.

Either report is worth filing even when you have no replacement to offer. Knowing a
capture is wrong is most of the work.

## Pull requests

Some files are curated by hand and some are generated. Editing a generated file is the
one change that will always be asked for again:

| Path | |
|---|---|
| `2006.md` … `2025.md` | **Hand-curated.** Edited only for a reviewed addition or a link fix. |
| `<year>-ai.md` | Machine-assembled candidates for a year with no vote yet. Deliberately separate from the curated lists. |
| `archived-references/manifest.json` and `md/`, `pdf/` | Written by the capture tooling. |
| `archived-references/document-gaps.md`, `store-gaps.md` | **Generated** — record the fault on the manifest entry instead. |
| `archived-references/review-gaps.md` | Hand-written, and never overwritten by a tool run. |
| `website/data/` | **Generated, ignored build output** from `node website/build-data.mjs`. Never stage or commit it; both hosts regenerate it. |
| `website/*.html`, `*.css`, `*.js` | Hand-written, dependency-free, no build step and no framework. |

Before opening a website pull request, from the repository root:

```sh
node website/build-data.mjs      # regenerate the catalogue if list or archive data changed
node website/smoke-test.mjs      # parses every year list and runs the security checks
```

The smoke test is not decoration: it renders hostile Markdown through the real reader,
checks that no unsafe tag survives, and verifies that every archive path the site can
open is one the manifest actually advertises. Keep it passing.

For a **link fix**, one PR per year list is easiest to review. For a **new technique**,
please open the submission issue first — the judgement has to happen either way, and a
PR that adds an entry cannot short-circuit it.

## Ground rules

- **Sponsorship buys nothing here.** Entries are added on the evidence — a nomination in
  that year's official round, or a review-gated audit find. No amount of money puts
  research on a list or takes it off one.
- **Preserved material stays its author's work.** Local copies exist for research and
  historical access, and every entry names and links its source. If you are an author and
  want your document removed from the archive, open an issue and it will be removed.
- **Be accurate about attribution.** Getting credit right is the point of keeping a
  record like this. Corrections are always welcome, from anyone.
