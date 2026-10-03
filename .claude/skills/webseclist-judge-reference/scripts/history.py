#!/usr/bin/env python3
"""Record public inclusion decisions without publishing evaluation scores.

Full scoring is performed privately with the judging skill. This tool accepts
only candidate identity, Added/Not added, and the applicable merit revision.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

SCHEMA = 'webseclist-decision-history/v2'
DECISIONS = {'added', 'not-added'}
EVENT_TYPES = {'migration', 'judgement', 'rejudgement', 'reconciliation'}
FIELDS = {'schema', 'event_id', 'recorded_at', 'event_type', 'year',
          'candidate_id', 'title', 'primary_url', 'related_urls', 'decision',
          'merit_revision', 'supersedes'}


class HistoryError(ValueError):
    pass


def repo_root() -> Path:
    return Path(__file__).resolve().parents[4]


def digest(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def normalise_url(url: str) -> str:
    if not isinstance(url, str):
        raise HistoryError('candidate URL must be a string')
    parsed = urlsplit(url.strip().strip('<>'))
    if parsed.scheme not in ('http', 'https') or not parsed.netloc:
        raise HistoryError('candidate URL must be absolute HTTP(S)')
    return urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(),
                       parsed.path.rstrip('/') or '/', parsed.query, ''))


def candidate_id(url: str) -> str:
    return 'url-sha256:' + digest(normalise_url(url))


def event_id(event: dict) -> str:
    body = {key: value for key, value in event.items() if key != 'event_id'}
    return 'sha256:' + digest(json.dumps(body, sort_keys=True, ensure_ascii=False,
                                        separators=(',', ':')))


def merit_revision(root: Path | None = None) -> str:
    skill = (root or repo_root()) / '.claude/skills/webseclist-judge-reference'
    paths = ('SKILL.md', 'references/scoring-rubric.md', 'scripts/score.py')
    return 'sha256:' + digest('\n'.join(name + '\n' + (skill / name).read_text(encoding='utf-8')
                                        for name in paths))


def validate_event(event: dict, where: str = 'event') -> None:
    if not isinstance(event, dict) or set(event) != FIELDS:
        raise HistoryError(f'{where}: decision history permits only the documented fields; no scores or free-form assessment data')
    if event['schema'] != SCHEMA or event['decision'] not in DECISIONS:
        raise HistoryError(f'{where}: invalid decision schema or status')
    if event['event_type'] not in EVENT_TYPES:
        raise HistoryError(f'{where}: invalid event type')
    if type(event['year']) is not int or not 2000 <= event['year'] <= 2100:
        raise HistoryError(f'{where}: invalid year')
    if not isinstance(event['title'], str) or not event['title'].strip() or '\n' in event['title']:
        raise HistoryError(f'{where}: title must be a single nonempty line')
    if event['candidate_id'] != candidate_id(event['primary_url']):
        raise HistoryError(f'{where}: candidate identity mismatch')
    if not isinstance(event['related_urls'], list):
        raise HistoryError(f'{where}: related URLs must be a list')
    for url in event['related_urls']:
        normalise_url(url)
    if not isinstance(event['merit_revision'], str) or not re.fullmatch(
            r'sha256:[0-9a-f]{64}|legacy-unspecified', event['merit_revision']):
        raise HistoryError(f'{where}: merit revision must be a rubric fingerprint or legacy-unspecified')
    if event['supersedes'] and not re.fullmatch(r'sha256:[0-9a-f]{64}', event['supersedes']):
        raise HistoryError(f'{where}: invalid supersedes reference')
    try:
        dt.datetime.fromisoformat(event['recorded_at'].replace('Z', '+00:00'))
    except (AttributeError, TypeError, ValueError):
        raise HistoryError(f'{where}: invalid timestamp')
    if event['event_id'] != event_id(event):
        raise HistoryError(f'{where}: event hash mismatch')


def read_history(path: Path) -> list[dict]:
    if not path.exists():
        return []
    events = []
    latest = {}
    known = set()
    for number, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip():
            continue
        where = f'{path}:{number}'
        try:
            event = json.loads(line)
        except json.JSONDecodeError as error:
            raise HistoryError(f'{where}: invalid JSON: {error}')
        validate_event(event, where)
        previous = latest.get(event['candidate_id'])
        if event['event_id'] in known or event['supersedes'] != (previous['event_id'] if previous else ''):
            raise HistoryError(f'{where}: invalid decision history chain')
        latest[event['candidate_id']] = event
        known.add(event['event_id'])
        events.append(event)
    return events


def latest_by_candidate(events: list[dict]) -> dict[str, dict]:
    return {event['candidate_id']: event for event in events}


def make_event(*, year: int, title: str, primary_url: str, related_urls: list[str],
               decision: str, merit_revision: str, recorded_at: str,
               event_type: str = 'judgement', supersedes: str = '') -> dict:
    event = dict(schema=SCHEMA, year=year, title=title.strip(),
                 primary_url=primary_url.strip().strip('<>'), related_urls=related_urls,
                 candidate_id=candidate_id(primary_url), decision=decision,
                 merit_revision=merit_revision, recorded_at=recorded_at,
                 event_type=event_type, supersedes=supersedes)
    event['event_id'] = event_id(event)
    validate_event(event)
    return event


def append_decision(path: Path, **values) -> bool:
    previous = latest_by_candidate(read_history(path)).get(candidate_id(values['primary_url']))
    comparable = ('year', 'title', 'primary_url', 'related_urls', 'decision', 'merit_revision')
    if previous and all(previous[key] == values[key] for key in comparable):
        return False
    event = make_event(**values, supersedes=previous['event_id'] if previous else '')
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('a', encoding='utf-8') as handle:
        handle.write(json.dumps(event, sort_keys=True, ensure_ascii=False, separators=(',', ':')) + '\n')
    return True


def label(value: str) -> str:
    return value.replace('\\', '\\\\').replace('[', '\\[').replace(']', '\\]').replace('|', '\\|')


def render_markdown(year: int, events: list[dict]) -> str:
    rows = sorted(latest_by_candidate(events).values(), key=lambda event: (event['title'].casefold(), event['primary_url']))
    lines = [f'# {year} inclusion decisions', '',
             'Public outcomes only. Scoring is performed privately using the judging skill.',
             'Decisions reflect the criteria used for that review and may change after reassessment.',
             'Older decisions with an unknown merit revision are marked `legacy-unspecified` in history.',
             '', '| Candidate | Outcome |', '|---|---|']
    for event in rows:
        links = f"[{label(event['title'])}](<{event['primary_url']}>)"
        links += ''.join(f' [Related source](<{url}>)' for url in event['related_urls'])
        outcome = 'Added' if event['decision'] == 'added' else 'Not added'
        lines.append(f'| {links} | {outcome} |')
    return '\n'.join(lines) + '\n'


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    record = sub.add_parser('record', help='record an inclusion outcome after private evaluation')
    record.add_argument('--year', type=int, required=True)
    record.add_argument('--title', required=True)
    record.add_argument('--url', required=True)
    record.add_argument('--related-url', action='append', default=[])
    record.add_argument('--decision', choices=sorted(DECISIONS), required=True)
    record.add_argument('--merit-revision', help='defaults to the current judging-skill fingerprint')
    record.add_argument('--event-type', choices=['judgement', 'rejudgement'], default='judgement')
    record.add_argument('--recorded-at')
    record.add_argument('--history')
    verify = sub.add_parser('verify', help='validate decision fields and history chains')
    verify.add_argument('--history')
    render = sub.add_parser('render', help='render decision-only judgements.md files')
    render.add_argument('--year', type=int)
    args = parser.parse_args(argv)
    root = repo_root()
    try:
        if args.command == 'record':
            path = Path(args.history) if args.history else root / 'ai-evaluation' / str(args.year) / 'history.jsonl'
            changed = append_decision(path, year=args.year, title=args.title,
                primary_url=args.url, related_urls=args.related_url, decision=args.decision,
                merit_revision=args.merit_revision or merit_revision(), event_type=args.event_type,
                recorded_at=args.recorded_at or dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat())
            print(f'{int(changed)} decision event(s) appended')
        else:
            supplied = getattr(args, 'history', None)
            paths = [Path(supplied)] if supplied else sorted((root / 'ai-evaluation').glob('*/history.jsonl'))
            if not paths:
                raise HistoryError('no decision histories found')
            total = 0
            for path in paths:
                events = read_history(path)
                if args.command == 'render':
                    year = int(path.parent.name)
                    if args.year and args.year != year:
                        continue
                    path.with_name('judgements.md').write_text(
                        render_markdown(year, events), encoding='utf-8')
                total += len(events)
            print(f'{args.command}: {len(paths)} histories, {total} decision events; no score fields')
        return 0
    except (HistoryError, OSError) as error:
        print(f'error: {error}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
