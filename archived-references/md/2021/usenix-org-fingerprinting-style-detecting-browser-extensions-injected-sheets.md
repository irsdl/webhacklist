---
type: Article
title: "Fingerprinting in Style: Detecting Browser Extensions via Injected Style Sheets"
resource: "https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:25:09+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix"
    title: "Fingerprinting in Style: Detecting Browser Extensions via Injected Style Sheets"
    author: Pierre Laperdrix, Oleksii Starov, Quan Chen, Alexandros Kapravelos, Nick Nikiforakis
  - id: capture
    resource: "https://web.archive.org/web/20211002060233/https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix"
also_at:
  - "https://www.usenix.org/system/files/sec21-laperdrix.pdf"
  - "https://www.usenix.org/system/files/sec21fall-laperdrix.pdf"
  - "https://www.usenix.org/system/files/sec21_slides_laperdrix.pdf"
authors:
  - Pierre Laperdrix
  - Oleksii Starov
  - Quan Chen
  - Alexandros Kapravelos
  - Nick Nikiforakis
canonical_url: ""
cited_by:
  - "2021.md:63"
commit: ""
content_sha256: 0355ee62782f562c9acf58794ea5e502c396bb4a2c52a3c3303ab9fc6670d7d2
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 6f4fdcad33a034301b3d4c25d818d8df9482b4f689c0db96b4d73292d67ccc6f
retrieved_from: "https://www.usenix.org/system/files/sec21-laperdrix.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:25:09+00:00"
slug: usenix-org-fingerprinting-style-detecting-browser-extensions-injected-sheets
snapshot: 20211002060233
title_english: ""
translation_file: ""
translation_of: ""
---

# Fingerprinting in Style: Detecting Browser Extensions via Injected Style Sheets

**Fingerprinting in Style: Detecting Browser Extensions via Injected Style Sheets** - Pierre Laperdrix, Oleksii Starov, Quan Chen, Alexandros Kapravelos, Nick Nikiforakis, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix>
- Also published at: <https://www.usenix.org/system/files/sec21-laperdrix.pdf>
- Also published at: <https://www.usenix.org/system/files/sec21fall-laperdrix.pdf>
- Also published at: <https://www.usenix.org/system/files/sec21_slides_laperdrix.pdf>
- Preserved from: https://www.usenix.org/system/files/sec21-laperdrix.pdf (live) on 2026-08-19
- Capture timestamp: 20211002060233
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Fingerprinting in Style: Detecting Browser
       Extensions via Injected Style Sheets
Pierre Laperdrix, Univ. Lille, CNRS, Inria; Oleksii Starov, Palo Alto Networks;
 Quan Chen and Alexandros Kapravelos, North Carolina State University;
                  Nick Nikiforakis, Stony Brook University
     https://www.usenix.org/conference/usenixsecurity21/presentation/laperdrix




      This paper is included in the Proceedings of the
             30th USENIX Security Symposium.
                              August 11–13, 2021
                                978-1-939133-24-3




                                        Open access to the Proceedings of the
                                          30th USENIX Security Symposium
                                              is sponsored by USENIX.
                                     Fingerprinting in Style:
                       Detecting Browser Extensions via Injected Style Sheets

              Pierre Laperdrix                       Oleksii Starov                         Quan Chen
           Univ. Lille, CNRS, Inria                Palo Alto Networks              North Carolina State University
                               Alexandros Kapravelos                             Nick Nikiforakis
                           North Carolina State University                    Stony Brook University


                           Abstract                                   and a browser’s private mode) stateless tracking techniques
                                                                      arose that enable third parties to track users across sessions,
   Browser extensions enhance the web experience and have
                                                                      without relying on previously set cookies or other stateful
seen great adoption from users in the past decade. At the same
                                                                      identifiers. These stateless techniques essentially “fingerprint”
time, past research has shown that online trackers can use
                                                                      a user’s browsing environment (such as the exact version
various techniques to infer the presence of installed extensions
                                                                      of their browser, the resolution of their screen, and the way
and abuse them to track users as well as uncover sensitive
                                                                      with which their graphics card renders complex 3D images)
information about them.
                                                                      and associate browsing sessions with this fingerprint [15, 19,
   In this work we present a novel extension-fingerprinting
                                                                      30, 33, 37]. As long as a user’s fingerprint remains relatively
vector showing how style modifications from browser exten-
                                                                      stable over time, this approach subsumes the need for cookies
sions can be abused to identify installed extensions. We pro-
                                                                      and works equally well both in and out of a browser’s private
pose a pipeline that analyzes extensions both statically and dy-
                                                                      mode.
namically and pinpoints their injected style sheets. Based on
these, we craft a set of triggers that uniquely identify browser         The most recent addition to the arsenal of browser fin-
extensions from the context of the visited page. We analyzed          gerprinting is the fingerprinting of browser extensions, such
116K extensions from Chrome’s Web Store and report that               as, ad-blockers, video downloaders, productivity tools, and
6,645 of them inject style sheets on any website that users           password managers. Prior work has shown that browser exten-
visit. Our pipeline has created triggers that uniquely identify       sions can be fingerprinted by the resources they make avail-
4,446 of these extensions, 1,074 (24%) of which could not             able to websites [22, 24, 44], the way they modify a page’s
be fingerprinted with previous techniques. Given the power            DOM [29,45,47], and the messages they send between origins
of this new extension-fingerprinting vector, we propose spe-          with postMessage [29, 45]. Unlike traditional fingerprinting
cific countermeasures against style fingerprinting that have          which could only be abused in the sense of offering bits of
minimal impact on the overall user experience.                        entropy for differentiating users from each other, the ability to
                                                                      detect browser extensions can also be abused to infer sensitive
                                                                      information about users. This is because users choose to in-
1    Introduction                                                     stall specific browser extensions and these choices can betray
                                                                      sensitive information about them. Recent work by Karami et
In the last decade, researchers have revealed that a user’s on-       al. [29] showed that browser extensions can reveal, among
line activity is invisibly tracked by a multitude of third parties.   others, a user’s age, religion, political affiliation, and ethnicity.
These third parties record the websites that users visit in an           In this paper, we present a new method of fingerprinting
effort to better understand them (i.e. their socioeconomic char-      browser extensions which, to the best of our knowledge, has
acteristics and preferences), most commonly for the purpose           never been presented before. Our fingerprinting method arises
of better ad targetting. This type of tracking happens through        from the observation that, like regular web pages, browser ex-
two broad sets of tracking techniques: stateful tracking and          tensions rely on Cascading Style Sheets (CSS) for the styling
stateless tracking.                                                   of their user interfaces (UIs). These UIs include not only the
   Stateful tracking makes use of browser cookies and other           user-facing UIs that are invisible to pages (such as the UIs
stateful identifiers that enable trackers to recognize returning      shown to users who click on an extension’s icon), but also the
users and expand their browsing profiles with newly visited           ones that extensions inject in the pages where they are active
websites [41]. Because of the limitations of stateful tracking        (e.g. a new download menu under each YouTube video). This
(such as the existence of options to block third-party cookies        observation coupled with the ability of modern browsers to



USENIX Association                                                                        30th USENIX Security Symposium            2507
check the styling of individual DOM elements, allow web                                            Extension Background Page
pages to create “tripwire” DOM elements that have the same                  Extension
                                                                            Resources
IDs and class names as the ones that an extension injects and
styles. A webpage can therefore present thousands of invisi-                (html, css, js,
                                                                                                  DOM
ble elements to a visiting user’s browser and detect the ones               png, json, ...)

whose styles are different than the default ones. In this way,                                                           <style/>
a web page can detect the presence of specific extensions,
without the need of any user interactions.                                                    Extension Content      Extension Content
                                                                                                   Styles                 Scripts
   To quantify the vulnerability of browser extensions to this
new attack, we design an analysis pipeline that detects both                                        Extension Manifest
statically and dynamically whether an extension injects CSS
rules into public webpages, extracts correspondent CSS selec-
                                                                      Figure 1: Different ways that browser extensions use to inject styles.
tors and builds a set of triggers that can be used for fingerprint-
ing (e.g., DOM elements or hierarchies with particular class
names and IDs), tests those triggers dynamically for actual              Content scripts and CSS rules can be injected either declar-
style or dimension changes and whether those changes are              atively via the manifest using match patterns [11] (in which
stable from visit to visit, and finally, evaluates the uniqueness     case they are injected automatically by the browser into pages
of the obtained fingerprints. By analyzing more than 116K             with the matching URLs), or they can be injected programmat-
extensions from the Chrome extension store, which include at          ically at runtime. In the case of CSS rules, programmatic injec-
least 6,645 extensions that add styles on any URL, we could           tion is done via the extension API chrome.tabs.insertCSS,
fingerprint 4,446 extensions, which can be uniquely identi-           which is only available to JavaScript code running in the ex-
fied by any web page. Among them, 1,074 extensions could              tension context (and not the normal webpage JavaScript).
not be fingerprinted with existing methods. Finally, given the        Additionally, since the content scripts (regardless of whether
severity of the attack, we present a new countermeasure that          injected declaratively or programmatically) run in the same
hides styles from extension origins through a self-contained          context as the page they are injected in, they can also modify
web component called Shadow DOM. When the browser                     the style sheets of the page. Figure 1 shows the means in
checks for the style of an element, its call is rerouted to a         which extensions can affect the CSS rules of a page.
mirrored DOM that is free of all extension styles, deceiving             In current browser implementations, the effects of CSS
any fingerprinting attempts.                                          rules injected by extensions are visible to all JavaScript code
                                                                      running on the affected page, regardless of their origin, and
2     Background                                                      regardless of the fact that such injected style sheets are hid-
                                                                      den from the document.styleSheets API. This presents
This section provides the necessary background on browser             a channel where information about the installed extensions
extensions, focusing on how the CSS rules injected by ex-             can be leaked. For example, a malicious script can deliber-
tensions can be used to fingerprint them. We briefly discuss          ately inject an element that matches the CSS rules injected
known privacy risks from browser extensions and also provide          by extensions, and then use the getComputedStyle API (dis-
the necessary details of the getComputedStyle API, which              cussed in Section 2.3) to read back the CSS properties after
enables the fingerprinting techniques we present in this work.        all CSS rules are applied by the browser. Given a database
                                                                      of which extensions style which elements and in what way,
                                                                      a script can create thousands of “tripwire” elements, check
2.1    Browser extensions and Style Sheets                            which elements’ CSS properties are modified, and deduce the
Figure 1 shows the high-level architecture of modern browser          presence of specific installed extensions. This information
extensions. A browser extension is essentially a set of               leak forms the basis of our work.
JavaScript, HTML, and CSS files that implements the func-
tionalities of the extension, packaged into a single zip archive      2.2      Risks of using and detecting browser ex-
together with a mandatory manifest file describing the ex-
                                                                               tensions
tension. Apart from providing metadata about the extension,
such as, an extension’s name and version number, the manifest         Browser extensions are known to expose their users to in-
plays a crucial role in that it allows the extension authors to       creased privacy risks, either in an active or in a passive way.
specify background scripts that listen for specific page events,      Previous work (e.g., [18, 21, 31, 46, 50]) has shown that ex-
content scripts that are injected and executed in the page            tensions can actively endanger user privacy by abusing their
context, and CSS rules to be applied on the matching page             access to privileged APIs and exfiltrate sensitive user infor-
elements. Altogether, background/content scripts and CSS              mation over the network. Orthogonally to active abuse, fin-
rules allow extensions to achieve their essential functionality.      gerprinting installed extensions can reveal private and per-



2508    30th USENIX Security Symposium                                                                                   USENIX Association
sonal information about the user. As some extensions offer                <div class=" drwebThreatLink ">( trigger )</div>
very specific functionality, their presence can reveal the user’s
                                                                                           (a) Example of a CSS trigger
age, interests, ethnicity, political affiliation or religion, which
could then be abused to build a profile and serve targeted
ads [29]. Moreover, having an exact list of installed extensions
in the browser introduce additional entropy for fingerprinting
a user’s browsing environment. Previous works demonstrated
that browser extensions can be fingerprinted via, for exam-
ple, their Web Accessible Resources (WARs) [22, 24, 44],
or the changes they introduce in the DOM [45, 47]. Sec-
tion 7 provides a detailed description of previous extension-
                                                                               (b) No extension                   (c) With extension
fingerprinting techniques.
                                                                      Figure 2: Appearance of the HTML trigger (a) when the Dr.Web
                                                                      Link Checker extension (239K users) is absent (b) and present (c).
2.3    The getComputedStyle API
The techniques we present in this paper primarily rely on                 Previous research [25] has also used getComputedStyle
the DOM API window.getComputedStyle, which takes a                    in attacks aiming to steal confidential information from vic-
DOM element (e.g., a div element) and returns the resolved            tim websites by utilizing so-called cross-origin CSS. Due to
CSS properties of that element, after all active style sheets are     the permissive nature of CSS, attackers can inject CSS rule
applied [13]. The return value also takes into account element-       fragments into the target webpage that contains confidential
specific properties (e.g., inline style attributes) along with        information (e.g., by sending CSS rule fragments as email
the current JavaScript modifications. The Internet Explorer           titles so they appear in the victim’s inbox page), and then
browser implements a proprietary version of this API, al-             induce the victim to visit a website controlled by the attacker.
beit as an element property currentStyle (accessed as                 The attacker website will then import the entire target page as
Element.currentStyle on the target DOM element) [10].                 a style sheet, and finally use getComputedStyle to retrieve
Since this API returns the computed (i.e., actual showing)            confidential information from the target page.
CSS properties, such as width/height and background color
of an element, it provides web developers with an accurate
view of the rendered UI elements [40].                                3    Style-Fingerprinting Example and Threat
   In addition to static styling, with the CSS3 specification,             Models
all major browsers now support creating transitions and ani-
mations of HTML elements using CSS. Transitions specify               As we described in Section 2, browser extensions have multi-
that a CSS property change should be done gradually over a            ple ways to style elements that they introduce in webpages.
period of time, while animations are used to animate other            Unfortunately, web pages can take advantage of this behavior
CSS properties (e.g., color, width/height) by specifying key          by presenting trigger elements, i.e., elements with the appro-
frames. The getComputedStyle API also plays an important              priate IDs and class names which exist for the sole purpose of
role here by allowing developers fine grained control over the        matching the CSS rules of the present extensions and thereby
animation, or otherwise to trigger the starting or ending of a        inheriting the specified styles.
transition [9].                                                          Figure 2 shows a class-based trigger that can be used to
                                                                      detect the presence of an extension called Dr. Web in the
                                                                      browser. The visual appearance of the trigger element with
2.4    Known Risks of getComputedStyle                                class “drwebThreatLink” radically changes when the exten-
                                                                      sion is installed, since it inherits all the CSS properties that
It is well-known in the web security and privacy com-                 are injected by that extension (shown in Listing 1). A web-
munity that a malicious website could deduce the user’s               page can use all of the properties listed in Table 1 to detect
browsing history by using a technique called link color               style changes in that element, or check for the resulting di-
differentiation [16, 26]. A malicious website could inject            mensional changes with the listed methods, and thereby infer
a list of hyperlinks of interest as DOM objects, and use              the presence of that extension. Note that all of the above hap-
the getComputedStyle API on each injected hyperlink and               pens without the need of user interaction and can therefore
check their color: a previously visited link will have a differ-      fingerprint extensions that inject CSS rules in a webpage but
ent color than the non-visited ones. In response to this type         do not change a webpage in any other way. A video demo
of information leakage, major browsers modified the imple-            that demonstrates the power of our proposed technique by
mentation of getComputedStyle so that it always reports the           fingerprinting 20 extensions without any user interaction is
unvisited color for hyperlinks.                                       available at this URL: https://vimeo.com/430428308



USENIX Association                                                                        30th USENIX Security Symposium               2509
                                                                          Table 1: Changed visible properties of the example trigger
    Listing 1: Extension-injected CSS rules for the example trigger
r.drwebThreatLink {                                                      window.getComputedStyle      Position & Dimensions
     background-repeat: no-repeat ;                                      background                   getBoundingClientRect.bottom
     width: 86 px ;                                                      backgroundImage              getBoundingClientRect.height
     height: 84 px ;                                                     backgroundPosition           getBoundingClientRect.right
     background-position: 0 0;                                           backgroundPositionX          getBoundingClientRect.width
     background-image: url ( data : image / png ; base64
     ,...) ;
                                                                         backgroundPositionY          offsetHeight
}                                                                        backgroundRepeat             offsetWidth
                                                                         blockSize
                                                                         height
                                                                         inlineSize
   Given that an extension must have the permission to inject            perspectiveOrigin
CSS rules in a given webpage (we describe the permission                 transformOrigin
system and manifest files in more detail in Section 4) we                webkitLogicalHeight
                                                                         webkitLogicalWidth
identify two separate classes of fingerprintable extensions,
                                                                         webkitPerspectiveOrigin
that match the ones of Starov and Nikiforakis [47]:                      webkitTransformOrigin
                                                                         width
     • Fingerprintable on any domain These extensions are
       the ones that have permissions to operate on all do-
       mains that users visit and thereby potentially inject CSS
       rules in all of these domains. Typical examples of these       can be deployed on any domain and URL. This fingerprinting
       extensions would be ad-blockers, password managers,            script consists of DOM triggers for particular style changes
       security- and privacy-related extensions, and screenshot       and logic to determine the cause of each change. In addition,
       extensions. In this case, any website that a user visits has   we also collected 501,349 extensions and their versions dating
       the ability to deploy the appropriate CSS-based triggers       back from as early as 2014 to perform a longitudinal analysis
       and detect the presence of a given extension.                  (see Section 5.7 for more details).
     • Fingerprintable on some domains Many extensions                   We gathered these extensions by crawling daily the Chrome
       are tailored to one or more specific domains, typically        Store website with a custom script written in Python that
       those of popular services, such as, GMail, Twitter, and        makes HTTP requests using the requests library. It stores
       YouTube. In this case, these extensions can only be fin-       all metadata and extensions encountered in a MongoDB
       gerprinted on these domains. Note however that prior           database. Though the appropriate setting of the HTTP User
       research has identified the large footprint of third parties   Agent, the script pretends to be a recent Chrome browser
       on the popular web [35]. Any JavaScript-capable third          version (updated occasionally over the years) and fetches the
       party that is present on a domain on which an exten-           information page of all publicly listed extensions available at
       sion is active, can deploy arbitrary trigger elements and      https://chrome.google.com/webstore/sitemap. It then
       therefore fingerprint these specialized extensions.            proceeds to download all extensions that have a new version
                                                                      that does not exist in our database. The script is ~100 lines of
                                                                      Python code and executes daily via a cronjob since 2014.
4      Data collection and processing
In this section, we detail our initial dataset of browser exten-
sions and how we process them to extract and verify their fin-
gerprints. The presented pipeline is used to build our database
                                                                      4.2    Processing pipeline
of style fingerprints that we analyze in Section 5.
                                                                      Figure 3 provides an overview of our processing pipeline to
                                                                      generate style fingerprints. At the very end of our pipeline,
4.1      Initial dataset
                                                                      each remaining trigger links back to a single browser exten-
For our experiments, we collected 116,485 extensions from             sion from our dataset. It should be noted that this pipeline can
the Chrome Store in April 2019, intentionally excluding irrel-        be executed as often as necessary to obtain new fingerprinting
evant themes and apps. We cover all types of extensions from          scripts for updated browser extensions. Our implementation
the most popular ones with millions of users to those with            is currently limited to the WebExtension format supported
one or no user at all at the time of writing. Each collected ex-      by Chrome, Firefox, Opera, Edge, and Brave. Note, however,
tension was submitted to the pipeline detailed below in order         that our attack uses standardized JavaScript APIs and can
to obtain a final “ready-to-use” fingerprinting script, which         therefore be extended to other extension systems.



2510      30th USENIX Security Symposium                                                                         USENIX Association
                                                                              Trigger                    Fingerprint
                                                   Trigger                  Confirmation                 Evaluation
                 Manifest-based                    Builder
                   Extraction


                 Mystique Taint                                                         Extension Runner
                   Analysis                                                                                                 Final Script




     Figure 3: Extension analysis pipeline for collecting style-fingerprints: 1 extract injected CSS; 2 generate candidate triggers; and perform
     dynamic tests for 3 trigger confirmation and 4 final fingerprint evaluation.


                                                                                Quan et al. developed a tool called Mystique that uses taint
     Listing 2: Extract from the manifest.json file of the Wikiwand:
                                                                             analysis to detect leaks of privacy-sensitive information in
     Wikipedia Modernized extension
                                                                             browser extensions [18]. Mystique builds upon the Honey-
 1   " content_scripts ": [
                                                                             Pages mechanism by Kapravelos et al. [28] where specific
 2        {
 3          " matches ": [                                                   elements are populated in the browser’s DOM as extensions
 4             " http : //*/*" ,                                             are requesting them. For our purposes, this means that we
 5             " https : //*/*"                                              do not need to know beforehand the requirements for a style
 6          ],
 7          " css ": [
                                                                             to be injected as Mystique will resolve the calls to missing
 8             " css / autowand . css ",                                     elements on the fly. In our experiment, we used Mystique’s
 9             " css / cards . css "                                         web interface [34] to monitor calls to the tabs.insertCSS
10          ],                                                               API and save the styles injected in the DOM. This approach
11          " js ": [
12             (...)
                                                                             will capture injections of both raw CSS code as well as paths
13          ],                                                               to CSS files.
14          " run_at ": " document_start "
15        }
16   ]
                                                                             4.2.2    Generating style triggers

                                                                             After identifying what styles are injected by each extension,
                                                                             the second step converts all the collected CSS rules into decoy
     4.2.1   Extracting injected CSS
                                                                             triggers. The goal is that each trigger will receive the corre-
     The first step is to extract styles that can be injected in a web       sponding style changes when the right extension is present.
     page by an extension.                                                   Note that this is not a straightforward engineering task given
                                                                             the wide range of possible CSS selector constructions and
                                                                             complexity of required DOM hierarchies. As such, we de-
     Detecting declarative injection With the manifest.json                  vised a pragmatic and effective approach for the translation
     file, a developer can declare what CSS style sheets should              of CSS rules to triggers, focusing on IDs and class names
     be applied to the DOM. Listing 2 presents a snippet of the              to recreate the trigger hierarchy. As detailed in Section 5,
     manifest from the Wikiwand: Wikipedia Modernized exten-                 we did not need to consider additional CSS constructs like
     sion. Here, through content scripts, the extension injects two          pseudo-classes or pseudo-elements when building triggers as
     different CSS files (lines 7 to 9) on all HTTP and HTTPS                extensions were already fingerprintable by only focusing on
     URLs (lines 4 and 5).                                                   IDs and class names.
        Since all extensions have a manifest file, it is straightfor-
                                                                                Listings 3 and 4 present an example of a CSS rule that is
     ward to automate the detection by iterating through all of
                                                                             converted into a decoy trigger. To make the transformation,
     them and parsing the content_scripts field.
                                                                             we divide the selector into its different parts and build the
                                                                             corresponding hierarchy. Here, the first element we generate
     Detecting programmatic injection CSS can also be in-                    is a div with the ww_hovercard ID (if the type of an element
     jected dynamically by calling the appropriate browser APIs.             is not specified, we used a div by default). Then we add
     Statically detecting these injections is challenging since the          another div with the ww_image class and we finish with an
     code may be obfuscated and the injected code may be assem-              img element. When running the test page, the style of the
     bled at runtime (e.g. through the concatenation of multiple             structure we generated will match the rule of the injected CSS
     variables).                                                             and the style will be applied.



     USENIX Association                                                                          30th USENIX Security Symposium            2511
Listing 3: CSS rule from the “Wikiwand: Wikipedia Modernized”               Listing 5: Decoy trigger with the baseline elements.
(WikiWand) extension                                                <div class=" trigger " id=" 26622 ">
#ww_hovercard .ww_image img {
  display: block ;                                                      <!-- Baseline Elements -->
  float: right;                                                         <div orig_id= " ww_hovercard ">
  max-height: 150 px ;                                                    <div orig_class= " ww_image ">
  max-width: 180 px ;                                                       <img trigger= " no "></img>
  width: auto ;                                                           </div>
  height: auto ;                                                        </div>
  margin: 10 px ;
  border-radius: 2 px ;                                                 <!-- Trigger Elements -->
}                                                                       <div id=" ww_hovercard ">
                                                                          <div class=" ww_image ">
                                                                            <img trigger= " yes "></img>
                                                                          </div>
                                                                        </div>
        Listing 4: Decoy trigger for the WikiWand extension
<div id=" ww_hovercard ">                                           </div>
  <div class=" ww_image ">
    <img trigger= " yes "></img>
  </div>
</div>
                                                                       Listing 5 shows the final code our system generated for
                                                                    the trigger that we presented in Listing 4. The first structure
                                                                    is the baseline one while the second one is the one where
   It should be noted that we limited ourselves to 50 triggers      the extension (if present) will apply the corresponding style.
per extension as some of them included full libraries with          The style differences between the two will form the style
hundreds of rules. Generating triggers for each of them would       fingerprint of the extension.
have been redundant as only a few of them are needed to iden-
tify them. At the same time, the fact that there are hundreds       4.2.4    Verifying collisions between extensions
of ways that these extensions can be fingerprinted shows the
difficulty of defending against this type of fingerprinting.        While the analysis of a single extension can obviously reveal
                                                                    injected CSS styles, this is not sufficient to extract and craft
4.2.3    Confirming trigger fingerprints                            unique fingerprints. If a change of style is triggered by an ex-
                                                                    tension, there is no guarantee that no other extension produces
The third step consists in verifying that all generated triggers    the exact same style change. Some extensions could share
are correct and can be exploited to perform extension finger-       the same IDs and class names while others could inject very
printing. Indeed, even if triggers were built directly from CSS     generic rules. To characterize possible collisions, we exposed
rules, it can be hard to predict the exact runtime behavior of an   each extension capable of injecting CSS against the triggers
extension. Other styles could counter its effect and dynamic        of all extensions and recorded all the style changes.
code could remove an element or change its class on the fly.
For these reasons, we need to perform a thorough verification
as there is no guarantee that a decoy trigger will be effective     5     Analysis
in identifying an extension. As part of this verification, we
perform the following checks:                                       This section provides a detailed reporting of how extensions
   • We need to ensure that the observed changes are consis-        are fingerprintable through the styles they inject. We look at
tent over multiple runs. We collect style changes from the test     what makes them identifiable and, for the ones that are not
page of each extension three times and check that they are          identifiable, we explore the reasons why. We focus on study-
identical. This check helps us to discard non-deterministic         ing extensions that inject style rules universally on all web
changes that are the result of unreliable extension behavior.       pages (and are therefore fingerprintable on all page). Finally,
   • We also need to verify that our baseline calculation is        we also look at older versions of the extensions present in
effective. In our test pages, we use a baseline element to de-      our dataset to understand whether extensions are becoming
cide if a style was applied to an element or not. This baseline     fingerprintable over time.
element is located in a hierarchy that mimics the decoy one,
but with one important difference: it does not have any IDs         5.1     Pipeline statistics
or class names. This way, if we detect differences between
the baseline element and the decoy trigger, we can build the        Table 2 reports on the impact of our pipeline on our complete
extension fingerprint from their differences.                       dataset of 116,485 Chrome extensions.



2512     30th USENIX Security Symposium                                                                         USENIX Association
     Table 2: Number of extensions and triggers kept after each step of the pipeline shown in Figure 3 (Ma=Manifest, My=Mystique)

                                                                                Steps
                                     Initial dataset             1                  2            3          4
                                                       6,543 (Ma) 137 (My)
                      Extensions        116,485                                    5,885       4,806      4,446
                                                         6,645 (Combined)
                       Triggers             -                    -                102,997     54,788     40,722


Step 1. After parsing the manifest.json file of all extensions,       uniquely identified on any webpage because of the styles they
17,712 extensions (15.2%) inject at least one CSS file through        inject.
the Content script directive and 6,543 of them are doing so
on any domain. By using Mystique, we detected 137 exten-              5.2    Evaluating different fingerprinting
sions that rely on tabs.insertCSS to inject styles dynami-
cally into a page. Since 35 them were already injecting styles
                                                                             strategies
declaratively, we ended up with 6,645 potential fingerprint-          An advantage of style fingerprinting compared to more tradi-
able extensions. Note that this number represents the ceiling         tional browser fingerprinting, is that the quantity of collected
of our fingerprinting technique. An extension that does not           data can be adapted depending on the desired speed and pre-
inject CSS rules cannot be fingerprinted through them.                cision of the fingerprinting process. This difference translates
                                                                      into three different collection strategies:
Step 2. To generate the corresponding triggers, we use the
rules present in CSS files listed in the manifests and the ones       1. Triggers: If an extension has a unique trigger that is not
recorded by Mystique. In total, we generated 102,997 decoy               shared with any other extension, it is sufficient to test if the
triggers distributed across 5,885 test pages, one page for each          style of the trigger is different from the one of the baseline.
extension. For the extensions where we could not generate                The identification is fast as there is no need for additional
triggers, it was mainly due to the presence of pseudo-classes            data processing.
in the rules. Pseudo-classes are keywords in CSS that reflects
                                                                      2. Triggers and properties: If several extensions share the
the state of an element like hover, focus or active and
                                                                         same trigger, it can be enough to collect the list of modi-
they require specific user interaction to be activated. Even
                                                                         fied properties to identify each of them. For example, for
though we could craft pages for these specific scenarios, our
                                                                         extensions modifying a link element, one extension may
goal is to study style fingerprinting that can happen in the
                                                                         increase the size of the font while another may change
background without user interaction, so we discarded them.
                                                                         the background color. By identifying which properties of
Other extensions that had empty CSS files or with all rules
                                                                         the styled element were modified, one can differentiate
commented out were also removed at this stage.
                                                                         between the two extensions.
Step 3. The goal of this step is to confirm that differences          3. Trigger, properties, and values: This last strategy is the
in styles are indeed detectable. We ran all the extensions               one that produces the most data but it can lead to more
on their own test pages with Selenium to collect the style               precise results as you one can attribute a specific change
fingerprints. For some extensions, we observed no difference             directly to the right extension.
between the trigger element and the baseline. This happened
when some of the rules were very generic and did not rely on a           Table 3 shows the number of fingerprintable extensions
specific classes or IDs. For other extensions, Selenium crashed       depending on the chosen strategy. Strategies 2 and 3 offer
or did not return any data. At the end of this step, we had           an improvement of 6% and 15% respectively from Strategy
54,788 confirmed triggers for 4,806 potentially fingerprintable       1 but albeit at a slightly higher performance cost as more
extensions.                                                           data is collected and processed. When comparing the use of
                                                                      computed styles and dimensions, the numbers are compara-
Step 4. The final step is to make sure that no two extensions         ble between the two with no major differences. Dimension
share the exact same style fingerprint. We tested each of the         changes, however, could be sensitive to differences between
6,645 extensions on all the triggers from the 4,806 potentially       devices particularly when the database of fingerprints was gen-
fingerprintable extensions to identify possible collisions be-        erated with a device that had a much larger screen, compared
tween fingerprints. We describe the results of this particular        to the one that is being fingerprinted. One possible solution is
step in more detail in Section 5.4. After verification, we re-        to have multiple databases of dimension-related style finger-
moved 14,066 decoy triggers that produced the exact same              prints so that the fingerprinting algorithm can match the ones
change between two or more extensions. 4,446 (3.8%) ex-               that are the closest to the user’s own screen size. We view
tensions out of our initial set of 116,485 extensions can be          this as an implementation detail to make the fingerprinting



USENIX Association                                                                         30th USENIX Security Symposium           2513
Table 3: Numbers of extensions found to be fingerprintable via two CSS-originating leakages (i.e., computed styles and changed dimensions)
separately and together. Three implementation strategies give different number of uniquely attributed extensions.

      Fingerprinting Strategy                                 Change of Computed Styles                Change of Dimensions   Union
      Strategy 1: Unique (trigger)                                      3,865                                 3,866           3,866
      Strategy 2: Unique (trigger, parameters)                          4,088                                 3,927           4,090
      Strategy 3: Unique (trigger, parameters, values)                  4,412                                 4,162           4,446


Table 4: Distribution of the number of users across fingerprintable
                                                                                           100%
and non-fingerprintable extensions




                                                                         % of extensions
                                        Percentile                                         75%
                           .25      .50     .75    .99
  Fingerprintable          10.0    71.0 754.0 219,420.5                                    50%
 Non-fingerprintable       6.0     41.0 681.0 637,104.5
                                                                                           25%

process more robust and hence we consider it as out of scope                                0%
for this paper.                                                                                   0   50       100     150      200
                                                                                                           Cluster number
5.3    Statistics on fingerprintable extensions
                                                                        Figure 4: CDF graph of the distribution of collisions between non-
Mix between unique and shared triggers Out of the                       unique extensions that inject CSS.
4,446 uniquely identifiable extensions, 3,475 of them have at
least one trigger that is not shared with any other extension.
This means that the fingerprinting process for them is fast and         96.8% of the tested extensions presented changes in them.
straightforward as a script only has to check a single trigger          Many of these properties expose high-precision values (e.g.
for any difference in style compared to a baseline element.             six floating-point digits, such as “951.5px 0.046875px”)
For 846 extensions, they share all their triggers with other ex-        which unfortunately lead to extensions being uniquely
tensions but the changed properties and values are still unique         fingerprintable because of them. In terms of dimensions, the
to them. Finally, for 125 extensions, they are detectable be-           width and height of an element are high on our list with
cause of the unique combination of non-unique triggers they             96.0% and 84.2% of extensions affecting these properties,
change.                                                                 respectively. Interestingly, color-related style changes are
                                                                        not as common as we originally expected with the first
Distribution of popularity Looking at the number of users               color-related property (backgroundColor) being on the 24th
in Table 4, there is no significant difference between finger-          position of Table 6.
printable and non-fingerprintable extensions. Both categories
have extensions with few users as well as extensions with               5.4                 Understanding non-uniquely fingerprint-
more than 10 million users. If we look closely at extensions
with more than 100,000 users, 68 of them are vulnerable to
                                                                                            able extensions
style fingerprinting while 28 of them are not. Overall, we              Here, we investigate the reasons why some extensions that
do not observe a correlation between the popularity of an               inject CSS rules are not uniquely fingerprintable.
extension and its fingerprintability as it is mainly tied to its
functionality and how it was coded.
                                                                        Distribution of collisions Figure 4 presents the distribution
                                                                        of the clusters of collisions we have in our dataset. Most
Modified properties Injected styles can modify a wide
                                                                        of them are between a very small number of extensions as
range of properties in HTML elements. Table 6 in Appendix B
                                                                        confirmed by the long tail in our graph. Out of 218 different
list the top 50 properties that are the most modified by finger-
                                                                        clusters, 138 (63.3%) are between two extensions and 34
printable extensions. We want to highlight here some of our
                                                                        (15.6%) are between three. The 5 largest collision clusters we
findings.
                                                                        identified are of size 44, 19, 15, 13 and 9.
   At the top of the list are perspectiveOrigin,
transformOrigin, webkitPerspectiveOrigin                    and
webkitTransformOrigin. Even though few extensions                       Reasons for collisions We manually analyzed 50 different
in our dataset explicitly set values for these properties,              extensions to understand why two extensions would share the



2514    30th USENIX Security Symposium                                                                                USENIX Association
                                                                     Number of users in the same cluster
same style fingerprint. Our findings reveal that the majority                                              10000000               ●


                                                                                                                              ●

of collisions are due to very specific development behaviors:                                                             ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●           ●
                                                                                                                          ●
                                                                                                                              ●
                                                                                                                              ●   ●
                                                                                                                          ●       ●
                                                                                                                          ●   ●
                                                                                                            100000        ●
                                                                                                                          ●   ●
                                                                                                                                      ●                        ●


• Same name with different IDs: Several extensions can                                                                    ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                              ●
                                                                                                                                  ●

                                                                                                                                          ●
                                                                                                                                          ●
                                                                                                                          ●   ●               ●
                                                                                                                          ●

  have different IDs but they share the exact same name.                                                                  ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                              ●   ●
                                                                                                                                      ●
                                                                                                                                      ●       ●
                                                                                                                                              ●
                                                                                                                                                  ●                    ●


                                                                                                               1000       ●

  One example is the “Antalyx Desktop Sharing” Chrome                                                                     ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                              ●


                                                                                                                              ●
                                                                                                                              ●
                                                                                                                                  ●

                                                                                                                                  ●   ●
                                                                                                                                              ●
                                                                                                                                                  ●
                                                                                                                                                  ●   ●

                                                                                                                                                                   ●
                                                                                                                                                                                                       ●


                                                                                                                          ●
                                                                                                                          ●   ●   ●
                                                                                                                          ●           ●

  extension which has 4 different IDs in our dataset. They                                                                ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                              ●

                                                                                                                              ●
                                                                                                                              ●
                                                                                                                                  ●
                                                                                                                                  ●
                                                                                                                                      ●
                                                                                                                                          ●

                                                                                                                                                      ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                10
  are linked to the same developer but every new version was                                                              ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                          ●
                                                                                                                                  ●




  uploaded as a brand new extension instead of an update of                                                               ●



                                                                                                                      0                                   10               20    30              40
  an existing one.                                                                                                                            Number of extensions with the same style fingerprint


• Same developer with different variants: Extensions                Figure 5: Total number of users in clusters of extensions sharing an
  can have different IDs but they are simply variants               identical style fingerprint
  coming from the same developer. One example is the
  “Bonusway{.se,.ro,.cz...}” extension that is available in 13
  different variants. The code across all extensions is iden-       Impact of collisions on identifiability Being able to dis-
  tical but each of them embeds its own locale file for the         cover the exact list of extensions installed in a browser can
  interface. Another example comes from a series of “Safe           contribute to the overall device fingerprint and render its user
  Site” extensions we identified that only presented a differ-      identifiable. Yet, there is a large difference between detecting
  ence in the branding. At first, we thought they belonged          an extension shared by millions of users with one shared by a
  to different companies as each of them linked to different        few tens of users. To understand whether the extensions that
  websites: Ultra VPN, Total AV, Safe VPN, ScanGuard, PC            share style fingerprints have similar populations of users, we
  Protect and Privacy Web. Yet, looking at their terms of use       investigate the impact of collisions on the identifiability of
  revealed that all of them belong to the same group called         their users.
  Protected.net.                                                       In Figure 5, we clustered together the extensions with the
                                                                    same fingerprint and combined their userbase to understand
• Copies: Extensions can simply be a copy of another exten-         how many users are present in each cluster. It should be noted
  sion that was uploaded to the store. One example of such          that we did not get the number of users for all extensions as
  case is with “Privasee” that is a copy of an older version of     some of them were not available in the Chrome store at the
  the “DuckDuckGo Privacy Essentials” extension.                    time of writing. We can see that there is no direct correlation
• Same libraries: Extensions can share fingerprints if they         between the number of extensions in a cluster and the total
  use the exact same list of libraries. Several extensions in our   number of users. For example, there are 2,106,549 users in a
  dataset are only injecting styles based on jQuery: “jquery-       cluster containing 3 extensions while there are 411 users in
  ui.css” and “jquery.qtip.css”. Moreover, if an extension          the one containing 44. Then, some clusters have as many as 10
  builds on top of other well-known libraries, this can lead        million users while others can have as few as two users. In the
  to additional collisions. For example, the “uPerform® In-         end, if the goal is to uniquely identify users, detecting a group
  application Help” extension that is installed by more than        of several extensions can provide a lot more discriminating
  90,000 users relies on “jquery-ui” to build its UI founda-        information than detecting a single extension that is shared
  tion. One of the triggers generated by our pipeline is the        by many users. Note that this discussion focuses entirely on
  following:                                                        the discriminatory power of browser extensions, in terms of
                                                                    differentiating users from each other. Orthogonally to this
  <div id=" ancile-csh " class=" ancile-csh ">                      issue, even extensions that are shared by millions of users can
    <div trigger= " yes " class=" ui-front "></div>
  </div>                                                            reveal sensitive socioeconomic characteristics of their users.

 The inner div will be triggered by all extensions with             5.5                                         Performance Benchmarks
 “jquery-ui” while the outer one will only be triggered by
 “uPerform”.                                                        In this section, we quantify the real-world performance of our
                                                                    proposed extension fingerprinting method. Our evaluation is
• Coincidence: Sometimes, two extensions share the same             based on our proof-of-concept fingerprinting script, which we
  fingerprint for no reason other than pure coincidence. We         used for our video demo (https://vimeo.com/430428308)
  detected one case in our whole dataset where two ex-              that we mentioned in Section 3. Specifically, we measure the
  tensions have completely different goals but they share           time our script takes to detect random subsets of the 20 ex-
  one identical CSS rule. The “ePubby” and “Link Short-             tensions that we used for the video demo, with subset sizes
  cuts” extensions share the same rule on elements of class         varying from 1 to 20. We set up our script so that the detection
  css-isolation-popup.                                              logic runs inside the window.onload event listener (i.e., the



USENIX Association                                                                                                                                30th USENIX Security Symposium                      2515
                                                                                          DOM                    postMessage
                          17.5

                                                                                            3255                     61
                          15.0
                                                                                                            36
                          12.5                                                           693                              120
    Detection time (ms)




                          10.0
                                                                                                   5                86
                                                                                   1074                                      30164
                           7.5                                                                              30
                                                                                               4                      2139
                           5.0
                                                                                   CSS                 8          1307          WAR
                           2.5                                                                             1325

                           0.0
                                       5         10          15   20   Figure 7: Venn diagram showing the number of extensions detectable
                                              # Extensions
                                                                       by four fingerprinting techniques. Our newly-proposed method can
                                                                       detect 1,074 extensions which are “invisible” to all other methods.
Figure 6: Average detection time for different numbers of installed
extensions, with whiskers representing 95% confidence intervals.
                                                                       fingerprinting that were previously “invisible” to all other
                                                                       fingerprinting techniques. If WAR fingerprinting were to dis-
detection script is triggered after the page has loaded), and we
                                                                       appear, akin to the randomization of UUIDs present in Fire-
use the performance.now API for timing the execution of
                                                                       fox [8], CSS fingerprinting would be the only one to cover
our detection script (a start timestamp is taken on entrance to
                                                                       an additional 1,325 extensions. Overall, Figure 7 shows that
the window.onload listener, and an end timestamp is taken
                                                                       there is no ultimate method to detect all browser extensions
when all extensions in the subset are detected, and the de-
                                                                       as different techniques are able to fingerprint different sets of
tection time is the difference of these two timestamps). The
                                                                       extensions. Our findings are inline with the ones reported by
tests were run on a laptop with Intel Core i7-6600U CPU and
                                                                       Karami et al. on a dataset of 102,482 extensions [29].
12GB RAM. For each subset size from 1 to 20, we measure
the detection time 10 times and take the average.
   Figure 6 shows the results of our benchmarks. One can               5.7    Longitudinal analysis
see an overall upward trend as the number of extensions be-            Lastly, to understand whether the injection of CSS rules by
ing fingerprinted increases, while the variations are likely           extensions is a new phenomenon, we analyze a Chrome ex-
attributed to changing system load during the measurement.             tension dataset that spans five years (mid 2014 to mid 2019).
The increase in detection time as the number of fingerprinted          It comprises 501,349 extensions which is reduced to 426,807
extensions grows is due to the fact that more trigger elements         after excluding themes and apps. For an average month, our
need to be compared against their baseline (recall that for            dataset includes 4,384 new/updated extensions, with the store
each trigger we compare both the style rules returned by               size increasing from around 22K in 2014 to more than 116K
getComputedStyle, as well as its position and dimensions).             in 2019. Figure 8 presents the percentage of extensions in-
However, note that even for 20 extensions, our detection script        jecting CSS out of all collected extensions for this five-year
still finishes in around 15 milliseconds. Therefore, the real-         period. One can observe that the percentages of extensions
world performance overhead of this fingerprinting vector is            injecting CSS rules on all and some domains are largely stable
clearly not going to be a hindrance against trackers using it to       over time.
fingerprint thousands of popular extensions.                              As a separate experiment, for the 4,446 universally finger-
                                                                       printable extensions discovered in this paper, we tested their
5.6                        Comparison with related work                corresponding detection triggers after about a year. Overall,
                                                                       we discovered that, as of June 2020, only 940 extensions were
Prior work has explored different ways to detect browser ex-           updated, i.e., 79% of extensions have the same style finger-
tensions: probing for Web Accessible Resources (WAR) [24],             prints as they had a year ago. Out for the 940 extensions that
detecting DOM modifications [47], and capturing messages               updated at least once, after re-running our testing pipeline, 776
sent by postMessage [29, 45]. Figure 7 reports on the finger-          triggered at least one of their previously discovered triggers.
printability of our complete dataset by each of these tech-            In other words, 82.5% still remain fingerprintable despite their
niques, including our newly proposed, CSS-based extension              updates.
fingerprinting.                                                           Overall, when we consider these two experiments together,
   In total, CSS fingerprinting can uniquely detect 4,446 ex-          we can conclude that i) extensions that are currently finger-
tensions. Only 30 extensions are covered by all methods and            printable are likely to remain fingerprintable to CSS-based
1,074 extensions are now detectable through our CSS-based              fingerprinting, and ii) the trigger database that a tracker would



2516                        30th USENIX Security Symposium                                                               USENIX Association
                                      20%                                          Table 5: Top 10 TLD+1 domains that serve scripts that use the
                                                                                   getComputedStyle API, by the number of script inclusions. In
                % of all extensions



                                      15%                                          our crawl, we observe a total of 283,516 such inclusions.
                                      10%
                                                                                     TLD+1 Domain            # Inclusions     % All   # SHA256 (% All)
                                                                                     googlesyndication.com         54,966   19.39%           62 (0.10%)
                                      5%
                                                                                     facebook.com                  14,950    5.27%       9,727 (15.84%)
                                                                                     ajax.googleapis.com           14,027    4.95%          135 (0.22%)
                                      0%                                             doubleclick.net               11,930    4.21%           28 (0.05%)
                                                                                     twitter.com                    7,201    2.54%            4 (0.01%)
                                             Injecting CSS on URLs    Any   Some
                                                                                     adsafeprotected.com            6,077    2.14%        2,588 (4.21%)
                                                                                     youtube.com                    5,182    1.83%           29 (0.05%)
                                                                                     vidible.tv                     4,497    1.59%           24 (0.04%)
    Number of extensions




                           60000
                                                                                     2mdn.net                       4,006    1.41%          198 (0.32%)
                                                                                     cloudflare.com                 3,059    1.08%          411 (0.67%)
                           40000
                                                                                     Total                       145,979    51.49%      13,952 (22.72%)

                           20000



                                        0                                          in our crawl contain at least one getComputedStyle script
                                                                                   (i.e., in 76.64% of the crawled websites). By inclusion counts,
                                         1 3
                                         1 6
                                         1 9
                                         1 2
                                         1 3
                                         1 6
                                         1 9
                                         1 2
                                         1 3
                                         1 6
                                         1 9
                                         1 2
                                         1 3
                                         1 6
                                         1 9
                                         1 2
                                         1 3
                                         1 6
                                         1 9
                                         1 2
                                         19 3
                                              6
                                       20 4−0
                                       20 4−0
                                       20 4−0
                                       20 4−1
                                       20 5−0
                                       20 5−0
                                       20 5−0
                                       20 5−1
                                       20 6−0
                                       20 6−0
                                       20 6−0
                                       20 6−1
                                       20 7−0
                                       20 7−0
                                       20 7−0
                                       20 7−1
                                       20 8−0
                                       20 8−0
                                       20 8−0
                                       20 8−1
                                       20 9−0
                                           −0
                                         1




                                                                                   Table 5 shows the top 10 TLD+1 domains that served the most
                                      20




                                                         Year−Month
                                                                                   getComputedStyle scripts. These domains alone account for
Figure 8: Extensions injecting CSS styles (into any visited web page,              51.49% of all such script inclusions. For reference, we also list
or only on some specific URLs), shown over all collected extensions                in Table 5 the number of unique getComputedStyle scripts
in the Chrome Web Store from 2014 to 2019 at three-month intervals.                (i.e., by SHA-256 hash) served from each domain.
                                                                                      Next, to shed light on the current usage scenarios of
                                                                                   getComputedStyle and whether it is already being used for
need to compile for the fingerprintable extensions can remain                      browser fingerprinting in the way that we describe in this
effective for more than a year, before it would need to be                         paper, we conducted a manual analysis of representative sets
updated.                                                                           of scripts that used getComputedStyle. These sets of scripts
                                                                                   include: 1) the top scripts (by inclusion counts, as identi-
                                                                                   fied by SHA-256 hash of the script) from the top 10 TLD+1
6                             Countermeasures                                      domains that served the most getComputedStyle scripts;
                                                                                   2) similar to the first set, but here we focus on the top 10
Given the power of CSS-based extension fingerprinting, in
                                                                                   scripts served from URLs blacklisted by EasyList/EasyPri-
this section, we discuss possible countermeasures against it.
                                                                                   vacy (EL/EP); and lastly, 3) a random sample of 20 unique
First, we examine how the getComputedStyle API that this
                                                                                   scripts (again distinguished by their SHA-256 hashes) out
new fingerprinting technique relies on, is currently used in
                                                                                   of all of the getComputedStyle scripts in our crawl. We
the wild, and whether it is possible to simply remove support
                                                                                   categorize their use cases in the rest of this section.
for this API. Second, we present the design and evaluation of
an in-browser countermeasure that defends against this type                           The use cases we present in the following para-
of attack, by hiding the effects of extension-originating styles                   graphs are not intended to be an exhaustive list of all
from the pages on which they are active.                                           getComputedStyle use cases from our sample scripts, but
                                                                                   rather our best-effort manual analysis of these scripts, given
                                                                                   that many of them are obfuscated and/or minified. The pri-
6.1                                    Can getComputedStyle be removed?            mary purpose of this section is to establish that 1) the fin-
                                                                                   gerprinting technique that we present in this paper cannot be
To measure the prevalence of getComputedStyle usage and,
                                                                                   mitigated by simply removing the getComputedStyle API
more importantly, understand its uses cases in the current
                                                                                   given that API’s widespread usage, and 2) to demonstrate
web, we crawl the Alexa top 100K websites using V ISI -
                                                                                   that we did not find evidence of this fingerprinting technique
BLE V8, an open-source tool which adds instrumentation to
                                                                                   already being used in the wild.
Chromium so that all JavaScript API accesses during runtime
are logged [27]. In total, we found that 1) there are 61,414                       Wrapper for Getting Element Styles The first category of
unique scripts (as distinguished by their SHA-256 hashes) that                     getComputedStyle usage we describe is a class of wrap-
use the getComputedStyle API (hereafter for convenience                            per functions that encapsulate getComputedStyle, along
we refer to these as getComputedStyle scripts), 2) these                           with Element.style and Element.currentStyle. List-
getComputedStyle scripts are served from 60,375 distinct                           ing 6 shows one such wrapper from our manually examined
TLD+1 domains, and 3) 76,638 out of the top 100K websites                          samples that encapsulates getComputedStyle. The primary



USENIX Association                                                                                     30th USENIX Security Symposium             2517
                                                                    ing displayed on the page (e.g., by using visibility testing
Listing 6: JS snippet showing the use of getComputedStyle as part
                                                                    methods that we described). In total, we observed this be-
of a cross-browser compatibility layer
                                                                    havior in three out of the 40 sample scripts that we manually
function get_element_style_property ( elem , property
                                                                    examined (all three scripts are identified by EL/EP as trackers).
    ) {
  var value;                                                        Although this method of adblocker detection is conceptually
  if ( elem.currentStyle )                                          similar to what we describe in this paper, an important dif-
    value = elem.currentStyle [ property ];                         ference is that ad-blockers are expected to hide content and
  else if ( window.getComputedStyle )
    value = window.getComputedStyle ( elem ).
                                                                    therefore checking for the absence of ad-like elements is a
         getPropertyValue ( property );                             straightforward technique, variations of which were known as
  else                                                              early as 2011 [32]. Contrastingly, our technique generalizes
    value = elem.style [ property ];                                over all types of extensions (not just ad-blockers) and allows
  return value;
}
                                                                    for the precise identification of an extension, as opposed to
                                                                    merely knowing whether an ad-blocker is present or absent.
                                                                    Toggling Style Properties Lastly, there is also a category
                                                                    of getComputedStyle usage that probes for and toggles the
roles of these wrapper functions are two-fold: 1) they serve
                                                                    displayed visual properties of elements on the page (e.g.,
as a cross-browser compatibility layer for reading the style
                                                                    toggles the visibility of an element by first checking whether
sheets of an HTML element (e.g., Element.currentStyle
                                                                    the visibility property is set to hidden, and if so set it to
is a proprietary version of getComputedStyle and available
                                                                    visible).
only on old versions of Internet Explorer, which do not support
getComputedStyle), and 2) they provide a way to read the el-
ement’s inline style as fallback when the getComputedStyle          6.2    Hiding Extension Effects
method is removed by scripts (e.g., by invoking delete
window.getComputedStyle).                                           Given that we cannot just retire the getComputedStyle API,
   Note that as shown in Listing 6, besides their primary roles     an alternative method for protecting users is to break the link
mentioned above, these wrapper functions often offer the            between the injected content styles and the values returned by
added convenience of returning the value of a particular CSS        the getComputedStyle function. This would effectively hide
property specified as one of the wrapper’s arguments.               the presence of extensions from webpages and therefore pro-
                                                                    tect the users of browser extensions from being fingerprinted.
Compatibility Tests The getComputedStyle API is also                This hiding can be done at different layers in the browser,
used for compatibility testing. In such cases, CSS rules are        each with its advantages and disadvantages.
set for an element injected by the script on-the-fly, and the          In this section, we explain how a browser extension can
script then immediately reads back the CSS properties of the        replace the default getComputedStyle function with one
element using getComputedStyle. One example of this is              that ignores the styles injected by extensions. In Appendix A,
found in the popular jQuery, where the code sets the CSS            we provide the details of an alternative solution that modifies
property top to be 1% and then checks whether the read-back         the browser in order to achieve the same results. Our hope
value is in pixels. The reason for this test is that for certain    is that, once browser vendors confirm that this is an issue
CSS properties (e.g., top), some browsers will return their         worth tackling, that these details can provide a roadmap for
percentage values rather than absolute pixel values (see [7]),      the changes that need to happen.
while the rest of the script is expecting pixel values.
Visibility Testing Another category of use cases for                Browser extension The biggest advantage of a browser
getComputedStyle is to test the visibility of an element on         extension is that it is lightweight and easy to distribute but it
the page by checking, for example, if the value of the CSS          is limited to a finite set of browser APIs. Yet, making direct
property display is set to none (which means the element is         modifications to the DOM can provide a robust protection
not rendered on the page). Besides display, the properties          against CSS-based, extension fingerprinting, thanks to the
visibility and opacity are often also included in these             existence of Shadow DOMs. Figure 9 provides a high-level
types of checks, as well as element dimensions, e.g., checking      overview of our approach.
if the value of the width property is zero.
                                                                       A Shadow DOM is a hidden tree in the DOM that can be
Adblocker Detection We have observed a few cases from               attached to elements in the regular DOM tree. Its purpose is
our sample where the script is detecting whether the user has       to isolate all of its content from the regular DOM tree: IDs,
installed an adblocking extension. Specifically, the script ac-     names and styles do not “leak out” from Shadow DOMs and
complishes this by injecting an element with an ID or class         elements from the regular DOM tree also do not “bleed in.”
name targeted by the filter rules of the adblocker, and checks      This feature was primarily introduced for developers to avoid
whether the adblocker prevents the injected element from be-        naming conflicts when designing Web Components and we



2518    30th USENIX Security Symposium                                                                        USENIX Association
                   DOM                                                                         5000
                                                                                                      Browser
                       HTML              Page            Extension
        Original     elements        stylesheets         stylesheet                            4000     Standard
getComputedStyle
                                +                   +                                                   With extension




                                                                                   Time (ms)
                                                                      Extension
                                                                                               3000

                    Shadow DOM                                                                 2000
                            HTML                       Page
       Modified
getComputedStyle
                          elements
                                        +          stylesheets                                 1000

                                                                                                  0
                                                                                                      domContentLoadedEventStart       domComplete
                                                                                                                         Timed event

Figure 9: Difference between the original and the modified getCom-
                                                                                  Figure 10: Impact of the countermeasure on the loading times of
putedStyle function.
                                                                                  webpages.


can leverage it to modify the behavior of getComputedStyle.
When injected as a content script on page loads, our extension                        independent of network speed, congestion, and other issues
performs the following actions:                                                       that could impact our measurements.

1. Attach a new Shadow DOM to the document body.
                                                                                  • JavaScript errors: To identify if the injected code disrupts
2. Copy the complete regular DOM tree into the Shadow                               the natural flow of JavaScript code execution, we collected
   DOM. This creates a mirrored version of the regular DOM                          JavaScript errors directly from the browser. By checking
   with all inline styles and all page style sheets. Content                        the number of errors with and without the extension, we can
   styles from extensions are not present as they do not have                       see if the countermeasure causes any new breakage issues
   a physical presence in the regular DOM. They are applied                         that were not there before.
   seamlessly by the browser and, as such, cannot be copied
   into the Shadow DOM.
                                                                                  • Screenshots: As an extra verification step, we took screen-
3. Modify the code of getComputedStyle to use the Shadow                            shots of all visited pages with and without our browser ex-
   DOM. When the function is called on a element in the reg-                        tension, to check that our extension does not introduce any
   ular DOM, the modified function will look for the copy of                        potential side effects with visible artefacts. Since the visited
   this element in the Shadow DOM and execute the original                          webpages include news websites with ever-changing, fea-
   getComputedStyle function on it. For optimization pur-                           tured stories as well as dynamic ads, we opted to perform
   poses, we only reroute calls on elements that have an ID                         this verification manually.
   or a class from one of the installed extensions.
                                                                                     We repeated our measurements five times with and without
In the end, the computed style will be the exact same as the
                                                                                  our extension to average the loading times and smooth out any
one from the regular DOM element but without any modifica-
                                                                                  unusual discrepancies. The results are presented in Figure 10.
tions from content styles. A video showing our extension in
action is available here: https://vimeo.com/430428277                                Looking at the loading times, both boxplots are almost iden-
                                                                                  tical with a difference between mean values of less than 0.5%.
                                                                                  In terms of JavaScript errors, only reuters.com presented ad-
Evaluation and performance In order to evaluate the per-
                                                                                  ditional errors when our extension was present (6 with and
formance of our browser extension and identify any potential
                                                                                  0 without). By analysing the script that crashed, we found
breakage, we crawled the homepage of the Tranco top 200
                                                                                  that getComputedStyle was called on a < g > container in
websites [39] with and without our countermeasure. We used
                                                                                  a SVG element that lacked an essential property that was used
Puppeteer [12] to pilot a Chrome web browser on a laptop
                                                                                  in our extension’s logic. After adding one additional check,
with an Intel i7 processor running on Ubuntu 19.10 and we
                                                                                  we revisited the same website and discovered no errors. Fi-
collected the following information:
                                                                                  nally, looking at screenshots with and without the extension,
• Loading          times:      We         used       the                          we observed no noticeable differences between the two crawls
  PerformanceNavigationTiming API to collect the                                  apart from changes in the dynamic content.
  responseEnd, domContentLoadedEventStart            and                             Given the near-zero performance overhead, the lack of new
  domComplete properties. These three metrics help us                             JavaScript errors, and the visual confirmation that pages were
  calculate the overhead imposed by our solution as they                          not affected by our extension, we argue that our countermea-
  focus on the processing of documents and scripts after                          sure protects against style fingerprinting with minimal impact
  all major HTTP requests have been performed. They are                           on the overall user experience.



USENIX Association                                                                                              30th USENIX Security Symposium       2519
7    Related work                                                   ever, it remains unclear whether users are capable of configur-
                                                                    ing these whitelists and what is the real protection that these
Browser fingerprinting has received signification attention         mechanisms offer, in the presence of multiple JavaScript third
from the research community over the last decade. Eckers-           parties in popular sites who can take advantage of the trust
ley [19], Laperdrix et al. [30] and Gómez-Boix et al. [23]          associated with the first-party website.
showed that it can be used to identify users on the Internet           CloakX by Trickel et al. follows a different approach for
even though this may prove difficult at a very large scale.         protecting extensions against fingerprinting [48]. It random-
Moreover, later studies quantified the use of fingerprinting on     izes what makes an extension identifiable while maintain-
the public web and showed its growing adoption by popular           ing equivalent functionality, i.e., it randomizes the path of
sites [14, 15, 20, 38]                                              web accessible resources to prevent WAR probing attacks,
                                                                    it changes the behavioural fingerprint by changing ID and
Extension fingerprinting attacks Prior work has also inves-         class names that are injected, and it adds a proxy to handle
tigated the specific problem of fingerprinting browser exten-       dynamic references to randomized elements. CloakX does
sions. Sjosten et al. [44] demonstrated how Web Accessible          not account for styles and therefore cannot stop our new CSS-
Resources (WARs) could be abused to enumerate the presence          based, extension-fingerprinting attack.
of specific browser extensions. Gulyás et al. [24] built on their
findings and performed a study on 16,393 users to understand
how WAR fingerprinting contributes to users’ uniqueness.            8   Conclusion
They found that 54.86% of users with at least one detectable
extension could be uniquely identified. Orthogonal to the use       Stateless tracking significantly affects the privacy of web users
of WARs, Starov and Nikiforakis [47] looked at the finger-          and has recently received increased attention by researchers
printability of extensions through DOM modifications. With          and browser vendors. In this paper we focus on the CSS rules
a tool named XHound, they tested the 10,000 most popular            that browser extensions inject in visited web pages as part of
Chrome extensions and found that 9% of them introduce mod-          their logic and show how these rules can be abused to identify
ifications that are detectable on any domain. Sanchez-Rola et       a user’s installed extensions. To understand the magnitude
al. [42] used a timing side-channel to infer the presence of any    of this problem, we developed a pipeline that leverages both
browser extension installed in the browser, even if they are        static and dynamic analysis of browser extensions in order
disabled in incognito mode. Van Goethem and Joosen [49]             to identify a set of triggers that can be used for CSS-based,
presented in the same year a variation of this attack to link a     extension fingerprinting. Our analysis of 116,485 extensions
user’s isolated browsing sessions. These side channels have         revealed that 4,446 (3.8%) of them can be uniquely identified
been fixed by the Chromium team [3, 4] and can therefore no         on any webpage based on the styles they inject. We inves-
longer be used for extension fingerprinting. Finally, Karami et     tigate how the involved browser APIs are used in the wild,
al. [29] recently introduced a tool called Carnus to automate       propose concrete countermeasures that browser vendors can
the creation and detection of extension fingerprints. They          adopt to mitigate this problem, and provide a countermea-
combine both WAR and behavioural fingerprints but also add          sure solution via a browser extension that demonstrates our
inter and intra-communication based enumeration. Out of             defense mechanism.
102,482 extensions, they can detect 29,428 of them.
   To the best of our knowledge, we are the first to show           Availability
that injected style sheets can be used for detecting installed
browser extensions, and to measure the vulnerability of exten-      The artifact accompanying this paper can be found
sions in the wild. As we showed in Section 5.6, this technique      at https://github.com/plaperdr/fingerprinting-in-
allowed us to fingerprint more than 1,000 extensions which          style. Our defense prototype can be installed and tested on
were “invisible” to all other current methods of extension          a demo page in a Chromium-based browser. We also provide
fingerprinting.                                                     the complete set of 4,446 extensions detectable through style
                                                                    fingerprinting along with the generated trigger pages.
Extension fingerprinting defences Three studies have pre-
sented extensive designs to mitigate extension fingerprinting.
Sjosten et al. [43] propose a defence system called Latex           Acknowledgements
Gloves to prevent WAR fingerprinting. Extensions are repack-
aged to modify the whitelist of websites on which they can run      We thank the anonymous reviewers for their helpful feedback.
and a special extension blocks unauthorized probing through         This project is partially funded by the Hauts-de-France region
the webRequest API. Starov et al. [45] also uses a whitelist        in the context of the ASCOT project of the STaRS frame-
to enforce strict access to browser extensions resources. Both      work, by the National Science Foundation (under awards
of these approaches can mitigate our presented attack by basi-      CNS-1941617, CNS-1703375 and CNS-1813974), and by the
cally turning off an extension on an undesired website. How-        Office of Naval Research under grant N00014-20-1-2720.



2520    30th USENIX Security Symposium                                                                        USENIX Association
References                                                           [16] Gaurav Aggarwal, Elie Bursztein, Collin Jackson, and Dan
                                                                          Boneh. An analysis of private browsing modes in modern
 [1] :visited support allows queries into global history -                browsers. In Proceedings of the 19th USENIX conference on
     Mozilla Bug Tracker. https://bugzilla.mozilla.org/                   Security, pages 6–6. USENIX Association, 2010.
     show_bug.cgi?id=147777, 2002.                                   [17] Andrew Clover. CSS visited pages disclosure - BUGTRAQ
 [2] Keep visited links private so that history info isn’t                mailing listposting.  https://seclists.org/bugtraq/
     leaked. - Webkit Bug Tracker. https://bugs.webkit.org/               2002/Feb/271, 2002.
     show_bug.cgi?id=24300, 2009.                                    [18] Quan Chen and Alexandros Kapravelos. Mystique: Uncovering
 [3] Issue 611420: WebAccessibleResources take too long                   information leakage from browser extensions. In Proceedings
     to make a decision about loading if the extension                    of the ACM Conference on Computer and Communications
     is installed. https://bugs.chromium.org/p/chromium/                  Security (CCS), 2018.
     issues/detail?id=611420, 2017.                                  [19] Peter Eckersley. How Unique Is Your Browser? In Proceedings
 [4] Issue 709464: Detecting the presence of extensions                   of the Privacy Enhancing Technologies Symposium (PETS),
     through timing attacks (including Incognito) - Chromium              pages 1–17, 2010.
     bug tracker. https://bugs.chromium.org/p/chromium/              [20] Steven Englehardt and Arvind Narayanan. Online tracking: A
     issues/detail?id=709464, 2017.                                       1-million-site measurement and analysis. In Proceedings of
                                                                          the 2016 ACM SIGSAC Conference on Computer and Commu-
 [5] CSS Cascading and Inheritance Level 3 - W3C Candidate Rec-
                                                                          nications Security, CCS, 2016.
     ommendation. https://www.w3.org/TR/css3-cascade/
     #cascading-origins, 2018.                                       [21] Cristiano Giuffrida, Stefano Ortolani, and Bruno Crispo. Mem-
                                                                          oirs of a browser: A cross-browser detection model for privacy-
 [6] Stylish - Custom themes for any website -
                                                                          breaching extensions. In Proceedings of the 7th ACM Sympo-
     Chrome Web Store.      https://chrome.google.com/
                                                                          sium on Information, Computer and Communications Security,
     webstore/detail/stylish-custom-themes-for/
                                                                          pages 10–11. ACM, 2012.
     fjnbnpbmkenffdnngjfgmeleoegfcffe, 2019.
                                                                     [22] Nicolas Golubovic.         Attacking browser exten-
 [7] Bug 29084 - getComputedStyle returns percentage values               sions.    Ruhr-Universitat Bochum, Volume 3, 2016.
     for left / right / top / bottom . https://bugs.webkit.org/           https://golubovic.net/thesis/master.pdf.
     show_bug.cgi?id=29084, 2020.
                                                                     [23] Alejandro Gómez-Boix, Pierre Laperdrix, and Benoit Baudry.
 [8] Chrome    incompatibilities –  Mozilla  |  MDN.                      Hiding in the Crowd: an Analysis of the Effectiveness of
     https://developer.mozilla.org/en-US/                                 Browser Fingerprinting at Large Scale. In WWW 2018: The
     docs/Mozilla/Add-ons/WebExtensions/                                  2018 Web Conference, Lyon, France, April 2018.
     Chrome_incompatibilities#web_accessible_resources,
                                                                     [24] Gabor Gyorgy Gulyas, Doliere Francis Some, Nataliia Bielova,
     2020.
                                                                          and Claude Castelluccia. To extend or not to extend: On the
 [9] Controlling CSS Animations and Transitions with                      uniqueness of browser extensions and web logins. In Proceed-
     JavaScript.   https://css-tricks.com/controlling-                    ings of the 2018 Workshop on Privacy in the Electronic Society,
     css-animations-transitions-javascript/, 2020.                        WPES’18, pages 14–27, 2018.
[10] Element.currentStyle. https://developer.mozilla.org/            [25] Lin-Shung Huang, Zack Weinberg, Chris Evans, and Collin
     en-US/docs/Web/API/Element/currentStyle, 2020.                       Jackson. Protecting browsers from cross-origin CSS attacks.
                                                                          In Proceedings of the 17th ACM conference on Computer and
[11] Match Patterns.     https://developer.chrome.com/
                                                                          communications security, pages 619–629, 2010.
     extensions/match_patterns, 2020.
                                                                     [26] Artur Janc and Lukasz Olejnik. Feasibility and real-world
[12] Puppeteer: Headless Chrome Node.js API - GitHub. https:              implications of web browser history detection. Proceedings of
     //github.com/puppeteer/puppeteer, 2020.                              W2SP, 2010.
[13] Window.getComputedStyle().               https://               [27] Jordan Jueckstock and Alexandros Kapravelos. VisibleV8: In-
     developer.mozilla.org/en-US/docs/Web/API/Window/                     browser Monitoring of JavaScript in the Wild. In Proceedings
     getComputedStyle, 2020.                                              of the ACM Internet Measurement Conference (IMC), 2019.
[14] Gunes Acar, Christian Eubank, Steven Englehardt, Marc Juarez,   [28] Alexandros Kapravelos, Chris Grier, Neha Chachra, Christo-
     Arvind Narayanan, and Claudia Diaz. The Web never forgets:           pher Kruegel, Giovanni Vigna, and Vern Paxson. Hulk: Elicit-
     Persistent tracking mechanisms in the wild. In Proceedings of        ing malicious behavior in browser extensions. In 23rd USENIX
     the 21st ACM Conference on Computer and Communications               Security Symposium (USENIX Security 14), pages 641–654,
     Security (CCS), 2014.                                                San Diego, CA, August 2014. USENIX Association.
[15] Gunes Acar, Marc Juarez, Nick Nikiforakis, Claudia Diaz, Seda   [29] Soroush Karami, Panagiotis Ilia, Konstantinos Solomos, and Ja-
     Gürses, Frank Piessens, and Bart Preneel. FPDetective: Dust-         son Polakis. Carnus: Exploring the privacy threats of browser
     ing the Web for fingerprinters. In Proceedings of the 20th           extension fingerprinting. In 27th Annual Network and Dis-
     ACM Conference on Computer and Communications Security               tributed System Security Symposium, NDSS 2020, San Diego,
     (CCS), 2013.                                                         California, USA, February 23-26, 2020, 2020.



USENIX Association                                                                       30th USENIX Security Symposium           2521
[30] Pierre Laperdrix, Walter Rudametkin, and Benoit Baudry.              Network and Distributed System Security Symposium, NDSS
     Beauty and the Beast: Diverting modern web browsers to build         2019, San Diego, California, USA, February 24-27, 2019, 2019.
     unique browser fingerprints. In 37th IEEE Symposium on Se-      [44] Alexander Sjösten, Steven Van Acker, and Andrei Sabelfeld.
     curity and Privacy (S&P 2016), San Jose, United States, 2016.        Discovering browser extensions via web accessible resources.
[31] Zhuowei Li, XiaoFeng Wang, and Jong Choi. SpyShield: Pre-            In Proceedings of the Seventh ACM on Conference on Data
     serving privacy from spy add-ons. In Recent Advances in              and Application Security and Privacy, CODASPY, 2017.
     Intrusion Detection, pages 296–316. Springer, 2007.             [45] Oleksii Starov, Pierre Laperdrix, Alexandros Kapravelos, and
[32] Keaton Mowery, Dillon Bogenreif, Scott Yilek, and Hovav              Nick Nikiforakis. Unnecessarily Identifiable: Quantifying the
     Shacham. Fingerprinting information in JavaScript implemen-          Fingerprintability of Browser Extensions Due to Bloat. In The
     tations. In Helen Wang, editor, Proceedings of W2SP 2011.            World Wide Web Conference, WWW, 2019.
     IEEE Computer Society, May 2011.                                [46] Oleksii Starov and Nick Nikiforakis. Extended tracking pow-
[33] Keaton Mowery and Hovav Shacham. Pixel perfect: Finger-              ers: Measuring the privacy diffusion enabled by browser exten-
     printing canvas in HTML5. In Proceedings of the Web 2.0              sions. In Proceedings of the 26th International Conference on
     Security & Privacy Workshop, 2012.                                   World Wide Web, pages 1481–1490. International World Wide
[34] Mystique Analyzer.       https://mystique.csc.ncsu.edu/              Web Conferences Steering Committee, 2017.
     about.                                                          [47] Oleksii Starov and Nick Nikiforakis. XHOUND: quantifying
[35] Nick Nikiforakis, Luca Invernizzi, Alexandros Kapravelos,            the fingerprintability of browser extensions. In 2017 IEEE
     Steven Van Acker, Wouter Joosen, Christopher Kruegel, Frank          Symposium on Security and Privacy, SP 2017, pages 941–956,
     Piessens, and Giovanni Vigna. You are what you include:              2017.
     Large-scale evaluation of remote javascript inclusions. In      [48] Erik Trickel, Oleksii Starov, Alexandros Kapravelos, Nick Niki-
     Proceedings of the 2012 ACM Conference on Computer and               forakis, and Adam Doupé. Everyone is Different: Client-side
     Communications Security, CCS ’12, pages 736–747, 2012.               Diversification for Defending Against Extension Fingerprint-
[36] Nick Nikiforakis, Wouter Joosen, and Benjamin Livshits. Pri-         ing. In 28th USENIX Security Symposium (USENIX Security
     Varicator: Deceiving Fingerprinters with Little White Lies.          19), 2019.
     Research.Microsoft.Com, 2014.                                   [49] Tom Van Goethem and Wouter Joosen. One side-channel to
[37] Nick Nikiforakis, Alexandros Kapravelos, Wouter Joosen,              bring them all and in the darkness bind them: Associating
     Christopher Kruegel, Frank Piessens, and Giovanni Vigna.             isolated browsing sessions. In WOOT, 8 2017.
     Cookieless monster: Exploring the ecosystem of web-based        [50] Michael Weissbacher, Enrico Mariconti, Guillermo Suarez-
     device fingerprinting. In Proceedings of the IEEE Symposium          Tangil, Gianluca Stringhini, William Robertson, and Engin
     on Security and Privacy, SP ’13, pages 541–555, 2013.                Kirda. Ex-Ray: Detection of history-leaking browser exten-
[38] Nick Nikiforakis, Alexandros Kapravelos, Wouter Joosen,              sions. In Annual Computer Security Applications Conference
     Christopher Kruegel, Frank Piessens, and Giovanni Vigna.             (ACSAC), 2017.
     Cookieless monster: Exploring the ecosystem of web-based
     device fingerprinting. In Proceedings of the 34th IEEE Sym-
     posium on Security and Privacy (IEEE S&P), pages 541–555,
                                                                     A    Countering style fingerprinting at the
     2013.                                                                browser level
[39] Victor Le Pochat, Tom van Goethem, Samaneh Tajal-
                                                                     While browser extensions are lightweight and can easily be
     izadehkhoob, Maciej Korczynski, and Wouter Joosen. Tranco:
     A research-oriented top sites ranking hardened against ma-      installed, their scope of actions is limited to the available
     nipulation. In 26th Annual Network and Distributed System       WebExtension APIs. A built-in protection can go beyond
     Security Symposium, NDSS 2019, San Diego, California, USA,      in terms of flexibility and performance by having its logic
     February 24-27, 2019. The Internet Society, 2019.               directly integrated with native code. We also argue that this
[40] John Resig. Pro JavaScript Techniques, 2006.                    problem should be fixed directly by browser vendors to protect
                                                                     all their users from style leakage. To that end, we provide here
[41] Franziska Roesner, Tadayoshi Kohno, and David Wetherall.
                                                                     a blueprint of the modifications that could be made to prevent
     Detecting and defending against third-party tracking on the
     web. In Proceedings of the 9th USENIX Conference on Net-        style leakage through extensions.
     worked Systems Design and Implementation, NSDI’12, pages
     12–12, Berkeley, CA, USA, 2012. USENIX Association.             Overview Figure 11 provides information on how the
[42] Iskander Sanchez-Rola, Igor Santos, and Davide Balzarotti.      browser can be modified to provide protection. The approach
     Extension breakdown: Security analysis of browsers extension    is similar in essence to the one applied to fix the visited history
     resources control policies. In 26th USENIX Security Sympo-      leakage [1,2,17] but extended in many ways to fulfill our goal.
     sium, pages 679–694, 2017.                                      Throughout the entire page rendering pipeline, the only stage
[43] Alexander Sjösten, Steven Van Acker, Pablo Picazo-Sanchez,      that needs to be changed is the Style one. It is responsible for
     and Andrei Sabelfeld. Latex Gloves: Protecting Browser Ex-      collecting all style sheets and computing the style for each
     tensions from Probing and Revelation Attacks. In 26th Annual    individual element. In a nutshell, to prevent style leakage,



2522    30th USENIX Security Symposium                                                                           USENIX Association
                                         JS/CSS                Style                Layout               Paint              Composite




              Step              Action                        Modifications needed                       C++ classes
                       Gather all style rules and     Add support for “ExtensionAuthor” and      Document, WebDocument,
               1
                             index them                “ExtensionUser” origins for a CSS rule          StyleEngine
                                                                                                                                    Style
                      Visit each element and see                                                    Document, Element,
               2
                      what styles apply to them
                                                                         -
                                                                                                       StyleResolver
                                                                                                                                 computation
                     Combine rules to get the final   Compute two styles: one with and one       StyleResolver, StyleBuilder,
               3
                           computed style                   without content styles                      CSSProperty


              Step              Action                        Modifications needed                C++ classes and methods
                       getComputedStyle call in
               1                                                         -                               V8Window
                             JavaScript
                                                                                                                                     Style
                     getComputedStyle call in the              Add support for an
               2
                          window context                 “allowExtensionStyles” boolean
                                                                                                     LocalDomWindow                retrieval
                       Get the right style value        Add a switch that selects the right     CSSComputedStyleDeclaration
               3
                      depending on the context                  computed style                         CSSProperty


                                            Figure 11: Overview of the built-in browser modifications.


the browser needs to maintain two computed styles for each
                                                                                   Modifying getComputedStyle Now that two distinct com-
element: one with the style sheets from installed extensions
                                                                                   puted styles exist, we need to modify the getComputedStyle
and one without.
                                                                                   function to direct it to the right style depending on the ex-
                                                                                   ecution context. We propose to add a boolean called “al-
Maintaining two computed styles Each style rule applied                            lowExtensionStyles” that can be propagated up to each CSS
on a webpage has one of three different CSS cascade ori-                           property to select the proper value to return. For example,
gins [5]:                                                                          if getComputedStyle is executed in a standard webpage, a
   • Author Origin: this origin belongs to rules contained in                      “false” value will be propagated to prevent style leakage. In
     the source document or in external style sheets.                              the context of using Chrome DevTools for debugging an ap-
                                                                                   plication, a “true” value will be sent, allowing the user to see
   • User Origin: it comes from rules that the user has speci-                     the true computed value with extension styles.
     fied for a specific document (set through a special inter-
     face or with an extension like Stylish [6]).
   • User Agent Origin: this is the default style provided                         Protection at the Layout stage Some extensions may intro-
     by the browser. This style can be modified if the user                        duce custom style sheets that have a direct impact on the size
     changes the default fonts or accessibility options.                           of an element. For example, by changing the relative width
                                                                                   of an element from 20 to 30%, its actual size will change at
These origins are important as they determine which rule                           the Layout stage and could be detected by a malicious script.
has priority over another one. Introducing additional origins                      To counter this problem, we can go even further by combin-
with new priorities is not appropriate as it will make the over-                   ing our approach with the one proposed by Nikiforakis et
all design of a webpage even more complicated for devel-                           al. in [36]. In it, they introduce randomization policies that
opers. Instead, we propose to extend the first two cascade                         can be used to modify specific attributes of HTML elements.
origins with two additional ones: Extension Author Origin                          In our case, we can use a policy to randomize an element’s
and Extension User Origin. They will have the exact same                           dimensions to prevent such leakage.
priority as their non-extension counterpart but will carry the
additional information that they originate from a browser
extension. This way, thanks to a custom Style resolver, the
StyleFromElement function can properly compute two sep-                            B      Top modified properties by fingerprintable
arate styles and maintain them throughout the lifetime of the                             extensions
HTML element.




USENIX Association                                                                                        30th USENIX Security Symposium       2523
              Table 6: List of the top 50 properties ranked by the number of extensions modifying them with injected styles

        Property           Count        Property        Count           Property          Count
   perspectiveOrigin       4302       background        3610       webkitBorderEnd        3361              Property          Count
    transformOrigin        4302           right         3583       borderBlockStart       3355       webkitBorderEndColor     3269
 webkitPerspectiveOrigin   4302          bottom         3538           borderTop          3355       borderBlockStartColor    3265
 webkitTransformOrigin     4302          border         3439      webkitBorderBefore      3355          borderTopColor        3265
       inlineSize          4268     borderBlockEnd      3403          borderColor         3348      webkitBorderBeforeColor   3265
  webkitLogicalWidth       4268      borderBottom       3403     borderBlockEndColor      3304              padding           3166
         width             4268    webkitBorderAfter    3403      borderBottomColor       3304               zIndex           3166
        position           3749     borderInlineStart   3390    webkitBorderAfterColor    3304                font            3152
       blockSize           3743        borderLeft       3390     borderInlineStartColor   3303         paddingInlineStart     3052
         height            3743    webkitBorderStart    3390        borderLeftColor       3303        webkitPaddingStart      3052
  webkitLogicalHeight      3743    backgroundColor      3387    webkitBorderStartColor    3303            paddingLeft         3051
           top             3662     borderInlineEnd     3361     borderInlineEndColor     3269         paddingInlineEnd       2983
           left            3631       borderRight       3361       borderRightColor       3269




2524   30th USENIX Security Symposium                                                                               USENIX Association
