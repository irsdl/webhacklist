---
type: Article
title: "[2110.10129] Gummy Browsers: Targeted Browser Spoofing against State-of-the-Art Fingerprinting Techniques"
resource: "https://arxiv.org/abs/2110.10129"
tags: [article, webseclist-reference, en, arxiv-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:24:39+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://arxiv.org/abs/2110.10129"
    title: "[2110.10129] Gummy Browsers: Targeted Browser Spoofing against State-of-the-Art Fingerprinting Techniques"
    author: Zengrui Liu, Prakash Shrestha, Nitesh Saxena
also_at:
  - "https://arxiv.org/pdf/2110.10129"
authors:
  - Zengrui Liu
  - Prakash Shrestha
  - Nitesh Saxena
canonical_url: ""
cited_by:
  - "2021.md:65"
commit: ""
content_sha256: 62b33d432a7cd94a047c94e134013e825979742086840829bf61e42fc62a4963
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2110.10129"
published: ""
publisher: arXiv.org
publisher_english: ""
raw_sha256: d51d2be7275acd202775ba7f0b8549742c7ed46570ad0f317e0320c63fcd910d
retrieved_from: "https://arxiv.org/pdf/2110.10129"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:24:39+00:00"
slug: arxiv-org-gummy-browsers-targeted-browser-spoofing-against-state-art-techniques
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# [2110.10129] Gummy Browsers: Targeted Browser Spoofing against State-of-the-Art Fingerprinting Techniques

**[2110.10129] Gummy Browsers: Targeted Browser Spoofing against State-of-the-Art Fingerprinting Techniques** - Zengrui Liu, Prakash Shrestha, Nitesh Saxena, arXiv.org.

- Published: date not stated
- Original: <https://arxiv.org/abs/2110.10129>
- Also published at: <https://arxiv.org/pdf/2110.10129>
- Preserved from: https://arxiv.org/pdf/2110.10129 (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Gummy Browsers: Targeted Browser Spoofing against
                                                State-of-the-Art Fingerprinting Techniques

                                                           Zengrui Liu1 , Prakash Shrestha2 , and Nitesh Saxena3
                                                              1 Texas A&M University, College Station TX 77843
                                                                                  lzr@tamu.edu
                                                                 2 University of Florida, Gainesville, FL 32611
arXiv:2110.10129v1 [cs.CR] 19 Oct 2021




                                                                          prakash.shrestha@ufl.edu
                                                              3 Texas A&M University, College Station TX 77843
                                                                               nsaxena@tamu.edu


                                                Abstract. We present a simple yet potentially devastating and hard-to-detect
                                                threat, called Gummy Browsers4, whereby the browser fingerprinting information
                                                can be collected and spoofed without the victim’s awareness, thereby compromis-
                                                ing the privacy and security of any application that uses browser fingerprinting.
                                                The idea is that the attacker 𝐴 first makes the user 𝑈 connect to his website (or to
                                                a well-known site the attacker controls) and transparently collects the information
                                                from 𝑈 that is used for fingerprinting purposes (just like any fingerprinting website
                                                𝑊 collects this information). Then, 𝐴 orchestrates a browser on his own machine
                                                to replicate and transmit the same fingerprinting information when connecting to
                                                𝑊, fooling 𝑊 to think that 𝑈 is the one requesting the service rather than 𝐴. As
                                                a consequence, if 𝑊 populates targeted ads for 𝑈 based on only browser finger-
                                                prints, 𝐴 can now start seeing the same or similar ads on his browser as 𝑈 would
                                                see. This will allow the attacker to profile 𝑈 and compromise 𝑈’s privacy.
                                                We design and implement the Gummy Browsers attack using three orchestration
                                                methods based on script injection, browser settings and debugging tools, and
                                                script modification, that can successfully spoof a wide variety of fingerprinting
                                                features to mimic many different browsers (including mobile browsers and the
                                                Tor browser). We then evaluate the attack against two state-of-the-art browser
                                                fingerprinting systems, FPStalker and Panopticlick. Our results show that 𝐴 can
                                                accurately match his own manipulated browser fingerprint with that of any targeted
                                                victim user 𝑈’s fingerprint for a long period of time, without significantly affecting
                                                the tracking of 𝑈 and when only collecting 𝑈’s fingerprinting information only
                                                once. The TPR (true positive rate) for the tracking of the benign user in the
                                                presence of the attack is larger than 0.9 in most cases. The FPR (false positive
                                                rate) for the tracking of the attacker is also high, larger than 0.9 in all cases. We
                                                also argue that the attack can remain completely oblivious to the user and the
                                                website, thus making it extremely difficult to thwart in practice.


                                         1    Introduction
                                         Many websites and web services leverage browser fingerprinting techniques to track
                                         their users for various purposes, including targeted advertisements [35] based on brows-
                                         ing history and habits, user authentication [1,8,6], and fraud detection [32,7]. Browser
                                          4 Named after “Gummy Fingers” that can impersonate a user’s fingerprint biometrics.
2       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

fingerprinting aims to uniquely identify web browsers. Specifically, browser fingerprint-
ing uses a stateless identifier for web browsers composed of a set of browser and system
attributes, including browser vendor and version, plugins and extensions, canvas ren-
dering, available fonts, performance characteristics, platform, clock skews and screen
resolutions. These attributes are collected through JavaScript APIs and HTTP headers.
     Based on different combinations of browser and system attributes, and their unique-
ness to the browser, researchers and practitioners have proposed a myriad of browser fin-
gerprinting techniques [19,25,48,44,43,28,31,12,46,15,23,49,11,16,47,42] . However,
the uniqueness of the fingerprint alone is not sufficient for prolonged user tracking
because the browser fingerprint changes over time, potentially when the browsers are
updated or configured differently [53]. For a successful long-term user tracking, changes
to the fingerprints need to be tracked to link the current fingerprint with previously
recorded fingerprints [53,29], using what is referred to as a tracking technique.
     The fingerprint linking algorithm Panopticlick, proposed by Eckersley, [29], and
FP-Stalker developed by Vastel et al. [53], are representative instantiations of such
tracking techniques. Panopticlick showed that its visitors can be uniquely identified
from a fingerprint composed of only eight browser and system attributes. It follows a
very simple heuristic based on the comparison of the string representation of browser
characteristics. FP-Stalker consists of two variants of fingerprint linking algorithms – a
rule-based variant and a hybrid variant, which leverage ruleset and machine learning
algorithms. These algorithms aim to link browser fingerprint evolutions for tracking the
user. The experiment conducted in the FP-Stalker paper [53] showed that its linking
algorithm, especially the hybrid variant, can track a given browser instance for a long
period of time, significantly better than Panopticlick.
     In this paper, we closely investigate the potential privacy leakage and security
vulnerability associated with state-of-the-art browser fingerprint linking algorithms,
Panopticlick and FP-Stalker to be specific, motivated by their very appealing applications
and practicality features. Unfortunately, we identify a significant threat vector against
such linking algorithms. Specifically, we find that an attacker can capture and spoof the
browser characteristics of a victim’s browser, and hence can “present” its own browser as
the victim’s browser when connecting to a website. The browser attributes can be easily
captured (one-time or frequently based on the application) by luring the victim into
visiting a benign-looking website controlled by the attacker (or a malicious website).
Then, all (or most of) these attributes can be spoofed (once, or continually based on
the intended level of adversarial impact on the victim), for example, by injecting a web
script, modifying the existing web script, or utilizing the browser’s built-in settings
and debugging tools. By spoofing the victim’s browser characteristics, which are used
to construct its fingerprint, the attacker’s browser would be recognized as the victim’s
browser when visiting a targeted website.
     Exploiting this general threat, we introduce Gummy Browsers, an attack system that
can fully compromise the security and privacy of the schemes that leverage browser
fingerprinting techniques. For instance, if the browser fingerprinting is employed for
personalized and targeted ads, the web server, hosting a benign website, would push the
same or similar ads to the attacker’s browser like the ones that would have been pushed
to the victim’s browser because the web server considers the attacker’s browser as the
                                          Title Suppressed Due to Excessive Length       3

victim’s browser. Based on the personalized ads (e.g., related to pregnancy products,
medications and brands), the attacker can infer various sensitive information about
the victim (e.g, gender, age group, health condition, interests, salary level, etc.), even
build a personal behavioral profile of the victim. Leakage of such personal and private
information can raise a frightful privacy threat to the user. The study of Castelluccia et
al. [27] has demonstrated that the knowledge of the ads the user is provided in targeted
advertising can indeed leak significant sensitive information about the user. Similarly, if
browser fingerprinting is used for security purposes, such as user authentication and fraud
detection (e.g., clickbot detection), our fingerprint spoofing attacker can circumvent the
security functionality of such defensive schemes. The authentication system may be
based on some other factors beyond browser fingerprinting. In this paper, we only show
how to defeat the fingerprinting factor.
     Gummy Browsers can remain hidden and invisible to the targeted user and the
targeted website. Since the capturing and spoofing of the browser attributes is done fully
transparently and remotely, Gummy Browsers can be launched easily and effectively
without being noticed by the user or the website. In this light, given the fact that
browser fingerprinting techniques are getting deployed widely in the real world, Gummy
Browsers can have a devastating and lasting impact on the online privacy and security of
the users. Capturing the victim’s fingerprinting information just once allows the attacker
to spoof the victim for a long period of time. The process can be repeated for further
impact. Given the fundamental nature of the attack, it would be very difficult to defeat.
     Our experiments consider that the website only uses browser fingerprinting for
tracking, and does not employ cookies (or cookies are blocked by the user). Therefore
our attacks and implications of our attacks are only limited to fingerprint spoofing.
Our Contributions: We believe that our work makes the following contributions:

1. A Novel Threat of Spoofing Browser Fingerprints: We introduce a novel and serious
   threat raised due to the use of browser fingerprinting techniques to track the user,
   referred to as Gummy Browsers. Specifically, this attacker with the ability to capture
   and spoof the browser fingerprint can learn various personal and sensitive information
   about the user based on personalized ads and compromise the security of browser-
   fingerprinting based defensive applications, such as user authentication and fraud
   detection. The ease with which this threat can be perpetrated is a strength of our
   work since it can be deployed in real world by even naive attackers.
2. Design and Implementation of Gummy Browsers: We provide the design and im-
   plementation of Gummy Browsers that enable an attacker to glean sensitive infor-
   mation about the user and compromise the browser fingerprinting based defensive
   schemes. Gummy Browsers leverages a benign-looking fake website to capture the
   victim’s browser characteristics (could also be a malicious, attacker-controlled web-
   site). Gummy Browsers then utilizes spoofing methods, such as script injection,
   script modification, or browser’s built-in setting and debugging tool to orchestrate
   its browser to appear as the victim’s browser.
3. Evaluation against Notable Fingerprinting Techniques: We employ state-of-the-
   art browser fingerprinting algorithms, specifically Panopticlick [29] and FP-Stalker
   [53], and evaluate the performance of Gummy Browsers against them. Based on a
   dataset of 200+ users, our results show that the attacker can successfully spoof the
4        Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

    fingerprint of the browser instance to match with that of the targeted victim’s browser
    instance for a long period of time without any significant impact on the tracking of
    the victim.


2     Background and Related Work

2.1   Browser Fingerprinting

Different combinations of the browser and system attributes can be used to generate
a unique identifier for a given browser, referred to as the browser fingerprint. Based
on different combinations of attributes, various browser fingerprinting techniques have
been proposed [19,25,48,44,43,28,47,42]. These attributes can be grouped into three
different categories [22] as presented in Table 1.
(C1) Browser-Provided Information: JavaScript API can be used to extract a wide
range of system information, referred to as browser-provided information, that can be
employed to fingerprint a device. A set of such features are listed in the first row of
Table 1. The feature set in this category includes software and hardware details (e.g.,
browser/OS vendor and version, system language [23], platform [15], user-agent string
[25], resolution, etc.), device timezone and clock drift [25] from Coordinated Universal
Time (UTC), battery information [48] (e.g., battery charge level, discharge rate), and
password autofill [46] (e.g., the password is user-typed or auto-filled by a browser
or password manager). The information corresponding to WebGL [19], a JavaScript
API for rendering graphics within web browsers, and WebRTC [24], a set of W3C
standards that supports browser-to-browser applications, e.g., voice and video chat,
can also be used to fingerprint a browser. WebGL information includes the WebGL
vendor and version, maximum texture size, supported WebGL extensions, renderer
strings, etc. WebRTC information includes connected media devices (e.g., webcam and
microphones) information. The support for local storage, which enables the browser to
store data without any expiration [20], and the status of do not track, which blocks (or
allows) the website from tracking [16] are also often used in browser fingerprinting.
(C2) Inference based on Device Behavior: The device information can also be extracted
by executing a specially crafted JavaScript code on the browser and observing the
resulting effect. This category of the fingerprinting features is based on the fact that the
execution of JavaScript code creates different effects based on the software and hardware
configuration of the device, and hence can be used to infer various characteristics of the
device. For instance, HTML5 canvas renders the text and graphics differently based on
OS, available fonts, and the video driver [44]. The elapsed time to execute the JavaScript
code can be used to infer the performance characteristics of the device [43]. Various
aspects of a pointing device can be inferred by monitoring the scroll events generated by
the mouse wheel or touchpad [28]. The browser vendor and version can be inferred by
testing CSS features [42]. The presence (or absence) of different fonts can be inferred
by rendering a text with a predefined list of fonts [31].
(C3) Browser Extensions and Plugins: The aforementioned approaches can be used
to extract information about the browser extensions and plugins to build a browser
fingerprint. Various browser plugins, e.g., Java, Flash and Silverlight, can be queried
                                                           Title Suppressed Due to Excessive Length                         5

Table 1: Three different categories of browser fingerprinting features [22], and a summary of how
they can be spoofed via our attack.
Category Feature Name                                    Spoofable Spoofing Approach Detectable by Targeted Websites
   C1      1. User-agent + - * [25]                                a, b, c
           2. WebGL information - * [19]                           b
           3. System time + - *[25]                                a, b
           4. Battery information [48]                             a, b
           5. Cookie enabled + - * [12]                            a, b, c
           6. WebRTC [24]                                          b
           7. Password autofill [46]                       Yes     b                                     Hard
           8. Platform - * [15]                                    a, b
           9. Language + - * [23]                                  a, b, c
           10. Local storage + - * [49]                            b
           11. Resolution + - * [11]                               a, b
           12. Do Not Track - * [16]                               a, b, c
   C2      1. HTML5 canvas fingerprinting - * [44]                 b
           2. System performance [43]                              b
           3. Font detection [31]                          Yes     b                                     Hard
           4. Scroll wheel fingerprinting [47]                     b
           5. CSS feature detection [42]                           b
   C3      1. Browser plugin fingerprinting + - * [30]             a, b
           2. Browser extension fingerprinting [36]        Yes     b                                     Hard

   I. +: Features used in Panopticlick [29]. -: Features used in Rule-based Linking Algorithm [53]. *: Features used in Hybrid
   Linking Algorithm [53].
   II. C1: Browser-provided information. C2: Inference based on device behavior. C3: Extensions and plugins.
   III. a: Script Injection. b: Script Modification. c: Browser Setting and Debugging Tool.

through JavaScript APIs to reveal system information [30]. For instance, Flash can
provide the OS kernel version. Both Java and Flash can provide an enumerated list of
system fonts. Installed NoScript (that disables JavaScript) and its blacklisted website
can be detected by loading a large set of websites. Similarly, AdBlocker can be detected
by monitoring if fake ads are loaded on the websites [36] or not. Other extensions can
also be detected by other methods.

2.2     Representative Fingerprinting Techniques

As mentioned earlier, various browser fingerprinting approaches have been proposed in
the literature, each utilizing a different set of device characteristics. Panopticlick [29]
and FP-Stalker [53], specifically its Rule-based Linking Algorithm and Hybrid Linking
Algorithm, are representative browser fingerprint linking techniques.
Panopticlick: Panopticlick [29] leverages eight different browser and system attributes
to track the user through browser fingerprinting. It categorizes these attributes into two
groups. The first group contains cookies enabled (C1-5), screen resolution (C1-11),
time zone (C1-3), and partial supercookie test (e.g., local storage, session storage and
IE userData) (C1-10). The second group contains user-agent (C1-1), HTTP ACCEPT
headers (C1-9), system fonts (C2-3), and browser plugins information (C3-1). To learn
the identity of an unknown fingerprint ‘𝐹𝑢 ’, Panopticlick compares 𝐹𝑢 with each of the
pre-stored fingerprints ‘𝐹𝑘 ’. If 𝐹𝑢 has all the eight attributes the same as that of 𝐹𝑘 ,
Panopticlick marks them as the same fingerprint, i.e., generated from the same browser
instance. If any of the attributes in the first group and more than one attribute from the
second group differs, Panopticlick marks 𝐹𝑢 and 𝐹𝑘 as different fingerprints. In the case
where there is only one difference in the attribute set from the first group, Panopticlick
estimates the similarity score of that attribute between 𝐹𝑢 and 𝐹𝑘 . If the similarity score
6        Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

is higher than a set threshold (say 0.85), 𝐹𝑢 is marked the same as 𝐹𝑘 . In the rest of the
scenarios, 𝐹𝑢 is marked differently from 𝐹𝑘 .


Rule-based Linking Algorithm (RLA): This approach for browser fingerprinting cate-
gorizes the fingerprinting attributes under consideration into three sets. The first attribute
set consists of operating system (C1-1), platform (C1-8), browser name (C1-1), local
storage (C1-10), do not track (C1-12), cookies enable (C1-5), and canvas (C2-1). The
second set consists of user-agent (C1-1), GPU vendor (C1-2), renderer (C1-2), browser
plugins (C3-1), system language (C1-9) and HTTP accept headers (C1-9). The third
feature set consists of the resolution (C1-11), time zone (C1-3) and encoding (HTTP
header). Similar to Panopticlick, RLA compares the aforementioned attributes of an
unknown fingerprint 𝐹𝑢 with each of the stored fingerprint 𝐹𝑘 . If all the attributes of
both the fingerprints are the same, RLA marks them as exact fingerprints. If 𝐹𝑢 and
𝐹𝑘 have differences in at least one of the attributes in the first set, RLA marks them as
different. if 𝐹𝑢 has an older version of the browser, the algorithm will mark them as
different. Otherwise, it estimates the similarity between the remaining attributes from
the second and third sets. If the similarity score is greater than the set threshold (say
0.75), the algorithm counts the number of features that are different between 𝐹𝑢 and 𝐹𝑘 .
All the 𝐹𝑘 s that have less than one different attribute from the first set and less than two
different attributes from the first and second sets are marked as candidate fingerprints.
If all the 𝐹𝑘 -s that have been marked as exact fingerprints correspond to the same user,
𝐹𝑘 is assigned to that particular user. Similarly, if all the 𝐹𝑘 -s that have been marked as
candidate fingerprints belong to the same user, 𝐹𝑢 is assigned to that particular user. In
the rest of the cases, 𝐹𝑢 is recognized as a new user.


Hybrid Linking Algorithm (HLA): This approach enhances RLA with the machine
learning technique. HLA divides the browser attributes into two sets. The first set
consists of the operating system (C1-1), device platform (C1-8), browser information
(C1-1), local storage (C1-10), do not track (C1-12), cookies enable (C1-5), and canvas
(C2-1). The second set contains the following nine features – number of changes, system
languages (C1-9), HTTP based user-agent (C1-1), canvas (C2-1), created time (C1-3),
browser plugins (C3-1), fonts (C2-3), renderer (C1-2) and resolution (C1-11). HLA
compares an unknown fingerprint ‘𝐹𝑢 ’ with each of the known fingerprints ‘𝐹𝑘 ’ to give
an identity to 𝐹𝑢 . 𝐹𝑘 is assigned to the set “exact” if these two fingerprints have the
exact same first attribute set, otherwise, to the set “𝐹𝑘_𝑠𝑢𝑏 ”. If all the fingerprints in the
set exact have the same id, this id is assigned to 𝐹𝑢 , otherwise, a new id is given to 𝐹𝑢 .
If there are no fingerprints in the set exact, HLA compares the first attribute set of 𝐹𝑢
with that of each of the 𝐹𝑘 in 𝐹𝑘_𝑠𝑢𝑏 . Each attribute comparison results in ‘1’ if the
attribute is the same in both 𝐹𝑘 and 𝐹𝑢 , otherwise, ‘0’. If there are less than five different
attributes, HLA feeds the results to the machine learning model, Random Forest to be
specific, resulting in a similarity score (in the range of 0 and 1). The 𝐹𝑘 having a score
higher than 0.994 is assigned to the set ‘candidates’. The 𝐹𝑘 -s in the candidate set are
sorted in descending order of the score. If the first score is larger than the second one
plus 0.1, the id of 𝐹𝑢 ID becomes the top-one id. If the top-one and top-two ids have the
same id, this id is assigned to 𝐹𝑢 , otherwise, a new ID is given to 𝐹𝑢 .
                                           Title Suppressed Due to Excessive Length         7

2.3   Applications of Browser Fingerprinting
Targeted Advertising: The browser fingerprinting can be employed to provide targeted
and personalized ads on the user devices (e.g., general desktop PC, handheld mobile
device) [35]. When a user visits a website, the web server (or the online service provider)
extracts and stores the browser fingerprint along with the user’s browsing behavior. When
the user revisits the same website, the web server looks for his fingerprint in its repository
and pushes the relevant ads based on the user’s prior browsing behavior. Besides browser
fingerprinting, there exist other approaches for targeted advertisements, such as account-
based targeted ads [51] and cookie-based targeted ads [52]. Unlike these approaches,
the browser fingerprinting neither requires the user to log into his online account, nor
requires the user to enable the cookie, rather it works transparently.
User Authentication: Various services, such as Oracle [1], Inauth [8] and SecureAuth
IdP [6] are leveraging the browser fingerprinting technique to enhance the overall secu-
rity and usability of their authentication mechanisms [40]. The browser fingerprinting
is usually integrated with existing authentication schemes, such as two-factor authenti-
cation (2FA) schemes [6]. On successful login, the web server captures and stores the
browser fingerprint of the device that the user has used to login. Next time, when the user
attempts to login to the same web service using the same device, the current browser
fingerprint is matched against the stored fingerprints. If they match with a high score,
the second-factor of 2FA process is dropped (i.e., no need to provide the PIN), merely
typing in the password is sufficient to login. Thus, browser fingerprinting approach
for authentication lowers the user-effort during the authentication process, and hence
improves the system’s usability.
Fraud Detection: Several security services, e.g., Seon [32] and IPQualityScore [7], are
leveraging browser fingerprinting for the purpose of fraud detection and prevention in
the online setting. The fraud detection techniques can be categorized into two groups
– supervised and unsupervised methods [26]. The supervised method leverages the
information from the prior fraud behavior (i.e., already marked as fraud) to build a
model to infer if the current behavior is fraud or non-fraud. The unsupervised method
does not rely on the prior fraudulent behavior, rather it sets a baseline for normal
behavior. If the current behavior significantly deviates from the baseline behavior, the
unsupervised method marked the behavior as fraudulent. The browser fingerprinting can
be used to mark the user as a fraudster or a legitimate user. When any of these methods
find the user’s behavior fraudulent, the service provider captures and flags the browser
fingerprint as fraudulent. Since the browser fingerprint changes over time, a risk level
can be estimated by comparing the browser fingerprint against the flagged fingerprints.
If the risk level is significantly high, the current user is flagged as a fraudster.


3     Attack Model & Spoofing Methods
3.1   Attack Model
Gummy Browsers consider a remote adversary who can spoof the victim’s browser to a
target remote web service. The main goal of Gummy Browsers is to fool the web server
into believing that a legitimate user is accessing its services so that it can learn sensitive
8       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

                            1. Visit the attacker                          2. Acquire user’s browser
                            controlled website                            fingerprinting information
                                                    Attacker controlled                                Attacker (A)
                 User (U)
                                                          website
                                                                                              3. Use user’s browser
                                Visit                Targeted Website            4. Visit          information

                  Fingerprinted and recognized                   5. Recognized as U (not A) and
                  as U and pushed ads based on                   pushed ads based on U’s      Spoofing Methods
                   U's prior browsing behavior                   prior browsing behavior - Script Injection
                                         Targeted                                          - Browser Setting &
                                        Web Server                                           Debugging Tools
                                                                Fingerprinting Algorithm - Script Modification

             Fig. 1: A high-level overview of the Gummy Browsers attack model.
information about the user (e.g., interests of the user based on the personalized ads), or
circumvent various security schemes (e.g., authentication and fraud detection) that rely
on the browser fingerprinting. A high-level overview of the attack is shown in Figure 1.
    We assume that the attacker has obtained the browser fingerprint of the victim.
The adversary can easily capture the victim’s fingerprinting information by designing
a benign-looking website and luring the victim into visiting his website. The adversary
can leverage the exact mechanism as that of any fingerprinting website to acquire the
browser fingerprint, i.e., via JavaScript APIs. It is also possible that a compromised web
service, running a malicious script, could acquire the victim’s browser fingerprint when
the victim visits the attacker-owned website.
    We also assume that before accessing a target web service, the attacker spoofs (or
injects) previously acquired victim’s browser information into his own fully controlled
device to present it as the victim’s device. When the attacker visits the target website,
the target web server would receive the victim’s fingerprint from the attacker’s device.
Therefore, for the target web service, it looks like the victim is accessing its services,
and can not really recognize the malicious attacker.
    We consider three different modes of executing the attack. An adversary can retrieve
and spoof the victim’s browser fingerprint only once, referred to Acquire-Once-Spoof-
Once. Acquire-Once-Spoof-Once can be used to bypass the security of the user authen-
tication scheme. Alternatively, to increase the impact of the attack, the attacker can
spoof the same browser fingerprint instance multiple times over a few days gap, referred
to Acquire-Once-Spoof-Frequently. Leveraging Acquire-Once-Spoof-Frequently, the at-
tacker can track the personalized ads associated with the victim for a long period of time,
and can infer various sensitive information about the user, even build a personal profile
of the victim. Since the browser fingerprint changes over time, to increase the attack
success rate, the attacker can also retrieve and spoof the browser fingerprint multiple
times, and is referred to Acquire-Frequently-Spoof-Frequently. With this approach, the
attacker could always obtain the latest browser fingerprint of the victim. This can enable
the attacker to compromise the security of the fraud detection mechanism.

3.2   Spoofing Methods

The key component of Gummy Browsers is the ability of the attacker to spoof the
victim’s browser fingerprint so that the attacker can present its own browser as if it is the
victim’s browser in front of the web service. Our spoofing methods are only focusing on
the features which are listed in Table 1, and we did not spoof network level features like
IP address. The attacker can leverage the following methods to spoof the fingerprint.
                                          Title Suppressed Due to Excessive Length        9

3.2.1 Script Injection In browser fingerprinting, when the browser loads a website, the
website executes scripts consisting of various JavaScript API calls to extract the browser
information. To spoof the browser fingerprint, the values extracted by the JavaScript API
calls should be changed before the browser executes the scripts embedded in the website.
The objects where these extracted values are stored can be overwritten by creating a
new object with the same name and constructor as that of the original JavaScript APIs.
To implement this method, a browser extension, a specialized and independent software
module for customizing a web browser, and/or Selenium [18], a portable framework for
testing web applications, can be utilized. The browser always loads and executes the
website scripts in the browser extension prior to loading and executing it to the client
machine. Those scripts would not change any scripts contents that are loaded from the
visited websites. In the case of Selenium, pre-designed scripts are executed, which is
followed by launching the browser, loading the website, and executing the embedded
scripts. The feature of the browser extension and Selenium to execute the scripts prior to
loading the website allows the adversary to overwrite the browser properties extracted
through JavaScript API calls. An example is listed in Appendix C.
3.2.2 Browser Setting and Debugging Tool Many of the browsers offer a mecha-
nism in the form of the browser setting and the debugging tool that enables its users (the
attacker in our case) to change various attributes of the client device and the browser.
For instance, cookies, local storage and “do not track” options can be enabled or dis-
abled simply through the browser setting in the Google Chrome browser [41] and the
“about:config” page in the Firefox browser [5]. Further, about:config page in the Fire-
fox browser allows the user to design his own APIs that can overwrite the browser’s
pre-defined APIs. This approach can completely change the browser’s attributes.
     The browser also offers a debugging tool intended for web application developers
that allows them to debug and improve their web application functionality [4]. Using
the debugging tool, various browser attributes, such as user-agent, geolocation, and
caches disabled can be easily changed. The changes affect both the JavaScript API
(e.g., navigator.userAgent) and the corresponding value in the HTTP header (e.g.,
the value of user-agent field). The debugging tool allows the changes on the browser’s
attributes to any custom value, whether it is a pre-defined valid string, or a random text.
3.2.3 Script Modification The browser properties can also be changed by modifying
the scripts embedded in the website. Once the embedded scripts have extracted the
browser information, they can be changed before the website sends it to the web server.
Utilizing the developer debugging tool (mentioned earlier), a breakpoint can be set at the
beginning of each script of the website so that the scripts’ execution gets paused at the
set breakpoint. By inspecting the embedded scripts, the JavaScript API expression can
be replaced with the spoofed values. For instance, platform = navigator.platform
can be replaced with platform = “Win3200 that exposes the underlying platform of the
device as Win32, instead of the actual platform. However, each API expression should
be changed very carefully as the use of an incorrect expression (i.e., its value and format)
can alert the web service, and the changes can fail.
    A more convenient method to spoof the browser information is to leverage the fact
that JavaScript always uses Ajax (Asynchronous JavaScript And XML) to transfer the
data to the remote server [33]. Since Ajax employs JSON (JavaScript Object Notation)
10      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

[13][14] format when transferring data to the web server, the browser information can
be changed by checking the variable in the JSON object. Given that the debugging tool
shows current variables and their values at each breakpoint, the values can be changed
easily. Once the changes on the scripts are completed, the breakpoints are removed
allowing the execution of the modified scripts. With this approach, the remote web
service would receive the spoofed browser attributes. As the executed scripts are never
sent outside the client machine, the approach remains oblivious to the remote web server.
    Most websites or web services use JavaScript obfuscation on the scripts, instead
of the native ones. The purpose of using obfuscation is to make the scripts difficult to
understand. JavaScript Obfuscator Tool [3] is an example of such obfuscation methods.
JavaScript obfuscation can indeed make script modification harder than native scripts.
However, there are JavaScript deobfuscation methods that can help us to get native
scripts. A previous study [39] and deobfuscation service [21] have proved that deobfus-
cation can work. So obfuscated scripts will not pose a problem in script modification.
    We have listed all spoofing approaches for each feature in Table 1. More details for
spoofing all features are listed in Appendix A.


4     Attack Implementation

4.1   Acquiring User Browser Fingerprint

To impersonate as the victim in front of the target website, Gummy Browsers needs to
acquire the device fingerprinting information from the victim’s device. Gummy Browsers
employ the following two methods to capture the victim’s browser fingerprint.
With JavaScript: JavaScript provides a variety of APIs that can be utilized to extract
the device information. The execution of these APIs does not require any permission
from the users [45]. For instance, the API navigator.platform retrieves the details on
the platform (e.g., MacIntel, Win32, Linux, etc.) of the device that the user is using. The
cookieEnabled API tells if the browser has disabled cookies or not. These methods
are exactly the same as deployed by the web service that uses browser fingerprinting.
All these APIs are completely transparent to the user.
Without JavaScript: Some device fingerprinting attributes can also be extracted
through methods other than JavaScript APIs. For instance, user-agent, supported lan-
guages and their order can be retrieved from the HTTP header [38], fonts can be
extracted using Flash and CSS. Although JavaScript has navigator.userAgent API,
the use of HTTP header is preferred to retrieve user-agent because the user can disable
the JavaScript, thereby failing the retrieval of user-agent through JavaScript API. Fortu-
nately, in such a situation, the HTTP header can still provide the user-agent attribute of
the browser. For some of the attributes, such as the list of fonts in the device, JavaScript
does not offer any APIs. Flash and CSS are used to list the available fonts in the device.

4.2   Visual Attack

We utilize the Panopticlick website [17] and the FingerprintJS demo website [9] to
assess the effectiveness of various spoofing methods, referred to as the visual attack.
                                           Title Suppressed Due to Excessive Length      11

          Table 2: The attacks executed for each user in our evaluation methodology.
                      Attack Number 1 2 3 4 5 6 7 8 9
                      Time Gap (day) 1 7 15 30 60 90 180 270 365

Attacking Panopticlick Site: Panopticlick provides a dashboard for displaying the
browser information, which we leverage to assess our spoofing methods. Figure 7 in
Appendix B presents a snapshot of the Panopticlick dashboard showing fingerprint
information when a (victim) user uses a Firefox browser on a Windows machine, i.e.,
“Win+Firefox”. By visually inspecting the information displayed on the dashboard, we
validated if the spoofing methods succeed in injecting spoofed attributes. We use the
browser setting and debugging tool to modify the following attributes – user-agent, HTTP
accept header, cookie enabled, and local storage, used in Panopticlick. Specifically, we
use the debugging tool to change the user-agent and the browser’s setting option to change
the language attribute found in HTTP accept header. We change the language category
and its order in the Google Chrome browser to meet target languages combination.
To modify the cookie enabled and local storage, we use corresponding options in the
privacy setting of the Google Chrome browser. To change the remaining attributes used
in Panonpticlick, either the script injection or the script modification approach is used.
Due to the convenience of using script modification, we use this approach for the said
purpose. Specifically, we change the attributes’ value in the JSON file of the script such
that the Panopticlick would receive the modified values.
Attacking FingerprintJS Site and Real-Life Fingerprint Service: We also success-
fully did the visual attack against FingerprintJS website and the Fingerprintjs pro service.
We listed full details in Appendix B.

4.3   Algorithm Attack: Attacking Prominent Fingerprinting Based Techniques

We emulate the attack against the browser fingerprinting algorithms by simply copying
the entire fingerprint, referred to as the algorithm attack. To evaluate the performance
of our algorithm attack, we employ three prominent browser fingerprinting algorithms
– Panopticlick, RLA, HLA and launch the algorithm attack against them. We utilize the
dataset from [50], referred to as the original dataset, to evaluate the performance of
the algorithm attack. Details on the dataset are provided in Section 5.1. Each finger-
print in the dataset has following three timestamps: 𝑐𝑟𝑒𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒, 𝑢 𝑝𝑑𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒 and
𝑒𝑥 𝑝𝑖𝑟𝑒𝑑_𝑑𝑎𝑡𝑒, which denote the timestamps when the fingerprint is created/recorded,
updated, and expired, respectively. Utilizing the original dataset, various datasets are
generated based on different collect frequency, referred to as the benign dataset.
    In a real-world setting, an adversary can capture the victim’s browser fingerprint
at any point in time. Given this, we consider that the attacker can spoof any of the
fingerprints in the original dataset. Therefore, we copy one fingerprint instance of
the given user at a time, update the creation date and order, consider it as a spoofed
fingerprint, and inject it back into the original dataset, forming the attack dataset.
Such an injection of copied fingerprint simulates the scenario where an adversary
acquires the victim’s fingerprint, and then tries to impersonate the victim by spoofing
the fingerprint. The fingerprinting algorithms are executed on the attack dataset to
link together the browser fingerprints from the same user. The attack succeeds if the
fingerprinting algorithm incorrectly marks the spoofed fingerprint as from the victim.
12      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

     Since the browser fingerprint changes over time, the impact of the algorithm attack
may vary based on the gap between the time when the fingerprint is acquired and the
time when the attack is launched, referred to as “time gap”. In terms of the dataset, the
time gap refers to the difference in the 𝑐𝑟𝑒𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒 between two fingerprints from
the same user. To measure the effectiveness of the time gap in our algorithm attack, we
design and build nine different attacks based on nine different time gaps. The attack
number and corresponding time gaps are presented in Table 2.
     In the original dataset, each user has more than one fingerprint collected over a
long period of time. To execute the aforementioned nine different attacks, we assume
that the adversary captures the oldest of the fingerprints (the first one) of the user and
spoofs after each of the ‘n’ days considered in nine different attacks, referred to as
spoofed/copied fingerprint. Thus, we consider Acquire-Once-Spoof-Frequently setting
for our nine attacks. The 𝑐𝑟𝑒𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒 of the spoofed fingerprint is set as ‘n’ days
after its original 𝑐𝑟𝑒𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒. Similarly, the 𝑒𝑥 𝑝𝑖𝑟𝑒𝑑_𝑑𝑎𝑡𝑒 is set to 5 days after its
𝑐𝑟𝑒𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒. Since none of the three algorithms uses the 𝑢 𝑝𝑑𝑎𝑡𝑒𝑑_𝑑𝑎𝑡𝑒, we set its
value to “NULL”. Although we employ Acquire-Once-Spoof-Frequently approach for
all our attacks, the results are also applicable to Acquire-Once-Spoof-Once, where the
fingerprint is spoofed only once. If the fingerprint is acquired frequently over a period
of time, our attack would have a higher chance to succeed.
     To evaluate our algorithm attack, we utilize the exact same code as that of FP-Stalker,
which is made publicly available in the GitHub repository by its authors [50]. They have
implemented all three algorithms, namely Panopticlick, RLA, and HLA, considered in
our study, and can be found in their code repository. For each user in the dataset, we
run these algorithms in two different settings – i) the benign setting without any spoofed
fingerprints, and ii) the attack setting with nine different spoofed (or attack) fingerprints.


5     Dataset & Evaluation Methodology

5.1   FP-Stalker Dataset

We use the FP-Stalker dataset [50] to evaluate the performance of Gummy Browsers
against browser fingerprinting techniques. The authors of FP-Stalker designed and built
two extensions, one for the Firefox browser and the other for the Chrome browser, and
used the AmIUnique website to collect the browser fingerprints. Although they noted
that their dataset consists of 98598 browser fingerprints from 1905 users collected over
a period of two years in their paper, their public dataset contains only 15000 fingerprints
collected from 1819 users. Each fingerprint in the dataset contains 40 variables. 38
of them correspond to browser fingerprinting attributes. The remaining two variables
are “Counter” and “ID”. The counter denotes the order of the fingerprint based on the
created date of the fingerprint. ID uniquely represents an individual user, referred to as
“original ID” in our analysis.
    We observed that the fingerprints in the dataset have inconsistency, i.e., the fin-
gerprints from the given user do not have consistent browser attributes, e.g., different
operating systems, the newer fingerprint having older browser version/vendor than the
older fingerprint. As such inconsistency in the dataset may impact the performance of
                                           Title Suppressed Due to Excessive Length        13

the browser fingerprint algorithms as well as that of our attack, we removed all incon-
sistent fingerprints resulting in the dataset with the fingerprints from 275 users. Further,
we remove the user having less than seven fingerprints, which is considered insufficient
for the three fingerprint algorithms, dropping the user counts in the dataset from 275 to
239. This dataset is what we use to evaluate our attack.
Collect frequency: We sample the dataset using a configurable collect frequency similar
to FP-Stalker. Collect frequency indicates how often a browser is fingerprinted. The
lesser the fingerprinting frequency (or the higher collect frequency), the harder it would
be to track the user. We use 11 different collect frequencies – 1, 2, 3, 4, 5, 6, 7, 8, 10,
15, and 20, in terms of days. To generate a dataset for a given collect frequency, we
employ the approach as suggested in FP-Stalker. When a dataset is sampled using a
collect frequency, the approach usually extends the dataset by copying (or replicating)
the fingerprints at missing dates, therefore, we refer to it as the expansion algorithm. The
expansion algorithm iterates in time with a step of collect frequency days and creates (or
recovers) the browser fingerprint at each time step (𝑡 ± 𝑓𝑐 ∗ 𝑖), where 𝑡 is the fingerprint
creation date, 𝑓𝑐 is collect frequency, and 𝑖 is a natural number. The iteration continues
until the expired date of the previous and the current fingerprint is reached. The process
is repeated for each of the fingerprints collected from the given user. Thus, the expansion
algorithm generates a new dataset with the fingerprints sampled at a consistent frequency
of collect frequency days.

5.2   Evaluation Methodology
5.2.1 Visual Attack We leverage the Panopticlick website and the FingerprintJS demo
website and use various combinations of the terminal and the browser that the victim
user may use to visually assess the spoofing methods. We employ a Mac laptop running
macOS 10.14 Mojave, an Android phone running Android OS Pie 9.0, a Windows
desktop running Windows 10 OS as the terminal, while we use Google Chrome, Mozilla
Firefox, Microsoft Edge, and Tor as the browser. Using the Panopticlick website, we
note all the fingerprinting features when using different terminal-browser combinations.
     For the purpose of our evaluation, we consider that the attacker uses the Google
Chrome browser on the Mac laptop, i.e., “Mac+Chrome” to launch the attack. We be-
lieve that this is a very standard setup, and the attacker can just use this setup to launch
the spoofing attack. Since the user may use different combinations of the terminal and the
browser to access the target website, we consider the browser fingerprint obtained from
all the remaining combinations of the terminal and the browser as the victim’s browser
fingerprint. We spoof each of the victim’s fingerprints on the attacker’s Mac+Chrome
setup using various spoofing methods detailed in Section 3.2. To validate if the spoof-
ing methods have indeed succeeded or not, we compare the fingerprint shown on the
attacker’s browser after spoofing with the previously noted victim’s fingerprint.

5.2.2 Algorithm Attack Evaluation Scenarios: As mentioned earlier, to emulate our
attack against the three fingerprinting algorithms, we insert nine spoofed fingerprints,
each corresponding to our nine different attacks, to the original dataset. We inject the
spoofed fingerprint after the latest fingerprint in the dataset that has the smaller (or same)
created date as that of the spoofed fingerprint. As the counter in the dataset represents the
order of the fingerprint based on its created date, when injecting the spoofed fingerprint,
14      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

the dataset is re-organized for the counter. Thus, after injecting all our nine spoofed
fingerprints, the new dataset would contain 15009 fingerprints (the original dataset had
15000 fingerprints), with a different and corrected order in terms of the counter.
    In our evaluation, we choose one user as a victim at a time and evaluate our attack
against the three fingerprinting algorithms, i.e., nine spoofed fingerprints corresponding
to the chosen user are injected into the original dataset generating the attack dataset.
The attack dataset is then reverted back to the original dataset. We repeat the process
for each user in the dataset, resulting in a total of 239 attacks (for 239 users).
    FP-Stalker uses 40% of the total fingerprints as a training dataset and the remaining
fingerprints as the testing dataset. The fingerprint dataset is extended leveraging the
expansion algorithm (which is based on the collect frequency provided in FP-Stalker)
resulting in a sufficiently large fingerprint dataset.
Evaluation Metrics: To evaluate the performance of fingerprinting algorithms in the
benign setting (using benign dataset), we use true positive rate (TPR), whereas, to
evaluate the performance of our attack against fingerprinting algorithms, we use false
positive rate (FPR). TPR measures how often the legitimate fingerprints have been
correctly identified as belonging to the correct user’s device. FPR measures how often
the spoofed fingerprints are incorrectly identified as belonging to the victim.
    In our evaluation, since we consider the tracking of the user over a period of time,
we compute TPR and FPR for each day separately. When computing TPR and FPR for
a given day, we consider only the fingerprints from that particular day. We expect the
TPR to be high, close to 1, which indicates the benign user is being tracked well even
in the presence of the Gummy Browsers attack. We also expect FPR to be close to 1,
which denotes the attack is highly successful.


6     Results
6.1   Visual Attack Results
We have successfully spoofed all the fingerprinting information on Panopticlick and
FingerprintJS website. The full details of spoofing results are listed in Appendix B.

6.2 Algorithm Attack Results
6.2.1 Benign Setting To validate the implementation of the three algorithms (obtained
from FP-Stalker repository), similar to FP-Stalker, we plot various graphs on the perfor-
mance of these algorithms for tracking the users. Figure 2 shows the average tracking
duration (and Appendix Figure 15 shows the average of maximum tracking duration)
as a function of collect frequency for the three different fingerprinting algorithms. The
tracking duration indicates the time duration (in terms of days) that the fingerprinting
algorithm can track the user. The higher value of average tracking duration is considered
good for user tracking. Figure 2 (and Appendix Figure 15) shows that the HLA outper-
forms Panopticlick and RLA at tracking the user, which is inline with the one reported
in FP-Stalker. Further, we achieved similar results as those reported in FP-Stalker for
each of the three fingerprinting algorithms.
    Figure 3 shows the average ownership as a function of collect frequency. Ownership
indicates how often the fingerprints were correctly associated with their actual users by
                                              Title Suppressed Due to Excessive Length           15




                       (a) FP-Stalker [50]                  (b) Our Result
Fig. 2: Average tracking duration as a function of collect frequency for three different algorithms.




                       (a) FP-Stalker [50]                   (b) Our Result
Fig. 3: Average ownership as a function of collect frequency for three fingerprinting algorithms.
the fingerprinting algorithms. The higher the ownership score, the better would be the
performance of the fingerprinting algorithms. We achieved average ownership of above
0.95 for all the three fingerprinting algorithms, which is inline with that reported in FP-
Stalker [50]. Appendix Figure 16 shows the number of new IDs assigned to each user as a
function of collect frequency for three different fingerprinting algorithms. If the number
of new IDs assigned to a user is ‘1’, this means all his fingerprints have been identified
as from the original user (the best result). If the number of new assigned IDs is larger
than ‘1’, say ‘n’, this means the user’s fingerprints are still tracked correctly, but as ‘n’
separate tracking durations, which can be seen as from three different users. Although
we used the exact same implementation of the three algorithms from FP-Stalker, we
achieved slightly different results compared to those in FP-Stalker. We attribute this
difference to the difference in the volume of our dataset (239 users) compared to that
used in FP-Stalker (1905 users).
    Figure 4a, 4b, and 4c show the performance of the tracking algorithms in the benign
setting. Specifically, they show the TPRs as a function of tracking days (when the collect
frequency was set as 1) for Panopticlick, RLA, and HLA, respectively. Like earlier, RLA
and HLA perform better than Panopticlick.
6.2.2 Attack Setting To evaluate the performance of our attack and its impact on the
tracking of legitimate users, we compute the average of TPRs and the average of FPRs
over 239 attacks. Figure 5a, 5b, and 5c show the average TPRs as a function of tracking
days in the attack setting for Panopticlick, RLA, and HLA, respectively, when collect
frequency is set to 1. When comparing these TPRs with those in the benign setting, we
see only a very minor difference in the TPR scores, potentially because of the addition
of the spoofed fingerprints in the attack setting. This indicates that our attack does not
have any significant impact on the performance of fingerprinting algorithms.
    Similarly, Figure 6a, 6b and 6c show the average FPRs as a function of tracking days
in the attack setting for Panopticlick, RLA, and HLA, respectively, when the collect
frequency is set to 1. We achieved average FPRs of greater than 0.95, mostly close to
1.00, which indicates that most of the spoofed fingerprints were misrecognized as the
16       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena
             1.1                                   1.1                                  1.1

             1.0                                   1.0                                  1.0




          TPR




                                                 TPR




                                                                                      TPR
             0.9                                   0.9                                  0.9

             0.8 0    25   50   75   100   125     0.8 0   25   50   75   100   125     0.8 0   25   50   75   100   125
                      Tracking days                        Tracking days                        Tracking days
                   (a) Panopticlick                        (b) RLA                              (c) HLA
Fig. 4: True positive rate (TPR) as a function of tracking days in the benign setting when the
collect frequency is set as 1.
             1.1                                   1.1                                  1.1

             1.0                                   1.0                                  1.0
          TPR




                                                 TPR




                                                                                      TPR
             0.9                                   0.9                                  0.9

             0.8 0    25   50   75   100   125     0.8 0   25   50   75   100   125     0.8 0   25   50   75   100   125
                      Tracking days                        Tracking days                        Tracking days
                   (a) Panopticlick                        (b) RLA                              (c) HLA
Fig. 5: True positive rate (TPR) as a function of tracking days in the attack setting when the collect
frequency is set as 1.
             1.1                                   1.1                                  1.1

             1.0                                   1.0                                  1.0
          FPR




                                                 FPR




                                                                                      FPR
             0.9                                   0.9                                  0.9

             0.8 0    25   50   75   100   125     0.8 0   25   50   75   100   125     0.8 0   25   50   75   100   125
                      Tracking days                        Tracking days                        Tracking days
                   (a) Panopticlick                        (b) RLA                              (c) HLA
Fig. 6: False positive rate (FPR) as a function of tracking days in the attack setting when the collect
frequency is set to 1.
legitimate ones. In other words, these results show that our attacks were highly successful
in fooling the fingerprinting algorithms into believing the spoofed fingerprints as the
legitimate fingerprints. We note that similar results were achieved in both the benign
and attack settings when the collect frequency was set to values other than 1.


7    Implications of Our Attack
As the browser fingerprinting is processed at the backend (i.e., the remote server) of the
website and no web services are claiming that they are using any browser fingerprinting
approaches, we could not verify the actual impact of our attacks without inspecting the
backend codes of the website. However, our results show that if they were to implement
only fingerprinting techniques (without integration with any of the cookies, caches,
or authentication mechanisms), our attack can have a significant impact on the user’s
privacy and security applications as described below.
Compromising Ad Privacy: A prior study [28] has shown that by simply monitoring
the user’s personalized ads, one can build the user’s personal profile. In our attack, the
attacker is successful at presenting his device to a target website as if it is the victim
user’s device through various spoofing methods. If the target website only uses browser
fingerprinting to track the user and for personalized ads, the same or similar ads, or the
ads from the same category would show up on the attacker’s device. Given this, the
                                         Title Suppressed Due to Excessive Length     17

attacker may learn various sensitive information about the user, including his gender,
age group, the potential location of the user, his habits, and many more. Further, the
attacker can sell such user’s information for the purpose of personal and financial gain.
Defeating User Authentication: The purpose of browser fingerprinting in authentica-
tion is to remember the old device and enhance the security of traditional authentication
methods such as passwords. For account login, since the attacker exposes his device
as the victim’s device in our attack, the target website will misrecognize the attacker
as the victim who is using an old device, assuming that the attacker has obtained the
victim’s login credentials (i.e., the user’s username and password). The authentication
mechanisms only based on browser fingerprinting cannot block such an attack.
Bypassing Fraud Detection: Given the fact that many of the fraud detection techniques
use browser fingerprinting information, the attacker can circumvent the detection by
exposing his device as the victim’s device leveraging various spoofing methods. Unless
the victim user does not make any major big changes on his device (e.g., changing to
a different operating system, downgrading system version, or replacing hardware) the
attacker can impersonate the victim and bypass the detection. Generally, the attacker
would be unaware of such big changes. However, the attacker can always pull the most
recent browser fingerprint by simply fooling the user into visiting an attacker designed
website. Given this, the fraud-detection algorithm cannot thwart our attack solely based
on browser fingerprinting. It needs some additional metrics to detect fraud.


8   Discussion

Potential Attack Detection: The web service may detect our attack if the adversary
does not follow the correct data format, provides invalid data, or takes time longer than
the set time limit. However, the attack can remain undetected if the adversary carefully
provides the correct and valid spoofed data within the set time limit. To use the script
injection approach, the attacker should use a valid value to replace the Javascript API
values, e.g., in the Date() object, ‘year’ should be replaced with ‘year’ (not ‘month’).
When employing the script modification approach, the attacker has to use the correct
data format in the return value, e.g., ‘2020-04-12’ can be replaced with ‘2020-03-29’,
but not with ‘2020.04.12’. We note that the spoofed date should not be older than the
current date. To detect our attack, the web service may periodically request a response
from the website running in the client machine, e.g., request the current time for every
5 seconds. When modifying the script, the adversary needs to stop all the scripts on
the website, and thus prevent the website from sending the response to the web service.
When the web service does not receive the expected response from the client machine
in a timely manner, it can detect the potential attack. However, the attacker can use a
pre-designed script to overwrite the existing scripts in the targeted website. The use of
such a pre-designed script automates the script modification process, thereby defeating
the above detection approach.
Limitations and Future Work: Although the fingerprinting techniques, considered
in our study, utilize many of the attributes, they exclude several attributes used in
other fingerprinting algorithms, such as the ones related to network and protocols (e.g.,
TCP/IP stack fingerprinting [34], DNS resolver [37]), and the hardware sensors [28]
18      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

on the performance of our attack. The impact of these attributes on the performance
of our attack has not been assessed in our study. Further investigation is needed to
explore this direction. As noted earlier, the current dataset is insufficient to evaluate
the performance of fingerprinting algorithms and that of our attacks after 130 tracking
days. Further study with a larger dataset would be needed to assess the performance of
our attack for a longer tracking period. Our study assumes that the attacker can fully
spoof all browser information obtained from the victim’s device. In some scenarios,
the spoofed information may be outdated. In such a scenario, only partial browser
information is correctly spoofed that may impact our attack. Future work would be
needed to evaluate the impact of partial spoofing on the performance of our attack.
Furthermore, an ethically-sound study of attacking personalized ads, authentication and
fraud detection schemes that use fingerprinting in the real world via Gummy Browsers
should be conducted in future work. Our spoofing methods (detailed in Section 4.2)
can also be extended as an evasion technique that can obfuscate the true user’s identity
by creating and supplying a fake browser fingerprint to the visiting website. Similar to
Gummy Browsers, the evasion can be oblivious to the target website. The impact of
such evasion and subtle difference between Gummy Browsers and the evasion technique
should be evaluated and discussed further in future work.

9    Conclusion
In this paper, we identified a novel and serious threat akin to the well-studied and popular
notion of browser fingerprinting. Specifically, we showed that an attacker can make its
own browser appear as the victim’s browser by simply capturing (through an attacker-
controlled or a malicious website) and mimicking the browser fingerprint (through
script injection/modification or the leveraging browser’s built-in settings and debugging
tools). By exploiting this threat, we introduced and designed Gummy Browsers, an
attack system that would enable a malicious entity to subvert any web application that
uses browser fingerprinting, for example, to glean various sensitive information about
the user in a targeted advertising application and to compromise the security of online
defensive schemes, such as user authentication and fraud detection. We employed state-
of-the-art browser fingerprinting techniques, Panopticlick and FP-Stalker, and evaluated
the performance of Gummy Browsers against these algorithms. Our results showed
that Gummy Browsers can successfully impersonate the victim’s browser transparently
almost all the time without affecting the tracking of legitimate users. Since acquiring
and spoofing the browser characteristics is oblivious to both the user and the remote
web-server, Gummy Browsers can be launched easily while remaining hard to detect.
The impact of Gummy Browsers can be devastating and lasting on the online security
and privacy of the users, especially given that browser-fingerprinting is starting to get
widely adopted in the real world. In light of this attack, our work raises the question of
whether browser fingerprinting is safe to deploy on a large scale.

References
 1. Fusion middleware administrator’s guide for oracle adaptive access manager
    (2015), https://docs.oracle.com/cd/E40329_01/admin.1112/e60557/finger.h
                                              Title Suppressed Due to Excessive Length          19

    tm#AAMAD6186, last Accessed: April 17, 2020
 2. Change navigator.platform on chrome, firefox, or ie to test os detection
    code (2016), https://stackoverflow.com/questions/38808968/change-navigat
    or-platform-on-chrome-firefox-or-ie-to-test-os-detection-code, last Ac-
    cessed: April 23, 2020
 3. Javascript obfuscator tool (2016), https://obfuscator.io/, last access June 13, 2021
 4. Chrome devtools | tools for web developers | google developers (2020), https://develo
    pers.google.com/web/tools/chrome-devtools, last Accessed: April 23, 2020
 5. Configuration editor for firefox (2020), https://support.mozilla.org/en-US/kb/a
    bout-config-editor-firefox, last Accessed: April 17, 2020
 6. Device / browser fingerprinting - heuristic-based authentication (2020), https://docs.s
    ecureauth.com/pages/viewpage.action?pageId=37225209, last Accessed: April 15,
    2020
 7. Device fingerprinting (2020), https://www.ipqualityscore.com/device-fingerp
    rinting, last Accessed: April 23, 2020
 8. Device intelligence | prevent fraud | accertify (2020), https://www.accertify.com/pr
    oducts/device-intelligence/, last Accessed: May 1, 2020
 9. Fraud detection api demo (2020), https://fingerprintjs.com/demo, last Accessed:
    June 6, 2020
10. Github-fingerprintjs/fingerprintjs (2020), https://github.com/fingerprintjs/fin
    gerprintjs, last Accessed: October 5, 2020
11. How to detect screen resolution with javascript (2020), https://www.tutorialrepubl
    ic.com/faq/how-to-detect-screen-resolution-with-javascript.php, last Ac-
    cessed: April 30, 2020
12. How to detect that javascript and/or cookies are disabled? (2020), https:
    //stackoverflow.com/questions/4603289/how-to-detect-that-javascrip
    t-and-or-cookies-are-disabled, last Accessed: April 29, 2020
13. Introducing json (2020), https://www.json.org/json-en.html, last Accessed: April
    29, 2020
14. The json data interchange syntax (2020), https://www.ecma-international.org/pub
    lications/files/ECMA-ST/ECMA-404.pdf, last Accessed: May 1, 2020
15. Navigator platform property (2020), https://www.w3schools.com/jsref/prop_nav_
    platform.asp, last Accessed: April 27, 2020
16. Navigator.donottrack (2020), https://developer.mozilla.org/en-US/docs/Web/A
    PI/Navigator/doNotTrack, last Accessed: April 22, 2020
17. Panopticlick (2020), https://panopticlick.eff.org/, last Accessed: June 8, 2020
18. Selenium automates browsers. that’s it! (2020), https://www.selenium.dev/, last Ac-
    cessed: April 18, 2020
19. Webgl: 2d and 3d graphics for the web (2020), https://developer.mozilla.org/en
    -US/docs/Web/API/WebGL_API, last Accessed: April 30, 2020
20. Window.localstorage (2020), https://developer.mozilla.org/en-US/docs/Web/A
    PI/Window/localStorage, last Accessed: April 21, 2020
21. Javascript deobfuscator and unpacker (2021), https://github.com/lelinhtinh/de4j
    s, last access June 13, 2021
22. Alaca, F., Van Oorschot, P.C.: Device fingerprinting for augmenting web authentication:
    classification and analysis of methods. In: Proceedings of the 32nd Annual Conference on
    Computer Security Applications (2016)
23. Alvestrand, H.: Content language headers. Tech. rep., RFC 3282, May (2002)
24. Beltran, V., Bertin, E., Crespi, N.: User identity for webrtc services: A matter of trust. IEEE
    Internet Computing (2014)
20       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

25. Boda, K., Földes, Á.M., Gulyás, G.G., Imre, S.: User tracking on the web via cross-browser
    fingerprinting. In: Nordic conference on secure it systems (2011)
26. Bolton, R.J., Hand, D.J.: Statistical fraud detection: A review. Statistical science (2002)
27. Castelluccia, C., Kaafar, M.A., Tran, M.D.: Betrayed by your ads! In: International Sympo-
    sium on Privacy Enhancing Technologies Symposium (2012)
28. Das, A., Borisov, N., Caesar, M.: Tracking mobile web users through motion sensors: Attacks
    and defenses. In: National Down Syndrome Society (2016)
29. Eckersley, P.: How unique is your web browser? In: International Symposium on Privacy
    Enhancing Technologies Symposium (2010)
30. FaizKhademi, A., Zulkernine, M., Weldemariam, K.: Fpguard: Detection and prevention of
    browser fingerprinting. In: IFIP Annual Conference on Data and Applications Security and
    Privacy (2015)
31. Fifield, D., Egelman, S.: Fingerprinting web users through font metrics. In: International
    Conference on Financial Cryptography and Data Security (2015)
32. Florian: Device fingerprinting for fraud reduction - how and why does it work? (2019), ht
    tps://seon.io/resources/device-fingerprinting/, last Accessed: April 23, 2020
33. Garrett, J.J., et al.: Ajax: A new approach to web applications (2005)
34. Glaser, T.: Tcp/ip stack fingerprinting principles (2000), https://www.giac.org/pap
    er/gsec/159/tcp-ip-stack-fingerprinting-principles/100625, last Accessed:
    April 20, 2020
35. Hoofnagle, C.J., Soltani, A., Good, N., Wambach, D.J.: Behavioral advertising: The offer you
    can’t refuse. Harv. L. & Pol’y Rev. (2012)
36. Iqbal, U., Shafiq, Z., Qian, Z.: The ad wars: retrospective measurement and analysis of anti-
    adblock filter lists. In: Proceedings of the 2017 Internet Measurement Conference (2017)
37. Kim, T., Ju, H.: Effective dns server fingerprinting method. In: 2011 13th Asia-Pacific Network
    Operations and Management Symposium (2011)
38. Kristol, D., Montulli, L.: Http state management mechanism. Tech. rep. (2000)
39. Lu, G., Coogan, K., Debray, S.: Automatic simplification of obfuscated javascript code. In:
    International Conference on Information Systems, Technology and Management (2012)
40. Martherus, R.E., Ramamurthy, S.: User authentication (2007), https://patentimag
    es.storage.googleapis.com/cb/d5/f8/e9d54ed4a44f0c/US7194764.pdf, last Ac-
    cessed: April 29, 2020
41. Melicher, W., Sharif, M., Tan, J., Bauer, L., Christodorescu, M., Leon, P.G.: (do not) track
    me sometimes: Users’ contextual preferences for web tracking. Proceedings on Privacy
    Enhancing Technologies (2016)
42. Mesbah, A., Mirshokraie, S.: Automated analysis of css rules to support style maintenance.
    In: 2012 34th International Conference on Software Engineering (ICSE) (2012)
43. Mowery, K., Bogenreif, D., Yilek, S., Shacham, H.: Fingerprinting information in javascript
    implementations. In: Proceedings of W2SP (2011)
44. Mowery, K., Shacham, H.: Pixel perfect: Fingerprinting canvas in html5. Proceedings of
    W2SP (2012)
45. Mulazzani, M., Reschl, P., Huber, M., Leithner, M., Schrittwieser, S., Weippl, E., Wien, F.:
    Fast and reliable browser identification with javascript engine fingerprinting. In: Web 2.0
    Workshop on Security and Privacy (W2SP) (2013)
46. Neal, J.: Detect autofill in chrome, edge, firefox, and safari (2020), https://gist.git
    hub.com/jonathantneal/d462fc2bf761a10c9fca60eb634f6977, last Accessed: April
    25, 2020
47. Norte, J.C.: Advanced tor browser fingerprinting. Mar-2016.[Online] (2016),
    http://jcarlosnorte.com/security/2016/03/06/advanced-tor-browser-f
    ingerprinting.html, last Accessed: April 22, 2020
                                             Title Suppressed Due to Excessive Length         21

48. Olejnik, Ł., Acar, G., Castelluccia, C., Diaz, C.: The leaking battery. In: Data Privacy Man-
    agement, and Security Assurance (2015)
49. Roesner, F., Kohno, T., Wetherall, D.: Detecting and defending against third-party tracking
    on the web. In: Presented as part of the 9th {USENIX} Symposium on Networked Systems
    Design and Implementation ({NSDI} 12) (2012)
50. Spirals-Team: Spirals-team/fpstalker (2020), https://github.com/Spirals-Team/FP
    Stalker, last Accessed: April 23, 2020
51. Taylor, D.G., Lewin, J.E., Strutton, D.: Friends, fans, and followers: do ads work on social
    networks?: how gender and age shape receptivity. Journal of advertising research (2011)
52. Tucker, C.E.: The economics of advertising and privacy. International journal of Industrial
    organization (2012)
53. Vastel, A., Laperdrix, P., Rudametkin, W., Rouvoy, R.: Fp-stalker: Tracking browser finger-
    print evolutions. In: 2018 IEEE Symposium on Security and Privacy (SP) (2018)
22      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

Appendix

A     Examples of Applying Spoofing Methods

Below we describe how we spoof different attributes listed in Table 1.
C1: Browser-provided Information: To spoof user-agent (C1-1), cookie enabled (C1-
5), and do not track (C1-12) attributes, we used all three spoofing approaches mentioned
earlier. A separate script can also be designed to overwrite respective JavaScript APIs –
navigator.userAgent, navigator.cookieEnabled and navigator.doNotTrack
through script injection such that they return the spoofed value when they are invoked.
We employ the following approach when using browser setting and debugging tool. In
the Google Chrome browser, we set the user-agent through its debugging tool. In the
Firefox browser, we set the user-agent in its about : config setting page. The cookie
enable and do not track attribute can be easily spoofed by simply going through the
browser setting. These three attributes can also be spoofed by changing their associated
variables in the object being sent to the remote server, i.e. through script modification.
    We utilize the script injection and script modification methods to spoof system time
(C1-3), battery information (C1-4), Platform (C1-8), and resolution (C1-11). To spoof
WebGL (C1-2) information, WebRTC characteristics (C1-6), password autofill feature
(C1-7), and local storage (C1-10) attributes, we employ the script modification method.
The remote server may verify the validity of WebRTC information based on the browser
version and the operating system. Fortunately, these attributes can also be spoofed. For
spoofing the language, we used the browser setting option.
C2: Inference based on Device Behavior: We used script modification approach to
spoof all the attributes in this category, such as canvas information (C2-1), system
performance (C2-2), font list (C2-3), scroll wheel related attributes (C2-4), and CSS
feature (C2-5). Specifically, we changed the variables related to these attributes in the
return object before sending it to the remote web server.
C3: Extensions and Plugins: For spoofing the plugins information (C3-1), we used
the script injection and script modification methods. We overwrite the JavaScript
navigator.plugins API to modify the plugins attributes with the spoofed values.
We also changed the related variable in the server’s return object for spoofing. We used
script modification approach to spoof the browser extension related attributes (C3-2).
The website script can inspect if an extension has been installed in the browser. If the
ads field in the website is replaced or deleted, it shows that the browser may have the
extension to block the ads. We used script modification to change these results.


B     Visual Attack and Results

B.1   Visual Attack

We have introduced the visual attack against Panopticlick site. In this section, we will
describe how we attack FingerprintJS site and a real-life fingerprint service.
Attacking FingerprintJS Site: Unlike the Panopticlick website, the FingerprintJS pro
service website does not show all the fingerprint features, but it provides the user’s
                                          Title Suppressed Due to Excessive Length      23

browsing history which can help to prove that our spoofing is successful. We use the
browser setting and debugging tool to spoof the user-agent and languages, and use
the script modification approach to spoof other features collected by the FingerprintJS
website. Figure 12 in Appendix B presents a snapshot of the FingerprintJS dashboard
showing fingerprint information when a user uses the Google Chrome browser on a
Windows machine, i.e., “Win+Chrome”. Since we were not sure if all values in the
return object (e.g., ‘rid’, ‘cv’, ‘url’, etc) are used to construct the unique ID at the
FingerprintJS remote server, we spoofed all the variables extracted from the browser.
Attacking Real-Life Fingerprinting Service: Attacking a real-world fingerprinting
based service can test the strength of our spoofing attack. Although FingerprintJS pro
service did not provide all the fingerprint features they used in their service on the
result page, FingerprintJS pro service website has the open source code [10] which can
output all the fingerprint features in browser console. We deployed this open source
script on our own server without making any changes and called this website Test-
ing Site, then used Script Injection and Script Modification to do the attack. We did
not combine those two methods together. Each attack method can be seen as an in-
dependent attack. In Script Injection, we used selenium to change all the fingerprint
features that are used in the FingerprintJS open source code except fonts, and then
visit the Testing Site. We changed supported fonts in the operating system language
setting. In Script Modification, we first set break point at the beginning of the Test-
ing Site. This break point is set in the browser debugging tool, not the server. Then
we spoofed all the values in the return value in the script main function, as those
values are all fingerprint feature values and haslied detection values. haslied detec-
tion functions include hasLiedLanguagesKey, hasLiedResolutionKey, hasLiedOsKey
and hasLiedBrowserKey. hasLiedLanguagesKey checks the consistency of values in
two APIs “navigator.languages” and “navigator.language”. hasLiedResolutionKey com-
pares if value of APIs “window.screen.width” is less than “window.screen.availWidth”,
or “window.screen.height” is less than “window.screen.availHeight”. hasLiedOsKey de-
tects if the operating system value in APIs “navigator.userAgent”, “navigator.oscpu” or
“navigator.platform” are spoofed. hasLiedBrowserKey extracts value in APIs “naviga-
tor.userAgent” and “navigator.productSub” to find the spoofed browser features. This
experiment demonstrates that we can effective execute the spoofing attack against any
real-life service that deploys this FingerprintJS open source code.

B.2   Result
Result: Attacking Panopticlick Site: Figure 8 shows a snapshot of the actual device
information shown by the Panopticlick website when using the Mac+Chrome setting.
To spoof the fingerprint of the victim’s device, i.e., Win+Firefox, (as shown in Figure 7),
we employed the three methods discussed earlier in Section 3.2 such that Mac+Chrome
(i.e., the attacker’s device) appears as Win+Firefox (i.e., the victim’s device). After
spoofing using Mac+Chrome, the Panopticlick website shows the browser information
as depicted in Figure 10, which is exactly the same as that when using Win+Firefox (i.e.,
the victim’s device). This indicates that our spoofing methods were successful in repli-
cating the victim’s browser fingerprint. We were even able to spoof the Google Chrome
browser on the Android phone, the Android+Chrome setting, and the Tor browser on
24      Zengrui Liu, Prakash Shrestha, and Nitesh Saxena

the Mac laptop, the Mac+Tor setting, using Mac+Chrome. Figure 9 and Figure 11 show
the snapshots of spoofing Android+Chrome and Mac+Tor using Mac+Chrome, respec-
tively. We achieved similar results when spoofing the device information obtained from
various other terminal-browser combinations using the Mac+Chrome setting. This in-
dicates that our spoofing methods succeeded to spoof all the fingerprinting information,
regardless of the victim’s terminal-browser combination.
Result: Attacking FingerprintJS Site: Figure 13 and Figure 12 present the snapshots
of original device information corresponding to the attacker and the victim, respectively,
when they visit the FingerprintJS website. Figure 14 shows the snapshot of the attacker’s
device information when he has spoofed the victim’s device information. As can be seen
from the figure, we could check the victim’s browsing history after spoofing.
Result: Attacking Real-Life Fingeprinting Services: In attacking Testing site that
deployed the FingerprintJS open source code, our two attack methods Script Injection
and Script Modification all successfully spoofed all the 29 fingerprinting features listed
in the script, and passed four haslied detection functions which are used to detect if the
current visit used spoofed fingerprinting features or not. We picked the Windows-Firefox
as the victim device operating system and browser setting, and used Mac-Chrome as the
attacker device.
                                            Title Suppressed Due to Excessive Length         25




Fig. 7: Victim User: The original features of combination “Win+Firefox”. Testing website: Panop-
ticlick
26       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena




Fig. 8: Attacker (before the attack): The original features of combination “Mac+Chrome”. Testing
website: Panopticlick




Fig. 9: Attacker (after the attack): The spoofed features of combination “Android+Chrome”. Test-
ing website: Panopticlick
                                            Title Suppressed Due to Excessive Length         27




Fig. 10: Attacker (after the attack): The spoofed features of combination “Win+Firefox”. Testing
website: Panopticlick




Fig. 11: Attacker (after the attack): The spoofed features of combination “Mac+Tor”. Testing
website: Panopticlick
28       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena




Fig. 12: Victim User: The original features of combination “Win+Chrome”. Testing website:
FingerprintJS




Fig. 13: Attacker (before the attack): The original features of combination “Mac+Chrome”. Testing
website: FingerprintJS
                                                   Title Suppressed Due to Excessive Length                29




Fig. 14: Attacker (after the attack): The spoofed features of combination “Win+Chrome”, showed
in Google Chrome of combination “Mac+Chrome”. Testing website: FingerprintJS



C     Example of Script Injection

An example script to overwrite the platform information acquired through
navigator.platform API [2] is presented below.
var Injectcode = ‘ ‘ Object . defineProperty ( navigator , ‘ platform ’ ,{ get : function ( ) { r e t u r n
            ‘my p l a t f o r m ’ ; } } ) ; " ;
v a r s c r i p t = document . c r e a t e E l e m e n t ( ‘ s c r i p t ’ ) ;
s c r i p t . a p p e n d C h i l d ( document . c r e a t e T e x t N o d e ( I n j e c t c o d e ) ) ;
( document . h e a d | | document . d o c u m e n t E l e m e n t ) . a p p e n d C h i l d ( s c r i p t ) ;
s c r i p t . parentNode . removeChild ( s c r i p t ) ;

    In the example script above, a new object navigator.platform is defined with the
value “my platform”. The object is then injected at the start of all the scripts extracted
from the target website. Given this, when the script calls the navigator.platform
API, it receives the spoofed value, i.e., “my platform”, because the original API object
has been overwritten by the injected object.
    Thus, when using such codes (added as a browser extension or ran in Selenium),
the remote web server would always receive the spoofed values added by the injected
30       Zengrui Liu, Prakash Shrestha, and Nitesh Saxena




               (a) FP-Stalker [50]                              (b) Our Result
Fig. 15: Average of maximum tracking duration (in terms of days) as a function of collect frequency
for three different browser fingerprinting techniques.




              (a) FP-Stalker [50]                              (b) Our Result
Fig. 16: Average number of IDs assigned per user as a function of collect frequency for the three
different fingerprinting algorithms.
codes. In theory, any of the Javascript APIs can be self-designed and/or overwritten.
However, the getOwnPropertyDescriptor API can be used to detect if any specific
property exists in a web object or property. This API returns “undefined” if a property,
say navigator.platform, has not been defined or overwritten. It returns an object
if the property exists and has been overwritten. Fortunately, we can also overwrite the
getOwnPropertyDescriptor API itself such that it always returns “undefined”, in-
dicating there has not been any manipulation on the object. Therefore, any detection
mechanism solely based on JavaScript would not work on script injection and modifi-
cation. Thus, our spoofing method is hard to detect as noted in Table 1. As this method
pre-changed the API values, attacks using this method can be finished automatically.


D    Performance Comparison of FP-Stalker Implementation

Figure 15b and Figure 16b show the average of maximum tracking duration and the
average number of IDs assigned per user as a function of collect frequency for three
different browser fingerprinting techniques, respectively.
