"""Opt-in real print regression for wide research tables."""

from . import support  # noqa: F401

import os
import unittest

from refslib import isolation, makepdf, toolbox


@unittest.skipUnless(os.environ.get("WEBSEC_TEST_PDF_LAYOUT") == "1",
                     "set WEBSEC_TEST_PDF_LAYOUT=1 for isolated PDF printing")
class TestPrintedTables(unittest.TestCase):
    def test_long_cell_does_not_clip_final_columns(self):
        # The former auto layout let this indivisible identifier push the final
        # cells outside the printed page. Check the actual PDF, not CSS text.
        identifier = "Drupal\\LongCallableNamespace" * 8
        markdown = (
            "| Callable | Kind | Argument | Effect | Notes |\n"
            "|---|---|---|---|---|\n"
            f"| `{identifier}` | static | array | VISIBLE | FINAL NOTES |\n"
        )
        html = makepdf.markdown_to_html(markdown, title="Wide table regression")
        pdf = toolbox.browser_pdf(html)
        count, text = isolation.call("pdf_info", pdf)
        self.assertGreaterEqual(count, 1)
        for marker in ("VISIBLE", "FINAL", "NOTES"):
            self.assertIn(marker, text)


if __name__ == "__main__":
    unittest.main()
