---
type: Article
title: "JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks"
description: Synthesize gateway, application and system configuration defenses using consequence oracles, benign workflows and counterfactual replays that mask an upstream deny rule to test downstream coverage.
resource: "https://arxiv.org/abs/2610.35532v1"
tags: [article, webseclist-reference, en, arxiv, deserialization, mitigation, tooling, ai-agent, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-29T12:00:02+00:00"
verified:
  - by: AI archive validation
    at: 2026-10-29
status: stable
stale_after: 2027-10-29
sources:
  - id: original
    resource: "https://arxiv.org/abs/2610.35532v1"
    title: "JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks"
    author: Ruozhao Yang, Minglang Li, Jiongchi Yu, Xinfeng Li, Xiaofei Xie
    last_modified: 2026-10-26
also_at:
  - "https://arxiv.org/pdf/2610.35532v1"
authors:
  - Ruozhao Yang
  - Minglang Li
  - Jiongchi Yu
  - Xinfeng Li
  - Xiaofei Xie
canonical_url: ""
cited_by:
  - "2026-ai.md:423"
commit: ""
content_sha256: 5ac7f3c418152d93c900f7b9b9f0351e037b8d2ab30e188800b590e816cb64d1
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2610.35532v1"
published: 2026-10-26
publisher: arXiv
publisher_english: ""
raw_sha256: b290e9de6a0cde4819d4cedb5c6d75e74b7195657aec04c37a755322013e797f
retrieved_from: "https://arxiv.org/pdf/2610.35532v1"
retrieved_kind: stored
retrieved_utc: "2026-10-29T12:00:02+00:00"
slug: arxiv-janus-synthesizing-cross-layer-defenses-against-web-attacks
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks

**JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks** - Ruozhao Yang, Minglang Li, Jiongchi Yu, Xinfeng Li, Xiaofei Xie, arXiv.

- Published: 2026-10-26
- Original: <https://arxiv.org/abs/2610.35532v1>
- Also published at: <https://arxiv.org/pdf/2610.35532v1>
- Preserved from: https://arxiv.org/pdf/2610.35532v1 (stored) on 2026-10-29
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

JANUS: Synthesizing Cross-Layer Defenses Against Web
                                                                    Deserialization Attacks
                                                             Ruozhao Yang                                                      Minglang Li                                     Jiongchi Yu
                                                 rz.yang.2024@phdcs.smu.edu.sg                                   2024060909004@std.uestc.edu.cn                        jiongchiyu@acm.org
                                                Singapore Management University                                             UESTC                                 Nanyang Technological University
                                                            Singapore                                                        China                                          Singapore

                                                                                                Xinfeng Li                                            Xiaofei Xie
                                                                                     xinfeng.li@polyu.edu.hk                                    xfxie@smu.edu.sg
                                                                                    The Hong Kong Polytechnic                            Singapore Management University
arXiv:2610.35532v1 [cs.CR] 26 Oct 2026




                                                                                            University                                              Singapore
                                                                                               China
                                         Abstract                                                                                        Keywords
                                         Unsafe deserialization turns untrusted data into attacker-controlled                            Deserialization Vulnerabilities, Web Application Defense, Adver-
                                         execution, and a single vulnerability can admit diverse exploit vari-                           sarial Self-Evolution, Runtime Enforcement
                                         ants that evade defenses tailored to a known exploit. Existing de-
                                         fenses typically operate at a single enforcement point with limited                             ACM Reference Format:
                                         visibility into the full attack. Combining controls across layers of-                           Ruozhao Yang, Minglang Li, Jiongchi Yu, Xinfeng Li, and Xiaofei Xie. 2027.
                                         fers complementary protection, but coordinating them to preserve                                JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization
                                                                                                                                         Attacks. In Proceedings of Proceedings of the ACM Web Conference 2027
                                         legitimate functionality and adapting them to new variants requires
                                                                                                                                         (WWW ’27). ACM, New York, NY, USA, 13 pages. https://doi.org/XXXXXXX.
                                         substantial expert effort.                                                                      XXXXXXX
                                            We propose Janus, a red-blue adversarial framework for auto-
                                         mated cross-layer defense synthesis. Starting from a known exploit,
                                         Janus iteratively refines deployment-specific policies in an isolated                           1    Introduction
                                         offline environment. A black-box attacker probes the current policy
                                         for exploit variants using only externally observable feedback. The                             Unsafe deserialization poses a persistent and critical threat to Web
                                         defender summarizes each verified variant into its security-relevant                            security [33, 40]. When applications reconstruct objects from un-
                                         effects, uses counterfactual replay to separate complementary cov-                              trusted data, attacker-controlled types and field values can trigger
                                         erage from redundant enforcement, and jointly selects and scopes                                chains of existing methods that lead to remote code execution
                                         controls across layers. Each candidate policy is validated against                              (RCE) [37, 40]. Existing defenses constrain specific steps of this
                                         accumulated exploits and benign workflows.                                                      process, for example by restricting the classes permitted during
                                            We evaluate Janus on sixteen vulnerability deployments across                                deserialization [14, 46]. However, a single vulnerability may ad-
                                         six Java and PHP applications against gateway, application, system,                             mit multiple gadget chains drawn from application dependencies,
                                         and cross-layer defenses. Janus reduces held-out attack success to                              so filters targeting known gadgets can be bypassed by alternative
                                         6.2%, compared with 18.8-55.0% for the baselines, fully mitigates                               chains [5, 9, 36, 40]. Mitigation is also deployment-specific: the de-
                                         13 of 16 deployments, and preserves 98.4% of benign functionality                               ployed libraries and runtime determine which chains are viable [24],
                                         tests at a 6.9% targeted P95 latency increase.                                                  whereas legitimate features determine which deserialization behav-
                                                                                                                                         iors must remain available [21].
                                                                                                                                            Motivation. As shown in Figure 1, defenders can intervene at
                                         CCS Concepts                                                                                    three layers with distinct visibility and established enforcement
                                         • Security and privacy → Web application security; Software                                     mechanisms. At the gateway, a Web application firewall (WAF)
                                         security engineering.                                                                           inspects and filters incoming request representations [35].
                                                                                                                                         Application-level deserialization filters constrain the types and
                                                                                                                                         object structures accepted during reconstruction [14, 32, 46].
                                                                                                                                         System-level policies restrict the resulting operations through
                                                                                                                                         system-call filtering or container isolation [4, 25, 37]. Each layer
                                         Permission to make digital or hard copies of all or part of this work for personal or
                                         classroom use is granted without fee provided that copies are not made or distributed           nevertheless observes only part of the attack: narrow restrictions
                                         for profit or commercial advantage and that copies bear this notice and the full citation       may miss exploit variants, while broader restrictions risk disrupting
                                         on the first page. Copyrights for components of this work owned by others than the              legitimate features [15, 40].
                                         author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or
                                         republish, to post on servers or to redistribute to lists, requires prior specific permission      Combining these layers offers complementary protection [39],
                                         and/or a fee. Request permissions from permissions@acm.org.                                     but requires coordinating their policies. We define a multi-layer
                                         WWW ’27, Dublin, Ireland                                                                        composition as a joint selection of controls with deployment-specific
                                         © 2027 Copyright held by the owner/author(s). Publication rights licensed to ACM.
                                         ACM ISBN 978-1-4503-XXXX-X/2027/XX                                                              parameters and enforcement scopes. Constructing an effective com-
                                         https://doi.org/XXXXXXX.XXXXXXX                                                                 position is challenging because upstream blocking can obscure
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                   Yang et al.


                         Attacker                   User                 coverage from redundant enforcement. ❸ Coordinating Controls
                                                                         Under Functional Constraints. Controls that are individually
              Gateway                              Bytes                 acceptable may break legitimate workflows when combined, and
                                  WAF Rule
            parses request                         Objects               some improvements require coordinated changes across layers.
                                                                         Janus jointly selects and scopes controls from a bounded catalog of
              Application                         Objects                deployable mechanisms and accepts a candidate only if it blocks all
                                  Type Guard
            rebuilds objects                      Library Code           verified exploits and meets the functionality and latency thresholds
                                                                         on the benign-workflow regression suite.
               System                              Syscalls                  Evaluation. We compare Janus on 16 deployments across six
                                 Syscall Filter
             runs syscalls                         Intent                applications against ModSecurity with OWASP CRS [35], Datadog
                                                                         RASP and OpenRASP [3, 13], Kintsugi [37], and Tetragon [10].
                   RCE on the Host                Served                 Janus lowers held-out attack success to 6.2%, versus 18.8-55.0% for
                                                                         the baselines, fully mitigates 13 of 16 deployments, and is breached
Figure 1: Motivating example. Each layer’s defense stops                 on 5 of 48 unseen-attacker/deployment pairs, while passing 98.4%
some exploit variants, but one variant passes all three layers           of functionality tests. A recorded run on CVE-2026-84645, a recent
and reaches RCE, while the legitimate request is served.                 Jenkins RCE, illustrates the refinement loop.
                                                                             Contributions. This paper makes three contributions:
                                                                         • We formulate unsafe-deserialization mitigation as deployment-
downstream coverage, overlapping controls may introduce redun-              specific cross-layer defense synthesis that coordinates comple-
dant overhead, and policy interactions can disrupt legitimate work-         mentary controls under functional constraints.
flows in ways that isolated checks do not reveal. Moreover, a com-       • We propose Janus, a red-blue adversarial framework in which
position that blocks known exploits may still admit variants using          a black-box attacker supplies verified exploit variants and a de-
different gadget chains or payload representations. Existing auto-          fender combines attack-effect summaries with counterfactual
mated mitigations support the generation of security workarounds,           coverage attribution to jointly select and scope cross-layer con-
deserialization restrictions, or runtime policies [21, 37, 46], but         trols under functional constraints.
these capabilities alone do not establish how controls should be         • We define an evaluation protocol with held-out paths, unseen at-
jointly configured and revised to cover adaptive exploit variants           tackers, multi-consequence oracles, and benign-workflow checks.
while preserving legitimate functionality.                                 We evaluate Janus under this protocol and will release its imple-
    Our Approach. We present Janus, a red-blue adversarial frame-           mentation and evaluation materials upon publication1 .
work for synthesizing deployment-specific multi-layer defenses
against unsafe deserialization. The framework pairs an attacker
agent with a defender agent on an isolated replica of the deployment.
                                                                         2 Background and Problem Statement
Starting from a known exploit, the attacker adapts its gadget-chain      2.1 Deserialization Attacks and Defenses
selection and payload representation to achieve a specified conse-       Unsafe deserialization allows attacker-controlled data to trigger
quence, such as command execution within the application con-            unintended method invocations during object reconstruction. A
tainer. The defender uses execution evidence and benign-workflow         sequence of existing methods leading to a sensitive operation con-
feedback to jointly revise controls across layers. Through this of-      stitutes a gadget chain [12, 40]. A vulnerable entry point may admit
fline interaction, the agents expose and address weaknesses beyond       multiple chains [5, 9, 36], whose viability depends on the deployed
those revealed by the initial exploit. The attacker observes only        libraries and runtime [6, 24]. Exploit variants can differ in where
what an external attacker could observe and serves as a source of        serialized data enters, how it is encoded and framed, or which
counterexamples. The technical contributions of Janus lie on the         execution path leads to the consequence.
defense side, in how the defender interprets these counterexamples          Each of the three defensive layers has a characteristic blind spot.
and coordinates controls to cover them.                                  Gateway controls (G) such as reverse proxies and WAFs [35] in-
    Realizing this process raises three technical challenges. ❶ Expos-   spect request representations rather than reconstructed objects,
ing Variants Under Black-Box Observation. A defense is only as           so representation changes can bypass them [15, 45]. Application
robust as the variants it is checked against, yet an external attacker   controls (A) restrict accepted classes or object-graph properties
cannot distinguish a gateway rejection from an incompatible gad-         where the parser exposes them [31, 32], yet may still permit mali-
get chain. Janus’s attacker parameterizes reviewed fixtures whose        cious uses of allowed classes. System controls (S) restrict process
prerequisites match the deployment, treats ambiguous feedback as         creation, file access, or network communication [4, 17], limiting
hypotheses, and submits candidates to an independent oracle that         consequences without preventing deserialization, often for a whole
it cannot observe. ❷ Interpreting Exploit Effects and Defensive          process or container. These controls also differ in availability across
Coverage. Raw system-call traces are too low-level for policy rea-       deployments, so an effective composition must account for both
soning, and upstream blocking hides the protection of downstream         the controls a deployment supports and the legitimate behavior
controls. Janus condenses execution evidence into attack-effect          within their scopes.
summaries expressed as security-relevant capabilities, each tied
to the control that can intercept it, if any, and uses counterfactual
replay with upstream rules disabled to separate complementary            1 Anonymous repository: https://anonymous.4open.science/r/VELA-70DF/
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                      WWW ’27, May 10-14, 2027, Dublin, Ireland


2.2     Threat Model                                                           archive A0 = {𝑥 0 }, the defender turns attack evidence and benign-
We consider a Web deployment 𝐷 with a known, unpatched deseri-                 workflow feedback into a configuration 𝜋 ∈ Π𝐷 , which is accepted
alization vulnerability and a validated seed exploit that achieves a           only if it blocks every archived attack and meets both thresholds.
specified security consequence. The defender operates on isolated,             The attacker then probes the accepted configuration with externally
resettable replicas with representative benign workflows.                      observable feedback, and each verified bypass enlarges the archive
    Attacker. The attacker controls HTTP requests and holds the                and triggers another revision. The last accepted configuration is
privileges required to reach the vulnerable entry point. It may adapt          frozen and deployed without language-model decisions.
payload representations and gadget chains using responses, tim-
ing, and attacker-controlled out-of-band observations within fixed             3.1    Black-Box Attack Exploration
query and time budgets, but cannot alter deployment configura-                 The attacker supplies counterexamples and observes only what an
tions, defensive policies, or validation infrastructure. The offline           external attacker could. This is hard because exploits depend on
attacker agent operates under the same restrictions and receives               deployment-specific classes and runtime behavior [6, 24], and a
no internal execution-stage feedback.                                          rejected request, an incompatible gadget, and a denied downstream
    Defender. The defender analyzes application logs, network traf-            operation can look identical from outside.
fic, and system logs to configure supported controls across the three             Fixture Catalog. The attacker draws from a bounded catalog
layers. It may change only configuration, not application source               of reviewed fixtures, each specifying its prerequisites, entry point,
code or business logic.                                                        payload construction, and permitted variations of entry point, rep-
    Trust Assumptions. The host kernel, enforcement backends,                  resentation, or execution path. A fixture is eligible unless known
and validation oracles are trusted. An independent oracle verifies             target information contradicts its prerequisites. Held-out fixtures
exploit success through controlled state or effects rather than re-            are disjoint from the catalog by path key (Appendix D) and stay
sponses or logs alone.                                                         hidden during refinement, and a permitted variation that reaches a
    Security Objective. A defense must prevent the specified con-              held-out path counts as rediscovery.
sequence, and intervention after it occurs does not count. We dis-                Observation-Guided Exploration. In each round the configu-
tinguish blocking before or during deserialization from impact                 ration 𝜋 is fixed, and the attacker returns candidates 𝑋 generated
limitation that denies a subsequent operation. We assess protection            from eligible fixtures. It sees only the response, timing, and attacker-
only for the specified consequences, attackers, and budgets.                   controlled out-of-band signals of its own requests, never logs or pol-
                                                                               icy text, and treats them as hypotheses rather than execution-stage
                                                                               labels [38]. Apparent filtering suggests a representation change,
2.3     Cross-Layer Defense Synthesis                                          an exposed compatibility error suggests another fixture, and an
Given a deployment 𝐷 and a validated seed exploit, our goal is a               ambiguous failure leaves both open.
multi-layer defense against the original attack and its variants that             Counterexample Verification. An independent oracle
exploit the same vulnerability through alternative representations             𝜔 (𝑥, 𝜋) ∈ {1, 0, ⊥} reports whether attack 𝑥 reaches its specified
or execution paths. Let Π𝐷 denote the configurations supported by              consequence under 𝜋, fails to reach it, or cannot be decided. A
the deployment’s controls and scopes, and B the benign workflows               candidate becomes a counterexample only if it succeeds both
that pass without the defense. Refinement alternates between de-               without and with the defense:
fense configuration and bypass exploration, and verified attacks
accumulate in an archive A𝑡 initialized with the seed. At iteration                     𝑉 (𝑋, 𝜋) = {𝑥 ∈ 𝑋 : 𝜔 (𝑥, ∅) = 1 ∧ 𝜔 (𝑥, 𝜋) = 1}.               (2)
𝑡, the defender seeks a configuration                                          Failure on the undefended replica is thus never credited to the
 𝜋 ∈ Π𝐷 s.t. ASR(𝜋, A𝑡 ) = 0, BPR(𝜋, B) ≥ 𝜏𝑏 , Δ𝐿95 (𝜋) ≤ 𝜖𝑙 , (1)             defense, ⊥ never counts as prevention, and 𝜔 is never returned to
where ASR is the fraction of attacks achieving their specified con-            the attacker.
sequences, BPR the fraction of workflows passing all functional
assertions, and Δ𝐿95 the P95 latency increase of the targeted end-             3.2    Evidence-Guided Defense Refinement
point under benign traffic, with thresholds 𝜏𝑏 and 𝜖𝑙 fixed before             The defender maps execution evidence onto deployable controls
refinement begins.                                                             and reconciles protection with legitimate use.
   Because every archived attack is a verified exploit, the archive               Attack-Effect Summary. For each archived attack, Janus
must be covered completely rather than traded off against func-                links the request to application and system events through
tionality, so Eq. (1) is a feasibility problem. New bypasses expand            request identifiers and process lineage. The summary records the
the archive and trigger further revision, and failure to meet the              oracle-confirmed consequence, the exercised capabilities with their
conditions within budget is recorded as unsuccessful. The final con-           decisive parameters (Table 5), and the enforcement events under
figuration is frozen before independent evaluation against attacks             the current configuration, while unlinked or missing observations
excluded from refinement.                                                      remain unknown. It ties behavior to intervention points without
                                                                               requiring the defender to reconstruct the gadget chain.
                                                                                  Rules. A rule 𝑟 = (𝑐, 𝜎, 𝜃 ) instantiates a catalog control 𝑐 (Table 1)
3     Design of Janus                                                          with scope 𝜎 and parameters 𝜃 , and carries its supporting evidence
Janus searches for a configuration satisfying Eq. (1) by alternating           and expected effect. A configuration 𝜋 is a set of rules, and Π𝐷
two roles on isolated replicas of 𝐷 (Figure 2). Starting from the              admits only controls and scopes that 𝐷 supports.
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                                     Yang et al.


   Inputs                                                 JANUS Offline Refinement                                                           Deployment
                              Attacker                            Execution Tools                                       Defender         Unseen Variants

  Deployment                 Selection           Candidates                                      Bypass                 Analysis                                  User
                                                                                                                                         Entry Bytes Path
   Manifest                                                      Consequence Oracle
                        Prerequisite Check                                                                     Effect Summary
                                                  Escalation       Frozen Policy                                                                  G    Gateway
                                                                                                                                                  Virtual Patch
                                                                                   A    S   Paired Edit
     Seed                   Adaptation          Entry Variants                                                         Attribution
                                                                                                                                              A       Application
    Exploit         Re-Encode or New Fixture
                                                                                        A   Allowlist       Counterfactual Replay              Class Allowlist
                                                Path Variants
                                                                                       G    Signature
                                                Seed Exploit                                                                                      S    System
                            Observation                                                                                 Revision             Exec / Write Limits
   Benign                                                         Regression Check
  Workflows            Responses & Timing         Accepted                                     Candidate       G   A    S   Joint Edit
                                                                                                                                                       Web App



Figure 2: Overview of Janus, which alternates black-box attack exploration and evidence-guided defense refinement under
regression checks.


    Counterfactual Coverage Attribution. Once an upstream                              Algorithm 1 Workflow of Janus
rule rejects 𝑥, downstream protection is unobserved but may exist.                     Require: Deployment 𝐷, seed 𝑥 0 , workflows Btr , budget 𝑄, threshold 𝑘
Janus replays 𝑥 from the same snapshot, masks the rule that blocked                    Ensure: Frozen configuration 𝜋 ★ or RefinementFailure
it, and repeats until 𝑥 reaches its consequence or no further rule                      1: 𝜋 ← ∅, A ← {𝑥 0 }, 𝐸 ← Evidence(𝑥 0 )
blocks it (Appendix D). The result is a coverage matrix                                 2: 𝑢 ← true, 𝑛 ← 0
                                                                                        3: while BudgetRemains(𝑄 ) and 𝑛 < 𝑘 do
        Cov [𝑟 ] [𝑥] ∈ {obs, lat, none, unk},    𝑟 ∈ 𝜋, 𝑥 ∈ A,         (3)              4:    if 𝑢 then
where obs marks the first rule that blocks 𝑥, lat a rule that blocks                    5:          (𝑆, 𝐶 ) ← Analyze(𝜋, A, Btr )      ⊲ summaries and coverage
                                                                                        6:         𝜋 ′ ← JointRevise(𝜋, 𝑆, 𝐶, 𝐸, Btr )
it only once upstream rules are masked, none a rule still enabled
                                                                                        7:          (𝑎, 𝐹 ) ← Check(𝜋 ′ , A, Btr )
when the consequence occurs, and unk an inconclusive replay. Let                        8:         𝐸 ←𝐸∪𝐹
𝐶 (𝑥) be the rules with obs or lat for 𝑥. On rows without unk, 𝑥 has                    9:         if not 𝑎 then continue
a single point of failure when |𝐶 (𝑥)| = 1, and a rule is a redundancy                 10:         𝜋 ← 𝜋 ′ , 𝑢 ← false
candidate when every attack it covers has |𝐶 (𝑥)| ≥ 2. Because this                    11:    if not BudgetRemains(𝑄 ) then break
test is pairwise, a removal is confirmed only by the acceptance check                  12:     (𝑋 , 𝑒 ) ← AttackRound(𝐷 [𝜋 ] )             ⊲ 𝑒: catalog exhausted
on the complete configuration. Replaying the training workflows                        13:    𝑌 ← 𝑉 (𝑋 , 𝜋 ), 𝑛 ← 𝑛 + 1
in the same way records which workflows each rule breaks.                              14:    if 𝑌 ≠ ∅ then
    Joint Revision. From the summaries, the coverage matrix, and                       15:          A ← A ∪ 𝑌 , 𝐸 ← 𝐸 ∪ Evidence(𝑌 )
failed workflow assertions, the defender proposes a revision that                      16:         𝑢 ← true, 𝑛 ← 0
may add, remove, narrow, or retune rules at several layers at once.                    17:    else if 𝑒 then
                                                                                       18:         break
Single points of failure are preserved, redundancy candidates may
                                                                                       19: return Finalize(𝜋, A, Btr )
be removed or narrowed, and a rule that breaks a workflow is
narrowed or replaced by a control at another layer covering the
same consequence. Individual edits need not be acceptable alone,
since only the complete revised configuration is checked.

3.3     Regression-Guarded Evolution
Acceptance. With training workflows Btr ⊆ B and the thresholds                             Stopping and Freezing. Refinement stops at budget exhaustion,
of Eq. (1), a candidate 𝜋 is accepted if and only if                                   at stagnation after 𝑘 consecutive rounds without a new verified
        Acc(𝜋, A) ≡
                        Ó                                                              bypass, or at catalog exhaustion, when every eligible fixture and
                          𝑥 ∈ A 𝜔 (𝑥, 𝜋) = 0
                                                            (4)                        permitted variation has been tried against the incumbent. None
                        ∧ BPR(𝜋, Btr ) ≥ 𝜏𝑏 ∧ Δ𝐿95 (𝜋) ≤ 𝜖𝑙
                                                                                       of them proves that no bypass exists. Finalize re-checks the last
on a replica where the native configuration has loaded, and any ⊥                      incumbent on a fresh replica and returns it as 𝜋 ★ if it is still accepted,
falsifies the predicate. Rejected candidates return to the defender                    or RefinementFailure otherwise. Held-out attacks and test workflows
with their failure evidence but never replace the incumbent.                           are used only to evaluate 𝜋 ★.
    Rounds. A round is one attack phase against the fixed incumbent                        Run-to-Run Variation. Both agents sample from an LLM,
𝜋𝑡 . It ends when the attacker returns 𝑋𝑡 or exhausts its per-round                    so runs from the same seed may return different configurations,
query allowance. The archive then grows to A𝑡 +1 = A𝑡 ∪𝑉 (𝑋𝑡 , 𝜋𝑡 ),                   whereas verification, replay, and regression checks are determinis-
and only a new bypass triggers a revision, so the attacker never                       tic given the snapshot. Every returned configuration blocks its own
interacts with a partially updated candidate (Algorithm 1). Explo-                     archive and passes the training workflows, but its coverage beyond
ration, revision, and checking all consume the budget 𝑄.                               that archive varies, so we report the spread over repeated runs.
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                        WWW ’27, May 10-14, 2027, Dublin, Ireland


Table 1: Defensive controls supported by Janus at each layer.                      catalog exhaustion. Each attack thus sharpens the next defense,
B: attack blocking. L: limitation of a specified effect.                           and each defense narrows what the next attack can use.
                                                                                   Why Baselines Fall Short. The frozen v2 blocks all four held-out
ID    Control             Configurable Policy                             Effect
                                                                                   attacks of J06 and passes all four functionality tests. CRS stops
G1    Ingress Limits      Allowed routes and methods, body-size cap         B
                                                                                   only one re-encoded variant through literal matching and flags
G2    Virtual Patch       Request-match rules and action                    B
                                                                                   a legitimate configuration post. Both RASPs preserve functional-
A1    Class Filtering     Class allowlist, others rejected                  B
A2    Graph Limits        Depth, references, bytes, array length            B
                                                                                   ity but block no attacks, as their generic hooks do not capture
A3    Parser Filter       Class blocklist in the parser’s own filter        B      XStream’s object reconstruction. Kintsugi and Tetragon block three
S1    Execution Limits    Deny process-execution system calls               L      attacks at the sink but miss the write inside Jenkins home, while
S2    Write Confinement   Read-only root, explicit writable mounts          L      their process-execution restrictions break a build workflow. These
S3    Egress Isolation    Internal network, no external egress              L      baselines either miss variants or restrict required behavior. Janus
                                                                                   scopes v2 to the build-trigger payload while preserving legitimate
                                                                                   job-management workflows.

4     Implementation                                                               Layer Attribution. Masked replay of the two archived attacks
                                                                                   shows that each is covered by at least two rules, the gateway and
We implement Janus in about 9,800 lines of Python. A control plane                 application rules for both and the system rule for the seed, so v2
runs Algorithm 1, both agents share one LLM backend with schema-                   has no single point of failure. Replaying the held-out attacks after
validated outputs (Appendix E), and verification, counterfactual                   freezing confirms that the lower layers are not redundant. With
replay, and regression checks are deterministic tools (Appendix D).                the gateway masked, the application rule alone stops all four and
Each deployment runs as a Docker Compose project behind an                         the system rule two, whereas the gateway alone stops one. The
NGINX reverse proxy and is restored from a snapshot before every                   system rule misses the attack that writes inside the Jenkins home,
replay. Oracles and workflow assertions run outside the application                which builds need, and one variant outside its narrow workflow-
container, and failed replays are retried rather than counted as                   preserving scope.
blocks. No application code is modified.
   Per-layer adapters compile each rule of Table 1 into native config-             5     Evaluation
uration, reject unsupported controls or scopes, and confirm that the
configuration has loaded. A loaded rule counts as acting only when                 We organize the evaluation around four questions:
its enforcement event appears during replay. G1 and G2 become                      • RQ1: How do frozen defenses compare on held-out attacks and
NGINX limits and ModSecurity rules [35], the latter enabled only if                  unseen attackers?
they match no training request. A1 and A2 become jdk.serialFilter                  • RQ2: What functionality and online/offline costs accompany
settings [31, 32] and apply only where the vulnerable path uses                      their protection?
ObjectInputStream. A3 extends the class blocklist of the Jenkins                   • RQ3: How does refinement progress, and what protection re-
remoting ClassFilter, which Jenkins applies to XStream alongside                     mains on paths never rediscovered?
its JEP-200 allowlist. S1-S3 become a seccomp profile denying ex-                  • RQ4: How do the components, enforcement layers, and budgets
ecve [17], a read-only root filesystem with explicit writable volumes,               affect the outcome?
and an internal Compose network. Allowlists, limits, and writable
volumes are derived from training workflows only.                                  5.1    Experimental Setup
                                                                                   Deployments. We study sixteen (application, CVE) deployments
4.1      Running Example                                                           across six applications, five on the JVM and one in PHP: Apache
Figure 3 traces the J06 run on CVE-2026-84645, a recent XStream                    OFBiz (4 CVEs), Jenkins (5), Liferay Portal (2), Metabase (1), Apache
deserialization RCE in Jenkins 2.567 [23]. The exploit posts job-                  ActiveMQ (2), and Snipe-IT (2). Each reproduces from a fresh snap-
configuration XML from which Jenkins rebuilds a build-trigger                      shot, has a non-destructive consequence oracle and assertable be-
object graph, and the oracle checks a marker file at the sink.                     nign workflows, and has at least one supported control on its exploit
Red-Blue Escalation. The seed succeeds on the undefended                           path (Appendix A). One ActiveMQ deployment is reached through
replica, so the defender installs v1, a gateway rule matching                      native OpenWire rather than HTTP, so gateway controls do not
the literal build-trigger class name. The attacker sees its new                    apply to it.
carrier rejected and re-encodes the class name as XML character                    Attacks and Workflows. For each deployment an expert con-
references. XStream decodes this request to the same object, and                   structs five attack objectives from the same vulnerability, spanning
the oracle fires. The defender then revises from the exposed effect                remote code execution, file read, write, or deletion, request forgery,
rather than from the bytes of the request. Its v2 adds the class                   access-control bypass, privilege escalation, and application-state
to the Jenkins class filter (A3), which acts after decoding and so                 abuse [29, 34]. One is the training seed, and the other four are held-
covers every representation of the class, keeps a decoded-name                     out test attacks that differ from it in impact and, where possible,
gateway rule as a cheap pre-filter, and confines writes outside the                in gadget family, giving 64 held-out attacks. Each deployment also
Jenkins home as a backstop. v2 is accepted only after it blocks both               has 12 training workflows for the acceptance gate, 4 validation
archived attacks and passes the benign workflows. The attacker’s                   workflows for baseline tuning, and 4 disjoint functionality tests
four further variants all end in HTTP 403, and the run stops by                    that assert response and persistent state. The oracle monitors every
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                         Yang et al.



      Seed Check                               Round 1                                Round 2                                 Layer Status
         Attempt 1                             Attempts 2-3                         Attempts 4-7                            Policy v2, Attempts 4-7

       Seed Exploit               New Carrier           Re-Encoding   Re-Encoding ×3            Carrier Retry               Variants        Workflows
                                             403                                403                     403            G   Gateway           Acted (403)
        No Policy                             G    Policy v1                    G   A   S   Policy v2                  A   Application     Not Reached
    Undefended Replica                      Literal Class Match              Regression Check Passed
                                                                                                                       S   System          Not Reached

       Seed Verified              Oracle Silent           Bypass           Oracle Silent, No New Bypass                                Jenkins


Figure 3: Recorded run on Jenkins CVE-2026-84645. A re-encoded payload bypasses the literal gateway rule of v1. The defender
revises from the exploited effect into the three-layer v2, which stops every later variant at the gateway while benign workflows
still pass.


consequence reachable on the path, and only preventive blocks                  far fewer workflows (81.2% versus 95.3% BPR), so the baselines do
count (Appendix B).                                                            not share a single weakness.
                                                                                  Changed attack settings widen these gaps. Switching to an un-
Baselines. B1 is ModSecurity with OWASP CRS [35], B2 and B3                    used monitored consequence raises Janus’s ASR only from 6.2%
are Datadog RASP [13] and OpenRASP [3], B4 is Kintsugi [37], the               to 9.7%, whereas Kintsugi rises from 14.6% to 31.9% and Tetragon
closest multi-layer system (A+S), and B5 is Tetragon [10] with a               from 12.5% to 36.8%, because alternative effects inside their allowed
service-wide policy that denies process execution, writes outside              resources remain reachable. With the frozen policy revealed, the at-
data directories, and external connections. Tunable baselines re-              tackers breach 10/48 pairs for Janus and 23-38 for the baselines. The
ceive the same archive, validation workflows, and tuning allowance             human expert, reported separately from the automated attackers,
(Appendix F). B1 does not apply to the OpenWire deployment.                    breaches 4/16 deployments for Janus and 9-13 for the baselines.
Attackers and Budgets. Three unseen automated attackers,                          The residual attacks come from two synthesis failures and one
PentestGPT and CAI on GPT6 Luna and the CVE-Bench refer-                       held-out failure. J11 ends with an archived bypass that no candi-
ence agent on Grok 4.7, attempt every deployment, giving 48                    date covers within budget, and P02 with a bypass whose file write
attacker/deployment pairs, and a policy-aware setting reveals the              overlaps a write that required functionality performs. Both had ac-
frozen policy to them. A team-member human expert is reported                  cepted a configuration that blocks the seed, and these last accepted
separately. Synthesis is capped at 700,000 tokens, 800 replays, 600            policies remain in every aggregate. J07 passes synthesis but retains
attacker queries, 90 minutes, 20 rules, and 8 rounds, with 𝑘 = 2,              one held-out success. Of the 60 prevented Janus attacks, 44 are
𝜏𝑏 = 100% on the training workflows, and 𝜖𝑙 = 10%. The default                 stopped before or during deserialization and 16 by consequence
backend is DeepSeek V4 Flash.                                                  limitation, 11 of them by denied execve, 3 by the read-only root, and
                                                                               2 by denied egress. Because G and A act before S and every rule
Metrics. ASR is the fraction of held-out attacks that still succeed,           only denies, the first 44 are exactly the attacks that the G and A
averaged over deployments. Mitigation counts deployments with                  rules alone block. No file-read consequence is credited to limitation.
no held-out success and no synthesis failure, and breach counts                The baselines differ in where they stop an attack. B1 stops all its
attacker/deployment pairs with at least one success. A failed syn-             blocked attacks before deserialization, while the RASPs, Kintsugi,
thesis is scored with its last accepted configuration, and blocking            and Tetragon stop most of theirs at the sensitive operation. Neither
and impact limitation are reported separately. BPR is the fraction             stopping point establishes that an unmonitored effect is safe.
of functionality tests passed, FPR the fraction of benign requests
                                                                                Finding 1. Coordinated cross-layer controls cut held-out ASR to 6.2%,
rejected, and ΔP95 the P95 latency increase of the targeted endpoint.
                                                                                about a third of the best baseline (18.8%), and leave only 5/48 at-
No regression counts deployments where all four tests pass within               tacker/deployment pairs breached. The advantage persists under con-
the latency gate. Experiments that re-run synthesis are repeated                sequence switching (9.7% versus at least 31.9%) and policy visibility (10/48
three times and report means with the largest single-run deviation,             versus at least 23/48 breached pairs), and all residual attacks trace to two
and single-run results use the median run.                                      synthesis failures and one held-out failure.


5.2     RQ1: Effectiveness                                                     5.3          RQ2: Functionality and Overhead
As Table 2 shows, Janus has 6.2% held-out ASR, versus 18.8-55.0% for           Janus passes 98.4% of functionality tests at a 6.9% targeted P95
the baselines, mitigates 13/16 deployments, and is breached on 5/48            increase and has no regression on 15/16 deployments (Table 2).
attacker/deployment pairs. On the 15 deployments that B1 covers,               Kintsugi and Datadog RASP also meet the aggregate reference but
Janus’s ASR is 6.7%, but baselines fail in different ways. Specifically,       regress on 4 and 8 deployments, and OpenRASP exceeds the latency
request signatures miss semantic variants, generic RASP hooks miss             gate on average. High functionality does not imply security, since
deserialization paths outside their sinks, and runtime containment             both RASPs keep 96.9% BPR at about 50% ASR. Tetragon reaches
misses consequences inside permitted resources. Tetragon reaches a             only 81.2% BPR because some features need subprocesses, writes, or
slightly lower ASR than Kintsugi (18.8% versus 20.3%) but preserves            network access. It rejects only 1.2% of benign requests, so a low FPR
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                                       WWW ’27, May 10-14, 2027, Dublin, Ireland


Table 2: Frozen defenses on the 16 deployments. Rates are in percent and Offline in minutes. Main and Switch are ASRs on the
12 deployments with an unused monitored consequence, Aware counts breached attacker pairs with the frozen policy revealed,
and Human counts deployments breached by the expert. Other P95 is the non-targeted latency increase.

                                       Held-out security                 Changed attack settings           Functionality and latency              Overhead
          Method                ASR     Mitigated Breached       Main      Switch Aware Human            FPR BPR ΔP95 No regr.            Other P95 RPS Offline
          ModSecurity + CRS     55.0         0/15        32/45    45.5    59.1 ±2.3   38/45      13/15    4.5 88.3       3.2       8/15          2.0 -1.5    15
          Datadog RASP          48.4         0/16        29/48    39.6    55.6 ±1.4   34/48      12/16    0.6 96.9       9.9       8/16          5.5 -4.8    18
          OpenRASP              50.0         0/16        32/48    41.7    59.7 ±1.4   37/48      13/16    0.8 96.9      10.9       7/16          6.0 -5.5    18
          Kintsugi              20.3         6/16        17/48    14.6    31.9 ±2.8   23/48       9/16    0.5 95.3       9.3      12/16          1.8 -2.5    12
          Tetragon              18.8         8/16        18/48    12.5    36.8 ±1.4   24/48      10/16    1.2 81.2       4.6       4/16          3.5 -2.0     5
          Janus                  6.2        13/16         5/48     6.2     9.7 ±1.4   10/48       4/16    0.3 98.4       6.9      15/16          1.2 -3.0    60



does not establish functionality preservation, because a request may                        redundancy is judged only on conclusive rows. One-shot joint syn-
be admitted while a later operation or persistent-state assertion fails.                    thesis reaches 24.0% and greedy single edits 13.0%. The gaps among
Janus adds 1.2% non-targeted latency and lowers throughput by                               the attribution, greedy, and no-archive variants are comparable
3.0%. Its 60-minute median offline cost is paid once per deployment                         to run-to-run variation and indicate a consistent direction rather
and workflow version, not online. A typical synthesis uses 420,000                          than a strict ranking. Seed-only synthesis has no synthesis failures,
tokens and 680 environment replays, 110 of them counterfactual.                             since every seed can be blocked within the gates, so its higher
                                                                                            ASR comes from variants it never saw. The BPR and latency of all
 Finding 2. Janus combines the lowest ASR with the highest BPR (98.4%)
                                                                                            variants appear in Appendix Figure 6.
 at a 6.9% targeted latency increase and regresses on only 1/16 deployments.
 High BPR alone does not imply protection, as both RASPs keep 96.9%                         Layers. Figure 4(e) shows that every layer matters. Disabling A,
 BPR yet leave about half of the held-out attacks successful.                               S, or G in the frozen policy raises ASR from 6.2% to 14.1%, 31.2%,
                                                                                            and 20.3%. Dropping A matters only on Jenkins, where the class
                                                                                            filter (A3) carries the type constraint that the gateway and system
5.4     RQ3: Refinement Dynamics                                                            rules each cover only in part. Single layers are much weaker, partly
Figure 4(a) shows diminishing returns. Held-out ASR falls from                              because six deployments have no A control, so A-only ASR is at
21.9% after seed-only construction to 6.2% at the default cap, while                        least 37.5%. S-only re-optimization (40.1%) trails Tetragon because
new verified bypasses decline from 9 to 1. In total 14/16 runs stop                         Janus scopes system rules narrowly to preserve workflows, and
without a new bypass, 9 by stagnation and 5 by catalog exhaustion.                          on J07-J09 the seeds’ state changes lie inside the writable Jenkins
The other 2/16 exhaust their budget with unresolved archive attacks,                        home, where S cannot limit them. Janus’s gateway rules alone (47.9-
which are the two synthesis failures. Snapshots are scored after                            53.1%) are close to tuned CRS, leaving 50.0% open on the 15 HTTP
freezing, so held-out outcomes never guide stopping.                                        deployments versus 55.0% for CRS.
   To test generalization beyond rediscovery, we split the 64 held-                         Budgets and Backends. Figure 4(b-c) shows that ASR stays within
out attacks by whether the attacker eventually reached their paths,                         5.7-6.8% across the three backends, within run-to-run variation.
defined on the path keys of the registered fixtures (Appendix D).                           GPT6 Luna also drives two of the evaluation attackers, so its row is
The 19 rediscovered attacks have 1 success (5.3%) and the 45 never-                         not an independent-attacker test. The query cap is split evenly over
rediscovered ones 3 (6.7%), all on the synthesis failures J11 and                           the rounds, so it changes how many variations each attack phase
P02. On the 14 accepted syntheses, no never-rediscovered attack                             may try rather than the number of rounds. Lowering the query
succeeds. J07’s success is a held-out payload on a rediscovered path                        cap to 150 raises ASR to 10.9%, while raising it to 900 lowers ASR
whose archived attack is blocked, consistent with acceptance.                               only to 5.7% at 13% more offline time. Most runs stop by stagna-
 Finding 3. Refinement shows diminishing returns, as eight rounds cut                       tion or catalog exhaustion before the overall cap binds, so a larger
 ASR from 21.9% to 6.2% while new bypasses fall from 9 to 1. Protection                     allowance mainly helps rounds that previously ran out of queries.
 carries over to paths the attacker never rediscovered (6.7% ASR), and none                 Rotating the training seed on six deployments leaves 4.2-8.3% ASR
 of these attacks succeeds on the 14 accepted syntheses.                                    on their held-out attacks, versus none under the default seed.
                                                                                             Finding 4. Every component and every layer contributes. The seed-only,
                                                                                             non-adaptive, and one-shot variants cost the most (15.1-24.0% ASR), and
5.5     RQ4: Ablation and Sensitivity                                                        dropping any single layer raises ASR to 14.1-31.2%. Results stay within
                                                                                             5.7-6.8% across backends, and raising the default 600-query cap to 900
Components. Figure 4(d) isolates exposure, attribution, and coor-
                                                                                             lowers ASR by only 0.5 points.
dination, which address challenges ❶-❸. Seed-only construction
(21.9%) and a non-adaptive variant pool (15.1%) show that adap-
tive exposure matters beyond supplying more variants. Without                               6 Discussion
counterfactual replay, ASR rises to 10.9% and BPR drops to 94.8%,
reflecting redundant or poorly scoped controls. Of the masked re-                           6.1 Implications
plays, 71% end blocked, 18% at the consequence, 8% not reached,                             The evaluation also shows why single-point and generic defenses
and 3% in error, and 6% of coverage entries remain unknown, so                              fall short, which yields three lessons beyond Janus.
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                                                          Yang et al.


                              (a) Round cap             (b) Query cap          (c) Backend                                         (d) Ablations                     (e) Layer subsets
                                                                                                                                                            60
                         +9         +n: new bypasses                                                                    Full         6.2                                         Disable
                                                                                                                                                                                 Re-optimize
Held-out ASR (%)




                                                                                                                Seed only                          21.9




                                                                                                  Exp.
                   20                                                                                         Non-adaptive                  15.1
                               +7                                                                                                                           40
                                      +4                                                                          Raw logs               12.0




                                                                                                  Attr.
                                                                                                                Timing-only            9.9
                                           +2                                                                No counterfact.            10.9
                   10                            +1                                                                                                         20
                                                                                                                Greedy edit                 13.0




                                                                                                  Coord.
                                                                                                              One-shot joint                         24.0
                                                                                                                No archive            8.9
                    0                                                                                                                                       0
                          0    2       4    6    8     150 300 600 900     DeepSeek GPT6   Grok                                0     10      20      30          G   A   S   GA AS GS GAS
                   min    9    24     38    50   60    38   49   60   68      60     70     55


Figure 4: Refinement, sensitivity, and ablations (held-out ASR, %). (a) Round cap, with new verified bypasses found after each
snapshot. (b) Attacker-query cap and (c) backend, default circled or dark, with median offline minutes below. (d) Component
ablations. (e) Layer subsets, disabled in the frozen policy or re-optimized. Error bars show the largest single-run deviation over
three runs.


Place the Decisive Constraint Where the Attack Becomes                                                     that their applicability hinges on classpath and version prereq-
Visible. A literal gateway rule misses an equivalent representation,                                       uisites [6, 24, 40]. On the defense side, look-ahead agents restrict
while a type-level constraint after decoding covers every encod-                                           the classes a stream may instantiate [7], runtimes provide class
ing of the same class, and disabling the application layer raises                                          and graph filters [31], and recent systems synthesize them auto-
ASR from 6.2% to 14.1%. A gateway signature is better treated as a                                         matically: DeseriGuard derives Java allowlists from application
cheap pre-filter that lets downstream controls be scoped narrowly,                                         semantics [46], QUACK infers allowed PHP classes by static duck
a principle defenders can adopt without Janus.                                                             typing [14], and Gauthier and Bae block chains at run time [19].
Judge Mitigations on Coverage and Functionality Together.                                                  These filters act only at the call sites and parsers they hook, whereas
Frozen system hardening denies operations that legitimate features                                         Janus uses them as one of three layers.
need (81.2% BPR for Tetragon), whereas RASP keeps 96.9% of work-
flows but misses about half of the held-out attacks. Mitigations                                           7.2     Runtime Mitigation
should thus be measured on held-out paths, unseen attackers, and                                           Earlier work blocks known exploit inputs with network and host fil-
functionality together, since evaluating them on their own seed                                            ters [11, 44], disables a vulnerable path until a patch ships [21, 22], or
overstates protection.                                                                                     rewrites code with language models [30]. System-call specialization
Counterfactual Attribution Is Useful on Its Own. Rule count is                                             shrinks the attack surface of applications and containers [4, 20, 25],
a poor proxy for protection, because an upstream rule hides whether                                        while RASP [3, 13] and eBPF enforcement [10] apply generic poli-
downstream rules hold. Counterfactual replay needs only replicas                                           cies that ignore the specific vulnerability and deployment. Kintsugi,
and oracles, 94% of its entries were conclusive in our runs, and                                           the closest system, places kernel-enforced policies at application
operators can apply it to hand-written policies to expose redundant                                        code locations [37]. These systems fix enforcement points in ad-
rules and single points of failure. These lessons rest on a bounded                                        vance, whereas Janus selects and scopes controls across layers and
benchmark and empirical attackers, whose limits we discuss next.                                           revises them against an adaptive attacker.

6.2                      Limitations and Future Work                                                       7.3     Cross-Layer Synthesis
                                                                                                           Policy generation for defense in depth [39], firewall anomaly anal-
Janus preserves only the behavior its benign workflows express,
                                                                                                           ysis [1], and coordinated front-end filtering [28] share our premise
so we use expert-written workflows with state assertions and un-
                                                                                                           that layers must be configured together, but they reason over static
seen tests. Its protection is empirical rather than proven, and public
                                                                                                           rule models and cannot tell whether a seemingly redundant rule is
exploits may appear in model training data, which independent
                                                                                                           the only one that stops a variant, which Janus learns from coun-
held-out paths and unseen attackers partly address. Impact limita-
                                                                                                           terfactual replay. Adversarial testing evades WAFs [2, 15], and
tion leaves the vulnerable path reachable, so frozen configurations
                                                                                                           language-model agents exploit real vulnerabilities [16, 18, 26, 47],
are temporary measures until a root-cause fix. The benchmark cov-
                                                                                                           but these works measure or break defenses rather than feed variants
ers six applications, only one in PHP, so we report per-deployment
                                                                                                           back into synthesis. Our loop follows counterexample-guided syn-
results rather than statistical tests. The loop needs only a conse-
                                                                                                           thesis [42], adversarial training [27], and self-refining agents [41],
quence oracle, a control catalog, and benign workflows, which
                                                                                                           but it produces a deployable configuration, verifies every coun-
makes template injection and request forgery natural next targets.
                                                                                                           terexample with an independent oracle, and gates every revision
                                                                                                           on benign workflows.
7 Related Work
7.1 Deserialization Defenses                                                                               Ethical Considerations
Gadget-chain discovery tools target PHP [12, 36] and Java [5, 8,                                           Our study builds an offensive component to evaluate defenses, so
9, 43], and empirical studies show that chains are diverse and                                             we constrained both what it can reach and what we release. All
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                                       WWW ’27, May 10-14, 2027, Dublin, Ireland


experiments target publicly disclosed vulnerabilities in applications                     [14] Yaniv David, Neophytos Christou, Andreas D Kellas, Vasileios P Kemerlis, and
we deployed in isolated, resettable environments without Inter-                                Junfeng Yang. 2024. QUACK: Hindering Deserialization Attacks via Static Duck
                                                                                               Typing.. In NDSS.
net access, oracles use canaries we control, and no real user data                        [15] Luca Demetrio, Andrea Valenza, Gabriele Costa, and Giovanni Lagorio. 2020. Waf-
is involved. The attacker draws only from reviewed fixtures of                                 a-mole: evading web application firewalls through adversarial machine learning.
                                                                                               In Proceedings of the 35th Annual ACM Symposium on Applied Computing. 1745–
known gadget families and runs only against these replicas, and                                1752.
any sign of an undisclosed issue will be reported to the maintainers                      [16] Gelei Deng, Yi Liu, Víctor Mayoral-Vilches, Peng Liu, Yuekang Li, Yuan Xu,
before publication. For the same reason, the defense side is re-                               Tianwei Zhang, Yang Liu, Martin Pinzger, and Stefan Rass. 2024. { PentestGPT } :
                                                                                               Evaluating and harnessing large language models for automated penetration
leased openly, whereas attack sequences are released only in their                             testing. In 33rd USENIX Security Symposium (USENIX Security 24). 847–864.
already-public form and new variants only to vetted researchers.                          [17] Docker. 2024. Seccomp security profiles for Docker. Docker documentation.
The human-expert attacker is a team member whose results are                              [18] Richard Fang, Rohan Bindu, Akul Gupta, and Daniel Kang. 2024. Llm agents can
                                                                                               autonomously exploit one-day vulnerabilities. arXiv preprint arXiv:2404.08144
reported separately, so IRB review does not apply.                                             (2024).
                                                                                          [19] François Gauthier and Sora Bae. 2022. Runtime prevention of deserialization
                                                                                               attacks. In Proceedings of the ACM/IEEE 44th International Conference on Software
8    Conclusion                                                                                Engineering: New Ideas and Emerging Results. 71–75.
We presented Janus, a red-blue adversarial framework that syn-                            [20] Seyedhamed Ghavamnia, Tapti Palit, Azzedine Benameur, and Michalis Poly-
                                                                                               chronakis. 2020. Confine: Automated system call policy generation for container
thesizes deployment-specific cross-layer defenses against unsafe                               attack surface reduction. In 23rd International Symposium on Research in Attacks,
deserialization. A black-box attacker supplies verified exploit vari-                          Intrusions and Defenses (RAID 2020). 443–458.
                                                                                          [21] Zhen Huang, Mariana DAngelo, Dhaval Miyani, and David Lie. 2016. Talos:
ants, and a defender turns them into joint gateway, application,                               Neutralizing vulnerabilities with security workarounds for rapid response. In
and system controls through attack-effect summaries, counterfac-                               2016 IEEE Symposium on Security and Privacy (SP). IEEE, 618–635.
tual coverage attribution, and regression-gated revision. On sixteen                      [22] Zhen Huang, David Lie, Gang Tan, and Trent Jaeger. 2019. Using Safety Properties
                                                                                               to Generate Vulnerability Patches.. In IEEE Symposium on Security and Privacy.
deployments across six Java and PHP applications, Janus lowers                                 539–554.
held-out attack success to 6.2%, about a third of the best base-                          [23] Jenkins Project. 2026. Jenkins Security Advisory 2026-09-02. https://www.jenkins.
line, mitigates 13 of 16 deployments, and is breached on only 5                                io/security/advisory/2026-09-02/.
                                                                                          [24] Bruno Kreyssig and Alexandre Bartel. 2024. Analyzing prerequistes of known
of 48 unseen-attacker pairs, while passing 98.4% of functionality                              deserializtion vulnerabilities on java applications. In Proceedings of the 28th
tests at a 6.9% targeted latency increase. Its advantage holds under                           International Conference on Evaluation and Assessment in Software Engineering.
consequence switching and policy visibility and carries over to                                28–37.
                                                                                          [25] Yunsen Lei and Craig A Shue. 2025. Making (Only) the Right Calls: Preventing
exploitation paths the attacker never rediscovered.                                            Remote Code Execution Attacks in PHP Applications with Contextual, State-
                                                                                               Sensitive System Call Filtering. In International Conference on Detection of Intru-
                                                                                               sions and Malware, and Vulnerability Assessment. Springer, 46–65.
References                                                                                [26] Zicheng Liu, Lige Huang, Jie Zhang, Dongrui Liu, Yuan Tian, and Jing Shao.
 [1] Ehab S Al-Shaer and Hazem H Hamed. 2004. Discovery of policy anomalies in                 2026. Pacebench: A framework for evaluating practical ai cyber-exploitation
     distributed firewalls. In Ieee Infocom 2004, Vol. 4. IEEE, 2605–2616.                     capabilities. In International Conference on Learning Representations, Vol. 2026.
 [2] Dennis Appelt, Cu D Nguyen, Annibale Panichella, and Lionel C Briand. 2018.               17137–17163.
     A machine-learning-driven evolutionary approach for testing web application          [27] Aleksander Madry, Aleksandar Makelov, Ludwig Schmidt, Dimitris Tsipras, and
     firewalls. IEEE Transactions on Reliability 67, 3 (2018), 733–757.                        Adrian Vladu. 2017. Towards deep learning models resistant to adversarial attacks.
 [3] Baidu Security. 2024. OpenRASP: Runtime Application Self-Protection. https:               arXiv preprint arXiv:1706.06083 (2017).
     //github.com/baidu/openrasp.                                                         [28] Wei Meng, Chenxiong Qian, Shuang Hao, Kevin Borgolte, Giovanni Vigna,
 [4] Alexander Bulekov, Rasoul Jahanshahi, and Manuel Egele. 2021. Saphire: Sand-              Christopher Kruegel, and Wenke Lee. 2018. Rampart: Protecting web appli-
     boxing { PHP } applications with tailored system call allowlists. In 30th USENIX          cations from { CPU-Exhaustion } { Denial-of-Service } attacks. In 27th USENIX
     Security Symposium (USENIX Security 21). 2881–2898.                                       Security Symposium (USENIX Security 18). 393–410.
 [5] Sicong Cao, Biao He, Xiaobing Sun, Yu Ouyang, Chao Zhang, Xiaoxue Wu,                [29] MITRE. 2024. CWE-502: Deserialization of Untrusted Data. https://cwe.mitre.
     Ting Su, Lili Bo, Bin Li, Chuanlei Ma, et al. 2023. Oddfuzz: Discovering java             org/data/definitions/502.html.
     deserialization vulnerabilities via structure-aware directed greybox fuzzing. In     [30] Yu Nong, Haoran Yang, Long Cheng, Hongxin Hu, and Haipeng Cai. 2025.
     2023 IEEE Symposium on Security and Privacy (SP). IEEE, 2726–2743.                        { APPATCH } : Automated adaptive prompting large language models for { Real-
 [6] Sicong Cao, Xiaobing Sun, Xiaoxue Wu, Lili Bo, Bin Li, Rongxin Wu, Wei Liu,               World } software vulnerability patching. In 34th USENIX Security Symposium
     Biao He, Yu Ouyang, and Jiajia Li. 2023. Improving java deserialization gadget            (USENIX Security 25). 4481–4500.
     chain mining via overriding-guided object generation. In 2023 IEEE/ACM 45th          [31] OpenJDK. 2016. JEP 290: Filter Incoming Serialization Data. https://openjdk.org/
     International Conference on Software Engineering (ICSE). IEEE, 397–409.                   jeps/290.
 [7] Luca Carettoni. 2016. SerialKiller: Look-Ahead Java Deserialization Library.         [32] Oracle. 2024. Serialization Filtering. Oracle Java Platform documentation. Ob-
     https://github.com/ikkisoft/SerialKiller.                                                 jectInputFilter; jdk.serialFilter.
 [8] Bofei Chen, Lei Zhang, Xinyou Huang, Yinzhi Cao, Keke Lian, Yuan Zhang, and          [33] OWASP Foundation. 2021. OWASP Top 10: A08 Software and Data Integrity
     Min Yang. 2024. Efficient detection of java deserialization gadget chains via             Failures. https://owasp.org/Top10/.
     bottom-up gadget search and dataflow-aided payload construction. In 2024 IEEE        [34] OWASP Foundation. 2024. Testing for Insecure Deserialization. OWASP Web
     Symposium on Security and Privacy (SP). IEEE, 3961–3978.                                  Security Testing Guide (WSTG).
 [9] Xingchen Chen, Baizhu Wang, Ze Jin, Yun Feng, Xianglong Li, Xincheng Feng,           [35] OWASP Foundation. 2026. OWASP ModSecurity Core Rule Set. https://
     and Qixu Liu. 2023. Tabby: Automated gadget chain detection for java deserial-            coreruleset.org/. Accessed 2026.
     ization vulnerabilities. In 2023 53rd Annual IEEE/IFIP International Conference on   [36] Sunnyeo Park, Daejun Kim, Suman Jana, and Sooel Son. 2022. { FUGIO } : Au-
     Dependable Systems and Networks (DSN). IEEE, 179–192.                                     tomatic exploit generation for { PHP } object injection vulnerabilities. In 31st
[10] Cilium Authors. 2025. Tetragon: eBPF-Based Security Observability and Runtime             USENIX Security Symposium (USENIX Security 22). 197–214.
     Enforcement. https://github.com/cilium/tetragon.                                     [37] Yihao Peng, Zizhen Zhu, Jiatian Hu, Jiaxu Wang, Hai Wan, and Xibin Zhao. 2026.
[11] Manuel Costa, Miguel Castro, Lidong Zhou, Lintao Zhang, and Marcus Peinado.               Kintsugi: Empowering { LLMs } to Mitigate Web Vulnerabilities via Runtime
     2007. Bouncer: Securing software by blocking bad input. In Proceedings of twenty-         Policy Injection. In 35th USENIX Security Symposium (USENIX Security 26). 731–
     first ACM SIGOPS symposium on Operating systems principles. 117–130.                      750.
[12] Johannes Dahse, Nikolai Krein, and Thorsten Holz. 2014. Code reuse attacks in        [38] Van-Thuan Pham, Marcel Böhme, and Abhik Roychoudhury. 2020. Aflnet: A
     php: Automated pop chain generation. In Proceedings of the 2014 ACM SIGSAC                greybox fuzzer for network protocols. In 2020 IEEE 13th international conference
     Conference on Computer and Communications Security. 42–53.                                on software testing, validation and verification (ICST). IEEE, 460–465.
[13] Datadog. 2025. Application Security Management: Runtime Application Self-            [39] Paul Rubel, Michael Ihde, Steven Harp, and Charles Payne. 2005. Generating
     Protection (RASP). https://www.datadoghq.com/product/application-security-                policies for defense in depth. In 21st Annual Computer Security Applications
     management/.                                                                              Conference (ACSAC’05). IEEE, 10–pp.
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                            Yang et al.


Table 3: Enforcement reach per application. A covers Java-                                vary the impact and the execution variant instead. Every held-out
native paths (A1/A2) and the Jenkins XStream path (A3); G                                 attack first reaches its consequence on the undefended replica, and
needs an HTTP entry. ActiveMQ’s Jolokia CVE admits GS,                                    none is added to the archive.
its native OpenWire CVE only S.                                                           Oracles. The oracle monitors process execution, protected-file
                                                                                          access, controlled egress, and an application-state canary where
Application    Format              A    Layers   Gadget families                          applicable, and an attack succeeds if any monitored consequence
OFBiz          Java-native         ✓     GAS     CommonsBeanutils, ROME,
                                                 MozillaRhino
                                                                                          occurs. Access-control bypass, privilege escalation, and state abuse
Jenkins        XStream             ✓     GAS     nested PersistenceRoot,                  are confirmed through the canary. No system-layer control can
                                                 OfflineCause, ListView, Agent            limit a file read (Table 5), so only G or A rules can prevent such a
                                                 identity, lazy render                    consequence. Alerts, HTTP error codes, replay failures, and process
Liferay        JSON                ✗     GS      C3P0/ReferenceSerialized,
                                                 JdbcRowSetImpl
                                                                                          termination after the consequence do not count as prevention.
Metabase       Java-native         ✓    GAS      Java URLDNS, Clojure comparator          Attackers and Budgets. The automated attackers are pinned to
ActiveMQ       JMX / OpenWire      ✗    GS/S     Jolokia MBean,                           the September 2026 model snapshots, and each receives 200 queries,
                                                 ClassPathXmlApplicationContext           60 minutes, and 500,000 tokens per deployment, separate from the
Snipe-IT       PHP object          ✗     GS      Laravel, Monolog, Guzzle chains
                                                                                          synthesis caps. The human expert uses the same external observa-
                                                                                          tion channel, has no access to the archive or held-out suite, and
[40] Imen Sayar, Alexandre Bartel, Eric Bodden, and Yves Le Traon. 2023. An in-depth      spends eight hours per deployment. The synthesis query cap is split
     study of java deserialization remote-code execution exploits and vulnerabilities.    evenly over the rounds (75 per round by default), and every query,
     ACM Transactions on Software Engineering and Methodology 32, 1 (2023), 1–45.         verification, regression check, and counterfactual replay consumes
[41] Noah Shinn, Federico Cassano, Ashwin Gopinath, Karthik Narasimhan, and
     Shunyu Yao. 2023. Reflexion: Language agents with verbal reinforcement learning.     environment replays. The consequence-switch suite covers the 12
     Advances in neural information processing systems 36 (2023), 8634–8652.              deployments that leave a monitored consequence unused, since the
[42] Armando Solar-Lezama, Liviu Tancau, Rastislav Bodik, Sanjit Seshia, and Vijay
     Saraswat. 2006. Combinatorial sketching for finite programs. In Proceedings of the
                                                                                          objectives of J07-J09 and P01 already use every monitored conse-
     12th international conference on Architectural support for programming languages     quence on the path. All runs use one 32-core AMD EPYC server
     and operating systems. 404–415.                                                      with 128 GB of memory, and latency is measured while replaying
[43] Prashast Srivastava, Flavio Toffalini, Kostyantyn Vorobyov, François Gauthier,
     Antonio Bianchi, and Mathias Payer. 2023. Crystallizer: A hybrid path analysis       the training workflows at 50 requests per second.
     framework to aid in uncovering deserialization vulnerabilities. In Proceedings of    Metrics and Aggregation. FPR is per benign request and BPR per
     the 31st ACM Joint European Software Engineering Conference and Symposium on
     the Foundations of Software Engineering. 1586–1597.                                  functionality test, so they are not complements, because a request
[44] Helen J Wang, Chuanxiong Guo, Daniel R Simon, and Alf Zugenmaier. 2004.              may be admitted while a later operation fails. Every applicable
     Shield: Vulnerability-driven network filters for preventing known vulnerabil-        deployment contributes four attacks, so pooled and macro ASR co-
     ity exploits. In Proceedings of the 2004 conference on Applications, technologies,
     architectures, and protocols for computer communications. 193–204.                   incide. We treat applications as clusters and report per-deployment
[45] Cong Wu, Jing Chen, Simeng Zhu, Wenqi Feng, Kun He, Ruiying Du, and Yang             counts instead of 𝑝-values. Repeated experiments pool the 192 held-
     Xiang. 2024. Wafbooster: Automatic boosting of waf security against mutated
     malicious payloads. IEEE Transactions on Dependable and Secure Computing 22, 2
                                                                                          out attacks of three runs. Their single-run deviation stays within
     (2024), 1118–1131.                                                                   2.8 percentage points, and the full policy leaves 3, 4, and 5 of 64
[46] Quan Zhang, Yiwen Xu, Zijing Yin, Chijin Zhou, and Yu Jiang. 2024. Automatic         attacks successful across runs (4.7-7.8% ASR).
     Policy Synthesis and Enforcement for Protecting Untrusted Deserialization.. In
     NDSS.
[47] Yuxuan Zhu, Antony Kellermann, Dylan Bowman, Philip Li, Akul Gupta, Adarsh           C    Attack-Effect Summary
     Danda, Richard Fang, Conner Jensen, Eric Ihli, Jason Benn, et al. 2025. CVE-
     bench: A benchmark for AI agents’ ability to exploit real-world web application      The defender reasons over a reduced view of each attack’s trace
     vulnerabilities. arXiv preprint arXiv:2503.17332 (2025).                             rather than the raw system-call stream. Janus keeps only operations
                                                                                          linked to the attack request and projects them onto the capability
A     Benchmark Details                                                                   vocabulary of Table 5. The vocabulary describes what was observed
Candidates come from the Kintsugi artifact [37], PACEbench [26],                          and is broader than what the system layer can enforce: the table
CVE-Bench [47], and public advisories. A candidate is kept only                           separately lists which catalog control, if any, can intercept each
if its seed reproduces three times in a row from a fresh snapshot                         capability, so an observed capability does not imply an available
and it meets the criteria of the evaluation setup. Table 4 lists the                      limitation. The decisive operation, the one the oracle observes, is
manifest, and Table 3 the enforcement reach and gadget families                           recorded with its parameters and lineage; all other operations are
per application.                                                                          collapsed to a count. The oracle, not the summary, decides whether
                                                                                          an attack succeeded.
B     Evaluation Details
                                                                                          D    Validation Procedures
Attack Objectives. Objectives follow the deserialization-impact
taxonomy consolidated from MITRE CWE-502 [29] and the OWASP                               Counterfactual Replay. Janus replays each archived attack from
Web Security Testing Guide [34]. Denial of service is excluded                            the same snapshot, masking each rule that blocked it, until the
because its consequence cannot be confirmed by a non-destructive                          attack reaches its consequence or no rule blocks it. A replay counts
oracle. Where an application exposes more than one gadget family                          as blocked by 𝑟 only if an enforcement event of rule 𝑟 precedes the
(Table 3), held-out objectives also differ from the seed in family. Each                  point where the consequence would occur and no consequence is
ActiveMQ CVE exposes a single family, so its held-out objectives                          observed; replica or oracle failures are retried a bounded number of
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                                                  WWW ’27, May 10-14, 2027, Dublin, Ireland


Table 4: Benchmark manifest. Auth indicates whether the attack requires authentication, and Points lists the catalog enforce-
ment points on the seed’s exploit path. S is listed only where the consequence involves process execution, a write outside
writable volumes, or egress, so it cannot limit the file read of P01 or the state changes of J07-J09 inside the writable Jenkins
home. P01 assumes the default APP_KEY, and J12 a user permitted to run native H2 queries.

                           ID           CVE                  Application (version)               Format              Consequence            Auth          Points
                                                                                         Java
                           J01          CVE-2020-9496        Apache OFBiz 17.12.01               Java-native         RCE                      No          G,A,S
                           J02          CVE-2021-26295       Apache OFBiz 17.12.01               Java-native         RCE                      No          G,A,S
                           J03          CVE-2021-29200       Apache OFBiz 17.12.01               Java-native         RCE                      No          G,A,S
                           J04          CVE-2021-30128       Apache OFBiz 17.12.01               Java-native         RCE                      No          G,A,S
                           J05          CVE-2026-53435       Jenkins 2.567                       XStream             RCE                      Yes         G,A,S
                           J06          CVE-2026-84645       Jenkins 2.567                       XStream             RCE                      Yes         G,A,S
                           J07          CVE-2026-84646       Jenkins 2.567                       XStream             State change             Yes          G,A
                           J08          CVE-2026-84650       Jenkins 2.567                       XStream             Config change            Yes          G,A
                           J09          CVE-2026-84651       Jenkins 2.567                       XStream             Config change            Yes          G,A
                           J10          CVE-2020-7961        Liferay Portal CE 7.2.0 GA1         JSON                RCE                      No           G,S
                           J11          CVE-2020-15842       Liferay Portal CE 7.2.0 GA1         JSON                RCE                      Yes          G,S
                           J12          CVE-2026-59827       Metabase OSS 0.61.1.3               Java-native         RCE                      Yes         G,A,S
                           J13          CVE-2022-41678       ActiveMQ Classic 5.17.3             Jolokia JMX         RCE                      Yes          G,S
                           J14          CVE-2023-46604       ActiveMQ Classic 5.17.3             OpenWire            RCE                      No            S
                                                                                         PHP
                           P01          CVE-2024-48987       Snipe-IT 7.0.9                      PHP object          File read/write          No           G,S
                           P02          CVE-2025-59713       Snipe-IT 7.0.9                      PHP object          RCE                      Yes          G,S


                          (a) Held-out successes                 (b) Failed function tests              (c) Targeted ΔP95 (%)                       (d) Breached attackers
                          B1 B2 B3 B4 B5 Janus                   B1 B2 B3 B4 B5 Janus                   B1 B2 B3 B4 B5 Janus                        B1 B2 B3 B4 B5 Janus
                   J01     1        1        1   0   0   0        0    0         0   0    1     0       3        8    9     8     4     6           1       1      1       0       0       0
                   J02     1        1        1   0   0   0        0    0         0   0    1     0       3        9   10     8     4     6           1       1      1       0       0       0
          OFBiz
                   J03     2        1        1   1   0   0        1    0         0   0    0     0       4        9   10     9     5     7           2       1      2       1       1       0
                   J04     1        1        1   0   0   0        0    0         0   0    1     0       3        8    9     8     4     6           1       1      1       1       0       0
                   J05     3        3        3   1   1   0        1    0         0   1    1     0       3     11     12     10    5     7           3       3      3       1       1       0
                   J06     3        4        4   1   1   0        1    0         0   1    1     0       4     12     13     11    5     8           3       3      3       2       2       0
        Jenkins    J07     4        4        4   3   3   1        0    0         0   0    0     0       3     11     12     10    5     8           3       3      3       3       3       2
                   J08     3        3        3   1   1   0        1    0         0   0    1     0       3     12     13     10    5     7           2       2      3       1       1       0
                   J09     3        3        3   1   1   0        0    0         0   0    1     0       3     11     12     11    5     7           3       3      3       2       2       0
                   J10     2        1        2   1   0   0        1    0         1   0    1     0       4     10     11     9     4     7           2       2      2       1       1       0
         Liferay
                   J11     2        2        2   1   2   1        0    0         0   0    1     0       4     11     12     10    5     8           2       2      2       2       2       1
      Metabase     J12     1        1        1   0   0   0        1    0         0   0    0     0       3     10     11     8     4     6           2       1      1       0       0       0
                   J13     1        1        1   0   0   0        0    0         0   0    0     0       2        8    9     8     4     6           1       1      1       0       0       0
      ActiveMQ
                   J14    N/A       1        1   0   0   0       N/A   0         0   0    1     0       N/A      9   10     8     4     6           N/A     1      1       0       0       0
                   P01     3        2        2   1   1   0        1    1         0   0    1     0       3        9   10     10    5     7           3       2      2       1       2       0
       Snipe-IT
                   P02     3        2        2   2   2   2        0    1         1   1    1     1       3     10     11     11    5     8           3       2      3       2       3       2

                                0        1       2   3   4                   0       1   2                  ≤5       6–10        >10 (gate)                  0         1       2       3



Figure 5: Per-deployment results. (a) Held-out successes out of 4 test attacks, all of which succeed undefended; (b) failed
functionality tests out of 4; (c) targeted P95 increase (%), with >10% exceeding the latency gate; (d) breached attackers out of 3.
N/A marks B1 on the native OpenWire deployment J14.


times and never counted as blocks. A replay has four outcomes, and                              to stop 𝑥 and receives none. If it ends with neither the consequence
only two of them determine the remaining entries. If it is blocked by                           nor an enforcement event (not reached), or still fails after retries
𝑟 , the entry of 𝑟 is obs (first replay) or lat (later replays). If it reaches                  (error), nothing is learned about the enabled rules, and their entries
the consequence, every still-enabled rule has demonstrably failed                               stay unknown. A none entry thus means that 𝑟 does not stop 𝑥 once
WWW ’27, May 10-14, 2027, Dublin, Ireland                                                                                                                                       Yang et al.


                              (a) BPR (%)                 (b) ΔP95 (%)                (c) Breached pairs / 144                             (d) Layer subsets: ΔP95 (%)
                    Full                         98.4        6.9                           15                                  8
                                                                                                                                                                                    6.9
            Seed only                        97.9         6.4                                                  63
Exp.




          Non-adaptive                       97.9           6.7                                          48                    6                                          5.3
                                          96.9                    7.2                              39                                                              4.5
              Raw logs                                                                                                                                      4.0
Attr.




            Timing-only                   96.9                     7.3                           33                            4
         No counterfact.           94.8                                    8.4                    36                                                 2.9
                                                                                                                                     2.4
            Greedy edit                   96.9                      7.6                                42                                   1.6
Coord.




                                                                                                                               2
          One-shot joint        93.8                                 7.7                                         69
            No archive      92.7                             7.0                                 33
                                                                                                                               0
                                95                100 6             8            10   0                 50                           G       A        S     GA     AS     GS       GAS
                                                                                                                            BPR      100    100      98.4   100   98.4    98.4     98.4


Figure 6: Utility and breach counts of the ablations (a-c) and the disabled-layer subsets (d), complementing the held-out ASR in
Figure 4(d-e). Dashed lines mark the 95% BPR and 10% latency references. Means over three runs; breaches are summed over 48
attacker/deployment pairs per run.

Table 5: Capability vocabulary of the attack-effect summary.                                                Table 6: Information available to the two agents.
The last column lists the catalog control that can intercept
each capability.                                                                                                              Attacker                             Defender
                                                                                                Sees            Vulnerability description,            Attack-effect summaries, coverage
                                                                                                                reviewed fixtures and                 matrix, failed workflow assertions,
            Capability Raw operations                 Interceptable by
                                                                                                                prerequisites, own requests and       incumbent rules, catalog
            proc_exec execve, execveat (also via S1                                                             external feedback
                       posix_spawn)
                                                                                                Never sees      Oracles, defense logs, coverage       Held-out attacks, test workflows
            file_write openat (write/create), rename, S2, outside writable                                      results, policy text
                       unlink, chmod                  volumes only
                                                                                                Returns         Fixture choice and parameters in a    Typed edits with evidence and
            file_read  openat (read-only)             none                                                      request schema                        expected effect
            net_egress connect,     sendto      (non- S3
                       loopback)
            other      (collapsed to a count)         none                                               Table 7: Baseline applicability and configuration.

                                                                                                ID             Method         Layer Coverage          Configuration
the rules that stopped 𝑥 earlier are disabled. This reading assumes                             B1     ModSecurity + CRS [35]   G    15/16   Tuned paranoia, exclusions
that disabling a deny-only rule does not reroute 𝑥 onto a path that                             B2     Datadog RASP [13]        A    16/16   Tuned detection rules, thresholds
𝑟 would block.                                                                                  B3     OpenRASP [3]             A    16/16   Tuned detection rules, thresholds
Attribution Quality. Each run reports the fraction of masked re-                                B4     Kintsugi [37]           A+S   16/16   Reproduced per target
plays per outcome, the retries, and the fraction of unknown entries.                            B5     Tetragon [10]            S    16/16   One fixed service-wide policy
On 12 reference configurations with known coverage, such as du-
plicated rules or rules on disjoint paths, 141 of 144 entries agree                             Kintsugi inserts trigger markers into application code, a deployment
with the reference and the other 3 are unknown. Unknown entries                                 assumption that configuration-only controls avoid. The greedy and
do not affect the measured ASR, but a rule is declared redundant                                one-shot ablations share Janus’s candidates, model, evidence, and
only from rows without unknown entries.                                                         budget, and greedy search accepts an edit only if it keeps archive
Path Key. A verified attack is labeled with its entry point (route                              ASR and all thresholds.
and parameter), the outermost framing of its stream, and a hash of
the application frames between the deserialization call site and the                            G       Additional Results
sink. Two attacks with the same key follow the same exploitation                                All figures and tables are generated from one result file by scripts
path. Disjointness is checked on the keys of the catalog fixtures                               that also check denominators, failure inclusion, and the A-only
as registered; a permitted variation may produce a different key.                               lower bound.
An archived attack whose key equals that of a held-out attack
                                                                                                Per-Deployment Results. Figure 5 gives the integer counts be-
rediscovers that path. The two attacks may differ in payload, and
                                                                                                hind every aggregate. Janus’s residual failures are confined to J07,
the held-out attack is never added to the archive.
                                                                                                J11, and P02, which account for all four held-out successes and
E        Agent Inputs                                                                           all five breached pairs. B1-B3 are breached on every deployment
                                                                                                they cover and fail most on Jenkins, with 3-4 of 4 held-out attacks
Table 6 lists what each agent sees, never sees, and returns. Prompt                             succeeding on each of J05-J09. B5 fails a functionality test on 12 of
templates will be released with the artifact.                                                   16 deployments, B2 and B3 exceed the latency gate on 6 and 9, and
                                                                                                Janus fails a test only on P02 and stays within 8% latency.
F        Baselines
                                                                                                Utility of Ablations and Layer Subsets. Figure 6 reports what
The tunable baselines B1-B3 receive the same 12-trial allowance                                 Figure 4 omits. Every ablation keeps BPR between 92.7% and 97.9%,
on the evolved archive and are selected on validation workflows.
JANUS: Synthesizing Cross-Layer Defenses Against Web Deserialization Attacks                                  WWW ’27, May 10-14, 2027, Dublin, Ireland


below the full policy’s 98.4%, and breached pairs follow the held-             additively, and BPR is 100% whenever S is disabled because the full
out ASR ranking, from 15 of 144 for the full policy to 69 for one-             policy’s only failing test comes from an S rule.
shot synthesis. For the layer subsets, targeted latency grows nearly
