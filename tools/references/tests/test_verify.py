"""The offline gate, including proof that its boundary detector actually fires.

`test_boundary.py` exempts `verify.py` from the "no skill path in code" scan,
because a detector has to name what it forbids. This file is what stops that
exemption from hiding a broken detector: it plants each violation and asserts
the detector reports it.
"""

from . import support  # noqa: F401

import tempfile
import unittest
from pathlib import Path

from refslib import manifest as manifest_module
from refslib import verify
from refslib.store import Store

CONFIG = {"curated_documents": ["docs/list.md"], "archive_dir": "docs/archived-references"}


class TestBoundaryDetector(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)

    def test_a_hard_coded_skill_path_is_reported(self):
        support.write(self.root, "mod.py", 'LEDGER = "' + ".claude/skills" + '/x/log.json"\n')
        findings = verify._check_boundary(self.root, tool_dir=str(self.root))
        self.assertTrue(any("skill path in code" in item.what for item in findings))

    def test_a_sys_path_towards_the_skill_is_reported(self):
        support.write(self.root, "mod.py", 'import sys\nsys.path.insert(0, "../.claude/x")\n')
        findings = verify._check_boundary(self.root, tool_dir=str(self.root))
        self.assertTrue(any("sys.path" in item.what for item in findings))

    def test_ordinary_code_is_not_reported(self):
        support.write(self.root, "mod.py", 'VALUE = "harmless"\n')
        self.assertEqual(verify._check_boundary(self.root, tool_dir=str(self.root)), [])


class TestCuratedDocuments(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        support.write(self.root, "docs/list.md", "- <https://example.org/a>\n")

    def test_an_unmodified_document_passes(self):
        before = verify.curated_fingerprints(self.root, CONFIG)
        findings = verify._check_curated_untouched(self.root, CONFIG, before)
        self.assertEqual(findings, [])

    def test_a_modified_curated_document_fails(self):
        before = verify.curated_fingerprints(self.root, CONFIG)
        support.write(self.root, "docs/list.md", "- <https://example.org/a> [archive](x)\n")
        findings = verify._check_curated_untouched(self.root, CONFIG, before)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].level, "fail")
        self.assertIn("curation", findings[0].detail)


class TestPublishedAttribution(unittest.TestCase):
    """The archive publishes full content, so every file must name its source.
    That makes attribution the mitigation, and a mitigation gets a gate."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        self.config = {"archive_dir": "docs/archived-references"}

    def render_one(self):
        from refslib import render
        record = {
            "slug": "a", "title": "A Title", "authors": ["An Author"],
            "publisher": "A Publisher", "published": "2019-01-01",
            "original_url": "https://example.org/post",
            "retrieved_kind": "live", "retrieved_utc": "2026-08-03T00:00:00Z",
        }
        return render.render(record, "body text", "full")

    def test_a_properly_attributed_file_passes(self):
        support.write(self.root, "docs/archived-references/a.md", self.render_one())
        self.assertEqual(verify.check_published_attribution(self.root, self.config), [])

    def test_a_file_whose_attribution_was_hand_edited_away_fails(self):
        damaged = self.render_one().replace("- Original: <", "- See: <")
        support.write(self.root, "docs/archived-references/a.md", damaged)
        findings = verify.check_published_attribution(self.root, self.config)
        self.assertTrue(any("missing attribution" in item.what for item in findings))

    def test_a_file_that_lost_its_rights_line_fails(self):
        damaged = self.render_one().replace("Rights remain with the original author", "-")
        support.write(self.root, "docs/archived-references/a.md", damaged)
        self.assertTrue(verify.check_published_attribution(self.root, self.config))

    def test_this_machines_own_path_in_a_published_file_fails(self):
        text = self.render_one() + "\nSaved from %s\\page.html\n" % self.root
        support.write(self.root, "docs/archived-references/a.md", text)
        findings = verify.check_published_attribution(self.root, self.config)
        self.assertTrue(any("local path" in item.what for item in findings))

    def test_a_payload_example_path_inside_archived_content_is_not_a_leak(self):
        """An article about the SharePoint ToolShell chain is full of C:\\Windows paths.
        That is the research material. A shape-based rule reported seven good
        files as leaks, which is why this compares against the real machine
        paths instead."""
        text = self.render_one() + "\n```\nrundll32 C:\\Windows\\Temp\\payload.dll\n```\n"
        support.write(self.root, "docs/archived-references/a.md", text)
        self.assertEqual(verify.check_published_attribution(self.root, self.config), [])

    def test_this_machines_path_inside_a_fenced_transcript_is_not_a_leak(self):
        text = self.render_one() + "\n```\nerror at %s/script.py:10\n```\n" % self.root
        support.write(self.root, "docs/archived-references/a.md", text)
        self.assertEqual(verify.check_published_attribution(self.root, self.config), [])

    def test_the_generated_index_is_not_required_to_carry_attribution(self):
        support.write(self.root, "docs/archived-references/README.md", "# Index\n")
        self.assertEqual(verify.check_published_attribution(self.root, self.config), [])


class TestManifestAndStore(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        self.store = Store(self.root / "store")
        self.manifest = manifest_module.Manifest(self.root / "manifest.json")

    def test_a_missing_store_object_fails(self):
        entry = self.manifest.entry("https://example.org/a")
        entry["cited_by"] = ["docs/list.md:1"]
        entry["raw_sha256"] = "0" * 64
        self.manifest.record("https://example.org/a", "check", status="ok")
        findings = verify._check_store(self.manifest, self.store)
        self.assertTrue(any("missing store object" in item.what for item in findings))

    def test_a_tampered_store_object_fails(self):
        digest = self.store.put(b"real bytes")
        with open(self.store.path_for(digest), "wb") as handle:
            handle.write(b"tampered")
        entry = self.manifest.entry("https://example.org/a")
        entry["raw_sha256"] = digest
        findings = verify._check_store(self.manifest, self.store)
        self.assertTrue(any("does not match its hash" in item.what for item in findings))

    def test_a_preserved_figure_or_paper_is_not_an_orphan(self):
        """Both live one level down, in `images` and `paper`. Reading only the
        entry's own `*_sha256` fields reported 2,712 preserved figures as
        unreferenced - and that report is what a store cleanup would read."""
        figure = self.store.put(b"a figure")
        paper = self.store.put(b"%PDF- a paper")
        entry = self.manifest.entry("https://example.org/a")
        entry["paper"] = {"sha256": paper}
        entry["images"] = {"https://example.org/1.png": {"sha256": figure}}
        findings = verify._check_store(self.manifest, self.store)
        self.assertEqual([item for item in findings if item.level == "fail"], [])
        self.assertEqual(findings, [])

    def test_a_figure_the_store_lost_is_reported(self):
        entry = self.manifest.entry("https://example.org/a")
        entry["images"] = {"https://example.org/1.png": {"sha256": "0" * 64}}
        findings = verify._check_store(self.manifest, self.store)
        self.assertTrue(any("missing store object" in item.what for item in findings))

    def test_an_orphan_object_is_a_warning_and_survives(self):
        orphan = self.store.put(b"orphan")
        findings = verify._check_store(self.manifest, self.store)
        self.assertTrue(any(item.level == "warn" for item in findings))
        self.assertTrue(self.store.has(orphan))

    def test_a_blocked_row_carrying_a_capture_fails(self):
        key = "https://example.org/a"
        entry = self.manifest.entry(key)
        entry["cited_by"] = ["docs/list.md:1"]
        entry["health"] = {"status": "blocked"}
        entry["snapshot"] = "20240101000000"
        self.manifest.record(key, "check", status="blocked")
        findings = verify._check_manifest(self.manifest)
        self.assertTrue(any("selected a capture" in item.what for item in findings))

    def test_an_absolute_path_in_the_manifest_fails(self):
        key = "https://example.org/a"
        entry = self.manifest.entry(key)
        entry["cited_by"] = ["C:\\Users\\someone\\notes.md:1"]
        self.manifest.record(key, "check", status="ok")
        findings = verify._check_manifest(self.manifest)
        self.assertTrue(any("absolute path" in item.what for item in findings))


if __name__ == "__main__":
    unittest.main()


class TestPdfsOlderThanTheirInputs(unittest.TestCase):
    """`papers` and `images` change what a PDF should contain without touching
    the file. Nothing else notices, and the site then serves a document that no
    longer matches its own archive."""

    def manifest_with(self, entry):
        # A reference `pdf` would actually select: it has a document, and it is
        # not a talk. The gate applies the command's own exclusions.
        entry.setdefault("grade", "research")
        entry.setdefault("content_sha256", "text1")
        entry.setdefault("kind", "article")
        return manifest_module.Manifest(Path("unused.json"),
                                        data={"urls": {"https://x.test/a": entry}})

    def test_a_talk_the_command_never_prints_is_not_reported(self):
        """`pdf` skips a video, so asking for its reprint is work nobody can do."""
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "talk", "kind": "video",
            "steps": {"pdf": {"result": "rendered", "source": "markdown",
                              "utc": "2026-08-01T00:00:00+00:00"}}}))
        self.assertEqual(findings, [])

    def test_a_record_with_no_document_is_not_reported(self):
        findings = verify._check_pdfs_are_current(manifest_module.Manifest(
            Path("unused.json"), data={"urls": {"https://x.test/a": {
                "slug": "row", "kind": "article",
                "steps": {"pdf": {"result": "rendered", "source": "markdown",
                                  "utc": "2026-08-01T00:00:00+00:00"}}}}}))
        self.assertEqual(findings, [])

    def test_a_pdf_printed_before_its_figures_were_preserved_is_reported(self):
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "post",
            "steps": {"pdf": {"result": "rendered", "source": "markdown",
                              "utc": "2026-08-01T00:00:00+00:00"},
                      "images": {"result": "stored",
                                 "utc": "2026-08-10T00:00:00+00:00"}}}))
        self.assertTrue(any("older than their inputs" in item.what for item in findings))

    def test_a_pdf_printed_after_them_is_not(self):
        from refslib import makepdf
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "post",
            "steps": {"pdf": {"result": "rendered", "source": "markdown",
                              "renderer": makepdf.RENDERER,
                              "utc": "2026-08-10T12:00:00+00:00"},
                      "images": {"result": "stored",
                                 "utc": "2026-08-10T00:00:00+00:00"}}}))
        self.assertEqual(findings, [])

    def test_a_pdf_from_an_older_converter_is_reported(self):
        """A converter fix changes the output without touching the Markdown, so
        no timestamp can see it. 12% of this archive's link annotations pointed
        at a double-escaped URL until one such fix landed."""
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "post",
            "steps": {"pdf": {"result": "rendered", "source": "markdown",
                              "utc": "2026-08-10T12:00:00+00:00"}}}))
        self.assertTrue(any("older than their inputs" in item.what for item in findings))

    def test_a_text_render_standing_in_for_a_held_paper_is_reported(self):
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "post",
            "paper": {"sha256": "paper1"},
            "steps": {"pdf": {"result": "rendered", "source": "markdown",
                              "utc": "2026-08-10T00:00:00+00:00"}}}))
        self.assertTrue(any("older than their inputs" in item.what for item in findings))

    def test_a_source_that_is_itself_a_pdf_is_never_stale(self):
        findings = verify._check_pdfs_are_current(self.manifest_with({
            "slug": "paper",
            "steps": {"pdf": {"result": "copied", "source": "original-pdf",
                              "utc": "2026-08-01T00:00:00+00:00"},
                      "images": {"result": "stored",
                                 "utc": "2026-08-10T00:00:00+00:00"}}}))
        self.assertEqual(findings, [])


class TestUntranslatedDocumentsAreReported(unittest.TestCase):
    """Acquiring, classifying and rendering a foreign write-up all succeed on
    their own, so the result LOOKS finished. Only a reader who cannot read it
    finds out. The gate asks every time instead of trusting whoever ran it."""

    CHINESE = "请求走私漏洞的利用方式与防御措施分析报告，包含完整的攻击链说明。" * 6
    ENGLISH = "The front end forwards the smuggled prefix to the back end here. " * 20

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        self.store = Store(self.root / "store")
        self.manifest = manifest_module.Manifest(self.root / "manifest.json")

    def _add(self, url, text, **fields):
        entry = self.manifest.entry(url)
        entry["content_sha256"] = self.store.put_text(text)
        entry.update(fields)
        return entry

    def test_a_foreign_document_with_no_translation_is_reported(self):
        self._add("https://example.cn/a", self.CHINESE, slug="cn-post")
        findings = verify._check_translations(self.manifest, self.store)
        self.assertTrue(any("untranslated" in item.what for item in findings))

    def test_one_that_has_a_translation_is_not(self):
        self._add("https://example.cn/a", self.CHINESE, slug="cn-post",
                  translation_sha256=self.store.put_text("An English rendering."))
        self.assertEqual(verify._check_translations(self.manifest, self.store), [])

    def test_an_english_document_is_not(self):
        self._add("https://example.org/a", self.ENGLISH, slug="en-post")
        self.assertEqual(verify._check_translations(self.manifest, self.store), [])

    def test_an_explicitly_excluded_foreign_capture_is_not_translation_work(self):
        self._add("https://example.cn/wall", self.CHINESE, slug="excluded-wall",
                  decision={"outcome": "skip", "class": "derivative"})
        self.assertEqual(verify._check_translations(self.manifest, self.store), [])

    def test_a_declared_english_page_that_is_not_english_is_still_reported(self):
        """Medium serves every post as `lang="en"`. Believing that is how a
        Vietnamese write-up sat in the archive untranslated."""
        self._add("https://example.com/a", self.CHINESE, slug="medium-post",
                  language="en")
        findings = verify._check_translations(self.manifest, self.store)
        self.assertTrue(any("untranslated" in item.what for item in findings))

    def test_a_verified_bilingual_page_with_complete_english_is_exempt(self):
        """A source that publishes its full English text beside the original
        must not be replaced by a redundant machine translation."""
        bilingual = self.CHINESE + "\n\n" + self.ENGLISH
        self._add("https://example.cn/bilingual", bilingual, slug="bilingual-post",
                  language="en", translation_exempt=True)
        self.assertEqual(verify._check_translations(self.manifest, self.store), [])

    def test_an_english_document_quoting_another_script_is_not_work(self):
        """The gate must ask the same question `translate` answers. Asking the
        looser one demanded a translation for every English write-up that quotes
        a Chinese error message - work the pipeline correctly refuses to do, so
        the warning could never be cleared."""
        article = "\n\n".join([self.ENGLISH] * 10) + "\n\n错误信息如下\n"
        self._add("https://example.org/b", article, slug="en-post-with-a-quote")
        self.assertEqual(verify._check_translations(self.manifest, self.store), [])


class TestOrphansFollowTheLastAcquire(unittest.TestCase):
    """Measured: three references whose acquire had since FAILED still carried a
    file from an earlier successful run. The index already refused to list them,
    so nothing linked to them and nothing swept them. One rule now governs both:
    a file is listed exactly when it exists."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.config = {"archive_dir": "archive"}
        # Files are filed under the year list that cites them, in the Markdown
        # tree (see refslib/collections.py), so the fixture cites a year and
        # writes there.
        (self.root / "archive" / "md" / "2020").mkdir(parents=True)
        self.manifest = manifest_module.Manifest(self.root / "archive" / "manifest.json")

    def entry(self, key, slug, result, content="sha-of-content"):
        entry = self.manifest.entry(key)
        entry["slug"] = slug
        entry["grade"] = "research"
        entry["cited_by"] = ["2020.md:1"]
        if content:
            entry["content_sha256"] = content
        self.manifest.record(key, "acquire", result=result)
        (self.root / "archive" / "md" / "2020" / (slug + ".md")).write_text("x", encoding="utf-8")

    def test_a_file_kept_by_a_stored_entry_is_not_an_orphan(self):
        self.entry("https://example.org/a", "kept", "stored")
        self.assertEqual(verify.orphans(self.root, self.config, self.manifest), [])

    def test_a_transient_failure_does_NOT_orphan_the_document_it_already_had(self):
        """The GitHub API's unauthenticated limit is 60 requests an hour, and
        hitting it made ten references "fail"; the sweep then deleted all ten
        files, each of which had a perfectly good slug, grade and stored
        content. A failure is not evidence that what we hold is wrong."""
        self.entry("https://example.org/b", "held", "failed")
        self.assertEqual(verify.orphans(self.root, self.config, self.manifest), [])

    def test_a_withdrawn_document_IS_an_orphan(self):
        """A rule-driven refusal - a broken capture - clears the grade, and then
        the file must go."""
        self.entry("https://example.org/c", "withdrawn", "failed")
        for entry in self.manifest.data["urls"].values():
            if entry.get("slug") == "withdrawn":
                entry["grade"] = None
        stale = verify.orphans(self.root, self.config, self.manifest)
        self.assertEqual([Path(path).name for path in stale], ["withdrawn.md"])

    def test_an_entry_that_never_had_content_claims_no_file(self):
        self.entry("https://example.org/d", "never", "failed", content="")
        stale = verify.orphans(self.root, self.config, self.manifest)
        self.assertEqual([Path(path).name for path in stale], ["never.md"])

    def test_a_link_only_reference_still_claims_its_file(self):
        self.entry("https://example.org/e", "linked", "link-only", content="")
        self.assertEqual(verify.orphans(self.root, self.config, self.manifest), [])


class TestMalformedPublishedFiles(unittest.TestCase):
    """Each of these was found in the corpus by a sweep, and each names a bug
    upstream rather than a taste preference. The rules are deliberately narrow:
    a looser sweep produced 138 "ends mid-sentence" findings that were all page
    footers, and called an inline ```code``` span an unbalanced fence."""

    def page(self, document):
        return "---\ntitle: A\n---\n\n## Content\n\n" + document

    def test_a_body_decoded_from_compressed_bytes_fails(self):
        """A gzip body the client never unwrapped: 2,977 replacement characters
        in 6,230, which passes every check that only looks at length."""
        found = verify.malformed(self.page("\ufffd" * 200 + "index.html"))
        self.assertEqual(found[0][0], "fail")
        self.assertIn("replacement characters", found[0][1])

    def test_a_page_with_a_few_odd_characters_is_not_flagged(self):
        self.assertEqual(verify.malformed(self.page("real prose " * 200 + "\ufffd")), [])

    def test_unescaped_entities_are_a_warning(self):
        found = verify.malformed(self.page("code: " + "&lt;T&gt; " * 20))
        self.assertTrue(any("entities" in what for _level, what, _d in found))

    def test_an_occasional_entity_is_not_a_finding(self):
        self.assertEqual(verify.malformed(self.page("a &amp; b " + "prose " * 200)), [])

    def test_an_escaped_payload_among_literal_markup_is_the_research(self):
        """Feed injection works by putting `&lt;script&gt;` INSIDE an XML
        element, so a paper about it quotes escaped payloads on purpose.
        Unescaping those would rewrite the technique. A conversion that escaped
        a document's markup by mistake escapes ALL of it: the RSS paper carries
        34 escaped brackets against 325 literal ones."""
        feed = ("<rss version=\"2.0\"> <channel> <title> "
                "&lt;script&gt;alert('t')&lt;/script&gt; </title> "
                "<link>http://example.test/</link> <description> "
                "&lt;script&gt;alert('d')&lt;/script&gt; </description> "
                "</channel> </rss> " + "<item> <title>t</title> </item> " * 40)
        found = verify.malformed(self.page(feed))
        self.assertEqual([f for f in found if "entities" in f[1]], [])

    def test_a_document_whose_whole_markup_was_escaped_is_still_a_warning(self):
        found = verify.malformed(self.page("&lt;div&gt;&lt;p&gt;text&lt;/p&gt;&lt;/div&gt; " * 8))
        self.assertTrue(any("entities" in what for _level, what, _d in found))

    def test_an_unclosed_code_fence_is_a_warning(self):
        found = verify.malformed(self.page("```csharp\nvar x = 1;\n"))
        self.assertTrue(any("code fence" in what for _level, what, _d in found))

    def test_an_inline_triple_backtick_span_is_not_an_unclosed_fence(self):
        """```mvn clean package``` on one line is a span, not a block, and
        counting it made two correct files look unbalanced."""
        self.assertEqual(verify.malformed(self.page("run ```mvn clean package``` first")), [])

    def test_balanced_fences_are_fine(self):
        self.assertEqual(verify.malformed(self.page("```csharp\nvar x = 1;\n```\n")), [])

    def test_an_indented_fence_still_counts(self):
        """CommonMark allows a fence up to three spaces in. One article's
        second block was indented a single space, so nine of its ten fences
        were counted and a balanced file was reported unclosed."""
        self.assertEqual(
            verify.malformed(self.page("```bash\nls\n```\n\n ```bash\nls\n ```\n")), [])

    def test_image_bytes_decoded_as_text_are_not_a_fence(self):
        """A PDF whose embedded images decoded as text carries runs like
        ```GGG\xff\xff\xff. That is image bytes, not an info string."""
        self.assertEqual(
            verify.malformed(self.page("```GGGÿÿÿ¤¤¤\n")), [])
