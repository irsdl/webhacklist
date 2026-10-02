"""Bounded JSON jobs for untrusted source parsing, with no host fallback.

The CLI installs these guards before handling any command. The underlying
library functions remain independently testable with trusted fixtures. A worker
gets a copy of trusted Python modules and one input file, both read-only; it
never gets the checkout, archive store, home, credentials or Docker socket.
JSON is a data protocol, never pickle, executable source or a requested path.
"""

import base64
import functools
import importlib
import json
import os
from pathlib import Path
import shutil
import tempfile

from . import toolbox

LIMIT = 96 * 1024 * 1024
TIMEOUT = 120
OPERATIONS = {
    "htmltext": ("read", "decode"),
    "meta": ("read",),
    "sanitise": ("sanitise_html", "sanitise_text"),
    "extract_html": ("candidates", "embedded_jsfiddle_candidate", "embedded_rsc_candidate"),
    "extract_doc": ("pdf_to_markdown", "pptx_to_markdown", "captions_to_markdown",
                    "declared_pages", "looks_truncated", "unreadable_pages", "text_quality",
                    "repair_lost_words", "repair_ligatures", "font_damage"),
    "images": ("sanitise", "urls_in"),
    "linked_documents": ("discover",),
    "repo": ("to_markdown",),
    "video": ("read_metadata", "caption_track", "json3_to_prose", "timed_text_to_prose"),
    "validate": ("bound", "queue_item", "parse_verdict"),
    "render": ("render", "render_translation"),
    "credential_redaction": ("redact",),
    "fetcher": ("decompress",),
    "svg": ("checked_svg", "find_mermaid", "parse_rendered"),
    "boilerplate": ("trim", "tidy_links", "drop_junk_lines", "drop_dead_links", "cut_at_sales_heading", "cut_at_related_heading"),
    "grade": ("classify", "looks_broken", "looks_like_a_wall", "of"),
}
NATIVE = {"curl_bytes", "print_pdf", "pdf_info", "pdf_text", "pdf_images", "captions", "waymore"}
SPECIAL = {"read_text", "listing_pdf", "repository", "repository_package", "github", "makepdf", "fetch", "curl_get"} | NATIVE
NETWORK = {"repository", "github", "listing_pdf", "fetch", "curl_get", "curl_bytes", "captions", "waymore"}
CLASSES = {
    "extract_html.Candidate": ("name", "markdown", "metrics"),
    "sanitise.Sanitised": ("text", "removed", "markers"),
    "linked_documents.LinkedDocuments": ("primary", "companions"),
    "repo.Material": ("path", "blob", "text", "size"),
    "repo.RepoPackage": ("owner", "name", "commit", "materials", "mirror", "truncated"),
    "fetcher.Response": ("url", "status", "headers", "body", "chain", "error"),
    "grade.Decision": ("outcome", "klass", "reason", "rule", "folder"),
}
ERRORS = {"extract_doc.Unconvertible", "extract_doc.ExternalPdfToolRequired",
          "extract_doc.NoTextLayer", "images.Unusable", "repo.RepoError", "render.MissingAttribution",
          "github.Unavailable", "github.NotGitHub", "toolbox.Unavailable"}
_installed = False


def encode(value):
    if value is None or type(value) in (str, int, float, bool):
        return value
    if isinstance(value, bytes):
        return {"$bytes": base64.b64encode(value).decode("ascii")}
    if isinstance(value, (list, tuple)):
        return {"$tuple": [encode(v) for v in value]} if isinstance(value, tuple) else [encode(v) for v in value]
    if isinstance(value, dict):
        return {"$dict": [[str(k), encode(v)] for k, v in value.items()]}
    name = value.__class__.__module__.split(".")[-1] + "." + value.__class__.__name__
    if name in CLASSES:
        return {"$class": name, "values": [encode(getattr(value, k)) for k in CLASSES[name]]}
    raise TypeError("unsupported worker value: " + type(value).__name__)


def decode(value, depth=0):
    if depth > 80:
        raise ValueError("worker result nesting limit")
    if isinstance(value, list):
        return [decode(v, depth + 1) for v in value]
    if not isinstance(value, dict):
        return value
    if set(value) == {"$bytes"}:
        return base64.b64decode(value["$bytes"], validate=True)
    if set(value) == {"$tuple"}:
        return tuple(decode(v, depth + 1) for v in value["$tuple"])
    if set(value) == {"$dict"}:
        return {k: decode(v, depth + 1) for k, v in value["$dict"] if isinstance(k, str)}
    name = value.get("$class")
    if set(value) == {"$class", "values"} and name in CLASSES:
        module, cls = name.split(".")
        values = value["values"]
        if len(values) != len(CLASSES[name]):
            raise ValueError("invalid worker object fields")
        return getattr(importlib.import_module("refslib." + module), cls)(
            *[decode(v, depth + 1) for v in values])
    raise ValueError("unknown worker result shape")


def allowed(operation):
    return operation in SPECIAL or any(operation == module + "." + name
                                       for module, names in OPERATIONS.items() for name in names)


def call(operation, *args, **kwargs):
    """Invoke a fixed operation; failures stop this conversion, never run locally."""
    if not allowed(operation):
        raise ValueError("operation is not admitted: " + str(operation))
    if operation in ("render.render", "render.render_translation"):
        # The controller supplies trusted configuration as data. The worker
        # cannot discover a checkout or read its vocabulary from the host.
        from . import tags
        kwargs["vocabulary"] = tags.current()
    payload = json.dumps({"operation": operation, "args": encode(args),
                          "kwargs": encode(kwargs)}, ensure_ascii=True).encode()
    if len(payload) > LIMIT:
        raise toolbox.Unavailable("source job exceeds the input limit")
    image = toolbox.ensure_image()
    with tempfile.TemporaryDirectory(prefix="websec_source_job_") as temp:
        root = Path(temp)
        code = root / "code" / "refslib"
        code.mkdir(parents=True)
        # Only trusted implementation modules. No source-provided files,
        # symlinks, configs, agent instructions, tests or adjacent directories.
        for source in Path(__file__).parent.glob("*.py"):
            if source.is_symlink():
                raise toolbox.Unavailable("symlink in trusted worker code")
            shutil.copyfile(source, code / source.name)
        (root / "input.json").write_bytes(payload)
        os.chmod(root, 0o755)
        command = ["docker", "run"] + toolbox.run_args()
        command[command.index("--network") + 1] = "bridge" if operation in NETWORK else "none"
        command += ["--ulimit", "fsize=%d:%d" % (LIMIT, LIMIT),
                    "-v", toolbox._mount(root / "code") + ":/code:ro",
                    "-v", toolbox._mount(root / "input.json") + ":/input.json:ro",
                    "--workdir", "/tmp", image, "python", "-I", "-B", "-c",
                    "import sys; sys.path.insert(0, '/code'); "
                    "from refslib.isolation import worker; worker()"]
        # Bound both Docker attach streams on the host; container file limits
        # alone do not constrain the Docker client's writes on the host.
        with (root / "stdout").open("w+b") as out, (root / "stderr").open("w+b") as err:
            timeout = 900 if operation in ("captions", "waymore") else (180 if operation == "print_pdf" else TIMEOUT)
            done = toolbox._run_container(command, timeout=timeout, stdout=out, stderr=err,
                                          output_limit=LIMIT)
            out.seek(0)
            raw = out.read(LIMIT + 1)
            if done.returncode or len(raw) > LIMIT:
                raise toolbox.Unavailable("isolated source operation failed: " + operation)
        try:
            reply = json.loads(raw)
            if not isinstance(reply, dict):
                raise ValueError("invalid response envelope")
        except (ValueError, TypeError) as error:
            raise toolbox.Unavailable("invalid source worker response") from error
        if set(reply) == {"error", "message"}:
            name = reply["error"]
            if name == "builtins.ValueError" and operation.startswith("svg."):
                raise ValueError(str(reply["message"])[:400])
            if name in ERRORS:
                module, cls = name.split(".")
                raise getattr(importlib.import_module("refslib." + module), cls)(str(reply["message"])[:400])
            raise toolbox.Unavailable("source worker rejected " + operation)
        try:
            if set(reply) != {"result"}:
                raise ValueError("invalid response envelope")
            return decode(reply["result"])
        except (ValueError, TypeError, KeyError) as error:
            raise toolbox.Unavailable("invalid source worker response") from error


def dispatch(operation, args, kwargs):
    if not allowed(operation):
        raise ValueError("unknown operation")
    if operation in NETWORK:
        targets = args[0] if operation == "captions" else (["https://" + d for d in args[0]] if operation == "waymore" else [args[0]])
        for target in targets:
            public_url(target)
        # Every urllib redirect is checked too, inside the credential-free
        # worker. Never hand a file:// URL or private service to the fetcher.
        from .fetcher import Fetcher
        original_one = Fetcher._one
        def public_one(self, url, *rest):
            public_url(url)
            return original_one(self, url, *rest)
        Fetcher._one = public_one
    if operation in NATIVE:
        from . import worker_jobs
        return getattr(worker_jobs, operation)(*args, **kwargs)
    if operation == "read_text":
        data, offset, limit = args
        if not isinstance(data, bytes) or not 0 <= offset <= len(data) or not 1 <= limit <= 100000:
            raise ValueError("invalid reading window")
        text = data.decode("utf-8", "replace")
        if offset > len(text):
            raise ValueError("reading offset exceeds the text length")
        return {"text": text[offset:offset + limit], "characters": len(text),
                "offset": offset, "next_offset": min(len(text), offset + limit)}
    if operation == "listing_pdf":
        from . import browser
        from .browser import Ladder, NO_SANDBOX_ENV
        os.environ[NO_SANDBOX_ENV] = "1"  # outer container is the enforced boundary
        proxy = os.environ.get("WEBSEC_SOURCE_PROXY")
        if not proxy:
            raise ValueError("listing browser requires the public egress broker")
        browser.SAFETY_ARGS += ("--proxy-server=" + proxy, "--proxy-bypass-list=<-loopback>",
                                "--force-webrtc-ip-handling-policy=disable_non_proxied_udp")
        return Ladder(browser="/usr/bin/chromium-browser").render_url_pdf(*args, **kwargs)
    if operation == "repository":
        from . import repo
        return repo.acquire_public(*args, **kwargs)
    if operation == "repository_package":
        from . import repo
        package = decode(json.loads(args[0]))
        if not isinstance(package, repo.RepoPackage) or (package.owner, package.name) != repo.target(args[1])[:2]:
            raise ValueError("stored repository package identity mismatch")
        return package
    if operation == "github":
        from . import github
        from .fetcher import Fetcher
        return github.to_markdown(args[0], Fetcher())
    if operation == "fetch":
        from .fetcher import Fetcher
        options = kwargs.pop("client_options", {})
        return Fetcher(**options).get(*args, **kwargs)
    if operation == "curl_get":
        from .fetcher import curl_get
        return curl_get(*args, **kwargs)
    if operation == "makepdf":
        from . import makepdf
        images = kwargs.pop("image_map", {})
        return makepdf.markdown_to_html(*args, image_source=images.get, **kwargs)
    module, name = operation.split(".")
    return getattr(importlib.import_module("refslib." + module), name)(*args, **kwargs)


def public_url(url):
    """Refuse non-web schemes, credentials, and private addresses before fetch."""
    from urllib.parse import urlsplit
    import ipaddress
    parsed = urlsplit(url)
    if parsed.scheme not in ("https", "http") or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("only credential-free public HTTP(S) sources are allowed")
    if parsed.port not in (None, 80, 443):
        raise ValueError("source URL uses an unapproved port")
    try:
        address = ipaddress.ip_address(parsed.hostname)
    except ValueError:
        # Names are resolved and checked by the separate egress broker. The
        # processing worker has --network none, including no direct DNS.
        return
    if not address.is_global:
        raise ValueError("private or special-use source address")


def worker():
    """Only called by the trusted fixed container command."""
    try:
        request = json.loads(Path("/input.json").read_bytes())
        result = dispatch(request["operation"], decode(request["args"]), decode(request["kwargs"]))
        reply = {"result": encode(result)}
    except Exception as error:
        reply = {"error": error.__class__.__module__.split(".")[-1] + "." + error.__class__.__name__,
                 "message": str(error)[:400]}
    output = json.dumps(reply, ensure_ascii=True)
    if len(output) > LIMIT:
        raise ValueError("worker output limit")
    print(output)


def install():
    """Install production parser guards before the CLI handles source data."""
    global _installed
    if _installed:
        return
    _installed = True
    for module, names in OPERATIONS.items():
        loaded = importlib.import_module("refslib." + module)
        for name in names:
            original = getattr(loaded, name)
            setattr(loaded, name, functools.wraps(original)(functools.partial(call, module + "." + name)))
    from . import makepdf
    from . import github
    github.to_markdown = lambda url, fetcher: call("github", url)
    from . import fetcher
    def get(client, url, extra_headers=None, max_bytes=fetcher.MAX_PROBE_BYTES):
        return call("fetch", url, extra_headers=extra_headers, max_bytes=max_bytes,
                    client_options={"timeout": client.timeout, "per_host_gap": client.per_host_gap,
                                    "max_redirects": client.max_redirects})
    fetcher.Fetcher.get = get
    fetcher.curl_get = functools.partial(call, "curl_get")
    original = makepdf.markdown_to_html

    @functools.wraps(original)
    def print_markup(md_text, title="", source_url="", image_source=None):
        # Callback is trusted host code. It resolves ONLY already preserved
        # images; source workers never receive its filesystem/store capability.
        image_map = {}
        if image_source:
            from . import images, svg
            targets = images.urls_in(md_text)
            import hashlib
            targets += ["mermaid:" + hashlib.sha256(source.encode()).hexdigest()
                        for source in svg.find_mermaid([md_text.encode("utf-8")])]
            image_map = {url: image_source(url) for url in targets}
        return call("makepdf", md_text, title, source_url, image_map=image_map)
    makepdf.markdown_to_html = print_markup
