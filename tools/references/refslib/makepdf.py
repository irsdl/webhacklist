"""Turn an archived Markdown file into a self-contained HTML document, and hand
it to the headless browser to print as a PDF.

The `pdf` command exists so a reference can be read or shared as one file. It
prints OUR archived Markdown, not the third-party page: the conversion is
offline and deterministic, it carries the same attribution block the Markdown
does, and nothing here reaches the network. A source that is ALREADY a PDF is
copied rather than re-rendered, so its own typesetting is kept.

The Markdown these files use is small and regular - it is what `render.py` emits
and what the extractors produce - so this is a compact block converter rather
than a full CommonMark implementation. Anything it does not recognise degrades
to a paragraph of escaped text, which is safe: the worst case is plain text, not
broken markup, and never a network fetch. An image is printed only from a copy
the archive re-encoded and stored (`images.py`), embedded as a `data:` URI;
without one it degrades to a labelled link. Either way printing cannot pull a
remote asset.
"""

import hashlib
import html as html_module
import re

from . import highlight

# THE CONVERTER'S OWN VERSION, recorded on every PDF it prints. A fix in here
# changes what the document SHOULD look like without touching the Markdown it
# came from, so nothing downstream can tell that the published file is out of
# date - and 12% of the link annotations in this archive pointed at a
# double-escaped URL for exactly that long. Raise it whenever a change alters
# the output, and `pdf --stale` reprints what it affects.
#
# 1: the original converter.
# 2: link targets escaped once instead of twice; `javascript:` and `data:`
#    targets printed as text; preserved figures embedded; figures kept whole
#    across page breaks; a heading over MAX_HEADING_CHARS printed as a paragraph.
#
# 3: fenced listings coloured by `highlight.py`, and the print stylesheet given
#    token colours chosen for print on white and for colour blindness.
# 4: long code lines wrap instead of being clipped behind printed scrollbars.
#
# THE HEADING CAP DID NOT EARN A VERSION OF ITS OWN, and the reasoning is worth
# keeping: a bump reprints every rendered document, each comes out byte-different
# because the printer stamps it, and that is ~300MB of history. It was worth it
# for 3, which changes almost every document that carries code; it was not worth
# it for 30 lines across 13 documents, which were reprinted by name instead.
# Bump for a change that alters output BROADLY; name the documents otherwise.
# 5: fixed-width tables wrap long cell values instead of extending beyond the
#    printable page and clipping their final columns.
RENDERER = 5

# A print stylesheet, inlined so the document owes nothing to the network. A4
# with comfortable margins; the browser's `preferCSSPageSize` honours the @page.
STYLE = """
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 11pt; line-height: 1.5; color: #1b1b1b; margin: 0;
  word-wrap: break-word; overflow-wrap: break-word;
}
h1 { font-size: 20pt; line-height: 1.25; margin: 0 0 .4em; }
h2 { font-size: 15pt; margin: 1.4em 0 .4em; border-bottom: 1px solid #ddd; padding-bottom: .15em; }
h3 { font-size: 13pt; margin: 1.2em 0 .35em; }
h4, h5, h6 { font-size: 11.5pt; margin: 1em 0 .3em; }
p { margin: .5em 0; }
a { color: #0b5cad; text-decoration: none; word-break: break-all; }
ul, ol { margin: .5em 0 .5em 1.4em; padding: 0; }
li { margin: .2em 0; }
blockquote {
  margin: .6em 0; padding: .3em .9em; border-left: 3px solid #cfcfcf;
  color: #444; background: #fafafa;
}
code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 9.5pt; background: #f2f2f2; padding: .08em .3em; border-radius: 3px;
}
pre {
  background: #f6f8fa; border: 1px solid #e3e3e3; border-radius: 5px;
  padding: .7em .9em; white-space: pre-wrap; overflow-wrap: anywhere;
  page-break-inside: avoid;
}
pre code { background: none; padding: 0; font-size: 9pt; line-height: 1.4; }
/* SYNTAX COLOUR, from `highlight.py`. The source articles colour their listings
   and the archive printed every one as undifferentiated grey, which is the
   difference between reading a request and staring at it. Chosen for print on
   white and for the common kinds of colour blindness: the hues are blue, teal
   and brown rather than red and green, and each is dark enough to survive a
   greyscale printer as its own tone. */
pre .c { color: #64757f; font-style: italic; }   /* comment */
pre .s { color: #9a4b16; }                       /* string */
pre .n { color: #0a6b74; }                       /* number */
pre .k { color: #1a4fa0; font-weight: 600; }     /* keyword */
pre .t { color: #1a4fa0; }                       /* markup tag */
pre .a { color: #6b3fa0; }                       /* attribute name */
pre .h { color: #0a6b74; font-weight: 600; }     /* HTTP header name */
table { border-collapse: collapse; table-layout: fixed; margin: .7em 0; width: 100%; font-size: 10pt; }
th, td { border: 1px solid #ccc; padding: .35em .55em; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
th { background: #f2f2f2; }
hr { border: none; border-top: 1px solid #ddd; margin: 1.2em 0; }
/* A figure that straddles a page break is drawn twice, once clipped on each
   page: 26 preserved images came out as 50 draws. Keeping each one whole reads
   better and prints smaller. */
img { display: block; max-width: 100%; margin: .8em auto; page-break-inside: avoid; }
.src-note { color: #666; font-size: 9pt; margin-top: 2em; border-top: 1px solid #eee; padding-top: .6em; }
"""

_FENCE = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
_ATX = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
_HR = re.compile(r"^\s*([-*_])(?:\s*\1){2,}\s*$")
_UL = re.compile(r"^(\s*)[-*+]\s+(.*)$")
_OL = re.compile(r"^(\s*)\d+[.)]\s+(.*)$")
_TABLE_SEP = re.compile(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$")
_BLOCKQUOTE = re.compile(r"^\s*>\s?(.*)$")

# A HEADING THE LENGTH OF AN ARTICLE IS NOT A HEADING; the reader applies the
# same cap in `website/app.js`. Measured over 13,865 archived headings the median
# is 24 characters and the 99th percentile is 206, so anything past this is a
# paragraph that lost its line break upstream - 30 lines across 13 documents.
MAX_HEADING_CHARS = 300


def _is_heading(line):
    """The heading match, or None when the line is too long to be one.

    ONE FUNCTION, because two places need the same answer: the main loop, which
    decides what to emit, and `_is_block_start`, which decides where a paragraph
    ends. When only the loop was capped they disagreed and the converter looped
    for ever on the first document it met.
    """
    if len(line) > MAX_HEADING_CHARS:
        return None
    return _ATX.match(line)

# Inline constructs. Order matters: code spans are pulled out first and masked so
# nothing inside them is treated as markup.
_CODE_SPAN = re.compile(r"`([^`]+)`")
_IMAGE = re.compile(r"!\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)")
_LINK = re.compile(r"\[([^\]]+)\]\(\s*([^)\s]+)[^)]*\)")
_BOLD = re.compile(r"(\*\*|__)(?=\S)(.+?)(?<=\S)\1")
_ITALIC = re.compile(r"(?<![\*_\w])([*_])(?=\S)(.+?)(?<=\S)\1(?![\*_\w])")

# WHERE A PRINTED LINK IS ALLOWED TO POINT. The corpus is XSS research, so a
# `javascript:` or `data:` URL in a document is ordinary content here - and a
# converter that copies one into an `<a href>` turns the payload into something
# a reader can activate from the archive's own file. Extraction already empties
# those targets upstream; this is the sink, and the sink checks for itself.
# Everything else keeps its text and loses only the ability to be clicked.
_SAFE_TARGET = re.compile(r"^(?:https?:|mailto:)", re.IGNORECASE)


def _link_html(label, target):
    """A printed link, or plain text when the target is not one we will follow.

    ESCAPED ONCE, FROM THE RAW URL. `_inline` hands this text that has already
    been through `html.escape`, so escaping the target again turned every `&` in
    a query string into `&amp;amp;` - and a reader following that link asked for
    `?a=1&amp;b=2`. Unescape first, check the scheme on what the URL actually
    says, and escape that once for the attribute.
    """
    url = html_module.unescape(target or "").strip()
    if not _SAFE_TARGET.match(url):
        return label
    return '<a href="%s">%s</a>' % (html_module.escape(url, quote=True), label)


def _image_html(alt, target, image_source):
    """The picture itself when the archive holds a preserved copy of it.

    NEVER THE REMOTE URL. `image_source` returns a `data:` URI built from bytes
    the archive re-encoded and stored, so printing stays offline: a renderer that
    fetched the publisher's copy would put the archive's own PDFs at the mercy of
    a host that may be gone, and would leak a request per figure.

    Without a preserved copy this degrades to what it always was - a labelled
    link - so a document whose pictures could not be kept still says where each
    one belonged.
    """
    url = html_module.unescape(target or "").strip()
    embedded = image_source(url) if image_source else ""
    if embedded:
        return '<img src="%s" alt="%s">' % (html_module.escape(embedded, quote=True),
                                            alt or "")
    return _link_html("[image: %s]" % (alt or "image"), target)


def strip_frontmatter(text):
    """Drop a leading YAML frontmatter block; the PDF shows the body only."""
    if text.startswith("---\n") or text.startswith("---\r\n"):
        end = text.find("\n---", 3)
        if end != -1:
            rest = text[end + 4:]
            return rest.lstrip("\r\n")
    return text


def _inline(text, image_source=None):
    """Escape a run of prose and apply inline Markdown to it."""
    spans = []

    def stash(match):
        spans.append("<code>%s</code>" % html_module.escape(match.group(1)))
        return "\x00%d\x00" % (len(spans) - 1)

    masked = _CODE_SPAN.sub(stash, text)
    masked = html_module.escape(masked)
    # Images first, because the syntax is a superset of a link's.
    masked = _IMAGE.sub(lambda m: _image_html(m.group(1), m.group(2), image_source),
                        masked)
    masked = _LINK.sub(lambda m: _link_html(m.group(1), m.group(2)), masked)
    masked = _BOLD.sub(lambda m: "<strong>%s</strong>" % m.group(2), masked)
    masked = _ITALIC.sub(lambda m: "<em>%s</em>" % m.group(2), masked)
    return re.sub(r"\x00(\d+)\x00", lambda m: spans[int(m.group(1))], masked)


def _list_item_html(items, image_source=None):
    return "".join("<li>%s</li>" % _inline(item, image_source) for item in items)


def markdown_to_html_body(md_text, image_source=None):
    """The Markdown body converted to an HTML fragment."""
    lines = strip_frontmatter(md_text).replace("\r\n", "\n").split("\n")
    out = []
    index = 0
    total = len(lines)
    while index < total:
        line = lines[index]

        # Fenced code block.
        opening = _FENCE.match(line)
        if opening:
            fence = opening.group(1)
            # The fence's own label, which is the only hint about the language.
            language = opening.group(2).strip()
            body = []
            index += 1
            closing = re.compile(r"^\s*" + re.escape(fence[0]) + r"{%d,}\s*$" % len(fence))
            while index < total and not closing.match(lines[index]):
                body.append(lines[index])
                index += 1
            index += 1  # consume the closing fence (or run off the end)
            # A reviewed Mermaid diagram has an inert, hash-bound local SVG.
            # Unknown diagrams keep their literal source, like any other code.
            if language == "mermaid" and image_source:
                digest = hashlib.sha256("\n".join(body).strip().encode("utf-8")).hexdigest()
                diagram = image_source("mermaid:" + digest)
                if diagram:
                    out.append('<figure><img src="%s" alt="Diagram reconstructed from the preserved source"></figure>'
                               % html_module.escape(diagram, quote=True))
                    continue
            # Coloured by `highlight.py`, which is lossless by construction and
            # escapes as it goes: strip its spans and the escaped listing comes
            # back byte for byte.
            out.append("<pre><code>%s</code></pre>"
                       % highlight.to_html("\n".join(body), language))
            continue

        if not line.strip():
            index += 1
            continue

        heading = _is_heading(line)
        if heading:
            level = len(heading.group(1))
            out.append("<h%d>%s</h%d>" % (level, _inline(heading.group(2), image_source), level))
            index += 1
            continue

        if _HR.match(line):
            out.append("<hr>")
            index += 1
            continue

        # Table: a header row followed by a separator row.
        if "|" in line and index + 1 < total and _TABLE_SEP.match(lines[index + 1]):
            header = _split_row(line)
            index += 2
            rows = []
            while index < total and "|" in lines[index] and lines[index].strip():
                rows.append(_split_row(lines[index]))
                index += 1
            out.append(_table_html(header, rows, image_source))
            continue

        # Blockquote: consecutive `>` lines.
        if _BLOCKQUOTE.match(line):
            quote = []
            while index < total and _BLOCKQUOTE.match(lines[index]):
                quote.append(_BLOCKQUOTE.match(lines[index]).group(1))
                index += 1
            out.append("<blockquote>%s</blockquote>"
                       % _inline(" ".join(part for part in quote if part).strip()
                                 or " ", image_source))
            continue

        # Lists: consecutive bullet or numbered lines. Nesting by indent, in
        # steps of two spaces, one level deep - enough for these documents.
        if _UL.match(line) or _OL.match(line):
            index, block = _consume_list(lines, index, total, image_source)
            out.append(block)
            continue

        # Paragraph: gather until a blank line or a block starter.
        para = []
        while index < total and lines[index].strip() and not _is_block_start(lines, index):
            para.append(_demoted(lines[index]).strip())
            index += 1
        out.append("<p>%s</p>" % _inline(" ".join(para), image_source))
    return "\n".join(out)


def _demoted(line):
    """A line whose `#` markers are no longer doing anything, without them.

    Only an over-long heading reaches the paragraph branch, and printing
    `## ` in front of the prose is worse than printing the prose.
    """
    if len(line) > MAX_HEADING_CHARS and _ATX.match(line):
        return re.sub(r"^#{1,6}\s*", "", line)
    return line


def _is_block_start(lines, index):
    """Whether this line opens a block, as the MAIN LOOP would treat it.

    THE TWO MUST AGREE OR THE CONVERTER SPINS. This is the paragraph gatherer's
    stop condition, so a line that looks like a block start here and is consumed
    by no branch there advances `index` nowhere: the heading cap was added to the
    loop and not to this test, and the first document with a 323-character
    heading hung the whole PDF run with no output and no error.
    """
    line = lines[index]
    if _is_heading(line) or _FENCE.match(line) or _HR.match(line) \
            or _UL.match(line) or _OL.match(line) or _BLOCKQUOTE.match(line):
        return True
    return "|" in line and index + 1 < len(lines) and _TABLE_SEP.match(lines[index + 1])


def _consume_list(lines, index, total, image_source=None):
    """One list block, supporting a single level of indented nesting."""
    def indent_of(match):
        return len(match.group(1).replace("\t", "  "))

    first = _UL.match(lines[index]) or _OL.match(lines[index])
    base_indent = indent_of(first)
    ordered = bool(_OL.match(lines[index]))
    items = []          # each item: (text, nested_html or "")
    while index < total:
        match = _UL.match(lines[index]) or _OL.match(lines[index])
        if not match:
            break
        if indent_of(match) < base_indent:
            break
        if indent_of(match) > base_indent:
            # Nested list under the previous item.
            index, nested = _consume_list(lines, index, total, image_source)
            if items:
                items[-1] = (items[-1][0], items[-1][1] + nested)
            continue
        items.append((match.group(2), ""))
        index += 1
    tag = "ol" if ordered else "ul"
    body = "".join("<li>%s%s</li>" % (_inline(text, image_source), nested)
                   for text, nested in items)
    return index, "<%s>%s</%s>" % (tag, body, tag)


def _split_row(line):
    cells = line.strip().strip("|").split("|")
    return [cell.strip() for cell in cells]


def _table_html(header, rows, image_source=None):
    head = "".join("<th>%s</th>" % _inline(cell, image_source) for cell in header)
    body = []
    for row in rows:
        # Pad or trim to the header width so a ragged row still renders.
        cells = (row + [""] * len(header))[:len(header)]
        body.append("<tr>%s</tr>"
                    % "".join("<td>%s</td>" % _inline(cell, image_source) for cell in cells))
    return "<table><thead><tr>%s</tr></thead><tbody>%s</tbody></table>" \
        % (head, "".join(body))


def markdown_to_html(md_text, title="", source_url="", image_source=None):
    """A complete, self-contained HTML document for one archived Markdown file."""
    body = markdown_to_html_body(md_text, image_source)
    note = ""
    if source_url:
        note = ('<p class="src-note">Archived from '
                '<a href="%s">%s</a>. Rendered offline from the local Markdown copy.</p>'
                % (html_module.escape(source_url, quote=True),
                   html_module.escape(source_url)))
    return ("<!doctype html><html><head><meta charset=\"utf-8\">"
            "<title>%s</title><style>%s</style></head><body>%s%s</body></html>"
            % (html_module.escape(title or "Reference"), STYLE, body, note))


def is_pdf_bytes(data):
    """True when these bytes are a PDF, so the original is copied not re-rendered."""
    return bool(data) and data[:5] == b"%PDF-"
