---
type: Article
title: "EvoCrawl: Exploring Web Application Code and State using Evolutionary Search"
resource: "https://www.ndss-symposium.org/ndss-paper/evocrawl-exploring-web-application-code-and-state-using-evolutionary-search/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:13:23+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/evocrawl-exploring-web-application-code-and-state-using-evolutionary-search/"
    title: "EvoCrawl: Exploring Web Application Code and State using Evolutionary Search"
    author: Xiangyu Guo, Akshay Kawlay, Eric Liu, David Lie
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2025-366-paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/3C-s0366-guo.pdf"
authors:
  - Xiangyu Guo
  - Akshay Kawlay
  - Eric Liu
  - David Lie
canonical_url: ""
cited_by:
  - "2025.md:88"
commit: ""
content_sha256: 6463ff8df17f2b33a0e38936d0989d6ff6f1204de49503a18db595132afb6d28
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/evocrawl-exploring-web-application-code-and-state-using-evolutionary-search/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: bc0333d4cffdacd05f2f4823ef4d3de5cc96aa23a273e72d62b5bbbd6d956b5c
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2025-366-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:13:23+00:00"
slug: ndss-symposium-evocrawl-exploring-web-application-code-state-using-search
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# EvoCrawl: Exploring Web Application Code and State using Evolutionary Search

**EvoCrawl: Exploring Web Application Code and State using Evolutionary Search** - Xiangyu Guo, Akshay Kawlay, Eric Liu, David Lie, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/evocrawl-exploring-web-application-code-and-state-using-evolutionary-search/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2025-366-paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/3C-s0366-guo.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2025-366-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

EvoCrawl: Exploring Web Application
             Code and State using Evolutionary Search
             Xiangyu Guo                         Akshay Kawlay                        Eric Liu                    David Lie
         University of Toronto                University of Toronto            University of Toronto        University of Toronto
     xiangyu.guo@mail.utoronto.ca          ak.kawlay@mail.utoronto.ca         ec.liu@mail.utoronto.ca       david.lie@utoronto.ca



    Abstract—As more critical services move onto the web, it has       application exploration. Therefore, dynamic analysis focuses
become increasingly important to detect and address vulnerabil-        on exploring as much code as possible.
ities in web applications. These vulnerabilities only occur under         Web vulnerability scanners are often paired with a web
specific conditions: when 1) the vulnerable code is executed and
2) the web application is in the required state. If the application    crawler, which attempts to maximize the code coverage of an
is not in the required state, then even if the vulnerable code         application by scanning as many pages as possible. However,
is executed, the vulnerability may not be triggered. Previous          simply crawling pages is not sufficient to maximize code
work naively explores the application state by filling every field     coverage. This is because some code in a web application is
and triggering every JavaScript event before submitting HTML           associated with functionality that can only be triggered when
forms. However, this simplistic approach can fail to satisfy
constraints between the web page elements, as well as input            the application is in a specific server-side state. For instance,
format constraints. To address this, we present EvoCrawl, a web        in GitLab, a web-based revision control system, functions
crawler that uses evolutionary search to efficiently find different    that enable users to manipulate code repositories require a
sequences of web interactions. EvoCrawl finds sequences that can       repository to be created first. As a result, a vulnerability
successfully submit inputs to web applications and thus explore        scanner will be unable to test any of that code if it is
more code and server-side states than previous approaches. To
assess the benefits of EvoCrawl, we evaluate it against three state-   unable to interact with GitLab and create new repositories.
of-the-art vulnerability scanners on ten web applications. We find     Therefore, to achieve good code coverage, and thus find more
that EvoCrawl achieves better code coverage due to its ability         vulnerabilities, a web crawler must explore both web pages
to execute code that can only be executed when the application         and application states.
is in a particular state. On average, EvoCrawl achieves a 59%             This importance has not been lost in previous approaches to
increase in code coverage and successfully submits HTML forms
5× more frequently than the next best tool. By integrating IDOR        web application vulnerability detection. For example, Black-
and XSS vulnerability scanners, we used EvoCrawl to find eight         Widow [6] and Enemy of the State [7] incorporate HTML
zero-day IDOR and XSS vulnerabilities in WordPress, HotCRP,            forms into their navigation graph, and submitting these HTML
Kanboard, ImpressCMS, and GitLab.                                      forms enables them to explore different server-side states.
                                                                       In addition, to handle AJAX-enabled dynamic web pages,
                       I. I NTRODUCTION                                BlackWidow also adds JavaScript events to its navigation
                                                                       graph. Triggering JavaScript events can enable additional fields
   Since 2017, broken access control and XSS code injection
                                                                       and elements on a web page, allowing BlackWidow to submit
have been consistently ranked among the most prevalent
                                                                       more data and explore more server-side states.
vulnerabilities in OWASP Top 10. As stated in OWASP’s 2021
                                                                          However, to correctly submit data to a web application
report [1], 94% of tested applications exhibited some form of
                                                                       that will modify the server-side state, a web crawler must
broken access control or injection vulnerabilities, underscoring
                                                                       satisfy both ordering and formatting constraints on interactions
the need for developers to safeguard their web applications
                                                                       with HTML elements and trigger JavaScript events in the
against these defects. There are two main approaches to detect-
                                                                       right order. For example, to submit data via a form, the web
ing such vulnerabilities: static analysis and dynamic analysis.
                                                                       application may impose an ordering constraint that requires
Static analysis tools [2], [3], [4], [5] require the application’s
                                                                       the crawler to first enter data into text fields, or select the
source code, which limits their applicability to applications
                                                                       correct options from dropdown boxes or radio buttons, before
written in other programming languages. Conversely, dynamic
                                                                       hitting the submit button. Similarly, a web application may
analysis can be agnostic to the programming language, but
                                                                       impose formatting constraints such that fields that require a
can only detect vulnerabilities if they occur during the tool’s
                                                                       date or an e-mail must have well-formed inputs. Finding a
                                                                       sequence that meets ordering constraints requires a search over
                                                                       all possible sequences of interactions with HTML elements
                                                                       and JavaScript events (which we collectively refer to as web
                                                                       elements), which grows exponentially with the number of
Network and Distributed System Security (NDSS) Symposium 2025
24–28 February 2025, San Diego, CA, USA                                such elements and events. BlackWidow and Enemy of the
ISBN 979-8-9894372-8-3                                                 State naively avoid searching this large space by filling in
https://dx.doi.org/10.14722/ndss.2025.230366
www.ndss-symposium.org
every input field in HTML forms, and only enumerating all                      vulnerabilities. EvoCrawl is openly available at https:
sequences of JavaScript events and HTML forms. While this                      //github.com/dlgroupuoft/evocrawl
reduces the search space, it increases the chances that they                • We integrate all the detector modules into EvoCrawl
will violate formatting constraints, as some web pages contain                 and evaluate its performance by comparing it against
optional fields, which could have been left blank.                             3 modern scanners on 10 web applications. EvoCrawl
   To address this, we propose EvoCrawl, which overcomes                       successfully identifies eight zero-day bugs in WordPress,
both ordering and formatting constraints, enabling it to submit                HotCRP, Kanboard, ImpressCMS, and Gitlab. It achieves
more data and explore more server-side states than previous                    an average code coverage increase of 59% and outper-
approaches. EvoCrawl achieves this by performing a fine-grain                  forms BlackWidow by submitting HTML forms with the
search of sequences of interactions with web elements, in-                     POST method 5 times more frequently.
cluding individual HTML fields. Searching subsets of HTML                   This paper is structured as follows: Section III offers a
fields enables EvoCrawl to submit a larger diversity of inputs           description of EvoCrawl’s design, while Section IV elaborates
to the web application and generate a larger diversity of                on its implementation details. Section V compares EvoCrawl
server states. In addition, filling some fields and leaving others       on the metrics of code coverage and the ability to submit
blank enables EvoCrawl to successfully submit data in cases              HTML form inputs to an application against other state-
where EvoCrawl finds a field’s formatting constraints are too            of-the-art web vulnerability scanners. We then evaluate the
difficult for EvoCrawl to infer, but which also happens to               vulnerability detection ability of EvoCrawl and detail the new
be optional. The drawback with this approach is that a fine-             vulnerabilities found in Section VI, followed by Sections VII
grain search results in a larger search space, which EvoCrawl            and VIII, outlining the limitations of EvoCrawl and reviewing
addresses with two key innovations. First, EvoCrawl uses an              related works in the field. Finally, we draw conclusions in
evolutionary algorithm with a fitness function that enables it           Section IX.
to focus its search on sequences that are able to successfully
                                                                                                II. M OTIVATION
submit inputs, or reveal more web elements to interact with.
Second, to further reduce the search space, EvoCrawl detects                As mentioned in Section I, modern web pages heavily use
dependencies between web elements, enabling it to eliminate              JavaScript to asynchronously update and modify web pages.
sequences that violate these dependencies.                               The crawler needs to trigger certain JavaScript events to make
   To measure the improvements these two techniques confer,              additional web elements or links accessible. Therefore, Black-
we evaluate EvoCrawl on 10 modern web applications and                   Widow [6] incorporates JavaScript events into its navigation
compare its performance against three modern black-box scan-             graph. By enumerating all possible sequences of JavaScript
ners: BlackWidow [6], JAK [8], and CrawlJAX [9]. EvoCrawl                events and HTML forms, BlackWidow aims to find the se-
can also be combined with various detector modules to de-                quences that satisfy the dependencies or constraints imposed
tect different types of vulnerabilities. We have implemented             by the web pages. However, as the numbers of JavaScript
IDOR (Insecure Direct Object Reference) and XSS (Cross-                  events and HTML forms increases, the search space expands
Site Scripting) vulnerability detectors in EvoCrawl. The IDOR            exponentially. Even a small web page with just 10 JavaScript
vulnerability detector (IVD) not only automatically categorizes          events and 1 HTML form would generate a search space of
resources but also exhibits a low rate of false positives when           n11 for sequences of n interactions, which can quickly become
detecting IDOR vulnerabilities. Inspired by BlackWidow [6],              too large to search even for modest values of n.
the XSS vulnerability detector (XVD) injects XSS payloads                   A sequence here refers to some JavaScript events and/or
containing unique integers into every feasible input field.              HTML forms placed in a certain order, and the targeted
By monitoring and tracking these integers, the XVD can                   sequences are the ones that can reveal new links or explore
identify the relationships between input sources and sinks,              server-side states after their executions. To find targeted se-
subsequently exposing the payloads. These detectors enable               quences inside this vast search space, we need the crawler
EvoCrawl to find 8 zero-day IDOR and XSS vulnerabilities.                to accomplish two steps: 1) reduce the search space and
We have responsibly disclosed all vulnerabilities and the                2) search for the targeted sequences efficiently. Certain web
developers have either fixed or acknowledged all except two              elements including ones that listen to the JavaScript events are
of them.                                                                 dependent on each other. Specifically, certain web elements are
                                                                         not visible or active unless the user interacts with other web
   The following are our main research contributions:
                                                                         elements first. For instance, the form in Fig. 1 is only visible
  • We identify that successfully and efficiently executing              and active after interacting with the arrow button in the red
    client-side events is a significant impediment to web                box that can expand the component, or specific elements may
    application exploration, which should be overcome for                become visible only following certain prerequisite interactions.
    web vulnerability scanners to increase code coverage and             By enforcing the dependency information on the order of
    find vulnerabilities.                                                sequences, EvoCrawl avoids trying impossible sequences, thus
  • We present EvoCrawl, which combines an evolution-                    reducing the search space.
    ary search algorithm with standard crawling to more                     EvoCrawl can accomplish the first step by tracking and
    comprehensively explore web application code to find                 enforcing dependencies. Then, to search the remaining space



                                                                     2
                                                                        ing within the sequences and utilizes random combinations to
                                                                        introduce diversity into the generated sequences.
                                                                           Following the sequence generation, the ESM executes these
                                                                        sequences via the User interface (UI) in the browser and
                                                                        evaluates them using a fitness function. During the execution
                                                                        of each sequence, the fitness function assigns a score to the
                                                                        sequence based on feedback from the server-side database
                                                                        and the client-side browser. The fitness function indicates how
                                                                        “good” the sequence is in achieving its objectives.
                                                                           Additionally, during the execution of each sequence, the
                                                                        crawler constructs and updates a dynamic map based on its
                                                                        observed dependency information. Within this map, each in-
                                                                        teraction is associated with elements that only become visible
       Fig. 1: An Illustrative Example for WordPress                    after the crawler executes the interaction. Subsequently, the
                                                                        crawler introduces mutations to the sequence to enforce the
                                                                        constraints outlined in the dynamic map
                                                                           EvoCrawl’s evolutionary search algorithm focuses on
efficiently, we propose the use of an evolutionary genetic              searching for sequences of interactions on a page in a web
search algorithm, which is a good fit for this problem. First,          application. However, to be effective, it needs to be run on
its crossover operation allows the crawler to generate varia-           as many pages in the web application as possible. This is
tions of sequences based on previously successful sequences.            partially achieved by taking new URLs it discovers during its
Second, with feedback from the web browser and database,                search and storing them as targets for later search sessions.
the evolutionary search can use a fitness function to identify          However, the rate at which it discovers these new pages is
the sequences more likely to reveal new links and explore               affected by the large search space of application web pages. As
application states.                                                     a result, EvoCrawl is actually composed of two modules that
   Additionally, unlike BlackWidow, which attempts to fill in           perform two types of searches. The Evolutionary Search Mod-
all input fields to submit a form, EvoCrawl searches for various        ule (ESM) performs the aforementioned evolutionary search of
sequences of interactions for form submission. This variation           interaction sequences, while a Page Collection Module (PM)
in approach is necessary because some input fields, such as             interacts with each web element only once to rapidly collect
those requiring very specific formats like“YEAR-MONTH-                  different links.
DAY,” cannot have their values easily inferred by heuristics.              Figure 2 illustrates the architecture of EvoCrawl. Through-
For forms containing these complex input fields, EvoCrawl               out the scanning process, both the PM and ESM exchange
can find different sequences for submission. These sequences            pages they have found: the ESM uses these as target pages
may include filling in all fields or omitting some of the fields.       for its evolutionary search, and the PM uses these as starting
The intuition is that while EvoCrawl may not generate the               points to crawl for more pages and other web elements.
correct values for complex input fields, it can still find the          Both modules exchange URLs with the two vulnerability
sequence that successfully submits the form by bypassing                detectors: the IDOR vulnerability detector (IVD) and the XSS
these fields. For instance, in a user registration process on a         vulnerability detector (XVD). The IVD classifies the URLs
website, fields like “username”, “password”, and “email” must           and assesses the access control level of the private ones.
be completed, whereas others like“birthday” or“time zone”               The XSS vulnerability detector generates JavaScript payloads,
are optional and can be left blank. However, for non-optional           which are injected by both PM and the ESM into the web
fields requiring inputs that heuristics cannot infer, EvoCrawl          application (sources), and also monitors for the successful
still fails to submit the related form.                                 execution of these payloads (sinks). We describe each of these
                                                                        components in more detail below.
                         III. D ESIGN
                                                                        A. Page Collection
   We integrate the dependency tracking mechanism and the
genetic algorithm into the Evolutionary Search Module (ESM)                The objective of the Page Collection Module (PM) is to find
of EvoCrawl. For each web page, the ESM evolves through                 URLs that can be passed to the Evolutionary Search Module
several generations. In each generation, it begins by generating        (ESM). To do this, it recursively searches the web application
sequences of web element interactions, which involve three              by identifying web elements and interacting with them. Each
different operations: crossover, mutation, and random combi-            interaction that triggers DOM changes is called an EV EN T ,
nations. The crossover operation allows the ESM to concate-             and is associated with the URL of the page on which it is found
nate two sequences together so the generated sequences can              to form a tuple < U RL, EV EN T >, which we call a seed.
inherit the properties of the previous sequences. The ESM               To perform its search, the PM stores seeds in a queue, with
employs the mutation operation to enforce dependency track-             which it iteratively performs a three-stage crawling process on



                                                                    3
                                               Fig. 2: Block Diagram of EvoCrawl


each seed, which consists of links crawling, events crawling,           relevant solutions as possible. It searches for sequences that
and forms crawling.                                                     aim to achieve two goals: explore server-side states and
   During the links crawling stage, the PM performs the                 reveal unseen links within the application.
following steps. First, it executes the seed by navigating to              For each page, the ESM evolves sequences through multiple
the URL specified in the current seed. If the value of EVENT            generations. Each generation includes two steps: “Sequence
is not empty, the associated DOM event is triggered. Once               Generation” and “Sequence Evaluation”, where sequences in
the seed execution is successful, the crawler extracts all href         each generation are generated from sequences that received a
values from the anchor elements on the web page. These href             high fitness score in previous generations. Therefore, to find
values are then used to construct new seeds, which will be              sequences that realize the previously mentioned two goals, the
added to the end of the queue if they are not already in the            genetic algorithm first needs to identify sequences that can lead
queue or have not been visited before.                                  to optimal descendants. Based on this, we design the fitness
   During the event crawling stage, the PM interacts with               function to assign scores to each sequence by using feedback
each interactable element on the web page to determine if the           from the browser and web application database during the
element can invoke a DOM event. If, after each interaction,             execution of the sequence. The score reflects the capability
the DOM changes without refreshing the page or navigating to            of a sequence to generate a new sequence that can satisfy the
other pages, the crawler identifies the corresponding element           two goals.
as the trigger for a DOM event and generates a new seed.                   1) Sequence Generation & Evaluation: Each sequence con-
This seed includes the URL of the current page and the CSS              sists of multiple genes arranged in a specific order. We define
selector of the element that triggered the event.                       each gene as a web element interaction pair. For instance,
   The PM does not combine different events to construct                when starting with a seed (page URL), the Evolutionary
new seeds. If there are two events on the web page: Event               Search Module (ESM) first navigates to the page URL, extracts
1 and Event 2, the crawler will only generate two new                   all interactable elements including elements that listen to
seeds < U RL, Event1 > and < U RL, Event2 > but                         JavaScript events, elements belonging to HTML forms, etc.
not < U RL, Event1, Event2 > since it cannot track the                  from the page, and constructs genes based on these elements.
dependencies among these events. It does not try combinations           For example, an “input” HTML element can lead to genes
of events and instead, leaves that task to the ESM.                     such as “input-click” or “input-typeText”
   In the form crawling stage, the PM first collects all forms             To generate new sequences, the ESM either randomly
by identifying the elements with the form tag and then tries            combines these genes or performs crossover on previous
to submit all of them immediately. For each form, it tries to           sequences. For crossover, it selects sequences that received
interact with all the elements inside it sequentially. During the       the highest scores from the fitness function in the previous
submission, if the PM detects any mutations on the DOM of               generation and recombines them to create new sequences. For
the form, it will dynamically capture and interact with the new         example, if Sequence 1 and Sequence 2 are the sequences with
elements. For example, after clicking on the submit button, if          the highest scores, the ESM will concatenate the first half of
a confirmation window pops up, the PM can detect the new                Sequence 1 with the last half of Sequence 2 to produce a new
elements inside the window and also interact with them.                 sequence. Then, the ESM places the submit buttons at the
                                                                        end of each sequence to increase the chances of successfully
B. Evolutionary Search                                                  submitting the filled inputs.
   The design of the Evolutionary Search Module (ESM)                      We evaluate a sequence by executing it. The ESM navigates
in EvoCrawl is inspired by genetic algorithms commonly                  to the page URL and then iterates through all the genes in a
used in optimization problems. However, traditional genetic             sequence. In each iteration, it interacts with the corresponding
algorithms typically aim to find a single optimal solution by           element based on the interaction type. For example, to evaluate
iteratively improving the fitness of a population of candidate          the sequence in Figure 3, it first types texts into “input2” and
solutions through natural selection. In contrast, the objective         “input1”, clicks on “button1”, “a2”, and “a1”, and finally types
of the evolutionary search module in EvoCrawl is not to seek            texts to the “textarea”. After each interaction, the ESM checks
a single optimal solution but to explore and uncover as many            the browser’s URL field to see if it has been navigated to



                                                                    4
another page. If clicking on an element navigates the ESM to
another page, the ESM will automatically record the new URL,
send it to the Page Collection module, navigate back to the
previous URL, and continue executing the next gene. By doing
this, ESM constrains the search space of the evolutionary
algorithm to the current page and thus explores more states
of it.
   To generate input values for “input” and “textarea” ele-
ments, the ESM initially checks for value and placeholder
attributes. The value attribute typically stores the default value,
and the placeholder attribute typically contains a hint of the
expected value. If these two attributes do not exist, the ESM
heuristically searches for the keywords: URL or email across
all attribute values within the elements. If the ESM finds
a match, it generates texts conforming to the corresponding
format. For example, if the ESM identifies the keyword
“URL” in one of the attribute values, it will generate texts:
www.esm{i}.com, where i is a unique integer used to identify
the injected input. Otherwise, it submits a default input that is
configured by the user. The default inputs in our experiments
are: esm{i}. The ESM’s fitness function will then implicitly
determine if the generated input meets the element’s input
constraints.                                                                               Fig. 3: Mutating Sequences
   2) Dependency Tracking & Enforcement: During the “Se-
quence Evaluation” step, if the execution of a gene triggers
                                                                             4) Fitness Function: During the “Sequence Evaluation”
a JavaScript event and reveals new elements on the page, the
                                                                          step, ESM uses a fitness function to find sequences having
ESM infers that the new element depends on the triggered
                                                                          higher possibilities to generate good sequences in the next
JavaScript event, and can track dependency information by
                                                                          generation. Only sequences with the highest fitness scores can
linking the newly revealed elements directly to the gene trig-
                                                                          survive to the next generation and be used by the ESM to
gering the changes. We note that due to the non-determinism
                                                                          generate new sequences. A good sequence is defined as one
of pages, some false dependencies may be inferred by the
                                                                          that either results in HTML form submissions or the discov-
ESM using this heuristic, but in practice, we find that such
                                                                          ery of new links. Specifically, the fitness function leverages
false dependencies are very rare. In the “Sequence Generation”
                                                                          feedback from both the browser and the server-side database
step, the ESM enforces these tracked dependencies in its
                                                                          and employs heuristics to infer which sequence can generate
mutation function. For example, suppose clicking “button1”
                                                                          good sequences in the next generation.
triggers a JavaScript event and partially updates the web page,
                                                                             The fitness function assigns each sequence an initial, uni-
causing anchor element “a3” to appear. Figure 3 represents
                                                                          form fitness score that undergoes dynamic updates throughout
this sequence update visually. Since “a3” is dependent on
                                                                          sequence execution. This score represents the possibility of the
“button1”, it has been added after “button1” in the example
                                                                          sequence producing good descendants in the next generation.
sequence. If multiple elements appear after clicking “button1”,
                                                                          Actions that could lead to HTML form submissions or induce
the mutation function will randomly select some new elements
                                                                          new elements in the current DOM are rewarded, while actions
and add them after “button1”. By enforcing the dependency
                                                                          hindering these objectives are penalized. Notably, actions such
information, the ESM prevents the generation of sequences
                                                                          as text input to a field, sample file uploads, form submissions,
that violate the order of dependent elements, thereby reducing
                                                                          or triggering JavaScript events increase the fitness score. A
the search space.
                                                                          successful form submission is determined by inspecting the
   3) Gene Elimination: We mentioned that the ESM navi-                   server-side web application’s database after executing the
gates back to the previous URL if executing a gene causes the             entire sequence. To detect this, the input text generated by
ESM to jump to another page while evaluating the sequence.                the ESM for each input field contains a unique tainted value.
However, navigating to a new page can still disrupt the                   ESM then queries whether the tainted value is injected into the
sequence’s execution, as any JavaScript events triggered by the           database by the executed sequence. This injected text serves
sequence up to that point may be reset due to the page refresh.           as an indicator of a successful form submission. Conversely,
Consequently, whenever ESM encounters a gene that results                 if the ESM executes a gene but the corresponding element
in navigating to another page, it will remove this gene and all           is currently invisible, the fitness function will punish the
sequences that contain that gene from the search space. Once              sequence, as this indicates an incorrect order of the elements’
removed, a gene is excluded from all subsequent sequences.                interactions. The fitness function is computed as:



                                                                      5
     TABLE I: Fitness Function Weights and Objectives

          Weight    Value   Objective (oi )
            w1       40     Number of Form Submissions
            w2       20     Number of Filled Inputs
            w3       20     Number of Uploaded Files
            w4       15     Number of Triggered JS Events
            w5       -2     Number of Invisible Elements




                               X
                          f=       oi · wi                      (1)

   oi represents the objective variable, while wi denotes the              Fig. 4: An Example Sitemap for WordPress - Blank Node:
associated weight parameters. The weight values and their                  Page URL, Grey Node: Restful API, Blue Node: Ajax URL
corresponding objectives are presented in Table I. We found
empirically that this set of weights successfully helps the
EvoCrawl outperform other crawlers, so we did not fine-tune                C. Vulnerability Detectors
them for each application. However, these weights are tunable                 EvoCrawl is designed to allow modular integration of vul-
and can be further studied in future work.                                 nerability detectors, which are utilized as EvoCrawl explores
   We design the fitness function to reward sequences whose                the application. In this study, we demonstrate EvoCrawl’s
genes trigger JavaScript events during execution because these             ability to detect authorization and injection vulnerabilities,
JavaScript events can dynamically update the webpage and                   which have become increasingly prevalent [10]. In particular,
reveal previously unseen elements, such as those in forms or               we search for Insecure Direct Object References (IDORs)
containing new links. We want such sequences to survive to                 and Cross-Site Scripting (XSS). These two detectors operate
the next generation, enabling the ESM to explore the new                   independently and can be executed either individually or in
elements introduced by the JavaScript events these sequences               conjunction with each other.
trigger.                                                                      1) XSS Vulnerability Detector: We integrate the XSS Vul-
   The fitness function significantly rewards sequences that               nerability Detector (XVD) directly into both the ESM and
successfully submit a form. This incentivizes the function to              the PM. For the PM, after each submission of a form, the
find sequences that not only fill in essential fields but also             XVD replaces the input value with its XSS payload. For the
include optional ones, thereby inserting more data into the                ESM, the XVD directly replaces all text generated by the
database. For instance, consider a short sequence discovered               evolutionary crawler with the XSS payload.
by the ESM: “filling in field A and clicking the submit button.”              The XSS payload of our XVD is similar to the payload used
If this sequence leads to a successful form submission, it                 by BlackWidow. If the payload injected into each input field is
receives a high score due to the substantial reward for “form              successfully executed by the JavaScript Engine of the browser,
submission.” In subsequent generations, many sequences are                 a unique integer will be pushed into a global list that is pre-
generated based on this initial sequence. One resulting possi-             inserted into the HTML header of the web page. The unique
bility could be: “filling field A, filling field B, and clicking the       integer is generated using a UNIX timestamp to avoid two
submit button” (assuming A and B belong to the same form). If              input fields being inserted with the same value. By checking
this new sequence also successfully submits the form, it earns             the values in the global list, we can know which payload has
a higher score than the previous one because of the additional             been executed and further trace it to the source input field.
reward for “typing text into more input fields.” Consequently,                2) IDOR Vulnerability Detector: Unlike XVD, we couldn’t
in the next generation, newer sequences are generated based                find an existing IDOR vulnerability detection tool that we
on this enhanced sequence. Through this iterative process,                 could easily integrate with EvoCrawl, so we designed our own.
EvoCrawl can find sequences that fill in more input fields for             The IVD utilizes two users with distinct access control levels:
each form, resulting in a diversity of server-side states.                 an admin user and a non-admin user. We assume that any page
   The fitness function also helps EvoCrawl avoid sequences                or resource accessible via UI navigation should be accessible
that include fields with constraints it cannot satisfy. Suppose            to the current user. The IVD initiates the process by employing
there is a field C whose input constraints EvoCrawl is unable to           the admin user to crawl and collect resources within the web
satisfy. Any sequence that includes field C will receive a lower           application. Subsequently, it utilizes the non-admin user to
score than the short sequence. This is because the amount                  identify and exclude public resources accessible via the UI for
it loses for failing to attain the “form submission” reward                both user types. Finally, the IVD assesses the access control
outweighs the amount it gains for “typing text into inputs.”               level of private resources (those not accessible to the non-
Consequently, EvoCrawl will prioritize sequences that do not               admin user via the UI). It does so by attempting to access
include field C.                                                           these private resources directly using the non-admin user’s



                                                                       6
credentials. If the non-admin user can access these private             first, userA, is the user used by the crawlers. The second,
resources, despite their exclusivity to the admin user’s UI, it         userB, is the user that was used during replaying, and the
signals potential vulnerabilities within the system.                    third, userC, must be at the same privilege level as userB.
   We first describe how the IVD collects resources and filters         The IVD uses two steps to determine whether the responses
out public ones. During the crawling process of PM and ESM,             disclose private information to the attackers. The first step
the IVD automatically captures all requests sent from the               uses keyword matching while the second step compares re-
browser, extracts the request URLs, and builds them into a              sponses. Empirically, for each application, we observed that
sitemap. EvoCrawl’s sitemap thus captures all navigation paths          most “access denied” responses share common sentences. We
between URLs found during crawling, including those that re-            use these sentences to identify responses with proper access
sult from interacting with JavaScript events, anchor elements,          control. Based on our experiments, 5 sentences are enough for
and any other HTML elements that EvoCrawl interacts with.               each tested application. We call these sentences access-denied
Each node in the sitemap represents a URL and the edge                  sentences. If the responses received by the attackers do not
between the two nodes represents the HTML element that                  contain any access-denied sentences, they are further passed
triggers the transition from the source URL to the destination          to the second step parser to decide whether there are broken
URL. Figure 4 is an example sitemap for WordPress.                      access controls. For now, we manually collected the access-
   Then, the IVD uses another user with a different privilege           denied sentences for each application. It is possible that we
level from the crawler user to test if each edge in the                 failed to capture all the denied sentences. In this case, we rely
sitemap is accessible and also marks the corresponding edge             on the second step parser to check the access controls.
by replaying every interaction of both the crawler module and              For the second step parser, simply comparing userA’s re-
evolutionary search module. If the replayer (a module inside            sponse and userB’s response is insufficient, because we would
the IVD) manages to replay the interaction by using the related         not know if the response-differences comes from the page
element’s CSS selector, the corresponding edge will be labeled          contents or just user-specific data such as username, and
as accessible (i.e. public) to the replayer and vice versa. It is       user email on the webpage. This is where userC is needed.
important for the replayer to correctly replay the interaction          Since both userB and userC are at the same privilege level
and mark the right edge since mistakenly labeling an edge               and neither must have access to the private resources, their
can cause the IVD to misclassify an object, which leads to              responses must be similar with differing in only user-specific
both false positives and false negatives. We also note that it          content. Thus, we can detect the user-specific data and ignore
is important that both the crawler and replayer operate on the          it when comparing userB’s response with the userA’s response.
same web application instance, in lockstep. This is because
we need the replayer to see the same web application state as                               IV. I MPLEMENTATION
the crawler, to avoid missing public resources. For example,
the crawler could create a public object and then subsequently             EvoCrawl is built using a customized version of Test-
delete it. If the replayer tries to access the same object on           Cafe [11]. TestCafe is an end-to-end web application testing
another instance, or outside of lockstep with the crawler, it           framework. It provides browser automation capabilities along
might mistakenly believe the object to be private, and this             with useful features like capturing all requests-responses sent
will lead to a false positive when it finds it is able to access        and received, checking if an HTML element is visible on
it later during detection.                                              screen, interacting with an element, and running the JavaScript
   After the replayer tests all the edges, the IVD can know             code in the browser.
which resources are private by parsing the sitemap. Con-                   We inject the rrweb script—a tool designed for recording
sidering the example in Figure 4, if element “a2” can be                and replaying user interactions on the web—into the header
accessed by the replayer while element “a1” cannot, the                 of each page. This integration enables the capture of newly
edit.php?post type=page is considered a public re-                      visible elements for the PM and the ESM, as well as the
source while the site-editor.php is considered private.                 recording of interactions for IVD. The rrweb’s recording mod-
There might be different paths to reach the same resource.              ule can capture any mutations happening on the current page
If one of the paths can be accessed by the replayer, the                with low overheads by using the MutationObserver function.
destination node will be considered public. After gathering all            EvoCrawl uses Kafka as a durable queue for storing seeds.
the private URLs, the IVD will directly send forged requests            Both modules publish newly discovered page URLs to the
to them and check their access control levels by analyzing              queue and consume from it using separate consumer groups,
received responses.                                                     simulating multiple queues.
   After collecting private resources, it tests whether they can           ESM and PM operate as separate processes with distinct
be accessed by an unprivileged user. To do this, IVD sends              cookie sessions. Applications like Opencart or phpBB include
three forged requests to each private resource as three different       tokens in their page URLs that need to be matched with the
users. Then, the responses are parsed to decide whether each            corresponding cookie values. When exchanging seeds (page
resource is appropriately protected. We refer to this as the            URLs) between ESM and PM, the token values must be
triad test. In the triad test, the session cookies are obtained         automatically replaced with the appropriate ones for each
after automatically logging in with the user’s credentials. The         module. To achieve this, both modules perform two tasks:



                                                                    7
Fig. 5: Each bar presents the results of EvoCrawl compared with another crawler. The blue bar represents the unique lines
covered by EvoCrawl, the orange bar denotes the common lines covered by both crawlers, and the red bar shows the unique
lines covered by another crawler. (BW-BlackWidow, JAK-JAK, CJ-CrawlJAX)


identifying token names and replacing their values. We com-           B. Initial Setup
pare the redirect URLs after logging in from both modules to
determine token names. By comparing the query strings of the             We need to configure the application to have basic users
URLs, we infer which parameters differ and consider them as           and enable automatic logins to the application. This minor,
tokens. Once token names are obtained, the modules extract            one-time manual effort to register three users is a prerequisite
their values from the URLs and replace tokens in incoming             for running EvoCrawl on a web application.
seeds. However, this approach only works for persistent tokens
present in all page URLs. Tokens that appear in only some                                    V. E VALUATION
URLs cannot be identified and captured by EvoCrawl, leading
to the exchange of invalid seeds. While this slows down                  In this section, we present an empirical evaluation of
EvoCrawl, it does not break the entire system.                        EvoCrawl. We evaluate EvoCrawl along two metrics: the
                                                                      amount of code coverage attained and the number of HTML
                                                                      forms successfully submitted. The latter is an indicator of the
A. rrweb                                                              number of server-side web application states EvoCrawl is able
                                                                      to explore. We evaluate the code coverage of EvoCrawl against
   rrweb consists of two modules: recording and replaying. The        three state-of-the-art academic crawlers: BlackWidow, JAK,
recording module assigns unique rrweb-IDs with timestamps             and CrawlJAX. We exclude the scanners in the web security
to DOM elements for event tracking. The replaying module              community such as skipfish [12], Arachni [13], and w3af [14]
replays interactions based on the recorded rrweb-IDs and              etc., since BlackWidow [6] has previously demonstrated sig-
timestamps. However, when EvoCrawl’s public filter module             nificant improvement over them. We assessed all 4 crawlers
replays interactions as another user, the rrweb-IDs may lead to       on 10 modern web applications. We evaluate the ability of
incorrect elements due to dynamic DOM changes. To address             EvoCrawl to submit HTML forms against BlackWidow since
this, we only use rrweb’s recording module and implement              it is the best-performing crawler and the only one specifically
our replaying mechanism ourselves.                                    designed to explore the server-side state.



                                                                  8
                                             TABLE II: Applications for Experiments

                                  Functionality               Version              Github Stars   Used in other work
                    WordPress     Blog                        6.4.3                2.3k           [6], [7]
                    HotCRP        Content Management System   v3.0b3               319            [6]
                    Dokuwiki      Content Management System   2022-07-31“Igor”     4k
                    Drupal        Content Management System   9.3.15               4k             [6]
                    Humhub        Social Software Platform    1.12.1               6.2k
                    Opencart      eCommerce                   4.0.0                7.3k
                    phpBB         Forum                       3.8.8                1.8k           [6], [8], [7]
                    ImpressCMS    Content Management System   1.4.4                27
                    Kanboard      Project Management System   1.2.22               8.2k
                    Gitlab        DevSecOps Platform          11.5.1               23.6k



A. Experiment Setup                                                       For the ESM, all the parameters including the sequence
                                                                       length, the number of generations, etc. are fixed for all the
   Each crawler runs on a 4-CPU virtual machine with 6GB               benchmarks. We use the default settings for CrawlJAX with
memory. The CPU type of the virtual machine is Intel(R)                unlimited crawling depth and states. We also enable it to click
Xeon(R) Gold 6336Y. To guarantee a fair comparison, we                 on event handlers. For JAK, we follow the same configuration
reset all tested web application instances before each crawling        the developers provided in the example file. For the form sub-
session. This ensures that all scanners commence from the              mission experiment, since we need to search the injected text
same initial state, minimizing any potential disparities caused        to detect whether the form has been successfully submitted,
by differing application states.                                       we need scanners to generate unique text for each field. While
   For coverage experiments, since EvoCrawl uses both the              EvoCrawl already supports this, BlackWidow generates the
page collection module and the evolutionary search module              same texts for all the fields. Hence, we modify BlackWidow’s
to interact with a web application, we also run two processes          implementation to support unique text injection. This modi-
in parallel for other crawlers to let them have the same CPU           fication is exclusive to the form submission experiment and
resources as EvoCrawl. We used lines of code as a metric for           does not apply to the coverage experiment, where we use
coverage and generated a coverage report indicating which              BlackWidow’s original design.
lines had been hit for each request sent to the server. The               In selecting targets on which to evaluate EvoCrawl, we
coverage report for the PHP application is generated by using          sought applications that were both representative and had been
Xdebug [15] and php-code-coverage [16]. For the application            used in other academic research. For this evaluation, we define
in Rails production, we use Coverband [17] to collect coverage         a representative set of applications as 1) representing a variety
results. Also, we disabled the vulnerability detectors for all         of functionalities and 2) having an active user base and being
scanners since we want to focus on testing the ability to crawl        actively maintained. Table II provides information on our
the web application.                                                   set of selected applications. The “type” column in the table
   To detect a successful form submission, we record the text          indicates the diversity of the applications, while the number
that each crawler filled into each form and log all transactions       of GitHub stars approximates their user base. Furthermore,
that modify the database tables. If the text filled by the             all applications are in their latest versions and are actively
crawlers appears in any of the transactions, we consider the           maintained at the time of writing. Finally, we cite other works
corresponding form to be successfully submitted.                       that have also used the particular application in other studies.
   The public filter of IVD requires an attacker to replay
the interactions of both the crawler module and the ESM to             B. Code Coverage
classify the collected URLs. We set the privilege level of the            Figure 5 presents the final code coverage achieved by each
attacker to be the second highest and the crawler user to be           crawler across all tested applications after a 24-hour run
the highest.                                                           which is presented proportionally. We provide the absolute
   As for the configurations for the tested crawlers, we manu-         values for the coverage results in the Appendix. The blue bar
ally set up the login credentials for all of them and prevented        represents the number of unique lines covered by EvoCrawl,
them from crawling on the user page, the basic configuration           the orange bar indicates the number of lines covered by
page, and the extension/plugin installation page of each web           both crawlers, and the red bar shows the number of unique
application, because crawling on those pages may change                lines covered by other crawlers. We do not include results
the login credentials or cause the web application to crash.           for JAK and CrawlJAX on Opencart and phpBB, as these
Moreover, we prevent all crawlers from interacting with logout         crawlers cannot handle the token implementations of these
buttons to make sure they always stay logged in. Each testing          web applications. EvoCrawl has the highest coverage on all
process was run for 24 hours. In addition, we ran EvoCrawl             the tested applications over other scanners. Even for the next
5 times because of the randomness of the evolutionary algo-            best scanner BlackWidow, EvoCrawl outperforms it and has
rithm.                                                                 an improvement ranging from 6% to 192% across different



                                                                   9
TABLE III: This Table presents p-value results for each application between EvoCrawl and BlackWidow, with both EvoCrawl
and BlackWidow run 5 times on each application.

                WordPress   HotCRP     Dokuwiki     Drupal    Humhub          ImpressCMS    Kanboard   Opencart        phpBB      GitLab
      p-value    0.00096    0.000007    0.00082    0.004448   0.000031         0.000502     0.000719   0.000009        0.000159   0.000120



applications. Table III presents p-values comparing EvoCrawl               TABLE IV: This Table presents the results of the HTML form
with BlackWidow, highlighting significant differences between              submission. The data includes Unique forms submitted by
them.                                                                      EvoCrawl, Common forms submitted by both crawlers and
   1) Case Studies of the Coverage Results: We include a                   Unique forms submitted by the BlackWidow
case study of why EvoCrawl achieves better coverage than
BlackWidow.                                                                                Unique-EvoCrawl   Common         Unique-BlackWidow
   HotCRP. BlackWidow achieves lower coverage on HotCRP                     WordPress             8                7                 2
                                                                            HotCRP               17                6                 3
because it hits the “cancel” button before reaching the “save”              Humhub               25                3                 2
button during the submission of certain forms, while the ESM                Drupal               70               11                33
of EvoCrawl can find the sequence of interactions that omit the             Kanboard             17                5                 0
                                                                            phpBB                15               12                10
cancel button but click on the “save” one. This is especially               ImpressCMS            7                2                 3
important for HotCRP, as the crawler must submit certain                    Opencart             15               0                 1
forms before exploring related code blocks. For example, a                  Dokuwiki              6                8                 2
                                                                            Gitlab               30                1                 1
crawler needs to first successfully submit a paper, before it
can successfully crawl on the “reviews for the paper” page.
Moreover, BlackWidow fails to enter the correct values for
some input fields inside certain forms. For these forms, the                  For other applications, EvoCrawl generally has better re-
ESM can find the sequence that leaves these difficult input                sults for two reasons. First, it does not spend time trying
fields blank and only fills in fields that heuristics can infer.           combinations of unrelated events. Therefore, it has time to
                                                                           extensively navigate the application and interact with more
   Kanboard. EvoCrawl is the only scanner that successfully
                                                                           pages and forms than BlackWidow does. Second, for certain
creates tasks inside the projects on Kanboard. Similar to
                                                                           forms, EvoCrawl is the only tool that finds the correct se-
HotCRP, there are input fields inside the task creation form
                                                                           quences to submit inputs. The two factors together lead to a
whose values cannot be resolved by all the scanners. Instead
                                                                           higher coverage achieved by EvoCrawl in terms of the overall
of filling in the wrong values like other scanners do, the
                                                                           exploration of the application.
ESM of EvoCrawl successfully finds sequences that leave
these fields blank and manages to create the tasks, thereby                C. HTML form submissions
further executing the code related to task modification and                   Table IV presents the number of successfully submitted
management.                                                                HTML forms, which is an indication of how well EvoCrawl
   WordPress. EvoCrawl’s improved coverage on WordPress                    explores server-side state. We only compare EvoCrawl with
mainly comes from two factors. First, the evolutionary search              BlackWidow, since the other two crawlers are not specifically
module of EvoCrawl manages to install different themes on                  designed to explore the server-side states.
WordPress and further explores the code blocks of these                       We monitor all the data transactions happening on the server
themes. Second, although BlackWidow can create draft posts                 side and track all the inputs inserted into the database. We
on WordPress, it fails to publish them, since publishing posts             further collect which HTML forms have been successfully
requires the crawler to trigger a JavaScript event after filling in        submitted during scanning while using the action attribute
the form. EvoCrawl is the only crawler that finds this sequence            to represent each form. We do not collect submissions other
of interactions, while BlackWidow fails to find it.                        than HTML forms because they are difficult to track.
   Opencart. One of the factors contributing to BlackWidow’s                  For all applications, EvoCrawl is able to submit more
lower coverage is its inability to submit forms in Opencart.               forms than BlackWidow, one of the reasons that EvoCrawl
For successful form submission, the crawler must trigger a                 submits more forms than BlackWidow is due to EvoCrawl’s
JavaScript event after filling in the input fields. However,               efficiency. The genetic algorithm and dependency tracking
BlackWidow’s strategy of enumerating all possible combi-                   enable EvoCrawl to search intelligently and spend less time
nations of JavaScript events and HTML forms results in an                  on each page. Consequently, it has more time to explore
excessively large search space. This vastness prevents it from             additional pages, thereby discovering and submitting more
identifying the correct sequence needed to submit the form.                forms.
Additionally, certain page links within Opencart remain hidden                Upon closer inspection, we find that EvoCrawl outperforms
until the crawler triggers a combination of JavaScript events,             BlackWidow on HotCRP, Humhub, and Kanboard because it
which BlackWidow fails to find.                                            can bypass optional fields with strict constraints. BlackWidow



                                                                      10
                                                                           TABLE V: Results of Vulnerability Detection Experiments
                                                                                          WordPress   Humhub     ImpressCMS    Kanboard
                                                                              EvoCrawl      2/2         0/1          2/2         2/3
                                                                             BlackWidow     1/2         0/1          0/2         1/3



                                                                             For phpBB and WordPress, EvoCrawl-nodt executes a no-
                                                                          table amount of lines that EvoCrawl does not cover. This
                                                                          discrepancy is mainly because EvoCrawl and EvoCrawl-nodt
                                                                          crawl on different sets of pages. The dependency tracking
                                                                          allows EvoCrawl to find sequences that respect the order
                                                                          of the web elements. This enables EvoCrawl to find new
Fig. 6: Each bar presents the results of EvoCrawl compared                elements that only the execution of these sequences can reveal.
with EvoCrawl without dependency tracking. The blue bar                   If these new elements include anchor elements with links
represents the unique lines covered by EvoCrawl, the orange               to new pages, EvoCrawl will add them to the queue and
bar denotes the common lines covered by both crawlers, and                crawl them, while EvoCrawl-nodt does not find these and
the red bar shows the unique lines covered by EvoCrawl with               ends up crawling other pages. Consequently, this results in
no dependency tracking.                                                   longer queues for EvoCrawl than EvoCrawl-nodt, as some
                                                                          pages are only in the queue of EvoCrawl but not in the queue
                                                                          of EvoCrawl-nodt. Due to the large number of web pages in
fails to submit these forms because it either enters the wrong            phpBB and WordPress, EvoCrawl cannot finish crawling all
values to certain input fields or interacts with elements in              the pages within the 24-hour limit, thereby failing to crawl on
the wrong order. Moreover, it further misses the forms that               the pages at the end of the queue. However, the total coverage
depend on the successful submission of these previous forms.              of EvoCrawl is always larger than that of EvoCrawl-nodt.
For example, BlackWidow fails to submit a paper on Hotcrp                                    VI. V ULNERABILITIES
and therefore cannot detect the forms that assign the paper and
review the paper. It also fails to create tasks inside the project           We now evaluate the ability of EvoCrawl to detect vulnera-
page on Kanboard, and cannot create new spaces on Humhub                  bilities, as well as detail the new vulnerabilities that EvoCrawl
as well.                                                                  has discovered.
   There are cases where BlackWidow submits forms that                    A. Experiments on Known XSS Vulnerabilities
EvoCrawl does not in our experiments (i.e. in Drupal and
                                                                             To compare EvoCrawl’s detection ability on known XSS
phpBB). We found that this is a result of differences in
                                                                          vulnerability detection with other crawlers, we conducted
seed scheduling between BlackWidow and EvoCrawl, which
                                                                          24-hour experiments on both EvoCrawl and BlackWidow
causes them to explore slightly different portions of the
                                                                          using vulnerable versions of web applications. To do this,
applications, and thus interact with different forms. The forms
                                                                          we selected versions of web applications with previously
that BlackWidow submitted were not analyzed by EvoCrawl.
                                                                          found vulnerabilities that were documented in enough detail
Overall, EvoCrawl still submits more forms than BlackWidow,
                                                                          that we could 1) reproduce the environment and conditions
indicating that EvoCrawl has a faster crawling speed and form
                                                                          under which the vulnerabilities can be triggered; 2) confirm
submission rate than BlackWidow.
                                                                          that triggering the vulnerabilities does not require a crafted
                                                                          payload that bypasses sanitizers, since both EvoCrawl and
D. Benefits of Dependency Tracking
                                                                          BlackWidow specialize in finding injection points, but not in
   As discussed in Section III, the ESM employs dependency                crafting payloads to bypass sanitizers; and 3) have not been
tracking to reduce the search space. To evaluate the effec-               previously found by either EvoCrawl or BlackWidow, ensuring
tiveness of this feature, we implement EvoCrawl-nodt, which               that both tools have an equal chance of detecting the selected
is a version of EvoCrawl with dependency tracking disabled,               vulnerabilities. We used the CVE Details website [18] to find
so that no dependency information is used during sequence                 information on known vulnerabilities. The specific versions
generation. Figure 6 illustrates the code coverage of EvoCrawl-           tested were WordPress-4.7.2, Kanboard-1.2.8, ImpressCMS-
nodt compared with EvoCrawl.                                              1.4.4, and Humhub-1.11.0.
   For most applications, dependency tracking largely en-                    Table V presents the results of the known vulnerability
hances code coverage. However, for some applications, the                 detection experiments. EvoCrawl outperforms BlackWidow on
coverage results between the two configurations are similar.              all tested applications. Below, we provide a detailed analysis
Upon further inspection, we discovered that these applications            of the vulnerability detection performance of EvoCrawl and
do not heavily rely on JavaScript events to reveal links or               BlackWidow for each application.
forms, unlike others. Consequently, dependency tracking does                 Humhub. Both EvoCrawl and BlackWidow fail to detect
not substantially increase coverage for these applications.               the vulnerability because it requires the crawlers to re-login as



                                                                     11
another user to manifest. Although both crawlers successfully          HotCRP, however, cannot be exploited by attackers as it is
injected payloads into the injection point, which is the “name”        only visible to admin users and protected by a CSRF token.
field of the Humhub Space, they could not complete the                    For Kanboard, EvoCrawl successfully identifies one stored
necessary steps to detect the vulnerability.                           XSS vulnerability, which has been reported to the developers
   Kanboard. EvoCrawl successfully detects 2 out of 3 vul-             and will be patched in future versions.
nerabilities in Kanboard. The vulnerability that both EvoCrawl            EvoCrawl generates one false positive in Humhub.
and BlackWidow fail to detect, similar to the one in Humhub,           EvoCrawl detects one injection field that allows the website
requires the crawler to re-login as another user. The vulner-          owner to inject a custom script for tracking page statistics.
ability detected only by EvoCrawl requires the crawler to              Since the web developer intentionally designed the field to
first create a “task” under a “project” in Kanboard and then           accept script as input, we conservatively counted this as a
inject the payload into the “external link” field within the           false positive for EvoCrawl.
task. As mentioned in subsection V-B, BlackWidow fails to
leave some fields blank when submitting the form to create             C. IDOR Vulnerabilities
tasks. Consequently, it cannot submit the task creation form
and detect this vulnerability.                                            Table VI presents the results of the IVD evaluation. To
   ImpressCMS. EvoCrawl successfully captures two vulnera-             assess its performance, we collected a variety of metrics. These
bilities in ImpressCMS on the “edit user” page and the “blocks         include the total number of URLs discovered by EvoCrawl,
admin” page. For the first vulnerability, BlackWidow fails             the number of URLs classified as private, the number of
to bypass the input constraints of a field within the form,            URLs classified as public, and the number of false positives.
while EvoCrawl finds the sequences of interactions that leave          Additionally, we categorized vulnerable endpoints into two
it blank. For the second vulnerability, the form containing            groups: those arising from the site builder’s incorrect config-
the injection field exists in a hidden part of the application;        uration or privilege settings (Vul-Type1), and those resulting
BlackWidow fails to find the correct interaction sequences to          from improper code implementation by web developers (Vul-
reveal it.                                                             Type2).
   WordPress. Both EvoCrawl and BlackWidow find the                       As described in the design section, the IVD relies on a
vulnerability in the “taxonomy name” field, but BlackWidow             sitemap to classify resources as public or private. Resources
fails to find the vulnerability in the “upload filename” field.        reachable from both the admin and unprivileged users’ UI are
This is because BlackWidow attempts to iterate through all             classified as public. Conversely, if the paths exist only in the
the combinations of JavaScript events, which slows down the            admin UI, IVD classifies the resources as private. However,
crawler.                                                               some public resources may also lack paths in the unprivileged
                                                                       UI of the application, leading the IVD to misclassify these
                                                                       public resources as private. Because these resources are in
B. Zero-day XSS Vulnerabilities Detection
                                                                       fact public, when the IVD later finds that they are accessible to
   We test EvoCrawl using the latest versions of benchmarks            unprivileged users and reports them, the resources will result in
previously used in our coverage experiment our coverage                false positives. This issue is particularly evident in applications
experiment. This demonstrates the ability of EvoCrawl to               like phpBB and HotCRP, which account for 374 out of 385 and
uncover Zero-day XSS vulnerabilities.                                  35 out of 39 false positives, respectively. For the remaining
   EvoCrawl has identified 5 zero-day XSS vulnerabilities              false positives, the reason is that the crawler itself is not able to
across 10 web applications, all of which have been reported.           find all existing navigation paths for a public resource within
Among these, a vulnerability in HotCRP and a vulnerability in          the allotted time.
Kanboard have been patched. Two WordPress vulnerabilities                 Regarding Vul-Type1, the IVD has uncovered multiple
have been acknowledged, yet they won’t be addressed as                 endpoints that directly expose application resources such
the injection point for the XSS attack is not included in the          as images and JavaScript files. For example, some of the
threat model that WordPress developers consider. The second            detected endpoints resemble http://localhost/path/
vulnerability in HotCRP will not be fixed as the requirements          sample.png. Attackers could access these resources by
for exploitation are outside what the developer considers the          sending requests targeting these endpoints without authenti-
expected usage model of HotCRP.                                        cation. Although the application code itself does not cause
   For WordPress, EvoCrawl identifies two stored XSS vul-              these vulnerable endpoints, we still believe it is important for
nerabilities, which can only be exploited by admin or editor           the crawler to identify such endpoints. This capability helps
users. The developers have decided not to address these                site builders ensure that the privilege settings for each folder
vulnerabilities as admins and editors are considered trusted           are configured appropriately.
in their threat model.                                                    For Vul-type2, the IVD discovers 3 vulnerable endpoints
   In HotCRP, we find one stored XSS vulnerability and one             across 10 web applications. All of these vulnerabilities have
reflected XSS vulnerability. The stored XSS vulnerability has          been reported. In the case of ImpressCMS, one vulnerability
been acknowledged by the developers and will be fixed in               has been acknowledged and the patch for it is currently under
future versions of the application. The reflected XSS bug in           development. Another vulnerability is still under inspection.



                                                                  12
                                        TABLE VI: IDOR Vulnerability Detector Results

                                         URLs     Private URLs   Public URLs        FP    Vul-Type1   Vul-Type2
                            WordPress     1025         379           646             9       106          0
                             HotCRP       526          415           111             39       3           0
                             Humhub      10729        9451          1278             0        5           0
                              Drupal      1908        1242           666             4        55          0
                            Kanboard      7973        4511          3462             17       0           0
                              phpBB       1684        1527           158            385       0           0
                             Opencart     1202         870           332             4        60          0
                            Dokuwiki      3121         864          2257             8        13          0
                           ImpressCMS     615          593            22             0       111          2
                              Gitlab      1382         640           742             27       63          1



The vulnerability in Gitlab has been reported and will be                      users’ information including avatar URL, username and
addressed in a future version.                                                 states, etc.
D. Summary of New Vulnerabilities Found                                                         VII. L IMITATIONS
   In total, EvoCrawl has identified eight vulnerabilities in pop-        Parameter Tuning. For optimal results, EvoCrawl currently
ular web applications such as WordPress, HotCRP, Kanboard,                requires manual parameter adjustments within the fitness func-
ImpressCMS, and Gitlab. Out of these, six vulnerabilities have            tion. In the future, we aim to conduct a more comprehensive
been acknowledged and confirmed by the developers. The                    analysis of the influence of each parameter. Our goal is
details of each vulnerability are as follows:                             to design a system that can autonomously fine-tune these
   • WordPress (acknowledged but not fixed): The two XSS                  parameters, enabling adaptation to the specific needs of each
      injection points of WordPress are the comment field                 tested application.
      and the post title field. Both of these fields lack proper          Seed Selection. In many cases, various URLs can direct to the
      sanitization, allowing editor users or admin users to inject        same or highly similar pages within applications. For example,
      custom scripts into them. According to the WordPress                pages displaying objects with different sorting criteria may
      security policy, XSS injection points that can only be              possess distinct URLs. As EvoCrawl relies on page URLs
      exploited by higher-level users will not be fixed.                  as seeds for crawling, there’s a potential for redundancy,
   • HotCRP (acknowledged and fixed) [19]: One XSS injec-                 where the tool might spend time crawling pages it has already
      tion point on settings/decisions page. Chair or                     processed, thereby decreasing efficiency further. In future de-
      admin users can inject custom scripts into the decision             velopments, we will try to implement more effective methods
      name field.                                                         for distinguishing between different pages. Instead of relying
   • HotCRP (reported but not acknowledged): EvoCrawl                     solely on page URLs, we aim to employ techniques such as
      identified a reflected XSS injection point on the                   DOM comparison to achieve greater accuracy and precision.
      settings/reviews page, specifically in the round
                                                                                             VIII. R ELATED W ORK
      name field. However, this injection point is only accessi-
      ble to admin users and is protected by a CSRF token, so             A. Access Control Vulnerability Scanners
      the developer does not consider it a vulnerability.                    [4], [5], [3], [21] detect access-control vulnerabilities in a
   • Kanboard (acknowledged and fixed) [20]: One XSS in-                  white-box manner. However, only doing state analysis can lead
      jection point on settings/api page, enabling admin                  to missing certain links, since some of them are generated
      users to inject scripts to the application URL field.               during the run time. Overall, white-box methods are always
   • ImpressCMS (acknowledged and being fixed): An IDOR                   limited by the language of the source code, therefore, making
      vulnerability on endpoint userinfo.php?id=1. At-                    it hard to generalize for all websites or web applications.
      tackers can acquire other users’ information by changing               Yelp’s Fuzz-lightyear is a framework designed to automate
      the value of the id parameter.                                      IDOR discovery through stateful fuzzing [22]. It leverages
   • ImpressCMS         (reported and still under inspec-                 the Swagger or OpenAPI specifications of a web application,
      tion):    An      IDOR      vulnerability   on     endpoint         first proposed in the RESTler paper by Atlidakis et al. [23].
      /libraries/image-editor/image-edit.                                 RESTler was designed to be a generic bug-detecting tool.
      php?image_id=1&uniq=. Attackers can force                           Therefore, it can only detect the bugs that cause the app server
      browsing to the private images by changing the                      to respond with an HTTP 500 (Internal Server Error) code
      image id.                                                           and cannot detect if a purposely formed malicious request
   • GitLab (acknowledged and fixed): An IDOR vulnerability               succeeded.
      on       endpoint       autocomplete/users.json?                       AuthScope by Zuo et al. [24] has a similar approach to
      search=&active=true&current_user=true.                              EvoCrawl’s IVD in that it focuses on automatically executing
      The AJAX request targeting at this endpoint reveals all             a mobile app and detecting vulnerable authorizations. They



                                                                     13
perform differential traffic analysis to recognize the protocol           D. Machine Learning in Web Scanning
fields in the request structure which are then automatically sub-
                                                                             Lee et al. [33] propose Link, a black-box scanner that
stituted to check for correct authorizations. They also develop
                                                                          applies reinforcement learning to adapt the generated XSS
a targeted dynamic activity explorer to automatically log in to
                                                                          payloads for each input field by observing the received
the app and explore the app activities in a prioritized depth-
                                                                          responses. Link iterates through URL-Parameter pairs and
first search approach to get post-authentication messages. This
                                                                          adapts payloads based on the received response after each
works well for mobile apps due to the layered structure of
                                                                          attack. However, it mainly focuses on adapting the payloads
the in-app activities. They, however, do not handle dynamic
                                                                          while EvoCrawl tries to maximize the code coverage of an
resource generation. Furthermore, they assume that all post-
                                                                          application.
login resources are private and therefore may still have a lot
                                                                             Mind2Web [34] is a generalist web agent that utilizes
of false positives even after pruning public activities/interfaces
                                                                          Large Language Models (LLMs) to complete tasks based
accessible prior to login.
                                                                          on language instructions and by parsing HTML. However,
B. Web Crawlers                                                           it still requires specific language instructions for each task,
   BlackWidow by Eriksson et al. [6] and jAk by Pellegrino                which limits its ability to automatically scan applications.
et al. [8] also build their navigation graph with client-side             Consequently, LLM-based web agents have not yet been a
JavaScript events and HTML forms. However, they search the                good fit for automatic vulnerability detection.
target sequences by enumerating the nodes in their navigation
graph, causing the crawlers to waste extra time exploring                                          IX. C ONCLUSION
events that are not related, decreasing the overall performance.             Our experiments show that using an evolutionary search
Furthermore, they capture the JS events by hacking the                    algorithm in conjunction with dependency tracking enables
addEventListener function dynamically each time a page                    EvoCrawl to perform a fine-grain search of web applications.
has been loaded. This method is not robust and sometimes                  This enables EvoCrawl to attain greater code coverage and
misses events on the page.                                                submit more inputs to web applications than previous ap-
   Enemy of the State by Doupé et al. [7] uses static links and
                                                                          proaches. In particular, we use evolutionary search to gen-
forms to build the navigation graph but misses the JavaScript
                                                                          erate sequences of web interactions to target certain favorable
events on the client side. Since many modern web applications
                                                                          events, such as successfully submitting forms and finding new
heavily rely on SPA (single-page applications) and AJAX
                                                                          fields and elements through which defect triggering can be
techniques, it is hard for Enemy of the State to fully explore
                                                                          submitted to the web application. We find that dependency
these websites.
                                                                          tracking also plays an important role in reducing the search
   Crawljax by Mesba et al. [9] uses a state machine to
                                                                          space of web interaction sequences.
guide the crawling process. Each state represents a unique
DOM (Document Object Model) of the web page. However,                                            ACKNOWLEDGMENT
CrawlJAX cannot track dependencies among different states.
   There are other black-box scanners [25], [26] but they                    We thank the anonymous reviewers and shepherd for their
mainly focus on vulnerability detection. Deemon [25] is able              insightful feedback. We also acknowledge Emily Wan for
to detect the CSRF vulnerability by modeling the behavior of              her contributions with web application implementation and
the application, while Pellegrino and Balzarotti [26] proposed            testing. Funding for this work was provided in part by, NSERC
an automatic tool to detect logic errors with analysis on                 Discovery Grant RGPIN-2018-05931, a contract with Telus,
interaction traces.                                                       and NSERC Alliance Grant ALLRP 586310-23. David Lie is
   Recently, grey-box fuzzing techniques have gained traction             supported by a Tier 1 Canada Research Chair.
for testing web applications [27], [28], [29]. However, it is
worth noting that [27], [28] are specifically designed for testing                                    R EFERENCES
PHP applications, limiting their applicability. Additionally, the
                                                                          [1] (2021) Owasp top ten. [Online]. Available: https://owasp.org/
effectiveness of Witcher [29] is related to the performance of                www-project-top-ten/
the black-box scanner it incorporates.                                    [2] J. Zhu, B. Chu, H. Lipford, and T. Thomas, “Mitigating access control
                                                                              vulnerabilities through interactive static analysis,” in Proceedings
C. Evolutionary Search in Web                                                 of the 20th ACM Symposium on Access Control Models and
   Attwood et al. [30] summarize some works that use evo-                     Technologies, ser. SACMAT ’15. New York, NY, USA: Association
                                                                              for Computing Machinery, 2015, p. 199–209. [Online]. Available:
lutionary search in web security, but none of them use it to                  https://doi.org/10.1145/2752952.2752976
crawl web applications. [31] and [32] both use evolutionary               [3] F. Sun, L. Xu, and Z. Su, “Static detection of access control vulnera-
algorithms to generate payloads that are more likely to pass                  bilities in web applications.” in USENIX Security Symposium, vol. 64,
                                                                              2011.
through the server sanitizer and find an XSS vulnerability.               [4] M. Monshizadeh, P. Naldurg, and V. N. Venkatakrishnan, “Mace:
However, the evolutionary algorithms are used to generate                     Detecting privilege escalation vulnerabilities in web applications,” in
input payloads and not for crawling. On the other hand,                       Proceedings of the 2014 ACM SIGSAC Conference on Computer
                                                                              and Communications Security, ser. CCS ’14. New York, NY, USA:
EvoCrawl’s goal is to try revealing as many sources as possible               Association for Computing Machinery, 2014, p. 690–701. [Online].
but not generate inputs that successfully pass sanitizer checks.              Available: https://doi.org/10.1145/2660267.2660337




                                                                     14
 [5] J. P. Near and D. Jackson, “Finding security bugs in web applications             [27] O. van Rooij, M. A. Charalambous, D. Kaizer, M. Papaevripides, and
     using a catalog of access control patterns,” in Proceedings of the                     E. Athanasopoulos, “Webfuzz: Grey-box fuzzing for web applications,”
     38th International Conference on Software Engineering, ser. ICSE ’16.                  in Computer Security – ESORICS 2021: 26th European Symposium
     New York, NY, USA: Association for Computing Machinery, 2016, p.                       on Research in Computer Security, Darmstadt, Germany, October
     947–958. [Online]. Available: https://doi.org/10.1145/2884781.2884836                  4–8, 2021, Proceedings, Part I. Berlin, Heidelberg: Springer-
 [6] B. Eriksson, G. Pellegrino, and A. Sabelfeld, “Black widow: Blackbox                   Verlag, 2021, p. 152–172. [Online]. Available: https://doi.org/10.1007/
     data-driven web scanning,” in 2021 IEEE Symposium on Security and                      978-3-030-88418-5 8
     Privacy (SP), 2021, pp. 1125–1142.                                                [28] F. Gauthier, B. Hassanshahi, B. Selwyn-Smith, T. N. Mai, M. Schlüter,
 [7] A. Doupé, L. Cavedon, C. Kruegel, and G. Vigna, “Enemy                                and M. Williams, “Backrest: A model-based feedback-driven greybox
     of the state: A State-Aware Black-Box web vulnerability                                fuzzer for web applications,” ArXiv, vol. abs/2108.08455, 2021.
     scanner,” in 21st USENIX Security Symposium (USENIX Security                      [29] E. Trickel, F. Pagani, C. Zhu, L. Dresel, G. Vigna, C. Kruegel, R. Wang,
     12).     Bellevue, WA: USENIX Association, Aug. 2012, pp.                              T. Bao, Y. Shoshitaishvili, and A. Doupé, “Toss a Fault to Your Witcher:
     523–538. [Online]. Available: https://www.usenix.org/conference/                       Applying Grey-box Coverage-Guided Mutational Fuzzing to Detect SQL
     usenixsecurity12/technical-sessions/presentation/doupe                                 and Command Injection Vulnerabilities,” in Proceedings of the IEEE
 [8] G. Pellegrino, C. Tschürtz, E. Bodden, and C. Rossow, “jäk: Using dy-                Symposium on Security and Privacy, May 2023.
     namic analysis to crawl and test modern web applications,” in Research            [30] S. Attwood, W. Li, and R. Kharel, “Evolutionary algorithms in web
     in Attacks, Intrusions, and Defenses, H. Bos, F. Monrose, and G. Blanc,                security: Exploring untapped potential,” in 2020 12th International
     Eds. Cham: Springer International Publishing, 2015, pp. 295–316.                       Symposium on Communication Systems, Networks and Digital Signal
 [9] A. Mesbah, E. Bozdag, and A. van Deursen, “Crawling ajax by inferring                  Processing (CSNDSP), 2020, pp. 1–6.
     user interface state changes,” in 2008 Eighth International Conference            [31] F. Duchene, S. Rawat, J.-L. Richier, and R. Groz, “Kameleonfuzz:
     on Web Engineering, 2008, pp. 122–134.                                                 Evolutionary fuzzing for black-box xss detection,” in Proceedings
[10] A. Doupé, M. Cova, and G. Vigna, “Why johnny can’t pentest: An                        of the 4th ACM Conference on Data and Application Security and
     analysis of black-box web vulnerability scanners,” in Detection of                     Privacy, ser. CODASPY ’14. New York, NY, USA: Association
     Intrusions and Malware, and Vulnerability Assessment, C. Kreibich and                  for Computing Machinery, 2014, p. 37–48. [Online]. Available:
     M. Jahnke, Eds. Berlin, Heidelberg: Springer Berlin Heidelberg, 2010,                  https://doi.org/10.1145/2557547.2557550
     pp. 111–131.                                                                      [32] A. Avancini and M. Ceccato, “Security testing of web applications: A
[11] “Testcafe,” 2023. [Online]. Available: https://testcafe.io/                            search-based approach for cross-site scripting vulnerabilities,” in 2011
[12] “Skipfish - web application security scanner,” 2022. [Online]. Available:              IEEE 11th International Working Conference on Source Code Analysis
     https://code.google.com/archive/p/skipfish/                                            and Manipulation, 2011, pp. 85–94.
[13] “Arachni,” 2022. [Online]. Available: https://ecsypno.com/pages/                  [33] S. Lee, S. Wi, and S. Son, “Link: Black-box detection of cross-site
     arachni-web-application-security-scanner-framework                                     scripting vulnerabilities using reinforcement learning,” in Proceedings
[14] “w3af,” 2022. [Online]. Available: http://w3af.org/                                    of the ACM Web Conference 2022, ser. WWW ’22. New York,
[15] “Xdebug-code coverage analysis,” 2023. [Online]. Available: https:                     NY, USA: Association for Computing Machinery, 2022, p. 743–754.
     //xdebug.org/docs/code coverage                                                        [Online]. Available: https://doi.org/10.1145/3485447.3512234
[16] “php-code-coverage,” 2023. [Online]. Available: https://github.com/               [34] X. Deng, Y. Gu, B. Zheng, S. Chen, S. Stevens, B. Wang, H. Sun, and
     sebastianbergmann/php-code-coverage                                                    Y. Su, “Mind2web: Towards a generalist agent for the web,” 2023.
[17] “Coverband,” 2023. [Online]. Available: https://github.com/danmayer/
     coverband                                                                                                         A PPENDIX
[18] “Cvedetails,” 2024. [Online]. Available: https://www.cvedetails.com/
[19] “Xss         vulnerability       in        hotcrp,”      2024.       [On-           Table VII presents the absolute value of the coverage results
     line].        Available:         https://github.com/kohler/hotcrp/commit/
     d4ffdb0ef806453c54ddca7fdda3e5c60356285c
                                                                                       of EvoCrawl when compared with other crawlers.
[20] “Xss        vulnerability       in       kanboard,”       2024.      [On-           For the coverage experiments, the keywords that are used
     line].     Available:      https://github.com/kanboard/kanboard/commit/           by the crawlers to avoid crawling on user pages, configuration
     3824e6e9aa29017e96caae10670546db85dd9ed7
[21] S. Son, K. S. McKinley, and V. Shmatikov, “Fix me up: Repairing
                                                                                       pages, and plugin installation pages:
     access-control bugs in web applications,” in Network and Distributed
     System Security Symposium, 2013.                                                  b l o c k e d p a g e s : [ mode= c o o k i , %2F d i s a b l e ,
[22] A. Loo, “Automated idor discovery through stateful swagger fuzzing,”                     modulesadmin , d a t a b a s e , atom , p r o f i l e ,
     2020. [Online]. Available: https://engineeringblog.yelp.com/2020/01/                       update −core , password , maintenance ,
     automated-idor-discovery-through-stateful-swagger-fuzzing.html
[23] V. Atlidakis, P. Godefroid, and M. Polishchuk, “Restler: Stateful rest api               plugin , user / 1 / edit , user / 2 / edit , user
     fuzzing,” in 2019 IEEE/ACM 41st International Conference on Software                     / 3 / e d i t , CorePluginsAdmin ,
     Engineering (ICSE), 2019, pp. 748–758.                                                   UsersManager , p a g e = c o n f i g , p e o p l e ,
[24] C. Zuo, Q. Zhao, and Z. Lin, “Authscope: Towards automatic discovery
     of vulnerable authorizations in online services,” in Proceedings of the
                                                                                              r o l e s , a u t h e n t i c a t i o n , usermanager ,
     2017 ACM SIGSAC Conference on Computer and Communications                                u s e r / u s e r , = a c l , p a g e = e x t e n s i o n , mode=
     Security, ser. CCS ’17. New York, NY, USA: Association for                               c o o k i e , e d i t u s e r , r = admin%2 F s e t t i n g ,
     Computing Machinery, 2017, p. 799–813. [Online]. Available: https:
     //doi.org/10.1145/3133956.3134089
                                                                                              viewpmsg , l o g o u t , s i g n o u t , j a v a s c r i p t ,
[25] G. Pellegrino, M. Johns, S. Koch, M. Backes, and C. Rossow,                                l o g i n , s i g n i n , mode= a u t h , atom ,
     “Deemon: Detecting csrf with dynamic analysis and property graphs,”                      a u t h e n t i c a t i o n , acp board , acp captcha
     in Proceedings of the 2017 ACM SIGSAC Conference on Computer
     and Communications Security, ser. CCS ’17. New York, NY, USA:
                                                                                              , d e l e t e c o o k i e s , admin%2
     Association for Computing Machinery, 2017, p. 1757–1771. [Online].                       Fauthentication , UserListController , r
     Available: https://doi.org/10.1145/3133956.3133959                                      = l d a p%2Fadmin , admin%2Fmodule , %2
[26] G. Pellegrino and D. Balzarotti, “Toward black-box detection of logic
     flaws in web applications,” in NDSS 2014, Network and Distributed
                                                                                              F a c c o u n t , u s e r %2F d e l e t e , u s e r %2F e d i t ,
     System Security Symposium, 23-26 February 2014, San Diego, USA,                          mode= r e g d e t a i l s , u s e r s , f c t = u s e r ,
     ISOC, Ed., San Diego, 2014, iSOC. Personal use of this material                          UserModificationController ,
     is permitted. The definitive version of this paper was published
     in NDSS 2014, Network and Distributed System Security Sympo-
                                                                                              UserCredentialController ,
     sium, 23-26 February 2014, San Diego, USA and is available at :                          TwoFactorController ]
     http://dx.doi.org/10.14722/ndss.2014.23021.




                                                                                  15
TABLE VII: This Table presents the coverage results of EvoCrawl compared with other crawlers. Column A\B presents the
number of unique lines executed by EvoCrawl. Column A∩B shows the number of common lines covered by both crawlers.
Column B\A denotes the number of unique lines executed by the other crawler.
                                             BlackWidow                       JAK                     CrawlJAX
                      Crawler
                                      A\B       A∩B      B\A      A\B         A∩B      B\A     A\B      A∩B      B\A
                      WordPress      57398      45868    3368    58721        44545    1063   67905     35361    673
                      HotCRP         10706      17679     331    14447        13938     131   11412     16973    250
                      Dokuwiki        4191      12531     284     3099        13623      44    8885      7837     22
                      Drupal         42460      54691   21437    15843        45460    1195   46545     14758    767
                      Humhub         10064      21606    1741    16392        15279     398   22463      9207    290
                      ImpressCMS      6157      16485     622     8418        14224     624   11638     11004    390
                      Kanboard       10130       5246      4      9626         5750    1193   10681      4695    488
                      Opencart        8353      14500     672
                      phpBB          21781      14142   11616
                      GitLab         10775     172367     617    19398        163744   419    14323    168819    2652



TABLE VIII: This Table presents the coverage results                              g i t l a b : [ Not Found ]
of EvoCrawl compared with EvoCrawl-nodt Column A\B                        }
presents the number of unique lines executed by EvoCrawl.
Column A∩B shows the number of common lines covered by                                             A PPENDIX A
both crawlers. Column B\A denotes the number of unique                                         A RTIFACT A PPENDIX
lines executed by the EvoCrawl-nodt.                                      A. Description & Requirements
                                  EvoCrawl-nodt                              1) How to access: The artifact has been published in Zen-
            Crawler
                             A\B     A∩B        B\A                       odo: https://doi.org/10.5281/zenodo.13617803. The GitHub
            WordPress       29676    73590     21738                      Repository for the same is https://anonymous.4open.science/
            HotCRP           8578     19807      627
            Dokuwiki          91     16631      112                       r/evocrawl-0BF8/. The README file inside the artifact in-
            Drupal           2321     58982     1318                      cludes the necessary steps for running the Artifact on target
            Humhub           576     31094       34                       applications.
            ImpressCMS       1039     21603      604
            Kanboard         4484     10892      246                         2) Hardware dependencies: None.
            Opencart         1151     21675       59                         3) Software dependencies: Our code only supports Linux
            phpBB            8926     17340     3113                      (Ubuntu preferred) operating system. The code depends on
            GitLab           3034    180108     2131
                                                                          Node v12.22.12 and npm 6.14.16, and a variety of node
                                                                          modules. A requirements installation instruction can be found
                                                                          in the README.
  The full list of the access-denied sentence used by the IVD                4) Benchmarks: Our codes have been evaluated on 10
of EvoCrawl is:                                                           web applications including: WordPress-6.1.1, Drupal-9.3.15,
                                                                          HotCRP-v3.0b3, Dokuwiki-2022-07-31 “Igor”, ImpressCMS-
{
                                                                          1.4.4, phpBB-3.3.8, Gitlab-11.5.1, Kanboard-1.2.22, Opencart-
     d r u p a l : [ Access denied , not
                                                                          4.0.0, and Humhub-1.12.1.
            a u t h o r i z e d , p a g e n o t found ,
            permission i s required , query                               B. Artifact Installation & Configuration
            argument i s i n v a l i d ] ,                                  The Installation and Configuration steps for the Artifact can
     w o r d p r e s s : [ Not Allowed , i n v a l i d                    be found in the repository README.
           nounce , h a s e x p i r e d , p a g e n o t
           found , w o r d p r e s s e r r o r ] ,                        C. Experiment Workflow
     dokuwiki : [ For admins only , have                                     The high-level workflow of the experiments is: 1) install and
           enough r i g h t , p e r m i s s i o n d e n i e d ] ,         configure the web application (benchmark) 2) enable coverage
     o p e n c a r t : [ do n o t h a v e p e r m i s s i o n t o         tracking and database logging for the benchmark 3) install and
            access ] ,                                                    configure the artifact 4) execute the artifact on the benchmark.
     h o t c r p : [ Page i n a c c e s s i b l e , n o t found
            , Redirection , is − e r r o r ] ,                            D. Major Claims
     kanboard : [ didn ’ t f i n d t h i s                                    • (C1): EvoCrawl achieves an average code coverage in-
            i n f o r m a t i o n , Access Forbidden ] ,                        crease of 59% and outperforms BlackWidow by HTML
     humhub : [ You a r e n o t p e r m i t t e d , Could                       forms with the POST method 5 times more frequently.
              n o t f i n d r e q u e s t e d page , E r r o r ] ,            • (C2): EvoCrawl successfully identifies eight zero-day
     phpbb : [ n o t a l l o w e d ] ,                                          bugs in WordPress, HotCRP, Kanboard, ImpressCMS,
     impresscms : [ not allowed ] ,                                             and GitLab.



                                                                     16
E. Evaluation                                                             web application instance. The configuration file within the
   We provide experiment instructions to demonstrate that our             artifact also needs to be updated. Detailed steps for updating
artifact is functional, configurable, and usable. While the in-           configurations can be found in the root README file of the
structions can partially reproduce the results, full reproduction         repository.
requires conducting each experiment for 24 hours on each                     [Execution] Run the crawl/monit.py with MODE parameter
benchmark.                                                                set to IDOR. The rest are the same as Experiment E1.
   1) Experiment (E1): [Coverage and HTML form Experi-                       [Results] Within the repository, run the script detect.sh.
ment] [30 human minutes + 8 compute-hour]: Run the artifacts              The script will list all the vulnerable endpoints for IDOR
on the web applications (benchmarks) with coverage tracking               vulnerabilities.
and data binary log enabled. Collect the global coverage
(number of lines executed) and the number of submitted
HTML forms after an 8-hour execution.
   [Preparation]
   • Install the target benchmark with coverage tracking and
      database binary log enabled. The installation guide and
      Dockerfile for benchmarks can be found within the ex-
      periments/ folder of the repository.
   • Follow the web application default configuration process
      provided by the web application, and Register an admin
      user on the web application instance.
   • Complete the requirements of the Artifacts by updating
      the login credentials of the web application in the con-
      figuration files within the Artifacts. Detailed steps can be
      found in the root README file of the repository.
   [Execution] Run the crawl/monit.py with MODE parameter
set to crawler. The monit.py script will start all the crawler
processes and shut them down after 8 hours (this duration
can be changed). Detailed steps can be found in the Crawler
section of the root README file in the repository.
   [Results] The README file within the experiments/ folder
contains instructions on collecting the coverage and number
of submitted forms from the artifact on the benchmark after
the experiment.
   2) Experiment (E2): [XSS Vulnerability Detection Exper-
iment] [30 human minutes + 8 compute hours]: Run the
artifacts on the web applications (benchmarks) with coverage
tracking and data binary log enabled. Collect the number of
XSS vulnerabilities detected after an 8-hour execution
   [Preparation] Same as Experiment E1.
   [Execution] Run the crawl/monit.py with MODE parameter
set to XSS. The rest are the same as Experiment E1.
   [Results] Within the data/[target benchmark] folder of the
repository, the sources.json and the sinks.json files should list
the sources and the sinks of the XSS vulnerabilities. Matching
between sources and sinks can be achieved using unique
identifiers assigned by the artifact. The original experiment in
the paper lasted for 24 hours, so 8 hours may not be enough
to expose all the bugs.
   3) Experiment (E3): [IDOR Vulnerability Detection Ex-
periment] [30 human minutes + 8 compute-hours]: Run the
artifacts on the web applications (benchmarks) with coverage
tracking and data binary log enabled. Collect the number of
IDOR vulnerabilities detected after an 8-hour execution
   [Preparation] Same with Experiment E1 but need to reg-
ister two additional users with lower-level privileges on the



                                                                     17
