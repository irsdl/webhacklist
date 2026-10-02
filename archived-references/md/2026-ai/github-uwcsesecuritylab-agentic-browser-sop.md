---
type: Repository
title: Code
description: Test websites for the Agentic Browsers and the Same-Origin Policy experiments. Pages pair an outer page with a same-origin or cross-origin framed page carrying distinct marker text, and add hidden elements, cookie-personalised content and off-screen text to see what the browser agent reads; others hold password inputs and text that instructs the agent. The poc files demonstrate cross-origin data theft in both frame directions and a JavaScript injection, posting to summary.php.
resource: "https://github.com/UWCSESecurityLab/agentic-browser-sop"
tags: [repo, webseclist-reference, github, same-origin-policy, sop-bypass, prompt-injection, ai-agent, iframe, tooling, owasp-a01-2021, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-08T18:46:57+00:00"
status: stable
stale_after: 2027-08-08
sources:
  - id: original
    resource: "https://github.com/UWCSESecurityLab/agentic-browser-sop"
    title: Code
    author: Franziska Roesner, David Kohlbrenner
  - id: commit
    resource: "https://github.com/UWCSESecurityLab/agentic-browser-sop"
also_at: []
authors:
  - Franziska Roesner
  - David Kohlbrenner
canonical_url: ""
cited_by:
  - "2026-ai.md:220"
commit: de27d0cabe122488fa69df9947a6d187bca731f3
content_sha256: 4a8e2af7387282cd1baaeac98cffe4ff1011ddd1adf455ab1d62c96378335444
depth: full
depth_reason: default
kind: repo
language: ""
licence: see the repository
original_url: "https://github.com/UWCSESecurityLab/agentic-browser-sop"
published: ""
publisher: GitHub
publisher_english: ""
raw_sha256: ""
retrieved_from: "https://github.com/UWCSESecurityLab/agentic-browser-sop"
retrieved_kind: git
retrieved_utc: "2026-08-08T18:46:57+00:00"
slug: github-uwcsesecuritylab-agentic-browser-sop
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Code

**Code** - Franziska Roesner, David Kohlbrenner, GitHub.

- Published: date not stated
- Original: <https://github.com/UWCSESecurityLab/agentic-browser-sop>
- Preserved from: https://github.com/UWCSESecurityLab/agentic-browser-sop (git) on 2026-08-08
- Repository commit: de27d0cabe122488fa69df9947a6d187bca731f3
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

- Repository: <https://github.com/UWCSESecurityLab/agentic-browser-sop>
- Commit: `de27d0cabe122488fa69df9947a6d187bca731f3`
- Documents preserved: 2

## `LICENSE`

_Blob `5b41997b5d9d`, 1081 bytes, at commit `de27d0cabe12`._

MIT License

Copyright (c) 2026 University of Washington

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## `README.md`

_Blob `ce911a270d8e`, 2183 bytes, at commit `de27d0cabe12`._

# Agentic Browsers and the Same-Origin Policy

This repository contains test websites used in 
the experiments described in the following paper:

```
@inproceedings{roesner_kohlbrenner_2026_agentic_sop,
  title={Agentic Browsers and the Same-Origin Policy},
  author={Roesner, Franziska and Kohlbrenner, David},
  booktitle={Agents in the Wild Workshop @ ICLR},
  year={2026}
}
```

More information at: https://agent-security.cs.washington.edu. 

These websites must be hosted on two separate domains for 
testing. In this repository, we have replaced the domains 
with generic placeholders `A.com` and `B.com` -- these must 
be replaced with real domains hosting the websites for them
to function correctly.

The prompts used to test agentic browsers on these websites
are included in full in the paper.

## Website Summaries

`A.com`
* `bob1.html` : Used for additional experiments in Section 4.3
* `bob2.html` : Used for additional experiments in Section 4.3
* `complexpage.php` : Used as described in Appendix A
* `cookie.php` : Used to set cookie for personalized content tests
* `inner.html` : Used as described in Appendix A
* `input.html` : Used as described in Appendix A
* `input2.html` : Used as described in Appendix A
* `other.html` : Used as described in Appendix A
* `outer-cross.html` : Used as described in Appendix A
* `outer-same.html` : Used as described in Appendix A
* `poc.html` : Used for proof-of-concept cross-origin outer-from-inner-frame data theft
* `poc2.html` : Variant of `poc.html` which attempts a full prompt injection
* `poc3-frame.html` : Used with `B.com/poc3.html`
* `poc4-frame.html` : Used with `B.com/poc4.html`
* `summary.php` : Form submission destination for proofs-of-concept

`B.com`
* `bob1.html` : Used for additional experiments in Section 4.3
* `bob2.html` : Used for additional experiments in Section 4.3
* `inner.html` : Used as described in Appendix A
* `other.html` : Used as described in Appendix A
* `poc3.html` : Used for proof-of-concept cross-origin inner-from-outer-frame data theft
* `poc4.html` : Used for proof-of-concept JavaScript injection attack
* `summary.php` : Form submission destination for proofs-of-concept
