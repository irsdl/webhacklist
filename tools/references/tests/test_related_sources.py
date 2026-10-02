"""Source grouping, evidence admission and acquisition boundaries."""
from . import support

import copy
import json
import tempfile
import unittest
from pathlib import Path

from refslib import related_sources as related


class TestRelatedSources(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.main = "https://example.org/research"
        self.paper = "https://example.org/paper.pdf"
        support.write(self.root, "website/archive-years.json", json.dumps({"years": [{"id": "2024"}, {"id": "2025"}]}))
        support.write(self.root, "2024.md", f"- [Research]({self.main})\n")
        support.write(self.root, "2025.md", f"- [Research revisited]({self.main})\n")
        self.manifest = {"urls": {self.main: {"videos": [
            {"url": "https://youtube.com/watch?v=confirmed", "confidence": "confirmed", "relation": "same-work", "role": "talk",
             "review": {"decision": "same-work", "checked": "2026-09-18", "reason": "The author identifies this as the paper's talk.", "evidence": [self.main]}},
            {"url": "https://youtube.com/watch?v=guess", "confidence": "possible"},
            {"url": "https://youtube.com/watch?v=date-conflict", "confidence": "confirmed", "date_note": "Needs review"},
        ]}}}
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.extra = {"url": self.paper, "label": "Full paper", "kind": "paper", "relation": "same-work", "reason": "The authors link their full paper.", "evidence": [self.main], "preservation": "archive"}
        self.policy = {"schema": 1, "groups": {self.main: {"sources": [self.extra]}}}
        self.save_policy()

    def save_policy(self):
        support.write(self.root, related.POLICY, json.dumps(self.policy))

    def group(self):
        groups = related.build(self.root)["groups"]
        self.assertEqual(len(groups), 1)
        return next(iter(groups.values()))

    def test_shared_story_retains_citations_and_only_confirmed_recordings(self):
        group = self.group()
        self.assertEqual(group["citations"], ["2024.md:1", "2025.md:1"])
        self.assertEqual(len(group["sources"]), 3)
        video = next(source for source in group["sources"] if source["kind"] == "video")
        self.assertEqual(video["preservation"], "link-only")
        self.assertIn("confirmed", video["url"])
        self.assertEqual(video["recording"]["confidence"], "confirmed")

    def test_background_paper_does_not_lend_its_recording_to_another_story(self):
        self.manifest["urls"][self.paper] = self.manifest["urls"].pop(self.main)
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.extra["relation"] = "background"
        self.save_policy()
        self.assertFalse(any(s.get("recording") for s in self.group()["sources"]))
        self.extra["relation"] = "same-work"
        self.save_policy()
        self.assertTrue(any(s.get("recording") for s in self.group()["sources"]))

    def test_reviewed_video_relation_and_exclusion_override_source_recording(self):
        video_url = self.manifest["urls"][self.main]["videos"][0]["url"]
        self.policy["groups"][self.main]["sources"].append({**self.extra,
            "url": video_url, "kind": "video", "relation": "analysis"})
        self.save_policy()
        self.assertFalse(any(s.get("recording") for s in self.group()["sources"]))
        self.policy["groups"][self.main]["sources"].pop()
        self.policy["groups"][self.main]["exclude"] = [video_url]
        self.save_policy()
        self.assertFalse(any(s["url"] == video_url for s in self.group()["sources"]))

    def test_old_confidence_without_same_work_review_cannot_publish_a_talk(self):
        del self.manifest["urls"][self.main]["videos"][0]["relation"]
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.assertFalse(any(s.get("recording") for s in self.group()["sources"]))

    def test_same_work_demo_is_not_a_full_talk(self):
        self.manifest["urls"][self.main]["videos"][0]["role"] = "demonstration"
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.assertFalse(any(s.get("recording") for s in self.group()["sources"]))

    def test_same_work_label_requires_recorded_review_evidence(self):
        self.manifest["urls"][self.main]["videos"][0].pop("review")
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.assertFalse(any(s.get("recording") for s in self.group()["sources"]))

    def test_primary_change_and_reordering_keep_story_and_source_ids(self):
        before = self.group()
        self.policy["groups"][self.main]["main"] = self.paper
        self.policy["groups"][self.main]["sources"].insert(0, {**self.extra, "url": "https://example.org/part2", "relation": "part", "sequence": 2})
        self.save_policy()
        after = self.group()
        self.assertEqual(before["id"], after["id"])
        self.assertEqual(after["main"], related.stable_id(self.paper))
        self.assertTrue({s["id"] for s in before["sources"]} <= {s["id"] for s in after["sources"]})

    def test_github_aliases_deduplicate_without_folding_distinct_files(self):
        self.assertEqual(related.stable_id("https://github.com/SecPriv/AutoFail.git"), related.stable_id("https://www.github.com/secpriv/autofail/"))
        self.assertNotEqual(related.stable_id("https://github.com/a/b/blob/main/A.md"), related.stable_id("https://github.com/a/b/blob/main/a.md"))

    def test_unrelated_nominations_stay_separate_even_with_shared_paper(self):
        support.write(self.root, "2025.md", "- [Other](https://example.org/other)\n")
        self.policy["groups"]["https://example.org/other"] = {"sources": [self.extra]}
        self.save_policy()
        groups = list(related.build(self.root)["groups"].values())
        self.assertEqual(len(groups), 2)
        self.assertTrue(all(any(s["id"] == related.stable_id(self.paper) for s in g["sources"]) for g in groups))

    def test_distinct_bullets_in_one_collection_can_share_a_lead_document(self):
        support.write(self.root, "2024.md", (
            f"- [First technique]({self.main})\n"
            f"- [Second technique]({self.main})\n"
        ))
        groups = list(related.build(self.root)["groups"].values())
        self.assertEqual(len(groups), 2)
        self.assertEqual(len({group["id"] for group in groups}), 2)
        self.assertEqual({group["main"] for group in groups}, {related.stable_id(self.main)})
        self.assertEqual(sorted(len(group["citations"]) for group in groups), [1, 2])
        # The URL-keyed policy remains on the canonical story instead of being
        # copied onto a distinct technique that happens to cite the same file.
        self.assertEqual(sum(any(source["url"] == self.paper for source in group["sources"])
                             for group in groups), 1)

    def test_only_explicit_archivable_sources_enter_acquisition(self):
        self.policy["groups"][self.main]["sources"].extend([
            {**self.extra, "url": "https://example.org/movie.mp4", "kind": "video"},
            {**self.extra, "url": "https://example.org/exploit.zip", "kind": "download"},
            {**self.extra, "url": "https://example.org/tool", "kind": "tool", "preservation": "link-only"},
        ])
        self.save_policy()
        support.write(self.root, ".local/related-sources/audit.json", json.dumps({"candidates": ["https://example.org/unreviewed"]}))
        occurrences = list(related.archive_occurrences(self.root, {}))
        self.assertEqual(len(occurrences), 2)
        self.assertEqual({o.url for o in occurrences}, {self.paper})
        self.assertEqual({o.cited_by() for o in occurrences}, {"2024.md:1", "2025.md:1"})

    def test_invalid_policy_cannot_publish(self):
        for field, value in [("relation", "same-cve"), ("kind", "unknown"), ("evidence", []), ("evidence", self.main), ("sequence", True), ("authors", "Someone"), ("url", "https://user:secret@example.org/paper")]:
            with self.subTest(field=field, value=value):
                invalid = copy.deepcopy(self.policy)
                invalid["groups"][self.main]["sources"][0][field] = value
                support.write(self.root, related.POLICY, json.dumps(invalid))
                with self.assertRaises(ValueError):
                    related.load_policy(self.root)

    def test_companion_labels_cannot_carry_a_second_byline(self):
        self.extra["label"] = "Part 1 by Someone Else"
        self.save_policy()
        with self.assertRaisesRegex(ValueError, "Keep bylines out"):
            self.group()
        self.extra["label"] = "Part 1"
        self.extra["title"] = "Secure by Design"
        self.save_policy()
        self.assertEqual(next(s for s in self.group()["sources"] if s["url"] == self.paper)["title"], "Secure by Design")

    def test_companion_credits_must_match_all_archive_authors(self):
        self.manifest["urls"][self.paper] = {"authors": ["Alice", "Bob"]}
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        for authors in (["Someone Else"], ["Alice"], []):
            with self.subTest(authors=authors):
                self.extra["authors"] = authors
                self.save_policy()
                with self.assertRaisesRegex(ValueError, "authors conflict"):
                    self.group()
        self.extra["authors"] = ["Alice", "Bob"]
        self.save_policy()
        self.assertEqual(next(s for s in self.group()["sources"] if s["url"] == self.paper)["authors"], ["Alice", "Bob"])

    def test_withdrawn_archive_credit_cannot_return_from_companion_metadata(self):
        self.manifest["urls"][self.paper] = {"authors": []}
        support.write(self.root, "archived-references/manifest.json", json.dumps(self.manifest))
        self.extra["authors"] = ["Former credit"]
        self.save_policy()
        with self.assertRaisesRegex(ValueError, "authors conflict"):
            self.group()

    def test_orphan_and_missing_main_fail_instead_of_silently_disappearing(self):
        self.policy["groups"][self.main]["main"] = "https://example.org/not-a-member"
        self.save_policy()
        with self.assertRaisesRegex(ValueError, "Main source"):
            related.build(self.root)
        self.policy["groups"] = {"https://example.org/orphan": {"sources": [self.extra]}}
        self.save_policy()
        with self.assertRaisesRegex(ValueError, "no active research entry"):
            related.build(self.root)

    def test_real_record_wins_over_another_documents_alias(self):
        first, second = {"also_at": [self.paper]}, {"title": "Actual paper"}
        lookup = related.manifest_lookup({"urls": {self.paper: second, self.main: first}})
        self.assertIs(lookup[related.identity(self.paper)], second)

    def test_fragment_posts_do_not_merge(self):
        support.write(self.root, "2025.md", f"- [Different post]({self.main}#different-post)\n")
        self.assertEqual(len(related.build(self.root)["groups"]), 2)

    def test_media_remains_outbound_even_with_a_wrong_format_label(self):
        self.policy["groups"][self.main]["sources"] = [{**self.extra, "url": "https://example.org/demo.mp4", "kind": "article"}]
        self.save_policy()
        self.assertEqual(list(related.archive_occurrences(self.root, {})), [])
        source = next(s for s in self.group()["sources"] if s["url"].endswith("demo.mp4"))
        self.assertEqual((source["kind"], source["preservation"]), ("video", "link-only"))

    def test_coverage_report_is_protected_from_archive_pruning(self):
        from refslib import verify
        from types import SimpleNamespace
        support.write(self.root, "archived-references/related-sources-coverage.md", "# Coverage\n")
        self.assertEqual(verify.orphans(self.root, {}, SimpleNamespace(data={"urls": {}})), [])


if __name__ == "__main__":
    unittest.main()
