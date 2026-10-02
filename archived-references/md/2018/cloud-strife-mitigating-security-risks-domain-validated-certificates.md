---
type: Whitepaper
title: "Cloud Strife: Mitigating the Security Risks of Domain-Validated Certificates"
description: "Stale DNS records that still point at cloud IP addresses their owner has released let an attacker re-allocate the same address and pass automated domain validation, obtaining a browser-trusted certificate for someone else's domain. Over 700,000 exposed domains were found, with takeover practical in under 70 seconds for under a dollar; a trust-based ACME challenge is proposed."
resource: "https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf"
tags: [whitepaper, webseclist-reference, dns, tls, auth-bypass, https, aws, azure, large-scale-scan, measurement-study, mitigation, owasp-a01-2021, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:35:10+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf"
    title: "Cloud Strife: Mitigating the Security Risks of Domain-Validated Certificates"
    author: Kevin Borgolte, Tobias Fiebig, Shuang Hao, Christopher Kruegel, Giovanni Vigna
also_at: []
authors:
  - Kevin Borgolte
  - Tobias Fiebig
  - Shuang Hao
  - Christopher Kruegel
  - Giovanni Vigna
canonical_url: ""
cited_by:
  - "2018.md:73"
commit: ""
content_sha256: aceb131eedbcae369d615b8c551bc257fd5229a465d399488ba54390ce9f5f45
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: dd10b44aaf3d40b157b3ac5dafd0751ad262cf193c565ff712e79dd1c4456725
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:35:10+00:00"
slug: cloud-strife-mitigating-security-risks-domain-validated-certificates
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Cloud Strife: Mitigating the Security Risks of Domain-Validated Certificates

**Cloud Strife: Mitigating the Security Risks of Domain-Validated Certificates** - Kevin Borgolte, Tobias Fiebig, Shuang Hao, Christopher Kruegel, Giovanni Vigna, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2018/02/ndss2018_06A-4_Borgolte_paper.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Cloud Strife: Mitigating the Security Risks of Domain-Validated Certificates

Cloud Strife: Mitigating the Security Risks of
                Domain-Validated Certificates
        Kevin Borgolte              Tobias Fiebig                Shuang Hao         Christopher Kruegel           Giovanni Vigna
      UC Santa Barbara                   TU Delft               UT Dallas             UC Santa Barbara           UC Santa Barbara
     kevinbo@cs.ucsb.edu           t.fiebig@tudelft.nl      shao@utdallas.edu         chris@cs.ucsb.edu          vigna@cs.ucsb.edu


    Abstract—Infrastructure-as-a-Service (IaaS), and more gener-         demand, and at scale, all while requiring almost no upfront
ally the “cloud,” like Amazon Web Services (AWS) or Microsoft            investment. In fact, Amazon Web Services (AWS), Amazon’s
Azure, have changed the landscape of system operations on the            public cloud, serves over one million active users world-
Internet. Their elasticity allows operators to rapidly allocate and      wide [1], Microsoft Azure is gaining 120,000 new customers
use resources as needed, from virtual machines, to storage, to           each month [2], and the global cloud IP traffic has reached
bandwidth, and even to IP addresses, which is what made them
popular and spurred innovation.
                                                                         3.9 zettabytes (3.9 billion terabytes) in 2015 already [3].
                                                                         Unfortunately, as the recent years have shown, the resource
    In this paper, we show that the dynamic component paired             pooling and increased popularity of cloud-based deployments
with recent developments in trust-based ecosystems (e.g., SSL            also pose severe security issues to the clouds’ tenants [4, 5].
certificates) creates so far unknown attack vectors. Specifically, we
discover a substantial number of stale DNS records that point to             With the clouds’ increase in popularity and their commodi-
available IP addresses in clouds, yet, are still actively attempted to   tization, website operators have been empowered to deploy
be accessed. Often, these records belong to discontinued services        their website themselves instead of relying on more tradi-
that were previously hosted in the cloud. We demonstrate that it         tional web hosting. At the same time, HTTPS has become
is practical, and time and cost efficient for attackers to allocate      basically a requirement for any website operator, not only
IP addresses to which stale DNS records point. Considering               for dynamic websites trying to protect login credentials, but
the ubiquity of domain validation in trust ecosystems, like SSL          also for static websites. Unprotected websites are being ranked
certificates, an attacker can impersonate the service using a
valid certificate trusted by all major operating systems and
                                                                         lower by search engines [6], they are limited in browser
browsers. The attacker can then also exploit residual trust in           features that they can use [7], and they risk having content
the domain name for phishing, receiving and sending emails, or           and advertisements injected, e.g., by wireless access point
possibly distribute code to clients that load remote code from the       operators or Internet Service Providers [8, 9]. For HTTP/2, it
domain (e.g., loading of native code by mobile apps, or JavaScript       has become practically mandatory because all major browsers
libraries by websites).                                                  support HTTP/2 over TLS only [10]. Website operators now
     Even worse, an aggressive attacker could execute the attack
                                                                         typically deploy SSL certificates for their domains and use
in less than 70 seconds, well below common time-to-live (TTL) for        HTTPS to ensure integrity and confidentiality for any commu-
DNS records. In turn, it means an attacker could exploit normal          nication with their website. For certificates to be trusted by the
service migrations in the cloud to obtain a valid SSL certificate        websites’ visitors’ browsers, however, they need to be issued
for domains owned and managed by others, and, worse, that she            by trusted certificate authorities (CAs). Traditional verification
might not actually be bound by DNS records being (temporarily)           approaches involve identity documents, like verifying pass-
stale, but that she can exploit caching instead.                         ports, which incurred high processing overhead. To cope with
    We introduce a new authentication method for trust-based do-         the high-volume demand for digital certificates, CAs adopted
main validation that mitigates staleness issues without incurring        automated approaches to verify and issue certificates, and
additional certificate requester effort by incorporating existing        now heavily rely on domain validation. Having launched only
trust of a name into the validation process. Furthermore, we             in April 2016, Let’s Encrypt has since been dominating the
provide recommendations for domain name owners and cloud                 domain-validation part of the certificate authority ecosystem
operators to reduce their and their clients’ exposure to DNS             through openly available and well-designed tooling that uses
staleness issues and the resulting domain takeover attacks.              the Automatic Certificate Management Environment protocol
                                                                         (ACME) [11] to validate domain ownership and issue certifi-
                       I.   I NTRODUCTION                                cates almost transparently for users. Today, Let’s Encrypt has
                                                                         issued over 100 million certificates in less than 15 months
    Over the past ten years, cloud services have grown tremen-
                                                                         and their certificates account for 80% of all publicly trusted
dously. Generally, clouds are comprised of hundreds to thou-
                                                                         certificates [12, 13].
sands of commodity servers, which make up pools of com-
puting resources that are shared by different users. One of                  Unfortunately, combining the elasticity of cloud infrastruc-
the main drivers behind the clouds’ rise in popularity is their          ture and the automation of certificate issuance introduces new
elasticity: users can acquire and use resources as needed, on            security vulnerabilities. In this paper, we discover that stale
                                                                         and abandoned DNS entries pointing to cloud IP addresses can
                                                                         be exploited by attackers to deceive domain-based certificate
Network and Distributed Systems Security (NDSS) Symposium 2018           validation and obtain certificates for the victim domains. The
18-21 February 2018, San Diego, CA, USA
ISBN 1-891562-49-5                                                       problem stems from the ephemeral nature of the cloud re-
http://dx.doi.org/10.14722/ndss.2018.23327                               sources. More specifically, if a user releases a cloud IP address,
www.ndss-symposium.org                                                   but does not remove the corresponding DNS entry before
releasing the IP address, an attacker can allocate the same                The remainder of this paper organized as follows: First, we
IP address, impersonate ownership of the domain, and request               provide background detail on DNS, operation of Infrastructure-
trusted certificates from a CA, like Let’s Encrypt. In this paper,         as-a-Service clouds, and domain validation (see Section II).
we call them IP address use-after-free vulnerabilities, which              Next, we analyze and evaluate to what degree IP address use-
can enable a variety of attacks and cause harm. Adversaries                after-free vulnerabilities pose a security threat (see Section III).
can leverage the acquired valid certificates for man-in-the-               Then, we present our mitigation technique, which retains
middle attacks, e.g., to intercept the HTTPS traffic to the victim         almost all usability benefits of automated domain validation,
domain on a wireless network. Worse, if an attacker obtains a              yet protects against IP address use-after-free (see Section IV).
wild-card certificate, her attack capabilities are significantly en-       Subsequently, we compare our mitigation to related work (see
hanced, possibly allowing her to impersonate any sub-domain,               Section V). Finally, we conclude (see Section VI).
including non-existing ones. The obtained certificates can be
abused for phishing attacks, by impersonating the legitimate                                      II.   BACKGROUND
website, including SSL verification and its “trustworthy green
lock.” Attackers can deface the website, and they might even be                We provide a basic introduction to the Domain Name Sys-
able to launch remote code execution attacks, e.g., if JavaScript          tem (DNS), to different operational models in cloud setups, and
or native code is being loaded from the domain that was taken              to the use of domain validation for SSL certificate issuance.
over [14–16].
    To better understand the prevalence of IP address use-                 A. Domain Name System and DNSSEC
after-free vulnerabilities in the wild, we conduct a large-                    The Domain Name System (DNS) is a core protocol of the
scale analysis. From passive DNS traffic, we extract over 130              current Internet architecture. It facilitates to use easily identifi-
million domains that point to IP addresses of cloud networks.              able hierarchically organized names instead of IP addresses to
On these domains, we perform regular liveness probes to                    access services online. Although the fundamental idea of DNS
determine whether their cloud IP addresses are allocated and               is straightforward [17], we describe IPv4 and IPv6 resource
in use. Our results indicate that over 700,000 domains point               records (RRs) and DNSSEC as they are essential to our work.
to cloud IP addresses that are free, and which are susceptible
to domain takeover attacks due to use-after-free vulnerabilities.              Resolving names to IP addresses via DNS is done by
We further investigate the feasibility of obtaining particularly           requesting an A RR to resolve a name to an IPv4 address, or an
interesting target IP addresses from cloud services, and we                AAAA RR to resolve to an IPv6 address. The information for a
estimate that it would cost attackers less than $1 (USD) to                RR is stored in the so-called parent zone. Each record is served
cycle through the necessary unique IP addresses, which renders             by (at least one) DNS server, which is authoritative for that
the attack economically viable for adversaries. Based on our               zone. There is, however, no automatic aspect within the DNS
in-depth analysis, we propose to extend the ACME protocol                  ecosystem that guarantees that DNS entries remain “fresh,” i.e.,
version 2 by including our new trust-based identifier validation           a method that ensures that a given RR never becomes “stale,”
challenge, and we provide practical recommendations for do-                but that it always points to the correct IP address or that it is
main owners and cloud operators to protect themselves from                 removed if it should point nowhere.
domain takeover attacks.                                                       DNS by itself does not provide authentication, which brings
In this paper, we make the following contributions:                        security issues due to response spoofing, and spoofing can
                                                                           allow domain takeover attacks. DNSSEC is one method to
• We conduct a comprehensive study of IP address use-after-                provide integrity for the unencrypted DNS ecosystem. Authen-
  free vulnerabilities, and the domain takeover attacks that               ticating existing records is a straightforward extension of DNS
  these vulnerabilities enable. We show that the scale of                  through a signature record type (RRSIG) for each original re-
  the vulnerabilities is considerable: over 700,000 unique                 source record set (RRset), which is signed with a zone-signing
  domains point to IP addresses that are free and can be                   key (ZSK). The public key portion of the ZSK is hosted in the
  abused to take over the respective domains.                              zone, while the parent zone provides a hash of the ZSK in a DS
                                                                           RR. The problem of distributing public keys in a trustworthy
• We discover that even well maintained DNS zones can be                   manner is solved through DNS’ hierarchical nature and its
  vulnerable to domain takeover attacks: after releasing cloud             existing chain of trust from the root zone to the queried zone.
  IP address resources, an adversary might be able to exploit              Crucial is that DNSSEC discourages the use of online signing
  now outdated zone information in DNS caches to launch                    to prevent denial of service attacks against the nameserver
  attacks.                                                                 and chosen-plaintext attacks against the zone-signing key, as
                                                                           well as deploying the ZSK to (hidden) master nameservers
• We examine the feasibility of launching domain takeover                  to automate signing of updated zone information online [18,
  attacks in the real world through cloud IP address re-use,               Section 5]. Instead, it strongly encourages to publish only zone
  by analyzing their allocation cycles, and we show that it is             information that was signed offline in a secure manner, and
  practical, time-efficient, and cost-efficient for an attacker to         then deployed to (hidden) masters [19, Section 3.1, Section 9,
  launch such attacks.                                                     and Section 12][20, Section 3.4.3]. Furthermore, the current
                                                                           state of the DNSSEC ecosystem shows significant deployment
• We propose a new domain-validation method for automated                  issues, for example, not publishing all required records for
  certificate management environments (ACME) CAs that                      validation, incorrectly rolling-over keys, or not rolling keys
  leverages the existing trust of a name to mitigate domain                over in the first place, which indicates a lack of care or tooling
  takeover attacks.                                                        when deploying DNSSEC in practice [21].

                                                                       2
B. Cloud Models                                                         C. Domain-Validated Certificates
    Cloud Computing has become a widely used concept                        The HTTPS ecosystem is based on certificate authorities
in Computer Science. Following, we employ the National                  (CAs), which are trusted by operating system and browser
Institute of Standards and Technology’s (NIST) definition of            vendors. These vendors include the CAs’ certificates in their
Cloud Computing [22].                                                   products, and certificates that are presented to clients have
                                                                        to demonstrate a chain of signatures to a certificate of a
    Clouds are hardware and software bundles to provide                 trusted CA. The job of a CA is to verify that the entity that
users with five basic characteristics: on-demand self-service,          requests a certificate to be issued is authorized to obtain a
broad network access, resource pooling, rapid elasticity, and,          signed certificate for the specific domain(s) that the certificate
measured services. Specifically, it means that a cloud must             is supposed to be valid for.
provide services at its users’ demand, without requiring any
further manual interaction by the cloud operator, it must allow            Various methods to assert authority over a domain exist.
customers to (ideally) automatically scale their resource usage         Classical and more expensive methods of identification require
based on their needs, and all operations must be metered                a CA to verify that a requesting party conforms to the domain-
precisely and billed accordingly.                                       owning party by checking identity documents, e.g. passports,
                                                                        or company incorporation forms. However, such processes
    Cloud infrastructures generally have different deployment           incur significant overhead.
models, depending on their use case and users: public for the
general public, private for large operators or higher security              Nowadays, more cost-effective methods of validating do-
requirements (e.g., businesses or the government), or commu-            main ownership, or rather establishing that the requesting
nity for private clouds shared among multiple organizations for         party is currently controlling the domain, exist, and they have
cost-savings or security. In this paper, we focus on IP address         been adopted by all major CAs, mainly to combat operating
re-use vulnerabilities in public clouds.                                costs. These methods are generally referred to as issuance
                                                                        of a domain-validated certificate, because only authority over
   Ultimately, the most distinguishing technical difference for         the domain is established. The three most common validation
clouds is their respective service model:                               methods are:

Software as a Service (SaaS).                                           DNS Validation.
  The SaaS model is the most abstract setup. Customers                    To validate ownership of a domain via DNS, the certificate
  interface with software provided by the operator, either                requester must set a nonce that she received from the CA
  via their web-browser or a standardized program interface               in a DNS record, usually a TXT record, which the CA will
  (API). Customers do not have access “the underlying cloud               attempt to query and validate. Requiring the requester to
  infrastructure including network, servers, operating sys-               change a DNS entry implies that she controls the domain’s
  tems, storage, or even individual application capabilities              DNS zone, which is considered a strong indicator for
  [...]” [22]. Examples include Microsoft Office 365 and the              authority over a domain.
  SalesForce Platform.
                                                                        Email Validation.
                                                                          Similarly, to validate a domain via email, the CA sends an
Platform as a Service (PaaS).                                             email to (a) one of the mail addresses listed in the domain’s
   For PaaS clouds, users deploy their own code and appli-                WHOIS data, or, (b) to one of the common administrative
   cations to run on the cloud. Although the executed code                email accounts, like “postmaster,” “webmaster,”, or “sslmas-
   is under the users’ control, access to the underlying cloud            ter.” The email includes a unique token that must be send
   infrastructure, like network and disk, is similarly restricted         to the CA, or a unique link that needs to be visited to verify
   as in the case of SaaS clouds. Examples include Heroku                 ownership of the email address, and, in turn, the domain.
   and Google App Engine.
                                                                        Web-based Validation.
Infrastructure as a Service (IaaS).                                       For web-based validation the certificate requester receives
   IaaS clouds, on the other hand, give more control to cloud             a token from the CA that she must make available via
   users. Here, a user can freely request storage, network,               HTTP at a CA-specified path on the domain for which
   memory, processing, and other resources as needed. Com-                the certificate was requested. Once made available, the CA
   monly, these resources are provided to the user in form                verifies that the token is accessible and contains the correct
   of a virtual machine (VM), on which the user can install               value, and only then attests ownership of the domain and
   any operating system and software. Popular examples of                 issues certificate.
   IaaS clouds are Amazon Web Services (AWS) EC2 and
   Microsoft Azure.                                                     Traditionally, CAs were dominated by an enclosed and
                                                                        business-oriented community. CAcert was among the earli-
In this paper, we investigate IaaS clouds because they allow            est and most prominent approaches to introduce a commu-
us to freely and rapidly allocate IP addresses as part of their         nity driven CA effort [23]. Unfortunately, due to insufficient
resource pooling characteristic. Depending on the external              support by browser and operating system vendors, it never
interfaces of PaaS clouds, they may also be vulnerable to re-           reached widespread adoption. Furthermore, the recent rise of
use attacks, which are related to the IP address use-after-free         SSL related incidents, e.g., DigiNotar [24] and CAs issuing
vulnerabilities that we describe in this paper.                         illegitimate certificates [25], lead to two new developments

                                                                    3
trying to disrupt the established CA ecosystem: the wide-                   For our problem analysis, we investigate and interact with
spread introduction and requirement of certificate transparency         systems that are online and in-use by third parties. Naturally,
and the Let’s Encrypt CA.                                               those systems are outside of our control. In turn, our analysis
                                                                        poses ethical challenges to not affect or impact the legitimate
    Certificate transparency is a framework that specifies that         users of such systems in any way. We discuss the considera-
a CA must publish to a tamper-proof, append-only log, which             tions we undertook for an ethical and appropriate, yet realistic,
can be audited by authorized parties [26, 27]. Its purpose is           analysis separately for each experiment in their respective
to allow potentially affected parties, e.g., domain owners, to          sections.
verify that a CA has not issued a certificate for a given domain
to an unauthorized party. In an ideal world, all CAs would              A. Impact
participate in this scheme and publish certificate transparency
logs, but, unfortunately, not all CAs do currently participate.             Domain takeovers bear serious consequences, even tempo-
However, some individual CAs have been forced to publish                rary takeovers can provide ample opportunity for an attacker
transparency logs by browser vendors, most notably Google,              (see Section I). Naturally, they way an attacker might cause
who threatened to void their trust in the CAs and to remove             harm to the legitimate domain operator and domain users varies
the CAs’ certificate from their products if the CA does not             from case to case and the space of attacks is vast, which is
comply with Google’s request. Without a doubt, the removal              why we only discuss a subset of possible attacks:
of a CA from a major browser, such as Google Chrome,
would have severe business and financial consequences for               Malicious and Remote Code Loading.
a CA, as it might have to refund cost for already issued                  Likely the most straight-forward way for an attacker to
certificates and it would likely have difficulty acquiring new            turn a profit through a domain she took over is by serving
customers, which is what forces a CA into compliance and                  malicious code, serving advertisements, or including affili-
why it is willing to participate in the certificate transparency          ate marketing [15, 16, 30]. Although considered easier to
scheme. One example of such an occurrence is Symantec,                    launch for websites, the attack is not restricted to websites.
who has been required to publish certificate transparency logs            Instead, an attack could also be launched on mobile or
after they issued certificates for google.com without Google’s            desktop applications, e.g., through remote code loading [31,
authorization [25].                                                       32]. Unfortunately, HTTPS and HSTS themselves do not
                                                                          mitigate such an attack.
    Let’s Encrypt, on the other hand, is an effort to make TLS
                                                                        SSL Certificates.
encryption more prevalent on the Internet. They practice a
                                                                          Another way for an attacker to leverage a domain takeover
leaner and completely automatic identity verification process,
                                                                          attack or to increase its success chance is by requesting
and they only issue certificates with short lifetimes of 90
                                                                          a SSL certificate that is trusted by operating systems and
days, to limit the potential damage of key compromise and
                                                                          browsers. Requesting a trusted SSL certificate has become
mis-issuance, as well as to encourage automation [28]. Con-
                                                                          practically feasible because of domain-validated certificates,
trary to the most other CAs, Let’s Encrypt issues certificates
                                                                          such as Let’s Encrypt. Once she has obtained the certificate,
free of charge, and identity is verified exclusively via web-
                                                                          she has increased capabilities for remote code loading
based validation and through DNS validation. Thanks to a
                                                                          attacks over HTTPS, even including HSTS.
combination of a browser-trusted certificate, being free of
charge, and software tooling openly available to reduce system          Nameservers.
administrator effort, it has led to a significant increase in the         A domain might also point to a nameserver, where the
number of systems on the Internet which use validly signed                domain server can be for the same domain or different ones.
certificates, as well as it increased Let’s Encrypt’s popularity          In practice, these cases occur because DNS demands multi-
and market share [29].                                                    ple nameservers for redundancy, and if a nameserver does
                                                                          not respond, a client automatically and, transparent to the
                                                                          user, retries queries with fail-over nameservers. Therefore, a
                  III.   P ROBLEM A NALYSIS                               domain pointing to a free IP address for a nameserver only
                                                                          incurs a latency penalty and is barely noticeable by the user.
    Mitigations to protect from security problems can be imple-           However, an attacker could take over the entire domain and
mented with varying degree of complexity, and for problems of             even create additional domains. For a domain owner, taking
varying degree of complexity. However, in practice, these se-             over a domain that is being used as nameserver equates
curity measures bear performance overhead and have usability              to the worst case scenario. Unfortunately, even entire top-
drawbacks, which might not be acceptable. In turn, their actual           level domains have been vulnerable to nameserver domain
real-world deployment depends on security risk evaluations,               takeover attacks [33].
operational costs, and human costs. Therefore, before trying
to mitigate a non-issue, it is necessary to justify them with           Email Servers.
supporting data instead of recommending absolutes.                        Similarly, after gaining control over a domain, an attacker
                                                                          might be able to send and receive emails. Importantly,
    Following, we first discuss the different security issues             a DNS MX record is not required: if a domain has no
in respect to use-after-free vulnerabilities for IP addresses in          MX record set, then its respective A record is being used.
respect to DNS-based domain validation. We then evaluate                  Acquiring the capability to send or receive email allows an
to what degree those security issues are practical to exploit.            attacker to abuse a domain for spear-phishing and phishing
Finally, we estimate how many domains might be susceptible                campaigns, such as CEO email scams, or to recruit victims
to takeovers and whether protecting them is worthwhile.                   for fraudulent schemes [34, 35].

                                                                    4
Sub-domain Attacks.                                                              Depending on how the domain becomes stale, the length
  Finally, top-level domains are not the only worthwhile                         of the window of opportunity differs. In case of an early
  takeover targets for an attacker. Sub-domains are at least                     migration, an attacker has the shortest window of exploitation:
  similarly interesting for attacks, even sub-domains that                       the cache lifetime of the domain IP mapping. Note, however,
  might have never been used in production, as they could still                  that the time a domain IP mapping might be cached is not
  be abused for authentication bypass vulnerabilities, e.g., like                strictly its time to live (TTL) as set by the authoritative
  it recently happened to the ride-sharing company Uber [36].                    nameserver. The mapping can be purged from the cache before
                                                                                 its expiration, and a caching nameserver might ignore the TTL
Regarding SSL certificate related attacks, it is sufficient for an               entirely and cache entries longer, e.g., for performance reasons,
attacker to request an ordinary certificate. She does not require                though in violation of the DNS RFC [38]. Theoretically,
a wild-card certificate to launch successful attacks. However,                   early migration could prevent IP address use-after-free attacks
if an attacker can obtain a wild-card certificate, her capabilities              under the assumption that no intermediate nameservers cache
are significantly extended. For example, if she can receive                      entries longer and that the IP address is released only after
a wild-card certificate for “support.example.com,” she would                     the TTL has expired. Practically, unfortunately, human error
then be able to impersonate, intercept traffic to any sub-domain                 results in domains not always migrating early and intermediate
of “support.example.com,” and even launch sub-domain related                     nameservers might ignore the TTL. Therefore, even those
attacks at the main domain “example.com” [36]. Although, cur-                    domains migrating early can be at risk of temporary domain
rently, wild-card certificates are not supported by free domain-                 takeovers.
validated certificate authorities, like Let’s Encrypt or StartCom,
at least Let’s Encrypt is planning to support them as early                          From a security standpoint, the remaining three classes are
as January 2018 [37]. Furthermore, wild-card certificates are                    more worrisome. The easiest case to launch a successful attack
already supported by other mainstream CAs, such as Comodo.                       against is an abandoned domain: the attacker is not rushed by
While they charge a fee, they allow significantly longer validity                the legitimate operator and she can wait until an opportunity
periods of up to 3 years, which can make attacks even more                       arises. Fortunately, it is also the least interesting case for an
disastrous.                                                                      attacker because users are not expected to contact the service
                                                                                 at the domain regularly anymore but only sporadically (e.g.,
                                                                                 through an outdated bookmark for a website), thus, the number
B. Taxonomy
                                                                                 of potential victims is generally low.
     For a precise classification of how IP address use-after-free
vulnerabilities are being rendered possible, we distinguish four                     For domains that migrate with delay, the window of op-
different cases in which a domain points to a free IP address                    portunity to validate ownership of a domain is fixed in time
(i.e., the domain is stale) through the following taxonomy:1                     and often short. While an attacker could miss the window,
                                                                                 she can lurk and wait for a target domain migrating with
Early Migration.                                                                 delay by repeatedly trying to allocate the target IP address,
  A domain-IP mapping is migrating early if the domain is                        which we later show is practical (see Section III-C). More
  in use by the operator, and the records at the authoritative                   important, once the window of opportunity has passed, the
  nameserver have been updated to point to the new IP                            successfully validated domain is not useless to the attacker
  address before the old IP address is being released and                        even though she has no control over the host with the IP
  available for others to request and use.                                       address behind the domain-IP mapping anymore (it is now a
                                                                                 new IP address, which is not under the attacker’s control). For
Delayed Migration.                                                               example, in case of domain-validated SSL certificates, once
  Similarly, a domain-IP mapping is migrating with delay if                      an attacker validated that she owns the domain, she can later
  the domain is in use by the operator, and the records at the                   leverage the obtained certificate for man-in-the-middle attacks,
  authoritative nameserver have not been updated yet, i.e.,                      e.g., for a wireless network at a coffee shop, because the
  they point to a released IP address.                                           certificate is trusted by major operating systems and browsers.
                                                                                 Here, the number of victims is larger than in the case of
Auxiliary.                                                                       abandoned domains, but seldom substantial. The core problem
  Differently, a domain-IP mapping is auxiliary if the domain                    with domain-IP mappings that are migrated with delay lies in
  is used by the operator, and the domain has multiple records,                  the long-term capabilities granted to the attacker.
  which point to both current and old IP address, possibly in a
  way so that the old and free IP address would only be used                         Auxiliary domain-IP mappings are the most troublesome
  as in a fail-over scenario and has otherwise no practical                      case: they provide a constant window of opportunity and can
  impact.                                                                        cause the most havoc. First, an attacker can remain stealthy
                                                                                 as a “fail-over” until a viable opportunity arises. During
Abandoned.                                                                       normal operation, the attacker’s machine does not respond or
  We define a domain-IP mapping as abandoned if the domain                       it redirects all traffic to a legitimate host. Second, an attacker
  is not used legitimately anymore. For example, a company                       can force a fail-over to the IP address under his control
  might become defunct and is not operating the service                          by launching a denial of service (DoS) attack against the
  anymore that was previously offered at the domain, but it                      legitimate hosts. However, even without forcing a fail-over, an
  retains ownership of the domain until its expiration.                          attacker will see a subset of traffic due to implicit round-robin
   1 Our study focuses on SSL certificates, web servers, domain validation       in DNS, which occurs because DNS records have no implied
through HTTP, and type A DNS records. However, our findings also apply to        order. Upon forcing fail-over, the attacker forces a domain-
other record types, e.g., MX or NS.                                              validation service to connect to the host under the control of

                                                                             5
the attacker, as no other hosts are responsive. Correspondingly,             The natural pattern we expect for the churn plots is an
without forcing a fail-over, the attacker might need to try             initially high share of new addresses while the pool is being
multiple times until the domain-validation service connects             initially explored. This pattern should then slowly approach a
to the address under her control and, in turn, validates her            stable socket, which corresponds to those addresses that are
ownership of the domain. The attacker can verify ownership              handed back to the pool by other tenants. Indeed, we find this
of the domain successfully in both cases, e.g., to request a            pattern in our data. For example, Figure 2(a) and 2(g) show
certificate, and a significant number of users will connect to          this expected pattern. However, these zones have a relatively
the attacker’s machine (all or a subset due to DNS’ round-              large pool of addresses that is free at any given time. Zones
robin). Overall, auxiliary domain-IP mappings can affect the            like eu-west-2 (see Figure 2(i)) are significantly smaller, hence
most victims and it can provide ample opportunity to cause              converge more quickly. This furthermore underlines that the
harm, e.g., to visitors of a website by injecting malicious code.       allocation algorithm must, in some form, iterate through the
                                                                        whole pool of addresses, instead of just allocating the (same)
    After we classified the reasons for why IP address use-             first free addresses.
after-free vulnerabilities exist and what their impact can be,
the immediate next question becomes: can an attacker actually               In addition, we also find a couple of interesting events:
exploit these vulnerabilities in practice, by allocating the same       Zone ap-southeast-2 (see Figure 2(e)) started off similar to eu-
IP address the victim has freed?                                        west-2. However, at the beginning of week 20 in 2017, a large
                                                                        batch of free addresses was added to the pool, leading to a
                                                                        “restart” of the churn pattern. In eu-west-1 (see Figure 2(i))
C. IP Address Churn                                                     and us-east-1 (see Figure 2(k)) we see the effect if several
    An attacker can successfully exploit an IP address use-after-       days of not iterating through the pool: As soon as we restart
free vulnerability in practice if she can get a cloud provider          our allocation script, we observe a slight rise in new addresses,
to assign the recently freed IP address to herself within the           which have accumulated during the time we did not perform
window of opportunity. Following, we determine whether it               measurements. We find the last notable pattern in us-west-2
is practical for Amazon Web Services (AWS) and Microsoft                (see Figure 2(n)). Here, a substantial amount of so far unseen
Azure, the two largest cloud providers today [39].                      addresses is released to the pool in the middle of each week.

    Specifically, we repeatedly allocate and free IP addresses              Next, we take a look on how long it takes to iterate through
in succession. To prevent starvation, we are using a slow               the whole pool, i.e., how fast an attacker could obtain a specific
allocation cycle to not interfere with the clouds’ operations:          address. For this, we look at how much time passes on average,
We request 5 IP addresses per region, freeing them imme-                until an address is allocated for the second time. Given our
diately, and then sleeping for 10 seconds, i.e., effectively            earlier observation that we do indeed circle through the IP
allocating 1 IP address every 2 seconds. We performed our               pool, we expect the mean to correspond to the point where we
IP address churn experiment from April 29, 2017 01:03 UTC               iterated through the IP address pool. This is summarized with
to June 6, 2017 23:27 UTC spanning all regions of the cloud             boxplots (without outliers) in Figure 1. We find that with our
providers at the time for a total cost of $31.06 (USD). Over            ethically restricted approach most pools are exhausted within
the course of our measurements, we cycled through a total of            under a day. Only the largest, like eu-west-1 and us-east-1
14,159,705 allocations of 1,613,082 unique IP addresses. As             reach means significantly over a day.
we always first released addresses before allocating the next               Although we used a slow allocation cycle to not interfere
batch, we cannot cause address starvation. This is highlighted          with the clouds’ operations, an attacker is not bound by the
by us always receiving an IP address upon issuing an API                same ethical standard. Practically, the attacker will be bound
request.                                                                only by the response time of the IP address allocation API
                                                                        endpoint and her network latency to it. Therefore, an attacker
    The success of our technique depends on how fast we can
                                                                        can cycle through available IP addresses much more rapidly.
iterate through the pool of free IPv4 addresses for a given
                                                                        In fact, considering the AWS API limit (10,000 requests per
availability zone. This depends on the overall size of the
                                                                        second [40]) and the number of requests needed to exhaust
pool, and its variance, i.e., how fast addresses are allocated
                                                                        pools in our experiments, an attacker would only need between
by other users. To illustrate these characteristics for each
                                                                        two and 61 seconds to acquire a target IP once the victim has
availability zone, we investigate the churn (see Figure 2) and
                                                                        freed it, using a rapid allocation cycle of 5,000 IP allocations
time between allocation of the same address (see Figure 1).
                                                                        per second. In practice, this theoretical limit is not necessary
We show only AWS specific plots in the pursuit of brevity
                                                                        for an attacker to launch a successful attack. For example, DNS
and comprehensibility, as Azure is not behaving significantly
                                                                        cache times are almost always 5 minutes, and often much
different.
                                                                        longer with 60 minutes to multiple hours, thus, allowing an
    Using the churn plots in Figure 2, we get an overview               attacker to be successful by exploiting caching effects with
of change in the IaaS cloud’s IP pools. Figure 2 shows the              rates of less than 50 IP address allocations per second.
churn in allocated addresses for AWS, i.e., for each day
we allocated addresses we plot the fraction of addresses we             D. Affected Domain Names
previously allocated and the fraction of addresses we did not
previously receive as an allocation. Dates without data relate              Considering the worrying high-rate of IP address churn
to dates where either the IaaS provider conducted maintenance           for major cloud providers and low opportunity cost for an
operations, or our measurement scripts were not yet running             attacker to launch an attack, the only question that remains
for that zone.                                                          unanswered before we can determine whether temporary stale

                                                                    6
                                                                                                                                                                     If the domain points to a cloud IP, we test if the IP address
                                          2weeks
  Time Between Reoccurence (Seconds)log


                                           1week                                                                                                                     is responsive and whether it might be free and available to
                                            1day
                                                                                                                                                                     others. If it does not point to a cloud provider or does not
                                                                                                                                                                     exist anymore, we do not perform any further tests.
                                           1hour
                                                                                                                                                                  2) We test if the IP address responds to ICMP ping requests,
                                                                                                                                                                     or responds to any packet sent on 36 of the most frequently
                                            1min                                                                                                                     used TCP and UDP ports (see Table I) [43] within a two
                                           10sec
                                                                                                                                                                     seconds timeout.5 If we receive a response to any of our
                                                   ap   a      a   a    a        ca               eu eu eu            sa            us   u    u    u
                                                     -no p-no p-so p-so p-so         -ce            -ce -w -w            -ea          -ea s-ea s-w s-w               requests, we mark the IP address as online and allocated.
                                                        r th r th uth uth uth            ntr           ntr est est           st-         st- st- est est
                                                            ea ea -1      ea ea             al-           al- -1   -2           1           1   2    -1  -2
                                                              st- st-       st- st-             1            1
                                                                 1    2        1    2                                                                                Correspondingly, if we receive no response until the timeout
                                                                                          Availability Zone
                                                                                                                                                                     is reached, we mark the IP address as offline and freed.
Figure 1: Time passed between allocations of the same IP address to us.
                                                                                                                                                                  Naturally, ingress firewall rules could prevent our test from
                                                                                                                                                                  succeeding and, thus, our estimation is an upper-bound. One
domains pointing to readily available IP addresses are a                                                                                                          might expect it to be a gross over-approximation because cloud
problem in practice is whether a significant number of domains                                                                                                    virtual machines instances have traditionally received public IP
are affected?                                                                                                                                                     addresses. Nowadays, however, this is not necessarily the case:
                                                                                                                                                                  cloud instances that do not need a public IP address can and
    For a better understanding of how many domains are                                                                                                            generally do live in cloud-only internal networks. Furthermore,
affected by IP address churn, we observe DNS traffic through                                                                                                      by default, many machines respond to ICMP ping requests
Farsight’s passive DNS measurements [41]. The Farsight pas-                                                                                                       or allow for secure shell (SSH) access via TCP on port 22.
sive DNS dataset is provided through a continuous datafeed.                                                                                                       Additionally, a public IP address associated with an instance
For our collection and DNS data analysis, we follow es-                                                                                                           is freed and can be reused by others if the instance is shutdown,
tablished best practices for collecting and handling Internet                                                                                                     even if it is later powered on again (it receives a new IP
measurement data [42], we anonymize all incoming data                                                                                                             address at this point). In turn, it means that we only misclassify
immediately by removing any resolver information, and we                                                                                                          machines as offline with heavy ingress filtering that do not
only retain successful DNS responses.                                                                                                                             provide a service on the top 36 ports (see Table I), and which
    Specifically, we collect all DNS responses containing A                                                                                                       have not been migrated to an internal network yet, which is
records pointing to the Amazon Web Services (AWS) EC2                                                                                                             becoming scarcer. Therefore, although our estimate remains an
cloud, the Microsoft Azure cloud, and the Digital Ocean cloud                                                                                                     upper-bound, we are confident that it is a close estimate.
spanning exactly 120 days from April 11, 2017 0:00 UTC
to August 9, 2017 0:00 UTC. Overall, we extract and ana-                                                                                                              Over the course of our measurements, we classify 702,180
lyze 130,274,722 unique domains with 767,108,850 unique                                                                                                           unique domains (0.539%) as pointing to available and freed IP
domain-IP mappings, counting also sub-domains. Including                                                                                                          addresses. Therefore, these domains, most likely, have been
sub-domains is important for completeness, however, it makes                                                                                                      vulnerable to a (temporary) domain takeover attack at some
an accurate comparison to top domain lists (e.g., Alexa), to                                                                                                      point in time. In fact, while the majority of domains migrated
estimate the domains’ popularity, difficult, because they do not                                                                                                  delayed (80.31%), a non-negligible amount of domain-IP map-
include sub-domains. Matching at the second-level of a domain                                                                                                     pings are abandoned (17.24%) and, fortunately, only a small
is similarly problematic due to potentially over-estimating the                                                                                                   number of domain-IP mappings are auxiliary (2.45%). Note
impact of ephemeral sub-domains and the loss of information                                                                                                       that we only determine that the domain could be taken over,
on sub-domains of special second-level domains, such as .ac.nz                                                                                                    but its prior purpose remains unknown. Further investigation
or .co.uk. It remains for future work to evaluate the distribution                                                                                                by future work is required to determine how many of the
of DNS zone staleness in regard to domain popularity.                                                                                                             vulnerable domains have been actively used in the past and
                                                                                                                                                                  what the impact of an attack on them would be, e.g., on a
    We perform our evaluation on a Kubernetes cluster com-                                                                                                        website that is protected through HTTPS and requires a SSL
prised of 656 processor cores and 3,020 GiB memory, and                                                                                                           certificate, or a domain that is used to load remote code for a
which is connected at a dedicated 10 Gbps Internet up-                                                                                                            mobile application (see Section III-A). Although the amount
link.2 For each domain, we test every six hours3 from June                                                                                                        of vulnerable domains appears small relatively speaking, in
10, 2017 0:00 UTC to August 9, 2017 0:00 UTC (60 days)                                                                                                            absolute terms, the number of stale domains is quite large.
whether the IP address is still in use or if it might be freed                                                                                                    Additionally, due to the nature of our dataset, we only observe
and available:                                                                                                                                                    domains that are actively being attempted to be accessed: the
                                                                                                                                                                  estimated number of cases that might be vulnerable to domain
1) We resolve the domain and check if the IP address the                                                                                                          takeover attacks and could be abused for phishing or scams, but
   domain points belongs to a network of a cloud provider.4                                                                                                       which were not being accessed during our observation period,
   2 The cluster is on a network separated from the main network of the
                                                                                                                                                                  might be significantly larger.
institution at which the experiments are performed. The network traffic
generated for our evaluation is not subject to packet introspection, which would                                                                                     5 We chose a two seconds timeout after we experimented with higher
have had a negative impact on our measurements.                                                                                                                   timeouts of five to ten seconds and did not notice any difference in results. A
   3 Some tests were up to twelve hours apart because of scheduling delay.
                                                                                                                                                                  shorter timeouf of one second resulted in a high misclassification rate due to
   4 We exclude networks of cloud providers that are used for services other                                                                                      network and system load. The cut-off for no misclassifications was close to
than cloud virtual machine instances, e.g., Load-Balancing-as-a-Service.                                                                                          1.4 seconds in our tests. Out of carefulness, we chose a two second timeout.


                                                                                                                                                              7
           8     9     0  1  2  3           8  9  0  1  2  3                     8  9  0  1  2   3              8     9  0  1  2   3            8     9  0  1  2   3            8     9  0  1  2   3           8     9  0  1  2   3
   100




                                    100




                                                                         100




                                                                                                        100




                                                                                                                                        100




                                                                                                                                                                        100




                                                                                                                                                                                                       100
         w1    w1    w2 w2 w2 w2          w1 w1 w2 w2 w2 w2                    w1 w1 w2 w2 w2 w2              w1    w1 w2 w2 w2 w2            w1    w1 w2 w2 w2 w2            w1    w1 w2 w2 w2 w2           w1    w1 w2 w2 w2 w2
   %




                                    %




                                                                         %




                                                                                                        %




                                                                                                                                        %




                                                                                                                                                                        %




                                                                                                                                                                                                       %
   0




                                    0




                                                                         0




                                                                                                        0




                                                                                                                                        0




                                                                                                                                                                        0




                                                                                                                                                                                                       0
                     Days                      Days                                    Days                            Days                           Days                            Days                           Days
                                                                             week 18          week 19    week 20              week 21   week 22             week 23
   (a) ap-northeast-1               (b) ap-northeast-2 100% (c) ap-south-1                              (d) ap-southeast-1              (e) ap-southeast-2               (f) ca-central-1               (g) eu-central-1
                                                                       80%
           8     9     0  1  2  3           8  9  0  1  2  3                     8  9  0  1  2   3              8     9  0  1  2   3            8     9  0  1  2   3            8     9  0  1  2   3           8     9  0  1  2   3
   100




                                    100




                                                                         100




                                                                                                        100




                                                                                                                                        100




                                                                                                                                                                        100




                                                                                                                                                                                                       100
         w1    w1    w2 w2 w2 w2          w1 w1 w2 w2 w2 w2                    w1 w1 w2 w2 w2 w2              w1    w1 w2 w2 w2 w2            w1    w1 w2 w2 w2 w2            w1    w1 w2 w2 w2 w2           w1    w1 w2 w2 w2 w2




                                                           Churn (%)
                                                                       60%

                                                                       40%
   %




                                    %




                                                                         %




                                                                                                        %




                                                                                                                                        %




                                                                                                                                                                        %




                                                                                                                                                                                                       %
                                                                       20%

                                                                        0%
   0




                                    0




                                                                         2017-04-290




                                                                         2017-05-140




                                                                         2017-05-280




                                                                                                                                                                        0




                                                                                                                                                                                                       0
                     Days                      Days                                    Days                            Days                           Days                            Days                           Days


                                                                         2017-04-30
                                                                         2017-05-01
                                                                         2017-05-02
                                                                         2017-05-03
                                                                         2017-05-04
                                                                         2017-05-05
                                                                         2017-05-06
                                                                         2017-05-07
                                                                         2017-05-08
                                                                         2017-05-09
                                                                         2017-05-10
                                                                         2017-05-11
                                                                         2017-05-12
                                                                         2017-05-13

                                                                         2017-05-15
                                                                         2017-05-16
                                                                         2017-05-17
                                                                         2017-05-18
                                                                         2017-05-19
                                                                         2017-05-20
                                                                         2017-05-21
                                                                         2017-05-22
                                                                         2017-05-23
                                                                         2017-05-24
                                                                         2017-05-25
                                                                         2017-05-26
                                                                         2017-05-27

                                                                         2017-05-29
                                                                         2017-05-30
                                                                         2017-05-31
                                                                         2017-06-01
                                                                         2017-06-02
                                                                         2017-06-03
                                                                         2017-06-04
                                                                         2017-06-05
                                                                         2017-06-06
       (h) eu-west-1                      (i) eu-west-2                        (j) sa-east-1                  (k) us-east-1                   (l) us-east-2               (m) us-west-1                      (n) us-west-2
                                                                                                                    Days (UTC)

                                                                                                 New                Reoccurent          No Data


     Figure 2: IP address churn on the Amazon Web Services (AWS) EC2 cloud, i.e., share of newly-observed IP addresses per day per region.


Protocol (Common)                            TCP                       UDP                         Port(s) ▲                 published to certificate transparency logs, we revoke it, and
FTP                                            3                       3                              21                     publish the revocation to Let’s Encrypt. The time until these
SSH                                            3                       3                 22, 2222, 22022                     actions appear in CT logs serves as an indication of the time
Telnet                                         3                       3                              23                     that passes before the legitimate owner would be able to notice
SMTP                                           3                       3                         25, 587                     the attack by monitoring CT logs.
WHOIS                                          3                                                      43
DNS                                            3                       3                              53                         For our experiment, we gained temporary control over
HTTP                                           3                                          80, 8000, 8080
Kerberos                                       3                       3                              88                     the domain “cloudstrife.seclab.cs.ucsb.edu” by attempting to
POP3                                           3                       3                             110                     re-allocate the IP address to which the domain points to
IMAP                                           3                       3                             143                     (34.215.255.68). Note, that the IP address is located in the
LDAP                                           3                       3                             389                     availability zone us-west-2, which has a high churn that
HTTP (Secure)                                  3                                               443, 8443
SMTP (Secure)                                  3                       3                             465
                                                                                                                             makes takeover attackers more difficult. While this may seem
LDAP (Secure)                                  3                       3                             636                     contradictory, as a high churn means that an attacker can
Telnet (Secure)                                3                       3                             992                     allocate more addresses per time-unit, a high churn also
IMAP (Secure)                                  3                       3                             993                     indicates a larger IP address pool. Ultimately, we were able
POP3 (Secure)                                  3                       3                             995                     to successfully re-allocate the IP address within 27 minutes
MS SQL                                         3                       3                            1433
CPanel                                         3                                                    2082                     and 55 seconds with a slow allocation cycle of 2 IP addresses
CPanel (Secure)                                3                                                    2083                     per second (see Section III-C). While anecdotal, it serves as
CPanel WHM                                     3                                                    2086                     an estimate of the time needed to launch an attack successfully
CPanel WHM (Secure)                            3                                                    2087                     under unfavorable conditions for an attacker (high churn, low
MySQL                                          3                       3                            3306
2Wire RPC                                      3                       3                            3479
                                                                                                                             allocation rate). We requested a SSL certificate from Let’s
Virtuosso                                      3                                                    4643                     Encrypt, it appeared in different certificate transparency logs
Postgres                                       3                       3                            5432                     between 34 minutes and 61 minutes later, and we revoked the
CWMP                                           3                       3                            7547                     certificate immediately after certificate transparency log entries
Plesk                                          3                                                    8087                     had been propagated. Our certificate request was published at
Webmin                                         3                                                   10000
ENSIM                                          3                                                   19638                     the “crt” web-interface under id 250959196; it can be viewed at
                                                                                                                             https://crt.sh/?id=250959196. The certificate that we obtained
  Table I: Ports and protocols used for IP address liveness checking.                                                        from Let’s Encrypt and a message signed by the respective
                                                                                                                             private key is contained in Appendix A.
E. Proof of Concept Domain Takeover                                                                                              Although the incorrect migration of domain-IP mappings
                                                                                                                             is comparatively small on a relative scale, we believe that the
    Finally, we show the practicality of domain takeover attacks                                                             absolute numbers speak volumes paired with the practicality
through a proof of concept certificate request to Let’s Encrypt.                                                             of takeovers. Together, they justify looking closer at mitigating
Certainly, we face the largest ethical challenges with this                                                                  IP address use-after-free at its core, however, with a strong
experiment, as disrupting or having any impact on legitimate                                                                 requirement to incur as little additional overhead on usability
users raises ethical concerns. For example, it is impossible                                                                 or performance as possible.
to guarantee that we do not interfere with any third party
operation that might rely on the domain, or that we do not                                                                                                        IV.    M ITIGATION
accidentally receive Personally Identifiable Information (PII)
or other confidential data. Therefore, we perform a domain                                                                       In this paper, we address the issue of IP re-use attacks abus-
takeover attack for a domain under our control. After obtaining                                                              ing stale DNS records, particular for IP addresses belonging
the certificate from Let’s Encrypt and verifing that it has been                                                             to cloud networks, a topic that has received little attention so

                                                                                                                        8
far. To be more specific, we investigate IP address use-after-            2) A certificate for the domain has been requested in the past,
free vulnerabilities, which can pose severe security threats, and            and the domain still points to the same IP address.
which can be made even more dangerous through domain-                     3) A certificate for the domain has been requested in the past,
validated SSL certificates (see Section III). Current automated              but the domain now points to a different IP address.
domain-validation-based certificate issuance systems are also             4) A certificate for the domain has been requested in the past,
threatened to be exploited through man-in-the-middle attacks                 but it was verified in a more strict manner, possibly using
discussed by Gavrichenkov et al. [44]. Existing defenses rely                extended validation (EV).
on certificate revocation, which is severely fragmented and
cannot be relied on in practice [45, 46]. It became only recently         The first case is relatively frequent, and it is indistinguishable
more tractable, e.g., through CRLite [47], but these solutions            from the legitimate first use of domain-validated certificate
have not been adopted yet. One core problem is that revocation            issuance, which it is impossible to protect against without
checks in browsers are not comprehensive: Chrome generally                extended validation, which is itself often deemed too costly
does not verify revocations, its CRLSet is limited to emergency           or impractical. We also acknowledge that an attacker who has
revocations by design [48], and Mozilla’s Firefox similarly               compromised the system to which this domain points to will,
limits revocation checks through OneCRL to CA intermediate                in any case, be able to issue a new certificate for the domain,
certificates [49]. Certificate revocations in other software and          or steal the existing one.6 Hence, a full system compromise
libraries, which rely on the same certificate issuance processes          is outside of the scope of our work. What our mitigation
and would also be required to adopt the new revocation checks,            technique has to ensure is that a domain-validated certificate
are rarely checked in practice [50]. Furthermore, revocations             is only issued if the CA can verify that there has been no
are reactive by nature and they provide a window of oppor-                non-cooperative change of authority over either the system the
tunity to an attacker by design: the time until the revocation            domain points to or DNS zone for the domain.
has propagated plus the time until the attacker’s certificate has
been revoked by the issuing CA on request of the legitimate                   Concerning our threat model, the attacker does not control
party, the latter of which is generally a manual process as               a trusted CA, and she has average resources and skills, i.e.,
additional verification is required. We believe that the first line       she is not a state-level actor and cannot expend significant
of defense should be with domain-validation-based CAs and                 resources for a successful attack. Her overall objective is to
it should be preventive. Therefore, we propose an additional              obtain a domain-validated SSL certificate for a target domain
layer of protection for domain-validation-based CAs, such as              that already uses a valid SSL certificate issued by a third
Let’s Encrypt, that can efficiently and with negligible overhead          party CA. However, she has no administrative access to the
prevent these attacks. Our mitigation technique builds on the             machine that the target domain currently points to, she cannot
ACME protocol version 2 [51] and it is complimentary to the               steal the current certificate or factors its keys in a reasonable
certificate transparency framework [26].                                  amount of time, but, instead, she must request a new certificate.
                                                                          Taken into account the current operational model for domain-
                                                                          validating CAs, to achieve her goal, the attacker can: (a)
A. General Concept and Threat Model
                                                                          obtain access to an IP address to which a stale A record for
    The underlying problem of IP address re-use attacks is                the domain points to, (b) perform a man-in-the-middle attack
that a domain-validated certificate can be requested as soon as           somewhere on the path between the issuing CA and the system
an attacker controls the IP address to which a domain points              to which the target domain points to, or, (c) illegitimately take
to, and that requesting and receiving a trusted certificate is            over authority over the DNS zone for some amount of time.
fully automatic and only a matter of seconds nowadays. An
attacker might be able to obtain the IP address legitimately,             B. Pre-Signature Certificate Consistency Checks
because the domain record was left stale. To obtain a certificate,
she might also be able to perform man-in-the-middle attacks                   To ensure that an attacker within our threat model cannot
between the authenticating CA and the target system. A similar            request a new certificate, we must ensure that she cannot
issue occurs, if she can (temporarily) compromise the DNS                 show that there has been a cooperative change for: (a) the IP
(delegation or authoritative servers) for a domain. Then, she             address to which the domain points to, or (b) the DNS zone of
can simply change the IP address a record points to, as well as           the domain. One way to accomplish this task is by requiring
potential CAA or DANE TLSA records [52, 53]. Technically,                 each subsequent certificate request for a domain for which a
attacks involving DNS-based attacks should be prevented by                certificate has been issued in the past by trusted CA, or which
DNSSEC [19]. However, if key signing is performed online                  was covered by a similarly issued wild-card certificate, to be
on the authoritative servers itself (against DNSSEC best prac-            signed with a pre-existing certificate.
tices) [54], and she compromises one of these servers, then
she regains full control over the domain. Although, domain                    1) Pre-Signed Domains: A challenge for a CA receiving a
takeovers rarely tend to last for extended periods of time, SSL           domain-validation certificate request is to determine whether
certificate for the domain can later be used by the attacker              a SSL certificate has been issued to this domain in the past,
until the certificate’s expiration date, possibly involving other         either by itself, or possibly by another trusted CA.
man-in-the-middle attacks.                                                Fortunately, two approaches to implement these requirements
For all certificate requests that a CA receives, one of the               exist that are viable:
following four cases applies:                                               6 Certificate theft can be protected through hardware security modules and
                                                                          may further become a commodity through methods like Intel SGX or ARM’s
1) No certificate has been requested for this domain in the               TrustZone, which can be used to entrench certificate handling in a secured
   past.                                                                  enclave.


                                                                      9
Federated Approach.                                                        happen if we naïvely sign a challenge response with a key, for
  In case of the federated approach, each trusted CA is re-                which the respective certificate was issued for handling TLS
  quired to publish its issued certificates in multiple certificate        server connections. Fortunately for us, retrieving the challenge
  transparency logs, which do not need to be run by the CA                 response through over HTTPS eliminates the problem, and
  itself [26]. This approach has the strong advantage that it              verifying the used certificate satisfies all requirements we put
  utilizes established technology, meaning that the required               forth in the previous sections.
  functionality is readily available and no additional service
                                                                           Our challenge works as follows (see Figure 3):
  needs to be deployed and managed. Although certificate
  transparency logs are not yet required for every CA or                   Ê The client sends a certificate request for her domain, e.g.,
  every certificate, and not all CAs are publishing certificate              “example.com,” to a domain-validating ACME CA.
  logs, Google Chrome is already requiring CT logs to some
  certificates: for all certificates issued by Symantec, WoSign,           Ë The CA checks whether a certificate for the domain “exam-
  and StartCom, as well as for all extended validation cer-                  ple.com” exists, i.e., that one has been issued by a trusted
  tificates (since January 2015). Furthermore, enforcing the                 CA in the past. The CA is free to include expired certificates
  requirement for all trusted CAs is expected within the next                in the check or ignore them according to an agreed-on
  years [55]. Thus, expected development and policy changes                  policy (see Section IV-D).
  would further empower this approach.
                                                                           Ì The CA issues a challenge to the client, which she needs
  From an algorithmic point of view, a naïve existence check                 to fulfill to validate ownership of the domain. If a prior
  requires lookups for each trusted CA in an aggregated                      certificate exists, the CA sends two challenges: first, our
  database. Fortunately, by leveraging CAA records via DNS                   challenge, which is similar to the original HTTP challenge,
  combined with DNSSEC, one can limit lookups to a small                     and which includes a token to be hosted at a specified
  set of CAs, e.g., only one or two CAs. Specifically, it is                 path at the domain of the requested certificate, and, second,
  more likely that one of the authorized CAs has issued a                    a challenge that is considered more trustworthy than the
  certificate for the domain in the past. Once a previously                  HTTP challenge, such as a whois-based challenge or a DNS-
  issued certificate has been found that is still valid, then the            based challenge. Following the ACMEv2 RFC, a client
  search can be terminated early, which reduces lookup time.                 needs to satisfy only one of the two challenges. If she
  Additionally, CAA records have become mandatory to be                      fails our challenge, which might happen in some cases
  honored by CAs in September 2017 [56]. Therefore, due                      (see Section IV-D), the more trustworthy challenge must
  to the increasing adoption and availability of CT and CAA,                 be completed. For more details on how challenges are
  we consider this approach the most practical and promising                 implemented, we refer to Section 8 “Identifier Validation
  one.                                                                       Challenges”’of the ACME v2 RFC. Alternatively, if no prior
Centralized Approach.                                                        certificate exists, the CA is free to send any challenges as
  Alternatively, a centralized approach is possible. Here, a                 defined by the RFC.
  single authority, possibly IANA, would provide an oracle                 Í Once the client receives our challenge, she will host the
  service. The service would return a boolean answer when                    nonce from it at the URL specified by the challenge to
  queried, confirming whether any CA ever issued a certificate               serve as the verification resource.
  for a specified domain. Before issuing a new certificate,
  CAs would have to check if a certificate has been issued                 Î The CA will attempt to access the verification resource,
  in the past. Furthermore, they must notify the authority                   and, in turn, verify that the challenge has been completed
  of newly issued certificates. Unfortunately, the centralized               by the client. Verification requires that the nonce has been
  approach bears potential trust issues and poses a single point             placed at the resource, as well as that the HTTPS response
  of failure.                                                                is signed with the private key for a certificate of the domain
                                                                             that was previously issued by a trusted CA (see certificate
                                                                             existence check; Ë).
C. Domain Takeover Resistant Identifier Validation Challenge
    Next, we develop a practical identifier validation challenge           D. Failure Cases
that is resistant to domain takeover attacks. Specifically, we
                                                                               There exist some possible failure scenarios of our chal-
target the ACME protocol, which is used by Let’s Encrypt and
                                                                           lenge, which must be handled gracefully to preserve security of
others to automate the process of issuing certificates. To do so,
                                                                           domain validation. However, the simple failure of the process
we introduce an additional challenge to the ACMEv2 RFC [51].
                                                                           does not (yet) indicate an attack. Furthermore, as soon as a
No other changes to the RFC are necessary. In turn, it allows
                                                                           failure has been resolved, the above process can be used to
our validation challenge to be minimally invasive to the proto-
                                                                           regularly renew certificates automatically because the HTTPS
col and its subsequent implementations, yet, at the same time,
                                                                           challenge will not fail again for the same reason.
it significantly improves security by mitigating the attacks
that we present in this paper. The core idea of our proposed                   1) Lost Access to Old Certificate or Private Key: Among
challenge is to leverage existing certificates to form a chain of          the most likely non-malicious scenarios for failure is the case
trust. Implementing a solution that uses existing certificates to          of an operator who has lost access to her prior certificate or
sign responses to identification validation challenges triggers            private key. Here, the HTTPS response cannot be signed and
various issues with the handling of key material. For example,             the challenge will fail. From a security standpoint, this case
private keys should not be used outside of the context for                 must be treated like a potential attack by the CA because it
which their respective certificate has been issued, which would            is impossible to automatically distinguish between a legitimate

                                                                      10
                                           1    Request certificate                                             Check for existing
                                                                                                            2
                                                                                                                certificates

                                         3 Respond with challenge
                                                                                            d                                         CT
  Client    4    Hos                                                                    e an
                at h t challe                                                a l l eng ate      ACME                                 Logs
                                                                            h
                    ttps      n
                         ://e ge                                       fy c         rtific       CA
                             xam                                   Veri ting ce
                                 ple.c                           5 exis
                                      om



                                               example.com
                                                Webserver

                                     Figure 3: Certificate request process that mitigates domain takeover attacks.


lost key, and an attacker not having access to the key in the first            often automatically. Considering prior work (see Section V)
place. Instead, the operator should use a DNS-based challenge                  and the attacks that we present in this paper, a large portion
or whois-based challenge. Note that no additional certificate                  of attacks are time critical. Therefore, the first aspect in the
request is required, but the same certificate request will be used.            process of resolving a potential attack should be time. By
In fact, instead of issuing the certificate, first, a prompt that              increasing the time requirement, we increase the likelihood of
additional verification is needed will be shown to the operator,               the enabling attack to be detected. Nonetheless, potential for
and once she passes the additional challenge (sent along with                  stale DNS attacks remains. Yet, we can approach this issue
the first challenge; Ì), only then the certificate will be issued.             by designing an extended process for validating ownership
                                                                               of a domain and the correct delegation to an IP address.
    2) Expired Certificate: Another common case in which the                   Unsurprisingly, CAs already commonly offer such extended
HTTPS challenge might fail are expired certificates. Operators                 validation processes. In addition, this service could also be
may simply forget to renew their certificates in time, or a                    offered by official institutions or NGOs with a sufficient trust
service may be shut down for a longer period, preventing                       level and the resources to do this. The certificates issued in
certificate from being renewed. Whether expired certificates                   this process would not even have to be valid for an extended
should be accepted, and if so, whether their expiration should                 time period. In fact, they can be used as simple seeds to re-
be limited by a grace period, is a policy decision rather than                 initiate the continuous process of retrieving domain validated
a technical decision. Basically, two options exist:                            certificates.
1) Accept an expired certificate.
2) Treat it like an attack.                                                    E. Transitioning Techniques
                                                                                   One of the biggest problems when introducing new tech-
Relaxing the requirement and allowing expired certificates                     nique is the transitioning phase. However, for the adoption of
could increase the usability of our approach. However, relaxing                our challenge, this is not an issue. The certificate ecosystem
requirements for corner cases introduces additional sources for                already makes extensive use of validity periods, generally
potential errors, and thereby, security issues. Ultimately, we err             certificates are set to expire within 1-3 years, and even as early
on the side of caution and default to strong security and treating             as 3 months in case of Let’s Encrypt. If our challenge would
it as an attack, as also recommended by Fiebig et al. [57].                    be adopted, we can also make use of extensive CT logs, which
    3) Legitimate Change of Authority: A third legitimate case                 contain over hundreds of millions of domains already. For
that might fail is a legitimate change of domain ownership,                    domains for which no entry exist in CT logs, we realize that
possibly without the consent of the previous owner. Such cases                 our challenge is based upon “trust on first use” [58]. However,
include but are not limited to seizures because of copyright                   this does not leave domains for which certificates are already
violations, or court orders, or a simple lapse in renewing                     issued with less security than today, but it strictly increases
the domain itself. Again, such a change in ownership cannot                    security. Furthermore, CAs may add domains for which they
be recognized as legitimate by an automated system, simply                     previously signed certificates to certificate transparency logs
because an attack has exactly the same properties. Therefore,                  voluntarily. Therefore, we believe that our system provides a
similar to the lost private key access, the CA fails the HTTPS                 robust and painless transition toward an increase of security
challenge and it requests a second challenge to be completed                   for domain-validated certificates within the diverse certificate
by the client, which any legitimate client can complete easily.                ecosystem.

     4) Possible Attacks: Following our earlier reasoning, at-                 F. Best Practices
tacks are cases in which the requesting client cannot prove
a continuity in authority using previously issued valid cer-                      Beyond directly addressing the root cause of the presented
tificates, which are considered rare, particular as you renew                  problems in the certificate issuing process, we suggest that
certificates in the validity period of your current period, and                cloud providers deploy mitigations as well. These mitigation

                                                                          11
techniques aim to prevent attackers from allocating specific                             severe: it is impossible for users to tell whether they are in fact
addresses, e.g., by rate-limiting IP address allocation and                              being attacked, as domains and IP addresses have residual trust,
release operations, using disjoint sets of IP addresses for                              and any connection might be marked trusted by the browser
different tenants to reduce attack surface, and perhaps even by                          due to domain-validated SSL certificates. Indeed, Zdrnja et al.
monitoring their networks for (non-scanning) inbound traffic                             demonstrated an approach to detect typo-squatting attacks from
to unallocated addresses to warn previous users of those                                 mined DNS data [67]. Different from prior work, our study
addresses.7 Finally, for cloud tenants, we strongly suggest                              focuses on the vulnerabilities of stale DNS records pointing to
keeping old addresses allocated when migrating IP addresses,                             cloud IP addresses, we conduct comprehensive measurements,
at least until the TTL of the record has expired out, preferably                         and we propose a mitigation to retain the convenience of
until one can be reasonable sure that it is not cached anymore                           domain validation for certificate issuance.
(preferably from a day to a week). Furthermore, we can only
stress the importance of maintaining DNS zones properly and                              B. IP Address Squatting
to remove obsolete records as quickly as possible to not fall
victim to domain takeover attacks.                                                            Taking over IP addresses has been a well-known problem in
                                                                                         security. The most common and well discussed attack method
                          V.    R ELATED W ORK                                           aims to take over entire network prefixes using BGP, which
                                                                                         can be easily observed and will be scrutinized quickly [68].
   We discuss related work, specifically in the areas of cloud                           Wählisch et al. demonstrated a method to detect such takeovers
security, DNS security and measurements, and the security of                             using RPKI [69]. Ballani et al. conducted a study investigating
domain-based certificate and trust validation.                                           prefix hijacking in 2007 [70], while Zhang et al. developed
                                                                                         first defense methods against such attacks [71]. In 2015,
A. DNS Security                                                                          Gavrichenkov demonstrated that modern domain validated SSL
                                                                                         certificates (and thereby HTTPS in general) can be broken
    DNS is a critical service in the Internet ecosystem and prior                        using prefix hijacking [44]. Attackers with more powerful
work has studied DNS security extensively. Bell and Britton                              capabilities on the network path between a client requesting
hold a patent in which they describe how a host can be taken                             a certificate and a CA do not even have to perform prefix
over by assigning the same IP address to a virtual interface                             hijacking, but instead can easily exploit IP address squatting,
on another system [59]. Yadav et al. report on domain-flux                               as they are already on the path. Our work, on the other hand,
practices in botnets, a technique in which a domain generation                           details a new attack vector to conduct IP address squatting,
algorithm is used to generate many domains, of which the                                 which is practical, and time and cost efficient to launch.
operator only needs to control one to remain in control of
her botnet [60]. However, to some degree as the dual of
                                                                                         C. Certificate Validation Security
exploiting stale DNS records, one can register a single or
multiple of those domains to take over a botnet, and it has suc-                             The security threats we studied in this paper tie in with
cessfully been done by Stone et al. [61]. Liu et al. conducted                           modern, domain-based, certificate authorities and their sur-
a study similar to our work [62]. However, methodological                                rounding security challenges. Various efforts currently track
challenges and limitations of their datasets lead them to an                             the adoption of Let’s Encrypt [72, 73]. In general, the se-
under-estimation of the impact of stale DNS records in cloud                             curity implications of domain-based certificate validation are
scenarios. Indeed, contrary to them, we find that the problem                            widely accepted. In their comprehensive analysis of the HTTP-
of stale DNS records is amplified by multiple orders of                                  S/SSL trust ecosystem, Clark et al. [74] place great trust in
magnitude. We further systematically analyze the practicality                            DANE [53], to mitigate this issue. Apart from DANE, Certifi-
of acquiring the previously-used cloud IP addresses, discover                            cate Transparency [26, 27] is considered the ideal mitigation
use-after-free attacks based on DNS caches, and we propose a                             for maliciously and wrongfully obtained certificates and has
usable mitigation technique to automatically validate certificate                        received significant attention recently. The DNS certificate
issuance.                                                                                authority authorization (CAA) record might reduce the impact
                                                                                         of IP use-after-free attacks to some degree [52], as it limits
    Instead of relying on correct DNS responses, bit-squatting
                                                                                         the CAs that are allowed to issue a certificate for a specific
exploits random bit-flips in DNS requests to lure clients to
                                                                                         domain, and, thus, force an attacker to request a certificate
malicious or phishing websites [63]. Different from our attack,
                                                                                         from these CAs. However, our analysis shows that current
bit-squatting relies on integrity errors that occur at random
                                                                                         domain validation in trust ecosystem is susceptible to use-after-
and thus is not as targeted as our attack. Furthermore, exploit-
                                                                                         free attacks regardless of CAA records. In fact, the only way to
ing integrity errors, it can be mitigated easily via hardware
                                                                                         defend against use-after-free attacks through CAA is to restrict
and software, e.g., by adopting DNSSEC and leveraging its
                                                                                         certificate issuance in its entirety, which then raises problems
integrity guarantees. Similar to our technique, typo squatting
                                                                                         when the certificate expires while also relying on automatic
can be used to lure clients on malicious websites [64–66].
                                                                                         certificate renewal setups, such as those recommended by
It remains important to note that in a typo-squatting attack,
                                                                                         Let’s Encrypt, in which case automatic DNS zone updates are
the attacker needs to register a new domain and hope that
                                                                                         required (which become difficult in the presence of DNSSEC).
users visit that domain. For our attack, although the window
                                                                                         Overall, relying on CAA would require numerous compro-
of opportunity might be shorter, the attack is significantly more
                                                                                         mises in terms of certificate lifetime management and DNS
   7 The noise-to-signal ratio might impractical for monitoring because of               zone maintenance, while still providing a potential (small)
Internet-wide scanning efforts, and filtering scanning traffic from other traffic        window of opportunity of an attacker whenever the CAA
might be too costly for a supplemental warning service.                                  record needs to be relaxed to allow certificate renewal. We

                                                                                    12
introduced a mitigation that incorporates existing trust of a              domain owners and cloud users, which can reduce vulnerability
name into the validation process and can protect against these             to the aforementioned attacks.
attacks.
                                                                               Finally, we introduced a new mitigation techniques that
                                                                           addresses the issue of domain takeover attacks for trust-based
D. Cloud Security                                                          domain-validation services, focusing on the real-world case of
    Concurrent with the increasing adopting of cloud services,             automatic certificate issuance. Our mitigation technique pro-
cloud security has drawn more research attention. Chen et al.              tects against IP address use-after-free attacks with negligible
provided a contemporary summary and analysis of cloud se-                  operational overhead and only requires manual intervention in
curity issues [75], and indicated problems of shared resources.            disaster-recovery scenarios, thus, rendering it practical for real-
Similarly, Subashini and Kavitha provided a comprehensive                  world deployment even under strict performance and usability
analysis of security challenges in cloud scenarios [76]. Their             requirements of services like Let’s Encrypt.
analysis of IaaS platforms only includes similar issues to those
approached by Ristenpart et al. [4]. Specifically, Ristenpart et
al. exploit shared resources in IaaS environments to facilitate                                     ACKNOWLEDGEMENTS
cross-VM side-channel attacks. However, they focus on phys-                   We thank the anonymous reviewers for their helpful sug-
ical computing resources and they do not investigate issues                gestions to improve the paper. We also thank David Choffnes
induced by logical resource sharing, e.g., access to the same              and Martina Lindorfer for their valuable feedback.
IP address pool. Jensen et al. focus on classical web attacks,
especially in SaaS (Software-as-a-Service) scenarios [77]. Tak-                This material is based on research sponsored by the De-
abi et al. discuss the overall issue of IP squatting that is               fense Advanced Research Projects Agency (DARPA) under
related to secure handling of provisioning and multi-domain                agreement number FA8750-15-2-0084, the Office of Naval
cloud platforms with shared resource pools [78]. Zhang et al.              Research (ONR) under grant N00014-17-1-2011 and N00014-
investigate access control and trust management in the context             15-1-2948, the National Science Foundation (NSF) under grant
of multi-tentant environments [79]. Our work and mitigation                DGE-1623246 and CNS-1704253, and a Google Security,
approaches are orthogonal to prior cloud security research, and            Privacy and Anti-Abuse Award to Giovanni Vigna.
we focus on the certificate ecosystem vulnerabilities as it is                 The U.S. Government is authorized to reproduce and
being used in combination with cloud services.                             distribute reprints for Governmental purposes notwithstanding
                                                                           any copyright notation thereon.

                      VI.   C ONCLUSION                                        Any views, opinions, findings, recommendations, or conclu-
                                                                           sions contained or expressed herein are those of the authors,
    In this paper, we have shown that it is practical, time-               and do not necessarily reflect the position, official policies, or
efficient, and cost-efficient for an attacker to (temporarily)             endorsements, either expressed or implied, the U.S. Govern-
takeover domains by exploiting so-called IP address use-after-             ment, DARPA, ONR, NSF, or Google.
free vulnerabilities on, currently, the two largest Infrastructure-
as-a-Service clouds (Amazon AWS and Microsoft Azure).                                                      R EFERENCES
    In our study, we discovered that attacks are practical on               [1]   Ingrid Lunden. Amazon’s AWS Is Now A $7.3B Business As It Passes
public clouds because of their instances’ ephemeral nature and                    1M Active Enterprise Customers. Oct. 2015. URL: https://techcrunch.
                                                                                  com/2015/10/07/amazons-aws-is-now-a-7-3b-business-as-it-passes-
the “throw-away culture” of development operations concern-
                                                                                  1m-active-enterprise-customers/.
ing immutable instances and service migration. In turn, it is not           [2]   Haje Jan Kamps. Microsoft Celebrates Strong Azure Adoption at Build
necessary to takeover the IP address to which a domain points                     2016. Mar. 2016. URL: https : / / techcrunch . com / 2016 / 03 / 31 / azure -
to, but IP address migration occurs regularly and sometimes                       growth/.
is outside of the control of the cloud user (e.g., reboot or                [3]   C. Public. Cisco Global Cloud Index: Forecast and Methodology,
shutdown of the hypervisor because of an update), thus freeing                    20152020. White paper. 2016.
                                                                            [4]   T. Ristenpart, E. Tromer, H. Shacham, and S. Savage. “Hey, You,
the previously assigned IP address and making it available for                    Get Off of My Cloud: Exploring Information Leakage in Third-party
re-use by others. Here, a slightly incorrect DNS domain record                    Compute Clouds”. In: Proc. ACM Conference on Computer and Com-
migration strategy can immediately render domains vulnerable                      munications Security (CCS). 2009.
to IP address use-after-free attacks. In fact, the problem is               [5]   K. Razavi, B. Gras, E. Bosman, B. Preneel, C. Giuffrida, and H. Bos.
even further amplified for so-called “spot” instances, which are                  “Flip Feng Shui: Hammering a Needle in the Software Stack”. In: Proc.
                                                                                  USENIX Security Symposium (SEC). 2016.
significantly cheaper instances, but which can be terminated at             [6]   G. I. Zineb Ait Bahajji. HTTPS as a ranking signal. Aug. 2014. URL:
any point and without notice to the cloud user, and for which                     https : / / webmasters . googleblog . com / 2014 / 08 / https - as - ranking -
he cannot protect himself from temporary domain takeovers.                        signal.html.
                                                                            [7]   K. Basques. Why HTTPS Matters. Sept. 2017. URL: https://developers.
    We have examined the reasons of why and how IP address                        google.com/web/fundamentals/security/encrypt-in-transit/why-https.
re-use domain takeover attacks can occur in practice, and                   [8]   P. Venezia. Code injection: A new low for ISPs. May 2015. URL: http:
we classify them according to what their potential impact                         //www.infoworld.com/article/2925839/net-neutrality/code-injection-
in practice is. Particularly, we investigated their impact on                     new-low-isps.html.
                                                                            [9]   E. Mill. The Web Is Deprecating HTTP And It’s Going To Be Okay. May
domain-validated SSL certificate issuance, such as through
                                                                                  2015. URL: https://motherboard.vice.com/en_us/article/wnjyay/the-
automatic certificate management environments (ACME), e.g.,                       web-is-deprecating-http-and-its-going-to-be-okay.
Let’s Encrypt. Based on our findings, we then developed                    [10]   D. Stenberg. TLS in HTTP/2. Mar. 2015. URL: https://daniel.haxx.se/
best practice recommendations for cloud operators as well as                      blog/2015/03/06/tls-in-http2/.


                                                                      13
[11]   R. Barnes, J. Hoffman-Andrews, and J. Kasten. Automatic Certifi-                            [34]   B. Krebs. FBI: $2.3 Billion Lost to CEO Email Scams. Apr. 2016. URL:
       cate Management Environment (ACME). Internet-Draft draft-ietf-acme-                                https://krebsonsecurity.com/2016/04/fbi- 2- 3- billion- lost- to- ceo-
       acme-latest. Work in Progress. Internet Engineering Task Force, June                               email-scams/.
       2017. URL: https: // ietf- wg- acme.github.io/acme/draft- ietf- acme-                       [35]   S. Hao, K. Borgolte, N. Nikiforakis, G. Stringhini, M. Egele, M.
       acme.html.                                                                                         Eubanks, B. Krebs, and G. Vigna. “Drops for Stuff: An Analysis of
[12]   Josh Aas. Milestone: 100 Million Certificates Issued. June 2017. URL:                              Reshipping Mule Scams”. In: Proc. ACM Conference on Computer and
       https://letsencrypt.org//2017/06/28/hundred-million-certs.html.                                    Communications Security (CCS). Vol. 22. Oct. 2015.
[13]   Dan Cvrcek. Lets Encrypt in the spotlight. June 2017. URL: https://dan.                     [36]   A. Swinnen. Authentication Bypass on Uber’s Single Sign-On via
       enigmabridge.com/lets-encrypt-in-the-spotlight/.                                                   Subdomain Takeover. June 2017. URL: https : / / www . arneswinnen .
[14]   K. Borgolte, C. Kruegel, and G. Vigna. “Meerkat: Detecting Web-                                    net/2017/06/authentication- bypass- on- ubers- sso- via- subdomain-
       site Defacements through Image-based Object Recognition”. In: Proc.                                takeover/.
       USENIX Security Symposium (SEC). Vol. 24. Aug. 2015.                                        [37]   J. Aas. Wildcard Certificates Coming January 2018. July 2017. URL:
[15]   N. Nikiforakis, L. Invernizzi, A. Kapravelos, S. V. Acker, W. Joosen,                              https://letsencrypt.org//2017/07/06/wildcard-certificates-coming-jan-
       C. Kruegel, F. Piessens, and G. Vigna. “You Are What You Include:                                  2018.html.
       Large-scale Evaluation of Remote JavaScript Inclusions”. In: Proc.                          [38]   J. Pang, A. Akella, A. Shaikh, B. Krishnamurthy, and S. Seshan. “On
       ACM Conference on Computer and Communications Security (CCS).                                      the Responsiveness of DNS-based Network Control”. In: Proc. ACM
       2012.                                                                                              Internet Measurement Conference (IMC). 2004.
[16]   D. Kumar, Z. Ma, Z. Durumeric, A. Mirian, J. Mason, J. A. Halderman,                        [39]   C. Coles. AWS vs Azure vs Google Cloud Market Share 2017. URL: https:
       and M. Bailey. “Security Challenges in an Increasingly Tangled Web”.                               //www.skyhighnetworks.com/cloud- security- blog/microsoft- azure-
       In: Proc. World Wide Web Conference. 2017.                                                         closes-iaas-adoption-gap-with-amazon-aws/.
[17]   P. Mockapetris. Domain Names - Implementation and Specification.                            [40]   Amazon Web Services, Inc. Throttle API Requests for Better Through-
       RFC 1035 (Internet Standard). RFC. Updated by RFCs 1101, 1183,                                     put. Aug. 2017. URL: http://docs.aws.amazon.com/apigateway/latest/
       1348, 1876, 1982, 1995, 1996, 2065, 2136, 2181, 2137, 2308, 2535,                                  developerguide/api-gateway-request-throttling.html.
       2673, 2845, 3425, 3658, 4033, 4034, 4035, 4343, 5936, 5966, 6604,                           [41]   Farsight Inc. Farsight - Security Information Exchange (SIE). URL:
       7766. RFC Editor, Nov. 1987. URL: https://www.rfc- editor.org/rfc/                                 https : / / www. farsightsecurity. com / solutions / security - information -
       rfc1035.txt.                                                                                       exchange/.
[18]   S. Weiler and J. Ihren. Minimally Covering NSEC Records and DNSSEC                          [42]   M. Alllman and V. Paxson. “Issues and Etiquette Concerning Use
       On-line Signing. RFC 4470 (Proposed Standard). RFC. RFC Editor,                                    of Shared Measurement Data”. In: Proc. ACM Internet Measurement
       Apr. 2006. URL: https://www.rfc-editor.org/rfc/rfc4470.txt.                                        Conference (IMC). 2007.
[19]   R. Arends, R. Austein, M. Larson, D. Massey, and S. Rose. DNS Se-                           [43]   Network Sorcery Inc. Well known SCTP, TCP and UDP ports. URL:
       curity Introduction and Requirements. RFC 4033 (Proposed Standard).                                http://www.networksorcery.com/enp/protocol/ip/ports00000.htm.
       RFC. Updated by RFCs 6014, 6840. RFC Editor, Mar. 2005. URL: https:                         [44]   A. Gavrichenkov. “Breaking HTTPS with BGP Hijacking”. In: Black-
       //www.rfc-editor.org/rfc/rfc4033.txt.                                                              Hat Briefings (2015).
[20]   O. Kolkman, W. Mekking, and R. Gieben. DNSSEC Operational Prac-                             [45]   S. Helme. Revocation is broken. June 2017. URL: https://scotthelme.co.
       tices, Version 2. RFC 6781 (Informational). RFC. RFC Editor, Dec.                                  uk/revocation-is-broken/.
       2012. URL: https://www.rfc-editor.org/rfc/rfc6781.txt.                                      [46]   A. Langley. No, don’t enable revocation checking. Apr. 2014. URL:
[21]   T. Chung, R. van Rijswijk-Deij, B. Chandrasekaran, D. Choffnes, D.                                 https://www.imperialviolet.org/2014/04/19/revchecking.html.
       Levin, B. M. Maggs, A. Mislove, and C. Wilson. “A Longitudinal, End-                        [47]   J. Larisch, D. Choffnes, D. Levin, B. M. Maggs, A. Mislove, and C.
       to-End View of the DNSSEC Ecosystem”. In: Proc. USENIX Security                                    Wilson. “CRLite: A Scalable System for Pushing All TLS Revocations
       Symposium (SEC). 2017.                                                                             to All Browsers”. In: Proc. IEEE Security & Privacy. 2017.
[22]   P. Mell, T. Grance, et al. “The NIST Definition of Cloud Computing”.                        [48]   The Chromium Project. The Chromium Project: CRLSets. URL: https:
       In: (2011).                                                                                        //dev.chromium.org/Home/chromium-security/crlsets.
[23]   CAcert. Welcome to CAcert. URL: http://www.cacert.org/.                                     [49]   M. Goodwin. Revoking Intermediate Certificates: Introducing OneCRL.
[24]   J. Prins and B. U. Cybercrime. DigiNotar Certificate Authority Breach                              2014. URL: https://blog.mozilla.org/security/2015/03/03/revoking-
       Operation Black Tulip. 2011.                                                                       intermediate-certificates-introducing-onecrl/.
[25]   B. Budington. Symantec Issues Rogue EV Certificate for Google.com.                          [50]   M. Georgiev, S. Iyengar, S. Jana, R. Anubhai, D. Boneh, and V.
       2015. URL: https : / / www . eff . org / deeplinks / 2015 / 09 / symantec -                        Shmatikov. “The Most Dangerous Code in the World: Validating SSL
       issuesrogue-ev-certificate-googlecom.                                                              Certificates in Non-browser Software”. In: Proc. ACM Conference on
[26]   B. Laurie. “Certificate Transparency”. In: Queue 12.8 (2014).                                      Computer and Communications Security (CCS). 2012. URL: http://doi.
[27]   B. Laurie, A. Langley, and E. Kasper. Certificate Transparency. RFC                                acm.org/10.1145/2382196.2382204.
       6962 (Experimental). RFC. RFC Editor, June 2013. URL: https://www.                          [51]   R. Barnes, J. Hoffman-Andrews, and J. Kasten. Automatic Certifi-
       rfc-editor.org/rfc/rfc6962.txt.                                                                    cate Management Environment (ACME). Internet-Draft draft-ietf-acme-
[28]   J. Aas. Why ninety-day lifetimes for certificates? Nov. 2015. URL: https:                          acme-07. http://www.ietf.org/internet- drafts/draft- ietf- acme- acme-
       //letsencrypt.org/2015/11/09/why-90-days.html.                                                     07.txt. IETF Secretariat, June 2017. URL: http://www.ietf.org/internet-
[29]   M. Aertsen, M. Korczyski, G. Moura, S. Tajalizadehkhoob, and J.                                    drafts/draft-ietf-acme-acme-07.txt.
       van den Berg. “No domain left behind: is Let’s Encrypt democratiz-                          [52]   P. Hallam-Baker and R. Stradling. DNS Certification Authority Autho-
       ing encryption?” In: Proc. of the ACM Applied Networking Research                                  rization (CAA) Resource Record. RFC 6844 (Proposed Standard). RFC.
       Workshop (ANRW). 2017.                                                                             RFC Editor, Jan. 2013. URL: https://www.rfc-editor.org/rfc/rfc6844.txt.
[30]   K. Borgolte, C. Kruegel, and G. Vigna. “Delta: Automatic Identification                     [53]   P. Hoffman and J. Schlyter. The DNS-Based Authentication of Named
       of Unknown Web-based Infection Campaigns”. In: Proc. ACM Confer-                                   Entities (DANE) Transport Layer Security (TLS) Protocol: TLSA. RFC
       ence on Computer and Communications Security (CCS). Vol. 20. Nov.                                  6698 (Proposed Standard). RFC. Updated by RFCs 7218, 7671. RFC
       2013.                                                                                              Editor, Aug. 2012. URL: https://www.rfc-editor.org/rfc/rfc6698.txt.
[31]   M. Neugschwandtner, M. Lindorfer, and C. Platzer. “A View To A Kill:                        [54]   PowerDNS. PowerDNS Online Signing. URL: https : / / doc . powerdns .
       WebView Exploitation”. In: Proceedings of the 6th USENIX Workshop                                  com/md/authoritative/dnssec/#online-signing.
       on Large-Scale Exploits and Emergent Threats (LEET). 2013.                                  [55]   G. C. Team. Certificate Transparency in Chrome. May 2016. URL: https:
[32]   T. Luo, H. Hao, W. Du, Y. Wang, and H. Yin. “Attacks on WebView                                    //github.com/GoogleChrome/ct-policy/blob/master/ct_policy.md.
       in the Android System”. In: Proc. ACM Annual Computer Security                              [56]   K. Hall. [cabfpub] Results on Ballot 187 - Make CAA Checking Manda-
       Applications Conference (ACSAC). 2011.                                                             tory. Mar. 2017. URL: https://cabforum.org/pipermail/public/2017-
[33]   M. Bryant. The .io Error Taking Control of All .io Domains With a                                  March/009988.html.
       Targeted Registration. July 2017. URL: https : / / thehackerblog . com /                    [57]   T. Fiebig, F. Lichtblau, F. Streibelt, T. Krueger, P. Lexis, R. Bush,
       the - io - error- taking - control - of - all - io - domains - with - a - targeted -               and A. Feldmann. “SoK: An Analysis of Protocol Design: Avoid-
       registration/.                                                                                     ing Traps for Implementation and Deployment”. In: arXiv preprint
                                                                                                          arXiv:1610.05531 (2016).


                                                                                              14
[58]   T. Ylonen. “SSH–secure login connections over the Internet”. In: Proc.          the certificate after the certificate has propagated to certificate
       USENIX Security Symposium (SEC). Vol. 37. 1996.                                 transparency logs, i.e., shortly after issuance. In face of often
[59]   Host Identity Takeover Using Virtual Internet Protocol (IP) Addressing.         ignored revocation checks, we opt not to publish the private
[60]   S. Yadav, A. K. K. Reddy, A. N. Reddy, and S. Ranjan. “Detecting
       Algorithmically Generated Domain-Flux Attacks with DNS Traffic
                                                                                       key. Instead, we prove ownership of the certificate by signing
       Analysis”. In: IEEE/ACM Trans. Networking (TON) 20.5 (2012).                    a unique message (see Listing 3 and Listing 4). We did not
[61]   B. Stone-Gross, M. Cova, L. Cavallaro, B. Gilbert, M. Szydlowski,               use the certificate for any purpose besides signing the message.
       R. Kemmerer, C. Kruegel, and G. Vigna. “Your Botnet is My Botnet:               It can be verified as follows:
       Analysis of a Botnet Takeover”. In: Proc. ACM Conference on Com-
       puter and Communications Security (CCS). 2009.
[62]   D. Liu, S. Hao, and H. Wang. “All Your DNS Records Point to Us:                 # Copy Listing 2 to certificate.pem
       Understanding the Security Threats of Dangling DNS Records”. In:                # Copy Listing 4 to message.txt.dgst.b64
       Proc. ACM Conference on Computer and Communications Security
                                                                                       # Create message.txt
       (CCS). 2016.
                                                                                       $ echo -n "Cloud Strife: Mitigating the Security Risks of Domain
[63]   N. Nikiforakis, S. Van Acker, W. Meert, L. Desmet, F. Piessens, and
                                                                                            ⇝ Validated Certificates" > message.txt
       W. Joosen. “Bitsquatting: Exploiting Bit-flips for Fun, or Profit?” In:
       World Wide Web. 2013.                                                           # Convert the full certificate to raw PEM:
[64]   Y.-M. Wang, D. Beck, J. Wang, C. Verbowski, and B. Daniels. “Strider            $ openssl x509 -pubkey -noout -in certificate.pem >
       Typo-Patrol: Discovery and Analysis of Systematic Typo-Squatting”.                   ⇝ certificate_raw.pem
       In: SRUTI 6 (2006).
[65]   J. Szurdi, B. Kocso, G. Cseh, J. Spring, M. Felegyhazi, and C.                  # Base64 decode the signature
       Kanich. “The Long “Taile” of Typosquatting Domain Names”. In: Proc.             $ base64 -d message.txt.dgst.b64 > message.txt.dgst
       USENIX Security Symposium (SEC). 2014.
[66]   M. T. Khan, X. Huo, Z. Li, and C. Kanich. “Every Second Counts: Quan-           # Verify the message
                                                                                       $ openssl dgst -sha256 -verify certificate_raw.pem -signature
       tifying the Negative Externalities of Cybercrime via Typosquatting”. In:
                                                                                            ⇝ message.txt.dsgt message.txt
       Proc. IEEE Security & Privacy. 2015.
[67]   B. Zdrnja, N. Brownlee, and D. Wessels. “Passive Monitoring of DNS                           Listing 1: Instructions to verify the signature.
       Anomalies”. In: Proc. SIG SIDAR Conference on Detection of Intru-
       sions and Malware & Vulnerability Assessment (DIMVA). Springer.
       2007.                                                                           -----BEGIN CERTIFICATE-----
[68]   H. Yan, R. Oliveira, K. Burnett, D. Matthews, L. Zhang, and D. Massey.          MIIFHzCCBAegAwIBAgISA3XAEcaykugGaCy9tCoCdJWKMA0GCSqGSIb3DQEBCwUA
       “BGPmon: A real-time, scalable, extensible monitoring system”. In:              MEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQD
       Proc. IEEE Conference For Homeland Security—Cybersecurity Appli-                ExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0xNzExMDkyMzA4NTVaFw0x
       cations & Technology (CATCH). 2009.                                             ODAyMDcyMzA4NTVaMCkxJzAlBgNVBAMTHmNsb3Vkc3RyaWZlLnNlY2xhYi5jcy51
[69]   M. Wählisch, O. Maennel, and T. C. Schmidt. “Towards Detecting BGP              Y3NiLmVkdTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAONF0TzeAA6N
                                                                                       q5Li7e9h6+Y//d8Zy2gbWN465t3MPVlz1lSLqCZvT4e3IDjuyQ/gx+yWnndtQrhs
       Route Hijacking Using the RPKI”. In: ACM SIGCOMM Computer
                                                                                       zHt+GigQbBcAFM5YohIVrTr7M8ozZVZhu1x11xmPZYJ9hAi8NO6p2uoZMNwiHh35
       Communication Review 42.4 (2012).
                                                                                       XVFQs5LFG6QpPGBWoNtu1t5zwLYF01STlMS/hNn0P/KlrnAzs2tSX//OxxaY+jos
[70]   H. Ballani, P. Francis, and X. Zhang. “A Study of Prefix Hijacking and          KQCl9LrXKhOXcmaZMXFe7t8uglFsjbEvM9TRFqeENROik/TLjRlyb3BM5HtKVnno
       Interception in the Internet”. In: ACM SIGCOMM Computer Communi-                tDh6078qCgwMzZyh5YRy2uOGHCp13TdZQtOELq0qfGNjVClwRENo+AW1K8fPnw9L
       cation Review. Vol. 37. 4. 2007.                                                S49OpBwzx2MCAwEAAaOCAh4wggIaMA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAU
[71]   Z. Zhang, Y. Zhang, Y. C. Hu, and Z. M. Mao. “Practical Defenses                BggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUKnFO
       Against BGP Prefix Hijacking”. In: Proc. ACM CoNEXT. 2007.                      hVGO9fXAoSDpoRiztZhSYo4wHwYDVR0jBBgwFoAUqEpqYwR93brm0Tm3pkVl7/Oo
[72]   M. Aertsen, M. Korczyski, G. Moura, S. Tajalizadehkhoob, and J. v. d.           7KEwbwYIKwYBBQUHAQEEYzBhMC4GCCsGAQUFBzABhiJodHRwOi8vb2NzcC5pbnQt
       Berg. “No Domain Left Behind: Is Let’s Encrypt democratizing Encryp-            eDMubGV0c2VuY3J5cHQub3JnMC8GCCsGAQUFBzAChiNodHRwOi8vY2VydC5pbnQt
       tion?” In: arXiv preprint arXiv:1612.03005 (2016).                              eDMubGV0c2VuY3J5cHQub3JnLzApBgNVHREEIjAggh5jbG91ZHN0cmlmZS5zZWNs
[73]   A. Manousis, R. Ragsdale, B. Draffin, A. Agrawal, and V. Sekar.                 YWIuY3MudWNzYi5lZHUwgf4GA1UdIASB9jCB8zAIBgZngQwBAgEwgeYGCysGAQQB
                                                                                       gt8TAQEBMIHWMCYGCCsGAQUFBwIBFhpodHRwOi8vY3BzLmxldHNlbmNyeXB0Lm9y
       “Shedding Light on the Adoption of Let’s Encrypt”. In: arXiv preprint
                                                                                       ZzCBqwYIKwYBBQUHAgIwgZ4MgZtUaGlzIENlcnRpZmljYXRlIG1heSBvbmx5IGJl
       arXiv:1611.00469 (2016).                                                        IHJlbGllZCB1cG9uIGJ5IFJlbHlpbmcgUGFydGllcyBhbmQgb25seSBpbiBhY2Nv
[74]   J. Clark and P. C. van Oorschot. “SoK: SSL and HTTPS: Revisiting Past           cmRhbmNlIHdpdGggdGhlIENlcnRpZmljYXRlIFBvbGljeSBmb3VuZCBhdCBodHRw
       Challenges and Evaluating Certificate Trust Model Enhancements”. In:            czovL2xldHNlbmNyeXB0Lm9yZy9yZXBvc2l0b3J5LzANBgkqhkiG9w0BAQsFAAOC
       Proc. IEEE Security & Privacy. 2013.                                            AQEAIj1W4ZzHlsaj6ccWccGyVahfk9JDhImMQLDUR02FYqtHLPjyM1JIIyYHP9xE
[75]   Y. Chen, V. Paxson, and R. H. Katz. “What’s New About Cloud                     S2JZBbzMlrr2SjfxC3IQhDkUIjyPEeLv6WVT0hFbbzu3QAYjW5yigctpuggx/v7c
       Computing Security”. In: University of California, Berkeley Report No.          rhbWpmY9TJRU2QAsADF9NIeSXo+3zp15QAvrss2l+qtEK3uLgQ12+antYaI85wkc
       UCB/EECS-2010-5 January 20.2010 (2010).                                         P6MGHVV52asshcjy+v2wHxJDONmtzCHQbYXA7nhSUfspnVax8EfraGWF5XobZyLw
[76]   S. Subashini and V. Kavitha. “A Survey on Security Issues in Service            p91BZjOB1D+HD3ubtbk2PjlW/Eld7jgv2pCEM0iXk5suidCnG47jmZQA892iUVVf
       Delivery Models of Cloud Computing”. In: Journal of Network and                 tx4z5/ntnkiw7Gwwzm+o34fMmQ==
                                                                                       -----END CERTIFICATE-----
       Computer Applications 34.1 (2011).
[77]   M. Jensen, J. Schwenk, N. Gruschka, and L. L. Iacono. “On Technical
                                                                                           Listing 2: Proof of concept certificate, signed by Let’s Encrypt.
       Security Issues in Cloud Computing”. In: Proc. IEEE Conference on
       Cloud Computing Technology and Science (CloudCom). 2009.
[78]   H. Takabi, J. B. Joshi, and G.-J. Ahn. “Security and Privacy Challenges         Cloud Strife: Mitigating the Security Risks of Domain Validated
       in Cloud Computing Environments”. In: IEEE Security & Privacy                        ⇝ Certificates
       (2010).
[79]   Y. Zhang and J. Joshi. Access Control and Trust Management for Emerg-             Listing 3: Proof of concept message (one line, no trailing new line).
       ing Multidomain Environments. Emerald Group Publishing, 2009.

                                                                                       Bc99Sl5FwjqYLJl/jS1gPC9fyI9XiS/ex7QVg+zIFZpJ+aPCYcsGm4fGkJxathte
                                A PPENDIX                                              w4i0p3q3lSmnkukRoRNVSvMJdfJRm5QvRQr43HsC6iT+N2xZI/QLcH0nMGUftpR2
                                                                                       HuEiY8LwIalNuxOOjTZJwfTTSRM+NdCjSa39RDpqQLU5LGKjBpSTT/jfg0RwrX0w
     For our proof of concept experiment (see Section III-E),                          MhDnq+iqqrW0kDg08bxARWUfY7tHUAvPpiyyEhnfyThliHFkrKUjAGtH6f+6fKFe
we obtained a valid certificate for the domain “cloud-                                 8pZO0XJHRoMuhq4OXMjOWKJZYu7XwQXn3GDoo1bwIwykwmIpUu9wGAjlimtTY5eW
                                                                                       uM0tg2PkmbuZi3JaGsczuQ==
strife.seclab.cs.ucsb.edu.” The obtained certificate is shown in
Listing 2. The respective entry in the certificate transparency                                Listing 4: Signature for the proof of concept message.
log can be found at: https://crt.sh/?id=250959196. We revoked
                                                                                  15
