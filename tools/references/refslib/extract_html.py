"""HTML to Markdown: the document, not the website.

Public research Markdown has to contain the article, not the template. The risk
runs both ways and only one of them is loud:

* keep too much and the file is menus, cookie notices and related-post lists;
* keep too little and the payload listings vanish, which is the exact failure
  this whole archive exists to undo. A site redesign that flattened the code
  blocks is invisible unless something MEASURES that they were there.

So extraction produces three candidates and measures each, rather than trusting
one heuristic:

* `precision` - the innermost `<main>`/`<article>`/`role=main` container.
* `recall`    - the block with the most text after boilerplate removal.
* `raw`       - the whole body, minus obvious chrome.

The caller compares the metrics (characters, headings, code blocks, tables,
figures, links) and sends an unexplained loss to review instead of quietly
picking the shortest output. Nothing here runs JavaScript: `html.parser` is a
tokenizer, and extraction always reads STORED bytes, never a live page.
"""

import html as html_module
import json
import re
from html.parser import HTMLParser

# Structural chrome. Removed before any candidate is measured, so the metrics
# describe the document rather than the furniture around it.
CHROME_TAGS = ("nav", "header", "footer", "aside", "form", "menu", "dialog")

# Class and id fragments that mark chrome on essentially every publishing
# platform. Matched as substrings because the exact names differ per site.
CHROME_HINTS = (
    "nav", "navbar", "menu", "sidebar", "side-bar", "breadcrumb", "footer",
    "header", "masthead", "banner", "cookie", "consent", "gdpr", "newsletter",
    "subscribe", "signup", "share", "social", "related", "recommend", "promo",
    "advert", "advertisement", "sponsor", "popup", "modal", "comment", "disqus",
    "pagination", "widget", "toolbar", "skip-link", "back-to-top",
    # Webflow's form state blocks ("Your subscription could not be saved"),
    # which every page on such a site carries whether or not a form was used.
    "w-form-fail", "w-form-done", "w-condition-invisible",
)

BLOCK_TAGS = ("p", "div", "section", "article", "main", "ul", "ol", "li", "table",
              "tr", "blockquote", "pre", "figure", "figcaption", "br", "hr",
              "h1", "h2", "h3", "h4", "h5", "h6")


# A `<span>` CARRYING AN ATTRIBUTE IS SITE MARKUP, never content. Sites wrap
# inline code in one - `<span class="code_single-line">/guestaccess.aspx</span>`
# appeared 88 times in a single archived article - and it reaches the text
# because the page ESCAPED its own markup, so the parser handed it over as data
# rather than as a tag.
#
# Narrow on purpose. The angle brackets in this corpus are usually a PAYLOAD:
# `<string>` and `<int>` are the document's subject matter and must survive
# untouched. Requiring an attribute is what separates the site's own wrapper
# from an element somebody is quoting.
ATTRIBUTED_SPAN = re.compile(
    r'<span(?:\s+[a-zA-Z-]+\s*=\s*(?:"[^"]*"|\'[^\']*\'))*\s*>|</span\s*>')


class Candidate(object):
    def __init__(self, name, markdown, metrics):
        self.name = name
        self.markdown = markdown
        self.metrics = metrics

    def as_dict(self):
        return {"name": self.name, **self.metrics}


def measure(markdown):
    """The numbers that make a silent loss visible."""
    text = markdown or ""
    return {
        "chars": len(text.strip()),
        "headings": len(re.findall(r"^#{1,6} ", text, re.MULTILINE)),
        "code_blocks": len(re.findall(r"^```", text, re.MULTILINE)) // 2,
        "tables": len(re.findall(r"^\|.*\|$", text, re.MULTILINE)),
        "images": len(re.findall(r"!\[[^\]]*\]\(", text)),
        "links": len(re.findall(r"(?<!!)\[[^\]]*\]\(", text)),
        "words": len(text.split()),
    }


def candidates(markup, base_url=""):
    """Every extraction candidate for one stored document, each measured."""
    root = _parse(markup)
    _strip_chrome(root)

    found = []
    main = _first_main(root)
    if main is not None:
        found.append(_candidate("precision", main, base_url))
    densest = _densest_block(root)
    if densest is not None and densest is not main:
        found.append(_candidate("recall", densest, base_url))
    found.append(_candidate("raw", root, base_url))
    return found


def embedded_jsfiddle_candidate(markup, base_url=""):
    """Recover a fiddle's source panels from its inert editor configuration.

    A public JSFiddle can serve a complete PoC inside ``EditorConfig.value``
    while its visible DOM is only the editor shell.  The ordinary extractor
    correctly drops ``<script>`` elements, so inspect this one declarative data
    object before sanitisation.  JSON decoding is deliberately used instead of
    evaluating JavaScript; source text is returned inside Markdown code fences
    and is never executed.
    """
    if "jsfiddle.net/" not in (base_url or "").lower():
        return None
    match = re.search(
        r'value:\s*\{\s*html:\s*("(?:\\.|[^"\\])*")\s*,'
        r'\s*js:\s*("(?:\\.|[^"\\])*")\s*,'
        r'\s*css:\s*("(?:\\.|[^"\\])*")',
        markup or "", re.DOTALL)
    if not match:
        return None

    def decode(token):
        # Old fiddles escaped HTML entities as ``\&quot;`` inside a JavaScript
        # string.  The backslash is not valid JSON and carries no information;
        # removing only that exact escape keeps decoding data-only and strict.
        return json.loads(token.replace(r"\&", "&"))

    try:
        html_source = html_module.unescape(decode(match.group(1))).strip()
        javascript_source = decode(match.group(2)).strip()
        css_source = decode(match.group(3)).strip()
    except (TypeError, ValueError):
        return None

    title_match = re.search(r"<h1\b[^>]*>(.*?)</h1\s*>", html_source,
                            re.IGNORECASE | re.DOTALL)
    title = re.sub(r"<[^>]+>", "", title_match.group(1)).strip() \
        if title_match else "JSFiddle proof of concept"
    sections = ["# " + title, ""]
    for heading, language, source in (
            ("HTML", "html", html_source),
            ("JavaScript", "javascript", javascript_source),
            ("CSS", "css", css_source)):
        sections.extend(("## " + heading, "", "```" + language,
                         source or "// No panel code.", "```", ""))
    markdown = "\n".join(sections).strip() + "\n"
    return Candidate("embedded-source", markdown, measure(markdown))


# A React Server Components page ships its rendered tree as a run of
# `self.__next_f.push([1,"..."])` string chunks. Concatenated, those chunks are
# the "flight" payload: newline-separated rows, each `<id>:<data>`, where a long
# string is length-prefixed as `<id>:T<hex byte length>,<text>`.
NEXT_FLIGHT_PUSH = re.compile(
    r'self\.__next_f\.push\(\[\s*1\s*,\s*("(?:[^"\\]|\\.)*")\s*\]\)', re.S)
FLIGHT_ROW = re.compile(rb"([0-9a-f]+):")

# The prop a Next.js blog hands its article body in. A reference to another row
# is written "$3b"; anything else is the body inlined.
MARKDOWN_PROP = re.compile(r'"markdownContent"\s*:\s*("(?:[^"\\]|\\.)*")')
ROW_REFERENCE = re.compile(r"^\$([0-9a-f]+)$")

META_DESCRIPTION = re.compile(
    r'<meta\b(?=[^>]*\bname\s*=\s*["\']description["\'])'
    r'[^>]*\bcontent\s*=\s*"([^"]*)"', re.IGNORECASE)


def _flight_rows(markup):
    """Every `<id>:<data>` row of the RSC payload, decoded."""
    parts = []
    for match in NEXT_FLIGHT_PUSH.finditer(markup or ""):
        try:
            parts.append(json.loads(match.group(1)))
        except ValueError:
            continue
    if not parts:
        return {}

    # `T` lengths count UTF-8 BYTES, not characters, so the walk is done over
    # bytes. Slicing by character would drift on any row holding a smart quote
    # and truncate every row after it.
    data = "".join(parts).encode("utf-8")
    rows, index, size = {}, 0, len(data)
    while index < size:
        match = FLIGHT_ROW.match(data, index)
        if not match:
            newline = data.find(b"\n", index)
            if newline < 0:
                break
            index = newline + 1
            continue
        row_id, cursor = match.group(1).decode("ascii"), match.end()
        if cursor < size and data[cursor:cursor + 1] == b"T":
            comma = data.find(b",", cursor)
            if comma < 0:
                break
            try:
                length = int(data[cursor + 1:comma], 16)
            except ValueError:
                index = cursor + 1
                continue
            start = comma + 1
            rows[row_id] = data[start:start + length].decode("utf-8", "replace")
            index = start + length
            if index < size and data[index:index + 1] == b"\n":
                index += 1
        else:
            newline = data.find(b"\n", cursor)
            if newline < 0:
                rows[row_id] = data[cursor:].decode("utf-8", "replace")
                break
            rows[row_id] = data[cursor:newline].decode("utf-8", "replace")
            index = newline + 1
    return rows


def _prose_key(text):
    """Comparable prose: link targets and entities carry no meaning here.

    A description renders `[label](url)` as its label, while the body keeps the
    Markdown, so the two are compared with targets removed.
    """
    plain = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text or "")
    return re.sub(r"\s+", " ", html_module.unescape(plain)).strip()


def embedded_rsc_candidate(markup, base_url=""):
    """Recover an article that ships only inside a Next.js flight payload.

    A React Server Components page serves its prose as data in `<script>`, so a
    tokenizer sees the shell and nothing else. Nineteen of twenty archived
    thespanner.co.uk documents were published this way: a run of navigation
    links to other posts, zero prose paragraphs, and the research gone.

    THE BODY MUST PROVE IT BELONGS TO THIS PAGE. The same payload also carries a
    recent-posts list with other articles' bodies in it, so taking the longest
    prose row would file a neighbouring post under this citation - the exact
    wrong-page capture this archive treats as its most serious fault. The page's
    own `<meta name="description">` is the check: it is generated from the
    article being displayed, so a body that does not open with it is not this
    page's body and nothing is returned.
    """
    rows = _flight_rows(markup)
    if not rows:
        return None
    match = MARKDOWN_PROP.search("".join(rows.values()))
    if not match:
        return None
    try:
        value = json.loads(match.group(1))
    except ValueError:
        return None
    reference = ROW_REFERENCE.match(value)
    body = rows.get(reference.group(1), "") if reference else value
    if not body.strip():
        return None

    # The description is a TRUNCATED opening of the article, so the body has to
    # begin with it rather than equal it.
    described = META_DESCRIPTION.search(markup or "")
    if described:
        wanted = _prose_key(html_module.unescape(described.group(1)))[:60]
        if wanted and not _prose_key(body).startswith(wanted):
            return None

    markdown = body.strip() + "\n"
    return Candidate("embedded-rsc", markdown, measure(markdown))


def _candidate(name, node, base_url):
    markdown = to_markdown(node, base_url)
    return Candidate(name, markdown, measure(markdown))


# ---------------------------------------------------------------------------
# A very small DOM. Enough to find containers and walk them in order.
# ---------------------------------------------------------------------------

VOID = frozenset(("br", "hr", "img", "input", "meta", "link", "source", "col",
                  "area", "base", "embed", "param", "track", "wbr"))


class Node(object):
    def __init__(self, tag="", attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or {})
        self.parent = parent
        self.children = []
        self.text = ""

    def add(self, child):
        self.children.append(child)
        return child

    def walk(self):
        yield self
        for child in self.children:
            for item in child.walk():
                yield item

    def text_length(self):
        total = len(self.text.strip())
        for child in self.children:
            total += child.text_length()
        return total

    def detach(self):
        if self.parent is not None:
            self.parent.children = [c for c in self.parent.children if c is not self]


class _Builder(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.root = Node("root")
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        node = self.current.add(Node(tag, dict(attrs), self.current))
        if tag not in VOID:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.current.add(Node(tag.lower(), dict(attrs), self.current))

    def handle_endtag(self, tag):
        tag = tag.lower()
        node = self.current
        while node is not None and node.tag != tag:
            node = node.parent
        if node is not None and node.parent is not None:
            self.current = node.parent

    def handle_data(self, data):
        # A NEWLINE-ONLY TEXT NODE IS THE LINE STRUCTURE OF A CODE BLOCK. Syntax
        # highlighters emit one `<span class="line">` per line with a bare "\n"
        # between them, and dropping those nodes flattened every such listing
        # onto a single line - 29 files, and it left a `//` comment with no line
        # end, so it appeared to swallow the whole program. Outside a `<pre>` it
        # costs nothing: whitespace there is collapsed anyway.
        if data.strip() or " " in data or "\n" in data:
            child = self.current.add(Node("#text", {}, self.current))
            child.text = data

    def handle_comment(self, data):
        # A COMMENT INSIDE A LISTING IS THE LISTING. Webflow's code widget
        # escapes its contents by wrapping them in an HTML comment -
        # `<pre><code class="language-http"><!--GET / HTTP/1.1 ... --></code></pre>` -
        # so dropping comments, which is right everywhere else, emptied every
        # code block on the page. One 2021 Top 10 article lost all 47 of its
        # request/response listings that way and kept only the prose saying
        # "the following results", above 47 blank boxes.
        #
        # Narrow on purpose: only inside a listing, where a comment cannot be
        # page furniture, an editor's note or a conditional-comment hack. This
        # recovers TEXT; nothing here is ever parsed as markup or executed.
        node = self.current
        while node is not None:
            if node.tag in ("pre", "code"):
                child = self.current.add(Node("#text", {}, self.current))
                child.text = data
                return
            node = node.parent


def _parse(markup):
    builder = _Builder()
    try:
        builder.feed(markup or "")
        builder.close()
    except Exception:
        # A malformed page still has to yield something. Whatever was parsed
        # before the failure is better than nothing, and the metrics will show
        # it is short.
        pass
    return builder.root


def _strip_chrome(root):
    """Remove site furniture, under one rule that applies to every signal.

    THE RULE: no chrome rule may delete the majority of a document. A container
    is only furniture if it is small relative to the page; something holding
    most of the text is the article, whatever it is called.

    This was learned the expensive way. The guard existed for the class/id
    signal and NOT for the tag signal, so a `<header>` was removed
    unconditionally. Several sites wrap the whole article in one - measured on
    assetnote.io, where `<header>` held 35,840 of the page's 38,993 characters -
    and extraction returned the newsletter box and the related-posts list. Five
    references were queued for review before the cause was found, and the loss
    guard in `acquire` is the only reason they were not published gutted.

    A tag name and a class name are both just evidence, so both go through the
    same test now.
    """
    limit = max(400, root.text_length() // 3)
    for node in list(root.walk()):
        if node.tag in CHROME_TAGS:
            if node.text_length() < limit:
                node.detach()
            continue
        marker = (str(node.attrs.get("class", "")) + " " +
                  str(node.attrs.get("id", "")) + " " +
                  str(node.attrs.get("role", ""))).lower()
        # dasBlog calls the container holding the ARTICLE and its discussion
        # ``commentViewContent``. Treating the substring ``comment`` as a
        # comment-section signal detached the whole post in every archived
        # Aviv Raff page. Keep that legacy content wrapper; its nested
        # ``ItemText`` block is selected precisely below.
        marker = marker.replace("commentviewcontent", "")
        if marker.strip() and any(hint in marker for hint in CHROME_HINTS):
            if node.text_length() < limit:
                node.detach()


def _first_main(root):
    for node in root.walk():
        if node.tag in ("main", "article"):
            return node
        if str(node.attrs.get("role", "")).lower() == "main":
            return node
        marker = (str(node.attrs.get("class", "")) + " " + str(node.attrs.get("id", ""))).lower()
        if re.search(r"\b(post-content|entry-content|article-body|articlebody|content-body|itemtext)\b", marker):
            return node
    return None


def _densest_block(root):
    best = None
    best_length = 0
    for node in root.walk():
        if node.tag not in ("div", "section", "article", "main", "body"):
            continue
        length = node.text_length()
        if length > best_length:
            best, best_length = node, length
    return best


# ---------------------------------------------------------------------------
# Markdown rendering
# ---------------------------------------------------------------------------

def _quote_block(text):
    """Mark every line of a quoted passage, leaving code listings alone.

    A FENCE IS NOT QUOTED, deliberately. `makepdf` builds a blockquote from
    consecutive `>` lines and joins them with spaces, so quoting a listing would
    flatten it onto one line - the flowing damage that loses a payload's
    indentation. Leaving the fence unmarked keeps the listing a listing in the
    PDF, and the prose around it - the part where attribution matters - still
    carries the marker. Four of the ninety quotes in the affected documents
    contain a listing; the other eighty-six are quoted throughout.
    """
    body = (text or "").strip("\n")
    if not body.strip():
        return ""
    lines, fenced, out = body.split("\n"), False, []
    for line in lines:
        if line.lstrip().startswith("```"):
            fenced = not fenced
            out.append(line)
            continue
        if fenced:
            out.append(line)
        elif line.strip():
            out.append("> " + line)
        elif out and out[-1] != ">":
            # One blank marker between paragraphs. A <p> child emits its own
            # blank lines, so without this a two-paragraph quote publishes three
            # empty `>` rows between the halves.
            out.append(">")
    while out and out[-1] == ">":
        out.pop()
    return "\n".join(out)


def to_markdown(node, base_url=""):
    out = []
    _render(node, out, base_url, [])
    text = "".join(out)
    # ENTITIES ARE HTML, NOT CONTENT. `&quot;`, `&lt;` and the numeric forms a
    # site uses to defang a URL (`&#46;` for a dot, `&#58;` for a colon) were
    # written into the archive verbatim - 67 pairs of `&lt;`/`&gt;` in one
    # advisory - so a reader saw the markup instead of the code being quoted.
    # One pass, deliberately: `&amp;lt;` becomes `&lt;` and stops there.
    text = html_module.unescape(text)
    text = ATTRIBUTED_SPAN.sub("", text)
    # ONE NEWLINE CONVENTION. A carriage return means nothing in Markdown, and
    # a page that carries CRLF in its text - a forum post, a pasted listing -
    # otherwise publishes a file with mixed endings against the repository's
    # eol=lf. It surfaced only when the handler rule stopped eating `\r` as
    # part of its own match: one repaired document came back with three.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


# WHAT MAKES A TEXT NODE MARKDOWN RATHER THAN PROSE. Block markers at the start
# of a line, more than one of them, in a node that has line structure at all.
# Deliberately strict: a single `#` or `-` at a line start is a sentence that
# happened to wrap, and treating that as Markdown would put paragraph breaks
# through ordinary articles.
_MARKDOWN_BLOCK = re.compile(r"^(?:#{1,6} |```|[-*+] |\d+\. |> )", re.MULTILINE)
_MIN_MARKDOWN_MARKERS = 3


def _is_markdown_source(text):
    body = text or ""
    if "\n" not in body:
        return False
    return len(_MARKDOWN_BLOCK.findall(body)) >= _MIN_MARKDOWN_MARKERS


def _render(node, out, base_url, stack):
    tag = node.tag

    if tag == "#text":
        if "pre" in stack:
            out.append(node.text)
        elif _is_markdown_source(node.text):
            # A TEXT NODE THAT IS ALREADY A MARKDOWN DOCUMENT. matanber.com
            # renders its article with JavaScript and leaves the article's own
            # Markdown SOURCE in a hidden element, which is then the only copy a
            # fetch can see. Collapsing its newlines the way HTML requires turned
            # a whole 18,847-character write-up into one line beginning `# `, so
            # the reader rendered the entire article as a single heading.
            #
            # Only the line structure is kept, and only when the text carries
            # Markdown block markers of its own: an ordinary paragraph whose
            # source happens to be soft-wrapped has none, and still collapses.
            text = re.sub(r"[ \t]+", " ", node.text)
            out.append(re.sub(r"\n{3,}", "\n\n", text))
        else:
            out.append(re.sub(r"\s+", " ", node.text))
        return

    if tag in ("script", "style", "noscript", "template", "svg", "canvas"):
        return

    if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        out.append("\n\n" + "#" * int(tag[1]) + " ")
        _children(node, out, base_url, stack)
        out.append("\n\n")
        return

    if tag == "pre":
        language = _code_language(node)
        out.append("\n\n```" + language + "\n")
        _children(node, out, base_url, stack + ["pre"])
        out.append("\n```\n\n")
        return

    if tag == "code" and "pre" not in stack:
        # Some publishers use <code> with explicit <br> elements instead of
        # <pre>. Inline backticks flatten those listings and collide with
        # template literals in JavaScript examples. Preserve the displayed
        # line breaks and quote the listing as a block, without interpreting
        # its markup or executing it. Source-only soft wraps remain inline.
        if any(child.tag == "br" for child in node.walk()):
            source = "".join(child.text if child.tag == "#text" else
                             "\n" if child.tag == "br" else ""
                             for child in node.walk())
            ticks = max((len(match.group()) for match in re.finditer(r"`+", source)),
                        default=0)
            fence = "`" * max(3, ticks + 1)
            out.append("\n\n" + fence + _code_language(node) + "\n" + source
                       + "\n" + fence + "\n\n")
            return
        out.append("`")
        _children(node, out, base_url, stack)
        out.append("`")
        return

    if tag in ("strong", "b"):
        out.append("**")
        _children(node, out, base_url, stack)
        out.append("**")
        return

    if tag in ("em", "i"):
        out.append("*")
        _children(node, out, base_url, stack)
        out.append("*")
        return

    if tag == "a":
        href = _absolute(node.attrs.get("href", ""), base_url)
        # AN ANCHOR WITH NOWHERE TO GO IS NOT A LINK. `_absolute` empties the
        # target of a same-page fragment, a `javascript:` handler and an anchor
        # with no href at all - a table of contents, a footnote arrow, a
        # collapsible section's toggle - and writing `[label]()` for those put
        # 6,132 dead links across 425 archived files. They render as literal
        # brackets in the reader, and 1,886 of them had no label either, so they
        # rendered as `[]()`. The label is the only part that was ever content.
        if not href:
            _children(node, out, base_url, stack)
            return
        out.append("[")
        _children(node, out, base_url, stack)
        out.append("](%s)" % href)
        return

    if tag == "img":
        source = _absolute(node.attrs.get("src", ""), base_url)
        alt = (node.attrs.get("alt") or "").strip()
        if source:
            out.append("![%s](%s)" % (alt, source))
        return

    if tag == "li":
        out.append("\n- ")
        _children(node, out, base_url, stack)
        return

    if tag == "blockquote":
        # EVERY LINE, not just the first. A quote whose children are blocks - a
        # <blockquote> holding two <p>s, which is the ordinary shape - emitted
        # one `>` and then let the rest of the passage run on unquoted. The
        # marker was left stranded on its own line and the quoted material read
        # as the archived author's own words: a passage quoted from another
        # researcher, published under the wrong name.
        inner = []
        _children(node, inner, base_url, stack)
        quoted = _quote_block("".join(inner))
        if quoted:
            out.append("\n\n" + quoted + "\n\n")
        return

    if tag == "br":
        out.append("\n")
        return

    if tag == "hr":
        out.append("\n\n---\n\n")
        return

    if tag == "tr":
        out.append("\n| ")
        _children(node, out, base_url, stack)
        out.append(" |")
        return

    if tag in ("td", "th"):
        _children(node, out, base_url, stack)
        out.append(" | ")
        return

    if tag == "figcaption":
        out.append("\n\n*")
        _children(node, out, base_url, stack)
        out.append("*\n\n")
        return

    if tag in BLOCK_TAGS or tag in ("root", "body", "html", "figure"):
        out.append("\n\n")
        _children(node, out, base_url, stack)
        out.append("\n\n")
        return

    _children(node, out, base_url, stack)


def _children(node, out, base_url, stack):
    for child in node.children:
        _render(child, out, base_url, stack)


def _code_language(node):
    for candidate in node.walk():
        marker = str(candidate.attrs.get("class", "")).lower()
        match = re.search(r"(?:language|lang|brush:?)[-_ ]([a-z0-9#+]+)", marker)
        if match:
            return match.group(1)
    return ""


def _absolute(href, base_url):
    href = (href or "").strip()
    if not href or href.startswith(("#", "javascript:", "data:")):
        return ""
    if not base_url or re.match(r"^[a-z][a-z0-9+.-]*:", href, re.IGNORECASE):
        return href
    from urllib.parse import urljoin
    return urljoin(base_url, href)
