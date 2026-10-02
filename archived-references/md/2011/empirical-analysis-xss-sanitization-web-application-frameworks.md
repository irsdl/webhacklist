---
type: Article
title: An Empirical Analysis of XSS Sanitization in Web Application Frameworks
description: Models browser parsers, context transitions and decoding operations to explain why sanitization can fail after data changes context. An evaluation of web frameworks and PHP/Django applications compares automatic escaping with actual output contexts and sanitizer policies. Examples show URI-scheme bypasses and DOM re-parsing that undoes HTML encoding.
resource: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf"
tags: [article, webseclist-reference, university-of-california-berkeley, xss, sanitizer-bypass, dom, encoding, parser-differential, measurement-study, dynamic-analysis, defence, owasp-a03-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-09-10T15:27:04+00:00"
status: stable
stale_after: 2027-09-10
sources:
  - id: original
    resource: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf"
    title: An Empirical Analysis of XSS Sanitization in Web Application Frameworks
    author: Joel Weinberger, Prateek Saxena, Devdatta Akhawe, Matthew Finifter, Richard Shin, Dawn Song
  - id: capture
    resource: "https://web.archive.org/web/20231205190204/https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf"
also_at: []
authors:
  - Joel Weinberger
  - Prateek Saxena
  - Devdatta Akhawe
  - Matthew Finifter
  - Richard Shin
  - Dawn Song
canonical_url: ""
cited_by:
  - "2011.md:81"
commit: ""
content_sha256: 036b934bb3e075b221e15e745c91fa545bc8d6ee38ca25708b79df8d62931c67
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf"
published: ""
publisher: University of California, Berkeley
publisher_english: ""
raw_sha256: 0fe0f7acbcd939a789a3c2cccc5b73047b944a4f40a419f2766bdaeaf8ff21c1
retrieved_from: "https://web.archive.org/web/20231205190204id_/https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-09-10T15:27:04+00:00"
slug: empirical-analysis-xss-sanitization-web-application-frameworks
snapshot: 20231205190204
title_english: ""
translation_file: ""
translation_of: ""
---

# An Empirical Analysis of XSS Sanitization in Web Application Frameworks

**An Empirical Analysis of XSS Sanitization in Web Application Frameworks** - Joel Weinberger, Prateek Saxena, Devdatta Akhawe, Matthew Finifter, Richard Shin, Dawn Song, University of California, Berkeley.

- Published: date not stated
- Original: <https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf>
- Preserved from: https://web.archive.org/web/20231205190204id_/https://www2.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.pdf (manual-import) on 2026-09-10
- Capture timestamp: 20231205190204
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

An Empirical Analysis of XSS Sanitization in Web
           Application Frameworks




              Joel Weinberger
              Prateek Saxena
              Devdatta Akhawe
              Matthew Finifter
              Richard Shin
              Dawn Song




              Electrical Engineering and Computer Sciences
              University of California at Berkeley


              Technical Report No. UCB/EECS-2011-11
              http://www.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-11.html


              February 9, 2011
                     Copyright © 2011, by the author(s).
                            All rights reserved.

Permission to make digital or hard copies of all or part of this work for
personal or classroom use is granted without fee provided that copies are
not made or distributed for profit or commercial advantage and that copies
bear this notice and the full citation on the first page. To copy otherwise, to
republish, to post on servers or to redistribute to lists, requires prior specific
permission.
         An Empirical Analysis of XSS Sanitization in Web Application Frameworks

           Joel Weinberger, Prateek Saxena, Devdatta Akhawe, Matthew Finifter, Richard Shin, Dawn Song
                                         University of California, Berkeley


                              Abstract                                        incorrect sanitization. Additionally, the application must not
                                                                              break functionality by overzealous application of sanitization.
     Filtering or sanitization is the predominant mechanism                     The goal of this paper is to systematically understand the
in today’s applications to defend against cross-site scripting                challenges in implementing these two components, evaluate
(XSS) attacks. XSS sanitization can be difficult to get right as              support for them in existing web frameworks, and develop
it ties in closely with the parsing behavior of the browser. This             a basic understanding of sanitizer usage in large, real-world
paper explains some of the subtleties of ensuring correct saniti-             applications today.
zation, as well as common pitfalls. We study several emerging
                                                                              Addressing Identification of Untrusted Data. A goal of
web application frameworks including those presently used
                                                                              this paper is to understand how web application frameworks
for development of commercial web applications. We evaluate
                                                                              address the challenges of identifying untrusted data by using
how effective these frameworks are in guarding against the
                                                                              HTML templating, as well as the flexibility of built-in support
common pitfalls of sanitization. We find that while some
                                                                              for embedding untrusted data in web application output. Prior
web frameworks safeguard against the empirically relevant use
                                                                              research has focused on addressing this problem by employing
cases, most do not. In addition, some of the security features
                                                                              techniques such as taint-tracking [36, 43, 60, 65] or type sys-
in present web frameworks provide a false sense of security.
                                                                              tems [46]. We aim to quantify how web applications address
                                                                              this challenge differently and how the two may interplay with
1. Introduction                                                               each other in the future.
                                                                              Addressing Correctness. Ensuring correctness for cross-site
   Cross-site scripting (or XSS) attacks continue to plague                   scripting sanitizers can be tricky, primarily because it involves
existing and emerging web applications, despite receiving                     a deep understanding of the behavior of web browsers. We first
intense focus from both industry and academia. Researchers                    formalize XSS sanitization by developing a detailed model of
have proposed many novel defenses, ranging from purely                        the web browser, demystifying some of the cryptic intricacies
server-side to browser-based or both. Sanitization or filtering,              of browser behavior. We explain some of the subtleties in
the practice of encoding or eliminating dangerous constructs                  “getting sanitization right,” including how sanitization applied
in untrusted data, remains the predominant defense strategy in                by the server can be “undone” during the lifetime of untrusted
existing applications.                                                        data. Based on this understanding of browser behavior, we
   A variety of web application frameworks, including those                   illuminate error-prone cases for sanitization, and the poorly-
used for major commercial applications, have emerged. As                      understood subtle cases worthy of further attention. Previ-
these frameworks gain wide acceptance as platforms for se-                    ous research has addressed correctness of the sanitization
curing applications, it becomes important to quantify the extent              process [5, 48, 49, 59], but we focus on why the sanitization
to which web frameworks address the fundamental causes of                     process goes wrong rather than how to verify that it is correct.
XSS vulnerabilities in existing web applications.                                Web application frameworks have gained popularity, as they
   An XSS attack occurs when the web browser executes, as                     promise ease of development and a more principled approach
higher-privileged application code, data input controlled by a                to security. To study their role, we gather 13 popular web
low-privileged entity. Sanitization for XSS defense involves                  frameworks, including several in commercial use. We first
the following two main components1:                                           quantify how these frameworks provide sanitization defense
   (a) Identifying Untrusted Data (or “what to sanitize”): Even               for XSS. Particularly interesting is the support for auto-
for the simplest applications, only untrusted input data should               sanitization, a feature in which the web framework takes the
be sanitized before being emitted in the HTTP response—code                   responsibility for eliminating XSS attacks for the developers.
written by the developer is implicitly trusted and should not                 We find that while most frameworks do not provide this
be sanitized.                                                                 feature, in the ones that do, it often provides little more
   (b) Correctness of Sanitization: After identifying untrusted               than a false sense of security; unlike SQL injection (a related
data, the sanitization performed needs to be complete and                     web vulnerability), cross-site scripting attacks require context-
correct to prevent code injection attacks due to insufficient or              sensitive sanitization, yet most of these frameworks provide
                                                                              context-insensitive sanitization. We also quantify some of the
     1 Vulnerabilities in web browsers and its components as well as under
                                                                              other interesting variations in underlying principles employed
specification of web standards have been another reason for XSS attacks [7,   in these frameworks pertaining to: (a) where to sanitize, (b)
8, 30]. However, we do not consider these in this paper.                      support for separation of HTML templates from data, and (c)
degree of expressiveness in sanitizers.                              blocks do not represent sub-parsers themselves, but other
   In order to understand whether real-world applications today      components of the browser that interact with the sub-parsers.
could take advantage of existing web frameworks in the               The DOM stores all the parse-tree outputs of the sub-parsers,
near future, we perform an empirical evaluation of 8 popular         funnels input fragments between them, and provides methods
applications ranging from 10 KLOC to over 500 KLOC. We               for manipulating both the parsed outputs as well as the string
find that most advanced web frameworks do offer support for          fragments corresponding to them. The JavaScript runtime uses
all HTML contexts actually used by our subject applications.         the DOM to effect changes to the page loaded in the browser,
   Finally, we outline sanitization practices in real-world ap-      causing sub-parser invocation in the process.
plications that web frameworks do not currently support,                Web applications embed data from untrusted input sources
pointing out the need for extensible sanitization policies in web    (such as lower privileged users) in the HTTP response, which
frameworks. We formulate the abstraction of a sanitization           is then served to a higher privileged entity. In a cross-site
policy function that captures how applications pick sanitizers       scripting attack, parsing of untrusted data as a dangerous
to apply. We show that sanitization policy functions are only        non-terminal leads to injected code execution. Informally, we
implicitly enforced (rather than being explicitly stated) in         say that untrusted data “breaks out” of a trusted embedding
application logic, are complex, and vary significantly from one      context, causing script execution. The set of attack strings
application to another.                                              that accomplish this varies significantly based on the trusted
   In the following sections, we:                                    context in which untrusted data is embedded. For clarity, we
   • Formalize the concepts of embedding contexts, sanitizers,       begin by formalizing this notion of embedding context.
      and browser transductions, and use these formalizations        Embedding Contexts.
      to guide our inquiry into the subtleties and pitfalls of XSS      Definition 1: (Embedding Context) Let G = (V, Σ, S, P )
      sanitization.                                                  be a context-free grammar for a sub-language defined by a
   • Analyze the correctness and completeness of sanitization
                                                                     quadruple consisting of a set of non-terminal symbols V ,
      mechanisms of web frameworks.                                  terminal symbols Σ, start symbol S and a set of productions
   • Discuss our empirical analysis of web applications, which
                                                                     P . Let D : S ⇒∗ γ denote the leftmost derivation sequence
      allows us to compare sanitization mechanisms supported         of the sentence γ under the production rules of G.
      in frameworks and those required by real web applica-             Let each step in the derivation sequence apply a production
      tions.                                                         rule and yield a “sentential form,” i.e., a sequence consisting
                                                                     of non-terminals and terminals.
2. Contexts, Sanitizers and Correctness                                 A given untrusted substring v ∈ Σ∗ in the browser input
                                                                     I ∈ Σ∗ is said to be embedded in a context (or non-terminal)
   The correctness of sanitization mechanisms is closely tied        C, if
to the parsing behavior of the web browser. We present an
                                                                        (a) the derivation X : αCβ ⇒∗G αuvwβ is a subsequence
abstract model of the web browser which explains how the
                                                                     of the leftmost derivation of I, for terminal words α, u and w
intricacies of XSS sanitization are more complex than classic
                                                                     consisting only of trusted characters, and
command injection sanitization. Many formulations of cross-
                                                                        (b) X is minimal, i.e., ∄C ′ , X ′ : α′ C ′ β ′ ⇒∗G α′ u′ vw′ β ′
site scripting defense already exist in the literature [11, 42,
                                                                     where X ′ is a subsequence of X , for terminal words α, u′ and
50, 59, 62]. Our formalization of the browser model and XSS
                                                                     w′ consisting only of trusted characters.
builds upon previous work [50], with an enhanced focus on
                                                                        To make our definition concrete, we list some examples of
browser transductions.
                                                                     embedding contexts in Table 1. Although we can define several
                                                                     such contexts with the above formalism, we wish to restrict
2.1. A Model of The Web Browser
                                                                     ourselves to those that real-world applications actually use and
                                                                     those that web application frameworks support.
   We can view the browser as a collection of sub-grammars,
each corresponding to the different languages recognized in
the web browser: HTML, JavaScript, CSS, the grammar for              2.2. Context Transitions
URI schemes, and so on. The browser parses documents it
retrieves, such as HTML pages, in stages. The browser parses            Associated with each sub-grammar in the browser are
each portion of the input by one or more sub-grammars.               transition non-terminals, i.e., non-terminals that recognize
For example, the browser parses HTML input according to              fragments of the input that belong to another sub-grammar.
HTML syntax rules (the latest specification effort for which is      For instance, the parser recognizes data embedded in event
HTML 5). Certain portions of the input may contain fragments         handler attributes of HTML tags as JavaScript statements, and
from other languages, such as within <script> blocks; these          the browser must parse the attributes further and interpret
fragments are then shipped to the corresponding sub-parser for       them in the JavaScript engine. Whenever the parser derives a
that language.                                                       fragment of the input from a transition non-terminal, the parser
   Figure 1 depicts the complexity of the interaction between        ships the fragment to the corresponding sub-parser for further
the various sub-parsers in the browser. Note that the shaded         processing (corresponding to the edges in Figure 1). We refer
 Example                                                      Sub-grammar(s)     Embedding contexts
 <p>untrusted</p>                                             HTML               HTML tag content
 <p id="untrusted">                                           HTML               Double-quoted HTML attribute
 <a onclick="document.title=’untrusted’;">                    JavaScript, HTML   Single-quoted JavaScript string in double-quoted HTML attribute
 <img src=http://untrusted>                                   URI, HTML          Domain of a URI in an unquoted HTML attribute
 <div style="color: rgb(untrusted);">                         CSS, HTML          RGB color specification in double-quoted HTML attribute

                                   TABLE 1. Examples of common embedding contexts.



      HTML code

                               1. PCDATA                                                    4. DOM Core
                                                                                                                            JavaScript
     HTML parser               2. CDATA                             DOM
                                                                                                                             runtime
                               3. innerHTML                                                5. DOM HTML
                                                                                                                   11. eval()
                                                        es
                                                 i  but        7. stylesheets             8. s                            12. JSON
                                         I   attr                                              crip
                                                                                                    ts                           13. AST
                                 6.   UR
          URI                                                        CSS                                                    JavaScript
         parser                   9. url()                          parser                 10. JavaScript                     parser
                                                                                            expressions
                                                             14. JavaScript URIs

Fig. 1. A model of a web browser showing the possible flows of data between the parsers, the DOM, and the JavaScript
runtime. The DOM stores all syntax-tree outputs of the parsers, and the JavaScript runtime manipulates the DOM. For
most of the edges, the browser applies a transduction when they are traversed. See Table 2 for more details about the
edges.


to this transition between a context in one sub-grammar to a               each transition from context C1 to C2 accompanied by a
context in another sub-grammar as a context transition.                    transduction T as C1 →T C2 .
Static Transitions. Some context transitions can be statically                Transductions are important because they make reasoning
determined by the placement of the untrusted data in the web               about sanitization non-trivial. As described later, sometimes
application’s output, whereas others result from execution of              these transductions can “undo” the sanitization applied on
client-side application code. Take the following example:                  untrusted data, leading to subtle bugs in the sanitization
                                                                           process.
               <img src="untrusted">                                          Transductions are edge-specific; we detail them in Table 2.
This shows a fragment of HTML code with a context transition               In particular, Table 3 details the transductions that are auto-
from an HTML attribute context to the URI parser’s scheme                  matically performed by the browser upon reading or writing
(e.g., http: or mailto:) context. Identifying static transitions           DOM elements via JavaScript.
is feasible using a high fidelity model of a web browser for                  There are subtle features of these accesses that are important
parsing.                                                                   for sanitization correctness. Specifically, note that:
                                                                              (a) Data values are HTML entity decoded when written
Dynamic Context Transitions. Dynamic context transitions                   from the HTML parser to the DOM via edge 1 in Figure 1.
occur when data is programmatically read from or written to                Therefore, when a program reads a value via JavaScript, e.g.,
the DOM by JavaScript. There are several ways for data parsed              in getElementById(’a’).getAttribute(’id’), the value is entity
by the HTML engine to be read and placed into the DOM via                  decoded and if it is subsequently evaluated as HTML code,
JavaScript. Table 3 shows a common subset of these methods.                it results in code injection. This automatic entity decode can
Identifying dynamic transitions requires an involved analysis              have the effect of negating sanitization applied by the server
of the application’s JavaScript code.                                      on untrusted data.
Browser Transductions. A significant complication is that the                 (b) DOM access methods expose two different ways of
browser applies a transduction on input along each transition              accessing DOM content. One set of read access APIs creates
edge. For instance, when the data in a URL attribute is found,             a serialized string of the AST representation of an element.
the browser first decodes HTML entities [28] in it before                  These correspond to entries named “HTML serialization,”
shipping it to the URI parser. For example, we formally denote             “CSS serialization,” and “URI normalization” (which addition-
  Edge      Trigger for traversal                                                        Transduction function             Example (input → output)
  1         Normal HTML markup.                                                          HTML parsing                      <p>1&lt;2</p> → DOM
                                                                                                                           node “p” containing 1<2
  2         Character data in HTML, which is not parsed (e.g. <script> blocks).          None
  3         Setting the innerHTML property on a DOM node, which invokes the              HTML parsing                      <p>1&lt;2</p> → DOM
            HTML parser to obtain a corresponding DOM tree from the input string.                                          node “p” containing 1<2
  4         Uses of Core DOM APIs, such as getAttribute or setAttribute.                 None
  5         Uses of HTML-specific DOM APIs, such as .innerHTML or .style.                See Table 3
  6         Delivery from HTML parser of attribute contents that are URIs (e.g., href,   None
            src).
  7         Instantiation of CSS stylesheets, from <style> blocks or style at-           CSS escape sequence decoding      \61 → a
            tributes.
  8         JavaScript source code, in <script> blocks or in event handler attributes.   JavaScript parsing                \u61 → a
  9         URI specifiers in CSS stylesheets.                                           None
  10        JavaScript in CSS stylesheets (e.g., expression).                            JavaScript parsing                \u61 → a
  11        Call of JavaScript’s eval function.                                          JavaScript parsing                \u61 → a
  12        Use of built-in JSON parser.                                                 JSON parsing                      \u61 → a
  13        Result of parsing a JavaScript program.                                      N/A

 TABLE 2. Data flows between the components of our browser model as depicted in Figure 1. Edge corresponds to
                                     the numbered arrows in Figure 1.


 DOM property                                                 Access method                            Transductions on reading   Transductions on writing
                                                              get/setAttribute                                  None                       None
 data-* attribute                                             .dataset                                          None                       None
                                                              in markup                                          N/A               HTML entity decoding
                                                              get/setAttribute                                  None                       None
 src, href attributes                                         .src, .href                                 URI normalization                None
                                                              in markup                                          N/A               HTML entity decoding
                                                              get/setAttribute                                  None                       None
 id, alt, title, type, lang, class, dir attributes            .[attribute name]                                 None                       None
                                                              in markup                                          N/A               HTML entity decoding
                                                              get/setAttribute                                  None                       None
 style attribute                                              .style.*                                     CSS serialization            CSS parsing
                                                              in markup                                          N/A               HTML entity decoding
 HTML contained by node                                       .innerHTML                                  HTML serialization           HTML parsing
 Text contained by node                                       .innerText, .textContent                          None                       None
 HTML contained by node, including the node itself            .outerHTML                                  HTML serialization           HTML parsing
 Text contained by node, surrounded by markup for node        .outerText                                        None                       None

 TABLE 3. Transductions applied by the browser for various accesses to the DOM. These summarize transductions
                                  when traversing edges 1, 4, or 5 in Figure 1.



ally makes the URI absolute and applies URI encoding). This                     perform the transformation on the server or in JavaScript code
API corresponds to DOM HTML APIs (edge 5 in Figure 1).                          running on the client.
For example, when reading an href attribute that has a                            Definition 2: (Sanitizer) A sanitizer is a function
relative URI using the .href attribute of the DOM node,
                                                                                                           f : string → string
the browser will produce a canonicalized absolute URI. The
other API methods simply read the text values of the string                        Defining sanitizers as general string transformers allows
versions (without serializing the ASTs to a string) and perform                 us to include buggy/incorrect sanitizers in our definition. A
no canonicalization of the values.                                              correct sanitizer is a sanitizer that provides some confinemen-
   (c) The transductions vary significantly for the DOM write                   t/safety property on the output.
access API as well, as detailed in Table 3.
   Section 2.5 explains in further detail how these subtleties                  2.4. Correctness of Sanitization
can result in bugs.
                                                                                  Checking correctness of XSS sanitization is more complex
2.3. Sanitizers                                                                 than command injection sanitization, formalized by Wasser-
                                                                                man et. al. [56]. We recall below their basic definition of safety
   Intuitively, a sanitizer is a function that aims to transform                and then bulid on it.
content to ensure that the browser’s parser confines the con-                     Definition 3: (Syntactic Confinement) A derivation D is
tent to explicitly allowed syntactic elements. Sanitizers can                   syntactically confined to a set of non-terminals A, denoted by
D↓ ⊂ L(A), if all the sentential forms generated in D contain            1   text = element.getAttribute(’title’);
                                                                         2   // ... elided ...
only non-terminals from the set A.                                       3   desc = create_element(’span’, ’bottom’);
   A function f ensures syntactic confinement to a given set of          4   desc.innerHTML = text;
allowed non-terminals in a sub-grammar G if ∀α, D : S ⇒∗G                5   tooltip.appendChild(desc);

f (α), D↓ ⊂ L(A)
   We highlight that the actual safety property that sanitization        Fig. 2. A bug in PHPBB3 that results due to failure to
aims to achieve is the context chain safety defined below,               perform sanitization for a dynamic context transition
which accounts for context transitions and the complications
introduced by browser transductions.
                                                                         application’s JavaScript code reads data sanitized by the server
   Definition 4: (Context Chain Safety) Let C1 →T1
                                                                         (using HTML-entity encoding) from a parsed attribute. (using
C2 →T2 . . . Cn−1 →Tn−1 Cn be a chain of context transitions
                                                                         HTML-entity encoding). It dynamically places the data in an
induced by a fragment of untrusted data u in the browser. A
                                                                         HTML content context and evaluates the string as HTML.
sanitizer f is correct only if ∀Ci , Ti−1 (. . . (T1 (f (u)))) ensures      The browser automatically decodes HTML entities, undoing
syntactic confinement to only the allowed non-terminals in Ci .
                                                                         the server’s sanitization, and the getAttribute DOM API reads
   As highlighted earlier in this section, transductions can vary        the decoded string, which allows injection of a script block on
significantly based on the context chain and based on the use            HTML evaluation. In particular, the safe string &lt;script&gt;
of access methods in JavaScript. The next section presents               will be decoded to <script> by the getAttribute call and writ-
several examples of common modes of failure in sanitization              ing <script> via innerHTML results in XSS. JavaScript-heavy
usage.                                                                   web applications are likely to have many of these vulnerabil-
                                                                         ities. Previously developed vulnerability analysis techniques
2.5. Evaluating Effectiveness Against Common Fail-                       aim to solve this problem; however, their applicability to
ures of Sanitization                                                     securing web applications during construction has not been
                                                                         demonstrated [48, 49].
   We describe a number of failure reasons for XSS sanitiza-                In our evaluation, we aim to evaluate whether existing web
tion, and formulate the questions pertaining to correctness that         frameworks address the issue of identifying dynamic context
our evaluation in this paper aims to answer.                             transfers, and if so, to what extent they enable correct defenses
Incomplete sanitization for nested contexts. Consider the                against them.
earlier example that shows a nested context for the underlined           Sanitizing difficult contexts. Certain contexts are in-
untrusted data:                                                          herently difficult to sanitize. For instance, sanitization
                                                                         inside an unquoted HTML attribute requires elimina-
                 <img src="untrusted">
                                                                         tion of a variety of untrusted characters (including
If the developer HTML entity escapes only the untrusted data,            [space] % * + , - / ; < = > ^ and |), which varies across
the attacker can not break out of the HTML attribute context.            browsers. However, if the attributes are quoted, defensive rules
However, because the underlined portion is a URI context, the            to ensure syntactic confinement are simple and do not vary
attacker is still able to attack the URI parser. An attack string        much across browsers [44]. Similarly, embedding data directly
such as javascript: will, when parsed by the URI parser, cause           inside a <script> block outside of string and number literal
it to recognize the protocol as a JavaScript URI, initiating             contexts is problematic because one must have knowledge of
another context transition to the JavaScript parser.                     the JavaScript statement parser.
   Another possible problem is the failure to account for                   An important question we empirically study in Section 4 is
transductions. For instance, in the above example, even if               characterizing the set of contexts security-conscious applica-
the server performs HTML entity encoding of dangerous                    tions use in practice and those contexts that web applications
characters (such as :) in the untrusted input, the browser may           aim to safeguard.
“undo” the encoding to execute the attack. For instance, the             Whitelisting vs. blacklisting. Several sanitizers aim to black-
attack string javascript&58; will execute script code in this            list sets of known attack strings. For instance, in SANER, the
example, because browsers HTML entity decode the &58; back               authors present examples of a blacklisting approach where the
to a : character before giving it to the URI parser.                     failure to account for browser variation or failure to recognize
   An important objective of our evaluation is to identify               dangerous non-terminals results in attacks (examples 2-5)[5].
whether built-in sanitizers in state-of-the-art web frameworks              Another approach to sanitization is whitelisting-based
handle static transitions well for the contexts in which they            canonicalization, which we observe is pervasively employed in
support embedding data.                                                  state-of-the-art web frameworks as well as HTML purification
Incomplete sanitization for dynamic context transitions.                 engines in use by web applications. The idea is to: (a) parse
JavaScript code execution can read untrusted data from the               untrusted data on the server within the context where it will
DOM and force evaluation or re-parsing of the data in a differ-          be embedded, generating a parse tree, (b) eliminate all but
ent context. Consider the example of a bug shown in Figure 2,            a whitelist of HTML elements in the parse tree, and (c) re-
which we found in PHPBB3, a popular forum application. The               encode the parse tree representation into a canonical HTML
form, the interpretation of which does not vary across web           sanitization from the rest of the web application’s output. We
browsers.                                                            first outline how the web application frameworks address this
   We empirically study what fraction of web applications and        challenge, and then put it in perspective with other techniques
web frameworks enable this form of sanitization. Previous            proposed in research.
research has not shown the insecurity of this mechanism,                Of all the frameworks we studied, four frameworks dis-
nor has research applied formal analysis to prove its security.      tinctly support a separation between HTML code output and
This mechanism stands in contrast to previous sanitization-          data — namely Django, GWT, Ctemplate and ClearSilver.
free defenses that assume browser variance is problematic for        While the others do encourage separation to some extent, they
a sanitization defense [59].                                         do not support templates that make the distinction explicit. A
                                                                     template is a document representing an HTML output of the
3. Web Frameworks                                                    application but with data holes placed throughout. A data hole
                                                                     is a location in a template filled by content that is not static
  We evaluate a set of popular web frameworks that covers            HTML. A data hole can be as simple as a variable or contain
most of the widely used web programming languages. Our               complicated application logic. This separation between static,
focus is on picking popular frameworks, especially those in          trusted content and potentially untrusted input allows these
commercial use.                                                      frameworks to conservatively auto-sanitize all the data holes.
                                                                        The separation makes the sanitization a default fail-close
3.1. Expressiveness                                                  design, i.e., even data that is trusted but not included in the
   We evaluated the set of contexts for which each framework         template will be treated by the engine as untrusted. The fact
supports sanitization. That is, for each context, we determine       that these systems are in pervasive commercial use suggests
whether the framework provides developers with a built-in            that the mechanism has had success thus far.
sanitizer sufficient to safely emit untrusted data into that            Much of the previous research on taint-tracking aims to
context. For contexts not natively supported, developers must        address the issue of distinguishing what to sanitize versus what
write their own sanitizer. The results of this analysis are          is HTML content. Tracking data dependencies only in taint-
presented in Table 4.                                                tracking can have false negatives [51]. Mechanisms deployed
   We observe that 6 out of 13 of the frameworks do not              in web frameworks coerce programs to restrictive form to err
support contexts other than the HTML tag content context             on the side of conservativeness. These offer a different point
(e.g., as the content body of a tag), HTML attributes and URI        of evaluation as compared to taint-based defenses. Security-
attributes. The most commonly supported sanitizers for these         typed languages such as JIF [15, 46, 57] also aim to take user
are HTML entity encoding and URI encoding, respectively,             annotation as a way to ensure this distinction. In comparison to
with customization features available.                               templating, both taint-tracking and type-based solutions offer
   Four web frameworks, ClearSilver, Ctemplate, Django, and          more expressive separation between content than a binary
Smarty, provide appropriate sanitization functions for emitting      metric (data and template).
untrusted data into a JavaScript string. Only 1 framework,
namely Google Ctemplate, provides a sanitizer for emitting           3.3. Support for Auto-Sanitization
data into JavaScript, outside of the string literal context. How-
ever, the sanitizer is a very restrictive whitelist, allowing only      Next, we evaluated the degree of support for automatic
numeric or boolean literals. Allowing untrusted JavaScript           sanitization in these frameworks. Of the 13 frameworks evalu-
code to be emitted into JavaScript contexts is not supported by      ated, seven support some form of automatic sanitization. These
any framework that we studied. Typically, code embedded in           appear in Table 5. Auto-sanitization is a feature that shifts the
such contexts is outside the scope of the safety property out-       burden of ensuring safety against XSS from the developers
lined in Section 2. Instead, properties such as authority safety     to the framework. Essentially, in a framework that includes
are desired [38], which are the target of other mechanisms           auto-sanitization, the application developer is responsible for
such as Yahoo’s ADsafe [2] or Google’s Caja [12].                    indicating which variables will require sanitization. The web
   Four web frameworks, namely Django, GWT, Ctemplate,               application framework is supposed to ensure that the correct
and Clearsilver, provide sanitizers for URI attributes in which      sanitizer is applied to each variable that fills a hole.
a complete URI (i.e., including the URI protocol scheme)
can be emitted. These sanitizers reject URLs that use the            3.3.1. Context-Insensitive Sanitization. Most of these frame-
javascript: scheme and accept only a whitelist of safe               works provide automatic sanitization only for HTML tag
schemes, like http:. The defense for static context transition       content contexts. For example, Django’s autoescape will
attacks outlined in Section 2.5 is correct in these frameworks.      not protect against untrusted input that is placed in the value
                                                                     of an href attribute:
3.2. Support for Identification of Untrusted Data                    <a href="{{ untrusted_link }}">Link supplied by user.</a>

  One of the reasons for XSS vulnerabilities in previous             {{untrusted_link}} is a template variable in a data hole, in this
systems has been failure to identify untrusted data that needs       case referring to an untrusted user input. In this case, the data
              Language                   Framework              HTML         URL          URL          JS String     JS Number    Style
                                                                             Attribute    Attribute                  or Boolean   Attribute
                                                                             (excluding   (including                              or Tag
                                                                             scheme)      scheme)
                                 Mason [1, 40]                  X            X
       Perl                      Template Toolkit [58]          X            X
                                 Jifty [32]                     X            X
                                 CakePHP [13]                   X            X
                                 Smarty Template Engine [54]    X            X                         X
       PHP                       Yii [29, 66]                   X            X
                                 Zend Framework [67]            X            X
                                 CodeIgniter [17, 18]           X            X
       VB, C#, C++, F#           ASP.NET [3]                    X            X
       Ruby                      Rails [47]                     X            X
       Python                    Django [20]                    X            X            X            X
       Java                      GWT SafeHtml [24]              X            X            X
       C++                       Ctemplate [19]                 X            X            X            X             X            X
       Language-neutral          ClearSilver [16]               X            X            X            X                          X

  TABLE 4. Set of manually-invocable sanitizers provided by languages and/or frameworks for various contexts. For
frameworks, we also include sanitizers provided by standard packages or modules for the language. We differentiate
   between a sanitizer for URL contexts that can correctly sanitize a complete URL (i.e., ensure it does not use the
javascript: scheme and one that need only concern itself with URLs for which the scheme is already set. For the
                                      latter, simple URI encoding is sufficient.


              Language              Framework,                        Automatically Sanitizes   Performs Context-     Pointcut
                                    Plugin, or Feature                in HTML Context           Aware Sanitization
              PHP                   CodeIgniter                       X                                               Request Reception
              VB, C#, C++, F#       ASP.NET                 Request   X                                               Request Reception
                                    Validation [4]
              Ruby                  xss terminate Rails plugin [64]   X                                               Database Insertion
              Python                Django                            X                                               Template Processing
              Java                  GWT SafeHtml                      X                         X                     Template Processing
              C++                   Ctemplate                         X                         X                     Template Processing
              Language-neutral      ClearSilver                       X                         X                     Template Processing

     TABLE 5. Extent of automatic sanitization support in various frameworks and pointcut where the automatic
                                                sanitization occurs.



hole is simply a variable that happens to refer to user input.                    The above case is interesting for two reasons. First, we
The double bracket notation for data holes is common in many                   notice that the developer chose not to rely on auto-sanitization
of the frameworks we examine. This untrusted link can contain                  for the header.url variable, manually escaping it instead.
a javascript: URL, which enables a cross-site scripting                        Unfortunately, escape is the wrong sanitizer; it merely
attack. Django’s autoescape correctly handles only HTML                        HTML entity encodes the value resulting in an XSS vulnera-
contexts.                                                                      bility via the javascript: URI vector. The second interesting
   A plugin for Rails called xss-terminate automatically re-                   point is that had the developer relied on the auto-sanitization
moves (or escapes, depending on its configuration) tags before                 mechanism, the automatically applied sanitizer would have
content is persisted to the database. This suffers from the                    been wrong as well.
same problem as Django; it does nothing to prevent vul-                           Consider another example taken from the Malaysia Crime
nerabilities in which untrusted content is included in other                   application, authored in the Django framework:
contexts. Similarly, CodeIgniter’s automatic sanitization uses                 map.addOverlay(new GMarker(point, {{ crime.icon }}))
its xss_clean function in a context-insensitive manner.
Context-insensitive Sanitization is inadequate. Context-                       The crime.icon variable is filled in at runtime as an argument to
insensitive sanitization provides a false sense of security                    a JavaScript function call. Clearly, the auto-sanitization in this
to developers. For example, the Django framework ap-                           case performs an inconsistent sanitization, and if the developer
plies the HTML entity escape to all untrusted data in a                        relied on it, an XSS bug would result; additional dangerous
context-insensitive way. Consider the following code from the                  characters (including \n \r \ ;) can be used to break out of the
GRAMPS application authored on Django:                                         context into which crime.icon is emitted. In this case, the
                                                                               incorrect sanitization did not lead to a vulnerability because
  {% if header.sortable %}
  <a href="{{ header.url|escape }}">                                           crime.icon was explicitly sanitized (against a whitelist of
  {% endif %}                                                                  acceptable strings) at the time of input.
   We conclude that context-insensitive sanitization is inade-       instead of just {{NAME}}. For the second hole, {{URL}},
quate. Developers using context-insensitive sanitization must        the :url_escape_with_arg=html modifier is applied
implement their own sanitizers to ensure security anyway. To         indicating that the data hole is in a URL context and should be
verify this, we investigated how often sites rely on Django’s        sanitized appropriately. Finally, the :html_escape modifier
auto-sanitization and for what fraction of the incorrectly auto-     is automatically applied to the value of {{PAGENAME}}
sanitized sinks the developer resorted to manual sanitization.       before the third hole is filled, indicating that the data hole
   We examined a random sample of 10 Django applications             is in an HTML context and variables should be HTML entity
(from a list of open-source Django applications [21]) to             encoded.
determine the fraction of variables emitted into an application’s    Handling Nested Contexts or Static Context Transitions.
templates that are protected by Django’s autoescape. Our             Support for nested contexts varies significantly, as shown in
results are presented in Table 6.                                    Table 4. The Google Ctemplate framework offers sanitiza-
   In all the applications in our sample, the majority of variable   tion for the maximum number of contexts, including some
sinks were autoescaped. Though the majority of variables are         of those that involve implicit static transition contexts. The
emitted into HTML tag content contexts, and are therefore
                                                                     HTML attribute context (e.g., href, style, onclick) is a
protected by autoescape, a significant fraction are not.             transition context as defined in section 2, i.e., certain attributes
Table 6 further distinguishes the fraction of sinks appearing        are recognized as URI attributes. JavaScript event handlers
in HTML tag content context versus others. In all contexts
                                                                     or style attributes are examples of these. Most of the other
other than the HTML tag content context, inconsistent (and           frameworks do not support any nesting of contexts.
technically incorrect) sanitization is applied, which can lead
to XSS vulnerabilities. Our subsequent manual investigation of       Handling Dynamic Context Transitions. None of the web
all these cases revealed that the developer explicitly resorted      frameworks support sanitization for dynamic context transfers.
to manual sanitization.                                              That is, they do not identify potential context transfers due
                                                                     to the execution of JavaScript for auto-sanitization. Even the
3.3.2. Context-Sensitive Sanitization. Three web frame-              cases that can be dispatched with simple static analyses are
works, namely GWT, Clearsilver, and Ctemplate, support               not handled, such as in the following example
context-sensitive automatic sanitization. As in the other frame-     <script>
works, when each template is emitted to the output, the              document.write("<div> {{ untrusted_data }} </div>");
platform automatically sanitizes the data embedded in template       </script>
data holes. However, in these frameworks, the context for each
hole is inferred as the template is parsed, and the sanitizer to     3.4. Sanitization Strategy: Blacklists vs. Whitelists
apply is selected based on the context of the data hole in
the template. Thus, a sanitizer is automatically applied to a            One web framework we studied employs a blacklist-based
variable in a data hole based on its context in the document.        sanitization approach. CodeIgniter employs a blacklist of
  For example, consider the following simple Ctemplate tem-          filters in its xss clean function, which applies several reg-
plate:                                                               ular expression replacements in sequence. These regular ex-
{{%AUTOESCAPE context="HTML"}}                                       pressions serve to blacklist potentially dangerous code that
<html><body>
<script>                                                             may appear in any context. For example, all instances of
function showName() {                                                document.cookie are replaced with the text [removed].
  document.getElementById("namespan").textContent = \                Unfortunately, this blacklisting approach inspires little confi-
    "Name: " + "{{NAME}}";
}                                                                    dence in the completeness of the filter. Additionally, it may
</script>                                                            break functionality because it essentially applies each context’s
<span id="namespan" onclick="showName()">                            filter regardless of which context the data will ultimately
  Click to display name.
</span><br/>                                                         appear in. This means, for example, that any occurrence of
Homepage:                                                            the term document.cookie will be removed, even if it
<a href="{{URL}}"> {{PAGENAME}} </a>                                 is simply in the body of a user’s forum post, and therefore
</body></html>
                                                                     intended to be placed in an HTML context.
    This template contains three separate data holes in which            Other than CodeIgniter, all frameworks used a whitelisting-
values of variables will be emitted. When the template is pro-       based canonicalization approach described in Section 2. For
cessed, the context of the first hole, {{NAME}}, is recognized       HTML tag contexts, basic HTML entity encoding was sup-
as a JavaScript string context, and just before the hole is          ported in all frameworks. In addition, we found more com-
filled with the value of NAME, the :javascript_escape                prehensive handling of HTML contexts in a number of other
modifier will be applied to the variable. This modifier in-          frameworks. For instance, Yii provides an interface to HTML
dicates to the template parser that the JavaScript escape            Purifier [29] and its documentation recommends this interface
sanitizer should be applied to variables in this data hole           as the preferred XSS defense mechanism. HTML Purifier fully
before variable substitution. This auto-escaping is equiva-          parses an HTML snippet, and it claims to remove arbitrarily
lent to explicitly writing {{NAME:javascript_escape}}                nested scripts in HTML tag content contexts. While it robustly
      Web Application     Num.         % Auto-     % Sinks     % Sinks     %          % Sinks     % Sinks      % Sinks    % Sinks      % Sinks
                          Sinks        sanitized   not         man-        Sinks in   in URL      in URL       in    JS   in     JS    in Style
                                       Sinks       sanitized   ually       HTML       Attr.       Attr. (in-   Attr.      Num-         Attr.
                                                   (marked     sanitized   Context    (ex-        cluding      Context    ber/String   Context
                                                   safe)                              cluding     scheme)                 Context
                                                                                      scheme)
      GRAMPS                  286          77.9         0.0        22.0        66.4         3.4        30.0         0.0        0.0          0.0
      Genealogy
      Management
      HicroKee’s Blog             92       83.6         7.6         8.6        83.6        6.5          7.6         1.0        0.0          1.0
      FabioSouto.eu               55       90.9         9.0         0.0        67.2        7.2         23.6         0.0        1.8          0.0
      Phillip    Jones’           94       92.5         7.4         0.0        73.4       11.7         12.7         0.0        2.1          0.0
      Eportfolio
      EAG cms                  19          94.7         5.2         0.0        84.2        0.0          5.2         0.0        0.0         10.5
      Boycott Toolkit         347          96.2         3.4         0.2        71.7        1.1         25.3         0.0        1.7          0.0
      Damned Lies             359          96.6         3.3         0.0        74.6        0.5         17.8         0.0        0.2          6.6
      oebfare                 149          97.3         2.6         0.0        85.2        6.0          8.0         0.0        0.0          0.6
      Malaysia Crime          235          98.7         1.2         0.0        77.8        0.0          1.7         0.0       20.4          0.0
      Philippe                 13         100.0         0.0         0.0        84.6        0.0         15.3         0.0        0.0          0.0
      Marichal’s web
      site

TABLE 6. Actual usage of auto-sanitization in Django applications. The first two columns are the number of sinks in
  the templates and the percentage of these sinks for which auto-sanitization has not been disabled. Each of the
               remaining columns shows the percentage of sinks that appear in the given context.



handles untrusted data emitted into an HTML tag content                     (which is not sanitized) does not match any stored username
context, it does not provide functionality for emitting untrusted           (all of which have been sanitized). As in the request reception
data into any other contexts.                                               pointcut, this problem results from a lack of knowledge
                                                                            regarding where the untrusted data will end up being used.
3.5. Placement of Sanitizers                                                In this case, its correct use in a comparison is precluded by
                                                                            being sanitized before database insertion.
    Finally, we find that for frameworks that support auto-                 Template processing. Sanitizing at template processing time
sanitization, there are variations in where to apply the san-               has the advantage of being fail-safe because every output
itizers. Borrowing terminology from aspect-oriented program-                is sanitized by default. The disadvantage of this pointcut
ming, we refer to each set of program points at which auto-                 is very much the inverse of that of the request reception
sanitization is applied as a sanitization pointcut. We have iden-           pointcut: at template processing time, the separation between
tified three different sanitization pointcuts in the frameworks             untrusted and trusted data might have been lost. You cannot
we studied; Table 5 indicates which one is employed by each                 tell at this pointcut whether the data is trusted or untrusted.
framework.                                                                  For this reason, some variables may accidentally be escaped
Request reception. Sanitizing at request reception has the                  multiple times, which could break functionality. The developer
advantage of precisely identifying all untrusted data. However,             is responsible for manually marking the pieces of data that
the disadvantage is that at this pointcut, there is no knowledge            should be considered trusted, which is an inconvenient and
of where this untrusted data is going to end up. This makes it              error-prone process, though the errors do fall on the side of
impossible to apply the least restrictive safe sanitization policy;         breaking functionality rather than security.
instead you must apply an extremely restrictive sanitization
policy under the assumption that the untrusted data could end               4. Web Applications
up being emitted into any context.
Database insertion. Sanitizing at database insertion time                      We evaluate a set of large, widely used web applications
ensures that no unsafe data is ever stored. Accordingly, this               to compare the features provided by web frameworks with
pointcut does not protect against reflected XSS vulnerabilities,            those required for authoring real-world applications. We gather
but only stored XSS vulnerabilities (and SQL injection vulner-              empirical evidence from 8 diverse web applications, ranging
abilities, which we do not consider in the present work). We                from email clients to medical record management systems,
have anecdotal evidence that this pointcut can lead to subtle               about their use of embedded contexts and sanitizers. First, we
bugs. In a program that we analyzed, all data was sanitized                 evaluate whether applications use contexts that are inherently
before entering the database. This meant that when a user                   difficult to secure (as outlined in Section 2.5). Second, we
registered for the web site, his username was escaped before                compare the set of contexts used by applications with the set
being stored. For a user whose name contains a character that               of contexts supported by web frameworks. Third, we evaluate
is escaped, all login attempts fail because the username entered            whether these applications employ whitelisting or blacklisting
 Application           Description            LOC     HTML      URL           URL          JS Attr.   JS Num-      Number     Number
                                                      Context   Attr.         Attr. (in-   Context    ber/String   of Sani-   of Sinks
                                                                (ex-          cluding                 Context      tizers
                                                                cluding       scheme)
                                                                scheme)
 RoundCube         IMAP Email Client         19,038      •          •             •           •          •              30         75
   Drupal      Content Management System     20,995      •          •             •           •          •              32       2557
   Joomla      Content Management System     75,785      •          •             •           •                         22        538
 WordPress        Blogging Application       89,504      •          •             •           •                         95       2572
 MediaWiki      Wiki Hosting Application    125,608      •          •             •           •          •             118        352
  PHPBB3         Bulletin Board Software    146,991      •          •             •           •          •              19        265
 OpenEMR       Medical Records Management   150,384      •                                    •          •              18        727
  Moodle           E-Learning Software      532,359      •          •             •           •          •              43       6282

   TABLE 7. Details of the web applications we study and details on various contexts used by these applications.



based sanitizers. Finally, we evaluate whether the level of             (b) identifies all uses of GET, POST, and COOKIE input
expressiveness supported by web frameworks is sufficient to             parameters, and (c) re-executes each file with random values
enforce the sanitization policy that applications presently use.        for the newly identified inputs found in step (b). PHP func-
                                                                        tionality that was not properly explored using this mechanism
4.1. Subject Applications & Analysis Infrastructure                     was subject to addition manual interaction as well. We found
                                                                        a large number of distinct sinks containing untrusted data in
   Systematically studying large code bases requires an auto-           our analysis, which we summarize in Table 7.
matic analysis infrastructure. To limit our effort in building          Extracting Sanitizers. Using dynamic analysis, we identify
analysis infrastructure, we decided to focus on one language,           sets of sanitizers in web applications. We check the input and
namely PHP. We chose PHP because it is a popular web                    output of each function call that an application makes in a
application language with over 20 million domains running               dynamic run. We use Definition 2 in Section 2.3 to identify
PHP applications [45].                                                  sanitizer functions, and we identify sanitizers that provide
   Our smallest subject application was over 19,000 lines of            HTML context chain safety, as per Definition 4.
PHP code, while the largest was over half a million lines                  For each dynamically executed path in the application, we
of code. Several of these applications, including PHPBB,                extract all of the called functions with at least one string
WordPress and MediaWiki have been studied in previous                   argument. We fork execution of the PHP engine, replacing
research evaluations. Finally, we believe that these applications       the string arguments with an XSS attack vector known to
are widely used — for instance, MediaWiki is the framework              cause JavaScript execution in a large number of HTML
behind Wikipedia.                                                       contexts [25]. The modified PHP engine logs the argument
Analysis of PHP applications. We describe the analysis                  values and the return values for all such function calls.
infrastructure we build for systematically studying PHP appli-             From these logs, we extract all the function calls that both
cations. It provides two primary features: automatic extraction         took an attack vector as an argument and returned a string.
of sanitizers (as defined by Definition 2 in Section 2) and             By Definition 2, these functions are sanitizers. However, we
inference of contexts in which untrusted data is embedded by            want to approximate the fact that these are sanitizers that
applications.                                                           provide HTML context chain safety as per Definition 4. Thus,
   PHP is a highly dynamic, interpreted language. PHP has               we pass the return values of the sanitizers through an edit
dynamic types, dynamically dispatched functions, invocations            distance algorithm, comparing the attack vector string to the
through dynamic arrays, and variable argument functions,                function’s return value. We negate the effects of standard
which are challenging for static analysis. Notably, Facebook’s          encoding functions like htmlentities before running the edit
HipHop PHP compiler and analyzer provides a level of type               distance algorithm. If the edit distance is small, we mark the
inference support [26], but the analysis is generally imprecise,        function as a sanitizer. While there are pathological cases in
unable to infer types across function calls. Though previous            which our algorithm would fail, we manually evaluated the
research has had success in automatic extraction of sanitizers          output of the algorithm for Wordpress and MediaWiki and
in statically typed languages [37], these are not directly usable       found that the algorithm had very few false positives. At worst,
in our study of PHP because they operate on the assumption of           the number of sanitizers we find is an undercount of the actual
having (a priori) inter-procedural dataflow graphs. As a result,        number of sanitizers in the web application.
our entire analysis infrastructure relies on dynamic analysis.          Context Inference. Our aim is to identify the context in
   To drive the analysis infrastructure, we used a combination          which an untrusted input was embedded. To define untrusted
of automated blackbox fuzzing and manual interaction with               data, we use the intuition that sanitized input data is very
the applications. Specifically, we built a PHP fuzzer that (a)          likely untrusted. Taking the list of extracted sanitizers for a
systematically invokes all the PHP files in each application,           particular web application, we instrument the sanitizers in the
application to surround untrusted data with a special identifier     4.3. Evaluating Usage of Contexts
markup. We feed all GET, POST and COOKIE inputs a
specific key string, so that the instrumentation in the sanitizers      As Table 7 shows, the various output contexts where we
can distinguish untrusted inputs from other internal data. We        observed untrusted user input is fairly small. For instance, in
use techniques similar to taint-inference [52] to identify where     MediaWiki, a user may create or edit a wiki entry. Their new
untrusted inputs are embedded in output. Finally, we log all         text passes through sanitizers and a database but eventually
web application output for context inference.                        flows to the HTML context of the output in that particular wiki
   We use a modified Python HTML5 parser to parse the                article. Thus, in the table, the “HTML” column is marked for
application output. While parsing, we search all contexts for        MediaWiki because it allows untrusted content in the HTML
the special identifying markup. When found, we record the            tag content context.
context the parser is in. We repeat this until the document             The listed contexts are as follows:
is completely parsed. When it is finished, we have a list of            • HTML tag content: The basic HTML content context
all contexts where the key string appeared as well as which                between two tags. Note, however, that this does not
sanitizers it went through. We present the contexts we found               include the content between script tags. Content between
in Table 7.                                                                script tags is a separate JavaScript context because the
                                                                           JavaScript, not HTML, parser is applied to it
                                                                        • URL: A context where a URL is expected, such as an
4.2. Evaluating Sanitization Practices                                     anchor tag href attribute or an image tag src attribute.
                                                                           This also includes the document schema.
                                                                        • JS String: A JavaScript context where data appears within
   We manually evaluated whether these applications predomi-               a quoted JavaScript string. For example, if the program
nantly use whitelisting sanitizers or blacklisting. Note that our          places a user name inside a JavaScript string to add to a
goal is not to check whether sanitizers in these applications              DOM text node.
were correct, but only to illustrate what security-conscious            • Attr: A non-URL HTML attribute context, such as the
applications are employing as a defense strategy.                          name attribute or the alt attribute.
   We observed that the number of sanitizers varied from 18
                                                                     Evaluation Summary.
to 119, which is much larger than the number of contexts we
                                                                        To the extent of our analysis, we find that the set of contexts
encountered. On inspection, we did not find any duplication –
                                                                     in use by web applications matches well with the expres-
this implies that applications have multiple sanitizers applied
                                                                     siveness supported by the most expressive web frameworks
even for the same contexts. We characterize this variation in
                                                                     and previous research [59]. This implies that, in principle if
sanitizer choice in Section 4.4.
                                                                     the Ctemplate framework were available for PHP, its context
   To the extent of our analysis, we observe that the common         support would be empirically sufficient for all the applications
pattern of sanitization in the PHP applications is the whitelist     we study.
based canonicalization policy that we discussed previously.             Another interesting point is that applications do not emit
The applications commonly allow only a whitelist of context-         data in HTML contexts that are inherently hard to secure.
specific syntactic constructs.                                       For example, we did not find any untrusted content flows
Example 1 WordPress allows fairly expressive HTML con-               to the general, non-string JavaScript context. Similarly, all
structs in untrusted user content. Users can place comments on       the applications refrained from embedding untrusted data in
blog posts, and these comments can contain some HTML tags            unquoted HTML attributes, which are hard to sanitize due to
with HTML tag attributes for a more rich editing experience.         browser variation and a large set of attack vectors.
Of course, WordPress applies a variety of sanitizers to this
content to ensure its safety.                                        4.4. Evaluating Expressiveness of Sanitization Poli-
   However, WordPress’s sanitizers are a set of filters that take    cies
a whitelist of allowed tags, attributes, protocols, or a number
of other options depending on the sanitization context, and             As we observe in Table 7, there is more than one sanitizer
ensure that nothing off the whitelist is syntactically present.      for each embedding context. This implies that each web
These filters are sufficient for WordPress, and we see similar       application may sanitize different fragments of untrusted data
implementations in the other applications.                           in a different way based on its security policy. This notion of
                                                                     “picking a sanitizer” for each fragment of untrusted data before
Evaluation Summary. We find that primarily all of the                outputting it to the HTTP response is what we formulate as a
applications use a whitelisting-based canonicalization strategy      sanitization policy function below.
for the HTML tag context, as discussed earlier in Section 2.5.          Definition 5: (Sanitization Policy Function) The applica-
For instance, we find that the kses library used in WordPress        tion’s sanitization policy function ψ is an n-ary function
and Drupal, the HTMLPurifier library used in Moodle and the
PHPInputFilter library used in Joomla all employ this strategy.                         ψ : (I1 , I2 , . . . In ) → S ∗
where S is the set of sanitizers in the application and I1 , . . . , In   Evaluation Summary. We find that sanitization policy func-
are application-specific policy attributes.                               tions are implicit in today’s web application code. Specifically,
   Note that the sanitization policy function returns an ordered          we found that for many applications, sanitizer selection is more
list of sanitizers to apply, and could even return with an empty          complex than simply looking at the syntactic HTML context,
list.                                                                     which is the functionality of the default auto-sanitization
   One of our goals is to identify what the policy attributes are         protections enabled in those web frameworks that support
for real applications, how much they vary across applications             context-sensitive auto-sanitization. This implies that the sani-
and how complex they may be. We argue that the larger the                 tization policy functions are definitely beyond 0-ary functions
n, the more complex the decision for picking a sanitizer.                 (as context-insensitive auto-sanitization assumes), or unary
   We find that an application’s sanitization policy can be very          functions (as assumed by context-sensitive auto-sanitization).
complex. Specifically, how an application selects a sanitizer                We have found several variations in policy functions in
can be more complex than simply looking at the syntactic                  implicit use by these applications. One common sanitization
context. This real-world example from the Drupal application              policy attribute observed is that of role-based sanitization,
illustrates the complexity.                                               where the application applies different sanity checks based on
                                                                          the privilege of the content. Drupal’s variations in sanitizers
Example 2 In the content management system Drupal, one                    applied based on the user’s role is perhaps an extreme. Other
of the default behaviors is the ability to post and reply to              simpler policies we observe are where the site administrator’s
comments on a page. By default, any logged in user can do                 content is not subject to sanitization (by design), as in the case
this, but one may enable it for “anonymous” (not logged in)               of PHPBB3. For such simple policies, there are legitimate code
users as well.                                                            paths which have no sanitization requirements.
   When the user creates or replies to a post, the application               Sanitization policies have a direct impact on the security
presents a choice of HTML filters to apply to their post. The             offered by web frameworks. If a framework does not recognize
set of roles assigned to a user by the system administrator               and support the intended security model of the application, it
determines the choice of filters presented to the user. By                cannot ensure that the sanitization is consistently applied in the
default, “authenticated user” is the sole role of a logged in             application. Presently, this represents a gap between the ex-
user, but the administrator may assign an arbitrary number of             pressiveness of the abstractions supported by web frameworks
roles. Similarly, the program assigns the “anonymous user”                and what web applications require and implement.
role to anonymous users.
   An administrator may assign HTML filters to each role.                 5. Results and Findings
By default, the “authenticated user” role is only assigned
the “Full HTML” filter that filters out all HTML control                     In this study, we characterized the nature of XSS sanitiza-
structures. However, the administrator can create arbitrary               tion. Using a formal notion of XSS sanitization allowed us
HTML filter policies and assign them to various roles. Thus,              to systematically investigate and contrast the nature of XSS
the administrator can apply the “Full HTML” filter to all users           sanitization in applications and frameworks. The following are
by default, but explicitly allow trusted users to post comments           some of our key findings:
with links in HTML anchor tags. The administrator is not                     1) Only 3 out of the 13 frameworks studied support all the
governed by roles and is always allowed to post arbitrary                        contexts that complex web applications employ (Tables
HTML.Thus, when a logged in user is posting a comment                            4 and 7).
or a reply, a different sanitization function may be applied                 2) Many existing frameworks that provide auto-sanitization
to her post based on her role. If she is an administrator, the                   perform context-insensitive sanitization. With multiple
program will not apply a filter, but if she is in a different role,              examples, we demonstrated that context-insensitive san-
the program may apply a restrictive filter.                                      itization can give a false sense of security. We also find
   Thus, context alone does not define the arity of the sanitiza-                that replacing auto-sanitization with the use of a manual
tion function policy. In this case, the role of the logged-in user               sanitizer is not uncommon.
increases the arity. That is, not just the context determines the            3) Newer frameworks support simple templating mecha-
sanitizer to apply (a comment or reply HTML context in this                      nisms for identifying untrusted data, defaulting to a
case) but also on the user’s role.                                               fail-closed design. Such mechanisms put the burden of
   However, in this instance, it is even more complicated,                       trusted data identification on the developer.
because the user may select any of the valid filters assigned                4) We find that context-sensitive sanitization is the norm
by her roles. For example, if the user is both a trusted user                    across complex web applications.
for posting links and, separately, a trusted user for posting                5) Across frameworks and applications, the approach to
images, she may choose which filter (either the link or                          sanitization generally adopted is whitelisting. Develop-
image filter) applies to her post. Therefore, the arity of the                   ers identified a subset of HTML that is sufficiently
Drupal sanitization function policy again increases because                      expressive for their needs. Variance in browser imple-
user selection is also a deciding factor in sanitization function                mentation does not seem to be a factor in any of the
application.                                                                     sanitizers we observed.
   6) Many web applications employ a set of sanitizers much         language-based solutions for customizable XSS security poli-
       larger that the set of contexts they support.                cies are also an area of active research [41]. Research shows
   7) We also find that the decision to pick a sanitizer is not     that cross-site scripting attacks sometimes results from unsafe
       a simple zero- or single-arity function; fine grained data   parsing of CSS [30], optimistic content-sniffing algorithms
       attributes (e.g., is the source of the data an administra-   in browsers [7], and from vulnerabilities in extensions [6,
       tor?) along with application configuration often dictate     9]. Failure to isolate mashups and advertisements may also
       the sanitizer picked for a particular flow.                  result in code injection vulnerabilities, but typically the safety
   8) None of the web frameworks we studied support the             properties that these attacks violate are treated as a separate
       complex sanitization policies we observed in real world      class From XSS vulnerabilities. These violated properties
       web applications.                                            include isolation of principles in web browser primitives [61],
   It is not clear to us why such a large number of sanitizer       authority safety [38] and statically verified containment [22].
functions are employed by web applications. We conjecture              BEEP, DSI and NonceSpaces investigated client-server col-
that in the absence of easy correctness arguments for sanitizers,   laborative defenses. In these proposals, the server is respon-
applications err on the side of caution. Simple and practical       sible for identifying untrusted data which it reports to the
mechanisms for correctness guarantees of sanitizers and sani-       browser, and a modified browser ensures that XSS attacks
tizer policies deserve research attention. The complete absence     can not result from parsing the untrusted data. While these
of support for complex multi-arity sanitizer policy in frame-       proposals are encouraging, they require updates in browser
works was also salient. We believe that the next generation of      implementations as well as server-side code. The closest prac-
frameworks need to address this issue to achieve adoption by        tical implementation of such client-server defense architecture
complex web applications — our notion of sanitization policy        is the recent content security policy specification [55].
function is one possible abstraction that newer frameworks          Correctness of Sanitization. While several systems have
could employ.                                                       analyzed server-side code, the SANER [5] system empirically
                                                                    showed that custom sanitization routines in web applications
6. Related Work                                                     can be error-prone. FLAX [49] and KUDZU [48] empirically
                                                                    showed that sanitization errors are not uncommon in client-
  Cross-site scripting defense techniques have received a great     side JavaScript code. While these works highlight exam-
deal of attention in research.                                      ples, the complexity of the sanitization process remained
                                                                    unexplained. Our observation is that sanitization is perva-
XSS Analysis and Defense. Much of the research on cross-
                                                                    sively used in emerging web frameworks as well as large,
site scripting vulnerabilities has focused on finding XSS flaws
                                                                    security-conscious applications. We discuss whether applica-
in web applications, specifically on server-side code [5, 31,
                                                                    tions should use sanitization for defense in light of previous
33, 35, 36, 39, 43, 63, 65] but also more recently on JavaScript
                                                                    bugs.
code [6, 23, 48, 49]. These works have underscored the two
main causes of XSS vulnerabilities: identifying untrusted data         Among server-side defenses, BLUEPRINT provided a
at output and errors in sanitization by applications. There         sanitization-free strategy for preventing cross-site scripting at-
have been three kinds of defenses: purely server-side, purely       tacks, which involved the explicit construction of the intended
browser-based, and those involving both client and server           parse tree in the browser via JavaScript. We observe that
collaboration.                                                      sanitization-free mechanisms stand in contrast to whitelist-
   BLUEPRINT [59], SCRIPTGARD [50] and XSS-                         based canonicalization sanitization which is what is generally
GUARD [11] are two server-side solutions that have provided         implemented in emerging frameworks, the security of which
insight into context-sensitive sanitization. In particular,         has neither been fundamentally broken nor proven. Research
BLUEPRINT provides a deeper model of the web browser                on string analysis and other automata-based verification sys-
and points to paths between the browser components may              tems is currently active, and this research is directly relevant
vary across browsers. The browser model detailed in this            to these questions [27, 34, 48].
work builds upon BLUEPRINT’s model and more closely                 Techniques for Separating Untrusted Content. Taint-
upon SCRIPTGARD’s formalization. We provide additional              tracking based techniques aimed to address the problem of
details in our model to demystify the browser’s parsing             identifying and separating untrusted data from HTML output
behavior and explain subtleties in sanitization which the prior     to ensure that untrusted data gets sanitized before it is out-
work did not address.                                               put [14, 33, 43, 51, 60, 65]. Challenges in implementing taint-
   Purely browser-based solutions, such as XSSAuditor, and          analysis as well as performance overheads have precluded their
client-only solutions, such as DSI, are implemented in modern       use in deployed web applications. Security-typed languages
browsers. These mechanisms are useful in nullifying common          and type-systems offer another mechanism to ensure the robust
attack scenarios by observing HTTP requests and intercepting        isolation of untrusted data from HTML code output [15, 46, 53,
HTTP responses during the browser’s parsing. However, they          57]. The generality of type systems allows for creating a finer
do not address the problem of separating untrusted from             separation between untrusted inputs, a property we motivate
trusted data, as pointed out by Barth et al. [10]. Other            with our empirical analysis. HTML templating engines, such
as those studied in this work, offer a different model in                           [24] Google Web Toolkit: Developer’s Guide – SafeHtml. http://code.google.
which they coerce developers into explicitly specifying trusted                          com/webtoolkit/doc/latest/DevGuideSecuritySafeHtml.html.
                                                                                    [25] G. Heyes. One vector to rule them all. http://www.thespanner.co.uk/
content. This offers a fail-closed design and has seen adoption                          2010/09/15/one-vector-to-rule-them-all.
in practice because of its ease of use.                                             [26] HipHop for PHP. http://github.com/facebook/hiphop-php/wiki.
                                                                                    [27] P. Hooimeijer and W. Weimer. A decision procedure for subset
                                                                                         constraints over regular languages. In ACM SIGPLAN Conference on
References                                                                               Programming Language Design and Implementation (PLDI), pages 188–
                                                                                         198, June 2009.
                                                                                    [28] PHP Manual : html entity decode. http://php.net/manual/en/function.
 [1] G. Aas. CPAN: URI::Escape. http://search.cpan.org/∼ gaas/URI-1.56/                  html-entity-decode.php.
     URI/Escape.pm.                                                                 [29] HTML Purifier : Standards-Compliant HTML Filtering.                 http://
 [2] Adsafe : Making javascript safe for advertising. http://www.adsafe.org/.            htmlpurifier.org/.
 [3] How To: Prevent Cross-Site Scripting in ASP.NET. http://msdn.                  [30] L.-S. Huang, Z. Weinberg, C. Evans, and C. Jackson. Protecting
     microsoft.com/en-us/library/ff649310.aspx.                                          browsers from cross-origin css attacks. In ACM Conference on Computer
 [4] Microsoft ASP.NET: Request Validation – Preventing Script Attacks.                  and Communications Security, 2010.
     http://www.asp.net/LEARN/whitepapers/request-validation.                       [31] Y.-W. Huang, F. Yu, C. Hang, C.-H. Tsai, D.-T. Lee, and S.-Y. Kuo.
 [5] D. Balzarotti, M. Cova, V. Felmetsger, N. Jovanovic, E. Kirda,                      Securing web application code by static analysis and runtime protection.
     C. Kruegel, and G. Vigna. Saner: Composing Static and Dynamic                       In Proceedings of the 13th international conference on World Wide Web,
     Analysis to Validate Sanitization in Web Applications. In Proceedings               WWW ’04, pages 40–52, New York, NY, USA, 2004. ACM.
     of the IEEE Symposium on Security and Privacy, Oakland, CA, May                [32] JiftyManual. http://jifty.org/view/JiftyManual.
     2008.                                                                          [33] N. Jovanovic, C. Krügel, and E. Kirda. Pixy: A static analysis tool
 [6] S. Bandhakavi, S. T. King, P. Madhusudan, and M. Winslett. Vex:                     for detecting web application vulnerabilities (short paper). In IEEE
     Vetting browser extensions for security vulnerabilities, 2010.                      Symposium on Security and Privacy, 2006.
 [7] A. Barth, J. Caballero, and D. Song. Secure content sniffing for               [34] A. Kieżun, V. Ganesh, P. J. Guo, P. Hooimeijer, and M. D. Ernst.
     web browsers, or how to stop papers from reviewing themselves. In                   HAMPI: A solver for string constraints. In International Symposium
     Proceedings of the 30th IEEE Symposium on Security and Privacy, pages               on Software Testing and Analysis, 2009.
     360–371, Washington, DC, USA, 2009. IEEE Computer Society.                     [35] B. Livshits and M. S. Lam. Finding security errors in Java programs
 [8] A. Barth, A. P. Felt, P. Saxena, and A. Boodman. Protecting browsers                with static analysis. In Proceedings of the Usenix Security Symposium,
     from extension vulnerabilities, 2009.                                               2005.
 [9] A. Barth, A. P. Felt, P. Saxena, and A. Boodman. Protecting browsers           [36] B. Livshits, M. Martin, and M. S. Lam. SecuriFly: Runtime protection
     from extension vulnerabilities, 2010.                                               and recovery from Web application vulnerabilities. Technical report,
[10] D. Bates, A. Barth, and C. Jackson. Regular expressions considered                  Stanford University, Sept. 2006.
     harmful in client-side xss filters. In Proceedings of the 19th international   [37] B. Livshits, A. Nori, S. Rajamani, and A. Banerjee. Merlin: Specification
     conference on World wide web, WWW ’10, pages 91–100, New York,                      inference for explicit information flow problems. In ACM SIGPLAN
     NY, USA, 2010. ACM.                                                                 Conference on Programming Language Design and Implementation
[11] P. Bisht and V. N. Venkatakrishnan. Xss-guard: Precise dynamic                      (PLDI), June 2009.
     prevention of cross-site scripting attacks. In Proceedings of the 5th          [38] S. Maffeis, J. C. Mitchell, and A. Taly. Object capabilities and isolation
     international conference on Detection of Intrusions and Malware, and                of untrusted web applications. In Proceedings of the 2010 IEEE
     Vulnerability Assessment, DIMVA ’08, pages 23–43, Berlin, Heidelberg,               Symposium on Security and Privacy, pages 125–140, Washington, DC,
     2008. Springer-Verlag.                                                              USA, 2010. IEEE Computer Society.
[12] google-caja a source-to-source translator for securing javascript-based        [39] M. Martin and M. S. Lam. Automatic generation of XSS and SQL
     web content. http://code.google.com/p/google-caja/.                                 injection attacks with goal-directed model checking. In 17th USENIX
[13] CakePHP: Sanitize Class Info. http://api.cakephp.org/class/sanitize.                Security Symposium, 2008.
[14] E. Chin and D. Wagner. Efficient character-level taint tracking for java.      [40] The Mason Book: Escaping Substitutions. http://www.masonbook.com/
     In Proceedings of the 2009 ACM workshop on Secure web services,                     book/chapter-2.mhtml.
     SWS ’09, pages 3–12, New York, NY, USA, 2009. ACM.                             [41] L. Meyerovich and B. Livshits. ConScript: Specifying and enforcing
[15] S. Chong, J. Liu, A. C. Myers, X. Qi, K. Vikram, L. Zheng, and                      fine-grained security policies for JavaScript in the browser. In IEEE
     X. Zheng. Secure web applications via automatic partitioning. In                    Symposium on Security and Privacy, May 2010.
     Proceedings of twenty-first ACM SIGOPS Symposium on Operating                  [42] Y. Nadji, P. Saxena, and D. Song. Document structure integrity: A robust
     systems principles, pages 31–44, New York, NY, USA, 2007. ACM.                      basis for cross-site scripting defense. Proceedings of the 16th Network
[16] ClearSilver: Template Filters.         http://www.clearsilver.net/docs/man          and Distributed System Security Symposium, 2009.
     filters.hdf.                                                                   [43] A. Nguyen-Tuong, S. Guarnieri, D. Greene, J. Shirley, and D. Evans.
[17] CodeIgniter/system/libraries/Security.php. http://bitbucket.org/ellislab/           Automatically hardening web applications using precise tainting. 20th
     codeigniter/src/tip/system/libraries/Security.php.                                  IFIP International Information Security Conference, 2005.
[18] CodeIgniter User Guide Version 1.7.2: Input Class. http://codeigniter.         [44] XSS Prevention Cheat Sheet. http://www.owasp.org/index.php/XSS
     com/user guide/libraries/input.html.                                                (Cross Site Scripting) Prevention Cheat Sheet.
[19] Ctemplate: Guide to Using Auto Escape. http://google-ctemplate.                [45] PHP usage statistics. http://www.php.net/usage.php.
     googlecode.com/svn/trunk/doc/auto escape.html.                                 [46] W. Robertson and G. Vigna. Static enforcement of web application
[20] django: Built-in template tags and filters. http://docs.djangoproject.com/          integrity through strong typing. In Proceedings of the 18th conference
     en/dev/ref/templates/builtins.                                                      on USENIX security symposium, SSYM’09, pages 283–298, Berkeley,
                                                                                         CA, USA, 2009. USENIX Association.
[21] Django sites : Websites powered by django. http://www.djangosites.org/.
                                                                                    [47] Ruby on Rails Security Guide. http://guides.rubyonrails.org/security.
[22] M. Finifter, J. Weinberger, and A. Barth. Preventing capability leaks in
                                                                                         html.
     secure javascript subsets. In Proc. of Network and Distributed System
     Security Symposium, 2010.                                                      [48] P. Saxena, D. Akhawe, S. Hanna, F. Mao, S. McCamant, and D. Song.
                                                                                         A symbolic execution framework for javascript. In Proceedings of the
[23] A. Guha, S. Krishnamurthi, and T. Jim. Using static analysis for ajax
                                                                                         2010 IEEE Symposium on Security and Privacy, SP ’10, pages 513–528,
     intrusion detection. In Proceedings of the 18th international conference
                                                                                         Washington, DC, USA, 2010. IEEE Computer Society.
     on World wide web, WWW ’09, pages 561–570, New York, NY, USA,
     2009. ACM.                                                                     [49] P. Saxena, S. Hanna, P. Poosankam, and D. Song. FLAX: Systematic dis-
     covery of client-side validation vulnerabilities in rich web applications.
     In 17th Annual Network & Distributed System Security Symposium,
     (NDSS), 2010.
[50] P. Saxena, D. Molnar, and B. Livshits. Scriptgard: Preventing script
     injection attacks in legacy web applications with automatic sanitization.
     Technical report, Microsoft Research, September 2010.
[51] E. J. Schwartz, T. Avgerinos, and D. Brumley. All you ever wanted
     to know about dynamic taint analysis and forward symbolic execution
     (but might have been afraid to ask). In Proceedings of the 2010
     IEEE Symposium on Security and Privacy, SP ’10, pages 317–331,
     Washington, DC, USA, 2010. IEEE Computer Society.
[52] R. Sekar. An efficient black-box technique for defeating web application
     attacks. In NDSS, 2009.
[53] J. Seo and M. S. Lam. Invisitype: Object-oriented security policies,
     2010.
[54] Smarty Template Engine: escape. http://www.smarty.net/manual/en/
     language.modifier.escape.php.
[55] S. Stamm. Content security policy, 2009.
[56] Z. Su and G. Wassermann. The essence of command injection attacks
     in web applications. In Conference record of the 33rd ACM SIGPLAN-
     SIGACT symposium on Principles of programming languages, POPL
     ’06, pages 372–382, New York, NY, USA, 2006. ACM.
[57] N. Swamy, B. Corcoran, and M. Hicks. Fable: A language for enforcing
     user-defined security policies. In Proceedings of the IEEE Symposium
     on Security and Privacy (Oakland), May 2008.
[58] Template::Manual::Filters.         http://template-toolkit.org/docs/manual/
     Filters.html.
[59] Ter Louw, Mike and V.N. Venkatakrishnan. BluePrint: Robust Pre-
     vention of Cross-site Scripting Attacks for Existing Browsers. In
     Proceedings of the IEEE Symposium on Security and Privacy, 2009.
[60] W. Venema. Taint support for PHP. ftp://ftp.porcupine.org/pub/php/php-
     5.2.3-taint-20071103.README.html, 2007.
[61] H. J. Wang, X. Fan, J. Howell, and C. Jackson. Protection and commu-
     nication abstractions for web browsers in mashupos. In Proceedings of
     twenty-first ACM SIGOPS symposium on Operating systems principles,
     SOSP ’07, pages 1–16, New York, NY, USA, 2007. ACM.
[62] G. Wassermann and Z. Su. Sound and precise analysis of web applica-
     tions for injection vulnerabilities. In Proceedings of the ACM SIGPLAN
     conference on Programming language design and implementation, pages
     32–41, New York, NY, USA, 2007. ACM.
[63] Y. Xie and A. Aiken. Static detection of security vulnerabilities in
     scripting languages. In Proceedings of the Usenix Security Symposium,
     2006.
[64] xssterminate. http://code.google.com/p/xssterminate/.
[65] W. Xu, S. Bhatkar, and R. Sekar. Taint-enhanced policy enforcement:
     A practical approach to defeat a wide range of attacks. In Proceedings
     of the 15th USENIX Security Symposium, pages 121–136, 2006.
[66] Yii Framework: Security. http://www.yiiframework.com/doc/guide/1.1/
     en/topics.security.
[67] Zend Framework: Zend Filter. http://framework.zend.com/manual/en/
     zend.filter.set.html.
