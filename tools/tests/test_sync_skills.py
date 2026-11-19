"""Synthetic contracts for portable skill discovery and adapter drift."""

import importlib.util
from pathlib import Path
import tempfile
import unittest

import yaml

TOOLS = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('sync_skills', TOOLS / 'sync_skills.py')
sync_skills = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sync_skills)


class SkillSyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.skill = self.root / '.claude/skills/example-workflow'
        (self.skill / 'agents').mkdir(parents=True)
        (self.root / 'CLAUDE.md').write_text('Trusted policy\n')
        (self.root / '.claude/source-security.md').write_text('Source policy\n')
        (self.skill / 'SKILL.md').write_text(
            '---\nname: example-workflow\ndescription: "Review: a bounded example"\n---\n'
            'Authoritative procedure.\n', encoding='utf-8')
        self.metadata = {
            'interface': {'display_name': 'Example Workflow',
                          'short_description': 'Review a bounded example workflow',
                          'default_prompt': 'Use $example-workflow to review the example.'},
            'policy': {'allow_implicit_invocation': False},
            'dependencies': {'tools': [{'type': 'mcp', 'value': 'example'}]},
        }
        (self.skill / 'agents/openai.yaml').write_text(yaml.safe_dump(self.metadata))

    def test_discovery_preserves_metadata_and_valid_trusted_targets(self):
        changes = sync_skills.synchronise(self.root)
        self.assertEqual(len(changes), 2)
        adapter = self.root / '.agents/skills/example-workflow/SKILL.md'
        body = adapter.read_text(encoding='utf-8')
        header = yaml.safe_load(body.split('---', 2)[1])
        self.assertEqual(header['description'], 'Review: a bounded example')
        for target in ['../../../CLAUDE.md', '../../../.claude/source-security.md',
                       '../../../.claude/skills/example-workflow/SKILL.md']:
            self.assertTrue((adapter.parent / target).is_file())
        actual_metadata = yaml.safe_load((adapter.parent / 'agents/openai.yaml').read_text())
        self.assertEqual(actual_metadata, self.metadata)
        self.assertEqual(sync_skills.synchronise(self.root, check=True), [])

    def test_check_detects_description_drift_without_mutation(self):
        sync_skills.synchronise(self.root)
        adapter = self.root / '.agents/skills/example-workflow/SKILL.md'
        previous = adapter.read_bytes()
        source = self.skill / 'SKILL.md'
        source.write_text(source.read_text().replace('bounded example', 'updated example'))
        self.assertIn('.agents/skills/example-workflow/SKILL.md',
                      sync_skills.synchronise(self.root, check=True))
        self.assertEqual(adapter.read_bytes(), previous)

    def test_new_workflow_is_discovered_automatically(self):
        sync_skills.synchronise(self.root)
        second = self.root / '.claude/skills/another-workflow'
        (second / 'agents').mkdir(parents=True)
        (second / 'SKILL.md').write_text(
            '---\nname: another-workflow\ndescription: Another bounded task\n---\nSteps.\n')
        metadata = {'interface': dict(self.metadata['interface'])}
        metadata['interface']['default_prompt'] = 'Use $another-workflow for the second task.'
        (second / 'agents/openai.yaml').write_text(yaml.safe_dump(metadata))
        self.assertEqual(len(sync_skills.synchronise(self.root)), 2)
        self.assertTrue((self.root / '.agents/skills/another-workflow/SKILL.md').is_file())

    def test_stale_discoverable_name_is_reported_and_preserved(self):
        stale = self.root / '.agents/skills/obsolete-name/SKILL.md'
        stale.parent.mkdir(parents=True)
        stale.write_text('Old skill\n')
        with self.assertRaisesRegex(ValueError, 'no authoritative skill'):
            sync_skills.synchronise(self.root)
        self.assertTrue(stale.is_file())

    def test_missing_invocation_metadata_is_an_error(self):
        (self.skill / 'agents/openai.yaml').unlink()
        with self.assertRaises(OSError):
            sync_skills.synchronise(self.root)


if __name__ == '__main__':
    unittest.main()
