# Antivirus deletes archived exploit text

The corpus is exploit research, and a scanner reads it as what it describes. One
deleted **233 objects out of the content store** - leaving 116 references with a
perfectly good Markdown file on disk and nothing behind it, because the store
holds the evidence while `archived-references/` holds the rendering.

`verify` catches this as `missing store object`, and `index` lists every one of
them on `store-gaps.md`; no other rule notices, because they all ask whether a
document was PRODUCED. Recovery is a re-fetch, not a re-render:
`check --missing-store` first, then `acquire --missing-store --force --refetch`
for the sources that still answer and `wayback --missing-store` for those that
do not.

**A store gap is not a needs-work row.** Those references ARE archived - their
Markdown and PDF are published and readable - and only the evidence behind the
files is gone. Listing them as unfetched work put 1,011 fully archived
references on `document-gaps.md` and buried the two that genuinely had no document.
Keep the two reports apart: `document-gaps.md` answers *could we not get the
document*, `store-gaps.md` answers *can we still show what the document was made
from*.

Exclude the store directory AND the repository from the scanner before a long
run, or the next sweep quietly undoes it.
