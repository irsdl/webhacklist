---
type: Whitepaper
title: Attack Patterns for Black-Box Security Testing of Multi-Party Web Applications
description: Security protocols behind multi-party web applications, such as single sign-on and Cashier-as-a-Service payment flows, share structural features that let an attack on one be generalised to others. The paper distils thirteen published attacks into seven reusable attack patterns and builds a black-box tester on OWASP ZAP that instantiates them automatically, covering replay, login CSRF and stored XSS. It found twenty-one previously unknown vulnerabilities in prominent providers.
resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf"
tags: [whitepaper, webseclist-reference, sso, oauth, saml, csrf, xss, auth-bypass, tooling, dynamic-analysis, owasp-a01-2021, owasp-a03-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:43:18+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf"
    title: Attack Patterns for Black-Box Security Testing of Multi-Party Web Applications
    author: Avinash Sudhodanan, Alessandro Armando, Roberto Carbone, Luca Compagna
also_at: []
authors:
  - Avinash Sudhodanan
  - Alessandro Armando
  - Roberto Carbone
  - Luca Compagna
canonical_url: ""
cited_by:
  - "2016-17.md:67"
commit: ""
content_sha256: 215cf86de4b2f43d89fc8242db891144bafd96d77b45ca57dc8f4f5f947713c6
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: c2477b42d29f1dfe866035f51b61eb949123022a8fa0298087a0fc9091522ae6
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:43:18+00:00"
slug: attack-patterns-black-box-security-testing-multi-party-web-applications
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Attack Patterns for Black-Box Security Testing of Multi-Party Web Applications

**Attack Patterns for Black-Box Security Testing of Multi-Party Web Applications** - Avinash Sudhodanan, Alessandro Armando, Roberto Carbone, Luca Compagna, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/attack-patterns-black-box-security-testing-multi-party-web-applications.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Attack Patterns for Black-Box Security Testing of
              Multi-Party Web Applications

       Avinash Sudhodanan                         Alessandro Armando                       Roberto Carbone                 Luca Compagna
    University of Trento, Italy              DIBRIS, University of Genova             Security & Trust, FBK, Italy         SAP Labs France
   Security & Trust, FBK, Italy               Security & Trust, FBK, Italy                  carbone@fbk.eu             luca.compagna@sap.com
      6.avinash@gmail.com                           armando@fbk.eu


    Abstract—The advent of Software-as-a-Service (SaaS) has led                     User (through a web browser B), the web application (playing
to the development of multi-party web applications (MPWAs).                         the role of Service Provider, SP), and a trusted third party
MPWAs rely on core trusted third-party systems (e.g., payment                       (TTP).
servers, identity providers) and protocols such as Cashier-as-a-
Service (CaaS), Single Sign-On (SSO) to deliver business services                       The design and implementation of the protocols used by
to users. Motivated by the large number of attacks discovered                       security-critical MPWAs are notoriously error-prone. Several
against MPWAs and by the lack of a single general-purpose                           vulnerabilities have been reported in the last few years. For
application-agnostic technique to support their discovery, we                       instance, the incorrect handling of the OAuth 2.0 access token
propose an automatic technique based on attack patterns for                         by a vulnerable SP can be exploited by an attacker hosting
black-box, security testing of MPWAs. Our approach stems from
the observation that attacks against popular MPWAs share a
                                                                                    another SP [38]. If the victim User logs into the attacker’s
number of similarities, even if the underlying protocols and                        SP, the attacker obtains an access token (issued by TTP) from
services are different. In this paper, we target six different                      the victim and can replay it in the vulnerable SP to login
replay attacks, a login CSRF attack and a persistent XSS                            as the victim. A similar attack was previously discovered in
attack. Firstly, we propose a methodology in which security                         the SAML-based implementation deployed by Google [23].
experts can create attack patterns from known attacks. Secondly,                    (Here the SAML authentication assertion is replayed instead
we present a security testing framework that leverages attack                       of the OAuth 2.0 access token.) Similar attacks have also been
patterns to automatically generate test cases for testing the                       detected in CaaS-enabled scenarios [35], [32]. For instance, a
security of MPWAs. We implemented our ideas on top of OWASP                         vulnerability in osCommerce v2.3.1 that allowed an attacker
ZAP (a popular, open-source penetration testing tool), created                      to shop for free has been reported in [32]: the attacker controls
seven attack patterns that correspond to thirteen prominent
attacks from the literature and discovered twenty one previously
                                                                                    a SP and obtains an account identifier from PayPal for paying
unknown vulnerabilities in prominent MPWAs (e.g., twitter.com,                      herself; later on, she replays this value in a subsequent session
developer.linkedin.com, pinterest.com), including MPWAs that do                     with a vulnerable SP where she purchases a product by paying
not belong to SSO and CaaS families.                                                herself. Recently, a token fixation attack in PayPal Express
                                                                                    Checkout flow was discovered [18] which is very similar to
                           I.   I NTRODUCTION                                       the session fixation attack in OAuth 1.0 [10]. The problem is
                                                                                    exacerbated by the large number of deployments. As a matter
    An increasing number of business critical, online applica-                      of fact, over 20% of the top twenty-thousand Alexa top US
tions leverage trusted third parties in conjunction with web-                       websites have a vulnerable implementation of the Facebook
based security protocols to meet their security needs. For                          SSO [40].
instance, many online applications rely on authentication as-
sertions issued by identity providers to authenticate users using                       The aforementioned attacks have been discovered through
a variety of web-based single sign-on (SSO) protocols (e.g.,                        a variety of domain-specific techniques with different levels of
SAML SSO v2.0, OpenID Connect). Similarly, online shop-                             complexity, ranging from formal verification [23], white-box
ping applications use online payment services and Cashier-as-                       analysis [35], black-box testing [32], to manual testing [18].
a-Service (CaaS) protocols to obtain proof-of-payment before                        In this paper, we pursue a different approach and propose
delivering the purchased items (e.g., Express Checkout [11]                         an automatic black-box testing technique for security-critical
and PayPal Payment Standard [12]). We refer to this broad                           MPWAs. Our approach is based on an observation and a
class of protocols as security-critical Multi-Party Web Appli-                      conjecture. The observation is that, regardless of their purpose,
cations (MPWAs). Three entities take part in the protocols: the                     the security protocols at the core of MPWAs share a number
                                                                                    of features:
                                                                                        1) By interacting with SP (and/or TTP), User authenti-
Permission to freely reproduce all or part of this paper for noncommercial
purposes is granted provided that copies bear this notice and the full citation
                                                                                              cates and/or authorizes some actions,
on the first page. Reproduction for commercial purposes is strictly prohibited          2) TTP (SP, resp.) generates a security token,
without the prior written consent of the Internet Society, the first-named author       3) the security token is dispatched to SP (TTP, resp.)
(for reproduction of an entire paper only), and the author’s employer if the                  through the web browser, and
paper was prepared within the scope of employment.                                      4) SP (TTP, resp.) checks the security token and com-
NDSS ’16, 21-24 February 2016, San Diego, CA, USA
Copyright 2016 Internet Society, ISBN 1-891562-41-X                                           pletes the protocol by taking some security-critical
http://dx.doi.org/10.14722/ndss.2016.23286                                                    decisions.
The conjecture is that the attacks found in the literature (and                   eight out of the top Alexa global 500 websites2 are
possibly many more still to be discovered) are instances of a                     vulnerable to login CSRF attacks.
limited number attack patterns. We conducted a detailed study               4) We have developed a fully functional prototype of
of attacks discovered in MPWAs of real-world complexity                           our approach on OWASP ZAP, a widely-used open-
and analyzed their similarities. This led us to identify a                        source penetration testing tool. The tool is available
small number of application-independent attack patterns that                      online (upon request) at the companion website.3
concisely describe the actions performed by attackers while                 5) We have been able to identify 11 previously unknown
performing these attacks.                                                         vulnerabilities in security-critical MPWAs leveraging
    To assess the generality and the effectiveness of our                         the SSO and CaaS protocols of LinkedIn, Facebook,
approach, we have developed a security testing framework                          Instagram, PayPal, and Stripe.
based on OWASP ZAP1 , a popular open-source penetration                 Structure of the paper. In Section II, we introduce some back-
testing tool, and run it against a number of prominent MPWA             ground information about MPWAs and details about various
implementations. Our tool has been able to identify:                    attacks from the literature. The idea of creating attack patterns
    • two previously unknown attacks against websites in-               from concrete attacks is explained in Section III. In Section IV
         tegrating LinkedIn’s Javascript API-based SSO that             we show how the attack patterns we defined can be used
         causes an access token replay attack and a persistent          to carry out black-box testing of MPWAs. In Section V,
         XSS attack;                                                    we provide some details about our prototype implementation.
    • a previously unknown redirection URI fixation attack              We discuss the experimental evaluation in Section VI. In
         against the implementation of the OAuth 2.0 protocol           Section VII we discuss the related work and in Section VIII
         in PayPal’s “Log in with PayPal” SSO solution which            we discuss the limitations of our approach. We conclude in
         allows a network attacker to steal the authorization           Section IX with some final remarks.
         code of the victim and replay it to login as the victim
         in any SP website using the same SSO solution;                                       II. BACKGROUND
    • a previously unknown attack in the payment checkout                   Figure 1 provides pictorial representations of example
         solution offered by Stripe (integrated in over 17,000          MPWAs leveraging SSO, CaaS, and Verification via Email
         websites [15]); the attack allows an attacker to imper-        (VvE) solutions. They all feature (i) a user U, operating a
         sonate a SP to obtain a token from the victim User             browser B, who wants to consume a service from a service
         which is subsequently used to shop at the imperson-            provider SP and (ii) a service provider SP that relies on a
         ated SP’s online shop using the victim’s credit card;          trusted-third-party TTP to deliver its services. TLS (and valid
         and                                                            certificates at TTP and SP) are used to securely exchange
    • seven previously unknown vulnerabilities in a num-                messages.
         ber of websites (e.g., developer.linkedin.com, pin-                Figure 1a shows the SAML 2.0 SSO protocol [30], where
         terest.com, websta.me) leveraging the SSO solutions            SP relies on TTP (the Identity Provider, IdP for short) to
         offered by LinkedIn, Facebook, and Instagram.                  authenticate a user U before granting the user access to one
Besides the SSO and the CaaS scenarios, we investigated a               of its resources. The protocol starts (steps 1-2) with U asking
popular family of MPWAs, namely the Verificaton Via Email               SP for a resource located at URI SP. SP in turn redirects B
(VvE) scenario, which is often used by websites to send                 to IdP with the authentication request AuthRequest (step 3).
security-sensitive information to users via email. By testing the       The RelayState field carries URI SP. IdP then challenges B
security of Alexa Top 500 websites we found that a number               to provide valid credentials that are entered by U (steps 4-6).
of prominent websites such as twitter.com, open.sap.com are             If the authentication succeeds, IdP issues a digitally signed
vulnerable to login CSRF attacks. The following are the main            authentication assertion (AuthAssert) and instructs the user
contributions of this paper:                                            to sent it (along with the RelayState) to the SP (step 7).
    1) We show that the attack strategies behind thirteen               SP checks the assertion and delivers the requested resource
          prominent MPWA attacks can be represented using               (step 8). A severe man-in-the-middle attack against the SAML-
          seven attack patterns, and these attack patterns are          based SSO for Google Apps was reported [23]. The attack,
          general enough to discover similar attacks in MPWAs           due to a deviation from the standard whereby AuthAssert
          implementing different protocols and in different             did not include the identity of SP (for which the assertion was
          MPWA scenarios. For instance, an attack pattern               created), allowed a malicious agent hosting a SP (say SP M )
          inspired by various SSO attacks from the literature           to reuse AuthAssert to access the resource of the victim U
          was able to automatically discover a new attack in            (say U V ) stored at Google, the target SP (say SP T ). More in
          the CaaS scenario.                                            detail, after a session S1 of the protocol involving U V and
    2) The idea that prior attacks proposed on SSO and CaaS             SP M , in which SP M receives the AuthAssert from U V , the
          share commonalities is not new [39], [29]. However,           malicious agent starts another session S2 playing the role U M
          ours is the first black-box security testing approach         and mischievously reuses the assertion obtained in S1 in S2
          that has experimental evidence of applicability in both       to trick Google (SP T ) into believing he is U V .
          SSO and CaaS domains.                                             Figure 1b illustrates a typical MPWA running the PayPal
    3) Prior work on security analysis of MPWAs is focused              Payments Standard CaaS protocol [12] where TTP authorizes
          only on SSO and CaaS scenarios. We evaluate the               U to purchase a product P at SP. Here, TTP is a Payment
          MPWA scenario in which websites send security-                Service Provider (PSP) played by PayPal. SP is identified by
          sensitive information to users via email and show that          2 http://www.alexa.com/topsites
  1 www.owasp.org/index.php/OWASP Zed Attack Proxy Project                3 https://sites.google.com/site/mpwaprobe/




                                                                    2
          (a) SAML-based SSO                      (b) PayPal Payments Standard CaaS             (c) Email notification and acknowledgment


                                                  Fig. 1: Typical MPWA scenarios


PayPal through a merchant account identifier (P ayeeId). U              reset. For generality, we refer to this scenario as Verification
places an order for purchasing P (steps 1-5). SP sends the              via Email (in short, VvE).
P ayeeId, the cost of the product (Cost) and a return URI                   Quite surprisingly, prominent SPs (e.g., twitter.com) do not
(ReturnU RI) to TTP by redirecting B (step 6). By interacting           properly perceive and/or manage the risk associated to the
with PSP, U authorizes the payment of the amount to SP (steps           security-sensitive URIs sent via email to their users. It turns out
7-9). The transaction identifier (TransactionId) is generated by        that some of these URIs give direct access to sensitive services
PSP and passed to SP by redirecting B to ReturnURI (step 10).           skipping any authentication step. For instance, when a user
The TransactionId is then submitted by SP to TTP to get                 has not signed into twitter for more than 10 days, twitter.com
the details of the transaction (steps 11-12). Upon successful           sends emails to the user about the tweets the user missed
verification of the transaction details, SP sends U the status of       and this email contains security-sensitive URIs that directly
the purchase order (step 13).                                           authenticates the user without asking for credentials. Such a
    A serious vulnerability in the integration of the PayPal            URL can be used by an attacker to silently authenticate a
Payments Standard protocol in osCommerce v2.3.1 and Aban-               victim to an attacker controlled twitter account. This attack
teCart v1.0.4 that allowed a malicious party to shop for free           is widely known as login CSRF.
was discovered in [32]. The attack is as follows: from a
session S1 of the protocol involving the PSP and the malicious          A. Attacks
party controlling both a user (U M ) and a SP (SP M ), the                  Table I presents ten prominent attacks that were discovered
malicious party obtains a payee (merchant) identifier. Later, in        in literature on SSO- and CaaS-based MPWAs. It includes
the checkout protocol session S2 between U M and the target             the two attacks mentioned above (excluding login CSRF in
SP (SP T ), the malicious agent replays the value of PayeeId            twitter), corresponding to #1 for SAML SSO, and #3 for
obtained in the other session and manages to place an order             PayPal Payments Standard. We do not consider here XSS and
for a product in SP T by paying herself (instead of SP T ).             XML rewriting attacks (see Section VII for details). Hereafter,
    While MPWAs for SSO and CaaS scenarios received a                   we briefly describe the other attacks.
considerable attention (see, e.g., [29], [34], [35], [37], [36],                #2: The attacker hosts SP M to obtain the AccessT oken
[39], [32]), there are several other security critical MPWAs that       issued by the TTP Facebook for authenticating U V in SP M .
are in need of close scrutiny. For instance, websites often send        The very same AccessT oken is replayed against SP T to
security-sensitive URIs to their users via email for verification       authenticate as U V .
purposes. This scenario occurs very frequently for account                      #4: The attacker completes a transaction T1 at SP T , and
registration: an account activation link is sent via email to           the order id (OrderId), issued by the TTP PayPal for com-
the user who is asked to access her email and click on the              pleting this transaction, is reused by the attacker to complete
link contained in the email message. An illustration of this            another transaction T2 at SP M without payment.
scenario is provided in Figure 1c. Here, TTP is a mailbox                       #5: The attacker completes a transaction T1 at SP T and
provider MP that guarantees SP that a user U is in control of           the payment T oken issued by the TTP PayPal for completing
a given email address (Email). During registration, U provides          this transaction is reused by the attacker to complete another
Email to SP (steps 1-5). SP sends the account activation URI            transaction T2 at SP M without payment. In [32], the interaction
(ActLink) via email to U, when U visits her inbox at MP                 with PayPal was completely skipped during T2 . Here, we focus
he gets access to ActLink (steps 6-12) and by clicking it, the          on the replay attack strategy used.
status of the account activation is loaded in U’s browser (steps                #6: The attacker spoofs the AppId of SP T in the
13-15). This scenario is not just limited to account activation         session between U V and SP M to obtain AccessT oken of U V .
as the same process is followed by many SPs to verify the               The very same AccessT oken is then replayed by the attacker
authenticity of security-critical operations such as password           in a session between SP T and U M to authenticate as U V at
                                                                        SP T . In [36], a logic flaw in flash was applied to capture the

                                                                    3
AccessT oken. Here, we focus on the replay attack strategy                                 •    REPLAY x FROM S1 IN S2 : indicating that the
used.                                                                                           value of the HTTP element x extracted while exe-
        #7: Initially, the attacker obtains an authentication                                   cuting session S1 is replayed into session S2 ;
assertion (AuthAssert) from the session between U M and                                    •    REPLACE x WITH v IN R: denoting that the HTTP
SP T . Then the attacker forces victim’s browser to submit                                      element x (e.g., SID) is replaced with the value v
AuthAssert to SP T to silently authenticate U V as U M at SP T .                                (e.g., abcd1234) while executing the sequence of
        #8: The attacker obtains the value of AuthCode during                                   HTTP requests R; and
the session between U M and SP T . The attacker forces U V ’s                              •    REQUEST-OF x FROM R: indicating the extraction
browser to submit this value to SP T to silently authenticate                                   of the HTTP request transporting the HTTP element
U V as U M at SP T .                                                                            x while executing the sequence of HTTP requests R.
        #9: The attacker replaces the value of RedirectU RI to
a malicious URI (M ALICIOUS URI) in the session between U V                             For the sake of simplicity, we present in the overall paper the
and SP M . TTP sends AuthCode of U V to M ALICIOUS URI                                  replay of a single element, but our attack patterns actually
and the attacker obtains it. The AuthCode is then replayed                              support simultaneous replay of combinations of elements. By
in the session between U M and SP T to authenticate as U V at                           abusing the notation, we use (U, SP) in place of R to indicate
SP T .                                                                                  the sequence of HTTP requests underlying the session (U, SP).
        #10: The attacker replaces the value of RedirectU RI                                The attack strategies corresponding to the attacks described
to a malicious URI (M ALICIOUS URI) in the session between                              in Table I are given in Table II.
U V and SP M . TTP sends AccessT oken of U V to M ALI -                                     In attack strategy #1 (and #2), the attacker runs a session
CIOUS URI and the attacker obtains it. The AccessT oken                                 with the victim user U V playing the role of the service provider
is then replayed in the session between U M and SP T to                                 SP M and replays AuthAssert (AccessT oken, resp.) into a
authenticate as U V at SP T .                                                           new session with a target service provider SP T . The attacker
                                                                                        tries thus to impersonate the victim (U V ) at SP T .
B. Threat Models                                                                            Attack strategy #3 is analogous to the previous ones, the
    The attacks shown in Table I can be discovered by con-                              difference being that the user role in the first session is played
sidering the Web Attacker threat model introduced in [21] and                           by the malicious user and the replayed element is P ayeeId.
outlined hereafter according to our context:                                            Here the goal of the attacker is to use credits generated by
Web Attacker. He/She can control a SP (referred to as the                               TTP, in the first session, for SP M on SP T .
SP M ) that is integrated with a TTP. The SP M can subvert                                  Attack strategy #4 (and #5) differs from the previous ones
the protocol flow (e.g., by changing the order and value of                             in that the User and the SP roles are played by U M and SP T
the HTTP requests/responses generated from her SP, including                            respectively in both sessions. In doing so, the attacker aims to
redirection to arbitrary domains). The web attacker can also                            “gain” something from SP T by re-using the T oken (OrderId,
operate a browser and communicate with other SPs and TTPs.                              resp.) obtained in a previous session with the same SP T .
Notice also that none of the attacks discussed requires the                                 Attack strategy #6 is the composition of two basic replay
threat scenario in which the TTP can be played by the                                   attack strategies. The element AppId, obtained by running a
attacker [31]. We do not consider this threat scenario.                                 session between the victim user U V and the malicious service
                                                                                        provider SP M , is replayed to get the AccessT oken which is
                                                                                        then in turn replayed by the attacker U M to authenticate as
        III. F ROM ATTACKS TO ATTACK PATTERNS                                           U V at SP T . Thus, the result should be the same obtained by
    A close inspection of the attacks in Table I reveals that:                          completing a session between U V and SP T .
    1) they leverage a small number of nominal sessions of                                  In attack strategy #7 (and #8), the HTTP request
          the MPWA under test, namely those played by U V ,                             (cf. REQUEST-OF keyword) transporting AuthAssert
          U M , SP T , and SP M , which we concisely represent by                       (AuthCode, resp.) in a session played by U M on SP T is
          (U V , SP T ), (U M , SP T ), (U V , SP M ), (U M , SP M ).4                  replaced on a sequence comprising a single HTTP request
    2) they amount to combining sessions obtained by tam-                               in which U M sends a HTTP request to SP T (denoted as
          pering with the messages exchanged in one nominal                             [U M SEND req]). Thus, the result should be the same obtained
          session or by replacing some message from one                                 by completing a session between U M and SP T .
          nominal session into another.                                                     In attack strategy #9 (and #10), the attacker includes a ma-
By session we mean any sequence of HTTP requests and                                    licious URI (M ALICIOUS URI) in the session between U V and
responses corresponding to an execution of the MPWA under                               SP T . In doing so, the credential AuthCode (AccessT oken,
test. Our goal is to identify recipes, called attack patterns, that                     resp.) is received by the attacker. By replaying this intercepted
specify how nominal sessions can be tampered with and com-                              AuthCode (AccessT oken, resp.) in the session between U M
bined to find attacks on MPWAs. We start by identifying and                             and SP T , the attacker aims to authenticate as U V in SP T . Thus,
comparing attack strategies for the attacks in Table I and then                         the result should be the same obtained by completing a session
we abstract them into general, i.e. application-independent,                            between U V and SP T .
attack patterns.                                                                            We have distilled the attack strategies in Table II into
    Attack strategies are built on top of the following three                           a small set of general, i.e. application-independent, attack
operations:                                                                             patterns which are summarized in Table III. To illustrate,
                                                                                        consider the attack pattern RA1. This pattern has been obtained
   4 For the sake of simplicity we leave B and the TTP implicit since we identify       from attack strategy #1 (#2) in Table II by abstracting the
the browser with the user. The TTP, according to the threat model considered,           element to replay, i.e. AuthAssert (AccessT oken, resp.) into
is assumed to be trustworthy.                                                           a parameter x.

                                                                                    4
                       TABLE I: Attacks against security-critical Multi Party Web Applications

#    Vulnerable MPWA                          Description of the Attack                                 Attacker’s Goal
1    SPs implementing Google’s SAML           Replay U V ’s AuthAssert for SP M in SP T                 Authenticate as
     SSO [23, §4]                                                                                       U V at SP T
2    SPs implementing OAuth 2.0 implicit      Replay U V ’s AccessT oken for SP M in SP T               Authenticate as
     flow-based Facebook SSO [38, §5.2.1]                                                               U V at SP T
3    PayPal Payments Standard implemen-       Replay P ayeeId of SP M during transaction T at SP T      Complete T at
     tation in SPs using osCommerce v2.3.1                                                              SP T
     or AbanteCart v1.0.4 [32, §IV.A.1]
4    SPs implementing CaaS solutions of       Replay OrderId of transaction T1 at SP T during trans-    Complete T2 at
     2Checkout, Chrono-Pay, PSiGate and       action T2 at SP T                                         SP T
     Luottokunta (v1.2) [35, §V.A]
5    PayPal Express Checkout implementa-      Replay T oken of transaction T1 at SP T during transac-   Complete T2 at
     tion in SPs using OpenCart 1.5.3.1 or    tion T2 at SP T                                           SP T
     TomatoCart 1.1.7 [32, §IV.A.2]
6    SPs implementing OAuth 2.0 implicit      Replay AppId of SP T in the session between U V and       Authenticate as
     flow-based Facebook SSO [36, §4.2]       SP M to obtain AccessT oken of U V which is then          U V at SP T
                                              replayed to SP T .
7    developer.mozilla.com          (SP)      Make U V browser send request to SP T with U M ’s         Authenticate as
     implementing BrowserID [24, §6.2]        AuthAssert                                                U M at SP T
8    CitySearch.com (SP) using Facebook       Make U V browser send request to SP T with U M ’s         Authenticate as
     SSO (OAuth 2.0 Auth. Code Flow)          AuthCode                                                  U M at SP T
     [25, §V.C]
9    Github (TTP) implementing OAuth 2.0      Replace the value of RedirectU RI to M ALICIOUS URI       Authenticate as
     Authorization Code flow-based SSO        in the session between U V and SP M to obtain AuthCode    U V at SP T
     [1, Bug 2]                               of U V and replay this AuthCode in the session between
                                              U M and SP T
10   SPs implementing Facebook SSO [2]        Replace the value of RedirectU RI to M ALICIOUS URI       Authenticate as
                                              in the session between U V and SP M to obtain             U V at SP T
                                              AccessT oken of U V and replay this AccessT oken in
                                              the session between U M and SP T

                                   TABLE II: Known Attacks Strategies against MPWAs

           Id    Attack Strategy
           1     REPLAY AuthAssert FROM (U V , SP M ) IN (U M , SP T )
           2     REPLAY AccessT oken FROM (U V , SP M ) IN (U M , SP T )
           3     REPLAY P ayeeId FROM (U M , SP M ) IN (U M , SP T )
           4     REPLAY OrderId FROM (U M , SP T ) IN (U M , SP T )
           5     REPLAY T oken FROM (U M , SP T ) IN (U M , SP T )
           6     REPLAY AccessT oken FROM S IN (U M , SP T )
                 where S = REPLAY AppId FROM (U M , SP T ) IN (U V , SP M )
           7     REPLACE x WITH REQUEST-OF AuthAssert FROM (U M , SP T ) IN [U M SEND x]
           8     REPLACE x WITH REQUEST-OF AuthCode FROM (U M , SP T ) IN [U M SEND x]
           9     REPLAY AuthCode FROM S IN (U M , SP T )
                 where S = REPLACE RedirectU RI WITH M ALICIOUS URI IN (U V , SP T )
           10    REPLAY AccessT oken FROM S IN (U M , SP T )
                 where S = REPLACE RedirectU RI WITH M ALICIOUS URI IN (U V , SP T )




                                                           5
                                                        TABLE III: Attack Patterns

Name       Attack Strategy                                                  Precondition                                         Postcondition

RA1        REPLAY x FROM (U V , SP M ) IN (U M , SP T )                     (TTP-SP ∈ x.flow AND (SU|UU) ∈ x.labels)             (U V , SP T )
RA2        REPLAY x FROM (U M , SP M ) IN (U M , SP T )                     (SP-TTP ∈ x.flow AND (SU|AU) ∈ x.labels)             (U M , SP T )
RA3        REPLAY x FROM (U M , SP T ) IN (U M , SP T )                     (TTP-SP ∈ x.flow AND SU ∈ x.labels)                  (U M , SP T )
RA4        REPLAY y FROM S IN (U M , SP T )                                 (SP-TTP ∈ x.flow AND (SU|AU) ∈ x.labels AND          (U V , SP T )
           where S = REPLAY x FROM (U M , SP T ) IN (U V , SP M )            TTP-SP ∈ y.flow AND (SU|UU) ∈ y.labels)
LCSRF      REPLACE req WITH REQUEST-OF y                                    (TTP-SP ∈ y.flow AND (SU|UU) ∈ y.labels)             (U M , SP T )
           FROM (U M , SP T ) IN [U M SEND req]
RedURI     REPLAY y FROM S IN (U M , SP T )                                 (SP-TTP ∈ x.flow AND RURI ∈ x.labels) AND            (U M , SP T )
           where S = REPLACE x WITH x0 IN (U V , SP T )                      TTP-SP ∈ y.flow AND (SU|UU) ∈ y.labels)

RA5        REPLAY x FROM (U V , SP T ) IN (U M , SP T )                     (TTP-SP ∈ x.flow AND (SU|UU) ∈ x.labels AND          (U V , SP T )
                                                                             x.location = REQUEST URL)
Legenda: The notation (x|y) ∈ S is used to abbreviate (x ∈ S OR y ∈ S).


     The generation of all other attack patterns go along the               elements that are issued by the TTP to SP T for U V . Notice that
same lines. For the creation of the attack pattern LCSRF we                 in the preconditions it is mentioned that the security critical
were clearly inspired by attacks #7 and #8. It turns out that this          parameters which are used in this attack strategy must be
attack pattern is a bit more general than what it was created for.          located in the request URL. The request URLs of a browsing
In fact, it can uncover general CSRF based on POST requests.                session are likely to be stored in the browser history.
An example of this will be discussed in the illustrative example                Last, but not least, attack patterns need a way to determine
of Section IV.                                                              whether the attack strategy they executed was successful to
     A key step in the execution of an attack pattern is the selec-         detect any attack. The postconditions included in Table III
tion of the elements to be replaced or replayed. For instance,              serve this purpose. The idea is that each one of the four
when executing RA1 against a given MPWA, the parameter x                    nominal sessions is associated with a Flag that defines what
can be instantiated with any element occurring in the HTTP                  determines the successful completion of it. For instance, a
trace resulting from the execution of (U V , SP M ). Trying them            string “Welcome Victim” could be the Flag for the nominal
all is clearly not acceptable. To tackle the problem, we inspect            session (U V , SP T ) of a MPWA implementing a SSO solution
the sessions and enrich the elements occurring in the HTTP                  (assuming that “Victim” is the name provided by U V at SP T ).
trace with syntactic, semantic, location and flow labels whose              The concept of Flag will be further clarified in the next section.
meaning is summarized in Figure 2. The preconditions in                     The postcondition is just a program that checks whether a
Table III determine how these elements are selected for each                certain Flag is captured or not while executing the strategy.
pattern.                                                                    A value of the form (U, SP ) in the column Postcondition
     For instance, since RA1 is a replay attack that tries to re-           stands for this program checking for the Flag associated with
play an element from (U V , SP M ) to (U M , SP T ), it is reasonable       (U, SP ).
to replay only those elements that flow from TTP to SP, i.e.                    It must be noticed that the definition of postcondition
data flow label TTP-SP. Indeed, these are the ones that are                 depends on the specific MPWA under test.
likely to comprise specific values that TTP issues for U V . In
addition, it would make little sense to replay elements whose                                       IV. A PPROACH
values do not change over different traces. This is why that                    Figure 3 outlines the two processes underlying our ap-
pattern selects only elements in the trace that are tagged either           proach. In the first one, executable attack patterns are created,
as session unique (SU) or user unique (UU) (the users are                   reviewed, and improved by security experts (see Section IV-A).
different among the sessions where the replay takes place).                 The second process enables testers to identify security issues
The precondition of RA2 is analogous to that of RA1, but                    in their MPWAs. In a nutshell, the testers (e.g., developers of
since RA2 replays an element from (U M , SP M ) to (U M , SP T ),           a MPWA) take advantage of the security knowledge embedded
then that element must flow from SP to TTP. Similar reasoning               within the executable attack patterns. We will see that what is
holds for other attack patterns. Notice that for RedURI pattern             requested to testers is not much more of what they have to do
(inspired by attacks #7 and #8), we consider only the URLs                  anyhow in order to test the business logic of their MPWAs.
that are chosen by the SP T , but can be changed by the users               See Section IV-B for details.
(see definition of RURI label in Figure 2).
                                                                            A. Creating, reviewing, and improving Attack Patterns
     In Table III, we have also introduced a new attack pattern
                                                                                Working on our attack patterns require web application
named RA5 which is inspired by the “credential leak in
                                                                            security knowledge and implementation skills. Security ex-
browser history” threat model which is mentioned in the OAuth
                                                                            perts, in particular those who perform penetration testing
2.0 threat model and security considerations document [20].
                                                                            of web applications, have clearly both. Security experts can
According to this threat model, U M and U V share the same
                                                                            thus read and understand attack patterns like those sketched
browser. In the attack strategy, U M replays (to SP T ) the HTTP
                                                                            in Table III. Improving an attack pattern, by changing few

                                                                        6
 Syntactic labels provide type information:a                                    attack patterns is, of course, another source of inspiration. In
 - URL: a URL, e.g.,redirect uri=http://google.com,                             general, security experts can craft attack patterns capturing
 - BLOB: an alphanumeric string with (optionally) special                       novel attack strategies to explore new types of attacks. This
  characters, e.g., code=vrDK7rE4,                                              is the case for attack pattern RA5, which we developed to
 - WORD: a string comprised only of alphabetic characters,                      explore the “credential leak in browser history” threat model
  e.g., response type=token,                                                    (e.g., see [20, §4.4.2.2]). This threat model, referred to as the
 - EMAIL: an email address, e.g., usrname=jdoe@example.                         browser history attacker, is important because browsers can
  com,                                                                          be shared (e.g., public libraries, internet cafes). To the best of
 - EMPTY: an empty value, e.g., state=,                                         our knowledge, we are the first to include this threat model in
 - NUMBER: a number, e.g., id=5,                                                a black-box security testing approach.
 - BOOL: a boolean value, e.g., new=true, and                                       A browser history attacker shares the same browser with
 - UNKNOWN: none of the other syntactic labels match this                       other Users. It is assumed that the user does not always clear
  string, e.g., #target.                                                        her browser history, but she properly signs out from her login
 Semantic labels provide information on the role played by the                  sessions. The attack pattern RA5 leverages this threat model by
 element within the MPWA:b                                                      replaying all the elements issued by the TTP that the attacker
                                                                                can collect from the browser history of the victim. As we
 - SU (Session Unique): the element is assigned different
                                                                                will see in Section VI, by using this threat model, we have
  values in different sessions.
                                                                                been able to detect two attacks that could not be discovered
 - UU (User Unique): the element is assigned the same value
                                                                                automatically using other state-of-the-art black-box security
  in the sessions of the same user.
                                                                                testing techniques.
 - AU (App Unique): the element is assigned the same value
  in the sessions of a single SP.
                                                                                B. Security Testing Framework
 - MAND (Mandatory): the element must occur for the proto-
                                                                                    The different phases of our security testing framework are
  col to complete successfully.
                                                                                described below. Figure 4 shows how these phases concretely
 - RURI (Redirect URI): the element must be MAND, it must
                                                                                apply on the following illustrative example: The developer
  be a URL that is passed as a parameter in a request uri and it
                                                                                Diana has implemented the Stripe checkout solution in her
  is later found in the Location header of a redirection response.
                                                                                web application. She is required to ensure that (r1) the new
 Flow labels represent the data flow properties of an element in                feature works as it should and (r2) it does not harm the
 the HTTP traffic. Currently we have two flow labels: TTP-                      security of her web application. Diana feels confident for (r1)
 SP and SP-TTP. Label TTP-SP (SP-TTP, resp.) means                              as the Stripe API is documented and there are several demo
 that the corresponding element has been received from TTP                      implementations available in the Internet that she can use as
 (SP, resp.) and then sent to SP (TTP, resp.). Location labels                  references. However, she does not for (r2) as she does not have
 denotes the location in the HTTP Message where the element                     a strong security background.
 has been found. The labels that we use are REQUEST URI,                            Let us see how our approach empowers people like Diana
 REQUEST H EADER , REQUEST B ODY , RESPONSE H EADER and                         (referred to as the tester) to do a systematic usage of the body
 RESPONSE B ODY indicating the location of the element as                       of knowledge collected by security experts.
 request URI, request header, request body, response header                         (P1) Configuration. The tester configures the testing envi-
 and response body respectively.                                                ronment so to be able to collect traces for the four nominal ses-
   a Most of the syntactic labels are borrowed from [36], [32]
   b While the SU and UU labels are borrowed from [36], the AU and RURI         sions: S1 = (U V , SP T ), S2 = (U M , SP T ), S3 = (U V , SP M ),
 labels are new. The MAND label generalizes the SEC label introduced in [36],   and S4 = (U M , SP M ). To this end, the tester creates two user
 where it was used to indicate a secret specific to the current session and     accounts, U V and U M , in her service provider SP T and in
 necessary for the success of the authentication, while here MAND is not        a reference implementation SP M (the purpose of SP M is to
 necessarily secret and SU.                                                     represent the SP controlled by the malicious party). Notice
                                                                                that, this step does not require a strong security background
   Fig. 2: Syntactic, Semantic, Flow and Location Labels                        and normally does not add-up any additional cost for the tester
                                                                                that wants to functionally test her MPWA. All major TTPs
                                                                                provide reference implementations—e.g., [7], [6], [9], [4]—
                                                                                to foster adoption of their solutions. In case a working official
                                                                                reference implementation is not available, another SP (running
                                                                                the same protocol) can be used.
                                                                                    (P2) Recording. In order to enable the testing engine to
                                                                                automatically collect the necessary HTTP traffic, the tester
                          Fig. 3: Approach                                      records the user actions (UAs for short) corresponding to
                                                                                sessions S1 to S4 . This amount to collecting the actions U V
                                                                                and U M perform on the browser B while running the protocol
things here and there to e.g., make it a bit more general,                      with SP T and SP M . Additionally, for each sequence of UAs,
is also a straightforward follow-up step. Creation of attack                    the tester must also identify a Flag, i.e. a regular expression
patterns asks for some more effort and, more importantly,                       representing a pattern in the HTTP traffic which can be used to
for inspiration. As discussed in Section III, with the only                     determine the successful execution of the user actions. Flags
exception of RA5, all attack patterns in Table III have been                    must be different between each other so to be able to ensure
inspired by attacks reported in literature. The discovery of a                  which session was completed without any ambiguity. Stan-
previously unknown attack not yet covered by our catalog of                     dard web browser automation technologies such as Selenium

                                                                            7
The Stripe checkout protocol is illustrated in Figure 4a. It is slightly different than
the PayPal Payments Standard presented in Figure 1b. Hereafter how the Stripe
protocol works. In steps 1-5, the user U visits SP—an e-shopping application—at
URI SP and initiates the checkout of a product item I—the item is identified by
I ID. Upon receiving the checkout request, SP returns a payment form embedded
with a unique identifier (DataKey) issued by Stripe to SP (step 6). The user
provides credit card details (Credentials) to Stripe and DataKey is sent in this
request (steps 7-8). After verifying the validity of Credentials, Stripe returns a
token (T oken) which is specific to the SP (steps 9-10). Upon presenting T oken and
Secret (a secret credential possessed by each SP integrating the Stripe checkout
solution) and Amt (cost of I), SP withdraws Amt from the user’s credit card
(steps 11-12). Finally, the status of the transaction is sent to the user (step 13).                                 (a) Stripe checkout protocol

(P1) Configuration. Diana uses the SP she implemented as                                      (b) User Actions and Flags of Stripe Checkout
SP T and the official reference implementations provided by
Stripe [14] as SP M . For each of them, she creates the two user                     No.     Session          UAs                          Flag
accounts U V and U M .
                                                                                     S1      (U V , SP T )    1. Visit URI SP T            “bought I1 ”
                                                                                                              2. Click Checkout
(P2) Recording. Table 4b summarizes the UAs and Flags                                                         3. Enter credentials U V
collected by Diana during the recording phase. Note that the
UAs are obtained from steps 1, 4, and 7 of Figure 4a, while the                      S2      (U M , SP T )    1. Visit URI SP T            “bought I2 ”
Flag is derived from step 13 in Figure 4a (I1 -I4 indicate four                                               2. Click Checkout
                                                                                                              3. Enter credentials U M
different items).
                                                                                     S3      (U V , SP M )    1. Visit URI SP M            “Enjoy I3 ”
(P3) Inference. An excerpt of the inference results of the                                                    2. Click Checkout
protocol underlying Diana’s implementation of the Stripe                                                      3. Enter credentials U V
checkout protocol is shown in Table 4c.
                                                                                     S4      (U M , SP M )    1. Visit URI SP M            “Enjoy I4 ”
                                                                                                              2. Click Checkout
(P4) Application of Attack Patterns. The result of applying                                                   3. Enter credentials U M
each attack pattern of Table III on this example is reported in
Table 4d.                                                                                        (c) Excerpt of Inference on Stripe Checkout

(P5) Reporting. The RA4 and LCSRF attacks are reported to                              Element           Data Flow          SynLabel      SemLabel
Diana. Execution details of attack patterns are logged and can                         DataKey           SP-TTP             BLOB          MAND, AU
be inspected.                                                                          T oken            TTP-SP             BLOB          MAND, SU

                                                 (d) Attack Pattern Application on Stripe Checkout

  RA1     REPLAY T oken FROM (U V , SP M ) IN (U M , SP T ). This attack pattern reports no attacks. When the attack test-case reaches step 10 of Figure 4a,
          U V ’s T oken which was actually issued for SP M is replayed by U M against SP T . The TTP Stripe identifies a mismatch between the owner of Secret
          and the SP for which T oken was issued and returns an error status at step 12.
  RA2     REPLAY DataKey FROM (U M , SP M ) IN (U M , SP T ). No attacks reported. Similar reasons as the previous one: the attacker replays DataKey
          belonging to SP M in the checkout session at SP T . Hence the T oken returned by TTP cannot be used by SP T to receive a success status at step 12.
  RA3     REPLAY T oken FROM (U M , SP T ) IN (U M , SP T ). No attack reported. In Stripe checkout, the validity of a T oken expires once it is used. Reuse
          of T oken returns an error.
  RA4     REPLAY DataKey FROM (U M , SP T ) IN S where S = REPLAY T oken FROM S IN (U M , SP T ). This attack pattern reports an attack as there
          is no protection mechanism in the Stripe checkout solution that prevents spoofing of the DataKey by another SP. Initially, the attack test case
          replays the DataKey from (U M , SP T ) into (U V , SP M ). When the T oken obtained in this session by SP M is replayed into session (U M , SP T ),
          Stripe does not identify any mismatch and returns a success status at step 12. This allows the attacker U M to impersonate U V and to purchase a
          product at SP T .
  RA5     This attack strategy is not applicable to Stripe as there are no elements with data flow TTP-SP that also have R EQUEST URL as location (basically
          none of those elements would be present in the browser history).
LCSRF     REPLACE req WITH REQUEST-OF T oken FROM (U M , SP T ) IN [U M SEND req].
          This pattern detects an attack. The test case generated sends a HTTP POST request corresponding to step 10 with an unused T oken. This request
          alone is enough to complete the protocol and to uncover a CSRF. In our experiment, this was discovered on the demo implementation of Stripe.
          Indeed it is not unusual that this kind of protections are missing in the demo systems. We do not know whether any productive MPWAs suffer from
          this. Determining this would require specific testing users on the productive system and the buying of real products.
RedURI    This pattern is not applicable as there are no URIs that have data flow TTP-SP and semantic property RURI.



                                      Fig. 4: Security Testing Framework on an illustrative example




                                                                            8
WebDriver [13] and Zest [17] can be used for recording UAs.
Such technology could be extended to allow the tester to define
Flags by simply clicking on the web page elements (e.g., the
payment confirmation form) that identify the completion of
the user actions. Off-the-shelf market tools already implement
this kind of feature to determine the completion of the login
operation.
    (P3) Inference. The inference module automatically ex-
ecutes the nominal sessions recorded in the previous phase
and tags the elements in the resulting HTTP traffic with the
labels in Figure 2. We do not exclude that in the future more
information (e.g., inference of the observable workflow of
the MPWA [32]) could be necessary to target more complex
attacks. While we borrow the idea of inferring the syntactic
and semantic properties from [36] and [32], we introduce the
concept of inferring flow labels to make our approach more
automatic (compared to [36]) and efficient (less no. of test
cases for detecting the same attack mentioned in [32]).
    The inference results of sessions S1 to S4 are stored in a
data structure named labeled HTTP trace.
    (P4) Application of Attack Patterns. Labeled HTTP
traces (output of inference) are used to determine which attack                                     Fig. 5: Testing Engine Architecture
patterns shall be applied and corresponding attack test cases
are executed against the MPWA.
    (P5) Reporting. Attacks (if any) are reported back to the
tester and the tester evaluates the reported attacks.                                  Trace collection (steps 2-3) The input UAs are executed
                                                                                       and corresponding HTTP traces are collected. The Flags are
                    V. I MPLEMENTATION                                                 used to verify whether the collected traces are complete. We
    We implemented our approach on top of OWASP ZAP                                    represent the collected HTTP traces as HT (S1 ), HT (S2 ),
(ZAP, in short). In this way, the two core phases of our                               HT (S3 ), and HT (S4 ). The traces are stored as an array
testing engine (cf. P3 and P4 in previous section) are fully                           of hrequest, response, elementsi triplets. Each triplet com-
automated and take advantage of ZAP to perform common                                  prises the HTTP request sent via ZAP to the MPWA, the
operations such as execution of UAs, manipulating HTTP                                 corresponding HTTP response, and details about the HTTP
traffic using proxy rule, regular expression matching over                             elements exchanged. An excerpt of a trace related to our illus-
HTTP traffic, etc. Figure 5 outlines the high-level architecture                       trative example (Figure 4a) is depicted in Figure 7 in JSON for-
of our testing engine. The Tester provides the necessary input                         mat. For simplicity, we present only one entry of the trace array
to our Testing Engine that in turns employs OWASP ZAP to                               and only one HTTP element. We assume the reader is familiar
probe the MPWA.5 In particular, the Testing Engine invokes                             with standard format of the HTTP protocol. Here we focus
the API exposed by ZAP to perform the following operations:                            on the HTTP elements. For each of them we store the name
    • (Execute user actions and collect HTTP traces.)                                  (“name”), the value (“value”), its location in the request/re-
         UAs, expressed as Zest script, can be executed via                            sponse (“source”, e.g., source:"request.body" indi-
         the Selenium WebDriver module in ZAP and the                                  cates that the element occurs in the request body of the HTTP
         corresponding HTTP traffic can be collected from                              request), the associated request URL (“url”), its data flow
         ZAP.                                                                          patterns, syntactic and semantic labels that are initially empty
    • (Proxy rule setting.) Proxy rules can be specified, as                           and will be inferred in the next activities. For instance, the
         Zest scripts, to mutate HTTP requests and response                            element illustrated in Figure 7 is the T oken shown in step 10
         passing through the built-in proxy of ZAP.                                    of Figure 4a.
    • (Evaluate Flag.) Execute regular expression-based                                Syntactic and Semantic Labeling (steps 4-10) The collected
         pattern matching within the HTTP traffic so to, e.g.,                         HTTP traces are inspected to infer the syntactic and seman-
         evaluate whether the Flag is present in the HTTP                              tic properties of each HTTP element, reported in Figure 2.
         traffic.                                                                      While syntactic labeling is carried out by matching the HTTP
Hereafter, we detail the two core phases (P3 and P4) of our                            elements against simple regular expressions, semantic labeling
Testing Engine that follow the flow depicted in Figure 6. Each                         may require (e.g., for MAND) active testing of the MPWA.
step is tagged by a number to simplify the presentation of the                         For instance, to check whether an element e occurring in
flow.                                                                                  HT (U M , SP T ) is to be given the label MAND, the inference
    1) Inference: With reference to the steps of Figure 6, the                         module generates a proxy rule that removes e from the HTTP
following activities are performed by the inference module                             requests (step 6). By activating this proxy rule (step 7), the
after the tester records (step 1) the four hUAs, Flagi corre-                          inference module re-execute the UA corresponding to the
sponding to sessions S1 , S2 , S3 , and S4 in (P2).                                    session (U M , SP T ) and checks whether the corresponding Flag
   5 The “R” with the small arrow is a short notation of the request-response          is present in the resulting trace (steps 8-9). For instance, the
channel pair that clarifies who are the requester and the responder of a generic       element T oken (see Figure 7) is assigned the syntactic labels
service.                                                                               BLOB and the semantic labels SU and MAND.

                                                                                   9
                                                   Fig. 6: Testing Engine Flow


Data Flow Labeling (step 11) After syntactic and semantic               responding Flags. The Goal, Preconditions, Actions
labeling, the data flow properties of each MAND element in              and Postconditions are built on top of the Inputs.
the trace is analyzed to identify the data flows (either TTP-           The pattern is applicable if and only if its Preconditions
SP or SP-TTP). In order to identify the protocol patterns,              hold (steps 12-14 of Figure 6). As soon as the pattern
it is necessary to distinguish TTP and SP from the HTTP                 Preconditions hold, the Actions are executed (steps
trace. We do this by identifying the common domains present             15-17 of Figure 6). The Actions contain the logic for
in the HTTP trace of the two different SPs (SP T and SP M )             generating proxy rules that mimics the attack strategy. The
implementing the same protocol and classifying the messages             generated proxy rules are loaded in ZAP and UAs are ex-
from/to these domains as the messages from/to TTP.                      ecuted. The execution of UAs generates HTTP requests and
    The output of the inference phase is the labeled HTTP               responses. The proxy rules manipulates the matching requests
traces of sessions S1 to S4 (represented as LHT (S1 ),                  and responses. As last step of the Actions execution, the
LHT (S2 ), LHT (S3 ), and LHT (S4 )).                                   Postconditions are checked. If they hold (step 18 of
    2) Attack Pattern Engine: For the simplicity of explanation,        Figure 6), an attack report is generated with the configuration
we represent our attack patterns in the same way as the attack          that caused the attack (step 19 of Figure 6).
graph notation introduced in [33]. Each attack pattern has a            Example on Attack Pattern for RA1. To illustrate, let us
Name, the underlying Threat model, Inputs used, the                     consider the Replay Attack pattern RA1 reported in Table III.
Goal the attacker (who follows the attack strategy defined in           In Listing 1, we show the pseudo-code describing it.
the pattern) aims to achieve, Preconditions, Actions                        The Threat model considered is the web attacker. To
and Postconditions. The Inputs to the attack pattern                    evaluate the applicability of the pattern, the output of the
range over the LHTs (labeled HTTP traces generated by the               inference phase is sufficient (LHT (U V , SP M )): the attack
inference module), UAs of the nominal sessions, and the cor-

                                                                   10
                                                                                                                  Listing 2: Extract function

                                                                                          v a l u e e x t r a c t ( i d x , u a s UAs ) {                                    1

                                                                                              rb = g e n e r a t e b r e a k r u l e ( x )                                   2

                                                                                              load rule ZAP ( rb )                                                           3
                                                                                             HTTP logs = execute ZAP ( UAs )                                                 4

                                                                                             e = e x t r a c t v a l u e ( x , HTTP logs )                                   5
                                                                                              clear rules ZAP                                                                6

                                                                                              r e t u r n e}                                                                 7




                                                                                                                  Listing 3: Replay function

                                                                                          HTTP logs r e p l a y ( i d x , v a l u e e , u a s UAs ) {                        1

                                                                                            rr = generate replay rule (x , e)                                                2
                                                                                            load rule ZAP ( r r )                                                            3

                                                                                            HTTP logs = execute ZAP ( UAs )                                                  4

                                                                                            r e t u r n HTTP logs }                                                          5




                                                                                          ZAP. The ZAP API call execute ZAP(UAs) executes the UAs
       Fig. 7: HTTP trace with empty labels (an excerpt)                                  in ZAP and returns the generated HTTP logs. The HTTP logs
                                                                                          are taken as input by the function extract value (x, HTTP logs)
                                                                                          extracting from them the value e, associated to x. In Listing 3,
                  Listing 1: Attack Pattern for RA1                                       the function generate replay rule (x, e) returns the proxy rule
                                                                                          rr used to detect and replace the value of the element x with e.
                                                                                          Then, the ZAP API call load rule ZAP(rule) loads rr in ZAP.
Name: RA1                                                                       1
                                                                                          The ZAP API call execute ZAP(UAs) executes the UAs in ZAP
Threat Model: Web Attacker                                                      2

Inputs: UAs ( U V , SP M ) , LHT( U V , SP M ) ,                                3
                                                                                          and returns the generated HTTP logs.
            UAs ( U M , SP T ) , F l a g ( U V , SP T )                         4            Notice that, besides the functions mentioned above, in
Preconditions: At least one element x in LHT(U V , SP M ) 5                               order to help the security expert in defining new attack patterns,
  is such that (TTP-SP ∈ x.flow AND (SU|UU) ∈x.labels)                          6
                                                                                          we provide several functions.6
Actions:                                                                        7
  For each x such that preconditions hold                                       8                               VI. E VALUATION
  e = e x t r a c t ( x , UAs ( U V , SP M ) )                                  9             To test the effectiveness of our approach, we ran our
  HTTP logs = r e p l a y ( x , e , UAs ( U M , SP T ) )                        10
                                                                                          prototype implementation against a large number of real-
  Check Postconditions;                                                         11
                                                                                          world MPWAs. In Section VI-A, we explain the criteria
Postconditions:Check F l a g ( U V , SP T ) in HTTP logs 12
                                                                                          based on which we selected our target MPWAs. Next, in
                R e p o r t ( e , UAs ( U M , SP T ) , F l a g ( U V , SP T ) ) 13
                                                                                          Sections VI-B and VI-C, we explain the attacks we discovered
                                                                                          (both automatically and with manual support) and finally,
                                                                                          in Section VI-D, we provide some information on how we
                                                                                          (responsibly) disclosed our findings to the affected vendors.
pattern is executed in case at least one element x has the
proper data flow and semantic label (lines 6-7). For each se-                             A. Target MPWAs
lected element x (line 9), the function extract (x, UAs(U V ,SP M ))                          We selected SSO, CaaS and VvE (see Figure 1c) scenarios
(line 10) executes UAs(U V , SP M ), returning the value e as-                            as the targets of our experiments. For the SSO scenario, we
sociated with x. This value e is then used by the function                                adopted the Google dork strategy mentioned in [8] to identify
replay (x, e , UAs(U M , SP T )) (line 11) to replay the value of e                       SPs integrating SSO solutions offered by LinkedIn, Instagram,
while executing UAs(U M , SP T ), and generating the correspond-                          PayPal and Facebook. Additionally, we prioritized the Google
ing HTTP traffic logs (HTTP logs). This logs are finally used                             dorks results using the Alexa rank of SPs. For the CaaS
in the Postconditions to check whether Flag(U V , SP T )                                  scenario, we targeted open-source e-commerce solutions and
occurs. To clarify how the attack pattern engine leverages the                            publicly available demo SPs integrating 2Checkout and Stripe
API exposed by ZAP to interact with the built-in proxy, the                               checkout solutions. For the VvE scenario, we selected the
pseudo-codes corresponding to the extract and replay functions                            websites belonging to the Alexa Global Top 500 category.7
are reported in Listing 2 and Listing 3, respectively. In List-
                                                                                          B. Results
ing 2, at first, the function generate break rule (x) is invoked.
                                                                                             We have been able to identify several previously unknown
Given an element x, it returns a proxy rule rb which sets a
                                                                                          vulnerabilities and they are reported in Table IV. We have
break point to the execution of the user actions in ZAP, when
an occurrence of x is detected. The proxy rule includes regular                              6 The full list of functions that can be used in the definition of attack patterns
expressions for uniquely identifying an elements in the HTTP                              is available at https://sites.google.com/site/mpwaprobe.
traffic. Then, the ZAP API call load rule ZAP(rule) loads rb in                              7 www.alexa.com/topsites




                                                                                     11
promptly notified our findings to the flawed SPs and TTPs                         CSRF attack against twitter.com and demonstrated
and most of them acknowledged our reports and patched                             how a login CSRF attack in twitter.com becomes a
their solutions accordingly. Additional information regarding                     login CSRF vulnerability on all of its client websites.
the disclosures is given in Section VI-D. Screencasts of the                 3) Attacks to different protocols (NP): A known kind of
attacks and the details about our interactions with the vendors          attack is applied to different protocols or implementations
are available in the companion website. Some SPs have not                of the same scenario (SSO, CaaS, or VvE). Using the RA1
patched the vulnerabilities yet, and thus in Table IV we have            attack pattern which is inspired by the attacks against Google’s
anonymized their names.                                                  SAML SSO (cf. #1 of Table I) and Facebook’s OAuth SSO
    We cluster the attacks into four classes (see last column of         (cf. #2 of Table I), we discovered a similar issue in the
Table IV) according to their similarities with respect to known          integration of the LinkedIn JS API SSO solution at INstant [7]
attacks. This allows us to show the capability of our approach           (#a6 ) and another SP (#a5) which has an Alexa US Rank9
to not only detect attacks that are already known in literature,         less than 55,000. The vulnerable SPs authenticated the users
but also to find similar attacks in MPWAs implementing                   based on their email address registered at LinkedIn and not
different protocols and in different MPWA scenarios.                     based on their SP-specific user id.
    1) New kind of attack (N): The RA5 pattern that leverages                We discovered login CSRF attacks in two SPs (#a8, both
the browser history attacker threat model discovered an attack           having Alexa Global Rank less than 1000) integrating the
in the integration of the LinkedIn JS API SSO solution                   Instagram SSO solution and another SP (#a9 of Table IV,
at developer.linkedin.com (#a2). The presence of the non-                with Alexa Australia rank10 less than 4200) integrating the
expiring user id of the victim in the browser history allows             LinkedIn OAuth 2.0 SSO. The attack pattern that discovered
an attacker to hijack the victim’s account. Another SP website           these attacks is inspired by login CSRF attacks against SPs
that appears in the Alexa top 10 e-commerce website category8            integrating the Browser Id SSO and Facebook SSO solutions
is also vulnerable to the same attack (#a1).                             (see #7 and #8 of Table I).
    2) Attacks to different scenarios (NS): A known kind of                  Our attack pattern that tampers the redirect URI (inspired
attack has been applied to a different MPWA scenario. By                 by #9 of Table I) reported that in Pinterest’s implementation
applying the RA4 attack pattern, we were able to detect                  of the Facebook SSO, it is possible to leak the OAuth 2.0
a previously unknown attack in the CaaS scenario (#a3 of                 authorization code of the victim to the network attacker by
Table IV). It must be noted that RA4 is inspired by an attack in         changing the protocol of the redirect URI from “https” to
SSO scenario (see #6 of Table I), and our protocol-independent           “http” (#a10 of Table IV). This attack was possible due to
approach allowed us to detect it in CaaS scenario. In particular,        the presence of a Pinterest authentication server that is not
we identified the attack in the payment checkout solution                SSL protected. The same vulnerability was found in all SPs
offered by Stripe: the attack allows an attacker to impersonate          implementing the “Login with PayPal” SSO solution [5] (#a11
a SP by replaying its publicly available API key (DataKey                of Table IV). However, in this case it was due to incorrect
in Figure 4a) to obtain a payment token (T oken in Figure 4a)            validation of the redirect URI by the IdP PayPal.
from the victim user which is subsequently used to shop at                   4) Attacks to new SPs (NA): A known kind of attack
the impersonated SP’s online shop using the victim’s credit              on a specific protocol is applied to new SPs (still using
card. As reported in Table IV, this attack is applicable to all          the same protocol offered by the same TTP). This shows
SPs implementing the Stripe checkout solution [14]. Similarly,           how our technique can cover the kinds of attacks that were
using our login CSRF attack pattern (inspired by attacks in              reported in literature. For instance, in [35], the authors mention
SSO), we tested the VvE scenario and discovered the following            that a logical vulnerability in the 2Checkout integration in
(#a4):                                                                   osCommerce v2.3 enables an attacker to reuse the payment
    • login CSRF attack in the account registration process              status values of the paid order to bypass payment for future
         of open.sap.com and six other SPs (all having Alexa             orders (cf. #4 of Table I). We tested the 2Checkout integration
         Global rank less than 500). One of the victim SP is a           in the latest version of OpenCart (v2.1.0.1) and noticed that
         popular video-sharing website. The account activation           our RA3 attack pattern discovered a similar attack (#a12 of
         link (ActLink of Figure 1c) issued by this website              Table IV).
         not only activated the account, but also authenticated
         the user without asking for credentials. An attacker            C. Manual Findings
         can create a fake account that looks similar to the                 In [36], the authors were able to manually discover exploit
         victim’s account and authenticate the victim to the             opportunities in SSO integrations by analyzing the inference
         fake account (this can be done when victim visits               results of the HTTP traffic. Since our inference module is an
         attacker’s website). As mentioned in [26], this enables         extension of [36], we were also able to manually identify two
         the attacker to keep track of the videos searched by            attacks. We created one single attack pattern that generalizes
         the victim and use this information to embarrass the            the XSS attack strategy reported in [22, §4]. While writing the
         victim.                                                         preconditions and the attacker strategy was straightforward,
    • twitter.com sends an email to a user if he/she has                 the postcondition was more challenging. Indeed establishing
         not signed into twitter for more than 10 days. The              whether a XSS payload is successfully executed is a well-
         URLs included in this email directly authenticates the          known issue in the automatic security testing community. In
         user without asking for credentials. This is a perfect          our preliminary experiments, we just relied on the tester to
         launchpad for performing login CSRF attacks. The                inspect the results of the pattern and to determine whether
         authors of [25] discovered a standard form-based login
                                                                           9 http://www.alexa.com/topsites/countries/US
  8 www.alexa.com/topsites/category/Top/Business/E-Commerce                10 http://www.alexa.com/topsites/countries/AU




                                                                    12
                                                  TABLE IV: Attacks discovered

      Attack
#                   SP                                             TTP (& protocol)                       Element(s)                   Class
      Pattern
a1    RA5           AlexaEcommerce-10                              LinkedIn JS API SSO                    U Id, Email
                                                                                                                                       N
a2    RA5           developer.linkedin.com                         LinkedIn JS API SSO                    M emberId, AT oken
a3    RA4           All SPs                                        Stripe Checkout                        DataKey, T oken
a4    LCSRF         twitter.com, open.sap.com,                     Gmail                                  ActLink                      NS
                    other 6 SPs in Alexa Global Top 500
a5    RA1           AlexaUS-55000                                  LinkedIn JS API SSO                    Email
a6    RA1           INstant                                        LinkedIn JS API SSO                    AccessT oken
a7    XSS           INstant                                        LinkedIn JS API SSO                    F name, LN ame
a8    LCSRF         AlexaGlobal-1000a, AlexaGlobal-1000b           Log In With Instagram                  Code                         NP
a9    LCSRF         AlexaAu-4200                                   LinkedIn OAuth 2.0 SSO                 Code
a10   RedURI        pinterest.com                                  Facebook SSO Auth.Code Flow            RedU ri
a11   RedURI        All SPs                                        PayPal Log In                          RedU ri
a12   RA3           OpenCart v2.1.0.1                              2Checkout                              Order number, Key
                                                                                                                                       NA
a13   XSS           AlexaGlobal-300                                LinkedIn REST API SSO                  AboutM e


the XSS payload was successfully executed. By doing so,                 was already known) and the authors explain how this causes a
we uncovered a XSS vulnerability in the INstant website                 login CSRF in SPs integrating Twitter’s SSO solution. Further
[7] integrating the LinkedIn JS API SSO. Additionally, we               details about the disclosures are available at our website.
manually analyzed the data flow between SP and TTP in SPs
integrating LinkedIn REST API SSO to identify tainted data
elements. We replaced the value of tainted elements with XSS                                  VII. R ELATED W ORK
payloads and identified another XSS vulnerability in a SP that          A. Attack pattern-based Black-Box Techniques.
has Alexa Global rank less than 300 (#a13).                                 Wang et al. [37] conducted a detailed study of the security
                                                                        of Cashier-as-a-Service based web stores. Inspired from [37],
D. Disclosures                                                          Pellegrino et al. [32] proposed the idea of black-box detec-
    Pinterest acknowledged our report about the redirect uri            tion of logical vulnerabilities in e-shopping applications. The
fixation attack and recently they updated their Facebook SSO            proposed approach creates an abstract model of the application
implementation. The redirect uri fixation attack against all            from the HTTP traffic, identifies the applicability of predefined
SPs integrating the PayPal SSO was due to the deviation                 behavioral patterns and generate test cases misusing these
from the OAuth 2.0 standard by PayPal. Even though PayPal               patterns. It is interesting to note that the strategy behind all the
acknowledged our report, we did not win the bug bounty as               exploitable attacks discovered by [32] falls under the category
another security researcher simultaneously reported the attack.         of replay attacks (precisely those covered by our RA2 and
However, none of the details regarding this attack was publicly         RA3 attack patterns). We follow a different complementary
available and we have the screencast of the attack in our               approach by neglecting the application model and directly
website to support our claim. The attack against online shop-           focusing on replay attacks (among others). We reckon that, in
ping websites integrating Stripe checkout was appreciated by            principle, there could be control-flow attacks that [32] could
Stripe and they rewarded us for our findings. LinkedIn updated          detect and we may not (even if there is no experimental
the LinkedIn Developers website after receiving our report              evidence for this). However, it is also true that our attack
about the attack by the browser history attacker. OpenSAP               on Stripe would require not-so-obvious extensions of [32]:
acknowledged our report about the login CSRF attack in the              consider malicious SP as we do and generate online test-cases
account registration process of open.sap.com and fixed the              to deal with short-lived/one-time tokens.
issue. We reported the XSS attacks we discovered against                    Somorovsky et al. [34] conducted an in-depth analysis of
the SPs integrating the LinkedIn SSO to the corresponding               14 different SAML frameworks and developed a framework
vendors. LinkedIn was partially responsible for this attack             for testing the security of SAML implementations. The testing
as it was possible to create a LinkedIn account and provide             framework automatically generated various SAML attack pat-
XSS payload as the value of user information fields (e.g., first        terns by permuting the positions of the original and malicious
name, last name). However, it was the responsibility of SPs             elements in a SAML assertion. In this paper, we do not
to properly filter and encode the user information received             consider the XML signature wrapping attack (XSW in short).
from LinkedIn. After notifying LinkedIn about the issue, we             However, we checked the feasibility of extending our approach
noticed that they enforce restrictions in the usage of HTML             to support XSW attacks (see Section VIII for details).
characters in input fields. Login CSRF is out of scope for                  Bozic et al. [28] proposed attack pattern-based combinato-
Twitter’s vulnerability rewards program [19]. Hence, we did             rial testing for detecting XSS vulnerabilities in web applica-
not win a bounty for our report. However, in Section V.F of             tions. In order to increase the coverage of our attack patterns,
[25], it is mentioned that the authors discovered a standard            we applied the concept of combinatorial testing, as mentioned
form-based login CSRF in the login form of twitter.com (which           in Section III.


                                                                   13
B. Other Black-Box Techniques.                                           the exploitation of logical vulnerabilities in the integrations
    Wang et al. [36] identified many vulnerabilities in the inte-        of CaaS and SSO APIs. However, these techniques requires
gration of web SSO systems. The proposed technique analyzes              changes to be made in the way applications are deployed. Our
the HTTP traffic going through the browser, infers syntax and            approach does not have this requirement as we are focusing
semantics of the traffic parameters, checks the applicability            on detecting the attacks rather than preventing them.
of three different attack strategies and provides an overview
to assist a security expert in manually identifying concrete                    VIII. L IMITATIONS AND FUTURE DIRECTIONS
attacks. In our approach, we adopted their inference concept,                Coverage is a general issue for the black-box security
further enhanced it with data flow patterns and automated the            testing community. Though each of our attack pattern can
process of attack discovery.                                             state precisely what it is testing, our approach is not an
    Prithvi et al. [27] proposes a black-box technique for               exception in this respect. Additionally, it can only detect known
exposing vulnerabilities in the server-side logic of web applica-        types of attacks because our attack patterns are inspired by
tions by identifying various parameter tampering opportunities           known attacks. Creative security experts could craft attack
and by generating test cases corresponding to the identified             patterns capturing novel attack strategies to explore new types
opportunity. However, this technique required manual effort to           of attacks. Two cases can be foreseen here. The new attack
convert these exploit opportunities to actual ones.                      patterns (new recipes) can be built (cooked) on top of the
    Zhou et al. [40] proposed SSOScan, a tool for automat-               available preconditions, actions, and postconditions (ingredi-
ically testing SP websites that implements Facebook SSO.                 ents). In this case it should be pretty straightforward for
SSOScan probes the SP website for detecting the presence of              security experts to cook this new recipe. If new ingredients are
5 vulnerabilities that are specific to Facebook SSO. SSOScan             necessary, extensions are needed. These can range from adding
is useful in conducting large-scale security testing of SPs              a simple operation on top of OWASP ZAP up to extending the
implementing the same SSO solution. Even though our input                inference module with e.g., control-flow related inferences and
collection module requires more manual effort compared to                similar. Another research direction could focus on integrating
that of SSOScan, the concept of application agnostic attack              fuzzing capabilities within some of our attack patterns. A
patterns extends the generality of our approach by enabling              clear drawback is that this extension will likely make the
the testing framework to detect attacks in multiple scenarios            entire approach subject to false positives. A more challenging
(SSO, CaaS, etc.).                                                       research direction could focus on automated generation of
    None of the above mentioned black-box techniques pro-                attack patterns. Though this may look as a Holy Grail quest,
vides experimental evidence of the applicability of the ap-              there may be reasonable paths to explore. For instance, when
proach in multiple MPWA scenarios (CaaS, SSO, etc.) as we                considering replay attacks and the patterns we created for
do.                                                                      them, it is clear that the attack search space we are covering
                                                                         is far from being complete. How many sessions and which
C. Other Techniques.                                                     sessions should be considered in the replay attack strategy as
    Bai et al. proposed AUTHSCAN [24] for automatically                  well as which goal that strategy should target remain open
extracting formal specifications from the implementations of             questions. However, attack patterns could be automatically
authentication protocols and verify it using a model checker             generated to explore this combinatorial search space.
to identify vulnerabilities. AUTHSCAN uses sophisticated                     A few attacks reported in the MPWA literature are not
techniques such as analyzing the available client-side code in           covered by our attack patterns. In fact, Table I does present
order to increase the correctness of the automatically extracted         neither XML rewriting attacks [34] nor XSS attacks, e.g., [22,
formal model. However, the authors mention that due to                   §4]. For XSS we did not invest too much in that direction
the issue of false positives, manual effort was required for             as there are already specialized techniques in literature that
checking inconsistencies between the actual implementation               are both protocol- and domain-agnostic. By adding XML
and the extracted formal model. This requires the tester to              support, new attack patterns can be created to target also XML
be knowledgeable on formal specification. Our approach does              rewriting attacks as in [34]. This can be a straightforward
not have such a strong requirement and its applicability is not          extension of our approach and prototype especially considering
limited to authentication protocols.                                     that OWASP ZAP supports Jython [16]. Basically, all Java
    WebSpi [25] is a library for modeling web applications               libraries can be run within OWASP ZAP so that Java functions
using a variant of the applied pi-calculus. These formal models          performing transformations on the HTTP traffic (e.g., base64,
were verified using the ProVerif tool to discover a variety              XML parsing) can be used in the attack patterns. Our approach
of attacks in the integration of OAuth-based Single Sign-                can also be extended to handle postMessage[3]: frames would
On solutions. The authors of [25] also proposed the idea of              be considered as protocol entities and their interactions as
automatically obtaining the formal specification of applications         communication events. While there are no conceptual issues
written in a subset of PHP and JavaScript. This work also                to perform this extension, there is technical obstacle as, at
emphasized the importance of considering CSRF and open                   the moment, OWASP ZAP provides only partial support to
redirectors while evaluating the security of web-based security          intercept postMessages.
protocols.                                                                   As mentioned in the paper, the approach is not fully
    Sun et al. [29] proposed to detect logical vulnerabilities           automated because it requires the tester to provide the initial
in e-commerce applications through static analysis of the                configurations. The quality of these configurations has a direct
available program code. Even though the level of automation in           impact on the results. For instance if the Flags are not chosen
[29] is higher than our approach, we were able to detect similar         properly, our system may report false positives.
attacks without requiring the source-code of the application.                Still, as shown, the approach is effective and we plan to
    Recently, there have been some efforts [39], [29] to prevent         further refine it to overcome these kinds of issues.

                                                                    14
                     IX. C ONCLUSIONS                                                      [24]   BAI , G., L EI , J., M ENG , G., V ENKATRAMAN , S. S., S AXENA , P.,
    We presented an approach for black-box security testing                                       S UN , J., L IU , Y., AND D ONG , J. S. Authscan: Automatic extraction
of MPWAs. The core of our approach is the concept of                                              of web authentication protocols from implementations. In Proceedings
                                                                                                  of NDSS’13, San Diego, CA, USA (2013).
application-agnostic attack patterns. These attack patterns are
                                                                                           [25]   BANSAL , C., B HARGAVAN , K., AND M AFFEIS , S. Discovering Con-
inspired by the similarities in the attack strategies of the previ-                               crete Attacks on Website Authorization by Formal Analysis. In CSF
ously discovered attacks against MPWAs. The implementation                                        2012 IEEE (June 2012), pp. 247–262.
of our approach is based on OWASP ZAP, a widely-used open-                                 [26]   BARTH , A., JACKSON , C., AND M ITCHELL , J. C. Robust Defenses for
source legacy penetration testing tool. By using our approach,                                    Cross-site Request Forgery. In Proceedings of the 15th ACM Conference
we have been able to identify serious drawbacks in the SSO                                        on Computer and Communications Security (New York, NY, USA,
and CaaS solutions offered by LinkedIn, PayPal and Stripe,                                        2008), CCS ’08, ACM, pp. 75–88.
previously unknown vulnerabilities in a number of websites                                 [27]   B ISHT, P., H INRICHS , T., S KRUPSKY, N., B OBROWICZ , R., AND
                                                                                                  V ENKATAKRISHNAN , V. N. Notamper: Automatic blackbox detection
leveraging the SSO solutions offered by Facebook and In-                                          of parameter tampering opportunities in web applications. In Proceed-
stagram and automatically generate test cases that reproduce                                      ings of the 17th ACM Conference on Computer and Communications
previously known attacks against vulnerable integration of the                                    Security (New York, NY, USA, 2010), CCS ’10, ACM, pp. 607–618.
2Checkout service.                                                                         [28]   B OZIC , J., S IMOS , D. E., AND W OTAWA , F. Attack pattern-based
                                                                                                  combinatorial testing. In Proceedings of the 9th International Workshop
                                                                                                  on Automation of Software Test (New York, NY, USA, 2014), AST
                   ACKNOWLEDGMENT                                                                 2014, ACM, pp. 1–7.
   This work has been partly supported by the EU under grant
                                                                                           [29]   C HEN , E., C HEN , S., Q ADEER , S., AND WANG , R. Securing mul-
317387 SECENTIS (FP7-PEOPLE-2012-ITN).                                                            tiparty online services via certification of symbolic transactions. In
                                                                                                  Proceedings of the IEEE Symposium on Security and Privacy (Oakland)
                                R EFERENCES                                                       (May 2015), IEEE Institute of Electrical and Electronics Engineers.
 [1]   Account hijacking by leaking authorization code.                http://www.         [30]   C ONSORTIUM , O. SAML V2.0 Technical Overview. http://wiki.
       oauthsecurity.com/.                                                                        oasis-open.org/security/Saml2TechOverview, Mar. 2008.
 [2]   Covert Redirect. http://oauth.net/advisories/2014-1-covert-redirect/.               [31]   M AINKA , C., M LADENOV, V., AND S CHWENK , J. Do not trust me:
 [3]   HTML5 Web Messaging.               http://www.w3.org/TR/webmessaging/                      Using malicious idps for analyzing and attacking single sign-on. CoRR
       #posting-messages.                                                                         abs/1412.1623 (2014).
 [4]   Instagram API Console. https://apigee.com/console/instagram.                        [32]   P ELLEGRINO , G., AND BALZAROTTI , D. Toward black-box detection
                                                                                                  of logic flaws in web applications. In NDSS (2014), Internet Society.
 [5]   Integrate Log In with PayPal.          https://developer.paypal.com/docs/
       integration/direct/identity/log-in-with-paypal/.                                    [33]   P HILLIPS , C., AND S WILER , L. P. A graph-based system for network-
                                                                                                  vulnerability analysis. In Proceedings of the 1998 Workshop on New
 [6]   Log In with PayPal demo site.                  https://lipp.ebaystratus.com/               Security Paradigms (NY, USA, 1998), NSPW ’98, ACM, pp. 71–79.
       loginwithpaypal-live/.
                                                                                           [34]   S OMOROVSKY, J., M AYER , A., S CHWENK , J., K AMPMANN , M., AND
 [7]   LogIn to experience INstant. http://instant.linkedinlabs.com/.                             J ENSEN , M. On Breaking SAML: Be Whoever You Want to Be. In
 [8]   The most common oauth2 vulnerability. http://homakov.blogspot.it/                          Presented as part of the 21st USENIX Security Symposium (USENIX
       2012/07/saferweb-most-common-oauth2.html.                                                  Security 12) (Bellevue, WA, 2012), USENIX, pp. 397–412.
 [9]   OAuth      2.0     Playground.              https://developers.google.com/          [35]   S UN , F., X U , L., AND S U , Z. Detecting Logic Vulnerabilities in E-
       oauthplayground/.                                                                          commerce Applications. In NDSS 2014, California, USA, February
[10]   OAuth Security Advisory: 2009.1. http://oauth.net/advisories/2009-1/.                      23-26, 2013 (2014).
[11]   PayPal Express Checkout.          https://www.paypal.com/webapps/mpp/               [36]   WANG , R., C HEN , S., AND WANG , X. Signing me onto your accounts
       referral/paypal-express-checkout.                                                          through facebook and google: A traffic-guided security study of com-
                                                                                                  mercially deployed single-sign-on web services. In Proceedings of the
[12]   PayPal Payments Standard. https://www.paypal.com/webapps/mpp/                              2012 IEEE Symposium on Security and Privacy (Washington, DC, USA,
       paypal-payments-standard.                                                                  2012), SP ’12, IEEE Computer Society, pp. 365–379.
[13]   Selenium WebDriver. http://docs.seleniumhq.org/projects/webdriver/.                 [37]   WANG , R., C HEN , S., WANG , X., AND Q ADEER , S. How to shop
[14]   Stripe Checkout. https://stripe.com/docs/checkout.                                         for free online – security analysis of cashier-as-a-service based web
[15]   Stripe Wiki. http://en.wikipedia.org/wiki/Stripe %28company%29.                            stores. In Proceedings of the 2011 IEEE Symposium on Security
                                                                                                  and Privacy (Washington, DC, USA, 2011), SP ’11, IEEE Computer
[16]   The Jython Project. http://www.jython.org/.                                                Society, pp. 465–480.
[17]   The ZAP Zest Add-on. https://code.google.com/p/zap-extensions/wiki/                 [38]   WANG , R., Z HOU , Y., C HEN , S., Q ADEER , S., E VANS , D., AND
       AddOn Zest.                                                                                G UREVICH , Y. Explicating sdks: Uncovering assumptions underlying
[18]   Token Fixation in PayPal.             http://homakov.blogspot.it/2014/01/                  secure authentication and authorization. In Proceedings of the 22Nd
       token-fixation-in-paypal.html.                                                             USENIX Conference on Security (Berkeley, CA, USA, 2013), SEC’13,
[19]   Vulnerability Reawards Program Rules. https://hackerone.com/twitter.                       USENIX Association, pp. 399–414.
[20]   OAuth 2.0 Threat Model and Security Considerations. https://tools.ietf.             [39]   X ING , L., C HEN , Y., WANG , X., AND C HEN , S. InteGuard: Toward
       org/html/rfc6819#section-4.4.2.2, January 2013.                                            Automatic Protection of Third-Party Web Service Integrations. In NDSS
                                                                                                  (February 2013).
[21]   A KHAWE , D., BARTH , A., L AM , P. E., M ITCHELL , J., AND S ONG , D.
                                                                                           [40]   Z HOU , Y., AND E VANS , D. SSOScan: Automated Testing of Web
       Towards a formal foundation of web security. CSF ’10, IEEE Computer
                                                                                                  Applications for Single Sign-on Vulnerabilities. In Proceedings of the
       Society, pp. 290–304.
                                                                                                  23rd USENIX Conference on Security Symposium (CA, USA, 2014),
[22]   A RMANDO , A., C ARBONE , R., C OMPAGNA , L., C U ÉLLAR , J., P EL -                      SEC’14, USENIX Association, pp. 495–510.
       LEGRINO , G., AND S ORNIOTTI , A. From Multiple Credentials to
       Browser-Based Single Sign-On: Are We More Secure? vol. 354 of IFIP
       Advances in Information and Communication Technology. Springer,
       2011, pp. 68–79.
[23]   A RMANDO , A., C ARBONE , R., C OMPAGNA , L., C U ÉLLAR , J., AND
       T OBARRA , L. Formal Analysis of SAML 2.0 Web Browser Single
       Sign-On: Breaking the SAML-based Single Sign-On for Google Apps.
       In Proc. ACM FMSE (2008), V. Shmatikov, Ed., ACM Press, pp. 1–10.


                                                                                      15
