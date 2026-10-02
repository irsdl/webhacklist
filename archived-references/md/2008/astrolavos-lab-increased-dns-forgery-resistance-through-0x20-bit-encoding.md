---
type: Article
title: Increased DNS Forgery Resistance Through 0x20-Bit Encoding
description: "Randomise the case of each letter in a DNS query name: authority servers copy the question section back bit-for-bit, so the case pattern becomes a free extra token an off-path poisoner must guess alongside the ID and source port. Stateless, AES-derived, recursive-side only. A 5.6M-packet trace gives ~12 extra bits on average, and scanning .com/.net authorities found over 99.7% preserve case."
resource: "https://coeus.ece.gatech.edu/2008/10/01/DNS_Forgery/"
tags: [article, webseclist-reference, dns, cache-poisoning, mitigation, defence, measurement-study, large-scale-scan, encoding]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:34:18+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://coeus.ece.gatech.edu/2008/10/01/DNS_Forgery/"
    title: Increased DNS Forgery Resistance Through 0x20-Bit Encoding
    author: David Dagon, Manos Antonakakis, Paul Vixie, Tatuya Jinmei, Wenke Lee
also_at:
  - "https://coeus.ece.gatech.edu/articles/increased_dns_resistance.pdf"
authors:
  - David Dagon
  - Manos Antonakakis
  - Paul Vixie
  - Tatuya Jinmei
  - Wenke Lee
canonical_url: ""
cited_by:
  - "2008.md:90"
commit: ""
content_sha256: 954e1d572e8ea9f3d9109969637f15ecdfba37f4cf7848b2a490a85fd40800d3
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://coeus.ece.gatech.edu/2008/10/01/DNS_Forgery/"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: d448fa0e82f180ba2337b81cdb264ff6f47dd2d1f3d1c3b69271a7a41dc1ec52
retrieved_from: "https://coeus.ece.gatech.edu/articles/increased_dns_resistance.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:34:18+00:00"
slug: astrolavos-lab-increased-dns-forgery-resistance-through-0x20-bit-encoding
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Increased DNS Forgery Resistance Through 0x20-Bit Encoding

**Increased DNS Forgery Resistance Through 0x20-Bit Encoding** - David Dagon, Manos Antonakakis, Paul Vixie, Tatuya Jinmei, Wenke Lee, Publisher not stated.

- Published: date not stated
- Original: <https://coeus.ece.gatech.edu/2008/10/01/DNS_Forgery/>
- Also published at: <https://coeus.ece.gatech.edu/articles/increased_dns_resistance.pdf>
- Preserved from: https://coeus.ece.gatech.edu/articles/increased_dns_resistance.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Increased DNS Forgery Resistance
                                      Through 0x20-Bit Encoding
                                                      SecURItY viA LeET QueRieS

                        David Dagon                                 Manos Antonakakis                                  Paul Vixie
                      Georgia Institute of                              Georgia Institute of                 Internet Systems Consortium
                        Technology                                        Technology
                                                                                                               Paul_Vixie@isc.org
               dagon@cc.gatech.edu                               manos@cc.gatech.edu



                                                 Tatuya Jinmei                                    Wenke Lee
                                        Internet Systems Consortium                            Georgia Institute of
                                                                                                 Technology
                                       Jinmei_Tatuya@isc.org
                                                                                         wenke@cc.gatech.edu


ABSTRACT                                                                                    DNS poisoning attacks present a persistent, ongoing threat to
We describe a novel, practical and simple technique to make DNS                          server operations. While there are a variety of DNS poisoning tech-
queries more resistant to poisoning attacks: mix the upper and                           niques, those directed at large cache servers often use two steps:
lower case spelling of the domain name in the query. Fortuitously,                       (a) they force the recursive server to perform a lookup; and then
almost all DNS authority servers preserve the mixed case encod-                          (b) spoof misleading DNS answers, using the source address of the
ing of the query in answer messages. Attackers hoping to poison                          authority server. A successful attacker can change a DNS cache
a DNS cache must therefore guess the mixed-case encoding of the                          entry, and redirect all users of the victim DNS server to arbitrary
query, in addition to all other fields required in a DNS poisoning                       proxy locations. When done to obtain transactional information
attack. This increases the difficulty of the attack.                                     (e.g., banking), this technique is called pharming (or large-scale
   We describe and measure the additional protections realized by                        phishing) [27].
this technique. Our analysis includes a basic model of DNS poi-                             Numerous solutions have been proposed to prevent DNS poison-
soning, measurement of the benefits that come from case-sensitive                        ing, e.g., whitelisting [14], cryptographic systems [33], and many
query encoding, implementation of the system for recursive DNS                           client-based systems have been suggested. Solutions requiring changes
servers, and large-scale real-world experimental evaluation. Since                       to the DNS infrastructure, however, face larger hurdles in deploy-
the benefits of our technique can be significant, we have simultane-                     ment. For example, DNSSEC [5] and DLV [34] use cryptography
ously made this DNS encoding system a proposed IETF standard.                            to provide strong DNS messaging integrity. However, these ap-
Our approach is practical enough that, just weeks after its disclo-                      proaches require significant changes to the world’s DNS infrastruc-
sure, it is being implemented by numerous DNS vendors.                                   ture: the signing of zones, the creation of policies to manage those
                                                                                         keys, and the deployment of DNSSEC-aware clients and servers.
                                                                                            Other DNS security solutions contemplate even larger changes to
General Terms                                                                            the network infrastructure, e.g., the creation of DHT-based naming
DNS, DNS poisoning, DNS transaction security, DNS forgery re-                            or cooperative naming systems that replace DNS [24, 37]. Even if
sistance, protocol security, network security, DNS security                              these systems prevent poisoning, they are more likely to find adop-
                                                                                         tion in new, developing network architectures, such as P2P systems,
                                                                                         compared to existing network systems. DNS is so widely used, de-
1.     INTRODUCTION                                                                      ployed in tens of millions of systems, and so central to every other
                                                                                         protocol, that one must expect it will survive the creation of novel
                                                                                         replacement solutions.
                                                                                            The goal of our work is to devise practical security solutions for
Permission to make digital or hard copies of all or part of this work for                DNS that make resolvers more resistant to poisoning. Specifically,
personal or classroom use is granted without fee provided that copies are                we desire the creation of DNS light-weight forgery-resistance tech-
not made or distributed for profit or commercial advantage and that copies
                                                                                         nology that has several properties:
bear this notice and the full citation on the first page. To copy otherwise, to
republish, to post on servers or to redistribute to lists, requires prior specific          1. No Radical Changes. DNS improvements should ideally re-
permission and/or a fee.
CCS ’08, Virginia USA                                                                          quire no large-scale replacement or modification of existing
Copyright 2008 ACM ...$5.00.                                                                   DNS infrastructure. (If large changes were needed, one could


                                                                                     1
        argue that zone owners should instead just deploy DNSSEC.)             and addresses. DNS is a complex protocol with numerous control-
                                                                               ling RFCs. We therefore focus on only those details relevant to
     2. Protocol Stability. Improvements should require no alter-              DNS forgery attacks. Readers requiring a more general overview
        ation of the DNS protocol, which would in turn require reim-           may consult [31].
        plementation of DNS server and client code. (Surveys have
        shown there are tens of millions of DNS servers deployed               2.1 DNS Overview
        world-wide, many on embedded devices [8, 25]. Amending                    In DNS, domain names are composed of labels, separated by pe-
        them to handle a new protocol is likely cost-prohibitive.)             riods, which correspond to namespaces in a hierarchical tree struc-
     3. Backward Compatible. Any improvements should be op-                    ture. Each domain is a node, and the bottom-up concatenation of
        tional, and not disrupt other technologies that rely on existing       nodes creates a fully qualified domain name. A zone is collection
        DNS standards.                                                         of such nodes, constituting a separate tree structure, with the zone’s
                                                                               start of authority, or SOA, at the apex. The contents of the SOA (ei-
   We present a defense technique against poisoning that satisfies             ther mappings of labels to hosts, or further downward delegation),
these requirements. We propose the mixed-case encoding of query                is available from “DNS authority servers”. In DNS nomenclature,
and reply messages between recursive and authority servers. For                these authority servers are sometimes called the SOA.
example, instead of querying for www.example.com, recursive                       There are two other DNS resolvers typically involved in poison-
DNS servers would instead query for wwW.eXamPLe.cOM, or                        ing attacks: recursive resolvers, and (less frequently) stub resolvers.
some other pattern of case variations.                                         A recursive resolver is what one normally thinks of as a “DNS
   Since almost all authority DNS servers preserve the case encod-             server”. Such resolvers accept queries from users, understand the
ing of DNS queries, bit-for-bit, as presented by the recursive server,         zone hierarchy system, and properly implement the various rules
only the recursive servers need to change how they format ques-                and RFCs to obtain and cache answers.
tions.                                                                            DNS initiators on host machines are called stub resolvers. They
   The pattern of mixed-case encoding of domain names, unique to               typically don’t interact with the zone hierarchy, and with a few ex-
each transaction between DNS initiators and responders, provides               ceptions, don’t cache answers. Instead, they implement enough
an additional means to track messages between servers. We call our             DNS logic to pose basic queries to recursive servers.
encoding system “DNS-0x20” after the bit position used to manip-                  A short example illustrates how these three classes of DNS sys-
ulate case.                                                                    tems interact. Assuming no intermediate caching, resolving a do-
   The main contributions of this paper include:                               main name like www.example.com potentially requires numer-
                                                                               ous steps:
     • We propose DNS-0x20, a simple change to the formatting of
                                                                                   • First, the stub resolver sends the query to the recursive server.
       DNS queries. We have implemented DNS-0x20, and have
                                                                                     In our example, we assume no previous resolutions whatso-
       offered the technology as an IETF standards proposal [32].
                                                                                     ever remain cached.
       At this writing, the proposal has progressed to working group
       status. As further proof that our scheme is practical, work-                • Next, the recursive resolver consults with the root servers,
       able, and useful, numerous DNS vendors (at this writing) are                  which are the authority for the empty label (the dot, “.”,
       now incorporating DNS-0x20 encoding into their servers and                    implicit at the end of all fully qualified domain names). In
       products–just weeks after the idea was first proposed.                        this example, the root servers would indicate a downward
                                                                                     delegation of the “com.” zone to other authority servers.
     • We present an in-depth analysis of the cache poisoning at-
                                                                                     (For example, the client might be told to visit the DNS server
       tack and the ID field vulnerability. We use an basic model of
                                                                                     at a.gtld-servers.net., run by VeriSign, and further
       DNS poisoning, but extend it to consider parameters (e.g.,
                                                                                     be given the IP address of that DNS server as “glue” to avoid
       server diversity) commonly used in DNS operations. We
                                                                                     additional lookups).
       show that DNS-0x20 encoding increases message integrity
       far more than authority and recursive diversification.                      • Next, the recursive server will consult with the “com.” zone
                                                                                     authority servers, which again will indicate further down-
     • To show how DNS-0x20 encoding improves resolver secu-                         ward delegation to the example.com. zone. (For exam-
       rity, we study the number of additional bits available, based                 ple, instead of being given an answer, the client might be
       on a large-scale DNS traffic trace. For short domains, of                     told next to visit ns1.example.com., or the appropriate
       course, the benefits are less. Nonetheless, since each ad-                    authority server for the zone.1 )
       ditional bit doubles the search space of the attacker, even
       small improvements obtained through DNS-0x20 results in                     • Next, the recursive server consults the example.com. zone,
       a query stream that is exponentially harder to successfully                   which would reveal the host address record (or “A record”)
       attack. While not offering complete security, our system sig-                 for www.example.com.
       nificantly raises the bar.
                                                                                   • Finally, the answer is returned to the stub resolver, and cached
  Section 2 presents a succinct overview of DNS, and essential                       by the recursive resolver to assist in future resolutions.
background on DNS poisoning. Readers already familiar with DNS                    Each one of these consultations involves the recursive resolver
may skip to Section 3, where we offer a model of DNS poisoning.                expecting an answer from a remote authority server–either an in-
Our encoding system is presented in Section 4, and is evaluated in             dication of further delegation or a terminating RRset. A DNS poi-
Section 5.                                                                     soner could anticipate or induce this chain of resolutions and, be-
                                                                               fore the authority responds, inject false answers with spoofed source
2.     BACKGROUND                                                              1
                                                                                At this writing, the NS for the example.com are the hosts a and
   A critically-important component of the Internet infrastructure,            b in the zone iana-servers.net; however, we’ve simplified
the Domain Name System (DNS) [21, 22], maps between names                      this sample to presume an authority at ns1.example.com.


                                                                           2
addresses. This form of DNS poisoning is a packet race. The re-            part, DNS vendors defended against the Kaminsky-class attack by
cursive servers accept whichever answer arrives first–so long as the       implementing port randomization to “grow the key space”. DNS
arriving message matches a few simple transactional requirements.          vendors also changed their glue-handling policies to better validate
                                                                           or reject the rogue NS update.
2.2 DNS Poisoning                                                             In the DNS attacker/defender cat-and-mouse game, DNS opera-
                                                                           tors continually look for additional opportunities to improve trans-
   To better understand the transactional issues in DNS poisoning,
                                                                           action integrity, and attackers search for weaknesses in implemen-
we can reduce the complexity of DNS lookups into a simplified
                                                                           tations, and other methods to predict transaction tokens.
model. Figure 1 shows a basic conceptual model of these three
DNS actors critical to a DNS poisoning attack. In Figure 1, the
stub resolver first queries a caching server (labeled A? in the dia-       3. BASIC DNS POISONING MODEL
gram). Since in our example, the recursive lacks a cache entry for
the query, it contacts the authority server (labeled SOA in the dia-          While others have shown that DNS stub resolvers can be sub-
gram). The answer (labeled IN A in Figure 1) is returned to the            verted [8], our concern is in protecting the recursive resolver in its
recursive server, which caches and sends the answer to the stub.           transactions with the authority servers. To do this, we first need to
Note that we have omitted any reference to the zone hierarchies.           characterize the risk of poisoning to any server.
   For purposes of our analysis, DNS has but a single messaging               Many of the basic mechanical steps in DNS poisoning are well-
format, whether used to ask or answer a query. The protocol for-           known to attackers. For example, anticipating when a recursive
mat for DNS messages includes a 16-bit ID field, and a query field         server will initiate a DNS query is straightforward. Attackers can
holding a wire representation of the domain name. Figure 1 shows           iteratively observe cache values over time (and initiate attacks when
how the ID field is used to establish the uniqueness of each mes-          previously valid cached entries time out and are queried again).
sage.                                                                      Similarly, open recursive servers can be forced to do lookups, e.g., [8].
   A DNS poisoner’s task, in the simple case, is to guess the 16-bit       Additionally, secured DNS servers might be obligated to initiate
query ID field. Figure 1 shows a DNS poisoner offering several             lookups for domains that the attacker sends to the attention of pro-
(spoofed source) DNS answers to a recursive server (indicated as           tected networks (e.g., by interacting with mail servers, firewalls, or
the “crafted IN A” answers in the diagram). If the attacker guesses        logging webservers, which in turn resolve domains associated with
the ID field, and her packet arrives before the authority server’s         the sessions).
answer, the recursive server will accept and cache her malicious              Without loss of generality, we use the scenario where an at-
answer.                                                                    tacker identifies and queries open recursive (OR) servers. Without
   Clearly, DNS poisoners are most effective when they can guess           a cached record, recursive servers need to start “upstream” itera-
the ID field. Early versions of DNS servers deterministically in-          tive queries in order to locate the authoritative servers. As noted in
cremented the ID field (until OpenBSD developer Theo de Raadt              Section 2, portions of the iterative SOA discovery may be cached
suggested they be randomized). In [19, 16], Klein demonstrated             (e.g., the authority server for the TLD may be cached). Figure 2
that if the ID field is not securely randomized, it can be attacked        shows all of the various stages of this iterative process, assuming
successfully after a few interactions with the server.                     no caching takes place.
   Because there are only 65,536 possible ID field values, previous           The x-axis of Figure 2 indicates time. The period between steps
work has noted the use of birthday attacks, and techniques to ex-          t5 and t6 in the diagram constitutes the vulnerable window for a
ploit weak random number generation [15, 16, 17, 18, 19, 28], see          DNS poisoning attack. During this △t period, the OR waits for an
also [37].                                                                 answer from the SOA. Attackers can send malicious answers to the
   Accordingly, some DNS implementers have sought additional               OR, and repeat the process until they guess the appropriate ID field,
sources of entropy to protect server messaging. D.J. Bernstein [9]         or the authority finally responds.
first suggested using the UDP source port fields, to show additional          Figure 2 shows (in densely packed arrows) numerous packets
correspondence between queries and answers. In this approach, re-          sent by the attacker to the recursive server. The diagram shows a
cursive DNS servers would send a query, using a random 16-bit              progression that finally matches the ID field. Each constitutes a
source port, and (conceptually) listen over some 65K open sockets          single guess of the required ID field and port values. In our model,
for the appropriate reply. Not all source ports might be used (for         we also assume the answer’s TTL (or caching period) is such that,
example, one might want to avoid well known ports < 1024 typi-             if the attack fails, the attacker must wait a lengthy period of time
cally used by other protocols) [12], and of course pools of sockets        before trying again. (The poisoner is free to try again, of course,
could be used instead. But regardless of the implementation, DNS           but must wait TTL seconds–assumed to be a very long time.)
servers that use both the ID field and source port have ≈ 230 to
≈ 232 possible combinations that an attacker must guess (depend-           Definition 1. We say a DNS server is forgery resistant where T T L ≫
ing on how the server handles reserved ports).                             △t, and the chance of an attack being successful within △t time is
   Recently, Dan Kaminsky announced a technique to replace NS              low.
records by performing a series of nonce queries [13]. In this tech-
nique, the attacker merely induces a random A? query, and spoofs              We realize that terms such as “low” are unclear. After all, de-
answers with appropriate IN A answers as well as an NS update.             termined attackers may try an attack, regardless of the chance of
If the spoofed attack fails to match the ID field, another random          success. We clarify Definition 1 with the following assumption:
A? query is generated, and another round of spoofed answers is
sent. Eventually (within ≈ 6 seconds on most networks), a match-
ing ID field is generated by the attacker, and the attacker uses the       Assumption 1. If attack is not 10% likely to succeed within Tmax ,
authority section of the winning packet to evict the previous cached       we deem the DNS server is forgery resistant.
NS record. This innovative approach reduces the attack time from
weeks to seconds, allowing trivial control of DNS cache lines. An            We pick 1 day for Tmax , a time that matches a very commonly
unprecedented multi-vendor response followed [30]. For the most            used TTL period (86400 seconds). Further, one day is a reasonable


                                                                       3
                                Figure 1: Simplified model of DNS resolution, and poisoning.


                                                                 period of time during which DNS logs could (should) be read by
                                                                 an administrator, or the poisoning attack otherwise noticed by IDS
                                                                 equipment.
                                                                    We also note that, while 10% is clearly arbitrary, it provides us
                                                                 with a simple means of assessing DNS poison resistance. Absent
                                                                 protocols such as DNSSEC, all DNS servers are vulnerable to some
                                                                 level of poisoning attack. The goal is to make the chance of success
                                                                 as low as possible.
                                                                    For a particular context, depending on the value of the target,
                                                                 one can adjust this value, and determine the resistance of a DNS
                                                                 deployment to poisoning. Note that the purpose of our work is to
                                                                 demonstrate an improvement in security. Using this assumption
                                                                 lets us show the relative improvement in forgery resistance, as dis-
                                                                 cussed in Section 5. Thus, a threshold of 10% is suitable for our
                                                                 purposes.
                                                                    Clearly, the RTT (or delay between the OR and SOA), plays an
                                                                 important role in the attacker’s chances of success. If △t is large,
                                                                 the poisoner can send more spoofed packets, one of which might
                                                                 match the required transactional ID field and port numbers. Even
                                                                 in a Kaminsky-class attack (which is largely bandwidth limited),
                                                                 the RTT determines the number of spoofed packets one can send.
                                                                 As noted in Section 2, many DNS vendors have also changed their
                                                                 glue handling policies so that rogue NS updates are inspected and
                                                                 re-validated. This means RTT remains one the most important vari-
                                                                 ables for an attacker.
                                                                    In practice, the RTT for DNS messaging varies, since recursive
                                                                 and authority DNS servers could be located anywhere. Fortunately,
                                                                 there are known techniques to measure the RTT between any tu-
                                                                 ple of open recursive and authority servers. In [11], Gummadi, et
Figure 2: The attacker’s time window for a cache poisoning       al., described “King”, a measurement technique that uses repeated
attack on a DNS server during a iterative query.                 probes of open recursive servers. In general, King uses two queries
                                                                 to measure the RTT between a recursive and authority server: one
                                                                 for a nonce record that is not in cache, and a second, duplicate query
                                                                 that gets answered from the recursive’s newly populated cache. The
                                                                 time difference between the two is the RTT between the recursive
                                                                 and authority servers.
                                                                    To observe variability in RTT, and suggest reasonable bounds for
                                                                 estimating △t (which in turn determines the number of attack pack-
                                                                 ets that can be sent) we implemented a larger, expanded version of
                                                                 King. We followed several steps.



                                                             4
   1. First, we obtained lists of open recursive servers, from both           β = Number of Source Ports (conceptually 216 ).
      the Measurement Factory’s study, [36], and by contacting the            γ = Number of Ports excluded (often 1024, or depending on
      authors of [8], who measured tens of millions of such servers.       kernel resources [12].)
      We mapped each open recursive to an Autonomous System                   θ = Number of authority servers and recursive IPs. Many au-
      (AS), and randomly selected 5,000 resolvers from ripencc,            thority clusters include multiple DNS servers with independent pub-
      arin, apnic and 500 from afrinic servers. We further verified        lic IP addresses (to provide power and geographic diversity). A
      the hosts were still open recursive.                                 recursive server normally RTT sorts the servers, and then queries
                                                                           the closest host. No RFC mandates this, however, and recursive
   2. We then created a domain, created an NS for the domain, and          can also randomly select SOA server θi . Additionally, some recur-
      made sure its NS propagated to the parent zone.                      sive servers are multi-homed, and could select any routable source
                                                                           address for its query. θ is the sum of all public facing addresses
   3. We next “primed” each open recursive to make sure they
                                                                           used by the recursive and authority servers. In addition to the port
      had cached the root servers, TLDs, and required intermedi-
                                                                           and query ID, an attacker has to spoof the correct authority source
      ate zones. (This avoided measuring the time needed by the
                                                                           address, and send this to the correct recursive address.
      recursive to locate the authority server.)

   4. We then used the following probe technique, for hundreds of                                                   1
                                                                                            Psuccess(1st) =
      random labels within our domain. For each random label,                                               α ∗ (β − γ) ∗ θ
      Ri , we asked from several locations:                                  In the common case of a server employing both ID and source
                                                                           port randomization, with 3 authority servers, this amounts to:
         • Iteratively asked the OR for the label Ri . I.e., we made
           sure it had not somehow cached the answer already. We                                              1                  1
           recorded the response time as tA .                                     Psuccess(1st) =                         ≈
                                                                                                   216 ∗ (216 − 1024) ∗ 3    12.7B
         • Recursively asked the OR for Ri again. I.e., we forced            In sending n packets, an attacker may succeed with:
           it to consult the authority server. We knew from previ-
           ous steps that the parent zone information and NS for                                                      n
           our zone were already cached. We measured this time                              Psuccess(n) =
                                                                                                              α ∗ (β − γ) ∗ θ
           as tB
                                                                              Other parameters of course affect the actual chance of success.
         • Iteratively asked the OR for Ri again. We noted the             Bandwidth and traffic loss are also critical variables we’ve not in-
           time it took as tC .                                            cluded in our model. However, with the pervasive availability of
         • Calculate: RT Ti = tC − tB . As a sanity check, we              botnets, compromised machines, and proxies, we assume an at-
           also verified that tC −tB ≈ tC −tA . I.e., the difference       tacker would not be constrained. A more complex model would
           between the recursive and any iterative probe should            introduce this as a separate constraint. Since network measurement
           be the same. (The observed variance, due to inherent            studies have generally observed that bandwidth correlates positively
           variability in network delays, is reported in Figure 4,         to RTT [7], we omitted this parameter in our simplified model.
           and discussed below.)                                              Figure 3 shows the chance an attack will be successful against a
                                                                           variety of defenses, and illustrates the properties of the simplified
   5. After noting the RT Ti for each 1 . . . n round of queries, we       model. The logscale x-axis depicts the number of attack packets.
      calculated the average RTT between our SOA and the recur-            Based on the RTT study (and assuming a window of 100ms, with
      sive server.                                                         the attacker using a 100Mb/s connection), some 13,000 packets can
                                                                           be sent. The linear y-axis shows a range of θ, the combined IPs of
   The distribution of RTT times, from the stub resolver’s perspec-        the authority and recursive servers. The logscale z-axis shows the
tive, appears in Figure 4(a). A CDF plot of these RTT times is             probability of a successful attack. RFC 1912 recommends a small
shown in Figure 4(b). There are several observations one can make.         number of authority DNS servers, and no more than ≈ 7 [6]. While
First, these measurements generally fit the prevailing wisdom of           not a standard, this advice is general wisdom, and even large enter-
DNS operators that all DNS messages take anywhere 100 to 400               prise zones (e.g., search engines, Fortune 500 companies) have just
milliseconds to complete, with a long tail taking much longer due          three or four public IPs for their authority server farms.
to drops, timeouts, and other problems (e.g., server failure).                The upper mesh drawn in Figure 3 shows the rate of success
   Second, if the domain is cached, then the average query/answer          against a DNS server using just ID field randomization and a fixed
response time is less than 100 millisecond. On the other hand if the       port. Unless significant numbers of additional authority servers are
query was not cached it can take close to 400 milliseconds for the         brought online (in excess of those normally used, and more than
recursive server to present an answer back to the resolver.                those recommended by RFC 1912), the chance of an attacker suc-
   Our small study helps us understand the dimensions of △t. For           cessfully poisoning a DNS server rises with the number of attack
a given percentage of queries (say, the RTT for 90% of all lookups         packets. In general, Figure 3 shows that IP diversity provides a
between an OR and SOA tuple), and can estimate the RTT, and                linear increase in security, while port randomization provides an
from there determine the number of “guesses” an attacker can make          exponential improvement.
before the correct authority answer arrives.                                  The lower mesh in Figure 3 shows a much better resistance to
                                                                           forgery attempts. One might be tempted to think that port random-
Definition 2. We can therefore state the chance of successfully            ization has solved DNS poisoning completely. While clearly use-
poisoning a DNS server, for a single packet:                               ful, [28, 29], port randomization can be overcome by determined
  We assume:                                                               attackers able to send large amounts of traffic [20]. We desire addi-
  α = Number of Different DNS IDs (universally 216 or 65,535               tional means of security for several reasons:
values)                                                                       • Not every recursive DNS server can implement port random-


                                                                       5
Figure 3: Probability of DNS poisoning attack success, for fixed              Figure 5: A proposed algorithm for encoding DNS-0x20 bits
and randomized ports.                                                         into queries. While other techniques are possible, this approach
                                                                              is stateless, and allows for simple verification of the answers
                                                                              with constant memory overhead.
       ization, since it poses unique engineering challenges. Poten-
       tially, a server using source port randomization might have to
       select(2) over thousands of open sockets, opening and                  letters constitutes a channel–one that can be used to improve DNS
       closing them as they are used. For embedded systems, im-               security.
       plementers may be left with expensive poll techniques. As                 An example shows how this encoding can trivially correspond to
       noted in [8], there are likely millions of recursive servers in        a unique query. The following question names will be treated as
       embedded systems.                                                      equal by a responder (for purposes of cache matching), but can be
                                                                              treated as unique by a DNS initiator:
     • Some DNS servers are more important targets, (e.g., ISP
       DNS servers that could potentially yield millions of victims).                            Domain Name         Field Value
       Even if a DNS server used both the ID field and port random-                      www.example.com          1111111111111
       ization, it may still present a tempting target for persistent,
       ongoing, low-grade attacks.                                                       WWW.EXAMPLE.COM          0000000000000
                                                                                         WwW.eXaMpLe.CoM          0101010101010
   We therefore need additional DNS protection measures, not merely
to increase forgery resistance, but also to provide a diversity of de-                   wWw.ExAmPlE.cOm          1010101010101
fense options for a variety of platforms.                                        In the second column, we can indicate a numerical value that
                                                                              represents the encoding, where lowercase == 1, and uppercase ==
4.     DNS-0X20 BIT ENCODING QUERIES                                          0. The DNS initiator can use this encoding as an additional means
   As noted in Section 2, DNS labels are case insensitive, and in             of verifying message integrity.
fact no DNS message assigns any meaning to case differences of                   To efficiently encode a query, we propose a simple algorithm.
letters. Further, even if a zone configuration file contains a particu-       Figure 5 illustrates the following steps:
lar case pattern, e.g., WWW.EXAMPLE.COM, queries using any case
pattern, e.g., www.example.com will be answered. Case for-                       1. As an input, a domain name input arrives: either an answer
matting may be preserved in cache lines, in service of trademarks;                  from a server, or a query from a stub resolver. Figure 5 shows
however matching and resolution is entirely case insensitive.                       the arrival of IBM.com as a query string.
   It turns out that, with minor exceptions, all queries are copied
                                                                                 2. First, one transforms the query field into a canonical format,
from the initiator’s packet, exactly into the response. Based on the
                                                                                    e.g., all lowercase.
available open source implementations that exhibit this behavior, it
appears this behavior comes as a side-effect of efficient program-               3. Second, one uses a chosen encryption scheme to encrypt
ming. Instead of copying the DNS query in memory, it is rewritten,                  the canonical query, e.g., perhaps with AES [23], and a key
in place, just as it arrived over the wire. I.e., the authority servers             shared by all queries on the recursive server. This is illus-
flip source port and IP fields, change flags, checksums, and adjust a               trated as step A in Figure 5. This step could equivalently
few parameters (e.g., authority and answer sections) in place. Thus,                use a small number of keys, one for a given time epoch.
answer messages contain the query field in the same case pattern                    (Key management is beyond the scope of this algorithm, but
as originally offered by the DNS initiator.                                         briefly noted below.)
   This provides an opportunity to use the 0x20 bit of any ASCII
letter (in the ranges 0x41 . . . 0x5A and 0x61 . . . 0x7A, e.g.,                 4. Since the resulting cipher block is longer than the original
A . . . Z and a . . . z) in the question name, to encode transac-                   query in terms of bytes, bits are read in sequential fashion
tional state information. The mixed pattern of upper and lower case                 from the cipher block. The query field, called buff is read


                                                                          6
                              (a) RTT Density                                                             (b) ECDF of RTT

                Figure 4: (a) Distribution of RTT times in OR-SOA experiment. (b) Cumulative density of RTT times.



      one byte at a time. Step B in Figure 5 shows the encoding of          5. ANALYSIS
      all “0x20 capable” characters (i.e., A-Za-z.) In such a case,            Our proposed criteria in Section 1 requires that DNS-based anti-
      one reads the next bit j from the ciphered block, and:                poisoning measures result in improved security. DNS-0x20 en-
                                                                            coding improves the forgery resistance of DNS messages only in
       (a) if the jth bit is 0, make the i query character upper case       proportion to the number of upper or lower case characters in a
           (i.e., buff[i] |= 0x20).                                         given query. For example, the domain cia.gov has only 26 addi-
       (b) if the jth bit is 1, make the i query character lower case       tional combinations for the attacker to guess in a poisoning attack,
           (i.e., buff[i] &= 0x20).                                         while licensing.disney.com has 218 . In the pathological
                                                                            case, queries for a ccTLD (country code top-level domains, e.g.,
                                                                            “.cx”), would enjoy just two additional bits.
   5. This produces a 0x20-encoded domain name, as shown in
                                                                               To see if DNS-0x20 improves the average case, we gathered
      the final segment of Figure 5. This can be sent to an author-
      ity server. Likewise, it can be used to verify the query field        DNS traces (using passive DNS [35]) from a university network
      returned by an authority server.                                      for several months, and examined the query fields extracted answer
                                                                            packets. We selected only packets that had AA-bit flags enabled,
                                                                            indicating they contained authority responses. In total, the traffic
   The mathematical operations used to change case (∧ = 0x20                amounted to 5.6 million packets.
and ∨ = 0x20, above) suggested the name for the “DNS-0x20                      Figure 7(a) shows a correlation between the number of 0x20-
encoding” scheme. I.e., upper and lower case characters are 0x20            capable characters, and the overall length of the query (excluding
bits apart in the ASCII table, and the 0x20th bit in a query becomes        the “.” characters between labels). The vast majority of do-
a channel.                                                                  mains were under 50 characters. For this grouping, over 2/3 of
   Since the encoding bits are derived from the domain name, the            the characters were 0x20 capable. Some clusters of longer pack-
system is stateless. That is, the DNS server does not have to re-           ets occur at 100, 150 and about 200 character intervals, and have
member that a query has been sent, and how it encoded the 0x20-             decidedly fewer 0x20-capable characters. An inspection of these
capable characters. If one were to include such state in a DNS              packets shows them to be DNSBL and sensor-related traffic. For
server, it would likely be a DDoS target (at worst), or introduce           example, some mail servers encode state information in lengthy al-
performance overheads in accessing main memory (at best). Ob-               phanumeric labels, which are then checked against centrally run
viously, other implementations are possible, and we suggest this            DNSBLs.
merely as an engineering efficiency, not as a requirement.                     Figure 7(b) also illustrates how domain depth relates to the num-
   A secure encoding scheme, such as AES, can be used to make               ber of available DNS-0x20 characters. In the far corner of Fig-
sure that attackers do not guess the encoding key. We do not con-           ure 7(b), when one encounters domains with ≈ 34 labels (i.e. sep-
sider issues of key management in our proposal. However, we note            arated by nearly many periods), the number of usable DNS-x20
that, if a weak encoding system is used, attackers may interact with        characters is small. Domains with such a depth correspond to re-
an 0x20-encoding DNS server repeatedly, asking for labels in a              verse IPv6 lookups, where only the A ...F hex characters (or
zone the attacker controls, in an attempt to mount a plain text at-         dot-separated nibble bits) in IPv6 address can be case flipped.
tack.                                                                          For the most part, however, Figure 7(b) shows that with increased
   We see this attack as orthogonal. To prevent such attacks on an          domain depth, the number of DNS-0x20 capable characters in-
0x20-enabled server, the key can be changed out frequently, based           creases slightly. This is confirmed in Figure 7(d) which compares
on use or time. Thus, figure 5 shows one of several keys being              domain depth to all non-0x20 characters. Figure 7(c) gives some
selected to encode a query. Keys can be retired after repeated use          further insights into the variance of DNS-0x20 characters. This
to minimize the risk of such attacks. Other implementations are             plots the number of digits, in proportion to the length of the domain
also possible.


                                                                        7
        (a) Comparison of DNS Transaction Protection Techniques                                        (b) Improved Resistance

Figure 6: (a) A comparison of various DNS anti-forgery techniques shows the improvements due to DNS-0x20 encoding. (b) Effect
of 0x20-Encoding on attack success probabilities, for various character counts. The 0x20 encoding particularly helps DNS servers
that cannot implement port randomization schemes, because of platform resource limitations.



name. There is an obvious linear correlation, where some domain             domization, the DNS server enjoys the growth curve found in lines
names are nearly entirely composed of digits. The diagram thus              “b” and “c”. This plot also shows that excluding well known ports
shows “stair cases” of clusters, with approximately 50, 70, and 90          (e.g., ≤ 1024) is just a linear reduction of an exponential term, does
digits.) This group corresponds to reverse DNS lookups, and other           not significantly affect outcomes. (I.e., 216 ≫ 1024).
customized DNSBL formats that use numerical encodings. The                     Using DNS-0x20, we can restate our simple model of DNS poi-
bulk of the observations made in Figure 7(c), however, appear in            soning. The chance that the nth packet would successfully poison a
the lower corner of the plot, below 50 characters in length. Since,         DNS server, for the domains, d, usually handled by the DNS server:
on average, domain names with ≤ 50 characters total have only
≤ 10 characters devoted to numbers, there are many characters                                          n−1
                                                                                                       Y„                       1
                                                                                                                                                 «
available for DNS-0x20 encoding.                                            PCumulativeSuc(n) = 1−            1−     ¯
   As a whole, Figure 7 shows there is variation in the number of                                      i=0
                                                                                                                   2ℓ(d) ∗ α ∗ θ ∗ (β − γ) − i
DNS-0x20 characters in DNS lookups. The Figure also illustrates
interesting types of lookups (e.g., reverse DNS) that tend to be poor          Figure 6(b) plots the resulting probability of success for an at-
in DNS-0x20 lookups. While such queries could be poisoned, we               tacker. Unlike the plot in Figure 3, we fix the number of additional
suspect that attackers are more likely to target “high value” do-           authority servers to 3 (a conservatively high number usually seen
mains, such as banks, social networking sites, and auction sites.           in enterprise networks; most networks tend to have just two). The
                                                                            average number of 0x20 characters handled by the server, ℓ(d),   ¯
These domains are composed almost of entirely of 0x20-capable
characters, and would benefit even more from mixed-case encod-              is represented on the y-axis. Figure 6(b) shows how DNS-0x20
ing. Figure 8(a)-(b) presents a CDF and histogram of the 0x20               has the most improvement for DNS servers using only the random-
characters in all domain queries. It demonstrates that overall, 25%         ized ID field and a single port. The chance of success dips with
of domain queries provide approximately 20 0x20-capable charac-             more 0x20 characters in each query. (As noted, the average num-
ters; about 80% had at least 12 available 0x20 characters.                  ber of such characters was 12 in our sample study, with a median
   To express the average security improvements of DNS-0x20, we             of 16.) While not as dramatic a reduction as the use of randomized
therefore define a convenience function ℓ, which returns the num-           ports (which provide at least 14 bits on average), 0x20 encoding re-
ber of 0x20 characters in a domain name. A DNS server that per-             duces the attacker’s chance of success. Recall that above a certain
forms both ID field and port-encoding will have, on average, ℓ̄ ad-         threshold, exponential growth becomes quite punishing. Each bit
ditional bits of entropy, or 232+ℓ̄ possible values. As shown above,        of DNS-0x20 encoding doubles the work an attacker must perform
for many types of queries, ℓ̄ ≈ 12. Note that each additional bit           to achieve similar poisoning results.
doubles the number of combinations that an attacker must guess
correctly. Exponential growth is punishing, particularly for larger         5.1 0x20 probing
exponents. Figure 6(a) shows the search space an attacker must                 Our criteria for a practical DNS-based protection system also re-
guess against, for a simple encoding of ibm.com. The x-axis is the          quires that it be widely deployable. To evaluate this, we checked
total number of bits available to encode transaction identities. The        which authority servers supported and preserved DNS-0x20 encod-
y-axis indicates the number of possible combinations (or the de-            ings. Conceptually, this can be done by posing a mixed-case query
nominator in any probability model for successful guessing). If the         to authority servers regarding labels within their delegation zone.
DNS initiator merely used the ID field, and a single (non-variable)         For example, one might ask ns1.google.com (one of the listed
source port, the additional benefits of 0x20-encoding are shown in          authorities for the google.com zone) the following:
the line labeled “a” in Figure 6(a). Note that by adding port ran-
                                                                                  dig     @ns1.google.com            wWW.GooGle.COm


                                                                        8
                   (a) Query Length vs. 0x20 Chars                                      (b) Domain Depths vs. 0x20 Chars




                     (c) Query Length vs. Digits                                          (d) Domain Depths vs. Other

Figure 7: (a) Correlation plots of query lengths against the number of 0x20-available characters. (b) Domain depth vs 0x20 charac-
ters. Since most high-value user sights (e.g., banks) are only 3LDs, the decline in 0x20-characters in deeper domain depths may not
be as significant. (c) Query length and digits. (d) Domain depth vs other other characters.




                                                                9
                   (a) CDF of 0x20 Characters in Trace                                          (b) Histogram of 0x20 Character Counts

Figure 8: (a) CDF of number of 0x20 characters in domain names, observed in the passive DNS trace. (b) Histogram of the number
of 0x20 characters.



        NS Vendor                           Pct. Population                  DNS-0x20 compliant. It appears, however, that less than 0.28% of
        JHSOFT simple DNS plus                    39%                        the servers behave this way.
        incognito DNS commander                  1.9%
        v2.3.1.1 – 4.0.5.1                                                       Type         Mismatch      Mismatch pct.     Domain scanned
        DJ Bernstein TinyDNS 1.05                0.5%                          .com TLD        15451          0.327%            4786993
        ISC BIND 8.3.0-RC1 - 9.4.0a0              7%                           .net TLD         4437          0.204%            2168352
        menandmice QuickDNS                      1.5%
        Sourceforge JDNSS                        0.1%                        Table 2: Authority servers preserving 0x20 encoding, by TLD
        Timeout and no matches                   50%
                                                                                Thus, over 99.7% of all DNS servers we studied could support
      Table 1: DNS Servers Reporting 0x20 mismatches.                        our DNS-0x20 encoding scheme without changing their code base.
                                                                             Those that don’t support it appear inconsistent in their “flattening”
                                                                             of queries. We therefore deem that 0x20 is not a radical departure
   The returned answer should repeat the query, bit for bit, includ-         from existing protocols, and very likely to be adopted. We will
ing the chosen case variation. One must also check this behavior             of course test this view in our IETF standards submission, which
under relatively high volumes, over time, and from different loca-           seeks to codify what authority servers appear to already do.
tions.
   Unfortunately, there is no available academic testbed of all known        6. RELATED WORK
DNS authority servers. So, to evaluate if DNS servers could handle              Our proposal fits into the larger debate about how to better secure
our encoding schema gracefully, we scanned the Internet non-stop             DNS systems. In [26], the authors consider how transitive trust (via
for 3 weeks, targeting the authority servers listed in the .com and          insecure secondaries) provides another potential avenue for attack-
.net zone files. These zone files list some 75 million name servers          ing DNS servers. Our work, in contrast, proposes a precise model
(in aggregate), on average; our probes amounted to some 7 million            for characterizing the risk to a DNS server, and is restricted to poi-
queries, spread across every DNS server listed in these TLD zones.           soning attacks, rather than attacks on secondaries.
   The results of our scans are shown in two matrices, in Table 2.              Some proposed standards RFCs have considered improving DNS
There appear to be just a few DNS servers that do not perform                security. For example, TSIG [33] or SIG(0) [2], and TKEY [3]
proper DNS-0x20 encoding, under certain circumstances. Alto-                 all seek to improve message integrity. TSIG and SIG(0) use keys
gether, they amount to ≈ 0.3% of the servers we contacted. We                between servers to verify messages. These techniques, while ef-
tended to observe a failure to preserve DNS-0x20 encodings un-               fective against forgery attacks, have proved difficult to deploy, be-
der very high query volumes, e.g., dozens of identical queries per           cause of the need for key pairing between servers, and their strict
second, for the same domain.                                                 time synchronization requirements. TKEY solves the key distribu-
   Table 1 shows the results of DNS fingerprinting scans of these            tion problem, but has considerable computational costs that may
servers. A few of these authority servers, e.g., BIND, are known             be leveraged in a DDoS attack on the DNS server. DNS-0x20, by
(because of source code) to DNS-0x20 compliant. Although DNS                 contrast, is extremely light weight, and requires no coordination be-
fingerprinting is approximate, we surmise that some networks (and            tween pairs of DNS communicators. But unlike TSIG, SIG(0) and
not the DNS servers) have server load balancers or hardware accel-           TKEY, DNS-0x20 does not provide strong support against DNS
erators for their DNS farm. We are continuing our efforts to iden-           forgery. Instead, DNS-0x20 raises the bar.
tify and contact the operators of these networks. Notably, google               A recent proposed IETF standard called “Domain Name Sys-
recently changed the behavior of its l.google.com host, to be                tem (DNS) Cookies” is related to our approach [1]. Like our ap-


                                                                        10
proach, DNS Cookies attempt to provide weak, yet practical DNS               7.1 Future Works
transactional protection, but creating an OPT RR option. The DNS                We endeavored to create practical DNS-based security enhance-
cookie is essentially an HMAC of the requestor’s IP, and transac-            ments that can be rapidly adopted. No doubt, there will be many
tion. While still lightweight compared to other DNS transaction              issues that arise in DNS-0x20 implementation that we have not con-
protection systems, e.g., TSIG, DNS Cookies do require substan-              sidered. For example, as alluded to in Section 1, there may be key
tially more implementation. Specifically, it requires DNS initiators         management issues to consider.
and responders make code changes to handle the DNS cookies. In                  Our future work will address other efficient, stateless encod-
comparison, DNS-0x20 is even lighter weight, and requires only               ing schemes for domain names, using the 0x20 bitset of queries.
implementation on a single recursive resolver to work.                       We will also consider modifications and implementation strategies
   A recent IETF draft on DNS forgery resilience discusses many              for resource-limited systems, such as embedded devices and home
aspects of DNS poisoning [4]. We recommend the IETF draft as                 DSL systems. Although our system does not penalize recursive
an excellent overview of DNS poisoning, and practical counter-               DNS servers that refuse to implement DNS-0x20, our future work
measures.                                                                    will also consider techniques to update deployed embedded DNS
   DNS poisoning motivated the work in [37], where the authors               systems. We will also consider policy options for DNS-0x20 re-
proposed DoX, a peer-to-peer DNS replacement. Their approach                 cursive servers, so they can identify and work around the few (≈
requires the creation of verification channels, using a P2P system.          0.3%) DNS servers that may not support DNS-0x20 encoding.
In contrast, our system uses an existing channel in the working                 We also note that DNS-0x20 does not create, but rather exploits
DNS system. Similarly DoX requires a peer system to improve                  for beneficial purposes, a covert channel within DNS. Future work
DNS security. Our approach can be implemented by a single recur-             will measure the capacity of such a channel, and note how DNS-
sive server today, and immediately improves the integrity of mes-            0x20 encoding indirectly contributes to a reduction in the capacity
sages to authority servers.                                                  of a malicious (if somewhat obvious) covert channel.
   We believe that the work most related to ours is found outside
of the DNS field. TCP SYN Cookies were first proposed by DJ
Bernstein and Eric Schenk in 1996, as a means to stop resource ex-           Acknowledgements
haustion DDoS attacks on TCP stacks [10]. The idea behind SYN                This material is based upon work supported in part by the Na-
Cookies is superficially similar to our DNS encoding scheme. Both            tional Science Foundation under Grant No. 0627477 and the De-
save server state to efficiently associate two packet events in time.        partment of Homeland Security under Contract No. FA8750-08-
Both add this state by overloading the meaning of a protocol field.          2-0141. Any opinions, findings, and conclusions or recommenda-
In the case of SYN Cookies, a selected TCP sequence number has               tions expressed in this material are those of the authors and do not
two meanings: that from the protocol, and also an HMAC. Ran-                 necessarily reflect the views of the National Science Foundation
domized DNS ports, also proposed by DJ Bernstein, uses a simi-               and the Department of Homeland Security.
lar field-overloading logic. We believe DNS-0x20 is in that same
spirit: field overloading yields additional state, and can be done by
only one party in a transaction to improve security.                         8. REFERENCES
                                                                              [1] Donald E. Eastlake 3d. Domain name system (dns) cookies.
7.    CONCLUSION                                                                  http://tools.ietf.org/html/
                                                                                  draft-eastlake-dnsext-cookies-03, 2008.
   DNS poisoning attacks present a persistent, ongoing threat to the
                                                                              [2] D. Eastlake 3rd. Dns request and transaction signatures
Internet’s critical infrastructure. There have been many proposed
                                                                                  (SIG(0)s).
solutions, both from the operator and academic communities. The                   http://tools.ietf.org/html/rfc2931,
lack of adoption and delays in deployment suggest the need for                    September 2000.
very-light weight, practical improvements to DNS security. We
                                                                              [3] D. Eastlake 3rd. Secret key establishment for DNS (TKEY
therefore considered solutions that provide incomplete security, but
                                                                                  RR). http://tools.ietf.org/html/rfc2930,
nonetheless offer measured improvements.
                                                                                  September 2000.
   To be successful, we argued that such a protocol must: (a) re-
quire no radical changes to the DNS infrastructure; (b) make no               [4] A. Hubert and R. van Mook. Measures for making dns more
major changes to the existing protocol; and (c) be backwards com-                 resilient against forged answers.
patible, so that even just a few DNS servers can elect to adopt it.               http://tools.ietf.org/html/
We believe these elements will speed the adoption of the security                 draft-ietf-dnsext-forgery-resilience-06,
measure.                                                                          July 2008.
   DNS-0x20 encoding meets these requirements, but necessarily                [5] M. Andrews. The dnssec lookaside validation (dlv) dns
at the cost of complete protection. It does not require a radical re-             resource record, rfc 4431.
structure of the DNS infrastructure, and can be adopted unilaterally              http://tools.ietf.org/html/rfc4431, 2006.
by recursive servers. With small exceptions (≈ 0.3%) the world’s              [6] D. Barr. Common dns operational and configuration errors.
authority servers appear to already preserve the encoding scheme.                 http://tools.ietf.org/html/rfc2845, 1996.
Indeed, DNS vendors are now incorporating the system into their               [7] Saad Biaz and Nitin H. Vaidya. Is the round-trip time
code bases.                                                                       correlated with the number of packets in flight? In
   But unlike complete, heavy-weight solutions to DNS poisoning,                  Proceedings of the ACM SIGCOMM Internet Measurement
DNS-0x20 encoding does not provide strong guarantees for trans-                   Conference (IMC’03), 2003.
action integrity. Using large trace files, we found that on average,          [8] David Dagon, Niels Provos, Christopher P. Lee, and Wenke
DNS messages can have an additional 12-bits of state. The slow                    Lee. Corrupted dns resolution paths: The rise of a malicious
adoption of other, more complete DNS transaction protection sys-                  resolution authority. In Proceedings of Network and
tems suggests the immediate need for this light-weight solution.                  Distributed Security Symposium (NDSS ’08), 2008.


                                                                        11
 [9] DJ Bernstein. The dns_random library interface.                     [27] Sid Stamm, Zulfikar Ramzan, and Markus Jakobsson.
     http://cr.yp.to/djbdns/dns_random.html,                                  Drive-by pharming. http:
     2008.                                                                    //www.cs.indiana.edu/~sstamm/papers/
[10] DJ Bernstein. SYN cookies.                                               drive-by-pharming-router-dns-stamm-ramzan-jakobsson
     http://cr.yp.to/syncookies.html, 2008.                                   pdf, 2006.
[11] Krishna P. Gummadi, Stefan Saroiu, and Steven D. Gribble.           [28] Joe Stewart. DNS cache poisoning – the next generation.
     King: estimating latency between arbitrary internet end                  http://www.secureworks.com/research/
     hosts. In Proceedings of the 2nd ACM SIGCOMM Workshop                    articles/dns-cache-poisoning/, 2003.
     on Internet measurment, pages 5–18, 2002.                           [29] US Cert. Vulnerability note vu#457875.
[12] Internet Assigned Numbers Authority. Port numbers. http:                 http://www.kb.cert.org/vuls/id/457875,
     //www.iana.org/assignments/port-numbers,                                 2002.
     2008.                                                               [30] US-CERT. Multiple dns implementations vulnerable to cache
[13] Dan Kaminsky. Its the end of the cache as we know it.                    poisoning.
     http://www.doxpara.com/DMK_BO2K8.ppt, 2008.                              http://www.kb.cert.org/vuls/id/800113,
[14] JungMin Kang and DoHoon Lee. Advanced white list                         2008.
     approach for preventing access to phishing sites. In                [31] Paul Vixie. DNS complexity. ACM Queue, 5(3), April 2007.
     International Conference on Convergence Information                 [32] Paul Vixie and David Dagon. Use of bit 0x20 in DNS labels
     Technology, 2007.                                                        to improve transaction identity. http://tools.ietf.
[15] Amit Klein. BIND 8 DNS cache poisoning. http:                            org/html/draft-vixie-dnsext-dns0x20-00,
     //www.trusteer.com/docs/bind8dns.html,                                   2008.
     2007.                                                               [33] Paul Vixie, O. Gudmundsson, D. Eastlake 3rd, and
[16] Amit Klein. BIND 9 DNS cache poisoning. http:                            B. Wellington. Secret key transaction authentication for DNS
     //www.trusteer.com/docs/bind9dns.html,                                   (TSIG). http://tools.ietf.org/html/rfc2845,
     2007.                                                                    May 2000.
[17] Amit Klein. OpenBSD DNS cache poisoning and multiple                [34] S. Weiler. Dnssec lookaside validation (dlv), rfc 5074.
     OS predictable IP ID vulnerability. http:                                http://tools.ietf.org/html/rfc5074,
     //www.trusteer.com/docs/dnsopenbsd.html,                                 November 2007.
     2007.                                                               [35] Florian Weimer. Passive dns replication.
[18] Amit Klein. Windows DNS cache poisoning. http://                         http://www.enyo.de/fw/software/
     www.trusteer.com/docs/microsoftdns.html,                                 dnslogger/first2005-paper.pdf, April 2005.
     2007.                                                               [36] Duane Wessels. The measurement factory open recursive dns
[19] Amit Klein. PowerDNS recursor DNS cache poisoning.                       reports. http://dns.measurement-factory.com/
     http://www.trusteer.com/docs/                                            surveys/openresolvers/ASN-reports/, 2007.
     powerdnsrecursor.html, 2008.                                        [37] Lihua Yuan, Krishna Kant, Prasant Mohapatra, and
[20] John Markoff. Leaks in patch for web security hole.                      Chen-Nee Chuah. DoX: A peer-to-peer antidote for DNS
     http://www.nytimes.com/2008/08/09/                                       cache poisoning attacks. In Proceedings of the IEEE
     technology/09flaw.html, August 2008.                                     International Conference on Communications (ICC’06),
[21] P. Mockapetris. Domain names - concepts and facilities.                  volume 5, pages 8164–9547, June 2006.
     http://www.faqs.org/rfcs/rfc1034, November
     1987.
[22] P. Mockapetris. Domain names - implementation and
     specification.
     http://www.faqs.org/rfcs/rfc1035, November
     1987.
[23] NIST. Announcing the advanced encryption standard (aes).
     ttp://csrc.nist.gov/publications/fips/
     fips197/fips-197.pdf, 2001.
[24] KyoungSoo Park, Vivek S. Pai, Larry Peterson, and Zhe
     Wang. Codns: Improving dns performance and reliability via
     cooperative lookups. In In Proceedings of the Sixth
     Symposium on Operating Systems Design and
     Implementation(OSDI ’04), 2004.
[25] V. Ramasubramanian and E.G. Sirer. The design and
     implementation of a next generation name service for the
     internet. Proceedings of the 2004 conference on
     Applications, technologies, architectures, and protocols for
     computer communications, pages 331–342, 2004.
[26] Venugopalan Ramasubramanian and Emin Gun Sirer. Perils
     of transitiive trust in the domain system. In Proceedings of
     the ACM SIGCOMM Internet Measurement Conference
     (IMC’05), 2005.



                                                                    12
