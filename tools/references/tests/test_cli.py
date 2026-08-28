"""Command-line recovery selectors."""

import inspect
import types
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

import refs
from refslib import tags as tags_module


class _Store(object):
    def __init__(self, held=()):
        self.held = set(held)

    def has(self, digest):
        return digest in self.held


class RecoverySelectorTests(unittest.TestCase):
    def test_missing_store_keys_only_names_rows_with_lost_evidence(self):
        manifest = types.SimpleNamespace(data={"urls": {
            "complete": {"raw_sha256": "raw", "content_sha256": "content"},
            "lost": {"raw_sha256": "gone", "content_sha256": "content"},
            "never-acquired": {},
        }})
        self.assertEqual({"lost"}, refs._missing_store_keys(
            manifest, _Store(("raw", "content"))))

    def test_a_lost_store_object_reopens_a_hand_import_without_redo(self):
        entry = {"raw_sha256": "gone", "content_sha256": "content",
                 "grade": "research", "steps": {
                     "acquire": {"result": "stored"},
                     "import": {"result": "stored"}}}
        self.assertTrue(refs._import_needs_content(
            entry, _Store(("content",)), redo=False))

    def test_check_and_acquire_accept_missing_store_selector(self):
        parser = refs.build_parser()
        self.assertTrue(parser.parse_args(["check", "--missing-store"]).missing_store)
        self.assertTrue(parser.parse_args(["acquire", "--missing-store"]).missing_store)
        self.assertTrue(parser.parse_args(["acquire", "--browser-dom"]).browser_dom)
        acquired = parser.parse_args(
            ["acquire", "--faulty-captures", "--wayback-capture", "--document-gaps",
             "--linked-document-url", "https://authors.example/paper.pdf",
             "--also-at", "https://authors.example/code"])
        self.assertTrue(acquired.faulty_captures)
        self.assertTrue(acquired.wayback_capture)
        self.assertTrue(acquired.document_gaps)
        self.assertEqual("https://authors.example/paper.pdf",
                         acquired.linked_document_url)
        self.assertEqual(["https://authors.example/code"], acquired.also_at)
        self.assertTrue(parser.parse_args(
            ["acquire", "--clear-linked-document"]).clear_linked_document)
        self.assertTrue(parser.parse_args(["translate", "--render"]).render)
        self.assertTrue(parser.parse_args(
            ["pdf", "--translations-only"]).translations_only)
        imported = parser.parse_args(
            ["import", "--redo", "--only", "one.example", "/tmp/import"])
        self.assertTrue(imported.redo)
        self.assertEqual("one.example", imported.only)
        wayback = parser.parse_args(
            ["wayback", "--faulty-captures", "--after", "old.example", "--limit", "25"])
        self.assertTrue(wayback.faulty_captures)
        self.assertEqual("old.example", wayback.after)
        self.assertEqual(25, wayback.limit)
        historical = parser.parse_args(
            ["historical-urls", "--only", "old.example",
             "--limit-requests", "12", "--limit-results", "34"])
        self.assertEqual("old.example", historical.only)
        self.assertEqual(12, historical.limit_requests)
        self.assertEqual(34, historical.limit_results)

    def test_acquire_after_selector_resumes_strictly_after_match(self):
        entries = [("alpha", {}), ("legacy.example/dead", {}), ("omega", {})]
        self.assertEqual([("omega", {})], refs._entries_after(entries, "LEGACY.EXAMPLE"))
        with self.assertRaisesRegex(Exception, "matched no manifest identity"):
            refs._entries_after(entries, "absent")

    def test_faulty_capture_never_sets_a_replacement_size_floor(self):
        entry = {"steps": {"acquire": {"result": "stored"}},
                 "content_gap": "faulty capture: parked domain; recover it"}
        self.assertFalse(refs._held_capture_is_readable(entry))
        entry["content_gap"] = ""
        self.assertTrue(refs._held_capture_is_readable(entry))

    def test_title_override_rebuilds_a_stale_slug_without_suffix_creep(self):
        record = {"title": "Recovered title", "slug": "casino-sale",
                  "publisher": "SecTheory", "published": "2008-05-16"}
        entry = {"slug": "casino-sale"}
        refs._apply_title_override(record, entry, "Recovered title", {"casino-sale"})
        self.assertEqual("2008-sectheory-recovered-title", record["slug"])

    def test_a_rerender_keeps_the_date_the_manifest_still_holds(self):
        """A moved page that declares no date must not blank a known one."""
        entry = {"published": "2023-04-27", "publisher": "NCC Group Research Blog",
                 "licence": "unknown", "language": "en", "authors": ["Roger Meyer"]}
        record = {"published": "", "publisher": "nccgroup.com", "authors": []}
        refs._carry_preserved_facts(record, entry)
        self.assertEqual("2023-04-27", record["published"])
        self.assertEqual(["Roger Meyer"], record["authors"])
        self.assertEqual("en", record["language"])
        # a fact the fetch DID find still wins
        self.assertEqual("nccgroup.com", record["publisher"])

    def test_refetching_the_same_bytes_keeps_the_filed_fault(self):
        """Identical bytes prove the run fixed nothing, so the report stands."""
        entry = {"content_gap": "faulty capture: this is the teaser; re-acquire",
                 "raw_sha256": "same"}
        record = {"raw_sha256": "same", "content_gap": ""}
        self.assertEqual("faulty capture: this is the teaser; re-acquire",
                         refs._gap_after_acquire(entry, record, "same"))

    def test_a_fetch_that_brought_new_bytes_can_clear_the_gap(self):
        """The original behaviour survives: a gap must still be clearable."""
        entry = {"content_gap": "faulty capture: this is the teaser; re-acquire",
                 "raw_sha256": "fresh"}
        record = {"raw_sha256": "fresh", "content_gap": ""}
        self.assertEqual("", refs._gap_after_acquire(entry, record, "stale"))

    def test_a_gap_the_run_itself_found_is_still_recorded(self):
        entry = {"content_gap": "", "raw_sha256": "same"}
        record = {"raw_sha256": "same", "content_gap": "we only have a page about it"}
        self.assertEqual("we only have a page about it",
                         refs._gap_after_acquire(entry, record, "same"))

    def test_a_rerender_keeps_the_summary_the_manifest_still_holds(self):
        """A re-acquire must not republish the document with no description.

        A fetch never produces a digest, so before this the re-render dropped
        `description` and every research tag from the published file while the
        summary sat untouched in the manifest.
        """
        digest = {"text": "A summary.", "tags": ["desync"],
                  "of": "abc123"}
        entry = {"digest": digest}
        record = {"content_sha256": "abc123"}
        refs._carry_preserved_facts(record, entry)
        self.assertEqual(digest, record["digest"])

    def test_a_summary_written_from_other_bytes_is_not_carried(self):
        """New content must not inherit the old content's summary."""
        entry = {"digest": {"text": "Describes the OLD page.", "tags": ["xss"],
                            "of": "old-sha"}}
        record = {"content_sha256": "new-sha"}
        refs._carry_preserved_facts(record, entry)
        self.assertNotIn("digest", record)

    def test_a_stated_byline_reaches_both_the_entry_and_the_rendered_record(self):
        entry, record = {"authors": []}, {"authors": []}
        applied = refs._apply_attribution_override(
            entry, {"authors": ["Alex Example"]}, record)
        self.assertTrue(applied)
        self.assertEqual(["Alex Example"], entry["authors"])
        self.assertEqual(["Alex Example"], record["authors"])

    def test_a_stated_publisher_outranks_the_squatter_that_answered(self):
        entry = {"publisher": "DomainsForSale"}
        refs._apply_attribution_override(entry, {"publisher": "example.test"})
        self.assertEqual("example.test", entry["publisher"])

    def test_an_absent_decision_leaves_extracted_attribution_alone(self):
        entry = {"authors": ["Extracted Name"], "publisher": "example.test"}
        self.assertFalse(refs._apply_attribution_override(entry, None))
        self.assertFalse(refs._apply_attribution_override(entry, {"title": "Only a title"}))
        self.assertEqual(["Extracted Name"], entry["authors"])
        self.assertEqual("example.test", entry["publisher"])

    def test_a_blank_curated_name_is_not_an_attribution(self):
        entry = {"authors": ["Extracted Name"]}
        self.assertFalse(refs._apply_attribution_override(entry, {"authors": ["", "  "]}))
        self.assertEqual(["Extracted Name"], entry["authors"])

    def test_curated_names_are_copied_not_shared_with_the_decision(self):
        judged = {"authors": ["Alex Example"]}
        entry = {}
        refs._apply_attribution_override(entry, judged)
        entry["authors"].append("Someone Else")
        self.assertEqual(["Alex Example"], judged["authors"])

    def test_an_emptied_decision_withdraws_a_name_the_archive_got_wrong(self):
        # Reading only truthy values left a misattribution un-retractable: the
        # correction restored silence, and silence read as "nothing to say".
        entry = {"authors": ["Wrong Person"], "publisher": "wrong.example"}
        self.assertTrue(refs._apply_attribution_override(entry, {"authors": []}))
        self.assertEqual([], entry["authors"])
        self.assertTrue(refs._apply_attribution_override(entry, {"publisher": ""}))
        self.assertEqual("", entry["publisher"])

    def test_a_stated_publisher_moving_a_corrected_slug_is_reported(self):
        entry = {"slug": "2008-hugedomains-com-recovered-title",
                 "publisher": "Aspect Security", "published": "2008-05-16"}
        self.assertEqual("2008-aspect-security-recovered-title",
                         refs._slug_after_attribution(entry, {"title": "Recovered title"}))

    def test_attribution_without_a_title_correction_renames_nothing(self):
        entry = {"slug": "2008-aspect-security-recovered-title",
                 "publisher": "Aspect Security", "published": "2008-05-16"}
        self.assertEqual("", refs._slug_after_attribution(entry, {"authors": ["Alex Example"]}))
        self.assertEqual("", refs._slug_after_attribution(
            entry, {"title": "Recovered title"}))

    def test_recording_attribution_twice_finds_nothing_the_second_time(self):
        urls = {"https://one.example/a": {"authors": [], "publisher": "squatter.example"}}
        decisions = {"https://one.example/a": {"authors": ["Alex Example"],
                                               "publisher": "example.test"}}
        first = refs._attribution_changes(urls, decisions)
        self.assertEqual(1, len(first))
        self.assertEqual((["Alex Example"], "example.test"), first[0][2])
        self.assertEqual([], refs._attribution_changes(urls, decisions))

    def test_a_withdrawal_counts_as_a_change_to_record(self):
        urls = {"https://one.example/a": {"authors": ["Wrong Person"]}}
        changes = refs._attribution_changes(urls, {"https://one.example/a": {"authors": []}})
        self.assertEqual(1, len(changes))
        self.assertEqual([], changes[0][2][0])

    def test_attribution_accepts_the_dry_run_selector(self):
        self.assertTrue(refs.build_parser().parse_args(["attribution", "--check"]).check)

    def test_the_byline_excerpt_starts_after_our_own_attribution_block(self):
        # Handing a reader our "Author not stated" line gets it read back.
        from refslib import render as render_module
        text = ('---\nslug: example\nauthors: []\n---\n\n# Example\n\n'
                '**Example** - Author not stated, example.test.\n\n'
                + render_module.BANNER + '\nBy Alex Example. The real article.\n')
        excerpt = refs._byline_excerpt(text)
        self.assertNotIn("Author not stated", excerpt)
        self.assertTrue(excerpt.startswith("By Alex Example"), excerpt[:40])

    def test_the_byline_excerpt_keeps_link_text_and_drops_the_target(self):
        text = "Posted by [Alex Example](https://tracker.example/u?id=1) today."
        self.assertEqual("Posted by Alex Example today.", refs._byline_excerpt(text))

    def test_the_byline_excerpt_keeps_a_head_and_a_tail(self):
        # A whitepaper names its authors under the title and again in a closing
        # biography, so a head-only excerpt misses half the evidence.
        text = "HEAD " + ("filler " * 600) + "TAIL"
        excerpt = refs._byline_excerpt(text, head=40, tail=20)
        self.assertTrue(excerpt.startswith("HEAD"))
        self.assertTrue(excerpt.endswith("TAIL"))
        self.assertIn("[…]", excerpt)

    def test_the_excerpt_reaches_a_byline_buried_in_a_long_document(self):
        """Head-and-tail alone hid a byline from 130 of 536 documents: an author
        block partway down, an acknowledgements section, a closing credit."""
        body = ("opening. " * 200) + " About the author: Alex Example writes here. " \
               + ("filler. " * 400) + " closing words."
        excerpt = refs._byline_excerpt(body)
        self.assertIn("Alex Example", excerpt)
        self.assertTrue(excerpt.startswith("opening."))
        self.assertTrue(excerpt.endswith("closing words."))

    def test_the_excerpt_stays_bounded_when_a_document_says_by_constantly(self):
        body = "start. " + ("by Someone Named Here and more text. " * 400) + " end."
        self.assertLess(len(refs._byline_excerpt(body)), 3000)

    def test_a_read_byline_is_refused_without_the_words_it_was_read_from(self):
        known = {"https://one.example/a": {}}
        good = {"authors": ["Alex Example"], "evidence": "By Alex Example",
                "confidence": "high"}
        self.assertEqual("", refs._accept_byline("https://one.example/a", good, known))
        self.assertTrue(refs._accept_byline("https://two.example/b", good, known))
        self.assertTrue(refs._accept_byline(
            "https://one.example/a", dict(good, evidence=" "), known))
        self.assertTrue(refs._accept_byline(
            "https://one.example/a", dict(good, confidence="medium"), known))
        self.assertTrue(refs._accept_byline(
            "https://one.example/a",
            dict(good, authors=["https://spam.example/buy"]), known))

    def test_reading_that_the_document_names_nobody_is_a_real_answer(self):
        # Kept, so the next run does not ask the same question again; and it
        # needs no quotation, because there is nothing to quote.
        known = {"https://one.example/a": {}}
        self.assertEqual("", refs._accept_byline(
            "https://one.example/a", {"authors": [], "confidence": "low"}, known))

    def test_a_read_byline_never_reaches_the_grader(self):
        """The regression that cost 214 grades in one run.

        A reading was folded into `paths.decisions()`, so `grade.decide` saw an
        override carrying nothing but `authors`, defaulted its missing
        `outcome` to "skip", and excluded the document. Attribution must come
        back as attribution ONLY - no outcome, no class, no title - so it can
        never be mistaken for a whole judgement.
        """
        from refslib import grade as grade_module
        stated = refs.attribution_decision(
            "https://one.example/a", {}, {},
            {"https://one.example/a": {"authors": ["Alex Example"]}})
        self.assertEqual({"authors": ["Alex Example"]}, stated)
        self.assertNotIn("outcome", stated)
        self.assertNotIn("class", stated)
        # And an attribution-only override no longer reads as a judgement, so a
        # maintainer who hand-writes `authors` into overrides.json without an
        # outcome cannot silently exclude the document either.
        self.assertNotEqual("maintainer", grade_module.classify(
            "body text long enough to grade", url="https://one.example/a",
            override={"authors": ["Alex Example"]}).rule,
            "an override carrying only attribution must not decide the grade")
        self.assertEqual("maintainer", grade_module.classify(
            "body text", override={"outcome": "skip", "class": "derivative"}).rule,
            "a real judgement must still win outright")

    def test_a_hand_statement_outranks_a_read_one(self):
        entry, decisions = {}, {"https://one.example/a": {
            "outcome": "archive", "authors": ["Hand Stated"]}}
        readings = {"https://one.example/a": {"authors": ["Read From Text"]}}
        stated = refs.attribution_decision("https://one.example/a", entry,
                                           decisions, readings)
        self.assertEqual(["Hand Stated"], stated["authors"])

    def test_a_withdrawn_credit_is_not_undone_by_a_reading(self):
        # "authors": [] is a retraction. A reading must not put the name back.
        decisions = {"https://one.example/a": {"outcome": "archive", "authors": []}}
        readings = {"https://one.example/a": {"authors": ["Read From Text"]}}
        stated = refs.attribution_decision("https://one.example/a", {},
                                           decisions, readings)
        self.assertEqual([], stated["authors"])

    def test_a_reading_is_found_under_an_alternate_spelling(self):
        entry = {"spellings": ["https://one.example/a/"]}
        readings = {"https://one.example/a/": {"authors": ["Alex Example"]}}
        self.assertEqual(["Alex Example"], refs.attribution_decision(
            "https://one.example/a", entry, {}, readings)["authors"])

    def test_a_published_author_list_is_read_back_whole(self):
        """Reading only the tail of the `authors:` line reported every
        multi-name file as having none, so the rewrite kept re-attempting all
        1,085 of them and never settled."""
        many = 'slug: x\nauthors:\n  - Ada Lerner\n  - "Tadayoshi Kohno"\npublisher: x\n'
        self.assertEqual(["Ada Lerner", "Tadayoshi Kohno"], refs._published_authors(many))
        self.assertEqual(["Solo Name"], refs._published_authors("authors:\n  - Solo Name\nx: 1\n"))
        self.assertEqual([], refs._published_authors("authors: []\n"))
        self.assertEqual([], refs._published_authors("no frontmatter here"))

    def test_the_body_survives_a_byline_rewrite(self):
        from refslib import render as render_module
        text = ("---\nslug: x\n---\n\n# T\n\n" + render_module.BANNER
                + "\nThe source's own words.\n")
        self.assertEqual("The source's own words.", refs._published_body(text))
        self.assertIsNone(refs._published_body("nothing to recover"))

    def test_only_renderer_owned_lines_may_differ_on_rebuild(self):
        """A rebuild may refresh what the renderer owns and nothing else. A
        dropped field - a lost `snapshot`, a vanished `also_at` - must still
        refuse, which is what caught a record rebuilt without `cited_by`."""
        published = 'slug: x\nstatus: stable\ncited_by:\n  - "2011.md:49"\nsnapshot: "s"\n'
        refreshed = 'slug: x\nstatus: deprecated\ncited_by:\n  - "2011.md:46"\nsnapshot: "s"\n'
        self.assertTrue(refs._same_but_for_generated(refreshed, published))
        self.assertFalse(refs._same_but_for_generated(
            'slug: x\nstatus: stable\ncited_by:\n  - "2011.md:49"\n', published))

    def test_stale_is_its_own_authorisation_to_reprint(self):
        """`--stale` alone used to select the right references and then reprint
        none of them, because the exists-guard needed `--force` as well. It
        reported "0 rendered, N skipped", which reads as "nothing needed doing"."""
        parser = refs.build_parser()
        stale = parser.parse_args(["pdf", "--stale"])
        self.assertTrue(stale.stale)
        self.assertFalse(stale.force)
        source = inspect.getsource(refs.command_pdf)
        self.assertIn("not (args.force or args.stale)", source,
                      "the exists-guard must treat --stale as authorisation, or "
                      "`pdf --stale` silently reprints nothing at all")

    def test_bylines_takes_exactly_one_of_queue_or_apply(self):
        parser = refs.build_parser()
        self.assertEqual("q.json", parser.parse_args(["bylines", "--queue", "q.json"]).queue)
        self.assertEqual("r.json", parser.parse_args(["bylines", "--apply", "r.json"]).apply)
        with self.assertRaises(SystemExit):
            parser.parse_args(["bylines"])

    def test_frontmatter_scalar_reader_keeps_only_top_level_values(self):
        text = ('---\nslug: example\noriginal_url: "https://example.test/a:b"\n'
                'sources:\n  - id: original\nempty: ""\n---\n\n# Example\n')
        self.assertEqual(
            {"slug": "example", "original_url": "https://example.test/a:b",
             "empty": ""},
            refs._frontmatter_scalars(text))

    def test_completed_pdf_clears_only_a_pdf_absence_fault(self):
        with TemporaryDirectory() as folder:
            pdf = Path(folder) / "document.pdf"
            pdf.write_bytes(b"%PDF-1.7\n" + b"x" * 600)
            entry = {"content_gap":
                     "faulty capture: the generated PDF is absent; rebuild it"}
            self.assertTrue(refs._clear_completed_pdf_gap(entry, pdf))
            self.assertEqual("", entry["content_gap"])

            interactive = {"content_gap":
                           "faulty capture: the interactive citation redirects away "
                           "and the advertised PDF is absent"}
            self.assertFalse(refs._clear_completed_pdf_gap(interactive, pdf))
            self.assertTrue(interactive["content_gap"])

            not_pdf = Path(folder) / "wall.pdf"
            not_pdf.write_bytes(b"<html>" + b"x" * 600)
            missing = {"content_gap":
                       "faulty capture: the generated PDF is absent; rebuild it"}
            self.assertFalse(refs._clear_completed_pdf_gap(missing, not_pdf))


class DigestSummaryTests(unittest.TestCase):
    """The rules a summary must satisfy, and the ways trimming has gone wrong."""

    def test_keeps_a_summary_that_fits(self):
        text = "One sentence. And a second one."
        self.assertEqual(refs._trim_to_sentence(text), text)

    def test_collapses_whitespace_and_decodes_entities_once(self):
        # A reviewer quoting a payload writes it the way they read it in the page.
        self.assertEqual(refs._trim_to_sentence("a\n\n  &lt;script&gt; b."),
                         "a <script> b.")
        # ONE pass, so a summary ABOUT an entity keeps the entity it names.
        self.assertEqual(refs._trim_to_sentence("So &amp;apos; terminates it."),
                         "So &apos; terminates it.")

    def test_never_cuts_inside_an_abbreviation(self):
        """Cutting on a bare "." left "Characters that Node." and "and .NET".

        The real sentence end is early; the abbreviation's stop sits later but
        still under the ceiling, so a naive rule prefers it and mutilates the
        summary. Each case asserts the cut landed on the sentence, not the
        abbreviation.
        """
        opener = "A first sentence, padded out so the kept text clears the "
        opener += "sixty-percent guard comfortably. " + "Padding words here. " * 12
        self.assertGreater(len(opener), refs.DIGEST_MAX * 0.6)
        for token in ("Node.js", ".NET", "2.0"):
            text = opener + "Then %s appears mid clause and runs on" % token
            text += " and on" * 40
            kept = refs._trim_to_sentence(text)
            self.assertTrue(kept.endswith("Padding words here."), kept[-45:])
            for bad in ("Node.", "n .", "2."):
                self.assertFalse(kept.endswith(bad), (token, kept[-45:]))

    def test_refuses_rather_than_mutilating(self):
        # A short opener followed by one enormous clause chain is a summary that
        # needs rewriting, not one that needs cutting.
        self.assertEqual(refs._trim_to_sentence("Short opener. " + "x" * 900), "")
        self.assertEqual(refs._trim_to_sentence("x" * 900), "")

    def test_stays_within_the_ceiling(self):
        text = "%s. %s." % ("Aa" * 150, "Bb" * 150)
        kept = refs._trim_to_sentence(text)
        self.assertLessEqual(len(kept), refs.DIGEST_MAX)


class DigestAcceptTests(unittest.TestCase):
    KNOWN = {"https://example.test/a": {"slug": "a", "content_sha256": "d" * 64}}
    VOCAB = {"aliases": {"wasm": "webassembly"},
             "tags": {name: {"documents": 9} for name in
                      ("xss", "csrf", "javascript", "info-leak", "dns", "tls",
                       "cookie", "flash", "java", "php", "waf-bypass",
                       "tooling", "webassembly")}}

    def accept(self, **reading):
        return refs._accept_digest("https://example.test/a", reading,
                                   self.KNOWN, self.VOCAB)

    def test_takes_a_good_reading(self):
        reason, text, tags, fresh = self.accept(
            text="A finding.", tags=["xss", "csrf", "javascript", "info-leak"])
        self.assertEqual(reason, "")
        self.assertEqual(text, "A finding.")
        self.assertEqual(tags, ["xss", "csrf", "javascript", "info-leak"])
        self.assertEqual(fresh, [])

    def test_adopts_an_unknown_tag_and_reports_it(self):
        """The reviewer had the document open; refusing the word lost that."""
        reason, _, tags, fresh = self.accept(text="A finding.",
                                             tags=["xss", "brand-new"])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["xss", "brand-new"])
        self.assertEqual(fresh, ["brand-new"])

    def test_a_proposal_is_kept_rather_than_stripped(self):
        reason, _, tags, fresh = self.accept(text="A finding.",
                                             tags=["xss", "?brand-new"])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["xss", "brand-new"])
        self.assertEqual(fresh, ["brand-new"])

    def test_case_alone_never_makes_a_second_tag(self):
        """`XSS` and `xss` were both in the archive; the capitalised one had 1."""
        reason, _, tags, fresh = self.accept(text="A finding.",
                                             tags=["XSS", "xss", " Csrf "])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["xss", "csrf"])
        self.assertEqual(fresh, [])

    def test_an_alias_publishes_the_canonical_tag(self):
        reason, _, tags, fresh = self.accept(text="A finding.", tags=["wasm"])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["webassembly"])
        self.assertEqual(fresh, [])

    def test_allows_a_narrow_document_its_one_honest_tag(self):
        # The annual list page is `survey` and nothing else. Padding it up to a
        # threshold would put tags on it that do not apply.
        reason, _, tags, _ = self.accept(text="A finding.", tags=["xss"])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["xss"])

    def test_has_no_tag_floor(self):
        # By decision: any floor buys itself by padding a document with tags
        # that do not apply. A narrow document keeps its one honest tag, and a
        # summary that genuinely warrants none is still recorded.
        for tags in ([], ["xss"], ["xss", "csrf"]):
            reason, _, kept, _ = self.accept(text="A finding.", tags=tags)
            self.assertEqual(reason, "", tags)
            self.assertEqual(kept, tags)

    def test_refuses_an_overstuffed_tag_set(self):
        many = sorted(self.VOCAB["tags"])[:refs.DIGEST_TAGS_MAX + 1]
        self.assertIn("tag(s)", self.accept(text="A finding.", tags=many)[0])

    def test_deduplicates_a_repeated_tag(self):
        # A repeat is a slip, not a request for a longer list, so it collapses
        # rather than counting towards the cap.
        reason, _, tags, _ = self.accept(text="A finding.",
                                         tags=["xss", "csrf", "xss"])
        self.assertEqual(reason, "")
        self.assertEqual(tags, ["xss", "csrf"])

    def test_refuses_a_reference_the_archive_does_not_hold(self):
        reason, _, _, _ = refs._accept_digest("https://nope.test/", {},
                                              self.KNOWN, self.VOCAB)
        self.assertIn("no such reference", reason)


class FrontmatterScalarTests(unittest.TestCase):
    """Frontmatter has to parse as YAML, not merely look right."""

    def scalar(self, value):
        from refslib import render as render_module
        return render_module._scalar(value)

    def test_a_handle_is_quoted(self):
        """118 documents stated `- @TechCrunch` and stopped parsing entirely."""
        self.assertEqual('"@TechCrunch"', self.scalar("@TechCrunch"))
        self.assertEqual('"@_chipik, @asintsov"', self.scalar("@_chipik, @asintsov"))

    def test_every_reserved_opener_is_quoted(self):
        for opener in "@`&*!|>%":
            self.assertTrue(self.scalar(opener + "name").startswith('"'), opener)

    def test_a_newline_cannot_end_the_string_early(self):
        self.assertEqual('"https://example.test/a b"',
                         self.scalar("https://example.test/a\nb"))

    def test_a_control_character_is_removed(self):
        self.assertEqual("Hacker Protection from SQL Injection SPI Dynamics",
                         self.scalar("Hacker Protection from SQL Injection \x96 SPI Dynamics"))

    def test_an_ordinary_title_is_still_left_unquoted(self):
        self.assertEqual("Bypassing Mozilla port blocking",
                         self.scalar("Bypassing Mozilla port blocking"))

    def test_every_scalar_round_trips_through_a_yaml_parser(self):
        yaml = __import__("yaml")
        for value in ("@handle", "- dash", "? question", "a: colon", "quote\"inside",
                      "back\\slash", "%percent", "|pipe", "tab\there", "", "  spaced  "):
            parsed = yaml.safe_load("field: %s" % self.scalar(value))
            self.assertIsInstance(parsed, dict, value)
            self.assertIn("field", parsed, value)


class TagVocabularyTests(unittest.TestCase):
    """The JSON vocabulary: normalisation, aliases and the OWASP facet."""

    def test_normalise_folds_case_space_and_punctuation(self):
        for written, expected in (("XSS", "xss"), ("  Prototype Pollution ",
                                                   "prototype-pollution"),
                                  ("cache_poisoning", "cache-poisoning"),
                                  ("SSRF!!", "ssrf"), ("a--b", "a-b")):
            self.assertEqual(expected, tags_module.normalise(written), written)

    def test_normalise_keeps_a_proposal_marker(self):
        self.assertEqual("?padding-oracle", tags_module.normalise("?Padding Oracle"))

    def test_an_alias_chain_resolves_to_its_end(self):
        vocabulary = {"aliases": {"a": "b", "b": "c"}}
        self.assertEqual("c", tags_module.resolve("A", vocabulary))

    def test_an_alias_loop_stops_rather_than_hanging(self):
        vocabulary = {"aliases": {"a": "b", "b": "a"}}
        self.assertIn(tags_module.resolve("a", vocabulary), {"a", "b"})

    def test_owasp_categories_are_earned_from_technique_tags(self):
        vocabulary = tags_module.default_vocabulary()
        self.assertEqual(["A03:2021"],
                         tags_module.owasp_categories(["xss"], vocabulary))
        self.assertEqual(["A01:2021", "A03:2021"],
                         tags_module.owasp_categories(["idor", "sqli"], vocabulary))
        self.assertEqual([], tags_module.owasp_categories(["tooling"], vocabulary))

    def test_a_category_becomes_a_searchable_tag(self):
        self.assertEqual("owasp-a03-2021", tags_module.owasp_tag("A03:2021"))

    def test_the_ten_categories_are_all_present(self):
        vocabulary = tags_module.default_vocabulary()
        idents = [c["id"] for c in vocabulary["owasp"]["categories"]]
        self.assertEqual(10, len(idents))
        self.assertEqual(sorted(idents), idents)

    def test_an_alias_to_nothing_retires_a_tag(self):
        """`novel-technique` was on 45% of the archive; it must not come back."""
        vocabulary = {"aliases": {"novel-technique": ""}}
        self.assertEqual("", tags_module.resolve("novel-technique", vocabulary))
        self.assertEqual({"novel-technique"}, tags_module.retired(vocabulary))

    def test_a_retired_tag_is_dropped_rather_than_published(self):
        known = {"https://example.test/a": {"slug": "a", "content_sha256": "d" * 64}}
        vocabulary = {"aliases": {"novel-technique": ""}, "tags": {"xss": {}}}
        reason, _, tags, _ = refs._accept_digest(
            "https://example.test/a",
            {"text": "A finding.", "tags": ["xss", "novel-technique"]},
            known, vocabulary)
        self.assertEqual(reason, "")
        self.assertEqual(["xss"], tags)

    def test_recount_keeps_a_tag_that_fell_to_no_documents(self):
        """Dropping it would delete the maintainer's mapping with it."""
        vocabulary = {"tags": {"xss": {"documents": 3, "note": "keep me"}}}
        tags_module.recount(vocabulary, {})
        self.assertEqual(0, vocabulary["tags"]["xss"]["documents"])
        self.assertEqual("keep me", vocabulary["tags"]["xss"]["note"])

    def test_register_reports_only_what_was_new(self):
        vocabulary = {"tags": {"xss": {"documents": 1}}}
        self.assertEqual(["desync"], tags_module.register(vocabulary, ["xss", "desync"]))

    def test_a_missing_file_falls_back_to_the_seed(self):
        vocabulary = tags_module.load(Path("does-not-exist-anywhere.json"))
        self.assertIn("owasp", vocabulary)
        self.assertEqual("webassembly", vocabulary["aliases"]["wasm"])
        self.assertIn("novel-technique", tags_module.retired(vocabulary))


class LookupFailureDoesNotEraseACapture(unittest.TestCase):
    """A dead CDX index is a fact about us, not about the source.

    `manifest.record` REPLACES a step row, so writing "lookup-failed" over a
    previous "stored" row deletes the snapshot and replay URL that prove a good
    capture was already found. Observed twice against a 2006 blog post while
    archive.org was answering 498/503.
    """

    class _Manifest(object):
        def __init__(self, step):
            self.entry = {"steps": ({"wayback": dict(step)} if step else {})}
            self.recorded = []

        def last(self, key, step):
            return self.entry["steps"].get(step)

        def record(self, key, step, **fields):
            self.recorded.append((step, fields))
            self.entry["steps"][step] = dict(fields)
            return self.entry["steps"][step]

    def test_a_stored_capture_survives_an_unreachable_index(self):
        manifest = self._Manifest({"result": "stored", "snapshot": "20060911101728",
                                   "replay_url": "https://web.archive.org/web/x/y",
                                   "bytes": 60468})
        kept = refs._record_lookup_failure(manifest, "https://blog.test/p", "cdx 503")
        self.assertEqual(kept, "20060911101728")
        step = manifest.entry["steps"]["wayback"]
        self.assertEqual(step["result"], "stored")
        self.assertEqual(step["replay_url"], "https://web.archive.org/web/x/y")
        self.assertEqual(step["bytes"], 60468)
        self.assertIn("cdx 503", step["lookup_failed_reason"])
        self.assertEqual(manifest.recorded, [])

    def test_a_reference_with_no_capture_still_records_the_failure(self):
        manifest = self._Manifest(None)
        kept = refs._record_lookup_failure(manifest, "https://blog.test/p", "cdx 503")
        self.assertEqual(kept, "")
        self.assertEqual(manifest.entry["steps"]["wayback"]["result"], "lookup-failed")

    def test_an_earlier_failure_is_replaced_rather_than_accumulated(self):
        manifest = self._Manifest({"result": "lookup-failed", "reason": "old"})
        refs._record_lookup_failure(manifest, "https://blog.test/p", "cdx 503")
        self.assertEqual(manifest.entry["steps"]["wayback"]["reason"], "cdx 503")


class ImageBaseTests(unittest.TestCase):
    """What a document's RELATIVE image targets are resolved against."""

    README = ("This reference is a source-code repository.\n\n"
              "- Repository: <https://github.com/WebSec-Lab/BUIzz>\n"
              "- Commit: `66fa2caee4a81d6132d4b268d6618160f3780489`\n")

    def test_an_ordinary_page_resolves_against_its_own_address(self):
        entry = {"kind": "article", "original_url": "https://site.test/blog/post"}
        self.assertEqual(refs._image_base("https://site.test/blog/post", entry, ""),
                         "https://site.test/blog/post")

    def test_a_repository_resolves_against_the_raw_host_at_its_commit(self):
        """Joining a README's figure to the github.com HTML view asks for a
        path that does not exist; the raw host at the pinned commit serves it."""
        entry = {"kind": "repo"}
        base = refs._image_base("https://github.com/WebSec-Lab/BUIzz", entry, self.README)
        self.assertEqual(
            base,
            "https://raw.githubusercontent.com/WebSec-Lab/BUIzz/"
            "66fa2caee4a81d6132d4b268d6618160f3780489/")

    def test_a_repository_with_no_recorded_commit_resolves_to_nothing(self):
        """Better an unresolved target than a guessed branch."""
        entry = {"kind": "repo"}
        self.assertEqual(refs._image_base("https://github.com/o/r", entry, "no commit here"), "")

    def test_a_repository_that_is_not_github_resolves_to_nothing(self):
        entry = {"kind": "repo"}
        self.assertEqual(
            refs._image_base("https://gitlab.test/o/r", entry,
                             "- Commit: `66fa2caee4a81d6132d4b268d6618160f3780489`"), "")


class ImageFetchUrlTests(unittest.TestCase):
    """Where each figure is fetched from, keyed by the document's own spelling."""

    KEY = "https://github.com/WebSec-Lab/BUIzz"
    RAW = ("https://raw.githubusercontent.com/WebSec-Lab/BUIzz/"
           "66fa2caee4a81d6132d4b268d6618160f3780489/")
    HEAD = "- Commit: `66fa2caee4a81d6132d4b268d6618160f3780489`\n\n"

    def fetch(self, markdown, entry=None):
        return refs._image_fetch_urls(self.KEY, entry or {"kind": "repo"},
                                      self.HEAD + markdown)

    def test_a_figure_resolves_against_its_own_document(self):
        """`shields.png` under `example/README.md` is `example/shields.png`.
        Resolving every figure against the repository root asked for files that
        were not there, and the pictures were recorded as unreadable."""
        found = self.fetch("## `README.md`\n\n![o](Figure/overview.png)\n\n"
                           "## `example/README.md`\n\n![s](shields.png)\n")
        self.assertEqual(found["Figure/overview.png"], self.RAW + "Figure/overview.png")
        self.assertEqual(found["shields.png"], self.RAW + "example/shields.png")

    def test_a_root_relative_figure_is_repository_root_relative(self):
        """GitHub rewrites `/thumbnail.jpg` against the repository. Joining it
        to the raw HOST drops the owner, name and commit."""
        found = self.fetch("## `README.md`\n\n![d](/thumbnail.jpg)\n")
        self.assertEqual(found["/thumbnail.jpg"], self.RAW + "thumbnail.jpg")

    def test_an_absolute_figure_is_left_alone(self):
        found = self.fetch("## `README.md`\n\n![x](https://img.test/a.png)\n")
        self.assertEqual(found["https://img.test/a.png"], "https://img.test/a.png")

    def test_an_ordinary_page_resolves_against_its_own_address(self):
        entry = {"kind": "article", "original_url": "https://site.test/blog/post"}
        found = refs._image_fetch_urls("https://site.test/blog/post", entry,
                                       "![a](/images/one.png)\n![b](two.png)\n")
        self.assertEqual(found["/images/one.png"], "https://site.test/images/one.png")
        self.assertEqual(found["two.png"], "https://site.test/blog/two.png")

    def test_a_repository_with_no_commit_leaves_every_target_unresolved(self):
        found = refs._image_fetch_urls(self.KEY, {"kind": "repo"},
                                       "## `README.md`\n\n![o](Figure/overview.png)\n")
        self.assertEqual(found["Figure/overview.png"], "")


if __name__ == "__main__":
    unittest.main()
