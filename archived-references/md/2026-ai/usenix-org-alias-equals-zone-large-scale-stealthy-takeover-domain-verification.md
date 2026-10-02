---
type: Article
title: Alias Equals Zone? Large-Scale and Stealthy Takeover of Domain Hosting Service via CNAME-Following Cross-Domain Verification
description: "Domain hosting providers misread CNAME semantics during ownership verification: a challenge token found after following a CNAME is accepted as proof of control over the aliasing domain, which itself configures no token. The resulting takeover, ALIASLEAP, affects four email and seven web hosting providers and over two million domains, 200K in the Tranco Top 1M. It is stealthy: the chains are legitimate."
resource: "https://www.usenix.org/conference/usenixsecurity26/presentation/li-ruixuan"
tags: [article, webseclist-reference, en, usenix-org, dns, domain-takeover, auth-bypass, email, large-scale-scan, measurement-study, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T13:04:04+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity26/presentation/li-ruixuan"
    title: Alias Equals Zone? Large-Scale and Stealthy Takeover of Domain Hosting Service via CNAME-Following Cross-Domain Verification
    author: Ruixuan Li, Xingyu Zhao, Yunyi Zhang, Baojun Liu, Jun Shao
also_at:
  - "https://www.usenix.org/system/files/usenixsecurity26-li-ruixuan.pdf"
authors:
  - Ruixuan Li
  - Xingyu Zhao
  - Yunyi Zhang
  - Baojun Liu
  - Jun Shao
canonical_url: ""
cited_by:
  - "2026-ai.md:40"
commit: ""
content_sha256: c76df0b8d6749673e6fcce4c5d3942ba531b022dc110f4e4d86b51c1bdb16de8
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity26/presentation/li-ruixuan"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 2fb2356da800cd492dd68daa57546d01f1a02c7ee70bc94b0437cad6b4591aab
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity26-li-ruixuan.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T13:04:04+00:00"
slug: usenix-org-alias-equals-zone-large-scale-stealthy-takeover-domain-verification
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Alias Equals Zone? Large-Scale and Stealthy Takeover of Domain Hosting Service via CNAME-Following Cross-Domain Verification

**Alias Equals Zone? Large-Scale and Stealthy Takeover of Domain Hosting Service via CNAME-Following Cross-Domain Verification** - Ruixuan Li, Xingyu Zhao, Yunyi Zhang, Baojun Liu, Jun Shao, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity26/presentation/li-ruixuan>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity26-li-ruixuan.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity26-li-ruixuan.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Alias Equals Zone? Large-Scale and Stealthy
        Takeover of Domain Hosting Service via
      CNAME-Following Cross-Domain Verification
   Ruixuan Li, Tsinghua University; Xingyu Zhao, Zhejiang Gongshang University;
 Yunyi Zhang and Baojun Liu, Tsinghua University; Jun Shao, Zhejiang Gongshang
University and Zhejiang Key Laboratory of Big Data and Future E-Commerce Technology
        https://www.usenix.org/conference/usenixsecurity26/presentation/li-ruixuan




          This paper is included in the Proceedings of the
                 35th USENIX Security Symposium.
                     August 12–14, 2026 • Baltimore, MD, USA
                                 ISBN 978-1-939133-58-8


                          Open access to the Proceedings of the
                            35th USENIX Security Symposium
                                    is sponsored by
Alias Equals Zone? Large-Scale and Stealthy Takeover of Domain Hosting Service
               via CNAME-Following Cross-Domain Verification

                   Ruixuan Li1          Xingyu Zhao2           Yunyi Zhang1           Baojun Liu1          Jun Shao2,3

                                 1 Tsinghua University, 2 Zhejiang Gongshang University,
                   3 Zhejiang Key Laboratory of Big Data and Future E-Commerce Technology




                           Abstract                                                                                         challenge token
                                                                                        ➀                    ➁                  n.com MX
CNAME records define alias relationships between domains
                                                                                host n.com               query DNS              mx.host
and are widely used for service hosting and load balancing.
                                                                         User                 Hosting                  Normal
We find that popular domain hosting providers misinterpret                                    provider                 domain
CNAME semantics during domain ownership verification.                                                          ➂
They accept DNS records after CNAME redirection as valid                                         return correct token (mx.host)
challenge tokens for alias domains, even though these do-
mains do not configure any tokens. Based on this flaw, we             Figure 1: Theoretical domain ownership verification process.
propose A LIAS L EAP, a novel domain takeover      attack that en-
                                                challenge token
ables hijacking hosting services of alias domains in CNAME                           www.v.com MX mx.host ❌
                                             n.com MX mx.host                        www.v.com CNAME n.com
chains. A LIAS L EAP poses a serious threat in the real world:
we identify four email and seven web hosting providers that                                                                  challenge token
                                                      ➀                                    ❶                  follow            n.com MX
are vulnerable, affecting over two million domains, includ-
                                                 query DNS
ing 200K in the Tranco Top 1M domain list. A LIAS L EAP is                           query  DNS         🔥   CNAME               mx.host
                                      Hosting                 Normal     Vulnerable                Victim             Normal
highly stealthy because vulnerable CNAME
                                      provider chains are typ-domain       provider                domain             domain
ically legitimate and long-lived: about half persist  ➁ for more
than 12 months, and up to 19,819 domainsreturn correct
                                                  havetoken
                                                        been(mx.host)
                                                               ex-                ❷ return correct token (mx.host)
posed for over 10 years. We propose mitigation strategies
                                        (a) Normal DOV Logic                        (b) Vulnerable DOV Logic
and responsibly disclose A LIAS L EAP to 11 affected hosting             Figure 2: Flawed domain ownership verification logic.
providers, receiving confirmations from eight of them. We
call on the Internet community to revisit the usage practices
and capability boundaries of CNAME records.                           Misunderstanding of CNAME. In domain hosting scenarios,
                                                                      we observe that many providers’ domain ownership verifica-
1 Introduction                                                        tion (DOV) misinterprets CNAME, granting the domain alias
                                                                      mechanism privileges equivalent to domain control.
Domain name system (DNS) is a cornerstone of the Internet                Figure 1 illustrates the theoretical DOV process in an email
infrastructure, underpinning the operation of many higher-            hosting  scenario. Providers require users to configure specific
layer applications. Among the various DNS resource records,           DNS    records    (i.e., challenge tokens) for a domain (n.com).
canonical name (CNAME) plays a critical role in delega-               Then,   the  provider     queries the MX records of n.com and
tion and indirection [33]. When a domain (the alias) has a            activates  the   email    hosting    service upon obtaining the cor-
CNAME record, DNS resolution is redirected to the corre-              rect token   (mx.host).       However,      when CNAME records are
sponding canonical name, and the DNS resolver continues               introduced     into  this   process,    the  DOV logic becomes seri-
by retrieving the canonical name’s records. With its conve-           ously  flawed.    Specifically,    if  an  alias domain can resolve to
nient name-mapping functionality, CNAME is widely used                valid challenge     tokens    belonging     to the canonical name via a
for service migration, load balancing, and integration with           CNAME      record,   the  provider    considers   the domain as verified.
third-party services. According to our measurements, at least         Crucially,  no   challenge     tokens    are  actually configured in the
21,660 second-level domains (SLDs) and 8,268,312 subdo-               alias domain’s     zone.
mains in the Tranco top 1M domain list [43] have CNAME                New threat model. This paper introduces a novel domain
records configured.                                                   hosting service takeover attack, termed A LIAS L EAP, which



USENIX Association                                                                              35th USENIX Security Symposium            751
exploits flawed DOV logic that follows CNAME records to           vice takeover attack, A LIAS L EAP, which exploits providers’
perform cross-domain verification, as shown in Figure 2. We       CNAME-following cross-domain ownership verification.
assume that a normal domain (n.com) is configured with valid      • Large-scale risk assessment. We implement a non-intrusive
challenge tokens and can be properly hosted at the provider.      detection system for A LIAS L EAP, identifying 11 providers
Victim domains (www.v.com) are alias domains that point           and more than two million domains affected by the attack.
to n.com through a CNAME chain. When an attacker hosts            • Mitigation and disclosure. We propose effective mitiga-
the victim domain, the provider follows the CNAME chain           tion strategies and responsibly disclose A LIAS L EAP to 11
to perform DOV. Upon detecting the expected DNS records           providers, receiving confirmations from eight of them.
(mx.host) at the end of the resolution process, the provider
activates hosting services for www.v.com. After that, attackers
can launch a variety of attacks, including deploying phishing     2     Background and Preliminaries
websites, sending spoofed emails, and obtaining valid TLS
certificates for victim domains, etc.                             In this section, we first introduce the function of canonical
   Using controlled domains, we conduct end-to-end exper-         name (CNAME) records and their application scenarios. We
iments across popular hosting providers to demonstrate the        then measure CNAME records to understand the real-world
feasibility of A LIAS L EAP. Then, we leverage passive DNS        CNAME configuration. Finally, we describe common domain
data to collect potentially affected domains at scale. Finally,   ownership verification (DOV) mechanisms.
we non-intrusively detect vulnerable domains by exploiting
providers’ distinctive error responses for unhosted domains.      2.1     CNAME Record
Practical risk assessment. A LIAS L EAP poses a signifi-
cant threat in the wild. We find that four email hosting          The CNAME record establishes an alias relationship between
providers and seven web hosting providers are vulnerable to       two domains [33]. As illustrated in Figure 3, a CNAME record
A LIAS L EAP (e.g., Namecheap, GitHub). The subdomain and         maps one domain (e.g., alias.foo.com), referred to as the
SLD can be victims of A LIAS L EAP. Furthermore, we identify      alias, to another domain (e.g., canonical.foo.net), known
over two million domains affected by A LIAS L EAP, the vast       as the canonical name. When a DNS resolver encounters a
majority of which are subdomains. Within the Tranco Top           CNAME record, it replaces the queried name with the canon-
1M domain list, the email services of 132,057 subdomains          ical name and continues resolution until it reaches a DNS
and the web services of 31,055 subdomains are vulnerable,         record type that directly maps to an IP address or service
including those under cloudflare.net and whecloud.com.            endpoint (e.g., MX records).
Furthermore, 5,067 government domains and 87,560 educa-              Importantly, CNAME records establish equivalence be-
tional domains are affected, including institutions such as the   tween two domains only at the DNS resolution layer and
State of New Hampshire and the University of Toronto.             do not confer control over the domain zone. The management
   The CNAME chains of vulnerable domains are usually con-        of a specific namespace
                                                                          foo.com  zone      is reflected in the domain zone and
figured for legitimate services, making A LIAS L EAP highly       its corresponding authoritative name servers. Furthermore,Management
                                                                         foo.com NS ns1.foo.com
stealthy. The most common vulnerable CNAME chains occur           DNS standards prohibit the coexistence of a CNAME record namespace
between domains within the same SLD, for example, when a          with other  record types at the
                                                                         alias.foo.com            samecanonical.foo.net
                                                                                              CNAME     time [33]. This restriction
                                                                  renders CNAME      records generally defined    as unsuitable    Domain alias
www subdomain points to its SLD. Additionally, service man-                (alias domain)                (canonical   domain) for(resolution le
agement, company brand change, and corporate acquisitions         second-level domains (SLDs), which typically require multi-
are important sources of vulnerable CNAME chains. The             ple essential DNS records (e.g., NS records).
DNS configurations exploited by A LIAS L EAP are generally
stable, providing attackers with ample time to conduct attacks.              Authoritative server (management zone)
We find that over 99% of vulnerable CNAME chains persist                foo.com zone
for more than one month, about half last over 12 months,                foo.com     NS ns1.foo.com
and as many as 19,819 domains have been exposed to the
A LIAS L EAP threat for more than ten years.                            alias.foo.com CNAME canonical.foo.net
                                                                          (alias domain)            (canonical domain)
Mitigation and disclosure. Domain hosting providers can
mitigate A LIAS L EAP by adopting DOV mechanisms that                             Domain alias (resolution level)
rely on randomized challenge tokens or by prohibiting cross-
domain verification that follows CNAME records. We have               Figure 3: Definition and function of the CNAME record.
responsibly disclosed A LIAS L EAP to 11 affected providers,
obtaining confirmations from eight. We received a total bonus       CNAME records are widely used to support various op-
of $1,100, and 10 CNVD/CNNVD vulnerability numbers.               erational scenarios. A common use case is domain service
Contributions. The contributions of this paper are as follows:    hosting, where a domain delegates the implementation and
• New threat model. We introduce a new domain hosting ser-        management of Internet services to third-party providers. This



752   35th USENIX Security Symposium                                                                      USENIX Association
delegation enables service providers to manage backend in-       ferent SLDs via CNAME records. The most common canon-
frastructure transparently while allowing domain owners to       ical SLDs include cloudfront.net, amazonaws.com, and
retain control over their domains. For instance, GitHub re-      edgekey.net, which are typically used for website and CDN
quires domains to configure CNAME records pointing to its        hosting services. In the case of subdomains pointing to SLDs
subdomains (e.g., user.github.io) [26], where user de-           via CNAME records, we observe that common SLDs are pri-
notes the account name. However, such CNAME-based host-          marily providers offering blogging or posting platforms, using
ing introduces the risk of dangling DNS records [46], which      separate subdomains to host user-generated content, such as
arise when users fail to update their DNS configurations after   write2me.nl, ameblo.jp, and blog.bg.
releasing services. For example, an attacker can register the
user account on GitHub and thereby take over the web page        Table 1: CNAME relationship patterns for popular domain
of user.github.io.                                               names and their subdomains.

                                                                   CNAME relationship pattern          Number of domains
2.2   CNAME Chains in the Wild                                     ALL SLD CNAME*                                     21,660
We conduct a large-scale measurement of domain CNAME               SLD-to-SLD                                   707 (3.26%)
chains to investigate the prevalence and configuration pat-
                                                                     SLD-to-SLD (loop)†                        182 (25.74%)
terns of CNAME records in the wild. First, we downloaded
                                                                   SLD-to-SUB                               21,062 (97.23%)
the Tranco Top 1M domain list on December 1, 2025 [43].
                                                                     SLD-to-SUB (same)                        1,073 (5.09%)
Using passive DNS (PDNS) data from 114DNS [16], we then
collected subdomains under the SLDs of these popular do-           ALL SUB CNAME                                   8,268,312
mains. To limit excessive data from highly popular domains,        SUB-to-SUB                            7,675,317 (92.82%)
we restrict the collection to at most 10,000 subdomains per          SUB-to-SUB (same)                   2,645,584 (34.46%)
SLD. Next, we queried the CNAME chains for the popular               SUB-to-SUB (loop)                          473 (0.01%)
domains and their subdomains through PDNS data. The query          SUB-to-SLD                               601,453 (7.27%)
window spans from January 1, 2024, to December 1, 2025,              SUB-to-SLD (same)                     535,867 (89.09%)
and the maximum CNAME chain depth is set to three. To
mitigate the impact of transient misconfigurations, we filter       * SUB is short for subdomain. ALL SLD/SUB CNAME de-
out CNAME records observed fewer than 100 times or with a            notes the number of SLDs/subdomains that configure CNAME
lifetime shorter than one day.                                       records. SLD-to-SLD indicates that an SLD points to an SLD
   We find that CNAME records are extensively used in prac-          via CNAME records, and others follow the same convention.
                                                                    † loop means that alias and canonical domain are identical;
tice. While most CNAME records are used for subdomain
aliasing, a non-negligible number of SLDs are also config-           same means that belong to the same SLD.
ured with CNAME records. Specifically, 21,660 SLDs and
8,268,312 subdomains are configured with CNAME records,
spanning a total of 638,962 SLDs (63.90%). Alias relation-       2.3    Domain Ownership Verification
ships most frequently occur under the subdomain labels www
(49.76%), mail (12.98%), and smtp (6.37%). The www subdo-        DOV is a mechanism used to verify a user’s control over a
main is typically used for web services, while the latter two    domain, ensuring that domain services are provisioned only
are commonly associated with email services.                     to authenticated entities. In cloud hosting scenarios, providers
   We further analyze the lengths of CNAME chains and            typically require customers to configure specific DNS records
find that the majority have length one. Among the 21,660         (i.e., challenge tokens) to complete DOV. Figure 1 illustrates
SLDs with CNAME records, 14,088 have chains of length one,       a typical DOV workflow. When a user claims a domain for
and 1,971 have chains of length three. Among the 8,268,312       hosting, the provider issues DNS queries to verify whether
subdomains with CNAME records, 5,592,054 have chains of          the required challenge tokens have been correctly configured.
length one, and 398,615 have chains of length three.             Below, we introduce common DNS challenge tokens.
   Finally, we analyze CNAME relationship patterns among            • MX token. Email hosting providers typically require
popular SLDs and their subdomains. As shown in Ta-               the domain to configure MX records that point to their
ble 1, CNAME mappings between subdomains are the                 mail servers. The MX records specified by providers are
most prevalent. Among the 21,660 SLDs with CNAME                 usually fixed domains. For example, Namecheap Private
records, 21,062 (97.23%) have subdomains as their canon-         Mail requires domains to set mx1.privateemail.com and
ical names. Similarly, among the 8,268,312 subdomains            mx1.privateemail.com.
with CNAME records, 7,675,317 (92.82%) point to subdo-              • TXT token. TXT records primarily serve two purposes.
mains as their canonical names. Furthermore, we find that        First, they are used to publish sender authentication-related
most subdomains (65.54%) point to subdomains under dif-          records required by email hosting services, most commonly



USENIX Association                                                                   35th USENIX Security Symposium         753
the Sender Policy Framework (SPF). SPF records define                            Vulnerable         Victim            Normal
                                                                 Attacker         provider          domain            domain
which servers are authorized to send emails on behalf of
a domain. By configuring an SPF record, a domain autho-
                                                                                                         🔥
rizes the email hosting provider to send emails on its behalf.                                    www.v.com              n.com
The SPF records specified by providers typically follow fixed            ❶ host
                                                                         www.v.com        ❷ query
templates. For example, Namecheap Private Mail requires
                                                                                          www.v.com
domains to set v=spf1 include: spf.privateemail.com ∼all.
   Second, TXT records can serve as random challenge tokens:                                             ❸
                                                                                         www.v.com CNAME n.com
providers require users to configure a TXT record containing
a randomly generated string to verify domain ownership. For
example, Zoho Mail requires domains to configure a random                               ❹ follow CNAME query to n.com
TXT record such as zoho-verification=<random string> [47].
                                                                                                                            ❺
In addition, email hosting providers can also use DomainKeys                                              challenge token
Identified Mail (DKIM) records as challenge tokens. DKIM                                      n.com A h.o.s.t (web)
is a mechanism that uses digital signatures to ensure the in-           ❻ DOV pass            n.com MX mx.host (email)
tegrity of email content. DKIM records are published as TXT
records under domains containing specific prefixes, known as                                     DOV process
selectors, such as selector1._domainkey.foo.com. There-
fore, providers can also use DKIM records containing unique              Figure 4: Process of the A LIAS L EAP attack.
public keys and selectors as random challenge tokens.
   • CNAME token. CNAME records are commonly used
for web service hosting. Providers typically require domains     3     Threat Model
to configure a CNAME record that points to a subdomain
under the provider’s controlled domain. The subdomain label      This paper presents a novel domain hosting service takeover
is randomly generated (e.g., Azure Websites [18]) or derived     attack, termed A LIAS L EAP, which exploits flawed DOV
from user-specific information such as account names (e.g.,      mechanisms that follow CNAME records to perform cross-
GitHub Pages [26]) and project names (e.g., Netlify Apps [8]).   domain verification. This section first introduces the attack
   • A token. A records are also commonly used for web           workflow and the potential impact of A LIAS L EAP. Then, we
service hosting. Providers require domains to configure A        compare A LIAS L EAP with prior attacks.
records that point to their web servers. These A records may
belong to a fixed set or be allocated from an IP pool. For
                                                                 3.1    A LIAS L EAP Attack
example, to host a website on GitHub, a domain can con-
figure its A records to 185.199.108.153, 185.199.109.153,        A LIAS L EAP targets the takeover of domain hosting services,
185.199.110.153, and 185.199.111.153. In addition, although      such as email and website. The vulnerability arises because,
some providers require domains to configure CNAME-based          during DOV, hosting providers follow CNAME records to per-
challenge tokens, during the DOV process, they validate the A    form DNS queries and treat the final DNS records obtained
records obtained after CNAME resolution (e.g., GitHub) [46].     as challenge tokens for the domain being verified. As shown
   Overall, randomized DNS challenge tokens mainly take          in Figure 2, if the canonical domain has configured valid chal-
three forms: random TXT records, randomly assigned               lenge tokens, the provider erroneously assumes that the alias
CNAME domain labels, and sufficiently large pools of A           domain has also configured the correct tokens. In reality, the
records. They can mitigate domain hosting takeover attacks       alias domain has never configured these tokens within its own
based on dangling DNS records [46], since attackers cannot       domain zone. Overall, providers conflate alias equivalence at
configure DNS records for victim domains.                        the DNS resolution layer with administrative control over the
   Currently, the IETF has provided some guidance regarding      namespace, extending the capabilities of CNAME records.
DOV challenge tokens. For example, RFC 8555 [36] specifies          Figure 4 illustrates the detailed attack process of
the method for generating DOV tokens during the certificate      A LIAS L EAP for both email and web hosting scenarios. First,
issuance process, with a particular requirement for using ran-   the attacker registers the victim domain (www.v.com) with
dom characters. Additionally, the DNSOP working group in         the hosting provider (❶). The provider then performs DOV
an IETF draft lists recommendations for the use of DNS chal-     by querying the DNS records of www.v.com (❷). Because
lenge tokens [38], including the types of challenge tokens,      www.v.com is configured with a CNAME record pointing to
the use of random tokens, etc. In particular, this document      n.com (❸), the hosting provider ultimately retrieves DNS
describes CNAME considerations in DOV (e.g., dangling            records of n.com (❹). Since n.com is configured with valid
CNAME); however, it does not cover the threat scenario pre-      challenge tokens (❺), the provider incorrectly concludes that
sented in this paper.                                            www.v.com has passed DOV and activates hosting services



754   35th USENIX Security Symposium                                                                      USENIX Association
for the victim domain (❻).                                         do not enforce its configuration. In practice, emails passing
   In summary, hosting providers vulnerable to A LIAS L EAP        only SPF are still accepted by major email providers [27, 45].
must satisfy three requirements. First, the provider adopts
flawed DOV mechanisms, including non-random challenge              3.2    Harm of A LIAS L EAP Attack
tokens and cross-domain validation that follows CNAME
records. Second, the provider offers management interfaces         The web is the most widely used Internet application, and
for domain hosting services. For email services, these inter-      email is not only a critical medium for online communication
faces mainly include mail routing and mailbox management.          but also plays a central role in security authentication. The
For web services, they mainly include website deployment           takeover of these domain services can therefore result in se-
and certificate application. Third, the provider supports multi-   vere real-world consequences. In the following, we present
tenant shared hosting services. This allows Internet users to      five specific threat scenarios.
access the hijacked services of the victim domain through the         • Launching phishing attacks. After taking over the email
infrastructure of the normal canonical domain.                     service, an attacker can impersonate the victim domain to send
   From the attacker’s perspective, the cost of launching          phishing emails. Through hijacking web services, the attacker
A LIAS L EAP is minimal. An attacker only needs to collect         can leverage the victim domain’s reputation to deploy phish-
CNAME chains through active DNS scanning or by analyzing           ing websites. These attacks enable many malicious objectives,
PDNS data, and then register the victim domain with the host-      such as lateral movement and extortion.
ing provider. Throughout this process, the attacker does not          • Obtaining valid certificates. According to the
need to control any DNS records or deploy any servers. After       CA/Browser Forum baseline requirements [23], certificate
hijacking the email service, the attacker can send and receive     authorities (CA) allow applicants to receive validation links
emails via provider-managed mailboxes and mail routing. Af-        through specific email accounts, such as “admin” or “postmas-
ter hijacking the web service, the attacker can host malicious     ter” to complete DOV and obtain certificates1 . In addition,
websites on the provider’s servers.                                after successfully taking over a web service, providers typi-
   The victim domain of A LIAS L EAP can be either a subdo-        cally automatically request TLS certificates for the customer’s
main or an SLD. A domain becomes a victim of A LIAS L EAP          domain. Once a valid certificate is obtained, the attacker can
only when two conditions are satisfied. First, the victim do-      conduct man-in-the-middle (MITM) attacks to intercept se-
main points, via a CNAME record, to a domain that is con-          cure connections or carry out phishing attacks.
figured with valid challenge tokens, which can normally be            • Thefting privacy. The attacker can receive all emails
hosted by the provider. Notably, A LIAS L EAP can affect all       and web requests destined for the victim domain, potentially
alias domains along a CNAME chain. Second, the victim do-          leading to large-scale leakage of user information and the
main must not already be registered with the hosting provider.     covert exfiltration of sensitive business data.
Furthermore, to take over an SLD’s email service, the attacker        • Hijacking account. The attacker can abuse “forgot pass-
needs to inject the SLD’s CNAME record into the cache of the       word” mechanisms to reset accounts on online services asso-
DNS resolver used by the provider; only under this condition       ciated with the taken-over email domain, including payment
will the provider obtain challenge tokens (e.g., MX records)       platforms, social media services, and cloud providers.
by following CNAME records.                                           • Poisoning domain reputation. Prior work by Li et
   After the attacker takes over the domain hosting service,       al. [30] demonstrates that popular domain blocklists, such
Internet users’ access to the victim domain is redirected to       as Spamhaus [40], classify domains as malicious based on
the hosting provider via the CNAME record. The provider            their email sending behavior. Consequently, an attacker can
then delivers the hijacked service based on domain-specific        degrade the reputation of a victim domain by sending spam,
fields in user requests. For web services, the Host header and     thereby disrupting its legitimate network services. Moreover,
SNI field in HTTP requests identify the accessed domain. In        Li et al. [30] show that many widely used domain blacklists
particular, the web hosting provider automatically configures      operate at the SLD level. As a result, even if an attacker gains
valid certificates for the victim domain. For email services,      control over only a subdomain, the reputation of the corre-
the RcptTo field in SMTP requests specifies the target domain      sponding SLD can be affected. In particular, some domain reg-
service. More importantly, emails sent using the victim do-        istries directly suspend an SLD based on blocklists [30,37,44],
main can pass SPF validation. Specifically, the email sending      potentially causing the victim domain to be unusable.
servers of the victim domain (www.v.com) and the canonical
domain (n.com) both belong to the hosting provider’s multi-        3.3    Comparison with Previous Attacks
tenant shared infrastructure. Email sending servers are in-
cluded in the SPF record of n.com. During SPF validation for       Prior studies have proposed exploiting CNAME records to
(www.v.com), receivers follow the CNAME to eventually re-          achieve domain hosting service takeover. In Table 2, we com-
solve to the SPF record of n.com, resulting in the SPF pass for       1 Under the  updated CA/Browser requirements effective March 31,
emails from (www.v.com). For DKIM, vulnerable providers            2026 [23], the email-based DOV method will be gradually deprecated.




USENIX Association                                                                      35th USENIX Security Symposium           755
                   Table 2: Comparison of previous CNAME-based domain hosting service takeover attacks.

                                                 Attack condition
    CNAME-based domain takeover                                       Attack scenario                 Attack cost     Impact scope
                                            Non-dangling* Non-random†
    [CCS ’16] Liu et al. [32]                      %                %                  Web               High           Low (10k)
    [USENIX ’21] Squarcina et al. [41]             %                %                  Web               High           Low (1k)
    [Sigmetrics ’23] Zhang et al. [46]             %                %                  Web               High           Low (10k)
    A LIAS L EAP                                   "                %              Email&Web              Low          High (2M)
    * " means that the attack does not rely on dangling DNS resources; % means that it depends on dangling DNS resources.
    † % indicates that the attack relies on the DOV mechanism not to use randomized verification tokens.


pare A LIAS L EAP with these existing attacks [32, 41, 46]. Be-         implementation process of our detection system.
low, we provide a detailed discussion from four perspectives.
   • Attack conditions. Previous CNAME-based domain
takeover attacks rely on dangling DNS records, such as
                                                                        4.1    Key Insights
expired domains or deprovisioned cloud instances. In con-               The detection of A LIAS L EAP risks should enable large-scale
trast, A LIAS L EAP exploits providers’ incorrect trust in DNS          measurement while adhering to ethical requirements [12, 29].
records obtained by following CNAME chains during DOV                   This necessitates minimizing manual intervention and ensur-
and does not rely on any dangling resources. Similar to prior           ing that all probing activities are non-intrusive. In the follow-
attacks, A LIAS L EAP requires that the DOV mechanism not               ing, we introduce two key tasks.
employ randomized challenge tokens.                                        • Identifying vulnerable providers. A prerequisite for
   • Attack scenarios. Prior studies typically examine                  A LIAS L EAP is that DOV does not rely on randomized chal-
CNAME-based hosting service takeovers only in web-related               lenge tokens. Based on a preliminary investigation of several
scenarios, such as websites, CDNs, and object storage ser-              hosting providers, we observe that randomized tokens are typi-
vices. This focus stems from the fact that web providers often          cally issued via TXT records [18,47]. Therefore, by analyzing
require customer domains to configure CNAME records dur-                the prevalence of randomized TXT records among domains
ing DOV. In this paper, we demonstrate A LIAS L EAP in both             hosted by a given provider, we can identify providers that
email and web scenarios, showing that the core attack idea is           are unlikely to use random challenge tokens. This approach
broadly applicable to hosting services across diverse types.            substantially reduces the need for manual testing of providers.
   • Attack cost. Previous attacks depend on dangling re-                  • Probing domain hosting status. A LIAS L EAP only af-
sources, requiring attackers to monitor domain states and               fects domains that are not registered with providers. We need
passively wait for victim domains to expose dangling DNS                to determine the hosting status of domains not under our
records. This dependence limits attackers’ control over the             control. This necessitates careful consideration of research
timing and cost of the attack. In contrast, the CNAME chains            ethics, particularly when probing email services. We propose
exploited by A LIAS L EAP are typically configured for legit-           a non-intrusive detectability method based on providers’ er-
imate services and are therefore more stable than dangling              ror responses. For email services, providers return distinct
DNS records. Once a vulnerable CNAME chain is identified,               non-delivery reports (NDRs) when receiving SMTP RcptTo
an attacker can directly take over the hosting service of the           command addressed to non-existent users under hosted versus
victim domain, resulting in significantly lower attack cost.            non-hosted domains. Accordingly, we generate non-existent
   • Impact scope. Prior works report that the number of                email addresses under the target domain and attempt deliv-
domains exposed to dangling CNAME risks is on the order of              ery to elicit these NDRs. No real mailboxes received email
tens of thousands, largely because user misconfigurations that          content throughout the above process. For web services, we
result in dangling records are relatively uncommon in practice.         determine domain hosting status based on HTTP responses,
In contrast, our measurement results show that A LIAS L EAP             following methodologies in prior work [46].
can affect over two million domains. This disparity highlights
that protocol-level misunderstandings pose a substantially
broader security risk than isolated user misconfigurations.             4.2    Detection Workflow
                                                                        Figure 5 illustrates the workflow of HostingEye, the
4     Detecting A LIAS L EAP Risks                                      A LIAS L EAP risk detection system, which comprises three
                                                                        main modules. First, we identify email and web hosting
In this section, we first introduce the key ideas behind detect-        providers that are vulnerable to the attack. Next, we collect
ing A LIAS L EAP risks. We then present the architecture and            domains that point to these vulnerable providers at scale. Fi-



756    35th USENIX Security Symposium                                                                             USENIX Association
    Step I: Identify Vulnerable Hosting Providers              Step II: Collect Domains            Step III: Detect Vulnerable Domains
                DNS query                                        ❺              PDNS              Test email          MailFrom: test@controlled
                                                  Vulnerable                                                          RcptTo: non-existent@domain
                     ❶                      ❸                   Input           dataset               ❼
                                         Template
                                                  providers
   Top domain list       TXT record                                        MX and                                     ❽
                                         filtering                      ❺ CNAME search            554 relay deny                550 user unknown
                                                                                                                 RcptTo !" Quit
    DNS                                                                                             unhosted                         hosted
    query   ❶                            Manual                Historical
                                         confirmation          domains                             Test web
                Clustering                  ❹                                                                           HTTP GET to domain
                                                                        ❻ Active DNS query            ❼
  MX&CNAME ❷                 Candidate                                        Candidate                                   ❽
                                                                                                      404 not found                    200 OK
    record                   providers                                        domains                  unhosted                        hosted




                                      Figure 5: Workflow of the A LIAS L EAP risk detection system.


nally, we conduct large-scale detection to identify domains             these templates reveals that many domains configure random-
that can be taken over by attackers. Below, we describe the             ized TXT records for non-email and non-web services 5(e.g.,
workflow of the detection system in detail.                             dropbox-domain-verification=123abc), which could interfere
Collect and filter hosting providers. First, we compile an              with our analysis. More templates for unrelated TXT records
initial list of popular email and web hosting providers. Using          can be found in Appendix A. After excluding unrelated TXT
active DNS scanning, we collect the MX records and www                  templates, we compute the proportion of domains hosted by
subdomain CNAME records of domains in the Tranco Top                    each provider that configure randomized TXT templates. Con-
1M domain list (❶) [43], and count the number of domains                sidering the cost of subsequent manual validation, we retain
hosted under the SLDs of these MX and CNAME records                     50 email and 66 web candidate providers for which fewer
(❷). We treat SLDs as candidate hosting providers. Our re-              than 20% of hosted domains use randomized TXT templates.
sult shows that over 99% of providers host fewer than 200               Confirm vulnerable hosting providers. We perform manual
domains, exhibiting a pronounced long-tail distribution. We             end-to-end testing on candidate providers to confirm their
retain only those hosting more than 200 domains, resulting in           vulnerability (❹). Our test process is as follows2 .
124 MX SLDs and 165 CNAME SLDs as candidate providers                      1) We first host a controlled domain on the candidate
for subsequent analysis. We believe that this set sufficiently          provider and configure it with valid challenge tokens. This
covers the vast majority of popular providers.                          domain acts as a canonical domain for normal hosting.
   Next, we query the TXT records of SLDs and www sub-                     2) We then set up two controlled victim domains: a sub-
domains in the Tranco Top 1M domain list and further filter             domain and an SLD, each pointing to the normally hosted
providers by analyzing the fraction of hosted domains that              domain via CNAME records. For the victim SLD, we addi-
configure randomized TXT challenge tokens at each provider              tionally inject its CNAME record into open DNS resolvers, as
(❸). Randomized TXT tokens typically appear in two forms:               detailed in Section 5.2. Additionally, we configure CNAME
(1) a fixed prefix followed by a sequence of random charac-             chains of length three for the victim domains, ultimately
ters, often separated by “=” or “:”, and (2) a standalone string        pointing to the normally hosted domains, to evaluate whether
of random characters. Because each provider generally adopts            CNAME chain length affects A LIAS L EAP.
a fixed template for generating challenge tokens, this allows              3) Next, we register the victim domains with the candi-
us to infer the presence of randomized tokens for providers.            date providers. If the provider’s website interface indicates
                                                                        successful registration, we further test the availability of the
   Specifically, we use Shannon entropy to identify TXT                 takeover services.
records that contain random strings. If the entropy of a string
                                                                           • For email services, we use Gmail accounts to verify that
is greater than 0.35 and the string length exceeds 5 char-
                                                                        sending and receiving emails for the victim domains function
acters, we consider it to be randomly generated. We adopt
                                                                        correctly. We consider the victim’s email service to have
a relatively strict threshold to avoid filtering out too many
                                                                        been taken over only if the email passes SPF verification and
hosting providers. To handle the first token form, entropy
                                                                        reaches the inbox rather than the spam folder.
is computed only over the substring following the delimiter
                                                                           • For web services, we deploy a web page for the victim
(“=” and “:”). Next, we derive TXT templates by analyzing
                                                                        domain and use a browser to access the victim domain. We
the length of the random string, character distribution, and
                                                                        consider the victim’s web service to have been taken over
encoding scheme. For example, BSI+digits(14) denotes a 14-
digit numeric string with the prefix “BSI”, while “random(40)”             2 In Appendix B, we use one email provider and one web provider as

denotes a 40-character random string. Manual inspection of              examples to present the detailed testing process, along with key screenshots.




USENIX Association                                                                              35th USENIX Security Symposium                  757
only if the webpage content is displayed correctly and the             domains have already been confirmed to resolve to the chal-
certificate validation succeeds.                                       lenge tokens required by their respective providers; therefore,
   Among the 116 candidate providers, we find that 39 do               any candidate domain that is not currently hosted is vulnera-
not offer public hosting services, and 52 restrict account reg-        ble. We infer takeover potential by leveraging differences in
istration due to regional limitations or other factors. Of the         provider responses based on domain hosting status.
remaining 25 providers where account registration is suc-                 As shown in Table 8 and Table 9 in the appendix, all vul-
cessful, we confirm that four email providers and seven web            nerable providers return distinct responses when handling
providers are vulnerable to the A LIAS L EAP attack. There are         requests for hosted versus unhosted domains. For example,
two reasons why other 14 hosting providers are not affected            when the email address in the SMTP RcptTo command
by A LIAS L EAP. Five providers do not follow the CNAME                belongs to a non-existent mailbox under a hosted domain,
to obtain the challenge token in their DOV process. Nine               Namecheap responds with: <non-exist@hosted.domain>:
providers use DKIM records containing random characters                Recipient address rejected. In contrast, when the email ad-
as the challenge token. Since obtaining DKIM records re-               dress belongs to an unhosted domain, the response is: <non-
quires querying TXT records with a specific prefix, our TXT            exist@unhosted.domain>: Relay access denied. For web
template filtering method cannot cover DKIM records.                   providers, when an HTTP request targets a hosted domain,
Collecting candidate domains. The Internet domain names-               the provider returns a 200 OK status code. In contrast, un-
pace is vast; for example, the Tranco Top 1M domains collec-           hosted domains return a 404/409/403 status code. Addition-
tively contain tens of millions of subdomains [46]. Actively           ally, providers may include custom error pages that reveal
enumerating domains hosted by vulnerable providers is inef-            domain hosting status; for example, GitHub returns the web
ficient and offers limited coverage of subdomains. Therefore,          page title “Site not found · GitHub Pages.”
we leverage PDNS data to collect candidate victim domains                 Finally, we sequentially send the EHLO, MailFrom, RcptTo,
for large-scale detection (❺). Our PDNS data is continuously           and QUIT SMTP commands to each candidate email domain.
gathered from multiple global DNS resolvers operated by                The sender address is under a domain we control, while the
114DNS [16], one of the largest DNS providers in China.                recipient address is a randomly generated 20-character user-
                                                                       name from all letters and digits under the candidate domain
  Candidate victim domains                  Normal        Vulnerable   (❼). In general, users are unlikely to use such meaningless
                                            domain         providers
      CNAME          CNAME          CNAME         configure            and complicated usernames. As such, all email probes involve
                                                                       incomplete SMTP connections targeting non-existent mail-
   🔥              🔥              🔥                  tokens
                                                                       boxes, with only a single test required per domain. For candi-
                                                                       date web domains, we sequentially send HTTP GET requests
  Figure 6: Collection scope of candidate victim domains.              (❼). By analyzing SMTP error messages and HTTP responses
                                                                       (❽), we identify over two million domains that are not hosted
   The scope of domains we collect is shown in Figure 6.               on providers and thus are vulnerable to A LIAS L EAP.
We first extract 7.8 million domains from PDNS that point
to vulnerable email providers via MX records, as well as
25.2 million domains that point to vulnerable web providers            5     Evaluating A LIAS L EAP Risks
via CNAME or A records3 . The PDNS dataset spans the
period from 2020 to 2025. These domains correspond to the              This section first examines the usage strategy of DNS re-
normal domains in the Figure 6. Next, we collect 11.8 million          solvers for CNAME records. After that, we conduct a com-
domains from PDNS that point to normal email domains                   prehensive analysis of hosting providers and domains that
via CNAME records, and 23.9 million domains that point to              are vulnerable to A LIAS L EAP. Finally, we investigate the
normal web domains via CNAME records. We limit the length              duration of the domain’s exposure to the A LIAS L EAP threat.
of CNAME chains pointing to normal domains to at most
three. These domains constitute the set of candidate victim            5.1    CNAME Usage Across DNS Resolvers
domains. Since we focus on domains that remain at risk,
we perform active DNS queries between November 02 and                  The DOV mechanism needs to use DNS resolvers to query
November 05, 2025 to ensure that DNS record configurations             DNS records. Therefore, how DNS resolvers follow CNAME
for both normal domains and candidate victim domains satisfy           chains to query DNS records is crucial to the A LIAS L EAP at-
the conditions in Figure 6 (❻). In total, we collect 2.1 million       tack. Using domains under our control, we configure CNAME
candidate victim email domains and 0.7 million candidate               records for a subdomain and an SLD, which ultimately re-
victim web domains.                                                    solve to A, MX, and TXT records. We then query 14 popular
                                                                       DNS resolvers, along with a self-built resolver (using Bind
Identifying vulnerable domains. Below, we measure the
                                                                       software), for the DNS records of the alias domains. Finally,
takeover risk of the candidate victim domains. All candidate
                                                                       we analyze whether these resolvers successfully return the
   3 Table 8 and Table 9 in the appendix list specific DNS records.    final DNS records.



758    35th USENIX Security Symposium                                                                           USENIX Association
                             Table 3: The usage strategy of popular DNS resolvers for CNAME records.

                                                Subdomain CNAME*              SLD CNAME (no cache)† SLD CNAME (cache)†
     DNS resolver
                                                 A    MX     TXT               A     MX      TXT     A    MX    TXT
     Google, 8.8.8.8                             "
                                                   §       "            "         "           %            %           "          "          "
     Cloudflare, 1.1.1.1                         "         "            "         "           %            %           "          %          %
     Quad9, 9.9.9.9                              "         "            "         "           %            %           "          "          "
     OpenDNS, 208.67.220.120                     "         "            "         "           %            %           "          "          "
     Level3, 4.2.2.1                             "         "            "         "           %            %           "          "          "
     Yandex, 77.88.8.1                           "         "            "         "           %            %           "          %          %
     ControlD, 76.76.2.0                         "         "            "         "           %            %           "          "          "
     AdGuard, 94.140.14.14                       "         "            "         "           %            %           "          %          %
     Dyn, 216.146.35.35                          "         "            "         "           %            %           "          "          "
     DNSPod, 119.28.28.28                        "         "            "         "           %            %           "          %          %
     Clean Browsing, 185.228.168.10              "         "            "         "           %            %           "          "          "
     Ali, 223.5.5.5                              "         "            "         "           %            %           "          %          %
     OneDNS, 117.50.10.10                        "         "            "         "           %            %           "          %          "
     Comodo Secure, 8.20.247.10                  "         "            "         "           %            %           "          "          "
     Our server (Bind version 9.18.30)           "         "            "         "           %            %           "          "          "

      * Subdomain points to another domain via CNAME records.
      † SLD points to another domain via CNAME, under two DNS resolver conditions: with/without cached SLD’s CNAME records.
      § " means that the DNS resolver can obtain the final DNS record via the CNAME record; % means that it cannot.


   As shown in Table 3, when querying subdomains, all re-                   taking over a subdomain’s hosting service or an SLD’s web
solvers follow CNAME records to retrieve the final records.                 service is straightforward and only requires registering with
However, resolver behavior differs when encountering SLD’s                  the provider, whereas taking over an SLD’s email service
CNAME records. Specifically, if a resolver does not have                    requires additional CNAME cache injection.
the SLD’s CNAME record cached, it follows the CNAME
chain only for A record queries; for MX and TXT queries,
the resolver returns DNS responses with no answers.
                                                                            5.2       Vulnerable Hosting Providers
   We further examine DNS resolution behavior when re-                      Email hosting providers. As shown in Table 4, we identify
solvers have cached the SLD’s CNAME record. Considering                     four email hosting providers vulnerable to the A LIAS L EAP
that large DNS resolvers operate multiple backend IP ad-                    attack, such as Alibaba Cloud [1], Namecheap [7], and Im-
dresses, we send 50 queries for A and CNAME records to                      provMX [5]. Namecheap does not permit customers to reg-
each resolver to populate their caches. The results indicate                ister any subdomains, and Anon 4 restricts registration of
that resolver behavior changes significantly under this condi-              www subdomains (e.g., www.example.com). Furthermore, the
tion. Specifically, 10 resolvers (e.g., 8.8.8.8) leverage cached            length of the vulnerable CNAME chain does not affect the
CNAME records to return results for MX and TXT queries,                     success of email service takeovers.
whereas five resolvers (e.g., 1.1.1.1) still fail to return the final          Compared with subdomains, attacks on the email services
MX or TXT records. OneDNS (117.50.10.10) uses cached                        of SLDs are more complex. We first investigate the DNS
CNAME records only to resolve MX records.                                   resolvers used by the four email hosting providers during
   Additionally, we evaluate how open DNS resolvers in the                  DOV. Specifically, we deploy a controlled authoritative name
wild handle CNAME records. We first collect 300K open                       server and host an experimental domain on it. We then register
DNS resolver IP addresses that were continuously active be-                 this domain with each provider and monitor the IP addresses
tween October and December 2025. Measurements are then                      that query our authoritative name server. Additionally, we
performed using the same methodology as for popular DNS                     correlate these IPs with the published backend IP ranges of
resolvers. The results indicate that for subdomain CNAME                    Google DNS (8.8.8.8) [14] and Cloudflare DNS (1.1.1.1) [13]
records, nearly all open DNS resolvers follow the CNAME                     to determine resolver ownership.
chain to resolve queries. Furthermore, 70.35% of open DNS                      We find that Namecheap and ImprovMX rely on Google
resolvers leverage cached CNAME records of SLDs to obtain                   DNS to perform DNS queries during DOV. For Anon and
the final MX and TXT records.                                                  4 After consultation with an email provider, we omitted its specific name.

   Overall, when a provider relies on open resolvers for DOV,               In addition, we anonymized victim domains.




USENIX Association                                                                                  35th USENIX Security Symposium                 759
                       Table 4: Email hosting providers and domains vulnerable to the A LIAS L EAP attack.

                                                        WWW                   Candidate             Vulnerable            Top Vulnerable§
 Email provider (Product)                   SUB*                 SLD
                                                         SUB                 SUB      SLD          SUB      SLD            SUB     SLD
 Anon (Enterprise Mail)¶                       "
                                                   †        %        "    1,836,010    2,256    1,525,962       1956      131,877    8
 Alibaba Cloud (Enterprise Email)              "            "        "     175,256      332      94,170          72         156      4
 Namecheap (Private Email)                     %            %        "         /        655         /           492           /      5
 ImprovMX (Email Forwarding)                   "            "        "      45,206       13      29,172          12          24      0
 Total                                         3            2        4    2,056,472    3,256    1,649,304       2,532     132,057    17
  ¶ According to the provider’s requirements, we anonymize the specific name.
  * SUB is short for subdomain. WWW SUB denotes domains whose third-level label is www (e.g., www.example.com).
  † " indicates that the domain can be taken over at the provider, whereas % indicates that it cannot.
  § Top Vulnerable refers to victim domains that appear in the Tranco Top 1M domain list.


                        Table 5: Web hosting providers and domains vulnerable to the A LIAS L EAP attack.
                                                       WWW                 Candidate            Vulnerable        Top Vulnerable
         Web provider (Product)          SUB                    SLD
                                                        SUB               SUB     SLD          SUB     SLD         SUB     SLD
         GitHub (Page)                     "            "        "       230,603    644     158,712      259      16,746       4
         Netlify (Website)                 "            "        "       186,258   3,038    148,397     1,153     12,339       6
         Render (Website)                  "            "        "       179,391    610     139,646      194        52         2
         Framer (Website)                  "            "        "        18,754     11     17,109       11         170        3
         Nuvemshop (Website)               "            "        "        12,709     9       6,288        6        1,736       0
         Vercel (Website)                  "            "        "         986       28       579         6         12         0
         Hostinger (Website)               "            %        "         149       12        56         5          0         0
         Total                             7            6        7       628,850   4,352    470,787     1,631     31,055       15


Alibaba Cloud, DNS queries originate from clusters of IP ad-               queries to the target resolvers from geographically distributed
dresses. The IP addresses used by Anon belong to AS45090                   vantage points. Throughout the process, we strictly control the
(Shenzhen Tencent Computer Systems Company Limited),                       query rate, limiting it to 20 DNS packets per second. Finally,
while those used by Alibaba Cloud belong to AS37963                        we attempt to register the experimental SLD with the email
(Hangzhou Alibaba Advertising Co., Ltd.) [28]. Based on                    providers to determine whether the attack succeeds.
the AS names, we infer that these IP addresses correspond to                   The results show that we successfully registered the ex-
two public DNS providers5 . However, because neither two                    perimental SLD with all four email hosting providers, where
DNS providers publicly discloses the backend IP ranges of                   the SLD was pointed via CNAME records to domains config-
their DNS resolvers, we cannot precisely identify the specific              ured with valid challenge tokens. Notably, the attacks against
resolvers used by Anon and Alibaba Cloud.                                   Namecheap and ImprovMX succeeded within about 10 min-
   We then evaluate whether CNAME cache injection against                   utes after initiating the CNAME cache injection, whereas the
SLDs is feasible on the DNS resolvers used by the four email                attacks against Anon and Alibaba Cloud required about 2
providers. The primary challenge is that we cannot directly                 hours. We conjecture that this discrepancy arises because rel-
send DNS queries to the backend IP addresses of these re-                   atively few DNS forwarders use the DNS resolvers employed
solvers, and large public DNS resolvers typically select back-              by Anon and Alibaba Cloud as their upstream backends.
end servers based on the client’s geographic location. To
overcome this limitation, we send one A-record query and                   Web hosting providers. As shown in Table 5, we iden-
one CNAME-record query for the experimental SLD to 300K                    tify seven web hosting providers that are vulnerable to the
open DNS resolvers that were continuously active between                   A LIAS L EAP attack: GitHub [3], Render [10], Nuvemshop [9],
October and December 2025. Since many open resolvers op-                   Netlify [8], Framer [2], Vercel [11], and Hostinger [4]. The
erate as forwarders, they relay queries to upstream large DNS              impact of A LIAS L EAP affects their website hosting services.
resolvers. This strategy effectively enables us to issue DNS               Among them, Hostinger does not allow customers to regis-
                                                                           ter www subdomains. In addition, these seven providers use
  5 DNSPod Public DNS (119.28.28.28), Ali DNS (223.5.5.5, 223.6.6.6).      a fixed set of A records as challenge tokens, either through



760   35th USENIX Security Symposium                                                                                    USENIX Association
direct A records (e.g., Hostinger) or A records obtained after       Moreover, we analyze the client usage scale of vulnerable
CNAME resolution (e.g., GitHub). Similar to email providers,      domains based on their DNS query traffic. Using the PDNS
the length of the vulnerable CNAME chain does not affect          dataset from 114DNS [16], we count the daily number of A
the success of the web service takeover.                          record queries for all vulnerable domains between January
                                                                  1 and December 1, 2025, as shown in Figure 7. Our results
                                                                  indicate that vulnerable domains are actively used in the real
5.3     Vulnerable Domains                                        world, and their takeover could therefore have substantial prac-
Table 4 and Table 5 summarize the number of domains af-           tical consequences. Specifically, the daily number of A record
fected by the A LIAS L EAP attack. For email hosting ser-         queries for vulnerable email domains remains around two
vices, among the 2,056,472 subdomains and 3,256 SLDs we           million, while for vulnerable web domains it is approximately
tested, 1,649,304 subdomains and 2,532 SLDs are vulnerable        40K. It is important to note that these statistics represent a
A LIAS L EAP. For web hosting services, among the 628,850         conservative lower bound on the actual DNS query traffic
subdomains and 4,352 SLDs tested, 470,787 subdomains and          associated with vulnerable domains.
1,631 SLDs could be taken over. All vulnerable domains
cover a total of 181,827 SLDs. Furthermore, we find that the                                                        Web domains              Email domains




                                                                                                                                                                               Queries for email domains
                                                                                                                                                                        2.5M




                                                                  Queries for web domains
                                                                                            40.0K
CNAME chain length between 99.42% of vulnerable domains                                                                                                                 2.0M
and the normal domains hosted on providers is one.                                          30.0K
                                                                                                                                                                        1.5M
                                                                                            20.0K
                                                                                                                                                                        1.0M
5.3.1   Vulnerable Domain Distribution                                                      10.0K                                                                       500.0K

Domain popularity. Our results indicate that A LIAS L EAP                                      0
                                                                                                         1     1     2     1     1     1     0     0     9     8     8
                                                                                                                                                                        0
                                                                                                                                                                           7
                                                                                                    0 1-0 -01-3 -03-0 -04-0 -05-0 -05-3 -06-3 -07-3 -08-2 -09-2 -10-2 -11-2
impacts a substantial number of high-profile domains. We an-                                    5 -       5     5     5     5     5     5     5     5     5     5    25
                                                                                             202 202 202 202 202 202 202 202 202 202 202 20
alyze the popularity of vulnerable domains using domain                                                                             Date
ranking lists [43]. For email domains, within the Tranco
Top 1M domain list, we identify 132,057 affected subdo-
mains spanning 284 SLDs. Within the Tranco Top 10K,               Figure 7: Daily number of A record queries for vulnerable
we find 11,108 affected subdomains, including domains             email and web domains.
under cloudflare.net (rank 79), whecloud.com (rank
383), dnspod.net (rank 483), tencent.com (rank 708),              Industry category. We analyze the industry categories of vul-
eu.com (rank 1,304), us.com (rank 1,772), utoronto.ca             nerable domains using VirusTotal [15]. Since VirusTotal pro-
(rank 2,408), dnsv4.com (rank 2,813), org.ru (rank 2,876),        vides limited category coverage for less popular domains, our
dnspod.com (rank 3,456), and eu.org (rank 3,830), etc.            analysis focuses on the 1,595 SLDs corresponding to popular
   In addition, we find that the email services of 17 popular     vulnerable domains. As shown in Table 6, the majority of vul-
SLDs can be taken over by attackers. The highest-ranked           nerable domains are concentrated in the Business/Economy
among these is the medical organization domain d**n.com           and Information Technology sectors, which together account
(rank 40,391), which points via a CNAME record to an-             for approximately half of all domains.
other domain (d**y.cn) owned by the same organization and            Furthermore, domains belonging to government agencies
hosted on Anon. Moreover, for these popular SLDs, a large         and educational institutions are particularly valuable due
number of clients frequently query their A records. Conse-        to their high perceived authority. We identify vulnerable
quently, we find that large DNS resolvers typically cache these   domains in these categories (e.g., gov.cn for government,
popular SLDs’ CNAME records, and attackers can directly           edu.cn for educational institutions) by matching them against
register them without performing CNAME cache injection.           publicly available domain suffix lists [35]. Our analysis re-
   For web domains, within the Tranco Top 1M domain               veals that 5,067 government domains and 87,560 educational
list, we identify 31,055 affected subdomains spanning 753         domains are affected by the A LIAS L EAP attack. Notable ex-
SLDs. Within the Tranco Top 10K, we find 308 affected sub-        amples include subdomains under the State of New Hamp-
domains, including domains under cloudflare.net (rank             shire (nh.gov), the Guangzhou Municipal People’s Govern-
79), it.com (rank 1,272), dnsv1.com (rank 1,654), us.com          ment of China (thnet.gov.cn), the University of Toronto
(rank 1,772), eu.org (rank 3,830), cnr.it (rank 4,142),           (utoronto.ca), and Louisiana State University (lsu.edu).
qiniudns.com (rank 4,950), and pp.ua (rank 5,237), etc. In        TLD distribution. We investigate the distribution of top-level
addition, we identify 15 popular SLDs that are vulnerable         domains (TLDs) among vulnerable domains. Table 6 lists the
to A LIAS L EAP. The highest-ranked among these is the tech-      five most common TLDs associated with 181,827 SLDs of all
nology company domain t**a.dev (rank 528,182), which              affected domains. We find that three generic TLDs (com, org,
points via a CNAME record to another domain (t**a.at)             net) together account for over half of SLDs. Additionally,
owned by the same company.                                        many vulnerable domains are distributed across country-code



USENIX Association                                                                                                  35th USENIX Security Symposium                         761
                                                                   point via CNAME records to d**d.net. This setup enables
Table 6: Industry category and TLD distribution of the SLDs
                                                                   the provider to manage numerous client domains simply by
of vulnerable domains.
                                                                   modifying the DNS records of d**d.net. However, because
         Popular SLD (1,595)            All SLD (181,827)          the email service of d**d.net is hosted on Anon, 29,082
   Business/Economy             24%     com            42%         subdomains are vulnerable to A LIAS L EAP.
   Information Technology       21%     org             9%           The second scenario arises from the company brand change,
   Education                     7%     co.uk           7%         which creates CNAME redirections to connect the old and
   Shopping                      6%     ch              5%         new service domains. For example, the large online data
   Travel                        5%     net             3%         management platform migrated its service domains from
                                                                   k**e.com to k**d.com during the company’s development.
                                                                   As a result, 12,744 subdomains under k**e.com point via
TLDs, including co.uk and ch.                                      CNAME records to k**d.com. Because the email service
Subdomain label distribution. We examine the label dis-            of k**d.com is hosted by Anon, these subdomains under
tribution of vulnerable subdomains. The most frequent sub-         k**e.com are vulnerable to A LIAS L EAP.
domain labels and their corresponding number of domains               The third scenario is corporate acquisition, in which the
are: www (25,078), ftp (8,912), mail (7,420), webmail (4,532),     acquired company’s domain is pointed to the new domain
api (3,794), blog (2,502), and cpanel (2,367). These labels        via a CNAME record. For example, after the well-known
correspond to critical Internet services, including websites,      Chinese code collaboration platform g**e.com (similar to
file transfer, email, and service APIs. Takeover of these sub-     GitHub) was acquired by a company in 2016, many of its
domains would therefore pose significant security risks.           subdomains were redirected via CNAME records to the new
                                                                   code hosting platform (c**g.net), making 4,575 subdomains
5.3.2    Vulnerable CNAME Relationship Patterns                    under g**e.com susceptible to takeover by attackers.
In the following, we analyze the CNAME relationship patterns
of vulnerable domains and attempt to understand the reasons
behind their CNAME configurations.
   We find that 81% of vulnerable subdomains use CNAME             5.3.3   Escalated Damage by Email Authentication
records pointing to their own SLDs. Such relationships are
typically configured by domain administrators to satisfy           Email plays a critical role in identity verification and account
system design requirements or operational needs. From an           recovery processes. Below, we analyze the real-world im-
external perspective, the original motivations behind these        pact that attackers can achieve by abusing the authentication
CNAME configurations are difficult to accurately infer. The        function of the victim domain’s email service.
most common case is the www subdomain pointing to its
SLD, which aligns with user conventions and standard web              Attackers can exploit email-based ownership verification
management practices. However, when the SLD hosts email            to obtain TLS certificates for vulnerable domains [23]. By
services at a third-party provider, this setup enables attackers   examining CA documentation and search results from Google,
to take over the email service of the www subdomain. Beyond        we identify seven CAs that support email-based verification:
www, many ftp, mail, api, blog, and cpanel subdomains also         DigiCert [21], Sectigo [39], SSL.com [42], DNSimple [22],
point to their SLDs, making them susceptible to A LIAS L EAP.      AWS [17], GeoCerts [25], and ComodoSSLStore [20]. After
   For the remaining 19% of CNAME relationships, we find           obtaining valid certificates, attackers can conduct malicious
that vulnerable domains often employ CNAME records point-          activities such as phishing and MITM attacks.
ing to other domains within the same organization. For in-            Next, we investigate email addresses associated with vul-
stance, a code hosting platform, coding.cloud.t**t.com,            nerable domains. By intercepting emails sent to these ad-
points via a CNAME record to c**g.net. Because the email           dresses, attackers could potentially take over Internet services
service of c**g.net is hosted on Anon, this configuration en-      linked to them via “password reset” mechanisms. Given the
ables attackers to take over coding.cloud.t**t.com. More-          ethical concerns of probing valid accounts by sending large
over, we examine the ten SLDs associated with the largest          volumes of emails to mail servers, we instead rely on leaked
numbers of vulnerable subdomains for case analysis. Below,         email address datasets to identify affected accounts. Using
we present three common scenarios.                                 three large-scale breach datasets (Adobe, Anti Public, and
   In the first scenario, companies offer services across multi-   Collection #1) [6, 30], we identify a total of 1,292 email ad-
ple SLDs and use CNAME records for centralized manage-             dresses associated with vulnerable domains. This relatively
ment and scheduling. For example, the large DNS service            small number is primarily attributable to the limited coverage
provider offers domain resolution and hosting on subdomains        of passive breach datasets and the fact that many vulnerable
under SLDs such as d**4.net and n**4.cn, all of which              domains may have never deployed email services.



762     35th USENIX Security Symposium                                                                      USENIX Association
5.4         A LIAS L EAP Risk Duration                            CNAME redirection during DOV. Based on the prerequisites
                                                                  for the attack, we propose two mitigation measures. First,
Below, we analyze the duration for which domains are ex-
                                                                  hosting providers can adopt DOV mechanisms that employ
posed to the A LIAS L EAP attack, defined as the period during
                                                                  randomized challenge tokens, such as randomly generated
which vulnerable domains maintain CNAME chains pointing
                                                                  TXT records. This approach ensures that an attacker would
to hosting providers. Throughout this interval, attackers can
                                                                  need to configure a unique DNS record for the domain on
launch A LIAS L EAP to take over domain services. Our analy-
                                                                  the CNAME chain of the victim domain, which is infeasible
sis is based on PDNS data from 114DNS [16], spanning 2015
                                                                  unless the attacker actually owns the domain. Second, hosting
to 2025. We emphasize that this exposure duration represents
                                                                  providers can prohibit cross-domain verification that follows
only a lower bound on the actual risk period.
                                                                  CNAME records. A domain should be considered verified
   As shown in Figure 8, vulnerable domains remain exposed
                                                                  only when the requested DNS record is returned from the
to A LIAS L EAP for extended periods, highlighting both the
                                                                  zone of the domain being registered.
stealthiness and the severity of the threat. Specifically, more
                                                                     We responsibly disclosed A LIAS L EAP to 11 affected host-
than 99% of vulnerable domains maintain CNAME chains
                                                                  ing providers, offering detailed explanations of the attack
with lifetimes exceeding one month. Furthermore, 64% of
                                                                  principles, reproduction videos, and recommended mitigation
email domains and 45% of web domains remain at risk for
                                                                  measures. To date, eight providers have confirmed the vulner-
over 12 months. Notably, 19,819 domains have exposure du-
                                                                  ability. Among them, Anon, Alibaba Cloud, and Namecheap
rations exceeding 10 years. For instance, a subdomain of the
                                                                  have disabled cross-domain validation following CNAME
University of Toronto (o**c.utoronto.ca) has pointed to
                                                                  records to address the issue. Anon classified A LIAS L EAP
i**c.ocadu.ca via a CNAME record since 2016.
                                                                  as the highest-severity vulnerability among its high-risk cat-
   While the above findings may appear striking, they are
                                                                  egory and awarded a bounty of $800. Alibaba Cloud rated
also intuitive. Under the A LIAS L EAP threat model, victim
                                                                  A LIAS L EAP as a medium-risk vulnerability and rewarded
domains typically configure CNAME records for legitimate
                                                                  us with a $200 bonus. For the remaining providers that
business or system design purposes, causing A LIAS L EAP
                                                                  have not yet remedied the vulnerability, GitHub and Netlify
risks remain latent in the DNS ecosystem for many years. In
                                                                  assessed A LIAS L EAP as having limited real-world impact,
contrast, domain hosting service takeovers caused by dangling
                                                                  while Hostinger attributed the risk to insecure DNS record
DNS records due to user misconfiguration tend to have much
                                                                  configurations by domain owners. We continue to engage
shorter exposure windows. For example, Zhang et al. [46]
                                                                  with these providers to address the vulnerability. In addition,
in 2022 report that about half of the domains with dangling
                                                                  we obtained 10 CNVD/CNNVD vulnerability numbers.
records remain vulnerable for no longer than 30 days.
                                                                     The systemic risks introduced by the implicit trust in
      1.0                                                         CNAME semantics have not been adequately recognized by
                                                                  the security community, and they extend well beyond iso-
      0.8                                                         lated incidents caused by individual misconfigurations, such
      0.6                                                         as dangling DNS records. Given that CNAME records are
CDF




                                                                  deeply embedded in Internet architecture, we advocate for a
      0.4
                                                                  re-examination and standardization of their use by the security
      0.2                                      Web domains        community. In particular, attention should be paid to whether
                                               Email domains      implementations of DNS resolvers and applications respect
      0.0
            0    20     40    60     80      100    120    140    the intended capability boundaries of CNAME records.
                Vulnerable CNAME chain lifetime (months)

                                                                  6.2    Limitation
Figure 8: Distribution of risk duration of vulnerable domains.
                                                                  The limitations of this work primarily concern the assess-
                                                                  ment of A LIAS L EAP risks. First, we perform end-to-end
6      Discussion                                                 manual testing only for popular providers, and exclude many
                                                                  providers where account registration is unavailable.
In this section, we first present mitigation strategies for          Second, we rely on the PDNS dataset from 114DNS, a
A LIAS L EAP along with the results of our vulnerability dis-     major DNS provider in China, which limits coverage of the
closure. Then, we discuss the limitations of our work.            global domain space. Additionally, we cap the maximum
                                                                  CNAME chain length at three, which may omit deeper chains.
                                                                  Since our results show that over 99% of vulnerable CNAME
6.1         Mitigation and Responsible Disclosure
                                                                  chains have a length of one, we believe that this cap is suf-
The risk of the A LIAS L EAP attack arises from hosting           ficient to capture the vast majority of vulnerable cases. In
providers’ incorrect reliance on DNS records obtained via         particular, our dataset and methodology have demonstrated



USENIX Association                                                                    35th USENIX Security Symposium        763
the significant risk of A LIAS L EAP in the real world.            8   Conclusion
   Third, due to the ethical risks associated with performing
real-world domain takeovers, we infer the hosting status of do-    By exploiting flawed cross-domain ownership verification that
mains indirectly based on error responses returned by hosting      follows CNAME records, this paper presents a novel domain
providers. Through manual validation, we confirm that these        hosting service takeover attack, called A LIAS L EAP. The at-
error responses reliably reflect the actual domain hosting sta-    tack has a wide impact in the real world and is highly stealthy.
tus. The main limitation of this heuristic detection method is     We identify 11 affected hosting providers and more than
that hosting providers may change their response templates         two million vulnerable domains. Many vulnerable CNAME
in the future, which would prevent us from inferring the reg-      chains are legitimately configured, with over half persisting
istration status of domains. Considering that large-scale regis-   for more than one month and approximately 20K lasting over
tration of uncontrolled domains may introduce ethical risks,       10 years. We proposed mitigation strategies and responsibly
we manually verified 14 domains with permission from Anon          disclosed the vulnerability to the affected providers, receiving
and found that all of them were affected by the A LIAS L EAP       confirmations from eight of them. We hope that our findings
attack. After completing the experiments, we immediately           prompt the Internet community to re-examine the implemen-
relinquished control of all domains.                               tation and security risks associated with CNAME records.


7     Related Work
                                                                   Ethical Considerations
As a widely used DNS record type, CNAME is critical to
the Internet ecosystem. Prior research on CNAME-related            Our study involves large-scale measurements of hosting
security risks has primarily focused on vulnerabilities arising    providers and domains, which require careful consideration of
from dangling CNAME records and cyclic CNAME chains.               potential ethical risks. We follow established research ethics
   Liu et al. [32] in 2016 conducted the first large-scale mea-    guidelines [12, 29] and prior related works [24, 32, 46] to min-
surement of dangling DNS records in the wild, covering A,          imize ethical concerns throughout our experiments. Below,
CNAME, MX, and NS records. They identified 260 dan-                we outline our main ethical considerations.
gling CNAME records among the Alexa Top 10K domains.               End-to-end testing of hosting providers. In this paper, we
Squarcina et al. [41] examined domain takeover threats across      manually test 25 hosting providers to assess their susceptibil-
26 million subdomains under the Tranco Top 50K domains             ity to the A LIAS L EAP attack. All experiments are conducted
and found 887 affected domains. Zhang et al. [46] devel-           exclusively using domains under our control and through the
oped an automated tool to detect subdomain web service             providers’ public website interfaces. In addition, with explicit
takeover risks and identified 10,351 vulnerable subdomains in      authorization from Anon, we perform takeover validations on
the Tranco Top 1M domain list over seven months. Focusing          several popular domains to demonstrate the practical feasibil-
on CDN services, Lin et al. [31] discovered 1,449 dangling         ity of A LIAS L EAP. Upon completion of these experiments,
subdomains within the Tranco Top 1M domains. Moreover,             we immediately relinquish control of all hosted domains, en-
Jens Frieß et al. [24] investigated the actual misuse of dan-      suring that no users or organizations are adversely affected
gling DNS records by attackers in web hosting scenarios.           by our manual testing.
They uncovered 20,904 cases of web service hijacking on the        Detecting domain hosting status. The primary ethical con-
popular cloud platform.                                            cern in identifying vulnerable domains arises from sending
   Bushart et al. [19] in 2018 reported that CNAME chain           emails to target domains. To avoid any impact on real users,
loops can be exploited to launch denial-of-service attacks.        we infer the risk status of domains by leveraging hosting
Their experiments demonstrated that CNAME loop attacks             providers’ distinctive error responses for non-hosted domains.
could achieve an amplification factor of 8.51, and they identi-    Specifically, for each domain, we initiate at most one SMTP
fied more than ten DNS resolvers that could act as amplifiers.     connection and use the randomly generated username as the
In addition, Moura et al. [34] in 2021 conducted further eval-     recipient address. We terminate the SMTP session before
uations of CNAME loop attacks and found that most DNS              sending the email body, ensuring that no email content is de-
resolvers are capable of detecting CNAME loops and termi-          livered. Overall, no real user mailboxes receive emails, and
nating the resolution process.                                     the interaction imposes negligible load on email servers.
   In summary, prior works have focused on security risks             Furthermore, we evaluate the real-world impact of the
caused by misconfigured or unconventional CNAME records.           A LIAS L EAP attack using a PDNS dataset. The data we ob-
In contrast, our study demonstrates that even correctly config-    tained consists of DNS query logs aggregated by 4-tuples,
ured CNAME chains can be exploited for domain takeover             including queried domains, answer records, query counts, and
attacks due to hosting providers’ incorrect assumptions about      time intervals. The PDNS dataset we use does not contain any
CNAME semantics.                                                   user-related sensitive information, such as client IP addresses.



764    35th USENIX Security Symposium                                                                       USENIX Association
Open Science                                                         [13] Backend ip addresses for 1.1.1.1. https://www.clou
                                                                          dflare.com/ips-v4, 2026.
To facilitate replicability, we carefully selected publicly avail-
able datasets and tools in this study and published them at          [14] Backend ip addresses for 8.8.8.8. https://www.gsta
https://doi.org/10.5281/zenodo.20404540.                                  tic.com/ipranges/publicdns.json, 2026.
Risk detection system. For the HostingEye system, we re-             [15] Virustotal. virustotal.com/gui/, 2026.
lease the code for identifying the email hosting and web host-
ing status of domains.                                               [16] 114DNS. https://www.114dns.com/.
CNAME chains of popular domains. We release the                      [17] Amazon. Aws certificate manager email validation. ht
CNAME chain dataset through PDNS to facilitate further                    tps://docs.aws.amazon.com/acm/latest/userg
analysis of real-world CNAME relationships.                               uide/email-validation.html, 2026.
   For ethical reasons, we chose not to release the victim do-
main dataset. Many providers have not yet remediated the             [18] Azure. Overview: Use custom domain names with azure
vulnerabilities, and releasing the complete dataset could en-             app service. https://learn.microsoft.com/en-u
able attackers to conduct large-scale domain takeovers. In                s/azure/app-service/overview-custom-domai
addition, some providers have requested that we not disclose              ns.
their identities or the domains hosted on their platforms in or-
                                                                     [19] J. Bushart and C. Rossow. DNS unchained: Amplified
der to avoid potential reputational damage and legal disputes.
                                                                          application-layer dos attacks against DNS authoritatives.
                                                                          In RAID, volume 11050, pages 139–160. Springer, 2018.
Acknowledgment
                                                                     [20] ComodoSSLStore. Domain validation using email-
We thank all anonymous reviewers for their valuable and                   based validation. https://help.comodosslstor
constructive feedback. This work is supported by the Na-                  e.com/support/solutions/articles/220002926
tional Key Research and Development Program of China (No.                 38-domain-validation-using-email-based-val
2023YFB3105600), and the National Natural Science Foun-                   idation, 2026.
dation of China (Grant No. 62272413). Baojun Liu and Jun             [21] DigiCert. Use email verification to validate a domain
Shao are both corresponding authors.                                      on a pending dv tls certificate. https://docs.digic
                                                                          ert.com/en/certcentral/manage-certificates/
References                                                                dv-certificate-enrollment/domain-control-v
                                                                          alidation--dcv--methods/use-the-email-dcv
 [1] Alibaba cloud. https://cn.aliyun.com/.                              -method.html, 2026.

 [2] Framer. https://www.framer.com/.                                [22] DNSimple. Ssl certificate email-based domain valida-
                                                                          tion. https://support.dnsimple.com/articles/
 [3] Github. https://github.com/.                                         ssl-certificates-email-validation/, 2026.

 [4] hostinger. https://www.hostinger.com/.                          [23] CA/Browser Forum. Baseline requirements for the is-
                                                                          suance and management of publicly-trusted tls server
 [5] Improvmx. https://improvmx.com/.                                     certificates. https://cabforum.org/working-gro
                                                                          ups/server/baseline-requirements/documents/
 [6] Largest breaches. https://haveibeenpwned.com/.
                                                                          CA-Browser-Forum-TLS-BR-2.2.6.pdf, 2026.
 [7] Namecheap. https://www.namecheap.com/.                          [24] J. Frieß, T. Gattermayer, N. Gelernter, H. Schulmann,
 [8] Netlify. https://www.netlify.com/.                                   and M. Waidner. Cloudy with a chance of cyberattacks:
                                                                          Dangling resources abuse on cloud platforms. In NSDI.
 [9] Nuvemshop. https://www.nuvemshop.com.br/.                            USENIX Association, 2024.

[10] Render. https://render.com/.                                    [25] GeoCerts. Domain control validation by email verifica-
                                                                          tion method. https://www.geocerts.com/support
[11] Vercel. https://vercel.com/.                                         /domain-control-validation-by-email-chall
                                                                          enge-method, 2026.
[12] The belmont report: ethical principles and guidelines
     for the protection of human subjects of research. United        [26] Github. Configuring a custom domain for your github
     States. National Commission for the Protection of Hu-                pages site. https://docs.github.com/en/pages/c
     man Subjects of Biomedical and Behavioral Research.                  onfiguring-a-custom-domain-for-your-githu
     Department of Health, Education and Welfare, 1979.                   b-pages-site.



USENIX Association                                                                      35th USENIX Security Symposium        765
[27] Gmail. Email sender guidelines. https://support.            [42] SSL.COM. What are the requirements for ssl.com ssl/tls
     google.com/a/answer/81126, 2024.                                 certificate domain validation? https://www.ssl.com/
                                                                      faqs/ssl-dv-validation-requirements/, 2026.
[28] ip api. Ip geolocation api. https://ip-api.com/.
                                                                 [43] Tranco. Top 1m domains. https://tranco-list.eu.
[29] E. Kenneally and D. Dittrich. The menlo report: Ethi-
     cal principles guiding information and communication        [44] XYZ.COM. The xyz team. https://www.spamhaus
     technology research, 2012.                                       .org/authors/the-xyz-team/, 2024.

[30] R. Li, C. Lu, B. Liu, Y. Zhang, G. Hong, H. Duan, Y. Lin,   [45] Yahoo. Sender requirements and recommendations. ht
     Q. Pan, M. Yang, and J. Shao. HADES attack: Un-                  tps://senders.yahooinc.com/best-practices,
     derstanding and evaluating manipulation risks of email           2024.
     blocklists. In NDSS. The Internet Society, 2025.
                                                                 [46] M. Zhang, X. Li, B. Liu, J. Lu, Y. Zhang, J. Chen,
[31] Z. Lin, Z. Lin, R. Guo, J. Chen, M. Zhang, X. Liu,               H. Duan, S. Hao, and X. Zheng. Detecting and measur-
     T. Yang, Z. Cao, and R. Deng. Detecting and measuring            ing security risks of hosting-based dangling domains.
     security implications of entangled domain verification           Proc. ACM Meas. Anal. Comput. Syst., 7(1):9:1–9:28,
     in CDN. CoRR, abs/2409.01887, 2024.                              2023.

[32] D. Liu, S. Hao, and H. Wang. All your DNS records           [47] Zoho. Domain verification in zoho mail. https://ww
     point to us: Understanding the security threats of dan-          w.zoho.com/mail/help/adminconsole/domain-v
     gling DNS records. In CCS, pages 1414–1425. ACM,                 erification.html.
     2016.

[33] P. Mockapetris. Domain names - concepts and facilities.     A       Domain Hosting Provider Filtering
     RFC 1034, November 1987.
                                                                 To reduce the scope of manual testing, we use random TXT
[34] G. Moura, S. Castro, J. Heidemann, and W. Hardaker.         record templates to filter hosting providers. We observe that
     Tsuname: exploiting misconfiguration and vulnerability      some random TXT records are specific to particular domain
     to ddos DNS. In IMC, pages 398–418. ACM, 2021.              hosting services. Therefore, when filtering email and web
                                                                 hosting providers, we exclude TXT records configured on
[35] public suffix list. https://publicsuffix.org/lis            hosted domains that are unrelated to the target service, e.g.,
     t/public_suffix_list.dat.                                   TXT records used for web hosting or file storage.
                                                                   Table 7 lists 10 popular TXT record templates that are
[36] D. McCarney J. Kasten R. Barnes, J. Hoffman-Andrews.        independent of email services and web services. After exclud-
     Automatic certificate management environment (acme).        ing irrelevant TXT record templates, we compute, for each
     RFC 8555, March 2019.                                       provider, the proportion of hosted domains that configure ran-
                                                                 dom TXT record templates. The cumulative distribution of
[37] Radix. report abuse. https://radix.website/repo             these proportions is shown in Figure 9. Finally, we retain
     rt-abuse/, 2024.                                            only 116 candidate providers with proportions below 20% for
                                                                 manual testing.
[38] P. Wouters E. Nygren T. Wicinski S. Sahib, S. Huque.
     Domain control validation using dns. draft-ietf-dnsop-
     domain-verification-techniques-12, March 2026.                    1.0
                                                                       0.8
[39] Sectigo. How does the email challenge-response method
                                                                       0.6
                                                                 CDF




     work for domain control validation (dcv)? https://ww
     w.sectigo.com/knowledge-base/detail/email                         0.4
    -challenge-response-for-domain-control-val                         0.2
     idation-dcv, 2026.
                                                                       0.0
                                                                             0     20        40         60        80      100
[40] Spamhaus. https://www.spamhaus.org/.                                        Proportion of randomized TXT templates

[41] M. Squarcina, M. Tempesta, L. Veronese, S. Calzavara,
     and M. Maffei. Can I take your subdomain? explor-           Figure 9: Proportion of domains hosted by providers that
     ing same-site attacks in the modern web. In USENIX          configure randomized TXT templates.
     Security Symposium, pages 2917–2934, 2021.



766   35th USENIX Security Symposium                                                                         USENIX Association
Table 7: TXT record templates and corresponding providers.
Omits the random value part of the TXT record.
      Provider       TXT template (partial)
      Facebook       facebook-domain-verification
      Apple          apple-domain-verification
      Atlassian      atlassian-domain-verification
      Brevo          sendinblue-site-verification
      GlobalSign     _globalsign-domain-verification
                                                                Figure 11: normal.sec-mail.cloud is normally hosted on
      Cisco          cisco-ci-domain-verification
                                                                Render.
      Stripe         stripe-verification
                                                                   We then set up a victim domain, victim.sec-mail.xyz,
      Dropbox        dropbox-domain-verification
                                                                and configured its CNAME records to point to
      Adobe          adobe-idp-site-verification                normal.sec-mail.cloud. Figure 12, Figure 13, and
      1Password      1password-site-verification                Figure 14 show the DNS query results of the MX, TXT, and
                                                                A records of victim.sec-mail.xyz, respectively. We can
                                                                observe that the victim domain already resolves to the correct
                                                                DOV challenge tokens through the CNAME records.
B    End-to-end Testing for Hosting Providers                      Next, we register the victim domain through the web in-
                                                                terfaces provided by ImprovMX and Render. As shown in
We use ImprovMX and Render as examples to demonstrate
                                                                Figure 15 and Figure 16, victim.sec-mail.xyz passed the
the end-to-end testing process for email and web hosting
                                                                providers’ DOV and was successfully registered.
providers, respectively. Throughout the entire process, we
                                                                   Finally, we examined whether the email service and web
only used accounts and domains under our control for testing,
                                                                service of the victim domain functioned correctly. For the
ensuring that no third-party users were affected.
                                                                email service, we sent emails to our Gmail account through
   We first configured valid DOV challenge tokens for a
                                                                the mail forwarding interface provided by ImprovMX. We
normal domain (normal.sec-mail.cloud) to enable host-
                                                                successfully received emails sent from the victim domain
ing on ImprovMX and Render. To host the domain on Im-
                                                                in the Gmail inbox. As shown in Figure 17, emails from
provMX, normal.sec-mail.cloud configured MX records
                                                                victim.sec-mail.xyz passed Gmail’s SPF verification.
pointing to mx1.improvmx.com and mx2.improvmx.com,
                                                                Therefore, we consider ImprovMX to be vulnerable to the
as well as a TXT record with the value “v=spf1 in-
                                                                A LIAS L EAP attack. For the web service, we hosted a test web-
clude:spf.improvmx.com all”. To host the domain on Render,
                                                                page for the victim domain on Render. We then accessed the
normal.sec-mail.cloud configured four A records point-
                                                                webpage of victim.sec-mail.xyz through Firefox browser.
ing to 216.24.57.1. Figure 10 and Figure 11 show the hosting
                                                                As shown in Figure 18, the victim domain returned the web-
status of normal.sec-mail.cloud on ImprovMX and Ren-
                                                                page deployed by us, and the certificate is valid. Therefore, we
der, respectively.
                                                                consider Render to be vulnerable to the A LIAS L EAP attack.




Figure 10: normal.sec-mail.cloud is normally hosted on              Figure 12: MX records of victim.sec-mail.xyz.
ImprovMX.



USENIX Association                                                                  35th USENIX Security Symposium         767
      Figure 13: TXT records of victim.sec-mail.xyz.

                                                         Figure 16: victim.sec-mail.xyz successfully registered
                                                         on Render.




       Figure 14: A records of victim.sec-mail.xyz.
                                                         Figure 17: Gmail validation results for the email from
                                                         victim.sec-mail.xyz.




                                                         Figure 18: Access victim.sec-mail.xyz in Firefox
Figure 15: victim.sec-mail.xyz successfully registered   browser.
on ImprovMX.




768    35th USENIX Security Symposium                                                       USENIX Association
                          Table 8: Challenge tokens and NDRs for vulnerable email hosting providers.

                                                                             NDR for non-existent user*
 Email provider             Challenge token
                                                                   Hosted domain                  Unhosted domain
                          MX: m**2.q**q.com                   Mailbox unavailable or                       Bad address syntax.
                          MX: m**1.q**q.com                 access denied [<code>= IP:                http://service.e**l.q**q.com/
 Anon
                          TXT: v=spf1 include:            <sender_ip>]. https://open.work.             cgi-bin/help?subtype=1&&
                         spf.mail.q**q.com ∼all           w**n.q**q.com/help2/pc/20057.                 id=20022&&no=1000730
                       MX: mx1.qiye.aliyun.com
                       MX: mx2.qiye.aliyun.com
                                                                                                       RCPT (<sender_address>)
 Alibaba Cloud         MX: mx3.qiye.aliyun.com                         Rcpt Ok
                                                                                                             dosn’t exist
                         TXT: v=spf1 include:
                        spf.qiye.aliyun.com -all
                                                         <rcpt_address>: Recipient address
                      MX: mx1.privateemail.com
                                                            rejected: unverified address:
                      MX: mx2.privateemail.com                                                              <rcpt_address>:
 Namecheap                                                Mailbox might be disabled, full,
                        TXT: v=spf1 include:                                                               Relay access denied
                                                           or may not exist on the server.
                      spf.privateemail.com ∼all
                                                                Reason: JFE030050
                                                            SMTP error, RCPT TO: Host
                                                            <sender_domain>(<rcpt_ip>)
                                                               RCPT TO said 550 5.1.1              host <sender_domain>[<rcpt_ip>]
                        MX: mx1.improvmx.com
                                                             The email account you tried                said: 550 5.1.3 Relay not
                        MX: mx2.improvmx.com
 ImprovMX                                                       to reach does not exist.                 permitted. (#id-5.9.2) -
                         TXT: v=spf1 include:
                                                               Please double-check the                  ImprovMX v2025.11.21
                        spf.improvmx.com ∼all
                                                            recipient’s email address for          (in reply to RCPT TO command)
                                                            typos or unnecessary spaces.
                                                              - ImprovMX v2025.11.21
  * <code> denotes a provider-defined string; <rcpt_address> denotes the recipient’s email address; <rcpt_ip> denotes the IP address of the
   recipient mail server; <sender_ip> denotes the IP address of the sender mail server; <sender_address> denotes the sender’s email address;
   and <sender_domain> denotes the sender’s domain.




USENIX Association                                                                            35th USENIX Security Symposium            769
                       Table 9: Challenge tokens and HTTP responses for vulnerable web hosting providers.

                                                                                        HTTP GET response
 Web provider                         Challenge token*
                                                                       Hosted domain           Unhosted domain
                                  A: 185.199.108.153
                                  A: 185.199.109.153
                                  A: 185.199.110.153                                              Status: 404 Not Found
 GitHub                                                                Status: 200 OK
                                  A: 185.199.111.153                                       Title: Site not found · GitHub Pages
                                CNAME: <user>.github.io†
                                   A: 75.2.60.5
 Netlify                                                               Status: 200 OK             Status: 404 Not Found
                              CNAME: <project>.netlify.app
                                                                                                   Status: 409 Conflict
                                  A: 216.24.57.1
 Render                                                                Status: 200 OK          Title: DNS resolution error |
                            CNAME: <project>.onrender.com
                                                                                                  <domain>| Cloudflare
                                    A: 31.43.160.6
 Framer                             A: 31.43.161.6                     Status: 200 OK       ERR_SSL_PROTOCOL_ERROR§
                                 CNAME: sites.framer.app
                                A: 185.133.35.21
                                                                                                 Status: 404 Not Found
 Nuvemshop                      A: 185.133.35.22                       Status: 200 OK
                                                                                                Title: 404: NOT_FOUND
                      CNAME: <project>.lojavirtualnuvem.com.br
                                 A: 216.198.79.1                                                 Status: 404 Not Found
 Vercel                                                                Status: 200 OK
                         CNAME: <project>.vercel-dns-017.com                                    Title: 404: NOT_FOUND
                                                                                                  Status: 403 Forbidden
 Hostinger                            A: 153.92.8.254                  Status: 200 OK
                                                                                                   Title: 403 Forbidden
  * Domains can complete the DOV of web providers by configuring A records or CNAME records.
  † <user> represents the user account name; <project> represents the project name created by the customer; <domain> represents the
      domain requested by the user.
  § Requesting HTTP resources of unhosted domains to Framer will receive an SSL error. ERR_SSL_PROTOCOL_ERROR is an error
      code given by the Chrome browser.




770    35th USENIX Security Symposium                                                                         USENIX Association
