"""Checks for score-free decision publication and changing merit criteria."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('history.py')
spec = importlib.util.spec_from_file_location('history', SCRIPT)
history = importlib.util.module_from_spec(spec)
spec.loader.exec_module(history)


class DecisionHistoryTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name) / 'history.jsonl'
        self.values = dict(year=2026, title='Candidate [with brackets]',
            primary_url='https://example.org/research', related_urls=[],
            decision='added', merit_revision='sha256:' + '1' * 64,
            recorded_at='2026-09-11T12:00:00+00:00', event_type='judgement')

    def test_unchanged_decision_is_idempotent(self):
        self.assertTrue(history.append_decision(self.path, **self.values))
        self.assertFalse(history.append_decision(self.path, **self.values))
        self.assertEqual(len(history.read_history(self.path)), 1)

    def test_merit_change_keeps_history_without_changing_outcome(self):
        history.append_decision(self.path, **self.values)
        changed = dict(self.values, merit_revision='sha256:' + '2' * 64,
                       event_type='rejudgement')
        self.assertTrue(history.append_decision(self.path, **changed))
        events = history.read_history(self.path)
        self.assertEqual(events[1]['supersedes'], events[0]['event_id'])
        self.assertEqual([event['decision'] for event in events], ['added', 'added'])

    def test_reassessment_can_change_outcome(self):
        history.append_decision(self.path, **self.values)
        history.append_decision(self.path, **dict(self.values, decision='not-added',
                                                  event_type='rejudgement'))
        rendered = history.render_markdown(2026, history.read_history(self.path))
        self.assertIn('| Not added |', rendered)
        self.assertNotIn('| Added |', rendered)
        self.assertIn(r'Candidate \[with brackets\]', rendered)

    def test_score_or_assessment_fields_are_rejected_even_with_valid_hash(self):
        for field in ('score', 'scores', 'verdict', 'confidence', 'note', 'snapshot_sha256'):
            with self.subTest(field=field):
                event = history.make_event(**self.values)
                event[field] = 'private assessment'
                event['event_id'] = history.event_id(event)
                with self.assertRaises(history.HistoryError):
                    history.validate_event(event)

    def test_modified_and_broken_chains_are_rejected(self):
        history.append_decision(self.path, **self.values)
        event = json.loads(self.path.read_text())
        event['decision'] = 'not-added'
        self.path.write_text(json.dumps(event) + '\n')
        with self.assertRaises(history.HistoryError):
            history.read_history(self.path)
        event['supersedes'] = 'sha256:' + '3' * 64
        event['event_id'] = history.event_id(event)
        self.path.write_text(json.dumps(event) + '\n')
        with self.assertRaises(history.HistoryError):
            history.read_history(self.path)

    def test_invalid_json_is_rejected(self):
        self.path.write_text('{broken\n')
        with self.assertRaises(history.HistoryError):
            history.read_history(self.path)

    def test_related_source_urls_are_preserved(self):
        values = dict(self.values, related_urls=['https://example.org/paper(v1).pdf'])
        history.append_decision(self.path, **values)
        events = history.read_history(self.path)
        self.assertEqual(events[0]['related_urls'], values['related_urls'])
        self.assertIn('(<https://example.org/paper(v1).pdf>)', history.render_markdown(2026, events))

    def test_current_merit_fingerprint_tracks_rubric_edits(self):
        root = Path(self.directory.name)
        skill = root / '.claude/skills/webseclist-assess-research'
        for name in ('SKILL.md', 'references/scoring-rubric.md', 'scripts/score.py'):
            path = skill / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(name)
        before = history.merit_revision(root)
        (skill / 'references/scoring-rubric.md').write_text('new criteria')
        self.assertNotEqual(before, history.merit_revision(root))


if __name__ == '__main__':
    unittest.main()
