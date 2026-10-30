"""Offline diagram parsing and output validation for the isolated worker."""
import html
import json
import re
import xml.etree.ElementTree as ET


HTML_ENTITY = re.compile(r"&(?:[A-Za-z][A-Za-z0-9]+|#(?:[0-9]+|x[0-9A-Fa-f]+));")
MERMAID_ENTITY = re.compile(r"#(?:[A-Za-z][A-Za-z0-9]*|[0-9]+|x[0-9A-Fa-f]+);")


def validate_mermaid(source):
    """Validate an archived Mermaid fence and return its original source.

    Mermaid entities deliberately omit the leading ampersand: ``#35;`` is a
    literal ``#``. HTML entities such as ``&quot;`` are not interchangeable;
    their semicolon can terminate a statement and their name can be displayed
    literally. A semicolon is a statement separator in every diagram, and ``#``
    comments out sequence-diagram text, so literal uses require native entities.
    This validation happens before the pinned renderer sees archived source.
    """
    prepare_mermaid(source)
    return source


def prepare_mermaid(source):
    """Return the inert render input while preserving the archived source.

    Full-line Mermaid directives and comments are author content, so they stay
    in the archived Markdown and in the hash-bound site lookup. They are not
    needed to reconstruct a diagram, however, and are removed before rendering
    so an archived document cannot configure the shared Mermaid instance.
    """
    if not isinstance(source, str) or not source or len(source) > 50000 or "\0" in source:
        raise ValueError("invalid Mermaid source")
    if source.lstrip().startswith("---"):
        raise ValueError("Mermaid configuration frontmatter is not admitted")

    prepared, in_directive = [], False
    for line in source.splitlines():
        stripped = line.strip()
        if in_directive:
            if stripped.endswith("}%%"):
                in_directive = False
            continue
        if stripped.startswith("%%{"):
            in_directive = not stripped.endswith("}%%")
            continue
        if stripped.startswith("%%"):
            continue
        if "%%" in line:
            raise ValueError("inline %% changes Mermaid grammar; encode literal percent signs")
        prepared.append(line)
    if in_directive:
        raise ValueError("unterminated Mermaid directive")
    rendered = "\n".join(prepared).strip()
    if not rendered:
        raise ValueError("Mermaid source has no renderable body")
    if rendered.lstrip().startswith("---"):
        raise ValueError("Mermaid configuration frontmatter is not admitted")
    if HTML_ENTITY.search(rendered):
        raise ValueError("HTML entities are not Mermaid label escaping; use Mermaid-native entities")
    without_entities = MERMAID_ENTITY.sub("", rendered)
    if ";" in without_entities:
        raise ValueError("raw ; terminates a Mermaid statement; use #59;")
    first = rendered.splitlines()[0].strip()
    if first == "sequenceDiagram":
        if "#" in without_entities:
            raise ValueError("raw # comments out sequence label text; use #35;")
    return rendered


def _mermaid_sources(data):
    fence, language, block = "", "", []
    for line in data.decode("utf-8", "replace").splitlines():
        opening = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if fence:
            if re.fullmatch(re.escape(fence[0]) + r"{%d,}\s*" % len(fence), line.strip()):
                if language == "mermaid":
                    yield "\n".join(block).strip()
                fence, language, block = "", "", []
            elif language == "mermaid":
                block.append(line)
        elif opening:
            fence, language = opening.group(1), opening.group(2).strip()


def find_mermaid(documents):
    found = []
    for _, source, _, issue in find_mermaid_records(documents):
        if issue:
            raise ValueError(issue)
        found.append(source)
    return found


def find_mermaid_records(documents):
    """Return bounded document identities, sources and any policy violation."""
    found = []
    for document_index, data in enumerate(documents):
        if not isinstance(data, bytes) or len(data) > 4 * 1024 * 1024:
            raise ValueError("invalid diagram input")
        for source in _mermaid_sources(data):
            try:
                prepared = prepare_mermaid(source)
                issue = ""
            except ValueError as error:
                prepared = ""
                issue = str(error)[:240]
            found.append([document_index, source, prepared, issue])
    return found


def parse_rendered(data, expected):
    match = re.search(r'<textarea id="result">(.*?)</textarea>', data.decode("utf-8", "replace"), re.S)
    if not match or len(data) > 16 * 1024 * 1024:
        raise ValueError("invalid diagram output envelope")
    rows = json.loads(html.unescape(match[1]))
    source_by_id = expected if isinstance(expected, dict) else {}
    expected_ids = set(expected)
    seen = set()
    if not isinstance(rows, list):
        raise ValueError("diagram output must be a list")
    for row in rows:
        if not isinstance(row, list) or len(row) not in (2, 3) or not isinstance(row[0], str):
            raise ValueError("invalid diagram record")
        identity = row[0]
        if identity not in expected_ids or identity in seen or not re.fullmatch(r"[a-f0-9]{64}", identity):
            raise ValueError("unexpected or duplicate diagram identity")
        seen.add(identity)
        if row[1] is not None:
            if not isinstance(row[1], str) or len(row[1]) > 4 * 1024 * 1024:
                raise ValueError("invalid diagram SVG")
            if identity in source_by_id:
                row[1] = checked_sequence_labels(row[1], source_by_id[identity])
            else:
                row[1] = checked_svg(row[1])
    if seen != expected_ids:
        raise ValueError("diagram output is incomplete")
    return rows


def _decode_mermaid_entities(value):
    def decode(match):
        entity = match.group(0)[1:-1]
        if entity.isdigit() or re.fullmatch(r"x[0-9A-Fa-f]+", entity):
            return html.unescape("&#" + entity + ";")
        return html.unescape("&" + entity + ";")
    return MERMAID_ENTITY.sub(decode, value)


def _sequence_labels(source):
    labels = []
    for raw in source.splitlines()[1:]:
        line = raw.strip()
        participant = re.match(r"(?:create\s+|destroy\s+)?(?:participant|actor)\s+\S+\s+as\s+(.+)$", line, re.I)
        if participant:
            labels.append(participant.group(1).strip())
            continue
        if ":" in line:
            before, value = line.split(":", 1)
            if (re.search(r"-{1,2}(?:>>|>|x|\))", before)
                    or before.lower().startswith("note ")):
                labels.append(value.strip())
                continue
        control = re.match(r"(?:loop|alt|else|opt|par(?:\s+and)?|critical(?:\s+option)?|break)\s+(.+)$", line, re.I)
        if control:
            labels.append(control.group(1).strip())
    return [_decode_mermaid_entities(label) for label in labels if label]


def checked_sequence_labels(value, source):
    """Bind every curated sequence label to text visible in the inert SVG."""
    value = checked_svg(value)
    source = prepare_mermaid(source)
    if source.splitlines()[0].strip() != "sequenceDiagram":
        return value
    root = ET.fromstring(value)
    visible = ["".join(node.itertext()).replace("\u200b", "")
               for node in root.iter("{http://www.w3.org/2000/svg}text")]
    for label in _sequence_labels(source):
        parts = [part for part in re.split(r"<br\s*/?>", label, flags=re.I) if part]
        preserved = (label in visible if len(parts) == 1 else
                     all(any(part in rendered for rendered in visible) for part in parts))
        if not preserved:
            raise ValueError("rendered sequence diagram lost or changed label text: " + label[:120])
    return value

def checked_svg(value):
    # Chromium expands local marker URLs to its temporary document URL.
    # Restore fragment-only references before validating the standalone SVG.
    value = value.replace("file:///out/index.html#", "#")
    if re.search(r"<\?|<!DOCTYPE|<!ENTITY", value, re.I):
        raise ValueError("SVG processing instructions and declarations are not admitted")
    root = ET.fromstring(value)
    if root.tag != "{http://www.w3.org/2000/svg}svg":
        raise ValueError("renderer did not produce SVG")
    styles = []
    allowed = {"svg", "g", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon",
               "text", "tspan", "defs", "marker", "style", "title", "desc", "clippath", "mask",
               "pattern", "lineargradient", "radialgradient", "stop", "symbol", "a",
               "filter", "fedropshadow"}
    for node in root.iter():
        if not node.tag.startswith("{http://www.w3.org/2000/svg}") or node.tag.split("}")[-1].lower() not in allowed:
            raise ValueError("active or unsupported SVG element")
        if node.tag.split("}")[-1].lower() == "style":
            styles.append(node.text or "")
        if node.tag.split("}")[-1].lower() in {"script", "foreignobject", "iframe", "image", "use"}:
            raise ValueError("active or externally referenced SVG element")
        for key, val in node.attrib.items():
            styles.append(val)
            name = key.split("}")[-1].lower()
            if name.startswith("on") or (name in {"href", "src"} and not val.startswith("#")):
                raise ValueError("active or external SVG attribute")
    style_text = "\n".join(styles)
    if "\\" in style_text or re.search(r"@import|@font-face|expression\s*\(", style_text, re.I) or any(
        not target.strip().strip("\"'").startswith("#")
        for target in re.findall(r"url\((.*?)\)", style_text, re.I)
    ):
        raise ValueError("external SVG stylesheet reference")
    return value
