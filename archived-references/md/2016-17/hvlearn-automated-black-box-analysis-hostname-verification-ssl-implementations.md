---
type: Whitepaper
title: "HVLearn: Automated Black-box Analysis of Hostname Verification in SSL/TLS Implementations"
description: HVLearn learns a finite automaton of exactly which hostnames each SSL/TLS library accepts for a given certificate common name, then compares those models across implementations and against RFC-derived rules. The disagreements expose eight specification violations in OpenSSL, GnuTLS, MatrixSSL, JSSE and others, several letting a man-in-the-middle present a certificate the client wrongly accepts.
resource: "http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf"
tags: [whitepaper, webseclist-reference, parser-differential, tls, https, auth-bypass, formal-analysis, dynamic-analysis, tooling, owasp-a01-2021, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:35:01+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf"
    title: "HVLearn: Automated Black-box Analysis of Hostname Verification in SSL/TLS Implementations"
    author: Suphannee Sivakorn, George Argyros, Kexin Pei, Angelos D. Keromytis, Suman Jana
also_at: []
authors:
  - Suphannee Sivakorn
  - George Argyros
  - Kexin Pei
  - Angelos D. Keromytis
  - Suman Jana
canonical_url: ""
cited_by:
  - "2016-17.md:96"
commit: ""
content_sha256: eadab32d7edd75ea7cb05e58e9f0be02311d509763ef866b32b24e9ded1c5f4b
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: ad81042304892fe70dccf189ca8c13c14d68054fe1e2effbe0fb6f65cfc575ce
retrieved_from: "http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:35:01+00:00"
slug: hvlearn-automated-black-box-analysis-hostname-verification-ssl-implementations
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# HVLearn: Automated Black-box Analysis of Hostname Verification in SSL/TLS Implementations

**HVLearn: Automated Black-box Analysis of Hostname Verification in SSL/TLS Implementations** - Suphannee Sivakorn, George Argyros, Kexin Pei, Angelos D. Keromytis, Suman Jana, Publisher not stated.

- Published: date not stated
- Original: <http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf>
- Preserved from: http://www.cs.columbia.edu/~suman/docs/hvlearn.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# HVLearn: Automated Black-box Analysis of Hostname Verification in SSL/TLS Implementations

HVLearn: Automated Black-box Analysis of
Hostname Verification in SSL/TLS Implementations
             Suphannee Sivakorn, George Argyros, Kexin Pei, Angelos D. Keromytis, and Suman Jana
                                               Department of Computer Science
                                            Columbia University, New York, USA
                                  {suphannee, argyros, kpei, angelos, suman}@cs.columbia.edu


   Abstract—SSL/TLS is the most commonly deployed family of           domain name, IP address, and so forth) of the server matches
protocols for securing network communications. The security           one of the identifiers in the “SubjectAltName” extension or
guarantees of SSL/TLS are critically dependent on the correct         the “Common Name” (CN) attribute of the presented leaf
validation of the X.509 server certificates presented during the
handshake stage of the SSL/TLS protocol. Hostname verification        certificate. Therefore, any mistake in the implementation of
is a critical component of the certificate validation process that    hostname verification could completely undermine the security
verifies the remote server’s identity by checking if the hostname     and privacy guarantees of SSL/TLS.
of the server matches any of the names present in the X.509              Hostname verification is a complex process due to the pres-
certificate. Hostname verification is a highly complex process        ence of numerous special cases (e.g., wildcards, IP addresses,
due to the presence of numerous features and corner cases such
as wildcards, IP addresses, international domain names, and so        international domain names, etc.). For example, a wildcard
forth. Therefore, testing hostname verification implementations       character (‘*’) is only allowed in the left-most part (separated
present a challenging task.                                           by ‘.’) of a hostname. To get a sense of the complexities
   In this paper, we present HVLearn, a novel black-box testing       involved in the hostname verification process, consider the
framework for analyzing SSL/TLS hostname verification imple-          fact that different parts of its specifications are described
mentations, which is based on automata learning algorithms.
HVLearn utilizes a number of certificate templates, i.e., certifi-    in five different RFCs [18], [20], [21], [24], [25]. Given
cates with a common name (CN) set to a specific pattern, in           the complexity and security-critical nature of the hostname
order to test different rules from the corresponding specification.   verification process, it is crucial to perform automated analysis
For each certificate template, HVLearn uses automata learning         of the implementations for finding any deviation from the
algorithms to infer a Deterministic Finite Automaton (DFA) that       specification.
describes the set of all hostnames that match the CN of a given
certificate. Once a model is inferred for a certificate template,        However, despite the critical nature of the hostname ver-
HVLearn checks the model for bugs by finding discrepancies            ification process, none of the prior research projects dealing
with the inferred models from other implementations or by             with adversarial testing of SSL/TLS certificate validation [36],
checking against regular-expression-based rules derived from the      [38], [45], [50], support detailed automated testing of host-
specification. The key insight behind our approach is that the        name verification implementations. The prior projects either
acceptable hostnames for a given certificate template form a
regular language. Therefore, we can leverage automata learning        completely ignore testing of the hostname verification process
techniques to efficiently infer DFA models that accept the            or simply check whether the hostname verification process
corresponding regular language.                                       is enabled or not. Therefore, they cannot detect any subtle
   We use HVLearn to analyze the hostname verification im-            bugs where the hostname verification implementations are
plementations in a number of popular SSL/TLS libraries and            enabled but deviate subtly from the specifications. The key
applications written in a diverse set of languages like C, Python,
and Java. We demonstrate that HVLearn can achieve on aver-            problem behind automated adversarial testing of hostname
age 11.21% higher code coverage than existing black/gray-box          verification implementations is that the inputs (i.e., hostnames
fuzzing techniques. By comparing the DFA models inferred by           and certificate identifiers like common names) are highly
HVLearn, we found 8 unique violations of the RFC specifications       structured, sparse strings and therefore makes it very hard
in the tested hostname verification implementations. Several          for existing black/gray-box fuzz testing techniques to achieve
of these violations are critical and can render the affected
implementations vulnerable to active man-in-the-middle attacks.       high test coverage or generate inputs triggering the corner
                                                                      cases. Heavily language/platform-dependent white-box testing
                       I. I NTRODUCTION                               techniques are also hard to apply for testing hostname verifi-
   The SSL/TLS family of protocols are the most commonly              cation implementations due to the language/platform diversity
used mechanisms for protecting the security and privacy               of SSL/TLS implementations.
of network communications from man-in-the-middle attacks.                In this paper, we design, implement, and evaluate HVLearn,
The security guarantees of SSL/TLS protocols are critically           a black-box differential testing framework based on automata
dependent on correct validation of X.509 digital certificates         learning, which can automatically infer Deterministic Finite
presented by the servers during the SSL/TLS handshake phase.          Automata (DFA) models of the hostname verification imple-
The certificate validation, in turn, depends on hostname ver-         mentations. The key insight behind HVLearn is that hostname
ification for verifying that the hostname (i.e., fully qualified      verification, even though very complex, conceptually closely
resemble the regular expression matching process in many           Section IV describes the design and implementation details
ways (e.g., wildcards). This insight on the structure of the       of HVLearn. We present the evaluation results for using
certificate identifier format suggests that the acceptable host-   HVLearn to test SSL/TLS implementations in Section V.
names for a given certificate identifier, as suggested by the      Section VI presents a detailed case study of several security-
specifications, form a regular language. Therefore, we can         critical bugs that HVLearn found. Section VII discusses the
use black-box automata learning techniques to efficiently infer    related work and Section VIII concludes the paper. For the
Deterministic Finite Automata (DFA) models that accept the         detailed developer responses on the bugs found by HVLearn,
regular language corresponding to a given hostname verifica-       we refer interested readers to Appendix X-B.
tion implementation. Prior results by Angluin et al. have shown
                                                                            II. OVERVIEW OF HOSTNAME VERIFICATION
that DFAs can be learned efficiently through black-box queries
in polynomial time over the number of states [31]. The DFA            As part of the hostname verification process, the SSL/TLS
models inferred by HVLearn can be used to efficiently perform      client must check that the host name of the server matches
two main tasks that existing testing techniques cannot do well:    either the “common name” attribute in the certificate or one
(i) finding and enumerating unique differences between mul-        of the names in the “subjectAltName” extension in the certifi-
tiple different implementations; and (ii) extracting a formal,     cate [21]. Note that even though the process is called hostname
backward-compatible reference specification for the hostname       verification, it also supports verification of IP addresses or
verification process by computing the intersection DFA of the      email addresses.
inferred DFA models from different implementations.                   In this section, we first provide a brief summary of the
   We apply HVLearn to analyze a number of popular                 hostname format and specifications that describe the format
SSL/TLS libraries such as OpenSSL, GnuTLS, MbedTLS,                of the common name attribute and subjectAltName extension
MatrixSSL, CPython SSL and applications such as Java               formats in X.509 certificate. Figure 1 provides a high-level
HttpClient and cURL written in diverse languages like C,           summary of the relevant parts of an X.509 certificate. Next,
Python, and Java. We found 8 distinct specification violations     we describe different parts of the hostname verification process
like the incorrect handling of wildcards in internationalized      (e.g., domain name restrictions, wildcard characters, and so
domain names, confusing domain names with IP addresses,            forth) in detail.
incorrect handling of NULL characters, and so forth. Several
                                                                                                 X.509 Certificate
of these violations allow network attackers to completely break
                                                                                                          type           format
the security guarantees of SSL/TLS protocol by allowing
                                                                                Subject:   CN=      X520CommonName      arbitrary
the attackers to read/modify any data transmitted over the
                                                                                X509v3 extensions
SSL/TLS connections set up using the affected implementa-
                                                                                     X509v3 Subject Alternative Name:
tions. HVLearn also found 121 unique differences, on average,
                                                                                                        type          format
between any two pairs of tested application/library.
                                                                                            DNS:       IA5String        dNSName
   The major contributions of this paper are as follows.
                                                                                     IP Address:       IA5String        iPAddress
  • To the best of our knowledge, HVLearn is the first testing
                                                                                           email:      IA5String        rfc822Name
    tool that can learn DFA models for implementations
    of hostname verification, a critical part of SSL/TLS
    implementations. The inferred DFA models can be used           Fig. 1. Fields in an X.509 certificate that are used for hostname verification.
    for efficient differential testing or extracting a formal
    reference specification compatible with multiple existing      A. Hostname verification inputs
    implementations.                                               Hostname format. Hostnames are usually either a fully
  • We design and implement several domain-specific opti-
                                                                   qualified domain name or a single string without any ‘.’
    mizations like equivalence query design, alphabet selec-       characters. Several SSL/TLS implementations (i.e., OpenSSL)
    tion, etc. in HVLearn for efficiently learning DFA models      also support IP addresses and email addresses to be passed
    from hostname verification implementations.                    as the hostname to the corresponding hostname verification
  • We evaluate HVLearn on 6 popular libraries and 2 appli-
                                                                   implementation.
    cations. HVLearn achieved significantly higher (11.21%            A domain name consists of multiple “labels”, each separated
    more on average) code coverage than existing black/gray-       by a ‘.’ character. The domain name labels can only contain
    box fuzzing techniques and found 8 unique previously           letters a-z or A-Z (in a case-insensitive manner), digits 0-9
    unknown RFC violations as shown in Table II, several           and the hyphen character ‘-’ [16]. Each label can be up to
    of which render the affected SSL/TLS implementations           63 characters long. The total length of a domain name can
    completely insecure to man-in-the-middle attacks.              be up to 255 characters. Earlier specifications required that
   The remainder of this paper is organized as follows: Sec-       the labels must begin with letters [21]. However, subsequent
tion II presents the descriptions of the SSL/TLS hostname          revisions have allowed labels that begin with digits [17].
verification process. We discuss the challenges in testing host-   Common names in X.509 certificates. The Common Name
name verification and our testing methodology in Section III.      (CN) is an attribute of the “subject distinguished name”
field in an X.509 certificate. The common name in a server             Several special cases involving the wildcards are allowed in
certificate is used for validating the hostname of the server as    the RFC 6125 only for backward compatibility of existing
part of the certificate verification process. A common name         SSL/TLS implementations as they tend to differ from the
usually contains a fully qualified domain name, but it can also     specifications in these cases. RFC 6125 clearly notes that
contain a string with arbitrary ASCII and UTF-8 characters          these cases often lead to overly complex hostname verification
describing a service (e.g., CN=‘Sample Service’). The only          code and might lead to potentially exploitable vulnerabilities.
restriction on the common name string is that it should follow      Therefore, new SSL/TLS implementations are discouraged
the X520CommonName standard (e.g., should not repeat the            from supporting such cases. We summarize some of them:
substring ‘CN=’) [21]. Note that this is different from the         (i) a wildcard is all or part of a label that identifies a
hostname specifications that are very strictly defined and only     public suffix (e.g., *.com and *.info), (ii) multiple wildcards
allow certain characters and digits as described above.             are present in a label (e.g., f*b*r.example.com), and (iii)
SubjectAltName in X.509 certificates. Subject alternative           wildcards are included as all or part of multiple labels (e.g.,
name (subjectAltName) is an X.509 extension that can be             *.*.example.com).
used to store different types of identity information like fully    International domain name (IDN). IDNs can contain charac-
qualified domain names, IP addresses, URI strings, email            ters from a language-specific alphabet like Arabic or Chinese.
addresses, and so forth. Each of these types has different          An IDN is encoded as a string of unicode characters. A domain
restrictions on allowed formats. For example, dNSName(DNS)          name label is categorized as a U-label if it contains at least one
and uniformResourceIdentifier(URI) must be valid IA5String          non-ASCII character (e.g., UTF-8). RFC 6125 specifies that
strings, a subset of ASCII strings [21]. We refer interested        any U-labels in IDNs must be converted to A-labels domain
readers to Section 4.1.2.6 of RFC 5280 for further reading.         before performing hostname verification [24]. U-label strings
                                                                    are converted to A-labels, an ASCII-compatible encoding,
B. Hostname verification rules                                      by adding the prefix ‘xn--’ and appending the output of
                                                                    a Punycode transformation applied to the corresponding U-
Matching order. RFC 6125 recommends SSL/TLS imple-                  label string as described in RFC 3492 [19]. Both U-labels and
mentations to use subjectAltName extensions, if present in          A-labels still must satisfy the standard length bound on the
a certificate, over common names as the common name is              domain names (i.e. up to 255 bytes).
not strongly tied to an identity and can be an arbitrary string     IDN in subjectAltName. As indicated in RFC 5280, any
as mentioned earlier [24]. If multiple identifiers are present      IDN in X.509 subjectAltName extension must be defined as
in a subjectAltName, the SSL/TLS implementations should             type IA5String which is limited only to a subset of ASCII
try to match DNS, SRV, URI, or any other identifier type            characters [21]. Any U-label in an IDN must be converted
supported by the implementation and must not match the              to A-label before adding it to the subjectAltName. Email
hostname against the common name of the certificate [24].           addresses involving IDNs must also be converted to A-labels
The Certificate Authorities (CAs) are also supposed to use the      before.
dNSName instead of common name for storing the identity             IDNs in common name. Unlike IDNs in subjectAltName,
information while issuing certificates [18].                        IDNs in common names are allowed to contain a Printa-
Wildcard in common name/subjectAltName. if a server                 bleString (A-Z, a-z, 0-9, special characters ’ = ( ) + ,
certificate contains a wildcard character ‘*’, an SSL/TLS           - . / : ?, and space) as well as UTF-8 characters [21].
implementation should match hostname against them using             Wildcard and IDN. There is no specification defining how
the rules described in RFC 6125 [24]. We provide a summary          a wildcard character may be embedded within A-labels or
of the rules below.                                                 U-labels of an IDN [23]. As a result RFC 6125 [24] rec-
   A wildcard character is only allowed in the left-most label.     ommends that SSL/TLS implementations should not match
If the presented identifier contains a wildcard character in any    a presented identifier in a certificate where the wildcard
label other then the left-most label (e.g., www.*.example.com       is embedded within an A-label or U-label of an IDN
and www.foo*.example.com), the SSL/TLS implementations              (e.g., xn--kcry6tjko*.example.com). However, SSL/TLS im-
should reject the certificate. A wildcard character is allowed to   plementations should match a wildcard character in an IDN
be present anywhere in the left-most label, i.e., a wildcard does   as long as the wildcard character occupies the entire left-most
not have to be the only character in the left-most label. For ex-   label of the IDN (e.g. *.xn--kcry6tjko.example.com).
ample, identifiers like bar*.example.com, *bar.example.com,         IP address. IP addresses can be part of either the common
or f*bar.example.com valid.                                         name attribute or the subjectAltName extension (with an ‘IP:’
   While matching hostnames against the identifiers present         prefix) in a certificate. Section 3.1.3.2 of RFC 6125 specifies
in a certificate, a wildcard character in an identifier should      that an IP address must be converted to network byte order
only apply to one sub-domain and an SSL/TLS implemen-               octet string before performing certificate verification [24].
tation should not compare against anything but the left-            SSL/TLS implementations should compare this octet string
most label of the hostname (e.g., *.example.com should              with the common name or subjectAltName identifiers. The
match foo.example.com but not bar.foo.example.com or ex-            length of the octet string must be 4 bytes and 18 bytes for
ample.com).                                                         IPv4 and IPv6 respectively. The hostname verification should
succeed only if both octet strings are identical. Therefore,      corner cases are left unspecified. Therefore, it is necessary
wildcard characters are not allowed in IP address identifiers,    for any hostname verification implementation analysis to take
and the SSL/TLS implementations should not attempt to match       into account the behaviors of other popular implementations to
wildcards.                                                        discover discrepancies that could lead to security/compatibility
Email. Email can be embedded in common name as the                flaws.
emailAddress attribute in legacy SSL/TLS implementations.         2. Complexity of name checking functionality. Hostname
The attribute is not case sensitive. However, new implemen-       verification is significantly more complex than a simple string
tations must add email addresses in rfc822Name format to          comparison due to the presence of numerous corner cases and
subject alternative name extension instead of the common          special characters. Therefore, any automated analysis must
name attribute [21].                                              be able to explore these corner cases. We observe that the
Internationalized email. As similar to IDNs in subjec-            format of the certificate identifier as well as the matching
tAltName extensions, an internationalized email must be           rules closely resemble a regular expression matching problem.
converted into the ASCII representation before verifica-          In fact, we find that the set of accepted hostnames for each
tion. RFC 5321 also specifies that network administrators         given certificate identifier form a regular language.
must not define mailboxes (local-part@domain/address-literal)     3. Diversity of implementations. The importance and pop-
with non-ASCII characters and ASCII control characters.           ularity of the SSL/TLS protocol resulted in a large number
Email addresses are considered to match if the local-part         of different SSL/TLS implementations. Therefore, hostname
and host-part are exact matches using a case-sensitive and        verification logic is often implemented in a number of different
case-insensitive ASCII comparison respectively (e.g., MYE-        programming languages such as C/C++, Java, Python, and so
MAIL@example.com does not match myemail@example.com               forth. Furthermore, some of these implementations might be
but matches MYEMAIL@EXAMPLE.COM) [21]. Note that                  only accessible remotely without any access to their source
this specification contradicts that of the email addresses em-    code. Therefore, we argue that a black-box analysis algorithm
bedded in the common name that is supposed to be completely       is the most suitable technique for testing a large variety of
case-insensitive.                                                 different hostname verification implementations.
Email with IP address in the host part. RFCs 5280 and 6125
do not specify any special treatment for IP address in the host   B. HVLearn’s approach to hostname verification analysis
part of email and only allow email in rfc822Name format. The
rfc822Name format supports both IPv4 and IPv6 addresses in           Motivated by the challenges described above, we now
the host part. Therefore, an email with an IP address in the      present our methodology for analyzing hostname verification
host part is allowed to be present in a certificate [22].         routines in SSL/TLS libraries and applications.
Wildcard in email. There is no specification that wildcard           The main idea behind our HVLearn system is the following:
should be interpreted and attempted to match when they are        For different rules in the RFCs as well as for ambiguous rules
part of an email address in a certificate.                        which are not well defined in the RFC, we generate “template
Other identifiers in subjectAltName. There are other iden-        certificates” with common names which are specifically de-
tifiers that can be used to perform identity checks e.g.,         signed in order to check a specific rule. Afterward, we use
UniformResourceIdentifier(URI), SRVName, and otherName.           automata learning algorithms in order to extract a DFA which
However, most popular SSL/TLS libraries do not support            describes the set of all hostname strings which are matching
checking these identifiers and leave it up to the applications.   the common name in our template certificate. For example,
                      III. M ETHODOLOGY                           the inferred DFA from an implementation for the identifier
                                                                  template “aaa.*.aaa.com” can be used to test conformance with
   In this section, we describe the challenges behind automated
                                                                  the rule in RFC 6125 prohibiting wildcard characters from
testing of hostname verification implementations. Albeit small
                                                                  appearing in any other label than the leftmost label of the
in size, the diversity of these implementations and the sub-
                                                                  common name.
tleties in the hostname verification process make these im-
                                                                     Once a DFA model is generated by the learning algorithm,
plementations difficult to test. We then proceed to describe an
                                                                  we check the model for violations of any RFC rules or for
overview of our methodology for testing hostname verification
                                                                  other suspicious behavior. HVLearn offers two methods to
implementations using automata learning algorithms. We also
                                                                  check an inferred DFA model:
provide a brief summary of the basic setting under which
                                                                     Regular-expression-based rules. The first option allows
automata learning algorithms operate.
                                                                  the user to provide a regular expression that specifies a set of
A. Challenges in hostname verification analysis                   invalid strings. HVLearn can ensure that the inferred DFAs do
   We believe that any methodology for automatically ana-         not accept any of those strings. For example, RFC 1035 states
lyzing hostname verification functionality should address the     that only characters in the set [A-Za-z0-9] and the characters ‘-
following challenges:                                             ’ and ‘.’ should be used in hostname identifiers. Users therefore
1. Ill-defined informal specifications. As discussed in Sec-      can construct a simple regular expression that can be used by
tion II, although the relevant RFCs provide some exam-            HVLearn to check whether any of the tested implementations
ples/rules defining the hostname verification process, many       accept a hostname with a character outside the given set.
                          Learning Model                                     Learning model. We utilize learning algorithms that work in
                                                    Target System
                                                                             an active learning model which is called exact learning from
                                     Membership query
           Model         Learning
                                                                             queries. Traditional supervised learning algorithms, such as
            M            Algorithm                                           those used to train deep neural networks, work on a given set
                                                                             of labeled examples. In contrast, active learning algorithms in
                                Is model M correct?                          our model work by adaptively selecting inputs that they use
        Equivalence             Yes/No with counter-example                  to query a target system and obtain the correct label.
          Oracle                                                                Figure 2 presents an overview of our learning model. A
                                                                             learning algorithm attempts to learn a model of a target
Fig. 2. Exact learning from queries: the active learning model under which   system by querying the target system with inputs of its choice.
our automata learning algorithms operate.
                                                                             Eventually, by querying the target system multiple times, the
                                                                             learning algorithm infers a model of the target system. This
   Differential testing. The second option offered by HVLearn                model is then checked for correctness through an equivalence
is to perform a differential testing between the inferred model              oracle, an oracle that checks whether the inferred model
and models inferred from other implementations for the same                  correctly summarizes the behavior of the target system. If the
certificate template. Given two inferred DFA models, HVLearn                 model is correct, i.e., it agrees with the target system on all
generates a set of unique differences between the two models                 inputs, then the learning algorithm will output the generated
using an algorithm which we discuss in Section IV-E. This                    model and terminate. On the other hand, if the model is in-
option is especially useful for finding bugs in corner cases                 correct, the equivalence oracle will produce a counterexample,
which are not well defined in the RFCs.                                      i.e., an input under which the target system and the model
   We summarize the advantages of our approach below:                        produce different outputs. The learning algorithm then uses
                                                                             the counterexample to refine the inferred model. This process
   • Adopting a black-box learning approach ensures that
                                                                             iterates until the learning algorithm produces a correct model.
      our analysis method is language independent and we                        To summarize, a learning algorithm in the exact learning
      can easily test a variety of different implementations.                model is able to interact with the target system using two
      Our only requirement is the ability to query the target                types of queries:
      library/application with a certificate and a hostname of
                                                                                • Membership queries: The input to this type of query is a
      our choice and find whether the hostname is matching
                                                                                   string s and the output is Accept or Reject depending
      the given identifier in the certificate.
                                                                                   on whether the string s is accepted by the target system
   • As pointed out in the previous section, hostname verifica-
                                                                                   or not.
      tion is similar to regular expression matching. Given that
                                                                                • Equivalence queries: The input to an equivalence query
      regular expressions can be represented as DFAs, adopting
                                                                                   is a model M and the output of the query is either T rue,
      an automata-based learning algorithm for representing the
                                                                                   if the model M is equivalent to the target system on all
      inferred models for each certificate template is a natural
                                                                                   inputs, or a counterexample input under which the model
      and effective choice.
                                                                                   and target system produce different outputs.
   • Finally, an additional advantage of having DFA models is
                                                                             Automata learning in practice. The first algorithm for
      that we can efficiently compare two inferred models and
                                                                             inferring DFA models in the exact learning from queries
      enumerate all differences between them. This property is
                                                                             model was developed by Angluin [31] and was followed by a
      very important for differential testing as it helps us in
                                                                             large number of optimizations and variations in the following
      analyzing the ambiguous rules in the specifications.
                                                                             years. In our system, we use the Kearns-Vazirani (KV) algo-
Limitations. A natural trade-off of choosing to implement                    rithm [54]. The KV algorithm utilizes a data structure called
our system as a black-box analysis method is that we cannot                  the discrimination tree and it is in practice more efficient in
guarantee completeness or soundness of our models. However,                  terms of the amount of queries it requires to infer a DFA
each difference inferred by HVLearn can be easily verified by                model.
querying the corresponding implementations. Moreover, since                     The most significant challenge that one should address in
our system will find all differences among implementations,                  order to use the KV algorithm and other automata learning
it will not report a bug that is common among all implemen-                  algorithms in practice, is how to implement an efficient and ac-
tations unless a rule is explicitly specified for it, as described           curate equivalence oracle in order to simulate the equivalence
above. Finally, we point out that not all discrepancies among                queries performed by the learning algorithm. Since we only
systems are necessarily security vulnerabilities; they may                   have black-box access to the target system, any method for
represent equally acceptable design choices for ambiguous                    implementing equivalence queries is necessarily incomplete.
parts of the RFCs.                                                              In HVLearn, we use the Wp-method [49], for implementing
                                                                             equivalence queries. The Wp-method checks the equivalence
C. Automata Learning Algorithms                                              between an inferred DFA and a target system using only
   We will now describe the automata learning algorithms that                black-box queries to the target system. Essentially, the Wp-
allow us to realize our automata-based analysis framework.                   method approximates an equivalence oracle by using multiple
            HVLearn                                                                   the hostname verification function that takes an X.509 certifi-
       certificate templates     test certificate template                            cate and a hostname as input and returns accept/reject
                                                                SSL/TLS
                                                               hostname
                                                                                      depending on whether the provided hostname is matching the
                                                               verification           identifier in the certificate. We describe how we implement
    equivalence
                  LearnLib
                                   Wp-method’s test          implementation           this interface in Section IV-C. Our system includes a number
      query                          hostnames
                  Optimized
                  Wp-Method                                                           of certificate templates, which are certificates designed to test
                     counter-                                      match              the SSL/TLS implementation on a number of different rules as
                                     hostname                (hostname, test cert)?
                     example
                                 (membership queries)
                                                                                      described in Section IV-B. For each such template, HVLearn
      DFA            KV                                                               will learn a DFA model describing the set of hostnames
     model        algorithm           accept/reject
                                                                                      accepted by a given implementation for the given certificate
                                                                                      template. To produce a DFA model, HVLearn utilizes the
          output final model
          for test certificate template                                               LearnLib [59] library which contains implementations of both
                                                                                      the KV algorithm and the Wp-method. To avoid setting the
Fig. 3. Overview of learning a hostname verification implementation using             maximum depth of the Wp-method to impractically high
HVLearn.                                                                              values, we optimize the equivalence oracle as described in
                                                                                      Section IV-D.
membership queries. The algorithm is given as input the DFA                              Once a model is generated, our system proceeds to analyze
to be checked and an upper bound on the number of states in                           the model as described in Section IV-E. The results of our
the target system when modeled as a DFA, a parameter which                            analysis, both the inferred models and the differences between
we call depth. Then, the algorithm creates a set of test inputs                       models are then saved for reuse. Optionally, HVLearn can also
S, which are then submitted to the target system. If the target                       utilize the inferred models for a certificate template to extract a
system agrees with the DFA model on all inputs in the test set                        formal specification for the corresponding certificate template
S, then the DFA and the target system are proved equivalent                           as described in Section V-F.
under the assumption that the upper bound on the number of
                                                                                      B. Generating certificate templates
states of the target system is correct.
   In theory, one can set the depth parameter of the Wp-method                           To cover all different rules and ambiguous practices in
to a very large value in order to design an equivalence oracle                        hostname verification, we created a set of 23 certificates with
which is, in practice, complete. However, the size of the set                         different identifier templates, where each certificate is designed
of test inputs produced by the Wp-method is on the order of                           to test a specific rule from the specification. These certificates
O(n2 |Σ|m−n+1 ) where Σ is the input alphabet for the DFA, m                          are selected to cover all the rules we described in Section II.
is the upper bound on the number of states of the target system                       For example, a certificate with common name “xn--a*.aaa”
and n is the number of states in the input DFA. Therefore,                            will test if the implementation allows wildcards as part of an
using the Wp-method with a large depth (i.e., upper bound on                          A-label in an IDN, something which is explicitly forbidden by
the number of states of the target system) is impractical. Note                       RFC 6125. Our template certificates are self-signed X.509 v3
that, the bound on the number of test inputs produced by the                          certificates generated using the GnuTLS library. We choose
Wp-method is not a worst case bound; on the contrary, the                             to use GnuTLS for certificate generation because it allows
number of test inputs produced is usually of that order.                              identifiers with embedded NULL characters in both subject
   Consequently, it is essential for the efficiency of our system                     common name and SAN. The template identifier to be tested
to maintain a small alphabet for our DFAs and also set a small                        is placed in either Subject CN and/or SAN (as dNSName,
upper bound (depth) on the number of states of the target                             iPAddress, or email).
system while using the Wp-method. We address both of these
                                                                                      C. Performing membership queries
issues in the next section.
                                                                                         In order to utilize the learning algorithms in LearnLib
                  IV. A RCHITECTURE OF HVL EARN                                       (including the Wp-method), we implement a membership
   In this section, we describe the design and implementation                         query function that performs all queries to the target system.
of our system, HVLearn, based on automata learning tech-                              This function accepts input as a string and returns a binary
niques. Specifically, we describe the technical challenges that                       value. In our system, we use the hostname verification function
arise when we attempt to use automata learning algorithms in                          from the target SSL/TLS implementation. We note here that,
practice. We also summarize the optimizations that HVLearn                            since LearnLib is written in Java while many of our tested
implements to address these challenges and efficiently learn                          SSL/TLS implementations are written in C/C++/Python, we
DFA models of hostname verification implementations.                                  utilized the Java Native Interface (JNI) [10] to efficiently
                                                                                      perform membership queries to the target in such cases.
A. System overview
   Figure 3 presents an overview of how HVLearn is used to                            D. Automata learning parameters and optimizations
analyze the hostname verification functionality of an SSL/TLS                           In this section, we describe the architectural decisions and
library. To use HVLearn, the user provides HVLearn access to                          optimizations that we implemented to efficiently scale the KV
algorithm for testing complex real-world SSL/TLS hostname            model with an accepting hostname, then trivial models will
verification implementations.                                        be improved quickly without having to utilize excessive depth
Alphabet size. The first important decision we have to make          parameters in the Wp-method.
to utilize the KV algorithm is to select an alphabet that will          Recall here that the exponential term in the Wp-method is
be used by the algorithm. The alphabet refers to the set of          dependent on the difference between the number of states in
symbols that the learning algorithm will test.                       the model and the provided depth. Therefore, once we discover
   A straightforward approach is to use a very general set           an accepting state in the target system, the Wp-method with a
of characters such as the set of ASCII characters. However,          much smaller depth will still be able to explore many different
this will impose an unnecessary overhead in our system’s             aspects of the hostname verification implementation.
performance since the performance of both the KV algorithm              In order to generate an accepting hostname, we perform
and the Wp-method rely heavily on the underlying alphabet            the following test during an equivalence query and before
size. Our main insight is that we can reduce the alphabet to         calling the Wp-method. First, we search for any wildcard
a small set of representative characters that will thoroughly        characters (*) in the provided common name and replace them
test all different aspects of hostname verification. In particular   with random characters from our alphabet to obtain a concrete
we select the set Σ = { a, 1, dot, \s, @, A, =, *, x, n, -           hostname. Next, we check that the generated model and the
, \u4F60, NULL} as an input alphabet in our experiments.             target hostname verification implementation agree on a set
In the presented alphabet, ‘dot’ denotes the ‘.’ character, \s       of hostnames generated using this method. If not, we return
denotes the space character (ASCII value 32), NULL denotes           the hostname for which they differ as a counterexample. The
the zero byte character, and \u4F60 denotes the unicode              main advantage of this heuristic is that it allows us to quickly
character with hexadecimal value 4F60.                               produce accepting hostnames that uncover new states in the
   Note that this set of symbols is adequate for analyz-             target system without invoking the Wp-method with very large
ing hostname verification implementations since it includes          depth values. Once these states are uncovered, and the quality
characters from all different categories such as lowercase,          of the inferred models improve, the Wp-method, with a small
uppercase, digits, unicode, etc., as well as special characters      depth parameter, is utilized to discover additional states in the
like the NULL character. The lowercase characters ‘x’, ‘n’ in        target system.
conjunction with the ‘-’ character are necessary in order to
encode IDN hostnames. Finally, the inclusion of some non-            E. Analysis and comparison of inferred DFA models
alphanumeric characters such as the ‘=’ character allows us             After HVLearn outputs a model, the next task for our
to detect violations where an implementation accepts invalid         system is to analyze the produced model for RFC violations or,
hostnames.                                                           confusing/ambiguous rules in the RFC, to compare different
   Note that, even though the hostnames generated using this         inferred models and analyze any discrepancies found between
alphabet set will often not resolve to a real IP address when        different implementations.
processed as DNS names, it does not affect the accuracy              Analyzing a single DFA model. In the case of a single model,
of our analysis in any way. This is a side-effect the fact           we would like to determine whether the model is accepting
that the hostname verification routines are not responsible for      invalid hostnames prohibited by the RFC specification. If the
resolving the provided DNS name to an IP address. It simply          specification is unclear, our analysis can still be used in order
checks whether the given hostname matches the identifier in          to manually inspect the behavior of the implementation on the
the provided certificate.                                            specific certificate template besides the differential analysis
Caching membership queries. To avoid the communi-                    described below.
cation cost of repeated querying of the SSL/TLS im-                     Our system offers two options for performing analysis of
plementations with same inputs, we utilize LearnLib’s                a single model. First, our system generates inputs that will
DFALearningCache class to cache the results of the mem-              exercise all simple paths (i.e., paths without loops) that lead
bership queries. The cache is checked on each new query, and         to accepting states, in the inferred model. Intuitively, these
a cached result is used whenever found. This optimization            inputs are a small set of inputs that describe all different flavors
is particularly useful for cutting down the overhead of the          of hostnames that will be accepted for the given certificate
repeated queries generated by the Wp-method across multiple          template. By inspecting these certificates, we can determine if
equivalence queries.                                                 the implementation is accepting invalid hostnames. Second,
Optimizing equivalence queries. In practice, the first model         HVLearn allows the user to specify a regular expression
generated by the learning algorithm is usually just single           rule to be checked against the inferred model. In this case,
state DFA which rejects all hostnames. The reason is that            the user specifies a regular expression and HVLearn verifies
the learning algorithm is not able to generate any accepting         that the regular expression and the inferred model does not
hostname and thus cannot distinguish between the initial state       share any common strings. This option allows to easily check
and any other state in the target system. Sometimes, to force        certain RFC violations by utilizing simple regular expression
the KV algorithm to produce an accepting hostname using the          rules. For example, consider the rule specifying that no non-
Wp-method, a very large depth is required. This may cause            alphanumeric characters should be part of a matching host-
efficiency issues in the system. However, if we supply the           name. By specifying the regular expression rule “(.)*=(.)*”
we can check whether there exists any matching hostname                                  V. E VALUATION
that contains the ‘=’ character in the inferred model.
                                                                     The main goals of our evaluation of HVLearn to answer
Comparing unique differences between DFA models. For
                                                                  the following questions: (i) how effective HVLearn is in
analyzing certain corner cases which are not specified in the
                                                                  finding RFC violations in real-world hostname verification
RFC, testing a single model may not be enough. Instead, we
                                                                  implementations? (ii) How much do our optimizations help
compare the inferred models for different SSL/TLS imple-
                                                                  in improving the performance of HVLearn? (iii) how does
mentations and find inputs under which the implementations
                                                                  HVLearn perform compare to existing black-box or coverage-
behave differently. To perform this analysis, we utilize the
                                                                  guided gray-box techniques (iv) can HVLearn infer backward-
difference enumeration algorithm from [33]. In a nutshell, this
                                                                  compatible specifications from the inferred DFAs of real-world
algorithm computes the product DFA between two, or more,
                                                                  hostname verification implementations.
given models and then finds all simple paths to states in which
the DFAs are producing different output.                          A. Hostname verification test subjects
F. Specification Extraction                                          We use HVLearn to test hostname verification imple-
    As we discussed already, the RFC specifications leave cer-    mentations in six popular open-source SSL/TLS implemen-
tain aspects of hostname verification up to the implementations   tations, namely OpenSSL, GnuTLS, MbedTLS (PolarSSL),
by not specifying the correct behavior in all cases. In these     MatrixSSL, JSSE, and CPython SSL, as well as in two popular
cases imposing specific restrictions in the implementations is    SSL/TLS applications: cURL and HttpClient. Note that as
challenging since we have to be careful to avoid breaking         several libraries like OpenSSL versions prior to 1.0.1 do not
compatibility with existing implementations and valid cer-        provide support for hostname verification and leave it up to
tificates. In this section, we describe how the inferred DFA      the application developer to implement it. Therefore, applica-
models for the different certificate templates can be used to     tions like cURL/HttpClient that support different libraries are
infer a formal specification, which is compatible with existing   often forced to write their own implementations of hostname
implementations, for the cases where RFC specifications are       verification.
vague.                                                               Among the libraries that support hostname verification,
    Our main insight is the following: For each certificate       some like OpenSSL provide separate API functions for match-
template, we can use the DFA accepting the set of host-           ing each type of identifier (i.e., domain name, IP addresses,
names accepted by all SSL/TLS implementations as a formal         email, etc.) and leave it up to application to select the appro-
specification of the corresponding rule template. The intuition   priate one depending on the setting. In contrast, others like
behind this choice is that this specification is avoiding small   MatrixSSL combine all supported types of identifiers in one
idiosyncrasies of each library and it is thus very compact. On    function and figure out the appropriate by inspecting the input
the other hand, if a vulnerability exists in this specification   string. Table I shows the hostname verification function/class
then this vulnerability must also exist in all tested implemen-   names for all implementations that we tested and the types of
tations. Since each implementation is audited independently,      identifier(s) that each of them supports. The last column shows
our choice gives us confidence that our specification is se-      physical source lines of code (SLOC) for each host matching
cure from simple vulnerabilities while maintaining backward       function/class as reported by the SLOCCount [14] tool. Note
compatibility with the tested implementations.                    that the shown SLOC only count the parts of the code that
Computing the specification. In order to compute the cor-         perform hostname matching.
responding specification for each certificate template, we pro-
ceed as follows: First, we obtain DFA models for all hostname     B. Finding RFC violations with HVLearn
verification implementations under test using HVLearn. Next,         We use HVLearn to produce DFA models for each distinct
we compute the product DFA for all the inferred models. The       certificate template corresponding to different patterns from
product DFA accepts the intersection of the regular languages     the RFCs. Afterward, we detect potentially buggy behavior
of each DFA. We compute the product DFA using standard            by both performing differential testing of output DFAs as
automata algorithms [60]. The inferred formal specification for   well as checking individual DFAs for violations of regular-
our set of implementations is represented by the product DFA      expression-based rules that we created manually as described
of each DFA model. This product DFA can be then converted         in Section IV-E.
back to a regular expression to improve readability.                 Table II presents the results of our experiments. We eval-
    Finally, we would like to point out that computing the        uated a diverse set of rules from four different RFCs [16],
intersection of k DFAs have a worst case time complexity          [17], [21], [24]. We found that every rule that we tested is
of O(nk ) where n is the number of states in each DFA [55].       violated by at least one implementation, while on average each
However, in our case, the inferred DFAs are mostly similar        implementation is violating three RFC rules. Several of these
and thus, the product construction is very efficient because      violations have severe security implications (e.g., mishandling
intersecting two DFAs is not adding a significant number of       wildcard characters in international domain names, confusing
states in the resulting product DFA. We provide more evidence     IP addresses as domain names etc.). We describe these cases
supporting this hypothesis in Section V.                          along with their security implications in detail in Section VI.
                             TABLE I                                                 or vagueness in the specification itself. Our analysis suggests
  H OSTNAME VERIFICATION FUNCTIONS ( ALONG WITH THE TYPES OF                         that both cases are present in practice.
 SUPPORTED IDENTIFIERS ) IN SSL/TLS LIBRARIES AND APPLICATIONS

                                                                                     D. Comparing code coverage of HVLearn and black/gray-box
SSL/TLS       Version Supported Hostname Matching                          Approx.
Libs/Apps             Identifier(s) Function/Class Name                     SLOC     fuzzing
OpenSSL       ⩽ 1.0.1       –       –                                        –          In order to compare HVLearn’s effectiveness in finding
OpenSSL       ⩾ 1.0.2    CN/DNS     X509 check host                         314      bugs with that of black/gray-box fuzzing, we investigate the
                           IP       X509 check ip                           308
                           IP       X509 check ip asc                       417      following research question:
                         EMAIL      X509 check email                        314
GnuTLS         3.5.3    CN/DNS/IP gnutls x509 crt check hostname,           195      RQ.1: How HVLearn’s code coverage differ from black/gray-
                                  gnutls x509 crt check hostname2                    box fuzzing techniques?
                         EMAIL    gnutls x509 crt check email               149
MbedTLS        2.3.0     CN/DNS     mbedtls x509 crt verify,                193
                                                                                        We compare the code coverage of the tested hostname veri-
                                    mbedtls x509 crt verify with profile             fication implementations achieved by HVLearn and two other
MatrixSSL      3.8.4    CN/DNS/IP/ matrixValidateCerts                      130      techniques, black-box fuzzing, and coverage-guided gray-box
                         EMAIL                                                       fuzzing. We describe our testing setup briefly below.
JSSE            1.8     CN/DNS/IP HostnameChecker                           202      HVLearn: HVLearn leverages automata learning that invokes
CPython SSL    3.5.2    CN/DNS/IP match hostname                             59      the hostname verification matching routine with a predefined
HttpClient     4.5.2    CN/DNS/IP DefaultHostnameVerifier                   257      certificate template and alphabet set. HVLearn adaptively
cURL          7.50.3    CN/DNS/IP verifyhost,                               300
                                                                                     refines a DFA corresponding to the test hostname verification
                                  Curl verifyhost                                    implementation by querying the implementation with new
                                                                                     hostname strings. We measure the code coverage achieved
                                                                                     during the learning process until it finishes. We also monitor
   Note that the library with the most violations is JSSE                            the total number of queries N Q, which comes from both the
(four violations), while HttpClient is the application with the                      membership and the equivalence queries.
most violations (five violations). OpenSSL, MbedTLS, and                             Black-box fuzzing: With the same alphabet and certificate
CPython SSL only have two violations each, having common                             template used by HVLearn, we randomly generate N Q strings
the violation of matching invalid hostnames. The interested                          and query the target SSL/TLS hostname verification function
reader can find an extended description of our results in the                        with the same certificate template. Note that the black-box
Appendix (Table VIII).                                                               fuzzer generates independent random strings without any sort
                                                                                     of guidance.
C. Comparing unique differences between DFA models                                   Coverage-guided gray-box fuzzing: Unlike black-box
                                                                                     fuzzing, coverage-guided gray-box fuzzing tries to generate
   In order to evaluate the discrepancies between all differ-                        more interesting inputs by using evolutionary techniques to
ent hostname verification implementations, we computed the                           the input generation process. In each generation, a new batch
number of differences for each pair of hostname verification                         of inputs are generated from the previous generation through
implementations in our test set. Recall that for two given DFA                       mutation/cross-over and only the inputs that increase code
models we define the number of differences as the number of                          coverage are kept for further changes. Coverage-guided gray-
simple paths in the product DFA which lead to a different                            box fuzzing is a popular technique for finding bugs in large
output being produced by the two models [33].                                        real-world programs [6], [11].
   Table III presents the results of our experiment. For exam-                          To make it a fair comparison with HVLearn, we imple-
ple, OpenSSL and GnuTLS have 95 discrepancies in total. This                         mented our own coverage-guided gray-box fuzzer as existing
is obtained by summing up the number of unique paths that are                        tools like AFL do not provide an easy way of restricting
different between the inferred DFAs for each common name                             the mutation outputs within a given alphabet. With the same
in Table VIII. Note that all pairs of implementations contain                        alphabet set, we initialize the fuzzer with a set of strings of
a large number of unique cases under which they produce a                            varying lengths as the seeds maintained in a queue Q. The
different output. As seen in Table III, each pair of tested im-                      seeds are then used by the fuzzer to query the target hostname
plementation has 127 unique differences on average between                           verification implementation. After finishing querying, using
them. We note that some differences only imply ambiguous                             the seeds, the fuzzer gets the string S = dequeue(Q). It
RFC rules while some reveal the potential invalid hostnames                          randomly mutates one character within S and obtains S 0 . Then
or RFC violation bugs. The interested reader can find a more                         it uses the mutated S 0 to query the target. If the mutated
detailed list of the unique strings that each implementation                         string S 0 increased code coverage, we store it in the queue for
is accepting in Table VIII in the Appendix. In any case,                             further mutation, i.e., enqueue(S 0 , Q). Otherwise, we throw
we find the fact that all implementations of such a security                         it away. The fuzzer is thus guided to always mutate on the
critical component of the SSL/TLS protocol present such a                            strings that have better code coverage. The fuzzer iteratively
larger number of discrepancies to be an alarming issue since                         performs this enqueue/dequeue operations for N Q rounds,
it signifies either a poor implementation of the specification                       and we obtain the final code coverage COVrandmu of each
                                                          TABLE II
   A SUMMARY OF RFC VIOLATIONS AND DISCREPANT BEHAVIORS FOUND BY HVL EARN IN THE TESTED SSL/TLS LIBRARIES AND APPLICATIONS




                                                                                                                                                                                                    CPython SSL




                                                                                                                                                                                                                                      HttpClient*
                                                                                                                                                                                 MatrixSSL




                                                                                                                                                                                                                         HttpClient
                                                                                                                                                                       MbedTLS
                                                                                                                                                  OpenSSL

                                                                                                                                                            GnuTLS




                                                                                                                                                                                                                  cURL
                                                                                                                                                                                             JSSE
      RFC Violations                                                                                                       RFC
      Invalid hostname character
      Only alphanumeric and ‘-’ matches in hostname                                                                         1035                  7         7          7         3           7      7             7      7            7
      Case-insensitive hostname
      Match CN in case-insensitive manner                                                                         5280, 6125                      3         3          3         3           3      3             3      7            7
      Wildcard
      Not attempt to match wildcard not in left-most label (CN/DNS: aaa.*.aaa)                                              6125                  3         3          3         3           7      3             3      7            3
      IDN and wildcard
      Not attempt to match wildcard fragment in IDN (xn--a*.aaa)                                                            6125                  3         3          3         3           7      3             3      7            3
      Common name and subjectAltName
      No CN checked when DNS presents                                                                                       6125                  3         3          3         7           3      3             3      3            3
      No CN checked when any SAN ID presents                                                                                6125                  –         7          –         7           7      3             3      7            7
      Email-based certificate
      Case-sensitive on local-part of email attribute in SAN                                                                5280                  3         3          –         7           –      –             –      –            –
      IP address-based certificate
      Not attempt to match IP address with DNS (DNS: 1.1.1.1)                                                               1123                  –         7          7         7           3      3             3      3            3

      Discrepancies
      Wildcard
      Attempt to match wildcard with empty label (hostname: .aaa.aaa with CN/DNS: *.aaa.aaa)                                 –                    3         3          7         7           7      7             7      3            3
      Attempt to match wildcard in public suffix (CN/DNS: *.co.uk)                                                          6125                  3         7          3         3           3      3             3      3            7
      Embedded NULL character
      Allowed NULL character in CN                                                                                                      –         3         3          3         7           3      3             3      3            3
      Allowed NULL character in SAN                                                                                                     –         3         3          7         7           3      3             3      3            3
      Match NULL character hostname: b.b\0.a.a, CN/DNS: b.b\0.a.a                                                                       –         7         7          7         7           3      3             7      3            3
      Other invalid hostname
      Partially match suffix (hostname: .a with CN/DNS: a.a, a.a.a)                                                         1035                  3         7          7         7           7      7             7      7            7
      Match trailing dot (hostname: aaa.aaa with CN/DNS: aaa.aaa)                                                            –                    7         7          7         7           7      7             3      7            7

      HttpClient*: HttpClient with PublicSuffixMatcher
      For RFC Violation: 3= OK, 7= RFC violate, – = libs/apps do not support • For Discrepancies: 3= Accept, 7= Reject



                                                                                                                                        100
                          TABLE III
                                                                                                                                         90
N UMBER OF UNIQUE DIFFERENCES BETWEEN AUTOMATA INFERRED FROM
                                                                                                                                         80
                                                                                                                   % of line coverage




              DIFFERENT SSL/TLS IMPLEMENTATIONS
                                                                                                                                         70
                                                                                                                                         60
                                                       MatrixSSL




                                                                                    HttpClient
                                             MbedTLS
                          OpenSSL

                                    GnuTLS




                                                                          CPython




                                                                                                                                         50
                                                                                                                                         40
                                                                   JSSE




                                                                                                 Curl




                                                                                                                                         30
                                                                                                                                         20                                  HVLearn
            OpenSSL        –        95       98        99          282    92        482          187
                                                                                                                                                      Coverage-guided gray-box fuzzing
            GnuTLS         –         –        6        38          127    34        214           56                                     10
                                                                                                                                                                     Blackbox fuzzing
            MbedTLS        –         –       –         44          97     28        220           50                                      0
            MatrixSSL      –         –       –         –           37     25         58           94                                          0        10000 20000 30000 40000 50000
            JSSE           –         –       –         –            –     69        177          110                                                                 Number of queries
            CPython        –         –       –         –            –     –         108           54
            HttpClient     –        –        –          –          –       –          –          414
            Curl           –        –        –          –          –       –          –           –
                                                                                                        Fig. 4. Comparison of code coverage achieved by HVLearn, gray-box fuzzing,
                                                                                                        and black-box fuzzing for OpenSSL hostname verification.



functions SSL/TLS implementations. Note that we keep the                                                hostname verification.
test certificate template fixed during the entire test.
   We use the percentage of lines executed, which are extracted                                            Result 1: HVLearn achieves 11.21% increase in code
by Gcov [51], as the indicator for the code coverage. Consider-                                            coverage on average when comparing to the black/gray-
ing that hostname verification is a small part of an SSL/TLS                                               box fuzzing techniques.
implementation, we do not compute the percentage of lines
covered with respect to the total number of lines. Instead, we                                             Therefore, let LE(f ) be the number of lines executed of
calculate the percentage of line coverage within each function                                          function f in the SI and L(f ) be the total number of lines
and only take into account the functions that are related to                                            of f , the code coverage can be defined in the following equa-
                     Pm
                           LE(f )
                                i                                                                        35000
tion: coverage = Pi=1  m          , where f1 , f2 , · · · , fm are the
                       i=1 L(fi )
functions that are relevant to hostname verification. Figure 4                                           30000




                                                                                     Number of queries
illustrates the code coverage comparison, which shows that                                               25000
HVLearn achieves significantly better code coverage compared
                                                                                                         20000
to the black/gray-box fuzzing techniques.
                                                                                                         15000
E. Automata learning performance
                                                                                                         10000
                                                                                                                                             *.google.com
   HVLearn is largely based on the KV algorithm and the                                                                                         twitter.com
                                                                                                          5000
Wp-method in order to perform its analysis. It is therefore                                                      9           10         11        12          13           14
crucial to thoroughly evaluate the different parameters of these                                                                       Alphabet size
algorithms and their impact on the performance of HVLearn.
We will now evaluate the effect of each different parameter              Fig. 5. Number of queries required to learn an automaton with different
                                                                         alphabet sizes (with Wp-method depth=1 and equivalence query optimization).
of the learning algorithms in the overall performance of
HVLearn.
                                                                                                     TABLE IV
RQ.2: How does the alphabet size affect HVLearn’s perfor-                   HVL EARN PERFORMANCE FOR COMMON NAME *. A A A . A A A WITH
                                                                              W P - METHOD DEPTH =1 (CP YTHON SSL IMPLEMENTATION )
mance in practice?
   As discussed in Section III-C, the alphabet size impacts                      W/o Cache                     With Cache
                                                                         Alphabet #Queries                   #Queries                 Average
the performance of our system. In theory, the performance of               Size                                      Equivalence        Time
                                                                                    Total   Total Membership
both the KV algorithm and the Wp-method, depends on the                                                      Counterexample Membership (sec)
                                                                            2        883     226     136           2             90     3.10
size of the input alphabet. We perform two experiments for                  5      3,049    1,582    436           2            1,146  21.61
evaluating the extent to which the alphabet size affects the                7      5,163    3,156    636           2            2,520  42.24
                                                                            10     9,339    6,522    936           2            5,586  86.92
performance of our learning algorithm component in practice.                15     18,979  14,812   1,436          2           13,376  196.35
In the first experiment, we evaluate the effect of increasing
the size of the alphabet in real world DNS names. For this                                               120000
                                                                                                                     (n): n inferred states                        (11)
experiment, we used our system in the default configuration                                              100000
                                                                                     Number of queries
with all optimizations (e.g., query cache and EQ optimizations)                                           80000
enabled and we set the Wp-method depth to 1. We used the
                                                                                                          60000                                                 (11)
CPython’s SSL implementation as the hostname verification
function for these experiments.                                                                           40000
                                                                                                                                                         (11)
   Figure 5 shows the results of our experiment. Notice that,                                             20000
                                                                                                                                                       (1)
starting from an alphabet size of 9, each additional character                                                       (1) (1) (1) (1) (1) (1)
                                                                                                                 0
we include in the alphabet will cause the learning algorithm                                                         1   2        3    4     5    6    7      8        9   10
to perform at least 10% more queries in order to produce a                                                                            WP-method depth
model, for both DNS names, while this percentage is only
increasing when in larger alphabet sizes.                                Fig. 6. The number of queries needed to learn the DFA model of CPython
                                                                         certificate verification for different Wp-method depth values (without equiv-
   We also measure the effect of increasing the alphabet size            alence query optimization).
on the overall running time of our system. To perform this
experiment we used the same setup as our previous experiment
and evaluated the performance of HVLearn with a certificate              “*.aaa.aaa” with and without utilizing a membership query
containing the common name “*.aaa.aaa”. Table IV shows                   cache over different alphabet sizes. We notice that the cache
the results of this experiment. We notice that the increase              is consistently helping to reduce the number of membership
in the membership queries directly translates in an increased            queries required to infer a model. Overall, the cache is
running time. Specifically, by adding 5 additional characters            reducing the number of queries by 42%, thus significantly
in the alphabet (from 2 to 5), we notice that the running time           improving the efficiency of our system. Therefore, for the rest
increases 7 times. Similar results can be observed when we               of the experiments in this section, we utilize our system with
add more characters in the alphabet set.                                 the membership query cache enabled.
   Result 2: Adding just one symbol in the alphabet set                      Result 3: Membership cache is offering, on average,
   incurs at least 10% increase in the number of queries.                    a 42% decrease on the number of membership queries
   Thus, the succinct alphabet set utilized by HVLearn is                    made by the learning algorithm.
   crucial for the system’s performance.
                                                                         RQ.4: How does Wp-method’s depth parameter affect
RQ.3: Does membership cache improve the performance of                   HVLearn’s performance and accuracy?
HVLearn?                                                                    As discussed in Section IV-D, the number of queries per-
  Table IV presents the number of queries required to infer              formed by the Wp-method is exponential on the customizable
a model for the certificate template with common name                    depth parameter. We evaluated how this exponential term is
affecting the number of queries in practice and moreover, what                                TABLE V
is the effect of different values of the depth parameter on the      T HE NUMBER OF QUERIES NEEDED TO LEARN THE DFA MODEL OF
                                                                     CP YTHON CERTIFICATE VERIFICATION FOR DIFFERENT W P - METHOD
correctness of the models inferred by HVLearn.                                                                                            DEPTH VALUES
   For our first experiment, we explore the correlation between
                                                                      Wp.            W/o EQ Optimization                                                                With EQ Optimization
the overall number of membership queries and the corre-              Depth       #Queries #States Complete?                                                         #Queries #States Complete?
sponding depth parameter. The results of this experiment are           1                7    1         7                                                                 226   11          3
                                                                       2               15    1         7                                                                 448   11          3
presented in Figure 6 and Table V. In order to ensure that             3               31    1         7                                                                 890   11          3
the experiment finishes within a reasonable time, we further           4               63    1         7                                                               1,778   11          3
                                                                       5              127    1         7                                                               3,554   11          3
reduced the alphabet size only to two symbols. the results             6              255    1         7                                                               7,104   11          3
clearly show that the dependence between the depth parameter           7              511    1         7                                                              14,207   11          3
                                                                       8           28,415   11         3                                                              28,415   11          3
and the overall number of queries performed by the learning            9           56,831   11         3                                                              56,831   11          3
algorithm is clearly exponential, and in fact exactly matches         10          113,663   11         3                                                             113,663   11          3
the O(|Σ|d ) bound where d is the depth parameter as discussed
in Section IV-D. Notice that when the depth parameter of the                                                                                                                                                                          0
                                                                                                                                                                        0          a
Wp-method is set to a value less than 8, HVLearn fails to                         0
                                                                                                                                                                                                                                  a
infer any aspect of the target implementation and outputs a                                a
                                                                                                                                                                           dot
                                                                                                                                                                                                                         5        a
single state DFA model that rejects all hostnames as shown in                    dot           5         a                                                              4
                                                                                                                                                                                                                            dot
Table V.                                                                                           dot                                                                 a                                                 4
                                                                             2                     3
   Result 4: Large values of the Wp-method depth pa-                                                                                                          3                                                         a
                                                                             a                     a
   rameter result in impractical running times while small                                                                                              dot                                                        3                      dot
                                                                             1                     4
   values result in incomplete models.                                                                                                              1                           dot                          dot
                                                                                      dot dot
                                                                                                                                                                                                         1                   dot
                                                                     dot                   6                             dot                    a             a
RQ.5: How much improvement is offered by the equivalence                     a                     a         a
                                                                                                                                                                                                    a              a
                                                                                                                                          2         dot
query optimization in HVLearn?                                                   dot               7
                                                                                                                                                                                               2             dot
                                                                                                                                     a        dot
   The previous experiment clearly demonstrates that the Wp-                           dot a                                                                                               a       dot

method alone is not efficient enough to accurately analyze a                           8               a dot                                        5     a dot                                               6        a dot

variety of different templates with HVLearn. Using our full                (a) OpenSSL                                               (b) GnuTLS, JSSE,                                             (c) MbedTLS,
alphabet, inferring a complete model for the common name                                                                               and HttpClient                                              MatrixSSL, and
                                                                                                                                                                                                      CPython
“*.aaa.aaa” requires the depth parameter to be ≥ 8 as shown
in Table V. With our full alphabet of 13 symbols this would                                                                           0

                                                                                                                                                                   0
require around 230 queries based on the query complexity of                                                                       a

the algorithm. We find that even running the algorithm with a                                                                 5   a                                        a

depth of 6, which is still not able to infer a complete model,                                                                 dot                                          6         a

results in more than 68 million queries.                                                                                      4
                                                                                                                                                                                dot

   Therefore, our equivalence query optimization is a crucial                                                                a                                                 5


component of HVLearn that allows it to produce accurate                                                                  3
                                                                                                                                                                                       a
DFA models that can be used to evaluate the security and                                                         dot                          dot
                                                                                                                                                                  dot                      4
                                                                                                                 1
correctness of the implementations. As we can see from                                                                                                                                             dot
Table V, using our equivalence query optimization and a                                                      a                    dot
                                                                                                                                                                                dot                  3
depth parameter of just 1, our system is able to produce a                                         2                      a
                                                                                                                                                                                               a     a
complete model for a given certificate template. Running the                                       dot           dot
                                                                                                                                                                                                     1        dot
same experiment with the alphabet size 15, we found that                              a            7


HVLearn infers a correct model using only 14,812 queries as                                    a dot                                                                                               a dot

shown in Table IV.                                                                                                   6   a dot                                                                 2     a dot

   Result 5: EQ optimization is providing, in some cases,                                                (d) cURL                                                       (e) Intersection
   over one order of magnitude improvement on the number           Fig. 7. SSL/TLS implementations’ DFA and intersection DFA with CN/DNS:
   of queries required to infer a complete DFA model.              *.a.a and alphabet: {a, .}


F. Specification Extraction                                        identifier. Nevertheless, Figure 7 demonstrates that even for
   Let us now examine how we can utilize HVLearn’s spec-           this simple rule, the corresponding DFA models for different
ification extraction functionality in order to infer a practical   implementations present obvious discrepancies. For example,
specification for the rule corresponding to the common name        DFA model (a) accepts the hostname “.a”, model (b) accepts
“*.a.a”. This rule corresponds to the basic wildcard certificate   the hostname “.a.a”, while model (d) accepts the hostname
case where a wildcard is found in the leftmost label of the        “a.a.a.”. Only model (c) perform the most intuitive matching
by only accepting hostnames matching the regular expression             Using HVLearn, we identified that both JSSE and Http-
“a+.a.a” (here ‘+’ denotes one or more repetitions of the            Client (without using PublicSuffixMatcher in construc-
character ‘a’).                                                      tor) were also vulnerable to this issue. Our tool also reported
   By computing the intersection between all DFA models, we          that the other tested libraries/applications were not affected.
obtain the intersection DFA model (e). Our first observation
is that the intersection DFA has only 6 states and it is thus        B. Confusing order of checking between CN and SAN identi-
very compact as discussed in Section V-F. Furthermore, we            fiers.
notice that the intersection DFA is the same as DFA (c)                 RFC 6125 explicitly specifies that applications should not
that corresponds to the most natural implementation of the           attempt to match the hostname with the subject CN when any
corresponding rule. More importantly, even if we compute the         subjectAltName identifiers are present, regardless of whether
intersection without including model (c), we will still infer        there is a match in subjectAltName as shown in Section II).
the same specification. Thus, we conclude that computing the         We found a number of violations of that rule using HVLearn as
intersection of DFA models, even from implementations which          described in Table II. We also found that MatrixSSL exhibits
fail in different ways, can often produce compact and natural        an interesting behavior in such cases.
specifications.                                                         More specifically, MatrixSSL matches the CN identifier
Size of inferred models. In general, the actual size of the          before attempting to match any identifiers in the SAN even
inferred models is heavily dependent on the implementation           if they are present in the certificate. Note here that the CN
details of the tested system. However, we expect that the DFA        does not have any strong restrictions on its content and may
models inferred by our system will have around l + 2 states,         even contain non-FQDN characters (e.g., UTF-8).
where l is the length of the common name in the certificate             Therefore, it is possible that certain certificate authorities,
template. Indeed, if we consider the inferred DFAs in Figure 7       following the instructions in RFC 6125, will not check the CN
we can notice that, for the common name “*.a.a” with length          in the presence of SAN identifiers and will issue a certificate
l = 5, the average number of states is 6.9, which is very close      regardless of the value in the CN as long as the user is
to the expected 7 states. Intuitively, the reasoning behind this     successfully identified as the owner of the domains in the SAN
size is that a DFA for matching a string of length l is expected     identifier. Albeit natural, this choice will render applications
to have l + 2 states in general where l states are moving the        using MatrixSSL vulnerable to a simple man-in-the-middle
DFA forward towards the accepting state while the additional         attack.
2 states include the initial state and a sink state where the DFA       Specifically, an attacker can generate a signed certificate
goes when no match is found.                                         with a SAN identifier for a domain owned by the attacker, say
                                                                     “www.attacker.com” and have the CN field set to the victim
                 VI. C ASE S TUDY OF B UGS                           domain, say “www.bank.com”. MatrixSSL will first check
                                                                     the CN and omit to check the SAN identifiers. Therefore,
   The goal of our study aims at understanding the severity of
                                                                     MatrixSSL will allow the attacker to hijack any domain which
potential exploitation by incorrect or unclear hostname check
                                                                     is present in the CN field (e.g., www.bank.com).
in certificate verification. We are also interested in finding any
inconsistency of SSL/TLS implementations’ hostname checks            C. Hijacking IP-based certificates
with what RFC specifies. In this section, we present some               Section 2.3.1 of domain names implementation and speci-
interesting cases we achieved from the result of our experiment      fication in RFC [16] dictates that the preferred name (label)
or corner cases we found.                                            should only begin with a letter character. However, RFC [17]
                                                                     changed this restriction to allow the first character to be a letter
A. Wildcards within A-labels in IDN identifiers
                                                                     or a digit. This change introduced valid DNS names which are
    RFC 6125 strictly prohibits matching a certificate with an       identical to IP addresses.
identifier containing wildcards embedded within an A-label              Unfortunately, the fact that IP addresses are also valid DNS
of an IDN. For a certificate with an identifier of the form          names may open a new avenue for an attack as we describe
“xn--aa*”, it is very difficult to predict the set of unicode        below. Notice that, for this attack to become practical, a
strings that will be matched after they are transformed into the     numeric Top Level Domain (TLD) in the range 0-255 must
punycode format due to the complexity of the transformation          exist, something that is currently unavailable. Nevertheless,
process. This inability to easily predict the set of hostnames       our description should be taken as a precautionary note for
which match an A-label with an embedded wildcard often               new TLDs.
present avenues for man-in-the-middle attacks.                          The attack is based on the fact that certain implementations
    Hostname verification implementations which match iden-          first check if the given hostname matches the certificate’s
tifiers with wildcards embedded within A-labels have been            CN/SAN as a domain name and afterward as IP address.
found recently in the Ruby OpenSSL extension [28] and the            Therefore, consider an attacker controlling an IP address,
NSS library used by Mozilla Firefox [27]. These issues were          say 80.50.12.33 and holding an IP-based certificate with that
identified as security vulnerabilities by the developers of the      IP address. Then, assuming that “33” is a valid TLD, the
corresponding products.                                              same entity is automatically in possession of a certificate for
                            TABLE VI                                                                              TABLE VII
 B EHAVIORS OF SSL/TLS IMPLEMENTATIONS FOR X.509 CERTIFICATES                           S UPPORT FOR EMBEDDED NULL CHARACTER IN CN/ SUBJECTA LT NAME
          WITH IP V 4 ADDRESSES IN CN/ SUBJECTA LT NAME                                                IN DIFFERENT SSL/TLS LIBRARIES

   SSL/TLS                              Certificate with IPv4 in                        SSL           ID     Allows Function / Structure Name                   Returns
   Libs/Apps              Subject CN                 SubjectAltName DNS                 Libraries           Embedded                                            Length
   OpenSSL                  app                             app                                              NULL?
   GnuTLS                   accept                          accept
   MbedTLS                  accept*                         accept*                     OpenSSL       CN       3       X509 NAME get text by NID()                3
   MatrixSSL                accept                          accept                                    CN       3       X509 NAME get text by OBJ()                3
   JSSE                     reject                          reject                                    CN       3       X509 NAME get index by NID()1              3
   CPython SSL              accept                          reject                                    CN       3       X509 NAME get index by OBJ()1              3
   HttpClient                 accept                         reject                                   SAN      3       X509 get ext d2i()2                        3
   cURL                       accept                         reject
   app: library lets application choose the identifier type.                            GnuTLS        CN       3       gnutls x509 crt get dn by oid()            3
   accept*: library/application does not support IP-based certification verification                  SAN      3       gnutls x509 crt get subject alt name()     3
   but allows IPv4-format string in hostname verification.                              MbedTLS       CN       3       mbedtls x509 name                          3
                                                                                                      SAN      7       mbedtls x509 sequence                      3
                                                                                        MatrixSSL     CN       7       x509DNattributes t                         7
                                                                                                      SAN      7       x509GeneralName t                          3
the domain name “80.50.12.33” and can perform man-in-the-
middle attacks on that domain!                                                          JSSE          CN       3       getSubjectX500Principal()                  7
                                                                                                      SAN      3       getSubjectAlternativeNames()               7
   We evaluated whether this attack is feasible in current
                                                                                        CPython SSL                — Functionality not exposed to apps —
SSL/TLS implementations. Table VI shows the results of our                              1
                                                                                          followed by X509 NAME get entry()
evaluation. All libraries/applications which are marked with                            2
                                                                                          followed by sk GENERAL NAME value()
an accept either in the subject CN or subjectAltName DNS
columns are vulnerable to this attack. Even though this issue
is not currently exploitable, it presents a security risk for these                       Despite the fact that SSL/TLS implementations take pre-
libraries in case numerical TLDs are introduced in future.                             cautions against embedded NULL byte attacks, this doesn’t
                                                                                       imply that the applications using the libraries are also secure.
D. Embedded NULL bytes in CN/SAN identifiers                                           Indeed, applications implementing the hostname verification
                                                                                       functionality must ensure that they do not use vulnerable
    In 2008, Kaminsky et al. [53] demonstrated a vulnerabil-                           functions such standard string comparison function from libc
ity in the hostname verification implementations of popular                            (e.g., strcmp, strcasecmp, fnmatch), as they match
SSL/TLS libraries where early NULL-byte (\0) terminations                              strings in NULL-termination style.
in an X.509 CN causes some libraries to recognize different                               In order to evaluate the security of applications using
CN values. In a nutshell, a client accepts certificate from an                         SSL/TLS libraries against embedded NULL byte attacks, we
attacker’s subdomain “www.bank.com\0.attacker.com” when                                conducted a manual audit against several applications. Un-
attempting to connect to “www.bank.com” and therefore allow                            fortunately, we found several popular applications being vul-
the attacker to hijack the connection.                                                 nerable to man-in-the-middle attacks using embedded NULL
    In order to defend against this attack, two lines of defense                       byte certificates. Some examples include FreeRadius server [8]
were followed. The first option was to reject any certificate                          which is one of the most widely deployed RADIUS (Remote
containing NULL bytes embedded within any CN/SAN iden-                                 authentication dial-in user service) servers, OpenSIPS [12]
tifiers. The second line was to simply patch the API functions                         which is a popular open-source SIP server, Proxytunnel [13]
which retrieve the CN/SAN identifiers from the certificate in                          which is a stealth tunneling proxy, and Telex Anticensorship
order to recover the entire identifier even in the presence of                         system [15] which is an open-source censorship-circumventing
embedded NULL bytes.                                                                   software.
    We thoroughly evaluated the defense implemented in each                               An important takeaway from this section is that embedded
SSL/TLS library. Table VII presents the results of our evalu-                          NULL byte attacks, even though addressed at the SSL/TLS
ation. The second column describes whether the SSL/TLS li-                             library level, still present a very realistic and overlooked threat
brary allows embedded NULL bytes, the third column presents                            for applications using these libraries.
the corresponding API function which is used to retrieve the
                                                                                                              VII. R ELATED W ORK
CN/SAN identifier, and the fourth column describes whether
the API call also returns the length of the corresponding                              A. Securing SSL/TLS Implementations
CN/SAN identifier. Note that this is a very important feature                             The security analysis of different components of SSL/TLS
since, otherwise, the application using the SSL/TLS library                            implementations has been examined in a large number of
cannot know where the identifier string is terminating. We no-                         projects. We provide a summary of the most related projects
tice that this important feature is implemented by all libraries                       below. The key difference between these projects and ours
except JSSE. Notice though that, even though JSSE is not                               is that none of these projects focused on automatically an-
returning the length of the corresponding identifier, since JSSE                       alyzing the correctness of the hostname verification part of
is written in Java, it is not vulnerable to the embedded NULL                          SSL/TLS certificate validation implementations. Prior works
byte attacks because Java strings are not NULL terminated.                             didn’t cover analyzing hostname verification in detail primarily
due to the hardness of accurately modeling the implementa-           B. Automata inference and applications
tions. In this paper, we solve this problem by using automata           Angluin [31] invented the L∗ algorithm for learning deter-
learning techniques and demonstrating that they can accurately       ministic finite automata (DFA) from membership and equiv-
and efficiently infer DFA models of hostname verification            alence queries. In the following years, many variations and
implementations in a black-box manner.                               optimizations were developed, including the Kearns-Vazirani
                                                                     algorithm used in HVLearn [54]. The interested reader can
Automated Analysis of SSL/TLS implementations.
                                                                     read the paper by Balcazzar et al. [34] for a unified presen-
Brubaker et al. [36] and subsequently Chen et al. [39] used
                                                                     tation of popular algorithms. Automata learning algorithms
mutation-based differential testing to find certificate validation
                                                                     have been applied to infer models for various protocols such
issues. However, in their case, the hostname verification
                                                                     as EMV bank cards [29], electronic passports [30], TLS
functionality of the libraries under test is disabled in order
                                                                     protocols [41] and TCP/IP implementations [47], [48].
to discover other certificate validation issues and thus, they
                                                                        Argyros et al. [33] utilized symbolic finite automata learning
cannot uncover bugs discovered by our work. He et al. [52]
                                                                     algorithms to create a differential testing framework and lever-
used static analysis to detect incorrect usage of SSL/TLS
                                                                     aged it to discover bugs in Web application firewalls. While
libraries APIs. Somorovsky [61] created TLS-Attacker a tool
                                                                     our approach is similar in nature, we counter the problem
to fuzz the TLS implementations systematically. However,
                                                                     of large alphabets by using only the necessary symbols for
TLS-Attacker focused on finding bugs in the protocol level
                                                                     our analysis. Moreover, instead of using differential testing to
and did not analyze the hostname verification functionalities
                                                                     simulate equivalence queries, our approach uses an optimized
of SSL/TLS implementations. Finally, de Ruiter and Poll [41]
                                                                     version of the Wp-method, which offers stronger correctness
used automata learning algorithms to infer models of the
                                                                     guarantees.
TLS protocol and manually inspected the machines to find
bugs. Contrary to our approach, where we focus on analyzing                                   VIII. C ONCLUSION
hostname verification implementations, their work focused
                                                                        We designed, implemented and extensively evaluated
on the TLS state machine induced by the different messages
                                                                     HVLearn, an automated black-box automata learning frame-
exchanged during the TLS handshake.
                                                                     work for analyzing different hostname verification imple-
Certificate validation. Georgiev et al. [50] studied different       mentations. HVLearn supports automated extraction of DFA
ways that SSL/TLS API was abused in non-browser software.            models from multiple different implementations as well as
They manually identified pervasive incorrect certificate valida-     efficient differential testing of the inferred DFA models. Our
tion in different SSL/TLS implementations on which critical          extensive evaluation on a broad spectrum of hostname verifi-
software rely. Fahl et al. [45] investigated the incorrect usage     cation implementations found 8 RFC violations with serious
of SSL/TLS API in Android apps. However, unlike HVLearn,             security implications. Several of these RFC violations could
none of these projects looked into the implementations of the        enable active man-in-the-middle attacks. We also discovered
API functions.                                                       121 unique differences on average between each pair of
                                                                     inferred DFA models. In addition, given that the RFC specifi-
Parsing X.509 certificates with embedded NULL character.             cations are often ambiguous about corner cases, we expect
Kaminsky et al. [53] demonstrated that several hostname ver-         that the models inferred by HVLearn will be very useful
ification implementations mishandled embedded NULL char-             to the developers for checking their hostname verification
acters in X.509 certificates and can be used to trick a CA into      implementations against the RFC specifications and therefore
issuing a valid leaf certificate with the wrong subject name.        can help in reducing the chances of undetected security flaws.
However, they found this issue manually and did not have             We have made HVLearn open-source so that the community
any automated techniques for analyzing hostname verification         can continue to build on it. The framework can be accessed
implementations. Moreover, these issues were supposed to be          at https://github.com/HVLearn.
fixed by the SSL/TLS implementations but we find that several
applications using incorrect APIs for extracting the identifier                           IX. ACKNOWLEDGMENTS
strings from a certificate still suffer from these vulnerabilities      We would like to thank the anonymous reviewers for
as described in Section VI.                                          their feedback. This work was supported by the NSF under
                                                                     grants CNS-13-18415 and CNS-16-17670. Author Suphannee
Cryptographic attacks and implementation bugs. There is              Sivakorn is also partially supported by the Ministry of Science
a large body of work on various cryptographic attacks on             and Technology of the Royal Thai Government. Any opinions,
the SSL/TLS protocol implementations. The interested reader          findings, conclusions, or recommendations expressed herein
may consult [40] for a survey. These attacks include various         are those of the authors, and do not necessarily reflect those
protocol based attacks [35], [43], [44], [46] as well as timing      of the US Government or the NSF.
attacks [37] and flaws in pseudo-random number genera-
tors [57]. Besides cryptographic attacks, implementation bugs                                     R EFERENCES
may cause severe security vulnerabilities as demonstrated by          [1] https://gitlab.com/gnutls/gnutls/merge requests/314.
recently discovered attacks [26], [56].                               [2] https://gitlab.com/gnutls/gnutls/issues/185.
 [3] https://gitlab.com/gnutls/gnutls/issues/187.                                     [37] D. Brumley and D. Boneh. Remote Timing Attacks Are Practical. In
 [4] http://www.matrixssl.org/blog/releases/matrixssl 3 9 0.                               Proceedings of the USENIX Conference on Security Symposium, pages
 [5] https://issues.apache.org/jira/browse/HTTPCLIENT-1802.                                1–1, 2003.
 [6] American Fuzzy Lop (AFL) Fuzzer. http://lcamtuf.coredump.cx/afl/.                [38] Y. Chen and Z. Su. Guided Differential Testing of Certificate Validation
 [7] cURL - Compare SSL Libraries.                  https://curl.haxx.se/docs/ssl-         in SSL/TLS Implementations. In Proceedings of the Joint Meeting on
     compared.html.                                                                        Foundations of Software Engineering, pages 793–804, 2015.
 [8] FreeRADIUS. http://freeradius.org/.                                              [39] Y. Chen and Z. Su. Guided Differential Testing of Certificate Validation
 [9] GnuTLS 3.5.10: X509 certificate API. https://goo.gl/ZSbNGb.                           in SSL/TLS Implementations. In Proceedings of the Joint Meeting on
[10] Java Native Interface (JNI).         https://docs.oracle.com/javase/8/docs/           Foundations of Software Engineering, pages 793–804, 2015.
     technotes/guides/jni/.                                                           [40] J. Clark and P. C. van Oorschot. SoK: SSL and HTTPS: Revisiting
[11] libFuzzer - A Library for Coverage-guided Fuzz Testing. http://llvm.org/              Past Challenges and Evaluating Certificate Trust Model Enhancements.
     docs/LibFuzzer.html.                                                                  In Proceedings of the IEEE Symposium on Security and Privacy, pages
[12] OpenSIPS. https://github.com/OpenSIPS/opensips.                                       511–525, 2013.
[13] proxytunnel. http://proxytunnel.sf.net.                                          [41] J. De Ruiter and E. Poll. Protocol State Fuzzing of TLS Implementa-
[14] SLOCCount. https://www.dwheeler.com/sloccount/.                                       tions. In Proceedings of the USENIX Conference on Security Symposium,
[15] Telex Anticensorship. https://github.com/ewust/telex.                                 pages 193–206, 2015.
[16] RFC 1035 - DOMAIN NAMES - IMPLEMENTATION AND SPECI-                              [42] Docjar.      HostnameChecker.        http://www.docjar.com/docs/api/sun/
     FICATION. https://tools.ietf.org/html/rfc1035, November 1987.                         security/util/HostnameChecker.html.
[17] RFC 1123 - Requirements for Internet Hosts – Application and Support.            [43] T. Duong and J. Rizzo. Here Come The ⊕ Ninjas. 2011.
     https://tools.ietf.org/html/rfc1123, October 1989.                               [44] T. Duong and J. Rizzo. The CRIME Attack. 2012.
[18] RFC 2818 - HTTP Over TLS. https://tools.ietf.org/search/rfc2818, May             [45] S. Fahl, M. Harbach, T. Muders, L. Baumgärtner, B. Freisleben, and
     2000.                                                                                 M. Smith. Why Eve and Mallory Love Android: An Analysis of Android
[19] RFC 3492 - Punycode: A Bootstring encoding of Unicode for Interna-                    SSL (in)Security. In Proceedings of the ACM SIGSAC Conference on
     tionalized Domain Names in Applications (IDNA). https://tools.ietf.org/               Computer and Communications Security, pages 50–61, 2012.
     html/rfc3492, March 2003.                                                        [46] N. J. A. Fardan and K. G. Paterson. Lucky thirteen: Breaking the tls
[20] RFC 4985 - Internet X.509 Public Key Infrastructure Subject Alternative               and dtls record protocols. In Proceedings of the IEEE Symposium on
     Name for Expression of Service Name. https://tools.ietf.org/html/                     Security and Privacy, pages 526–540, 2013.
     rfc4985, August 2007.                                                            [47] P. Fiterău-Broştean, R. Janssen, and F. Vaandrager. Learning Fragments
[21] RFC 5280 - Internet X.509 Public Key Infrastructure Certificate and                   of the TCP Network Protocol. In Proceedings of the International
     Certificate Revocation List (CRL) Profile. https://tools.ietf.org/html/               Conference on Formal Methods for Industrial Critical Systems, pages
     rfc5280, May 2008.                                                                    78–93, 2014.
[22] RFC 5321 - Simple Mail Transfer Protocol. https://tools.ietf.org/html/           [48] P. Fiterău-Broştean, R. Janssen, and F. Vaandrager. Combining Model
     rfc5321, October 2008.                                                                Learning and Model Checking to Analyze TCP Implementations. In
[23] RFC 5890 - Internationalized Domain Names for Applications (IDNA):                    Proceedings of the International Conference on Computer Aided Verifi-
     Definitions and Document Framework.               https://tools.ietf.org/html/        cation, pages 454–471, 2016.
     rfc5890, August 2010.
                                                                                      [49] S. Fujiwara, G. v. Bochmann, F. Khendek, M. Amalou, and
[24] RFC 6125 - Representation and Verification of Domain-Based Appli-
                                                                                           A. Ghedamsi. Test Selection Based on Finite State Models. IEEE
     cation Service Identity within Internet Public Key Infrastructure Using
                                                                                           Transactions on software engineering, 17(6):591–603, 1991.
     X.509 (PKIX) Certificates in the Context of Transport Layer Security
                                                                                      [50] M. Georgiev, S. Iyengar, S. Jana, R. Anubhai, D. Boneh, and
     (TLS). https://tools.ietf.org/html/rfc6125, March 2011.
                                                                                           V. Shmatikov. The Most Dangerous Code in the World: Validating
[25] RFC 6818 - Updates to the Internet X.509 Public Key Infrastruc-
                                                                                           SSL Certificates in Non-browser Software. In Proceedings of the ACM
     ture Certificate and Certificate Revocation List (CRL) Profile. https:
                                                                                           SIGSAC Conference on Computer and Communications Security, pages
     //tools.ietf.org/html/rfc6818, January 2013.
                                                                                           38–49, 2012.
[26] CVE-2014-0092, March 2014.
                                                                                      [51] GNU Compilers. Gcov - Using the GNU Compiler Collection (GCC).
[27] CVE-2014-1492, March 2014.
                                                                                           https://gcc.gnu.org/onlinedocs/gcc-4.8.1/gcc/Gcov.html.
[28] CVE-2015-1855, March 2015.
[29] F. Aarts, J. D. Ruiter, and E. Poll. Formal Models of Bank Cards                 [52] B. He, V. Rastogi, Y. Cao, Y. Chen, V. Venkatakrishnan, R. Yang, and
     for Free. In Proceedings of the International Conference on Software                  Z. Zhang. Vetting SSL usage in applications with SSLint. In Proceedings
     Testing, Verification and Validation Workshops, pages 461–468, 2013.                  of the IEEE Symposium on Security and Privacy, pages 519–534, 2015.
[30] F. Aarts, J. Schmaltz, and F. Vaandrager. Inference and Abstraction              [53] D. Kaminsky, M. L. Patterson, and L. Sassaman. PKI Layer Cake:
     of the Biometric Passport. In Proceedings of the International Confer-                New Collision Attacks Against the Global x.509 Infrastructure. In
     ence on Leveraging Applications of Formal Methods, Verification, and                  Proceedings of the International Conference on Financial Cryptography
     Validation, pages 673–686, 2010.                                                      and Data Security, pages 289–303, 2010.
[31] D. Angluin. Learning Regular Sets from Queries and Counterexamples.              [54] M. J. Kearns and U. V. Vazirani. An Introduction to Computational
     Inf. Comput., 75(2):87–106, 1987.                                                     Learning Theory. MIT Press, 1994.
[32] Apache Software Foundation. Apache HttpComponents - HttpCom-                     [55] D. Kozen. Lower Bounds for Natural Proof Systems. In Proceedings
     ponents HttpClient Overview. https://hc.apache.org/httpcomponents-                    of the Annual Symposium on Foundations of Computer Science, pages
     client-ga/.                                                                           254–266, 1977.
[33] G. Argyros, I. Stais, S. Jana, A. D. Keromytis, and A. Kiayias. SFAD-            [56] A. Langley. Apple’s SSL/TLS Bug. https://goo.gl/DzRLNq, 2014.
     iff: Automated Evasion Attacks and Fingerprinting Using Black-box                [57] A. Lenstra, J. P. Hughes, M. Augier, J. W. Bos, T. Kleinjung, and
     Differential Automata Learning. In Proceedings of the ACM SIGSAC                      C. Wachter. Ron was wrong, Whit is right. International Association
     Conference on Computer and Communications Security, pages 1690–                       for Cryptologic Research, 2012.
     1701, 2016.                                                                      [58] Oracle. Java Cryptography Architecture Oracle Providers Documen-
[34] J. L. Balcázar, J. Dı́az, R. Gavalda, and O. Watanabe. Algorithms for                tation. https://docs.oracle.com/javase/7/docs/technotes/guides/security/
     Learning Finite Automata from Queries: A Unified View, pages 53–72.                   SunProviders.html.
     Springer, 1997.                                                                  [59] H. Raffelt, B. Steffen, and T. Berg. LearnLib: A Library for Automata
[35] D. Bleichenbacher. Chosen ciphertext attacks against protocols based on               Learning and Experimentation. In Proceedings of the International
     the RSA encryption standard PKCS# 1. In Proceedings of the Annual                     Workshop on Formal Methods for Industrial Critical Systems, pages
     International Cryptology Conference on Advances in Cryptology, pages                  62–71, 2005.
     1–12, 1998.                                                                      [60] M. Sipser. Introduction to the Theory of Computation. Thomson Course
[36] C. Brubaker, S. Jana, B. Ray, S. Khurshid, and V. Shmatikov. Using                    Technology Boston, 2006.
     Frankencerts for Automated Adversarial Testing of Certificate Validation         [61] J. Somorovsky. Systematic Fuzzing and Testing of TLS Libraries.
     in SSL/TLS Implementations. In Proceedings of the IEEE Symposium                      In Proceedings of the ACM SIGSAC Conference on Computer and
     on Security and Privacy, pages 114–129, 2014.                                         Communications Security, pages 1492–1504, 2016.
                       X. A PPENDIX
                                                                    GnuTLS. The GnuTLS team is currently working on a
A. Details of test hostname verification implementations         patch to fix the issue of seeking a match in the CN when
    OpenSSL. has separate checking functions for each type       an IP address identifier is in the subjectAltName [1]. The
identifiers as shown in Table I. In our testing, we use the      developers also plan to provide a way to specify the identifier
default setup that supports matching wildcards. OpenSSL          type in order to avoid the confusion between hostnames and
also provides support for applications to turn some of these     IP addresses [2]. Additionally, the team plans to remove a
hostname verification functions on or off by calling different   fallback option which matches an IP address with a subjectAlt-
setup functions (e.g., X509_VERIFY_PARAM_set1_host               Name DNS [9], thus resolving the potential attack presented
and X509_VERIFY_PARAM_set1_email).                               in Section VI-C [3]. Finally, GnuTLS has recently introduced
    GnuTLS. The GnuTLS check hostname function is de-            IDNA2008 support in version 3.5.9 and performs extensive
signed for certificate verification for HTTPS supporting do-     checks to verify the format of the DNS names stored in the
main names, IPv4, and IPv6. Like OpenSSL, GnuTLS also            certificate.
provides the application to select whether to verify hostname       MbedTLS. We are currently discussing the discovered
with wildcard or not. By default, GnuTLS wildcard matching       issues with the MbedTLS team.
is enabled. We use the default setting for our experiments.         MatrixSSL. MatrixSSL is prioritizing the fixes for the RFC
    MbedTLS. The hostname verification functions in              violations, including the incorrect order of checking between
MbedTLS only supports checking for domain name                   subject CN and subjectAltName identifier (violation of RFC
verification.                                                    6125) and matching the local-part of an email address in a
    MatrixSSL. A single function matrixValidateCerts             case-insensitive manner (violation of RFC 5280). These fixes
is responsible for checking all different types of identifiers   are deployed in their new version 3.9.0 [4]. This version also
(e.g., DNS, IPv4, and email). The library does not include       addresses other discrepancies we reported by providing an
support for IPv6 yet. MatrixSSL also provides a separate         optional flag for hostname input validation, and providing
function, psX509ValidateGeneralName that should be               parameters for users in order to specify the type of the
used before calling matrixValidateCerts for name checking for    identifier (e.g., DNS, IP ADDR) in order to address the attack
filtering out invalid input.                                     discussed in Section VI-C.
    JSSE (Java Secure Socket Extension). SunJSSE [58],              JSSE. The JSSE team does not consider RFC 6125 com-
as part of the JSSE release, has internal built-in hostname      pliance to be a feature of the current version of the library.
checking support (sun.security.util.HostnameChecker [42]). It    However, the team informed us that they are currently working
supports domain name, IPv4, and IPv6 verification through the    on plans to add compliance with RFC 6125 in the next versions
HostnameChecker.match interface.                                 of the library.
    CPython SSL. CPython is the oldest and one of the               CPython SSL. CPython plans to deprecate their hostname
most popular Python VM implementation. CPython’s inbuilt         verification implementation and directly use OpenSSL’s im-
SSL support depends on the OpenSSL library, but does             plementation in the next release.
not use OpenSSL’s hostname verification function. Instead,          OpenSSL. The OpenSSL team decides not to address the
it includes its own hostname verification implementation,        issue of matching a partial hostname suffix of a subject
match_hostname function. Currently, it only supports do-         CN/subjectAltName, as this discrepancy is not an RFC viola-
main name and IP address verification but does not support       tion. For the other discrepancies e.g., matching a wildcard in
email verification.                                              a public suffix or matching an invalid hostname, the OpenSSL
    HttpClient. (Apache HttpClient) is used extensively          team believes that they should be handled at the application
in Web-services middleware such as Apache Axis 2                 level or by certificate authorities and therefore, they should
It supports IPv4, IPv6, and domain name verifica-                not be fixed in the library itself.
tion [32]. By default the library provides a verify func-           HttpClient. The HttpClient team has addressed the viola-
tion in DefaultHostnameVerifier to perform the                   tions of matching a subject CN in case sensitive manner (viola-
identity verification. The verifier can also be used with        tion of RFC 6125 and RFC 5280) and attempting to match sub-
PublicSuffixMatcher object to perform additional                 ject CN when a subjectAltName is present (violation of RFC
checks.                                                          6125). These issues are resolved in version 4.5.3, which is cur-
    cURL. By default, it uses OpenSSL [7] but implements         rently an alpha release [5]. The HttpClient team decided not to
its own hostname verification function verifyhost that           address the other reported issues as they are handled correctly
supports domain name, IPv4, and IPv6 verification.               if the application calls the DefaultHostnameVerifier
                                                                 with the PublicSuffixMatcher in the verifier construc-
B. Developer Responses
                                                                 tor.
   We notified the developers of each affected
library/application for all of our findings, including RFC       C. Detailed list of discrepancies
violations and discrepancies. In this section, we present           In Table VIII, we present a detailed list of the discrepancies
an overview of the developer responses for each different        discovered between various SSL/TLS libraries and applica-
library/application.                                             tions.
                                                               TABLE VIII
                 S AMPLE STRINGS ACCEPTED BY THE AUTOMATA INFERRED FROM DIFFERENT HOSTNAME VERIFICATION IMPLEMENTATIONS

Test Certificate Identifier Template   OpenSSL           GnuTLS           MbedTLS          MatrixSSL     JSSE          CPython SSL HttpClient        cURL
Wildcard in Certificate
                                       a.aaa.aaa
                                       .aaa.aaa
                                       *.aaa.aaa                                                                                                     a.aaa.aaa
                                       .aaa              .aaa.aaa         a.aaa.aaa        a.aaa.aaa
*.aaa.aaa                              a.aaa.aaa\0                                                       a.aaa.aaa     a.aaa.aaa     .aaa.aaa        a.aaa.aaa.\0
                                                         .aaa.aaa\0       a.aaa.aaa\0      a.aaa.aaa\0                                               a.aaa.aaa\0
                                       .aaa.aaa\0                                                                                                    a.aaa.aaa.
                                       .aaa\0
                                       *.aaa.aaa\0
                                       aaa.*.aaa
                                       .aaa                                                                                                          aaa.*.aaa
                                       .*.aaa            aaa.*.aaa        aaa.*.aaa                                                                  aaa.*.aaa.\0
aaa.*.aaa                              aaa.*.aaa\0       aaa.*.aaa\0      aaa.*.aaa\0      none          aaa.a.aaa     aaa.*.aaa     aaa..aaa
                                                                                                                                                     aaa.*.aaa\0
                                       .aaa\0                                                                                                        aaa.*.aaa.
                                       .*.aaa\0
                                       aa.aaa.aaa
                                       a.aaa.aaa
                                       a*.aaa.aaa
                                       .aaa.aaa                                                                                                      aa.aaa.aaa
                                       .aaa
                                       aa.aaa.aaa\0      a*.aaa.aaa       a*.aaa.aaa                                                                 aa.aaa.aaa.\0
a*.aaa.aaa                                               a*.aaa.aaa\0     a*.aaa.aaa\0     none          a.aaa.aaa     a.aaa.aaa     a.aaa.aaa
                                       a.aaa.aaa\0                                                                                                   aa.aaa.aaa\0
                                       a*.aaa.aaa\0                                                                                                  aa.aaa.aaa.
                                       .aaa.aaa\0
                                       .aaa\0
                                       aaa.a*.aaa
                                       .aaa                                                                                                          aaa.a*.aaa
                                       .a*.aaa           aaa.a*.aaa       aaa.a*.aaa                                                                 aaa.a*.aaa.\0
aaa.a*.aaa                             aaa.a*.aaa\0      aaa.a*.aaa\0     aaa.a*.aaa\0     none          aaa.a.aaa     aaa.a*.aaa    aaa.a.aaa
                                                                                                                                                     aaa.a*.aaa\0
                                       .aaa\0                                                                                                        aaa.a*.aaa.
                                       .a*.aaa\0
                                                                                                                                                     xn--aaa*.aaa
                                       .aaa              xn--aaa*.aaa     xn--aaa*.aaa                                                               xn--aaa*.aaa.\0
xn--aaa*.aaa                           .aaa\0            xn--aaa*.aaa\0   xn--aaa*.aaa\0   none          xn--aaa.aaa   xn--aaa*.aaa xn--aaa.aaa
                                                                                                                                                     xn--aaa*.aaa\0
                                                                                                                                                     xn--aaa*.aaa.
                                       a.xn--aaa.aaa
                                       .aaa
                                       .xn--aaa.aaa                                                                                                  a.xn--aaa.aaa
                                       *.xn--aaa.aaa     .xn--aaa.aaa     .xn--aaa.aaa
                                       a.xn--aaa.aaa\0                                                                                               a.xn--aaa.aaa.\0
*.xn--aaa.aaa                                            .xn--aaa.aaa\0   .xn--aaa.aaa\0   none          a.xn--aaa.aaa a.xn--aaa.aaa .xn--aaa.aaa
                                       .aaa\0                                                                                                        a.xn--aaa.aaa\0
                                                                                                                                                     a.xn--aaa.aaa.
                                       .xn--aaa.aaa\0
                                       *.xn--aaa.aaa\0
                                       .aaa
                                       .*.aaa                                                                                                        xn--aaa.*.aaa
                                       xn--aaa.*.aaa     xn--aaa.*.aaa   xn--aaa.*.aaa                                                               xn--aaa.*.aaa.\0
xn--aaa.*.aaa                          .aaa\0            xn--aaa.*.aaa\0 xn--aaa.*.aaa\0 none            xn--aaa.a.aaa xn--aaa.*.aaa xn--aaa..aaa
                                                                                                                                                     xn--aaa.*.aaa\0
                                       .*.aaa\0                                                                                                      xn--aaa.*.aaa.
                                       xn--aaa.*.aaa\0
Wildcard Unclear Practices
                                       .aaa                                                                                                          *.aaa
                                       *.aaa                             a.aaa            a.aaa                                                      *.aaa.\0
*.aaa                                  .aaa\0           none             a.aaa\0          a.aaa\0        a.aaa         a.aaa         .aaa
                                                                                                                                                     *.aaa\0
                                       *.aaa\0                                                                                                       *.aaa.
                                       a*b*c*.aaa.aaa
                                       .aaa.aaa                                                                                                      aab*c*.aaa.aaa
                                       .aaa             a*b*c*.aaa.aaa   a*b*c*.aaa.aaa                                                              aab*c*.aaa.aaa.\0
a*b*c*.aaa.aaa                         a*b*c*.aaa.aaa\0 a*b*c*.aaa.aaa\0 a*b*c*.aaa.aaa\0 none           abc.aaa.aaa   none          ab*c*.aaa.aaa
                                                                                                                                                     aab*c*.aaa.aaa\0
                                       .aaa.aaa\0                                                                                                    aab*c*.aaa.aaa.
                                       .aaa\0
                                       .aaa.aaa
                                       .*.aaa.aaa
                                       *.*.aaa.aaa                                                                                                   a.*.aaa.aaa
                                       .aaa             .*.aaa.aaa       a.*.aaa.aaa                                                                 a.*.aaa.aaa.\0
*.*.aaa.aaa                            .aaa.aaa\0       .*.aaa.aaa\0     a.*.aaa.aaa\0    none           a.a.aaa.aaa   a.*.aaa.aaa   .*.aaa.aaa
                                       .aaa\0                                                                                                        a.*.aaa.aaa\0
                                                                                                                                                     a.*.aaa.aaa.
                                       .*.aaa.aaa\0
                                       *.*.aaa.aaa\0
                                       ab.aaa.aaa
                                       b.aaa.aaa
                                       .aaa.aaa
                                       *b.aaa.aaa                                                                                                    ab.aaa.aaa
                                       .aaa
                                       ab.aaa.aaa\0     b.aaa.aaa        *b.aaa.aaa                      ab.aaa.aaa                                  ab.aaa.aaa.\0
*b.aaa.aaa                                              b.aaa.aaa\0      *b.aaa.aaa\0     none           b.aaa.aaa     b.aaa.aaa     b.aaa.aaa
                                                                                                                                                     ab.aaa.aaa\0
                                       b.aaa.aaa\0
                                       .aaa.aaa\0                                                                                                    ab.aaa.aaa.
                                       .aaa\0
                                       *b.aaa.aaa\0
                                       .aaa.aaa                                                                                                      .aaa.aaa
                                       .aaa                              .aaa.aaa                                                                    .aaa.aaa.\0
.aaa.aaa                               .aaa.aaa\0       none             .aaa.aaa\0       none           aaa.aaa       .aaa.aaa      .aaa.aaa
                                                                                                                                                     .aaa.aaa\0
                                       .aaa\0                                                                                                        .aaa.aaa.
Email Address

SAN email: *@aaa.aaa                   *@aaa.aaa     *@aaa.aaa     –                       none          –             –             –               –
                                       *@aaa.aaa\0   *@aaa.aaa\0
SAN email: aaa@*                       aaa@*         aaa@*         –                       none          –             –             –               –
                                       aaa@*\0       aaa@*\0
SAN email: aaa@*.aaa                   aaa@*.aaa     aaa@*.aaa     –                       none          –             –             –               –
                                       aaa@*.aaa\0   aaa@*.aaa\0
SAN email: aaa@aaa.*                   aaa@aaa.*     aaa@aaa.*     –                       none          –             –             –               –
                                       aaa@aaa.*\0   aaa@aaa.*\0
SAN email: AAA@aaa.aaa                 AAA@aaa.aaa   AAA@aaa.aaa   –                       aaa@aaa.aaa
                                       AAA@aaa.aaa\0 AAA@aaa.aaa\0                         aaa@aaa.aaa\0 –             –             –               –
SAN email: aaa@AAA.aaa                 aaa@aaa.aaa   aaa@aaa.aaa                           aaa@aaa.aaa
                                       aaa@aaa.aaa\0 aaa@aaa.aaa\0 –                       aaa@aaa.aaa\0 –             –             –               –

IP Address
SAN IP Addr: *.111.111.111             none              none             –                none          none          none          none            none
