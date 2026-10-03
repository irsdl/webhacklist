import json
import io
from pathlib import Path
import tempfile
import unittest
import zipfile

from . import support  # noqa: F401
from refslib import social
from social_known_links import known_links


class RedditNormalisationTests(unittest.TestCase):
    def test_posts_are_bounded_and_normalised(self):
        body = json.dumps({"data": [{
            "id": "abc123", "created_utc": 1483228801, "score": 7,
            "num_comments": 2, "title": "A  title\nwith space",
            "url": "https://example.test/research",
        }]}).encode()
        rows = social.reddit_posts(body, 1483228800, 1483315200)
        self.assertEqual(rows[0]["title"], "A title with space")
        self.assertEqual(rows[0]["permalink"], "/r/netsec/comments/abc123/")

    def test_private_or_credentialed_targets_are_refused(self):
        body = json.dumps({"data": [{
            "id": "abc123", "created_utc": 1483228801, "score": 0,
            "num_comments": 0, "title": "x", "url": "http://user@127.0.0.1/x",
        }]}).encode()
        with self.assertRaises(ValueError):
            social.reddit_posts(body, 1483228800, 1483315200)

        private = json.dumps({"data": [{
            "id": "abc123", "created_utc": 1483228801, "score": 0,
            "num_comments": 0, "title": "x", "url": "http://127.0.0.1/x",
        }]}).encode()
        with self.assertRaises(ValueError):
            social.reddit_posts(private, 1483228800, 1483315200)

    def test_aggregate_counts_are_inert_values(self):
        body = b'{"data":[{"created_utc":"2017-01-01T00:00:00Z","count":"4"}]}'
        self.assertEqual(social.reddit_month_counts(body), [
            {"created_utc": "2017-01-01T00:00:00Z", "count": 4}])

    def test_candidates_are_broad_deduplicated_and_exclude_known_urls(self):
        rows = {
            "year": 2017,
            "posts": [
                {"id": "a", "created_utc": 1, "date": "2017-01-01T00:00:01Z",
                 "score": 4, "comments": 1, "title": "Novel browser parser research",
                 "url": "https://example.test/new", "permalink": "/r/netsec/comments/a/"},
                {"id": "b", "created_utc": 2, "date": "2017-01-01T00:00:02Z",
                 "score": 400, "comments": 1, "title": "High signal lead",
                 "url": "https://example.test/high", "permalink": "/r/netsec/comments/b/"},
                {"id": "c", "created_utc": 3, "date": "2017-01-01T00:00:03Z",
                 "score": 10, "comments": 1, "title": "Known XSS",
                 "url": "http://www.known.test/x?utm_source=x", "permalink": "/r/netsec/comments/c/"},
            ],
        }
        found = social.reddit_candidates(json.dumps(rows).encode(), ["https://known.test/x"])
        self.assertEqual({row["id"] for row in found}, {"a", "b"})

    def test_candidate_pages_are_bounded_and_compact(self):
        document = {
            "year": 2017,
            "candidate_count": 2,
            "candidates": [
                {"id": "a", "date": "2017-01-01T00:00:01Z", "score": 4,
                 "comments": 1, "title": "First\nlead", "url": "https://one.test/a"},
                {"id": "b", "date": "2017-01-02T00:00:01Z", "score": 5,
                 "comments": 2, "title": "Second lead", "url": "https://two.test/b"},
            ],
        }
        page = social.reddit_candidate_page(json.dumps(document).encode(), 1, 1)
        self.assertEqual(page["total"], 2)
        self.assertEqual(page["next"], 2)
        self.assertEqual(page["rows"], [{
            "index": 1, "id": "b", "date": "2017-01-02", "score": 5,
            "comments": 2, "title": "Second lead", "host": "two.test",
            "url": "https://two.test/b",
        }])

    def test_candidate_selection_preserves_requested_order(self):
        document = {
            "candidates": [
                {"id": "a", "date": "2017-01-01T00:00:01Z", "score": 4,
                 "comments": 1, "title": "First", "url": "https://one.test/a"},
                {"id": "b", "date": "2017-01-02T00:00:01Z", "score": 5,
                 "comments": 2, "title": "Second", "url": "https://two.test/b"},
            ],
        }
        selected = social.reddit_candidate_select(
            json.dumps(document).encode(), ["b", "a"])
        self.assertEqual([row["id"] for row in selected["rows"]], ["b", "a"])
        self.assertEqual(selected["found"], 2)

    def test_xuanwu_posts_extract_selected_original_links(self):
        page = b'''<div id="singleweibo"><div id="singleweiboauthor">
        <p>Nicolas Krassas @Dinosn</p></div><div class="singleweibotext">
        <p>[Web Security] A technique <a href="https://example.test/research">link</a></p>
        <div class="translated"><a href="https://t.co/example">translation</a></div>
        </div></div>'''
        payload = io.BytesIO()
        with zipfile.ZipFile(payload, "w") as archive:
            archive.writestr(
                "XuanwuLab.github.io-pinned/cn/secnews/2017/03/01/index.html", page)
        posts = social.xuanwu_posts(payload.getvalue(), 2017, ["@Dinosn"])
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]["date"], "2017-03-01")
        self.assertEqual(posts[0]["urls"], ["https://example.test/research"])
        self.assertNotIn("translation", posts[0]["text"])

    def test_xuanwu_candidates_exclude_known_and_keep_web_research(self):
        document = {
            "post_count": 3,
            "posts": [
                {"date": "2017-01-01", "author": "Nicolas @Dinosn",
                 "text": "New browser attack", "urls": ["https://one.test/research"]},
                {"date": "2017-01-02", "author": "Nicolas @Dinosn",
                 "text": "Unrelated malware", "urls": ["https://two.test/malware"]},
                {"date": "2017-01-03", "author": "James @albinowax",
                 "text": "Account-specific lead", "urls": ["https://three.test/item"]},
            ],
        }
        found = social.xuanwu_candidates(
            json.dumps(document).encode(), ["http://one.test/research"])
        self.assertEqual([row["url"] for row in found], ["https://three.test/item"])

    def test_xuanwu_stats_counts_normalized_handles(self):
        document = {"post_count": 3, "posts": [
            {"author": "Nicolas @Dinosn"},
            {"author": "James @AlbinoWax"},
            {"author": "Mirror @DINOSN and @albinowax"},
        ]}
        stats = social.xuanwu_stats(json.dumps(document).encode())
        self.assertEqual(stats["total"], 3)
        self.assertEqual(stats["authors"], {"@dinosn": 2, "@albinowax": 2})

    def test_known_links_reads_shared_year_and_related_sources(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            (repo / "2016-17.md").write_text(
                "[Main](http://www.example.test/a?utm_source=x)\n", encoding="utf-8")
            policy = repo / "tools/references"
            policy.mkdir(parents=True)
            (policy / "related-sources.json").write_text(json.dumps({"groups": {
                "https://example.test/a": {"sources": [
                    {"url": "https://companion.test/paper"}
                ]}
            }}), encoding="utf-8")
            found = known_links(repo, 2017)
        self.assertEqual(set(found), {
            "http://www.example.test/a?utm_source=x",
            "https://companion.test/paper",
        })


if __name__ == "__main__":
    unittest.main()
