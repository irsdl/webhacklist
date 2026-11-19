# Repository skills

All ten workflows live in `.claude/skills/`. Each has a generated discovery
adapter in `.agents/skills/`, with the same name, description and invocation
metadata. The adapters load the authoritative workflow and its resources from
this checkout. They do not contain another maintained copy of the procedure.

## Choose a workflow

| Skill | Use it for |
| --- | --- |
| [webseclist-update-list](../.claude/skills/webseclist-update-list/SKILL.md) | Catch up between article-publication dates; defaults to the latest listed year's last completed update through now. Includes assessment, preservation and a local website refresh. |
| [webseclist-collect-year](../.claude/skills/webseclist-collect-year/SKILL.md) | Sweep a whole calendar year into its preliminary `YEAR-ai.md` collection. |
| [webseclist-backfill-history](../.claude/skills/webseclist-backfill-history/SKILL.md) | Find research absent from a finalized year's original nomination round; make reviewed historical additions. |
| [webseclist-assess-research](../.claude/skills/webseclist-assess-research/SKILL.md) | Evaluate research merit privately, or give constructive author self-review. Does not edit lists or capture documents. |
| [webseclist-snapshot-announcements](../.claude/skills/webseclist-snapshot-announcements/SKILL.md) | Save the original **nominee and winner announcement posts** as PDFs in `original-listings/`. |
| [webseclist-preserve-research](../.claude/skills/webseclist-preserve-research/SKILL.md) | Acquire the **research articles, papers and written companions** as durable Markdown/PDF copies in `archived-references/`. |
| [webseclist-repair-captures](../.claude/skills/webseclist-repair-captures/SKILL.md) | Audit existing saved documents and repair capture, text, figure, Markdown or PDF damage. |
| [webseclist-fix-author-credits](../.claude/skills/webseclist-fix-author-credits/SKILL.md) | Verify a supplied author correction and publish the corrected byline, using the existing copy where possible. |
| [webseclist-unarchive-source](../.claude/skills/webseclist-unarchive-source/SKILL.md) | Withdraw a selected citation or saved copy, respecting shared sources and preserving store history. |
| [webseclist-refresh-website](../.claude/skills/webseclist-refresh-website/SKILL.md) | Rebuild and validate the website after source changes. Publishing follows the task's authorization. |

In Claude Code use `/webseclist-update-list`; in Codex use
`$webseclist-update-list`. Other harnesses can select the skill by name or their
native skill picker. Invocation syntax and feature toggles differ by harness.
An explicit date-range example is:

```text
Use webseclist-update-list for articles published 2026-10-19 through 2026-11-19.
```

## Overlap and redundancy review

No whole workflow was redundant in the November 2026 review. Keep the ten
entrypoints because their scopes and completion criteria differ:

- Whole-year collection, incremental updating and historical backfilling share
  discovery and judging resources. They differ in date defaults, destination
  lists, nomination exclusions and checkpoint handling. `update-list` coordinates
  the shared components; it does not replace the whole-year collector.
- Announcement snapshots and research preservation have different documents,
  output trees, capture tools and checks. They should remain separate.
- Preservation includes validation of new captures. Capture repair starts with
  existing published documents and audits fidelity. It reuses acquisition and
  rendering tools when a repair needs them; it does not duplicate those tools.
- Author-credit correction is a narrow evidence-checking workflow with an
  offline rewrite path. A full capture audit can inspect bylines, but should
  route a supplied-name correction to this workflow.
- Research assessment measures the contribution, while capture repair checks
  whether a saved copy faithfully represents it. Passing one is not passing
  the other. Removal has separate shared-citation and pruning checks.
- Website refresh is a shared downstream build step, not another collection or
  preservation workflow.

The duplicated **discovery metadata** is generated. Further consolidation should
happen in shared resources and tools when actual policy duplication is found,
without merging these different user tasks into an ambiguous entrypoint.

## Renamed commands

The old folders and command names have been replaced. Update personal shortcuts
or scripts using the old paths; there are no discoverable alias skills to clutter
the picker. Historical decision records, archived documents and their provenance
retain the names recorded at the time.

| Previous name | Current name |
| --- | --- |
| `webseclist-archive-listings` | `webseclist-snapshot-announcements` |
| `webseclist-archive-references` | `webseclist-preserve-research` |
| `webseclist-review-references` | `webseclist-repair-captures` |
| `webseclist-credit-author` | `webseclist-fix-author-credits` |
| `webseclist-remove-reference` | `webseclist-unarchive-source` |
| `webseclist-judge-reference` | `webseclist-assess-research` |
| `webseclist-find-missed` | `webseclist-backfill-history` |
| `webseclist-refresh-web-apps` | `webseclist-refresh-website` |

`webseclist-collect-year` and `webseclist-update-list` keep their names and distinct
whole-year and date-range roles. The Python helper filenames, including
`refresh_web_apps.py`, keep their names inside the renamed directories.

## Harness discovery

Checked against the linked documentation on 19 November 2026. These are
repository skills for coding harnesses opened in this checkout, not standalone
uploads for consumer chat products.

| Harness | Discovery used here | Shared repository instructions |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | `CLAUDE.md` |
| Codex | `.agents/skills/` | Existing `.codex/config.toml` fallback to `CLAUDE.md`; local `AGENTS.md` remains private |
| GitHub Copilot, including supported IDE agent modes | `.claude/skills/` or `.agents/skills/` | `.github/copilot-instructions.md` points to `CLAUDE.md` |
| Gemini CLI | `.agents/skills/` workspace alias | `GEMINI.md` imports `CLAUDE.md` |
| OpenCode | `.claude/skills/` or `.agents/skills/` compatibility discovery | Skill bootstrap reads the shared repository policy |
| Cursor | `.agents/skills/`; also supports `.claude/skills/` | Skill bootstrap reads the shared repository policy |
| Cline | `.claude/skills/` compatibility discovery | Skill bootstrap reads the shared repository policy |

Sources: [Claude Code](https://code.claude.com/docs/en/skills),
[Codex](https://developers.openai.com/codex/skills/),
[Copilot](https://docs.github.com/en/copilot/concepts/customizations/agent-skills),
[Gemini CLI](https://geminicli.com/docs/cli/skills/),
[OpenCode](https://opencode.ai/docs/skills/),
[Cursor](https://cursor.com/docs/skills), and
[Cline](https://docs.cline.bot/customization/skills).

Other harnesses that discover the Agent Skills `SKILL.md` format under either
directory can use the same files. If a harness needs another search path, point
it at one of these roots. A harness without native skill discovery can still
read the named authoritative `SKILL.md` on request; that is manual loading,
not verified automatic support. Do not add full copied workflows for each tool.

Discovery does not provide execution prerequisites or isolation. Research and
capture workflows still need the approved Docker routes, durable store and
other documented tools. Native specialist-agent definitions currently exist
for Claude and Codex; other harnesses use the coordinating-reader fallback in
[source-security.md](../.claude/source-security.md) when those roles are absent.
That fallback retains processing isolation. A missing required sandbox remains
a real capability gap. No live end-to-end run in every listed harness is implied
by structural validation or documentation compatibility.

## Maintain the shared skills

Edit procedures, supporting resources and `agents/openai.yaml` under
`.claude/skills/<name>/`. Then run:

```bash
python tools/sync_skills.py
python tools/check_skills.py --strict
```

The sync command updates the ten `.agents/skills/` entrypoints and their metadata
without copying resource trees or requiring symlinks. It preserves optional
invocation-policy and dependency fields from the authoritative metadata. It
reports orphaned adapter names rather than deleting them automatically.
`python tools/sync_skills.py --check` performs a read-only drift check;
`check_skills.py` includes that check, so the existing validation workflow also
enforces complete adapter coverage. Use the catalogue to review trigger clarity
and responsibilities; a format checker cannot assess research or prove runtime
behavior in another harness.
