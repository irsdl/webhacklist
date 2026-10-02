---
type: Whitepaper
title: "DNS Cache Poisoning Attack: Resurrections with Side Channels"
description: "Novel side channels in the Linux kernel let an off-path attacker use ICMP fragment-needed and redirect messages to scan a DNS resolver's UDP ephemeral port, because the shared next-hop exception cache leaks which port is open. Derandomising the port defeats the main defence against DNS cache poisoning, letting forged records be injected into resolvers such as BIND, Unbound and dnsmasq."
resource: "https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf"
tags: [whitepaper, webseclist-reference, cache-poisoning, side-channel, dns, info-leak, measurement-study, large-scale-scan, mitigation]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:35:34+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf"
    title: "DNS Cache Poisoning Attack: Resurrections with Side Channels"
    author: "Keyu Man, Xin'an Zhou, Zhiyun Qian"
also_at: []
authors:
  - Keyu Man
  - "Xin'an Zhou"
  - Zhiyun Qian
canonical_url: ""
cited_by:
  - "2021.md:59"
commit: ""
content_sha256: 8fc359b5e3a55166d826683bc08b89d428c05898dda25b8ae3fae10bf1801ec8
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 285348238e1453af785253da8bbd1e4ba41081c23566393003c3960304917844
retrieved_from: "https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:35:34+00:00"
slug: dns-cache-poisoning-attack-resurrections-side-channels
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# DNS Cache Poisoning Attack: Resurrections with Side Channels

**DNS Cache Poisoning Attack: Resurrections with Side Channels** - Keyu Man, Xin'an Zhou, Zhiyun Qian, Publisher not stated.

- Published: date not stated
- Original: <https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf>
- Preserved from: https://www.cs.ucr.edu/~zhiyunq/pub/ccs21_dns_poisoning.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# DNS Cache Poisoning Attack: Resurrections with Side Channels

DNS Cache Poisoning Attack: Resurrections with Side Channels
                       Keyu Man                                                  Xin’an Zhou                                    Zhiyun Qian
              kman001@ucr.edu                                             xzhou114@ucr.edu                                 zhiyunq@cs.ucr.edu
       University of California, Riverside                         University of California, Riverside               University of California, Riverside
              Riverside, CA, USA                                          Riverside, CA, USA                                Riverside, CA, USA
ABSTRACT                                                                                    domain names into machine-readable IP addresses. This basic func-
DNS is one of the fundamental and ancient protocols on the Internet                         tionality has also now been used by various security services such
that supports many network applications and services. Unfortu-                              as email authentication [35], routing security (e.g., RPKI [42]), and
nately, DNS was designed without security in mind and is subject                            even certificate issuance where proof of domain ownership is the
to a variety of serious attacks, one of which is the well-known DNS                         common method to acquire certificates [5] . As a result, compro-
cache poisoning attack. Over the decades of evolution, it has proven                        mising DNS can lead to catastrophic security failures with a wide
extraordinarily challenging to retrofit strong security features into                       range of consequences [20] (e.g., man-in-the-middle attacks and
it. To date, only weaker versions of defenses based on the principle                        fake TLS certificates being issued [13]).
of randomization have been widely deployed, e.g., the randomiza-                               Despite its critical role, DNS has been a fragile part of the security
tion of UDP ephemeral port number, making it hard for an off-path                           chain. Historically, efficiency was the primary consideration of DNS,
attacker to guess the secret. However, as it has been shown recently,                       leading to the design of a single query and response over UDP,
such randomness is subject to clever network side channel attacks,                          which is still the primary mechanism used today. Although security
which can effectively derandomize the ephemeral port number.                                features like DNSSEC and DNS cookies have been standardized,
    In this paper, we conduct an analysis of the previously over-                           they are not widely deployed due to backward compatibility. This
looked attack surface, and are able to uncover even stronger side                           led to a series of DNS cache poisoning attacks [33, 36, 45] that allow
channels that have existed for over a decade in Linux kernels. The                          an off-path attacker to poison a DNS cache with a malicious record
side channels affect not only Linux but also a wide range of DNS                            to map a domain to an arbitrary IP address. The earliest such attack
software running on top of it, including BIND, Unbound and dns-                             dates back to 1997 [58]. In 2008, Dan Kaminsky identified a way to
masq. We also find about 38% of open resolvers (by frontend IPs)                            bypass the standard bailiwick checks [36]. Recently, a side-channel
and 14% (by backend IPs) are vulnerable including the popular DNS                           based DNS cache poisoning attack [45], dubbed SADDNS [1, 45],
services such as OpenDNS and Quad9. We have extensively vali-                               was developed that can effectively derandomize the ephemeral port
dated the attack experimentally under realistic configuration and                           in a DNS query.
network conditions and showed that it works reliably and fast.                                 In SADDNS, the key insight is that a shared resource, i.e., ICMP
                                                                                            global rate limit shared between the off-path attacker and victim,
CCS CONCEPTS                                                                                can be leveraged to send spoofed UDP probes and infer which
                                                                                            ephemeral port is used. Unfortunately, it is unclear how many more
• Security and privacy → Network security; Operating systems
                                                                                            such side channels exist in the network stack. In this paper, we
security; • Networks → Cross-layer protocols; Naming and ad-
                                                                                            explore a non-conventional type of port scan packets, i.e., ICMP
dressing.
                                                                                            packets which are by design error messages and cannot solicit
                                                                                            any explicit response. This is distinct from SADDNS where it has
KEYWORDS
                                                                                            considered UDP packets which are conventional port scan packets.
DNS, cache poisoning, side channel, attack, ICMP, fragment                                  Even though it is known that ICMP can interact with UDP/TCP [4,
ACM Reference Format:                                                                       48], e.g., shutting down a socket (with an ICMP port unreachable
Keyu Man, Xin’an Zhou, and Zhiyun Qian. 2021. DNS Cache Poisoning                           message), it is not immediately obvious how ICMP probes can allow
Attack: Resurrections with Side Channels. In Proceedings of the 2021 ACM                    an off-path attacker to infer the ephemeral port number selected
SIGSAC Conference on Computer and Communications Security (CCS ’21),                        for a UDP socket. Surprisingly, we uncover novel side channels
November 15–19, 2021, Virtual Event, Republic of Korea. ACM, New York, NY,                  that have been lurking in the Linux network stack for over a decade
USA, 15 pages. https://doi.org/10.1145/3460120.3486219
                                                                                            and yet were not previously known.
                                                                                               The successful exploitation of these side channels in the context
1     INTRODUCTION                                                                          of DNS hinges on the subtle interactions among three different
Domain Name System (DNS) is one of the most important infras-                               layers, i.e., ICMP, UDP, and application. Interestingly, due to the
tructures of the modern Internet. It translates the human-readable                          lack of documentation and awareness, such interactions are often
                                                                                            neglected and misconceived, leading to many exploitable scenarios.
Permission to make digital or hard copies of part or all of this work for personal or
classroom use is granted without fee provided that copies are not made or distributed       In addition to novel side channels, we also find that ICMP messages
for profit or commercial advantage and that copies bear this notice and the full citation   can be used to DoS DNS transactions, indirectly assisting the cache
on the first page. Copyrights for third-party components of this work must be honored.
For all other uses, contact the owner/author(s).
                                                                                            poisoning attack.
CCS ’21, November 15–19, 2021, Virtual Event, Republic of Korea                                We have comprehensively characterized the impact of the side
© 2021 Copyright held by the owner/author(s).                                               channels. They affect the most popular DNS software including
ACM ISBN 978-1-4503-8454-4/21/11.
https://doi.org/10.1145/3460120.3486219
                                                                                            BIND, Unbound, and dnsmasq running on top of Linux. In addition,
we estimate that they affect 13.85% of open resolvers. Finally, we       depending on the nature of the error and the socket options set
evaluate the end-to-end attack on the latest BIND resolver and a         by the application, the source may ignore the error, remedy the
home router and find that it is reliable and takes only minutes to       situation by taking actions in the OS kernel (e.g., updating routing
succeed. To mitigate the attack, we suggest setting proper socket        entries) and/or reporting the error to the application layer through
options, randomizing the caching structure, and rejecting specific       the socket interface.
ICMP messages when possible.                                                Below we describe a few relevant ICMP message types that have
  We summarize our contributions as the followings:                      interesting interactions with UDP:
• We discovered novel side channels that allow us to use ICMP            • Fragment Needed Such messages are typically sent by a router
  probes to scan UDP ephemeral ports.                                      to signal the source that the size of its packet has exceeded the
• We thoroughly analyzed the root cause of the discovered side             MTU of the next hop [4, 47]. Specifically, they are called “frag-
  channels and developed powerful DNS cache poisoning attacks              mentation needed and DF set” or “packet too big” for IPv4 and
  based on that.                                                           IPv6 respectively. The desired MTU is included in the message
                                                                           so that the source OS can take actions, e.g., updating its PMTU
• We measured their impact in the real world and proposed corre-
                                                                           cache for the corresponding destination, and reducing the size
  sponding mitigations.
                                                                           of all future packets with the same destination address.
                                                                         • Redirect Redirect messages [48, 56] are usually sent back to
2     BACKGROUND
                                                                           the source by the next-hop router (e.g., gateway) to signal a
In this section, we will introduce the necessary background re-            shorter route to a destination. After the source receives such
garding the two types of UDP ephemeral ports that an attacker              a message, it will update its routing table and route all future
would want to scan to conduct the DNS cache poisoning attack. We           packets to that destination through the new gateway, which is
will then introduce the ICMP messages that interact with UDP in            specified in the redirect packet. This message is only supposed to
interesting ways.                                                          be sent by the gateway, and therefore, the OS of the source usually
                                                                           checks the source IP of the ICMP message before accepting the
2.1    Public-facing and Private-facing UDP Ports                          redirection [56].
Traditionally, port scans refer to scanning server ports as the inten-   • Host/Port Unreachable Such messages are used to signal the
tion is to infer which services are running. However, in the context       source that the original packet was sent to the wrong host or port
of DNS cache poisoning attacks, the goal is to scan ephemeral              and thus cannot be delivered [4, 48]. According to RFCs [4, 12],
ports instead (more details are provided in §3). Interestingly, as         upon receiving such messages, the OS must notify the application
well summarized in [45], unlike TCP, UDP ephemeral ports can               as long as a socket is found based on the embedded four-tuple in
be further divided into two types: (1) public-facing and (2) private-      the ICMP message.
facing. This is due to the stateless nature of UDP, as stated in RFC
8085 [41]. Specifically, if a client sends a UDP packet by invoking                   = Cache
sendto() with a specific remote IP as an argument, the client OS
will in fact accept packets from “any IPs” when it subsequently
invokes recvfrom(). Therefore, by default, any UDP ephemeral
port will become public-facing. Only if the client explicitly invokes
                                                                                                                                Authoritative
connect() will the OS reject packets from all but the one “con-              Stub Resolver       Forwarder       Resolver
                                                                                                                                Name Server
nected” remote IP [41]. This effectively makes the ephemeral port                               Figure 1: DNS Hierarchy
private-facing.
   As shown in the prior work [45], public-facing ephemeral ports        3    THREAT MODEL AND WORKFLOW
are generally easier to scan. Interestingly, whether an ephemeral        In this section, we will describe the general threat model used in
port is public-facing also has ramifications with regard to the new      DNS cache poisoning attacks.
side channels we identify. We will describe them later in §4.4.          DNS Hierarchy and Attack Targets. Figure 1 shows a typical
                                                                         DNS Hierarchy. The stub resolver (usually provided by OS) runs
2.2    ICMP Messages and Impact on UDP                                   on an individual client and acts as a proxy—it only forwards the
As first introduced in RFC 792 [48], ICMP is a diagnostic protocol       query to the upstream DNS server without resolving the query
used to signal errors during the delivery of IP packets. This can        itself. The sole purpose of the stub resolver is to provide the local
happen, for example, when a router discards the packet and return        cache to speed up DNS queries from the same host. In the next layer
an ICMP TTL expired message back to the source after it detects          up, DNS forwarders are also caching proxies—common in home
that the TTL of the forwarded packets reaches zero. To allow the         and business gateways (e.g., Wi-Fi router) [6, 40, 54], but they serve
source to distinguish which packets have encountered errors, a           multiple clients in a LAN. At the highest layer, DNS resolvers finally
partial copy of the packet is embedded in the ICMP message, which        perform the real name resolution task by recursively consulting
includes the source and destination address, source and destina-         the name servers, where the actual DNS records are stored. Re-
tion port. According to recent RFCs [27], the source should accept       solvers are usually operated by ISPs or tech companies (e.g., 8.8.8.8
such messages only if the wrapped four-tuple matches an existing         operated by Google) and generally serve many more clients. As
socket. Upon validating the correctness of such an ICMP message,         a result, DNS resolvers are the most prolific and impactful attack
targets. Furthermore, some resolvers, e.g., those offered by Google        on the resolver. (3) The 16-bit transaction ID in the DNS payload
and Cloudflare, are even open to the public and are accessible by          has to match the one randomly selected by the resolver [46].
everyone, making them more accessible to attackers as well.                    If a rogue response with all the matching fields arrives before
    Nevertheless, since stub resolvers, forwarders and resolvers are       the legitimate one sent by the name server, then the resolver will
all equipped with DNS caches, they are all potentially subject to          accept and cache the rogue results. This can be an insurmountable
DNS cache poisoning attacks. [9, 32, 59] proposed the cache poi-           hurdle as an attacker needs to effectively enumerate all possible
soning attacks that only work against DNS forwarders instead of            32-bit values (equivalent to ~4 billion values) within a small time
resolvers, because they exploited the unique position or design            window, i.e., the RTT between the resolver and name server. Even
goals of the forwarder. Specifically, [9, 32] assume the attacker is       if an attacker can repeat the attempts over many queries, it is still
under the same NAT gateway as the forwarder, however However,              a largely infeasible attack.
resolvers are not usually behind NAT. [59] is based on the fact that           In summary, there are 6 steps of the attack.
the forwarders rely on the resolvers to perform the bailiwick check
                                                                           (1) Identify the victim resolver, the domain to poison, and its name
and thus become vulnerable. To our knowledge, there are only
                                                                               server.
two practical attacks [33, 45] that can work against the resolver
                                                                           (2) Slow down name servers and prevent them from responding to
in the past decade and SADDNS [45] is the only one using side
                                                                               the victim resolver (§6.1); this gives the attacker more time.
channels to launch poisoning attacks (which no longer works as
                                                                           (3) Start triggering the query on the resolver.
the vulnerability is already patched). In this paper, we will intro-
                                                                           (4) Infer the ephemeral port of the query using our new side chan-
duce novel side-channel-based cache poisoning attacks that affect
                                                                               nels (§4).
all DNS servers in the hierarchy. Our discussion focuses on DNS
                                                                           (5) Once the port is known, inject 65,536 rogue responses with
forwarders and resolvers.
                                                                               different TxIDs to the victim resolver by spoofing the name
Assumptions. Generally, an attacker needs two main capabilities
                                                                               server’s IP.
to launch the attack:
                                                                           (6) Check if the cache is poisoned. If not, go back to (3).
    (1) The ability to trigger one or more queries from the target
DNS server (forwarder or resolver). This is trivially satisfiable if the
DNS server is publicly accessible. In practice, there are hundreds of      4 ICMP-BASED EPHEMERAL PORT SCANS
thousands of them (see §5.2), including the popular ones such as           4.1 Prior Methods of UDP-Based Port Scans
1.1.1.1 and 8.8.8.8. If the DNS server is private, the attacker would
                                                                           Traditionally, UDP probes are used to determine whether a UDP
need to join the network directly or indirectly. For example, there
                                                                           port (specified as the destination port number in the probe) is open
are various open networks in coffee shops and airports which allow
                                                                           or closed. According to the RFCs [4, 48], if the destination replies
an attacker to easily join. It is also possible that an attacker can
                                                                           with an ICMP port unreachable message, it indicates that the port
trick a victim client in a private network to visit a malicious website
                                                                           is closed. This is traditionally used to probe server ports as shown
where malicious scripts can execute and trigger DNS queries.
                                                                           in Figure 2(a). In addition, as mentioned in §2.1, this can also be
    (2) The ability to send packets with spoofed IP addresses. This
                                                                           used to discover public-facing ephemeral ports. It is obvious that
is because the goal of the attack is to inject malicious records to
                                                                           the presence or absence of the ICMP response is explicit feedback
either the forwarder or resolver, and such rogue responses have to
                                                                           on the UDP probe.
come from a host that they contacted before, i.e., either the resolver
                                                                           SADDNS. To scan private-facing ephemeral ports, UDP probes
or the name server. This requirement is also not difficult to satisfy.
                                                                           must be sent using the source IP address of the remote peer, forcing
As shown in a 2019 report [44], there are still 30.5% and 32.1% of
                                                                           an off-path attacker to find an indirect way of performing the scan.
ASes in the world that do not block packets with spoofed source
                                                                           Based on this, in 2020, Man et al. [45] identified a global rate limit
IPv4 and IPv6 addresses respectively, which renders the attack still
                                                                           on the ICMP responses to UDP probes, enabling an attacker to
feasible today.
                                                                           send spoofed UDP probes and indirectly infer whether they have
Workflow. Taking the resolver attack as an example, the attacker
                                                                           solicited responses. Specifically, if a guessed port number (in a
is off-path, i.e., unable to modify or eavesdrop on the traffic between
                                                                           spoofed UDP probe) happens to match the correct ephemeral port,
the resolver and the name server. The first step of the attack is to
                                                                           the resolver will not generate an ICMP message (otherwise it would).
turn the resolver into a state where it is willing to accept responses
                                                                           This results in either a stationary limit counter or a decrement of the
from the name server. This can be achieved by simply sending
                                                                           counter. An attacker can then check whether the counter has been
a query to the resolver. After that, the attacker tries to forge a
                                                                           drained by attempting to solicit ICMP responses with a UDP probe
response packet and send it back to the victim resolver to poison
                                                                           from his real/non-spoofed IP. Fundamentally, this is a variant of
the cache. However, in order for the rogue response to be accepted
                                                                           the traditional UDP-based scan because the goal is still to indirectly
by a modern DNS resolver, several things have to match (there are
                                                                           infer the presence or absence of ICMP responses.
additional defenses that may be optionally and rarely deployed as
we will discuss in §8.3): (1) The source IP of the response should be
the name server. Since the attacker controls the domain name in the        4.2    ICMP-Based Port Scans
query, the corresponding name server can be easily looked up ahead         In contrast with the traditional methods of UDP-based port scans,
of time. (2) The 16-bit destination port number in the response has        in this paper, we investigate the ICMP-based port scans. As men-
to match the ephemeral port that is typically randomly generated           tioned in §2.2, an ICMP message embeds the header of the original
                                                                           packet from the source, including the source and destination port
                                                                           and the non-default gateway IP for specific remote IPs (updated
  Attacker          Victim Server
                                       Attacker           Victim Server    by ICMP redirect messages). These exception cache entries affect
                     Listen on 53                          Listen on 53

         UDP dport=53
                                                  ICMP                     the routing decisions for all future outgoing packets destined to
                                              (UDP dport=53)               the remote IPs in the entries. These entries are cached for some
         UDP dport=67                                                      time unless explicitly evicted due to a limit on the total number of
                                                  ICMP
        ICMP: 67 closed                       (UDP dport=67)               entries (details are provided in §4.5).
                                                                              One thing worth noting is that the OS does not check the source
 (a) UDP-based Port Scan (SADDNS)   (b) ICMP-based Port Scan (This Work)   IP address of the ICMP frag needed messages. This is by design
                 Figure 2: Ephemeral Port Scan                             as such messages can be generated by any router along the path.
                                                                           And due to the dynamic nature of the Internet, the victim resolver
information. This opens up an opportunity to craft an ICMP mes-            cannot easily verify if a given IP belongs to the routers along the
sage embedding a guessed port number, which is used to match a             path. This has an interesting implication that the attacker’s probes
specific socket on the receiver end [4, 48]. However, the challenge        of ICMP frag needed messages, which we will describe next, do not
is that ICMP messages are by design error messages useful for di-          need to spoof the source IP address at all.
agnostic purposes only, which do not solicit explicit responses [12].
This means that regardless of whether a port number is guessed             4.4    Public-Facing Port Number Inference
correctly, the receiver will not provide any response, as shown in         We illustrate the basic idea of public-facing ephemeral port scan
Figure 2(b), making the ICMP-based port scans seem infeasible.             in Figure 3(a) & 3(b). For ICMP frag needed, all we need to do is
    Surprisingly, we observe that an attacker does not necessarily         to send an ICMP frag needed message with the attacker’s own IP
have to rely on the explicit feedback from an ICMP probe. Instead,         address (which is unchecked by the resolver as mentioned above).
even if the processing of ICMP probes is completely silent, as long        The message embeds a UDP header with a guessed source port and
as there is some shared resource whose state is influenced, we may         a destination port of 53. It is also supposed to contain the source
find ways (other probes) to observe the changed state of the shared        and destination IP addresses, which should be the resolver’s IP
resource. This is a generalization of the prior probing methods that       and name server’s IP respectively. However, some popular DNS
rely on spoofed probes that by design can solicit responses from           software such as Unbound (IPv4 only) and dnsmasq produce public-
the victim. In addition to SADDNS whose probes are designed to             facing ephemeral ports as introduced in §2.1 (also called wildcard
solicit ICMP responses, it is also the case for the series of TCP side     sockets in the kernel terminology). It turns out that Linux (and
channels [14, 17, 43]. Specifically, [14] leveraged TCP probes that        other OSes) treat such public-facing ports much more liberally and
can solicit challenge ACKs; [17, 43] required TCP probes that can          accept any inner destination IP address in an ICMP message, as
solicit any response. In summary, it requires a leap of faith to realize   long as the inner source address matches the resolver’s IP and inner
the potential of the ICMP-based probes to scan UDP ports.                  source port matches the ephemeral port. This effectively means that
    In this project, we systematically investigated all types of ICMP      against such public-facing ports, one can easily trick the resolver to
and narrowed them down to two that are useful for port scans: ICMP         update the MTUs for any remote IPs (even though the resolver may
fragment needed (or ICMP packet too big in IPv6) and ICMP redirect.        not have even talked to them before). Therefore, in the attacker’s
Next, we will describe their processing logic in the Linux kernel          probe packets, we will use its own IP address to fill the destination
and the corresponding shared resources that form side channels.            IP of the embedded packet such that the MTU for the attacker’s IP
                                                                           will be lowered if the guessed ephemeral port is correct.
4.3    Analysis of ICMP Error Processing Logic                                 To observe the change in the cache, the attacker can simply
We use the ICMPv4 (ICMPv6 is similar) in the latest Linux ker-             send a PING or any other packet (verification packet) that will
nel (5.11.16 at the time of writing) as an example to illustrate this      trigger a reply (verification reply) from the resolver, and observe
(the logic is largely the same since 3.6). When the OS receives            if the response will be fragmented as a result of the lowered MTU.
an ICMPv4 message with an embedded UDP packet, it will in-                 As shown in Figure 3(b), if ICMP redirect is used for probing, the
voke __udp4_lib_err() to handle the error. Here the four-tuple             effect is that the victim resolver becomes unresponsive because the
in the wrapped UDP packet is first checked with the socket ta-             traffic to the attacker will now be redirected to a wrong gateway IP
ble (__udp4_lib_lookup()) to verify the legitimacy of the ICMP             (potentially black hole) set in the redirect message.
packet, i.e., it is indeed triggered by the packet the host sent before.
If it passes the check, the ICMP error will be handled according           4.5    Private-Facing Port Number Inference
to the type of error. Additionally, the ICMP error may optionally          Most DNS software (e.g., BIND) will produce private-facing ephemeral
be delivered to the application if the OS has received the proper          ports, rendering the previous method invalid. The first adjustment
socket options (which will be described in §5.1).                          we have to make is to set the inner destination IP address to the
    To handle the ICMP frag needed and redirect, two corresponding         IP of the name server. This is because __udp4_lib_lookup() will
kernel functions are invoked respectively: ipv4_sk_redirect()              check the complete four-tuple of the embedded UDP packet to lo-
and ipv4_sk_update_pmtu(). Both of them will update a global               cate the socket that has previously been “connected” to a specific
resource maintained in the routing module, called the next hop             remote IP and port (See §2.1). The exception cache state change is
exception (fnhe) cache. We refer to it as “exception cache” in short       therefore also “private” to the name server and not directly observ-
from here on. It stores various states including the non-default MTU       able by the attacker. For example, even if the MTU for the name
for specific remote IPs (updated by ICMP frag needed messages),            server is reduced, an off-path attacker cannot directly observe the
Victim r                        Off-path                       Victim r Victim r                            Off-path                            Victim r Victim r                                   Off-path                                 Victim r
port n open                    Attacker a                 port n closed port n open                        Attacker a                     port n closed port n open                                Attacker C1                         port n closed
                                                                                 Redirect Probe                          Redirect Probe                                  5 Plant Packets                               5 Plant Packets
       Frag Needed Probe                    Frag Needed Probe             S=gw, D=r    Redir    S=r, D=a   SP=n   S=gw, D=r    Redir    S=r, D=a    SP=n          D=r    M=1200      S=r, D=Cn   PING           D=r    M=1200    S=r, D=Cn   PING

 D=r    M=1200      S=r, D=a   SP=n   D=r    M=1200   S=r, D=a    SP=n    GW of a                                                                               fnhe Cache:                                                     fnhe Cache:
                                                                                                                                                GW of a
                                                                          1.1.1.100                                                                         C1->C2->C3->C4->C5                                              C1->C2->C3->C4->C5
  PMTU of a                                                                                                                                       gw
                                                           PMTU of a     (blackhole)                                                                                    Frag Needed Probe                             Frag Needed Probe
    1200
                                                            default                   Verify Ping                             Verify Ping                   D=r     M=1200     S=r, D=au SP=n, DP=53      D=r     M=1200      S=r, D=au SP=n, DP=53
             Verify Ping                          Verify Ping                          D=r     PING                            D=r     PING
                                                                                                                                                                fnhe Cache:
       D=r   PING     1300 bytes            D=r    PING    1300 bytes
                                                                                                                                                            au->C2->C3->C4->C5
                                                                         Verify Reply                                         Verify Reply                            Verify Ping                                            Verify Ping
       Verify Reply Frag1                         Verify Reply
                                                                           D=a   PING                                          D=a     PING                             D=r   PING    1300 bytes                       D=r   PING   1300 bytes
  D=a, MF=1      PING    1152 bytes         D=a    PING    1300 bytes                        1.1.1.100
                                                                                                                                                 Legend:     PMTU of C1: default                                                PMTU of C1:1200

       Verify Reply Frag2
                                                                                                                                                 Spoofed           Verify Reply                                       Verify Reply Frag0
                                                                                                                                                     Data               D=C1 PING                               D=C1, MF=1      PING   1152 bytes
                                                                                                                                                                                      1300 bytes
        D=a, MF=0 148 bytes
                                                                                                                                                IP Header
                                                                                                                                              UDP Header
                                                                                                                                                                                                                       Verify Reply Frag1
                                                                                                                                              ICMP Header                                                              D=C1, MF=0    148 bytes


   (a) Frag-Needed-Based Public Port Inference                                    (b) Redirect-Based Public Port Inference                                               (c) Frag-Needed-Based Private Port Inference

             Keys: D=Destination IP, S=Source IP, M=PMTU, SP=Source Port, DP=Destination Port, MF=More Fragment, Cn(C1-C5)=Colliding IPs, au=Authoritative Name Server

                                                                                        Figure 3: Port Number Inference
change because fragments will go towards the name server directly.                                                            owning 10,000 IPs would bring the colliding rate to an arbitrary IP
Interestingly, it turns out that there is another method to indirectly                                                        over a 2048-entry hash table to more than 98%. Unfortunately, this
observe the state change.                                                                                                     naive brute force does not transfer well to our attack. Specifically,
    The key idea is to leverage the limited number of total slots                                                             in order to observe a collision in the case of the exception cache,
in the global exception cache. By default, Linux organizes such a                                                             we know that we need 5 or 6 IP addresses to fully occupy a bucket
global exception cache as a 2048-bucket hash table which uses the                                                             entry. This means that we need to find at least 50,000 to 60,000 IPs
destination IP address as the key and has a linked list of length                                                             to have a good chance. This is still easily achievable in IPv6 because
5 and 6 slots (for IPv6 and IPv4 respectively) to solve collisions                                                            ISPs often assign a /64 address block by default. However, for IPv4,
for each bucket. When the linked list reaches the limit, the oldest                                                           we consider it possible but a very strict requirement. We therefore
exception will always be evicted and replaced with a newly inserted                                                           come up with an alternative strategy as follows.
exception.                                                                                                                       Instead of finding the collision set directly, we choose to infer
    The requirement is that the attacker needs to create hash col-                                                            the secret used in the keyed hash function that computes the index
lisions with the name server’s IP. As shown in Figure 3(c), the                                                               into the 2048 buckets. First of all, the hash function is public (listed
attacker first needs to find 5 IPs (in the case of IPv6) that can be                                                          in the kernel source code). Secondly, since the secret is only 32-bit
hashed into the same bucket as the name server’s IP on the victim                                                             and persists until reboots, it is possible to crack it once and use it
resolver’s exception cache and control at least 1 IP C1 (the other 4                                                          subsequently to check which IPs collide with a given name server’s
IPs can be spoofed). For now, we assume the attacker can find the                                                             IP. This allows us to target a resolver and potentially poison an
5 colliding IPs but will describe our tested strategy in §4.6.                                                                arbitrary domain name after a single cracking. To infer the secret,
    As shown in Figure 3(c), once the colliding IPs are collected,                                                            the basic idea is to find some collision set (of 6 IPs in the case of
the attacker first fully occupies the 5 allowed slots in the linked                                                           IPv4) that allows us to test which secret can produce the collision
list using the 5 different IPs. This can be done by sending a series                                                          set. The key is that in this process we no longer require a collision
of ICMP frag needed or ICMP redirect packets wrapping a PING                                                                  with a specific IP, i.e., the IP of a name server, and therefore we
reply packet [26]. The kernel blindly accepts ICMP errors caused                                                              can benefit from the birthday paradox [55] — it is much more
by PING replies because they are sent by the kernel with no sockets                                                           probable to observe a collision at any bucket rather than a given
and therefore matching the socket before accepting is not possible.                                                           bucket. Based on our empirical evaluation, we only need 3,500 IPv4
Subsequently, the attacker would proceed with the ephemeral port                                                              addresses to reliably find one or more collision sets on some buckets.
scan by probing different source ports with ICMP messages. If a                                                               In particular, we rented 3,500 AWS EC2 instances to acquire 3,500
probe happens to hit the correct ephemeral port, a new exception                                                              different random public IPs. Given that each tiny instance only
regarding the name server is to be inserted into the linked list                                                              costs less than one cent per hour, renting instances for sending
and evict the first exception (i.e., C1) prepared by the attacker. The                                                        probing packets is cheap. In practice, we found that one round of
attacker can observe this by a verification packet, in the case of                                                            probing with 3,500 IPs is usually sufficient to find enough collision
MTU caches, checking the current MTU for C1.                                                                                  sets that allow us to uniquely pinpoint the secret — this takes only
                                                                                                                              minutes computationally with 3,500 tiny CPU cores. In the rare
4.6          Finding IPs that Cause Hash Collisions                                                                           event that we fail, we can simply re-acquire another set of 3,500 IPs
                                                                                                                              and redo the probing. Finally, we also tested the same methodology
Finding IP collisions has been studied before when leveraging IPID
                                                                                                                              with IPv6 where only 1,500 addresses were needed to achieve the
side channels [8, 25], where they needed to find a single IP address
that collides within the same IPID bucket as the victim. [8] states
same result because an IPv6 hash bucket has only 5 slots instead of       • 𝐶1: Must check the port number in the embedded UDP packet of
6.                                                                          an ICMP error before processing it. [OS]
                                                                          • 𝐶2: Must cache the MTU or next-hop information. [OS]
4.7    High-Speed Scans                                                   • 𝐶3: Must not ignore the ICMP fragment needed or ICMP redirect
As one can expect, for either public-facing or private-facing ports,        messages in the kernel. [APP/OS]
an attacker can probe multiple source ports simultaneously to learn       • 𝐶4: Must not shutdown or retransmit the query after receiving
if any of the guesses match the correct ephemeral port. We con-             ICMP messages. [APP/OS]
firmed with small-scale experiments that both ICMP frag needed
                                                                              For 𝐶1&𝐶2, they form the basis of side channels in the kernel. As
and redirect messages are not rate limited on the Internet (see
                                                                          mentioned earlier, the latest Linux kernel satisfies both conditions.
Appendix B). We consider two options below.
                                                                              For 𝐶3, interestingly the latest Linux kernel allows applica-
Batch scan. We can probe many ports at once, and check whether
                                                                          tions to pass special socket options (either IP_PMTUDISC_OMIT or
any of them has hit the correct port. If it does, we can then re-probe
                                                                          IP_PMTUDISC_INTERFACE) which will cause the kernel to ignore
a smaller sub-range (e.g., a binary search) to narrow down on the
                                                                          the frag needed messages for the corresponding sockets. However,
exact port. In this strategy, every round of probes will incur at least
                                                                          this feature was introduced in Linux kernel 3.15. Therefore, whether
one round trip time between the attacker and victim (as is the case
                                                                          or not the condition is satisfied depends on both the kernel and DNS
in SADDNS [45]). Note that we will need to somehow reset the
                                                                          application. Nevertheless, ICMP redirect messages are not affected
exception cache state once we hit the correct port in a batch. This is
                                                                          by any socket option and are always processed in the kernel.
because we have already evicted one of the exceptions we planted
                                                                              For 𝐶4, it is a necessary condition because the port scan assumes
earlier. We will describe the methods in detail in Appendix C.
                                                                          the ephemeral port stays the same after it is successfully detected.
Single packet scan. An alternative strategy is to scan only a single
                                                                          If an application decides to shutdown the connection or retransmit
port in each batch (batch size equal to 1). This means that every
                                                                          the query after receiving an ICMP message (embedding the correct
scan will be accompanied by an additional verification packet. Even
                                                                          ephemeral port), then the detected ephemeral port will be effectively
though this sounds like a sub-optimal strategy, we point out that the
                                                                          forfeited. Interestingly, this is again determined by the OS kernel as
probes can in fact be initiated in a pipeline, without having to wait
                                                                          well as the application. First of all, the OS kernel has to expose the
for feedback for previous probes. This is because our verification
                                                                          ICMP error messages to the application layer (again ICMP redirect
packet can encode a unique ID (e.g., ping ID) that can differentiate
                                                                          never gets exposed). Secondly, an application may choose to react
after which batch of probes, an update in the exception cache has
                                                                          to such errors in different ways.
taken place. Of course, we can also use a larger batch size. However,
                                                                              In Table 1, we summarize the vulnerable combinations of Linux
as mentioned, it will incur additional round trips to narrow down
                                                                          kernel and DNS software according to the above conditions. We
the search. In contrast, the single packet scan (a batch size of 1)
                                                                          break down the Linux kernel versions into three groups, represent-
will allow us to precisely pinpoint which port is open without the
                                                                          ing three major changes that affect the above conditions. Similarly,
additional round trips. The tradeoff is that for every ephemeral port
                                                                          we break down BIND into two groups because of some key changes
we scan, two packets need to be sent, i.e., one is the probe, the other
                                                                          in behaviors. As we can see, 𝐶1 is always satisfied in all recent
is the verification packet.
                                                                          kernel versions. Regarding 𝐶2, the Linux kernel since 3.6 is vul-
    As the attack is highly time-sensitive, we favor fewer round trips
                                                                          nerable in IPv4 because of the introduced exception cache. It took
over higher bandwidth consumption. We wish to point out that
                                                                          Linux some time until 4.15 to port the same exception cache to IPv6.
this allows us to scan at a much higher speed than 1,000 per second
                                                                          Therefore, IPv6 redirect attacks, which only require 𝐶1&𝐶2 to work,
which was the limit in SADDNS [45].
                                                                          are only exploitable on kernel versions newer than 4.15. Regarding
                                                                          𝐶3, Since Linux 3.15, the socket options mentioned above become
5     VULNERABLE POPULATION                                               available and BIND decides to use IP_PMTUDISC_OMIT since 9.12
In this section, we will first study the necessary conditions for the     for IPv4 sockets, leaving the condition satisfied for IPv6 sockets
vulnerability to be present and exploitable. Then we study the vul-       only. For 𝐶4, since Linux 3.15 and BIND 9.12, IP_PMTUDISC_OMIT
nerable combination of OS and DNS software. Interestingly, the            on IPv4 sockets similarly causes the kernel to notify the application
outcome is determined by both the OS and DNS software (some-              regarding ICMP frag needed errors for sockets that have private-
times either one). In addition, we also explored historical versions      facing ports (therefore does not apply to older Unbound versions
of OS and DNS software because a large fraction of resolvers on the       and dnsmasq). Furthermore, BIND will retransmit the query (with
Internet may not be running the latest software. We then conduct a        a different ephemeral port) upon receiving such a notification. As
measurement study to measure the vulnerable population of open            we can see, the interactions between the kernel and application
resolvers on the Internet that satisfy the vulnerable conditions.         layer are very much inconsistent and evolving constantly. We will
Due to measurement constraints, we also conduct a small-scale             discuss the reasoning behind them in §8.2.
experiment on ICMP redirect attack (see Appendix A).                          In summary, for the latest versions of BIND and Unbound on the
                                                                          latest kernels, their IPv6 sockets can be exploited for the ephemeral
                                                                          port scan. In contrast, dnsmasq is always vulnerable as it does
5.1    Conditions of Successful Attacks                                   not set any special socket option. Nevertheless, in practice, IPv6 is
Below we summarize the key necessary conditions for a resolver            gaining significant traction in deployment [28]. In fact, as we will
to be considered exploitable.
                                 Table 1: Exploitability of Different DNS Software and Kernel Versions
            Kernel Version              3.6-3.14                3.15-4.14                                  >4.15
            DNS Software          BIND          BIND         BIND       BIND           BIND            BIND      Unbound           dnsmasq
               Version           9.3-9.11       >9.12       9.3-9.11    >9.12         9.3-9.11         >9.12       >1.5.2            ANY
              IP Version          4      6      4     6      4      6 4 6            4        6      4     6     4      6             4/6
                  𝐶1              ✓      ✓     ✓      ✓      ✓     ✓ ✓ ✓            ✓        ✓       ✓     ✓     ✓     ✓               ✓
                  𝐶2              ✓      ✗     ✓      ✗      ✓     ✗ ✓ ✗            ✓        ✓       ✓     ✓     ✓     ✓               ✓
             Redir Vuln.        𝑉𝑝𝑟𝑖𝑣 ✗ 𝑉𝑝𝑟𝑖𝑣 ✗            𝑉𝑝𝑟𝑖𝑣 ✗ ✗ ✗             𝑉𝑝𝑟𝑖𝑣 𝑉𝑝𝑟𝑖𝑣       ✗ 𝑉𝑝𝑟𝑖𝑣 ✗ 𝑉𝑝𝑟𝑖𝑣 1              𝑉𝑝𝑢𝑏
                  𝐶3              ✓      ✓     ✓      ✓      ✓     ✓ ✗ ✓            ✓        ✓       ✗     ✓     ✗     ✓               ✓
                  𝐶4              ✓      ✓     ✓      ✓      ✓     ✓ ✗ ✓            ✓        ✓       ✗     ✓     ✓     ✓               ✓
              Frag Vuln.        𝑉𝑝𝑟𝑖𝑣 ✗ 𝑉𝑝𝑟𝑖𝑣 ✗            𝑉𝑝𝑟𝑖𝑣 ✗ ✗ ✗             𝑉𝑝𝑟𝑖𝑣 𝑉𝑝𝑟𝑖𝑣       ✗ 𝑉𝑝𝑟𝑖𝑣 ✗ 𝑉𝑝𝑟𝑖𝑣 1              𝑉𝑝𝑢𝑏
             Vuln. in Any           ✓             ✓            ✓          ✗              ✓               ✓           ✓                 ✓
            1: 𝑉𝑝𝑢𝑏 before 1.13.0.       Note: 𝑉𝑝𝑢𝑏 and 𝑉𝑝𝑟𝑖𝑣 indicate vulnerable to public-facing or private-facing port scans respectively.
show in §5.2, half of the popular public DNS resolvers support IPv6.            it does not rely on being able to evict exception entries in any shared
Furthermore, our attack is fully capable of exploiting a dual-stack             resources (See §4.4). On Windows Server 2019, the built-in Microsoft
(IPv4/IPv6) resolver, combined with techniques such as name server              DNS server uses public-facing ports which makes it vulnerable.
muting (as will be discussed in §6.3).
    Due to space constraints, we did not show the analysis results of
historic versions of dnsmasq and Unbound in Table 1. For dnsmasq,
                                                                                5.2    Open Resolvers
it is vulnerable on all kernel versions since 3.6. For Unbound, it has          Now we move on to measure the vulnerable population in the
a similar road map as BIND and starts to use IP_PMTUDISC_OMIT                   real world. Note in this section we focus on the attack leveraging
since 1.5.2. The only difference is that it used public-facing ports            ICMP frag needed messages only. This is because ICMP redirect
in the past. This leads Unbound to be not only vulnerable in the                based attacks require IP spoofing even for port scans, and we are
IPv4 of kernel versions between 3.15 and 4.14, but also IPv6 in the             concerned that it is invasive to conduct such a large-scale IP spoof-
same kernel ranges. This is because the public-facing ports can be              ing experiment. Instead, we defer to Appendix A for a small-scale
successfully scanned (as shown in Figure 3) as long as the MTU or               measurement of the conditions of the redirect-based attacks.
redirect information is stored somewhere in the kernel. In practice,            Setup and Dataset. Open resolvers represent hosts that provide
for kernel version 3.15 to 4.14, such info is stored in a tree which            recursive DNS lookup services to the public. We obtain a list of
can only time out as opposed to being forcefully evicted.                       open resolvers from Censys.io [22], which contains 1.84M IPv4
Other Operating Systems. We have additionally analyzed FreeBSD                  addresses, serving as the dataset used in our measurement. Unfor-
(whose networking stack is also used by macOS) and Windows with                 tunately, the list does not contain IPv6 open resolver addresses.
regard to the previously described conditions.                                  Nevertheless, these IPv4 addresses only correspond to the fron-
    For FreeBSD, it is not vulnerable because 𝐶1&𝐶2 are broken for              tend IPs. In practice, most open resolvers will go through backend
ICMP frag needed and redirect respectively. For ICMP frag needed                servers that conduct the actual DNS query on behalf of the fron-
messages, even though the OS will check the embedded four-tuple                 tend. Therefore, we design a method to solicit queries from IPv6
and act accordingly, it does not store any PMTU information in any              backend servers. Specifically, we control two domain names whose
kernel-maintained data structure and thus breaking 𝐶2. Instead, it              NS records point to an IPv4 and an IPv6 address respectively. For
simply forwards the error to the application layer. This is actually            each frontend IP, we always send two queries asking for the IPv4
not compliant with RFC1191 [47] which explicitly states that "the               and IPv6 domain names respectively. For the domain where its NS
IP layer should associate each PMTU value that it has learned                   record points to an IPv6-only address, it will force a backend server
with a specific path" and "it (a host) should be able to cache a per-           to use its IPv6 address to contact our name server. In the end, we
host route for every active destination". For ICMP redirect packets,            are able to receive 129,196 queries from IPv4 addresses and 27,541
surprisingly, FreeBSD will blindly accept them without checking                 from IPv6 addresses.
the embedded four-tuple and therefore breaks 𝐶1.                                Methodology. When a backend server (either IPv4 or IPv6) con-
    For Windows, we reverse-engineered tcpip.sys and ntoskrnl                   tacts our name server, we will perform the following four tests
of a Windows 10 copy. We found that there is a similar hash table               that approximately correspond to the four conditions we discussed
storing the path information (including the MTU). However, we                   earlier.
did not find any eviction algorithm and it will only stop inserting                T1: The rejection of the ICMP error when the embedded source
new exceptions after the kernel runs out of memory. Although                    port is incorrect. To verify 𝐶1 in §5.1, we first send a PING to the
the attacker can still leverage this as a side channel, due to the              resolver and record the reply. Then we craft an ICMP fragment
large and different memory configurations, it is hard to do so in               needed packet wrapping the DNS query we received to signal that
practice. However, lacking a cap on memory consumption of the                   the PMTU is lowered. Before we send it, we deliberately change the
hash table would lead to a potential DoS attack on the entire system.           source port of the embedded UDP packet to a different random value
Interestingly, although this breaks the private-facing port scan, a             to check whether the resolver will blindly accept ICMP packets
public-facing port scan is nevertheless feasible on Windows because             without checking the port number. After sending that forged packet,
                                                                                we send another PING and check if the ICMP is accepted. If the
PING reply is not fragmented, we consider the resolver rejects the          the retransmission to be caused by the ICMP. Otherwise, if the
ICMP error and thus meets 𝐶1.                                               delay is larger than RTT, we will consider the retransmission to be
    T2: The existence of the next hop exception cache. To verify 𝐶2         timeout-induced (and thus still supporting the attack).
in §5.1, ideally we would want to directly test the existence of an         Results. Overall, out of the 156,737 backend resolver IPs that reach
exception cache. However, as described in §4.6 this will require us         our name servers, 13.85% of them are estimated to be vulnerable.
to find 5 or 6 IPs that would be hashed into the same bucket, causing       If we count by frontend resolver IPs, out of the 1.84M, 37.72% are
the hash collision. Although it is a one-time effort, targeting every       estimated vulnerable. This is because a large number of frontend
single open resolver will require sending a large amount of traffic         IPs share the same backend. To further break down the total 13.85%
which can be overly invasive. Therefore, we decide to resort to nmap        vulnerable population in the backend, we find that 13,914 (8.9%)
to fingerprint the OS version of the resolver and check whether the         are clearly vulnerable to public-facing port scans. However, when
cache exists according to the OS version discussed in §5.1. Note            we count the vulnerable population regarding the private-facing
that nmap may not be perfect, especially when considering backend           port scans, it requires a more accurate estimate of the Linux kernel
servers may not always have open TCP ports, through which most              version from nmap. Unfortunately, as mentioned earlier, we find
of the fingerprints are extracted by nmap. Nevertheless, we can use         nmap has a relatively low success rate of OS fingerprinting: only
the distribution obtained from resolvers that do have open ports            63.26% for IPv4 addresses and 1.06% for IPv6 addresses. We therefore
and extrapolate to those that do not. To minimize the impact, we            use the distribution of kernel versions observed from the 63.26%
sampled 20 out of 8,141 backend resolver IPs that have a valid nmap         IPv4 hosts to estimate the total vulnerable population. In particular,
signature and performed the collision test using 3,500 rented IPs           within these IPv4 hosts, we find that 58.66% of them have the IPv4
following the methodology described in §4.6. Note that this is still        exception cache only or also the IPv6 exception cache. We then
an intrusive test (we do slow down the packet speed to about 1,000          apply the 58.66% to the 13,277 resolver backends that are suspected
pps to minimize any disruption) and thus cannot scale. The results          to be vulnerable (passing all other tests), resulting in an estimate of
show 16 out of 20 servers support nmap’s conclusion and therefore           7,788 backends being vulnerable to private-facing port scans.
we estimate the accuracy of nmap 80%.                                          The results indicate that the majority of the vulnerable popula-
    T3: The acceptance of the ICMP error. To verify 𝐶3 in §5.1, we          tion is not actually running BIND. Instead, they could be running
use a similar test to T1 but without modifying the port number              an older Unbound, dnsmasq, or other DNS resolver software that
to verify if the resolver is willing to accept the ICMP packet at           we have not explicitly tested. Among the servers that are not vul-
all. Additionally, if there is no PING reply at all, we will send a         nerable, most of them are simply because they do not accept the
truncated DNS response to solicit the TCP query from the resolver.          ICMP frag needed messages (including cases that we cannot tell)
If the MSS in the TCP header is decreased according to the PMTU             and fail in T3.
value indicated in our ICMP packet (which we verify to be the               Public Resolvers. We also highlight the results of a few well-
behavior of modern Linux kernels), it also means the resolver has           known public DNS services and summarize the result in Table 2.
accepted the PMTU value inside the ICMP packet. Besides, we will            Overall, we find 6 out of 12 to be definitely vulnerable at the time
conduct another test by changing the destination IP address in the          we performed the test, 3 in IPv4 and 3 in IPv6, including famous
wrapped IP packet if we find the resolver accepts the original ICMP.        providers such as OpenDNS and Quad9. Interestingly, although the
If the resolver also accepts the modified ICMP, it means its port is        most popular DNS software BIND is not vulnerable in IPv4 in its
open to the public, and otherwise, we consider its ephemeral port           latest releases, there are still 3 public resolvers vulnerable in IPv4,
as private-facing.                                                          indicating that they are either running an older BIND version or a
    T4: The open-port status after receiving the ICMP error. To verify 𝐶4   different DNS software (we know Cloudflare runs Knot [2]). Note
in §5.1, after the ICMP fragment needed is sent during T3, we follow        that currently only 6 providers support IPv6 (others are marked as
up with a “truncated response” (if it is not sent in T3) indicating         N/A) and we expect more DNS services to be impacted as they start
the response is too big which will cause the resolver backend to            supporting IPv6.
switch to TCP. If we observe a TCP handshake, it indicates that                The most common reason for not being vulnerable is again be-
the ICMP error did not cause the resolver to close the original             cause they failed T3, i.e., the ICMP fragment needed messages do
ephemeral port, therefore supporting the attack. In the more rare           not appear to trigger the MTU to decrease. As we can see in Table 2,
cases, even if we did not observe any TCP connection attempt, it is         there are still a few cases where we are unable to fingerprint the
still possible that the ephemeral port is open and it is simply due to      kernel versions even after we tried testing a few custom fingerprints
the resolver not supporting DNS over TCP. In such cases, we will            in addition to nmap (marked with "?" in the T2 column). For such
check whether the name server will receive a retransmitted query            cases, we simply mark them as "Possibly Vulnerable" (𝑃𝑝𝑟𝑖𝑣/𝑝𝑢𝑏 )
(with a different ephemeral port) from the resolver immediately,            when they pass all other tests, since it is likely their public servers
which potentially indicates that the ICMP has induced the DNS               are well-maintained and using a newer Linux kernel.
software to close the ephemeral port and transmit another query.
To distinguish between the ICMP-induced retransmission and the
timeout-induced retransmission, we record the time delay between
the ICMP transmission and the time we received the retransmitted
query. Specifically, if the delay is close to RTT, which we collect in      6   PRACTICAL CONCERNS
T1 by measuring the time delay between the PING response and                In this section, we will describe a few practical considerations which
the request, i.e., within a 10% margin of difference, we consider           will influence the success and reliability of the attack.
                                              Table 2: Vulnerable Status of Public Resolvers
                                                                   IPv4 Backend                      IPv6 Backend
                       Name            Frontend IP
                                                        T1    T2    T3 T4 Vulnerable      T1    T2 T3 T4 Vulnerable
                      Google              8.8.8.8       ✓     ✗      ✗    ✓       ✗       ✓      ?     ✗    ✓       ✗
                    Cloudflare            1.1.1.1       ✓     ✓      ✓ ✓        𝑉𝑝𝑟𝑖𝑣     ✓     ✗      ✓ ✓          ✗
                    OpenDNS           208.67.222.222    ✓      ?     ✓ ✓        𝑃𝑝𝑢𝑏      ✓     ✓ ✓ ✓             𝑉𝑝𝑟𝑖𝑣
                     Comodo             8.26.56.26      ✓     ✓      ✗    ✓       ✗                N/A            N/A
                      Quad9               9.9.9.9       ✓     ✓      ✗    ✓       ✗        ✓     ?     ✓ ✓        𝑉𝑝𝑢𝑏
                     AdGuard           94.140.14.14     ✓     ✓      ✗    ✓       ✗        ✓    ✓ ✓ ✓             𝑉𝑝𝑟𝑖𝑣
                  CleanBrowsing      185.228.168.168    ✓     ✓      ✗    ✗       ✗                N/A            N/A
                     Neustar           156.154.70.1     ✓     ✓      ✓ ✓        𝑉𝑝𝑢𝑏       ✗     ?     ✓ ✓          ✗
                      Yandex             77.88.8.1      ✓     ✓      ✗    ✓       ✗                N/A            N/A
                       Baidu           180.76.76.76     ✓     ✓      ✓ ✓        𝑉𝑝𝑟𝑖𝑣              N/A            N/A
                        114          114.114.114.114    ✓     ✓      ?    ✓       ?                N/A            N/A
                        Ali              223.5.5.5      ✓     ✓      ✗    ✓       ✗                N/A            N/A

6.1    Small Attack Window                                                6.2    Multiple Name Servers & Backend Servers
By default, the attack window is only a round trip time (ranging          Multiple name servers. It is also quite common for domains to
from tens to hundreds of milliseconds) between a resolver and a           have multiple name servers. Resolvers may choose to query these
name server, forcing the attack to finish both the port scan and the      name servers in a round-robin fashion (where the order is ran-
injection of 65,536 fake DNS responses (brute-forcing the TxID)           domized). In fact, this is considered a defense against DNS cache
in a small amount of time. Nevertheless, this does not represent a        poisoning attacks [45]. However, this defense has little impact on
fundamental hurdle as the attacker can simply repeat the attack           our attacks for the following reasons.
multiple times; as long as one of the attempts succeeds, the cache           For resolvers with private-facing ephemeral ports, we can in-
will be poisoned. Specifically, in practice, we find an attack attempt    fer the ports specific to different name servers simultaneously
more likely to succeed if the correct ephemeral port is located at the    by running multiple scanning instances. Since it is unlikely the
beginning of the port scan range (see numbers in §7). To circumvent       name servers’ IPs will share the same hash bucket given that most
the wait of TTL for the legitimate record to time out in case of a        second-level domains (e.g., acm.org) only have three or fewer name
failed attack attempt, we use a previously proposed method [38, 45]       servers [45], the side channels can be independently leveraged
to improve the speed of the attack. The basic idea is to issue queries    without self-interference.
with random subdomains and forging a response containing an                  For resolvers with public-facing ports, the attacker can just scan
NS record, causing the resolver to cache the wrong name server            the port as if there was only one name server since the kernel
such that all future queries (including the target domain and all         does not check the destination IP address wrapped in the ICMP
subdomains) will be directed to the malicious name server. This           probe. The only difference lies in the TxID brute-forcing, where
method is well documented in [38, 45] and works against both              the attacker would inject multiple groups of 65,536 fake response
BIND and Unbound.                                                         packets, where each group uses a spoofed IP of a different name
   To increase the attack window, an attacker can attempt to mute         server. Due to the low number of name servers typically configured,
a name server, i.e., preventing the name server from responding           this additional load of packets is not really a fundamental hurdle.
to a resolver’s query. If successful, a resolver will keep increasing        In addition to the above, there is an optional step called “name
its wait time, i.e., attack window, to typically 1-2s for BIND and        server pinning” [45] that can further improve the success rate when
potentially larger than 30s for Unbound [45]. Specifically, it was        multiple name servers are encountered. In addition to previously
reported that the response rate limit (RRL) feature on name servers       proposed techniques [45], we propose two new methods again
can be abused for this purpose [45] where 18% of the Alexa top 100k       based on ICMP messages, i.e., either host/port unreachable or redi-
websites were shown to be affected. Alternatively, a DoS attack can       rect. In the case of BIND resolvers, every time when a query is
be launched to mute the name server.                                      initiated, we can immediately flood 65,536 (representing the worst
   Coincidentally, one of the ICMP messages, ICMP redirect, can be        cases. BIND uses only 23,232 ports by default) ICMP host/port un-
also used for name server muting. The idea is to send the malicious       reachable messages containing all possible ephemeral ports with
ICMP redirect to either the victim resolver or the name server to         a specific name server’s IP as the destination IP address in the
reroute the traffic destined to each other to a black hole. Since         embedded IP header. This will cause BIND to give up a particular
the query/response is lost after it reaches the wrong next hop, the       name server in the duration of a query session (up to 10 seconds by
victim resolver would keep the ephemeral port open for responses          default [45]). This is because the OS will pass the host/port unreach-
until the query timeouts (can be several seconds [45]) and therefore      able messages to BIND, which will make the subsequent decision to
creates a huge attack window.                                             forgo the name server (one of the 65536 guessed ports will match
                                                                          the ephemeral port). Alternatively, we can apply targeted name
server muting as mentioned in §6.1 and targeted ICMP redirect to         towards the same name server (in addition to the one triggered by
achieve a similar effect.                                                the attacker). However, it can affect the public-facing ports because
   In the case of Unbound, ICMP redirect can be used as described        the ephemeral port of any outstanding query to any name server
above to mute specific name servers. This is because Unbound has         can show up during a scan. Nevertheless, we point out that any of
special logic to “blacklist” name servers that are non-responsive        the strategies described in §6.1 that can extend the attack window
repeatedly [45]. Therefore, the ICMP redirect will have a prolonged      will automatically mitigate this concern. This is because the out-
pinning effect beyond a single query session.                            standing query triggered by the attacker would then last for much
                                                                         longer (possibly seconds) while other ordinary queries will only
Multiple backend servers. Finally, large DNS resolvers tend to           last for hundreds of milliseconds at most. Therefore, we can simply
have multiple backend servers behind a single frontend IP — usually      confirm that the port lives long enough before deciding to brute
an anycast one, e.g., 8.8.8.8. These backend servers are the actual      force the TxID.
workers that talk to the name servers and they are the ones that            Another type of background traffic is the benign ICMP error
maintain DNS caches. Therefore the backend servers should be             messages a resolver may receive during a port scan. They can
the actual attack target. An attacker can map out the IPs of the         create additional entries in the exception cache. This has little
backend servers by setting up an attacker-controlled name server         impact on public-facing ports because the attack requires only one
and issuing a query of the attacker-controlled domain. This will         entry to be created in the cache and it is highly unlikely that there
create an additional challenge to the attacker, as a particular query    are many naturally-occurring ICMP errors that will hash into the
may get routed to a randomly selected backend IP not known to the        same bucket as the attacker’s entry and evict it, during a short
attacker. This will mean that the attacker needs to target 𝑚 ×𝑛 pairs    time frame of an attack. For private-facing ports, the attack does
of resolver backends and name servers, where 𝑚 is the number of          require all five exception entries in the same hash bucket to be
backend IPs and 𝑛 is the number of name servers. Otherwise, if the       intact during the scan. However, it is still unlikely to have a hash
attacker picks only a single backend server to attack, it will have      collision from benign ICMP messages during a short time period.
a reduced probability of 𝑚1 (assuming the probability of choosing        Even if it does occur in practice, it will just interfere with one attack
backend servers is uniformly distributed) to succeed. Fortunately,       attempt (triggering a false positive) and the next attack attempt
when 𝑚 is large, it is typically a heavily distributed system that the   will follow immediately.
selection of the backend IPs is actually not random at all. Instead,     Packet Losses. Although unlikely, if the probing ICMP containing
[45] indicates that it is typically based on location. In other words,   the correct ephemeral port happens to be lost, false negatives can
backend servers that are located closer to a name server will be         arise. In such cases, the attacker simply moves on to the next at-
more likely to be picked for a given query (destined to the name         tempt. If the loss is on the verification or verification reply packets,
server). In such cases, the attacker only needs to target a small        it will not affect the attack since the attacker can easily notice and
number of backend servers simultaneously or even a single one            retransmit the verification packet. This is because a verification
and is still able to achieve a decent success rate.                      reply is always supposed to come back either fragmented or not
                                                                         (depending on whether the ephemeral port is guessed correctly).
6.3    Dual-Stack Resolvers                                              Packet Reordering. Reordering can cause false negatives on public-
As mentioned earlier in §5.1, the latest BIND and Unbound will           facing port scans and both false positives and false negatives on
instruct the Linux kernel to ignore ICMP frag needed messages            private-facing port scans. Specifically, if the verification packet
for IPv4 sockets. Therefore, the vulnerability applies to only IPv6      accidentally arrives before the ICMP probe containing the correct
sockets against them. In practice, both IPv4 and IPv6 are enabled        ephemeral port, it will fail to detect the exception cache change
by default in recent Linux distributions (e.g., Ubuntu 20.04 and         and lead to false negatives. Furthermore, if the private-facing port
Red Hat 7). Therefore, we need to understand how to target their         is being scanned, such a false negative would mislead the attacker
IPv6 sockets in the presence of IPv4 sockets. Specifically, BIND         into continuing the scan despite the fact that one of the planted
and Unbound by default will query different name servers in a            exceptions has already been evicted. This is guaranteed to lead
round-robin fashion regardless of whether the IP address is IPv4 or      to a false positive in the scanning of the next batch of ports, as
IPv6. As a result, we can apply the same strategy as outlined in §6.2    the eviction will be detected by the next verification packet. To
to handle them. Specifically, we can apply name server pinning to        mitigate such problems, a small time gap can be inserted between
cause the IPv4 name server to become non-responsive and never            the probing and the verification packets. To mitigate the risk of
(or rarely) used by a resolver.                                          false positives and flooding the resolver with too many packets,
                                                                         we always double-check whether a detected port is a true positive
                                                                         before deciding to brute force the TxID.
6.4    Noises
Background traffic. There are two potential sources of background
traffic at the resolver that can influence the ephemeral port scan.      7    EVALUATION
First, the victim resolver may have multiple outstanding queries at      To evaluate the efficiency of our attacks without causing real-world
the same time. During the port scan, it is possible that the ephemeral   damage, we tested the attack in a controlled environment with
port we find belongs to a different query. It is not a serious concern   different server configurations and simulated network conditions.
for private-facing ports as they are “visible” to only specific name     Overall, our attacks can succeed in minutes and have a near-perfect
servers, and there are typically few, if any, outstanding queries        success rate. Note that inferring private-facing ephemeral ports
                                                                                           Table 3: Resolver Attack Results
requires inferring the colliding IPs as described in §4.6. However,
since it is only a one-time effort for each resolver, the time used for     Exp.   Pkt.    RTT       NS    # Batch Bg.    Avg. Succ.
the attack does not include the time for inferring colliding IPs.                  Loss    range     Mute of Size  Noise Time Rate
                                                                                           /ms       Level NS (N)         /s
                                                                           Base     0%     0.3-1.2   100% 1     1     0     80 20/20
7.1    Resolver Attack                                                     Loss    0.20%   0.3-1.2   100% 1     1     0     83 20/20
Attack setup. In this attack, we evaluate the power of the fragment        RTT      0%      37-43    100% 1     1     0    149 20/20
needed attack based on the private-facing port scan. There are 3            ML      0%     0.3-1.2    50% 1     1     0    713  5/6
hosts involved in the attack: the attacker host, the victim resolver        NS      0%     0.3-1.2   100% 3     1     0    347 20/20
and the name server, all of which are controlled by us. The attack         Batch    0%     0.3-1.2   100% 1 1024      0    496  5/5
program is executed on the attacker host, which is a MacBook               Real    0.20%    37-43     80% 2     1     0    410 20/20
running macOS (Darwin 19.6.0) and is connected to the victim               Real1   0.20%    37-43     80% 2     1    810   659 10/10
resolver via a wired router (1Gbps). The victim resolver is a PC (with     Real2   0.20%    37-43     80% 2     1  810+10 933 10/10
a single CPU of Intel Core i7-9700) running BIND 9.16.13 on Ubuntu
20.04 (Linux 5.11.16). The name server, where our domain’s records        failed if it still does not succeed after an hour. In both baseline (𝐵𝑎𝑠𝑒)
are kept, is hosted on AWS and also running BIND 9.16.13. The             and packet loss (𝐿𝑜𝑠𝑠) experiments, the attack succeeds in around
attacker’s host, and the victim resolver are at home and connected        80s, indicating the minimal impact of moderate packet losses. This is
to the name server via residential Internet and all of the traffic is     expected as discussed in §6.4. In the 𝑅𝑇𝑇 experiments, we found the
sent in IPv6. The goal of the attack is to poison the cache of the        delay and jitter do affect our attack. Under such unstable networks,
victim resolver so that our own domain’s A record will be altered         the attack may experience false positives as the verification packet
in the cache.                                                             may be received before the probe. Fortunately, our attack can still
   We conducted 9 groups of experiments to evaluate the impact            succeed because we have inserted time gaps to minimize reordering
of the different server configurations, network conditions, and lev-      (see §6.4).
els of background query traffic on our attack as shown in Table 3.           For name server muting levels, we find they do have a significant
Specifically, we first performed a baseline (𝐵𝑎𝑠𝑒) attack, where the      impact on our attack but are much smaller compared to the impact
attacking conditions are ideal. Then we changed one configuration         on SADDNS [45]. Under the same muting level (50%), our attack
or network condition at a time to check how they would influence          (𝑀𝐿) is 10x faster than SADDNS. This should be attributed to the
the attack. Then, we tested the performance of our attack against a       substantially faster scan speed and the fact that we do not need
more realistic configuration and network condition to simulate a          to perform iterative probes to narrow down the search space. As
real-world scenario (𝑅𝑒𝑎𝑙). Finally, we introduced the background         a result, this allows our attack to fare better under smaller attack
query traffic to the resolver and evaluate how the interfering query      windows. Experiment 𝐵𝑎𝑡𝑐ℎ further confirms this. With N=1024,
traffic affects our attack. Specifically, in 𝑅𝑒𝑎𝑙1, we followed the       the average success time increased by five times compared to the
workload on a production resolver reported in SADDNS [45] with            baseline where N=1. Note in 𝑀𝐿, there is one attack attempt that
70M queries per day, averaging at 810 queries per second. To sim-         failed (after an hour) likely due to a link-layer issue that we are
ulate the worst-case scenario, the domains in these queries are           unable to reproduce.
randomly sampled from the Alexa top 1M to reduce the cache hit,              We also notice it would take ~4x the amount of time to poison a
leading to more open ports. In 𝑅𝑒𝑎𝑙2, we added another 10 queries         domain with 3 name servers (𝑁 𝑆). This is due to the limit of 7k pps
per second asking for the same domain that the attacker is trying         packet sending rate, which forces us to scan for each name server
to poison (which would cause confusion to our port scan).                 at 1/3 of the total rate. However, if an attacker scans with 3 times
   To stay stealthy, we limit the rate of our packets to 7k pps (in-      the bandwidth, the result would have been close to the baseline.
cluding both the probes and verification packets), which is 3.5k             In the real world scenario experiments (𝑅𝑒𝑎𝑙), we succeeded
ports scanned per second. Note that 7k pps applies to the port scan       in 410s on average, which is 2x the speed of SADDNS with the
phase only. During the TxID brute-forcing phase, we limit our brute       same setting, despite the fact that our test is against BIND which
force speed to 40 kpps and 70 kpps for 𝑅𝑒𝑎𝑙1 and 𝑅𝑒𝑎𝑙2 (to compete        is known to have a much smaller attack window (about only 2s as
with the background traffic). We simulate varying degrees of packet       experienced in our experiments) than Unbound (more than 30s as
losses, jitters, and delays according to the representative numbers       reported in SADDNS [45]).
reported on the Internet [19, 24]. Besides, we also evaluated how            Finally, for the background query traffic experiment 𝑅𝑒𝑎𝑙1, we
the name server muting level and the number of name servers affect        found random domain queries do not significantly impact the attack
our attack. Although the name server can be completely muted (i.e.,       performance. As expected, we do not find our scan being confused
100% muting level) using ICMP redirects as mentioned in §6.1, we          by the additional open ephemeral ports because they are all private
also evaluate the scenario where it is difficult to completely mute a     ports and not visible to the name server which hosts the target
name server (e.g., leveraging response rate limit). As mentioned in       domain name (see §6.4). Instead, we find that the increase of time-
§4.7, we also studied the impact on the attack performance when           to-succeed is mostly attributed to the machine being slowed down
using different batch sizes (i.e., the number of ports scanned in a       in processing these query packets. Compared to 𝑅𝑒𝑎𝑙1, 𝑅𝑒𝑎𝑙2 expe-
batch).                                                                   rienced worse results because the additional 10 queries per second
Results. Overall, we find our attacks can succeed on average in 1.3       can generate ephemeral ports that are visible to the target name
to 15.6 minutes, depending on the setup. Note that we consider a test     server, therefore creating confusion to our scan. Looking into the
detailed logs, we see that 𝑅𝑒𝑎𝑙2 experiences 22 failed TxID brute         Resistance to the noise. Unlike the global counter used in SADDNS,
force attempts on average whereas 𝑅𝑒𝑎𝑙1 experiences only 11. The          which is shared across all remote IPs, the exception cache used in
majority of the additional failed brute force attempts are due to the     our side channel is a hash-based structure and is only shared with
failure in inferring the correct port number.                             a smaller range of IPs, which reduces the noise level of our side
   In general, we make two additional general observations on the         channel — it is less likely to be interfered with by background
results. First, the overall attack time is spent predominantly on         traffic associated with random IPs. Besides, SADDNS requires a
repeated port scans (starting from the smallest port to the largest),     strong 50-ms time block synchronization, which can be hard to
accounting for 96% to 98% of the time. The remaining time is spent        achieve with noise. In contrast, our attack does not have such a
on brute-forcing the TxIDs. Second, the time-to-succeed varies            strict synchronization requirement.
significantly depending on how close the correct port is to the           Preparation of the attack. Compared to SADDNS, our attack
beginning of the port scan. In many cases, we see the time-to-            requires an additional step of inferring colliding IPs that hash into
succeed being a few seconds, whereas in the worse case (especially        the same bucket. Nevertheless, as described in §4.6, it is only a
when noise is introduced), it can take 30 minutes to find the port        one-time effort for each resolver we target.
and succeed in brute-forcing the TxIDs.
                                                                          8.2    PMTUD and DNS
7.2    Other Attacks                                                      It has been a controversial decision to enable Path MTU Discov-
                                                                          ery (PMTUD) on DNS packets. Historically, [10] indicates ICMPv6
Forwarder Attack. To evaluate the performance of the public-
                                                                          packet too big messages could benefit the responsiveness of DNS
facing port scan, we launched the attack against an ASUS AX6600
                                                                          queries while [30] argues the opposites claiming that it could lead
Wi-Fi router which has a built-in DNS forwarder. We used a simi-
                                                                          to fragmentation-based DNS cache poisoning attacks. As a result,
lar setup as the 𝐵𝑎𝑠𝑒 experiment in the resolver attack where the
                                                                          we see DNS software (especially BIND) changing back and forth
attacker is a LAN machine that can trigger DNS queries on the
                                                                          regarding its socket options related to PMTUD.
forwarder. In this attack, we used the IPv4 network and set the up-
                                                                             Recently, there appears to be a convergence as both BIND and Un-
stream resolver as 8.8.8.8, which the attacker needs to spoof when
                                                                          bound start to set the socket option of IP_PMTUDISC_OMIT, which
brute-forcing the TxIDs. Finally, the attack succeeded in 13s.
                                                                          instructs the kernel to never reduce the MTU. This is mostly in
Redirect Attack. Similar to 𝐵𝑎𝑠𝑒, we launched the redirect-based
                                                                          fear of the fragmentation-based DNS cache poisoning attacks that
attack under the same settings, with the only change of replacing
                                                                          rely on tricking the name server to fragment its responses [30].
IPv6 with IPv4, to demonstrate the private port scan under different
                                                                          Interestingly, this option is now enabled for the sockets on both the
IP versions. Finally, the attack succeeded in ~150s.
                                                                          name servers and resolvers (even though the concern was mostly
                                                                          on name servers). In addition, both BIND and Unbound decide to
8 DISCUSSION                                                              enable this option for IPv4 sockets only and leave IPv6 unchanged.
8.1 Comparison with SADDNS                                                   The reason for leaving IPv6 sockets unchanged is likely that
                                                                          fragmentation can be avoided most of the time as the minimum
Ephemeral port inference method. As mentioned in §4, the first            MTU is increased to 1280. This means that any link carrying IPv6
and foremost difference is the use of ICMP probes in our attack. By       datagrams must be able to handle at least 1280 bytes of payload.
design, ICMP messages are considered errors that should not solicit       This is large enough to transmit most DNS packets and makes the
any responses [12]. This makes them an unlikely avenue to probe           fragmentation-based attacks unlikely to succeed.
any secret. Nevertheless, we demonstrate a superior understanding
of the nature of side channels, making ICMP probes a successful
                                                                          8.3    Existing Defenses
entry point in UDP ephemeral port scans.
Side channel type. Our side channel leverages the space resource          There are already a number of additional DNS security solutions in
limit (i.e., the space for storing the next hop exception cache is        addition to the randomization of ephemeral ports that can defend
limited) while SADDNS’ side channel leverages the time resource           against DNS cache poisoning attacks. However, they are not widely
limit (i.e., ICMP error generating rate is limited). Moreover, our side   deployed due to various reasons.
channel arises when processing incoming ICMP packets (and this            DNSSEC adds the data origin authentication and data integrity to
is why we can still infer the ephemeral port despite no reply to the      DNS [52] and therefore by design prevents any attacker without
ICMP probing packet is sent) while SADDNS’ side channel arises            holding the correct key to inject any records. However, only 1.85%
when processing outgoing ICMP packets.                                    of Alexa Top 10k websites enable the DNSSEC, and only 12% of
Port scan speed. Thanks to the novel space-constraint side chan-          open resolvers actually validate the record integrity if provided [18].
nel arising in the packet receiving path, the ICMP-based ephemeral        During our experiment, we found famous websites like Google,
port scan rate can be theoretically unlimited. In practice, the at-       Facebook, and Twitter do not even have DS records on the parent
tacker can also adjust the scan rate and strategy flexibly to achieve     zone, which is a necessary record for DNSSEC to function.
a higher success rate according to different network conditions.          0x20 Encoding is proposed to randomize the upper and lower
SADDNS, however, only allows the fixed 1000 pps slow port scan            case of the letters in the domain name (of both the query and
due to the nature of the time-constraint side channel it uses. The        response), thus introducing additional entropy beyond the TxID
slow scan rate leads directly to a lower success rate when racing         and ephemeral port [57]. The amount of entropy increases as the
against legitimate DNS responses.                                         length of the domain name increases. Unfortunately, it is found
recently [45] that the 0x20 encoding has compatibility issues (since         Responsible disclosure. We have reported our findings to the
it requires support from the name server) and 12 out of 14 popular        key stakeholders in the DNS community, including BIND, Cloud-
public DNS resolvers tested do not use it (which we also confirm to       flare, and Linux. Linux has applied two patches on both IPv4 and
remain true at the time of writing). Famous resolvers like 8.8.8.8        IPv6 stacks to randomize the depth of the linked list storing the
only enable 0x20 encoding for whitelisted domains.                        exceptions. BIND also begins to set IP_PMTUDISC_OMIT on IPv6
DNS Cookie is yet another secret exchanged between a resolver             sockets from 9.16.20 concurrent to our study.
and name server, designed to defeat any form of off-path response
injection [3]. Similar to DNSSEC, DNS cookie requires support from        9    RELATED WORK
both the resolver and name server to work properly. However, only
                                                                          DNS Cache Poisoning Attacks The off-path DNS cache poison-
5% of open resolvers enable this by default and some may even
                                                                          ing attack was first popularized by Dan Kaminsky in 2008 [36].
reject queries with DNS cookie, as reported in recent studies [21,
                                                                          After the ephemeral port number was randomized, fragmentation
45], indicating compatibility is still a serious concern. Moreover,
                                                                          attacks [13, 33] were invented to eliminate the need for guessing
DNS cookie is only a solution during the transitioning period into
                                                                          the source port by replacing the second fragment of the original
DNSSEC (as it is strictly weaker than DNSSEC), which can be
                                                                          DNS response. However, these attacks usually have some strong
another reason why it is not being widely deployed.
                                                                          assumptions like predicting the IPID of the packet or running a
                                                                          puppet on the victim resolver. Port exhaustion attacks [9, 32] de-
8.4    New Defenses Against Our Attack
                                                                          randomize the ephemeral port number by exhausting all but one
In addition to the existing defenses, we also propose a set of or-        available ephemeral port, leaving the DNS resolver only one fixed
thogonal and near-term solutions to mitigate our attack. We will          port to use. These attacks also require the puppet to work. In 2020,
further discuss the generalized defense against the network side          SADDNS [45] was invented as the first side-channel based DNS
channels in Appendix D.                                                   cache poisoning attack. However, this attack is slow and usu-
Set proper socket options. The most direct way is to use the              ally takes tens of minutes to finish. At the same time, Zheng et
socket option IP_PMTUDISC_OMIT, which instructs the OS not to             al. ports the fragmentation attacks to the forwarder and found
accept the ICMP frag needed messages and therefore eliminates the         the attack much easier when using the attacker-controlled name
side-channel related processing in the kernel. However, legitimate        server to force the fragmentation [59]. Jeitner et al. present a novel
ICMP frag needed messages can be sent by a router which will be           way to poison DNS caches by exploiting domain parsing ambigui-
ignored also. In such cases, we recommend that the application can        ties [35]. Amit Klein uses the IPID value to predict the random UDP
retransmit the query using TCP to avoid failing to transmit a UDP         ephemeral port number by exploiting the cryptographic properties
query due to real problems with the MTU.                                  of the shared random number generator [37].
Randomize the caching structure. Similar to the solutions to                 Overall, unlike other works, our attacks are based on another
other network side channel attacks [14–16, 45, 51], sufficiently          unique side channel in ICMP and provide another way to poison
randomizing the shared resource would make the side channel               the DNS cache using the fast ICMP-based port scan.
practically unusable. With regard to the exception cache, we rec-         Side Channel Attacks Side channels have been leveraged in net-
ommend a few places where randomization can take place: (1) the           work attacks [7, 39, 43, 50]. Specifically, [23] leverages IPID global
max length of the linked list used for solving hash collisions, (2) the   counter to probe open ports. [49] utilizes the stateful firewall to
eviction policy (currently the oldest will always be evicted), (3) the    infer the TCP sequence number. [14] uses global challenge ACK
secret of the hash function, i.e., we can re-key periodically (every      counter to infer the TCP sequence number and hijack the TCP con-
few seconds or tens of seconds).                                          nection off-path. Besides, Cao et al. presents an automated tool for
Reject ICMP redirects. Redirects are originally designed for a            finding side channels in the TCP stack using model checking and
network with multiple gateways (similar to a router with multiple         found several other side channels inside the Linux TCP stack [16].
next-hop options). If a DNS server has only one default gateway, the
administrator should consider ignoring ICMP redirect messages to          10    CONCLUSION
prevent redirect-based attacks, which can be configured via sysctl
(see Appendix A).                                                         This paper presents novel side channels during the process of han-
                                                                          dling ICMP errors, a previously overlooked attack surface. We find
8.5    Ethical Concerns                                                   that side channels can be exploited to perform high-speed off-path
                                                                          UDP ephemeral port scans. By leveraging this, the attacker could
We conduct our experiments with ethics as a top concern. During           effectively poison the cache of a DNS server in minutes. We show
the measurement of the vulnerable population in the wild, we              that side channels affect many open resolvers and thus have serious
attempt to minimize the impact of our probes by (1) querying our          impacts. Finally, we present mitigations against the discovered side
own domain and (2) at a mild speed for each resolver (under 1,000         channels.
packets per second). Also, we avoid sending suspicious-looking
packets, e.g., an excessive number of ICMP packets or packets with
spoofed IPs that can potentially trigger firewall alerts.                 ACKNOWLEDGMENTS
   In the evaluation section, since it requires flooding fake DNS         We wish to thank the anonymous reviewers for their valuable com-
responses to finish the end-to-end attack, we refrain from attacking      ments and suggestions. This work was supported by the National
any real resolver and performed the attack in the local setup instead.    Science Foundation under Grant No. 1652954.
REFERENCES                                                                                   [25] Xuewei Feng, Chuanpu Fu, Qi Li, Kun Sun, and Ke Xu. 2020. Off-Path TCP
 [1] [n.d.]. SADDNS website. https://www.saddns.net/.                                             Exploits of the Mixed IPID Assignment. In Proceedings of the 2020 ACM SIGSAC
 [2] 2018. Introducing DNS Resolver, 1.1.1.1 (not a joke). https://blog.cloudflare.com/           Conference on Computer and Communications Security (Virtual Event, USA) (CCS
     dns-resolver-1-1-1-1/.                                                                       ’20). Association for Computing Machinery, New York, NY, USA, 1323–1335.
 [3] D. Eastlake 3rd and M. Andrews. 2016. RFC 7873: Domain Name System (DNS)                     https://doi.org/10.1145/3372297.3417884
     Cookies. Technical Report. https://tools.ietf.org/html/rfc7873                          [26] Linux Foundation. 2021. net/ipv4/icmp/c. https://elixir.bootlin.com/linux/v5.11/
 [4] S. Deering A. Conta and Ed. M. Gupta. 2006. RFC 4443: Internet Control Message               source/net/ipv4/icmp.c#L1218.
     Protocol (ICMPv6) for the Internet Protocol Version 6 (IPv6) Specification. Technical   [27] F. Gont. 2010. RFC 5927: ICMP Attacks against TCP. Technical Report. https:
     Report. https://tools.ietf.org/html/rfc4443                                                  //tools.ietf.org/html/rfc5927
 [5] Josh Aas, Richard Barnes, Benton Case, Zakir Durumeric, Peter Eckersley, Alan           [28] Google. 2021. IPv6 Adoption Statistics. https://www.google.com/intl/en/ipv6/
     Flores-López, J Alex Halderman, Jacob Hoffman-Andrews, James Kasten, Eric                    statistics.html.
     Rescorla, et al. 2019. Let’s Encrypt: An automated certificate authority to encrypt     [29] Hang Guo and John Heidemann. 2018. Detecting ICMP rate limiting in the
     the entire web. In Proceedings of the 2019 ACM SIGSAC Conference on Computer                 Internet. In International Conference on Passive and Active Network Measurement.
     and Communications Security. 2473–2487.                                                      Springer, 3–17.
 [6] Akamai. 2021. Configure split-DNS forwarding on Cisco routers. https:                   [30] Matthias Göhring, Haya Shulman, and Michael Waidner. 2018. Path MTU Discov-
     //learn.akamai.com/en-us/webhelp/enterprise-threat-protector/enterprise-                     ery Considered Harmful. In 2018 IEEE 38th International Conference on Distributed
     threat-protector/GUID-5916F532-2D1D-4CC0-B926-9D6CC44BEF33.html.                             Computing Systems (ICDCS). 866–874. https://doi.org/10.1109/ICDCS.2018.00088
 [7] G. Alexander and J. R. Crandall. 2015. Off-path round trip time measurement             [31] Brendon Harris and Ray Hunt. 1999. TCP/IP security threats and attack methods.
     via TCP/IP side channels. In 2015 IEEE Conference on Computer Communications                 Computer communications 22, 10 (1999), 885–897.
     (INFOCOM).                                                                              [32] Amir Herzberg and Haya Shulman. 2012. Security of Patched DNS. In ESORICS
 [8] Geoffrey Alexander, Antonio M Espinoza, and Jedidiah R Crandall. 2019. De-                   2012, Sara Foresti, Moti Yung, and Fabio Martinelli (Eds.).
     tecting TCP/IP Connections via IPID Hash Collisions. Proceedings on Privacy             [33] Amir Herzberg and Haya Shulman. 2013. Fragmentation considered poisonous,
     Enhancing Technologies 2019, 4 (2019).                                                       or: One-domain-to-rule-them-all. org. In 2013 IEEE Conference on Communications
 [9] Fatemah Alharbi, Jie Chang, Yuchen Zhou, Feng Qian, Zhiyun Qian, and Nael                    and Network Security (CNS). IEEE, 224–232.
     Abu-Ghazaleh. 2019. Collaborative Client-Side DNS Cache Poisoning Attack.               [34] J. Mogul J. McCann, S. Deering and Ed. R. Hinden. 2017. RFC 8201: Path MTU
     In IEEE INFOCOM 2019-IEEE Conference on Computer Communications. IEEE,                       Discovery for IP version 6. Technical Report. https://tools.ietf.org/html/rfc8201
     1153–1161.                                                                              [35] Philipp Jeitner and Haya Shulman. 2021. Injection Attacks Reloaded: Tunnelling
[10] Hanieh Bagheri, Victor Boteanu, Willem Toorop, and Benno Overeinder. 2013.                   Malicious Payloads over DNS. In 30th USENIX Security Symposium (USENIX
     Making do with what we’ve got: Using PMTUD for a higher DNS responsiveness.                  Security 21). USENIX Association.
[11] F. Baker. 1995. RFC 1812: Requirements for IP Version 4 Routers. Technical Report.      [36] Dan Kaminsky. 2008. Black ops 2008: It’s the end of the cache as we know it.
     https://tools.ietf.org/html/rfc1812                                                          Black Hat USA (2008).
[12] R. Braden. 1989. RFC 1122: Requirements for Internet Hosts – Communication              [37] Amit Klein. 2020. Cross Layer Attacks and How to Use Them (for DNS Cache
     Layers. Technical Report. https://tools.ietf.org/html/rfc1122                                Poisoning, Device Tracking and More). arXiv:2012.07432 [cs.CR]
[13] Markus Brandt, Tianxiang Dai, Amit Klein, Haya Shulman, and Michael Waidner.            [38] Amit Klein, Haya Shulman, and Michael Waidner. 2017. Internet-wide study
     2018. Domain validation++ for MitM-resilient PKI. In Proceedings of the 2018 ACM             of DNS cache injections. In IEEE INFOCOM 2017-IEEE Conference on Computer
     SIGSAC Conference on Computer and Communications Security. ACM, 2060–2076.                   Communications. IEEE, 1–9.
[14] Yue Cao, Zhiyun Qian, Zhongjie Wang, Tuan Dao, Srikanth V. Krishnamurthy,               [39] Jeffrey Knockel and Jedidiah R. Crandall. 2014. Counting Packets Sent Between
     and Lisa M. Marvel. 2016. Off-Path TCP Exploits: Global Rate Limit Considered                Arbitrary Internet Hosts. In 4th USENIX Workshop on Free and Open Communica-
     Dangerous. In 25th USENIX Security Symposium (USENIX Security 16). USENIX                    tions on the Internet (FOCI 14). USENIX Association, San Diego, CA.
     Association, Austin, TX, 209–225.                                                       [40] Marc Kührer, Thomas Hupperich, Jonas Bushart, Christian Rossow, and Thorsten
[15] Yue Cao, Zhiyun Qian, Zhongjie Wang, Tuan Dao, Srikanth V. Krishnamurthy,                    Holz. 2015. Going wild: Large-scale classification of open DNS resolvers. In
     and Lisa M. Marvel. 2018. Off-Path TCP Exploits of the Challenge ACK Global                  Proceedings of the 2015 Internet Measurement Conference. ACM, 355–368.
     Rate Limit. IEEE/ACM Transactions on Networking (TON).                                  [41] R. G. Fairhurst L. Eggert and G. Shepherd. 2017. RFC 8085: UDP Usage Guidelines.
[16] Yue Cao, Zhongjie Wang, Zhiyun Qian, Chengyu Song, Srikanth V. Krish-                        Technical Report. https://tools.ietf.org/html/rfc8085
     namurthy, and Paul Yu. 2019. Principled Unearthing of TCP Side Channel                  [42] M. Lepinski and S. Kent. 2012. RFC 6480: An Infrastructure to Support Secure
     Vulnerabilities. In Proceedings of the 2019 ACM SIGSAC Conference on Com-                    Internet Routing. Technical Report. https://tools.ietf.org/html/rfc6480
     puter and Communications Security (London, United Kingdom) (CCS ’19). As-               [43] lkm. 2007. Blind TCP/IP Hijacking is Still Alive. http://phrack.org/issues/64/13.
     sociation for Computing Machinery, New York, NY, USA, 211–224. https:                        html.
     //doi.org/10.1145/3319535.3354250                                                       [44] Matthew Luckie, Robert Beverly, Ryan Koga, Ken Keys, Joshua A. Kroll, and
[17] Weiteng Chen and Zhiyun Qian. 2018. Off-Path TCP Exploit: How Wireless                       k claffy. 2019. Network Hygiene, Incentives, and Regulation: Deployment of
     Routers Can Jeopardize Your Secrets. In 27th USENIX Security Symposium (USENIX               Source Address Validation in the Internet. In Proceedings of the 2019 ACM SIGSAC
     Security 18). 1581–1598.                                                                     Conference on Computer and Communications Security (London, United Kingdom)
[18] Taejoong Chung, Roland van Rijswijk-Deij, Balakrishnan Chandrasekaran, David                 (CCS ’19). Association for Computing Machinery, New York, NY, USA, 465–480.
     Choffnes, Dave Levin, Bruce M. Maggs, Alan Mislove, and Christo Wilson. 2017.                https://doi.org/10.1145/3319535.3354232
     A Longitudinal, End-to-End View of the DNSSEC Ecosystem. In 26th USENIX                 [45] Keyu Man, Zhiyun Qian, Zhongjie Wang, Xiaofeng Zheng, Youjun Huang, and
     Security Symposium (USENIX Security 17). USENIX Association, Vancouver, BC,                  Haixin Duan. 2020. DNS Cache Poisoning Attack Reloaded: Revolutions with
     1307–1322.                                                                                   Side Channels. In Proceedings of the 2020 ACM SIGSAC Conference on Computer
[19] European Commision. 2014. Quality of Broadband Services in the EU. http:                     and Communications Security (Virtual Event, USA) (CCS ’20). Association for
     //ec.europa.eu/newsroom/dae/document.cfm?action=display&doc_id=10816.                        Computing Machinery, New York, NY, USA, 1337–1350. https://doi.org/10.1145/
[20] Tianxiang Dai, Philipp Jeitner, Haya Shulman, and Michael Waidner. 2021. From                3372297.3417280
     IP to Transport and beyond: Cross-Layer Attacks against Applications. In Pro-           [46] P. Mockapetris. 1987. RFC 1035: DOMAIN NAMES - IMPLEMENTATION AND
     ceedings of the 2021 ACM SIGCOMM 2021 Conference (Virtual Event, USA) (SIG-                  SPECIFICATION. Technical Report. https://tools.ietf.org/html/rfc1035
     COMM ’21). Association for Computing Machinery, New York, NY, USA, 836–849.             [47] J. Mogul and S. Deering. 1990. RFC 1191: Path MTU Discovery. Technical Report.
     https://doi.org/10.1145/3452296.3472933                                                      https://tools.ietf.org/html/rfc1191
[21] Jacob Davis and Casey Deccio. 2021. A Peek into the DNS Cookie Jar. In Passive          [48] J. Postel. 1981. RFC 792: INTERNET CONTROL MESSAGE PROTOCOL. Technical
     and Active Measurement, Oliver Hohlfeld, Andra Lutu, and Dave Levin (Eds.).                  Report. https://tools.ietf.org/html/rfc792
     Springer International Publishing, Cham, 302–316.                                       [49] Zhiyun Qian and Z Morley Mao. 2012. Off-path TCP sequence number inference
[22] Zakir Durumeric, David Adrian, Ariana Mirian, Michael Bailey, and J. Alex                    attack-how firewall middleboxes reduce security. In 2012 IEEE Symposium on
     Halderman. 2015. A Search Engine Backed by Internet-Wide Scanning. In 22nd                   Security and Privacy. IEEE, 347–361.
     ACM Conference on Computer and Communications Security.                                 [50] Zhiyun Qian, Z. Morley Mao, Yinglian Xie, and Fang Yu. 2010. Investigation of
[23] Roya Ensafi, Jong Chun Park, Deepak Kapur, and Jedidiah R. Crandall. 2010.                   Triangular Spamming: A Stealthy and Efficient Spamming Technique. In 2010 IEEE
     Idle Port Scanning and Non-Interference Analysis of Network Protocol Stacks                  Symposium on Security and Privacy. 207–222. https://doi.org/10.1109/SP.2010.42
     Using Model Checking. In Proceedings of the 19th USENIX Conference on Security          [51] Alan Quach, Zhongjie Wang, and Zhiyun Qian. 2017. Investigation of the 2016
     (Washington, DC) (USENIX Security’10). USENIX Association, USA, 17.                          Linux TCP Stack Vulnerability at Scale. SIGMETRICS Perform. Eval. Rev. (2017).
[24] FCC. 2018. Eighth Measuring Broadband America Fixed Broadband Re-                       [52] M. Larson D. Massey R. Arends, R. Austein and S. Rose. 2005. RFC 4035: Protocol
     port. https://www.fcc.gov/reports-research/reports/measuring-broadband-                      Modifications for the DNS Security Extensions. Technical Report. https://tools.
     america/measuring-fixed-broadband-eighth-report.                                             ietf.org/html/rfc4035
[53] Riccardo Ravaioli, Guillaume Urvoy-Keller, and Chadi Barakat. 2015. Character-       residential host showed packet losses, which confirms rate-limiting
     izing ICMP rate limitation on routers. In 2015 IEEE International Conference on      in the transit network is not a popular policy. Even for the Chinese
     Communications (ICC). 6043–6049. https://doi.org/10.1109/ICC.2015.7249285
[54] Kyle Schomp, Tom Callahan, Michael Rabinovich, and Mark Allman. 2014. DNS            residential host, we find that the losses seem to be affected by the
     Record Injectino Vulnerabilities in Home Routers. http://www.icir.org/mallman/       nationwide slowdown effect as reported recently [60]. We had the
     talks/schomp-dns-security-nanog61.pdf.
[55] Kazuhiro Suzuki, Dongvu Tonien, Kaoru Kurosawa, and Koji Toyota. 2006. Birth-
                                                                                          suspicion because UDP packets destined to the same residential
     day paradox for multi-collisions. In International Conference on Information Secu-   host experienced similar losses also.
     rity and Cryptology. Springer, 29–40.
[56] W. Simpson T. Narten, E. Nordmark and H. Soliman. 2007. RFC 4861: Neighbor
     Discovery for IP version 6 (IPv6). Technical Report. https://tools.ietf.org/html/
                                                                                          C    RESETTING THE EXCEPTION CACHE
     rfc4861                                                                                   STATE
[57] P. Vixie and D. Dagon. 2008. Use of Bit 0x20 in DNS Labels to Improve Transac-
     tion Identity. Technical Report. https://tools.ietf.org/html/draft-vixie-dnsext-     Since the search of the ephemeral port we conduct requires multiple
     dns0x20-00                                                                           rounds of probes, the attacker has to reset the cache state after
[58] Neil Wright. 2012. DNS in Computer Forensics. Journal of Digital Forensics,
     Security and Law 7 (2012), 11–42. https://doi.org/10.15394/jdfsl.2012.1117           getting a positive response (i.e., a probing packet in a batch hitting
[59] Xiaofeng Zheng, Chaoyi Lu, Jian Peng, Qiushi Yang, Dongjie Zhou, Baojun Liu,         the correct open ephemeral port or the false positive caused by
     Keyu Man, Shuang Hao, Haixin Duan, and Zhiyun Qian. 2020. Poison Over                noises). Generally speaking, this can be done similarly to the cache
     Troubled Forwarders: A Cache Poisoning Attack Targeting DNS Forwarding
     Devices. In 29th USENIX Security Symposium (USENIX Security 20). USENIX              planting phase in the private-facing port scan where the attacker
     Association, 577–593.                                                                finds 5 hash-collision IPs (note these can be done via IP spoofing
[60] Pengxiong Zhu, Keyu Man, Zhongjie Wang, Zhiyun Qian, Roya Ensafi, J. Alex
     Halderman, and Haixin Duan. 2020. Characterizing Transnational Internet Per-
                                                                                          instead of direct ownership) to evict the cache entry containing his
     formance and the Great Bottleneck of China. Proc. ACM Meas. Anal. Comput.            primary scanning IP. Note that an easier method exists specifically
     Syst. 4, 1, Article 13 (May 2020), 23 pages. https://doi.org/10.1145/3379479         for the public-facing port scans using ICMP frag needed messages.
                                                                                          This is because when a correct port is hit, the resolver will reduce
A     ICMP REDIRECT ATTACKS                                                               the MTU for the attacker’s host to that specified in the ICMP frag
We performed the following small-scale experiments to measure                             needed message. The attacker can continue to lower the MTU
the four conditions (outlined in §5.1) for redirect-based attacks.                        in future rounds of probes. Each time the MTU is decreased, an
University network experiment. We verified the conditions of                              attacker can simply send a PING verification packet to infer if the
successful attacks against resolvers in a university network. Since                       new MTU is now in effect. Note that it is not possible to raise the
we are able to craft ICMP redirect messages with the spoofed IPs                          MTU using this method according to the specification [34, 47]. As
inside the university network, we target 9 resolvers by redirecting                       a result, if the minimum MTU is reached, the attacker would have
the packets destined to our test machine to an IP that is considered                      to fall back to the general method (i.e., replanting the cache).
nearby of the resolver. The result shows 3 out of 9 resolvers are
vulnerable, (i.e., meeting 𝐶1−𝐶4). Most resolvers are not vulnerable                      D    SYSTEMATIC MITIGATIONS ON NETWORK
because they do not accept ICMP redirect packets at all, which                                 SIDE CHANNEL ATTACKS
breaks 𝐶3. In practice, the acceptance of redirects can be configured                     Both this work and SADDNS [45] showed a significant threat
via sysctl on Linux and the default value varies on different Linux                       against DNS security. Since they arise from the kernel network
distributions. Two resolvers are not vulnerable because they run                          stack, other protocols (e.g., QUIC or RTP) could suffer from the
FreeBSD which blindly accepts redirects and invalidates 𝐶1.                               side-channel-based port scan as well.
Delivery of ICMP redirect on the Internet. Since ICMP redi-                                  To mitigate unknown side channels, we suggest a careful design
rects are potentially dangerous [31], one concern is that such mes-                       on any use of shared resources and minimize sharing unless it is
sages may be dropped on the Internet and only work in local net-                          absolutely necessary. To verify if a specific sharing is safe, we need
works. We therefore performed a small-scale experiment by having                          to model the side channel threat properly and can apply automated
8 vantage points (corresponding to 8 ASes) distributed across the                         reasoning techniques, e.g., static analysis and model checking [16]
world (i.e., in five continents) to send ICMP redirect messages to                        to verify whether any leakage of information can occur.
each other. Specifically, our vantage points reside in AWS (multiple                         Beyond the above analysis, which can be tricky to do correctly,
continents), Google Cloud Platform, China educational network,                            a universal best practice is to randomize the limit or use of the
US university campus network, and China residential network. The                          shared resource. This can substantially increase the difficulty of a
result shows ICMP redirects can successfully traverse the Internet                        side channel attack even if there is a vulnerability. Indeed, this is
in all pairs of experiments.                                                              exactly what the patches do against prior TCP side channels [15]
                                                                                          and SADDNS [45].
B     ICMP RATE LIMIT
ICMP traffic is generally considered as control-plane traffic and it
has been proposed that the source should rate-limit the generation
of such packets [11, 53]. If such traffic is rate limited not only at
the source but also during transit (for ICMP PING [29]), the port
scan speed can be significantly hampered. As a result, we conduct
a small-scale experiment using the same setup as mentioned in
Appendix A and send ICMP frag needed or redirect messages to
each other at a rate of 10k pps. We find that none except one Chinese
