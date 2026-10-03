#!/usr/bin/env python3
"""Inspect bounded social discovery queues through the isolated worker."""

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from refslib import isolation  # noqa: E402


def main(argv=None):
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser()
    parser.add_argument("queue")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--reddit-ids", nargs="+")
    group.add_argument("--xuanwu-stats", action="store_true")
    group.add_argument("--xuanwu-page", type=int)
    parser.add_argument("--candidates", action="store_true")
    parser.add_argument("--limit", type=int, default=100)
    args = parser.parse_args(argv)
    repo = Path(__file__).resolve().parents[2]
    source = Path(args.queue).resolve()
    if source.parent != (repo / ".local").resolve() or source.suffix.lower() != ".json":
        parser.error("queue must be a JSON file directly under .local")
    if args.reddit_ids:
        result = isolation.call(
            "social.reddit_candidate_select", source.read_bytes(), args.reddit_ids)
    elif args.xuanwu_page is not None:
        if not args.candidates:
            parser.error("--xuanwu-page requires a candidate queue and --candidates")
        result = isolation.call(
            "social.xuanwu_candidate_page", source.read_bytes(),
            args.xuanwu_page, args.limit)
    else:
        result = isolation.call(
            "social.xuanwu_stats", source.read_bytes(), args.candidates)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
