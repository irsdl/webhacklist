# 2024 missed-technique audit

This folder records the fresh 2026-08-09 audit for web-security research first
published in calendar year 2024 but absent from the original nomination round.
The exclusion set contained 123 distinct source URLs from
[`2024.md`](../../2024.md). Exact-link filtering was followed by semantic
comparison against every nomination and backward checks through the 2006–2023
lists, so renamed papers, later proceedings copies and companion artifacts were
not re-added.

The historical-list gate is **60 or above plus a qualifying non-duplicate
verdict**. First public release controls the year, not a later conference date.
All credible leads remain recorded, including candidates excluded on date,
scope, prior-art or same-mechanism grounds.

## Coverage

- Complete Web/browser-relevant programs and primary papers from IEEE S&P,
  USENIX Security, NDSS/MADWeb, ACM CCS, AsiaCCS and RAID.
- PortSwigger Research's complete 2024 archive, with publication timestamps and
  semantic comparison to the three PortSwigger nominations already present.
- Browser SVG, WebGPU, network-latency and extension side channels; Web platform
  policy invariants; Electron and extension analysis; PDF rendering ambiguity.
- CDN, DNS and Web-cache state; REST APIs, OpenID Connect and signed-token
  testing; PHP, React, stored-XSS and general Web-fuzzing methods.
- Strict first-disclosure checks against preprints and author project pages.
  These caught several venue-year false positives from 2020–2023.
- A bounded non-US pass through European and Asian institutions represented in
  the major venues and AsiaCCS. No additional non-English primary source cleared
  all date, scope, originality and evidence gates.

No archived capture was opened, validated or changed during this audit.

## Results

- 39 credible leads retained.
- 21 candidates received full scorecards and passed the 60-or-above,
  first-publication and non-duplicate gates.
- 18 additional leads were screened as prior-year disclosure, already present,
  a same-mechanism companion, defensive/measurement-only, or out of scope.
- No qualifying candidate landed in the recovered 60–69.9 band. The lower gate
  was still applied; the lowest passing candidate scored 73.0.

| Score | Verdict | List decision | Candidate |
|---:|---|---|---|
| 90.8 | Original technique | add | [SnailLoad](https://www.usenix.org/conference/usenixsecurity24/presentation/gast) |
| 89.7 | Original technique | add | [Generic and Automated Drive-by GPU Cache Attacks](https://www.rolandczerny.com/publications/2024-webgpu/) |
| 89.2 | Tooling or methodology contribution | add | [Web Platform Threats](https://www.usenix.org/conference/usenixsecurity24/presentation/bernardo) |
| 89.2 | Original technique | add | [CDN Cannon](https://www.usenix.org/conference/usenixsecurity24/presentation/lin-ziyu) |
| 88.5 | Meaningful extension | add | [GHunter](https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen) |
| 87.0 | Tooling or methodology contribution | add | [Argus](https://www.usenix.org/conference/usenixsecurity24/presentation/jahanshahi) |
| 87.0 | Original technique | add | [DNS CacheFlush](https://www.usenix.org/conference/usenixsecurity24/presentation/afek) |
| 86.5 | Meaningful extension | add | [Pixel Thief](https://www.usenix.org/conference/usenixsecurity24/presentation/oconnell) |
| 85.7 | Meaningful extension | add | [Internet's Invisible Enemy](https://doi.org/10.1145/3658644.3690361) |
| 85.0 | Tooling or methodology contribution | add | [Vulnerability-oriented Testing for RESTful APIs](https://www.usenix.org/conference/usenixsecurity24/presentation/du) |
| 84.9 | Original technique | add | [Peeking through the window](https://doi.org/10.1145/3658644.3670339) |
| 83.7 | Tooling or methodology contribution | add | [FuzzCache](https://zhangmx1997.github.io/papers/ccs24_fuzzcache.pdf) |
| 83.6 | Tooling or methodology contribution | add | [ReactAppScan](https://www.yinzhicao.org/reactappscan/reactappscan.pdf) |
| 82.8 | Tooling or methodology contribution | add | [AuthSaber](https://ucla-sec-lab.netlify.app/publication/2024-authsaber/) |
| 82.7 | Tooling or methodology contribution | add | [Spider-Scents](https://www.usenix.org/conference/usenixsecurity24/presentation/olsson) |
| 82.4 | Tooling or methodology contribution | add | [Inspectron](https://www.usenix.org/conference/usenixsecurity24/presentation/ali) |
| 79.2 | Tooling or methodology contribution | add | [Arcanum](https://www.usenix.org/conference/usenixsecurity24/presentation/xie-qinge) |
| 78.9 | Tooling or methodology contribution | add | [URL Validation Bypass Cheat Sheet](https://portswigger.net/research/introducing-the-url-validation-bypass-cheat-sheet) |
| 77.1 | Meaningful combination or adaptation | add | [Fickle PDFs](https://portswigger.net/research/fickle-pdfs-exploiting-browser-rendering-discrepancies) |
| 76.2 | Meaningful extension | add | [Concealing payloads in URL credentials](https://portswigger.net/research/concealing-payloads-in-url-credentials) |
| 73.0 | Tooling or methodology contribution | add | [SignSaboteur](https://portswigger.net/research/introducing-signsaboteur-forge-signed-web-tokens-with-ease) |

## Screened leads

| Candidate | Outcome | Screening evidence |
|---|---|---|
| A Security and Usability Analysis of Local Attacks Against FIDO2 | wrong year | The complete arXiv paper was public on 6 August 2023. |
| It's (DOM) Clobbering Time | wrong year / already historical | IEEE S&P published it in 2023 and the 2023 missed audit already retains it. |
| Atropos | wrong year | USENIX's `sec23winter` prepublication was public in 2023; the 2024 proceedings date does not reset disclosure. |
| Toss a Fault to Your Witcher | wrong year | The author and IEEE records identify it as an IEEE S&P 2023 paper. |
| NoJITsu | wrong year | Primary NDSS and Black Hat materials are from 2020. |
| insecure:// URI Scheme Handling | wrong year | Primary MADWeb paper and DOI are from 2022. |
| Dancer in the Dark | original nominee | Already present verbatim in `2024.md`. |
| Parse Me, Baby, One More Time | original nominee | Already present in `2024.md`; a venue URL alias cannot create a new entry. |
| The Great Request Robbery | same mechanism | Systematises client-side request hijacking already represented by the original CSPT2CSRF and encoded-CSPT nominations. |
| Making desync attacks easy with TRACE | same mechanism | A request-desynchronisation delivery simplification beside the year's TE.0, HTTP differential-fuzzing and parser-confusion nominations. |
| New crazy payloads in the URL Validation Bypass Cheat Sheet | companion update | October update to the retained September cheat-sheet resource, not a separate method. |
| Using form hijacking to bypass CSP | prior public mechanism | The article says the demonstrated Mastodon form-hijacking case was already public more than a year earlier. |
| Hiding payloads in Java source-code strings | prior art / scope | Repackages Java Unicode preprocessing and Trojan Source-style concealment for trusted local Bambda execution. |
| WEBRR | defensive forensics | Records and replays browser attacks after compromise; it does not introduce an attack or discovery method. |
| Trust Me If You Can | usability study | Evaluates Trusted Types deployment usability rather than adding an offensive primitive. |
| Free Proxies Unmasked | measurement | Measures proxy-service vulnerabilities but does not present a sufficiently reusable Web-hacking mechanism. |
| SoK: State of the Krawlers | survey | Systematises Web-crawling choices without introducing a new offensive primitive. |
| EMMasker / cookie-notice and extension-policy studies | defensive or compliance measurement | Defenses and ecosystem measurements without a distinct attack or testing method that clears the marginal-originality gate. |

## Notes on the gate

This pass did not manufacture a 60–69 recovery: every qualifying result remained
above 70 after novelty penalties, while prior-year and same-mechanism candidates
failed independent gates regardless of score. The audit did not run the reference
archiver or refresh either Web application.

## Single-publisher sweep — `blog.voorivex.team` (10 August 2026)

A later, separate pass from the audit above: rather than sweeping a year, it swept
one publisher across all years. Every post on `blog.voorivex.team` was enumerated
from the site's sitemap so pagination could not hide any. Two are already in
[`2024.md`](../../2024.md) — *OAuth Non-Happy Path to ATO* (#8 in the Top 10) and
*Android Exploit to RCE* — and four more fall in the 2024 window. **Nothing was
added:** the three technique writeups scored below the 60 gate and the fourth is
not a technique writeup at all. Scorecards are in [judgements.md](judgements.md).

| Score | Verdict | List decision | Candidate |
|---:|---|---|---|
| 49.6 | Useful application or case study | below gate | [Account Takeover due to DNS Rebinding](https://blog.voorivex.team/account-takeover-due-to-dns-rebinding) |
| 46.3 | Useful application or case study | below gate | [A Weird CSP Bypass led to $3.5k Bounty](https://blog.voorivex.team/a-weird-csp-bypass-led-to-35k-bounty) |
| 44.2 | Useful application or case study | below gate | [Drilling the redirect_uri in OAuth](https://blog.voorivex.team/drilling-the-redirecturi-in-oauth) |

Two of the three warrant a note beyond the score. The CSP bypass is an instance of
*Bypassing CSP with policy injection* (Gareth Heyes, 2019), which is already listed
in [`2019.md`](../../2019.md) at 83.8 and archived — the semicolon injection and the
first-occurrence-wins rule are that entry's contribution, not this one's. And the
DNS-rebinding post does not describe DNS rebinding: the mechanism is a
verified-once domain allowlist that is never re-checked at use, which is the
dangling-DNS and subdomain-takeover lineage. Recorded so a later sweep does not
re-chase either under the wrong name.

### Screened lead

| Candidate | Outcome | Screening evidence |
|---|---|---|
| [$20,300 Bounties from a 200 Hour Hacking Challenge](https://blog.voorivex.team/20300-bounties-from-a-200-hour-hacking-challenge) | not a technique candidate | A bug-bounty experience narrative by Mohammad Zaheri. The findings it lists (Swagger exposure, time-based SQLi, IDOR via method switching, stored XSS with a Google JSONP CSP gadget, exposed config) are each standard classes reported as a tally with no technique developed; there is no candidate contribution to score. |

## Source-set sweep — ysonet .NET deserialization references (12 August 2026)

A later, separate pass from the audit above. Rather than sweeping the year, it
swept one external corpus: the 26,422-line acquisition log
(`docs/references-md/history.jsonl`) behind the ysonet project's .NET
deserialization reference archive. That log resolves to 519 distinct documents;
16 were already recorded in this repository, and the remaining 503 were filtered
to 274 research-grade articles, whitepapers, slide decks and talks, then
title-matched against the year lists and the reference manifest to remove eight
mirrors of entries already present. The residue was pre-screened against the
judge rubric; product advisories, vendor knowledge-base articles, news coverage,
threat-intelligence reports, framework documentation, CTF and HTB writeups, and
duplicate recordings of already-listed talks were resolved during screening
rather than scored.

**One addition**, and one candidate scored above 60 but excluded on verdict and
scope. Scorecards in [judgements.md](judgements.md).

| Score | Verdict | List decision | Candidate |
|---:|---|---|---|
| 74.7 | Original technique | added | [Leaking ObjRefs to Exploit HTTP .NET Remoting](https://code-white.com/blog/leaking-objrefs-to-exploit-http-dotnet-remoting/) |
| 63.3 | Tooling or methodology contribution | not added | [View State, the unpatchable IIS forever day being actively exploited](https://zeroed.tech/blog/viewstate-the-unpatchable-iis-forever-day-being-actively-exploited/) |

The ObjRef leak is a companion to, not a duplicate of, "Teaching the Old .NET
Remoting New Exploitation Tricks" already nominated for 2024: the nominated post
consumes the leak and concentrates on TypeFilterLevel and channel constraints,
while this one supplies the information disclosure (CVE-2024-29059) that removes
the known-object-URI precondition.

The zeroed.tech post clears the numeric gate on practical and presentational
strength. It is not added because its offensive half restates technique already
represented from 2019 onward and its original half is incident-response
methodology rather than an offensive web hacking technique. The exclusion rests
on the verdict and scope, not on the number.

### Screened leads

| Candidate | Outcome | Screening evidence |
|---|---|---|
| [ZDI: Exploiting Exchange PowerShell After ProxyNotShell, Parts 1-3](https://www.thezdi.com/blog/2024/9/4/exploiting-exchange-powershell-after-proxynotshell-part-1-multivaluedproperty) | already represented | Already in the reference archive and represented by the 2024 nomination "Half Measures and Full Compromise". |
| [Introducing Aladdin](https://www.lrqa.com/en/cyber-labs/introducing-aladdin/) | tooling for known technique | A payload generator for established .NET gadget chains. |
| [WhatsUp Gold Pre-Auth RCE: GetFileWithoutZip and WriteDataFile primitives](https://summoning.team/blog/progress-whatsup-gold-rce-cve-2024-4885/) | product advisory | Two product CVEs reached through known path-traversal and deserialization sinks. |
| [Veeam Backup and Response RCE (CVE-2024-40711)](https://labs.watchtowr.com/veeam-backup-response-rce-with-auth-but-mostly-without-auth-cve-2024-40711-2/) | product advisory | One product CVE; the general blocklist result is the 2023 number-two entry. |
| [Citrix Virtual Apps and Desktops MSMQ deserialization](https://labs.watchtowr.com/visionaries-at-citrix-have-democratised-remote-network-access-citrix-virtual-apps-and-desktops-cve-unknown/) | scope mismatch | The attack surface is MSMQ over a non-HTTP transport. |
| [BinaryFormatter removal from .NET 9](https://github.com/dotnet/announcements/issues/293) | not a technique candidate | A platform announcement, not research. |

## Issue submission #8 (2 September 2026)

The submitted article is dated March 2025, but its substantive payload material
was public in the author's site repository on 22 July 2024, followed by an
August post and a November Ekoparty talk. First technical disclosure therefore
puts it in the 2024 collection. It clears the historical-list gate as a
meaningful extension: SSTI-to-RCE and individual filter bypasses were already
known, while the submission systematically removes both quotes and dependence
on external request data across several template engines. Full reasoning is in
[judgements.md](judgements.md).

| Score | Verdict | List decision | Candidate |
|---:|---|---|---|
| 68.9 | Meaningful extension | add | [Limitations are just an illusion – advanced server-side template exploitation with RCE everywhere](https://www.yeswehack.com/learn-bug-bounty/server-side-template-injection-exploitation) |
