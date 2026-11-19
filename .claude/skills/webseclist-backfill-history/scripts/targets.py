#!/usr/bin/env python3
"""Expand a year / range / "all" argument into concrete curated-list targets.

The historical-backfill workflow runs over the curated year lists, which cover 2006
through 2025. 2016 and 2017 share a single file (`2016-17.md`), and 2026 is
deliberately out of range (its vote has not happened; use the collect-year
skill for the current year instead).

This script is pure argument arithmetic so the caller never has to hand-expand
a range or remember the 2016/2017 merge. It prints one target per line as
`YEAR<TAB>FILE`, where YEAR is the calendar year to search and FILE is the
curated list to append a missed entry to. For 2016 and 2017 both years are
emitted (you search each year on its own) but both point at `2016-17.md`.

Usage
-----
  python targets.py all            # every year 2006..2025
  python targets.py 2019           # a single year
  python targets.py 2011-2015      # an inclusive range
  python targets.py 2016           # -> 2016<TAB>2016-17.md
"""

from __future__ import annotations

import argparse
import re
import sys

FIRST_YEAR = 2006
LAST_YEAR = 2025  # 2026 is out of range on purpose - see module docstring.


def list_file(year: int) -> str:
    if year in (2016, 2017):
        return "2016-17.md"
    return f"{year}.md"


def parse_spec(spec: str) -> list[int]:
    spec = spec.strip().lower()
    if spec == "all":
        return list(range(FIRST_YEAR, LAST_YEAR + 1))

    m = re.fullmatch(r"(\d{4})\s*-\s*(\d{4})", spec)
    if m:
        lo, hi = int(m.group(1)), int(m.group(2))
        if lo > hi:
            lo, hi = hi, lo
        return [y for y in range(lo, hi + 1) if FIRST_YEAR <= y <= LAST_YEAR]

    if re.fullmatch(r"\d{4}", spec):
        y = int(spec)
        return [y] if FIRST_YEAR <= y <= LAST_YEAR else []

    raise SystemExit(
        f"error: {spec!r} is not a year, a YYYY-YYYY range, or 'all' "
        f"(valid range {FIRST_YEAR}..{LAST_YEAR}; 2026 is excluded)"
    )


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("spec", help="a year, a YYYY-YYYY range, or 'all'")
    args = ap.parse_args()

    years = parse_spec(args.spec)
    if not years:
        print(
            f"note: {args.spec!r} resolves to no in-range years "
            f"({FIRST_YEAR}..{LAST_YEAR})",
            file=sys.stderr,
        )
        return 1

    for year in years:
        print(f"{year}\t{list_file(year)}")
    print(f"{len(years)} target year(s)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
