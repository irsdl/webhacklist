"""Rendering, and the attribution requirement.

The published files carry the full content, so every one of them has to point
clearly at the original. That is the mitigation, which means it cannot be a
convention that a later change quietly drops: a file that cannot say where its
content came from is not written at all.
"""

from . import support  # noqa: F401

import hashlib
import unittest

from refslib import credential_redaction, render

RECORD = {
    "slug": "2019-example-labs-desync-attacks-on-chunked-requests",
    "title": "Desync Attacks on Chunked Requests",
    "authors": ["Alex Example"],
    "publisher": "Example Labs",
    "published": "2019-08-23",
    "kind": "article",
    "licence": "unknown",
    "original_url": "https://research.example.org/2019/08/23/desync-attacks-on-chunked-requests/",
    "canonical_url": "https://blog.example.com/desync-attacks-on-chunked-requests",
    "retrieved_kind": "canonical-migration",
    "retrieved_from": "https://blog.example.com/desync-attacks-on-chunked-requests",
    "retrieved_utc": "2026-08-03T10:00:00Z",
    "cited_by": ["2019.md:118"],
    "why": "Backs the CL.0 desync entry.",
    "summary": "How a front end and a back end disagree about where a request ends.",
}

CONTENT = ("Some prose about the technique.\n\n"
           "```http\nTransfer-Encoding: chunked\n```\n\n"
           "More prose explaining the sink.\n\n"
           "```javascript\nnew XMLHttpRequest().open('POST', '/');\n```\n")


class TestAttributionIsRequired(unittest.TestCase):
    def test_a_complete_record_renders(self):
        text = render.render(RECORD, CONTENT, "full")
        self.assertIn("# Desync Attacks on Chunked Requests", text)
        self.assertEqual(render.check_attribution(text), [])

    def test_every_required_field_is_actually_required(self):
        for field in render.required_attribution():
            record = dict(RECORD)
            record[field] = ""
            with self.assertRaises(render.MissingAttribution, msg="missing " + field):
                render.render(record, CONTENT, "full")

    def test_the_original_url_the_route_and_the_date_are_in_the_file(self):
        text = render.render(RECORD, CONTENT, "full")
        self.assertIn("- Original: <https://research.example.org/2019/08/23/"
                      "desync-attacks-on-chunked-requests/>", text)
        self.assertIn("- Preserved from: https://blog.example.com/desync-attacks-on-chunked-requests "
                      "(canonical-migration) on 2026-08-03", text)

    def test_the_author_and_publisher_are_named(self):
        text = render.render(RECORD, CONTENT, "full")
        self.assertIn("Alex Example", text)
        self.assertIn("Example Labs", text)

    def test_an_unknown_licence_is_stated_rather_than_omitted(self):
        record = dict(RECORD)
        del record["licence"]
        text = render.render(record, CONTENT, "full")
        self.assertIn("- Licence: unknown", text)

    def test_the_rights_line_is_present(self):
        self.assertIn("Rights remain with the original author",
                      render.render(RECORD, CONTENT, "full"))

    def test_a_damaged_file_is_reported_by_check_attribution(self):
        text = render.render(RECORD, CONTENT, "full")
        damaged = text.replace("- Original: <", "- Somewhere: <")
        self.assertIn("original_url", render.check_attribution(damaged))

    def test_a_file_with_no_rights_line_is_reported(self):
        text = render.render(RECORD, CONTENT, "full").replace(
            "Rights remain with the original author", "x")
        self.assertIn("rights statement", render.check_attribution(text))


class TestDepth(unittest.TestCase):
    def test_only_the_content_section_and_the_depth_value_change(self):
        """Same keys, same slug, same attribution, same agent-written sections.
        The only differences are `## Content` and the two frontmatter values
        that record which depth this is, so a depth switch is a legible diff and
        never breaks a link or the manifest."""
        full = render.render(RECORD, CONTENT, "full")
        for depth in ("excerpt", "metadata"):
            other = render.render(RECORD, CONTENT, depth)
            self.assertEqual(_normalise_depth(_before_content(full)),
                             _normalise_depth(_before_content(other)))
            self.assertEqual(_keys(full), _keys(other))

    def test_the_depth_is_recorded_in_the_frontmatter(self):
        for depth in render.DEPTHS:
            self.assertIn("depth: " + depth, render.render(RECORD, CONTENT, depth))

    def test_the_excerpt_keeps_every_code_block(self):
        text = render.render(RECORD, CONTENT, "excerpt")
        self.assertIn("Transfer-Encoding: chunked", text)
        self.assertIn("new XMLHttpRequest().open('POST', '/');", text)

    def test_the_metadata_depth_mirrors_nothing_but_still_links(self):
        text = render.render(RECORD, CONTENT, "metadata")
        self.assertNotIn("Transfer-Encoding", text)
        self.assertIn("not mirrored here", text)
        self.assertIn("blog.example.com/desync-attacks-on-chunked-requests", text)
        self.assertEqual(render.check_attribution(text), [])

    def test_the_untrusted_banner_sits_above_the_content(self):
        text = render.render(RECORD, CONTENT, "full")
        self.assertIn("UNTRUSTED SOURCE TEXT", text)
        self.assertLess(text.index("UNTRUSTED SOURCE TEXT"), text.index("Some prose"))

    def test_a_reviewed_credential_shaped_value_is_redacted(self):
        examples = (
            ("AI" + "za" + ("A" * 35), "REDACTED_GOOGLE_API_KEY"),
            ("AS" + "IA" + ("A" * 16), "REDACTED_AWS_ACCESS_KEY_ID"),
            ("gh" + "r_" + ("A" * 76), "REDACTED_GITHUB_REFRESH_TOKEN"),
            ("h" + "f_" + ("A" * 34), "REDACTED_HUGGING_FACE_TOKEN"),
            ("a" * 32, "REDACTED_FLICKR_API_KEY"),
            ("sk_" + "test_" + ("A" * 24), "REDACTED_STRIPE_TEST_KEY"),
        )
        for token, placeholder in examples:
            digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
            cleaned = credential_redaction.redact("key=" + token, {digest})
            self.assertEqual(cleaned, "key=" + placeholder)

    def test_an_unreviewed_credential_shaped_value_is_preserved(self):
        token = "AI" + "za" + ("A" * 35)
        self.assertEqual(credential_redaction.redact(token, set()), token)

    def test_an_unknown_depth_is_refused(self):
        with self.assertRaises(ValueError):
            render.render(RECORD, CONTENT, "everything")

    def test_rendering_is_deterministic(self):
        self.assertEqual(render.render(RECORD, CONTENT, "full"),
                         render.render(RECORD, CONTENT, "full"))


class TestFrontmatter(unittest.TestCase):
    def test_a_title_with_a_colon_is_quoted(self):
        record = dict(RECORD, title="CL.0: Request Smuggling Without Chunks")
        text = render.render(record, CONTENT, "full")
        self.assertIn('title: "CL.0: Request Smuggling Without Chunks"', text)

    def test_citation_sites_are_listed(self):
        text = render.render(RECORD, CONTENT, "full")
        # Quoted because the value contains a colon, which YAML would otherwise
        # read as a mapping.
        self.assertIn('  - "2019.md:118"', text)

    def test_no_absolute_path_reaches_a_rendered_file(self):
        text = render.render(RECORD, CONTENT, "full")
        self.assertNotIn(":\\", text)
        self.assertNotIn("/home/", text)


def _before_content(text):
    return text.split("## Content", 1)[0]


def _normalise_depth(text):
    """Blank the two values that are SUPPOSED to differ between depths."""
    import re
    return re.sub(r"^depth(_reason)?: .*$", "depth:", text, flags=re.MULTILINE)


def _keys(text):
    """The frontmatter keys, which must be identical at every depth."""
    import re
    block = text.split("---", 2)[1]
    return [line.split(":", 1)[0] for line in block.splitlines()
            if line and not line.startswith((" ", "-"))]


if __name__ == "__main__":
    unittest.main()


class TestOkfConformance(unittest.TestCase):
    """Open Knowledge Format v0.2. The archive was already Markdown plus
    provenance frontmatter, so the standard costs nothing and means a consumer
    does not have to learn our field names."""

    def frontmatter(self, record=None, depth="full"):
        text = render.render(record or RECORD, CONTENT, depth)
        return text.split("---", 2)[1]

    def test_the_required_type_field_is_present_and_non_empty(self):
        block = self.frontmatter()
        self.assertRegex(block, r"(?m)^type: \S")

    def test_the_kind_maps_to_a_readable_okf_type(self):
        self.assertEqual(render.okf_type("repo"), "Repository")
        self.assertEqual(render.okf_type("vendor-doc"), "Vendor Doc")
        self.assertEqual(render.okf_type("something-new"), "Reference")

    def test_the_recommended_fields_are_present(self):
        block = self.frontmatter()
        for field in ("title:", "resource:", "tags:"):
            self.assertIn(field, block)

    def test_generated_names_the_producer_and_the_time(self):
        block = self.frontmatter()
        self.assertIn("generated:", block)
        self.assertIn("by: " + render.PRODUCER, block)
        self.assertIn("at: ", block)

    def test_verified_is_absent_until_something_has_actually_verified_it(self):
        """Under OKF the absence IS the statement: no key means unverified.
        An empty list pretending to be a check would be worse than nothing."""
        self.assertNotIn("verified:", self.frontmatter())

    def test_verified_appears_once_a_verification_event_exists(self):
        record = dict(RECORD, verified=[{"by": "human:irsdl", "at": "2026-08-03T00:00:00Z"}])
        block = self.frontmatter(record)
        self.assertIn("verified:", block)
        self.assertIn("human:irsdl", block)

    def test_status_reflects_what_the_archive_knows(self):
        self.assertIn("status: stable", self.frontmatter())
        gone = dict(RECORD, health={"status": "dead"})
        self.assertIn("status: deprecated", self.frontmatter(gone))
        draft = dict(RECORD, needs_review=True)
        self.assertIn("status: draft", self.frontmatter(draft))

    def test_stale_after_is_an_absolute_date_a_year_out(self):
        self.assertIn("stale_after: 2027-08-03", self.frontmatter())

    def test_sources_records_where_the_bytes_came_from(self):
        block = self.frontmatter()
        self.assertIn("sources:", block)
        self.assertIn("id: original", block)
        self.assertIn("id: canonical", block)

    def test_the_archives_own_custom_keys_survive(self):
        """OKF permits custom fields and requires consumers to preserve them."""
        block = self.frontmatter()
        for field in ("content_sha256:", "depth:", "cited_by:", "retrieved_kind:"):
            self.assertIn(field, block)


class TestPlaceholderSectionsAreGone(unittest.TestCase):
    def test_an_unwritten_section_is_omitted_rather_than_stubbed(self):
        """988 copies of "_Not yet written._" taught a reader to skip the top of
        every file."""
        record = {key: value for key, value in RECORD.items()
                  if key not in ("why", "summary")}
        text = render.render(record, CONTENT, "full")
        self.assertNotIn("Not yet written", text)
        self.assertNotIn("## Why it is on the list", text)
        self.assertNotIn("## Summary", text)

    def test_a_written_section_still_appears(self):
        record = dict(RECORD, why="Backs the CL.0 desync entry.",
                      summary="How a front end and a back end disagree.")
        text = render.render(record, CONTENT, "full")
        self.assertIn("## Why it is on the list", text)
        self.assertIn("Backs the CL.0 desync entry.", text)
        self.assertIn("## Summary", text)


class TestATranslationAndItsOriginal(unittest.TestCase):
    """A translated reference is TWO documents of one artifact: the source's own
    words, and the English beside them under a `_translate` name. Maintainer
    decision, 2026-08-06, replacing the single dual-language file - which could
    not be linked to, printed or read cleanly as either one."""

    FOREIGN = "本系列是笔者对 HTTP 请求走私的学习笔记。\n"
    ENGLISH = "This series is the author's notes on HTTP request smuggling.\n"

    def _record(self):
        return dict(RECORD, language="zh-cn", translation=self.ENGLISH)

    def _original(self):
        return render.render(self._record(), self.FOREIGN, "full")

    def _english(self):
        return render.render_translation(self._record(), self.ENGLISH, "full")

    def test_the_original_file_holds_only_the_source_words(self):
        text = self._original()
        self.assertIn(self.FOREIGN.strip(), text)
        self.assertNotIn(self.ENGLISH.strip(), text)

    def test_the_translated_file_holds_only_the_english(self):
        text = self._english()
        self.assertIn(self.ENGLISH.strip(), text)
        self.assertNotIn(self.FOREIGN.strip(), text)

    def test_each_file_points_at_the_other(self):
        """Either half can be opened alone and still lead to its partner."""
        translated_name = RECORD["slug"] + "_translate.md"
        self.assertIn(translated_name, self._original())
        self.assertIn(RECORD["slug"] + ".md", self._english())

    def test_the_pairing_is_declared_in_the_frontmatter(self):
        self.assertIn("translation_file: " + RECORD["slug"] + "_translate.md",
                      self._original())
        self.assertIn("translation_of: " + RECORD["slug"] + ".md", self._english())

    def test_the_translated_file_carries_its_own_slug(self):
        """It is a file in its own right, so the orphan sweep and the index can
        both name it without reconstructing the suffix."""
        self.assertIn("slug: " + RECORD["slug"] + "_translate", self._english())

    def test_the_translated_file_still_names_its_source(self):
        """It is the file a reader is most likely to open, so attribution is not
        optional on it either."""
        text = self._english()
        self.assertIn(RECORD["original_url"], text)
        render.check_attribution(text)

    def test_the_translated_file_marks_the_text_as_untrusted(self):
        self.assertIn("UNTRUSTED SOURCE TEXT", self._english())

    def test_an_empty_translation_is_refused(self):
        with self.assertRaises(ValueError):
            render.render_translation(self._record(), "   ", "full")

    def test_translation_body_recovers_the_exact_rendered_prose(self):
        self.assertEqual(self.ENGLISH.strip(), render.translation_body(self._english()))

    def test_translation_body_refuses_an_unrecognised_file(self):
        with self.assertRaisesRegex(ValueError, "content boundary"):
            render.translation_body("# Not an archived translation")

    def test_an_untranslated_reference_has_one_plain_content_section(self):
        text = render.render(dict(RECORD), CONTENT, "full")
        self.assertIn("## Content\n", text)
        self.assertNotIn("## Content (original)", text)
        self.assertIn('translation_file: ""', text)
