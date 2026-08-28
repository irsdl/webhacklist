"""Preserve the pictures an archived article was written around.

A screenshot of the vulnerable response, a diagram of the desync, a slide: for a
lot of these write-ups the picture IS the finding, and the archive kept none of
them. The Markdown hotlinks the publisher's copy - which works until the host
blocks hotlinking or goes away - and the rendered PDF carried no images at all,
only `[image: alt]` where each one belonged.

WHAT IS STORED IS NEVER WHAT WAS FETCHED. Every image is decoded to a pixel
buffer and re-encoded into a new file, and the fetched bytes are dropped on the
floor:

* EXIF, ICC profiles, XMP, comments and every other ancillary chunk are gone,
  because nothing but pixels is carried across;
* a polyglot - a PDF, a ZIP or a script appended to a valid JPEG - does not
  survive being decoded and written back out;
* least-significant-bit steganography does not survive a lossy re-encode;
* SVG is never stored at all. It is a script host, and rasterising one means
  running it.

That is also why re-encoding is not negotiable for the sake of a smaller diff:
the archive is exploit research, and its readers are agents.

SIZE IS A DESIGN CONSTRAINT, not an afterthought. Images are embedded in the
PDFs the archive renders itself and are NOT published as files in the
repository, which already carries 800MB of documents. They are held in the
content store, out of the repository, and baked into the one artefact that
cannot go and fetch them later.
"""

import io
import re

# A4 with the archive's margins is 178mm of content, which is about 1,050 pixels
# at print resolution. Anything wider is detail no reader of the PDF can see.
MAX_SIDE = 1100

# Lossy, and deliberately: it is the re-encode that destroys anything hidden in
# the low bits. Measured on this corpus, 72 keeps terminal screenshots and
# architecture diagrams legible at print size.
QUALITY = 72

# JPEG, NOT WEBP, AND THE REASON IS THE PRINTER. The headless browser embeds a
# JPEG in the PDF as it stands, and re-encodes anything else losslessly: the
# same 26 preserved figures came to 700KB as WebP and printed a 5.3MB PDF, and
# as JPEG they print a fraction of that. WebP is the better format everywhere
# except inside the one artefact these are made for.
FORMAT = "JPEG"
MEDIA_TYPE = "image/jpeg"

# BELOW THIS IS FURNITURE. An avatar, a share button, a badge, a tracking pixel
# and a spacer are all small; a screenshot of a request never is.
MIN_WIDTH = 200
MIN_HEIGHT = 150

# Refuse before decoding. A 64MB "image" is not one.
MAX_SOURCE_BYTES = 24 * 1024 * 1024

# What one document may carry into its PDF. A slide host serves one image per
# slide and the biggest deck here has 180 of them.
MAX_IMAGES_PER_DOCUMENT = 60
MAX_EMBEDDED_BYTES = 12 * 1024 * 1024

_IMAGE_LINK = re.compile(r"!\[[^\]]*\]\(([^)\s]+?)(?:\s+\"[^\"]*\")?\)")

# Hosts and shapes that are never the research. Gravatar alone accounts for 652
# image references in this archive, every one a comment avatar.
FURNITURE_URL = re.compile(
    r"gravatar\.com/avatar|/avatars?/|\bspacer\b|\bpixel\.gif\b"
    r"|badge|/emoji/|/icons?/|share-button", re.IGNORECASE)


class Unusable(Exception):
    """This image is not one we will keep, with the reason a human needs."""


def urls_in(markdown):
    """Every image target in a document, in order, once each, furniture removed.

    Targets come back EXACTLY as the document writes them, relative ones
    included. That is deliberate: the PDF converter looks a preserved picture up
    by the target it finds in the text, so rewriting the key here would hide the
    copy from the renderer. `resolve` turns a target into something fetchable.
    """
    seen = []
    for url in _IMAGE_LINK.findall(markdown or ""):
        if url.lower().startswith("data:"):
            continue
        if FURNITURE_URL.search(url):
            continue
        if url not in seen:
            seen.append(url)
    return seen


def resolve(target, base):
    """The absolute URL to FETCH for `target`, or "" when there is nothing to try.

    A page written to live at one address may point at its own pictures
    relatively - `Figure/overview.png` in a README, `/thumbnail.jpg` at a site
    root. Those are the research's figures, and discovery used to require
    `http`, so they were invisible: the reference archived with the picture
    simply absent and nothing recorded to say why.

    Resolution never invents a host. Without a base, or when joining does not
    produce an http(s) URL, this returns "" and the caller records the reason.
    """
    target = (target or "").strip()
    if target.lower().startswith(("http://", "https://")):
        return target
    if not target or not base:
        return ""
    from urllib.parse import urljoin
    joined = urljoin(base, target)
    return joined if joined.lower().startswith(("http://", "https://")) else ""


def sanitise(data, max_side=MAX_SIDE, quality=QUALITY):
    """(image bytes, width, height) built from nothing but this image's pixels.

    Raises `Unusable` for anything that is not a decodable raster we want. The
    caller records the reason; a picture the archive cannot keep is a fact about
    the reference, not an error to swallow.
    """
    if not data:
        raise Unusable("empty response")
    if len(data) > MAX_SOURCE_BYTES:
        raise Unusable("%d bytes is larger than an image needs to be" % len(data))
    if data.lstrip()[:64].lower().startswith((b"<?xml", b"<svg")):
        raise Unusable("SVG is a script host and is never rasterised")

    try:
        from PIL import Image
    except ImportError:                                   # pragma: no cover
        raise Unusable("Pillow is not installed")

    try:
        with Image.open(io.BytesIO(data)) as opened:
            opened.load()                                 # decode now, inside the guard
            frame = _flatten(opened)
    except Exception as error:                            # a bomb, a truncation, a fake
        raise Unusable("%s: %s" % (type(error).__name__, str(error)[:80]))

    width, height = frame.size
    if width < MIN_WIDTH or height < MIN_HEIGHT:
        raise Unusable("%dx%d is furniture rather than a figure" % (width, height))

    if max(width, height) > max_side:
        scale = max_side / float(max(width, height))
        frame = frame.resize((max(1, int(width * scale)), max(1, int(height * scale))),
                             _resample())

    # A NEW IMAGE, not the decoded one. Pillow carries `info` - EXIF, ICC, XMP -
    # from the source through `convert` and `resize`, and the writers copy some
    # of it into the output. Building an empty image and putting only the pixel
    # data into it means there is nothing left to copy.
    from PIL import Image
    clean = Image.new("RGB", frame.size)
    clean.putdata(list(frame.getdata()))

    buffer = io.BytesIO()
    clean.save(buffer, format=FORMAT, quality=quality, optimize=True,
               progressive=False)
    return buffer.getvalue(), clean.size[0], clean.size[1]


def _flatten(opened):
    """An RGB frame with any transparency composited onto WHITE.

    `convert("RGB")` composites onto BLACK, which is the wrong page colour and
    was the wrong answer: a diagram drawn as dark strokes on a transparent
    background - which is how most tools export one - came out as black on black
    and the reader could see nothing at all. The archive prints onto white paper,
    so white is what "no pixel here" means.
    """
    from PIL import Image

    transparent = (opened.mode in ("RGBA", "LA", "PA")
                   or (opened.mode == "P" and "transparency" in opened.info))
    if not transparent:
        return opened.convert("RGB")
    rgba = opened.convert("RGBA")
    canvas = Image.new("RGB", rgba.size, (255, 255, 255))
    canvas.paste(rgba, mask=rgba.getchannel("A"))
    return canvas


def _resample():
    from PIL import Image
    return getattr(Image, "Resampling", Image).LANCZOS


def data_uri(body):
    """The embeddable form. Offline by construction: the PDF renderer must never
    reach the network while printing an archived document."""
    import base64
    return "data:%s;base64,%s" % (MEDIA_TYPE,
                                  base64.b64encode(body).decode("ascii"))
