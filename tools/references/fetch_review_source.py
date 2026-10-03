#!/usr/bin/env python3
"""Fetch one selected public research source into the private scratchpad."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from refslib import isolation  # noqa: E402


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("identifier")
    parser.add_argument("url")
    parser.add_argument("--max-bytes", type=int, default=16 * 1024 * 1024)
    args = parser.parse_args(argv)
    if not re.fullmatch(r"[a-z0-9][a-z0-9_-]{0,63}", args.identifier):
        parser.error("identifier must be a bounded lowercase slug")
    if not 1 <= args.max_bytes <= 32 * 1024 * 1024:
        parser.error("max-bytes is outside the approved range")
    isolation.public_url(args.url)
    response = isolation.call("fetch", args.url, max_bytes=args.max_bytes,
                              client_options={"timeout": 60, "per_host_gap": 0,
                                              "max_redirects": 6})
    isolation.public_url(response.url)
    if response.status != 200 or not response.body:
        raise SystemExit("fetch failed: status=%s error=%s final=%s" % (
            response.status, response.error or "", response.url))
    target = Path(__file__).resolve().parents[2] / ".local" / "review-sources"
    target.mkdir(parents=True, exist_ok=True)
    media_type = response.content_type.split(";", 1)[0].strip().lower()
    if response.body.startswith(b"%PDF-") or media_type == "application/pdf":
        suffix = ".pdf"
    elif media_type in ("text/html", "application/xhtml+xml"):
        suffix = ".html"
    elif media_type in ("application/json", "text/json"):
        suffix = ".json"
    else:
        suffix = ".txt"
    destination = target / (args.identifier + suffix)
    destination.write_bytes(response.body)
    print(json.dumps({"id": args.identifier, "status": response.status,
                      "url": response.url, "content_type": response.content_type[:200],
                      "bytes": len(response.body),
                      "sha256": hashlib.sha256(response.body).hexdigest(),
                      "file": str(destination)}, ensure_ascii=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
