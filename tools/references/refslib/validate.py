"""The validation gate: build the prompt, and record the verdict strictly.

The tool cannot call a model, and it should not: the semantic judgement belongs
to a dedicated agent with an EMPTY tool set, driven by the
`webseclist-preserve-research` workflow. This module owns the two halves the tool
must own, and they are the halves that make the gate hold.

* `queue_item` builds what the agent sees: sanitised, bounded, and fenced with a
  run-unique nonce the content cannot guess or close.
* `parse_verdict` reads what comes back as UNTRUSTED text. Strict enum checks,
  length caps, control characters stripped, unknown fields discarded, and
  anything unparseable resolved to `manual-review` rather than to `accept`.

The gate fails closed. Only `valid` publishes at full depth; everything else
queues and renders at `metadata` meanwhile, so a wrong page is never mirrored in
full while it waits.
"""

import os
import re

from . import sanitise

VERDICTS = ("valid", "partial", "wrong-page", "rewritten", "unusable")
ACTIONS = ("accept", "try-current-canonical", "try-another-snapshot",
           "try-approved-mirror", "ask-author", "downgrade-depth", "manual-review")
TOPIC = ("high", "medium", "low", "none")
SUPPORT = ("yes", "partly", "no", "unknown")
CONFIDENCE = ("high", "medium", "low")
DAMAGE = ("code-blocks-missing", "truncated", "boilerplate-only", "paywall",
          "consent-wall", "injection-attempt", "wrong-language")

PROMPT_VERSION = 1

# Head plus tail plus the code blocks. A very long document must not be able to
# bury an injection past the point of attention, or run up unbounded cost.
HEAD_CHARS = 6000
TAIL_CHARS = 2000
MAX_PROMPT_CHARS = 24000


def new_nonce():
    """A run-unique fence marker. Not derived from the content, so a page cannot
    predict it, and long enough that it cannot be guessed."""
    return "REF-" + os.urandom(12).hex().upper()


def bound(text):
    """Head, tail and every fenced code block, within a fixed budget."""
    text = text or ""
    if len(text) <= HEAD_CHARS + TAIL_CHARS:
        return text
    blocks = re.findall(r"^```.*?^```", text, re.MULTILINE | re.DOTALL)
    kept = [text[:HEAD_CHARS], "\n\n[... middle omitted for length ...]\n\n"]
    budget = MAX_PROMPT_CHARS - HEAD_CHARS - TAIL_CHARS - 200
    for block in blocks[:20]:
        if budget <= 0:
            break
        kept.append(block[:budget])
        budget -= min(len(block), budget)
    kept.append("\n\n" + text[-TAIL_CHARS:])
    return "".join(kept)


def queue_item(record, content, nonce=None):
    """What the validator is given for one reference. Sanitised, bounded, fenced."""
    nonce = nonce or new_nonce()
    cleaned = sanitise.sanitise_text(bound(content))
    return {
        "nonce": nonce,
        "slug": record.get("slug", ""),
        "title": record.get("title", ""),
        "original_url": record.get("original_url", ""),
        "cited_by": record.get("cited_by") or [],
        "injection_markers": cleaned.markers,
        "prompt_version": PROMPT_VERSION,
        "content": sanitise.fence(cleaned.text, nonce),
    }


def parse_verdict(raw, content_sha256="", model=""):
    """Read an agent's answer as untrusted input.

    Anything unexpected becomes `manual-review`. That direction matters: a
    parser that guesses turns a malformed answer into a publication.
    """
    import json

    try:
        if not isinstance(raw, str) or len(raw) > 16000:
            raise ValueError("oversized or non-text verdict")
        data = json.loads(_strip_fence(raw))
        if not isinstance(data, dict):
            raise ValueError("not an object")
    except (ValueError, TypeError):
        return _fallback("the agent's answer was not parseable JSON",
                         content_sha256, model)

    verdict = _enum(data.get("verdict"), VERDICTS)
    action = _enum(data.get("recommended_action"), ACTIONS)
    if verdict is None or action is None:
        return _fallback("verdict or recommended_action was outside the closed set",
                         content_sha256, model)
    if type(data.get("is_same_document")) is not bool:
        return _fallback("is_same_document must be a JSON boolean", content_sha256, model)
    if verdict == "valid" and (not data["is_same_document"] or action != "accept"
                                or data.get("supports_citation") != "yes"
                                or data.get("topic_match") not in ("high", "medium")):
        return _fallback("contradictory acceptance fields", content_sha256, model)

    return {
        "verdict": verdict,
        "recommended_action": action,
        "is_same_document": bool(data.get("is_same_document")),
        "topic_match": _enum(data.get("topic_match"), TOPIC) or "none",
        "supports_citation": _enum(data.get("supports_citation"), SUPPORT) or "unknown",
        "content_damage": [item for item in _list(data.get("content_damage")) if item in DAMAGE],
        "evidence": [_quote(item) for item in _list(data.get("evidence"))[:5]],
        "confidence": _enum(data.get("confidence"), CONFIDENCE) or "low",
        "content_sha256": content_sha256,
        "model": str(model or "")[:80],
        "prompt_version": PROMPT_VERSION,
    }


def publishable(verdict, accept_partial=False):
    """Only `valid` publishes. `partial` needs an explicit override."""
    if not verdict:
        return False
    if verdict.get("verdict") == "valid":
        return True
    return accept_partial and verdict.get("verdict") == "partial"


def _fallback(reason, content_sha256, model):
    return {
        "verdict": "unusable",
        "recommended_action": "manual-review",
        "is_same_document": False,
        "topic_match": "none",
        "supports_citation": "unknown",
        "content_damage": [],
        "evidence": [],
        "confidence": "low",
        "parse_error": reason,
        "content_sha256": content_sha256,
        "model": str(model or "")[:80],
        "prompt_version": PROMPT_VERSION,
    }


def _strip_fence(raw):
    text = (raw or "").strip()
    match = re.search(r"```(?:json)?\s*(.+?)```", text, re.DOTALL)
    return match.group(1).strip() if match else text


def _enum(value, allowed):
    return value if isinstance(value, str) and value in allowed else None


def _list(value):
    return [item for item in value if isinstance(item, str)] if isinstance(value, list) else []


def _quote(text):
    """A quote from a hostile page, on its way into a tracked file."""
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(text))
    return sanitise.sanitise_text(text).text[:200]
