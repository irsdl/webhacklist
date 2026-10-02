---
type: Whitepaper
title: "H3Act: Automated Measuring Semantic Conversion Anomalies of HTTP/3-to-HTTP/1.1 Translation in CDNs (Paper)"
description: Presents H3Act, which generates structured HTTP/3 probes and analyzes their HTTP/1.1 translation at CDN backends. RFC retrieval, an attack corpus and generator/analyzer feedback guide testing; compressed payload representations and batch summaries support repeated investigation of semantic conversion anomalies.
resource: "https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf"
tags: [whitepaper, webseclist-reference, usenix, http3, http, parser-differential, cdn, fuzzing, llm]
generated:
  by: webseclist-refs/1
  at: "2026-09-13T22:14:33+00:00"
verified:
  - by: AI archive validation
    at: 2026-09-13
status: stable
stale_after: 2027-09-13
sources:
  - id: original
    resource: "https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf"
    title: "H3Act: Automated Measuring Semantic Conversion Anomalies of HTTP/3-to-HTTP/1.1 Translation in CDNs (Paper)"
    author: Qihang Peng, Siyuan Tian, Yongxin Qiu, Jinyang Huang, Yaru Yang, Xiang Li, Jia Zhang, Yiming Zhang, Haixin Duan, Yunsenxiao Lin, Shugen Chen, Liqun Yang
also_at: []
authors:
  - Qihang Peng
  - Siyuan Tian
  - Yongxin Qiu
  - Jinyang Huang
  - Yaru Yang
  - Xiang Li
  - Jia Zhang
  - Yiming Zhang
  - Haixin Duan
  - Yunsenxiao Lin
  - Shugen Chen
  - Liqun Yang
canonical_url: ""
cited_by:
  - "2026-ai.md:262"
commit: ""
content_sha256: ac2f385fb9ceb6b4353a07fe59bf5b6b502810490b324ac3645efa07a2b8c2d8
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf"
published: ""
publisher: USENIX
publisher_english: ""
raw_sha256: 3662b75fec3c9ecbeba89d58bc3d3f27729217fe3612737eee3e8c56f391ba22
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf"
retrieved_kind: live
retrieved_utc: "2026-09-13T22:14:33+00:00"
slug: usenix-h3act-automated-measuring-semantic-conversion-anomalies-http-3-paper
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# H3Act: Automated Measuring Semantic Conversion Anomalies of HTTP/3-to-HTTP/1.1 Translation in CDNs (Paper)

**H3Act: Automated Measuring Semantic Conversion Anomalies of HTTP/3-to-HTTP/1.1 Translation in CDNs (Paper)** - Qihang Peng, Siyuan Tian, Yongxin Qiu, Jinyang Huang, Yaru Yang, Xiang Li, Jia Zhang, Yiming Zhang, Haixin Duan, Yunsenxiao Lin, Shugen Chen, Liqun Yang, USENIX.

- Published: date not stated
- Original: <https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity26-peng-qihang.pdf (live) on 2026-09-13
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

H3Act: Automated Measuring Semantic Conversion
Anomalies of HTTP/3-to-HTTP/1.1 Translation in CDNs
    Qihang Peng and Siyuan Tian, Institute for Network Sciences and Cyberspace,
    BNRist, Tsinghua University; Yongxin Qiu, Beihang University; Jinyang Huang,
 Central South University; Yaru Yang, Institute for Network Sciences and Cyberspace,
BNRist, Tsinghua University; Xiang Li, Nankai University; Zhongguancun Laboratory;
Jia Zhang, Institute for Network Sciences and Cyberspace, BNRist, Tsinghua University;
    Zhongguancun Laboratory; Yiming Zhang, Institute for Network Sciences and
 Cyberspace, BNRist, Tsinghua University; Haixin Duan, Institute for Network Sciences
and Cyberspace, BNRist, Tsinghua University; Quancheng Laboratory; Yunsenxiao Lin
   and Shugen Chen, Tencent Technology Co., Ltd.; Liqun Yang, Beihang University
       https://www.usenix.org/conference/usenixsecurity26/presentation/peng-qihang




          This paper is included in the Proceedings of the
                 35th USENIX Security Symposium.
                     August 12–14, 2026 • Baltimore, MD, USA
                                 ISBN 978-1-939133-58-8


                          Open access to the Proceedings of the
                            35th USENIX Security Symposium
                                    is sponsored by
             H3Act: Automated Measuring Semantic Conversion Anomalies of
                       HTTP/3-to-HTTP/1.1 Translation in CDNs

Qihang Peng1 , Siyuan Tian1 , Yongxin Qiu2 , Jinyang Huang3 , Yaru Yang1 , Xiang Li4,5, , Jia Zhang1,5, ,
            Yiming Zhang1 , Haixin Duan1,6 , Yunsenxiao Lin7 , Shugen Chen7 , Liqun Yang2
        1 Institute for Network Sciences and Cyberspace, BNRist, Tsinghua University, China
                   2 Beihang University, 3 Central South University, 4 Nankai University
         5 Zhongguancun Laboratory, 6 Quancheng Laboratory, 7 Tencent Technology Co., Ltd.



                         Abstract                                  significantly expand the attack surface. Specifically, in the
                                                                   context of HTTP/2-to-HTTP/1.1 translation, both academia
Content Delivery Networks (CDNs) are adopting HTTP/3
                                                                   and industry have identified critical vulnerabilities, such as
to enhance performance; however, they often need to con-
                                                                   request smuggling and bandwidth amplification [24, 28, 32].
vert it to HTTP/1.1 for compatibility. This conversion creates
significant attack surfaces and may reintroduce confirmed or          While HTTP/3 adoption is accelerating due to the perfor-
even patched vulnerabilities in HTTP/2 or HTTP/1. Unfor-           mance benefits of QUIC, its security posture within CDN
tunately, existing tools struggle to adapt to the HTTP/3 envi-     protocol translation scenarios remains underexplored. Al-
ronment and efficiently leverage accumulated attack knowl-         though HTTP/3 maintains high semantic consistency with
edge. To overcome these challenges and systematically mea-         HTTP/2 [6, 16, 57], this similarity often fosters a false sense
sure HTTP/3-to-HTTP/1.1 conversion anomalies within the            of security. Developers may assume that security flaws al-
black-box CDN environment, we present H3Act, a dual-agent,         ready patched in the HTTP/2-to-HTTP/1 translation are in-
knowledge-driven fuzzing framework targeting HTTP/3-to-            herently absent in the HTTP/3-to-HTTP/1 context. However,
HTTP/1.1 semantic conversion anomalies. Our approach com-          the migration from TCP to QUIC requires a fundamental
bines Large Language Models (LLMs) with Hybrid Retrieval-          reimplementation of the protocol stack. This contradiction,
Augmented Generation (RAG) to automatically transform              arising from semantic inheritance through implementation re-
protocol specifications and historical threat intelligence into    construction, may cause new code to fail to inherit historical
high-precision HTTP/3 test payloads, enabling regression           security patches, thereby regressing known protocol semantic
testing of semantic translation risks. In a large-scale study of   conversion anomalies. The regression of old attacks is not
9 commercial CDNs, including Cloudflare, Cloudfront, and           an exaggeration, as demonstrated by previous studies [7, 48].
Tencent CDN, we found a significant regression in protocol         Therefore, a systematic measurement of HTTP/3 security in
security, which means vulnerabilities in old protocols are         real-world CDN deployments is urgently needed.
reintroduced in HTTP/3. Our research identified 7 common              However, assessing this risk presents unique challenges.
attack vectors across various categories, including request        First, new mechanisms introduced in HTTP/3 hinder the di-
smuggling, cache poisoning, and Denial-of-Service (DoS)            rect migration of existing attack payloads from HTTP/2 or
amplification. Every CDN is vulnerable to at least one attack      HTTP/1 [7], and transforming the textual knowledge associ-
vector. We have responsibly disclosed these vulnerabilities        ated with these payloads into usable HTTP/3 test cases incurs
and have received confirmations from some vendors. These           substantial manual effort [56, 62]. Second, detecting anoma-
findings highlight that the CDN ecosystem currently lacks          lies in protocol semantic translation requires a deep under-
the capacity to maintain security consistency checks while         standing of semantics [56, 60, 62, 63]. During detection, tools
pursuing improvements in protocol performance.                     should “understand” request intent to capture subtle logical
                                                                   discrepancies between messages before and after translation.
                                                                   Third, as black-box environments, CDNs provide almost no
1   Introduction                                                   additional effective feedback. Traditional rule-based fuzzing
                                                                   methods cannot directly leverage knowledge from documenta-
Content Delivery Networks (CDNs), an essential part of In-         tion, nor can they effectively capture semantic understanding
ternet infrastructure, need to continuously translate between      during testing. Consequently, they require significant manual
modern protocols (e.g., HTTP/3) and traditional protocols          effort to translate knowledge into generation and detection
(e.g., HTTP/1.1) to balance performance and compatibility.         rules [28, 29, 56, 62, 63]. Meanwhile, white-box or grey-box
This translation introduces complex intermediate states that       testing lacks feedback signals in CDN environments.



USENIX Association                                                                   35th USENIX Security Symposium         4901
   Large Language Models (LLMs) offer a unique solution             plies a high degree of semantic similarity between HTTP/3
to these challenges. They leverage a deep understanding of          and HTTP/2 from the outset. However, to prevent confusion,
textual knowledge, reasoning capabilities for cross-protocol        the IETF decoupled the application and transport layers in
semantic mapping, and the creativity to generalize new attack       the final specification: QUIC was established as a general-
vectors from historical data [40, 41, 62, 64]. LLMs convert         purpose transport protocol, while HTTP/3 was defined as the
abstract semantic constraints from RFCs and attack primitives       application-layer protocol that uses it.
from papers and reports into test strategies. They infer internal      The IETF released the QUIC standard [26] first, followed
translation logic by analyzing differences in messages across       by the HTTP/3 standard one year later. Concurrent with RFC
black-box environments, thereby systematically exploring            9114, the IETF redefined HTTP semantics in RFC 9110 [16]
semantic vulnerabilities within the protocol translation layer.     and caching in RFC 9111 [14]. Based on these new specifi-
   To overcome these challenges and systematically measure          cations, the IETF redefined HTTP/1.1 [15] and HTTP/2 [57]
HTTP/3-to-HTTP/1.1 conversion anomalies within the black-           and formulated HTTP/3. This consolidation resolved the
box CDN environment, we propose H3Act, a knowledge-                 previous fragmentation caused by numerous scattered docu-
driven fuzzing framework that targets HTTP/3-to-HTTP/1.1            ments [3,5,12,13,17–20,51–54]. According to Cloudflare [4],
semantic conversion anomalies. We employ a dual-agent               approximately 21% of global requests directed to their net-
fuzzing architecture to generate HTTP/3 test requests and           work in 2025 utilize HTTP/3. Furthermore, W3Techs [59]
analyze logs to identify conversion anomalies and guide the         reports that roughly 36.8% of websites support HTTP/3 as of
generation process. To equip agents with the necessary expert       late December 2025.
knowledge, we implement a hybrid RAG architecture. This                Defined in RFC 9000, QUIC is a next-generation transport
system statically injects existing attack primitives into the       layer protocol. Built upon UDP, QUIC provides reliability
system prompt and integrates an external dynamic-retrieval          comparable to TCP while effectively resolving the Head-
tool, enabling agents to consult sliced and vectorized RFC          of-Line blocking issue inherent in TCP, thereby significantly
documents. We evaluated the runtime performance and false           reducing latency. Additionally, QUIC integrates and mandates
positive rate of H3Act. Our results show that H3Act main-           the use of TLS 1.3 to encrypt application-layer messages and
tains an average false positive rate between 10.3% and 15.8%,       protect the content of communications.
which falls within an acceptable range.
   Using this framework, we evaluate 9 commercial CDNs
across 7 major CDN providers and identify 7 attack vectors, in-     2.2    CDN Overview
cluding DoS, cache poisoning, and request smuggling. Every          CDNs are a critical component of modern internet infrastruc-
CDN is vulnerable to at least one vector. We have conducted         ture. Due to their massive scale and scheduling mechanisms,
responsible disclosure; Baidu and Tencent have confirmed            CDNs are favored for three benefits: accelerating global con-
our findings, while other CDN providers are currently assess-       tent delivery, concealing the identities of origin servers, and
ing the associated risks and impacts. This study confirms the       defending against DoS attacks. According to 6sense’s data [1],
resurgence of protocol translation risks in the HTTP/3 era.         more than 6 million companies worldwide use CDNs.
Contributions. Specifically, our contributions are as follows:         The CDN architecture consists of edge nodes and central
   Additionally, we validate the effectiveness of our architec-     nodes, both of which are widely deployed globally [10]. Edge
ture through ablation studies.                                      nodes serve as the ingress and egress points of the CDN,
   1. We conduct empirical measurements across major com-           handling content caching and distribution tasks. Conversely,
mercial CDNs, confirming the prevalence of protocol transla-        central nodes are responsible for functions such as load bal-
tion vulnerabilities and highlighting the challenge of security     ancing. Furthermore, CDNs employ scheduling strategies,
regression faced by CDN vendors during protocol upgrades.           such as DNS-based or anycast-based scheduling, to ensure
   2. To conduct these measurements, we propose H3Act, a            users access the nearest edge node. When a client accesses a
knowledge-driven fuzzing framework that efficiently migrates        server proxied by a CDN, the request is routed to the nearest
existing protocol-semantic threat intelligence from HTTP/3          ingress node. If the requested data hits the CDN cache and the
to HTTP/1.1.                                                        replica is valid, the edge node returns the cached copy directly
                                                                    to the client. Otherwise, the CDN performs internal schedul-
2     Background                                                    ing to initiate a request to the origin from an egress node (a
                                                                    process known as "back-to-origin"). The data retrieved is then
                                                                    returned to the client via the ingress node, which caches the
2.1    HTTP/3 & QUIC
                                                                    resource for future use.
Defined in RFC 9114 [6], HTTP/3 is the third major ver-                As demonstrated by this workflow, the globally distributed
sion of the Hypertext Transfer Protocol. Its most significant       delivery and caching architecture effectively accelerates
feature is the transition from TCP to QUIC at the transport         global content interaction. Since the client interacts exclu-
layer. Initially termed "HTTP/2-over-QUIC," this name im-           sively with the CDN, the origin server’s information re-



4902    35th USENIX Security Symposium                                                                       USENIX Association
mains unexposed. Additionally, DoS attack traffic is dis-          3     Methodology of H3Act
tributed across multiple CDN nodes for filtering and scrub-
bing, thereby significantly mitigating its impact.                 In this section, we primarily present the threat model and
                                                                   the associated challenges. Subsequently, we expound on the
                                                                   architecture and workflow of H3Act. We further provide an in-
                                                                   depth discussion of H3Act’s two modules: Hybrid RAG and
                                                                   Dual-Agent Fuzzing. Finally, we detail the implementation
2.3    HTTP Attack in CDN                                          of H3Act.

Recent studies identify various attacks targeting HTTP en-
                                                                   3.1     Framework Overview
vironments. Based on their techniques and impacts, these
attacks fall into three broad categories: Denial of Service        3.1.1   Threat Model and Challenge
(DoS), cache poisoning, and request smuggling.
                                                                   We consider an attacker that can impersonate a legitimate
   The Denial of Service (DoS) attack is focused on making a       client and issue HTTP/3 requests to the CDN ingress node
resource (site, application, server) unavailable for the purpose   without obstruction. The CDN processes these requests nor-
it was designed [47]. In CDN environments, attackers typi-         mally, modifying and forwarding them in accordance with its
cally exhaust the bandwidth between edge nodes and origin          standard workflow when forwarding is required. The threat
servers (e.g., H2Amp [24], RangeAmp [34], CondAmp [63])            model is illustrated in Figure 1.
or consume all available connections (e.g., Slow Attack [24]).        The attacker’s capabilities are subject to the following con-
This prevents the CDN from retrieving necessary files from         straints: 1. The attacker possesses no specific knowledge of
the origin, which disrupts normal service delivery. Other vari-    the target origin and cannot access it directly. 2. The attacker
ants also exist. Attackers may disable routing nodes between       cannot access the CDN’s internal network or its source code.
the CDN edge and the origin server to block communica-             3. The client can only craft HTTP/3 messages at the semantic
tion [24], or redirect users to suboptimal edge nodes to in-       layer; it cannot modify the transport layer (QUIC) or lower
crease latency or render the service unavailable [25].             layers. 4. The attacker controls a server proxied by the CDN
   Cache poisoning targets the native caching mechanism of         and uses it to poison the CDN cache.
CDNs [46]. The goal is to force the CDN to store malicious            Attackers aim to compromise the origin through improper
responses. If a response is cached in a shared web cache, such     semantic translation by the CDN, posing three primary threats:
as those commonly found in proxy servers, then all users of        DoS, Cache Poisoning and Request Smuggling.
that cache will continue to receive the malicious content until       Detecting semantic vulnerabilities in this threat model re-
the cache entry is purged. The "Host of Troubles" attacks by       quires extensive expert knowledge, a deep understanding of
Chen et al. [8] demonstrate this technique. Attackers craft        protocol semantics, and effective handling of black-box envi-
requests that keep the cache key as victim.com, while the          ronments. Traditional rule-based or machine-learning-based
cache actually fetches and stores a malicious response from        fuzzers struggle to meet these requirements, motivating the
attacker.com. As a result, all subsequent users requesting         use of LLMs in this study. We detail these challenges below.
victim.com through this cache receive the malicious content           Challenge 1: Difficulty in utilizing expert knowledge.
from attacker.com.                                                 Substantial attack knowledge applicable to this threat model
                                                                   already exists, though it is often embedded in texts such as
   Request smuggling exploits parsing inconsistencies across       academic papers, blogs, and vulnerability reports. Traditional
different servers, particularly regarding request boundaries.      fuzzers generally cannot extract knowledge directly from
This technique hides additional requests, which security poli-     these sources and rely heavily on manual definitions [56, 62].
cies might otherwise block, within a seemingly benign re-          In contrast, LLMs possess strong natural language understand-
quest [15, 61]. Kettle et al. [31–33] demonstrate several effec-   ing capabilities. They can directly get knowledge from text,
tive request smuggling techniques with real-world impact. A        translate it into HTTP/3 requests, and generalize from existing
common approach exploits conflicts between the Content-            concepts to discover novel vulnerabilities [40, 41, 62, 64].
Length and Transfer-Encoding headers to trigger parsing               Challenge 2: Complexity of semantic definitions and im-
discrepancies. Notably, HTTP/2 does not use the Transfer-          plementations. HTTP semantics involve complex definitions
Encoding header. Therefore, when an HTTP/2 request con-            and implementations [56, 60, 63]. Some standards are strictly
taining this header is converted to HTTP/1.1, it introduces        enforced with zero tolerance for errors. Simple random muta-
additional smuggling risks [32].                                   tion or generation often produces numerous invalid test cases
   These three categories are not strictly mutually exclusive.     that are immediately discarded by parsers, hindering deep test-
For instance, attackers can leverage cache poisoning to per-       ing. Conversely, LLMs equipped with expert knowledge can
form request smuggling (CPDoS) [44], or use request smug-          comprehend protocol specifications and abstract rules. This
gling to achieve cache poisoning [61].                             allows them to construct targeted, malicious samples that pass



USENIX Association                                                                    35th USENIX Security Symposium         4903
                                                                   3.2     Hybrid RAG
                                                                   To address the expert-knowledge requirements for fuzzing
                                                                   tasks, we propose a Hybrid RAG. We categorize expert knowl-
                                                                   edge into two types based on differences in timeliness, infor-
                                                                   mation length, and the base model’s prior mastery.
        Figure 1: The Threat Model of CDN Attacks.
                                                                      Category 1: Attack Primitives. This knowledge is pri-
                                                                   marily scattered across academic papers, technical blogs, and
                                                                   vulnerability advisories. It is characterized by relatively short
parser validity checks, thereby enabling more rigorous testing.    text length but high value. Furthermore, due to the rapid it-
Similarly, in the analysis task, LLMs can ‘understand’ request     eration of attack methods, base models struggle to cover the
intent. This allows them to precisely capture subtle logical       latest attack intelligence during pre-training. Consequently,
discrepancies between pre-translation and post-translation         their prior mastery of this knowledge is relatively low.
messages, thereby identifying anomalies.                              Category 2: Protocol Specifications. This primarily refers
   Challenge 3: Adaptability to black-box environments.            to RFCs. These documents are lengthy and detailed, includ-
CDNs are typically black-box environments, lacking open-           ing numerous state machines and error code definitions, yet
source code or accessible code coverage data [28, 29, 56, 60,      they exhibit greater structure. We consider RFC documents
63]. This may prevent many fuzzers that rely on such infor-        to be high-quality corpora that are likely to be included in the
mation from functioning correctly, often resulting in blind        LLM’s pre-training dataset. While models typically possess
searching. However, LLMs with strong logical reasoning ca-         a macroscopic understanding of protocols, they are prone to
pabilities can better grasp the context of protocol translation.   "Factuality Hallucination" when dealing with specific param-
They can identify internal translation logic from complex logs     eter values, obscure error codes, or edge-case state transitions.
and infer potential "translation ambiguities" or mishandling,         Based on this analysis, we propose a hybrid strategy: static
thereby enabling effective deep testing.                           injection for attack primitives, and dynamic retrieval for pro-
                                                                   tocol specifications.


3.1.2   Framework and Workflow                                     3.2.1   Static Injection via System Prompt
                                                                   We implement static injection for attack primitives by embed-
To address the challenges, we propose H3Act, a fuzzing frame-      ding them into the system prompt. Static injection is well-
work based on Hybrid RAG and Dual-agent Fuzzing. It aims           suited for these primitives not only because of their brevity
to efficiently detect anomalies that arise during the seman-       but also because they should remain continuously active dur-
tic protocol conversion from HTTP/3 to HTTP/1.1 within             ing the process to shape an attack mindset for each genera-
CDNs. The overall framework adopts a closed-loop feedback          tion. These primitives represent discrete, high-value knowl-
approach. The architecture is illustrated in Figure 2.             edge units; their value lies in providing transferable attack
   The architecture comprises two components: Hybrid RAG           paradigms rather than descriptive details. Unlike dynamic
and Dual-Agent Fuzzing. The Hybrid RAG module aggre-               retrieval, which exposes the model to knowledge only during
gates data from attack-related papers, blogs, and RFC doc-         specific queries and hinders stable mastery, static injection
uments to provide the two agents with attack knowledge             leverages In-Context Learning. This mechanism allows the
and the ability to query specific RFC content. The Dual-           model to use these primitives as a reasoning baseline for every
Agent Fuzzing module is responsible for case generation and        generation. Furthermore, attack primitives demonstrate strong
anomaly analysis during the fuzzing and possesses feedback         generalization, a CL.TE conflict in HTTP/2 may inspire the
guidance capabilities. The framework operates in batch mode        construction of inconsistencies between Content-Length
to conduct testing against target CDNs. During the prelim-         and DATA frame lengths in HTTP/3. This capacity for cross-
inary phase, expert knowledge from RAG is injected into            scenario transfer requires the knowledge to be resident in the
both agents. For each batch, the Generator receives feedback       model context rather than retrieved on demand.
from the Analyzer and uses it to generate a batch of valid            We initially collect papers and blogs containing knowledge
HTTP/3 requests. These requests are transmitted to the CDN         regarding HTTP attacks and vulnerabilities. This collection
by the sender. Meanwhile, the framework captures essential         comprises approximately 18 documents [8, 9, 24, 27–34, 36,
data from the current batch’s transmission, including client-      37, 42, 43, 48, 56, 63]. During the preprocessing phase, we
side and origin-server logs, and submits them to the Analyzer.     perform knowledge distillation on all documents. We focus
The Analyzer then analyzes the data to identify potential con-     exclusively on one key aspect of the described attacks and
version anomalies, evaluates the quality of the current batch      vulnerabilities: Principle, which is the underlying mechanism.
of cases, and proposes directions for further testing, thereby     Other information, such as impact scope and background con-
guiding the execution of the subsequent batch.                     text, is omitted from this distillation process. Ultimately, each



4904    35th USENIX Security Symposium                                                                       USENIX Association
                                                 Figure 2: The Architecture of H3Act.


document is distilled into a list of tuples: [{Attack Name,            criteria for tool invocation: when the agent needs to verify
Principle}]. The total knowledge content amounts to ap-                specific RFC clauses, state machine transition rules, or error
proximately 32,000 tokens, which falls well within the context         code definitions, it pauses the current generation process and
window limits of mainstream LLMs. We integrate this static             issues a tool-invocation instruction. Upon receiving the search
knowledge into the system prompt. It is injected into the              request, the system performs a Top-N similarity search in the
model during the initial interaction batch, ensuring it learns         vector database and returns the retrieved raw fragments to the
domain-specific knowledge about attacks and vulnerabilities            agent as tool output. The agent then combines the context with
from the outset.                                                       this newly acquired, precise knowledge to complete packet
                                                                       construction.
3.2.2   Dynamic Vector Retrieval
For long-text RFC protocol specifications and complex attack
                                                                       3.3     Dual-Agent Fuzzing
details, direct static injection results in significant waste of the   We decompose the complex fuzzing task into two functionally
context window and increases the risk of the model overlook-           orthogonal yet closely coordinating agents.
ing information. Therefore, we design a dynamic retrieval
mechanism based on tool invocation, enabling the agent to
                                                                       3.3.1   Necessity of Dual-Agent Architecture
"consult the manual."
   The rationale for this design is that, despite having a gen-        We first emphasize the necessity of the dual-agent architecture
eral understanding of the HTTP/3 protocol, agents may still            in H3Act. This design addresses two primary issues: atten-
produce factuality hallucinations regarding protocol details.          tion dilution from long contexts and conflicting temperature
Dynamic retrieval enables the model to access raw RFC frag-            requirements across two tasks.
ments on demand when precise specifications are required.                 1. Attention Dilution: The dilution effect of long con-
This approach avoids context dilution from static injection            texts motivates our decision to split the system into double
and forces the model to ‘consult the manual’ via tool invo-            agents. The attention of LLMs degrades as context length
cation, significantly reducing the risk of hallucination. Fur-         increases [39, 50, 58].
thermore, the hierarchical structure of RFCs (chapters, sub-              2. Temperature Discrepancy across Two Tasks: In
sections, clauses) naturally aligns with the semantic chunking         fuzzing, the generation task requires a higher temperature to
of vector retrieval, enabling dynamic retrieval to balance pre-        encourage divergent thinking and creative payload construc-
cision and efficiency.                                                 tion. Conversely, the analysis task requires a low-temperature,
   We construct a local vector database using ChromaDB.                deterministic setting to interpret logs objectively and rigor-
To address the hierarchical structure of RFC documents, we             ously. The black box of CDNs reinforces this requirement. As
adopt a logic-based slicing strategy. Specifically, we perform         the Analyzer only accesses logs from the client and origin, it
an initial segmentation of the RFC text by section, format-            should perform meticulous comparisons to detect even subtle
ting each slice as structured text: {Source, Section ID,               anomalies without missing any details.
Description, Content}. Additionally, we slice longer text                 Assigning generation and analysis tasks to separate agents
paragraphs into logical segments. We embed these slices and            significantly mitigates context accumulation. We find that the
distilled attack primitives in the database as well.                   Generator operates effectively as a stateless entity. In each
   We encapsulate retrieval as a tool function callable by the         batch, its input consists solely of the system prompt and the
agent Within the system prompt, we explicitly define the               feedback from the previous batch, with all state maintenance



USENIX Association                                                                       35th USENIX Security Symposium         4905
handled by the Analyzer. Compared to a stateful approach,          to the Generator, directing it to refine the attack vector, thereby
this allows the Generator to focus more intently on the expert     enabling feedback guidance during testing.
knowledge in the system prompt and on immediate feedback.
This concentrated attention facilitates smoother execution of      3.3.4   Externalized Memory Stream
the generation task. Furthermore, the dual-agent setup enables
distinct temperature settings optimized for each task.             Although task decomposition mitigates some resource con-
   In contrast, a single-agent architecture forces all conversa-   straints, the accumulated interaction history in continuous,
tion history into one model, accelerating context accumulation     multi-batch fuzzing rapidly exhausts the LLM’s context win-
and diluting attention. Consequently, during the same fuzzing      dow. To maintain the system’s long-term memory capabilities
batch, the single agent performs worse in specific case genera-    without degrading performance, we design a State Distillation
tion compared to the dual-agent architecture. It also consumes     mechanism. This mechanism divides the memory stream into
more input tokens, thereby increasing costs. Finally, merg-        two distinct components:
ing two orthogonal tasks into a single agent inevitably leads         1. Short-term Memory. This component uses a sliding-
to ‘role confusion’ and complicates the implementation of          window mechanism. It retains full interaction details only for
differentiated temperature settings.                               the most recent batches (e.g., the last 3), ensuring the Agent
                                                                   remains aware of the immediate testing context.
3.3.2   Generator                                                     2. Long-term Memory. At fixed intervals (e.g., every 3
                                                                   batches), the system triggers a "memory consolidation" opera-
The Generator’s duty is to apply divergent thinking to generate    tion. The Analyzer is invoked to perform an in-depth summary
concrete test cases. It accepts feedback from the Analyzer         of past generations and testing histories. They extract a high-
as input and, by combining it with learned knowledge from          value "Technical Summary". The old raw conversation history
RAG, produces executable cases that strictly adhere to the         for Generator and Analyzer will be flushed (retaining only
HTTP/3 protocol specifications.                                    the initial system prompt) and replaced with this highly con-
   Given the strict input format requirements of the transmis-     densed Technical Summary. This mechanism simulates the
sion tool, the Generator should ensure absolute syntactic pre-     process of experience accumulation in human experts. It en-
cision in its output. Consequently, we constrain the Generator     sures that the agent maintains clarity regarding its objectives
to adhere to a predefined template. Furthermore, to address is-    and direction even after long-duration, multi-batch testing,
sues such as truncation or calculation errors common in LLMs       thereby avoiding redundant testing and resource waste.
when generating ultra-long strings, we introduce an Abstract
Syntax Tree (AST)-based Dynamic Payload Generation mech-
                                                                   3.4     Implementation
anism. The Generator is permitted to use Python-style expres-
sions (e.g., {{"A"*10000+"B"*50}}) within JSON fields to           We implement our framework using Python 3.12.7 [49].In
describe repetitive or patterned data. The system intercepts       the implementation, we configure the two agents with dis-
these expressions before transmission to execute safe local        tinct temperatures and prompts: an initial system prompt
evaluation and expansion. This mechanism circumvents the           and a batch prompt used per batch. Both prompts include
LLM’s Context Window Limit, facilitating the construction          sections for identity definition, task description, tool usage,
of substantial payloads with minimal token consumption.            environment configuration, input data explanation, output re-
                                                                   quirements, and task hints. However, the system prompt addi-
3.3.3   Analyzer                                                   tionally incorporates statically injected knowledge. For each
                                                                   agent, shared sections between the system and batch prompts
The core responsibility of the Analyzer is to infer attack de-     remain consistent. This leverages Ollama’s KV Cache mech-
tails from a diverse array of interaction logs. It aggregates      anism, allowing the agent to reuse precomputed cache data
the raw HTTP/3 cases produced by the Generator, client-side        and maximize efficiency.
logs, and the converted HTTP/1.1 request and response logs            For the Generator’s predefined templates, we use Pydantic
from the origin. Leveraging its knowledge base, it analyzes        to generate a JSON Schema. This schema defines the structure
these inputs to identify conversion anomalies that could poten-    of HTTP/3 HEADERS and DATA frames, as well as the
tially lead to attacks or other risks. By leveraging a moderate    commands for issuing a sending pause. We inject this schema
temperature setting, the Analyzer can infer potential attack       during each generation step, guiding the model to produce a
surfaces from subtle discrepancies in protocol behavior.           JSON array that describes a complete HTTP/3 request. This
   Ultimately, the Analyzer generates not only a detailed risk     array is subsequently converted into an executable HTTP/3
assessment report identifying which potential attack surfaces      request for the sender. If the output violates the JSON Schema,
were triggered by the current batch, but also, more impor-         the Generator automatically regenerates.
tantly, guidance for the subsequent testing batch. This guid-         Regarding implementation details, we develop the sender
ance serves as a feedback signal, transmitted in a closed loop     using the aioquic library to ensure transport-layer correct-



4906    35th USENIX Security Symposium                                                                         USENIX Association
ness during case transmission. Similarly, we use the python         NVIDIA GeForce RTX 4090 GPUs (450W TDP, 24,564MB
ast module to generate dynamic payloads.                            VRAM). The second device serves as the origin, responsible
   Given the limitations of our local experimental environment      for receiving forwarded requests from the CDNs and returning
and the model’s performance, we select gpt-oss:120b [45]            corresponding responses. It utilizes Nginx 1.24.0-2ubuntu7.5
as the base model and deploy it locally via Ollama. The pro-        as the web server software and runs on Ubuntu 24.04.3 LTS
gram interacts with the model through the Ollama interface.         (GNU/Linux 6.8.0-88-generic x86_64). The hardware speci-
                                                                    fications include a single Intel Xeon Silver 4314 CPU (2.40
                                                                    GHz, 8 cores, 8 threads), 8 GB of RAM, and 10 Gbps of
4     Experiments and Evaluation                                    network bandwidth, with no dedicated GPU configuration.
                                                                    We configured the Nginx logging module to capture received
In this section, we first establish the complete experimental
                                                                    HTTP/1.1 requests and sent HTTP/1.1 responses. Note: Due
environment for H3Act, including the CDN configuration and
                                                                    to the large size of the target resource (which includes a 29MB
the experimental platform settings. Subsequently, we conduct
                                                                    PNG file), we solely record the byte count of the transmitted
a comprehensive evaluation of H3Act in this environment,
                                                                    response body, omitting the actual content. The request and
covering runtime performance, false-positive rate assessment,
                                                                    response headers are recorded fully.
and ablation studies. Finally, we present a qualitative compar-
ison of H3Act with other approaches.
                                                                    4.2     Evaluation of Framework
4.1     Experiment Setup                                            4.2.1   Runtime performance

4.1.1   Experimental Subject Overview                               We conducted our evaluation by first assessing basic runtime
                                                                    performance. We identified a primary variable in our archi-
We select CDNs based on three criteria: market popularity,          tecture: the number of execution batches. We selected three
direct registration for individual users, and free or low-cost      levels based on various factors: 10, 20, and 30 batches. We
pricing. For market popularity, we aim to select widely stud-       executed each configuration 10 times, yielding 30 experimen-
ied CDNs [9, 22–24, 34, 35, 37, 38, 63]. For pricing, since our     tal runs. For all evaluations, we consistently used Cloudflare,
work spans a long period and involves multiple rounds of iter-      keeping other conditions, such as the knowledge base and
ation and testing, for cost control purposes, we expect that the    base prompts, constant. We statistically analyzed the system’s
services should support monthly or usage-based billing, with        various runtime performance metrics, and the averaged results
an average monthly cost under $5. Based on these criteria,          are presented in Table 1. The metrics are defined as follows:
we exclude less popular CDNs, as well as providers such as          "Cases Generated" indicates the total number of valid HTTP/3
Akamai, Google, and Microsoft, which either do not allow            requests generated per run. "Agent Interactions" refers to the
direct individual registration or charge higher fees. Finally,      number of interactions with the agent per request, including
we selected 9 CDNs across 7 providers that support HTTP/3           calls to dynamic query tools. "Agent Time" represents the
client connections: Alibaba CDN, Alibaba ESA, Baidu CDN,            total time spent on the agent per run, covering both reasoning
Cloudflare, CloudFront, Fastly, Huawei CDN, Tencent CDN,            and response generation. "Sum Time" denotes the total exe-
and Tencent EdgeOne. Given their significant market share           cution time per run. "Tokens (Input)" and "Tokens (Output)"
and influence, we believe security vulnerabilities in these ser-    indicate the total number of input and output tokens, respec-
vices could expose a vast number of general users to threats.       tively, across all agents and interactions during a single run.
   We adopted a principle of minimal modification for CDN           By combining these token counts with official API pricing,
configurations. We primarily only enabled HTTP/3 function-          users who plan to replace H3Act’s base model with alternative
ality (which typically requires manual activation). We essen-       APIs can estimate the expected cost per run.
tially left caching rules, durations, and other optimization set-
tings unchanged, except for specific configurations required        4.2.2   Evaluation of False Positive Rate
by our test cases, such as enabling Range requests.
                                                                    We evaluated the accuracy of our approach. We conducted
4.1.2   Experiment Platform Setup                                   experiments on all 9 CDNs mentioned in Section 4.1.1. We
                                                                    perform five independent runs for each CDN. Each run com-
We establish the experimental platform using two separate           prises 10 batches, yielding a total of 45 experiments. We
devices. The first device functions as the client, running the      collected all evaluation reports from each batch, totaling 450.
H3Act and sending requests to the target CDNs. This de-                To ensure rigorous evaluation, we defined "a successful
vice operates on Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-87-            discovery" of H3Act as the generation of a valid HTTP/3 re-
generic x86_64). Its hardware configuration includes dual           quest by the Generator, followed by the Analyzer confirming
Intel Xeon Gold 6326 CPUs (2.90 GHz, 16 cores, 32 threads),         a specific anomaly derived from dual-ended logs. Human ex-
192 GB of RAM, 10 Gbps of network bandwidth, and four               perts manually verify whether these high-confidence reports



USENIX Association                                                                    35th USENIX Security Symposium         4907
          Table 1: Runtime Performance of H3Act.                          4.2.3      Ablation Study
       Batch                      10              20           30
       Cases                                                              We investigated the impact of single-agent versus dual-agent
                                 74.4           136.5       215.6         architectures and the inclusion of RAG on our method. Fo-
       Generated
       Agent                                                              cusing on runtime performance, we selected Cloudflare as the
                                 36.7            72.5       106.1
       Interactions                                                       experimental subject. We conducted 10 runs of 10 batches
       Agent Time (s)          1405.2       2922.4         4477.2         each on Cloudflare using two configurations: Single-Agent
       Sum Time (s)            1903.6       3815.0         5846.2         with RAG and Dual-Agent without RAG. We present the av-
       Tokens
                            2068380.0    4291985.0      6633276.0         erage results in Table 3. For all architectures, the generation
       (Input)
        Tokens                                                            component is stateless.
                              74567.8     142442.4       222392.7
       (Output)
                                                                          Table 3: Runtime Performance of Single-Agent with RAG
                                                                          and Dual-Agent without RAG.
correspond to genuine anomalies. Specifically, three human
                                                                                                    Dual-Agents     Single-Agent       Dual-Agents
experts grade the outputs. When an alert fires, they first check             Architecture
                                                                                                    with RAG        with RAG           without RAG
whether an anomaly has already been reported; if not, they                   Cases
                                                                                                            74.4               65.6               86.6
examine the corresponding HTTP/3 request, the translated                     Generated
HTTP/1.1 request observed at the origin, and the logs. For                   Agent
                                                                                                            36.7               33.6               34.0
skilled experts, reviewing a 10-batch run (approx. 70 requests               Interactions
                                                                             Agent Time (s)              1405.2              1353.2          1520.8
as in Table 1) takes only about 5 minutes.
                                                                             Sum Time (s)                1903.6              1879.7          2141.1
   We used the False Positive Rate (FPR) as our metric. We                   Tokens
                                                                                                     2068380.0         2200551.0           843118.0
defined FPR as the ratio of manually confirmed false alarms                  (Input)
                                                                             Tokens
to the total number of anomalies reported by the model in a                                             74567.8          58027.2            70596.6
                                                                             (Output)
single experiment. The final result is the average of the five
runs. We did not investigate whether false positives stem from
agent hallucination or other causes. We treated all instances                Regarding the number of agents, we observed that the
equally, relying solely on the reported results.                          single-agent architecture offers no significant advantage over
                                                                          the dual-agent architecture in terms of average generation
                                                                          time per sample or output token cost. However, its input cost
Table 2: FPR and Discovered Anomalies of H3Act running
                                                                          is significantly higher.
on CDNs.
                                                                             We also evaluated the FPR of these architectures. To reduce
                Avg.         Avg.
                                         Avg.
                                                   Total       Avg.       workload, we selected the Huawei CDN and the Tencent CDN
   CDN          Generated    Unique                Unique      TTFF       as targets. The experimental methodology and evaluation
                                         FPR
                Cases        Anomalies             Anomalies   (Batch)
   Alibaba                                                                metrics remain consistent with Section 4.2.3. The results, as
                     72.8          4.2   11.4%            12        1.4
   CDN                                                                    shown in Table 4, indicate that both the dual-agent structure
   Alibaba                                                                and RAG reduce the false-positive rate and, to some extent,
                     74.0          3.6   10.3%            10        1.6
   ESA
   Baidu             76.2          4.0   12.5%            10        2.8   increase the number of detected anomalies.
   Cloudflare        79.8          3.0   11.0%             8        2.2
   Cloudfront        75.8          3.4   15.8%             7        4.0
   Fastly            74.8          4.0   12.4%            11        1.2
                                                                          Table 4: FPR and Discovered Anomalies of Two Architectures
   Huawei            72.0          4.2   12.6%            13        2.0
   Tencent                                                                running on CDNs.
                     71.6          3.8   14.0%            10        1.6
   EdgeOne
   Tencent                                                                                           Avg.        Avg.                 Total        Avg.
                     74.6          3.8   10.8%            13        1.2                                                       Avg.
   CDN                                                                     CDN       Architecture    Generated   Unique               Unique       TTFF
                                                                                                                              FPR
                                                                                                     Cases       Anomalies            Anomalies    (Batch)
                                                                                     Dual-Agent
                                                                                                          72.0         4.2    12.6%         13           2.0
                                                                                     with RAG
                                                                           Huawei
                                                                                     Single-Agent
   We present the results in Table 2. The method maintains a                         with RAG
                                                                                                          63.2         3.4    14.2%          9           2.0
high discovery capability, identifying an average of 3-4 unique                      Dual-Agent
                                                                                                          78.6         2.4    30.6%          7           2.4
                                                                                     without RAG
anomalies per batch. Simultaneously, it has a false-positive                         Dual-Agent
                                                                                                          74.6         3.8    10.8%         13           1.2
rate ranging from 10.3% to 15.8%. Additionally, Time-to-                   Tencent   with RAG
First-Failure (TTFF) data indicates that the method typically              CDN       Single-Agent
                                                                                                          68.6         3.6    13.2%          8           1.6
                                                                                     with RAG
detects the first anomaly within the first three batches, demon-                     Dual-Agent
                                                                                                          88.6         2.2    20.7%          5           2.2
strating its detection efficiency.                                                   without RAG




4908     35th USENIX Security Symposium                                                                                        USENIX Association
4.2.4   Comparison of Other Frameworks

This study does not directly compare with existing tools. In
the black-box CDN environment, traditional coverage metrics
are unavailable. Moreover, the number of discovered vulnera-
bilities depends heavily on the target implementation, making
objective quantitative comparisons difficult. Here, we provide                     (a) Attack with Single Range
a brief qualitative comparison of H3Act against existing tools,
including Reqsminer [63], HDiff [56], and Frameshifter [28].
   We conduct an in-depth analysis of the theoretical design
and implementation of these tools. We consider H3Act to
possess the following advantages over existing approaches:
   1. Input Flexibility: H3Act can fuzz directly from textual                     (b) Attack with Multiple Range
knowledge. In contrast, Reqsminer and HDiff require muta-
tions to begin with HTTP semantics defined by ABNF rules,
whereas Frameshifter requires mutations based on complete
HTTP/2 request frame sequences.
   2. Feedback Guidance: H3Act possesses feedback guidance
during testing. Conversely, HDiff and Frameshifter lack feed-
                                                                                   (c) Attack with Wrong Range
back guidance for mutation, relying essentially on random
generation. Although Reqsminer incorporates CDN response                  Figure 3: RangeAmp when CDNs remove Range.
states for feedback, its guidance remains limited.

                                                                  Removal: The CDN removes the Range header during trans-
5     Measurement and Findings                                    lation. 4. Ignoring: The CDN completely ignores the Range
                                                                  header. 5. Refusing: The CDN refuses the request.
We summarize the HTTP/3-to-HTTP/1.1 conversion anoma-                Among these behaviors, Removal poses a severe risk of
lies detected during the evaluation and identify 7 distinct       HTTP amplification attacks. An attacker can request minimal
attack vectors across 9 CDNs, as shown in Table 5. We also        data via HTTP/3 while forcing CDN to retrieve the entire re-
measure the occurrence of these conversion anomalies in           source from origins, potentially exhausting origin bandwidth
HTTP/2-to-HTTP/1.1.                                               and disrupting normal service for legitimate users, as shown
                                                                  in Figure 3. Expansion similarly introduces risks of ampli-
                                                                  fication; however, its amplification factor is lower than that
5.1     Denial-of-Service Bugs                                    of Removal, as the CDN requests only finite resource frag-
5.1.1   RangeAmp (Range-Header-based Attack)                      ments from the origin. Forwarding carries the risk of CPDoS
                                                                  when handling Invalid Range requests. This occurs because
Our research reveals that most CDNs exhibit flaws in pro-         the origin will return a 416 error, which the CDN may cache,
cessing Range headers. Attackers can exploit these flaws by       thereby denying access to the resource for normal clients.
constructing syntactically valid yet malicious Range requests        We summarize the behaviors of each CDN in Table 6.
to launch HTTP amplification attacks against the origin.          The results show that nearly all tested CDNs exhibit at least
   To evaluate the behavior of CDNs, our testing covers three     one anomalous behavior. According to Li et al [34], Al-
typical Range header types: 1. Single Range: Requests a sin-      ibaba, Huawei, and CloudFront have fixed this vulnerability
gle, small byte range. 2. Multiple Range: Requests multiple       in HTTP/1.1, but it has regressed in HTTP/3. We will show
overlapping byte ranges. 3. Invalid Range: Requests a byte        the amplification factors of the attack in Appendix A.
range with logical errors (e.g., 100-90).
   According to RFC specifications [12,16], the ideal handling    5.1.2    CondAmp (Conditional-Request-based Attack)
logic for these requests should be: direct forwarding, forward-
ing after merging overlapping ranges, and rejecting at the        In our research, we also observe flaws in the processing logic
edge node, respectively. However, practical testing indicates     of CDNs regarding Conditional Requests. Attackers can ex-
that CDNs in the wild do not fully adhere to these specifica-     ploit compliant conditional request headers to construct ma-
tions. We categorize observed CDN behaviors as follows: 1.        licious traffic, thereby inducing HTTP amplification attacks
Forwarding: During translation, the CDN remains the Range         against the origin.
header unchanged, regardless of its validity. 2. Expansion:          Our testing covers five types of conditional request
The CDN extends the requested range during translation. 3.        headers: If-Match, If-None-Match, If-Modified-Since,



USENIX Association                                                                  35th USENIX Security Symposium        4909
                                                                          Table 5: Attack Overview

                                              Alibaba        Alibaba                                                                    Tencent   Tencent
         Attack Vector                                                     Baidu          Cloudflare     Cloudfront   Fastly   Huawei
                                              CDN            ESA                                                                        CDN       EdgeOne
         RangeAmp [34]                             ✓              ✓              ✓                ✓              ✓       ✓         ✓
         CondAmp [63]                              ✓              ✓              ✓                ✓              ✓       ✓         ✓
         HTTP Slow Attack [24]                     ✓              ✓              ✓                               ✓                 ✓         ✓         ✓
         URI-Based CP [8]                                                                                                          ✓         ✓
         Multi-Host-Based CP [8]                                                                                                             ✓         ✓
         Foo-CRLF Attack                                                                                                           ✓
         Meta Characters [36]                         ✓              ✓                                                             ✓         ✓         ✓


 Table 6: Behaviors of CDN when dealing Range Headers.                                           mains the If-Range header but expands the requested Range
                                                                                                 within the associated Range header during translation. The
                    Single Range         Multiple Range Wrong Range
                                                                                                 implications of these behaviors are similar to those described
    Alibaba          Expansion             Expansion1
     CDN               (512k)                (512k)
                                                           Removal                               in Section 5.1.1. When a CDN adopts the Removal behavior,
    Alibaba          Expansion             Expansion1                                            the workflow by which an attacker exploits this mechanism
                                                           Removal                               to launch an amplification attack against the origin server is
     ESA               (512k)                (512k)
     Baidu                               Other Behaviors2                                        illustrated in Figure 4.
   Cloudflare          Removal              Removal        Removal                                  Table 7 presents our observations regarding CDN process-
                      Expansion            Expansion3                                            ing behaviors. All tested CDNs exhibit flaws in the processing
   Cloudfront                                              Ignoring
                         (1M)                 (1M)                                               logic for at least one type of conditional request. We will show
       Fastly          Removal              Ignoring       Ignoring
                                                                                                 the amplification factors of the attack in Appendix A.
                      Expansion                           Expansion
    Huawei                                  Ignoring
                        (512k)                              (512k)
   Tencent            Expansion4           Expansion4                                            5.1.3     HTTP Slow Attack
                                                           Refusing
   EdgeOne                (4k)                 (4k)
   Tencent                                 Expansion4                                            Because our architecture supports constructing HTTP/3 re-
                     Forwarding                            Refusing
    CDN                                        (4k)                                              quests with active transmission pauses, we can observe the
   1 Aliyun CDN and Aliyun ESA process only the first byte range specified, ignoring             impact of HTTP/3 slow-rate attacks on CDNs. This study
     all subsequent ranges.
   2 Baidu CDN initially issues a request for the first 1MB of the resource. It subse-           primarily identifies two categories of slow attack vectors:
     quently forwards the request containing the original headers to the origin server.             1. Slow Headers (Pre-Headers): Transmitting complete or
     The response received by the client appears normal.
   3 Cloudfront merges multiple byte ranges into a single contiguous range then                  partial HTTP/3 headers to CDN edge nodes and maintaining
     expands it.                                                                                 connection liveness without executing other operations . This
   4 Tencent CDN decomposes a Range request containing multiple byte ranges into
                                                                                                 aims to determine whether the CDN establishes and sustains
     multiple separate requests, each specifying a single byte range. Furthermore,
     each requested range is expanded to 4KB before forwarding. Tencent EdgeOne                  a persistent connection with the origin.
     behaves similarly but merges ranges in 4KB units. Consequently, a single back-                 2. Slow Body: Transmitting headers that either
     to-origin request may satisfy multiple client Range requests.
                                                                                                 lack a Content-Length or contain an excessively big
                                                                                                 Content-Length to CDN edge nodes, followed by the
                                                                                                 transmission of the message body at an extremely low
If-Unmodified-Since, and If-Range. For the first four                                            rate (e.g., one byte every 3 to 10 seconds). This serves to
headers, we constructed test cases where the preset condi-                                       test whether the CDN continuously occupies connection
tions are not met (i.e., edge nodes should theoretically re-                                     resources with the origin.
turn lightweight responses, such as 304 or 412 status codes).                                       Regarding request method coverage, our testing framework
CDNs should either intercept these requests at the edge or                                       supports both POST and GET. Table 8 summarizes the defen-
transparently forward the original conditions to the origin                                      sive effectiveness of CDNs against these attacks. The data
for verification. For the If-Range header, we constructed                                        indicate that the vast majority of CDNs are susceptible to at
standard requests with the expectation that the CDN would                                        least one of the aforementioned slow attack vectors and fail
forward them without modifying the header values.                                                to prevent the exhaustion of connection resources effectively.
   We categorize the CDN processing behaviors for condi-
tional request headers as follows: 1. Forwarding: The CDN
                                                                                                 5.2      Cache Poisoning Bugs
remains the conditional request header unchanged during
translation. 2. Removal: The CDN removes the conditional                                         We extend our research to multi-domain environments and ob-
request header during translation. 3. Ignoring: The CDN com-                                     serve that certain CDNs exhibit consistency issues during the
pletely ignores the conditional request header. 4. Expansion:                                    parsing and conversion of HTTP/3 requests, thereby creating
Specifically for If-Range requests, the CDN correctly re-                                        cache-poisoning vulnerabilities.



4910     35th USENIX Security Symposium                                                                                                     USENIX Association
                                   Table 7: Behaviors of CDN when dealing Conditional Request Headers.

                                   If-Match         If-None-Match            If-Modified-Since If-Unmodified-Since                                 If-Range
          Alibaba CDN             Forwarding           Removal                    Removal            Forwarding                                   Forwarding
          Alibaba ESA             Forwarding           Removal                    Removal            Forwarding                                 Expansion (512k)
              Baidu                                                                  Other Behavior1
           Cloudflare              Ignoring              Removal                  Removal             Ignoring                                      Removal
           Cloudfront             Forwarding             Removal                  Removal            Forwarding                                  Expansion (1M)
              Fastly              Forwarding             Removal                  Removal            Forwarding                                     Removal
             Huawei                Removal2              Removal2                 Removal2            Removal2                                  Expansion (512k)
        Tencent EdgeOne           Forwarding             Ignoring                 Ignoring           Forwarding                                  Expansion (4k)
          Tencent CDN             Forwarding             Ignoring                 Ignoring           Forwarding                                    Forwarding
        1 Baidu CDN initially issues a request for the first 1MB of the resource. It subsequently forwards the request containing the original headers to the origin. The

          response received by the client appears normal.
        2 Huawei CDN requests only the first 512 KB of the resource in the origin request.




Table 8: Whether CDN is Susceptible to the Specific Attack.                                5.2.2      Multi-Host-Based
                Pre Headers      Slow Body       Pre Headers      Slow Body                Beyond URI parsing issues, we identified vulnerabilities con-
                  (POST)          (POST)            (GET)           (GET)                  cerning the handling of duplicate or conflicting :authority
    Alibaba
      CDN
                    YES              YES              NO              NO                   headers. This issue was exclusively detected in Tencent CDN
    Alibaba                                                                                and EdgeOne, with the attack scenario illustrated in Figure 6.
                    YES              YES             YES              YES
      ESA                                                                                     Our experiments reveal that these CDNs accept requests
     Baidu          YES              YES             YES              YES                  containing multiple Host headers, multiple :authority
   Cloudflare       NO               NO              NO               NO
   Cloudfront       YES              YES             NO               NO                   headers, or a combination of both. Crucially, these CDNs
     Fastly         NO               NO              NO               NO                   adopt a "Last-one-wins" strategy for routing decisions. Em-
     Huawei         NO               YES             NO               YES                  pirical data indicates that when a request contains conflict-
    Tencent                                                                                ing headers (e.g., sending :authority: test-tencentcdn
                    YES              YES             YES              YES
    EdgeOne
    Tencent                                                                                followed by :authority: test-tencentcdn-2), the trans-
                    YES              YES             YES              YES                  lated HTTP/1.1 request utilizes the latter header (in this
      CDN
                                                                                           example, the Host field of the translated request is set to
                                                                                           test-tencentcdn-2). If the CDN’s caching mechanism
                                                                                           uses the first header to generate the cache key while the rout-
5.2.1   URI-Based                                                                          ing logic relies on the last, this parsing discrepancy will di-
                                                                                           rectly facilitate cache poisoning attacks. According to Chen
We observe flaws in the processing logic of absolute URIs                                  et al [8], Tencent has fixed this vulnerability in HTTP/1.1, but
within the :path of HTTP/3 messages across certain CDNs.                                   it has regressed in HTTP/3.
Our tests demonstrate that when Huawei CDN and Tencent
CDN generate back-to-origin HTTP/1.1 requests, if the do-                                  5.3       Request Smuggling Bugs
main information in the :path conflicts with that in the
:authority, the system prioritizes the information within                                  5.3.1      Foo-CRLF Attack
the :path field. Consequently, this value is used to generate
                                                                                           We identify a critical CRLF injection vulnerability within
the Host header of the back-to-origin HTTP/1.1 message.
                                                                                           Huawei CDN, stemming from insufficient input validation
The attack is illustrated in Figure 5.
                                                                                           during the HTTP/3-to-HTTP/1.1 conversion process.
   Specifically, an attacker can construct a malicious mes-                                   Experiments reveal that Huawei CDN fails to filter CRLF
sage specifying the victim domain (victim.com) in the                                      sequences embedded within custom header values. As illus-
:authority header, while using an absolute URI pointing to                                 trated in Figure 7, an attacker can inject a payload containing
the attacker’s server (e.g., https://attacker.com/) in the                                 bar\r\n\r\n ... into the value of a Foo header within an
:path header. The CDN’s protocol translation layer forwards                                HTTP/3 request.
the request to attacker.com. Since the cache key is typi-                                     When the CDN converts the request to HTTP/1.1, it fails
cally generated based on :authority, the malicious content                                 to strictly validate CRLF sequences, allowing them to persist
returned by the attacker’s server is erroneously cached under                              in the translated request. According to the HTTP/1.1 spec-
the victim domain, thereby achieving cache poisoning. Ac-                                  ification, a double CRLF sequence signifies the end of the
cording to Chen et al [8], Tencent has fixed this vulnerability                            request [15]; thus, the injected CRLF sequence prematurely
in HTTP/1.1, but it has regressed in HTTP/3.                                               terminates the current request. Consequently, the origin in-



USENIX Association                                                                                                   35th USENIX Security Symposium                         4911
               (a) Attack with If-Match header




                                                               Figure 6: Workflow of Multiple-Host-Based Cache Poisoning.

            (b) Attack with If-None-Match header
                                                               a malicious request following the double CRLF sequence.
                                                               Upon conversion, this payload is parsed by the origin as an
                                                               independent request, thereby enabling HTTP request smug-
                                                               gling. Furthermore, by specifying Host: attacker.com in
                                                               the smuggled request, the attacker can induce the CDN to
                                                               cache a malicious response from the attacker’s server un-
                                                               der the victim’s domain, thereby achieving cache poisoning
         (c) Attack with If-Modified-Since header.
                                                               against legitimate users.

                                                               5.3.2   Meta Characters
                                                               We analyzed the meta character filtering mechanisms across
                                                               various CDNs and discovered that certain providers exhibit
                                                               overly lenient handling of non-ASCII and control characters
        (d) Attack with If-Unmodified-Since header.            (meta characters). This issue affects Alibaba CDN, Alibaba
                                                               ESA, Huawei CDN, Tencent CDN, and Tencent EdgeOne.
                                                               Specifically, these CDNs forward directly dangerous meta
                                                               characters, such as \f, \a and \b, from HTTP/3 requests
                                                               to the HTTP/1.1 origin without performing any encoding,
                                                               sanitization, or rejection. Since HTTP parsers differ in their
                                                               interpretation of control characters (e.g., some parsers may
                                                               treat \f as line terminators or delimiters), this behavior may
              (e) Attack with If-Range header.                 create a high risk of triggering request smuggling variants
                                                               tailored to specific backend implementations (such as specific
Figure 4: CondAmp when CDNs remove conditional headers.
                                                               versions of HAProxy [11]).

                                                               5.4     HTTP/2 vs HTTP/3
                                                               We manually test the HTTP/2 implementations of CDNs. The
                                                               result is shown in Appendix B. Our results show that cer-
                                                               tain issues observed in HTTP/3 are mitigated or absent in
                                                               HTTP/2, such as Meta Characters. Conversely, some issues
                                                               appear more frequently in HTTP/2 than in HTTP/3, such as
                                                               Multi-Host-Based CP. These findings suggest that the HTTP/2
                                                               and HTTP/3 protocol stacks in CDNs are implemented inde-
                                                               pendently and orthogonally.
   Figure 5: Workflow of URI-Based Cache Poisoning.               We also observe broader behavioral differences across
                                                               CDNs when handling the same requests sent via HTTP/2
                                                               and HTTP/3. For instance, HTTP/3 stacks tend to reject re-
terprets the residual data as the beginning of a subsequent    quests containing extra spaces or uppercase letters in header
request. By exploiting this behavior, an attacker can inject   fields, while HTTP/2 stacks are more tolerant, either filtering



4912   35th USENIX Security Symposium                                                                   USENIX Association
                                                                       2. Validate Conditional Headers: We recommend that
                                                                   CDNs prioritize validating conditional request headers. If the
                                                                   condition allows for a local response, it should be returned
                                                                   immediately without contacting the origin. If interaction with
                                                                   the origin is necessary, the conditional request fields should
                                                                   be preserved and forwarded to the origin.
           (a) Foo-CRLF Request Smuggling Attack.                      3. Disable Streaming Mode for Upstream Connections:
                                                                   We advise against using "streaming mode" [24,28], where the
                                                                   CDN initiates a connection to the origin before receiving the
                                                                   complete client request. We recommend that CDNs wait until
                                                                   the full request is received and buffered before establishing
                                                                   communication with the origin.
                                                                       4. Enforce Strict Absolute URI Checks: We recommend
                                                                   that CDNs strengthen absolute URI validation. Specifically,
                                                                   if there is a discrepancy between the address specified in the
                                                                   absolute URI and the domain information in the header fields,
            (b) Foo-CRLF Cache Poisoning Attack.                   the request should be immediately rejected [8, 15, 16, 19].
                                                                       5. Restrict Duplicate Headers: We recommend enhanc-
         Figure 7: Workflow of Foo-CRLF Attack.                    ing checks for duplicate header fields. Requests containing
                                                                   duplicates of headers that should hold a unique value (such
                                                                   as Host) should be directly rejected [8, 15, 16, 19].
out extra spaces or converting uppercase letters to lowercase.         6. Filter CRLF and Meta-characters: We recommend
HTTP/3 stacks often reject requests that include a host field      that CDNs enforce stricter filtering of CRLF sequences and
(with correct syntax, simply replacing :authority with host),      other meta-characters within header fields to prevent these
whereas HTTP/2 stacks typically accept such requests. Ad-          anomalies from reaching the origin [15, 19, 44].
ditionally, when rejecting malformed requests, some CDN                Although conversion between old and new protocols intro-
HTTP/3 stacks terminate the QUIC connection directly with-         duces new risks, we do not recommend that service providers
out returning an HTTP response with an error status code.          withdraw from or avoid adopting new protocols such as
Even when error codes are returned, they might differ from         HTTP/3. Nor do we advise them to aggressively phase out
those returned by the HTTP/2 stack.                                legacy protocols like HTTP/1.1. The former approach may
   Overall, these observations support the conclusion that         stifle community innovation and hinder the development of
HTTP/2 and HTTP/3 protocol stacks are implemented as               the new protocol ecosystem, while the latter may harm the
independent and distinct components. This conclusion is fur-       interests of certain users. We first urge vendors to address the
ther supported by open-source proxy software such as Nginx,        security risks introduced by the protocol translation layer. We
which also implements its HTTP/2 and HTTP/3 stacks sepa-           also believe that vendors can collaborate and build consensus
rately.                                                            with customers and the broader community. This collabora-
                                                                   tion can drive iterative protocol updates at the appropriate
                                                                   time and under suitable conditions, ensuring the orderly re-
6     Discussion                                                   placement of legacy protocols.
In this section, we primarily discuss the mitigation solution,
the limitations of H3Act and future directions.                    6.2    Limitations of Methodology
                                                                   We acknowledge the following limitations in H3Act:
6.1    Mitigation Solution                                            1. High Operational Cost and Low Speed: Although
                                                                   we have optimized token consumption to the greatest extent
To address the identified issues, we propose the following         possible, the inference latency of the LLM-based generation
mitigation recommendations:                                        process remains significantly higher than that of rule-based
   1. Validate Range Headers: We recommend that CDNs               binary fuzzers. This inherent latency restricts the throughput
first validate the effectiveness of Range header values. Invalid   required for large-scale scanning. Furthermore, the volume
Range fields should immediately result in a 416 error. Fur-        of packets generated per batch is notably lower than that of
thermore, single-range requests should be forwarded directly.      traditional fuzzers.
For multi-range requests, CDNs should merge overlapping               2. Interference from Safety Alignment: Commercial and
segments to minimize the volume of data retrieved from the         open-source LLMs typically undergo safety alignment train-
origin before forwarding [12, 16, 34].                             ing to prevent the generation of malicious content. In some



USENIX Association                                                                    35th USENIX Security Symposium         4913
cases, the model misinterprets the research context as a viola-    to use the CDN itself to break its own DoS protection. Mean-
tion of safety policies. Consequently, it refuses to construct     while, REQSMINER, developed by Zheng et al. [63], system-
complex attack payloads (such as request smuggling vectors)        atically mines various forwarding inconsistency vulnerabili-
or analyze the provided logs. Although rare, we have observed      ties through automated fuzzing.
this phenomenon.                                                      Regarding the caching mechanism of CDNs, attackers have
   3. LLM Hallucination: LLMs inevitably produce hallu-            also developed methods to compromise availability and confi-
cinations. In our false-positive rate evaluation, we observed      dentiality. In terms of availability, Nguyen et al. [44] proposed
that some false alarms originate from hallucinations within        Cache Poisoned Denial of Service (CPDoS), which exploits
the analysis agent. Although the overall scale is manageable,      semantic discrepancies to force edge nodes to cache error
this remains a significant limitation of the approach.             pages, thereby blocking legitimate access. Regarding data
                                                                   privacy, Mirheidari et al. [42] systematically quantified the
                                                                   risk of sensitive information leakage caused by Web Cache
6.3    Future Directions                                           Deception (WCD) attacks for the first time. Subsequently,
                                                                   by improving detection methods, they further revealed that
Future work can proceed in the following directions:
                                                                   WCD threats are widespread among the Alexa Top 10,000
   1. Protocol Coverage Expansion: Our current testing pri-
                                                                   websites and are more severe than previously estimated [43].
marily focuses on HTTP/3-to-HTTP/1.1 conversion. Future
                                                                   These studies indicate that the security boundary of CDNs
work can extend protocol coverage in two dimensions: first,
                                                                   faces comprehensive challenges, spanning from the underly-
by investigating anomalies in HTTP/3-to-HTTP/2 conversion;
                                                                   ing network infrastructure to upper-layer application logic.
and second, by performing a comparative security analysis of
HTTP/2 and HTTP/3 implementations under identical cases.
   2. Scope Expansion: We aim to extend our testing to in-         7.2    HTTP Security
clude various ubiquitous open-source reverse proxies (e.g.,
Nginx, Apache). This will allow us to measure whether "tra-        In the field of HTTP security, inconsistencies between pro-
ditional" security issues are resurfacing on a broader scale       tocol implementations and specifications are a significant
following the upgrade from HTTP/2 to HTTP/3.                       cause of critical vulnerabilities. Empirical research by Chen et
   3. Model Capability Enhancement: Constrained by                 al. [8] revealed that ambiguities in Host header parsing within
cost and other factors, our current testing utilized only gpt-     HTTP implementations trigger "Host of Troubles" attacks,
oss:120b as base models. However, our architecture is de-          leading to cache poisoning and policy bypass. Subsequently,
signed to be highly modular and open. We anticipate that           James Kettle [31] revived the dormant "request smuggling"
integrating more powerful next-generation models, such as          attack through groundbreaking research. By systematically
Gemini 3 Pro or ChatGPT-5.2, will enable the architecture to       exploiting parsing discrepancies between Content-Length and
uncover a greater number of novel vulnerabilities.                 Transfer-Encoding headers, he proposed a reliable method-
                                                                   ology for detection and exploitation. This approach not only
                                                                   bypassed security controls but also enabled large-scale cache
7     Related Work                                                 poisoning and session hijacking.
                                                                      To discover these complex parsing discrepancies more ef-
7.1    CDN Security                                                ficiently, researchers have proposed various automated de-
                                                                   tection frameworks. Jabiyev et al. [29] introduced T-Reqs, a
As CDNs become critical internet infrastructure, their security    grammar-based differential fuzzing tool. By systematically
threats are receiving increasing attention. In their respective    testing combinations of web servers and proxies, this tool
surveys, Ghaznavi et al. [21] and Al-Hamdani et al. [2] sys-       uncovered multiple novel request smuggling vectors. To ad-
tematically reviewed the threats facing CDNs, emphasizing          dress the limitations of relying solely on direct testing, Shen
the defense challenges ranging from edge to origin.                et al. [56] proposed the HDiff framework. This approach
   In terms of forwarding and optimization mechanisms, re-         creatively combined NLP analysis of RFC documents with
searchers have uncovered significant weaknesses. Chen et           differential testing, systematically identifying semantic gap
al. [9] demonstrated the construction of "forwarding loop"         attacks across mainstream HTTP implementations. To over-
attacks by exploiting forwarding configuration flaws. As re-       come black-box testing bottlenecks, Jabiyev et al. [27] pro-
search deepens, utilizing protocol inconsistencies for traffic     posed GUDIFU. Utilizing grey-box testing and comprehen-
amplification has become a new focus. RangeAmp proposed            sive search strategies, it detects deep parsing discrepancies
by Li et al. [34], CDN-Convert and BtOAmp discovered by            more effectively than existing methods.
Lin et al. [37, 38], exploiting back-to-origin policy flaws) all      Regarding attack impact and protocol evolution, threats
demonstrate that attackers can trigger high bandwidth con-         stemming from parsing discrepancies persist despite technical
sumption. To counter CDN defenses, Guo et al. [24] proposed        advancements. Liang et al. [36] developed the HCache tool tar-
several methods, including HTTP/2 bandwidth amplification,         geting Web Cache Poisoning (WCP), discovering seven new



4914    35th USENIX Security Symposium                                                                       USENIX Association
attack vectors and over 1,000 vulnerable websites on the inter-       CDNs, including DoS, cache poisoning, and request smug-
net. With the adoption of HTTP/2, Kettle [32] revealed new            gling. The ubiquity of these vulnerabilities indicates that dur-
risks introduced when front-end servers downgrade HTTP/2              ing the implementation of next-generation network protocol
requests to HTTP/1.1 for forwarding (e.g., H2.CL, H2.TE).             stacks, the industry may overlook the complexity of semantic
Targeting this protocol translation layer, Jabiyev et al. [28] pro-   translation between different protocols. Consequently, secu-
posed the Frameshifter tool to identify various attacks caused        rity risks that were previously mitigated in the HTTP/1.1 and
by HTTP/2-to-HTTP/1 conversion anomalies. Even with the               HTTP/2 eras have regressed in the HTTP/3. Our work serves
latest HTTP/3 protocol, Pisu et al. [48] demonstrated that            not only as an efficient automated testing tool but also under-
header validation issues in proxies still lead to request smug-       scores a critical imperative: as internet infrastructure evolves,
gling risks if RFC specifications are not strictly followed.          the crucial process of "protocol translation" demands more
                                                                      rigorous security auditing and compliance verification. We
                                                                      hope this study will galvanize the community to prioritize the
7.3    LLM for Vulnerability Discovery                                security of CDN protocol translation and drive the adoption
                                                                      of more secure HTTP/3 deployment practices.
Recent research increasingly explores the application of Large
Language Models (LLMs) in vulnerability discovery and net-
work protocol security. Meng et al. [41] proposed CHATAFL,            Acknowledgments
which integrates LLMs into mutation-based protocol fuzzing.
By extracting message grammars, enriching seed corpora,               This work is supported by the Deng Feng Fund of the Bei-
and guiding state transitions, it significantly improved code         jing National Research Center for Information Science and
coverage and vulnerability discovery for stateful protocols.          Technology. Authors from Nankai University (Prof. Xiang Li)
Similarly, Wei et al. [62] introduced NeTestLLM, which au-            were supported by the National Natural Science Foundation of
tomated network protocol testing by using LLMs to extract             China (No. 62502236, No. U25B2025), the Natural Science
protocol specifications for test case generation and converting       Foundation of Tianjin (No. 24JCQNJC02070), and the Open
natural language descriptions into executable test scripts. In        Project of National Engineering Laboratory for Technology
the specific domain of Web Application Firewalls (WAFs),              of Internet Domain Name (No. KF202516). Prof. Yiming
Wang et al. [60] presented WAF Manis. This grammar-based              Zhang is in part supported by the NSFC #62302258.
testing approach automatically discovers protocol-level eva-
sion vulnerabilities by generating payload-aware malformed
HTTP requests that exploit parsing discrepancies. Liu et              Ethical Considerations
al. [40] proposed PROMEFUZZ. It guided LLMs by con-
structing a knowledge base containing code metadata, API              As this study involves security testing against real-world com-
documentation, and user usage patterns to generate syntacti-          mercial CDN infrastructure, we strictly adhered to responsible
cally and semantically correct fuzzing harnesses. Furthermore,        research guidelines throughout every stage of the experimen-
LLMs are used to extract formal specifications for verification.      tal design. Our objective was to ensure no disruption to the
Sharma [55] introduced PROSPER, which utilizes LLMs to                normal operation of public services and no infringement upon
extract protocol Finite State Machines (FSMs) from RFC                third-party rights.
documents. It achieved this by combining the analysis of                 1. Controlled Experimental Environment: All test traffic
natural language text with visual artifacts such as state dia-        was directed exclusively towards origin and domains regis-
grams. Finally, Zheng et al. [64] proposed PARVAL, which              tered and controlled by the authors. We never attempted to
employed a multi-agent LLM approach to extract and com-               access, modify, or interfere with any third-party origin data
pare format specifications from both source code and RFCs,            or cached content. Our threat model explicitly restricts the at-
thereby detecting semantic inconsistencies in protocol parser         tacker’s capabilities to possessing a controlled origin, thereby
implementations.                                                      ensuring clear and safe testing boundaries.
                                                                         2. Minimized Impact: During the verification of DoS-
                                                                      related vulnerabilities (e.g., amplification and slow-rate at-
8     Conclusion                                                      tacks), we strictly limited the traffic rate and the number of
                                                                      concurrent connections (e.g., pauses for 0.5 seconds after
In this paper, we present H3Act, through which we evaluated           each send). We transmitted only the minimum sample size
security during HTTP/3-to-HTTP/1.1 protocol conversion in             necessary to verify the vulnerability’s existence and ceased
CDN environments. Our research reveals a concerning reality:          transmission immediately upon confirming the anomalous
despite the significant advancements inherent in the HTTP/3           behavior. This ensured that no denial-of-service or resource-
protocol, the translation layer introduced to ensure backward         exhaustion attacks occurred at the CDN edge nodes.
compatibility has emerged as a novel security weakness. Our              3. Data Privacy Protection: This study involves interac-
framework successfully identified 7 attack vectors across 9           tions strictly at the protocol level and does not involve any



USENIX Association                                                                       35th USENIX Security Symposium          4915
personal user data. All logs generated during the experiments      HTTP/3 deployment, improve protocol-translation validation
contain only constructed test data and are stored within a         practices, and better define security boundaries between CDN
controlled local environment.                                      infrastructure and customer-controlled origins. Furthermore,
   For the vulnerability disclosure process. Overall, we re-       during the disclosure process, we make every effort to report
ported our findings to 7 major CDN vendors and have re-            vulnerabilities to all tested providers and minimize negative
ceived active responses and engaged in in-depth interactions       impact.
with 6 of them:                                                       CDN customers may face risks from amplification behav-
   Tencent: The Tencent security team confirmed the vul-           iors, cache inconsistencies, or request-confusion effects un-
nerabilities regarding the handling of anomalous paths and         der certain deployment conditions. However, disclosure also
multiple Host/Authority headers (which could lead to cache         enables customers to make more informed deployment de-
poisoning). As of now, these issues have been successfully         cisions, evaluate whether and how to enable HTTP/3, and
patched. Other reported vectors will be addressed as optimiza-     strengthen origin-side mitigations and cache-control policies.
tions in the future.                                                  End users could indirectly experience degraded service
   Baidu: Upon internal review, Baidu explicitly confirmed         availability if such behaviors were abused in practice. Con-
the potential real-world harm of the CondAmp and has               versely, improved awareness and remediation of protocol-
patched this vulnerability.                                        translation weaknesses may contribute to a more secure and
   Alibaba: The Alibaba security team conducted a detailed         stable ecosystem over time.
internal evaluation of our four reported attack vectors. They         The research and security community benefits from a better
pointed out that the traffic amplification effects of Range        understanding of HTTP/3-to-HTTP/1.1 translation risks and
and Conditional-Request behaviors primarily manifest at the        regression patterns in independently implemented protocol
origin server, and will not cause the CDN itself to become         stacks. At the same time, public discussion of these behaviors
unavailable. Therefore, they consider this a Shared Respon-        may increase awareness of attack techniques among adver-
sibility model, suggesting that appropriate defense and rate-      saries. We therefore intentionally omit exploit automation
limiting mechanisms should be deployed and configured by           details, operational attack tooling, and deployment-specific
the customer at the origin side, rather than being directly        offensive guidance from the paper and released artifacts.
blocked by the CDN edge nodes. We reviewed Alibaba’s rele-            We carefully considered the potential risks of public disclo-
vant documentation, which describes a back-to-origin chunk         sure before publication. Some affected vendors acknowledged
size between 512KB and 4MB, but notably lacks clear warn-          parts of the reported behaviors and initiated remediation ef-
ings to users regarding the potential security risks of band-      forts, while others considered the observed behaviors to be
width amplification.                                               expected operational trade-offs or shared-responsibility issues.
   Cloudflare: After weeks of technical interaction, Cloud-        Consequently, not all identified risks are fully mitigated at
flare fully understood our constructed attack patterns. They       the time of writing. However, we nevertheless believe pub-
categorized this as expected "cache-fill behavior" and stated      lication is justified for several reasons. First, the reported
that this architectural design is not unique to Cloudflare.        attack vectors are derived from publicly documented HTTP
   CloudFront: The CloudFront team cited their official De-        semantics and previously studied classes of parser-confusion
veloper Guide, pointing out that proactively requesting more       and translation-layer attacks, rather than from undisclosed
bytes than specified by the client is an expected system op-       implementation secrets. Second, exploiting these behaviors
timization behavior designed to improve performance and            in practice still requires nontrivial environmental conditions,
cache efficiency.                                                  including compatible CDN configurations, origin behaviors,
   Fastly: Our vulnerability report has been successfully sub-     and controlled request construction. Third, public discussion
mitted and is currently pending initial review by their security   of these findings enables operators and customers to better
team.                                                              evaluate the risks introduced by heterogeneous protocol trans-
   Huawei: We have communicated with Huawei for several            lation, particularly during HTTP/3 adoption.
weeks. Despite we have reported multiple times, the vendor
still fails to understand the reported issues.                     Open Science
   The primary stakeholders in this work include CDN
providers, CDN customers (origin operators), end users, and        We have made the entire codebase used in this research open
the broader research and security community. Different stake-      source. The link is https://github.com/AsadaShino666/
holders may experience both benefits and burdens from dis-         H3Act or https://zenodo.org/records/20398181.
closure.                                                              The repository contains two parts. The first part provides
   CDN providers may incur operational, remediation, and           the full source code for the H3Act tool, including all prompts
reputational costs associated with investigating and address-      and all modules. Researchers wishing to reproduce the tool
ing translation-layer inconsistencies. At the same time, the       can copy these directly to a local environment for execution.
findings may help providers identify regression risks during       However, please note that our code currently supports only a



4916    35th USENIX Security Symposium                                                                      USENIX Association
local Ollama environment and does not include API adapta-         [11] CVE. CVE-2019-18277, 2019. https://www.cve.
tion; details are provided in the repository’s README. The             org/CVERecord?id=CVE-2019-16782.
second part comprises simple HTTP/3 request transmission
logic and test cases corresponding to the vulnerabilities de-     [12] Roy T. Fielding, Yves Lafon, and Julian Reschke. Hy-
scribed in Section 5. Users who merely wish to scan CDNs for           pertext Transfer Protocol (HTTP/1.1): Range Requests.
these vulnerabilities can use this simple logic to send packets        RFC 7233, June 2014.
and manually verify if the messages received by the origin        [13] Roy T. Fielding, Mark Nottingham, and Julian Reschke.
match our descriptions. This is also detailed in the README.           Hypertext Transfer Protocol (HTTP/1.1): Caching. RFC
                                                                       7234, June 2014.
References                                                        [14] Roy T. Fielding, Mark Nottingham, and Julian Reschke.
                                                                       HTTP Caching. RFC 9111, June 2022.
 [1] 6sense, 2026.      https://6sense.com/tech/
     content-delivery-network-cdn.                                [15] Roy T. Fielding, Mark Nottingham, and Julian Reschke.
                                                                       HTTP/1.1. RFC 9112, June 2022.
 [2] Saja Al-Hamdani and Dujan B. Taha. Security in con-
     tent delivery networks (cdns): A literature review. In       [16] Roy T. Fielding, Mark Nottingham, and Julian F.
     2025 International Conference on Computer Science                 Reschke. HTTP semantics. RFC, 9110:1–194, 2022.
     and Software Engineering (CSASE), pages 132–139,
     2025.                                                        [17] Roy T. Fielding and Julian Reschke. Hypertext Transfer
                                                                       Protocol (HTTP/1.1): Authentication. RFC 7235, June
 [3] Mike Belshe, Roberto Peon, and Martin Thomson. Hy-                2014.
     pertext Transfer Protocol Version 2 (HTTP/2). RFC
                                                                  [18] Roy T. Fielding and Julian Reschke. Hypertext Transfer
     7540, May 2015.
                                                                       Protocol (HTTP/1.1): Conditional Requests. RFC 7232,
 [4] David Belson. The 2025 Cloudflare Radar Year in Re-               June 2014.
     view: The rise of AI, post-quantum, and record-breaking      [19] Roy T. Fielding and Julian Reschke. Hypertext Trans-
     DDoS attacks, 2025. https://blog.cloudflare.                      fer Protocol (HTTP/1.1): Message Syntax and Routing.
     com/radar-2025-year-in-review/.                                   RFC 7230, June 2014.
 [5] David Benjamin. Using TLS 1.3 with HTTP/2. RFC               [20] Roy T. Fielding and Julian Reschke. Hypertext Transfer
     8740, February 2020.                                              Protocol (HTTP/1.1): Semantics and Content. RFC
                                                                       7231, June 2014.
 [6] Mike Bishop. HTTP/3. RFC 9114, June 2022.
                                                                  [21] Milad Ghaznavi, Elaheh Jalalpour, Mohammad A.
 [7] Efstratios Chatzoglou, Vasileios Kouliaridis, Geor-               Salahuddin, Raouf Boutaba, Daniel Migault, and Stere
     gios Kambourakis, Georgios Karopoulos, and Stefanos               Preda. Content delivery network security: A survey.
     Gritzalis. A hands-on gaze on HTTP/3 security through             IEEE Communications Surveys & Tutorials, 23(4):2166–
     the lens of HTTP/2 and a public dataset. Comput. Secur.,          2190, 2021.
     125:103051, 2023.
                                                                  [22] Run Guo, Jianjun Chen, Baojun Liu, Jia Zhang, Chao
 [8] Jianjun Chen, Jian Jiang, Haixin Duan, Nicholas Weaver,           Zhang, Haixin Duan, Tao Wan, Jian Jiang, Shuang Hao,
     Tao Wan, and Vern Paxson. Host of troubles: Multiple              and Yaoqi Jia. Abusing cdns for fun and profit: Security
     host ambiguities in http implementations. In Proceed-             issues in cdns’ origin validation. In 2018 IEEE 37th
     ings of the 2016 ACM SIGSAC Conference on Com-                    Symposium on Reliable Distributed Systems (SRDS),
     puter and Communications Security, CCS ’16, page                  pages 1–10, 2018.
     1516–1527, New York, NY, USA, 2016. Association
     for Computing Machinery.                                     [23] Run Guo, Jianjun Chen, Yihang Wang, Keran Mu, Bao-
                                                                       jun Liu, Xiang Li, Chao Zhang, Haixin Duan, and Jian-
 [9] Jianjun Chen, Jian Jiang, Xiaofeng Zheng, Haixin Duan,            ping Wu. Temporal CDN-Convex Lens: A CDN-
     Jinjin Liang, Kang Li, Tao Wan, and Vern Paxson. For-             Assisted Practical Pulsing DDoS Attack. In 32th
     warding Loop Attacks in Content Delivery Networks.                USENIX Conference on Security Symposium, 2023.
     In Proceedings 2016 Network and Distributed System
     Security Symposium, 2016.                                    [24] Run Guo, Weizhong Li, Baojun Liu, Shuang Hao, Jia
                                                                       Zhang, Haixin Duan, Kaiwen Sheng, Jianjun Chen, and
[10] Cloudflare. What is cdn?, 2026. https://www.                      Ying Liu. CDN Judo: Breaking the CDN DoS Protection
     cloudflare.com/learning/cdn/what-is-a-cdn/.                       with Itself. In 27th Annual Network and Distributed



USENIX Association                                                                  35th USENIX Security Symposium       4917
       System Security Symposium, NDSS 2020, San Diego,          [34] Weizhong Li, Kaiwen Shen, Run Guo, Baojun Liu, Jia
       California, USA, February 23-26, 2020. The Internet            Zhang, Haixin Duan, Shuang Hao, Xiarun Chen, and
       Society, 2020.                                                 Yao Wang. Cdn backfired: Amplification attacks based
                                                                      on http range requests. In 2020 50th Annual IEEE/IFIP
[25] Shuai Hao, Yubao Zhang, Haining Wang, and Angelos                International Conference on Dependable Systems and
     Stavrou. End-Users get maneuvered: Empirical analysis            Networks (DSN), pages 14–25, 2020.
     of redirection hijacking in content delivery networks. In
     27th USENIX Security Symposium (USENIX Security             [35] Jinjin Liang, Jian Jiang, Haixin Duan, Kang Li, Tao
     18), pages 1129–1145, Baltimore, MD, August 2018.                Wan, and Jianping Wu. When https meets cdn: A case
     USENIX Association.                                              of authentication in delegated service. In 2014 IEEE
                                                                      Symposium on Security and Privacy, pages 67–82, 2014.
[26] Jana Iyengar and Martin Thomson. QUIC: A UDP-
     Based Multiplexed and Secure Transport. RFC 9000,           [36] Yuejia Liang, Jianjun Chen, Run Guo, Kaiwen Shen,
     May 2021.                                                        Hui Jiang, Man Hou, Yue Yu, and Haixin Duan. In-
                                                                      ternet’s invisible enemy: Detecting and measuring web
[27] Bahruz Jabiyev, Anthony Gavazzi, Kaan Onarlioglu, and            cache poisoning in the wild. In Proceedings of the 2024
     Engin Kirda. Gudifu: Guided differential fuzzing for             on ACM SIGSAC Conference on Computer and Commu-
     http request parsing discrepancies. In Proceedings of the        nications Security, CCS ’24, page 452–466, New York,
     27th International Symposium on Research in Attacks,             NY, USA, 2024. Association for Computing Machinery.
     Intrusions and Defenses, RAID ’24, page 235–247, New
     York, NY, USA, 2024. Association for Computing Ma-          [37] Ziyu Lin, Zhiwei Lin, Ximeng Liu, Jianjun Chen, Run
     chinery.                                                         Guo, Cheng Chen, and Shaodong Xiao. CDN cannon:
                                                                      Exploiting CDN Back-to-Origin strategies for amplifi-
[28] Bahruz Jabiyev, Steven Sprecher, Anthony Gavazzi,                cation attacks. In 33rd USENIX Security Symposium
     Tommaso Innocenti, Kaan Onarlioglu, and Engin Kirda.             (USENIX Security 24), pages 5717–5734, Philadelphia,
     FRAMESHIFTER: Security Implications of HTTP/2-to-                PA, August 2024. USENIX Association.
     HTTP/1 Conversion Anomalies. In Kevin R. B. Butler
     and Kurt Thomas, editors, 31st USENIX Security Sympo-       [38] Ziyu Lin, Zhiwei Lin, Ximeng Liu, Zuobing Ying, and
     sium, USENIX Security 2022, Boston, MA, USA, August              Cheng Chen. Unveiling the bandwidth nightmare: Cdn
     10-12, 2022, pages 1061–1075. USENIX Association,                compression format conversion attacks. In 2024 2nd
     2022.                                                            International Conference on Big Data and Privacy Com-
                                                                      puting (BDPC), pages 97–106, 2024.
[29] Bahruz Jabiyev, Steven Sprecher, Kaan Onarlioglu, and
     Engin Kirda. T-reqs: Http request smuggling with differ-    [39] Nelson F Liu, Kevin Lin, John Hewitt, Ashwin Paran-
     ential fuzzing. In Proceedings of the 2021 ACM SIGSAC            jape, Michele Bevilacqua, Fabio Petroni, and Percy
     Conference on Computer and Communications Security,              Liang. Lost in the middle: How language models use
     CCS ’21, page 1805–1820, New York, NY, USA, 2021.                long contexts. Transactions of the association for com-
     Association for Computing Machinery.                             putational linguistics, 12:157–173, 2024.

[30] Ben Kallus, Prashant Anantharaman, Michael E. Lo-           [40] Yuwei Liu, Junquan Deng, Xiangkun Jia, Yanhao Wang,
     casto, and Sean W. Smith. The HTTP garden: Discov-               Minghua Wang, Lin Huang, Tao Wei, and Purui Su.
     ering parsing vulnerabilities in HTTP/1.1 implementa-            Promefuzz: A knowledge-driven approach to fuzzing
     tions by differential fuzzing of request streams. CoRR,          harness generation with large language models. In
     abs/2405.17737, 2024.                                            Proceedings of the 2025 ACM SIGSAC Conference on
                                                                      Computer and Communications Security, CCS ’25, page
[31] James   Kettle.         HTTP    Desync At-                       1559–1573, New York, NY, USA, 2025. Association for
     tacks:   Request Smuggling    Reborn, 2019.                      Computing Machinery.
     https://portswigger.net/research/
     http-desync-attacks-request-smuggling-reborn.               [41] Ruijie Meng, Martin Mirchev, Marcel Böhme, and Ab-
                                                                      hik Roychoudhury. Large language model guided proto-
[32] James Kettle.     HTTP/2: The Sequel is Al-                      col fuzzing. In Proceedings of the 31st Annual Network
     ways Worse, 2021.   https://portswigger.net/                     and Distributed System Security Symposium (NDSS),
     research/http2.                                                  2024.

[33] James Kettle. HTTP/1.1 must die: the desync endgame,        [42] Seyed Ali Mirheidari, Sajjad Arshad, Kaan Onarlioglu,
     2025.        https://portswigger.net/research/                   Bruno Crispo, Engin Kirda, and William Robertson.
     http1-must-die.                                                  Cached and confused: Web cache deception in the wild.



4918     35th USENIX Security Symposium                                                                 USENIX Association
     In 29th USENIX Security Symposium (USENIX Secu-               on Hot Topics in Networks, HotNets ’23, page 41–47,
     rity 20), pages 665–682. USENIX Association, August           New York, NY, USA, 2023. Association for Computing
     2020.                                                         Machinery.
[43] Seyed Ali Mirheidari, Matteo Golinelli, Kaan Onarli-     [56] Kaiwen Shen, Jianyu Lu, Yaru Yang, Jianjun Chen,
     oglu, Engin Kirda, and Bruno Crispo. Web cache de-            Mingming Zhang, Haixin Duan, Jia Zhang, and Xi-
     ception escalates! In 31st USENIX Security Symposium          aofeng Zheng. Hdiff: A semi-automatic framework for
     (USENIX Security 22), pages 179–196, Boston, MA, Au-          discovering semantic gap attack in http implementations.
     gust 2022. USENIX Association.                                In 2022 52nd Annual IEEE/IFIP International Con-
                                                                   ference on Dependable Systems and Networks (DSN),
[44] Hoai Viet Nguyen, Luigi Lo Iacono, and Hannes Feder-          pages 1–13, 2022.
     rath. Your cache has fallen: Cache-poisoned denial-of-
     service attack. In Proceedings of the 2019 ACM SIGSAC    [57] Martin Thomson and Cory Benfield. HTTP/2. RFC
     Conference on Computer and Communications Security,           9113, June 2022.
     CCS ’19, page 1915–1936, New York, NY, USA, 2019.
     Association for Computing Machinery.                     [58] Yuan Tian and Tianyi Zhang. Selective prompt anchor-
                                                                   ing for code generation. In Proceedings of the 42nd
[45] OpenAI. gpt-oss, 2025.        https://ollama.com/             International Conference on Machine Learning (ICML),
     library/gpt-oss.                                              2025.
[46] OWASP. Cache Poisoning, 2019. https://owasp.             [59] w3tech.      Usage statistics of HTTP/3 for web-
     org/www-community/attacks/Cache_Poisoning.                    sites, 2025. https://w3techs.com/technologies/
[47] OWASP.      Denial of Service, 2019.  https:                  details/ce-http3.
     //owasp.org/www-community/attacks/Denial_                [60] Qi Wang, Jianjun Chen, Zheyu Jiang, Run Guo, Ximeng
     of_Service.                                                   Liu, Chao Zhang, and Haixin Duan. Break the wall from
[48] Lorenzo Pisu, Federico Loi, Davide Maiorca, and Gior-         bottom: Automated discovery of protocol-level evasion
     gio Giacinto. HTTP/3 will not Save you from Request           vulnerabilities in web application firewalls. In 2024
     Smuggling: A Methodology to Detect HTTP/3 Header              IEEE Symposium on Security and Privacy (SP), pages
     (mis)Validations . In 2024 22nd International Sympo-          185–202, 2024.
     sium on Network Computing and Applications (NCA),        [61] Watchfire.       HTTP Request Smuggling,
     pages 97–104, Los Alamitos, CA, USA, October 2024.            2005.      https://www.cgisecurity.com/lib/
     IEEE Computer Society.                                        HTTP-Request-Smuggling.pdf.
[49] PSF. Python 3.12.7, 2024. https://www.python.            [62] Yunze Wei, Kaiwen Chi, Shibo Du, Xiaohui Xie, Ziyu
     org/downloads/release/python-3127/.                           Geng, Yuwei Han, Zhen Li, Zhanyou Li, and Yong Cui.
[50] Zhen Qin, Xiaodong Han, Weixuan Sun, Dongxu                   Large language model driven automated network pro-
     Li, Lingpeng Kong, Nick Barnes, and Yiran Zhong.              tocol testing. In Proceedings of the 2025 Applied Net-
     The devil in linear transformer.  arXiv preprint              working Research Workshop, ANRW ’25, page 32–38,
     arXiv:2210.10340, 2022.                                       New York, NY, USA, 2025. Association for Computing
                                                                   Machinery.
[51] Julian Reschke. HTTP Authentication-Info and Proxy-
     Authentication-Info Response Header Fields. RFC 7615,    [63] Linkai Zheng, Xiang Li, Chuhan Wang, Run Guo,
     September 2015.                                               Haixin Duan, Jianjun Chen, Chao Zhang, and Kaiwen
                                                                   Shen. Reqsminer: Automated discovery of CDN for-
[52] Julian Reschke. Hypertext Transfer Protocol (HTTP)            warding request inconsistencies and dos attacks with
     Client-Initiated Content-Encoding. RFC 7694, Novem-           grammar-based fuzzing. In 31st Annual Network and
     ber 2015.                                                     Distributed System Security Symposium, NDSS 2024,
                                                                   San Diego, California, USA, February 26 - March 1,
[53] Julian Reschke. The Hypertext Transfer Protocol Status
                                                                   2024. The Internet Society, 2024.
     Code 308 (Permanent Redirect). RFC 7538, April 2015.
[54] Eric Rescorla. HTTP Over TLS. RFC 2818, May 2000.        [64] Mingwei Zheng, Danning Xie, and Xiangyu Zhang.
                                                                   Large language models for validating network protocol
[55] Prakhar Sharma and Vinod Yegneswaran. Prosper: Ex-            parsers. In 2025 IEEE Security and Privacy Workshops
     tracting protocol specifications using large language         (SPW), pages 56–64. IEEE, 2025.
     models. In Proceedings of the 22nd ACM Workshop



USENIX Association                                                              35th USENIX Security Symposium       4919
                                              Table 9: The Amplification of RangeAmp on Every CDN.
 Test Type             Metric                     Aliyun CDN    Aliyun ESA     Baidu       Cloudflare   Cloudfront   Fastly     Huawei     Tencent CDN     Tencent EdgeOne
                       Client Response Code               206           206        206           206          206         206        206            206                206
 Single_Range /
                       Client Response Data (B)             1             1          1              1            1          1          1              1                  1
 If-Range
                       Origin Response Data (B)        524288    400717.6*     542713*     29552200       1048576    2513443      524288              1               4097
                       Client Response Code               206           206        206           206          206         200        200            206                206
 Multiple_Range        Client Response Data (B)             1             1       1505          1473         1689    2513443    29552200           1681               1681
                       Origin Response Data (B)        524288    468256.2*     609378*     29552200       1048576    2513443    29552200         28673               12289
                       Client Response Code               416           416        416           416          200         200        416            416                416
 Wrong_Range           Client Response Data (B)             0             0        206              0    29552200    2513443         194              0                  0
                       Origin Response Data (B)       327368*      417596*     373503*     29552200      29552200    2513443      524288              0                  0
                       Client Response Code               412           412        412           200          412         412        412            412                412
 If-Match /
                       Client Response Data (B)           182           182        182     29552200           182         182        170            182                182
 If-Unmodified-Since
                       Origin Response Data (B)           182           182    490767*     29552200           182         182     524288            182                182
                       Client Response Code               304           304        304           304          304         304        304            200                200
 If-None-Match /
                       Client Response Data (B)             0             0          0              0            0          0          0      29552200            29552200
 If-Modified-Since
                       Origin Response Data (B)     29552200      29552200     633937*     29552200     179957.6*    2513443      524288      29552200            29552200


                                 Table 10: Overview of attack vectors which present in HTTP/2 and HTTP/3

                                                     Alibaba    Alibaba                                                                    Tencent        Tencent
          Attack Vector           HTTP Version                                Baidu      Cloudflare     Cloudfront     Fastly    Huawei
                                                     CDN        ESA                                                                        CDN            EdgeOne
                                  HTTP/3                  ✓          ✓           ✓               ✓               ✓         ✓          ✓
          RangeAmp
                                  HTTP/2                                         ✓               ✓               ✓         ✓          ✓
                                  HTTP/3                   ✓          ✓          ✓               ✓               ✓         ✓          ✓
          CondAmp
                                  HTTP/2                   ✓          ✓          ✓               ✓               ✓         ✓
                                  HTTP/3                   ✓          ✓          ✓                               ✓                    ✓          ✓             ✓
          HTTP Slow Attack
                                  HTTP/2                   ✓                                                                          ✓          ✓
          URI-based               HTTP/3                                                                                              ✓          ✓
          CP                      HTTP/2                                                                                                         ✓
          Multi-Host-Based        HTTP/3                                                                                                         ✓             ✓
          CP                      HTTP/2                   ✓                                     ✓               ✓                    ✓          ✓             ✓
                                  HTTP/3                                                                                              ✓
          Foo-CRLF Attack
                                  HTTP/2
                                  HTTP/3                   ✓          ✓                                                               ✓          ✓             ✓
          Meta Characters
                                  HTTP/2



A      Amplification Statistics                                                            ity when handling Single_Range and requests with If-
                                                                                           Range. Similar patterns also appear for If-Match versus
We measured the actual impact, i.e. the approximate band-                                  If-Unmodified-Since, and for If-None-Match versus If-
width amplification factor, of the two attacks reported in Sec-                            Modified-Since. Therefore, we merge these into three groups
tions 5.1.1 and 5.1.2. To capture representative behavior, we                              in our results.
repeated each packet transmission five times for every CDN.
We then calculated the average length of the DATA frames
received by the client and the average volume of data sent by
                                                                                           B     HTTP/2 vs HTTP/3
the origin server. Using the experimental setup described in                              We present the occurrence of conversion anomalies in
Section 4.1, we requested a 29,552,200-byte PNG image from                                HTTP/3-to-HTTP/1.1 and HTTP/2-to-HTTP/1.1 across
the origin server. The final statistics are shown in Table 9. We                          among CDNs in Table 10.
observed that the response behaviors of both the CDNs and
the origin server were generally stable. However, some CDNs
prematurely closed the connection to the origin, preventing
full data transmission. Consequently, the amount of data sent
varied across attempts. We marked these unstable instances
with an asterisk (*) in the table.
   Specifically, the Range-related fields are configured
as follows: Single_Range uses range: bytes=0-0;
Multiple_Range uses range: bytes=0-0, 1-1, 7-15,
428-1035, 1050-1258, 4095-4096, 524288-524290;
and Wrong_Range uses range: bytes=100-90. The
settings for the five conditional fields are shown in Figure 4.
   We observe that CDN behavior exhibits high similar-



4920     35th USENIX Security Symposium                                                                                                         USENIX Association
