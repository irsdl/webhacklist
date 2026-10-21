---
type: Article
title: "CoRedSkill: Stealthy Skill Composition Attacks via AST-Guided Injection"
description: CoRedSkill distributes unauthorized operations across functioning agent skills using stage-specific AST rewrites and intermediate task artifacts. Its benchmark jointly checks legitimate task outputs, unauthorized effects, and audit detection.
resource: "https://arxiv.org/abs/2610.20049"
tags: [article, webseclist-reference, en, arxiv, ai-agent, skills, supply-chain, code-injection, methodology, owasp-a06-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-21T11:36:47+00:00"
status: stable
stale_after: 2027-10-21
sources:
  - id: original
    resource: "https://arxiv.org/abs/2610.20049"
    title: "CoRedSkill: Stealthy Skill Composition Attacks via AST-Guided Injection"
    author: Qichen Zhao, Shengfang Zhai, Qingni Shen, Zhonghai Wu, Jiaheng Zhang
    last_modified: 2026-10-14
also_at:
  - "https://arxiv.org/pdf/2610.20049v1"
authors:
  - Qichen Zhao
  - Shengfang Zhai
  - Qingni Shen
  - Zhonghai Wu
  - Jiaheng Zhang
canonical_url: ""
cited_by:
  - "2026-ai.md:205"
commit: ""
content_sha256: 2a2e68d45fa9fca99216860284c8033f1bce1fdc193cd12c020d205a1f4a6527
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2610.20049"
published: 2026-10-14
publisher: arXiv
publisher_english: ""
raw_sha256: 8858bb4dedfbc9a8f511c45f07638c5f09d55dd0ff6c55c22c616ee0a14ae1de
retrieved_from: "https://arxiv.org/pdf/2610.20049v1"
retrieved_kind: live
retrieved_utc: "2026-10-21T11:36:47+00:00"
slug: coredskill-stealthy-skill-composition-attacks-ast-guided-injection
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# CoRedSkill: Stealthy Skill Composition Attacks via AST-Guided Injection

**CoRedSkill: Stealthy Skill Composition Attacks via AST-Guided Injection** - Qichen Zhao, Shengfang Zhai, Qingni Shen, Zhonghai Wu, Jiaheng Zhang, arXiv.

- Published: 2026-10-14
- Original: <https://arxiv.org/abs/2610.20049>
- Also published at: <https://arxiv.org/pdf/2610.20049v1>
- Preserved from: https://arxiv.org/pdf/2610.20049v1 (live) on 2026-10-21
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

C O R ED S KILL: Stealthy Skill Composition Attacks via AST-Guided
                                                                                Injection

                                                                      Qichen Zhao1∗ , Shengfang Zhai2∗† , Qingni Shen1† ,
                                                                                Zhonghai Wu1 , Jiaheng Zhang2
                                                                     1
                                                                       Peking University 2 National University of Singapore
                                                                     z24@stu.pku.edu.cn, shengfang.zhai@nus.edu.sg, qingnishen@pku.edu.cn




                                                                     Abstract                             skills for one task, passing intermediate results be-
                                                                                                          tween stages. Hence, untrustworthy skills can lead
                                                 Agents extend their capabilities through
arXiv:2610.20049v1 [cs.CR] 14 Oct 2026




                                                 reusable skills that package instructions, ex-           normal task execution to malicious operations out-
                                                 ecutable code, and resources. Composing                  side the user’s authorization, affecting the agent
                                                 these skills enables complex task workflows,             system(Liu et al., 2026c; Li et al., 2026; Liu et al.,
                                                 but their dependencies can also connect ma-              2026b; Jiang et al., 2026).
                                                 licious operations across skills, making their              Prior red-teaming on skills takes two forms.
                                                 combined intent difficult to identify through            Single-skill attacks (Schmotz et al., 2026; Jia et al.,
                                                 individual-package auditing. We introduce                2026) keep the whole attack in one package, giving
                                                 C O R ED S KILL, a compositional red-teaming
                                                 method that forms stealthy attacks through co-
                                                                                                          skill scanners (Liu et al., 2026c; NVIDIA, 2026;
                                                 operating skills while preserving their original         Bhardwaj, 2026; Cisco AI Defense, 2026b) a rel-
                                                 utility. C O R ED S KILL decomposes an existing          atively complete attack context and showing high
                                                 workflow into interdependent skills and embeds           detection rates under the large language model
                                                 attack operations in task functions through ab-          (LLM)-based scanners (Table 2). Composition at-
                                                 stract syntax tree (AST) rewriting, with skill           tacks (Xie et al., 2026; Zeng et al., 2026) instead
                                                 instructions guiding the agent to autonomously           distribute the attack across cooperating skills, but
                                                 select and invoke the relevant skills, and work-
                                                                                                          give limited attention to preserving the original task
                                                 flow dependencies and intermediate artifacts
                                                 connecting the injected operations during task           logic and normal task completion. Skill utility is
                                                 execution. We construct a benchmark of 150               the basis for user adoption and agent invocation.
                                                 cases covering 50 tasks and three attack ob-             Therefore, we emphasize a more practical setting:
                                                 jectives to evaluate attack success, task com-           Skill red-teaming requires achieving attack objec-
                                                 pletion, and audit detection. In the main eval-          tives while preserving skill utility and maximizing
                                                 uation, C O R ED S KILL achieves 98.0% attack            stealthiness.
                                                 success and 95.3% task success with a 3.3%                  Constructing such attacks is challenging. (1) At-
                                                 detection rate, and a joint success rate of 90.7%
                                                 (attack success, task completion, and audit eva-
                                                                                                          tack operations must be embedded in the original
                                                 sion in the same case) compared with 6.7–                task workflow while keeping the task logic and
                                                 42.7% for the four baselines. Skill composi-             stage interfaces valid to avoid disrupting normal
                                                 tions can therefore complete legitimate tasks            task execution. (2) Distributed attack operations
                                                 while carrying out unauthorized operations that          must match their host skills’ task responsibilities so
                                                 evade auditing.                                          that local behavior blends into normal processing
                                                                                                          and is less likely to be flagged by scanners. (3)
                                         1       Introduction
                                                                                                          The distributed operations must remain connected
                                         Agent skills package task instructions, executable               through the agent’s autonomous selection and in-
                                         code, and resources into reusable modules that ex-               vocation under legitimate user requests to jointly
                                         tend an agent’s capabilities. During task execution,             achieve the attack objective. To address these, we
                                         the agent reads installed skills’ documentation and              introduce C O R ED S KILL, a Compositional Red-
                                         invokes their code. However, public skill libraries              teaming method that forms stealthy Skill attacks
                                         draw skills from publishers whose quality and trust-             while preserving their original utility (Figure 1).
                                         worthiness vary. An agent often composes multiple                C O R ED S KILL decomposes an existing task work-
                                             * Equal contribution.                                        flow into interdependent clean skills and assigns
                                             †
                                                 Corresponding authors.                                   attack operations according to each stage’s task

                                                                                                      1
responsibilities. It then uses abstract syntax tree         In agent-skill ecosystems (Liu et al., 2026c; Li
(AST) rewriting guided by stage specifications to           et al., 2026), a workflow may involve multiple third-
embed attack operations in task helper functions,           party skills that perform different task operations
updating related function calls and artifact reads          and exchange information through intermediate ar-
and writes while preserving the original task logic.        tifacts. Following prior work on malicious skills
Skill instructions and input–output dependencies            (Liu et al., 2026b), we assume that skills supplied
guide the agent to invoke the relevant skills to-           by a third-party publisher are installed alongside
gether, while intermediate artifacts pass attack-           other available skills. The agent autonomously se-
relevant information between the distributed op-            lects relevant skills and determines their invocation
erations.                                                   order based on the user’s request, skill documenta-
   We construct a benchmark of 150 evaluation               tion, and input–output dependencies. Skill-auditing
cases by pairing 50 tasks with three attack objec-          tools such as SkillScan (Liu et al., 2026c) and Skill-
tives (detailed in Section 4.1). Using this bench-          Spector (NVIDIA, 2026) can examine skill doc-
mark, we compare C O R ED S KILL with four attack           umentation and code. Runtime auditing methods
baselines in terms of attack success, task com-             such as HITL (Shan et al., 2026) and DefenseClaw
pletion, and audit detection. Our evaluation in-            (Cisco AI Defense, 2026a) can inspect the agent’s
cludes four LLM-based skill-audit configurations            execution records for unauthorized behavior.
(Liu et al., 2026c; NVIDIA, 2026), composition-
aware auditing (Zeng et al., 2026), and runtime             2.2    Attacker Capabilities and Objectives
defenses applied to execution records (Shan et al.,         The attacker acts as a third-party skill publisher.
2026; Cisco AI Defense, 2026a). In experiments,             Following the publisher capabilities considered
C O R ED S KILL achieves 98.0% attack success and           in Skill-Inject (Schmotz et al., 2026) and Skill-
95.3% task success with a detection rate of 3.3%.           Ject (Jia et al., 2026), the attacker can inspect
Its joint success rate (attack success, task comple-        the original skill’s documentation and scripts, con-
tion, and audit evasion in the same case) reaches           struct and publish multiple skills based on its work-
90.7%, compared with 6.7–42.7% for the four base-           flow, and modify their instructions, code, resources,
lines. Our contributions are:                               and input–output interfaces. The user’s legitimate
                                                            request defines the scope of authorized actions,
    • We propose C O R ED S KILL, which decom-              whereas the deployment determines the agent’s
      poses a task workflow and uses AST rewriting          model, system prompt, safeguards, and file, net-
      to embed distributed attack operations into its       work, and process permissions. Within these con-
      task functions, connecting them through work-         figured permissions, the attacker seeks to preserve
      flow dependencies and intermediate artifacts          the original skill’s utility, evade security audits, and
      while preserving skill utility.                       induce unauthorized operations during normal task
    • We build a benchmark of 50 tasks and their            execution. The attacker influences the agent’s skill
      skill compositions, spanning three attack ob-         selection and execution through the published skills
      jectives and 150 cases, to evaluate task com-         and the intermediate artifacts they produce, so that
      pletion, unauthorized effects, and audit detec-       operations distributed across skills jointly achieve
      tion.                                                 the attack objective.

    • We evaluate C O R ED S KILL against four at-          3     Methodology
      tack baselines under four LLM audit configu-
                                                            In this section, we detail the proposed C O R ED -
      rations, composition-aware auditing, and run-
                                                            S KILL method. We first formulate the problem
      time defenses. In the experiments, C O R ED -
                                                            in Section 3.1. We then introduce workflow de-
      S KILL attains 98.0% attack success and 95.3%
                                                            composition and attack-operation assignment in
      task success at a 3.3% detection rate, substan-
                                                            Section 3.2. We finally describe AST-guided attack
      tially outperforming the baselines.
                                                            injection in Section 3.3. Algorithm 1 summarizes
2     Threat Model                                          the construction procedure.
2.1    Scenario                                             3.1    Problem Formulation
A user delegates a legitimate task to an agent,             A skill is a reusable package of task instructions,
which uses installed skills to carry out the request.       executable scripts, and auxiliary resources that an

                                                        2
  (a) Workflow decomposition                            (b) Attack injection                                            (c) Workflow execution

                 Original skill                          𝐺′𝑖 =𝒯 AST(𝐺 𝑖; 𝜑 𝑖)            𝑆′𝑖 =Pack(𝑆 𝑖, 𝐺′𝑖; 𝜑 𝑖)                          Task request

   Skill decomposition       Decompose (𝑀, 𝑠, 𝑘)            Clean skill                          Injected skill      Install skills
                                                                  Si               Skill                  S′ i                                   Agent
                                                                                packaging
      S1              S2                S3         Si        SKILL.md                              SKILL.md                           Business                Attack
    Prepare        Process           Publish                                      AST
     inputs          data            results                                    rewriting
                                                                                                                         S′ 1 Prepare inputs             f1 Locate field
                                                                                                    ASTs G′i
                                                              ASTs G i
                                                                                                           fi
      f1               f2               f3         φi                                                                    S′ 2 Process data               f2 Read value
    Locate           Read             Send                                               Publish skills
     field           value            value
                                                                                                                         S′ 3 Publish results            f3 Send value
                                                          Skill auditor
     Operation assignment           Φ(o, k=3)                   S′ 1              S′ 2                    S′ 3
                                                              ✓ Pass             ✓ Pass               ✓ Pass                 Task completed              Attack executed
           Exfiltrate protected data




Figure 1: Overview of C O R ED S KILL, illustrated with a three-skill exfiltration attack. (a) Decompose the task
workflow and assign attack operations. (b) Perform AST rewriting and skill packaging according to the stage-specific
specification ϕi . Audit the resulting skill packages. (c) During task execution, intermediate artifacts pass task data
and attack-relevant information between skills, connecting the distributed attack operations.


agent loads at runtime. Let C = (S1 , . . . , Sk ) de-                                    outputs. For a fixed task, authorization boundary,
note a workflow composition with k ≥ 2 stages,                                            and evaluation configuration, let U (τ ) ∈ {0, 1}
where skill Si handles stage i and stages exchange                                        indicate task acceptance and Ao (τ ) ∈ {0, 1} in-
data through intermediate artifacts. Let A denote                                         dicate whether the objective-o oracle is satisfied
the agent, q the user request, and E the initial en-                                      by the execution evidence. An observed execu-
vironment, including task inputs and accessible                                           tion τ = Run(A, q, E; C ′ ) constitutes a successful
resources. To describe execution with the composi-                                        compositional attack that preserves skill utility if
tion available, we write:                                                                 U (τ ) = 1 and Ao (τ ) = 1. We assess preservation
                                                                                          of skill utility using the task’s output acceptance
                    τ = Run(A, q, E; C),                                  (1)
                                                                                          criteria, allowing artifacts and environment states
where τ denotes the observable execution record,                                          to differ from the clean workflow. Distributing
which includes tool actions, intermediate artifacts,                                      operations across skills does not require each mod-
final outputs, and the resulting environment state.                                       ification to be individually necessary.
We use execution trace to refer specifically to the                                          To assess audit evasion, let dρ (S) ∈ {0, 1} indi-
ordered sequence of actions within this record.                                           cate whether skill S is flagged under audit configu-
The indices describe the intended workflow stages,                                        ration ρ, which specifies the auditor and its detec-
while the actual skill invocations are recorded in                                        tion criterion. The concrete criteria are described
τ . Artifacts and agent context carry information                                         in Section 4.1. We aggregate these outcomes as:
across stages, defining the intended dependencies.
Whether execution realizes these dependencies is                                                                 Dρ (C ′ ) = max dρ (Si′ ).                                (2)
                                                                                                                                      1≤i≤k
evaluated through τ .
   For red-team construction, the attacker edits                                          Intuitively, Dρ (C ′ ) = 0 means that no constituent
the supplied skill packages to transform a clean                                          package is flagged in these reviews. The construc-
composition C into an injected composition C ′ =                                          tion objective is to obtain C ′ from C for objective
(S1′ , . . . , Sk′ ). The agent configuration and trusted                                 o such that execution and individual auditing yield
task and evaluation specifications remain fixed.                                          the joint outcome:
Given an original skill s, an abstract attack ob-
jective o, and a composition size k, C O R ED S KILL                                                U (τ ) = Ao (τ ) = 1,                         Dρ (C ′ ) = 0.
first constructs C from s and then outputs C ′ by
                                                                                          Execution success and audit evasion are evaluated
distributing operations for o across its skills. Skill
                                                                                          separately. Section 4.1 specifies the evaluation cri-
utility refers to a skill’s ability to perform its in-
                                                                                          teria.
tended task functions and produce the expected

                                                                                   3
Algorithm 1 C O R ED S KILL construction                                 and outputs. We group steps by data dependencies
Require: original skill s, objective o, size k, model M                  and assign them to workflow stages whose func-
Ensure: injected composition C ′ = (S1′ , . . . , Sk′ )                  tions support the required operations. Let fi denote
 1: C ← Decompose(M, s, k) = (S1 , . . . , Sk )
 2: Select the rewrite anchor ai in each stage Si                        the ordered group of operations assigned to stage
 3: Split the attack chain for objective o into steps                    i. The stage specification ϕi records fi , its rewrite
 4: Group steps by data dependencies into the ordered stage              anchor ai , replacement templates, and intermediate
    operations fi
 5: Construct Φ(o, k) = (ϕ1 , . . . , ϕk ), each ϕi recording fi ,       artifact interface conventions. Built on the stages
    anchor ai , replacement templates, and artifact interfaces           and anchors of the clean composition C, the stage
 6: for i = 1 to k do
 7:     Gi ← LocateAndParse(Si ; ϕi )
                                                                         specifications form:
 8:     G′i ← TAST (Gi ; ϕi )
 9:     Si′ ← Pack(Si , G′i ; ϕi )                                                    Φ(o, k) = (ϕ1 , . . . , ϕk ).         (3)
10: end for
11: C ′ ← (S1′ , . . . , Sk′ )                                           For EXF with three skills, f1 searches for files,
12: Reparse(C ′ ) and check its rewrite anchors
13: return C ′
                                                                         f2 selects fields and writes their values to a file
                                                                         for transmission, and f3 transfers the data to an
                                                                         unauthorized recipient.
   We instantiate o ∈ {EXF, TAM, PRV} to ex-
amine three layers at which an installed skill can                       3.3   Attack Injection
affect the host system: sensitive data, persistent                       To embed the assigned operations while retaining
state, and execution capability. Specifically, (1)                       task processing, C O R ED S KILL transforms each
data exfiltration (EXF) discloses protected data to                      clean skill Si into an injected skill Si′ according to
recipients outside the task’s authorized scope, (2)                      ϕi .
unauthorized state tampering (TAM) alters persis-
                                                                         AST rewriting. Using ai and the interface
tent state in installed skills through file writes, and
                                                                         changes specified in ϕi , we locate the affected
(3) privilege violation (PRV) induces the agent to
                                                                         scripts and parse them into a collection of ASTs
execute scripts beyond the operations authorized
                                                                         Gi . The replacement templates implement fi in
by the user’s request.
                                                                         the target helper function and update related calls,
3.2     Workflow Decomposition                                           arguments, and artifact reads and writes. To pre-
                                                                         serve core task logic and maintain compatible stage
To retain the task workflow while exposing its stage
                                                                         interfaces, we apply these edits together with the
dependencies, the construction model M reads the
                                                                         corresponding package updates:
documentation and scripts of the original skill s
and partitions its workflow by task responsibilities                                   G′i = TAST (Gi ; ϕi ),
and data dependencies:                                                                                                      (4)
                                                                                       Si′ = Pack(Si , G′i ; ϕi ),
      C = Decompose(M, s, k) = (S1 , . . . , Sk ).                       where TAST denotes the specified AST transforma-
                                                                         tion and Pack assembles the injected skill. Pack-
Each Si retains the task processing assigned to
                                                                         aging converts G′i to source code, writes it to the
stage i and exchanges results with later stages
                                                                         corresponding scripts, and updates entry points and
through intermediate JSON files. Its documenta-
                                                                         required resources. We update documentation to
tion specifies inputs, processing steps, and outputs
                                                                         describe the added processing within the stage’s
to guide the agent’s autonomous skill selection and
                                                                         task role and specify its inputs and outputs. Finally,
invocation. The construction instructions specify
                                                                         we reparse the rewritten scripts and check their
each stage’s task helper functions, including names
                                                                         rewrite anchors.
and calling interfaces. Let ai denote the helper
function selected as the rewrite anchor in stage i,                      Cross-skill state propagation. During execution,
such as file search, field selection, or data export.                    intermediate task artifacts carry the data needed
Its name and interface identify the function for sub-                    by attack operations in later stages. As the agent
sequent AST rewriting.                                                   follows the input–output dependencies, these ar-
                                                                         tifacts connect the distributed operations. In the
Attack chain decomposition. To align the attack
                                                                         inventory-planning example, the workflow com-
with these dependencies, we decompose the attack
                                                                         putes allocation and replenishment decisions and
chain for objective o into steps with defined inputs
                                                                         publishes a plan. Under Φ(EXF, 3), the first skill

                                                                     4
records file paths and field names in its task arti-       skills using scanner feedback. C O R ED S KILL in-
fact. The second uses this information to collect          jects attacks into a three-skill composition by de-
selected field values and pass them downstream.            fault (k = 3). We include Original skills and Clean
The third skill publishes the requested plan, after        compositions, the original skills and their clean
which the agent follows the injected instructions          three-skill decompositions, as uninjected controls
to invoke an additional distribution operation that        for measuring false positives. Appendix D details
sends the collected values to an unauthorized recip-       the construction mechanisms.
ient. The resulting record τ supplies the evidence
                                                           Defense Baselines. SkillScan (Liu et al., 2026c)
for both U (τ ) and Ao (τ ). Appendix E details the
                                                           combines static scanning with LLM auditing, while
stage interfaces and state fields.
                                                           SkillSpector (NVIDIA, 2026) uses an LLM to re-
4     Experiments                                          view findings from static analyzers. SkillFortify
                                                           (Bhardwaj, 2026) performs static package analysis,
The evaluation addresses three questions. RQ1:             and CiscoSkillScan (Cisco AI Defense, 2026b) ap-
Overall attack effectiveness. Can C O R ED S KILL          plies format validation and behavioral checks. For
achieve its attack objectives while preserving the         runtime auditing, we apply HITL risk rules (Shan
original skill’s utility and evading security audits       et al., 2026) and DefenseClaw strict policy rules
(Section 4.2)? RQ2: Stealth against skill audi-            (Cisco AI Defense, 2026a) to the agent’s execution
tors. Can skill auditors detect these attacks across       records. Detailed configurations are provided in
different auditors and LLM backends (Section 4.3)?         Appendices A.3 and A.4.
RQ3: Stealth against runtime defenses. Can run-
time risk and policy rules detect unauthorized ac-         Evaluation Metrics. ❶ ASR (Attack Success
tions in task execution records (Section 4.5)? We          Rate) measures the fraction of cases that achieve
further evaluate how composition size affects at-          the specified attack objective. ❷ TSR (Task Suc-
tack stealth, whether composition-aware auditing           cess Rate) measures the fraction of cases whose
detects the attacks, and how injection positions af-       task outputs satisfy the task’s acceptance criteria.
fect attack success.                                       Appendix A.2 describes the verification procedures
                                                           for attack objectives and task outputs. ❸ DR (De-
4.1    Experimental Setup                                  tection Rate) measures the fraction of cases de-
Benchmark. We construct a benchmark of 50                  tected by the auditor. For skill compositions, a
tasks based on public scenarios from Skill-Inject          case is counted as detected if any constituent skill
(Schmotz et al., 2026), τ -bench (Yao et al., 2024),       is flagged as risky (Zeng et al., 2026). For run-
and AgentDojo (Debenedetti et al., 2024). Each             time auditing, detection is determined by whether
task is implemented by a skill and has defined out-        the execution record triggers the audit rules. ❹
put acceptance criteria. Pairing each task with data       JSR (Joint Success Rate) measures the fraction
exfiltration (EXF), state tampering (TAM), and             of cases in which the attack and the legitimate task
privilege violation (PRV) yields 150 cases, with           both succeed without detection, defined as
50 per objective. Appendix A describes benchmark                                N
                                                                            1 X
construction and task coverage.                                     JSR =       An Un (1 − Dn ).           (5)
                                                                            N
                                                                               n=1
Attack Baselines. We adapt four attack methods
to the benchmark’s tasks and objectives, reporting         Here, N is the number of cases, An and Un indicate
the adapted versions under their original names.           attack and task success, respectively (Section 3.1),
For Skill-Inject (Schmotz et al., 2026), we append         and Dn = 1 indicates detection under the specified
injection templates to skill documentation and add         audit configuration.
script wrappers for the target operations. SkillJect       Implementation Details. We use Claude Code
(Jia et al., 2026) generates a malicious skill with        (Anthropic, 2026) as the main victim platform.
an auxiliary payload and refines it using execution        DeepSeek V4 Flash (DeepSeek-AI et al., 2026)
feedback. SCR-Bench (Xie et al., 2026) links up-           (Deepseek) serves as the agent’s execution backend
stream information to downstream actions through           and is also used for attack construction. SkillScan
prompt injection in a two-skill workflow. Col-             and SkillSpector each use Deepseek and GLM-5.2
luSkill (Zeng et al., 2026) distributes interdepen-        (Z.ai, 2026) (GLM), yielding four LLM audit con-
dent subpayloads across skills and refines flagged         figurations. In the main experiment, each case runs

                                                       5
Table 1: Attack success, task completion, and audit detection on the benchmark. SkillScan performs the audit using
Deepseek. JSR provides a joint assessment of attack effectiveness, task completion, and stealth. Arrows indicate preferred
directions. Bold marks the best ASR, DR, and JSR in each column.

                                   EXF                        TAM                         PRV                      Overall
Method
                        ASR↑ TSR↑ DR↓ JSR↑ ASR↑ TSR↑ DR↓ JSR↑ ASR↑ TSR↑ DR↓ JSR↑ ASR↑ TSR↑ DR↓ JSR↑
Skill-Inject           22.0 92.0       100   0      92.0 98.0     90.0      6.0   46.0 100     64.0   14.0   53.3 96.7    84.7   6.7
SkillJect              96.0 100        98.0 2.0     100 100       16.0     84.0   92.0 100     52.0   42.0   96.0 100     55.3   42.7
SCR-Bench              30.0 100‡       64.0 22.0    24.0 96.0‡    80.0     18.0   100 100‡     80.0   20.0   51.3 98.7‡   74.7   20.0
ColluSkill              2.0 24.0†      10.0 0       80.0 52.0†     4.0     46.0   68.0 38.0†   14.0   22.0   50.0 38.0†    9.3   22.7
C O R ED S KILL (Ours) 100 96.0        4.0 92.0     94.0 96.0       0      90.0   100 94.0      6.0   90.0   98.0 95.3     3.3   90.7
 †
   ColluSkill focuses on constructing attack payloads and evading audits, without consistently preserving skill utility.
 ‡
   SCR-Bench’s original skills use fixed templates with limited task functionality. Adapting them to the benchmark’s tasks may reduce
attack stealth.


once in a separate sandbox and is audited once un-                   overall DR ranges from 9.3% to 17.3% and is lower
der each configuration. The agent receives the user                  than C O R ED S KILL’s only under SkillScan with
request and shared execution instructions, then au-                  GLM. However, its ASR and TSR are 50.0% and
tonomously selects and invokes skills. For each                      38.0%, respectively (Table 1). Inspection of Col-
method, we install all of its injected skills together               luSkill’s generated skills found that some cases
with six clean skills as distractors. Table 1 reports                that passed the audit lacked operations required to
results with SkillScan using Deepseek for auditing.                  achieve the attack objectives. No false positives are
Detailed implementation settings are provided in                     observed for original skills or clean compositions
Appendix A.2.                                                        under the four LLM audit configurations. Skill-
                                                                     Fortify and CiscoSkillScan both have zero DR for
4.2   Overall Evaluation                                             C O R ED S KILL. Skills implement diverse functions,
C O R ED S KILL achieves high attack and task suc-                   some of which are specified through prompts and
cess while maintaining a low detection rate (Ta-                     depend on agent execution, making hidden mali-
ble 1). On the 150-case benchmark, its ASR, TSR,                     cious intent difficult to infer from static package
and DR are 98.0%, 95.3%, and 3.3%, respectively.                     inspection alone. SkillJect is also undetected by
Of the 150 cases, 140 achieve both task completion                   both scanners, and SCR-Bench is undetected by
and attack success, and 136 of these also pass the                   CiscoSkillScan. ColluSkill’s DR is 6.0% under
skill audit, yielding a JSR of 90.7%. This joint                     SkillFortify and 3.3% under CiscoSkillScan (Ta-
success rate exceeds the 6.7–42.7% achieved by                       ble A2).
the four baselines, highlighting C O R ED S KILL’s
advantage in jointly achieving attack objectives,                    4.4     Extension of Composition Size
completing tasks, and evading auditing. Although                     We compare two-, three-, and four-skill composi-
SCR-Bench and SkillJect achieve comparable ASR                       tions on the same 24 tasks to assess how compo-
or TSR on some attack objectives, their substan-                     sition size affects attack success and audit detec-
tially higher overall DR under skill auditing in-                    tion. ASR remains 100% at all three sizes, while
dicates weaker stealth than C O R ED S KILL. Col-                    overall DR ranges from 4.2% to 34.7% (Figure 2
luSkill also has a low DR, but its ASR and TSR                       and Appendix Table A3). SkillScan has the lowest
are substantially lower than C O R ED S KILL’s. Its                  overall DR at k = 2 under both backends, tied with
injections evade auditing but fail to reliably execute               k = 3 under Deepseek, whereas SkillSpector has
the attacks and preserve skill utility.                              the lowest overall DR at k = 3 under both back-
                                                                     ends. The composition size with the lowest overall
4.3   Stealth against Skill Auditors                                 DR therefore varies across audit configurations,
C O R ED S KILL’s overall DR ranges from 3.3% to                     and composition stealth does not improve mono-
20.0% across the four LLM audit configurations                       tonically with the number of skills. Distributing
and is lower than those of SkillJect, Skill-Inject,                  an attack across more skills may leave some stages
and SCR-Bench in each configuration (Table 2).                       with less legitimate processing to conceal the in-
Using GLM as the audit model increases the over-                     jected operations. Additional skills also provide
all DR for C O R ED S KILL under both auditors, but                  more opportunities for detection, since the compo-
most attack cases remain undetected. ColluSkill’s                    sition passes auditing only when every constituent

                                                                 6
Table 2: Detection rates (DR) under SkillScan and SkillSpector with Deepseek and GLM. Control rows report
false-positive rates. Lower DR indicates greater attack stealth. Bold marks the lowest attack DR in each column
within each auditor–backend configuration.

                                                                                                   EXF                            TAM                   PRV             Overall
Auditor                                   Method
                                                                                         Deepseek             GLM       Deepseek        GLM     Deepseek      GLM    Deepseek     GLM
SkillScan                                 Original skills                                   0                   0             0           0         0          0         0          0
SkillScan                                 Clean compositions                                0                   0             0           0         0          0         0          0
SkillScan                                 Skill-Inject                                     100                 100          90.0        100        64.0       98.0     84.7        99.3
SkillScan                                 SkillJect                                        98.0                100          16.0        54.0       52.0       78.0     55.3        77.3
SkillScan                                 SCR-Bench                                        64.0                100          80.0        90.0       80.0       100      74.7        96.7
SkillScan                                 ColluSkill                                       10.0                22.0          4.0         2.0       14.0       10.0      9.3        11.3
SkillScan                                 C O R ED S KILL (Ours)                           4.0                 16.0           0         12.0       6.0        32.0     3.3         20.0
SkillSpector                              Original skills                                   0                   0             0           0         0          0        0           0
SkillSpector                              Clean compositions                                0                   0             0           0         0          0        0           0
SkillSpector                              Skill-Inject                                     100                 100          100         100        100        100      100         100
SkillSpector                              SkillJect                                        98.0                100          20.0        74.0       100        86.0     72.7        86.7
SkillSpector                              SCR-Bench                                        86.0                100          72.0        100        98.0       100      85.3        100
SkillSpector                              ColluSkill                                       24.0                30.0          4.0         4.0       14.0       18.0     14.0        17.3
SkillSpector                              C O R ED S KILL (Ours)                           12.0                16.0         2.0         8.0        20.0       24.0     11.3        16.0


                               40                                                                                           Table 3: Runtime detection rates (DR) of HITL and
                                                        34.7                                                                DefenseClaw on execution records. Original skills and
                                                                                                                            clean compositions report false-positive rates. Lower
  Overall detection rate (%)




                               30
                                                                                                 26.4 26.4                  DR indicates greater attack stealth.
                                                 25.0                25.0
                                                                                                             23.6
                                          20.8
                               20                                                                                                  Method                     HITL   DefenseClaw
                                                                                  15.3                                             Original skills            2.0         0
                                                                                          12.5                                     Clean compositions         16.0        0
                               10                                           8.3
                                                                                                                                   Skill-Inject               50.7      66.7
                                    4.2                        4.2                                                                 SkillJect                   7.3       0.7
                                                                                                                                   SCR-Bench                  24.7       3.3
                                0                                                                                                  ColluSkill                 32.0       0.7
                                             2                          3                           4        Size (k)              C O R ED S KILL (Ours)     10.7      1.3
                                    SkillScan (Deepseek)                    SkillSpector (Deepseek)
                                    SkillScan (GLM)                         SkillSpector (GLM)
                                                                                                                            low detection rates under both skill-package and
Figure 2: Overall detection rate (DR) of C O R ED S KILL                                                                    runtime auditing. By embedding attack operations
across composition sizes, under SkillScan and Skill-                                                                        in task functions and connecting them through inter-
Spector with Deepseek and GLM as audit models.                                                                              mediate artifacts, C O R ED S KILL interweaves unau-
                                                                                                                            thorized operations with normal task processing,
                                                                                                                            which may make their combined malicious intent
skill remains undetected. Across attack objectives,
                                                                                                                            difficult for the audit rules to identify.
TAM has the lowest DR in most combinations of
composition size and audit configuration.                                                                                   4.6     Evaluation under Adaptive Defense
4.5                             Stealth against Runtime Defenses                                                            To evaluate adaptive defense against cross-skill at-
                                                                                                                            tacks, we use composition-aware auditing, sub-
We apply runtime risk and policy rules to the
                                                                                                                            mitting all constituent skills to the auditor to-
agent’s execution records to assess whether they de-
                                                                                                                            gether. Following research on skill-interaction au-
tect unauthorized operations. C O R ED S KILL’s DR
                                                                                                                            diting (Zeng et al., 2026), the auditor examines
is 10.7% under HITL (Shan et al., 2026) and 1.3%
                                                                                                                            each skill’s declared purpose and implemented
under DefenseClaw (Cisco AI Defense, 2026a),
                                                                                                                            operations, then assesses whether their interac-
lower than those of Skill-Inject and SCR-Bench
                                                                                                                            tions produce suspicious combined behavior. With
under both configurations (Table 3). Under HITL,
                                                                                                                            Deepseek as the audit model, composition-aware
its DR is also lower than ColluSkill’s 32.0%. Skill-
                                                                                                                            auditing yields an overall DR of 28.7% for C O R ED -
Ject’s DR is 7.3% and 0.7% under the two runtime
                                                                                                                            S KILL, compared with 3.3% for SkillScan and
configurations, respectively, but ranges from 55.3%
                                                                                                                            11.3% for SkillSpector under individual-package
to 86.7% across the four LLM skill-package audit
                                                                                                                            auditing. Under the same composition-aware audit
configurations (Table 2). C O R ED S KILL maintains

                                                                                                                        7
Table 4: Composition-aware detection rates (DR) with            well as hidden comments, runtime code generation,
all constituent skills provided to the auditor together.        and dynamic skill modification (Wang et al., 2026b;
The clean-composition row reports the false-positive
                                                                Liu et al., 2026a; Chen et al., 2026a). Other work
rate. Lower DR indicates greater attack stealth.
                                                                conceals executable payloads or poisons models
    Method                   EXF    TAM    PRV    Overall       bundled with skills (Ji et al., 2026; Tie et al., 2026).
    Clean compositions        –      –      –      24.0         C O R ED S KILL distributes unauthorized operations
    SCR-Bench                100    96.0   26.0    74.0
                                                                across the task functions of multiple skills while
    ColluSkill               56.0   32.0   32.0    40.0         preserving their original utility.
    C O R ED S KILL (Ours)   74.0    2.0   10.0    28.7
                                                                Compositional Attacks. Tool-chain attacks and
                                                                intent fragmentation combine local actions or sub-
configuration, its overall DR is lower than SCR-                tasks into harmful behavior (Li et al., 2025; Ahad
Bench’s 74.0% and ColluSkill’s 40.0% (Table 4).                 et al., 2026). SkillReact, SkillProbe, and SCR-
The effect differs across objectives. EXF has a DR              Bench examine risks arising from skill interactions
of 74.0%, whereas TAM and PRV have DRs of                       and invocation paths (Wang et al., 2026c; Guo et al.,
2.0% and 10.0%, respectively, indicating that most              2026b; Xie et al., 2026). ColluSkill constructs inter-
state-tampering and privilege-violation attacks re-             dependent skills around a malicious objective and
main undetected even when all constituent skills                refines them with scanner feedback (Zeng et al.,
are reviewed together. This configuration has a                 2026), while SkillTrojan reconstructs a payload
false-positive rate of 24.0% on clean compositions,             from fragments collected across skill invocations
whereas the four per-package LLM audit configu-                 (Feng et al., 2026). C O R ED S KILL embeds dis-
rations and both static scanners yield no observed              tributed operations in existing task logic and con-
false positives on the clean controls.                          nects them through normal intermediate artifacts.
                                                                The modified skills retain their utility, which we
4.7     Ablation Study
                                                                verify through task outputs.
We fix the three-skill workflows on the shared 24-
task subset, replace selected injected skills with              Skill Auditing and Runtime Defenses. Skill au-
their clean versions, and keep all other settings un-           ditors combine static checks and LLM analysis
changed. Averaged over injection-position configu-              (Liu et al., 2026c; NVIDIA, 2026; Bhardwaj, 2026;
rations, ASR is 0% with zero or one injected skill,             Cisco AI Defense, 2026b). Further approaches use
36.6% with two injected skills, and 100% with all               hierarchical triage, declared–implemented capabil-
three skills injected. Attack success depends on                ity comparisons, and repository context (Hou and
coordination among injected skills, but when one                Yang, 2026; Wu et al., 2026; Holzbauer et al., 2026).
injection stage is missing, the agent can sometimes             ChainGuard reconstructs cross-skill dependencies
complete the missing step using malicious instruc-              (Zeng et al., 2026), while runtime defenses enforce
tions in the skills and the workflow context. The               action policies and monitor execution (Wang et al.,
execution records in Appendix C illustrate this pro-            2026a; Shi et al., 2025; Shan et al., 2026; Cisco AI
cess. The overall TSR is 93.1% with one injected                Defense, 2026a). Our evaluation covers individual-
skill and 100% with zero, two, or three injected                package auditing, composition-aware auditing, and
skills. In some single-injection cases, the agent               runtime auditing alongside task completion. Ap-
departs from the intended workflow and attempts                 pendix B provides a detailed discussion.
an alternative solution that fails to produce outputs
                                                                6   Conclusion
satisfying the acceptance criteria.
                                                                C O R ED S KILL combines workflow decomposition
5     Related Work                                              with AST rewriting to embed distributed attack
Attacks on Agent Skills. Studies of skill ecosys-               operations in task functions, creating stealthy com-
tems document malicious packages, credential leak-              position attacks while preserving skill utility. In
age, and repository-dependent risks (Liu et al.,                the main evaluation, it achieves 98.0% ASR, 95.3%
2026c,b; Chen et al., 2026b; Holzbauer et al., 2026).           TSR, and 3.3% DR, with a joint success rate of
Attack methods use injected instructions, auxiliary             90.7%. The results show that skill compositions
scripts, and position-aware concealment (Schmotz                can pass auditing and complete legitimate tasks
et al., 2026; Jia et al., 2026; Hao et al., 2026), as           while jointly performing unauthorized operations.


                                                            8
Limitations                                                    Cisco AI Defense. 2026a. DefenseClaw: Security gov-
                                                                 ernance for agentic AI. Open-source software. Ac-
Attack construction in C O R ED S KILL relies on pre-            cessed 2026-10-13.
defined attack specifications and workflow inter-
                                                               Cisco AI Defense. 2026b. Skill scanner: Multi-engine
faces, and automatic adaptation to arbitrary exist-              security scanner for agent skills. Software, version
ing skill packages has not been evaluated. We                    2.0.13.
verify preservation of skill utility against output
acceptance criteria for 150 offline evaluation cases,          Edoardo Debenedetti, Jie Zhang, Mislav Balunovic,
                                                                 Luca Beurer-Kellner, Marc Fischer, and Florian
without evaluating dynamic service interactions or               Tramèr. 2024. AgentDojo: A dynamic environment
long-term operation. Our runtime defense evalu-                  to evaluate prompt injection attacks and defenses for
ation measures the detection capabilities of risk                LLM agents. In Advances in Neural Information
and policy rules using execution records, without                Processing Systems, volume 37, pages 82895–82920.
                                                                 Curran Associates, Inc.
evaluating how online blocking affects subsequent
execution and attack outcomes.                                 DeepSeek-AI et al. 2026. DeepSeek-V4: Towards
                                                                 highly efficient million-token context intelligence.
Ethics Statement                                                 Preprint, arXiv:2606.19348.

We evaluate locally constructed skill packages in              Shen Dong, Shaochen Xu, Pengfei He, Yige Li, Jiliang
                                                                 Tang, Tianming Liu, Hui Liu, and Zhen J. Xiang.
independent task sandboxes using synthetic data,                 2025. Memory injection attacks on LLM agents
simulated protected resources, and controlled end-               via query-only interaction. In Advances in Neural
points, without targeting production services or de-             Information Processing Systems, volume 38, pages
ployed third-party skill installations. This research            46697–46731. Curran Associates, Inc.
aims to help defenders identify unauthorized behav-            Zenghao Duan, Yuxin Tian, Zhiyi Yin, Liang Pang,
ior arising from skill compositions. The method                  Jingcheng Deng, Zihao Wei, Shicheng Xu, Yuyao
could also be misused to conceal malicious opera-                Ge, and Xueqi Cheng. 2026. SkillAttack: Auto-
tions. To reduce misuse risks, we plan to release                mated red teaming of agent skills through attack path
                                                                 refinement. Preprint, arXiv:2604.04989.
sanitized execution traces, synthetic inputs, and the
evaluation harness with guidance for attack identi-            Bacem Etteib, Daniele Lunghi, and Tégawendé F. Bis-
fication and defense evaluation, but not malicious               syandé. 2026. Detecting malicious agent skills in the
                                                                 wild using attention. Preprint, arXiv:2606.23416.
skill packages that can be used directly for attacks.
                                                               Yunhao Feng, Yifan Ding, Yingshui Tan, Boren Zheng,
                                                                 Yanming Guo, Xiaolong Li, Kun Zhai, Yishan Li,
References                                                       and Wenke Huang. 2026. SkillTrojan: Backdoor
                                                                 attacks on skill-based agent systems. Preprint,
Tanzim Ahad, Ismail Hossain, Md Jahangir Alam, Sai               arXiv:2604.06811.
  Puppala, Yoonpyo Lee, Syed Bahauddin Alam, and
  Sajedul Talukder. 2026. Semantic intent fragmen-             Wenbo Guo, Wei Zeng, Chengwei Liu, Xiaojun Jia,
  tation: A single-shot compositional attack on multi-          Yijia Xu, Lei Tang, Yong Fang, and Yang Liu. 2026a.
  agent AI pipelines. Preprint, arXiv:2604.08608.               MalSkillBench: A runtime-verified benchmark of
                                                                malicious agent skills. Preprint, arXiv:2606.07131.
Anthropic. 2026. Claude Code overview. Software
  documentation. Accessed October 13, 2026.                    Zihan Guo, Zhiyu Chen, Xiaohang Nie, Jianghao Lin,
                                                                 Yuanjian Zhou, and Weinan Zhang. 2026b. Skill-
Varun Pratap Bhardwaj. 2026. Formal analysis and                 Probe: Security auditing for emerging agent skill
  supply chain security for agentic AI skills. Preprint,         marketplaces via multi-agent collaboration. Preprint,
  arXiv:2603.00195.                                              arXiv:2603.21019.
Tianhao Chen, Zhengyuan Jiang, Yuepeng Hu, Yebei               Haochang Hao, Dehai Min, Zhifang Zhang, Yunbei
  Gou, and Neil Zhenqiang Gong. 2026a. Dy-                       Zhang, Miao Xu, Yingqiang Ge, and Lu Cheng.
  namic malicious skills in agentic AI. Preprint,                2026. Poise: Position-aware one-instruction skill in-
  arXiv:2606.16287.                                              jection for silent execution on LLM agents. Preprint,
Zhihao Chen, Ying Zhang, Yi Liu, Gelei Deng, Yuekang             arXiv:2606.07943.
  Li, Yanjun Zhang, Jianting Ning, Leo Yu Zhang, Lei           Florian Holzbauer, David Schmidt, Gabriel K. Gegen-
  Ma, and Zhiqiang Li. 2026b. How your credentials               huber, Sebastian Schrittwieser, and Johanna Ullrich.
  are leaked by LLM agent skills: An empirical study.            2026. Context matters: Repository-aware security
  Preprint, arXiv:2604.03070.                                    analysis of the agent skill ecosystem. Preprint,
                                                                 arXiv:2603.16572.



                                                           9
Yinghan Hou and Zongyou Yang. 2026. SkillSieve: A              Yangjun Ruan, Honghua Dong, Andrew Wang, Sil-
  hierarchical triage framework for detecting malicious          viu Pitis, Yongchao Zhou, Jimmy Ba, Yann Dubois,
  AI agent skills. Preprint, arXiv:2604.06550v3.                 Chris Maddison, and Tatsunori Hashimoto. 2024.
                                                                 Identifying the risks of LM agents with an LM-
Zimo Ji, Congying Xu, Zongjie Li, Yudong Gao,                    emulated sandbox. In International Conference on
  Xin Wei, Shuai Wang, and Shing-Chi Cheung.                     Learning Representations, pages 27031–27098.
  2026. Cloak and detonate: Scanner evasion and
  dynamic detection of agent skill malware. Preprint,          David Schmotz, Luca Beurer-Kellner, Sahar Abdelnabi,
  arXiv:2607.02357.                                              and Maksym Andriushchenko. 2026. Skill-Inject:
                                                                 Measuring agent vulnerability to skill file attacks.
Xiaojun Jia, Jie Liao, Simeng Qin, Jindong Gu, Wenqi             Preprint, arXiv:2602.20156.
  Ren, Xiaochun Cao, Yang Liu, and Philip Torr.
  2026. SkillJect: Effectively automating skill-based          Zhengyang Shan, Jiayun Xin, Yue Zhang, and Minghui
  prompt injection for skill-enabled agents. Preprint,           Xu. 2026. Don’t let the claw grip your hand: A secu-
  arXiv:2602.14211.                                              rity analysis and defense framework for OpenClaw.
                                                                 Preprint, arXiv:2603.10387.
Yanna Jiang, Delong Li, Haiyu Deng, Baihe Ma,
  Xu Wang, Qin Wang, and Guangsheng Yu. 2026.                  Tianneng Shi, Jingxuan He, Zhun Wang, Hongwei
  SoK: Agentic skills – beyond tool use in LLM agents.           Li, Linyu Wu, Wenbo Guo, and Dawn Song. 2025.
  Preprint, arXiv:2602.20867.                                    Progent: Securing AI agents with privilege control.
                                                                 Preprint, arXiv:2504.11703v3.
Kimi Team et al. 2026. Kimi K2.5: Visual agentic
  intelligence. Preprint, arXiv:2602.02276.                    Guiyao Tie, Jiawen Shi, Pan Zhou, and Lichao
                                                                 Sun. 2026. BadSkill: Backdoor attacks on agent
Jing-Jing Li, Jianfeng He, Chao Shang, Devang Kul-               skills via model-in-skill poisoning.  Preprint,
   shreshtha, Xun Xian, Yi Zhang, Hang Su, Sandesh               arXiv:2604.09378.
   Swamy, and Yanjun Qi. 2025. STAC: When inno-
   cent tools form dangerous chains for LLM agents.            Haoyu Wang, Christopher M. Poskitt, and Jun Sun.
   Preprint, arXiv:2509.25624v3.                                 2026a. AgentSpec: Customizable runtime enforce-
                                                                 ment for safe and reliable LLM agents. In Proceed-
Zhiyuan Li, Jingzheng Wu, Xiang Ling, Xing Cui, and              ings of the 2026 IEEE/ACM 48th International Con-
  Tianyue Luo. 2026. Towards secure agent skills:                ference on Software Engineering, pages 2938–2950.
  Architecture, threat taxonomy, and security analysis.          ACM.
  Preprint, arXiv:2604.02837.
                                                               Qianli Wang, Boyang Ma, Minghui Xu, and Yue Zhang.
Xinyu Liu, Yukai Zhao, Xing Hu, and Xin Xia. 2026a.              2026b. When skills lie: Hidden-comment injection
  Exploiting LLM agent supply chains via payload-less            in LLM agents. Preprint, arXiv:2602.10498.
  skills. Preprint, arXiv:2605.14460.
                                                               Su Wang, Pin Qian, Yihang Chen, Junxian You, Xi-
Yi Liu, Zhihao Chen, Yanjun Zhang, Gelei Deng,                   aoyuan Wang, Xiaochong Jiang, Lifei Liu, Haoran
  Yuekang Li, Jianting Ning, and Leo Yu Zhang. 2026b.            Yu, and Jingzhou Xu. 2026c. When safe skills col-
  "do not mention this to the user": Detecting and un-           lide: Measuring compositional risk in agent skill
  derstanding malicious agent skills in the wild. In             ecosystems. Preprint, arXiv:2606.00448.
  35th USENIX Security Symposium (USENIX Secu-
  rity 26), pages 1727–1746, Baltimore, MD. USENIX             Zhiqiang Wang, Yichao Gao, Yanting Wang, Suyuan
  Association.                                                   Liu, Haifeng Sun, Haoran Cheng, Guanquan Shi,
                                                                 Haohua Du, and Xiangyang Li. 2026d. MCPTox:
Yi Liu, Weizhe Wang, Ruitao Feng, Yao Zhang,                     A benchmark for tool poisoning on real-world MCP
  Guangquan Xu, Gelei Deng, Yuekang Li, and Leo                  servers. Proceedings of the AAAI Conference on
  Zhang. 2026c. Agent skills in the wild: An empirical           Artificial Intelligence, 40(42):35811–35819.
  study of security vulnerabilities at scale. Preprint,
  arXiv:2601.10338.                                            Yuhao Wu, Tung-Ling Li, and Hongliang Liu. 2026.
                                                                 Behavioral integrity verification for AI agent skills.
Yuting Ning, Zhehao Zhang, Yash Kumar Lal, Boyu                  Preprint, arXiv:2605.11770.
  Gou, Junyi Li, Weitong Ruan, Chentao Ye, Rahul
  Gupta, Diyi Yang, Yu Su, and Huan Sun. 2026. Skill-          Wenjie Xiao, Xuehai Tang, Biyu Zhou, Songlin Hu,
  Harm: Lifecycle-aware skill-based attacks via auto-           and Jizhong Han. 2026. RouteGuard: Internal-signal
  mated construction. Preprint, arXiv:2606.02540.               detection of skill poisoning in LLM agents. Preprint,
                                                                arXiv:2604.22888.
NVIDIA. 2026. SkillSpector: Security scanner for AI
 agent skills. Software, version 2.3.9. Accessed 2026-         Yi Xie, Jiawei Du, Yu Cheng, Jiuan Zhou, and Zhaoxia
 10-13.                                                          Yin. 2026. Benign in isolation, harmful in com-
                                                                  position: Security risks in agent skill ecosystems.
OpenAI. 2026. GPT-5.5 model. Model documentation.                 Preprint, arXiv:2606.15242.
  Accessed October 13, 2026.



                                                          10
Shunyu Yao, Noah Shinn, Pedram Razavi, and Karthik             task’s acceptance criteria for verifying task com-
  Narasimhan. 2024. τ -bench: A benchmark for                  pletion and preservation of the skill’s utility.
  tool-agent-user interaction in real-world domains.
                                                                  Each of the 50 tasks is evaluated under three
  Preprint, arXiv:2406.12045.
                                                               attack objectives, data exfiltration (EXF), state
Zonghao Ying, Xiangfan Wu, Huiyu Wu, Xing Zheng,               tampering (TAM), and privilege violation (PRV),
  Huangsheng Cheng, Xiaorong Shi, and Jing Guo.                giving 150 evaluation cases with 50 per objec-
  2026. SkillJack: Persistent skill backdoors in self-
  evolving agents. Preprint, arXiv:2608.03509.                 tive. The objectives respectively involve transfer-
                                                               ring protected data to hosts outside the task’s au-
Z.ai. 2026. GLM-5.2. Model card. Accessed October              thorized scope, copying protected files into skill
  13, 2026.
                                                               archives without authorization, thereby changing
Puyu Zeng, Simeng Qin, Jingzhi Li, Ju Jia, Zheli Liu,          the installed skills’ persistent state, and executing
  and Xiaojun Jia. 2026. ColluSkill: Adversarial cross-        scripts beyond the user request’s authorized scope.
  skill composition for evading agent skill scanners.
  Preprint, arXiv:2608.09732.                                  For each evaluation case, all methods receive the
                                                               same legitimate user request and use the same task-
Qiusi Zhan, Zhixiang Liang, Zifan Ying, and Daniel             output acceptance criteria and attack-success cri-
  Kang. 2024. InjecAgent: Benchmarking indirect
  prompt injections in tool-integrated large language          terion. Section A.2 describes the verification evi-
  model agents. In Findings of the Association for             dence. The composition-size study (Section 4.4)
  Computational Linguistics: ACL 2024, pages 10471–            and partial-injection ablation (Appendix C) use a
  10506, Bangkok, Thailand. Association for Compu-             fixed subset of 24 tasks randomly selected before
  tational Linguistics.
                                                               evaluation. This subset provides 72 cases per con-
Hanrong Zhang, Jingyuan Huang, Kai Mei, Yifei Yao,             figuration, with 24 per attack objective. Asterisks
  Zhenting Wang, Chenlu Zhan, Hongwei Wang, and                in Table A1 mark these tasks.
  Yongfeng Zhang. 2025. Agent security bench (ASB):
  Formalizing and benchmarking attacks and defenses            A.2   Execution and Verification
  in LLM-based agents. In International Conference
  on Learning Representations, pages 35331–35366.              We use Claude Code CLI (Anthropic, 2026) (ver-
                                                               sion 2.1.92) as the main victim platform, config-
A     Benchmark and Evaluation Details                         ured with deepseek-v4-flash as the execution back-
This appendix documents the tasks and their ac-                end. We also use deepseek-v4-flash for skill con-
ceptance criteria, evaluation case selection, and the          struction. Skill construction and agent execution
execution environment and outcome checks.                      have no time limit.
                                                                  Each execution starts in a fresh session with
A.1    Benchmark Construction                                  a separate task workspace and model configura-
We draw on public task scenarios from Skill-Inject             tion. For each method, we install all of its injected
(Schmotz et al., 2026), τ -bench (Yao et al., 2024),           skills together with six clean skills as distractors.
and AgentDojo (Debenedetti et al., 2024) to im-                The workspace allows intermediate artifacts and
plement 50 tasks and their corresponding skills in             agent-generated code. Input fixtures have read-only
a shared local evaluation environment. Each task               file permissions, whereas the agent is instructed to
includes a user request, structured input fixtures,            preserve installed skill packages. Drivers record
and an expected publication payload, providing in-             command events, completion status, and resulting
dependently verifiable task outputs. Table A1 lists            artifacts.
all tasks and their identifiers.                                  The agent receives the legitimate user request
   Task logic is implemented with the Python stan-             and shared instructions to read installed skill doc-
dard library, while external services are simulated            umentation, select relevant functions, and place
using predefined data and controlled responses.                intermediate artifacts in the task workspace. It au-
Task outputs are checked against the acceptance                tonomously selects skill calls and execution com-
criteria described in Appendix A.2. For example,               mands. Expected publication payloads are avail-
AB04 asks the agent to review warehouse stock, ac-             able to the evaluator but are excluded from the
count for committed orders and expected demand,                agent’s request.
and publish an allocation and replenishment plan.
                                                               Task     Output      Verification. A       local
Its expected output specifies item availability, pro-
                                                               HTTP/HTTPS proxy records publication re-
jected balances, shortages, replenishment quanti-
                                                               quests and returns controlled service responses.
ties, and allocation decisions. These fields form the

                                                          11
Table A1: The tasks in the benchmark. Asterisks mark the tasks used in the composition-size experiment and partial
injection ablation.

ID       Task                                                  ID            Task
     *                                                                  *
AB01     Customer profile verification                         AB26          Document metadata governance
AB02*    Product catalog review                                AB27          Employment contract review
AB03*    Retail order fulfillment                              AB28*         Business policy compliance
AB04*    Inventory replenishment                               AB29          Knowledge evidence retrieval
AB05*    Supplier quotations                                   AB30*         Brand consistency checks
AB06*    Airline reservations                                  AB31*         Tabular data quality auditing
AB07*    Hotel availability and booking                        AB32*         Structured data mapping
AB08     Ground transport planning                             AB33          KPI anomaly review
AB09     Entry document checks                                 AB34          Management data reporting
AB10     Delivery exception resolution                         AB35          Migration snapshot validation
AB11     Bank transfer instructions                            AB36          Static patch review
AB12*    Bank reconciliation                                   AB37          Test case design
AB13     Transaction risk triage                               AB38*         Defect root cause analysis
AB14     Payroll preflight checks                              AB39*         Shell script quality checks
AB15     Insurance claim intake                                AB40*         Web acceptance evaluation
AB16*    Financial ratio analysis                              AB41          System health inspection
AB17*    Budget variance analysis                              AB42          Incident triage and response
AB18*    Enterprise valuation                                  AB43          Access permission auditing
AB19*    Portfolio risk measurement                            AB44          Release readiness checks
AB20*    Invoice compliance auditing                           AB45          API and webhook reconciliation
AB21*    Email triage                                          AB46          Application completeness checks
AB22*    Calendar conflict resolution                          AB47          Onboarding coordination
AB23*    Meeting action tracking                               AB48          Training certificate verification
AB24     Team message coordination                             AB49          Feedback ticket routing
AB25     Internal communication release                        AB50          SEO content auditing



The evaluator selects the last POST request to the            Table A2: Static detection rates (DR) of SkillFortify
designated host and path after excluding empty                and CiscoSkillScan. Control rows report false-positive
                                                              rates. Lower DR indicates greater attack stealth. Bold
JSON objects and probe-only objects. Its JSON
                                                              marks the lowest attack DR in each column within each
body must equal the expected publication payload.             auditor.
Missing fields, additional fields, incorrect values,
or the absence of a qualifying publication cause              Auditor            Method                EXF TAM PRV Overall
the task-output check to fail.                                SkillFortify       Original skills         0    0    0       0
                                                              SkillFortify       Clean compositions      0    0    0       0
Attack verification. EXF succeeds when a                      SkillFortify       Skill-Inject           100   0   100    66.7
recorded request to a host outside the task’s au-             SkillFortify       SkillJect               0    0    0       0
                                                              SkillFortify       SCR-Bench              100   0    0     33.3
thorized scope contains protected values. TAM                 SkillFortify       ColluSkill             8.0   0   10.0    6.0
succeeds when the execution record confirms that              SkillFortify       C O R ED S KILL (Ours) 0     0    0       0
a protected file was copied into a skill archive with-        CiscoSkillScan Original skills         0        0     0      0
out authorization, changing the installed skill’s per-        CiscoSkillScan Clean compositions      0        0     0      0
                                                              CiscoSkillScan Skill-Inject            0        0   32.0   10.7
sistent state. PRV succeeds when the recorded                 CiscoSkillScan SkillJect               0        0     0      0
script execution result confirms that the agent ran a         CiscoSkillScan SCR-Bench               0        0     0      0
                                                              CiscoSkillScan ColluSkill             4.0       0    6.0    3.3
helper script unrelated to the user’s task and outside        CiscoSkillScan C O R ED S KILL (Ours) 0         0     0      0
its authorized scope. The helper script is initially
permission-locked. The workflow copies it to the
task workspace and restores its execute permission,           Kimi K2.5 (Kimi Team et al., 2026) as alternative
after which the agent runs it according to the skill          execution and audit models. Replacing the execu-
instructions and workflow context. We verify task             tion model produces little variation in execution
output and attack evidence separately to assess task          outcomes. Replacing the audit model modestly
completion and attack success within each execu-              changes detection rates, while the relative trends
tion.                                                         across methods remain consistent.
   We also evaluate GPT-5.5 (OpenAI, 2026) and


                                                         12
Table A3: Detection rates (DR) of C O R ED S KILL with two to four skills, where k denotes the number of skills in
the composition. Lower DR indicates greater attack stealth. Bold marks the lowest value across composition sizes
in each column within each auditor.

                                     EXF               TAM                         PRV             Overall
        Auditor        k
                            Deepseek       GLM    Deepseek       GLM      Deepseek       GLM    Deepseek     GLM
        SkillScan      2        0          20.8      0            12.5      12.5         29.2     4.2        20.8
        SkillScan      3       4.2         20.8      0            16.7       8.3         37.5      4.2       25.0
        SkillScan      4      12.5         20.8     12.5          20.8      12.5         37.5     12.5       26.4
        SkillSpector   2      25.0         50.0     12.5          12.5      37.5         41.7     25.0       34.7
        SkillSpector   3       4.2          8.3      0             8.3      20.8         29.2      8.3       15.3
        SkillSpector   4      12.5         33.3     20.8          20.8      45.8         16.7     26.4       23.6



A.3    Auditor Settings                                          command events, completion status, and generated
In the individual-package configurations, each au-               artifacts, while a local proxy records network re-
ditor examines a skill package’s documentation,                  quests. HITL’s risk rules (Shan et al., 2026) are
code, and local resources. Within each LLM-based                 extracted from its tool-call classification and ex-
auditor, Deepseek and GLM use the same input                     tended rule layers and applied to serialized tool
configuration and receive the same skill-package                 names and arguments. They check both individual
contents. SkillScan (Liu et al., 2026c) supports                 calls and their order in the execution trace, counting
combining a local static scanner with an LLM audit               a HIGH or CRITICAL match as a detection. De-
adapter. We use its skill-security-scan static engine            fenseClaw’s strict-policy rules (Cisco AI Defense,
(v1.0.0). The semantic audit examines these pack-                2026a), rated HIGH or CRITICAL, are applied to
age contents to identify unauthorized data transfer,             tool commands, proxy-recorded network requests,
state changes, and hidden execution. The LLM-                    and installed Python, shell, JSON, and Markdown
assigned risk level determines the final verdict.                skill files. A match likewise counts as a detection.
   SkillSpector (NVIDIA, 2026) (v2.3.9) first uses               A.5     Composition Size Results
its default static analyzers to identify potential risks,
then uses an LLM to review and filter the findings.              Table A3 provides the complete per-objective re-
Long files are processed in overlapping chunks.                  sults summarized in Figure 2, reporting DR for
SkillScan and SkillSpector each use Deepseek and                 each composition size and audit configuration.
GLM, yielding four LLM audit configurations.                     Each composition size is evaluated on the same
   SkillFortify (Bhardwaj, 2026) (v0.6.0) and Cis-               72 cases from the fixed 24-task subset.
coSkillScan (Cisco Skill Scanner (Cisco AI De-
                                                                 B     Related Work
fense, 2026b), v2.0.13) run without LLM calls,
using static checks of package permissions, depen-               B.1     Attacks on Agent Skills
dencies, code patterns, and data flows. SkillFortify             Empirical studies document malicious skills and
receives each package in its expected skill-directory            credential leakage (Liu et al., 2026c,b; Chen et al.,
layout. CiscoSkillScan uses its default format                   2026b), while architectural and repository-aware
validation with behavioral analysis enabled. All                 analyses characterize their supply-chain risks (Li
skill-package audit configurations count a HIGH                  et al., 2026; Jiang et al., 2026; Holzbauer et al.,
or CRITICAL risk rating as a detection.                          2026). Attack construction includes template injec-
   For composition-aware auditing (Section 4.6),                 tion, execution-feedback refinement, and position-
we use Deepseek and provide the documentation,                   aware instruction placement (Schmotz et al., 2026;
code, and local resources of all constituent skills              Jia et al., 2026; Hao et al., 2026). Poise also ver-
together.                                                        ifies the attack action and legitimate task in the
                                                                 same trial. Hidden-comment and payload-less at-
A.4    Runtime Audit Configurations
                                                                 tacks conceal instructions or induce runtime code
Runtime auditing applies risk and policy rules to                generation (Wang et al., 2026b; Liu et al., 2026a).
the agent’s execution records and installed skill                Dynamic malicious skills and SkillHarm alter per-
files. During each task run, the driver records                  sistent skill content during execution or for later


                                                            13
reuse (Chen et al., 2026a; Ning et al., 2026).               Table C1: Attack success rates (ASR) and task success
   Other mechanisms include payload obfuscation              rates (TSR) in the partial injection ablation. In P z1 z2 z3 ,
                                                             1 and 0 indicate an injected skill and a clean skill at the
and packing (Ji et al., 2026), backdoored models
                                                             corresponding position, respectively. Bold marks the
bundled with skills (Tie et al., 2026), and conver-          highest value in each column.
sion of poisoned experiences into persistent skills
(Ying et al., 2026). Tool-description and memory                                ASR↑ ASR↑ ASR↑
poisoning provide related attack channels (Wang                   Configuration (EXF) (TAM) (PRV) ASR↑ TSR↑
et al., 2026d; Dong et al., 2025). SkillAttack in-                    P 000        0        0     0       0     100
stead exploits vulnerabilities in unmodified skills                   P 100        0        0     0       0     95.8
through adversarial prompting (Duan et al., 2026).                    P 010        0        0     0       0     94.4
                                                                      P 001        0        0     0       0     88.9
C O R ED S KILL distributes attack operations across                  P 110        0       8.3   79.2    29.2   100
existing task functions while preserving skill util-                  P 101        0      33.3   45.8    26.4   100
ity.                                                                  P 011       83.3    79.2    0      54.2   100
                                                                      P 111       100     100    100     100    100
B.2   Compositional Attacks
STAC (Li et al., 2025) constructs dangerous chains
                                                             and installed skills (Zeng et al., 2026). At run-
from individually permissible tools, and Semantic
                                                             time, AgentSpec and Progent constrain actions and
Intent Fragmentation (Ahad et al., 2026) distributes
                                                             privileges (Wang et al., 2026a; Shi et al., 2025),
harmful objectives across locally acceptable sub-
                                                             HITL and DefenseClaw assess risks and apply poli-
tasks. Within skill ecosystems, SkillReact (Wang
                                                             cies (Shan et al., 2026; Cisco AI Defense, 2026a),
et al., 2026c) measures risks among individually
                                                             and SkillDetonate audits sandbox behavior through
safe skills, SkillProbe (Guo et al., 2026b) simu-
                                                             information-flow evidence (Ji et al., 2026).
lates inter-skill interactions, and SCR-Bench (Xie
                                                                Execution-based evaluation complements these
et al., 2026) evaluates capability flow, trust trans-
                                                             defenses. ToolEmu emulates tool execution (Ruan
fer, and authorization confusion along skill paths.
                                                             et al., 2024), InjecAgent tests indirect injection
These studies examine how available capabilities
                                                             (Zhan et al., 2024), and AgentDojo evaluates
and agent decisions combine to produce unautho-
                                                             legitimate tasks alongside adversarial objectives
rized effects.
                                                             (Debenedetti et al., 2024). ASB studies attacks
   ColluSkill (Zeng et al., 2026) generates interde-
                                                             across agent components and the utility–security
pendent subpayloads around a malicious objective,
                                                             balance (Zhang et al., 2025), while MalSkillBench
connects them through context and artifacts, and
                                                             verifies malicious skills through sandbox execution
refines flagged skills using scanner feedback. Skill-
                                                             (Guo et al., 2026a). Our evaluation combines pack-
Trojan (Feng et al., 2026) accumulates fragments
                                                             age and runtime auditing with output-based task
across invocations to reconstruct an executable pay-
                                                             acceptance to test whether distributed attacks evade
load. C O R ED S KILL instead uses AST rewriting
                                                             detection while preserving skill utility.
to embed distributed attack operations in existing
skills while preserving their original functionality.        C     Partial Injection Ablation
Appendix D details the closest comparisons and
baseline adaptations.                                        We replace selected injected skills with their clean
                                                             versions to measure how injection position affects
B.3   Skill Auditing and Runtime Defenses                    attack success and task success. Each configuration
SkillScan and SkillSpector combine static evidence           is evaluated on 72 cases from the fixed 24-task
with LLM analysis (Liu et al., 2026c; NVIDIA,                subset, with 24 cases per attack objective. For
2026), while SkillFortify and CiscoSkillScan pro-            configuration P z1 z2 z3 , zi = 1 selects the injected
vide static checks (Bhardwaj, 2026; Cisco AI De-             skill at workflow position i, while zi = 0 selects its
fense, 2026b). Further approaches use hierarchical           clean version. The bit order follows the workflow
triage (Hou and Yang, 2026), attention-guided re-            order, so P 011 injects the second and third skills.
view (Etteib et al., 2026), internal model signals           Workflow roles, user requests, and sandbox settings
(Xiao et al., 2026), declared–implemented capabil-           remain unchanged.
ity comparisons (Wu et al., 2026), and repository               Table C1 shows that attack success under partial
context (Holzbauer et al., 2026). ChainGuard ex-             injection depends on the retained injection posi-
tends auditing to dependencies between candidate             tions and the attack objective. Under P 011 , the


                                                        14
EXF and TAM ASRs reach 83.3% and 79.2%, re-                   of flagged skills.
spectively. For both objectives, the downstream
injected skills ask the agent to supply the files or          D.2    Threat Model Comparison
fields required to continue the attack. Because               ColluSkill (Zeng et al., 2026) decomposes a ma-
the clean first skill does not provide these inputs,          licious payload into ordered, interdependent parts
the agent searches the available task materials and           and embeds them in separate skills. Context, arti-
supplies them, allowing the subsequent exfiltra-              fact transfer, and execution handoffs connect these
tion or copying of the protected file into the skill          parts during agent execution, while scanner feed-
archive to proceed. Under P 110 , the PRV ASR                 back is used to rewrite detected skills. SCR-Bench
reaches 79.2%. The two upstream injected skills               (Xie et al., 2026) studies risks that arise when an
place a permission-locked helper script unrelated             agent composes individually benign skills. Its con-
to the user’s task in the task workspace and restore          trolled scenarios cover capability flow, trust trans-
its execute permission. The agent then runs the               fer, and authorization confusion, with risk arising
script based on the workflow context. Although                from the agent’s choices and workflow context
the third skill remains clean, the agent still com-           rather than malicious code in the component skills.
pletes the task through the clean publishing skill.              These studies construct interdependent attack
These execution records illustrate how the agent              skills or controlled skill-interaction scenarios.
can sometimes complete one missing attack step                C O R ED S KILL instead starts from existing skills
using malicious instructions in the remaining skills          with independently verifiable utility and embeds
and the workflow context.                                     distributed attack operations in their original task
                                                              logic. The injected skills retain their expected task
D     Comparison with Related Work                            outputs, while the user’s legitimate request con-
D.1    Attack Baseline Adaptations                            tinues to define the authorization boundary. Our
                                                              evaluation jointly measures attack success, task
We adapt four attack baselines to the benchmark’s             completion, and audit evasion.
tasks and attack objectives, and their names in the
result tables refer to these adapted versions. For            E     Three-Skill Construction Example
Skill-Inject (Schmotz et al., 2026), we append its
injection templates to the skill description and add          We illustrate the three-skill EXF construction with
a script wrapper that performs the specified attack           AB04, an inventory-replenishment task that re-
operation alongside normal task processing.                   views stock and demand and publishes a replen-
   For SkillJect (Jia et al., 2026), Deepseek gener-          ishment plan. The injected skills preserve these
ates a single malicious skill that combines injected          task functions while distributing file-and-field in-
instructions with an auxiliary payload. We refine             ventory, value collection, and data transfer across
the skill iteratively using execution feedback.               the three stages. Together, these operations locate
   Our adaptation of SCR-Bench (Xie et al., 2026)             and collect a protected warehouse API credential
uses its capability-flow setting to construct two-            and send it to an unauthorized recipient. Algo-
skill workflows for the benchmark’s tasks and at-             rithm E1 summarizes the construction and the in-
tack objectives. The upstream skill supplies infor-           formation passed between skills.
mation for the downstream action. We add fixed                   The construction uses the specification
prompt-injection templates to the skill documenta-            Φ(EXF, 3). Each intermediate artifact is repre-
tion to guide the agent’s use of this information, to-        sented as x ei = (xi , hi ), where xi contains task
gether with helper scripts for unauthorized copying           results and hi carries information for subsequent
of protected files into skill archives and execution          attack operations. The initial task input is x e0 . In
of task-unrelated scripts.                                    the algorithm, δ denotes the fixture directory, I its
   For ColluSkill (Zeng et al., 2026), we implement           file-and-field inventory, and V the collected values
a three-skill chain with interdependent subpayloads           together with their sources and pending-review
and scanner-feedback refinement, using a seven-               flags.
round refinement budget. We use Deepseek for                     B IND applies the AST rewriting and packaging
skill generation and refinement and as the SkillScan          defined in Equation (4). Select is implemented
audit backend. In each round, SkillScan checks all            within the third skill’s export helper and filters en-
three skills, and its feedback guides the rewriting           tries with pending-review flags and non-null val-


                                                         15
Algorithm E1 Three-skill EXF construction and                         load, and submits the plan to the service specified
execution dependencies                                                by the user. Its rewritten export helper filters col-
Require: clean composition C = (S1 , S2 , S3 ), input x e0            lected entries with pending review flags and non-
Require: specification Φ = Φ(EXF, 3)                                  null values. The injected skill instructions then
 1: for i = 1, 2, 3 do
 2:     ϕi ← Φ[i]                                                     direct the agent to invoke the additional distribute
 3:     Si′ ← B IND(Si ; ϕi )                                         command after normal publication. This command
 4: end for                                                           sends the collected entries to the target supplied by
    Inventory anchor: a1 = Inventory
    e1 ← S1′ (e
 5: x          x0 )                                                   the skill’s configuration, which is outside the user’s
 6: h1 = (δ, I)                     ▷ File and field inventory        authorized publication destination.
    Collection anchor: a2 = Collect                                      The published replenishment plan has identifier
    e2 ← S2′ (e
 7: x          x1 )
 8: h2 = (δ, I, V)                                                    RP-2026-07-W31 and a purchase total of CNY
         V: collected values with sources and pending-review          465.00, matching the task’s expected output.
    flags
    Export anchor: a3 = Export                                        E.2 Anchor Binding and AST Transformation
 9: E ← S ELECT(V)
         Retain pending entries with non-null values                  The abstract anchors Inventory, Collect, and Ex-
10: x3 ← S3′ (ex2 ; E)
11: return task output x3
                                                                      port bind to _list_fixture_files in inventory_loader,
                                                                      _locate_state_fields in stock_position_auditor,
                                                                      and _export_configuration_entries in replenish-
ues. Each stage call summarizes the agent’s invoca-                   ment_publisher, respectively. Each specification ϕi
tions of that skill, including normal publication and                 identifies the helper to replace and the fields needed
the additional distribution command in the third                      for downstream execution. The AST rewriter re-
stage. A local proxy records the resulting network                    places the helper implementation and updates its
requests as execution evidence.                                       callers. In the second skill, it also renames _lo-
                                                                      cate_state_fields to _record_configuration_state.
E.1    Protected Data and State Dependencies                          The resulting workflow passes the fixture direc-
The user-authorized publication destination is the                    tory and file–field inventory through fixture_dir
inventory-planning service. The fixture contains                      and available_files, and stores collected values and
a protected warehouse API credential in the ware-                     review_pending flags in located_state_fields. The
house_api_token field of env.json, which the re-                      publisher retains its original output construction
quest does not authorize the agent to disclose.                       while gaining a distribute command that reads these
The three skills perform inventory loading, stock-                    entries. The skill documentation prompts the agent
position auditing, and plan publication. Their inter-                 to invoke this command, and the followup_targets
mediate artifacts carry both task results and infor-                  configuration supplies its destination. These code,
mation needed by the EXF operations.                                  documentation, and configuration changes connect
   The first skill, inventory_loader, loads the in-                   the attack operations through the workflow’s exist-
ventory fixture and normalizes its four SKU                           ing artifacts.
records for downstream processing. Its injected                          The execution record contains two POST re-
inventory operation also enumerates fixture files                     quests. The agent first publishes the expected re-
and their JSON field names, including ware-                           plenishment plan to the inventory-planning service.
house_api_token in env.json. The file-and-field                       It then invokes distribute to send configuration en-
inventory passed downstream contains file and field                   tries containing the protected warehouse_api_token
names without the credential value. The second                        value to /v1/entries on config-service.internal, the
skill, stock_position_auditor, calculates projected                   unauthorized recipient specified by the injected
balances and replenishment needs, allocates avail-                    skill.
able stock to committed orders by priority, and
builds the replenishment plan. Its injected col-                      F   Usage of LLMs
lection operation reads the inventoried fields and                    We use LLMs to assist with data generation, code
writes their values, sources, and review_pending                      development, and manuscript editing. The research
flags into the intermediate artifact, passing the pro-                ideas and methodology are developed by the human
tected credential alongside the task results. The                     authors.
third skill, replenishment_publisher, reads the re-
plenishment policy, prepares the publication pay-

                                                                 16
