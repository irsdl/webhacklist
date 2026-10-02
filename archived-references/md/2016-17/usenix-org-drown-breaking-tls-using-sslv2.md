---
type: Article
title: "DROWN: Breaking TLS Using SSLv2"
resource: "https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:42:51+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram"
    title: "DROWN: Breaking TLS Using SSLv2"
    author: Nimrod Aviram, Sebastian Schinzel, Juraj Somorovsky, Nadia Heninger, Maik Dankel, Jens Steube, Luke Valenta, David Adrian, J. Alex Halderman, Viktor Dukhovni, Emilia Käsper, Shaanan Cohney, Susanne Engels, Christof Paar, Yuval Shavitt
  - id: capture
    resource: "https://web.archive.org/web/20170823043101/https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram"
also_at:
  - "https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_aviram.pdf"
  - "https://www.usenix.org/sites/default/files/conference/protected-files/security16_slides_aviram.pdf"
authors:
  - Nimrod Aviram
  - Sebastian Schinzel
  - Juraj Somorovsky
  - Nadia Heninger
  - Maik Dankel
  - Jens Steube
  - Luke Valenta
  - David Adrian
  - J. Alex Halderman
  - Viktor Dukhovni
  - Emilia Käsper
  - Shaanan Cohney
  - Susanne Engels
  - Christof Paar
  - Yuval Shavitt
canonical_url: ""
cited_by:
  - "2016-17.md:59"
commit: ""
content_sha256: d976c425f2b98dc14249b193aa0eb19933089e3d6080877b4d19475d5460c672
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 81ba3c1fd89fb456cce56ae57823039a5d4c15a8bfec95e6a6aabf17e70c27ec
retrieved_from: "https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_aviram.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:42:51+00:00"
slug: usenix-org-drown-breaking-tls-using-sslv2
snapshot: 20170823043101
title_english: ""
translation_file: ""
translation_of: ""
---

# DROWN: Breaking TLS Using SSLv2

**DROWN: Breaking TLS Using SSLv2** - Nimrod Aviram, Sebastian Schinzel, Juraj Somorovsky, Nadia Heninger, Maik Dankel, Jens Steube, Luke Valenta, David Adrian, J. Alex Halderman, Viktor Dukhovni, Emilia Käsper, Shaanan Cohney, Susanne Engels, Christof Paar, Yuval Shavitt, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram>
- Also published at: <https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_aviram.pdf>
- Also published at: <https://www.usenix.org/sites/default/files/conference/protected-files/security16_slides_aviram.pdf>
- Preserved from: https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_aviram.pdf (live) on 2026-08-19
- Capture timestamp: 20170823043101
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

DROWN: Breaking TLS using SSLv2
  Nimrod Aviram, Tel Aviv University; Sebastian Schinzel, Münster University of Applied
   Sciences; Juraj Somorovsky, Ruhr University Bochum; Nadia Heninger, University of
Pennsylvania; Maik Dankel, Münster University of Applied Sciences; Jens Steube, Hashcat
 Project; Luke Valenta, University of Pennsylvania; David Adrian and J. Alex Halderman,
University of Michigan; Viktor Dukhovni, Two Sigma and OpenSSL; Emilia Käsper, Google
    and OpenSSL; Shaanan Cohney, University of Pennsylvania; Susanne Engels and
         Christof Paar, Ruhr University Bochum; Yuval Shavitt, Tel Aviv University
     https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/aviram



             This paper is included in the Proceedings of the
                    25th USENIX Security Symposium
                               August 10–12, 2016 • Austin, TX
                                      ISBN 978-1-931971-32-4




                                                  Open access to the Proceedings of the
                                                   25th USENIX Security Symposium
                                                        is sponsored by USENIX
                                DROWN: Breaking TLS using SSLv2

   Nimrod Aviram1 , Sebastian Schinzel2 , Juraj Somorovsky3 , Nadia Heninger4 , Maik Dankel2 ,
      Jens Steube5 , Luke Valenta4 , David Adrian6 , J. Alex Halderman6 , Viktor Dukhovni7 ,
     Emilia Käsper8 , Shaanan Cohney4 , Susanne Engels3 , Christof Paar3 and Yuval Shavitt1
                               1 Department of Electrical Engineering, Tel Aviv University
                                        2 Münster University of Applied Sciences
                             3 Horst Görtz Institute for IT Security, Ruhr University Bochum
                                               4 University of Pennsylvania
                                                     5 Hashcat Project
                                                 6 University of Michigan
                                                  7 Two Sigma/OpenSSL
                                                    8 Google/OpenSSL




Abstract                                                        1    Introduction
We present DROWN, a novel cross-protocol attack on              TLS [13] is one of the main protocols responsible for
TLS that uses a server supporting SSLv2 as an oracle to         transport security on the modern Internet. TLS and its
decrypt modern TLS connections.                                 precursor SSLv3 have been the target of a large number
   We introduce two versions of the attack. The more            of cryptographic attacks in the research community, both
general form exploits multiple unnoticed protocol flaws         on popular implementations and the protocol itself [33].
in SSLv2 to develop a new and stronger variant of the           Prominent recent examples include attacks on outdated
Bleichenbacher RSA padding-oracle attack. To decrypt a          or deliberately weakened encryption in RC4 [3], RSA [5],
2048-bit RSA TLS ciphertext, an attacker must observe           and Diffie-Hellman [1], different side channels includ-
1,000 TLS handshakes, initiate 40,000 SSLv2 connec-             ing Lucky13 [2], BEAST [14], and POODLE [35], and
tions, and perform 250 offline work. The victim client          several attacks on invalid TLS protocol flows [5, 6, 12].
never initiates SSLv2 connections. We implemented the              Comparatively little attention has been paid to the
attack and can decrypt a TLS 1.2 handshake using 2048-          SSLv2 protocol, likely because the known attacks are
bit RSA in under 8 hours, at a cost of $440 on Amazon           so devastating and the protocol has long been considered
EC2. Using Internet-wide scans, we find that 33% of all         obsolete. Wagner and Schneier wrote in 1996 that their at-
HTTPS servers and 22% of those with browser-trusted             tacks on SSLv2 “will be irrelevant in the long term when
certificates are vulnerable to this protocol-level attack due   servers stop accepting SSL 2.0 connections” [41]. Most
to widespread key and certificate reuse.                        modern TLS clients do not support SSLv2 at all. Yet in
   For an even cheaper attack, we apply our new tech-           2016, our Internet-wide scans find that out of 36 million
niques together with a newly discovered vulnerability in        HTTPS servers, 6 million (17%) support SSLv2.
OpenSSL that was present in releases from 1998 to early         A Bleichenbacher attack on SSLv2. Bleichenbacher’s
2015. Given an unpatched SSLv2 server to use as an              padding oracle attack [8] is an adaptive chosen ciphertext
oracle, we can decrypt a TLS ciphertext in one minute on        attack against PKCS#1 v1.5, the RSA padding standard
a single CPU—fast enough to enable man-in-the-middle            used in SSL and TLS. It enables decryption of RSA
attacks against modern browsers. We find that 26% of            ciphertexts if a server distinguishes between correctly and
HTTPS servers are vulnerable to this attack.                    incorrectly padded RSA plaintexts, and was termed the
   We further observe that the QUIC protocol is vulner-         “million-message attack” upon its introduction in 1998,
able to a variant of our attack that allows an attacker to      after the number of decryption queries needed to deduce
impersonate a server indefinitely after performing as few       a plaintext. All widely used SSL/TLS servers include
as 217 SSLv2 connections and 258 offline work.                  countermeasures against Bleichenbacher attacks.
   We conclude that SSLv2 is not only weak, but actively           Our first result shows that the SSLv2 protocol is fatally
harmful to the TLS ecosystem.                                   vulnerable to a form of Bleichenbacher attack that enables



USENIX Association                                                                  25th USENIX Security Symposium 689
decryption of RSA ciphertexts. We develop a novel ap-               attacks on newer versions. We conclude that phasing out
plication of the attack that allows us to use a server that         outdated and insecure standards should become a priority
supports SSLv2 as an efficient padding oracle. This attack          for standards designers and practitioners.
is a protocol-level flaw in SSLv2 that results in a feasible        Disclosure. DROWN was assigned CVE-2016-0800.
attack for 40-bit export cipher strengths, and in fact abuses       We disclosed our attacks to OpenSSL and worked with
the universally implemented countermeasures against Ble-            them to coordinate further disclosures. The specific
ichenbacher attacks to obtain a decryption oracle.                  OpenSSL vulnerabilities we discovered have been desig-
   We also discovered multiple implementation flaws in              nated CVE-2015-3197, CVE-2016-0703, and CVE-2016-
commonly deployed OpenSSL versions that allow an ex-                0704. In response to our findings, OpenSSL has made
tremely efficient instantiation of this attack.                     it impossible to configure a TLS server in such a way
Using SSLv2 to break TLS. Second, we present a novel                that it is vulnerable to DROWN. Microsoft had already
cross-protocol attack that allows an attacker to break a            disabled SSLv2 for all supported versions of IIS. We
passively collected RSA key exchange for any TLS server             also disclosed the attack to the NSS developers, who have
if the RSA keys are also used for SSLv2, possibly on a              disabled SSLv2 on the last NSS tool that supported it and
different server. We call this attack DROWN (Decrypting             have hastened efforts to entirely remove the protocol from
RSA using Obsolete and Weakened eNcryption).                        their codebase. In response to our disclosure, Google
   In its general version, the attack exploits the protocol         will disable QUIC support for non-whitelisted servers and
flaws in SSLv2, does not rely on any particular library             modify the QUIC standard. We also notified IBM, Cisco,
implementation, and is feasible to carry out in practice by         Amazon, the German CERT-Bund, and the Israeli CERT.
taking advantage of commonly supported export-grade                 Online resources. Contact information, server test tools,
ciphers. In order to decrypt one TLS session, the attacker          and updates are available at https://drownattack.com.
must passively capture about 1,000 TLS sessions using
RSA key exchange, make 40,000 SSLv2 connections to                  2     Background
the victim server, and perform 250 symmetric encryption             In the following, a||b denotes concatenation of strings a
operations. We successfully carried out this attack using           and b. a[i] references the i-th byte in a. (N, e) denotes an
an optimized GPU implementation and were able to de-                RSA public key, where N has byte-length m (|N| = m )
crypt a 2048-bit RSA ciphertext in less than 18 hours on            and e is the public exponent. The corresponding secret
a GPU cluster and less than 8 hours using Amazon EC2.               exponent is d = 1/e mod φ (N).
   We found that 11.5 million HTTPS servers (33%) are
vulnerable to this attack, because many HTTPS servers               2.1     PKCS#1 v1.5 encryption padding
that do not directly support SSLv2 share RSA keys with              Our attacks rely on the structure of RSA PKCS#1 v1.5
other services that do. Of servers offering HTTPS with              padding. Although RSA PKCS#1 v2.0 implements OAEP,
browser-trusted certificates, 22% are vulnerable.                   SSL/TLS still uses PKCS#1 v1.5. The PKCS#1 v1.5
   We also present a special version of DROWN that ex-              encryption padding scheme [27] randomizes encryptions
ploits flaws in OpenSSL for a more efficient oracle. It re-         by prepending a random padding string PS to a message
quires roughly the same number of captured TLS sessions             k (here, a symmetric session key) before RSA encryption:
as the general attack, but only half as many connections to
                                                                        1. The plaintext message is k, k = |k|.       The
the victim server and no large computations. This attack
                                                                           encrypter generates a random byte string PS,
can be completed on a single core on commodity hard-
                                                                           where |PS| ≥ 8, |PS| = m − 3 − k , and 0x00 ∈
ware in less than a minute, and is limited primarily by how
                                                                           {PS[1], . . . , PS[|PS|]}.
fast the server can complete handshakes. It is fast enough
that an attacker can perform man-in-the-middle attacks                  2. The encryption block is m = 00||02||PS||00||k.
on live TLS sessions before the handshake times out, and                3. The ciphertext is computed as c = me mod N.
downgrade a modern TLS client to RSA key exchange
with a server that prefers non-RSA cipher suites. Our                  To decrypt such a ciphertext, the decrypter first com-
Internet-wide scans suggest that 79% of HTTPS servers               putes m = cd mod N. Then it checks whether the de-
that are vulnerable to the general attack, or 26% of all            crypted message m is correctly formatted as a PKCS#1
HTTPS servers, are also vulnerable to real-time attacks             v1.5-encoded message. We say that the ciphertext c
exploiting these implementation flaws.                              and the decrypted message bytes m[1]||m[2]||...||m[m ]
   Our results highlight the risk that continued support            are PKCS#1 v1.5 conformant if:
for SSLv2 imposes on the security of much more recent                             m[1]||m[2] = 0x00||0x02
TLS versions. This is an instance of a more general                                    0x00 ∈ {m[3], . . . , m[10]}
phenomenon of insufficient domain separation, where
older, vulnerable security standards can open the door to           If this condition holds, the decrypter searches for the first


                                                                2
690 25th USENIX Security Symposium                                                                          USENIX Association
     SSLv2
     SSLv2                                         SSLv2
                                                   SSLv2                supported by the client and a client nonce rc , termed
     Client
     Client                                        Server
                                                   Server               challenge. The server responds with a ServerHello
                                                                        message, which contains a list of cipher suites css sup-
           ClientHello:
              csC, rC                                                   ported by the server, the server certificate, and a server
                                        ServerHello:                    nonce rs , termed connection_ID.
                                        cert, csS, rS                      The client responds with a ClientMasterKey mes-
      ClientMasterKey: cs,                                              sage, which specifies a cipher suite supported by both
      mkclear , encpk(mksecret )                                        peers and key data used for constructing a master_key.
              master_key = mkclear || mksecret                          In order to support export cipher suites with 40-bit se-
                                                                        curity (e.g., SSL_RC2_128_CBC_EXPORT40_WITH_MD5),
                                        ServerVerify                    the key data is divided into two parts:
        (Client-) Finished                                                 • mkclear : A portion of the master_key sent in the
                                     (Server-) Finished                      ClientMasterKey message as plaintext (termed
                                                                             clear_key_data in the SSLv2 standard).
                                                                           • mksecret : A secret portion of the master_key,
Figure 1: SSLv2 handshake. The server responds with a
                                                                             encrypted with RSA PKCS#1 v1.5 (termed
ServerVerify message directly after receiving an RSA-
                                                                             secret_key_data).
PKCS#1 v1.5 ciphertext contained in ClientMasterKey.
This protocol feature enables our attack.                               The resulting master_key mk is constructed by concate-
                                                                        nating these two keys: mk = mkclear ||mksecret . For 40-bit
                                                                        export cipher suites, mksecret is five bytes in length. For
value i > 10 such that m[i] = 0x00. Then, it extracts k =               non-export cipher suites, the whole master_key is en-
m[i + 1]|| . . . ||m[m ]. Otherwise, the ciphertext is rejected.       crypted, and the length of mkclear is zero.
   In SSLv3 and TLS, RSA PKCS#1 v1.5 is used to en-                        The client and server can then compute session keys
capsulate the premaster secret exchanged during the hand-               from the reconstructed master_key mk:
shake [13]. Thus, k is interpreted as the premaster secret.                    server_write_key = MD5(mk||“0”||rc ||rs )
In SSLv2, RSA PKCS#1 v1.5 is used for encapsulation                            client_write_key = MD5(mk||“1”||rc ||rs )
of an equivalent key denoted the master_key.                               The server responds with a ServerVerify mes-
                                                                        sage consisting of the challenge rc encrypted with
2.2 SSL and TLS                                                         the server_write_key. Both peers then exchange
The first incarnation of the TLS protocol was the SSL                   Finished messages in order to authenticate to each other.
(Secure Socket Layer) protocol, which was designed by                      Our attack exploits the fact that the server always de-
Netscape in the 90s. The first two versions of SSL were                 crypts an RSA-PKCS#1 v1.5 ciphertext, computes the
immediately found to be vulnerable to trivial attacks [40,              server_write_key, and immediately responds with a
41] which were fixed in SSLv3 [17]. Later versions of the               ServerVerify message. The SSLv2 standard implies
standard were renamed TLS, and share a similar structure                this message ordering, but does not make it explicit. How-
to SSLv3. The current version of the protocol is TLS 1.2;               ever, we observed this behavior in every implementation
TLS 1.3 is currently under development.                                 we examined. Our attack also takes advantage of the fact
   An SSL/TLS protocol flow consists of two phases:                     that the encrypted mksecret portion of the master_key can
handshake and application data exchange. In the first                   vary in length, and is only five bytes for export ciphers.
phase, the communicating parties agree on cryptographic
                                                                        The TLS handshake protocol. In TLS [13] or SSLv3,
algorithms and establish shared keys. In the second phase,
                                                                        the client initiates the handshake with a ClientHello,
these keys are used to protect the confidentiality and au-
                                                                        which contains a client random rc and a list of supported
thenticity of the transmitted application data.
                                                                        cipher suites. The server chooses one of the cipher
   The handshake protocol was fundamentally redesigned                  suites and responds with three messages, ServerHello,
in the SSLv3 version. This new handshake protocol was                   Certificate, and ServerHelloDone. These messages
then used in later TLS versions up to TLS 1.2. In the fol-              include the server’s choice of cipher suite, server nonce rs ,
lowing, we describe the RSA-based handshake protocols                   and a server certificate with an RSA public key. The client
used in TLS and SSLv2, and highlight their differences.                 then uses the public key to encrypt a newly generated 48-
The SSLv2 handshake protocol. The SSLv2 protocol                        byte premaster secret pms and sends it to the server in
description [22] is less formally specified than modern                 a ClientKeyExchange message. The client and server
RFCs. Figure 1 depicts an SSLv2 handshake. A client                     then derive encryption and MAC keys from the premaster
initiates an SSLv2 handshake by sending a ClientHello                   secret and the client and server random nonces. The de-
message, which includes a list of cipher suites csc                     tails of this derivation are not important to our attack. The


                                                                    3
USENIX Association                                                                          25th USENIX Security Symposium 691
client then sends ChangeCipherSpec and Finished                   Countermeasures. In order to protect against this attack,
messages. The Finished message authenticates all pre-             the decrypter must not leak information about the PKCS#1
vious handshake messages using the derived keys. The              v1.5 validity of the ciphertext. The ciphertext does not
server responds with its own ChangeCipherSpec and                 decrypt to a valid message, so the decrypter generates a
Finished messages.                                                fake plaintext and continues the protocol with this decoy.
   The two main details relevant to our attacks are:              The attacker should not be able to distinguish the resulting
   • The premaster secret is always 48 bytes long, inde-          computation from a correctly decrypted ciphertext.
     pendent of the chosen cipher suite. This is also true           In the case of SSL/TLS, the server generates a ran-
     for export cipher suites.                                    dom premaster secret to continue the handshake if the
                                                                  decrypted ciphertext is invalid. The client will not pos-
   • After receiving the ClientKeyExchange message,
                                                                  sess the session key to send a valid ClientFinished
     the server waits for the ClientFinished message,
                                                                  message and the connection will terminate.
     in order to authenticate the client.
2.3 Bleichenbacher’s attack                                       3     Breaking TLS with SSLv2
Bleichenbacher’s attack is a padding oracle attack—it             In this section, we describe our cross-protocol DROWN
exploits the fact that RSA ciphertexts should decrypt to          attack that uses an SSLv2 server as an oracle to efficiently
PKCS#1 v1.5-compliant plaintexts. If an implementation            decrypt TLS connections. The attacker learns the session
receives an RSA ciphertext that decrypts to an invalid            key for targeted TLS connections but does not learn the
PKCS#1 v1.5 plaintext, it might naturally leak this infor-        server’s private RSA key. We first describe our techniques
mation via an error message, by closing the connection,           using a generic SSLv2 oracle. In Section 4.1, we show
or by taking longer to process the error condition. This          how a protocol flaw in SSLv2 can be used to construct
behavior can leak information about the plaintext that can        such an oracle, and describe our general DROWN attack.
be modeled as a cryptographic oracle for the decryption           In Section 5, we show how an implementation flaw in
process. Bleichenbacher [8] demonstrated how such an              common versions of OpenSSL leads to a more powerful
oracle could be exploited to decrypt RSA ciphertexts.             oracle and describe our efficient special DROWN attack.
Algorithm. In the simplest attack scenario, the attacker             We consider a server accepting TLS connections from
has a valid PKCS#1 v1.5 ciphertext c0 that they wish to           clients. The connections are established using a secure,
decrypt to discover the message m0 . They have no access          state-of-the-art TLS version (1.0–1.2) and a TLS_RSA ci-
to the private RSA key, but instead have access to an             pher suite with a private key unknown to the attacker.
oracle O that will decrypt a ciphertext c and inform the             The same RSA public key as the TLS connections is
attacker whether the most significant two bytes match the         also used for SSLv2. For simplicity, our presentation will
required value for a correct PKCS#1 v1.5 padding:                 refer to the servers accepting TLS and SSLv2 connections
                                                                 as the same entity.
             1 if m = cd mod N starts with 0x00 02                   Our attacker is able to passively eavesdrop on traffic
   O(c) =
             0 otherwise.                                         between the client and server and record RSA-based TLS
                                                                  traffic. The attacker may or may not be also required
   If the oracle answers with 1, the attacker knows that
                                                                  to perform active man-in-the-middle interference, as ex-
2B ≤ m ≤ 3B − 1, where B = 28(m −2) . The attacker can
                                                                  plained below.
take advantage of RSA malleability to generate new can-
                                                                     The attacker can expect to decrypt one out of 1,000
didate ciphertexts for any s:
                                                                  intercepted TLS connections in our attack for typical pa-
         c = (c0 · se ) mod N = (m0 · s)e mod N                   rameters. This is a devastating threat in many scenarios.
The attacker queries the oracle with c. If the oracle re-         For example, a decrypted TLS connection might reveal
sponds with 0, the attacker increments s and repeats the          a client’s HTTP cookie or plaintext password, and an at-
previous step. Otherwise, the attacker learns that for            tacker would only need to successfully decrypt a single
some r, 2B ≤ m0 s − rN < 3B. This allows the attacker to          ciphertext to compromise the client’s account. In order
reduce the range of possible solutions to:                        to collect 1,000 TLS connections, the attacker might sim-
                                                                  ply wait patiently until sufficiently many connections are
                2B + rN            3B + rN                        recorded. A less patient attacker might use man-in-the-
                         ≤ m0 <
                   s                  s                           middle interference, as in the BEAST attack [14].
The attacker proceeds by refining guesses for s and r
values and successively decreasing the size of the interval       3.1    A generic SSLv2 oracle
containing m0 . At some point the interval will contain a         Our attacks make use of an oracle that can be queried on
single valid value, m0 . Bleichenbacher’s original paper          a ciphertext and leaks information about the decrypted
describes this process in further detail [8].                     plaintext; this abstractly models the information gained


                                                              4
692 25th USENIX Security Symposium                                                                       USENIX Association
from an SSLv2 server’s behavior. Our SSLv2 oracles re-                   3. The attacker then transforms the decrypted plaintext
veal many bytes of plaintext, enabling an efficient attack.                 back into the original plaintext, which is one of the
   Our cryptographic oracle O has the following function-                   collected TLS handshakes.
ality: O decrypts an RSA ciphertext c and responds with                  We describe the algorithmic improvements we use to
ciphertext validity based on the decrypted message m.                  make each of these steps efficient below.
The ciphertext is valid only if m starts with 0x00 02 fol-
lowed by non-null padding bytes, a delimiter byte 0x00,                3.2.1   Finding an SSLv2 conformant ciphertext
and a master_key mksecret of correct byte length k . We
                                                                       The first step for the attacker is to transform the original
call such a ciphertext SSLv2 conformant.
                                                                       TLS ClientKeyExchange message c0 from a TLS con-
   All of the SSLv2 padding oracles we instantiate give                formant ciphertext into an SSLv2 conformant ciphertext.
the attacker similar information about a PKCS#1 v1.5
conformant SSLv2 ciphertext:                                              For this task, we rely on the concept of trimmers, which
                                                                      were introduced by Bardou et al. [4]. Assume that the mes-
           mksecret if cd mod N = 00||02||PS||00||mksecret             sage m0 = c0 d mod N is divisible by a small number t. In
O(c) =                                                                 that case, m0 · t −1 mod N simply equals the natural num-
           0         otherwise.
                                                                       ber m0 /t. If we choose u ≈ t, and multiply the original
That is, the oracle O(c) will return the decrypted message             message by u · t −1 , the resulting number will lie near the
mksecret if it is queried on a PKCS#1 v1.5 conformant                  original message: m0 ≈ m0 /t · u.
SSLv2 ciphertext c corresponding to a correctly PKCS#1                    This method gives a good chance of generating a new
v1.5 padded encryption of mksecret . The attacker then                 SSLv2 conformant message. Let c0 be an intercepted
learns k + 3 bytes of m = cd mod N: the first two bytes               TLS conformant RSA ciphertext, and let m0 = cd0 mod N
are 00||02, and the last k + 1 bytes are 00||mksecret . The           be the plaintext. We select a multiplier s = u/t mod N =
length k of mksecret varies based on the cipher suite used            ut −1 mod N where u and t are coprime, compute the value
to instantiate the oracle. For export-grade cipher suites              c1 = c0 se mod N, and query O(c1 ). We will receive a
such as SSL_RSA_EXPORT_WITH_RC2_CBC_40_MD5, k                          response if m1 = m0 · u/t is SSLv2 conformant.
will be 5 bytes, so the attacker learns 8 bytes of m.                     As an example, let us assume a 2048-bit RSA cipher-
                                                                       text with k = 5, and consider the fraction u = 7,t = 8.
3.2 DROWN attack template
                                                                       The probability that c0 · u/t will be SSLv2 conformant is
Our attacker will use an SSLv2 oracle O to decrypt a                   1/7,774, so we expect to make 7,774 oracle queries be-
TLS ClientKeyExchange. The behavior of O poses two                     fore obtaining a positive response from O. Appendix A.1
problems for the attacker. First, a TLS key exchange ci-               gives more details on computing these probabilities.
phertext decrypts to a 48-byte premaster secret. But since
no SSLv2 cipher suites have 48-byte key strengths, this                3.2.2   Shifting known plaintext bytes
means that a valid TLS ciphertext is invalid to our oracle             Once we have obtained an SSLv2 conformant ciphertext
O. In order to apply Bleichenbacher’s attack, the attacker             c1 , the oracle has also revealed the k + 1 least significant
must transform the TLS ciphertext into a valid SSLv2 key               bytes (mksecret together with the delimiter byte 0x00) and
exchange message. Second, O is very restrictive, since                 two most significant 0x00 02 bytes of the SSLv2 confor-
it strictly checks the length of the unpadded message.                 mant message m1 . We would like to rotate these known
According to Bardou et al. [4], Bleichenbacher’s attack                bytes around to the right, so that we have a large block
would require 12 million queries to such an oracle.1                   of contiguous known most significant bytes of plaintext.
   Our attacker overcomes these problems by following                  In this section, we show that this can be accomplished
this generic attack flow:                                              by multiplying by some shift 2−r mod N. In other words,
  0. The attacker collects many encrypted TLS RSA key                  given an SSLv2 conformant ciphertext c1 = me1 mod N,
     exchange messages.                                                we can efficiently generate an SSLv2 conformant cipher-
  1. The attacker converts one of the intercepted TLS                  text c2 = me2 mod N where m2 = s · m1 · 2−r mod N and
     ciphertexts containing a 48-byte premaster secret to              we know several most significant bytes of m2 .
     an RSA PKCS#1 v1.5 encoded ciphertext valid to                        Let R = 28(k+1) and B = 28(m −2) . Abusing notation
     the SSLv2 oracle O.                                               slightly, let the integer m1 = 2 · B + PS · R + mksecret be
                                                                       the plaintext satisfying me1 = c1 mod N. At this stage, the
  2. Once the attacker has obtained a valid SSLv2 RSA
                                                                       k -byte integer mksecret is known and the m − k − 3-byte
     ciphertext, they can continue with a modified version
                                                                       integer PS is not.
     of Bleichenbacher’s attack, and decrypt the message
     after many more oracle queries.                                       Let m̃1 = 2 · B + mksecret be the known components of
                                                                       m1 , so m1 = m̃1 + PS · R. We can use this to compute a
  1 See Table 1 in [4]. The oracle is denoted with the term FFF.       new plaintext for which we know many most significant


                                                                   5
USENIX Association                                                                         25th USENIX Security Symposium 693
bytes. Consider the value:                                                       Record TLS 1.2 handshake
                                                                        TLS
                                                                        TLS                                                    TLS
                                                                                                                               TLS
        m1 · R−1 mod N = m̃1 · R−1 + PS mod N.                         Client
                                                                       Client                                                 Server
                                                                                                                              Server

The value of PS is unknown and consists of m − k − 3                     ClientHello

bytes. This means that the known value m̃1 · R−1 shares                                                        ServerHello
                                                                                                                 Certificate
                                                                                                               ServerHelloDone
most of its k + 3 most significant bytes with m1 · R−1 .               ClientKeyExchange

   Furthermore, we can iterate this process by finding a                   ClientHello
                                                                              Finished
new multiplier s such that m2 = s · m1 · R−1 mod N is also                                                      Certificate
                                                                                                                  Finished




                                                                                  ...
SSLv2 conformant. A randomly chosen s < 230 will work
with probability 2−25.4 . We can take use the bytes we have
already learned about m1 to efficiently compute such an s                        Chosen-ciphertext attack
with only 678 oracle queries in expectation for a 2048-bit                cRSA
                                                                                                                              SSLv2
                                                                                                                              SSLv2
                                                                                                                              Server
                                                                                                                              Server
RSA modulus. Appendix A.3 gives more details.                                                 ClientHello
                                                                                                                    ServerHello
3.2.3 Adapted Bleichenbacher iteration                                Attack
                                                                       Attack               ClientMasterKey
                                                                     Algorithm
                                                                     Algorithm
It is feasible for all of our oracles to use the previous                         c'RSA                             ServerVerify

technique to entirely recover a plaintext message. How-
ever, for our SSLv2 protocol oracle it is cheaper after a                          Bleichenbacher Oracle
few iterations to continue using Bleichenbacher’s original                 kRC2                    m?                         cRC2
attack. We can apply the original algorithm proposed by                                         Break
                                                                                                Break 40-bit
                                                                                                      40-bit
Bleichenbacher as described in Section 2.3.                                                     encryption
                                                                                                 encryption
   Each step obtains a message that starts with the required
0x00 02 bytes after two queries in expectation. Since we           Figure 2: SSLv2-based Bleichenbacher attack on TLS.
know the value of the k + 1 least significant bytes after         An attacker passively collects RSA ciphertexts from a
multiplying by any integer, we can query the oracle only           TLS 1.2 handshake, and then performs oracle queries
on multipliers that cause the (k + 1)st least significant         against a server that supports SSLv2 with the same public
byte to be zero. However, we cannot ensure that the                key to decrypt the TLS ciphertext.
padding string is entirely nonzero; for a 2048-bit modulus
this will hold with probability 0.37.
   For a 2048-bit modulus, the total expected number of            and carry out the rest of the TLS handshake using this
queries when using this technique to fully decrypt the             randomly generated key material.
plaintext is 2048 ∗ 2/0.37 ≈ 11, 000.                                 This allows an attacker to deduce the validity of RSA
                                                                   ciphertexts in the following manner:
4   General DROWN
In this section, we describe how to use any correct SSLv2           1. The attacker sends a ClientMasterKey message,
implementation accepting export-grade cipher suites as a               which contains an RSA ciphertext c0 and any
padding oracle. We then show how to adapt the techniques               choice of 11 clear key bytes for mkclear . The
described in Section 3.2 to decrypt TLS RSA ciphertexts.               server responds with a ServerVerify message,
                                                                       which contains the challenge encrypted using the
4.1 The SSLv2 export padding oracle                                    server_write_key.
SSLv2 is vulnerable to a direct message side channel
                                                                    2. The attacker performs an exhaustive search over
vulnerability exposing a Bleichenbacher oracle to the
                                                                       the possible values of the 5 bytes of the
attacker. The vulnerability follows from three prop-
                                                                       master_key mksecret , computes the correspond-
erties of SSLv2. First, the server immediately re-
                                                                       ing server_write_key, and checks whether the
sponds with a ServerVerify message after receiving the
                                                                       ServerVerify message decrypts to challenge.
ClientMasterKey message, which includes the RSA ci-
                                                                       One value should pass this check; call it mk0 . Re-
phertext, without waiting for the ClientFinished mes-
                                                                       call that if the RSA plaintext was valid, mk0 is the
sage that proves the client knows the RSA plaintext. Sec-
                                                                       unpadded data in the RSA plaintext cd0 . Otherwise,
ond, when choosing 40-bit export RC2 or RC4 as the sym-
                                                                       mk0 is a randomly generated sequence of 5 bytes.
metric cipher, only 5 bytes of the master_key (mksecret )
are sent encrypted using RSA, and the remaining 11 bytes            3. The attacker re-connects to the server with the
are sent in cleartext. Third, a server implementation that             same RSA ciphertext c0 . The server responds
correctly implements the anti-Bleichenbacher counter-                  with another ServerVerify message that contains
measure and receives an RSA key exchange message with                  the current challenge encrypted using the current
invalid padding will generate a random premaster secret                server_write_key. If the decrypted RSA cipher-


                                                               6
694 25th USENIX Security Symposium                                                                             USENIX Association
     text was valid, the attacker can use mk0 to decrypt a             ServerVerify messages to deduce ciphertext va-
     correct challenge value from the ServerVerify                     lidity as described in the previous section. For each
     message. Otherwise, if the ServerVerify message                   queried RSA ciphertext, the attacker must perform
     does not decrypt to challenge, the RSA ciphertext                 a brute force attack on the weak symmetric cipher.
     was invalid, and mk0 must have been random.                       The attacker expects to obtain a valid SSLv2 cipher-
   Thus we can instantiate an oracle OSSLv2-export using               text after roughly 10,000 oracle queries, or 20,000
the procedure above; each oracle query requires two                    connections to the server.
server connections and 240 decryption attempts in the               2. Once the attacker has obtained a valid SSLv2 RSA
simplest case. For each oracle call OSSLv2-export (c), the             ciphertext c1 = me1 , they use the shifting technique
attacker learns whether c is valid, and if so, learns the              explained in Section 3.2.2 to find an integer s1 such
two most significant bytes 0x00 02, the sixth least sig-               that m2 = m1 · 2−40 · s1 is also SSLv2 conformant.
nificant 0x00 delimiter byte, and the value of the 5 least             Appendix A.4 contains more details on this step.
significant bytes of the plaintext m.
                                                                    3. The attacker then applies the shifting technique again
4.2 TLS decryption attack                                              to find another integer s2 such that m3 = m2 · 2−40 · s2
In this section, we describe how the oracle described in               is also SSLv2 conformant.
Section 4.1 can be used to carry out a feasible attack to           4. They then search for yet another integer s3 such that
decrypt passively collected TLS ciphertexts.                           m3 · s3 is also SSLv2 conformant.
   As described in Section 3, we consider a server that
accepts TLS connections from clients using an RSA pub-              5. Finally, the attacker can continue with our adapted
lic key that is exposed via SSLv2, and an attacker who is              Bleichenbacher iteration technique described in Sec-
able to passively observe these connections.                           tion 3.2.3, and decrypts the message after an ex-
   We also assume the server supports export cipher suites             pected 10,000 additional oracle queries, or 20,000
for SSLv2. This can happen for two reasons. First, the                 connections to the server.
same server operators that fail to follow best practices in         6. The attacker can then transform the decrypted plain-
disabling SSLv2 [40] may also fail to follow best prac-                text back into the original plaintext, which is one of
tices by supporting export cipher suites. Alternatively,               the 1,000 intercepted TLS handshakes.
the server might be running a version of OpenSSL prior
                                                                  The rationale behind the different phases. Bleichen-
to January 2016, in which case it is vulnerable to the
                                                                  bacher’s original algorithm requires a conformant mes-
OpenSSL cipher suite selection bug described in Sec-
                                                                  sage m0 , and a multiplier s1 such that m1 = m0 · s1 is also
tion 7, and an attacker may negotiate a cipher suite of his
                                                                  conformant. Naïvely, it would appear we can apply the
choice independent of the server configuration.
                                                                  same algorithm here, after completing Phase 1. However,
   The attacker needs access to computing power suffi-
                                                                  the original algorithm expects s1 to be of size about 224 .
cient to perform a 250 time attack, mostly brute forcing
                                                                  This is not the case when we use fractions for s1 , as the
symmetric key encryption. After our optimizations, this
                                                                  integer s1 = ut −1 mod N will be the same size as N.
can be done with a one-time investment of a few thousand
                                                                     Therefore, our approach is to find a conformant mes-
dollars of GPUs, or in a few hours for a few hundred
                                                                  sage for which we know the 5 most significant bytes; this
dollars in the cloud. Our cost estimates are described
                                                                  will happen after multiple rotations and this message will
in Section 4.3.
                                                                  be m3 . After finding such a message, finding s3 such that
4.2.1 Constructing the attack                                     m4 = m3 · s3 is also conformant becomes trivial. From
The attacker can exploit the SSLv2 vulnerability follow-          there, we can finally apply the adapted Bleichenbacher
ing the generic attack outline described in Section 3.2,          iteration technique as described in Appendix A.5.
consisting of several distinct phases:
                                                                  4.2.2 Attack performance
 0. The attacker passively collects 1,000 TLS hand-               The attacker wishes to minimize three major costs in the
    shakes from connections using RSA key exchange.               attack: the number of recorded ciphertexts from the victim
 1. They then attempt to convert the intercepted TLS              client, the number of connections to the victim server, and
    ciphertexts containing a 48-byte premaster secret             the number of symmetric keys to be brute forced. The
    to valid RSA PKCS#1 v1.5 encoded ciphertexts                  requirements for each of these elements are governed
    containing five-byte messages using the fractional            by the set of fractions to be multiplied with each RSA
    trimmers described in Section 3.2.1, and querying             ciphertext in the first phase, as described in Section 3.2.1.
    OSSLv2-export . The attacker sends the modified ci-              Table 1 highlights a few choices for F and the resulting
    phertexts to the server using fresh SSLv2 connec-             performance metrics for 2048-bit RSA keys. Appendix A
    tions with weak symmetric ciphers and uses the                provides more details on the derivation of these numbers


                                                              7
USENIX Association                                                                    25th USENIX Security Symposium 695
 Optimizing       Cipher-    |F|       SSLv2       Offline           We experimentally evaluated our optimized implemen-
        for          texts         connections      work          tation on a local cluster and in the cloud. We used it to
                                                                  execute a full attack of 249.6 tested keys on each platform.
 offline work      12,743     1          50,421      249.64       The required number of keys to test during the attack is
 offline work       1,055    10          46,042      250.63       a random variable, distributed geometrically, with an ex-
 compromise         4,036     2          41,081      249.98       pectation that ranges between 249.6 and 252.5 depending
 online work        2,321     3          38,866      251.99       on the choice of optimization parameters. We treat a full
 online work          906     8          39,437      252.25       attack as requiring 249.6 tested keys overall.

Table 1: 2048-bit Bleichenbacher attack complexity.               Hashcat. Hashcat [20] is an open source optimized
The cost to decrypt one ciphertext can be adjusted by             password-recovery tool. The Hashcat developers allowed
choosing the set of fractions F the attacker applies to           us to use their GPU servers for our attack evaluation. The
each of the passively collected ciphertexts in the first          servers contain a total of 40 GPUs: 32 Nvidia GTX 980
step of the attack. This choice affects several parameters:       cards, and 8 AMD R9 290X cards. The value of this
the number of these collected ciphertexts, the number of          equipment is roughly $18,040. Our full attack took less
connections the attacker makes to the SSLv2 server, and           than 18 hours to complete on the Hashcat servers, with
the number of offline decryption operations.                      the longest single instance taking 17h9m.
                                                                  Amazon EC2. We also ran our optimized GPU code
 Key size    Phase 1     Phases 2–5       Total    Offline        on the Amazon Elastic Compute Cloud (EC2) service.
                                        queries     work          We used a cluster composed of 200 variable-price “spot”
                                                                  instances: 150 g2.2xlarge instances, each containing
     1024        4,129         4,132      8,261      250.01       one high-performance NVIDIA GPU with 1,536 CUDA
     2048        6,919        12,468     19,387      250.76       cores and 50 g2.8xlarge instances, each containing four
     4096       18,286        62,185     80,471      252.16       of these GPUs. When we ran our experiments in January
                                                                  2016, the average spot rates we paid were $0.09/hr and
Table 2: Oracle queries required by our attack. In                $0.83/hr respectively. Our full attack finished in under 8
Phase 1, the attacker queries the oracle until an SSLv2           hours including startup and shutdown for a cost of $440.
conformant ciphertext is found. In Phases 2–5, the at-
tacker decrypts this ciphertext using leaked plaintext.           4.4    OpenSSL SSLv2 cipher suite selection bug
These numbers minimize total queries. In our attack,              General DROWN is a protocol flaw, but the population
an oracle query represents two server connections.                of vulnerable hosts is increased due to a bug in OpenSSL
                                                                  that causes many servers to erroneously support SSLv2
                                                                  and export ciphers even when configured not to. The
and other optimization choices. Table 2 gives the expected        OpenSSL team intended to disable SSLv2 by default in
number of Bleichenbacher queries for different RSA key            2010, with a change that removed all SSLv2 cipher suites
sizes, when minimizing total oracle queries.                      from the default list of ciphers offered by the server [36].
                                                                  However, the code for the protocol itself was not re-
4.3 Implementing general DROWN with GPUs                          moved in standard builds and SSLv2 itself remained en-
The most computationally expensive part of our general            abled. We discovered a bug in OpenSSL’s SSLv2 ci-
DROWN attack is breaking the 40-bit symmetric key, so             pher suite negotiation logic that allows clients to select
we developed a highly optimized GPU implementation of             SSLv2 cipher suites even when they are not explicitly
this brute force attack. Our first naïve GPU implementa-          offered by the server. We notified the OpenSSL team of
tion performed around 26MH/s, where MH denotes the                this vulnerability, which was assigned CVE-2015-3197.
time required for testing one million possible values of          The problem was fixed in OpenSSL releases 1.0.2f and
mksecret . Our optimized implementation runs at a final           1.0.1r [36].
speed of 515MH/s, a speedup factor of 19.8.
   We obtained our improvements through a number of               5     Special DROWN
optimizations. For example, our original implementation           We discovered multiple vulnerabilities in recent (but not
ran into a communication bottleneck in the PCI-E bus              current) versions of the OpenSSL SSLv2 handshake code
in transmitting candidate keys from CPU to GPU, so we             that create even more powerful Bleichenbacher oracles,
removed this bottleneck by generating key candidates              and drastically reduce the amount of computation required
on the GPU itself. We optimized memory management,                to implement our attacks. The vulnerabilities, designated
including storing candidate keys and the RC2 permutation          CVE-2016-0703 and CVE-2016-0704, were present in
table in constant memory, which is almost as fast as a            the OpenSSL codebase from at least the start of the reposi-
register, instead of slow global memory.                          tory, in 1998, until they were unknowingly fixed on March


                                                              8
696 25th USENIX Security Symposium                                                                       USENIX Association
4, 2015 by a patch [28] designed to correct an unrelated                 k -byte encrypted key, they recover the k plaintext bytes
problem [11]. By adapting DROWN to exploit this spe-                     by repeating the key recovery attack from above. Thus
cial case, we can significantly cut both the number of                   our oracle OSSLv2-extra-clear (c) requires one connection to
connections and the computational work required.                         determine whether c is valid. After k connections, the
                                                                         attacker additionally learns the k least significant bytes of
5.1 The OpenSSL “extra clear” oracle                                     m. We model this as a single oracle call, but the number of
Prior to the fix, OpenSSL servers improperly al-                         server connections will vary depending on the response.
lowed the ClientMasterKey message to contain
clear_key_data bytes for non-export ciphers. When                        5.2     MITM attack against TLS
such bytes are present, the server substitutes them for                  Special DROWN is fast enough that it can decrypt a TLS
bytes from the encrypted key. For example, consider the                  premaster secret online, during a connection handshake.
case that the client chooses a 128-bit cipher and sends                  A man-in-the-middle attacker can use it to compromise
a 16-byte encrypted key k[1], k[2], . . . , k[16] but, contrary          connections between modern browsers and TLS servers—
to the protocol specification, includes 4 null bytes of                  even those configured to prefer non-RSA cipher suites.
clear_key_data. Vulnerable OpenSSL versions will                            The MITM attacker impersonates the server and sends
construct the following master_key:                                      a ServerHello message that selects a cipher suite with
    [00 00 00 00 k[1] k[2] k[3] k[4] . . . k[9] k[10] k[11] k[12]]       RSA as the key-exchange method. Then, the attacker uses
   This enables a straightforward key recovery attack                    special DROWN to decrypt the premaster secret. The
against such versions. An attacker that has intercepted                  main difficulty is completing the decryption and produc-
an SSLv2 connection takes the RSA ciphertext of the                      ing a valid ServerFinished message before the client’s
encrypted key and replays it in non-export handshakes to                 connection times out. Most browsers will allow the hand-
the server with varying lengths of clear_key_data. For                   shake to last up to one minute [1].
a 16-byte encrypted key, the attacker starts with 15 bytes                  The attack requires targeting an average of 100 connec-
of clear key, causing the server to use the master_key:                  tions, only one of which will be attacked, probabilistically.
                                                                         The simplest way for the attacker to facilitate this is to use
    [00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 k[1]]
                                                                         JavaScript to cause the client to connect repeatedly to the
  The attacker can brute force the first byte of the en-                 victim server, as described in Section 3. Each connection
crypted key by finding the matching ServerVerify mes-                    is tested against the oracle with only small number of
sage among 256 possibilities. Knowing k[1], the attacker                 fractions, and the attacker can discern immediately when
makes another connection with the same RSA ciphertext                    he receives a positive response from the oracle.
but 14 bytes of clear key, resulting in the master_key:                     Note that since the decryption must be completed on-
    [00 00 00 00 00 00 00 00 00 00 00 00 00 00 k[1] k[2]]                line, the Leaky Export oracle cannot be used, and the
   The attacker can now easily brute force k[2]. With                    attack uses only the Extra Clear oracle.
only 15 probe connections and an expected 15 · 128 =                     5.2.1   Constructing the attack
1, 920 trial encryptions, the attacker learns the entire
master_key for the recorded session.                                     We will use SSL_DES_192_EDE3_CBC_WITH_MD5 as the
   As this oracle is obtained by improperly sending unex-                cipher suite, allowing the attacker to recover 24 bytes of
pected clear-key bytes, we call it the Extra Clear oracle.               key at a time. The attack works as follows:
   This session key-recovery attack can be directly con-                   0. The attacker causes the victim client to connect re-
verted to a Bleichenbacher oracle. Given a candidate                          peatedly to the victim server, with at least 100 con-
ciphertext and symmetric key length k , the attacker sends                   nections.
the ciphertext with k known bytes of clear_key_data.
The oracle decision is simple:                                             1. The attacker uses the fractional trimmers as de-
                                                                              scribed in Section 3.2.1 to convert one of the TLS
   • If the ciphertext is valid, the ServerVerify mes-
                                                                              ciphertexts into an SSLv2 conformant ciphertext c0 .
     sage will reflect a master_key consisting of those
     k known bytes.                                                       2. Once the attacker has obtained a valid SSLv2 cipher-
   • If the ciphertext is invalid, the master_key will be                     text c1 , they repeatedly use the shifting technique
     replaced with k random bytes (by following the                          described in Section 3.2.2 to rotate the message by
     countermeasure against the Bleichenbacher attack),                       25 bytes each iteration, learning 27 bytes with each
     resulting in a different ServerVerify message.                           shift. After several iterations, they have learned the
                                                                              entire plaintext.
   This oracle decision requires one connection to the
server and one ServerVerify computation. After the                         3. The attacker then transforms the decrypted SSLv2
attacker has found a valid ciphertext corresponding to a                      plaintext into the decrypted TLS plaintext.


                                                                     9
USENIX Association                                                                           25th USENIX Security Symposium 697
   Using 100 fractional trimmers, this more efficient ora-                     cases (1) and (2) by performing an exhaustive search
cle attack allows the attacker to recover one in 100 TLS                       over the five bytes of k, and checking whether any of the
session keys using only about 27,000 connections to the                        resulting values for mk correctly decrypts the observed
server, as described in Appendix A.6. The computation                          ServerVerify message.
cost is so low that we can complete the full attack on a                          As this oracle leaks information when using export
single workstation in under one minute.                                        ciphers, we have named it the Leaky Export oracle.
                                                                                  In conclusion, OSSLv2-export-leaky allows an attacker to
5.3 The OpenSSL “leaky export” oracle
                                                                               obtain a valid oracle response for all ciphertexts which de-
In addition to the extra clear implementation bug, the                         crypt to a correctly-padded plaintext of any length. This
same set of OpenSSL versions also contain a separate bug,                      is in contrary to the previous oracles OSSLv2-extra-clear and
where they do not follow the correct algorithm for their                       OSSLv2-export , which required the plaintext to be of a spe-
implementation of the Bleichenbacher countermeasure.                           cific length. Each oracle query to OSSLv2-export-leaky re-
We now describe this faulty implementation:                                    quires one connection to the server and 241 offline work.
   • The SSLv2 ClientKeyExchange message contains
                                                                               Combining the two oracles. The attacker can use the
     the mkclear bytes immediately before the ciphertext c.
                                                                               Extra Clear and Leaky Export oracles together in order to
     Let p be the buffer starting at the first mkclear byte.
                                                                               reduce the number of queries required for the TLS decryp-
   • Decrypt c in place. If the decryption operation suc-                      tion attack. They first test a TLS conformant ciphertext for
     ceeds, and c decrypted to a plaintext of a correct                        divisors using the Leaky Export oracle, then use fractions
     padded length, p now contains the 11 mkclear bytes                        dividing the plaintext with both oracles. Once the attacker
     followed by the 5 mksecret bytes.                                         has obtained a valid SSLv2 ciphertext c1 , they repeatedly
   • If c decrypted to an unpadded plaintext k of incorrect                    use the shifting technique described in Section 3.2.2 to
     length, the decryption operation overwrites the first                     rotate the message by 25 bytes each iteration while choos-
      j = min(|k|, 5) bytes of c with the first j bytes of k.                  ing 3DES as the symmetric cipher, learning 27 bytes with
                                                                               each shift. After several iterations, they have learned the
   • If c is not SSLv2 conformant and the decryption                           entire plaintext, using 6,300 queries (again for a 2048-bit
     operation failed, randomize the first five bytes of p,                    modulus). This brings the overall number of queries for
     which are the first five bytes of mkclear .                               this variant of the attack to 900 + 16 ∗ 4 + 6, 300 = 7, 264.
  This behavior allows the attacker to distinguish be-                         These parameter choices are not necessarily optimal. We
tween these three cases. Suppose the attacker sends 11                         give more details in Appendix A.7.
null bytes as mkclear . Then these are the possible cases:
                                                                               6   Extending the attack to QUIC
  1. c decrypts to a correctly padded plaintext k of
     the expected length, 5 bytes. Then the following                          DROWN can also be extended to a feasible-time man-in-
     master_key will be constructed:                                           the-middle attack against QUIC [26]. QUIC [10, 39] is a
                                                                               recent cryptographic protocol designed and implemented
     [00 00 00 00 00 00 00 00 00 00 00 k[1] k[2] k[3] k[4] k[5]]
                                                                               by Google that is intended to reduce the setup time to
  2. c decrypts to a correctly padded plaintext k of a                         establish a secure connection while providing security
     wrong length. Let r be the five random bytes the                          guarantees analogous to TLS. QUIC’s security relies on
     server generated. The yielded master_key will be:                         a static “server config” message signed by the server’s
  [r[1] r[2] r[3] r[4] r[5] 00 00 00 00 00 00 k[1] k[2] k[3] k[4] k[5]]        public key. Jager et al. [26] observe that an attacker who
                                                                               can forge a signature on a malicious QUIC server config
     when |k| ≥ 5. If |k| < 5, the server substitutes the                      once would be able to impersonate the server indefinitely.
     first |k| bytes of c with the first |k| bytes of k. Using                 In this section, we show an attacker with significant re-
     |k| = 3 as an example, the master_key will be:                            sources would be able to mount such an attack against a
  [r[1] r[2] r[3] r[4] r[5] 00 00 00 00 00 00 k[1] k[2] k[3] c[4] c[5]]        server whose RSA public keys is exposed via SSLv2.
  3. c is not SSLv2 conformant, and hence the decryption                          A QUIC client receives a “server config” message,
     operation failed. The resulting master_key will be:                       signed by the server’s public key, which enumerates con-
                                                                               nection parameters: a static elliptic curve Diffie-Hellman
  [r[1] r[2] r[3] r[4] r[5] 00 00 00 00 00 00 c[1] c[2] c[3] c[4] c[5]]
                                                                               public value, and a validity period. In order to mount a
The attacker detects case (3) by performing an exhaus-                         man-in-the-middle attack against any client, the attacker
tive search over the 240 possibilities for r, and checking                     wishes to generate a valid server config message contain-
whether any of the resulting values for the master_key                         ing their own Diffie-Hellman value, and an expiration
correctly decrypts the observed ServerVerify message.                          date far in the future.
If no r value satisfies this property, then cd starts with                        The attacker needs to present a forged QUIC config to
bytes 0x00 02. The attacker then distinguishes between                         the client in order to carry out a successful attack. This is


                                                                          10
698 25th USENIX Security Symposium                                                                                     USENIX Association
    Pro-    Attack    Oracle     SSLv2     Offline   See            would require 829,142 GPU days. Our experimental GPU
   tocol      type              connec-     work       §            hardware retails for $400. An investment of $10 million
                                  tions                             to purchase 25,000 GPUs would reduce the wall clock
   TLS     Decrypt    SSLv2      41, 081       250    4.2           time for the attack to 33 days.
   TLS     Decrypt    Special     7, 264       251    5.3              Our implementation run on Amazon EC2 processed
   TLS      MITM      Special    27, 000       215    5.2           about 174 billion keys per g2.2xlarge instance-hour,
  QUIC      MITM      SSLv2          225       265    6.1           so at a cost of $0.09/instance-hour the full attack would
  QUIC      MITM      Special        225       225    6.2           cost $9.5 million and could be parallelized to Amazon’s
  QUIC      MITM      Special        217       258    6.2           capacity.

Table 3: Summary of attacks. “Oracle” denotes the ora-              6.2   Optimized QUIC signature forgery based
cle required to mount each attack, which also implies the                 on special DROWN
vulnerable set of SSLv2 implementations. SSLv2 denotes              For targeted servers that are vulnerable to special
any SSLv2 implementation, while “Special” denotes an                DROWN, we are unaware of a way to combine the two
OpenSSL version vulnerable to special DROWN.                        special DROWN oracles; the attacker would have to
                                                                    choose a single oracle which minimizes his subjective
                                                                    cost. For the Extra Clear oracle, there is only negligi-
straightforward, since QUIC discovery may happen over               ble computation per oracle query, so the computational
non-encrypted HTTP [19]. The server does not even need              cost for the first phase is 225 . For the Leaky Export or-
to support QUIC at all: an attacker could impersonate               acle, as explained below, the required offline work is
the attacked server over an unencrypted HTTP connec-                258 , and the required number of server connections is
tion and falsely indicate that the server supports QUIC.            roughly 145, 573. Both oracles appear to bring this at-
The next time the client connects to the server, it will            tack well within the means of a moderately provisioned
attempt to connect using QUIC, allowing the attacker to             adversary.
present the forged “server config” message and execute
the attack [26].                                                    Mounting the attack using Leaky Export. For a 2048-
                                                                    bit RSA modulus, the probability of a random mes-
6.1 QUIC signature forgery attack based on                          sage being conformant when querying OSSLv2-export-leaky
    general DROWN                                                   is Prnd ≈ (1/256)2 ∗ (255/256)8 ∗ (1 − (255/256)246 ) ≈
The attack proceeds much as in Section 3.2, except that             2−17 . Therefore, to compute cd when c is not SSLv2 con-
some of the optimizations are no longer applicable, mak-            formant, the attacker randomly generates values for s and
ing the attack more expensive.                                      tests c · se against the Leaky Export oracle. After roughly
   The first step is to discover a valid, PKCS conformant           217 ≈ 131, 000 queries, they obtain a positive response,
SSLv2 ciphertext. In the case of TLS decryption, the                and learn that cd · s starts with bytes 0x00 02.
input ciphertext was PKCS conformant to begin with; this               Naïvely, it would seem the attacker can then ap-
is not the case for the QUIC message c0 . Thus for the first        ply one of the techniques presented in this work, but
phase, the attacker iterates through possible multiplier            OSSLv2-export-leaky does not provide knowledge of any
values s until they randomly encounter a valid SSLv2                least significant plaintext bytes when the plaintext length
message in c0 · sd . For 2048-bit RSA keys, the probability         is not at most the correct one. Instead, the attacker pro-
of this random event is Prnd ≈ 2−25 ; see Section 3.2.              ceeds directly according to the algorithm presented in [4].
   Once the first SSLv2 conformant message is found, the            Referring to Table 1 in [4], OSSLv2-export-leaky is denoted
attacker proceeds with the signature forgery as they would          with the term FFT, as it returns a positive response for a
in Step 2 of the TLS decryption attack. The required                correctly padded plaintext of any length, and the median
number of oracle queries for this step is roughly 12,468            number of required queries for this oracle is 14,501. This
for 2048-bit RSA keys.                                              number of queries is dominated by the 131,000 queries
                                                                    the attacker has already executed. As each query requires
Attack cost. The overall oracle query cost is dominated
                                                                    testing roughly 241 keys, the required offline work is ap-
by the 225 ≈ 34 million expected queries in the first phase,
                                                                    proximately 258 .
above. At a rate of 388 queries/second, the attacker would
finish in one day; at a rate of 12 queries/second they would        Future changes to QUIC. In addition to disabling
finish in one month.                                                QUIC support for non-whitelisted servers, Google have
   For the SSLv2 export padding oracle, the offline com-            informed us that they plan to change the QUIC standard,
putation to break a 40-bit symmetric key for each query             so that the “server config” message will include a client
requires iterating over 265 keys. At our optimized GPU              nonce to prove freshness. They also plan to limit QUIC
implementation rate of 515 million keys per second, this            discovery to HTTPS.


                                                               11
USENIX Association                                                                     25th USENIX Security Symposium 699
                                             All certificate                                   Trusted certificates
                                                 SSLv2              Vulnerable                        SSLv2           Vulnerable
    Protocol          Port    SSL/TLS                                             SSL/TLS
                                                support                key                           support             key
    SMTP                25     3,357 K      936 K (28%)         1,666 K (50%)       1,083 K     190 K (18%)        686 K (63%)
    POP3               110     4,193 K      404 K (10%)         1,764 K (42%)       1,787 K     230 K (13%)      1,031 K (58%)
    IMAP               143     4,202 K      473 K (11%)         1,759 K (42%)       1,781 K     223 K (13%)      1,022 K (57%)
    HTTPS              443    34,727 K    5,975 K (17%)        11,444 K (33%)      17,490 K   1,749 K (10%)      3,931 K (22%)
    SMTPS              465     3,596 K      291 K (8%)          1,439 K (40%)       1,641 K      40 K (2%)         949 K (58%)
    SMTP               587     3,507 K      423 K (12%)         1,464 K (42%)       1,657 K     133 K (8%)         986 K (59%)
    IMAPS              993     4,315 K      853 K (20%)         1,835 K (43%)       1,909 K     260 K (14%)      1,119 K (59%)
    POP3S              995     4,322 K      884 K (20%)         1,919 K (44%)       1,974 K     304 K (15%)      1,191 K (60%)
    (Alexa Top 1M)     443       611 K       82 K (13%)             152 K (25%)       456 K       38 K (8%)           109 K (24%)

Table 4: Hosts vulnerable to general DROWN. We performed Internet-wide scans to measure the number of hosts
supporting SSLv2 on several different protocols. A host is vulnerable to DROWN if its public key is exposed anywhere
via SSLv2. Overall vulnerability to DROWN is much larger than support for SSLv2 due to widespread reuse of keys.


7     Measurements                                                  ured with support for the largest possible set of protocol
We performed Internet-wide scans to analyze the number              versions and cipher suites, under the assumption that even
of systems vulnerable to DROWN. A host is directly                  bad or obsolete encryption is better than plaintext [9]. The
vulnerable to general DROWN if it supports SSLv2. Sim-              other email ports ranged from 8% for SMTPS to 20% for
ilarly, a host is directly vulnerable to special DROWN if           POP3S and IMAPS. We found 17% of all HTTPS servers,
it supports SSLv2 and has the extra clear bug (which also           and 10% of those with a browser-trusted certificate, are
implies the leaky export bug). These directly vulnerable            directly vulnerable to general DROWN.
hosts can be used as oracles to attack any other host with          OpenSSL SSLv2 cipher suite selection bug. We dis-
the same key. Hosts that do not support SSLv2 are still             covered that OpenSSL servers do not respect the cipher
vulnerable to general or special DROWN if their RSA key             suites advertised in the SSLv2 ServerHello message.
pair is exposed by any general or special DROWN oracle,             That is, a malicious client can select an arbitrary cipher
respectively. The oracles may be on an entirely different           suite in the ClientMasterKey message, regardless of
host or port. Additionally, any host serving a browser-             the contents of the ServerHello, and force the use of
trusted certificate is vulnerable to a special DROWN man-           export cipher suites even if they are explicitly disabled in
in-the-middle if any name on the certificate appears on             the server configuration. To fully detect SSLv2 oracles,
any other certificate containing a key that is exposed by a         we configured our scanner to ignore the ServerHello
special DROWN oracle.                                               cipher list. The cipher selection bug helps explain the
    We used ZMap [16] to perform full IPv4 scans on                 wide support for SSLv2—the protocol appeared disabled,
eight different ports during late January and February              but non-standard clients could still complete handshakes.
2016. We examined port 443 (HTTPS), and common
email ports 25 (SMTP with STARTTLS), 110 (POP3                      Widespread public key reuse. Reuse of RSA key ma-
with STARTTLS), 143 (IMAP with STARTTLS), 465                       terial across hosts and certificates is widespread [21, 23].
(SMTPS), 587 (SMTP with STARTTLS), 993 (IMAPS),                     Often this is benign: organizations may issue multiple
and 995 (POP3S). For each open port, we attempted three             TLS certificates for distinct domains with the same public
complete handshakes: one normal handshake with the                  key in order to simplify use of TLS acceleration hardware
highest available SSL/TLS version; one SSLv2 handshake              and load balancing. However, there is also evidence that
requesting an export RC2 cipher suite; and one SSLv2                system administrators may not entirely understand the
handshake with a non-export cipher and sixteen bytes of             role of the public key in certificates. For example, in the
plaintext key material sent during key exchange, which              wake of the Heartbleed vulnerability, a substantial frac-
we used to detect if a host has the extra clear bug.                tion of compromised certificates were reissued with the
    We summarize our general DROWN results in Table 4.              same public key [15]. The number of hosts vulnerable to
The fraction of SSL/TLS hosts that directly supported               DROWN rises significantly when we take RSA key reuse
SSLv2 varied substantially across ports. 28% of SMTP                into account. For HTTPS, 17% of hosts are vulnerable
servers on port 25 supported SSLv2, likely due to the               to general DROWN because they support both TLS and
opportunistic encryption model for email transit. Since             SSLv2 on the HTTPS port, but 33% are vulnerable when
SMTP fails-open to plaintext, many servers are config-              considering RSA keys used by another service.


                                                               12
700 25th USENIX Security Symposium                                                                          USENIX Association
                                            Any certificate                                    Trusted certificates
                                        Special DROWN              Vulnerable                    Vulnerable           Vulnerable
    Protocol         Port   SSL/TLS                                                SSL/TLS
                                            oracles                   key                           key                 name
    SMTP              25      3,357 K        855 K (25%)        896 K (27%)         1,083 K      305 K (28%)       398 K (37%)
    POP3             110      4,193 K        397 K (9%)         946 K (23%)         1,787 K      485 K (27%)       674 K (38%)
    IMAP             143      4,202 K        457 K (11%)        969 K (23%)         1,781 K      498 K (30%)       690 K (39%)
    HTTPS            443     34,727 K      4,029 K (12%)      9,089 K (26%)        17,490 K    2,523 K (14%)     3,793 K (22%)
    SMTPS            465      3,596 K        334 K (9%)         765 K (21%)         1,641 K      430 K (26%)       630 K (38%)
    SMTP             587      3,507 K        345 K (10%)        792 K (23%)         1,657 K      482 K (29%)       667 K (40%)
    IMAPS            993      4,315 K        892 K (21%)      1,073 K (25%)         1,909 K      602 K (32%)       792 K (42%)
    POP3S            995      4,322 K        897 K (21%)      1,108 K (26%)         1,974 K      641 K (32%)       835 K (42%)
    (Alexa Top 1M)   443        611 K         22 K (4%)            52 K (9%)          456 K       33 K (7%)           85 K (19%)

Table 5: Hosts vulnerable to special DROWN. A server is vulnerable to special DROWN if its key is exposed by a
host with the CVE-2016-0703 bug. Since the attack is fast enough to enable man-in-the-middle attacks, a server is also
vulnerable (to impersonation) if any name in its certificate is found in any trusted certificate with an exposed key.


Special DROWN. As shown in Table 5, 9.1 M HTTPS                    Cross-protocol attacks. Jager et al. [26] showed that a
servers (26%) are vulnerable to special DROWN, as                  cross-protocol Bleichenbacher RSA padding oracle attack
are 2.5 M HTTPS servers with browser-trusted certifi-              is possible against the proposed TLS 1.3 standard, in spite
cates (14%). 66% as many HTTPS hosts are vulnera-                  of the fact that TLS 1.3 does not include RSA key ex-
ble to special DROWN as to general DROWN (70% for                  change, if server implementations use the same certificate
browser-trusted servers). While 2.7 M public keys are              for previous versions of TLS and TLS 1.3. Wagner and
vulnerable to general DROWN, only 1.1 M are vulnerable             Schneier [41] developed a cross-cipher suite attack for
to special DROWN (41% as many). Vulnerability among                SSLv3, in which an attacker could reuse a signed server
Alexa Top Million domains is also lower, with only 9%              key exchange message in a later exchange with a different
of domains vulnerable (7% for browser-trusted domains).            cipher suite. Mavrogiannopoulos et al. [32] developed a
   Since special DROWN enables active man-in-the-                  cross-cipher suite attack allowing an attacker to use ellip-
middle attacks, any host serving a browser-trusted certifi-        tic curve Diffie-Hellman as prime field Diffie-Hellman.
cate with at least one name that appears on any certificate        Attacks on export-grade cryptography. Recently, the
with an RSA key exposed by a special DROWN oracle                  FREAK [5] and Logjam [1] attacks allowed an active
is vulnerable to an impersonation attack. Extending our            attacker to downgrade a connection to export-grade RSA
search to account for certificates with shared names, we           and Diffie-Hellman, respectively. DROWN exploits
find that 3.8 M (22%) hosts with browser-trusted certifi-          export-grade symmetric ciphers, completing the export-
cates are vulnerable to man-in-the-middle attacks, as well         grade cryptography attack trifecta.
as 19% of the browser-trusted domains in the Alexa Top
Million.                                                           9     Discussion
                                                                   9.1     Implications for modern protocols
8     Related work
                                                                   Although the protocol flaws in SSLv2 enabling DROWN
TLS has had a long history of implementation flaws and             are not present in recent TLS versions, many modern pro-
protocol attacks [2,3,7,14,15,35,38]. We discuss relevant          tocols meet a subset of the requirements to be vulnerable
Bleichenbacher and cross-protocol attacks below.                   to a DROWN-style attack. For example:
Bleichenbacher’s attack. Bleichenbacher’s adaptive                     1. RSA key exchange. TLS 1.2 [13] allows this.
chosen ciphertext attack against SSL was first published               2. Reuse of server-side nonce by the client. QUIC [10]
in 1998 [8]. Several works have adapted his attack to                     allows this.
different scenarios [4, 25, 29]. The TLS standard explic-
                                                                       3. Server sends a message encrypted with the derived
itly introduces countermeasures against the attack [13],
                                                                          key before the client. QUIC, TLS 1.3 [37], and TLS
but several modern implementations have been discov-
                                                                          False Start [30] do this.
ered to be vulnerable to timing-attack variants in recent
years [34, 42]. These side-channel attacks are implemen-               4. Deterministic cipher parameters are generated from
tation failures and only apply when the attacker is co-                   the premaster secret and nonces. This is the case for
located with the victim.                                                  all TLS stream ciphers and TLS 1.0 block ciphers.


                                                              13
USENIX Association                                                                      25th USENIX Security Symposium 701
   DROWN has a natural adaptation when all three prop-              already: TLS 1.3 has entirely removed RSA key exchange
erties are present. The attacker exposes a Bleichenbacher           and has restricted Diffie-Hellman key exchange to a few
oracle by connecting to the server twice with the identi-           groups large enough to withstand cryptanalytic attacks
cal RSA ciphertexts and server-side nonces. If the RSA              long in the future. The CA/Browser forum will remove
ciphertext is PKCS conformant, the server will respond              support for SHA-1 certificates this year. Resources such
with identical messages across both connections; other-             as the SSL Labs SSL Reports have gathered information
wise they will differ.                                              about best practices and vulnerabilities in one place, in or-
                                                                    der to encourage administrators to make the best choices.
9.2 Lessons for key reuse
DROWN illustrates the cryptographic principle that keys             9.4   Harms from weakening cryptography
should be single use. Often, this principle is primarily            Export-grade cipher suites for TLS deliberately weak-
applied to keys that are used to both sign and decrypt, but         ened three primitives to the point that they are now bro-
DROWN illustrates that using keys for different protocol            ken even to enthusiastic amateurs: 512-bit RSA key ex-
versions can also be a serious security risk. Unfortunately,        change, 512-bit Diffie-Hellman key exchange, and 40-bit
there is no widely supported way to pin X.509 certificates          symmetric encryption. All three deliberately weakened
to specific protocols. While using per-protocol certificates        primitives have been cornerstones of high-profile attacks:
may help defend against passive attacks, an active attacker         FREAK exploits export RSA, Logjam exploits export
could still leverage any certificate with a matching name.          Diffie-Hellman, and now DROWN exploits export sym-
                                                                    metric encryption.
9.3 Harms from obsolete cryptography                                   Like FREAK and Logjam, our results illustrate the
Recent years have seen a significant number of serious              continued harm that a legacy of deliberately weakened
attacks exploiting outdated and obsolete cryptography.              export-grade cryptography inflicts on the security of mod-
Many protocols and cryptographic primitives that were               ern systems, even decades after the regulations influenc-
demonstrated to be weak decades ago are surprisingly                ing the original design were lifted. The attacks described
common in real-world systems.                                       in this paper are fully feasible against export cipher suites
   DROWN exploits a modification of an 18-year-old at-              today. The technical debt induced by cryptographic “front
tack against a combination of protocols and ciphers that            doors” has left implementations vulnerable for decades.
have long been superseded by better options: the SSLv2              With the slow rate at which obsolete protocols and primi-
protocol, export cipher suites, and PKCS #1 v1.5 RSA                tives fade away, we can expect some fraction of hosts to
padding. In fact, support for RSA as a key exchange                 remain vulnerable for years to come.
method, including the use of PKCS #1 v1.5, is mandatory
even for TLS 1.2. The attack is made more severe by                 Acknowledgements
implementation flaws in rarely used code.                           The authors thank team Hashcat for making their GPUs
   Our work serves as yet another reminder of the im-               available for the execution of the attack, Ralph Holz
portance of removing deprecated technologies before                 for providing early scan data, Adam Langley for in-
they become exploitable vulnerabilities. In response to             sights about QUIC, Graham Steel for insights about TLS
many of the vulnerabilities listed above, browser ven-              False Start, the OpenSSL team for their help with dis-
dors have been aggressively warning end users when TLS              closure, Ivan Ristic for comments on session resumption
connections are negotiated with unsafe cryptographic pa-            in a BEAST-styled attack, and Tibor Jager and Christian
rameters, including SHA-1 certificates, small RSA and               Mainka for further helpful comments. We thank the ex-
Diffie-Hellman parameters, and SSLv3 connections. This              ceptional sysadmins at the University of Michigan for
process is currently happening in a piecemeal fashion,              their help and support throughout this project, including
primitive by primitive. Vendors and developers rightly              Chris Brenner, Kevin Cheek, Laura Fink, Dan Maletta,
prioritize usability and backward compatibility in stan-            Jeff Richardson, Donald Welch, Don Winsor, and others
dards, and are willing to sacrifice these only for practical        from ITS, CAEN, and DCO.
attacks. This approach works less well for cryptographic               This material is based upon work supported by the
vulnerabilities, where the first sign of a weakness, while          U.S. National Science Foundation under Grants No. CNS-
far from being practically exploitable, can signal trouble          1345254, CNS-1408734, CNS-1409505, CNS-1505799,
in the future. Communication issues between academic                CNS-1513671, and CNS-1518888, an AWS Research Ed-
researchers and vendors and developers have been voiced             ucation grant, a scholarship from the Israeli Ministry of
by many in the community, including Green [18] and                  Science, Technology and Space, a grant from the Blavat-
Jager et al. [24].                                                  nik Interdisciplinary Cyber Research Center (ICRC) at
   The long-term solution is to proactively remove these            Tel Aviv University, a gift from Cisco, and an Alfred P.
obsolete technologies. There is movement towards this               Sloan Foundation research fellowship.


                                                               14
702 25th USENIX Security Symposium                                                                          USENIX Association
References                                                                    [17] F REIER , A., K ARLTON , P., AND KOCHER , P. The secure
                                                                                   sockets layer (SSL) protocol version 3.0. RFC 6101, 2011.
 [1] A DRIAN , D., B HARGAVAN , K., D URUMERIC , Z., G AUDRY, P.,
     G REEN , M., H ALDERMAN , J. A., H ENINGER , N., S PRINGALL ,            [18] G REEN , M. Secure protocols in a hostile world. In CHES 2015
     D., T HOMÉ , E., VALENTA , L., VANDER S LOOT, B., W USTROW,                   (Aug. 2015). https://isi.jhu.edu/~mgreen/CHESPDF.pdf.
     E., Z ANELLA -B ÉGUELIN , S., AND Z IMMERMANN , P.                       [19] H AMILTON , R. QUIC discovery.
     Imperfect forward secrecy: How Diffie-Hellman fails in practice.              https://docs.google.com/document/d/
     In 22nd ACM Conference on Computer and Communications                         1i4m7DbrWGgXafHxwl8SwIusY2ELUe8WX258xt2LFxPM/
     Security (Oct. 2015).                                                         edit#.
 [2] A L FARDAN , N. J., AND PATERSON , K. G. Lucky Thirteen:                 [20] Hashcat. http://hashcat.net.
     Breaking the TLS and DTLS record protocols. In IEEE
                                                                              [21] H ENINGER , N., D URUMERIC , Z., W USTROW, E., AND
     Symposium on Security and Privacy (2013), IEEE, pp. 526–540.
                                                                                   H ALDERMAN , J. A. Mining your Ps and Qs: Detection of
 [3] A L FARDAN , N. J., B ERNSTEIN , D. J., PATERSON , K. G.,                     widespread weak keys in network devices. In 21st USENIX
     P OETTERING , B., AND S CHULDT, J. C. On the security of RC4                  Security Symposium (Aug. 2012).
     in TLS. In 22nd USENIX Security Symposium (2013),                        [22] H ICKMAN , K., AND E LGAMAL , T. The SSL protocol, 1995.
     pp. 305–320.                                                                  https://tools.ietf.org/html/draft-hickman-netscape-ssl-00.
 [4] BARDOU , R., F OCARDI , R., K AWAMOTO , Y., S IMIONATO , L.,             [23] H OLZ , R., A MANN , J., M EHANI , O., WACHS , M., AND
     S TEEL , G., AND T SAY, J.-K. Efficient padding oracle attacks on             K AAFAR , M. A. TLS in the wild: An Internet-wide analysis of
     cryptographic hardware. In Advances in Cryptology–CRYPTO                      TLS-based protocols for electronic communication. In Network
     2012. Springer, 2012, pp. 608–625.                                            and Distributed System Security Symposium (Geneva,
 [5] B EURDOUCHE , B., B HARGAVAN , K., D ELIGNAT-L AVAUD , A.,                    Switzerland, Feb. 2016), S. Capkun, Ed., Internet Society.
     F OURNET, C., KOHLWEISS , M., P IRONTI , A., S TRUB , P.-Y.,             [24] JAGER , T., PATERSON , K. G., AND S OMOROVSKY, J. One bad
     AND Z INZINDOHOUE , J. K. A messy state of the union: Taming                  apple: Backwards compatibility attacks on state-of-the-art
     the composite state machines of TLS. In IEEE Symposium on                     cryptography. In Network and Distributed System Security
     Security and Privacy (2015).                                                  Symposium (2013).
 [6] B HARGAVAN , K., L AVAUD , A. D., F OURNET, C., P IRONTI , A.,           [25] JAGER , T., S CHINZEL , S., AND S OMOROVSKY, J.
     AND S TRUB , P. Y. Triple handshakes and cookie cutters:                      Bleichenbacher’s attack strikes again: Breaking PKCS#1 v1.5 in
     Breaking and fixing authentication over TLS. In IEEE                          XML encryption. In 17th European Symposium on Research in
     Symposium on Security and Privacy (2014), IEEE, pp. 98–113.                   Computer Security (Berlin, Heidelberg, 2012), Springer Berlin
 [7] B HARGAVAN , K., AND L EURENT, G. Transcript collision                        Heidelberg, pp. 752–769.
     attacks: Breaking authentication in TLS, IKE, and SSH. In                [26] JAGER , T., S CHWENK , J., AND S OMOROVSKY, J. On the
     Network and Distributed System Security Symposium (Feb. 2016).                security of TLS 1.3 and QUIC against weaknesses in PKCS#1
 [8] B LEICHENBACHER , D. Chosen ciphertext attacks against                        v1.5 encryption. In 22nd ACM Conference on Computer and
     protocols based on the RSA encryption standard PKCS #1. In                    Communications Security (New York, NY, USA, 2015), CCS ’15,
     Advances in Cryptology — CRYPTO ’98, vol. 1462 of Lecture                     ACM, pp. 1185–1196.
     Notes in Computer Science. Springer Berlin / Heidelberg, 1998.           [27] K ALISKI , B. PKCS #1: RSA Encryption Version 1.5. RFC 2313
                                                                                   (Informational), Mar. 1998. Obsoleted by RFC 2437.
 [9] B REYHA , W., D URVAUX , D., D USSA , T., K APLAN , L. A.,
     M ENDEL , F., M OCK , C., KOSCHUCH , M., K RIEGISCH , A.,                [28] K ÄSPER , E. Fix reachable assert in SSLv2 servers. OpenSSL
     P ÖSCHL , U., S ABET, R., S AN , B., S CHLATTERBECK , R.,                     patch, Mar. 2015. https://github.com/openssl/openssl/commit/
     S CHRECK , T., W ÜRSTLEIN , A., Z AUNER , A., AND Z AWODSKY,                  86f8fb0e344d62454f8daf3e15236b2b59210756.
     P. Better crypto – applied crypto hardening, 2016. Available at          [29] K LIMA , V., P OKORN Ỳ , O., AND ROSA , T. Attacking
     https://bettercrypto.org/static/applied-crypto-hardening.pdf.                 RSA-based sessions in SSL/TLS. In Cryptographic Hardware
[10] C HANG , W.-T., AND L ANGLEY, A. QUIC crypto, 2014.                           and Embedded Systems-CHES 2003. Springer, 2003,
     https://docs.google.com/document/d/1g5nIXAIkN_Y-                              pp. 426–440.
     7XJW5K45IblHd_L2f5LTaDUDwvZ5L6g/edit?pli=1.                              [30] L ANGLEY, A., M ODADUGU , N., AND M OELLER , B. Transport
[11] CVE-2015-0293. https://cve.mitre.org/cgi-bin/                                 layer security (TLS) false start. draft-bmoeller-tls-falsestart-00,
     cvename.cgi?name=CVE-2015-0293.                                               June 2 (2010).
[12] DE RUITER , J., AND P OLL , E. Protocol state fuzzing of TLS             [31] L ENSTRA , A. K., L ENSTRA , H. W., AND L OVÁSZ , L.
     implementations. In 24th USENIX Security Symposium                            Factoring polynomials with rational coefficients. Mathematische
     (Washington, D.C., Aug. 2015), USENIX Association.                            Annalen 261 (1982), 515–534. 10.1007/BF01457454.
                                                                              [32] M AVROGIANNOPOULOS , N., V ERCAUTEREN , F., V ELICHKOV,
[13] D IERKS , T., AND R ESCORLA , E. The Transport Layer Security
                                                                                   V., AND P RENEEL , B. A cross-protocol attack on the TLS
     (TLS) Protocol Version 1.2. RFC 5246 (Proposed Standard), Aug.
                                                                                   protocol. In 19th ACM Conference on Computer and
     2008. Updated by RFCs 5746, 5878.
                                                                                   Communications Security (New York, NY, USA, 2012), CCS ’12,
[14] D UONG , T., AND R IZZO , J. Here come the xor ninjas, 2011.                  ACM, pp. 62–72.
     http://netifera.com/research/beast/beast_DRAFT_0621.pdf.
                                                                              [33] M EYER , C., AND S CHWENK , J. SoK: Lessons learned from
[15] D URUMERIC , Z., K ASTEN , J., A DRIAN , D., H ALDERMAN ,                     SSL/TLS attacks. In 14th International Workshop on Information
     J. A., BAILEY, M., L I , F., W EAVER , N., A MANN , J.,                       Security Applications (Berlin, Heidelberg, Aug. 2013), WISA
     B EEKMAN , J., PAYER , M., AND PAXSON , V. The matter of                      2013, Springer-Verlag.
     Heartbleed. In 14th Internet Measurement Conference (New York,           [34] M EYER , C., S OMOROVSKY, J., W EISS , E., S CHWENK , J.,
     NY, USA, 2014), IMC ’14, ACM, pp. 475–488.                                    S CHINZEL , S., AND T EWS , E. Revisiting SSL/TLS
[16] D URUMERIC , Z., W USTROW, E., AND H ALDERMAN , J. A.                         implementations: New Bleichenbacher side channels and attacks.
     ZMap: Fast Internet-wide scanning and its security applications.              In 23rd USENIX Security Symposium. USENIX Association, San
     In 22nd USENIX Security Symposium (Aug. 2013).                                Diego, CA, Aug. 2014, pp. 733–748.


                                                                         15
USENIX Association                                                                                    25th USENIX Security Symposium 703
[35] M ÖLLER , B., D UONG , T., AND KOTOWICZ , K. This POODLE              A.2    Optimizing the chosen set of fractions
     bites: exploiting the SSL 3.0 fallback, 2014.
[36] O PEN SSL. Change log.
                                                                           In order to deduce the validity of a single ciphertext, the
     https://www.openssl.org/news/changelog.html#x0.                       attacker would have to perform a non-trivial brute-force
[37] R ESCORLA , E., ET AL . The transport layer security (TLS)            search over all 5 byte master_key values. This translates
     protocol version 1.3, draft.                                          into 240 encryption operations.
[38] R IZZO , J., AND D UONG , T. The CRIME attack. EKOparty                  The search space can be reduced by an additional opti-
     Security Conference, 2012.
                                                                           mization, relying on the fractional multipliers used in the
[39] ROSKIND , J. QUIC design document, 2013.
     https://docs.google.com/a/chromium.org/document/d/
                                                                           first step. If the attacker uses u/t = 8/7 to compute a new
     1RNHkx_VvKWyWg6Lr8SZ-saqsQx7rFV-ev2jRFUoVD34.                         SSLv2 conformant candidate, and m0 is indeed divisible
[40] T URNER , S., AND P OLK , T. Prohibiting secure sockets layer         by t = 7, then the new candidate message m1 = m0 /t · u
     (SSL) version 2.0. RFC 6176 (Informational), Apr. 2011.               is divisible by u = 8, and the last three bits of m1 (and
[41] WAGNER , D., AND S CHNEIER , B. Analysis of the SSL 3.0               thus mksecret ) are zero. This allows reducing the searched
     protocol. In 2nd USENIX Workshop on Electronic Commerce               master_key space by selecting specific fractions.
     (1996).
[42] Z HANG , Y., J UELS , A., R EITER , M. K., AND R ISTENPART, T.           More generally, for an integer u, the largest power of 2
     Cross-tenant side-channel attacks in PaaS clouds. In 21st ACM         by which u is divisible is denoted by v2 (u), and multiply-
     Conference on Computer and Communications Security (New               ing by a fraction u/t reduces the search space by a factor
     York, NY, USA, 2014), CCS ’14, ACM, pp. 990–1003.
                                                                           of v2 (u). With this observation, the trade-off between the
A     Adaptations to Bleichenbacher’s attack                               3 metrics: the required number of intercepted ciphertexts,
                                                                           the required number of queries, and the required number
A.1     Success probability of fractions                                   of encryption attempts, becomes non-trivial to analyze.
For a given fraction u/t, the success probability with a                      Therefore, we have resorted to using simulations when
randomly chosen TLS conformant ciphertext can be com-                      evaluating the performance metrics for sets of fractions.
puted as follows. Let m0 be a random TLS conformant                        The probability that multiplying a ciphertext by any frac-
message, m1 = m0 · u/t, and let k be the expected length                  tion out of a given set of fractions results in an SSLv2
of the unpadded message. For s = u/t mod N where u                         conformant message is difficult to compute, since the
and t are coprime, m1 will be SSLv2 conformant if the                      events are in fact inter-dependent: If m · 16/15 is con-
following conditions all hold:                                             forming, then m is divisible by 5, greatly increasing the
  1. m0 is divisible by t. For a randomly generated m0 ,                   probability that m · 4/5 is also conforming. However, it is
     this condition holds with probability 1/t.                            easy to perform a Monte Carlo simulation, where we ran-
  2. m1 [1] = 0 and m1 [2] = 2, or the integer m · u/t ∈                   domly generate ciphertexts, and measure the probability
     [2B, 3B). For a randomly generated m0 divisible by                    that any fraction out of a given set produces a conforming
     t, this condition holds with probability                              message. The expected required number of intercepted
                                                                          ciphertexts is the inverse of that probability.
                  3 − 2 · t/u for 2/3 < u/t < 1
                  
                                                                              Formally, if we denote the set of fractions as F, and
              P = 3 · t/u − 2 for 1 < u/t < 3/2                            the event that a message m is conforming as C(m), we
                  
                  
                    0           otherwise                                  perform a Monte Carlo estimation of the probability PF =
                                                                           P(∃ f ∈ F : C(m· f )), and the expected number of required
  3. ∀i ∈ [3, m − (k + 1)], m1 [i] = 0, or all bytes between
                                                                           intercepted ciphertexts equals 1/PF . The required number
     the first two bytes and the (k + 1) least significant
                                                                           of oracle queries is simply 1/PF · |F|. Accordingly, the re-
     bytes are non-zero. This condition holds with proba-
                                                                           quired number of server connections is 2 · 1/PF · |F|, since
     bility (1 − 1/256)m −(k +3) .
                                                                           each oracle query requires two server connections. And
  4. m1 [m − k ] = 0: the (k + 1)st least significant byte              as for the required number of encryption attempts, if we
     is 0. This condition holds with probability 1/256.                    denote this number when querying with a given fraction
   Using the above formulas for u/t = 7/8, the overall                      f = u/t as E f , then E f = Eu/t = 240−v2 (u) . We further
probability of success is P = 1/8 · 0.71 · 0.37 · 1/256 =                  define the required encryption attempts when testing a
1/7, 774; thus the attacker expects to find an SSLv2 con-                  ciphertext with a given set of fraction F as EF = ∑ f ∈F E f .
formant ciphertext after testing 7,774 randomly chosen                     Then the required number of encryption attempts in Phase
TLS conformant ciphertexts. The attacker can decrease                      1 for a given set of fractions is (1/PF ) · EF .
the number of TLS conformant ciphertexts needed by mul-                       We can now give precise figures for the expected num-
tiplying each candidate ciphertext by several fractions.                   ber of required intercepted ciphertexts, connections to the
   Note that testing random s values until c1 = c0 · se mod                targeted server, and encryption attempts. The results pre-
N is SSLv2 conformant yields a success probability of                      sented in Table 1 were obtained using the above approach
Prnd ≈ (1/256)3 ∗ (255/256)249 ≈ 2−25 .                                    with one billion random ciphertexts per fraction set F.


                                                                      16
704 25th USENIX Security Symposium                                                                                 USENIX Association
A.3 Rotation and multiplier speedups                                    significant bytes, and which have a known multiplicative
For a randomly chosen s, the probability that the two                   relationship to our original message c0 .
most significant bytes are 0x00 02 is 2−16 ; for a 2028-bit
                                                                        A.4    Rotations in the general DROWN attack
modulus N the probability that the next m − k − 3 bytes
of m2 are all nonzero is about 0.37 as in the previous                  After the first phase, we have learned an SSLv2 confor-
section, and the probability that the k + 1 least significant          mant ciphertext c1 , and we wish to shift known plaintext
delimiter byte is 0x00 is 1/256. Thus a randomly chosen s               bytes from least to most significant bits. Since we learn
will work with probability 2−25.4 and the attacker expects              the least significant 6 bytes of plaintext of m1 from a suc-
to try 225.4 values for s before succeeding.                            cessful oracle OSSLv2-export query, we could use a shift of
   However, since the attacker has already learned k + 3               2−48 to transfer 48 bits of known plaintext to the most
most significant bytes of m1 · R−1 mod N, for k ≥ 4 and                significant bits of a new ciphertext. However, we perform
s < 230 they do not need to query the oracle to learn if the            a slight optimization here, to reduce the number of en-
two most significant bytes are SSLv2 conformant; they                   cryption attempts. We instead use a shift of 2−40 , so that
can compute this themselves from their knowledge of                     the least significant byte of m1 · 2−40 and m̃1 · 2−40 will
m̃1 · R−1 . They iterate through values of s, test that the top         be known. This means that we can compute the least sig-
two bytes of m̃1 · R−1 mod N are 0x00 02, and only query                nificant byte of m1 · 2−40 · s mod N, so oracle queries now
the oracle for s values that satisfy this test. Therefore, for a        only require 232 encryption attempts each. This brings
2048-bit modulus they expect to test 216 values offline per             the total expected number of encryption attempts for each
oracle query. The probability that a query is conformant is             shift to 232 ∗ 678 ≈ 241 .
then P = (1/256)∗(255/256)249 ≈ 1/678, so they expect                      We perform two such plaintext shifts in order to obtain
to perform 678 oracle queries before finding a fully SSLv2              an SSLv2 conformant message, m3 that resides in a nar-
conformant ciphertext c2 = (s · R−1 )e c1 mod N.                        row interval of length at most 28−66 . We can then obtain
   We can speed up the brute force testing of 216 values                a multiplier s3 such that m3 · s3 is also SSLv2 conformant.
of s using algebraic lattices. We are searching for values              Since m3 lies in an interval of length at most 28−66 , with
of s satisfying m̃1 R−1 s < 3B mod N, or given an offset                high probability for any s3 < 230 , m3 · s3 lies in an interval
s0 we would like to find solutions x and z to the equation              of length at most 28m −36 < B, so we know the two most
m̃1 R−1 (s0 + x) = 2B + z mod N where |x| < 216 and |z| <               significant bytes of m3 · s3 . Furthermore, we know the
B. Let X = 215 . We can construct the lattice basis                     value of the 6 least significant bytes after multiplication.
                                                                      We therefore test possible values of s3 , and for values
                  −B X m̃1 R−1 m̃1 R−1 s0 + B                           such that m3 · s3 ∈ [2B, 3B), and (m3 · s3 )[m − 5] = 0, we
            L= 0          XN               0       
                                                                        query the oracle with c3 · se3 mod N. The only condition
                   0        0               N                           for PKCS conformance which we haven’t verified be-
We then run the LLL algorithm [31] on L to obtain a                     fore querying the oracle is the requirement of non-zero
reduced lattice basis V containing vectors v1 , v2 , v3 . We            padding, which holds with probability 0.37.
then construct the linear equations f1 (x, z) = v1,1 /B · z +              In summary, after roughly 1/0.37 = 2.72 queries we
v1,2 /X · x + v1,3 = 0 and f2 (x, z) = v2,1 /B · z + v2,2 /X ·          expect a positive response from the oracle. Since we know
x + v2,3 = 0 and solve the system of equations to find a                the value of the 6 least significant bytes after multiplica-
candidate integer solution x = s̃. We then test s = s̃ + s0             tion, this phase does not require performing an exhaustive
as our candidate solution in this range.                                search. If the message is SSLv2 conformant after multipli-
   det L = XZN 2 and dim L = 3, thus we expect the                      cation, we know the symmetric key, and can test whether
vectors vi in V to have length approximately |vi | ≈                    it correctly decrypts the ServerVerify message.
(XZN 2 )1/3 . We will succeed if |vi | < N, or in other words
XZ < N. N ≈ 28m , so we expect to find short enough
                                                                        A.5    Adapted Bleichenbacher iteration
vectors. This approach works well in practice and is sig-               After we have bootstrapped the attack using rotations, the
nificantly faster than iterating through 216 possible values            original algorithm proposed by Bleichenbacher can be
of s̃ for each query.                                                   applied with minimal modifications.
   In summary, given an SSLv2 conformant ciphertext                        The original step obtains a message that starts with
c1 = me1 mod N, we can efficiently generate an SSLv2                    the required 0x00 02 bytes once in roughly every two
conformant ciphertext c2 = me2 mod N where m2 = s ·                     queries on average, and requires the number of queries to
m1 · R−1 mod N and we know several most significant                     be roughly 16m . Since we know the value of the 6 least
bytes of m2 , using only a few hundred oracle queries in                significant bytes after multiplying by any integer, we can
expectation. We can iterate this process as many times as               only query the oracle for multipliers that result in a zero
we like to continue generating SSLv2 conformant cipher-                 6th least significant byte, and again an exhaustive search
texts ci for which we know increasing numbers of most                   over keys is not required. However, we cannot ensure


                                                                   17
USENIX Association                                                                          25th USENIX Security Symposium 705
that the padding is non-zero when querying, which again                2048-bit modulus:
holds with probability 0.37. Therefore, for a 2048-bit
                                                                                         P3 = P(0x00 ∈ {m3 , . . . , m10 }∧
modulus, the overall expected number of queries for this
phase is roughly 2048 ∗ 2/0.37 = 11, 070.                                                        0x00 ∈ {m11 , . . . , m })     (1)
                                                                                           8                    246
                                                                           = (1 − 1/256) ∗ (1 − (1 − 1/256)           ) = 0.60
A.6 Special DROWN MITM performance
For the first step, the probability that the three padding             Phase 1. Our goal for this phase is to obtain a divisor t
bytes are correct remains unchanged. The probability that              as large as possible, such that t|m. We generate a list of
all the intermediate padding bytes are non-zero is now                 fractions, sorted in descending order of the probability
slightly higher, P1 = (1 − 1/256)229 = 0.41, yielding an               of resulting in a positive response from OSSLv2-export-leaky .
                                                        1              For a given ciphertext c, we then query with the 50 frac-
overall maximal success probability P = 0.1 · 0.41 · 256  =
1/6, 244 per oracle query. Since the attacker now only                 tions in the list with the highest probability, until we ob-
needs to connect to the server once per oracle query, the              tain a first positive response for a fraction u0 /t0 . We can
expected number of connections in this step is the same,               now deduce that t0 |m. We then generate a list of fractions
6, 243. Phase 1 now yields a message with 3 known                      u/t where t is a multiple of t0 , sort them again by success
padding bytes and 24 known plaintext bytes.                            probability, and again query with the 50 most probable
   For the remaining rotation steps, each rotation requires            fractions, until a positive answer is obtained, or the list is
an expected 630 oracle queries. The attacker could now                 exhausted. If a positive answer is obtained, we iteratively
complete the original Bleichenbacher attack by perform-                re-apply this process, until the list is exhausted, resulting
ing 11,000 sequential queries in the final phase. However,             in a final fraction u∗ /t ∗ .
with this more powerful oracle it is more efficient to apply           Phase 2. We then query with all fractions denominated
a rotation 10 more times to recover the remaining plain-               by t ∗ , and hope the ciphertext decrypts to a plaintext of
text bits. The number of queries required in this phase is             one of seven possible lengths: {2, 3, 4, 5, 8, 16, 24}. As-
now 10 · 256/0.41 ≈ 6, 300, and the queries for each of                suming that this is the case, we learn at least three least
the 10 steps can be executed in parallel.                              significant bytes, which allows us to use the shifting tech-
Using multiple queries per fraction. For the                           nique in order to continue the attack. Detecting plaintext
OSSLv2-extra-clear oracle, the attacker can increase                   lengths 8, 16 and 24 can be accomplished using three Ex-
their chances of success by querying the server multiple               tra Clear oracle queries, employing DES, 128-bit RC4 and
times per ciphertext and fraction, using different cipher              3DES, respectively, as the chosen cipher suite. Detecting
suites with different key lengths. They can negotiate                  plaintext lengths 2, 3, 4 and 5 can be accomplishing by
DES and hope the 9th least significant byte is zero, then              using a single Leaky Export oracle query, which requires
negotiate 128-bit RC4 and hope the 17th least significant              at most 241 offline computation. In fact, the optimization
byte is zero, then negotiate 3DES and hope the 25th                    over the key search space described in Section 3.2.1 is
least significant is zero. All three queries also require              applicable here and can slightly reduce the required com-
the intermediate padding bytes to be non-zero. This                    putation. Therefore, by initiating four SSLv2 connections
technique triples the success probability for a given                  and performing at most 241 offline work, the attacker can
pair of (ciphertext, fraction), at a cost of triple the                test for ciphertexts which decrypt to one of these seven
queries. Its primary benefit is that fractions with smaller            lengths.
denominators (and thus higher probabilities of success)                   In practice, choosing 50 fractions per iteration as de-
are now even more likely to succeed.                                   scribed above results in a success probability of 0.066 for
   For a random ciphertext, when choosing 70 fractions,                a single ciphertext. Hence, the expected number of re-
the probability of the first zero delimiter byte being in              quired ciphertexts is merely 1/0.066 = 15. The expected
one of these three positions is 0.01. Hence, the attacker              number of fractions per ciphertext for phase 1 is 60, as
can use only 100 recorded ciphertexts, and expect to use               in most cases phase 1 consists of just a few successful
100 ∗ 70 ∗ 3 = 21, 000 oracle queries. For the Extra Clear             iterations. Since each fraction requires a single query to
oracle, each query requires one SSLv2 connection to the                OSSLv2-export-leaky , the overall number of queries for this
server. After obtaining the first positive response from the           stage is 15 ∗ 60 = 900, and the required offline computa-
oracle, the attacker proceeds to phase 2 using 3DES.                   tion is at most 900 ∗ 241 ≈ 251 , which is similar to general
                                                                       DROWN. For a 2048-bit RSA modulus, the expected
A.7 Special DROWN with combined oracles                                number of queries for phase 2 is 16. Each query con-
Using the Leaky Export oracle, the probability that a                  sists of three queries to OSSLv2-extra-clear and one query to
fraction u/t will result in a positive response is P = P0 ∗P3 ,        OSSLv2-export-leaky , which requires at most 241 computa-
where the formula for computing P0 = P((m · u/t)[1, 2] =               tion. Therefore in expectancy the attacker has to perform
00||02) is provided in Appendix A.1, and P3 is, for a                  245 offline computation for phase 2.


                                                                  18
706 25th USENIX Security Symposium                                                                             USENIX Association
