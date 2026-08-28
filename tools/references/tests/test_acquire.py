"""Acquisition: candidate choice, the loss guard, and the media policy."""

from . import support  # noqa: F401

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from refslib import acquire, extract_html, toolbox
from refslib.fetcher import Response
from refslib.store import Store

CONFIG = {"media_policy": {"store_binaries": False,
                           "binary_kinds": ["whitepaper", "slides", "video", "image"]}}

PAGE = ("<html><head><title>Request Smuggling</title>"
        '<meta property="og:site_name" content="Example Labs">'
        '<meta property="article:published_time" content="2019-08-23T10:00:00Z">'
        '<meta name="author" content="Alex Example"></head><body>'
        "<nav>menu</nav><main><h1>Request Smuggling</h1><p>" + ("prose " * 200) + "</p>"
        "<pre><code>curl -H 'Transfer-Encoding: chunked' https://target.example/"
        "</code></pre></main>"
        "<footer>copyright</footer></body></html>")


# A tiny but real PDF: one Flate-compressed content stream showing one string.
def _minimal_pdf():
    import zlib
    stream = zlib.compress(b"BT /F1 12 Tf (Desynchronising a keep-alive stream.) Tj ET")
    header = (b"%PDF-1.4\n1 0 obj\n<< /Length " + str(len(stream)).encode("ascii")
              + b" /Filter /FlateDecode >>\nstream\n")
    return header + stream + b"\nendstream\nendobj\n%%EOF"


MINIMAL_PDF = _minimal_pdf()


class FakeFetcher(object):
    def __init__(self, body=None, status=200):
        self.body = body if body is not None else PAGE.encode("utf-8")
        self.status = status
        self.calls = []

    def get(self, url, extra_headers=None, max_bytes=None):
        self.calls.append(url)
        return Response(url, self.status, {"Content-Type": "text/html"}, self.body, [])


class TestWaybackProvenance(unittest.TestCase):
    def test_stored_wayback_bytes_use_the_original_not_a_stale_redirect(self):
        entry = {"steps": {"wayback": {"result": "stored"}}}
        health = {"final_url": "https://www.hugedomains.com/domain_profile.cfm"}
        self.assertEqual("https://i8jesus.com/?p=10", acquire._stored_final_url(
            "https://i8jesus.com/?p=10", entry, health))

    def test_snapshot_provenance_survives_a_later_failed_wayback_lookup(self):
        entry = {"steps": {"wayback": {"result": "lookup-failed"}}}
        health = {"final_url": "https://www.hugedomains.com/domain_profile.cfm",
                  "snapshot": "20080129053412"}
        self.assertEqual("https://i8jesus.com/?p=10", acquire._stored_final_url(
            "https://i8jesus.com/?p=10", entry, health))

    def test_ordinary_stored_bytes_keep_the_health_final_url(self):
        self.assertEqual("https://example.org/current", acquire._stored_final_url(
            "https://example.org/old", {}, {"final_url": "https://example.org/current"}))


class TestDocumentHeading(unittest.TestCase):
    """What heading, if any, is written INSIDE an extracted document."""

    def test_a_stated_title_heads_the_document(self):
        self.assertEqual(
            acquire.document_heading("Melting the Flesh of PHP's Memory Hardening",
                                     "Melting the Flesh of PHP's Memory Hardening"),
            "Melting the Flesh of PHP's Memory Hardening")

    def test_a_citation_that_only_names_the_format_heads_nothing(self):
        """"[Paper]" leaves the URL's file stem as the title, and writing that
        into the body published `# usenixsecurity26 wu yifan` above the paper.
        No later re-render touches a body heading, so it is never written."""
        self.assertEqual(acquire.document_heading("Paper", "usenixsecurity26 wu yifan"), "")
        self.assertEqual(acquire.document_heading("Slides", "bhus26 heyes css wp"), "")
        self.assertEqual(acquire.document_heading("Whitepaper", "ccs15"), "")

    def test_no_title_at_all_heads_nothing(self):
        self.assertEqual(acquire.document_heading("", "timing attacks ccs2015"), "")
        self.assertEqual(acquire.document_heading(None, "ccs15"), "")


class TestDocumentConversion(unittest.TestCase):
    """Maintainer decision 2026-08-03: a PDF, a deck or a talk must end up as
    Markdown like everything else, and anything that genuinely cannot be
    converted goes on the FAILURE list with a reason. The media file itself is
    still never stored - for a video that means the caption track."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def entry(self, kind, url="https://example.org/paper.pdf"):
        return {"spellings": [url], "kind": kind,
                "cited_by": ["docs/list.md:1"], "health": {"status": "ok", "title": "A Paper"}}

    def test_a_pdf_is_fetched_and_converted_rather_than_linked(self):
        fetcher = FakeFetcher(body=MINIMAL_PDF)
        result = acquire.acquire("k", self.entry("whitepaper"), self.store, fetcher, CONFIG)
        self.assertEqual(fetcher.calls, ["https://example.org/paper.pdf"])
        self.assertNotEqual(result.status, "link-only")

    def test_a_google_deck_is_fetched_from_its_public_export_endpoint(self):
        url = "https://docs.google.com/presentation/d/deck-id/edit?usp=sharing"
        fetcher = FakeFetcher(body=MINIMAL_PDF)
        acquire.acquire("k", self.entry("slides", url), self.store, fetcher, CONFIG)
        self.assertEqual(fetcher.calls, [
            "https://docs.google.com/presentation/d/deck-id/export/pdf"])

    def test_a_pdf_with_no_extractable_text_is_a_FAILURE_with_a_reason(self):
        """A scan carries pictures of words. Inventing text for it would be
        worse than reporting it, so it goes on the list the maintainer reads."""
        fetcher = FakeFetcher(body=b"%PDF-1.4\nno streams here\n%%EOF")
        result = acquire.acquire("k", self.entry("whitepaper"), self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "failed")
        self.assertIn("image-only", result.reason)
        self.assertIn("OCR", result.reason)

    def test_a_large_pdf_uses_poppler_in_the_toolbox_before_the_regex_reader(self):
        large_pdf = MINIMAL_PDF.replace(
            b"%%EOF", (b" " * acquire.LARGE_PDF_POPPLER_BYTES) + b"%%EOF")
        fetcher = FakeFetcher(body=large_pdf)
        extracted = "Container-extracted research text. " * 40
        with mock.patch("refslib.toolbox.pdf_text", return_value=extracted) as reader, \
                mock.patch("refslib.extract_doc.pdf_to_markdown") as in_process:
            result = acquire.acquire("k", self.entry("whitepaper"), self.store,
                                     fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        reader.assert_called_once_with(large_pdf)
        in_process.assert_not_called()

    def test_a_large_image_only_pdf_does_not_fall_back_to_regex(self):
        large_pdf = MINIMAL_PDF.replace(
            b"%%EOF", (b" " * acquire.LARGE_PDF_POPPLER_BYTES) + b"%%EOF")
        fetcher = FakeFetcher(body=large_pdf)
        with mock.patch(
                "refslib.toolbox.pdf_text",
                side_effect=toolbox.Unavailable("pdftotext produced no text: scan")), \
                mock.patch("refslib.extract_doc.pdf_to_markdown") as in_process:
            result = acquire.acquire("k", self.entry("whitepaper"), self.store,
                                     fetcher, CONFIG)
        self.assertEqual(result.status, "failed")
        self.assertIn("OCR", result.reason)
        in_process.assert_not_called()

    def test_a_citation_that_serves_a_web_page_is_read_as_one(self):
        """speakerdeck and slideshare URLs are pages ABOUT a deck, and a Wayback
        replay of a PDF is an HTML wrapper. All were failing as "not a PDF" when
        the right answer was to read them as the web pages they are."""
        result = acquire.acquire("k", self.entry("slides"), self.store,
                                 FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertIn("page about this slides", result.record["content_gap"])

    def test_a_web_page_too_thin_to_be_the_document_still_fails(self):
        result = acquire.acquire("k", self.entry("whitepaper"), self.store,
                                 FakeFetcher(body=b"<html><body>tiny</body></html>"), CONFIG)
        self.assertEqual(result.status, "failed")
        self.assertIn("served a web page", result.reason)

    def test_the_raw_bytes_are_kept_even_when_conversion_fails(self):
        """So a second attempt with a better converter is offline."""
        fetcher = FakeFetcher(body=b"%PDF-1.4\nnothing\n%%EOF")
        result = acquire.acquire("k", self.entry("whitepaper"), self.store, fetcher, CONFIG)
        self.assertTrue(result.raw_sha256)
        self.assertTrue(self.store.has(result.raw_sha256))

    def test_a_video_without_a_transcript_still_produces_a_file_and_records_the_gap(self):
        """The title, channel, date and description are real content. Throwing
        them away because the transcript is missing would lose what WAS
        recovered, so the gap is reported instead."""
        description = ("A talk about request smuggling chains. " * 12).encode("ascii")
        fetcher = FakeFetcher(body=(
            b"<html><title>A talk - YouTube</title></html>"
            b'<script>"shortDescription":"' + description + b'"</script>'))
        result = acquire.acquire("k", self.entry("video", "https://youtube.com/watch?v=x"),
                                 self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertIn("caption track", result.record["content_gap"])
        content = self.store.get_text(result.record["content_sha256"])
        self.assertIn("Not available", content)
        self.assertIn("request smuggling", content)

    def test_a_stored_video_transcript_does_not_need_the_watch_page_bytes(self):
        url = "https://youtube.com/watch?v=x"
        transcript = ('{"events":[{"segs":[{"utf8":"the recovered talk "}]},'
                      '{"segs":[{"utf8":"contains the complete research details"}]}]}')
        entry = self.entry("video", url)
        entry.update({
            "title": "Recovered Conference Talk",
            "authors": ["Security Researcher"],
            "published": "2022-08-12",
            "publisher": "YouTube",
            "transcript_sha256": self.store.put_text(transcript),
            # Deliberately name an object that is not in this store: this is the
            # state produced when the portable manifest and transcript survive
            # but an old watch-page response does not.
            "raw_sha256": "0" * 64,
        })
        fetcher = FakeFetcher(status=599, body=b"")
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, [])
        self.assertEqual(result.record["retrieved_kind"], "stored-transcript")
        self.assertEqual(result.record["title"], "Recovered Conference Talk")
        self.assertEqual(result.record["authors"], ["Security Researcher"])
        content = self.store.get_text(result.record["content_sha256"])
        self.assertIn("the recovered talk contains the complete research details", content)
        self.assertIn("# Recovered Conference Talk", content)

    def test_an_article_is_unaffected(self):
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_short_landing_page_follows_one_explicit_pdf_and_records_companions(self):
        landing = (b'<html><body><h1>NAVEX</h1><a href="https://papers.test/navex.pdf">'
                   b'PDF</a><a href="https://github.com/example/navex">Code</a>'
                   b'<a href="https://papers.test/navex-slides.pdf">Slides</a></body></html>')

        class LandingFetcher(FakeFetcher):
            def get(self, url, extra_headers=None, max_bytes=None):
                self.calls.append(url)
                body = MINIMAL_PDF if url.endswith("navex.pdf") else landing
                return Response(url, 200, {"Content-Type": "application/pdf"}, body, [])

        entry = {"spellings": ["https://lab.test/navex"], "kind": "article",
                 "cited_title": "NAVEX", "cited_by": ["docs/list.md:1"],
                 "health": {"status": "ok"}}
        fetcher = LandingFetcher()
        with mock.patch("refslib.extract_doc.pdf_to_markdown",
                        return_value="Complete NAVEX paper. " * 40):
            result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls,
                         ["https://lab.test/navex", "https://papers.test/navex.pdf"])
        self.assertEqual(result.record["original_url"], "https://lab.test/navex")
        self.assertEqual(result.record["retrieved_from"], "https://papers.test/navex.pdf")
        self.assertIn("https://github.com/example/navex", result.record["also_at"])
        self.assertEqual(entry["linked_document_url"], "https://papers.test/navex.pdf")

    def test_a_pointer_page_with_enough_text_still_follows_its_explicit_pdf(self):
        landing = ("<html><title>Paper record</title><body><p>" +
                   ("publication metadata " * 35) +
                   '</p><a href="paper.pdf">Download</a></body></html>').encode("utf-8")

        class PointerFetcher(FakeFetcher):
            def get(self, url, extra_headers=None, max_bytes=None):
                self.calls.append(url)
                body = MINIMAL_PDF if url.endswith("paper.pdf") else landing
                return Response(url, 200, {}, body, [])

        entry = {"spellings": ["https://lab.test/record"], "kind": "article",
                 "cited_title": "Paper", "cited_by": ["docs/list.md:1"],
                 "health": {"status": "ok"}}
        with mock.patch("refslib.extract_doc.pdf_to_markdown",
                        return_value="Complete paper. " * 50):
            result = acquire.acquire("k", entry, self.store, PointerFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(entry["linked_document_url"], "https://lab.test/paper.pdf")

    def test_a_known_link_does_not_reuse_the_landing_html_as_pdf_bytes(self):
        landing_sha = self.store.put_text("<html><body>landing page</body></html>")
        entry = {"spellings": ["https://lab.test/record"], "kind": "article",
                 "cited_title": "Paper", "cited_by": ["docs/list.md:1"],
                 "health": {"status": "ok"}, "raw_sha256": landing_sha,
                 "landing_sha256": landing_sha,
                 "linked_document_url": "https://lab.test/paper.pdf"}
        fetcher = FakeFetcher(body=MINIMAL_PDF)
        with mock.patch("refslib.extract_doc.pdf_to_markdown",
                        return_value="Complete paper. " * 50):
            result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, ["https://lab.test/paper.pdf"])
        self.assertNotEqual(result.record["raw_sha256"], landing_sha)

    def test_refetch_bypasses_a_stale_browser_dom(self):
        """A citation can move to an exact archive replay after a failed live
        browser attempt.  --refetch means fetch that new spelling; it must not
        keep replaying the old browser error page from the store."""
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"},
                 "browser_dom_sha256": self.store.put_text(
                     "<html><body>ERR_CONNECTION_TIMED_OUT</body></html>")}
        fetcher = FakeFetcher()
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG,
                                 refetch=True)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, ["https://example.org/post"])

    def test_a_browser_dom_whose_object_is_gone_falls_back_to_fetching(self):
        """A POINTER IS NOT THE BYTES. An antivirus scanner deleted store
        objects - exploit write-ups read as malware by their own text - and this
        was the one `store.get` reached without asking `store.has` first, so a
        recovery pass over 107 references died with FileNotFoundError one
        reference at a time instead of re-fetching any of them."""
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"},
                 "browser_dom_sha256": "0" * 64}
        fetcher = FakeFetcher()
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, ["https://example.org/post"])

    def test_a_browser_dom_that_is_still_in_the_store_is_used_without_fetching(self):
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"},
                 "browser_dom_sha256": self.store.put_text(PAGE)}
        fetcher = FakeFetcher()
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, [])

    def test_a_deck_that_downloads_as_a_web_page_reads_its_stored_render(self):
        """A RENDERED PAGE BEATS A REFUSAL. A Google Slides deck readable in a
        browser but not exportable answers the export route with a permission
        page, while the DOM the browser ladder already stored holds the deck."""
        entry = {"spellings": ["https://docs.google.com/presentation/d/x/edit"],
                 "kind": "slides", "cited_by": ["docs/list.md:1"],
                 "health": {"status": "ok"},
                 "browser_dom_sha256": self.store.put_text(PAGE)}
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_verified_capture_beats_the_live_pages_blocked_status(self):
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"],
                 "health": {"status": "blocked", "snapshot": "20160722013412"},
                 "raw_sha256": self.store.put(PAGE.encode("utf-8"))}
        fetcher = FakeFetcher(status=500)
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, [])

    def test_container_fetched_bytes_beat_an_expired_certificate(self):
        """`insecure` stores the page, then says "run acquire --force".

        The capture test used to require a Wayback `snapshot`, so acquisition
        refused bytes it already held and reported the reference skipped -
        which reads as a page nobody could get, one command after getting it.
        """
        raw = self.store.put(PAGE.encode("utf-8"))
        entry = {"spellings": ["https://expired.test/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"],
                 "health": {"status": "blocked",
                            "evidence": "SSLCertVerificationError"},
                 "raw_sha256": raw,
                 "steps": {"insecure-fetch": {"result": "stored", "sha256": raw}}}
        fetcher = FakeFetcher(status=500)
        result = acquire.acquire("k", entry, self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, [])

    def test_a_blocked_page_with_no_recovered_bytes_is_still_skipped(self):
        entry = {"spellings": ["https://walled.test/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"],
                 "health": {"status": "blocked"},
                 "raw_sha256": self.store.put(PAGE.encode("utf-8"))}
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "skipped")

    def test_a_linked_paper_is_titled_by_its_landing_page_not_the_link_text(self):
        """A sibling's link text is a label - `Preprint`, `Code`, `Paper` - and
        a PDF that declares no title of its own fell back to exactly that."""
        entry = {"spellings": ["https://arxiv.test/abs/1"], "kind": "article",
                 "cited_title": "Preprint", "cited_by": ["docs/list.md:1"],
                 "health": {"status": "ok",
                            "title": "The Masks We Wear - arXiv.test"},
                 "linked_document_url": "https://arxiv.test/pdf/1.pdf"}
        with mock.patch("refslib.extract_doc.pdf_to_markdown",
                        return_value="Complete paper. " * 50):
            result = acquire.acquire("k", entry, self.store,
                                     FakeFetcher(body=MINIMAL_PDF), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(result.record["title"], "The Masks We Wear")

    def test_a_maintainer_archive_decision_reaches_grading(self):
        """A short article about custom 404 handling says 'page not found' in
        its opening. The phrase is research text, not proof that the capture is
        a 404, and an explicit maintainer decision must beat that heuristic."""
        page = ("<html><head><title>Scanning custom errors</title></head><body>"
                "<main><h1>Scanning custom errors</h1><p>Page not found responses "
                + ("can reveal an application path during security testing. " * 35)
                + "</p></main></body></html>").encode("utf-8")
        entry = {"spellings": ["https://example.org/custom-errors"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}
        override = {"outcome": "archive", "class": "research",
                    "reason": "verified as the cited article"}

        result = acquire.acquire("k", entry, self.store, FakeFetcher(body=page), CONFIG,
                                 override=override)

        self.assertEqual(result.status, "stored")
        self.assertEqual(result.record["grade"], "research")
        self.assertEqual(result.record["decision"]["by"], "maintainer")

    def test_a_maintainer_can_confirm_an_intentionally_short_poc(self):
        page = ("<html><head><title>CSS-Only Clickjacking</title></head><body>"
                "<main><h1>CSS-Only Clickjacking</h1><p>Clicks pass through the "
                "overlay to the hidden control.</p><pre><code>pointer-events: none;"
                "</code></pre></main></body></html>").encode("utf-8")
        entry = {"spellings": ["https://example.org/poc"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}
        override = {"outcome": "archive", "class": "research",
                    "reason": "verified complete proof of concept"}

        result = acquire.acquire("k", entry, self.store, FakeFetcher(body=page), CONFIG,
                                 override=override)

        self.assertEqual(result.status, "stored")
        self.assertEqual(result.record["grade"], "research")
        self.assertEqual(result.record["decision"]["by"], "maintainer")


class TestLossGuard(unittest.TestCase):
    """A silent loss is the failure this archive exists to undo, and it is
    invisible unless something compares."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def entry(self, probe_chars):
        return {"spellings": ["https://example.org/post"], "kind": "article",
                "cited_by": ["docs/list.md:1"],
                "health": {"status": "ok", "text_length": probe_chars}}

    def test_extraction_keeping_most_of_the_probed_text_is_stored(self):
        result = acquire.acquire("k", self.entry(1400), self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_extraction_losing_most_of_the_probed_text_is_routed_to_the_browser(self):
        """A page whose readable text only exists after JavaScript runs looks
        exactly like a broken extractor. hackmd keeps its source in a hidden
        element, so sanitisation correctly removes it. Route rather than park."""
        result = acquire.acquire("k", self.entry(200000), self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "needs-browser")
        self.assertIn("under a third", result.reason)

    def test_the_same_loss_after_a_browser_has_already_seen_it_is_a_review(self):
        entry = dict(self.entry(40000))
        digest = self.store.put_text(PAGE)
        entry["browser_dom_sha256"] = digest
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "review")

    def test_a_maintainer_can_confirm_a_short_article_inside_a_large_page(self):
        entry = dict(self.entry(40000))
        result = acquire.acquire(
            "k", entry, self.store, FakeFetcher(), CONFIG,
            override={"outcome": "archive", "class": "research",
                      "reason": "verified that this candidate is the whole cited article"})
        self.assertEqual(result.status, "stored")

    def test_a_substantial_article_is_not_compared_to_all_browser_furniture(self):
        page = ("<html><title>Legacy research</title><body><article><h1>Legacy "
                "research</h1><p>" + ("complete technical explanation " * 220) +
                "</p></article><aside>" + ("related navigation " * 2000) +
                "</aside></body></html>")
        entry = dict(self.entry(50000))
        entry["browser_dom_sha256"] = self.store.put_text(page)
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_chrome_heavy_page_keeping_a_third_is_accepted(self):
        """Measured: documentation pages land at 0.36 to 0.48 because half the
        page really is navigation. Broken ones land under 0.25."""
        result = acquire.acquire("k", self.entry(3400), self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_genuinely_short_page_is_not_flagged(self):
        result = acquire.acquire("k", self.entry(200), self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_wayback_capture_is_compared_with_its_own_visible_text(self):
        entry = self.entry(200000)
        entry["health"]["snapshot"] = "20100102030405"
        result = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_a_substantial_static_wayback_article_does_not_need_a_js_browser(self):
        page = ("<html><title>Old research</title><body><article><h1>Old research</h1>"
                "<p>" + ("complete technical explanation " * 90) + "</p></article>"
                "<aside>" + ("archive navigation " * 900) + "</aside></body></html>")
        entry = self.entry(50000)
        entry["health"]["snapshot"] = "20080102030405"
        result = acquire.acquire("k", entry, self.store,
                                 FakeFetcher(body=page.encode("utf-8")), CONFIG)
        self.assertEqual(result.status, "stored")


class TestCandidateChoice(unittest.TestCase):
    def candidates(self, markup):
        return extract_html.candidates(markup)

    def test_precision_wins_when_it_keeps_the_code(self):
        chosen, why = acquire.choose(self.candidates(PAGE))
        self.assertEqual(chosen.name, "precision")
        self.assertIn("code", why)

    def test_a_precision_container_that_lost_the_code_blocks_loses(self):
        markup = ("<html><body><main><p>" + ("prose " * 100) + "</p></main>"
                  "<div class='post-body'><pre><code>payload</code></pre>"
                  "<p>" + ("prose " * 100) + "</p></div></body></html>")
        chosen, _why = acquire.choose(self.candidates(markup))
        self.assertGreater(chosen.metrics["code_blocks"], 0)

    def test_no_candidates_is_handled(self):
        chosen, why = acquire.choose([])
        self.assertIsNone(chosen)

    def test_a_sidebar_does_not_outvote_the_article_by_being_longer(self):
        """NCC Group's DNS rebinding article, as its capture actually measured.

        Precision held the whole article; raw held the article plus an archive
        listing of every other post on the blog. Picking raw published 2,640
        links with the research 94% of the way down.
        """
        article = ("<html><body><main>"
                   + "".join("<h2>Section %d</h2><p>%s</p>" % (n, "analysis " * 60)
                             for n in range(20))
                   + "<pre><code>rebind()</code></pre>" * 3
                   + "</main>"
                   + "<div id='sidebar'>"
                   + "".join("<a href='/post-%d'>Another post from the blog</a>" % n
                             for n in range(2500))
                   + "</div></body></html>")
        chosen, why = acquire.choose(self.candidates(article))
        self.assertEqual(chosen.name, "precision")
        self.assertIn("navigation", why)

    def test_a_longer_candidate_that_adds_headings_still_wins(self):
        """The guard must not fire when precision genuinely truncated the page."""
        markup = ("<html><body><main><h2>Intro</h2><p>" + ("prose " * 40)
                  + "</p></main>"
                  + "<div class='post-body'><h2>Intro</h2><p>" + ("prose " * 40)
                  + "</p>"
                  + "".join("<h2>Part %d</h2><p>%s</p>" % (n, "prose " * 200)
                            for n in range(6))
                  + "</div></body></html>")
        chosen, _why = acquire.choose(self.candidates(markup))
        self.assertNotEqual(chosen.name, "precision")

    def test_an_empty_precision_container_still_falls_through(self):
        """A page with no <main> gives precision nothing; raw is what there is."""
        markup = ("<html><body><div class='post'><h2>Only section</h2><p>"
                  + ("prose " * 300) + "</p></div></body></html>")
        chosen, _why = acquire.choose(self.candidates(markup))
        self.assertGreater(chosen.metrics["chars"], acquire.MIN_PRECISION_CHARS)


class TestMetadata(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def test_declared_metadata_becomes_attribution(self):
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}
        record = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG).record
        self.assertEqual(record["title"], "Request Smuggling")
        self.assertEqual(record["publisher"], "Example Labs")
        self.assertEqual(record["published"], "2019-08-23")
        self.assertIn("Alex Example", record["authors"])
        self.assertTrue(record["slug"].startswith("2019-example-labs-"))

    def test_a_stored_document_records_both_hashes(self):
        entry = {"spellings": ["https://example.org/post"], "kind": "article",
                 "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}
        record = acquire.acquire("k", entry, self.store, FakeFetcher(), CONFIG).record
        self.assertTrue(self.store.has(record["raw_sha256"]))
        self.assertTrue(self.store.has(record["content_sha256"]))
        self.assertNotEqual(record["raw_sha256"], record["content_sha256"])


if __name__ == "__main__":
    unittest.main()


class TestManualImportsAreSticky(unittest.TestCase):
    """Somebody obtained the document by hand precisely because no automated
    route could. Re-running acquisition can only replace it with the failure
    that made the import necessary - and one `acquire --force` silently
    overwrote all 18 imports with exactly those failures."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def entry(self):
        return {"spellings": ["https://example.org/post"], "kind": "article",
                "cited_by": ["docs/list.md:1"], "health": {"status": "ok"},
                "steps": {"import": {"result": "stored"}}}

    def test_an_imported_reference_is_left_alone(self):
        fetcher = FakeFetcher()
        result = acquire.acquire("k", self.entry(), self.store, fetcher, CONFIG)
        self.assertEqual(result.status, "skipped")
        self.assertIn("hand-imported", result.reason)
        self.assertEqual(fetcher.calls, [])

    def test_replace_imports_is_the_deliberate_escape_hatch(self):
        fetcher = FakeFetcher()
        result = acquire.acquire("k", self.entry(), self.store, fetcher, CONFIG,
                                 replace_imports=True)
        self.assertEqual(result.status, "stored")
        self.assertEqual(fetcher.calls, ["https://example.org/post"])

    def test_a_reference_that_was_never_imported_is_unaffected(self):
        entry = self.entry()
        del entry["steps"]
        self.assertEqual(acquire.acquire("k", entry, self.store, FakeFetcher(),
                                         CONFIG).status, "stored")


class TestBrowserBackedTranscript(unittest.TestCase):
    """Measured 2026-08-03: YouTube answers 200 with a zero-byte body, or 404,
    for every caption format unless the request carries a browser session. Twelve
    talks in this corpus had metadata and no transcript because of it. The track
    URL is in the page already; what it needs is to be requested from inside the
    page, where the session and the origin are the ones YouTube expects."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    PAGE = (b'<html><title>A talk - YouTube</title>'
            b'<script>"shortDescription":"' + (b"A talk about smuggling. " * 12)
            + b'","captionTracks":[{"baseUrl":"https://youtube.com/api/timedtext?v=x",'
              b'"languageCode":"en","kind":"asr"}]</script></html>')

    JSON3 = ('{"events":[{"segs":[{"utf8":"the smuggled prefix"}]},'
             '{"segs":[{"utf8":" lands on read"}]}]}')

    class SplitFetcher(object):
        """200 for the watch page, 404 for the caption endpoint - which is
        exactly what YouTube does to a client with no browser session."""

        def __init__(self, page):
            self.page = page

        def get(self, url, extra_headers=None, max_bytes=None):
            if "timedtext" in url:
                return Response(url, 404, {"Content-Type": "text/xml"}, b"", [])
            return Response(url, 200, {"Content-Type": "text/html"}, self.page, [])

    class Ladder(object):
        def __init__(self, body="", error=""):
            self.body, self.error, self.calls = body, error, []

        def available(self):
            return True

        def timed_text(self, url, track_url="", budget=60):
            self.calls.append(url)
            self.track_url = track_url
            return self.body, "json3", self.error

    def entry(self):
        return {"spellings": ["https://youtube.com/watch?v=x"], "kind": "video",
                "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}

    def test_the_page_fetches_its_own_captions_when_a_plain_client_cannot(self):
        ladder = self.Ladder(body=self.JSON3)
        result = acquire.acquire("k", self.entry(), self.store,
                                 self.SplitFetcher(self.PAGE), CONFIG,
                                 ladder=ladder)
        self.assertEqual(result.status, "stored")
        self.assertEqual(result.record["content_gap"], "")
        content = self.store.get_text(result.record["content_sha256"])
        self.assertIn("the smuggled prefix lands on read", content)
        self.assertIn("browser session", content)
        self.assertEqual(ladder.calls, ["https://youtube.com/watch?v=x"])

    def test_a_failing_browser_route_reports_BOTH_reasons(self):
        ladder = self.Ladder(error="no rung produced a transcript")
        result = acquire.acquire("k", self.entry(), self.store,
                                 self.SplitFetcher(self.PAGE), CONFIG,
                                 ladder=ladder)
        gap = result.record["content_gap"]
        self.assertIn("404", gap)
        self.assertIn("browser route also failed", gap)

    def test_no_browser_is_configured_and_nothing_breaks(self):
        result = acquire.acquire("k", self.entry(), self.store,
                                 self.SplitFetcher(self.PAGE), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertIn("404", result.record["content_gap"])


class TestASlideHostPageIsTheDocument(unittest.TestCase):
    """A gap means something is MISSING, and on a slide host it usually is not:
    SlideShare and SpeakerDeck publish the whole deck's text on the page. Three
    decks here extracted to 28,762, 30,914 and 31,482 characters while being
    recorded as "we only have a page about it", which put them in records/ and
    on the document-gaps list."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def entry(self):
        return {"spellings": ["https://www.slideshare.net/x/deck-123"], "kind": "slides",
                "cited_by": ["docs/list.md:1"], "health": {"status": "ok"}}

    def page(self, words):
        return ("<html><head><title>A deck</title></head><body><main><h1>A deck</h1><p>"
                # 41 characters, as the phrase it replaced was, so the content
                # floor sees the same size for the same `words`.
                + ("slide text about smuggled desync attacks " * words)
                + "</p></main></body></html>").encode("utf-8")

    def test_a_page_carrying_the_whole_deck_records_no_gap(self):
        result = acquire.acquire("k", self.entry(), self.store,
                                 FakeFetcher(body=self.page(900)), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertEqual(result.record["content_gap"], "")

    def test_a_landing_page_still_records_the_gap(self):
        result = acquire.acquire("k", self.entry(), self.store,
                                 FakeFetcher(body=self.page(20)), CONFIG)
        self.assertIn("page about this slides", result.record["content_gap"])


class TestTheLossGuardRespectsCode(unittest.TestCase):
    """A Stack Overflow question page is 20% article by text and 80% sidebar,
    related questions and footer. The extraction kept 4,045 characters carrying
    all three code blocks out of 19,983 and was sent for review as a suspected
    loss, which is the extractor doing its job being called a failure."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    def page(self, code_blocks):
        blocks = "".join("<pre><code>var x = %d;</code></pre>" % n for n in range(code_blocks))
        return ("<html><head><title>A question</title></head><body>"
                "<main><h1>A question</h1><p>" + ("question text " * 200) + "</p>"
                + blocks + "</main>"
                "<aside>" + ("related questions and adverts " * 800) + "</aside>"
                "</body></html>").encode("utf-8")

    def entry(self, probe):
        return {"spellings": ["https://stackoverflow.com/questions/1"], "kind": "article",
                "cited_by": ["docs/list.md:1"],
                "health": {"status": "ok", "text_length": probe},
                "browser_dom_sha256": ""}

    def test_an_extraction_that_kept_the_code_is_stored_not_reviewed(self):
        result = acquire.acquire("k", self.entry(200000), self.store,
                                 FakeFetcher(body=self.page(3)), CONFIG)
        self.assertEqual(result.status, "stored")

    def test_an_extraction_with_no_code_still_faces_the_guard(self):
        result = acquire.acquire("k", self.entry(200000), self.store,
                                 FakeFetcher(body=self.page(0)), CONFIG)
        self.assertIn(result.status, ("review", "needs-browser"))

    def test_one_stray_snippet_is_not_enough(self):
        result = acquire.acquire("k", self.entry(200000), self.store,
                                 FakeFetcher(body=self.page(1)), CONFIG)
        self.assertIn(result.status, ("review", "needs-browser"))


class TestAGitHubRefusalKeepsTheDocument(unittest.TestCase):
    """The unauthenticated API allows 60 requests an hour. Hitting that limit
    made ten references fail at once, and the next index run swept every one of
    their files - each of which had a perfectly good document in the store."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name))
        self.addCleanup(self.tmp.cleanup)

    class Refusing(object):
        def get(self, url, extra_headers=None, max_bytes=None):
            return Response(url, 403, {}, b"{}", [])

    def entry(self, held=""):
        row = {"spellings": ["https://github.com/advisories/GHSA-x"], "kind": "advisory",
               "cited_by": ["docs/list.md:1"], "health": {"status": "ok"},
               "title": "An advisory"}
        if held:
            row["content_sha256"] = held
        return row

    def test_a_rate_limited_api_re_renders_from_the_stored_document(self):
        held = self.store.put_text("# An advisory\n\n" + ("real content " * 60))
        result = acquire.acquire("k", self.entry(held), self.store, self.Refusing(), CONFIG)
        self.assertEqual(result.status, "stored")
        self.assertIn("real content", self.store.get_text(result.record["content_sha256"]))

    def test_a_rate_limited_api_with_nothing_held_still_fails(self):
        result = acquire.acquire("k", self.entry(), self.store, self.Refusing(), CONFIG)
        self.assertEqual(result.status, "failed")
        self.assertIn("60 an hour", result.reason)
