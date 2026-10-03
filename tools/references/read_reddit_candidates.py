#!/usr/bin/env python3
"""Print one isolated page from a normalized Reddit candidate queue."""

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
    parser.add_argument("--start", type=int, default=0)
    parser.add_argument("--limit", type=int, default=100)
    args = parser.parse_args(argv)
    repo = Path(__file__).resolve().parents[2]
    scratch = (repo / ".local").resolve()
    source = Path(args.queue).resolve()
    if source.parent != scratch or source.suffix.lower() != ".json":
        parser.error("queue must be a JSON file directly under .local")
    page = isolation.call(
        "social.reddit_candidate_page", source.read_bytes(), args.start, args.limit)
    print(json.dumps(page, ensure_ascii=False, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
