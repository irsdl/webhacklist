"""Preserving the pictures an archived article was written around.

The corpus is exploit research and its readers are agents, so the rule is that
what gets stored is never what was fetched: every image is decoded to pixels and
written back out as a new file.
"""

from . import support  # noqa: F401

import io
import unittest

from refslib import images


def raster(width=800, height=600, colour=(30, 40, 50), **save):
    from PIL import Image
    buffer = io.BytesIO()
    Image.new("RGB", (width, height), colour).save(buffer, format="JPEG",
                                                   quality=90, **save)
    return buffer.getvalue()


class TestNothingButPixelsSurvives(unittest.TestCase):

    def test_exif_does_not_come_across(self):
        poisoned = raster(exif=b"Exif\x00\x00II*\x00\x08\x00\x00\x00\x00\x00SECRET")
        clean, _width, _height = images.sanitise(poisoned)
        self.assertNotIn(b"SECRET", clean)

    def test_an_appended_payload_does_not_come_across(self):
        """A JPEG with a ZIP stapled to the end is a polyglot, and decoding one
        to pixels and re-encoding is what takes the staple out."""
        clean, _width, _height = images.sanitise(raster() + b"PK\x03\x04PAYLOAD")
        self.assertNotIn(b"PAYLOAD", clean)

    def test_the_result_is_a_jpeg(self):
        """JPEG because the headless printer embeds one as it stands. The same
        figures re-encoded as WebP printed a PDF seven times the size."""
        clean, _width, _height = images.sanitise(raster())
        self.assertEqual(clean[:3], b"\xff\xd8\xff")

    def test_a_large_image_is_brought_down_to_print_size(self):
        _clean, width, height = images.sanitise(raster(4000, 3000))
        self.assertLessEqual(max(width, height), images.MAX_SIDE)


class TestWhatIsRefused(unittest.TestCase):

    def refusal(self, data):
        with self.assertRaises(images.Unusable) as caught:
            images.sanitise(data)
        return str(caught.exception)

    def test_svg_is_never_rasterised(self):
        """Rasterising an SVG means running it."""
        reason = self.refusal(b'<svg xmlns="http://www.w3.org/2000/svg">'
                              b"<script>fetch('//x')</script></svg>")
        self.assertIn("script host", reason)

    def test_an_svg_declared_by_its_xml_prologue_is_refused_too(self):
        reason = self.refusal(b'<?xml version="1.0"?><svg><rect/></svg>')
        self.assertIn("script host", reason)

    def test_something_that_is_not_an_image_is_refused(self):
        self.assertTrue(self.refusal(b"<html>a consent wall</html>"))

    def test_an_avatar_sized_image_is_furniture(self):
        self.assertIn("furniture", self.refusal(raster(48, 48)))

    def test_an_absurdly_large_download_is_refused_before_decoding(self):
        reason = self.refusal(b"\xff\xd8\xff" + b"\x00" * images.MAX_SOURCE_BYTES)
        self.assertIn("larger than an image needs to be", reason)


class TestWhichImagesAreWanted(unittest.TestCase):

    def test_furniture_hosts_are_skipped(self):
        found = images.urls_in(
            "![](https://secure.gravatar.com/avatar/abc)\n"
            "![figure](https://example.test/desync.png)\n")
        self.assertEqual(found, ["https://example.test/desync.png"])

    def test_each_url_is_wanted_once(self):
        found = images.urls_in("![a](https://x.test/1.png)\n![b](https://x.test/1.png)\n")
        self.assertEqual(found, ["https://x.test/1.png"])

    def test_a_title_after_the_url_is_not_part_of_it(self):
        found = images.urls_in('![a](https://x.test/1.png "Figure 1")')
        self.assertEqual(found, ["https://x.test/1.png"])

    def test_a_relative_target_is_still_a_figure(self):
        """Discovery used to require `http`, so a README's own figure was
        invisible and the reference published with the picture missing."""
        found = images.urls_in("![Attack Overview](attack_overview.png)\n")
        self.assertEqual(found, ["attack_overview.png"])

    def test_a_relative_target_keeps_the_spelling_the_document_used(self):
        """The PDF converter looks a preserved picture up by the target it
        finds in the text, so resolving must not change the key."""
        found = images.urls_in("![o](Figure/Figure-overview.png)\n![t](/thumbnail.jpg)\n")
        self.assertEqual(found, ["Figure/Figure-overview.png", "/thumbnail.jpg"])

    def test_an_embedded_data_uri_is_not_something_to_fetch(self):
        found = images.urls_in("![kept](data:image/jpeg;base64,AAAA)\n"
                               "![figure](https://x.test/1.png)\n")
        self.assertEqual(found, ["https://x.test/1.png"])


class TestResolvingATarget(unittest.TestCase):

    def test_an_absolute_target_is_returned_unchanged(self):
        self.assertEqual(images.resolve("https://x.test/1.png", "https://base.test/p/"),
                         "https://x.test/1.png")

    def test_an_absolute_target_needs_no_base(self):
        self.assertEqual(images.resolve("https://x.test/1.png", ""),
                         "https://x.test/1.png")

    def test_a_document_relative_target_joins_the_page(self):
        self.assertEqual(
            images.resolve("Figure/overview.png",
                           "https://raw.githubusercontent.test/o/r/abc123/"),
            "https://raw.githubusercontent.test/o/r/abc123/Figure/overview.png")

    def test_a_root_relative_target_joins_the_host(self):
        self.assertEqual(images.resolve("/thumbnail.jpg", "https://site.test/blog/post"),
                         "https://site.test/thumbnail.jpg")

    def test_without_a_base_nothing_is_invented(self):
        self.assertEqual(images.resolve("attack_overview.png", ""), "")

    def test_a_join_that_is_not_http_is_refused(self):
        """Resolution never hands the fetcher a scheme it should not open."""
        self.assertEqual(images.resolve("../secret.png", "file:///etc/"), "")
        self.assertEqual(images.resolve("javascript:alert(1)", "https://site.test/"), "")


class TestEmbedding(unittest.TestCase):

    def test_a_data_uri_is_what_the_renderer_gets(self):
        clean, _width, _height = images.sanitise(raster())
        self.assertTrue(images.data_uri(clean).startswith("data:image/jpeg;base64,"))


if __name__ == "__main__":
    unittest.main()
