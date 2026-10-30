#!/usr/bin/env python3
"""Render archived Mermaid fences to inert SVGs in the isolated PDF toolbox.

Pass --bundle with Mermaid 11.16.0's dist/mermaid.min.js. The pinned bundle is
checked before execution; the container has no network or repository mount.
Only exact source matches are advertised to the static site's Markdown reader.
HTML entities, Mermaid configuration, and unescaped grammar characters are
rejected; author comments/directives are removed from the render input.
"""
import argparse
import hashlib
import html
import json
import re
import shutil
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

from refslib import toolbox, isolation

BUNDLE_SHA = "74d7c46dabca328c2294733910a8aa1ed0c37451776e8d5295da38a2b758fb9b"
ROOT = Path(__file__).resolve().parents[2]
FENCE = re.compile(r"^```mermaid\s*\n(.*?)^```\s*$", re.M | re.S)


def checked_svg(value, source=None):
    from refslib import isolation
    operation = "svg.checked_sequence_labels" if source is not None else "svg.checked_svg"
    arguments = (value, source) if source is not None else (value,)
    return isolation.call(operation, *arguments)


def render(sources, bundle):
    with tempfile.TemporaryDirectory(prefix="websec_diagrams_") as folder:
        scratch = Path(folder)
        shutil.copyfile(bundle, scratch / "mermaid.js")
        data = json.dumps(sources).replace("<", "\\u003c")
        page = '''<!doctype html><meta charset="utf-8"><script src="mermaid.js"></script>
<textarea id="result"></textarea><script>
mermaid.initialize({startOnLoad:false,securityLevel:'strict',htmlLabels:false,
 deterministicIds:true, maxTextSize:50000,maxEdges:500,
 flowchart:{htmlLabels:false},theme:'default'});
(async()=>{const output=[];for(const [id,source] of SOURCES){
 try {const result=await mermaid.render('diagram'+id,source);output.push([id,result.svg]);}
 catch(error){output.push([id,null,String(error)]);}}
 document.getElementById('result').textContent=JSON.stringify(output);})();</script>'''.replace("SOURCES", data)
        (scratch / "index.html").write_text(page)
        args = toolbox.run_args()
        args[args.index("--network") + 1] = "none"
        command = ["docker", "run"] + args + ["-v", toolbox._mount(folder) + ":/out:ro", toolbox.IMAGE, "chromium-browser"]
        command += list(toolbox.CHROMIUM_ARGS) + ["--user-data-dir=/tmp/chromium", "--virtual-time-budget=20000", "file:///out/index.html"]
        done = toolbox._run_container(command, timeout=90)
        if done.returncode:
            raise RuntimeError("diagram container failed")
        expected = {row[0]: row[1] for row in sources}
        expected_ids = set(expected)
        rows = isolation.call("svg.parse_rendered", done.stdout, expected)
        # The worker's response is untrusted too. Validate controller-held IDs
        # again before any of them can become a host output filename.
        if not isinstance(rows, list) or any(not isinstance(row, list) or len(row) not in (2, 3)
                or not isinstance(row[0], str) or not re.fullmatch(r"[a-f0-9]{64}", row[0])
                or row[0] not in expected for row in rows):
            raise ValueError("unexpected diagram output identity")
        if len(rows) != len(expected_ids) or {row[0] for row in rows} != expected_ids:
            raise ValueError("missing or duplicate diagram output")
        return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    args = parser.parse_args()
    if hashlib.sha256(args.bundle.read_bytes()).hexdigest() != BUNDLE_SHA:
        raise ValueError("unexpected Mermaid bundle bytes")
    archive = ROOT / "archived-references"
    manifest = json.loads((archive / "manifest.json").read_text())
    sources, source_errors = {}, []
    batch, batch_paths, batch_bytes = [], [], 0
    def collect():
        for document_index, source, prepared, issue in isolation.call("svg.find_mermaid_records", batch):
            if type(document_index) is not int or not 0 <= document_index < len(batch_paths):
                raise ValueError("invalid diagram document identity")
            if not isinstance(source, str) or not isinstance(prepared, str) or not isinstance(issue, str):
                raise ValueError("invalid diagram source result")
            if issue:
                source_errors.append({"file": batch_paths[document_index],
                                      "sha256": hashlib.sha256(source.encode()).hexdigest(),
                                      "error": issue})
                continue
            sources[hashlib.sha256(source.encode()).hexdigest()] = {
                "source": source,
                "prepared": prepared,
            }
        batch.clear()
        batch_paths.clear()
    for entry in manifest["urls"].values():
        filename = entry.get("steps", {}).get("render", {}).get("file")
        if not filename:
            continue
        path = ROOT / filename
        if path.is_symlink() or not path.resolve().is_relative_to((archive / "md").resolve()):
            raise ValueError("invalid archived diagram source path")
        if not path.is_file():
            continue
        with path.open("rb") as handle:
            data = handle.read(4 * 1024 * 1024 + 1)
        if len(data) > 4 * 1024 * 1024:
            raise ValueError("diagram source exceeds the 4 MiB bound")
        batch.append(data)
        batch_paths.append(filename)
        batch_bytes += len(data)
        if batch_bytes >= 8 * 1024 * 1024:
            collect()
            batch_bytes = 0
    if batch:
        collect()
    if source_errors:
        print(json.dumps(source_errors, indent=2))
        raise SystemExit("unsafe Mermaid source; repair the labels before rendering")
    output = archive / "diagrams"
    output.mkdir(exist_ok=True)
    old_index = json.loads((archive / "diagram-assets.json").read_text())
    old_render_hashes = {
        Path(row["path"]).stem: row.get("render_source_sha256")
        for row in old_index.get("diagrams", [])
        if isinstance(row, dict) and isinstance(row.get("path"), str)
    }
    renderer_changed = (old_index.get("renderer") != "Mermaid 11.16.0" or
                        old_index.get("bundle_sha256") != BUNDLE_SHA)
    pending = []
    for digest, record in sorted(sources.items()):
        render_hash = hashlib.sha256(record["prepared"].encode()).hexdigest()
        path = output / (digest + ".svg")
        if (not path.is_file() or renderer_changed or
                old_render_hashes.get(digest) != render_hash):
            pending.append((digest, record["prepared"]))
    toolbox.ensure_image()
    errors = []
    for start in range(0, len(pending), 12):
        for row in render(pending[start:start + 12], args.bundle):
            digest, svg = row[:2]
            if svg is None:
                errors.append({"sha256": digest, "error": str(row[2])[:200]})
                continue
            (output / (digest + ".svg")).write_text(checked_svg(svg, sources[digest]["prepared"]) + "\n")
        print("rendered batch", start // 12 + 1, flush=True)
    if errors:
        print(json.dumps(errors, indent=2))
        raise SystemExit("invalid Mermaid diagrams; file the capture gap and review the source in isolation")
    records = []
    for digest, record in sorted(sources.items()):
        path = output / (digest + ".svg")
        checked_svg(path.read_text(), record["prepared"])
        records.append({
            "source": record["source"],
            "render_source_sha256": hashlib.sha256(record["prepared"].encode()).hexdigest(),
            "path": path.relative_to(ROOT).as_posix(),
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        })
    index = {"schema": 2, "renderer": "Mermaid 11.16.0", "bundle_sha256": BUNDLE_SHA, "diagrams": records}
    (archive / "diagram-assets.json").write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    print("Published", len(records), "inert SVG diagrams")


if __name__ == "__main__":
    main()
