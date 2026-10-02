---
type: Article
title: "DiffCSP: Finding Browser Bugs in Content Security Policy Enforcement through Differential Testing"
resource: "https://www.ndss-symposium.org/ndss-paper/diffcsp-finding-browser-bugs-in-content-security-policy-enforcement-through-differential-testing/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:41:30+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/diffcsp-finding-browser-bugs-in-content-security-policy-enforcement-through-differential-testing/"
    title: "DiffCSP: Finding Browser Bugs in Content Security Policy Enforcement through Differential Testing"
    author: Seongil Wi, Trung Tin Nguyen, Jihwan Kim, Ben Stock, Sooel Son
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2023-200-paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/2024/10/ndss2023-200-slides.pdf"
authors:
  - Seongil Wi
  - Trung Tin Nguyen
  - Jihwan Kim
  - Ben Stock
  - Sooel Son
canonical_url: ""
cited_by:
  - "2023.md:83"
commit: ""
content_sha256: bd556b7d0cc9c779d6ff9491655a802b8342624387bc18db1c5647ba4bea50ad
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/diffcsp-finding-browser-bugs-in-content-security-policy-enforcement-through-differential-testing/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 078ded88d10dc5e46f5bec327ed36dd5eddc0159d76d31d419ffc11dd91ec80a
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2023-200-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:41:30+00:00"
slug: ndss-symposium-diffcsp-finding-browser-bugs-content-security-policy-testing
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# DiffCSP: Finding Browser Bugs in Content Security Policy Enforcement through Differential Testing

**DiffCSP: Finding Browser Bugs in Content Security Policy Enforcement through Differential Testing** - Seongil Wi, Trung Tin Nguyen, Jihwan Kim, Ben Stock, Sooel Son, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/diffcsp-finding-browser-bugs-in-content-security-policy-enforcement-through-differential-testing/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2023-200-paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2024/10/ndss2023-200-slides.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2023-200-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

DiffCSP: Finding Browser Bugs in Content Security
  Policy Enforcement through Differential Testing

                            Seongil Wi∗ , Trung Tin Nguyen†‡ , Jihwan Kim∗ , Ben Stock† , Sooel Son∗
                                                      ∗ School of Computing, KAIST
                                          † CISPA Helmholtz Center for Information Security
                                       ‡ Computer Science Graduate School, Saarland University



    Abstract—The Content Security Policy (CSP) is one of the            1   XSS attack payload:
                                                                        2     http://[Target URL]/PoC.html#javascript:alert('XSS')
de facto security mechanisms that mitigate web threats. Many            3   CSP: script-src-elem 'sha256-aHbTR...';
websites have been deploying CSPs mainly to mitigate cross-             4   Target website:
site scripting (XSS) attacks by instructing client browsers to          5   <script>
constrain JavaScript (JS) execution. However, a browser bug             6     let hash = window.location.hash.slice(1);
                                                                        7     window.location.href = hash;
in CSP enforcement enables an adversary to bypass a deployed            8   </script>
CSP, posing a security threat. As the CSP specification evolves,
CSP becomes more complicated in supporting an increasing                Fig. 1: An HTML instance that triggers a bug in Chrome; the
number of directives, which brings additional complexity to             adversary bypasses CSP enforcement by exploiting this bug.
implementing correct enforcement behaviors. Unfortunately, the
finding of CSP enforcement bugs in a systematic way has been               CSP has been increasingly deployed on the Web. Most
largely understudied.                                                   CSPs are meant to mitigate the impact of cross-site script-
    In this paper, we propose DiffCSP, the first differential testing   ing (XSS) attacks by limiting the sources from which an
framework to find CSP enforcement bugs involving JS execution.          adversary can draw their injected scripts. Weichselbaum et al.
DiffCSP generates CSPs and a comprehensive set of HTML                  demonstrated that 1,680,000 Internet hosts deployed a CSP,
instances that exhibit all known ways of executing JS snippets.         and 86% of the unique CSPs that they crawled were designed
DiffCSP then executes each HTML instance for each generated             to mitigate XSS threats [70]. Roth et al. also showed that by
policy across different browsers, thereby collecting inconsistent       2019, 1,233 out of the 10,000 popular sites listed in the Internet
execution results. To analyze a large volume of the execution           Archive had deployed a CSP [58].
results, we leverage a decision tree and identify common causes
of the observed inconsistencies. We demonstrate the efficacy of             Due to the nature of a client-side security mechanism, CSP
DiffCSP by finding 29 security bugs and eight functional bugs. We       depends on browsers to honor a given policy and correctly
also show that three bugs are due to unclear descriptions of the        govern the inclusion of web resources according to the policy.
CSP specification. We further identify the common root causes           In particular, CSP plays a crucial role in mitigating XSS
of CSP enforcement bugs, such as incorrect CSP inheritance and          threats by governing the execution of JS snippets based on
hash handling. We confirm the risky trend of client browsers
deriving completely different interpretations from the same CSPs,
                                                                        their source URL, hash value, or attached nonce. Therefore, a
which raises security concerns. Our study demonstrates the              browser bug in CSP enforcement regarding JS execution causes
effectiveness of DiffCSP for identifying CSP enforcement bugs,          actual behaviors to deviate from the CSP specification and the
and our findings have contributed to patching 12 security bugs          expectations of site operators. Accordingly, such discrepancies
in major browsers, including Chrome and Safari.                         open security holes for an XSS attacker to bypass CSPs and
                                                                        inject adversarial JS snippets.
                       I.    INTRODUCTION
                                                                            Figure 1 shows a CSP that defines script-src-
    Content Security Policy (CSP) [4, 5, 6] is a protection             elem [35] to have the hash value of sha256-aHbTR....
mechanism that has become a de facto measure of security                The expected behavior is that a browser would only
mitigation. A web developer declares a CSP for their website            execute the inline JavaScript (JS) snippet in a script
in the web response header or the response body via a meta              tag or javascript:, the hash value of which is
tag. This instructs the browser to honor the CSP and govern             sha256-aHbTR... (i.e., the JS between Lines 6–7). Hence,
the execution and inclusion of various web resources, such as           any injected inline scripts will be blocked according to the
scripts or images. The CSP specification has evolved into the           defined policy. However, a bug in Chrome and Edge that
level 3 specification (CSP3) [6] since its adoption by major            we discovered in this paper allows an XSS attacker to inject
browsers, including Chrome, Firefox, Edge, and Safari.                  arbitrary JS via javascript: navigation regardless of the
                                                                        hash value in the script-src-elem directive.
                                                                            Despite the severity of CSP enforcement bugs, to the best
Network and Distributed System Security (NDSS) Symposium 2023           of our knowledge, no previous studies have addressed the
27 February - 3 March 2023, San Diego, CA, USA
ISBN 1-891562-83-5                                                      systematic identification of browser bugs in CSP enforcement
https://dx.doi.org/10.14722/ndss.2023.24200                             regarding JS execution. In this paper, we hence raise the
www.ndss-symposium.org                                                  research question: How can we identify browser bugs in CSP
enforcement regarding JS execution?                                     1     script-src 'self';
                                                                        2     default-src http://a.com;
Contributions. We propose DiffCSP, the first testing frame-
                                                                                 Fig. 2: An example of content restriction using CSP.
work designed to find CSP enforcement bugs in governing JS
execution. To identify bugs in browsers without analyzing their         undermine security, allowing the attacker to bypass CSPs and
source code, we choose to generate inputs that are highly likely        inject executable JS snippets. Furthermore, we identified that
to exhibit erroneous CSP enforcement. Specifically, DiffCSP             three bugs stem from the vague or missing descriptions in the
generates HTML instances that exhibit all the known forms of            CSP standard [6].
executing JS snippets and diverse CSPs. DiffCSP then checks
whether a generated CSP is violated across these generated                    In summary, this paper makes the following contributions:
HTML instances due to an inherent browser bug by checking
whether the embedded JS snippet in each HTML instance is                       1) We design and implement DiffCSP, the first testing
executed.                                                                   framework that identifies browser bugs in CSP enforcement
                                                                            regarding JS execution.
   Devising a testing framework that finds CSP enforcement                     2) We propose conducting differential testing across mul-
bugs by generating inputs entails three technical challenges:               tiple browsers by generating a diverse set of test inputs that
(1) the testing framework should generate comprehensive                     exhibit unexpected behaviors regarding CSP enforcement.
inputs (i.e., CSPs and HTMLs) that trigger inherent browser                    3) To systematically analyze the observed inconsistencies,
bugs; (2) it should identify unexpected execution results for               we leverage decision trees to pinpoint the root causes for
each generated input that may lead to finding browser bugs;                 erroneous CSP enforcement.
and (3) it should help an analyzer examine a large number of                   4) We identify 37 browser bugs, including 29 security
generated inputs that exhibit unexpected behaviors.                         bugs. We find that three bugs are due to unspecified rules
                                                                            in the CSP specification, thus recommending revision of the
    To address the first challenge, we define a data-driven                 specification. Chromium, Safari, and Firefox browser vendors
HTML grammar by referencing known CSP bugs [10], known                      have patched 12 of them, providing an award for the bugs
XSS attack payloads [8], an HTML security cheat sheet [24],                 found in Chrome, Safari, and Firefox with a bounty of 4,000
and the ECMAScript specification [17]. That is, this HTML                   USD.
grammar is designed to derive adversarial HTML instances                       5) To support open science and reproducible research,
that exhibit all known forms of embedding JS snippets. For the              we will release DiffCSP at https://github.com/WSP-LAB/
second challenge, we conduct differential testing on generated              DiffCSP.
inputs on three desktop and five mobile browsers and identify
a set of inputs that cause inconsistent execution results. That
                                                                                                II.   BACKGROUND
is, we use the inconsistent execution results for each generated
input as a bug oracle.                                                  A. Content Security Policy
    Notably, different browser vendors may support different                A content security policy (CSP) refers to an HTTP response
levels of the CSP specification (e.g., until recently, Safari did       header or a policy defined via a meta element, which enables
not support the strict-dynamic keyword introduced in                    client software (e.g., browsers) to honor a defined policy. By
2016), and we generate many HTML instances that exhibit                 design, it is a browser’s responsibility to enforce a defined
diverse ways of executing JS snippets. Therefore, DiffCSP               CSP while rendering a webpage, governing the inclusion of
reports a large number of inputs that cause behavioral dif-             web resources based on their domain sources or hash values.
ferences. Subsequently, it becomes difficult to analyze all
                                                                            Stamm et al. [65] originally proposed CSP, with the
test inputs causing these inconsistencies. To overcome this
                                                                        original goal of mitigating cross-site scripting (XSS) attacks.
challenge, we first vectorize the execution result for each
                                                                        Browser vendors have adopted CSP and developed its standard
generated HTML instance and label this HTML instance as
                                                                        specification. The first specification was finalized in 2015 and
either consistent or inconsistent based on its execution result.
                                                                        CSP level 2 was already published in 2016. Since then, CSP3
Using these vectors and their labels, we compute a decision
                                                                        has remained a working draft, however, is the de facto standard
tree to ease the identification of causes that result in a large
                                                                        that should be implemented in browsers [6].
number of observed inconsistencies. We then identify all paths
leading to inconsistent execution results in the decision tree.             A CSP consists of directives, each of which defines a set
For each collected path, we manually analyze the conditions             of values. Figure 2 shows two directives: default-src
that appear in the path and HTML instances that correspond              and script-src. In the presence of script-src, this
to this decision path. Therefore, DiffCSP helps us to identify          directive governs the inclusion of scripts. In this case,
causes while avoiding an analysis of each HTML instance that            this means that the page can only execute external scripts
causes an inconsistency, thus addressing the third challenge.           hosted on http://a.com, but it implicitly disallows inline
                                                                        scripts, inline event handlers, and eval. All other resources
    Using DiffCSP, we found CSP enforcement bugs in three
                                                                        (e.g., images or fonts) must be loaded from the page’s origin,
desktop and five mobile browsers. For the desktop browsers,
                                                                        given the default-src fallback directive. This directive
we found 37 bugs in Chrome, Firefox, and Safari. These
                                                                        controls all resources for which a more specific directive
browser vendors patched 23 bugs; eight of them were patched
                                                                        (e.g., image-src or font-src) is not present in the policy.
solely due to our bug reports, and four were patched in
response to addressing reports from ours and other bug re-                  The straightforward nature of defining allowed domains
porters. For four bugs, we are awaiting the responses from              simplified the implementation of CSP enforcement in browsers
the browser vendors. Out of the 37 identified bugs, 29 bugs             in the early stage of CSP. However, CSP level 3 now supports

                                                                    2
25 directives, nine source keywords, and multiple fallback              embedding executable JS snippets. Specifically, we reference
mechanisms, which bring complexity to implementing correct              previous browser attacks [10, 11], known XSS attack pay-
behaviors for all possible CSPs. Considering that CSP level 1           loads [8], and the ECMAScript specification [17] in deriving
has supported only 10 directives with four source keywords,             an HTML grammar. We then use this grammar to generate
the usage of CSP has become more complicated due to its                 25,880 HTML instances. Note that DiffCSP conducts testing
supporting various fine-grained security policies [58].                 on 25,880 HTML instances against 1,006 CSPs, whereas the
                                                                        Chromium team has implemented their own web platform tests
    It is natural for browser vendors to experience difficulties        consisting of 98 HTML files to vet the correctness of CSP
in implementing correct behaviors for all possible CSPs. For            enforcement involving JS execution [39].
example, external scripts can be governed by script-src-
-elem, which falls back to script-src, which in turn falls              Implementing bug oracles. Given a test input (i.e., a gener-
back to default-src. The script-src-elem directive,                     ated CSP and an HTML instance embedding a JS snippet), the
however, was only recently added to the working draft and               identification of erroneous behaviors should precede the deci-
may not be implemented by all browsers. Hence, the number               sion regarding whether the testing CSP and HTML instance
of possible combinations of CSPs and the differing levels               trigger a CSP enforcement bug. However, given a large number
of support across browsers make it challenging to conduct               of testing inputs, the manual identification of their correct
systematic testing of CSPs.                                             behaviors by referencing the CSP specification is infeasible.
                                                                        Note that this manual identification involves generating a
    Consequently, a bug in CSP enforcement poses a serious
                                                                        test case, mapping this test case to the corresponding CSP
security threat. Consider a site operator who deploys a CSP
                                                                        specifications, extracting the correct behavior, and converting
that forbids inline scripts without matching hashes in the CSP.
                                                                        this behavior into a testing oracle, a process that needs to be
A browser bug may enable the adversary to inject a new
                                                                        done just once per case. Considering that we generate 25,880
inline script, which obsoletes the need to deploy CSPs. In
                                                                        HTML instances that embed JS snippets and test them against
this paper, we assume an XSS adversary who abuses such
                                                                        1,006 different CSPs, the manual identification of correct
CSP enforcement bugs. The adversary’s goal is to conduct
                                                                        behaviors for these cases is not scalable.
successful XSS attacks by exploiting an XSS vulnerability
in a target website and bypassing the CSP emplaced on this                  For this, we conduct differential testing that executes
website.                                                                each generated HTML instance with a testing CSP across
                                                                        different browsers. We then identify inconsistent execution
     III.   M OTIVATION AND T ECHNICAL C HALLENGES                      results, which elucidate erroneous behaviors to be checked. We
                                                                        assume that the test inputs that cause different results between
    Recent work [58] has highlighted that XSS mitigation is on          browsers, even by at least one browser, are highly likely due
par with framing control and TLS enforcement. However, this             to inherent bugs in CSP enforcement.
original goal remains the most complex and important aspect
of CSP [43, 70]. It is thus important for browser vendors to            Identifying root causes. Considering that we generate a large
ensure that JS execution adheres to a given CSP.                        number of HTML instances and CSPs for differential testing,
                                                                        it is natural to generate a large number of inputs that cause
    Unfortunately, there have been no previous studies that             inconsistent execution results. Thus, the manual analysis of
systematically identify browser bugs in enforcing CSP that              each inconsistent behavior to identify its root causes would be
govern JS execution. We tackle this bug identification problem          intractable. Accordingly, we propose a new way of analyzing
by generating testing inputs and checking whether these inputs          the inconsistent execution results observed. We compute a
cause unexpected behaviors in enforcing a given CSP. That is,           decision tree for the execution results and analyze this de-
we generate a set of inputs that trigger inherent browser bugs          cision tree to identify common factors behind the observed
that cause erroneous CSP enforcement.                                   inconsistencies.
    Finding CSP enforcement bugs via input generation entails
three technical challenges: (1) generating comprehensive test-                                  IV.   D ESIGN
ing inputs that trigger CSP enforcement bugs, (2) identifying
                                                                        A. Workflow
unexpected browser behaviors for the generated inputs that
leads to the identification of bugs, and (3) analyzing the causes           Figure 3 illustrates the overall architecture of DiffCSP,
of the bugs triggered.                                                  which consists of three components: G ENERATOR, E XECUTOR,
Generating inputs. Each browser vendor has already im-                  and A NALYZER. At a high level, these components work
plemented their own regression tests that check for CSP                 together to conduct three steps: (1) the G ENERATOR generates
enforcement. It is thus vital to generate a comprehensive set           two sets of test inputs: a set of CSPs and another set of
of testing inputs that trigger inherent bugs that the existing          HTML instances, each of which contains a JS snippet; (2) the
regression testing set does not cover. In our study, we observed        E XECUTOR coordinates the testing of browsers to execute each
that the regression tests in WebKit and Chromium missed                 HTML instance for each test CSP and collects JS execution
several test instances that involve page navigation in a child          results and their inconsistencies across the testing browsers;
iframe or window instance (§V-D). We also found that these              and, after the E XECUTOR runs all test inputs in all testing
tests were applied as-is to the browser’s regression test set,          browsers, (3) the A NALYZER computes a decision tree using
without any combination or mutation.                                    the observed execution results. We use this computed decision
                                                                        tree to group testing inputs that share common conditions
   To address this challenge, we generate diverse CSPs and              for observed inconsistencies and then conduct a post-mortem
adversarial inputs of HTML files that exhibit all known ways of         analysis for the testing inputs sampled from these groups.

                                                                    3
        GENERATOR                 After running all test inputs
                                         in all browsers
                                                                                           default-src, script-src,
  Generate         Generate        CSP HTML STATUS                               Directive script-src-elem, script-src-attr
                                 Idx
    CSP             HTML            ID   ID  CODE                                          Corner case Capitalized directive (Default-src)
                                 1 #2 #423    200 ✗ ✗ ✗ Consistent!
                                                                                                       none | unsafe-inline | unsafe-eval |
        Testing        Testing   2 #44 #9523 100 ✗ ✓ ✗ Inconsistent!
                                                                                           Keyword     self | strict-dynamic | unsafe-hashes




                                                     ...
        CSPs           HTMLs
                                           Testing Results                                              Self URL (http://127.0.0.1:8000) |
        EXECUTOR                                                                          Host-source   Allowed URL (http://127.0.0.1:8080) | *
 for each
                                             ANALYZER                                     Schemes      data: blob: http: https:
        CSP            HTML
                                             Compute                              Value
                                                                                          Nonce-source nonce-123
                                           Decision Tree
                                                                                          Hash-source sha256-[HASH]
                                                                                                        Non-ASCII URL (http://üüü.de) | empty |
                                                cond 1                                                  Capitalized keyword (‘None’) |
                                                                                          Corner case
                                                                                                        Capitalized host (Http://127.0.0.1:8000) |
                                       cond 2              cond 3                                       Capitalized nonce (‘Nonce-123’)
   ✓
   JS
              ✗
              JS
                        ✓JS
                                       Idx 1, 4, 6
                                            cond 4           cond 5   CSP
                                                                                          TABLE I: Elements used to generate testing CSP.
Executed Not-executed Executed               Idx 3, 5         Idx 2   Bugs
                                                                                 the expectation that such exceptional cases render behavioral
                      Fig. 3: DiffCSP architecture.                              differences across browsers, we prepare a non-ASCII URL
                                                                                 value. We also prepare four more directive values: empty and
B. G ENERATOR                                                                    the capitalized forms of keyword, web server address, and
                                                                                 nonce-source [14, 16, 29, 31].
    The G ENERATOR generates a set of CSPs and another set
of HTML instances, which become test inputs for differential                         The G ENERATOR enumerates all possible combinations
testing. Our goal here is to generate diverse types of test CSPs                 of the directives and values above. However, we restrict the
and HTML instances regarding JS execution. In particular,                        G ENERATOR to generating CSPs having at most two directive
we compose all known ways of executing simple JS snippets                        values for each generated directive. Through this process, the
in HTML as well as diverse CSPs governing JS execution.                          G ENERATOR generates 1,006 CSPs. For each generated policy,
Additionally, the G ENERATOR generates a set of status codes                     it assigns a unique identifier, CSP_ID, which the E XECUTOR
that will be mapped to a subset of the generated HTML                            and A NALYZER use to associate behavior with a specific CSP.
instances to test the effect of status codes on CSP enforcement.
                                                                                 HTML generation. Table II summarizes an HTML grammar
CSP generation. Table I shows all directives and their values                    that DiffCSP leverages to generate test inputs of HTML
that the G ENERATOR leverages to generate CSPs. We design                        instances. To design this grammar, we referenced known
this component to generate policies involving default-                           CSP enforcement bugs [10, 11], XSS attack payloads [8],
-src [13], script-src [33], script-src-elem [35],                                an HTML security cheat sheet [24], and the ECMAScript
and script-src-attr [34] directives, which are all the                           specification [17]. We emphasize that DiffCSP does not simply
directives that affect JS execution according to the CSP3                        reuse the referenced HTML and JS examples; rather, we build
working draft [6].                                                               grammar out of these referenced files. The G ENERATOR is thus
                                                                                 able to compose all possible combinations of HTML instances
    For these directives, we define 12 representative val-
                                                                                 that embed simple JS snippets [62, 69].
ues grouped into five categories (i.e., keyword, host-source,
schemes, nonce-source, and hash-source) by referring to the                          The G ENERATOR enumerates a set of test HTML instances
policy specification [36]. Since the [HASH] value in the hash-                   by traversing the defined HTML grammar in a depth-first
source group should be different for each tested JS, the value                   manner. From a root grammar rule with the non-terminal
is not fixed when generating a policy; it is changed later before                symbol of [HTML], the G ENERATOR composes an HTML
the E XECUTOR executes the test HTML instance (§IV-C).                           instance by applying an applicable grammar rule and replacing
                                                                                 each non-terminal symbol.
    To define a host-source value, we assume three
web servers: (1) a self-origin server (http://127.-                                  Specifically, the G ENERATOR starts by composing an
0.0.1:8000), (2) an allowed-origin server (http://-                              HTML instance by applying a derivation rule with the
127.0.0.1:8080), and (3) a blocked-origin server                                 non-terminal symbol of [HTML]. From the current HTML
(http://127.0.0.1:8082). The self-origin server is de-                           instance in composition, it identifies non-terminal sym-
signed for testing CSPs containing self. The allowed-origin                      bols (i.e., [JS_REQ_URL], [JS_INLINE_URL], [PAGE],
and blocked-origin servers are for fetching allowed and blocked                  [SCHEME], [JS], and [HTML]) and replaces each non-
cross-origin JS snippets, respectively.                                          terminal symbol by applying an applicable grammar rule.
                                                                                 The G ENERATOR repeats this process until either of the
     We also define corner cases for directives and values,
                                                                                 following termination conditions is satisfied: (1) the G EN-
which are likely to be provided by site operators. For example,
                                                                                 ERATOR encounters an element in [JS_REQ_URL] or
according to the CSP specification, the URLs in directive
                                                                                 [JS_INLINE_URL], or (2) the number of applied grammar
values should contain only ASCII characters [36]1 . However,
                                                                                 rules exceeds five. The first termination condition denotes that
it is reasonable that one unfamiliar with the specification may
                                                                                 the G ENERATOR successfully composes an HTML instance
write URLs with non-ASCII characters [26] in a CSP. With
                                                                                 that executes an inline script or imports a JS script. The
  1 Non-ASCII domain names cannot be entered into a CSP, but instead must        second condition means that the G ENERATOR discards the
be Punycode- encoded.                                                            generated HTML instance when it becomes too complicated.

                                                                             4
    Symbol         HTML/JS Derivation Rule                                                                                 Feature                Value
                   http://127.0.0.1:8000/self.js?csp_id=[CSP_ID]&html_id=[HTML_ID]&status_code=[CODE]                                         Self-JS: 0
 [JS_REQ_URL]      http://127.0.0.1:8080/allowed.js?csp_id=[CSP_ID]&html_id=[HTML_ID]&status_code=[CODE]                 JS Execution     Allowed-JS: 1
                   http://127.0.0.1:8082/blocked.js?csp_id=[CSP_ID]&html_id=[HTML_ID]&status_code=[CODE]                   Method         Blocked-JS: 2
[JS_INLINE_URL] http://127.0.0.1:8000/executed?csp_id=[CSP_ID]&html_id=[HTML_ID]&status_code=[CODE]                                         Inline JS: 3
    [PAGE]         self.html | about:blank | self.txt                                                                          -                       -
  [SCHEME]         javascript:‘[HTML]’ | javascript:[JS] | data:text/html,[HTML] | data:application/js,[JS] | ...              -                       -
                   Category #1: executing inline JS fetch(‘[JS_INLINE_URL]’)                                                   -                       -
                   Category #2: evaluating string eval(‘[JS]’) | new Function(‘[JS]’) | setTimeout(‘[JS]’,0)            Included or not             0-1
                   Category #3: dynamically fetching JS var o=document.createElement(’script’);
                                                                                                                        Included or not             0-1
     [JS]          o.src=‘[JS_REQ_URL]’;document.body.appendChild(o)
                   Category #4: redirecting to scheme location=‘[SCHEME]’ | window.open(‘[SCHEME]’) |
                                                                                                              Included or not                       0-1
                   var o=document.createElement(’iframe’);o.src=‘[SCHEME]’;document.body.appendChild(o) | ...
                   Category #5: expanding document document.body.innerHTML+=‘[HTML]’ | document.write(‘[HTML]’)         Included or not             0-1
                   Category #6: writing to opened document w=window.open(‘[PAGE]’);w.document.write(‘[HTML]’)           Included or not             0-1
                   Category #1: executing inline JS in script tag <script>[JS]</script>                                 Included or not             0-1
                   Category #2: fetching JS in script tag <script src=[JS_REQ_URL]></script>                            Included or not             0-1
                   Category #3: redirecting to scheme <a id=x href=‘[SCHEME]’></a><script>x.click()</script> |
                                                                                                                        Included or not             0-1
                   <object data=‘[SCHEME]’></object> | <iframe src=‘[SCHEME]’></iframe> | ...
                   Category #4: executing inline JS in event handler <iframe onload=‘[JS]’></iframe> |
                                                                                                                        Included or not             0-1
                   <audio src/onerror=‘[JS]’></audio> | <details ontoggle=‘[JS]’ open>test</details> | ...
   [HTML]          Category #5: writing to frame <iframe srcdoc=‘[HTML]’></iframe> | <iframe id=x src=[PAGE]>
                                                                                                                        Included or not             0-1
                   </iframe><script>x.onload=_=>x.contentDocument.write(‘[HTML]’)</script> | ...
                   Category #6: changing location of iframe <iframe id=x src=[PAGE]></iframe>
                                                                                                                        Included or not             0-1
                   <script>x.onload=_=>x.src=‘[SCHEME]’</script> | ...
                   Category #7: evaluating string via frame’s function <iframe id=x src=[PAGE]></iframe>
                                                                                                                        Included or not             0-1
                   <script>x.onload=_=>x.contentWindow.eval(‘[JS]’)</script> | ...
                   Category #8: expanding document <svg xmlns=http://www.w3.org/2000/svg>[HTML]</svg> |
                   <template id=x>[HTML]</template>                                                                     Included or not             0-1
                   <script>document.body.appendChild(x.content.cloneNode(true))</script> | ...

                                                TABLE II: Grammar rule to generate testing HTML.

Idx Derived HTML
                                                                                testing code.
  1 <script>[JS]</script>                                                           In total, the G ENERATOR generates 25,880 HTML in-
  2 <script>fetch(‘[JS_INLINE_URL]’)</script>                                   stances. To boost the testing efficiency of DiffCSP, it merges
     <script>fetch("http://127.0.0.1:8000/executed                              the generated HTML instances into a number of test units,
  3           ?csp_id=[CSP_ID]&html_id=[HTML_ID]
              &status_code=[CODE]")</script>                                    each of which becomes an HTML file. Here, we set the
     <script>fetch("http://127.0.0.1:8000/executed                              number of HTML instances in each group to 80 in order not
  4           ?csp_id=[CSP_ID]&html_id=0                                        to cause instability in the execution pipeline. However, when
              &status_code=[CODE]")</script> → HTML #0 generated!
 ... ...                                                                        a function related to page redirection, such as window.open
923 <script nonce=123>[JS]</script>                                             or location.href, is included in an HTML instance, the
 ... ...                                                                        inclusion of other HTML instances in the same file will stop
 TABLE III: Example of derivation process to generate HTMLs.                    the testing of HTML instances that appear after this HTML
                                                                                instance involving page redirection. Thus, each HTML instance
Table III shows an example of the composition process. The                      involving page redirection is excluded from this optimization
G ENERATOR starts by applying the first rule of [HTML] in                       process; such an instance is stored in a separate file.
Table II and then continues derivation for the scanned non-
                                                                                    With this approach, the G ENERATOR generated 11,663
terminal symbol, i.e., [JS].
                                                                                HTML files from 25,880 HTML instances. Each generated
    For each generated and saved HTML file, the G ENERATOR                      HTML file is then stored in the web root directory of the self-
assigns a unique identifier to the [HTML_ID] of the generated                   origin server that E XECUTOR accesses for differential testing.
page (e.g., Idx 4 in Table III). Note that [CSP_ID] and
                                                                                Status code. Specific HTTP status codes may cause security
[CODE] have not yet been assigned at this stage. Later, the
                                                                                flaws, such as changing the execution context of JS snip-
E XECUTOR changes these values (§IV-C).
                                                                                pets [27, 28] or disabling certain HTTP headers [3]. Motivated
    Regarding the testing of nonce-source values in test                        by these prior bugs, we define representative status codes
CSPs, the G ENERATOR is required to generate nonce-protected                    to systematically study if and how the status codes affect
scripts. Therefore, if a <script> tag is found while scan-                      CSP enforcement. In particular, the G ENERATOR leverages
ning an element, the G ENERATOR derives two pages, a                            five representative status codes (i.e., 100, 200, 300, 400, and
page having <script> and another page having <script                            500) when generating test instances. For testing efficiency, we
nonce=123> (e.g., Idx 1 and 923 in Table III). Then, the                        map all status codes to a limited set of the generated HTML
G ENERATOR respectively performs the composition of the                         instances (§IV-C).

                                                                            5
EXECUTOR                                       Self-origin server (port 8000)
                                                                  JS request
                                                                                             whether each embedded script (an inline script or a JS script
                                               HTML                                          fetching from a cross-origin) is executed for the given testing
1. Access http://127.0.0.1:8000/                                    receiver
       test_1.html?csp_id=5&status_code=200     files
                                                                   Inline JS                 triad of an HTML file, a CSP, and a status code by checking
                                                                    receiver
2. Execute test_1.html with CSP #5                                                           the csp_id, html_id, and status_code parameters in an
Content Security Policy #5:                    Allowed-origin server (port 8080)
  script-src http://127.0.0.1:8080;
                                                                                             incoming request. The E XECUTOR then stores these execution
                                                   JS request receiver                       results in a database for each testing browser.
test_1.html:                                   Blocked-origin server (port 8082)
  <script>fetch(http://127.0.0.1:8000                                                            DiffCSP determines that a tested triad renders inconsis-
           /executed                               JS request receiver
           ?csp_id=5&html_id=1
                                                                                             tent behaviors when at least one testing browser reports a
           &status_code=200)</script>             Testing results DB                         different JS execution result. For instance, if Chrome allows
  <script src=http://127.0.0.1:8080           CSP HTML STATUS                                JS execution for a specific testing triad while Firefox and
           /allowed.js                         ID   ID CODE
                                                                                             Safari block JS execution, we consider that the HTML file
           ?csp_id=5&htmlid=2                 #5 #1       200      ✓ ✗ ✗ Inconsistent!
           &status_code=200></script>
                                              #5    #2    200      ✓ ✓ ✓Consistent!          in this triad potentially triggers a browser bug. Naturally, this
                      …




                                                                                             approach does not tell which browsers have a bug [42, 47,

                                                            ...
                                                                                             48], considering that the majority or minority browser vendors
                        Fig. 4: E XECUTOR workflow.
                                                                                             may implement enforcement incorrectly. However, those triads
                                                                                             become promising data points for the next analysis step, which
C. E XECUTOR                                                                                 involves a manual post-mortem analysis aided by decision
    Given a set of test CSPs and HTML files, the E XECUTOR                                   trees (§IV-D).
enumerates all combination pairs. For each pair of a CSP and
an HTML file, it executes the HTML file that has the CSP                                     D. A NALYZER
across different browsers and then checks whether each JS
snippet embedded in this HTML file is executed.                                                  The E XECUTOR reports behavioral inconsistencies for a
                                                                                             large number of the generated triads, each of which consists of
    For testing efficiency, all HTML files are executed with                                 a CSP, an HTML instance, and a status code. Note that Dif-
the 200 response code. Additionally, a limited set of HTML                                   fCSP generates 4M and 3.5M triads, for which the execution
files is executed with all the defined status codes; we sample                               results may respectively differ by the three desktop and five
eight HTML files from 11,663 HTML files (i.e., 640 HTML                                      mobile browsers (§V-B). Manually identifying the root causes
instances) containing at least one of each [HTML] category                                   of all execution inconsistencies is infeasible; it would demand
in Table II.                                                                                 the analysis of each generated triad that reports an inconsistent
Testing browsers. For differential testing, we leverage three                                execution result.
desktop and five mobile browsers, compiling a set of eight                                       To address this challenge, we propose to leverage a decision
browsers. We observe that rendering engines govern JS ex-                                    tree. A decision tree is designed to derive a set of human-
ecution enforcement behaviors. Therefore, we test three ren-                                 readable conditions that lead to a classification decision. We
dering engines (i.e., Chromium, Firefox, and WebKit) using                                   leverage this capability to compute a set of conditions that lead
executions results of three desktop browsers and two rendering                               to inconsistent execution results. Each leaf node that indicates a
engines (i.e., Chromium and Gecko) using execution results of                                decision corresponds to a set of training instances; the decision
five mobile browsers (§V-A).                                                                 tree derives the same path and conditions for those training
Workflow. Figure 4 illustrates the workflow of the E XECUTOR.                                instances.
Assume that the E XECUTOR tests test_1.html with a                                               Using this capability, we leverage a computed decision
CSP corresponding to the CSP_ID of 5 and with the status                                     tree to group generated triads that share the same decision
code 200. The E XECUTOR instructs a testing browser to send                                  paths. Then, from each group that contains an inconsistent
the request to test_1.html with the csp_id parameter                                         execution result, we pick one triad and analyze this triad
of CSP_ID 5 and the status_code parameter of CODE                                            with the conditions that appear in the corresponding path.
200. When the testing server receives this request, it sends                                 That is, instead of analyzing all generated triads in each
a response by setting the CSP corresponding to the CSP_ID                                    group, we analyze one example for each group. In other
in the HTTP header and setting the status code correspond-                                   words, we leverage a decision tree to derive an interpretation
ing to CODE, along with sending the body embedded with                                       of observed execution results and use this interpretation to
test_1.html. In this process, [CSP_ID] and [CODE] are                                        identify representational inputs for each decision path.
replaced with given parameters. When [HASH] exists in the
test CSP, the string is replaced with the concatenation of all                                   Figure 5 illustrates how we build and leverage a decision
hashes that correspond to the inline snippets in the HTML file.                              tree. The A NALYZER converts each CSP, HTML, and status
                                                                                             code triad into a vector. It then uses the generated dataset to
    The main goal of the execution step is to determine whether                              train a decision tree.
or not a script was executed in light of the specified CSP. If
the testing browser executes an inline script, this will invoke                              Dataset. The dimension of a feature vector is 37; 22 features,
the fetch function. Therefore, the testing server will receive                               14 features, and one feature represent a CSP, an HTML
a request to the executed path of the self-origin server                                     instance, and a status code, respectively. For a generated CSP,
(the fourth row in Table II). If a testing browser executes a                                each element in Table I is encoded into a feature vector.
script fetched from cross-origin servers, the browser sends a                                It consists of 22 binary features, and each feature value
JS fetching request to the specified URL (see the first to third                             represents whether the corresponding feature is present. 14
rows in Table II). Thus, the testing server is able to check                                 features are from a generated HTML instance. Each feature and

                                                                                         6
ANALYZER                                                                script-src?                                        Idx      Desktop                                     Version
CSP:                                                            Exist                 Not exist
    script-src http://127.0.0.1:8080;                                                                                      1      Chromium                                         99
                                                       Status Code?             script-src-elem?                           2        Firefox                                        95
HTML:                                                           200, 300,
 <script>                                        100                                         Exist                         3     WebKit (Safari)                                  15.4
     fetch(http://127.0.0.1:8000/executed                       400, 500 Not exsit
               ?csp_id=5&html_id=1                                                                                         Idx      Mobile         Version     Package Name                Device    # of Downloads
                                                                                        ‘self’
               &status_code=100)                       sha256-[HASH]
 </script>                                                                         Not             Exist                   4       Chromium         101        com.android.chrome          Nexus     +10,000,000,000
                                                        Exist                     exist                                    5       Chromium         100        com.opera.browser           Pixel 3     +100,000,000
Status code: 100                                  HTML Category #4:




                                                                                        …
                                                   Executing JS in event                    JS Execution Method:           6        Gecko           100        org.mozilla.firefox         Nexus       +100,000,000
    Inconsistent Execution Result                       handler?              Not                Fetching blocked JS

          ✓
                                                                                                                           7       Chromium         102        com.brave.browser            Pixel       +50,000,000
                        ✗            ✗                  Exist
                                                                   Not exist
                                                                              exist
                                                                                                     Not                   8        Gecko            96        org.torproject.torbrowser   Pixel 3      +10,000,000
                                                                                                    exist
                                                   Inconsistent                       Consistent            Exist
                                                                                                                                              TABLE IV: Browsers under testing.
Label:
Inconsistent 0, 1, 0, …, 3, 0, 0, 1, 0, …, 100
            Feature Vector                                              Decision Tree
                                                                                                                           and 0.92 for mobile browsers) while the number of paths to be
                            Fig. 5: A NALYZER workflow.                                                                    inspected decreases (§V-E). In each computed decision tree,
                                                                                                                           we investigated every path that corresponds to at least one
its value are listed in the third and fourth columns in Table II,                                                          generated triad causing an inconsistent execution result. For
respectively. For the status code, we use the status code itself                                                           each path, we sample one triad of an HTML, a CSP, and a
as a feature. For each vector representing a generated triad, we                                                           status code, corresponding to this path and analyze this triad
use one of two class labels: inconsistent (positive) or consistent                                                         along with the conditions that appeared in the path. As a
(negative).                                                                                                                result, we examined 525 and 581 paths for desktop and mobile
                                                                                                                           browsers, respectively.
Decision tree. Given a computed decision tree, we manually
enumerate all paths from a root to the leaf nodes that represent
inconsistent execution results. Each path consists of tree nodes,                                                                                         V.      E VALUATION
each of which contains a condition that involves features.
                                                                                                                               We evaluate the efficacy of DiffCSP to find browser bugs in
    Figure 5 shows a decision tree with three paths leading                                                                enforcing CSPs that govern JS execution using three desktop
to inconsistent execution results. The first path leading to                                                               and five mobile browsers (§V-B). We then describe the root
inconsistent results (script-src ∧ status code 100) represents                                                             causes of the identified bugs, categorize these causes into
a bug in which Chromium-based browsers ignore a CSP when                                                                   10 groups, and explain the security implications of the bugs
the response comes with the status code 100. This step enables                                                             (§V-C). We also analyze the degree to which the computed
an auditor to identify factors causing the inconsistent results                                                            decision tree helps find the causes of the identified bugs
and analyze an instance sampled from the training instances                                                                (§V-E). Finally, we demonstrate the performance of DiffCSP
that share this path. This step enables to avoid the analysis of                                                           in finding CSP bugs (§V-F).
the 276K instances that belong to that path.
    The second path (script-src ∧ status code 200–500 ∧                                                                    A. Experimental Setup
sha256-[HASH] ∧ Executing JS in event handler) represents
a bug where Firefox enables unsafe-hashes by default in                                                                    Browsers. We ran a series of experiments on the eight
the script-src directive. This inconsistency occurs when                                                                   browsers listed in Table IV. For desktop browsers, we selected
a hash-source value exists in the directive value and an event                                                             the three most popular browsing engines: Chromium, Firefox,
handler in a generated HTML instance.                                                                                      and WebKit [23]. We have observed that all testing results for
                                                                                                                           Chrome and Edge were identical because they use the same
    DiffCSP computes two decision trees: one for the desktop
                                                                                                                           rendering engine as Chromium. Since the rendering engine
browsers and the other for the mobile browsers. Note that
                                                                                                                           governs JS execution according to a given CSP [2, 10], we used
the purpose of computing the decision trees is not to classify
                                                                                                                           the testing results of Chromium to represent those of Chrome
a given instance, but to facilitate the analysis of identifying
                                                                                                                           and Edge. We also used WebKit to test the rendering engine of
causes for inconsistent execution results. Thus, we do not split
                                                                                                                           Safari. Note that new Safari features have been implemented in
the training instances for the testing dataset.
                                                                                                                           WebKit before their releases. In addition, 11 of the 18 (61%)
    DiffCSP reported 19M execution results for all generated                                                               WebKit bugs that we discovered were present in the latest
triads. Leveraging a decision tree computed from all these                                                                 version of Safari 15.4.
instances generates a complex decision tree, the depth of which
is beyond 30, making it intractable to manually analyze 61,479                                                                 For mobile browsers, we selected five popular browsers.
paths leading to inconsistencies. We conduct the following                                                                 Specifically, we first selected 20 mobile browsers in the order
two optimization methods so that the tree can explain the                                                                  of their downloads from Google Play Store as of May 2022
root causes for the observed inconsistencies while limiting the                                                            and then excluded nine ARM-based apps, the APKs of which
number of paths to be inspected: (1) we randomly sample                                                                    do not support Android API 30 (i.e., Android 11) x86 system
consistent training instances to match their number to the                                                                 images, which is required for our testing environment using an
number of inconsistent training instances, and (2) we set the                                                              emulator. We also excluded six mobile browsers using Android
decision tree depth to 10 for desktop browsers and mobile                                                                  WebView. Those execution results depend on the version of
browsers, respectively.                                                                                                    the WebView service installed on a mobile device, which may
                                                                                                                           significantly vary across user devices. When they use the latest
    We empirically confirmed that when the tree depth is 10,                                                               WebView service, the execution results become identical to
the recall of the tree is kept high (i.e., 0.95 for desktop browsers                                                       those of the Chromium mobile browser.

                                                                                                                       7
    We observed that the test results for mobile browsers               groups (s represents group (1) and the others belong to group
using the same rendering engine were identical. Therefore,              (2)).
we grouped the execution results of the mobile browsers
under testing into two groups: Chromium (Chrome, Opera, and             Bug disclosures. We reported all 27 security bugs resulting
Brave) and Gecko (Firefox and Tor).                                     from vendor’s mistakes to the three browser vendors (i.e.,
                                                                        Chromium, Firefox, and WebKit, representing Safari). At the
   In summary, we tested three rendering engines (i.e.,                 time of writing, 23 bugs have been patched by the vendors.
Chromium, Firefox, and WebKit) for the desktop browsers                 Among them, 12 bugs were patched in response to our bug
as well as two engines (i.e., Chromium and Gecko) that                  reports, and the other bugs were patched in response to reports
corresponds to five mobile browsers.                                    from the browser vendors or users. Also, we are currently
                                                                        awaiting responses for four bugs from the vendors. For the
Environment. For desktop browser testing, we conducted                  reported bugs, the Chromium team awarded us a bug bounty
experiments on two machines running x86_64 Ubuntu with                  of 4,000 USD.
88 CPUs and 378 GB of main memory. To automatically visit
each testing page from each browser, we compiled a test script
using Playwright 1.18.0 [30]. For each HTML file, we set the            C. Root Causes
timeout of execution to three seconds. When this page involves                Table V lists the 37 identified bugs and their causes.
page redirection and has a single HTML instance, we set the             We further categorized these root causes into 10 groups, as
timeout to one second.                                                  shown in the table. The third column of the table depicts the
    For mobile browser testing, we performed our testing on             conditions of the page, the CSP, or the HTTP status code that
four servers running x86_64 Debian with 192 CPUs and 1.5                contributes to triggering the bugs. The fourth column shows
TB of main memory. To automate the testing process, we relied           the expected behavior (i.e., whether to execute a given JS
on Android Virtual Device (AVD) [7] and the Android Debug               testing code) according to the CSP specification [6] regarding
Bridge (ADB), which is a command-line tool that helps us                the conditions in the third column. We manually extracted
communicate with a device [1]. For the testing devices in our           these expected behaviors from the specification to check the
emulators, we used a Galaxy Nexus with Android API 25 (i.e.,            correctness of our findings. When the specification does not
for x86-based apps) and a Pixel 3 with Android API 30 (i.e.,            describe the expected behavior for the identified conditions,
for ARM-based apps).                                                    we mark it with s and count the number of bugs to one.
                                                                             The fifth to ninth columns indicate whether each browser
B. Bugs Found                                                           exhibits the expected behavior. When the browser conducts
                                                                        the expected behavior as the specification describes, we mark
    Table V summarizes CSP enforcement bugs that we found               it with a 3, and an 7 otherwise. N/A indicates a bug that
using DiffCSP. We found a total of 37 browser bugs after                still poses a security threat. However, we did not count it as
analyzing 7.5M discrepancies that DiffCSP reported. Recall              a bug because the corresponding browsers did not support
from §IV-D that we identified 525 and 581 paths leading to              certain directives or directive values. For example, we mark
the inconsistent execution results in the desktop and mobile            inconsistency #7 as N/A for Firefox because it does not
decision trees, respectively. Each path leading to an inconsis-         support the processing of the script-src-elem directive,
tent result corresponds to a set of HTML instances, CSPs, and           even though the CSP3 standard demands its support. In the
status codes. From such a set of test inputs, we selected one           following, we list five root causes out of the 10 ones. We
triad of an HTML file, a CSP, and a status code. We then                describe the remaining causes in Appendix IX-A.
analyzed this triad and identified the causes along with the
conditions that appeared in the path.                                   Cause #1: Incorrect CSP inheritance. An embedded iframe
                                                                        or a newly opened new window loaded from a local scheme
    Of the 37 browser bugs, we manually confirmed that 29               (e.g., blob, data, javascript, or about) should inherit
bugs imposed a security threat and eight were functional                the CSP of their parent document [12]. The goal here is to
bugs. For each security bug, we analyzed its implications by            prevent the adversary from bypassing the parent’s CSP by
questioning whether an adversary is able to exploit the bug             opening a child window or embedding a child frame that
and bypass a certain CSP, thus injecting an arbitrary JS script.        contains attack code under the adversary’s control.
We further confirmed whether attack payloads exploiting such
a security bug were blocked by other browsers.                              We found that Safari incorrectly inherits a parent CSP,
                                                                        allowing string-to-JS execution in child pages even when the
    Of the 29 security bugs, 27 bugs (93%) enable the adver-            parent CSP blocks eval(). The following snippet shows a
sary to inject an executable JS, the execution of which should          test HTML instance that exhibits this bug.
be blocked according to the CSP standard. The remaining two
                                                                        1   CSP: script-src 'nonce-123';
bugs entail relatively low-security implications. However, by           2   <iframe id="x" src="about:blank"></iframe>
exploiting these bugs, an adversary is capable of bypassing pre-        3   <script nonce=123>
                                                                        4       let hash = window.location.hash.slice(1);
request checks and sending a request to an arbitrary endpoint.          5       x.onload=_=>x.contentWindow.eval("'" + hash + "'");
                                                                        6       x.contentWindow.location.reload();
    We clustered the 37 bugs into two groups: (1) bugs due              7   </script>
to unclear/incorrect descriptions in the CSP specification and
(2) implementation flaws that stem from vendors’ mistakes in            Note that because unsafe-eval is not included in the CSP, a
not properly following the specification. The third column of           site operator would expect the string evaluation by eval() to
Table V categorizes the identified vulnerabilities into these two       be blocked. Also, since nonce-123 is included in the CSP,

                                                                    8
                                                                                                         Expected Behavior                         Desktop     Mobile # of
Category Idx Page / CSP / HTTP header condition
                                                                                                        (Manually Extracted)                                          Bugs

          Cause #1: Incorrect CSP inheritance
           1 Dynamically calling eval() from the about: frame (‘unsafe-eval’ is not specified) eval() should be blocked                           3   3    7   3    3    1
           2 Dynamically changing frame.src to JS URL with embedded inline script              Inheritance should occur                           3   3    7   3    3    1
           3 Dynamically changing frame.src to data URL with embedded HTML                     Inheritance should occur                           3   3    7   3    3    1
           4 Dynamically changing frame.src to blob URL with embedded HTML                     Inheritance should occur                           3   3    7   3    3    1
           5 Dynamically changing frame.src to JS URL with embedded HTML                       Inheritance should occur                           7   3    7   7    3    2
           6 Dynamically writing JS embedded HTML to static file                               s (3 indicates inheritance has occurred)           7   3    7   7    3    1
          Cause #2: Incorrect hash handling
           7 javascript:[JS] with script-src-elem [hash-source]                                JS from JS URL should not be executed              7 N/A 3      7 N/A     1
           8 script-src [hash-source]; script-src-elem ‘none’                                  Hashed script should not be executed               3 N/A 7      3 N/A     1
           9 script-src [hash-source] ‘unsafe-hashes’; script-src-attr ‘none’                  Hashed script should not be executed               3 N/A 7      3 N/A     1
          Cause #3: Non-ignored directive values
          10 default-src ‘strict-dynamic’ ‘unsafe-inline’                                      ‘unsafe-inline’ should be ignored                  7 N/A N/A 7 N/A        1
          11 script-src ‘strict-dynamic’ [host-source]                                         [host-source] should be ignored                    3 3 7     3 3          1
          Cause #4: Non-supporting specific directives
          12 The script-src-elem directive                                                     Directive should be supported                      3   7    3   3    7    1
          13 The script-src-attr directive                                                     Directive should be supported                      3   7    3   3    7    1
          Cause #5: Non-supporting specific directive values
          14 The nonce-source in the default-src directive                                     Value should be supported                          3   †7   3   3    †7   1
 Security 15 The hash-source in the default-src directive                                      Value should be supported                          3   7    3   3    7    1
  Bugs    16 ‘strict-dynamic’ in the default-src directive                                     Value should be supported                          3   7    7   3    7    2
          Cause #6: Auto-enabling directive values by default
          17 Auto-enabled ‘unsafe-hashes’ in the script-src directive                          Value should be disabled by default                3 7 3        3 7       1
          18 Auto-enabled * in the script-src-elem directive                                   Value should be disabled by default                3 N/A 7      3 N/A     1
          Cause #7: Auto-enabling directive values on specific conditions
              Auto-enabled ‘unsafe-inline’ in the script-src-elem directive
          19                                                                                   Value should be disabled by default                3 N/A ‡ 7    3 N/A     1
              Condition: ‘strict-dynamic’ is specified in the script-src-elem directive
              Auto-enabled ‘unsafe-inline’ in the script-src-elem directive
          20                                                                                   Value should be disabled by default                3 N/A 7      3 N/A     1
              Condition: The hash-source is specified in the script-src-attr directive
              Auto-enabled ‘unsafe-inline’ in the script-src-elem directive
          21                                                                                   Value should be disabled by default                3 N/A 7      3 N/A     1
              Condition: The hash-source is specified in the script-src-elem directive
              Auto-enabled ‘unsafe-inline’ in the script-src-attr directive
          22                                                                                   Value should be disabled by default                3 N/A 7      3 N/A     1
              Condition: The hash-source is specified in the script-src-elem directive
              Auto-enabled ‘unsafe-inline’ in the script-src-attr directive
          23                                                                                   Value should be disabled by default                3 N/A 7      3 N/A     1
              Condition: The hash-source is specified in the script-src-attr directive
          Cause #8: Non-supporting CSP for specific status code
          24 100 status code in HTTP header                                                    CSP should be enabled                              7   3    3   ¶3   3    1
          Cause #9: Incorrect handling of malformed CSPs
          25 Non-ASCII character within directive value                                        s (3 indicates the directive is disabled)          3   7    3   3    7    1
          Cause #10: Allowing out-going requests
          26 Parser-inserted script (i.e., script tag) with ‘strict-dynamic’                   Out-going JS request should be blocked             3   7    3   3    7    1
          27 Parser-inserted script (i.e., written script tag) with ‘strict-dynamic’           Out-going JS request should be blocked             7   3    3   7    3    1
           28 Nested srcdoc with JS fetching (The URL of the JS is specified in the CSP)                JS from allowed URL should be executed    3   7    3   3    7    1
           29 Nested data scheme with JS fetching (The URL of the JS is specified in the CSP)           JS from allowed URL should be allowed     3   7    3   3    7    1
           30 Calling cloneNode() for inline script (Nonce-source for inline script specified in CSP)   Nonced inline script should be executed   3   7    3   3    7    1
Functional
  Bugs     31 Executing javascript:[JS] (hash for [JS] specified in CSP)                                s (3 indicates script is executed)        7   3    7   7    3    1
           32 NoCSPiframe.contentWindow.eval() (‘unsafe-eval’ is not specified)                         eval() should be allowed                  3   3    7   3    7    2
              JS fetching from NoCSPiframe.srcdoc with following CSP:
           33                                                                                           JS from allowed URL should be executed 3      7    7   3    7    2
              default-src ‘none’; script-src ‘unsafe-inline’ [Allowed URL]
  Total                                                                                                                                                                  37
    † Only for inline scripts (e.g, <script     nonce=123>[Inline script]</script>), not for JS fetching (e.g., <script src=[URL] nonce=123></script>).
          ‡ Only for inline scripts existing in script tag, not in the JS navigation.                   ¶ The bug was patched in Chromium 100.


             TABLE V: Experimental results with eight major browsers: Chromium                          , and Gecko (Firefox)         , WebKit (Safari)        .

they would expect that only the nonce-protected JS will be                                      For example, consider the following test CSP and webpage
allowed. However, Safari allows string-to-JS execution under                                that triggers inconsistency #3.
certain page conditions, allowing an attacker to bypass the
                                                                                            1   CSP: script-src 'nonce-123';
emplaced CSP and execute arbitrary scripts if the page is                                   2   <iframe id="z" src="self.html"></iframe>
vulnerable to XSS attacks. Especially, we observed that calling                             3   <script nonce=123>
eval() is allowed if it is called dynamically from a child                                  4       z.addEventListener("load",() => { z.src =
                                                                                            5          "data:text/html,<script>alert(1)<script>";});
window or iframe with the src property of about:blank.                                      6   </script>
We reported this bug to the WebKit team, and the vendor fixed
the bug.                                                                                    In this example, when the load event of the iframe is fired,
                                                                                            the src attribute of the iframe is changed to the data URL
    We also observed that Safari did not conduct CSP inher-                                 that executes the JS snippet in Line 5. It is expected that this
itance when it involves javascript:, data:, or blob:                                        iframe will inherit the parent’s CSP, thus blocking JS execution
navigation. Also, in Chromium, this kind of bug is triggered                                of this embedded HTML instance. However, the identified bug
when the navigation to a URL involves the javascript:                                       contributes to bypassing CSP enforcement, which allows the
scheme. These bugs occur because the browsers do not check                                  inline script in Line 5 to be executed. We emphasize that
the CSP of a parent document when asynchronous navigation                                   the defined CSP does not affect the executed script at all.
is involved (e.g., dynamically changing the src attribute of                                Therefore, the injected script is capable of bypassing frame
an existing iframe to a local scheme URL).                                                  busting as well as TLS enforcement even if the CSP defines

                                                                                        9
those directives.                                                       Cause #3: Non-ignored directive values. According
                                                                        to the specification pertaining to strict-dynamic,
    We have reported these bugs to the WebKit team and                  host-source, and scheme-source expressions as well as
the vendor has fixed these bugs. We have also reported the              unsafe-inline and self keyword-source should be
identified bug to the Chromium team and are awaiting their              ignored when strict-dynamic is specified in the
response.                                                               script-src or default-src directive of a given CSP.
    Regarding the CSP inheritance that involves static files, we            Unfortunately, we observed that Chromium did not ignore
observed that Chromium and Safari do not pass over the CSP              unsafe-inline even when strict-dynamic was spec-
of a parent window to its child window or iframe when they              ified in default-src. We also found that Safari did not
open static files. Note that site operators cannot define a CSP         ignore the host-source when strict-dynamic is specified
via meta tags in static files, such as .txt, .js, and .ico,             in script-src.
due to the nature of these file formats. Site operators may set
a CSP in an HTTP(S) response header when delivering these                   Since      neither   Firefox    nor     Safari    supports
files. However, the current practice overlooks assigning CSPs           strict-dynamic in default-src (inconsistency #16),
for static files in real-world services [22, 37, 41].                   it may seem impossible to find inconsistency #10 through
                                                                        differential testing. However, the following testing page and
    An XSS attacker is able to exploit this bug to establish            CSP enabled the finding of this bug:
a same-origin document context for XSS attacks [47, 64].
                                                                        1   CSP: default-src 'unsafe-inline' 'strict-dynamic';
Assume that a target website allows unsafe-inline in                    2   <script>
the script-src directive. Then, an XSS attack may open a                3       var o = document.createElement('script');
window with the target website’s favicon file path. The ad-             4       o.src = 'http://127.0.0.1:8000/test.js';
                                                                        5       document.body.appendChild(o);
versary then writes an attack script code in this window,               6   </script>
which will be executed using the first-party origin without any
CSP restrictions. One may argue that the unsafe-inline                  In Firefox and Safari, due to inconsistency #16, the inline
requirement in the target website does not necessitate the              script in Lines 3–5 is executed. However, the execution of
injection of an attack script in the new window. However,               the script generated by this script stops as it tries to fetch
the XSS attacker is able to bypass other restrictions im-               JS code from a URL not specified in the CSP. However,
posed by the CSP, such as TLS enforcement (block-all-                   Chromium executes inline scripts due to this bug because
-mixed-content and insecure-requests), frame                            unsafe-inline is not ignored. Moreover, interestingly, it
busting (frame-ancestors), fetch (connect-src), and                     allows arbitrary JS fetching from dynamically created scripts
invoking eval(). Furthermore, 56% of websites using CSPs                due to the strict-dynamic effect.
have deployed unsafe-inline in their directives [58].                      Site operators may specify unsafe-inline or host-
    We reported these bugs to each vendor, and the Chromium             source in a CSP, which they expect to be ignored by
vendor stated that, according to the CSP standard, the case             strict-dynamic in CSP3-supported browsers [38]. How-
of inheriting CSPs is limited to navigation by the local                ever, this bug allows the injection of an inline JS script, which
scheme, so this behavior is working as expected. However,               should be blocked. We reported these bugs to the Chromium
they acknowledged that this bug has the security implications           and WebKit vendors, and they patched these bugs.
aforementioned, and this issue is under discussion.                     Cause #4: Non-supporting specific directives. Fire-
Cause #2: Incorrect hash handling. As described in Figure 1,            fox does not support the script-src-elem [35] and
Chromium allowed the execution of arbitrary inline scripts              script-src-attr [34] directives. Despite the known fact
present in javascript: even when their hash value does not              that Firefox supports CSP3 [9], we noticed that Firefox did
match any hash values in the script-src-elem directive.                 not enforce the expected behaviors when these directives were
If a website has an XSS vulnerability and blocks arbitrary JS           present in given CSPs.
execution by checking hash values in script-src-elem,                       This inconsistency bug poses a security threat. Assume a
the attacker can exploit this bug to trivially bypass hash              site operator specifies their CSP with script-src-elem
checking and inject an executable script. We reported this bug          ‘none’ to prevent the execution of inline scripts. Firefox en-
to the respective vendor; however, this bug had already been            ables the execution of inline scripts, contrary to the operator’s
patched internally in May 2022.                                         expectations. Since these bugs are already known, we have not
                                                                        reported them. Firefox browser vendors had not implemented
    We also found incorrect directive fallback when han-
                                                                        these two directives for approximately three years. Recently,
dling a hash-source value in WebKit. Note that browsers
                                                                        Firefox implemented them in July 2022 [20] just two weeks
should only use script-src as a fallback when both
                                                                        before our submission.
script-src-elem and script-src-attr are not ex-
plicitly set in a given CSP [21]. However, WebKit uses the              Cause #5: Non-supporting specific directive values.
presence of a hash-source in the script-src directive even              Firefox does not support nonce-source, hash-source, and
when script-src-elem or script-src-attr exists in                       strict-dynamic in the default-src directive. Also,
a CSP. This means that the interpretation of a CSP satisfying           Safari does not support the strict-dynamic in the
the conditions above significantly differs by browsers, which           default-src directive. These inconsistent behaviors stem
may permit non-allowed scripts to be executed. This bug had             from Firefox and Safari not implementing a fallback mech-
been patched in the latest version of WebKit at the time we             anism; according to the specification, nonce-source, hash-
discovered it.                                                          source, and strict-dynamic in the default-src direc-

                                                                   10
             140
                                                                                     Complete Explanation                      160                                                                      Complete Explanation
             120
                                                                                     Partial Explanation                       140                                                                      Partial Explanation
             100                                                                                                               120




                                                                                                                  # of Paths
# of Paths




             80                                                                                                                100

             60                                                                                                                80
                                                                                                                               60
             40
                                                                                                                               40
             20                                                                                                                20
              0                                                                                                                 0
                   1   2   3   4   5   6   7   8   9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27                           1   2   3   4   5   6   7   8   9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27
                                                          Inconsistency                                                                                                     Inconsistency
                                               (a) Desktop browsers.                                                  (b) Mobile browsers.
                                                              Fig. 6: The number of decision tree paths for each root cause.

tive should be applied as a fallback when the script-src                                                              standard for these cases. WebKit, on the other hand, did not
directive is missing [13, 21].                                                                                        systematically test these edge cases, potentially allowing an
                                                                                                                      attacker to execute arbitrary JS from the same origin.
    These incomplete fallback behaviors have various se-
curity implications. Consider a website that defines the                                                              Specification bugs. We have also identified that unclear or
CSP of default-src [hash-source] ‘unsafe-                                                                             insufficient descriptions in the specification contributed to
-inline’. Note that, according to the specification,                                                                  causing inconsistencies #6, #25, and #31. For inconsistency #6,
unsafe-inline should be ignored if nonce-source, hash-                                                                we recommend inheriting the CSP of a parent window to its
source, or strict-dynamic is specified. Chromium hon-                                                                 child window or iframe when these child instances open static
ored this policy by not allowing any inline scripts. However,                                                         files, and these files are delivered without any CSP headers.
Firefox and Safari executed inline scripts, allowing an adver-
sary to execute an injected JS script.                                                                                    To clarify the specification regarding inconsis-
                                                                                                                      tency #25 (§V-C), we recommend the following two
    The Firefox vendor has been aware of this bug, but it                                                             procedures: (1) remove only bogus source expressions, not
has not been fixed since the CSP2 was released six years                                                              entire directives, except in the worst case (i.e., when only
ago [18]. After we discovered these three bugs via DiffCSP,                                                           none is left in the directive); and (2) accommodate and parse
we reported to the vendor that these bugs hadn’t been fixed                                                           non-ASCII characters for source-expressions.
yet, and recently, in November 2022, these bugs were finally
patched. Regarding the bug in Safari, we reported the bug to                                                              Regarding inconsistency #31, the specification said that
the corresponding vendor via WebKit Bugzilla, and the vendor                                                          hash-source can be applied to javascript: navigation [15]
acknowledged and fixed the bug.                                                                                       if unsafe-hashes is present. However, it does not clearly
                                                                                                                      specify what exactly to hash (i.e., whether to include javas-
                                                                                                                      cript:). Chromium-based browsers and Safari use the entire
D. Summary and Lessons                                                                                                attribute value (i.e., sha256(javascript:alert(1))),
                                                                                                                      but Firefox only uses everything after javascript: (i.e.,
Complex CSP specification. We observed that the majority
                                                                                                                      sha256(alert(1))) to compute the hash value. Although
of bugs (18 out of 29 security bugs) were eventually trig-
                                                                                                                      this inconsistency does not pose a security threat, we recom-
gered by combinations of multiple directive values in test
                                                                                                                      mend clearly specifying which part should be computed as a
CSPs. This result shows that different browsers interpret the
                                                                                                                      hash in the specification.
same CSPs in different ways. Interestingly, we noticed that
many of the bugs occurred due to divergent interpretations
regarding new CSP3 directives and fallback mechanisms. In                                                             E. Decision Tree
particular, 15 out of 18 bugs are caused by directives or values
introduced in CSP3 (four from strict-dynamic, six from                                                                    Recall that we analyzed 525 and 581 paths in the deci-
script-src-elem, four from script-src-attr, and                                                                       sion trees of the desktop and mobile browsers, respectively.
one from unsafe-hashes).                                                                                              Figures 6a and 6b show the number of decision paths that
                                                                                                                      contribute to identifying each security bug. The x-axis repre-
    We believe that this trend is inevitable because the expected                                                     sents each inconsistency bug index, and the y-axis represents
behaviors become complicated as the number of directives                                                              the number of paths that correspond to each found bug. We
and values increased to 24 and 11, respectively, in the CSP3                                                          observed that a large number of decision paths corresponds to
specification [58]. At the same time, this increasing complexity                                                      inconsistencies #12 and #13. This is because Firefox does not
in CSPs requires systematic browser testing. We believe that                                                          support the script-src-elem and script-src-attr
our differential testing approach using a large number of                                                             directives. In our decision trees, these conditions are the
adversarial HTML instances contributes to finding holes in                                                            majority cause of observed execution inconsistencies.
existing regression tests in browser vendors.
                                                                                                                          We also studied how helpful the decision trees are in
CSP bypass via page redirection. We observed that eight                                                               analyzing the root causes of inconsistent execution results.
out of 29 bugs (28%) were due to the improper updating of                                                             We measured whether the root causes are well explained in
a CSP to enforce when page redirection occurs. In particular,                                                         conditions in the paths of the decision trees. In particular, we
when an iframe or a window was loaded once and its source                                                             counted the number of paths that (1) completely explain the
or content was changed asynchronously, we observed many                                                               root cause and (2) partially explain the root cause, respectively.
cases in which the parent CSPs were not properly inherited.                                                           Here, the complete explanation path means that the conditions
However, we observed that Firefox correctly followed the CSP                                                          for a directive, a directive value, an HTML instance, and a

                                                                                                             11
                                                                                                                                                 30




                                                                                                                Accumulated # of Security Bugs
             25,000                                                                        0.98
                          # of Paths
                                                       0.95                                0.96
                          Recall                                                                                                                 25 90%
             20,000
                                                                                           0.94
# of Paths



                                                                                                                                                 20
             15,000                                                                        0.92




                                                                                                  Recall
                                                                                           0.9                                                   15
                                                                                                                                                      50%
             10,000                                                                        0.88
                                                                                                                                                 10
                                                                                           0.86
              5,000
                                                                                           0.84                                                   5
                                                       525
                 0                                                                         0.82                                                                        21.3%                                                 91.4%
                                                                                                                                                  0
                      2   3    4   5   6   7   8   9    10 11 12 13 14 15 16 17 18 19 20
                                                                                                                                                            1M    2M      3M    4M    5M     6M    7M     8M      9M   10M     11M
                                                         Depth                                                                                                         Pairs of CSP, Status Code, and HTML File
Fig. 7: The relationships between the depth of the decision tree, the                                           Fig. 8: The cumulative number of security bugs over executed test
recall of the training instances, and the number of decision paths.                                             inputs.

status code are all present in the path to describe the observed                                                    Figure 8 shows the cumulative number of unique security
inconsistency. For example, the second path of Figure 6a is                                                     bugs over the tested triads, each of which consists of a CSP,
a complete explanation path because its conditions have the                                                     an HTML instance, and a status code. In particular, on the x-
script-src directive, the directive value of hash-source,                                                       axis, we show the cumulative number of tested triads, and these
an HTML instance that has JS execution in an event handler,                                                     triads are sorted in the order in which DiffCSP fetches those
and the 200 status code.                                                                                        for execution. We increase the bug count on the first triad on
                                                                                                                the x-axis of which inconsistent execution results contribute to
    We observed that 538 of the 941 paths (57%) that map                                                        finding a bug. For 50% of the identified security bugs, DiffCSP
to their causes of the security bugs are complete explanation                                                   tested less than 21.3% of the generated triads. For 90% of the
paths. We also observed that 24 out of the 27 inconsistencies                                                   bugs, it required testing 91.4% of the triads. The results of
(89%) were completely explained by at least one path. For                                                       this analysis show that extending the test generation grammar
the three inconsistencies (#8, #9, and #11) that were not fully                                                 and running DiffCSP has the potential to discover more bugs
explained, the number of instances that cause the inconsistency                                                 when DiffCSP is capable of generating new HTML instances
is small; the branching for that condition occurs below depth                                                   involving JS execution.
10 in the tree. However, increasing the depth of the tree for
desktop browsers to 14 reveals a path that completely explains                                                                                                   VI.     L IMITATIONS AND D ISCUSSION
the root causes of these inconsistencies.
                                                                                                                    We leverage the inconsistent execution results for each
Decision depth. We analyzed how recall and the number of                                                        generated input as a bug oracle. Therefore, DiffCSP cannot
paths to inspect change while varying the depth of the desktop                                                  find a bug if all the browsers under testing exhibit the same
decision tree. Figure 7 shows that increasing the depth causes                                                  bug [42, 47, 48]. One can overcome this limitation by defining
an increase in the number of paths that need to be manually                                                     expected behaviors for each input, enabling the testing of a
inspected. It also contributes to increasing the recall rate of                                                 single browser implementation. However, defining the correct
the training instances, meaning that the decision tree becomes                                                  behavior for each combination of 25,880 HTML instances
more explanatory by reducing non-explainable inconsistent                                                       and 1,006 CSPs is an open research problem. The automatic
execution results (i.e., false negatives). Note that we observed                                                extraction and adoption of these correct behaviors represent
an analogous pattern in the mobile decision tree. We choose                                                     interesting technical challenges that we leave to future research.
to set the depth of the decision tree to 10, which exhibits a
                                                                                                                    We also note that our sampling strategy of selecting one
high recall rate and produces an acceptable number of paths
                                                                                                                representative test instance among the test instances that share
to analyze.
                                                                                                                the same path may cause false negatives in identifying a new
False positives (FPs). Among the 525 and 581 paths in the                                                       cause. This can happen when the test instances that corre-
desktop and mobile decision trees, 39 and 42 were FPs out                                                       spond to a certain path yield both consistent and inconsistent
of 11,663 HTML files, respectively. These FPs correspond                                                        execution results. For such cases, we manually analyzed all of
to the cases in which our testing frameworks reported false                                                     the 187 and 217 paths that leading to leaf nodes having both
execution results because the execution of the generated test                                                   inconsistent and consistent execution results in the desktop and
files exceeded a given timeout. Recall that we set the number                                                   mobile decision trees, respectively. However, this additional
of HTML instances in each file to 80 to boost the testing                                                       analysis did not reveal any new causes.
efficiency (§IV-C). This means that tests towards the end of                                                        We acknowledge that our HTML grammar is not nec-
the file may not be executed before the timeout, leading to                                                     essarily complete in generating all possible HTML forms
inconsistent behavior and, thus, a false report. In practice, these                                             for executing JS snippets. Therefore, if there exist unknown
FP cases can be scheduled again for further testing with an                                                     HTML forms of executing JS snippets, DiffCSP may miss CSP
extended timeout to remove false positives.                                                                     enforcement bugs, producing false negatives. However, note
                                                                                                                that, among 47 reported CSP bugs involving JS execution since
F. Performance                                                                                                  2010, including 18 ones that we found, DiffCSP generated
                                                                                                                HTML instances that triggered 46 bugs (97%).
    A total of 200 hours with 88 cores and 153 hours with
192 core CPUs were consumed to find CSP enforcement bugs                                                            We emphasize that the grammar rules that we proposed
for desktop and mobile browsers, respectively. In addition,                                                     include not only the general rules corresponding to the HTML
two researchers spent two days analyzing the decision trees                                                     and ECMAScript specifications but also the adversarial gen-
to identify the root causes of the detected 37 bugs.                                                            eration rules corresponding to the 28 known CSP bugs. We

                                                                                                           12
observed that these adversarial payloads were applied as-is to           set up a CSP or give up entirely. They nevertheless provided
the browser’s regression test set, without any combination or            clear evidence of the uptake in CSP deployment, necessitating
mutation. These adversarial grammar rules helped DiffCSP to              a thorough analysis of the enforcement in browsers. Eriksson
identify 10 more bugs, which would not be discovered by only             and Sabelfeld [50] then analyzed the not-yet implemented
using the general grammar rules and the known payloads.                  navigate-to directive and proposed to automate the pro-
                                                                         cess of curating policies with the directive.
    DiffCSP supports extending the current HTML grammar
by adding new derivation rules. Security researchers and                     All of this research has demonstrated that curating a
practitioners are thus able to add their own derivation rules            functional and secure CSP is a challenging task. However,
to attempt to find more bugs. Specifically, they can extend              none of the works have attempted to systematically analyze
the grammar by symbolizing and classifying new HTML or                   to what extent CSPs are properly implemented in browsers, in
JS snippets with reference to the grammar in Table II. The               particular for edge cases. In contrast, with DiffCSP, our work
testing CSPs can also be extended by adding new directives               aims to understand enforcement bugs in browsers, which may
or values to Table I.                                                    even result in the bypassing of seemingly secure CSPs.
    We adopt the interpretation of the computed decision trees               For their 2016 paper, Calzavara et al. [43] also evaluated
to group test instances that share the same decision paths,              browser supports for CSPs. Contrary to DiffCSP using differ-
thereby avoiding to analyze each inconsistent execution result           ential testing, they manually composed tests and modeled their
and its corresponding test input. However, to identify common            expected behaviors, leaving many corner cases unexplored.
causes of these bugs, we still manually analyzed 525 and 581             In particular, they utilized visual cues to model the expected
paths for the desktop and mobile browsers, respectively. This            behavior corresponding to each page and manually accessed
step required two authors to spend two days identifying the              the test page from each browser to examine whether the
causes of these paths.                                                   visual cues were well represented (e.g., JS should be executed
    We note that the conditions that appear in the decision              and an alert should appear). Due to this manual approach,
tree paths help distinguish bugs due to unsupported features             they modeled 15 tests, contributing to finding one CSP bug
from bugs caused by developer mistakes. For example, five                involving JS execution.
inconsistencies due to unsupported specific directives and                   By contrast, DiffCSP conducts scalable and systematic
directive values are distinguishable from other inconsistencies          CSP enforcement testing by leveraging various types of ad-
because those unsupported features appeared in the conditions            versarial HTML instances and differential testing, enabling
in the paths leading to the groups having those bugs. These              to avoid a manual analysis to identify correct behaviors for
conditions can help browser vendors quickly disregard such               each generated test, thereby helping to find a total of 37
cases.                                                                   bugs. By conducting differential testing, we narrow down the
                                                                         scope of promising tests that invoke potential bugs and then
                    VII.   R ELATED WORK                                 sample representative tests using the decision trees to manually
Content Security Policy. Prior work has largely focused on               investigate.
studying the prevalence and struggles with CSPs [44, 49, 51,             Browser security policy testing and analysis. There has
56, 57, 71, 72], finding that building applications that are             been a surge in research in the study of web security poli-
compliant with a safe CSP is a challenging task that few sites           cies provided by browsers [47, 54, 55, 67]. In particular,
master. Follow-up work has then attempted to aid developers              several works have focused on testing SSL/TLS implemen-
in the process of building CSPs. Pan et al. [56] proposed                tation [42, 48], same origin policy [61, 63], HTTPOnly
CSPAutoGen, which automatically composes declarations for                cookies [73], HSTS [53], and clickjacking protection [46]
enforcing a CSP in real-time through both analyses of existing           Calzavara et al. [47] found that the inconsistent adoption
resources and rewriting to enable compliance. Doupé et al. [49]          of security mechanisms across different pages within the
introduced an automatic code rewriting technique to extract              same origin can express conflicting security requirements.
trusted inline scripts from web applications and use these               Roth et al. [59] discovered that client-side policies, including
extracted scripts in the script-src directive in generated               CSPs, X-Frame-Options, HSTS, and security cookies, were ap-
CSPs.                                                                    plied differently when accessing the same site through different
    Another recent line of research focuses on analyzing the             settings. Recently, there have been several studies on security
trend of insecurity regarding CSPs deployed on the Web [43,              policies in mobile browsers [52, 54, 55]. Luo et al. [54]
45, 50, 58, 60, 64, 65, 66, 68, 70]. Weichselbaum et al. [70] ex-        investigated the browser supports for eight different secu-
amined the effectiveness of deployed CSPs in 1,680,000 hosts             rity mechanisms, including CSP, HSTS, and referrer header,
on the Internet. They also demonstrated that approximately               across 351 unique browser versions. Kondracki et al. [52]
95% of the collected policies offered little security protection         demonstrated that enabling data-saving functionality in mobile
against XSS attacks due to the usage of unsafe-inline                    browsers poses security threats, including TLS man-in-the-
and unsafe endpoints. Calzavara et al. [43, 45] examined the             middle attacks and HSTS deactivation.
updates in CSPs and demonstrated that the CSPs were not fre-
quently updated to mitigate insecure practices. Roth et al. [58]                              VIII.   CONCLUSION
performed a historical analysis of how CSP adoption has
evolved from 2012 to 2018. They found that many CSPs can                     With CSP’s adoption rates rising and more sites to mitigate
be bypassed through expired domains or domains with typos,               the impact of cross-site scripting (XSS) flaws every day, it is
but more importantly, developers often struggle for years to             imperative that enforcement of these policies is consistent and

                                                                    13
secure across all browsers. While prior work had found indi-                            [19]   “Firefox bugzilla - CSP script-src with hashes allow inline event
vidual bugs in CSP, our community lacked a comprehensive                                       handlers to match the hash (even if ‘unsafe-hashes’ is not present),”
and systematic way of testing CSP implementations.                                             https://bugzilla.mozilla.org/show_bug.cgi?id=1683506.
                                                                                        [20]   “Firefox bugzilla - implement CSP ‘script-src-elem’ and ‘script-src-attr’
     To close this research gap, we proposed DiffCSP, the                                      directives,” https://bugzilla.mozilla.org/show_bug.cgi?id=1529337.
first differential testing framework designed to identify CSP                           [21]   “Get fetch directive fallback list,” https://www.w3.org/TR/CSP3/
enforcement bugs regarding JS execution. Our key contribu-                                     #directive-fallback-list.
tions are (1) to propose an HTML grammar enumerating all                                [22]   “GitHub robots.txt,” https://github.com/robots.txt.
known HTML instances that execute simple JS snippets, (2) to                            [23]   “Global market share held by leading desktop internet browsers from
conduct differential testing to identify the correct behavior for                              january 2015 to december 2021,” https://www.statista.com/statistics/
                                                                                               544400/market-share-of-internet-browsers-desktop/.
each generated CSP and HTML instance, and (3) to analyze
                                                                                        [24]   “HTML5 security cheatsheet,” https://html5sec.org/.
a large volume of execution inconsistencies by leveraging
                                                                                        [25]   “Informational 1xx,” https://www.rfc-editor.org/rfc/rfc9110.html#
decision trees. Our testing uncovered critical flaws in major                                  section-15.2.
browsers, including Chrome, Firefox, and Safari, which allow
                                                                                        [26]   “Internationalized domain names for applications (IDNA): Definitions
an XSS attacker to fully bypass CSPs. We found 29 security                                     and document framework,” https://datatracker.ietf.org/doc/html/rfc5890.
bugs and eight functional bugs, demonstrating the effectiveness                         [27]   “Issue 882270: Security: url spoofing using 304 status code,” https:
of DiffCSP in finding CSP enforcement bugs.                                                    //bugs.chromium.org/p/chromium/issues/detail?id=882270.
                                                                                        [28]   “Page.navigate doesn’t fail for status code other than 200 (eg. 204 - no
                                                                                               content),” https://bugzilla.mozilla.org/show_bug.cgi?id=1618863.
                          ACKNOWLEDGMENTS                                               [29]   “Parse      a      serialized        CSP,”   https://www.w3.org/TR/CSP3/
                                                                                               #parse-serialized-policy.
    The authors would like to thank the anonymous reviewers
                                                                                        [30]   “Playwright enables reliable end-to-end testing for modern web apps.”
for their concrete feedback. This work was supported by Insti-                                 https://playwright.dev/.
tute of Information & Communications Technology Planning
                                                                                        [31]   “scheme-part             matching,”          https://www.w3.org/TR/CSP3/
& Evaluation (IITP) grant funded by the Korea government                                       #match-schemes.
(MSIT), No.2020-0-00209 and Korea Internet & Security                                   [32]   “Script directives pre-request check,” https://www.w3.org/TR/CSP3/
Agency (KISA) grant funded by the Korea government (PIPC)                                      #script-pre-request.
(No.1781000003, Development of a Personal Information Pro-                              [33]   “script-src,” https://www.w3.org/TR/CSP3/#directive-script-src.
tection Framework for Identifying and Blocking Trackers).                               [34]   “script-src-attr,”                           https://www.w3.org/TR/CSP3/
                                                                                               #directive-script-src-attr.
                                                                                        [35]   “script-src-elem,”                           https://www.w3.org/TR/CSP3/
                               R EFERENCES                                                     #directive-script-src-elem.
 [1]   “Android debug bridge (ADB),” https://developer.android.com/studio/              [36]   “Source                  lists,”             https://www.w3.org/TR/CSP3/
       command-line/adb.                                                                       #framework-directive-source-list.
 [2]   “The Chromium projects - Blink (rendering engine),” https://www.                 [37]   “Twitter robots.txt,” https://twitter.com/robots.txt.
       chromium.org/blink/.                                                             [38]   “Usage        of     ‘strict-dynamic’,”      https://www.w3.org/TR/CSP3/
 [3]   “Content-disposition attachment vs 4xx status code from server,” https:                 #strict-dynamic-usage.
       //bugzilla.mozilla.org/show_bug.cgi?id=364354.                                   [39]   “web-platform-tests              for       CSP        in      Chromium,”
 [4]   “Content security policy level 1,” https://www.w3.org/TR/CSP1/.                         https://chromium.googlesource.com/chromium/src/+/
                                                                                               02495a2c0b813fd89d2759482255d08f2b0643f8/third_party/blink/
 [5]   “Content security policy level 2,” https://www.w3.org/TR/CSP2/.
                                                                                               web_tests/external/wpt/content-security-policy.
 [6]   “Content security policy level 3,” https://www.w3.org/TR/CSP3/.                  [40]   “WHATWG fetch living standard — last updated 25 may 2022,” https:
 [7]   “Create and manage virtual devices,” https://developer.android.com/                     //fetch.spec.whatwg.org/.
       studio/run/managing-avds.                                                        [41]   “YouTube favicon.ico,” https://www.youtube.com/favicon.ico.
 [8]   “Cross site scripting (XSS) vulnerability payload list,” https://github.         [42]   C. Brubaker, S. Jana, B. Ray, S. Khurshid, and V. Shmatikov, “Using
       com/payloadbox/xss-payload-list.                                                        frankencerts for automated adversarial testing of certificate validation
 [9]   “CSP browser support,” https://content-security-policy.com/.                            in SSL/TLS implementations,” in Proceedings of the IEEE Symposium
[10]   “CSP       bugs      in     Chromium,”       https://bugs.chromium.org/p/               on Security and Privacy, 2014, pp. 114–129.
       chromium/issues/list?q=component:Blink%3ESecurityFeature%                        [43]   S. Calzavara, A. Rabitti, and M. Bugliesi, “Content security problems?
       3EContentSecurityPolicy.                                                                evaluating the effectiveness of content security policy in the wild,” in
[11]   “CSP bugs in Firefox,” https://bugzilla.mozilla.org/buglist.cgi?query_                  Proceedings of the ACM Conference on Computer and Communications
       format=advanced&short_desc_type=allwordssubstr&resolution=                              Security, 2016, pp. 1365–1375.
       FIXED&short_desc=csp%20bypass.                                                   [44]   ——, “CCSP: Controlled relaxation of content security policies by
[12]   “CSP inheriting to avoid bypasses,” https://www.w3.org/TR/CSP3/                         runtime policy composition,” in Proceedings of the USENIX Security
       #security-inherit-csp.                                                                  Symposium, 2017, pp. 695–712.
[13]   “default-src,” https://www.w3.org/TR/CSP3/#directive-default-src.                [45]   ——, “Semantics-based analysis of content security policy deploy-
                                                                                               ment,” ACM Transactions on the Web, vol. 12, no. 2, pp. 1–36, 2018.
[14]   “Directives,” https://www.w3.org/TR/CSP3/#framework-directives.
                                                                                        [46]   S. Calzavara, S. Roth, A. Rabitti, M. Backes, and B. Stock, “A tale of
[15]   “Does element match source list for type and source?” https://www.w3.                   two headers: A formal analysis of inconsistent Click-Jacking protection
       org/TR/CSP3/#match-element-to-source-list.                                              on the web,” in Proceedings of the USENIX Security Symposium, 2020,
[16]   “Does url match source list in origin with redirect count?” https://www.                pp. 683–697.
       w3.org/TR/CSP3/#strict-dynamic-usage.                                            [47]   S. Calzavara, T. Urban, D. Tatang, M. Steffens, and B. Stock, “Reining
[17]   “ECMA-262, 13th edition, june 2022 ECMAScript 2022 language                             in the web’s inconsistencies with site policy,” in Proceedings of the
       specification,” https://262.ecma-international.org/13.0/.                               Network and Distributed System Security Symposium, 2021.
[18]   “Firefox bugzilla - CSP: Enforce ‘strict-dynamic’ and nonce within               [48]   Y. Chen and Z. Su, “Guided differential testing of certificate validation
       default-src,” https://bugzilla.mozilla.org/show_bug.cgi?id=1313937.                     in SSL/TLS implementations,” in Proceedings of the International


                                                                                   14
       Symposium on Foundations of Software Engineering, 2015, pp. 793–                 [68]   P. Stolz, S. Roth, and B. Stock, “To hash or not to hash: A security
       804.                                                                                    assessment of CSP’s unsafe-hashes expression,” in Proceedings of the
[49]   A. Doupé, W. Cui, M. H. Jakubowski, M. Peinado, C. Kruegel, and                         IEEE Security and Privacy Workshops - SecWeb, 2022.
       G. Vigna, “deDacota: Toward preventing server-side XSS via automatic             [69]   J. Wang, B. Chen, L. Wei, and Y. Liu, “Skyfire: Data-driven seed
       code and data separation,” in Proceedings of the ACM Conference on                      generation for fuzzing,” in Proceedings of the IEEE Symposium on
       Computer and Communications Security, 2013, pp. 1205–1216.                              Security and Privacy, 2017, pp. 579–594.
[50]   B. Eriksson and A. Sabelfeld, “AutoNav: Evaluation and automatization            [70]   L. Weichselbaum, M. Spagnuolo, S. Lekies, and A. Janc, “CSP is dead,
       of web navigation policies,” in Proceedings of the Web Conference,                      long live CSP! on the insecurity of whitelists and the future of content
       2020, pp. 1320–1331.                                                                    security policy,” in Proceedings of the ACM Conference on Computer
                                                                                               and Communications Security, 2016, pp. 1376–1387.
[51]   M. Fazzini, P. Saxena, and A. Orso, “AutoCSP: automatically retrofitting
       CSP to web applications,” in Proceedings of the International Confer-            [71]   M. Weissbacher, T. Lauinger, and W. Robertson, “Why is CSP failing?
       ence on Software Engineering, 2015, pp. 336–346.                                        trends and challenges in CSP adoption,” in Proceedings of the Inter-
                                                                                               national Conference on Research in Attacks, Intrusions, and Defenses,
[52]   B. Kondracki, A. Aliyeva, M. Egele, J. Polakis, and N. Nikiforakis,
                                                                                               2014, pp. 212–233.
       “Meddling middlemen: Empirical analysis of the risks of data-saving
       mobile browsers,” in Proceedings of the IEEE Symposium on Security               [72]   M. Wilhelm, S. Roth, and B. Stock, “RetroCSP: Retrofitting universal
       and Privacy, 2020, pp. 810–824.                                                         browser-support for CSP,” in Proceedings of the IEEE Security and
                                                                                               Privacy Workshops - SecWeb, 2022.
[53]   M. Kranch and J. Bonneau, “Upgrading HTTPs in mid-air,” in Pro-
       ceedings of the Network and Distributed System Security Symposium,               [73]   Y. Zhou and D. Evans, “Why aren’t HTTP-only cookies more widely
       2015.                                                                                   deployed,” Proceedings of Web, vol. 2, 2010.
[54]   M. Luo, P. Laperdrix, N. Honarmand, and N. Nikiforakis, “Time does
       not heal all wounds: A longitudinal analysis of security-mechanism
       support in mobile browsers,” in Proceedings of the Network and
       Distributed System Security Symposium, 2019.
[55]   A. Mendoza, P. Chinprutthiwong, and G. Gu, “Uncovering HTTP
       header inconsistencies and the impact on desktop/mobile websites,” in
       Proceedings of the international conference on World wide web, 2018,
       pp. 247–256.
[56]   X. Pan, Y. Cao, S. Liu, Y. Zhou, Y. Chen, and T. Zhou, “CSPAutoGen:
       Black-box enforcement of content security policy upon real-world
       websites,” in Proceedings of the ACM Conference on Computer and
       Communications Security, 2016, pp. 653–665.
[57]   S. Roth, M. Backes, and B. Stock, “Assessing the impact of script
       gadgets on CSP at scale,” in Proceedings of the ACM Symposium on
       Information, Computer and Communications Security, 2020, pp. 420–
       431.
[58]   S. Roth, T. Barron, S. Calzavara, N. Nikiforakis, and B. Stock,
       “Complex security policy? a longitudinal analysis of deployed content
       security policies,” in Proceedings of the Network and Distributed System
       Security Symposium, 2020.
[59]   S. Roth, S. Calzavara, M. Wilhelm, A. Rabitti, and B. Stock, “The
       security lottery: Measuring client-side web security inconsistencies,” in
       Proceedings of the USENIX Security Symposium, 2022.
[60]   S. Roth, L. Gröber, M. Backes, K. Krombholz, and B. Stock, “12 angry
       developers-a qualitative study on developers’ struggles with CSP,” in
       Proceedings of the ACM Conference on Computer and Communications
       Security, 2021, pp. 3085–3103.
[61]   J. Schwenk, M. Niemietz, and C. Mainka, “Same-Origin policy: Eval-
       uation in modern browsers,” in Proceedings of the USENIX Security
       Symposium, 2017, pp. 713–727.
[62]   T. Shiba, T. Tsuchiya, and T. Kikuno, “Using artificial life techniques
       to generate test cases for combinatorial testing,” in Proceedings of
       the IEEE Annual International Computer Software and Applications
       Conference, 2004, pp. 72–77.
[63]   K. Singh, A. Moshchuk, H. J. Wang, and W. Lee, “On the incoherencies
       in web browser access control policies,” in Proceedings of the IEEE
       Symposium on Security and Privacy, 2010, pp. 463–478.
[64]   D. F. Some, N. Bielova, and T. Rezk, “On the content security
       policy violations due to the same-origin policy,” in Proceedings of the
       international conference on World wide web, 2017, pp. 877–886.
[65]   S. Stamm, B. Sterne, and G. Markham, “Reining in the web with
       content security policy,” in Proceedings of the international conference
       on World wide web, 2010, pp. 921–930.
[66]   M. Steffens, M. Musch, M. Johns, and B. Stock, “Who’s hosting the
       block party? studying third-party blockage of CSP and SRI,” in Pro-
       ceedings of the Network and Distributed System Security Symposium,
       2021.
[67]   B. Stock, M. Johns, M. Steffens, and M. Backes, “How the web
       tangled itself: Uncovering the history of client-side web (in) security,”
       in Proceedings of the USENIX Security Symposium, 2017, pp. 971–987.


                                                                                   15
                       IX.   A PPENDIX                                      Note that the 1xx class of status code indicates that a
                                                                        server has received a request and continues to generate its
A. Additional Root Causes                                               response [25]. According to the WHATWG fetch standard, a
Cause #6: Auto-enabling directive values by default.                    response with the status code 100 or 102 should be ignored,
We observed that Firefox enabled unsafe-hashes in the                   and status code 101 should have a body set to null [40].
script-src directive by default. We argue that this default             We observed that Safari and Firefox correctly followed this
behavior deviates from the CSP specification and poses a                standard. However, Chromium treated the content of these
security threat.                                                        responses normally as if they had the status code of 200, while
                                                                        ignoring the headers of these responses. Therefore, when a
1   CSP: script-src-elem 'sha256-Mg0QnPgA...';                          naive developer writes a web page with any of the response
2   <img onload =                                                       codes above, the attacker is able to inject an arbitrary JS script
3     "document.write(this.getAttribute('data'))"
4   </img>                                                              regardless of the CSP in this webpage.
                                                                           Chromium developers acknowledged and patched our re-
Consider a webpage with the CSP of script-src                           porting of this bug and stated that this bug contributes to by-
‘sha256-Mg0QnPgA...’, as shown above. Note that                         passing not only CSP but also other security policies, including
the inline script in Line 3 must be blocked because                     HTTP Strict Transport Security (HSTS) and X-Frame-Options.
unsafe-hashes is not specified in the CSP. However,
Firefox allows the execution of the inline script in the onload         Cause #9: Incorrect handling of malformed CSPs. We
handler due to this bug. In this case, the adversary is able            observed that Chromium and Safari ignored an entire given di-
to reuse the existing event handler to execute an injected              rective when the directive contains an invalid value. In contrast,
script [68]; they are able to inject the arbitrary tag embedding        Firefox only drops an invalid value in the directive. For in-
the exploiting payload in the data attribute, thus allowing the         stance, consider the CSP of script-src http://a.com
XSS attack. This bug had been reported to Firefox by others             http://<non-ASCII-chars>.com. Chromium and Sa-
over three years ago, but Mozilla hasn’t patched it [19]. After         fari ignore the script-src directive, allowing the execution
we found this bug via DiffCSP, we mentioned to the vendor               of any scripts. Conversely, Firefox still honors the directive by
that this bug hadn’t been fixed yet, and recently, in November          allowing the execution of scripts from http://a.com and
2022, it was finally patched.                                           blocking the execution of other inline and external scripts.
    We also found that Safari enables * in the                              Interestingly, the CSP specification describes the
script-src-elem directive by default. This default                      Chromium and Safari behavior as valid [29]. The reason
behavior bug imposes a security threat; when a site                     is to prevent the worst scenario that the page itself does
operator attempts to block all script requests by specifying            not work due to a malformed CSP. Assume that we specify
script-src-elem ‘none’, Safari allows fetching                          default-src http://<non-ASCII-chars>.com.
scripts from arbitrary endpoints, contrary to the operator’s            If a browser only drops the invalid value, the CSP becomes
expectations. We reported this bug to the WebKit team, and              default-src, which is semantically equivalent to
the vendor patched the bug.                                             default-src ‘none’, which blocks all resources. On
                                                                        the other hand, if a browser drops the entire directive in
Cause #7: Auto-enabling directive values on spe-                        compliance with the CSP specification, it blocks no resources
cific conditions. We have found several bugs in Sa-                     on the page. Although the handling of malformed CSPs
fari in which specific directive values are automati-                   adopted by the current specification provides convenience to
cally enabled under certain conditions. For example, Sa-                end users, it poses a security threat.
fari automatically activates unsafe-inline for the
script-src-elem directive when strict-dynamic                           Cause #10: Allowing out-going requests. According
is present. Also, when a hash-source is specified in the                to the script directives pre-request check in the CSP
script-src-elem or script-src-attr directive, we                        specification [32], when there is strict-dynamic in
observed that unsafe-inline is auto-enabled for both                    the script-src directive, the request from the parser-
directives. Unfortunately, inconsistencies #20–#23 could be             inserted script (e.g., regular script tags) must be blocked.
triggered even with an arbitrary hash value rather than the             However, Firefox does not follow this specification and sends
hash of an inline script in a testing webpage. These bugs are           outgoing requests for <script src=[URL]></script>
thus able to enable unsafe-inline in certain CSPs, thus                 even though CSP is script-src ‘nonce-123’
allowing an XSS attacker to inject inline scripts.                      ‘strict-dynamic’. In Chromium-based browsers,
                                                                        the same bug occurs when a page is <script
   We have identified these bugs in our differential testing.           nonce=123>document.write(‘<script
However, they had already been patched by the time that we              src=[URL]><script>’);</script>, and its CSP
identified them.                                                        is script-src ‘nonce-123’ ‘strict-dynamic’
                                                                        [URL].
Cause #8: Non-supporting CSP for specific status code. We
observed that Chromium ignored a CSP when the HTML re-                      Since script execution is still blocked, the impact of the
sponse came with the status code of 100. We further confirmed           problem for XSS attacks is limited. However, such scripts can
that this behavior also occurred when the status code is 101            be used for the exfiltration of sensitive data. We have reported
or 102. This means that Chromium-based browsers ignore any              these bugs; however, the vendors have not responded yet.
CSPs when a webpage is fetched with one of these response
status codes.

                                                                   16
