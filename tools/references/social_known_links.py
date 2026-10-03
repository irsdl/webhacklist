"""Read URLs already recorded for one social-source review year.

This module belongs to the reference tooling rather than a workflow skill so
the reusable year filters do not depend on operational instruction files.
"""

import json
from pathlib import Path
import re

from refslib import urls


_ANGLE_LINK = re.compile(r"\]\(<\s*(https?://[^>]+?)\s*>\)", re.I)
_PLAIN_LINK = re.compile(
    r"\]\(\s*(https?://[^\s()]*(?:\([^()]*\)[^\s()]*)*)\s*\)", re.I)
_BARE_URL = re.compile(r"https?://[^\s)\]<>\"'|]+", re.I)


def _extract_urls(text):
    found = []
    for pattern in (_ANGLE_LINK, _PLAIN_LINK):
        found.extend(match.group(1) for match in pattern.finditer(text))
        text = pattern.sub(lambda match: " " * len(match.group(0)), text)
    found.extend(_BARE_URL.findall(text))
    return found


def _year_paths(repo, year):
    stem = "2016-17" if year in (2016, 2017) else str(year)
    return [path for path in (repo / (stem + ".md"), repo / (stem + "-ai.md"))
            if path.is_file()]


def known_links(repo, year):
    """Return raw URLs already represented in a year's curated collections."""
    repo = Path(repo).resolve()
    recorded = {}
    for path in _year_paths(repo, year):
        for raw in _extract_urls(path.read_text(encoding="utf-8", errors="replace")):
            recorded.setdefault(urls.normalize(raw), raw)

    policy_path = repo / "tools/references/related-sources.json"
    if policy_path.is_file():
        policy = json.loads(policy_path.read_text(encoding="utf-8"))
        for primary, group in policy.get("groups", {}).items():
            if urls.normalize(primary) not in recorded:
                continue
            for source in group.get("sources", []):
                raw = source.get("url") if isinstance(source, dict) else None
                if isinstance(raw, str) and raw.startswith(("http://", "https://")):
                    recorded.setdefault(urls.normalize(raw), raw)
    return list(recorded.values())
