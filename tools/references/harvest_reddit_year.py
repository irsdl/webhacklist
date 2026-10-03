#!/usr/bin/env python3
"""Collect one historical r/netsec year through the isolated source boundary."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sys
import time
from urllib.parse import urlencode

sys.path.insert(0, str(Path(__file__).resolve().parent))

from refslib import isolation, toolbox  # noqa: E402


BASE = "https://arctic-shift.photon-reddit.com/api/posts/search"
FIELDS = "id,created_utc,score,num_comments,title,url"


def epoch(year, month, day=1):
    return int(datetime(year, month, day, tzinfo=timezone.utc).timestamp())


def month_bounds(year, month):
    start = epoch(year, month)
    end = epoch(year + 1, 1) if month == 12 else epoch(year, month + 1)
    return start, end


def fetch(url):
    return toolbox.fetch_public(url)


def expected_counts(year):
    query = urlencode({
        "aggregate": "created_utc", "frequency": "month", "subreddit": "netsec",
        "after": "%04d-01-01" % year, "before": "%04d-01-01" % (year + 1),
    })
    return isolation.call("social.reddit_month_counts", fetch(BASE + "/aggregate?" + query))


def collect_month(year, month, expected, pause):
    start, end = month_bounds(year, month)
    cursor = start
    found = {}
    while len(found) < expected:
        query = urlencode({
            "subreddit": "netsec", "after": cursor, "before": end,
            "limit": 100, "sort": "asc", "fields": FIELDS,
        })
        raw = fetch(BASE + "?" + query)
        batch = isolation.call("social.reddit_posts", raw, start, end)
        if not batch:
            break
        before = len(found)
        found.update((row["id"], row) for row in batch)
        next_cursor = max(row["created_utc"] for row in batch)
        if len(found) == before or next_cursor < cursor:
            raise RuntimeError("pagination stopped making progress")
        cursor = next_cursor
        if len(found) < expected and pause:
            time.sleep(max(0.0, min(pause, 10.0)))
    return sorted(found.values(), key=lambda row: (row["created_utc"], row["id"]))


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("year", type=int)
    parser.add_argument("--output", required=True)
    parser.add_argument("--pause", type=float, default=1.0)
    args = parser.parse_args(argv)
    if not 2005 <= args.year <= datetime.now(timezone.utc).year:
        parser.error("year is outside Reddit's public history")
    target = Path(args.output).resolve()
    repo = Path(__file__).resolve().parents[2]
    scratch = (repo / ".local").resolve()
    if target.parent != scratch or target.suffix.lower() != ".json":
        parser.error("output must be a JSON file directly under .local")

    counts = expected_counts(args.year)
    if len(counts) != 12:
        raise RuntimeError("aggregate did not return twelve months")
    rows = []
    observed = []
    for month in range(1, 13):
        expected = counts[month - 1]["count"]
        batch = collect_month(args.year, month, expected, args.pause)
        if len(batch) != expected:
            raise RuntimeError("%04d-%02d returned %d of %d posts" % (
                args.year, month, len(batch), expected))
        rows.extend(batch)
        observed.append({"month": "%04d-%02d" % (args.year, month), "count": len(batch)})
        print("%04d-%02d: %d" % (args.year, month, len(batch)), flush=True)
        if month != 12 and args.pause:
            time.sleep(max(0.0, min(args.pause, 10.0)))

    unique = {row["id"]: row for row in rows}
    if len(unique) != len(rows):
        raise RuntimeError("duplicate post IDs crossed monthly boundaries")
    ordered = sorted(rows, key=lambda row: (row["created_utc"], row["id"]))
    document = {
        "schema": 1,
        "source": "Arctic Shift public API",
        "subreddit": "netsec",
        "year": args.year,
        "total_posts": len(ordered),
        "months": observed,
        "posts": ordered,
    }
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    print("wrote %s (%d posts)" % (target, len(ordered)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
