#!/usr/bin/env python3
"""Compute the weighted final score for a research evaluation.

The rubric weights are fixed by the skill and must not be changed per candidate:
that is what makes scores comparable across evaluations. Each category is scored
0-100 on its own merits; this script only does the arithmetic (score/100 * weight)
and renders the Scorecard table, so the final number is never a mental-maths slip.

Usage:
    python score.py --original 70 --transferability 65 --lasting 60 \
        --technical 75 --practical 55 --clarity 60

    # or positional, in rubric order:
    python score.py 70 65 60 75 55 60

Prints the Markdown Scorecard rows and the final score. It renders whatever
numbers you pass; deciding those numbers from evidence is your job, not the
script's.
"""
import argparse
import sys

# (label, cli-key, weight) in the fixed rubric order.
CATEGORIES = [
    ("Original contribution", "original", 25),
    ("Transferability", "transferability", 20),
    ("Lasting value", "lasting", 20),
    ("Technical soundness", "technical", 15),
    ("Practical usability", "practical", 10),
    ("Clarity and reproducibility", "clarity", 10),
]


def band(score):
    if score < 20:
        return "little/none"
    if score < 40:
        return "limited"
    if score < 60:
        return "moderate"
    if score < 80:
        return "strong"
    return "exceptional"


def parse_args(argv):
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    for label, key, weight in CATEGORIES:
        p.add_argument(f"--{key}", type=float,
                       help=f"{label} (weight {weight}%%), 0-100")
    p.add_argument("scores", nargs="*", type=float,
                   help="Six scores in rubric order, if not using flags")
    return p.parse_args(argv)


def resolve(args):
    flag_vals = [getattr(args, key) for _, key, _ in CATEGORIES]
    if all(v is not None for v in flag_vals):
        return flag_vals
    if len(args.scores) == len(CATEGORIES):
        return args.scores
    raise SystemExit(
        "Provide all six scores: either every --flag or six positional numbers "
        "in rubric order (original transferability lasting technical practical clarity)."
    )


def main(argv):
    args = parse_args(argv)
    scores = resolve(args)
    for s in scores:
        if not 0 <= s <= 100:
            raise SystemExit(f"Score {s} out of range; each category is 0-100.")

    print("| Category | Score | Weight | Weighted score | Band |")
    print("|---|---:|---:|---:|---|")
    final = 0.0
    for (label, _key, weight), s in zip(CATEGORIES, scores):
        weighted = s / 100 * weight
        final += weighted
        print(f"| {label} | {s:g}/100 | {weight}% | "
              f"{weighted:.2f}/{weight} | {band(s)} |")
    print(f"\n**Final score: {final:.1f}/100** ({band(final)})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
