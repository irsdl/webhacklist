---
type: Repository
title: Scanner
description: "A Burp/BulkScan extension that detects CRLF-powered request and response desync, the scanner behind the 'CRLF-Powered Desync Attacks' research. A request-header-injection probe sends a benign then a mutated request and flags an issue when the response matches a canary or diverges from the baseline; a response-header-injection probe reflects a canary header from the path, then injects Content-Length to test whether the response splits, with an auto-exploit for Response Queue Poisoning."
resource: "https://github.com/t0xodile/crlf-powered-desync-scanner"
tags: [repo, webseclist-reference, github, tooling, desync, request-smuggling, header-injection, response-splitting, http, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-08T18:46:59+00:00"
status: stable
stale_after: 2027-08-08
sources:
  - id: original
    resource: "https://github.com/t0xodile/crlf-powered-desync-scanner"
    title: Scanner
    author: t0xodile
  - id: commit
    resource: "https://github.com/t0xodile/crlf-powered-desync-scanner"
also_at: []
authors:
  - t0xodile
canonical_url: ""
cited_by:
  - "2026-ai.md:41"
commit: 8b21e786dfe46784bad389a9ebf8dd0f877eabb4
content_sha256: a8a0cfbd51d23808c4ea9f87857b466ff85c8991329bc7634f88bbd651b6cdd5
depth: full
depth_reason: default
kind: repo
language: ""
licence: see the repository
original_url: "https://github.com/t0xodile/crlf-powered-desync-scanner"
published: ""
publisher: GitHub
publisher_english: ""
raw_sha256: ""
retrieved_from: "https://github.com/t0xodile/crlf-powered-desync-scanner"
retrieved_kind: git
retrieved_utc: "2026-08-08T18:46:59+00:00"
slug: github-t0xodile-crlf-powered-desync-scanner
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Scanner

**Scanner** - t0xodile, GitHub.

- Published: date not stated
- Original: <https://github.com/t0xodile/crlf-powered-desync-scanner>
- Preserved from: https://github.com/t0xodile/crlf-powered-desync-scanner (git) on 2026-08-08
- Repository commit: 8b21e786dfe46784bad389a9ebf8dd0f877eabb4
- Licence: see the repository

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

This reference is a source-code repository. The archive preserves its
documentation at an exact commit; the code itself stays in a private
mirror and is never checked out, built or run.

- Repository: <https://github.com/t0xodile/crlf-powered-desync-scanner>
- Commit: `8b21e786dfe46784bad389a9ebf8dd0f877eabb4`
- Documents preserved: 1

## `README.md`

_Blob `b3223fa16847`, 1699 bytes, at commit `8b21e786dfe4`._

# CRLF-Powered Desync Scanner
This is the Burp Extension we used to detect all cases from our research [CRLF-Powered Desync Attacks: Beheading HTTP Streams](https://portswigger.net/research/crlf-powered-desync-attacks).

It's a research-first scanner built using [BulkScan](https://github.com/albinowax/bulkScan) similar to [HTTP Request Smuggler](https://github.com/PortSwigger/http-request-smuggler) and others.

# Implementation
### Request Header Injection probe
Uses all the defined mutations in `src/main/kotlin/ReqMutator` to fire a benign and then probe request. If the response contains an expected match, or differs significantly, an issue is reported.

If the response contained **all** expected matches, then the issue is reported as normal. If the fallback diff is enabled (uses `serverStatus` from `BulkScan`) then the issue is reported as `Dodgy`. 

There is also a `WAFChecker` which uses static strings to try and reduce FPs from WAF rules and follow-up logic that ensures the behaviour is **consistent** or at least most likely not a WAF rule that isn't in the `WAFChecker` list already.
Additionally, there is an "auto-exploit via Response Queue Poisoning" button that may or may not give you a clue that RQP works out of the box. 

### Response Header Injection probe
Injects a header containing a random canary into the request path and checks whether that header is reflected back in the response headers. If it is, the injection is confirmed and an issue is reported.

As a follow-up, it then injects a `Content-Length` header to see if the response can be split. If this causes a timeout or a change in the `serverStatus`, the issue is upgraded and reported as `Splitting?`.
