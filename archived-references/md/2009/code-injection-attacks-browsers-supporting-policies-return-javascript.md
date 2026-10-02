---
type: Whitepaper
title: Code-Injection Attacks in Browsers Supporting Policies (return-to-JavaScript)
description: A W2SP 2009 paper on XSS attacks that defeat browser-enforced policy frameworks. It examines BEEP, which whitelists trusted scripts in the browser, and shows attacks analogous to return-to-libc that reuse already-trusted client-side code rather than injecting new script. It proposes isolating trusted code via policies expressed as browser actions.
resource: "https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf"
tags: [whitepaper, webseclist-reference, xss, csp, javascript, filter-bypass, formal-analysis, mitigation, defence, owasp-a03-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:41:58+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf"
    title: Code-Injection Attacks in Browsers Supporting Policies (return-to-JavaScript)
    author: Elias Athanasopoulos, Vasilis Pappas, Evangelos P. Markatos
also_at: []
authors:
  - Elias Athanasopoulos
  - Vasilis Pappas
  - Evangelos P. Markatos
canonical_url: ""
cited_by:
  - "2009.md:105"
commit: ""
content_sha256: f41f5384bfd97bd41f122fe198dbeab0583f054eacec8fa298385dd154b893e6
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: f0c70a8960d099adc979245a0e9d668158f74c4bd743f07fa7b090e638e5888e
retrieved_from: "https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:41:58+00:00"
slug: code-injection-attacks-browsers-supporting-policies-return-javascript
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Code-Injection Attacks in Browsers Supporting Policies (return-to-JavaScript)

**Code-Injection Attacks in Browsers Supporting Policies (return-to-JavaScript)** - Elias Athanasopoulos, Vasilis Pappas, Evangelos P. Markatos, Publisher not stated.

- Published: date not stated
- Original: <https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf>
- Preserved from: https://www.ieee-security.org/TC/W2SP/2009/papers/s3p1.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Code-Injection Attacks in Browsers Supporting Policies (return-to-JavaScript)

--- page 1 ---

Code-Injection Attacks in Browsers Supporting Policies
Elias Athanasopoulos, Vasilis Pappas, and Evangelos P. Mar
katos
Institute of Computer Science
Foundation for Research and Technology - Hellas
N. Plastira 100, Vassilika Vouton, GR-700 13 Heraklion, Cre
te, Greece
f
elathan, vpappas, markatos
g
@ics.forth.gr
ABSTRACT
Code-injection attacks can take place in a large variety of
layers, from native code to databases and web applications.
The latter case involves mainly client-side code injection
in
the browser environment, also known as Cross-Site Script-
ing (XSS). There are numerous ways to defeat XSS attacks,
from static and taint analysis to policy enforcement in the
web browser. In this paper, we enlist new forms of XSS
attacks that seek to bypass browser enforced policies. The
attacks outlined in this paper resemble the classic
return-to-
libc
attack in native code. We propose a new form of code
isolation, based on browser actions, in order to mitigate th
e
problem.
1. INTRODUCTION
Code injection is traditionally considered as a major
threat. A signicant fraction of host compromising is
carried out using buer over
ow attacks [8]. In the
same fashion an adversary can compromise a database
using a
SQL
injection attack [1] or the web browser's
environment using a Cross-Site Scripting (XSS) attack.
An XSS attack is typically carried out as follows. An
attacker injects some client-side code, usually JavaScrip
t,
in a web document. The injection may performed, but
is not limited to, in a content submission. For example,
a user posts a comment in a blog story, which embeds
some JavaScript. The result is that every web browser
that renders the comment of the blog story will, also,
execute the attacker's JavaScript. The attacker's code
can steal the user's cookies and, thus, hijack her session.
Our contribution.
There are numerous proposals
for XSS attack mitigation. In this paper we explore
BEEP [6], which tries to defend against XSS attacks
using a policy enforcement framework in web browsers.
We spot limitations in the approach and develop new
XSS attacks that succeed to bypass the policy frame-
work. Finally, we propose our own framework which
is based on policies expressed as
browser actions
. Our
framework guarantees that all trusted client-side code
can be successfully isolated from possibly untrusted.
This paper is organized as follows. We review the
state of the art in current approaches for browser en-
forced policies in Section 2 and we enlist new forms of
XSS attacks in Section 3. We outline our XSS mitiga-
tion proposal in Section 4. We conclude and present
our future steps in Section 5.
2. BROWSER POLICIES
In this section we present the state-of-the-art ap-
proach for embedding policies in the web browser [6]
and we highlight the weaknesses of the methodology.
We then proceed, in the next section, and present XSS
attacks that cannot be captured by the current scheme.
2.1 Overview
Enforcing policies in the web browser aims at han-
dling and, possibly, aborting execution of untrusted clien
t-
side code. Implementing policies in the browser, accord-
ing to [6], is based on the following assumptions:
1. Web browsers have all the required complexity in
order to detect (parse) and render a script.
2. The web application developer knows exactly which
scripts are trusted to be executed in the web bowser.
We totally agree, as far as assumption (1) is con-
cerned. The complexity and the plethora of client-side
technologies have transformed a web document's ren-
dering to a very sophisticated process, which can be
carried out, correctly, only by modern full-featured web
browsers. Consider, also, that it is a common prac-
tice for browsers to render a page in a
best-eort
ap-
proach, meaning that even grammatically ill constructs
(e.g. misplacement of HTML tags), sometimes, are ex-
ecuted. These arguments conclude our thesis: script
detection should be carried out in the web browser and
not in the web server.
On the contrary, we do not fully support assumption
(2). Considering that (a) modern web applications are
composed by thousands, or even millions, lines of code
(for example take into account applications like GMail
or Google Documents), (b) most web applications con-
tain code for server-side tasks, database access, layout
1
