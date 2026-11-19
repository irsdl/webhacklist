#!/usr/bin/env python3
"""Audit public inclusion outcomes and reject published judging marks.

Merit and score arithmetic are checked privately by the judging skill. This
public audit deliberately has no numeric selection cutoff.
"""
from __future__ import annotations
import argparse
import csv
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


history = load('decision_history', ROOT / '.claude/skills/webseclist-assess-research/scripts/history.py')
known = load('known_links', ROOT / '.claude/skills/webseclist-collect-year/scripts/known_links.py')
MARKS = re.compile(r'(?im)^##\s+\d+(?:\.\d+)?\s*[—–]|\b(?:judge|final score)\s*:?\s*\**\d|\b\d+(?:\.\d+)?/100\b|\|\s*(?:(?:final|draft|weighted|historical|current)\s+)?(?:score|verdict|confidence)\s*\|')
EXPORT_FIELDS = {'year', 'title', 'url', 'decision'}


def audit_year(year):
    directory = ROOT / 'ai-evaluation' / str(year)
    events = history.read_history(directory / 'history.jsonl')
    if not events:
        raise ValueError(f'{year}: missing decision history')
    if any(event['year'] != year for event in events):
        raise ValueError(f'{year}: event belongs to another year')
    expected = history.render_markdown(year, events)
    if (directory / 'judgements.md').read_text() != expected:
        raise ValueError(f'{year}: judgements.md differs from history; run history.py render')
    source = ROOT / ('2016-17.md' if year in (2016, 2017) else f'{year}.md')
    preliminary = not source.exists()
    if preliminary:
        source = ROOT / f'{year}-ai.md'
        text = source.read_text().split('<!-- archived-references:start -->', 1)[1].split('<!-- archived-references:end -->', 1)[0]
    else:
        # Added also covers retained community nominations. The private review
        # gates new missed-work additions; this audit checks public inclusion.
        text = source.read_text()
    urls = {known.normalise(url) for url in known.extract_urls(text)}
    index = (directory / 'README.md').read_text()
    latest = history.latest_by_candidate(events)
    added_count = 0
    for event in latest.values():
        related = [event['primary_url']] + event['related_urls']
        if event['decision'] == 'added':
            added_count += 1
            if not any(known.normalise(url) in urls for url in related):
                raise ValueError(f"{year}: Added candidate absent from list: {event['title']}")
        elif known.normalise(event['primary_url']) in urls:
            raise ValueError(f"{year}: Not added primary URL appears in list: {event['title']}")
        rows = [line for line in index.splitlines() if f"(<{event['primary_url']}>)" in line]
        outcome = 'Added' if event['decision'] == 'added' else 'Not added'
        if not rows or not any(line.endswith(f'| {outcome} |') for line in rows):
            raise ValueError(f"{year}: lead index disagrees with completed decision: {event['title']}")
    return len(latest), added_count


def audit_public_marks():
    paths = list((ROOT / 'ai-evaluation').rglob('*.md'))
    paths += list(ROOT.glob('[0-9]*.md'))
    for path in paths:
        # Capture integrity checks have their own counts and verification verdicts.
        if 'archive-reviews' in path.parts or path.name.endswith('-archive-review.md'):
            continue
        if MARKS.search(path.read_text()):
            raise ValueError(f'published judging marks: {path.relative_to(ROOT)}')
    for path in (ROOT / 'ai-evaluation/calibration-top3').glob('*.json'):
        rows = json.loads(path.read_text())
        if not isinstance(rows, list) or any(set(row) != EXPORT_FIELDS or row['decision'] not in history.DECISIONS for row in rows):
            raise ValueError(f'calibration export contains assessment data: {path}')
    with (ROOT / 'ai-evaluation/calibration-top3/results.csv').open() as stream:
        reader = csv.DictReader(stream)
        if set(reader.fieldnames or []) != EXPORT_FIELDS or any(row['decision'] not in history.DECISIONS for row in reader):
            raise ValueError('calibration CSV contains assessment data')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('years', nargs='*', type=int)
    args = parser.parse_args()
    available = sorted(int(path.name) for path in (ROOT / 'ai-evaluation').iterdir() if path.is_dir() and path.name.isdigit())
    years = args.years or available
    if any(year not in available for year in years):
        parser.error('requested year has no public decision records')
    try:
        audit_public_marks()
        total = added = 0
        for year in years:
            count, kept = audit_year(year)
            total += count
            added += kept
            print(f'ok {year}: {count} completed decisions, {kept} added')
        print(f'audit valid: {len(years)} years, {total} decisions, {added} added; no public scores')
        return 0
    except (ValueError, OSError, IndexError) as error:
        print(f'audit failed: {error}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
