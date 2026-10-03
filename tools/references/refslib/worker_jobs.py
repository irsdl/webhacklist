"""Native conversion jobs executed only inside the source worker.

No writable host mounts. Files live in the capped /tmp tmpfs and only bounded
JSON/bytes results leave the worker. This module never executes source commands.
"""
from pathlib import Path
import os
import re
import stat
import subprocess

from . import toolbox

MAX_BYTES = 64 * 1024 * 1024


def read_result(path, limit=MAX_BYTES):
    descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    info = os.fstat(descriptor)
    if not stat.S_ISREG(info.st_mode) or info.st_size > limit:
        os.close(descriptor)
        raise ValueError("invalid or oversized conversion output")
    with os.fdopen(descriptor, "rb") as handle:
        data = handle.read(limit + 1)
        if len(data) > limit:
            raise ValueError("conversion output limit")
        return data


def run(arguments, timeout=90, required=True):
    result = subprocess.run(arguments, capture_output=True, timeout=timeout)
    if len(result.stdout) > MAX_BYTES or len(result.stderr) > MAX_BYTES:
        raise ValueError("conversion stream limit")
    if required and result.returncode:
        raise toolbox.Unavailable("native conversion failed: " + arguments[0])
    return result


def curl_bytes(url, insecure=False):
    arguments = ["curl"] + list(toolbox.CURL_ARGS)
    arguments += ["--proto", "=http,https", "--proto-redir", "=http,https"]
    if insecure:
        arguments.append("--insecure")
    result = run(arguments + [url])
    if not result.stdout:
        raise toolbox.Unavailable("curl returned no bytes")
    return result.stdout


def xuanwu_year(year, commit, handles):
    """Fetch and verify only one year's Xuanwu daily-news HTML blobs."""
    import hashlib
    import io
    import json
    from urllib.parse import quote
    import zipfile

    from .fetcher import Fetcher
    from . import social

    if not isinstance(year, int) or not 2000 <= year <= 2100 \
            or not isinstance(commit, str) or not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("invalid Xuanwu year request")
    fetcher = Fetcher(timeout=60, per_host_gap=0.0, max_redirects=3)
    api = ("https://api.github.com/repos/XuanwuLab/XuanwuLab.github.io/git/trees/"
           + commit + "?recursive=1")
    response = fetcher.get(api, max_bytes=16 * 1024 * 1024)
    if response.status != 200:
        raise ValueError("Xuanwu Git tree request failed")
    tree = json.loads(response.body.decode("utf-8", "strict"))
    if not isinstance(tree, dict) or tree.get("truncated"):
        raise ValueError("Xuanwu Git tree is unavailable or truncated")
    pattern = re.compile(r"^cn/secnews/%d/\d{2}/\d{2}/index\.html$" % year)
    selected = []
    total = 0
    for row in tree.get("tree", []):
        if not isinstance(row, dict) or row.get("type") != "blob" \
                or not pattern.fullmatch(str(row.get("path", ""))):
            continue
        size = row.get("size")
        sha = row.get("sha")
        if not isinstance(size, int) or not 0 <= size <= 4 * 1024 * 1024 \
                or not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{40}", sha):
            raise ValueError("invalid Xuanwu page identity")
        total += size
        if total > 64 * 1024 * 1024 or len(selected) >= 400:
            raise ValueError("Xuanwu year exceeds bounded selection")
        selected.append((row["path"], sha, size))
    if not selected:
        raise ValueError("Xuanwu year has no daily pages")

    payload = io.BytesIO()
    with zipfile.ZipFile(payload, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path, sha, size in sorted(selected):
            url = ("https://raw.githubusercontent.com/XuanwuLab/"
                   "XuanwuLab.github.io/%s/%s" % (commit, quote(path, safe="/")))
            page = fetcher.get(url, max_bytes=4 * 1024 * 1024)
            if page.status != 200 or len(page.body) != size:
                raise ValueError("Xuanwu page fetch did not match the tree")
            actual = hashlib.sha1(
                b"blob " + str(len(page.body)).encode("ascii") + b"\0" + page.body).hexdigest()
            if actual != sha:
                raise ValueError("Xuanwu page failed Git blob verification")
            archive.writestr("XuanwuLab.github.io-pinned/" + path, page.body)
    posts = social.xuanwu_posts(payload.getvalue(), year, handles)
    return {"page_count": len(selected), "posts": posts}


def print_pdf(markup):
    Path("/tmp/document.html").write_text(markup, encoding="utf-8")
    run(["chromium-browser"] + list(toolbox.BROWSER_PDF_ARGS) + [
        "--user-data-dir=/tmp/browser-profile", "--print-to-pdf=/tmp/document.pdf",
        "file:///tmp/document.html"], timeout=150)
    result = read_result("/tmp/document.pdf")
    if not result.startswith(b"%PDF-"):
        raise ValueError("browser did not produce a PDF")
    return result


def pdf_info(data, text=True):
    Path("/tmp/source.pdf").write_bytes(data)
    info = run(["pdfinfo", "/tmp/source.pdf"])
    match = re.search(rb"^Pages:\s+(\d+)", info.stdout, re.M)
    count = int(match.group(1)) if match else 0
    if not text:
        return count
    result = run(["pdftotext", "-layout", "-enc", "UTF-8", "/tmp/source.pdf", "-"])
    return count, result.stdout.decode("utf-8", "replace")


def pdf_text(data):
    from . import extract_doc
    _, text = pdf_info(data)
    if not text.strip():
        raise toolbox.Unavailable("pdftotext produced no text")
    return extract_doc.repair_lost_words(text)[0]


def pdf_images(data, first, last):
    if type(first) is not int or type(last) is not int or not 1 <= first <= last <= 500 or last - first >= 5:
        raise ValueError("PDF images require a bounded range of at most five pages")
    Path("/tmp/source.pdf").write_bytes(data)
    run(["pdftoppm"] + list(toolbox.PDFTOPPM_ARGS) + [
        "-f", str(first), "-l", str(last), "/tmp/source.pdf", "/tmp/page"])
    found = []
    for path in sorted(Path("/tmp").glob("page-*.png")):
        match = re.fullmatch(r"page-(\d+)\.png", path.name)
        if not match or not first <= int(match.group(1)) <= last:
            raise ValueError("unexpected rendered page identity")
        data = read_result(path, 20 * 1024 * 1024)
        if not data.startswith(b"\x89PNG\r\n\x1a\n"):
            raise ValueError("renderer did not produce PNG bytes")
        found.append((int(match.group(1)), data))
    if len(found) != last - first + 1:
        raise toolbox.Unavailable("PDF image range is incomplete")
    return found


def captions(urls):
    if len(urls) > 100:
        raise ValueError("caption batch limit")
    Path("/tmp/captions").mkdir()
    arguments = ["yt-dlp"] + ["/tmp/captions" if arg == "/out" else arg for arg in toolbox.YT_DLP_ARGS]
    run(arguments + urls, timeout=840, required=False)
    # The legacy collector is now called only in the disposable worker.
    return toolbox._collect(urls, "/tmp/captions")


def waymore(domains, limit_requests=50):
    if len(domains) > 100 or any(not re.fullmatch(r"[a-z0-9.-]+", d) for d in domains):
        raise ValueError("invalid domain batch")
    Path("/tmp/targets.txt").write_text("\n".join(domains) + "\n", encoding="ascii")
    os.environ["HOME"] = "/tmp"
    try:
        run(["waymore", "-i", "/tmp/targets.txt", "-mode", "U", "--providers", "commoncrawl,otx,urlscan",
             "-lcc", "5", "-r", "0", "-oU", "/tmp/urls.txt", "-ow", "-lr", str(limit_requests)],
            timeout=840, required=False)
    except subprocess.TimeoutExpired:
        pass
    body = read_result("/tmp/urls.txt", 8 * 1024 * 1024).decode("utf-8", "replace")
    return sorted(set(line.strip() for line in body.splitlines() if line.strip().startswith(("https://", "http://"))))
