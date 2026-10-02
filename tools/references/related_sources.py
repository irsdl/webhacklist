#!/usr/bin/env python3
"""Build, check or audit source relationships for every research entry."""
import argparse
import json
from pathlib import Path
from refslib.related_sources import OUTPUT, audit, build

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("command", choices=["build", "check", "audit"])
parser.add_argument("--output", help="Audit JSON output path (defaults to .local/related-sources/audit.json)")
args = parser.parse_args()
data = build(root)
body = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
target = root / OUTPUT
if args.command == "build":
    target.write_text(body, encoding="utf-8", newline="\n")
elif args.command == "check":
    if not target.exists() or target.read_text(encoding="utf-8") != body:
        raise SystemExit("Source groups are stale; run python3 tools/references/related_sources.py build")
else:
    target = Path(args.output) if args.output else root / ".local/related-sources/audit.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    report = audit(root, data)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8", newline="\n")
    print(f"Audited {len(report['groups'])} groups; {sum(len(g['candidates']) for g in report['groups'])} candidate links; report: {target}")
print(f"Source groups: {len(data['groups'])}; entries: {sum(len(g['citations']) for g in data['groups'].values())}; sources: {sum(len(g['sources']) for g in data['groups'].values())}")
