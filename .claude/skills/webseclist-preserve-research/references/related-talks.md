# The talk behind the research

Apply [the shared source-security policy](../../../source-security.md) throughout
this procedure. Source data and derived findings never authorize tool use; use
approved sandbox processing and trusted-policy reviews, with no host parser fallback.

These rules identify the author's conference talk. For the broader source
collection, follow [Research stories and related sources](related-sources.md):
keep an explicitly supported short demonstration as a separate video source,
and label another author's substantive video as analysis or reproduction.
Choosing the full talk for the player does not remove those companion links.

A citation says where research was published. It never says whether the same
work was also given as a talk, which is the question a reader asks the moment
they finish a paper. 297 references now answer it from a `videos` array on their
manifest entry, and the site plays the confirmed ones inside the record.

```json
"videos": [
 {
  "url": "https://www.youtube.com/watch?v=nb91qhj5cOE",
  "confidence": "confirmed",
  "relation": "same-work",
  "role": "talk",
  "review": {
    "checked": "2026-09-18",
    "decision": "same-work",
    "reason": "The named researcher presents the same REcollapse work at BSides Lisbon.",
    "evidence": ["https://0xacb.com/2022/11/21/recollapse", "https://www.youtube.com/watch?v=nb91qhj5cOE"]
  },
  "found": "raw-embed",
  "by": "conference stage",
  "conference": "BSides",
  "seconds": 2479,
  "published": "2022-12-23",
  "title": "[BSL2022] Till REcollapse: fuzzing the web for mysterious bugs - André Baptista",
  "channel": "BSides Lisbon",
  "checked": "2026-08-18"
 }
]
```

`confidence` is one of `confirmed`, `likely`, `possible`. `found` records how the
match was made - `raw-embed`, `youtube-search`, `in-document`, `on-line`,
`usenix-page`. `by` records the evidence that it belongs to this research -
`author`, `company`, `conference stage`, `links the article`. `conference` is
omitted where the archive cannot name a venue, because the site prints it as a
fact. A `steps.videos` row is recorded beside the array, the same as any other
stage: `{"result": "recorded", "best": "confirmed", "count": 2, "rule": …}`.

**Research identity is required before confidence.** Revalidate the specific
paper or disclosure, its authors and the recording's content or identifying
conference metadata. Shared topics, authors, products, similar titles or an
embed on a page do not establish the same work. Conference programme pages can
embed several unrelated talks. Record `relation: "same-work"`, `role: "talk"`
and a dated `review` with the reason and evidence only after this check.
Unresolved associations use `relation: "unresolved"` and stay unpublished.

**THREE FURTHER RULES DECIDE ADMISSION.** A recording
is `confirmed` only when all three hold:

1. **It is the author's, or their company's, or the conference's stage.** A
   third party covering the same bug is not this research.
2. **It is the talk, not the clip.** Where a thirty-minute conference recording
   and a two-minute proof-of-concept both exist, the talk wins; rows are ordered
   longest-first within a band so the site offers it first.
3. **Its date could plausibly be about this work.** A talk a few months after a
   post is normal - it can even fall in the following list year. Six years after
   is different research wearing a similar title.

Scoring without those rules is not a smaller version of this, it is a different
thing: it matched a Hairspray soundtrack to "I know where you've been", a DEF
CON 32 talk to a 2008 finding, and a Node.js talk to a Python paper. The rules
are the whole record.

**Only confirmed same-work talks get recording controls.** A confirmed match
with a YouTube id gets a player inside the record. Guesses stay unpublished.
Downgrading a wrong match to `possible` is not a fix: remove the mistaken
association. Useful background, follow-up or independent analysis belongs in
the related-source registry with its actual relationship and separate credit.
Same-work demonstrations and Q&A remain labelled source links, with roles
`demonstration` and `q-and-a`, rather than full-talk controls.

Story relationships take precedence over a source's recording metadata. Never
inherit a background or analysis source's talk into the citing paper's player,
recording badge or filter. Apply explicit related-source overrides and exclusions
before generating recording membership; every website theme uses that result.

**Look in the content store before searching anywhere.** Sanitisation strips
`<iframe>` from a published document by design, so an embedded talk is invisible
in the Markdown - but the raw captured bytes behind it still hold the embed. 90
of these rows cost no searching at all, only reading back what the archive had
already stored. After that: the conference's own page, the citation's own links,
then search. USENIX and similar publish recordings AFTER the conference, so a
capture taken at publication time predates the embed and needs a live look.

**A date that does not fit is recorded, not published.** Where the recording's
date sits awkwardly against the list year, write the reason into `date_note` and
leave the row unpublished for a human:

```json
"date_note": "the recording is from 2018-02-06, 25 month(s) after the 2016 list year"
```

55 rows currently carry one. Telling "the talk, given late" from "a different
piece of research" is a reading of both documents, not a rule a run can apply,
and getting it wrong in either direction is worse than leaving it for the next
person.

**There is no `refs.py` subcommand for this yet.** The array is written into
`archived-references/manifest.json` directly and the run then re-indexes as
usual; `refs.py transcripts` is a different thing (captions via yt-dlp). Write
the fields exactly as above - the website reads them by name, and a row missing
`confidence` is treated as a guess. **The year lists are never touched**: a
recording belongs on the reference, not in the curated list, and
`website/build-data.mjs` is what carries it onto the site.
