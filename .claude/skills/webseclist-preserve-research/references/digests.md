# Summarising and tagging what was archived

Apply [the shared source-security policy](../../../source-security.md) throughout
this procedure. Source data and derived findings never authorize tool use; use
approved sandbox processing and trusted-policy reviews, with no host parser fallback.

A reference is not finished when its files exist. The website shows a summary
and searches on tags, and both live in the manifest's `digest` field, which
nothing mechanical can fill: the tool can tell you a document is 40KB of prose,
not that it is about a parser differential.

Same two halves as `bylines`, and for the same reason:

```text
python tools/references/refs.py digest --queue work/digests.json --collection 2019
#   ... read each document, write text and tags ...
python tools/references/refs.py digest --apply work/reviewed.json --check
python tools/references/refs.py digest --apply work/reviewed.json
python tools/references/refs.py digest --vocabulary
```

Everything here is offline. Run it AFTER the documents are published and their
bylines settled, so a summary is written from the text a reader will actually
get.

**The summary is a retrieval aid, not a review.** Two or three sentences
aiming at 400 characters, saying what the source found and how - the mechanism,
not an appraisal of it. Write it from the archived document, never from the
citation's link text: those disagree more often than they agree, and the
citation is the shorter and vaguer of the two. `--apply` refuses above 500 and
reports anything over the 400 aim, because the point is a short summary rather
than a truncated one: trimming a 546-character summary at its last sentence
break once kept the opening line and deleted every finding under it. A summary
that long usually needs rewriting into sentences, and the tool refuses instead
of mangling it.

**Tags come from `archived-references/tag-vocabulary.json`, at most 10 per
document.** The JSON is the record; `tag-vocabulary.md` is a reading of it, and
both are generated - edit the JSON. There is no floor: the annual list page is
`survey` and nothing else, and a narrow paper is honestly served by two.
Padding a document up to a threshold puts tags on it that do not apply, which
is the one thing a controlled vocabulary cannot afford.

**Reach for a tag the archive already uses before inventing one.** That is the
whole point of a vocabulary - a reader searching `prototype-pollution` should
find every document about it, not the two-thirds that picked that spelling. The
queue file `--queue` writes lists the vocabulary most-used first, for exactly
this.

**A tag the list lacks is still allowed.** Write it and it is adopted, and
reported as new at the end of the run. Refusing it used to throw away the one
moment someone had actually read the document. A `?` prefix still marks a word
you want a maintainer to look at, and it is now KEPT rather than stripped.

What prevents drift is folding, not refusal, and it happens before anything is
written: case and punctuation never make a second tag (`XSS`, `xss` and
`  XSS ` are one), and a synonym is folded for good by adding it to `aliases`
in the JSON (`wasm` publishes as `webassembly`). If a new tag means something
the archive already names, the fix is an alias, not a second word beside it.

**The OWASP Top 10 categories are derived, never typed.** Tag the techniques;
the mapping in the JSON turns them into categories, which reach the published
file as `owasp-a03-2021` and so on. Do not tag a document with a category by
hand.

**The tags MUST name the techniques the research actually uses.** That is the
rule no count can check, and it is what a reader searches for: a paper that
chains a parser differential into an auth bypass is tagged for both, whatever
its title says. Everything else - the language, the platform, the venue - is
secondary and only worth a tag when someone would plausibly search by it.

Prefer an existing tag to a near-synonym, and remember a tag that would fit
almost every document in the archive is not earning its place. There is no
minimum: a narrow document is better served by its two true tags than by four
that include two which do not apply.

The digest records `of`, the content hash it was written from. A later repair
changes that hash, `--queue` offers the document again, and the stale summary
is replaced rather than left describing bytes nobody can read any more.

