"""Synthetic publishing regression: hashes must describe the committed LF bytes."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("website_build", ROOT / "website/container-build.py")
website_build = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(website_build)


class WebsiteBuildTests(unittest.TestCase):
    def test_registry_line_endings_match_git_publication(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "website").mkdir()
            registry = root / "website/archive-years.json"
            registry.write_bytes(b'{"schema":1}\n')
            website_build.require_registry_lf(root)
            registry.write_bytes(b'{"schema":1}\r\n')
            with self.assertRaisesRegex(ValueError, "must use LF"):
                website_build.require_registry_lf(root)
