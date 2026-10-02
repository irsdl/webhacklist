---
type: Article
title: "Carnus: Exploring the Privacy Threats of Browser Extension Fingerprinting"
resource: "https://www.ndss-symposium.org/ndss-paper/carnus-exploring-the-privacy-threats-of-browser-extension-fingerprinting/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:25:21+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/carnus-exploring-the-privacy-threats-of-browser-extension-fingerprinting/"
    title: "Carnus: Exploring the Privacy Threats of Browser Extension Fingerprinting"
    author: Soroush Karami, Panagiotis Ilia, Konstantinos Solomos, Jason Polakis
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2020/02/24383-paper.pdf"
authors:
  - Soroush Karami
  - Panagiotis Ilia
  - Konstantinos Solomos
  - Jason Polakis
canonical_url: ""
cited_by:
  - "2020.md:74"
commit: ""
content_sha256: f9d2f83d7f9b8990244e597d559312c9de1c50bba53dc9af7af7f626fd2b120a
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/carnus-exploring-the-privacy-threats-of-browser-extension-fingerprinting/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: bcc3a474ff3abea0355807b378cd1d14db58e8012034044562b38776d4cd3ff9
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2020/02/24383-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:25:21+00:00"
slug: ndss-symposium-carnus-exploring-privacy-threats-browser-extension-fingerprinting
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Carnus: Exploring the Privacy Threats of Browser Extension Fingerprinting

**Carnus: Exploring the Privacy Threats of Browser Extension Fingerprinting** - Soroush Karami, Panagiotis Ilia, Konstantinos Solomos, Jason Polakis, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/carnus-exploring-the-privacy-threats-of-browser-extension-fingerprinting/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2020/02/24383-paper.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2020/02/24383-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Carnus: Exploring the Privacy Threats of Browser
               Extension Fingerprinting

                            Soroush Karami, Panagiotis Ilia, Konstantinos Solomos, Jason Polakis
                                                University of Illinois at Chicago, USA
                                              {skaram5, pilia, ksolom6, polakis}@uic.edu

    Abstract—With users becoming increasingly privacy-aware             browsers still mediate a large portion of our online activities.
and browser vendors incorporating anti-tracking mechanisms,             As a result, the evolution of websites from static resources
browser fingerprinting has garnered significant attention. Accord-      to functionality-rich applications has also necessitated the
ingly, prior work has proposed techniques for identifying browser       evolution of browsers into complex platforms with a rich set of
extensions and using them as part of a device’s fingerprint.            APIs and features. To improve user experience, browsers allow
While previous studies have demonstrated how extensions can
be detected through their web accessible resources, there exists
                                                                        users to further personalize them and extend their functionality
a significant gap regarding techniques that indirectly detect           by installing extensions.
extensions through behavioral artifacts. In fact, no prior study             Apart from the obvious benefits for users [26], [38], [48],
has demonstrated that this can be done in an automated fashion.
                                                                        extensions also introduce a privacy risk. Due to the potential
In this paper, we bridge this gap by presenting the first fully
automated creation and detection of behavior-based extension            risk, browsers do not provide any mechanism that would allow
fingerprints. We also introduce two novel fingerprinting tech-          a visited webpage to directly obtain the list of installed browser
niques that monitor extensions’ communication patterns, namely          extensions. In practice, however, webpages can indirectly infer
outgoing HTTP requests and intra-browser message exchanges.             which extensions are installed [24], [44], [46], [47]. Once the
These techniques comprise the core of Carnus, a modular system          list of installed extensions is obtained, it can be used as part of
for the static and dynamic analysis of extensions, which we             a user’s device fingerprint and coupled with other browser [18],
use to create the largest set of extension fingerprints to date.        [33], [40] or system level [13] information, which can lead
We leverage our dataset of 29,428 detectable extensions to              to the tracking of users across the web [8], [19]. Extensions
conduct a comprehensive investigation of extension fingerprinting       may also directly leak sensitive information like visited pages
in realistic settings and demonstrate the practicality of our attack.
                                                                        and form data to third parties [51]. While Firefox and Safari
Our in-depth analysis confirms the robustness of our techniques,
as 83.6% - 87.92% of our behavior-based fingerprints remain             have tried to prevent certain extension enumeration techniques,
effective against a state-of-the-art countermeasure.                    Chrome –the most popular browser with a market share of
                                                                        ∼64% [53]– remains vulnerable.
    Subsequently, we aim to explore the true extent of the privacy
threat that extension fingerprinting poses to users, and present            In this paper, our motivation is twofold: to conduct a com-
a novel study on the feasibility of inference attacks that reveal       prehensive exploration of automated extension enumeration
private and sensitive user information based on the functionality       techniques under realistic settings, and to understand the true
and nature of their extensions. We first collect over 1.44 million      extent of the privacy threat that extension fingerprinting poses
public user reviews of our detectable extensions, which provide         to users (apart from facilitating browser fingerprinting and web
a unique macroscopic view of the browser extension ecosystem            tracking). To that end we build Carnus, a modular system
and enable a more precise evaluation of the discriminatory power
                                                                        that analyzes Chrome extensions statically and dynamically for
of extensions as well as a new deanonymization vector. We
also automatically categorize extensions based on the developers’       creating fingerprinting signatures and inferring sensitive data.
descriptions and identify those that can lead to the inference of       Our system employs four different techniques for detecting
personal data (religion, medical issues, etc.). Overall, our research   extensions; first, it leverages the straightforward technique
sheds light on previously unexplored dimensions of the privacy          of identifying extensions that expose unique web-accessible
threats of extension fingerprinting and highlights the need for         resources (WARs), which has been demonstrated in prior stud-
more effective countermeasures that can prevent our attacks.            ies [24], [47] at a smaller scale. Next, we focus on the identifi-
                                                                        cation of extensions through the detection of unique behavior-
                                                                        based modifications to a page’s DOM. While this approach
                       I.   I NTRODUCTION
                                                                        has been proposed as a potential fingerprinting technique [52],
    As Internet connectivity continues to proliferate globally,         no prior work exists on the automatic generation of behavioral
reaching almost ubiquitous presence in many countries, a large          fingerprints. Here we tackle this challenging task, detail our
fraction of our everyday activities have migrated to the web.           technical approach, and demonstrate our system’s effectiveness
While mobile apps generate a significant amount of traffic,             at automatically creating and detecting fingerprints at scale.
                                                                            We also introduce two new techniques for inferring the
                                                                        presence of extensions based on intra-browser and exter-
Network and Distributed Systems Security (NDSS) Symposium 2020          nal communication. Specifically, we find that certain exten-
23-26 February 2020, San Diego, CA, USA
ISBN 1-891562-61-4                                                      sions broadcast messages for communicating with components
https://dx.doi.org/10.14722/ndss.2020.24383                             within the page (e.g., injected JavaScript), which we use to
www.ndss-symposium.org                                                  build fingerprints. Similarly, extensions can also send HTTP
requests to external servers to fetch resources. We conduct a               •    We present the largest extension fingerprinting study
crawl of the Chrome Web Store and are able to fingerprint                        to date, highlighting the true extent of fingerprintable
29,428 extensions using all these techniques, resulting in the                   extensions within the Chrome Store. Our dataset also
largest and most complete fingerprinting study to date. To                       enables an evaluation of our attacks against a state-of-
demonstrate the robustness of our techniques we evaluate the                     the-art countermeasure [55], demonstrating the effec-
impact of a recently presented state-of-the-art countermea-                      tiveness of our techniques as Carnus can still detect
sure [55] and find that our system can still fingerprint 83.6%                   the vast majority of the behavior-based extensions.
- 87.92% of the behavior-based extensions.
                                                                            •    We present an analysis on the unicity of extensions
    Subsequently we measure the tracking capability enabled                      using publicly available extension reviews as the van-
by extension fingerprints. While prior work has conducted user                   tage point for quantifying the uniqueness of extensions
studies on a smaller scale and using smaller sets of finger-                     among more than 1.16 million users. Apart from mea-
printable extensions [24], [52], our goal is to accurately gauge                 suring the true usefulness of extension fingerprints for
the usefulness of extension fingerprints under more realistic                    tracking users, we explore a novel deanonymization
settings in terms of scale. Given the significant challenge of                   attack where users’ identities are inferred based on
conducting very large user studies with actual participants, we                  their public reviews.
identify an alternative data source that offers a unique view
into the set of extensions that users install, thus enabling such           •    We present the first empirical analysis on the pri-
an analysis. Specifically, we collect over 1.44 million publicly                 vacy inference attacks enabled by browser extensions.
available reviews for the extensions that are fingerprintable                    Specifically, we describe an attack for inferring users’
by Carnus. Using this dataset we conduct an analysis of the                      personal and sensitive information (e.g., demograph-
unicity of installed browser extensions for over 1.16 million                    ics, ethnicity, religion, etc.) based on the intended
users, and explore the feasibility of a novel deanonymization                    functionality of detected extensions.
attack. Our results show that extensions installed by users
can be highly identifying; for instance, if an attacker detects                    II.   BACKGROUND AND T HREAT M ODEL
4 random extensions that are fingerprintable by our system,
there is a 94.47% chance that she can uniquely identify the                  Extension fingerprinting. While modern browsers offer a
user and learn their name and profile picture. While this                rich set of capabilities and functionality, third-party developers
deanonymization attack is not applicable to all users, since             are allowed to create extensions that add new features and en-
not everyone writes reviews, it reveals a significant privacy risk       able a better experience for users. For instance, popular exten-
that stems from a seemingly innocuous action, i.e., writing a            sions can remove undesired content like advertisements [21],
review about a browser extension.                                        [39] but can also harden browsers by removing undesired
                                                                         features [48] or forcing web requests over HTTPS [27], [45].
     Finally, we investigate the feasibility of attacks that infer       To achieve their desired functionality, extensions can alter a
user information based on the intended functionality of the              webpage’s DOM and even execute arbitrary scripts in the
discovered extensions. While not all extensions reveal sen-              context of a webpage (which introduces a significant security
sitive information about the user (e.g., an ad-blocker), other           threat [10], [12], [15], [28], [36]). However, unlike plugins,
extensions can explicitly or implicitly disclose information that        browsers do not provide a JavaScript call for a webpage to
is personal (e.g., ethnicity) or sensitive (e.g., religion). Our         obtain a list of the extensions installed in a user’s browser.
analysis shows that at least 18,286 of the extensions reveal
such information. When considering the most sensitive types of               As a result, extensions can only be detected by pages
information, we find that 147, 116, and 387 extensions expose            indirectly. While we present details on how Carnus achieves
the user’s medical/health conditions, religion and political             this in Section III, the main idea is that extensions expose
inclinations, respectively. Also, we find that the extensions            elements (e.g., an icon) or exhibit behavior that is observable
that expose such sensitive information have been downloaded              by webpages. If a specific extension’s elements or behavior
almost 2.5 million times. These findings highlight the privacy           are unique among all extensions, then a page can uniquely
risk of users installing browser extensions, as websites and             identify (i.e., fingerprint) it. Identifying exposed resources in
third-party services can surreptitiously infer personal and sen-         Chrome is a straightforward process that has been demon-
sitive information. In summary, our research contributions are:          strated before [24], [47]. On the other hand, uniquely identi-
                                                                         fying extensions based on their behavior is a challenging task
   •    We develop Carnus, a system that combines dynamic                that presents several obstacles in practice. First, extensions can
        and static techniques for automatically analyzing ex-            exhibit behavior that is dynamic and potentially ephemeral in
        tensions, and demonstrate the first automated creation           nature that also relies on characteristics of the visited website,
        and detection of behavior-based fingerprints. We pro-            as opposed to the typically static and long-lasting nature of
        vide a detailed technical description of our novel               exposed resources. Moreover, multiple extensions may exhibit
        framework, which fully automates the entire finger-              similar or identical behavior (e.g., blocking ads on a page). To
        printing process, and demonstrate the practicality of            make matters worse, if a user has multiple extensions installed
        our attack.                                                      their behavior may overlap, further obscuring the “signals”
                                                                         used for fingerprinting. While prior work [52] proposed the
   •    We introduce two new fingerprinting techniques that              use of behavioral features for fingerprinting extensions, that
        rely on extensions’ communication patterns and are               study did not actually automatically create or evaluate such
        robust against all countermeasures previously pro-               fingerprints, nor did it explore the implications of overlapping
        posed by researchers or deployed by browsers.                    behaviors from different extensions. In this study we provide

                                                                     2
a comprehensive analysis of extension fingerprinting that ex-                By compiling a list of the extensions that expose such re-
plores these challenging, yet critical, practical dimensions.            sources, a website can probe these resources in order to detect
                                                                         which extensions the user has installed in her browser. Since
    Threat model. In practice, extension fingerprinting tech-
                                                                         this attack is only feasible when the extensions’ identifiers
niques can be deployed in different settings, which can affect
                                                                         and resource paths are known, Firefox recently implemented
their accuracy; for instance, certain extensions can only be
                                                                         a countermeasure of assigning a random identifier to each in-
detected by certain web pages as their functionality gets
                                                                         stalled extension. However, Chrome lacks any countermeasures
“triggered” only when the user visits specific domains [52].
                                                                         for preventing WAR-based extension enumeration.
Since such extensions cannot be detected by all attackers, we
focus on extensions that can be detected regardless of the                   As our goal is to maximize the potential coverage of our
web page’s domain. More specifically, we assume that the                 attack and explore in depth the privacy implications that arise
attacker is able to lure the user to a specially crafted page that       from the detection of extensions, we implement the WAR-
attempts to detect as many installed extensions as possible.             based technique as part of our system. During the preparatory
Furthermore, as in previous studies, we assume that the user             phase, we statically parse the manifest files of the extensions
visits the attacker’s website over Chrome on a computer and              collected by our crawler and identify which ones expose such
not a smartphone, since the mobile version of Chrome does                resources. During the attack phase, a script in our page issues
not support extensions.                                                  a request for each extension’s WAR and determines if the
                                                                         extension is installed based on the status code of the response.
       III.   S YSTEM D ESIGN AND I MPLEMENTATION
    In this section we provide details on the design and imple-          B. Behavior-Based Extension Enumeration
mentation of our system. A high-level overview of Carnus is                  During an initial exploration of the web extension ecosys-
shown in Figure 1. The first module of our system is respon-             tem, we encountered various extensions that exhibit patterns of
sible for crawling the Chrome Web Store and downloading                  potentially detectable behavior. Specifically, we found exten-
all available extensions. The crawler also extracts metadata             sions that dynamically add new images, buttons, or text to the
including the descriptions provided by the developers, as well           web page, some that detect images and text and replace them,
as all accompanying reviews by users. The extensions are                 as well as extensions that fetch resources from the web and use
processed by both static and dynamic analysis components                 message passing for communicating with the JavaScript code
which identify their WARs and exercise them to extract their             inside the visited page. By detecting all the behavioral patterns,
behavioral signatures. These are subsequently processed so the           a website can generate behavior-based signatures that allow
final fingerprint is created for each extension. For our pri-            identification of the user’s installed extensions. In the following
vacy inference attacks, we focus on fingerprintable extensions.          we focus on detecting the extensions that alter the DOM tree
Indeed, their descriptions, metadata, and users’ reviews are             of the visited web page, while in subsections III-C and III-D
processed so as to identify extensions of interest and create            we present our new techniques for capturing extensions’ intra-
the list of user characteristics and traits that they reveal.            and inter-communication patterns.
     Extension enumeration. As mentioned previously, prior                   DOM modification. In general, the types of modifications
studies have demonstrated the feasibility of browser extension           that are performed by extensions can be attributed to the
enumeration and fingerprintability. These studies focused their          following behaviors: (i) adding new nodes in the DOM tree
efforts on identifying extensions that expose specific resources         of the page, (ii) removing nodes from the DOM tree and (iii)
(i.e., WAR-based enumeration) either directly [24], [47] or              changing the attributes of existing nodes. A special case of the
with clever implicit approaches [44], [46]. In the following             latter category is the case of extensions that identify specific
subsections we provide technical details and outline the finger-         keywords in the text of the page and replace them with other
print generation and extension detection process for our four            predefined keywords.
techniques. Overall, we present the first study that incorporates
multiple fingerprinting techniques, enabling the largest and                 To capture the modifications performed by each extension
most comprehensive exploration to date.                                  and generate their behavioral fingerprints, we follow a dynamic
                                                                         analysis process where we aim to “trigger” extensions and
A. WAR-Based Extension Enumeration                                       elicit their functionality. To that end, Carnus incorporates a
                                                                         precisely crafted website under our control (i.e., a honeysite
    An extension’s structure and required permissions are de-            with honeypages). Specifically, for each extension we launch
fined in a manifest file. In practice, the permissions declare           a new instance of the Chrome browser with only this extension
the extension’s ability to access websites and Chrome APIs,              installed and visit our honeysite three times. During these
and the content scripts point to code that will be fetched               visits we detect the extension’s modifications by comparing the
and executed in the context of web pages. Resources such                 content rendered in the browser with the honeysite’s original
as images, JavaScript and CSS files are packed along with                contents and generate the extension’s behavioral fingerprints.
extensions. Relevant to our goal are web accessible resources            Our system visits the honeysite three times during the fin-
(WAR). The WAR section of the manifest defines a list of                 gerprint generation process, as our empirical analysis showed
resources within an extension that can be accessed from a                that this provides a good balance between eliciting different
web page. In other words, a page is only able to access re-              behaviors by the extensions and not significantly increasing
sources whose paths exist in the WAR section [2]. In Chrome,             the duration of the dynamic analysis.
a page can fetch a resource from an extension through:
chrome-extension://<UUID>/<path>, where <UUID> is the                        Since the honeysite is controlled by us (or in the case of an
public extension ID, and <path> is the path to the resource.             actual attack by the attacker), all the modifications that occur

                                                                     3
Fig. 1: Overview of Carnus’ two main workflows. The extension enumeration phase analyzes extensions and creates signatures
that enable fingerprinting browser extensions. The privacy inference phase analyzes extensions and their respective reviews and
identifies extensions that implicitly reveal sensitive or personal information about the users.



in the page during the attack phase are the result of the user’s            description. Any keywords that are detected when visiting the
installed extensions and not some other external factor, thus,              description page are included in our honeysite. While this
allowing the attacker to isolate precisely the changes performed            is a fairly straightforward approach, it has not been used in
by extensions. When a user visits our website (i.e., during                 prior extension fingerprinting studies and actually enables the
the extension detection phase), Carnus captures the contents                detection of 7.6% of all the extensions that we detect through
of the website, detects the modifications performed by their                honeypage modifications (22.1% of these also reveal sensitive
installed extensions, and constructs signatures that describe               information in our inference study).
these modifications. Finally, for identifying the user’s installed
extensions, Carnus matches the visiting user’s signatures with                   Fingerprint generation. This methodology is followed for
the fingerprints that we have previously stored in our database.            the generation of the extensions’ behavioral fingerprints that
                                                                            are stored in our database, as well as the signature of the mod-
    Design of honeysite. As the goal is to trigger as many exten-           ifications that are performed when the user visits the attacker’s
sions as possible into performing some form of modification,                website. In both cases, Carnus treats all the observed modifi-
and generate their fingerprint, our honeysite includes highly-              cations as a sequence of additions and removals (replacement
diverse content. The main challenge we attempt to tackle is                 or modification of an existing element can be considered as
that extensions may exhibit detectable behavior only when                   a removal of that element and addition of a new one). We
specific conditions are met. For example, the popular password              construct the signature by considering all added and removed
manager LastPass inserts an icon in form fields, but may not                terms. That is, a signature consists of two distinct parts: (i) the
interfere with any other objects in the page. If the honeysite              set of additions and (ii) the set of removals. For instance, in the
does not have such a field, LastPass will not insert the specific           case of an extension that injects a new image in the web page
icon in the page, hence, Carnus will not be able to detect it. To           (i.e., <img src='image.png'>), the signature will be generated
avoid such cases, our honeysite includes all available HTML                 as the following sets [{"<img", "src='image.png'>"},{}]
tags, types, various attributes, ad-fetching scripts (that do not           that represent the added and removed terms, with the latter
actually fetch any ads) and media resources of various types.               one being an empty set in this case. Similarly, for an extension
                                                                            that replaces image-1 with image-2, the signature will be
    Since the space of all potential extension triggers is vast,            [{"src='image-2.png'>"}, {"src='image-1.png'>"}].
including all available HTML tags in the honeysite cannot
definitely offer the coverage we aim to obtain, as our system                   At a high level, after identifying the modifications of all
will not be able to detect extensions that are only triggered by            extensions and generating their fingerprints, we can enumerate
specific keywords being present in the page’s text. As such,                the extensions of a user by matching the observed modifi-
our system tries to identify keywords that need to be included              cations’ signatures with the extensions’ fingerprints that we
in our honeysite through the following process: we visit each               already have in our database. That is, when a user visits our
extension’s page in the Chrome Web Store twice, once with the               website, we have embedded JavaScript code that identifies
respective extension installed and once without, and compare                the modifications during that visit, calculates the signatures
the text of the extension’s description across the two visits.1             of these modifications on-the-fly, and compares them with the
                                                                            fingerprints we have previously generated for all extensions.
    The observation behind this is that, specific keywords that
activate such behavior are typically included in the extension’s                    However, in practice, there are two important challenges
                                                                                that can significantly affect the behavior-based detection of
  1 Descriptions can be found at https://chrome.google.com/webstore/detail/UUID extensions and lead to false positives or negatives. First, exten-




                                                                        4
sions can exhibit different behaviors across different executions        possible to end up with overlapping fingerprints. In such cases,
or inject content that contains dynamic parts. Second, multiple          the fingerprint of an extension appears to be the same or part
extensions may perform similar modifications on the website’s            of another extension’s fingerprint. As this can result in false
DOM tree, which can affect the accuracy of our system. Next,             positives (all overlapping fingerprints will match the user’s
we describe the process we have established for solving these            signature), after detecting all the matching fingerprints, we try
issues and making Carnus more robust.                                    to identify and resolve such cases.
    Dynamic content. As mentioned before, during the fin-                    In the case where two identical fingerprints match the
gerprint generation phase we visit the honeysite three times.            user’s signature, our system cannot determine which one of the
This allows us to differentiate between extensions that always           extensions the user has installed. Therefore, we consider both
perform the same modifications and those that exhibit different          of the extensions unless one of them can be matched by another
but likely similar behaviors. If these visits generate different         technique of our system (i.e., WAR-based or communication-
behavioral fingerprints, we keep them all in our database                based). When one of the matched fingerprints appears to be a
as the extension’s fingerprints. We estimate how similar or              subset of another matched fingerprint, Carnus keeps the one
different these fingerprints are and detect whether some parts           that has the highest number of terms matching the signature.
of them include dynamic content. An example of fingerprints
that change with every execution is given by the following:              C. Intra-communication Based Enumeration
   [{"<img","src='img.png'>","timestamp=100"},{}]                            For security reasons, browsers separate the execution con-
   [{"<img","src='img.png'>","timestamp=200"},{}]                        text of extensions’ background scripts, content scripts, and the
   [{"<img","src='img.png'>","timestamp=300"},{}]                        page’s scripts. These scripts run in isolated worlds, preventing
                                                                         one from accessing variables and functions of the others [1].
    In the case where the extension injects dynamic content,
                                                                         However, they can communicate by exchanging messages [3].
the user’s signature will never directly match the extension’s
                                                                         Content scripts can communicate with background scripts by
fingerprint that we have already generated and stored. To
                                                                         using the runtime.sendMessage API. Background scripts
handle such cases, during the fingerprint generation phase
                                                                         can use the tabs.sendMessage API to communicate with
Carnus tries to identify the static and dynamic parts of highly
                                                                         content scripts. The messages exchanged between the exten-
similar fingerprints (i.e., that have all but one terms identical,
                                                                         sions’ background and content scripts are invisible to the page.
and a single term partially matching) and re-writes them so
that the dynamic part of the partially matching term is not                  Furthermore, communication between an extension and a
included in the fingerprint. In the above example, Carnus will           web page can be achieved in two ways: the page’s scripts
include the matching part (i.e., “timestamp=”), but it will              can exchange messages with (i) the extension’s background
omit the value that follows the “=” sign.                                scripts and (ii) content scripts. For the first approach, a page
                                                                         can use the runtime.sendMessage API to send messages
     The approach we described above for the detection and
                                                                         to the extension’s background, and the extension in turn
omission of fingerprints’ dynamic values is a bit conservative,
                                                                         uses the runtime.onMessageExternal.addListener API
as it only considers the case of almost identical fingerprints
                                                                         to receive these messages and send responses back to the
that have all their components matching or partially matching.
                                                                         page. However, this communication is only possible when
Since this approach cannot detect all cases of fingerprints with
                                                                         the extension adds an externally_connectable key in its
dynamic parts, we also allow a certain number of components
                                                                         manifest file, specifying the URL patterns of websites that
to mismatch when comparing the fingerprints in the database
                                                                         the extension wants to communicate with. The URL pattern
with the visiting user’s signature. The number of allowed mis-
                                                                         must contain at least a second-level domain, and wildcard style
matches is determined according to the size of the fingerprints
                                                                         patterns like “*” or “*.com” are prohibited. This is to prevent
(i.e., number of terms in the sets of additions and removals).
                                                                         arbitrary websites from communicating with the extension.
Since smaller fingerprints tend to be more specific and also
have a higher risk of a false positive matching, we enforce                  For communication between an extension’s content script
a strict policy of no mismatches allowed for fingerprints that           and a web page, the postMessage API can be used (and the
have a size of up to 10 (covering almost 55% of our extensions           externally_connectable key is not required). As a result
as shown in Figure 4). For larger fingerprints, with a size of           any arbitrary web page can exchange messages with the exten-
10 to 50, which covers an additional ∼26% of the extensions,             sion. In this section, we leverage this kind of message-passing
Carnus is more lax and allows mismatches of up to 10% of the             to create a new extension fingerprinting vector. Differences in
fingerprint’s size. For the final ∼20% of even larger fingerprints       the messages sent by extensions allow Carnus to distinguish
we allow mismatches of up to 5% of the fingerprint’s size.               between different extensions that employ message passing for
                                                                         intra-communication purposes. For instance, Listing 1 shows
    Fingerprints overlap. When comparing the extensions’                 parts of the content script of the “MeetMe Dolby Voice 1.1”
fingerprints that are stored in our database with the visiting           extension (UUID: lflnplggpolkcgknahacafilopgngelc),
user’s signature, we essentially compare the two sets of added           which sends two messages to the web page.
and removed terms of every stored extension’s fingerprint with
the respective sets of added and removed terms in the user’s                 Fingerprint generation. The approach that we follow for
signature. To have a match both sets of a fingerprint need to            capturing such messages is similar to the one we implemented
match those of the user’s or a subset of them (i.e., the user            for detecting DOM modifications and generating behavioral
has multiple extensions installed and her signature consists of          fingerprints. We include a JavaScript EventListener in our
the modifications performed by all of them). However, since              honeysite to capture and log all message events. Again, we
there are extensions that perform similar modifications, it’s            visit the honeysite three times for each extension to identify

                                                                     5
function logToJavascriptPlugin (msg) {                                          [{"https://b.alicdn.com/@sc/list-buyer/assets/source
window.postMessage({MeetMeDolbyVoiceMsgP1x1:                                        -now/entry/index.js"},
    'log_msg', raw_value:{component:'ChromeExt-FG',                             {"https://b.alicdn.com/@sc/list-buyer/lib/js/jquery.
        message: msg}},'*');                                                        js"}]
}
...                                                                              Listing 3: Example of an inter-communication fingerprint.
logToJavascriptPlugin('Sending \'ping\' message to
    transport layer');
window.postMessage({MeetMeDolbyVoiceMsgP1x1:'ping'},
    '*');
                                                                                    Fingerprint generation. As before, we visit our specially
Listing 1: Code snippets of an extension that sends two                         crafted honeysite and detect and record the URLs of all
messages to the web page.                                                       requested resources. Since, in practice, the attacker creates and
                                                                                controls the honeysite, it is trivial to detect any issued requests
                                                                                that are not part of the page but originate from extensions.
[{"MeetMeDolbyVoiceMsgP1x1":"log_msg", "raw_value":{                            During our dynamic analysis we visit our honeysite three times
    "component":"ChromeExt-FG", "message":"Sending '                            to detect whether an extension always fetches the same or
    ping' message to transport layer"}},                                        different resources, and accordingly generate the extension’s
{"MeetMeDolbyVoiceMsgP1x1":"ping"}]
                                                                                fingerprint based on the set of these URLs.
 Listing 2: Example of an intra-communication fingerprint.                          Extension enumeration. When a user visits our website,
                                                                                we capture all the outgoing HTTP requests in the same fashion
                                                                                and determine which requests appear due to the installed
whether it always sends the same messages and if they contain                   extensions. Thus, we generate the signature of the visiting user
any dynamic values. After removing the dynamic parts, the set                   as the set of these requests, and try to match the extensions’ fin-
of exchanged messages is used for generating the extension’s                    gerprints that we created previously with the user’s signature.
fingerprint. Listing 2 shows the fingerprint that is generated for              As with the intra-communication technique, we allow 20%
the aforementioned extension (that was presented in Listing 1).                 mismatches and remove any detected extensions that have a
                                                                                fingerprint that is a subset of another detected extension.
    Extension enumeration. During the attack phase, when a
user visits our website, our system captures all the messages                       Overall, we follow different mismatch thresholds for
sent by the installed extensions and matches them with the                      the DOM-based and communication-based fingerprints. Since
message-based fingerprints that we created during the mes-                      some DOM-based modifications are common across different
sage capturing phase. To capture the exchanged messages,                        extensions, and the extensions’ behavior and fingerprint size
as described above, we include an EventListener in our                          vary significantly, we found that an adaptive approach based on
website and log all received messages. After constructing                       the fingerprint size is more effective. For communication-based
the user’s message-based signature, Carnus checks which of                      fingerprints, which are significantly smaller than the DOM-
the extensions’ fingerprints are a subset of it, indicating that                based ones, as well as more unique and robust, we empirically
those extensions are installed in the user’s browser. For this                  found that a lax heuristic of allowing 20% mismatches yields
enumeration technique, 20% mismatches are allowed. Finally,                     better results.
from the list of detected extensions with this approach, we
remove extensions if their fingerprint is a subset of a fingerprint             E. Behavior-based Fingerprinting: Current State of Affairs
of another detected extension.                                                      Prior work. Starov and Nikiforakis [52] proposed the
                                                                                method of detecting DOM-based modifications for fingerprint-
D. Inter-communication Based Enumeration                                        ing the user’s installed extensions and presented XHound, a
     Extensions can issue HTTP requests for fetching resources                  tool for identifying if an extension is detectable based on the
(i.e., css files, scripts, images, etc.) from the Internet. For in-             modifications it performs on the page’s DOM. A followup
stance, the HTTP requests that are issued by the “source now”                   study by Trickel et al. [55] also leveraged some functionality
extension (UUID: dimnlaemmkbhojonandnnbogfifjnpno)                              of XHound. While these two studies refer to behavior-based
are shown in Listing 3. Carnus incorporates a novel extension-                  fingerprinting, they did not actually create any behavior-based
detection module that relies on monitoring all the HTTP                         fingerprints automatically or provide technical details on how
requests issued by extensions for fetching resources.                           these fingerprints can actually be created. In more detail, when
                                                                                discussing their implementation of checks (that compare DOM
    For detecting HTTP requests issued by the user’s installed                  changes to signatures) for detecting extensions, the authors of
extensions, we use the Resource Timing API [57], which stores                   XHound explicitly state that “these checks could, in principle,
performance metrics regarding the performance and execution                     be automatically generated by parsing XHound’s output but we
of web applications and is accessible through JavaScript. Us-                   leave this automation for future work” [52]. In [55] the authors
ing the performance.getEntriesByType("resource")                                manually created behavior-based fingerprints for 20 extensions
method we can query the list of all resources requested. As a                   to evaluate their proposed countermeasure, and stated that
result, we obtain all resources requested by the web page and                   behavior-based fingerprinting “does not currently scale” and
content scripts of extensions installed in the user’s browser.2                 that fingerprint creation “requires human intelligence and no
Such requests can exhibit unique features, thus rendering them                  recent research has shown how to automatically generate”.
a useful signal for enumerating installed extensions.
                                                                                    While XHound’s proposal of using DOM-based changes
  2 Resources requested by extensions’ background pages are not included.       for fingerprinting is a major contribution, it is important to

                                                                            6
1.[{style="display:','none;"','id="hashmenu01"'},{}]                       by design, can detect and filter out noisy terms that could make
                                                                           the fingerprints unstable. Listing 5 presents examples of Carnus
2.[{'class="rmcScreenshotInstalled"'},{}]
                                                                           fingerprints that remain effective even if a user’s browser
Listing 4: Example of behavioral fingerprints that are not                 relies on CloakX for protection. The first two fingerprints
effective against the countermeasures of CloakX.                           are not changed at all, while the following two are modified
                                                                           but still contain unique terms that lead to their identification.
                                                                           Moreover, CloakX does not alter extensions’ intra-browser
1. [{'src="//buy.dayanghang.net/inject/common.js"'},                       and external communication patterns. We further explore our
    {}]                                                                    attack’s effectiveness against CloakX in Section V.
2. [{'action="/cconcert-login"','style=""'},{'action
    ="/cpanel-login"'}]                                                           IV.   E XTENSION - BASED I NFERENCE ATTACKS
3. [{'value="mata-inactive-38.png"','id="mata-icon-                            While the set of extensions that are detected by our enu-
    name"','type="hidden"'},{}]                                            meration techniques can be used as a vector for fingerprinting,
//This fingerprint will be rewritten to [{'value="
    mata-inactive-38.png"', 'type="hidden"'},{}]                           these extensions can also reveal previously unknown and
                                                                           potentially sensitive information about the user. This includes
4. [{'type="text/javascript"','src="chrome-extension                       her personal traits and interests, religious and political beliefs,
    ://nogempgplicnckhcmgjjjgflmipmbgaf/variables-                         demographics, etc. In this section, we present the techniques
    sharing.js"'},{}]
//This fingerprint will be rewritten to [{'type="
                                                                           employed by Carnus for analyzing extensions, understanding
    text/javascript"','src="chrome-extension://                            the functionalities they perform, and finally, extracting inter-
    nogempgplicnckhcmgjjjgflmipmbgaf/"'},{}]                               esting and potentially sensitive information about these users.
Listing 5: Example of behavioral fingerprints that remain                      This analysis uses as input the extensions’ descriptions and
effective even after the deployment of CloakX.                             reviews that our crawler collected from the Chrome Web Store.
                                                                           Since it is inherently hard, if not impossible, for someone other
                                                                           than Google to collect information about all the users that have
                                                                           installed each extension, we use users’ public reviews as a
highlight all the challenges posed by the full process that our            substitute; This provides a unique view within the extension
system needs to address; this includes automatically identify-             ecosystem, allowing for an aggregate analysis on a very large
ing all the changes in the DOM, generating the signatures for a            number of users. Moreover, users are required to install an
given extension, comparing those to the signatures of other ex-            extension before being allowed to provide a review, resulting
tensions and removing redundant overlapping parts, evaluating              in a dataset of users that have actually installed the extensions.
how extensions co-interfere in practice, as well as optimizing
the system to complete the attack in a short time. Our research                 Topic classification. The first phase of our analysis lies in
fills this significant gap by providing technical details on               understanding what functionality is offered by each extension
how to create behavior-based fingerprints, demonstrating the               and then classifying them into distinct categories according to
automated creation and detection of such fingerprints at scale,            their type. For this task we use the extensions’ descriptions. At
and exploring their effectiveness in practical settings.                   first, we pre-process and “clean” the noisy description text so
                                                                           as to remove “irrelevant” text that can affect the outcome of the
    Countermeasures. Trickel et al [55] proposed CloakX, a                 classification (more details below). For the actual classification
system that aims to render extension enumeration ineffective               we use Google’s Natural Language API [4], which is highly
by diversifying the attributes of fingerprints. To prevent ex-             accurate as we outline in Section VI. Google’s API provides 35
tension detectability, ClockX substitutes the values of ID and             categories and 400 subcategories. We manually identified and
class attributes of the injected DOM nodes with randomized
                                                                           grouped all the categories/subcategories that refer to the same
values. In addition to that, it also injects random tags and               (or related) topic under a generic label, so as to provide a more
attributes in the page. It does so to: (i) inhibit websites that use       concise categorization of the information that is pertinent to
DOM queries (i.e., methods getElementsByClassName(),                       our analysis. For example, we group together all health-related
getElementsByTagName() and getElementById()) from
                                                                           categories (i.e., Health Conditions, Neurological Conditions,
identifying specific elements that are injected by an extension            etc.), under the label “Health”.
and (ii) make structural patterns noisy.
                                                                               Pre-processing and cleaning descriptions. Typically each
    In Listing 4 we present two examples of Carnus finger-
                                                                           extension is supposed to have two descriptions, a short one
prints that are rendered ineffective by the countermeasures
                                                                           that describes the extension’s functionality in one or two
of CloakX [55]. Since CloakX substitutes the values of the
                                                                           sentences, and a longer one that provides more details about its
ID and class attributes, if we exclude these attributes from
                                                                           functionality, implemented features, supported websites, etc.
our fingerprints, the first fingerprint in Listing 4 becomes
                                                                           In practice, however, some of the extensions omit one or
too generic after excluding the ID attribute, while the second
                                                                           both of the descriptions, or contain text that is not useful for
becomes empty after removing the class attribute.
                                                                           classification. The main challenge is identifying which parts of
     However, our approach does not simply rely on the iden-               their text are relevant and useful for classification, and which
tification of specific elements and tags that are injected,                have information that could potentially lead to incorrect results
but analyzes all the changes in the honeysite, term-by-term,               and needs to be removed. This task is challenging since there
to construct the fingerprints of each extension. Our system                are no enforced guidelines regarding the content that should
considers all terms added and removed by each extension and,               be included in descriptions.

                                                                       7
     We start our processing by detecting the language of each             TABLE I: Number of extensions detected by each technique
description and translating non-English ones into English. Text            employed by Carnus, including those that are unique to each
is then split into paragraphs and sentences, and our system tries          technique (i.e., cannot be detected by any other technique).
to detect and remove text that corresponds to very short or im-
properly composed sentences. Carnus incorporates the NLTK                                                      Detected Extensions
library [42] for part-of-speech tagging and removes sentences                    Detection technique           Total     Unique
that do not contain at least one noun and one verb. Finally,
our system uses NLTK’s implementation of the TextTilting                         WAR-based                     25,866       23,046
algorithm [25] to segment the text into multi-paragraph topical                  Behavioral (DOM-based)         5,793       2,998
blocks and, since the extensions’ functionality is more likely                   Inter-communication             859         181
to be described at the beginning of the description, it extracts                 Intra-communication             450         105
the first two such blocks for classification.
    Description-based inference. We explore whether the
extensions’ descriptions reveal any sensitive information about            analysis. This is a limitation of our approach as there is no
the users, such as their location, language, political inclination         straightforward method for detecting whether the name used
or religious beliefs. For this task, we use the spaCy library [20]         during the creation of a user’s Google account is fake or not
to detect entities that correspond to locations (i.e., countries,          (e.g., consider a simple scenario where someone named “Jack
cities), nationalities, languages and ethnic, political or religious       Smith” creates a Google account under the name “John Doe”).
groups. With this approach we detect and verify that 2,260                     Our analysis shows that while certain names do not reveal
of the extensions indeed reveal such information about their               much information as they can be commonly found in several
users. We note though that this number corresponds to a lower              countries (e.g., John) others can provide a strong indication of
bound as it depends on the library’s accuracy in detecting                 the user’s ethnicity. To that end, we use an extensive set of
such information, and improving named entity recognition                   name-by-origin lists (all names per country/ethnic group) cre-
techniques is out of the scope of this work.                               ated from online resources. We correlate the reviewers’ names
    During the verification we only consider extensions for                to the lists to identify the countries or ethnic groups where this
which our process extracts specific demographic information,               name appears, and construct a vector of associated ethnicities
and not cases where additional knowledge is needed for infer-              (e.g., the name “Deepika” is predominantly found in India
ring such information. For example, we do not consider entities            and Nepal). As aforementioned, fake names or pseudonyms
that correspond to organizations or companies. Although such               that do not match a known name from our list are discarded.
entities could be associated with particular countries, the task           By combining the ethnicity vectors of the users that have
of identifying these associations would require significant man-           installed a specific extension, we create a breakdown of the
ual effort. Furthermore, we use public wordlists of religious              demographic information of each extension’s user population.
and medical terms [17] and create a new wordlist containing                     Extensions can attract a wildly diverse set of users and,
political terms, to detect extensions with descriptions that               thus, not all of them are useful for inferring a targeted user’s
reveal these types of sensitive information.                               characteristics. As such, we need a method to filter out such
    Reviewer-based inference attacks. Apart from the de-                   extensions and focus on those that have a more consistent user
scription text, we also utilize users’ reviews for each extension          profile. To identify suitable extensions, we use the Shannon-
to extract information that enables the inference of sensitive             Wiener index [49], which is commonly used in ecological and
user data. First, we explore the feasibility of inferring a user’s         biological studies for calculating the richness and diversity of
ethnicity based on a fingerprinted extension. Specifically, we             a given species, to pinpoint extensions with predominant user
are motivated by the observation that the users of a certain               ethnicities. An important dimension of the privacy invasiveness
extension can exhibit strong ethnic affinity due to its intended           of this approach is that it can bypass common technical mea-
functionality (e.g., an extension for buying subway tickets in a           sures taken by users to hide their country of origin or ethnicity
specific region). While actual demographic information about               (i.e., VPNs and proxies). Finally, we map users’ names to
the extensions’ users is obviously not available, the majority             their gender, and discard ambiguous names associated with
of reviews include the user’s name.                                        both male and female. Here we only need to set a prevalence
                                                                           threshold for deciding which extensions are useful for this type
    In practice, users can only review an extension in the                 of inference; e.g., depending on the scenario, an attacker might
Chrome Store after they have installed it in their browser. More           consider any extension where one gender accounts for at least
importantly, the reviewers’ names that appear in the reviews               80% of the users as sufficient confidence.
are actually the names from the users’ Google accounts and
not an arbitrary input provided by users at the time of the                     V.   E XPERIMENTAL E VALUATION : F INGERPRINTS
review. Furthermore, while in the past reviews could either
be anonymous or include the user’s name, the anonymous                          Extension enumeration. We run Carnus on a collection
option is no longer allowed (in our dataset we find that                   of 102,482 extensions and find that 29,428 unique extensions
only 5.25% of the reviews are anonymous). While this lends                 can be identified by our system. We find that WAR-based
considerable veracity to our dataset, the inferred information             fingerprints can detect 25,866, of which 23,046 cannot be iden-
can be misleading if a Google account’s name is a pseudonym.               tified through other techniques. Behavior-based fingerprints
Reviews with nicknames or fictional names that do not match                are the next most effective approach with 5,793 detections,
entries in our name lists (described below) are discarded, but             of which 2,998 are not detectable otherwise. Through inter-
fake accounts that use actual names will still be used in our              communication patterns we detect 859 extensions and through

                                                                       8
                                                                                                   40                                                                        100
                      100
                                                                                                   35

                                                                                                   30                                                                        80
                      80




                                                                                  Detectable (%)
                                                                                                   25




                                                                                                                                                          Extensions (CDF)
   Extensions (CDF)




                                                                                                   20                                                                        60
                      60

                                                                                                   15
                                                                                                                                                                             40
                      40                                                                           10

                                                                                                   5
                      20                                                                                                                                                     20
                                                                                                   0




                                                                                                                 K

                                                                                                         20 K

                                                                                                         30 K

                                                                                                         40 K

                                                                                                         50 K

                                                                                                         60 K

                                                                                                         70 K

                                                                                                         80 K

                                                                                                        90 0K

                                                                                                                3K
                                                                                                              10

                                                                                                              20

                                                                                                              30

                                                                                                              40

                                                                                                              50

                                                                                                              60

                                                                                                              70

                                                                                                              80

                                                                                                              9

                                                                                                             10
                                                                                                           1-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-

                                                                                                           K-
                       0                                                                                                                                                      0




                                                                                                          K-
                                                                                                         10
                        100    101     102   103      104    105   106   107                                                                                                   100   101    102         103   104
                                             Installations                                                    Popularity (based on installations)                                          Fingerprint size


Fig. 2: Number of installations for all the Fig. 3: Correlation of detectability of ex-                                                                Fig. 4: Extensions’ behavioral fingerprint
extensions in our dataset.                  tensions and their relative popularity.                                                                    sizes. The blue lines denote where our
                                                                                                                                                       mismatch thresholds change.



                              TABLE II: Comparison to previous studies.                                                         number of installations of each extension and find that there is
                                                                                                                                a clear correlation, as more popular extensions have a higher
  Paper                            Attack                    Platform      Extensions                   Detectable              likelihood of being detectable by Carnus.
         [52]                 Behavioral (DOM)               Chrome          10,000                        920*
                                                             Chrome          43,429                      12,154
                                                                                                                                    Furthermore, for the extensions that modify the page’s
         [47]                          WAR                                                                                      contents, we find that 5,119 out of the 5,793 (88.36%) exten-
                                                              Firefox        14,896                       1,003
         [24]                          WAR                   Chrome          13,000                       5,107                 sions always perform the same modifications (i.e., they have a
         [44]                 WAR side-channel
                                                             Chrome          10,620                      10,620                 single behavioral fingerprint). For the extensions that exhibit
                                                              Firefox        10,620                      10,620                 more than one behaviors, we find that 177 (3.05%) have two
                                                             Chrome          10,459                      1,932**                different fingerprints (i.e., the three runs produce two identical
         [46]                  WAR revelation
                                                              Firefox         8,646                       1,379
  Ours                               Multi-class             Chrome         102,482                      29,428
                                                                                                                                fingerprints and one that is different from the other two) and
                                                                                                                                497 (8.57%) extensions that have three different fingerprints.
Note: We convert to absolute numbers when the original work reports                                                             Figure 4 presents the size of the behavioral fingerprints of the
percentages. *Estimation based on detectable changes to DOM tree; signatures                                                    extensions in our dataset. For the extensions that have more
were not created or tested. **Number estimated by authors since the presented                                                   than one fingerprints, in Figure 4 we consider the extension’s
attack relies on random UUIDs which have not been deployed by Chrome yet.                                                       fingerprint with the largest size. We find that more than half
                                                                                                                                of the extensions (54.6%) have a small fingerprint (up to
                                                                                                                                10 terms), revealing that extensions typically do not heavily
                                                                                                                                modify pages. Around 26% have fingerprints of 10 to 50
intra-communication we detect 450; the number of extensions                                                                     terms, while 19.5% have fingerprints larger than 50. Finally,
that cannot be detected by other means is 181 and 105                                                                           less than 4% of the fingerprints contain more than 1K terms;
respectively. The number of extensions that can be detected                                                                     these extensions inject entire scripts, like extension UUID:
by each one of the four techniques are summarized in Table I.                                                                   ohahllgiabjaoigichmmfljhkcfikeof, or CSS files, like
While our two new communication-based techniques detect a                                                                       UUID: ngkinkknobojamikjhodnojnpkbgpddp.
smaller number of extensions, this is because such behavior
is less common among extensions and not due to limitations                                                                          Practical extension enumeration. While detecting a stan-
of our fingerprint-generation process. Furthermore, these two                                                                   dalone extension is a fairly straightforward task, we are also
techniques are able to detect extensions that are not detectable                                                                interested in evaluating our system’s extension enumeration
by previously known techniques.                                                                                                 capabilities when multiple extensions are simultaneously in-
                                                                                                                                stalled, as would be the case in a realistic scenario. We setup
    Next, in Table II we compare to prior work and find that                                                                    an experiment where our system randomly selects and installs
our system has created the largest set of detectable extensions                                                                 K fingerprintable extensions from our dataset and visits our
to date. Most of these studies [24], [44], [46], [47] focused on                                                                honeysite. We only use fingerprintable extensions since non-
detecting extensions through exposed WARs (either directly or                                                                   fingerprintable extensions do not affect detection or interfere
through some indirect/side channel) – we statically analyzed                                                                    with other extensions in any way, and using them would
over 102K extensions to create the most complete collection                                                                     artificially boost our true positive rate. As such, this experi-
of Chrome extension WAR fingerprints. More importantly, we                                                                      ment truly explores the challenge of extension enumeration in
create the first collection of automatically generated behavioral                                                               practical settings, and is the first to shed light on the intricacies
extension fingerprints, which enable our novel analysis and                                                                     of behavioral-based extension fingerprinting.
evaluation of their deployment in a realistic setting.
                                                                                                                                    Table III presents the results of this experiment; we cal-
    Figure 2 presents the number of installations for the                                                                       culate scores over 100 independent runs for each size of K,
102,482 extensions in our collection. Around 43% of the                                                                         where in each run K extensions are randomly installed. TP
extensions have more than 100 installations, while around                                                                       refers to correctly detected extensions, FP denotes extensions
20% of them have been installed more than 1000 times. In                                                                        incorrectly detected as installed, and FN is installed extensions
Figure 3 we compare the detectability of extensions with their                                                                  that our system could not detect. Since Carnus can detect more
popularity. We calculate their relative popularity based on the                                                                 extensions than those that are actually installed, the TP+FP

                                                                                                                           9
TABLE III: Carnus’ accuracy in multi-extension environments.                   behavior-based fingerprints. We refer the reader to their paper
                                                                               for the full details behind their proposed countermeasure but, in
              2      3      4      5      6      7      8      9     10        a nutshell, their system randomizes the values of ID and class
  TP (%)   97.5     97     98   98.6   98.5   97.6   98.9   97.5   98.9        attributes to prevent behavior-based detection. They also inject
  FP (%)    0.5      4   7.25    5.4    6.2    6.7    3.4      7    2.5        random tags, attributes, and custom attributes into each page,
  FN (%)    2.5      3      2    1.4    1.5    2.4    1.1    2.4    1.1        and randomize the path of web-accessible resources. As such,
  F1 (%)   98.5   96.5   95.5   96.7   96.3   95.5   97.8   95.4   98.2
                                                                               we analyze our behavioral fingerprints and quantify the effect
                                                                               of their proposed countermeasure on our system.
percentages can add up to more than 100%, e.g., if the user                        Since CloakX randomizes ID and class attributes, we first
has 4 extensions installed but our system returns 5 detected                   quantify the effect of removing all such ID and class element
extensions. An important detail is that certain extensions have                additions from the behavioral fingerprints. We find that the
the same functionality, perform the same modifications and                     fingerprints of 2,790 (48.16%) extensions do not rely on such
have identical fingerprints. This can occur because developers                 elements and are thus not affected by the proposed defense.
publish multiple instantiations of the same extension (e.g., in                Out of the remaining fingerprints, we find that 751 (12.96%)
different languages). For example, the extensions “TinyFilter                  are affected in a way that would prevent uniquely identifying
PRO”, “Tiny WebFilter” and “WebFilter FREE” are offered by                     the extensions. When we also consider our communication-
the same developer and have the same functionality. Similarly,                 based fingerprints, 51 of these 751 extensions can be identified.
extensions like ad-blockers exhibit essentially the same func-                 Thus, 5,093 (87.92%) extensions are not affected by this
tionality can be indistinguishable. We find that 349 extensions                countermeasure.
are affected by such ambiguous fingerprints, which is less
                                                                                    To prevent WAR-based detection CloakX replaces exten-
than 5.5% of the extensions that are fingerprintable through
                                                                               sions’ WAR paths with a randomized value. While this coun-
our behavioral techniques. In the table we do not count the
                                                                               termeasure is effective against WAR-based detection, it does
additional labels of extensions with identical fingerprints as
                                                                               not affect our behavior-based detection. When a WAR URL
false positives. For instance, in the aforementioned example,
                                                                               (i.e., chrome-extension://<UUID>/<path>) is included
the three identical extensions will be considered as one label
                                                                               in the extension’s behavioral fingerprint, CloakX can only
when calculating the FP rate.
                                                                               randomize the resource’s path and not the UUID. Thus, we can
    As shown in Table III, our system correctly identifies ∼97-                discard the randomized path from the behavioral fingerprint,
99% of the installed extensions in all cases, indicating the                   as shown in the last example in Listing 5, and the fingerprint
consistent accuracy of our system. The extensions that Carnus                  will still be unique among all our behavioral fingerprints.
misses (i.e., FN: ∼1-3%) are extensions that perform new                           Regarding the effect of tags and attributes being randomly
modifications for which we do not have a fingerprint or are the                added by CloakX, this can be counteracted using Carnus’s
result of extension co-interference. After analyzing our results               mechanism for detecting and removing dynamic content from
we found that the main reason behind these false negatives is                  the fingerprints. Specifically, by visiting our honeysite multiple
the co-interference between the installed extensions, where the                times during the fingerprint generation, our system can detect
modifications of one extension can affect the modifications of                 which added terms remain the same across visits and which
the other. This co-interference can also cause false positives,                ones change. For the extensions that have only one behavioral
as the combined effect of multiple extensions can result in                    fingerprint in our database3 Carnus can safely filter out the
matching the fingerprint of an extension that is not installed                 randomly added artifacts, without affecting the extensions’
in the user’s browser. Another reason for false positives is                   fingerprints. To that end, from the 5,093 extensions that our
that Carnus allows certain mismatches when comparing finger-                   system can identify after removing the fingerprints with ID
prints, which can lead to misclassifying extensions that have                  and class attributes, we end up with 4,800 extensions that
similar fingerprints and whose differences fall within the range               have only one fingerprint in our database (313 of them were
of allowed mismatches. The FP rate is less consistent, with an                 re-written to remove dynamic parts of partially matching
average of 4.77% across all values of K. If we do include                      terms). From the 293 extensions that have fingerprints that
the labels of multiple identical extensions as false positives                 could potentially be affected by CloakX randomly adding
(e.g., in the previous example 2 of the 3 identical extensions                 tags and attributes, 250 do not have any communication-based
would count towards the false positives) our average FP rate                   fingerprints. Even though the random tags added by CloakX
across all sizes of K becomes 8.1%. Nevertheless, despite the                  to the fingerprints of these 250 extensions can most likely be
challenging nature of behavior-based fingerprinting in practice,               identified and removed with a sufficient number of visits to our
our system is highly accurate with an F1 score of 95.4-98.5%.                  honeysite, in the worst case scenario where our system is not
    Countermeasure effects. Trickel et al. [55] recently pro-                  able to remove the added tags and attributes for any of these
posed CloakX as a defense against extension fingerprinting.                    250 extensions, 4,843 out of the 5,793 (83.6%) extensions that
While their approach is obviously not effective against our                    have behavioral fingerprints will remain unaffected. Overall,
inter- and intra-communication fingerprints, we want to quan-                  Carnus will be able to uniquely identify 83.6% - 87.92% of
tify its effectiveness against our other behavior-based finger-                the extensions that have behavioral fingerprints even if CloakX
prints that fall within their threat model. In that work, they sep-            is deployed.
arate behavior-based fingerprints into two different categories,                  3 This includes extensions that always perform the same modifications, and
namely anchorprints and structureprints. However, since our                    extensions with fingerprints that differ only because of partially matching
behavior-based fingerprints cover both of their categories, for                terms, which our system re-writes into a single fingerprint after discarding the
ease of presentation we will continue to refer to them as                      dynamic part of the partially matching terms, as explained in Section III-B.


                                                                          10
                                                                                      103                                                                                              Interests/preferences
    System performance. As discussed in Section III, during                                                                                                                            Sensitive information
the fingerprint generation phase our system visits our honeysite




                                                                         Extensions
                                                                                      102
with a single extension installed and captures all the modifica-
tions, message exchanges, and resource fetching conducted by                          10
                                                                                           1
the extension. Carnus waits for 15 seconds before capturing the
contents of the page and generating the behavioral fingerprints,                      100      Jo                Be                    Sp         Ho                Tr          Fa               Ne                  He           Re
                                                                                                 bs                 a                    or          b                 a           m                ws                  al          lig
so as to allow enough time for all the modifications to take                                          &
                                                                                                          Ed
                                                                                                                        ut
                                                                                                                          y
                                                                                                                              &
                                                                                                                                             ts       bi
                                                                                                                                                         es
                                                                                                                                                                         ve
                                                                                                                                                                            l       ily
                                                                                                                                                                                          &            /P                    th           io
                                                                                                                                                                                                                                            n
                                                                                                                                                              &                               Re          o   liti
place and the external resources to be fetched. The processing                                               u                    Fa                              Le                                               cs
                                                                                                              ca                    sh                                                           lat
                                                                                                                  tio                   io                           isu                             io
                                                                                                                     n                    n                                re                          ns
for generating the fingerprints (i.e., constructing the sets of                                                                                                                                          hi
                                                                                                                                                                                                              ps
added and removed terms) takes less than 1 second. Since                                                                                                 Categories
each extension needs to be dynamically analyzed 3 times, we              Fig. 5: Categories of extensions that reveal personal and
parallelize 3 different browser instances and the overall time           potentially sensitive information.
that is spent for exercising each extension during the dynamic
analysis phase does not exceed 16 seconds. This process is
performed once per extension and only repeated if a newer
version of an extension is released; given the low overhead it           categories that better describe each extension. This allows us to
is more than suitable for practical large scale deployment.              classify 20,409 of the extensions in our dataset; the remaining
                                                                         9,019 extensions could not be assigned to any category, mainly
    A more critical dimension of a fingerprinting system’s               due to them having a very short description text.
performance is the time required for the extension detection
phase. During our implementation, our goal was to minimize                   As one might expect, the most popular category is that
the overhead that our system imposes on the client side and,             of Computing (subclasses: Multimedia, Programming, Internet
thus, minimize the time a user needs to stay on our website for          Software, etc.) with 7,652 extensions. The next most popular
Carnus to detect her installed extension. For this, we offload           category is related to Social Networks with 4,977. While such
all the processing for behavior-based detection to the server,           categories do not reveal any information that is interesting
which includes matching the modification and communication               from a privacy perspective, there are, however, other categories
signatures with the stored extensions’ fingerprints etc. The             that reveal more personal information. In Figure 5 we present
JavaScript code in our page that is responsible for the WAR-             the main such categories and distinguish between those that
based detection, obviously, needs to run on the client side.             reveal important but non-sensitive information (e.g., the user’s
                                                                         interests) and those that reveal sensitive information such as a
    To assess this aspect of our performance, we conduct exper-          user’s health conditions, religion and political views.
iments using an off-the-shelf commodity desktop machine with
a Quad Core Intel i7-7700 and 32GB of RAM. Specifically, we                  For instance, in the Health category we can find extensions
automate a browser instance that has 4 extensions installed to           such as UUID: knijgomkfcdigmbogcnffcbfgmapmkca,
visit our honeypage. We then measure the time that is required           which is designed to assist people with dyslexia, and UUID:
for processing to complete both on the client and server side.           edmpbiamnlgdichailkadlagmbklhbpk, which allows users
We run this experiment 300 times with a different set of 4               to compare their own images to visually similar skin cancer
randomly-selected extensions installed each time. The client             images on the web. In the Religion category there are exten-
side processing requires 8.77 seconds on average (stdev: 0.39),          sions like UUID: ndmbeogingkjkmmkoomnigifmpajmbkc
with a median value of 8.58 seconds. The server only requires            and UUID: apkkllhahggfkhfdlmpopcncnaiclfdm, which
3.62 seconds on average (stdev: 1.83), with a median of 2.94             expose the user’s religion.
seconds. In other words, since the backend processing is not                  Our classification results in assigning 838 extensions to the
dependent on the user remaining on the page, Carnus requires             Jobs & Education category, which is the most prominent one,
the user to stay on our honeysite for less than 10 seconds to            and 46 to the Family & Relationships category, which is the
successfully detect the installed extensions. This highlights the        least common one among the less-sensitive categories. For the
efficiency of our attack and its practicality in deployment in           most sensitive categories of News/Politics, Health and Religion
realistic scenarios. To examine whether the number of installed          our classification results in 238, 121 and 105, respectively (the
extensions affects the processing time that is required, we              list of extensions in these categories is available online [5]). To
repeat the experiment with 5 extensions being installed, and             assess the accuracy of the classification we randomly chose 50
find that the average duration remains essentially the same.             extensions from each one of the three sensitive categories, and
                                                                         manually checked if they were assigned to the correct category
      VI.   E XPERIMENTAL E VALUATION : I NFERENCE                       or not. Through this manual process we found the accuracy of
                                                                         the classification to be 100%, 86% and 80% for the respective
    While extension enumeration can be used as part of the               categories of News/Politics, Health and Religion.
browser fingerprinting process, the set of detected extensions
can also be used to infer sensitive information about that                   Ethnicity inference. Next we analyze our fingerprintable
user, which could enable or facilitate a wide range of privacy-          extensions and calculate the Shannon-Weiner index (SWI) of
invasive practices, from government surveillance of religious            the ethnicities inferred based on the names of the reviewers.
minorities [7] to tailored advertising that targets sensitive            Since this index incorporates both the richness and evenness
topics [16], [34] (e.g., health issues).                                 of the population (i.e., reviewers’ ethnicities), we found that
                                                                         for extensions with a fair number of reviews, a threshold of
    Extension classification. The first phase of our inference           3.5 is sufficient to indicate whether an ethnicity is prevalent;
attack uses Google’s Natural Language API for identifying the            in practice attackers can fine-tune this threshold based on their

                                                                    11
requirements. Our analysis shows that this technique can iden-            refers to locations and nationalities. By matching the detected
tify 12,754 (43.33%) extensions with a prevailing ethnicity. To           entities with the ethnicities and countries in our list, we were
further increase our confidence, if we only consider extensions           able to automatically verify 1,945 extensions. Since our list
that have been installed by at least 500 users and have reviews           does not contain region/city names, we manually inspected
by at least 20 different users, 2,593 extensions can be used for          the remaining entities and found 315 additional extensions
this type of inference.                                                   with descriptions that include information that could reveal
                                                                          the user’s location or nationality. However, in our analysis
    As this approach is topic agnostic, i.e., does not rely               we do not consider any entities that can reveal information
on the extensions’ description or type functionality, it en-              but require region-specific knowledge by the attacker (e.g.,
ables the inference of information that is well hidden and,               UUID: cgdogkoldofookodmiipcakaejpgocgc). In total,
practically, unavailable. For example, the “FlashSaleTricks”              this approach led to the identification of 2,260 extensions.
extension (UUID: bboalniaekhennojedffbbjlokcpbjgn )
has a Shannon-Weiner index of 2.62. The language of that                      Next, by using our name-lists we map the names of the
extension, and the text of its description, is English, but Indian        reviewers of each extension to their gender, and calculate the
names are predominant in its reviews. By checking its website             percentage between male and female. We find that for 1,448
(https://www.flashsaletricks.com/) we found that it indeed tar-           extensions the percentage of one gender over the other exceeds
gets Indian users. An interesting case is that of the “Download           80%, which in many cases is sufficient to determine the gender
Master” (UUID: dljdacfojgikogldjffnkdcielnklkce),                         of the users that have the extension installed in their browser.
which appears to be popular among Russian users (SWI=3.47).
While this extension is in English, we found that upon in-                    Since Google’s API cannot classify all the detectable
stallation it downloads additional software that is in Russian.           extensions, as some of them have a very short description text,
Similarly, while the description of the “J2TEAM Security”                 we opt for another approach that could identify extensions that
extension (UUID: hmlcjjclebjnfohgmgikjfnbmfkigocc)                        reveal sensitive information. Thus, we use publicly available
is in English, the majority of its reviewers are Vietnamese               wordlists [17] of religious and medical terms, and search for
(SWI=3.21). In another example, the “wanteeed” extension                  those terms in the extensions’ description text. For this task
(UUID: emnoomldgleagdjapdeckpmebokijail), with an                         we first discard certain terms in the wordlists’ terms that are
index of 3.29, is shopping-related and is popular with French             generic or have multiple meanings (i.e., the terms virus and
predominantly female users (2.9x more female names).                      infection have a different meaning in the context of the Web),
                                                                          as they could lead to many false positives. This straightforward
     Sensitive information inference. To further understand               approach of matching terms returned 73 extensions that are
what type of information can be inferred from the presence                related to religion and 70 that are health related. We manually
of specific extensions, and which extensions reveal such in-              inspected these extensions and found that indeed 58 (79.45%)
formation in practice, we investigate whether the languages of            of the former ones reveal the user’s religion. For the latter we
an extension can be used for characterizing the user. To that             found that 62 extensions are related to health (88.57%) and that
end, we collected the languages that are supported by each                49 of these (70%) reveal health conditions. The remaining 13
extension from the Chrome Web Store. We find that 24,392                  extensions are for physicians or web developers (e.g., to help
(82.88%) of the extensions only support a single language,                them build websites that are suitable for colorblind users).
and that 5,425 of them (18.43% of detectable extensions) are
in a language different from English while 4,623 (15.7%) have                 We also created a wordlist with political terms and used it
English (United States) as their language. Moreover, for exten-           to identify extensions that could possibly reveal the political
sions that support multiple languages we find that 1,747 out of           inclination of the user. Intentionally, we keep this wordlist
4,983 support 4 or less languages. Extensions with an extensive           short, only containing terms that clearly refer to politics (such
list of languages cannot, in practice, provide any insights about         as Democrats, Republicans, Liberals, Conservatives, Donald
the user. Finally, apart from the extensions’ languages that are          Trump, Hillary Clinton, Obama, UKIP, Brexit, etc.). With
listed in the Web Store, 3,922 (13.32%) extensions have a                 this wordlist we matched 340 extensions, and though manual
description in a language other than English, which indicates             inspection we found that indeed 323 (95%) are related to
that those extensions target a specific language-speaking popu-           politics and that 307 of them (90.29%) provide insights about
lation. While extensions that are exclusively in English cannot           the user’s political inclination.
be used for determining the origin of the user, most of the
other languages can provide strong indications about the user’s               Overall statistics. To have a more complete view regarding
ethnicity, country or residence/origin. Our analysis identified           the extensions that reveal sensitive information about politics,
a total of 7,552 (25.66%) non-English extensions that reveal              health and religion, we combine the results of the classification
the language of the user.                                                 with the results of the wordlist-based approach (only the
                                                                          extensions that we manually verified as TPs from the wordlist-
    To further explore what sensitive information can be in-              based approach) This results in 387, 147 and 116 extensions
ferred from extensions, we conduct a more in-depth analysis               that reveal information about the user’s political inclination,
on the extensions’ description text. First, we use spaCy’s                health and religion, respectively. Furthermore, we find that
Named Entity Recognition (NER) [20] to identify entities in               these extensions have been installed 406,869, 1,177,573, and
the extensions’ description that expose information regarding             885,923, times respectively, highlighting the extent of this
the user’s location, nationality or language. Next, we compile            significant privacy threat. If we consider all the categories from
a comprehensive list of mappings between countries and                    Figure 5, since even less sensitive categories are useful for
ethnicities, from online sources, and use it to automatically             privacy-invasive practices like targeted advertising, the total
cross-match and verify that the inferred information indeed               number of installations exceeds 59 million.

                                                                     12
                     100                                                                                      100                                                         10
                                                                                                                                                                            6

                                                                                                              90
                     80                                                                                       80                                                          105
                                                                                                              70
                                                                                                                                                                          104
       Users (CDF)




                                                                                                Unicity (%)
                                         100
                     60                                                                                       60




                                                                                                                                                                                Users
                                         99.8
                                                                                                              50                                                          103
                                         99.6
                     40                                                                                       40
                                         99.4                                                                 30                                                          102

                     20                  99.2                                                                 20
                                                                                                                        Unicity                                           101
                                          99                                                                  10
                                                     5   10   15   20   25     30                                        Users
                      0                                                                                        0                                                          100
                           1                    10                           100                                    1    2        3   4       5     6       7   8   9   10
                                       Number of Reviews (log)                                                                            Set Cardinality

                           Fig. 6: Number of reviews per user.                           Fig. 7: Unicity of fingerprintable extension sets of different
                                                                                         size, and the corresponding size of the anonymity crowd.


    Furthermore, when considering all the above approaches
for the inference of sensitive user information, from the name-                          being uniquely identifiable. When comparing to the numbers
based ethnicity and gender inference to the identification of                            reported in [24] we find that our unicity results are higher for
the user’s language, religion, political inclination etc., we find                       K < 4, which can be attributed to the significantly larger
that 18,286 (62.13%) of the detectable extensions reveal such                            number of users in our study. In practice, the number of
pieces of sensitive information. 15,996 of all these extensions                          extensions installed per user will likely be higher than their
can be identified through WAR and 14,042 of them cannot                                  number of reviews (i.e., users are unlikely to write a review for
be identified through other techniques. Behavior-based finger-                           all their extensions) which could further increase their unicity.
prints can identify 3,879 such extensions, of which 1,916 are                            Nonetheless, due to our larger number of users and larger set
not detectable otherwise. Lastly, 617 and 240 extensions can be                          of detectable extensions, we believe that our study offers a
identified through inter- and intra-communication fingerprints,                          more accurate representation of the discriminatory power of
and 134 and 52 cannot be detected by other means.                                        browser extensions. Our findings also highlight the significant
                                                                                         privacy risk that any type of public data can introduce, even
    De-anonymization attack. Next we focus on the unique-                                something as innocuous as extension reviews.
ness of fingerprintable extensions for quantifying their suitabil-
ity for identifying users solely based on their set of extensions.
                                                                                                              VII.        D ISCUSSION AND F UTURE W ORK
While prior studies explored how users could be uniquely
tracked within an anonymous crowd, we demonstrate a more                                     Ethical considerations. The techniques presented in this
powerful attack that can infer the reviewer’s name based on                              paper present a severe privacy risk to users. However, it is
the uniqueness of their set of extensions. For our analysis we                           important to note that we do not actually run our attacks against
only use eponymous reviews, which also include a unique user                             any users. Our attacks are based on the analysis of extension
ID – this removes the obstacle of users with identical names                             characteristics and our goal is to explore what sensitive infor-
(the number of reviews per user in our dataset is presented in                           mation can be inferred from the presence of such extensions.
Figure 6). While we do not attempt to actually de-anonymize                              During our experiments we did not attempt to correlate any
any users, in practice attackers could use the name and profile                          extracted traits/characteristics to users. Furthermore, the review
picture to discover even more information about the user [37].                           analysis process relies on aggregate statistics regarding names
Users can also be trivially matched to their reviews in other                            collected from publicly available reviews from Chrome’s Web
Google services (e.g., business, restaurants, etc.) which can                            Store. The unicity measurements leverage reviewers’ unique
lead to the inference of additional personal data. We want to                            IDs for associating users with installed extensions, and does
emphasize that our de-anonymization attack is, obviously, only                           not take into account or get correlated to any actual user infor-
applicable to users that have written reviews for extensions;                            mation. We have deleted all collected reviews after running our
for other users the attacker would be limited to anonymous                               experiments. We believe that our findings provide significant
tracking as in prior studies.                                                            additional incentives for browser vendors to adopt defenses
                                                                                         that have been recently proposed by the research community.
    We implement the unicity formula proposed by Achara et                               Apart from extension enumeration techniques enhancing the
al. for calculating the uniqueness of smartphone apps [9], and                           uniqueness of a browser’s fingerprint, our inference techniques
use it to calculate the probability that a randomly selected                             mandate a reassessment of the extension ecosystem and the
subset of extensions with cardinality K is unique within our                             threat it poses to users, and motivate a more cautious approach
dataset of users. Prior work [52] reported that users had an                             to installing extensions.
average of 4.81 extensions, so we calculate the unicity for
cardinality values of K = 1, . . . 10, as shown in Figure 7.                                 Countermeasures. As demonstrated by our experimental
Surprisingly, we find that even when an attacker is able to                              evaluation, the countermeasure proposed by Trickel et al. [55]
only detect 2 extensions in a user’s browser, there is a 77.5%                           is ineffective against the vast majority of our behavioral
chance of uniquely identifying the user within a set of almost                           fingerprints. Two other studies [46], [50] recently proposed
84 thousand users. As one would expect, as the cardinality                               whitelist-based countermeasures for mediating access between
increases so does the probability of uniquely identifying the                            extensions and web pages, and a similar approach has been
user. When assuming that 4 extensions have been detected,                                announced by Chrome [6]. These mechanisms can potentially
9,286 users are candidate targets with a 94.5% probability of                            reduce the fingerprint surface exposed to certain domains,

                                                                                    13
but the ones that users whitelist will still be able to run the            hardware [13], [33], [40], [41]. More recently several studies
attacks we demonstrated. While giving more control to users                have focused on the fingerprintability of browser extensions,
is a positive development, site-blocking mechanisms that rely              which were also the focus of several blog posts by security
on user configurations for setting policies can lead to user               researchers in the past [14], [23], [29], [30]. Sjosten et al. [47]
confusion [35] and may be too challenging for average users.               presented the first large-scale study and demonstrated how
Nonetheless, while more research is needed to fully prevent ex-            extensions expose WARs which allow websites to identify
tension fingerprinting attacks, we believe that these approaches           and enumerate the extensions installed in a user’s browser.
are important steps towards better protecting users and should             At the same time Starov and Nikiforakis [52] proposed the
be incorporated by browsers. While designing an effective                  use of DOM modifications as behavior-based fingerprints
countermeasure is out of the scope of this work, we believe                for extensions. They also conducted a user study with 854
that a technique that introduces innocuous (or imperceptible               participants and found that 14.1% of them had distinct sets
to the user) behavioral activity that results in the behavioral            of extensions that could be detected by any website, thus,
fingerprints of extensions resembling the fingerprints of other            uniquely identifying them. More recently, Gulyas et al. [24]
extensions is an interesting future direction.                             conducted a large user study with more than 16 thousand
                                                                           participants and, using the fingerprinting technique from [47],
    Classification and information extraction. We mainly                   found that 54.86% of users were uniquely identifiable based
rely on the description text of the extensions for identifying             on their installed extensions. An alternative approach that
each extension’s topic and the sensitive information that can              relied on a timing-based side-channel attack was proposed
be possibly inferred. However, since there are no guidelines               by Sanchez-Rola et al. [44]. The core of their attack relies
mandating the content and structure of the descriptions, these             on the access control mechanism enforced by browsers to
are determined solely by the developer of the extensions and               prevent unauthorized access of extension resources that have
are typically very inconsistent. Even though we developed a                not been explicitly labeled as public, which implicitly reveals
pre-processing method, we cannot remove all text that can                  the existence (or absence) of a specific extension. A variation
possibly affect our classification results. As such, we plan               of their time-based attack was presented by Van Goethem and
to investigate more advanced techniques for identifying the                Joosen [56] as part of their exploration of fingerprinting attacks
relevant content, extracting the topic, and inferring sensitive            that can link users’ isolated browsing sessions.
user information (e.g., machine learning classifiers that take
all extensions into account and detect more complex patterns).                 Apart from the fingerprintability of extensions, prior work
                                                                           also explored one dimension of privacy leakage due to exten-
    Supplementary identity sources. We demonstrated how                    sions. Motivated by the seminal work of Krishnamurthy and
attackers could leverage extension reviews as a potential source           Wills on privacy diffusion on the web [31] and leakage in
for inferring a user’s identity. In practice, users leave behind an        request towards third parties [32], Starov and Nikiforakis built
abundance of digital “breadcrumbs” that result in privacy loss.            a dynamic analysis framework that detected the leakage of
These can be correlated [22] to further amplify the attack’s               information (e.g., browsing history and search queries) from
effect. An adversary could also potentially augment the dataset            Chrome extensions to third parties [51]. Recent studies also
of user reviews with reviews from other domains, namely                    demonstrated in different contexts how publicly available data
mobile apps. By automatically mapping specific browser ex-                 could enable the inference of sensitive data [17] or lead to the
tensions to the corresponding mobile apps (e.g., the Skype                 de-anonymization of users [54].
Chrome extension to the Skype Android app) an attacker can
use the additional reviews from other platforms to create more                                   IX.   C ONCLUSIONS
complete user profiles. Apart from using the name and images
as identifiers, stylometric techniques [11], [43] can be used for              With browser vendors incorporating countermeasures
correlating users across platforms.                                        against cookie-based tracking, user tracking techniques that
                                                                           rely on browser fingerprinting are becoming increasingly
    Review analysis. During our inference attack analysis all              prevalent. As a result, modern browsers have recently intro-
available reviewers are considered as part of the user set for             duced (or announced) mechanisms for mitigating the effect
each extension regardless of the score that they have assigned.            of such techniques. Nonetheless, recent research has exposed
This provides a lower bound estimation of unicity as it could              vulnerabilities in those countermeasures and have also pro-
inflate the size of the user sets, which reduces the “uniqueness”          posed additional countermeasures. In this paper we presented
of that extension. A more conservative approach is to use a                the largest study on the unicity of extension fingerprints to date
heuristic based on the review score for assigning a user to                and revealed their discriminatory effect in real-world settings
the set of users that have installed that extension. However,              – apart from enabling attackers to uniquely identify a device
users that have given a low rating may still continue to use               and track users, we outlined a de-anonymization attack that
that extension. As such, we plan to explore more sophisticated             leverages publicly available extension reviews for revealing the
NLP-based techniques for identifying cases where users im-                 user’s identity. We also conducted the first study detailing how
plicitly reveal that they have uninstalled a given extension.              attackers can infer sensitive or personal user information from
                                                                           detected extensions. The practicality of our attacks is high-
                   VIII.    R ELATED W ORK                                 lighted by our comprehensive exploration of multiple extension
                                                                           fingerprinting techniques (including two novel approaches) and
    Browser fingerprinting [18] has garnered significant at-               their evaluation under practical settings. Our experimental eval-
tention from the research community, and prior work has                    uation also demonstrated the robustness of our fingerprinting
demonstrated the feasibility of several techniques that focus              techniques against state-of-the-art countermeasures proposed
on different browser aspects of the browser and underlying                 by the research community, thus motivating the need for

                                                                      14
additional research for potential countermeasures. Overall, we                         [17]   K. Drakonakis, P. Ilia, S. Ioannidis, and J. Polakis, “Please forget where
hope that our research sheds more light on the risks users face                               i was last summer: The privacy risks of public location (meta)data,” in
and leads users to a more critical view of extensions.                                        26th Annual Network and Distributed System Security Symposium. The
                                                                                              Internet Society, 2019.
                                                                                       [18]   P. Eckersley, “How unique is your web browser?” in Proceedings of
                                                                                              the 10th International Conference on Privacy Enhancing Technologies,
                         ACKNOWLEDGMENTS                                                      ser. PETS’10, 2010.
    We would like to thank the anonymous reviewers for                                 [19]   S. Englehardt and A. Narayanan, “Online tracking: A 1-million-site
                                                                                              measurement and analysis,” in Proceedings of the 2016 ACM SIGSAC
their valuable feedback. Special thanks to our shepherd Adam                                  Conference on Computer and Communications Security. ACM, 2016,
Doupé for all his help. This work was supported by the                                       pp. 1388–1401.
DARPA ASED Program and AFRL (FA8650-18-C-7880), and                                    [20]   Explosion AI, “spacy: Industrial-strength nlp,” https://spacy.io/, 2019.
NSF (CNS-1934597). Any opinions, findings, conclusions, or                             [21]   K. Garimella, O. Kostakis, and M. Mathioudakis, “Ad-blocking: A study
recommendations expressed herein are those of the authors,                                    on performance, privacy and counter-measures,” in Proceedings of the
and do not necessarily reflect those of the US Government.                                    2017 ACM on Web Science Conference, ser. WebSci ’17, New York,
                                                                                              NY, USA, 2017, pp. 259–262.
                                                                                       [22]   O. Goga, H. Lei, S. H. K. Parthasarathi, G. Friedland, R. Sommer, and
                              R EFERENCES                                                     R. Teixeira, “Exploiting innocuous activity for correlating users across
                                                                                              sites,” in Proceedings of the 22Nd International Conference on World
 [1]   “Chrome Developer Guide - Content Scripts,” https://developer.chrome.                  Wide Web, ser. WWW ’13, 2013, pp. 447–458.
       com/extensions/content scripts, accessed on 2019-12-30.                         [23]   J. Grossman, “I know what you’ve got (firefox extensions),”
 [2]   “Chrome Developer Guide - Manifest - Web Accessible Resources,”                        http://blog.jeremiahgrossman.com/2006/08/i-know-what-youve-got-
       https://developer.chrome.com/extensions/manifest/web accessible                        firefox.html, 2006, accessed on 2019-12-30.
       resources, accessed on 2019-12-30.                                              [24]   G. G. Gulyas, D. F. Some, N. Bielova, and C. Castelluccia, “To
 [3]   “Chrome Developer Guide - Message Passing,” https://developer.                         extend or not to extend: on the uniqueness of browser extensions and
       chrome.com/extensions/messaging, accessed on 2019-12-30.                               web logins,” in Proceedings of the 2018 Workshop on Privacy in the
 [4]   “Google Cloud - AI & Machine Learning Products - Natural Language,”                    Electronic Society. ACM, 2018, pp. 14–27.
       https://cloud.google.com/natural-language/, accessed on 2019-12-30.             [25]   M. A. Hearst, “Texttiling: Segmenting text into multi-paragraph
 [5]   “List of sensitive extensions,” https://pastebin.com/ux0QKf5S.                         subtopic passages,” Comput. Linguist., vol. 23, no. 1, pp. 33–64, Mar.
                                                                                              1997. [Online]. Available: http://dl.acm.org/citation.cfm?id=972684.
 [6]   “Google security blog - trustworthy chrome extensions, by                              972687
       default,” https://security.googleblog.com/2018/10/trustworthy-chrome-
       extensions-by-default.html, 2018, accessed on 2019-12-30.                       [26]   U. Iqbal, Z. Shafiq, and Z. Qian, “The ad wars: retrospective measure-
                                                                                              ment and analysis of anti-adblock filter lists,” in Proceedings of the
 [7]   “Reuters - apple says uighurs targeted in iphone attack but disputes                   2017 Internet Measurement Conference. ACM, 2017, pp. 171–183.
       google findings,” https://www.reuters.com/article/us-apple-cyber/apple-
       says-uighurs-targeted-in-iphone-attack-but-disputes-google-findings-            [27]   C. Jackson and A. Barth, “ForceHTTPS: Protecting high-security web
       idUSKCN1VR29K, 2019.                                                                   sites from network attacks,” in Proceedings of the 17th International
                                                                                              World Wide Web Conference, 2008.
 [8]   G. Acar, M. Juarez, N. Nikiforakis, C. Diaz, S. Gürses, F. Piessens,
       and B. Preneel, “Fpdetective: Dusting the web for fingerprinters,” in           [28]   A. Kapravelos, C. Grier, N. Chachra, C. Kruegel, G. Vigna, and
       Proceedings of the 2013 ACM SIGSAC Conference on Computer &#38;                        V. Paxson, “Hulk: Eliciting Malicious Behavior in Browser Extensions,”
       Communications Security, ser. CCS ’13, 2013.                                           in Proceedings of the USENIX Security Symposium. USENIX, 2014.
 [9]   J. P. Achara, G. Acs, and C. Castelluccia, “On the unicity of smartphone        [29]   J. Kettle, “Sparse bruteforce addon detection,” http://www.
       applications,” in Proceedings of the 14th ACM Workshop on Privacy in                   skeletonscribe.net/2011/07/sparse-bruteforce-addon-scanner.html,
       the Electronic Society. ACM, 2015, pp. 27–36.                                          July 2011, accessed on 2019-12-30.
[10]   S. Bandhakavi, S. T. King, P. Madhusudan, and M. Winslett, “Vex:                [30]   K. Kotowitz, “Intro to chrome addons hacking: fingerprinting,”
       Vetting browser extensions for security vulnerabilities.” in USENIX                    http://blog.kotowicz.net/2012/02/intro-to-chrome-addons-hacking.html,
       Security Symposium, vol. 10, 2010, pp. 339–354.                                        2012, accessed on 2019-12-30.
[11]   M. L. Brocardo, I. Traore, S. Saad, and I. Woungang, “Authorship                [31]   B. Krishnamurthy and C. Wills, “Privacy diffusion on the web: a
       verification for short messages using stylometry,” in 2013 International               longitudinal perspective,” in Proceedings of the 18th international
       Conference on Computer, Information and Telecommunication Systems                      conference on World wide web. ACM, 2009, pp. 541–550.
       (CITS). IEEE, 2013, pp. 1–6.                                                    [32]   B. Krishnamurthy and C. E. Wills, “Characterizing privacy in online
[12]   A. S. Buyukkayhan, K. Onarlioglu, W. K. Robertson, and E. Kirda,                       social networks,” in Proceedings of the first workshop on Online social
       “Crossfire: An analysis of firefox extension-reuse vulnerabilities.” in                networks. ACM, 2008, pp. 37–42.
       NDSS, 2016.                                                                     [33]   P. Laperdrix, W. Rudametkin, and B. Baudry, “Beauty and the beast:
[13]   Y. Cao, S. Li, and E. Wijmans, “(cross-)browser fingerprinting via OS                  Diverting modern web browsers to build unique browser fingerprints,”
       and hardware level features,” in 24th Annual Network and Distributed                   in 2016 IEEE Symposium on Security and Privacy (SP). IEEE, 2016,
       System Security Symposium, NDSS, 2017. [Online]. Available:                            pp. 878–894.
       https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/                    [34]   M. Lécuyer, G. Ducoffe, F. Lan, A. Papancea, T. Petsios, R. Spahn,
       cross-browser-fingerprinting-os-and-hardware-level-features/                           A. Chaintreau, and R. Geambasu, “Xray: Enhancing the web’s trans-
[14]   C. Cattani, “The evolution of chrome extensions detection,”                            parency with differential correlation,” in 23rd {USENIX} Security
       http://blog.beefproject.com/2013/04/the-evolution-of-chrome-                           Symposium ({USENIX} Security 14), 2014, pp. 49–64.
       extensions.html, 2013, accessed on 2019-12-30.                                  [35]   P. Leon, B. Ur, R. Shay, Y. Wang, R. Balebako, and L. Cranor, “Why
[15]   Q. Chen and A. Kapravelos, “Mystique: Uncovering information                           johnny can’t opt out: a usability evaluation of tools to limit online
       leakage from browser extensions,” in Proceedings of the 2018 ACM                       behavioral advertising,” in Proceedings of the SIGCHI Conference on
       SIGSAC Conference on Computer and Communications Security, ser.                        Human Factors in Computing Systems. ACM, 2012, pp. 589–598.
       CCS ’18. New York, NY, USA: ACM, 2018, pp. 1687–1700.                           [36]   L. Liu, X. Zhang, G. Yan, S. Chen et al., “Chrome extensions: Threat
       [Online]. Available: http://doi.acm.org/10.1145/3243734.3243823                        analysis and countermeasures.” in NDSS, 2012.
[16]   A. Datta, M. C. Tschantz, and A. Datta, “Automated experiments on ad            [37]   A. Malhotra, L. Totti, W. Meira Jr, P. Kumaraguru, and V. Almeida,
       privacy settings,” Proceedings on privacy enhancing technologies, vol.                 “Studying user footprints in different online social networks,” in Pro-
       2015, no. 1, pp. 92–112, 2015.                                                         ceedings of the 2012 International Conference on Advances in Social


                                                                                  15
       Networks Analysis and Mining (ASONAM 2012). IEEE Computer                              vibrate: A cost-benefit approach to improving browser security,” in
       Society, 2012, pp. 1065–1070.                                                          Proceedings of the 2017 ACM SIGSAC Conference on Computer and
[38]   A. Mathur, J. Vitak, A. Narayanan, and M. Chetty, “Characterizing the                  Communications Security, ser. CCS ’17. New York, NY, USA: ACM,
       use of browser-based blocking extensions to prevent online tracking,”                  2017, pp. 179–194.
       in Fourteenth Symposium on Usable Privacy and Security ({SOUPS}                 [49]   I. F. Spellerberg and P. J. Fedor, “A tribute to claude shannon (1916–
       2018), 2018, pp. 103–116.                                                              2001) and a plea for more rigorous use of species richness, species
[39]   G. Merzdovnik, M. Huber, D. Buhov, N. Nikiforakis, S. Neuner,                          diversity and the ‘shannon–wiener’index,” Global ecology and biogeog-
       M. Schmiedecker, and E. Weippl, “Block me if you can: A large-scale                    raphy, vol. 12, no. 3, pp. 177–179, 2003.
       study of tracker-blocking tools,” in 2017 IEEE European Symposium               [50]   O. Starov, P. Laperdrix, A. Kapravelos, and N. Nikiforakis,
       on Security and Privacy (EuroS P), 2017, pp. 319–333.                                  “Unnecessarily identifiable: Quantifying the fingerprintability of
[40]   K. Mowery and H. Shacham, “Pixel perfect: Fingerprinting canvas in                     browser extensions due to bloat,” in The World Wide Web Conference,
       HTML5,” in Proceedings of W2SP 2012, May 2012.                                         ser. WWW ’19. New York, NY, USA: ACM, 2019, pp. 3244–3250.
                                                                                              [Online]. Available: http://doi.acm.org/10.1145/3308558.3313458
[41]   M. Mulazzani, P. Reschl, M. Huber, M. Leithner, S. Schrittwieser,
       E. Weippl, and F. Wien, “Fast and reliable browser identification with          [51]   O. Starov and N. Nikiforakis, “Extended tracking powers: Measuring
       javascript engine fingerprinting,” in Web 2.0 Workshop on Security and                 the privacy diffusion enabled by browser extensions,” in Proceedings of
       Privacy (W2SP), vol. 5, 2013.                                                          the 26th International Conference on World Wide Web. International
                                                                                              World Wide Web Conferences Steering Committee, 2017, pp. 1481–
[42]   NLTK Project, “Natural language toolkit,” https://www.nltk.org/, 2019.
                                                                                              1490.
[43]   R. Overdorf and R. Greenstadt, “Blogs, twitter feeds, and reddit com-
                                                                                       [52]   ——, “Xhound: Quantifying the fingerprintability of browser exten-
       ments: Cross-domain authorship attribution,” Proceedings on Privacy
                                                                                              sions,” in 2017 IEEE Symposium on Security and Privacy (SP). IEEE,
       Enhancing Technologies, vol. 2016, no. 3, pp. 155–171, 2016.
                                                                                              2017, pp. 941–956.
[44]   I. Sanchez-Rola, I. Santos, and D. Balzarotti, “Extension Breakdown:
                                                                                       [53]   StatCounter, “Browser market share worldwide,” http://gs.statcounter.
       Security Analysis of Browsers Extension Resources Control Policies,”
                                                                                              com/browser-market-share, 2019.
       in Proceedings of the 26rd USENIX Security Symposium (USENIX
       Security), August 2017.                                                         [54]   J. Su, A. Shukla, S. Goel, and A. Narayanan, “De-anonymizing web
                                                                                              browsing data with social networks,” in Proceedings of the 26th
[45]   S. Sivakorn, A. D. Keromytis, and J. Polakis, “That’s the way the cookie
                                                                                              International Conference on World Wide Web. International World
       crumbles: Evaluating https enforcing mechanisms,” in Proceedings of
                                                                                              Wide Web Conferences Steering Committee, 2017, pp. 1261–1269.
       the 2016 ACM on Workshop on Privacy in the Electronic Society, ser.
       WPES ’16. ACM, 2016, pp. 71–81.                                                 [55]   E. Trickel, O. Starov, A. Kapravelos, N. Nikiforakis, and A. Doupé,
                                                                                              “Everyone is different: Client-side diversification for defending
[46]   A. Sjösten, S. Van Acker, P. Picazo-Sanchez, and A. Sabelfeld, “Latex
                                                                                              against extension fingerprinting,” in 28th USENIX Security Symposium
       gloves: Protecting browser extensions from probing and revelation
                                                                                              (USENIX Security 19). USENIX Association, 2019.
       attacks,” in 26th Annual Network and Distributed System Security
                                                                                       [56]   T. Van Goethem and W. Joosen, “One side-channel to bring them all
       Symposium. The Internet Society, 2019.
                                                                                              and in the darkness bind them: Associating isolated browsing sessions,”
[47]   A. Sjösten, S. Van Acker, and A. Sabelfeld, “Discovering browser                      in 11th {USENIX} Workshop on Offensive Technologies ({WOOT} 17),
       extensions via web accessible resources,” in Proceedings of the Seventh                2017.
       ACM on Conference on Data and Application Security and Privacy,
                                                                                       [57]   J. Wagner, “Assessing loading performance in real life with navigation
       ser. CODASPY ’17. New York, NY, USA: ACM, 2017, pp. 329–336.
                                                                                              and resource timing,” https://developers.google.com/web/fundamentals/
       [Online]. Available: http://doi.acm.org/10.1145/3029806.3029820
                                                                                              performance/navigation-and-resource-timing/, 2019, accessed on 2019-
[48]   P. Snyder, C. Taylor, and C. Kanich, “Most websites don’t need to                      12-30.




                                                                                  16
