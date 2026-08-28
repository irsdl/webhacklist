#!/usr/bin/env python3
"""refs.py - the reference archive tool for the Top 10 Web Hacking Techniques list.

Dev-only tooling for this repository. It is not part of the reading list and it
changes no list content.

RESPONSIBILITY BOUNDARY. The year lists - `2006.md` through `2025.md`, plus
`2016-17.md` - are curated by hand and are the INPUT here. This tool READS them
and writes the archive under `archived-references/`, its manifests, and the external
content store. It never writes a year list, never writes the curation ledger, and
imports nothing from `.claude/skills/`. The flow is one way:

    year lists -> archive inventory -> acquisition -> Markdown -> PDF

Sibling tool, not to be confused with this one: `tools/capture_pdf.py` archives
the ANNOUNCEMENT POSTS (each year's nominee list and results post) into
`original-listings/`. This tool archives the research those posts point at.

See `.claude/skills/webseclist-archive-references/SKILL.md` for the operational
guide. Run `python tools/references/refs.py <command> --help` for a command.
"""

import argparse
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))

# The corpus is multilingual, and a Windows console defaults to cp1252. Printing
# a Polish surname killed a whole report mid-run, which is a reporting tool
# losing its output to its own terminal. Degrade the character, never the run.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):    # a pipe or a test harness capture
        pass

from refslib import check as check_module              # noqa: E402
from refslib import collections as collections_module  # noqa: E402
from refslib import grade as grade_module              # noqa: E402
from refslib import harvest as harvest_module          # noqa: E402
from refslib import indexer as indexer_module          # noqa: E402
from refslib import inventory as inventory_module      # noqa: E402
from refslib import ledger as ledger_module            # noqa: E402
from refslib import manifest as manifest_module        # noqa: E402
from refslib import paths                             # noqa: E402
from refslib import sources as sources_module          # noqa: E402
from refslib import slugs as slugs_module              # noqa: E402
from refslib.exclusions import Classifier             # noqa: E402


def _missing_store_keys(manifest, store):
    """Manifest keys whose named evidence is absent from the active store."""
    return {key for key, entry in manifest.data["urls"].items()
            if indexer_module.lost_bytes(entry, store)}


def _entries_after(entries, needle):
    """Return entries strictly after the first key containing ``needle``."""
    lowered = (needle or "").lower()
    if not lowered:
        return entries
    for number, (key, _entry) in enumerate(entries):
        if lowered in key.lower():
            return entries[number + 1:]
    raise paths.SetupError("--after matched no manifest identity: " + needle)


def _held_capture_is_readable(entry):
    """Whether held bytes may set a minimum-size floor for a replacement."""
    acquire_result = ((entry.get("steps") or {}).get("acquire") or {}).get("result")
    faulty = (entry.get("content_gap") or "").startswith("faulty capture:")
    return acquire_result not in (None, "failed", "review", "needs-browser") and not faulty


def _apply_title_override(record, entry, corrected, taken):
    """Apply a human title decision to heading and a stable rebuilt slug."""
    if not corrected:
        return
    record["title"] = corrected
    available = set(taken) - {entry.get("slug")}
    record["slug"] = slugs_module.build(
        corrected, record.get("publisher") or "",
        slugs_module.year_of(record.get("published") or ""),
        taken=available)


def _apply_attribution_override(entry, judged, record=None):
    """Apply a human decision about who wrote a reference, and who published it.

    Extraction can only read an author a page DECLARES, in a meta tag or in
    JSON-LD. A whitepaper carries its byline in body text and a 2008 blog
    carries none at all, so 1,261 of 1,684 references render "Author not
    stated" - including whitepapers that name their author on page one, and
    articles left credited to nothing but a hostname because the domain outlived
    the blog and now sells itself. The document names its author; only the
    metadata does not. That is a fact a human can state and a fetch cannot,
    which is why it belongs here beside the curated title rather than hand-poked
    into the generated manifest.

    Written to the manifest entry, because `render` builds its attribution block
    from the entry; also to `record` when the caller holds one, because the
    fetch path renders from the acquisition result rather than from the entry.

    THE KEY BEING PRESENT IS THE STATEMENT, and what it holds is what it states.
    An absent `authors` leaves extraction alone; an empty one states that the
    archive credits nobody. Reading only truthy values meant a name could be
    written but never taken back: deleting a wrong one from the decision merely
    restored silence, which reads as "nothing to say" and skips the entry, so
    the misattribution outlived its own correction. A list holding only blank
    names is a typo rather than a retraction, and is still ignored.
    """
    curated = judged or {}
    stated = {}
    if "authors" in curated:
        listed = curated.get("authors") or []
        names = [str(name).strip() for name in listed if str(name).strip()]
        if names or not listed:
            stated["authors"] = names
    if "publisher" in curated:
        stated["publisher"] = str(curated.get("publisher") or "").strip()
    for target in (entry, record):
        if target is None:
            continue
        for field, value in stated.items():
            target[field] = list(value) if isinstance(value, list) else value
    return bool(stated)


def attribution_decision(key, entry, decisions, readings):
    """What the archive states about WHO WROTE THIS, and nothing else.

    Returns only `authors` and `publisher`, never an outcome, class or title,
    because the callers feed the result to `_apply_attribution_override` rather
    than to the grader. Keeping the two apart is the whole point: a reviewed
    byline briefly lived in `paths.decisions()`, where `grade.decide` read it as
    a complete judgement, defaulted its missing `outcome` to "skip", and wiped
    the grade of 214 research references in a single run.

    A hand statement in `overrides.json` wins outright, including when it states
    nobody. The reading is evidence; the maintainer is the authority.
    """
    hand = maintainer_decision(key, entry, decisions) or {}
    stated = {field: hand[field] for field in ("authors", "publisher") if field in hand}
    if "authors" in stated:
        return stated
    for candidate in [key] + list(entry.get("spellings") or []):
        reading = readings.get(candidate) or readings.get(candidate.rstrip("/"))
        names = [str(name).strip() for name in ((reading or {}).get("authors") or [])
                 if str(name).strip()]
        # A review that found nobody recorded that it looked. It must not become
        # an empty `authors`, which means "credit nobody" and would withdraw a
        # name extraction had legitimately declared.
        if names:
            stated["authors"] = names
            break
    return stated


def _carry_preserved_facts(record, entry):
    """Give the RENDER the facts the MANIFEST just kept.

    `acquire` copies a field from the fresh record to the entry only when the
    fetch actually found one, so a source that declares nothing leaves the
    manifest's existing publisher, date, licence or byline standing. `render`
    reads the RECORD, though, so without this the published file contradicts
    the manifest it was rendered from - and silently, because both look fine on
    their own.

    Found on NCC Group's "State of DNS Rebinding in 2023": the article moved to
    a page that states its date only in a search-index meta tag, so a re-render
    printed "Published: date not stated" over a recorded 2023-04-27.

    Only fills what the record LACKS. A fetch that found a fact still wins, so
    this cannot pin a stale value on a page that corrected itself.

    The DIGEST is carried the same way and for the same reason: a fetch never
    produces one, so without this a re-acquire republishes the document with no
    `description` and with its research tags stripped back to the format
    labels. That is silent - the summary is still in the manifest, and only the
    published file loses it.

    A digest is carried only while it still describes the bytes on disk. Its
    `of` records the `content_sha256` it was written from, so when a re-fetch
    brings NEW content the old summary is dropped rather than published over
    it, and `digest --queue` lists the reference for a fresh reading.
    """
    for field in ("licence", "publisher", "published", "language", "authors"):
        if entry.get(field) and not record.get(field):
            record[field] = entry[field]
    digest = entry.get("digest") or {}
    if digest.get("text") and not record.get("digest"):
        if digest.get("of") == record.get("content_sha256"):
            record["digest"] = digest
    return record


def _gap_after_acquire(entry, record, previous_raw):
    """The content gap to keep once an acquire has run.

    The gap MIRRORS the record rather than only overwriting when non-empty.
    Copying it on truthiness meant a gap could be recorded but never cleared:
    three slide decks kept "we only have a page about it" after the run that
    proved the page carries the deck.

    EXCEPT when the fetch brought back the bytes we already had. A hand-filed
    "faulty capture:" is a maintainer's judgement that acquisition cannot make
    for itself, and identical bytes prove the run changed nothing - so clearing
    the report there erases a fault that is still true, and drops the reference
    off document-gaps.md where nobody will see it again.

    Found on the CRLF-desync teaser: `acquire --force --refetch` re-fetched the
    same page, reported "stored", and wiped the report saying the page is the
    pre-talk teaser rather than the write-up.
    """
    filed_by_hand = (entry.get("content_gap") or "").startswith("faulty capture:")
    bytes_unchanged = bool(previous_raw) and previous_raw == record.get("raw_sha256")
    if filed_by_hand and bytes_unchanged:
        return entry["content_gap"]
    return record.get("content_gap") or ""


def _slug_after_attribution(entry, judged):
    """The slug the next `acquire` would build, when a stated publisher moves it.

    The offline path records attribution and touches no file, but `acquire`
    rebuilds a CORRECTED TITLE'S SLUG FROM THE PUBLISHER. State a publisher on a
    reference that also carries a title correction and the two routes disagree:
    the manifest keeps the old file name, and the next re-render renames the
    published document and orphans what it replaced. The rename is right - a
    file named after a squatter should not survive - but a maintainer should
    read it here rather than find it in `verify` afterwards.

    Indicative only: the collision suffix depends on what else is taken at the
    time, which is knowledge the run that renames it has and this one does not.
    """
    corrected = (judged or {}).get("title") or ""
    if not corrected:
        return ""
    rebuilt = slugs_module.build(
        corrected, entry.get("publisher") or "",
        slugs_module.year_of(entry.get("published") or ""), taken=set())
    return rebuilt if rebuilt != entry.get("slug") else ""


def _attribution_changes(urls, decisions, readings=None):
    """Every reference whose recorded credit the curated statements would alter.

    Applies as it compares, because a statement is only legible as a change once
    it has been written onto the entry. Nothing here saves: the caller decides
    whether the in-memory result is written, which is what lets `--check` report
    the same list without touching the manifest on disk.
    """
    readings = readings or {}
    changes = []
    for key, entry in sorted(urls.items()):
        stated = attribution_decision(key, entry, decisions, readings)
        if not stated:
            continue
        before = (list(entry.get("authors") or []), entry.get("publisher") or "")
        _apply_attribution_override(entry, stated)
        after = (list(entry.get("authors") or []), entry.get("publisher") or "")
        if after != before:
            # The rename check needs the TITLE, which lives on the hand decision
            # and never on a reading, so it is looked up rather than passed on.
            changes.append((key, before, after, _slug_after_attribution(
                entry, maintainer_decision(key, entry, decisions) or {})))
    return changes


def _frontmatter_scalars(text):
    """Read the top-level scalar values emitted by ``render._frontmatter``.

    This is deliberately not a general YAML parser.  A translation may be
    added years after the original was rendered, and the manifest historically
    did not retain the four retrieval fields that attribution requires.  The
    existing archive file is the authority for those values.  Its writer emits
    JSON-compatible double-quoted scalars or plain one-line values, so reading
    just that narrow format keeps translation rendering dependency-free.
    """
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}
    result = {}
    for line in text[4:end].splitlines():
        if not line or line[0].isspace() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip()
        if not value:                 # a mapping/list header such as ``sources:``
            continue
        if value.startswith('"') and value.endswith('"'):
            try:
                value = json.loads(value)
            except ValueError:
                continue
        elif value in ("[]", "{}"):
            continue
        result[key] = value
    return result


def _render_stored_translation(key, entry, store, root, config):
    """Render one already-stored translation without fetching its source.

    ``acquire --force`` used to be the documented way to materialise a
    translation.  Besides touching the whole corpus, that route intentionally
    skips hand imports - exactly the PDFs and OCR transcripts that most often
    need translating.  This path reads only content-addressed objects and the
    original file's own provenance, then writes the paired Markdown files.
    """
    from refslib import render as render_module

    content_sha = entry.get("content_sha256")
    translation_sha = entry.get("translation_sha256")
    if not content_sha or not store.has(content_sha):
        raise paths.SetupError("original content is absent from the active store")

    archive_dir = root / (config.get("archive_dir") or "archived-references")
    slug = entry.get("slug")
    if not slug:
        raise paths.SetupError("the reference has no archive slug")
    original_path = archive_dir / collections_module.md_relpath(entry, config, slug)
    if not original_path.exists():
        raise paths.SetupError("the original Markdown file is absent: %s"
                               % paths.rel(original_path, root))
    translated_path = archive_dir / collections_module.translated_md_relpath(
        entry, config, slug)
    if not translation_sha or not store.has(translation_sha):
        if not translated_path.exists():
            raise paths.SetupError("translation is absent from both the active store "
                                   "and the paired Markdown file")
        recovered = render_module.translation_body(
            translated_path.read_text(encoding="utf-8"))
        translation_sha = store.put_text(recovered)
        entry["translation_sha256"] = translation_sha

    # Preserve the retrieval facts exactly as the published original records
    # them.  Newer manifest fields win for everything else, including the
    # translated title and publisher that were just applied.
    old = _frontmatter_scalars(original_path.read_text(encoding="utf-8"))
    record = dict(entry)
    for field in ("original_url", "retrieved_from", "retrieved_kind",
                  "retrieved_utc", "snapshot", "canonical_url", "commit",
                  "depth_reason"):
        if old.get(field) and not record.get(field):
            record[field] = old[field]
    record.setdefault("original_url", (entry.get("spellings") or [key])[0])
    record.setdefault("retrieved_from", record["original_url"])
    record.setdefault("retrieved_kind", "preserved")
    record.setdefault("retrieved_utc", ((entry.get("steps") or {}).get("render")
                                         or {}).get("utc"))
    record["translation"] = store.get_text(translation_sha)
    depth = entry.get("depth") or old.get("depth") or "full"

    original = render_module.render(record, store.get_text(content_sha), depth)
    translated = render_module.render_translation(record, record["translation"], depth)
    translated_path.parent.mkdir(parents=True, exist_ok=True)
    original_path.write_text(original, encoding="utf-8", newline="\n")
    translated_path.write_text(translated, encoding="utf-8", newline="\n")
    return original_path, translated_path, len(original), len(translated)


def _import_needs_content(entry, store, redo=False):
    """Whether a hand import may repair this entry without broad ``--redo``."""
    if indexer_module.lost_bytes(entry, store):
        return True
    if ((entry.get("steps") or {}).get("acquire") or {}).get("result") != "stored":
        return True
    if entry.get("content_gap") or (entry.get("grade") or "research") != "research":
        return True
    return bool(redo) and ((entry.get("steps") or {}).get("import") or {}).get(
        "result") == "stored"


def command_harvest(args):
    """Find every cited URL in tracked files and classify it. Read-only."""
    root = paths.repo_root()
    config = paths.config()
    result = harvest_module.run(root=root, config=config, classifier=Classifier.load())

    if args.json:
        payload = {
            "files_read": result.files_read,
            "files_skipped": result.files_skipped,
            "kept": [
                {
                    "normalized": reference.normalized,
                    "spellings": reference.spellings,
                    "title": reference.title,
                    "cited_by": [occurrence.cited_by() for occurrence in reference.occurrences],
                }
                for reference in result.references.values()
            ],
            "excluded": [
                {"url": occurrence.url, "cited_by": occurrence.cited_by(),
                 "rule": rule.id, "reason": rule.reason}
                for occurrence, rule in result.excluded
            ],
        }
        json.dump(payload, sys.stdout, indent=2, sort_keys=False)
        sys.stdout.write("\n")
        return 0

    print("Harvest (read-only, tracked files only)")
    print("  files read     : %d" % result.files_read)
    print("  files skipped  : %d (binary, generated, or resolving outside the repo)" % result.files_skipped)
    print("  unique kept    : %d" % len(result.references))
    print("  occurrences    : %d" % sum(len(r.occurrences) for r in result.references.values()))
    print("  excluded       : %d" % len(result.excluded))

    areas = {}
    for reference in result.references.values():
        for occurrence in reference.occurrences:
            areas[occurrence.area] = areas.get(occurrence.area, 0) + 1
    print("\nKept occurrences by area:")
    for area in sorted(areas, key=lambda name: -areas[name]):
        print("  %-14s %d" % (area, areas[area]))

    by_rule = {}
    for occurrence, rule in result.excluded:
        by_rule.setdefault(rule.id, {"reason": rule.reason, "urls": []})["urls"].append(occurrence)
    print("\nExclusions by rule:")
    for rule_id in sorted(by_rule, key=lambda name: -len(by_rule[name]["urls"])):
        entry = by_rule[rule_id]
        print("  %-26s %4d  %s" % (rule_id, len(entry["urls"]), entry["reason"]))
        if args.show_excluded:
            for occurrence in entry["urls"]:
                print("      %s  (%s)" % (occurrence.url, occurrence.cited_by()))

    if args.show_kept:
        print("\nKept references:")
        for reference in result.references.values():
            print("  %s" % reference.normalized)
            for occurrence in reference.occurrences:
                print("      %s" % occurrence.cited_by())
    return 0


def command_inventory(args):
    """Parse every finalized/preliminary source and prove the parse is faithful."""
    root = paths.repo_root()
    config = paths.config()
    failures = 0
    source_files = sources_module.source_files(config, harvest_module.tracked_files(root))
    for relative in source_files:
        path = root / relative
        if not path.exists():
            print("MISSING  %s" % relative)
            failures += 1
            continue
        text = path.read_bytes().decode("utf-8")
        document = inventory_module.parse_text(text, relative)
        faithful = inventory_module.round_trip_ok(document, text)
        allowed = {number for number, _line in
                   sources_module.bounded_lines(relative, text, config)}
        entries = [entry for entry in document.entries if entry.line_number in allowed]
        sections = {}
        for entry in entries:
            key = entry.section or "(no section)"
            if entry.subsection:
                key += " / " + entry.subsection
            sections[key] = sections.get(key, 0) + 1
        print("%s" % relative)
        print("  round trip     : %s" % ("byte for byte" if faithful else "MISMATCH"))
        print("  entries        : %d" % len(entries))
        print("  titled / bare  : %d / %d"
              % (sum(1 for e in entries if e.shape == "markdown"),
                 sum(1 for e in entries if e.shape == "bare")))
        for key in sections:
            print("    %-40s %d" % (key, sections[key]))
        if not faithful:
            failures += 1
        if args.show_entries:
            for entry in entries:
                print("    %s  %s" % (entry.cited_by(), entry.url))
    if failures:
        print("\n%d document(s) failed to parse faithfully. Nothing was written." % failures)
    return 1 if failures else 0


def _reference_in_collection(reference, collection, config):
    if not collection:
        return True
    return any(collections_module.name_for_file(occurrence.file, config) == collection
               for occurrence in reference.occurrences)


def _entry_in_collection(entry, collection, config):
    return not collection or collections_module.collection_of(entry, config) == collection


def _relocate_published(root, config, manifest):
    """Move existing rendered files to the folder implied by current citations."""
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    moved = 0

    def rewrite_citations(path, cited_by, row):
        text = path.read_text(encoding="utf-8")
        replacement = "cited_by:\n" + "".join(
            "  - %s\n" % json.dumps(site, ensure_ascii=False) for site in cited_by)
        updated, count = re.subn(
            r"(?m)^cited_by:(?: \[\])?\n(?:  - .*\n)*", replacement, text, count=1)
        if count != 1:
            raise paths.SetupError("cannot update generated cited_by frontmatter in "
                                   + paths.rel(path, root))
        if updated != text:
            path.write_text(updated, encoding="utf-8", newline="\n")
        if isinstance(row, dict) and row.get("chars") is not None:
            row["chars"] = len(updated)

    def relocate(row, field, expected, cited_by, move=True):
        nonlocal moved
        if not isinstance(row, dict):
            return
        old_relative = row.get(field) or ""
        destination = archive_dir / expected
        if not move and old_relative and (root / old_relative) != destination:
            # A generated PDF can contain the old citation frontmatter. Leave it
            # to the orphan sweep and let `pdf --collection <final>` recreate it
            # from the newly refiled Markdown or original PDF bytes.
            row.pop(field, None)
            return
        if old_relative:
            source = root / old_relative
            try:
                source.resolve().relative_to(archive_dir.resolve())
                destination.resolve().relative_to(archive_dir.resolve())
            except ValueError:
                raise paths.SetupError("refusing to refile a path outside archived-references")
            if source != destination and source.exists():
                destination.parent.mkdir(parents=True, exist_ok=True)
                if destination.exists():
                    if source.read_bytes() != destination.read_bytes():
                        raise paths.SetupError(
                            "refusing to overwrite a different published file: "
                            + paths.rel(destination, root))
                    source.unlink()
                else:
                    source.replace(destination)
                moved += 1
                print("  refiled: %s -> %s" %
                      (paths.rel(source, root), paths.rel(destination, root)))
        if destination.exists():
            row[field] = paths.rel(destination, root)
            if move:
                rewrite_citations(destination, cited_by, row)

    for entry in manifest.data.get("urls", {}).values():
        slug = entry.get("slug") or ""
        if not slug:
            continue
        steps = entry.get("steps") or {}
        cited_by = entry.get("cited_by") or []
        relocate(steps.get("render"), "file",
                 collections_module.md_relpath(entry, config, slug), cited_by)
        relocate(steps.get("render"), "translation_file",
                 collections_module.translated_md_relpath(entry, config, slug), cited_by)
        relocate(steps.get("pdf"), "file",
                 collections_module.pdf_relpath(entry, config, slug), cited_by, move=False)
        relocate(steps.get("pdf-translation"), "file",
                 collections_module.translated_pdf_relpath(entry, config, slug), cited_by,
                 move=False)
    return moved


def command_sync(args):
    """Reconcile citations offline, optionally pruning and refiling outputs."""
    root = paths.repo_root()
    config = paths.config()
    harvested = harvest_module.run(root=root, config=config, classifier=Classifier.load())
    manifest = check_module.open_manifest(root, config)
    existing = set(manifest.data["urls"])

    for key, reference in harvested.references.items():
        entry = manifest.entry(key)
        entry["spellings"] = reference.spellings
        entry["cited_by"] = [occurrence.cited_by() for occurrence in reference.occurrences]
        if reference.title and not entry.get("cited_title"):
            entry["cited_title"] = reference.title

    pruned = 0
    if args.prune:
        cited = set(harvested.references)
        for key in list(manifest.data["urls"]):
            if key in cited:
                continue
            print("  pruned (no longer cited): %s" % key)
            del manifest.data["urls"][key]
            pruned += 1

    moved = _relocate_published(root, config, manifest) if args.refile else 0
    removed = prune_orphans(root, config, manifest) if args.prune_files else 0
    manifest.save()
    print("Synced %d citation(s): %d new, %d pruned, %d refiled, %d orphan file(s) removed."
          % (len(harvested.references), len(set(harvested.references) - existing),
             pruned, moved, removed))
    return 0


def command_compare(args):
    """Compare normalized URL membership between two source collections."""
    root = paths.repo_root()
    config = paths.config()
    harvested = harvest_module.run(root=root, config=config, classifier=Classifier.load())
    groups = {args.left: set(), args.right: set()}
    spellings = {}
    for key, reference in harvested.references.items():
        spellings[key] = reference.spellings[0]
        cited = {collections_module.name_for_file(item.file, config)
                 for item in reference.occurrences}
        for name in groups:
            if name in cited:
                groups[name].add(key)
    if not groups[args.left] or not groups[args.right]:
        raise paths.SetupError("both compared collections must exist and contain citations")
    payload = {
        "left": args.left,
        "right": args.right,
        "shared": [spellings[key] for key in sorted(groups[args.left] & groups[args.right])],
        "left_only": [spellings[key] for key in sorted(groups[args.left] - groups[args.right])],
        "right_only": [spellings[key] for key in sorted(groups[args.right] - groups[args.left])],
    }
    if args.json:
        json.dump(payload, sys.stdout, indent=2, ensure_ascii=False)
        sys.stdout.write("\n")
        return 0
    print("%s vs %s: %d shared, %d only in %s, %d only in %s."
          % (args.left, args.right, len(payload["shared"]),
             len(payload["left_only"]), args.left,
             len(payload["right_only"]), args.right))
    for label in ("shared", "left_only", "right_only"):
        print("\n%s" % label.replace("_", " ").title())
        for url in payload[label]:
            print("  %s" % url)
    return 0


def command_check(args):
    """Probe every harvested reference and record its health in the manifest."""
    root = paths.repo_root()
    config = paths.config()
    result_of_harvest = harvest_module.run(root=root, config=config, classifier=Classifier.load())
    references = list(result_of_harvest.references.values())
    if args.collection:
        references = [reference for reference in references
                      if _reference_in_collection(reference, args.collection, config)]
    if args.only:
        references = [reference for reference in references
                      if args.only.lower() in reference.normalized.lower()]

    manifest = check_module.open_manifest(root, config)

    if args.missing_store:
        from refslib.store import Store
        store = Store(paths.store_root())
        missing = _missing_store_keys(manifest, store)
        references = [reference for reference in references
                      if reference.normalized in missing]

    filled = check_module.backfill_kinds(manifest)
    if filled:
        print("Filled in the kind of %d older entry(ies) offline.\n" % filled)

    if args.prune:
        # A URL that is no longer harvested is not a reference any more. This is
        # how the archive's own test fixtures got out again after they were
        # briefly harvested from tracked test files.
        harvested = set(result_of_harvest.references)
        gone = [key for key in manifest.data["urls"] if key not in harvested]
        for key in gone:
            print("  pruned (no longer cited): %s" % key)
            del manifest.data["urls"][key]
        print("Pruned %d entry(ies).\n" % len(gone))

    if args.status:
        wanted = set(args.status.split(","))
        keys = {key for key, entry in manifest.data["urls"].items()
                if (entry.get("health") or {}).get("status") in wanted}
        references = [reference for reference in references if reference.normalized in keys]
        args.force = True

    hints = {} if args.no_ledger else check_module.load_hints(root, config)
    fetcher = check_module.fetcher_module.Fetcher(per_host_gap=args.gap, timeout=args.timeout)

    total = len(references) if args.limit is None else min(args.limit, len(references))
    print("Checking %d reference(s). Ledger hints available: %d." % (total, len(hints)))
    print("This is the first command that touches the network. It fetches no")
    print("article content and writes no curated document.\n")

    def progress(number, reference, health):
        print("  [%4d/%4d] %-18s %s" % (number, total, health.status,
                                        reference.spellings[0][:96]))

    result = check_module.run(references, config, root, manifest, fetcher=fetcher,
                              hints=hints, force=args.force, limit=args.limit,
                              progress=progress)
    manifest.save()

    print("\nProbed: %d   from ledger: %d" % (result.probed, result.from_ledger))
    print("Manifest: %s" % paths.rel(manifest.path, root))
    print("\nBy status:")
    counts = result.by_status()
    for status in sorted(counts, key=lambda name: -counts[name]):
        print("  %-20s %d" % (status, counts[status]))

    walled = [row for row in result.rows if row[1].needs_browser]
    if walled:
        print("\n%d reference(s) need the browser ladder (blocked or js-rendered)." % len(walled))
        print("None of them is treated as dead, and none selects a capture.")
        for reference, health in walled[:20]:
            print("  %-14s %-60s %s" % (health.status, reference.normalized[:60],
                                        health.evidence[:60]))
        if len(walled) > 20:
            print("  ... and %d more" % (len(walled) - 20))
    return 0


def command_check_browser(args):
    """Re-classify blocked and js-rendered rows in containerized Chromium."""
    from refslib import container_browser
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    ladder = container_browser.Ladder()
    if not ladder.available():
        sys.stderr.write("no Docker runtime available for the headless browser ladder.\n")
        return 2
    store = Store(paths.store_root())

    print("Browser ladder. Scope: walled or script-rendered rows, plus any row whose")
    print("acquisition reported that the bytes it had did not hold the document.")
    print("Page JavaScript runs only in the locked-down toolbox container. Each")
    print("attempt waits, serialises the DOM, and retries if only a shell is visible.\n")

    def progress(number, total, url, result):
        state = ("ok via " + result.rung) if result.ok else ("unconfirmed: " + (result.error or "")[:50])
        print("  [%3d/%3d] %-28s %s" % (number, total, state, url[:80]))

    cleared, total = check_module.run_browser(manifest, store, ladder, limit=args.limit,
                                              budget=args.budget, progress=progress,
                                              only=args.only, force=args.force,
                                              checkpoint=manifest.save)
    manifest.save()
    print("\nConfirmed alive: %d of %d. Unconfirmed rows stay UNVERIFIED and still" % (cleared, total))
    print("select no capture: a wall is not evidence of rot.")
    return 0


def command_acquire(args):
    """Preserve and convert each reference, then render its Markdown file."""
    from refslib import acquire as acquire_module
    from refslib import render as render_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    fetcher = check_module.fetcher_module.Fetcher(per_host_gap=args.gap, timeout=args.timeout)
    archive_dir = root / (config.get("archive_dir") or "archived-references")

    if args.prune_files:
        prune_orphans(root, config, manifest)

    entries = list(manifest.data["urls"].items())
    if args.collection:
        entries = [(key, entry) for key, entry in entries
                   if _entry_in_collection(entry, args.collection, config)]
    if args.only:
        entries = [(key, entry) for key, entry in entries if args.only.lower() in key.lower()]
    if args.kind:
        wanted = set(args.kind.split(","))
        entries = [(key, entry) for key, entry in entries if (entry.get("kind") or "") in wanted]
    if args.missing_store:
        entries = [(key, entry) for key, entry in entries
                   if indexer_module.lost_bytes(entry, store)]
    if args.browser_dom:
        entries = [(key, entry) for key, entry in entries
                   if entry.get("browser_dom_sha256")
                   and store.has(entry["browser_dom_sha256"])]
    if args.faulty_captures:
        entries = [(key, entry) for key, entry in entries
                   if (entry.get("content_gap") or "").startswith("faulty capture:")]
    if args.wayback_capture:
        entries = [(key, entry) for key, entry in entries
                   if (((entry.get("steps") or {}).get("wayback") or {}).get("result")
                       == "stored" or (entry.get("health") or {}).get("snapshot"))
                   and entry.get("raw_sha256")
                   and store.has(entry["raw_sha256"])]
    if args.document_gaps:
        entries = [(key, entry) for key, entry in entries
                   if indexer_module.document_gaps(entry)
                   and (args.faulty_captures or not
                        (entry.get("content_gap") or "").startswith("faulty capture:"))]
    entries = _entries_after(entries, args.after)

    # A publisher wall may be the cited URL while an author or institutional
    # repository exposes the complete paper.  Record that relationship through
    # the command line rather than asking an operator to edit generated manifest
    # state.  It is deliberately singular: attaching one paper to several
    # fuzzy matches would be worse than leaving those references unresolved.
    linked_document_url = args.linked_document_url or ""
    if args.clear_linked_document and linked_document_url:
        raise paths.SetupError(
            "--clear-linked-document and --linked-document-url are mutually exclusive")
    if args.clear_linked_document:
        if not args.only:
            raise paths.SetupError("--clear-linked-document requires --only")
        if len(entries) != 1:
            raise paths.SetupError(
                "--clear-linked-document requires --only to select exactly one reference; "
                "matched %d" % len(entries))
        _key, linked_entry = entries[0]
        linked_entry.pop("linked_document_url", None)
        linked_entry.pop("linked_document_sha256", None)
        manifest.save()
    if linked_document_url:
        parsed = urlsplit(linked_document_url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise paths.SetupError("--linked-document-url must be an absolute HTTP(S) URL")
        if not args.only:
            raise paths.SetupError("--linked-document-url requires --only")
        if len(entries) != 1:
            raise paths.SetupError(
                "--linked-document-url requires --only to select exactly one reference; "
                "matched %d" % len(entries))
        _key, linked_entry = entries[0]
        if linked_entry.get("linked_document_url") != linked_document_url:
            linked_entry.pop("linked_document_sha256", None)
        linked_entry["linked_document_url"] = linked_document_url
        linked_entry["also_at"] = list(dict.fromkeys(
            (linked_entry.get("also_at") or []) + [linked_document_url]
            + (args.also_at or [])))
        manifest.save()

    if not args.force and not linked_document_url and not args.clear_linked_document:
        entries = [(key, entry) for key, entry in entries if not entry.get("slug")]
    if args.limit is not None:
        entries = entries[:args.limit]

    taken = {entry.get("slug") for entry in manifest.data["urls"].values() if entry.get("slug")}
    counts = {"stored": 0, "link-only": 0, "skipped": 0, "failed": 0}
    print("Acquiring %d reference(s). Binary media is not downloaded "
          "(config.json -> media_policy).\n" % len(entries))

    decisions = paths.decisions()
    readings = paths.bylines()
    # Host browsers are never used for acquisition. Video captions are obtained
    # by `refs.py transcripts` through yt-dlp in the locked-down toolbox
    # container; dynamic pages are handled by `check-browser`, also in Docker.
    # Keep the injected ladder slot for the converter API, but leave it empty.
    ladder = None

    for number, (key, entry) in enumerate(entries, start=1):
        # THE MAINTAINER'S DECISION IS READ BEFORE ANYTHING IS FETCHED. "We keep
        # no document for this URL" should not cost a request, and the recorded
        # reason is what the next run reads instead of trying again.
        judged = maintainer_decision(key, entry, decisions)
        if judged and judged.get("outcome") == "skip":
            entry["decision"] = dict(judged, by="maintainer", at=manifest_utc()[:10])
            entry["grade"] = None
            manifest.record(key, "acquire", result="excluded",
                            reason=judged.get("reason") or "maintainer decision")
            counts["excluded"] = counts.get("excluded", 0) + 1
            print("  [%3d] %-10s %-52s %s"
                  % (number, "excluded", key[:52], (judged.get("reason") or "")[:60]))
            manifest.save()
            continue

        result = acquire_module.acquire(key, entry, store, fetcher, config,
                                        taken_slugs=taken, refetch=args.refetch,
                                        replace_imports=args.replace_imports,
                                        ladder=ladder, override=judged)
        counts[result.status] = counts.get(result.status, 0) + 1
        if result.ok:
            record = dict(result.record)
            record["retrieved_utc"] = manifest_utc()
            record.setdefault("why", entry.get("why") or "")
            record.setdefault("summary", entry.get("summary") or "")
            # A STATED BYLINE OUTRANKS AN EXTRACTED ONE, and is applied before
            # the title correction below because the slug that correction rebuilds
            # is built FROM the publisher: for a taken-over domain the extracted
            # one is the squatter. Setting it on the record rather than only on
            # the entry is what carries it through the copy loop further down.
            # Resolved separately from `judged`, which is a GRADING judgement and
            # must never be handed a bare `authors` entry - see below.
            _apply_attribution_override(
                entry, attribution_decision(key, entry, decisions, readings), record)
            # A TITLE READ OFF A WALL IS NOT A TITLE. The probe records what the
            # page called itself, and when the page was a bot check that is what
            # gets archived: a KTH doctoral thesis was filed as "Making sure
            # you're not a bot!" - heading, frontmatter and file name alike. A
            # maintainer can state the real one, and the slug is rebuilt from it
            # rather than kept, because a file named after a wall is the part a
            # reader sees first. The old file becomes an orphan, which `verify`
            # reports and `acquire --prune-files` removes.
            corrected = (judged or {}).get("title") or ""
            _apply_title_override(record, entry, corrected, taken)
            taken.add(record["slug"])
            entry.update({field: record[field] for field in
                          ("slug", "title", "kind", "depth", "depth_reason")})
            entry["grade"] = record.get("grade") or "research"
            entry["decision"] = dict(record.get("decision") or {}, at=manifest_utc()[:10])
            # A maintainer may also pin the FOLDER rather than exclude the page.
            if judged and judged.get("class") in grade_module.FOLDERS:
                entry["grade"] = record["grade"] = judged["class"]
                entry["decision"] = dict(judged, by="maintainer", at=manifest_utc()[:10])
            previous_raw = entry.get("raw_sha256") or ""
            for field in ("raw_sha256", "content_sha256", "licence", "publisher",
                          "published", "authors", "language", "commit"):
                if record.get(field):
                    entry[field] = record[field]
            entry["content_gap"] = _gap_after_acquire(entry, record, previous_raw)
            if args.replace_imports and ((entry.get("steps") or {}).get("import") or {}) \
                    .get("result") == "stored":
                # The hand-imported copy is gone, so the marker that protects it
                # has to go too. Leaving it makes the entry read as hand-filed
                # when its content now comes from its own source.
                manifest.record(key, "import", result="replaced",
                                reason="re-acquired from the source with --replace-imports")
            manifest.record(key, "acquire", result=result.status, slug=record["slug"],
                            raw_sha256=record.get("raw_sha256", ""),
                            content_sha256=record.get("content_sha256", ""),
                            extraction=record.get("extraction"),
                            reason=result.reason)
            content = store.get_text(record["content_sha256"]) if record.get("content_sha256") else ""
            # A translation stored earlier survives a re-render, because it was
            # produced by a reader and cannot be recomputed from the bytes.
            if entry.get("translation_sha256") and store.has(entry["translation_sha256"]):
                record["translation"] = store.get_text(entry["translation_sha256"])
            # Same reason for the translated title and publisher: a reader wrote
            # them, so a re-render carries them forward rather than losing them.
            for field in ("title_english", "publisher_english"):
                if entry.get(field):
                    record[field] = entry[field]
            _carry_preserved_facts(record, entry)
            try:
                text = render_module.render(record, content, record["depth"])
            except render_module.MissingAttribution as error:
                counts["failed"] += 1
                counts[result.status] -= 1
                manifest.record(key, "render", result="refused", reason=str(error))
                print("  [%3d] REFUSED  %s" % (number, error))
                manifest.save()
                continue
            # The YEAR LIST that cites this reference decides the folder, so one
            # definition governs it (refslib/collections.py) and a file never has
            # to be moved by hand. The grade is kept in the manifest for the
            # index and the work lists, but on disk everything a year cites lives
            # together under that year, in the Markdown tree.
            path = archive_dir / collections_module.md_relpath(entry, config,
                                                               record["slug"])
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8", newline="\n")
            # THE ENGLISH IS ITS OWN FILE, written in the same breath as the
            # original so the pair can never drift apart: a re-render that
            # produced only one of them would leave a document pointing at a
            # sibling that no longer says the same thing.
            translated_rel = ""
            if record.get("translation"):
                translated_path = archive_dir / collections_module.translated_md_relpath(
                    entry, config, record["slug"])
                translated_text = render_module.render_translation(
                    record, record["translation"], record["depth"])
                translated_path.write_text(translated_text, encoding="utf-8", newline="\n")
                translated_rel = paths.rel(translated_path, root)
            manifest.record(key, "render", result="ok", depth=record["depth"],
                            file=paths.rel(path, root), chars=len(text),
                            translation_file=translated_rel)
            print("  [%3d] %-10s %-52s %s" % (number, result.status, record["slug"][:52],
                                              record.get("quality", {}).get("chars", "")))
        else:
            # Keep the hash of bytes we already preserved, so a retry after an
            # extractor or browser fix is offline rather than another fetch.
            # Keep the hash of bytes we already preserved, so a retry after an
            # extractor or browser fix is offline rather than another fetch -
            # but NEVER replace bytes we already hold with the ones an attempt
            # just failed on. A 126,805-byte Wayback capture was overwritten by
            # the 2,245-byte anti-scraper wall that the failing attempt read,
            # and the good capture had to be fetched again to get it back.
            if result.raw_sha256:
                held = entry.get("raw_sha256")
                bigger = (not held or not store.has(held)
                          or len(store.get(result.raw_sha256)) > len(store.get(held)))
                # Keep the MORE COMPLETE bytes, not simply the newest or the
                # oldest. Newest lost a 126,805-byte capture to the 2,245-byte
                # wall a failing attempt read; never-replace then kept a
                # 2,097,152-byte truncated PDF instead of the whole 3 MB one
                # that the very next attempt had just downloaded.
                if bigger:
                    entry["raw_sha256"] = result.raw_sha256
            # A rule-driven refusal is a DECISION, not just a failed fetch, and
            # it belongs on the excluded list with its reason. An entry that
            # merely failed keeps no claim on a file either.
            entry["decision"] = (dict(result.decision, at=manifest_utc()[:10])
                                 if result.decision else None)
            # A TRANSIENT FAILURE MUST NOT DESTROY A DOCUMENT WE ALREADY HAVE.
            # The GitHub API's unauthenticated limit is 60 requests an hour, and
            # hitting it made ten references "fail"; the next index run then
            # swept their files as orphans. Withdraw the document only when a
            # RULE refused it - a broken capture, a consent gate - because that
            # is the case where what we hold is known to be wrong.
            if result.decision:
                entry["grade"] = None
            manifest.record(key, "acquire", result=result.status, reason=result.reason,
                            raw_sha256=result.raw_sha256)
            print("  [%3d] %-10s %-52s %s" % (number, result.status, key[:52], result.reason[:60]))

        # A single hostile or pathological source must not erase the completed
        # work before it.  Checkpoint each row so an interrupted 1,000-document
        # run resumes at the next unfinished citation rather than starting over.
        manifest.save()

    manifest.save()
    # Every outcome is printed, including ones this command did not anticipate.
    # A summary that names four statuses while the run produced five is how a
    # queue of refused pages silently reads as "covered everything".
    print("\nOutcomes (%d reference(s) processed):" % sum(counts.values()))
    for status in sorted(counts, key=lambda name: -counts[name]):
        if counts[status]:
            print("  %-12s %d" % (status, counts[status]))
    review = [key for key, entry in manifest.data["urls"].items()
              if ((entry.get("steps") or {}).get("acquire") or {}).get("result") == "review"]
    if review:
        print("\n%d reference(s) queued for review: extraction kept too little of what the"
              % len(review))
        print("probe measured, so nothing was published for them. Nothing is lost; they")
        print("are re-runnable once the extractor handles their page shape.")
    print("Files: %s" % paths.rel(archive_dir, root))
    return 0


def manifest_utc():
    from refslib.manifest import utc_now
    return utc_now()


def command_translate(args):
    """Prepare an archived document for translation, or apply one back.

    The MECHANICAL half only. Deciding what a sentence means belongs to a
    reader - `reference-translator` is defined for exactly this and holds an
    empty tool set - and this makes that job safe to do: everything that is not
    prose is masked first, so a payload cannot be translated by accident.
    """
    from refslib import translate as translate_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())

    def content_of(entry):
        sha = entry.get("content_sha256")
        return store.get_text(sha) if sha and store.has(sha) else ""

    foreign, done, unreadable, translated = [], [], [], []
    for key, entry in manifest.data["urls"].items():
        if args.only and args.only.lower() not in key.lower():
            continue
        # An explicit skip says the archive intentionally keeps no document for
        # this citation (usually because the complete counterpart is archived
        # elsewhere).  A stale wall or metadata object on that row is neither a
        # document nor prose the archive asks a reader to translate.
        if (entry.get("decision") or {}).get("outcome") == "skip":
            continue
        if entry.get("translation_sha256"):
            translated.append((key, entry))
        text = content_of(entry)
        if not text:
            # THE STORE COULD NOT SUPPLY IT. Counted and reported rather than
            # skipped: running without `WEBSEC_REFS_STORE` silently measured a
            # third of the archive and reported a clean-looking answer.
            if entry.get("content_sha256"):
                unreadable.append(entry.get("slug") or key)
            continue
        # WARRANTS, not merely HAS. A translation is a second document that the
        # website opens in place of the original, so a stray foreign sample in
        # an English write-up must not manufacture one.
        if not translate_module.warrants_translation(
                text, entry.get("language") or "",
                {field: entry.get(field) or ""
                 for field in translate_module.METADATA_FIELDS}):
            continue
        if entry.get("translation_sha256") and not args.redo:
            done.append((key, entry, text))
            continue
        foreign.append((key, entry, text))

    if args.render:
        rendered = refused = 0
        for key, entry in translated:
            slug = entry.get("slug") or key
            try:
                original_path, translated_path, original_chars, translated_chars = \
                    _render_stored_translation(key, entry, store, root, config)
            except Exception as error:
                refused += 1
                print("  REFUSED %-48s %s" % (slug[:48], error))
                continue
            manifest.record(
                key, "render", result="ok", depth=entry.get("depth") or "full",
                file=paths.rel(original_path, root), chars=original_chars,
                translation_file=paths.rel(translated_path, root),
                translation_chars=translated_chars)
            rendered += 1
            print("  rendered %-47s %7d translated chars"
                  % (slug[:47], translated_chars))
        manifest.save()
        print("\n%d translation pair(s) rendered offline, %d refused."
              % (rendered, refused))
        return 1 if refused else 0

    if not args.prepare and not args.apply:
        print("%d archived document(s) still need translating." % len(foreign))
        if done:
            print("%d already have one (pass --redo to do them again)." % len(done))
        print("\nThe archive is read in English, and a third of a technique is lost")
        print("when the write-up is in a language the reader cannot follow.\n")
        for key, entry, text in foreign:
            print("  %-56s %7d chars  %s"
                  % ((entry.get("slug") or key)[:56], len(text),
                     entry.get("language") or "language not declared"))
        if unreadable:
            print("\n%d document(s) could not be read from the store, so their"
                  % len(unreadable))
            print("language is UNKNOWN rather than English. Check WEBSEC_REFS_STORE.")
            for slug in unreadable[:10]:
                print("  %s" % slug)
        print("\n  refs.py translate --prepare --only <substring> --into <dir>")
        return 0

    if not foreign:
        print("Nothing matched %r." % args.only)
        return 2

    def work_dir(entry):
        return Path(args.into or (paths.tool_dir() / "cache" / "translate"
                                  / (entry.get("slug") or "reference")))

    if args.prepare:
        # PREPARING IS A BATCH STEP. Masking is deterministic and offline, so
        # doing the whole backlog at once is what lets the translation itself be
        # spread across readers. `--apply` still takes one document, because
        # that one writes to the manifest.
        if args.into and len(foreign) != 1:
            print("--into names one directory, so name one document with --only "
                  "(matched %d)." % len(foreign))
            return 2
        # A DIRECTORY FOR A DOCUMENT THAT NO LONGER NEEDS WORK IS A TRAP. It
        # keeps chunk files from an earlier, wider preparation, and whoever
        # translates next works through a directory listing rather than this
        # report. Only for an unscoped run: with `--only` the rest of the cache
        # is deliberately untouched.
        wanted = {entry.get("slug") or "reference" for _key, entry, _text in foreign}
        if not args.only and not args.into:
            cache = paths.tool_dir() / "cache" / "translate"
            for stale_dir in sorted(cache.glob("*")) if cache.exists() else []:
                if not stale_dir.is_dir() or stale_dir.name in wanted:
                    continue
                left = list(stale_dir.glob("chunk-*.txt"))
                for stale in left:
                    stale.unlink()
                if left:
                    print("  cleared %-54s no longer needs translating"
                          % stale_dir.name[:54])

        total_chunks = total_reused = 0
        for _key, entry, text in foreign:
            work = work_dir(entry)
            prepared = translate_module.prepare(
                text, entry.get("language") or "",
                metadata={field: entry.get(field) or ""
                          for field in translate_module.METADATA_FIELDS})
            work.mkdir(parents=True, exist_ok=True)
            (work / "placeholders.json").write_text(
                json.dumps({"placeholders": prepared.placeholders,
                            "comments": prepared.comments,
                            "metadata": prepared.metadata,
                            "original": prepared.original}, indent=1, ensure_ascii=False),
                encoding="utf-8", newline="\n")
            # EVERY chunk file goes, including the `.en.txt` translations:
            # segment numbering is derived from the masking, so a translation
            # made against a previous preparation would be applied to different
            # segments, which is silent corruption rather than lost work.
            #
            # But a chunk whose text comes back BYTE-IDENTICAL is the same work,
            # and re-translating it is both wasted effort and a fresh chance to
            # word a sentence differently. So keep those, keyed by content: a
            # rule change that only adds a segment at the end then costs one
            # chunk rather than a whole corpus.
            done = {}
            for previous in sorted(work.glob("chunk-*.txt")):
                if previous.name.endswith(".en.txt"):
                    continue
                english = previous.with_suffix(".en.txt")
                if english.exists():
                    done[previous.read_text(encoding="utf-8")] = english.read_text(
                        encoding="utf-8")
            for stale in work.glob("chunk-*.txt"):
                stale.unlink()
            reused = 0
            for number, chunk in enumerate(prepared.chunks, start=1):
                body = "\n\n".join("[%d] %s" % (identifier, segment)
                                   for identifier, segment in chunk)
                (work / ("chunk-%02d.txt" % number)).write_text(
                    body, encoding="utf-8", newline="\n")
                if body in done:
                    (work / ("chunk-%02d.en.txt" % number)).write_text(
                        done[body], encoding="utf-8", newline="\n")
                    reused += 1
            total_chunks += len(prepared.chunks)
            total_reused += reused
            print("  %-56s %2d chunk(s) %4d segment(s) %4d already English%s"
                  % ((entry.get("slug") or "reference")[:56], len(prepared.chunks),
                     prepared.segments, prepared.skipped,
                     "  %d unchanged, translation kept" % reused if reused else ""))
        if not total_chunks:
            print("\nNothing to translate: every segment is already English.")
            return 0
        print("\n%d chunk(s) across %d document(s), written under:\n  %s\n"
              % (total_chunks, len(foreign),
                 paths.rel(paths.tool_dir() / "cache" / "translate")))
        if total_reused:
            print("%d of those came back unchanged and kept the translation they"
                  % total_reused)
            print("already had, so only %d still need one.\n"
                  % (total_chunks - total_reused))
        print("A segment that was ALREADY ENGLISH is not in a chunk. It is put back")
        print("verbatim, so do not supply one.\n")
        print("Some segments are COMMENTS lifted out of code blocks. Translate them")
        print("like any other prose: the code around them is never shown and never")
        print("changes, but the author's explanation of it should read in English.\n")
        print("EVERY {{PH_n}} MUST COME BACK BYTE-IDENTICAL. They stand for code,")
        print("payloads, URLs, type names, CVE ids and hashes: changing one silently")
        print("corrupts the research this file exists to preserve.\n")
        print("Translate each chunk into English, keeping the [n] markers, and save")
        print("the result beside it as chunk-NN.en.txt. Then, per document:")
        print("  refs.py translate --apply --only <substring>")
        return 0

    # --apply. ONE REFUSAL NEVER STOPS THE OTHERS: a batch where one translator
    # dropped a placeholder should store the other thirty-four and name the one
    # to redo, not leave the whole backlog unapplied.
    if args.into and len(foreign) != 1:
        print("--into names one directory, so name one document with --only "
              "(matched %d)." % len(foreign))
        return 2
    stored = refused = waiting = render_refused = 0
    for key, entry, _text in foreign:
        work = work_dir(entry)
        slug = entry.get("slug") or key
        translated = sorted(work.glob("chunk-*.en.txt"))
        if not translated:
            waiting += 1
            continue
        saved = json.loads((work / "placeholders.json").read_text(encoding="utf-8"))
        placeholders = saved.get("placeholders", saved)
        comments = {int(number): value
                    for number, value in (saved.get("comments") or {}).items()}
        fields = {int(number): value
                  for number, value in (saved.get("metadata") or {}).items()}
        original = {int(number): value
                    for number, value in (saved.get("original") or {}).items()}

        raw = "\n\n".join(path.read_text(encoding="utf-8").strip()
                          for path in translated)
        # Segments keep their [n] marker, which is what lets a translated COMMENT
        # be matched back to the code block it was lifted out of. Prose segments
        # simply lose theirs and are joined back in order.
        numbered = {int(match.group(1)): match.group(2).strip()
                    for match in re.finditer(r"^\[(\d+)\]\s*(.*?)(?=\n\[\d+\]|\Z)",
                                             raw, re.MULTILINE | re.DOTALL)}
        held = translate_module.apply_comments(placeholders, comments, numbered)
        not_prose = set(comments) | set(fields)
        body = translate_module.rebuild(numbered, original, not_prose)

        # CHECKED AGAINST THE TEXT IT ACTUALLY LANDS IN. A placeholder living
        # only in the title is not missing from the body, it was never in it:
        # demanding it there refused three intact documents over `Transfer-Encoding` in a
        # heading. So the body is checked against the body's own segments, and
        # each metadata field against its own translated value.
        prose = {number: value for number, value in original.items()
                 if number not in not_prose}
        lost = translate_module.missing_placeholders(
            body, translate_module.standing_alone(held, prose))
        for identifier, field in sorted(fields.items()):
            rendered = numbered.get(identifier)
            if rendered is None:
                continue
            lost += translate_module.missing_placeholders(
                rendered, translate_module.standing_alone(
                    held, {identifier: original.get(identifier, "")}))
        if lost and not args.force:
            refused += 1
            print("  REFUSED %-48s %d placeholder(s) did not come back, e.g. %s"
                  % (slug[:48], len(lost), ", ".join(lost[:3])))
            continue

        english = translate_module.restore(body, held)
        digest = store.put_text(english)
        entry["translation_sha256"] = digest
        # The record's own prose fields. Stored BESIDE the originals, never over
        # them: the source's title is how a reader finds the page again, so the
        # citation keeps it while the heading a researcher reads is English.
        for identifier, field in sorted(fields.items()):
            rendered = numbered.get(identifier)
            if not rendered:
                continue
            entry[field + "_english"] = translate_module.restore(rendered, held)
        manifest.record(key, "translate", result="stored", sha256=digest,
                        chars=len(english), segments=len(translated),
                        lost_placeholders=len(lost))
        stored += 1
        print("  stored  %-48s %7d chars from %d chunk(s)%s"
              % (slug[:48], len(english), len(translated),
                 "  FORCED past %d lost placeholder(s)" % len(lost) if lost else ""))
        try:
            original_path, translated_path, original_chars, translated_chars = \
                _render_stored_translation(key, entry, store, root, config)
            manifest.record(
                key, "render", result="ok", depth=entry.get("depth") or "full",
                file=paths.rel(original_path, root), chars=original_chars,
                translation_file=paths.rel(translated_path, root),
                translation_chars=translated_chars)
        except Exception as error:
            render_refused += 1
            print("           translation stored but render REFUSED: %s" % error)
    manifest.save()

    print("\n%d stored, %d refused, %d still waiting for a translation."
          % (stored, refused, waiting))
    if refused:
        print("\nEach lost placeholder stands for code or a payload, so applying")
        print("would corrupt the document. Fix those translations and run again.")
    if stored and not render_refused:
        print("\nThe ORIGINAL is untouched. The English is written as a SECOND file,")
        print("<slug>_translate.md beside it, so a reader can always check the")
        print("translator against the source's own words.")
        print("Run 'refs.py pdf' to print the new translation files.")
    if render_refused:
        print("\n%d stored translation(s) still need an offline render; fix the named"
              % render_refused)
        print("problem and run 'refs.py translate --render'.")
    return 1 if refused or render_refused else 0
    return 0


def _record_lookup_failure(manifest, key, reason):
    """Record that the CDX index could not be asked, without losing a capture.

    A DEAD INDEX MUST NOT ERASE A LIVE CAPTURE. `manifest.record` REPLACES the
    step row, so writing "lookup-failed" over a previous "stored" row deletes
    the snapshot timestamp and replay URL that prove a good capture was already
    found - and the next run reads the reference as one the archive never got an
    answer for. Observed twice against jeremiahgrossman.blogspot.com while
    archive.org was returning 498/503: a 60,468-byte capture recorded in August
    was reduced to "lookup-failed" by a retry that never reached the index.

    The failure is a fact about the INDEX being unreachable, not about the
    source, so an existing capture is kept and merely annotated with the attempt.
    Returns the kept snapshot, or "" when the failure was recorded normally.
    """
    held = manifest.last(key, "wayback") or {}
    if held.get("result") == "stored":
        held["lookup_failed_utc"] = manifest_module.utc_now()
        held["lookup_failed_reason"] = reason
        return held.get("snapshot") or "already stored"
    manifest.record(key, "wayback", result="lookup-failed", reason=reason)
    return ""


def command_wayback(args):
    """Look for a better Wayback capture of a reference we could not read."""
    from refslib import wayback as wayback_module
    from refslib import toolbox
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    fetcher = check_module.fetcher_module.Fetcher(per_host_gap=args.gap, timeout=args.timeout)

    def wanted(key, entry):
        if args.only and args.only.lower() not in key.lower():
            return False
        if args.faulty_captures:
            return (entry.get("content_gap") or "").startswith("faulty capture:")
        # A store gap is not a document-gaps row any more, so it needs its own
        # selector here: the document is published but the bytes behind it are
        # gone, and a snapshot is the route when the source no longer answers.
        if args.missing_store:
            return bool(indexer_module.lost_bytes(entry, store))
        if args.force:
            return True
        return indexer_module.document_gaps(entry)

    targets = [(key, entry) for key, entry in manifest.data["urls"].items()
               if wanted(key, entry)]
    targets = _entries_after(targets, args.after)
    if args.limit is not None:
        targets = targets[:args.limit]
    if args.replay_url and len(targets) != 1:
        raise paths.SetupError("--replay-url requires --only to select exactly one reference")
    print("Looking for a better capture of %d reference(s).\n" % len(targets))
    print("Not every capture of a URL is the same page: one was pinned to a 9,046-byte")
    print("\"404\" while a 380,504-byte capture of the same URL is the PDF. The bytes")
    print("this selects go through the same extraction and guards as any other fetch.\n")

    improved = 0
    for key, entry in targets:
        url = (entry.get("spellings") or [key])[0]
        source_url = entry.get("linked_document_url") or url
        original = wayback_module.original_url(source_url)
        current = len(store.get(entry["raw_sha256"])) if (
            entry.get("raw_sha256") and store.has(entry["raw_sha256"])) else 0
        # BIGGER-THAN-HELD proves nothing when what is held already failed
        # extraction: a bulk-pinned replay of a JavaScript shell can outweigh
        # the smaller, older capture that carries the article. The size gate
        # only guards bytes a previous acquire actually read.
        held_readable = _held_capture_is_readable(entry)
        # THE CAPTURE FROM THE ARTICLE'S OWN SEASON REPLAYS THE ARTICLE. A
        # write-up published 2013-05-29 was pinned to a 2016 capture extracting
        # to 341 characters; the 2013-08-23 capture is the article. Most blog
        # URLs carry their date; the citing list's year is the fallback.
        near = wayback_module.publication_date(original)
        if not near:
            cited = (entry.get("cited_by") or [""])[0]
            year_match = re.match(r"((?:19|20)\d{2})", cited)
            if year_match:
                near = year_match.group(1) + "0701"
        # The pinned capture the citation already failed on is never the answer.
        # SKIPPING THE PINNED CAPTURE IS A GUESS, AND --force UNDOES IT. The
        # citation's own timestamp is usually the one that failed, so passing
        # over it finds the better capture - but not always: one whitepaper is
        # cited as the capture that holds the complete 7.67 MB PDF, and skipping
        # it left only two later captures the archive itself had truncated to
        # 1,048,576 bytes. --force means reconsider everything, including this.
        skips = set()
        if not args.force:
            skips.add(wayback_module.cited_timestamp(url))
            skips.add((entry.get("health") or {}).get("snapshot") or "")
        # WALK THE CAPTURES, DO NOT BET ON ONE. A citation can be pinned to a
        # capture that is a bot wall rather than the page: this URL was cited as
        # its 2024 replay, a slider CAPTCHA extracting to 99 characters, while
        # the 2019 and 2022 captures carry the article. Stopping at the first
        # candidate turned "the archive has no readable copy" into a fact.
        chosen = body = None
        tried = 0
        toolbox_used = False
        try:
            if args.replay_url:
                pinned = wayback_module.from_replay_url(args.replay_url)
                if not wayback_module.same_target(original, pinned.original):
                    raise paths.SetupError(
                        "the replay captures a different resource: %s" % pinned.original)
                candidates = [pinned]
            else:
                candidates = list(wayback_module.ranked(
                    original, fetcher, skip_timestamp=skips, near=near))
        except wayback_module.LookupFailed as error:
            # A second network stack is useful evidence here. In this corpus
            # Python answered HTTP 0 and the container route stalled while
            # verified host curl returned the CDX rows in seconds. Downloaded
            # bytes are not executed and still face every archive guard.
            try:
                class CurlFetcher(object):
                    def get(self, request_url, max_bytes=0):
                        return check_module.fetcher_module.curl_get(
                            request_url, timeout=args.timeout,
                            max_bytes=max_bytes or 2 * 1024 * 1024)
                candidates = list(wayback_module.ranked(
                    original, CurlFetcher(), skip_timestamp=skips, near=near))
                print("    CDX answered through verified host curl")
            except wayback_module.LookupFailed as curl_error:
                try:
                    class ToolboxFetcher(object):
                        def get(self, request_url, max_bytes=0):
                            payload = toolbox.fetch_public(request_url)
                            return check_module.fetcher_module.Response(
                                request_url, 200, {}, payload, [])
                    candidates = list(wayback_module.ranked(
                        original, ToolboxFetcher(), skip_timestamp=skips, near=near))
                    toolbox_used = True
                    print("    CDX answered through verified curl in the toolbox")
                except (toolbox.Unavailable, wayback_module.LookupFailed) as fallback_error:
                    # NOT "there is no capture". Reported apart from it, because the
                    # difference is a fact about the source versus a fact about us.
                    reason = ("%s; host curl fallback: %s; toolbox fallback: %s"
                              % (error, curl_error, fallback_error))
                    print("  ASK FAILED %-58s %s" % (original[:58], reason))
                    kept = _record_lookup_failure(manifest, key, reason)
                    manifest.save()
                    if kept:
                        print("    kept the capture already recorded (%s)" % kept)
                    continue
        for candidate in candidates:
            tried += 1
            response = fetcher.get(candidate.replay_url, max_bytes=16 * 1024 * 1024)
            why = ""
            if 200 <= response.status < 300 and response.body:
                why = wayback_module.unusable(response.body, entry.get("kind") or "")
            if not (200 <= response.status < 300) or not response.body or why:
                alternate = check_module.fetcher_module.curl_get(
                    candidate.replay_url, timeout=args.timeout,
                    max_bytes=16 * 1024 * 1024)
                alternate_why = ""
                if 200 <= alternate.status < 300 and alternate.body:
                    alternate_why = wayback_module.unusable(
                        alternate.body, entry.get("kind") or "")
                if 200 <= alternate.status < 300 and alternate.body and not alternate_why:
                    response = alternate
                    why = ""
                    print("    retry %s  verified host curl" % candidate.timestamp)
            if not (200 <= response.status < 300) or not response.body or why:
                try:
                    alternate = toolbox.fetch_public(candidate.replay_url)
                    alternate_why = wayback_module.unusable(
                        alternate, entry.get("kind") or "")
                    if not alternate_why:
                        response = check_module.fetcher_module.Response(
                            candidate.replay_url, 200, {}, alternate, [])
                        why = ""
                        toolbox_used = True
                        print("    retry %s  verified curl in the toolbox" % candidate.timestamp)
                    elif not why:
                        why = alternate_why
                except toolbox.Unavailable:
                    pass
            if not (200 <= response.status < 300) or not response.body:
                print("    skip %s  http %s" % (candidate.timestamp, response.status))
            # Like with like: the FETCHED capture against the bytes already
            # held. The index length cannot answer this - it is a compressed
            # size - so it is only ever used to order the candidates. And only
            # bytes a previous acquire actually READ set a floor: garbage held
            # is not a size to beat.
            elif held_readable and not args.replay_url and len(response.body) <= current:
                print("    skip %s  %d bytes, no bigger than the %d held"
                      % (candidate.timestamp, len(response.body), current))
            else:
                why = why or wayback_module.unusable(response.body, entry.get("kind") or "")
                if why:
                    print("    skip %s  %s" % (candidate.timestamp, why))
                else:
                    chosen, body = candidate, response.body
                    break
            if tried >= args.tries:
                break
        if not chosen:
            print("  none       %-58s (have %d bytes, %d capture(s) tried)"
                  % (original[:58], current, tried))
            continue
        candidate, body_bytes = chosen, body

        digest = store.put(body_bytes)
        entry["raw_sha256"] = digest
        # A CAPTURE SUPERSEDES A RENDER. Acquisition prefers a stored browser
        # DOM, because that is what got past a wall - but here the wall is what
        # the browser captured: a 2,245-byte anti-scraper challenge outranked a
        # 126,805-byte capture of the same page and kept failing extraction.
        if entry.get("linked_document_url"):
            entry["linked_document_sha256"] = digest
        else:
            entry.pop("browser_dom_sha256", None)
        entry.setdefault("health", {})["snapshot"] = candidate.timestamp
        manifest.record(key, "wayback", result="stored", snapshot=candidate.timestamp,
                        bytes=len(body_bytes), was=current, tried=tried,
                        replay_url=candidate.replay_url,
                        toolbox_fallback=toolbox_used)
        manifest.save()
        improved += 1
        print("  captured   %-58s %7d -> %7d bytes (%s, %d tried)"
              % (original[:58], current, len(body_bytes), candidate.timestamp, tried))

    manifest.save()
    print("\n%d reference(s) now hold a better capture." % improved)
    print("Run 'refs.py acquire --force' to extract from them, offline.")
    return 0


def command_historical_urls(args):
    """List historical paths for a failed source with pinned Docker waymore.

    These URLs are discovery leads, never automatically accepted captures.  A
    maintainer must still verify title, author, date, and document content before
    passing a candidate to ``wayback --replay-url`` or ``acquire``.
    """
    from refslib import toolbox

    if not args.only:
        raise paths.SetupError("historical-urls requires --only")
    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    matches = [(key, entry) for key, entry in manifest.data["urls"].items()
               if args.only.lower() in key.lower()]
    if not matches:
        raise paths.SetupError("--only matched no manifest identity: " + args.only)

    domains = set()
    for key, entry in matches:
        candidates = [key, entry.get("linked_document_url") or ""]
        candidates.extend(entry.get("spellings") or [])
        for candidate in candidates:
            host = (urlsplit(candidate).hostname or "").lower()
            if host:
                domains.add(host)
    if not domains:
        raise paths.SetupError("the selected reference has no HTTP(S) host")

    print("Querying historical paths for: %s\n" % ", ".join(sorted(domains)))
    print("Results are leads only. Verify title, author, date, and content before use.\n")
    try:
        results = toolbox.waymore_urls(
            domains, log=lambda line: print("  " + line),
            limit_requests=args.limit_requests)
    except toolbox.Unavailable as error:
        print("historical path lookup failed: %s" % error)
        return 1
    shown = results[:args.limit_results] if args.limit_results else results
    for result in shown:
        print(result)
    if len(shown) != len(results):
        print("\n%d more result(s) omitted; increase --limit-results to inspect them."
              % (len(results) - len(shown)))
    print("\n%d historical URL(s) found." % len(results))
    return 0


def _clear_completed_pdf_gap(entry, out_path):
    """Clear a recorded missing-PDF fault once a real PDF now exists.

    A fault may mention a missing PDF alongside a different unresolved problem
    (the JSFiddle citation that redirects away from the cited result).  Those
    stay queued.  This transition is only for remedies whose remaining action
    was to rebuild the archive PDF from already-recovered content.
    """
    gap = entry.get("content_gap") or ""
    lowered = gap.lower()
    pdf_absence = (gap.startswith("faulty capture:") and "pdf" in lowered
                   and ("absent" in lowered or "missing" in lowered))
    separate_problem = ("interactive citation" in lowered
                        or "redirects away" in lowered)
    try:
        with out_path.open("rb") as handle:
            valid_pdf = (out_path.stat().st_size >= 512
                         and handle.read(5) == b"%PDF-")
    except OSError:
        valid_pdf = False
    if not (pdf_absence and not separate_problem and valid_pdf):
        return False
    entry["content_gap"] = ""
    return True


_REPO_COMMIT = re.compile(r"^- Commit: `([0-9a-f]{7,40})`", re.MULTILINE)


def _image_base(key, entry, markdown):
    """The address a document's RELATIVE image targets are written against.

    For an ordinary page that is the page's own URL. For a mirrored repository
    it is not: a README's `Figure/overview.png` resolves against the raw file
    host at the commit the archive pinned, never against the HTML view, and
    joining it to `github.com/owner/repo` would ask for a path that does not
    exist. Returns "" when nothing reliable can be built, which leaves the
    target unresolved rather than guessing a host.
    """
    original = entry.get("original_url") or entry.get("retrieved_from") or key or ""
    if (entry.get("kind") or "") != "repo":
        return original
    from refslib import github as github_module
    from refslib import repo as repo_module
    parsed = repo_module.parse(original or key)
    matched = _REPO_COMMIT.search(markdown or "")
    if not parsed or not matched:
        return ""
    owner, name = parsed
    return "%s/%s/%s/%s/" % (github_module.RAW, owner, name, matched.group(1))


_REPO_DOCUMENT = re.compile(r"^## `([^`]+)`\s*$", re.MULTILINE)


def _image_fetch_urls(key, entry, markdown):
    """Every image target in a document, mapped to the URL to FETCH it from.

    Keyed by the target EXACTLY as the document writes it, because that is what
    the PDF converter looks a preserved picture up by. A value of "" means there
    was nothing safe to try, and the caller records that as the reason.

    A mirrored repository is not one page. The capture joins several documents,
    each under its own ``## `path` `` heading, and a relative figure belongs to
    the directory of the document that referenced it: `shields.png` under
    `example/README.md` is `example/shields.png`, not a file at the repository
    root. A leading `/` is repository-root relative, the way GitHub rewrites it
    when it renders the page - resolving that against the raw HOST would drop
    the owner, name and commit and ask for a file that is not there.
    """
    from refslib import images as images_module
    base = _image_base(key, entry, markdown)
    found = {}
    if (entry.get("kind") or "") != "repo" or not base:
        for target in images_module.urls_in(markdown):
            found[target] = images_module.resolve(target, base)
        return found

    sections, last, path = [], 0, ""
    for mark in _REPO_DOCUMENT.finditer(markdown):
        sections.append((path, markdown[last:mark.start()]))
        path, last = mark.group(1), mark.start()
    sections.append((path, markdown[last:]))

    for path, text in sections:
        directory = path.rsplit("/", 1)[0] + "/" if "/" in path else ""
        for target in images_module.urls_in(text):
            if target.lower().startswith(("http://", "https://")):
                found[target] = target
                continue
            within = target[1:] if target.startswith("/") else directory + target
            resolved = images_module.resolve(within, base)
            if resolved or target not in found:
                found[target] = resolved
    return found


def command_images(args):
    """Preserve the pictures an archived article was written around (network).

    Only for the references whose PDF this archive RENDERS. A source that is
    already a PDF carries its own figures, and a reference with no document has
    nothing to illustrate.

    What is stored is never what was fetched: `images.sanitise` decodes each one
    and writes a new file from the pixels alone, so metadata, appended payloads
    and anything hidden in the low bits do not come with it.

    A HOST WHOSE CERTIFICATE EXPIRED SERVES ITS FIGURES FROM THE SAME HOST.
    `insecure` recovers the article; every one of its 32 screenshots then came
    back as "empty response" here, because the archive's own client verifies and
    always will. `--insecure` sends this command's fetches through the same
    container curl, for the one reference `--only` names - the maintainer
    decision is per reference, exactly as it is for the page itself. What is
    stored still goes through `images.sanitise`, so nothing about what reaches
    the archive changes; only who did the fetching.
    """
    from refslib import images as images_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    fetcher = check_module.fetcher_module.Fetcher(per_host_gap=args.gap,
                                                  timeout=args.timeout)

    fetch_image = None
    if getattr(args, "insecure", False):
        from refslib import toolbox as toolbox_module
        if not args.only:
            print("--insecure needs --only. Skipping certificate verification is a")
            print("per-reference decision, never a sweep.")
            return 2

        def fetch_image(url):
            return toolbox_module.fetch_insecure(url)

        print("Fetching this document's images WITHOUT certificate verification,")
        print("in the container. Each one is still decoded and re-encoded.\n")

    documents = kept = refused = held = 0
    for key, entry in manifest.data["urls"].items():
        if args.only and args.only.lower() not in key.lower():
            continue
        slug = entry.get("slug")
        if not slug:
            continue
        if (entry.get("steps") or {}).get("pdf", {}).get("source") == "original-pdf":
            continue
        if (entry.get("paper") or {}).get("sha256"):
            continue
        md_path = archive_dir / collections_module.md_relpath(entry, config, slug)
        if not md_path.exists():
            continue
        markdown = md_path.read_text(encoding="utf-8")
        urls = images_module.urls_in(markdown)
        if not urls:
            continue
        fetch_urls = _image_fetch_urls(key, entry, markdown)
        documents += 1
        record = dict(entry.get("images") or {})
        embedded = sum(item.get("bytes") or 0 for item in record.values()
                       if item.get("sha256"))
        for url in urls[:images_module.MAX_IMAGES_PER_DOCUMENT]:
            if url in record and not args.force:
                held += 1
                continue
            if embedded >= images_module.MAX_EMBEDDED_BYTES:
                record[url] = {"reason": "the document reached its embedded image budget"}
                continue
            fetch_url = fetch_urls.get(url) or ""
            if not fetch_url:
                record[url] = {"reason": "relative target and no base URL to resolve it against"}
                refused += 1
                continue
            try:
                if fetch_image is not None:
                    body = fetch_image(fetch_url)
                else:
                    body = fetcher.get(
                        fetch_url, max_bytes=images_module.MAX_SOURCE_BYTES).body or b""
                clean, width, height = images_module.sanitise(body)
            except images_module.Unusable as error:
                record[url] = {"reason": str(error)[:120]}
                refused += 1
                continue
            except Exception as error:
                record[url] = {"reason": "%s: %s" % (type(error).__name__, str(error)[:90])}
                refused += 1
                continue
            record[url] = {"sha256": store.put(clean), "bytes": len(clean),
                           "width": width, "height": height}
            embedded += len(clean)
            kept += 1
        entry["images"] = record
        usable = sum(1 for item in record.values() if item.get("sha256"))
        manifest.record(key, "images", result="stored", bytes=embedded,
                        reason="%d of %d image(s) preserved" % (usable, len(record)))
        print("  %-52s %3d/%-3d kept  %7d bytes"
              % (slug[:52], usable, len(record), embedded))
        # A sweep of the whole archive is thousands of requests and hours long.
        # Saving as it goes means an interruption costs the document in hand
        # rather than the run.
        if documents % 25 == 0:
            manifest.save()

    manifest.save()
    print("\n%d document(s): %d image(s) preserved, %d refused, %d already held."
          % (documents, kept, refused, held))
    print("Run `refs.py pdf --stale --force` to print them into the archived PDFs.")
    return 0


def command_papers(args):
    """Preserve the publisher's own PDF of an archived article (network).

    A research post very often offers itself as a PDF - "you can also get this
    paper as a print/download friendly PDF" - and every PortSwigger research
    post does. Printing our Markdown instead of taking that file throws away the
    author's figures, tables and typesetting for no reason.

    NETWORK LIVES IN ITS OWN COMMAND. `pdf` is offline by contract, so this
    fetches and stores the bytes, and `pdf` later prefers them over rendering.
    """
    from refslib import linked_documents
    from refslib import makepdf
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    fetcher = check_module.fetcher_module.Fetcher(per_host_gap=args.gap,
                                                  timeout=args.timeout)

    # A PAPER THE NETWORK CANNOT DELIVER. `blog.watchfire.com/FPI.pdf` is the
    # Flash Parameter Injection advisory, named by its own 2008 article and
    # served by a host that has been gone for years. The maintainer has a copy;
    # without this the only route would be a fetch that can never succeed.
    if args.from_file or args.from_url:
        targets = [(key, entry) for key, entry in manifest.data["urls"].items()
                   if args.only and args.only.lower() in key.lower()]
        if len(targets) != 1:
            print("Name exactly one reference with --only (matched %d)." % len(targets))
            return 2
        key, entry = targets[0]
        # `--from-url` NAMES A PAPER THE PAGE DOES NOT LINK. A GitHub research
        # repository carries `Successful Errors.pdf` beside its README and links
        # only other people's papers from it, so no rule reading the page can
        # find it - but the URL is real, fetchable and worth recording.
        if args.from_url:
            response = fetcher.get(args.from_url, max_bytes=64 * 1024 * 1024)
            body = response.body or b""
            provenance, origin = "fetched", args.from_url
        else:
            body = Path(args.from_file).read_bytes()
            slug = entry.get("slug") or key
            md_path = archive_dir / collections_module.md_relpath(entry, config, slug)
            origin = linked_documents.paper_link(
                md_path.read_text(encoding="utf-8") if md_path.exists() else "",
                (entry.get("spellings") or [key])[0])
            provenance = "manual-import"
        if not makepdf.is_pdf_bytes(body):
            print("That is not a PDF (%d bytes)." % len(body))
            return 2
        slug = entry.get("slug") or key
        entry["paper"] = {
            "url": origin,
            "sha256": store.put(body),
            "bytes": len(body),
            "retrieved_utc": manifest_module.utc_now(),
            "provenance": provenance,
        }
        manifest.record(key, "paper", result="stored", file="", bytes=len(body),
                        reason="%s: %s" % (provenance, origin or "url not recorded"))
        manifest.save()
        print("  stored   %-52s %8d bytes  (%s)" % (slug[:52], len(body), provenance))
        if not origin:
            print("\nThe article does not name a PDF of its own, so nothing records"
                  "\nwhere this file came from. Check it is the right document, or"
                  "\npass --from-url so the record says where it came from.")
        print("\nRun `refs.py pdf --stale --force` to publish it.")
        return 0

    found, stored, failed, skipped = 0, 0, 0, 0
    for key, entry in manifest.data["urls"].items():
        if args.only and args.only.lower() not in key.lower():
            continue
        slug = entry.get("slug")
        if not slug:
            continue
        # A reference whose ORIGINAL is already a PDF has nothing to look for.
        if (entry.get("steps") or {}).get("pdf", {}).get("source") == "original-pdf":
            continue
        md_path = archive_dir / collections_module.md_relpath(entry, config, slug)
        if not md_path.exists():
            continue
        url = linked_documents.paper_link(
            md_path.read_text(encoding="utf-8"), (entry.get("spellings") or [key])[0])
        if not url:
            continue
        found += 1
        if (entry.get("paper") or {}).get("sha256") and not args.force:
            skipped += 1
            continue
        try:
            response = fetcher.get(url, max_bytes=64 * 1024 * 1024)
            body = response.body or b""
            if not makepdf.is_pdf_bytes(body):
                raise ValueError("the link served %d bytes that are not a PDF"
                                 % len(body))
            entry["paper"] = {
                "url": url,
                "sha256": store.put(body),
                "bytes": len(body),
                "retrieved_utc": manifest_module.utc_now(),
            }
            entry["also_at"] = sorted(set((entry.get("also_at") or []) + [url]))
            manifest.record(key, "paper", result="stored", file="", bytes=len(body),
                            reason=url)
            stored += 1
            print("  stored   %-52s %8d bytes  %s" % (slug[:52], len(body), url[:60]))
        except Exception as error:
            failed += 1
            manifest.record(key, "paper", result="failed",
                            reason="%s: %s" % (type(error).__name__, str(error)[:120]))
            print("  FAILED   %-52s %s" % (slug[:52], str(error)[:60]))

    manifest.save()
    print("\n%d article(s) name their own PDF: %d stored, %d already held, %d failed."
          % (found, stored, skipped, failed))
    print("Run `refs.py pdf --stale --force` to publish them.")
    return 1 if failed else 0


def _pdf_is_stale(entry, config, archive_dir):
    """Whether this reference's published PDF no longer reflects its inputs.

    A full `pdf --force` reprints 1,344 documents through a browser to fix the
    handful that changed. Four things make a PDF out of date, and each is
    something a preceding command recorded:

    * the Markdown it was printed from has been rewritten since;
    * `papers` has since fetched the publisher's own PDF of the article, which
      outranks anything we could print;
    * `images` has since preserved figures that are not in it;
    * `translate` has since written an English file that has never been printed.
    """
    steps = entry.get("steps") or {}
    slug = entry.get("slug") or ""
    printed = steps.get("pdf") or {}
    out_path = archive_dir / collections_module.pdf_relpath(entry, config, slug)
    if not out_path.exists():
        return True
    if (entry.get("paper") or {}).get("sha256") and printed.get("source") != "linked-paper":
        return True
    # THE TRANSLATION IS PRINTED IN A PASS OF ITS OWN, and it is reached only for
    # a reference this selector keeps. Checked BEFORE the source test: a Japanese
    # slide deck's own PDF is copied verbatim and can never be stale, and
    # skipping it here left its brand-new English file unprinted.
    translated_md = archive_dir / collections_module.translated_md_relpath(
        entry, config, slug)
    if translated_md.exists():
        translated_pdf = archive_dir / collections_module.translated_pdf_relpath(
            entry, config, slug)
        if not translated_pdf.exists() or (translated_pdf.stat().st_mtime
                                           < translated_md.stat().st_mtime):
            return True
    if printed.get("source") != "markdown":
        return False
    # A converter fix changes what the document should look like without
    # touching the Markdown it came from, so the file's own timestamps cannot
    # see it. The recorded version can.
    from refslib import makepdf as makepdf_module
    if (printed.get("renderer") or 1) < makepdf_module.RENDERER:
        return True
    md_path = archive_dir / collections_module.md_relpath(entry, config, slug)
    if md_path.exists() and md_path.stat().st_mtime > out_path.stat().st_mtime:
        return True
    images_at = (steps.get("images") or {}).get("utc") or ""
    return bool(images_at and images_at > (printed.get("utc") or ""))


def _image_source(entry, store):
    """A lookup from image URL to an embeddable copy the archive already holds.

    OFFLINE, and it has to be: `pdf` prints without a network, so an image that
    `images` did not preserve is simply not printed. Returns None when this
    reference has no preserved images, so the converter skips the work entirely.
    """
    held = {url: item.get("sha256") for url, item in (entry.get("images") or {}).items()
            if item.get("sha256")}
    if not held:
        return None
    from refslib import images as images_module

    cache = {}

    def source(url):
        if url in cache:
            return cache[url]
        sha = held.get(url)
        body = store.get(sha) if (sha and store.has(sha)) else b""
        cache[url] = images_module.data_uri(body) if body else ""
        return cache[url]

    return source


def command_pdf(args):
    """Make a PDF copy of every archived reference, beside its Markdown file.

    Prints OUR archived Markdown (offline, no third-party page scripts) through
    the headless browser. A source that is ALREADY a PDF is copied verbatim from
    the content store instead of re-rendered, so its own typesetting survives. A
    video is not a page and is skipped. Idempotent: without --force, a reference
    that already has a PDF is left alone.
    """
    from refslib import container_browser
    from refslib import indexer
    from refslib import makepdf
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    settings = config.get("pdf") or {}
    skip_kinds = set(settings.get("skip_kinds") or ["video"])

    def wanted(key, entry):
        if not indexer.has_document(entry):
            return False
        if not _entry_in_collection(entry, args.collection, config):
            return False
        if (entry.get("kind") or "") in skip_kinds:
            return False
        if args.only and args.only.lower() not in key.lower():
            return False
        if args.stale and not _pdf_is_stale(entry, config, archive_dir):
            return False
        return True

    entries = [(key, entry) for key, entry in manifest.data["urls"].items()
               if wanted(key, entry)]

    ladder = container_browser.Printer()
    # Only needed when something has to be RENDERED. An all-PDF-origin run copies
    # from the store and never launches a browser, so a missing browser is only
    # fatal once a non-PDF source needs printing.
    made = copied = skipped = failed = cleared = 0
    print("Making PDFs for %d archived reference(s) into %s/%s/<year>/.\n"
          % (len(entries), config.get("archive_dir") or "archived-references",
             collections_module.pdf_tree(config)))
    if not ladder.available():
        print("No Docker toolbox browser available for rendering (%s). PDF-origin "
              "sources are still" % (ladder.error or "unknown reason"))
        print("copied; anything that must be rendered from Markdown is skipped.\n")

    for number, (key, entry) in enumerate(entries, start=1):
        if args.translations_only:
            continue
        slug = entry["slug"]
        out_path = archive_dir / collections_module.pdf_relpath(entry, config, slug)
        out_dir = out_path.parent
        url = (entry.get("spellings") or [key])[0]
        # `--stale` IS THE AUTHORISATION. Selecting a reference already means its
        # PDF no longer reflects its inputs, so leaving it to the exists-guard
        # below made `--stale` alone a guaranteed no-op: it reported "0 rendered,
        # 679 skipped", which reads as "nothing needed doing" when it meant "I
        # was not allowed to do anything". That cost a run of 457 re-rendered
        # documents their PDF refresh, and read as a detection failure instead.
        if out_path.exists() and not (args.force or args.stale):
            if _clear_completed_pdf_gap(entry, out_path):
                manifest.record(key, "pdf-remedy", result="resolved",
                                file=paths.rel(out_path, root),
                                reason="the previously missing archive PDF now exists")
                cleared += 1
            skipped += 1
            continue

        raw = store.get(entry["raw_sha256"]) if (
            entry.get("raw_sha256") and store.has(entry["raw_sha256"])) else b""
        # THE AUTHOR'S OWN PDF OF THIS DOCUMENT, when `papers` found and stored
        # one. It outranks our text render for the same reason an original PDF
        # does: it is the document as its publisher typeset it, figures and all.
        paper_sha = (entry.get("paper") or {}).get("sha256") or ""
        paper = store.get(paper_sha) if (paper_sha and store.has(paper_sha)) else b""
        try:
            if makepdf.is_pdf_bytes(paper):
                out_dir.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(paper)
                manifest.record(key, "pdf", result="copied",
                                file=paths.rel(out_path, root), bytes=len(paper),
                                source="linked-paper")
                if _clear_completed_pdf_gap(entry, out_path):
                    manifest.record(key, "pdf-remedy", result="resolved",
                                    file=paths.rel(out_path, root),
                                    reason="the previously missing archive PDF now exists")
                    cleared += 1
                copied += 1
                print("  [%3d] copied   %-52s %d bytes (publisher's own paper)"
                      % (number, slug[:52], len(paper)))
                continue

            if makepdf.is_pdf_bytes(raw):
                out_dir.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(raw)
                manifest.record(key, "pdf", result="copied", file=paths.rel(out_path, root),
                                bytes=len(raw), source="original-pdf")
                if _clear_completed_pdf_gap(entry, out_path):
                    manifest.record(key, "pdf-remedy", result="resolved",
                                    file=paths.rel(out_path, root),
                                    reason="the previously missing archive PDF now exists")
                    cleared += 1
                copied += 1
                print("  [%3d] copied   %-52s %d bytes (original PDF)"
                      % (number, slug[:52], len(raw)))
                continue

            md_path = archive_dir / collections_module.md_relpath(entry, config, slug)
            if not md_path.exists():
                skipped += 1
                print("  [%3d] skipped  %-52s no Markdown file on disk yet" % (number, slug[:52]))
                continue
            if not ladder.available():
                skipped += 1
                continue
            text = md_path.read_text(encoding="utf-8")
            title = entry.get("title_english") or entry.get("title") or slug
            document = makepdf.markdown_to_html(
                text, title=title, source_url=url,
                image_source=_image_source(entry, store))
            pdf = ladder.print_pdf(document)
            out_dir.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(pdf)
            manifest.record(key, "pdf", result="rendered", file=paths.rel(out_path, root),
                            bytes=len(pdf), source="markdown",
                            renderer=makepdf.RENDERER)
            if _clear_completed_pdf_gap(entry, out_path):
                manifest.record(key, "pdf-remedy", result="resolved",
                                file=paths.rel(out_path, root),
                                reason="the previously missing archive PDF now exists")
                cleared += 1
            made += 1
            print("  [%3d] rendered %-52s %d bytes" % (number, slug[:52], len(pdf)))
        except Exception as error:      # one bad page never stops the batch
            failed += 1
            manifest.record(key, "pdf", result="failed",
                            reason="%s: %s" % (type(error).__name__, str(error)[:120]))
            print("  [%3d] FAILED   %-52s %s"
                  % (number, slug[:52], str(error)[:60]))

    # THE ENGLISH GETS A PDF TOO, in a pass of its own. It cannot ride along in
    # the loop above: a source that was already a PDF is COPIED verbatim and
    # skips straight past the rendering branch, yet its translation is our own
    # Markdown and still has to be printed. A translated file is always rendered
    # rather than copied, whatever the original was.
    translated = 0
    for number, (key, entry) in enumerate(entries, start=1):
        slug = entry["slug"]
        md_path = archive_dir / collections_module.translated_md_relpath(entry, config, slug)
        if not md_path.exists():
            continue
        out_path = archive_dir / collections_module.translated_pdf_relpath(entry, config, slug)
        if out_path.exists() and not args.force:
            skipped += 1
            continue
        if not ladder.available():
            skipped += 1
            continue
        try:
            title = (entry.get("title_english") or entry.get("title") or slug)
            document = makepdf.markdown_to_html(
                md_path.read_text(encoding="utf-8"),
                title=title + " (English translation)",
                source_url=(entry.get("spellings") or [key])[0])
            pdf = ladder.print_pdf(document)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(pdf)
            manifest.record(key, "pdf-translation", result="rendered",
                            file=paths.rel(out_path, root), bytes=len(pdf),
                            source="markdown-translation")
            translated += 1
            print("  [%3d] translated %-50s %d bytes"
                  % (number, collections_module.translated_slug(slug)[:50], len(pdf)))
        except Exception as error:
            failed += 1
            manifest.record(key, "pdf-translation", result="failed",
                            reason="%s: %s" % (type(error).__name__, str(error)[:120]))
            print("  [%3d] FAILED   %-52s %s"
                  % (number, collections_module.translated_slug(slug)[:52], str(error)[:60]))

    manifest.save()
    print("\n%d rendered, %d copied from an original PDF, %d translation(s), "
          "%d skipped, %d failed; %d satisfied PDF fault(s) cleared."
          % (made, copied, translated, skipped, failed, cleared))
    print("PDFs: %s" % paths.rel(archive_dir, root))
    return 1 if failed else 0


def _pdf_bytes_for(args, manifest, store):
    """(key, entry, pdf bytes) for the one reference named by --only.

    Shared by `pdf-text` and `pdf-pages`, which differ only in what they do with
    the bytes. Returns (None, None, b"") after printing why, so both commands
    report the same thing when the reference is not a PDF.
    """
    targets = [(key, entry) for key, entry in manifest.data["urls"].items()
               if args.only and args.only.lower() in key.lower()]
    if len(targets) != 1:
        print("Name exactly one reference with --only (matched %d)." % len(targets))
        return None, None, b""
    key, entry = targets[0]
    url = (entry.get("spellings") or [key])[0]

    body = b""
    if entry.get("raw_sha256") and store.has(entry["raw_sha256"]):
        body = store.get(entry["raw_sha256"])
    if body[:5] != b"%PDF-":
        # A GitHub blob page is a viewer, not the file; the raw host serves the
        # bytes. Without this the fetch brings back HTML and the command reports
        # "not a PDF" about a document that is plainly a PDF.
        from refslib import github as github_module
        fetch_url = github_module.raw_url(url) or url
        fetcher = check_module.fetcher_module.Fetcher(per_host_gap=1.0, timeout=60)
        response = fetcher.get(fetch_url, max_bytes=64 * 1024 * 1024)
        body = response.body or b""
        if body[:5] == b"%PDF-":
            entry["raw_sha256"] = store.put(body)
    if body[:5] != b"%PDF-":
        print("That reference is not a PDF, or the PDF could not be fetched.")
        return None, None, b""
    return key, entry, body


def command_pdf_text(args):
    """Read a PDF's text with poppler, in the container.

    THE STEP BEFORE LOOKING AT PICTURES. The in-process extractor reads a PDF
    through its own /ToUnicode map and refuses when that map is missing or wrong,
    because guessing produces confident nonsense. Poppler carries font tables
    that cover many of those documents: on this corpus it read three browser
    security whitepapers cleanly that the in-process route could only produce as
    replacement characters. Only a PDF this cannot read either - a scan, with no
    text layer at all - needs `pdf-pages` and a reader.
    """
    from refslib import extract_doc, toolbox as toolbox_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())

    key, entry, body = _pdf_bytes_for(args, manifest, store)
    if not key:
        return 2

    try:
        text = toolbox_module.pdf_text(body, log=lambda line: print("  " + line))
    except toolbox_module.Unavailable as error:
        print("SKIPPED: %s" % error)
        return 0

    readable, why = extract_doc.text_quality(text)
    print("  %d characters, %d replacement character(s)"
          % (len(text), text.count("�")))
    if not readable:
        print("REFUSED: poppler's text is not readable prose either - %s." % why)
        print("This PDF needs 'refs.py pdf-pages' and a reader: no usable text layer.")
        manifest.record(key, "pdf-text", result="refused", reason=why)
        manifest.save()
        return 1

    into = Path(args.into) if args.into else Path(paths.tool_dir()) / "cache" / "pdf-text" / (
        entry.get("slug") or "reference")
    into.mkdir(parents=True, exist_ok=True)
    title = entry.get("title") or entry.get("cited_title") or (entry.get("slug") or "reference")
    out = into / ((entry.get("slug") or "reference") + ".md")
    out.write_text("# %s\n\n%s\n" % (title, text.strip()), encoding="utf-8", newline="\n")
    url = (entry.get("spellings") or [key])[0]
    (into / (out.name + ".url")).write_text(url, encoding="utf-8", newline="\n")

    manifest.record(key, "pdf-text", result="read", chars=len(text))
    manifest.save()
    print("\nWrote:\n  %s\n" % out)
    print("It is a conversion rather than a reading step, so it files itself:")
    print("  refs.py import %s" % into)
    return 0


def command_pdf_pages(args):
    """Render a PDF whose text cannot be read into one image per page.

    The last resort for a document, and deliberately only half a route: this
    produces the pages, and a reader - human or model - turns them into text.
    Deciding what a page SAYS is not a converter's job, and a converter that
    guessed produced 32% of its words without a vowel.
    """
    from refslib import toolbox as toolbox_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())

    targets = [(key, entry) for key, entry in manifest.data["urls"].items()
               if args.only and args.only.lower() in key.lower()]
    if len(targets) != 1:
        print("Name exactly one reference with --only (matched %d)." % len(targets))
        return 2
    key, entry = targets[0]
    url = (entry.get("spellings") or [key])[0]

    body = b""
    if entry.get("raw_sha256") and store.has(entry["raw_sha256"]):
        body = store.get(entry["raw_sha256"])
    if body[:5] != b"%PDF-":
        fetcher = check_module.fetcher_module.Fetcher(per_host_gap=1.0, timeout=60)
        response = fetcher.get(url, max_bytes=64 * 1024 * 1024)
        body = response.body or b""
        if body[:5] == b"%PDF-":
            entry["raw_sha256"] = store.put(body)
    if body[:5] != b"%PDF-":
        print("That reference is not a PDF, or the PDF could not be fetched.")
        return 1

    into = Path(args.into) if args.into else Path(paths.tool_dir()) / "cache" / "pdf-pages" / (
        entry.get("slug") or "reference")
    into.mkdir(parents=True, exist_ok=True)
    try:
        pages = toolbox_module.pdf_page_images(body, str(into), first=args.first,
                                               last=args.last,
                                               log=lambda line: print("  " + line))
    except toolbox_module.Unavailable as error:
        print("SKIPPED: %s" % error)
        return 0

    manifest.record(key, "pdf-pages", result="rendered", pages=len(pages))
    manifest.save()
    print("\n%d page image(s) in:\n  %s\n" % (len(pages), into))
    print("NEXT, and it is a READING step rather than a conversion:")
    print("  1. Read the images in order and write what each page says.")
    print("  2. Save that as one Markdown file in a directory of its own.")
    print("  3. `refs.py import <that directory>` files it against this citation.")
    print("\nWrite only what is ON the page. A transcription that fills in gaps is")
    print("worse than the gibberish this route exists to replace, because it reads")
    print("as though somebody checked it.")
    return 0


def command_insecure(args):
    """Fetch a source whose certificate has expired, in the container."""
    from refslib import toolbox as toolbox_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())

    targets = [(key, entry) for key, entry in manifest.data["urls"].items()
               if args.only and args.only.lower() in key.lower()]
    if not targets:
        print("Nothing matched --only. This is deliberate: skipping certificate")
        print("verification is a per-reference decision, never a sweep.")
        return 0

    print("Fetching %d reference(s) WITHOUT certificate verification.\n" % len(targets))
    print("This runs in the container, not in the archive's own client, so")
    print("\"our fetcher always verifies\" stays true. Maintainer decision")
    print("2026-08-04, for collecting a public document from an expired host.\n")

    recovered = 0
    for key, entry in targets:
        url = (entry.get("spellings") or [key])[0]
        try:
            body = toolbox_module.fetch_insecure(url, log=lambda line: print("  " + line))
        except toolbox_module.Unavailable as error:
            print("  SKIPPED    %s" % error)
            continue
        digest = store.put(body)
        entry["raw_sha256"] = digest
        # The interstitial a browser recorded is not the page. A real fetch of
        # the document supersedes it.
        entry.pop("browser_dom_sha256", None)
        # A SLUG MINTED FROM AN ERROR PAGE WAS NEVER THE DOCUMENT'S IDENTITY.
        # The browser's TLS interstitial produced `chromewebdata-privacy-error`
        # and a slug is otherwise pinned for good, so it has to be released
        # here or the recovered document keeps the error page's name.
        if (entry.get("decision") or {}).get("class") == grade_module.BROKEN:
            entry["slug"] = None
            for stale in ("title", "publisher", "authors", "published", "language"):
                entry.pop(stale, None)
            # The health was recorded FROM the error page too, and its final_url
            # is what the publisher is derived from when a page declares none:
            # the recovered Chinese advisory came back attributed to
            # "chromewebdata", the browser's own scheme for an interstitial.
            entry.pop("health", None)
        entry["decision"] = None
        manifest.record(key, "insecure-fetch", result="stored", sha256=digest,
                        bytes=len(body),
                        reason="certificate verification skipped by maintainer decision")
        recovered += 1
        print("  stored     %-58s %7d bytes" % (url[:58], len(body)))

    manifest.save()
    print("\n%d reference(s) now hold their document." % recovered)
    print("Run 'refs.py acquire --force --only ...' to extract, offline.")
    return 0


def command_transcripts(args):
    """Fetch talk captions with yt-dlp, in a container. Nothing else runs it."""
    from refslib import toolbox as toolbox_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())

    # Only talks that still lack one, unless asked for all. A transcript already
    # in the store is content, and re-fetching it would be a request for nothing.
    def wanted(key, entry):
        if (entry.get("kind") or "") != "video":
            return False
        if args.only and args.only.lower() not in key.lower():
            return False
        if args.force:
            return True
        return not (entry.get("transcript_sha256")
                    and store.has(entry["transcript_sha256"]))

    targets = [(key, entry) for key, entry in manifest.data["urls"].items()
               if wanted(key, entry)]
    if not targets:
        print("Every talk already has a transcript. Pass --force to fetch again.")
        return 0

    print("Transcripts for %d talk(s), fetched by yt-dlp INSIDE A CONTAINER." % len(targets))
    print("The container gets one throwaway output directory and the network:")
    print("no repository, no content store, no environment, no capabilities,")
    print("read-only root, non-root user. Nothing it downloads is executed.\n")

    try:
        found = toolbox_module.fetch([(entry.get("spellings") or [key])[0]
                                         for key, entry in targets],
                                        log=lambda line: print("  " + line))
    except toolbox_module.Unavailable as error:
        print("\nSKIPPED: %s" % error)
        print("This is optional. Every talk keeps its metadata and records the gap.")
        return 0

    stored = 0
    for key, entry in targets:
        url = (entry.get("spellings") or [key])[0]
        body = found.get(url)
        if not body:
            manifest.record(key, "transcript", result="none",
                            reason="no caption track came back for this talk")
            print("  none       %s" % url[:78])
            continue
        digest = store.put_text(body)
        entry["transcript_sha256"] = digest
        manifest.record(key, "transcript", result="stored", sha256=digest,
                        chars=len(body), tool="yt-dlp " + toolbox_module.YT_DLP)
        stored += 1
        print("  stored     %-58s %7d bytes" % ((entry.get("slug") or url)[:58], len(body)))

    manifest.save()
    print("\n%d of %d talk(s) now have a transcript in the store." % (stored, len(targets)))
    print("Run 'refs.py acquire --force --kind video' to render them, offline.")
    return 0


def maintainer_decision(key, entry, decisions):
    """The maintainer's judgement for this reference, under any of its spellings."""
    for candidate in [key] + list(entry.get("spellings") or []):
        if candidate in decisions:
            return decisions[candidate]
        if candidate.rstrip("/") in decisions:
            return decisions[candidate.rstrip("/")]
    return None


def prune_orphans(root, config, manifest):
    """Delete archive files no entry claims any more.

    More than a dropped citation orphans a file: an import that corrects a slug
    leaves the old name behind, and a stale file is worse than a missing one
    because it still reads as current.
    """
    from refslib import verify as verify_module
    stale = verify_module.orphans(root, config, manifest)
    for path in stale:
        print("  removing orphan: %s" % paths.rel(path, root))
        Path(path).unlink()
    print("Removed %d orphan file(s).\n" % len(stale))
    return len(stale)


def command_index(args):
    """Generate the folder index. Offline, and the only discovery route."""
    from refslib import indexer
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    archive_dir.mkdir(parents=True, exist_ok=True)
    if args.prune_files:
        prune_orphans(root, config, manifest)
    text = indexer.build_index(manifest, config)
    (archive_dir / "README.md").write_text(text, encoding="utf-8", newline="\n")
    print("Wrote %s (%d bytes)." % (paths.rel(archive_dir / "README.md", root), len(text)))

    unresolved = indexer.build_document_gaps(manifest, store=Store(paths.store_root()))
    (archive_dir / "document-gaps.md").write_text(unresolved, encoding="utf-8", newline="\n")
    print("Wrote %s - the list to read when something needs fetching another way."
          % paths.rel(archive_dir / "document-gaps.md", root))

    excluded = indexer.build_excluded(manifest)
    (archive_dir / "excluded.md").write_text(excluded, encoding="utf-8", newline="\n")
    print("Wrote %s - what the archive keeps no document for, and why."
          % paths.rel(archive_dir / "excluded.md", root))

    # Kept apart from document-gaps.md on purpose. These references ARE archived;
    # only the evidence behind their published files is gone, and listing them
    # as unfetched work buried the ones that genuinely have no document.
    gaps = indexer.build_store_gaps(manifest, store=Store(paths.store_root()))
    (archive_dir / "store-gaps.md").write_text(gaps, encoding="utf-8", newline="\n")
    print("Wrote %s - archived references whose stored bytes are gone."
          % paths.rel(archive_dir / "store-gaps.md", root))
    return 0


# Where a byline hides in the middle of a long document: an author block partway
# down, an "About the author" section, a talk's closing credits, a paper's
# acknowledgements. Head-and-tail alone hid one from 130 of 536 documents.
_BYLINE_MARKER = re.compile(
    r"(?:^|\s)(?:by|authors?|posted by|written by|about the authors?"
    r"|acknowledge?ments)\b[:\s]", re.I)
_BYLINE_NAME = re.compile(
    r"[A-Z][a-zÀ-ſ'’-]{1,20}(?:\s+[A-Z][a-zÀ-ſ'’-]{1,20}){1,3}")


def _byline_windows(middle, budget=3, span=220):
    """Bounded passages from the unseen middle that look like they name someone.

    Deliberately generous about what it offers and silent about what it means:
    deciding whether "by" introduces an author or a technique is the reviewer's
    job, and a window that turns out to be neither costs one line of reading.
    """
    windows, used = [], 0
    for match in _BYLINE_MARKER.finditer(middle):
        if used >= budget:
            break
        start = max(0, match.start() - 40)
        chunk = middle[start:start + span]
        if _BYLINE_NAME.search(chunk):
            windows.append(chunk.strip())
            used += 1
    return windows


def _byline_excerpt(text, head=1600, tail=400):
    """The part of an archived file a byline would be in, minus our own words.

    A reviewer must see THE SOURCE'S text, not the archive's. Our rendered file
    opens with frontmatter, a heading and an attribution block that already
    says "Author not stated" - hand a reader that and they will faithfully
    report what we already believe, which is the one answer that cannot be new.
    Everything up to the untrusted-source banner is therefore dropped.

    Links collapse to their text because a byline is a name and a URL is a place;
    keeping the targets tripled the size of the excerpt and added the one kind of
    content most worth not putting in front of a language model.

    Head and tail, because a paper names its authors under the title and a
    whitepaper often names them again in a closing biography.
    """
    from refslib import render as render_module
    body = text.split("\n---\n", 2)[-1] if text.startswith("---\n") else text
    banner = render_module.BANNER.strip().splitlines()[-1].strip()
    cut = body.find(banner)
    if cut >= 0:
        body = body[cut + len(banner):]
    body = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", body)
    body = re.sub(r"<https?://[^>]*>", " ", body)
    body = re.sub(r"\s+", " ", body).strip()
    if len(body) <= head + tail:
        return body
    parts = [body[:head].strip()]
    parts.extend(_byline_windows(body[head:-tail]))
    parts.append(body[-tail:].strip())
    return " […] ".join(parts)


def _byline_queue(manifest, root, config, only="", limit=None, recorded=()):
    """References with no author yet, paired with the text to read it from.

    Skips anything already answered - by extraction, by a maintainer, or by an
    earlier review - so a run that stops halfway resumes instead of restarting.
    """
    from refslib import collections as collections_module
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    queue = []
    for key, entry in sorted(manifest.data["urls"].items()):
        if entry.get("authors") or key in recorded:
            continue
        if only and only.lower() not in key.lower():
            continue
        if not entry.get("slug"):
            continue
        path = archive_dir / collections_module.md_relpath(entry, config, entry["slug"])
        if not path.exists():
            continue
        queue.append({
            "url": key,
            "slug": entry.get("slug") or "",
            "title": entry.get("title") or "",
            "publisher": entry.get("publisher") or "",
            "kind": entry.get("kind") or "",
            "excerpt": _byline_excerpt(path.read_text(encoding="utf-8", errors="replace")),
        })
        if limit is not None and len(queue) >= limit:
            break
    return queue


ACCEPTED_CONFIDENCE = {"high": ("high",), "medium": ("high", "medium")}


def _accept_byline(url, reading, known, accept="high"):
    """The reason to refuse one reviewed byline, or "" to take it.

    A WRONG NAME IS WORSE THAN NO NAME. An unattributed reference says the
    archive does not know; a misattributed one credits a stranger with someone's
    work and reads as fact. So a reading is taken only when it names a URL the
    archive holds, is confident enough, and can quote the words it read the name
    from.

    `accept` is the maintainer's call on how much evidence is enough, and the
    second tier exists because "medium" is not a synonym for "doubtful". It is
    what a reviewer says when a byline is real but sits somewhere other than
    under the title: a site-wide footer ("Wisec is written and mantained by
    Stefano Di Paola"), a signature, a handle an author has published under for
    twenty years. Judging those is a curation call, so it is spelled out on the
    command line rather than hidden in the threshold.
    """
    if url not in known:
        return "no such reference in the manifest"
    names = [str(name).strip() for name in (reading.get("authors") or [])
             if str(name).strip()]
    if not names:
        return ""              # "I read it and found nobody" is a real answer
    allowed = ACCEPTED_CONFIDENCE.get(accept) or ACCEPTED_CONFIDENCE["high"]
    if reading.get("confidence") not in allowed:
        return "confidence is not %s" % " or ".join(allowed)
    if not str(reading.get("evidence") or "").strip():
        return "no quotation to support the name"
    for name in names:
        if len(name) > 90 or "http" in name.lower() or "\n" in name:
            return "implausible name: " + name[:40]
    return ""


# AIM for 400 and REFUSE at 500, rather than truncating at 400. The corpus
# writes to this length naturally - median 357, ninetieth percentile 389 - so
# 400 is a real target, but 26 summaries overshot it by a few dozen characters
# and cutting them at the last sentence break under 400 deleted the FINDING:
# "...so a link to any site's own PDF makes the plugin issue attacker-chosen
# requests" survived while "that yields universal CSRF across Firefox, IE and
# Opera" did not. A ceiling that removes the result to satisfy a round number
# is the damage this function exists to prevent, so the hard limit sits where
# only a genuinely rambling summary meets it.
DIGEST_WANT = 400
DIGEST_MAX = 500
_SENTENCE_END = re.compile(r'[.!?](?=\s+["“(]?[A-Z0-9]|\s*$)')
# THERE IS NO FLOOR, BY DECISION. 20 documents here are honestly served by
# fewer than four tags - the annual list page is `survey` and nothing else, the
# DNS-rebinding paper is complete at two - and any floor buys itself by padding
# a document with tags that do not apply, which is the one thing a controlled
# vocabulary cannot afford. The cap stays, because a 30-tag document is not
# categorised, it is decorated.
#
# What the tags MUST do is a matter of content, not count: they have to name the
# techniques the research actually uses. That is what the reader searches for,
# and no threshold can check it.
DIGEST_TAGS_MAX = 10


def tag_vocabulary(manifest):
    """Every tag currently in use, counted. The vocabulary IS what survived review.

    There is no hand-maintained list to drift out of date: a tag enters by being
    applied to a document and surviving, and leaves by being merged away.
    """
    counts = {}
    for entry in manifest.data["urls"].values():
        for tag in ((entry.get("digest") or {}).get("tags") or []):
            counts[tag] = counts.get(tag, 0) + 1
    return counts


def _digest_queue(manifest, root, config, only="", collection="", limit=None):
    """References whose document is published but carries no current summary.

    Re-queues a digest written from DIFFERENT bytes than the document now holds,
    which is what makes this safe to re-run after a repair: a summary of a
    document that has since been recaptured is stale, and saying so is the whole
    point of recording `of`.
    """
    from refslib import collections as collections_module
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    queue = []
    for key, entry in sorted(manifest.data["urls"].items()):
        if only and only.lower() not in key.lower():
            continue
        if not entry.get("slug"):
            continue
        relpath = collections_module.md_relpath(entry, config, entry["slug"])
        if collection and ("/%s/" % collection) not in ("/%s" % str(relpath).replace("\\", "/")):
            continue
        path = archive_dir / relpath
        if not path.exists():
            continue
        digest = entry.get("digest") or {}
        if digest.get("text") and digest.get("of") == entry.get("content_sha256"):
            continue
        queue.append({
            "url": key,
            "slug": entry["slug"],
            "title": entry.get("title") or "",
            "publisher": entry.get("publisher") or "",
            "kind": entry.get("kind") or "",
            "path": str(relpath).replace("\\", "/"),
            "stale": bool(digest.get("text")),
        })
        if limit is not None and len(queue) >= limit:
            break
    return queue


def _trim_to_sentence(text, limit=DIGEST_MAX):
    """Cut an over-long summary at a sentence end, never mid-sentence.

    A summary that stops mid-clause reads as damage, and this archive already
    publishes enough of that. Returns "" when there is no sentence break to cut
    at, so the caller refuses the reading instead of publishing a fragment.

    THE SUMMARY IS PLAIN TEXT, so HTML entities are decoded once on the way in.
    A reviewer quoting a payload naturally writes `&lt;script&gt;` - they have
    just read it that way in the archived page - and every consumer escapes
    again on output, so storing it escaped shows the reader `&lt;script&gt;`
    where the payload should be. 32 summaries were written that way before this
    ran here.
    """
    text = html.unescape(" ".join(str(text or "").split()))
    if len(text) <= limit:
        return text
    # A FULL STOP IS NOT A SENTENCE END. Matching a bare "." cut one summary at
    # "Node.js" and another at ".NET", leaving "Characters that Node." and
    # "...trusted from KeyInfo, and ." - the naive-rule damage this whole
    # archive is a catalogue of. A sentence ends where a stop is FOLLOWED BY
    # WHITESPACE AND A CAPITAL, or ends the text; "Node.js", ".NET" and "2.0"
    # all fail that and are passed over.
    #
    # SEARCH WITHIN `limit`, NOT `limit + 1`: the slice keeps the stop itself,
    # so a break found AT the limit returns one character over the ceiling.
    cut = -1
    for match in _SENTENCE_END.finditer(text, 0, limit):
        cut = match.start()
    if cut <= 0:
        return ""
    # A CUT THAT KEEPS ALMOST NOTHING IS NOT A TRIM. Two summaries here open
    # with a short sentence and then run 480 characters of semicolon-chained
    # clauses to the end, so the only clean break sits at 63 of 546 characters
    # and "trimming" them would publish the opening line and delete every
    # finding. That summary needs rewriting into sentences, which is a person's
    # job, so refuse and let the caller say so.
    if cut + 1 < limit * 0.6:
        return ""
    return text[:cut + 1].strip()


def _accept_digest(url, reading, known, vocabulary):
    """(refusal reason, text, tags, new tags) for one reviewed summary.

    A TAG IS NO LONGER REFUSED FOR BEING NEW. Refusing it threw away the only
    moment when someone had actually read the document, and it could not be
    repaired later without reading the document again. The vocabulary was also
    counted from the tags in use, which made the refusal circular: a word the
    archive had agreed to adopt was still "unknown" until something already
    carried it, so the first document to need it was always refused.

    What keeps the vocabulary controlled now is `tags.resolve`: every tag is
    lower-cased, punctuation-folded and passed through the alias table before it
    is stored, so `XSS`, `xss` and `  XSS ` are one tag and `wasm` publishes as
    `webassembly`. Drift comes from spellings, and the spellings are gone before
    anything is written.

    A `?` prefix still means "I am proposing this", and is still reported - but
    the tag is kept rather than stripped, because the reviewer who wrote it had
    the document open and the maintainer reading the report does not.

    The cap stays. A 30-tag document is not categorised, it is decorated.
    """
    from refslib import tags as tags_module
    if url not in known:
        return "no such reference in the manifest", "", [], []
    text = _trim_to_sentence((reading or {}).get("text"))
    if not text:
        return "no summary, or none that ends at a sentence within %d characters" % DIGEST_MAX, "", [], []
    raw = [str(tag).strip() for tag in ((reading or {}).get("tags") or []) if str(tag).strip()]
    existing = (vocabulary or {}).get("tags") or {}
    tags, fresh = [], []
    for tag in raw:
        # The `?` says "I am proposing this". It is a note to the maintainer,
        # never part of the word, so it comes off before the tag is resolved.
        resolved = tags_module.resolve(tag.lstrip("?").strip(), vocabulary)
        if not resolved or resolved in tags:
            continue
        tags.append(resolved)
        if resolved not in existing and resolved not in fresh:
            fresh.append(resolved)
    if len(tags) > DIGEST_TAGS_MAX:
        return ("%d tag(s); at most %d"
                % (len(tags), DIGEST_TAGS_MAX), "", [], fresh)
    return "", text, tags, fresh


def command_digest(args):
    """Record a short summary and controlled tags for each archived document.

    Two halves, like `bylines`, and for the same reason: reading a document and
    saying what it is about is not the tool's judgement to make. `--queue` lists
    the documents with no current summary; a reviewer returns text and tags;
    `--apply` validates them against the vocabulary and writes them into the
    manifest, where the website reads them.

    Offline throughout. Nothing here fetches, renders or touches the store.
    """
    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    from refslib import tags as tags_module
    vocabulary_path = (root / (config.get("archive_dir") or "archived-references")
                       / "tag-vocabulary.json")
    vocabulary = tags_module.load(vocabulary_path)

    if args.publish:
        publish_digests(manifest, root, config, only=args.only,
                        collection=args.collection, refresh=args.refresh)
        return 0

    if args.vocabulary:
        written = write_tag_vocabulary(root, config, manifest)
        print("Wrote %s (%d tags, %d document(s) carrying a digest)."
              % (written[0], written[1], written[2]))
        return 0

    if args.queue:
        queue = _digest_queue(manifest, root, config, only=args.only,
                              collection=args.collection, limit=args.limit)
        stale = sum(1 for item in queue if item["stale"])
        Path(args.queue).write_text(
            json.dumps({"schema": 1, "count": len(queue),
                        # Most-used first, so a reviewer reaches for the word the
                        # archive already uses before inventing another for it.
                        "vocabulary": [tag for tag, _ in
                                       sorted((vocabulary.get("tags") or {}).items(),
                                              key=lambda kv: (-(kv[1] or {}).get("documents", 0),
                                                              kv[0]))],
                        "owasp": (vocabulary.get("owasp") or {}),
                        "queue": queue},
                       ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8", newline="\n")
        print("Wrote %d reference(s) needing a summary to %s (%d stale)."
              % (len(queue), args.queue, stale))
        print("Read each document, then record the result with "
              "`refs.py digest --apply <file>`.")
        return 0

    reviewed = json.loads(Path(args.apply).read_text(encoding="utf-8"))
    readings = reviewed.get("digests") if isinstance(reviewed, dict) else None
    if readings is None:
        readings = reviewed if isinstance(reviewed, dict) else {}
    known = manifest.data["urls"]

    taken = refused = 0
    trimmed, proposed, longer = [], {}, []
    for url, reading in sorted(readings.items()):
        before = len(" ".join(str((reading or {}).get("text") or "").split()))
        reason, text, tags, fresh = _accept_digest(url, reading or {},
                                                   known, vocabulary)
        if reason:
            refused += 1
            print("  REFUSED  %-52s %s" % (url[:52], reason))
            continue
        # Only a summary that was actually taken may widen the vocabulary. A
        # refused reading's tags never reached a document, so recording them
        # would grow the list with words nothing carries.
        for tag in fresh:
            proposed[tag] = proposed.get(tag, 0) + 1
        if before > len(text):
            trimmed.append((known[url].get("slug") or url, before, len(text)))
        if len(text) > DIGEST_WANT:
            longer.append((known[url].get("slug") or url, len(text)))
        if not args.check:
            known[url]["digest"] = {
                "text": text,
                "tags": tags,
                "by": args.by,
                "at": manifest_utc()[:10],
                "of": known[url].get("content_sha256") or "",
            }
        taken += 1

    for slug, before, after in trimmed:
        print("  TRIMMED  %-52s %d -> %d" % (str(slug)[:52], before, after))
    for slug, size in longer:
        print("  LONG     %-52s %d characters, over the %d we aim for"
              % (str(slug)[:52], size, DIGEST_WANT))
    if proposed:
        print("\nNew tag(s) entering the vocabulary: "
              + ", ".join("%s (x%d)" % (tag, count)
                          for tag, count in sorted(proposed.items())))
        print("Read them: a new word that means an existing one belongs in "
              "`aliases` in tag-vocabulary.json, not beside it.")
    if args.check:
        print("\n%d summary(ies) would be recorded; %d refused. "
              "This was --check: nothing was written." % (taken, refused))
        return 0
    manifest.save()
    tags_module.register(vocabulary, sorted(proposed))
    tags_module.recount(vocabulary, tag_vocabulary(manifest))
    vocabulary["updated"] = manifest_utc()
    tags_module.save(vocabulary_path, vocabulary)
    print("\nRecorded %d summary(ies); %d refused." % (taken, refused))
    print("Run `refs.py digest --vocabulary` to regenerate tag-vocabulary.md, "
          "then `index`.")
    return 0


def write_tag_vocabulary(root, config, manifest):
    """Refresh tag-vocabulary.json, and render tag-vocabulary.md from it.

    The JSON is the record; the Markdown is a reading of it. Counts are
    recomputed from the manifest, and everything a maintainer stated - aliases,
    the OWASP mapping - is carried through untouched.
    """
    from refslib import tags as tags_module
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    path = archive_dir / "tag-vocabulary.md"
    data_path = archive_dir / "tag-vocabulary.json"
    counts = tag_vocabulary(manifest)
    vocabulary = tags_module.load(data_path)
    tags_module.register(vocabulary, sorted(counts))
    tags_module.recount(vocabulary, counts)
    vocabulary["updated"] = manifest_utc()
    tags_module.save(data_path, vocabulary)

    documents = sum(1 for entry in manifest.data["urls"].values()
                    if (entry.get("digest") or {}).get("text"))
    known = vocabulary.get("tags") or {}
    owasp = (vocabulary.get("owasp") or {}).get("categories") or []
    by_tag = {}
    for category in owasp:
        for tag in category.get("tags") or []:
            by_tag.setdefault(tags_module.normalise(tag), []).append(category.get("id"))
    marker = "## The vocabulary"
    head = path.read_text(encoding="utf-8").split(marker)[0] + marker + "\n"
    once = sorted(tag for tag in known if counts.get(tag, 0) == 1)
    unused = sorted(tag for tag in known if not counts.get(tag))
    lines = [head,
             "\n%d tags, across %d documents that carry a digest.\n\n"
             % (len(known), documents),
             "| Tag | Documents | OWASP |\n|---|---|---|\n"]
    lines += ["| `%s` | %d | %s |\n"
              % (tag, counts.get(tag, 0), ", ".join(by_tag.get(tag) or []) or "—")
              for tag in sorted(known)]
    aliases = vocabulary.get("aliases") or {}
    if aliases:
        lines.append("\n### Never published\n\nThese spellings fold into another "
                     "tag before anything is written:\n\n")
        lines.append("| Written | Published as |\n|---|---|\n")
        lines += ["| `%s` | `%s` |\n" % (spelt, canonical)
                  for spelt, canonical in sorted(aliases.items())]
    if owasp:
        lines.append("\n### OWASP Top 10:%s\n\nA document earns these from the "
                     "techniques it is already tagged with; nobody tags them by "
                     "hand.\n\n"
                     % ((vocabulary.get("owasp") or {}).get("edition") or "2021"))
        lines.append("| Category | Tags |\n|---|---|\n")
        lines += ["| `%s` %s | %s |\n"
                  % (category.get("id"), category.get("title"),
                     ", ".join("`%s`" % tag for tag in (category.get("tags") or [])) or "—")
                  for category in owasp]
    if once:
        lines.append("\n### Used exactly once\n\nReview these before reusing them: "
                     + ", ".join("`%s`" % tag for tag in once) + "\n")
    if unused:
        lines.append("\n### Carried, but on no document\n\nAgreed once and kept so "
                     "the same word is not re-argued: "
                     + ", ".join("`%s`" % tag for tag in unused) + "\n")
    path.write_text("".join(lines), encoding="utf-8", newline="\n")
    return path.relative_to(root), len(known), documents


def _published_authors(text):
    """The author list a published file already states, read off its frontmatter."""
    match = re.search(r"^authors:(.*)$", text, re.MULTILINE)
    if not match:
        return []
    if match.group(1).strip():
        return []                      # `authors: []`, the only inline form written
    names = []
    # SKIP THE FIRST SPLIT. The match ends before its newline, so the remainder
    # opens with the empty tail of the `authors:` line itself; reading it as the
    # first list item ended the loop immediately and reported every multi-name
    # file as having no authors at all.
    for line in text[match.end():].splitlines()[1:]:
        item = re.match(r"^  - (.*)$", line)
        if not item:
            break
        names.append(item.group(1).strip().strip('"'))
    return names


def _published_body(text):
    """The source's own words, taken back out of a file we already published.

    `render` writes the untrusted-source banner, then the body, then an optional
    recovery-notes section. Recovering the middle is what lets a byline be
    corrected WITHOUT the content store, which matters because the store is
    exactly what a hand import and a lost object do not have.
    """
    from refslib import render as render_module
    marker = render_module.BANNER
    if marker not in text:
        return None
    body = text.split(marker, 1)[1]
    cut = body.find("\n## Recovery notes\n")
    if cut >= 0:
        body = body[:cut]
    return body.strip("\n")


# Lines the renderer OWNS and rewrites from current state, so a published file
# written months ago legitimately differs from a fresh render of the same
# document: the rights sentence was reworded, `cited_by` moves when a year list
# is edited, `status` and `stale_after` age. A difference anywhere else means the
# record was rebuilt wrong - a dropped `snapshot`, a lost `also_at` - and that is
# what the reproduction test is actually guarding against.
_REGENERATED = re.compile(
    r'^(?:\s*- "\d{4}(?:-\d\d)?(?:-ai)?\.md:\d+"|cited_by:.*|status: .*'
    r'|stale_after: .*|.*archive of a source from .*)$')


def _without_derived_tags(line):
    """A `tags:` line with the DERIVED OWASP categories taken back off.

    The categories are computed from the research tags, so a file written
    before the mapping existed states none - and comparing them would report
    every one of those documents as unreproducible, which is exactly what it
    did: all 1,488 refused in one run, each reported as "left as published".
    A derived facet is not evidence that the renderer disagrees.
    """
    if not line.startswith("tags: ["):
        return line
    kept = [tag.strip() for tag in line[len("tags: ["):].rstrip("]").split(",")
            if tag.strip() and not tag.strip().startswith("owasp-")]
    return "tags: [%s]" % ", ".join(kept)


_QUOTED_SCALAR = re.compile(r'^(\s*(?:-\s|[A-Za-z_][A-Za-z0-9_]*:\s)?)"(.*)"$')


def _unquoted(line):
    """A frontmatter line with its scalar quoting removed, for comparison only.

    Whether a value is quoted is a SERIALISATION detail, not content. It has to
    be, or the guard blocks exactly the documents a quoting fix exists to
    repair: 118 files stated `- @TechCrunch`, which is not valid YAML, and a
    renderer that has learned to write `- "@TechCrunch"` no longer reproduces
    them byte for byte.
    """
    match = _QUOTED_SCALAR.match(line)
    if not match:
        return line
    return match.group(1) + match.group(2).replace('\\"', '"').replace("\\\\", "\\")


def _same_but_for_generated(rebuilt, published):
    """Whether a fresh render differs from the published file only where it may."""
    keep = lambda text: [_unquoted(_without_derived_tags(line))
                         for line in text.splitlines()
                         if not _REGENERATED.match(line)]
    return keep(rebuilt) == keep(published)


def _republish_byline(path, entry, config):
    """Re-publish one archived document with the byline the manifest now states.

    NO FETCH AND NO STORE. The document is already here, and needing its source
    bytes again to change one line is what left 71 hand imports and 65
    references whose store objects are gone unable to be corrected at all.

    Safe because it PROVES the renderer reproduces this exact file before
    replacing it: the record is rendered once carrying the byline the file
    already shows, and that must equal the file byte for byte. Any difference
    means this document cannot be faithfully rebuilt here - an older renderer
    wrote it, or a field the manifest no longer holds - so it is left untouched
    and reported rather than rewritten into something subtly different.
    """
    from refslib import render as render_module
    text = path.read_text(encoding="utf-8")
    body = _published_body(text)
    if body is None:
        return "no untrusted-source banner: not a rendered reference"
    # THE FILE WINS over the manifest for everything it states. The manifest
    # historically did not retain the retrieval fields a published copy carries,
    # which is why `_frontmatter_scalars` exists; and letting the file win is
    # also what makes the reproduction test below meaningful rather than a test
    # of how well the manifest happens to match. The lists it cannot state as
    # scalars - `cited_by`, `also_at` - come from the entry underneath.
    record = dict(entry)
    record.update(_frontmatter_scalars(text))
    depth = entry.get("depth") or record.get("depth") or "full"
    was = dict(record, authors=_published_authors(text))
    try:
        if not _same_but_for_generated(render_module.render(was, body, depth), text):
            return "the renderer does not reproduce this file; left as published"
        corrected = dict(record, authors=list(entry.get("authors") or []))
        if entry.get("publisher"):
            corrected["publisher"] = entry["publisher"]
        rebuilt = render_module.render(corrected, body, depth)
    except render_module.MissingAttribution as error:
        return str(error)
    path.write_text(rebuilt, encoding="utf-8", newline="\n")
    return ""


def _published_description(text):
    """The description a published file states, or "" when it states none."""
    return _frontmatter_scalars(text).get("description") or ""


def _published_tags(text):
    """The tags a published file states, as a set."""
    match = re.search(r"^tags: \[(.*)\]$", text, re.MULTILINE)
    if not match:
        return set()
    return {tag.strip() for tag in match.group(1).split(",") if tag.strip()}


def _format_labels(text, record):
    """The tags `render` writes about the FILE rather than about the research."""
    from refslib import render as render_module
    labels = {record.get("kind") or "article", "webseclist-reference"}
    if record.get("language"):
        labels.add(record["language"])
    if record.get("publisher"):
        labels.add(render_module._slug_tag(record["publisher"]))
    return labels


def _published_research_tags(text, record):
    """The digest's own tags, taken back out of a published file's tag line.

    `render` writes the format labels first, then the research tags, then the
    derived OWASP categories. Removing the labels and the categories leaves what
    a reviewer chose, in the order they were written.
    """
    labels = _format_labels(text, record)
    match = re.search(r"^tags: \[(.*)\]$", text, re.MULTILINE)
    if not match:
        return []
    return [tag.strip() for tag in match.group(1).split(",")
            if tag.strip() and tag.strip() not in labels
            and not tag.strip().startswith("owasp-")]


def _digest_is_published(text, entry):
    """Whether a file already states everything the manifest's digest holds.

    Description ALONE is not the test. Tags move independently of it: folding
    `XSS` into `xss` and deriving the OWASP categories both change the tag line
    and leave the summary untouched, and a description-only check skipped every
    one of those documents while reporting success.
    """
    from refslib import tags as tags_module
    digest = entry.get("digest") or {}
    if _published_description(text) != (digest.get("text") or ""):
        return False
    research = digest.get("tags") or []
    wanted = set(research)
    wanted |= {tags_module.owasp_tag(identifier) for identifier
               in tags_module.owasp_categories(research, tags_module.current())}
    # EXACT, not a subset. A subset test cannot see a tag being REMOVED, and
    # removal is how a word is retired: retiring `novel-technique` from 743
    # documents left every one of them skipped, because what remained was still
    # a subset of what the files already stated.
    labels = _format_labels(text, entry)
    return wanted == (_published_tags(text) - labels)


def _republish_digest(path, entry, config):
    """Carry the summary and tags into one published document, in place.

    Same route and same proof as `_republish_byline`, for the same reason: a
    re-render needs the source bytes, which a hand import never had and 286
    references have lost. The renderer must first reproduce the file EXACTLY as
    it stands - rendered from a record with the digest withheld - before the
    version carrying the digest replaces it. A file an older renderer wrote is
    reported and left alone rather than rewritten into something subtly
    different.
    """
    from refslib import render as render_module
    text = path.read_text(encoding="utf-8")
    body = _published_body(text)
    if body is None:
        return "no untrusted-source banner: not a rendered reference"
    record = dict(entry)
    record.update(_frontmatter_scalars(text))
    depth = entry.get("depth") or record.get("depth") or "full"
    # Prove reproduction against the digest THE FILE STATES, not against no
    # digest at all. Withholding it worked only while this was a one-way
    # migration onto files that carried none; once every document states a
    # summary, a withheld-digest render can never reproduce one, and the guard
    # refused all 1,488 of them while reporting them as "left as published".
    was = dict(record)
    was.pop("description", None)
    was["digest"] = {"text": _published_description(text),
                     "tags": _published_research_tags(text, record)}
    try:
        if not _same_but_for_generated(render_module.render(was, body, depth), text):
            return "the renderer does not reproduce this file; left as published"
        corrected = dict(was, digest=entry.get("digest") or {})
        corrected.pop("description", None)
        rebuilt = render_module.render(corrected, body, depth)
    except render_module.MissingAttribution as error:
        return str(error)
    if rebuilt == text:
        return ""
    path.write_text(rebuilt, encoding="utf-8", newline="\n")
    return ""


def publish_digests(manifest, root, config, only="", collection="", refresh=False):
    """Carry every recorded summary and tag set into the published files.

    Idempotent: a file already stating the digest's description and tags is
    skipped, so this picks up a summary written by an earlier run as readily as
    one written a moment ago.

    `refresh` drops that skip and re-renders every document. It is the route
    for a RENDERER fix, which changes files whose summary and tags are already
    correct and which the skip therefore steps straight over: correcting the
    frontmatter quoting left 118 documents untouched, because what was wrong
    with them had nothing to do with their digest. It stays offline and keeps
    the same prove-then-replace guard, so it needs neither the store nor a
    fetch - which is the whole point, with 286 references whose stored bytes
    are gone.
    """
    from refslib import collections as collections_module
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    rewritten, refused, seen = 0, 0, 0
    for key, entry in sorted(manifest.data["urls"].items()):
        digest = entry.get("digest") or {}
        if not digest.get("text") or not entry.get("slug"):
            continue
        if only and only.lower() not in key.lower():
            continue
        relpath = collections_module.md_relpath(entry, config, entry["slug"])
        if collection and ("/%s/" % collection) not in ("/%s" % str(relpath).replace("\\", "/")):
            continue
        path = archive_dir / relpath
        if not path.exists():
            continue
        if not refresh and _digest_is_published(path.read_text(encoding="utf-8"), entry):
            continue
        seen += 1
        reason = _republish_digest(path, entry, config)
        if reason:
            refused += 1
            print("  KEPT     %-52s %s" % (key[:52], reason[:70]))
        else:
            rewritten += 1
    if not seen:
        print("Every published document already states the summary the manifest holds.")
        return rewritten, refused
    print("Re-published %d document(s) in place; %d left as they were."
          % (rewritten, refused))
    print("Refresh their PDFs with `refs.py pdf --stale`, then run `index`.")
    return rewritten, refused


def command_bylines(args):
    """Read authors out of the archived documents themselves (offline).

    Two halves, because the judgement in the middle is not the tool's to make.
    `--queue` writes out every reference with no author beside the text a byline
    would be in; a reviewer returns names with the quotation each was read from;
    `--apply` records the ones that clear the bar in `bylines.json`, which
    `decisions()` folds in beneath anything a maintainer has stated.

    Nothing here reaches the network or the store, and nothing re-renders: the
    published documents keep their old byline until `attribution` and a
    re-render carry it there, exactly as a maintainer-stated one does.
    """
    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    recorded = paths.bylines()

    if args.queue:
        queue = _byline_queue(manifest, root, config, only=args.only,
                              limit=args.limit, recorded=set(recorded))
        Path(args.queue).write_text(
            json.dumps({"schema": 1, "count": len(queue), "queue": queue},
                       ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8", newline="\n")
        print("Wrote %d reference(s) needing a byline to %s." % (len(queue), args.queue))
        print("Review each excerpt, then record the result with "
              "`refs.py bylines --apply <file>`.")
        return 0

    reviewed = json.loads(Path(args.apply).read_text(encoding="utf-8"))
    readings = reviewed.get("bylines") if isinstance(reviewed, dict) else None
    if readings is None:
        readings = reviewed if isinstance(reviewed, dict) else {}
    known = manifest.data["urls"]

    merged = dict(recorded)
    taken = refused = empty = 0
    for url, reading in sorted(readings.items()):
        reason = _accept_byline(url, reading or {}, known, args.accept)
        if reason:
            refused += 1
            print("  REFUSED  %-52s %s" % (url[:52], reason))
            continue
        names = [str(name).strip() for name in ((reading or {}).get("authors") or [])
                 if str(name).strip()]
        record = {"authors": names,
                  "evidence": str((reading or {}).get("evidence") or "").strip()[:300],
                  "confidence": (reading or {}).get("confidence") or "",
                  "reviewed_utc": manifest_utc()}
        merged[url] = record
        if names:
            taken += 1
        else:
            empty += 1

    body = {
        "_comment": [
            "GENERATED by `refs.py bylines --apply`, from a review of the archived",
            "text. Not hand-edited: state an author in overrides.json instead, which",
            "always wins over anything recorded here. An entry with an empty",
            "'authors' means the document was read and named nobody, which is why it",
            "is kept - it stops the next run asking the same question again.",
        ],
        "schema": 1,
        "bylines": {url: merged[url] for url in sorted(merged)},
    }
    (paths.TOOL_DIR / "bylines.json").write_text(
        json.dumps(body, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8", newline="\n")
    print("\nRecorded %d byline(s); %d document(s) named nobody; %d refused."
          % (taken, empty, refused))
    print("Run `refs.py attribution` to carry them into the manifest, then "
          "re-render.")
    return 0


def command_attribution(args):
    """Carry curated attribution from overrides.json into the manifest (offline).

    Reads no bytes from the content store and makes no request. It exists
    because neither route that honours a stated byline can always run: a plain
    `acquire --force` needs the stored capture and refuses hand imports on
    purpose, and re-importing needs the hand-obtained file back in a directory.
    Who wrote a document is a fact about the document, not about the capture, so
    correcting it should not require either.

    The published files still carry the old byline afterwards, because rendering
    reads the stored bytes. What changed is therefore printed as work still to
    do, not reported as finished.
    """
    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    decisions = paths.decisions()

    changed = _attribution_changes(manifest.data["urls"], decisions, paths.bylines())

    if not changed:
        print("Every curated attribution is already recorded in the manifest.")
        # `--rewrite` is about the PUBLISHED FILES, not the manifest, and the two
        # go out of step by design: a byline is recorded offline and carried into
        # the documents later. Returning here meant "nothing to record" silently
        # cancelled the request to re-publish.
        if args.rewrite:
            print()
            rewrite_published_bylines(manifest, root, config)
        return 0

    renames = 0
    for key, before, after, rebuilt in changed:
        who = ", ".join(after[0]) or "(credit withdrawn)"
        print("  %-56s %s" % (key[:56], who))
        if before[1] != after[1]:
            print("  %-56s publisher: %s -> %s"
                  % ("", before[1] or "not stated", after[1] or "not stated"))
        if rebuilt:
            renames += 1
            print("  %-56s renames on re-render: %s -> %s"
                  % ("", (manifest.data["urls"][key].get("slug") or "-"), rebuilt))

    if args.check:
        print("\n%d reference(s) would change. This was --check: nothing was written."
              % len(changed))
        return 1

    for key, _before, after, _rebuilt in changed:
        manifest.record(key, "attribution", result="applied",
                        authors=after[0], publisher=after[1],
                        reason="maintainer-stated attribution from overrides.json")
    manifest.save()
    print("\nRecorded attribution for %d reference(s)." % len(changed))
    # The byline lives in the published Markdown as well as in the manifest, and
    # only a re-render moves it there. Naming the two routes is the difference
    # between a maintainer finishing this and assuming it finished itself.
    print("The published documents still read the old byline. To rewrite them, "
          "re-render with\nthe content store available: `acquire --force --only "
          "<url>` for a fetched\nreference, or `import <dir>` again for a hand "
          "import, then `index`.")
    if renames:
        print("%d of them will also be RENAMED by that re-render, because a "
              "stated publisher\nrebuilds a corrected title's slug. The old file "
              "becomes an orphan: `verify`\nreports it and `acquire --prune-files` "
              "removes it." % renames)
    if args.rewrite:
        print()
        rewrite_published_bylines(manifest, root, config)
    return 0


def rewrite_published_bylines(manifest, root, config, only=""):
    """Carry every recorded byline into the published files, without re-acquiring.

    `acquire --force` re-renders from the content store, which is the right route
    when the bytes are there and NO ROUTE AT ALL when they are not: a hand import
    has none by definition, and 65 references have lost theirs. Re-fetching a
    document we already hold to correct one line is work with nothing to buy.

    Selected by comparing what each file says to what the manifest says, so it is
    idempotent and picks up a byline recorded by an earlier run as readily as one
    recorded a moment ago.
    """
    from refslib import collections as collections_module
    archive_dir = root / (config.get("archive_dir") or "archived-references")
    rewritten, refused, seen = 0, 0, 0
    for key, entry in sorted(manifest.data["urls"].items()):
        if not entry.get("authors") or not entry.get("slug"):
            continue
        if only and only.lower() not in key.lower():
            continue
        path = archive_dir / collections_module.md_relpath(entry, config, entry["slug"])
        if not path.exists():
            continue
        if _published_authors(path.read_text(encoding="utf-8")) == list(entry["authors"]):
            continue
        seen += 1
        reason = _republish_byline(path, entry, config)
        if reason:
            refused += 1
            print("  KEPT     %-52s %s" % (key[:52], reason[:70]))
        else:
            rewritten += 1
    if not seen:
        print("Every published document already carries the byline the manifest states.")
        return rewritten, refused
    print("Re-published %d document(s) in place; %d left as they were."
          % (rewritten, refused))
    print("Refresh their PDFs with `refs.py pdf --stale`, then run `index`.")
    return rewritten, refused


def command_report(args):
    """Advice for the maintainer. Writes nothing but its own output."""
    from refslib import indexer

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)

    if getattr(args, "candidates", False):
        from refslib.store import Store
        rows = indexer.value_candidates(manifest, Store(paths.store_root()),
                                        limit=args.limit or 40)
        print("%d document(s) in research/ worth a human look, weakest signal first.\n"
              % len(rows))
        print("This is a SHORTLIST, not a verdict. Two categories cannot be decided by")
        print("rule - a page that restates a source already archived, and a tool's usage")
        print("page with no technique - so they are found here and judged by you.")
        print("To act on one, add it to `decisions` in tools/references/overrides.json.\n")
        for row in rows:
            print("%.1f  %-52s %6dc %2dcode %3dlinks %5dwords  %s"
                  % (row["score"], row["slug"][:52], row["chars"], row["code"],
                     row["links"], row["words"], row["kind"]))
            print("     %s" % row["url"][:110])
            print("     %s\n" % row["opening"])
        return 0

    if getattr(args, "pdf_health", False):
        from refslib import extract_doc
        from refslib.store import Store
        store = Store(paths.store_root())
        found = []
        for key, entry in manifest.data["urls"].items():
            sha = entry.get("content_sha256")
            if not sha or not store.has(sha):
                continue
            text = store.get_text(sha)
            pages = len(extract_doc.PAGE_BREAK.split(text)) - 1
            if pages < 2:
                continue
            bad = extract_doc.unreadable_pages(text)
            if bad:
                found.append((len(bad) / float(pages), pages, bad, key, entry))
        found.sort(reverse=True)
        print("%d converted document(s) have pages that are not text.\n" % len(found))
        print("Damage in a PDF is per PAGE - one font with no usable encoding map, one")
        print("stream that decoded into font data - so a whole-document check averages")
        print("it away: a deck with seven unreadable pages out of eight passed.\n")
        print("Fix one by rendering just those pages and reading them:")
        print("  refs.py pdf-pages --only <substring> --first <n> --last <n>\n")
        for share, pages, bad, key, entry in found:
            print("  %5.0f%%  %-52s %d of %d page(s)"
                  % (100 * share, (entry.get("slug") or key)[:52], len(bad), pages))
            print("          pages %s" % ", ".join(str(number) for number, _why in bad[:12]))
            print("          e.g. page %d: %s" % (bad[0][0], bad[0][1]))
        return 0

    rows = indexer.citation_report(manifest)
    print("Citation report: %d reference(s) with something worth knowing.\n" % len(rows))
    print("This is ADVICE. The archive never edits a curated document: applying any")
    print("of it belongs to the reading-list maintainers and to you.\n")
    for row in rows:
        print("%-16s %s" % (row["status"], row["url"]))
        print("%-16s %s" % ("", row["recommendation"][:150]))
        for site in row["cited_by"][:3]:
            print("%-16s cited at %s" % ("", site))
        print("")
    return 0


def command_import(args):
    """Import documents obtained by hand for sources the tool could not fetch."""
    from refslib import grade as grade_module
    from refslib import manual_import, render as render_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    archive_dir = root / (config.get("archive_dir") or "archived-references")

    # Only references that still need content are eligible, so an import cannot
    # silently overwrite a good copy. --redo also reopens what a PREVIOUS import
    # filed, which is what an improved matcher needs: a group that was matched
    # to the wrong citation cannot be corrected while its target counts as done.
    def in_scope(key):
        return not getattr(args, "only", "") \
            or args.only.lower() in key.lower()

    eligible = {key for key, entry in manifest.data["urls"].items()
                if in_scope(key) and _import_needs_content(
                    entry, store, redo=getattr(args, "redo", False))}

    # Matched against EVERY reference, then written only where the winner still
    # needs content. Matching against the needy subset alone made a file whose
    # own citation is already archived land on the next-best needy one.
    groups = manual_import.match(manual_import.scan(args.directory),
                                 list(manifest.data["urls"].items()))
    print("Found %d file group(s) in the import directory; %d reference(s) need content.\n"
          % (len(groups), len(eligible)))
    for folder in manual_import.pages_not_copied(args.directory):
        print("  NO PAGE    %-58s only the resources folder was copied" % folder[:58])

    imported = unmatched = rejected = covered = 0
    filed = set()
    for group in sorted(groups.values(), key=lambda item: item.key):
        if group.reference is None:
            unmatched += 1
            print("  UNMATCHED  %-58s (%d file(s))"
                  % (group.key[:58], len(group.candidates)))
            continue
        key, entry = group.reference
        if key not in eligible:
            covered += 1
            print("  covered    %-58s already archived from its own source" % group.key[:58])
            continue
        usable = group.usable
        if not usable:
            rejected += 1
            # Say WHICH of the two rejections this is. A file can convert to
            # clean prose and still be a navigation page with nothing on it, and
            # printing an empty reason for that told the maintainer nothing.
            reason = next((item.quality_reason for item in group.candidates
                           if item.quality_reason), "")
            if not reason:
                longest = max((item.chars for item in group.candidates), default=0)
                reason = ("the best conversion is only %d characters, so the file holds "
                          "no document" % longest)
            print("  REJECTED   %-58s %s" % (group.key[:58], reason[:60]))
            manifest.record(key, "import", result="rejected", reason=reason)
            continue

        text, used = manual_import.join(usable)
        cleaned = manual_import.sanitise.sanitise_text(text)
        url = (entry.get("spellings") or [key])[0]
        # THE MAINTAINER'S JUDGEMENT REACHES THIS PATH TOO. `classify` has
        # always honoured an override, but the import call never passed one, so
        # a decision recorded for a hand-obtained page was silently ignored and
        # a rule re-graded it on every run. An import is exactly where the
        # judgement matters: these are the pages no automated route could read.
        verdict = grade_module.classify(cleaned.text, url=url,
                                        override=paths.decisions().get(key))
        if verdict.outcome == "skip":
            rejected += 1
            print("  REJECTED   %-58s %s" % (group.key[:58], verdict.reason[:60]))
            manifest.record(key, "import", result="rejected", reason=verdict.reason)
            continue
        # When one complete PDF supplied the imported prose, preserve that
        # publisher artifact as the raw object too. `pdf` will then copy it
        # verbatim instead of printing our Markdown conversion. This also
        # repairs a prior import whose raw/content objects were deleted from the
        # durable store: importing the same supplied PDF restores both hashes.
        source_pdf = manual_import.original_pdf_bytes(usable, used)
        if source_pdf:
            was_raw = entry.get("raw_sha256") or ""
            entry["raw_sha256"] = store.put(source_pdf)
            manifest.record(key, "manual-source", result="stored",
                            bytes=len(source_pdf), was=was_raw[:16],
                            now=entry["raw_sha256"][:16],
                            reason="the complete PDF supplied for this manual import")
        content_sha = store.put_text(cleaned.text)
        entry["grade"] = verdict.folder
        entry["decision"] = dict(verdict.as_dict(), at=manifest_utc()[:10])
        entry["content_gap"] = ""
        from refslib import slugs
        # A slug is normally pinned for good. One that is nothing but a format
        # word never was an identity: `[Whitepaper](...)` in the reading list
        # produced a file called `whitepaper.md`, and the deck cited beside it
        # became `slides.md`. Those are rebuilt, and the rename is printed.
        was = entry.get("slug") or ""
        # THE SAME CORRECTION THE FETCH PATH HONOURS. An import is exactly where
        # it is needed: a reference gets hand-obtained BECAUSE the fetch met a
        # wall, and the wall is what supplied the recorded title. A KTH doctoral
        # thesis was filed as "Making sure you're not a bot!". Releasing the
        # pinned slug renames the file after the document.
        renamed_from = was
        judged = paths.decisions().get(key) or {}
        corrected = judged.get("title") or ""
        if corrected and corrected != entry.get("title"):
            entry["title"] = corrected
            was = ""
        # An import is also where a stated byline is needed most: a document
        # obtained by hand met a wall, and a wall declares no author. The record
        # below reads both fields off the entry, so applying it here is enough.
        _apply_attribution_override(entry, attribution_decision(
            key, entry, paths.decisions(), paths.bylines()))
        record = {
            "slug": slugs.pinned(was),
            "title": slugs.readable_title(
                entry.get("title") or entry.get("cited_title"),
                (entry.get("spellings") or [key])[0]) or key,
            "authors": entry.get("authors") or [],
            "publisher": entry.get("publisher") or "",
            "published": entry.get("published") or "",
            "licence": entry.get("licence") or "unknown",
            "kind": entry.get("kind") or "article",
            "original_url": (entry.get("spellings") or [key])[0],
            "canonical_url": entry.get("canonical_url") or "",
            "also_at": entry.get("also_at") or [],
            # Provenance only. The directory these came from is never recorded:
            # CLAUDE.md forbids a local path in a tracked file.
            "retrieved_kind": "manual-import",
            "retrieved_from": (entry.get("spellings") or [key])[0],
            "retrieved_utc": manifest_utc(),
            "content_sha256": content_sha,
            "raw_sha256": entry.get("raw_sha256") or "",
            "cited_by": entry.get("cited_by") or [],
            "depth": "full",
            "depth_reason": "default",
            "grade": entry["grade"],
        }
        if not record["slug"]:
            taken = {other.get("slug") for other in manifest.data["urls"].values()
                     if other.get("slug") and other is not entry}
            record["slug"] = slugs.build(record["title"], record["publisher"],
                                         slugs.year_of(record["published"]), taken=taken)
            entry["slug"] = record["slug"]
            entry["title"] = record["title"]
            if renamed_from and renamed_from != record["slug"]:
                print("  renamed    %s -> %s" % (renamed_from, record["slug"]))
        entry["content_sha256"] = content_sha

        text_out = render_module.render(record, cleaned.text, "full")
        path = archive_dir / collections_module.md_relpath(entry, config,
                                                           record["slug"])
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text_out, encoding="utf-8", newline="\n")
        # An import replaces the document, so any translation held for it was of
        # DIFFERENT words. Rather than leave English that no longer matches the
        # original beside it, the pair is dropped and the reference simply
        # returns to the translation backlog.
        if entry.pop("translation_sha256", None):
            stale_translation = archive_dir / collections_module.translated_md_relpath(
                entry, config, record["slug"])
            if stale_translation.exists():
                stale_translation.unlink()
            print("  translation withdrawn: the imported document is not the text it "
                  "was made from")
        manifest.record(key, "import", result="stored", sha256=content_sha,
                        files_joined=len(used), chars=len(cleaned.text),
                        grade=entry["grade"])
        manifest.record(key, "acquire", result="stored", retrieved_kind="manual-import",
                        content_sha256=content_sha)
        # An import WRITES the Markdown, so it owns the render step too. Leaving
        # the fetch's old record in place left 38 imported references pointing at
        # the file the failed fetch produced - a name from a bot wall or a
        # domain-sale page, and after a rename a path that does not exist - so
        # anything reading `steps.render.file` for a document's location was sent
        # to a file the import had already replaced.
        manifest.record(key, "render", result="ok", depth=record["depth"],
                        file=paths.rel(path, root), chars=len(cleaned.text),
                        translation_file="")
        imported += 1
        filed.add(key)
        print("  imported   %-58s %6d chars, %d file(s) joined -> %s/"
              % (record["slug"][:58], len(cleaned.text), len(used), entry["grade"]))

    manifest.save()
    print("\nimported %d, already covered %d, unmatched %d, rejected %d."
          % (imported, covered, unmatched, rejected))

    # A better match moves a file to a different citation, and the citation it
    # LEFT is then holding a document that is not it. Reported, never deleted:
    # the maintainer decides whether to re-acquire it or drop it.
    if getattr(args, "redo", False):
        moved = [entry.get("slug") or key for key, entry in manifest.data["urls"].items()
                 if ((entry.get("steps") or {}).get("import") or {}).get("result") == "stored"
                 and in_scope(key) and key not in filed]
        for slug in sorted(moved):
            print("  REASSIGNED %-58s no group claims it now, so its file may be "
                  "the wrong document" % slug[:58])
    if unmatched:
        print("An unmatched group is REPORTED rather than guessed at: a wrong match")
        print("would file a document under the wrong citation. Rename the file after")
        print("the reference's URL or title and re-run.")
    print("Run 'refs.py index' to refresh README.md and document-gaps.md.")
    return 0


def command_verify(args):
    """The offline gate. No network, changes nothing."""
    from refslib import verify as verify_module
    from refslib.store import Store

    root = paths.repo_root()
    config = paths.config()
    manifest = check_module.open_manifest(root, config)
    store = Store(paths.store_root())
    before = verify_module.curated_fingerprints(root, config)

    findings = verify_module.run(root, config, manifest, store, curated_hashes=before)
    failures = [item for item in findings if item.level == "fail"]
    warnings = [item for item in findings if item.level == "warn"]

    print("verify (offline). References in the manifest: %d"
          % len(manifest.data.get("urls") or {}))
    print("Curated documents checked as UNMODIFIED: %s"
          % ", ".join(sorted(before)) or "(none present)")
    if paths.store_is_workspace_cache():
        print("WARNING: the content store is the git-ignored workspace cache.")
        print("         Set WEBSEC_REFS_STORE so a git clean cannot destroy the")
        print("         only copy of a page that is already gone online.")
    for finding in findings:
        print("  " + str(finding))
    print("\n%d failure(s), %d warning(s)." % (len(failures), len(warnings)))
    return 1 if failures else 0


def command_ledger_status(args):
    """Report what the OPTIONAL curation ledger could tell us. Never writes."""
    root = paths.repo_root()
    config = paths.config()
    settings = config.get("ledger") or {}
    relative = settings.get("path")
    if not relative:
        print("No ledger configured. Every URL will be probed.")
        return 0
    hints = ledger_module.load(root / relative)
    print("Ledger: %s" % relative)
    if not hints:
        print("  unavailable or unreadable -> no hints, every URL will be probed")
        print("  this is a supported state, not an error")
        return 0
    classes = {}
    for hint in hints.values():
        classes[hint.health or "(none)"] = classes.get(hint.health or "(none)", 0) + 1
    print("  rows           : %d" % len(hints))
    print("  browser proven : %d" % sum(1 for hint in hints.values() if hint.known_alive()))
    for name in sorted(classes, key=lambda key: -classes[key]):
        print("    %-18s %d" % (name, classes[name]))
    print("  read-only hint only: a health verdict never stands in for preserved bytes")
    return 0


def command_dependencies(args):
    """Check that nothing outside the standard library is used undeclared."""
    policy = paths.load_json("dependency-policy.json")
    admitted = policy.get("admitted") or []
    print("Admitted non-stdlib dependencies: %d" % len(admitted))
    for entry in admitted:
        print("  %-20s %-12s %s" % (entry.get("name"), entry.get("version"), entry.get("licence")))
    candidates = policy.get("candidates") or []
    if candidates:
        print("\nCandidates not yet admitted (the tool must run without them):")
        for entry in candidates:
            print("  %-20s %s" % (entry.get("name"), entry.get("purpose")))
    # A package being importable is not permission to use it. An undeclared
    # dependency that happens to be installed here would work on this machine
    # and fail everywhere else, which is exactly what the admission gate exists
    # to catch.
    admitted_names = {entry.get("name") for entry in admitted}
    candidate_names = tuple(entry.get("name") for entry in candidates if entry.get("name"))
    unadmitted = [name for name in candidate_names
                  if name not in admitted_names and _importable(name)]
    if unadmitted:
        print("\nWARNING: %s is importable but not admitted. Record it in "
              "dependency-policy.json with its version, licence, release date "
              "and hashes, or remove it." % ", ".join(unadmitted))
        return 1
    print("\nStdlib-only run is supported and is the current state.")
    return 0


def _importable(name):
    import importlib.util
    return importlib.util.find_spec(name) is not None


def build_parser():
    parser = argparse.ArgumentParser(
        prog="refs.py",
        description="Reference archive tool for the Top 10 Web Hacking Techniques "
                    "reading list (dev-only). Reads the year lists; never writes "
                    "them.",
    )
    subparsers = parser.add_subparsers(dest="command")

    harvest_parser = subparsers.add_parser(
        "harvest", help="find every cited URL in tracked files (read-only)")
    harvest_parser.add_argument("--report", action="store_true",
                                help="print the human report (default)")
    harvest_parser.add_argument("--json", action="store_true", help="machine-readable output")
    harvest_parser.add_argument("--show-excluded", action="store_true",
                                help="list every excluded URL under its rule")
    harvest_parser.add_argument("--show-kept", action="store_true",
                                help="list every kept reference and its citation sites")
    harvest_parser.set_defaults(handler=command_harvest)

    inventory_parser = subparsers.add_parser(
        "inventory", help="parse the curated documents read-only and prove the parse")
    inventory_parser.add_argument("--dry-run", action="store_true",
                                  help="accepted and ignored: this command never writes")
    inventory_parser.add_argument("--show-entries", action="store_true")
    inventory_parser.set_defaults(handler=command_inventory)

    sync_parser = subparsers.add_parser(
        "sync", help="reconcile citation metadata and collection folders offline")
    sync_parser.add_argument("--prune", action="store_true",
                             help="drop manifest entries whose URL is no longer cited")
    sync_parser.add_argument("--refile", action="store_true",
                             help="move existing MD/PDF files to the folder implied by citations")
    sync_parser.add_argument("--prune-files", action="store_true",
                             help="delete published files no remaining manifest entry claims")
    sync_parser.set_defaults(handler=command_sync)

    compare_parser = subparsers.add_parser(
        "compare", help="compare normalized URL membership between two collections")
    compare_parser.add_argument("left", help="first collection, for example 2026-ai")
    compare_parser.add_argument("right", help="second collection, for example 2026")
    compare_parser.add_argument("--json", action="store_true", help="machine-readable output")
    compare_parser.set_defaults(handler=command_compare)

    check_parser = subparsers.add_parser(
        "check", help="probe each reference and record its health (network)")
    check_parser.add_argument("--limit", type=int, default=None,
                              help="stop after N references (a smoke run)")
    check_parser.add_argument("--only", default=None,
                              help="only references whose identity contains this text")
    check_parser.add_argument("--collection", default="",
                              help="only references cited by this collection, e.g. 2026-ai")
    check_parser.add_argument("--force", action="store_true",
                              help="re-probe even when a fresh ledger hint exists")
    check_parser.add_argument("--no-ledger", action="store_true",
                              help="ignore the optional curation ledger entirely")
    check_parser.add_argument("--gap", type=float, default=1.0,
                              help="minimum seconds between requests to one host")
    check_parser.add_argument("--timeout", type=float, default=20.0)
    check_parser.add_argument("--status", default=None,
                              help="re-probe only rows already carrying this status "
                                   "(comma separated). Implies --force.")
    check_parser.add_argument("--missing-store", action="store_true",
                              help="probe only rows whose manifest-named evidence is "
                                   "missing from the configured content store")
    check_parser.add_argument("--prune", action="store_true",
                              help="drop manifest entries whose URL is no longer cited")
    check_parser.set_defaults(handler=command_check)

    browser_parser = subparsers.add_parser(
        "check-browser",
        help="re-check only the blocked and js-rendered rows with a real browser")
    browser_parser.add_argument("--only", default="",
                                help="only rows whose URL contains this substring")
    browser_parser.add_argument("--force", action="store_true",
                                help="render again even when a DOM was already captured")
    browser_parser.add_argument("--limit", type=int, default=None)
    browser_parser.add_argument("--budget", type=float, default=90.0,
                                help="seconds to keep re-reading while a wall is on screen")
    browser_parser.set_defaults(handler=command_check_browser)

    acquire_parser = subparsers.add_parser(
        "acquire", help="preserve, convert and render each reference (network)")
    acquire_parser.add_argument("--limit", type=int, default=None)
    acquire_parser.add_argument("--only", default=None,
                                help="only references whose identity contains this text")
    acquire_parser.add_argument("--collection", default="",
                                help="only references filed under this collection")
    acquire_parser.add_argument("--kind", default=None,
                                help="only these kinds (comma separated)")
    acquire_parser.add_argument("--force", action="store_true",
                                help="re-acquire references that already have a file")
    acquire_parser.add_argument("--prune-files", action="store_true",
                                help="delete published files no manifest entry points at")
    acquire_parser.add_argument("--replace-imports", action="store_true",
                                help="overwrite hand-imported copies with a fetch. "
                                     "Off by default: an import exists because no "
                                     "fetch worked.")
    acquire_parser.add_argument("--refetch", action="store_true",
                                help="fetch again instead of re-extracting the stored bytes. "
                                     "Only needed when the SOURCE changed; an extractor fix "
                                     "needs a plain --force, which is offline.")
    acquire_parser.add_argument("--missing-store", action="store_true",
                                help="process only rows whose manifest-named evidence is "
                                     "missing from the configured content store")
    acquire_parser.add_argument("--after", default="",
                                help="resume strictly after the first matching manifest "
                                     "identity (completed rows are checkpointed)")
    acquire_parser.add_argument("--browser-dom", action="store_true",
                                help="process only rows with a rendered browser DOM in "
                                     "the configured content store")
    acquire_parser.add_argument("--faulty-captures", action="store_true",
                                help="process only rows whose content gap records a "
                                     "faulty capture")
    acquire_parser.add_argument("--wayback-capture", action="store_true",
                                help="process only rows whose latest Wayback step stored "
                                     "raw capture bytes")
    acquire_parser.add_argument("--document-gaps", action="store_true",
                                help="process exactly the rows in generated document-gaps.md")
    acquire_parser.add_argument(
        "--linked-document-url", default="",
        help="for exactly one --only match, preserve this explicit full-document "
             "URL while retaining the cited landing URL")
    acquire_parser.add_argument(
        "--also-at", action="append", default=[],
        help="with --linked-document-url, retain an additional paper, code, or "
             "slides URL (repeatable)")
    acquire_parser.add_argument(
        "--clear-linked-document", action="store_true",
        help="for exactly one --only match, remove a failed linked-document pin "
             "before acquiring the cited page or its stored browser DOM")
    acquire_parser.add_argument("--no-browser", action="store_true",
                                help="deprecated compatibility flag; acquisition never "
                                     "uses a host browser (use containerized "
                                     "check-browser or transcripts instead)")
    acquire_parser.add_argument("--gap", type=float, default=1.0)
    acquire_parser.add_argument("--timeout", type=float, default=25.0)
    acquire_parser.set_defaults(handler=command_acquire)

    index_parser = subparsers.add_parser(
        "index", help="generate the archive folder index (offline)")
    index_parser.add_argument("--prune-files", action="store_true",
                              help="also delete archive files no entry claims, such as "
                                   "the old name left behind by a corrected slug")
    index_parser.set_defaults(handler=command_index)

    bylines_parser = subparsers.add_parser(
        "bylines",
        help="read authors out of the archived documents themselves (offline)")
    bylines_group = bylines_parser.add_mutually_exclusive_group(required=True)
    bylines_group.add_argument("--queue", metavar="FILE",
                               help="write the references needing a byline, with the "
                                    "text to read it from")
    bylines_group.add_argument("--apply", metavar="FILE",
                               help="record a completed review in bylines.json")
    bylines_parser.add_argument("--only", default="",
                                help="only references whose identity contains this text")
    bylines_parser.add_argument("--limit", type=int, default=None,
                                help="stop the queue after this many references")
    bylines_parser.add_argument("--accept", choices=sorted(ACCEPTED_CONFIDENCE),
                                default="high",
                                help="lowest confidence to record; 'medium' also takes "
                                     "a byline read from a signature, a site footer or "
                                     "a long-published handle (default: high)")
    bylines_parser.set_defaults(handler=command_bylines)

    digest_parser = subparsers.add_parser(
        "digest",
        help="record a short summary and controlled tags per document (offline)")
    digest_group = digest_parser.add_mutually_exclusive_group(required=True)
    digest_group.add_argument("--queue", metavar="FILE",
                              help="write the references needing a summary")
    digest_group.add_argument("--apply", metavar="FILE",
                              help="validate a completed review and record it "
                                   "in the manifest")
    digest_group.add_argument("--publish", action="store_true",
                              help="carry recorded summaries and tags into the "
                                   "published Markdown in place, without "
                                   "re-acquiring (offline; needs no store)")
    digest_group.add_argument("--vocabulary", action="store_true",
                              help="regenerate tag-vocabulary.md from the tags "
                                   "actually in use")
    digest_parser.add_argument("--collection", default="",
                               help="only this collection, such as 2019 or 2016-17")
    digest_parser.add_argument("--only", default="",
                               help="only references whose identity contains this text")
    digest_parser.add_argument("--limit", type=int, default=None,
                               help="stop the queue after this many references")
    digest_parser.add_argument("--check", action="store_true",
                               help="report what --apply would record, and write nothing")
    digest_parser.add_argument("--refresh", action="store_true",
                               help="with --publish, re-render every document "
                                    "rather than skipping the ones whose summary "
                                    "and tags already match. The route for a "
                                    "RENDERER fix, which changes files whose "
                                    "digest was never wrong. Offline; keeps the "
                                    "prove-then-replace guard")
    # --promote is gone: a tag no longer has to be promoted, because a new one
    # is adopted by being used. What governs the vocabulary now is
    # tag-vocabulary.json, where an alias folds a spelling away for good.
    digest_parser.add_argument("--by", default="webseclist-review/1",
                               help="what to record as the reviewer (default: "
                                    "webseclist-review/1)")
    digest_parser.set_defaults(handler=command_digest)

    attribution_parser = subparsers.add_parser(
        "attribution",
        help="record curated authors and publishers from overrides.json (offline)")
    attribution_parser.add_argument("--check", action="store_true",
                                    help="report what would change and write nothing")
    attribution_parser.add_argument("--rewrite", action="store_true",
                                    help="also carry the byline into the published "
                                         "Markdown in place, without re-acquiring "
                                         "(offline; needs no content store)")
    attribution_parser.set_defaults(handler=command_attribution)

    report_parser = subparsers.add_parser(
        "report", help="what the archive learned about each citation (advice only)")
    report_parser.add_argument("--pdf-health", action="store_true",
                               help="converted documents whose pages are not readable text")
    report_parser.add_argument("--candidates", action="store_true",
                               help="shortlist documents in research/ with a weak research "
                                    "signal, for a human to judge")
    report_parser.add_argument("--limit", type=int, default=0,
                               help="how many candidates to show (default 40)")
    report_parser.add_argument("--citations", action="store_true",
                               help="accepted and ignored: this is the only report")
    report_parser.set_defaults(handler=command_report)

    import_parser = subparsers.add_parser(
        "import", help="import hand-converted documents from a directory (offline)")
    import_parser.add_argument("directory",
                               help="a directory of files obtained by hand. Its path "
                                    "is never written into tracked output.")
    import_parser.add_argument("--only", default="",
                               help="only make one matching citation eligible; matching "
                                    "still compares against the whole manifest")
    import_parser.add_argument("--redo", action="store_true",
                               help="also reopen references a previous import filed, "
                                    "so an improved match can correct them")
    import_parser.set_defaults(handler=command_import)

    translate_parser = subparsers.add_parser(
        "translate", help="prepare an archived document for translation, or apply one")
    translate_parser.add_argument("--only", default="",
                                  help="the document to work on")
    translate_parser.add_argument("--prepare", action="store_true",
                                  help="mask the payloads and write the prose chunks")
    translate_parser.add_argument("--apply", action="store_true",
                                  help="read chunk-NN.en.txt back and store the result")
    translate_parser.add_argument("--render", action="store_true",
                                  help="write stored translations as paired Markdown, "
                                       "offline and without reacquiring sources")
    translate_parser.add_argument("--into", default="",
                                  help="the working directory (default: the tool cache)")
    translate_parser.add_argument("--redo", action="store_true",
                                  help="include documents that already have a translation")
    translate_parser.add_argument("--force", action="store_true",
                                  help="apply even when placeholders were lost")
    translate_parser.set_defaults(handler=command_translate)

    wayback_parser = subparsers.add_parser(
        "wayback", help="look for a better Wayback capture of a reference that failed")
    wayback_parser.add_argument("--only", default="",
                                help="only rows whose URL contains this substring")
    wayback_parser.add_argument("--force", action="store_true",
                                help="consider every reference, not only the failed ones")
    wayback_parser.add_argument("--faulty-captures", action="store_true",
                                help="consider only rows whose content gap records a "
                                     "faulty capture")
    wayback_parser.add_argument("--missing-store", action="store_true",
                                help="consider only the archived rows on store-gaps.md, "
                                     "whose manifest-named evidence is missing from the "
                                     "configured content store")
    wayback_parser.add_argument(
        "--replay-url", default="",
        help="use this exact Wayback replay for the one row selected by --only; "
             "the raw id_ form is fetched and still validated")
    wayback_parser.add_argument("--after", default="",
                                help="resume strictly after the first matching manifest "
                                     "identity")
    wayback_parser.add_argument("--limit", type=int, default=None,
                                help="stop after N references so CDX work can run in "
                                     "checkpointed batches")
    wayback_parser.add_argument("--tries", type=int, default=5,
                                help="captures to try per reference before giving up")
    wayback_parser.add_argument("--gap", type=float, default=1.0)
    wayback_parser.add_argument("--timeout", type=float, default=40.0)
    wayback_parser.set_defaults(handler=command_wayback)

    historical_parser = subparsers.add_parser(
        "historical-urls",
        help="list migrated and historical paths with pinned waymore in Docker")
    historical_parser.add_argument(
        "--only", default="",
        help="REQUIRED: references whose manifest identity contains this text")
    historical_parser.add_argument(
        "--limit-requests", type=int, default=50,
        help="bound waymore provider requests (default: 50)")
    historical_parser.add_argument(
        "--limit-results", type=int, default=500,
        help="print at most this many URLs; 0 prints all (default: 500)")
    historical_parser.set_defaults(handler=command_historical_urls)

    make_pdf_parser = subparsers.add_parser(
        "pdf", help="make a PDF copy of each archived reference, beside its Markdown")
    make_pdf_parser.add_argument("--only", default="",
                                 help="only references whose identity contains this text")
    make_pdf_parser.add_argument("--collection", default="",
                                 help="only references filed under this collection")
    make_pdf_parser.add_argument("--limit", type=int, default=None,
                                 help="accepted for symmetry; PDF making is cheap to repeat")
    make_pdf_parser.add_argument("--force", action="store_true",
                                 help="remake PDFs that already exist")
    make_pdf_parser.add_argument("--stale", action="store_true",
                                 help="only references whose Markdown, paper or "
                                      "images changed after the PDF was made "
                                      "(combine with --force to reprint them)")
    make_pdf_parser.add_argument("--translations-only", action="store_true",
                                 help="render only English translation PDFs; do not "
                                      "touch the original-language PDFs")
    make_pdf_parser.set_defaults(handler=command_pdf)

    images_parser = subparsers.add_parser(
        "images", help="preserve the pictures an archived article was written "
                       "around, re-encoded (network)")
    images_parser.add_argument("--only", default="",
                               help="only references whose identity contains this text")
    images_parser.add_argument("--force", action="store_true",
                               help="fetch again even where an image is already held")
    images_parser.add_argument("--insecure", action="store_true",
                               help="fetch this document's images in the container "
                                    "WITHOUT certificate verification, for the one "
                                    "reference --only names; for a host whose "
                                    "certificate expired and whose page was "
                                    "recovered with `refs.py insecure`")
    images_parser.add_argument("--gap", type=float, default=0.5,
                               help="seconds to wait between requests to one host")
    images_parser.add_argument("--timeout", type=int, default=30)
    images_parser.set_defaults(handler=command_images)

    papers_parser = subparsers.add_parser(
        "papers", help="preserve the publisher's own PDF of an archived article (network)")
    papers_parser.add_argument("--only", default="",
                               help="only references whose identity contains this text")
    papers_parser.add_argument("--force", action="store_true",
                               help="fetch again even when the paper is already held")
    papers_parser.add_argument("--from-file", default="",
                               help="a PDF obtained by hand, for the one reference "
                                    "named by --only; its path is never written "
                                    "into tracked output")
    papers_parser.add_argument("--from-url", default="",
                               help="fetch the paper from this URL for the one "
                                    "reference named by --only, when the page does "
                                    "not link its own PDF (network)")
    papers_parser.add_argument("--gap", type=float, default=1.0,
                               help="seconds to wait between requests to one host")
    papers_parser.add_argument("--timeout", type=int, default=60)
    papers_parser.set_defaults(handler=command_papers)

    pdf_text_parser = subparsers.add_parser(
        "pdf-text", help="read a PDF's text with poppler, in the container")
    pdf_text_parser.add_argument("--only", default="",
                                 help="REQUIRED: the one reference to read")
    pdf_text_parser.add_argument("--into", default="",
                                 help="where to write the Markdown (default: the tool cache)")
    pdf_text_parser.set_defaults(handler=command_pdf_text)

    pdf_parser = subparsers.add_parser(
        "pdf-pages", help="render a PDF whose text cannot be read into page images")
    pdf_parser.add_argument("--only", default="",
                            help="REQUIRED: the one reference to render")
    pdf_parser.add_argument("--into", default="",
                            help="where to write the images (default: the tool cache)")
    pdf_parser.add_argument("--first", type=int, default=1)
    pdf_parser.add_argument("--last", type=int, default=0, help="0 means every page")
    pdf_parser.set_defaults(handler=command_pdf_pages)

    insecure_parser = subparsers.add_parser(
        "insecure", help="fetch one source whose certificate has expired, in the container")
    insecure_parser.add_argument("--only", default="",
                                 help="REQUIRED: the reference to fetch this way")
    insecure_parser.set_defaults(handler=command_insecure)

    transcripts_parser = subparsers.add_parser(
        "transcripts", help="fetch talk captions with yt-dlp, inside a container")
    transcripts_parser.add_argument("--only", default="",
                                    help="only talks whose URL contains this substring")
    transcripts_parser.add_argument("--force", action="store_true",
                                    help="fetch again even for talks that already have one")
    transcripts_parser.set_defaults(handler=command_transcripts)

    verify_parser = subparsers.add_parser(
        "verify", help="offline gate: manifest, store, and the boundary itself")
    verify_parser.set_defaults(handler=command_verify)

    ledger_parser = subparsers.add_parser(
        "ledger-status", help="report what the optional curation ledger offers")
    ledger_parser.set_defaults(handler=command_ledger_status)

    dependencies_parser = subparsers.add_parser(
        "dependencies", help="check the dependency admission policy")
    dependencies_parser.add_argument("--verify", action="store_true")
    dependencies_parser.set_defaults(handler=command_dependencies)

    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    if not getattr(args, "handler", None):
        parser.print_help()
        return 2
    try:
        return args.handler(args)
    except paths.SetupError as error:
        sys.stderr.write("setup error: %s\n" % error)
        return 2


if __name__ == "__main__":
    sys.exit(main())
