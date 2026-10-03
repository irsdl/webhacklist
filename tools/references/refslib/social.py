"""Bounded normalisation for social-source discovery payloads.

These helpers run through :mod:`refslib.isolation`; API responses are untrusted
source bytes and are never parsed by the host controller.
"""

from datetime import datetime, timezone
from html import unescape
import ipaddress
import io
import json
import posixpath
import re
from urllib.parse import urlsplit
import zipfile


_ID = re.compile(r"[a-z0-9]{1,16}")
_MAX_ROWS = 2000
_WEB_TERMS = re.compile(
    r"(?:\bweb(?:site|app|hook|socket|view|server)?s?\b|\bhttp(?:/2)?\b|"
    r"\bbrowser\b|\bchrome\b|\bchromium\b|\bfirefox\b|\bsafari\b|\bedge\b|"
    r"\bxss\b|cross.?site|\bcsrf\b|\bssrf\b|\bcors\b|\bcsp\b|content.security.policy|"
    r"\bcookie\b|\bsession\b|\boauth\b|\boidc\b|\bsaml\b|\bjwt\b|\bapi\b|"
    r"graphql|websocket|cache.poison|cache.deception|reverse.proxy|\bcdn\b|"
    r"url.parser|uri.parser|subdomain|domain.takeover|dns.rebind|template.injection|ssti|"
    r"deseriali[sz]|sql.injection|command.injection|path.traversal|file.upload|webshell|"
    r"\bphp\b|\brails\b|node\.?(?:js)?|django|wordpress|apache|nginx|tomcat|asp\.net|"
    r"electron|browser.extension|service.worker|same.origin|postmessage|host.header|"
    r"open.redirect|account.takeover|bug.bounty|\bwaf\b|\bxxe\b|xml.external|"
    r"json.hijack|prototype.pollution|dom.xss|mime.sniff|content.type|clickjack|"
    r"request.smuggl|http.desync|header.injection|crlf|password.reset|authentication)",
    re.I,
)


def reddit_posts(payload, start_epoch, end_epoch):
    """Return validated discovery fields from one Arctic Shift response."""
    if not isinstance(payload, bytes):
        raise ValueError("reddit payload must be bytes")
    if not isinstance(start_epoch, int) or not isinstance(end_epoch, int) \
            or start_epoch >= end_epoch:
        raise ValueError("invalid reddit date bounds")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("data") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > _MAX_ROWS:
        raise ValueError("invalid reddit response rows")

    result = []
    for wrapped in rows:
        row = wrapped.get("data", wrapped) if isinstance(wrapped, dict) else None
        if not isinstance(row, dict):
            raise ValueError("invalid reddit response row")
        identifier = row.get("id")
        created = row.get("created_utc")
        title = row.get("title")
        url = row.get("url")
        if not isinstance(identifier, str) or not _ID.fullmatch(identifier):
            raise ValueError("invalid reddit post id")
        if not isinstance(created, (int, float)):
            raise ValueError("invalid reddit created_utc")
        created = int(created)
        if not start_epoch <= created < end_epoch:
            raise ValueError("reddit post outside requested interval")
        if not isinstance(title, str) or not title.strip() or len(title) > 2000:
            raise ValueError("invalid reddit title")
        if not isinstance(url, str) or len(url) > 8000:
            raise ValueError("invalid reddit url")
        if url:
            parsed = urlsplit(url)
            if parsed.scheme not in ("http", "https") or not parsed.hostname \
                    or parsed.username or parsed.password:
                raise ValueError("unsafe reddit target url")
            try:
                address = ipaddress.ip_address(parsed.hostname)
            except ValueError:
                pass
            else:
                if not address.is_global:
                    raise ValueError("unsafe reddit target url")
        score = row.get("score", 0)
        comments = row.get("num_comments", 0)
        if not isinstance(score, (int, float)) or not isinstance(comments, (int, float)):
            raise ValueError("invalid reddit counters")
        result.append({
            "id": identifier,
            "created_utc": created,
            "date": datetime.fromtimestamp(created, timezone.utc).strftime(
                "%Y-%m-%dT%H:%M:%SZ"),
            "score": int(score),
            "comments": int(comments),
            "title": " ".join(title.split()),
            "url": url,
            "permalink": "/r/netsec/comments/%s/" % identifier,
        })
    return result


def reddit_month_counts(payload):
    """Return ordered aggregate counts from an Arctic Shift response."""
    if not isinstance(payload, bytes):
        raise ValueError("reddit aggregate payload must be bytes")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("data") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 24:
        raise ValueError("invalid reddit aggregate rows")
    result = []
    for row in rows:
        if not isinstance(row, dict) or not isinstance(row.get("created_utc"), str):
            raise ValueError("invalid reddit aggregate row")
        try:
            count = int(row.get("count"))
        except (TypeError, ValueError) as error:
            raise ValueError("invalid reddit aggregate count") from error
        if count < 0 or count > 1000000:
            raise ValueError("invalid reddit aggregate count")
        result.append({"created_utc": row["created_utc"][:40], "count": count})
    return result


def reddit_candidates(payload, known_urls):
    """Select a deliberately broad web-security review queue from a year file."""
    from . import urls

    if not isinstance(payload, bytes) or not isinstance(known_urls, list) \
            or len(known_urls) > 10000 or not all(isinstance(url, str) for url in known_urls):
        raise ValueError("invalid reddit candidate inputs")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("posts") if isinstance(document, dict) else None
    year = document.get("year") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 20000 or not isinstance(year, int):
        raise ValueError("invalid normalized reddit year")
    known = {urls.normalize(url) for url in known_urls if url}
    selected = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("invalid normalized reddit row")
        required = ("id", "created_utc", "date", "score", "comments", "title", "url", "permalink")
        if any(key not in row for key in required):
            raise ValueError("incomplete normalized reddit row")
        identifier, title, url = row["id"], row["title"], row["url"]
        if not isinstance(identifier, str) or not _ID.fullmatch(identifier) \
                or not isinstance(title, str) or not isinstance(url, str):
            raise ValueError("invalid normalized reddit fields")
        identity = urls.normalize(url)
        if not identity or identity in known:
            continue
        host = (urlsplit(url).hostname or "").lower()
        if host.endswith("reddit.com") or host in ("redd.it", "twitter.com", "x.com"):
            continue
        score, comments = row["score"], row["comments"]
        if not isinstance(score, int) or not isinstance(comments, int):
            raise ValueError("invalid normalized reddit counters")
        parsed = urlsplit(url)
        haystack = title + " " + (parsed.hostname or "") + " " + parsed.path
        if not _WEB_TERMS.search(haystack) and score < 300 and comments < 120:
            continue
        candidate = {key: row[key] for key in required}
        previous = selected.get(identity)
        if previous is None or (score, comments) > (previous["score"], previous["comments"]):
            selected[identity] = candidate
    return sorted(selected.values(), key=lambda row: (
        -row["score"], -row["comments"], row["created_utc"], row["id"]))


def reddit_candidate_page(payload, start=0, limit=100):
    """Return one compact, validated page from a candidate queue.

    The queue remains source-derived and is parsed only in the isolated worker.
    URLs are retained so a reviewer can follow promising leads without another
    bulk dump, while titles and counters are bounded for readable output.
    """
    if not isinstance(payload, bytes) or not isinstance(start, int) \
            or not isinstance(limit, int) or start < 0 or not 1 <= limit <= 200:
        raise ValueError("invalid reddit candidate page inputs")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("candidates") if isinstance(document, dict) else None
    count = document.get("candidate_count") if isinstance(document, dict) else None
    year = document.get("year") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 20000 or count != len(rows) \
            or not isinstance(year, int):
        raise ValueError("invalid reddit candidate queue")

    result = []
    for index, row in enumerate(rows[start:start + limit], start=start):
        if not isinstance(row, dict):
            raise ValueError("invalid reddit candidate row")
        identifier = row.get("id")
        date = row.get("date")
        title = row.get("title")
        url = row.get("url")
        score = row.get("score")
        comments = row.get("comments")
        if not isinstance(identifier, str) or not _ID.fullmatch(identifier) \
                or not isinstance(date, str) or len(date) > 40 \
                or not isinstance(title, str) or len(title) > 2000 \
                or not isinstance(url, str) or len(url) > 8000 \
                or not isinstance(score, int) or not isinstance(comments, int):
            raise ValueError("invalid reddit candidate fields")
        parsed = urlsplit(url)
        if parsed.scheme not in ("http", "https") or not parsed.hostname \
                or parsed.username or parsed.password:
            raise ValueError("unsafe reddit candidate url")
        result.append({
            "index": index,
            "id": identifier,
            "date": date[:10],
            "score": score,
            "comments": comments,
            "title": " ".join(title.split()),
            "host": parsed.hostname.lower(),
            "url": url,
        })
    return {"year": year, "total": len(rows), "start": start,
            "next": min(len(rows), start + len(result)), "rows": result}


def reddit_candidate_select(payload, identifiers):
    """Return validated candidate rows for an explicit bounded ID list."""
    if not isinstance(payload, bytes) or not isinstance(identifiers, list) \
            or not 1 <= len(identifiers) <= 100 \
            or not all(isinstance(value, str) and _ID.fullmatch(value)
                       for value in identifiers):
        raise ValueError("invalid reddit candidate selection")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("candidates") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 20000:
        raise ValueError("invalid reddit candidate queue")
    wanted = set(identifiers)
    found = []
    for row in rows:
        if not isinstance(row, dict) or row.get("id") not in wanted:
            continue
        identifier = row.get("id")
        date = row.get("date")
        title = row.get("title")
        url = row.get("url")
        score = row.get("score")
        comments = row.get("comments")
        if not isinstance(date, str) or len(date) > 40 \
                or not isinstance(title, str) or len(title) > 2000 \
                or not isinstance(url, str) or len(url) > 8000 \
                or not isinstance(score, int) or not isinstance(comments, int):
            raise ValueError("invalid reddit candidate fields")
        parsed = urlsplit(url)
        if parsed.scheme not in ("http", "https") or not parsed.hostname \
                or parsed.username or parsed.password:
            raise ValueError("unsafe reddit candidate url")
        found.append({"id": identifier, "date": date[:10], "score": score,
                      "comments": comments, "title": " ".join(title.split()),
                      "url": url})
    found.sort(key=lambda row: identifiers.index(row["id"]))
    return {"requested": len(identifiers), "found": len(found), "rows": found}


def _html_text(fragment):
    text = re.sub(r"(?is)<(?:script|style)\b.*?</(?:script|style)>", " ", fragment)
    text = re.sub(r"(?s)<[^>]*>", " ", text)
    return " ".join(unescape(text).split())


def xuanwu_posts(payload, year, handles):
    """Extract selected authors' posts from a pinned Xuanwu daily-news ZIP.

    Xuanwu Lab's historical pages embed the original tweet text and expanded
    destination links. The ZIP is treated as hostile: members are bounded,
    path-normalized, read in memory, and never extracted to a filesystem.
    """
    if not isinstance(payload, bytes) or len(payload) > 80 * 1024 * 1024 \
            or not isinstance(year, int) or not 2000 <= year <= 2100 \
            or not isinstance(handles, list) or not 1 <= len(handles) <= 10:
        raise ValueError("invalid Xuanwu archive inputs")
    wanted = set()
    for handle in handles:
        if not isinstance(handle, str) or not re.fullmatch(r"@[A-Za-z0-9_]{1,30}", handle):
            raise ValueError("invalid Xuanwu author handle")
        wanted.add(handle.lower())

    prefix = re.compile(
        r"^[^/]+/cn/secnews/%d/(?P<month>\d{2})/(?P<day>\d{2})/index\.html$" % year)
    author_re = re.compile(
        r"(?is)<div\s+id=[\"']singleweiboauthor[\"'][^>]*>(.*?)</div>")
    text_re = re.compile(
        r"(?is)<div\s+class=[\"']singleweibotext[\"'][^>]*>(.*)")
    translated_re = re.compile(r"(?is)<div\s+class=[\"']translated[\"']")
    href_re = re.compile(r"(?is)<a\b[^>]*\bhref=[\"']([^\"']+)[\"']")
    posts = []
    total_size = 0
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        members = archive.infolist()
        if len(members) > 30000:
            raise ValueError("Xuanwu archive has too many members")
        for member in members:
            name = member.filename.replace("\\", "/")
            if posixpath.normpath(name) != name.rstrip("/") or name.startswith("/") \
                    or ".." in name.split("/") or member.file_size > 4 * 1024 * 1024:
                raise ValueError("unsafe Xuanwu archive member")
            total_size += member.file_size
            if total_size > 256 * 1024 * 1024:
                raise ValueError("Xuanwu archive is too large")
            match = prefix.match(name)
            if not match:
                continue
            raw = archive.read(member)
            if len(raw) != member.file_size or b"\0" in raw:
                raise ValueError("invalid Xuanwu page")
            page = raw.decode("utf-8", "strict")
            date = "%04d-%s-%s" % (year, match.group("month"), match.group("day"))
            for segment in page.split('<div id="singleweibo">')[1:]:
                author_match = author_re.search(segment)
                body_match = text_re.search(segment)
                if not author_match or not body_match:
                    continue
                author = _html_text(author_match.group(1))
                handles_found = {value.lower() for value in re.findall(
                    r"@[A-Za-z0-9_]{1,30}", author)}
                if not handles_found.intersection(wanted):
                    continue
                body = body_match.group(1)
                translated = translated_re.search(body)
                if translated:
                    body = body[:translated.start()]
                text = _html_text(body)
                links = []
                for escaped in href_re.findall(body):
                    url = unescape(escaped).strip()
                    parsed = urlsplit(url)
                    if parsed.scheme not in ("http", "https") or not parsed.hostname \
                            or parsed.username or parsed.password:
                        continue
                    if parsed.hostname.lower() in ("t.co", "twitter.com", "x.com"):
                        continue
                    if url not in links:
                        links.append(url)
                posts.append({"date": date, "author": author[:200], "text": text[:4000],
                              "urls": links[:20], "source_page": name})
    return sorted(posts, key=lambda row: (row["date"], row["author"], row["text"]))


def xuanwu_candidates(payload, known_urls):
    """Select unseen web-security links from a normalized Xuanwu account file."""
    from . import urls

    if not isinstance(payload, bytes) or not isinstance(known_urls, list) \
            or len(known_urls) > 10000 or not all(isinstance(url, str) for url in known_urls):
        raise ValueError("invalid Xuanwu candidate inputs")
    document = json.loads(payload.decode("utf-8", "strict"))
    rows = document.get("posts") if isinstance(document, dict) else None
    count = document.get("post_count") if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 20000 or count != len(rows):
        raise ValueError("invalid normalized Xuanwu file")
    known = {urls.normalize(url) for url in known_urls if url}
    selected = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("invalid normalized Xuanwu row")
        date, author, text, links = (row.get("date"), row.get("author"),
                                     row.get("text"), row.get("urls"))
        if not isinstance(date, str) or len(date) > 40 \
                or not isinstance(author, str) or len(author) > 200 \
                or not isinstance(text, str) or len(text) > 4000 \
                or not isinstance(links, list) or len(links) > 20 \
                or not all(isinstance(url, str) for url in links):
            raise ValueError("invalid normalized Xuanwu fields")
        keep_account = "@albinowax" in author.lower()
        for url in links:
            identity = urls.normalize(url)
            parsed = urlsplit(url)
            if not identity or identity in known or parsed.scheme not in ("http", "https") \
                    or not parsed.hostname or parsed.username or parsed.password:
                continue
            prose = re.sub(r"https?://\S+", " ", text, flags=re.I)
            haystack = prose + " " + parsed.hostname + " " + parsed.path
            if not keep_account and not _WEB_TERMS.search(haystack):
                continue
            selected.setdefault(identity, {
                "date": date[:10], "author": author, "text": text,
                "url": url, "host": parsed.hostname.lower(),
            })
    return sorted(selected.values(), key=lambda row: (
        row["date"], row["author"].lower(), row["url"]))


def xuanwu_stats(payload, candidates=False):
    """Count bounded normalized Xuanwu rows by embedded account handle."""
    if not isinstance(payload, bytes) or not isinstance(candidates, bool):
        raise ValueError("invalid Xuanwu stats inputs")
    document = json.loads(payload.decode("utf-8", "strict"))
    key = "candidates" if candidates else "posts"
    rows = document.get(key) if isinstance(document, dict) else None
    if not isinstance(rows, list) or len(rows) > 20000:
        raise ValueError("invalid normalized Xuanwu rows")
    counts = {}
    for row in rows:
        author = row.get("author") if isinstance(row, dict) else None
        if not isinstance(author, str) or len(author) > 200:
            raise ValueError("invalid normalized Xuanwu author")
        handles = sorted(set(value.lower() for value in re.findall(
            r"@[A-Za-z0-9_]{1,30}", author)))
        if not handles:
            handles = ["(no handle)"]
        for handle in handles:
            counts[handle] = counts.get(handle, 0) + 1
    return {"kind": key, "total": len(rows), "authors": counts}
