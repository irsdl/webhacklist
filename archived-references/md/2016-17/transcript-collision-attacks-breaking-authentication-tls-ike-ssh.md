---
type: Whitepaper
title: "Transcript Collision Attacks: Breaking Authentication in TLS, IKE and SSH"
description: Key exchange protocols hash their handshake transcript with MD5 or SHA-1, so an attacker who computes a chosen-prefix collision between two transcripts can make a client and a server sign the same hash. This yields credential forwarding against TLS client and server authentication and channel bindings, plus impersonation and downgrade attacks on TLS 1.1, IKEv2 and SSH-2.
resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf"
tags: [whitepaper, webseclist-reference, auth-bypass, tls, https, cve, owasp-a01-2021, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:43:21+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf"
    title: "Transcript Collision Attacks: Breaking Authentication in TLS, IKE and SSH"
    author: Karthikeyan Bhargavan, Gaëtan Leurent
also_at: []
authors:
  - Karthikeyan Bhargavan
  - Gaëtan Leurent
canonical_url: ""
cited_by:
  - "2016-17.md:62"
commit: ""
content_sha256: 46ef63b53c1ab8296ba28f5fb20f1e3402c586e9b0954190c3281cbbfbb156a2
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 51583877f50f668113184ca1be50b0aafb69b2bca761eacfa57eac4f004dea36
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:43:21+00:00"
slug: transcript-collision-attacks-breaking-authentication-tls-ike-ssh
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Transcript Collision Attacks: Breaking Authentication in TLS, IKE and SSH

**Transcript Collision Attacks: Breaking Authentication in TLS, IKE and SSH** - Karthikeyan Bhargavan, Gaëtan Leurent, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/transcript-collision-attacks-breaking-authentication-tls-ike-ssh.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Transcript Collision Attacks:
Breaking Authentication in TLS, IKE, and SSH

                           Karthikeyan Bhargavan                                         Gaëtan Leurent
                                  INRIA                                                      INRIA
                      karthikeyan.bhargavan@inria.fr                             gaetan.leurent@normalesup.org


    Abstract—In response to high-profile attacks that ex-                  However, recent practical attacks on MD5 and almost-
ploit hash function collisions, software vendors have                      practical attacks on SHA-1 have led researchers and
started to phase out the use of MD5 and SHA-1 in                           practitioners to question whether these uses of hash
third-party digital signature applications such as X.509                   functions in popular protocols are still secure.
certificates. However, weak hash constructions continue
to be used in various cryptographic constructions within                       The first collision on MD5 was demonstrated in
mainstream protocols such as TLS, IKE, and SSH, because                    2005 [38], and since then, collision-finding algorithms
practitioners argue that their use in these protocols relies               have gotten much better. Simple MD5 collisions can
only on second preimage resistance, and hence is unaf-                     now be found in seconds on a standard desktop. In re-
fected by collisions. This paper systematically investigates               sponse, protocol experts reviewed the use of MD5 in In-
and debunks this argument.
                                                                           ternet protocols such as Transport Layer Security (TLS)
    We identify a new class of transcript collision attacks                and IPsec [16], [15], [3]. Despite some disagreement
on key exchange protocols that rely on efficient collision-                on the long-term impact of collisions, they concluded
finding algorithms on the underlying hash construc-                        that most uses of hash functions in these protocols
tions. We implement and demonstrate concrete credential-                   were not affected by collisions. Consequently, MD5
forwarding attacks on TLS 1.2 client authentication, TLS                   continues to be supported (alongside newer, stronger
1.3 server authentication, and TLS channel bindings. We
describe almost-practical impersonation and downgrade
                                                                           hash algorithms) in protocols like TLS and IPsec.
attacks in TLS 1.1, IKEv2 and SSH-2. As far as we know,                        In 2009, an MD5 collision was used to create a
these are the first collision-based attacks on the crypto-                 rogue CA certificate [36], hence breaking the security
graphic constructions used in these popular protocols.                     of certificate-based authentication in many protocols. A
    Our practical attacks on TLS were responsibly dis-                     variant of this attack was used by the Flame malware
closed (under the name SLOTH) and have resulted in                         to disguise itself as a valid Windows Update security
security updates to several TLS libraries. Our analysis                    patch [34]. Due to these high-profile attacks, there
demonstrates the urgent need for disabling all uses of                     is now consensus among certification authorities and
weak hash functions in mainstream protocols, and our                       software vendors to stop issuing and accepting new
recommendations have been incorporated in the upcoming
                                                                           MD5 certificates. Learning from the MD5 experience,
Token Binding and TLS 1.3 protocols.
                                                                           software vendors are also pro-actively phasing out SHA-
                                                                           1 certificates, since collisions on SHA-1 are believed to
                      I.    I NTRODUCTION                                  be almost practical [35].
    Hash functions, such as MD5 and SHA-1, are widely                          This leaves open the question of what to do about
used to build authentication and integrity mechanisms                      other uses of MD5 and SHA-1 in popular crypto-
in cryptographic protocols. They are used within public-                   graphic protocols. Practitioners commonly believe that
key certificates, digital signatures, message authentica-                  collisions only affect non-repudiable signatures (like
tion codes (MAC), and key derivation functions (KDF).                      certificates), but that signatures and MACs used within
                                                                           protocols are safe as long as they include unpredictable
Permission to freely reproduce all or part of this paper for noncommer-    contents, such as nonces [16], [15].In these cases,
cial purposes is granted provided that copies bear this notice and the
full citation on the first page. Reproduction for commercial purposes
                                                                           protocol folklore says that a second preimage attack
is strictly prohibited without the prior written consent of the Internet   would be required to break these protocols, and such
Society, the first-named author (for reproduction of an entire paper       attacks are still considered hard, even for MD5.
only), and the author’s employer if the paper was prepared within the
scope of employment.                                                           Conversely, theoretical cryptographers routinely as-
NDSS ’16, 21-24 February 2016, San Diego, CA, USA                          sume collision-resistance in proofs of security for
Copyright 2016 Internet Society, ISBN 1-891562-41-X                        these protocols. For example, various recent proofs of
http://dx.doi.org/10.14722/ndss.2016.23418
TLS [17], [22], [11] assume collision-resistance even
though the most popular hash functions used in TLS
are MD5 and SHA-1. Whom shall we believe? Either it
is the case that cryptographic proofs of these protocols
are based on too-strong (i.e. false) assumptions that
should be weakened, or that practitioners are wrong and
collision resistance is required for protocol security.
    This paper seeks to clarify this situation by systemat-
ically investigating the use of hash functions in the key         Fig. 1.   SIGMA’: A mutually-authenticated key exchange protocol
exchanges underlying various versions of TLS, IPsec,
and SSH. We demonstrate that, contrary to common
belief, collisions can be used to break fundamental secu-         of the basic SIGMA (sign-and-mac) protocol from [21]
rity guarantees of these protocols. We describe a generic         which served as the inspiration for the key exchanges
class of attacks called transcript collision attacks, and         used in many protocols including IKE, OTR, and JFK.
detail concrete instances of these attacks against real-
world applications. In particular, we demonstrate how                 In SIGMA’, the initiator A first sends a message
a man-in-the-middle attacker can impersonate TLS 1.2              m1 to B, consisting of Diffie-Hellman public value g x ,
clients, TLS 1.3 servers, and IKEv2 initiators. We also           along with some protocol-specific parameters info A that
show how a network attacker can downgrade TLS 1.1                 may include, for example, a nonce, a protocol version,
and SSH-2 [39] connections to use weak ciphers. We                a proposed ciphersuite, etc. B responds with a message
implement proofs-of-concept exploit demos for three               m2 containing its own Diffie-Hellman public value g y
of these attacks to demonstrate their practicality, and           and some parameters info B . A and B have now com-
provide attack complexities for the others. We believe            pleted an anonymous Diffie-Hellman exchange and can
that ours are the first hash collision-based attacks on the       compute the shared secret g xy and use it to derive the
cryptographic constructions within these protocols.               session key. However, before using the session key, they
                                                                  authenticate each other by exchanging digital signatures
    We do not claim to have found all transcript col-             over the protocol transcript hash(m1 |m2 ) using their
lision attacks in these protocols; nor do we think that           long-term signing keys (sk A , sk B ). (Digital signature
our attack implementations are the most efficient. Still,         algorithms typically hash their arguments before sign-
our results already provide enough evidence for us                ing them, and we have chosen to make this hashing
to strongly recommend that weak hash functions like               explict in our presentation of SIGMA’.) By signing the
MD5 and SHA-1 should be immediately disabled from                 transcript, A and B verify that they agree upon all the
Internet protocols. Partly due to recommendations by              elements of the key exchange, and in particular, that a
us and other researchers, these hash functions and other          network attacker has not tampered with the messages.
weak constructions based on them have been removed                Finally, A and B also prove to each other that they know
from the draft version of the TLS 1.3 protocol.                   the session key g xy by exchanging MACs computed
                                                                  with this key over their own identities.
Outline Section II introduces transcript collision at-
tacks on authenticated key exchange protocols. Sec-                   Like other AKE protocols, SIGMA’ aims to prevent
tion III outlines the state-of-the-art in collision-finding       message tampering, peer impersonation, and session
algorithms for MD5, SHA-1, and their concatenation.               key leakage, even if the network and other clients and
Section IV describe the TLS protocol, and Section V               servers are under the control of the adversary. Formally,
describes concrete attacks on various versions of TLS             authenticating the transcript guarantees matching con-
and three proof-of-concept demos. Section VI describes            versations, that is, that the two parties agree on each
concrete attacks on IKE and SSH. Section VII summa-               others identity and other important protocol parameters.
rizes the impact of our attacks and disclosure status.
Section VIII concludes.                                           Transcript Collision Attacks The alert reader will
                                                                  notice that SIGMA’ does not in fact guarantee that A
     II.   T RANSCRIPT C OLLISION ATTACKS ON                      and B agree on the message sequence m1 |m2 ; it only
           AUTHENTICATED K EY E XCHANGE                           guarantees that they agree on the hash of this sequence.
                                                                  What if a network attacker were to tamper with the mes-
    Authenticated Key Exchange (AKE) protocols are                sages, so that A and B see different message sequences
executed between two parties, usually called client and           but the hashes of the two sequences is the same? In that
server or initiator and responder, in order to establish          case, the protocol will proceed to completion but the
a shared session key that can be used to encrypt sub-             integrity and authentication guarantees no longer hold.
sequent messages. A typical example is the SIGMA’
protocol depicted in Figure 1. This protocol is a variant             Figure 2 illustrates such an attack. The man-in-the-

                                                              2
                                                                             a transcript collision by finding x0 , y 0 , info 0A , info 0B such
                                                                             that hash(m1 |m02 ) = hash(m01 |m2 ). The amount of
                                                                             work required to find such a collision depends on the
                                                                             hash function. As we will see in the next section, such
                                                                             collisions require 2N/2 work for hash functions that
                                                                             produce N bits. Hence, for MD5, such a collision would
                                                                             require the MitM to compute 264 MD5 hashes, which
                                                                             may well be achievable by powerful adversaries.

                                                                             A Chosen-Prefix Transcript Collision We now con-
                                                                             sider a more efficient attack that works even when
                                                                             B sends an unpredictable m2 containing a fresh
Fig. 2. Man-in-the-middle credential forwarding attack on SIGMA’.            (ephemeral) Diffie-Hellman value g y and a previously
The attacker creates a transcript collision by tampering with the            unknown info B . However, we assume that the length
messages shown in red. At the end of the protocol, the client and            of m2 (M ) is fixed and known to MitM. Moreover,
server have seemingly authenticated each other, but the attacker knows
both connection keys, and hence can read or write any data.                  suppose that in the second message of SIGMA’, info B
                                                                             is allowed to have arbitrary length and arbitrary con-
                                                                             tents. That is, even if info B has junk data at the end,
middle (MitM) intercepts messages sent     between A and                     A will accept the message. Specifically, suppose that
                                       0
B. It sends its own message m01 = g x |info 0A to B and                      info B = len B |data B where data B is opaque data that
                                  0
it sends it own response m02 = g y |info 0B to A. Suppose                    will be ignored by A. (We will see several examples
it can choose these messages such that the authenticated                     of such “collision-friendly” messages in TLS, IKE, and
transcripts match:                                                           SSH.) Finally, we assume that the hash function uses the
                                                                             Merkle-Damgård construction [29], [7], so that it obeys
               hash(m1 |m02 ) = hash(m01 |m2 )                               the length extension property: if hash(x) = hash(y)
                                                                             then hash(x|z) = hash(y|z). (Strictly speaking, this
We call this a transcript collision. Now, MitM can                           property only holds when the lengths of x, y are equal
simply forward A’s signature over this transcript to B                       and a multiple of the hash function block size.)
and vice versa. A and B will accept the signatures
since the hashed transcripts match and the signing keys                          Under all these conditions, MitM can compute a
are 0correct.0
                However, the MitM knows the session keys                     transcript collision by finding two collision bitstrings
(g x y , g xy ) on both connections (since it knows x0 , y 0 ).              C1 , C2 of L1 and L2 bytes respectively, such that:
Hence, the MitM has fully hijacked both connections
and can now send messages to B pretending to be A                                                          info 0          info A           0
                                                                                                z }|B {
                                                                                                 0
and to A pretending to be B. This is an impersonation                                                                   x0
                                                                                                                           z}|{
                                                                                             y      0
                                                                                 hash(m1 | [g | len B |C1 |−]) = hash([g | C2 ])
attack that breaks peer authentication.                                                    |      {z        }         | {z }
                                                                                                       m02                        m01
    If the boundaries between the messages m1 and m2
are not clearly demarcated, there are a number of trivial                    where len 0B = L1 + M . Note that we have left empty
attacks that can ensure that m1 |m02 = m01 |m2 with no                       space (written −) of size M bytes that still needs to
need for hash collisions. In the examples of this paper,                     be filled after C1 in info 0B . As we will see in the next
we will assume that each message (and each message                           section, this kind of collision is called a chosen-prefix
field) is prefixed with its length, so that we can focus                     collision and is typically achievable with far less work
on attacks that rely on weaknesses in the hash function.                     than a generic collision attack. For example, a chosen-
                                                                             prefix collision in MD5 requires the MitM to compute
A Generic Transcript Collision The main challenge                            about 239 MD5 hashes, which takes only a few CPU
in implementing the attack in Figure 2 is that the MitM                      hours.
has to compute the messages m01 and m02 after receiving
m1 but before the responder has sent its response m2 .                           After receiving m1 from A and computing C1 , C2 ,
The feasibility of the attack depends on the contents and                    MitM now sends m01 to B. When B responds with m2
formats of these messages.                                                   (of size M bytes), MitM now stuffs m2 at the end of
                                                                             info 0B (in place of −) and sends m02 to A. Due to the
    Suppose the responder B always sends the same                            length extension property, we have:
message m2 for every request; that is, it uses the same
(static) Diffie-Hellman value g y and same parameters                                                 info 0              info A        0

info B . (This situation occurs, for example in protocols                                    z     }|B {
                                                                                          y0                           x0
                                                                                                                          z}|{
                                                                                                 0
like QUIC, where the server uses a static configuration.)                     hash(m1 | [g | len B |C1 |m2 ]) = hash([g | C2 ] |m2 )
                                                                                        |       {z        }          | {z }
In that case, after receiving m1 , the MitM can compute                                              m02                        m01



                                                                         3
That is, the MitM has obtained a transcript collision and           search: an adversary has to try about 2N random inputs
the impersonation attack succeeds.                                  in order to find a preimage. However, for collisions,
                                                                    there is a generic attack with complexity 2N/2 because
    The attack here exploits hash collisions in combi-              of the birthday paradox. If an adversary computes the
nation with flexible protocol-specific message formats,             images of a set of 2N/2 inputs, this defines about 2N
and as we will see, this is one of the main novel tricks            pairs of inputs, and there is a high probability that one
that we use to mount various attacks in this paper.                 of these pairs is a collision.
Other Transcript Collisions The transcript collisions
                                                                    Generic collision attacks While a naive collision at-
described above are not the only attacks possible on
                                                                    tack requires to store 2N/2 images of the hash function,
such protocols. In some cases, MitM may           not be able
                                             0   0                  it is possible to mount a parallel and memory-less attack
to use its own Diffie-Hellman values g x , g y but it may
                                                                    with a very small overhead [37]. This generic collision
still be able to tamper with the protocol parameters (e.g.
                                                                    attack is very powerful: it can use meaningful messages,
ciphersuites) in info 0A , info 0B . In such cases, the MitM
                                                                    and can easily be used for chosen-prefix collisions (see
does not have full control over either connection (i.e. it
                                                                    details in Appendix).
cannot impersonate A or B) because it does know the
session keys, but it may still be able to downgrade the             Concatenation To strengthen protocols against colli-
protocol parameters to use weak, breakable ciphers.                 sions in any one hash function, it may be tempting to
    In other cases, the message format may lend itself to           use a combination of two independent hash functions.
simpler common-prefix collisions that require even less             For example, TLS versions up to 1.1 use a concatenation
work than chosen-prefix collisions. Such collisions on              of MD5 and SHA-1. While the output length of this
MD5 can be found in seconds even on standard desk-                  construction is 288 bits, it does not offer the security
tops. In the next section, we will discuss these different          of a 288-bit hash function. In particular, Joux described
types of collisions in more detail (some technical details          a multi-collision attack that breaks the concatenation
of previous results are given in the Appendix), and in the          of two hash functions with roughly the same effort as
remainder of the paper, we will exploit them to mount               breaking the strongest one of the two [18].
transcript collision attacks on real-world protocols.
                                                                    Shortcut collision attacks In the last decade, hash
                                                                    function cryptanalysis has been a very active research
        III.   H ASH F UNCTION C RYPTANALYSIS
                                                                    area, and more efficient attacks have been discovered on
                                  ∗           N
    A hash function H : {0, 1} → {0, 1} maps arbi-                  widely used hash functions. The (estimated) complexity
trary length binary strings to strings of N bits. Broadly           of the best attacks currently known against MD5 and
speaking, a cryptographic hash function is expected                 SHA-1 are the following:
to behave like a randomly selected function from the
                                   ∗          N
set of all functions from {0, 1} to {0, 1} ; building                  MD5               Common-prefix collision: 216 [36]
input/output values with specific properties should be as                                Chosen-prefix collision: 239 [36]
hard for H as for a random function. More concretely,                  SHA-1             Common-prefix collision: 261 [35]
a cryptographic hash functions should meet four goals:                                   Chosen-prefix collision: 277 [35]
                                                                       MD5 | SHA-1       Common-prefix collision: 267 [18]
   1)     Preimage resistance: Given a target value H,                                   Chosen-prefix collision: 277 [18]
          it should be hard to find x such that H(x) = H
   2)     Second-preimage resistance: Given an input                Shortcut collision attack usually return messages with
          x, it should be hard to find a second input               random-looking blocks that are not controlled by the
          x0 6= x such that H(x0 ) = H(x)                           adversary. This makes it harder to use these messages
   3)     Chosen-prefix collision resistance: Given                 in a real attack, but we will see that in many cases
          prefixes P and P 0 , it should be hard to find            we can still have meaningful messages by stuffing the
          a pair of values x, x0 such that H(P 0 |x0 ) =            random blocks in non-significant sections.
          H(P |x).
   4)     Collision resistance: For a hash function H, it           Implementation of attacks Since generic collision
          should be hard to find a pair of inputs x 6= x0           attacks can be easily parallelized and require little
          such that H(x0 ) = H(x).                                  memory, they can efficiently be implemented in GPUs.
                                                                    In particular, an attack against MD5 require 264 com-
The expected security of a hash function is defined                 putations. This is well within reach for a motivated
as the complexity of the best generic attack, i.e. the              adversary: it would cost around $165 000 on Amazon
best attack that works on any hash function, without                EC2 (using a spot price of 8 ¢/h for a g2.2xlarge instance
using any specific property of the design. For preimages            doing 2.5 GH/s). Dedicated hardware would be signifi-
or second-preimages, the best attack is a brute-force               cantly more efficient, but require a large investment. As

                                                                4
a point of comparison, the current Bitcoin network is
able to compute up to 259 SHA-256 hashes per second.
   We have implemented this attack against the 96-bit
MAC used for the Finished message of TLS 1.1. Our
demo took 20 days using four Tesla K20Xm GPUs,
which is comparable to the expected time we can derive
from hash function benchmarks.
    For a chosen-prefix collision, an important part of
the computation is spend constructed differential paths,
and this is much harder to parallelize on GPU. We
used the HashClash software [33] by Marc Stevens to
perform this computation. Stevens et al.’s estimate that
the chosen-collision attack should require 239 hash com-
putations, or 35 core-hours [36]. In order to build the
collision as fast as possible, we modified the software to
                                                                  Fig. 3. TLS 1.2: A mutually-authenticated DHE handshake. Fields
take better advantage of parallelism. The hashclash soft-         shown in red indicate parts of the handshake that can contain arbitrary-
ware spends most of its time building differential paths,         length opaque data (useful for stuffing collision blocks). Handshake
with a forward step, a backward step, and a connection            transcripts (log 1 , log 2 , log 3 ) refer to the concatenation of all mes-
step. We realized that the backward step uses a limited           sages up to (and including) the current one. Messages SCR, CC, CCV are
                                                                  optional and only appear when client certificate authentication is used.
number of potential starting points, and we precomputed           NPN is optional and only appears when the client and server support
the results for all possible starting points. In addition,        the next-protocol-negotiation extension. The tls-unique channel
we merged the forward and connection steps, in order to           binding is a connection identifier that may be used by applications
avoid the serialization and deserialization of the result.        to bind user authentication tokens, such as cookies and passwords, to
With these optimisations, we can build a chosen-prefix            the underlying TLS channel to prevent credential forwarding.
collision in one hour with a 48 cores machine, using
a few gigabytes of RAM (the original code required                key exchange message SKE that contains an ephemeral
at least 3 hours). We believe the time can be further             public value g y along with a description of the Diffie-
reduced, but this will require a significant rewrite of the       Hellman group chosen by the server, including the prime
hashclash software to allow parallelism across several            p and generator g. The server signs these values to
machines, or to rewrite it for GPUs.                              protect then from tampering and to prove that it knows
                                                                  the private key (sk S ) for the certificate:
       IV.   T HE TLS H ANDSHAKE P ROTOCOL
                                                                                   sign(sk S , hash(nc |ns |p|g|g y ))
    The Transport Layer Security protocol (TLS) [8] is
perhaps the most widely used secure channel protocol.             The signature and hash algorithm used for this signature
Many versions of TLS are used on the Internet; the latest         is chosen by the server based on its certificate as well
released version is TLS 1.2 [8], while TLS 1.3 [9] is             as the supported algorithms indicated by the client
currently undergoing standardization at the IETF.                 within an optional signature-algorithms extension
                                                                  in the client hello. In TLS versions before 1.2, the hash
    Figure 3 depicts a typical handshake in TLS (in
                                                                  algorithm was fixed to be MD5 | SHA-1 but TLS 1.2
versions 1.0 to 1.2). The client first sends a hello
                                                                  allows clients and servers to choose any hash algorithm
message CH that contains a fresh random client nonce
                                                                  they both support (MD5, SHA-1, SHA-256, etc.) Hence
nc and various protocol parameters exc , including the
                                                                  in TLS 1.2, each digital signature is prefixed with
protocol version, supported list of ciphersuites, and
                                                                  identifiers for the chosen signature and hash algorithm.
various protocol extensions. Each extension is prefixed
by its length and can contain a payload of up to 216                   If the server wants the client to authenticate itself
bytes. Notably, the client hello may include extensions           with a public-key certificate, it then sends a certificate
that the server does not understand or support, and the           request message SCR indicating the certificate types and
server will ignore them.                                          signature algorithms it supports, as well as an optional
                                                                  list of distinguished names dn for the client certification
    The server responds to the client hello with a series
                                                                  authorities that it trusts. As with hello extensions, each
of messages (from SH to SHD). The server hello SH
                                                                  distinguished name can be 216 bytes long and can
contains a fresh server nonce ns and parameters exs ,
                                                                  contain arbitrary data that the client will ignore if it does
including the server’s chosen version, ciphersuite, and
                                                                  not recognize the name. The server’s message flight then
protocol extensions. In most ciphersuites, the server then
                                                                  ends with the server hello done message SHD.
sends its public-key certificate SC. In Ephemeral Diffie-
Hellman (DHE) ciphersuites, SC is followed by a server                The client then sends its own certificate CC if the

                                                              5
server asked for it, and its own Diffie-Hellman key              a general class of credential forwarding attacks unless
share g x in a client key exchange message CKE. If the           the application-level credential is channel bound to the
client sent a certificate, it must prove that it knows the       TLS connection (e.g. see [5]. In such attacks, a client
private key sk C by sending a client certificate verify          C connects to a malicious server M and authenticates
CCV message with a signature over the full message log           with some credential over TLS, but M forwards the
up to this point in the protocol:                                authentication message over another TLS channel to S,
                                                                 thereby logging in as C at S. The attack is prevented if
     sign(sk C , hash(CH|SH|SC|SKE|SCR|SHD|CC|CKE))              the authentication protocol embeds a unique identifier
                      |             {z            }
                                   log 1                         for the underlying TLS channel, so that a message sent
                                                                 over one channel cannot be forwarded over another. One
At this point, the client and server both derive a session       such identifier, called tls-unique, defined in [2], uses
master secret ms and authenticated encryption keys               the contents of the CFIN message as a unique identifier
for both directions (k1 , k2 ). The client sends a change        for the TLS connection. This tls-unique channel
cipher spec message to indicate that the subsequent mes-         binding is used by a number of emerging application-
sages it sends will be encrypted (with k1 .) This message        level authentication protocols, such as SCRAM [28],
is not technically part of the handshake protocol and            FIDO [14], and Token Binding [32], specifically to
does not appear in the authenticated transcript, and so          avoid credential-forwarding attacks.
it is not shown in Figure 3.
    If the client and server both indicate support for the          V.   T RANSCRIPT C OLLISION ATTACKS ON TLS
next-protocol-negotiation extension [24] in their hello
                                                                     As we saw in the previous section, TLS uses a
messages, the client then sends an encrypted extensions
                                                                 variety of hash constructions to implement key security
message NPN containing a selected application layer
                                                                 mechanisms like client and server authentication, hand-
protocol (e.g. http/1.1 or spdy/3). The protocol
                                                                 shake integrity, and channel binding. We now demon-
name is ASCII-encoded and then padded to the nearest
                                                                 strate weaknesses in these constructions and show how
multiple of 32 bytes (to avoid leaking information via
                                                                 they can be exploited to mount practical transcript
the encrypted message length.)
                                                                 collision attacks on real-world clients and servers.
    The client then sends an encrypted finished message
CFIN containing a MAC of the full handshake log log 2            A. Breaking TLS 1.2 Client Authentication
using the master secret ms. In TLS 1.0 and 1.1, this             using a Chosen-Prefix Transcript Collision
MAC is computed using a combination of HMAC-MD5
and HMAC-SHA-1, whereas in TLS 1.2, it uses HMAC-                    Suppose a client C uses the same certificate to
SHA-256. In all these versions, the result of the MAC            connect to two different servers A and S. We show that
is then truncated to 12 bytes (96 bits):                         if A is malicious, it can force C to create a signature
                                                                 (in CCV) that A can use to impersonate C at S, as
mac96 (ms, hash(CH|SH|SC|SKE|SCR|SHD|CC|CKE|CCV|NPN))            depicted in Figure 4. Here, A acts as a man-in-the-
                |                 {z
                                    log 2
                                                    }            middle between C and S. Note, however, that A uses
                                                                 its own certificate cert a and does not rely on knowing
When a server receives CFIN, it verifies that the client         any long-term secrets belonging to C or S.
agrees with it on the full message log and on the master
secret. It responds by sending its own change cipher                 Recall that the client signs the transcript hash(log c1 );
spec message to turn on encryption and a server finished         so the key idea of the attack is to compute a collision
message SFIN that contains a 96-bit MAC over the full            between this client-side transcript and the server-side
handshake log log 3 using the master secret ms.                  transcript hash(log s1 ), even though the two connections
                                                                 see different message sequences. When the MitM A
    At the end of the handshake, both client and server          receives a client hello from C, it responds with its
have authenticated each other, proved knowledge of the           own hello SH0 , certificate SC0 , key exchange SKE0 . It
master secret, and agreed upon the message log. They             then initiates a connection with the server S by sending
can now start encrypting application data to each other          a carefully crafted client hello CH0 . A now runs both
using the connection keys (k1 , k2 ).                            connections in parallel. It will receive a hello SH, certifi-
                                                                 cate SC, key exchange SKE, and certificate request SCR
    In most common TLS usage scenarios, clients are              from S. We assume that the length of these messages
not authenticated using certificates. The handshake au-          SH|SC|SKE|SCR is fixed (= M ) and is known in advance.
thenticates only the server and the client-side user is
authenticated within the application using a challenge-              Note that A needs to choose CH0 before it receives
response protocol based on a password or some other              any messages from S. A can compute CH0 and SCR0 as
bearer token (e.g. HTTP cookie). Such application-level          follows. A uses a chosen-prefix collision to find two bit-
authentication protocols are known to be vulnerable to           strings (C1 , C2 ) of length L1 and L2 bytes respectively

                                                             6
                                                                               hash(log1s ). A simply forwards these messages to S,
                                                                               pretending to be C, and S accepts these messages.

                                                                               Controlling the master secret Even though S has
                                                                               accept C’s certificate on its connection with A, A
                                                                               cannot complete the connection unless it knows the
                                                                               master secret on its connection with S. The master
                                                                               secret is computed from g xy so A needs to know the
                                                                               x corresponding the g x that C sent in its key exchange
                                                                               message CKE. In order to accomplish this task, we rely
                                                                               on a key forcing attack in the DHE handshake.
                                                                                   When A sends SKE0 to C, it does not send a
                                                                               valid Diffie-Hellman group (p, g). Instead, it chooses an
                                                                                                             0
                                                                               arbitrary public value k = g x and sets p = k 2 − k and
                                                                               g = k. This p value is clearly not a prime, and it has the
                                                                               property that no matter what private value x is generated
                                                                               by C, we will have g x mod p = k. Hence, by choosing
                                                                               such a bogus Diffie-Hellman group, A can force C to
                                                                               send a CKE with a public value that it controls.
Fig. 4. Man-in-the-middle client signature forwarding attack on TLS                To complete the attack, we assume that S always
1.2. The client C connects to a malicious server A and offers to               uses the same Diffie-Hellman group (p, g). A chooses
authenticate with its certificate cert C . The attacker A computes a                                      0
chosen-prefix collision on the client signature transcript hash(log 1 ),       some x0 and sets k = g x mod p. It then sends SKE0
and uses it to impersonate the client at a different server S. Messages        to C with the bogus group (k 2 − k, k) and the public
that the attacker controls are labeled in red. A sends a bogus Diffie-         value k. Now, the CKE sent by C will contain k, and A
Hellman group (k2 − k, k) to C; we use k = g here for simplicity.              will forward it to S. A will then forward C’s signature
                                                                               CCV as usual. The master
                                                                                                   0
                                                                                                         secret between A and S will
                                                                               be derived from g x y mod p, but A knows x0 and hence
such that C1 appears within the last distinguished name                        can compute this value. Consequently, A can complete
dn0 in SCR0 and C2 appears within the last extension                           the handshake and impersonate C at S.
ex0c in CH0 :
                                                                                   We observe that the attack here relies on the client
            hash(CH|SH0 |SC0 |SKE0 |SCR0 (C1 |−))
                                                                               not validating the Diffie-Hellman groups it receives
          = hash(CH0 (nc , C2 ))          | {z }
                          |{z}             dn0                                 from the server. From our experiments, we find that
                                  ex0c                                         most TLS libraries do not validate the groups they
Furthermore, we set the length of dn0 in SCR0 to be                            receive in the server key exchange, probably because
L1 + M , so that it still has M bytes (denoted by −)                           checking for primality is expensive. In some libraries,
that need to be filled in after C1 .                                           the value k 2 −k is rejected because it is an even number.
                                                                               In those cases, we find that we can use p = k 2 − 1 and
    Now, A sends CH0 to S, receives SH|SC|SKE|SCR in                           with 50% probability, the client will compute g x = k,
response, and stuffs these messages into the remaining                         allowing the attack to succeed. This weakness in TLS-
M bytes in SCR0 and sends it to C. At this point the                           DHE has been noted before [6] and a new protocol
hash of the message transcripts in the two connections                         extension aims to fix it by allowing only well-known
coincide, assuming that the hash function satisfies the                        Diffie-Hellman groups [12]. However, an optional ex-
length extension property:                                                     tension cannot prevent our attack scenario, since A
                                                                               could always pretend to not support the extension and
        hash(CH|SH|SC0 |SKE0 |SCR0 (C1 |SH|SC|SKE|SCR))
                                    |       {z      }                          mount the attack anyway.
                                                     dn0
  = hash(CH0 (nc , C2 )|SH|SC|SKE|SCR)                                            Note that the attack only relies on DHE between
                  |{z}
                          ex0c
                                                                               C and A; the connection between A and S can use
                                                                               ECDHE or RSA and the attack would still work. In
From this message onwards, the hash of the handshake                           other words, such transcript collisions can also be used
log in both connections will remain the same. A then                           to mount cross-protocol attacks in the sense of [26].
forwards the sever hello done SHD to C. In response,
C sends a certificate CC, a key exchange CKE, and                              Attack Complexity The transcript collision attack
a certificate verify CCV that contains a signature over                        requires A to compute a chosen-prefix collision for
the transcript hash(log c1 ) which is now the same as                          the hash function used in the client signature. In TLS

                                                                           7
versions before 1.2, the default hash function is a              software [33]. In our demo, A accepts the client hello
concatenation of MD5 and SHA-1 and hence requires                and then keeps the client-side TLS connection alive
computing 277 MD5 and SHA-1 hashes. In TLS 1.2,                  until a collision has been found. Most TLS connections
if the signature uses SHA-1, the cost is 277 hashes.             can be kept alive by sending regular warning alerts;
Remarkably, TLS 1.2 also allows RSA-MD5 signatures,              Java clients are willing to keep the connection open
and for such signatures, the cost of the collision is            indefinitely. Keeping the client waiting for an hour is not
only 239 MD5 hashes. Below, we describe our proof-               always practical, but we note that some unsupervised
of-concept implementation that relies on RSA-MD5.                TLS clients (such as git) are used to perform long-
                                                                 running connections to web APIs, and long connection
    Note that these cost estimates are per-connection be-        times may not be noticed. In any case, the collision
cause the collision needs to be computed once for each           search scales well with computational power and can
client nonce nc . Usually, these nonces are generated            be significantly sped up by a powerful adversary.
with a strong random number generator. However, in
some cases the client random can become predictable                  Once the collision has been found, A connects to S
due to implementation bugs (e.g. see CVE-2015-0285               to completes the attack and is able to impersonate C
in OpenSSL). We also observe that it is commonly                 at S and read and write data that only C should have
believed that these nonces only need to be unique, not           access to. Hence, the demo shows that A is able to
unpredictable. For example, the OpenSSL library uses             break TLS 1.2 client authentication between mainstream
RAND_pseudo_bytes to generate the client and server              TLS clients and servers. The precise handshake traces
random, whereas it uses RAND_bytes to generate other             exhibiting the collision are available from our website.
key material; the former succeeds even when there is
not enough entropy in the system. If the client nonce
were predictable, or if it were to be repeated with              B. Breaking TLS 1.2 Server Authentication
high frequency, the collision can be computed offline at         using a Generic Transcript Collision
leisure, making SHA-1 collisions almost feasible. Even
though our attack below does not rely on predictable                 The key to our attack above on TLS 1.2 client
nonces, it offers yet another justification for the need         authentication is that the client is willing to sign the hash
for strongly random nonces in TLS.                               of the full message log, and the format of various TLS
                                                                 messages is flexible enough to allow the attacker to stuff
Implementing a Proof-Of-Concept To implement the                 meaningless collision blocks and server-side messages
attack, we need a client that is willing to sign with            into them. A similar chosen-prefix transcript collision
RSA-MD5 and a server that is willing to accept such              attack would not work on TLS 1.2 server authentication
signatures. We found a number of TLS libraries that              because the server signature transcript does not contain
support RSA-MD5 client signatures, including certain             flexible-size elements.
versions of OpenSSL, GnuTLS, Oracle and IBM Java,                    In DHE handshakes, the signature covers only the
and BouncyCastle. (See Section VII for more details.)            client and server nonces and the server’s Diffie-Hellman
In particular, all major Java web application servers and        key share: sign(sk S , hash(nc |ns |p|g|g y )). So, the only
the default TLS servers on Red Hat Enterprise Linux (6           part of the signed value that the attacker may control
and 7) accept RSA-MD5 signatures.                                is the client nonce nc which is fixed-length (32 bytes),
    For our demo, we set up a man-in-the-middle attack           half the size of one MD5 block.
between a standard Java HTTPS client and a Java
                                                                     This prevents the use of shortcut collision attacks
HTTPS server (with default configurations.) The MitM
                                                                 against MD5, but generic attacks based on the small
implements Figure 4. In order to setup the collision
                                                                 128-bit MD5 hash length are still possible, and not too
while preserving the TLS message formats, the attacker
                                                                 far from being practical.
needs to carefully set the length fields in various places
in CH0 and SCR0 . For example, in CH0 it needs to set
consistent lengths for the full hello message, for the           Collecting and storing signatures. To mount a tran-
extensions field, and for the last extension. Furthermore,       script collision attack on TLS 1.2 server authentication,
the MitM needs to make sure that the two prefixes have           an attacker first has to collect a large number, say
a length that is a multiple of the MD5 block size (512           2x , of RSA-MD5 signatures signed by the server. The
bits). To achieve this, we fill up the last extension in         attacker may do this by passively observing RSA-MD5
CH0 and the last distinguished name in SCR0 with enough          connections to the server, but since such connections
zero bytes until the prefixes are block-aligned.                 may be rare, it may have to actively connect to the
                                                                 server to obtain a sufficient number of signatures. Once
    As explained in Section III, the chosen-prefix col-          these signatures (and the corresponding hashes) have
lision can be be computed in one hour on a 48 core               been collected and stored, the attacker can impersonate
workstation using a modified version of the hashclash            the server to any client.

                                                             8
    Upon receiving a client hello message including
the client nonce nc , the attacker chooses a DH secret
y 0 and computes
               0
                    the MD5 hashes of the transcripts
nc |ns |p|g|g y for a series of random server nonces
ns , until the hash matches a value that was collected
previously. Finding this collision requires the attacker
to compute about 2128−x MD5 hashes and then look
them up in the stored signature database. When a
match is found, the stored signature can be used by
the attacker to forge the server’s SKE message for the
current connection, and hence impersonate the server.
     The complexity of this attack on TLS 1.2 server
authentication is therefore 2128−x MD5 hashes per
connection, in addition to 2x connections performed
before-hand, and 2x storage. The attacker can trade-off
between these costs—the more signatures he can collect,
the less he has to compute per connection. For example,
if it is feasible to collect, store, and search through 264           Fig. 5. TLS 1.3: A server-authenticated 1-RTT (EC)DHE handshake
signatures, then the per-connection cost is 264 hashes.               based on draft 10 of the specification. The client and server send their
Although we have described the attack in terms of MD5,                key shares within the hello messages and all subsequent handshake
                                                                      messages are encrypted. The server signs the current handshake
a similar but more expensive attack can be mounted                    transcript hash(log 2 ) in a new SCV message.
on RSA-SHA1 server signatures, which would require
2160−x computation per-connection.
Practical Impact of the Attack. Both the precompu-                    of TLS clients would be affected. To err on the safe side,
tation and per-connection cost of the attack is currently             we recommend that TLS libraries should immediately
out of reach for academic researchers, but might be                   disable all MD5-based signatures.
within the capabilities of well-resourced adversaries.
                                                                      Exploiting predictable nonces and keys. We observe
   A prerequisite for the attack is to find servers that              that the precomputation in the above attack can be
would be willing to sign their SKE messages with                      avoided if the server uses a predictable nonce ns and
RSA-MD5. Internet-wide scans show that about 31%                      predictable DH parameters p, g, g y . In this case, the
of the Alexa top 1 million websites support RSA-                      attacker only has to perform 264 computations online.
MD5 signatures.1 This subset includes popular websites                How realistic is this assumption? Many TLS imple-
hosted by Akamai, such as microsoft.com.                              mentations allow DH keys to be reused; in OpenSSL,
                                                                      for example, keys are reused by default unless the
    A second question is whether TLS clients would ac-                application sets the SSL_OP_SINGLE_DH_USE flag. For
cept RSA-MD5 signatures. Most popular web browsers                    such servers, the parameters are clearly predictable.
and TLS libraries do not offer RSA-MD5 as one of
the supported signature algorithm in the client hello.                    That leaves the server nonce, and as we noted for
This might lead one to believe that they would not                    clients, a bug in the use of the random number gen-
accept RSA-MD5 server signatures. However, we found                   erator could lead to predictable nonces. Alternatively,
and reported security bugs in NSS (the library used                   the server may support a recent TLS variant called
by Firefox and some versions of Chrome), GnuTLS                       Snap-Start [23] that allows the client (and hence the
(used in curl and git), and BouncyCastle; these libraries             attacker) to choose the server nonce. That said, we do
(and applications that rely on them) incorrectly accept               not know of any deployed TLS 1.2 implementation that
RSA-MD5 signatures even if they have been explicitly                  uses predictable nonces, but this section serves as a
disabled. For example, Firefox will accept an RSA-MD5                 warning to implementors that strongly random nonces
signature from a website, even though it is not supposed              are needed in TLS, and not just for preventing replays.
to. Furthermore, other TLS libraries such as versions of
OpenSSL (up to version 1.0.1e), mbedTLS, and Java
                                                                      C. Breaking TLS 1.3 Client and Server Authentication
routinely offer and accept RSA-MD5 signatures.
                                                                      using a Chosen-Prefix Transcript Collision
   Conseqently, if an attacker has the resources to
achieve the server impersonation attack, a large number                   From the viewpoint of transcript collisions, TLS 1.2
                                                                      server signatures may seem stronger than client signa-
  1 https://securitypitfalls.wordpress.com/2015/12/07/november-       tures, but not signing enough leads to other security
2015-scan-results/                                                    problems. For example, the server becomes vulnerable

                                                                  9
to cross-protocol attacks [26] and to downgrade attacks             the length extension property of the hash function, all
like Logjam [1]. In response to such attacks, the new               subsequent handshake hashes collide. So, A can forward
design of TLS 1.3 requires the server to sign the full              S’s signature in SCV to C and C’s signature in CCV to
handshake log, including the negotiated parameters.                 S, and both will be accepted, even though the DH keys
                                                                    have been tampered with by a man-in-the-middle.
    Figure 5 illustrates the standard one-round-trip (1-
RTT) message flow in the current draft (version 10) of              Implementing a Proof-Of-Concept Up to draft 7,
the TLS 1.3 specification. In comparison to TLS 1.2,                the TLS 1.3 specification explicitly allowed RSA-MD5
this protocol flips the order in which the DH key shares            signatures. We wrote a proof-of-concept attack demo
are sent, so that the handshake can complete in one                 based on our own simple prototype implementation
round trip. The key shares are sent within extensions               of TLS 1.3 that signs with RSA-MD5. As with TLS
in the hello messages CH and SH. The server no longer               1.2 client authentication, we found the chosen-prefix
sends an SKE message. Instead, it sends a new server                collision in roughly one hour on a single workstation.
certificate verify message SCV just before the finished
message. The SCV contains a signature over the hash                     As we observed when discussing TLS 1.2, a large
of the full message log up to this point (log 2 ). Another          number of TLS servers and clients support RSA-MD5
departure from TLS 1.2 is that all handshake messages               signatures. Consequently, we believe that if TLS 1.3
after SH are encrypted, in order to protect the privacy of          draft 7 were to be implemented today, it is quite likely
the client and server certificates from passive attackers.          that many of its clients and servers would be vulnerable
                                                                    to our man-in-the-middle attack. However, this attack
    We demonstrate a chosen-prefix transcript collision             vector was removed from TLS 1.3, at least partly due
on TLS 1.3 that breaks both client and server signatures,           to our findings, when draft 8 of the protocol explicitly
enabling a full man-in-the-middle attack on the protocol.           deprecated MD5-based signatures.
The attack is similar in spirit to the one on TLS 1.2
client signatures; we use the flexible formats of the
client and server hello messages to create a trascript              D. Downgrading TLS 1.0-1.1 to Weak Ciphersuites
collision immediately after the server hello SH.                    using a Chosen-Prefix Transcript Collision
    The client C wants to connect to S, but its mes-                    In TLS, the integrity of the handshake depends
sages are intercepted by a network attacker A. After                upon the MACs exchanged in the Finished messages. If
A receives the client’s CH, it sends its own CH0 to                 these MACs were broken, the attacker would be free to
the server, receives the servers SH, and sends its own              modify the hello messages to downgrade the connection
SH0 to the client. A now knows the Diffie-Hellman                   to an old protocol version or weak ciphersuite, or to
shared secrets on both connections, and it has chosen               delete important extensions such as the renegotiation
CH0 and SH0 such that hash(CH|SH0 ) = hash(CH0 |SH).                indication countermeasure [11].
Consequently, A can now simply forward all hanshake                     Recall that the Finished MACs are computed over
messages between C and S, and both client and server                the hash of the full handshake trascript (hash(log 2 ) and
authentication will succeed. A will need to decrypt and             hash(log 3 ) in Figure 3). In TLS 1.0 and 1.1, this hash
reencrypt these messages, but it can do so because it               function is the concatenation of MD5 and SHA-1. As
knows the encryption keys on both connections. More                 we saw in Section III, a chosen-prefix collision on this
importantly, once the handshake is complete, A can read             construction can be computed with 277 work. We find a
and tamper with application data in both directions.                man-in-the-middle transcript collision attack on server-
    To compute CH0 and SH0 , A needs to find a chosen-              authenticated TLS 1.1 that is similar to the TLS 1.3
prefix collision C1 , C2 of length L1 and L2 bytes re-              attack. A network attacker modifies the client and server
spectively such that C1 appears within the last extension           hellos so that the handshake hashes collide immediately
of of SH0 and C2 appears as the last extension of CH0 :             after these two messages; the rest of the handshake
                    0                              0                is left unchanged. The client authenticates the server
hash(CH|SH0 (ns , g y , C1 |−)) = hash(CH0 (nc , g x , C2 ))        and the handshake completes successfully, and although
                        | {z }                        |{z}
                        ex0s                           ex0c         the attacker does not know the master secret, it can
                                                                    downgrade the connection to use any weak algorithm
Suppose we know that the server S will respond to                   that both the client and server support, but prefer not
CH0 with a server hello message SH of known length                  to use, such as an EXPORT ciphersuite [1], or a weak
M . Then in SH0 , we set the length of ex0s to L1 + M               encryption algorithm like RC4.
so that there is room for M more bytes after C1 .
Once A receives SH from S, it stuffs this message                       A similar transcript collision attack appears in DTLS
within this extra space in SH0 and sends it to C. Hence,            1.0, a UDP-based variant of TLS 1.1. In DTLS, the
after the server hello, the handshake transcripts at the            attack can be made even more efficient by exploiting
client and server have the same hash. Moreover, due to              its cookie mechanism. In response to a client hello CH,

                                                               10
                                                                             The goal of the attacker is to make sure that
                                                                          the contents of the client finished message (i.e. the
                                                                          tls-unique) coincide on both connections:

                                                                                  mac96 (msc , log c2 ) = mac96 (mss , log s2 )

                                                                          The attacker can use any controlled part of the tran-
                                                                          script, but we will set things up carefully so that he
                                                                          can compute the collision as late as possible, in order
                                                                          to reduce the size of the messages to hash. More
                                                                          precisely, we use the certificate request SCR0 on the
                                                                          client-side and the NPN message on the server side,
                                                                          which are sent when all other messages in the transcript
                                                                          are already fixed. The attacker uses C1 as the last
                                                                          distinguished name in SCR0 and C2 as the padding in
                                                                          the NPN message (after the protocol name “http/1.1”),
                                                                          and computes (C1 , C2 ) such that the MAC coincides.
                                                                          Once this collision is found, the MitM sends these
Fig. 6.      Man-in-the-middle credential forwarding attack on
                                                                          two messages on the corresponding connections and
tls-unique channel binding. The attack uses a transcript collision        completes the handshakes. A can then impersonate C
to impersonate the client to the server.                                  at S by forwarding any application-level channel-bound
                                                                          credentials sent by C (for A) to S.

a DTLS server can send a hello verify request message                     Implementing a Proof-Of-Concept We implemented
HVR containing a cookie. The client is meant to restart                   a man-in-the-middle attacker to demonstrate the attack.
the handshake by sending the exact same client hello                      We used an OpenSSL client as C and the main Google
message but with this cookie included in it. Since the                    website as S, since this website supports the next-
HVR is not authenticated, the arbitrary-length cookie                     protocol-negotiation protocol extension. After receiving
field allows any network attacker to inject data into the                 the client hello CH from the client and the server hello
transcript, after a known prefix of a fixed length. This                  done SHD from the server-side, the MitM runs a generic
allows the chosen-prefix attack to be transformed to                      collision search to compute SCR0 and NPN.
an almost common prefix attack, similar to the cookie-
based attack on IKEv2 in Section VI-A.                                        For the collision search, we implemented the TLS
                                                                          PRF mac96 function using the CUDA framework for
                                                                          NVIDIA GPUs. In TLS versions up to 1.1, this con-
E. Breaking the tls-unique Channel Binding
                                                                          struction is built using MD5 and SHA-1; in TLS 1.2
using a Generic Transcript Collision
                                                                          the construction uses SHA-256. However, the strength
    Suppose an application-level authentication protocol                  of the hash function is immaterial because what we are
at C binds its login credential to the tls-unique                         attacking is the truncated 96-bit MAC. The underlying
channel binding [2], so that when the credential is                       hash function does not matter. Following the analysis
sent from C to A, it cannot be used by A at S. We                         explain in Section III, it should require about 248
demonstrate how the attacker A could use a generic                        computations on average to get a collision.
collision attack to break this protection.
                                                                              Our implementation run at 160 MH/s for TLS 1.1
    Figure 6 depicts the attack. It follows the general                   and 113 MH/s for TLS 1.2 on a Tesla K20Xm GPU.
pattern of the TLS 1.2 client authentication attack,                      This is comparable to the expected speed we can derive
except that it relies on a collision on the transcript                    from benchmarks of MD5, SHA-1 and SHA-256 on this
MAC in the client finished message, rather than a                         GPU.It took 20 days to find a collision for TLS 1.1,
collision in the hash function. The client C connects                     using four Tesla K20Xm GPUs. Our demo evaluated
to the MitM A who then opens a new connection to S.                       the PRF about 249.9 times, which is rather unlucky: it
The attacker sends a SKE0 to C that contains a bogus                      should take half that number on average. We note that
group (k 2 − 1, k), thereby forcing the client to send                    the generic collision attack is completely parallelizable
k x mod (k 2 − 1) = k in its client key exchange CKE.                     and hence the time for finding a collision can be brought
On the server side, the attacker can send its own CKE0                    down to an arbitrarily small number by throwing enough
containing any Diffie-Hellman value. Hence, the MitM                      computational power at it. Using Amazon EC2, this
knows the master secrets ms c , ms s and connection keys                  should cost about $140 for TLS 1.1, and $200 for TLS
on both connections.                                                      1.2. The transcripts are available on our website.

                                                                     11
                                                                     Figure 11 in Appendix depicts an attack on IKEv2 ini-
                                                                     tiator authentication that relies on a transcript collision
                                                                     on this signature. The network attacker intercepts the
                                                                     SA INIT request from I to R and responds with a
                                                                     cookie ck. The initiator I restarts the key exchange
                                                                     by including ck in the new SA INIT request (m1 ).
                                                                     However, the attacker has chosen ck in a way that the
                                                                     hash of m1 is the same as the hash of a tampered
                                                                     SA INIT request m01 that contains the attacker’s Diffie-
                                                                                               0
                                                                     Hellman public value g x . The attacker sends this tam-
Fig. 7. IKEv2: A mutually-authenticated key exchange. Message        pered request m01 to the responder and upon receiving
parts colored in red can have arbitrary length.                      a response, it tampers with the response to 0replace R’s
                                                                     Diffie-Hellman key g y with its own key g y . Note that
                                                                     the attacker does not tamper with the nonces ni , nr .
Truncated HMAC is not collision-resistant A
more general lesson to be taken from our attack on                      0
                                                                          At this 0
                                                                                     point, the attacker knows the shared secrets
tls-unique is that there are many uses of HMAC                       g x y , g xy and encryption keys on the two connections.
in cryptographic protocols that are not protected from               Moreover the hash used in the signature transcript
collisions in the underlying hash function. For example,             collides all the way to the mac(ki , IDi ). To complete
although HMAC-MD5 may be a good MAC, it is not                       the attack, the attacker must ensure that ki is that same
collision-resistant when the key is known to the attacker.           at I and       R. It 0can ensure this by choosing x0 , y 0 such
                                                                             x0 y
Similarly, when HMAC-SHA256 is truncated to 96 bits,                 that g         = g xy (as discussed below). Thereafter, it can
it may still be a good MAC, but it is certainly not a good           forward I’s signature to R and hence impersonate I.
hash function (since collisions can still be found in 248
steps). Consequently, when inspecting the use of hash                Implementing the Attack To implement the attack,
functions in Internet protocols, it would be a mistake to            we must first find a collision between m1 and m01 .
assume that all uses of HMAC are safe; it is important               We observe that in IKEv2 the length of the cookie is
to look both at the mechanism and its intended security              supposed to be at most 64 octets but we found that many
goal. In some cases, we may need HMAC to be both a                   implementations allow cookies of up to 216 bytes. We
MAC and a collision-resistant hash function.                         can use this flexibility in computing long collisions.
                                                                        The attacker finds two length-prefixed bitstrings
  VI.   T RANSCRIPT C OLLISIONS IN IKE AND SSH                       (C1 , C2 ) of L bytes each such that
    Although the bulk of this paper has focused on colli-            hash(SA INIT([C1 |−]|−)) = hash(SA INIT( C2 |−))
sions in TLS, similar attacks apply to other mainstream                           | {z }                     |{z}
                                                                                           ck                                  ck0
protocols like IKEv1, IKEv2, and SSH. We describe
two exemplary attacks here.                                          where the length of ck is set to L+M , that is, ck has M
                                                                     empty bytes ready to   0
                                                                                               fill in. We set M to the length of
A. Breaking IKEv2 Initiator Authentication using a                   the bitstring SA0i |g x |ni that the attacker wants to send
Precomputed Common-Prefix Transcript Collision                       to R in its tampered SA INIT request m01 . The idea is
                                                                     that the attacker can now stuff the tampered message
     Figure 7 depicts the IKEv2 authenticated key ex-
                                                                     into ck, and can stuff the original message into info 0i to
change protocol, which is similar to the SIGMA’ pro-
                                                                     obtain a transcript collision:
tocol discussed in Section II. The initiator first sends
                                                                                                      0
an SA INIT request containing its Diffie-Hellman value                  hash(SA INIT([C1 |SA0i |g x |ni ]|SAi |g x |ni |info i )|−) =
g x , nonce ni , and proposed cryptographic parameters                               |      {z
                                                                                                 ck
                                                                                                       }
SAi , info i . The responder replies with its own public                                                  0
                                                                        hash(SA INIT([C2 ]|SA0i |g x |ni |[SAi |g x |ni |info i ])|−)
value g y , nonce nr and parameters SAr , info r . Alter-                            |{z}                 |         {z         }
                                                                                           ck                      info 0i
natively, the responder may send a cookie ck, thereby
asking the initiator to restart the protocol by sending the          The collision (C1 , C2 ) can be found easily as a chosen-
same SA INIT request but with ck included in it.                     prefix collision attack. Since the collision occurs be-
    After the SA INIT exchange, the initiator and re-                fore any unpredictable value has been included in the
sponder authenticate each other by signing a portion of              message, it can be computed offline; that is, it does
the message transcript. Notably the initiator signs:                 not have to be computed while a connection is live.
                                                                     The collision can then be used to break any number
 hash(SA INIT(ck|SAi |g x |ni |info i )|nr |mac(ki , IDi ))          of connections between I and R. Such collisions are
                                                                     easy to compute for MD5, but we found that even
      |          {z                  }
                      m1


                                                                12
though MD5 signatures are allowed by the standard,
they are not commonly supported by IKEv2 imple-
mentations. However, SHA-1 signatures are mandatory
for all IKEv2 implementations, so an offline chosen-
prefix collision on SHA-1 is enough to mount the
attack. The best known complexity of such collisions
is currently 277 , which may be feasible for a powerful
adversary (especially if better shortcut attacks on SHA-
1 are discovered).
    We also observe that the two prefixes are very simi-
lar: we only need the length of the cookie to be different.
Following the format of IKE message, the length field
is on bytes 22 and 23 of the hashed transcript, and
all previous bytes must have a fixed value. Hence, we
can almost use a common-prefix collision attack, if the
collision algorithm introduces a difference in bytes 22-
23, and no difference in preceding bytes. For MD5, the
                                                                     Fig. 8.   SSH-2: Key exchange and user authentication.
most efficient collision attacks do not have a compatible
message difference, but it seems possible to build a
dedicated attack with complexity below 239 . However,
                                                                     (embedded in) ID0i on the server side, until the PRF
for SHA-1, all known collision attacks use differences
                                                                     values on the two sides collide. It can then forward
in every message words, and are thus unsuitable.
                                                                     I’s signature to R, even though it knows the Diffie-
    The 0final step to implement the attack is to ensure             Hellman shared secret. When the PRF is HMAC-MD5,
                 0
that g xy = g x y . To achieve this, we rely on a small              this generic collision attack costs about 2 ∗ 264 HMAC
subgroup confinement attack. To see a simple example,                computations per connection.
suppose the attacker chose x0 = y 0 = 0; then the two
shared secrets would have the value 1. This specific so-             C. Downgrading SSH-2 to Weak Ciphersuites
lution would not work in practice because most IKEv2                 with a Chosen-Prefix Transcript Collision
implementations validate the received Diffie-Hellman
public value to ensure that it is larger than 1 and smaller                Figure 8 depicts the SSH-2 [39] protocol, which
than p − 1. However, many IKEv2 implementations                      implements yet another variation of an authenticated
support the Diffie-Hellman groups 22-24 that are known               Diffie-Hellman protocol. The client and server exchange
to have many small subgroups. These implementations                  identification strings Vc , Vs , negotiate protocol param-
do not validate the incoming public value, and hence                 eters Ic , Is , and perform a Diffie-Hellman exchange
are susceptible to similar small subgroup confinement                g x , g y . To authenticate the exchange, clients and servers
attacks, as discussed in [5]. To complete our transcript             sign a session hash, defined as:
collision attack, the MitM can use one such small                                H = hash(Vc |Vs |Ic |Is |pk S |g x |g y |g xy )
subgroup to ensure that the shared values on the two
connections are the same with high probability.                      We show that a target collision on this hash value can
                                                                     allow downgrade attaks.
B. Breaking IKEv1 Initiator Authentication                               Figure 12 in Appendix depicts a downgrade attack
with a Generic Transcript Collision                                  on SSH-2. The network attacker tampers with the key
   IKEv1, the predecessor of IKEv2, and is also vul-                 exchange message Ic in one direction and with Is in
nerable to transcript collision attacks. We briefly outline          the other. It chooses their values in a way such that the
one attack, without giving more details for lack of space.           following hashes coincide
The initiator’s signature in IKEv1 is computed as:                             hash(Vc |Vs |Ic | C1 |−) = hash(Vc |Vs | C2 )
                               xy    x   y
                                                                                                                       |{z}
  sign(sk I , prf(prf(ni |nr , g ), g |g |ci |cr |SAi |IDi ))
                                                                                                 | {z }
                                                                                                   Is0                        Ic0

A commonly-used PRF function in IKEv1 is HMAC-                       Using this collision, we leave enough space empty in
MD5, and we find a generic transcript collision attack               Is0 to stuff the real Is inside. Consequently the session
on the outer PRF value that allows initiator imperson-               hashes on the two sides coincide and the connection
ation. A man-in-the-middle attacker intercepts a con-                is completed. In this attack, the MitM does not tamper
nection
   0
        between I and R; it tries out many random                    with the Diffie-Hellman values and hence it does not
g y values on the client-side, and many random values                know the connection keys. However, it manages to

                                                                13
tamper with both Ic and Is , and can therefore down-                   5)    Red Hat issued backported patches RHEL 6
grade the negotiate ciphersuite to a weak cryptographic                      and 7 to disable MD5 signatures in their ver-
algorithm that the attacker knows how to break.                              sion of OpenSSL version 1.0.1e.
                                                                       6)    NSS 3.21 (FireFox 43) disabled support for
    Implementing the target collision for SSH-2 requires                     MD5 server signatures; MD5-based client sig-
a chosen-prefix attack on SHA-1 which is still consid-                       natures were already disabled.
ered impractical (at least 277 work). Moreover, since the              7)    GnuTLS 3.3.15 disabled MD5 signatures in
two tampered fields Ic and Is are meant to be strings                        the default configuration.
(not bitstrings), we cannot use arbitrary collisions. Still,           8)    BouncyCastle Java 1.54 (C# 1.8.1) disabled
we find this attack to be an interesting illustration of                     MD5 signatures in the default configuration.
the use of transcipt collisions for downgrade attacks.                 9)    Oracle and IBM are updating the TLS im-
    SSH-2 has a peculiar session hash construction, with                     plementation in their Java runtimes to disable
the shared secret g xy placed at the end. This makes                         MD5 signatures in the default configuration.
certain kinds of collision attacks more difficult, but we             10)    mbedTLS is being updated to disable MD5
note that this construction is not particularly secure;                      server signatures; MD5 client signatures were
since it includes the shared secret, the session hash                        already disabled.
needs to be non-leaking in addition to being collision-             These changes impact the Firefox and Android
resistant [4]. Moreover, if the SSH server reuses its               browsers, about 31% of web servers, most Java
Diffie-Hellman public value, this secret suffix becomes             application servers and their clients, and many
vulnerable to key recovery attacks like on APOP [25].               other custom applications that use less well-known
    Other variations of SSH allow for more tampering,               TLS libraries. We are maintaining a website with
which may enable new attacks. The SSH Diffie-Hellman                the currently known attacks, affected software, and
Group Exchange protocol [10] allows SSH servers to                  disclosure status at our website:
choose any Diffie-Hellman group for use in the key                                    http://sloth-attack.org          .
exchange. So, like in our TLS attacks, a man-in-the-
middle attacker can send a bogus or weak group to the                               VIII.   C ONCLUSIONS
client, and use it to control more fields in the session                We have demonstrated that the use of MD5 and
hash and mount new transcript collision attacks.                    truncated HMACs for authenticating transcripts in vari-
                                                                    ous Internet protocols leads to exploitable chosen-prefix
  VII.    SLOTH: R ESPONSIBLE D ISCLOSURE AND                       and generic collision attacks. We also showed several
                     I MPACT                                        unsafe uses of SHA-1 that will become dangerous when
                                                                    more efficient collision-finding algorithms for SHA-
   Table I summarizes the attacks discussed in this                 1 are discovered. In all cases, the complexity of our
paper. Three of our attacks on TLS are already practical;           transcript collision attacks are significantly lower than
others are within the reach of powerful adversaries.                the estimated work for a second preimage attack on
                                                                    the underlying hash function. This definitively settles
    Our attacks on TLS were publicly disclosed under                the debate on whether the security of mainstream
the acronym SLOTH (security losses from obsolete                    cryptographic protocols depend on collision resistance.
and truncated transcript hashes) and were assigned a                The answer is yes, cryptographers were right. Except
protocol-level CVE-2015-7575. We informed the au-                   in rare cases, mainstream protocols do require colli-
thors of affected protocol specifications and developers            sion resistance for protection against man-in-the-middle
for various TLS libraries. We recommended that pro-                 transcript collision attacks. Consequently, we strongly
tocols and implementations should stop using MD5-                   recommend that weak hash functions like MD5 and
based signatures and other weak hash constructions.                 SHA-1 should not just be deprecated; they should be
Our disclosure and recommendations resulted in the                  forcefully disabled in existing protocols.
following security updates:
                                                                        An open research question is whether it is possible
   1)    TLS 1.3 draft 7 stopped truncating the Fin-                to design key exchange protocols that will be resilient
         ished MACs and started using the full HMAC                 to new collision attacks. One strategy is to use a
         output.                                                    commitment scheme (like ZRTP [40]) that would make
   2)    TLS 1.3 draft 8 deprecated MD5 signatures.                 it more difficult for a man-in-the-middle to tamper
   3)    The Token Binding Protocol draft 2 removed                 with the transcript. However, such schemes may still
         tls-unique and moved to a stronger channel                 be vulnerable to certain shortcut collisions [19]. For
         binding.                                                   signatures, randomized hashing [13] provides a different
   4)    Akamai servers disabled support or RSA-MD5                 way forward but its integration into a complex protocol
         client and server signatures.                              like TLS would need to be carefully analyzed.

                                                               14
  Protocol        Property              Mechanism          Attack           Collision Type     Precomp.    Work/conn.    Preimage    Wall-clock time
  TLS 1.2         Client Auth           RSA-MD5            Impersonation    Chosen Prefix                  239           2128        48 core hours
  TLS 1.3         Server Auth           RSA-MD5            Impersonation    Chosen Prefix                  239           2128        48 core hours
  TLS 1.0-1.2     Channel Binding       HMAC (96 bits)     Impersonation    Generic                        248           296         80 GPU days
  TLS 1.2         Server Auth           RSA-MD5            Impersonation    Generic            2X conn.    2128−X        2128
  TLS 1.0-1.1     Handshake Integrity   MD5 | SHA-1        Downgrade        Chosen Prefix                  277           2160
  IKE v1          Initiator Auth        HMAC-MD5           Impersonation    Generic                        265           2128
  IKE v2          Initiator Auth        RSA-SHA-1          Impersonation    Chosen Prefix      277         0             2160
  SSH-2           Exchange Integrity    SHA-1              Downgrade        Chosen Prefix                  277           2160

                             TABLE I.    S UMMARY OF T RANSCRIPT C OLLISION ATTACKS ON I NTERNET P ROTOCOLS



                              R EFERENCES                                       [20]   D. Knuth. Seminumerical algorithms, volume 2 of the art of
                                                                                       computer programming, 1981.
 [1]   D. Adrian, K. Bhargavan, Z. Durumeric, P. Gaudry, M. Green,              [21]   H. Krawczyk. SIGMA: The SIGn-and-MAc approach to
       J. A. Halderman, N. Heninger, D. Springall, E. Thomé, L. Va-                   authenticated Diffie-Hellman and its use in the IKE protocols.
       lenta, B. VanderSloot, E. Wustrow, S. Zanella-Béguelin, ,                      In CRYPTO. 2003.
       and P. Zimmermann. Imperfect forward secrecy: How diffie-
       hellman fails in practice. In ACM CCS, 2015.                             [22]   H. Krawczyk, K. G. Paterson, and H. Wee. On the security of
                                                                                       the TLS protocol: A systematic analysis. In CRYPTO, 2013.
 [2]   J. Altman, N. Williams, and L. Zhu. Channel bindings for TLS.
       IETF RFC 5929, 2010.                                                     [23]   A. Langley. Transport Layer Security (TLS) Snap Start. Internet
                                                                                       Draft, 2010.
 [3]   S. Bellovin and E. Rescorla. Deploying a new hash algorithm.
       In NDSS, 2006.                                                           [24]   A. Langley. Transport Layer Security (TLS) Next Protocol
                                                                                       Negotiation Extension. Internet Draft, 2012.
 [4]   F. Bergsma, B. Dowling, F. Kohlar, J. Schwenk, and D. Stebila.
                                                                                [25]   G. Leurent. Practical key-recovery attack against APOP, an
       Multi-ciphersuite security of the secure shell (ssh) protocol. In
                                                                                       MD5-based challenge-response authentication. IJACT, 1(1):32–
       ACM CCS, pages 369–381, 2014.
                                                                                       46, 2008.
 [5]   K. Bhargavan, A. Delignat-Lavaud, and A. Pironti. Verified
                                                                                [26]   N. Mavrogiannopoulos, F. Vercauteren, V. Velichkov, and
       contributive channel bindings for compound authentication. In
                                                                                       B. Preneel. A cross-protocol attack on the TLS protocol. In
       NDSS, 2015.
                                                                                       ACM CCS, 2012.
 [6]   K. Bhargavan, A. D. Lavaud, C. Fournet, A. Pironti, and P.-
                                                                                [27]   F. Mendel, C. Rechberger, and M. Schläffer. MD5 is weaker
       Y. Strub. Triple handshakes and cookie cutters: Breaking and
                                                                                       than weak: Attacks on concatenated combiners. In ASIACRYPT,
       fixing authentication over TLS. In IEEE S&P (Oakland), 2014.
                                                                                       2009.
 [7]   I. B. Damgård. A design principle for hash functions. In                [28]   A. Menon-Sen, N. Williams, A. Melnikov, and C. New-
       CRYPTO’89, 1990.                                                                man. Salted Challenge Response Authentication Mechanism
 [8]   T. Dierks and E. Rescorla. The Transport Layer Security (TLS)                   (SCRAM) SASL and GSS-API Mechanisms. IETF RFC 5802,
       Protocol Version 1.2. IETF RFC 5246, 2008.                                      2010.
 [9]   T. Dierks and E. Rescorla. The Transport Layer Security (TLS)            [29]   R. C. Merkle. A certified digital signature. In CRYPTO’89,
       Protocol Version 1.3. Internet Draft, 2014.                                     1990.
[10]   M. Friedl, N. Provos, and W. Simpson. Diffie-Hellman Group               [30]   J. M. Pollard. A monte carlo method for factorization. BIT
       Exchange for the Secure Shell (SSH) Transport Layer Protocol.                   Numerical Mathematics, 15(3):331–334, 1975.
       IETF RFC 4419, 2006.                                                     [31]   J. M. Pollard. Monte carlo methods for index computation.
[11]   F. Giesen, F. Kohlar, and D. Stebila. On the security of TLS                    Mathematics of computation, 32(143):918–924, 1978.
       renegotiation. In ACM CCS, 2013.                                         [32]   A. Popov, M. Nystroem, D. Balfanz, and A. Langley. The
[12]   D. Gillmor. Negotiated Finite Field Diffie-Hellman Ephemeral                    Token Binding Protocol Version 1.0. Internet Draft, 2015.
       Parameters for TLS. Internet Draft, 2015.                                [33]   M. Stevens. Hashclash. https://marc-stevens.nl/p/hashclash/.
[13]   S. Halevi and H. Krawczyk. Strengthening digital signatures              [34]   M. Stevens. Counter-cryptanalysis. In CRYPTO, 2013.
       via randomized hashing. In CRYPTO, 2006.                                 [35]   M. Stevens. New collision attacks on SHA-1 based on optimal
[14]   B. Hill, D. Baghdasaryan, B. Blanke, R. Lindemann, and                          joint local-collision analysis. In EUROCRYPT, 2013.
       J. Hodges. FIDO UAF Application API and Transport Binding                [36]   M. Stevens, A. K. Lenstra, and B. de Weger. Chosen-prefix
       Specification v1.0. Draft Specification, 2015.                                  collisions for MD5 and applications. IJACT, 2(4):322–359,
[15]   P. Hoffman. Use of Hash Algorithms in Internet Key Exchange                     2012.
       (IKE) and IPsec. IETF RFC 4894, 2007.                                    [37]   P. C. van Oorschot and M. J. Wiener. Parallel collision search
[16]   P. Hoffman and B. Schneier. Attacks on Cryptographic Hashes                     with cryptanalytic applications. J. Cryptology, 12(1):1–28,
       in Internet Protocols. IETF RFC 4270, 2005.                                     1999.
[17]   T. Jager, F. Kohlar, S. Schäge, and J. Schwenk. On the security         [38]   X. Wang and H. Yu. How to break MD5 and other hash
       of TLS-DHE in the standard model. In CRYPTO, 2012.                              functions. In EUROCRYPT, 2005.
[18]   A. Joux. Multicollisions in iterated hash functions. application         [39]   T. Ylonen and C. Lonvick. The Secure Shell (SSH) Transport
       to cascaded constructions. In CRYPTO, 2004.                                     Layer Protocol. RFC 4253 (Proposed Standard), 2006.
[19]   J. Kelsey and T. Kohno. Herding hash functions and the                   [40]   P. Zimmermann. ZRTP: Media Path Key Agreement for Unicast
       nostradamus attack. In EUROCRYPT, 2006.                                         Secure RTP. IETF RFC 6189, 2012.


                                                                           15
  H                     Collision                 CPC                                      x0          x1    x2    x3     x4    x5
  Generic                 2N/2                    2N/2                     H1 IV1                                                     h1
  H1 |H2          2N1 /2 N2 /2 + 2N2 /2   2N1 /2 N2 /2 + 2N2 /2
                                                                                           x00         x01   x02   x03    x04   x05
  MD5                     216                     239
  SHA-1                   261                     277
  MD5 | SHA-1             267                     277                                                          M
                                                                           H2
TABLE II.       C OMPLEXITY OF FINDING COLLISIONS IN VARIOUS                       IV2                                                h2
                     HASH CONSTRUCTIONS

                                                                                                               M0

                                                                       Fig. 9.    Multi-collision attack
                          A PPENDIX
A. Attacks against Hash Functions                                                                x00
                                                                                    IV10
    We now give more details about attacks against hash                 SHA-1                                                          h1
function, considering both generic attacks and dedicated                             IV1
attacks against widely-used functions MD5 and SHA-1.                                             x0
The main results are summarizex in Table II.
                                                                                             x00                     M0
                                                                           MD5 IV20
Generic collision attacks While a basic collision
                                                                                                                                       h2
attack requires to compute and store 2N/2 images of
the hash function, it is possible to mount a parallel and                            IV2
                                                                                             x0                      M
memory-less attack with a very small overhead. The
main idea was introduced by Pollard as the Rho algo-                   Fig. 10.    CPC attack against MD5 | SHA-1
rithm for factorization [30] and discrete logarithms [31],
and was later generalized to collision search. The hash
function is first restricted from {0, 1}∗ → {0, 1}N to                 order to locate the collision. This attack requires about
{0, 1}N → {0, 1}N , so that it can be iterated. After                  2N/2 evaluations of H, and a memory of αc when using
some number of steps, a chain of iterations reaches a                  c CPUs.
cycle, and the graph will have the shape of the greek
letter ρ. On average, the cycle has length O(2N/2 ) and                    This attack can be tweaked for a chosen-prefix col-
is reached after O(2N/2 ) steps. The point where the                   lision attack using an auxiliary function g : {0, 1}N →
tail of the meets with the cycle reveals a collision in                {0, 1}N defined as:
the hash function. It can be detected in time O(2N/2 )                                     
                                                                                             H(P |x) if x is even
with little or no memory, using various cycle detection                            g(x) =
methods, such as Floyd’s algorithm [20] (also known as                                       H(P 0 |x) if x is odd.
tortoise and hare).
                                                                           Collisions in g can be found with the previous
    Some variants of this attack using distinguished                   techniques. With probability 1/2 a collision is g is
points can be parallelized efficiently. We now describe                between an even x and an odd x0 (or vice versa), this
a parallel version of Pollard’s Lambda algorithm, as                   implies a chosen-prefix collision H(P |x) = H(P 0 |x0 ).
described by van Oorschot and Wiener [37], using c                     An accurate complexity analysis is providedpin [37]:
CPUs. Each CPU will compute iteration chains of the                    a collision is expected to be found after       π2N /2
function H, and stop when reaching a distinguished                     evaluations. For a chosen-prefix
point, that is a point with some easy to test property. For                                          √ collision, we expect to
                                                                       find two collisions in g after π2N evaluations.
instance, we stop a computation when the ending point
satisfies x < 2N/2 αc for some small constant α, so that               Concatenation Collisions in the concatenation of two
the expected length of a chain is 2N/2 /αc. When a chain               hash functions H1 |H2 can be found with roughly the
is finished, we store the starting point, the length, and              same effort as breaking the strongest one of the two,
the ending point. We generate αc chains in this way, so                using the multi-collision technique of Joux [18].
that the function has been evaluated about 2N/2 times,
and there is a high probability that there was a collision.                The adversary first finds a collision pair (x0 , x00 )
The important idea of this attack is that if a given point             for H1 , starting from the initialization value of H1 .
is reached by two different chains, both chain will stop               Then it finds a collision pair (x1 , x01 ) starting from
at the same distinguished point. Therefore, we look at                 H1 (x0 ) = H1 (x00 ). This defines 4 messages with the
the ending points of the chains, and when a collision is               same H1 -digest: x0 |x1 , x0 |x01 , x00 |x1 , x00 |x01 . After N2 /2
detected, we restart the chains from the starting point in             steps, this defines a set of 2N2 /2 messages with the

                                                                  16
same H1 -digest. With high probability, two of these            B. Transcript Collision Attacks on IKEv2 and SSH-2
messages have the same H2 -digest as well (see Fig-
ure 9). Therefore, one can find a collision in H1 |H2
with a complexity only N2 /2 × 2N1 /2 + 2N2 /2 . For
MD5 | SHA-1, this translates to 280 , roughly as much
as a generic collision attack on SHA-1.
    Better attacks against MD5 | SHA-1 result from the
combination of Joux’s multicollision technique with
shortcut attacks against SHA-1. A collision attack can
be build for a cost of 64 × 261 + 264 ≈ 267 (building
sequentially 64 collisions for MD5). For a chosen-
prefix collision, we first perform a chosen-prefix col-
lision against SHA-1, to generate messages (x, x0 ) such
that SHA-1(P |x) = SHA-1(P 0 |x0 ). Then we build
a multicollision in SHA-1 starting from this value,
and we evaluate MD5 over a set of 264 messages
in order to find a collision. The total cost is about           Fig. 11. Man-in-the-middle initiator impersonation attack on IKEv2.
                                                                The initiator I connects to the responder R but a man-in-the-middle
277 + 64 × 261 + 264 ≈ 277 (see Figure 10).                     attacker A intercepts and tampers with some messages (shown in
                                                                red). A pecomputes a collision (C1 , C2 ) between the prefixes of two
    Moreover it has been shown that it is possible to           SA INIT messages that both begin with a cookie payload. Then by
combine cryptanalytic shortcuts both on SHA-1 and               sending a carefully crafted cookie to I, A can trigger a transcript
MD5, assuming that collision attacks against SHA-1              collision on the initiator signature, which it can then forward to R,
improve in the future [27]. This may allow collision            thereby impersonating I on a connection that it controls.
attacks against MD5 | SHA-1 with less than 264 work.
Table II summarizes the currently-known complexities
for computing various hash collisions.




                                                                Fig. 12. Man-in-the-middle downgrade attack on SSH-2. The client
                                                                C connects to a server S, but a network attacker A tampers with the
                                                                key exchange messages (shown in red) to downgrade them to a weak
                                                                ciphersuite. To succeed, A must compute a chosen-prefix collision on
                                                                the session hash H after receiving C’s key exchange message.




                                                           17
