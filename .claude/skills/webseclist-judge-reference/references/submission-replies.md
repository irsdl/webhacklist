# Research submission replies

Use these templates after the full private judgement and checks required by the
skill. Adapt the wording to the evidence and submitter's relationship to the work;
replace every bracketed placeholder before posting. For multiple articles, give
each its own outcome and reasons. Leave the submission open if any material
question or accepted addition remains outstanding.

Thank the submitter for taking the time to share the research. Show appreciation
through something you actually observed: a clear explanation of a precondition,
a careful experiment, a useful diagnostic example, or another specific aspect.
Do not invent an achievement, equate effort with novelty, or call third-party
research the submitter's work. A decision concerns collection inclusion, not the
researcher's ability or the worth of their effort.

## Added

> Thank you for submitting [title] and for sharing this research with the archive.
> [Specific, evidenced appreciation of the work, crediting its researchers.]
>
> **Added.** [Explain the contribution and how it helps future readers, such as a
> reusable method, a meaningful extension, or substantive practical understanding.
> Credit the closest earlier work when relevant.] It meets the current collection
> criteria and the source, publication-year and non-duplication checks.
>
> You can find it in [link to the actual collection entry], with [links to
> available preserved copies and credited companions, or an accurate capture status].
> [For an issue after publication: The addition is available, so I am closing this
> submission. For a PR: state whether it was merged or link where its changes were
> already applied. If publication or merging is pending, say so and leave it open.]

Append the shared disclosure and policy-feedback paragraph below. Do not say that
preservation or merging succeeded until verified. A duplicate already in the
archive gets a link and an accurate explanation, not credit for a new addition.

## Awaiting clarification

> Thank you for submitting [title]. [Specific, evidenced appreciation.]
>
> **Awaiting clarification.** The review identified [material concern], but the
> available evidence does not yet establish [the fact needed for inclusion].
> [Identify the claim or section, link and date any relevant earlier work, compare
> mechanisms or capabilities, and explain why this matters to the collection.]
>
> Could you clarify [specific question]? [Explain what existing source, technical
> explanation or result would resolve it. Include the other material questions
> together, distinguishing uncertainty from established findings.]
>
> I am leaving this [issue/PR] open so you can explain or challenge these findings.
> A short reply or existing link is welcome; no formal rebuttal or new experiment
> is required. Your response will be reassessed against the same criteria.

Append the self-review instructions and shared disclosure below. Missing source
access or a failed required sandbox is a pending evidence/capability gap, not
proof that the research failed merit. Explain the actual gap and what would
resolve it; do not manufacture a technical objection.

## Not added, with no material uncertainty remaining

> Thank you for submitting [title] and taking the time to share the research.
> [Specific, evidenced appreciation.]
>
> **Not added.** [Explain every material reason: the affected claim or section,
> supporting evidence and its consequence for inclusion. For prior-art overlap,
> link and date the earlier publication and compare the actual capabilities.
> Recognize any distinct contribution rather than dismissing the whole work.]
>
> This decision concerns the archive's current inclusion criteria and does not
> diminish the effort behind the research. No material clarification remains open,
> so I am closing this [issue/PR]. You are welcome to explain why you disagree or
> reopen it with evidence addressing [specific reasons]. If GitHub does not let
> you reopen it, please comment here to request reopening. The evidence will be
> reviewed again; inclusion is not guaranteed.

Append the self-review instructions and shared disclosure below. Use the closing
sentence only when authorized to close. Do not report an unjudged lead as a
failed submission, publish numbers or private verdict labels, or invent questions
to make a settled decision appear uncertain.

## Self-review instructions for pending and Not added replies

Include this in the comment, with the actual candidate URL substituted. A link
alone is insufficient: explain the local-clone requirement and how to load the
judge, without assuming a particular agent discovers `.claude/skills` automatically.

You can also review the article yourself with the repository's AI judging skill.
Clone the repository so your agent can compare the research with the preserved
historical posts and year lists:

```sh
git clone https://github.com/irsdl/webhacklist.git
cd webhacklist
```

From that checkout, use an AI coding agent with local-file and web-search access.
Ask it:

```text
Read CLAUDE.md and .claude/source-security.md. Load and follow
.claude/skills/webseclist-judge-reference/SKILL.md and
.claude/skills/webseclist-judge-reference/references/scoring-rubric.md.
Judge <ARTICLE_URL> against the current Repository collection merit. Read the
complete original disclosure, establish its first-publication cutoff, and search
both archived-references/md/ and the web for prior art using the approved source
handling routes. Reverify the result and explain the strongest case for the work,
the inclusion reasons and any material uncertainties. Do not edit the collection
or contact GitHub. Keep the full report and scores in .local/ai-evaluation/;
give me an evidence-based explanation suitable for discussing the submission.
```

The [self-review guide](https://github.com/irsdl/webhacklist/blob/master/CONTRIBUTING.md#review-your-article-with-the-judge)
links the rubric and setup requirements, including Docker for isolated source
processing. Running `score.py` alone only calculates arithmetic; it does not
read your article or check prior art. A local result may differ because evidence,
model behaviour and skill revisions can differ. You do not need to run the judge
to challenge this decision: relevant evidence and an explanation are enough.
Share those findings rather than a numerical score or full scorecard.

## Website fixes and reopening

For a resolved issue whose fix updates website content, add this near the end
of the reply, before the AI disclosure:

> Please reopen this issue if the problem remains after the website rebuilds,
> usually within a few minutes. If GitHub does not let you reopen it, please
> comment here to request reopening.

State the actual deployment status. If the rebuild is pending or has failed,
say so; the timing above is typical, not a promise that a failed build will
recover automatically. If deployment is already verified, adapt the note to
ask the reporter to reopen if the problem persists on the updated website.

## Shared AI disclosure and policy feedback

Append this to every submission reply:

> This comment was generated by AI with no human involvement.
> The review aims to apply the same evidence-based criteria to every submission;
> AI reviews can still contain errors or bias. If you think the judging skill or
> rubric needs correction, please [open a separate issue](https://github.com/irsdl/webhacklist/issues/new)
> with the affected rule, an example, supporting evidence and any proposed change.
> Errors and discussion are welcome. Please keep evidence about this submission
> here so it can be reconsidered.

The required disclosure describes authorship of the comment. For a verified wholly
automated assessment, also state: "This judgement was performed by AI with no
human review." Include that statement in each such reply; if human involvement
cannot be established, do not assert its absence. If a human supplied assessment
input, describe that involvement accurately.
Human-authored policy and an automated assessment can coexist. Do not promise
that automation makes a decision unbiased, fair or infallible.
