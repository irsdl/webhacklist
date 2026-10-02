"""Research stories and their separately credited sources. No network or list writes.

Year bullets establish membership, not document identity. Maintained decisions
extend them without rewriting historical nominations. Discovery proposes links;
only explicit decisions, list citations and confirmed recordings publish them.
"""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from . import kinds, sources

POLICY = "tools/references/related-sources.json"
OUTPUT = "archived-references/source-groups.json"
LINK = re.compile(r"\[((?:[^\]\\]|\\.)+)\]\((?:<(https?://[^>\s]+)>|(https?://[^)\s]+))\)")
RELATIONS = {"same-work", "part", "follow-up", "analysis", "reproduction", "background", "translation", "alternate", "related"}
KINDS = {"article", "paper", "slides", "video", "audio", "code", "tool", "dataset", "advisory", "project", "download", "link"}


def identity(url):
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.hostname or parts.username or parts.password:
        raise ValueError("Source URL must be credential-free HTTP(S)")
    host = parts.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    path = parts.path.rstrip("/") or "/"
    if host == "github.com":
        segments = path.split("/")
        segments[1:3] = [segment.lower() for segment in segments[1:3]]
        if len(segments) == 3 and segments[2].endswith(".git"):
            segments[2] = segments[2][:-4]
        path = "/".join(segments)
    # An anchor can identify a distinct post in a blog archive or a session in
    # a conference programme. Dropping it merges unrelated nominations.
    return urlunsplit((parts.scheme, host, path, parts.query, parts.fragment))


def stable_id(url, prefix="source"):
    return prefix + "-" + hashlib.sha256(identity(url).encode()).hexdigest()[:20]


def citation_scoped_research_id(url, citation):
    """Disambiguate distinct stories that cite the same lead document together."""
    seed = identity(url) + "\0" + citation
    return "research-" + hashlib.sha256(seed.encode()).hexdigest()[:20]


def load_policy(root):
    path = root / POLICY
    if not path.exists():
        return {"schema": 1, "groups": {}}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != 1 or not isinstance(data.get("groups"), dict):
        raise ValueError("Invalid related-source policy")
    for url, group in data["groups"].items():
        identity(url)
        if not isinstance(group, dict) or not isinstance(group.get("sources", []), list):
            raise ValueError("Invalid group decision: " + url)
        if set(group) - {"main", "sources", "exclude", "review"}:
            raise ValueError("Unknown group decision field: " + url)
        if group.get("main"):
            identity(group["main"])
        seen = set()
        for source in group.get("sources", []):
            key = identity(source["url"])
            if key in seen:
                raise ValueError("Duplicate source decision: " + key)
            seen.add(key)
            if set(source) - {"url", "title", "label", "relation", "kind", "sequence", "reason", "evidence", "preservation", "authors", "publisher", "published", "summary"}:
                raise ValueError("Unknown source field: " + key)
            if source.get("relation") not in RELATIONS or source.get("kind") not in KINDS:
                raise ValueError("Source needs a valid relationship and kind: " + key)
            if not isinstance(source.get("reason"), str) or not source["reason"].strip() or not isinstance(source.get("evidence"), list) or not source["evidence"]:
                raise ValueError("Source needs relationship evidence: " + key)
            for field in ("title", "label", "publisher", "published", "summary"):
                if field in source and not isinstance(source[field], str):
                    raise ValueError("Source metadata must be text: " + field)
            # Labels describe the companion's role. A second handwritten byline
            # can contradict its document credit (including a later correction).
            # Historical citation text and actual publication titles are retained.
            if re.search(r"(?:^|\s)by\s+\S", source.get("label", ""), re.I):
                raise ValueError("Keep bylines out of source labels; use a role label and evidence-backed authors: " + key)
            if "authors" in source and (not isinstance(source["authors"], list) or any(not isinstance(author, str) for author in source["authors"])):
                raise ValueError("Source authors must be a list of names")
            for evidence in source["evidence"]:
                identity(evidence)
            if source.get("preservation", "archive") not in {"archive", "link-only"}:
                raise ValueError("Invalid preservation policy: " + key)
            if "sequence" in source and (type(source["sequence"]) is not int or source["sequence"] < 1):
                raise ValueError("Part sequence must be a positive integer")
    return data


def list_entries(root):
    registry = json.loads((root / "website/archive-years.json").read_text(encoding="utf-8"))
    for collection in registry["years"]:
        filename = collection["id"] + ".md"
        for number, line in sources.bounded_lines(
                filename, (root / filename).read_text(encoding="utf-8")):
            if not re.match(r"^\s*-\s", line):
                continue
            body = re.sub(r"(?:\*\*\((?!#)([^)]*)\)\*\*|\(\*\*(.*?)\*\*\))\s*$", "", line)
            links = [{"label": m[1], "url": m[2] or m[3]} for m in LINK.finditer(body)]
            if links:
                yield filename, number, links


def manifest_lookup(manifest):
    lookup = {}
    for url, record in manifest.get("urls", {}).items():
        for alias in [url, *record.get("spellings", []), *record.get("also_at", []), record.get("health", {}).get("final_url")]:
            if not alias:
                continue
            try:
                key = identity(alias)
                if key not in lookup or (record.get("content_sha256") and not lookup[key].get("content_sha256")):
                    lookup[key] = record
            except ValueError:
                continue
    # A real document record always takes precedence over another record's alias.
    for url, record in manifest.get("urls", {}).items():
        if record.get("content_sha256") or identity(url) not in lookup:
            lookup[identity(url)] = record
    return lookup


def inferred_kind(url, label, record):
    raw = kinds.from_url(url)
    if raw == "video" or re.search(r"\.(mp4|webm|mov|m4v)(?:[?#]|$)", url, re.I):
        return "video"
    if re.search(r"\.(mp3|m4a|ogg|wav)(?:[?#]|$)", url, re.I):
        return "audio"
    if raw == "executable":
        return "download"
    for pattern, result in [(r"\bslides?\b|\bdeck\b", "slides"), (r"\bwhitepaper\b|\bpaper\b|\bpreprint\b", "paper"), (r"\badvisory\b|\bmitigation", "advisory"), (r"\btool\b|\bscanner\b", "tool"), (r"\bcode\b|\bPoC\b|\bartifact", "code")]:
        if re.search(pattern, label, re.I):
            return result
    raw = record.get("kind") or raw
    return {"whitepaper": "paper", "repo": "code", "records": "link"}.get(raw, raw if raw in KINDS else "article")


def inferred_relation(label):
    for pattern, relation in [(r"earlier|prior |background", "background"), (r"follow.up|escalation", "follow-up"), (r"reproduc", "reproduction"), (r"translat", "translation"), (r"\bpart\s*[123IVX]|\bseries\b", "part"), (r"analysis|deep.dive", "analysis")]:
        if re.search(pattern, label, re.I):
            return relation
    return "same-work" if re.search(r"slides?|whitepaper|paper|code|tool|PoC|advisory|checker|scanner", label, re.I) else "related"


def build(root, policy=None, manifest=None):
    policy = policy or load_policy(root)
    manifest = manifest or json.loads(
        (root / "archived-references/manifest.json").read_text(encoding="utf-8"))
    lookup = manifest_lookup(manifest)
    decisions = {identity(url): value for url, value in policy["groups"].items()}
    groups = {}
    for filename, number, links in list_entries(root):
        primary = links[0]["url"]
        citation = f"{filename}:{number}"
        gid = stable_id(primary, "research")
        canonical = groups.get(gid)
        # The same source can document more than one nominated technique. Keep
        # one URL-based canonical group so recitations in later collections keep
        # merging, but do not collapse a second bullet in the same collection.
        if canonical and any(item.startswith(filename + ":") for item in canonical["citations"]):
            gid = citation_scoped_research_id(primary, citation)
        group = groups.setdefault(gid, {"id": gid, "identity": primary, "main": stable_id(primary), "citations": [], "sources": []})
        group["citations"].append(citation)
        known = {source["id"]: source for source in group["sources"]}
        for i, link in enumerate(links):
            sid = stable_id(link["url"])
            if sid in known:
                if citation not in known[sid]["evidence"]:
                    known[sid]["evidence"].append(citation)
                continue
            record = lookup.get(identity(link["url"]), {})
            kind = inferred_kind(link["url"], link["label"], record)
            source = {"id": sid, **link, "relation": "same-work" if i == 0 else inferred_relation(link["label"]), "kind": kind, "preservation": "link-only" if kind in {"video", "audio", "download"} else "archive", "basis": "list-citation", "evidence": [citation]}
            sequence = re.search(r"\bpart\s+(\d+)\b", link["label"], re.I)
            if sequence:
                source["sequence"] = int(sequence[1])
            group["sources"].append(source)
            known[sid] = source
    for group in groups.values():
        # URL-keyed policy belongs only to the canonical story. A collision
        # group represents distinct research and must not silently inherit the
        # canonical story's reviewed companions or exclusions.
        canonical_gid = stable_id(group["identity"], "research")
        decision = (decisions.pop(identity(group["identity"]), {})
                    if group["id"] == canonical_gid else {})
        excluded = {identity(url) for url in decision.get("exclude", [])}
        group["sources"] = [source for source in group["sources"] if identity(source["url"]) not in excluded]
        for extra in decision.get("sources", []):
            sid = stable_id(extra["url"])
            record = lookup.get(identity(extra["url"]), {})
            if "authors" in extra and "authors" in record:
                if [name.strip() for name in extra["authors"]] != [name.strip() for name in record["authors"]]:
                    raise ValueError("Companion authors conflict with the archive attribution: " + extra["url"])
            existing = next((s for s in group["sources"] if s["id"] == sid), None)
            row = {"id": sid, "label": extra.get("label") or extra.get("title") or "Related source", "preservation": "archive", **extra, "basis": "reviewed-relationship"}
            detected_kind = inferred_kind(row["url"], "", {})
            if detected_kind in {"video", "audio", "download"}:
                row["kind"] = detected_kind
            if row["kind"] in {"video", "audio", "download"} or kinds.from_url(row["url"]) == "executable":
                row["preservation"] = "link-only"
            if existing:
                existing.update(row)
            else:
                group["sources"].append(row)
        # Resolve story relationships before attaching recordings. A background
        # paper's valid talk is not a talk for the paper that cites it.
        known = {source["id"]: source for source in group["sources"]}
        for linked in list(group["sources"]):
            if linked["relation"] not in {"same-work", "part", "alternate"}:
                continue
            record = lookup.get(identity(linked["url"]), {})
            for video in record.get("videos", []):
                review = video.get("review") or {}
                if (video.get("confidence") != "confirmed" or video.get("date_note")
                        or video.get("relation") != "same-work"
                        or video.get("role") != "talk"
                        or review.get("decision") != "same-work"
                        or not review.get("checked") or not review.get("reason") or not review.get("evidence")
                        or identity(video["url"]) in excluded):
                    continue
                sid = stable_id(video["url"])
                source = known.get(sid)
                if source:
                    # A reviewed background/analysis relationship wins over a
                    # recording attached to another member of this story.
                    if source["relation"] == "related" and source["basis"] == "list-citation":
                        source["relation"] = "same-work"
                    if source["relation"] != "same-work":
                        continue
                else:
                    source = {"id": sid, "url": video["url"], "label": "Talk recording", "relation": "same-work", "kind": "video", "preservation": "link-only", "basis": "confirmed-recording", "evidence": [linked["url"]]}
                    group["sources"].append(source)
                    known[sid] = source
                source["recording"] = {key: video[key] for key in
                    ("confidence", "title", "published", "channel", "conference", "seconds") if video.get(key)}
                for key in ("title", "published", "channel", "conference", "seconds"):
                    if video.get(key):
                        source.setdefault(key, video[key])
        if decision.get("main"):
            group["main"] = stable_id(decision["main"])
        if group["main"] not in {s["id"] for s in group["sources"]}:
            raise ValueError("Main source must belong to its research group: " + group["identity"])
        if decision.get("review"):
            group["review"] = decision["review"]
    if decisions:
        raise ValueError("Related-source decisions have no active research entry: " + ", ".join(decisions))
    inputs = {"website/archive-years.json", "archived-references/manifest.json", POLICY}
    inputs.update(citation.split(":")[0] for group in groups.values() for citation in group["citations"])
    return {"schema": 1, "inputs": {name: hashlib.sha256((root / name).read_bytes()).hexdigest() for name in sorted(inputs) if (root / name).exists()}, "groups": groups}


def archive_occurrences(root, config):
    """Only explicitly reviewed archivable additions become acquisition input.

    Their citation is the existing year bullet; never harvest arbitrary outgoing
    links, candidate queues, raw JSON URLs, or link-only media as new documents.
    """
    policy = load_policy(root)
    decisions = {identity(url): value for url, value in policy["groups"].items()}
    from .harvest import Occurrence
    from . import urls
    manifest_path = root / "archived-references/manifest.json"
    manifest = (json.loads(manifest_path.read_text(encoding="utf-8"))
                if manifest_path.exists() else {"urls": {}})
    lookup = manifest_lookup(manifest)
    owners = {id(record): key for key, record in manifest["urls"].items()}
    for filename, number, links in list_entries(root):
        for extra in decisions.get(identity(links[0]["url"]), {}).get("sources", []):
            if extra.get("preservation", "archive") == "link-only" or extra["kind"] in {"video", "audio", "download"}:
                continue
            if inferred_kind(extra["url"], "", {}) in {"video", "audio", "download"}:
                continue
            if identity(extra["url"]) in {identity(link["url"]) for link in links}:
                continue
            record = lookup.get(identity(extra["url"]))
            normalized = owners[id(record)] if record is not None else urls.normalize(extra["url"], config.get("host_aliases") or {}, frozenset(config.get("locale_stripped_hosts") or ()))
            yield Occurrence(extra["url"], normalized, filename, number, extra.get("title") or extra.get("label"), "related-source")


def audit(root, groups):
    """Inspect every existing source body for explicit companion-link leads.

    The output is evidence for review, NOT permission to publish. No keyword or
    common host makes two pieces of research the same contribution.
    """
    manifest = json.loads(
        (root / "archived-references/manifest.json").read_text(encoding="utf-8"))
    lookup = manifest_lookup(manifest)
    rows = []
    for group in groups["groups"].values():
        known = {identity(source["url"]) for source in group["sources"]}
        inspected, unavailable, candidates = [], [], {}
        for source in group["sources"]:
            record = lookup.get(identity(source["url"]), {})
            if source["preservation"] == "link-only" or not record.get("content_sha256"):
                continue
            relative = record.get("steps", {}).get("render", {}).get("file")
            if not relative:
                continue
            path = root / relative
            if not path.is_file():
                if record.get("grade"):
                    unavailable.append(relative)
                continue
            if relative in inspected:
                continue
            inspected.append(relative)
            body = path.read_text(encoding="utf-8", errors="replace")
            # Frontmatter and generated attribution are not author assertions.
            start = body.find("## Content")
            body = body[start:] if start >= 0 else re.sub(r"\A---\n.*?\n---\n", "", body, count=1, flags=re.S)
            fence = False
            for line in body.splitlines():
                if re.match(r"^\s*(```|~~~)", line):
                    fence = not fence
                if fence:
                    continue
                for match in LINK.finditer(line):
                    label, url = match[1], match[2] or match[3]
                    try:
                        key = identity(url)
                    except ValueError:
                        continue
                    if key in known:
                        continue
                    signals = re.search(r"\b(slides?|whitepaper|paper|part\s*(?:\d+|II|III)|follow.up|companion|video|recording|presentation|demo|reproduc\w*|source code|github|PoC|proof.of.concept)\b", label + " " + url, re.I)
                    contextual = re.search(r"\b(our|my|this|the|full)\s+(?:research\s+)?(paper|slides|talk|presentation|code|write.up|article|video)\b|part\s+(?:two|three|[123IVX]+)\b", line, re.I)
                    if not signals and not contextual:
                        continue
                    candidates.setdefault(key, {"url": url, "label": label, "from": source["url"], "file": relative, "context": line[:1200]})
        rows.append({"id": group["id"], "identity": group["identity"], "citations": group["citations"], "inspected": inspected, "unavailable": unavailable, "status": "candidates-found" if candidates else "no-explicit-companion-found" if inspected else "no-readable-source", "candidates": list(candidates.values())})
    return {"schema": 1, "scope": "all active year-list entries; local archived Markdown and existing recording metadata", "method": "link inspection; candidates require semantic review; not an exhaustive live-web search", "groups": rows}
