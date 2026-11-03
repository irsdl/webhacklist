"""Translated print copies must retain the source's preserved technical figures."""
from . import support  # noqa: F401

import base64
from pathlib import Path
from tempfile import TemporaryDirectory
import types
import unittest
from unittest.mock import patch

import refs
from refslib import collections, container_browser
from refslib.store import Store


class TranslatedPdfImagesTests(unittest.TestCase):
    def test_translation_print_embeds_the_preserved_figure_offline(self):
        with TemporaryDirectory() as folder:
            root = Path(folder)
            store = Store(root / 'store')
            png = base64.b64decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8'
                '/x8AAwMCAO+a6S8AAAAASUVORK5CYII=')
            sha = store.put(png)
            key = 'https://example.test/research'
            entry = {'slug': 'research', 'grade': 'research',
                     'content_sha256': 'synthetic-content',
                     'cited_by': ['2026-ai.md:10'],
                     'title_english': 'Research',
                     'images': {'https://example.test/figure.png': {'sha256': sha}}}
            config = {'archive_dir': 'archived-references'}
            translated = root / config['archive_dir'] / collections.translated_md_relpath(
                entry, config, entry['slug'])
            translated.parent.mkdir(parents=True)
            translated.write_text(
                '# Research\n\n![Proxy configuration](https://example.test/figure.png)\n',
                encoding='utf-8')
            events = []
            manifest = types.SimpleNamespace(
                data={'urls': {key: entry}},
                record=lambda *args, **kwargs: events.append((args, kwargs)),
                save=lambda: None)
            printed = []

            class Printer:
                def available(self):
                    return True

                def print_pdf(self, document):
                    printed.append(document)
                    return b'%PDF-1.7\nsynthetic-print-result'

            args = refs.build_parser().parse_args(['pdf', '--translations-only'])
            with patch.object(refs.paths, 'repo_root', return_value=root), \
                    patch.object(refs.paths, 'config', return_value=config), \
                    patch.object(refs.paths, 'store_root', return_value=root / 'store'), \
                    patch.object(refs.check_module, 'open_manifest', return_value=manifest), \
                    patch.object(container_browser, 'Printer', Printer):
                self.assertEqual(0, refs.command_pdf(args))

            self.assertEqual(1, len(printed))
            self.assertIn('src="data:image/png;base64,', printed[0])
            self.assertIn('Proxy configuration', printed[0])
            self.assertNotIn('src="https://', printed[0])
            pdf = root / config['archive_dir'] / collections.translated_pdf_relpath(
                entry, config, entry['slug'])
            self.assertTrue(pdf.is_file())
            self.assertEqual('pdf-translation', events[0][0][1])
