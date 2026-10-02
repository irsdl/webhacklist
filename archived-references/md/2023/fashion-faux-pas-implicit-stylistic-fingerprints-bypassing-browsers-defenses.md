---
type: Whitepaper
title: "Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers' Anti-Fingerprinting Defenses"
description: "StylisticFP fingerprints a browser and device using only CSS: sized iframes, media queries and element layouts reveal fonts, operating system, browser and screen properties through dimensions alone, so no JavaScript API is touched and the anti-fingerprinting defences in Tor, Brave, Firefox, Safari and privacy extensions, which hook those APIs, never see the tracking."
resource: "https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf"
tags: [whitepaper, webseclist-reference, css, iframe, side-channel, info-leak, browser-extension, measurement-study]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T20:32:12+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf"
    title: "Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers' Anti-Fingerprinting Defenses"
    author: Xu Lin, Frederico Araujo, Teryl Taylor, Jiyong Jang, Jason Polakis
also_at: []
authors:
  - Xu Lin
  - Frederico Araujo
  - Teryl Taylor
  - Jiyong Jang
  - Jason Polakis
canonical_url: ""
cited_by:
  - "2023.md:90"
commit: ""
content_sha256: e5a6166807ac4eeb4936d6eb247caeee407ecbcc534db3f88028b9ae5cc8387d
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: c17998dae976f0f381f8ef35caa83d8bf7ec18107070122b2c4e12e9a3e6c529
retrieved_from: "https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T20:32:12+00:00"
slug: fashion-faux-pas-implicit-stylistic-fingerprints-bypassing-browsers-defenses
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers' Anti-Fingerprinting Defenses

**Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers' Anti-Fingerprinting Defenses** - Xu Lin, Frederico Araujo, Teryl Taylor, Jiyong Jang, Jason Polakis, Publisher not stated.

- Published: date not stated
- Original: <https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf>
- Preserved from: https://www.cs.uic.edu/~polakis/papers/lin-sp23.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Fashion Faux Pas: Implicit Stylistic Fingerprints for Bypassing Browsers' Anti-Fingerprinting Defenses

Fashion Faux Pas: Implicit Stylistic Fingerprints
                     for Bypassing Browsers’ Anti-Fingerprinting Defenses

                       Xu Lin∗ , Frederico Araujo† , Teryl Taylor† , Jiyong Jang† , Jason Polakis∗
                                         ∗ University of Illinois Chicago, † IBM Research
                     ∗ {xlin48, polakis}@uic.edu, † {frederico.araujo, terylt}@ibm.com, † jjang@us.ibm.com



Abstract—Browser fingerprinting remains a topic of particular       restrictions (e.g., [9]). This arms race has motivated the
interest for both the research community and the browser            development of alternative cookie-less tracking techniques;
ecosystem, and various anti-fingerprinting countermeasures          browser and device fingerprinting techniques have drawn
have been proposed by prior work or deployed by browsers.           significant attention from the research community, resulting
While preventing fingerprinting presents a challenging task,        in a plethora of insightful studies and new techniques [10]–
modern fingerprinting techniques heavily rely on JavaScript         [27]. Alarmingly, research has revealed a drastic increase
APIs, which creates a choke point that can be targeted by
                                                                    in fingerprinting practices in the wild; while only 0.4% of the
                                                                    top 10K sites leveraged browser fingerprinting in 2013 [28],
countermeasures. In this paper, we explore how browser
                                                                    in 2021 that number climbed to 25% [29].
fingerprints can be generated without using any JavaScript               Popular browsers have recently adopted a series of
APIs. To that end we develop StylisticFP, a novel finger-           defensive countermeasures that mitigate browser finger-
printing system that relies exclusively on CSS features and         printing by blocking certain API calls (e.g., Tor blocking
implicitly infers system characteristics, including advanced        the Canvas API [30]), randomizing the values that certain
fingerprinting attributes like the list of supported fonts,         API calls return to websites (e.g., Brave randomizing what
through carefully constructed and arranged HTML elements.           is returned by the Canvas API [31]), or limiting what system
We empirically demonstrate our system’s effectiveness against       resources are made available to websites (e.g., Firefox limiting
privacy-focused browsers (e.g., Safari, Firefox, Brave, Tor) and    what system fonts can be used [32]). Researchers have also
popular privacy-preserving extensions. We also conduct a pi-        proposed strategies for detecting and blocking fingerprinting
lot study in a research organization and find that our system       based on the use of specific JavaScript APIs [29], [33]–[36].
is comparable to a state-of-the-art JavaScript-based fingerprint-        In this paper we focus on how existing anti-tracking
ing library at distinguishing devices, while outperforming it       defenses adopted by privacy-oriented browsers and tools can
                                                                    be bypassed. To that end, we explore implicit stylistic browser
against browsers with anti-fingerprinting defenses. Our work
                                                                    fingerprints (henceforth referred to as stylistic fingerprints
highlights an additional dimension of the significant chal-
                                                                    for simplicity), wherein we infer information about the user’s
lenge posed by browser fingerprinting, and reaffirms the need       environment using CSS features. Our work is motivated
for more robust detection systems and countermeasures.              by the following observations: (𝑖) different HTML elements
                                                                    have different sizes depending on aspects of the environment
1. Introduction                                                     that they are rendered in, and (𝑖𝑖) elements’ dimensions can
                                                                    be indirectly inferred using CSS features. Guided by our
    Online tracking is pervasive across the web ecosys-             observations, we develop a novel fingerprinting technique
tem and has continued to affect users for more than two             that infers browser and system attributes without using any
decades [1]. While many mitigations have been proposed              JavaScript APIs (which constitute the cornerstone of modern
throughout the years [2], and major browser vendors (e.g.,          browser fingerprinting). Our system generates the user’s
Safari, Firefox, and Brave) have become more aggressive             stylistic fingerprint based on environmental attributes ranging
in deploying anti-tracking defenses [3]–[5], the underlying         from basic properties, like the browser and the operating
economy provides a strong incentive for advertisers and other       system, to advanced fingerprints like the list of supported fonts.
entities to maintain their privacy-invasive practices. This         These attributes are implicitly inferred through the dimensional
has resulted in the public discourse around online privacy          properties of carefully crafted iframe-based constructions,
growing louder, and the U.S. Congress and Senate members            while also leveraging feature grouping, element placement, and
introducing drafts and legislation outlining privacy protection     ordering optimizations for achieving practical performance.
measures [6]. Concerns about online tracking have also                   To explore our system’s robustness against anti-tracking
prompted a series of legislative initiatives that aim to curb       defenses, we provide an in-depth empirical analysis against
and regulate tracking practices (e.g., GDPR [7], CCPA [8]).         popular privacy-focused browsers (e.g., Safari, Firefox, Brave,
    Widely deployed defenses by browsers have mostly                Tor). We also evaluate our system against six popular anti-
focused on restricting third-party cookie-based tracking, and       fingerprinting browser extensions and a state-of-the-art finger-
the online tracking ecosystem has responded in a reactionary        printing detection system [29]. Our experiments demonstrate
manner by leveraging new techniques for bypassing those             our technique’s effectiveness, showing that our system is able
to collect highly discriminative attributes. Critically, our sys-       against modern, privacy-oriented browser environments
tem infers device characteristics even when users are browsing          has been hampered by reliability challenges that arise from
through the Tor browser, which is notoriously proactive and             the inherent distrust that exists between the web client
aggressive in deploying anti-fingerprinting defenses by com-            and the content provider. Fundamentally, the fingerprinting
pletely blocking or modifying the returned values of JavaScript         features collected in the client environment can be easily
APIs that leak information about the user’s environment.                altered through client API hooking techniques or completely
     We conduct a large pilot study designed to stress test             blocked by clients that disable JavaScript. Essentially, feature
our system and capture the true discriminating power of                 robustness is a challenge in device fingerprinting because
our techniques, by deploying it for nine weeks within a re-             the client features that are typically collected by state-of-
search institution that is comprised of a highly homogeneous            the-art fingerprinting methods are susceptible to modification
population of user devices. Our experiments demonstrate                 through feature effacing and randomization techniques that
the effectiveness of our approach, underscoring that our                are commonly employed by privacy-enhancing defenses.
system is comparable to FingerprintJS [37] (the state-of-the-               Another obstacle is fingerprinting detection, which is
art fingerprinting library which is widely used across the web          facilitated by scripted fingerprinting approaches that reuse
ecosystem) against non privacy-oriented browsers, while out-            common JavaScript APIs and libraries. Such feature reuse
performing it against browsers that have anti-fingerprinting            patterns enable browser anti-fingerprinting mechanisms to rec-
defenses enabled by default (i.e., Safari and Brave). Due to            ognize and disarm fingerprinting behavior [29], [39]. Finally,
its unique design characteristics and capabilities, in practice,        the performance overhead incurred by any newly-proposed
our system can be used in conjunction with JavaScript-based             fingerprinting technique or system needs to be accounted
fingerprinting for collecting attributes blocked by existing            for, as it can pose an obstacle to real-world deployment.
defenses in popular browsers, or as the sole fingerprinting
system in scenarios where JavaScript-based techniques are
completely ineffective (e.g., JavaScript execution is blocked).         2.2. Implicit Stylistic Browser Fingerprints
     Our research highlights the inherent privacy threat
presented by browser fingerprinting, as trackers can re-                    We tackle these challenges by introducing stylistic fin-
sort to implicit techniques that are capable of inferring               gerprints, a novel strategy that dispenses the use of JavaScript
system characteristics that are rich sources of entropy, while          and provides discriminating fingerprints comparable to cur-
remaining largely unaffected by available state-of-the-art              rent state-of-the-art approaches. Stylistic fingerprints are built
defenses. Even privacy-preserving browsers that aggressively            from visual attributes generated by web renderers, which
remove features to enhance privacy are vulnerable to more               depend on a device’s configuration. Our technique bypasses
sophisticated indirect fingerprinting techniques. We hope that          existing anti-fingerprinting defenses by relying solely on CSS
our work will further expose the challenges of preventing               and HTML elements, without the need for JavaScript API calls
browser fingerprinting and motivate additional research.                that can be blocked or manipulated. These elements are also
     In summary, we make the following contributions:                   instrumental in the correct rendering of a webpage, making
                                                                        it difficult to block them without breaking functionality.
• We propose stylistic browser fingerprints and develop
                                                                            However, there are important challenges that arise when
   a novel fingerprinting system that implicitly infers a wide
                                                                        creating fingerprints from stylistic web elements. First, we
   range of browser and system characteristics using CSS
                                                                        must be able to obtain the fingerprints dynamically without
   and carefully constructed and arranged HTML elements.
                                                                        using JavaScript once the browser renders the page. Second,
• We provide an in-depth empirical evaluation of our system             we must select HTML elements that possess discriminatory
   against popular privacy-focused browsers, and explore how            capabilities, and those elements need to be arranged strate-
   our system is effective in scenarios where JavaScript-based          gically on the screen to maintain a stable fingerprint, and
   fingerprinting techniques falter.                                    to ensure that pages’ performance does not suffer. Moreover,
• We conduct a pilot study that demonstrates the capabilities           relying solely on HTML and CSS features mandates an
   and effectiveness of our CSS-driven fingerprinting system.           implicit approach to inferring device characteristics, which
                                                                        can lead to an insurmountable number of network requests;
• We have disclosed our findings to the browser vendors
   and will share our system with researchers upon request. A           this necessitates a precise construction for achieving practical
   demonstration of our system’s capabilities is available [38].        performance. Finally, an effective approach is required to
                                                                        encode usable information from the HTML elements so
                                                                        that the server can actually create the fingerprints.
2. System Design and Implementation
    We first outline the practical limitations of traditional           2.3. Fingerprinting Techniques
browser fingerprinting techniques for device recognition,
which motivate and guide our research. We then detail our                   We observe that browsers render HTML elements dif-
approach for JavaScript-free device fingerprinting via stylistic        ferently in diverse environments, as their dimensions are not
fingerprints.                                                           solely determined by the browser rendering engine but are also
                                                                        affected by the operating system (OS) and other environmental
2.1. Browser Fingerprinting Challenges                                  factors. For example, native HTML elements such as check-
                                                                        boxes and drop-downs are rendered differently across operating
    Despite the increasing popularity of browser finger-                systems. Other environmental factors, such as available fonts,
printing in device recognition applications, its effectiveness          user preferences, and browser settings, also have an impact on


                                                                    2
    Listing 1: Probe the iframe’s width in iframe.html.                 Listing 2: A simple example.html document showing a
1   /* Only last matched query sends out request. */                    stylistic feature using a <textarea> element.
2   @media ( min-width: 300 px ) {                                      1   <div class= " container " >
3      # probe { background: url (/ iframe-width-300 ) ;}}              2     <textarea id= " story " rows= " 5.3 " cols= " 33.99 " >
4   @media ( min-width: 301 px ) {                                      3           It was a dark and stormy night...
5      # probe { background: url (/ iframe-width-301 ) ;}}              4     </textarea >
6   ...                                                                 5     <div >
7   @media ( min-width: 600 px ) {                                      6           <iframe src= " iframe.html "> </iframe >
8      # probe { background: url (/ iframe-width-600 ) ;}}              7     </div >
                                                                        8   </div >


the rendered dimensions of certain elements. While such ren-
dering differences may be small, dimensional data is sufficiently       dimensions, and each query requests a unique background im-
distinct to differentiate devices. This key observation informs         age that does not exist on the server, allowing us to obtain the
our design: if we deploy and properly arrange HTML elements             iframe’s dimension without any user interaction. In this way,
in a web page, we can infer device characteristics by observing         we can obtain and communicate the specific element’s dimen-
their dimensions. Appendix A provides an indicative example.            sions to the fingerprinting service without using JavaScript.
     We aim to obtain multiple elements’ dimensions for                      To further illustrate this, in Listing 2 we place a
inferring device information. To collect dimensions without             <textarea> element (lines 2–4) and an <iframe> (line 6) in
JavaScript, we utilize CSS media queries. A CSS media query             a <div> container. The container’s width depends on the
enables websites to test or retrieve characteristics of the             <textarea> element’s width, and the height is 1000px. Sup-
device irrespective of the webpage being rendered on the                pose we determine that the iframe has a width of 430px
client. CSS media features’ width and height can be used                and a height of 850px through media queries. Then, we can
to test the dimensions of a web page’s viewport (the section            learn that the <textarea> has a width of 430px and a height
of the page that is visible in the browser window). However,            of 150px. Note that an iframe’s dimensions are not always
they cannot directly query HTML elements’ dimensions, since             integers, but can also be decimals, as some browsers do
media queries are designed to work with devices or media                not round numbers for media queries (e.g., Firefox). However,
types (e.g., print, screen, speech). Width, height, and other           it is obviously impractical to generate a media query with
dimension-based media features all refer to the dimensions              all possible decimal numbers in a range of dimensions. There-
of either the viewport or the device’s screen in screen-based           fore, we use minimum dimension values (min-width and
media—they cannot refer to a specific HTML element. As                  min-height) instead of the exact values (width and height).
such, we trick media queries into measuring the dimensions              Importantly, conditions from multiple media queries can
of elements by introducing iframes (inline frames), which               be satisfied as long as the minimum values are not greater
are used to embed other web pages into the current page.                than the actual value, but only the last matched block can be
     To use media queries on HTML elements, we first make               triggered; therefore, media blocks must be sorted in ascending
an iframe’s dimensions adapt to the elements’ dimensions. For           order. For example, assume candidate widths range from
example, to measure a single HTML element’s dimensions,                 70px to 90px, with the iframe’s actual width being 80.5px.
we align the element vertically with an iframe in a container           Then, only the min-width of 80px is returned due to sorting.
of a fixed height, as shown in Figure 3a (Appendix B). We
set the iframe’s width and height to 100% so that it takes up
all space available in the container. We make the container’s           2.4. Fingerprinting Features
width fit the element’s width so that the element’s width
equals the iframe’s width. The element’s height is equal                     Our framework derives fingerprints from a diverse set of
to the container’s height minus the iframe’s height.                    HTML elements and CSS media features to discern different de-
     Next, we place the queries within the iframe. This tricks          vice characteristics. Table 1 details the stylistic fingerprinting
the queries into believing the iframe is a viewport and causes          attributes and the HTML elements associated with them. Our
them to respond with the iframe’s dimensions, allowing us               system has a total of 30 fingerprinting features using 25 iframes
to indirectly infer the elements’ dimensions. Listing 1 shows           and 339 HTML elements. These elements are grouped into four
the CSS syntax of a media query. The query is analogous to              categories, according to the types of features they fingerprint.
an if/switch statement in programming whereby each media                Table 2 summarizes these fingerprinting attributes, which
block represents a different branch in an if/case statement.            include traditional features typically detected by existing fin-
A block is triggered if the condition is met in the media block.        gerprinting approaches, such as browser vendor and operating
In our example, if the iframe’s min-width is 301px, the second          system, as well as new features, such as the system language.
block is triggered, and the client browser makes a callback             Our feature selection was guided by prior work as well as an
request to the server for the corresponding background image            exploratory study wherein we identified new features specific
with the crafted url, notifying the server that the iframe’s            or relevant to styles. We reference the AmIUnique [40] and Fin-
width is 301px. If the dimension does not match any values              gerprintJS [37] frameworks as representative and popular state-
listed in the query, then no callback request occurs. For each          of-the-art fingerprinting systems. While we do not aim to com-
iframe deployed, we make a list of media blocks of queries              prehensively compare feature set support with prior art since
with candidate widths and heights to probe into the iframe’s            our novelty lies largely in our approach to feature construction


                                                                    3
                           TABLE 1: StylisticFP features and the HTML elements associated with them.
                                 HTML Elements                                                                 HTML Elements
Feature                            Type                    Number Entropy Feature                                Type                  Number Entropy
              acronym, applet, article, aside, pre, form,                                  h1, h2, h3, h4, h5, h6, picture, time,
Env-1                                                        8      0.42  Env-2                                                          12     0.44
              strike, tt                                                                   del, details, figure, img
Env-3         address                                         1     0.39  Env-4            canvas                                         1     0.29
Env-5         audio, video, svg                              3      0.36  Env-6            textarea                                       1     0.44
              bdi, bdo, bgsound, big, blink, blockqoute,                                   cite, code, data, input-color, content, em,
Env-7         button, input-button, center, rtc, hgroup,     16     0.46  Env-8            image, progress, meter, portal, ins, dfn,     18     0.43
              keygen, spacer, q, small, p                                                  p, marquee, u, wbr, s, mark
              input-date, input-file, input-month,                                         input-number, input-range, input-time,
Env-9                                                        4      0.48  Env-10                                                          5     0.53
              input-week                                                                   select, embed
              input-datetime, input-datetime-local, input-                                 span elements of ISO-8859-1 characters,
              tel, input-radio, input-reset, input-submit,                                 ISO-8859-1 symbols, Greek letters,
Env-11                                                       12     0.46  Env-12                                                          5     0.46
              input-image, input-text, input-email,                                        Math symbols,
              input-search, input-url, input-checkbox                                      Miscellaneous HTML entities
              span elements of non-printable and                                           main, nav, menu, section, math, fieldset,
Env-13                                                       4      0.50  Env-14                                                          9     0.45
              control characters, ruby, rb                                                 footer, hr, table
JS-block ext. noscript                                        1     0.01  JS-block config. canvas                                         1     0.00
Font-pref-1   span elements of test font sizes               20     0.34  Font-pref-2      span elements of system fonts                  3     0.44
Font-pref-3   span elements of generic font families          3     0.46  Font-1           span elements of test font families           19     0.52
Font-2        span elements of test font families            19     0.56  Font-3           span elements of test font families           15     0.47
Shadow-font-1 span elements of test shadow font families     19     0.51  Shadow-font-2 span elements of test shadow font families       19     0.56
Shadow-font-3 span elements of test shadow font families     15     0.45  Screen res.      div                                            1     0.38
Ad-block      ad1                                             1     0.05  Ad-block ident. ad2, ad3, ad4, ad5, ad6                         5     0.08
Media-1       div                                            23     0.42  Media-2          div                                           76     0.58


TABLE 2: Fingerprinting attributes captured by our approach.                  experiments we discovered that the <object> element impacts
Category               Fingerprint attributes        AIU         FPJS         our system’s performance in Safari). We detect if JavaScript is
                       browser
                                                                              disabled by wrapping an HTML element inside the <noscript>
                       browser major version                                  tag, and we use the <canvas> element to determine whether
                       operating system                                       the disabling is due to browser settings. We also include nine
Environment            platform                        G
                                                       #          G
                                                                  #           elements with special characters in the element’s text, due to
                       operating system language                              such characters’ rendering being affected by the computing
                       scrollbar settings                                     environment. Specifically, we place Greek letters, math symbols,
                       JS disabled
                                                                              ISO-8859-1 characters and symbols, non-printing characters,
                       font preferences                                       and other miscellaneous HTML entities in <span> elements,
Fonts                  supported fonts                                        and place East Asian characters with annotations in the
                       supported shadow fonts
                                                                              <ruby> element, which is typically used to demonstrate the
Ad blocker
                       presence of ad blocker                                 pronunciation of East Asian characters. We provide an example
                       ad blocker identification                              of how certain elements allow us to detect the OS language in
                       screen resolution                                      Appendix C. Elements in this category make use of 14 iframes,
Media properties
                       supported media features             G
                                                            #                 ranging from features Env-1 to Js-block config. in Table 1.
                       media features’ values               G
                                                            #
                                                                              Fonts. These are one of the most popular fingerprinting
AIU: captured by AmIUnique [40] FPJS: captured by FingerprintJS [37]
G
#: partial feature support    : full feature support
                                                                              mechanisms due to their discriminating power [42]. We utilize
                                                                              two types of font features: font preferences and supported
                                                                              fonts. The font preference attributes refer to a browser’s font
and the ability to bypass existing anti-fingerprinting defenses,              preferences such as font sizes (e.g., minimum font size), generic
our system incorporates both known and novel attributes.                      font families, and system fonts. In total, we embed text in 26
                                                                              <span> elements using various font configurations, and record
Environment. The first category contains elements of 101                      the element size. The next set of collected attributes provides
different types from the HTML elements reference guide [41].                  information about supported browser fonts. In both JavaScript
These elements are good candidates for fingerprinting because                 and CSS, websites assign fonts to elements using font family.
their sizes vary depending on the environment in which                        Note that fonts are not the same as font families. A font
they are rendered. For example, in macOS Monterey 12.4, the                   family is a collection of related fonts. For example, the Arial
width/height of the <input> element of type color in Chrome                   family is made up of multiple fonts, including Arial Regular,
v101 is 50px/27px, yet evaluates to 64px/32px and 48px/23px                   Arial Italic, Arial Bold, Arial Bold Italic, etc. We check for
in Firefox v100 and Safari v15, respectively. These values also               52 different font families in the browser, derived from the list
change with the system and browser versions. We exclude                       used by FingerprintJS [37]. Moreover, we define our own set of
elements that are no longer supported by major browsers,                      font families that mirror the existing set of font families using
as well as elements that can cause problems (e.g., during our                 @font-face, and divide them into three shadow groups. Since



                                                                          4
we use dimensional data, none of the font families need to be                                                       Main iframe
written in the media queries. This category uses nine iframes,                               elemen
                                                                                                                                      element 5
ranging from features Font-pref-1 to Shadow-font-3 in Table 1.                               t1

Ad blocker presence. We use this set of attributes to detect
                                                                                                      elem
the presence of an ad blocker and identify it from a list of                                          ent 2                                       elem
popular options (e.g., AdBlock, AdGuard). To do so, we use                                                                                        ent 6
                                                                                                              element 3




                                                                                    1000px




                                                                                                                                                          1000px
six elements (three <img> elements and three <div> elements)
as ad elements, which bait the ad blocker into removing the
element if an ad blocker exists. Two of the elements request a                                                            element 4
remote resource, thus triggering two requests. While this fea-
ture can provide useful information in certain cases, it is not as                                                                       iframe B
robust as the other features (e.g., due to ad blockers changing                                           iframe A
their heuristics, or extensions being disabled when the user is
browsing in incognito mode). This category is associated with
                                                                                                         Column A           800px       Column B
the features Ad-block and Ad-block ident. in Table 1. HTML
elements in this category do not use any dedicated iframes be-           Figure 1: Example HTML element arrangement. The main
cause they share the iframes with elements from other groups.            iframe is divided into two columns. Column A has four
CSS media properties. We obtain the screen resolution using              elements, while column B has only two. Each element is
the CSS media features device-width and device-height,                   placed in a specific sub-row and sub-column within the
which do not require the device to be in full-screen mode. Our           column. Iframe A is in the fifth row, spanning four sub-
framework further probes for 23 CSS media features. These                columns in column A, and iframe B is in the third row,
include: (𝑖) device features, like the number of bits per color          spanning two sub-columns in column B.
component and the number of device pixels used to represent
each CSS pixel, (𝑖𝑖) browser preferences, such as a light color
theme and reduced motion, and (𝑖𝑖𝑖) browser support of recent            and heights using the iframe, we further split the column into
CSS media features and their configurations. In this category,           a grid layout and arrange the HTML elements along the diago-
we test 23 media features from media queries levels 3 [43] to            nal of the grid. The number of sub-columns equals the number
5 [44] using 99 media feature expressions. Each expression uses          of elements in this group, and the number of sub-rows equals
a <div> element. Table 6 (Appendix D) summarizes these media             the number of elements plus one. The first element is in the
features. This category is associated with the features Screen           first sub-row and first sub-column, the second element is in the
res., Media-1, and Media-2 from Table 1, and uses two iframes.           second sub-row and second sub-column, the third element goes
                                                                         to the third sub-column and sub-row, and so on. The iframe in
2.5. Performance Optimizations                                           this column is in the last sub-row and spans all sub-columns.
                                                                              We obtain the iframe’s dimensions using media queries.
     To reduce the overhead of stylistic fingerprinting, we              Within each column, the sum of elements’ widths equals
implement several arrangement optimization techniques                    the width of the iframe, and the sum of elements’ heights
that minimize the number of media query requests while                   equals 1000px minus the iframe’s height. In Figure 1, the
preserving the entropy of the data used to compute the                   sums of elements’ dimensions in column A and column
fingerprints, as we detail next.                                         B define our fingerprinting attributes, which can be obtained
HTML Element Arrangement. Numerous possible element                      with four requests using two iframes . Contrast this to a total
arrangement strategies exist. In Appendix B, we present                  of 12 requests for six elements had we employed a single-
different strategies and discuss the information loss that               element-per-container approach. In our implementation, the
affects certain design choices. Here we present the element              number of elements in each group varies. We further discuss
arrangement strategy that guided our system’s design. We                 this in the following section. Note that the main iframe
adopt the strategy depicted in Figure 1 and arrange elements             is set to 1000px in height, and nested iframes have a default
into diagonal groups, thereby drastically reducing the number            height of 150px. Therefore, the sum of elements’ heights
of iframes while preserving fingerprinting entropy. Specif-              in each column cannot exceed 850px, otherwise it increases
ically, we strategically divide specific types of elements into          the height of the main iframe, making it impossible to use
groups and sum the dimensions together, thus avoiding the                our schema to calculate the sum of the elements’ heights.
loss of information. Overall, our system uses the dimensions             HTML element grouping. The HTML elements used for
of 25 groups of HTML elements as fingerprinting attributes.              fingerprinting are grouped based on the attributes they dis-
     We place all elements in an 800px by 1000px iframe (here-           criminate. These groups of elements are arranged together in
after, the main iframe) to ensure that the dimensions of the             containers aiming to maximize the entropy of that container
elements remain consistent across different screen resolutions.          in discerning a specific environmental feature and meet
In the main iframe, we create a div container with a grid lay-           the height limit of the main iframe.
out using display: grid. We place a group of elements in each                 While we try to group elements that detect a specific
column of the container along with an iframe, so that the num-           environmental attribute (e.g., JS-block, font preferences),
ber of iframes corresponds to the number of groups rather than           the elements in multiple groups can be sensitive to a single
the number of elements. To obtain multiple elements’ widths              feature (e.g., OS language), and the rendering of all groups is


                                                                     5
                                                                                 While the first group of media features is used to determine
Listing 3: CSS code that probes Media properties’ capabilities.
                                                                            what media features are supported by the browser, the second
1   /* If the property is supported                                         group probes the values of the supported features. There are
         the element has a factor of 2 width. */
2   @media ( prefers-reduced-motion )                                       a total of 76 media feature values of interest, which we again
3       {# element_1 { width: 1 px; height: 0}}                             encode in <div> elements using a single iframe. The initial size
4   @media ( prefers-contrast )                                             of these <div> elements is also 0. However, this time, there are
5       {# element_2 { width: 2 px; height: 0}}                             too many values (76) to encode following the same approach
6   @media ( scripting )                                                    as with the first group, so we have to use a different technique
7       {# element_3 { width: 4 px; height: 0;}}
8   @media ( environment-blending )                                         to add them to our fingerprint. Values are queried using media
9       {# element_4 { width: 8 px; height: 0;}}                            feature expressions. If the media feature expression is satisfied,
                                                                            the element’s width and height are automatically set to a non-
                                                                            zero value. The new width value of each element varies across
                                                                            expressions, while the new height is always a fixed value.
based on some common characteristics (e.g., system, browser).               When an expression is satisfied, the iframe’s height is decreased
Moreover, the number of elements in each group varies.                      by a fixed value while the width is increased by a variable
For example, Env-13 (Table 1) uses four elements to render                  amount. The sum of heights tells the number of satisfied feature
special characters, while Media-1 feature uses 23 elements                  expressions, while the sum of widths differentiates the set of
for testing media property capabilities.                                    satisfying feature expressions. Encoding the data in this way
Font fingerprinting. A naı̈ve algorithm for CSS-based font                  tells us how many expressions are satisfied, and provides some
fingerprinting would check for each font family using the                   variance in the width values. While the encoding is not as exact
@font-face rule directly, resulting in up to 52 CSS media                   as the first group, it does give our fingerprint more entropy.
query requests (the number of font families checked by                           We deploy four additional requests that do not use
our framework). To reduce this performance overhead, we                     dimensions, as supplementary features to our system using
develop a novel font fingerprinting approach based on                       @supports. To optimize the number of requests, we apply
elements’ dimensions that do not rely on @font-face requests.               multiple rules to the same element and order these feature
Specifically, we assign a font family and two fallback fonts to             queries from general to specific, starting from the most general
a <span> element. We use Arial Black and Arial as the fallback              rule, and appending conditions in the subsequent queries,
fonts, since Arial Black is typically larger than other font                as shown in Listing 4 (Appendix E). Overall, we use four
families and is available on most systems. When Arial Black is              elements to probe the browser’s support for 12 CSS features.
not available, it falls back to Arial, another safe font. If the test
font family is available, the element does not use the fallback             2.6. Fingerprinting Framework
font and is rendered with a different size. This approach
prevents a large number of requests and is not affected by font                 Our fingerprinting framework is deployed as a stand-alone
family name collision, particularly for non-system fonts. Such              web service with a database backend, and can be seamlessly
collisions can occur in scenarios where users have downloaded               integrated into web applications. Deployment has no dependen-
and installed a custom implementation of a given font family.               cies on the target site, and is agnostic of the underlying web
Media properties. We deploy two groups of elements to                       framework and infrastructure. The platform requires only one
test media properties. In the first group, we probe into                    line of HTML markup, (see Listing 5 in Appendix E) to embed
the browser’s support of 23 media features using 23 <div>                   its main iframe object, and all subsequent fingerprinting pay-
elements, such as @media (update) and @media (scripting).                   loads are sent directly to the backend. Additionally, many tech-
These features are relatively new and some of them may                      niques can be used to render the iframe invisible to users [45].
not be supported by a particular browser. All of the elements               For example, the iframe can be positioned offscreen using
are grouped with a single iframe in a container, sending two                position: absolute; left: -9999px;, it can be rendered to a
requests to the server, of which one contains the iframe’s                  size of 0, or it can be hidden with the visibility property. De-
width and the other contains the iframe’s height. We can learn              vice characteristics are inferred based on the dimensional data
which media features are supported by setting each element                  collected, which reveal information about the device, and are
size to be a factor of 2 (e.g., 20 , 21,...), as shown in Listing 3.        combined into an identifier for uniquely identifying devices.
The elements have a size of 0 by default. If a media property
is not supported, the size of the corresponding element                     2.7. Threat Model
will remain 0; otherwise, the styles will be applied, and the
element’s width or height will be some number 2𝑖 , where                        We consider a malicious or privacy-invasive service
𝑖 represents the position of the element within the group.                  that aims to fingerprint the user’s device, allowing it to
As
Í𝑛−1a result, the sum of elements’ widths or heights will be:               re-identify and track the user across sessions. We assume
  𝑖=0 𝑏𝑖 ∗2 , where 𝑏𝑖 = 0 if media property is not supported               that the attacker is able to (𝑖) trick the user into visiting the
           𝑖
using element 𝑖, and 𝑏𝑖 = 1 otherwise. Given that the result will           fingerprinting website, or (𝑖𝑖) inject a single line of HTML
always be some summation of 2𝑖 values, we will always get a                 code into a legitimate web page (as shown in Listing 5 in
distinct sum for any combination of elements with a non-zero                Appendix E) to include the fingerprinting payload in user
width or height, meaning that we can determine which media                  responses, or (𝑖𝑖𝑖) leverage a man-in-the-middle proxy service
properties are supported in the browser, using a single iframe.             to inject the fingerprinting code in proxied web responses.


                                                                        6
3. Bypassing Anti-fingerprinting Defenses                                we can distinguish Windows 8 from Windows 10 and Win-
                                                                         dows 11, while the JavaScript API returns the value Win32 for
     Here we discuss our system’s ability to bypass defenses.            all of these systems. The Font Preferences row refers to the
Our analysis focuses on the most popular browsers and                    font customization setting in browsers, which allows users
tools that explicitly implement privacy-preserving coun-                 to configure the font size and default font families for Stan-
termeasures against fingerprinting. Since privacy-focused                dard, Serif, Sans-serif, and fixed-width fonts. We also have
browsers are actively deploying anti-fingerprinting measures             attributes for identifying if users have disabled Javascript
(albeit focused on JS-based techniques) and other tools are              through browser settings or extensions. For example, users
also available, we empirically explore whether and how                   can disable JavaScript in the site settings in Chrome and
existing defenses affect our techniques.                                 using about:config in Firefox. Alternatively, they can use an
Experimental setup. For our empirical analysis, which re-                extension such as NoScript [48] and Disable JavaScript [49].
quires testing our system across a wide combination of client
environments, we use online services [46], [47] as well var-             3.1. Brave
ious physical devices from our lab. We test multiple versions
of operating systems and browsers, and also experiment with                   Brave recently added protection against language finger-
different changes to the systems’ configurations to assess               printing and font fingerprinting starting with version 1.39 [50].
whether our stylistic fingerprints capture the updated charac-           Our approach can effectively collect both fingerprints.
teristics. For instance, we change the OS language, and install          Anti-language fingerprinting. Brave defends against
new fonts to verify the collected fingerprints. We use the latest        language fingerprinting by reducing and randomizing
version of browsers and tools at the time of writing, including          the information available in the navigator.language and
Firefox v100, Brave (Nightly) 1.39.42, Tor 11.0.10, Safari v15.5,        navigator.languages APIs, as well as in the Accept-Language
Opera v87.0.4390.36, Ghostery Dawn v2022.4.1, and recently-              header. If the fingerprinting protections are set to Strict,
downloaded extensions. We enable the anti-fingerprinting fea-            Brave will always report “English.” More importantly, there is
ture in these browsers if necessary (e.g., Firefox), and use these       no way to detect the OS language in modern browsers using
browsers and privacy tools to visit state-of-the-art fingerprint-        JavaScript (the legacy Internet Explorer can obtain it using
ing systems (e.g., FPJS and AmIUnique) and our StylisticFP sys-          navigator.systemLanguage). Our system does not obtain the
tem to evaluate the effectiveness against the countermeasures.           browser language preferences, but determines OS languages
Findings. Table 3 summarizes our system’s effectiveness.                 by observing the dimensions of the language-related iframe.
It breaks down the attributes of StylisticFP and indicates               Anti-font fingerprinting. Brave defends against font fin-
whether they are effective against anti-fingerprinting browsers,         gerprinting by randomly removing entries from the browser’s
extensions, and detection systems. Our system is able to dif-            font family list during each session, so that the fingerprinter
ferentiate not only the browser engines but also differentiate           does not get a stable view of the available font families; how-
browsers that use the same engine in certain environments;               ever, the browser still allows CSS access to local font files. We
we can distinguish Edge and Opera from other Chromium                    can thus check if a font is available on the user’s device by
browsers running on Windows, Tor and Ghostery from Fire-                 loading the local font file, allowing us to bypass their defense.
fox, and Mobile Safari from desktop Safari. The framework is                  In order to support fingerprinting for browsers that do
effective against both desktop and mobile devices. Note that             not block font families, we assign font families to <span> el-
Safari is the only browser available on iOS devices, as other            ements and divide them into three groups to reduce network
browsers are merely skins on top of Webkit. Consequently,                traffic. As with other attributes we collect, we use the sum of
browsers on the same iOS device have identical fingerprints.             the elements’ widths and heights to establish which font fam-
Our approach also allows us to distinguish various major                 ilies are present in the browser. For Brave, we also use our
browser versions based on the observation that certain el-               shadow font families that mirror the existing set of font fam-
ements are rendered differently across versions. For instance,           ilies. These shadow font families are defined using original
in Windows 11, Firefox v100 renders several elements in dif-             font families’ local font files, which are not blocked by Brave.
ferent sizes compared to v99 (e.g., <address> and <select>).             For example, the Arial shadow font family contains: Arial
Also, browsers are gradually adding support for media proper-            Regular, Arial Black, Arial bold, which we access directly
ties, especially those in the working draft (e.g., Media Queries         through font files. We use these two sets of font groups
Level 5), which also allows differentiation. For example, Firefox        to identify whether font family blocking is enabled, and to re-
v100 supports @media (video-dynamic-range: standard) and                 trieve the proper font values for our fingerprint. We provide
@media (dynamic-range: standard), while v99 does not. Our                a video demonstration of our system against Brave [51].
system generates 11 fingerprints for Firefox v80-101, and ten
fingerprints for Chrome v80-101. While certain versions can be           3.2. Tor Browser
uniquely identified, others are grouped into a subset of similar
versions. As mentioned, our system also distinguishes Opera                  The Tor browser is built on a stripped-down version of
and Edge from other Chromium browsers in Windows, due to                 Firefox that is heavily geared towards enhancing privacy
elements being rendered differently, such as the <number> ele-           by removing features. Tor was the first browser to tackle
ment in Opera and the input field element of type time in Edge.          fingerprinting, and also employs Javascript hooking for
     Our Platform attribute provides more details than the cor-          spoofing certain fingerprinting APIs. Tor’s overarching strategy
responding JavaScript API navigator.platform. For example,               is to have all Tor users expose the exact same fingerprint,


                                                                     7
TABLE 3: Stylistic fingerprinting attributes and their effectiveness against popular countermeasures: ✓denotes that our
technique is effective, ✗ denotes that it is ineffective, and ⊕ denotes that it is partially effective.
  Feature                     Brave     Tor     Firefox   Firefox w/ FP    Safari   Opera   Chrome w/ Anti-FP    Ghostery        FP-
                                      Browser               Protection                          Extensions       Browser    Inspector [29]
  Browser                      ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Browser major version        ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  OS                           ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Platform                     ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  OS Language                  ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Font Preferences             ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Scrollbar Settings (OS X)    ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Available Fonts              ✓         ⊕        ✓             ⊕            ⊕       ✓              ✓               ✓             ✓
  Ad blocker Use               ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Javascript disabled          ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Screen resolution            ✓         ✗        ✓             ✗            ✓       ✓              ✓               ✓             ✓
  Supported media features     ✓         ✓        ✓             ✓            ✓       ✓              ✓               ✓             ✓
  Media features’ values       ✓         ⊕        ✓             ⊕            ✓       ✓              ✓               ✓             ✓


allowing them to blend into the anonymous crowd. When                     monospace base font and the specific font with a monospace
tested on AmIUnique, Tor spoofs the User Agent and Content                fallback font. As a result, traditional font fingerprinting
Language attributes in the HTTP headers, as well as an                    strategies will detect that all font families are available in
additional 25 attributes. Apart from the newly-introduced                 the browser. In fact, both AmIUnique and FingerpintJS use
attribute for detecting the presence of an adblock extension, the         monospace and are thus ineffective against Tor.
remaining 33 attributes listed on AmIUnique are not spoofed                    Additionally, Tor bans the use of @font-face local files,
by Tor because they have relatively low entropy. Examples                 regardless of being allowlisted or blocklisted. Even if we
include the use of IndexedDB and the visibility of the menu bar.          load a local font file and refer it to an allowlisted font family
Media queries. Tor also forces certain media queries to report            (e.g., Arial), this font family will be inaccessible. As a result,
identical values. For instance, prefers-color-scheme always               we cannot access the non-allowlisted fonts using @font-face
returns light, color always returns 8, and the device width               as we did with Brave; however, our approach can accurately
and height return generic values, e.g., 800*1000. On the other            detect the available fonts on the allow list, by using the three
hand, some queries (e.g., forced-colors: none) only compute               font family groups and the shadow groups as described in
true in recent browser versions, allowing us to identify                  our font discussion on the Brave browser. If the font family
certain versions. This makes our approach to fingerprinting               is allowlisted and available, the three font family groups
media features’ values partially effective against Tor. More              will have access to it, while the shadow groups will not
importantly, Tor does not spoof min-width and min-height                  because they utilize @font-face. The shadow groups will load
media features; as such, all of the dimensional data we obtain            preselected fallback fonts instead. Consequently, the iframes
are actual values. As a result, the stylistic features derived            associated with the family groups and the shadow groups
from dimensional data are not affected by Tor’s defenses.                 will be of different sizes. While our system cannot infer all
Fonts. To prevent font fingerprinting, Tor has introduced                 the fonts present in the user’s system, it accurately identifies
a font allowlisting mechanism which only allows certain                   support or the lack thereof for the set of fonts in the allowlist.
system fonts to be used in the browser. The allowlist can be
edited in about: configure. Traditional JavaScript font fin-              3.3. Firefox
gerprinting relies on including multiple <span> elements with
the same text using different font families and baseline fonts                The default version of Firefox does not prevent our system
as the fallback option, and then comparing their dimensions               from collecting any of the fingerprinting attributes. However,
to that of the baseline fonts. If a given font family is not sup-         Firefox has also incorporated Fingerprinting Protection [52],
ported by the system, the element will use the fallback fonts             an experimental feature that is disabled by default. Firefox has
and the dimension of this element will equal the dimension                opted to not include this option in the settings menu and, in-
of the baseline element. If the font family is available, the ele-        stead, users can access this option by typing about:config in
ment’s size will differ for that specific font. The baseline fonts        the address bar. This feature includes a series of protections,
used in fingerprinting are typically generic font families like           some of which affect our system while others are ineffective.
monospace, sans-serif, and serif. However, if the fingerprint-                Specifically, our approach is still able to bypass spoofing
ing script sets the fallback font to monospace, the code will             attempts in which the browser reports a specific, common ver-
always detect the specific font as available because Tor never            sion number, and operating system. Our approach still detects
falls back to monospace. Specifically, if a font is unavailable,          the actual operating system, browser, and major browser ver-
Tor skips the fallback font monospace and falls back to a dif-            sions. Additionally, while the language is disguised, our system
ferent font. The element’s size thus always differs between the           correctly detects it. Finally, while Window.devicePixelRatio


                                                                     8
always returns a value of 1, our approach infers the actual              TABLE 4: Comparison of number of iframes and requests
value through @media(-webkit-device-pixel-ratio).                        between the initial and optimized design of our system.
     On the other hand, Firefox also uses a font-allowlisting             Request Source                         Initial     Optimized
mechanism in which only certain system fonts are made                     Main iframe                               1              1
accessible to websites. This defense is more robust than                  CSS files                                171             1
Brave’s because it blocks fonts at the local font file level. Any         Number of sub-iframes                    170            25
font families that use font files that are not allowlisted are            Requests by iframes                      340            50
blocked. Interestingly, Firefox’s font protection is not identical        Requests by @font-face                up to 512          0
to Tor’s. Even though they both block local font files they               Requests for ad blockers                  2              2
use a different allowlist, and Tor bans the use of all local font         Requests by other media features      up to 35           4
files while Firefox only bans the use of local files that are             Total Requests                       up to 1,231        83
not on the allowlist. Additionally, the CSS screen resolution
is spoofed, and certain media queries report misleading
information (e.g., the value of @media(color) is reset to 8).
                                                                         frequently used in fingerprinting scripts. We also check
                                                                         their OpenWPM-extending [53] script instrumentation. We
3.4. Other Browsers
                                                                         consider fingerprinting attributes that use these fingerprinting
Safari. Safari only renders the default system fonts unless it is        APIs to be ineffective. None of the APIs had any effect on
a web font included by any website (since these do not indicate          our system. This is partially expected due to their classi-
if a local font is available). Safari also blocks the use of local       fier having been trained to detect fingerprinting based on
font files that are not from a system font family. Our system            JavaScript APIs. We emphasize that we include this experi-
is partially effective and detects fonts from the allowlist.             ment purely for the completeness of our empirical evaluation.
                                                                         We consider this proposal an important contribution towards
Ghostery. Ghostery is built on top of Firefox and provides ad-
                                                                         the development of robust anti-fingerprinting defenses.
ditional privacy features. Our system is also effective against
this browser, with the majority of fingerprinting values
being identical to Firefox. Moreover, our system distinguishes           3.6. Summary
Ghostery from Firefox due to the support of additional CSS
feature values, like grid-template-columns:masonry.                           Our empirical analysis demonstrates that StylisticFP
                                                                         is effective at bypassing the protection offered by privacy-
3.5. Extensions and Tools                                                oriented browsers, extensions, and detection tools. The
                                                                         majority of our techniques work against all browsers and
Anti-fingerprinting tools. We use Chrome to test six anti-               extensions, and even when they are not completely effective
fingerprinting extensions that target common fingerprinting              (e.g., supported fonts), they are still better than state-of-the-
attributes. Table 7 (Appendix F) lists the extensions that we            art systems. Existing fingerprinting countermeasures typically
study along with their number of users as provided by the                block or manipulate JavaScript fingerprinting APIs’ values. As
Chrome web store. None of the tested tools affects our finger-           a result, these browsers and extensions impact FingerprintJS
printing process. A demonstration of our system’s capabilities           (the most popular fingerprinting library) and AmIUnique
against spoofing and JS-blocking extensions is available [38].           (a state-of-the-art academic system used in numerous studies,
                                                                         e.g., [11], [18], [54]). On the other hand, our system is mostly
Ad blocking. We test eight popular ad blocking options,                  unaffected because our approach does not use any JavaScript
namely the Opera browser (which has integrated ad-blocking               code. Overall, our empirical analysis highlights the long-term
functionality) and seven Chrome browser extensions. The
                                                                         implications of our research. Future countermeasures will
goal of this experiment is to explore whether our system
                                                                         require a broader view of how fingerprinting can be achieved
can identify the presence of ad blockers but also uniquely
                                                                         and not limit their focus to JavaScript APIs. Crucially, implicit
identify each tool based on the unique combination of el-
ements it blocks. Table 8 (Appendix G) shows how the ad                  techniques that indirectly infer system properties pose an
blockers affect the specially-crafted ad elements included               additional challenge that needs to be taken into account.
in our system. We analyzed the source code of these popular
extensions and the DOM element styles added by Opera                     4. Experimental Evaluation
browser to find differences in their blocking strategies. Based
on that, we have a general element (ad1) that probes the                     To further substantiate our results, this section describes ad-
presence of an ad blocker and deploys five other elements                ditional experimental aspects of our fingerprinting framework
that can only be blocked by certain ad blockers. Apart from              and a pilot study conducted within a research organization.
Adblock Plus and Adblock blocking the same subset of ad
elements, all the other ad blockers affect a distinct subset of          4.1. Design Optimization
ad elements and are, thus, uniquely identifiable. Interestingly,
during our analysis we found a bypass against Opera’s                        As outlined in §2, our system is driven by a precisely
ad-blocking functionality, which we detail in the Appendix G.            designed construction of HTML elements and CSS features
FP-inspector. We test a state-of-the-art fingerprinting                  to overcome the impractical overhead of a straightforward
detection system proposed recently [29]. The paper in-                   CSS-based fingerprinting approach. Table 4 provides a com-
cludes a list of fingerprinting API keywords that are                    parison of key behavioral and structural aspects between our


                                                                     9
                 CSS DOMinteractive              CSS DOMcomplete         TABLE 5: Comparison of uniquely identified devices by our
                  JS DOMinteractive
              JS+CSS DOMinteractive
                                                  JS DOMcomplete
                                              JS+CSS DOMcomplete
                                                                         system (StylisticFP) and FingerprintJS (FPJS) in a pilot study.
         1                                                                                               Visits       Unique Fingerprints
                                                                          Browser        Devices     Avg     Max      StylisticFP      FPJS
        0.8                                                               Chromium         278       4.35     43          168          180
                                                                          Brave             16       3.45      8          13            11*
        0.6
                                                                          Edge              41       3.83     11          33            32
                                                                          Firefox          379       5.18    278          248          253
  CDF




                                                                          Safari           152       6.16    210          72            63
        0.4
                                                                          Total            866                            534           539
        0.2                                                               *Visits within the same session, randomized values did not change.


         0
              10                  100                1000                scenario over time (so as to also capture the effects of anti-
                                        Time (ms)                        fingerprinting defenses). We conducted a 9-week pilot study
Figure 2: Comparative fingerprinting technique performance.              in which we deployed the fingerprinting system on three dif-
                                                                         ferent online portals hosted in a large organization, which are
                                                                         only accessible after authentication. It is important to note
optimized design and our initial implementation that relied              that the study’s population is comprised of computer scien-
on a straightforward use of the same CSS features. The most              tists and may not provide a representative population in terms
important optimization is driven by the choice to leverage               of browser selection or configurations. As the pilot study
dimensional data, avoid @font-face requests while focusing               was announced, certain actions may also deviate from normal
on 52 font families for font fingerprinting, and combining               user behavior and indicate users purposefully modifying their
multiple media features with logical operators. As shown,                environment to test the system. Nonetheless, as detailed in
our optimized design significantly reduces the resources                 §2, the true impact of our technique is evident against more
needed by the system across all categories. Crucially, the               privacy-aware users. Moreover, our study captures an es-
implementation can achieve a ∼ 15𝑥 reduction in the number               pecially challenging environment as the device population is
of network requests generated (depending on character-                   heavily skewed towards more specific, homogeneous models
istics of the user’s system). To further reduce the size of              that are approved and managed by an institutional IT office.
transferred resources we employ server-side compression,                 Metric. First, we focus on the discriminatory power of
resulting in transferred resources of about 330 KB.                      our novel stylistic fingerprinting system, by comparing our
Overhead. To quantify the system’s overhead and assess its               system’s ability to uniquely identify devices against the
impact on user experience, we compare our approach to Fin-               latest version (v3) of FingerprintJS (FPJS), a prevalent state-
gerprintJS, and test three scenarios: a standalone deployment            of-the-art browser fingerprinting library. FPJS deploys various
of each system as well as a combined deployment of both tools.           fingerprinting attributes using JavaScript, including both basic
Each experiment is executed 100 times on a 2019 MacBook Pro              (e.g., colorDepth and timezone) and advanced features (e.g.,
i9 running Chrome. To measure the performance overhead, we               Canvas and Fonts) and newly introduced CSS media features
use Google’s Lighthouse [55] to capture the domInteractive               (e.g., forcedColors and monochrome) and font preferences.
and domComplete timestamps, which mark when the DOM is                   Setup. The deployed system sets an HTTP cookie with a
ready and when the page and all of its subresources are ready,           random string for distinguishing devices, which provides the
respectively. We ran it in a lab environment to avoid external           necessary ground truth for our analysis. Moreover, since cer-
factors (e.g., network jitter) from affecting the measurements.          tain defenses rely on randomizing values, we filter out devices
As shown in Figure 2, the impact on the page’s rendering                 that were not observed at least twice, so as to assess each fin-
is negligible and the delay for user interaction is less than            gerprinting system’s effectiveness and stability across visits. We
100 ms. Moreover, our approach is stable and the entire page’s           also filtered out 77 devices due to different system setups being
loading time is less than 1 second in 98% of the runs. We                used across visits (e.g., with and without an external monitor).
note that there is no heavy rendering on our website as the              Data were collected from June 1, 2022 to August 8, 2022.
page only renders native HTML elements, resulting in only                Results. Table 5 breaks down our study’s results for the 866
83 network requests. Indicatively, Amazon’s homepage issues              devices that remain after filtering, grouped by browser vendor,
over 300 requests and Facebook’s feed starts with about 230              and shows how many devices were uniquely identified by each
requests. Overall, our design of CSS-based fingerprinting is             system. Of those devices, 541 ran macOS, 295 ran Windows,
practical and can also be combined with traditional JS-based
                                                                         and 30 were Linux-based. While many users connected over a
techniques to maximize the amount of collected entropy.
                                                                         Chromium-based browser, which is expected, more than half
                                                                         of the devices used an alternative browser. Findings show that
4.2. Pilot study                                                         our system and FPJS are comparably effective across the entire
                                                                         dataset, uniquely identifying 534 and 539 devices respectively.
    Next, we aim to assess the efficacy of stylistic fingerprint-        Due to the study’s homogeneous environment, where many
ing under challenging conditions in a realistic deployment               workers have the same physical devices, we observe lower


                                                                    10
detection percentages of both systems compared to prior fin-               across visits. This is more problematic in Safari, while the
gerprinting studies that were conducted in the wild (i.e., in a            audio attribute is also unstable in Safari (some visits have an
more heterogeneous ecosystem). Importantly, our technique is               abnormal value of -3). FPJS fails to identify Brave devices due
particularly effective at uniquely identifying privacy-focused             to the randomization of various fingerprinting attributes, while
browsers (Brave and Safari), and also correctly identified                 blocking JS also results in FPJS’s failing to identify devices.
the three devices that blocked JavaScript and evaded FPJS.                      Overall, our pilot study demonstrates that implicit stylis-
     Surprisingly, FPJS was able to uniquely identify five more            tic fingerprints are not only a viable alternative to existing
Firefox devices than our system, which is due to the users not             techniques but possess sufficient discriminative power to
enabling Firefox’s advanced FP Protection feature. In other                outperform FPJS against existing defenses. This highlights the
words, while Firefox has the capability to better protect users            inherent double-edged sword of personalization: the flexibility
from JS-based fingerprinting, the subjects in our pilot study had          to alter and personalize one’s computing environment, and the
not enabled that option. While that may be a conscious decision            corresponding supportive functionality that browsers expose to
for some users, it is very likely that others were not aware of it.        websites, create ample opportunity for diverse fingerprinting
This highlights the dilemma that browsers face when it comes               techniques. While preventing browser fingerprinting remains a
to enabling strict privacy-enhancing features by default instead           challenging task, we believe that our work will provide a step-
of making them opt-in, due to potential functionality breakage.            ping stone for browser vendors and the research community
     We also identify another important detail regarding                   to develop more robust and comprehensive countermeasures.
randomization defenses. Specifically, FPJS is able to iden-                Entropy. We also quantify the discriminating power of
tify Brave devices in cases where randomized fingerprint                   the various fingerprinting features using the normalized
attributes were the same across visits. This happens because               Shannon entropy proposed by AmIUnique [11]. Table 1 shows
the visits occurred within what Brave perceived as the same                the entropy of our stylistic fingerprinting features. We also
session, so the randomized values did not change. As a                     calculate the entropy of FPJS fingerprinting attributes in
result, while the FPJS fingerprints were the same across                   Table 9 (Appendix I) for comparison. The entropy is computed
visits in these instances, in practice, FPJS would be unable               from 1,848 devices that were encountered during our pilot
to identify those devices across different browsing sessions               study (including single-visit and returning devices). For our
(e.g., when the browser is closed between visits).                         system, the feature with the highest entropy is Media-2 (0.58),
Collisions. Our system is more stable across visits, as                    which probes into the values of recent media properties.
FPJS fails to identify 188 devices (by calculating different               Font and shadow font features also have high entropy values
fingerprints across visits), while our system fails against 41.            ranging from 0.45 to 0.56. Using the same set of font families,
At the same time, our system exhibits more fingerprint col-                the font attribute in FPJS has a lower entropy of 0.31. The
lisions with 95 device collisions, while FPJS has 55. Collisions           reason for this is that we use the dimensional data rendered by
                                                                           the specific font family rather than looking at the font family
occur in cases where multiple devices (e.g., with identical
                                                                           name. Dimensional data detects the underlying environment
hardware and software configurations) are assigned the same
                                                                           and allows us to distinguish between fonts with the same name.
fingerprint value. We hypothesize that because the stylistic
                                                                           The most important features in the environment category are
fingerprints are more stable, and because the organization
                                                                           Env-9, Env-10, and Env-13, with entropy values ranging from
devices are relatively homogeneous, this creates more colli-
                                                                           0.48 to 0.53. Env-9 and Env-10 both include different types of
sions than FPJS. Even so, our system is able to provide useful
                                                                           <input> elements that vary depending on the system language,
information for devices even when it cannot uniquely identify              region, and time format preferences, while Env-13 includes
them. It is better to always assign a device to a set of a few             elements that render four different types of special characters.
potential devices (in our experiments sets typically had two               The environmental feature Env-6 contains information about
devices, the largest had 12) instead of calculating a completely           user scrollbar settings with an entropy of 0.44. JS-block
different fingerprint each time. In practice, this can be lever-           features have the lowest entropy because the majority of
aged by adding more stylistic features for increased entropy,              users do not disable JavaScript for intranet portals. The FPJS
or using other features (e.g., IP addresses and geolocation).              attribute with the highest entropy is canvas (0.53), however,
Features. In the cases where our system outperforms FPJS,                  it is ineffective against privacy-focused browsers and tools.
we find a wide range of differentiating features collected                 Overall, we find that within a larger population of devices our
by our system, including stylistic features (e.g., browser font            fingerprinting system is comprised of high-entropy elements
preferences, special characters rendering), the OS language for            with more discriminating power than FPJS. We consider a
Chrome users, and the media feature values for Safari users.               large-scale deployment in the wild as part of future work.
     Further analysis reveals that our system mainly fails
to identify devices due to ad-blocker extensions being toggled             4.3. Prior CSS techniques
on and off. Furthermore, the behavior of ad-blockers varies
during visits, as they may block a specific ad element in                      A few straightforward CSS-based approaches have been
one visit but not in another. A few users disabled JS in                   previously proposed [56]–[58]. While they collect certain
some visits while enabling it in others. Surprisingly, in other            media feature values, screen resolution, and available fonts,
cases, users changed the browser display mode, with certain                they employ simple approaches that suffer from significant
visits exhibiting a 15px difference in height in all iframes.              limitations. First, these approaches simply use known media
     On the other hand, FPJS mainly fails for the following                features (e.g., any-pointer), resulting in relatively limited data
reasons: the screenFrame and canvas attributes are unstable                collection. In contrast, we develop a novel practical technique


                                                                      11
that builds upon a carefully constructed collection of HTML                    Additional mitigations could include dynamically mon-
elements and observes how their dimensions differ based on the            itoring requests for server-side resources or adding noise by
environment. In more detail, apart from the screen resolution             applying random CSS properties to fingerprinting elements.
and fonts, all of the media feature values collected by prior             However, sites can correspondingly disguise requests to bypass
CSS approaches are a subset of a single feature of our system             detection, and leverage CSS precedence to prevent additional
(Media-2 with an entropy of 0.58), and this feature reveals far           CSS properties from being applied to fingerprinting elements.
more discriminative information than existing media features,             Alternatively, static analysis could potentially be used to
such as platform, operating system, settings and preferences,             detect our technique by examining chained media queries.
etc., highlighting the vast difference in capabilities between            Fingerprinting detection. Preventing our browser fingerprint-
our approach and prior work. Second, these approaches flood               ing technique presents a major challenge due to its inherent
the network with requests; for instance, [56] generates 1,347             reliance on HTML elements and CSS features that have legiti-
requests while our system only needs 83. To collect media                 mate uses and are crucial for a website’s appearance and func-
feature values, they require a request for each media feature,            tionality. Unlike many traditional fingerprinting approaches
so the number of requests equals the number of media features.            that capture static meta properties of the environment through
Conversely, our system probes into 76 values of 23 media                  programmatic APIs, stylistic fingerprints rely on more dynamic,
features using a single iframe and only two requests. Similarly,          intrinsic attributes that are generated by the browser and that
to fingerprint available fonts they require a request for each            are parametric on environment characteristics. While blocking
unavailable font, while our system groups multiple fonts and              or modifying certain features may be feasible, interfering with
utilizes elements’ dimensions so each font group only needs               other features will require a case-by-case strategy. This moti-
two requests, and the differences in dimensions further detect            vates the use of machine learning classifiers to differentiate fin-
the environment and eliminate font name collisions. We                    gerprinting from legitimate functionality (e.g., [29]). However,
employ shadow font groups to detect protection against font               the fact that our approach is based on pure CSS and HTML
fingerprinting. All these advantages stem from our deliberate             (and also implicitly infers system characteristics) further com-
design and novel implicit fingerprinting approach.                        plicates machine learning-based detection and mitigation strate-
     We also note that [59] fingerprints CSS features using the           gies, due to their prevalent use of these features for legitimate
window.matchMedia() JS API, thus fundamentally differing                  non-fingerprinting functionality. Nonetheless, we consider this
from our CSS-based approach while also facing the limita-                 a promising direction for developing more robust defenses.
tions of all JS-based techniques. Moreover, [58] uses strategies          Entropy reduction. The elements or media queries used
(e.g., for detecting the browsers and OS) that are obsolete or            by our system may yield reduced fingerprinting entropy
blocked by privacy-oriented browsers (e.g., Tor and Firefox).             over time. To counteract such a potential degradation, new
     Crucially, prior approaches cannot bypass browsers’ anti-            HTML elements as well as novel W3C and WHATWG
fingerprinting defenses. For example, Tor bans the use of                 feature suggestions can be incorporated into StylistcFP.
@font-face local files, and prior work will incorrectly identify
all tested fonts as unavailable. Tor and Firefox force certain            Non-tracking use cases. Our study focuses on the privacy
media queries to report identical values. Prior work solely relies        threat presented by stylistic fingerprints. Nonetheless, browser
                                                                          fingerprinting can also be used in security applications, such
on their return values; we identify devices using dimensional
                                                                          as user account protection [36], [63] and bot detection [64].
data and are thus robust against the countermeasures. Brave’s
                                                                          For instance, attackers can replay session cookies and block
anti-language fingerprinting also prevents all prior techniques.
                                                                          JS fingerprinting, whereas our system can still generate a reli-
                                                                          able fingerprint. We consider the exploration of our system’s
5. Discussion and Future Work                                             suitability for these scenarios interesting future directions.
                                                                          Ethics. Prior to our pilot study, we consulted with internal
Mitigation. Our technique could be prevented by using                     review boards regarding our research methodology and data
two straightforward strategies, both of which would have                  collection. Our study was exempted from IRB oversight as
significant negative side-effects on websites’ functionality.             we do not derive any insights from human subjects’ behavior.
Blocking iframes. One possible mitigation is to completely                Though we do not collect sensitive personal information
block iframes, e.g., by using a browser extension like Auto               and cannot identify individuals from the collected data, we
Iframes Remover [60]. However, iframes are extremely com-                 went through a rigorous formal internal privacy review
mon across the web and crucial for a multitude of legitimate              process which ensured that our empirical methods comply
use cases, and disabling iframes will break many websites’                with the institutional and human resources privacy policies.
functionality. We crawled the Tranco top 100k [61] and found              We provide more details in Appendix H.
that 49.26% of the 83,476 accessible websites use iframes                 Disclosure. Our research demonstrates how trackers can
on their landing pages. Indicatively, removing iframes on                 effectively bypass the anti-fingerprinting defenses deployed
Google’s account login page breaks the login functionality.               by popular privacy-focused browsers. The techniques have
Blocking Media queries. Tor sacrifices some functionalities by            privacy implications for the design of future countermeasures
reporting fake values for a few media features. However, it is            and, thus, necessitate the responsible disclosure of our findings.
infeasible to spoof all media features because they are a key             We have disclosed our findings to the browsers included in our
part of responsive web design [62]. Particularly, the width               experiments, and provided them with a detailed description
and height features allow websites to adjust their layout                 of our techniques in order to facilitate their remediation
in response to the viewport of a wide variety of devices.                 efforts. Chrome responded that our system could be used as


                                                                     12
a benchmark in their Privacy Sandbox project [65] to combat              have explored detection methods and quantified various
fingerprinting. Firefox and Tor expressed interest and requested         aspects of browser fingerprinting [13], [17], [75]–[77].
access to our source code and a paper draft, respectively, for           Fingerprinting mitigations. Prior work has also proposed
further investigation. Brave awarded a bounty for finding the            anti-fingerprinting countermeasures that aim to protect users.
bug in their font fingerprinting protection and recently fixed           PriVaricator [35] and FPRandom [78] add randomness to the
the bug in version 1.44.x - Nightly. Safari is also investigating        values returned by certain JavaScript APIs while also focusing
this issue. We have opted against publicly sharing our code due          on minimizing functionality breakage. FPGuard [79] presents
to the obvious privacy risk that our techniques pose to users.           a runtime fingerprinting detection and prevention approach
                                                                         based on predefined metrics. These academic proposals have
6. Related Work                                                          motivated subsequent defenses deployed by privacy-oriented
                                                                         browsers (e.g., in Brave [31]). Datta et al. [80] provide an
     Our work presents a novel browser fingerprinting system             experimental comparison across various privacy-enhancing
that is precisely constructed using only HTML and CSS fea-               technologies and suggest that Brave and Tor outperform other
tures, thus overcoming the limitations of JS-based approaches.           privacy tools in defending against browser fingerprinting.
In this section we discuss pertinent prior research in browser           Importantly, our empirical analysis (§3) shows that our fin-
and system fingerprinting, and proposed mitigations.                     gerprinting strategy is highly effective against deployed coun-
                                                                         termeasures. The core characteristic of our approach is that it
Browser and device fingerprinting. Since the seminal paper               does not rely on JavaScript, which has been the driving force
by Eckersley [10], which demonstrated that fingerprints could            behind modern browser fingerprinting, and is thus not affected
be used to uniquely identify a user’s device using JavaScript            by existing fingerprinting detection and prevention techniques.
APIs, fingerprinting has garnered significant attention by the
research community. Mowery and Shacham [15] demonstrated                 Scriptless Attacks. Heiderich et al. [81] discussed XSS
                                                                         payloads that do not rely on JavaScript and demonstrated
how the Canvas API can be misused for fingerprinting, while
                                                                         attacks that exfiltrate sensitive data via the injection of
Fifield and Egelman [42] explored the discriminatory power
                                                                         HTML and CSS. While these attacks and our technique
of fonts supported by users’ systems. Mulazzani et al. [16]
                                                                         both leverage CSS, they are unrelated attacks with different
demonstrated how websites can infer a user’s actual browser              attack vectors. Importantly, our novelty lies in the meticulous
despite the presence of modified User Agent strings. Cao                 design and construction of an attack that relies on the
et al. [14] explored the possibility of cross-browser tracking           inference of dimensional data, and many underlying features
through fingerprinting, and proposed a technique that iden-              are different across the two attacks (e.g., we do not use
tifies OS and hardware features through a series of rendering            CSS-based Animations, CSS content property, scrollbars,
tasks. More recently, Laor et al. [66] proposed a novel timing-          while making heavy use of native HTML elements).
based technique that targets GPUs and identifies devices
based on unique properties of their GPU stacks. In a more
holistic exploration, Laperdrix et al. [11] deployed AmIUnique
                                                                         7. Conclusions
for collecting user fingerprints, and subsequently provided an               This paper highlights and empirically demonstrates that
in-depth examination of the discriminatory power of different            the magnitude of the privacy challenge browser vendors
fingerprinting attributes across both mobile and desktop plat-           face due to the fact that fingerprinting is more formidable
forms. Vastel et al. [18] focused on the longitudinal evolution          than previously perceived. Specifically, we detail how modern
of devices’ fingerprinting attributes and identified a subset            fingerprinting attributes can be implicitly inferred in a
of robust features that remain relatively stable for longer pe-          purely JavaScript-less approach. Our findings pose significant
riods of time. Akhavani et al. [67] demonstrated how browser             complications for potential countermeasures, as they will
versions are uniquely identifiable based on the unique set               need to also take into account HTML and CSS features when
of JavaScript functionalities they support. In contrast to the           trying to curtail fingerprinting attempts. When taking into
studies above, our work introduces a novel, robust finger-               consideration the already strenuous task of differentiating
printing technique that uses pure CSS and HTML features                  between legitimate and fingerprinting functionality, these
in lieu of JavaScript features that are detected, blocked, or            implications are further exacerbated. Overall, we hope that
impacted by existing anti-fingerprinting defenses.                       our work will motivate and inform new anti-fingerprinting
     In a complementary line of research, studies have shown             techniques against implicit non-JavaScript-based fingerprint-
how browser fingerprints can be augmented by identifying                 ing and will, ultimately, lead to more comprehensive and
installed extensions [23], [24], [68]–[72]. Interestingly, Laper-        robust defenses being deployed by browsers.
drix et al. [73] demonstrated how the presence of specific               Acknowledgements: We would like to thank the anonymous
browser extensions could be inferred from the modifications              reviewers for their valuable feedback. We would also like
that occur from style sheets they inject into pages.                     to thank Mike Sava for his instrumental support in our pilot
Fingerprinting measurements. Prior work has also shed                    study. This work was supported by the National Science Foun-
light on fingerprinting in the wild. Yen et al. [74] and Niki-           dation under grants CNS-1934597, CNS-2211574, CNS-2143363,
forakis et al. [28] discussed the effectiveness of tracking              and the U.S. Army Research Laboratory under Cooperative
techniques used in existing fingerprinting tools and measured            Agreement Number W911NF-13-2-0045. Any opinions, find-
their adoption across the web. Acar et al. [12] presented                ings, conclusions, or recommendations expressed herein are
FPDetective, a framework for detecting fingerprinting, and               those of the authors, and do not necessarily reflect those of
conducted a large-scale study. Many subsequent studies                   the NSF, the Department of Defense, or the U.S. Government.


                                                                    13
References                                                                             [22] P. Laperdrix, N. Bielova, B. Baudry, and G. Avoine, “Browser
                                                                                            fingerprinting: A survey,” ACM Trans. the Web, vol. 14, no. 2, 2020.
[1]   A. Lerner, A. K. Simpson, T. Kohno, and F. Roesner, “Internet jones              [23] O. Starov and N. Nikiforakis, “Xhound: Quantifying the fingerprintability
      and the raiders of the lost trackers: An archaeological study of web                  of browser extensions,” in Proc. IEEE Sym. Security and Privacy, 2017.
      tracking from 1996 to 2016,” in Proc. USENIX Security Sym., 2016.
                                                                                       [24] S. Karami, P. Ilia, K. Solomos, and J. Polakis, “Carnus: Exploring
[2]   U. Iqbal, P. Snyder, S. Zhu, B. Livshits, Z. Qian, and Z. Shafiq, “Ad-                the privacy threats of browser extension fingerprinting,” in Proc. Sym.
      graph: A graph-based approach to ad and tracker blocking,” in Proc.                   Network and Distributed System Security, 2020.
      IEEE Sym. Security and Privacy, 2020.
                                                                                       [25] K. Solomos, P. Ilia, N. Nikiforakis, and J. Polakis, “Escaping the confines
[3]   “WebKit - Full Third-Party Cookie Blocking and More,” https://webkit.                 of time: Continuous browser extension fingerprinting through ephemeral
      org/blog/10218/full-third-party-cookie-blocking-and-more/.                            modifications,” in Proceedings of the 2022 ACM SIGSAC Conference
[4]   S. Englehardt and A. Edelstein, “Firefox 85 Cracks Down on Super-                     on Computer and Communications Security, 2022, pp. 2675–2688.
      cookies,” https://blog.mozilla.org/security/2021/01/26/supercookie-
                                                                                       [26] K. Solomos, P. Ilia, S. Karami, N. Nikiforakis, and J. Polakis, “The dangers
      protections/, 2021.
                                                                                            of human touch: Fingerprinting browser extensions through user actions,”
[5]   P.     Snyder,    “Partitioning    Network-State      for    Privacy,”                in 31st USENIX Security Symposium (USENIX Security 22). Boston, MA:
      https://brave.com/privacy-updates/14-partitioning-network-state/, 2021.               USENIX Association, Aug. 2022, pp. 717–733. [Online]. Available: https://
[6]   R. Boucher, “Realclearpolicy - congress is finally listening to consumers             www.usenix.org/conference/usenixsecurity22/presentation/solomos
      on internet privacy,” 2020, https://www.realclearpolicy.com/articles/            [27] S. Karami, F. Kalantari, M. Zaeifi, X. J. Maso, E. Trickel, P. Ilia, Y. Shoshi-
      2020/01/15/congress is finally listening to consumers on                              taishvili, A. Doupé, and J. Polakis, “Unleash the simulacrum: Shifting
      internet privacy 111354.html.                                                         browser realities for robust Extension-Fingerprinting prevention,”
[7]   P. Voigt and A. Von dem Bussche, “The eu general data protection reg-                 in 31st USENIX Security Symposium (USENIX Security 22). Boston, MA:
      ulation (gdpr),” A Practical Guide, 1st Ed., Cham: Springer International             USENIX Association, Aug. 2022, pp. 735–752. [Online]. Available: https:
      Publishing, vol. 10, no. 3152676, 2017.                                               //www.usenix.org/conference/usenixsecurity22/presentation/karami
[8]   “California consumer privacy           act   (ccpa)   website    policy,”        [28] N. Nikiforakis, A. Kapravelos, W. Joosen, C. Kruegel, F. Piessens, and
      https://oag.ca.gov/privacy/ccpa.                                                      G. Vigna, “Cookieless monster: Exploring the ecosystem of web-based
                                                                                            device fingerprinting,” in Proc. IEEE Sym. Security and Privacy, 2013.
[9]   Y. Dimova, G. Acar, L. Olejnik, W. Joosen, and T. Van Goethem, “The
      CNAME of the Game: Large-scale Analysis of DNS-based Tracking                    [29] U. Iqbal, S. Englehardt, and Z. Shafiq, “Fingerprinting the fingerprinters:
      Evasion,” in Proc. Privacy Enhancing Technologies, 2021.                              Learning to detect browser fingerprinting behaviors,” in Proc. IEEE
[10] P. Eckersley, “How unique is your web browser?” in Proc. Privacy                       Sym. Security and Privacy, 2021.
     Enhancing Technologies, 2010.                                                     [30] “Browser Fingerprinting: An Introduction and the Challenges Ahead,”
[11] P. Laperdrix, W. Rudametkin, and B. Baudry, “Beauty and the beast:                     https://blog.torproject.org/browser-fingerprinting-introduction-and-
     Diverting modern web browsers to build unique browser fingerprints,”                   challenges-ahead/.
     in Proc. IEEE Sym. Security and Privacy, 2016.                                    [31] “Brave Fingerprint Randomization,” https://brave.com/privacy-updates/3-
[12] G. Acar, M. Juarez, N. Nikiforakis, C. Diaz, S. Gürses, F. Piessens,                  fingerprint-randomization/.
     and B. Preneel, “Fpdetective: dusting the web for fingerprinters,” in             [32] “Firefox’s protection against fingerprinting,” https://support.mozilla.
     Proc. ACM Conf. Computer and Communications Security, 2013.                            org/en-US/kb/firefox-protection-against-fingerprinting.
[13] S. Englehardt and A. Narayanan, “Online tracking: A 1-million-
                                                                                       [33] S. Bird, V. Mishra, S. Englehardt, R. Willoughby, D. Zeber,
     site measurement and analysis,” in Proc. ACM Conf. Computer and
                                                                                            W. Rudametkin, and M. Lopatka, “Actions speak louder than words:
     Communications Security, 2016.
                                                                                            Semi-supervised learning for browser fingerprinting detection,” arXiv
[14] Y. Cao, S. Li, and E. Wijmans, “((cross))-browser fingerprinting via                   preprint arXiv:2003.04463, 2020.
     os and hardware level features.” in Proc. Sym. Network and Distributed
     System Security, 2017.                                                            [34] C. F. Torres, H. Jonker, and S. Mauw, “Fp-block: usable web privacy
                                                                                            by controlling browser fingerprinting,” in Proc. European Sym. Research
[15] K. Mowery and H. Shacham, “Pixel perfect: Fingerprinting canvas                        in Computer Security, 2015.
     in html5,” in Proc. IEEE Work. Web 2.0 Security and Privacy, 2012.
                                                                                       [35] N. Nikiforakis, W. Joosen, and B. Livshits, “Privaricator: Deceiving
[16] M. Mulazzani, P. Reschl, M. Huber, M. Leithner, S. Schrittwieser,                      fingerprinters with little white lies,” in Proc. World Wide Web Conf., 2015.
     E. Weippl, and F. Wien, “Fast and reliable browser identification
     with javascript engine fingerprinting,” in Proc. IEEE Work. Web 2.0               [36] X. Lin, P. Ilia, S. Solanki, and J. Polakis, “Phish in sheep’s clothing:
     Security and Privacy, 2013.                                                            Exploring the authentication pitfalls of browser fingerprinting,” in 31st
                                                                                            USENIX Security Symposium (USENIX Security 22), 2022, pp. 1651–1668.
[17] A. Gómez-Boix, P. Laperdrix, and B. Baudry, “Hiding in the crowd:
     an analysis of the effectiveness of browser fingerprinting at large               [37] “FingerprintJS,” https://github.com/fingerprintjs/fingerprintjs.
     scale,” in Proc. World Wide Web Conf., 2018.
                                                                                       [38] “Demonstration of our StylisticFP approach against anti-fingerprinting
[18] A. Vastel, P. Laperdrix, W. Rudametkin, and R. Rouvoy, “Fp-stalker:                    extensions,” https://vimeo.com/737723235/c2b4c00b9f.
     Tracking browser fingerprint evolutions,” in Proc. IEEE Sym. Security
     and Privacy, 2018.                                                                [39] P. N. Bahrami, U. Iqbal, and Z. Shafiq, “Fp-radar: Longitudinal mea-
                                                                                            surement and early detection of browser fingerprinting,” arXiv preprint
[19] I. Agadakos, N. Agadakos, J. Polakis, and M. R. Amer, “Chameleons’                     arXiv:2112.01662, 2021.
     oblivion: Complex-valued deep neural networks for protocol-agnostic
     rf device fingerprinting,” in 2020 IEEE European Symposium on Security            [40] “AmIUnique,” https://amiunique.org/.
     and Privacy (EuroS&P). IEEE, 2020, pp. 322–338.                                   [41] “HTML elements reference,”               https://developer.mozilla.org/en-
[20] A. Das, G. Acar, N. Borisov, and A. Pradeep, “The web’s sixth sense:                   US/docs/Web/HTML/Element.
     A study of scripts accessing smartphone sensors,” in Proc. ACM Conf.              [42] D. Fifield and S. Egelman, “Fingerprinting web users through font met-
     Computer and Communications Security, 2018.                                            rics,” in Proc. Int. Conf. Financial Cryptography and Data Security, 2015.
[21] V. Mishra, P. Laperdrix, A. Vastel, W. Rudametkin, R. Rouvoy, and
                                                                                       [43] “Media Queries Level 3,” https://www.w3.org/TR/mediaqueries-3/, 2022.
     M. Lopatka, “Don’t count me out: On the relevance of ip address
     in the tracking ecosystem,” in Proc. World Wide Web Conf., 2020.                  [44] “Media Queries Level 5,” https://www.w3.org/TR/mediaqueries-5/, 2022.



                                                                                  14
[45] X. Lin, P. Ilia, and J. Polakis, “Fill in the blanks: Empirical analysis              [71] O. Starov, P. Laperdrix, A. Kapravelos, and N. Nikiforakis, “Unnec-
     of the privacy threats of browser form autofill,” in Proc. ACM Conf.                       essarily identifiable: Quantifying the fingerprintability of browser
     Computer and Communications Security, 2020.                                                extensions due to bloat,” in Proc. World Wide Web Conf., 2019.
[46] “BrowserStack,” https://www.browserstack.com/.                                        [72] T. Van Goethem and W. Joosen, “One side-channel to bring them
[47] “CrossBrowserTesting,” https://crossbrowsertesting.com/.                                   all and in the darkness bind them: Associating isolated browsing
                                                                                                sessions,” in USENIX Work. Offensive Technologies, 2017.
[48] “NoScript,” https://noscript.net/.
                                                                                           [73] P. Laperdrix, O. Starov, Q. Chen, A. Kapravelos, and N. Nikiforakis,
[49] “Disable JavaScript,” https://github.com/dpacassi/disable-javascript.                      “Fingerprinting in style: Detecting browser extensions via injected
[50] Brave, “Protecting against browser-language fingerprinting,”                               style sheets,” in Proc. USENIX Security Sym., 2021.
     https://brave.com/privacy-updates/17-language-fingerprinting.                         [74] T.-F. Yen, Y. Xie, F. Yu, R. P. Yu, and M. Abadi, “Host fingerprinting
[51] “Demonstration of our StylisticFP approach against Brave,”                                 and tracking on the web: Privacy and security implications.” in Proc.
     https://vimeo.com/739534811/c6f294458d.                                                    Sym. Network and Distributed System Security, 2012.
[52] Firefox, “Firefox’s protection against fingerprinting,” https://support.              [75] G. Acar, C. Eubank, S. Englehardt, M. Juarez, A. Narayanan, and
     mozilla.org/en-US/kb/firefox-protection-against-fingerprinting.                            C. Diaz, “The web never forgets: Persistent tracking mechanisms in the
                                                                                                wild,” in Proc. ACM Conf. Computer and Communications Security, 2014.
[53] S. Englehardt and A. Narayanan, “Online tracking: A 1-million-site
     measurement and analysis,” in Proceedings of the 2016 ACM SIGSAC                      [76] A. Das, N. Borisov, and E. Chou, “Every move you make: Exploring
     conference on computer and communications security, 2016, pp. 1388–1401.                   practical issues in smartphone motion sensor fingerprinting and
                                                                                                countermeasures.” in Proc. Privacy Enhancing Technologies, 2018.
[54] K. Solomos, J. Kristoff, C. Kanich, and J. Polakis, “Tales of favicons
     and caches: Persistent tracking in modern browsers,” in Proc. Sym.                    [77] V. Rizzo, S. Traverso, and M. Mellia, “Unveiling web fingerprinting
     Network and Distributed System Security. The Internet Society, 2021.                       in the wild via code mining and machine learning,” in Proc. Privacy
                                                                                                Enhancing Technologies, 2021.
[55] “WebDev - Measuring the Critical Rendering                             Path,”
     https://web.dev/critical-rendering-path-measure-crp/.                                 [78] P. Laperdrix, B. Baudry, and V. Mishra, “Fprandom: Randomizing core
                                                                                                browser objects to break advanced device fingerprinting techniques,”
[56] “Css fingerprint,” https://csstracking.dev/.
                                                                                                in Int. Sym. Engineering Secure Software and Systems, 2017.
[57] “No-JS fingerprinting,” https://noscriptfingerprint.com/.
                                                                                           [79] A. FaizKhademi, M. Zulkernine, and K. Weldemariam, “Fpguard:
[58] N. Takei, T. Saito, K. Takasu, and T. Yamada, “Web browser fingerprint-                    Detection and prevention of browser fingerprinting,” in Proc. IFIP
     ing using only cascading style sheets,” in Proc. IEEE Int. Conf. Broadband                 Conf. Data and Applications Security and Privacy, 2015.
     and Wireless Computing, Communication and Applications, 2015.
                                                                                           [80] A. Datta, J. Lu, and M. C. Tschantz, “Evaluating anti-fingerprinting
[59] “Fingerprinting CSS,” https://privacycheck.sec.lrz.de/active/fp css/                       privacy enhancing technologies,” in Proc. World Wide Web Conf., 2019.
     fp css.html.
                                                                                           [81] M. Heiderich, M. Niemietz, F. Schuster, T. Holz, and J. Schwenk,
[60] “Auto Iframes Remover,” https://chrome.google.com/webstore/detail/auto-                    “Scriptless attacks: stealing the pie without touching the sill,” in Proc.
     iframes-remover/fhenkighldilmobhdgopkhejbaainnfm.                                          ACM Conf. Computer and Communications Security, 2012.
[61] V. Le Pochat, T. Van Goethem, S. Tajalizadehkhoob, M. Korczyński, and
     W. Joosen, “Tranco: A research-oriented top sites ranking hardened
     against manipulation,” in Proc. Sym. Network and Distributed System                   Appendix A.
     Security, 2019.                                                                       Element Example
[62] “Beginner’s guide to media queries,” https://developer.mozilla.org/en-
     US/docs/Learn/CSS/CSS layout/Media queries.                                               The <textarea> element in our system is rendered in
[63] N. Andriamilanto, T. Allard, and G. Le Guelvouit, “FPSelect: Low-                     Chrome v99 with a width/height of 430px/150px on macOS
     Cost Browser Fingerprints for Mitigating Dictionary Attacks against                   Monterey 12.2.1, while having a width/height of 432px/162px
     Web Authentication Mechanisms,” in Proc. Annual Computer Security                     on Windows 11, and 348px/145px on Ubuntu 18.04. These
     Applications Conf., 2020.
                                                                                           dimensions may also be different when the browser version
[64] B. Amin Azad, O. Starov, P. Laperdrix, and N. Nikiforakis, “Web                       changes (e.g., v93). When multiple stylistic elements are
     runner 2049: Evaluating third-party anti-bot services,” in Conference on
     Detection of Intrusions and Malware, and Vulnerability Assessment, 2020.              employed, the dimensions of certain elements will vary
                                                                                           according to the characteristics of the environment, making
[65] “Digging into the Privacy Sandbox - Combat Fingerprinting,” https://
     web.dev/digging-into-the-privacy-sandbox/#combat-fingerprinting.
                                                                                           the device more identifiable.
[66] T. Laor, N. Mehanna, A. Durey, V. Dyadyuk, P. Laperdrix, C. Maurice,
     Y. Oren, R. Rouvoy, W. Rudametkin, and Y. Yarom, “Drawnapart:                         Appendix B.
     A device identification technique based on remote gpu fingerprinting,”                Element Arrangement Strategy
     in Proc. Sym. Network and Distributed System Security, 2022.
[67] S. A. Akhavani, J. Jueckstock, J. Su, A. Kapravelos, E. Kirda, and L. Lu,                  Figure 3 outlines the different element arrangement strate-
     “Browserprint: An analysis of the impact of browser features on finger-
     printability and web privacy,” in Proc. Int. Conf. Information Security, 2021.
                                                                                           gies, and the information loss avoided by the arrangement
                                                                                           employed by our system. A naı̈ve implementation of stylistic
[68] A. Sjösten, S. Van Acker, and A. Sabelfeld, “Discovering browser
     extensions via web accessible resources,” in Proc. ACM Conf. Data
                                                                                           fingerprints would deploy an iframe for each HTML element,
     and Application Security and Privacy, 2017.                                           as illustrated in Figure 3a, resulting in over 100 iframes. Since
                                                                                           each iframe needs to send out two requests for dimensional
[69] G. G. Gulyas, D. F. Somé, N. Bielova, and C. Castelluccia, “To extend
     or not to extend: on the uniqueness of browser extensions and web                     data (width and height), that would incur over 200 query re-
     logins,” in Proc. ACM Conf. Privacy in the Electronic Society, 2018.                  quests in addition to the 100 initial iframe requests. This has
[70] I. Sanchez-Rola, I. Santos, and D. Balzarotti, “Extension Breakdown:                  a negative effect on page load times. To reduce the number of
     Security Analysis of Browsers Extension Resources Control Policies,”                  iframes, we deploy multiple elements with a single iframe. Sub-
     in Proc. USENIX Security Sym., 2017.                                                  optimal improvements are shown in Figure 3b and Figure 3c,


                                                                                      15
                                                     
                                                                                                                                                                               
         HOHPHQW            HOHPHQW
                                           
                                                           
                                                                                             
                                                                                             HOHPHQW                                                       
     HOHPHQW                                                                                                                          
                                      
                                                                                                                                                                    
                                                                    
                                                                                                                                                                                     
                                                                                                                                                                         
           LIUDPH           LIUDPH                                                                                   LIUDPH                                 
                                                                                            LIUDPH                                                                                        LIUDP
      LIUDPH                                                                                              LIUDPH
                                                     LIUDPH
                                                      LIUDPH                                                                   LIUDPH
                             LIUDPH
                                                                                                                                                                                     
                                                                                            LIUDPH
                                                                                                                                                                   LIUDPH
                                                                LIUDPH


                                                                                                                                                       /RVHDQGZLGWKV
(a) Dimension Calculation                    (b) Row Arrangement
                                              /RVHDQGKHLJKWV
                                              /RVHDQGKHLJKWV                         (c) Column Arrangement
                                                                                                              /RVHDQGZLGWKV
                                                                                                        /RVHDQGKHLJKWV                              (d) Diagonal Arrangement
                    /RVHDQGKHLJKWV
Figure 3: HTML element arrangement. Figure 3a obtains element dimensions with iframe dimensions. Figure 3b arranges
elements in the same row, losing heights of #1 and #2. Figure 3c arranges elements in the same column, losing widths
of #2 and #3. Figure 3d arranges the elements diagonally to obtain the sums of the dimensions of all three elements.


which illustrate row and column arrangements, respectively.                                       TABLE 6: Media features used in our framework.
While these arrangements result in better performance, they                                 Media Queries             Media features
suffer from a significant loss of information, namely losing the                            Level 3                   color, monochrome, orientation
heights or widths of the arranged elements. Our approach is
shown in Figure 3d, whereby we arrange the elements diago-                                                            any-hover, any-pointer, color-gamut, hover,
                                                                                            Level 4                   overflow-block, overflow-inline, pointer,
nally to obtain the sums of the dimensions of all three elements.                                                     resolution, update
                                                                                                                      dynamic-range, environment-blending,
Appendix C.                                                                                                           forced-colors, inverted-colors,
OS Language Detection                                                                       Level 5
                                                                                                                      prefers-color-scheme, prefers-contrast,
                                                                                                                      prefers-reduced-motion,
                                                                                                                      prefers-reduced-transparency, scripting,
    Here we provide more details about how our system                                                                 video-color-gamut, video-dynamic-range
can detect the OS language. The feature Env-9 in Table 1 is
associated with <input> elements of the types of file, date,
month, and week. These elements can be used to detect the
operating system language because the OS language defines
the browser display language, which in turn determines                                  Listing 4: A Basic Example of CSS Features Combination.
how these elements are rendered. Note that the browser                                  1     /* identify Firefox browser */
display language is different from the browser language,                                2     @supports ( -moz-box-align:inherit ) {
which is the language to display website content and is                                 3       # probe { background: url (/ Firefox ) ; } }
accessible using navigator.language. These elements are                                 4     /* distinguish Tor browser from Firefox */
                                                                                        5     @supports ( -moz-box-align:inherit
rendered based on the browser display language rather than                                         ) and ( not ( hyphenate-character:auto )){
the browser language. For instance, the <input> element                                 6       # probe { background: url (/ Firefox-Tor ); } } }
with type=“file” displays “choose file” when the OS language                            7     /* identify Tor browser running on macOS */
is English. When the OS language is Italian and the browser                             8     @supports ( -moz-appearance:inherit
displays in that language, the element shows “Scegli file”                                         ) and ( not ( hyphenate-character:auto
                                                                                                   ) ) and ( -moz-osx-font-smoothing:inherit )){
instead, and its size differs. The Font-pref-2 element also                             9       # probe {
detects some OS languages because its size depends on the                                              background: url (/ Firefox-Tor-macOS ); } }
default font and Chromium browsers assign different default
font families for some specific languages (e.g., “Hiragino Kaku
Gothic ProN” for Japanese and “PingFang SC” for Chinese).

Appendix D.                                                                             CSS features directly with requests. To reduce the number of
                                                                                        requests, we apply multiple rules to the same element and order
Media Queries                                                                           these feature queries from general to specific. Listing 4 employs
    Table 6 summarizes the media features used by our                                   a single request to test three CSS features. If the client browser
system for features Media-1 and Media-2.                                                is Tor, running on a macOS platform, it will skip the first two
                                                                                        matched queries and send the /Firefox-Tor-macOS request.
Appendix E.                                                                                 Our system can be seamlessly integrated into web ap-
Code Samples                                                                            plications with one line of HTML markup, as shown in
                                                                                        Listing 5. The invisible <iframe> element requests the re-
   Supplementary to the stylistic fingerprinting features that                          source from the fingerprinting service and all the subsequent
use dimensional data, we test the browser’s support for 12                              fingerprinting payloads are sent directly to the backend.


                                                                                   16
                                                                         TABLE 8: Ad blockers’ behavior against our system. ✗
  Listing 5: Single HTML markup to enable our system.                    denotes that the element or request is blocked.
<iframe src= " fp.url " style= " visibility:hidden; " / >                  Ad blocker           ad1   ad2   ad3   ad4   ad5   ad6   req1   req2
                                                                           AdLock               ✗                       ✗     ✗      ✗
                                                                           AdGuard              ✗     ✗           ✗     ✗     ✗      ✗
Appendix F.                                                                Adblock Plus         ✗     ✗           ✗     ✗            ✗
                                                                           AdBlock              ✗     ✗           ✗     ✗            ✗
Extensions                                                                 AdBlocker Ultimate   ✗     ✗     ✗                        ✗      ✗
                                                                           Ghostery             ✗                 ✗     ✗            ✗      ✗
 TABLE 7: Fingerprint spoofing and blocking extensions.                    Opera Browser        ✗     ✗                              ✗
 Extension                                               Users             uBlock Origin        ✗     ✗     ✗     ✗     ✗            ✗      ✗
 User-Agent Switcher and Manager                          200K
 Fingerprint Spoofing                                      50K
 Canvas Fingerprint Defender                               60K           Europe). Based on their guidance, we provided a privacy state-
 Font Fingerprint Defender                                 30K           ment to inform end users of our data collection (see below).
 Trace - Online Tracking Protection                        20K
 AudioContext Fingerprint Defender                         10K                During our pilot study, we only collected browser fin-
                                                                         gerprints, including browser fingerprints collected by Fin-
                                                                         gerprintJS and elements’ dimensional data collected by our
    Table 7 details the list of fingerprinting spoofing or block-        StylisticFP tool. We also set an HTTP cookie with a unique
ing extensions that we tested during our experimental analysis.          24-bit random string to distinguish devices for ground truth.
                                                                         We stored all collected data in an encrypted Postgres database,
Appendix G.                                                              which would only respond to requests from the web service
Ad blocking                                                              and queries from a set host on our network. Finally, all network
                                                                         traffic was encrypted, with ingress rules for access control.
                                                                              The privacy disclaimer stated, “The <redacted> is col-
    Table 8 shows eight ad blockers and their behavior in
                                                                         lecting anonymized device and browser fingerprinting
blocking our crafted ad elements and requests. The differ-
                                                                         information for a security research study. The collected data
ences in blocking behaviors allow our system to discern                  includes web stylistic measurements and device characteristics.
the tested ad blocker.                                                   The <redacted> does not collect sensitive personal infor-
    Our analysis also finds a bypass against Opera’s ad-                 mation as part of this study. Data will be securely retained
blocking functionality. Specifically, Opera has a built-in ad            until <redacted>.” The site has additional privacy disclaimers
blocker that users can easily enable from the right side of the          (including data erasure rights) that cannot be shared without
address bar. Opera appends a <style> element to the end of               revealing institutional sensitive information. We sought
the <head> element, and it locates ad elements in the <style>            and obtained approvals and counsel for this deployment
tag with CSS selectors applying display:none !important                  following our institution’s strict policies and controls on data
to remove them from the page. However, ad elements can                   acquisition and processing, including region-specific policies.
bypass this protection by taking advantage of precedence
in CSS, which defines that inline rules take precedence over
those in the <style> tag. Thus, we use inline rules to over-             Appendix I.
ride Opera’s rules and render ad elements visible. Although              Entropy and Effectiveness
Opera applies the !important rule to the display property,
which overrides all other rules for this specific property                   In Table 9 we detail the entropy of the various FPJS
on that element, ad elements can also make use of this rule              fingerprinting and header attributes, and whether they are
by appending it to display:block that renders an element                 effective against six countermeasures.
visible. For example, if we add the inline CSS display:block
!important to an ad element, this rule will have higher
priority than Opera’s rules in the <style> tag, and the ad
element will not be blocked and will appear in the page.

Appendix H.
Ethics: Pilot Study and Privacy Statement
    Prior to our study, we sought advice from various orga-
nizational entities to comply with our privacy policies despite
getting IRB exemption. This included Human Resources for in-
volving organizational employees, Global privacy review to as-
sess what data is being collected, the security & access control
measures in place, and data storage and retention, and Regional
privacy review to comply with region-specific regulations (e.g.,


                                                                    17
TABLE 9: FPJS and header fingerprinting attributes’ entropy and effectiveness against popular countermeasures: ✓denotes
that the technique is effective, ✗ denotes that it is ineffective, and ⊖ denotes that the feature is not supported by the browser.
                                                                Firefox              Chrome                                  JS-
Feature                    Entropy      Brave      Tor                                                FP Inspector [29]
                                                            w/FP Protection    w/Anti-FP Extensions                       Blocked
fonts                        0.31         ✗         ✗               ✗                   ✗                    ✗              ✗
domBlockers                  0.06         ✓         ✓               ✓                   ✓                    ✓              ✗
fontPreferences              0.34         ✓         ✓               ✓                   ✗                    ✗              ✗
audio                        0.23         ✗         ✗               ✗                   ✗                    ✗              ✗
screenFrame                  0.48         ✓         ✗               ✗                   ✗                    ✗              ✗
osCpu                        0.14         ⊖         ✓               ✓                   ✗                    ✗              ✗
languages                    0.23         ✗         ✗               ✗                   ✗                    ✗              ✗
colorDepth                   0.09         ✓         ✗               ✗                   ✗                    ✗              ✗
deviceMemory                 0.10         ✗         ⊖               ⊖                   ✗                    ✗              ✗
screenResolution             0.38         ✓         ✗               ✗                   ✗                    ✗              ✗
hardwareConcurrency          0.21         ✗         ✗               ✗                   ✗                    ✗              ✗
timezone                     0.26         ✓         ✗               ✗                   ✗                    ✗              ✗
sessionStorage               0.00         ✓         ✓               ✓                   ✗                    ✗              ✗
localStorage                 0.00         ✓         ✓               ✓                   ✗                    ✗              ✗
indexedDB                    0.00         ✓         ✓               ✓                   ✗                    ✗              ✗
openDatabase                 0.05         ✓         ✓               ✓                   ✗                    ✗              ✗
cpuClass                     0.00         ⊖         ⊖               ⊖                   ✗                    ✗              ✗
platform                     0.10         ✓         ✓               ✓                   ✗                    ✗              ✗
plugins                      0.12         ✗         ✗               ✗                   ✗                    ✗              ✗
canvas                       0.53         ✗         ✗               ✗                   ✗                    ✗              ✗
touchSupport                 0.07         ✓         ✓               ✓                   ✗                    ✗              ✗
vendor                       0.13         ✓         ✗               ✗                   ✗                    ✗              ✗
vendorFlavors                0.09         ✓         ✗               ✗                   ✗                    ✗              ✗
cookiesEnabled               0.00         ✓         ✓               ✓                   ✗                    ✗              ✗
colorGamut                   0.17         ✓         ⊖               ⊖                   ✓                    ✓              ✗
invertedColors               0.05         ⊖         ⊖               ⊖                   ✓                    ✓              ✗
forcedColors                 0.05         ✓         ✓               ✓                   ✓                    ✓              ✗
monochrome                   0.00         ✓         ✓               ✓                   ✓                    ✓              ✗
contrast                     0.04         ✓         ⊖               ⊖                   ✓                    ✓              ✗
reducedMotion                0.02         ✓         ✓               ✓                   ✓                    ✓              ✗
hdr                          0.10         ✓         ⊖               ⊖                   ✓                    ✓              ✗
math                         0.20         ✓         ✓               ✓                   ✗                    ✗              ✗
Header user agent            0.41         ✓         ✗               ✗                   ✗                    ✓              ✓
Header accept language       0.35         ✗         ✗               ✓                   ✗                    ✓              ✓




                                                               18
