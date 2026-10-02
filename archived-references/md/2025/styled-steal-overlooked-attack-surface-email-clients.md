---
type: Article
title: "Styled to Steal: The Overlooked Attack Surface in Email Clients"
description: "Injecting standard CSS into an encrypted email lets an attacker read its decrypted text: attacker-crafted font ligatures give the plaintext a content-dependent width, container queries measure that width, and each width loads a distinct remote image. Plaintext comes out character by character with no JavaScript, in Thunderbird and KMail."
resource: "https://doi.org/10.1145/3719027.3765189"
tags: [article, webseclist-reference, css-injection, info-leak, sanitizer-bypass, side-channel, css, email, owasp-a03-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T01:10:30+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://doi.org/10.1145/3719027.3765189"
    title: "Styled to Steal: The Overlooked Attack Surface in Email Clients"
    author: Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz
also_at: []
authors:
  - Leon Trampert
  - Daniel Weber
  - Christian Rossow
  - Michael Schwarz
canonical_url: ""
cited_by:
  - "2025.md:97"
commit: ""
content_sha256: 6a2bf5d53e5e9b9f7045a47722bc5ecede280de1d2d163694206ea175fa89d79
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://doi.org/10.1145/3719027.3765189"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 0a5edb59a6bc8eb947f3dabb03dbebdf31e594aed99ca6844ab355bf48e4c9d3
retrieved_from: "https://doi.org/10.1145/3719027.3765189"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T01:10:30+00:00"
slug: styled-steal-overlooked-attack-surface-email-clients
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Styled to Steal: The Overlooked Attack Surface in Email Clients

**Styled to Steal: The Overlooked Attack Surface in Email Clients** - Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz, Publisher not stated.

- Published: date not stated
- Original: <https://doi.org/10.1145/3719027.3765189>
- Preserved from: https://doi.org/10.1145/3719027.3765189 (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Styled to Steal: The Overlooked Attack Surface in Email Clients

Styled to Steal: The Overlooked Attack Surface in Email Clients
                                    Leon Trampert                                                                       Daniel Weber
                     leon.trampert@cispa.de                                                                    daniel.weber@cispa.de
           CISPA Helmholtz Center for Information Security                                          CISPA Helmholtz Center for Information Security
                      Saarbrücken, Germany                                                                     Saarbrücken, Germany

                                 Christian Rossow                                                                    Michael Schwarz
                        rossow@cispa.de                                                                       michael.schwarz@cispa.de
          CISPA Helmholtz Center for Information Security                                           CISPA Helmholtz Center for Information Security
                     Saarbrücken, Germany                                                                      Saarbrücken, Germany

Abstract                                                                                        CCS Concepts
Email is still a widely used communication medium, particularly                                 • Security and privacy → Web application security; Software
in professional contexts. Standards such as OpenPGP and S/MIME                                  security engineering.
offer encryption while maintaining compatibility with existing in-
frastructure. Within the end-to-end encryption threat model, email                              Keywords
servers are untrusted, which creates opportunities for attackers to                             Email Client; PGP; CSS; Content Exfiltration
inject malicious HTML or CSS into encrypted emails—either live
during email transport, or by re-sending leaked emails.                                         ACM Reference Format:
   In this paper, we show that isolation mechanisms in widely                                   Leon Trampert, Daniel Weber, Christian Rossow, and Michael Schwarz.
                                                                                                2025. Styled to Steal: The Overlooked Attack Surface in Email Clients. In
used email client software remain inadequate. We present a novel
                                                                                                Proceedings of the 2025 ACM SIGSAC Conference on Computer and Commu-
scriptless attack that extracts arbitrary plaintext from encrypted
                                                                                                nications Security (CCS ’25), October 13–17, 2025, Taipei, Taiwan. ACM, New
emails using only CSS without requiring JavaScript. Once the email                              York, NY, USA, 15 pages. https://doi.org/10.1145/3719027.3765189
is opened, three benign-looking CSS features—container queries,
lazy-loaded web fonts, and contextual font ligatures—map each
character of the ciphertext-carried plaintext to a unique network                               1    Introduction
request to the attacker’s server. This attack technique can incre-                              Despite the widespread availability of secure end-to-end encrypted
mentally reconstruct the entire plaintext in a single rendering pass,                           messaging applications, email remains a popular and widely used
with no JavaScript, no visual artifacts, and depending on the config-                           communication medium, especially in professional settings. While
uration, even without any user interaction. The technique differs                               emails are typically transferred over TLS-encrypted connections
considerably from prior work: it achieves complete plaintext re-                                from hop to hop, every email server involved in email delivery
covery without script execution, evades state-of-the-art sanitizers                             sees email contents in plain [13]. As a result, two popular end-to-
such as DOMPurify, and succeeds across multiple browser engines.                                end encryption standards, OpenPGP [3] and S/MIME [49], have
We demonstrate the severity of this threat on Mozilla Thunderbird                               emerged to protect email content. These technologies are fully
and KMail, with end-to-end attacks successfully exfiltrating PGP-                               backward compatible with existing email infrastructure, allowing
encrypted text from an email rendered in the latest version of the                              users to send encrypted emails via any email server. In particular,
respective clients. Furthermore, we show that our technique affects                             inline PGP remains popular, as it allows users to send encrypted
code integrity tools and sanitization techniques reused in software                             emails even when the recipient’s email client does not support PGP
stacks, including Meta’s Code Verify. Our findings led to practical                             natively [42]. This is achieved by embedding the PGP-encrypted
mitigations in Thunderbird, as well as a revision of Meta’s threat                              content directly in the email body.
model to include CSS. These results underline the need for robust                                  Within the threat model of end-to-end encryption, only the
content isolation in email client software and challenge the as-                                sender and recipient, with their respective email clients, are trusted
sumption that existing mitigations fully prevent encrypted content                              parties. Importantly, no involved email server has to be trusted. The
leakage.                                                                                        email can be intercepted and modified by malicious parties, such
                                                                                                as email providers, ISPs, or even state actors. This allows for mali-
                                                                                                cious parties to inject untrusted content into the email body, which
                                                                                                the email client of the recipient then renders. Moreover, leaked
Permission to make digital or hard copies of all or part of this work for personal or
classroom use is granted without fee provided that copies are not made or distributed           encrypted emails can be resent to the original recipient, containing
for profit or commercial advantage and that copies bear this notice and the full citation       the encrypted content with additional injected untrusted content.
on the first page. Copyrights for components of this work owned by others than the              Such untrusted content can include HTML and CSS, which are
author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or
republish, to post on servers or to redistribute to lists, requires prior specific permission   commonly used to format emails. We refer to an email containing
and/or a fee. Request permissions from permissions@acm.org.                                     encrypted content and untrusted parts as a mixed-context email.
CCS ’25, Taipei, Taiwan                                                                            In 2018, the Efail attack [39] demonstrated a direct content-
© 2025 Copyright held by the owner/author(s). Publication rights licensed to ACM.
ACM ISBN 979-8-4007-1525-9/2025/10                                                              exfiltration attack, where specifically crafted HTML injected by an
https://doi.org/10.1145/3719027.3765189                                                         attacker tricks the parser into including the decrypted PGP content
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                               Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


as part of a URL fetched from an attacker-controlled server, leaking           Our attack introduces three critical innovations compared to pre-
the content to the attacker. In response to this attack that affected at    vious variants. First, we introduce a novel mechanism leveraging
least five widely used email clients, including Mozilla Thunderbird         CSS animations and lazy-loading fonts, enabling the incremental
and Apple Mail, the security community has focused on preventing            extraction of arbitrary plaintext content without multiple injections
direct content exfiltration attacks. However, we argue that Efail is        or user interactions, which is not possible with previous CSS-based
merely an instance of a more general class of attacks that exploit          attacks [18, 19, 26, 29, 37]. Second, unlike previous attacks requiring
the lack of isolation between untrusted and trusted content.                browser-specific features [18, 26, 29, 37], our approach relies exclu-
    In this paper, we revisit the attack surface from a “CSS-only”          sively on regular CSS container queries–a recently standardized CSS
angle and answer the following research questions: Have the miti-           feature universally supported by all modern browser engines and
gations against direct content exfiltration attacks fully closed            multiple email clients. Third, we propose an adaptive, server-side
the attack surface for content exfiltration attacks in email                font generation method that dynamically builds ligatures based on
clients? Can we still mount attacks using only HTML and                     previously leaked characters, enabling the practical and efficient ex-
CSS that undermine email encryption in a single rendering                   traction of arbitrary-length text despite inherent font limitations. The
pass, i.e., when simply opening an email?                                   approach differs significantly from prior scriptless techniques: it
    We systematically analyze the current behavior of email clients         needs no script execution, achieves full plaintext recovery instead of
when rendering mixed-context emails. We find that while a direct            only HTML-attribute recovery, works across multiple email clients,
content-exfiltration attack, as in Efail, is no longer possible, at least   and can even evade popular sanitizers such as DOMPurify because
three widely used PGP-enabled email clients (Mozilla Thunder-               the injected CSS is fully standard-compliant.
bird, KMail, and Apple Mail with the GPGSuite plugin) still allow              To demonstrate the security implications and severity of our
untrusted stylesheets to be applied to PGP-encrypted content, show-         attack, we conduct end-to-end attacks to fully recover the content
ing a lack of isolation. Control over stylesheets is often ignored          of end-to-end encrypted emails. The victim only needs to open
or regarded as low-severity issues [40, 41], with existing scriptless       a single email, from which we can reliably extract the decrypted
(CSS-based) attacks being tailored to the web (i.e., browser) setting.      content at a rate of 2 B/s for arbitrary text and instantly for text
Existing attacks primarily focus on leaking HTML attributes, such           in a known format (e.g., credit card numbers). The attack is fully
as anti-CSRF tokens or the values of input fields [17, 21], but not         stealthy, running in the background without any visual clue for the
text. While there are some attacks that are capable of leaking text         victim. Even worse, the attack is applicable to an email client that
to some extent, they do not apply to the email context. Existing            was previously unaffected by Efail’s direct exfiltration attack. This
approaches typically rely on repeated interactions, scrollbars, or          highlights that the mitigations against direct content-exfiltration
browser-specific features, making them unsuitable for universally           attacks are insufficient to prevent all types of content exfiltration.
applicable real-world scenarios, such as email client exploitation.            While not our primary focus, our technique also affects state-
    Thus, to answer the second research question, we introduce a            of-the-art defenses against malicious content exfiltration in web
novel scriptless attack using only CSS. Our proposed attack allows          applications. First, the recent academic proposals [14] and indus-
an attacker to exfiltrate arbitrary text from an encrypted email            try implementations [27] regarding the concept of Accountable
via the following four steps. (1) The attacker crafts a message con-        JavaScript aim to vet JavaScript code. While initially targeting only
taining the encrypted text for the recipient, combined with HTML            JavaScript, Meta acknowledged the security impact of our attacks
and CSS. (2) Upon opening, the client renders the payload, i.e., de-        and extended their Code Verify browser extension [27, 28] to verify
crypts the ciphertext and applies the attacker-provided stylesheet.         the integrity of JavaScript and CSS. Thus, our attack shows an over-
(3) Three standard CSS features—container queries, lazy-loaded web          sight in the threat model of these defenses in that they focus only
fonts, and contextual ligatures—encode each plaintext character to          on JavaScript and not CSS, undermining the security guarantees.
a unique request for a remote image to the attacker server. (4) The            Second, HTML sanitizers aim to filter untrusted user input before
loading of remote images incrementally leaks the entire plaintext           inserting it into the DOM [20]. For example, the popular DOMPu-
during a single rendering pass. The technique neither shows visual          rify [20] sanitization library can be used to prevent DOM-based XSS.
artifacts nor triggers warnings, yet recovers arbitrary text.               Such HTML sanitization libraries do not protect against scriptless
    At the core, we apply fonts with specifically crafted ligatures to      attacks in their default configuration, allowing attackers to leak
the targeted text inspired by attacks against browsers [26, 29, 37].        web content. As such, the attack is highly relevant to sites that may
If the defined ligature matches the content of the targeted text, it        not be susceptible to XSS but still allow style injection. This can be
applies a unique width to the text, which we can measure purely in          due to sanitization or a strict script-restricting CSP.
CSS. This still poses the major challenge of how to leak arbitrary             Finally, to defend against our attacks, we discuss concrete miti-
content in a single shot. To tackle this challenge, we leverage CSS         gation strategies. For emails, we suggest restricting remote content
animations to repeatedly apply fonts with different ligatures with-         and strict content isolation between trusted and untrusted content.
out having to reload the content or open the email multiple times.          We advocate for stricter default configurations in sanitization li-
Consequently, we can recover arbitrary text character-by-character          braries. However, we fear that this only happens when there is
and exfiltrate it via character-dependent remote-resource loading.          sufficient awareness of the severity of these novel types of attacks.
By relying on lazy font loading, we can dynamically craft fonts                To summarize, we make the following contributions:
with the required ligatures based on the already extracted text parts.          (1) We systematically analyze the current behavior of email
Thus, we do not require large fonts, allowing us to stay within the                 clients when rendering mixed-context emails.
practical limits of fonts.
Styled to Steal: The Overlooked Attack Surface in Email Clients                                          CCS ’25, October 13–17, 2025, Taipei, Taiwan


    (2) We present a CSS-based scriptless attack that fully recovers     content, such as text and attachments, it uses the multipart MIME
        arbitrary plaintext from encrypted emails, not just HTML         format. This format divides the email into parts, each with its own
        attributes or short tokens.                                      MIME-type header. A common multipart type is multipart/mixed,
    (3) We present end-to-end exploits to recover the content of         which allows for specifying independent parts of different types. A
        PGP-encrypted emails in Mozilla Thunderbird and KMail.           boundary string separates each part of a multipart email.
    (4) We present a proof-of-concept exploit against Meta’s Code
                                                                            PGP in Email. There are two main techniques to include PGP-
        Verify implementation of Accountable JavaScript. Meta con-
                                                                         encrypted content in emails. First, with PGP/Inline [42], the email
        sequently updated their implementation to also verify CSS.
                                                                         body directly contains the PGP-encrypted data. The body is usually
    (5) We showcase that the HTML Sanitizer DOMPurify does not
                                                                         of type text/plain and occasionally text/html. The approach is
        mitigate our scriptless attacks in its default configuration.
                                                                         usually only used to encrypt text and is regularly used with clients
   Outline. Section 2 provides background. In Section 3, we in-
                                                                         that do not natively support PGP, as it allows for easy interoperabil-
troduce the threat model. Section 4 systematically analyzes email
                                                                         ity with plugins. An example of a third-party extension that lever-
clients’ rendering behavior for mixed-context emails. Section 5
                                                                         ages PGP/Inline is the Mailvelope browser extension, which enables
presents an overview of our novel attack. Section 6 discusses its
                                                                         PGP encryption, e.g., on gmail.com. Second, with PGP/MIME [42],
implementation. In Section 7, we present our real-world exploit
                                                                         the email body has the MIME type multipart/encrypted. It con-
on Mozilla Thunderbird. In Section 8, we discuss mitigation ap-
                                                                         tains an entire email body, including, e.g., attachments, and allows
proaches. Section 9 demonstrates the applicability of our scriptless
                                                                         for encrypting arbitrary MIME types. While PGP/MIME is preferred
attack on the web. Finally, we discuss our results in Section 10.
                                                                         over PGP/Inline, it is not universally supported.
   Responsible Disclosure. We disclosed our findings regarding
Thunderbird, KMail, and Apple Mail with the GPGSuite plugin to
                                                                         2.2    Fonts
Mozilla, KDE, and GPGTools & Apple, respectively. Mozilla will
issue a fix for Thunderbird in the next stable release. The vendor       Fonts are crucial for HTML rendering in both email clients and
response from GPGTools indicates that the client is not exploitable.     browsers. Modern font formats, such as TrueType [2] and Open-
Meanwhile, KDE has acknowledged the issue and plans to fix it in         Type [30], utilize outline-based representations to map characters
an upcoming release. Furthermore, we have discussed the gap in the       to visual forms. These formats define each character using mathe-
default configuration of DOMPurify and Firefox’s HTML Sanitizer          matical descriptions of lines and curves, ensuring scalability across
API with the respective maintainers. While they acknowledge the          different sizes and resolutions. Generally, fonts are shipped as files
issue, they do not plan on changing the default configuration. Lastly,   that contain tables that map characters to their visual represen-
Meta has extended the threat model of the Code Verify extension          tation, also known as glyphs. Content providers frequently ship
to account for CSS as a response to our findings.                        custom fonts to ensure a consistent visual appearance of their con-
   Availability. Our artifact is available on GitHub at https://         tent. Notably, web developers may use the @font-face CSS rule to
github.com/cispa/stylemail. Furthermore, it is archived at Zenodo        load custom fonts from a remote server [6].
with the DOI: https://doi.org/10.5281/zenodo.17019769.                      TrueType and OpenType. TrueType is a font format initially de-
                                                                         veloped by Apple and Microsoft in the late 1980s. It is widely used
2     Background                                                         for both screen and print applications. OpenType is a successor of
In this section, we provide the necessary background. We provide         TrueType and PostScript Type 1 font formats [31]. It was introduced
a brief overview of end-to-end encryption in the context of emails.      in 1996 by Microsoft and Adobe Systems and supports advanced
Additionally, introduce the modern font formats TrueType and             typographic features, such as ligatures. TrueType has been partially
OpenType and their relevant features.                                    extended to support OpenType features, such as ligatures. Both
                                                                         formats are widely used on the web and universally supported.
2.1     End-to-end Encrypted Email
                                                                            Font Ligatures. Ligatures map two or more characters to a sin-
While emails are typically transferred over TLS-encrypted connec-        gle glyph [1]. In OpenType, there are different types of ligatures,
tions from hop to hop, every email server involved in email delivery     such as standard, discretionary, and contextual ligatures. The for-
sees email contents in plaintext [13]. In 1991, Phil Zimmerman in-       mer only leverages the preceding characters, while the latter two
vented PGP (Pretty Good Privacy) encryption, later standardized          can be context-dependent with their built-in conditional logic [1].
as OpenPGP by the IETF [3]. It provides cryptographic privacy and        Ligatures are often used to improve the visual appearance of text,
authentication to ensure that email servers (e.g., of the sender’s       such as combining characters that would otherwise overlap or be
or recipient’s email provider) cannot break the confidentiality or       far apart. For example, the characters f and i are represented by a
integrity of emails. Each communication party has a private and          single glyph, fi, which moves their individual representations closer
public key. The public key is used for encryption and signature          together. Ligatures are crucial for many languages, such as Arabic,
validation, and the private key is used for decrypting and signing.      where the shape of a character depends on its position [57].
    Structure. Generally, emails are structured with a header and
body. The body contains the message content, which can be plain          3     Threat Model
text, HTML, or a combination of other types. The type of content         In our threat model, an attacker aims to recover the content of an
is specified in the header using MIME (Multipurpose Internet Mail        encrypted email. We assume the attacker can access such encrypted
Extensions) types [45]. When an email contains multiple types of         emails (e.g., from leaked emails or as a malicious party involved in
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                                       Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz

                                                                                            Email Client
          From: Alice                               From: Alice                          From: Alice
          To: Bob                                   To: Bob                              To: Bob                GET /leak1?c=S
                                     Attacker                              Attacker
                                                    <html>                               <html>
                                 intercepts email   <style>...</style>    sends email    <style>...</style>     GET /leak2?c=E
          –BEGIN PGP MESSAGE–                       –BEGIN PGP MESSAGE–
          ENCRYPTED                                 ENCRYPTED                            SECRET MESSAGE         GET /leak3?c=C
          –END PGP MESSAGE–                         –END PGP MESSAGE–
                                                    </html>                              </html>

(a) Alice encrypts a secret message (b) The attacker adds a malicious (c) Bob opens the email, decrypts (d) Network requests leak the de-
with Bob’s public key.              stylesheet to the email.          and renders the message.          crypted content (see Figure 2).

Figure 1: The end-to-end workflow of our attack. The attacker obtains a PGP-encrypted email. They then add a malicious
stylesheet to the email. Upon opening the email, the victim’s client decrypts and renders the email. The malicious stylesheet
and decrypted content are rendered in the same context, which allows for exfiltrating the content via network requests.


sending or receiving emails). Note that in the first case, the attacker            untrusted content. We systematically analyze PGP-compliant email
does not have control over an email server. Moreover, the attacker                 clients. For each desktop platform, we select the most popular PGP-
knows the intended recipient of the email, i.e., the victim. Without               compliant email client and test the latest version available at the
altering the encrypted block, the attacker wraps the original email                time of writing (cf. Appendix D for a table of tested clients). Each
inside a new HTML email, augments the message with arbitrary                       client is tested on a fresh installation with default settings.
standard-compliant CSS, and sends this composite to the victim.
We assume the victim opens the attacker’s email at least once, for
the email client to decrypt and render the email content. Modern
                                                                                   4.1    Payload Construction and Evaluation
email clients can decrypt and render such content automatically                   To test the susceptibility of an email client, we devise a broad range
when the user opens the message, creating a mixed context in which                of test cases. Most importantly, the email client has to support
trusted plaintext is processed together with untrusted markup.                    PGP encryption, HTML emails, and remote content. We focus on
   Fundamentally, the attacker can only inject CSS and HTML, and                  HTML emails, as they provide the greatest attack surface and have
no JavaScript. The attacker has no code execution on the victim’s                 been shown to be susceptible to a lack of isolation [39]. Further-
system, and does not rely on classic software vulnerabilities [51].               more, not every email client allows the same methods for including
Moreover, the attacker does not exploit any bug in the client but                 stylesheets. For each requirement of the vulnerability, we construct
only relies on the lack of isolation between trusted and untrusted                several emails that make use of the respective feature. Feature
content. Our threat model largely follows the one of prior work [39].             support is determined based on the visual rendering of the email.
                                                                                  As an example, to test the support for web fonts, we construct
   Scenario. Figure 1 illustrates the concrete steps for an attack.               emails that include web fonts and some text that is styled using
Alice writes Bob a PGP-encrypted email. An attacker who can ob-                   the web font. We test different inclusion methods, such as inline
tain Alice’s email, e.g., on any involved email server, cannot read               stylesheets, remote stylesheets, and data URLs. In total, we end up
the plaintext but modify the email before delivering it to Bob, and               with 5 test cases for this feature. Each test case is then sent to each
thus inject a malicious stylesheet into the email. Bob receives and               email client, where the email is opened manually and the visual
opens the email, which is then rendered by his email client (e.g.,                rendering is inspected. For testing the support of remote content,
Mozilla Thunderbird). The email client decrypts the PGP-encrypted                 we use remote images that are loaded via the <img> tag and the
message and renders it in the same context, i.e., document, as the                background-image CSS property.
malicious stylesheet. Depending on the email client and Bob’s set-                   First, we test for the support of inline stylesheets defined via
tings, this step may require Bob to press a button to decrypt the                 <style>. We test the <link> tag with an https:// remote URL
message. The attacker-controlled stylesheet is now applied to the                 and a data URL in case remote content is treated differently. While
decrypted content and can make network requests that depend on                    the <base> tag cannot be used directly to include stylesheets, it can
the decrypted content. The attacker receives those requests on their              be used to redirect relative URLs of existing stylesheet inclusions
web server and can thereby infer the decrypted content. There is                  to an attacker-controlled server. Furthermore, prior research has
no visual indication for Bob that the decrypted content is leaked,                shown that CSS feature availability is inconsistent across email
and the stylesheet can present decoy content, making it indistin-                 clients [55]. We test the support of top-level stylesheets and the
guishable from a regular email. The content of the stylesheet that                availability of at-rules, such as @font-face and @container since
actually leaks the decrypted content is presented in Section 5.                   they indicate a broader support for CSS features that can be used
   Note that the attacker does not have to control the email server               for attacks. To test a CSS feature, we construct an HTML email
but can also leverage emails that have been obtained by other means               that uses the feature for each inclusion method. We also examine
(e.g., data leaks) and resend them to the victim.                                 recursive imports via the @import directive [55]. Each email is then
                                                                                  opened using the tested client. Feature support is determined based
4    Systematic Investigation of Email Clients                                    on the visual rendering of the email.
In this section, we present a framework for testing the susceptibility               In the context of end-to-end encrypted emails, a mixed context
of email clients to a lack of isolation between the decrypted and                 refers to a scenario where encrypted and unencrypted content are
Styled to Steal: The Overlooked Attack Surface in Email Clients                                                      CCS ’25, October 13–17, 2025, Taipei, Taiwan


present within the same email thread. It enables the exfiltration of                 <body>
                                                                                      <table class="moz-header-part1 moz-main-header">
the decrypted content using our scriptless attack. To test susceptibil-                   <tbody>...</tbody>
ity, our framework leverages three PGP setups for detecting a mixed                   </table>
context, two targeting PGP/Inline and one PGP/MIME. The first                          <link rel="stylesheet" href="data:text/css;base64,..">
setup directly features a body of the MIME type text/html that                        <div class="moz-text-html"><pre>DECRYPTED MESSAGE</pre></div>
contains PGP-encrypted content. The second setup uses Content-                       </body>

Type: multipart/mixed and contains two separate parts. One
part is again HTML, while the other is plaintext (i.e., MIME type                   Listing 1: A simplified version of the DOM rendered by
text/plain) and contains the PGP-encrypted content. This setup                      Thunderbird after decrypting PGP/Inline. The untrusted
is designed to target clients that block PGP/Inline in HTML, but do                 stylesheet that enables our attack is highlighted in red.
not account for multipart emails. The last setup targets PGP/MIME
and uses Content-Type: multipart/mixed. One part is HTML,
while the other uses Content-Type: multipart/encrypted with
                                                                                    4.3    Vulnerability Analysis
the protocol set to application/pgp-encrypted. Our test cases
ignore the possibility of malicious HTML in the encrypted MIME                         In the following, we analyze the lack of isolation with Mozilla
structure, as the threat model would require a user to embed third-                 Thunderbird as an example. Note that the same issue also applies to
party stylesheets into their email. A mixed context is determined                   the other affected email clients. We discover that Mozilla Thunder-
based on the visual rendering of the decrypted email using a custom                 bird does not correctly isolate encrypted inline PGP contexts. An
stylesheet that applies text-altering properties to all elements using              HTML email with encrypted inline PGP is first rendered without
the CSS universal selector (i.e., *). In total, we define 5 properties              performing the decryption. If the user does not have automatic
that alter the visual appearance of the text drastically, where each                decryption enabled, they are presented with a button for the de-
is defined using the !important keyword. This ensures precedence                    cryption. After decryption, all HTML elements are removed from
over styles defined by the client. We leverage one test for each                    the existing DOM, and instead, the decrypted content is inserted.
combination of inclusion method and setup. Our test corpus is com-                  Due to reusing the same DOM, stylesheets persist and are applied
prised of 31 distinct test cases spanning 6 popular clients, resulting              to decrypted content. Listing 1 shows a simplified version of the
in 186 test cases. Appendix D provides more details.                                resulting DOM structure. As such, Efail’s original direct exfiltration
                                                                                    attack is completely mitigated. However, the untrusted stylesheet
4.2     Findings                                                                    still remains within the same context as the decrypted content.
                                                                                    In essence, this setup is similar to the one of a traditional CSS
The results of the email client study are shown in Table 1. Most im-
                                                                                    exfiltration attack in the browser [18].
portantly, Thunderbird, KMail, and Apple Mail, with the GPGSuite
                                                                                       Limitations of Existing CSS Exfiltration Attacks. CSS exfil-
plugin, allow a mixed context in which untrusted stylesheets can
                                                                                    tration attacks are a well-known class of attacks that leverage CSS
be applied to decrypted content. Further, they all support the vast
                                                                                    features to exfiltrate data from the DOM of websites. Prominent ex-
majority of CSS features, including at-rules and remote content.
                                                                                    amples include attacks that leverage attribute selectors to exfiltrate
Interestingly, KMail was not susceptible to Efail [39], showing that
                                                                                    data from HTML attributes. HTML attributes are often used to store
the lack of isolation goes beyond the original attack vector. By
                                                                                    sensitive information, such as API keys or anti-CSRF tokens [40].
default, Thunderbird requires a button press to allow the loading of
                                                                                    In our case, however, as showcased in Listing 1, the targeted data
remote content and a second button press to perform the decryption.
                                                                                    is not stored in HTML attributes but rather in the text content
The same button presses are required by KMail, with the addition
                                                                                    of HTML elements. Here, attack techniques are sparse and often
of a third button press to enable HTML rendering. Note that this
behavior is highly customizable in most clients. Thunderbird, for
example, allows users to grant default permissions globally, per                    Table 1: Results on PGP-compliant email clients. shows
sender or per domain. As discussed in Section 7.1, an attacker can                  that plaintext and untrusted styles are rendered in the same
leverage exceptions to bypass the default remote content policy via                 context.
sender spoofing. Further, blocking remote content is challenging,
as also shown by prior research [39] and our investigations.
   By default, Apple Mail does not require any user interaction                           Type               Client             Plugin          Mixed
to load remote content. However, the plugin aims to prevent the                                                                                 Con-
loading of remote content using the API provided by Apple Mail                                                                                   text
should a message be decrypted in a mixed context. Interestingly,                          Cross-Platform     Thunderbird        -
we still see some remote images in a mixed context, even without
user interaction. The vendor response indicates that this only af-                        Windows            Outlook            gpg4o
fects previously cached remote content, and is thus not considered                                           Outlook            gpg4win
exploitable. Several users have reported issues with remote content
                                                                                          Linux              Evolution          -
not being blocked, at least indicating inconsistent behavior. 1 . This
underlines the challenge of entirely blocking remote resources.                                              KMail              -

1 https://mjtsai.com/blog/2024/06/07/apple-mails-broken-block-all-remote-content/
                                                                                          macOS              Apple Mail         GPGSuite
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                              Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


have limited applicability. As an example, Heiderich et al. [18] pro-        1   @Letters = [a b c d e f ... z];
                                                                             2
posed a technique that is able to exfiltrate text of HTML elements           3   feature clig {
of short length, e.g., four-digit PIN codes, using scrollbar-selector-       4     ignore sub @Letters s' e' a';
based width measurements. Since this technique basically performs            5     sub s' e' a' by width1;
                                                                             6     ignore sub @Letters s' e' b';
a dictionary attack, it cannot be used to exfiltrate arbitrary text.         7     sub s' e' b' by width2;
Furthermore, the scrollbar selector, which is widely used by CSS             8     ...
exfiltration attacks [18, 26, 29, 37], is not universally supported          9   } clig;
across rendering engines. In our case, the selector is, for example,
not supported by the Gecko engine used by Thunderbird.                    Listing 2: An example of contextual ligatures that map char-
                                                                          acter sequences to unique widths. The ignore sub keyword
5     Exfiltrating PGP-encrypted Emails with CSS                          instructs the next substitution to be ignored upon match.
Since both Efail’s direct exfiltration and existing CSS techniques
are not capable of exfiltrating arbitrary text from HTML elements
                                                                          5.1.1 Using Ligatures as a Filter. In the following, we introduce
in email clients, we propose a new technique that demonstrates the
                                                                          our use of ligatures to assign a unique width to different character
feasibility of CSS-based exfiltration attacks in email clients.
                                                                          sequences. A contextual ligature replaces a sequence of glyphs with
    In the following, we provide a high-level overview of our attack
                                                                          a single glyph (e.g., “ffi” instead of “ffi”). Ligatures are implemented
technique. In a nutshell, we recover the text (e.g., email) content
                                                                          through substitution rules defined within an OpenType font’s lay-
of HTML elements using a combination of width measurement
                                                                          out tables. These rules specify which character sequences should
and repeated text rendering with specifically crafted ligatures in
                                                                          be replaced by ligature glyphs based on contextual factors such as
custom fonts. Figure 2 provides an overview of the technique. We
                                                                          neighboring characters or glyph positioning.
first create font ligatures ( 1 ) that uniquely change the dimensions
                                                                             Listing 2 shows the syntax of OpenType used to define contextual
of the rendered text based on its first unknown character (Sec-
                                                                          ligatures. @Letters is defined as the set of glyphs representing
tion 5.1). As such, the width of the text directly encodes the first
                                                                          lowercase ASCII letters. Next, we define ligatures that replace a
unknown character of the text element. An attacker can measure
                                                                          character sequence with some other glyph unless the sequence is
these dimensions for a single ligature ( 2 ), which is then used to
                                                                          preceded by any lowercase ASCII letter. For example, the sequence
load a unique resource from the attacker’s server ( 3 ). The attacker
                                                                          “sea” is replaced with a glyph defined as width1. As the glyph name
thereby learns the respective character (or even several characters)
                                                                          suggests, we define one glyph per character sequence and use
that are represented by the ligature (Section 5.2). Such leakage can
                                                                          unique widths to identify the character sequence.
be repeated arbitrarily often using the lazy loading of fonts com-
                                                                             To assign a unique width to the set of possible prefixes, we first
bined with CSS animations ( 4 ) to recover larger contents fully
                                                                          map all regular characters to glyphs that have zero width. This
deterministically (Section 5.3). In particular, the lazy-loading of our
                                                                          prevents any characters that are not part of the prefix from influ-
custom fonts via the animations allows the incremental construc-
                                                                          encing the width of the text. Next, we create a contextual ligature
tion of a known prefix where leverage the known prefix to target
                                                                          that replaces the corresponding prefix with a glyph with a unique
the next unknown character. This section introduces the general de-
                                                                          width. This is illustrated in Listing 2, where the combined sequence
sign concepts behind the attack. We provide more implementation
                                                                          of the known prefix is “se”, and every possible next character is
details in Section 6.
                                                                          replaced by a glyph with a unique width. This effectively allows us
                                                                          to determine the character that succeeds a known prefix.
5.1     Content-Based Font Dimensions
                                                                          5.1.2 Targeting the First Glyph. To leak the entire text character
We first introduce a font-based technique that maps the textual
                                                                          by character using our technique, we start by targeting the first
content of an element to a unique width that encodes information
                                                                          character of the text. Inherently, though, ligatures do not provide
about the content. To allow an attacker to iteratively leak a text
                                                                          means to target the first glyph of a text. Previous work based on
character by character, we encode a known prefix together with
                                                                          prefix-matching approaches did not address this problem and as-
guesses for the next character. Each guess has a unique width, which
                                                                          sumed a known prefix [26, 29]. We solve this problem by creating a
the attacker can infer, e.g., using container queries (Section 5.2).
                                                                          contextual ligature that targets all glyphs not preceded by another
   When rendering text, characters or symbols are visually repre-
                                                                          glyph. For this, we leverage the ignore sub feature as showcased
sented by glyphs as assigned by the font. The mapping is performed
                                                                          in Listing 2. It allows the definition of exceptions for the following
using lookup tables stored in the font file. The horizontal width of
                                                                          substitution rule. We create an exception if the sequence is preceded
text depends on the advance width of the glyphs the element con-
                                                                          by any other character, i.e., extending @Letters in the example to
tains and, therefore, the font used for rendering. Using an OpenType
                                                                          contain all characters. The next substitution rule can only match
feature called contextual ligatures, we may substitute a sequence of
                                                                          at the start of text. For our purposes, the charset to ASCII. It can,
glyphs with a single glyph. By assigning a unique advance width
                                                                          however, also be extended to Unicode.
to the substitution glyph, we can distinguish character sequences
based on their width, which we can measure, e.g., using CSS con-          5.1.3 Practical Font Limitations. The number of glyphs a font can
tainer queries. The technique requires the loading of a custom font       define, as well as their widths, is bounded by the OpenType stan-
and its use for rendering. This uses the CSS directive @font-face         dard [30]. For OpenType fonts, this limit is implicit due to the
and the property font-family, which are universally supported.            standard’s use of 16-bit unsigned integers. Thus, the maximum
Styled to Steal: The Overlooked Attack Surface in Email Clients                                                          CCS ’25, October 13–17, 2025, Taipei, Taiwan




                                 3 GET /leak1?c=1                                                                                           3 GET /leak2?c=0

                                                                  Attacker constructs Font 2
                             1                       2               with known prefix 1                       1                        2

                          Font 1               width = w2                                                   Font 2                width = w3
                                                                      4 Animation Step
                     sub ^0.* by w1;         <p> 10 </p>                                              sub ^10.* by w3;          <p> 10 </p>
                     sub ^1.* by w2;         <container>                                              sub ^11.* by w4;         <container>
                                                measures                                                                           measures

(a) The attacker creates a custom font with ligatures that assign                (b) The attacker builds Font 2 using the known prefix 1. With the
unique widths (w1, w2) to prefixes starting with the characters 0                 potential next characters 0 and 1, the prefixes 10 and 11 are assigned
and 1, respectively. All non-matching patters are assigned the width              unique widths (w3, w4). This is again measured and leaked to the
0. The width is then measured using container queries. Loading a                  attacker, revealing the second character. The attacker repeats these
unique width-dependent resource now leaks the first character.                    steps until the full secret is extracted.

Figure 2: A high-level overview of our attack technique. The binary string 10 serves as an example secret. We leverage font
ligatures ( 1 ) that assign a unique width to text elements. For clarity, we use regex syntax for the ligatures. The element’s width
is measured using container queries ( 2 ), which leads to the loading of a unique, width-dependent remote resource ( 3 ). Using
CSS animations and lazy font loading ( 4 ), the attacker repeats this process for each character, thus incrementally expanding
the known prefix character by character. The entire process is invisible for the victim.


number of glyphs per font is 65 535 (0xFFFF). The same 16-bit limit               when a website opens several pop-ups. Thus, any realistic attack
also applies to the advance widths of glyphs. Note that advance                   has to work “in a single shot” to reduce the attack prerequisites and
widths are defined relative to each other, so a slight difference in              user interactions. As we show in this section, attackers can use a
advance widths may not be distinguishable in every rendering con-                 single CSS file that dynamically loads fonts to leak content fully.
text. Minimal differences may lead to the same pixel grid alignment,
                                                                                  5.3.1 Multiple Measurements in a Single Stylesheet. Previous work
which prevents distinguishing these glyphs based on their width.
                                                                                  relied on repeated injections (e.g., multiple popup windows) to leak
These two factors limit the amount of information that can be
                                                                                  character sequences [26, 29]. This is not possible for emails unless
exfiltrated with a single font necessitating the use of multiple fonts.
                                                                                  we assume the target user would re-open the email many times.
                                                                                  Instead, our technique can overcome this limitation using CSS ani-
5.2     Measuring and Leaking Widths
                                                                                  mations. By using a custom CSS animation that combines multiple
Glyphs allow the encoding of specific character sequences as liga-                measurements, we can load and apply an unlimited number of liga-
tures with content-specific widths. As a next step, attackers must                tures in a single stylesheet. We define such animations using the
measure and leak the content-dependent sizes. This implicitly leaks               @keyframes directive that includes all different styles of an element
the otherwise secret content now encoded into a single glyph. To                  we want to measure as animation frames. We leverage standard-
this end, attackers follow a two-step process. First, they measure                compliant CSS animations without any user interaction, as ani-
the width of the glyph. Prior work has identified several methods                 mations defined via the @keyframes directive start automatically
that allow such measurements, e.g., via media queries [18, 25] and                upon content rendering. Common email clients (e.g., , Thunderbird
container queries [55]. Based on a specially crafted layout of HTML               and KMail) and browsers do not throttle or block such animations,
elements, rendered content affects container dimensions, which                    ensuring stable leakage across multiple repeated experiments. Each
can be queried in pure CSS. We present more details and discuss                   animation frame loads and applies a new, attacker-controlled re-
implementation alternatives in Section 6.1. Second, attackers must                mote font.2 To this end, we define fonts using @font-face that
learn the measurement results via a feedback channel to recover the               are consumed in order by the animation. We can also control the
implicitly leaked content. Given a child element of a container to                animation’s timing using the CSS property animation-duration.
which we can apply styles, we may leverage width-dependent prop-                  This way, we leverage the lazy-loading behavior of remote fonts ex-
erties and directives that trigger the loading of remote resources.               hibited by user agents. All major browser engines defer the loading
We provide more implementation details in Section 6.2.                            of remote fonts until they are required for rendering. The resulting

5.3     Constructing Incremental Measurements                                     2 For full-text recovery, we have to load remote fonts from an attacker-controlled
                                                                                  source. This allows for keeping state on the attacker-controlled server to dynamically
In many cases, a malicious actor can only provide a single stylesheet             create the custom fonts used for measurements. Fonts loaded from data URLs can also
for the attack, for example, in emails or when users get suspicious               be leveraged to infer relevant information, such as performing a dictionary attack.
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                            Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


primitive thus allows us to iteratively (i) load attacker-controlled      conditional styles inside of container queries can only be applied
custom fonts that, one by one, are applied to the target element          to children of the container. Thus, the container used in the setup
and change ligatures and (ii) measure the widths of the text once         must feature at least one child element. The attacker injects new or
ligatures are applied. So, while each font is still bound by size re-     transforms existing DOM elements into the measurement setup.
strictions (cf. Section 5.1.3), the sequence of fonts—and hence, the
overall number of ligatures we can test in a realistic scenario—is un-       Real-World Measurement Setups. As we have just described, we
limited. Furthermore, the animation allows us to dynamically create       require a measurement setup where a container is adjacent to the
fonts that contain ligatures based on past leaked information. We         target element. Such a setup can be created by transforming an exist-
can thus leverage this technique to load attacker-controlled fonts        ing element into a container and is thus applicable in any real-world
iteratively and thereby incrementally leak the entire text content.       context. As an example, the setup for Thunderbird is described in
                                                                          Section 7.1 (for KMail, see Appendix B). We can always propagate
5.3.2 Incremental Full-Text Leakage. We use the primitive of mul-         the target’s width to its parent by setting the parent’s width to
tiple measurements to incrementally leak the known prefix (and,           fit-content and the display property of any other children to
hence, the text) character by character. Attackers rely on the prefix     none.
obtained by prior measurements. This prefix is then added to the
substitution rules of the following font loaded from the attacker’s          Overwriting Existing Styles. Inherently, CSS injections conflict
server. We use the information obtained by prior measurements as          with stylesheets defined by the victim. CSS rules are applied accord-
a prefix for ligatures, such that we effectively construct a ligature     ing to their specificity [9]. Thus, any properties the victim defines
chain that identifies the text of the target. For example, if the known   must be overridden using more specific selectors or the !impor-
prefix is “Dear Alic”, the attacker can deliver a font with ligatures     tant keyword, which allows a rule to override more specific rules.
for “Dear Alica”, “Dear Alicb“, “Dear Alicc”, and so forth, ultimately    Note that a rule defined using !important can be overridden by
leaking the next character and expanding the prefix.                      another rule with the keyword and greater specificity [9].

                                                                             Alternative Width Measurement Techniques. While width mea-
6     Attack Implementation                                               surements using CSS is not inherently new, our technique stands
In this section, we discuss different width measurement techniques        out because it only requires standardized CSS features, which were
that enable the attack as outlined in Section 5, and how we can           previously considered harmless, thus making it the first method that
relay measurements to a remote server. Furthermore, we discuss            is not only applicable to all major browsers but also to email clients.
contextual improvements to the attack and discuss its limitations.        Prior work [18] has identified two other CSS-based approaches that
                                                                          allow for approximating the width of elements. Those techniques
6.1     Measuring the Width of HTML Elements                              leverage iframes, the ::-webkit-scrollbar:horizontal selector
In this section, we describe how to leverage the CSS-based technique      and media queries. The idea is to fill an iframe with an element
of prior work [55] to measure the width of HTML elements for our          of a fixed width. The width of this element is the threshold above
attack. The technique does not use any non-standardized features          which a request to the server is issued, where the threshold is de-
or subdocuments (e.g., iframes) and is thus the first technique that      termined via media queries or the presence of a scrollbar. Similarly,
can be leveraged in every standard-conforming context. Currently,         Lin et al. [25] used the same technique for CSS-based fingerprint-
the technique has only been used for fingerprinting in an attacker-       ing. In general, both techniques are less flexible than our approach
controlled environment. Thus, we describe how we can apply the            due to their use of iframes. The use of iframes is often restricted,
technique in a context where we do not control the DOM.                   e.g., in email clients [55]. Both techniques require injecting iframes
   At its core, the technique leverages CSS container queries for         adjacent to the target element. This is a much stricter requirement
querying the dimensions of container elements [5]. The setup to           than the setup used by container queries, as container queries allow
measure the width of an element requires three elements: the tar-         for existing elements to be repurposed.
get element, one adjacent element, and a common parent element
(see Figure 2). We transform the element adjacent to the target           6.2    Exfiltrating Measurements
element into a container using container-type: inline-size.               On a high level, we can transform the width of HTML elements
We leverage the adjacency of the elements such that a query of the        into conditional styles. However, the width measurements must be
container dimensions directly translates to the dimensions of the         relayed to a remote attacker-controlled server that performs post-
target element. For this, both elements must share a common parent        processing to recover the textual content. Given a child element of
element called the wrapper. We let the wrapper scale to the width         a container to which we can apply styles, we leverage various prop-
of its content using width: fit-content. We let the container             erties and directives that trigger the loading of remote resources.
scale to the full width of its parent using width: 100%. Now the          For example, we can use the background-image property to load
width of the parent and the container are equal to the width of the       remote images using the url() function.
target element, such that a container query reports the dimensions
of the target element. Using this technique, we can measure the              Encoding. In email clients, each request issued by CSS is usu-
content width of an element by setting the width: fit-content             ally only performed once, and all subsequent uses of a resource
property of the element. Note that we cannot directly transform           are served from a cache. This even applies when cache-control
the target element into a container and measure its width, as the         headers indicate that a resource should not be cached. Since CSS
width of a container is independent of its content. Furthermore, the      does not provide a way to force the reloading of resources, each
Styled to Steal: The Overlooked Attack Surface in Email Clients                                           CCS ’25, October 13–17, 2025, Taipei, Taiwan


   1   @keyframes CustomAnimation {                                          Stealthiness. The attack can be hidden entirely from the user by
   2     0.0% { font-family: "CustomFontA"; }
   3     50.0% { font-family: "CustomFontB"; }
                                                                          limiting the visibility of the measurement setup. In particular, we
   4   }                                                                  can use the visibility: hidden property to hide the measure-
   5   @font-face {                                                       ment setup entirely. Alternatively, we can set opacity: 0, use fonts
   6     font-family: "CustomFontA"; src: url("/font/next?it=0");
   7   }                                                                  without any visible glyphs, or even color the text the same as the
   8   @font-face {                                                       background. To further conceal the attack, we can introduce decoy
   9     font-family: "CustomFontB"; src: url("/font/next?it=1");         content that mimicks an actual email. This can, for example, be
  10   }
                                                                          achieved using the ::before and ::after pseudo-elements with
                                                                          the content property. This property can be used to define arbitrary
Listing 3: CSS animations can be leveraged to implement                   text that is rendered before or after an element. Ultimately, this
full-text leakage as described in Section 5.3. Each font leaks            allows the attack to be concealed in such a way that it is indis-
a character of the target element such that we can leak two               tinguishable from a regular email. Depending on the email client
characters. The fonts are applied to the element in order                 configuration, the attack requires no user interaction in the best
via the custom animation. The width measurement setup is                  case, and up to three clicks in the worst case, excluding the ini-
omitted for brevity (see Appendix A).                                     tial email opening. Note that these clicks are also required when
                                                                          opening benign emails. There are no popups or other user interface
                                                                          elements that would indicate an attack is in progress.
container query can only be used once to relay a measurement. For            Recursively Loading Stylesheets. In Chromium-based browsers,
this reason, every measurable state must map to a unique set of           the @import rule is non-blocking, which allows the attack to lever-
container queries. Moreover, all measurable states must be mutu-          age the lazy loading of stylesheets instead of only fonts [17]. This
ally exclusive to allow a direct recovery of the text content without     allows the attack to be split across multiple stylesheets or even to
any post-processing. For our purposes, we leverage one query per          circumvent CSPs that do not allow remote fonts.
character at each point in the ligature chain. Assuming we target
the 26 lowercase letters, we require 26 distinct container queries           Restricting the Charset. The charset of the target text may be
multiplied by the number of characters to recover. Thus, the num-         restricted to only lowercase or uppercase characters using the CSS
ber of container queries grows linearly with the length of the text.      directive text-transform. This effectively reduces the number of
Outside of email clients, caching is often not an issue, which allows     characters we have to take into account by 26, which allows for
reusing the same container query multiple times.                          encoding more information in a font or minimizing its size.
                                                                             Leaking Character Pairs. Furthermore, depending on the charset,
   Remote Images. For the exfiltration, we require the ability to
                                                                          we can easily leak character pairs, or even triples, instead of single
load remote content. Our implementation uses the background-
                                                                          characters (see Section 5.1.3). This doubles or triples the leakage
image property. In some scenarios, exfiltration may be prevented
                                                                          rate of the attack technique.
simply by blocking remote content. Examples include a strict CSP
or email clients that prevent the loading of remote resources in
email threads with encrypted messages. Prior research [39] and
                                                                          6.5    Attack Limitations
our investigations (e.g., sender spoofing, cf. Section 7.3), however,     The attack is only limited by the speed at which the client can load
show that blocking remote content is often challenging and may            and apply the custom fonts. As such, the limit is determined by the
constitute an orthogonal problem in email clients.                        client hardware and round-trip time (RTT) to the attacker server.
                                                                          It determines the maximum speed of the animation described in
6.3      Incremental Full-Text Leakage                                    Section 5.3. Thus, we can address this limitation by delaying the
                                                                          start of the animation using animation-delay and increasing its
Listing 3 shows an example implementation of the full-text leakage        overall duration. Any server-side computation time is negligible.
introduced in Section 5.3. We omit the measurement setup and
process. For completeness, the omitted parts are listed in Listing 4 in      CSS Mechanisms Used. The ability to use CSS at-rules is vital
Appendix A. Our example leverages two fonts and is thus capable of        to the attack technique. In particular, we leverage @container,
leaking two characters. Each font contains a set of ligatures similar     @font-face, and @keyframes. For this, we require the ability to
to the example in Listing 2. In our example, each font is applied         inject top-level CSS rules since at-rules may only be used at the top
to the target element for 500 ms due to the animation duration of         level. Top-level rules can be defined via the <link> tag, using the
1 s. The second font, i.e., CustomFontB, is only constructed on the       at-rule @import, or by using inline <style> tags. Note that style
server after the measurement generated by the first font is received.     attributes do not suffice to implement the outlined attack.
Our server implementation is a simple Python script of about 100
lines using fonttools [44] and Flask [43].                                7     Case Study: Breaking Email Encryption in
                                                                                Thunderbird
6.4      Attack Enhancements                                              In this section, we outline the building blocks for our attacks that
In this section, we describe a set of enhancements that allow for         break the confidentiality of end-to-end encrypted emails. As intro-
greater stealthiness and flexibility during the exploitation phase.       duced in Section 4.3, we operate in a scenario where the attacker
They are, however, not required for successful exploitation.              can inject arbitrary top-level CSS into the context of an encrypted
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                             Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


email. For readability, we only focus on Mozilla Thunderbird. It          measurements and loading new fonts, even for slower connections.
merely serves as a case study to demonstrate the feasibility of our       Upon email decryption, the animation is applied to the decrypted
attack technique. However, the attack technique is applicable to all      content, and the leakage process begins. We set the visibility of
email clients that allow the application of untrusted stylesheets to      the content to invisible to ensure that the victim does not see any
decrypted content (cf. Table 1). As analyzed in Section 4.3, this also    visual clue, such as flickering, ensuring a stealthy attack. The first
applies to KMail. The proof-of-concept also works in KMail, but           font of the animation changes the target’s width to identify the first
we omit the details here for brevity. In Appendix B, we discuss the       character. We leak this width to the server to compute the second
attack implementation against KMail, which only requires minor            font, which now uses a ligature with the first character as a prefix
adjustments in the measurement setup.                                     and is lazily loaded in the second frame. This is repeated until all
                                                                          fonts have been loaded, i.e., all decrypted characters are leaked.
7.1     Prerequisites                                                        In our proof-of-concept, for demonstration purposes, we retrieve
In the following, we discuss the availability and requirements of         the first 128 characters of PGP-encrypted content. Note that the
the individual building blocks of the attack.                             exploit described is easily extensible to leak more characters, but the
                                                                          maximum leakage size has to be determined upfront. The leakage
   CSS Features. While Thunderbird does not allow the use of con-         time grows linearly with the leakage size. We thus define 𝑛 = 128
tainer queries in inline stylesheets, stylesheets included via the        custom fonts using the @font-face directive. Each font is loaded
<link> element allow the use of most CSS features. This includes all      from a different URL pointing to the attacker-controlled server. The
features relevant to our attacks: container queries (i.e., @container),   custom animation is applied to the target element, i.e., <pre>. The
animations (i.e., @keyframes) and external fonts (i.e., @font-face).      animation iterates over its 𝑛 frames and applies a new custom font
                                                                          to the target element. To leak the widths, we define 3328 (𝑛 ∗ 26 for
    Remote Content. The loading of remote content is required for ex-
                                                                          “a”-“z”) container queries. Each query identifies one ASCII character
filtration. While Thunderbird aims to generally prevent the loading
                                                                          at a specific position (cf. Section 6.2). Within a query, we load a
of remote content in email threads with encrypted messages, our
                                                                          background image for a child of the container from a URL that
investigation shows this is not the case in a mixed context, enabling
                                                                          identifies the character and position determined by the query. Using
exfiltration. A more detailed discussion is provided in Section 7.3.
                                                                          this information, the server maintains a known prefix, which is
   Width Measurement. To measure the width of the decrypted               incorporated into the ligatures of the following custom font.
content (see Section 6.1), we have to inspect Thunderbird’s DOM              Evaluation. We evaluate the experiment with a remote server
structure of mixed-context emails, as shown in Listing 1. The de-         over 20 repetitions. In each iteration, we generate a random 128-
crypted content is rendered in the <pre> element. We propagate            character secret consisting of lowercase ASCII letters. We success-
the element’s width to its parent by setting the width of the parent      fully leak the entire secret in 64 seconds in every repetition. The
<div> to fit-content. Finally, we leverage the <body> element as          demonstrated leakage rate of approximately 2 B/s is primarily lim-
the wrapper and transform the <table> element into a container.           ited by network round-trip latency and rendering overhead at the
The <table> element is adjacent to the <div> with the width of            client side. Under local network conditions, leakage speed increases
the decrypted content, allowing us to measure the content’s width.        significantly (up to several tens of bytes per second), highlighting
                                                                          the practicality for local adversaries or low-latency attackers.
7.2     End-to-End Content Exfiltration                                   7.2.2 4-digit PIN Recovery. As a second case study, we recover 4-
In the following, we present different end-to-end attacks of de-          digit PIN codes from an encrypted email. Since the 10 000 possible
creasing complexity that allow us to recover the content of a PGP-        combinations are below the limit on the number of glyphs for an
encrypted email in Thunderbird.                                           OpenType font (approximately 65 000), we can fully recover such
                                                                          a PIN with a single font and, thus, without animation. For this,
7.2.1 Full-Text Recovery. First, we perform full-text recovery on en-
                                                                          we create a custom font that contains a ligature for each possible
crypted emails. We combine all techniques as outlined in Section 5
                                                                          PIN. Each ligature replaces the PIN with a different glyph. Each
and Section 6 and proceed as follows.
                                                                          glyph has a unique width such that measuring the container’s width
   We start by simplifying the setup. We apply display: none to
                                                                          reveals the PIN. For the exfiltration, we require one container query
all elements of the DOM that are not involved in the attack. This
                                                                          per possible PIN. PIN recovery has minimal requirements, as the
prevents them from interfering with our measurements that are
                                                                          custom font can be included in the attack email via a data URL.
performed using the setup described in Section 7.1. We apply text-
                                                                          Thus, only the exfiltration requires the loading of remote content. In
transform: lowercase to the <pre> element, which restricts the
                                                                          addition, we only require one font and do not leverage animations.
charset to lowercase ASCII characters such that we do not have to
                                                                          This translates to instantaneous and error-free exfiltration.
distinguish between lower- and uppercase characters.
   Next, we add a custom animation to the <pre> element that              7.2.3 Keyword Detection. As a last case study, we perform keyword
consists of one frame per (estimated) leakage size. As the server         detection with similar requirements to PIN recovery. We define a
dynamically handles font generation and gracefully concludes ex-          set of keywords and check if an email contains at least one of
traction once no further content can be identified, we ensure flexi-      those keywords. For this, we leverage a font where every glyph
bility and robustness in practical exploitation scenarios where we        has a width of zero, except for one glyph, which is the substitute
do not know the exact length of the exfiltrated text. Each frame          for the keywords. Each keyword is encoded into a ligature, which
is active for 500 ms to provide sufficient time for exfiltrating the      replaces the word by our non-zero-width substitute. The HTML
Styled to Steal: The Overlooked Attack Surface in Email Clients                                           CCS ’25, October 13–17, 2025, Taipei, Taiwan


element containing the decrypted text only has a non-zero width if       remote content prevents exfiltration. As discussed in Section 7.3,
it includes at least one keyword. This check only requires a single      this has to be implemented correctly. Instead of blocking remote
container query, allowing instantaneous and error-free exfiltration.     content, clients could unconditionally fetch all remote resources of
Only the exfiltration requires the loading of remote content.            an email and directly include them via data URLs [55]. This way,
                                                                         the attacker does not receive requests from the victim.
7.3     Remote Content Loading                                              Attack Detection. Due to the ability of using external stylesheets,
In this section, we show that remote content blocking only partially     static detection of our attack is infeasible. The loading of such ex-
mitigates the issue and often leads to implementation inconsis-          ternal stylesheets can be deferred until after successful decryption
tencies in practice. Since successful content exfiltration requires      or fingerprinting [55]. However, dynamic attack detection during
the loading of remote content, this section further discusses how        the exfiltration phase is feasible. Here, the email client could mon-
remote content loading can be triggered in email clients. While          itor the loading of remote resources and styles. A high number
many clients allow remote content to be loaded by default, some          of remote resources loaded over time, or the evaluation of a large
clients aim to prevent the loading of remote content entirely or         number of container queries could indicate an ongoing attack.
instead require a user interaction to allow it. Prior research [39]
and our investigations show that blocking remote content is often        9     Applicability to the Web
challenging and may constitute an orthogonal problem in email            In this section, we show that, unsurprisingly, our new scriptless
clients. As an example, Poddebniak et al. [39] showed that simple        attack can also be used on the web. We introduce the threat model
CSS rules that load images via the background-image property             for web attackers (Section 9.1) and demonstrate that our attack
and the url() function could be used to bypass remote content            breaks the security guarantees of Meta’s Code Verify (Section 9.2),
blocking in 11 email clients. In addition, most clients allow users      showing a gap in their threat model. In response to our research,
to add senders to an allowlist, which allows remote content from         Meta has extended the Code Verify threat model to account for
these senders to be loaded by default. We show that remote content       scriptless attacks. Additionally, we show that popular sanitization
blocking can be bypassed by using sender spoofing [22]. Remote           libraries do not account for scriptless attacks (Section 9.3).
content loading can be triggered by sending an email from a al-
lowlisted sender to the target user, even if remote content loading      9.1    Threat Model
is disabled by default. Popular guides actively recommend adding
                                                                         In the web scenario, an attacker aims to recover arbitrary text
senders/domains to allowlists to ensure correct email rendering. Al-
                                                                         content on a website. The attacker exploits a vulnerability in the
though precise empirical statistics of how frequently these settings
                                                                         website that allows stylesheet injection, which is still possible in
are modified are challenging to obtain, the widespread recommen-
                                                                         several settings where script-based attacks are prevented.
dation by popular services strongly indicates practical viability.
Moreover, Thunderbird’s documentation only mentions privacy              9.1.1 XSS Mitigations. Scriptless attacks from an alternative to
implications of loading remote content, not security risks.              XSS [40]. While they are more limited, they can circumvent security
                                                                         measures tailored towards detecting malicious scripts [36].
8     Mitigations for Email Clients
                                                                            HTML Sanitizers. While most HTML sanitization libraries are
In this section, we discuss potential mitigations to the aforemen-       highly customizable, they commonly provide default configura-
tioned vulnerabilities and attacks that go beyond the currently          tions. However, our investigation shows that some libraries do not
deployed spot mitigations against the original Efail attack [39].        account for scriptless attacks in their threat model but only focus
Preventing any of its main requirements is a practical mitigation        on XSS. Both DOMPurify and the HTML Sanitizer API implementa-
for our attack. Email clients can either isolate encrypted message       tion of Firefox do not filter <style> tags, thus allowing scriptless
contents, prevent the mixing of encrypted and plaintext content,         attacks. The same applies to the Trusted Types API, which enforces
or block remote content. Finally, we discuss attack detection.           type safety for DOM manipulation if used with such a library.
   Isolation. Our attack requires the mixing of untrusted and en-           Content Security Policy (CSP). While the sources of images and
crypted content. Hence, a natural mitigation is to limit the inter-      stylesheets can be defined by a CSP, they are often overlooked,
actions between the different content parts. This can either be          especially on sites that deploy policies hardened against XSS. This
achieved at the parser level, or by using traditional sandboxing         is underlined by the findings of prior work [47, 54] that estab-
techniques such as iframes [10]. Alternatively, an email client          lished three main use cases of CSP in the wild: framing control (i.e.,
can disallow the mix of encrypted and unencrypted content en-            frame-ancestors), TLS enforcement (i.e., block-all-mixed-content and
tirely. While this restricts functionality, most non-susceptible email   upgrade-insecure-requests) and script content restriction.
clients choose this approach. Although it is unclear whether this
was implemented in these clients for security reasons, it prevents       9.1.2 Script-restricting Clients. Clients can block scripting entirely [4,
an attacker from applying styles to the encrypted content.               32] or restrict access to certain features, e.g., the NoScript exten-
                                                                         sion [16]. Additionally, Accountable JavaScript, the concept of audit-
   Blocking Remote Content. While the ability to apply styles to an      ing client-side code before execution, is increasingly gaining impor-
encrypted message is sufficient to undermine its integrity [33], it      tance in academic research [14] and industry practices [27]. Client-
is not necessarily enough to exfiltrate the content, which requires      side secrets could be exfiltrated by delivering malicious JavaScript
the ability to load remote resources. Thus, blocking the loading of      at any time due to the ephemeral nature of web applications. The
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                            Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


Meta Code Verify extension shows a user if the page’s scripts do          the default configuration of DOMPurify to prevent XSS attacks. We
not match the expected scripts [27, 28]. This can, e.g., indicate a       use DOMPurify as instructed by the official documentation of the
compromised server. We argue that not considering CSS is a flaw           project. As our study shows, DOMPurify does not remove <style>
in Meta’s threat model, as it undermines all security guarantees.         tags from the input. This enables all building blocks for our attack
Our technique that allows for fully recovering text using only CSS        technique. In our scenario, an attacker wants to leak a secret placed
goes unnoticed and bypasses the extension’s security guarantees.          in a <p> tag. For a successful attack, we must first identify a part
                                                                          of the DOM that matches the layout described in Section 6.1. In
9.2     Case Study: Code Verify                                           general, we only need two adjacent elements where the container
In this section, we show how our scriptless attack bypasses the pro-      element has some child element. We provide a more sophisticated
tection of the Meta Code Verify extension. Although Meta’s Code           real-world example in Section 7. The script of the site takes attacker-
Verify extension currently serves a niche community, its explicit         controlled input, sanitizes it using DOMPurify, and adds it to the
threat model oversight–auditing JavaScript but ignoring CSS–is            DOM. By default, DOMPurify aims to mitigate all script injections,
indicative of a broader, systematic gap in modern web security au-        such as <script> tags or event listeners. Thus, the application is
dits. Our CSS-based attack clearly demonstrates the inadequacy of         not susceptible to XSS but still provides means to dynamically add
JavaScript-only audits in protecting end-to-end encrypted content,        HTML to the DOM. While a malicious actor can only insert benign
also acknowledged by Meta and thus fixed in the current version.          HTML tags, this includes <style> tags that can add arbitrary styles
                                                                          to any element of the DOM. The actual exploitation is analogous
   Extension Design. The Code Verify extension provides a trans-          to Thunderbird, as described in Section 7.2.1. An evaluation with a
parent audit of the client-side code of a web application [27]. It        remote server over 20 repetitions successfully recovers the secret
verifies the integrity of the code served to the end user. This enables   (𝑛 = 128) in Chromium, Firefox, and Safari.
the detection of parties that modify, add, or remove scripts that
                                                                             Other HTML Sanitizers. We analyzed the top 10 most popular
could exfiltrate client-side secrets. An example of such secrets is
                                                                          HTML sanitizers on GitHub. Popularity is determined by the num-
end-to-end encrypted messages in WhatsApp Web. As such, the
                                                                          ber of GitHub stars since prior research has shown that the metric
threat model accounts for browser extensions that inject their code
                                                                          correlates with deployment metrics in the wild [24]. The selection
and a malicious server that serves code different from the regu-
                                                                          of libraries is shown in Table 2 in Appendix C. Firefox’s implemen-
lar operation. Meta has released a high-level description of their
                                                                          tation of the HTML Sanitizer API allows both <style> tags and
implementation of Accountable JavaScript [27]. Furthermore, the
                                                                          even the inclusion of remote stylesheets via the <link> element.
actual implementation as a browser extension is open-source and
                                                                          We find that DOMPurify and Firefox do not mitigate our attack in
available for Chrome, Firefox, and Safari [28]. Code Verify expands
                                                                          their default configuration. This is likely due to the fact that both
on the concept of subresource integrity [12], a browser security
                                                                          libraries are primarily designed to prevent XSS attacks. The main-
feature that detects manipulation of resources. The extension calcu-
                                                                          tainers acknowledged our attack and confirmed that CSS injections
lates cryptographic hashes for all scripts of the site. These hashes
                                                                          are not part of their default threat model.
are compared against the expected fingerprint of the code a trusted
third party maintains. In the case of Meta, the trusted third party
is Cloudflare. The site must deploy a CSP that prevents the use
                                                                          9.4    Mitigations
of inline scripts and eval functions and also restricts the possible      CSS injection vulnerabilities are inherently related to XSS. Thus,
sources of Web Workers. If the hashes do not match or the site has        many existing solutions for mitigating XSS vulnerabilities also ap-
no restrictive CSP, the user is notified.                                 ply here. However, as showcased by our study of HTML sanitization
                                                                          libraries, not all solutions may account for CSS injections by default.
   Scenario. As a proof of concept, we add our own site to the list
of sites on which the extension can operate and add a script that            Sanitization. Naturally, the first step in preventing the injection
starts the audit on our site. This script is analogous to the one         of malicious code is using appropriate sanitization mechanisms [20].
used on instagram.com, except that the user does not have to be           However, current practices are biased towards JavaScript, often
authenticated. We replace the trusted third party with a custom           ignoring stylesheets that enable scriptless attacks. While all in-
domain since there is currently no way of registering an application      vestigated HTML sanitization libraries provide means to remove
with Cloudflare for audits. We perform an audit of a site that has no     stylesheets from untrusted input, not all of them do so in their
scripts and deploys a sufficiently restrictive CSP. The site contains     default configuration. Thus, developers must expand on the default
a secret, similar to the scenario in Section 9.3. When deploying          configurations to account for scriptless attacks.
stylesheets on the site that are not present during the initial audit,       Isolation. If feature-rich stylesheets are supposed to be controlled
a user is still shown that the site matches the expectations of the       by users or third parties, they can be isolated using different meth-
trusted third party. We verify this by recovering the secret from         ods. First, user-controlled stylesheets can be isolated by leveraging
the site using our scriptless attack. The user is presented with a        subdocuments (e.g., iframes) [10]. Second, namespacing is a tech-
message that the audit was successful.                                    nique usually employed to avoid conflicts between stylesheets [11,
                                                                          46], where identifiers are prefixed such that they do not collide with
9.3     Case Study: DOMPurify Bypass                                      those of existing stylesheets [46]. Further, at-rules and selectors
In this section, we outline an end-to-end attack that allows for re-      may only be used in top-level stylesheets [6, 8], such that only
covering the secret from an example web application that leverages        allowing style attributes prevents most known scriptless attacks.
Styled to Steal: The Overlooked Attack Surface in Email Clients                                            CCS ’25, October 13–17, 2025, Taipei, Taiwan


   Content Security Policy. As a second line of defense, websites can     the technique by Heiderich et al. [18, 19] with repeated injections.
deploy a CSP [56]. A CSP defines an allowlist of resources a user         The method maintains a prefix of known text as a ligature between
agent can load for a site. A policy with the directives default-src       injections. However, the requirement for repeated injections and
or style-src can restrict the loading stylesheets. A policy that          the dependency on non-standard features makes the attack inappli-
prevents the loading of remote resources also prevents exfiltration.      cable to many real-world scenarios, such as attacks on email clients.
                                                                          Using the unicode-range property, fonts can be loaded on demand
10     Related Work                                                       if a character matching that range is present in the text [23]. This
In this section, we discuss prior work on non-cryptographic attacks       allows for leaking the charset of the text but not the text itself. In
on email encryption and scriptless attacks on the web.                    particular, the technique does not preserve the order of the charac-
                                                                          ters or their frequency. Another technique detected the presence
                                                                          of text via the Chrome feature “Scroll to Text Fragment”, which
10.1      Non-cryptographic Attacks on Emails
                                                                          enables automatic scrolling to and highlighting of text defined in
Prior research on OpenPGP- and S/MIME-compliant email clients             the URL fragment [38, 48]. The presence of text can be determined
investigated the exfiltration of encrypted content [35, 39] and the       by applying styles to the highlight effect. The feature does, however,
misrepresentation of signed content [33]. Poddebniak et al. [39]          not provide regex-like functionality, making it infeasible to recover
found that various email clients do not isolate multiple MIME parts       arbitrary text. In addition, the feature requires the user to interact
of an email but instead render them in the same HTML document.            with the page [48]. Scriptless attacks have also been used to per-
Their attack, “Efail”, leveraged that an encrypted message wrapped        form privacy-infringing attacks from the field of XS-Leaks [15, 52].
in two adjacent HTML parts would lead to the decrypted content            Shusterman et al. [50] demonstrated microarchitectural attacks via
being treated as part of the same HTML document. This enabled             CSS, and Trampert et al. [53] demonstrated them using fonts.
direct exfiltration of the entire text to an attacker server by placing
the decrypted content in the place of a src attribute of an <img>
tag. Their research additionally highlighted ways of loading remote       11    Conclusion
content without consent. Their work led to several mitigations,           Our paper introduced a novel scriptless attack that extracts com-
from blocking remote content to proper isolation. We show that            plete PGP-encrypted plaintext using only standard-compliant CSS,
there are still shortcomings of existing mitigations in post-Efail        without JavaScript, visual artifacts, or complex user interaction.
clients. In particular, while direct exfiltration as induced by the       We reveal that multiple widely used PGP-enabled email clients fail
parser is mitigated, decrypted content may still be mixed with            to isolate encrypted content from untrusted styles, leaving them
untrusted stylesheets and thus be subject to our attack.                  vulnerable to rendering-based exfiltration. Our attack leverages
   Müller et al. [33] found that several OpenPGP- and S/MIME-             three benign CSS features: container queries, lazy-loaded web fonts,
compliant clients allowed the application of untrusted stylesheets        and contextual font ligatures. It circumvents the limitations of prior
to signed content, thus providing means to spoof signed messages.         scriptless attacks, being able to exfiltrate arbitrary text fully, and is
In addition, they showed how users could be tricked into signing          universally applicable to all modern rendering engines. In Mozilla
responses to emails where the content was misrepresented using            Thunderbird and KMail, we demonstrated the effectiveness of our
stylesheets [34]. Furthermore, Müller et al. [35] showcased critical      attack by presenting end-to-end proof-of-concept exploits for recov-
flaws in the implementation of OpenPGP- and S/MIME-compliant              ering the plaintext of PGP-encrypted emails. With an investigation
email clients that allowed the remote deployment of keys to a             of the most prominent HTML sanitization libraries and Meta’s
communciation partner or the exfiltration of a communication              Code Verify auditing mechanism, we showed that current security
partner’s key. They additionally showed that some email clients           practices are biased towards JavaScript and ignore the increasing
could be tricked into signing or decrypting arbitrary messages to         capabilities of HTML and CSS, as demonstrated by our attack. In
the drafts folder of the victim’s IMAP server via malicious mailto        particular, we showed that the default configurations of popular
links combined with auto save.                                            HTML sanitization libraries do not account for scriptless attacks, al-
                                                                          lowing attackers to exfiltrate arbitrary text using our technique. Our
10.2      Scriptless Attacks on the Web                                   work highlights the underestimated potency of scriptless attacks
Existing “Blind CSS Exfiltration” [17, 18, 21] can exfiltrate the value   and the resulting need for broader mitigation awareness.
of HTML attributes using attribute selectors but not an element’s
content. Heiderich et al. [18, 19] introduced a scriptless attack to
detect the occurrence of a set of words but not for generic text          Acknowledgments
recovery. They leverage iframe-based width measurements com-              We want to thank our anonymous reviewers for their comments
bined with ligatures to perform dictionary attacks. However, the          and suggestions. This work has been supported by the Deutsche
techniques are not widely available since, e.g., iframes are generally    Forschungsgemeinschaft (DFG, German Research Foundation) -
unavailable in email clients [55]. Similarly, scrollbar selectors are     491039149. This work was also partly supported by the Semiconduc-
only available in WebKit-based user agents, such as Chromium or           tor Research Corporation (SRC) Hardware Security Program (HWS).
Safari [7, 58]. Crucially, the described techniques cannot be lever-      We also want to thank Lukas Gerlach and Simon Schwarz for help-
aged to recover arbitrary content due to the limits on the number         ing with some experiments and Ben Stock for his valuable feedback
of ligatures that hinder dictionary attacks. Building on this, Ben-       on the paper. We further thank the Saarbrücken Graduate School
tkowski [26, 29] published a method to exfiltrate arbitrary text using    of Computer Science for their funding and support.
CCS ’25, October 13–17, 2025, Taipei, Taiwan                                                                 Leon Trampert, Daniel Weber, Christian Rossow, Michael Schwarz


References                                                                                  [35] Jens Müller, Marcus Brinkmann, Damian Poddebniak, Sebastian Schinzel, and
 [1] Adobe. 2024. Syntax for OpenType features in CSS. https://helpx.adobe.com/                  Jörg Schwenk. 2020. Mailto: Me your secrets. on bugs and features in email end-
     fonts/using/open-type-syntax.html Retrieved 2024-04-24.                                     to-end encryption. In IEEE Conference on Communications and Network Security
 [2] Apple. 2024. TrueType Reference Manual. https://developer.apple.com/fonts/                  (CNS).
     TrueType-Reference-Manual/ Retrieved 2024-04-24.                                       [36] OWASP. 2024. XSS Filter Evasion Cheat Sheet. https://cheatsheetseries.owasp.
 [3] Derek Atkins, William Stallings, and Philip Zimmermann. 1996. RFC1991: PGP                  org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
     message exchange formats. https://datatracker.ietf.org/doc/html/rfc1991                [37] Pepe Vila. 2024. Charset Leakage Demo. https://demo.vwzq.net/css2.html
 [4] Chrome for Developers. 2019. Disable JavaScript. https://developer.chrome.             [38] Maciej Piechota. 2022. New technique of stealing data using CSS and Scroll-
     com/docs/devtools/javascript/disable                                                        to-Text Fragment feature. https://www.secforce.com/blog/new-technique-of-
 [5] World Wide Web Consortium. 2022. CSS Containment Module Level 3. https:                     stealing-data-using-css-and-scroll-to-text-fragment-feature/
     //www.w3.org/TR/css-contain-3/                                                         [39] Damian Poddebniak, Christian Dresen, Jens Müller, Fabian Ising, Sebastian
 [6] MDN Web Docs. 2023. CSS at-rules. https://developer.mozilla.org/en-US/docs/                 Schinzel, Simon Friedberger, Juraj Somorovsky, and Jörg Schwenk. 2018. Efail:
     Web/CSS/At-rule                                                                             Breaking S/MIME and OpenPGP Email Encryption using Exfiltration Channels.
 [7] MDN Web Docs. 2024. ::-webkit-scrollbar. https://developer.mozilla.org/en-                  In USENIX Security.
     US/docs/Web/CSS/::-webkit-scrollbar                                                    [40] PortSwigger. 2024. CSS injection (reflected). https://portswigger.net/kb/issues/
 [8] MDN Web Docs. 2024. CSS selectors. https://developer.mozilla.org/en-US/docs/                00501300_css-injection-reflected
     Web/CSS/CSS_selectors                                                                  [41] PortSwigger. 2024. Path-relative style sheet import. https://portswigger.net/kb/
 [9] MDN Web Docs. 2024. CSS specificity. https://developer.mozilla.org/en-US/                   issues/00200328_path-relative-style-sheet-import
     docs/Web/CSS/Specificity                                                               [42] Proton. 2024. What are PGP/MIME and PGP/Inline? https://proton.me/support/
[10] MDN Web Docs. 2024. <iframe>: The Inline Frame element. https://developer.                  pgp-mime-pgp-inline
     mozilla.org/en-US/docs/Web/HTML/Element/iframe                                         [43] Python Package Index (pypi). 2024. Flask. https://pypi.org/project/Flask/
[11] MDN Web Docs. 2024. Namespace. https://developer.mozilla.org/en-US/docs/               [44] Python Package Index (pypi). 2024. fonttools. https://pypi.org/project/fonttools/
     Glossary/Namespace                                                                     [45] Pete Resnick. 2008. RFC5322: Internet Message Format. https://datatracker.ietf.
[12] MDN Web Docs. 2025. Subresource Integrity. https://developer.mozilla.org/en-                org/doc/html/rfc5322
     US/docs/Web/Security/Subresource_Integrity                                             [46] Harry Roberts. 2015. More Transparent UI Code with Namespaces. https:
[13] Electronic Frontier Foundation (EFF). 2018. Announcing STARTTLS Everywhere:                 //csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/
     Securing Hop-to-Hop Email Delivery. https://www.eff.org/deeplinks/2018/06/             [47] Sebastian Roth, Timothy Barron, Stefano Calzavara, Nick Nikiforakis, and Ben
     announcing-starttls-everywhere-securing-hop-hop-email-delivery                              Stock. 2020. Complex security policy? a longitudinal analysis of deployed content
[14] Ilkan Esiyok, Pascal Berrang, Katriel Cohn-Gordon, and Robert Künnemann.                    security policies. In NDSS.
     2023. Accountable Javascript Code Delivery. In NDSS.                                   [48] Matthew Savage. 2020. PlaidCTF 2020: Catalog Writeup. https://dttw.tech/posts/
[15] Nethanel Gelernter and Amir Herzberg. 2015. Cross-Site Search Attacks. In CCS.              B19RXWzYL
[16] Giorgio Maone. 2017. NoScript - JavaScript/Java/Flash blocker for a safer Firefox      [49] Jim Schaad, Blake C. Ramsdell, and Sean Turner. 2019. RFC8551: Secure/Multi-
     experience! https://noscript.net                                                            purpose Internet Mail Extensions (S/MIME) Version 4.0 Message Specification.
[17] HackTricks. 2024. CSS Injection. https://book.hacktricks.xyz/pentesting-web/xs-             https://datatracker.ietf.org/doc/html/rfc8551
     search/css-injection                                                                   [50] Anatoly Shusterman, Ayush Agarwal, Sioli O’Connell, Daniel Genkin, Yossi Oren,
[18] Mario Heiderich, Marcus Niemietz, Felix Schuster, Thorsten Holz, and Jörg                   and Yuval Yarom. 2021. Prime+Probe 1, JavaScript 0: Overcoming Browser-based
     Schwenk. 2012. Scriptless attacks: stealing the pie without touching the sill.              Side-Channel Defenses. In USENIX Security Symposium.
     In CCS’12.                                                                             [51] Laszlo Szekeres, Mathias Payer, Tao Wei, and Dawn Song. 2013. SoK: Eternal
[19] Mario Heiderich, Marcus Niemietz, Felix Schuster, Thorsten Holz, and Jörg                   War in Memory. In S&P.
     Schwenk. 2014. Scriptless attacks: Stealing more pie without touching the sill.        [52] terjanq. 2023. exploit.js - CTF Challenge Solution using CSS-based XS-Search
     Journal of Computer Security (2014).                                                        Attack. https://gist.github.com/terjanq/33bbb8828839994c848c3b76c1ac67b1
[20] Mario Heiderich, Christopher Späth, and Jörg Schwenk. 2017. Dompurify: Client-         [53] Leon Trampert and Michael Schwarz. 2025. Hidden in Plain Sight: Scriptless
     side protection against xss and markup injection. In ESORICS.                               Microarchitectural Attacks via TrueType Font Hinting. In uASC.
[21] Heyes, Gareth. 2023. Blind CSS Exfiltration: exfiltrate unknown web pages.             [54] Leon Trampert, Ben Stock, and Sebastian Roth. 2023. Honey, I Cached our
     https://portswigger.net/research/blind-css-exfiltration                                     Security Tokens - Re-usage of Security Tokens in the Wild. In RAID.
[22] Hang Hu and Gang Wang. 2018. End-to-End Measurements of Email Spoofing                 [55] Leon Trampert, Daniel Weber, Lukas Gerlach, Christian Rossow, and Michael
     Attacks. In USENIX.                                                                         Schwarz. 2025. Cascading Spy Sheets: Exploiting the Complexity of Modern CSS
[23] huli.tw. 2022. Stealing Data with CSS - CSS Injection (Part 2). https://blog.huli.          for Email and Browser Fingerprinting. In NDSS.
     tw/2022/09/29/en/css-injection-2/                                                      [56] W3C. 2024. Content Security Policy Level 3. https://www.w3.org/TR/CSP3/
[24] Simon Koch, David Klein, and Martin Johns. 2024. The Fault in Our Stars: An            [57] W3C Arabic Script Language Enablement Community. 2024. Arabic and Persian
     Analysis of GitHub Stars as an Importance Metric for Web Source Code. In                    Layout Requirements. https://www.w3.org/TR/alreq/
     Workshop on Measurements, Attacks, and Defenses for the Web (MADWeb).                  [58] W3C CSS Working Group. 2024. CSS Scrollbars Styling Module Level 1. https:
[25] Xu Lin, Frederico Araujo, Teryl Taylor, Jiyong Jang, and Jason Polakis. 2023.               //drafts.csswg.org/css-scrollbars/
     Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers’ Anti-
     Fingerprinting Defenses. In IEEE S&P.
[26] Masato Kinugawa. 2021. Data Exfiltration via CSS + SVG Font. https://mksben.
     l0.cm/2021/11/css-exfiltration-svg-font.html                                           A     Minimal Example: Container Queries
[27] Meta. 2022. Code Verify: An open source browser extension for verifying code           Listing 4 shows the measurement setup that was ommited from the
     authenticity on the web. https://engineering.fb.com/2022/03/10/security/code-
     verify/                                                                                example in Listing 3. It shows the animation that can be leveraged
[28] Meta. 2022. Code Verify on GitHub. https://github.com/facebookincubator/meta-          to leak two characters of unknown text using our technique. If we
     code-verify
[29] Michał Bentkowski. 2017. Stealing Data in Great style - How to Use CSS to Attack
                                                                                            restrict ourselves to the characters “0” and “1”, we only require four
     Web Application. https://research.securitum.com/stealing-data-in-great-style-          container queries to identify the next character of the unknown
     how-to-use-css-to-attack-web-application/                                              text. In the first frame of the animation, we apply a font that either
[30] Microsoft. 2024. OpenType Font Specification. https://learn.microsoft.com/en-
     us/typography/opentype/spec/ Retrieved 2024-04-24.                                     triggers the first or second container query. This information is
[31] Microsoft. 2024. OpenType Overview.            https://learn.microsoft.com/en-us/      transmitted to the server via the loading of the corresponding
     typography/opentype/ Retrieved 2024-04-24.                                             background image and leveraged in the font that is applied in the
[32] Mozilla. 2024. JavaScript settings and preferences for interactive web pages. https:
     //support.mozilla.org/en-US/kb/javascript-settings-for-interactive-web-pages           second frame of the animation. Here, the ligatures of the font are
[33] Jens Müller, Marcus Brinkmann, Damian Poddebniak, Hanno Bock, Sebastian                prefixed with the leaked character. Finally, the font is applied, and
     Schinzel, Juraj Somorovsky, and Jörg Schwenk. 2019. Johnny you are fired!”–
     spoofing OpenPGP and S/MIME signatures in Emails. In USENIX.
                                                                                            the width of the target matches either the third or fourth container
[34] Jens Müller, Marcus Brinkmann, Damian Poddebniak, Sebastian Schinzel, and              query. Note that our queries check for width ranges, since our
     Jörg Schwenk. 2019. Re: What‘s Up Johnny? Covert Content Attacks on Email              investigation has shown that exact floating point width comparison
     End-to-End Encryption. In ACNS .
                                                                                            behaves inconsistently across user agents.
Styled to Steal: The Overlooked Attack Surface in Email Clients                                        CCS ’25, October 13–17, 2025, Taipei, Taiwan


    1    .wrapper { width: fit-content; }                              Table 2: The versions of the HTML sanitization libraries used
    2    #target {                                                     in our study and their usage stats as provided by GitHub.
    3      width: fit-content;
    4      font-size: 160px;
    5    }                                                               Library                            Version        Stars      Used By
    6    .container { container-type: inline-size; }
    7                                                                    DOMPurify                          3.0.11         12,700       292,000
    8    @container (width > 0px) {
    9    * { background-image: url("/leak/0?i=0"); }                     XSS                                1.0.15          5,100           n/a
  10     }                                                               bluemonday                         1.0.26          3,000        12,300
  11     @container (0.4px < width) and (width < 0.8px) {                Bleach                             6.1.0           2,600       306,000
  12     * { background-image: url("/leak/1?i=0"); }
  13     }                                                               sanitize                           6.1.0           2,000        10,000
  14     @container (0.8px < width) and (width < 1.1px) {                HtmlSanitizer                      8.0.843         1,500         3,100
  15     * { background-image: url("/leak/0?i=1"); }                     loofah                             2.22.0            920     1,700,000
  16     }
  17     @container (width > 1.1px) {                                    OWASP Java HTML Sanitizer          20240325.1        813         3,000
  18     * { background-image: url("/leak/1?i=1"); }                     insane                             2.6.2             438         6,300
  19     }                                                               html-sanitizer                     1.5.0             388           n/a
                                                                         HTML Sanitizer API                 124.0.2              -             -
Listing 4: The measurement setup using the technique by
prior work [55], which completes the example in Listing 3.
The charset is restricted to “0” and “1” for illustrative pur-         D      PGP Email Clients
poses, such that we require only four container queries.               Table 3 shows the versions of the PGP-compliant email clients used
                                                                       in our study (Section 4). It additionally shows the versions of the
                                                                       plugins that enable the PGP functionality. All clients of Table 3
B       Case Study: KMail                                              that are not listed in Table 1 are not susceptible to our attack. Note
The attack implementation against KMail is analoguous to the           that we had to exclude some clients listed on openpgp.org due to
one against Thunderbird discussed in Section 7.2.1, except for the     severe functionality issues or unavailability.
measurement setup. We confirmed that the exploit works in KMail
6.0.2 which was the latest version at the time of writing. Listing 5   Table 3: The versions of the PGP-compliant email clients used
shows a simplified part of the DOM used by the KMail client when       in our study featuring their respective PGP plugins.
rendering a mixed-context email for inline PGP. We can construct
the width measurement setup for container queries as discussed
                                                                        Type        Client        Version                  Plugin
in Section 6.1. For this, we transform the <tbody> element into
the wrapper. We propagate the width of the decrypted content            Windows     eM Client     9.2.2157                 -
                                                                                    The Bat!      11.1                     -
to the <tr> with class encrB using width: fit-content. Finally,
                                                                                    Outlook       2404 (Classic)           gpg4o
we transform an adjacent <tr> element into a container and can                      Outlook       2404 (Classic)           gpg4win
measure the width of the decrypted content via container queries.                   Postbox       7.0.60                   Enigmail
                                                                        Linux       Claws Mail    3.17.5                   -
    1    <div>                                                                      Thunderbird   115.9                    -
    2      <table class="encr">
                                                                                    Mutt          9.4.0                    -
    3        <tbody>
    4           <tr class="encrH">...</tr>                                          Evolution     3.44.4-0ubuntu2          -
    5           <tr class="encrB">                                                  KMail         6.0.2 (24.02.2)          -
    6             <td><div><div>DECRYPTED CONTENT</div></div></td>
    7           </tr>                                                   macOS       Apple Mail    16.0 (3774.300.61.1.2)   GPGSuite 2.0 (1827)
    8           <tr class="encrH">...</tr>                                          Canary Mail   4.48 (1612)              -
    9        </tbody>
  10       </table>
                                                                        Android     FairEmail     1.2168a                  OpenKeychain 6.0.4
  11     </div>                                                                     K-9 Mail      6.802                    OpenKeychain 6.0.4
                                                                        iOS         Canary Mail   4.47 (1506)              -
                                                                                    FlowCrypt     0.6.0                    -
Listing 5: A simplified part of the DOM as rendered by the
                                                                        Browser FlowCrypt         8.5.4 (Chrome)           -
KMail email client in a mixed context. Attacker-controlled
                                                                        Extension Mailvelope      5.1.2 (Chrome)           -
stylesheets are included above the document.                                      Psono           3.0.9 (Chrome)           -
                                                                        Webmail     ProtonMail    Webmail

C       HTML Sanitization Libraries
Table 2 shows versions and usage statistics as provided by GitHub
for the HTML sanitization libraries in our study (Section 4).
