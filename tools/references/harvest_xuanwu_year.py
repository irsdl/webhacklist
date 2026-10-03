#!/usr/bin/env python3
"""Extract selected X accounts from a pinned Xuanwu daily-news archive."""

import argparse
import json
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from refslib import isolation  # noqa: E402


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("year", type=int)
    parser.add_argument("--commit", required=True)
    parser.add_argument("--handle", action="append", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)
    if not re.fullmatch(r"[0-9a-f]{40}", args.commit):
        parser.error("commit must be a full lowercase Git SHA")
    repo = Path(__file__).resolve().parents[2]
    scratch = (repo / ".local").resolve()
    target = Path(args.output).resolve()
    if target.parent != scratch or target.suffix.lower() != ".json":
        parser.error("output must be a JSON file directly under .local")
    result = isolation.call("xuanwu_year", args.year, args.commit, args.handle)
    posts = result["posts"]
    document = {
        "schema": 1,
        "year": args.year,
        "archive": "https://github.com/XuanwuLab/XuanwuLab.github.io/tree/" + args.commit,
        "handles": args.handle,
        "page_count": result["page_count"],
        "post_count": len(posts),
        "posts": posts,
    }
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    print("wrote %s (%d posts)" % (target, len(posts)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
