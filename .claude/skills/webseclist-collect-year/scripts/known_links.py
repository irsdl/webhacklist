#!/usr/bin/env python3
"""Build the exclusion set for a year, and filter candidates against it.

A year's links live in two places: the curated list `<YEAR>.md` (or `2016-17.md`)
and, if a previous collection run happened, `<YEAR>-ai.md`. Anything already in
either is NOT a new find, and re-adding it is the main way a re-run wastes effort
and produces a misleading file.

Matching is on a normalised form of the URL, because the same document is
routinely cited with a trailing slash, with `www.`, over http vs https, with
tracking parameters, or wrapped in a Wayback snapshot. Comparing raw strings
misses all of those.

Usage
-----
  # print every URL already recorded for a year (normalised, one per line)
  python known_links.py 2026

  # print the raw URLs as they appear in the files, with their source file
  python known_links.py 2026 --raw

  # read candidate URLs on stdin, print only the ones NOT already recorded
  cat candidates.txt | python known_links.py 2026 --filter

  # same, but explain each decision on stderr
  cat candidates.txt | python known_links.py 2026 --filter --verbose
"""

from __future__ import annotations

import argparse
import pathlib
import re
import sys
from urllib.parse import parse_qsl, unquote, urlencode, urlsplit, urlunsplit

# Query parameters that never change which document you land on.
TRACKING_PARAMS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "utm_id", "gclid", "fbclid", "mc_cid", "mc_eid", "ref", "referrer",
    "source", "s", "_ga", "igshid", "spm",
}

# Hosts whose subdomain prefix is cosmetic.
STRIP_PREFIXES = ("www.", "m.", "amp.")

# Bare URLs. Stops at a closing paren, which is why the markdown-aware patterns
# below have to run first: research URLs really do contain parentheses.
URL_RE = re.compile(r"https?://[^\s)\]<>\"'|]+")

# [Title](<https://example.com/a_(b)>) - the angle-bracket form used for URLs
# whose parentheses would otherwise break the link.
MD_ANGLE_RE = re.compile(r"\]\(<\s*(https?://[^>]+?)\s*>\)")

# [Title](https://example.com/a_(b)) - plain form, tolerating one level of
# balanced parentheses inside the URL.
MD_PLAIN_RE = re.compile(
    r"\]\(\s*(https?://[^\s()]*(?:\([^()]*\)[^\s()]*)*)\s*\)"
)

WAYBACK_RE = re.compile(
    r"^https?://web\.archive\.org/web/[^/]*/(?P<target>https?://.+)$", re.I
)


def unwrap_archive(url: str) -> str:
    """Return the original URL behind a Wayback (or similar) snapshot wrapper."""
    m = WAYBACK_RE.match(url)
    if m:
        return m.group("target")
    # r.jina.ai reader proxy: https://r.jina.ai/https://example.com/x
    for proxy in ("https://r.jina.ai/", "http://r.jina.ai/"):
        if url.lower().startswith(proxy):
            rest = url[len(proxy):]
            if rest.lower().startswith(("http://", "https://")):
                return rest
    return url


def normalise(url: str) -> str:
    """Collapse a URL to a comparable identity.

    Deliberately conservative about the path: it is lower-cased only for hosts
    known to be case-insensitive would be wrong, so path case is preserved.
    Many research URLs are on case-sensitive static hosts (GitHub raw, S3).
    """
    url = unwrap_archive(url.strip())
    url = url.rstrip(".,;")

    # A markdown-escaped underscore or the like can survive extraction.
    url = url.replace("\\_", "_")

    try:
        parts = urlsplit(url)
    except ValueError:
        return url.lower()

    host = parts.netloc.lower()
    if "@" in host:  # strip any credentials
        host = host.rsplit("@", 1)[1]
    for prefix in STRIP_PREFIXES:
        if host.startswith(prefix):
            host = host[len(prefix):]
            break
    # Default ports carry no meaning.
    for scheme_port in (":80", ":443"):
        if host.endswith(scheme_port):
            host = host[: -len(scheme_port)]

    path = unquote(parts.path)
    path = re.sub(r"/{2,}", "/", path)
    if path.endswith("/") and len(path) > 1:
        path = path[:-1]
    # index.html and friends are the same document as the directory.
    path = re.sub(r"/(index|default)\.(html?|php|aspx?)$", "", path, flags=re.I)

    query = [
        (k, v)
        for k, v in parse_qsl(parts.query, keep_blank_values=True)
        if k.lower() not in TRACKING_PARAMS
    ]
    query.sort()

    # Scheme and fragment never distinguish two citations of one document.
    return urlunsplit(("https", host, path, urlencode(query), ""))


def year_files(year: str, repo: pathlib.Path) -> list[pathlib.Path]:
    """Every file that may already record links for this year.

    2016 and 2017 share one file in this repo, which is why this is a lookup
    rather than an f-string.
    """
    candidates: list[str] = []
    if year in ("2016", "2017"):
        candidates.append("2016-17.md")
        candidates.append("2016-17-ai.md")
    else:
        candidates.append(f"{year}.md")
        candidates.append(f"{year}-ai.md")
    return [repo / name for name in candidates if (repo / name).is_file()]


def extract_urls(text: str) -> list[str]:
    """Pull every URL out of markdown, parentheses included.

    Order matters. Markdown link targets are consumed first and blanked out, so
    that a URL like `.../opera-(gx)` is captured whole instead of being cut at
    its first closing paren by the bare-URL pattern.
    """
    found: list[str] = []
    for pattern in (MD_ANGLE_RE, MD_PLAIN_RE):
        for m in pattern.finditer(text):
            found.append(m.group(1))
        # Blank the consumed spans so the bare-URL pass cannot re-find a
        # truncated version of the same link. Replacing with spaces keeps
        # offsets stable for the next pattern.
        text = pattern.sub(lambda m: " " * len(m.group(0)), text)
    found.extend(URL_RE.findall(text))
    return found


def extract(path: pathlib.Path) -> list[str]:
    return extract_urls(path.read_text(encoding="utf-8", errors="replace"))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("year", help="four-digit year, e.g. 2026")
    ap.add_argument("--repo", default=".",
                    help="repository root (default: current directory)")
    ap.add_argument("--raw", action="store_true",
                    help="print URLs as written, prefixed by their source file")
    ap.add_argument("--filter", action="store_true",
                    help="read candidate URLs on stdin, print only unseen ones")
    ap.add_argument("--verbose", action="store_true",
                    help="with --filter, explain each decision on stderr")
    args = ap.parse_args()

    if not re.fullmatch(r"\d{4}", args.year):
        print(f"error: {args.year!r} is not a four-digit year", file=sys.stderr)
        return 2

    repo = pathlib.Path(args.repo).resolve()
    files = year_files(args.year, repo)
    if not files:
        print(
            f"note: no existing list found for {args.year} under {repo}; "
            f"every candidate will count as new",
            file=sys.stderr,
        )

    known: dict[str, tuple[str, str]] = {}  # normalised -> (raw, source file)
    for path in files:
        for raw in extract(path):
            known.setdefault(normalise(raw), (raw, path.name))

    # Reviewed companions are already part of a research story even when the
    # historical year bullet has not been rewritten to repeat them.
    policy = repo / "tools/references/related-sources.json"
    if policy.exists():
        import json
        for primary, group in json.loads(
                policy.read_text(encoding="utf-8")).get("groups", {}).items():
            if normalise(primary) in known:
                for source in group.get("sources", []):
                    raw = source["url"]
                    known.setdefault(normalise(raw), (raw, "tools/references/related-sources.json"))

    if args.filter:
        kept = 0
        dropped = 0
        for line in sys.stdin:
            url = line.strip()
            if not url or url.startswith("#"):
                continue
            key = normalise(url)
            if key in known:
                dropped += 1
                if args.verbose:
                    seen_raw, seen_in = known[key]
                    print(f"DROP {url}\n     already in {seen_in} as {seen_raw}",
                          file=sys.stderr)
            else:
                kept += 1
                known[key] = (url, "<stdin>")  # also de-dupe within the input
                print(url)
        print(f"{kept} new, {dropped} already recorded", file=sys.stderr)
        return 0

    if args.raw:
        for _, (raw, source) in sorted(known.items()):
            print(f"{source}\t{raw}")
    else:
        for key in sorted(known):
            print(key)

    print(f"{len(known)} distinct URLs across {len(files)} file(s)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
