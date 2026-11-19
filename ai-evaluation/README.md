# AI inclusion decisions

Research is still scored in full with the
[judging skill](../.claude/skills/webseclist-assess-research/SKILL.md). Scores,
scorecards, per-candidate verdicts and calibration results stay in gitignored
`.local/ai-evaluation/`. They are not published in this directory or in other
tracked exports.

The public year records contain:

- `README.md`: candidate identity, source links and **Added / Not added**.
- `judgements.md`: completed inclusion decisions, with the same two outcomes.
- `history.jsonl`: those decisions, dates and merit-revision fingerprints.

“Added” includes retained entries. “Not added” in a lead index may include a
candidate awaiting review; it is not evidence of a completed rejection or a
permanent assessment of research quality. No candidate is newly added without
passing the judging skill's current Repository collection merit and the source,
year and non-duplication checks.

The merit criteria may change. Reassess privately before recording a new
outcome; public history preserves decision changes and the applicable revision,
not numerical results. Legacy decisions whose exact criteria revision was not
recorded use `legacy-unspecified` rather than claiming today's rule applied.

To record a completed decision and regenerate its readable record:

```text
python .claude/skills/webseclist-assess-research/scripts/history.py record \
  --year <YEAR> --title '<Title>' --url '<primary URL>' --decision added
python .claude/skills/webseclist-assess-research/scripts/history.py render --year <YEAR>
python .claude/skills/webseclist-assess-research/scripts/history.py verify
python .claude/skills/webseclist-backfill-history/scripts/audit.py
```

Use `--decision not-added` for a completed review without addition and
`--event-type rejudgement` for a deliberate reassessment. Update the lead index
at the same time. Keep detailed reasoning and unresolved evidence in the private
notes. Never force-add those notes to Git.

The 11 September 2026 migration removed numerical evaluations from current
published files, including Markdown, JSON/JSONL and CSV. Scores in older Git
commits are not removed by this migration. Decision histories are append-only
from this migration onward.

`archive-reviews/` and the archive reviews under `source-audits/` document capture
integrity and preservation work, not research merit. Their technical verification
records are retained separately from candidate outcomes.
