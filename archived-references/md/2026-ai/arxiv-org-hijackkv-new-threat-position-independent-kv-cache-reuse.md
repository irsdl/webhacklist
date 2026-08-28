---
type: Article
title: "HijackKV: New Threat in Position-Independent KV Cache Reuse"
description: "Position-independent KV cache reuse lets a serving system reuse cached key-value state whenever identical text chunks appear, whatever their position. Because a cache entry is retrieved by token match but encodes the context it was computed in, a benign-looking chunk can carry an attacker-controlled prefix, and reusing it in a victim's query steers the model with no adversarial text in the input."
resource: "https://arxiv.org/abs/2607.19957"
tags: [article, webseclist-reference, en, arxiv-org, llm, cache-poisoning, cache, ai-agent, prompt-injection, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T13:15:03+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://arxiv.org/abs/2607.19957"
    title: "HijackKV: New Threat in Position-Independent KV Cache Reuse"
    author: Yichi Zhang, Zhiqi Wang, Huan Zhang, Yuchen Yang
also_at:
  - "https://arxiv.org/pdf/2607.19957"
authors:
  - Yichi Zhang
  - Zhiqi Wang
  - Huan Zhang
  - Yuchen Yang
canonical_url: ""
cited_by:
  - "2026-ai.md:104"
commit: ""
content_sha256: b154826495e33bfc25e2bfe8b376aa69d4422da048cfca316f5125521303d7bf
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2607.19957"
published: ""
publisher: arXiv.org
publisher_english: ""
raw_sha256: fadabcf7146e7e8f19b0916a5d4dfcc7d43526f110bcb0887010719054abc4fa
retrieved_from: "https://arxiv.org/pdf/2607.19957"
retrieved_kind: live
retrieved_utc: "2026-08-19T13:15:03+00:00"
slug: arxiv-org-hijackkv-new-threat-position-independent-kv-cache-reuse
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# HijackKV: New Threat in Position-Independent KV Cache Reuse

**HijackKV: New Threat in Position-Independent KV Cache Reuse** - Yichi Zhang, Zhiqi Wang, Huan Zhang, Yuchen Yang, arXiv.org.

- Published: date not stated
- Original: <https://arxiv.org/abs/2607.19957>
- Also published at: <https://arxiv.org/pdf/2607.19957>
- Preserved from: https://arxiv.org/pdf/2607.19957 (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

H IJACK KV: New Threat in Position-Independent KV Cache Reuse

                                                                        Yichi Zhang1 , Zhiqi Wang1 , Huan Zhang2 , Yuchen Yang1
                                                            1 The Pennsylvania State University, 2 University of Illinois Urbana-Champaign

                                                               {yichi.zhang, zhiqi.wang, yuchen.yang}@psu.edu, huan@huan-zhang.com



                                                                       Abstract                                             Malicious Attacker Query                                             Benign User Query
                                                                                                                       Popular Query   Adversarial Text      Popular Query            Popular Query     Popular Query
                                         Key-Value (KV) cache reduces inference latency in large lan-                  Text Chunk 1    Text Chunk 2          Text Chunk 3             Text Chunk 1      Text Chunk 3

                                         guage models (LLMs). Traditional prefix-based reuse has low                                                                                 (1) Prefix Reuse
                                                                                                                                           Cache          Affect          Match
arXiv:2607.19957v2 [cs.CR] 31 Jul 2026




                                                                                                                                                                                                                        Normal
                                         cache hit rates across inference requests because it requires                                                                                 KV Cache 1       Recompute KV    Response
                                         exact token and position matches. To improve efficiency, re-                   KV Cache 1      KV Cache 2           KV Cache 3              Lower efficiency

                                         cent system optimizations introduce position-independent KV                                                           Hijacked KV           (2) Position-Independent Reuse
                                                                                                                           Other KV Cache ...
                                                                                                                                                                             Reuse                                      Hijacked
                                                                                                                                                                                       KV Cache 1        KV Cache 3
                                         reuse, allowing KV cache to be reused whenever identical text                                                                                                                  Response
                                                                                                                              Shared KV Cache Pool                                   Fast, but    new threat
                                         chunks appear, regardless of their position in the sequence.
                                                                                                                      (a) KV cache hijacked by attacker                                  (b) KV cache used by User
                                            We show this design introduces a new threat, KV Cache
                                         Hijacking. Since KV caches are retrieved by token match but                  Figure 1: New threat from position-independent KV reuse in
                                         encode the context in which they were originally computed,                   multi-tenant systems. (1) Prefix reuse is slow because reuse
                                         the KV tied to a benign-looking token chunk may encode an                    requires the same preceding prefix. (2) Position-independent
                                         attacker-controlled prefix. When later reused in a victim query,             reuse is fast but unsafe because it will reuse a hijacked
                                         this contaminated KV silently hijacks the model’s behavior,                  KV despite position mismatch, enabling cross-user attacker-
                                         even if no attacker-controlled text appears in the input.                    controlled outputs without any adversarial text.
                                            We introduce H IJACK KV, the first attack framework that
                                         systematically exploits this vulnerability, demonstrating its                the time-to-first-token (TTFT) and scales super-linearly with
                                         severity and practicality. H IJACK KV optimizes an attacker-                 input length [5, 20]. To reduce this overhead, modern infer-
                                         controlled prefix, so that the KV computed for a subsequent                  ence engines increasingly rely on caching and reusing KV
                                         common benign text encodes the attacker’s goal, while the                    across requests, as adopted by major providers, e.g., Anthropic
                                         text remains unchanged for future cache hits. H IJACK KV                     Claude [1], Google Gemini [8] and OpenAI ChatGPT [34].
                                         achieves an average 94% success rate in a single attempt,                    Traditional reuse is strictly prefix-based [38], requiring exact
                                         remains effective under realistic constraints including low hit              matches of both tokens and positions, resulting in a low hit
                                         rates (10%) and frequent recomputation (50%), persists over                  rate [62], and provides marginal benefit compared with no
                                         multi-turn interactions, and transfers across models in black-               KV cache reuse. Figure 1(b)(1) shows that reuse requires the
                                         box settings. We further provide design insights for building                same preceding prefix: KV3 was cached after chunk 2, so if
                                         secure KV reuse systems.1                                                    chunk 2 is missing in the future query, KV3 cannot be reused
                                                                                                                      even if chunk 3’s text is identical.
                                                                                                                         Recent system research proposes efficiency-driven opti-
                                         1     Introduction                                                           mizations that relax prefix and position constraints, includ-
                                                                                                                      ing (i) position-independent KV reuse [14, 49, 57, 58, 62],
                                         LLMs are now widely deployed in personal assistance [35,41],                 which enables chunk-level reuse if the tokens match, re-
                                         healthcare [33, 44], and retrieval-augmented applications [6,                gardless of original prefix. Position-independent reuse is
                                         22], where user queries are often augmented with long con-                   already deployed in commercial platforms such as LM-
                                         textual input for accurate responses. However, long inputs                   Cache [28] (commercializing the award-winning research pro-
                                         slow down inference because the model must perform a full                    totype CacheBlend [62]), as well as a growing body of follow-
                                         prefill pass to build the Key-Value (KV), which dominates                    up work [14, 49, 57]; and (ii) multi-tenant KV reuse [48, 53],
                                             1 The source code of H IJACK KV is publicly available: https://github.   where KV states computed for one user’s request are shared to
                                         com/YichiCS/KV-Cache-Hijack                                                  accelerate independent requests from different users that con-
tain overlapping context. Widely adopted open-source serving       • We design H IJACK KV, the first attack framework that hi-
engines such as vLLM [48], used by organizations including           jacks KV reuse, revealing a previously unknown vulnera-
Cloudflare and IBM, enable shared KV reuse by default. In            bility in modern LLM serving systems.
practice, users frequently submit overlapping text (e.g., re-
                                                                   • We evaluate state-of-the-art KV reuse mechanisms across
trieved documents, organizational knowledge bases, or public
                                                                     multiple models and benchmarks, showing that they re-
materials), making cache reuse common and predictable.
                                                                     main vulnerable even with selective recomputation and low
   While significantly improving efficiency, these optimiza-
                                                                     cache hit rates, and offer suggestions for building secure-
tions assume that a text chunk’s KV state remains invariant
                                                                     by-design KV cache systems.
across different preceding contexts. However, KV states in
Transformers are inherently context-dependent, and the same
text chunk can produce different internal states under differ-
ent contexts. Prior work views this misalignment as a utility      2     Related Work
issue caused by attention shift, and mitigates it via selec-
tive recomputation [14, 62], refreshing 10-20% KV under
the new context to recover accuracy. In contrast, we reveal        2.1    Efficiency Optimization for KV Cache
this misalignment as a critical security vulnerability: by
decoupling KV states from their causal context, modern reuse       KV Cache Reuse and Sharing. To address the low hit rate
mechanisms inadvertently create a channel for adversarial          of prefix KV reuse [38] and reduce the computational cost
KV cache hijacking. We formalize this security vulnerability       across multiple requests, recent systems have explored cache
in Section 4.2. Next, we demonstrate that this channel is not      reuse and sharing strategies for multi-tenant LLM serving.
only theoretical but can be exploited in realistic deployments.       For reuse, CacheBlend [62] addresses KV reuse in RAG,
   We propose H IJACK KV, the first KV cache hijacking             which enables chunk-level reuse of precomputed KV caches
attack against position-independent KV cache systems un-           regardless of their positions and selectively recomputes KV
der multi-tenant deployment, to demonstrate that an un-            values for a small subset of tokens to mitigate utility loss.
privileged attacker can stealthily alter the LLM inference         EPIC [14] and MEPIC [49] formalize Position-Independent
behavior of other users. As shown in Figure 1(a), an at-           KV Cache by introducing the LegoLink algorithm to mitigate
tacker can prepend a commonly reused benign Text Chunk 3           attention sink effects, and add memory-efficient optimizations
(e.g., company FAQs) with an adversarially optimized prefix        such as chunk-level paging and RoPE fusion. KVShare [57]
 Text Chunk 2 . This prefix encodes a hidden adversarial ob-       designs a dual-stage high deviation algorithm that selectively
jective by conditioning the KV Cache 3 of the benign chunk         recomputes KV cache during prefill and decode phases via
3 on the Text Chunk 2 . Under position-independent reuse           a cache-aware scheduler. For sharing, PagedAttention [20]
(Figure 1(b)), a subsequent benign user query may trigger          enables multi-tenant KV cache sharing via zero-copy map-
reuse of the KV Cache 3 despite the absence of its preced-         ping of logical prompts to the shared physical KV blocks.
ing prefix (text chunk 2), enabling silent cross-user output       SGLang [64] stores the KV cache in GPU memory with a
hijacking without any adversarial tokens appearing in the          Radix Tree to maximize sharing across requests.
benign user’s input. This is the key difference from prompt           While these systems improve service efficiency, their secu-
injection [25], where adversarial tokens must appear in the        rity implications remain largely unexplored. Our work reveals
victim’s input, either directly or via retrieved content.          that these efficiency-driven optimizations open a hidden chan-
   H IJACK KV is both powerful and practical in terms of the       nel for KV cache hijacking.
following aspects. (1) Attack success: it attains an average
94% attack success rate with a single attempt. (2) Robustness      KV Cache Compression. Compression aims to reduce the
and Practice: it remains effective under realistic deployment      storage overhead of the KV cache. The first line of work
conditions, even when the match chunk hit rate is as low as        focuses on quantization [12, 27], which demonstrates that
10% and when recomputation is enabled at levels up to 50%.         quantization to low-bit representations (e.g., 4-bit or even 2-
(3) Persistence: it retains its impact even when over 1,000        bit) maintains generation quality while significantly reducing
tokens of new, unrelated context are inserted, indicating that     memory consumption. The second approach targets the se-
a single adversarial injection can persist through multi-turn      lective pruning of less important KV states. Early strategies
interactions. (4) Transferability: it demonstrates strong cross-   keep only the most recent tokens or preserve initial tokens
model transferability under a black box threat model, as the       alongside recent context [54]. More advanced methods lever-
same malicious prefix succeeds across multiple models.             age attention score statistics to identify and evict tokens with
                                                                   minimal impact on subsequent generations [26, 63]. Several
Contribution. We make the following contributions:
                                                                   KV-level defenses [17, 50] also adopt pruning to limit misuse.
• We identify and formalize a new threat introduced by             However, simply applying KV cache compression does not
  efficiency-oriented KV reuse optimization.                       prevent KV cache hijacking as shown in Section 8.
2.2    Adversarial Attacks                                          xT +1 at step T + 1, the attention mechanism must model the
                                                                    relationship between the current token xT and the entire pre-
KV Cache Privacy Leakage Attack. Sharing the KV cache               vious sequence [x1 , . . . , xT −1 ]. This requires projecting the
across multi-tenant LLM serving introduces privacy vulner-          hidden states into Query (Q ), Key (K ), and Value (V ) matri-
abilities, allowing adversaries to reconstruct sensitive user       ces, and computing the attention scores [47]:
inputs via multiple attack vectors. Wu et al. [53] present                                                               !
the first systematic investigation of security risks in multi-                                                     QK ⊤
tenant LLM serving with KV cache sharing in frameworks                        Attention(Q , K ,V ) = softmax √             V        (1)
                                                                                                                      dk
like SGLang [64] and vLLM [20]. Luo et al. [29] study KV
cache privacy leakage under three attack paradigms and iden-        where dk is the scaling factor. For completeness, Appendix B
tify the KV cache as a privacy-critical component. Song et          details the inference process of Transformer-based LLMs.
al. [45] discover timing side channels in LLM serving sys-             A naive implementation recomputes the keys and values
tems arising from shared caches and GPU memory alloca-              for all T tokens at every generation step. Because T increases
tions, which can be exploited to infer both confidential system     with each step, this redundant computation leads to O (T 2 )
prompts and sensitive requests issued by other users.               time complexity, which increases inference latency.
   While prior works have primarily focused on the privacy
                                                                    KV Cache Mechanism. To eliminate this redundancy, LLM
issues associated with KV caches, our work investigates how
                                                                    inference engines employ the KV cache mechanism. The
to exploit the KV cache to hijack model outputs.
                                                                    key idea is that the keys (K  K 1:T −1 ) and values (V
                                                                                                                         V 1:T −1 ) of
KV Cache Modification Attack. Beyond passive privacy                previous tokens remain static during generation. The model
leakage, recent work explores active attacks that modify the        only needs to compute representations for the current token
KV cache to change model behavior. CacheTrap [31] intro-            xT . By storing these past tensors in GPU memory, we reduce
duce a trojan attack that corrupts value vectors in the KV          the computational complexity of each step from O (T ) to O (1)
cache through bit-flip operations, achieving targeted misclas-      with respect to matrix multiplications.
sification without modifying model inputs or weights. His-             Specifically, for each attention head, the model only com-
torySwap [7] propose a block-level attack that overwrites           putes the query, key, and value vectors for the current token
contiguous segments of the active KV cache with precom-             xT via the projection weights W Q ,W K ,W V :
puted caches from different topics. MTI [13] formalize the
malicious token injection, which perturbs cached key vectors                 qT = uT W Q ,      k T = uT W K ,      vT = uT W V       (2)
through additive noise, zeroing, or orthogonal rotations.
                                                                    where u T is the normalized hidden state of the current token.
   However, these attacks require system-level access to mod-
                                                                    The system then appends the new key and value vectors to
ify the cache directly and do not consider broader KV cache
                                                                    the existing KV cache:
matching and reuse mechanisms. In contrast, our work is the
first to enable adversaries to hijack model outputs without                  K 1:T = [K 1:T −1 ; k T ],   V 1:T = [V 1:T −1 ; v T ]   (3)
requiring system-level privileges.
                                                                      Finally, the attention output for the current token is com-
Input-Based LLM Attacks. Prompt injection attacks [10,              puted by performing the multiplication between the single
16, 21, 25, 36, 37, 42, 43, 51] exploit prompt composition,         query vector q T and the cached matrices K 1:T and V 1:T :
where system/user instructions are combined with untrusted                                                           !
external data (e.g., emails, webpages, API responses). Ad-                                                  qT K ⊤
                                                                                                                 1:T
versaries manipulate the data portion to override instruc-                Attention(q , K ,V ) = softmax     √         V 1:T . (4)
                                                                                                                dk
tions and trigger unauthorized model behavior. Jailbreak at-
tacks [3, 24, 52, 59, 60, 65] similarly rely on adversarial text       In summary, the KV cache trades memory storage for lower
patterns that steer the model away from its intended safety         computational cost, which significantly reduces inference la-
policies. Both attack types require malicious text to appear        tency. Importantly, its benefits extend beyond accelerating a
in the user’s input, either directly in the user’s query or indi-   single user’s multi-turn dialogue. By sharing the KV cache
rectly through retrieved content. In contrast, our work enables     across different users, the system can further eliminate redun-
attacker-controlled model outputs even when the user’s input        dant computations on a global scale.
is without any malicious text.
                                                                    Prefix KV Cache Prompts sent by different users often ex-
                                                                    hibit significant prefix overlap (e.g., system prompts or few-
3     Preliminaries                                                 shot examples). Based on this observation, the prefix KV
                                                                    cache maintains a global KV cache pool shared across multi-
LLM Inference. In Transformer-based LLMs, the core com-             ple users:
putational bottleneck during inference is the Multi-Head Self-                                    
Attention (MHA) mechanism [47]. To generate the next token                              Pprefix = X̃, (K̃ , Ṽ ) ,              (5)
where X̃ is a cached token sequence and (K̃ , Ṽ ) are the corre-          4     Problem Formulation
sponding KV cache. When a new prompt X arrives, the LLM
inference engine searches the cache pool for a token sequence              In this section, we give the problem formulation, including
that shares the longest common prefix with X:                              threat model (§ 4.1) and new attack surface (§ 4.2).

            X̃, (K̃ , Ṽ ) = arg max P REFIX L EN(X, X̃),           (6)
                           X̃∈Pprefix                                      4.1    Threat Model
                                                                            We formally define the threat model guiding our analysis,
where P REFIX L EN( ) returns the length of the longest com-
                                                                           including the system model, the attacker’s goal, capability,
mon prefix. The key and value vectors (k̂ t , v̂t ) at position t
                                                                           and knowledge.
during the prefill phase are defined as:
                   (                                                       System Model. We consider a realistic deployment scenario
                    (K̃ t , Ṽ t ), 1 ≤ t ≤ P REFIX L EN(X, X̃),           where the LLM inference infrastructure integrates two op-
   (k̂ t , v̂t ) =                                               (7)
                    (k t , vt ),    otherwise,                             timization components to improve system throughput and
                                                                           reduce computational cost:
where (K̃ t , Ṽ t ) denotes the cached key and values vectors at          • Position-Independent KV Cache. LLM inference systems
position t from the cache pool, and (k t , vt ) denotes the vectors          adopt this novel mechanism to decouple memory retrieval
computed on-the-fly for unmatched tokens.                                    from strict positional constraints, thereby maximizing cache
Position-Independent KV Cache To overcome the low                            reuse and reducing inference latency.
cache hit rates by strict prefix matching, position-independent            • Multi-Tenant Cache Sharing. The system adopts a multi-
KV cache [14, 49, 58, 62] enables the matching of cached                     tenant architecture in which the KV cache pool is globally
chunks against arbitrary subsequences of the input context.                  shared across users and sessions. This setting is common in
The system maintains a cache pool where the chunk serves as                  organizational or cloud-hosted LLM services, where users
the unit of storage:                                                         frequently draw from common knowledge sources, such as
                                                                            internal documentation, shared RAG corpora, or publicly
                     Pchunk = X̃, (K̃ , Ṽ ) ,              (8)              available materials (e.g., Wikipedia).
where X̃ is a cached token chunk with fixed-length Lchunk and              Attacker’s Goal. The attacker aims to persistently influence
(K̃ , Ṽ ) are the corresponding KV cache. When a new prompt               model outputs for future users by causing adversarially con-
X arrives, the LLM inference engine searches the cache pool                ditioned KV cache states to be stored and later reused. By
for reusable segments that match a subsequence within X. Let               submitting inputs derived from widely shared knowledge con-
Shit denote the set of all successfully hit KV cache chunks:               tent, the attacker ensures their cache states are likely to match
                                                                          future benign queries. When reused, these states hijacked gen-
           Shit = i, j, X̃, (K̃ , Ṽ ) | X̃ = Xi: j , X̃ ∈ Pchunk . (9)    eration toward attacker-controlled behavior rather than solely
                                                                           the victim’s prompt, resulting in a cross-user integrity attack.
where [i, j] denotes the position interval in the input X                  Unlike prompt injection, this influence occurs without any
matched to the cached chunk X̃. The key and value vectors                  adversarial text appearing in the victim’s input. We describe
(k̂ t , v̂t ) at position t during the prefill phase for every hit cache   how such infected chunks can be constructed without directly
chunk {i, j, X̃, (K̃ , Ṽ )} are defined as:                               modifying the cache in Section 5.
                                    (
                                     (K̃ t ′ , Ṽ t ′ ), i ≤ t ≤ j,        Attacker’s Capabilities. The attacker has no direct access
                    (k̂ t , v̂t ) =                                 (10)   to the shared KV cache and cannot read, modify, or tamper
                                     (k t , vt ),        otherwise,
                                                                           with cached states, model weights, or system configurations.
where t ′ = t − i + 1 is the relative token position.                      The attacker also cannot inject or alter the text of a victim’s
   However, context discrepancies between cached chunks                    query, either directly or indirectly (e.g., via prompt injection
and the actual user input may induce attention shift when                  or retrieval poisoning).
using a position-independent KV cache, thereby degrading                      The attacker can submit inputs to the LLM service and
generation quality. To mitigate this, researchers adopt selec-             observe the model’s feedback. We consider two settings:
tive recomputation [14, 57, 62], which recomputes tokens                   • White-box setting. The attacker has access to a local surro-
that are semantically important or show large divergence in                   gate model that is identical to the target model, including
their key and values vectors. These methods define a recom-                   model-internal signals such as gradients. The attacker uses
putation set R ⊆ [i, j] of positions that require recomputation.              this surrogate to optimize adversarial prefixes that condition
The Equation 10 is then refined as:                                           hijacked KV states.
                             (                                             • Black-box setting. The attacker has no access to the target
                              (K̃ t ′ , Ṽ t ′ ), t ∈ [i, j] \ R ,            model’s internal states or gradients and can only observe its
             (k̂ t , v̂t ) =                                       (11)
                              (kkt , vt ),        otherwise,                  outputs. In this case, adversarial prefixes are optimized on
   a locally accessible substitute model and then transferred                                                     (a)                                                            (b)
                                                                                               80                                                               1.00




                                                                                                                                     Total Variation Distance
   to the target system.
   In both settings, prefix optimization is performed only on




                                                                               Deviation (%)
                                                                                               60                                                               0.75
a local surrogate model and never touches the victim cache.
                                                                                               40                                                               0.50
During local optimization, the surrogate KV cache is cleared
between iterations to avoid unintended cache carryover. Inputs                                 20                                                               0.25
submitted by attacker may have their KV states stored in                                                    Key         Value
the shared cache pool, enabling cross-user reuse under the                                      0                                                               0.00
                                                                                                    0   7     14 21 28          35                                     0    25   50    75 100
system’s cache-matching policy.                                                                             Layer Index                                                Average KV Deviation (%)
Attacker’s Knowledge. The attacker must know that the tar-
get system uses a position-independent KV cache with cross-                    Figure 2: Empirical analysis of KV Cache deviation. (a) Pre-
user reuse. Other assumptions can be relaxed (see detailed                     fix → KV deviation: We prepend different prefixes to the
analysis in Section 7.4 and Section 7.5). The attacker does not                input text and measure the KV deviation relative to a prefix-
need to know other users’ query prompts, current cache con-                    free baseline. (b) KV deviation → output change: We inject
tents (which may originate from common shared knowledge                        varying levels of noise into the KV cache to investigate the
sources such as internal documents, shared code files, or pub-                 impact of numerical deviations on the final output. We ob-
lic corpora), prompt histories, or the internal configuration                  serve that the deviations inherent in the position-independent
of the LLM server, including the exact model, recomputa-                       KV cache are sufficient (i.e., when ≥ 20%) to alter model
tion strategy, or the precise cache chunk size and boundary                    outputs, potentially enabling adversarial exploitation.
(since sliding-window matching can identify reusable cached
chunks within a sufficiently long context).                                    internal representations. Therefore, the hit KV cache states
Generality and Practicality. The attack applies broadly to                     must be numerically identical to the ground-truth states:
systems that enable position-independent KV-cache reuse
across sessions, regardless of specific model architectures. It                                                   K̃ 1:S = K 1:S ,                     Ṽ 1:S = V 1:S .                    (13)
requires no privileged access and can be executed via normal
                                                                                  This demonstrates that under the prefix KV cache reuse
user queries, making it feasible in real-world deployments
                                                                               mechanism, the hit KV cache during the prefill phase is
that use cross-user cache sharing for efficiency.
                                                                               strictly governed by the user’s inputs. Consequently, an at-
                                                                               tacker cannot manipulate the LLM’s output without system-
4.2     New Attack Surface                                                     level privileges to directly modify the KV cache. Therefore,
                                                                               we conclude that the prefix KV cache is secure.
                                                                                  Then we formalize the definition of a position-independent
   We now explain why the position-independent KV cache
                                                                               KV cache hit for a more detailed comparison.
reuse introduces a new attack surface within our threat model,
in contrast to prefix cache reuse. First, we provide the formal                Definition 2 (Position-Independent KV Cache Hit). Let X =
definition of prefix KV cache hit.                                             [x1 , . . . , xL ] be a newly arrived prompt and X̃ = [x̃1 , . . . , x̃L̃ ]
Definition 1 (Prefix KV Cache Hit). Let X = [x1 , . . . , xL ]                 be an unauthenticated token sequence in the shared cache
be a newly arrived prompt and X̃ = [x̃1 , . . . , x̃L̃ ] be an unau-           pool, with associated key and value matrices K̃ and Ṽ . A
thenticated token sequence in the shared cache pool, with                      position-independent cache hit occurs if there exists:
associated key and value matrices K̃ and Ṽ . A prefix cache
                                                                                                                           Xa:b = X̃m:n .                                                  (14)
hit occurs if there exists:

                              X1:S = X̃1:S .                          (12)     where Xa:b = [xa , . . . , xb ] and X̃m:n = [x̃m , . . . , x̃n ] denote con-
                                                                               tiguous segments of X and X̃, respectively.
where X1:S = [x1 , . . . , xS ] and X̃1:S = [x̃1 , . . . , x̃S ] denote con-
                                                                                  Suppose a position-independent cache hit occurs between
tiguous segments of X and X̃, respectively. And S is the length
                                                                               Xa:b and X̃m:n . By comparing Definition 1 and Definition 2,
of the longest common prefix between X and X̃.
                                                                               we observe that Equation 12 is a special case of Equation 14
   Let (K̃ , Ṽ ) denote the hit KV cache, and (K K ,V
                                                     V ) denote                where m = a = 1 and b = n = S. However, the conclusion
the ground-truth KV states computed on-the-fly without KV                      in Equation 13 does not extend to position-independent case.
cache. Suppose a prefix cache hit occurs between X and                         Considering the deterministic and causal nature of LLMs,
X̃ with prefix length S. According to Definition 1, X and X̃                   the generation of KV states is strictly conditioned on the
are strictly identical over their prefix of length S. Given the                preceding tokens. In general position-independent reuse sce-
deterministic and causal nature of standard decoder-only trans-                narios, the preceding contexts are distinct (X1:a−1 ̸= X̃1:m−1 ).
formers [47], identical input prefixes strictly yield identical                Assuming the injectivity of LLMs [32], this history mismatch
                                                                                                     Target LLM
                          Malicious Attacker                                                                                                     Benign User
                                                                                                    Infrastrucure

         Proxy LLM                       Malicious Target Answer                                Shared KV Cache Pool                    Common Knowledge Sources
        Infrastrucure                     Visit malicious link to reset.                                                                (Internal documentation, RAG corpora...)

                                                                                                Hijacked KV Cache for Chunk 1   Match
                                      Optimize
                                                                                     Affect                                                      Text Chunk 1
                                                                                                     Other KV Cache ...                 Please navigate to the official portal
                                              Optimized Prefix                                                                          and click the "Forgot Password" link.
           Compute
        Loss & Gradient                  Optimized on the target answer.            Text-KV       Store hijacked kv cache
                                                                                    Binding           into shared pool
                                                                                                                                                       Query
          Output Answer                           Text Chunk 1                                                                           How do I reset my password?
                                                                                                      Target LLM
                                        Please navigate to the official portal
                                        and click the "Forgot Password" link.
                                                                                                                                              Matches and Reuse
          Proxy LLM                                      ...                                                                                  malicious KV cache
                                                                                                                                Reuse
                                                      Query                                                                                        Recompute KV

                                         How do I reset my password?                                                                      Hijacked KV Cache for Chunk 1

                                                                                                                                                   Recompute KV
      Craft Prefix based on                                                                       Send malicious query
                                                                                                                                             Get malicious answer
      target answer of LLM                       Malicious Query                                  to target LLM system

                                          Prefix | Chunk 1 | ... | Query                                                                  Visit malicious link to reset.




Figure 3: H IJACK KV consists of two phases: (1) constructs an adversarial prefix p and submits a malicious query p ⊕ X̃ to the
LLM service; (2) the service processes p ⊕ X̃ into KV states and stores them in the shared cache pool Pchunk . When a user sends
a query X ⊕ q, if a cache hit occurs between X̃ and X as Definition 2, the user receives the malicious response r̃.

implies a divergence in the internal states. Consequently, even                               and stores them as chunks in the shared cache pool Pchunk .
though the token sequences within the matching span are                                       Subsequently, when a user sends a query X ⊕ q, if a cache hit
strictly identical, it inevitably leads to:                                                   occurs between X̃ and X as Definition 2, the user receives the
                                                                                              malicious response r̃.
                  K̃ m:n ̸= K a:b ,   Ṽ m:n ̸= V a:b .                          (15)           We formulate the problem of finding a prefix p that causes
                                                                                              the LLM to stably output the malicious response r̃ in the
   We investigate the security implications of this KV devia-
                                                                                              aforementioned scenario as an optimization problem:
tion in Figure 2. In Figure 2(a), we visualize the KV deviation
caused by cache reuse by pairing a text segment with vari-                                                              
                                                                                                                                           p
                                                                                                                                                
ous prefixes and calculating the average deviation compared                                            p∗ = arg min LCE LLM(X ⊕ q | TX̃ ), r̃ ,         (16)
                                                                                                                          p
to a prefix-free baseline. Complementing this, Figure 2(b)
                                                                                                                                                                                   p
examines the impact of such deviation on model outputs by                                     where X̃ denotes a subsequence of the user context X, TX̃
injecting varying levels of noise into the KV cache and mea-                                  represents the KV cache of X̃ obtained by querying the LLM
suring the Total Variation Distance of the next-token logits.                                                                    p
                                                                                              with p ⊕ X̃, and LLM(X ⊕ q | TX̃ ) indicates LLM inference
Our results highlight a critical vulnerability: while a mere                                                          p
                                                                                              with cache hits on TX̃ . X̃ can be chosen as frequently used
20% numerical deviation in KV states is sufficient to alter                                   context that provides answers to q, such as text from an FAQ
the LLM’s output, position-independent KV caches typically                                    interface, to further increase the attack success rate.
exhibit much higher deviations–approximately 50% in keys                                         We employ the Greedy Coordinate Gradient (GCG) al-
and 25% in values. This substantial discrepancy creates a                                     gorithm [65] to solve this optimization problem, a method
wide attack surface for adversaries to hijack model genera-                                   widely applied in discrete token optimization. The optimiza-
tions. Therefore, we conclude that the position-independent                                   tion process of H IJACK KV consists of two main components:
KV cache is inherently insecure.                                                              (1) an iterative GCG optimization loop that refines the adver-
                                                                                              sarial prefix through coordinate-wise gradient descent, and (2)
5   KV Cache Hijacking                                                                        a loss computation function that evaluates the effectiveness
                                                                                              of each candidate prefix under position-independent cache
Figure 3 illustrates H IJACK KV, our attack framework target-                                 reuse. Algorithm 1 presents the implementation of this algo-
ing position-independent KV cache reuse. A complete attack                                    rithm. We describe each component in detail below. In the
consists of two phases: (1) the attacker constructs an adversar-                              actual attack process, the attacker runs the algorithm locally
ial prefix p and submits a malicious query p ⊕ X̃ to the LLM                                  in a simulator using a surrogate model, thereby avoiding any
service; (2) the LLM service processes p ⊕ X̃ into KV states                                  impact on the remote server-side model or cache pool.
 Algorithm 1: H IJACK KV P REFIX O PTIMIZATION                         Evaluation of Malicious KV Cache. The C OMPUTE L OSS
                                                                       function (Lines 14 - 21) is the core component that evalu-
   Input: Target text X̃, target query q, target malicious
                                                                       ates the effectiveness of a candidate prefix under position-
           answer r̃, prefix length L, optimize step T ,
                                                                       independent cache reuse. This function simulates the com-
           number of candidate prefixes B
                                                                       plete attack pipeline from prefix injection to victim query
   Output: Optimized prefix p
                                                                       inference. We now describe each step in detail.
 1 p ← I NITIALIZE P REFIX (L) ;
                                                                          Step 1: Compute continuous embedding of the malicious
 2 for t = 1 to T do
                                                                       prefix p (Line 15). Since gradient-based optimization requires
 3     L ← C OMPUTE L OSS(p, X̃, q, r̃) ;
                                                                       differentiable operations, the discrete token sequence p is
 4     ∇ p ← ∇O NE H OT(p) L ;
                                                                       first converted to a continuous representation. The one-hot
 5     for l = 1 to L do
              l                                                        encoding of p is multiplied by the model’s embedding matrix
 6         Vcand  ← T OP K(−∇ p ) ;
                                                                       Wembed to obtain continuous embeddings e p ∈ RL×d , where
 7      P ← 0/ ;                                                       d is the embedding dimension. This operation enables the
 8      for b = 1 to B do                                              direct computation of the gradient of the loss function with
 9          l ← U NIFORM R ANDOM(L) ;                                  respect to each token.
10          x′ ← R ANDOM S ELECT(Vcand         l   );                     Step 2: Compute hijacked KV cache (Lines 16 - 18).
                                           ′
            P ← P ∪ {[x1 , . . . , xl−1 , x , xl+1 , . . . , xL ]} ;
11                                                                     The prefix embeddings e p are concatenated with the embed-
12      p ← arg min p∈P C OMPUTE L OSS(p, X̃, q, r̃) ;                 dings of the target chunk X̃ to form the complete context
                                                                       e context = e p ⊕ E MBEDDING(X̃), where ⊕ denotes sequential
13   return p ;                                                        concatenation along the token dimension. This concatenated
14 Function C OMPUTE L OSS(p, X̃, q, r̃)                               sequence is then fed through the LLM to generate the com-
15    e p ← O NE H OT(p) ·Wembed ;                                     plete key-value pairs (K ,V ) for all layers. Critically, only the
16    e context ← e p ⊕ E MBEDDING(X̃) ;                               KV pairs corresponding to the target chunk c are extracted and
                                                                                             p
17    (K ,V ) ← C OMPUTE KV(LLM(e context )) ;                         cached, yielding Tc = (K L+1:L+|X̃| ,V L+1:L+|X̃| ). The slicing
18    TX̃p ← (K L+1:L+|X̃| ,V L+1:L+|X̃| ) ;                           operation L + 1 : L + |X̃| selects the KV states from position
                             p
19    r ← LLM(X̃ ⊕ q | TX̃ ) ;                                         L + 1 (begin with the end of prefix) to position L + |X̃| (the
20    L ← C ROSS E NTROPY(r, r̃) ;                                     end of the chunk), discarding the prefix’s KV states while
21    return L ;                                                       retaining its adversarial influence encoded in the chunk’s rep-
                                                                       resentations. This computation strategy aligns with real-world
                                                                       KV cache systems that cache document chunks X̃ without
                                                                       explicitly storing malicious prefix p.
                                                                          Step 3: Simulate victim’s inference (Line 19). To evaluate
Greedy Coordinate Gradient Optimization. The main opti-
                                                                       the attack’s effectiveness, the function simulates a victim’s
mization loop (Lines 2 - 12) iteratively refines the adversarial
                                                                       query by performing inference with the malicious cache reuse.
prefix p over T iterations.
                                                                       The shared context X̃ is concatenated with the target query q,
   Since the prefix consists of discrete tokens, the gradient is       and the LLM generates output response r while reusing the
                                                                                               p
computed through the continuous relaxation obtained by em-             hijacked KV cache Tc . Notably, in real-world cache reuse
                                                                                               p
bedding the one-hot vectors. At each iteration t, the algorithm        scenarios, the cache Tc may have undergone processing such
first computes the loss L and its gradient ∇ p with respect to         as recomputation [14, 62] or compression [26, 63]. Conse-
the one-hot encoded prefix O NE H OT(p) (Lines 3 - 4).                 quently, the attacker can replicate these operations during this
   For each position l in the prefix, the algorithm identifies         optimization step to enhance the robustness of the attack. By
the top-k candidate tokens that would most decrease the loss,          simulating position-independent cache reuse, we can evaluate
                                                                                          p
based on the negative gradient values (Lines 5 - 6).                   the impact of Tc on the LLM in real-world scenarios.
                                                                          Step 4: Compute loss (Line 20 - 21). Finally, we compute
   To explore the discrete space efficiently, the algorithm con-       the cross-entropy loss L to measure the divergence between
structs a candidate set P by randomly sampling B positions             the model’s current output distribution r and the designated
and substituting each with a randomly selected token from its          malicious target r̃. Minimizing L provides the essential gradi-
                    l
top-k candidates Vcand  (Lines 7 - 11).                                ent signals required to iteratively refine the adversarial prefix
   The candidate prefix that achieves the minimum loss is              and achieves alignment with the attacker’s target objective.
then greedily selected as the new prefix for the next iteration           Algorithm 1 produces an adversarial prefix p by optimizing
(Line 12). Upon completion of the iterations, we obtain an             the prefix p through GCG. When p serves as the prefix for the
effective malicious prefix p (Line 13). This GCG optimization          context X̃, it ensures that the KV state of X̃ is manipulated,
enables efficient search within the exponentially large and            such that upon a position-independent cache hit, the model’s
discrete token space.                                                  output is hijacked to the attacker’s desired r̃.
6   Experimental Setup                                            baseline capability on the QA task and assesses the impact of
                                                                  different KV cache system settings on benign performance.
Datasets. We employed four question-answering (QA) bench-         (2) Untargeted Attack Success Rate (U-ASR): Defined as
mark datasets for evaluation. HotpotQA [61] and SQuAD             the condition where y ̸= x. This metric measures the effec-
(v1.1 and v2.0) [39, 40] serve as general domain QA bench-        tiveness of the attack in successfully altering the model’s
marks, while MedQA [18] and PubMedQA [19] represent               output, indicating a deviation from the original generation. (3)
specific domain datasets from the medical field.                  Targeted Attack Success Rate (T-ASR): Defined as the con-
   To evaluate the effectiveness of the attack, we randomly       dition where y = r̃ and y ̸= x. This serves as a stricter metric,
sampled 200 instances from each dataset. Each instance was        quantifying the attack’s success in manipulating the model to
formatted as a triplet consisting of a question, a ground-truth   generate the specific malicious answer from the attacker.
answer, and a context containing that answer. We employed an
                                                                  Environment. All experiments are conducted on a server
LLM to generate a specific incorrect answer for each question.
                                                                  equipped with an AMD EPYC 9334 32-Core Processor run-
These questions can be classified into three categories, with
                                                                  ning Ubuntu 22.04.5 LTS, with four NVIDIA RTX PRO 6000
distinct strategies applied to generate the incorrect answers:
                                                                  Blackwell Workstation Edition GPUs.
(1) Binary Questions (e.g., Yes/No or A/B): We generated
the logical opposite of the ground-truth answer. (2) Multiple-
Choice Questions: We randomly selected one of the incorrect       7     Experiment
options. (3) Open-Ended Questions: We generated an incor-
rect answer that shares the same part-of-speech or semantic       We conduct a comprehensive evaluation to demonstrate the se-
category as the ground truth. For example, given the ques-        vere security threat H IJACK KV poses to position-independent
tion and ground-truth answer “What is the capital of France?      KV cache reuse systems. Crucially, we highlight that this
Paris”, we prompted the LLM to generate an incorrect entity       threat cannot be mitigated by existing text-level defenses,
such as “Hawaii.” The specific prompts used for this process      sanitizers, or alignment mechanisms, as H IJACK KV funda-
are shown in Appendix D.                                          mentally manipulates the internal KV representations rather
                                                                  than the textual input. To systematically analyze the impact
Models. We use a diverse set of state-of-the-art open-source
                                                                  of this vulnerability, our evaluation is guided by the following
LLM families, including Qwen [56], LLaMA [9], and Mis-
                                                                  research questions:
tral [30], for evaluation. These models cover a wide spectrum
of parameter sizes, ranging from 1B to 70B. We designed           • RQ1 (Effectiveness): Can H IJACK KV exploit the identi-
a specific system prompt to instruct the LLMs to prioritize          fied vulnerability to manipulate model outputs?
answer extraction from the provided context and to ensure         • RQ2 (Robustness): Can H IJACK KV maintain its effective-
the generated responses are concise. The prompt used for this        ness across diverse KV cache system configurations?
process are detailed in Appendix D.                               • RQ3 (Persistence): Can H IJACK KV sustain its malicious
                                                                     impact throughout multi-turn interactions?
KV Cache System. We formalize a comprehensive KV cache            • RQ4 (Transferability): Can H IJACK KV successfully ma-
system defined by the following four key components: (1) Re-         nipulate model outputs under black-box settings?
computation Method (R ): We implement two recomputa-
                                                                  Unless otherwise specified, RQ1-RQ3 are evaluated under
tion strategies based on Cacheblend [62] and EPIC [14]. Ad-
                                                                  the white-box setting, while RQ4 evaluates the black-box
ditionally, we introduce a Random method, which randomly
                                                                  setting. Furthermore, we conduct comprehensive ablation
selects tokens for recomputation. We designate the baseline
                                                                  studies to evaluate the impact of attack hyperparameters
without any recomputation as Vanilla and the baseline with
                                                                  on H IJACK KV. Finally, we study adaptive attacks against
full recomputation as Full. (2) Chunk Size (Lchunk ): This is
                                                                  recomputation-based defenses and examine whether existing
the length of the minimal unit segment required to trigger a
                                                                  defense mechanisms and cache compression methods can
cache hit. (3) Cache Ratio (δ): This denotes the proportion of
                                                                  mitigate the negative impact introduced by H IJACK KV.
chunks within the user’s context that are replaced by matched
cache entries. It can be calculated as δ = (b − a + 1)/L. (4)
Recomputation Ratio (ρ): This indicates the proportion of         7.1    RQ1: Effectiveness
matched cached tokens that undergo recomputation.
                                                                  Setup. RQ1 investigate the effectiveness of the H IJACK KV
Metrics. Let r denote the ground-truth answer and r̃ denote       across different models, datasets, and recomputation methods.
the target malicious answer. Let x represent the model’s re-      Experiments are conducted on four QA benchmarks: Hot-
sponse in the benign setting, and y represent the response        potQA [61], SQuAD (v1.1 and v2.0) [39, 40], MedQA [18],
under the proposed attack. We employ the following three          and PubMedQA [19]. Regarding hyperparameters, we set the
metrics to evaluate the effectiveness of the attack and the       cache ratio δ = 0.3, the recomputation ratio ρ = 0.1, and the
preservation of model utility: (1) Accuracy (Acc): Defined as     chunk size Lchunk = 32 as the default settings [14,62]. We eval-
the condition where x = r. This metric evaluates the model’s      uate the effectiveness of H IJACK KV without using KV cache
Table 1: [RQ1] Effectiveness of H IJACK KV. This table shows the attack effectiveness of H IJACK KV across four different
datasets, three different models, and three different recomputation methods. The KV cache system are conducted under default
settings with a cache ratio δ = 0.3 and a recomputation ratio ρ = 0.1. Acc is the model’s task accuracy reported to measure the
impact of position-independent KV reuse on model utility. U-ASR and T-ASR is reported as the attack performance metrics.
                      HotpotQA                       SQuAD                          MedQA                         PubMedQA
Method
               Acc     U-ASR      T-ASR     Acc     U-ASR        T-ASR     Acc      U-ASR      T-ASR       Acc     U-ASR       T-ASR
Llama-3.1-8B
Full           0.73       –          –      0.76        –          –       0.71        –          –       0.92         –          –
Vanilla        0.58     1.00       1.00     0.60      0.98       0.96      0.55      0.98       0.90      0.74       0.93       0.92
Random         0.63     0.95       0.94     0.69      0.98       0.89      0.63      0.93       0.87      0.79       0.92       0.89
EPIC           0.66     0.87       0.85     0.72      0.89       0.75      0.70      0.96       0.82      0.87       0.96       0.91
CacheBlend     0.68     0.92       0.89     0.72      0.94       0.85      0.68      0.88       0.80      0.89       0.92       0.86
Ministral-8B
Full           0.70       –          –      0.67        –          –       0.68        –          –       0.94         –          –
Vanilla        0.57     1.00       1.00     0.55      0.98       0.93      0.54      1.00       1.00      0.71       0.97       0.94
Random         0.61     0.97       0.97     0.62      0.89       0.87      0.63      1.00       1.00      0.75       0.91       0.88
EPIC           0.67     0.96       0.95     0.65      0.88       0.78      0.63      1.00       1.00      0.84       0.92       0.87
CacheBlend     0.66     0.94       0.94     0.66      0.93       0.87      0.65      1.00       1.00      0.85       0.89       0.85
Qwen3-8B
Full           0.82       –          –      0.84        –          –       0.73        –          –       0.95         –          –
Vanilla        0.61     0.96       0.94     0.68      1.00       1.00      0.57      0.97       0.96      0.75       1.00       1.00
Random         0.72     0.91       0.85     0.74      0.95       0.90      0.66      0.86       0.83      0.85       0.93       0.89
EPIC           0.75     0.88       0.87     0.75      0.92       0.86      0.71      0.93       0.84      0.92       0.95       0.93
CacheBlend     0.80     0.91       0.89     0.82      0.93       0.87      0.70      0.92       0.87      0.92       1.00       0.91


(Full), with full KV cache reuse (Vanilla), and with three re-      Lchunk from the set {32, 64, 128, 256, 512} while exploring
computation methods (Random, EPIC, and CacheBlend). We              both δ and ρ within the values of {0.1, 0.2, 0.3, 0.4, 0.5}. We
use white-box setting and report Acc for model performance,         use white-box setting and report Acc for model performance,
and U-ASR and T-ASR for the effectiveness of H IJACK KV.            and U-ASR and T-ASR for the effectiveness of H IJACK KV.
Results. Table 1 shows that H IJACK KV demonstrates strong          Impact of Chunk Size Lchunk . Table 2 presents the experi-
attack performance across all evaluated scenarios. Specifi-         mental results regarding the impact of chunk size Lchunk on
cally, on the Llama-3.1-8B model, H IJACK KV achieves an            the effectiveness of H IJACK KV. This parameter determines
average T-ASR of 89% across the four datasets, even when            the minimum granularity for storage, matching, and reuse in
countering the four distinct recomputation methods. While           the position-independent KV cache.
advanced recomputation strategies like EPIC and CacheBlend             As Lchunk increases from 32 to 512, we observe that both
result in a slight reduction in ASR compared to the Vanilla         the main task Acc and the ASR of H IJACK KV remain stable.
setting, H IJACK KV still maintains effectiveness. This trend       Although the ASR decreases slightly when Lchunk is large, we
is further supported by the results on Qwen3-8B, where the          attribute this to partial cache misses at the head and tail of the
attack frequently achieves near-perfect success rates (e.g.,        hijacked KV cache, i.e., incomplete cache reuse caused by
100% T-ASR on PubMedQA), proving that H IJACK KV re-                coarse cache granularity. Overall, these results demonstrate
mains robust despite the slight drop introduced by partial          that H IJACK KV is robust to variations in chunk size.
recomputation.
                                                                    Impact of Cache Ratio δ. Table 3 illustrates the experimental
Conclusion. In conclusion, H IJACK KV is a highly effective,        results regarding the impact of cache ratio δ on the effective-
model-agnostic attack that hijacks LLM generation across            ness of H IJACK KV. This parameter determines the proportion
diverse domains. Our findings indicate that standard partial        of the user’s prefilled KV cache occupied by the hijacked KV
recomputation mechanisms, at current ratios, are insufficient       cache. Since existing position-independent KV cache meth-
to mitigate the adversarial cache optimized by H IJACK KV.          ods typically achieve cache hit rates of up to 60% [57], we
                                                                    vary the cache ratio from 10% to 50% to evaluate the robust-
                                                                    ness of H IJACK KV.
7.2      RQ2: Robustness
                                                                       We find that H IJACK KV maintains a high ASR even at low
Setup. RQ2 conducts experiments to analyze the impact of            cache hit rate, where only a small proportion of the user’s
the chunk size Lchunk , cache ratio δ, and recomputation ratio      KV cache is affected. For example, at δ = 0.1 and ρ = 0.3,
ρ of the position-independent cache system on H IJACK KV.           where the malicious cache occupies only 7% of the user’s KV
All experiments are performed on the HotpotQA dataset with          context, the average T-ASR remains at 67%. As cache ratio in-
Llama-3.1-8B. We vary the hyperparameters by selecting              creases, ASR of H IJACK KV rises rapidly, approaching 100%
Table 2: [RQ2-1] Robustness of H IJACK KV to Chunk Size Lchunk . This table shows the robustness to chunk size using 200
samples from the HotpotQA dataset. The experiments employ Llama-3.1-8B under default settings with a cache ratio δ = 0.3
and a recomputation ratio ρ = 0.1. Acc is the model’s task accuracy to measure the impact of position-independent KV reuse on
model utility, where the performance without KV cache is 0.73. U-ASR and T-ASR is reported as the attack performance metrics.
                    Lchunk = 32                  Lchunk = 64                  Lchunk = 128                 Lchunk = 256                 Lchunk = 512
Method
             Acc    U-ASR         T-ASR   Acc    U-ASR         T-ASR   Acc     U-ASR      T-ASR     Acc     U-ASR      T-ASR     Acc     U-ASR      T-ASR
Vanilla      0.58     1.00        1.00    0.58     1.00        1.00    0.58     1.00         1.00   0.59     1.00         1.00   0.57     1.00         1.00
Random       0.63     0.95        0.94    0.61     0.95        0.95    0.64     0.94         0.93   0.63     0.94         0.92   0.62     0.93         0.90
EPIC         0.66     0.87        0.85    0.67     0.89        0.88    0.68     0.87         0.86   0.66     0.88         0.87   0.71     0.85         0.84
CacheBlend   0.68     0.92        0.89    0.68     0.91        0.91    0.70     0.92         0.90   0.68     0.89         0.85   0.69     0.91         0.89



Table 3: [RQ2-2] Robustness of H IJACK KV to Cache Ratio δ. This table shows the robustness to cache ratio using 200
samples from the HotpotQA dataset. The experiments employ Llama-3.1-8B under default settings with a recomputation ratio
ρ = 0.1. Acc is the model’s task accuracy to measure the impact of position-independent KV reuse on model utility, where the
performance without KV cache is 0.73. U-ASR and T-ASR is reported as the attack performance metrics.
                     δ = 0.1                      δ = 0.2                       δ = 0.3                      δ = 0.4                      δ = 0.5
Method
             Acc    U-ASR         T-ASR   Acc    U-ASR         T-ASR   Acc     U-ASR      T-ASR     Acc     U-ASR      T-ASR     Acc     U-ASR      T-ASR
Vanilla      0.64     0.82        0.81    0.61     0.95        0.93    0.58     1.00         1.00   0.46     1.00         1.00   0.38     1.00         1.00
Random       0.68     0.63        0.61    0.65     0.81        0.78    0.63     0.95         0.94   0.59     0.95         0.95   0.52     0.98         0.97
EPIC         0.73     0.56        0.53    0.71     0.80        0.78    0.66     0.87         0.85   0.63     0.93         0.91   0.61     0.99         0.96
CacheBlend   0.72     0.73        0.71    0.71     0.80        0.78    0.68     0.92         0.89   0.65     0.96         0.93   0.60     1.00         0.99



at δ = 0.5. Additionally, we observe that the recomputation                     in the first case. This is because recomputation refreshes
method EPIC becomes more effective as the low cache ratio.                      more high-influence (including malicious) KV cache entries,
We attribute this to its recomputation of the first k tokens                    whereas a reduced cache hit ratio still preserves many of them.
in each cache chunk, which better preserves benign context
                                                                                Conclusion. Extensive experiments validate the robustness
coherence at lower cache ratios, thereby enhancing resistance
                                                                                of H IJACK KV across varying system configurations. Whether
against H IJACK KV. In summary, even at lower cache ratios,
                                                                                subjected to low cache ratios, high recomputation penalties,
H IJACK KV still mounts effective attacks, demonstrating its
                                                                                or varying chunk sizes, H IJACK KV maintains strong attack
robustness to such reductions.
                                                                                effectiveness. This consistency demonstrates that H IJACK KV
Impact of Recomputation Ratio ρ. Table 3 demonstrates the                       poses a widespread threat that cannot be easily mitigated.
experimental results regarding the impact of recomputation
ratio ρ on the effectiveness of H IJACK KV. This parameter                      7.3       RQ3: Persistence
determines the recomputation ratio for the reused KV cache.
While existing methods claim that a recomputation ratio from                    Setup. RQ3 investigates the persistence of the malicious im-
10% to 15% is sufficient to prevent performance degradation                     pact induced by H IJACK KV within a multi-turn conversation
on the main task, we vary the recomputation ratio from 10%                      scenario. To simulate multi-turn interactions, we first hijack
to 50% to evaluate the robustness of H IJACK KV.                                the user’s KV cache using H IJACK KV. Then we insert filler
   We observe that increasing the recomputation ratio brings                    tokens of length Lcontext that are unrelated to the hijacked tar-
significant computational overhead but does not eliminate the                   get topic before issuing the target query, and observe whether
malicious impact of H IJACK KV. Specifically, the average                       the attack influence is diluted in the model’s response. All
T-ASR remains high at 70% when the recomputation ratio                          experiments are conducted on the HotpotQA dataset using
is tripled to ρ = 0.3 and persists at 39% even when the ratio                   Llama-3.1-8B and the same hyperparameters as in Section 7.1.
is raised to ρ = 0.5, which is 5× the baseline. H IJACK KV                      We evaluate the effectiveness of H IJACK KV without KV
shows robustness to an increase in the recomputation ratio.                     cache (Full), with full KV cache (Vanilla), and with three re-
                                                                                computation methods (Random, EPIC, and CacheBlend). We
   Furthermore, we find that increasing ρ is a more effective
                                                                                use white-box setting and report Acc for model performance,
defense than reducing δ. We compare two settings where
                                                                                and U-ASR and T-ASR for the effectiveness of H IJACK KV.
the attacker controls a similar proportion of effective tokens:
(1) δ = 0.3, ρ = 0.5 (15% hijacked KV cache) and (2) δ =                        Results. Table 5 illustrates the impact of multi-turn conver-
0.2, ρ = 0.3 (14% hijacked KV cache). Despite the similar                       sation length Lcontext on the effectiveness of H IJACK KV. In
proportions of hijacked KV cache, the T-ASR is 39% lower                        our experiments, we increase the length of the unrelated filler
Table 4: [RQ2-3] Robustness of H IJACK KV to Recomputation Ratio ρ. This table shows the robustness to recomputation
ratio using 200 samples from the HotpotQA dataset. The experiments employ Llama-3.1-8B under default settings with cache
ratio δ = 0.3. Acc is models’ task accuracy reported to measure the impact of position-independent KV reuse on model utility,
where the performance stands at 0.73 without KV cache and 0.58 without recomputation. U-ASR and T-ASR are reported as
attack performance metrics, both of which reach 100% on the vanilla position-independent KV cache without recomputation.
                     ρ = 0.1                         ρ = 0.2                        ρ = 0.3                        ρ = 0.4                     ρ = 0.5
Method
             Acc    U-ASR          T-ASR   Acc     U-ASR       T-ASR      Acc     U-ASR       T-ASR      Acc      U-ASR      T-ASR   Acc      U-ASR      T-ASR
Random       0.63     0.95         0.94    0.66      0.73          0.72   0.69      0.66          0.65   0.70       0.45      0.43   0.72       0.35      0.31
EPIC         0.66     0.87         0.85    0.70      0.82          0.81   0.72      0.72          0.71   0.73       0.63      0.63   0.73       0.51      0.49
CacheBlend   0.68     0.92         0.89    0.71      0.83          0.81   0.72      0.74          0.73   0.72       0.57      0.55   0.72       0.40      0.38



Table 5: [RQ3] Persistence of H IJACK KV. This table evaluates the impact of multi-turn dialogue length on the performance of
H IJACK KV performance using 200 samples from the HotpotQA dataset. The experiments employ Llama-3.1-8B under default
settings with a cache ratio δ = 0.3 and recomputation ratio ρ = 0.1. Acc is the model’s task accuracy reported to measure the
impact of position-independent KV reuse on model utility. U-ASR and T-ASR is reported as the attack performance metrics.
                    Lcontext = 0                  Lcontext = 256                 Lcontext = 512                 Lcontext = 1024             Lcontext = 2048
Method
             Acc    U-ASR          T-ASR   Acc     U-ASR       T-ASR      Acc     U-ASR       T-ASR      Acc      U-ASR      T-ASR   Acc      U-ASR      T-ASR
Full         0.73       –            –     0.73        –             –    0.71        –             –    0.68         –         –    0.65         –         –
Vanilla      0.58     1.00         1.00    0.58      1.00          0.98   0.55      0.82          0.76   0.51       0.69      0.63   0.49       0.62      0.48
Random       0.63     0.95         0.94    0.62      0.90          0.89   0.62      0.80          0.64   0.59       0.66      0.48   0.58       0.63      0.46
EPIC         0.66     0.87         0.85    0.66      0.85          0.84   0.83      0.77          0.68   0.64       0.67      0.58   0.62       0.63      0.48
CacheBlend   0.68     0.92         0.89    0.68      0.91          0.88   0.68      0.79          0.62   0.63       0.65      0.52   0.61       0.64      0.46



context from 0 up to 2048 tokens. We find that even with a                         We use black-box setting and report U-ASR and T-ASR for
context length of 1024, the average T-ASR remains high at                          the effectiveness of H IJACK KV.
55%. Furthermore, when the context length extends to 2048,
the T-ASR remains at 47%. Notably, once the context reaches                        Results. Table 6 presents experimental results demonstrating
a certain length, doubling it results in only a marginal 8%                        that H IJACK KV exhibits robust cross-model transferability.
decline in the ASR.                                                                When the target LLM is the large-parameter Llama-3.3-70B,
                                                                                   H IJACK KV maintains high efficacy, achieving 75% U-ASR
Conclusion. These findings confirm that once cached, the hi-                       and 37% T-ASR. Similarly, H IJACK KV achieves 76% U-
jacked KV cache retains sufficient influence to manipulate the                     ASR and 37% T-ASR against models with comparable pa-
LLM’s token generation process over long-range interactions,                       rameter counts but distinct architectures like Qwen3-8B and
despite the presence of extensive unrelated context.                               14B. These results indicate that the prefix p optimized by
                                                                                   H IJACK KV poses a significant threat in black-box settings
7.4      RQ4: Transferability                                                      and enables attack transferability across models of varying
                                                                                   parameter sizes and architectures.
                                                                                      We observe a performance divergence when transferring
Setup. RQ4 focuses on the cross-model transferability of                           the attack to smaller target models. Specifically, on Qwen3-4B
H IJACK KV, specifically examining its attack effectiveness                        and Llama-3.2-1B, while H IJACK KV achieves a high U-ASR
under the black-box setting described in Section 4.1. We                           of approximately 90%, the T-ASR drops significantly to 13%.
optimize the prefix p on a proxy model and send the con-                           We attribute this low T-ASR to the capability gap between
structed malicious query p ⊕ X̃ to the target model. We then                       models, as indicated by the main task performance in Table 7.
evaluate the success rate of the target LLM generating the                         Drawing on the Platonic Representation Hypothesis [15],
response r̃ for the query X ⊕ q, under the condition that a                        which suggests that increasingly capable models converge
position-independent cache hit (as defined in Definition 2)                        toward a shared representation space, we argue that prefixes
occurs between X and X̃. We employ Llama-3.1-8B as the                             optimized on larger proxy models are effective against simi-
proxy model for prefix optimization. All experiments are con-                      larly capable or stronger targets. However, the representation
ducted on the HotpotQA dataset using Llama-3.1-8B and the                          spaces of smaller models likely diverge from that of the proxy,
same hyperparameters as in Section 7.1. We evaluate the ef-                        making it difficult to precisely steer them to generate the
fectiveness of with full KV cache (Vanilla), and with three                        specific target response r̃. Conversely, the U-ASR remains
recomputation methods (Random, EPIC, and CacheBlend).                              high because the prefix p successfully perturbs the KV cache.
Table 6: [RQ-4] Transferability of H IJACK KV. This table evaluates cross-model transferability of H IJACK KV performance
using 200 samples from the HotpotQA dataset. The experiments employ Llama-3.1-8B as the proxy model under default settings
with a cache ratio δ = 0.3 and a recomputation ratio ρ = 0.1. U-ASR and T-ASR is reported as the attack performance metrics.
                           Qwen3-4B                     Qwen3-8B                 Qwen3-14B               Llama-3.2-1B          Llama-3.2-3B            Llama-3.3-70B
Method
                        U-ASR       T-ASR        U-ASR           T-ASR         U-ASR     T-ASR       U-ASR         T-ASR     U-ASR          T-ASR    U-ASR     T-ASR
Llama-3.1-8B
Vanilla                  0.91        0.10          0.87          0.33           0.70     0.40            0.97       0.18      0.90           0.44     0.79      0.37
Random                   0.89        0.11          0.87          0.37           0.64     0.41            0.93       0.17      0.89           0.42     0.73      0.35
EPIC                     0.88        0.14          0.83          0.32           0.64     0.34            0.89       0.14      0.90           0.46     0.72      0.37
CacheBlend               0.85        0.09          0.87          0.38           0.62     0.39            0.90       0.13      0.89           0.44     0.75      0.38


                             (a)                                         (b)                                      (c)                                 (d)
        1.00                                       1.00                                      1.00                                    1.00

        0.96                                       0.92                                      0.95                                    0.93
T-ASR




        0.92                                       0.84                                      0.90                                    0.86

        0.88                                       0.76                                      0.85                                    0.79

        0.84                                       0.68                                      0.80                                    0.72
               1        2     3     4       5             50 100     250 500 1000                   64     128    256 512 1024              0.20 0.35 0.50 0.65 0.80
                        Prefix Length                       GCG Optimization Steps                               Top-k                             Search Width
                                                          Vanilla         Random                    EPIC               CacheBlend

Figure 4: Ablation studies of H IJACK KV hyperparameters. We evaluate the impact of four H IJACK KV hyperparameters on
effectiveness: (a) adversarial prefix length, (b) number of GCG optimization steps, (c) top-k candidates, and (d) search width.

                                                                                             GCG optimization, (2) robustness to paraphrased queries, and
Table 7: Main task performance of different models. This
                                                                                             (3) feasibility under real-world scenario. All experiments are
table presents the performance (measured by Acc) of various
                                                                                             conducted on the HotpotQA dataset using Llama-3.1-8B and
models on the HotpotQA main task and reports the perfor-
                                                                                             the same hyperparameters as in Section 7.1.
mance difference (∆) relative to Llama-3.1-8B.
                                Llama 3                             Qwen 3                   Impact of Adversarial Prefix Length L p . Since the attention
Metric
                   8B      1B        3B         70B         4B           8B       14B        mechanism attends to all preceding tokens, the prefix length
                                                                                             L p significantly impacts the effectiveness. To ensure the pre-
Acc             0.73      0.39       0.52        0.88      0.54      0.82         0.85
∆                 –      −0.34      −0.21       +0.15     −0.19     +0.09        +0.12
                                                                                             fix is correctly processed as a single chunk, we set L p as an
                                                                                             integer multiple of Lchunk (N × Lchunk ). Figure 4 (a) illustrates
                                                                                             that as L p increases, the T-ASR of H IJACK KV improves sig-
This induces substantial contextual hallucinations, causing                                  nificantly. However, a larger L p requires more optimization
the model to generate irrelevant or incorrect responses even                                 steps and increases the computation time per step.
if it fails to match the exact target string.
                                                                                             Impact of GCG Optimization Steps T . Since the adversar-
Conclusion. In summary, our experiments confirm that H I -                                   ial suffix p is generated via gradient-based greedy search,
JACK KV possesses strong transferability. This ensures that
                                                                                             the number of iterations directly determines the search depth
H IJACK KV remains a threat not only in white-box scenarios                                  within the discrete token space. As illustrated in Figure 4 (b),
but also in black-box settings where the attacker lacks access                               the T-ASR performance exhibits a trend of rapid initial growth
to the target model’s parameters and gradients.                                              followed by saturation. This indicates that while increasing
                                                                                             the number of iterations improves performance, the marginal
7.5            Ablation Studies                                                              returns gradually diminish after reaching a certain thresh-
                                                                                             old. Considering the trade-off between optimization time and
 In this section, we conduct ablation studies to evaluate the
                                                                                             efficacy, we select a balanced number of optimization steps.
impact of the hyperparameters of H IJACK KV that controlled
by the attacker on effectiveness: (1) the adversarial prefix                                 Impact of Top-k Candidates. This parameter controls the
length L p (default L p = Lchunk ), (2) the number of GCG opti-                              scope of the token substitution pool by selecting the k tokens
mization steps T (default T = 250), (3) the top-k candidates                                 with the largest negative gradients at each position. This pa-
(default k = 512), and (4) the search width η (default η = 0.5).                             rameter plays a pivotal role in balancing the trade-off between
We also investigate the following questions: (1) necessity of                                considering a diverse set of tokens and focusing on those
Table 8: Comparison with baseline prefixes. This table com-            Table 10: Real-world evaluation on HumanEval. This table
pares the optimized prefix with baseline prefixes and reports          presents the ASR of H IJACK KV on the HumanEval code
T-ASR and average prefix length.                                       generation task under different decoding temperatures τ.
                                 Random     Instruction   Plain-text      τ          0.3        0.7        1.0         1.5       Avg.
   Metric               GCG
                                  prefix      prefix       misinfo.
                                                                          ASR      98.1%       96.9%      95.1%      92.0%      95.5%
   T-ASR                100.0%       0.0%     17.5%        23.5%
   Avg. Prefix Length     32          32       10.9        103.4

                                                                       of code generation, thereby corrupting the final completion.
                                                                       To reflect realistic decoding conditions, we test multiple sam-
Table 9: Robustness to paraphrased queries. This table
                                                                       pling temperatures τ ∈ {0.3, 0.7, 1.0, 1.5} and report ASR. As
presents the T-ASR of H IJACK KV on HotpotQA after para-
                                                                       shown in Table 10, H IJACK KV achieves consistently high
phrasing each query into five semantically equivalent variants.
                                                                       ASR across all temperatures, with an average ASR of 95.5%,
                           # Paraphrases
      Dataset                                         T-ASR            demonstrating its robustness to stochastic decoding.
                             per query
      HotpotQA                   5                  94.0 ± 2.6%
                                                                       7.6      Mitigability
                                                                       Adaptive Attack Against Recomputation. In previous sec-
most likely to minimize the loss. Figure 4(c) shows that per-          tions, we observed that KV recomputation strategies can par-
formance peaks at an optimal candidate pool size. Beyond this          tially mitigate the attack performance of H IJACK KV. How-
point, performance slightly declines due to noise, indicating          ever, we demonstrate that an attacker can counteract this by
that a moderate size is sufficient.                                    adding recomputation into the GCG optimization process. By
Impact of Search Width η. The search width η represents                doing so, H IJACK KV generates adversarial suffixes that are
the ratio of candidates selected for loss verification. A higher       robust to recomputation.
ratio allows H IJACK KV to validate a broader segment of                  Figure 5 (a) indicates that this adaptation is highly efficient,
the candidates suggested by the gradients. As illustrated in           i.e., adding only 10% recomputation in the optimization steps
Figure 4 (d), we observe that a higher verification proportion         is sufficient to improve ASR up to 19%. Furthermore, the
yields higher T-ASR, as it prevents the optimization from              adaptive attack shows strong transferability. Even when the
discarding valid adversarial tokens that were underestimated           recomputation method or ratio used during optimization does
by the gradient approximation. However, a larger η increases           not match the target system’s configuration, the generated
the computational overhead during the verification phase.              adversarial prefix remains effective. These results indicate that
                                                                       the adaptive process encourages the identification of robust
Impact of GCG We compare the optimized GCG prefix with
                                                                       adversarial tokens instead of yielding solutions specialized to
three simple baselines: (1) a random prefix with the same to-
                                                                       a single recomputation setting.
ken length, (2) a short instruction-style prefix, “Please output
the answer as {XXX},” and (3) a longer plain-text misinfor-            Ineffectiveness of Existing Defenses and Cache Compres-
mation prefix. We report T-ASR and average prefix length               sion Methods. We further evaluate the resilience of H I -
in Table 8. GCG achieves 100% T-ASR with only 32 tokens,               JACK KV against two representative KV cache defense mech-
while the random prefix fails completely and the instruction-          anisms: RobustKV [17], which prunes KV entries with low at-
style and misinformation prefixes achieve only 17.5% and               tention scores to defend against jailbreak attacks, and CacheP-
23.5% T-ASR, respectively. This suggests that H IJACK KV               rune [50], which targets KV pairs associated with sensitive
relies on the optimized adversarial prefix rather than arbitrary       neurons to defend against prompt injection attacks.
or longer misleading text.                                                Figure 5 (b) shows that even when RobustKV and CacheP-
                                                                       rune remove 50% of the KV cache, the T-ASR decreases by
Impact of Paraphrased Queries. We further test whether
                                                                       only 19%, which is much lower than the security improve-
H IJACK KV is robust to natural variations in user wording
                                                                       ment provided by recomputation. RobustKV fails to prune
by paraphrasing each HotpotQA query into five semantically
                                                                       the hijacked KV cache generated by H IJACK KV because the
equivalent variants. Using the same attack setting, H IJACK KV
                                                                       malicious entries maintain high attention scores, effectively
achieves 94.0 ± 2.6% T-ASR on the paraphrased queries, as
                                                                       bypassing its detection mechanism. Similarly, CachePrune
shown in Table 9. This indicates that the attack does not rely
                                                                       struggles to defend against H IJACK KV because H IJACK KV
on exact surface-form matching of the original query.
                                                                       generates unique KV caches for every QA pairs, ensuring that
Impact of Temperatures on Code Task. We further evalu-                 these flexible malicious entries avoid triggering the specific
ate H IJACK KV in a realistic code-generation scenario using           sensitive neurons that CachePrune monitors.
HumanEval [4]. Specifically, we poison shared code-skill                  Figure 5 (c) demonstrates the ASR of H IJACK KV under
files to induce nonsensical prefixes during the early stage            various cache compression methods. By applying advanced
                                                           (a)                                                                (b)                                                (c)
                                                                                          1.0
                                                                                                        1.00                                               1.0
                      .3       0.65   0.85         0.94    0.72   0.92     0.84    0.95
                                                                                          0.8
                 @0                                                                                     0.75                                               0.8
            om
      R and                                                                               0.6




                                                                                                T-ASR




                                                                                                                                                   T-ASR
                                                                                                                                                           0.6
                 .3            0.71   0.76         0.85    0.84   1.00     0.85    0.92                 0.50
              @0                                                                          0.4
          EPIC                                                                                                                                             0.4
                                                                                                        0.25
                               0.73   0.77         0.82    0.78   0.88     0.89    0.99   0.2                                                              0.2
                  @0.3
         Bl   end                                                                         0.0
                                                                                                        0.00
                                                                                                                                                           0.0
      che                       la  0.1 0.3  0.1      0.3      0.1 0.3
                                                                                                               0.1      0.2    0.3    0.4    0.5                    la      O    M     V    V
 Ca                        ani
                               l                                                                                                                                 nil      H2 gLL napK idK
                      V
                             d o m@ dom@ PIC@ PIC@ lend@ lend@                                                            Defense Ratio                     Va               i n S    r a m
                        Ra
                           n
                                   Ra
                                      n   E    E
                                                    che
                                                        B
                                                             che
                                                                 B                                                   RobustKV               Vanilla
                                                                                                                                                                       Steam       Py
                                                 Ca       Ca                                                         CachePrune

Figure 5: (a) Adaptive Attack Against Recomputation (x-axis: recomputation ratio used in the attack; y-axis: target system).
Employing recomputation during optimization significantly boosts the robustness of H IJACK KV, maintaining a high ASR
even under mismatched recomputation ratios. (b) H IJACK KV Against Existing Defense. Even when RobustKV [17] and
CachePrune [50] evict up to 50% of the tokens, H IJACK KV maintains a high T-ASR of 79%. (c) H IJACK KV Against Cache
Compression. KV cache compression [2, 23, 55, 63] fails to eliminate the malicious impact of H IJACK KV.

                                                                                                    mitigate the attack. However, this improvement comes with a
Table 11: Mitigation performance with different recompu-
                                                                                                    clear computational trade-off.
tation ratios. This table presents the T-ASR and normalized
recomputation cost of two mitigation strategies, Hybrid and
Attn Score, with different recomputation ratios ρ.                                                  8          Limitations and Discussion
                                                      Recomputation Ratio ρ
      Method                Metric
                                             0.2           0.4       0.6           0.8              Cache Availability. The practicality of H IJACK KV depends
                            T-ASR       73.0%             54.5%    29.0%          11.5%             on whether the hijacked KV state can enter the shared cache
      Hybrid                                                                                        and be reused before eviction or overwritten. This creates
                            Cost        1.00x             1.84x    2.63x          3.53x
       Attn                 T-ASR       49.5%             35.5%    22.5%          13.0%
                                                                                                    a tradeoff: popular segments X are more likely to appear in
      Score                 Cost        1.15x             2.06x    2.97x          4.02x             victim contexts, but also more likely to already have benign
                                                                                                    cached entries; less popular segments are easier to insert, but
                                                                                                    less likely to be reused. Thus, H IJACK KV is most practical for
compression methods [2, 23, 55, 63] to the cache generated                                          moderately shared content, such as shared documents, RAG
by H IJACK KV, we observe that it maintains an average T-                                           sources, code files, or agent skill files. If X is already cached,
ASR of 97%. This resilience results from cache compression                                          the attacker can switch to a suitable segment Y or wait for an
algorithms prioritizing high-influence KV entries, which en-                                        insertion window. A stronger attacker could further increase
sures that hijacked entries are preserved and remain functional                                     the likelihood that X appears in the victim’s context through
within the user context.                                                                            retrieval poisoning techniques such as PoisonedRAG [66].
   These results highlight that H IJACK KV exploits a new                                           Cache Occupancy Probing. In our main experiments, we
threat in the KV cache reuse mechanism that current heuristic-                                      assume that the cache entry corresponding to the target seg-
based defenses cannot adequately address.                                                           ment X can be inserted by the attacker without colliding with
                                                                                                    an existing benign entry. In real deployments, however, the
Towards Secure KV Cache Reuse. We evaluate whether
                                                                                                    attacker may not know the current occupancy of the shared
recomputation-based defenses can mitigate the negative im-
                                                                                                    cache. A lightweight side-channel test can help infer cache oc-
pact introduced by H IJACK KV. We consider two recomputa-
                                                                                                    cupancy [11, 45]; in our preliminary experiments, it achieves
tion strategies. The first strategy Hybrid combines the recom-
                                                                                                    81.4% accuracy with a single query and a 95.4% hit recogni-
putation heuristics used by EPIC [14] and CacheBlend [62].
                                                                                                    tion rate within five attempts. However, probing is not fully
The second strategy Attn Score recomputes tokens that receive
                                                                                                    passive: probing queries may insert, refresh, or evict cache
high attention scores with respect to the user query. We vary
                                                                                                    entries, causing self-pollution and changing the cache state
the recomputation ratio ρ ∈ {0.2, 0.4, 0.6, 0.8}.
                                                                                                    before the attack. Therefore, practical attacks should use a
   We report T-ASR and normalized recomputation cost. The
                                                                                                    small probing budget.
recomputation cost is normalized by the cost of the Hybrid
strategy at ρ = 0.2. The results are shown in Table 11. Overall,                                    Eviction Policies and Deployment Scope. The feasibility of
increasing the recomputation ratio substantially reduces T-                                         H IJACK KV depends on the cache replacement policy. FIFO
ASR for both methods, confirming that recomputation can                                             may naturally create insertion windows; LRU makes fre-
quently refreshed chunks harder to replace; and LFU fur-          Mitigation (Implemented). We took steps to minimize harm
ther stabilizes high-frequency chunks. These dynamics shape       to the identified stakeholders and promote defensive progress.
when H IJACK KV is most practical, but they do not eliminate
                                                                  • For model providers and infrastructure operators, respon-
the attack surface. H IJACK KV is most relevant to real-time,
                                                                    sible disclosure: Prior to publication, we contacted the
position-independent, cross-user KV reuse, such as agent-
                                                                    founders of a startup commercializing position-independent
based or multi-turn serving, and is less applicable to chunk-
                                                                    cache reuse technology and shared our threat model, tech-
then-cache RAG pipelines where chunks are encoded inde-
                                                                    nical analysis, and empirical results. Follow-up discussions
pendently. A full assessment would benefit from trace-driven
                                                                    were scheduled to explore safer reuse designs.
evaluation under realistic workloads and eviction policies.
                                                                  • For end users, no real-world harm: All experiments used
                                                                    public datasets and public or locally deployed models in
9   Conclusion                                                      controlled offline environments. We did not use private user
                                                                    data, interact with real users, or test production services.
In this paper, we present H IJACK KV, the first KV cache hi-
                                                                  • For researchers and practitioners, defense analysis: We
jacking attack that operates without requiring system-level
                                                                    evaluate mitigation directions, including recomputation-
privileges. By exploiting the position-independent KV cache
                                                                    based protection, cache compression, and existing defensive
reuse mechanism, H IJACK KV effectively hijacks the LLM
                                                                    mechanisms, and provide system-level recommendations
outputs. Extensive experiments demonstrate the effectiveness,
                                                                    rather than only exploit guidance.
robustness, persistence, and transferability of H IJACK KV.
Furthermore, existing defenses, recomputation, and compres-       Recommended Future Safeguards. We suggest that real-
sion methods fail to eliminate this new threat. Our work high-    world systems incorporate safeguards that address the risks
lights the critical trade-off between efficiency and security     faced by both infrastructure operators and end users: (1) a hy-
in LLM system, urging the community to seek a balanced            brid mechanism that recomputes high-impact KV states while
design for future systems where efficiency does not come at       compressing irrelevant entries, ensuring that user-computed
the expense of security.                                          data constitutes the majority of the cache; and (2) a deviation-
                                                                  based rejection policy that denies reuse whenever recomputa-
                                                                  tion reveals deviation exceeding a predefined safety threshold.
Ethical Considerations
                                                                  Justification for Research. KV cache reuse improves LLM
We discuss ethical considerations by centering the impacts        efficiency but introduces underexplored security risks. Iden-
on each stakeholder across two phases: the research process       tifying and responsibly disclosing these risks is essential to
(attack design and evaluation) and the publication of results     ensure efficiency gains do not compromise system integrity.
(deployment implications). We then describe the mitigation
and conclude with justification for conducting this research.
Stakeholder Analysis. Consider three stakeholder groups:
                                                                  Open Science
• Model providers and infrastructure operators who de-            To support open science, H IJACK KV is publicly at https://
  velop LLM serving systems and cache reuse frameworks.           github.com/YichiCS/KV-Cache-Hijack and https://
  Our findings reveal an underexplored threat in position-        zenodo.org/records/20403786.
  independent KV-cache reuse, showing that efficiency op-
  timizations can introduce new attack surfaces. This can
  inform safer cache reuse mechanisms and improve system-         Acknowledgment
  level security posture. The potential negative impact is that
  attack insights could be misused against systems that de-       We thank the reviewers and shepherd for their constructive
  ploy cache reuse without sufficient integrity protections.      comments on our work. The Authors acknowledge the Na-
• End users of LLM systems, whose interactions depend on          tional Artificial Intelligence Research Resource (NAIRR) Pi-
  reliable context integrity and isolation. They may benefit      lot for contributing to this research result. Huan Zhang is
  from defenses against unintended cross-context influence,       supported in part by the AI2050 program at Schmidt Sciences
  while insecure reuse mechanisms could affect response           (AI2050 Early Career Fellowship).
  reliability in shared infrastructure settings.
• Researchers and practitioners studying LLM systems, who
  benefit from understanding system-level risks. Our work         References
  frames KV-cache reuse as a security-relevant component
  and may motivate further defensive research, while detailed      [1] Anthropic.   Claude api docs: Prompt caching.
  technical analysis could lower the barrier for reproducing           https://platform.claude.com/docs/en/
  attacks without appropriate safeguards.                              build-with-claude/prompt-caching, 2025.
 [2] Zefan Cai, Yichi Zhang, Bofei Gao, Yuliang Liu,            [12] Coleman Hooper, Sehoon Kim, Hiva Mohammadzadeh,
     Yucheng Li, Tianyu Liu, Keming Lu, Wayne Xiong, Yue             Michael W Mahoney, Yakun S Shao, Kurt Keutzer, and
     Dong, Junjie Hu, et al. Pyramidkv: Dynamic kv cache             Amir Gholami. Kvquant: Towards 10 million context
     compression based on pyramidal information funneling.           length llm inference with kv cache quantization. Ad-
     arXiv preprint arXiv:2406.02069, 2024.                          vances in Neural Information Processing Systems, 2024.

 [3] Patrick Chao, Alexander Robey, Edgar Dobriban,             [13] Elias Hossain, Swayamjit Saha, Somshubhra Roy, and
     Hamed Hassani, George J Pappas, and Eric Wong. Jail-            Ravi Prasad. Can transformer memory be corrupted? in-
     breaking black box large language models in twenty              vestigating cache-side vulnerabilities in large language
     queries. In 2025 IEEE Conference on Secure and Trust-           models. arXiv preprint arXiv:2510.17098, 2025.
     worthy Machine Learning (SaTML), 2025.
                                                                [14] Junhao Hu, Wenrui Huang, Weidong Wang, Haoyi
                                                                     Wang, tiancheng hu, zhang qin, Hao Feng, Xusheng
 [4] Mark Chen, Jerry Tworek, Heewoo Jun, Qiming Yuan,
                                                                     Chen, Yizhou Shan, and Tao Xie. EPIC: Efficient
     Henrique Ponde De Oliveira Pinto, Jared Kaplan, Harri
                                                                     position-independent caching for serving large language
     Edwards, Yuri Burda, Nicholas Joseph, Greg Brockman,
                                                                     models. In Forty-second International Conference on
     et al. Evaluating large language models trained on code.
                                                                     Machine Learning, 2025.
     arXiv preprint arXiv:2107.03374, 2021.
                                                                [15] Minyoung Huh, Brian Cheung, Tongzhou Wang, and
 [5] Tri Dao, Dan Fu, Stefano Ermon, Atri Rudra, and                 Phillip Isola. Position: The platonic representation hy-
     Christopher Ré. Flashattention: Fast and memory-                pothesis. In Forty-first International Conference on
     efficient exact attention with io-awareness. Advances in        Machine Learning, 2024.
     neural information processing systems, 2022.
                                                                [16] Bo Hui, Haolin Yuan, Neil Gong, Philippe Burlina, and
 [6] Darren Edge, Ha Trinh, Newman Cheng, Joshua                     Yinzhi Cao. Pleak: Prompt leaking attacks against large
     Bradley, Alex Chao, Apurva Mody, Steven Truitt, Dasha           language model applications. In Proceedings of the
     Metropolitansky, Robert Osazuwa Ness, and Jonathan              2024 on ACM SIGSAC Conference on Computer and
     Larson.    From local to global: A graph rag ap-                Communications Security, 2024.
     proach to query-focused summarization. arXiv preprint
     arXiv:2404.16130, 2024.                                    [17] Tanqiu Jiang, Zian Wang, Jiacheng Liang, Changjiang
                                                                     Li, Yuhui Wang, and Ting Wang. Robustkv: Defending
 [7] Mukkesh Ganesh, Kaushik Iyer, and Arun                          large language models against jailbreak attacks via kv
     Baalaaji Sankar Ananthan. Whose narrative is it                 eviction. arXiv preprint arXiv:2410.19937, 2024.
     anyway? a kv cache manipulation attack. arXiv preprint
     arXiv:2511.12752, 2025.                                    [18] Di Jin, Eileen Pan, Nassim Oufattole, Wei-Hung Weng,
                                                                     Hanyi Fang, and Peter Szolovits. What disease does this
 [8] Google. Gemini api docs: Context caching. https://              patient have? a large-scale open domain question an-
     ai.google.dev/gemini-api/docs/caching, 2025.                    swering dataset from medical exams. Applied Sciences,
                                                                     2021.
 [9] Aaron Grattafiori, Abhimanyu Dubey, Abhinav Jauhri,
                                                                [19] Qiao Jin, Bhuwan Dhingra, Zhengping Liu, William
     Abhinav Pandey, Abhishek Kadian, Ahmad Al-Dahle,
                                                                     Cohen, and Xinghua Lu. Pubmedqa: A dataset for
     Aiesha Letman, Akhil Mathur, Alan Schelten, Alex
                                                                     biomedical research question answering. In Proceedings
     Vaughan, et al. The llama 3 herd of models. arXiv
                                                                     of the 2019 conference on empirical methods in natu-
     preprint arXiv:2407.21783, 2024.
                                                                     ral language processing and the 9th international joint
                                                                     conference on natural language processing (EMNLP-
[10] Kai Greshake, Sahar Abdelnabi, Shailesh Mishra,
                                                                     IJCNLP), 2019.
     Christoph Endres, Thorsten Holz, and Mario Fritz. Not
     what you’ve signed up for: Compromising real-world         [20] Woosuk Kwon, Zhuohan Li, Siyuan Zhuang, Ying
     llm-integrated applications with indirect prompt injec-         Sheng, Lianmin Zheng, Cody Hao Yu, Joseph Gonzalez,
     tion. In Proceedings of the 16th ACM workshop on                Hao Zhang, and Ion Stoica. Efficient memory manage-
     artificial intelligence and security, 2023.                     ment for large language model serving with pagedatten-
                                                                     tion. In Proceedings of the 29th symposium on operating
[11] Chenchen Gu, Xiang Lisa Li, Rohith Kuditipudi, Percy            systems principles, 2023.
     Liang, and Tatsunori Hashimoto. Auditing prompt
     caching in language model APIs. In Forty-second Inter-     [21] Andrey Labunets, Nishit V Pandya, Ashish Hooda,
     national Conference on Machine Learning, 2025.                  Xiaohan Fu, and Earlence Fernandes. Fun-tuning:
     Characterizing the vulnerability of proprietary llms to          without leaving any traces in inputs or weights. arXiv
     optimization-based prompt injection attacks via the fine-        preprint arXiv:2511.22681, 2025.
     tuning interface. In 2025 IEEE Symposium on Security
     and Privacy (SP), 2025.                                     [32] Giorgos Nikolaou, Tommaso Mencattini, Donato Crisos-
                                                                      tomi, Andrea Santilli, Yannis Panagakis, and Emanuele
[22] Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio             Rodolà. Language models are injective and hence in-
     Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich               vertible. arXiv preprint arXiv:2510.15511, 2025.
     Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel,
     et al. Retrieval-augmented generation for knowledge-        [33] Harsha Nori, Nicholas King, Scott Mayer McKinney,
     intensive nlp tasks. Advances in neural information              Dean Carignan, and Eric Horvitz. Capabilities of
     processing systems, 2020.                                        gpt-4 on medical challenge problems. arXiv preprint
                                                                      arXiv:2303.13375, 2023.
[23] Yuhong Li, Yingbing Huang, Bowen Yang, Bharat
     Venkitesh, Acyr Locatelli, Hanchen Ye, Tianle Cai,          [34] OpenAI. Cahtgpt api docs: Prompt caching. https://
     Patrick Lewis, and Deming Chen. Snapkv: Llm knows                openai.com/index/api-prompt-caching/, 2025.
     what you are looking for before generation. Advances
     in Neural Information Processing Systems, 2024.             [35] Joon Sung Park, Joseph O’Brien, Carrie Jun Cai, Mered-
                                                                      ith Ringel Morris, Percy Liang, and Michael S Bernstein.
[24] Xiaogeng Liu, Nan Xu, Muhao Chen, and Chaowei
                                                                      Generative agents: Interactive simulacra of human be-
     Xiao. Autodan: Generating stealthy jailbreak prompts
                                                                      havior. In Proceedings of the 36th annual acm sympo-
     on aligned large language models. In The Twelfth In-
                                                                      sium on user interface software and technology, 2023.
     ternational Conference on Learning Representations,
     2024.                                                       [36] Dario Pasquini, Martin Strohmeier, and Carmela Tron-
[25] Yupei Liu, Yuqi Jia, Runpeng Geng, Jinyuan Jia, and              coso. Neural exec: Learning (and learning from) execu-
     Neil Zhenqiang Gong. Formalizing and benchmarking                tion triggers for prompt injection attacks. In Proceed-
     prompt injection attacks and defenses. In 33rd USENIX            ings of the 2024 Workshop on Artificial Intelligence and
     Security Symposium (USENIX Security 24), 2024.                   Security, 2024.

[26] Zichang Liu, Aditya Desai, Fangshuo Liao, Weitao            [37] Fábio Perez and Ian Ribeiro. Ignore previous prompt:
     Wang, Victor Xie, Zhaozhuo Xu, Anastasios Kyrillidis,            Attack techniques for language models. arXiv preprint
     and Anshumali Shrivastava. Scissorhands: Exploiting              arXiv:2211.09527, 2022.
     the persistence of importance hypothesis for llm kv
     cache compression at test time. Advances in Neural          [38] Reiner Pope, Sholto Douglas, Aakanksha Chowdhery,
     Information Processing Systems, 2023.                            Jacob Devlin, James Bradbury, Jonathan Heek, Kefan
                                                                      Xiao, Shivani Agrawal, and Jeff Dean. Efficiently scal-
[27] Zirui Liu, Jiayi Yuan, Hongye Jin, Shaochen Zhong,               ing transformer inference. Proceedings of machine
     Zhaozhuo Xu, Vladimir Braverman, Beidi Chen, and                 learning and systems, 2023.
     Xia Hu. Kivi: A tuning-free asymmetric 2bit quanti-
     zation for kv cache. arXiv preprint arXiv:2402.02750,       [39] Pranav Rajpurkar, Robin Jia, and Percy Liang. Know
     2024.                                                            what you don’t know: Unanswerable questions for
                                                                      SQuAD. In Proceedings of the 56th Annual Meeting of
[28] LMCache Team. Lmcache. https://lmcache.ai/,                      the Association for Computational Linguistics (Volume
     2024.                                                            2: Short Papers), 2018.
[29] Zhifan Luo, Shuo Shao, Su Zhang, Lijing Zhou,
                                                                 [40] Pranav Rajpurkar, Jian Zhang, Konstantin Lopyrev, and
     Yuke Hu, Chenxu Zhao, Zhihao Liu, and Zhan Qin.
                                                                      Percy Liang. SQuAD: 100,000+ questions for machine
     Shadow in the cache: Unveiling and mitigating pri-
                                                                      comprehension of text. In Proceedings of the 2016
     vacy risks of kv-cache in llm inference. arXiv preprint
                                                                      Conference on Empirical Methods in Natural Language
     arXiv:2508.09442, 2025.
                                                                      Processing, 2016.
[30] Mistral AI. Mistral 3. https://mistral.ai/news/
     mistral-3, 2025.                                            [41] Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta
                                                                      Raileanu, Maria Lomeli, Eric Hambro, Luke Zettle-
[31] Mohaiminul Al Nahian, Abeer Matar A Almalky,                     moyer, Nicola Cancedda, and Thomas Scialom. Tool-
     Gamana Aragonda, Ranyang Zhou, Sabbir Ahmed,                     former: Language models can teach themselves to use
     Dmitry Ponomarev, Li Yang, Shaahin Angizi, and Ad-               tools. Advances in Neural Information Processing Sys-
     nan Siraj Rakin. Cachetrap: Injecting trojans in llms            tems, 2023.
[42] Zedian Shao, Hongbin Liu, Jaden Mu, and Neil Gong.          [53] Guanlong Wu, Zheng Zhang, Yao Zhang, Weili Wang,
     Enhancing prompt injection attacks to llms via poison-           Jianyu Niu, Ye Wu, and Yinqian Zhang. I know what you
     ing alignment. In Proceedings of the 18th ACM Work-              asked: Prompt leakage via kv-cache sharing in multi-
     shop on Artificial Intelligence and Security, 2025.              tenant llm serving. In Proceedings of the 2025 Network
                                                                      and Distributed System Security (NDSS) Symposium.
[43] Jiawen Shi, Zenghui Yuan, Yinuo Liu, Yue Huang,
                                                                      San Diego, CA, USA, 2025.
     Pan Zhou, Lichao Sun, and Neil Zhenqiang Gong.
     Optimization-based prompt injection attack to llm-as-       [54] Guangxuan Xiao, Yuandong Tian, Beidi Chen, Song
     a-judge. In Proceedings of the 2024 on ACM SIGSAC                Han, and Mike Lewis.      Efficient streaming lan-
     Conference on Computer and Communications Security,              guage models with attention sinks. arXiv preprint
     2024.                                                            arXiv:2309.17453, 2023.
[44] Karan Singhal, Shekoofeh Azizi, Tao Tu, S Sara Mah-         [55] Guangxuan Xiao, Yuandong Tian, Beidi Chen, Song
     davi, Jason Wei, Hyung Won Chung, Nathan Scales,                 Han, and Mike Lewis. Efficient streaming language
     Ajay Tanwani, Heather Cole-Lewis, Stephen Pfohl, et al.          models with attention sinks. In The Twelfth Interna-
     Large language models encode clinical knowledge. Na-             tional Conference on Learning Representations, 2024.
     ture, 2023.
                                                                 [56] An Yang, Anfeng Li, Baosong Yang, Beichen Zhang,
[45] Linke Song, Zixuan Pang, Wenhao Wang, Zihao Wang,                Binyuan Hui, Bo Zheng, Bowen Yu, Chang Gao, Chen-
     XiaoFeng Wang, Hongbo Chen, Wei Song, Yier Jin, Dan              gen Huang, Chenxu Lv, et al. Qwen3 technical report.
     Meng, and Rui Hou. The early bird catches the leak:              arXiv preprint arXiv:2505.09388, 2025.
     Unveiling timing side channels in llm serving systems.
     IEEE Transactions on Information Forensics and Secu-        [57] Huan Yang, Renji Zhang, Mingzhe Huang, Weijun
     rity, 2025.                                                      Wang, Yin Tang, Yuanchun Li, Yunxin Liu, and Deyu
                                                                      Zhang. Kvshare: An llm service system with efficient
[46] Jianlin Su, Murtadha Ahmed, Yu Lu, Shengfeng Pan,                and effective multi-tenant kv cache reuse. arXiv preprint
     Wen Bo, and Yunfeng Liu. Roformer: Enhanced trans-               arXiv:2503.16525, 2025.
     former with rotary position embedding. Neurocomput-
     ing, 2024.                                                  [58] Jingbo Yang, Bairu Hou, Wei Wei, Yujia Bao, and Shiyu
                                                                      Chang. KVLink: Accelerating large language models
[47] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob                 via efficient KV cache reuse. In The Thirty-ninth Annual
     Uszkoreit, Llion Jones, Aidan N Gomez, Łukasz Kaiser,            Conference on Neural Information Processing Systems,
     and Illia Polosukhin. Attention is all you need. Advances        2025.
     in neural information processing systems, 2017.
                                                                 [59] Yijun Yang, Ruiyuan Gao, Xiaosen Wang, Tsung-Yi
[48] vLLM Team. vllm.         https://docs.vllm.ai/en/                Ho, Nan Xu, and Qiang Xu. Mma-diffusion: Multi-
     latest/, 2024.                                                   modal attack on diffusion models. In Proceedings of the
[49] Qian Wang, Zahra Yousefijamarani, Morgan Lindsay                 IEEE/CVF Conference on Computer Vision and Pattern
     Heisler, Rongzhi Gu, Bai Xiaolong, Shan Yizhou, Wei              Recognition, 2024.
     Zhang, Wang Lan, Ying Xiong, Yong Zhang, et al.
                                                                 [60] Yuchen Yang, Bo Hui, Haolin Yuan, Neil Gong, and
     Mepic: Memory efficient position independent caching
                                                                      Yinzhi Cao. Sneakyprompt: Jailbreaking text-to-image
     for llm serving. arXiv preprint arXiv:2512.16822, 2025.
                                                                      generative models. In 2024 IEEE symposium on security
[50] Rui Wang, Junda Wu, Yu Xia, Tong Yu, Ruiyi Zhang,                and privacy (SP), 2024.
     Ryan Rossi, Subrata Mitra, Lina Yao, and Julian
                                                                 [61] Zhilin Yang, Peng Qi, Saizheng Zhang, Yoshua Ben-
     McAuley. Cacheprune: Neural-based attribution de-
                                                                      gio, William Cohen, Ruslan Salakhutdinov, and Christo-
     fense against indirect prompt injection attacks. arXiv
                                                                      pher D Manning. Hotpotqa: A dataset for diverse, ex-
     preprint arXiv:2504.21228, 2025.
                                                                      plainable multi-hop question answering. In Proceedings
[51] Xilong Wang, John Bloch, Zedian Shao, Yuepeng Hu,                of the 2018 conference on empirical methods in natural
     Shuyan Zhou, and Neil Zhenqiang Gong. Webinject:                 language processing, 2018.
     Prompt injection attack to web agents. In Proceedings of
                                                                 [62] Jiayi Yao, Hanchen Li, Yuhan Liu, Siddhant Ray, Yi-
     the 2025 Conference on Empirical Methods in Natural
                                                                      hua Cheng, Qizheng Zhang, Kuntai Du, Shan Lu, and
     Language Processing, 2025.
                                                                      Junchen Jiang. Cacheblend: Fast large language model
[52] Alexander Wei, Nika Haghtalab, and Jacob Steinhardt.             serving for rag with cached knowledge fusion. In Pro-
     Jailbroken: How does llm safety training fail? Advances          ceedings of the Twentieth European Conference on Com-
     in Neural Information Processing Systems, 2023.                  puter Systems, 2025.
[63] Zhenyu Zhang, Ying Sheng, Tianyi Zhou, Tianlong             (continued)
     Chen, Lianmin Zheng, Ruisi Cai, Zhao Song, Yuandong              Symbol              Description
     Tian, Christopher Ré, Clark Barrett, et al. H2o: Heavy-         (ℓ)     (ℓ)    (ℓ)
                                                                   qt , k t , vt          Query, Key, Value vectors
     hitter oracle for efficient generative inference of large             (ℓ)
     language models. Advances in Neural Information Pro-               at                Attention output
     cessing Systems, 2023.                                           k̂ t , v̂t          Effective Key, Value (with cache reuse)
                                                                         ep               Continuous embedding of prefix p
[64] Lianmin Zheng, Liangsheng Yin, Zhiqiang Xie,                Matrices
     Chuyue Livia Sun, Jeff Huang, Cody Hao Yu, Shiyi                 (ℓ)      (ℓ)
                                                                   K 1:t ,V 1:t           Stacked K, V (positions 1 to t) at layer ℓ
     Cao, Christos Kozyrakis, Ion Stoica, Joseph E Gonzalez,           K̃ , Ṽ            Cached (hit) Key, Value matrices
     et al. Sglang: Efficient execution of structured language         K ,V               Ground-truth Key, Value matrices
     model programs. Advances in neural information pro-
                                                                 KV Cache System
     cessing systems, 2024.
                                                                       Pprefix            Prefix cache pool
[65] Andy Zou, Zifan Wang, Nicholas Carlini, Milad Nasr,               Pchunk             Chunk-based cache pool
     J Zico Kolter, and Matt Fredrikson. Universal and trans-           Shit              Set of matched (hit) cache chunks
     ferable adversarial attacks on aligned language models.            TX̃p              KV cache of X̃ conditioned on prefix p
     arXiv preprint arXiv:2307.15043, 2023.                              R                Recomputation set of token positions
                                                                           [i, j]         Position interval of matched segment in input
[66] Wei Zou, Runpeng Geng, Binghui Wang, and Jinyuan                        t′           Relative token position (t ′ = t − i + 1)
     Jia. {PoisonedRAG}: Knowledge corruption attacks to         Attack & Optimization
     {Retrieval-Augmented} generation of large language                 T           Number of GCG optimization steps
     models. In 34th USENIX Security Symposium (USENIX                  B           Number of candidate prefixes per step
     Security 25), 2025.                                                k           Top-k candidate tokens per position
                                                                        η           Search width (verification ratio)
                                                                       LCE          Cross-entropy loss
A    Notations                                                          l
                                                                      Vcand         Candidate token set at position l
                                                                 Evaluation Metrics & System Parameters
    Symbol         Description
                                                                        δ           Cache ratio (proportion of cached chunks)
Sequences and Tokens                                                    ρ           Recomputation ratio
      X           Input prompt / token sequence                      Lcontext       Multi-turn filler context length
      X̃          Cached token sequence / target text chunk           Acc           Accuracy (x = r)
     Xa:b         Contiguous segment [xa , . . . , xb ] of X         U-ASR          Untargeted Attack Success Rate (y ̸= x)
      q           Target query                                       T-ASR          Targeted Attack Success Rate (y = r̃ ∧ y ̸= x)
       r          Ground-truth answer
                                                                 Operators
       r̃         Target malicious answer
                                                                    softmax(·)            Softmax function
       p          Adversarial prefix
                                                                    concat /⊕             Concatenation operation
      S           Length of matched prefix
                                                                 P REFIX L EN(·, ·)       Longest common prefix length
    Lchunk        Fixed chunk length for cache storage
                                                                   O NE H OT(·)           One-hot encoding
      Lp          Adversarial prefix length
Model Architecture
      N            Number of transformer layers
      d            Model hidden dimension                        B         LLM Inference
      dk           Key/query/value head dimension
  (ℓ)  (ℓ)   (ℓ)                                                 During the inference phase, the LLM predicts the next token xT con-
W Q ,W K ,W V      Q, K, V projection matrices at layer ℓ
        (ℓ)                                                      ditioned on the previously generated sequence X = [x1 , x2 , ..., xT ] of
     WO            Output projection matrix at layer ℓ
       (ℓ)                                                       length T . The inference procedure for a single step is described
     W FFN         FFN weight matrix at layer ℓ                  below. The input token xT is first mapped to its corresponding
                                      (ℓ)
    WFFN           Upper bound on ∥W FFN ∥2                      dense vector representation via the embedding matrix E : h 0 = E[xT ],
     W out         Final output embedding matrix                 where h 0 ∈ R1×d and d is the hidden dimension of the model. For
    Wembed         Token embedding matrix                        each layer l ∈ {1, . . . , N} in the Transformer architecture, the hid-
Vectors (at position t, layer ℓ)                                 den state undergoes Multi-Head Self-Attention (MHA) [47] and a
        (ℓ)                                                      Feed-Forward Network (FFN).
      ht             Hidden state
                                                                    Given H attention heads, the hidden state is first normalized using
       ut            Normalized hidden state
                                                                 the Layer Normalization (LN): u = LN(h l−1 ). For each head h ∈
                                                                 {1, . . . , H}, the query, key, and value vectors are computed using
                                                                                                      (h,l)   (h,l)   (h,l)
                                                                 head-specific weight matrices W Q ,W       W K ,W  W V ∈ Rd×dk , where
dk = d/H:                                                                                     D      LLM Prompts
         (h)            (h,l)          (h)       (h,l)        (h)          (h,l)
        q T = uW Q ,                  k T = uW K         ,   vT = uW V             .   (17)   In this section, we provide the system prompts we used in generating
                                                                                              malicious answers and QA tasks.
  Rotary Position Embedding (RoPE) [46] R T is then applied to
encode positional information in the queries and keys:                                            Question & Answer Prompt
                        (h)              (h)    (h)            (h)                                Based strictly on the provided context, answer the question
                      q̃ T = R T q T ,         k̃ T = R T k T .                        (18)
                                                                                                  using the following rules:
   The current key and value vectors are concatenated with the past                                 1. Multiple Choice questions with labeled options
                 (h)      (h)
cached tensors k 1:T and V1:T to update the KV cache:                                                  (A/B/C/D): Output ONLY the corresponding uppercase
                                        (h)
                                                                                                       letter.
               (h)              (h)              (h)                (h)   (h)
          K 1:T +1 = [K 1:T ; k̃ T ],          V 1:T +1 = [V 1:T ; v T ].              (19)
                                                                                                    2. Binary-choice questions (e.g., Yes/No, True/False, A/B,
  The attention output for head h is computed by attending to the                                      Option1/Option2): Output ONLY the option text itself,
updated key-value pairs:                                                                               NOT the letter label. This rule OVERRIDES rule 1.
                                (h)  (h)       !                                                    3. Open-ended questions: Answer in 1–3 words.
                             q̃ T (K 1:T +1 )⊤     (h)
           o (h) = softmax          √            V 1:T +1 .  (20)                                 Do not provide explanations or full sentences. Be extremely
                                      dk
                                                                                                  concise.
   The outputs from all H heads are concatenated and linearly pro-
jected back to the original dimension:                                                            Generate Malicious Answer Prompt

                                                             (l)                                  Role: You are an expert data generator specializing in creating
                         o attn = [o (1) ; . . . ; o (H) ]W O .                        (21)
                                                                                                  plausible incorrect answers (distractors).
  The final hidden state for layer l is obtained via standard residual                            Goal: Given a specific Question and its Correct Answer, gener-
connections and a position-wise FFN:                                                              ate a single Wrong Answer.
                                                                                                  Core Rules: (1) The answer must be factually wrong. (2) The
         h mid = h l−1 + o attn , h l = h mid + FFN(LN.(h mid ))                       (22)       answer must be plausible (it should belong to the same category
                                                                                                  and context as the correct answer). (3) The answer must match
   After passing through all N layers, the final hidden state is nor-
                                                                                                  the format of the correct answer.
malized and projected into the vocabulary space of size V to obtain
                                                                                                  Step-by-Step Instructions:
the logits z T :
                                                                                                  • Identify the Category of the Correct Answer
                     h final = LN(h N ), z T = h finalW vocab .                        (23)          • Boolean/Binary: Yes/No, True/False, Agree/Disagree.
                                                                                                     • Selection: A choice from a limited set (e.g., Red or Blue).
Finally, a decoding strategy (e.g., greedy search or nucleus sampling)
                                                                                                     • Entity: A person, place, organization, chemical, etc.
is applied to z T to select the actual token.
                                                                                                     • Quantitative: A date, number, price, or measurement.
                                                                                                  • Apply Generation Logic based on Category
C     End-to-End Sample                                                                              • If Binary or Selection (A vs B): Return the option that is
                                                                                                        NOT the correct answer. Example: “High”–>“Low”.
Here, we give an end-to-end sample from HotpotQA. We present
                                                                                                     • If Entity (Open-ended): Substitute the entity with a dif-
the Context, benign answer, malicious answer, and the prefix
                                                                                                        ferent one from the exact same field. The wrong answer
obtained through GCG optimization.
                                                                                                        must be related to the topic to be plausible. Example: If
Context: ... Paul Hayden Desser (born February 12, 1971) who                                            the question is about US Presidents and the answer is
records as Hayden, is a Canadian singer-songwriter from Thornhill,                                     “Lincoln”, return “Washington” (another President), not
Ontario. Buck-Tick (stylized as BUCK-TICK) is a Japanese rock                                          “Churchill” (wrong country) or “Ferrari” (wrong type).
band, formed in Fujioka, Gunma in 1983. The group has consisted                                      • If Quantitative (Number/Date): Return a value that is
of Atsushi Sakurai (lead vocals), Hisashi Imai (guitar), Hidehiko                                       close to the correct answer but incorrect (a deviation).
Hoshino (guitar), Yutaka Higuchi (bass) and Toll Yagami (drums)                                         Example: If the answer is “1995”, return “1994” or “1997”.
since 1985. In their three decade career, the band has released
                                                                                                        Do not return a random number like “5000”.
20 studio albums, nearly all reaching the top ten on the charts,
of which three in the late eighties and early nineties topped them.                               • Format and Safety Check
They are commonly credited as one of the founders of the visual kei                                  • Do not add negation words like “Not” or “Non-” to the
movement...                                                                                             correct answer (e.g., do not output “Not Red”).
                                                                                                     • Do not provide an explanation.
Question: Who was born first Garo Yepremian or Michael Casey?
                                                                                                     • Ensure the output contains ONLY the wrong string.
Benign Answer: Fujioka Malicious Answer: Tokyo
Prefix: !!!!!!!!!!!!!!analyt nutrition:)Thismillan Recipeieri
quatro_classes-bisKeiniai]],:)   UICollection      prodotti:_),
Dublin<SPECIAL_71>Technˆ),Berlinˆ(
