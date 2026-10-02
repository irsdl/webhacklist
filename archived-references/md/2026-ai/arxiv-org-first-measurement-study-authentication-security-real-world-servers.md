---
type: Article
title: "[2605.22333] A First Measurement Study on Authentication Security in Real-World Remote MCP Servers"
description: First measurement of authentication in remote Model Context Protocol servers. Of 7,973 live servers found, 40.55% expose their tools with no authentication at all. Among the rest OAuth dominates, but MCP deployments combine open client environments, dynamic client registration and delegated authorization, which produces three MCP-specific classes of flaw beside conventional OAuth misconfiguration.
resource: "https://arxiv.org/abs/2605.22333"
tags: [article, webseclist-reference, en, arxiv-org, oauth, llm, ai-agent, measurement-study, large-scale-scan, auth-bypass, owasp-a01-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T13:14:55+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://arxiv.org/abs/2605.22333"
    title: "[2605.22333] A First Measurement Study on Authentication Security in Real-World Remote MCP Servers"
    author: Huijun Zhou, Xiaohan Zhang, Haozhe Zhang, Haoyang Zhang, Mi Zhang, Min Yang
also_at:
  - "https://arxiv.org/pdf/2605.22333"
authors:
  - Huijun Zhou
  - Xiaohan Zhang
  - Haozhe Zhang
  - Haoyang Zhang
  - Mi Zhang
  - Min Yang
canonical_url: ""
cited_by:
  - "2026-ai.md:225"
commit: ""
content_sha256: b0ad1b52a6242b26a135356d839da51e9589f1e1afa508c0acf6e912a28a8d12
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2605.22333"
published: ""
publisher: arXiv.org
publisher_english: ""
raw_sha256: b3a4b842a859a50caf259986eef8c1be584de93095aa3f9d8bb196ecab0d0d99
retrieved_from: "https://arxiv.org/pdf/2605.22333"
retrieved_kind: live
retrieved_utc: "2026-08-19T13:14:55+00:00"
slug: arxiv-org-first-measurement-study-authentication-security-real-world-servers
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# [2605.22333] A First Measurement Study on Authentication Security in Real-World Remote MCP Servers

**[2605.22333] A First Measurement Study on Authentication Security in Real-World Remote MCP Servers** - Huijun Zhou, Xiaohan Zhang, Haozhe Zhang, Haoyang Zhang, Mi Zhang, Min Yang, arXiv.org.

- Published: date not stated
- Original: <https://arxiv.org/abs/2605.22333>
- Also published at: <https://arxiv.org/pdf/2605.22333>
- Preserved from: https://arxiv.org/pdf/2605.22333 (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

A First Measurement Study on Authentication Security
                                                                            in Real-World Remote MCP Servers

                                                             Huijun Zhou*                          Xiaohan Zhang*                 Haozhe Zhang
                                                            Fudan University                       Fudan University              Fudan University
                                                        zhouhj24@m.fudan.edu.cn                 xh zhang@fudan.edu.cn     haozhezhang25@m.fudan.edu.cn
                                                            Haoyang Zhang                             Mi Zhang                        Min Yang
                                                         Central South University                  Fudan University                Fudan University
arXiv:2605.22333v1 [cs.CR] 21 May 2026




                                                         8210230811@csu.edu.cn                  mi zhang@fudan.edu.cn            m yang@fudan.edu.cn

                                         Abstract—The Model Context Protocol (MCP) is emerging as
                                         a common interface connecting large language models (LLMs)
                                         with external services. Remote deployments are becoming
                                         increasingly important as agents connect to user-linked online                                           ...
                                                                                                                           User Prompt      LLM          Authenticate   Map    Databases
                                         services, such as social, productivity, and financial services.
                                                                                                                              Result                       Resource
                                         In such deployments, the authentication boundary between
                                         MCP clients and remote servers becomes security-critical, yet
                                         remains underexplored.                                                                                    ...
                                                                                                                                                                        Game     Search
                                              We present the first measurement study of authentication                                   MCP Clients
                                         security in real-world remote MCP servers. We identify 7,973
                                                                                                                                          MCP Host                       Remote MCP
                                         live remote MCP servers, finding that 40.55% expose tools                                                                         Servers
                                         without authentication. Among authenticated servers, OAuth
                                         is the dominant authorization mechanism for reaching remote              Figure 1. Demonstration of the remote MCP server authentication.
                                         services, and OAuth deployments in the MCP ecosystem com-
                                         monly exhibit three characteristics: open client environments,
                                         dynamic client registration, and delegated authorization. These       systems. This shift requires a reusable interface for agents
                                         characteristics distinguish MCP deployments from traditional          to discover tools, exchange context, and invoke operations
                                         OAuth and introduce new attack surfaces. Guided by this               on behalf of users. The Model Context Protocol (MCP)
                                         observation, we derive a taxonomy of authentication flaws             has emerged as such an interface, allowing LLM clients
                                         comprising three MCP-specific categories and conventional             such as Claude Desktop, Cursor, and terminal-based agent
                                         OAuth misconfigurations, for a total of four categories and           frameworks to connect to third-party servers that expose
                                         nine concrete flaw types. To evaluate these flaws at scale, we        files, databases, APIs, and other capabilities.
                                         implement a semi-automated detection framework that com-                   MCP servers can be deployed locally or remotely. Lo-
                                         bines passive traffic inspection with active dynamic probing.         cal servers run on the user’s device and are a natural fit
                                         Applying it to 119 testable real-world OAuth-enabled MCP              for exposing device-local resources within a default-trusted
                                         servers, we find that each server exhibits at least one flaw,         environment. Anthropic’s recent deployment guidance sug-
                                         with a total of 325 flaws identified, among which dynamic client      gests a shift in MCP’s role: local capabilities can often
                                         registration flaws affect 96.6% of tested servers. Many of these      be handled through application-native skills or CLI-based
                                         flaws can lead to sensitive information leakage and account           agent workflows, while MCP is positioned as the interface
                                         takeover. Through responsible disclosure, we obtained 9 CVE           for agents to reach production systems and remote services,
                                         IDs. Our findings expose pervasive authentication weaknesses          especially for Web applications, mobile apps, and cloud-
                                         in the MCP ecosystem and underscore the urgent need for               hosted agents [1]. As a result, remote MCP servers become
                                         hardened OAuth-based remote deployments.                              the service endpoints through which different MCP clients
                                                                                                               can access user-linked online accounts and trigger privileged
                                         1. Introduction                                                       operations, including invoking SaaS APIs, querying private
                                                                                                               data, and manipulating cloud resources [2], [3].
                                            Large language models (LLMs) are increasingly used as                   Figure 1 illustrates the security setting studied in this
                                         agents that invoke tools, retrieve data, and act on external          paper. A user may ask an agent to interact with remote
                                                                                                               services through an MCP client, and the client in turn
                                         * Both authors contributed equally to this research.                  connects to remote MCP servers that expose service-backed
tools. These tools may be linked to the user’s social plat-             and OAuth authorization practices of remote MCP
forms, maps, entertainment applications, cloud workspaces,              servers in the wild.
payment services, or other remote accounts. In this setting,       •    Authentication Security Analysis. We perform an
authentication forms the security boundary before an MCP                in-depth analysis of OAuth-based remote MCP au-
client can access server-side tools and the account-linked              thentication flows, distill three architectural charac-
capabilities behind them. If this boundary is missing or                teristics that shape their attack surface, and propose
incorrectly enforced, an attacker-controlled client may gain            a flaw taxonomy comprising 4 categories and 9
unauthorized access to the user-linked service accounts.                distinct flaws grounded in these characteristics.
    Securing this boundary is challenging because MCP              •    Real-world Evaluation. We develop a semi-
brings OAuth into a loosely coupled agent ecosystem. MCP                automated security detection framework and conduct
clients and servers, and upstream authorization servers are             a large-scale detection study of OAuth-based re-
often developed and operated by different entities. Some                mote MCP servers. We manually tested 119 OAuth-
deployments further introduce a cross-entity, multi-hop au-             enabled servers and found that all exhibit at least
thorization model in which the MCP server acts as an in-                one flaw, obtaining 9 CVE IDs through responsible
termediary between local clients and upstream services [4].             disclosure.
Although the MCP specification adopts OAuth-based au-
thorization and outlines best practices [5], real-world im-     2. Background
plementations may deviate from standard OAuth flows, a
pattern that has repeatedly led to vulnerabilities in prior
OAuth systems [6]. Existing MCP security research has
                                                                2.1. Model Context Protocol (MCP)
mainly studied model-layer and tool-interface threats, such
as prompt injection [7], [8] and tool poisoning [9], [10],           The Model Context Protocol (MCP), introduced by An-
leaving protocol-layer authentication security less under-      thropic in November 2024, is an open standard for connect-
stood.                                                          ing LLM-based applications to external tools, data sources,
                                                                and services [11]. Its architecture consists of three principal
    To address these gaps, we conduct the first large-scale
                                                                roles: (1) The MCP host is the user-facing AI application,
measurement of authentication security in real-world remote
                                                                such as Claude Desktop, Cursor IDE, or an autonomous AI
MCP servers. We first characterize the deployment land-
                                                                agent, that orchestrates LLM interactions, enforces access
scape of remote MCP servers and analyze their authen-
                                                                control, and manages the lifecycle of MCP client connec-
tication adoption and OAuth practices. We then examine
                                                                tions. (2) The MCP client is an intermediary embedded
how OAuth is deployed in this setting and uncover the
                                                                within the host that manages bidirectional communication
implementation deviations. Using mainstream cybersecurity
                                                                with one or more MCP servers. It initiates capability dis-
search engines, we identify 7,973 validated live remote MCP
                                                                covery requests, dispatches tool invocations, and processes
servers. Among them, 40.55% expose their tool interface
                                                                server notifications and responses. (3) The MCP server is
with no authentication mechanism, while 2,428 implement
                                                                an independent process that exposes three categories of
OAuth-based authorization flows. We then analyze a fully
                                                                capabilities to clients: tools, resources, and prompts [12],
testable subset of these OAuth deployments and distill three
                                                                [13]. All messages between MCP clients and servers are
security-relevant characteristics: open client environments,
                                                                encoded as JSON-RPC 2.0 over UTF-8.
dynamic client registration, and delegated authorization.
                                                                     MCP defines two standard transport modes. In the stdio
    Based on these observations, we construct an authenti-
                                                                transport, the MCP host launches the MCP server as a local
cation flaw taxonomy for OAuth-based remote MCP, sum-
                                                                subprocess and exchanges JSON-RPC messages over stan-
marizing 9 security flaws across 4 categories. We also
                                                                dard input and output streams. In the HTTP/SSE transport
develop a semi-automated detection framework that recon-
                                                                (Streamable HTTP), the MCP server runs as a network-
structs OAuth lifecycles from MCP traffic, applies passive
                                                                accessible process and communicates via HTTP POST re-
checks to observed flows, and performs controlled active
                                                                quests and Server-Sent Events [9], [14]. This distinction
probing for flaws that require dynamic validation. Applying
                                                                determines the basic security boundary of the deployment.
it to 119 OAuth-enabled MCP servers, we find that each
                                                                In the stdio model, the MCP server remains within the same
tested server exhibits at least one flaw, with a total of 325
                                                                trust boundary as the host. In the HTTP/SSE model, the
flaws identified. Among them, dynamic client registration
                                                                MCP server is exposed as a network service and therefore
flaws and open client environment flaws affect 96.6% and
                                                                inherits the authentication, access-control, and transport se-
85.7% of servers respectively. Many of these flaws can lead
                                                                curity requirements of a conventional Web application [2],
to sensitive information leakage and account takeover. We
                                                                [3].
responsibly disclosed confirmed issues to affected vendors
and obtained 9 CVE IDs. The main contributions of this
paper are as follows:                                           2.2. MCP Authentication

   •   First Measurement of Remote MCP Authen-                      The MCP specification has evolved rapidly in its treat-
       tication. We present the first empirical analysis        ment of authentication for remote deployments. Figure 2
       of the deployment scale, authentication adoption,        illustrates this progression.


                                                                                                                             2
 v2024-11-05 (Initial Release)       v2025-03-26 (OAuth 2.1 Revision) v2025-06-18 (Security Revision)   v2025-11-25 (Current Stable)
                                                                                                                                       and access tokens, and the user-linked service accounts
       No Authentication                   OAuth 2.1 Introduced            Security Enhancements          Full OAuth 2.1 Framework

                                                                           MUST: Discovery via RFC         SHOULD: Client ID
                                                                                                                                       that a remote MCP server can reach. We assume that the
    Auth: No standardized                 MUST: OAuth 2.1 for HTTP-
    authorization framework for
    remote MCP servers.
                                          based flows.                     9728 (Protected Resource
                                                                           Metadata).
                                                                                                           Metadata Documents as
                                                                                                           preferred registration.
                                                                                                                                       remote MCP server, authorization server, upstream services,
                                          MUST: Auth Code Grant
    Context: Designed for local
    environments.
                                          with PKCE (RFC 7636).            MUST: Mandatory
                                                                           Audience Validation.
                                                                                                           MAY: Dynamic Client
                                                                                                           Registration (RFC 7591)     TLS channels, and the user’s browser and device are not
                                          SHOULD: Dynamic Client                                           as a backward-
    Security: Assumes trusted
    local transport (e.g., stdio).
                                          Registration (RFC 7591).         MUST: Resource
                                                                           parameters (RFC 8707) in
                                                                                                           compatibility fallback.     compromised. The security boundary of interest is therefore
                                                                           requests.
                                                                                                                                       the authentication and OAuth flow that decides whether a
                                                                                                                                       particular MCP client should be allowed to access MCP
          Figure 2. MCP specification authentication evolution timeline.                                                               tools and the account-linked capabilities behind them.
                                                                                                                                           Specifically, we assume a standard attacker model. The
                                                                                                                                       attacker is not required to operate a malicious MCP client.
    The initial specification release on 2024-11-05 con-                                                                               Instead, they are capable of sending arbitrary HTTP requests
tained no mandatory authentication requirements for re-                                                                                to publicly exposed server endpoints (e.g., exploiting Dy-
mote MCP servers, reflecting MCP’s origins as a local                                                                                  namic Client Registration), hosting malicious web pages,
integration tool [15]. The 2025-03-26 revision introduced                                                                              and luring victims into interacting with crafted authorization
OAuth 2.1 as the mandatory framework for HTTP-based                                                                                    URIs. The attacker can observe all network traffic directed to
authentication flows [16]. It required authorization servers                                                                           domains under their control (e.g., rogue redirect URIs). The
to implement OAuth 2.1 and required MCP clients to use                                                                                 attacker’s goal is to bypass authentication checks, extract
the Authorization Code grant with PKCE (RFC 7636) [17].                                                                                authorization artifacts (such as codes or tokens), bind a
Dynamic Client Registration (RFC 7591) [18] was intro-                                                                                 victim’s service account to an attacker-controlled identity,
duced as a SHOULD-level recommendation. The 2025-                                                                                      or exploit the MCP server’s dual role to launch confused
06-18 revision [19] further strengthened the authoriza-                                                                                deputy attacks against upstream resources. We do not as-
tion architecture by introducing Protected Resource Meta-                                                                              sume that the attacker can compromise TLS cryptography,
data (RFC 9728) [20] for authorization server discov-                                                                                  breach the victim’s underlying device or browser, directly
ery, requiring support for OAuth 2.0 Resource Indicators                                                                               compromise the remote servers, or access non-routable
(RFC 8707) [21], and mandating audience validation. The                                                                                enterprise-internal networks.
stable 2025-11-25 [5] release further refined the client trust
model by prioritizing Client ID Metadata Documents as
the preferred client registration mechanism, while retaining
                                                                                                                                       3. Measurement of Remote MCP Servers
Dynamic Client Registration (RFC 7591) primarily as a                                                                                      In this section, we measure how remote MCP servers
backward-compatibility fallback. This rapid evolution from                                                                             are deployed in the wild. We first identify candidate servers
locally trusted integrations to a more comprehensive OAuth-                                                                            through search-engine discovery and active probing, then
based security architecture may help explain the uneven                                                                                summarize the resulting dataset, and finally characterize
levels of security compliance observed in real-world MCP                                                                               OAuth deployments in the subset that we analyze in depth.
deployments.
    Because MCP clients are often native or locally running
applications, they typically operate in open client environ-
                                                                                                                                       3.1. Identifying Remote MCP servers
ments and cannot reliably protect a client_secret.                                                                                          We designed a two-step pipeline to identify remote MCP
In this setting, the Authorization Code grant with PKCE                                                                                servers in the wild, illustrated in Figure 3. The pipeline
provides the main binding between the authorization request                                                                            first collects candidates from cybersecurity search engines
and the subsequent token exchange. PKCE requires the                                                                                   using MCP-specific fingerprints, and then actively probes
client to generate a one-time code_verifier and send                                                                                   each candidate with MCP handshake requests to confirm
only its derived code_challenge in the authorization                                                                                   whether it behaves as a live remote MCP server.
request. The original verifier is later presented at the token
endpoint, so that an intercepted authorization code cannot be
                                                                                                                                           1. Candidate Discovery                       2. Automated Validation
redeemed without possession of the corresponding verifier.
    In addition, an MCP server may act as an OAuth Re-                                                                                     Identifier-based                             MCP initialize      Check
source Server with respect to the MCP client while also                                                                                    Protocol-based      FOFA                      Request           Response
                                                                                                                                           Structure &        Shodan
acting as an OAuth Client to external services such as                                                                                     Content cues
                                                                                                                                                                   MCP Server   Filtering           MCP Server   Validated MCP
GitHub, Slack, or databases [4], [22]. This dual role creates                                                                              MCP Features            Candidates    Script             Candidates       Servers
a multi-hop authorization chain that differs from traditional
two-party OAuth deployments and complicates end-to-end
reasoning about security guarantees [23], [24].                                                                                        Figure 3. Two-step pipeline for discovering and validating remote MCP
                                                                                                                                       servers.

2.3. Threat Model                                                                                                                          (1) Candidate Discovery. We used two popular cyber-
                                                                                                                                       security search engines, i.e., FOFA [25] and Shodan [26],
    We follow the standard Web and OAuth security model                                                                                to collect candidate remote MCP servers, following prior
and focus on remote attackers. The protected assets are the                                                                            Internet-wide measurement studies that rely on search-
user’s MCP session, authorization artifacts such as codes                                                                              engine-backed asset discovery [27]. Our queries combined


                                                                                                                                                                                                                             3
identifier-based signals (e.g., mcp-session-id, mcp-version,       were test or demonstration deployments and did not appear
and MCP-related hostnames), protocol-level strings (e.g.,          to contain sensitive data. However, we found one MCP
tools/call, tools/list, and initialize payloads containing json-   server (**1 ) that exposed real sensitive information through
rpc), and lightweight structure and content cues from non-         unauthenticated tool access. This MCP server was primarily
HTML endpoints such as /info. We explicitly excluded con-          used for CRM (i.e., a customer relationship management
ventional frontend Web features such as text/html to reduce        system that stores detailed customer records, sales history,
noise from ordinary websites.                                      service requests, and communication logs). The server was
     (2) Automated Validation. We developed an active prob-        intended to be an internal service, but mistakenly lacked
ing script to verify the candidate MCP servers. It sends an        any authentication mechanism. As a result, any user able
MCP initialize handshake request and retains a node only if        to connect to this MCP server could query over 5,000
it returns a structurally valid JSON-RPC response with MCP         internal enterprise records, including customer names, email
protocol features. The script also extracts transport modes,       addresses, phone numbers, and physical addresses. We re-
capability configurations, authentication behavior, and basic      ported the issue to the affected party and obtained a CVE
metadata for subsequent analysis.                                  ID (CVE-2025-61510).
                                                                       In addition, we will continue to validate other servers
3.2. Identification Results                                        that expose tool interfaces without authentication. This will
                                                                   be part of our future work, and we will responsibly report
    Table 1 summarizes the identification results. The             any discovered issues to all relevant parties.
search-engine queries produced a large initial dataset, which          Finding 1.3: OAuth is the main standardized mecha-
resulted in 28,715 unique candidate endpoints after dedu-          nism for linking remote MCP servers to user service
plication by IP address and port. Active MCP probing               accounts. Static tokens and API keys are often used in
further refined this set to 7,973 live remote MCP servers.         single-user or manually provisioned deployments, but they
To estimate false positives, two security researchers indepen-     do not provide a standard workflow for user login, consent,
dently reviewed a random sample of 100 validated servers.          and account linking across different MCP clients. OAuth,
We identified only 1 false positive, a non-standard JSON-          by contrast, is designed for multi-user account linking and
RPC service that resembled an MCP handshake but did not            delegated access to remote services. We therefore focus
expose a valid MCP tool interface.                                 the rest of the paper on OAuth-enabled MCP deployments,
                                                                   where authentication decisions directly govern access to
  TABLE 1. I DENTIFICATION RESULTS FOR REMOTE MCP SERVERS .        user-linked remote service accounts.

          Candidate Discovery      Automated Validation
                                                                      Finding 1. Authentication practices in real-world re-
                28,715                    7,973
                                                                      mote MCP deployments remain uneven: many servers
                                                                      expose tools without authentication, and the authenti-
    Finding 1.1: Authentication mechanisms vary across
                                                                      cated deployments mainly rely on static tokens/API
validated remote MCP servers. Table 2 summarizes the au-
                                                                      keys or OAuth. OAuth is especially important for
thentication status of the validated servers. 3,233 (40.55%)
                                                                      remote MCP because it provides the standardized path
of the validated servers expose tool interfaces with no au-
                                                                      for linking MCP clients to user service accounts.
thentication at all, meaning that any client can invoke tools
or trigger API requests without presenting credentials.

  TABLE 2. AUTHENTICATION STATUS AMONG VALIDATED REMOTE            3.3. Characterization of MCP OAuth Deployments
                      MCP SERVERS .
                                                                       To understand how OAuth is deployed in practice,
      Authentication status          Servers    Proportion
                                                                   we further characterize the OAuth-enabled remote MCP
      No authentication              3,233      40.55%             servers. Table 3 summarizes the subset construction.
      OAuth-based authentication     2,428      30.45%             Since non-dynamic registration (i.e., manual client
      Static token or API key        2,312      29.00%             registration) cannot be automated in subsequent detection
      Total                          7,973      100%               and requires per-server manual handling with non-scalable
                                                                   overhead, we focus our subsequent detection primarily on
    Among the remaining authenticated servers, static tokens       servers that support DCR (i.e., no manual registration).
or API keys and OAuth-based flows are the two dominant             We first probed OAuth metadata endpoints, such as
mechanisms. Specifically, 2,312 (29%) servers rely on static       /.well-known/oauth-authorization-server
tokens or API keys, while 2,428 (30.45%) servers implement         and OpenID Connect metadata endpoints, and treated the
OAuth-based authentication flows.                                  presence of a registration_endpoint as evidence of
    Finding 1.2: Unauthenticated MCP servers can ex-               DCR support. This process identified 1,118 DCR-enabled
pose sensitive data. To understand the impact of unauthenti-       servers from 2,428 OAuth-enabled servers.
cated deployments, we randomly selected MCP servers that
exposed tool interfaces without authentication. Most of them         1. Anonymized for ethical considerations.



                                                                                                                               4
   TABLE 3. OAUTH - ENABLED REMOTE MCP SERVERS USED FOR           platforms or other remote services through delegated au-
                        EVALUATION .                              thorization. In such deployments, the MCP server acts as an
                                                                  OAuth resource server with respect to the MCP client, while
    Subset     OAuth-enabled        DCR-enabled   Testable
                                                                  also acting as an OAuth client to the upstream service. This
    Servers        2,428              1,118         119           creates a multi-hop authorization chain across independently
                                                                  operated entities and introduces additional state that must
     To ensure valid and safe end-to-end testing, we man-         remain bound across layers.
ually filtered the initial deployments. We excluded 387
redundant nodes (e.g., domain/IP overlaps, multi-instance            Finding 2. OAuth-enabled remote MCP deployments
deployments) and 32 invalid cases that required no authen-           commonly combine open client environments, dy-
tication. Furthermore, 573 servers were deemed untestable:           namic client registration, and delegated authorization.
50 exposed did not support DCR (returning HTTP 404),                 These characteristics distinguish MCP OAuth from
207 suffered connection or execution failures, and 316               conventional Web OAuth deployments and shape the
were restricted by strict enterprise access controls. We then        attack surface.
eliminated 7 anomalous nodes that immediately triggered a
callback response upon receiving an authorization request
without any user interaction, thus failing to constitute a        4. Security Analysis of MCP OAuth
complete OAuth semantic flow. These untestable factors are
objective constraints (e.g., corporate network policies, server       In this section, we first abstract the OAuth workflow
flaws, or lack of user interaction) that cannot be overcome       used by remote MCP deployments and identify the security
by any automated or manual means. Finally, we obtained a          checks that should be enforced at each phase. We then use
core testable subset of 119 servers. All subsequent statistical   this workflow to organize the implementation flaws observed
percentages are strictly scoped to this 119-server evaluation     in practice into a taxonomy that guides our later detection
dataset.                                                          study.
     Finding 2.1: Dynamic client registration is com-
mon among OAuth-enabled remote MCP servers.                       4.1. MCP OAuth Workflow
Among the 2,428 OAuth-enabled servers, 1,118 advertise
a registration_endpoint, indicating DCR support.                       We begin by abstracting the common OAuth workflow
This accounts for 46.0% of OAuth-enabled servers. DCR             used by remote MCP deployments, which consists of three
appears frequently because remote MCP servers need to             core phases: P1 Discovery & Registration, P2 Authorization,
support heterogeneous MCP clients, including desktop ap-          and P3 Token Exchange, plus an optional delegated phase
plications, IDEs, CLI tools, and cloud-hosted agents, for         (PA) that appears in 68.07% of our 119-server characteriza-
which manual pre-registration of every client instance is         tion subset. This abstraction is useful because most flaws we
difficult to scale. DCR therefore becomes a practical reg-        study correspond to a broken binding in one of these phases:
istration mechanism for remote MCP OAuth deployments.             between a client identity and its callback endpoint, between
                                                                  an authorization request and a browser callback, between
   TABLE 4. P REVALENCE OF THREE COMMON CHARACTERISTICS           an authorization code and a token exchange, or between the
      ACROSS 119 OAUTH - ENABLED REMOTE MCP SERVERS .             MCP-layer context and an upstream OAuth flow. Figure 4
                                                                  summarizes the abstracted workflow.
      Characteristic                 Servers   Proportion              P1: Discovery & Registration. When an MCP client
      Open client environments       119/119     100%             first accesses a protected resource on an MCP server without
      Dynamic client registration    119/119     100%             a token, the server returns an HTTP 401 Unauthorized re-
      Delegated authorization         81/119    68.07%            sponse together with metadata that points to the correspond-
                                                                  ing authorization server ( 1 - 4 ). The client then establishes
    Finding 2.2: All of the testable OAuth deploy-                a usable identity through one of the mechanisms allowed
ments run in open client environments. All 119 testable           by the specification, such as Client ID Metadata Documents,
OAuth deployments interact with MCP clients that run in           Dynamic Client Registration, or pre-registration ( 5 - 6 ). The
end-user or otherwise externally controlled environments,         security-critical state established in this phase is the associa-
such as desktop applications, IDEs, CLI tools, browser-           tion between a client_id, its allowed redirect_uri
integrated clients, or cloud-hosted agent frontends. In these     values, and the authorization server that will later issue
open client environments, clients cannot reliably protect a       codes. In remote MCP, this association is often created
client_secret. As a result, the security of the OAuth             dynamically, so registration endpoints become part of the
flow depends heavily on runtime protections such as PKCE,         attack surface rather than a purely administrative interface.
redirect URI binding, short-lived authorization artifacts, and         P2: Authorization. Once the client has the authorization
correct callback handling.                                        endpoint and a usable identity, it constructs an authorization
    Finding 2.3: Delegated authorization is prevalent             URL and launches the user’s browser ( 7 ). This request
in testable OAuth deployments. Among the 119 testable             carries the parameters that bind the user-facing authoriza-
OAuth deployments, 81 (68.07%) integrate with external            tion decision to the client and callback context, including


                                                                                                                                 5
                          User Agent /
                                                              MCP Client                                                         Authorization               Upstream
                           Browser                                                                    MCP Server
                                                                                                                                    Server              Authorization Server
        P1 Discovery & Registration




                                                                           MCP Request without Token

                                                                            HTTP 401 Unauthorized

                                                                           Request Resource Metadata

                                                                              Resource Metadata


                                                                                     Dynamic Registration (clientInfo, redirect_uri)

                                                                                        Client Credentials (client_id)


                                           Open Browser
                                         with OAuth URL
        P2 Authorization




                                                                                                                                   PA Delegated OAuth
                                                                              Authorization Request
                                                                                                                                                  Delegated
                                                              client_id, redirect_uri, state, PKCE parameters)                             Authorization Request
                                                                                                                                                   Delegated
                                                                               Callback Response                                            Callback Response
                                                                           authorization_code, state)

                                         Authorization Code                                           Token Request

                                                                                                      Token Response
        P3 Token Exchange




                                                                             MCP Request with Token

                                                                                 MCP Response




Figure 4. Workflow of OAuth-based authentication in remote MCP deployments. P1 - P3 capture the MCP client-to-server flow, while PA captures delegated
authorization to upstream authorization services.


client_id, redirect_uri, state, and PKCE pa-                                                                MCP session, many deployments also integrate third-party
rameters. The authorization server authenticates the user                                                   services that expose their own OAuth-protected APIs. For
and presents the consent interface ( 8 ). At this point, the                                                example, a Notion MCP server not only authenticates the
server should verify the client identity, enforce the registered                                            MCP client through P1 - P3, but also obtains a Notion
redirect URI, preserve CSRF protection through state,                                                       token to call the Notion API on the user’s behalf. This
and display enough information for the user to understand                                                   second authorization loop is common, as 68.1% of the
where the authorization result will be delivered.                                                           OAuth-enabled servers in our 119-server subset implement
    P3: Token Exchange. After successful authorization,                                                     delegated authorization. We represent this additional step as
the authorization server returns a callback carrying an au-                                                 PA.
thorization code and the original state value ( 11 ). The                                                        PA: Delegated Authorization. In this second-hop flow,
browser delivers this code back to the local MCP client,                                                    the MCP server acts as an OAuth client to an upstream
which exchanges it for an access token and then includes                                                    service, typically with a pre-registered client_id, and
that token in subsequent JSON-RPC requests to the MCP                                                       manages delegated authorization on the user’s behalf ( 9 -
server ( 12 - 14 ). This phase should bind the authorization                                                10 ). This phase introduces a second authorization context
code to the same client and PKCE verifier used in P2, and                                                   that must remain consistent with the first. The MCP server
the code should become invalid immediately after redemp-                                                    may need to carry routing state between the local MCP
tion. Otherwise, an attacker who obtains a code through an                                                  flow and the upstream OAuth flow, but that state must be
earlier redirect or state-handling flaw may still be able to                                                integrity-protected and bound to the correct user session.
redeem or replay it.                                                                                        Otherwise, a flaw in the upstream context can propagate
    While P1 - P3 form a complete OAuth flow for the                                                        back into the MCP session.


                                                                                                                                                                               6
    Taken together, the four phases capture the OAuth life-           F4: Nested Context Pollution. Some MCP servers en-
cycle most commonly seen in remote MCP deployments.               code downstream routing state, such as a redirect_uri,
The three core phases follow the familiar OAuth 2.1 pat-          directly inside the upstream OAuth state parameter. If
tern, but the multi-party nature of MCP adds coordination         that nested value is neither integrity-protected nor checked
requirements between independently operated clients, MCP          against an allowlist after decoding, an attacker can tamper
servers, authorization servers, and upstream services. We         with the routing context and cause the authorization code to
use this workflow as the basis for the taxonomy below:            be delivered to an attacker-controlled endpoint.
each flaw corresponds to a missing or weakened check at a
specific phase, and the later detection framework mirrors             C3: Open client environment flaws. These flaws stem
the same lifecycle by reconstructing these phases before          from open client environments: MCP clients run in user-
applying flaw-specific tests.                                     controlled environments, cannot safely store long-term se-
                                                                  crets, and therefore rely heavily on runtime protections such
                                                                  as PKCE and explicit user consent.
4.2. Taxonomy of Implementation Flaws                                 F5: PKCE Downgrade. MCP clients cannot rely on a
                                                                  protected client_secret in open-client environments,
     Guided by the abstracted workflow and the MCP and            so PKCE becomes the primary binding between the autho-
OAuth specifications, we derive a taxonomy of implemen-           rization request and the token exchange [5]. Failures arise
tation flaws in OAuth-based remote MCP servers. The tax-          when an authorization server accepts authorization requests
onomy asks which security checks should hold in each              without a code_challenge, or permits the insecure
phase, then groups the ways these checks fail in practice. It     plain method. In each case, an attacker who intercepts
contains nine flaw types in four categories: dynamic client       the authorization redirect may be able to exchange the code
registration flaws, delegated authorization flaws, open client    without possessing the expected verifier. Prior work has
environment flaws, and common OAuth misconfigurations.            shown that such downgrade behavior is common in the
     The first three categories arise from the deployment         broader OAuth ecosystem [6].
characteristics, while the last captures conventional OAuth
                                                                      F6: Consent Page Bypass. Since MCP clients typically
mistakes that remain prevalent in MCP deployments. Table 5
                                                                  operate in open environments and rely on localhost call-
summarizes the categories and the phases where they appear.
                                                                  backs, they are vulnerable to localhost impersonation. To
     C1: Dynamic client registration flaws. These flaws           mitigate this, the latest MCP specification mandates that
arise when dynamic client registration accepts new clients        authorization servers “SHOULD display additional warnings
without sufficient identity checks or parameter restrictions,     for localhost-only redirect URIs.” However, we found that
allowing attackers to register malicious callbacks or imper-      certain MCP servers fail to display the redirect_uri.
sonate trusted applications.                                      This omission allows attackers to deceive users into unknow-
     F1: Malicious DCR Binding. Some authorization                ingly approving malicious requests, leaking authorization
servers expose DCR endpoints that accept arbitrary                codes to attacker-controlled ports.
redirect_uri values from anonymous requesters. An
attacker can therefore register a client bound to an attacker-        C4: Common OAuth misconfigurations. These flaws
controlled callback, obtain a legitimate client_id, and           are not specific to MCP, but they remain common in MCP
then use it in a deceptive authorization request. If a victim     deployments and can combine with the MCP-specific cate-
completes the flow, the authorization server returns the code     gories above to increase impact.
to the attacker’s registered endpoint.                                F7: Open Redirect. If the authorization server does
     F2: Client Blind Trust. This flaw appears when the au-       not strictly validate redirect_uri against the registered
thorization server accepts a supplied client_id without           value, an attacker can substitute a malicious callback and
verifying that it has actually been registered. An attacker can   receive the authorization code directly after the victim com-
then craft an authorization request that claims the identity of   pletes the flow.
a familiar application, causing the consent page to display           F8: Weak State. If the state parameter is missing,
misleading client information and increasing the chance that      fixed, or predictable, the client loses its CSRF protection. An
the user authorizes a malicious program.                          attacker can then forge an authorization request and cause
     C2: Delegated authorization flaws. These flaws arise in      the client to bind the victim’s session to attacker-chosen
the multi-hop authorization structure where an MCP server         authorization state or codes.
intermediates between the local client and upstream services,         F9: Code Replay. Authorization codes are meant to be
creating opportunities for cross-layer policy drift and context   single-use artifacts. If a server fails to invalidate a code
manipulation.                                                     immediately after redemption, an attacker who obtains that
     F3: Layer Inconsistency. In some delegated flows, the        code can replay it to obtain additional access tokens.
first-hop MCP authorization requires PKCE, but the up-                Overall, this analysis connects MCP’s deployment char-
stream request issued by the MCP server to the upstream           acteristics to concrete authentication checks in the OAuth
authorization server does not. This breaks the request-to-        lifecycle. The resulting taxonomy covers flaws in client
token binding that PKCE is meant to preserve and weakens          registration, authorization, token exchange, and delegated
the end-to-end guarantees of the overall flow.                    authorization, and maps each flaw to the phase where evi-


                                                                                                                               7
                      TABLE 5. TAXONOMY OF IMPLEMENTATION FLAWS IN OAUTH - BASED REMOTE MCP SERVERS .

 Category              Flaw                           Description                                                     Phase
 C1: Dynamic Client    F1: Malicious DCR Binding      Malicious redirect_uri registration via open endpoints.         P1–P2
 Registration Flaws    F2: Blind Client Trust         client_id spoofing due to inadequate verification.              P2
 C2: Delegated         F3: Layer Inconsistency        Inconsistent PKCE enforcement across architectural layers.      PA
 Authorization         F4: Nested Context Pollution   Hijacking codes via nested redirect_uri manipulation in         PA
 Flaws                                                state.
 C3: Open Client       F5: PKCE Downgrade             Missing or weakened PKCE enforcement.                           P2–P3
 Environment Flaws     F6: Consent Page Bypass        Missing consent display enforcement.                            P2
                       F7: Open Redirect              Insufficient redirect_uri validation.                           P2
 C4: Common
                       F8: Weak State                 Missing or predictable state enables CSRF.                      P2
 OAuth Misconf.
                       F9: Code Replay                Reusable authorization code after login.                        P3


dence should appear. This phase-level structure provides the            quire confirmation of what the user actually sees in
basis for our security analysis.                                        the browser.
                                                                     To address these challenges, we propose three design
5. Real-world Evaluation                                         ideas.
    In this section, we examine how the flaw taxonomy               •   Solution idea 1: Layer-aware traffic identification.
manifests in real-world OAuth deployments. The detector                 To address Challenge 1, the framework first ex-
follows the abstracted workflow: it first reconstructs the              tracts OAuth parameters and classifies callbacks
relevant OAuth lifecycle, then applies flaw-specific checks at          into local-client and remote-server layers based on
the phases where the taxonomy indicates a security property             their redirect_uri patterns. This step deter-
should hold. We first explain the design ideas behind the               mines which OAuth flow a request belongs to before
detector, then describe the detection pipeline, report results          any flaw-specific rule is applied.
on 119 testable OAuth-enabled remote MCP servers, and               •   Solution idea 2: Lifecycle reconstruction. To address
present case studies showing how individual flaws can com-              Challenge 2, the framework links authorization re-
pose into end-to-end attacks.                                           quests, callbacks, and token exchanges using state
                                                                        values and authorization codes, reconstructing com-
5.1. Design Ideas                                                       plete OAuth lifecycles before applying flaw-specific
                                                                        checks. This makes it possible to reason about prop-
                                                                        erties that span multiple messages, such as PKCE
    Detecting MCP OAuth flaws requires more than apply-
                                                                        binding, state consistency, and code reuse.
ing independent rules to individual HTTP requests. OAuth
                                                                    •   Solution idea 3: Evidence-aware confirmation. To
traffic in MCP deployments is often mixed with local call-
                                                                        address Challenge 3, the framework separates pas-
backs, remote MCP callbacks, and upstream service au-
                                                                        sive checks, active probes, and UI-assisted valida-
thorization flows. Some flaws are only visible after recon-
                                                                        tion. This lets us use low-impact passive rules where
structing a full authorization lifecycle, while others require
                                                                        possible, while reserving controlled mutations and
controlled mutations or browser-visible confirmation. These
                                                                        manual browser inspection for flaws that require
properties lead to three practical challenges.
                                                                        stronger evidence.
   •   Challenge 1: Layer ambiguity. A single session may
                                                                     Based on these ideas, we design a four-stage detection
       contain local-client callbacks, remote MCP call-
                                                                 pipeline, shown in Figure 5. The first two stages build the
       backs, and upstream authorization flows. Without
                                                                 context needed to interpret MCP OAuth traffic, and the last
       distinguishing these layers, a detector may apply a
                                                                 two stages apply flaw-specific checks with evidence levels
       rule to the wrong OAuth flow or miss flaws that only
                                                                 matched to each flaw.
       arise in delegated authorization.
   •   Challenge 2: Lifecycle dependence. Several flaws
       cannot be determined from an isolated request. They       5.2. Detection Pipeline
       only become visible after correlating authorization
       requests, callbacks, and token exchanges into a com-          The pipeline proceeds from context construction to
       plete authorization lifecycle. Delegated flows further    vulnerability confirmation. It first identifies OAuth-related
       require this correlation across both layers.              traffic and separates authorization layers, then reconstructs
   •   Challenge 3: Confirmation boundary. Different flaws       authorization lifecycles from the observed messages. Once
       require different levels of evidence. Some can be         this context is available, the framework applies passive
       checked passively from observed traffic, while others     checks that can be decided from traffic alone and active
       require carefully bounded request mutations. UI-          probes for flaws that require controlled interaction with the
       dependent flaws, such as consent page bypass, re-         deployment.


                                                                                                                              8
             1 Traffic Identification                         2 Lifecycle Modeling                3 Passive Evaluation               4 Active Probing

                      Intercepted                    Common
                    HTTP(S) Traffic                   OAuth                                                                              Active      F1    F2
                                                                             code                                            Rules        Scan
                                                                 state                                                                               F4    F5
       MCP Client                     MCP Server                                                                     F3
                                                                                                         Passive
                                                                                          Rules
                      Analysis                                                                            Scan                                       F7    F9
                                                                                                                     F5
       redirect_uri
                                     Common                        redirect_uri
       client_id         Layer                                                                                             OAuth Model
       code_challenge Identification     or          Delegated                                                       F8
       state                                                                                                                             Verify UI
                                                      OAuth
       code
                                     Delegated
                                                                     state                                                                                F6
                                                                                       OAuth Model
         Key Variables                                                                                                        User




                                    Figure 5. Detection pipeline of our framework for detecting flaws in remote MCP OAuth deployments.


    (1) Traffic identification. The framework begins by fil-                                   avoid the plain method.
tering OAuth-related interactions from raw HTTP(S) traffic,                                 •  F8 (Weak state): Check whether state is present
isolating the authorization-relevant subset from background                                    and sufficiently unpredictable for CSRF protection.
requests. This is done by extracting the key variables shown                           Passive evaluation gives a low-impact baseline before any
in Figure 5, including redirect_uri, client_id,                                        active mutation is attempted.
code_challenge, state, and authorization code. The                                         (4) Active probing. For flaws that cannot be confirmed
framework then infers the authorization layer from the                                 through passive analysis alone, the framework executes tar-
destination of the callback endpoint. Loopback addresses                               geted active probes:
and custom URI schemes—such as 127.0.0.1 and
                                                                                           •   F1 (Malicious DCR): Submit a DCR request con-
vscode://—indicate that the callback targets the local
                                                                                               taining a malicious redirect_uri to test whether
MCP client layer (L1), whereas callbacks pointing to a
                                                                                               the server enforces proper boundary controls.
remote MCP server URL indicate a delegated upstream
                                                                                           •   F2 (Blind Client Trust): Replaces the client_id
authorization layer (L2). This layer inference separates or-
                                                                                               with a spoofed identifier (e.g., evil_client_id)
dinary single-layer OAuth flows from multi-layer delegated
                                                                                               to test whether the system accepts unregistered iden-
MCP flows, ensuring that layer-specific detection rules are
                                                                                               tities.
applied only to the appropriate authorization context.
                                                                                           •   F4 (Nested Context Pollution): Decodes and tampers
    (2) Lifecycle modeling. The framework abstracts each
                                                                                               with the nested redirect_uri within the state
standard OAuth lifecycle into three core components: the
                                                                                               parameter.
authorization request sent from the client to the authorization
                                                                                           •   F5 (PKCE Downgrade): Performs PKCE downgrade
server, the redirect callback carrying the authorization code
                                                                                               testing: changing code_challenge_method
returned by the server, and the token exchange request
                                                                                               from S256 to plain, or stripping both
that redeems the code for an access token. Correlating
                                                                                               code_challenge and method entirely.
these three messages across a single flow is essential for
                                                                                           •   F7 (Open Redirect): Mutates the redirect_uri
detecting flaws that span multiple protocol steps. The shared
                                                                                               to an attacker-controlled malicious address.
state parameter serves as the binding key that links the
                                                                                           •   F9 (Code Replay): Intercepts and replays a con-
authorization request to its corresponding callback, while
                                                                                               sumed authorization code (code) to test single-use
the authorization code value links the callback to the
                                                                                               enforcement.
subsequent token exchange. For multi-layer delegated autho-
rization, the framework additionally reconstructs the second-                              F6 requires a different treatment because it depends on
layer (upstream service layer) authorization request and                               what the browser presents to the user. For this flaw, testers
callback pair, and records the redirect_uri or routing                                 manually trigger generated test links, including truncated
context that bridges the two authorization layers. Together,                           mid-flow URLs, and inspect whether the consent page, final
these linked structures provide the complete per-flow context                          redirect_uri, and risk warnings are displayed in the
against which passive and active detection steps operate,                              expected order.
corresponding to the standard and delegated branches shown                                 The framework uses three levels of evidence. F3 and
in Figure 5.                                                                           F8 are detected passively from reconstructed lifecycles. F5
    (3) Passive evaluation. Against the reconstructed life-                            combines passive checks of observed PKCE parameters
cycle, the framework applies passive rules that do not send                            with active downgrade probes. F1, F2, F4, F7, and F9
additional traffic. These rules include:                                               require active probes followed by manual confirmation. F6
                                                                                       is UI-assisted: the framework generates test links, while
   •      F3 (Layer Inconsistency): Check whether PKCE is                              researchers confirm the browser-visible behavior. All vul-
          consistently enforced across L1 and L2.                                      nerable cases reported below were manually verified.
   •      F5 (PKCE Downgrade): Check whether authoriza-                                    Implementation Details. We use VSCode Copilot as the
          tion requests include valid PKCE parameters and                              MCP client and simultaneously leverage Burp Suite [28] to


                                                                                                                                                                9
monitor its communication traffic. Our detection framework
runs as a Burp plugin, performing vulnerability checks on                    F1                                                             114
the captured requests and responses. Our automated detec-                    F2               12
tion framework is built upon and extends OAuthScan, an
existing Burp Suite extension [29]. The OAuthScan is ca-                     F3               12
pable of identifying basic OAuth flaws (e.g., open redirects
                                                                             F4           7
and weak state parameters). However, it lacks the architec-




                                                                 Flaw Type
tural context required in MCP environments. Consequently,
                                                                             F5                                                  81
we restructured its core logic and extended its capabilities
to address the three key characteristics of MCP identi-                      F6                                        62
fied earlier. Specifically, we introduced customized lifecycle
modeling. We overhauled its traffic classification rules to                  F7                         28
support context correlation across delegated authorization                   F8       3                                                     C1 (F1, F2)
layers (L1/L2), and integrated new detection logic that also                                                                                C2 (F3, F4)
                                                                             F9           6                                                 C3 (F5, F6)
applies to common OAuth flaws.                                                                                                              C4 (F7-F9)
                                                                                  0                20        40   60        80        100   120
5.3. Detection Results                                                                                             Count
    Dataset and Performance. We use the 119 testable
                                                                             Figure 6. Overall flaw detection results on 119 MCP servers.
DCR-enabled OAuth servers from Table 3 as the evaluation
dataset and apply the detection pipeline to identify candidate
flaw instances. Each candidate alert is then manually veri-           Finding 3.1: Every server in our evaluation dataset
fied before being counted in the results below. For passive       exhibits at least one confirmed authentication flaw. All
detections, researchers re-inspected the relevant traffic to      119 servers exhibited at least one confirmed flaw across
confirm missing, inconsistent, or downgraded parameters.          the four categories, yielding 325 confirmed flaw instances
For active probes, researchers checked whether the server         in total, reflecting the pervasive presence of authentication
accepted the mutated request and whether the observed             weaknesses in real-world MCP deployments.
behavior matched the flaw definition. Consistent with our             More strikingly, 39 servers (32.8%) were flagged by
ethical constraints, we did not complete exploit chains that      three or more categories, indicating that authentication
would access, modify, or exfiltrate real user data.               weaknesses often appear in combination rather than as iso-
                                                                  lated mistakes. Figure 6 shows the per-flaw detection results.
  TABLE 6. C ONFUSION MATRIX OF THE DETECTION FRAMEWORK
                AFTER MANUAL VERIFICATION .
                                                                      Finding 3.2: MCP-specific categories dominate the
                                                                  evaluation dataset, led by Dynamic Client Registration
     Detection outcome     Vulnerable    Not vulnerable           Flaws (C1) and Open Client Environment Flaws (C3).
     Flagged by tool        325 (TP)        54 (FP)               115 of 119 servers (96.6%) exhibited at least one C1 flaw.
     Not flagged by tool     1 (FN)           N/A                 Within this category, F1 (Malicious DCR Binding) is the
                                                                  dominant flaw, confirmed in 114 servers (95.8%): their DCR
    Table 6 summarizes the tool-level detection outcome           endpoints accept any redirect_uri submitted by an
after manual verification. The framework produced 379             anonymous registrant, allowing an attacker to register a ma-
candidate alerts, of which 325 were confirmed as true             licious callback and intercept authorization codes. F2 (Blind
positives, and 54 were false positives. We also identified        Client Trust) was confirmed in 12 servers (10.1%), where the
1 false negative during manual review. This corresponds           authorization server accepted spoofed client_id values
to 85.75% precision and 99.69% recall over the manually           without verifying registration status.
verified flaw instances. We do not report true negatives              102 of 119 servers (85.7%) exhibited at least one C3
because the detector operates over flaw-specific candidate        flaw. F5 (PKCE Downgrade) was confirmed in 81 servers
opportunities rather than an exhaustively enumerated set of       (68.1%): their authorization servers either allow the omis-
all non-vulnerable request variants.                              sion of code_challenge or accept requests with the
    The false positives mainly stem from two engineering          code_challenge_method downgraded to plain, nul-
constraints. The first is deep redirect truncation, accounting    lifying PKCE protection even when nominally supported.
for 18 cases in F2 and 25 cases in F7. To preserve scanning           F6 (Consent Page Bypass) was confirmed in 72 servers
efficiency, the tool restricts HTTP redirect tracking to a        (60.5%): failing to display the redirect_uri, allowing
default maximum of five hops, which can miss validations          attackers to deceive users into approving requests that leak
performed deeper in the redirect chain. The second is back-       authorization codes to rogue localhost ports.
ground traffic noise, involving 7 cases in F3 and 4 cases             Finding 3.3: Delegated authorization is common in
in F8, where unrelated external OAuth flows were conflated        the evaluation dataset, and its multi-hop structure in-
with the target authorization flow. The single false negative     troduces cross-layer inconsistencies. 81 of 119 servers
appeared in F5 and resulted from non-standard parameter           (68.1%) implement delegated authorization (PA), and among
naming that evaded our baseline signature matching.               these, 40 (49.4%) use nested state parameters to pass


                                                                                                                                                     10
routing context across authorization layers, which is the very
mechanism exploited by F4.
     Furthermore, 18 servers (15.1%) exhibited at least one          Attacker                            Victim
                                                                                                                                          Authorization
                                                                                                                                             Server
C2 flaw: 12 confirmed instances of F3 (Layer Inconsis-                          Flaw 1
                                                                                Dynamic Client Registration
tency), where PKCE is enforced at layer 1 but omitted at                              redirect_uri
                                                                                                                                                            Failed to
                                                                                                                                                            verify the
the upstream layer 2 request, and 7 instances of F4 (Nested                 =https://evil.example.com/cb
                                                                                                       201 Created                                        legitimacy of
                                                                                                                                                           redirect_uri
Context Pollution), where the embedded redirect_uri                               Send Crafted
                                                                                Authorization Link
inside the state parameter is accepted without integrity
                                                                                                                  Authorization Request
verification or whitelist validation.
     Finding 3.4: Common OAuth Misconfigurations (C4)                                                                                                       Accept
                                                                                                                  Callback response
persist at lower but non-negligible rates. 34 of 119 servers                                                  https://evil.example.com/cb?
(28.6%) exhibited at least one C4 flaw. F7 (Open Redirect)                         Account Takeover                    code=[CODE]

was confirmed in 28 servers (23.5%). Among them, 15
accept fully substituted attacker-controlled domains, while
13 exhibit weaker forms (e.g., accepting decimal IP repre-         Figure 7. Case Study 1: Malicious client registration via open DCR.
sentations or non-existent subpaths). F9 (Code Replay) was
confirmed in 6 servers (5.0%), and F8 (Weak State) in 3
servers (2.5%).                                                  exposed a public registration_endpoint in its
     For confirmed flaws with practical security impact, we      .well-known/oauth-authorization-server
initiated responsible disclosure to affected vendors. Each re-   metadata. The attacker can issue a DCR request
port included the vulnerability principle, reproduction steps,   with an attacker-controlled redirect_uri (e.g.,
and mitigation suggestions tailored to the corresponding         https://evil.example.com/cb) and receive a
flaw type. Several vendors have acknowledged or confirmed        legitimately issued client_id. Using this ID, the
our reports, and 9 confirmed vulnerabilities have been as-       attacker constructs an authorization URL that contains the
signed CVE IDs.                                                  attacker-controlled redirect_uri and social-engineers
                                                                 the victim into clicking it. After the victim completes
   Finding 3. Authentication flaws are prevalent in the          the consent flow, the authorization server delivers the
   testable OAuth-enabled MCP servers, and flaw cat-             authorization code to the attacker’s server, allowing the
   egories tied to MCP-specific patterns, especially dy-         attacker to exchange it for an access token and take over
   namic client registration and open client environments,       the victim’s MCP session. We reported this vulnerability
   appear most frequently.                                       and obtained CVE-2026-26390.
                                                                     Case Study 2: Nested context pollution leading to
                                                                 account takeover. Delegated authorization introduces a sec-
5.4. Case Studies                                                ond authorization context between the MCP server and an
                                                                 upstream service. If the MCP server serializes downstream
     We select three representative cases to cover the three     routing context into client-visible OAuth state without in-
MCP-specific deployment characteristics and to show how          tegrity protection, an attacker can tamper with that context
individual flaws compose into end-to-end account takeover        and redirect a valid upstream authorization result to an
chains. Note that all cases discussed in this section have       attacker-controlled endpoint. Figure 8 illustrates this dele-
been responsibly disclosed to the respective vendors.            gated attack pattern.
     Case Study 1: Malicious client registration via open            Case-2: **2 (https://mcp.**.tech/mcp). This MCP server
DCR. When a server permits open DCR with arbitrary               provides tools for managing projects, branches, queries, and
callback URLs, attackers can exploit this registration phase     database migrations. In this delegated authorization archi-
as a malicious routing mechanism to hijack authoriza-            tecture, the MCP server exposed a critical nested context
tion codes. Figure 7 shows the attack flow: the attacker         pollution vulnerability (F4). The attacker first obtains a
first sends a registration request with an attacker-controlled   legitimate L2 authorization request generated by the MCP
redirect_uri, crafts a malicious authorization URL               server, decodes the state parameter, and mutates its
containing this URI, and induces the victim to interact with     nested redirect_uri field to an attacker-controlled do-
it, causing the authorization code to be delivered to the        main (e.g., https://evil.example.com/cb) before
attacker’s endpoint.                                             re-encoding it. When the victim clicks the forged link and
     Case-1: **2 (https://mcp.**.dev/mcp). This MCP              completes authorization at the upstream identity provider,
server enables AI coding tools to directly access                the callback carrying the valid authorization code is sent
and query application error monitoring data, thereby             back to the MCP server. Because the MCP server fails to
automatically analyzing root causes and assisting                enforce integrity validation on the nested state payload, it
with fixes. This server is representative of the                 blindly parses the tampered redirect_uri and executes
CVE-2026-26384 to CVE-2026-26390 series and                      a secondary redirect. This forwards the victim’s authoriza-
                                                                 tion credentials directly to the attacker’s server, resulting in
  2. Anonymized for ethical considerations.                      account takeover.


                                                                                                                                                                          11
                                                                                                          change the code without a code_verifier, obtaining the
                                                                                                          victim’s access token and achieving account takeover. We
                                                                                           Victim
                                                                                                          reported this vulnerability and obtained CVE-2025-69898.
     Attacker                                    Authorization
                                                    Server

                     Start and Intercept
                      Normal Auth Flow                                                                      Finding 4. Confirmed flaws can lead to high-impact
                                                                                                            attacks: weak client registration, unsafe delegated con-
                  Modify the state and Send the Crafted Authorization Link                                  text handling, and redirect or PKCE weaknesses can
              https://oauth.example.com/authorize?...
               redirect_uri=https://mcp.example.com&
                                                                                                            cause authorization-code or token leakage, resulting in
           state=Base64<https://evil.example.com/cb>
                                                                 Login and Consent                          sensitive information exposure and account takeover.
                      Flaw 4
                      302 Redirect : code
                https://evil.example.com/cb?
                         code=[CODE]                                                                      6. Discussion
                    Account Takeover

                                                                                                          6.1. Root Cause Analysis

Figure 8. Case Study 2: Nested context pollution leading to account                                           The flaws we observe are not merely isolated implemen-
takeover.                                                                                                 tation mistakes; they are amplified by the mismatch between
                                                                                                          a rapidly evolving specification and fast-moving real-world
                                                                                                          deployments. Within roughly one year, MCP moved from
    Case Study 3: Open redirect amplified by PKCE
                                                                                                          having no mandatory authentication requirements to adopt-
downgrade. Open-client MCP deployments rely heavily
                                                                                                          ing a more complete OAuth-based authorization framework.
on PKCE because local clients cannot safely keep long-
                                                                                                          Many deployments appear to have implemented only the
term secrets. When an authorization server both accepts an
                                                                                                          minimum flow needed for interoperability, while leaving
attacker-controlled redirect_uri and allows PKCE to
                                                                                                          security-critical checks such as PKCE enforcement, redirect
be omitted or downgraded, stealing an authorization code
                                                                                                          URI validation, and client registration controls incomplete.
becomes sufficient for token theft. Figure 9 shows this
                                                                                                          The fact that 40.55% of discovered servers still expose tools
composition.
                                                                                                          without authentication further suggests that authentication is
                                                                                                          often treated as a deployment add-on rather than a first-class
                                                                                                          security boundary.
                                                                           Authorization
                                                                                                              A second root cause lies in the intermediary role of MCP
    Attacker                                Victim
                                                                              Server                      servers. In delegated deployments, the server is not simply
         Crafted Link with removed PKCE                                                                   a protected resource; it also becomes an OAuth client to
                     redirect_uri                       Open in Browser                                   upstream services. This creates a multi-hop authorization
           =https://evil.example.com/cb                                                     Failed to
                                                                                             validate     chain in which security properties must be preserved across
                                                Flaw 7                                     PKCE and
                                                     Callback response                     redirect_uri   independently operated systems. Nested routing state and
                                                https://evil.example.com/cb?
                                                         code=[CODE]
                                                                                                          inconsistent protection between local and upstream hops are
                Flaw 5
                Token Request without code_verifier                                                       all symptoms of this design pressure. These failures are
                                                                                            Accept        therefore better understood as coordination failures across
                                                     Return Access Token                                  layers than as ordinary single-endpoint misconfigurations.
                     Account Takeover                                                                         Dynamic client registration introduces a third and par-
                                                                                                          ticularly important source of risk. Although the specifica-
                                                                                                          tion treats DCR as an optional fallback, our measurement
 Figure 9. Case Study 3: Open redirect amplified by PKCE downgrade.                                       shows that all 1,118 OAuth-enabled servers advertise a
                                                                                                          registration_endpoint, and seven of the nine CVEs
    Case-3: **2 (https://mcp.**.com/mcp). This MCP server                                                 we obtained correspond to F1. This suggests that developers
enables AI tools to perform create, read, update, and                                                     frequently default to DCR because it is convenient and
delete operations on documents and projects within the **                                                 readily available in off-the-shelf OAuth implementations,
workspace. This server concurrently exposed an open redi-                                                 but deploy it without strong redirect URI restrictions or
rect (F7) and a lack of mandatory PKCE enforcement (F5).                                                  client identity checks. In practice, DCR becomes the easiest
The attacker first crafts an authorization URL that mutates                                               path to interoperability and, at the same time, the broadest
the redirect_uri to an attacker-controlled domain (e.g.,                                                  attack surface.
https://evil.example.com/cb) and removes the
code_challenge and code_challenge_method
parameters. When the victim authorizes the request, the                                                   6.2. Mitigation Suggestions
server issues a valid authorization code and redirects it to the
attacker-controlled endpoint. Because no PKCE challenge                                                       Based on our findings, we distill concrete mitigations
was recorded during code issuance, the attacker can ex-                                                   at three levels: authorization server implementation, MCP


                                                                                                                                                                       12
server deployment, and specification hardening. The sug-          of each flaw type and may miss subtle or novel vulnerabil-
gestions below are organized by the flaw categories they          ity patterns. Future work could replace this with LLM or
most directly address.                                            agent-driven analysis for more adaptive and comprehensive
     Restrict client registration. Authorization servers should   detection.
treat DCR endpoints as semi-trusted interfaces rather than            As AI agents increasingly interact with external services
open APIs. Concretely: (1) enforce an allowlist of permitted      on behalf of users, the authentication patterns established
redirect_uri patterns (e.g., rejecting arbitrary internet-        by MCP will likely influence other agent protocols such as
routable domains); (2) require client attestation or rate-limit   A2A [30] and ANP [31]. Studying whether the same flaw
registrations per IP; and (3) migrate from DCR to the Client      classes recur in those ecosystems and developing standard-
ID Metadata Document (CIMD) mechanism introduced in               ized security testing methodologies for agent authentication
the 2025-11-25 MCP specification, which pins client iden-         layers more broadly remain important open problems.
tity to a cryptographically verifiable HTTPS-hosted JSON
document rather than an open registration call.
     Enforce PKCE server-side. PKCE enforcement
                                                                  7. Related Work
is a server-side responsibility. Authorization servers
must      reject     authorization    requests     that    omit       MCP security. Existing MCP security research has
code_challenge, and must not accept plain as                      mainly studied model-layer and tool-interface threats. Hou
a valid code_challenge_method. The server’s                       et al. [32] defined a 16-threat taxonomy across four at-
metadata document should advertise only S256 in                   tacker types, Gaire et al. [14] systematized MCP security
code_challenge_methods_supported. Given that                      and safety knowledge, and Anbiaee et al. [31] compared
67.5% of tested servers silently accept PKCE-free requests,       MCP with A2A, Agora, and ANP. Empirical studies have
this single change would neutralize the most prevalent            reported tool-layer flaws, including tool poisoning in 5.5%
single flaw in our dataset.                                       of 1,899 servers [9], server hijacking risks in a substantial
     Preserve user-visible consent. To mitigate localhost         portion of 67,057 analyzed registry entries [2], and attacks
impersonation, authorization servers must enforce strict          that exploit agents’ reliance on tool descriptions [7]. Other
UI transparency by unconditionally displaying the exact           work studies MCP toolchain attacks [33], malicious server
redirect_uri on the consent page. Furthermore, servers            taxonomies [10], clause-compliance vulnerabilities [3], de-
should treat localhost callbacks with elevated scrutiny,          fensive frameworks [12], [34], and OAuth-enhanced tool
ideally presenting visual warnings to ensure users explicitly     definitions [35]. Closest to our work, Huang et al. [22]
acknowledge the exact callback destination before granting        identified caller identity confusion in MCP deployments,
authorization.                                                    showing that servers commonly reuse cached authorization
     Isolate delegated contexts. MCP servers implementing         state across tool invocations regardless of caller identity.
delegated authorization must not embed routing parameters         Prakash [24] proposed the Agent Identity Protocol after
(e.g., downstream redirect_uri) inside the state pa-              observing widespread unauthenticated servers. These studies
rameter without integrity protection. Instead, the MCP server     motivate stronger authentication, while our work analyzes
should maintain a server-side mapping from an opaque              OAuth implementation-layer flaws in remote MCP deploy-
state parameter to the routing context, preventing client-        ments.
side tampering.                                                       Agent authorization security. Recent work on agentic
     Harden the specification defaults. The MCP specifica-        authorization highlights open problems in delegation and
tion should elevate PKCE enforcement and DCR redirect-            scope control. South et al. [23] proposed authenticated
URI restrictions from SHOULD to MUST-level require-               delegation frameworks for AI agents, extending OAuth 2.0
ments. The current MAY-level status of CIMD as the pre-           and OpenID Connect with agent-specific credentials and
ferred registration mechanism should be strengthened to           metadata to enforce scoped, auditable delegation chains. The
RECOMMENDED over DCR, with DCR explicitly clas-                   OpenID Foundation [36] identified recursive delegation and
sified as a high-risk option requiring additional safeguards.     scope attenuation as unresolved challenges, and noted the
                                                                  absence of standard mechanisms for agents acting across
                                                                  service boundaries, including DCR and asynchronous au-
6.3. Limitations and Future Work                                  thorization. These works address delegation at the proto-
                                                                  col design level. Our work instead measures how OAuth
    Our study has several limitations. First, our measurement     is concretely implemented in deployed MCP servers and
relies on FOFA and Shodan for initial discovery, which may        characterizes the implementation-layer flaws that arise from
not capture MCP servers deployed behind CDNs, firewalls,          MCP’s specific architectural characteristics.
or private networks, introducing coverage bias toward pub-            OAuth security. OAuth security has been studied from
licly indexed infrastructure; this scope was also guided by       formal, empirical, and attack perspectives. Formal analyses
ethical considerations, as we restricted our study to publicly    by Fett et al. [37], [38], [39] established security guaran-
reachable assets to minimize risk to deployed systems and         tees for OAuth 2.0 and OpenID Connect, while uncovering
operators. Second, our flaw detection framework relies on         previously unknown attacks. Hosseyni et al. [40] further
rule-based matching, which requires manual specification          discovered audience injection attacks across a broad family


                                                                                                                            13
of OAuth-derived protocols, directly relevant to MCP’s del-     as fetching metadata documents, issuing MCP initial-
egated setting. On the empirical side, OAuch [6] found that     ization requests, testing whether dynamic client regis-
97 of 100 OAuth IdPs leave at least one threat unmitigated,     tration accepted attacker-controlled redirect_uri val-
with PKCE downgrade succeeding against 43% of PKCE-             ues, checking PKCE enforcement, mutating state or
supporting providers; follow-up work confirmed persistent       redirect_uri parameters in authorization requests, and
non-compliance [41], and further studies documented OAuth       replaying authorization codes only in tester-controlled ses-
failures on web [42], [43] and mobile platforms [44], [45].     sions to check single-use enforcement. For flaws requir-
Known attack techniques include redirect URI manipula-          ing user-interface validation, such as consent-page bypass,
tion [46], [47], [48], cross-app OAuth attacks in integration   testers manually inspected the authorization flow using their
platforms [49], and redirect chain injection in SSO bro-        own accounts and browser sessions. We did not stress
kers [50].                                                      servers, persist access, perform destructive operations, in-
    Our work builds on these foundations but focuses on         voke sensitive MCP tools at scale, or use issued tokens
how these flaws interact with MCP-specific deployment           to access, modify, or exfiltrate real user data. When a full
characteristics, including open client environments, dynamic    attack chain would have required compromising an actual
client registration, and delegated authorization. These char-   third-party account or completing a real account takeover,
acteristics are structurally distinct from the prior OAuth      we stopped after confirming the vulnerable condition and
research, which amplify known OAuth weaknesses and in-          validated the end-to-end impact only in controlled environ-
troduce new attack surfaces absent in the general Web and       ments.
mobile OAuth settings studied by prior work.                         Responsible disclosure. All confirmed vulnerabilities
                                                                were reported to affected vendors through responsible dis-
                                                                closure channels, including direct email and vulnerability
8. Conclusion                                                   platforms where available. This process resulted in 9 as-
                                                                signed CVE IDs at the time of submission.
    This paper presented the first measurement study of
authentication security in remote MCP servers. We identified    References
approximately 7,973 live deployments, found that 40.55%
expose tool interfaces without authentication, and showed       [1]   Anthropic, “Building agents that reach production systems with
that OAuth-enabled deployments commonly combine open                  MCP,” Anthropic Engineering Blog, https://claude.com/blog/
client environments, dynamic client registration, and dele-           building-agents-that-reach-production-systems-with-mcp, 2026.
gated authorization. From these characteristics, we derived     [2]   X. Li and X. Gao, “Toward understanding security issues in the model
                                                                      context protocol ecosystem,” arXiv preprint arXiv:2510.16558, 2025.
a taxonomy of 9 flaws across 4 categories and built a semi-
automated detection framework to evaluate real deploy-          [3]   N. Yang, W. Bai, and K. Lu, “Compatibility at a cost: Systematic
                                                                      discovery and exploitation of mcp clause-compliance vulnerabilities,”
ments. Applying it to 119 testable OAuth-enabled servers,             arXiv preprint arXiv:2603.10163, 2026.
we found that every server exhibited at least one flaw, with
                                                                [4]   Obsidian Security, “When MCP meets OAuth: Common pitfalls lead-
dominant categories rooted in MCP-specific deployment                 ing to one-click account takeover,” Obsidian Security Blog, 2025.
patterns, and obtained 9 CVE IDs through responsible dis-
                                                                [5]   Anthropic,     “Authorization    –     model     context   protocol,”
closure. These results show that authentication weaknesses            https://modelcontextprotocol.io/specification/2025-11-25/basic/
in remote MCP are an emerging protocol-infrastructure risk            authorization, 2025.
for agentic ecosystems.                                         [6]   P. Philippaerts, D. Preuveneers, and W. Joosen, “Oauch: Exploring
                                                                      security compliance in the oauth 2.0 ecosystem,” in Proceedings of
                                                                      the 25th International Symposium on Research in Attacks, Intrusions
Ethics Considerations                                                 and Defenses, 2022, pp. 460–481.
                                                                [7]   Y. Guo, P. Liu, W. Ma, Z. Deng, X. Zhu, P. Di, X. Xiao, and
    Our study strictly followed academic research norms and           S. Wen, “Systematic analysis of mcp security,” arXiv preprint
                                                                      arXiv:2508.12538, 2025.
ethical guidelines. Because this work involved discovering
                                                                [8]   B. Radosevich and J. Halloran, “Mcp safety audit: Llms with the
and validating authentication vulnerabilities in real-world           model context protocol allow major security exploits,” arXiv preprint
remote MCP deployments, we took the following measures                arXiv:2504.03767, 2025.
to minimize risk to deployed systems, service operators, and    [9]   M. M. Hasan, H. Li, E. Fallahzadeh, G. K. Rajbahadur, B. Adams,
users.                                                                and A. E. Hassan, “Model context protocol (mcp) at first glance:
    Publicly reachable assets only. We restricted discovery           Studying the security and maintainability of mcp servers,” arXiv
to assets indexed by mainstream cybersecurity search en-              preprint arXiv:2506.13538, 2025.
gines and interacted only with endpoints that were already      [10] W. Zhao, J. Liu, B. Ruan, S. Li, and Z. Liang, “When mcp
                                                                     servers attack: Taxonomy, feasibility, and mitigation,” arXiv preprint
exposed on the public Internet. We did not attempt to                arXiv:2509.24272, 2025.
bypass access controls, scan private address spaces, or test
                                                                [11] Anthropic,      “Model        Context       Protocol,”         https://
enterprise-internal assets that were not publicly reachable.         modelcontextprotocol.io/, 2024, accessed: 2026-05-07.
    Low-impact validation with our own accounts. Our            [12] H. Errico, J. Ngiam, and S. Sojan, “Securing the model context
active verification was limited to the minimum proto-                protocol (mcp): Risks, controls, and governance,” arXiv preprint
col actions needed to confirm authentication flaws, such             arXiv:2511.20920, 2025.



                                                                                                                                        14
[13] N. Maloyan and D. Namiot, “Breaking the protocol: Security anal-         [34] V. S. Narajala and I. Habler, “Enterprise-grade security for the model
     ysis of the model context protocol specification and prompt in-               context protocol (mcp): Frameworks and mitigation strategies,” in
     jection vulnerabilities in tool-integrated llm agents,” arXiv preprint        2026 IEEE 5th International Conference on AI in Cybersecurity
     arXiv:2601.17549, 2026.                                                       (ICAIC). IEEE, 2026, pp. 1–8.
[14] S. Gaire, S. Gyawali, S. Mishra, S. Niroula, D. Thakur, and U. Yadav,    [35] M. Bhatt, V. S. Narajala, and I. Habler, “Etdi: Mitigating tool squat-
     “Systematization of knowledge: Security and safety in the model               ting and rug pull attacks in model context protocol (mcp) by using
     context protocol ecosystem,” arXiv preprint arXiv:2512.08290, 2025.           oauth-enhanced tool definitions and policy-based access control,” in
                                                                                   2025 Cyber Awareness and Research Symposium (CARS). IEEE,
[15] Anthropic, “Authorization – model context protocol,” https://                 2025, pp. 1–6.
     modelcontextprotocol.io/specification/2024-11-05, 2024.
                                                                              [36] T. South, S. Nagabhushanaradhya, A. Dissanayaka, S. Cecchetti,
[16] Anthropic,     “Authorization    –     model     context   protocol,”         G. Fletcher, V. Lu, A. Pietropaolo, D. H. Saxe, J. Lombardo, A. M.
     https://modelcontextprotocol.io/specification/2025-03-26/basic/               Shivalingaiah et al., “Identity management for agentic ai: The new
     authorization, 2025.                                                          frontier of authorization, authentication, and security for an ai agent
                                                                                   world,” arXiv preprint arXiv:2510.25819, 2025.
[17] N. Sakimura, J. Bradley, and N. Agarwal, “Proof Key for Code
     Exchange by OAuth Public Clients,” 2015. [Online]. Available:            [37] D. Fett, R. Küsters, and G. Schmitz, “A comprehensive formal
     https://www.rfc-editor.org/rfc/rfc7636                                        security analysis of oauth 2.0,” in Proceedings of the 2016 ACM
                                                                                   SIGSAC conference on computer and communications security, 2016,
[18] J. Richer, M. B. Jones, J. Bradley, M. Machulak, and P. Hunt,                 pp. 1204–1215.
     “OAuth 2.0 Dynamic Client Registration Protocol,” 2015. [Online].
     Available: https://www.rfc-editor.org/rfc/rfc7591                        [38] D. Fett, R. Küsters, and G. Schmitz, “The web sso standard openid
                                                                                   connect: In-depth formal security analysis and security guidelines,” in
[19] Anthropic,     “Authorization    –     model     context   protocol,”         2017 IEEE 30th Computer Security Foundations Symposium (CSF).
     https://modelcontextprotocol.io/specification/2025-06-18/basic/               IEEE, 2017, pp. 189–202.
     authorization, 2025.
                                                                              [39] D. Fett, P. Hosseyni, and R. Küsters, “An extensive formal se-
[20] M. B. Jones, P. Hunt, and A. Parecki, “OAuth 2.0 Protected Resource           curity analysis of the openid financial-grade api,” arXiv preprint
     Metadata,” 2025. [Online]. Available: https://www.rfc-editor.org/rfc/         arXiv:1901.11520, 2019.
     rfc9728
                                                                              [40] P. Hosseyni, R. Kuesters, and T. Würtele, “Audience injection attacks:
[21] B. Campbell, J. Bradley, and H. Tschofenig, “Resource Indicators              A new class of attacks on web-based authorization and authentication
     for OAuth 2.0,” RFC 8707, 2020. [Online]. Available: https:                   standards,” Cryptology ePrint Archive, 2025.
     //www.rfc-editor.org/rfc/rfc8707
                                                                              [41] P. Philippaerts, D. Preuveneers, and W. Joosen, “Revisiting OAuth
[22] Y. Huang, B. Ma, B. Yan, X. Dai, Y. Zhang, M. Xu, K. Xu, and                  2.0 compliance: A two-year follow-up study,” in Proceedings of the
     Y. Zhang, “Give them an inch and they will take a mile: Understand-           2023 IEEE European Symposium on Security and Privacy Workshops,
     ing and measuring caller identity confusion in mcp-based ai systems,”         2023.
     arXiv preprint arXiv:2603.07473, 2026.                                   [42] R. Yang, G. Li, W. C. Lau, K. Zhang, and P. Hu, “Model-based
[23] T. South, S. Marro, T. Hardjono, R. Mahari, C. D. Whitney, D. Green-          security testing: An empirical study on OAuth 2.0 implementations,”
     wood, A. Chan, and A. Pentland, “Authenticated delegation and                 in Proceedings of the 11th ACM Asia Conference on Computer and
     authorized ai agents,” arXiv preprint arXiv:2501.09674, 2025.                 Communications Security (AsiaCCS), 2016.

[24] S. Prakash, “Aip: Agent identity protocol for verifiable delegation      [43] Y. Zhou and D. Evans, “SSOScan: Automated testing of web appli-
     across mcp and a2a,” arXiv preprint arXiv:2603.24775, 2026.                   cations for single sign-on vulnerabilities,” in Proceedings of the 23rd
                                                                                   USENIX Security Symposium, 2014.
[25] FOFA, “FOFA Search Engine,” https://en.fofa.info/, 2026, accessed:
                                                                              [44] H. Wang, Y. Zhang, J. Li, H. Liu, W. Yang, B. Li, and D. Gu,
     2026-05-07.
                                                                                   “Vulnerability assessment of OAuth implementations in Android
[26] Shodan, “Shodan Search Engine,” https://www.shodan.io/, 2026, ac-             applications,” in Proceedings of the 31st Annual Computer Security
     cessed: 2026-05-07.                                                           Applications Conference (ACSAC), 2015.
[27] C. Bennett, A. Abdou, and P. C. van Oorschot, “Empirical scanning        [45] H. Wang, Y. Zhang, J. Li, and D. Gu, “The Achilles’ heel of OAuth:
     analysis of censys and shodan,” in Workshop on Measurements,                  A multi-platform study of OAuth-based authentication,” in Proceed-
     Attacks, and Defenses for the Web, 2021.                                      ings of the 32nd Annual Computer Security Applications Conference
                                                                                   (ACSAC), 2016.
[28] PortSwigger, “Burp Suite,” https://portswigger.net/burp, 2026, ac-
     cessed: 2026-05-07.                                                      [46] X. Wang, W. C. Lau, R. Yang, and S. Shi, “Make redirection evil
                                                                                   again: Url parser issues in oauth,” BlackHat Asia, vol. 2019, 2019.
[29] Maurizio Siddu, “PortSwigger oauth-scan,” https://github.com/
     PortSwigger/oauth-scan, 2024, accessed: 2026-05-07.                      [47] T. Innocenti, M. Golinelli, K. Onarlioglu, A. Mirheidari, B. Crispo,
                                                                                   and E. Kirda, “Oauth 2.0 redirect uri validation falls short, literally,”
[30] Google, “Agent2Agent (A2A) Protocol,” https://a2a-protocol.org,               in Proceedings of the 39th Annual Computer Security Applications
     2025.                                                                         Conference, 2023, pp. 256–267.
[31] Z. Anbiaee, M. Rabbani, M. Mirani, G. Piya, I. Opushnyev, A. Ghor-       [48] S. Khodayari, K. Glauber, and G. Pellegrino, “Do (not) follow the
     bani, and S. Dadkhah, “Security threat modeling for emerging ai-              white rabbit: Challenging the myth of harmless open redirection,”
     agent protocols: A comparative analysis of mcp, a2a, agora, and anp,”         2025.
     arXiv preprint arXiv:2602.11327, 2026.                                   [49] K. Luo, X. Wang, P. H. A. Fung, W. C. Lau, and J. Lecomte,
[32] X. Hou, Y. Zhao, S. Wang, and H. Wang, “Model context protocol                “Universal cross-app attacks: Exploiting and securing {OAuth} 2.0 in
     (mcp): Landscape, security threats, and future research directions.”          integration platforms,” in 34th USENIX Security Symposium (USENIX
     ACM New York, NY, 2025.                                                       Security 25), 2025, pp. 3221–3238.

[33] S. Zhao, Q. Hou, Z. Zhan, Y. Wang, Y. Xie, Y. Guo, L. Chen,              [50] T. Innocenti, L. Jannett, C. Mainka, V. Mladenov, and E. Kirda, ““only
     S. Li, and Z. Xue, “Mind your server: A systematic study of                   as strong as the weakest link”: On the security of brokered single sign-
     parasitic toolchain attacks on the mcp ecosystem,” arXiv preprint             on on the web,” in 2025 IEEE Symposium on Security and Privacy
     arXiv:2509.06572, 2025.                                                       (SP). IEEE, 2025, pp. 1009–1027.




                                                                                                                                                        15
