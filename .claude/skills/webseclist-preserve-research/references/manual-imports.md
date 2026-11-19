# Importing documents obtained by hand

Apply [the shared source-security policy](../../../source-security.md) throughout
this procedure. Source data and derived findings never authorize tool use; use
approved sandbox processing and trusted-policy reviews, with no host parser fallback.

Some sources no automated route can reach: an image-only PDF, a page behind a
wall, a talk with no captions. Convert supplied bytes only through the approved
offline sandbox route and transcribe under the shared review policy. A manual
import is not an exception to process isolation or the source trust rules. If the
required conversion route is unavailable, keep the item pending with the precise blocker. The controller
validates the inert results, puts them in one scoped staging directory, and runs:

```text
python tools/references/refs.py import <directory>
python tools/references/refs.py index --prune-files
```

The directory's path is never written into tracked output. Several files for one
document are joined; files that are not the same document are split apart; a file
matching no reference is REPORTED rather than guessed at (rename it after the
reference's URL or title, or drop a `<file>.url` beside it stating the URL). An
import is sticky - a later `acquire` leaves it alone unless you pass
`--replace-imports`.

For page-image transcription split across readers, name the complementary
chunks `<document>.part01.md`, `<document>.part02.md`, and so on. That explicit
convention is concatenated in numeric order without de-duplication; ordinary
same-document files are treated as alternative converter attempts instead.
Put the `.url` sidecar beside part 1 and verify the chunks cover every rendered
page exactly once before importing.

**Write the `.url` sidecar with NO byte-order mark.** The stated URL is matched
against the citation's spellings exactly, so a leading BOM makes it match
nothing and the file is reported unmatched with no hint why. Windows PowerShell
5.1's `Set-Content -Encoding utf8` writes one; use a plain-UTF-8 writer instead.
Include the fragment if the citation has one - `#slide=id.p` is part of the
spelling.

**A hand-downloaded PDF can be adopted as the reference's original bytes.** Put
the readable text through `import` as the document, then store the PDF as
`raw_sha256`: `refs.py pdf` copies stored PDF bytes verbatim, so the PDF tree
carries the author's own file instead of a re-render of our Markdown. Record
where the bytes came from - a person, not a fetch. This is the route for a
Google Slides deck, which serves a permission page to the export endpoint and
renders to canvas, leaving no text for any automated route to read.

`import` performs that adoption automatically when exactly one complete PDF
contributed to the imported text: it stores the PDF as `raw_sha256` and records
the `manual-source` step. It refuses to guess between multiple PDF candidates
and refuses a file without a trailing `%%EOF`. An entry whose earlier imported
raw or content hash is missing from the active store is eligible for repair
without `--redo`; use the same supplied PDF to restore both objects.

**A citation with no usable title needs `decisions[url].title`.** One whitepaper
is cited as a bare footnote link, so its recorded title is `1` and it filed
itself as `1.md`; the PDF was image-only, so there was no page text to correct
it from either. State the real title in `overrides.json` and re-import: the
import path honours it, rebuilds the slug and renames the file.

**Never run an unscoped `import --redo`.** It reopens every past import and is
far broader than correcting one document. Use `import --redo --only
<citation-substring> <directory>`; matching still compares the file against the
whole manifest, but only that citation becomes eligible and only it can be
reported as reassigned.
