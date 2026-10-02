---
type: Article
title: "Phish in Sheep's Clothing: Exploring the Authentication Pitfalls of Browser Fingerprinting"
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:24:12+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu"
    title: "Phish in Sheep's Clothing: Exploring the Authentication Pitfalls of Browser Fingerprinting"
    author: Xu Lin, Panagiotis Ilia, Saumya Solanki, Jason Polakis
  - id: capture
    resource: "https://web.archive.org/web/20221229183041/https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu"
also_at:
  - "https://www.usenix.org/system/files/sec22-lin-xu.pdf"
  - "https://www.usenix.org/system/files/sec22fall_lin-xu.pdf"
  - "https://www.usenix.org/system/files/sec22_slides-lin_xu.pdf"
authors:
  - Xu Lin
  - Panagiotis Ilia
  - Saumya Solanki
  - Jason Polakis
canonical_url: ""
cited_by:
  - "2022.md:65"
commit: ""
content_sha256: 806e82b7aa2d62b88714f4a5efe4d51d9d39c1d583f85c41e82518d9cee6e1e8
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 4e9a4185f215b844a7f6488fc3866bb9599e14201ef97bf107ab1286f22e6411
retrieved_from: "https://www.usenix.org/system/files/sec22-lin-xu.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:24:12+00:00"
slug: usenix-org-phish-sheep-s-clothing-exploring-authentication-fingerprinting
snapshot: 20221229183041
title_english: ""
translation_file: ""
translation_of: ""
---

# Phish in Sheep's Clothing: Exploring the Authentication Pitfalls of Browser Fingerprinting

**Phish in Sheep's Clothing: Exploring the Authentication Pitfalls of Browser Fingerprinting** - Xu Lin, Panagiotis Ilia, Saumya Solanki, Jason Polakis, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu>
- Also published at: <https://www.usenix.org/system/files/sec22-lin-xu.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22fall_lin-xu.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22_slides-lin_xu.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-lin-xu.pdf (live) on 2026-08-19
- Capture timestamp: 20221229183041
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Phish in Sheep’s Clothing: Exploring the
Authentication Pitfalls of Browser Fingerprinting
             Xu Lin, Panagiotis Ilia, Saumya Solanki, and
             Jason Polakis, University of Illinois at Chicago
    https://www.usenix.org/conference/usenixsecurity22/presentation/lin-xu




    This paper is included in the Proceedings of the
           31st USENIX Security Symposium.
                 August 10–12, 2022 • Boston, MA, USA
                              978-1-939133-31-1




                                     Open access to the Proceedings of the
                                      31st USENIX Security Symposium is
                                            sponsored by USENIX.
                                  Phish in Sheep’s Clothing:
                Exploring the Authentication Pitfalls of Browser Fingerprinting

                            Xu Lin, Panagiotis Ilia, Saumya Solanki, and Jason Polakis
                     University of Illinois at Chicago, {xlin48, pilia, ssolan5, polakis}@uic.edu



                           Abstract                                   to users. In fact, OWASP reports broken authentication as the
                                                                      second biggest risk in its list of top web application risks [11].
   As users navigate the web they face a multitude of threats;
                                                                      Additionally, phishing remains the most common account
among them, attacks that result in account compromise can be
                                                                      compromise vector for major web services [23, 68].
particularly devastating. In a world fraught with data breaches
                                                                          To prevent unauthorized access, online services often em-
and sophisticated phishing attacks, web services strive to
                                                                      ploy various forms of risk-based authentication mechanisms,
fortify user accounts by adopting new mechanisms that
                                                                      which attempt to identify suspicious login attempts [74] (e.g.,
identify and prevent suspicious login attempts. More recently,
                                                                      based on the geolocation of the IP address [58]). When such
browser fingerprinting techniques have been incorporated into
                                                                      attempts are detected, services can take different courses of
the authentication workflow of major services as part of their
                                                                      action, with two-factor authentication (2FA) being the de facto
decision-making process for triggering additional security
                                                                      defense for fortifying accounts against hijacking attacks. In
mechanisms (e.g., two-factor authentication).
                                                                      most cases 2FA significantly raises the bar, as attackers will
   In this paper we present the first comprehensive and in-depth
                                                                      also need to obtain the second factor. Indeed, a study of over
exploration of the security implications of real-world systems
                                                                      350K real-world hijacking attempts against Google accounts
relying on browser fingerprints for authentication. Guided by
                                                                      found that device-based 2FA blocks more than 94% of the
our investigation, we develop a tool for automatically construct-
                                                                      attempts that originate from phishing attacks [30].
ing fingerprinting vectors that replicate the process of target
websites, enabling the extraction of fingerprints from users’             However, due to the usability challenges and friction [73]
devices that exactly match those generated by target websites.        introduced by 2FA [60], sites may attempt to minimize the
Subsequently, we demonstrate how phishing attackers can               inconvenience by reducing the frequency of 2FA challenges so
replicate users’ fingerprints on different devices to deceive the     that they are only shown when a login attempt presents some
risk-based authentication systems of high-value web services          risk. If the site determines that the user entering the credentials
(e.g., cryptocurrency trading) to completely bypass two-factor        is indeed the account owner, it will not trigger 2FA. To achieve
authentication. To gain a better understanding of whether at-         that, sites gather information about the user’s “environment”
tackers can carry out such attacks, we study the evolution of         during the authentication process. More recently, as browser
browser fingerprinting practices in phishing websites over time.      fingerprinting [46] has gained significant traction as a web
While attackers do not generally collect all the necessary fin-       tracking vector [16], such device fingerprints have been
gerprinting attributes, unfortunately that is not the case for        incorporated into the risk analysis process so as to augment
attackers targeting certain financial institutions where we ob-       authentication. During the login workflow websites can collect
serve an increasing number of phishing sites capable of pulling       the user’s device fingerprints (e.g., installed fonts, canvas ren-
off our attacks. To address the significant threat posed by our at-   dering) and compare them to the fingerprints collected during
tack, we have disclosed our findings to the vulnerable vendors.       a previous legitimate browsing session. If the values match,
                                                                      this is a strong indication that the login attempt is legitimate
                                                                      and the website can refrain from showing a 2FA challenge.
1    Introduction                                                         Unfortunately, the inherent characteristics of browser finger-
                                                                      prints that render them an attractive authentication-augmenting
The web plays a pivotal role in many facets of everyday               factor also lend them to being used against the authentication
life, and ensuring that user accounts and the sensitive data          process itself. This dichotomy forms the key motivation be-
found therein are protected is of paramount importance.               hind our research. Specifically, browser fingerprints can be triv-
Consequently, account hijacking attacks pose a serious threat         ially generated by any website the user visits through a series



USENIX Association                                                                        31st USENIX Security Symposium          1651
of JavaScript functions, and certain fingerprinting attributes             Overall, as account hijacking remains a serious threat to
remain stable over time [71]. Accordingly, malicious web-              users, 2FA is a crucial component of account protection and
sites can collect users’ fingerprints and use them to mimic the        is typically the last line of defense. While using browser fin-
user’s device, thus negating the protection offered by additional      gerprints for augmenting authentication can prevent certain
authentication mechanisms. While many attacks can lead to              attacks like credential stuffing, our research demonstrates that
account hijacking (e.g., credential stuffing [69], cookie hijack-      it can also have the opposite effect and undermine an account’s
ing [36,62,63]) our main threat model is that of an attacker that      security by allowing attackers to completely bypass any 2FA
has deployed a phishing website, which the victim user visits.         mechanism. Naturally, this poses a significant threat to users.
   In this paper we provide the first, to the best of our knowl-       As such, we present the first comprehensive and in-depth assess-
edge, empirical real-world analysis of the security implica-           ment of the security implications of ancillary authentication
tions of leveraging browser fingerprints for augmenting the            mechanisms, and find that fingerprints must be used in conjunc-
authentication process. Specifically, we provide an in-depth           tion with other signals (e.g., IP address, requiring the presence
investigation of how high-value web services rely on browser           of specific cookies) to prevent our attack. We hope that our
fingerprints, and detail how attackers can generate and misuse         findings will kickstart additional research on the security im-
a user’s fingerprints to completely bypass two-factor authen-          plications of browser fingerprinting and further incentivize
tication. First, we explore popular websites across different          studies on more robust fingerprinting techniques for web au-
high-value categories (e.g., banking, tax-related) and identify        thentication. In summary, our research contributions are:
those that leverage fingerprints during the login process, using       • We present a novel practical attack that demonstrates how
a combination of static and dynamic analysis. Guided by our               phishers can obtain and replicate users’ exact browser
findings, we build a browser extension that identifies and “ex-           fingerprints to deceive risk-based authentication mecha-
tracts” the fingerprinting process deployed by a website and              nisms and eliminate two-factor authentication. We develop
automatically generates the code that will calculate the exact            an automated pipeline for extracting and constructing
fingerprint that the website would create for a specific device.          website-specific fingerprinting vectors, as well as mimicking
This includes techniques like canvas fingerprinting, which re-            a target user’s browser in the targeted websites.
quire specific input data and parameters to produce an identical       • We present an empirical exploration and in-depth analysis
fingerprint. We then incorporate the fingerprinting code of tar-          of the use of browser fingerprinting for augmenting web
geted websites into a testing website; when a user visits the             authentication in the wild. Our experimental evaluation
website it generates the user’s fingerprint for each target web-          reveals that while this is not yet a widespread practice in
site. Subsequently, we visit each website from a different device         general, it is prevalent in high-value services, highlighting
(i.e., the attacker’s device) and try to log into the user’s account      the severe implications of our attack.
by providing the correct credentials. To mimic the user’s device,      • We present a large-scale study on the use of browser
we develop an extension that loads the user’s corresponding               fingerprinting techniques by phishing sites. Our findings
fingerprints for a given website and mimics all the fingerprint-          reveal that this has become an increasingly common
ing attributes that the target website collects. This manipulates         phenomenon, with the majority of phishing sites gathering
the website into considering the attacker’s device to be a known          browser fingerprints. Alarmingly, we identify a series of
device and deciding that 2FA should not be triggered.                     sites generating all the fingerprinting attributes necessary
   We experimentally evaluate our attack against popular                  for bypassing 2FA in major financial institutions.
and highly-valuable websites across different categories and           • In an effort to kickstart remediation, we have disclosed
provide an in-depth analysis and assessment of the inner                  our findings and offered remediation guidelines to affected
workings of risk-based authentication systems. While our                  vendors. Additionally, we will share our code with other
study reveals that reliance on browser fingerprints as a strong           researchers to foster more research in the area.
signal during the authentication process is not yet widespread,
it is common among critical and high value services (e.g.,             2   Background and Threat Model
financial). We are able to bypass the security offered by
risk-based authentication in ten of the 16 (62.5%) popular             Here we briefly present pertinent background information and
services we tested (including a bank, a credit card company,           then define the threat model that will guide our analysis.
and a cryptocurrency trading service). In practice, our attack is         Browser fingerprinting. Cookie-based tracking has been
only ineffective against a subset of the services that require the     an unavoidable aspect of web browsing for more than two
attacker to obtain an IP address used by the victim in the past.       decades [33, 34, 48]. However, with average users becoming
Finally, we conduct an extensive exploration of the phishing           more privacy-aware and browsers deploying anti-tracking de-
ecosystem and identify rampant deployment of browser                   fenses, cookie-less tracking techniques have come to the fore-
fingerprinting, including advanced techniques. Our analysis            front [53]. In fact, browser fingerprinting has garnered signifi-
reveals that phishers already collect sufficient information to        cant attention from the security community, resulting in a mul-
carry out our attacks in a subset of the analyzed websites.            titude of measurement studies and fingerprinting techniques



1652    31st USENIX Security Symposium                                                                           USENIX Association
being demonstrated [25, 32, 38, 40, 43, 45, 46, 52, 64, 66, 71].      attempt originates from a known device, i.e., the user’s device.
In a nutshell, browser fingerprinting is a stateless approach         In essence, our attack leverages the use of browser fingerprint-
to tracking users, which identifies a series of attributes that       ing techniques as a part of the risk-based authentication process.
possess “discriminating” power, thus allowing websites to             An overview of our attack is shown in Figure 1. In this section
re-identify users based on unique characteristics of their            we give an overview of our methodology and then describe in
browser and device. All these attributes, including those for         detail how we “extract” the fingerprinting code from vulner-
more advanced fingerprinting techniques, can be obtained              able websites (phase 1) which is incorporated into our attack
through various JavaScript APIs available in modern browsers.         site (phase 2). Finally, we detail the spoofing process when the
   Threat model. Studies have reported that phishing remains          attacker attempts to log into the victim’s accounts (phase 3).
the most common source of account hijacking, even in major               Attack overview.The main observation behind our attack is
services [23, 68]. Preventing phishers and other attackers that       that sites that employ 2FA often “remember” users’ devices dur-
have obtained users’ credentials (e.g., through keyloggers)           ing authentication, so as to minimize friction and skip 2FA for
from gaining access to users’ accounts is a significant               legitimate login attempts. In other words, if the user has visited
authentication challenge, which has contributed to the rise of        these websites in the past from that specific device, they con-
risk-based authentication mechanisms. In our main attacker            sider the login attempt to be low-risk and refrain from asking
model we assume that the attacker is able to trick the user into      the user to solve a 2FA challenge. Through an initial manual ex-
visiting a malicious website and divulging their credentials.         ploration we observed that these websites often rely on HTTP
The malicious website includes JavaScript code that generates         cookies but may also generate and collect browser fingerprints
the exact browser/device fingerprints that the target website         (and in some cases rely on a combination of both) for deter-
would generate for that specific user (we describe how we             mining whether they have encountered the device in the past.
achieve this in §3.1). To increase the attack’s coverage, the         However, since these fingerprints can be easily collected us-
website also generates site-specific fingerprints for a series        ing JavaScript, our work explores whether we can circumvent
of additional target websites, so as to take advantage of any         authentication mechanisms that rely on browser fingerprinting.
instances of the password being reused [26, 57].                         For our experiments we built a honeysite that plays the role
   While our main threat model is that of a phisher, due to           of the attacker’s phishing site and serves the purpose of col-
the fact that risk-based checks typically occur at login time,        lecting users’ fingerprints. Our honeysite does not rely on a
a large-scale study on cookie-hijacking attacks [31] reported         generic fingerprinting library, such as Fingerprintjs2 but,
a website that prevented cookie hijacking by also employing           instead, tailors the fingerprint-generation process to match that
these checks on requests carrying valid authentication cookies        of a targeted website. For example, if the attacker deploys a
from pre-established sessions. As such, in our evaluation             phishing site that aims to steal the user’s Google credentials, the
we also include an experiment that investigates this specific         site should also replicate Google’s exact fingerprint-generation
scenario. It is, however, important to note that since the attacker   process. To that end, in the preparatory phase of our attack (Fig-
needs the ability to execute JavaScript code to obtain the user’s     ure 1 – phase 1) we visit the target websites and “extract” their
browser fingerprints, this attack is limited to attackers that can    fingerprinting code. That specific code is then incorporated in
execute arbitrary code and also steal the user’s cookies (e.g.,       our honeysite. The reasoning behind this is that any differences
through an XSS attack [47]), thus precluding passive network          in the fingerprinting implementation can result in us generating
eavesdroppers. Moreover, attacks against password managers            values that are different from those that the target website ex-
and autofill [49, 54, 61] could also potentially be used, but we      pects from the user. For instance, our implementation can use
do not explore such attacks in this work.                             different parameters when computing advanced fingerprints
   We emphasize that our threat model focuses on attackers            (e.g., render different images with WebGL or enumerate a dif-
that are able to obtain the user’s browser fingerprints by luring     ferent list of fonts), which would result in different fingerprints.
them to a malicious website, and then submit them from their             By automatically analyzing and replicating the fingerprint-
own device. Our attack is not applicable to other attacks (e.g.,      ing process of target websites, we ensure that the fingerprints
brute-forcing, credential-stuffing that relies on passwords           we collect are generated identically to the ones expected by
leaked in data breaches, etc.). Similarly, if the user visits the     the target websites. We note that an attacker can incorporate
phishing website from a different browser or device than the          the fingerprinting code of multiple sites in the phishing page,
one normally used to log into their accounts, the use of browser      including multiple variations of a fingerprinting function (e.g.,
fingerprints as a risk-based authentication signal would prevent      multiple different images to be rendered through canvas).
the phishing attacker from compromising the user’s accounts.          This allows the attacker to collect fingerprints that can be
                                                                      used to exploit multiple websites. Even though the credentials
3    Misusing Browser Fingerprints                                    collected by the phishing website correspond to the specifically
                                                                      targeted website, in practice, these credentials might be useful
We present a novel attack that allows an attacker to bypass 2FA       for accessing other websites as well, as prior work has found
by deceiving web services into thinking that the attacker’s login     that users often reuse passwords across services [26].



USENIX Association                                                                        31st USENIX Security Symposium           1653
       Figure 1: Overview of our attack workflow that misuses browser fingerprints for bypassing ancillary security checks.


   Our attack’s next phase (Figure 1 – phase 2) revolves around            JavaScript objects. The injected code hooks various
an unsuspecting user being tricked into visiting the phishing           properties of the Navigator, Window and Screen objects.
site and providing their credentials 1 . When visiting the at-          These properties provide an abundance of information about
tacker’s site, the page’s JavaScript code (which was extracted          the user’s system/device, and it is a common practice for fin-
from the target sites) will be executed on the client side and          gerprinting scripts to collect these properties. A complete list
generate the fingerprints of the victim’s device 2 that are             of these properties is provided in the Appendix. We note that
required by the target websites for authentication (i.e., the web-      we are not interested in the values of these properties during
site knows this device for that user). With the users’ fingerprints     the code extraction process, as our goal is only to identify
and credentials at their disposal, attackers can now log into the       which properties are being used by the target website. By
victims’ accounts. In the final attack phase (Figure 1 – phase          knowing which properties are needed, our extension generates
3), the attacker visits the target websites for which they have         code that will collect this information in our honeysite.
acquired the victim’s fingerprints, and attempts to log into the           Canvas and WebGL. These two APIs are used for drawing
victim’s accounts 1 . At this point, the attacker spoofs their          graphics using JavaScript. They use the HTML5 <canvas>
own device’s fingerprints to mimic those of the victim’s de-            element; the Canvas API is typically used for drawing 2D
vice 2 . This deceives the target websites’ risk-assessment             images while WebGL for 3D graphics. This fingerprinting
systems into considering the attacker’s device as known. As a           technique draws text and shapes on the canvas and uses
result, they will refrain from presenting a 2FA challenge, thus         ToDataURL() to get a Base64-encoded representation of the
allowing the attacker to gain access to the victim’s accounts 3 .       binary pixel data of the image [16].
   The two most crucial aspects of our attack are (i) identifying          FP-Extractor identifies when a canvas object is created by
and extracting the fingerprinting code from the vulnerable              hooking the createElement method and checking whether
websites that will be incorporated into the attacker’s site, and        “canvas” is passed as an argument when the method is called.
(ii) spoofing the attacker’s fingerprints to match those of the         When the canvas is created, the extension records the values
victim’s device. We have built two browser extensions that              of its height, width and style.display properties. Then,
streamline these tasks and eliminate the need for manual effort.        it gets the rendering context (CanvasRenderingContext2D,
In the remainder of this section we describe the two extensions         WebGLRenderingContext), and traces all the methods that
and provide technical details about their implementation.               are available to that context (i.e., fillStyle, fillText,
                                                                        strokeStyle, font etc). Since these methods are the ones
3.1    Extraction of Fingerprinting Code                                that specify what is drawn on the canvas, our extension records
                                                                        all the methods called along with their arguments. Finally,
Our FP-Extractor extension runs at “document_start”, so                 it also traces the use of the toDataURL and getImageData
that its content script is executed before any of the site’s scripts.   methods that return the image data. In the case of WebGL, we
The content script injects JavaScript code directly at the top of       also trace the invocations of the getSupportedExtensions,
the page (i.e., with a <script> tag) to be executed first. It is im-    getParameter and getExtension methods that return
portant to ensure that the injected code runs first, as it hooks the    WebGL’s constants and supported extensions. With the infor-
properties and methods that are typically used for fingerprint-         mation recorded, the extension is able to generate and export
ing, in order to keep track of accesses to these properties and         code that replicates the canvas/WebGL fingerprinting code
the relevant API calls with their arguments. Based on the infor-        of the target websites. In its simplest form, this code creates
mation logged, our extension generates and exports JavaScript           the canvas element, initializes the rendering context, draws the
code that corresponds to the exact fingerprinting code of the           respective images on the canvas, and returns the image data.
target website. Our extension currently targets the fingerprint-        Importantly, the images that are drawn and the fingerprints
ing techniques employed by popular libraries and tools (e.g.,           that are generated on the attacker’s website are identical to
FingerprintJS [5], AmIUnique [2], OpenWPM [10]).                        those generated when the victim visits the target website.



1654    31st USENIX Security Symposium                                                                           USENIX Association
   Enumeration of supported fonts. A common technique                     For font fingerprinting, our extension detects when the web-
for fingerprinting fonts is to include multiple <span> elements        site’s code accesses the offsetWidth or offsetHeight prop-
in the page that contain the same text but use a different font        erties of span elements. If the element that is accessed corre-
family in each element. By measuring the dimensions (i.e.,             sponds to a family that is supported by the victim’s browser, as
offsetWidth and offsetHeight) of each span element, the                recorded on the attacker’s website, our extension modifies the
website can determine which fonts are supported by the user’s          values of offsetWidth and offsetHeight to appear differ-
system, as the dimensions of specific elements will deviate            ent from the default ones. On the other hand, if the span element
from those that correspond to fonts that are unavailable (as           corresponds to a font that is not supported, our extension returns
those will all use the same fallback font). For extracting the         the baseline values for this span element. The AudioContext
code that fingerprints fonts, our extension detects when the           API can be used to extract a consistent fingerprint, by exploiting
offsetWidth or offsetHeight properties of a span element               subtle differences in the rendering of a fixed audio waveform.
are accessed, and logs information about the textContent,              Using AudioBuffer.getChannelData() for a generated
fontSize and fontFamily of the span element. In this way,              audio snippet will return an array of floating-point values
the extension obtains the list of fonts that a target website tests.   that represent the sound. We replace the array with the values
The extension then generates and exports code for creating the         from the victim’s machine. Finally, while we did not find any
respective span elements in the attacker’s website and compar-         websites that use canvas fonts for their authentication process,
ing their dimensions for determining which fonts are available.        we describe our approach in the Appendix, for completeness.
                                                                          Essentially, as the implementation of the fingerprinting
                                                                       techniques is identical on the target website and the attacker’s
3.2    Fingerprint Spoofing                                            website (since we extracted it from there), our extension
For basic fingerprints that correspond to properties of the            knows exactly which methods are invoked and which values
Navigator, Window and Screen objects, our FP-Spoofer                   need to be spoofed. Furthermore, it is worth noting that while
extension uses the Object.defineProperty method to                     there exist browser extensions that allow users to spoof their
determine when these properties are being accessed and                 fingerprints, such as CyDec Security Anti-Fp [13] and User-
overrides their values according to the victim’s values. Our           Agent Switcher [15], these are not suitable for carrying out
extension also compares navigator properties, deleting those           our attack as they only support spoofing for basic fingerprints
that do not exist on the victim’s machine and only adding              and cannot be used for advanced or non-generic techniques. A
those that the attacker’s machine lacks. Since websites can list       video demonstration of our spoofing tool’s capabilities against
the properties present in the navigator object, when spoofing          the AmIUnique system is available here [3].
a property with Object.defineProperty we also set it to be
enumerable so that it will be retrieved or looped through with         4   Experimental Evaluation
Object.keys or the for-in loop.
    FP-Spoofer’s background script changes the User-Agent              Our experiments explore the feasibility of our attack for bypass-
request header to match the victim device’s User Agent so              ing 2FA authentication. First we identify a set of potentially
that the two values are consistent, and also spoofs other              vulnerable websites that use fingerprinting and implement 2FA,
headers to make the request consistent. For example, we                and infer whether their risk-based authentication engine lever-
need to spoof Sec-CH-UA to match the User Agent, as well               ages browser fingerprints for “remembering” the user’s device.
as Accept-Language if it differs from the victim’s machine.            Then, we go through a systematic and rigorous testing process
    For canvas and WebGL fingerprinting, our extension detects         to assess whether these websites are susceptible to our attack.
when the toDataURL and getImageData methods are called                     Identifying potentially vulnerable websites. While our
and returns the respective values recorded on the attacker’s           fingerprinting extraction, generation, and spoofing pipeline
website. In general, for spoofing the user’s fingerprints during       is fully automated (§3), identifying a set of candidate target
the attack phase, our extension does not need to manipulate            websites and uncovering the inner workings of their risk-based
any intermediate values. It is sufficient for our purpose to only      authentication requires manual effort. Since a considerable
spoof the final values, that the website checks for determining        amount of manual effort is required for creating accounts
if the fingerprints match those of the authenticating user. In the     on different services and navigating the account settings to
case of canvas fingerprinting we only need to return the Base64        identify and enable 2FA, we focus our efforts on a small set that
value of the image data that was previously recorded on the            are potentially vulnerable to our attack. To that end, we first
attacker’s website for the specific user. For WebGL finger-            run an exploratory process that intends to identify candidate
printing, in addition to toDataURL, our extension also detects         websites that run fingerprinting code on their login page, and
when the getSupportedExtensions, getExtension and                      then determine which of these websites implement 2FA. While
getParameter methods of the WebGL API are called,                      this does not guarantee that all such websites use fingerprinting
and returns the WebGL extensions and constants that were               for authentication, it reduces the set of candidate websites as
recorded previously on the attacker’s website for that user.           it excludes those that do not run any fingerprinting code.



USENIX Association                                                                        31st USENIX Security Symposium           1655
   Discovery of login pages. The first step in this process is            Testing devices. For our experiments we use two devices
to identify websites that support account registration, and to         with different operating systems and browsers. Our pri-
locate their login pages. We follow the methodology of Drakon-         mary device is a MacOS laptop running Chrome (version
akis et al. [31] for detecting pages that include login or registra-   85.0.4183.83), and our secondary device is a Windows laptop
tion forms. If no login forms are detected on the landing page,        running Edge (version 85.0.564.44). The primary device
our crawler follows all the links on the landing page that point       plays the role of the victim’s device, and is the device used for
to pages under the same domain, and analyzes the pages’ URLs           registering the accounts and enabling 2FA. For websites where
for the presence of indicative keywords (e.g., login, sign in etc.).   we test existing personal accounts, this is the device that has
With this approach we have located the login pages of 11,527           been used to access these accounts in the past. In general, our
websites from the Alexa top 20K websites (5,736 and 5,791              primary device is the one that these websites remember and
from the top 10K and the top 10K-20K websites, respectively).          consider as known. On the other hand, the secondary device,
   Fingerprinting detection. We use the Chrome browser                 which represents the attacker’s device, has never been used to
with FP-Extractor installed, and visit the landing and the             access these accounts in the past. We expect websites that use
login pages of the websites that we have detected during the dis-      2FA to consider this device as new and, therefore, to trigger
covery process. When visiting a page our extension logs all fin-       a 2FA challenge when the user logs in using this device. Fur-
gerprinting calls. At this point we do not need our extension’s        thermore, to avoid “polluting” subsequent experiments from
code extraction functionality, but are only interested in log-         the secondary device, we never solve a 2FA challenge when
ging which fingerprinting calls are invoked; this information          presented, so websites will not consider this device as known
is sufficient for determining if a website uses fingerprinting.        in any future attempts since the authentication process fails.
   Determining 2FA support. The next step is to identify the              Testing procedure. We follow a systematic approach for
subset of websites that implement 2FA, out of those that use           testing the candidate websites. We have devised a series of
fingerprinting on their login pages. For this, we first search         specific steps to be followed, and rely on differential testing to
for relevant terms, such as “multi”, “factor”, “authenticator”,        understand how each website’s authentication system behaves,
“remember device” etc., in the login pages’ source code using          how 2FA is triggered, and how our attack can bypass 2FA.
regular expressions. We also expand our set of websites to             More specifically, our methodology tests if a website (i) uses
include websites that we know through personal use that they           2FA during authentication, (ii) uses cookies or fingerprints to
support 2FA. We manually inspect the websites’ source code to          remember devices, and (iii) imposes restrictions based on the
identify which scripts are responsible for authentication, 2FA         device’s IP address. Furthermore, we follow this procedure
and fingerprinting. While using our extension helped us create         twice, once for testing each website’s default settings, and once
an initial set of candidates for our experiment, this does not         after explicitly enabling 2FA, if such an option is available.
provide information about the techniques used at a script-level           For every website to be tested, we first log into our account
granularity. Our manual analysis reveals that websites com-            using our primary device and select the “remember this device”
monly include multiple scripts that implement fingerprinting,          option, if available. Then we logout and re-login, to check
and our extension-based approach cannot differentiate which            if the website does indeed remember the device (i.e., does
functionality was the result of each script. For a more fine-          not present a 2FA challenge). At this point we also log into
grained analysis we use VisibleV8 [42] on the login pages              the website using our secondary device, which has never
of the websites that use fingerprinting, which allows us to log        been used to access this account in the past, and check if a
all native functions and property accesses during JavaScript           2FA challenge is presented. Since the secondary device is
execution, at the granularity of individual scripts. This process      not known to the website, we expect 2FA to be triggered in
provides useful contextual information for our analysis.               this case. For websites that present a 2FA challenge when
                                                                       using the secondary device, while at the same time they
                                                                       appear to remember the primary one, we explore whether
4.1    Experimental Methodology
                                                                       this happens due to the use of fingerprinting. Specifically, we
In the previous step we described our process for identifying          clear all browsing data (e.g., cookies, local storage) on the
websites that are potentially vulnerable to our attack. Here we        primary device and log into the account again. If the website
describe our methodology for testing the candidate websites in         still remembers the device, this is an indication that it uses
order to determine (i) whether they use fingerprints for authenti-     fingerprinting to determine if the device is known.
cation and (ii) if they are indeed susceptible to our attack. Over-       Bypassing 2FA. For the websites that use fingerprinting
all we tested 300 websites; our findings are presented in §4.2.        to remember the user’s device and trigger 2FA when logging
   Account registration. To be able to test these websites,            in from a new device, we use our extension to test if they
we first need to register an account on them and manually log          are susceptible to our attack. We first visit the login page of
into these accounts to enable 2FA if there is such an option           target websites using a browser with FP-Extractor to export
available in the settings. We also provide a valid phone number        JavaScript code that generates the same fingerprint as the
during the account registration or when 2FA is enabled.                target website. Then, we mount this code in our honeysite (i.e.,



1656    31st USENIX Security Symposium                                                                            USENIX Association
attacker’s website) and visit the honeysite with our primary         Table 1: Fingerprinting attributes used by websites with a
device (i.e., victim device) to obtain the device’s fingerprint.     detectable login page (within the Alexa Top-20K).
After acquiring the fingerprint of the victim’s device we log                                   Top 10K       Top 10K-20K
into the target website using the secondary device, where                     Technique       Home   Login    Home   Login
FP-Spoofer will modify the device’s fingerprints to match                     Navigator       5,510   5,403   5,587    5,371
those of the primary device. Our attack is deemed successful                  Window          5,261   5,104   5,272    4,968
if the secondary device does not receive a 2FA challenge.                     Screen          5,209   4,682   5,231    4,473
                                                                              Timezone        5,035   4,617   4,934    4,282
    IP address/Geolocation. We observe that certain websites                  Canvas          1,224   1,254   1,077     879
consider the device’s IP address/geolocation information as                   Canvas Fonts     179     380     142      237
a signal for determining whether 2FA should be triggered or                   WebRTC           221     313     192      210
                                                                              AudioContext     290     351     223      234
not. Specifically these websites check whether the IP address
or IP-based geolocation information (e.g., country, city etc.)
of the device that is currently logging into the account matches     numerous times over the course of multiple months, to ensure
those from previous user logins. Depending on how restric-           the validity of our findings and avoid false positive (i.e.,
tive this check is, it can raise the bar for the attacker or even    labeling an attribute as necessary even though it is not) due
prevent our attack; checks that require IP addresses to match        to some other mechanism being triggered (e.g., multiple
the user’s country or city can be easily bypassed using proxies      consecutive logins triggering a rate-limiting mechanism).
and VPN services. Onaolapo et al. [55] found that attackers
actually employ such strategies in the wild. However, websites
that only accept IP addresses that have been used by the user
                                                                     4.2    Experimental Results
before can pose a significant challenge to the attacker. During      Here we present our experiments exploring the feasibility and
our experiments, we systematically assess this aspect of the         effectiveness of our attack in the wild.
authentication process and use a VPN to test IP addresses from          First, in Table 1 we provide statistics on the prevalence of
different ISPs, cities, and countries. We have also devised a        fingerprinting techniques for websites in the Alexa top 20K
technique that attempts to bypass such IP-based restrictions;        for which we were able to identify their login page (i.e., 5,736
we modify our network requests when running our attack and           and 5,791 websites in the top 10K and top 10K-20K datasets,
include the victim’s IP address (collected when they visited the     respectively). We observe that the majority of websites, in both
phishing page) in an X-Forwarded-For header. This header             datasets, collect basic fingerprints. Furthermore, we observe
is typically used for specifying the originating IP address when     a clear trend of websites in the top 10K dataset employing
traffic goes through a proxy [8]. This allows the attacker to pre-   more advanced fingerprinting techniques on the login pages
tend that they are actually behind the victim’s IP address and are   compared to their home page. The websites in the 10k-20k
using a proxy when attempting to log into the user’s account.        dataset exhibit a more uniform deployment of advanced tech-
    Inferring fingerprinting-based authentication checks.            niques. Notably, while we observe widespread deployment of
In practice, the attacker does not need to know which                fingerprinting vectors, these are not often incorporated into the
fingerprinting attributes collected by a target website are          websites’ authentication process, as we will detail next. We hy-
actually used for the authentication process, as our attack          pothesize that these are more likely used for tracking purposes.
pipeline extracts and replicates all fingerprinting techniques.         We select a subset of 300 popular websites from our
However, for our analysis we are interested in obtaining a           discovery process that implement fingerprinting and support
more fine-grained and in-depth understanding of risk-based           2FA for manual exploration and testing. These were selected
authentication systems that use fingerprints. As such, for           based on our experiment on websites with fingerprinting code
websites that are vulnerable to our attack, we systematically        on their login pages and being listed on [1]. Our experiments
evaluate whether each fingerprinting vector actually affects the     reveal that only 16 out of the 300 websites use fingerprints for
authentication process. Due to the prohibitively large number        remembering the user’s device, while the rest rely on browser
of potential combinations, we follow a strategy based on the         cookies for this. Interestingly, the tested websites included
process of elimination. In more detail, we repeat our attack         four banking and eight tax-preparation websites, of which
multiple times, where in each attempt we remove one of the           two and four respectively use fingerprinting for authentication.
fingerprinting attributes contained in the user’s fingerprint pro-   As such, our experiments indicate that (i) high-value and
file. Depending on whether each attack instance results in 2FA       financial services tend to adopt security mechanisms such
being triggered or not, we can infer whether that specific finger-   as 2FA in order to better protect their users’ accounts, and
printing vector is part of the risk-based authentication checks.     (ii) augmenting the authentication process with fingerprints is
By repeating this process for all the fingerprints collected         disproportionately used among such high-value services, sig-
by that web service, we can identify the absolutely minimum          nifying the severe ramifications of our attack. As 2FA becomes
set of fingerprints required to manipulate the authentication        more prevalent [14], we expect that risk-based authentication
process. It is important to note that we repeat our experiments      that uses fingerprints will also become more common.



USENIX Association                                                                        31st USENIX Security Symposium        1657
Table 2: Risk-based authentication mechanisms in popular web services we evaluated against our attack. For IP address restrictions
we explicitly note if using the X-Forwarded-For header (7→) or IP addresses from the same city (⊗) is effective.
                                                  Fingerprinting Technique            IP Address Restrictions
                                                                                                                Vulnerable
                 Website               Basic FP     Canvas/WebGL     Fonts   Audio    IP Check     Bypass
                 Bank-A                   3               7           7        7         7                  -       3
                 Bank-B                   7               7           7        7         3                  7       7
                 CreditCard               3               7           7        7         3            7 →           3
                 Trading-A                3               7           7        7         7                  -       3
                 Trading-B                7               7           7        7         3              7 →         3
                 Tax-A                    3               3           7        7         3                  7       7
                 Tax-B                    3               3           3        7         7                  -       3
                 Tax-C                    3               3           3        3         7                  -       3
                 Tax-D                    3               3           3        3         3                  7       7
                 eCommerce-A              3               3           7        7         7                  -       3
                 eCommerce-B              3               7           7        7         3                  7       7
                 RideSharing              3               3           3        7         3                7
                                                                                                          →         3
                 Food&Beverage-A          3               7           7        7         3                  ⊗       3
                 Food&Beverage-B          3               7           7        7         3                  7       7
                 AdBlocking               3               7           7        7         3                  ⊗       3
                 WebInfrastructure        3               7           7        7         3                  7       7



   Table 2 details the findings from our attack evaluation on                Our analysis shows that only six of the 16 websites employ
the authentication mechanisms of these 16 websites. Our main              advanced fingerprinting techniques. To make matters worse,
focus here is on the first 14 services which trigger 2FA when             three of the tax-related websites use the default implementa-
a new device is used to access an account. We also include two            tion of Fingerprintjs2 for the advanced fingerprints. This
services (WebInfrastructure, AdBlocking) that highlight                   results in these three websites rendering the same images
additional dimensions of risk-based authentication. Due to the            for canvas fingerprinting and loading the same list of fonts
severity of our attacks and the fact that accounts on certain ser-        for fonts enumeration. We also found that Tax-C and Tax-D
vices are extremely valuable and highly-targeted, we present              use the same audio snippet for audio fingerprinting (Tax-B
them in an anonymized form that denotes their category.                   employs an earlier version of Fingerprintjs2 that does not
   As can be seen in Table 2, our attack can successfully bypass          support audio fingerprinting). As a result, an attacker who uses
2FA in 9 out of the 14 websites. The five websites that are not           Fingerprintjs2 (or the code extracted from one of these
vulnerable to our attack require the device’s IP address to match         websites) can obtain the fingerprinting values required for
one of the IP addresses previously used to access that account,           bypassing 2FA in all three websites. To further explore this
and are not deceived by our X-Forwarded-For ploy. Further-                issue, we visited the websites of 10 additional popular banks
more, we found that 12 of the 14 websites use fingerprinting to           to check whether they use advanced fingerprinting techniques,
determine if the authenticating device is known and whether               and observed significant overlap across the images and fonts
2FA should be triggered or not. From the total of 14 websites             lists they use. Even though each website renders between 1-5
that use fingerprinting, eight rely on basic fingerprints (e.g.,          images, there are only nine images and two random images in
properties of navigator, window, etc.), and six of the tested             total across the ten websites. Two websites with JS font finger-
websites use more advanced fingerprints for authentication like           printing use identical font lists, and five websites with canvas
canvas/WebGL and fonts. Finally, two of those also use audio              font fingerprinting use one of two font lists. The two sites with
fingerprinting for the purpose of authentication. We provide              audio fingerprinting render the same audio wave form.
additional details for interesting use cases in the Appendix.                IP constraints. While Bank-B and Trading-B do not use
   Our exploration revealed another dimension of the use of               any JavaScript-based fingerprinting attributes but only rely on
fingerprinting for authentication. Basic fingerprints remain the          the UserAgent HTTP header, which can be trivially spoofed,
same across different sites, since they correspond to the user’s          we include them in our analysis to illustrate the challenge
system characteristics and properties and do not change as long           posed by IP address checks as well as the dangers of trust-
as the environment remains the same. For advanced fingerprint-            ing X-Forwarded-For. In more detail, regarding IP-based
ing techniques, however, a site is able to make its users generate        constraints, we found that only 11 websites perform such
fingerprints that are different from those generated when vis-            checks for determining if the login attempt is suspicious. Our
iting other sites (e.g., by rendering a unique image). While this         attack can bypass the IP address restrictions in three web-
may prevent the attacker from creating “generic” fingerprints             sites using the X-Forwarded-For header in outgoing requests
that can be used on multiple websites, our attack is still effec-         (CreditCard, Trading-B, RideSharing). Moreover, we
tive since we extract the fingerprinting code from each target            found two websites that do not trigger 2FA if the authenticating
website and generate appropriate site-specific fingerprints.              IP address matches the user’s city. With the wide availability



1658    31st USENIX Security Symposium                                                                               USENIX Association
of VPN and proxy services, we consider such coarse-grained          Table 3: Phishing website datasets. JS denotes the websites
checks to be inadequate for protecting valuable accounts.           for which we have JavaScript execution traces, and FP denotes
   Cookie hijacking. Up to this point we have focused on            the phishing sites that collect browser fingerprints.
attackers that have the account credentials (e.g., obtained             Dataset        Time Period           Sites     JS       FP
through phishing), as that is the most common account                   Phish-A   31/05/2018 - 19/06/2019   71,343    39,618   29,312
hijacking vector according to prior research [23]. Nonetheless,         Phish-B   31/10/2018 - 05/05/2020   82,431    40,777   36,733
recent work by Drakonakis et al. [31] demonstrated the fea-             APWG      05/05/2020 - 12/04/2021   173,269   93,568   85,491
sibility of cookie-hijacking attacks at scale. More importantly,
the authors noted the lack of additional fraud-detection checks
(which occur during the log in process) when attackers use          default levels of protection for accounts. Another example
stolen cookies as those belong to sessions that have already        is Tax-B; in our initial experiments it used fingerprinting to
been “validated”. In fact, the authors found only one instance      remember the device but now relies on the presence of cookies
where they were not able to access the victim’s account due         to determine if the device is known. Again, we cannot tell if
to such checks. To that end, we include WebInfrastructure           this change was the result of our recommendations. Our final
to test whether our attack can also be leveraged by cookie          example is that of WebInfrastructure, which matched the
hijackers. For this experiment we visit WebInfrastructure           device’s IP address and User Agent in our initial experiments.
using our primary device, log into our account, and export          However, prior to our disclosure we observed that these checks
WebInfrastructure’s cookies from the browser. Then, we              were removed and we can now successfully access the account
import these cookies into a different browser on our secondary      using “stolen” cookies, regardless of the device or IP address
device, and visit WebInfrastructure. Initially we found             we connect from. We do not know what led to the removal
that we were, indeed, unable to access our account using the        of these additional security checks, but have disclosed our
“stolen” cookies. Upon a more in-depth analysis we found            findings to them and they are currently investigating the issue.
that the site uses the device’s User Agent (obtained through
JavaScript and the HTTP header) to detect suspicious logins,
but also checks the IP address. As such, when attempting to         5     Phishing and Fingerprinting
access the account using the stolen cookies and FP-Spoofer,
we could only gain access if the secondary device’s IP              In this section we focus on the phishing ecosystem and present
address was one previously used by the victim. As such, while       a large-scale exploration of the phishing sites obtaining
fingerprint-spoofing allowed us to pass the corresponding           users’ browser fingerprints. We correlate the information that
checks, the IP address check effectively prevents the attack.       phishers currently collect with the findings from our empirical
   Email alerts. While our experiments focus on bypassing           analysis in §4 to assess whether attackers are already collecting
2FA, we include our analysis of AdBlocking, as it highlights        sufficient fingerprinting attributes for carrying out our attack.
an additional dimension of risk-based authentication. In more          Datasets. Table 3 details the datasets used for our analysis.
detail, AdBlocking accounts have 2FA disabled by default,           We obtained the two datasets (Phish-A, Phish-B) from the
but the service alerts users about successful logins that occur     authors of [76], which include more than 153K phishing
from new devices or from IP addresses that are not from the         sites that appeared over a two-year period. They also include
same city. However, we found that by spoofing the fingerprints      the corresponding JavaScript for 80,395 of the sites. While
we can trick the service into not sending the email alert.          Phish-B does not include labels for the target website (e.g.,
   Behavioral evolution over time. We re-tested affected            if the phishing site is masquerading as Paypal) we cross-
services at least 20 times over a period of six months (04/2021 -   referenced that dataset with information made available by the
09/2021), even after our disclosure. Interestingly, we observed     Anti-Phishing Working Group’s (APWG) eCrime Exchange
cases where the risk-based authentication behavior changed          (eCX) repository, allowing us to obtain the missing labels.
over time. In our initial experiments with Trading-A, their         Finally, we obtained the APWG dataset directly from the eCX
system required the user to solve a 2FA challenge every time, if    repository [12], which provides a more recent and extensive
2FA was explicitly enabled by the user. For the default setting,    snapshot of the phishing ecosystem over an 11-month period.
however, the system used basic fingerprints to determine if         Together, these datasets provide a broad and representative
a 2FA challenge should be presented. When re-analyzing              view of the phishing ecosystem over a three year period.
Trading-A some time after our disclosure, we observed that             JavaScript execution traces. To better understand if phish-
Trading-A now requires the user to provide a phone number           ing websites are using fingerprinting and whether they are
when registering a new account and that 2FA is enabled by           collecting fingerprints that would allow the attacker to carry
default for new accounts. We cannot tell, however, if this          out our attack, we use VisibleV8 to dynamically analyze the
change happened organically, or due to our disclosure and           JavaScript code of the phishing sites in our datasets. For the
recommendations. Surprisingly, 2FA has not been retroac-            Phish-A and Phish-B datasets we were provided with the
tively enabled for existing accounts, resulting in different        HTML files of the phishing websites as well as the JavaScript



USENIX Association                                                                       31st USENIX Security Symposium          1659
    Table 4: Phishing sites that implement fingerprinting.            Table 5: Phishing sites that obtain all the necessary browser
                               Phishing Datasets
                                                                      fingerprints for bypassing 2FA in the target sites. “*” indicates
         Technique       Phish-A    Phish-B      APWG                 a mismatch in fingerprinting function arguments.
         Navigator         27,578      34,650     84,239                                     Phish-A         Phish-B          APWG
                                                                       Target              Sites Bypass   Sites Bypass   Sites Bypass
         Window            24,848      23,650     73,258
         Screen            10,244      26,856     57,633               Bank-A               83      1      685     14     330    74
         Timezone          22,636      28,549     59,251               Bank-B              1,549    -     2,683     -     327     -
         Canvas             3,508      5,395      11,650               CreditCard           89     61       0       0     12      0
         Canvas Fonts         56         91        399                 Trading-A             0     0        0       0      6      6
                                                                       RideSharing           7      0      363     1*    1378    5*
         WebRTC              536        165       1,938
                                                                       WebInfrastructure     0     0        1       1     220   219
         AudioContext        275        363       1,795


                                                                         Table 4 presents the number of phishing sites that collect
files they load. To that end, we deploy them on our own local         various types of fingerprints. The study by Zhang et al. [76] on
server and re-write the origin URL of the JavaScript files loaded     phishing sites’ cloaking strategies reported checks for simple
to point to the corresponding JavaScript files in our datasets.       browser attributes (specifically, the User Agent and whether
This allowed us to analyze phishing sites that are not available      cookies are disabled) on approximately 23% of the phishing
anymore due to the sites being taken down or the original ver-        sites. Our analysis provides a more comprehensive picture of
sions of their JavaScript files not being available anymore. For      the three datasets as we detect all common fingerprinting tech-
the more recent APWG dataset we visit the actual phishing sites,      niques, while also revealing the widespread use of advanced
as this dataset does not include a snapshot of their code. We use     fingerprinting techniques across the phishing ecosystem.
VisibleV8 to load each phishing site and log all the JavaScript       Specifically, we find that in total 28,526, 35,653 and 85,461
calls along with their arguments. To ensure that websites’            (i.e., 39.98%, 43.25% and 49.32%) websites from the three
JavaScript code is executed, we interact with the pages in an         datasets collect basic fingerprints with the majority of them be-
automated way to emulate simple user behavior (e.g., scrolling,       ing properties of the Navigator, and that between 5% and 7%
making random mouse movements and clicks). Based on the               collect advanced fingerprints, with canvas fingerprinting being
JavaScript execution traces that we extract from VisibleV8’s          the most prevalent technique among them. We also explore
logs we determine which fingerprinting techniques each phish-         whether and how phishing sites send fingerprinting values
ing website implements and which attributes are collected.            back to their servers; we provide more details in Appendix E.
   Table 3 presents the phishing datasets we used in our analy-          Bypassing 2FA. Next, we analyze the subset of phishing
sis, the number of websites in each dataset that run JavaScript,      sites that target one of the services from Table 2 and for which
and how many of them are collecting fingerprints. A general           we have their JavaScript execution traces. Specifically, we
observation is that the percentage of phishing websites that          cross-reference the fingerprinting attributes that each phishing
appear to run JavaScript is lower than what we would have             site collects with those necessary for manipulating the target’s
expected, across all 3 datasets (i.e., between 49.46% and             risk-based authentication mechanisms to bypass 2FA. As can
55.53%). We manually checked 25 random phishing sites from            be seen in Table 5, Bank-B is an extremely popular target for
the APWG dataset that did not produce a JavaScript execution          phishing websites. Since Bank-B only relies on the User Agent
trace (recall that for this dataset we visited the actual phishing    HTTP header and does not check navigator.userAgent,
sites) and found that 14 and three return a 404 and 403 error         essentially every phishing site has sufficient information to
respectively, while three other sites show a static page with an      pass the device-based check. Nonetheless we include it here
“account suspended” message. From the remaining websites              as a point of comparison. Additionally, since we do not have
one is a shortened URL that has been flagged by Bitly as              historical information of when the IP-address-based check
potentially harmful, and another uses a shortened URL for             was deployed by Bank-B we cannot conclude how many
a Google Forms site, but has been suspended by Google for             phishing sites would have been able to bypass 2FA in practice.
violating their terms of service. Finally, one site has no content,      On the other hand, we find that Bank-A is not only a popular
one includes an empty local JavaScript file, and one shows a          target, but that the number of phishing sites that collect the
popup window asking for a username and password. As such,             appropriate fingerprints is significantly larger in our most
apart from the unavailability of resources or sites being taken       recent dataset; while 8.1% of the phishing sites are capable
down, we believe that client-side cloaking techniques [76]            of bypassing 2FA in Bank-A across all datasets, in the most
have likely affected the collection of JavaScript across all          recent dataset the ratio climbs to 22.42%. This indicates that
three datasets. Interestingly, for the phishing websites with         phishers are adapting over time to the risk-based mechanisms
JavaScript execution traces, we find that the majority collect        employed by high-value websites like Bank-A. Interestingly,
fingerprints, with 73.98%, 90.08% and 91.36% across the               while we find that six phishing sites collect all the necessary
3 datasets respectively. We also observe an increase in the           fingerprinting attributes used by RideSharing, the actual
number of websites collecting browser fingerprints over time.         arguments passed to two dynamic fingerprinting functions



1660    31st USENIX Security Symposium                                                                            USENIX Association
                                   105                                            Tax-A and WebInfrastructure requested additional details

            Phishing Sites (log)
                                   10
                                     4                                            and proof-of-concept demonstrations, which we provided.
                                                                                  Bank-A, subsequently, verified our attack and is currently
                                   103
                                                                                  working towards a fix. eCommerce-A informed us that they
                                   102                                            were aware of the issue. It is important to emphasize that all
                                                                                  of our experiments were conducted using test accounts or our
                                   101
                                                               Bank-B             personal accounts. We did not interact with or affect other
                                                               Bank-A
                                   10
                                     0
                                                                                  users, nor did we collect browser fingerprints from any users.
                                          6      7         8        9         0
                                    201       201    201         201    202
                                                                                     Fingerprinting and authentication prevalence. While
 Figure 2: Phishing websites targeting Bank-A and Bank-B.
                                                                                  using fingerprints for augmenting the authentication process
                                                                                  is not a new concept [17], our experiments reveal that this has
(for canvas and font fingerprinting) are not the same as those                    yet to become widespread practice. However, as fingerprinting
used by RideSharing, thus rendering their overall fingerprint                     has gained significant traction in recent years, and third-party
a mismatch. Further inspection reveals that in five cases                         libraries have started supporting the use of fingerprints for
the mismatch is due to the phishing sites using the default                       authentication (e.g., [6, 9]), it is likely that such mechanisms
values used by popular fingerprinting libraries, while the final                  will become far more common in the near future. Additionally,
instance is using a library by an anti-bot service.                               our research shows that while in many cases fingerprints
   Longitudinal trends. To get a broader view of phish-                           may be used for augmenting the authentication process, other
ing sites potentially adapting their targets over time, we use                    signals carry more “weight” (e.g., the presence of cookies and
APWG’s eCX service to obtain the phishing domains that tar-                       the device’s IP address). Unfortunately, our experiments show
geted Bank-A and Bank-B between 2016-2020, as shown in                            that high-value services (e.g., banks, tax services) are most
Figure 2. While in 2016 and 2017 the two banks were targeted                      commonly vulnerable to our attack. As such, while the attack
by a comparable number of phishing sites, Bank-B phishing                         that we demonstrate may not yet be a widespread threat, the
sites aggressively increased in 2018 and continued to increase                    severity of the affected web services and the overall implica-
in 2019, but had a sharp decline in 2020. On the other hand, the                  tions of their user accounts being compromised, highlight the
number of phishing sites targeting Bank-A steadily increase                       need for alerting developers about the security implications of
from year to year. While we cannot conclusively infer the root                    leveraging device fingerprints for the authentication process.
cause of this trend without detailed knowledge of the risk-based                  We also hope that our work kickstarts a wider discussion
authentication checks the banks enforced throughout this entire                   within the research community and incentivizes additional
period, Figure 2 and Table 5 indicate that phishing sites may                     research on fingerprinting schemes that are robust to spoofing.
be adapting their targets based on the obstacles presented by                        Attributes. Our extensions target the fingerprinting vectors
risk-based authentication. In other words, since bypassing 2FA                    used by popular libraries and websites. If a website uses custom
in Bank-A currently only requires spoofing certain fingerprints                   techniques or those libraries incorporate additional techniques,
while Bank-B also requires exactly matching the user’s IP                         our extensions would need to be expanded for handling them.
address, Bank-A presents a more attractive target to phishers.
                                                                                     2FA mechanisms. While SMS is the most commonly de-
   Summary. Overall, while our analysis is limited to phishing
                                                                                  ployed 2FA technique, despite its well-documented shortcom-
sites for which we were able to obtain their JavaScript code, our
                                                                                  ings [29,41,51], our attack is not limited to a specific 2FA mech-
findings show that phishing sites are not yet widely replicating
                                                                                  anism but instead provides a method for deceiving the risk-
the fingerprint-generation process of targeted websites.
                                                                                  assessment engine that decides whether a 2FA challenge should
Nonetheless, the cases of Bank-A and CreditCard highlight
                                                                                  be triggered. For instance, eCommerce-A supports the use of
the risks that users face and the need to improve existing
                                                                                  authenticator apps for 2FA, and our attack bypasses that as well.
risk-based authentication deployments, as we discuss in §6.
                                                                                     MITM phishing toolkits like Evilginx [4] allow attackers
                                                                                  to deploy phishing websites with man-in-the-middle capabil-
6   Discussion, Limitations and Defenses                                          ities for using phished credentials to log into target websites
                                                                                  in real time (i.e., when the victim is interacting with the
In this section we further discuss our experiments and findings.                  phishing site) and then also trick the victims into divulging
   Ethics and disclosure. The severity of our attack necessi-                     a 2FA code, thus allowing the attacker to log into the victim
tates the responsible disclosure of our findings to the affected                  account. However, the major limitation of this attack is that in
vendors. As such, we disclosed our methodology and findings                       high-value services that only use short-lived session cookies
to every vulnerable website through their bug bounty programs                     the attacker can only access the victim’s account that one time
or security contact points when those were available. When                        and would fail in future attempts due to the 2FA challenges.
we could not find contact points dedicated to security issues                        Guidelines for vendors. As we demonstrate, certain
we reached out over their general contact email address. At                       techniques for augmenting authentication may actually
the time of writing, six vendors have responded. Bank-A,                          undermine the overall security posture of a given service.



USENIX Association                                                                                   31st USENIX Security Symposium           1661
   Two-factor authentication. In our experiments we found               Anti-fingerprinting defenses. Our attack relies on our
that only 8 of the vulnerable services we have identified offer      ability to accurately obtain and replicate, the user’s browser
an option to mandate that a 2FA challenge has to be passed           fingerprints. As such, defenses [21] offered by browser
for every login attempt (one more site offers that option            extensions or privacy-oriented browsers that alter the user’s
only for transactions). Moreover, in all cases, that option is       fingerprints can potentially mitigate or prevent our attacks.
optional and users have to explicitly enable it. As such, we         However, this depends on the specific fingerprinting attributes
argue that all websites should provide such options, as that         covered by each defense and whether they are used by a
would allow users to fortify their account against our attack,       given website. We also note that such defenses may affect
while also significantly raising the bar for attackers in general.   or break websites’ functionality. In our experiments we also
We believe that this option should be opt-out instead of             visited target websites using Brave as our primary browser,
opt-in, especially in high-value or highly-sensitive services,       which randomizes canvas fingerprints for tracking prevention,
to further nudge users towards improving their security              and observed that sites that use canvas fingerprinting for
hygiene; indicatively, Google recently automatically enrolled        authentication always prompted us to solve 2FA.
150 million users in 2FA [7]. We do note, however, the friction         Future directions. Recent research proposed using finger-
that additional authentication requests and factors can cause.       prints to augment authentication [44] by “chaining” sessions,
This tradeoff between usability and security has been studied        with a random canvas fingerprint being generated in each ses-
extensively [27], and recent reports found that users are in         sion and used for verification in the following session. While
favor of strengthening security in high-value services through       this approach can effectively mitigate the phishing attack we
2FA [59]. Finally, while this is not pertinent to our attack,        present, it is vulnerable to other attacks. Nonetheless, we con-
since it is not affected by the actual form of 2FA mechanism         sider this an important proposal and hope that our work further
selected by the user, vendors should strive to adopt and offer       incentivizes additional research in the area. While an ideal
more secure 2FA options (e.g., U2F, authenticator apps).             countermeasure would remove the need for chaining sessions,
   Risk signals. Our experiments revealed that certain vendors       any approach that does not rely on memory of prior sessions
incorporate fingerprints into the authentication process, but        must solve an inherent challenge: generating a fingerprint in
other signals play an important role and can affect the feasibil-    a manner that cannot be spoofed. Since this is a client-side
ity of our attack. We have identified two signals that vendors       process, such an approach would necessitate leveraging some
should use for identifying suspicious logins and triggering          form of Trusted Execution Environment (e.g., a system like
2FA. First, we found that certain sites will always trigger 2FA if   TrustJS [37]). We consider this an interesting future direction.
the request doesn’t include certain HTTP cookies. While there
are legitimate scenarios where this occurs (e.g., the user has       7   Related Work
cleared the browser’s browsing data), it can also indicate that
the login attempt is from a new/unknown device. Obviously,           To the best of our knowledge, this paper presents the first
using this signal would not be effective against cookie hijack-      comprehensive security analysis of real risk-based authenti-
ers. Second, we found that certain sites have more stringent         cation systems that leverage browser fingerprints, and the first
IP-based checks. While attackers can easily use proxies or           demonstration of a practical attack for bypassing 2FA. Here we
VPN services to “obtain” an IP address with a similar geoloca-       discuss prior work and studies around data breaches, account
tion to the victim [55] (e.g., same city) stricter IP requirements   hijacking and authentication-augmenting mechanisms.
(e.g., belonging to the same ISP or having been used to access          Van Acker et al. [70] conducted a large scale study on the
that account before) present additional obstacles to attackers.      security of login pages, by evaluating the presence of mixed
Overall, as noted by OWASP [56], when alternative defenses           content and the use of mechanisms like HSTS, HPKP and SRI.
are “implemented in a layered approach, they can provide             To detect breaches in popular services, DeBlasio et al. [28]
a reasonable degree of protection”. As such, a careful use of        proposed an approach that leverages honey accounts and pass-
browser fingerprints in conjunction with other signals like          word reuse as a method for detecting sites being compro-
IP address checking and mandating the presence of specific           mised. Prior work has also proposed strategies for deploy-
cookies, can lead to a more robust authentication process.           ing risk-based authentication systems, or have studied certain
   Best practices for users. Our main threat model assumes           characteristics of real-world deployments. In an earlier study,
that the attacker knows the user’s password. As such, the attack     Hurkala and Hurkala [39] proposed a system that relies on
can be mitigated by “best practices” commonly highlighted in         the IP address, device profiling (i.e., User-Agent and Accept-
guides for safer Internet browsing, such as the use of password      Language in HTTP headers), presence of cookies, access time
managers. Additionally, users should enable 2FA in sites that        and failed login attempts. Freeman et al. [35] used a real-user
support it, and further enable options that require solving a        dataset of login attempts from Linkedin, and classified them
2FA challenge in every login if such an option is available (e.g.,   into benign and suspicious based on the IP address and User
Tax-A offers this). Finally, users can adopt tools or browsers       Agent. Steinegger et al. [67] implemented an authentication
that affect browser fingerprinting, which we discuss next.           system that checks the browser fingerprint (calculated using the



1662    31st USENIX Security Symposium                                                                        USENIX Association
Fingerprintjs2 library), geolocation (i.e., country) based on        also overlooks various advanced attributes handled by our sys-
the IP address, and the number of failed login attempts. Alaca       tem (e.g., canvas fonts). More importantly, their attack requires
and van Oorschot [17] identified several fingerprinting vectors      significant manual effort for several attributes, including paus-
that can be used for authentication and classified them based on     ing execution with breakpoints and manually changing object
the distinguishability they provide and their resistance to spoof-   values through the browser’s debugging tools, and changing
ing. Spooren et al. [65] explored the effectiveness of mobile fin-   browser and operating system settings. Finally, this study does
gerprints for risk-based authentication and found that they are      not present an in-depth exploration and evaluation of the attack
considerably less unique than the fingerprints of personal com-      against risk-based authentication systems in the wild.
puters. In a different line of work, Bonneau et al. [22] explored       Furthermore, Campobasso and Allodi [24] recently re-
the privacy concerns that arise due to the permanence and            ported on an underground marketplace that sells resources for
simulatability of such features when used for authentication.        bypassing risk-based authentication. This marketplace relies
   Wiefling et al. [74] explored the authentication systems of       on malware that infects victims computers for collecting a vast
eight popular services to identify which features contribute         amount of information, which includes browser fingerprints
to the computation of the risk score. To that end, they created      for some users. The paper provides an interesting economic
a number of personas and corresponding accounts, and built           analysis on the impact of various resources on the pricing
a framework that uses virtual machines and emulates user             of account profiles. However the authors did not analyze
activities. However, their experiments only focus on the User        any profiles/resources or the software used for obtaining and
Agent string, language, and screen resolution, and as such           generating those resources, which could provide additional
do not provide in-depth or detailed insights on how browser          insight on the exact nature of the fingerprints being collected,
fingerprints are actually being used for risk analysis in the        the services being targeted, and the actual effectiveness of
wild. In a subsequent work [72], they performed a study with         the attack resources offered by the marketplace for bypassing
780 users, in which they collected 247 fingerprinting features       risk-based authentication mechanisms. As such, this study is
during login and assessed their suitability for risk-based           complementary to our work as it indicates that attackers are
authentication. In [73], they explored users’ perceptions on the     indeed exploring techniques for impersonating user devices.
usability and security of risk-based authentication, and in [75]
they assessed link-based and code-based re-authentication.
   Previous work [19, 20] has focused on identifying finger-         8   Conclusions
printing attributes that are suitable for authentication (e.g.,
with high entropy, low usability cost, stability). In [20]           Critical and high-value web services have introduced
Andriamilanto et al. proposed FPSelect, a tool for selecting         additional security mechanisms and checks into their authen-
fingerprinting attributes for authentication systems that            tication workflows to prevent attackers from compromising
satisfy a service’s security requirements while minimizing           accounts even if they are able to obtain or guess users’ creden-
the usability cost. In a follow up work [19], they conducted a       tials. We presented the first empirical analysis of the operation
large-scale study on the properties of browser fingerprints for      and effectiveness of such systems in real-world high-value web
authentication. They found that at least 90% of the inspected        services. Accordingly, we demonstrated how attackers can
fingerprinting attributes are stable (i.e., identical values for     automatically extract and misuse users’ browser fingerprints
almost six months) and can be used for authentication. In [18],      for deceiving risk-based authentication systems into trusting
Andriamilanto and Allard present BrFAST, a framework that            the attacker’s device and bypass two-factor authentication. Our
incorporates FPSelect, for the selection of fingerprinting           real-world experiments highlight the severity of our attack, as
attributes. These studies assumed an attacker with knowledge         we show that major financial services and e-commerce services
of the distribution of fingerprints who performs a dictionary-       are vulnerable. We also found major services being targeted
style attack by submitting common fingerprinting values. We          by phishers that obtain sufficient fingerprinting attributes
explore an entirely different attack where the attacker extracts     to completely bypass 2FA. As such, our research highlights
a user’s exact fingerprints and spoofs their own device’s            the danger of incorporating additional security mechanisms
fingerprints to match these values when impersonating the user       without first conducting a comprehensive and in-depth
and, importantly, demonstrate the implications of this attack        assessment of potential pitfalls. To get the remediation process
in the wild. Moreover, our attack can spoof all the attributes       under way, we have notified the affected vendors and proposed
these studies proposed for augmenting authentication.                guidelines for a more robust authentication process.
   In an independent concurrent study, Liu et al. [50] explore       Acknowledgements: We thank the anonymous reviewers, and
a similar attack and demonstrate that users’ fingerprints can be     our shepherd Mohammad Mannan, for their valuable feedback.
spoofed by an attacker. However, their approach does not detect      This work was supported by the National Science Foundation
which fingerprinting attributes are needed for different target      (CNS-1934597). Any opinions, findings, conclusions, or
websites, nor does it provide a method for automatically extract-    recommendations expressed herein are those of the authors,
ing and generating per-target-website fingerprinting code. It        and do not necessarily reflect those of the US Government.



USENIX Association                                                                      31st USENIX Security Symposium          1663
References                                                        [17] Furkan Alaca and P. C. van Oorschot. Device fingerprint-
                                                                       ing for augmenting web authentication: Classification
 [1] 2FA Directory. https://2fa.directory/.                            and analysis of methods. In Proceedings of the 32nd
                                                                       Annual Conference on Computer Security Applications,
 [2] AmIUnique. https://amiunique.org/.
                                                                       ACSAC ’16.
 [3] Demo of our spoofing capabilities against the AmIU-
                                                                  [18] Nampoina Andriamilanto and Tristan Allard. Brfast: A
     nique fingerprinting system. https://vimeo.com/
                                                                       tool to select browser fingerprinting attributes for web
     629397823/b509389d0e.
                                                                       authentication according to a usability-security trade-off.
 [4] Evilginx - Man-in-the-middle attack framework. https:             In Companion Proceedings of the Web Conference 2021,
     //github.com/kgretzky/evilginx2.                                  WWW ’21, page 701–704, 2021.
 [5] FingerprintJS.          https://github.com/                  [19] Nampoina Andriamilanto, Tristan Allard, and Gaëtan Le
     fingerprintjs/fingerprintjs.                                      Guelvouit. “guess who?” large-scale data-centric study
                                                                       of the adequacy of browser fingerprints for web authen-
 [6] ForgeRock - Implementing Device Fingerprints With                 tication. In Innovative Mobile and Internet Services in
     Intelligent Authentication Trees in AM.    https:                 Ubiquitous Computing, pages 161–172, 2021.
     //developer.forgerock.com/docs/platform/
     how-tos/implementing-device-fingerprints-                    [20] Nampoina Andriamilanto, Tristan Allard, and Gaëtan
     intelligent-authentication-trees-am.                              Le Guelvouit. FPSelect: Low-Cost Browser Fingerprints
                                                                       for Mitigating Dictionary Attacks against Web Authen-
 [7] Google blog - Making you safer with 2SV.                          tication Mechanisms. In Annual Computer Security
     https://blog.google/technology/safety-                            Applications Conference (ACSAC 2020), 2020.
     security/reducing-account-hijacking/.
                                                                  [21] Peter Baumann, Stefan Katzenbeisser, Martin Stopczyn-
 [8] MDN Web Docs - X-Forwarded-For.       https:                      ski, and Erik Tews. Disguised chromium browser:
     //developer.mozilla.org/en-US/docs/Web/                           Robust browser, flash and canvas fingerprinting protec-
     HTTP/Headers/X-Forwarded-For.                                     tion. In Proceedings of the 2016 ACM on Workshop on
 [9] MiniOrange. https://www.miniorange.com/.                          Privacy in the Electronic Society, 2016.

[10] OpenWPM.              https://github.com/mozilla/            [22] Joseph Bonneau, Edward W Felten, Prateek Mittal,
     OpenWPM.                                                          and Arvind Narayanan. Privacy concerns of implicit
                                                                       secondary factors for web authentication. WAY, 14, 2014.
[11] OWASP -Top 10 Web Application Security Risks.
     https://owasp.org/www-project-top-ten/.                      [23] Elie Bursztein, Borbala Benko, Daniel Margolis, Tadek
                                                                       Pietraszek, Andy Archer, Allan Aquino, Andreas
[12] THE APWG ECRIME EXCHANGE (ECX). https:                            Pitsillidis, and Stefan Savage.   Handcrafted fraud
     //apwg.org/ecx/.                                                  and extortion: Manual account hijacking in the wild.
                                                                       In Proceedings of the 2014 Conference on Internet
[13] CyDec Security Anti-Fp, 2021. https://chrome.
                                                                       Measurement Conference, IMC ’14.
     google.com/webstore/detail/cydec-security-
     anti-fp/becfjfjckdhngmmpkhakoknnkgpgfelk.                    [24] Michele Campobasso and Luca Allodi. Impersonation-
                                                                       as-a-service: Characterizing the emerging criminal
[14] DUO - The 2021 State of the Auth Report: 2FA Climbs,
                                                                       infrastructure for user impersonation at scale. In
     While Password Managers and Biometrics Trend, 2021.
                                                                       Proceedings of the 2020 ACM SIGSAC Conference on
     https://duo.com/blog/the-2021-state-of-the-
                                                                       Computer and Communications Security, 2020.
     auth-report-2fa-climbs-password-managers-
     biometrics-trend.                                            [25] Yinzhi Cao, Song Li, and Erik Wijmans. (cross-)browser
                                                                       fingerprinting via os and hardware level features. In
[15] User-Agent   Switcher  and   Manager,               2021.
                                                                       Proceedings of Network & Distributed System Security
     https://chrome.google.com/webstore/
                                                                       Symposium (NDSS). Internet Society, 2017.
     detail/user-agent-switcher-and-m/
     bhchdcejhohfmigjafbampogmaanbfkg.                            [26] Anupam Das, Joseph Bonneau, Matthew Caesar, Nikita
                                                                       Borisov, and XiaoFeng Wang. The tangled web of
[16] Gunes Acar, Christian Eubank, Steven Englehardt, Marc
                                                                       password reuse. In NDSS, volume 14, pages 23–26, 2014.
     Juarez, Arvind Narayanan, and Claudia Diaz. The web
     never forgets: Persistent tracking mechanisms in the wild.   [27] Emiliano De Cristofaro, Honglu Du, Julien Freudiger,
     In Proceedings of the 2014 ACM SIGSAC Conference                  and Greg Norcie. A comparative usability study of
     on Computer and Communications Security, CCS ’14.                 two-factor authentication. arXiv:1309.5344, 2013.



1664   31st USENIX Security Symposium                                                                      USENIX Association
[28] Joe DeBlasio, Stefan Savage, Geoffrey M. Voelker,          [38] Alejandro Gómez-Boix, Pierre Laperdrix, and Benoit
     and Alex C. Snoeren. Tripwire: Inferring internet               Baudry. Hiding in the crowd: an analysis of the
     site compromise. In Proceedings of the 2017 Internet            effectiveness of browser fingerprinting at large scale. In
     Measurement Conference, IMC ’17.                                WWW 2018.

[29] Alexandra Dmitrienko, Christopher Liebchen, Christian      [39] Adam Hurkała and Jarosław Hurkała. Architecture
     Rossow, and Ahmad-Reza Sadeghi. On the (in) security            of context-risk-aware authentication system for web
     of mobile two-factor authentication. In International           environments. In Proceedings of the Third International
     Conference on Financial Cryptography and Data                   Conference on Informatics Engineering and Information
     Security. Springer, 2014.                                       Science (ICIEIS), 2014.

[30] Periwinkle Doerfler, Maija Marincenko, Juri Ranieri,       [40] Umar Iqbal, Steven Englehardt, and Zubair Shafiq.
     Yu Jiang, Angelika Moscicki, Damon McCoy, and Kurt              Fingerprinting the fingerprinters: Learning to detect
     Thomas. Evaluating login challenges as a defense against        browser fingerprinting behaviors.     arXiv preprint
     account takeover. In Proceedings of the International           arXiv:2008.04480, 2020.
     Conference on World Wide Web, 2019.                        [41] Roger Piqueras Jover. Security analysis of sms as a
                                                                     second factor of authentication. Communications of the
[31] Kostas Drakonakis, Sotiris Ioannidis, and Jason Polakis.
                                                                     ACM, 63(12), 2020.
     The cookie hunter: Automated black-box auditing
     for web authentication and authorization flaws. In         [42] Jordan Jueckstock and Alexandros Kapravelos. Vis-
     Proceedings of the 2020 ACM SIGSAC Conference on                ibleV8: In-browser Monitoring of JavaScript in the
     Computer and Communications Security, CCS ’20.                  Wild. In Proceedings of the ACM Internet Measurement
                                                                     Conference (IMC), 2019.
[32] Peter Eckersley. How unique is your web browser? In
     Proceedings of the 10th International Conference on        [43] Soroush Karami, Panagiotis Ilia, Konstantinos Solomos,
     Privacy Enhancing Technologies, PETS’10, 2010.                  and Jason Polakis. Carnus: Exploring the privacy threats
                                                                     of browser extension fingerprinting. In 27th Annual
[33] Steven Englehardt and Arvind Narayanan. Online                  Network and Distributed System Security Symposium
     tracking: A 1-million-site measurement and analysis. In         (NDSS). The Internet Society, 2020.
     Proceedings of the 2016 ACM SIGSAC Conference on
     Computer and Communications Security, CCS ’16, 2016.       [44] Pierre Laperdrix, Gildas Avoine, Benoit Baudry, and
                                                                     Nick Nikiforakis. Morellian Analysis for Browsers:
[34] Steven Englehardt, Dillon Reisman, Christian Eubank,            Making Web Authentication Stronger with Canvas
     Peter Zimmerman, Jonathan Mayer, Arvind Narayanan,              Fingerprinting. In Detection of Intrusions and Malware,
     and Edward W. Felten. Cookies that give you away:               and Vulnerability Assessment - 16th International
     The surveillance implications of web tracking. In               Conference, DIMVA. 2019.
     Proceedings of the 24th International Conference on
                                                                [45] Pierre Laperdrix, Nataliia Bielova, Benoit Baudry, and
     World Wide Web, WWW ’15.
                                                                     Gildas Avoine. Browser fingerprinting: A survey. ACM
[35] D. Freeman, Sakshi Jain, Markus Dürmuth, B. Biggio,             Transactions on the Web (TWEB), 14(2).
     and G. Giacinto. Who are you? a statistical approach to    [46] Pierre Laperdrix, Walter Rudametkin, and Benoit Baudry.
     measuring user authenticity. In Proceedings of Network          Beauty and the beast: Diverting modern web browsers
     & Distributed System Security Symposium (NDSS).                 to build unique browser fingerprints. In 2016 IEEE
     Internet Society, 2016.                                         Symposium on Security and Privacy (SP). IEEE, 2016.
[36] Mohammad Ghasemisharif, Amrutha Ramesh, Stephen            [47] Sebastian Lekies, Ben Stock, and Martin Johns. 25
     Checkoway, Chris Kanich, and Jason Polakis. O single            million flows later: large-scale detection of dom-based
     {Sign-Off}, where art thou? an empirical analysis               xss. In Proceedings of the 2013 ACM SIGSAC confer-
     of single {Sign-On} account hijacking and session               ence on Computer & communications security, pages
     management on the web. In 27th USENIX Security                  1193–1204, 2013.
     Symposium (USENIX Security 18), 2018.
                                                                [48] Adam Lerner, Anna Kornfeld Simpson, Tadayoshi
[37] David Goltzsche, Colin Wulf, Divya Muthukumaran,                Kohno, and Franziska Roesner. Internet jones and the
     Konrad Rieck, Peter Pietzuch, and Rüdiger Kapitza.              raiders of the lost trackers: An archaeological study
     Trustjs: Trusted client-side execution of javascript. In        of web tracking from 1996 to 2016. In 25th USENIX
     EuroSec 2017, pages 1–6, 2017.                                  Security Symposium (USENIX Security 16).



USENIX Association                                                                 31st USENIX Security Symposium        1665
[49] Xu Lin, Panagiotis Ilia, and Jason Polakis. Fill in the     [59] Ken Reese, Trevor Smith, Jonathan Dutson, Jonathan
     blanks: Empirical analysis of the privacy threats of             Armknecht, Jacob Cameron, and Kent Seamons. A
     browser form autofill. In Proceedings of the 2020 ACM            usability study of five Two-Factor authentication
     SIGSAC Conference on Computer and Communications                 methods. In SOUPS 2019.
     Security (CCS).
                                                                 [60] Richard Shay, Iulia Ion, Robert W. Reeder, and Sunny
[50] Zengrui Liu, Prakash Shrestha, and Nitesh Saxena.                Consolvo. “my religious aunt asked why i was trying
     Gummy Browsers: Targeted Browser Spoofing against                to sell her viagra”: Experiences with account hijacking.
     State-of-the-Art Fingerprinting Techniques. In In                In Proceedings of the SIGCHI Conference on Human
     International Conference on Applied Cryptography and             Factors in Computing Systems, CHI ’14.
     Network Security (ACNS), 2022.                              [61] David Silver, Suman Jana, Dan Boneh, Eric Chen,
                                                                      and Collin Jackson. Password managers: Attacks and
[51] Ariana Mirian, Joe DeBlasio, Stefan Savage, Geoffrey M.          defenses. In 23rd USENIX Security Symposium, 2014.
     Voelker, and Kurt Thomas. Hack for hire: Exploring the
     emerging market for account hijacking. In The World         [62] Suphannee Sivakorn, Angelos D Keromytis, and Jason
     Wide Web Conference, WWW ’19.                                    Polakis. That’s the way the cookie crumbles: Evaluating
                                                                      https enforcing mechanisms. In ACM WPES, 2016.
[52] Keaton Mowery and Hovav Shacham. Pixel perfect: Fin-
     gerprinting canvas in html5. Proceedings of W2SP, 2012.     [63] Suphannee Sivakorn, Jason Polakis, and Angelos D.
                                                                      Keromytis. The cracked cookie jar: Http cookie
[53] Nick Nikiforakis, Alexandros Kapravelos, Wouter                  hijacking and the exposure of private information. In
     Joosen, Christopher Kruegel, Frank Piessens, and                 In Proceedings of the 37th IEEE Symposium on Security
     Giovanni Vigna. Cookieless monster: Exploring the                and Privacy, S&P ’16.
     ecosystem of web-based device fingerprinting. In 2013
                                                                 [64] Alexander Sjösten, Steven Van Acker, and Andrei
     IEEE Symposium on Security and Privacy. IEEE, 2013.
                                                                      Sabelfeld. Discovering browser extensions via web
                                                                      accessible resources. In Proceedings of the Seventh
[54] Sean Oesch and Scott Ruoti. That was then, this is now:
                                                                      ACM on Conference on Data and Application Security
     A security evaluation of password generation, storage,
                                                                      and Privacy, CODASPY ’17.
     and autofill in Browser-Based password managers. In
     29th USENIX Security Symposium, 2020.                       [65] Jan Spooren, Davy Preuveneers, and Wouter Joosen.
                                                                      Mobile device fingerprinting considered harmful for risk-
[55] Jeremiah Onaolapo, Enrico Mariconti, and Gianluca                based authentication. In Proceedings of the Eighth Euro-
     Stringhini. What happens after you are pwnd: Under-              pean Workshop on System Security, EuroSec ’15, 2015.
     standing the use of leaked webmail credentials in the
     wild. In Proceedings of the 2016 Internet Measurement       [66] Oleksii Starov and Nick Nikiforakis. Xhound: Quan-
     Conference, IMC ’16.                                             tifying the fingerprintability of browser extensions. In
                                                                      2017 IEEE Symposium on Security and Privacy (SP).
[56] OWASP.      Credential stuffing prevention cheat
     sheet.  https://cheatsheetseries.owasp.org/                 [67] Roland H. Steinegger, Daniel Deckers, Pascal Giessler,
     cheatsheets/Credential_Stuffing_Prevention_                      and Sebastian Abeck. Risk-based authenticator for web
     Cheat_Sheet.html, 2021.                                          applications. In Proceedings of the 21st European Con-
                                                                      ference on Pattern Languages of Programs, EuroPlop
[57] Sarah Pearman, Jeremy Thomas, Pardis Emami Naeini,               ’16.
     Hana Habib, Lujo Bauer, Nicolas Christin, Lorrie Faith      [68] Kurt Thomas, Frank Li, Ali Zand, Jacob Barrett,
     Cranor, Serge Egelman, and Alain Forget. Let’s go in for         Juri Ranieri, Luca Invernizzi, Yarik Markov, Oxana
     a closer look: Observing passwords in their natural habi-        Comanescu, Vijay Eranti, Angelika Moscicki, Daniel
     tat. In Proceedings of the 2017 ACM SIGSAC Conference            Margolis, Vern Paxson, and Elie Bursztein. Data
     on Computer and Communications Security, CCS ’17.                breaches, phishing, or malware? understanding the risks
                                                                      of stolen credentials. In Proceedings of the 2017 ACM
[58] Iasonas Polakis, Marco Lancini, Georgios Kontaxis,               SIGSAC Conference on Computer and Communications
     Federico Maggi, Sotiris Ioannidis, Angelos D Keromytis,          Security, CCS ’17.
     and Stefano Zanero. All your face are belong to
     us: Breaking facebook’s social authentication. In           [69] Kurt Thomas, Jennifer Pullman, Kevin Yeo, Ananth
     Proceedings of the 28th Annual Computer Security                 Raghunathan, Patrick Gage Kelley, Luca Invernizzi,
     Applications Conference, 2012.                                   Borbala Benko, Tadek Pietraszek, Sarvar Patel, Dan



1666   31st USENIX Security Symposium                                                                    USENIX Association
     Boneh, and Elie Bursztein. Protecting accounts from            Our experiments reveal that Tax-B uses a fingerprinting
     credential stuffing with password breach alerting. In 28th     script on its login page that is highly similar to the popular
     USENIX Security Symposium (USENIX Security 19).                fingerprinting library FingerprintJS. A notable difference,
                                                                    however, is that Tax-B’s script does not implement audio
[70] Steven Van Acker, Daniel Hausknecht, and Andrei                fingerprinting. Furthermore, by inspecting outgoing network
     Sabelfeld. Measuring login webpage security. In SAC            traffic when logging into the website using our primary device,
     2017.                                                          we observed that a JSON string that includes 33 fingerprinting
[71] Antoine Vastel, Pierre Laperdrix, Walter Rudametkin,           values is sent to Tax-B’s server. To fingerprint JavaScript
     and Romain Rouvoy. Fp-stalker: Tracking browser                fonts, Tax-B uses “monospace” as the base font and checks
     fingerprint evolutions. In 2018 IEEE Symposium on              against a list of 495 different font families. After embedding
     Security and Privacy (SP). IEEE, 2018.                         Tax-B’s code and fonts list into our phishing site and visiting
                                                                    it with our primary device, we found that our device supports
[72] Stephan Wiefling, Markus Dürmuth, and Luigi Lo Ia-             88 font families. Then, to spoof the font fingerprint during
     cono. What’s in Score for Website Users: A Data-driven         the attack phase, our extension changes the offsetWidth and
     Long-term Study on Risk-based Authentication Charac-           offsetHeight properties of the span elements that load these
     teristics. In 25th International Conference on Financial       88 fonts to deviate from their default values.
     Cryptography and Data Security (FC ’21).                          eCommerce-A also does not use 2FA by default and
                                                                    users need to explicitly enable it. Their site has multiple
[73] Stephan Wiefling, Markus Dürmuth, and Luigi Lo Iacono.         fingerprinting scripts on the login page that implement both
     More than just good passwords? a study on usability            basic and advanced fingerprinting techniques, such as canvas,
     and security perceptions of risk-based authentication. In      WebGL, fonts and audio fingerprinting. Our analysis revealed
     ACSAC, 2020.                                                   that eCommerce-A does not actually use fonts and audio finger-
[74] Stephan Wiefling, Luigi Lo Iacono, and Markus Dur-             prints for authentication, but only relies on basic fingerprints,
     muth. Is this really you? an empirical study on risk-based     canvas, and WebGL. Regarding their basic fingerprints, we
     authentication applied in the wild. IFIP AICT, 2019.           observed that eCommerce-A collects 46 attributes, such as
                                                                    Navigator.plugins and Window.devicePixelRatio. For
[75] Stephan Wiefling, Tanvi Patil, Markus Dürmuth,                 canvas and WebGL fingerprinting, eCommerce-A uses two
     and Luigi Lo Iacono.       Evaluation of Risk-Based            different scripts and draws 7 images in total. In two of the
     Re-Authentication Methods. In ICT Systems Security             images it draws a string of a random integer number between 0
     and Privacy Protection, 2020.                                  and 999. As described previously, our phishing site records the
                                                                    Base64 values of the images and then, during the attack, our
[76] Penghui Zhang, Adam Oest, Haehyun Cho, Zhibo                   extension manipulates the toDataURL() method to return the
     Sun, RC Johnson, Brad Wardman, Shaown Sarker,                  Base64 strings (in the correct order). For fingerprinting fonts,
     Alexandros Kapravelos, Tiffany Bao, Ruoyu Wang,                eCommerce-A uses “"monospace”, “sans-serif” and “serif” as
     Yan Shoshitaishvili, Adam Doupé, and Gail-Joon                 base fonts and compares against 485 font families. In compari-
     Ahn. CrawlPhish: Large-scale Analysis of Client-side           son to Tax-B that uses one base font and loads each font family
     Cloaking Techniques in Phishing. In Proceedings of the         to be tested in a single span element, eCommerce-A uses three
     IEEE Symposium on Security and Privacy, May 2021.              different base fonts as a fallback, loading each font family to
                                                                    be tested in three different span elements, and checking for
A    Use Cases                                                      changes in the dimensions of any of these elements.
                                                                       RideSharing exhibits a unique idiosyncrasy as it
We provide additional details about select cases of websites        exposes two login URLs, which actually behave differently.
susceptible to our attack. Our comprehensive manual analysis        Specifically, any login attempts made from the landing page
helped us understand how risk-based authentication systems          that do not include the necessary cookies will always result
behave and revealed shortcomings in their implementation.           in 2FA being triggered. Surprisingly, the login attempts from
   Tax-B does not enable 2FA by default. Instead, the user can      the other page will only trigger 2FA when a new device is used.
opt in through the website’s settings by selecting email, SMS,      As such, attackers can impersonate the user’s device and log
or the Google Authenticator app as their second factor. Tax-B       in from this second page to bypass 2FA. We also found that
also records the user’s IP address for each login. Users can find   if we explicitly enable 2FA through RideSharing’s mobile
information about their trusted devices and past logins in the      app, 2FA is triggered for every login attempt regardless of
account preferences, including sign-in timestamps as well as        which login URL is used. RideSharing collects a total of
the devices’ IP addresses. Interestingly, while Tax-B records       379 fingerprinting attributes from the user’s device. More
the IP addresses used in past logins, we found that it does not     interestingly, it employs a fingerprinting strategy that we have
use this information to determine if a new login is suspicious.     not come across in other sites. Specifically, it catches errors



USENIX Association                                                                     31st USENIX Security Symposium          1667
during each step of the fingerprinting process and pushes            Table 6: Fingerprintable properties of JavaScript objects. Prop-
those errors into an array which is used to calculate one of the     erties marked with ‘*’ are only supported in Internet Explorer.
fingerprinting values. For example, the script tries to create
an element for obtaining a list of fonts that are available in        JavaScript Object   Fingerprintable Properties
Internet Explorer but not supported by other browsers.                   Navigator        userAgent, platform vendor, vendorSub, product,
                                                                                          productSub, oscpu, cpuClass*, buildID, hard-
                                                                                          wareConcurrency, appName, appCodeName,
B    Inconsistency Checks                                                                 appVersion, appMinorVersion*, languages,
                                                                                          language, browserLanguage*, userLanguage*,
                                                                                          systemLanguage*, permissions, onLine, connec-
Tax-A uses toString() to detect if any native functions have                              tion, cookieEnabled, doNotTrack, deviceMemory,
been tampered with. When toString() is called on a func-                                  getBattery, geolocation, getGamepads, max-
tion, it returns a string representation of the function’s code.                          TouchPoints, msMaxTouchPoints* mediaDevices,
In the case of native functions, the returned value shows that                            mimeTypes, javaEnabled, plugins, sendBeacon,
                                                                                          vibrate, bluetooth, webdriver
the function uses native code. When a function is overridden
(by our extension) to return a spoofed value, its string repre-            Window         innerWidth, innerHeight, outerWidth, outer-
                                                                                          Height, screenLeftm screenTop, screenX, screenY,
sentation returned by toString() would reveal this change.                                devicePixelRatio, ontouchstart, swfobject, Ac-
For bypassing such checks, we also override the toString()                                tiveXObject*, locationbar, menubar, toolbar,
method to make it return the expected value for native methods.                           statusbar, personalbar, scrollbar, pageXOff-
   Tax-B checks whether the browser’s languages have                                      set, scrollX, speechSynthesis, sessionStorage,
                                                                                          localStorage, indexedDB, openDatabase
been tampered with by comparing the Navigator.language
attribute with Navigator.languages. It also compares the                   Screen         width, height availWidth, availHeight, availLeft,
                                                                                          availTop, colorDepth, pixelDepth, deviceXDPI*,
screen’s size with the available size. Finally, it determines the                         systemXDPI*, logicalXDPI*, deviceYDPI*,
browser type based on the user-agent and looks for contradic-                             logicalYDPI*, updateInterval*, orientation
tions between the browser type and Navigator.productSub                    Plugin         name, version, description, filename
or eval.toString().length. Similarly to Bank-A’s case,
                                                                          mimeType        type, description, enabledPlugin, suffixes
our attack is not affected by these inconsistency checks as we
spoof these attributes according to the primary device’s values.
   RideSharing catches JavaScript runtime exceptions
and uses the error messages as fingerprints. If the attacker’s       canvas. If a tested font is not supported, the default fallback
browser is different from the victim’s, these error messages         font is used instead. The fingerprinting script loops through a
will differ. However, the attacker can hook the specific APIs in     list of fonts and measures their rendered width. If the baseline
relation to these errors, and change them to show custom error       width and the tested font’s width are equal, it means that the
messages. For example, RideSharing’s code creates an ele-            particular font is not supported by the browser. On our primary
ment that throws an exception in modern browsers By hooking          device, we hook the measureText() method and collected all
document.createElement(), the attacker can make it throw             the TextMetrics objects. Then, on our secondary device, our
a custom error message that looks like the one shown by the          extension modifies the measureText() method to replace the
victim’s browser when such an element is created.                    returned values with those collected from the primary device.


C      Properties of JavaScript Objects                              E    Phishing Sites: Fingerprint Exfiltration
                                                                     We manually examined our VisibleV8 logs for 500,
In Table 6 we present the fingerprintable properties of the
                                                                     500, and 200 sites targeting Bank-A, RideSharing, and
Navigator, Window, Screen, Plugin, and MimeType objects
                                                                     WebInfrastructure respectively. We found that phishing
that our extensions can obtain and spoof. We decided on this set
                                                                     sites use APIs like XMLHttpRequest and WebSocket for
of properties as these are used by Fingeprintjs2 [5], the ex-
                                                                     sending fingerprinting values back to the server. Some sites
tended version of OpenWPM presented in [40], and also in finger-
                                                                     also include fingerprinting values in the URLs of GET requests.
printing scripts we found during our exploration of high-value
                                                                     We found 197, 109, and 4 phishing sites respectively exfil-
services. Properties marked with ‘*’ are only supported in Inter-
                                                                     trating fingerprinting values. Additionally, 164, 128, and 126
net Explorer, but they are still widely used in phishing websites.
                                                                     sites send back obfuscated data. While this likely includes fin-
                                                                     gerprinting values in certain cases, the costly manual process
D      Canvas Fonts Fingerprinting                                   required to verify this falls outside the scope of our work.

The CanvasRenderingContext2D.measureText() method
returns a TextMetrics object that contains information about
the measured text (such as its width) that is rendered on the



1668    31st USENIX Security Symposium                                                                             USENIX Association
