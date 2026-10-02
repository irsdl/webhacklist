---
type: Article
title: "FuzzOrigin: Detecting UXSS vulnerabilities in Browsers through Origin Fuzzing"
description: "FuzzOrigin fuzzes browsers for universal cross-site scripting, generating HTML and JavaScript that drives frequent navigations and chained event handlers, then detecting when a script executes under an origin it should not have. It found nineteen UXSS bugs in Chrome and Edge, letting an attacker page run script in every other site the victim's browser loads."
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/kim"
tags: [article, webseclist-reference, xss, sop-bypass, same-origin-policy, fuzzing, dom, javascript, tooling, owasp-a01-2021, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T15:05:02+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/kim"
    title: "FuzzOrigin: Detecting UXSS vulnerabilities in Browsers through Origin Fuzzing"
    author: Sunwoo Kim, Young Min Kim, Jaewon Hur, Suhwan Song, Gwangmu Lee, Byoungyoung Lee
  - id: capture
    resource: "https://web.archive.org/web/20220713150152/https://www.usenix.org/conference/usenixsecurity22/presentation/kim"
also_at:
  - "https://www.usenix.org/system/files/sec22-kim.pdf"
authors:
  - Sunwoo Kim
  - Young Min Kim
  - Jaewon Hur
  - Suhwan Song
  - Gwangmu Lee
  - Byoungyoung Lee
canonical_url: ""
cited_by:
  - "2022.md:61"
commit: ""
content_sha256: 0bf684ec52c2c814dc8ac7c3aee8e9009acd0bb2423510dfad83024f10359916
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/kim"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 62a73c6fff3ea5a610a67d0a22abf7f3e064f992a83871b1b919fb2fa187db1f
retrieved_from: "https://www.usenix.org/system/files/sec22-kim.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-14T15:05:02+00:00"
slug: usenix-org-fuzzorigin-detecting-uxss-vulnerabilities-browsers-through-fuzzing
snapshot: 20220713150152
title_english: ""
translation_file: ""
translation_of: ""
---

# FuzzOrigin: Detecting UXSS vulnerabilities in Browsers through Origin Fuzzing

**FuzzOrigin: Detecting UXSS vulnerabilities in Browsers through Origin Fuzzing** - Sunwoo Kim, Young Min Kim, Jaewon Hur, Suhwan Song, Gwangmu Lee, Byoungyoung Lee, Publisher not stated.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/kim>
- Also published at: <https://www.usenix.org/system/files/sec22-kim.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-kim.pdf (live) on 2026-08-14
- Capture timestamp: 20220713150152
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

FuzzOrigin: Detecting UXSS vulnerabilities in
     Browsers through Origin Fuzzing
  Sunwoo Kim, Samsung Research; Young Min Kim, Jaewon Hur,
and Suhwan Song, Seoul National University; Gwangmu Lee, EPFL;
         Byoungyoung Lee, Seoul National University
  https://www.usenix.org/conference/usenixsecurity22/presentation/kim




  This paper is included in the Proceedings of the
         31st USENIX Security Symposium.
              August 10–12, 2022 • Boston, MA, USA
                           978-1-939133-31-1




                                  Open access to the Proceedings of the
                                   31st USENIX Security Symposium is
                                         sponsored by USENIX.
                       F UZZ O RIGIN: Detecting UXSS vulnerabilities in Browsers
                                       through Origin Fuzzing

                Sunwoo Kim∗                                         Young Min Kim                               Jaewon Hur
             Samsung Research                                   Seoul National University                Seoul National University
         sunwoo28.kim@samsung.com                                  ym.kim@snu.ac.kr                        hurjaewon@snu.ac.kr
                    Suhwan Song                                    Gwangmu Lee†                        Byoungyoung Lee‡
              Seoul National University                               EPFL                          Seoul National University
                sshkeb96@snu.ac.kr                              gwangmu.lee@epfl.ch                 byoungyoung@snu.ac.kr

                               Abstract                                          1   Introduction

                                                                                 Modern web browsers feature client-side scripting, enabling
Universal cross-site scripting (UXSS) is a browser vulnerabil-                   highly interactive dynamic web pages. By allowing the script
ity, making a vulnerable browser execute an attacker’s script                    code such as JavaScript [39] or WebAssembly [43] to be
on any web pages loaded by the browser. UXSS is considered                       executed on the client-side, developers can make a web ap-
a far more severe vulnerability than well-studied cross-site                     plication powerful like a native app, significantly enriching
scripting (XSS). This is because the impact of UXSS is not                       user experience. From the security perspective, however,
limited to a web application, but it impacts each and every                      client-side scripting may expose a challenging attack surface
web application as long as a victim user runs a vulnerable                       since a script from an attacker can also be executed. This
browser. We find that UXSS vulnerabilities are difficult to                      is particularly crucial considering a typical web application
find, especially through fuzzing, for the following two rea-                     architecture—it often involves multiple players (e.g., a main
sons. First, it is challenging to detect UXSS because it is a                    host server, a media provider, an advertiser, etc.), and a single
semantic vulnerability. In order to detect UXSS, one needs to                    web page is rendered through complex interactions or naviga-
understand the complex interaction semantics between web                         tions among these players. Hence, it is important for browsers
pages. Second, it is difficult to generate HTML inputs that                      to faithfully determine if a given script is not from an attacker,
trigger UXSS since one needs to drive the browser to perform                     and thus it is safe to execute.
complex interactions and navigations.                                               Cross-site scripting (XSS) is one of the extensively studied
   This paper proposes F UZZ O RIGIN, a browser fuzzer de-                       vulnerabilities [3, 20, 25–28, 30, 44, 45, 49, 55, 56, 58–62],
signed to detect UXSS vulnerabilities. F UZZ O RIGIN ad-                         exploiting the issue of client-side scripting. It is a security
dresses the above two challenges by (i) designing an origin                      vulnerability in web applications, which allows attackers to
sanitizer with a static origin tagging mechanism and (ii) prior-                 inject client-side scripts into a vulnerable web page. Then the
itizing origin-update operations through generating chained-                     attacker’s script is executed on behalf of the victim, thereby
navigation operations handling dedicated events. We im-                          stealing security-critical resources (e.g., a session cookie of
plemented F UZZ O RIGIN, which works with most modern                            the vulnerable web application). It is arguably the most com-
browsers, including Chrome, Firefox, Edge, and Safari. Dur-                      mon and well-known vulnerability. Popular websites such as
ing the evaluation, F UZZ O RIGIN discovered four previously                     Twitter and Facebook had numerous XSS vulnerabilities in
unknown UXSS vulnerabilities, one in Chrome and three in                         the past [23, 46, 53], jeopardizing users’ data.
Firefox, all of which have been confirmed by the vendors.                           Universal cross-site scripting (UXSS) [31] is similar to
F UZZ O RIGIN is responsible for finding one out of two UXSS                     XSS, because it scripts across sites—i.e., it allows an at-
vulnerabilities in Chrome reported in 2021 and all three in                      tacker to inject and execute code on web pages loaded by
Firefox, highlighting its strong effectiveness in finding new                    the browser. However, the key difference is that UXSS is a
UXSS vulnerabilities.                                                            vulnerability of web browsers, not web applications. There-
                                                                                 fore, it is considered a far more severe vulnerability than XSS.
                                                                                 More specifically, the impact of UXSS is universal, i.e., it is
   ∗ The work is done at Seoul National University as an academic exchange
                                                                                 not limited to a particular web application but rather affects
program.
   † The work is done while the author is a graduate student at Seoul National   all web applications as long as a victim runs a vulnerable web
University.                                                                      browser. Should it be found in a browser, it allows an attacker
   ‡ Corresponding author.                                                       to launch attacks against any website, irrespective of the fact



USENIX Association                                                                                  31st USENIX Security Symposium           1007
that such websites alone do not have any security issues.            Solution #1: Origin Sanitizer. First, the origin sanitizer
                                                                     of F UZZ O RIGIN keeps track of server interaction semantics
                                                                     through static origin tagging, which is automatically instru-
1.1    Research Challenges
                                                                     mented into the scripts marking where the script was fetched.
Despite the pressing security needs, UXSS is a relatively            Leveraging the static origin tagging, when the script is exe-
unexplored research topic compared to XSS. Focusing on               cuted by the browser, F UZZ O RIGIN is capable of checking if
the research direction towards fuzz testing for UXSS (which          the to-be-executed script is granted with the correct capability
is the main focus of this paper), we think this is due to the        (i.e., a correct origin). By design, the origin sanitizer does not
following two unique challenges that UXSS bears to meet the          have any false positive in detecting UXSS, because the static
key requirements to perform fuzz testing.                            tagging mechanism is precise.
Challenge #1: UXSS Detection. First, it is challenging to            Solution #2: Prioritizing Origin-update Operations. Sec-
generalize a UXSS detection mechanism for fuzzing, because           ond, F UZZ O RIGIN prioritize origin-update operations in gen-
it is essentially a semantic vulnerability. This is important        erating HTML inputs. This is based on the observation that
because the key requirement for fuzzing is a vulnerability de-       the root cause of UXSS vulnerabilities is due to incorrect ori-
tection mechanism without false positives. In the case of XSS,       gin update handling in browsers. To this end, F UZZ O RIGIN
the detection is straightforward—one only needs to check if          generates HTML inputs triggering complex and interactive
the attacker-provided script is executed. If it is executed, then    navigation operations, which makes the browser perform
one can determine it triggered an XSS vulnerability. However,        more frequent origin-update operations. In particular, HTML
in the case of UXSS, simply having the attacker-provided             inputs generated by F UZZ O RIGIN can be characterized by
script being executed does not lead to UXSS. Instead, one            their complex cross-origin navigation behaviors, where each
must carefully inspect the capability (i.e., origin [65]) that the   navigation is chained with another navigation using event
script execution has been granted. To be specific, one needs         handlers.
to confirm that the attacker’s script has higher privileges than     Implementation and Results.                   We implemented
it supposed to (i.e., violating the same-origin policy [42]).        F UZZ O RIGIN, which works with most of modern web
Since the capability of the attacker’s script depends on how a       browsers, including Chrome, Firefox, Edge, and Safari. Ac-
browsed web page interacts with different players (or servers),      cording to our evaluation, the origin sanitizer of F UZZ O RIGIN
understanding the interaction semantics is crucial to detect         showed no false positives in identifying UXSS vulnerabili-
UXSS.                                                                ties. Over the six months of lengthy, extensive evaluations,
Challenge #2: UXSS Triggering. Second, it is challenging             if the origin sanitizer reports a potential UXSS vulnerability,
to construct HTML inputs triggering UXSS vulnerabilities             it is always confirmed to be true by the respective vendors.
for fuzzing. We find that the root cause of UXSS stems from          F UZZ O RIGIN’s HTML generation with chained-navigation
the cases that the capability of the script execution is incor-      operations indeed raised more frequent origin-updates, allow-
rectly updated due to the semantic mistakes in the browser.          ing F UZZ O RIGIN to effectively test UXSS-relevant logic in
Hence, to increase the chance to trigger UXSS, a generated           the browser.
HTML should drive complex interactions between multiple                  Importantly, during the evaluation F UZZ O RIGIN discov-
servers (i.e., complex cross-origin page loading), which leads       ered four new UXSS vulnerabilities (one in Chrome and three
to frequent capability updates with respect to scripts.              in Firefox), which is all confirmed by the respective vendors.
                                                                     We highlight that UXSS vulnerabilities are extremely rare
                                                                     vulnerabilities. In 2021, only two and three UXSS vulnera-
1.2    F UZZ O RIGIN: The First UXSS Fuzzer
                                                                     bilities were confirmed in Chrome and Firefox, respectively,
This paper presents F UZZ O RIGIN, a browser fuzzer to de-           meaning that F UZZ O RIGIN identified 50% (in Chrome) and
tect UXSS vulnerabilities. To the best of our knowledge,             100% (in Firefox) of those.
F UZZ O RIGIN is the first UXSS fuzzer. Similar to traditional           To summarize, this paper makes the following contribu-
browser fuzzers [12, 32–34, 67, 69], F UZZ O RIGIN generates         tions:
the HTML document embedding JavaScript, based on the                 • Analysis: Demystifying UXSS. We analyzed two previ-
knowledge of the language syntax (i.e., grammar awareness                ous UXSS vulnerabilities to demystify challenges from the
of HTML and JavaScript). Then F UZZ O RIGIN runs a web                   perspective of fuzz testing.
browser while providing the HTML document in hopes the               • Design: The first UXSS Fuzzer.                  We proposed
run triggers UXSS.                                                       F UZZ O RIGIN, a UXSS fuzzing framework. It features two
   Unlike traditional browser fuzzers, F UZZ O RIGIN designs             unique designs for UXSS: (i) an origin sanitizer to detect
following two unique features to address aforementioned                  UXSS and (ii) origin-update prioritization when generating
challenges of UXSS: i) an origin sanitizer to detect UXSS;               HTML inputs.
and ii) prioritizing origin-update operations in generating          • Result: New UXSS vulnerabilities. We found four new
HTML inputs.                                                             UXSS vulnerabilities using F UZZ O RIGIN, which attributes



1008    31st USENIX Security Symposium                                                                          USENIX Association
    50% (in Chrome) and 100% (in Firefox) of all confirmed                      application, the attacker has to find an XSS vulnerability in
    UXSS vulnerabilities in 2021.                                               the very application. In other words, an XSS vulnerability is
                                                                                specific to a web application, and thus it cannot be used to
                                                                                attack any other web application.
2     Background
                                                                                Universal Cross-Site Scripting. On the other hand, uni-
This section provides the necessary background to understand                    versal cross-site scripting (UXSS) is a vulnerability in web
F UZZ O RIGIN. We first describe the role of origin in browser                  browsers or their plugins, allowing attackers to run their code
security as well as XSS and UXSS vulnerabilities related                        on behalf of the web page loaded by the web browser. It is
to the origin (§2.1). Then we describe how browsers keep                        similar to XSS, as it creates an XSS condition—i.e., UXSS
track of origin within their internal data structure, the DOM                   allows an attacker to execute attacker-injected code on web
tree (§2.2).                                                                    pages loaded by the browser. However, the difference is that
                                                                                UXSS is universal, meaning it is not specific to a particu-
                                                                                lar web application. Since the UXSS vulnerability is in the
2.1      Origin in Browser Security                                             browser, the attack can be launched against any web page
                                                                                loaded by the browser, including internal pages such as the
The Same-Origin Policy.          The same-origin policy con-                    settings page. Thus, UXSS vulnerabilities are considered
stitutes a fundamental security mechanism in modern web                         the most critical security threat in the web ecosystem. Once
browsers [66], which strictly defines boundaries between web                    found in a major browser, it allows an attacker to launch at-
pages. If two web pages have the same origin, one page                          tacks against any website, irrespective of the fact that such
can access other page’s resources and data without restric-                     websites alone do not have any security issues.
tion, such as DOM, cookie, fetch, localStorage, IndexedDB,                         More importantly, UXSS attacks often have more criti-
SharedWorker, and BroadcastChannel. For instance, this                          cal security impacts than typical memory corruption or re-
policy allows a script embedded in https://bank.com/list                        mote code execution vulnerabilities in modern web browsers.
to access a session cookie stored by another page                               In response to memory corruption attacks and side-channel
https://bank.com/login as they have the same origin.                            attacks such as Spectre [22], modern browsers started to
   An origin is defined as a tuple of (scheme,                                  employ multi-process architecture [1, 16, 51] and site iso-
host, port)1 .       Suppose a web page is located in                           lation [13, 52]. Thus, each renderer process is tied to an
http://example.org:8080/page.html, then it has the origin,                      origin, and the access to other origin’s data is prevented by
(http, example.org, 8080). This origin is the same as the                       the process isolation. As a result, even if a memory corruption
origin of http://example.org:8080/sub.html. However, it                         vulnerability in the renderer is exploited, an attacker would
is different from the origin of https://example.org:8080                        not have access to other origin’s data. On the contrary, UXSS
(different scheme), http://example.net:8080 (different                          attacks offer a unique and strong attack vector, as it allows
host), and http://example.org:8888 (different port).                            the attacker to access other origin’s data.
Cross-Site Scripting. Cross-site scripting (XSS) is a secu-
rity vulnerability in web applications, allowing attackers to
                                                                                2.2    Origin Tracking in Browsers
inject scripts into a vulnerable web page browsed by other
users. Exploiting XSS, the attacker’s injected script (e.g.,                    Document Object Tree (DOM) and Origin. In order to en-
JavaScript) is executed on the client-side in the context of the                rich the user experience, modern web browsers support client-
vulnerable web page. This essentially elevates the attacker’s                   side scripting (such as JavaScript). In response to an event
privilege to access security-sensitive resources of the vulner-                 (i.e., when the browser parses <script> tag, when the browser
able web page (e.g., a session cookie) and perform actions                      completes the page load, when the keyboard or mouse input
on behalf of the user. XSS is mainly caused by a lack of                        is received, when a certain time has elapsed, etc.), a web page
proper validation over attacker-provided inputs. For instance,                  can be modified dynamically by executing the client-side
if the application fails to filter out script tags, the attacker                script. From the perspective of a browser implementation,
may provide a script tag as the input to be included in the                     the client-side scripting is being supported by the interaction
vulnerable web page.                                                            between the renderer and the JavaScript engine. First, the
   XSS is arguably the most common publicly reported se-                        renderer takes web resources (e.g., raw HTML documents)
curity vulnerability. Popular websites such as Twitter and                      and constructs a document object model (DOM) tree, a logi-
Facebook had XSS vulnerabilities in the past [23, 46, 53],                      cal tree representing the HTML. Then upon a certain event is
exposing numerous users’ security-sensitive data to be ex-                      dispatched, the renderer invokes the JavaScript engine. The
ploited. In order to launch XSS attacks against a certain web                   JavaScript engine takes the DOM tree from the renderer, and
   1 The HTML standard defines the origin as a 4-tuple (i.e., scheme, host,     executes the script block corresponding to the dispatched
port, and domain), but we omit domain as it does not change the overall story   event, modifying the DOM tree. As numerous events are
of this paper.                                                                  fired throughout loading the web page, frequent interactions



USENIX Association                                                                                31st USENIX Security Symposium         1009
 1   <html>
 2     <body onload=on_load()>                                                                                        1   <!-- embedded in http://example.com’s iframe -->
 3       <iframe src=""></iframe>                                                                                     2   <html>
 4       <script>                                                                                                     3     <body>
 5          function on_load() {                                                                                      4       <script>
 6            // Printing the cookie of http://example.com                                                            5         // Printing the cookie of http://subframe.com
 7            console.log(document.cookie)                                                                            6         console.log(document.cookie)
 8          }                                                                                                         7       </script>
 9          document.querySelector("iframe").src = "http://subframe.com"                                              8     </body>
10       </script>                                                                                                    9   </html>
11     </body>                                                                                                       10
12   </html>

                            (a) HTML served by http://example.com                                                                  (b) HTML served by http://subframe.com

                                                                                                                                         Document                                Document
      DOM Object                                                                                                                       Origin example.com                     Origin example.com
         Document                            Document                                     Document
       Origin example.com                  Origin example.com                           Origin example.com                      IFrame                Script           IFrame                Script
                                                                                                                                                  on_load(){}                            on_load(){}
           IFrame                    IFrame               Script                 IFrame                Script                 Document            src= “subframe     Document            src= “subframe
                                                                                                                            Origin subframe.com   ”                Origin subframe.com   ”
                                                      on_load(){}                                  on_load(){}
         Document                  Document           src=“subframe”           Document            src= “subframe
       Origin example.com        Origin example.com                          Origin subframe.com   ”                             Script                                 Script
                                                                                                                             console.log                            console.log


      1 Parse <html>             2 Parse example’s <script>                            3 Load <iframe>                      4 Parse subframe’s <script>              5 Trigger onload handler

                                                                       (c) Origin and DOM tree updates by a browser
                                                                Figure 1: An example of origin changes in the DOM tree


between the renderer and the JavaScript engine can occur.                                                           Once the browser fetches the HTML document from
Thus, the DOM tree is also accordingly kept being updated.                                                   http://example.com, it starts parsing it to construct the
   To enforce the same-origin policy, the browser keeps track                                                DOM tree (Figure 1c- 1 ) . The root element is document
of the origin as it constructs the DOM tree. Therefore, when                                                 (i.e., <html> tag), where its origin is initialized to
the browser executes the JavaScript code triggered by a certain                                              http://example.com. The document element has the iframe
event, it assures that the correct origin is provided. As this                                               element (i.e., <iframe> tag) as a child, and iframe is ini-
origin tracking process is vital in understanding this paper but                                             tialized to have another document as a child. This child
complex, we take the following simplified example, showing                                                   document’s origin is initialized to http://example.com, as
how the browser constructs the DOM tree and embeds the                                                       the HTML standard dictates that an origin of an empty
origin for a given HTML document.                                                                            iframe’s document inherits the parent document’s origin3 .
Terminology for Describing the DOM Tree.                In order                                                Next, when the renderer parses the <script> tag in
to easily describe how the browser internally maintains                                                      HTML (Figure 1c- 2 ), it adds the script element to the
the DOM tree as well as the associated origin, we denote                                                     DOM tree and invokes the JavaScript engine to execute
document to be the root element of the DOM tree2 . document                                                  the code in the script element. When executing, the
conceptually corresponds to the <html> tag, and it has an                                                    JavaScript engine obtains the origin for the script by travers-
additional property, origin, which stores the origin of the                                                  ing upward from the script element until locating any
document and thus represents the context of JavaScript exe-                                                  document, which is the origin of the root document (i.e.,
cution within the document. When explaining the DOM tree,                                                    http://example.com). The script’s execution sets the
we intentionally ignore all the HTML tags except <iframe>                                                    iframe source to http://subframe.com, which updates the
and <script> tags, as they are necessary to understand the                                                   child document in the DOM tree. This changes the origin of
origin mechanism in browsers.                                                                                the child document to http://subframe.com (Figure 1c- 3 ).
Example: The Life-Cycle of Origin.                       In this                                                Now the renderer starts parsing the new document fetched
example, we use two HTML documents; one is                                                                   from http://subframe.com, and it inserts another script ele-
fetched from http://example.com and another from                                                             ment to the iframe’s document (Figure 1c- 4 ). In turn, the ren-
http://subframe.com, where the former loads the lat-                                                         derer invokes the JavaScript engine to execute the correspond-
ter in its iframe (shown in Figure 1a and Figure 1b).                                                        ing script (line 6 on Figure 1b), which prints the document’s
http://subframe.com denotes a third-party site, that                                                         cookie. Here, the origin is specified as http://subframe.com
http://example.com may not have control of.                                                                  (referring to the origin of the iframe’s document), the cookie
                                                                                                             of http://subframe.com is printed.
    2 In real-world browser implementations, window is the top interface and

it has document and origin as its property. However, we regard them as the                                         3 It is worth noting that the HTML standard sets special rules in determin-

same entity for simplicity, as they have a one-to-one correspondence in most                                    ing the origin of the iframe (e.g., the sandbox attribute [38]), but we do not
cases.                                                                                                          consider them for simplicity.




1010        31st USENIX Security Symposium                                                                                                                                USENIX Association
                                1
                                               1   <script>
                                               2     if(!origin) {
                                               3       location.reload()
                                               4     }                                                    if(!origin)      if(!origin)
                                               5     else {                                                 reload()         reload()
                        2
                                               6       // Alerting the cookie of                          else             else
                                               7       // http://example.com                                alert()          alert()
                                               8       alert(document.cookie)
                            3                  9     }                                      1             2 3               4
                                                   </script>
        4
                                              10



                (a) Attack flow                          (b) Redirected script            (c) Origin and DOM tree updates by Firefox
                  Figure 2: A UXSS vulnerability in Firefox due to incorrect origins for data URLs (CVE-2017-5466).


   After that, as the page loading is completed (Figure 1c-              • 2 After the target page is loaded in the browser, a user
 5 ), the script function on_load() (line 5 on Figure 1a) is                clicks a link to navigate to the attacker’s page. Then the
invoked as it is registered as the onload handler. This function            browser would request a page from the attacker’s server.
prints the cookie of http://example.com, because the origin              • 3 Upon receiving the request, the attacker server responds
is provided to be the origin of the root document.                          with the Location header pointing to a data URL, which
                                                                            embeds the HTML as shown in Figure 2b. Then the
                                                                            browser performs the in-place redirection to the data URL,
3     Case Study on Previous UXSS Vulnerabili-                              which would execute the code in Figure 2b.
      ties                                                               • 4 When Firefox executes the JavaScript embedded in the
                                                                            data URL, the origin is null. As a result, the browser
This section analyzes two previous UXSS vulnerabilities in                  reloads the current page (line 3 in Figure 2b).
the two most-used browsers, Firefox and Chrome, respec-
                                                                            The problem occurs at 4 , in which the origin should still
tively. Through this analysis, we attempt to showcase how
                                                                         be null after reloading. However, the data URL page is
UXSS vulnerabilities occur and how the origin is related.
                                                                         incorrectly updated to the page’s origin before the initial redi-
                                                                         rection (i.e., http://example.com). Thus, when the script is
3.1    Incorrect Origin for Data URL                                     executed again after reloading, the attacker’s script would
                                                                         be executed on behalf of the target’s origin, allowing the at-
Origin of Data URL. The Location header is an HTTP re-                   tacker’s code to access the target’s cookie values illegally (line
sponse header, which redirects a current page to the specified           8 in Figure 2b). Firefox patched this UXSS vulnerability to
URL [40] if served with a 3xx redirection response.                      update to the correct null origin when reloading data URL
   One URL is a data URL (data:), which embeds the data                  pages.
within the URL. If the browser receives a data URL as a
redirection target, it loads the embedded data directly. One
unique aspect of this data URL is that the origin is null (i.e.,         3.2       Incorrect Origin for Unloaded Document
an opaque origin [65]) per the HTML standard, implying that
a data URL page has no origin and thus has no capability to             Origin of Unloaded Document. Upon handling various
access other pages’ resources.                                          navigation requests, a browser keeps unloading old docu-
CVE-2017-5466 in Firefox. The root cause of CVE-2017-                   ments and loading new documents. As such, the origin of old
5466 [36] is that Firefox incorrectly updates the origin if the         and new documents should accordingly be updated—i.e., the
page is redirected to a data URL and reloaded. Normally,                old (and new) document should have the origin of where the
even if the data URL page is reloaded, it should have a null            old (and new) document is fetched. From the DOM tree’s
origin. However, Firefox incorrectly updates the origin of              perspective, such loading and unloading would keep updat-
the reloaded data URL page to the origin of the document                ing references (i.e., updating edges), which may result in a
before loading the data URL page. As a result, an attacker              dangling sub-tree. The origin of a dangling sub-tree should
can execute their malicious JavaScript code on behalf of the            be invalidated and no longer updated.
origin before the redirection.                                          CVE-2015-1293 in Chrome. The vulnerability CVE-2015-
   The attack can be performed in the following steps as                1293 [8] occurs as Chrome references an incorrect origin for
illustrated in Figure 2:                                                an unloaded frame document. Due to this vulnerability, if
• 1 A user navigates to the target page (i.e.,                          a victim user visits the attacker’s page with the target site
   http://example.com), where the page has a link to                    embedded in an iframe, the attacker’s script can be executed
   the attacker-controlled page (i.e., http://attacker.com).            on behalf of the target’s origin (Figure 3a).



USENIX Association                                                                          31st USENIX Security Symposium               1011
                                                 1                                     1   <iframe></iframe>
                                                                                       2   <script>
                                                                                       3       var i = document.querySelector(’iframe’);
                                                                                       4       var f = frames[0].Function;
                                                                                       5       i.onload = function() {
                                      2
             <script>
              iframe.src=
              http://example.com
                                                                                       6         // Alerting the cookie of http://example.com
                                                                                       7         f("location.replace(’javascript:alert(document.cookie)’)")();
                                                                                       8       }
             <iframe>                                                                          i.src = ’http://example.com’;
                                            3
                                                                                       9
                                                                                    10     </script>
                                                  iframe


                            (a) Attack flow                                                                                               (b) PoC HTML

                                                              Document                       Event Handler                     Document                                                            Document
                                                           Origin attacker.com                                              Origin attacker.com             Event Handler                     Origin attacker.com
                                                                                              f(...)
    Document                                                                                                                                            1    f(...)
  Origin attacker.com       Event Handler             IFrame               Script                                     IFrame                Script                                       IFrame               Script
                            f(...)                                                           “dangling”
                                                                       i.onload=…                                                       i.onload=…                                                        i.onload=…
       IFrame                                        Document          src=“example”           Document             Document            src=“example”         Document                 Document           src=“example”
                                                Origin attacker.com                          Origin example.com   Origin example.com                        Origin example.com       Origin example.com
     Document
                                                                                                                                          “Create”                               2
  Origin attacker.com                                                                                                                                            Script                   Script
                                                                                                                                                             location.replace          alert()
                                                                                                                                                                                                     !
       1 Load                                   2 Run script                                                      3 Load iframe                                                      4 Onload Event

                                                                            (c) Origin and DOM tree updates by Chrome
                        Figure 3: A UXSS vulnerability in Chrome due to incorrect origins for unloaded documents (CVE-2015-1293).


  To demonstrate, an example of the attacker’s HTML and                                                              payload (i.e., ’alert(document.cookie)’) was executed in
how the DOM tree is updated is shown in Figure 3b and                                                                the target’s context, thereby reading the target’s cookies.
Figure 3c, respectively.
• 1 Upon receiving the attacker’s HTML, the browser cre-                                                             4       Design
  ates the root document and an empty document as a child
  of the iframe element. The origin of the root document is                                                          Now we present the design of the F UZZ O RIGIN. First,
  http://attacker.com, and the child document inherits the                                                           we introduce the overall design and workflow of
  origin of the root according to the HTML standard [64].                                                            F UZZ O RIGIN (§4.1). Next, we present the origin sanitizer,
• 2 The script tag is executed, which registers a load event                                                         which is designed to detect UXSS vulnerabilities (§4.2). As
  handler (line 3 to 8). This event handler is appended to the                                                       noted before, UXSS detection is challenging because it is a
  iframe.                                                                                                            semantic vulnerability, which requires interactive or naviga-
• 3 The script execution continues (line 9), which changes                                                           tion semantics among cross-origin pages. The origin sani-
  the source of the iframe to http://example.com (line 10).                                                          tizer addresses such a challenge by keeping track of origin
  As a result, the iframe’s document is replaced with the                                                            semantics as the DOM tree is updated. Then it checks if
  new document fetched from http://example.com, whose                                                                the origin semantics are correctly updated when executing
  origin is http://example.com. The incorrect origin update                                                          the script. Lastly, we describe how F UZZ O RIGIN generates
  happens here. For the old document to be unloaded (which                                                           HTML/JavaScript inputs to prioritize origin-update opera-
  is not really unloaded but left being dangled), Chrome                                                             tions, thereby effectively finding UXSS vulnerabilities (§4.3).
  should not have updated its origin. However, it incorrectly
  updated to the new origin, http://example.com.
• 4 When the new document finishes loading, it fires the                                                             4.1         Overview
  load event and invokes the event handler. The handler uses                                                         The overall design and workflow of F UZZ O RIGIN are illus-
  the Function constructor of the old document to execute                                                            trated in Figure 4. F UZZ O RIGIN generates random HTML
  the script in the context of the old document. The script                                                          files (embedding JavaScript), where the generation algorithm
  changes the location of the iframe to a JavaScript URL,                                                            is aware of the HTML/JavaScript grammar [2, 66] (marked
  which is equivalent to executing the script in the iframe’s                                                         1 ). When generating, F UZZ O RIGIN performs the follow-
  document.                                                                                                          ing two unique tasks: (i) F UZZ O RIGIN instruments addi-
   Normally, this should have been blocked per the same-                                                             tional check code to detect UXSS, which we call origin sani-
origin policy—i.e., the context of the old document, whose ori-                                                      tizer (§4.2); and (ii) F UZZ O RIGIN prioritizes origin-update
gin is http://attacker.com, cannot access the new iframe’s                                                           operations so as to increase the chance to trigger UXSS (§4.3).
document, whose origin is http://example.com. However,                                                               Then generated HTML files are deployed to a set of preconfig-
due to the incorrect origin update to the old document, the                                                          ured servers, in which each HTML is intended to navigate to



1012        31st USENIX Security Symposium                                                                                                                                              USENIX Association
                                                           Servers      HTML
                                                                       Sources
                                                                                                       Test Browsers
                                                            example
                                                                      1 2 3 4 5.htm…
                                                                                                                                       Detecting
        Instrument for     Prioritizing                                                                                                UXSS with
                                                                      a b c d e.htm…
        Origin Sanitizer   Origin Update                                                                      http://example.com       Origin Sniatizer
        (§4.2)             (§4.3)
                                               2                                              3                                    4   (§4.2)              UXSS
                                                                                                                                                          HTMLs




                                                              …
      FUZZORIGIN Generator 1                                 Web Servers                             FUZZORIGIN Fuzzer

                                           Figure 4: Overall design and workflow of F UZZ O RIGIN.


other HTMLs ( 2 ). Next, F UZZ O RIGIN runs a web browser                                         var _origin_fetch_ = 'http://example.com' ;
with one of the randomly picked server’s URL ( 3 ). As the                                        var _origin_exec_ = origin;
                                                                                                  if (check_origin_violation(_origin_fetch_,
browser loads the HTML, F UZZ O RIGIN’s origin sanitizer                                                                      _origin_exec_)) {
(which was instrumented before) constantly checks if UXSS                                           report_origin_violation();
                                                                                                  }
has occurred ( 4 ). If the UXSS is detected by the origin san-
itizer, then F UZZ O RIGIN reports such an HTML case as a
                                                                                                  <html>
UXSS vulnerability.                                                                                 <body onload=on_load()>
                                                                                                      <iframe src=""></iframe>
                                                                                                      <script>
4.2      Detecting UXSS with Origin Sanitizer                                                           “entry point”
                                                                                                        function on_load() {
                                                                                                          “entry point”
UXSS is a semantic vulnerability, which occurs if the browser                                             console.log(document.cookie)
incorrectly updates the origin in document when updating the                                            }
                                                                                                        document.querySelector("iframe").src =
DOM tree in response to various events. In order to detect                                                "http://subframe.com"
the UXSS vulnerability, we first clearly define the primitive                                         </script>
                                                                                                    </body>
security property for UXSS, origin violation as follows.                                          </html>

Definition: Origin violation. The origin when executing                                Figure 5: An example of Origin Sanitizer’s instrumentation, insert-
a script block (which we denote as originExec ) should be                              ing the check code to global and functional entry points.
the same as the origin initially assigned for the script block
when fetching the HTML document (which we denote
as originFetch ). We state that the script execution raises                            challenging task—e.g., the browsers still suffer from UXSS
origin violation if originExec and originFetch are different.                          vulnerabilities due to this challenge.
   Interpreting the previous UXSS vulnerabilities (described                              The core idea to trace originFetch is to statically tag
in §3.1 and §3.2) with the notion of the origin violation,                             originFetch within the script, which is not updated over the
originFetch is represented with the background color of                                entire life-cycle of rendering. In particular, F UZZ O RIGIN
script blocks (Figure 2c and Figure 3c). originExec fol-                               first determines originFetch for each HTML document to be
lows the origin of the document, the first parent document                             served to the browser. Because F UZZ O RIGIN controls the
of the to-be-executed script block. As such, both pre-                                 server URL along with its port to serve the HTML document,
vious UXSS vulnerabilities raise the origin violation as                               F UZZ O RIGIN can always determine originFetch for each gen-
originFetch (i.e., http://www.attacker.com) and originExec                             erated HTML. Then F UZZ O RIGIN tags originFetch inside
(i.e., http://example.com) are different, allowing attacker’s                          scripts, which declares a new variable having the originFetch
script to be executed on behalf of the target’s origin.                                string as value. This declaration is performed for every point
   Given this definition, the requirements for UXSS detection                          that the origin should be checked, which will be explained
would reduce down to the following three tasks: 1) how to                              later in this section.
keep track of originFetch until the point of script execution; 2)                         1   var _origin_fetch_ = ’http://example.com’;
how to retrieve originExec when executing the script; and 3)
how to faithfully check the differences between originFetch                               Therefore, although F UZZ O RIGIN does not explicitly trace
and originExec at all script execution points. In the following,                       the originFetch , this static origin tagging method allows
we describe how F UZZ O RIGIN handles each task in turn.                               F UZZ O RIGIN to obtain a correct originFetch depending on
Tracking originFetch with Static Tagging. When the                                     the JavaScript execution context.
browser fetches the HTML document, originFetch is deter-                               Retrieving originExec . It is quite simple to retrieve
mined and stored as a property in document. The goal here                              originExec , which can be done by reading the origin prop-
is then to keep track of originFetch until the point of script                         erty in JavaScript. This is because the browser implements
execution. Note that the tracking of originFetch is quite a                            the interface of the origin property so as to allow the script



USENIX Association                                                                                              31st USENIX Security Symposium                1013
code to check its origin of the execution at runtime. Note that    case study (§3), origin updates take place while perform-
this origin property is supported by most of modern web            ing cross-origin navigations such as loading, redirecting, or
browsers (including Chrome, Firefox, Edge, and Safari) as it       reloading. Then the origin violation occurs when executing
is dictated in the HTML standard [41].                             the script, which is triggered in response to events dispatched
Checking Origin Violation. Given the capability of ob-             by the navigation operations.
taining originFetch and originExec , now we describe how               To this end, the HTML generation of F UZZ O RIGIN is de-
F UZZ O RIGIN checks the origin violation. F UZZ O RIGIN           signed to meet the following two goals: i) raising cross-origin
checks the origin violation for all possible entry points of       navigation; and ii) chained navigation with event handlers.
script code execution. As described in §2.2, the browser ren-      Next, we describe how F UZZ O RIGIN meets each goal in turn.
derer executes the script in response to browser events, so        Raising Cross-Origin Navigation. A browser updates the
there can be multiple execution entry points within <script>.      origin as it navigates to a different, cross-origin web page.
These execution entry points include (i) a global entry point      Thus, in order to test as many navigation actions as possible in
(which is executed right after parsing the script tag), (ii)       the browser, the HTML generation of F UZZ O RIGIN considers
functional entry points (i.e., the renderer hands over the ex-     the following two things: 1) use various navigation APIs; and
ecution to a certain function), or (iii) dynamic entry points      2) specify cross-origin navigation targets.
evaluating string code (i.e., eval and Function in Figure 3b).         First, F UZZ O RIGIN generates HTML in consideration of
   For all possible entry points, F UZZ O RIGIN instruments        a complete list of navigation-relevant APIs (i.e., APInav ). Ta-
the code to check the violation (illustrated in Figure 5).         ble 1 shows the list of navigation APIs, which can be cate-
F UZZ O RIGIN first obtains originFetch , which is statically      gorized into the APIs with HTML attributes and ones with-
tagged before. Then it obtains originExec through access-          out HTML attributes. Navigation APIs using the HTML
ing the origin property. Then check_origin_violation()             attributes (i.e., href of the <a> tag, action of the form tag,
performs the origin violation check. It returns true if the        and src of the iframe tag) specify the target URL to be nav-
originFetch and originExec are different, implicating that         igated once triggered. As the navigation trigger for HTML
F UZZ O RIGIN detected UXSS. It returns false otherwise. One       attributes may vary (i.e., <href> requires a click action, and
exception is matching the null origin (i.e., an opaque origin).    form requires a submit action), F UZZ O RIGIN accordingly
Specifically, if originExec is null, F UZZ O RIGIN returns false   generates associated action-triggers with the JavaScript code.
even if two origins are different. This is because the null        It is worth noting that these HTML attributes can be statically
origin can be created during navigation (e.g., loading a data      generated (i.e., embedding HTML tags) or dynamically added
URL) and it has no capability to access pages other than pages     (i.e., inserting an element with the script execution), and thus
with the null origin.                                              F UZZ O RIGIN randomly alternates static and dynamic gener-
   If the violation is detected, F UZZ O RIGIN reports the vi-     ation cases.
olation. The report includes the point where the origin vi-            Navigation APIs without HTML attributes can be invoked
olation is raised as well as the stack trace of the violation.     through JavaScript, which includes history (i.e., moving for-
F UZZ O RIGIN also includes all the generated HTML files and       ward, backward, or replacing the history state), location (i.e.,
server setups, which allows users of F UZZ O RIGIN to repro-       replacing or loading the current location), or opening the
duce a discovered UXSS vulnerability if needed.                    window.
   It is worth noting that while the instrumentation for global        Second, when invoking navigation APIs, F UZZ O RIGIN
and functional entry points seem straight-forward, one for         specifies various cross-origin navigation targets. It is worth
dynamic entry points may seem unclear. However, since              noting that the following three navigation APIs do not take
F UZZ O RIGIN generates HTML with its complete abstract            the target URL to be navigated, as it does not need to. For in-
syntax tree, F UZZ O RIGIN can always locate the dynamic           stance, history.forward and history.backward navigate to
entry points. Once located, F UZZ O RIGIN prepends the serial-     forward and backward, respectively, and location.reload()
ized string of the origin-violation checking code right before     reloads the current page. If the navigation APIs take the
the original string to be evaluated.                               target URL, F UZZ O RIGIN randomly selects a URL from a
                                                                   prepared pool of URLs. Such a URL pool is initialized with a
                                                                   preconfigured set of multiple web servers, where each server
4.3    Prioritizing Origin-Update Operations                       again includes multiple web pages. As a result, this pool
We observed that UXSS vulnerabilities occur due to incor-          setup allows F UZZ O RIGIN to test cross-origin navigation of
rect origin updates in the DOM tree (§3). Based on this ob-        browsers.
servation, F UZZ O RIGIN attempts to prioritize origin-update      Chained Navigation with Event Handlers. Once naviga-
relevant operations when generating HTML inputs. The idea          tion APIs are invoked, the navigation actions are performed
behind prioritizing origin-update operations is in performing      by the browser, which in turn fires navigation events. In par-
more frequent navigation operations while handling associ-         ticular, the browser fires a specific set of events associated
ated events. Revisiting previous UXSS vulnerabilities in the       with each navigation API (listed in Table 1).



1014    31st USENIX Security Symposium                                                                      USENIX Association
          Navigation APIs (APInav )          Type        Generation      Target URL   Triggering Action           Dispatched Events (Eventnav )
 a.href=URL                                Attribute   HTML/JavaScript       O              Click         beforeunload, unload, DOMContentLoaded, load
 form.action=URL                           Attribute   HTML/JavaScript       O             Submit         beforeunload, unload, DOMContentLoaded, load
 iframe.src=URL                            Attribute   HTML/JavaScript       O                -                     DOMContentLoaded, load
 history.forward()                         Method         JavaScript         X                -           beforeunload, unload, DOMContentLoaded, load
 history.backward()                        Method         JavaScript         X                -           beforeunload, unload, DOMContentLoaded, load
 history.replaceState(state, title, URL)   Method         JavaScript         O                -           beforeunload, unload, DOMContentLoaded, load
 location.replace(URL)                     Method         JavaScript         O                -           beforeunload, unload, DOMContentLoaded, load
 location.reload()                         Method         JavaScript         X                -           beforeunload, unload, DOMContentLoaded, load
 window.open(URL)                          Method         JavaScript         O                -           beforeunload, unload, DOMContentLoaded, load

Table 1: A list of navigation APIs (i.e., APInav ). The column ‘Generation‘ represents if APInav can be used as an HTML tag or invoked using
JavaScript. The column on ‘Target URL‘ shows if the APInav takes the target URL parameter or not. The column on ‘Triggering Action‘
denotes an extra action required to trigger a navigation behavior of APInav . The column on ‘Firing Event‘ shows a list of events fired by the
corresponding APInav . Note the beforeunload and unload event of window.open(URL) is dispatched when an existing window is reused.


   As such, F UZZ O RIGIN randomly registers multiple event                  5    Implementation
handlers associated with navigation APIs. The events
beforeunload and unload are dispatched before and after                      We implemented F UZZ O RIGIN, which is able to test
unloading the page. The event load and DOMContentLoaded                      most modern web browsers, Chrome, Firefox, Safari,
are dispatched when loading is completed. F UZZ O RIGIN de-                  and Edge. In terms of the implementation complex-
fines these four events as Eventnav and uses those to handle                 ity, F UZZ O RIGIN is implemented in about 9k lines of
navigation events.                                                           Python code. (3.5k LoCs are HTML and Javascript gen-
                                                                             eration, and 2.5k LoCs are for browser testing frame-
                                                                             works.) F UZZ O RIGIN is open-source and available at
   Within each event handler, F UZZ O RIGIN then randomly                    https://github.com/compsec-snu/fuzzorigin.
invokes another navigation APIs so as to chain the navigation
                                                                             Origin Sanitizer and HTML Generator.             To generate
behaviors. This chaining makes the browser keep navigating
                                                                             HTML and CSS, we used Domato [12] which is a state-of-the-
through cross-origin web pages under various circumstances,
                                                                             art generation-based DOM fuzzer. For JavaScript, we imple-
further extending the testing coverage towards browser’s ori-
                                                                             mented our own JavaScript generator for F UZZ O RIGIN simi-
gin update logic.
                                                                             lar to Fuzzil [14]. In order to generate syntactically and se-
                                                                             mantically correct JavaScript, we defined JavaScript grammar
   It is worth noting that always invoking APInav and regis-                 (e.g., for, if, function statement) and DOM API (e.g., docu-
tering Eventnav would not lead to UXSS conditions. This is                   ment.createElement()) as Python classes. However, it is an
because the browser may not perform meaningful operations                    open and challenging problem to generate HTML/JavaScript
only with these APIs and events. Therefore, F UZZ O RIGIN                    covering entire HTML/JavaScript grammars, and we will dis-
provides WEIGHTED_RAND (Algorithm 2) as a configuration pa-                  cuss it in §7. The origin sanitizer of F UZZ O RIGIN is also
rameter, balancing the API invocation (i.e., between APInav                  implemented in Python within the JavaScript generator.
and non-APInav ) as well as the event registration (i.e., between            Browser Testing Framework. In order to perform auto-
Eventnav and non-Eventnav ). Specifically, if WEIGHTED_RAND                  mated browser testing, we used Python selenium library and
is zero, all possible APIs (including APInav ) and all possible              WebDriver. By using the WebDriver, F UZZ O RIGIN can check
events (including Eventnav ) will be invoked and registered, re-             the violation report of the origin sanitizer without browser
spectively. In this configuration setup, F UZZ O RIGIN does not              modification. The testing servers are implemented using
prioritize the chained-navigation. The number of all possible                the Python flask library, and are created and managed with
APIs can vary depending on the number of DOM instances/pa-                   Docker to handle a large number of servers.
rameters/methods, but it is mostly over 600 APIs. The number
of all possible events is 89. If WEIGHTED_RAND is one, on the
                                                                             6    Evaluation
contrary, only APInav and Eventnav will be invoked and regis-
tered, respectively. In this configuration, F UZZ O RIGIN maxi-              This section attempts to evaluate F UZZ O RIGIN with the fol-
mizes the prioritization using nine APInav and four Eventnav .               lowing focuses:
                                                                             • Performance of the origin sanitizer to detect UXSS, in
  To   generate HTML, F UZZ O RIGIN focuses on                                 terms of detection accuracy overhead (§6.1)
new function, new eventhandler and web APIs. We                              • Effectiveness of chained-navigation with event handling to
present the detailed algorithm of HTML generation in                           prioritize origin update operations (§6.2)
Appendix A for reference.                                                    • New vulnerabilities discovered by F UZZ O RIGIN. (§6.3)



USENIX Association                                                                                  31st USENIX Security Symposium                1015
                                                                                                                                                                                                 Number of unique event handling
Experimental Setup. We ran F UZZ O RIGIN on Intel Xeon                                                       660                                                                                                                   60
                                                                                                                                                         Chrome                                                                                                            Chrome
Silver 4214R (24 cores) with 512 GB RAM. We prepared five




                                                                                      Number of navigation
                                                                                                                                                         Firefox                                                                                                           Firefox
web servers (i.e., five origins) and 10 HTML files for each                                                  440                                                                                                                   40
server, totaling 50 HTMLs for a fuzzing iteration.
   In order to comprehensively evaluate F UZZ O RIGIN’s effec-                                               220                                                                                                                   20
                                                                                                                       144.0                                                                                                                        11.0
tiveness, we compared F UZZ O RIGIN with Domato [12], and                                                                      48.5
                                                                                                                                                      9.0 3.0
                                                                                                                                                                                                                                              7.0          5.0 5.0     5.0 5.0
                                                                                                               0                         3.0 3.0                                                                                       0
Freedom [67], which are state-of-the-art DOM fuzzers. Since                                                           FuzzOrigin Freedom             Domato                                                                                 FuzzOrigin Freedom        Domato
                                                                                                                                        Scheme                                                                                                             Scheme
Domato and Freedom cannot detect UXSS and thus cannot
keep track of origin changes, we incorporated F UZZ O RIGIN’s                                                           (a) Navigation                                                                                      (b) Unique event handling
origin sanitizer to those for fair comparison.                       Figure 6: The number of navigation completion and unique event
                                                                     handling for a single fuzzing iteration by each scheme. In both cases,
                                                                     F UZZ O RIGIN achieved the highest number.
6.1     Performance of Origin Sanitizer




                                                                                                                                                                   Number of unique event handling
UXSS Detection Accuracy.            F UZZ O RIGIN uses tagged
                                                                                                                                                                                                     35                                                                          >50
origin (i.e., originFetch ) as an oracle to compare with the




                                                                                                                                                                                                                                                                                      Number of origin change
                                                                                                90                                                   Chrome




                                                                      Number of origin change
                                                                                                                                                                                                     30
                                                                                                                                                     Firefox
originExec . Thus, there are no false positive cases (i.e., origin                                                                                                                                   25
sanitizer detects an origin violation but it was not a UXSS vul-                                60                                                                                                   20                                                                          25
                                                                                                                                                                                                     15
nerability), unless the tagged origin is incorrectly determined.                                                                                                                                     10
                                                                                                30
As the originFetch can always be determined when generating                                                         11.0 10.0
                                                                                                                                                                                                      5
the HTML file, we argue that F UZZ O RIGIN’s origin sanitizer                                                                         2.0 1.0      4.0 3.0                                            0                                                                          0
                                                                                                     0                                                                                                                             0        100      200    300      400
                                                                                                                   FuzzOrigin Freedom              Domato
is free from false positives. This argument can be indirectly                                                                         Scheme                                                                                                Number of navigation
supported by our evaluation experiences over six months of                                                         (a) Origin change                                                                                                       (b) Data scatter map
running F UZZ O RIGIN, because we were not able to find any
origin violation report other than the four cases we reported        Figure 7: The number of origin updates per each fuzzing run, and
                                                                     the scatter map showing the impacts of navigation and event handling
and confirmed. All the reported four vulnerabilities were
                                                                     behaviors to origin changes.
confirmed and we could not find any false-positive cases.
Runtime Detection Overhead. In order to analyze the
performance overhead of origin sanitizer, we measured the            plot in Figure 6a for F UZZ O RIGIN, Freedom, and Domato.
execution time and the invocation number of the origin com-          F UZZ O RIGIN achieves the highest median in comparison to
parisons per each fuzzing iteration. The average execution           Freedom and Domato.
time per one origin comparison was 0.0098 ms, and a single
                                                                     Event Handler. We measured the number of event handlers
fuzzing iteration has invoked 219.58 origin comparisons on
                                                                     directly. Figure 6b describes the number of unique calls to the
average. Consequently, origin sanitizer uses 2.16 ms for the
                                                                     event handler. Compared to Freedom, F UZZ O RIGIN made
origin comparisons in each fuzzing iteration, which is 0.11%
                                                                     1.2 times more unique event handler calls in Chrome and
of the total execution time (i.e., 2.00 s). Considering that
                                                                     2.2 times more in Firefox. Freedom and Domino use a fixed
the network latency for fetching the HTML file is usually
                                                                     number of event handlers and execute that only once. On the
around 100 ms, the 2.16 ms overhead per a fuzzing iteration
                                                                     other hand, F UZZ O RIGIN not only executes all event handlers
is reasonable.
                                                                     that are called, but also has a higher number of unique event
                                                                     handlers than the other two schemes.
6.2     Effectiveness of Chained-Navigation
F UZZ O RIGIN created HTML in the direction of using navi-           6.2.2                                          Origin-Update
gation and event handler many times to find UXSS vulnera-
bilities. In this respect, we analyze whether the navigation         Execution Origin-Update. We measured origin-update by
and event handler calls were frequently triggered as intended.       originExec to evaluate F UZZ O RIGIN. Figure 7a is the result
And we analyze originExec updating count in the browser to           of originExec changing. F UZZ O RIGIN recorded the largest
find which of the navigation or event is more important in           number of origin-update. The results are almost similar to
influencing the origin-update.                                       those of navigation, but the difference is significantly reduced.
                                                                     However, this value is still the largest value and shows that
                                                                     the originExec is sufficiently changed through navigation and
6.2.1   Navigation and Event Handler
                                                                     event handler as originally intended by F UZZ O RIGIN.
Navigation. We measured the number of navigations using              Correlation with Navigation & Event Handler. Figure 7b
how many requests were received by the servers. The empir-           shows the overall data patterns. The X-axis represents the
ical distribution of navigation counts is presented as a box         number of triggered navigations and the Y-axis represents the



1016    31st USENIX Security Symposium                                                                                                                                                                                                              USENIX Association
          Variable                       Firefox              Chrome         very long time for F UZZ O RIGIN to randomly generate the
         (Intercept)                 -1.800* (0.479)       -0.502 (0.394)    exploitation code, we conducted this experiment by turning
         Navigation                   1.338* (0.029)       1.329* (0.036)    F UZZ O RIGIN into a mutation-based fuzzer with following
        Event Handler                 0.025* (0.002)       0.020* (0.002)    two rules: i) an initial HTML template per known CVE is
         R-squared                        0.733                0.671
                                                                             provided to F UZZ O RIGIN, where the template is the known
Table 2: Result of Poisson regression. R2 represents that overall            PoC HTML where its JavaScript APIs have been wiped out,
regression was statistically significant. Navigation and event handler       and ii) given the template, F UZZ O RIGIN keeps replacing
are significant predictors in both Firefox and Chrome. (Standard             wiped out entries with APIs according to WEIGHTED_RAND.
errors are reported in parentheses. * indicates significance at the             Figure 8 shows an elapsed time in average to find seven
99% level.)
                                                                             UXSS cases while varying weight value. F UZZ O RIGIN took
                                                                             the shorted time when WEIGHTED_RAND is 0.2 (i.e., 20%).
                     24                                                      Compared to the case that origin-update prioritization is not
                                                  Fail Fail Fail Fail Fail
                     22                      21h15m                          used at all and all the APIs were randomly selected (i.e.,
                     20              19h27m20h                               WEIGHTED_RAND is zero), F UZZ O RIGIN was 3 hours and 45
                                                                             minutes faster when WEIGHTED_RAND is 0.2. On the contrary,
          Time (h)




                     18 17h
                                                                             compared to the case that F UZZ O RIGIN always uses either
                     16                                                      APInav and Eventnav (i.e., WEIGHTED_RAND is 1), F UZZ O RIGIN
                     14     13h34m                                           failed to find any CVEs for the given 24 hours. This is be-
                     12         13h15m                                       cause if F UZZ O RIGIN generates too many APInav , navigation
                     10                                                      operations are performed even before any meaningful API se-
                          0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0        quences are constructed. To summarize, these results suggest
                                             Weight
                                                                             that chained-navigation indeed helps F UZZ O RIGIN to find
Figure 8: An elapsed time in average to detect seven previously              UXSS vulnerabilities if a right balance between origin-update
known CVEs while varying WEIGHTED_RAND. When WEIGHTED_RAND                   APIs and normal APIs were given. While finding an optimal
is higher than 0.6, no CVEs were found within 24 hours of running.           balance would also be important for F UZZ O RIGIN, we leave
                                                                             this as a future work.
number of invoked unique event handlers. And the number of
origin-updates is shown as color. It can be seen that the color              6.3     New Vulnerabilities                     Discovered            by
of the point gets darker as the distance from the x-axis and                         F UZZ O RIGIN
y-axis increases.
   We analyze correlation more deeply with Poisson regres-                   We ran F UZZ O RIGIN about six months to test and find UXSS
sion to which of them is more important between navigation                   vulnerabilities. During the evaluation, F UZZ O RIGIN found
and event handler. Table 2 is the result of the fitted regression            four new vulnerabilities in total (Figure 9). F UZZ O RIGIN
model. R2 was 0.733 and 0.671 which indicates the overall                    found two vulnerabilities that could run UXSS by changing
regression was statistically significant. The event handler is               the port in Chrome (i.e., Issue #1280083)4 5 and Firefox (i.e.,
a statistically significant predictor (with coefficients 0.025               Issue #1741327). Both vulnerabilities have different PoCs,
and 0.020) in both Firefox and Chrome Navigation was also                    but we suspect the root causes are in document.domain. More-
reported to be significant (with coefficients 1.338 and 1.329)               over, F UZZ O RIGIN found two vulnerabilities in Firefox, one
in both browsers.                                                            of which is classified as a high-impact security vulnerabil-
   In summary, to increase origin-update, both navigation and                ity (i.e., CVE-2021-43536). Firefox has patched it and issued
event handlers were analyzed to be significant. The design of                a security advisory. Another one (i.e., Issue #1727480) is
F UZZ O RIGIN that generates HTML by combining navigation                    not patched yet due to low reproducibility. We note that this
and event handler is an effective strategy to make many origin               vulnerability was triggered due to F UZZ O RIGIN’s chained-
changes.                                                                     navigation fuzzing.
                                                                             Case Study: CVE-2021-43536. This vulnerability occurs
6.2.3   Detecting Previously Known UXSS                                      when the document loader fails to initialize due to an er-
                                                                             ror (e.g., a possible stack overflow in the case of our PoC).
In this experiment, we check if F UZZ O RIGIN is able to find
seven previously known UXSS vulnerabilities to show the                         4 Chromium-based browsers such as Edge are also vulnerable to this

effectiveness of chained-navigation. These include CVE-                      vulnerability.
                                                                                 5 After being confirmed, a Chromium developer commented that the
2016-1667, CVE-2016-1697, CVE-2016-1711, CVE-2016-
                                                                             reported Issue #1280083 is not UXSS because it requires a specific secu-
5204, CVE-2016-5207, CVE-2016-5208, and CVE-2017-                            rity relaxation. However, we think this still is UXSS as such relaxation is
5008, and all of these CVEs can be reproduced in a single                    quite common in practice–Google reported that 13% of web sites have such
Chrome binary (i.e., Chrome 52.0.2715). Since it takes a                     relaxation [52].




USENIX Association                                                                                 31st USENIX Security Symposium                1017
    Browser    Version       Bug ID              Description                                                                                                             Severity   Status
    Chrome     96.0.4664     Issue #1280083      document.domain used in parent and child causes the origin (port) change.                                               Low        Confirmed
               94.0b2        Issue #1741327      document.domain used in parent and child, causes script execution even if src of child window to the parent’s origin.   Serious    Confirmed
    Firefox                  Issue #1727480      History manipulation causes navigation to other pages on nsDocShell.                                                    Serious    Confirmed
               94.0b9
                             CVE-2021-43536      Under certain circumstances, asynchronous functions could have caused navigation to fail but expose the target URL.     High       Pached

                                                         Figure 9: A list of vulnerabilities found by F UZZ O RIGIN.


                                                                                                     Case Study: #1727480.         We will briefly explain issue
                                                       1 Load                                        #1727480 in the abstract since it has been confirmed but
                           http://attacker.com                                                       has not been fixed yet. nsDocShell [35] is responsible
                                                                   Attacker                          for loading and viewing of a document in Firefox. Is-
                                                                    Server
                    <script>                     2 Run                                               sue #1727480 is caused by origin confusion in nsDocShell
                    function foo(){}               script
                    location.replace()                                                               when navigating via history.back() and history.forward()
                    foo()
                                                                                                     inside iframe. Figure 11b is the snippet of the PoC
                                                    3 Load                                           code6 . http://attacker.com has two iframes embedding
                                                                    Target                           http://example.com (line 3) and creates a new iframe with
                                                                    Server                           an unload event handler (lines 9-11). The function payload
                                      (a) Attack flow
                                                                                                     (lines 5-8) will be triggered when the created iframe is un-
1    <script>
2        function foo () {                                                                           loaded. http://example.com has two APInav : history.back(),
3            console.log(document.cookie)                                                            and history.forward(). By some unknown cause, this caused
4            foo()
5        }                                                                                           the parent window to navigate to http://example.com. How-
6        location.replace("http://example.com")                                                      ever, the actual navigation did not take place, leaving the
7        foo()
8    </script>                                                                                       onload event handler to be executed in the context of
                                                                                                     http://example.com origin.
                              (b) Snippet of PoC HTML                                                Case Study: #1280083 and #1741327. These two were
                                                                                                     detected in Firefox and Chrome, respectively, but the pattern
                                                                                                     of PoC is similar. According to the MDN, document.domain
                                                                                                     is deprecated [37]. In particular, MDN warns that changing
                              Function foo(){                        Function foo(){                 the value of document.domain deletes port information, which
                                console.log()                          console.log()
                                foo()}
                              location.replace
                                                                       foo()}
                                                                     location.replace
                                                                                                     is dangerous from the security point of view. Since port
                              foo()                                  foo()                           information disappears, resources can be accessed from cross-
                                                                                                     origin with a different port. If certain conditions are met,
      1                       2                                     3                                XSS can also be performed with cross-origin by changing
                                                                                                     the port. For instance, in a shared hosting and cloud setup,
                         (c) Origin and DOM tree updates
                                                                                                     two different websites may share the same IP address but use
              Figure 10: New vulnerability: CVE-2021-43536.                                          different ports.


Figure 10b is the snippet of a PoC code6 . On the PoC code,                                          7      Discussion and Limitation
foo function (lines 2-5) calls itself (line 4). The location
is changed to http://example.com (line 6), and then foo                                              UXSS Detection without the Origin Sanitizer. There can
is called (line 7) while the page is loading. The function                                           be alternatives of the origin sanitizer to detect UXSS, but
foo is called recursively, causing the stack to fill up. If                                          these have its own limitations compared to the origin san-
this is just before the http://example.com, the document                                             itizer. One approach is to generate attacker’s HTML and
loader fails to initialize and only the origin is updated to                                         check whether the JavaScript is executed under the origin
http://example.com. Then, because the origin has changed,                                            of the victim. However, it cannot find a vulnerability that
the cookie of http://example.com is displayed (line 3).                                              requires to generate HTMLs of both attacker and victim, such
   This vulnerability could be only found with F UZZ O RIGIN,                                        as #1280083 and #1741327 found by F UZZ O RIGIN. An-
as it dynamically creates and calls the function, whereas most                                       other approach would be to have an attacker steal victim’s
DOM fuzzers rarely generate functions that is used as event                                          resources (e.g., cookie). However, this approach would have
handlers.                                                                                            following two issues. First, there would be false positives if
                                                                                                     the script is dynamically evaluated through eval(). In this
     6 The actual PoC code is much more complicated, but we simplified it to                         case, one cannot determine where the JavaScript is fetched
clearly show the root cause and attack flow.                                                         from and where it is executed. Second, the integrity of the



1018          31st USENIX Security Symposium                                                                                                                     USENIX Association
                                                                                                                    studies—e.g., tracking all originFetch is difficult due to the
                                                              1                                                     JavaScript dynamic interpretation (e.g., eval).
                                                                                                                    Non-deterministic Behaviors of the Browser. When ana-
                       <script>
                                                    2
                                                                                                                    lyzing the vulnerabilities F UZZ O RIGIN found, we observed
                        iframe.onunload=payload
                                                                                                                    that the non-deterministic behavior of the browser is related to
                                                        3                                                           UXSS. This is mainly due to the non-deterministic latency in
                       <iframe>
                           <script>
                            history.back()                    iframe                                                loading each page. Specifically, since F UZZ O RIGIN heavily
                                                    4
                            history.forward()

                                                                                                                    triggers navigation operations as well as associated events,
                                                                                                                    the order of page loading often becomes non-deterministic
                                            (a) Attack flow                                                         as well. This rendered the vulnerability reproduction diffi-
 1    <!-- http://attacker.com -->
 2    <body>                                                                                                        cult, so it is challenging to perform the detailed vulnerability
 3        <script>                                                                                                  analysis. For instance, the vulnerability #1727480 had quite
 4            function payload(){
 5                // Alerting the cookie of http://example.com                                                      a low reproducibility due to this issue. We think this is an
 6                alert(document.cookie)                                                                            interesting finding that the order of events or timings may
 7            }
 8            i = document.createElement(’iframe’);                                                                 impact the overall behaviors of browsers, which would be
 9            document.documentElement.appendChild(i);                                                              worth the further study, possibly from the fuzzing research
10            i.onunload = payload;
11        </script>                                                                                                 perspective.
12        <iframe src="http://example.com"></iframe>
13    </body>
                                                                                                                    Limitation of HTML Generation.                As the HTML/-
14                                                                                                                  JavaScript syntax is complex, the current implementation
15    <!-- http://example.com -->
16    <script>
                                                                                                                    of F UZZ O RIGIN to generate HTML is limited. We ob-
17        history.back();                                                                                           served that there are certain types of JavaScript code patterns
18        history.forward();
19    </script>
                                                                                                                    that the current F UZZ O RIGIN cannot generate–such as the
                                                                                                                    code pattern using the API of the JavaScript engine. Cur-
                                                                                                                    rently FuzzOrigin supports eval, setTimeout, new function,
                                  (b) Snippet of PoC HTML
                                                   “unload”                                 “navigation”
                                                                                                                    new eventhandler, and XMLHTTPRequest in JavaScript. In ad-
                   Document                                              Document
                Origin attacker.com                                   Origin example.com                            dition, all the tags and attributes of HTML are supported,
          IFrame                                            IFrame                   IFrame
                                                                                                                    and cross-origin loading is possible if they have an src at-
                                   Script
                               i.onunload=…
                                                                                                                    tribute. However, F UZZ O RIGIN cannot certain code patterns
        Document                                        Document                   Document                         using the API of the JavaScript engine, such as prototype,
     Origin attacker.com                            Origin attacker.com         Origin example.com

       Event Handler                                    Event Handler                 Script
                                                                                                                    promise, and arrow function. F UZZ O RIGIN cannot cover
                                                                                                                    other resources (e.g., browser extensions and bookmark fea-
                                                                                                     “navigation”




                                                                                 history.back
       alert()                                          alert()           !      history.forward
                                                                                                                    tures), which can trigger UXSS vulnerabilities. Covering
               1    2 Run Script                                  3      4 Run Script                               all complex HTML/JavaScript code patterns and resources
                             (c) Origin and DOM tree updates
                                                                                                                    would definitely help F UZZ O RIGIN’s UXSS detection capa-
                                                                                                                    bility, and we leave this task as a future work.
                    Figure 11: New vulnerability: #1727480.

                                                                                                                    8   Related work
victim’s token value has to be ensured, but as F UZZ O RIGIN
dynamically generates the JavaScript, such integrity can be                                                         Universal Cross-site Scripting (UXSS). There have been
violated at runtime. One may be able to fix this issue by                                                           few studies related to the UXSS vulnerabilities. Barth et
restricting the JavaScript random generation process, which                                                         al. [4] identified cross-origin JavaScript capability leaks and
will need a further study.                                                                                          proposed an algorithm which monitors the points-to rela-
UXSS Mitigation with the Origin Sanitizer.               While                                                      tion of the JavaScript heap for detecting such vulnerabilities.
F UZZ O RIGIN leveraged the origin sanitizer for UXSS                                                               However, this approach cannot be applied to detect the UXSS
fuzzing, we think it has potential to be used to prevent UXSS                                                       vulnerabilities caused by incorrect origin checks—the major
attacks in web browsers. Most browsers manage origins ac-                                                           reason of UXSS vulnerabilities. Recently, Moroz et al. [31]
cording to the HTML specification [65], but it is extremely                                                         analyzed the bugs in the Chrome browser which lead to the
challenging to implement all of those correctly. The ori-                                                           UXSS vulnerabilities. Compared to these, F UZZ O RIGIN is
gin related policies are already complex, involving various                                                         the first, automatic framework to find the UXSS vulnerabili-
corner-cases, and thus modern browsers still have critical                                                          ties.
UXSS vulnerabilities. Employing F UZZ O RIGIN’s origin san-                                                            While not directly focusing on UXSS, there were several
itizer would help to address this issue, but that would still                                                       previous works discussing security issues highly related to
entail additional research challenges which require further                                                         UXSS. These include the same-origin policy (SOP) [54],



USENIX Association                                                                                                                     31st USENIX Security Symposium         1019
cookies [5, 9–11, 57, 70], and cross-origin resource sharing        9    Conclusion
(CORS) [6, 29]. Schewenk et al. [54] developed a compre-
hensive testing framework to test SOP for DOM tree accesses.        Universal cross-site scripting (UXSS) is a critical vulnerabil-
Franken et al. [11] evaluated the access policies for third-party   ity in web browsers, allowing attackers to execute a malicious
cookies to prevent cross-site attacks or third-party tracking.      script on behalf of pages that should not be accessible to at-
Drakonakis et al. [9] conducted the study of cookie-based           tackers. This paper presented F UZZ O RIGIN, the first UXSS
account hijacking in the wild. However, none of these tech-         fuzzing framework. It proposes a new UXSS detector, the
niques was applicable to find the UXSS vulnerabilities.             origin sanitizer, as well as a new UXSS-focused HTML gener-
                                                                    ation method. During the evaluation, F UZZ O RIGIN identified
Browser Fuzzing.       F UZZ O RIGIN performs the HTML              four new UXSS vulnerabilities, demonstrating its effective-
fuzzing to find UXSS, a semantic vulnerability in browsers.         ness in finding UXSS issues.
However, most previous works performing similar HTML
fuzzing and JavaScript engine fuzzing are designed to find
memory bugs. As such, these focused on testing DOM con-             10     Acknowledgment
struction and modification routines of browsers, which are
well-known memory bug sources.                                      We thank anonymous reviewers and the shepherd Sooel Son,
   Most existing DOM fuzzers [12, 32–34, 69] have taken the         for insightful comments, which significantly helped to im-
generation-based fuzzing approach. Cross-fuzz [69] gener-           prove this paper. This work was supported by Institute for
ates an extremely long-winding sequence of DOM operations           Information & communications Technology Promotion (IITP)
and creates circular references to stress the browser’s mem-        grant funded by the Korea government (MSIP) (No.2020-0-
ory management. Domato [12] is a state-of-the-art fuzzer            01840, Analysis on technique of accessing and acquiring user
which generates grammatically correct HTML documents                data in smartphone). This work was supported by National
based on predefined grammar files to test Chrome browser.           Research Foundation (NRF) of Korea grant funded by the
Dharma [33] and Avalanche [32] generated inputs based on            Korean government MSIT (NRF-2019R1C1C1006095). The
the context-free grammars provided by Mozilla. Recently,            Institute of Engineering Research (IOER) and Automation
Freedom [67] introduced an approach to efficiently generate         and Systems Research Institute (ASRI) at Seoul National
HTML by relying on a context-aware intermediate represen-           University provided research facilities for this work.
tation. Freedom [67] stated that the coverage feedback is not
helpful to find more bugs.                                          References
   Previous works for JavaScript Engine fuzzing [14, 17,             [1] Webkit2. https://trac.webkit.org/wiki/WebKit2 (visited on January 30,
24, 47] have focused on generating semantically correct                  2022).
JavaScript. Montage [24] and DIE [47] leveraged abstract
syntax trees (ASTs) for mutation. CodeAlchemist [17] pro-            [2] ECMAScript         2022     Language        Specification,      2022.
                                                                         https://tc39.es/ecma262.
posed semantic-aware assembly, and Fuzzil [14] designed
intermediate representation (IR) to build syntactically and          [3] A. Alhuzali, R. Gjomemo, B. Eshete, and V. Venkatakrishnan.
semantically correct test cases.                                         {NAVEX}: Precise and scalable exploit generation for dynamic web
                                                                         applications. In 27th {USENIX} Security Symposium ({USENIX}
Fuzzing for Semantic Vulnerabilities. There were previ-                  Security 18), pages 377–392, 2018.
ous works which fuzzing techniques to find semantic bugs. To
find the semantic bugs, many studies [7, 15, 19, 21, 50, 63, 68]     [4] A. Barth, J. Weinberger, and D. Song. Cross-origin javascript capabil-
                                                                         ity leaks: Detection, exploitation, and defense. In USENIX security
leveraged differential testing techniques. Nezha [50] pro-               symposium, pages 187–198, 2009.
posed an efficient input-format-agnostic differential testing
framework to trigger semantic bugs. TCP-Fuzz [71] used               [5] A. Cahn, S. Alfeld, P. Barford, and S. Muthukrishnan. An empiri-
differential testing to detect memory and semantic bugs in               cal study of web cookies. In Proceedings of the 25th international
                                                                         conference on world wide web, pages 891–901, 2016.
TCP stacks.
   In addition to fuzzing traditional software, several frame-       [6] J. Chen, J. Jiang, H. Duan, T. Wan, S. Chen, V. Paxson, and M. Yang.
works that conduct fuzz testing on new targets have been                 We still donâĂŹt have secure cross-domain requests: an empirical
                                                                         study of {CORS}. In 27th {USENIX} Security Symposium ({USENIX}
introduced. Deepxplore [48] is the whitebox framework to                 Security 18), pages 1079–1093, 2018.
systematically test real-world DL systems. DiFuzzRTL [18]
detects semantic bugs in CPU by comparing the execution              [7] Y. Chen, T. Su, and Z. Su. Deep differential testing of jvm implemen-
results of ISA and RTL simulation. Along the line of the                 tations. In 2019 IEEE/ACM 41st International Conference on Software
                                                                         Engineering (ICSE), pages 1257–1268. IEEE, 2019.
previous semantic fuzzing research, F UZZ O RIGIN introduces
a new type of semantic fuzzing technique, focusing on UXSS           [8] Chromium.                       Issue       524074,         2015.
vulnerabilities.                                                         https://bugs.chromium.org/p/chromium/issues/detail?id=524074.




1020    31st USENIX Security Symposium                                                                               USENIX Association
 [9] K. Drakonakis, S. Ioannidis, and J. Polakis. The cookie hunter: Au-        [26] S. Lekies, B. Stock, and M. Johns. A tale of the weaknesses of current
     tomated black-box auditing for web authentication and authorization             client-side xss filtering. BlackHat USA, 2014.
     flaws. In Proceedings of the 2020 ACM SIGSAC Conference on Com-
     puter and Communications Security, pages 1953–1970, 2020.                  [27] M. Liu, B. Zhang, W. Chen, and X. Zhang. A survey of exploitation
                                                                                     and detection methods of xss vulnerabilities. IEEE Access, 7:182004–
[10] S. Englehardt, D. Reisman, C. Eubank, P. Zimmerman, J. Mayer,                   182016, 2019.
     A. Narayanan, and E. W. Felten. Cookies that give you away: The
     surveillance implications of web tracking. In Proceedings of the 24th      [28] M. C. Martin and M. S. Lam. Automatic generation of xss and sql in-
     International Conference on World Wide Web, pages 289–299, 2015.                jection attacks with goal-directed model checking. In USENIX Security
                                                                                     symposium, pages 31–44, 2008.
[11] G. Franken, T. Van Goethem, and W. Joosen. Who left open the cookie
     jar? a comprehensive evaluation of third-party cookie policies. In         [29] G. Meiser, P. Laperdrix, and B. Stock. Careful who you trust: Studying
     27th {USENIX} Security Symposium ({USENIX} Security 18), pages                  the pitfalls of cross-origin communication. In Proceedings of the 2021
     151–168, 2018.                                                                  ACM Asia Conference on Computer and Communications Security,
                                                                                     pages 110–122, 2021.
[12] I. Fratric. Domato. https://github.com/googleprojectzero/domato (vis-
     ited on November 15, 2021).                                                [30] W. Melicher, A. Das, M. Sharif, L. Bauer, and L. Jia. Riding out
                                                                                     domsday: Towards detecting and preventing dom cross-site scripting.
[13] A. Gakhokidze and N. Kochar. Introducing Site Isolation in Firefox,             In 2018 Network and Distributed System Security Symposium (NDSS),
     2021. https://blog.mozilla.org/security/2021/05/18/introducing-site-            2018.
     isolation-in-firefox/.
                                                                                [31] M. Moroz and S. Glazunov. Analysis of uxss exploits and mitigations
[14] S. Groß. Fuzzil: Coverage guided fuzzing for javascript engines.                in chromium. Technical report, 2019.
     Department of Informatics, Karlsruhe Institute of Technology, 2018.
                                                                                [32] Mozilla. Avalanche, . https://github.com/MozillaSecurity/avalanche
[15] J. Guo, Y. Jiang, Y. Zhao, Q. Chen, and J. Sun. Dlfuzz: Differential
                                                                                     (visited on January 9, 2022).
     fuzzing testing of deep learning systems. In Proceedings of the 2018
     26th ACM Joint Meeting on European Software Engineering Confer-            [33] Mozilla. Dharma, . https://github.com/MozillaSecurity/dharma (visited
     ence and Symposium on the Foundations of Software Engineering,                  on November 15, 2021).
     pages 739–743, 2018.
                                                                                [34] Mozilla. DOMFuzz, . https://github.com/MozillaSecurity/domfuzz
[16] N.     Guyen.              The    Best     Firefox      Ever,      2017.        (visited on November 15, 2021).
     https://blog.mozilla.org/en/products/firefox/faster-better-firefox/.
                                                                                [35] Mozilla.               Embedding,       .            https://www-
[17] H. Han, D. Oh, and S. K. Cha. Codealchemist: Semantics-aware code
                                                                                     archive.mozilla.org/projects/embedding/webbrowser.html/.
     generation to find vulnerabilities in javascript engines. In NDSS, 2019.

[18] J. Hur, S. Song, D. Kwon, E. Baek, J. Kim, and B. Lee. Difuzzrtl:          [36] Mozilla. Bugzilla 1353975, 2017. https://bugzilla.mozilla.org/show_-
     Differential fuzz testing to find cpu bugs. In 2021 IEEE Symposium on           bug.cgi?id=1353975.
     Security and Privacy (SP), pages 1286–1303. IEEE, 2021.
                                                                                [37] Mozilla. Document.domain, 2021. https://developer.mozilla.org/en-
[19] B. Jabiyev, S. Sprecher, K. Onarlioglu, and E. Kirda. T-reqs: Http              US/docs/Web/API/Document/domain.
     request smuggling with differential fuzzing. In Proceedings of the 2021
                                                                                [38] Mozilla.    Iframe, 2021.     https://developer.mozilla.org/en-
     ACM SIGSAC Conference on Computer and Communications Security,
                                                                                     US/docs/Web/HTML/Element/iframe.
     pages 1805–1820, 2021.

[20] A. Kieyzun, P. J. Guo, K. Jayaraman, and M. D. Ernst. Automatic            [39] Mozilla.   JavaScript, 2021.          https://developer.mozilla.org/en-
     creation of sql injection and cross-site scripting attacks. In 2009 IEEE        US/docs/Web/JavaScript.
     31st international conference on software engineering, pages 199–209.
                                                                                [40] Mozilla.   Location, 2021.     https://developer.mozilla.org/en-
     IEEE, 2009.
                                                                                     US/docs/Web/HTTP/Headers/Location.
[21] S. Kim, M. Xu, S. Kashyap, J. Yoon, W. Xu, and T. Kim. Finding
                                                                                [41] Mozilla.    Origin, 2021.             https://developer.mozilla.org/en-
     semantic bugs in file systems with an extensible fuzzing framework.
                                                                                     US/docs/Web/API/origin.
     In Proceedings of the 27th ACM Symposium on Operating Systems
     Principles, pages 147–161, 2019.                                           [42] Mozilla. Same-origin policy, 2021. https://developer.mozilla.org/en-
[22] P. Kocher, J. Horn, A. Fogh, D. Genkin, D. Gruss, W. Haas, M. Ham-              US/docs/Web/Security/Same-origin_policy.
     burg, M. Lipp, S. Mangard, T. Prescher, et al. Spectre attacks: Exploit-
                                                                                [43] Mozilla. WebAssembly, 2021.           https://developer.mozilla.org/en-
     ing speculative execution. In 2019 IEEE Symposium on Security and
                                                                                     US/docs/WebAssembly.
     Privacy (SP), pages 1–19. IEEE, 2019.
                                                                                [44] Y. Nadji, P. Saxena, and D. Song. Document structure integrity: A
[23] V. Kumar.            $20000 Facebook DOM XSS, 2020.
                                                                                     robust basis for cross-site scripting defense. In NDSS, volume 20, 2009.
     https://vinothkumar.me/20000-facebook-dom-xss/ (visited on
     January 30, 2022).                                                         [45] F. Nentwich, N. Jovanovic, E. Kirda, C. Kruegel, and G. Vigna. Cross-
[24] S. Lee, H. Han, S. K. Cha, and S. Son. Montage: A neural network                site scripting prevention with dynamic data tainting and static analysis.
     language {Model-Guided}{JavaScript} engine fuzzer. In 29th USENIX               In In Proceeding of the Network and Distributed System Security Sym-
     Security Symposium (USENIX Security 20), pages 2613–2630, 2020.                 posium (NDSSâĂŹ07. Citeseer, 2007.

[25] S. Lekies, B. Stock, and M. Johns. 25 million flows later: large-scale     [46] NVD. CVE-2020-35774, 2020. https://nvd.nist.gov/vuln/detail/CVE-
     detection of dom-based xss. In Proceedings of the 2013 ACM SIGSAC               2020-35774.
     conference on Computer & communications security, pages 1193–1204,
     2013.



USENIX Association                                                                                     31st USENIX Security Symposium                  1021
[47] S. Park, W. Xu, I. Yun, D. Jang, and T. Kim. Fuzzing javascript engines      [59] B. Stock, S. Lekies, T. Mueller, P. Spiegel, and M. Johns. Precise
     with aspect-preserving mutation. In 2020 IEEE Symposium on Security               client-side protection against dom-based cross-site scripting. In 23rd
     and Privacy (SP), pages 1629–1642. IEEE, 2020.                                    {USENIX} Security Symposium ({USENIX} Security 14), pages 655–
                                                                                       670, 2014.
[48] K. Pei, Y. Cao, J. Yang, and S. Jana. Deepxplore: Automated whitebox
     testing of deep learning systems. In proceedings of the 26th Symposium       [60] M. Ter Louw and V. Venkatakrishnan. Blueprint: Robust prevention of
     on Operating Systems Principles, pages 1–18, 2017.                                cross-site scripting attacks for existing browsers. In 2009 30th IEEE
                                                                                       symposium on security and privacy, pages 331–346. IEEE, 2009.
[49] R. Pelizzi and R. Sekar. Protection, usability and improvements in
     reflected xss filters. In proceedings of the 7th ACM Symposium on In-        [61] M. Van Gundy and H. Chen. Noncespaces: Using randomization
     formation, Computer and Communications Security, pages 5–5, 2012.                 to enforce information flow tracking and thwart cross-site scripting
                                                                                       attacks. In NDSS. Citeseer, 2009.
[50] T. Petsios, A. Tang, S. Stolfo, A. D. Keromytis, and S. Jana. Nezha:
     Efficient domain-independent differential testing. In 2017 IEEE Sym-         [62] P. Vogt, F. Nentwich, N. Jovanovic, E. Kirda, C. Kruegel, and G. Vigna.
     posium on security and privacy (SP), pages 615–632. IEEE, 2017.                   Cross site scripting prevention with dynamic data tainting and static
                                                                                       analysis. In NDSS, volume 2007, page 12, 2007.
[51] C. Reis and S. D. Gribble. Isolating web programs in modern browser
     architectures. In Proceedings of the 4th ACM European conference on          [63] Z. Wang and S. Zhu. Symtcp: eluding stateful deep packet inspection
     Computer systems, pages 219–232, 2009.                                            with automated discrepancy discovery. In Network and Distributed
                                                                                       System Security Symposium (NDSS), 2020.
[52] C. Reis, A. Moshchuk, and N. Oskov. Site isolation: Process sepa-
     ration for web sites within the browser. In 28th {USENIX} Security           [64] WHATWG.                       Browsing      Context,        2021.
     Symposium ({USENIX} Security 19), pages 1661–1678, 2019.                          https://html.spec.whatwg.org/multipage/browsers.html#creating-
                                                                                       browsing-contexts.
[53] F. RosÃl’n. How I hacked Facebook and received a $3,500 USD Bug
     Bounty, 2012. https://blog.detectify.com/2012/12/30/how-i-hacked-            [65] WHATWG. Origin, 2021. https://html.spec.whatwg.org/multipage/origin.html.
     facebook-and-received-a-3500-usd-facebook-bug-bounty/ (visited on
     January 30, 2022).                                                           [66] WHATWG. The elements of html, 2021. https://html.spec.whatwg.org/.

[54] J. Schwenk, M. Niemietz, and C. Mainka. Same-origin policy: Eval-            [67] W. Xu, S. Park, and T. Kim. Freedom: Engineering a state-of-the-art
     uation in modern browsers. In 26th {USENIX} Security Symposium                    dom fuzzer. In Proceedings of the 2020 ACM SIGSAC Conference on
     ({USENIX} Security 17), pages 713–727, 2017.                                      Computer and Communications Security, pages 971–986, 2020.
[55] L. K. Shar and H. B. K. Tan. Mining input sanitization patterns for          [68] Y. Yang, Y. Zhou, H. Sun, Z. Su, Z. Zuo, L. Xu, and B. Xu. Hunting for
     predicting sql injection and cross site scripting vulnerabilities. In 2012        bugs in code coverage tools via randomized differential testing. In 2019
     34th International Conference on Software Engineering (ICSE), pages               IEEE/ACM 41st International Conference on Software Engineering
     1293–1296. IEEE, 2012.                                                            (ICSE), pages 488–499. IEEE, 2019.
[56] L. K. Shar, H. B. K. Tan, and L. C. Briand. Mining sql injection and         [69] M. Zalewski. cross_fuzz. https://lcamtuf.coredump.cx/cross_fuzz (vis-
     cross site scripting vulnerabilities using hybrid program analysis. In            ited on November 15, 2021).
     2013 35th International Conference on Software Engineering (ICSE),
     pages 642–651. IEEE, 2013.                                                   [70] X. Zheng, J. Jiang, J. Liang, H. Duan, S. Chen, T. Wan, and N. Weaver.
                                                                                       Cookies lack integrity: Real-world implications. In 24th {USENIX}
[57] K. Singh, A. Moshchuk, H. J. Wang, and W. Lee. On the incoherencies               Security Symposium ({USENIX} Security 15), pages 707–721, 2015.
     in web browser access control policies. In 2010 IEEE Symposium on
     Security and Privacy, pages 463–478. IEEE, 2010.                             [71] Y.-H. Zou, J.-J. Bai, J. Zhou, J. Tan, C. Qin, and S.-M. Hu. {TCP-
                                                                                       Fuzz}: Detecting memory and semantic bugs in {TCP} stacks with
[58] B. Stock and M. Johns. Protecting users against xss-based password
                                                                                       fuzzing. In 2021 USENIX Annual Technical Conference (USENIX ATC
     manager abuse. In Proceedings of the 9th ACM symposium on In-
                                                                                       21), pages 489–502, 2021.
     formation, computer and communications security, pages 183–194,
     2014.




1022     31st USENIX Security Symposium                                                                                             USENIX Association
A       HTML Generation                                                         F UZZ O RIGIN randomly generates an entire HTML file which includes
                                                                            1) HTML tags, and 2) JavaScript—We focus only on HTML tags and
                                                                            JavaScript generation, as the CSS does not affect the origin-related oper-
 Algorithm 1: JavaScript generation algorithm                               ations. For the HTML tags, F UZZ O RIGIN randomly uses all the possible
                                                                            HTML tags while prioritizing APInav related tags over the others. The HTML
1  Function genereteScript()                                                tags initially construct the DOM tree inside the browser, but we mainly focus
      input :tags (HTML tags), N (number of statement)                      on the JavaScript generation since the HTML tags are statically applied and
      output :script (list of statement)                                    cannot incur dynamic origin-updates in the browser.
 2    script ← [];                                                              Thus, F UZZ O RIGIN designs a JavaScript generation algorithm as illus-
 3     f unctions ← 0;
                    /                                                       trated in Algorithm 1. To be specific, the algorithm (i.e., generateScript)
           /* Generate N statements                                    */
                                                                            takes the generated HTML tags and the statement number (i.e., N) as an
 4         for n = 1 to N do                                                inputs, and outputs the script of JavaScript statements. The algorithm itera-
                  /* Pick a random value in [0, 1]                     */
                                                                            tively generates a statement which randomly belongs to one of the following
 5                r ← RAND([0,1])
                                                                            four types: 1) function definition, 2) event handler attaching, 3) JavaScript
 6                if r ≤ PROBFUNC then
                       /* Function definition                          */
                                                                            code blocks, and 4) general JavaScript operations.
                                                                                For the function definition, F UZZ O RIGIN defines a function template
 7                     statement ← generateFunction()
                                                                            and fills the function body by recursively calling generateScriptr with the
 8                      f unctions ← f unctions ∪ statement.name
                                                                            small number N (i.e., generateFunction in line 7). Especially, F UZZ O RIGIN
 9                else if r ≤ PROBEVENT then                                prioritize APInav and event triggering APIs inside the function so that the
                         /* Event handler setting                      */
                                                                            invocation of the function can be chained into further navigation or event
10                       f unction ← RAND_PICK( f unctions)
                                                                            handling. Then, F UZZ O RIGIN appends the defined function to the corpus
11                       event ← WEIGHTED_RAND(Eventnav , Eventall )
                                                                            (i.e., line 8, functions), which will be used to attach the event handler.
                          generateFunction()
                                                                                For attaching the event handler, F UZZ O RIGIN randomly chooses a func-
12                else if r ≤ PROBBLOCK then
                                                                            tion from the corpus (i.e., functions), and attaches it as a handler of a random
                         /* JavaScript code block                      */
                                                                            event (e.g., click or load). F UZZ O RIGIN also prioritizes the navigation-
13                       codeblock ← RAND_PICK(codeblocks)
                                                                            related events (i.e., Eventnav ), thus the completion of a navigation can fre-
14                       statement ← generateCodeBlock(codeblock)
                                                                            quently invoke other functions (Algorithm 2).
15                else
                                                                                Next F UZZ O RIGIN considers two JavaScript code blocks (i.e., if-else
                         /* General JavaScript operations              */
                                                                            and try-catch). F UZZ O RIGIN defines a template and fills the block by
16                       api ← WEIGHTED_RAND(APInav , APIall )
                                                                            recursively calling generateScript with the small number N (i.e., line 14,
17                       statement ← createCode(api, tags)
                                                                            generateCodeBlock)
18                APPEND(script, statement)
                                                                                Finally for the other general JavaScript operations, F UZZ O RIGIN ran-
19         end                                                              domly generates Web APIs and function-call (i.e., line 17, createCode).
20   end                                                                    The web APIs include DOM object creation (i.e., document.createElement)
                                                                            and DOM property set, DOM method call, timer function (i.e., setTime-
                                                                            out), and XMLHttpRequest. F UZZ O RIGIN covers Document, Element, Event,
                                                                            EventTarget, Node and Window as a DOM object. F UZZ O RIGIN does not
 Algorithm 2: Weighted random algorithm                                     generate anything other than aforementioned web APIs and function-call
                                                                            to focus on origin-related operations.
1    Function WEIGHTED_RAND()
                                                                                During the generation, we configure the statement to frequently use APInav
        input :set1 (priority set), set2 (entire set)
                                                                            and event triggering APIs (e.g., Click, and Submit), which help fulfilling
        output :item (selected item)
                                                                            F UZZ O RIGIN’s design philosophy (i.e., frequent navigation and chained
           /* Pick a random value in [0, 1]                            */
                                                                            event handling). The element defined from the HTML tags can also be
 2         r ← RAND([0,1])
                                                                            accessed and updated here.
 3         if r ≤ PROBWEIGHT then
                /* Weighted rand                                       */       While all the statements are randomly generated, the probabilities for
 4               item ← RAND_PICK(set1)                                     selecting navigation-related events and APInav (i.e., WEIGHTED_RAND) can be
                                                                            configured so that various fuzzer settings can be used.
 5         else
                  /* Normal rand                                       */
 6                item ← RAND_PICK(set2)
7    end




USENIX Association                                                                                  31st USENIX Security Symposium                  1023
