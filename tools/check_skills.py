#!/usr/bin/env python3
"""Check repository skill structure against Anthropic's portable skill format.

Requires PyYAML (tools/requirements.txt). See tools/README.md for scope and sources.
"""

import argparse
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

import yaml


class UniqueKeyLoader(yaml.SafeLoader):
    """Reject duplicate YAML keys instead of silently keeping the last value."""

    def construct_mapping(self, node, deep=False):
        keys = set()
        for key_node, _ in node.value:
            key = self.construct_object(key_node, deep=deep)
            if not isinstance(key, str):
                raise ValueError("YAML mapping keys must be strings")
            if key in keys:
                raise ValueError(f"duplicate YAML key: {key}")
            keys.add(key)
        return super().construct_mapping(node, deep=deep)


FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}


def check_skill(path):
    errors, warnings = [], []
    text = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---(?:\n|$)(.*)\Z", text, re.S)
    if not match:
        return ["must start with YAML frontmatter delimited by --- lines"], [], None
    try:
        data = yaml.load(match[1], Loader=UniqueKeyLoader)
    except (yaml.YAMLError, ValueError) as exc:
        return [f"invalid YAML: {exc}"], [], None
    if not isinstance(data, dict):
        return ["frontmatter must be a mapping"], [], None
    unknown = data.keys() - FIELDS
    if unknown:
        errors.append(f"non-portable frontmatter fields: {', '.join(sorted(unknown))}")
    for field, limit in (("name", 64), ("description", 1024), ("compatibility", 500)):
        if field == "compatibility" and field not in data:
            continue
        value = data.get(field)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{field} must be a non-empty string")
        elif len(value) > limit:
            errors.append(f"{field} has {len(value)} characters; maximum is {limit}")
    name = data.get("name")
    if isinstance(name, str):
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            errors.append("name must use lowercase ASCII letters, digits and single hyphens")
        if any(word in name for word in ("anthropic", "claude")):
            errors.append("name contains a reserved word (anthropic or claude)")
        if name != path.parent.name:
            errors.append("name must match the skill directory")
    for field in ("name", "description"):
        value = data.get(field)
        if isinstance(value, str) and ("<" in value or ">" in value):
            errors.append(f"{field} must not contain XML tags or angle brackets")
    for field in ("license", "allowed-tools"):
        if field in data and not isinstance(data[field], str):
            errors.append(f"{field} must be a string")
    if "metadata" in data:
        metadata = data["metadata"]
        if not isinstance(metadata, dict) or not all(
            isinstance(k, str) and isinstance(v, str) for k, v in metadata.items()
        ):
            errors.append("metadata must map string keys to string values")
    if not match[2].strip():
        errors.append("missing Markdown instructions")
    if len(text.splitlines()) >= 500:
        warnings.append(f"SKILL.md has {len(text.splitlines())} lines; recommend fewer than 500")

    # Check explicit local Markdown links outside code examples. Skill resources
    # use paths relative to their containing file; repository commands are separate.
    prose_lines, fence = [], None
    for line in match[2].splitlines():
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if fence is not None:
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= len(fence):
                fence = None
        elif marker:
            fence = marker[1]
        else:
            prose_lines.append(line)
    prose = re.sub(r"(`+).*?\1", "", "\n".join(prose_lines))
    for target in re.findall(r"\]\(([^)\s]+)\)", prose):
        target = target.strip("<>")
        parts = urlsplit(target)
        if parts.scheme or parts.netloc or not parts.path:
            continue
        if not (path.parent / unquote(parts.path)).exists():
            errors.append(f"missing linked resource: {target}")
    return errors, warnings, data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--strict", action="store_true", help="also fail on length recommendations")
    args = parser.parse_args()
    files = sorted(p for root in (".agents/skills", ".claude/skills")
                   for p in (args.root / root).glob("*/SKILL.md"))
    if not files:
        parser.error("no repository skills found")
    error_count = warning_count = 0
    for path in files:
        errors, warnings, data = check_skill(path)
        error_count += len(errors)
        warning_count += len(warnings)
        label = path.relative_to(args.root)
        if data is not None and isinstance(data.get("description"), str):
            print(f"{label}: description {len(data['description'])}/1024 chars, "
                  f"{len(path.read_text(encoding='utf-8').splitlines())} lines")
        for kind, items in (("ERROR", errors), ("WARN", warnings)):
            for item in items:
                print(f"  {kind} {label}: {item}")
    # Every workflow must be available through both discovery roots, with the
    # same description and invocation metadata. The adapter is not a second copy
    # of the workflow and must not drift from its authoritative source.
    from sync_skills import synchronise
    try:
        drift = synchronise(args.root.resolve(), check=True)
        for path in drift:
            print(f"  ERROR stale or missing adapter: {path}; run tools/sync_skills.py")
        error_count += len(drift)
    except (OSError, ValueError, yaml.YAMLError) as error:
        print(f"  ERROR skill adapters: {error}")
        error_count += 1
    print(f"Checked {len(files)} skills: {error_count} errors, {warning_count} warnings.")
    return int(bool(error_count or (args.strict and warning_count)))


if __name__ == "__main__":
    sys.exit(main())
