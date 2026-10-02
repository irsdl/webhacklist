"""Redact reviewed credential-shaped values from published archive copies.

The content store retains the source bytes.  Public Markdown and PDFs should not
repeat strings that GitHub secret scanning has already flagged, even when the
maintainer confirmed that they are public examples or test values.  Match both
the provider's token shape and the SHA-256 digest so ordinary hashes, IDs and
example payloads remain unchanged.
"""

import hashlib
import re


_PATTERNS = (
    (re.compile(r"(?<![A-Za-z0-9_-])AIza[A-Za-z0-9_-]{35}(?![A-Za-z0-9_-])"),
     "REDACTED_GOOGLE_API_KEY"),
    (re.compile(r"(?<![A-Z0-9])(?:AKIA|ASIA)[A-Z0-9]{16}(?![A-Z0-9])"),
     "REDACTED_AWS_ACCESS_KEY_ID"),
    (re.compile(r"(?<![A-Za-z0-9_])ghr_[A-Za-z0-9]{76}(?![A-Za-z0-9_])"),
     "REDACTED_GITHUB_REFRESH_TOKEN"),
    (re.compile(r"(?<![A-Za-z0-9_])hf_[A-Za-z0-9]{34}(?![A-Za-z0-9_])"),
     "REDACTED_HUGGING_FACE_TOKEN"),
    (re.compile(r"(?<![0-9a-fA-F])[0-9a-fA-F]{32}(?![0-9a-fA-F])"),
     "REDACTED_FLICKR_API_KEY"),
    (re.compile(r"(?<![A-Za-z0-9_])sk_test_[A-Za-z0-9]{24}(?![A-Za-z0-9_])"),
     "REDACTED_STRIPE_TEST_KEY"),
)


# SHA-256 digests of the 15 values in resolved GitHub secret-scanning alerts.
# Storing digests instead of the values prevents this policy from becoming a
# second publication of the strings it is intended to remove.
_KNOWN = {
    "b2184b9cc05d8ed5747270b75788f89af90da4c909169b6e6547f4e12a63bcce",
    "d49d56333b1b675bcb380151bb50736fb43071bd0f88f7a4eb1fccb20b698319",
    "c25a8e76380f2c753754315907a8eed7c207b999f86ad3c66e32f4a671e1d426",
    "5485ca0e212af2c3a613a2e589b43c7483e5706fc72bcf378f0b8ac2eb182fd7",
    "143e00dfc1629cb0a86bd1b92d963739965f152a4081ec718deab0b770806637",
    "e2b57c596f06e383140a4defc866920ae75812298c091422a7876223d1a591ed",
    "234659d3736baa94be40c7029024133836a183c9e31ba6fc42896b515d79d369",
    "9d09e4a610961f5227b503a40025489da9a9e45787e4ef2e314a232c829e8c93",
    "6126110340986c416723472f7b013bb55e99311fcaf5f36d423db72aa6dc8df2",
    "1f38d08bc9d2e504bf1f2a88903c174e928723705c77751829f3b9c95383c880",
    "d368fefaad4ff0745ccf0926d8401b403a33a5088a3fac055bdeba6805e3ae6e",
    "7cdcaa319c3c0e2d4a46e137494e9bffa36060a332aaca87d036563e3466d72e",
    "e60f3f2a694ede3a613ec7b6817e3e85a0f1c91bc3b980686bf98c8b01bebad4",
    "230e6bd99c6615ff4a5fce21d0ea959e9a59fe0441a662b88dcc8b1d6efd8769",
    "7985435cc759c82f6f9bbb3e40acd4efffbea5d324d327f2f139a8048b7f9438",
}


def redact(text, known=None):
    """Replace only known, provider-shaped values in *text*."""
    accepted = _KNOWN if known is None else set(known)

    def replace(match, placeholder):
        digest = hashlib.sha256(match.group(0).encode("utf-8")).hexdigest()
        return placeholder if digest in accepted else match.group(0)

    result = text or ""
    for pattern, placeholder in _PATTERNS:
        result = pattern.sub(lambda match, value=placeholder: replace(match, value), result)
    return result
