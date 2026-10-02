---
type: Whitepaper
title: Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning
description: Trains a neural classifier on JavaScript function tokens to select code for DOM XSS taint tracking. Its hybrid design retains 94.5% of unique confirmed vulnerabilities while modeling a 3.43-fold reduction in taint-tracking cost; the classifier alone has inadequate precision.
resource: "https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf"
tags: [whitepaper, webseclist-reference, acm, xss, dom, javascript, dynamic-analysis, measurement-study, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-09-10T15:37:37+00:00"
status: stable
stale_after: 2027-09-10
sources:
  - id: original
    resource: "https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf"
    title: Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning
    author: William Melicher, Clement Fung, Lujo Bauer, Limin Jia
also_at: []
authors:
  - William Melicher
  - Clement Fung
  - Lujo Bauer
  - Limin Jia
canonical_url: ""
cited_by:
  - "2021.md:68"
commit: ""
content_sha256: 738d4ff76837284e5e9084e004da8d2dce0f8106937384923b6bd9bc24cae4a3
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf"
published: ""
publisher: ACM
publisher_english: ""
raw_sha256: 3887d9506eb41e04aeddd31a9a6c6b6d2aaad481d801442ad45b1c638a420c99
retrieved_from: "https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf"
retrieved_kind: live
retrieved_utc: "2026-09-10T15:37:37+00:00"
slug: towards-lightweight-hybrid-approach-detecting-dom-xss-vulnerabilities-learning
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning

**Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning** - William Melicher, Clement Fung, Lujo Bauer, Limin Jia, ACM.

- Published: date not stated
- Original: <https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf>
- Preserved from: https://clementfung.me/gallery/papers/www2021-domxss-ml.pdf (live) on 2026-09-10
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Towards a Lightweight, Hybrid Approach for Detecting DOM
            XSS Vulnerabilities with Machine Learning
                             William Melicher                                                              Clement Fung
                        Carnegie Mellon University                                                  Carnegie Mellon University
                       Pittsburgh, Pennsylvania, USA                                               Pittsburgh, Pennsylvania, USA
                           wrmelicher@gmail.com                                                     clementf@andrew.cmu.edu

                                   Lujo Bauer                                                                  Limin Jia
                       Carnegie Mellon University                                                   Carnegie Mellon University
                      Pittsburgh, Pennsylvania, USA                                                Pittsburgh, Pennsylvania, USA
                             lbauer@cmu.edu                                                              liminjia@cmu.edu
ABSTRACT                                                                             1   INTRODUCTION
Client-side cross-site scripting (DOM XSS) vulnerabilities in web                    Web applications that fail to correctly sanitize their inputs can be
applications are common, hard to identify, and difficult to prevent.                 vulnerable to cross-site scripting (XSS) vulnerabilities [16], which
Taint tracking is the most promising approach for detecting DOM                      are becoming increasingly common [9, 15, 18, 32]. A specific type
XSS with high precision and recall, but is too computationally                       of XSS vulnerability, client-side XSS (DOM XSS), is caused by bugs
expensive for many practical uses.                                                   in a website’s JavaScript code; their prevalence is rising with the
    We investigate whether machine learning (ML) classifiers can                     increase in complexity in client-side code [32]. In recent years, DOM
replace or augment taint tracking when detecting DOM XSS vulner-                     XSS vulnerabilities have been reported at high-profile organizations
abilities. Through a large-scale web crawl, we collect over 18 billion               such eBay, Yahoo, IBM, and Facebook [32].
JavaScript functions and use taint tracking to label over 180,000                       DOM XSS vulnerabilities can be prevented by filtering out con-
functions as potentially vulnerable. With this data, we train a deep                 tent using signatures and heuristics [11, 13, 29], but such defenses
neural network (DNN) to analyze a JavaScript function and predict                    can be evaded by modern attack strategies [7, 8, 17, 33]. Other
if it is vulnerable to DOM XSS. We experiment with a range of                        defenses detect DOM XSS vulnerabilities using static or dynamic
hyperparameters and present a low-latency, high-recall classifier                    analyses. In principle, static analysis can detect code-injection vul-
that could serve as a pre-filter to taint tracking, reducing the cost of             nerabilities before they are exploited or even released. However,
stand-alone taint tracking by 3.43× while detecting 94.5% of unique                  static-analysis tools have difficulty reasoning about the dynamic
vulnerabilities. We argue that this combination of a DNN and taint                   features of JavaScript [14, 35, 41], have high error rates [26], or may
tracking is efficient enough for a range of use cases for which taint                not scale to large codebases [14], making them impractical as DOM
tracking by itself is not, including in-browser run-time DOM XSS                     XSS defenses.
detection and analyzing large codebases.                                                In contrast, dynamic analyses—specifically, taint tracking—have
                                                                                     shown promise for detecting DOM XSS vulnerabilities [22, 26, 38].
CCS CONCEPTS                                                                         In dynamic taint tracking approaches, code is analyzed to detect
• Security and privacy → Web application security; • Infor-                          DOM XSS vulnerabilities at execution time. This adds substantial
mation systems → World Wide Web; • Computing method-                                 overhead (16.8% increase in page load times) suggesting that such
ologies → Machine learning.                                                          approaches are unlikely to be adopted in many settings, e.g., as
                                                                                     in-browser defenses [12, 34].
KEYWORDS                                                                                Leveraging the observation that many DOM XSS vulnerabilities
                                                                                     are syntactically similar and of low complexity [26, 39], we propose
web security, DOM XSS vulnerabilities, neural networks                               an alternative approach that uses machine learning (ML) to greatly
ACM Reference Format:                                                                reduce the overhead imposed by dynamic taint tracking to detect
William Melicher, Clement Fung, Lujo Bauer, and Limin Jia. 2021. Towards a           DOM XSS vulnerabilities. We also investigate the feasibility of com-
Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with              posing ML with an existing analysis. Specifically, we address two
Machine Learning. In Proceedings of the Web Conference 2021 (WWW ’21),               primary research questions:
April 19–23, 2021, Ljubljana, Slovenia. ACM, New York, NY, USA, 12 pages.
https://doi.org/10.1145/3442381.3450062                                              RQ1: Can ML act as a pre-filter for taint tracking to detect DOM
                                                                                     XSS vulnerabilities with far less overhead than taint tracking alone
This paper is published under the Creative Commons Attribution 4.0 International     while maintaining a high recall rate?
(CC-BY 4.0) license. Authors reserve their rights to disseminate the work on their
personal and corporate Web sites with the appropriate attribution.                   RQ2: Can ML be used on its own to detect DOM XSS vulnerabili-
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                      ties with recall and precision comparable to or better than other
© 2021 IW3C2 (International World Wide Web Conference Committee), published
under Creative Commons CC-BY 4.0 License.
                                                                                     techniques?
ACM ISBN 978-1-4503-8312-7/21/04.
https://doi.org/10.1145/3442381.3450062
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                                                            William Melicher, Clement Fung, Lujo Bauer, and Limin Jia



                      Taint tracking only                                     JavaScript           Taint        Unconfirmed       Vulnerability   Confirmed
                      (dataset generation)                                     function          tracking          vuln.          confirmation      vuln.



                                                                                                                Dataset #1                        Dataset #2

                      DNN + taint tracking
                      (using dataset #1, for RQ1)
                                                    JavaScript   Classifier      Predicted         Taint        Unconfirmed       Vulnerability   Confirmed
                                                     function                   unconfirmed      tracking          vuln.          confirmation      vuln.
                                                                                   vuln.

                      DNN only
                      (using dataset #2, for RQ2)
                                                                                                            JavaScript function                   Predicted
                                                                                                                                     Classifier
                                                                                                                                                  confirmed
                                                                                                                                                    vuln.



Figure 1: Illustrating how we collect training data, and how ML models trained on these datasets can be used in two different
ways to reduce overhead in the dynamic taint tracking pipeline.


   To train and evaluate these ML classifiers, we first obtain a suffi-                       reducing the overhead of detection by 3.43× over taint tracking
cient volume of ground-truth data. We use an open-source taint-                               alone and enabling new use cases for taint tracking (Sec. 6.2).
tracking-enabled web browser from prior work [26] to collect in-
                                                                                              (2) We manually examine a sample of functions in our dataset and
stances of DOM XSS vulnerable JavaScript functions in a two-step
                                                                                              uncover that the performance of our classifiers may be better than
process (see Fig. 1). First, we use taint tracking to identify JavaScript
                                                                                              what we report (Sec. 6.3), because taint tracking fails to find unexe-
functions that invoke dangerous sinks (e.g., document.write) with
                                                                                              cuted vulnerable functions.
seemingly unsanitized arguments. Taint tracking itself cannot con-
firm that these functions are exploitable, so we label these functions                        (3) We manually inspect the performance and properties of our
as unconfirmed vulnerabilities (dataset #1). To prune this set of func-                       baseline linear models to provide an initial view into the characteris-
tions to only those that are exploitable, we use heuristics from prior                        tic differences between DOM XSS vulnerabilities that can be found
work [26] to perform proof-of-concept exploits, and we label the                              by linear models and vulnerabilities that require DNNs (Sec. 6.3).
exploitable functions as confirmed vulnerabilities (dataset #2).
   Our classifier trained on unconfirmed vulnerabilities can be used                          (4) We generate a dataset of 32 million JavaScript functions labeled
as a pre-filter for taint-tracking-based DOM XSS detection (RQ1) to                           as vulnerable or not via taint tracking and proof-of-concept exploit
classify 97.5% of unique functions as non-vulnerable, while main-                             confirmation; we have made datasets and trained models publicly
taining 94.5% unique recall of vulnerabilities. In this configuration,                        available1 .
taint tracking is only used on the remaining 2.5% of functions,
decreasing the vulnerability detection overhead by 3.43× when                                 2 BACKGROUND AND RELATED WORK
compared to taint tracking alone.                                                             2.1 DOM XSS vulnerabilities
   Alternatively, our classifier trained on confirmed vulnerabilities                         Cross-site scripting (XSS) vulnerabilities occur when input is im-
can be used as the sole means of judging whether a JavaScript                                 properly sanitized, allowing attackers to inject arbitrary JavaScript
function is vulnerable to DOM XSS attacks (RQ2), and captures                                 code into a victim’s browser. An attacker could exfiltrate private
50% of confirmed vulnerabilities at a precision of 57.8%. In general,                         information or compromise a victim’s machine by redirecting to a
we have not found a tuning that delivers a combination of high                                malicious website.
recall and high precision sufficient for such a classifier to be the                             In this work we focus on client-side vulnerabilities that result
sole method of detecting DOM XSS vulnerabilities.                                             from client-side manipulation of the browser’s Document Object
   In exploring the classifier design space to answer these research                          Model (DOM). Attackers could inject exploits into sources such as
questions, we experimented with two model types (linear models                                the document.location object (the URL), the web page referrer,
and deep neural networks (DNNs)); multiple representations of                                 or the postMessage API. When information from these attacker
source code (based on scripts, functions, or semantic distance); var-                         controllable sources is used in sensitive code-executing functions
ied model architectures (embedding sizes and DNN layer sizes); and                            (known as sinks), an XSS vulnerability may be present. Examples
adjusted training regimes to compensate for imbalanced ground                                 of such sinks include: the innerHTML property of DOM nodes, the
truth (i.e., in the wild, non-vulnerable functions far outnumber                              eval method, or javascript: URLs.
vulnerable ones). The contributions of this paper are:                                           An exploitable flow from a source to a sink does not neces-
(1) We design and train classifiers to detect DOM XSS vulnerabilities                         sarily imply an vulnerability, as programmers may sanitize in-
and investigate trade-offs in inference time, precision, and recall                           formation before use in the sensitive sink. Common sanitization
(Sec. 5). We find that a relatively small DNN (4 fully connected                              methods include built-in browser APIs such as encodeURI and
layers of ≤ 100 units) can be an effective pre-filter for taint tracking,                     1 Data and trained models available at https://doi.org/10.1184/R1/13870256
Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning                WWW ’21, April 19–23, 2021, Ljubljana, Slovenia


encodeURIComponent or manually checking that user input matches                      was improved by adding byte-precise taint tracking, which attaches
a safe regular expression (e.g., alphanumeric characters).                           taint information to specific bytes in the JavaScript engine, reducing
   In our work, we train a model for predicting DOM XSS vulnera-                     false positives [22, 38].
bilities based on source code. We train separate models to predict                      While taint tracking can effectively defend against DOM XSS
unconfirmed vulnerabilities (that would be flagged by taint analy-                   vulnerabilities at run time, this is at the cost of overhead of, e.g.,
sis and require further investigation) and confirmed vulnerabilities                 between 7% and 17% in certain benchmarks [38]. Browser vendors
(that are confirmed by executing a proof-of-concept exploit).                        are exceptionally sensitive to performance overhead [12, 34] and
                                                                                     our solution provides an opportunity to mitigate this performance
2.2     Content filtering                                                            degradation by using ML to selectively enable taint tracking when
Browsers and web servers have sought to employ filters for DOM                       a classifier decides that the code may be vulnerable.
XSS exploits. Content security policies (CSP) can restrict the al-
lowed scripts on a website [13] but are often misconfigured in a                      2.4.2 Confirming potentially vulnerable flows. Because tainted data
way that does not substantially limit DOM XSS exploits [8]. An                        may be sanitized by the programmer, such flows may not neces-
experimental browser API based on the concept of trusted types                        sarily be exploitable. Researchers use heuristics to automatically
has been introduced [20], but this API is incompatible with legacy                    generate exploits to confirm these vulnerabilities. In prior work,
applications. Web application firewall filters are another common                     researchers generated exploits by analyzing the context around the
defense against XSS vulnerabilities, but can be bypassed by tweak-                    tainted string [22], using a pre-configured list of exploit-causing
ing the exploit to evade the filter detection patterns [7, 17].                       injections [31] or symbolic analysis [43] to confirm flows with test
    Client-side filters (such as the XSS auditor[11]) have also been                  injections. In our work, we leverage the above solutions to generate
used as a defense, but they too suffer from similar evasion at-                       labeled instances of confirmed vulnerabilities.
tacks [33]. Researchers examined a list of known DOM XSS vulner-
abilities, and showed that in 73% of cases the XSS auditor fails to                   2.5     Machine learning in program analysis
filter an attack [38].                                                               Several projects have used ML to analyze programs in JavaScript,
    In contrast to using such heuristics, we train ML models to learn                successfully identifying many instances of malicious JavaScript [12,
the filter policy and detect DOM XSS vulnerabilities. ML models                      44, 47]. However, these solutions rely on hand-engineered features
may infer deeper relations between source code and vulnerabilities                   (e.g. the location of the flow, the number of functions involved in
and could be more difficult for attackers to bypass.                                 the flow, the source and sink of the flow). We avoid using such
                                                                                     techniques, allowing our solution to generalize to different contexts
2.3     Static analysis of JavaScript                                                and to adapt to changing source code idioms. The building blocks
Static analysis techniques can detect properties of interest by ana-                 for program analysis from data can also be learned by training
lyzing source code, allowing insight to all the possible execution                   decision trees [5]. In contrast our work opts for deep learning,
paths that a program may take. Several implementations of static                     which can learn latent representations of complex data.
analysis for JavaScript are available in commercial tools includ-                       The most closely related work has used deep learning to an-
ing IBM Security AppScan, Trustwave App Scanner, Coverity’s                          alyze the information flow in programs for more efficient taint
JavaScript scanner, and Burp Suite Pro [40]. However, it is particu-                 tracking [37] or vulnerability detection [24] in C. In these projects,
larly challenging to statically analyze JavaScript, as it is a dynamic               ML models must identify key points in the program to analyze
language and lacks strict typing information [14, 45]. Furthermore,                  the information flow, relying on the highly static nature of C pro-
static analysis is prohibitively expensive for our setting, and thus                 grams. In our work, we focus on DOM XSS vulnerabilities in the
we do not consider using static analysis in our solution.                            browser, which predominantly executes dynamic JavaScript code.
                                                                                     This makes it difficult to confidently determine the key points of
2.4     Dynamic analysis of JavaScript                                               a program and to extract data dependencies, and thus the above
Dynamic analyses are also commonly used on Javascript [22], but                      solutions do not apply to our setting.
only operates on observations collected during program execution
                                                                                     2.5.1 Vector representations of programs. Representing programs
and does not have analyze non-executed code. Furthermore, such
                                                                                     in a form that deep neural network models can analyze is an open
methods incur run-time overhead [38] and require significant
                                                                                     issue. Prior work has explored a handful of representations [3, 4,
engineering work to modify a complex run-time environment (in
                                                                                     24, 28] but there is little agreement about what representation is
our case, the JavaScript engine).
                                                                                     most appropriate for a given task.
2.4.1 Taint tracking. The most relevant dynamic analysis for iden-                      Researchers have developed code2vec, which translates ASTs
tifying DOM XSS vulnerabilities is taint tracking. This technique                    into vectors for machine learning by linking start and terminal
flags data from potentially attacker-controlled sources as tainted                   nodes with a series of movements up and down the AST tree [4].
and propagates taint information at execution time. When a tainted                   Tree convolutions analyze AST node information over the tree struc-
string is used in a sensitive sink, the taint-tracking engine flags this             ture, in a similar way as a convolutional neural network processes
flow of information as a potential DOM XSS vulnerability; we call                    images over its pixels. Tree convolutions base the classification of
this an unconfirmed vulnerability.                                                   each node on the nodes that are close to it using neural network
   The first tool that used taint tracking to discover DOM XSS vul-                  convolutions and have been used previously to detect algorithm
nerabilities was Firefox-based DOMinator [30]. Later, its precision                  performance bugs from source code [28].
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                                William Melicher, Clement Fung, Lujo Bauer, and Limin Jia


   Work has also been done on analyzing graph-structured data                 Since our crawl is non-deterministic, we aggregate results across
for use in program analysis. We also explored an approach using            multiple executions. Log files from execution for our crawl are 26TB
gated graph neural networks [23], which have recently been used            when compressed using GZIP. Many scripts are repeated across
to model certain properties of source code, such as idiomatic coding       multiple crawls, so we remove all source code duplicates, reducing
style [3]. However, we experimentally found that these techniques          the compressed size of our aggregated database to 382GB.
were unable to accurately model JavaScript semantics.

3     DATA COLLECTION METHODOLOGY                                          3.2    Labeling and confirming flows
                                                                           We next detect which scripts contain tainted arguments to poten-
We describe our methodology in collecting two ground-truth datasets
                                                                           tially vulnerable sinks and where those sinks are located. If a flow
for training and evaluating our ML classifiers. We use a taint-
                                                                           is labeled as vulnerable in any execution, we label it as vulnerable
tracking-enabled browser to collect unconfirmed vulnerabilities
                                                                           in our aggregation. To locate the specific call to sink functions in
(dataset #1) in a large-scale web crawl, described in Sec. 3.1. We then
                                                                           source code, we output an annotated stack trace of the function call
label instances of these unconfirmed vulnerabilities as confirmed
                                                                           during execution, which contains the parsed AST of all executed
vulnerabilities (dataset #2), described in Sec. 3.2. Finally, we discuss
                                                                           JavaScript. We use the AST node of the JavaScript stack frame clos-
attributes (Sec. 3.3) and limitations (Sec. 3.4) of our data collection.
                                                                           est to the bottom of the call stack as indication of the vulnerability.
                                                                           We do not use other functions in the stack trace, since we do not
3.1     Ground-truth data collection                                       have information about the location of the tainted flow’s source and
We describe our infrastructure for collecting ground-truth data to         are unable to label such nodes. An overview of how ground-truth
train and test our vulnerability classifiers, shown in Fig. 1.             data is transformed and labeled is shown in Fig. 2.

3.1.1 Taint tracking browser. We leverage a modified, taint-tracking-
                                                                           3.2.1 Finding unconfirmed vulnerabilities. To determine whether a
enabled version of the Chromium browser from prior work [26]
                                                                           sensitive sink should be labeled as an unconfirmed vulnerability,
to collect a series of website execution traces, identifying code
                                                                           we observe whether the encoding methods applied to tainted data
that is potentially vulnerable to DOM XSS injections. The modified
                                                                           match the context of where the taint is applied, using similar logic as
browser is driven by an extension that interacts with a server-side
                                                                           prior work [22, 26, 38]. For example, if taint tracking indicates that
database, directing crawling activities via HTTP interactions and
                                                                           the document.write function was called with a tainted argument
storing records of tainted flows.
                                                                           from a webpage’s URL without any applied encoding functions, we
   The browser’s V8 engine and WebKit infrastructure are modified
                                                                           would mark that flow as an unconfirmed vulnerability. However,
with taint tracking to identify potentially vulnerable flows. Dur-
                                                                           if the encodeURI function was later applied to the tainted bytes
ing execution of each webpage’s JavaScript, the modified browser
                                                                           before use in the sink, then we would mark the function as safe,
stores: a record of all browser-executed source code, the parsed V8
                                                                           because the encodeURI function sanitizes the input and prevents
representation of that source code, all tainted sink executions, and
                                                                           the vulnerability. From the results of our data crawl, we collected
other bookkeeping information. For each execution of a sink with
                                                                           approximately 32,000,000 instances of unconfirmed vulnerabilities,
tainted data, we additionally log: the value of the tainted argument,
                                                                           occurring in approximately 180,000 distinct, unique functions.
the specific tainted characters, whether any specific built-in encod-
ing methods were applied (e.g., escape or encodeURI), and a full
trace of the JavaScript call stack.                                        3.2.2 Confirming vulnerabilities. For the remaining unconfirmed
   Since the modified browser is only able to use taint tracking           vulnerabilities, we generate confirmation test injections by leverag-
to identity potentially vulnerable code (which we define as un-            ing techniques from prior work [22, 26]. We combine our knowledge
confirmed vulnerabilities), we use proof-of-concept exploits from          of the applied encoding functions to generate a proof-of-concept
prior work [26] to further confirm whether these flows are indeed          test injection for each unconfirmed vulnerability, and re-execute
vulnerable to DOM XSS injection and can be labeled as confirmed            the webpage with our test injection to see if the injection succeeds.
vulnerabilities, a process described in Sec. 3.2.                          This step is necessary because developers have the broad ability to
                                                                           do ad-hoc sanitization of flows without using the built-in encoding
3.1.2 Crawl methodology. In total, we crawled the Alexa top 10,000 [2]     methods, such as checking if a tainted input matches the regular
websites and visited 289,392 web pages on those websites. We be-           expression for a number, a technique which would neutralize a
gan by visiting the root webpage of the website and sample 40              unconfirmed vulnerability. After using the proof-of-concept ex-
sublinks within the same domain for a total of 410,000 attempted           ploits, we collected approximately 4,500,000 instances of confirmed
webpage visits. Not all pages were loaded during our crawl; we             vulnerabilities, occurring in over 2,300 distinct, unique functions.
obeyed robots.txt [19] directives and other webpages did not cor-             Thus, as Fig. 1 shows, we create two datasets for training ML
rectly load during our crawl. If an individual webpage did not load        models: (1) a dataset of unconfirmed vulnerabilities based on the
successfully, we attempted to load another sampled webpage on the          outputs of the taint tracking browser [26], and (2) a dataset of con-
same domain if possible. While loading webpages, the crawler first         firmed vulnerabilities based on our proof-of-concept test injections.
waits for the page ready event, then waits an additional 90 seconds        The set of confirmed vulnerabilities is a subset of the unconfirmed
for page execution. We empirically observed that 90 seconds was            vulnerabilities; we train two separate classifiers using these datasets
sufficient to detect the vast majority of tainted sinks.                   and execute experiments on both.
Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning                                                                 WWW ’21, April 19–23, 2021, Ljubljana, Slovenia


                                                                                                                                  AST                                               Bag of words
                                  JavaScript source                                                                                 script
                                                                                                                                                                                    Vulnerable: yes
                                                                                                                                                                                    {
                    var the_url = document.location.href;                                                   assignment                               assignment   function call         “the_url” : 2,
                                                                                     left-hand side                           right-hand side
                    var markup = ‘<a href=”’ + the_url + ‘”>Link</a>’;                                                                                                                  “document” : 2,
                    document.write(markup);                                           variable: "the_url"                     property
                                                                                                                                                                                        “write” : 1,
                                                                                                                                                            ...
                                                                                                                                                                  ...                   “location” : 1,
                                                                                                                 object                      key
                                                                                                                                                                                        “href” : 1,
                                                                                                                   property
                                                                                                                                                   "href"
                                                                                                                                                                                        …
                                                                                                      object                      key                                               }
                                                                                                     variable:
                                                                                                                               "location"
                                                                                                   "document"



Figure 2: Ground-truth data transformation. The red node represents a vulnerable node. The function is then unitized, and
the related context is converted into a bag of words.

Table 1: Summary statistics of our two vulnerability datasets.                                                                3.4            Limitations
We present the average of all folds (see Sec. 4.2). We show
                                                                                                                              Our browser infrastructure is based on an old version of Chromium,
the total number (“# Total”) of functions, and measure the
                                                                                                                              version 57 (a version from August 2016). In principle, the vulnerabil-
total number (“# vuln”) and percentage (“% vuln”) of func-
                                                                                                                              ities that we observe may not apply to other browsers. This version
tions that are vulnerable. “Distinct” removes duplicate func-
                                                                                                                              of Chromium handles encoding of values after the hash differently
tions by counting based on hashes of the function content.
                                                                                                                              than the latest version of Chromium, which may affect whether an
“Weighted” counts functions by their overall occurrence fre-
                                                                                                                              unconfirmed vulnerability is exploitable. However, defense mecha-
quency.
                                                                                                                              nisms in newer versions of Chromium are not ubiquitous in other
                                                                                                                              browsers, so relying on newer versions of Chromium may overlook
                                            Training   Testing Validation All data                                            vulnerabilities that still affect many browsers.
                                                                                                                                  Our ground-truth data is also constrained by the limitations of
                       weighted




                                  # total         15B      2.0B                1.8B     19B
                                                                                                                              the dynamic analysis used for labeling. Our data only contains
      Confirmed




                                  # vuln         3.8M     357K                354K     4.5M
                                  % vuln       0.025%   0.018%              0.019%   0.024%                                   labeled AST nodes from actual executions, and we cannot make
                                  # total       383M       48M                 48M    478M                                    claims about code that is not executed. However, while our datasets
                       distinct




                                                                                                                              contain false negatives, it does not contain false positives: all of our
                                  # vuln         1,853      235                 238    2,326
                                                                                                                              2,326 confirmed vulnerabilities were demonstrated to be vulnerable
                                  % vuln    0.00048% 0.00049%            0.00050% 0.00049%
                                                                                                                              on at least one generated proof-of-concept exploit.
                       weighted




                                  # total        15B         1.7B             1.8B             19B                                If any instance of a function is labeled as vulnerable, then we label
      Unconfirmed




                                  # vuln        27M         2.8M             2.2M             32M                             all instances of that function as vulnerable. However, exploiting that
                                  % vuln       0.18%       0.17%            0.12%            0.17%                            vulnerability may require cross-function interactions that are only
                                  # total      382M         48M              48M             478M                             present on some web pages. Arguably, it may still be appropriate
                       distinct




                                  # vuln       144K          19K              18K            180K                             to flag such functions as vulnerable, since they are not safe in all
                                  % vuln      0.038%     0.039%            0.037%          0.038%
                                                                                                                              contexts. In either case, analyzing such cross-function interactions
                                                                                                                              is complex and beyond the scope of this work.

                                                                                                                              4         CLASSIFIER DESIGN
                                                                                                                              We first describe our assumptions about potential threats to our
3.3         Properties of ground-truth dataset                                                                                ML model (Sec. 4.1). We then discuss our feature extraction and
After collecting ground-truth data, we wanted to understand the                                                               data processing techniques (Sec. 4.2). Finally, we describe our im-
degree to which frequently used scripts (such as jQuery) could                                                                plementation details (Sec. 4.3) and evaluation metrics (Sec. 4.4).
impact training and evaluation. If a small set of frequent scripts
account for a significant amount of the dataset, then the ML model’s
performance could be dominated by its ability to recognize those
                                                                                                                              4.1            Attacker capabilities: poisoning attacks and
frequent scripts. A summary of our datasets and the distribution of                                                                          evasion attacks
vulnerabilities is shown in Table 1. We found that while our datasets                                                         The use of ML for security tasks can expose systems to new attacks.
contain some frequently occurring scripts, there is also a signifi-                                                           For example, in poisoning attacks attackers inject malicious training
cant long tail of unique scripts; our dataset included 240,830,867                                                            data into a system [6] and in evasion attacks attackers construct
observations of 23,013,705 unique scripts. The dataset is signifi-                                                            inputs that appear benign but evade detection [25, 36]. For the
cantly one-sided: positive labels (vulnerabilities) are extremely rare                                                        purposes of our design, we do not consider such attacks.
compared to negative labels (non-vulnerable functions). Only 0.17%                                                               Although an adversary could possibly establish a malicious web-
of all functions are unconfirmed vulnerabilities and 0.024% of all                                                            site that our web crawler then uses to collect poisoned training data,
functions are confirmed vulnerabilities. Furthermore, these propor-                                                           we assume that this is prohibitively expensive for an attacker (since
tions are even smaller when considering unique scripts (0.038% and                                                            we are crawling the 10,000 most popular websites) and the training
0.0005%).                                                                                                                     data used to train our model is not poisoned by an adversary.
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                                 William Melicher, Clement Fung, Lujo Bauer, and Limin Jia


   Regarding evasion attacks, our system is designed to detect acci-        performance on complete scripts that it has never seen before and
dental vulnerabilities (e.g., to help protect website developers who        captures a more realistic setting in which the model is presented
have control over the JavaScript on their website). If an attacker is       with complete scripts (which are then segmented by functions).
able to manipulate the code on a website, the website is already com-          Additionally, we would like to increase the importance of each
promised and an attacker would not need to evade our detection              function based on its observed frequency in our crawl. Functions
infrastructure. Our attacker model assumes that JavaScript code             that are defined in very common libraries are more important to
is benign but potentially vulnerable; attackers provide malicious           classify correctly than code that is comparatively uncommon. To
input to websites to exploit DOM XSS vulnerabilities, but do not            do this, we oversample frequent code instances in the training set
control the system otherwise.                                               before shuffling the data. This is preferred over applying a weight
                                                                            during training because, in our experiments, the models would not
4.2     Feature extraction and data preparation                             converge when presented with extremely common functions that
Before being able to train on and classify pieces of source code, we        massively outweighed other functions. If a common function is
must translate this code into a form that can be consumed by a              observed at the end of the training epoch, the model is drastically
neural network. In this section, we describe our methodology in             changed. However, by repeating instances multiple times, these
translating labeled AST nodes into feature vectors for training.            effects are smoothed out over the training period.

4.2.1 Segmentation of code. Given a block of labeled source code,           4.2.4 Balancing errors. Another problem in training with our data
we chose to segment the code by its function calls. For the experi-         is the massive class imbalance across labels: there are far more
ments presented in this work, the code located within an individual         non-vulnerable functions than vulnerable functions (only 0.024% of
function call is used as a single unit for training and classifica-         all functions were confirmed as vulnerable). Therefore, we added
tion. We also attempted to segment code based on scripts, and               a weight to positive labels during training by penalizing the loss
using segments that contained the surrounding AST nodes within a            function accordingly. We experimented with penalization terms
fixed semantic distance; however, segmenting the code by functions          of 1, 10, 100, and 1,000, and found that 100 was optimal—with
produced the best results for training our model. Segmenting by             lower penalizations the classifier would never predict functions
entire scripts selects code snippets that are too large, while the          as vulnerable, and with a penalization term of 1,000, the classifier
fixed-semantic-distance strategy produces code snippets that are            would not converge.
too small. Both representations prevent the classifier from learning
                                                                            4.2.5 Vectorizing features. We used feature hashing [46] to repre-
meaningful features when predicting vulnerabilities.
                                                                            sent our sparse data, which allows our unbounded vocabularies to
4.2.2 Extracting features and code representation. After the labeled        be represented as vectors by hashing terms to specific buckets. The
source code has been transformed into segments, we extract input            downside of this technique is that it introduces ambiguity when
features for our ML model. For the experiments shown here, we use           the hash function has collisions. In order to mitigate the effect of
a bag of words representation: each function is uniquely identified         collisions, we use a feature size of 218 , a recommended size that
by a term-frequency dictionary of the parsed AST tokens contained           balances memory requirements and collision probability [21]. We
within the function call. We store all of the relevant symbols and          use an embedding layer that encodes the sparse bag of words into
operations (variable names, operation names, method names, prop-            a dense vector space. This embedding is the first part of our model
erty names, etc) in this dictionary. Although variable and method           architecture, acts as the input to the first hidden layer, and is also
names may change, we believe that this representation is robust in          optimized during training. We experiment with varying sizes of
the face of small changes in source code, such as differing library         this embedding in Sec. 5.1.
versions, because often a significant amount of the variable names
and function names are maintained across versions.                          4.3    Implementation
   We also experimented with methodologies from prior work that             We build our model in TensorFlow [1] and train the model with
extract program slices from C [24], but found that, the highly dy-          the Adagrad optimizer (learning rate of 0.05, batch size of 64). For
namic nature of Javascript prevents us from confidently identifying         our smallest model (Fig. 5), the training time is 11K functions per
the key points of the program required for slicing. We also exper-          second, which translates to approximately 20 hours to train on
imented with prior work that used models based on gated graph               5% of our total data, using a 64GB virtual machine with a 16GB
neural networks [3], but found that these techniques produced               NVIDIA Tesla P100 GPU.
models that were unstable and performed poorly, potentially also
due to the dynamsism of Javascript.                                         4.4    Performance metrics
4.2.3 Experimental data setup. We divided our dataset into subsets:         For any class imbalanced task, accuracy is not a useful metric, be-
80% “training” to train our models, 10% “validation” to evaluate            cause a classifier could achieve near perfect accuracy by predicting
competing models during hyperparameter exploration, and 10%                 that all functions are not vulnerable.
“test” for measuring the final model performance. When dividing,               Since we are evaluating whether or not our ML model could
we split by the script that the function originated from (for each          be used in combination with other techniques, the precision-recall
script in our collected dataset, there is a 80% chance its function calls   trade-off is more useful when tuning the trade-off between accuracy
would be used for training, 10% chance in testing, and a 10% chance         and overhead. We define precision as the proportion of predicted
for validation). This split is performed to evaluate our model’s            vulnerabilities that are indeed labeled vulnerabilities, and recall
Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning                  WWW ’21, April 19–23, 2021, Ljubljana, Slovenia


                                                     DNN model
                                  Hash
                                 buckets   Embedding layer Hidden layers
                                            (Section V-A1) (Section V-A2)
    Input Bag of Tokens
    {“document”: 1,     hash()                                              Predicted
    “write”: 1,
    “ASSIGN”: 2, ...}                                                        output




                                                     Linear model
                                                    (Section V-A4)


Figure 3: An overview of our ML architecture and its avail-
able hyperparameters. We explore with different embed-
ding sizes, hidden layer sizes and model types.
                                                                                        Figure 4: Varying embedding layer sizes in predicting uncon-
                                                                                        firmed vulnerabilities
as the proportion of labeled vulnerabilities that were correctly
predicted as vulnerabilities.
   Since recall can particularly be influenced by performing well on
a frequent vulnerability, we also consider performance on distinct
vulnerabilities. We define distinct recall to be the proportion of
distinct labeled vulnerabilities correctly identified by our models,
and true recall as the proportion of all labeled vulnerabilities that
are correctly identified. When computing true recall, each function
is weighted by its true observed frequency; so true recall represents
recall on real data that the algorithm would encounter if deployed.
                                                                                                 (a) Unconfirmed                     (b) Confirmed
5     RESULTS
First, we use our validation dataset to tune parameters such as                         Figure 5: Effect of varying the model hidden-layer sizes
the model type and model size (Sec. 5.1). Then, we evaluate our                         when predicting unconfirmed (left) and confirmed (right)
best-performing models on our test data set, both for unconfirmed                       vulnerabilities. Points are plotted from largest (2000) to
and confirmed vulnerabilities (Sec. 5.2).                                               smallest (100), and overlap at several recall values.
   In this section, the results shown are the average of 3 folds for un-
confirmed vulnerabilities, and the average of 5 folds for confirmed
vulnerabilities. Since the number of confirmed vulnerabilities is                       outputs a dense vector to the first DNN hidden layer. Fig. 4 shows
significantly lower then the number of unconfirmed vulnerabilities,                     various embedding sizes of 64, 256 and 1024 for a 3-layer DNN
we found that 3 folds were not sufficient for confirmed vulnerabili-                    with N=500, trained to predict unconfirmed vulnerabilities. Again,
ties, and thus used 5 folds for these experiments. We also found that                   we did not find a significant difference between embedding layer
using the entire training dataset was not required for convergence.                     sizes, and chose the smallest embedding size of 64 for all future
We monitor the performance of our models during training, and                           experiments to minimize size and inference time in our use case.
ultimately decide that, for each fold, using 20% of the available                       5.1.2 Model size. We explored the effect of model size by varying
training data (16% of the overall dataset) was sufficient.                              the size of the hidden layers in the [N, N/2, N/4] DNN architecture.
                                                                                        For both unconfirmed and confirmed vulnerabilities, we trained
5.1       Model size and type                                                           DNNs where N = 100, 200, 500, 1000, and 2000. The results for
We experimented with different sizes of deep neural network mod-                        unconfirmed vulnerabilities are shown in Fig. 5a and the results for
els. For these experiments, we report results for a 3-layer, fully-                     confirmed vulnerabilities are shown in Fig. 5b. As expected, the per-
connected DNN. For each architecture, we conventionally halve                           formance in predicting unconfirmed vulnerabilities is significantly
the layer size after each layer, resulting in a fully connected ar-                     better than when predicting confirmed vulnerabilities. Across both
chitecture with layer sizes of [N, N/2, N/4], where N is the size of                    experiments, we found that the model size also did not have a sig-
the first hidden layer. We also experimented with linear models                         nificant impact on the performance of the data. Since decreasing
and compared their performance to our DNNs. Fig. 3 highlights                           the model size does not adversely affect the prediction performance,
the different components of our ML architecture, and shows the                          we choose to use the smallest evaluated model architecture with
various hyper-parameters that we evaluate.                                              (3 hidden layers of size 100, 50, and 25) in further experiments for
                                                                                        both confirmed and unconfirmed vulnerabilities.
5.1.1 Embedding size. We first experimented with the size of the
embedding layer in our neural network, described in Sec. 4.2.5. The                     5.1.3 Model size trade-offs. In our proposed use case, smaller mod-
embedding layer is a dense, fully-connected layer that translates                       els are preferred due to their low inference time and small stor-
the sparse tokens in hashed space (218 in our implementation) and                       age size. Without any optimization, the size of our chosen model
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                               William Melicher, Clement Fung, Lujo Bauer, and Limin Jia


Table 2: Model sizes and inference times for various archi-               confirmed vulnerabilities are shown in Fig. 6. In both cases, the
tectures. The results for our final selected configuration (100           neural network model far outperforms the linear model.
units, 64 unit embedding) is bolded.                                         For example, when the prediction thresholds are set such that
                                                                          50% of confirmed vulnerabilities are detected, the logistic regression
                                                     Inference Time       model has a precision of 6.7%, while the DNN has a precision of
 Embedding First hidden DNN size
                                                             on GPU /     44.1%. For unconfirmed vulnerabilities, the precisions are 22.4% and
 layer units layer units on disk
                                                    Desktop / Laptop      82.5% respectively. In both cases, the precision of the linear model
            256                 500       258 MB     12𝜇s / 28𝜇s / 45𝜇s   drops to nearly 0% for recall rates over 90%, indicating a failure to
           1024                 500      1027 MB    13𝜇s / 50𝜇s / 105𝜇s   capture higher complexity vulnerabilities; this trend is discussed in
             64                 100        65 MB    11𝜇s / 17𝜇s / 34𝜇s    more detail in Sec. 6.3. We hence conclude that a linear model is
             64                 200        65 MB     11𝜇s / 19𝜇s / 36𝜇s   not competitive with a DNN at detecting DOM XSS vulnerabilities.
             64                 500        65 MB     11𝜇s / 23𝜇s / 39𝜇s
             64                1000        67 MB     11𝜇s / 27𝜇s / 48𝜇s
             64                2000        75 MB    12𝜇s / 46𝜇s / 100𝜇s   5.2    Final models
                                                                          Using the best-performing combination of our parameters, we train
                                                                          two final models, one to detect unconfirmed vulnerabilities (as
                                                                          labeled by taint tracking) and one trained on confirmed vulnera-
                                                                          bilities (as labeled by testing with proof-of-concept exploits). The
                                                                          final models use a deep neural network with 3 layers—with 100, 50,
                                                                          and 25 units, respectively—trained on 20% of the available data.

                                                                          5.2.1 Detecting vulnerabilities. The final results are shown in Fig. 7.
                                                                          For the model trained on unconfirmed vulnerabilities, when the
                                                                          threshold is set such that the true recall is 95%, the resulting preci-
          (a) Unconfirmed                         (b) Confirmed
                                                                          sion is 26.7%. For confirmed vulnerabilities, a true recall of 95% of
                                                                          confirmed vulnerabilities exhibits an ineffective precision of 0.4%;
Figure 6: Performance of linear (Lin) and deep neural net-                the performance is poor likely because confirmed vulnerabilities
work (NN) models when predicting unconfirmed vulnerabil-                  are far less common than unconfirmed vulnerabilities.
ities (left) and confirmed vulnerabilities (right).                          Since we are more interested in the trade-off of the models’ false-
                                                                          positive and false-negative rates than in high accuracy, we show the
                                                                          trade-off between the raw false-positive and true-positive rates as
is 65MB. Since most of our models are small enough to be fully
                                                                          an ROC curve in Fig. 7. This is more meaningful when considering
processed within our 12GB GPU, the inference time is largely un-
                                                                          using such a model in practice, since a browser vendor would tune
affected by model size. To better understand the overhead of our
                                                                          the model based on their tolerance towards false negatives, trading
model in other settings, we also measure the inference time on
                                                                          a higher recall for a lower precision.
commodity non-GPU hardware and show the results in Table 2. For
                                                                             As we show in Sec. 6.1, the performance of the model trained
our chosen model with N = 100 and an embedding size of 64, the
                                                                          to predict unconfirmed vulnerabilities is sufficient such that it can
average time to classify a function is 11𝜇s on our 24GB RAM, 4 core
                                                                          be combined with taint tracking for a more efficient defense than
Intel i5-6400 3.30GHz CPU with a Titan X Pascal 12GB GPU, 17𝜇s
                                                                          taint tracking alone. Further, we show in Sec. 6.2 that some of the
with a 32GB RAM, 12 core Intel E-2136 4.50GHz CPU desktop, and
                                                                          apparent false positives in our models are actually correct predic-
34𝜇s for a 8GB RAM, 8 core Intel i5-8250U 3.30GHz CPU laptop. We
                                                                          tions (i.e., true positives), and are mislabeled in our dataset by the
ultimately relate these numbers to potential end-to-end overhead
                                                                          ground truth data collection methodology.
savings when combining ML with taint tracking in Sec. 6.1.
   The model size and inference time can be further reduced through
                                                                          5.2.2 Previously unseen functions. Because our evaluation involves
different model encodings, compression techniques, and quantiza-
                                                                          splitting our data into training, validation, and test datasets by
tion. Prior work has shown that these techniques can enable deep
                                                                          unique scripts, functions may be duplicated across the training data
neural network sizes to be reduced by two orders of magnitude [27].
                                                                          and the test data. To understand the potential effect of duplication,
Recently, TensorFlow has released libraries that enable DNNs to be
                                                                          we tested our models’ performance on functions that did not appear
compressed for inference on IoT and mobile devices [42], further
                                                                          in training data. For both our unconfirmed and confirmed vulner-
improving the overhead savings and extending the potential reach
                                                                          ability test datasets, we removed any function that was an exact
of our solution to detect DOM XSS vulnerabilities in other domains.
                                                                          match for a function that existed in any other script, forcing our
5.1.4 Model types. We compared our trained DNNs to logistic               models to only classify previously unseen functions. Our test data
regression models, which predict vulnerabilities based solely on          overall contains 48 million distinct functions. Once duplicated func-
a weighted linear combination of the observed code tokens (in             tions are removed, we test on the remaining 12 million previously
our 218 hash space). If linear models are able to accurately detect       unseen functions (average across all folds).
vulnerabilities, it would obviate the need for using a more complex          Fig. 7 shows the results when predicting on previously unseen
DNN. The results in predicting unconfirmed vulnerabilities and            functions. For confirmed vulnerabilities, the performance of the
Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning                 WWW ’21, April 19–23, 2021, Ljubljana, Slovenia




                                                      Figure 7: Model performance for test data.


model is only slightly different when predicting on previously un-
seen data, as shown by the similar performance across all true
recall values beyond 40%. For example, when predicting confirmed
vulnerabilities at 75% recall, our model has 12.1% precision across
all vulnerabilities, and 13.7% precision when limited to previously
unseen vulnerabilities. However, for unconfirmed vulnerabilities,
there is a more pronounced effect, as shown in the large differ-
ence in performance between 40% and 80% recall when considering
unseen functions. For example, at 75% recall the model has 77.6%
precision across all vulnerabilities and 52.6% precision across previ-
ously unseen vulnerabilities, a difference of 25%.

6     DISCUSSION
We first revisit our research questions and discuss what our results                  Figure 8: The trade-off between the recall of confirmed vul-
imply when using our classifiers to detect DOM XSS in practice                        nerabilities and the fraction of all functions (weighted or dis-
(Sec. 6.1). We then examine some seemingly incorrect predictions                      tinct) examined by taint tracking.
made by our classifier and show that many predictions were marked
as incorrect due to noise in ground truth data, suggesting that our
results may be better than reported (Sec. 6.2). Finally, we compare                       When our classifier is tuned such that 11.1% of total functions
the behavior of our linear model with our DNNs and present po-                        are further examined by taint tracking, 99.8% of confirmed vulner-
tential characteristics of DOM XSS vulnerabilities that are easy or                   abilities are ultimately captured. When considering only distinct
difficult to capture with simple models (Sec. 6.3).                                   functions, the classifier can pass 2.5% of distinct functions to taint
                                                                                      tracking and capture 94.5% of distinct confirmed vulnerabilities.
6.1     Using ML classifiers to detect DOM XSS                                            A challenge when selectively executing taint tracking in a run-
Our research questions asked whether ML classifiers could help in                     time setting is that the source of the tainted flow needs to be iden-
effectively detecting DOM XSS vulnerabilities, either in combina-                     tified. Prior work has explored the automatic detection of tainted
tion with taint tracking (RQ1) or as a sole defense (RQ2).                            sources based on sensitive sinks [10, 48] and we leave the combina-
                                                                                      tion of such techniques with our classifier as future work.
6.1.1 RQ1: A classifier as a filter for taint tracking. To examine the                    Based on these results, we envision two use cases in which our
potential utility of an ML classifer that selectively enables taint                   ML classifier could be deployed to reduce the overhead of taint
tracking when an unconfirmed vulnerability is predicted, we com-                      tracking: run-time detection and analysis of large codebases.
pute how many real, confirmed, vulnerabilities would be success-
fully detected by the combination of ML and taint tracking. We                          Run-time detection of unconfirmed vulnerabilities. We consider
use the classifier trained on unconfirmed vulnerabilities (dataset #1)               the time saved when using a classifier in combination with taint
and measure the proportion of the resulting predictions that are                     tracking as a run-time defense in a web browser, compared to using
later confirmed by the proof-of-concept exploit.                                     just taint tracking.
   The recall in our method is tunable: if desired, the model can                       To practically measure the performance in a run-time setting,
be tuned to capture a higher fraction of vulnerabilities, at the cost                we consider the performance based on observed scripts. Let 𝑛 func
of additional taint tracking overhead. Fig. 8 shows the recall of                    represent the number of functions in a script, 𝑜 taint represent the
confirmed vulnerabilities as we vary the proportion of functions                     added overhead from taint tracking, 𝑡 func represent the average
passed to taint tracking for examination. We consider use cases                      time taken to execute a single function, and 𝑡 conf represent the time
where the classifier is used on all functions (weighted recall) and                  taken to perform a proof-of-concept exploit on a single function.
when the classifier is only used on distinct functions (distinct recall).            A fraction of the functions executed with taint tracking enabled,
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                                                                            William Melicher, Clement Fung, Lujo Bauer, and Limin Jia


𝑝 conf , will be marked as containing unconfirmed vulnerabilities. Be-                 Table 3: Per-function reduction in browser overhead when
cause many of these are false positives, we must determine whether                     using our classifier as a pre-filter to taint tracking compared
each function is actually vulnerable through proof-of-concept ex-                      to taint tracking alone.
ploits [26, 38]. In prior work [26], 𝑝 conf = 0.0133 and 𝑡 conf = 2 ∗𝑡 func .
When considering an individual script, the added time from taint                                                                                    Inference                               Cached
                                                                                                                                   Device                                  Savings
tracking can be modeled as follows:                                                                                                                Time (𝑡 ML )                             Savings
                                                                                                                          Laptop (CPU)                   34𝜇s                   1.07×         1.18×
         𝑡 added = 𝑜 taint · 𝑡 func · 𝑛 func + (2 · 𝑝 conf · 𝑡 func · 𝑛 func )   (1)                                     Desktop (CPU)                   17𝜇s                   1.91×         2.29×
                                                                                                                         Desktop (GPU)                   11𝜇s                   2.66×         3.43×
   If ML is combined with taint tracking, each executed function
incurs 𝑡 ML overhead for a classifier prediction, and only a fraction
of functions, 𝑝 taint , is predicted to have unconfirmed vulnerabilities                                                 Laptop (t_ml = 0.034ms)          Desktop (t_ml = 0.017ms)        GPU (t_ml = 0.011ms)

and is further analyzed as above with taint tracking and proof-                                                  4




                                                                                              Overhead savings
of-concept exploits. If any script is predicted to contain at least                                              3



one unconfirmed vulnerability, we assume that taint tracking will                                                2


be enabled for the entire script. Thus, we estimate the fraction of                                              1


scripts passed to taint tracking to be 1 − (1 − 𝑝 taint )𝑛func , making the                                      0
                                                                                                                     0         5         10        15           20         25        30        35         40

added execution time of the combination of ML with taint tracking:                                               4




                                                                                       Overhead savings
                                                                                                                 3
          ′



                                                                                           Cached
        𝑡 added = (𝑡 ML · 𝑛 func ) + (1 − (1 − 𝑝 taint )𝑛func ) ∗ 𝑡 added        (2)                             2


                                                                                                                 1

     For the overhead from the combination of ML with taint tracking
                                                                                                                 0
   ′
(𝑡 added ) to be lower than the overhead from taint tracking alone                                                   0         5         10        15           20         25        30        35         40
                                                                                                                                                        # functions in script
(𝑡 added ), a large majority of scripts must not need to be analyzed
with taint tracking, yet the recall of the classifier should be high
                                                                                       Figure 9: The changes in overhead savings without caching
enough to capture most vulnerabilities.
                                                                                       (top) and with caching (bottom) when considering the ex-
     To estimate 𝑜 taint and 𝑡 func , we manually load the top 50 websites
                                                                                       pected number of functions in a given script. As the number
from the Alexa 10K [2] and observe that the average slowdown from
                                                                                       increases, a script is more likely to require taint tracking, so
the taint-tracking-enabled-browser (which looks at all executed
                                                                                       the overhead savings is reduced.
scripts) is 16.8%. When aggregating across all scripts, the average
time taken to execute a single function is 0.213ms. A proof-of-
concept confirmation results in a function being executed at least                         Analyzing large codebases. Another potential use of our classifier
one additional time, with additional overhead for customizing the                      is to enable analysis of large codebases, such as software reposito-
exploit [26], so we estimate 𝑡 conf = 0.416ms, twice the original                      ries, for which dynamic analysis would be prohibitively expensive.
execution time. When considering the analysis in Fig. 8, 𝑝 taint =                     If, in a similar scenario as above, we analyzed all the functions in
0.111 for a recall of 99.8% of confirmed vulnerabilities. We also                      our dataset with taint tracking, the analysis would take over 7.8
consider that classifier results could be cached, preventing the need                  days (0.0358ms per function × 19 billion functions). In contrast,
to analyze duplicated functions. This would result in 𝑝 taint = 0.025                  if ML is used to discard predicted true negatives and taint track-
for a recall of 94.5% of distinct confirmed vulnerabilities.                           ing is applied only to the remaining functions, the whole process
     In Sec. 5.1 we showed that 𝑡 ML varies by the hardware used. We                   would require less than 1 day, while maintaining a 99.8% recall of
calculate the difference between 𝑡 added and 𝑡 added′    for each of these             vulnerabilities as described above.
scenarios and report the reduction in overhead in Table 3. For a
single function, this ranges from 1.07× on our laptop to 3.43× with                    6.1.2 RQ2: A classifier as the sole defense. If we were to use our
caching on a desktop with a GPU machine.                                               classifier as the sole method to detecting DOM XSS vulnerabilities,
     As the number of functions in a script increases, the probability                 the classifier would need a high precision and a high recall, since
that at least one function in the script will require taint tracking                   false positives would likely hinder practical use. Unfortunately,
also increases, decreasing the estimated savings in overhead; we                       tuning our classifier trained on confirmed vulnerabilities for a high
show this trend in Fig. 9. In our datasets, scripts contained 161                      recall produces a high false positive rate, and tuning our model for
functions on average, with a median of 2: a small number of scripts                    high precision causes a large false negative rate.
contain many functions, but most contain few. Our proposed so-                            For example, to capture 95% of confirmed vulnerabilities with
lution performs better for the majority of scripts, which have few                     our classifier, the corresponding precision is 0.4%, which results
functions.                                                                             in far too many false positives for practical use. Conversely, the
     In practice, the overhead reduction is likely to be higher than                   classifier can be tuned to achieve a precision of 75%, but this only
what we report. First, we estimated the in-browser taint tracking                      captures 19.4% of confirmed vulnerabilities. For a compromise of
overhead based on differences in load time, which includes fixed                       both precision and recall, a “good” tuning of this model could exhibit
costs beyond JavaScript execution; the true overhead is likely higher.                 57.8% precision at 50% recall.
Second, the ML prediction is not dependent on JavaScript execution                        For all the tunings we considered, either the precision or the
and could be run in parallel with other tasks.                                         recall are insufficient for most practical uses. Hence, while we
Towards a Lightweight, Hybrid Approach for Detecting DOM XSS Vulnerabilities with Machine Learning                WWW ’21, April 19–23, 2021, Ljubljana, Slovenia


Table 4: Tokens corresponding to top ten most influen-                                6.3     Uncovering properties of vulnerabilities
tial features of the three linear models trained on uncon-
                                                                                     Our results in Sec. 5.1 demonstrated the ineffectiveness of linear
firmed vulnerabilities. Higher weights indicate tokens that
                                                                                     models in predicting DOM XSS vulnerabilities. However, we still
are more influential towards predicting a vulnerability.
                                                                                     observed that, at a 50% recall rate, over 1 million unconfirmed vul-
                                                                                     nerabilities were detected by the linear model at a reasonable (21%)
                                                             Average                 precision. This suggests that some vulnerabilities have properties
           Token
                                                              Weight                 that make them easier to detect than others, and in this section we
       1   “write”                                              18.45                report on a manual analysis that explored such properties.
       2   “eval”                                               10.43                    Poor performance aside, a benefit of linear models is that their
       3   “<iframe src=’{src}’ width=’0’ height=’0’             8.91                model weights correspond directly to the influence that particular
           style=’display:none;’></iframe>”                                          features have on the prediction output. Thus, for the three linear
       4   “class="student-receiver" type="group"                  7.70              models trained on unconfirmed vulnerabilities, we analyzed the
           hex=”                                                                     most influential features for predicting a vulnerability. Each feature
       5   “innerHTML”                                             6.93              corresponds to one of the 218 hash buckets over the bag-of-words
       6   “/home-page”                                            6.71              representation, so we further analyze our test data to find the most
       7   “<!–[if gt IE”                                          6.51              frequent tokens that map to these hash buckets, shown in Table 4.
       8   “focusin”                                               6.09              Eight of the top ten tokens are shared among all three models.
       9   “]><i></i><![endif]–> ”                                 5.75                  We make two observations based on these findings. First, “write”
      10   “text/html”                                             5.52              and “eval” are the most significant two tokens for all models by
                                                                                     a large margin. We re-compared the outputs of our linear model
                                                                                     and our neural network (from Fig. 6a) at their 50% recall rates, and
                                                                                     consider only the vulnerabilities that contain “write” or “eval”. Al-
                                                                                     though the total number of true positives identified by both models
answer RQ1 positively, we come to the opposite conclusion for                        is approximately the same, the linear model has a much larger false
RQ2: the classifier designs we investigated are by themselves not                    positive rate; the linear model’s precision is 22.4%, compared to the
yet a practical method of detecting DOM XSS vulnerabilities.                         DNN precision of 82.5%. At these operating points, 67% of the linear
                                                                                     model’s unique true positives contain “write”, while only 34.7% of
                                                                                     the neural networks’ do. We repeated this exercise for “eval”; the
6.2     Accuracy in the face of noisy ground truth
                                                                                     difference between the two models was minimal.
A challenge in detecting DOM XSS vulnerabilities was the absence                         Linear models may be biased toward identifying any functions
of ground truth data that reliably labels vulnerable JavaScript func-                that invoke document.write as vulnerable. This is common in prac-
tions. We nevertheless showed (RQ1) that an ML classifier could be                   tice, as we observed that 60% of our unique unconfirmed vulnera-
trained to be an effective and efficient defense, when used in combi-                bilities contain “write”. Linear models are thus much more prone
nation with dynamic taint tracking. Here we revisit the sources of                   to identify functions as vulnerable even when their uses of docu-
inaccuracy from ground truth data and manually examine a subset                      ment.write are safe, leading to high false positive rates. In contrast,
of the classifier’s false positives and false negatives.                             the DNN models appear to learn a more nuanced relationship for
   One source of noise in our ground truth data comes from dynamic                   cases with “write”.
taint tracking; vulnerabilities that are on unexecuted paths during                      Second, we noticed that for linear models many of the most
data collection are mislabeled as safe, since taint tracking would                   influential tokens contain long HTML strings that appear in the
have had no opportunity to detect that they are vulnerable. Another                  JavaScript code as string constants (tokens 3, 4, 7, and 9 in Ta-
source of noise from our data collection is that we use separate                     ble 4). We searched for these tokens across all public JavaScript
phases to detect unconfirmed vulnerabilities and to confirm them.                    repositories on GitHub and found that these tokens occur in fre-
For highly dynamic web sites, content may change between the two                     quently copied and imported JavaScript libraries. In all cases, a
phases. In these false positive cases, a function that was initially                 JavaScript variable is appended to these HTML strings and the
labeled as a unconfirmed vulnerability may fail to be labeled as a                   result is directly written to the document, exposing a clear DOM
confirmed vulnerability, simply because it was no longer available                   XSS vulnerability. Linear models are also well suited to identify
on the site during the confirmation phase.                                           and capture these cases with ease, even though they do not directly
   We surprisingly observed that the precision of confirmed vul-                     encode any problematic code semantics that would generally be
nerabilities is low even at low recall values (as seen in Fig. 5b and                indicative of vulnerabilities.
Fig. 7), where one would expect high precision at the cost of low                        DNN models were also able to capture these pathological cases,
coverage. This indicates that even some of the model’s most confi-                   but additionally achieved much higher precision than linear models.
dent positive predictions were incorrect. We manually investigated                   The precision of linear models was particularly poor outside of a
ten of the model’s most confident false positives and found that                     small subset of vulnerabilities. This suggests that a large majority
seven of the ten errors were incorrectly labeled because of the data                 of DOM XSS vulnerabilities are still complex enough that a DNN is
collection issues mentioned above; these seven “errors” were in fact                 required to precisely model their characteristics.
true positives. This suggests that our classifier’s performance may
be much better than what we report.
WWW ’21, April 19–23, 2021, Ljubljana, Slovenia                                                                          William Melicher, Clement Fung, Lujo Bauer, and Limin Jia


7     CONCLUSION                                                                                    16/09/reshaping-web-defenses-with-strict.html.
                                                                                               [19] M. Koster. 2017. The Web Robots pages. https://www.robotstxt.org/
We examined two approaches for ML classifiers to detect DOM XSS                                [20] K. Kotowicz. 2019. Trusted types help prevent cross-site scripting. https://develo
vulnerabilities in source code: (1) using ML as a filter for scripts                                pers.google.com/web/updates/2019/02/trusted-types.
                                                                                               [21] Scikit Learn. 2019. Feature Extraction. https://scikit-learn.org/stable/modules/f
before using taint tracking (RQ1); and (2) using just an ML classifier                              eature_extraction.html.
to detect DOM XSS vulnerabilities directly (RQ2). We collected and                             [22] S. Lekies, B. Stock, and M. Johns. 2013. 25 million flows later: Large-scale de-
labeled 18 billion JavaScript functions in a large-scale web crawl                                  tection of DOM-based XSS. In Proc. ACM SIGSAC Conference on Computer and
                                                                                                    Communications Security.
and trained ML models on representations of their source code.                                 [23] Y. Li, R. Zemel, M. Brockschmidt, and D. Tarlow. 2016. Gated graph sequence
   We found that classifiers could be trained to detect DOM XSS                                     neural networks. In Proc. International Conference on Learning Representations.
vulnerabilities with sufficient recall and precision that using them as                        [24] Z. Li, D. Zou, S. Xu, X. Ou, H. Jin, S. Wang, Z. Deng, and Y. Zhong. 2018. VulDeeP-
                                                                                                    ecker: A deep learning-based system for vulnerability detection. In Proc. Network
a pre-filter for a taint-tracking-based defense substantially reduces                               and Distributed System Security Symposium.
the overhead of DOM XSS detection. For example, the overhead of                                [25] B. Liang, M. Su, W. You, W. Shi, and G. Yang. 2016. Cracking classifiers for evasion:
                                                                                                    A case study on the Google’s phishing pages filter. In Proc. International World
DOM XSS detection in a web browser context could be reduced by                                      Wide Web Conference.
3.43× compared to using taint tracking alone. We argue that this                               [26] W. Melicher, A. Das, M. Sharif, L. Bauer, and L. Jia. 2018. Riding out DOMsday:
enables new uses for taint-tracking-based DOM XSS detection in                                      Toward detecting and preventing DOM cross-site scripting. In Proc. Network and
                                                                                                    Distributed System Security Symposium.
contexts with strict performance requirements.                                                 [27] W. Melicher, B. Ur, S.M. Segreti, S. Komanduri, L. Bauer, N. Christin, and L.F.
                                                                                                    Cranor. 2016. Fast, lean, and accurate: Modeling password guessability using
                                                                                                    neural networks. In Proc. USENIX Security Symposium.
ACKNOWLEDGMENTS                                                                                [28] L. Mou, G. Li, L. Zhang, T. Wang, and Z. Jin. 2016. Convolutional neural net-
We thank Michael Stroucken and Yoshiki Takashima for help with                                      works over tree structures for programming language processing. In Proc. AAAI
                                                                                                    Conference on Artificial Intelligence.
the web crawl and experiments. This work was supported in part by:                             [29] Open Web Application Security Project. 2016. Web application firewall. https:
gifts from John & Claire Bertucci and Google; CyLab at Carnegie                                     //www.owasp.org/index.php/Web_Application_Firewall.
Mellon University via a CyLab Presidential Fellowship; and the                                 [30] S. Di Paola. 2011. DOMinator. https://github.com/wisec/DOMinator.
                                                                                               [31] I. Parameshwaran, E. Budianto, S. Shinde, H. Dang, A. Sadhu, and P. Saxena. 2015.
National Science Foundation via grant CNS1704542.                                                   DexterJS: Robust testing platform for DOM-based XSS vulnerabilities. In Proc.
                                                                                                    Joint Meeting on Foundations of Software Engineering.
                                                                                               [32] G. Podjarny. 2017. Snyk blog: XSS attacks: The next wave. https://snyk.io/blog/x
REFERENCES                                                                                          ss-attacks-the-next-wave/.
 [1] Martín Abadi, Paul Barham, Jianmin Chen, Zhifeng Chen, Andy Davis, Jeffrey                [33] pythech’s Blog. 2017. Yet another Chrome XSS auditor bypass. https://turkmeno
     Dean, Matthieu Devin, Sanjay Ghemawat, Geoffrey Irving, Michael Isard, Man-                    g.lu/blog/2017/11/06/yet-another-chrome-xss-auditor-bypass/.
     junath Kudlur, Josh Levenberg, Rajat Monga, Sherry Moore, Derek G. Murray,                [34] P. Ratanaworabhan, B. Livshits, and B. Zorn. 2009. NOZZLE: A defense against
     Benoit Steiner, Paul Tucker, Vijay Vasudevan, Pete Warden, Martin Wicke, Yuan                  heap-spraying code injection attacks. In Proc. USENIX Security Symposium.
     Yu, and Xiaoqiang Zheng. 2016. TensorFlow: A System for Large-Scale Ma-                   [35] G. Richards, S. Lebresne, B. Burg, and J. Vitek. 2010. An analysis of the dynamic
     chine Learning. In Proc. USENIX Conference on Operating Systems Design and                     behavior of JavaScript programs. In ACM Sigplan Notices, Vol. 45. 1–12.
     Implementation.                                                                           [36] N. Rndic and P. Laskov. 2014. Practical evasion of a learning-based classifier: A
 [2] Alexa. 2017. Top sites in United States. alexa.com/topsites/countries/US.                      case study. In Proc. IEEE Symposium on Security and Privacy.
 [3] M. Allamanis, M. Brockschmidt, and M. Khademi. 2018. Learning to Represent                [37] D. She, Y. Chen, A. Shah, B. Ray, and S. Jana. 2020. Neutaint: Efficient dynamic
     Programs with Graphs. In Proc. Int’l. Conference on Learning Representations.                  taint analysis with neural networks. In Proc. IEEE Symposium on Security and
 [4] U. Alon, M. Zilberstein, O. Levy, and E. Yahav. 2019. code2vec: Learning dis-                  Privacy.
     tributed representations of code. Proc. ACM on Programming Languages (2019).              [38] B. Stock, S. Lekies, T. Mueller, P. Spiegel, and M. Johns. 2014. Precise client-
 [5] P. Bielik, V. Raychev, and M. Vechev. 2017. Learning a static analyzer from data.              side protection against DOM-based cross-site scripting. In Proc. USENIX Security
     In Proc. International Conference on Computer Aided Verification.                              Symposium.
 [6] B. Biggio, B. Nelson, and P. Laskov. 2012. Poisoning attacks against support              [39] B. Stock, S. Pfistner, B. Kaiser, S. Lekies, and M. Johns. 2015. From facepalm to
     vector machines. In Proc. International Conference on Machine Learning.                        brain bender: exploring client-side cross-site scripting. In Proc. ACM SIGSAC
 [7] K. Bijjou. 2015. Web application firewall bypassing—how to defeat the blue team.               Conference on Computer and Communications Security.
     OWASP open web application security project.                                              [40] L. Suto. 2013. Analyzing the accuracy and time costs of web application security
 [8] S. Calzavara, A. Rabitti, and M. Bugliesi. 2016. Content security problems?:                   scanners. https://www.beyondtrust.com/assets/documents/bt/Analyzing-the-
     Evaluating the effectiveness of content security policy in the wild. In Proc. ACM              Accuracy-and-Time-Costs-of-Web-Application-Security-Scanners.pdf.
     SIGSAC Conference on Computer and Communications Security.                                [41] A. Taly, Ú. Erlingsson, J.C. Mitchell, M.S. Miller, and J. Nagra. 2011. Automated
 [9] Cenzic, Inc. 2014. Application vulnerability trends report. https://www.info-                  Analysis of Security-critical JavaScript APIs. In Proc. IEEE Symposium on Security
     point-security.com/sites/default/files/cenzic-vulnerability-report-2014.pdf.                   and Privacy.
[10] V. Chibotaru, B. Bichsel, V. Raychev, and M. Vechev. 2019. Scalable taint specifica-      [42] Tensorflow. 2020. Tensorflow Lite—ML for mobile and edge devices. https:
     tion inference with big code. In Proc. ACM SIGPLAN Conference on Programming                   //www.tensorflow.org/lite.
     Language Design and Implementation.                                                       [43] O. Tripp, P. Ferrara, and M. Pistoia. 2014. Hybrid security analysis of web
[11] Chromium. 2010. The Chromium projects: XSS auditor. https://www.chromium                       JavaScript code via dynamic partial evaluation. In Proc. International Symposium
     .org/developers/design-documents/xss-auditor.                                                  on Software Testing and Analysis.
[12] C. Curtsinger, B. Livshits, B. Zorn, and C. Seifert. 2011. ZOZZLE: Fast and precise       [44] O. Tripp, S. Guarnieri, M. Pistoia, and A. Aravkin. 2014. ALETHEIA: Improving
     in-browser JavaScript malware detection. In Proc. USENIX Security Symposium.                   the usability of static security analysis. In Proc. ACM SIGSAC Conference on
[13] Foundeo, Inc. 2018. Content Security Policy reference. https://content-security-               Computer and Communications Security.
     policy.com/.                                                                              [45] O. Tripp, M. Pistoia, S.J. Fink, M. Sridharan, and O. Weisman. 2009. TAJ: Effec-
[14] S. Guarnieri, M. Pistoia, O. Tripp, J. Dolby, S. Teilhet, and R. Berg. 2011. Saving the        tive taint analysis of web applications. In Proc. ACM SIGPLAN Conference on
     World Wide Web from vulnerable JavaScript. In Proc. International Symposium                    Programming Language Design and Implementation.
     on Software Testing and Analysis.                                                         [46] K. Weinberger, Anirban Dasgupta, John Langford, Alex Smola, and Josh Attenberg.
[15] Hackerone. 2017. The Hacker-powered security report 2017. https://www.hack                     2009. Feature hashing for large scale multitask learning. (2009).
     erone.com/sites/default/files/2017-06/The%20Hacker-Powered%20Security%2                   [47] F. Yamaguchi, F. Lindner, and K. Rieck. 2011. Vulnerability extrapolation: Assisted
     0Report.pdf.                                                                                   discovery of vulnerabilities using machine learning. In Proc. USENIX Workshop
[16] T. Hunt. 2013. Understanding XSS – input sanitisation semantics and output                     on Offensive Technologies.
     encoding contexts. www.troyhunt.com/understanding-xss-input-sanitisation.                 [48] F. Yamaguchi, A. Maier, H. Gascon, and K. Rieck. 2015. Automatic inference of
[17] V. Ivanov. 2016. Web application firewalls: Attacking detection logic mechanisms.              search patterns for taint-style vulnerabilities. In Proc. IEEE Symposium on Security
     Blackhat USA.                                                                                  and Privacy.
[18] A. Janc, M. Spagnuolo, L. Weichselbaum, and D. Ross. 2016. Reshaping web
     defenses with strict Content Security Policy. https://security.googleblog.com/20
