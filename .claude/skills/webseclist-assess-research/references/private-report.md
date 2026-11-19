# Required private output

Produce this scorecard privately. Never publish it in tracked evaluation records;
use the decision-only workflow below for those. Keep it concise and free of promotional language.
Cite sources (with links and dates) for every material prior-art or historical
claim, and keep verified facts, author claims, and your own inference distinguishable.

```markdown
# Research Evaluation

## Candidate

- **Title:**
- **Author or organisation:**
- **Publication date:**
- **Reference:**

## Core Contribution

A concise, target-neutral explanation of the underlying idea and why it matters.

## Prior Art

List only verified pre-cutoff references as prior art. Exclude later evidence from
all category scores, including potential future usefulness.

- **Novelty cutoff:** The earliest verified candidate-side public disclosure date,
  or narrowest defensible date range, and its evidence.
- **Earliest credible pre-cutoff related work:**
- **Closest pre-cutoff equivalent work:**
- **Evidence boundary:** Original version used; any later retrieval leads and how
  their post-cutoff content was excluded from all scores.
- **Candidate's distinct contribution as of the cutoff:**

## Scorecard

<!-- paste the table printed by score.py; the weights and final total come from it -->

| Category | Score | Weight | Weighted score | Reason |
|---|---:|---:|---:|---|
| Original contribution | /100 | 25% | /25 | |
| Transferability | /100 | 20% | /20 | |
| Lasting value | /100 | 20% | /20 | |
| Technical soundness | /100 | 15% | /15 | |
| Practical usability | /100 | 10% | /10 | |
| Clarity and reproducibility | /100 | 10% | /10 | |

**Final score: /100**

## Reverification

- **Candidate facts rechecked against:**
- **Cutoff audit:** How every claimed prior-art source was confirmed to predate the
  candidate; identify any uncertain ordering and later additions excluded.
- **Independent prior-art check:** The different pre-cutoff search path and what it
  found.
- **Strongest challenge to the result:** The best evidence or argument against the draft conclusion.
- **Benefit-of-doubt check:** The strongest technically plausible reading in the candidate's favour.
- **Changes after reverification:** What changed, or `None` with a brief reason.

## Verdict

Primary verdict (choose one): Original technique · Meaningful extension ·
Meaningful combination or adaptation · Useful application or case study ·
Tooling or methodology contribution · Independent rediscovery ·
Duplicate or already known · Insufficient evidence

- **Archive decision:** Include as a core technique / Include as a supporting reference / Do not include
- **Confidence:** High / Medium / Low
- **Reasoning:** What was new at the cutoff, what was already public before it, and why the contribution is or is not likely to stay useful.
- **Evidence gaps:** Missing information that materially affects the judgement.
```

The **archive decision** follows the score and verdict, not the other way round. Use
this default mapping — the verdict overrides a borderline score, never the reverse:

- **Final ≥ 70** with an Original / Extension / Combination / Tooling verdict →
  **Include as a core technique**.
- **Final ≥ 50**, any verdict except *Duplicate* or *Insufficient evidence* →
  at least **Include as a supporting reference**. A moderate score already means the
  work adds something, so a merely-moderate candidate still earns a place; do not
  discard it for lacking a dramatic result.
- **Final < 50**, or a *Duplicate* / *Insufficient evidence* verdict → **Do not
  include**. For *Insufficient evidence*, lower confidence and flag it for revisiting
  rather than treating the "no" as permanent.

This works because the six categories score the candidate's *marginal contribution*,
not the idea's general merit, while Original contribution and novelty-dependent
classifications and all six category scores are frozen at the cutoff. An honestly-scored duplicate therefore
lands well below 50 on its own, and a ≥ 50 score genuinely signals added value. That
gives one built-in self-check: **if a candidate scores ≥ 50 yet you reached a
*Duplicate* verdict, the two contradict each other** — recheck whether you scored
this work's cutoff-relative originality rather than the underlying idea's general
worth, and reconcile before deciding.

The thresholds are defaults for consistency, not a formula to hide behind: when a
score and the evidence pull against each other, say so in the reasoning rather than
letting the number decide alone. When evidence is thin, lower confidence rather than
forcing a decisive verdict.
