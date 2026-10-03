#!/usr/bin/env python3
"""Build a broad unseen web-security queue from a normalized r/netsec year."""

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from refslib import isolation  # noqa: E402
from social_known_links import known_links  # noqa: E402


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("year", type=int)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)
    repo = Path(__file__).resolve().parents[2]
    scratch = (repo / ".local").resolve()
    source = Path(args.input).resolve()
    target = Path(args.output).resolve()
    if source.parent != scratch or target.parent != scratch \
            or source.suffix.lower() != ".json" or target.suffix.lower() != ".json":
        parser.error("input and output must be JSON files directly under .local")
    candidates = isolation.call(
        "social.reddit_candidates", source.read_bytes(), known_links(repo, args.year))
    document = {
        "schema": 1,
        "year": args.year,
        "candidate_count": len(candidates),
        "candidates": candidates,
    }
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    print("wrote %s (%d candidates)" % (target, len(candidates)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
