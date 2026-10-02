---
type: Article
title: "Testability Tarpits: the Impact of Code Patterns on the Security Testing of Web Applications"
resource: "https://www.ndss-symposium.org/ndss-paper/auto-draft-206/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:23:07+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/auto-draft-206/"
    title: "Testability Tarpits: the Impact of Code Patterns on the Security Testing of Web Applications"
    author: Feras Al Kassar, Giulia Clerici, Luca Compagna, Davide Balzarotti, Fabian Yamaguchi
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2022-150-paper.pdf"
authors:
  - Feras Al Kassar
  - Giulia Clerici
  - Luca Compagna
  - Davide Balzarotti
  - Fabian Yamaguchi
canonical_url: ""
cited_by:
  - "2022.md:78"
commit: ""
content_sha256: 99be22c9154049d9955aa63a1d829f64dabaa2a4ccbced48fb988d27d9c4beba
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/auto-draft-206/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: cbe15adcba9e732dc3bb0e9ab5c2f78907051f7d7077f202334c2a78d726d518
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2022-150-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:23:07+00:00"
slug: ndss-symposium-testability-tarpits-impact-code-patterns-security-applications
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Testability Tarpits: the Impact of Code Patterns on the Security Testing of Web Applications

**Testability Tarpits: the Impact of Code Patterns on the Security Testing of Web Applications** - Feras Al Kassar, Giulia Clerici, Luca Compagna, Davide Balzarotti, Fabian Yamaguchi, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/auto-draft-206/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2022-150-paper.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2022-150-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Testability Tarpits: the Impact of Code Patterns
 on the Security Testing of Web Applications

      Feras Al Kassar∗‡ , Giulia Clerici∗ , Luca Compagna∗ , Fabian Yamaguchi† , Davide Balzarotti‡
     {feras.al-kassar, giulia.clerici, luca.compagna}@sap.com, fabs@shiftleft.io, davide.balzarotti@eurecom.fr
                                  ∗ SAP Security Research † ShiftLeft Inc ‡ EURECOM


   Abstract—While static application security testing tools        applications: static application security testing (SAST) and
(SAST) have many known limitations, the impact of coding           dynamic application security testing (DAST). Dynamic
style on their ability to discover vulnerabilities remained        approaches are sound, but often treat the application as
largely unexplored. To fill this gap, in this study we experi-     a black box and are therefore severely limited in the
mented with a combination of commercial and open source se-        number of vulnerabilities they can detect. Static tools can
curity scanners, and compiled a list of over 270 different code
patterns that, when present, impede the ability of state-of-the-
                                                                   instead reason about the entire behavior of the application,
art tools to analyze PHP and JavaScript code. By discovering       thus potentially detecting more vulnerabilities. However,
the presence of these patterns during the software develop-        in practice, they are neither sound nor complete, and
ment lifecycle, our approach can provide important feedback        often result in very large amounts of false positives.
to developers about the testability of their code. It can also
help them to better assess the residual risk that the code could      To mitigate this problem, a large amount of research
still contain vulnerabilities even when static analyzers report    has been conducted to improve these two numbers, by
no findings. Finally, our approach can also point to alternative   either proposing techniques to increase the ability of
ways to transform the code to increase its testability for SAST.   static analysis to discover more vulnerabilities or to
                                                                   reduce the number of false alarms. Despite the progress
   Our experiments show that testability tarpits are very
common. For instance, an average PHP application contains
                                                                   done in both directions, it is undeniable that SAST tools
over 21 of them and even the best state of art static analysis     still struggle to cope with the complexity of real-world
tools fail to analyze more than 20 consecutive instructions        code – which is one of the reasons for the poor security
before encountering one of them. To assess the impact              of today’s web applications.
of pattern transformations over static analysis findings,
we experimented with both manual and automated code                   In this paper, we look at the problem from a different
transformations designed to replace a subset of patterns with      angle. In particular, we focus on another limitation of
equivalent, but more testable, code. These transformations         these tools that is often neglected: the fact that it is very
allowed existing tools to better understand and analyze the        difficult (independently from the tool’s precision) for an
applications, and lead to the detection of 440 new potential       analyst to interpret their results. In the example above,
vulnerabilities in 48 projects. We responsibly disclosed           how can we translate the lack of vulnerabilities reported
all these issues: 31 projects already answered confirming          by a SAST tool into an actionable insight on the security
182 vulnerabilities. Out of these confirmed issues– that           of the application?
remained previously unknown due to the poor testability            A key observation that motivates our work is that while
of the applications code– there are 38 impacting popular
Github projects (>1k stars), such as PHP Dzzoffice (3.3k),         the precision of the results depends on the tool, the level
JS Docsify (19k), and JS Apexcharts (11k). 25 CVEs have            of “confidence” largely depends on the application. For
been already published and we have others in-process.              instance, if zero vulnerabilities are reported in a small
                                                                   application with only a handful of untrusted input, the
                                                                   analyst might be confident that the tool was right and the
                    I.   I NTRODUCTION                             codebase could not contain many undetected vulnerabil-
   According to the 2020 Edgescan Security Report, “Web            ities. In contrast, if the same result is returned on a very
application security is where the majority of risk still           large and complex application, that confidence might be
resides” [13]. This is confirmed by the fact that most of the      much lower, therefore resulting in a higher residual risk
recent data breaches took advantage of the poor security           that the code could still contain vulnerabilities.
of web applications. From a defensive point of view, there
                                                                      Our goal is to find a way to capture this residual risk
are two main options to detect vulnerabilities in web
                                                                   by proposing a novel approach based on the concept
                                                                   of testability tarpits. A tarpit is a specific pattern of
                                                                   code that is known to cause problems for a class of
Network and Distributed Systems Security (NDSS) Symposium 2022     static analysis tools. Other researchers have reported such
24-28 April 2022, San Diego, CA, USA
ISBN 1-891562-74-6                                                 patterns as a way to point out the current limitations
https://dx.doi.org/10.14722/ndss.2022.24150                        (and possible venues for improvement) of static analysis
www.ndss-symposium.org                                             tools. We propose instead to use them as a metric to
capture how testable an application is. The intuition is                  1   / / FILE : c o r e / g p c a p i . php
that the residual risk of undiscovered vulnerabilities is                 2   f u n c t i o n g p c g e t ( $name , . . ) {
                                                                          3     i f ( i s s e t ( $ POST [ $name ] ) ) {
lower if the application was easy to analyze, and higher                  4       $ r = g p c s t r i p s l a s h e s ( $ POST [ $name ] ) ;
if it presented many challenges for the analysis tool.                    5     }
                                                                          6      ...
   By building upon a comprehensive library of testability 78                   r e t u r n $r ;
                                                                              }
tarpits, we propose a general framework that can support 9
a more principled understanding of the results of one 10 f u n c t i o n g p c g e t s t r i n g ( $name , . . ) {
                                                                   $args = func get args () ;
(or a composition of) SAST tool(s). Our approach does 11      12   $r = c a l l u s e r f u n c a r r a y ( ’ gpc get ’ , $args ) ;
not only provide a way to assess the confidence of the 13 . . .
reported results, but it also points to the precise nature 14 r e t u r n $ r ;
                                                                 }
and location of the code that reduces this confidence. 15     16
As a result, an analyst can decide to add more tools to 17 / / FILE : b u g a c t i o n g r o u p e x t . php
reduce the impact of the existing tarpits, to perform a 18       $act = gpc get string ( ’ action ’ ) ;
                                                              19 $ a c t f i l e = ’ b u g a c t i o n g r o u p ’ . $ a c t . ’ i n c . php ’ ;
manual audit of a poorly testable part of the code, or to 20 r e q u i r e o n c e ( . . . $ a c t f i l e ) ;
refactor part of the application to increase its testability.
                                                                              Listing 1.    Example of a file injection vulnerability in MantisBT
   While the methodology we present is general and
independent of the language of the application and the
class of tools used to analyze it, in this paper we focus on
static analysis tools for PHP and Javascript (JS, in short)                   reported, leading us to the disclosure of 71 confirmed
code, the two most common languages for web application                       vulnerabilities, as some of the discovered issues still
development. In particular, we create a library of 122                        applied to the latest version of the tested projects. In
testability tarpits for PHP and 153 tarpits for JS (cf. III-A),               the second experiment (Section VII), we target instead
covering language features, built-in APIs, security-related                   thousands of popular real-world applications (the same we
functionalities, and static and dynamic operations. We then                   used for the prevalence experiment), to which we apply
selected an arsenal of 11 commercial and open-source                          five pattern transformations in a fully automated fashion.
SAST tools (6 for PHP and 5 for JS) and we assessed                           Our tool modified 1170 applications, by transforming
them against our tarpits’ libraries (cf. Section III-B). The                  32,192 occurrences of the five tarpits. By running SAST
best commercial tools were only able to handle 50% of                         tools both before and after the transformations we
the PHP and 60% of the JS tarpits, thus potentially leaving                   could observe the improvement in the overall testability,
large parts of an application code unexplored. To measure                     supported by the detection of hundreds of previously
the impact on those unsupported tarpits, we implemented                       unknown vulnerabilities. In particular, we discovered 370
automated discovery rules (cf. Section IV) for all our                        vulnerabilities in 43 different applications, 55 of which
PHP patterns and used them to scan 3341 open-source                           affected very popular projects with more than 1000 stars in
PHP applications. Our experiments (cf. Section V)                             Github. We responsibly disclosed all issues, and we have
demonstrate that these tarpits are very common in the                         received 111 confirmation from the development teams (36
real world: the average project contains 21 different                         confirmations for the popular projects). These outcomes
tarpits and even the best SAST tool cannot process more                       confirm the added-value of our approach and the impact
than 20 consecutive instructions without encountering a                       of removing tarpits to increase testability for SAST tools.
pattern that prevents it from correctly analyzing the code.                      All the testability patterns and the resources of this
   The ability to automatically discover each tarpit brings                   research (for both PHP and JS) are available in our
many benefits. First, it can provide immediate and precise                    (currently anonymized) repository [3].
feedback to the developers about the tarpits in their code
(e.g., by integrating the discovery rules into an IDE).                                          II.    A PPROACH OVERVIEW
This information can then be used to make an informed
decision about which combination of SAST tools are better                        The source-code excerpt shown in Listing 1, simplified
suited to analyze the code, which parts of the application                    for presentation, highlights a file injection vulnerability
are blind spots for a static analyzer and thus may require a                  (CVE-2011-3357) in the popular Mantis Bug Tracker. The
more extensive code review process, and which region of                       code uses the function require_once to include and
code could be refactored into more testable alternatives.                     evaluate code from an external file (line 20). Care must
                                                                              be taken to ensure that users cannot freely choose the
   We conclude our study by performing two experiments                        name of the file as this would permit them to execute
to assess the use of code refactoring as a mean to make                       arbitrary code. Unfortunately, in the example, the file name
an application more testable for SAST tools. In the first                     ultimately depends on the value of an unsanitized POST
(Section VI), we manually investigate five PHP and five JS                    request-parameter, a value that an attacker fully controls.
applications, for which SAST tools were unable to discover                    The example illustrates the complex interprocedural
the presence of known vulnerabilities. By transforming                        assignment chains that a static analyzer must correctly
the testability tarpits we enabled the tools to detect the                    handle in order to identify the vulnerability: the file
vulnerabilities. Moreover, over 200 additional bugs were                      name depends on the variable $act that is initialized

                                                                         2
                                                                              Pattern discovery and developer awareness. In the
                                                                              second phase of our approach, we implemented a tool
                                                                              to identify instances of our patterns in the source code
                                                                              of a program. As we strongly believe that extending
                                                                              existing production-quality tools trumps re-implementing
                                                                              basic code analysis from scratch, we base our tool on the
                                                                              code analysis platform Joern [40]. The platform allows
                                                                              code patterns to be formulated in a domain-specific query
                                                                              language that provides access to syntax, control flow, and
                                                                              data flow properties. While the platform offers built-in
                                                                              patterns for the discovery of vulnerabilities in C/C++ code,
                                                                              patterns for Web applications are only scarcely available
                                                                              and focus entirely on the discovery of vulnerabilities.
                                                                              Our work performed several improvements to Joern’s
                                                                              core analysis engine and PHP support and we developed
Fig. 1.   Approach outline                                                    queries to allow the discovery of testability problems.
                                                                              Both queries and improvements were contributed back
                                                                              to the project, enabling Joern to discover not only
via a call to the application-defined utility function                        vulnerabilities but also testability problems.
gpc_get_string (line 18-19). This function internally
makes use of the PHP functions func_get_args and                                 Our tool can discover the presence of testability tarpits
call_user_func_array to dynamically invoke the                                and make developers aware of the exact snippets of code
variadic function gpc_get (line 12). Finally, gpc_get                         that will confuse the SAST tools in their arsenal. While
accesses the attacker-controlled POST parameter (line 3-5).                   until today developers were only aware that a given SAST
                                                                              tool did not discover any vulnerability in their code, our
   The majority of SAST tools in our selection (see Sec-                      approach provides additional information that can be
tion III) are not able to detect this vulnerability. Through a                integrated into a risk assessment methodology or used, for
manual investigation, we discovered that the dynamic func-                    instance, to select other SAST tools that are more suitable
tion invocation (call_user_func_array) prevented                              for a specific application. To evaluate our tool and measure
them to connect the user-provided parameter to the name                       the overall prevalence of our library of tarpits in real world
of the included file. In addition, some tools are also unable                 applications, in Section IV we present the results of the
to handle the func_get_args function, which again                             experiments we conducted on 3341 PHP applications.
affects the data-flow of the application.1 Our finding is con-
firmed by the fact that a simple refactoring of line 12 into                  Pattern transformation and impact on vulnerability
the equivalent $r = gpc_get($args) is sufficient to                           discovery. While awareness is very important, in the final
enable the tools to report the file injection vulnerability.                  phase of our process we discuss how the identified tarpits
                                                                              can be removed by transforming the corresponding code.
   The main goal of our research is to build upon this                        Our goal is to show that by transforming the code, the testa-
observation and use the concepts of testability tarpits                       bility improves and SAST tools become capable to uncover
to build a new framework to assess the security of web                        more vulnerabilities. We evaluate this idea by applying
applications. Our approach, outlined in Figure 1, is                          different types of transformation rules in two separate
composed of three phases.                                                     experiments. In the first (Section VI), we manually inves-
Pattern creation. The first objective of our work is to                       tigated ten applications (five PHP and five JS) for which
compile a comprehensive list of testability tarpits, that                     SAST tools were unable to discover known vulnerabilities.
is, code patterns that impede the ability of SAST tools                       In this case, we progressively refactored all testability
to reason about the code and identify vulnerabilities. The                    tarpits until the tools were able to detect the bugs. By
creation and selection process, which we describe in                          making the applications more testable, this also allowed the
detail in Section III, involved an extensive manual effort.                   tools to discover new, previously-unknown vulnerabilities.
To show the applicability of our approach to different                        In fact, on the refactored code of the ten projects, the SAST
programming languages, we reviewed the documentation,                         tools in our arsenal reported 503 new alerts, 224 of which
the internal specifications, and the APIs of both PHP and                     corresponded to true-positive vulnerabilities. In the second
JS and distilled this information into a number of code                       experiment (Section VII), we targeted instead thousands
snippets that emphasize different functionalities. We then                    of popular real-world PHP applications, to which we
embedded these patterns in small test cases, which we                         apply five pattern transformations in a fully automated
tested on a set of commercial and open sources SAST                           fashion. By running SAST tools both before and after
tools (5 for JS and 6 for PHP) to identify the tarpits that                   the refactoring we could observe the improvement in the
could impede the testability of an application.                               overall testability, supported by the detection of hundreds
                                                                              of previously unknown vulnerabilities. In particular, we
  1 Note that both functions are not library APIs, but core features of       discovered 370 security issues in 43 different applications,
PHP.                                                                          with 55 of these vulnerabilities affecting popular projects

                                                                          3
with more than 1000 stars in Github.                                          to detect vulnerabilities. To this end, it is important to
                                                                              understand how static analyzers detect web vulnerabilities
       III.    PATTERN CREATION AND SELECTION                                 in the first place.

   The first step of our approach consists of identifying                        While many techniques exist, a common requirement
those code patterns that prevent SAST tools from properly                     is the ability to identify how user-provided input is propa-
analyzing an application code. It is important to stress that                 gated and processed by the application. Static taint analysis
in this paper we are only interested in code-related pat-                     provides this capability and is employed in particular to
terns, and not in other forms of architectural or deployment                  uncover injection vulnerabilities such as SQL injections
aspects that can affect testability. For instance, plugin-                    (SQLi), cross-site scripting (XSS), and code injections
based infrastructures are often difficult to analyze statically,              (CODEi). While the actual mechanism used for vulnerabil-
and tools often struggle to deal with application state main-                 ity detection is orthogonal to our approach, this observation
tained across requests (which could, for instance, lead to                    provides us with a simple way to identify patterns.
stored vulnerabilities). While these are also very important                     The idea is to use a small fragment of code, hereinafter
aspects, and they constitute possible venues to extend our                    the stub, designed to receive an input value from the user
work, in the rest of the paper we restrict our focus to source                (in the form of a GET parameter) and simply write it
code patterns only. Because of this, while the approach                       back to the output.
we present is completely generic, the actual patterns we
identify vary from one programming language to another.                   1   $a = $_GET["p1"];
                                                                          2   echo $a;
To show the generality of our approach, we performed our
study on the two most popular programming languages for
web application development: JS (ES11) and PHP (v7.4.9).                  1 const parsed = route.parse(req.url);
                                                                          2 const query = querystring.parse(parsed.query);
   On top of their specificity for different languages,                   3 var c = query.name;
                                                                          4 r.writeHead(200,{"Content-Type":"text/html"});
testability tarpits may also differ from one SAST tool to                 5 r.write(c);
another. In fact, what constitutes a problem for a testing                6 r.end();
tool may be handled correctly by a different product, and
vice versa. Moreover, developers often use a combination
of tools to test their applications, thus making the final                    These two snippets (respectively for PHP and JS) contain
selection of patterns specific to each development and                        a very simple form of reflected XSS that is correctly
testing environment.                                                          identified as vulnerable by every SAST tool on the
                                                                              market. To create our patterns we routinely customized
   Therefore, we first selected a representative set of SAST                  these stubs by adding new operations – which represent
tools that includes both commercial and open source                           our candidate tarpits – as part of the data flow between
solutions. In particular, based on the results reported                       the source (the GET parameter) and the sink (the echo
by other studies that compared existing tools [5, 8], for                     and write invocations).
PHP we selected RIPS [12], PHPsafe [33], WAP [36],
and Progpilot [37] as representative of open-source                              For pattern creation, we systematically inspected all the
solutions, and two leading commercial products referred                       chapters of the PHP and JS language documentations. We
here as Comm 1 and Comm 2.2 For JS we selected                                also analyzed comments describing special examples and
instead three commercial tools (Comm 1, Comm 2, and                           corner cases and reviewed all the internal language APIs.
Comm 3)3 , and NodeJsScan [4] and LGTM [2] as open                            For PHP, we also went through the entire instruction set
source alternatives.4 While this choice reflects the current                  of its intermediate language and verified that there was
state-of-the-art techniques used to analyze PHP and JS                        not a single opcode that was not covered by one of our
applications, our approach can be easily applied as-is                        patterns. By following this procedure, we manually created
to any other set of static analysis tools.                                    hundreds of test cases, each one dedicated to showcase a
                                                                              different aspect of the language. However, most of these
   In the rest of this section, we discuss how we built our                   snippets have no impact on the analysis performed by
library of testability patterns (Section III-A) and present                   SAST tools. Therefore, we filtered the list by retaining
the experiments we conducted to validate them on our                          only the problematic examples. For this purpose, we used
SAST toolset (Section III-B).                                                 our selection of SAST tools as oracles. Each tool was used
                                                                              to scan all candidate snippets, and for each test we verified
A. Pattern Creation                                                           whether the tool was still able to detect the reflected XSS
                                                                              vulnerability. To be conservative, if at least one of the tools
  Given a programming language, we want to identify                           failed to report the vulnerability, we saved the correspond-
code patterns that can affect the ability of SAST tools                       ing test case in our testability tarpits library. Hereafter
                                                                              we detail the five main dimensions we used to categorize
  2 For legal reasons, we have to anonymize commercial products.
                                                                              our patterns and to guide our pattern-generation process.
  3 Comm 1 and Comm 2 are the same commercial tools used for PHP.
  4 Notice that LGTM is subject to a commercial license when used on           Core language features vs built-in internal APIs:
projects that are not open source. This was not the case for our study.       We started our investigation by studying the language

                                                                          4
    documentation and, for PHP, the (often undocumented)                  pattern instance evaluating whether a SAST tool supports
    list of internal opcodes (i.e., the low-level instructions            the sink PHP operation exit, which terminates the
    that are processed by the Zend engine). For example,                  application execution and passes a message to the user:
    while references are a common concept present in                  1   $a = $_GET["p1"];
    most programming languages, under the hood PHP                    2   exit($a);
    operates on them by using seven different opcodes (e.g.,
    ASSIGN_REF creates a reference to a scalar variable and               Similarly to the echo sink, exit can lead to XSS
    RETURN_BY_REF returns a reference from a function).                   vulnerabilities. In total, we identified 16 patterns in PHP
      For instance, we integrated the RETURN_BY_REF                       and 22 in JS in this category.
    opcode 5 in our stub by producing the following snippet:                 Static vs Dynamic features: Developers often rely on
1 class foo {                                                             code constructs that cannot be fully analyzed statically,
2  public $v = 42;                                                        because their exact behavior can only be determined at
3  public function &getV() {return $this->v;}                             runtime. In some cases, this might be required by the appli-
4 }
5 $a = $_GET["p1"]; $obj = new foo;
                                                                          cation and therefore it might be difficult to rewrite the code
6 $myV = &$obj->getV(); $obj->v = $a;                                     in a different way. But in other cases, these are used just
7 echo $myV;                                                              for convenience, as the result of cut&paste operations, or
                                                                          to support functionalities that have already been removed
    In line 7, variable $myV$ gets bound to the variable                  from the code long before. For instance, the motivating
    obj->v returned from getV. As a consequence, setting                  example we discussed in the previous section uses the dy-
    obj->v to the source $a in line 8 makes also $myV$                    namic operation call_user_func_array, a form of
    changing, leading to a XSS in line 9.                                 dynamic dispatching. However, the MantisBT developers
                                                                          hardcoded a constant parameter, thus making the target
       In total we identified 96 challenging patterns for PHP             function resolvable from a static analysis perspective.
    and 153 for JS. However not all of our patterns are related
    to features of the language, some are instead associated                To capture these differences, we define four dynamic cat-
    with the use of core library functions. In fact, internal API         egories for our code snippets targeting dynamic operations:
    functions are typically written in C for better performance,          D1: the core parameter of the dynamic operation (e.g.,
    and therefore it is difficult for SAST tools to check                 the first parameter in call_user_func_array) is
    their code during the analysis. To mitigate this problem              an hardcoded constant.
    SAST tools often maintain a set of models that describe
                                                                      1   /* D1 */ call_user_func_array("Func", $b);
    the relationship (in terms of taint propagation) among
    the input and output parameters of these functions [12].
    For instance, the code snippet below captures the                     D2: the parameter is an expression whose value can be
    testability pattern created for extract, an internal PHP              univocally computed statically via constant propagation.
    API generating variables dynamically from an array:               1   $a = "FuncA";
1 $aaa = $_GET["p1"];                                                 2   /* D2 */ call_user_func_array($a, $b);
2 $arr = array("A"=>$aaa,"B"=>"BBB");
3 extract($arr); echo $A . $B;
                                                                          D3: the parameter is an expression whose value can only
                                                                          be partially computed statically. E.g., in the following
    In this specific case, variables $A and $B are created                example, only functions starting with "Func" can
    and assigned to $aaa and to "BBB", respectively.                      be called. This could be used by SAST to reduce the
    This pattern enables evaluating whether a SAST tool                   over-approximation needed to cover all the possible
    models the extract function and properly propagates the               execution paths.
    user-controlled input $aaa into the variable $A. In total,        1   /* D3 */ call_user_func_array("Func" . $v, $b);
    we identified 26 patterns in PHP and 22 patterns in JS
    that target challenging internal APIs.
                                                                          D4: the parameter is an expression whose value cannot
       Security related: We already mentioned that SAST                   be computed statically. While in the general case it is
    tools often employ taint-based dataflow analysis to detect            not possible to handle code belonging to this category
    vulnerabilities: when a user-controlled input (referred               statically, it is still important to measure the prevalence
    to as source) flows into a sensitive operation (referred              of these patterns to assess the testability of the code.
    to as sink), without being processed by a sanitizer, that         1   /* D4 */ call_user_func_array($f, $b);
    dataflow is reported as a vulnerability. We thus created
    some testability patterns to probe how good the SAST
    tool is in recognizing sources, sinks, and sanitizers.                   Evaluating SAST tools against these four dynamic
    For instance, the following code snipped captures a                   categories of increasing complexity allows us to measure
                                                                          more precisely their behavior against these challenging
       5 PHP  documentation - Return By Reference:           https:       dynamic operations. 52 of our PHP patterns and 52 of
    //www.php.net/manual/en/language.references.return.php                our JS patterns involves dynamic features.

                                                                      5
       Positive vs Negative Test Cases: To deal with dynamic
    features that cannot be computed statically, SAST tools
    need to choose between two possible approaches: over-
    approximate (e.g., by assuming all elements in an array are
    tainted when one of them is), or under-approximate (e.g.,
    by ignoring all elements altogether). The first can increase
    the number of false positives, while the second solution
    can miss real vulnerabilities. To better distinguish among
    the two cases, we complemented the tests we developed
    for dynamic features with special tests that used the same
    dynamic functionality but without a vulnerability.                 Fig. 2.   SAST measurement over pattern dimensions (PHP)

       For instance, the following JS pattern (related to
    arithmetic operations on an array index) was reported
    as vulnerable by Comm 2 but not by Comm 1.
1 const parsed = route.parse(req.url);
2 const query = querystring.parse(parsed.query);
3 var c = query.name;
4 array = [’a’, ’b’, c, ’d’];
5 index = 3; index = index -1 ;
6 r.writeHead(200,{"Content-Type":"text/html"});
7 r.write(array[index]); // print c variable
8 r.end();


                                                                       Fig. 3.   SAST measurement over pattern dimensions (JS)
       This could be due to the fact that Comm 2 can
    compute the index value statically, or it could simply
    be the consequence of the fact that the two SAST tools                In the graphs, the bars show the percentage of all pat-
    might adopt different strategies to deal with arrays               terns on which each tool reported the correct answer. First
    (over-approximating the first and under-approximating              of all, it is interesting to observe that for PHP, none of the
    the other). To answer this question, we created a negative         tools reaches 50% coverage of our patterns. Comm 1 is the
    version of the same pattern, where line 7 is replaced by:          best in terms of overall results, driven by its extensive cov-
7   res.write(array[index-1]); // print ’b’ char                       erage of PHP static features. However, other tools take the
                                                                       lead in other categories. For instance, Progpilot has the best
                                                                       support for the D1-D2 tests (where more sophisticated
       Since Comm 2 reports a vulnerability also for the               static analysis algorithms might be required to propagate
    negative version of the pattern, we can conclude that              constant and determines the values of program variables),
    it was indeed applying an over-approximation to deal               and Comm 2 has the highest coverage of the PHP APIs.
    with the array. In total, we retained 7 negative pattern           RIPS is the best tool among the research tools for the
    instances for PHP and 20 for JS, for which the negative            supported APIs, confirmed by the fact that its authors
    version was still reported as vulnerable by some of the            mentioned in the corresponding paper [12] that they per-
    SAST tools, indicating an excessive over-approximation.            formed an extensive work to model the built-in function of
                                                                       PHP. On the other hand, Progpilot is the only research tool
       Functional vs Object-Oriented: As we discuss in the             that supports object-oriented code, and it achieves the best
    related work (Section IX) several studies conducted by the         results on static features between the open-source tools.
    software engineering community have discussed the poor
    testability of object-oriented code. In general, researchers          Results are a bit better for JS, where three tools are able
    have found that when developers use more object-oriented           to cover more than 50% of the patterns. However, in this
    features, projects become harder to test (even though              case, the higher success rate is in part due to the extremely
    this in the literature normally refers to dynamic testing).        poor performance of NodeJsScan. Indeed, 24 patterns are
    Therefore we included 39 PHP and 40 JS patterns                    supported by all tools but NodeJsScan, and therefore they
    related to classes, methods, static methods, and properties.       would have been discarded if this tool was not part of our
    These patterns cover different OO aspects, such as object          arsenal. As for PHP, commercial tools are still dominating,
    constructors, encapsulation, overriding, and inheritance.          featuring similar performances and emerging as the best
                                                                       tool for the security dimension. If Comm 1 performs
    B. Pattern Selection                                               better on static features, Comm 2 outperforms it on the
                                                                       internal API support. With respect to dynamic patterns,
       Figure 2 and 3 summarize the results of our SAST tools          we observe the same behavior as for PHP: tools supports
    against our libraries of 122 PHP and 153 JS tarpits. Due to        some D1-D2 patterns, but have more troubles against D3-
    space limitation, the complete list of patterns is presented       D4 patterns. Only Comm 2 is able to correctly analyze
    in Appendix and is detailed in our public repository [3].          beyond 40% of those D3-D4 instances, though it seems

                                                                   6
to apply over-approximation in most of those cases.                             call graph dependency. For instance, we use the following
                                                                                query to count the occurrences of the feature simple refer-
   Another interesting aspect of our experiments is the                         ence (ASSIGN_REF) in the CPG of a target application.
fact that the tarpits are very different among the different
tools. In fact, while tools taken individually have many                          cpg.call(".*ASSIGN_REF.*").size
limitations, their combination is able to handle around 66%
of the PHP and even 85% of the JS patterns in our library.                      To find instead the use of objects in which the developer
Moreover, none of the tools is a superset of any other                          redefines the __set function, we can use Joern to
in terms of tarpits. Thus, using a combination of SAST                          search for the NEW opcode used on a class that has the
tools to test a web application is, from a testability point                    method __set defined:
of view, always better than relying on a single product.
                                                                                  def hasSet = cpg.typeDecl
                                                                                    .filter(_.method.name.contains("__set"))
                  IV.    PATTERN DISCOVERY                                          .name.l
                                                                                  cpg.call("NEW")
   In the previous section, we described how we built our                          .argument
library containing hundreds of testability tarpits. While                          .filter{ x =>
                                                                                      hasSet.contains(x.code.toLowerCase)}.size
this list can already be used to compare SAST tools
and find a suitable combination that minimizes their
limitations, this is not the main goal of our paper. Our                           The ability to automatically discover each tarpit brings
objective is to support developers to assess which parts                        many benefits. For instance, these rules can be integrated
of their code can be effectively tested by SAST tools                           into an IDE to provide immediate and precise feedback
and which are not, and provide guidelines to improve                            to the developers about the impact of the code they are
the overall testability by avoiding particular patterns.                        writing on the static testability of the application. This
                                                                                information can be used to make an informed decision
   For this purpose, we decided to extend each tarpit in                        about which parts of the application are blind spots for
our library with a corresponding discovery rule that can                        a static analyzer and thus may require a more extensive
be executed to discover its presence in the code of a Web                       code review process, and which code patterns could be
application. While grep-like regular expressions can                            refactored into more analyzable alternatives. For instance,
be sufficient to identify simple patterns, others require                       for security-critical services, developers may decide to
a more sophisticated taint-based analysis that takes into                       limit the use of patterns that are not supported by SAST
account the interplay of multiple program statements, e.g.,                     tools (e.g., those in the category D3-D4) to minimize
to identify where a variable that is used in an interesting                     the risk of undiscovered vulnerabilities.
operation is previously defined. Designing a complete
static analysis framework is beyond the scope of our                                                  V.    P REVALENCE
paper, and therefore we decided to build our solution by
extending the Joern code querying framework [40]. Joern                            We now estimate how prevalent our tarpits are in
constructs code property graphs (CPG, [43]) that combine                        real-world applications. For this purpose, we use our CPG
the program’s syntax tree, control flow, data dependencies,                     queries for PHP against four different datasets. The first
and calling relations in a joint representation – thus                          three are composed of PHP projects hosted on GitHub,
already providing most of the information needed for                            chosen according to their popularity (measured by the
our analysis. While initially developed for the analysis of                     number of stars they received). In particular, we cloned
C/C++ code, the framework has recently been extended                            1000 applications of low popularity (between 20 and 70
to handle PHP opcodes.6 However, at the time of writing                         stars), 1000 of medium popularity (between 200 and 700
there was no public CPG generator for Node.js compatible                        stars), and 1000 with high popularity (more than 1000
with Joern, and this prevented us from performing a                             stars).7 We refer to the three datasets as GL , GM , GH
complete analysis of the prevalence of our JS patterns.                         respectively. The detailed list of the cloned projects is
Nevertheless, we scripted some ad-hoc routines to                               available in our repository [3]. Finally, the fourth dataset
discover 54 of our JS patterns from the Abstract Syntax                         consists of all applications from the Sourcecodester
Tree (AST) of a JS application. Though these routines                           website (SC in brief), which hosts open-source PHP
are not as precise as CPG queries and suffer from false                         projects [42] that serve as references to other developers
positives, they have proved to be very helpful in pursuing                      that want to implement their websites.
initial experiments on real applications (e.g., to identify                        Due to space limitation, the complete results of
patterns before the manual transformation in Section VI).                       our prevalence measurement are reported in Appendix
   Our Joern-based discovery rules have different complex-                      (Table V). The whole experiment required 1 week on
ities, ranging from a simple search for a given instruction                     a 16-cores machine with 64 GB of memory. On average,
to complex queries where we use the control, data, and                          for 1000 lines of code (LOC), generating the CPG took
                                                                                4.03 seconds, while traversing the CPG with our pattern
  6 The extension is in an early development phase and yet to be released       discovery queries took 7.82 seconds.
publicly. It was kindly made available to us by its developer—name
removed for anonymity.                                                            7We used Github-clone-all tool [1] to clone all these projects.




                                                                            7
                                                                       the prevalence of our patterns is very high: the average
                                                                       project contains 21.15 unique tarpits with an aggregated
                                                                       frequency of one tarpit every 8-to-50 opcode (the + sign
                                                                       in the figure represents the average point). Second, the
                                                                       more popular a project is, the more tarpits it tends to
                                                                       contain. The main reason is the size of the project that is
                                                                       higher for more popular projects: by counting the average
                                                                       number of opcodes in GH , GM , GL , and, SC we have
                                                                       62,303, 43,782, 21,066, and 17,141, respectively.
                                                                          If we restrict our analysis to only those patterns
                                                                       that affect a given SAST tool, we observe marginal
                                                                       improvements. For instance, Figure 5 shows the results
                                                                       restricted to patterns that affect Comm 2 and Comm 1
                                                                       for the three Github datasets. It is interesting to observe
                                                                       how the dots clearly follow different distributions, with
                                                                       blue dots closer to the upper-left corner and red dots
                                                                       closer to the bottom-right. This shows that real-world PHP
Fig. 4.   Patterns distribution considering all patterns               applications are more difficult to test with the first tool
                                                                       than with the second: the average application contains 13.3
                                                                       unique tarpits for Comm 2 (one every 47 opcodes) and
                                                                       8.5 unique tarpits for Comm 1 (one every 203 opcodes).
                                                                          Another interesting point is related to the scale of the
                                                                       Y-axis. For over 83% of the applications, the number
                                                                       of tarpits falls between one every 10 and one every 1000
                                                                       opcodes – with an average of only 21. In other words, on
                                                                       real-world PHP applications even state-of-the-art SAST
                                                                       tools cannot process more than 20 consecutive opcodes
                                                                       without encountering a pattern that prevents them from
                                                                       correctly analyzing the code.
                                                                          In the rest of this section we will discuss the prevalence
                                                                       of different types of patterns. To streamline the discussion,
                                                                       we only report numbers for the GH dataset, but all
                                                                       values are available in the appendix for further analysis.

                                                                       Object Oriented Code - 97% of the projects in the GH
Fig. 5. Patterns distribution considering only patterns hard for
                                                                       dataset use objects. However, only one out of four of
Comm 1 and Comm 2                                                      the open source SAST tools we tested supports object
                                                                       oriented code – showing a clear disconnection between
                                                                       research prototypes and real-world applications. By
   The scatter plots in Figures 4 and 5 compactly present              looking at OOP features that are not supported also
our results. In these plots, each dot represents a PHP                 by commercial tools, the magic methods __set (P32),
application and its coordinates show the number of                     __get (P33), and __call (P36) are used respectively
unique tarpits it contains (Y-axis) and the cumulative                 by 6.1%, 8.1%, and 6.8% of the projects. This confirms
number of instances of such patterns normalized by the                 that object oriented code still presents challenges also
number of opcodes in the application (X-axis, plotted in               for the best SAST tools on the market.
log scale). We use the number of opcodes instead of the
number of lines of code because it is more accurate as a               PHP Features and APIs - If we exclude OOP, among all
line of code can contain multiple instructions and because             our tarpits the most prevalent language feature is the use
opcodes represent only PHP code without considering                    of combined operators, which is present in 93.4% of the
other embedded elements such as HTML and JS. It                        projects. However, this only causes problems to PHPSafe
is also important to note that Figure 4 does not show                  and is correctly handled by all other tools. If we look
four tarpits: simple object (P21), simple array (P58),                 instead at those features that are causing problems for all
conditional assignment (P4) and combined operator (P5).                our SAST tools, the most common are the use of static vari-
In fact, these patterns occur with a very high frequency               ables (71.2% of the projects) and raised exceptions (81%).
but only affects a few of our SAST tools.
                                                                         Regarding the built-in API functions, array_map,
  Figure 4 shows the breakdown of the results by                       which is not supported by any of our SAST tools, is
datasets. Here we can notice two important points. First,              present in 28% of the projects. Among the security

                                                                   8
critical sources and sinks, the use of superglobals (P66)                patterns identified and preventing the SAST tool from
and the exit function (P56) are the most common, with                    reporting the vulnerability, and the new injections (alerts)
a prevalence of respectively 41.3% and 22.6% projects.                   from the tool on the transformed code.

Dynamic Features - the dynamic features of a language                      After refactoring the testability patterns, all the
are one of the biggest challenges for static analysis                    CVEs’ vulnerabilities were detected and many more true
tools but also one of the most commonly used by                          positives were reported by the tools. Some of these true
developers. The simple case of storing and retrieving vari-              positives still applied to the latest versions of the projects
ables from dictionaries (P83), which often requires over-                and our responsible disclosure lead to three new CVEs9 .
approximation from a static perspective, is used in 88.3%                   In the rest of this section, we present some of the trans-
of the projects with a median of 32 occurrences each.                    formations that we applied and we discuss the new alerts
   Features related to dynamic functions invocation are                  reported by SAST tools. More details about the case study
also among the most frequently used in our datasets. For                 projects and their results are available in our repository [3].
instance, storing the function name in a variable (P82)
is used in 448 projects, dynamic callbacks (P80) in 269                  A. Transformations
projects, and dynamic function call (P76) in 602 projects.                  During these experiments, we encountered a
All these examples belong to the D4 category – and                       combination of 9 unique PHP and 17 unique JS tarpits
therefore there is little a static tool can do to properly               that prevented our tools (Comm 1 and/or Comm 2)
resolve these calls statically.                                          from discovering the known vulnerabilities. To refactor
   However, some of the dynamic patterns can be trivially                the corresponding code patterns, we applied three types
handled by a SAST tool. For instance, the D1 instance                    of transformations. We present hereafter one example
of a dynamic call (P80), which hard-codes the name of                    from each type. The details for all transformations are
the target to invoke, is present in 20.8% of the projects                available in our repository.
with a median of 2.5 instances each. Another simple
                                                                            T1 - Semantic-preserving Transformations. This
example comes from file inclusion. In PHP, when file A
                                                                         type of transformation can be applied automatically
includes file B, it can access the variables of B without
                                                                         while preserving the semantic of the code. An example
defining them as global variables. The corresponding D1
                                                                         of this category is the refactoring of the D1 variant
pattern (P79) causes problems for three of our SAST
                                                                         of callback_functions pattern (P78 in Table V)
tools (phpSAFE, WAP, and Comm 2) and it is present in
                                                                         presented in Section II for the MantisBT PHP project.
63.6% of the projects. The related and more complicated
                                                                         By replacing line 12 in Listing 1 with the equivalent
case where the file name is stored in a variable (D4),
                                                                         $r = gpc_get($args), the tarpit disappears, the
is even more common, with a prevalence of over 75%.
                                                                         code semantic is preserved, and the SAST tool becomes
                     VI.                                                 able to understand the code and detect the vulnerability.
E XPERIMENT: M ANUAL PATTERN TRANSFORMATION                              Overall, five out of nine (for PHP) and nine out of 17
                                                                         (for JS) of our transformations belong to this category.
   In this section, we will demonstrate the usage of our
patterns on five PHP and five JS open-source projects                       T2 - Over-approximations. Transformations in
selected according to these criteria: (i) the project is                 this category aim at reducing FNs by increasing the
mainly based on PHP or JS, (ii) an injection vulnerability               amount of code that can be analyzed by the SAST tool.
has been reported in the past for the project as a CVE                   However, they achieve this goal at the price of breaking
precisely pointing to the latest vulnerable codebase version             the semantic of the program, as the removal of the
(VulCode, in short), (iii) some testability patterns occur in            tarpit requires to introduce an over-approximation. We
the path connecting the source and the sink of the vulner-               experience this case in the Bakeshop Online Ordering
ability in VulCode, and (iv) one of the SAST commercial                  PHP project where the pattern JS redirect (P57) is used
tools fails to report the CVE vulnerability on VulCode.                  to redirect the user to index.php:
   We gathered five projects for each language satisfying            1 f u n c t i o n r e d i r e c t ( $lc =Null ) {
                                                                     2 e c h o ”<s c r i p t >window . l o c a t i o n = ’{ $ l c } ’ </ s c r i p t >” ;
these criteria from the CVE Mitre website [30]. For each             3 } r e d i r e c t ( ” i n d e x . php ” ) ;
project, we carefully review the CVE and the testability
patterns preventing the SAST tool from detecting the
expected vulnerability. We then manually transformed                        This pattern is not supported by any of the SAST
these patterns and run again the tool to check if the                    PHP tools in our arsenal. To enable the SAST tool
vulnerability was detected on the transformed project                    to understand the redirection we rewrote line 2 as
code. Table I and Table II present the results of our                    include($lc), thus removing the JS code altogether.
experiments. For each project, we specify the CVE, the                   However, this modification changes the semantics of
vulnerability class, the SAST tool used8 , the testability               the code as the redirection via window.location
                                                                         provides to the new page access only to the session
  8 For PHP projects, Comm 1 is the only tool that we used in this
experiment and thus we avoid adding the Tool column.                       9 CVE-2021-33557, CVE-2021-33300, and CVE-2021-23342




                                                                     9
                                                 TABLE I.       I N - DEPTH ANALYSIS ON PHP REAL CASES
                                                                                Patterns                                         SAST After (TP/FP)
 Project                       CVE             Vuln.                                                                      XSS    SQLi FILEi CODEi                 SUM
 MantisBT                 CVE-2011-3357        FILEi   callback functions D1 (P80, T1)                                   28/88       0/0   18/14        3/0      49/102
 Osclass                  CVE-2012-0974        XSS     dynamic include D2 (P79, T1), array variable key D2 (P83,         14/0        0/0    0/0         0/0       14/0
                                                       T2), static instance of a class (P49, T2)
 Bakeshop Ordering       CVE-2020-35272        XSS     JS redirect (P57, T2)                                             15/0   0/0           0/0          0/0    15/0
 Bus Booking             CVE-2020-25273        SQLi    Extract function (P70, T3)                                         0/0  49/0           0/0          0/0    49/0
 Domainmod               CVE-2018-11404        XSS     Dirname function (P74, T1), Dynamic include D1 (P79, T1),        77/118 0/0            0/0          0/0   77/118
                                                       buffer (P75, T1)
                                                                               9 patterns                               134/206 49/0          18/14        3/0   204/220

                                                  TABLE II.       I N - DEPTH ANALYSIS ON JS REAL CASES
                                                                                                                                              SAST After (TP/FP)
   Project               CVE           Vuln.             Tool                                Patterns                                  XSS       CODEi        SUM
   Docsify         CVE-2020-7680       XSS             Comm 1     (P87, T1), (P49, T1), (P55, T1), (P79, T1), (P7, T1, T3),            5/24            0           5/24
                                                                  (P99, T2), (P78, T2), (P101, T2), (P21, T1)
  Apexcharts       CVE-2021-23327      XSS             Comm 2     (P87, T1), (P101, T2)                                                6/3             0           6/3
  Hello.JS         CVE-2020-7741       XSS             Comm 1     (P24, T1), (P82, T2), (P21, T1)                                      3/24            0            0
  Lazysizes        CVE-2020-7642       XSS/ CODEi      Comm 2     (P14, T1), (P7, T1), (P83, T1), (P78, T2)                            4/0            1/8          5/8
  Angular Exp.     CVE-2021-21277      CODEi           Comm 2     (P87, T1), (P36, T2), (P86, T3), (P90, T2), (P75, T2), (P21, T1)     1/0             0           1/0
                                                                                            17 patterns                               19/51           1/8         20/59



variables of the previous page, while include provides                              Some SAST tools accept in input special annotations
access to all variables. For example, if there is a variable                        to help them in the analysis – and therefore this type
v controlled by the attacker in page A, v will be fully                             of transformations could be implemented by using those
accessible to page B included in the context of page A. It                          annotations. However, we did not explore this direction in
is interesting to observe that this transformation introduces                       the paper as this approach would make the transformation
a new tarpit in the code: the dynamic include D2                                    tool-specific.
(P79) is occurring after the transformation as the location
of the PHP file to be included is captured in a variable
($lc). However, this pattern instance is easily refactored                          B. Results upon transformations
via a T1 transformation. This shows that the refactoring                               After running our SAST tools on the refactored code,
cannot be performed in one single shot, but it needs to                             we confirmed that they were able to correctly report all ten
be repeated until no pattern instances are left in the code.                        known vulnerabilities. Moreover, since the transformations
   T3 - Developer-Assisted Transformations. While                                   allowed them to better analyze the application code, they
both T1 and T2 can be refactored in a fully-automated                               also additionally reported 503 new potential injection
fashion, in some cases we noticed that we could not                                 vulnerabilities. After manual verification, we confirmed
remove the tarpit without some form of human assistance.                            224 of them to be true positives. In some cases, the new
This support can be in the form of code annotations                                 vulnerabilities were similar to the ones already reported
that specify the propagation of data within complex                                 in the CVEs. In other cases, after removing the tarpits
code areas. For instance, we encountered this situation                             the SAST tools were able to detect new vulnerabilities
in the Online Bus Booking PHP project. Here the                                     of different types. Motivated by the high number of
developers use the extract function—which we explained                              new true positives, we moved our attention to the latest
in Section III-A—to generate variables dynamically                                  versions of the applications (LatestCode, in short). First,
from an array. SAST tools have trouble computing these                              we used our discovery methodology (see Section IV)
variables statically. A simple annotation, added before                             to confirm that the testability patterns preventing the
the extract operation, is sufficient to help:                                       detection of the old CVE were still present in the current
                                                                                    code. Second, we run the testing tool on the latest
/ / @sast : p r o p a g a t e ( $ POST , [ $username , $ p a s s w o r d ] )        versions, both before and after applying our pattern
                                                                                    transformation to the whole project. This allowed us
Notice that this annotation can be added by the developers                          to discover several previously-unknown vulnerabilities,
once our pattern discovery rules make them aware that                               which received new CVEs. These include one in the
SAST tools will not be able to interpret that pattern in                            MantisBT project (CVE-2021-33557), four in the latest
their code and that some annotations would be helpful to                            version of Domainmod (CVE-2021-33300 in process),
overcome such SAST limitation. From that annotation is                              one in Docsify (CVE-2021-23342) and one in Apexcharts
simple to execute a transformation that simply add to the                           (validated by the developers and rewarded with a bug
code the following instructions to make the extract explicit:                       bounty, while a CVE will be released soon). Finally, for
                                                                                    both Bakeshop Online Ordering and Online Bus Booking,
$ u s e r n a m e = $ POST [ ” u s e r n a m e ” ] ;                                all true positives reported in the old versions were still
$ p a s s w o r d = $ POST [ ” p a s s w o r d ” ] ;                                applicable as we directly worked on their latest version

                                                                               10
 TABLE III.        L ARGE - SCALE TRANSFORMATION EXPERIMENT
                                                                                     functions whose name starts with the prefix and then
           SC               GL             GM                GH                      by invoking them inside if statements:
           occ.    prj.     occ.    prj.   occ.      prj.    occ.     prj.
   R1        14      9       927    128    2029     160     2116      210            /*Before*/ call_user_func("Func_" . $x);
   R2        21      3       89      24     155      39      202       53            /* After */
   R3       130      9      1287    125    1929     179     2582      254            if($x == "F1") {Func_F1();}
   R4       130     12      3613    173    8724     263     7043      340            else if($x == "F2") {Func_F2();}
   R5        21      7       258     89     524     113      488      149            else if ...
  Total     316     21      6174    281    13361    382     12341     486
 Alerts     18      3       7086     19    1019      26      1297     24
  TP        18      3        224     13     73       12       55      15           [R3] Get arguments, P17: In PHP it is possible to define
                                                                                     a function to receive an arbitrary number of arguments
                                                                                     and then retrieve them from the code by invoking
for the known CVEs experiment. However, in this case,                                the func_get_args function. We transform this
no new CVE was assigned because the new findings                                     pattern to use the PHP variadic function instead (less
were considered as variations of the main CVE.                                       problematic for SAST tools):
                                                                                     /*Before*/function F(){$y=func_get_args();}
                          VII.     E XPERIMENT:                                      /*After*/ function F(...$x){$y = x;}
          AUTOMATED PATTERN TRANSFORMATION
   In the previous section, we investigated whether                                [R4] Foreach with array, P58: PHP provides an internal
known vulnerabilities could be discovered by SAST                                    function called array_keys which returns the keys
tools once the obstacles related to our testability patterns                         of an associative array. Our routine transforms the use
are removed from the corresponding applications. After                               of this function in foreach loops as follow:
their code was manually transformed, we discovered that                              /*Before*/foreach(array_keys($arr) as $key){}
SAST tools were also able to discover a number of new,                               /*After*/ foreach($arr as $key => $value){}
previously-unknown vulnerabilities – thus confirming the
negative impact that our patterns have on static analysis.
                                                                                   [R5] Exit, P55: the exit function terminates the
   Motivated by these results, we decided to develop                                 program and prints to the user the message it receives
a number of fully automated routines to transform the                                as a parameter. Therefore, if the message is controlled
code of five simple PHP patterns.10 We then applied                                  by the user and not properly sanitized, this can result
these routines to all the applications in our four datasets                          into a XSS vulnerability. SAST tools do not take this
(GL , GM , GH , and SC, introduced in Section IV) and                                potential sync into account. Our routine makes this
run both the original and the transformed code through                               explicit by performing the following change:
Comm 1 (the top-performer tool in our assessment for                                 /*Before*/exit($value);
PHP). Finally, we manually compared the alerts reported                              /*After*/ echo($value); exit();
by the tool before and after the transformations to
distinguish between false positives and real vulnerabilities.
   The five testability tarpits we selected to transform                              Table III reports the results of our experiment. For each
for this large-scale experiments are:                                              of the five tarpits, we counted the number of occurrences
                                                                                   (which were transformed by our automated routines) and
[R1] Callback functions (D1), P80 – as we described in                             the number of projects that were affected. In total, our
  Section II, call_user_func can be used to invoke                                 tool modified 1170 applications, by refactoring 32,192
  a function or an object’s method by passing its name as                          occurrences of the five tarpits. As a result of these
  parameter. For the simple case in which the target func-                         transformations, Comm 1 raised 9420 additional alerts
  tion is constant, we implemented three refactoring rules:                        for 72 of these applications (an average of 130.8 alerts per
  //Before
                                                                                   application). For 17 of these applications the new alerts
  call_user_func("F",$x);                                                          related to more than one vulnerability class. Specifically,
  call_user_func($obj,"method1");                                                  the new alerts applied to 103 pairs of application and
  call_user_func_array("F",$args);                                                 vulnerability class, referred to as (app, vuln).
  //After
  F($x); $obj->method1(); F(...$args);                                                The verification of the new alerts required an intensive
                                                                                   manual effort. If the pair (app, vuln) featured less than 50
[R2] Callback functions (D3), P80 – This routine                                   new alerts (in total, 82 pairs), then all were inspected and
  applies to a variation of the previous pattern in which                          classified as either true positive or false positive (587 alerts
  the name of the function to invoke is obtained by                                were classified in this phase). Otherwise, we sampled 20%
  concatenating a prefix string to a variable. In this case,                       of the new alerts related to the pair (app, vuln), ensuring
  our routine transforms the code by first retrieving all                          that alerts with different source-sync combinations were
                                                                                   included. This resulted in the manual verification of
  10 For this experiment to be done for JS, we need to wait for a CPG              21 pairs and their 8833 new alerts. Finally, if any true
generator to automatically and precisely discover patterns, cf. Section IV.        positive was identified in this step, then the entire set of

                                                                              11
                                                                                TABLE IV.     FALSE POSITIVES EXPERIMENTS
new alerts of the corresponding pair was inspected (this
resulted in three pairs for which we inspected 425 new                Project                         Before (TP/FP) Transf. After (TP/FP)
alerts). In total, we manually inspected 2700 new alerts.             MantisBT (1.4k)                     0/90          73       1/207
                                                                      Cloudflare-CNAME-Setup (1.3k)       42/46         16       10/10
                                                                      Librenms (2.4k)                    49/135        144        1/2
   Overall, this process allowed us to confirm 370
vulnerabilities in 43 applications, all of which were
responsibly disclosed to the respective developers.                  TP/FP before transformations, the number of transforma-
However, not all maintainers answered our messages.                  tions, and the ratio TP/FP of the new alerts raised on the
For instance, out of the 55 vulnerabilities discovered in            refactored code. We can see that the ratio between the num-
15 popular GitHub projects, 36 (from 10 projects) were               ber of transformations and the new alerts is very diversified.
confirmed. In the GM dataset, developers acknowledged                Note that these results were validated with the development
while we received only two answers from the low popular              teams to improve the projects’ quality. For instance, we
projects GL after we disclose 224 vulnerabilities in 13              submitted a pull request for Librenms (2.4k stars) that
applications. Based on these discoveries, three CVEs                 was promptly accepted to fix the detected vulnerability.
(CVE-2021-43673, CVE-2021-43682, and CVE-2021-
43687) have already been assigned and many more have                    While the above discussion is true for the
been reserved and will be published soon.                            transformations we used in our large-scale experiments,
                                                                     not all possible transformations have no impact on
  We also discovered 18 unique vulnerabilities (CVE-                 false-positives. For instance, T2 transformations could, as
2021-44280) in demo code applications (SC dataset)                   a side effect, increase the number of false-positives and as
used to showcase functionalities for other developers                such they should be used with parsimony. We foresee the
and, thus, suitable to be copied&pasted to speed up                  developers playing a key role in our approach deciding
code implementation, with the subtle risk of porting the             whether those transformations should be applied or not.
vulnerabilities in other applications.
                                                                                         VIII.        L IMITATIONS
False Positives Discussion
                                                                     Pattern Discovery. In Section IV we explained how our
   Table III shows that a large fraction of the new alerts,          discovery rules first perform a static analysis of the applica-
(approximately 2300 over 2700 alerts we manually                     tion code. However, since the patterns we want to discover
inspected) are false positives. However, it is important to          are by definition those that are problematic for static
understand that this does not mean that our transformations          analyzers, this might seem a contradiction. In reality, the
are the cause for those false positives. Our transformations         fact that our rules can discover the presence of a tarpit (e.g.,
increase the amount of code that can be analyzed and                 the use of a given instruction in a certain context) does not
tested by SAST tools. The more code is analyzed, the                 necessarily imply that the underlying static analysis engine
more likely the tool is to report findings, most of which            is able to correctly handle the pattern. For instance, our
are unfortunately false positives. Without our refactoring,          rules can detect that a piece of code performs a string oper-
the SAST tools are simply blind to those code areas.                 ation even though the static analysis framework the rule is
                                                                     built upon cannot reconstruct the actual value of the string.
   Those blind code areas may be many and their impact
on false-negatives significant. For instance, by inspecting             It is important to note that, while implementing
the MantisBT project—part of the GH dataset and                      sufficiently precise static taint analysis is simpler on
presented in Listing 1—we identified other 9 functions               an intermediate language, such as PHP opcode, some
that, as gpc_get_string, suffer from the callback                    information (such as class inheritance) is lost in the
functions (P80, D1) tarpit and invoke gpc_get in a                   compilation process or optimized out by the JIT compiler.
(useless) dynamic fashion. These functions are called 769            In case our rules need access to this information (five
times in 182 files.                                                  patterns in total) we had to implement a simple ad-hoc text
                                                                     processing script to detect the tarpits at a syntactic level.
   A second important point is that all the five automated              In other cases, our queries might under-count the
transformations applied in our experiment are semantic-              number of instances of a pattern due to the difficulties of
preserving (T1) and as such they do not add any over-                static taint analysis, in particular when tracking taint that
approximation. Thus, the large numbers of false-positives            is not passed from function to function via a method call.
emerging in that experiment is essentially due to the ability        Similarly, patterns in the D3 category (where only part of a
of SAST tools to better understand the application code.             value is constant) could be implemented in many possible
To confirm this observation, we performed an additional              ways, but we only count when they rely on string concate-
experiment in which we manually inspected a few popular              nation and not, for instance, on sub-strings substitutions.
projects (in GH ) for which we received answers (and
confirmed vulnerabilities) from developers. Our goal was               Because of these limitations, it is important to
to demonstrate that there is no direct relation between              understand that the number of times a pattern is reported
our transformations and the false-positives rate. Table IV           by our rules is a lower bound over the actual number
shows the results. For each project, we indicate the ratio           of times it can be present in the code.

                                                                12
    New Patterns. We tried to be comprehensive in our                                          IX.    R ELATED WORK
    pattern catalogs by systematically inspecting all the
    chapters of the language documentation (for both PHP                         Over the past two decades, researchers have developed
    and JavaScript) and by including development community                    many tools and techniques [see e.g., 16, 27, 28, 31, 35]
    comments about language corner cases. However, we                         to statically identify vulnerabilities in source code. Our
    reckon that new features (e.g., from new widely used                      research does not introduce a new vulnerability discovery
    libraries) may emerge and result in new patterns. For this                techniques but rather focuses on the difficulties these
    reason, we designed our approach to be extensible towards                 tools face. The three research areas most closely related
    the addition of new patterns and we are developing                        to our work are: software testability, studies of the
    an open-source framework where the community can                          limitations of static analysis, and comparisons of web
    add patterns by following a well-defined format. The                      SAST tools. In the following, we discuss related work
    procedure is described in detail in our repository [3].11                 in each of the three areas.
                                                                              Software Testability. While testability of software
       Once a developer has identified a new challenging code                 artifacts has been the subject of a large body of research
    fragment, adding the corresponding pattern is a matter of                 in the software engineering community, its definition
    a few hours of work. The most challenging part is coding                  remains unclear. In a recent survey, Garousi et al. [15]
    the pattern discovery rule, which requires some knowledge                 collected 33 different definitions of testability from
    in Scala and Joern. However, the developer can count on                   different sources, finding the most common to be that
    many examples in our catalog as well as on a broad and                    given by ISO, which defines testability as the “attributes
    active community [40], which is another advantage of                      of software that bear on the effort needed to validate the
    building our system on top of a popular framework.                        software product”. This captures a common interpretation
       For example, if a user suspects that the use of the                    accepted by software engineers, which sees testability
    PHP API function substr could be a potential tarpit                       as a measure of the number of test cases needed to test a
    for SAST tools, she will first adapt the pattern stub                     program and/or of the difficulty of generating those cases.
    (cf. Section III-A) by adding a call to substr between                      In this paper, we instead use the term testability to mea-
    the source and the sink:                                                  sure the ability of static analysis tools to “understand” the
1 $a = $_GET["p1"];                                                           code, with the goal of discovering security vulnerabilities.
2 $b = substr($a,0,15);                                                       As such, our definition captures not the effort required to
3 echo $b; // XSS                                                             generate test cases, but the challenge of analyzing the code.
                                                                                 Despite the difference in scope, our work shares
    Second, she would initiate the SAST tools validation                      similarities with other studies in which the authors
    scan (an operation fully supported by our framework) to                   focused on either improving or measuring testability. In
    collect the impact on the new pattern. Third, if one tool                 the first category, researchers have mainly studied source
    fails to discover the vulnerability on the stub, the pattern              code transformations to improve automated test data
    will be added to our collection and a discovery rule will                 generation [7, 9, 18, 19, 20, 22, 23].
    need to be created. This can be easily done by tuning
    any of the discovery rule created for other API patterns                     On the measurement side, Garousi et al. [15] discuss
    (e.g., P59-P65 in Table V) via a simple replacement of                    35 papers that present metrics to deal with testability. For
    the API function name with substr:12                                      instance, Gupta et al. [17] propose three fuzzy metrics for
                                                                              object-oriented software testability: Depth of Inheritance
      cpg.call(".*INIT_FCALL.*                                                Tree, Coupling Between Objects, and Response For a
          ").argument.order(2).code("substr").size                            Class. More recently (in 2020), Oluwatosin et al. [34]
                                                                              list 20 publications that measure testability of software
                                                                              design and categorize them based on whether they were
    Beyond Injection Vulnerabilities. While we focused on                     related to Encapsulation, Coupling, Cohesion, Inheritance,
    injection vulnerabilities (XSS, SQLi, Code Injection, File                Polymorphism, or Complexity.
    injection, Command Injection, and Path Manipulation),
    other types of vulnerabilities can be covered as a future                    While no previous study has systematically looked at
    work (e.g., Information leakage and/or improper error-                    patterns that prevent static tools from discovering vulner-
    handling attacks [41]). In fact, even though our tarpits                  abilities in web applications, previous work has already
    focus on data flow-related challenges, many of them are                   covered some of the aspects that can affect testability
    quite general and also impact the analysis of the control                 of programs written in dynamic languages. For example,
    flow of the application. A complete set of tarpits related to             Alshahwan et al. [6] list three categories that affect the
    control flow can be an interesting follow-up for our work.                testability of web applications (1) Forms, (2) Client-side
                                                                              validation, and (3) Server-side manipulation. Bures [11]
      11 https://github.com/enferas/TestabilityTarpits/tree/main/Docs/        instead define two types of patterns that affect testability,
    AddingPatternProcess.md                                                   the first one represents the anti-patterns, and the second
      12 INIT_FCALL opcode is used to call internal functions and the         represents the functional features of the front-end applica-
    name of the function is the second argument.                              tion. The same author also introduced a semi-automated

                                                                         13
framework to collect metrics for automated testability [10].           Finally, our study is the first to show the impact of code
                                                                       refactoring on vulnerability discovery for web applications.
Challenges for Static Analysis. Our work also shares
similarities with research on the limitations of static code              Previous works (Kyriakakis et al. [25] and Medeiros and
analysis. For example, Landman et al. [26] analyzed the                Neves [29]) provided inspiration for some of our tarpits,
main challenges to perform static analysis on programs that            in particular for the dynamic patterns. On the other hand,
use Java reflection. The authors’ experiments show that for            our tarpits provide new metrics to compare between static
78% of the projects in their dataset, reflection could not             security tools, and provide a number of novel findings
be resolved statically. They also provided suggestions for             which were never discussed in the state of the art. Finally,
developers to analyze reflection code as well as improve-              previous papers have compared SAST tools based on
ments for static tool builders. Sui et al. [39] compared               their accuracy of discovering vulnerabilities in real-world
three tools that had difficulties in discovering vulnera-              applications, while in our work we compare them based on
bilities in JAVA applications because of the presence of               the types of code patterns they are able to handle correctly.
dynamic features and reflection. Other papers discussed
the challenges in analyzing dynamic proxy API [14].
                                                                               X.    C ONCLUSION AND FUTURE WORK
   In general, the use of dynamic features is the main
challenge for static analyzers. Kyriakakis et al. [25]                    In this paper, we demonstrated that specific code
defined a number of patterns of PHP dynamic features                   patterns, which we call testability tarpits, are a major
and they counted their frequency in 10 projects, while                 impediment for static analysis of real world web
Hills et al. [21] proposed a categorization of the PHP                 applications. In particular, we assembled a library of
features and counted them in 19 projects. The authors                  testability tarpits for the two most used web programming
also counted the prevalence of dynamic features and how                languages (PHP and JS) and we validated them by using a
many times they could be resolved statically, finding that             mix of state of the art open-source and commercial SAST
78% of the dynamic includes and 61% of the variable                    tools. By defining discovery rules for these tarpits and
variables are statically computable.                                   applying them on thousands of open-source applications,
                                                                       we showed that these tarpits are widely used, indicating
   Medeiros and Neves [29] recently published the first                that nowadays static analysis has plenty of blind-spots.
work that looked at the impact of coding styles on the                 Finally, we performed two sets of experiments to to show
accuracy of SAST tools (RIPS, WAP, and phpSAFE)                        that refactoring the code to remove tarpits has a significant
applied to web applications. The authors define six                    impact on the alerts reported by SAST tools, leading to
scenarios of coding styles, with three vulnerabilities each.           the discovery of many previously-unknown vulnerabilities.
In all cases, they found that the tools identify true positives
when the query source is defined closer to the sink and                   We believe the framework discussed in the paper
false negatives when it is defined farther from the sink.              introduces a novel way to think about security testing.
                                                                       By shifting the focus from the testing tools to the code
                                                                       of the application, our solution allows to better assess the
Comparison of SAST Tools. Several studies have                         residual risk that a vulnerability is still present in the code
compared the accuracy and effectiveness of SAST tools.                 after static testing. We contributed all our discovery rules
Nunes et al. [32] proposed a benchmark to compare                      to the popular Joern community, in the hope that other
five popular tools on their ability to discover SQL                    researchers and developers will extend our library of tarpits
injections and XSS vulnerabilities in 149 WordPress                    and adopt to assess the security testing of web applications.
plugins. Kupschs and Miller [24] studied the ability                   All other results and resources we developed about our
of two popular commercial applications, Fortify and                    research are available in our public repository [3].
Coverity, to discover 15 vulnerabilities in the Condor
project. Each vulnerability was validated by hand, and
classified by the authors according to its difficulty to                                  ACKNOWLEDGMENT
discover (8 Difficult, 1 Hard, 5 Easy). Finally, Spoto et
                                                                         This work has received funding from the European
al. [38] uses object-sensitive taint analysis to build their
                                                                       Union’s Horizon 2020 research and innovation
static taint analysis for web applications in JAVA and
                                                                       programme under project TESTABLE, grant agreement
compare their results with ten static analyzing tools.
                                                                       No 101019206.
   Novelty. While other researchers have performed similar
studies (but limited to only a handful of patterns) to                                        R EFERENCES
identify challenges for crawlers and dynamic testing, to
the best of our knowledge this paper is the first to evaluate           [1] Github-clone-all tool. https://github.com/rhysd/
web applications based on how easy they are to analyze                      github-clone-all.
for SAST tools. By using our approach developers can                    [2] LGTM. https://lgtm.com/, Accessed March 11,
get a precise indication of the fraction of the application                 2022. Version: v1.27.0.
that a SAST tool will not be able to cover. This helps to               [3] Repository of testability patterns and experiments.
put the results of static testing into context and to suggest               https://github.com/enferas/TestabilityTarpits,
which SAST tool is better suited to analyze the application.                Accessed March 11, 2022.

                                                                  14
 [4] Ajin Abraham.              Nodejsscan.          https:              transformation. IEEE Transactions on Software
     //ajinabraham.github.io/nodejsscan/,        Accessed                Engineering, 30(1):3–16, 2004.
     March 11, 2022. Version: v4.5.                                 [19] Mark Harman.              Refactoring as testability
 [5] Areej Algaith, Ivano Alessandro Elia, Ilir Gashi,                   transformation. pages 414 – 421, 04 2011.
     and Marco Vieira. Diversity with intrusion detection           [20] Robert Hierons, Mark Harman, and C. Fox. Branch-
     systems: An empirical study. In 2017 IEEE 16th                      coverage testability transformation for unstructured
     International Symposium on Network Computing                        programs. The Computer Journal, 48, 05 2005.
     and Applications (NCA), pages 1–5, 2017.                       [21] Mark Hills, Paul Klint, and Jurgen Vinju. An
 [6] Nadia Alshahwan, Mark Harman, Alessandro                            empirical study of php feature usage: A static
     Marchetto, and Paolo Tonella. Improving web                         analysis perspective. In Proceedings of the 2013
     application testing using testability measures. In                  International Symposium on Software Testing and
     2009 11th IEEE International Symposium on Web                       Analysis, ISSTA 2013, page 325–335, New York, NY,
     Systems Evolution, pages 49–58. IEEE, 2009.                         USA, 2013. Association for Computing Machinery.
 [7] Andrea Arcuri and Xin Yao. Search based software               [22] AbdulSalam Kalaji, Robert Mark Hierons, and
     testing of object-oriented containers. Inf. Sci.,                   Stephen Swift. A testability transformation approach
     178:3075–3095, 08 2008.                                             for state-based programs. In 2009 1st International
 [8] M. Backes, K. Rieck, M. Skoruppa, B. Stock, and                     Symposium on Search Based Software Engineering,
     F. Yamaguchi. Efficient and flexible discovery                      pages 85–88, 2009.
     of php application vulnerabilities. In 2017 IEEE               [23] B. Korel, Mark Harman, Sunhwa Chung,
     European Symposium on Security and Privacy                          P. Apirukvorapinit, R. Gupta, and Q. Zhang. Data
     (EuroS P), pages 334–349, 2017.                                     dependence based testability transformation in auto-
 [9] Achim Brucker, Lukas Bruegger, Paul Kearney,                        mated test generation. pages 10 pp. – 254, 12 2005.
     and Burkhart Wolff.         Verified firewall policy           [24] James A. Kupsch and Barton P. Miller. Manual vs.
     transformations for test case generation. pages                     automated vulnerability assessment: A case study.
     345–354, 01 2010.                                                   In In First International Workshop on Managing
[10] Miroslav Bures. Framework for assessment of web                     Insider Security Threats (MIST), West, 2009.
     application automated testability. In Proceedings of           [25] Panos Kyriakakis, Alexander Chatzigeorgiou,
     the 2015 Conference on Research in Adaptive and                     Apostolos Ampatzoglou, and Stelios Xinogalos.
     Convergent Systems, RACS, page 512–514, New                         Exploring the frequency and change proneness of
     York, NY, USA, 2015. Association for Computing                      dynamic feature pattern instances in php applications.
     Machinery.                                                          Science of Computer Programming, 171:1–20, 2019.
[11] Miroslav Bures. Metrics for automated testability              [26] Davy Landman, Alexander Serebrenik, and Jurgen J.
     of web applications. In Proceedings of the 16th                     Vinju. Challenges for static analysis of java
     International Conference on Computer Systems and                    reflection - literature review and empirical study. In
     Technologies, CompSysTech ’15, page 83–89, New                      2017 IEEE/ACM 39th International Conference on
     York, NY, USA, 2015. Association for Computing                      Software Engineering (ICSE), pages 507–518, 2017.
     Machinery.                                                     [27] V Benjamin Livshits and Monica S Lam. Finding
[12] Johannes Dahse and Thorsten Holz. Simulation of                     security vulnerabilities in java applications with
     built-in php features for precise static code analysis.             static analysis. In USENIX security symposium,
     01 2014. Version: v0.55.                                            volume 14, pages 18–18, 2005.
[13] Edgescan. 2020 vulnerability statistics report.                [28] Aravind Machiry, Chad Spensky, Jake Corina, Nick
[14] George Fourtounis, George Kastrinis, and Yannis                     Stephens, Christopher Kruegel, and Giovanni Vigna.
     Smaragdakis. Static analysis of java dynamic                        DR. CHECKER: A soundy analysis for linux kernel
     proxies. ISSTA 2018, page 209–220, New York, NY,                    drivers. In 26th USENIX Security Symposium
     USA, 2018. Association for Computing Machinery.                     (USENIX Security 17), pages 1007–1024, Vancouver,
[15] Vahid Garousi, Michael Felderer, and Feyza Nur                      BC, August 2017. USENIX Association.
     Kilicaslan. A survey on software testability. Inf.             [29] Ibéria Medeiros and Nuno Neves. Impact of coding
     Softw. Technol., 108:35–64, 2019.                                   styles on behaviours of static analysis tools for web
[16] Seyed Mohammad Ghaffarian and Hamid Reza                            applications. DSN 2020, pages 55–56, 06 2020.
     Shahriari. Software vulnerability analysis and                 [30] CVE Mitre. https://cve.mitre.org/.
     discovery using machine-learning and data-mining               [31] NIST. NIST - Source Code Security Analyzers. https:
     techniques: A survey. ACM Computing Surveys                         //www.nist.gov/itl/ssd/software-quality-group/
     (CSUR), 50(4):1–36, 2017.                                           source-code-security-analyzers.
[17] Vandana Gupta, K. Aggarwal, and Yogesh Singh.                  [32] Paulo Nunes, Ibéria Medeiros, José C. Fonseca, Nuno
     A fuzzy approach for integrated measure of                          Neves, Miguel Correia, and Marco Vieira. Bench-
     object-oriented software testability. Journal of                    marking static analysis tools for web security. IEEE
     Computer Science, 1, 02 2005.                                       Transactions on Reliability, 67(3):1159–1175, 2018.
[18] M. Harman, L. Hu, R. Hierons, J. Wegener,                      [33] Paulo Jorge Costa Nunes, José Fonseca, and Marco
     H. Sthamer, A. Baresel, and M. Roper. Testability                   Vieira. phpsafe: A security analysis tool for oop


                                                               15
     web application plugins. In 2015 45th Annual
     IEEE/IFIP International Conference on Dependable
     Systems and Networks, pages 299–306, 2015.
     Version: DSN2015.
[34] Onilede-Jacobs Oluwatosin, Abdullateef Balogun,
     Shuib Basri, Abimbola Akintola, and Amos Bajeh.
     Object-oriented measures as testability indicators:
     An empirical study. Journal of Engineering Science
     and Technology, 15:1092–1108, 04 2020.
[35] OWASP. OWASP - Source Code Analysis Tools.
     https://owasp.org/www-community/Source Code
     Analysis Tools.
[36] OWASP.       OWASP WAP – Web Application
     Protection Project.        https://securityonline.info/
     owasp-wap-web-application-protection-project/.
     Version: v2.1.
[37] progpilot. progpilot - A static analyzer for security
     purposes. https://github.com/designsecurity/progpilot.
     Version: v0.7.
[38] Fausto Spoto, Elisa Burato, Michael D. Ernst, Pietro
     Ferrara, Alberto Lovato, Damiano Macedonio, and
     Ciprian Spiridon. Static identification of injection
     attacks in java. ACM Trans. Program. Lang. Syst.,
     41(3), July 2019.
[39] Li Sui, Jens Dietrich, Michael Emery, Shawn
     Rasheed, and Amjed Tahir. On the soundness of
     call graph construction in the presence of dynamic
     language features-a benchmark and tool evaluation,
     09 2018.
[40] The Joern Team. Joern - The Bug Hunter’s Work-
     bench. https://joern.io, 2021. Retrieved July 2021.
[41] Omer Tripp, Marco Pistoia, Stephen J. Fink, Manu
     Sridharan, and Omri Weisman. Taj: effective taint
     analysis of web applications. In PLDI ’09, 2009.
[42] Sourcecodester Website. Sourcecodester - free source
     codes. https://www.sourcecodester.com/php-project,
     2021.
[43] F. Yamaguchi, N. Golde, D. Arp, and K. Rieck.
     Modeling and discovering vulnerabilities with code
     property graphs. In 2014 IEEE Symposium on
     Security and Privacy, pages 590–604, 2014.




                                                               16
                                                                      A PPENDIX
A. Testability patterns for PHP
   The testability patterns for PHP are presented in Table V. This table groups together (by using horizontal lines)
pattern instances which address similar aspects of the language and have the same response from SAST tools. For each
instance (tarpit), the table reports its name, its properties with respect to the dimensions introduced in Section III-A,
and the tools that are affected by it (by using a sequence of letters, R for RIPS, S for PHPsafe, W for WAP, P for
Progpilot, X for Comm 1 and Y for Comm 2). When a tool handles the pattern by means of an over-approximation,
we mark its name with an overline. For instance, the string −−−−XY means that a tarpit is handled correctly only
by Comm 1 and via over-approximation by Comm 2. The last fours sets of columns report the prevalence of each
pattern instance in our four datasets – as expressed by the number of affected projects (prj column) and by the
median number of occurrences of the pattern (med column).
   Finally, when the same pattern has multiple instances (e.g., to describe tests belonging to different dynamic
categories) that lead to the same result, we group them and report their number in the number of instances (#i) column.
                                                                        TABLE V: Patterns

 ID   Pattern                        #i   API   SEC   Dyn     OOP   Neg            Tools          SC                 GL                 GM                 GH
                                                                                            prj        med     prj        med     prj        med     prj         med
  1   static variables               1                 S                      −−−−−−        50         13      443         4      635          7     712         14.0
  2   global variables               1                 S                       −S−−XY       89         10      203         7      213         10     210         12.0
  3   global array                   1                 S                      −−WP−Y        33          6      138        4.0     162         5.0    179          7
  4   conditional assignment         1                 S                       R−WPXY       221        74      795        18      890        31.5    908         59.0
  5   combined operator              1                 S                       R−WPXY       335        170     919        33      942        64.0    934         97.5
  6   coalesce                       1                 S                       RS−−XY        0          0       0          0      280         6.0    433          11
  7   string arithmetic operations   1          D      S                       RSW−XY       277        10      523         6      636         9.0    707          11

 8    simple reference               1                 S                      −−−−X−        42          39     163          9     231          5     292         6.0
 9    reference argument             1                 S                      −−−−XY        208         14     387          7     399         10     486         9.0
 10   return by reference            1                 S                      −−−−−−        19          11     83           4      95          4     132         4.0
 11   foreach with reference         1                 S                      −−−−−−        41           7     182         3.0    238         4.0    321          4
 12   make ref                       2                 S            D         −−−P−Y        25           6     116         6.0    134         4.0    180         4.0
 13   assign static prop ref         1                 S                      −−−PX−         9          1.0    19           1      10         1.0     17          1
 14   object assigned by reference   1                 S                      −−−−X−        22          21     100         6.5    107          7     155          5

 15   nested function                1                  S                      −SWPX−       66         3.5     166         4.0    222         4.0    283           5
 16   variadic functions             1                  S                     −−−−XY         1         12      59           3     143          3     239           3
 17   get arguments                  1                  S                     R−−−−Y        23         5.0     106         4.0    137          4     191           4
 18   send unpack                    1                  S                      RS−−X−        1         31      73           3     146         3.0    264          4.0
 19   closures                       2                 D2                     −−−−XY        36          1      543          7     733         11     782         25.5
 20   use with closures              2                 D2           D         −−−−XY        25          1      321          4     524         5.0    614         12.0
 21   simple object                  1                  S     D                −−−PXY       336        199     968        350.5   977         863    974        1536.5
 22   assign object                  1                  S     D               −−W−X−        30          3      138         4.0    212         4.0    325           4
 23   object argument                1                  S     D               −−−−X−        119        30      591          23    718        53.5    804         79.5
 24   new self                       1                  S     D               −−−−X−        41          6      162         2.0    249          3     351           3
 25   clone                          1                  S     D               −−−PX−        41          6      147          3     238         5.0    338          5.0
 26   late static binding            2                 D2     D     D         −−−−X−        13         1.0     165          4     279          5     386          8.0
 27   get called class               1                 D2     D               −−−−−−         0          0      16          1.0     28         1.0     34          2.0
 28   static methods                 1                  S     D               −−−PX−        119        17      792         29.0   865         61     898         126.5
 29   static properties              1                  S     D               −−−PX−        93         48      406         12.0   498        14.0    615          20
 30   anonymous classes              1                  S     D               −−−−XY         1          6      30          2.0     81          3     174          3.0
 31   static method variable         2                D2,D4   D               −−−−−−         1          1      23           1      51          2      68          2.0
 32   set overloading                1                  S     D               −−−−X−         0          0      44          6.0     50         7.0     61           8
 33   get overloading                1                  S     D               −−−−−−         1          1      56          6.5     70         7.0     81           8
 34   isset overloading              1                  S     D               −−−−−−         1          1      32          6.5     34         7.0     49           7
 35   unset overloading              1                  S     D               −−−−X−         0          0      24          5.5     23          8      29           7
 36   call overloading               1                  S     D               −−−−−−         6         1.0     47           4      59          7      68          7.5
 37   callstatic overloading         1                  S     D               −−−−−−         3         22      12          35.0    20        141.0    26         41.0
 38   invoke                         1                  S     D               −−−−X−         1         21       6          1.5     9           3      11           4
 39   serialize unserialize          1                  S     D               −−−P−−        42         1.5     135          5     143          8     188          6.0
 40   trait                          1                  S     D               −−−−XC        87          6      800         13.0   881         26     907          43
 41   self methods                   1                  S     D               −−−PX−        68         35      360         12.0   482        15.0    602         22.5
 42   destructor                     1                  S     D               −−−−−−        102         1      59           4      78         5.5     88          7.0
 43   tostring echo object           1                  S     D               −−−−XY         9         12      76          14.5    86        25.0    108         16.0
 44   verify return type             2                  S     D               −−−PX−        41         32      454         9.0    607         21     713          44
 45   static method from variable    1                 D2     D               −−−P−Y        23          3      98          2.0    166         4.0    235           4

 46   object to array                1                 D2     D               −−−−−−        50          13     290        4.0     405          4     475          5
 47   Overriding                     1                  S     D                −−−PXC       62          11     569         16     698         24     750          49
 48   construct with inheritance     1                  S     D               −−−PX−        64          4.5    471         7      590         11     680          17
 49   static instance                1                  S     D               −−−−−−         9           3     103         1      114          3     161          2
 50   throw exception                1                 D2                     −−−−−−        84          24     610        9.0     739         13     810         21.0
 51   catch exception                1                  S                      RS−−−C       95           6     466        4.5     612         6.0    687          11
 52   try catch finally              2                 D2           D          R−−−XY        3           6     39          2       86         2.0    197          2
 53   track error                    1                  S                     −−−P−−        135         20     333         5      407          6     521          7
 54   generators                     1                  S                     R−−−X−         5          1.0    57          2      113          3     204         5.0
 55   goto                           1                  S                     −−−−X−         3           8     68         8.0      95          4     155          5
 56   exit                           1          D       S                      RSWP−−       261          3     182        2.0     185          4     226         4.0
 57   JS redirect                    1                  S                     −−−−−−        151          8     27         3.0     115          3     137         4.0
 58   simple array                   2                 D1           D          R−−PXY       338        336.5   973        120     970        224.5   963         439
 59   foreach with array             1    D             S                     R−−−−Y        68          9.5    208        4.0     237          5     297          4
      foreach with array             1                  S                      R−−PXY       262         21     831         10     883         21     917          29
 60   array walk                     2    D           D2,D4                   −−−−−−        19          1.0    43          1       60         2.0     74         2.0
 61   array map                      2    D           D2,D4                   −−−−−−        41          12     167         3      214         5.0    280         4.0
 62   parse str function             1    D            D4                     R−−−−−        17          4.0    76         1.0      88         3.0    112         2.0
 63   substring replace function     1    D             S                      RS−−−Y       38          4.0    80         3.0      97          3     118         3.0




                                                                              17
 64   preg match                 1     D               S                       R−−−X−        100     6.0     277      6     279        9      355        6
 65   system (system)            1     D     D         S                        R−−PXY        1       1       20     3.0     37        3       41        2
      system (exec)              1     D     D         S                        R−−PXY       20       3       78     2.0    100       3.0     130       3.0
      system (unlink)            1     D     D         S                        R−−PXY       101      3      159      4     181        6      237        5
 66   superglobals               1           D         S                        −SWPX−       177     7.0     331      4     355        6      413        6
      superglobals               1           D         S                       R−W−X−        323     19      112     4.0    133        8      148       5.0
      superglobals               1           D         S                       −S−−X−         9       1       58     1.5     81        2      102       2.0
      superglobals               1           D         S                         RSWP−Y      240      9       90     4.0    120       4.0     124       4.0
 67   odbc                       1     D     D         S                         RS−PXY       1       1       48     2.0     60       2.0      63        2
 68   compact                    2     D             D2-D4                     −−−−−−         1       1       48     2.0     60       2.0      63        2
 69   create function            1     D              D1                       −−−−−−         1       3       49      2      38       4.0      44       2.0
 70   extract                    1     D              D2                       −−−−−−        117     15       80     2.5    100       3.0      89        2
 71   array functions            1     D               S                       −−−−−Y        23      1.0      86     2.0    114       2.0     155        3
      array functions            1     D               S                       R−−−−Y        10      1.0      23      2      37        1       40       2.0
 72   procedural queries         1     D     D         S                        R−−PXY       187     26       30     2.5     33        4       24        4
      procedural queries         2     D     D         S                       −−−−XY        73       4       43      3      38        4       38       2.0
 73   wrong sanitizers           2     D     D         S                         RS−PX−      174      5      242     3.0    303        5      332       5.0
 74   dirname                    1     D     D        D1                       −−−−−−        23      3.0     101      4     111        4      131        4
 75   buffer                     1     D               S                       −−−−−−        27       2      150     2.5    190       3.0     181        4
 76   function variable          2                   D2,D4                     −−−−−−        40      2.5     315      3     465        4      602       7.0
 77   object callable            2                   D2,D4                     −−−−−−        12       6       89      2     141        3      252       4.0
 78   autoloading classes        1     D              D2     D                 −−−P−−        50       1      123      1     138       1.0     150       2.0
 79   dynamic include            1                    D1     D                  R−−PX−       337     44      549      5     600       5.0     636       6.0
      dynamic include            1                    D2     D                  R−−PX−        7       2       14     2.0     19        1       27        2
      dynamic include            2                    D3                       −−−−−−        137      2      155      5     190       4.5     219        4
      dynamic include            1                    D4                       −−−−−−        337    85.0     665      6     712       7.0     754       7.0
 80   callback functions         1                    D1                       −−−P−Y        41       2      128     3.0    159        3      208       2.5
      callback functions         2                    D2                       −−−P−−         5       2       11      2      15        2       31        2
      callback functions         1                    D3                       −−−−−−         8       7       17      2      29        1       38       1.5
      callback functions         1                    D4                       −−−−−−        65       6      180     4.0    188       4.5     269        5
 81   new from variable          1                    D2     D                 −−−−−−        12       7       90     5.0    122       3.0     127        3
      new from variable          1                    D3     D                 −−−−−−         0       0        0      0      0         0       0         0
      new from variable          1                    D4     D                 −−−−−−        39       8      394     4.0    503        5      600       6.0
 82   methods variable           1                    D2     D                 −−−−−−        14      4.0      99      4     163        4      211        4
      methods variable           1                    D4     D                 −−−−−−        46       3      223      3     351        3      448       4.0
 83   array variable key         2                    D2             D          R−−−XY       74      8.0     173      8     255        8      277        5
      array variable key         2                    D4             D         −−−−XY        238     21      763     12     831       18      883       32
 84   variable variables         1                    D2                       −−−−−−        24      5.0      20     5.0     27        5       47        5
      variable variables         1                    D4                       −−−−−−        123      5       81      4     108       4.5     147        3
      Total                     122    26    16              39      7                      7623    1716    22687   1031   27875    2004.5   32572    3097.5
      Average                                                                                74     16.66   220.2    10    270.6     19.5    316.23    30.07

 Legenda for column Tools: RIPS (R), phpSAFE (S), WAP (W), Progpilot (P), Comm 1 (X), Comm 2(Y)

B. Testability patterns for JS
   The JS testability patterns are listed and detailed for the community in our repository [3]. 34 of these patterns
resemble their PHP siblings, targeting basic language constructs and operators (OOP, functions and variables). All
the others focus on JS peculiarities such as specific data structure handlers (e.g., Proxy, WeakSet) or web operations
(e.g., Ajax requests). We classified each pattern instance according to the same dimensions introduced in Section III-A
for PHP: over 153 patterns instances, 40 are about OOP, 20 capture negative test cases, 22 are security related, and
22 refer to internal API (recall that these dimensions overlap between each other). For what concerns the Static
vs Dynamic features dimension, 101 instances are static (S) and the rest are dynamic (17 belong to D1, 17 to D2, 10
to D3 and 8 to D4). Table VI presents a selection of the patterns, with an emphasis on those mentioned in the paper.

                                                                  TABLE VI: JS Patterns
           ID          Pattern                                            #i        API   SEC      Dyn      OOP     Neg             Tools
            7          array unshift                                      1                         S                              L−−X−
           14          template literals                                  1               D         S                              L−ZXY
           21          new target                                         1                         S                              L−ZX−
           24          finite                                             1                         S                              L−ZXY
           36          returned function                                  1                         S                              L−ZX−
           49          arrow function                                     1                        D2                              L−Z−Y
           55          inheritance                                        1                         S       D                      −−−−Y
           75          functions in object                                1                        D1       D                      −−−−Y
           78          asynchronous event handler                         1         D              D2                              L−Z−Y
           79          inline function                                    1                        D1                              L−Z−Y
           82          location assign with search                        1         D     D         S                              L−Z−Y
           83          getAttribute                                       1         D     D         S                              −−−−Y
           86          type juggling                                      1                        D3                              −−−−−
           87          modules                                            1                        D2                              −−−−Y
           90          simple array                                       1                         S                              L−ZXY
           99          GET ajax                                           1         D     D        D2                              L−ZXY
           101         innerHTML outerHTML                                2         D     D         S                              L−−−Y
                       Total                                             153        22    22                40      20

           Legenda for column Tools: LGTM (L), NodeJsScan (N), Comm 3 (Z), Comm 1 (X), Comm 2(Y)



                                                                               18
