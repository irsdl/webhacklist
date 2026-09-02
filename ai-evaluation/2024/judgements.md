# 2024 candidate judgements

These scorecards apply the repository's weighted judge rubric. `KEPT` means the
candidate met the historical 60-or-above rule together with the calendar-year,
originality-verdict and original-nomination exclusions.

## 90.8 — [SnailLoad: Exploiting Remote Network Latency Measurements without JavaScript](https://www.usenix.org/conference/usenixsecurity24/presentation/gast) — Stefan Gast et al.

**KEPT** · Original technique · confidence High

### Candidate

Peer-reviewed USENIX Security paper and primary project disclosure published in
2024; no complete earlier public version was found.

### Core contribution

A deliberately slow cross-origin asset lets its server measure congestion-driven
round-trip changes and infer the victim's simultaneous network activity. It lifts
website and video fingerprinting from an on-path observer to a remote server
without JavaScript or user interaction.

### Prior art

Traffic fingerprinting and remote timing were established. Using a slow HTTP
transfer as a continuously remote latency probe, without an on-path position, is
the distinct mechanism.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 93 | 25% | 23.25 | Converts shared last-mile latency into a remote activity oracle. |
| Transferability | 92 | 20% | 18.40 | Applies to ordinary assets, videos and websites across networks. |
| Lasting value | 90 | 20% | 18.00 | Changes the assumed observer needed for traffic analysis. |
| Technical soundness | 92 | 15% | 13.80 | Open- and closed-world evaluations validate the channel. |
| Practical usability | 82 | 10% | 8.20 | A hostile server can deploy it, though classification needs traces. |
| Clarity and reproducibility | 91 | 10% | 9.10 | Paper, project site and proof of concept document the method. |

**Final score: 90.8/100.** Archive decision: include as a core technique.

### Verdict

Original technique. It removes both script execution and the on-path vantage
point from a practical Web-activity side channel.

## 89.7 — [Generic and Automated Drive-by GPU Cache Attacks from the Browser](https://www.rolandczerny.com/publications/2024-webgpu/) — Lukas Giner et al.

**KEPT** · Original technique · confidence High

### Candidate

Publicly disclosed in March 2024 and published at AsiaCCS 2024; the author page,
paper and coordinated vendor bulletin agree on the year.

### Core contribution

WebGPU compute shaders build self-configuring GPU eviction sets inside the
browser. The resulting drive-by cache channel recovers keystroke timing, leaks a
GPU AES key and supports native-to-browser exfiltration across varied GPUs.

### Prior art

Native GPU cache attacks and browser CPU-cache attacks existed. This is the
first automated GPU-cache attack from WebGPU's restricted browser environment.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 94 | 25% | 23.50 | Establishes browser WebGPU as a generic GPU-cache attack surface. |
| Transferability | 88 | 20% | 17.60 | Self-configures across 11 GPUs, generations and two vendors. |
| Lasting value | 90 | 20% | 18.00 | WebGPU exposes a durable new browser hardware boundary. |
| Technical soundness | 92 | 15% | 13.80 | Three end-to-end attacks substantiate the primitives. |
| Practical usability | 80 | 10% | 8.00 | Drive-by delivery is easy; useful leakage remains workload-specific. |
| Clarity and reproducibility | 88 | 10% | 8.80 | Primary paper and project page provide design and results. |

**Final score: 89.7/100.** Archive decision: include as a core technique.

### Verdict

Original technique. WebGPU supplies a browser-native path to hardware cache
attacks that prior JavaScript and native-GPU work did not provide.

## 89.2 — [Web Platform Threats: Automated Detection of Web Security Issues With WPT](https://www.usenix.org/conference/usenixsecurity24/presentation/bernardo) — Pedro Bernardo et al.

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

USENIX published the paper and artifact in 2024; no earlier complete disclosure
was located.

### Core contribution

The framework converts Web Platform Tests into browser traces and checks them
against first-order security invariants. Nine invariants found security-relevant
violations in 104 Chromium, Firefox and Safari tests, producing eight reports
and a Safari CVE.

### Prior art

Differential browser testing and the 2023 DiffCSP work were known. This method
generalises beyond CSP by coupling standards tests to explicit security-property
oracles rather than relying only on cross-browser disagreement.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 84 | 25% | 21.00 | Turns conformance traces into formal security checks. |
| Transferability | 92 | 20% | 18.40 | Applies across mechanisms, tests and the three major engines. |
| Lasting value | 91 | 20% | 18.20 | Reuses a maintained standards corpus as browsers evolve. |
| Technical soundness | 93 | 15% | 13.95 | Confirmed reports and a CVE validate the invariants. |
| Practical usability | 86 | 10% | 8.60 | Artifact automates trace collection and solver checks. |
| Clarity and reproducibility | 90 | 10% | 9.00 | Invariants, workflow and artifact are explicit. |

**Final score: 89.2/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It materially expands semantic browser
testing from policy-specific differential checks to reusable security invariants.

## 89.2 — [CDN Cannon: Exploiting CDN Back-to-Origin Strategies for Amplification Attacks](https://www.usenix.org/conference/usenixsecurity24/presentation/lin-ziyu) — Ziyu Lin et al.

**KEPT** · Original technique · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024; primary author and venue
records show no earlier complete release.

### Core contribution

Back-to-Origin Amplification abuses CDN image optimisation, request rewriting,
HEAD-to-GET conversion and connection decoupling so small client traffic forces
vastly larger origin traffic, with measured amplification above 100,000×.

### Prior art

CDN cache attacks and amplification DoS were established. Weaponising CDN
performance transformations against the protected origin is a separate class.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 92 | 25% | 23.00 | Defines CDN back-to-origin behaviour as an amplifier. |
| Transferability | 90 | 20% | 18.00 | Four strategies affect major CDNs and hosted origins. |
| Lasting value | 88 | 20% | 17.60 | Performance transformations remain central to CDN design. |
| Technical soundness | 90 | 15% | 13.50 | Fourteen-CDN evaluation and disclosures substantiate impact. |
| Practical usability | 83 | 10% | 8.30 | Low attacker bandwidth can trigger large amplification. |
| Clarity and reproducibility | 88 | 10% | 8.80 | Attack variants and amplification measurements are detailed. |

**Final score: 89.2/100.** Archive decision: include as a core technique.

### Verdict

Original technique. The amplification comes from CDN-to-origin transformations,
not conventional reflection or a renamed cache-poisoning case.

## 88.5 — [GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes](https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen) — Eric Cornelissen, Mikhail Shcherbakov, Musard Balliu

**KEPT** · Meaningful extension · confidence High

### Candidate

The complete arXiv paper was first posted on 15 July 2024 and the work appeared
at USENIX Security 2024.

### Core contribution

GHunter instruments V8 and drives Node.js and Deno test suites with lightweight
taint tracking to discover universal runtime prototype-pollution gadgets. It
found 123 new gadgets spanning RCE, privilege escalation and path traversal.

### Prior art

Prototype pollution and application/library gadget scanners were already known
and appear in the original list. Runtime-wide gadget discovery driven by the
runtimes' own test suites materially broadens reach and consequence analysis.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 84 | 25% | 21.00 | Extends gadget discovery into shared JavaScript runtimes. |
| Transferability | 92 | 20% | 18.40 | Runtime gadgets affect many applications on Node.js and Deno. |
| Lasting value | 88 | 20% | 17.60 | Universal gadgets remain relevant across dependency changes. |
| Technical soundness | 93 | 15% | 123 validated gadgets and a high-severity CVE support it. |
| Practical usability | 86 | 10% | 8.60 | Open artifacts and test-suite driving make it actionable. |
| Clarity and reproducibility | 90 | 10% | 9.00 | Pipeline, artifacts and validation process are documented. |

**Final score: 88.5/100.** Archive decision: include as a core technique.

### Verdict

Meaningful extension. It is not another application gadget finder: it maps the
universal gadget layer supplied by the runtime itself.

## 87.0 — [Argus: All your (PHP) Injection-sinks are belong to us](https://www.usenix.org/conference/usenixsecurity24/presentation/jahanshahi) — Rasoul Jahanshahi, Manuel Egele

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024; no earlier complete
public version was found.

### Core contribution

Argus analyses PHP interpreter internals to derive injection sinks automatically
instead of trusting incomplete hand-curated lists. Feeding the results into
Psalm, RIPS and FUGIO exposed 13 previously unknown WordPress/plugin flaws.

### Prior art

Taint analysis and exploit generation already consumed sink lists. Automatically
recovering deserialisation, command-execution and output sinks from the language
runtime addresses a different and foundational blind spot.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 82 | 25% | 20.50 | Derives security sinks from interpreter semantics. |
| Transferability | 91 | 20% | 18.20 | Improves multiple analysers and three injection classes. |
| Lasting value | 87 | 20% | 17.40 | Avoids brittle, manually maintained sink inventories. |
| Technical soundness | 92 | 15% | 13.80 | Hundreds of sinks and confirmed CVEs validate the method. |
| Practical usability | 83 | 10% | 8.30 | Results integrate into existing analysis and exploit tools. |
| Clarity and reproducibility | 88 | 10% | 8.80 | Runtime analysis and downstream evaluation are explicit. |

**Final score: 87.0/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. The technique improves the completeness of
whole families of PHP injection analyses rather than adding a narrow payload.

## 87.0 — [A Flushing Attack on the DNS Cache](https://www.usenix.org/conference/usenixsecurity24/presentation/afek) — Yehuda Afek, Anat Bremler-Barr, Shoham Danino, Yuval Shavitt

**KEPT** · Original technique · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024; the venue paper and
artifact are the first complete public records located.

### Core contribution

DNS CacheFlush uses seemingly valid referral or CNAME-heavy answers to force a
resolver to insert records at high rate, evict benign entries from LRU caches and
turn modest request traffic into sustained resolver cache misses and delay.

### Prior art

DNS cache poisoning, flooding and eviction pressure were known. This attack
amplifies cache insertion work through valid-looking answer structure to thrash
even frequently queried entries without poisoning their values.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 91 | 25% | 22.75 | Introduces answer-amplified resolver cache thrashing. |
| Transferability | 88 | 20% | 17.60 | Targets common resolver caches and DNS response structures. |
| Lasting value | 84 | 20% | 16.80 | Cache-capacity pressure persists across resolver designs. |
| Technical soundness | 91 | 15% | 13.65 | Controlled experiments quantify misses and throughput loss. |
| Practical usability | 74 | 10% | 7.40 | Requires authoritative response control and sustained queries. |
| Clarity and reproducibility | 88 | 10% | 8.80 | Paper and isolated simulator artifact explain the attack. |

**Final score: 87.0/100.** Archive decision: include as a core technique.

### Verdict

Original technique. It is cache eviction by DNS answer expansion, not another
poisoned-record or ordinary volumetric DNS attack.

## 86.5 — [Pixel Thief: Exploiting SVG Filter Leakage in Firefox and Chrome](https://www.usenix.org/conference/usenixsecurity24/presentation/oconnell) — Sioli O'Connell et al.

**KEPT** · Meaningful extension · confidence High

### Candidate

The primary paper record is from January 2024 and the work appeared at USENIX
Security in August 2024.

### Core contribution

Pixel Thief forces CPU SVG-filter rendering and applies a cache side channel to
recover cross-origin text and browsing history. It leaks multiple bits per
display refresh, bypassing mitigations aimed at filter-rendering timing.

### Prior art

SVG filter timing and pixel stealing date to earlier work. Monitoring the
renderer’s data-dependent cache accesses supplies a faster channel that survives
the timing equalisation browsers deployed against those attacks.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 86 | 25% | 21.50 | Replaces mitigated filter timing with renderer cache leakage. |
| Transferability | 88 | 20% | 17.60 | Demonstrated in Firefox and Chrome for two leak goals. |
| Lasting value | 86 | 20% | 17.20 | Shows timing equalisation does not close rendering leakage. |
| Technical soundness | 91 | 15% | 13.65 | Text recovery and high-speed history sniffing validate it. |
| Practical usability | 78 | 10% | 7.80 | Web delivery is direct but hardware and rendering conditions matter. |
| Clarity and reproducibility | 88 | 10% | 8.80 | Attack construction and primary artifact are documented. |

**Final score: 86.5/100.** Archive decision: include as a core technique.

### Verdict

Meaningful extension. It changes the observable from frame time to cache access
and materially improves both rate and resistance to existing mitigation.

## 85.7 — [Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild](https://doi.org/10.1145/3658644.3690361) — Yuejia Liang et al.

**KEPT** · Meaningful extension · confidence High

### Candidate

Peer-reviewed ACM CCS paper first published in 2024; no complete earlier public
version was located.

### Core contribution

HCache generates cache-key-aware mutations and safely validates poisoning with
normal, attack and validation requests. Its Internet-scale study found seven new
header vectors and vulnerable sites across 17% of measured top domains.

### Prior art

Web cache poisoning and manual unkeyed-input probing were established and well
represented in the original list. Systematic, cache-key-aware and non-disruptive
large-scale vector discovery is the meaningful methodological extension.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 82 | 25% | 20.50 | Adds safe cache-key-aware discovery and seven vectors. |
| Transferability | 91 | 20% | 18.20 | Applies across caches, headers, domains and deployments. |
| Lasting value | 85 | 20% | 17.00 | Cache-key disagreement remains a broad Web risk. |
| Technical soundness | 90 | 15% | 13.50 | Large-scale results and vendor confirmations support it. |
| Practical usability | 78 | 10% | 7.80 | Automation is useful, though Internet scanning needs care. |
| Clarity and reproducibility | 87 | 10% | 8.70 | Generation, isolation and validation steps are described. |

**Final score: 85.7/100.** Archive decision: include as a core technique.

### Verdict

Meaningful extension. It turns case-by-case cache poisoning into systematic and
safely measurable attack-surface discovery.

## 85.0 — [Vulnerability-oriented Testing for RESTful APIs](https://www.usenix.org/conference/usenixsecurity24/presentation/du) — Wenlong Du et al.

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024; no earlier complete
public version was found.

### Core contribution

VOAPI2 infers API functionality from identifiers, generates stateful request
sequences with vulnerability-specific payloads and verifies flaws from feedback.
It found 26 real-world bugs, 23 with CVEs, across seven REST APIs.

### Prior art

OpenAPI fuzzing and stateful API testing existed. Selecting sequences and attack
oracles from inferred endpoint functionality is the distinct contribution.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 80 | 25% | 20.00 | Couples inferred endpoint function to targeted attack testing. |
| Transferability | 88 | 20% | 17.60 | Supports varied APIs and vulnerability classes. |
| Lasting value | 84 | 20% | 16.80 | Stateful semantic API testing remains broadly useful. |
| Technical soundness | 91 | 15% | 13.65 | Real deployments and 23 CVEs substantiate results. |
| Practical usability | 82 | 10% | 8.20 | Automated sequences and feedback reduce manual testing. |
| Clarity and reproducibility | 87 | 10% | 8.70 | Stages and evaluation are clearly documented. |

**Final score: 85.0/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It adds vulnerability-oriented semantic
guidance to API testing rather than merely increasing request volume.

## 84.9 — [Peeking through the window: Fingerprinting Browser Extensions through Page-Visible Execution Traces and Interactions](https://doi.org/10.1145/3658644.3670339) — Shubham Agarwal, Aurore Fass, Ben Stock

**KEPT** · Original technique · confidence High

### Candidate

Peer-reviewed ACM CCS paper first published in 2024; no earlier complete release
was found.

### Core contribution

A website identifies installed extensions from page-visible execution traces
and interactions caused by content scripts, without relying on web-accessible
extension resources. Existing anti-fingerprinting defenses miss these vectors.

### Prior art

Extension fingerprinting through resources and DOM artefacts was known. Using
observable script execution and interaction behaviour supplies a distinct oracle.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 84 | 25% | 21.00 | Introduces execution-trace and interaction fingerprints. |
| Transferability | 88 | 20% | 17.60 | Applies to many content-script behaviours and extensions. |
| Lasting value | 84 | 20% | 16.80 | Page/extension interaction remains intrinsic to extensions. |
| Technical soundness | 88 | 15% | 13.20 | Large extension analysis and validated vectors support it. |
| Practical usability | 78 | 10% | 7.80 | A hostile page can probe visitors with some profiling. |
| Clarity and reproducibility | 85 | 10% | 8.50 | Threat model and vector construction are documented. |

**Final score: 84.9/100.** Archive decision: include as a core technique.

### Verdict

Original technique. The observed signal is extension execution behaviour, not
another URL probe for exposed package resources.

## 83.7 — [FuzzCache: Optimizing Web Application Fuzzing Through Software-Based Data Cache](https://zhangmx1997.github.io/papers/ccs24_fuzzcache.pdf) — Penghui Li, Mingxue Zhang

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed ACM CCS paper first published in 2024.

### Core contribution

FuzzCache shares safely invalidated database and network results across PHP
fuzzing trials and adds JIT execution. Integrated into black- and grey-box Web
fuzzers, it raises throughput 3–4× and code coverage by about 25%.

### Prior art

Web fuzzing and process snapshots existed. Caching repeated external data access
across isolated Web trials is a complementary performance method.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 73 | 25% | 18.25 | Adds cross-trial data caching tailored to Web state. |
| Transferability | 90 | 20% | 18.00 | Complements black- and grey-box Web fuzzers. |
| Lasting value | 82 | 20% | 16.40 | Database/network latency is a durable Web-testing bottleneck. |
| Technical soundness | 90 | 15% | 13.50 | Measured throughput, coverage and bug gains support it. |
| Practical usability | 89 | 10% | 8.90 | Integrates with existing fuzzers rather than replacing them. |
| Clarity and reproducibility | 86 | 10% | 8.60 | Cache model, invalidation and evaluation are explicit. |

**Final score: 83.7/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It is a reusable Web-fuzzing accelerator,
not a new vulnerability class.

## 83.6 — [ReactAppScan: Mining React Application Vulnerabilities via Component Graph](https://www.yinzhicao.org/reactappscan/reactappscan.pdf) — Zhiyong Guo et al.

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed ACM CCS paper first published in 2024.

### Core contribution

ReactAppScan models component lifecycles, props, state and client/server flows
in a component graph, then queries source-to-sink paths. It found 61 zero-days
that ordinary JavaScript/JSX analysis missed.

### Prior art

JavaScript abstract interpretation and CodeQL supported portions of JSX. The
component-lifecycle graph makes React-specific cross-component flows tractable.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 79 | 25% | 19.75 | Models React lifecycle, props and state as security flow. |
| Transferability | 86 | 20% | 17.20 | Covers common React applications and packages. |
| Lasting value | 84 | 20% | 16.80 | Component-based SPAs remain widespread. |
| Technical soundness | 90 | 15% | 13.50 | 61 findings and comparison with CodeQL substantiate it. |
| Practical usability | 79 | 10% | 7.90 | Open source, though it needs application source. |
| Clarity and reproducibility | 84 | 10% | 8.40 | Graph construction and evaluation are documented. |

**Final score: 83.6/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It adds React-native data-flow semantics
that generic JavaScript analysis lacks.

## 82.8 — [AuthSaber: Automated Safety Verification of OpenID Connect Programs](https://ucla-sec-lab.netlify.app/publication/2024-authsaber/) — Tamjid Al Rahat, Yu Feng, Yuan Tian

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

The primary author page dates the work to July 2024 and ACM CCS 2024; no earlier
complete public version was found.

### Core contribution

AuthSaber turns OpenID Connect safety properties into automated program checks,
including authentication ordering, token algorithm, issuer and code-use rules,
to expose implementation-level authentication flaws.

### Prior art

OIDC protocol analysis and individual OAuth/OIDC bugs were known. Automated
verification of concrete relying-party/provider programs against a property set
is the distinct methodology.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 80 | 25% | 20.00 | Maps OIDC safety requirements to implementation checks. |
| Transferability | 82 | 20% | 16.40 | Applies across implementations sharing OIDC flows. |
| Lasting value | 86 | 20% | 17.20 | OIDC program logic remains complex and security-critical. |
| Technical soundness | 90 | 15% | 13.50 | Formalised properties and evaluated programs support it. |
| Practical usability | 74 | 10% | 7.40 | Automation helps, but program modelling remains specialised. |
| Clarity and reproducibility | 83 | 10% | 8.30 | Paper, code and dataset are linked by the authors. |

**Final score: 82.8/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It verifies protocol invariants in real
OIDC code rather than presenting another single OAuth misconfiguration.

## 82.7 — [Spider-Scents: Grey-box Database-aware Web Scanning for Stored XSS](https://www.usenix.org/conference/usenixsecurity24/presentation/olsson) — Eric Olsson, Benjamin Eriksson, Adam Doupé, Andrei Sabelfeld

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024; no earlier complete
public version was found.

### Core contribution

Spider-Scents injects markers and XSS payloads directly into the database, maps
values to rendered outputs and identifies unprotected stored-XSS paths. It
reached 79–100% database coverage and found 85 vulnerabilities.

### Prior art

Black-box stored-XSS scanning and database-aware test generation existed. Direct
database injection deliberately bypasses hard-to-reach write paths to audit all
later render paths.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 83 | 25% | 20.75 | Reverses stored-XSS testing by seeding the database. |
| Transferability | 79 | 20% | 15.80 | Useful across database-backed apps with deployment access. |
| Lasting value | 80 | 20% | 16.00 | Stored rendering paths remain difficult for scanners. |
| Technical soundness | 91 | 15% | 13.65 | Twelve-app comparison and 85 findings validate it. |
| Practical usability | 78 | 10% | 7.80 | Effective in grey-box assessments with database access. |
| Clarity and reproducibility | 87 | 10% | 8.70 | Mapping, smells and exploitability analysis are clear. |

**Final score: 82.7/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. Direct database seeding exposes stored-XSS
render paths unreachable to conventional front-door scanners.

## 82.4 — [Rise of Inspectron: Automated Black-box Auditing of Cross-platform Electron Apps](https://www.usenix.org/conference/usenixsecurity24/presentation/ali) — Mir Masood Ali et al.

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024.

### Core contribution

Inspectron dynamically audits packaged Electron applications without source for
dangerous browser-to-OS configurations and deviations from Electron hardening
guidance, making cross-platform desktop-Web review scalable.

### Prior art

The 2023 list already retains an Electron security study and programming method.
Black-box auditing of packaged applications is a meaningful operational extension,
not a duplicate of source-guided DOM taming.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 76 | 25% | 19.00 | Adds packaged-app black-box auditing for Electron. |
| Transferability | 86 | 20% | 17.20 | Works across apps and desktop platforms. |
| Lasting value | 82 | 20% | 16.40 | Browser/OS privilege bridging remains central to Electron. |
| Technical soundness | 87 | 15% | 13.05 | Ecosystem study demonstrates practical findings. |
| Practical usability | 82 | 10% | 8.20 | Requires only packaged applications, not source. |
| Clarity and reproducibility | 85 | 10% | 8.50 | Audit model and evaluated practices are documented. |

**Final score: 82.4/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. Its black-box packaged-app model materially
extends the earlier Electron work.

## 79.2 — [Arcanum: Detecting and Evaluating the Privacy Risks of Browser Extensions on Web Pages and Web Content](https://www.usenix.org/conference/usenixsecurity24/presentation/xie-qinge) — Qinge Xie et al.

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

Peer-reviewed USENIX Security paper published in 2024.

### Core contribution

Arcanum adds dynamic taint tracking to modern Chrome-extension execution so
specific sensitive page content can be followed to extension sinks. Its full
store study found hundreds of extensions extracting user content.

### Prior art

Extension permissions, metadata leakage and older taint analyses were known.
Tracking actual modern Web-page content through Manifest-era extension APIs is
the practical extension.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 72 | 25% | 18.00 | Modernises taint analysis around page-content leakage. |
| Transferability | 84 | 20% | 16.80 | Covers the Chrome store and diverse sensitive sites. |
| Lasting value | 78 | 20% | 15.60 | Extension access to page content remains a privacy boundary. |
| Technical soundness | 88 | 15% | 13.20 | Store-wide deployment produces substantial measured findings. |
| Practical usability | 74 | 10% | 7.40 | Research instrumentation is heavier than ordinary testing. |
| Clarity and reproducibility | 82 | 10% | 8.20 | Sources, sinks and deployment are explained. |

**Final score: 79.2/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It makes sensitive Web-content extraction
by extensions observable at ecosystem scale.

## 78.9 — [Introducing the URL Validation Bypass Cheat Sheet](https://portswigger.net/research/introducing-the-url-validation-bypass-cheat-sheet) — Zakhar Fedotkin

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

PortSwigger published the primary interactive methodology on 3 September 2024;
the October payload article is treated as an update, not a second candidate.

### Core contribution

The tool contextually generates encoded domain-confusion, fake-relative,
loopback, Origin and normalisation payloads for URL validators, exporting
Intruder-ready wordlists from a maintained machine-readable corpus.

### Prior art

Nearly all underlying URL parser tricks predate the work. The qualifying value
is the interactive, context-aware and maintainable testing methodology.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 54 | 25% | 13.50 | Mostly consolidates known URL ambiguity payloads. |
| Transferability | 92 | 20% | 18.40 | Supports SSRF, CORS, redirects, hosts and WAF tests. |
| Lasting value | 82 | 20% | 16.40 | A maintained parser corpus stays useful as stacks evolve. |
| Technical soundness | 78 | 15% | 11.70 | Payload categories are grounded in parser behaviour. |
| Practical usability | 96 | 10% | 9.60 | Interactive generation and wordlist export are immediately usable. |
| Clarity and reproducibility | 93 | 10% | 9.30 | Contexts, encodings and source data are public. |

**Final score: 78.9/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. Low payload originality is outweighed by a
highly reusable testing system; it is not claimed as a new vulnerability class.

## 77.1 — [Fickle PDFs: exploiting browser rendering discrepancies](https://portswigger.net/research/fickle-pdfs-exploiting-browser-rendering-discrepancies) — Zakhar Fedotkin

**KEPT** · Meaningful combination or adaptation · confidence High

### Candidate

PortSwigger published the article and generator on 9 July 2024.

### Core contribution

Hybrid PDFs give form defaults and widget annotations conflicting values, so
Safari/Preview, Chrome/Drive and Firefox can show different invoice content.
The ambiguity supports cross-viewer document deception and AI-review mismatch.

### Prior art

Kobold Letters and PDF parser/rendering disagreement existed. Combining widget
annotations with form appearance precedence supplies a compact, reproducible
cross-viewer deception variant.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 78 | 25% | 19.50 | Exploits widget/default precedence across current viewers. |
| Transferability | 70 | 20% | 14.00 | Broad viewers are affected, but the medium is PDF-specific. |
| Lasting value | 72 | 20% | 14.40 | Ambiguous PDF rendering is persistent but specialised. |
| Technical soundness | 82 | 15% | 12.30 | Multiple engines and generated examples validate it. |
| Practical usability | 80 | 10% | 8.00 | Generator makes deceptive documents easy to reproduce. |
| Clarity and reproducibility | 89 | 10% | 8.90 | Construction, screenshots and code are supplied. |

**Final score: 77.1/100.** Archive decision: include as a core technique.

### Verdict

Meaningful combination or adaptation. It advances prior document ambiguity with
a current cross-browser form/widget construction and reusable generator.

## 76.2 — [Concealing payloads in URL credentials](https://portswigger.net/research/concealing-payloads-in-url-credentials) — Gareth Heyes

**KEPT** · Meaningful extension · confidence High

### Candidate

PortSwigger published the article on 23 October 2024; it credits the initial
credential-concealment observation from the preceding year but adds the first
complete exploitation analysis located in 2024.

### Core contribution

Although browsers hide credentials in the address bar and `location`,
`document.URL` retains them. Payloads can survive same-origin navigation, feed
DOM-XSS sinks and clobber inherited anchor username/password properties.

### Prior art

URL credentials, DOM XSS and DOM clobbering were known. The retained contribution
is the 2024 analysis of property disagreement, inheritance and exploit chains;
the earlier observation prevents an original-technique verdict.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 79 | 25% | 19.75 | Develops credential retention into several exploit primitives. |
| Transferability | 72 | 20% | 14.40 | Useful in Chrome/Firefox flows but not Safari. |
| Lasting value | 70 | 20% | 14.00 | Property disagreement persists but browsers may converge. |
| Technical soundness | 78 | 15% | 11.70 | Concrete DOM-XSS and clobbering demonstrations support it. |
| Practical usability | 76 | 10% | 7.60 | Payload delivery is simple when a suitable sink exists. |
| Clarity and reproducibility | 87 | 10% | 8.70 | Browser differences and examples are explicit. |

**Final score: 76.2/100.** Archive decision: include as a core technique.

### Verdict

Meaningful extension. The 2023 observation is not relabelled as new; the scored
contribution is the later browser-property analysis and exploitation chains.

## 73.0 — [Introducing SignSaboteur: forge signed web tokens with ease](https://portswigger.net/research/introducing-signsaboteur-forge-signed-web-tokens-with-ease) — Zakhar Fedotkin

**KEPT** · Tooling or methodology contribution · confidence High

### Candidate

PortSwigger published the open-source Burp extension and methodology on 22 May
2024.

### Core contribution

SignSaboteur detects, edits, brute-forces, re-signs and attacks signed tokens
from Django, Flask, Express and other frameworks, including unknown formats,
key derivations and automated authorization-claim mutations.

### Prior art

Signed-cookie/JWT key guessing and claim forgery were well established. The
contribution is unified framework-aware detection and mutation beyond JWT.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 48 | 25% | 12.00 | Primarily automates established signed-token attacks. |
| Transferability | 85 | 20% | 17.00 | Handles multiple frameworks, formats and transports. |
| Lasting value | 70 | 20% | 14.00 | Signed application tokens remain common, though formats evolve. |
| Technical soundness | 80 | 15% | 12.00 | Implemented extension and laboratory examples validate the flow. |
| Practical usability | 93 | 10% | 9.30 | Direct Burp integration makes the methodology operational. |
| Clarity and reproducibility | 87 | 10% | 8.70 | Modes, derivations, claims and source are documented. |

**Final score: 73.0/100.** Archive decision: include as a core technique.

### Verdict

Tooling or methodology contribution. It clears 60 on breadth and usability,
while the low originality score explicitly avoids claiming new token attacks.

## 49.6 — [Account Takeover due to DNS Rebinding](https://blog.voorivex.team/account-takeover-due-to-dns-rebinding) — Yashar Shahinzadeh, Voorivex

**REMOVED** · Useful application or case study · confidence High

### Candidate

Published 17 September 2024. Judged in the 10 August 2026 single-publisher sweep
of `blog.voorivex.team`; not part of the original 2024 nomination round.

### Core contribution

Hashnode lets a user attach a custom domain by CNAME and then treats that domain
as a trusted destination for a cross-domain login handoff: `/authenticate` checks
the `next` URL against the set of verified domains and, on a match, hands over a
GUID that the destination exchanges for a session JWT. The attacker verifies a
domain they own, then repoints its DNS at their own server. The allowlist still
holds the name, so the check still passes, but the bearer now goes somewhere else.
The durable observation is that domain ownership is verified once and trusted
indefinitely — the allowlist stores a name, while the security property depended
on where that name resolved at verification time.

### Prior art

The mechanism is not classic DNS rebinding (which targets a single client's
resolver cache within one session to reach an internal address); it is a stale
verification record, the same shape as subdomain takeover and dangling-DNS work
that runs from 2014 onward, and it is closer to the "verify once, trust forever"
failure than to Roesner-style rebinding. Custom-domain trust in multi-tenant SaaS
had been examined before this post. The author does not claim to have invented the
technique.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 38 | 25% | 9.50 | A known stale-verification failure located in one product; the post's own "DNS rebinding" label overstates the novelty. |
| Transferability | 50 | 20% | 10.00 | The re-verify-before-trusting rule applies to any custom-domain SaaS handoff. |
| Lasting value | 42 | 20% | 8.40 | A good example to cite, not a line of research. |
| Technical soundness | 66 | 15% | 9.90 | The flow and the exploit steps are documented; the timing dependence on cache and database refresh is acknowledged rather than measured. |
| Practical usability | 52 | 10% | 5.20 | Testable wherever custom domains grant trust. |
| Clarity and reproducibility | 66 | 10% | 6.60 | Clear walkthrough of the authentication flow. |

**Final score: 49.6/100.** Archive decision: do not include.

### Reverification

- **Candidate facts rechecked against:** the post's description of the
  `/authenticate` flow and its stated preconditions.
- **Independent prior-art check:** searched by precondition (a verified-once domain
  allowlist that is not re-checked at use) rather than by "DNS rebinding", which
  places it in the dangling-DNS and subdomain-takeover lineage rather than the
  rebinding one.
- **Strongest challenge to the result:** the label is wrong, which would justify a
  lower Original score still.
- **Benefit-of-doubt check:** the underlying finding is real and the token handoff
  design is a genuinely instructive failure, independent of what it is called.
- **Changes after reverification:** None to the score; the verdict records the
  mislabelling explicitly so a later reader is not sent looking for rebinding.

### Verdict

Useful application or case study. Below the 60 gate for the 2024 list.

- **Archive decision:** Do not include
- **Confidence:** High
- **Evidence gaps:** None material.

## 46.3 — [A Weird CSP Bypass led to $3.5k Bounty](https://blog.voorivex.team/a-weird-csp-bypass-led-to-35k-bounty) — Omid Rezaei & Yashar Shahinzadeh, Voorivex

**REMOVED** · Useful application or case study · confidence High

### Candidate

Published 23 October 2024. Judged in the 10 August 2026 single-publisher sweep.

### Core contribution

A chain on a free-hosting platform: stored XSS on a user subdomain, a main-site
API that trusts `*.freehost-target.com` in its CORS policy, and a CSP delivered by
meta tag with user input appended to it. Injecting a semicolon adds a second
`connect-src`; because duplicate directives resolve to the first occurrence, the
attacker arranges which host lands in which position and reaches the endpoint the
policy was meant to protect.

### Prior art

Directly covered by Gareth Heyes's *Bypassing CSP with policy injection*
(PortSwigger, 2019) — already in [`2019.md`](../../2019.md) at 83.8 and in the
archive — which established injecting directives into a policy built from user
input and exploiting the first-occurrence rule. GitHub's `secure_headers` advisory
(GHSA-xq52-rv6w-397c) documents the same semicolon-injection failure in a library.
Neither the CORS-trusts-all-subdomains half nor the stored XSS is new.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 32 | 25% | 8.00 | Policy injection with first-occurrence-wins was published five years earlier and is already listed. |
| Transferability | 45 | 20% | 9.00 | Applies wherever a policy is concatenated from user input, which the prior work already established. |
| Lasting value | 38 | 20% | 7.60 | Reinforces a known lesson. |
| Technical soundness | 68 | 15% | 10.20 | The directive-ordering behaviour is described correctly and the chain holds together. |
| Practical usability | 50 | 10% | 5.00 | Usable, but the general recipe was already available. |
| Clarity and reproducibility | 65 | 10% | 6.50 | Payload and reasoning are shown. |

**Final score: 46.3/100.** Archive decision: do not include.

### Reverification

- **Candidate facts rechecked against:** the post and the archived copy of the 2019
  PortSwigger policy-injection research.
- **Independent prior-art check:** searched by mechanism (semicolon into a
  concatenated policy, duplicate directive resolution) rather than by target, which
  surfaced both the 2019 research and the `secure_headers` advisory.
- **Strongest challenge to the result:** the meta-tag delivery and the specific
  ordering manipulation are a slightly different instance than the header case.
- **Benefit-of-doubt check:** an instance is not a contribution when the general
  rule is published, listed and archived; a different delivery channel does not
  change the primitive.
- **Changes after reverification:** None.

### Verdict

Useful application or case study. Below the 60 gate for the 2024 list; the
technique itself belongs to the 2019 entry.

- **Archive decision:** Do not include
- **Confidence:** High
- **Evidence gaps:** None material.

## 44.2 — [Drilling the redirect_uri in OAuth](https://blog.voorivex.team/drilling-the-redirecturi-in-oauth) — Yashar Shahinzadeh, Voorivex

**REMOVED** · Useful application or case study · confidence High

### Candidate

Published 11 October 2024. Judged in the 10 August 2026 single-publisher sweep.

### Core contribution

A macOS application wraps Apple's OAuth in a custom flow with an extra hop, and
parks a second `redirect_uri` inside the `state` parameter — which is then never
validated on return. Changing that embedded value redirects the user after
authentication; an `@`-in-userinfo trick defeats the weak URL check that guards
it. The observation worth keeping is that `state` is treated as opaque by the
provider, so anything an application stores there is attacker-controlled unless
the application itself validates it.

### Prior art

`redirect_uri` manipulation and `@` host confusion are foundational OAuth
material, and the post cites Nir Goldshlager's Facebook OAuth work from around
2014. Custom flows that stash data in `state` and forget to validate it are a
recurring finding across the bug bounty literature.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 28 | 25% | 7.00 | Known OAuth failure modes found in one custom implementation. |
| Transferability | 45 | 20% | 9.00 | The "state is not a safe place to store a URL" rule generalises. |
| Lasting value | 35 | 20% | 7.00 | Restates established guidance. |
| Technical soundness | 65 | 15% | 9.75 | The flow is described clearly and the bypass is plausible as written. |
| Practical usability | 50 | 10% | 5.00 | A useful thing to check on any non-standard OAuth flow. |
| Clarity and reproducibility | 65 | 10% | 6.50 | Readable, target anonymised. |

**Final score: 44.2/100.** Archive decision: do not include.

### Reverification

- **Candidate facts rechecked against:** the post and its own citation of the prior
  Facebook OAuth work.
- **Independent prior-art check:** searched by the precondition (application data
  stored in `state`, unvalidated on return) rather than by `redirect_uri`, finding
  the pattern repeatedly documented.
- **Strongest challenge to the result:** none needed; the author frames it as
  analysis of behaviour outside the standard rather than as new theory.
- **Benefit-of-doubt check:** the writeup is honest about what it is and the
  `state`-as-storage warning is worth repeating.
- **Changes after reverification:** None.

### Verdict

Useful application or case study. Below the 60 gate for the 2024 list.

- **Archive decision:** Do not include
- **Confidence:** High
- **Evidence gaps:** The target is anonymised, so the specific validator behaviour
  cannot be independently confirmed.

## 74.7 — [Leaking ObjRefs to Exploit HTTP .NET Remoting](https://code-white.com/blog/leaking-objrefs-to-exploit-http-dotnet-remoting/)

**KEPT** · Original technique · confidence High

### Candidate

Markus Wulftange, Code White, 27 February 2024; fixed in the January 2024 .NET
Framework updates and later assigned CVE-2024-29059. Surfaced by the 2026-08-12
pass over the ysonet .NET-deserialization reference set.

### Core contribution

The precondition that made HTTP .NET Remoting attacks impractical was that the
attacker had to already know a valid object URI — well-known service names are
guessable, but the interesting objects get randomly generated URIs. This post
removes it. Only two try/catch statements sit in the HTTP request path, and the
one in the formatter sink does not discard the error: it builds a ReturnMessage
and serializes it, and the ReturnMessage constructor attaches the current
LogicalCallContext, which carries an internal ObjRef. Forcing an exception
therefore makes the server hand back a live object reference, after which the
known .NET Remoting attacks apply — unauthenticated, against an ASP.NET
application that nobody deliberately exposed as a Remoting service, because IIS
maps .rem and .soap by default.

The transferable statement is about error paths rather than about Remoting: a
handler that serializes a rich error object leaks whatever ambient state that
object's constructor collects, and ambient state is chosen by the framework, not
by the developer.

### Prior art

Forshaw's 2012 work and ExploitRemotingService, NCC Group's 2019 "Finding and
Exploiting .NET Remoting over HTTP using Deserialisation" (on the 2019 list) and
Code White's own 2022 ".NET Remoting Revisited" all assume the object URI is
known or well-known; the 2022 post says so explicitly. No earlier source
describes obtaining one from the server. The same team's "Teaching the Old .NET
Remoting New Exploitation Tricks", already nominated on the 2024 list, is a
companion rather than a duplicate: it consumes the leak — referencing the
HttpRemotingObjRefLeak demonstration application — and concentrates on
TypeFilterLevel and channel constraints, not on obtaining the reference.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 72 | 25% | 18.00 | A new leak primitive that removes the standing precondition on a known attack class; the post-leak exploitation is prior work. |
| Transferability | 70 | 20% | 14.00 | Applies to any ASP.NET application carrying the default handler mappings, and the error-path-serializes-ambient-state lesson generalises further. |
| Lasting value | 70 | 20% | 14.00 | Converted a niche attack into an unauthenticated one and forced a framework-level fix. |
| Technical soundness | 86 | 15% | 12.90 | The call stack and the exact serialization path are traced through reference source, with a vendor fix and CVE. |
| Practical usability | 76 | 10% | 7.60 | A demonstration application and tooling are published; the surface is narrower than mainstream ASP.NET. |
| Clarity and reproducibility | 82 | 10% | 8.20 | Sink chains and the leak path are set out step by step. |

**Final score: 74.7/100.** Archive decision: include as a core technique.

### Verdict

Original technique. It supplies the missing information-disclosure primitive
that makes HTTP .NET Remoting exploitable without inside knowledge.

### Reverification

- **Candidate facts rechecked against:** the Code White post, whose byline gives
  27 February 2024 and the author, and which names CVE-2024-29059 and the
  January 2024 fix.
- **Independent prior-art check:** searched for object-URI disclosure in .NET
  Remoting and for LogicalCallContext leaking through serialized fault messages,
  then read the 2019 and 2022 predecessors in the archive for any earlier
  statement. Both state the known-URI requirement rather than solving it.
- **Strongest challenge to the result:** the 2024 list already nominates a .NET
  Remoting post from the same team in the same year, so this risks double-counting
  one body of work.
- **Benefit-of-doubt check:** the two posts solve different halves — obtaining a
  reference versus exploiting one under type-filter constraints — and the
  nominated post cites this one's demonstration application rather than restating
  it.
- **Changes after reverification:** none.

## 63.3 — [View State, the unpatchable IIS forever day being actively exploited](https://zeroed.tech/blog/viewstate-the-unpatchable-iis-forever-day-being-actively-exploited/) — zeroed.tech

**REMOVED** · Tooling or methodology contribution · confidence Medium

### Candidate

Published 21 July 2024. Judged in the 2026-08-12 pass over the ysonet
.NET-deserialization reference set.

### Core contribution

An end-to-end practitioner treatment of ViewState: exploitation against a simple
application and against a fully patched Exchange 2019 host, then the part that is
genuinely under-documented — the forensic artifacts a successful ViewState
exploit leaves behind, how a threat hunter finds them, and why remediation is
hard, because rotating machine keys across a farm is disruptive and incomplete
rotation leaves the door open.

### Prior art

The offensive half restates work already on the lists: ViewState deserialization
with a known or leaked machine key (2019), Exchange post-auth ViewState CVEs, and
the standard ysoserial.net workflow. The detection and remediation half has no
obvious single predecessor, but it is defensive.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 38 | 25% | 9.50 | The exploitation material is a synthesis of published technique; the artifact and remediation analysis is the only unattested part. |
| Transferability | 58 | 20% | 11.60 | The hunting artifacts apply to any ASP.NET estate, but they are detection inputs rather than an attack primitive. |
| Lasting value | 66 | 20% | 13.20 | ViewState compromise remains unpatchable by design, so the remediation guidance keeps its relevance. |
| Technical soundness | 80 | 15% | 12.00 | Exploitation and artifacts are demonstrated against real targets. |
| Practical usability | 84 | 10% | 8.40 | Immediately usable by both testers and responders. |
| Clarity and reproducibility | 86 | 10% | 8.60 | Long, precise and complete about setup and preconditions. |

**Final score: 63.3/100.** Archive decision: do not include.

### Verdict

Tooling or methodology contribution, but defensive and incident-response
oriented rather than an offensive web hacking technique, and its offensive half
restates work already represented on the 2019 and later lists. It clears the
numeric gate on practical and presentational strength; the missed-technique
section is not the right home for it.

### Reverification

- **Candidate facts rechecked against:** the archived post, which states the
  21 July 2024 publication date in its body.
- **Independent prior-art check:** searched for earlier ViewState exploitation
  artifact and threat-hunting guidance, and compared the offensive sections
  against the 2019 ViewState entry already in the archive.
- **Strongest challenge to the result:** the DFIR artifact analysis really does
  appear to be first-of-kind, which would argue for inclusion.
- **Benefit-of-doubt check:** that is why the score sits above 60 rather than in
  the fifties; the exclusion rests on the verdict and scope, not on the number.
- **Changes after reverification:** none.

## 82.5 — [CVE-2024-4577 - Yet Another PHP RCE: Make PHP-CGI Argument Injection Great Again!](https://blog.orange.tw/posts/2024-06-cve-2024-4577-yet-another-php-rce/) — Orange Tsai, DEVCORE

**KEPT** · Original technique · confidence High

### Candidate

Orange Tsai, DEVCORE, 7 June 2024; reported to PHP on 7 May 2024 and fixed in
PHP 8.1.29, 8.2.20 and 8.3.8. Found by the 2026-08-12 publisher sweep of
DEVCORE, watchTowr, Assetnote, PortSwigger, Doyensec, Cure53 and Project Zero.

### Core contribution

Windows Best-Fit codepage conversion turned into a security primitive. When a
Windows process converts Unicode to the active ANSI codepage, characters with no
exact mapping are silently replaced by a visually similar ASCII one - a soft
hyphen becomes a plain hyphen. PHP-CGI validated the query string for the literal
characters that CVE-2012-1823 abused, then handed it to Windows, which
manufactured those characters afterwards. The 2012 patch is therefore bypassed
without touching it, and unauthenticated RCE returns on a default XAMPP install.

Stated target-neutrally, the contribution is that a character-set conversion
performed *after* a security check can reintroduce exactly the syntax the check
removed. Any validate-then-convert order on Windows inherits it, which is why the
author generalised the same primitive across many unrelated applications a year
later.

### Prior art

CVE-2012-1823 is the original PHP-CGI argument injection and is the thing being
un-patched here; its fix had stood twelve years. Best-Fit mapping itself is
documented Microsoft behaviour, and encoding-conversion confusion has a long
security history - Unicode normalisation and charset differentials appear on
several earlier lists. What is not attested before this post is Best-Fit
conversion being used deliberately to regenerate forbidden characters past a
validator. The relationship to the 2025 list runs forward, not backward:
"WorstFit: Unveiling Hidden Transformers in Windows ANSI", already nominated for
2025, is the same author generalising this finding, and cites it as the origin.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 82 | 25% | 20.50 | First public weaponisation of Best-Fit conversion as a validator bypass, defeating a patch that had held for twelve years. |
| Transferability | 84 | 20% | 16.80 | Not PHP-specific: any Windows validate-then-convert path inherits it, as the author's own 2025 generalisation demonstrated across unrelated software. |
| Lasting value | 82 | 20% | 16.40 | Opened the encoding-conversion class that the 2025 nomination expands; added to CISA's KEV catalogue after mass in-the-wild exploitation. |
| Technical soundness | 88 | 15% | 13.20 | Vendor-confirmed, fixed across three PHP branches, and independently reproduced by several parties within days. |
| Practical usability | 80 | 10% | 8.00 | Works against default XAMPP for Windows with a single request; public proofs of concept followed immediately. |
| Clarity and reproducibility | 76 | 10% | 7.60 | The post is deliberately brief and defers some detail to the DEVCORE advisory; the full treatment of the primitive arrived with the 2025 follow-up. |

**Final score: 82.5/100.** Archive decision: include as a core technique.

### Verdict

Original technique. It introduces the Windows Best-Fit conversion primitive to
web security and shows it can restore an attack a long-standing patch removed.

### Reverification

- **Candidate facts rechecked against:** the author's post, which gives the
  7 June 2024 date, and the PHP advisory GHSA-3qgc-jrrr-25jv plus the DEVCORE
  security alert for the affected versions and report date.
- **Independent prior-art check:** searched by mechanism - Best-Fit and ANSI
  codepage conversion as a security bypass, and argument injection reachable
  after validation - rather than by CVE, and checked the 2012 to 2023 lists for
  an earlier statement. Encoding differentials appear earlier; Best-Fit as a
  deliberate bypass does not.
- **Strongest challenge to the result:** the outcome is a re-run of a 2012
  vulnerability class, so it can be read as a patch bypass rather than a
  technique.
- **Benefit-of-doubt check:** the mechanism that achieves the bypass is new and
  independent of PHP, which is what the 2025 follow-up proves by applying it
  elsewhere.
- **Changes after reverification:** none.

## 76.0 — [We Spent $20 To Achieve RCE And Accidentally Became The Admins Of .MOBI](https://labs.watchtowr.com/we-spent-20-to-achieve-rce-and-accidentally-became-the-admins-of-mobi/) — Benjamin Harris and Aliz Hammond, watchTowr

**KEPT** · Original technique · confidence High

### Candidate

Benjamin Harris and Aliz Hammond, watchTowr Labs, 11 September 2024. Found by
the 2026-08-12 publisher sweep.

### Core contribution

A decommissioned authoritative service is still an authority for as long as its
clients hardcode it. The .MOBI TLD moved its WHOIS server years earlier, but the
old hostname's domain was allowed to expire while WHOIS clients, libraries and
automated systems continued to query it. For twenty dollars the researchers
became that authority, answered every query with data of their choosing, and
measured who trusted them.

The consequence is the part that matters: certificate authorities performing
domain email validation read the administrative contact from WHOIS, so a rogue
WHOIS server can nominate itself as the approver for names in the whole TLD. The
researchers showed GlobalSign parsing their address as the contact for a
third-party .mobi name and stopped there deliberately, without requesting a
certificate. The reusable statement is that WHOIS is an unauthenticated trust
dependency of Web PKI issuance, and that abandoned authoritative infrastructure
is a takeover target distinct from an ordinary dangling record.

### Prior art

Dangling DNS and subdomain takeover are long established, and this team's own
"The Perils of Expired Domains" (August 2022) applies the same idea to MX
records - it is scored separately in the 2022 folder and falls below the gate as
an application of that known class. Neither reaches the contribution here: an
entire TLD's authoritative WHOIS service, hardcoded by clients that no registry
change can update, feeding certificate issuance. The post cites CVE-2015-5243
(phpWHOIS `eval`) and CVE-2021-32749 (Fail2Ban) as evidence that WHOIS responses
were already known to be dangerous input, which is a narrower claim than WHOIS
being a trust root.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 74 | 25% | 18.50 | Abandoned authoritative infrastructure as a takeover class, carried through to Web PKI issuance; the dangling-record family it extends is older. |
| Transferability | 76 | 20% | 15.20 | Applies to any decommissioned authority still hardcoded by clients - WHOIS, update, time and telemetry endpoints - not to one product. |
| Lasting value | 78 | 20% | 15.60 | Reframes WHOIS as a dependency of certificate issuance and sharpened scrutiny of CA email validation. |
| Technical soundness | 82 | 15% | 12.30 | Demonstrated live with measured query volume and a named CA parsing their address; issuance itself was deliberately not attempted, so that step rests on the authors' account. |
| Practical usability | 60 | 10% | 6.00 | The method is reusable but opportunistic - it needs an abandoned authority to find, and this particular one is now held. |
| Clarity and reproducibility | 84 | 10% | 8.40 | Detailed, with query data and the exact validation path described. |

**Final score: 76.0/100.** Archive decision: include as a core technique.

### Verdict

Original technique. It establishes abandoned authoritative infrastructure as an
attack class with a demonstrated path into Web PKI, beyond the dangling-record
work it builds on.

### Reverification

- **Candidate facts rechecked against:** the post, which carries the 11 September
  2024 date, both authors, the registration cost and the CA behaviour observed.
- **Independent prior-art check:** searched for WHOIS server takeover and for
  certificate-authority validation via WHOIS contacts, then read this team's own
  2022 expired-domains post to test whether it already stated the claim. It does
  not; it is per-organisation MX hijacking.
- **Strongest challenge to the result:** buying an expired domain is not a new
  idea, and no certificate was actually issued, so the Web PKI impact is
  demonstrated only up to the parsing step.
- **Benefit-of-doubt check:** stopping short of issuance is the responsible
  choice and does not weaken the mechanism; the evidence shown is enough to
  establish the dependency. Technical soundness is scored at 82 rather than
  higher for exactly this gap.
- **Changes after reverification:** original contribution was reduced from a
  draft 78 to 74 once the team's own 2022 expired-domains work was read as
  same-family prior art; the final score fell from 77.0 to 76.0.

## 68.9 — [Limitations are just an illusion – advanced server-side template exploitation with RCE everywhere](https://www.yeswehack.com/learn-bug-bounty/server-side-template-injection-exploitation) [Payloads](https://brum3ns.github.io/payloads/) [Talk](https://www.youtube.com/watch?v=QoP4Ip_zM74) — Alex Brumen, YesWeHack

**KEPT** · Meaningful extension · confidence Medium

### Candidate

Alex Brumen. The submitted YesWeHack article was published on 24 March 2025,
but it documents research disclosed earlier: the detailed payload page entered
the author's public site repository on 22 July 2024, an introductory post
followed on 28 August, and the exact talk was delivered at Ekoparty on
13 November. The 2024 payload publication is the controlling cutoff. Submitted
through [webhacklist issue #8](https://github.com/irsdl/webhacklist/issues/8) on
2 September 2026.

### Core contribution

The work makes server-side template injection payloads self-contained under a
common restrictive condition: quotes are unavailable and the payload cannot
borrow strings from request parameters or optional plugins. It constructs the
characters and command strings from objects already reachable inside each
template runtime, then connects those strings to established code-execution
primitives. Concrete payloads cover Jinja2, Mako, Twig, Smarty, Blade, Groovy
templates and FreeMarker; the later article also carries the method into Razor.

The reusable idea is not another SSTI sink. It is an engine-by-engine method for
bootstrapping arbitrary strings entirely inside a constrained template context,
so a quote filter or an injection point with no controllable auxiliary request
data does not end exploitation.

### Prior art

James Kettle's 2015 SSTI research already established detection, engine
identification, sandbox escape and RCE across several template engines, and is
represented twice in the historical list. Sebastian Neef's 2017 Jinja2 filter
bypasses already addressed blocked quotes and attribute syntax, but the decisive
strings came from attacker-controlled request arguments. The January 2024
PayloadsAllTheThings revision also catalogued cross-engine SSTI RCE and multiple
Jinja2 blacklist bypasses, including context-free RCE when quoted command text
was accepted.

Those sources make SSTI RCE, character-filter bypass and multi-engine payload
catalogues prior art. The distinct increment here is combining them into
fully internal, quote-free constructions across a broad set of engines. Many of
the individual steps are ordinary host-language string building around known
sinks, so this is an extension rather than a new vulnerability class.

### Scorecard

| Category | Score | Weight | Weighted | Reason |
|---|---:|---:|---:|---|
| Original contribution | 62 | 25% | 15.50 | Removes the external-string precondition across several engines, but composes known SSTI sinks with familiar string-building primitives. |
| Transferability | 74 | 20% | 14.80 | The constraint and workflow transfer across seven engines in the 2024 material and an eighth in the later article. |
| Lasting value | 67 | 20% | 13.40 | A useful payload-design pattern for constrained SSTI, though exact object paths and character offsets are version-sensitive. |
| Technical soundness | 72 | 15% | 10.80 | Complete engine-specific payloads support the claim; there is no version matrix, test harness or systematic negative testing. |
| Practical usability | 72 | 10% | 7.20 | Payloads are directly usable and remove a real exploitation dependency, with some offsets explicitly left for the tester to adjust. |
| Clarity and reproducibility | 72 | 10% | The article explains each construction and publishes the payloads, but does not pin runtime versions or provide a reproducible lab. |

**Final score: 68.9/100.** Archive decision: include as a supporting reference.

### Reverification

- **Candidate facts rechecked against:** the submitted article, the author's
  payload page and its 22 July 2024 Git history, the Ekoparty schedule, and the
  official recording published on 10 December 2024.
- **Independent prior-art check:** compared the work with the archived 2015 SSTI
  entries, read the 2017 Jinja2 filter-bypass writeup, and inspected the last
  pre-cutoff PayloadsAllTheThings revision rather than its later text. Exact
  searches for the engine-specific constructions found no earlier source; a
  matching FreeMarker construction published on 22 November 2024 is later than
  the payload-page cutoff.
- **Strongest challenge to the result:** quote-free character construction is a
  payload constraint, and most execution sinks are already known, so the whole
  submission can be read as a collection of payload variations rather than a
  technique.
- **Benefit-of-doubt check:** the earlier quote-bypass source depends on external
  request data, whereas these payloads deliberately remove that precondition in
  multiple unrelated engines. That capability change is substantial enough for
  a meaningful extension, but not enough for an original-technique verdict.
- **Changes after reverification:** none; the known-sink and historical-catalogue
  overlap was already reflected in the originality score and Medium confidence.

### Verdict

Meaningful extension. The work turns self-contained, quote-free string
bootstrapping into a repeatable SSTI exploitation pattern across template
engines. It clears the historical 60-point, non-duplicate gate and belongs in
the 2024 missed-technique section.
