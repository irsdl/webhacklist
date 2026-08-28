---
type: Whitepaper
title: Analyzing the WebRTC Ecosystem and Breaking Authentication in DTLS-SRTP (Paper)
description: DTLS-SRTP secures media in Zoom, Teams and Google Meet and underpins WebRTC, whose stack spans HTTP, TLS, SDP, ICE, STUN, TURN, DTLS, SRTP and SCTP - too much to audit systematically by hand, so deployments went unexamined. An automated man-in-the-middle framework, DMS, drives the DTLS channel of real deployments and breaks authentication across the ecosystem it surveys.
resource: "https://www.usenix.org/system/files/usenixsecurity26-bach.pdf"
tags: [whitepaper, webseclist-reference, webrtc, tls, auth-bypass, tooling, measurement-study, owasp-a01-2021, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:18:14+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/system/files/usenixsecurity26-bach.pdf"
    title: Analyzing the WebRTC Ecosystem and Breaking Authentication in DTLS-SRTP (Paper)
    author: Martin Bach, Vukašin Karadžić, Lukas Knittel, Robert Merget, Jean Paul Degabriele
also_at: []
authors:
  - Martin Bach
  - Vukašin Karadžić
  - Lukas Knittel
  - Robert Merget
  - Jean Paul Degabriele
canonical_url: ""
cited_by:
  - "2026-ai.md:39"
commit: ""
content_sha256: d62f3d1684ed9f81a86a91af3c67d7eb3daa63281898d027e222f1e32aff7f99
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.usenix.org/system/files/usenixsecurity26-bach.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 1fee4c036e100206cbd1e0c72c650c0451fdcfce28ed050f4c13ee57156f3940
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity26-bach.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-19T16:18:14+00:00"
slug: analyzing-webrtc-ecosystem-breaking-authentication-dtls-srtp-paper
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Analyzing the WebRTC Ecosystem and Breaking Authentication in DTLS-SRTP (Paper)

**Analyzing the WebRTC Ecosystem and Breaking Authentication in DTLS-SRTP (Paper)** - Martin Bach, Vukašin Karadžić, Lukas Knittel, Robert Merget, Jean Paul Degabriele, Publisher not stated.

- Published: date not stated
- Original: <https://www.usenix.org/system/files/usenixsecurity26-bach.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity26-bach.pdf (stored) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Analyzing the WebRTC Ecosystem and
        Breaking Authentication in DTLS-SRTP
Martin Bach, Technology Innovation Institute; Vukašin Karadžić, TU Darmstadt;
        Lukas Knittel, Ruhr-University Bochum; Robert Merget and
           Jean Paul Degabriele, Technology Innovation Institute
       https://www.usenix.org/conference/usenixsecurity26/presentation/bach




       This paper is included in the Proceedings of the
              35th USENIX Security Symposium.
                  August 12–14, 2026 • Baltimore, MD, USA
                             ISBN 978-1-939133-58-8


                      Open access to the Proceedings of the
                        35th USENIX Security Symposium
                                is sponsored by
 Analyzing the WebRTC Ecosystem and Breaking Authentication in DTLS-SRTP

            Martin Bach                                Vukašin Karadžić                                Lukas Knittel
    Technology Innovation Institute             Technical University of Darmstadt                    Ruhr University Bochum
                           Robert Merget                               Jean Paul Degabriele
                     Technology Innovation Institute               Technology Innovation Institute


                         Abstract                                                Client   ICE                            Signaling Server




                                                                    Signaling
                                                                                                     SDP
DTLS-SRTP was designed to secure real-time media commu-
nication and is found in prominent audio and video call plat-
forms, including Zoom, Teams, and Google Meet. Notably, it
is part of Web Real-Time Communication (WebRTC), a web

                                                                    Establish.
                                                                                          STUN       STUN         STUN   Media Server
standard enabling real-time communication in the browser.            Conn.
                                                                                          TURN       Server       TURN

To this end, WebRTC uses multiple technologies, including          Exchange
                                                                                                 DTLS Handshake
HTTP, TLS, SDP, ICE, STUN, TURN, UDP, TCP, DTLS,
                                                                     Key




(S)RTP, (S)RTCP, and SCTP. This amalgamation of technolo-
gies results in an overly complex system that is very challeng-
                                                                   Media/Data
                                                                   Transport




                                                                                                     SRTP
ing to audit systematically and automatically. As a result, the                                      SCTP
security of deployments of this core modern communication
technology remains largely unexplored.
   In this work, we aim to close this gap by developing an           Figure 1: Phases of establishing a WebRTC connection.
automated MitM testing framework (DTLS-MitM-Scanner
(DMS)) to test the DTLS channel of a DTLS-SRTP connec-
tion. We use our framework to study the current state of          the proliferation of RTC technologies continues to increase,
the ecosystem in a case study spanning 24 service providers       ensuring their privacy and resilience to attacks is a forefront
across their browser and mobile applications. Our analysis        priority for the IT security community.
puts special emphasis on the authentication mechanism in             At the heart of most RTC technologies is the DTLS-SRTP
DTLS-SRTP, where we test for 19 potential vulnerabilities         protocol [35], which specifies a mechanism for securely
that could lead to authentication bypasses for both the client    exchanging cryptographic key material between two commu-
and server. We find that among the 33 tested media server         nicating parties and then using this key material to establish
implementations, 19 contained vulnerabilities allowing an         secure channels for transmitting media and data. In particular,
attacker to break authentication at the DTLS layer. For 9         DTLS-SRTP is used in the Web Real-Time Communication
of the affected systems, which serve hundreds of millions         (WebRTC) standard, which defines an API for browsers to
of users, we could also demonstrate that they could be ex-        establish RTC connections using DTLS-SRTP. WebRTC
ploited by an attacker to retrieve media data, assuming only      was initially proposed by Google in 2010 and later released
Man-in-the-Middle capabilities. We highlight the impact of        as an open-source project in 2011 [4], after which it was
these vulnerabilities by building a Proof-of-Concept exploit      quickly implemented in nearly all browsers. However, it was
to listen to Webex video conference calls.                        not until January 2021 that its first complete version of the
                                                                  standard was officially released [26]. A notable feature of
                                                                  WebRTC is that it was designed to provide a high degree of
1    Introduction                                                 flexibility and be backwards-compatible with several existing
                                                                  technologies. Most strikingly, it does not specify a signaling
After the onset of the COVID-19 pandemic, Real-Time Com-          protocol and attempts to be backwards-compatible with all
munication (RTC) technologies experienced rapid growth in         possible options. As we shall see, this added complexity has
adoption and market share [60], driven by the shift to online     a toll on security.
teaching and the widespread adoption of remote work. As



USENIX Association                                                                        35th USENIX Security Symposium                    321
   A textbook WebRTC call between two parties, A and B,               Multitude of Components. A typical WebRTC session
would proceed as follows. Both parties must typically au-          involves several protocols: HTTP, TLS, SDP, ICE, STUN,
thenticate to the service through some web application, for        TURN, UDP, TCP, DTLS, (S)RTP, (S)RTCP, and SCTP. Each
example, by opening the service’s webpage and logging into         system may employ a distinct subset with different settings.
their account. This establishes a secure connection (TLS)          This complicates the attack surface, and building automated
with the signaling server. The signaling server then acts as an    tools that account for all these technologies and their possible
intermediary to assist A and B in establishing a direct connec-    configurations becomes particularly challenging.
tion. Now A can initiate a call with B through the signaling          Interleaved Protocol Progression. The DTLS connection
server, which relays the appropriate signaling messages. Both      cannot be tested in isolation, as it requires progression through
parties then generate self-signed certificates and exchange        both the signaling phase and the connectivity establishment
their fingerprints, along with several other call parameters, in   phase. As discussed, signaling is not specified beyond SDP,
a standardized text-formatted Session Description Protocol         with many details left open to the application layer. Typically,
(SDP) message [10]. Next, they perform connectivity checks         users must sign into a web application to trigger signaling and
via the Interactive Connectivity Establishment (ICE) proto-        connection establishment, as otherwise, no server will listen
col [39] (STUN/TURN) in order to bypass potential NATs             for incoming DTLS connections. Thus, each test subject
and communicate directly without further assistance from the       requires specific customization of the testing tools in order
signaling server. Once a connection has been established,          to trigger a DTLS-SRTP connection, creating per-application
a Datagram Transport Layer Security (DTLS) [46, 47, 48]            overhead that testers ideally want to avoid.
handshake is initiated between the two peers, where one of the        Hidden Signaling. A major challenge for system testing
peers will act as a server and the other as a client. During the   is that signaling is conducted through encrypted channels.
DTLS handshake, both parties present their self-signed certifi-    Accordingly, external testers cannot observe or influence the
cates, thereby binding their identities to the ones established    negotiated parameters. This includes crucial information such
during signaling. If both can match the peer’s certificate fin-    as ICE candidates, SSRC values, X.509 certificate finger-
gerprint against the one provided in the SDP, the handshake        prints, IP addresses, and ports of media servers. Consequently,
proceeds.                                                          testers are restricted to the same capabilities as a true Man-
   Once the DTLS handshake concludes, symmetric keys are           in-the-Middle attacker, limiting the scope of executable tests.
exported from the DTLS [42] to establish Secure Real-time          While applications can be modified to exfiltrate private keys,
Transport Protocol (SRTP) and Secure RTCP (SRTCP) chan-            this creates additional overhead per application or browser.
nels or used directly to secure Stream Control Transmission           Parallel Connections. Real-world applications often es-
Protocol (SCTP) communication, as needed. Namely, media            tablish multiple simultaneous DTLS-SRTP connections, typ-
packets are protected via SRTP, whereas control traffic is car-    ically using separate connections for different media types
ried over RTP Control Protocol (RTCP) and protected using          (audio and video). Additionally, distinct endpoints may not
SRTCP, both of which are specified in [8]. In addition to          behave consistently due to load balancing and random port al-
media, applications may negotiate data channels transported        locations, making it challenging to consistently test the same
as SCTP over DTLS [57, 61]. The symmetric cryptographic            logical endpoint.
algorithms, called protection profiles, are negotiated during         These challenges have rendered WebRTC particularly
the DTLS handshake via a DTLS extension [35].                      unattractive to test, resulting in limited tooling for analyzing
   While WebRTC was originally envisioned to be peer-to-           the security of deployed implementations, especially regard-
peer (P2P), in reality, many applications relay or remix the       ing DTLS. As a result, this huge ecosystem used by hundreds
communication through an intermediate media server. In             of millions of users remains largely unexplored, which leads
such cases, both A and B establish separate DTLS-SRTP con-         us to our first research questions:
nections with the media server instead. This provides the
                                                                        RQ1: What is the status of the DTLS-SRTP ecosys-
application with more flexibility, allowing for compression
                                                                        tem? Which cryptographic algorithms and DTLS
and advanced features such as cloud recording, where encryp-
                                                                        features are used to secure RTC communication?
tion is not end-to-end. In SRTP, media streams are identified
and multiplexed using an Synchronization Source (SSRC)             To answer this question, we developed an automated DTLS-
identifier that is included in the Real-time Transport Protocol    SRTP testing platform, called DMS, to probe the DTLS com-
(RTP) header. The SSRC is exchanged in the SDP and helps           ponent of any party willing to establish DTLS-SRTP/WebRTC
the other participants or a forwarding party to map media          connections. Through it, we can gather information about the
streams to the respective entity.                                  DTLS implementation and configuration of a target system,
   The DTLS-SRTP/WebRTC ecosystem presents significant             such as supported cipher suites and extensions, version sup-
challenges for automated security analysis due to its com-         port, assumed DTLS role, and RFC compliance, among other
plex architecture and the interplay of numerous protocols and      details. Our testing platform is built on TLS-Attacker [56],
standards.                                                         pcap4j [66], Selenium [51], and jitsi-srtp [27], and is entirely



322   35th USENIX Security Symposium                                                                         USENIX Association
black box—requiring only MitM access and no alterations                   ing calls, by implementing a Proof-of-Concept exploit
to the system under test. Equipped with this testing platform             for one of the identified applications (Webex) to high-
and having noted several differences in the way that DTLS is              light the severity of the discovered issues (Section 6).
employed in DTLS-SRTP, we were then faced with the next                 ▶ We analyze browser implementations of the WebRTC
important question:                                                       API, focusing on certificate generation and validation.
                                                                          Our findings reveal that all tested browsers accept weak
     RQ2: Is DTLS deployed securely in DTLS-SRTP,
                                                                          512-bit RSA certificates from media servers, and some
     and are connections securely authenticated?
                                                                          browsers allow generating certificates with potentially
To address this question, we extended our testing platform                insecure parameters (Section 7).
with a suite of tests that specifically target the authentication
mechanism in DTLS. We use it to analyze the behavior of
many popular DTLS-SRTP implementations, with a special              2     Background
focus on WebRTC. Our study includes various browsers,
                                                                    Datagram Transport Layer Security (DTLS) [48] is a vari-
mobile platforms, and apps, as well as numerous popular web
                                                                    ant of the TLS protocol [43] aiming at providing equivalent
applications, including Zoom, Discord, Teams, Google Meet,
                                                                    security guarantees over datagram-based transport protocols
Webex, and more, through an extensive case study.
                                                                    like UDP. This requires DTLS to implement additional fea-
   Results. Our case study reveals a diverse ecosystem com-
                                                                    tures, such as explicit sequence numbers, in order to reliably
prised of numerous algorithms and features across the tested
                                                                    retransmit handshake messages.
applications. Among the 24 tested applications, 19 implemen-
                                                                        To establish a DTLS connection, the client sends a
tations contained vulnerabilities that allowed an attacker to
                                                                    ClientHello message, which includes a nonce, the highest
complete the DTLS handshake with their peer without own-
                                                                    supported protocol version, supported cipher suites and com-
ing the private key to the certificate. While this may not be
                                                                    pression algorithms, an optional session ID of a previous
enough for a complete exploit, we confirmed for 9 of those
                                                                    connection, as well as a list of supported extensions. The
vulnerabilities that the vulnerability allows the attacker to
                                                                    server responds with a ServerHello message, which spec-
receive media data from the peer. This would allow an active
                                                                    ifies the selected protocol version, cipher suite, and com-
MitM attack to effectively join a media call instead of the in-
                                                                    pression algorithm, a session ID, server nonce, and a list of
tended client, thereby compromising the confidentiality of the
                                                                    extensions. The server then sends a Certificate message to
media connections. Last but not least, we propose additional
                                                                    the client containing its X.509 certificate chain. When the
hardening measures that can be implemented in DTLS-SRTP
                                                                    server selects an ephemeral cipher suite, it additionally sends
implementations (like browsers) to reduce the potential for
                                                                    a ServerKeyExchange message containing its ephemeral pub-
dangerous misconfigurations.
                                                                    lic key signed with the certificate’s private key. If the server
   Contributions. We make the following contributions:
                                                                    is configured to request client authentication, it will addition-
  ▶ We create the first testing platform, DMS, for analyzing        ally send a CertificateRequest message to indicate this. The
    DTLS-SRTP implementations in a black-box manner,                server then finishes its flight by sending a ServerHelloDone
    requiring only MitM capabilities (Section 3). Our test          message, which indicates to the client that the server is await-
    framework is modular and open source.                           ing a response from the client. If the server requested client
  ▶ We present a suite of tests to perform a thorough eval-         authentication, the client sends its client certificate (or cer-
    uation of the DTLS-SRTP ecosystem, focusing on the              tificate chain) in a Certificate message. If the client does not
    DTLS component, gathering data on algorithm support             have a suitable certificate, this message can be left empty. The
    and deployment practices, and, specifically targeting au-       client then proceeds to send a ClientKeyExchange message,
    thentication (Section 4).                                       which contains the client’s ephemeral public key. If the client
  ▶ We perform the first case study of the DTLS-SRTP                was able to send a certificate, it also sends a CertificateVerify
    ecosystem, spanning 33 media server implementations,            message containing a signature over the hash of the current
    with a particular focus on DTLS authentication. Among           transcript of the handshake. The signature is computed with
    the tested implementations, we identify 19 cases where          the private key of the client’s certificate, thereby proving to
    authentication is broken at the DTLS layer. In 9 of these       the server that it is in possession of the certificate’s private
    cases, we find that the vulnerability is exploitable and        key. At this point, the client and the server have all the neces-
    can be used to decrypt media data from a pure Man-              sary information to compute the shared secret for the DTLS
    in-the-Middle position. Among the vulnerable appli-             connection. Using this shared secret and a PRF, both parties
    cations are popular services with hundreds of millions          evaluate a master secret, which is in turn used to derive the
    of users, including Webex, Discord, Zoom, and Steam             symmetric keys for securing data. The client then sends a
    (Section 5).                                                    ChangeCipherSpec message, indicating to the server that all
  ▶ We demonstrate how an attacker can fully exploit the            subsequent messages will be encrypted using the negotiated
    identified vulnerabilities and eavesdrop on teleconferenc-      keys, followed by a Finished message containing a crypto-



USENIX Association                                                                       35th USENIX Security Symposium         323
graphic checksum over the handshake transcript. Upon re-            via a signaling server to negotiate parameters for the media
ceiving this message, the server will recompute the checksum        connection and make proposals on how to establish a connec-
to verify that both parties saw the same handshake messages.        tion by exchanging Interactive Connectivity Establishment
If successful, the server will send its own ChangeCipherSpec        (ICE) candidates. Both parties exchange fingerprints of the
and Finished messages as confirmation to the client. The            certificates that they will use in the DTLS handshake, and
handshake is complete, and application data can now be ex-          they also negotiate which peer will assume the role of DTLS
changed.                                                            server and that of DTLS client.
   To prevent DoS attacks, a DTLS server can request the               Connection Establishment Phase. Once signaling is com-
client to prove its ability to receive server messages and is       plete, they proceed to establish a network connection in order
thus not spoofing its IP address. To this end, the server can re-   to communicate with each other. Albeit straightforward in
spond to the ClientHello message with a HelloVerifyRequest          a centralized setting, where clients (i.e., browsers) simply
message containing a stateless ’cookie’. In return, the client      connect to a central media server, connection establishment
will retransmit its ClientHello message with this cookie, to        is more challenging when both peers of the connection are
prove that it received it.                                          clients. Clients are often behind NAT gateways and are thus
                                                                    not aware of their public IP address, and may also be restricted
2.1     DTLS-SRTP                                                   by firewalls. The ICE protocol [28] is used to overcome these
                                                                    limitations. In turn, ICE can use Session Traversal Utilities
Real-time Transport Protocol (RTP) [50] is a protocol for           for NAT (STUN) [38], Traversal Using Relays around NAT
delivering audio and video over IP networks, offering tim-          (TURN) [37], or try to establish a direct connection. The
ing information and sequence numbering. Secure Real-time            STUN protocol allows a peer to learn its public-facing IP
Transport Protocol (SRTP) [8] extends RTP by additionally           address and port. TURN is an extension of STUN, used when
providing confidentiality through encryption, message authen-       direct communication between two peers is not possible, for
tication, and replay protection for media streams. However,         example, due to a firewall. In such cases, the peers can com-
SRTP still requires an external key management mechanism            municate via a TURN server that relays their communication.
to exchange the necessary symmetric keys. Accordingly,              ICE will try different approaches until a connection is estab-
the DTLS-SRTP protocol augments SRTP with the DTLS                  lished.
handshake. During the DTLS handshake, both endpoints                   Key Exchange Phase. Once a connection is established,
authenticate using certificates, which can be self-signed and       both peers need to exchange keys to secure media and data
generated on the fly. Self-signed certificates are authenticated    traffic. As previously negotiated during signaling, one party
by exchanging their fingerprints in Session Description Proto-      will act as a DTLS client and the other as a DTLS server.
col (SDP) during signaling. Once complete, the shared secret        Keys are exchanged using the DTLS handshake with client
is used to generate the master keys and salts required by SRTP      authentication, using the certificates that the parties have
to protect media packets.                                           committed to in the signaling phase. Once the handshake is
                                                                    complete, the master secret of the connection is used to export
2.2     WebRTC                                                      keys for the media channel.
                                                                       Media Phase. The peers are now ready to start exchanging
Web Real-Time Communication (WebRTC) is a protocol suite            media through the SRTP protocol. Video and audio are encap-
enabling secure real-time communication in browser appli-           sulated in SRTP packets, whereas connection metadata and
cations. It is specified jointly by the IETFs’ rtcweb working       other control information are transported using SRTCP [8, 50].
group and W3Cs’ Web Real-Time Communications working                The usage of SRTP and the concrete cryptographic algo-
group. The IETF is responsible for defining and standardizing       rithms are negotiated in the key exchange phase through the
the protocols used in WebRTC, while W3C is tasked with              use_srtp DTLS extension. Additionally, WebRTC applica-
standardizing the browser API WebRTC. Today, virtually all          tions can also use SCTP [57, 61], typically for chat messages
teleconferencing services (e.g., Zoom, Discord, Google Meet,        and meta information, which will be protected by DTLS di-
Webex) use WebRTC in their web applications. Additionally,          rectly.
it is used in browser applications for streaming and voice
interaction with AI agents.

2.2.1    WebRTC Connection Establishment                            2.3    TLS-Attacker
A WebRTC connection proceeds in four phases, as illustrated         TLS-Attacker [56] is an open-source framework for analyzing
in Figure 1.                                                        TLS and DTLS implementations. With TLS-Attacker, users
   Signaling Phase. A WebRTC connection starts with the             can generate arbitrary protocol flows and modify the structure
signaling phase, where two parties exchange SDP messages            of the included protocol messages at runtime.



324     35th USENIX Security Symposium                                                                       USENIX Association
3     DMS: Testing DTLS-SRTP                                          2. Traffic Filtering. To enable testing, our testing tool is
                                                                   brought into a Man-in-the-Middle position, where it is able
While previous work on WebRTC focused on the signaling             to intercept the network traffic between the media server and
channel and Man-in-the-Middle attacks with a malicious sig-        the local application. Using iptables and pcap4j [66], we
naling server, other potential flows, like MitM-based attacks      route all UDP traffic from both communication directions
on the authentication on the DTLS layer that exploit imple-        to our analysis tool, where we make a decision of whether
mentation and configuration flaws, have not received the same      the UDP packet is interesting for further analysis (i.e., it
attention. In this work, we therefore want to investigate the      belongs to a DTLS-SRTP connection). Packets that are not
potential for Man-in-the-Middle attacks without a malicious        interesting get forwarded, while packets that are will be sorted
signaling server.                                                  into processing queues associated with a logical DTLS-SRTP
   For this work, we focus on the security of the DTLS con-        connection.
nection. The security of DTLS is very closely related to the          3. Performing the Test. Once we are able to receive UDP
security of the TLS protocol, which has been heavily ana-          packets and associate them with logical connections, test exe-
lyzed in the past and is considered, when implemented and          cution can start. We group the tests we want to execute into se-
configured correctly, as secure. However, no public study          mantically similar test groups called a Probe. Each probe can
has analyzed whether DTLS-SRTP is implemented and con-             request connections to be started via the Booter interface to
figured securely in real-world systems. The DTLS protocol          then execute multi-context TLS-Attacker WorkflowTraces.
offers various features, some of which are no longer con-          The Probe then uses these results of the execution to draw con-
sidered secure or state-of-the-art, which can lead to severe       clusions about the configuration and implementation of the
vulnerabilities. At the same time, incorrectly implementing        system under test. To implement our tests, we extended the
the protocol can completely break all security properties of       TLS-Attacker framework with support for STUN and TURN,
the protocol. To assess whether an implementation is cor-          as well as additional Actions to better support our test cases.
rectly implemented and configured, we will use system tests        For each WorkflowTrace, we always try to find evidence
that allow for the dynamic testing of implementations without      of the behavior. For example, when testing for supported
significant changes to the system under test.                      cipher suites, it may happen that we do not get a response
                                                                   from the system under test. From this, we could conclude that
                                                                   the cipher suites we offered were not supported. However,
3.1    System Tests for DTLS-SRTP
                                                                   it may also be that for some application-specific reason, the
To answer our research questions, we built a framework to          media server closed the DTLS endpoint entirely, and that the
analyze DTLS-SRTP applications on a system test level, with-       server is, in fact, supporting a cipher suite we offered. We
out hooking deeply into the tested application, such that we       therefore execute tests where we did not get a final answer at
can support a plethora of platforms and applications without       the point of test, up to 5 times or until we get a definite answer
custom code for each, beyond automating the startup of the         (like an Alert message). We then treat the final answer as the
application. We achieve this by leaving the tested application     answer of the target to the test. After all tests have been per-
as is, not interfering with the signaling of the application,      formed, we use the booter interface to bring the application
and only interacting with the tested application like a nor-       back into its starting state. For the decryption of media traffic,
mal user (potentially by emulating mouse clicks and button         we use the jitsi-SRTP library [27]. To collect evidence for
presses) and then performing our tests from a Man-in-the-          multiple different behaving DTLS-SRTP implementations,
Middle position. Crucially, our approach does not require          we fingerprint all seen ClientHello messages, ServerHello
installing any certificates or private keys on the system under    in response to an unmodified ClientHello, and Certificate
test nor do we modify the application’s trust store to decrypt     messages. For ClientHello messages, we use JA3 [49] finger-
traffic. This makes our testing framework entirely black-box       prints, for ServerHello we use JA3S [2] fingerprints, and for
and portable across different platforms and applications. The      certificate messages, we built a custom similar solution based
overall architecture of our testing platform is visualized in      on hashing the number of certificates, the length of the issuer,
Figure 2.                                                          the length of the subject, the public key OID and the signature
   1. Booting. To start the analysis, DTLS-MitM-Scanner            algorithm OID.
(DMS) can request the startup of a local application with a           4. Reporting. After all probes have been executed, a report
Booter. The Booter abstracts away the concrete steps to start      with the results is returned. If this report contained more than
or stop a DTLS-SRTP connection, for example, logging into          one fingerprint for each analyzed message type, we conclude
the web application and starting a video conference, or hang-      that there are multiple different behaving endpoints. From that
ing up a call on the web application. Booters can then either      point on, we attempt to manually identify a pattern that allows
automatically start or stop the application using scripts or Se-   us to distinguish between the two endpoints. We discard the
lenium, or can be implemented by manually starting/stopping        report and restart the scanning with an additional filter in
the application on the request of DMS.                             place that only triggers on connections that have the selected



USENIX Association                                                                      35th USENIX Security Symposium          325
                                   Analysis Host
                                                                                             responsible for a set of properties.
                             DTLS-MitM-Scanner
               4                                                                                Selftest. To explain how these probes operate, we will
                                                                                             first introduce the most basic one, the SelfTestProbe. The
                                                                         1                   SelfTestProbe first starts the connection with the booter




                                                                Booter
                                        TLS-Attacker                         start()
    Media Server       3 Probes
                                                                                             interface. Then the probe just forwards the messages between
                                            jitsi-srtp
                                                                                             the peers until the client sends its certificate. After that, we
                     DTLS/Media                          DTLS/Media
                                                                                 Local
                                                                               Application
                                                                                             use the booter to reset the application. This test allows us to
                                  PCAP4j Filter
                                                                                  Host
                                                                                             verify that the booter is working properly, i.e., able to start the
                                                                 2                           DTLS-SRTP connection, that we are able to intercept the traf-
    Internet
                      UDP                                    UDP                             fic correctly, and also that we are able to forward messages
                                       TCP
                                                                                             correctly. Additionally, the probe allows us to read many
                                                                                             properties of the connection straight away. The ClientHello
               Figure 2: Sketch of the DMS architecture.                                     message contains the client-supported cipher suites, the high-
                                                                                             est protocol version, supported compression algorithms, and
                                                                                             supported extensions. The ServerHello tells us which param-
characteristic (i.e., a certain source port, JA3 fingerprint, or
                                                                                             eters would be naturally negotiated between the client and
source IP).
                                                                                             the server (version, cipher suite, compression algorithm, and
                                                                                             extensions). Additionally, the test shows us the structure of
3.2         Limitations                                                                      the certificates that are being used by both peers. Last but not
                                                                                             least, the test allows us to see if the server requires the client
Missing TCP support. To minimize overhead, we delib-                                         to authenticate.
erately do not intercept TCP traffic. Under this constraint,                                    Basic DTLS Properties. We implemented a group of
if a peer fails to receive responses on its UDP-based ICE                                    probes tasked with retrieving parameters from the server’s
candidate pair within the retransmission window, it will be                                  configuration that are not visible through passive observation.
marked failed, and the application switches to an alternative                                In these tests, we intercept the original ClientHello message
pair. In our observations, applications typically first migrate                              from the client and replace it with a crafted ClientHello mes-
to a TURN-based UDP path and, if that also fails, may se-                                    sage designed to force the server into negotiating different
lect a TCP-based ICE candidate. Because our tool monitors                                    parameters to probe it for support for different parameters. For
only UDP, any DTLS-SRTP association that moves to a TCP                                      example, to test the different server-supported cipher suites,
path becomes invisible to us. It is therefore essential that we                              we first send a ClientHello message with all TLS-Attacker
process all UDP packets promptly to avoid triggering such                                    supported cipher suites that are allowed in DTLS (317). The
fallbacks. Moreover, sessions that select a TCP-based candi-                                 cipher suite the server chooses is then considered supported.
date right at the start, such as Viber and Cloudflare Agents,                                In the next connection, we then propose the same list of ci-
are outside the scope of our evaluation.                                                     pher suites, excluding those the server has already selected
   TURN Channels. Our implementation supports TURN but                                       in a previous connection. We repeat this process until the
does not support TURN channels [33]. To account for this,                                    server no longer chooses a cipher suite. We perform this test
we drop all TURN channel-establishment messages, prevent-                                    for the supported cipher suites, protocol versions, signature
ing the establishment of a TURN channel within the TURN                                      algorithms, named groups, and SRTP protection profiles.
connection. This forces peers to use STUN SendIndication
and DataIndication to exchange payloads, if they support
them. However, we are unable to analyze applications that                                    4.2    Authentication Bypasses
rely exclusively on data exchange through TURN channel
messages.                                                                                    To answer RQ2, we developed a total of 19 tests for the
                                                                                             authentication mechanism of DTLS-SRTP. Some of the tests
                                                                                             we designed are motivated by the existing literature. The
4       Implemented Tests                                                                    rest were constructed partially in an ad-hoc manner, based on
                                                                                             our experience and knowledge of common pitfalls that occur
We added various tests to our framework to analyze the im-                                   in (D)TLS implementations, while taking into account the
plementation and configuration of the target systems.                                        specific nature of the WebRTC ecosystem that is based on
                                                                                             self-signed certificates. We group our tests into the following
                                                                                             categories.
4.1         Property Tests
                                                                                                Certificate Requested. If the DTLS server is not config-
To answer RQ1, we built tests using TLS-Attacker to assess                                   ured to request a certificate from the client, the client does not
specific properties of the involved implementations. We or-                                  authenticate at all, meaning that the server later has no chance
ganize the tests we perform into probes, each of which is                                    to detect illegitimate clients on the DTLS layer, leading to



326        35th USENIX Security Symposium                                                                                               USENIX Association
a trivial ’authentication bypass’. We therefore test if DTLS           and CertificateVerify messages to test if peers are correctly
servers request client authentication.                                 implementing this implicit requirement.
   Authentication Required. DTLS libraries usually support
optional and required authentication. Required authentication
means that the server will not accept connections in which the            No Flow Bypass. Since DTLS is usually used on top of
client did not send a valid certificate during the handshake.          UDP, it is possible that messages naturally arrive out of or-
With optional authentication, the DTLS server will also finish         der. However, implementations should not process messages
DTLS connections if the client did not present a certificate at        out of order; instead, DTLS implementations can buffer mes-
all. In those cases, the DTLS library ‘marks’ the connection           sages that arrive out of order and process them at a later
internally as not authenticated but still hands the connection to      point. If an implementation can be tricked into processing
the application for consideration. In the context of WebRTC,           out-of-order messages (maybe with an incorrect message se-
optional authentication should not be used, as both parties            quence number, the implementation’s internal state might get
must authenticate to establish a secure connection [20, Chap-          confused into accepting connections it should not accept. A
ter 5]. To test if optional authentication is supported, we try        prominent example of this was shown by Fiterau-Brostean
to connect to the server with an empty certificate message.            et al. [21], who were able to present multiple variations of
   Performs Identity Check. Another potential flaw that ei-            authentication bypasses in JSSE [36]. Inspired by Fiterau-
ther peer can make is related to the identity check. Peers have        Brostean et al. [21], we considered three different tests, a
to not only check that they receive a certificate from their peer,     handshake where we omit the Certificate message and are
but also need to check that the certificate that they receive is       therefore not presenting an identity, a handshake where we
the correct one (i.e., with the same fingerprint as exchanged in       omit the CertificateVerify message and are therefore not prov-
the SDP). To test if peers verify the identity, we differentiate       ing that we are not in possession of the private key, and last
between two cases: we either try to authenticate with a com-           but not least a handshake where we are neither presenting a
pletely unrelated certificate (i.e., the TLS-Attacker default          Certificate nor CertificateVerify message, ignoring authenti-
certificate) or try to authenticate with a mimicry certificate.        cation completely. If any of these handshakes are completed,
This certificate mimics the expected certificate in all regards        we have a potential authentication bypass.
(same key type, same subject, same issuer, etc.), but the ex-
pected public key (and signature), which we replaced with our
own. We perform this test to rule out identity checks on other            Public Key Protected. The public key of each peer in mu-
(insecure) metrics, such as the common name. Variants of               tual DTLS is protected by a signature, which, in the case of
this test involve presenting a mimicked certificate alongside          the client, is computed over the session transcript, while in
the original peer certificate in the hope that the system under        the case of the server, it signs the public key with the nonces
test will authenticate us based on the original peer certificate       from the hello messages. Since DTLS implementations have
fingerprint, while completing the handshake with keys from             to be flexible regarding their received message order, we try
our own certificate.                                                   to see if it is possible to inject a second public key into the
   Incorrect Trust Store. While DTLS-SRTP implementa-                  connection that is not protected by the signature. Our hope
tions are supposed to only accept certificates that match the ex-      is that the peer verifies the signature with the original key,
changed certificate fingerprint, incorrectly configured DTLS           while it computes the shared secret using our maliciously in-
implementations might also accept certificates that are ac-            jected key. For the client’s public key, we do this by sending a
cepted in general by the operating system’s trust store. There-        ClientKeyExchange message after the CertificateVerify mes-
fore, it might be possible to confuse a peer into accepting a          sage. This out-of-order message should be discarded by the
certificate with an incorrect fingerprint, which is generally          server. However, if it does not implement the state machine
trusted by the browser/Internet PKI. To perform this test, we          correctly and processes the message, the ClientKeyExchange
send a certificate we received from Lets Encrypt [30] using            message can potentially overwrite the client’s public key in
RSA-2048 with SHA256, and ECDSA P384R1 with SHA384                     the server’s internal state, allowing the attacker to bypass
for a domain under our control.                                        client authentication. We perform the same test for the server,
   Signature Verified. When signatures are used in key ex-             sending a second ServerKeyExchange message after the first
change protocols, it is important that peers also verify the           initial ServerKeyExchange message. For this test case, we are
correctness of the transmitted signatures. As mentioned by             less optimistic about the results, as the ServerKeyExchange
Maehren et al. [32], the (D)TLS RFCs1 never explicitly men-            message contains a signature that we, as an attacker, can-
tion that peers are supposed to verify signatures. We therefore        not forge, meaning the client has to process the out-of-order
also perform tests for both peers where we invalidate the signa-       message and ignore or not act on the invalid signature. In
ture (by flipping bits in the middle) in the ServerKeyExchange         both cases, we do the test twice, once with a correct message
                                                                       sequence number and once with the same sequence number
   1 RFC 5246 (TLS 1.2), RFC 8446 (TLS 1.3), and RFC 6347 (DTLS 1.2)   that the original key exchange message had.



USENIX Association                                                                         35th USENIX Security Symposium         327
4.3    Exploitability Tests                                       handshake is completed, using the information presented in
                                                                  the DTLS handshake, we need to send the ’correct’ appli-
An issue that arises from our testing approach is that a com-
                                                                  cation data and check if the peer responds with media data.
pleted DTLS handshake, which reveals an authentication flaw
                                                                  For example, Discord’s media server requires a client to send
on the DTLS layer, may not necessarily result in real ex-
                                                                  a valid SRTP message with a correct SSRC before it will
ploitable behavior on the application layer. We identified
                                                                  start sending media to the client. Another example is Cisco
three main reasons for unexploitable issues:
                                                                  Webex, which needs a data channel setup and a completion of
   • Delayed Client Authentication. Implementations could         the Webex Multistream protocol [15] before the attacker can
     verify the state and properties of the established DTLS      receive media from the server. To avoid reverse engineering
     connection after the handshake was completed. Im-            of applications and ensure the correct message is sent, we
     plementations can then abandon the connection before         use a specialized browser to test the exploitability of web
     using it to send any sensitive data, making the perceived    applications. This browser has been modified to accept any
     vulnerability unexploitable.                                 certificate fingerprint presented by our analysis tool, enabling
                                                                  us to use it to interact with the web application and generate
   • Application State Signaling. Another mitigation could        application data. DMS will then use this application data
     be implemented on the application layer. If only one of      within a connection in which it performed the authentication
     the peers is vulnerable to an authentication bypass, it      bypass. If we do not receive media data, we conclude that
     may be that the peers wait for a signal on the applica-      the application is merely performing the authentication check
     tion layer before they transmit data. If one of the peers    after the DTLS connection is established. In contrast, when
     never finishes the DTLS connection, the signal to start      we receive media data, we conclude that authentication on the
     media data transmission may never be sent, preventing        DTLS layer is truly broken. For non-web-based applications,
     the leakage of confidential data to the attacker.            we omit this evaluation. Other exploit-hindering measures on
                                                                  the application layer may still be in place, but we consider
   • Application Layer Authentication. Applications are           their analysis as out of scope for this work.
     free to not rely on the security of the DTLS-SRTP chan-
     nel at all and can implement their own cryptography with
     their own authentication mechanisms on top of it. This       5     Server Evaluation
     results in a custom security architecture that no longer
     follows any public standards and is therefore also very      We analyzed the state of the ecosystem and DTLS-SRTP
     difficult to test automatically.                             implementations using our framework. As applications, we
                                                                  chose the web applications (WebRTC) of multiple different
   At the same time, analyzing if a detected vulnerability is     audio and video conferencing and chat systems. We per-
actually exploitable is challenging, as we do not have access     formed all WebRTC tests on web applications using Chrome.
to the details of the remote implementation. Applications use     To test DTLS-SRTP implementations on other platforms, we
a diverse mix of protocols and technologies in the media con-     selected a similar list of Desktop and Android applications.
nection, which may require target-specific messages on the        The selected applications were chosen based on perceived
media channel from the attacker to trigger the flow of media      popularity to explore prominent use cases across diverse plat-
traffic, hindering an exploitability analysis. To better under-   forms. More details on our test methodology can be found in
stand the impact of our identified vulnerabilities, we conduct    Appendix A.
additional tests to explore whether the observed behavior is
actually exploitable and to rule out any limiting factors. Fur-
                                                                  5.1    General Properties
thermore, we consider vulnerabilities as exploitable for which
the vendor has applied a patch after our disclosure (unless       DTLS Versions. There exist three distinct DTLS version,
otherwise communicated). We want to emphasize that the            DTLS 1.0 [46] (2006), DTLS 1.2 [47] (2012), and DTLS
fact that we cannot show exploitability does not necessarily      1.3 [48] (2022). Across all tested platforms, only Adobe
mean that the issue is not exploitable, as we are working in a    Connect supported DTLS 1.0. In contrast, DTLS 1.2 was
black-box scenario.                                               supported by every tested implementation. Support for DTLS
   Unprovoked Media. Some applications are willing to send        1.3 was effectively nonexistent at the time of our experiments.
media data immediately after finishing the handshake. We,         Firefox officially added DTLS 1.3 support with version 127.
therefore, added a probe that analyzes the behavior of the        We used version 137 for our tests and found that it does not
peer after a successful DTLS authentication bypass with our       come with DTLS 1.3 enabled. At the time of writing, we
analysis tool. If a peer sends media data that we can decrypt,    observed that DTLS 1.3 was re-enabled in Firefox in later
we conclude that the vulnerability is exploitable.                versions, suggesting that the absence of DTLS 1.3 in Firefox
   Ruling out Delayed Client Authentication. To rule out          137 was a bug. The lack of support for DTLS 1.0 indicates
that the authentication test is simply performed after the DTLS   that DTLS-SRTP is atypical compared to recent studies on the



328   35th USENIX Security Symposium                                                                       USENIX Association
general DTLS ecosystem by Erinola et al. [18], where most              Signature+Hash Algorithms. Support for signature and
servers supported version 1.0 and 1.2 simultaneously. The           hash algorithms is presented in Table 6 in Artifacts.pdf
full list of DTLS versions supported across tested platforms        file in our artifact. The results are mostly unsurprising, with
is present in Table 1.                                              support focusing on RSA, ECDSA, or EDDSA. Signature
   Cipher Suites. In Table 1, we also list the cipher suites that   algorithms supporting MD5 were generally not observed. Ad-
the tested applications supported. Cipher suites with weak          ditionally, server implementations typically allow the client
parameters were generally not supported by any tested appli-        more leeway in their support than what they are willing to use
cation. All implementations supported forward secure key            themselves.
exchange algorithms and AEAD cipher suites. In general, we             Certificate Analysis. The results of our certificate analysis
did not observe any support for exotic TLS cipher suites or         are presented in Table 7 in Artifacts.pdf file in our artifact.
known broken cipher suites, such as EXPORT or NULL. Cipher          In contrast to our expectations, many applications were not
suites using 64-bit block ciphers (vulnerable to the Sweet32        using fresh self-signed certificates for every connection. Many
attack) were observed only in the Instagram web applica-            remote applications used the same certificate for multiple
tion. However, since servers do not negotiate this cipher with      connections, while local applications always generated a fresh
browsers (due to missing support), there is no real impact.         certificate. Additionally, some applications did not use self-
   For WebRTC specifically, all implementations must support        signed certificates at all but used normal Internet PKI.
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 [45]. Dur-                     Our analysis of the certificates revealed that all tested appli-
ing our evaluations, this cipher suite was often supported,         cations use either ECDSA or RSA certificates. For ECDSA,
but not universally available in the deployed configuration.        we exclusively saw SECP256R1 certificates, likely motivated
Additionally, WebRTC implementations must favor cipher              by browser support (see Table 3). For RSA, most applications
suites with forward secrecy over non-forward secure ones            use a 2048-bit RSA modulus, which is considered secure.
and must favor AEAD cipher suites over CBC cipher suites            Two exceptions to this were Vonage and Zoho. Vonage used
(RFC 8827). However, among the tested applications, many            a 1024-bit modulus, which, while not catastrophic, is on the
do not even enforce a server-preferred order, but instead rely      border of what is considered crackable by motivated attackers
on the ordering of the client-proposed list, giving browser         and has been deprecated by NIST. More severely, Zoho was
developers more agency about algorithm choices.                     using a 512-bit modulus, which is unarguably too short for
   The most concerning issue we found is that cipher suites         modern applications.
are advertised as supported, but fail in practice when we              Curiously, many certificate subject names contained the
tried to use them. Concretely, we observed servers willing to       names of WebRTC/DTLS-SRTP libraries, such as media-
negotiate a specific cipher in their ServerHello message, but       soup, FreeSWITCH, and LiveSwitch, leading us to believe
would then send an Alert message right after when trying to         that these applications are using these libraries. Some appli-
send a certificate message. We attribute this, for the most part,   cation servers use certificates with long expiration dates (10
to server-side misconfigurations. The server is trying to use       years or more). In one case, however, we even encountered
cipher suites that require a certificate with a public key type     an expired certificate (Discord).
not present in the certificate it has committed to using in the
SDP.
                                                                    5.2    Authentication Bypasses
   SRTP Profiles. Regarding supported SRTP protec-
tion profiles, we see little diversity among browsers in            Our study uncovered multiple server authentication bypasses
Web̃RTC. All tested browsers supported AES GCM 128/256,             on the DTLS layer across the tested applications. We have
and all browsers supported the mandatory SRTP profile               highlighted applications from which we successfully obtained
SRTP_AES128_CM_HMAC_SHA1_80. The only difference we                 media or encrypted metadata in Table 2.
found between browsers is that Firefox also supported counter          Webex. When testing the Webex application, our tool re-
mode with 32-bit HMACs. HMACs with 32-bit lengths are               ported that it is possible to authenticate to the Webex media
rather weak, as they allow an attacker to forge a MAC by            server by presenting an empty certificate message. Cisco
guessing with non-negligible probability. Across other appli-       fixed the issue and assigned CVE-2025-20215 [16].
cations, we see no support for other protection profiles, with         Discord. In the Discord web application, we discovered
individual support for 32-bit HMACs. The full results of our        two authentication bypasses. In October 2022, we discovered
analysis are given in Table 1.                                      that it was possible to finish the DTLS handshake with the
   Supported Groups. The results of our analysis of sup-            Discord server using any X.509 certificate, indicating that
ported groups are presented in Table 5 in Artifacts.pdf             Discord was not verifying the identity of peers. While we
file in our artifact. Some applications support a wide range of     investigated the issue, we noticed that shortly after our dis-
groups, including some that are also considered weak. How-          covery, Discord independently found and fixed the issue. We
ever, to exploit their presence, both endpoints have to support     contacted them, and they confirmed that they independently
the weak choice, which we did not observe in any application.       fixed the issue. In February 2024, we discovered that the Dis-



USENIX Association                                                                       35th USENIX Security Symposium           329
                                                                                                                                  DTLS                                                                                                                     SRTP
                                                               Version                                     KEX                     Symmetric Cipher                                           Mode                                                                  Profile




                                                                                                                                                                                                                                   SRTP_AES128_CM_HMAC_SHA1_80
                                                                                                                                                                                                                                                                 SRTP_AES128_CM_HMAC_SHA1_32
                                                                                                                                                                                                                                                                                               SRTP_AEAD_AES_128_GCM
                                                                                                                                                                                                                                                                                                                       SRTP_AEAD_AES_256_GCM
                                                                                  Order enforced




                                                                                                                                                                                                                  Order enforced
                                                                                                                             CHACHA20


                                                                                                                                               CAMELLIA
                                                 Platforms




                                                                                                                                                                        EXPORT
                                                                                                   ECDHE




                                                                                                                                                                                                          CCM_8
                                                                                                                                                                                 NULL
                                                                                                                                                          SEED
                                                                                                                                        ARIA



                                                                                                                                                                 3DES



                                                                                                                                                                                        GCM


                                                                                                                                                                                                    CCM
                                                                                                           DHE




                                                                                                                                                                                              CBC
                                                                                                                 RSA
                                                                                                                       AES
                                                             v1.0
                                                                    v1.2
                                                                           v1.3
                           Chromium              ð ± q PV            y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           Firefox                ± q PV             y      n           -           ✓              ✓           ✓                                                        ✓     ✓                         -                 ✓ ✓ ✓ ✓
                           Safari                     PV            y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           BBB 2.4                    IP            y      n           -           ✓      ✓     ✓ ✓           ✓ ✓ ✓ ✓                                                  ✓     ✓ ✓ ✓                     -                 ✓
                           BBB Demo v3.0.12 con 2  PV               y      n           -           ✓              ✓                                                                    ✓     ✓                         -                 ✓   ✓ ✓
                           ChatGPT con 1           ð   PV            y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           ChatGPT con 2           ð   PV            y      n           -           ✓              ✓                                                                    ✓     ✓                         -                 ✓   ✓ ✓
                           Chime                   q   PV            y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                 clients




                           Clickmeeting con 2         IP            y      n           -           ✓      ✓     ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓ ✓ ✓ ✓
                           Goto Meet                  PV            y      n           -           ✓      ✓     ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓
                           LiveKit con 2              PV            y      n           -           ✓              ✓                                                                    ✓     ✓                         -                 ✓   ✓ ✓
                           MatterMost                 PV            y      n           -           ✓              ✓                                                                    ✓     ✓                         -                 ✓   ✓ ✓
                           Slack                  ± q PV             y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           Slack con 1                PV            y      n           -           ✓      ✓     ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           Slack con 2                UM            y      n           -           ✓      ✓     ✓ ✓           ✓ ✓ ✓                                                    ✓     ✓ ✓ ✓                     -                 - - - -
                           Steam                   ±   PV            y      n           -           ✓            ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓ ✓
                           Vonage con 1               PV            y      n           -           ✓      ✓     ✓ ✓           ✓                                                        ✓     ✓                         -                 ✓   ✓
                           Wickr                  ±q n               y      n           -           ✓              ✓                                                                    ✓                               -                 - - - -
                           Chromium              ð ± q PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓                      ✓                    ✓                               ✓ ✓
                           Firefox                ± q PV             y      n ✓ ✓                                      ✓       ✓                                                        ✓     ✓                      ✓                    ✓                             ✓ ✓ ✓
                           Safari                     PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓                      ✓                    ✓                               ✓ ✓
                           Adobe Connect               y            y      n     ✓                                    ✓                                                                ✓     ✓                      ✓                    ✓
                           BBB Demo v3.0.12 con 1  PV               y      n - µ                                      µ                                                                µ                            -                    µ
                           BBB Docker v 3.0.4         IE            y      n ✓ ✓                                      ✓       ✓                                                        ✓     ✓                      ✓                    ✓                             ✓ ✓ ✓
                           ChatGPT con 1           ð   PV            y      n - µ                                      µ                                                                µ                            -                    µ
                           ChatGPT con 2           ð   PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓                      ✓                    ✓                               ✓ ✓
                           Chime                  q n               y      n     ✓                              ✓     ✓       ✓ ✓ ✓                                                    ✓     ✓ ✓ ✓                  ✓                    ✓                               ✓ ✓
                           Clickmeeting con 1         IE            y      n     ✓                                    ✓       ✓                                                        ✓     ✓                      ✓                    ✓                             ✓ ✓ ✓
                           Discord                     n            y      n     ✓                              ✓     ✓       ✓ ✓ ✓ ✓                                                  ✓     ✓ ✓ ✓                  -                    ✓
                           eduMEET                    IE            y      n ✓ ✓                                      ✓       ✓                                                        ✓     ✓                      ✓                    ✓                             ✓ ✓ ✓
                           Google Meet                PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓                      ✓                                                      ✓
                           Instagram                  PV            y      n     ✓                                    ✓       ✓ ✓ ✓   ✓                                                ✓     ✓ ✓ ✓   ✓              -
                           Ionos                                                  ✓                                    ✓       ✓                                                        ✓             ✓   ✓          ✓
                 servers




                                                       n            y      n
                           Janus                      PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓       ✓ ✓ ✓ ✓        ✓
                           Jitsi                       n            y      n     ✓                                    ✓       ✓                                                        ✓             ✓   ✓          ✓
                           LiveKit con 1              PV            y      n - µ                                      µ                                                                µ             µ              -
                           Ringcentral                 n            y      n     ✓                                    ✓                                                                ✓     ✓       ✓              ✓
                           Slack                 ±q n               y      n     ✓                              ✓     ✓       ✓ ✓ ✓                                                    ✓     ✓ ✓ ✓   ✓   ✓ ✓        ✓
                           Slack con 1             ð   HF            y      n     ✓                              ✓     ✓       ✓ ✓ ✓                                                    ✓     ✓ ✓ ✓   ✓   ✓ ✓        ✓
                           Slack con 2             ð    n            y      n ERR ✓                              ✓     ✓         ✓ ✓                                                    ✓     ✓ ✓     - - - -        -
                           Snapchat                   PV            y      n     ✓                                    ✓       ✓                                                        ✓     ✓       ✓ ✓ ✓ ✓        ✓
                           Steam                  ±  PV             y      n     ✓                                    ✓                                                                ✓     ✓ ✓ ✓   ✓ ✓            ✓
                           Teams                       n            y      n     ✓                              ✓     ✓                                                                ✓     ✓       ✓     ✓        ✓
                           Vonage con 2               PV            y      n     ✓                              ✓     ✓       ✓                                                        ✓     ✓       ✓   ✓          ✓
                           Webex                       n            y      n     ✓                                    ✓                                                                ✓     ✓         ✓ ✓ ✓
                           Wickr                  ±q n               y      n - ✓                                      ✓                                                                ✓           - - - - -
                           Zoho con 1                  n            y      n ✓ ✓                                      ✓                                                                ✓     ✓     - - - - -
                           Zoho con 2                  n            y      n     ✓                              ✓     ✓       ✓                                                        ✓     ✓     ✓ ✓
                           Zoom                       PV            y      n ✓ ✓                                      ✓       ✓                                                        ✓     ✓     - - - - -


Table 1: Supported DTLS versions and DTLS/SRTP cipher suites offered by clients and supported by servers. Local endpoints
are shaded in gray. An empty cell indicates that a client did not offer a given suite or a server did not accept it, while
✓ denotes that the suite was offered (client) or accepted (server); ✓ marks the default selected when multiple suites are
supported. µ indicates that the server picks a single cipher suite even if the client does not offer it. A dash (-) denotes “not
applicable”: SRTP may not be negotiated at all and order enforcement may be irrelevant. When forcing a DTLS version, the
alerts seen are PV (PROTOCOL_VERSION), IP (ILLEGAL_PARAMETER), UM (UNEXPECTED_MESSAGE), IE (INTERNAL_ERROR), and
HF (HANDSHAKE_FAILURE), with n indicating a silent abort. Our tool failed to determine DTLS cipher suite order enforcement
for Slack’s Android (marked ERR). Missing DTLS v1.3 support in Firefox is attributed to a bug in Firefox 137 (see Section 5.1).



330   35th USENIX Security Symposium                                                                                                                                                                                                                                                                        USENIX Association
cord server was accepting DTLS connections with optional            the handshake, the server immediately sent us RTP from the
client authentication. We reported the problems to Discord,         call, which we could decrypt. Therefore, we classified Steam
and they acknowledged and fixed the issue, awarding us a bug        as exploitable.
bounty (severity: medium).                                             Vonage. With Vonage, we observed that the media server
    Zoom. Our analysis revealed that the Zoom web applica-          neither requested nor validated a web client’s certificate when
tion’s media server failed to request authentication from the       one was presented. Additionally, Vonage emits media data di-
browser, leading to missing client authentication. We reported      rectly after our authentication bypass, confirming exploitabil-
the issue to Zoom, which acknowledged and fixed it (severity:       ity.
high) and awarded us a bug bounty.                                     RingCentral. The RingCentral WebRTC gateway did not
    Teams. We observed that Microsoft Teams allows a peer           request client authentication from the browser. We directly
to complete DTLS authentication using either an empty cer-          received RTP data from the DTLS endpoint without further
tificate or an arbitrary client certificate. In both cases, once    interaction.
the DTLS handshake completes, we receive plaintext RTCP                Browsers. We evaluated the security of browser implemen-
Source Descriptions, behavior that the WebRTC standard ex-          tations in both DTLS roles: as a DTLS client and as a DTLS
plicitly prohibits [45, Section 6.5], as well as continued ICE      server. Our analysis reveals that none of the tested browsers
connectivity checks (e.g., STUN binding requests/responses).        were directly affected by a direct authentication bypass vul-
However, we did not observe any true RTP media traffic. One         nerability.
possible explanation is that the media server cannot properly          Non-Exploitable. For 11 implementations (marked ✗ in
associate our connection with the correct call. Microsoft inves-    Table 2), we could not provoke media data transmission, or
tigated our report but determined the reported vulnerabilities      we are missing confirmation from the vendor. We therefore
were out of scope because no RTP leakage was observed.              manually investigated individual applications and found, for
    FreeSWITCH. Internally,              BigBlueButton uses         example, that mediasoup [9] actually uses a delayed client
FreeSWITCH [52], an open-source telephony frame-                    authentication check by reviewing the source code. Similarly,
work used by multiple media servers for a variety of purposes       after contacting the Amazon [5] team, we learned that Chime
(e.g., SIP, call routing, and WebRTC). While testing version        is not using DTLS-SRTP for all of its connections, but is also
2.4 of BigBlueButton, we noticed that FreeSWITCH accepts            sometimes using regular DTLS connections that see a custom
any client certificate. In the code, FreeSWITCH mistakenly          authentication after the handshake. We likewise observed
overwrites the remote fingerprint received in the SDP while         the Snapchat web client performing custom authentication
attempting to extract the client certificate’s fingerprint. Thus,   by including a token in the first protected data-channel mes-
the peer certificate verification always returns true. This issue   sage. For Amazon Wickr, we assume that an authenticated
was reported independently of our research in 2023 [40], but        key exchange occurs after the DTLS handshake to establish
the related pull request was never merged. In version 2.5,          keys for end-to-end encryption (E2EE). Among our tests,
BigBlueButton transitioned from using FreeSWITCH for                some were unsuccessful for all applications. Concretely, we
WebRTC calls to Mediasoup.                                          could not find evidence for Flow Bypasses, Missing Signature
    Zoho. In our tests, Zoho established multiple DTLS con-         Verification, or Missing Public Key Protection. Additionally,
nections in one call. We found one of them to be vulnerable,        when testing if the OS Trust Store was used, we observed that
as Zoho’s media server accepted any client certificate in the       the application did not verify the peer’s identity in all cases,
handshake. We were able to MitM the connection and ob-              leading us to conclude that no application was utilizing the
served the exchange of call metadata on a WebRTC data               OS trust store.
channel (SCTP). We therefore consider Zoho as exploitable.
As mentioned in Section 5.1, Zoho used a 512-bit RSA cer-
                                                                    5.3    Non-Security Bugs
tificate. To demonstrate that this allows an attacker to bypass
authentication, we used cado-nfs [58] to factor the key and         During our testing, we encountered several non-security criti-
retrieve the private key for the certificate in 4.5 hours with an   cal bugs in the tested applications that are worth mentioning.
AMD EPYC 7763. While Zoho did not negotiate RSA KEX                 We noticed that our analysis of Discord only functions when
cipher suites by default (which would have allowed for pas-         DTLS retransmissions are used, as the Discord media server
sive attacks), the certificate was used for all incoming clients,   sends only half of the ServerHello flight in its first packet,
allowing an attacker to break the certificate once and then use     without following up with the rest of the flight. Only after a
the keys for active server impersonation attacks. We notified       retransmission were we able to receive the full flight. This
Zoho about the vulnerability, and they replaced the certificate     behavior causes unnecessary delay for real users, as it adds
with an ECDSA one. Zoho determined the missing identity             an additional round-trip time to the connection establishment.
check to be an out-of-scope vulnerability.                          Another observation we made is that five applications are con-
    Steam. For Steam, the media server did not request a client     figured to use the DTLS Denial-of-Service (DoS) countermea-
certificate during the DTLS handshake. After we completed           sure, which involves adding an additional cookie exchange



USENIX Association                                                                      35th USENIX Security Symposium         331
                                                                                                                                Public Key Protected




                                                                                                                                                                                                                                                Public Key Protected
                                                                                                                                                       No OS Trust Store




                                                                                                                                                                                                                                                                        No OS Trust Store
                                                                                          Signature Verified




                                                                                                                                                                                                                           Signature Verified
                                      Cert. Requested




                                                                                                               No Flow Bypass
                                                        Auth. Required
                                                                         Identity Check




                                                                                                                                                                                                          Identity Check
                                                                                                                                                                           Assessment




                                                                                                                                                                                                                                                                                            Assessment
                           Platform




                                                                                                                                                                                               Platform
 DTLS Role Server                                                                                                                                                             DTLS Role Client
 Chromium           ð±q                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Chromium           ð±q        ✓                ✓                    ✓                      ✓                   ✓
 Firefox             ±q                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Firefox            ±q         ✓                ✓                    ✓                      ✓                   ✓
 Safari                               ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Safari                       ✓                ✓                    ✓                      ✓                   ✓
 Adobe Connect                        ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ BBB v2.4                     ✗                ✓                    ✓                      ✗
 BBB v3.0.4                           ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                   ✗ BBB v3.0.12 con 2            ✗                ✓                    ✓                      ✗                   ✗
 BBB v3.0.12 con 1                    ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                   ✗ ChatGPT con 1       ð         ✓                ✓                    ✓                      ✓                   ✓
 ChatGPT con 1        ð                ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                   ✗ ChatGPT con 2       ð         ✗                ✓                    ✓                      ✗                   ✗
 ChatGPT con 2        ð                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Chime               q         ✓                ✓                    ✓                      ✓                   ✓
 Chime               q                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Clickmeeting con 2           ✗                ✓                    ✓                      ✓                   0/
 Clickmeeting con 1                   ✓                 ✓                ✗                ✓                    ✓                ✓                     ✓                   0/ Goto Meet                   ✓                ✓                    ✓                      ✓                   ✓
 Discord 2022                         ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                      LiveKit con 2               ✗                ✓                    ✓                      ✗                   ✗
 Discord 2024                         ✓                 ✗                ✓                ✓                    ✓                ✓                     ✓                      MatterMost                  ✗                ✓                    ✓                      ✗                   ✗
 Discord                              ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Slack              ±q         ✓                ✓                    ✓                      ✓                   ✓
 eduMEET                              ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                   ✗ Slack con 1         ð         ✓                ✓                    ✓                      ✓                   ✓
 Google Meet                          ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Slack con 2         ð         ✓                ✓                    ✓                      ✓                   r
 Instagram                            ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓ Steam               ±         ✓                ✓                    ✓                      ✓                   ✓
 Ionos                                ✓                 ✓                ✓                ✓                    ✓                ✓                     -                   ✓ Vonage con 1                 ✗                ✓                    ✓                      ✓
 Janus                                ✓                 ✓                ✗                ✓                    ✓                ✓                     ✓                   0/ Wickr             ±q         ✓                ✓                    ✓                      ✓                   r
 Jitsi                                ✓                 ✓                ✓                ✓                    ✓                ✓                     -                   ✓
 LiveKit con 1                        ✓                 ✓                ✗                ✓                    ✓                ✓                     ✗                   ✗
 Ringcentral                          ✗                 -                -                -                    -                -                     -
 Slack              ±q                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓
 Slack con 1          ð                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓
 Slack con 2          ð                ✗                 -                -                -                    -                -                     -                   r
 Snapchat                             ✗                 -                -                -                    -                -                     -                   r
 Steam               ±                ✗                 -                -                -                    -                -                     -
 Teams                                ✓                 ✗                ✗                ✓                    ✓                ✓                     ✗                    0/
 Vonage con 2                         ✗                 -                -                -                    -                -                     -
 Webex 2024                           ✓                 ✗                ✓                ✓                    ✓                ✓                     ✓
 Webex                                ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓
 Wickr               ±q                ✗                 -                -                -                    -                -                     -                   r
 Zoho con 1                           ✓                 ✗                ✗                ✓                    ✓                ✓                     ✗
 Zoho con 2                           ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓
 Zoom 2024                            ✗                 -                -                -                    -                -                     -
 Zoom                                 ✓                 ✓                ✓                ✓                    ✓                ✓                     ✓                   ✓

Table 2: Overview of our DTLS authentication tests across tested applications. Local endpoints are shaded in gray. ✓ indicates
an expected and correct behavior, ✗ indicates that the application fails this test on the DTLS layer. As for the Assessment
column:       indicates a failed test that results in an exploitable vulnerability, ✗ denotes that the application sends an encrypted
alert directly after the handshake, 0/ indicates that the endpoint abandoned all communication to us, except for ICE connectivity
checks, and r denotes that the application performs, or is highly likely to perform, a custom authentication protocol after the
DTLS handshake.




332   35th USENIX Security Symposium                                                                                                                                                                                                                                   USENIX Association
to the DTLS protocol. However, in the case of DTLS-SRTP,           browsers support this. Aside from that, the specification also
this addition is arguably not necessary. Namely, in DTLS-          mentions RSA-PSS certificate as a permitted option.
SRTP, the server knows from where it expects a connection
                                                                      We tested the generateCertificate() function in
and can limit incoming ClientHello messages to the expected
                                                                   Chrome, Safari, Edge, Firefox, and Opera to check which
endpoints, preventing DoS attacks. By adding the counter-
                                                                   algorithms and cryptographic parameters are allowed. These
measure, implementations add an additional round-trip time
                                                                   browsers use one of three browser engines: Blink, Gecko, or
to the connection establishment, which unnecessarily slows
                                                                   WebKit. All browser engines use the native WebRTC library2 ;
down the connection. In Webex, the mitigation is not im-
                                                                   however, each engine typically adds additional functionality,
plemented correctly: the cookie is hard-coded to the ASCII
                                                                   leading to browsers potentially behaving differently in identi-
string session id, defeating its purpose. We also observed
                                                                   cal situations.
that many applications that perform a delayed fingerprint
check and terminate the DTLS-SRTP connection after the               For RSA-based signature schemes, we tested the minimum
handshake still leave the ICE candidate pair active, and we        and maximum supported modulus sizes and the smallest sup-
continue to receive STUN Binding Success Responses when            ported exponent. We test this since allowing small moduli
forwarding Binding Requests.                                       may permit factoring attacks [63], and allowing a small ex-
                                                                   ponent can lead to signature forgery vulnerabilities [11]. For
                                                                   ECDSA, we tested which curves out of the SECG curves
6   Proof-of-Concept Exploit                                       over prime and binary fields3 and the Brainpool curves are
                                                                   supported. Some of these curves are too small and may allow
To demonstrate that vulnerabilities on the DTLS layer can          motivated attackers to recover private keys (e.g., [64]). The
lead to an exploit that leaks media data to the attacker, we de-   complete list of curves we tested is available in the artifacts.
veloped a proof-of-concept exploit for Webex. In this exploit,
we wait for a client to establish a connection to Webex, but         We present the results in Table 3. Chrome, Edge, and Opera
then the exploit authenticates using an empty certificate and      behave identically, consistent with all three using Google’s
an attacker-chosen public key. The exploit then finishes the       Blink browser engine. Firefox is the only browser supporting
DTLS handshake. After the DTLS handshake is completed,             ECDSA curves other than P-256. However, Firefox allows
we then request media data for the client’s meeting, using         users to generate potentially weak RSA exponents (e = 3),
Cisco’s Multistreaming protocol [15]. After that, the Webex        which may enable signature forgery attacks if signature vali-
media server sends the audio stream of the targeted call to        dation is not strictly implemented [11].
us, which we decrypt and decode. This allows us to listen             Certificate Permissiveness. We also tested whether
in on the call. From the view of other users in the Webex          browsers accept weak RSA certificates from peers, specif-
meeting, the real user joined the call. After a certain amount     ically those with a modulus size smaller than 1024 bits (e.g.,
of time (~30s), the attacker gets disconnected from the call       512 bits). All tested browsers accept weak RSA certificates
and will not receive further media data. We assume that this       provided by the media server (Table 3, last column). We
is simply a limitation of our simplistic PoC, as we did not        performed this test using a custom Janus [6] media server
prevent the real client from signaling to the media server on      configured to offer a 512-bit RSA certificate to clients.
the application layer that it needs to reconnect.
                                                                      SDP Munging. In all browsers, it is possible to modify
                                                                   the generated SDP offer from the API before sending it to
7   Browser API Evaluation                                         the server, a practice commonly known as SDP munging.
                                                                   Although the specification explicitly forbids this practice [62],
Beyond server-side implementations, we investigated the ex-        it remains widely used by developers to work around API
tent to which the DTLS channel can be influenced through           limitations. Browser vendors are actively working toward its
the JavaScript WebRTC API, as well as the permissiveness           deprecation [14].
of browser certificate acceptance policies. The WebRTC API
hides most of the DTLS connection internals; the main inter-         The extent to which modifications can be made differs
face for users to influence the DTLS channel is through the        across browsers. In all browsers except Firefox, it is not
generateCertificate() function and by manually modi-               possible to change the certificate fingerprint in the SDP. This
fying the SDP sent during signaling.                               would have been beneficial for our testing framework, as it
    Certificate Generation. The WebRTC API function                would allow us to claim custom certificates for analyzing
generateCertificate() generates a self-signed X.509 cer-           peers without modifying the browser’s source code.
tificate and the corresponding private key. The standard
dictates that RSASSA-PKCS1-v1_5 with 2048-bit modulus
and 65537 exponent and ECDSA with P-256 curve must be                 2 https://webrtc.github.io/webrtc-org/native-code

supported, while other algorithms are optional. All tested            3 The NIST curves are a subset of curves defined by SECG.




USENIX Association                                                                        35th USENIX Security Symposium          333
                                              RSA-PKCS1-v1.5                                   ECDSA             Rejects 512-bit RSA
    Browser   Version                                                      RSA-PSS         Supported Curves           certificate
                                         min. N     max. N        min. e
    Chrome    121.0.6167.184              1024       8192         1025         ✗               P-256                     ✗
    Safari    18.6 (20621.3.11.11.3)      1024        8192         260         ✗               P-256                     ✗
    Edge      121.0.2277.128              1024        8192        1025         ✗               P-256                     ✗
    Firefox   122.0.1                     1024       16384          3          ✗        P-256, P-384, P-521              ✗
    Opera     107.0.5045.21               1024        8192        1025         ✗               P-256                     ✗

Table 3: Results of testing the generateCertificate() WebRTC API function. Safari was tested on macOS Sequoia v15.6,
and other browsers on Ubuntu 20.04.6 LTS. The minimum public exponent size was tested with a 1024-bit modulus. For ECDSA,
the function always generates a certificate that uses the SHA-256 hash function, irrespective of what is provided as an argument
for the hash function name.


8     Discussion                                                         Modularity at the Cost of Complexity. Reliable, scalable
                                                                      and portable real-time communication is challenging. Fortu-
Missing CertificateRequest Acceptance. A surprising find-             nately, through the effort of the WebRTC framework, anyone
ing that we observed in many applications is that they did not        can easily create an RTC application capable of running in
request a certificate at all. Browsers (and other clients) gen-       everyone’s browser in little time and without expensive host-
erally accept such DTLS connections because, from the per-            ing costs [31]. To accomplish this, the WebRTC framework
spective of a DTLS library, it is unaware that it is being used       made heavy use of "off-the-shelf" components. This allows
in a WebRTC context where client authentication is manda-             WebRTC to easily interoperate with many existing, older tech-
tory. We therefore propose a new hardening mechanism for              nologies, like VoIP and SIP. However, this also introduced all
(D)TLS libraries, where the same semantics of optional and            the weight and complexity that these older technologies bring.
required authentication, currently employed on the server             For instance, SDP was preferred over JSON or Protobuf for
(see Section 4.2), be replicated on the client. Specifically,         exchanging connection parameters. Instead of exchanging
when client authentication is set to required on a client, it         public keys in signaling, WebRTC uses DTLS to exchange
should abort the connection when the server does not request          them. Even the choice of SRTP may be re-evaluated with
the client to authenticate. Deploying this defense-in-depth           alternatives like RTP over QUIC evolving [17]. Thus, while
mechanism would break misconfigured applications, forcing             these component choices allow for modularity and rapid de-
them to correct their configurations.                                 velopment, the added complexity makes these systems harder
                                                                      to analyze and test, which is probably why these basic DTLS
   DTLS-SRTP vs SDES-SRTP. Earlier versions of WebRTC
                                                                      flaws were not discovered earlier. WebRTC is yet another
used SDES-SRTP (Session Description Protocol Security De-
                                                                      example that, in the long run, a complex design has a toll
scriptions) instead of DTLS-SRTP. With SDES, the sym-
                                                                      on the development lifecycle of such systems and ultimately
metric keys for the SRTP connection are directly exchanged
                                                                      their security. Our open-source testing framework DMS is a
in the signaling phase (via SDP) without the use of public
                                                                      first step toward remedying this, and developers and admins
key cryptography. Eventually, DTLS-SRTP was chosen as a
                                                                      can use it to test their systems and configurations. However,
replacement as it offers better security against an honest-but-
                                                                      in this work, we only analyzed a small portion of the attack
curious signaling server. Neither approach protects against
                                                                      surface of this ecosystem and there are likely many more
an actively-malicious signaling server. In our view, plugging
                                                                      vulnerabilities to be uncovered.
in the whole DTLS technology stack (for both clients and
servers), including X.509 implementations, instead of design-
ing a dedicated key exchange, had its downsides. The (D)TLS           9    Related Work
standard introduces unnecessary technological complexity, as
many of its features are unused in WebRTC. Moreover, DTLS             WebRTC Security. WebRTC’s security architecture is de-
introduced two additional round-trips before a connection is          tailed in RFC 8826 [44] and RFC 8827 [45]. However, both
established, which significantly increases latency. Since only        RFCs cover primarily direct peer-to-peer connections between
the key exchange component of DTLS is used, WebRTC could              two clients. Johnston demonstrated successful MitM attacks
achieve the same goals by exchanging public keys instead of           against naive WebRTC deployments that rely on a compro-
X.509 certificate fingerprints in the SDP. This would have            mised signaling server and recommended authenticating cer-
allowed peers to do the key exchange directly, preventing             tificate fingerprints via an authenticated signaling path [59].
many unnecessary computations, round-trips, and technical             A broader community study similarly argued that WebRTC’s
overhead.                                                             self-signed certificate model makes fingerprint verification via



334    35th USENIX Security Symposium                                                                          USENIX Association
secure signaling essential to prevent MitM attacks [65]. Reiter   et al. [7], who analyzed four DTLS server implementations
et al. also explore untrusted signaling channels and present      and uncovered non-conformant behavior and security issues
privacy leaks where ICE/SDP flows can expose local and pub-       in OpenSSL and TinyDTLS.
lic IPs and enable in-browser network reconnaissance [41].
Notably, none of these works provides concrete guidance for
the security of media servers.                                    10    Conclusion
   RTC Protocols Security. Early VoIP security research by
                                                                  In this work, we presented the first WebRTC/DTLS-SRTP
Gupta and Shmatikov revealed critical weaknesses in how
                                                                  analysis platform DMS. Setting up our platform in a MitM
session keys are established for SRTP. In particular, when
                                                                  position, using TLS-Attacker’s MitM module, allowed us
SRTP is keyed via the older SDES mechanism, a replay attack
                                                                  to implement complex testing strategies without needing to
can cause reuse of keystream material, completely breaking
                                                                  access key material, enabling the systematic evaluation of 24
transport-layer encryption [24]. They also demonstrated a
                                                                  service providers and 5 browsers.
MitM attack on the ZRTP key exchange protocol, exploiting
                                                                     Returning to the research questions that we set out to ex-
the case where users cannot perform the Short Authentication
                                                                  plore, we observe the following. With respect to RQ1, we
String (SAS) verification (e.g., devices without a display),
                                                                  find a maturing ecosystem with universal DTLS 1.2 support
effectively downgrading the session. Bresciani and Butterfield
                                                                  but negligible DTLS 1.3 adoption, and a consistent preference
provided a formal security proof for ZRTP, confirming that
                                                                  for forward-secure key exchange and modern AEAD cipher
the Diffie-Hellman key agreement (with SAS verification) can
                                                                  suites. On the other hand, the answer to RQ2 is somewhat
indeed prevent MitM attacks and strengthen SRTP’s end-to-
                                                                  less satisfactory. While all browsers implement DTLS-SRTP
end authenticity [13].
                                                                  securely, 19 server implementations contained authentica-
   Vulnerabilities in Video Conferencing Systems. Beyond
                                                                  tion bypasses, of which 9 were confirmed to be exploitable—
core WebRTC issues, conferencing apps show application-
                                                                  allowing attackers to decrypt media from a pure MitM po-
layer and deployment flaws. A study of BigBlueButton and
                                                                  sition. These findings reveal severe issues in the WebRTC
eduMEET found 57 flaws across access control and me-
                                                                  ecosystem that affect the security of media connections for
dia handling [25]. Other bugs in proprietary stacks include
                                                                  hundreds of millions of users and need to be addressed, ei-
Zoom’s crypto and E2EE design [34], an XMPP "stanza smug-
                                                                  ther through systematic testing or a technology change. In
gling" chain that enabled code execution [23], and a media
                                                                  addition, these findings suggest a gap in WebRTC/DTLS-
router overflow [1]. Similar issues are reported for Microsoft
                                                                  SRTP proficiency between browser providers and application
Teams [12] and Electron-based clients like Jitsi [3] and Dis-
                                                                  providers. This is perhaps expected, since WebRTC was
cord [29]. Google Project Zero fuzzed consumer WebRTC
                                                                  primarily developed by the former community.
apps, such as FaceTime and WhatsApp, which surfaced mem-
                                                                     Future Work. In this work, we have not yet analyzed
ory safety bugs in media processing [53, 54, 55].
                                                                  DTLS implementations with the same level of scrutiny that
   DTLS Implementations. Although the DTLS protocol               TLS implementations have been subjected to. Works like
is closely related to the TLS protocol, its implementations       Maehren et al. [32], Fiterau-Brostean et al. [21], and Fiterau-
have not received the same level of scrutiny as TLS until         Brostean et al. [22] use more advanced techniques in their
recently. The state machine of the DTLS implementations           analysis. Applying these more advanced techniques to Web-
has been analyzed by Fiterau-Brostean et al. [21], who used       RTC and DTLS-SRTP is more challenging as it requires hook-
state-machine fuzzing to automatically create a model of the      ing into the signaling phase in order to extract or manipulate
state machine. The concept was later extended by Fiterau-         keys and increasing the level of automation in the initiation
Brostean et al. [22] to avoid manual analysis of the state        of connections, but it is likely to be a fruitful endeavor.
machine for already known vulnerability types. Since state
machine fuzzing is inherently tricky outside of a controlled
environment, we did not explore applying this approach to         Acknowledgment
DTLS-SRTP. Besides the state machine, the DTLS ecosystem
has been analyzed by Erinola et al. [18] in a first Internet-     The authors would like to thank the reviewers for their in-
wide ecosystem study. Although the study was extensive, it        sightful comments. Lukas Knittel was supported by the
was unable to capture DTLS as used in DTLS-SRTP because           research project "North-Rhine Westphalian Experts in Re-
DTLS servers are not permanently located on specific end-         search on Digitalization (NERD II)", sponsored by the state of
points and may only respond to messages from a previously         North Rhine-Westphalia – NERD II 005-2201-0014. Vukašin
established ICE candidate pair. Related to this limitation,       Karadžić was supported by the German Federal Ministry of
work by Enable Security [19] examined which remote RTC            Education and Research and the Hessen State Ministry for
endpoints are willing to accept DTLS ClientHello messages         Higher Education, Research and the Arts within their joint
outside of the selected ICE candidate pair. A symbolic analy-     support of the National Research Center for Applied Cyber-
sis of DTLS implementations has been performed by Asadian         security ATHENE.



USENIX Association                                                                    35th USENIX Security Symposium        335
Ethical Considerations                                             issues, and awarded us bug bounties. Webex acknowledged
                                                                   the reported vulnerabilities, fixed the issues, and assigned
Our research involves testing the security of web applications     CVE-2025-20215 (severity medium). Our proof-of-concept
by manipulating DTLS and media messages in our own Web-            only captured audio from our own test meetings that we initi-
RTC connections. We identified the following stakeholders:         ated. Microsoft (Teams) considered the reported vulnerabili-
(1) the web application service providers whose systems we         ties to be out of scope for their threat model. Zoho removed
tested, (2) other users of these services, (3) our research team   the weak certificate after our initial report and awarded us a
members, and (4) the broader community that relies on secure       bounty. Steam and Ringcentral confirmed the exploits and
WebRTC implementations. To ensure our research maximizes           awarded us bounties.
benefits while minimizing potential harms, we implemented
several safeguards:
   Limited Scope. We exclusively manipulated our own con-
                                                                   Open Science
nections and authentication credentials, ensuring no impact        We provide both our testing framework, DTLS MitM Scanner
on other users’ sessions or data.                                  (cf. Section 3), and the results of our evaluation as artifacts.
   Resource Consumption. Our tests are severely rate-              Furthermore, we provide PCAP recordings of all our executed
limited, with at most one connection every few seconds, min-       tests, as well as the textual report, which is output by our
imizing impact on the network and computation resources,           framework. We also provide a patch file to modify Chromium
typically totaling less than 500 short-lived connections. The      as described in Section 4.3. In addition, our artifacts contain
performed tests were not expected to bind many computa-            scripts and instructions to reproduce our browser-side tests:
tional resources.                                                  JavaScript snippets to replace the SDP fingerprint, a Janus
   No Exploitation. While we identified vulnerabilities, we        setup using a 512-bit RSA certificate for DTLS, and materials
did not exploit them beyond what was necessary for a proof         for examining which parameters browsers permit when gen-
of concept, and we never accessed or modified data belonging       erating a certificate (cf. Table 3). Finally, we include a video
to other users.                                                    recording of the exploit for Cisco Webex (cf. Section 6).
   Broader Impact Analysis. We considered both positive               Our artifact can be found at https://doi.org/10.528
and negative potential outcomes of our research. Our re-           1/zenodo.17880120.
search has improved the security of WebRTC connections for
hundreds of millions of users worldwide. Additionally, our re-
search advanced the field of practical communication protocol      References
research, showcasing how to perform studies in highly com-
plicated communication protocols, providing a prime case            [1] Thijs Alkemade and Daan Keuper. Zoom RCE from
study for research and industry alike. On the negative side,            Pwn2Own 2021. Sector 7 research blog, August 2021.
our research may have temporarily consumed some amount                  URL https://sector7.computest.nl/post/2021
of server computation and may have triggered warnings at               -08-zoom/.
tested applications, which temporarily binds security team          [2] John Althouse. TLS Fingerprinting with JA3 and JA3S.
resources.                                                              https://engineering.salesforce.com/tls-fin
   Vendor Permission and Testing Scope. Where vendors                   gerprinting-with-ja3-and-ja3s-24736285596
had public coordinated vulnerability disclosure (CVD) or                7/, 2019. Salesforce Engineering Blog.
bug bounty programs, we operated within those programs’
terms, which expressly permit external security testing. For        [3] Benjamin Altpeter. RCE in Jitsi Meet Electron prior to
all services, we limited experiments exclusively to our own             2.3.0 due to insecure use of shell.openExternal()
sessions and credentials. Our methodology was designed to               (CVE-2020-25019). https://benjamin-altpeter.
minimize operational risk: we (1) manipulated only our own              de/jitsi-meet-electron-rce-shell-openexter
connections and authentication credentials, (2) rate-limited            nal/, August 2020.
to at most one call every few seconds, and (3) did not exploit
beyond what was necessary to show exploitability, nor did           [4] Harald Alvestrand. Google release of WebRTC source
we access or modify other users’ data. These probes target              code. URL https://lists.w3.org/Archives/Pu
DTLS handshake-layer behaviors rather than high-load paths,             blic/public-webrtc/2011May/0022.html.
minimizing crash risk and operational impact.                       [5] Amazon Web Services, Inc. Amazon chime. https:
   Responsible Disclosure. We responsibly disclosed all find-           //aws.amazon.com/chime/, 2025.
ings to the respective vendors in accordance with their vulner-
ability disclosure guidelines, and continuously assisted them       [6] Amirante, A. and Castaldi, T. and Miniero, L. and
by retesting deployed patches and providing feedback.                   Romano, S. P.     Janus: a general purpose Web-
   Discord and Zoom confirmed our reports, fixed the reported           RTC gateway. In Proceedings of the Conference on



336   35th USENIX Security Symposium                                                                        USENIX Association
     Principles, Systems and Applications of IP Telecom-         [17] Mathis Engelbart, Joerg Ott, and Spencer Dawkins. RTP
     munications, IPTComm ’14, New York, NY, USA,                     over QUIC (RoQ). Internet-Draft draft-ietf-avtcore-rtp-
     2014. Association for Computing Machinery. URL                   over-quic-14, Internet Engineering Task Force, March
     https://doi.org/10.1145/2670386.2670389.                         2025. URL https://datatracker.ietf.org/doc
                                                                      /draft-ietf-avtcore-rtp-over-quic/14/. Work
 [7] Hooman Asadian, Paul Fiterau-Brostean, Bengt Jons-               in Progress.
     son, and Konstantinos Sagonas. Applying Symbolic
     Execution to Test Implementations of a Network Pro-         [18] Nurullah Erinola, Marcel Maehren, Robert Merget, Ju-
     tocol Against its Specification. In IEEE Conference              raj Somorovsky, and Jörg Schwenk. Exploring the
     on Software Testing, Verification and Validation, ICST,          unknown DTLS universe: Analysis of the DTLS server
     2022.                                                            ecosystem on the internet. In 32nd USENIX Secu-
                                                                      rity Symposium (USENIX Security 23), pages 4859–
 [8] M. Baugher, D. McGrew, M. Naslund, E. Carrara, and               4876, Anaheim, CA, August 2023. USENIX Asso-
     K. Norrman. The Secure Real-time Transport Protocol              ciation. ISBN 978-1-939133-37-3. URL https:
     (SRTP). RFC 3711 (Proposed Standard), March 2004.                //www.usenix.org/conference/usenixsecuri
     ISSN 2070-1721. URL https://www.rfc-edito                        ty23/presentation/erinola.
     r.org/rfc/rfc3711.txt. Updated by RFCs 5506,                [19] Alfred Farrugia and Sandro Gauci. DTLS "ClientHello"
     6904, 9335.                                                      Race Conditions in WebRTC Implementations. https:
                                                                      //www.enablesecurity.com/research/webrtc-h
 [9] Iñaki Baz Castillo, José Luis Millán, and Nazar Mokyn-           ello-race-conditions-paper.pdf, October 2024.
     skyi. mediasoup. https://mediasoup.org/, 2025.                   White paper, Enable Security GmbH.
[10] A. Begen, P. Kyzivat, C. Perkins, and M. Handley. SDP:      [20] J. Fischl, H. Tschofenig, and E. Rescorla. Framework
     Session Description Protocol. RFC 8866 (Proposed                 for Establishing a Secure Real-time Transport Protocol
     Standard), January 2021. ISSN 2070-1721. URL                     (SRTP) Security Context Using Datagram Transport
     https://www.rfc-editor.org/rfc/rfc8866.txt.                      Layer Security (DTLS). RFC 5763 (Proposed Standard),
                                                                      May 2010. ISSN 2070-1721. URL https://www.rf
[11] Daniel Bleichenbacher. Forging some RSA signatures               c-editor.org/rfc/rfc5763.txt. Updated by RFC
     with pencil and paper, 2006. Presented at CRYPTO                 8842.
     2006 rump session.
                                                                 [21] Paul Fiterau-Brostean, Bengt Jonsson, Robert Merget,
[12] Fabian Bräunlein. MS teams: 1 feature, 4 vulnerabilities.        Joeri de Ruiter, Konstantinos Sagonas, and Juraj So-
     Positive Security blog, December 2021. URL https:                morovsky. Analysis of DTLS implementations us-
     //positive.security/blog/ms-teams-1-featu                        ing protocol state fuzzing. In 29th USENIX Security
     re-4-vulns.                                                      Symposium (USENIX Security 20), pages 2523–2540.
                                                                      USENIX Association, August 2020. ISBN 978-1-
[13] Riccardo Bresciani and Andrew Butterfield. A formal              939133-17-5. URL https://www.usenix.org/c
     security proof for the ZRTP Protocol. In 2009 Interna-           onference/usenixsecurity20/presentation/fi
     tional Conference for Internet Technology and Secured            terau-brostean.
     Transactions,(ICITST), pages 1–6. IEEE, 2009.               [22] Paul Fiterau-Brostean, Bengt Jonsson, Konstantinos
                                                                      Sagonas, and Fredrik Tåquist. Automata-based au-
[14] Chromium Project. Issue 40567530: Deprecate and                  tomated detection of state machine bugs in protocol
     remove ability to modify SDP before SetLocalDescrip-             implementations. In 30th Annual Network and Dis-
     tion. https://issues.chromium.org/issues/405                     tributed System Security Symposium, NDSS 2023, San
     67530.                                                           Diego, California, USA, February 27 - March 3, 2023.
                                                                      The Internet Society, 2023. URL https://www.ndss
[15] Cisco. Announcing the Multistream Feature in Webex              -symposium.org/ndss-paper/automata-based-a
     Web Meetings SDK. https://developer.webex.co                     utomated-detection-of-state-machine-bugs-i
     m/blog/announcing-the-multistream-feature                        n-protocol-implementations/.
    -in-webex-web-meetings-sdk, 2024.
                                                                 [23] Ivan Fratric. XMPP stanza smuggling or how i hacked
[16] Cisco Systems, Inc. Cisco Security Advisory CVE-                 zoom. Black Hat USA 2022 talk (slides), August 2022.
     2025-20215. https://sec.cloudapps.cisco.com/                     URL https://i.blackhat.com/USA-22/Thursd
     security/center/content/CiscoSecurityAdvis                       ay/US-22-Fratric-XMPP-Stanza-Smuggling.pdf.
     ory/cisco-sa-webex-join-yNXfqHk4, 2025.                          See also: Project Zero issue 2254.



USENIX Association                                                                  35th USENIX Security Symposium      337
[24] Prateek Gupta and Vitaly Shmatikov. Security analysis      [34] Bill Marczak and John Scott-Railton. Move fast and roll
     of voice-over-IP protocols. In 20th IEEE Computer               your own crypto: A quick look at the confidentiality of
     Security Foundations Symposium (CSF’07), pages 49–              zoom meetings. Citizen Lab Report, April 2020. URL
     63. IEEE, 2007.                                                 https://citizenlab.ca/2020/04/move-fast-r
                                                                     oll-your-own-crypto-a-quick-look-at-the-c
[25] Nico Heitmann, Hendrik Siewert, Sven Moog, and Ju-              onfidentiality-of-zoom-meetings/.
     raj Somorovsky. Security analysis of bigbluebutton
     and edumeet. In International Conference on Applied        [35] D. McGrew and E. Rescorla. Datagram Transport Layer
     Cryptography and Network Security, pages 190–216.               Security (DTLS) Extension to Establish Keys for the
     Springer, 2024.                                                 Secure Real-time Transport Protocol (SRTP). RFC
                                                                     5764 (Proposed Standard), May 2010. ISSN 2070-1721.
[26] C. Holmberg and R. Shpount. Session Description                 URL https://www.rfc-editor.org/rfc/rfc5764.
     Protocol (SDP) Offer/Answer Considerations for Data-            txt. Updated by RFCs 7983, 9443.
     gram Transport Layer Security (DTLS) and Transport
     Layer Security (TLS). RFC 8842 (Proposed Stan-             [36] NIST National Vulnerability Database. CVE-2020-
     dard), January 2021. ISSN 2070-1721. URL https:                 2655. https://nvd.nist.gov/vuln/detail/CVE
     //www.rfc-editor.org/rfc/rfc8842.txt.                          -2020-2655, 2020.
[27] Jitsi. jitsi-srtp: SRTP implementation for Jitsi. https:   [37] P. Patil, T. Reddy, and D. Wing. Traversal Using Relays
     //github.com/jitsi/jitsi-srtp, 2021.                            around NAT (TURN) Server Auto Discovery. RFC
                                                                     8155 (Proposed Standard), April 2017. ISSN 2070-
[28] A. Keranen, C. Holmberg, and J. Rosenberg. Interactive
                                                                     1721. URL https://www.rfc-editor.org/rfc/rf
     Connectivity Establishment (ICE): A Protocol for Net-
                                                                     c8155.txt.
     work Address Translator (NAT) Traversal. RFC 8445
     (Proposed Standard), July 2018. ISSN 2070-1721. URL        [38] M. Petit-Huguenin, G. Salgueiro, J. Rosenberg, D. Wing,
     https://www.rfc-editor.org/rfc/rfc8445.txt.                     R. Mahy, and P. Matthews. Session Traversal Utilities
     Updated by RFC 8863.                                            for NAT (STUN). RFC 8489 (Proposed Standard),
[29] Masato Kinugawa. Discord desktop app RCE. Masato                February 2020. ISSN 2070-1721. URL https://www.
     Kinugawa’s Security Blog, October 2020. URL https:              rfc-editor.org/rfc/rfc8489.txt.
     //mksben.l0.cm/2020/10/discord-desktop-rce
                                                                [39] M. Petit-Huguenin, S. Nandakumar, C. Holmberg,
     .html.
                                                                     A. Keränen, and R. Shpount. Session Description Pro-
[30] Let’s Encrypt. Let’s Encrypt. https://letsencrypt.              tocol (SDP) Offer/Answer Procedures for Interactive
     org/, 2025.                                                     Connectivity Establishment (ICE). RFC 8839 (Pro-
                                                                     posed Standard), January 2021. ISSN 2070-1721. URL
[31] Tsahi Levent-Levi. Is WebRTC really free? the costs of          https://www.rfc-editor.org/rfc/rfc8839.txt.
     running a WebRTC application. URL https://blog
     geek.me/is-webrtc-really-free/.                            [40] praveen-kd-23. Wrong DTLS Peer Certificate verifica-
                                                                     tion (Issue #2076, signalwire/freeswitch). https://gi
[32] Marcel Maehren, Philipp Nieting, Sven Hebrok, Robert            thub.com/signalwire/freeswitch/issues/2076,
     Merget, Juraj Somorovsky, and Jörg Schwenk. TLS-                May 2023. GitHub issue.
     Anvil: Adapting combinatorial testing for TLS libraries.
     In 31st USENIX Security Symposium (USENIX Secu-            [41] Andreas Reiter and Alexander Marsalek. WebRTC:
     rity 22), pages 215–232, Boston, MA, August 2022.               your privacy is at risk. In Proceedings of the Sympo-
     USENIX Association. ISBN 978-1-939133-31-1. URL                 sium on Applied Computing, SAC ’17, page 664–669,
     https://www.usenix.org/conference/usenixse                      New York, NY, USA, 2017. Association for Com-
     curity22/presentation/maehren.                                  puting Machinery.       ISBN 9781450344869.       doi:
                                                                     10.1145/3019612.3019844. URL https://doi.
[33] R. Mahy, P. Matthews, and J. Rosenberg. Traversal               org/10.1145/3019612.3019844.
     Using Relays around NAT (TURN): Relay Extensions
     to Session Traversal Utilities for NAT (STUN). RFC         [42] E. Rescorla. Keying Material Exporters for Transport
     5766 (Proposed Standard), April 2010. ISSN 2070-                Layer Security (TLS). RFC 5705 (Proposed Standard),
     1721. URL https://www.rfc-editor.org/rfc/rf                     March 2010. ISSN 2070-1721. URL https://www.rf
     c5766.txt. Obsoleted by RFC 8656, updated by RFCs               c-editor.org/rfc/rfc5705.txt. Updated by RFCs
     8155, 8553.                                                     8446, 8447.



338   35th USENIX Security Symposium                                                                   USENIX Association
[43] E. Rescorla. The Transport Layer Security (TLS) Pro-          Zero blog, December 2018. URL https://google
     tocol Version 1.3. RFC 8446 (Proposed Standard),              projectzero.blogspot.com/2018/12/adventure
     August 2018.     ISSN 2070-1721.      URL https:              s-in-video-conferencing-part-1.html.
     //www.rfc-editor.org/rfc/rfc8446.txt.
                                                              [55] Natalie Silvanovich. Adventures in video conferencing
[44] E. Rescorla. Security Considerations for WebRTC.              part 3: The even wilder world of WhatsApp. Google
     RFC 8826 (Proposed Standard), January 2021. ISSN              Project Zero blog, December 2018. URL https://go
     2070-1721. URL https://www.rfc-editor.org/rf                  ogleprojectzero.blogspot.com/2018/12/adven
     c/rfc8826.txt.                                                tures-in-video-conferencing-part-3.html.

[45] E. Rescorla. WebRTC Security Architecture. RFC 8827      [56] Juraj Somorovsky. Systematic fuzzing and testing of
     (Proposed Standard), January 2021. ISSN 2070-1721.            TLS libraries. In Proceedings of the 2016 ACM SIGSAC
     URL https://www.rfc-editor.org/rfc/rfc8827.                   Conference on Computer and Communications Security,
     txt.                                                          2016. ISBN 9781450341394. doi: 10.1145/2976749.
                                                                   2978411. URL https://doi.org/10.1145/297674
[46] E. Rescorla and N. Modadugu. Datagram Transport               9.2978411.
     Layer Security. RFC 4347 (Historic), April 2006. ISSN
     2070-1721. URL https://www.rfc-editor.org/rf             [57] R. Stewart, M. Tüxen, and K. Nielsen. Stream Control
     c/rfc4347.txt. Obsoleted by RFC 6347, updated by              Transmission Protocol. RFC 9260 (Proposed Standard),
     RFCs 5746, 7507.                                              June 2022. ISSN 2070-1721. URL https://www.rf
                                                                   c-editor.org/rfc/rfc9260.txt.
[47] E. Rescorla and N. Modadugu. Datagram Transport
     Layer Security Version 1.2. RFC 6347 (Proposed           [58] The CADO-NFS Development Team. CADO-NFS,
     Standard), January 2012. ISSN 2070-1721. URL                  an implementation of the number field sieve algorithm,
     https://www.rfc-editor.org/rfc/rfc6347.txt.                   2017. URL http://cado-nfs.inria.fr/. Release
     Obsoleted by RFC 9147, updated by RFCs 7507, 7905,            2.3.0.
     8996, 9146.
                                                              [59] Tsahi Levent-Levi. WebRTC and Man-in-the-Middle
[48] E. Rescorla, H. Tschofenig, and N. Modadugu. The              Attacks. https://webrtchacks.com/webrtc-and
     Datagram Transport Layer Security (DTLS) Protocol            -man-in-the-middle-attacks/, June 2015.
     Version 1.3. RFC 9147 (Proposed Standard), April
                                                              [60] Cristiana Tudor. The impact of the COVID-19 pandemic
     2022. ISSN 2070-1721. URL https://www.rfc-edi
                                                                   on the global web and video conferencing SaaS market.
     tor.org/rfc/rfc9147.txt.
                                                                   Electronics, 11(16), 2022. ISSN 2079-9292. doi:
[49] Salesforce. JA3. https://github.com/salesforc                 10.3390/electronics11162633. URL https://www.md
     e/ja3, 2020.                                                  pi.com/2079-9292/11/16/2633.

[50] H. Schulzrinne, S. Casner, R. Frederick, and V. Jacob-   [61] M. Tuexen, R. Stewart, R. Jesup, and S. Loreto. Data-
     son. RTP: A Transport Protocol for Real-Time Applica-         gram Transport Layer Security (DTLS) Encapsulation
     tions. RFC 3550 (Internet Standard), July 2003. ISSN          of SCTP Packets. RFC 8261 (Proposed Standard),
     2070-1721. URL https://www.rfc-editor.org/rf                  November 2017. ISSN 2070-1721. URL https:
     c/rfc3550.txt. Updated by RFCs 5506, 5761, 6051,              //www.rfc-editor.org/rfc/rfc8261.txt. Up-
     6222, 7022, 7160, 7164, 8083, 8108, 8860.                     dated by RFCs 8899, 8996.

[51] Selenium Project. Selenium. https://www.selenium         [62] J. Uberti, C. Jennings, and E. Rescorla (Ed.). JavaScript
     .dev/.                                                        Session Establishment Protocol (JSEP). RFC 8829
                                                                   (Proposed Standard), January 2021. ISSN 2070-1721.
[52] SignalWire, Inc. Freeswitch. https://signalwire               URL https://www.rfc-editor.org/rfc/rfc8829.
     .com/freeswitch, 2025.                                        txt.
[53] Natalie Silvanovich. Adventures in video conferencing    [63] Luke Valenta, Shaanan Cohney, Alex Liao, Joshua Fried,
     part 2: Fun with FaceTime. Google Project Zero blog,          Satya Bodduluri, and Nadia Heninger. Factoring as a
     December 2018. URL https://googleprojectzer                   service. Cryptology ePrint Archive, Paper 2015/1000,
     o.blogspot.com/2018/12/adventures-in-video                    2015. URL https://eprint.iacr.org/2015/1000.
    -conferencing-part-2.html.
                                                              [64] Paul C. van Oorschot and Michael J. Wiener. Parallel
[54] Natalie Silvanovich. Adventures in video conferencing         collision search with cryptanalytic applications. 12(1):
     part 1: The wild world of WebRTC. Google Project              1–28, January 1999. doi: 10.1007/PL00003816.



USENIX Association                                                               35th USENIX Security Symposium        339
[65] WebRTC-Security contributors. A study of WebRTC   A    Evaluation Setup
     security. https://webrtc-security.github.io/,
     2015.                                             Our testbed consists of an analysis host connected via Ether-
                                                       net to the backbone network and exposing a local interface
[66] Kaito Yamada. Pcap4J. https://www.pcap4j.org/.    to the target device. For mobile applications, the phone con-
                                                       nects to the analysis host’s Wi-Fi hotspot, which analyzes
                                                       and forwards traffic through our tool to the backbone network.
                                                       For desktop and browser applications, we run a virtual ma-
                                                       chine (VM) bridged to an interface on the analysis host. All
                                                       web application DTLS tests were conducted using Google
                                                       Chrome version 123. Each application was tested with a 300
                                                       ms timeout for DTLS messages. If a run failed, e.g., due
                                                       to packet loss or a switch to a different ICE candidate, we
                                                       repeated the test flow up to five times. In our evaluation, such
                                                       test failures were typically attributed to unhandled protocol
                                                       features (e.g., STUN as a transport), which we then imple-
                                                       mented for the final evaluation. Many applications do not
                                                       surface alerts on handshake failure and instead silently abort.
                                                       In such cases, we performed five retries and recorded the
                                                       missing response. Profiling an application can take between
                                                       5 minutes and multiple hours, depending on the complexity
                                                       of the call flow, the number of distinct connections initiated
                                                       in each call, and the target’s DTLS configuration. Where ap-
                                                       plicable, we automated the connection setup using Selenium,
                                                       with the application running in a browser within the VM.
                                                       Developing robust Selenium scripts proved challenging due
                                                       to nondeterministic site behavior (e.g., unsolicited feedback
                                                       prompts). Consequently, we profiled most applications via
                                                       manual call initiation or lightweight click-automation scripts.
                                                       In total, we performed approximately 17 000 calls during our
                                                       final evaluation. Some services do not issue (public) version
                                                       numbers, so we are not able to pinpoint each of them to a
                                                       release tag. Unless otherwise stated, we performed the tests
                                                       in July of 2025.




340   35th USENIX Security Symposium                                                            USENIX Association
