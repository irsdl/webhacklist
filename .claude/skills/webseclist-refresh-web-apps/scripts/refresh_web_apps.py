#!/usr/bin/env python3
"""Refresh generated web-app data and validate publishing invariants."""

from __future__ import annotations

import argparse
import datetime
import gzip
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


REPO = Path(__file__).resolve().parents[4]
REGISTRY = REPO / "website" / "archive-years.json"
CATALOGUE = REPO / "website" / "data" / "catalogue.json"
FINAL_NAME = re.compile(r"^\d{4}(?:-\d{2})?\.md$")
PRELIMINARY_NAME = re.compile(r"^\d{4}-ai\.md$")
LINK = re.compile(r"\[((?:[^\]\\]|\\.)+)\]\((?:<(https?://[^>\s]+)>|(https?://[^)\s]+))\)")
MONTHS = ("January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December")


WARNINGS: list[str] = []


def fail(message: str) -> None:
    raise SystemExit(f"refresh check failed: {message}")


def warn(message: str) -> None:
    WARNINGS.append(message)
    print(f"refresh check warning: {message}", file=sys.stderr, flush=True)


def spell_date(stamp: str) -> str:
    """Render an ISO asOf stamp the way a notice spells it: 18 August 2026."""
    day = datetime.date.fromisoformat(stamp)
    return f"{day.day} {MONTHS[day.month - 1]} {day.year}"


def last_touched(relative: str) -> datetime.date | None:
    """Commit date of the most recent change to a tracked file, or None."""
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", relative],
        cwd=REPO, text=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    )
    try:
        return datetime.date.fromisoformat(result.stdout.strip())
    except ValueError:
        return None


def run(*command: str) -> None:
    print("+", " ".join(command), flush=True)
    subprocess.run(command, cwd=REPO, check=True)


def count_bounded_links(path: Path, start: str, end: str) -> int:
    lines = path.read_text(encoding="utf-8").splitlines()
    try:
        first = next(i for i, line in enumerate(lines) if line.strip() == start)
        last = next(i for i, line in enumerate(lines[first + 1 :], first + 1) if line.strip() == end)
    except StopIteration:
        fail(f"{path.name} does not contain the exact content boundaries {start!r} and {end!r}")
    if first >= last:
        fail(f"{path.name} has reversed content boundaries")
    return sum(1 for line in lines[first + 1 : last] if re.match(r"^\s*-\s", line) and LINK.search(line))


def validate_registry() -> tuple[int, int, int]:
    try:
        data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        fail(f"cannot read {REGISTRY.relative_to(REPO)}: {error}")

    records = data.get("years")
    if data.get("schema") != 1 or not isinstance(records, list) or not records:
        fail("archive-years.json must use schema 1 and contain a non-empty years array")

    ids = [record.get("id") for record in records if isinstance(record, dict)]
    if len(ids) != len(records) or any(not isinstance(year, str) for year in ids):
        fail("every year-registry entry must be an object with a string id")
    if len(ids) != len(set(ids)):
        fail("year-registry ids must be unique")

    root_markdown = [path for path in REPO.glob("*.md")]
    finalized = {path.stem for path in root_markdown if FINAL_NAME.fullmatch(path.name)}
    preliminary = {path.stem for path in root_markdown if PRELIMINARY_NAME.fullmatch(path.name)}
    registered = set(ids)
    missing = sorted((finalized | preliminary) - registered)
    dangling = sorted(registered - (finalized | preliminary))
    if missing:
        fail(f"root year files missing from archive-years.json: {', '.join(missing)}")
    if dangling:
        fail(f"registered year files do not exist: {', '.join(dangling)}")

    tracked = set(subprocess.run(
        ["git", "ls-files"], cwd=REPO, check=True, text=True,
        stdout=subprocess.PIPE,
    ).stdout.splitlines())
    untracked_preliminary = sorted(f"{year}.md" for year in preliminary
                                   if f"{year}.md" not in tracked)
    if untracked_preliminary:
        fail("preliminary files must be tracked so the archive can detect them: "
             + ", ".join(untracked_preliminary))

    lead_count = 0
    for record in records:
        year = record["id"]
        if year in finalized:
            if record.get("status") != "final" or record.get("ranked") is not True:
                fail(f"{year} must be status=final and ranked=true")
            continue

        required = ("notice", "asOf", "provenance", "contentStart", "contentEnd")
        if record.get("status") != "preliminary" or record.get("ranked") is not False:
            fail(f"{year} must be status=preliminary and ranked=false")
        if any(not isinstance(record.get(key), str) or not record[key].strip() for key in required):
            fail(f"{year} is missing preliminary publishing metadata")
        warning = record["notice"].lower()
        for phrase in ("unranked", "incomplete", "not community-vetted", "subject to change"):
            if phrase not in warning:
                fail(f"{year} notice must say {phrase!r}")
        try:
            spelled = spell_date(record["asOf"])
        except ValueError:
            fail(f"{year} asOf must be an ISO yyyy-mm-dd date, not {record['asOf']!r}")
        # The banner is the only place a reader learns how fresh the collection is,
        # so the date it prints has to be the date the registry records.
        if spelled not in record["notice"]:
            fail(f"{year} notice must state its asOf date as {spelled!r}; "
                 "the banner shows the notice, so a drifting date misdates the collection")
        swept = last_touched(f"{year}.md")
        if swept and swept > datetime.date.fromisoformat(record["asOf"]):
            warn(f"{year}.md was last changed {swept.isoformat()} but {year} asOf is still "
                 f"{record['asOf']} - if that change was a sweep, bump asOf and the notice date")
        if (record["contentStart"] != "<!-- archived-references:start -->" or
                record["contentEnd"] != "<!-- archived-references:end -->"):
            fail(f"{year} must use the shared archived-references marker pair")
        leads = count_bounded_links(REPO / f"{year}.md", record["contentStart"], record["contentEnd"])
        if not leads:
            fail(f"{year} has no linked research leads inside its content boundaries")
        lead_count += leads

    app_source = (REPO / "website" / "app.js").read_text(encoding="utf-8")
    if "const YEAR_FILES = [" in app_source:
        fail("website still hard-codes its year list")
    if "yearRecordFor(year).ranked === false" not in app_source:
        fail("website does not suppress annual PDFs for unranked records")
    if "preliminaryNotice(state.year)" not in app_source:
        fail("website does not render the preliminary notice")
    return len(finalized), len(preliminary), lead_count


def validate_progressive_data() -> tuple[int, int, int]:
    try:
        catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        fail(f"cannot read generated progressive catalogue: {error}")
    if catalogue.get("schema") != 1 or not isinstance(catalogue.get("version"), str):
        fail("generated progressive catalogue must have schema 1 and a version")
    hosting = catalogue.get("hosting")
    if (not isinstance(hosting, dict) or hosting.get("schema") != 1 or
            not isinstance(hosting.get("cloudflareMaxAssetBytes"), int) or
            not isinstance(hosting.get("largePdfFallbacks"), dict)):
        fail("generated progressive catalogue has invalid hosting metadata")
    years = catalogue.get("years")
    if not isinstance(years, list) or not years:
        fail("generated progressive catalogue has no collections")
    registry_ids = [record["id"] for record in json.loads(REGISTRY.read_text(encoding="utf-8"))["years"]]
    if [record.get("id") for record in years] != registry_ids:
        fail("generated progressive catalogue is out of sync with archive-years.json")

    total = 0
    shard_bytes = 0
    for record in years:
        year = record["id"]
        shard_path = REPO / "website" / "data" / "collections" / f"{year}.json"
        try:
            body = shard_path.read_bytes()
            shard = json.loads(body)
        except (OSError, json.JSONDecodeError) as error:
            fail(f"cannot read generated {year} collection: {error}")
        if shard.get("schema") != 1 or shard.get("version") != record.get("version"):
            fail(f"generated {year} collection has the wrong schema or collection version")
        items = shard.get("items")
        if shard.get("collection", {}).get("id") != year or not isinstance(items, list):
            fail(f"generated {year} collection metadata is invalid")
        if len(items) != record.get("count") or shard.get("count") != len(items):
            fail(f"generated {year} collection count does not match its catalogue entry")
        if any(
            item.get("year", year) != year or
            not ((isinstance(item.get("id"), str) and "i" not in item) or
                 ("id" not in item and isinstance(item.get("i"), int) and
                  not isinstance(item.get("i"), bool) and item["i"] >= 0))
            for item in items
        ):
            fail(f"generated {year} collection contains an invalid record")
        if len(body) != record.get("bytes") or hashlib.sha256(body).hexdigest() != record.get("sha256"):
            fail(f"generated {year} collection failed its byte/hash integrity check")
        if len(body) > 1_500_000 or len(gzip.compress(body, compresslevel=9, mtime=0)) > 300_000:
            fail(f"generated {year} collection exceeds its 1.5 MB raw or 300 KB compressed budget")
        total += len(items)
        shard_bytes += len(body)

    if total != catalogue.get("total"):
        fail("generated progressive catalogue total does not match its collections")
    catalogue_bytes = CATALOGUE.stat().st_size
    if catalogue_bytes > 32_000:
        fail("generated progressive catalogue exceeds the 32 KB raw startup budget")
    if shard_bytes > 5_000_000:
        fail("generated progressive collection data exceeds the 5 MB raw budget")

    app_source = (REPO / "website" / "app.js").read_text(encoding="utf-8")
    if 'fetch("../archived-references/manifest.json")' in app_source or 'fetch(`../${year}.md`)' in app_source:
        fail("website still downloads canonical archive sources at runtime")
    for marker in ("data/catalogue.json", "ensureCollection", "scheduleArchivePrefetch", "connection?.saveData"):
        if marker not in app_source:
            fail(f"website is missing progressive-loading marker {marker!r}")
    return total, catalogue_bytes, shard_bytes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check-only", action="store_true", help="validate without regenerating website/data")
    args = parser.parse_args()

    finalized, preliminary, leads = validate_registry()
    print(f"registry: {finalized} finalized collection(s), {preliminary} preliminary collection(s), {leads} preliminary lead(s)")

    node = shutil.which("node")
    if not node:
        fail("node is required for JavaScript validation and the archive smoke test")
    if args.check_only:
        run(node, "website/build-data.mjs", "--check")
    else:
        run(sys.executable, "tools/references/related_sources.py", "build")
        run(node, "website/build-data.mjs")

    total, catalogue_bytes, shard_bytes = validate_progressive_data()
    print(f"progressive data: {total} record(s), {catalogue_bytes} catalogue bytes, {shard_bytes} shard bytes")
    for source in ("app.js", "constellation.js", "build-data.mjs", "build-site.mjs", "smoke-test.mjs"):
        run(node, "--check", f"website/{source}")
    run(node, "website/smoke-test.mjs")
    if WARNINGS:
        print(f"web-app refresh: PASS with {len(WARNINGS)} warning(s)")
        for message in WARNINGS:
            print(f"  - {message}")
    else:
        print("web-app refresh: PASS")
    print("next: commit source changes only (website/data is generated and ignored), then push master")
    print("post-push: verify GitHub Actions and Cloudflare Pages deployments; no manual upload or routine cache purge is needed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
