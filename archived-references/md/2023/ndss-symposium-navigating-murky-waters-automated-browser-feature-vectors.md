---
type: Article
title: "Navigating Murky Waters: Automated Browser Feature Testing for Uncovering Tracking Vectors"
resource: "https://www.ndss-symposium.org/ndss-paper/navigating-murky-waters-automated-browser-feature-testing-for-uncovering-tracking-vectors/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:41:35+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/navigating-murky-waters-automated-browser-feature-testing-for-uncovering-tracking-vectors/"
    title: "Navigating Murky Waters: Automated Browser Feature Testing for Uncovering Tracking Vectors"
    author: Mir Masood Ali, Binoy Chitale, Mohammad Ghasemisharif, Chris Kanich, Nick Nikiforakis, Jason Polakis
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2023/02/ndss2023_f72_paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/2024/09/2023-f72-slides.pdf"
authors:
  - Mir Masood Ali
  - Binoy Chitale
  - Mohammad Ghasemisharif
  - Chris Kanich
  - Nick Nikiforakis
  - Jason Polakis
canonical_url: ""
cited_by:
  - "2023.md:91"
commit: ""
content_sha256: 708dd2d00f3dd93f6bd92fbf9d0b31bebf35ca14ebccc24e404d3492bef5d0cd
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/navigating-murky-waters-automated-browser-feature-testing-for-uncovering-tracking-vectors/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 7573f176a5c99bd1ff76a67f17805ceece9a3012ef2d291a6391149fd04fdef4
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2023/02/ndss2023_f72_paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:41:35+00:00"
slug: ndss-symposium-navigating-murky-waters-automated-browser-feature-vectors
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Navigating Murky Waters: Automated Browser Feature Testing for Uncovering Tracking Vectors

**Navigating Murky Waters: Automated Browser Feature Testing for Uncovering Tracking Vectors** - Mir Masood Ali, Binoy Chitale, Mohammad Ghasemisharif, Chris Kanich, Nick Nikiforakis, Jason Polakis, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/navigating-murky-waters-automated-browser-feature-testing-for-uncovering-tracking-vectors/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2023/02/ndss2023_f72_paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2024/09/2023-f72-slides.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2023/02/ndss2023_f72_paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Navigating Murky Waters: Automated Browser
     Feature Testing for Uncovering Tracking Vectors

Mir Masood Ali† , Binoy Chitale‡ , Mohammad Ghasemisharif† , Chris Kanich† , Nick Nikiforakis‡ , and Jason Polakis†
                               † University of Illinois Chicago, {mali92,mghas2,ckanich,polakis}@uic.edu
                                       ‡ Stony Brook University, {bchitale,nick}@cs.stonybrook.edu


    Abstract—Modern web browsers constitute complex applica-                  Even though new browser mechanisms offer novel func-
tion platforms with a wide range of APIs and features. Critically,        tionality, they also increase the browser’s attack surface,
this includes a multitude of heterogeneous mechanisms that allow          introducing new flaws and opportunities for misuse. One
sites to store information that explicitly or implicitly alters client-   particularly problematic class of flaws involves mechanisms
side state or functionality. This behavior implicates any browser         that can be abused for re-identifying and tracking users. Re-
storage, cache, access control, and policy mechanism as a poten-
tial tracking vector. As demonstrated by prior work, tracking
                                                                          searchers have already demonstrated novel tracking techniques
vectors can manifest through elaborate behaviors and exhibit              that leverage browser mechanisms which at face value do not
varying characteristics that differ vastly across different browsing      resemble tracking mechanisms, such as, HSTS policies [78]
contexts. In this paper we develop CanITrack, an automated,               and favicon caches [74]. These studies have showed that any
mechanism-agnostic framework for testing browser features and             mechanism that stores some form of data in the browser or
uncovering novel tracking vectors. Our system is designed for             affects client-side policies is a potential tracking vector.
facilitating browser vendors and researchers by streamlining the
systematic testing of browser mechanisms. It accepts methods                  This observation has serious implications for browser
to read and write entries for a mechanism and calls these                 vendors’ internal testing procedures, which may not include
methods across different browsing contexts to determine any               testing workflows for assessing this specific privacy risk. We
potential tracking vulnerabilities that the mechanism may expose.         argue that any client-side caching, storage, access-control,
To demonstrate our system’s capabilities we test 21 browser
mechanisms and uncover a slew of tracking vectors, including 13
                                                                          or policy mechanism should be thoroughly evaluated as a
that enable third-party tracking and two that bypass the isolation        potential tracking vector prior to its public release. More-
offered by private browsing modes. Importantly, we show how               over, once those mechanisms are actually deployed, security
two separate mechanisms from Google’s highly-publicized and               researchers may employ manual or ad hoc approaches that do
widely-discussed Privacy Sandbox initiative can be leveraged for          not comprehensively test all pertinent aspects of a potential
tracking. Our experimental findings have resulted in 20 disclosure        tracking vector’s capabilities. As manual testing cannot scale,
reports across seven major browsers, which have set remediation           such endeavors will be limited to a small number of browser
efforts in motion. Overall, our study highlights the complex and          versions, thus being unable to uncover longitudinal patterns of
formidable challenge that browsers currently face when trying to          vulnerability evolution over time [54, 61, 62, 69].
balance the adoption of new features and protecting the privacy
of their users, as well as the potential benefit of incorporating             In this paper we present CanITrack, an automated frame-
CanITrack into their internal testing pipeline.
                                                                          work designed to streamline the testing of browser mechanisms
                                                                          and assessing whether they can be misused as a tracking vector.
                                                                          The modular design of CanITrack provides all the necessary
                       I.   I NTRODUCTION                                 components for orchestrating browsers and web servers, and
                                                                          exploring multiple dimensions of tracking functionality; this
    The privacy of online activities is a growing concern to an
                                                                          includes the effects of first-party (1P) and third-party (3P)
increasing number of users [9], with a recent survey finding
                                                                          navigation, testing the isolation offered by incognito mode,
that 80% of users are worried about online tracking [11]. In
                                                                          and the impact of browsing data being cleared. To achieve our
recent years trackers have pivoted away from cookies, to a
                                                                          design goal of a mechanism-agnostic framework, CanITrack
variety of alternative techniques as a response to cookie-based
                                                                          interacts with basic write() and read() user-provided
tracking countermeasures. In turn, this has attracted increased
                                                                          functions, for the mechanism being tested. These functions
scrutiny from the security community towards identifying new
                                                                          implement a mechanism-specific action that allows our system
tracking vectors. At the same time, browsers have continued
                                                                          to write and read, respectively, one or more bits of information
to evolve as complex application platforms by deploying new
                                                                          that are used for storing and reconstructing a tracking identifier.
features and APIs that further complicate efforts towards
                                                                          For instance, if the developer wishes to test the suitability
restricting online tracking.
                                                                          of using the favicon cache as a tracking vector [74], the
                                                                          write() function would simply require requesting a unique
                                                                          favicon, while the read() function would infer the presence
Network and Distributed System Security (NDSS) Symposium 2023             of that favicon based on whether it is fetched over the network
27 February - 3 March 2023, San Diego, CA, USA
ISBN 1-891562-83-5                                                        or returned from the internal cache. CanITrack then invokes the
https://dx.doi.org/10.14722/ndss.2023.24072                               user-provided methods to assess how access to the mechanism
www.ndss-symposium.org                                                    is limited in multiple first-party (1P) and third-party (3P)
browsing contexts, within the top-level context and from any                Differentiating Tracking from Legitimate Access.
embedded iframes. It also determines if a partitioning key is           Browser mechanisms may save and reuse state across browsing
associated with the mechanism and, if so, infers the key’s              sessions for various purposes. While certain tracking behaviors
composition. Our system additionally develops redirection               (e.g., in 3P contexts) can be straightforwardly assessed as
chains and evaluates methods for extending access to the mech-          privacy-invasive, other scenarios may be more ambiguous. In
anism from a single page, and also orchestrates a web server            our work we consider a capability to be privacy-invasive (i.e.,
that can be used to host resources on multiple paths, ports,            suitable for tracking) based on two factors:
and domains. CanITrack manages the experimental pipeline
using fresh browser instances for each experiment, which are              • Intended Use. While mechanisms like cookies, local stor-
controlled by simulating user interactions, and ensures that its            age, and indexedDB have been designed to store useful
results are consistent with end-user experience.                            1P information, their misuse in cross-origin contexts
                                                                            can result in privacy-invasive tracking behaviors. This
    To experimentally evaluate CanITrack, we implement the                  scenario encompasses what we refer to as 3P tracking
necessary write() and read() functions for 21 browser                       in the remainder of the paper.
mechanisms, including four mechanisms for which we provide                • Bypassing Existing Protections. We consider the ability to
the first exploration of their utility as a tracking vector. We             re-identify users visiting from a private browsing mode
then conduct a comprehensive evaluation of these mechanisms                 session or after having cleared their browsing data to
across a total of 126 versions of seven major browsers (i.e.,               be a privacy-invasive tracking capability. This scenario
Brave, Chrome, Edge, Firefox, Safari, Opera, and Tor) across                encompasses what we refer to as 1P tracking in the
a two-year period and find that all are vulnerable to at least              remainder of the paper.
one new tracking technique in their latest version. Crucially,
we demonstrate how two mechanisms from Google’s widely-                     Threat Model. We assume that when a user visits a website
discussed Privacy Sandbox initiative can be used for third-             the tested browser mechanism is used to store a unique 32-
party tracking. Surprisingly, CanITrack also revealed a new             bit identifier in that browser instance. This identifier is then
behavior of the favicon cache in the latest versions of Chrome          read back in future browsing sessions from the same browser
and Safari, which we leverage for demonstrating a novel                 instance. The attacker misusing the browser mechanism can
history-sniffing attack. Overall, our experiments highlight that        be the visited website itself, or any included 3P entity (e.g.,
our framework streamlines the comprehensive and systematic              through the use of an iframe).
testing of browser mechanisms as potential tracking vectors
while requiring minimal effort from intended users.                         Figure 1 shows the major components of our framework,
                                                                        which we detail below. Given methods to interact with a
In summary, we make the following research contributions:               browser mechanism, CanITrack curates contexts for various
                                                                        experimental scenarios under its test suite and handles the
  • We develop CanITrack, a novel framework that stream-                entire process for automating the testing pipeline. In a nutshell,
    lines the comprehensive testing of browser mechanisms               a browser runner simulates user interactions within various
    as potential tracking vectors.                                      browsing contexts, and generates page visits which execute
  • We experimentally evaluate our system on 21 browser                 the write and read methods for the browser mechanism within
    mechanisms, including four previously-untested mecha-               local browser instances. Following each experiment, the web
    nisms (two are from Google’s Privacy Sandbox), and                  server collects results in a database. Finally, these results are
    demonstrate their suitability as tracking vectors across            automatically gathered, analyzed, and filtered, before generat-
    different deployment scenarios and different browser ver-           ing a vulnerability report for the mechanism.
    sions.
  • Due to the severe privacy implications of our research,               1 Browser Mechanism: CanITrack’s inputs are JavaScript
    we have disclosed our findings to all affected browsers to          methods for interacting with browser mechanisms. These
    enable remediation.                                                 methods are formatted in such a way that CanITrack’s client-
  • To ensure reproducibility, we are making the source code            side testing functions can independently store information
    of CanITrack as well as example implementations of the              (write()) and access existing information (read()) from
    mechanisms evaluated in our experiments available [34].             the browser. While certain types of data can be directly
                                                                        accessed (e.g., data stored in local storage), other types of
                                                                        data can only be indirectly accessed (e.g., data fetched from
       II.   S YSTEM D ESIGN AND I MPLEMENTATION                        a cache) or inferred based on the outcome of an action (e.g.,
    In this section, we first briefly outline the tracking behav-       the result of a client-side security policy being enforced by
iors and threat model that have guided the design of CanITrack.         the browser). Using the framework for a new mechanism
We then detail our framework’s design and implementation.               requires implementing the following two functions that will be
                                                                        called from within a client-side browser environment. Listing 1
    First-party (1P) and Third-party (3P) Context. We                   provides example input methods that interact with a site’s
consider the domain that a user visits to be the first-party (1P)       cookies.
entity, and any access to a browser mechanism made by the 1P
entity or its subdomains as 1P access. On the other hand, we             1) Write(): A method that accepts a string identifier as
refer to any embedded elements (e.g., iframes) served from a                input and translates that into a mechanism-specific action
different domain, or a different domain that the user visits in             (or series of actions) that stores the input into the browser.
the future, as a third-party (3P) entity, and consider access to         2) Read(): A method that implements a mechanism-
the browser mechanism made by these entities as 3P access.                  specific action (or series of actions) that retrieves the

                                                                    2
             1 Browser               2 Test Suite to Evaluate                                                                               7
                                                                                 3 Context Creation
             Mechanism                 Tracking Capabilities



                                  Third-party          Redirection              Embedded    Command-line                          Vulnerability Report
                 Write             Tracking              Chains                  Frames        Flags
                Method
                                           First-party
                                            Tracking
                                                                            Per-context Network Config &   4 Test Configuration
                                   Private         Clear Browser            Domain List  HTTP Headers
                 Read
                                Browsing Mode          Data
                Method                                                                                                            Analysis and Filtering of
                                                                                                                                     Tracking Vectors
                                                         6 Browser Evaluation

                                                                                    Browser Runner
                                     Read Identifier         Write Identifier
             Relevant Files
           and Configuration
              Information
                                                                                                              5 Web Server        Tracking Results DB


Fig. 1: An overview of CanITrack’s architecture and testing pipeline, which evaluates browser mechanisms as potential tracking vectors across
different browsing contexts.

  write (identifier) {                                                                         Websites may access browser mechanisms in legitimate,
      document.cookie = `identifier=${identifier};                                         1P contexts. The nuances of 1P accesses vary depending on
          SameSite=None; Secure`;
  }
                                                                                           the browser mechanism and the browser in question. While,
                                                                                           conceptually, 1P access may not seem like a major privacy
  read () {                                                                                risk, implementation flaws that result in stored identifiers not
     return document.cookie ? document.cookie.match                                        being correctly purged, or websites being able to cross the iso-
         (/identifier=(\S+)/)[1] : null;                                                   lation of private browsing [74], highlight the necessity of this
  }
                                                                                           dimension of our testing pipeline. CanITrack includes three 1P
    Listing 1: Methods to read/write an identifier with cookies.                           tracking tests that are applied to all browser mechanisms.

     previously-stored information from the browser. If suc-                                   Additionally, the potential for 1P tracking indicates that
     cessful, it will return the reconstructed identifier.                                 the browser mechanism can further be exploited by colluding
                                                                                           trackers adopting methods like redirection chains [2, 40] and
    Abstracting the read() and write() methods allows                                      cross-site leaks [58]. CanITrack evaluates three aspects of data
CanITrack to be agnostic of the underlying mechanism. As                                   access in 1P tracking, described below.
new browser mechanisms that exhibit unique idiosyncrasies                                      Can sites track in 1P top-level contexts? Data written by
in terms of behavior and capabilities may be deployed in the                               the browser mechanism can be read on subsequent visits to the
future, our framework follows a modular design allowing it to                              same domain. CanITrack visits a website, siteA.com, and calls
be easily extended for handling additional mechanism-specific                              the write() method. On a subsequent visit to siteA.com, it
requirements. In the following paragraphs, we provide further                              calls the read() method, and observes if the same identifier
details about our framework and elaborate on how the testing                               can be accessed again.
setup is modified depending on additional information about
each browser mechanism.                                                                        Can sites track in 1P iframes? CanITrack checks if stored
                                                                                           data can be read from 1P iframes, and is not restricted to the
  2 Testing Tracking Capabilities: The tracking vectors that                               top-level browsing context (e.g., the favicon cache cannot be
have been used in practice, or demonstrated by researchers, can                            accessed from within an embedded iframe).
vary significantly in terms of capabilities and suitability across
different browsing contexts. As we aim to comprehensively                                     CanITrack visits a website, siteA.com, and calls the
and systematically assess whether a given mechanism can                                    write() method. On a subsequent visit to siteA.com with an
be misused for tracking, our framework must incorporate                                    embedded 1P iframe (siteA.com), it calls the read() method
the necessary testing templates for uncovering all pertinent                               from the iframe, and observes if the same identifier can be
behaviors. To that end, we assembled a list of tracking capa-                              accessed again.
bilities and behaviors to be incorporated into our framework,
inspired by the heterogeneous methods demonstrated by prior                                    Can sites track across 1P subdomains? Websites that
research [38, 74, 75, 78]. Next, we elaborate on the five dimen-                           provide different services on different subdomains can have
sions of tracking explored by our framework’s testing pipeline.                            extended access to stored data that was added by different
                                                                                           subdomains under the same top-level site. While we fo-
                                                                                           cus on tracking, recent work has explored security-related
   1P Tracking. Certain browser mechanisms provide a pro-                                  mechanisms within such a context [76]. CanITrack visits a
cess for locally storing data on the client side based on                                  subdomain, sd1.siteA.com, and calls the write() method.
previously observed resource requests. This data is typically                              On a subsequent visit to a different subdomain, sd2.siteA.com,
associated with the specific domain that set it, and can usually                           it calls the read() method, and observes if the same identifier
be accessed by the domain itself in 1P contexts.                                           can be accessed again.

                                                                                     3
    3P Tracking. If data stored in the browser can be read                 3P tracking even when such entries are only available in 1P
or inferred by 3P domains (i.e., from a different origin than              contexts.
the one that set the data), then the mechanism can allow
                                                                               Despite prior research [59] showing the use of redirections
websites to track users across services. CanITrack evaluates
                                                                           as a popular tracking vector, browser vendors vary in their
three aspects of data access in 3P contexts.
                                                                           mitigation strategies; while Safari attempts to block cross-site
    Can sites track across 3P origins? If the browser mecha-               redirections [4], Google Chrome does not consider the vector
nism is not partitioned and its stored data is globally accessible         to be a privacy-relevant issue. Regardless, past disclosures
from all websites, it creates a significant privacy threat as it can       of tracking vulnerabilities that used redirection chains have
potentially leak sensitive data, including information about the           demonstrated their practicality for tracking without signifi-
user’s browsing history. CanITrack visits a website, siteA.com,            cantly impacting the end-user’s browsing experience [74].
and calls the write() method. On a subsequent visit to a                       CanITrack traverses the redirection chain by updating the
different website, siteB.com, it calls the read() method, and              value of window.location on the client-side. It considers
observes if the same identifier can be accessed again.                     the minimum tests required to write and read a 32-bit identifier.
                                                                           These redirection chains can be traversed as both top-level
    Can sites track while embedded in different 3P contexts?               redirections (i.e., navigating users through multiple domains)
Browsers that partition stored data with a single key may limit            and frame redirections (i.e., only redirecting embedded iframes
access to the domain of the frame that added the entry. Without            while the user accesses content on the top-level frame).
this protection, a site can read the same data entries while
embedded across different 3P origins. For instance, assume                      Private browsing mode. Browsers offer their users the
that a browser visits shopping.com, which includes ad.com in               option of accessing domains in a private browsing mode
an iframe. If ad.com adds data using the browser mechanism                 (i.e., incognito mode), intended for ensuring the user’s privacy
during this visit, the entry is keyed to ad.com. Thereafter, on a          during that browsing session. This session is partitioned from
visit to a different site, say news.com which serves an ad from            normal browser storage and uses separate storage spaces whose
ad.com in an iframe, the embedded 3P, ad.com, can access                   lifetime is limited to that specific session. Data stored during
the data it had stored during the browser’s previous visit to              regular browsing sessions is typically (but not always [74])
shopping.com and identify the user. This allows the advertiser             inaccessible within private browsing sessions, and data stored
to track a user across websites.                                           during the private browsing session is intended to be purged
                                                                           once the session ends [18]. If browsers omit clearing access
    Can sites track from different 3P iframes in the same top-             to stored data before/after the use of private mode, or do not
level context? Browsers that partition stored data with a single           correctly isolate the use of stored policies [78], trackers may be
key may limit access to the domain of the top-level context.               able to correlate the activity of a private-mode browsing ses-
Such partitioning allows embedded 3P entities within the same              sion with a regular session, thereby impacting users’ privacy.
site to share access to the entries of a browser mechanism. An             CanITrack includes tests for detecting the leakage of stored
example of a privacy-invasive attack in such a scenario would              data or use of client-side policies from, to, and within private
be as follows: say a browser visits news.com which serves an               browsing mode sessions.
ad from ad1.com in an iframe. If ad1.com adds some entries
using a browser mechanism during this visit, those entries                    Clear browser data. Regardless of the scope and use of
are keyed to news.com. On a subsequent visit to news.com,                  a browser mechanism, browsers are expected to respect user
a different ad in a different iframe from a different site                 decisions, especially when a user explicitly requests that stored
ad2.com can read back the same entries that had been added by              browsing data be cleared. While browsers may allow such
ad1.com and identify the user. This allows multiple advertisers            requests from extensions via browsing data APIs [16, 19], from
to collude and track users, similar to cookie syncing [3, 36].             developer tools [5], and even from websites themselves using
                                                                           a Clear-Site-Data header in their HTTP response [21],
     Partitioning key. Once vendors recognized the use of                  they place special emphasis on such requests being received
certain mechanisms as tracking vectors, browsers deployed                  via the user interface. For instance, the Private State Token
mitigations by keying each resource entry to the context                   API [45] mechanism checks if the request to clear tokens has
within which it was accessed. In addition to 1P and 3P                     been received from a user. However, it does not clear tokens
tests, CanITrack includes additional tests that help deter-                even if the domain that issued them were to send a Clear-Site-
mine both, the number of elements added to each browser                    Data HTTP header in subsequent responses [8].
mechanism’s partitioning key, as well as the domain level                       CanITrack uses PyAutoGUI [33] to simulate user inter-
(i.e., site (eTLD+1), subdomain, or port) of each element                  action. For instance, while testing against Chromium-based
considered while constructing the partitioning key. These tests            browsers, it “presses” Ctrl+Shift+Del to open the ”Clear
help determine the extent to which each mechanism provides                 Browsing Data” menu. CanITrack first calls the write()
tracking capabilities, and the limits of tracking use that each            method on one visit, clears the browser data, and then calls
browser permits.                                                           the read() method on a subsequent visit. It, therefore, tests
                                                                           if identifiers written by a browser mechanism can be read even
    Redirection chains. Mechanisms that are limited to 1P
                                                                           after a user explicitly clears their browsing data.
access may not be directly available within 3P contexts. As
a method to circumvent such restrictions, sites can redirect                 3 Context Creation: CanITrack’s Context Creation com-
browsers through multiple domains, each of which accesses                  ponent curates information relevant to the browsing context
data in a 1P context before moving on to the next domain                   required for each experiment under the tests described above.
in the redirection chain. This way sites can access data for               It uses available configuration information as input, which

                                                                       4
includes details about the browser vendor, domains hosted by               "Chrome-v100": {
the web server, and information available about the browser                    "Overall": {
                                                                                   "Track in 1P Contexts": true,
mechanism. Next, we detail the different aspects that are                          "Track in 3P Contexts": false,
considered while defining each context.                                            "Redirections": n/a,
                                                                                   "Track Into or From Private Browsing Mode
     Embedded frames. The tests for 1P tracking, 3P tracking,                          ": false,
Paritioning key, and Redirection chains, each include experi-                      "Track Despite Clearing Browsing Data":
ments involving embedded iframes. The context creation phase                           true
first determines the domains required for both the top-level                   }
                                                                               "1P Tracking": {
context and iframe for each experiment (i.e., the 1P or 3P site,                   "Track in 1P Top-level Contexts?": true,
subdomain, or port).                                                               "Track in 1P iframes?": true.
                                                                                   "Track Across 1P Subdomains?" : false
     Per-context domain list. In addition to determining do-                   }
mains for frames, certain mechanisms require a list of domains                 "3P Tracking": {
to access resources and to send network requests. CanITrack                        "Track Across 3P Sites?": false,
ensures that the list of domains that receive such requests                        "Track While Embedded in Different 3P
                                                                                       Contexts?": false,
remain consistent while writing and reading the identifier, and                    "Track From Different 3P iframes in the
these domains vary between tests for 1P and 3P tracking.                               Same Top-
Moreover, the Context Creation phase creates an additional                         Level Context?": false
list for redirection chains, which comprises a curated list of                 }
                                                                               "Partitioning Key": {
domains to traverse.                                                               "Number of Elements in Paritioning Key": 2
    Network configuration and HTTP headers. CanITrack                                  ,
                                                                                   "Key Composition": [
handles both, 1P and 3P requests by including a default header                         {
set that responds to cross-origin requests. It also listens to                              "frameLevel": "IFrame",
requests made on multiple domains and ports, which can                                      "domainLevel": "Origin (Subdomain)
be incorporated into tests for numerous browser mechanisms                                      "
                                                                                       },
as-is. Nonetheless, if the existing defaults do not suffice,                           {
our framework offers flexibility for such accommodations.                                   "frameLevel": "Top-Level",
Network configuration changes may include handling server-                                  "domainLevel": "Site (eTLD+1)"
side requests, serving hosted files, customizing headers for                           }]}}
each request, and even setting up a parallel server on a different       Listing 2: Example vulnerability report for the CORS Preflight Cache
port on the web server.                                                  on Chrome v100.
    Command-line Flags. One of CanITrack’s most useful
features is its ability to test experimental browser mechanisms          the browser mechanism available when invoked by the Test
accessible in browsers through specific command-line flags.              Configuration scripts. In addition, it hosts resources and files,
For any such browser mechanism, the Context Creation phase               along with the logic provided by the mechanism to handle any
accepts and includes these flags, to be later read by the Browser        network requests.
Runner before starting browser instances for relevant tests. In              Test Configuration. The Web Server accepts network re-
our experiments (§ IV) we use command-line flags to evaluate             quests on behalf of the test scripts, and also makes the context
mechanisms within Google’s Privacy Sandbox, as well as older             of the request available for assisting test scripts.
browser versions that do not support Alt-Svc-based protocol
updates to HTTP/3 requests by default.                                       Tracking Results DB. The Test Configuration’s client-side
                                                                         scripts send the results of each experiment back to the Web
  4 Test Configuration: The Test Configuration component                 Server, which parses them, and adds them to the Tracking
interprets details about the context of each experiment and              Results DB.
feeds them into existing scripts that perform the evaluations
for each test. The test scripts broadly comprise two parts;                6 Browser Evaluation: The Browser Evaluation phase
first, the server-side scripts handle the creation of the HTML           is primarily handled by a script, the Browser Runner, that
body for each experiment, which includes embedding and                   interprets the configuration information, executes fresh browser
serving iframes, and setting any global variables needed by              instances, and creates new and appropriate contexts for each
the client-side scripts. Second, the client-side scripts call the        experiment. Prior to each experiment the runner makes sure
mechanism’s abstracted write() and read() methods,                       that the browser has been completely closed and its state
and perform redirections if needed. The results from each                has been cleared, ensuring that each experiment is executed
invocation of the write() and read() methods are returned                fresh and the operations performed in one experiment do not
to the web server.                                                       affect another. The Browser Runner then opens a new browser
 5 Web Server: The server accepts requests for multiple do-              instance with any command-line flags specified. It opens a
mains and on multiple ports, and hosts all the logic and scripts         new window within a regular or private session, depending on
relevant to communicating with the Browser Mechanism, the                the context of each experiment, before visiting different links
Test Configuration, and the Tracking Results DB.                         to first write and then to read an identifier. The test scripts
                                                                         running within each visit send the results of these operations
    Browser Mechanism. The Web Server makes the client-side              to the server using network requests. If an experiment requires
scripts that include the write() and read() methods for                  clearing browsing data between writing and reading an identi-

                                                                     5
fier, the Browser Runner module executes a PyAutoGUI [33]                  write (uniqueID, domainList) {
script to simulate keyboard and mouse events that perform this                 for (let i = 0; i < domainList.length; i++) {
                                                                                   if(uniqueID[i] == '1') {
operation. At the end of each experiment the Browser Runner                            fetch(`https://${domainList[i]}/tokens
closes the browser instance, and repeats the process for the                                `, {
next experiment.                                                                            method: "POST",
                                                                                            trustToken: {
  7 Vulnerability Analysis: The Tracking Results DB contains                                type: "token-request",
fine-grained entries that include configuration information for                        }}}}
the mechanisms, the browser configuration for each operation,
                                                                           read (domainList) {
and the domains and frames used within each experiment, in                     let uniqueID = '';
addition to the absolute values of the 32-bit identifier that were             for (let i = 0; i < domainList.length; i++) {
written in each context and the values that were retrieved from                    let ifExists = await document.
local data, as a result of the write and read operations.                              hasTrustToken(`https://${domainList[i
                                                                                       ]}`);
    Once the Browser Evaluation has been completed for all                         if (ifExists) {
tests, an analysis script parses the individual entries from                           uniqueID += '1';
                                                                                   } else {
the Tracking Results DB. It creates a list of successful read                          uniqueID += '0';
operations (i.e., where the read operations were able to re-                       }}
construct the identifier), and separates them from unsuccessful                return uniqueID;}
experiments, while taking the context of each experiment into            Listing 3: Example read and write methods used to evaluate the
consideration. The script compiles the results of these exper-           Private Token API with CanITrack.
iments into a simple, computer- and human-readable report,
indicating the scenarios within which the browser mechanism              Google’s dominant positioning, coverage and power within
can be used as a tracking vector. Listing 2 provides an example          the web ecosystem, as well as Chrome’s prevalence among
of our framework’s output.                                               browsers, this initiative can have severe and long-lasting
    CanITrack can be used to test a wide range of new and                privacy implications. As such, our exploration of browser
existing browser mechanisms. The initial effort required to              mechanisms that can be misused for tracking also includes
create relevant read() and write() methods will vary                     two of the main components of Google’s Privacy Sandbox,
depending on the mechanism being tested. To provide a                    the Private State Token API and the FLEDGE API, that have
more concrete workload assesment, we describe an example                 been rolled out and are currently supported by certain major
implementation in the Appendix. Our open source repository               browsers.
also includes implementations of the 21 browser mechanisms
that we evaluated, which we present in the following sections.               Private State Token API. To allow advertisers to dif-
                                                                         ferentiate trusted users from bots when serving ads, Google
                                                                         introduced the Private State Token API (formerly called the
         III.   E XPLORING B ROWSER M ECHANISMS                          Trust Token API) as a cross-origin mechanism for websites
    In this section we provide additional details about the              to communicate trust within a browser instance [45]. For
browser mechanisms that we explore in our experimental                   example, consider a user visiting shopping.com, which embeds
evaluation. We gathered 21 browser mechanisms that were                  Google Ads. During this visit, Google can use its reCAPTCHA
included based on three factors: first, we ensured that they             mechanism [30] to identify that the user of the current browser
were supported by at least one major browser vendor. Second,             instance can be “trusted” as a real user, and can therefore
websites under our control could interact with entries in the            be served advertisements. Google can issue multiple Private
mechanism by altering the DOM, calling a client-side Web                 State Tokens that are stored within the browser as a way to
API, or using HTTP response headers. Third, the entries                  remember such trust in the future. Following this, if the user
in the mechanism persisted across subsequent visits to the               visits a different website travel.com which embeds Facebook
same domain within the same browser instance. In addition                Ads, before Facebook actually displays an advertisement it
to the read() and write() methods, the mechanisms                        can request the browser to provide a Private State Token from
that we evaluated comprised a diverse set of requirements,               Google, if one exists. It can then send this token to Google,
which needed both, server- and client-side setup, an overview            and redeem it. This way, Facebook can learn that Google has
of which is shown in Table I. We provide details about                   already verified the user, and serve advertisements without
their individual read and write actions in Table VII in the              needing to perform such verification again.
Appendix. In the remainder of this section, we focus on the
four mechanisms that have not been studied by prior work                     The Private State Token API uses the Privacy Pass proto-
– Private State Token API, FLEDGE API, CORS Preflight                    col [43] as an underlying cryptographic primitive, which en-
Cache, and Client Hint Headers.                                          sures that tokens are unlinkable (i.e., when Facebook redeems
                                                                         a token Google does not learn which exact browser instance the
    Google Privacy Sandbox. Google recently announced                    token belongs to). A service using the Private State Token API
their plans to mitigate 3P cookie-based tracking and to ex-              additionally needs to set up TLS-based cryptographic functions
periment with and release a slew of different technologies               on its end and advertise its public key commitments at a Well-
(all part of their Privacy Sandbox initiative [25]) that aim             Known URI [52]. Google has also placed additional limits on
to offer more privacy-preserving alternatives for numerous               the number of tokens each website can redeem, allowing only
aspects of the web ecosystem, including online advertising               2 calls to be made per top-level browsing context, in order to
and ad bidding (currently planned for late 2023 [17]). Given             prevent malicious actors from exhausting all tokens [35].

                                                                     6
TABLE I: Overview of the diverse browser-mechanism setups that CanITrack supports.       denotes a requirement for a browser mechanism,
#
G denotes partial requirements for browser mechanisms. Specific to the Routing Setup, rows that include multiple   can be evaluated with
any one such setup.
                                    DOM        Web   Network      File       HTTP        Server       Command-line                   Routing Setup
 Mechanism
                                 Interaction   API   Requests   Resources   Headers   Configuration      Flags       Paths   Ports   Subdomains Sites (eTLD+1)
 Cookies
 Local Storage
 IndexedDB
 Cache Storage
 Stylesheet Cache
 Font Cache
 Image Cache
 HTTP Disk Cache
 Favicon Cache
 Service Worker Variable Scope
 Service Worker Cache
 Alt-Svc                                                                                                   G
                                                                                                           #
 HSTS
 HTTP Auth
 CORS Preflight
 Accept-CH
 NEL
 Filesystem API
 WebSQL
 FLEDGE API
 Private State Token API

    Despite restrictions, the API is fundamentally a cross-origin                     shopping.com can access any Ad Interest Groups that it had
communication mechanism, made especially easy by having                               previously saved in the browser instance. If it finds that the
each token associated with an origin. Google also included                            browser belongs to a specific interest group it can place a
document.hasTrustToken(<origin>), a client-side                                       higher bid for showing a relevant advertisement during the
API call that can be used to query the existence of a 3P token,                       current visit to news.com.
without the intricacies of the cryptographic operations put in
place by the Privacy Pass protocol for redeeming private state
tokens. This creates a mechanism for writing and reading a                                Google has placed a few privacy-focused restrictions on the
unique identifier, based on a unique set of origins, to be used as                    FLEDGE API. Each browser instance regularly queries two
a tracking vector. Listing 3 shows an example implementation                          advertiser-controlled endpoints within an interest group: the
of the read() and write() mechanisms.                                                 dailyUpdateURL used by advertisers for periodically updating
                                                                                      interest group information en masse, and the renderingURL
    Writing an identifier using the Private State Token API.                          from where the browser fetches an individual advertisement.
A private state token can be issued by adding an attribute                            The API restricts the use of these two components by requiring
to one of three existing methods, a Fetch request, an XML                             that the same endpoints be observed by at least 100 other
HTTPRequest, or an iframe tag. As stated in Chrome’s doc-                             browser instances. No such restriction exists on the entire
umentation, “these APIs are not restricted to being called in                         Ad Interest Group. Additionally, an ad auction that results
any particular origin’s context” [8]. With two such issuance                          in a winning bid is returned as an opaque source (example:
requests allowed under each top-level browsing context, a total                       urn:uuid:c3697...), a value that can only be deci-
of 16 redirections would be required to write a 32-bit identifier.                    phered by a new, sandboxed, HTML Element called Fenced
                                                                                      Frames [23]. However, the API allows any origin to have the
    Reading     the     identifier. Issuing  a     call  to                           browser join Ad Interest Groups, including 3P iframes with
document.hasTrustToken(<origin>) returns a                                            a Permissions-Policy directive [13]. Moreover, ad auctions
Promise that resolves to True if a token exists for the                               can be run with a single buyer bidding for the advertising
<origin> or False if no such token exists. With a                                     space. While a successful auction returns an opaque source
restriction of two such calls under each top-level browsing                           to the seller, an auction that ends without a winner returns
context, a total of 16 redirections would be required to                              a NULL value. The FLEDGE API Explainer itself points out
reconstruct a 32-bit identifier.                                                      that “this non-opaque return value leaks one bit of information
                                                                                      to the surrounding page” [24]. Listing 4 shows an example
    FLEDGE API. Google proposed this API to facili-                                   implementation of the corresponding read() and write()
tate remarketing and advertising to custom audiences in                               mechanisms.
the absence of 3P cookies [46]. FLEDGE helps advertis-
ers save user interests in the browser and read these in-
terests back when placing bids for showing advertisements                                  Writing an identifier using the FLEDGE API. A
in future visits across different sites. Consider the user vis-                       browser can be added to an Ad Interest Group by pass-
iting shopping.com; this website can add the user to an                               ing the interest group object as an argument to naviga-
Ad Interest Group named “sneakers enthusiast”, using a                                tor.joinAdInterestGroup(). If a 3P element like an iframe makes
call to navigator.joinAdInterestGroup(). When                                         the API call it requires a Permissions-Policy directive of “join-
the user visits a different website, say news.com, which                              ad-interest-group”. In order to set a 32-bit identifier, up to 32
sells ad space, the website can call another FLEDGE API,                              origins will make API calls (i.e., all origins corresponding to
navigator.runAdAuction() with a list of buyers, in-                                   a value of “1” in the identifier), adding the browser to at least
cluding shopping.com, that can bid for the ad space. Here,                            one Ad Interest Group from each origin.

                                                                                 7
  write (uniqueID, domainList) {                                        is shortlived, and only persists for 24 hours on Firefox and 2
    for (let i = 0; i < domainList.length; i++) {                       hours on Chrome [15].
      if (uniqueID[i] == '1') {
          let iframe = document.createElement('                             Writing an identifier using CORS Preflight Cache. Every
              iframe');
          iframe.src = `https://${domainList[i]}`;
                                                                        time a cross-origin resource is requested, the browser fires
          /* Within each iframe:                                        an OPTIONS request to the server. The response of this
              navigator.joinAdInterestGroup({                           OPTIONS request will be cached for future requests for the
                  owner: `https://${domainList[i]}`                     same resource. In order to write a 32-bit identifier, the client-
                  ...                                                   side code can generate a bitmap representing the identifier to be
              }, 3600*24*30))
          */
                                                                        written, and assign a single cross-origin resource for each bit
          let body = document.getElementById('body'                     in the bitmap. Subsequently, the client will issue cross origin
              );                                                        requests corresponding to the appropriate bit in the identifier.
          body.appendChild(iframe);}}                                   This will result in the identifier being encoded in the browser’s
  read (domainList) {
      uniqueID = '';
                                                                        preflight cache and available for later use.
      for (let i = 0; i < 32; i++) {
          adAuctionResult = await navigator.
                                                                            Reading the identifier. In order to read a previously stored
              runAdAuction({                                            identifier, the client will re-generate the same bitmap that was
              interestGroupBuyers: [`https://${                         created in the write phase. Then, the client will issue preflight
                   domainList[i]}]                                      requests for each of the 32 resources mapped to the bits of the
              ...                                                       identifier. Meanwhile the server maintains a set of resources
          });
          if (adAuctionResult == null) {                                for which it receives an OPTIONS request, which indicates
              uniqueID += '0';                                          that the preflight cache was cold for those. These resources
          } else {                                                      correspond to the 0 bits of the identifier, and are used for
              uniqueID += '1';                                          re-constructing the previously written identifier.
          }
      }                                                                     Client Hint Headers. To optimise content delivery
      return uniqueID; }                                                based on device and network characteristics, Chromium-based
Listing 4: Example read and write methods used to evaluate the          browsers support client hints, wherein the browser includes
FLEDGE API with CanITrack.                                              information about the client along with the HTTP requests
                                                                        (sent in the form of HTTP headers). The Accept-CH
    Reading the identifier. A site can run multiple ad
                                                                        header in a HTTP response allows the server to request
auctions on a single page visit by making calls to
                                                                        specific client hint headers from the browser. For instance, the
navigator.runAdAuction(). Each auction can involve
                                                                        Accept-CH: Viewport-Width response header directs
a single buyer. If a buyer can access their respective Ad
                                                                        the browser to supply the width of the client viewport in the
Interest Group from the browser, they can use it to bid
                                                                        Viewport-Width header on subsequent requests.
in an auction which will return an opaque source. If they
find no such Ad Interest Group, the bid can end without a                   Writing an identifier using Client Hint Headers. The value
winner and return a NULL value. The results from 32 such                of the Accept-CH response header is stored in the browser
auctions can be used to reconstruct a 32-bit identifier. While          for future requests, and hence can be used for storing an
no restrictions are currently in place for the number of calls to       identifier. Upon receiving a request the server generates a
navigator.runAdAuction(), Google is experimentally                      bitmap of the identifier which needs to be written, and maps a
evaluating an 8-auction limit per page visit, behind an addi-           single client hint to each bit of the identifier. Now, the server
tional flag [20]. If this limit were to be turned on by default,        populates the Accept-CH header only with client hints for
reading a 32-bit identifier would require either 4 redirections         which the bit value is 1, and responds to the client. The client
or 4 page reloads, which would marginally increase the effort           stores this Accept-CH directive for future requests, which
required for using this tracking vector.                                can be used to reconstruct the identifier.
    CORS Preflight Cache. When websites request resources                   Reading the identifier. The server can retrieve an existing
from an origin other than the top-level browsing context                identifier by reading the client hint headers that were sent to it
(referred to as Cross Origin Resource Sharing or CORS),                 along with a request. The server re-generates the mapping of
browsers can issue so-called “preflight” requests, if they              bit positions and client hints that were used and checks which
determine that these requests may be sensitive (e.g. AJAX               client hints were sent in the requests. These correspond to the
requests with custom HTTP headers). These requests use the              identifier-bits set to 1 allowing the server to reconstruct the
OPTIONS method and are used to ask for permission from                  identifier that was written.
the 3P server, before they send the actual request that the
cross-origin site intended. If the server responds with the                                   IV.   E VALUATION
appropriate permission headers, the full cross-origin request
can be fired. This is an effective defense against CSRF attacks             In this section we evaluate CanITrack, and identify browser
and prevents unauthorized requests from causing side-effects            mechanisms that can be misused as tracking vectors. We
on the server [70]. All major browsers cache the preflight re-          choose 126 versions of seven major browsers (see Table II)
quests for cross origin resources for performance reasons, thus         as a representative sample of the browser ecosystem over a 2-
matching our description of a potential tracking mechanism.             year period, during which browsers deployed a series of coun-
However, we note that while other mechanisms described in               termeasures (including redesigning their origin-partitioning
this section have extended lifetimes, the CORS Preflight Cache          architectures). We present our findings for six of the tested

                                                                    8
   TABLE II: Statistics about browsers tested using CanITrack.                       TABLE IV: Non-standard APIs supported by Chromium-based
                                                        Market        Tested
                                                                                     browsers.
 Browser   Versions                     Period
                                                       Share [10]   Mechanisms        Mechanism                                         Version Introduced                                                Status
 Brave     20 (v1.3 -v1.37)        02/2020 - 04/2022     <1%            21            Accept-CH                                         Chrome(46), Edge(79), Opera(33)                                   Enabled
 Chrome    20 (v80 - v100)         02/2020 - 04/2022    67.17%          21            FLEDGE                                            Chrome(91), Edge(91), Opera(77)                                   Experimental
 Edge      20 (v80 - v100)         02/2020 - 04/2022     9.14%          21            File System API                                   Chrome(13), Edge(79), Opera(20), Brave(0.57)                      Enabled
 Firefox   20 (v80 -v99)           08/2020 - 04/2022     7.87%          15            Network Error Log                                 Chrome(71), Edge(79), Opera(58)                                   Enabled
 Opera     20 (v67 - v86)          02/2020 - 04/2022     2.89%          21            Private State Token API                           Chrome(84), Edge(84), Opera(70)                                   Experimental
 Safari    4 (v12.1.2 - v15.4)     07/2019 - 04/2022     9.63%          13            WebSQL                                            Chrome(4), Edge(79), Opera(10.5), Brave(0.57)                     Deprecated
 Tor       22 (v9.0 - v11.0.10)    10/2019 - 04/2022        –           15
                                                                                                                                                  Brave                 Brave adds partitioning
                                                                                                                                                Chrome            Chrome/Edge add partitioning
TABLE III: Number of browser mechanisms that can be used for 1P                                                                                   Edge
                                                                                                                                                 Firefox
                                                                                                                                                                       Firefox adds partitioning
                                                                                                                                                                       Opera adds partitioning
tracking across different scenarios.                                                                                                             Opera
                                                                                                                                                  Safari
                                                                                                                                                                      Safari blocks 3P cookies

                                                                                                                   20
                                   Number of Vulnerable Mechanisms




                                                                                            Vulnerable API count
 Browser        Versions                                                                                           18
                                  1P Top-level Site-wide 1P IFrame                                                 16
                1.3-1.15              17            8        16                                                    14
 Brave                                                                                                             12
                1.17-1.37             16            7        16
                                                                                                                   10
                80-83                 19            8        18                                                     8
 Chrome         84-90                 20            9        19                                                     6
                91-100                21           10        20                                                     4
                80-83                 19            8        18                                                     2
                                                                                                                    0
 Edge           84-90                 20            9        19




                                                                                                                         20

                                                                                                                                  20

                                                                                                                                           21


                                                                                                                                                  1

                                                                                                                                                            21


                                                                                                                                                                    1

                                                                                                                                                                            21

                                                                                                                                                                                     21

                                                                                                                                                                                              22


                                                                                                                                                                                                     2
                                                                                                                                                   2




                                                                                                                                                                  02




                                                                                                                                                                                                      2
                91-100                21           10        20




                                                                                                                        20

                                                                                                                              20

                                                                                                                                        20

                                                                                                                                                20

                                                                                                                                                        20




                                                                                                                                                                           20

                                                                                                                                                                                 20

                                                                                                                                                                                           20

                                                                                                                                                                                                   20
                                                                                                                                                                 l2
                                                                                                                    p

                                                                                                                             ov


                                                                                                                                       n

                                                                                                                                             ar

                                                                                                                                                       ay




                                                                                                                                                                        p

                                                                                                                                                                                ov


                                                                                                                                                                                          n

                                                                                                                                                                                                ar
                                                                                                                                                             Ju
                                                                                                                   Se




                                                                                                                                   Ja




                                                                                                                                                                      Se




                                                                                                                                                                                      Ja
 Firefox        80-100                15            7        14




                                                                                                                                           M




                                                                                                                                                                                              M
                                                                                                                         N




                                                                                                                                                  M




                                                                                                                                                                            N
                67-69                 19            8        18                                                                                 Version Update Month
 Opera          70-76                 20            9        19
                77-88                 21           10        20                      Fig. 2: Browser mechanisms that can be used as 3P tracking vectors.
 Safari         12-15                 12            6        12                      A breakdown is provided in Table V.

                                                                                     like Firefox hide the API behind flags [31], Chrome enabled
browsers below, and separately provide some observations on                          support for the now-deprecated mechanism by default in 2018,
the Tor browser.                                                                     and continues to support its use in the latest version [66]. While
    1P Tracking. Initially, we explore which of the tested                           Brave blocks use of the header by default due to its potential
mechanisms can be used as a tracking vector in a 1P context.                         for misuse, other popular Chromium-based browsers (e.g.,
As can be seen in Table III, these mechanisms are over-                              Edge, Opera) do not include such restrictions. Mechanisms
whelmingly accessible in top-level contexts and can be used                          made available using Google’s Privacy Sandbox, as described
to write and read identifiers across visits, each affecting the                      in §III, remain unadopted by other major browsers like Firefox
latest version of at least one browser. CanITrack also evaluates                     and Safari. While Brave blocks access, Edge and Opera support
the mechanisms that can be accessed within 1P iframes. Such                          them, thus increasing the number of users affected by the
access can help websites separate the context used for tracking                      tracking vectors that these protocols enable.
from the context used for their user-facing services. Table III                          The curious case of Safari. While Chromium-based
shows that apart from the favicon-cache all the other evaluated                      browsers are affected by the adoption of non-standard mech-
browser mechanisms that can be accessed in top-level contexts                        anisms, Safari takes a conservative approach even in its
can also be accessed within 1P iframes. Additionally, we check                       implementation of standard browser mechanisms. Safari has
whether browsers provide unified access to the mechanisms                            added support for HTTP/3 as an experimental feature in
from all subdomains under the main domain (eTLD+1). This                             its Technology Preview Version [26], but does not support
access allows sites that provide a large number of services to                       upgrades from HTTP/1.1 to HTTP/3 based on the Alt-Svc
share tracking identifiers across their subdomains even when a                       header - a mechanism adopted by all of the other browsers
user is not registered with each service individually. All tested                    that we evaluated [26, 27]. While this protects the browser
browsers support at least six such mechanisms in their latest                        from tracking vectors enabled by this feature, websites have to
versions that enable site-wide tracking capabilities.                                advertise all supported protocols, including HTTP/3, by editing
                                                                                     their DNS entries, which would result in only one of the pro-
    Non-standard or deprecated mechanisms. We also observe                           tocols being used from the first visit itself, instead of a future
that Chromium-based browsers have adopted non-standard                               upgrade to a dynamically alterable domain or port [7, 51].
APIs and extended support for deprecated APIs long af-                               Moreover, Safari mitigates HSTS-based tracking by limiting
ter the plans for deprecation were made public, as de-                               upgrades in HSTS State to the entire site (eTLD+1), therefore
tailed in Table IV. Google Chrome still supports WebSQL                              reducing the number of bits that can be set for every site to
and the legacy version of the File System API (via win-                              one. By additionally restricting such state upgrades to 1P links,
dow.webkitRequestFileSystem()) despite both APIs being dep-                          they prevent trackers from abusing this mechanism [50]. Safari
recated for over 3 years [39, 53]. Support for such APIs                             also identifies cross-site top-frame redirects, and classifies it as
can be observed across the Chromium-based browser family                             bounce tracking, further reducing the feasibility of creating an
(including Brave, Edge and Opera) expanding the viability of                         identifier across 32 sites in a redirection chain [6].
its use for tracking to users of those browsers as well. An
additional example is Network Error Logging [41], which uses                            3P Tracking. CanITrack also assesses access to each tested
an older version of the Reporting API [42]. While browsers                           browser mechanism in three different 3P contexts, as explained

                                                                                 9
in §II. Browsers that allow cross-site access offer the same                       TABLE V: Breakdown of 3P tracking capabilities.
view of the mechanism’s state to all domains visited by the
                                                                                                                  3P Tracking Contexts
same browser instance. This form of global access allows                 Browser    Versions                        IFrame Across 3P IFrames      Total
malicious or invasive actors to track users across multiple                                          Cross-site
                                                                                                                     3P Contexts      in a Site
browsing contexts without needing to be the 1P top-level                            Pre-partition        6                0               0         6
                                                                                    (v1.17)
context when reading or writing an identifier. As can be seen            Brave
                                                                                    Post-Partition       2                0              0          2
in Figure 2, CanITrack reveals that in the past two years                           (v1.19)
all major browsers have allowed such unrestricted, cross-site                       Pre-Partition        8                9              0          17
                                                                                    (v87)
access to at least one of the evaluated browser mechanisms.              Chrome
                                                                                    Post-Partition       4                8              0          12
Interestingly, we observe that for certain mechanisms browsers                      (v88)
                                                                                    Pre-Partition        8                9              0          17
realize the possibility of misuse and subsequently isolate these                    (v87)
                                                                         Edge
mechanisms to the domain that accessed them. Moreover they                          Post-Partition       4                8              0          12
do so using different approaches, shown in Table V, further                         (v88)
                                                                                    Pre-Partition        7                6              0          13
highlighting the requirement for testing the additional contexts                    (v84)
                                                                         Firefox
included in CanITrack’s 3P tracking test suite.                                     Post-Partition       0                6              7          13
                                                                                    (v85)
    Partitioning Key. Browsers add a key to each entry associ-                      Pre-Partition        8                9              0          17
                                                                                    (v73)
ated with a browsing mechanism. This key includes the URL                Opera
                                                                                    Post-Partition       4                8              0          12
of each resource associated with the mechanism, in addition to                      (v74)
the context that made such an entry in the browser. The context                     Pre-Block 3P         1                2              4          7
                                                                                    Cookies (v13)
considered for the key varies across browsers. For instance,             Safari
                                                                                    Post-Block 3P        1                1              4          6
consider the version updates observed in January 2021 for                           Cookies (v14)
Firefox (v85) and Chrome (v87), as shown in Figure 2.
                                                                        available to all subdomains under a site (eTLD+1), they restrict
Both browsers identified potential 3P tracking issues in prior
                                                                        such access for local storage, indexedDB, and cache storage
versions, enabled by making the same view of the Stylesheet
                                                                        to each subdomain. They adopt similar variations with regard
Cache, Image Cache, Font Cache, and the HTTP Disk Cache
                                                                        to the resource-based mechanisms explained before, including
available to all domains. They both chose to key entries to
                                                                        only the site (eTLD+1) as part of their key. This variation
these mechanisms using additional context considered in each
                                                                        enables the Site-wide Access scenario shown in Table III.
request. Chrome used the domain (eTLD+1) of the frame (if
the entry was added by an iframe) and the site of the top-                   Restricting Access in 3P Contexts. Another approach
level context, in addition to the URL of the resource. For in-          adopted by browsers for certain mechanisms is a blanket
stance, consider that a font available at (font.com/f.tff)              restriction of access from 3P contexts. Safari and Brave use this
was added by an iframe (iframe.com) while embedded in                   approach for cookies and mechanisms under the Storage API,
another site (news.com). Starting from v87, Chrome keys                 i.e., local storage, indexedDB, and cache storage. Any accesses
each entry in a way that considers the entire context. In our           made to these mechanisms in a 3P context is considered to
example the key will include news.com, iframe.com,                      be ephemeral. Chrome adopted a similar approach to restrict
font.com/f.tff.                                                         access to WebSQL in later versions (>=v97). Imposing such
    Firefox, on the other hand, also identified that those mech-        restrictions to access overcomes the need for a partitioning key,
anisms and two additional ones (Alt-Svc and HSTS) can be                ensuring that sites only adopt mechanisms for 1P tracking use-
misused for tracking. Following an alternative strategy, Firefox        cases, and greatly restricts its misuse by malicious actors.
chose to key each resource only to the top-level site (eTLD+1)              Firefox’s Total Cookie Protection. In July 2022, Firefox
under which such an entry was added to the mechanism. In                (>=v103) rolled out a new default tracking protection feature
the same example scenario, Firefox will add the new font                that contains all 3P cookies in a separate “ucookie-jar” for each
with a key that includes news.com, font.com/f.tff,                      site (eTLD+1) that they are embedded in [65]. This restriction
thus ignoring the domain of the iframe under which the                  is the equivalent of a double-keying approach and limits the
request was made. Table V shows that considering a partial              use of cookies for 3P tracking. Adopting similar defaults for
view of the context in each key leaves Firefox vulnerable               other mechanisms supported by the browser will further protect
to 3P tracking, albeit in a reduced number of scenarios. We             against tracking misuses.
additionally observe that Safari adopts a similar approach to
their partitioning of similar browser mechanisms, i.e., Fonts,              Redirections. For browser mechanisms that are limited in
Stylesheets, Images, and the HTTP Disk Cache.                           terms of the number of accesses that can be made to their
                                                                        entries with a single page visit, we evaluate them using redirec-
    We observed that Chrome’s adoption of keys for 4 mech-
                                                                        tion chains. We test whether browsers impose any restrictions
anisms (i.e., Fonts, Stylesheets, Images, HTTP Disk Cache)
                                                                        on these chains, and whether depending on the “origins”
were also inherited by Brave. Additionally, Brave partitioned
                                                                        that comprise these chains (i.e., a list of sites (eTLD+1),
the Alt-Svc header (v1.33, 2022), and restricted the use of the
                                                                        subdomains, or ports) results in a different treatment from
favicon cache (v1.15, 2020), independently of Chrome.
                                                                        browsers. In most cases where the mechanism is keyed to
    Inconsistency in domain levels used for partitioning. While         the origin of a domain, different subdomains and ports under
all of the browsers use their own approaches to interpreting the        the same domain (eTLD+1) are considered to be different
context included in a partitioning key, they additionally vary          origins. While a resource accessed for each new subdomain
in their understanding of the level of domains included in such         would require the resolution of a new DNS request, resources
keying. Namely, even though most browsers make cookies                  accessed from different ports of the same site can do so

                                                                   10
                                                                                                                 Mechanism Performance (CDF)                   Write        Read
without the DNS overhead (or the management of additional                              Accept-CH                                 CORS                                  FLEDGE
                                                                           1                                       1                                      1
subdomains). We observed a reduction of 0.8 seconds in the
average time taken to perform 16-redirections across a chain              0.8                                     0.8                                    0.8



of ports to set a 32-bit identifier using the Private State Token         0.6                                     0.6                                    0.6



API, in comparison to similar redirections that used a chain of           0.4                                     0.4                                    0.4



subdomains instead.                                                       0.2                                     0.2                                    0.2


                                                                           0                                       0                                      0
                                                                           100 200 300 400 500 600 700 800 900     100 200 300 400 500 600 700 800 900    100 200 300 400 500 600 700 800 900
    Clearing Browser Data. All of the browsers we evaluate                              Time (ms)                               Time (ms)                              Time (ms)

offer users a method to clear browser data, including their               Fig. 3: Overhead of writing and reading a 32-bit identifier using
history, cached files, and any cookies stored in the browser.             CORS, Accept-CH, and FLEDGE.
CanITrack verified prior reports of incomplete data removal
with regard to the favicon cache [74]. We found that the                  average the timing information from 100 separate tests in each
options that were selected by default when Chrome and Brave               scenario. Figure 3 shows that three of the mechanisms are
users accessed the “Clear browsing data” menu from the                    extremely efficient as writing or reading a 32-bit identifier
browser’s settings tab, failed to clear the favicon cache. Older          requires only 200-900 milliseconds. As can be seen in Figure 4,
versions of Safari (<=v14), similarly did not clear the favicon           the Private State Token API introduce additional overhead
cache from either of the user actions that they provided, i.e.,           due to their reliance on redirections, along with its specific
the “Clear History” option under the “History” menu and the               implementation [14] of the cryptographic primitives included
“Manage Website Data” option under the “Preferences” menu.                in the underlying Privacy Pass protocol [43]. Nonetheless,
    Private mode leaks. We also verified prior findings about             while the one-time cost of writing a 32-bit identifier requires
the favicon cache in older versions of Chrome (<=v91) and                 three seconds, reading the identifier only takes about one sec-
Safari being available when the user visits a site in private             ond. Importantly, this can be further optimized by leveraging
mode [74]. This enabled tracking vectors that re-identified               immutable fingerprints as a source of identifier entropy [74].
users that had previously visited a service in normal browsing                Additional notable findings. During our evaluation, CanI-
mode. These checks highlight the need for a completely new,               Track unearthed new tracking vulnerabilities and capabilities in
sandboxed profile of all browser mechanism entries upon                   the latest versions of evaluated browsers. These vulnerabilities
creating a fresh instance of a private browsing context.                  are additional to the four novel tracking vectors (see §III).
    Tor observations. The Tor browser, which is based on                      Unpartitioned Alt-Svc in Chromium Browsers. Using the
Firefox, adopts a privacy-focused approach wherein browsing               Alt-Svc header to track users across websites was previously
sessions use the private browsing mode by default; when users             reported by Tiwari et al. [79] in 2019. Following this work,
quit and reopen the browser, any private information linked to            Chrome imposed restrictions on using Alt-Svc headers for
the profile (cookies and browsing history) are cleared [68].              upgrading requests to use HTTP/3, requiring that such servers
As a result of this unique design, the states of the browser              exist in parallel with an HTTP/1.1 or HTTP/2 server. They
mechanisms that we test are linked to the browsing profile                imposed additional restrictions on the ports that can be used by
and are cleared each time the browser is quit and re-opened.              these parallel servers, requiring that they both be served either
However, the state of 11 mechanisms persists within the same              on ports < 1024 or on ports >= 1024. They also require that
“identity”, i.e. across different visits without the user quitting        servers have TLS certificates signed by a Certificate Authority
the browser in between. Of these, 6 mechanisms (Alt-Svc, Font             already in Chrome’s list of trusted CAs [63].
Cache, HTTP Auth, HTTP Disk Cache, Image Cache, and the
Stylesheet Cache) are keyed in a similar manner to Firefox,                   CanITrack’s testing pipeline revealed that despite these
and can be read by different 3P iframes under the same site.              restrictions the latest version of Chrome (v103) keeps the
Unlike Firefox, Tor doesn’t provide a menu to manage and                  Alt-Svc cache unpartitioned. With support for HTTP/3 being
clear browser data. Instead, it provides an equivalent “new               enabled on Chrome by default since v87, the browser reads
identity” button, which clears all cookies and browsing history           any HTTP response that returns a valid Alt-Svc Header and
in addition to using new Tor Circuits for future connections [1].         upgrades future requests to use the HTTP/3 protocol. This
While this feature works in a similar manner to quitting and              behavior allows malicious actors to write an identifier in any
re-opening the browser (i.e. it clears the states of all tested           context within a regular browsing session, and any other
mechanisms) CanITrack found that the CORS Preflight Cache                 malicious actor to read the same identifier in a different
remains uncleared until the browser has been quit. Users can              context during future visits, obviating the need to rely on
therefore be tracked in Tor despite adopting a “new identity”,            redirections or insecure contexts. Finally, we observed that
until they quit the browser.                                              while Brave used a partitioning key for its Alt-Svc entries, no
                                                                          such partitioning existed for other Chromium-based browsers,
     Performance measurements. Apart from the feasibility                 including Edge and Opera.
experiments, we use CanITrack to evaluate the practicality of
these tracking vectors in terms of performance. We deployed                   CORS Preflight in Private Browsing. Prior to including
a lightweight Express.js [22] web server on a Quad Core                   appropriate tests in CanITrack, we found that cached CORS
machine with 16GB of RAM. We placed our VM in the same                    Preflight responses for cross-origin resources were leaked
city as the devices used during our evaluation. We leveraged              between subsequent private browsing sessions in Firefox. If
a Puppeteer [29] script to orchestrate visits to our web server,          the mechanism was used to store an identifier during a visit
and recorded the time it took to read and write a 32-bit identi-          in private browsing mode, this identifier would persist even if
fier. We limit this experiment to the four browser mechanisms             the private window was closed and another one was opened
that we are the first to demonstrate as tracking vectors, and             at a later time. We reported our findings to Firefox, which led

                                                                     11
                                      Write         Read                     about a request for the favicon only if a network request was
                          4                                                  made. If the favicon was accessed from the cache, no such

             Time (sec)
                                                                             entry will be found. Once CanITrack revealed that entries to
                                                                             the favicon cache were shared across websites, we gathered
                          2                                                  links to favicons of popular websites which we then visited.
                                                                             We observed that adding these 3P links in the href attribute
                                                                             of our test page caused the browser to fetch these favicons
                          0                                                  from the cache, and no corresponding entry was found in the
                              4   8     12    16   20   24   28   32         list returned by the Performance API. We then developed two
                                         ID size (bits)                      versions of a history sniffer.
Fig. 4: Overhead of the read and write phases using the Private State
Token API across different ID sizes.                                             Chromium Version. Chrome allows websites to dynamically
                                                                             change the favicons associated with a page by modifying the
to this vulnerability being patched. We then designed a test to              link element included in the DOM’s head. We leveraged this
evaluate the behavior of mechanisms within private browsing                  feature to traverse a list of favicons gathered from popular
sessions, and included it in the test suite offered by CanITrack.            websites, and added it to an attack page under our control.
                                                                             When a user visits our page after having previously visited any
    CORS Preflight Cache following Clearing Browser Data.
                                                                             of the websites on the list, the attack page dynamically changes
During our evaluation, CanITrack reported that tracking identi-
                                                                             the link element associated with its favicon, as it traverses
fiers persisted despite user-initiated clearing of browser data on
                                                                             the list of targeted websites (i.e., the list of websites that we
the latest versions of Chrome, Safari, and Tor. Upon further
                                                                             want to cross reference with the user’s browsing history). The
inspection, we found that user-initiated data clearing, in the
                                                                             page includes a small (∼100ms) wait between each update to
context of preflight responses, does not take effect until the
                                                                             ensure that a network request or a cache fetch is triggered. The
browser is completely closed. We observed similar behavior
                                                                             page then calls the Performance API and traverses the list of
in Brave, Edge, and Opera as well. Browsers failing to clear
                                                                             resource requests returned by the API. Any favicon link that
the CORS-Preflight cache will result in the vector persisting
                                                                             is not included in the returned list indicates a domain that the
until its expiration, despite the user requesting their removal.
                                                                             user has visited in the past. Moreover, the attack page can then
    Favicon as a Global Cache. While evaluating the latest                   associate a new favicon, under its own control, with its page.
versions of Chrome and Safari, CanITrack revealed that cross-                This helps “purge” tested 3P favicons from being associated
site favicon links could be used to write and read identifiers.              with it in the browser’s cache, thus ensuring that the attack can
This flaw was also inherited by Edge and Opera, whereas                      be re-run in future visits. Since the described attack makes use
Brave correctly partitions this mechanism. While previous                    of dynamically changing favicons within the same page, this
work [74] demonstrated how favicons can be misused for                       attack, unlike prior favicon-based attacks [74], does not incur
tracking, that work did not identify or report the feasibility               the additional performance overhead added by redirections. A
of cross-origin requests, and focused on same-origin tracking.               demo of the attack can be found here [80].
We note that despite the disclosure of that attack, the ability to
                                                                                  Safari Version. Unlike Chrome, Safari does not allow dy-
misuse favicons for tracking remains. More importantly, our
                                                                             namic changes to the favicon associated with a page. As such,
system revealed that browsers allow cross-site favicon links
                                                                             we develop a redirection chain, with each page in the chain
and serve them to all sites from the same cache. The lack
                                                                             requesting a single 3P favicon before querying the Performance
of any partitioning key results in favicons becoming a cross-
                                                                             API, and moving on to the next page. This history sniffing
origin vector, which we leverage for developing a novel history
                                                                             attack then reconstructs the user’s history based on the values
sniffing attack that we describe below.
                                                                             observed across multiple page visits. The attack works on the
    Favicon Leaking into Private Browsing Mode. CanITrack                    first visit to a page in regular browsing mode, after which
reported that while Safari cleared favicons on UI-triggered                  Safari adds sniffed favicons to the cache. While the attack in
actions in Safari v15, the browser continued to serve favicons               Safari is not as stealthy, the privacy threat is exacerbated by
from the cache when a user visited domains while using the                   Safari using the same cache from regular browsing sessions in
private browsing mode. This indicates an incomplete fix of                   the private browsing mode. Moreover, since favicon entries are
previously reported bugs.                                                    not added to the cache when in the private browsing mode (i.e.,
                                                                             the site can read but not write), this attack can be repeated each
    History Sniffing using Favicons. Here, we describe a                     time a user visits the attack page in a new private browsing
novel history sniffing attack that we designed following our                 session. A demo of the attack can be found here [81].
experimental findings from CanITrack’s testing of the latest
versions of major browsers. Browsers request favicons for a                      Vulnerabilities across Chromium browsers. A large
website based on the href attribute of the link element                      number of browser vendors rely on the underlying Chromium
included in the returned page. The attribute can point to any                engine [82] for their functionality, including the implemen-
3P URL or path indicated in the element. If the browser finds                tation of the mechanisms that we evaluated. Vulnerabilities
an existing entry for the favicon in its cache, it does not                  resulting from these implementations can be inherited by these
trigger a network request, instead fetching a cached copy of                 browsers, exacerbating the effect of any privacy-sensitive flaw.
the previously requested favicon. The Performance API [28],                  For each vulnerability found during our evaluation of Google
which is available in most major browsers, provides infor-                   Chrome, we further evaluated their viability in Microsoft Edge
mation about network requests triggered to fetch resources.                  and Opera, two popular Chromium-based browsers. All of
The entries returned by calls to this API include information                the vulnerabilities described in this section, including the

                                                                        12
newly-evaluated browser mechanisms, affected those browsers                                TABLE VI: Summary of Disclosures.
as well. While Brave blocked access to Google’s Privacy
Sandbox, its latest version was vulnerable to an oversight in                                            Date            Current Status
                                                                           Mechanism         Browser
                                                                                                       Reported         (as of Jan 2023)
the clearing of the CORS-Prelight Cache. Additionally, Brave                                 Chrome     11/2021     Engaging in Discussions
does not block inherited implementations of non-standard APIs              Private State
                                                                                              Edge      11/2021      Waiting on Upstream
                                                                           Token API
like WebSQL and the legacy version of the File System API,                                    Opera     11/2021       Waiting on Upstream
both of which can be used as 1P tracking vectors.                                            Chrome     04/2022     Engaging in Discussions
                                                                           FLEDGE API          Edge     04/2022       Waiting on Upstream
    Summary. We used CanITrack to evaluate a wide range                                       Opera     04/2022      Waiting on Upstream
of emerging and existing browser mechanisms and implemen-                                    Chrome     02/2022               Fixed
                                                                                              Edge      02/2022          Fixed Upstream
tations across numerous versions over a two-year period. Our               Favicon Cache
                                                                                              Opera     02/2022          Fixed Upstream
system unearthed novel vulnerabilities in the latest versions of                              Safari    04/2022        Working on a Fix
all major browsers and guided the design of two versions of                                   Brave     04/2022       Waiting on Upstream
a new history sniffing attack. Moreover, CanITrack allowed                                   Chrome     04/2022     Engaging in Discussions
us to confirm prior findings and also quantify the impact                                      Edge     04/2022       Waiting on Upstream
                                                                           CORS Preflight    Firefox    11/2021               Fixed
storage isolations and anti-tracking countermeasures deployed                                 Opera     04/2022       Waiting on Upstream
by browser vendors.                                                                            Tor      07/2022               Fixed
                                                                                              Safari    04/2022               Fixed
                                                                                             Chrome     04/2022   Developed Fix (yet to deploy)
                       V.    D ISCUSSION                                   Alt-Svc             Edge     04/2022       Waiting on Upstream
    Ethics and disclosure. We note that no users were affected                                Opera     04/2022      Waiting on Upstream
by our experiments, all of which were conducted using our
own devices or cloud-based virtual machines. Furthermore,                 Englehardt and Narayanan [49]. In a similar vein, Acar et
we disclosed the individual tracking vectors uncovered by our             al. [36] reported the use of cookie-syncing, where unique IDs
system to all of the affected browsers. Importantly, due to the           were respawned by colluding trackers across different site
extensive public discourse around Google’s Privacy Sandbox                visits, which helped them merge records of individual users.
initiative and the long term ramifications for the web ecosystem          To mitigate misuse, browsers like Firefox [32] and Safari [83]
that would result from a wider adoption, we preemptively                  added protections to limit their access in 3P contexts. Recently,
notified major browsers (i.e., Safari, Firefox, Brave) that do not        Google released their Privacy Sandbox proposals [25], and
currently support the mechanisms we evaluated (i.e., Private              announced plans to eventually phase out 3P cookies. Addition-
State Tokens and FLEDGE) about our findings. This will allow              ally, Dimova et al. [44] showed ways to bypass cookie-oriented
them to make a more informed decision moving forward about                restrictions using approaches like CNAME cloaking that help
supporting these mechanisms. In total, we have submitted 20               websites embed 3P tracking resources in 1P contexts.
bug reports to seven browser vendors. We present a summary
of our disclosures and their latest status (January 2023) in                  Cookie-less Tracking. As anti-tracking defenses that target
Table VI.                                                                 cookie-based techniques continue to be adopted by browsers,
                                                                          other browser mechanisms have been shown to aid user
    CanITrack release and use cases. We developed our                     tracking over the years [67], and various browser fingerprinting
framework to be modular and extensible so as to allow other               techniques [47, 56, 57, 64, 72, 73, 77] have been proposed or
researchers to incorporate additional features and capabili-              deployed in practice. Additionally, researchers have demon-
ties for exercising browsers and analyzing their respective               strated how other browsing mechanisms can be misused for
functionality. To that end, we have made CanITrack publicly               tracking. In 2009, Soltani et al. [75] demonstrated the misuse
available [34]. Our system can facilitate and streamline the              of Flash cookies, while in 2010, Kamkar [55] demonstrated
internal testing procedures of browser vendors during the                 similar misuse of local storage, session storage, and ETags.
development phase of new browser mechanisms, as well as                   More recently, mechanisms like HSTS for websites not in-
allow comprehensive and systematic testing of existing features           cluded in the preload list [50] and the favicon cache [74]
by the research community. Moreover, our framework can be                 have been shown to enable similar tracking. While browsers
used by researchers for evaluating the effectiveness of anti-             have partitioned mechanisms when they realized the potential
tracking defenses they develop against specific types of online           for misuse [12, 18], new vectors, like those presented in our
tracking.                                                                 work, can expose users to significant risk as long as they
                                                                          remain undetected or unnoticed. The lack of a structured
                    VI.     R ELATED W ORK                                approach to identifying tracking vectors further amplifies the
    CanITrack is the first automated system for comprehen-                possibility of privacy-invasive behaviors going unnoticed for
sively and systematically uncovering tracking vectors. Here,              a long time. CanITrack aims to reduce this gap, and to offer
we list relevant studies that advanced our community’s under-             security researchers and browser vendors a streamlined and
standing of the tracking ecosystem and motivated our proposed             comprehensive system for evaluating mechanisms.
framework’s design.
                                                                              Longitudinal Studies. Online tracking has been studied
    Cookie-based Tracking. Cookies have long been used                    at scale [37, 49] and retrospectively [60]. These studies also
to track users across sites in both 1P and 3P contexts. The               presented frameworks for detecting the use of known tracking
privacy-invasive nature of 3P entities that gather user data              vectors by sites, and measured the extent of tracking in the
through a combination of cookies and other fingerprinting                 wild. They further showed the importance of detecting non
vectors has been measured and reported in prior work by                   cookie-based vectors, given the extent of use by trackers.

                                                                     13
    Frameworks. Next to frameworks that analyzed track-                  detecting and tackling the severe privacy threats that users face,
ing across websites, recent work has also suggested systems              and we believe that our system addresses a significant gap that
for evaluating mechanisms that enable cross-site communi-                currently exists.
cation [58, 71]. More relevant to our work is the recent
PrivacyTests project [48]. The service tests and provides a
snapshot of the state of known supercookies, blocking of                                         ACKNOWLEDGEMENTS
tracking content, and fingerprint resistance measures within
the latest versions of browsers. While their evaluation of                   We would like to thank the anonymous reviewers for
supercookies is similar to those proposed by CanITrack, they             their valuable feedback. This work was supported by the Na-
only cover a single aspect of the 1P and 3P tracking tests               tional Science Foundation under grants CNS-1934597, CNS-
evaluated by our system (see §II). Our system includes a suite           2211574, CNS-2143363, CNS-2211575, CNS-2126654, CNS-
of additional tests that capture tracking vectors across multiple        1941617 as well as the Office of Naval Research under grant
1P and 3P contexts, and further evaluate the composition of              ONR N00014-20-1-2720. Any opinions, findings, conclusions,
a partitioning key associated with a mechanism. Our system               or recommendations expressed herein are those of the authors,
also supports the evaluation of vectors that can benefit from            and do not necessarily reflect those of the NSF or the ONR.
redirection chains, and verifies the possibility of optimizing
tracking vectors by replacing the use of subdomains with
ports. Additionally, our system uncovers leaks into, from, and                                         R EFERENCES
within private browsing modes, and assesses the effects of                [1] “New Identity | Tor Project | Support.” [Online]. Available:
clearing browser data. These tests help determine the extent                  https://support.torproject.org/glossary/new-identity/
to which each mechanism provides tracking capabilities, and               [2] “Redirect tracking protection - Privacy, permissions, and information
the limits of tracking use that each browser permits. The                     security | MDN.” [Online]. Available: https://developer.mozilla.org/
systematic approach used by our framework makes it easy to                    en-US/docs/Web/Privacy/Redirect tracking protection
test a plethora of browser mechanisms with various configura-             [3] “What is Cookie Syncing and How Does it Work? - Clearcode
tion requirements, including the flexibility to handle network                Blog,” Dec. 2015. [Online]. Available: https://clearcode.cc/blog/
                                                                              cookie-syncing/
requests, host resources, customize HTTP headers, and set
                                                                          [4] “Intelligent Tracking Prevention 2.0,” Jun. 2018. [Online]. Available:
up parallel servers on different ports (see Table I). Finally,                https://webkit.org/blog/8311/intelligent-tracking-prevention-2-0/
CanITrack can be used in the evaluation of new, unreleased,
                                                                          [5] “View Cache data,” 2019. [Online]. Available: https://developer.chrome.
experimental features hidden behind command-line flags.                       com/docs/devtools/storage/cache/
    Overall, the motivation behind our work was recognizing               [6] “Tracking Prevention in WebKit,” Jun. 2020. [Online]. Available:
the need for a structured and comprehensive methodology and                   https://webkit.org/tracking-prevention/
system for assisting developers and researchers in uncover-               [7] “Accelerate networking with HTTP/3 and QUIC - WWDC21 -
                                                                              Videos,” 2021. [Online]. Available: https://developer.apple.com/videos/
ing the tracking risk introduced by browser mechanisms. To                    play/wwdc2021/10094/
address that gap we developed CanITrack, and demonstrated
                                                                          [8]   “Chrome         Design      Doc:    Trust      Token     API,”     2021.
its capabilities by analyzing a multitude of heterogeneous                      [Online].         Available:        https://docs.google.com/document/d/
mechanisms. In fact, our system was able to identify the                        1TNnya6B8pyomDK2F1R9CL3dY10OAmqWlnCxsWyOBDVQ/
privacy threat introduced by four mechanisms that have not                      edit?usp=sharing&usp=embed facebook
been previously analyzed (including two high profile propos-              [9]   “CISCO - Consumer Privacy Survey,” https://www.cisco.
als from Google’s Privacy Sandbox) and unearth previously                       com/c/dam/en us/about/doing business/trust-center/docs/
undiscovered bugs in existing mechanisms.                                       cisco-cybersecurity-series-2021-cps.pdf, 2021.
                                                                         [10]   “Desktop Browser Market Share Worldwide,” Oct. 2021.
                                                                                [Online]. Available: https://gs.statcounter.com/browser-market-share/
                     VII.   C ONCLUSION                                         desktop/worldwide/
    With the web playing a pivotal role in some of our most              [11]   “NordVPN - How Am I Being Tracked,” https://nordvpn.com/
private and sensitive moments, ensuring the privacy of our                      research-lab/tracked-down/, 2021.
online activities has become a matter of paramount importance.           [12]   “State Partitioning - Privacy, permissions, and information security |
This complex ecosystem is driven by the ever-evolving set of                    MDN,” 2021. [Online]. Available: https://developer.mozilla.org/en-US/
                                                                                docs/Web/Privacy/State Partitioning
browsers that mediate our online actions and communications.
As more features get incorporated, systematically testing the            [13]   “W3c - permissions policy explainer,” 2021. [Online].
                                                                                Available: https://github.com/w3c/webappsec-permissions-policy/blob/
privacy risk introduced by new mechanisms has become a                          main/permissions-policy-explainer.md
daunting task. To facilitate and streamline research around              [14]   “Issue 1176287: Reconsider the choice of crypto for signing trust
online tracking we have developed CanITrack, a mechanism-                       tokens, or document why we chose what we did,” 2021-02-
agnostic framework that comprehensively assesses whether a                      09. [Online]. Available: https://bugs.chromium.org/p/chromium/issues/
browser mechanism can be misused for tracking purposes                          detail?id=1176287
under different scenarios. To demonstrate the utility of our             [15]   “Access-Control-Max-Age - HTTP | MDN,” 2022. [On-
system, we presented an extensive evaluation of 21 browser                      line]. Available: https://developer.mozilla.org/en-US/docs/Web/HTTP/
                                                                                Headers/Access-Control-Max-Age
mechanisms, including four that to the best of our knowledge
have never been analyzed before. Our experiments uncovered               [16]   “browsingData.remove() - Mozilla | MDN,” 2022. [Online].
                                                                                Available: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/
a wide range of flaws, with the latest version of every browser                 WebExtensions/API/browsingData/remove
we tested being vulnerable to at least one tracking technique.           [17]   “Chrome       -    An     updated    timeline     for   Privacy    Sand-
Overall our findings highlight the importance of employing                      box            milestones,”         https://blog.google/products/chrome/
principled and comprehensive browser-auditing strategies for                    updated-timeline-privacy-sandbox-milestones/amp/, 2022.


                                                                    14
[18]   “Chrome     Web   Storage and     Quota    Concepts,”   2022.                   [44]   Y. Dimova, G. Acar, L. Olejnik, W. Joosen, and T. Van Goethem,
       [Online].     Available:   https://docs.google.com/document/d/                         “The CNAME of the Game: Large-scale Analysis of DNS-
       19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/edit#                                     based Tracking Evasion,” in Proceedings on Privacy Enhancing
       heading=h.uc5wcu4n4rnw                                                                 Technologies. Proceedings on Privacy Enhancing Technologies, Mar.
[19]   “chrome.browsingData,” 2022. [Online]. Available: https://developer.                   2021, pp. 394–412, arXiv: 2102.09301. [Online]. Available: https:
       chrome.com/docs/extensions/reference/browsingData/                                     //petsymposium.org/2021/files/papers/issue3/popets-2021-0053.pdf
[20]   “chromium/src - Commit r960512,” Jan. 2022, publisher: Google.                  [45]   S. Dutton, “Getting started with Trust Tokens,” 2020, publisher:
       [Online]. Available: https://chromium.googlesource.com/chromium/src/                   web.dev. [Online]. Available: https://web.dev/trust-tokens/
       +/6241ea2c4875d1343594f3db53be489649335351                                      [46]   ——, “FLEDGE API,” 2022, publisher: web.dev. [Online]. Available:
[21]   “Clear-Site-Data - HTTP | MDN,” 2022. [Online]. Available: https://                    https://developer.chrome.com/docs/privacy-sandbox/fledge/
       developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data               [47]   P. Eckersley, “How unique is your web browser?” in Proceedings of
[22]   “Express - Node.js web application framework,” 2022, publisher:                        the 10th International Conference on Privacy Enhancing Technologies,
       Express. [Online]. Available: https://expressjs.com/                                   2010.
                                                                                       [48]   A. Edelstein, “Which browsers are best for privacy?” 2021. [Online].
[23]   “Fenced Frames Ad Reporting,” 2022, publisher: turtledove.
                                                                                              Available: https://privacytests.org/
       [Online]. Available: https://github.com/WICG/turtledove/blob/main/
       Fenced Frames Ads Reporting.md                                                  [49]   S. Englehardt and A. Narayanan, “Online tracking: A 1-million-site
                                                                                              measurement and analysis,” in Proceedings of the 2016 ACM SIGSAC
[24]   “FLEDGE API developer guide,” 2022, publisher: turtledove. [Online].
                                                                                              Conference on Computer and Communications Security, ser. CCS ’16,
       Available: https://github.com/WICG/turtledove/blob/main/FLEDGE.md
                                                                                              2016, pp. 1388–1401.
[25]   “Google - The Privacy Sandbox,” https://privacysandbox.com/, 2022.
                                                                                       [50]   B. Fulgham, “Protecting Against HSTS Abuse,” Mar. 2018. [Online].
[26]   “HTTP/3 protocol | Can I use... Support tables for HTML5, CSS3,                        Available: https://webkit.org/blog/8146/protecting-against-hsts-abuse/
       etc,” 2022. [Online]. Available: https://caniuse.com/http3                      [51]   A. Ghedini, “Speeding up HTTPS and HTTP/3 negotiation with...
[27]   “HTTP/3 protocol | Can I use... Support tables for HTML5, CSS3,                        DNS,” 2020, publisher: Cloudflare. [Online]. Available: https://blog.
       etc,” 2022. [Online]. Available: https://caniuse.com/?search=alt-svc                   cloudflare.com/speeding-up-https-and-http-3-negotiation-with-dns/
[28]   “Performance - Web APIs | MDN,” 2022, publisher: MDN.                           [52]   E. Hammer-Lahav and M. Nottingham, “Defining Well-Known
       [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/API/                 Uniform Resource Identifiers (URIs),” Internet Engineering Task
       Performance                                                                            Force, Request for Comments RFC 5785, Apr. 2010. [Online].
[29]   “Puppeteer | Tools for Web Developers,” 2022. [Online]. Available:                     Available: https://datatracker.ietf.org/doc/rfc5785/
       https://developers.google.com/web/tools/puppeteer                               [53]   I. Hickson, “Web SQL Database,” Nov. 2010. [Online]. Available:
[30]   “reCAPTCHA,” 2022, publisher: Google. [Online]. Available: https:                      https://www.w3.org/TR/webdatabase/
       //www.google.com/recaptcha/about/                                               [54]   C. Hothersall-Thomas, S. Maffeis, and C. Novakovic, “Browseraudit:
[31]   “Reporting API - Web APIs | MDN,” 2022. [Online]. Available:                           automated testing of browser security features,” in Proceedings of the
       https://developer.mozilla.org/en-US/docs/Web/API/Reporting API                         2015 international symposium on software testing and analysis, 2015,
                                                                                              pp. 37–47.
[32]   “Third-party cookies and Firefox tracking protection | Firefox
       Help,” 2022. [Online]. Available: https://support.mozilla.org/en-US/kb/         [55]   S. Kamkar, “Evercookie- virtually irrevocable persistent cookies,”
       third-party-cookies-firefox-tracking-protection                                        Septemer 2010. [Online]. Available: http://samy.pl/evercookie/
[33]   “Welcome to PyAutoGUI’s documentation!                — PyAutoGUI               [56]   S. Karami, P. Ilia, K. Solomos, and J. Polakis, “Carnus: Exploring the
       documentation,” 2022. [Online]. Available:            https://pyautogui.               privacy threats of browser extension fingerprinting,” in Proceedings of
       readthedocs.io/en/latest/                                                              the Symposium on Network and Distributed System Security (NDSS),
                                                                                              2020.
[34]   “CanITrack Repository,” https://github.com/masood/canitrack, 2023.
                                                                                       [57]   S. Karami, F. Kalantari, M. Zaeifi, X. J. Maso, E. Trickel,
[35]   W. I. C. , “Trust Token API Explainer,” 2020, publisher: WICG.                         P. Ilia, Y. Shoshitaishvili, A. Doupé, and J. Polakis, “Unleash
       [Online]. Available: https://github.com/WICG/trust-token-api                           the simulacrum: Shifting browser realities for robust Extension-
[36]   G. Acar, C. Eubank, S. Englehardt, M. Juarez, A. Narayanan, and                        Fingerprinting prevention,” in 31st USENIX Security Symposium
       C. Diaz, “The web never forgets: Persistent tracking mechanisms in                     (USENIX Security 22). Boston, MA: USENIX Association, Aug.
       the wild,” in Proceedings of the 2014 ACM SIGSAC Conference on                         2022, pp. 735–752. [Online]. Available: https://www.usenix.org/
       Computer and Communications Security, ser. CCS ’14. New York,                          conference/usenixsecurity22/presentation/karami
       NY, USA: Association for Computing Machinery, 2014, p. 674–689.                 [58]   L. Knittel, C. Mainka, M. Niemietz, D. T. Noß, and J. Schwenk,
       [Online]. Available: https://doi.org/10.1145/2660267.2660347                           “Xsinator.com: From a formal model to the automatic evaluation
[37]   ——, “The web never forgets: Persistent tracking mechanisms in                          of cross-site leaks in web browsers,” in Proceedings of the
       the wild,” in Proceedings of the 2014 ACM SIGSAC Conference on                         2021 ACM SIGSAC Conference on Computer and Communications
       Computer and Communications Security, 2014, pp. 674–689.                               Security, ser. CCS ’21. New York, NY, USA: Association for
                                                                                              Computing Machinery, 2021, p. 1771–1788. [Online]. Available:
[38]   M. D. Ayenson, D. J. Wambach, A. Soltani, N. Good, and C. J.
                                                                                              https://doi.org/10.1145/3460120.3484739
       Hoofnagle, “Flash cookies and privacy ii: Now with html5 and
       etag respawning,” Available at SSRN, 2011. [Online]. Available:                 [59]   M. Koop, E. Tews, and S. Katzenbeisser, “In-depth evaluation of
       http://dx.doi.org/10.2139/ssrn.1898390                                                 redirect tracking and link usage,” Proceedings on Privacy Enhancing
                                                                                              Technologies, vol. 4, pp. 394–413, 2020. [Online]. Available: https:
[39]   J. Bell, “File and Directory Entries API,” Aug. 2021, publisher: W3C.                  //petsymposium.org/2020/files/papers/issue4/popets-2020-0077.pdf
       [Online]. Available: https://wicg.github.io/entries-api/
                                                                                       [60]   A. Lerner, A. K. Simpson, T. Kohno, and F. Roesner, “Internet jones and
[40]   Brave Software, “Understanding Redirection-Based Tracking,” Aug.                       the raiders of the lost trackers: An archaeological study of web tracking
       2018. [Online]. Available: https://brave.com/redirection-based-tracking/               from 1996 to 2016,” in 25th USENIX Security Symposium (USENIX
[41]   D. Creager and I. Clelland, “Network Error Logging,” Jul.                              Security 16), 2016.
       2021, publisher: W3C. [Online]. Available: https://w3c.github.io/               [61]   M. Luo, P. Laperdrix, N. Honarmand, and N. Nikiforakis, “Time does
       network-error-logging/                                                                 not heal all wounds: A longitudinal analysis of security-mechanism
[42]   D. Creager, I. Clelland, and M. West, “Reporting API,” Apr.                            support in mobile browsers,” in Proceedings of the 26th Network and
       2022, publisher: W3C. [Online]. Available: https://www.w3.org/TR/                      Distributed System Security Symposium (NDSS), 2019.
       reporting-1/                                                                    [62]   M. Luo, O. Starov, N. Honarmand, and N. Nikiforakis, “Hindsight:
[43]   A. Davidson, I. Goldberg, N. Sullivan, G. Tankersley, and F. Valsorda,                 Understanding the evolution of ui vulnerabilities in mobile browsers,”
       “Privacy pass: Bypassing internet challenges anonymously.” Proc. Priv.                 in Proceedings of the 2017 ACM SIGSAC Conference on Computer and
       Enhancing Technol., vol. 2018, no. 3, pp. 164–180, 2018.                               Communications Security, 2017, pp. 149–162.


                                                                                  15
[63]   R. Marx, “HTTP/3: Practical Deployment Options (Part 3),” Sep.                 [82] Wikipedia contributors, “Chromium (web browser) — Wikipedia,
       2021. [Online]. Available: https://www.smashingmagazine.com/2021/                   the free encyclopedia,” https://en.wikipedia.org/w/index.php?title=
       09/http3-practical-deployment-options-part3/                                        Chromium (web browser)&oldid=1084930496,         2022,    [Online;
[64]   K. Mowery and H. Shacham, “Pixel perfect: Fingerprinting canvas in                  accessed 28-April-2022].
       html5,” 2012, pp. 1–12.                                                        [83] J. Wilander, “Full Third-Party Cookie Blocking and More,”
                                                                                           Mar. 2020. [Online]. Available: https://webkit.org/blog/10218/
[65]   Mozilla, “Firefox Rolls Out Total Cookie Protection By
                                                                                           full-third-party-cookie-blocking-and-more/
       Default     To     All    Users    |    The     Mozilla     Blog,”   Jun.
       2022.     [Online].     Available:    https://blog.mozilla.org/en/mozilla/
       firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/
[66]   M. Nalpas, “Monitor your web application with the Reporting API,”
       Oct. 2021. [Online]. Available: https://web.dev/reporting-api/
[67]   N. Nikiforakis, A. Kapravelos, W. Joosen, C. Kruegel, F. Piessens,
       and G. Vigna, “Cookieless monster: Exploring the ecosystem of web-
       based device fingerprinting,” in 2013 IEEE Symposium on Security and
       Privacy. IEEE, 2013, pp. 541–555.
[68]   M. Perry, E. Clark, S. Murdoch, and G. Koppen, “The Design
       and Implementation of the Tor Browser [DRAFT],” 2019. [Online].
       Available: https://2019.www.torproject.org/projects/torbrowser/design/
[69]   J. Schwenk, M. Niemietz, and C. Mainka, “Same-Origin Policy: Eval-
       uation in Modern Browsers,” in 26th USENIX Security Symposium
       (USENIX Security 17), 2017, pp. 713–727.
[70]   E. Skeggs, “Using CORS policies to implement CSRF protection
       - Mixmax Engineering Blog,” 2017. [Online]. Available: https:
       //www.mixmax.com/engineering/modern-csrf
[71]   P. Snyder, S. Karami, B. Livshits, and H. Haddadi, “Pool-
       party: Exploiting browser resource pools as side-channels for web
       tracking,” CoRR, vol. abs/2112.06324, 2021. [Online]. Available:
       https://arxiv.org/abs/2112.06324
[72]   K. Solomos, P. Ilia, S. Karami, N. Nikiforakis, and J. Polakis,
       “The dangers of human touch: Fingerprinting browser extensions
       through user actions,” in 31st USENIX Security Symposium (USENIX
       Security 22). Boston, MA: USENIX Association, Aug. 2022,
       pp. 717–733. [Online]. Available: https://www.usenix.org/conference/
       usenixsecurity22/presentation/solomos
[73]   K. Solomos, P. Ilia, N. Nikiforakis, and J. Polakis, “Escaping the
       confines of time: Continuous browser extension fingerprinting through
       ephemeral modifications,” in Proceedings of the 2022 ACM SIGSAC
       Conference on Computer and Communications Security, 2022, pp.
       2675–2688.
[74]   K. Solomos, J. Kristoff, C. Kanich, and J. Polakis, “Tales of
       Favicons and Caches: Persistent Tracking in Modern Browsers –
       NDSS Symposium,” Virtual, Feb. 2021, pp. 1–19. [Online]. Available:
       https://dx.doi.org/10.14722/ndss.2021.24202
[75]   A. Soltani, S. Canty, Q. Mayo, L. Thomas, and C. J. Hoofnagle,
       “Flash cookies and privacy,” in 2010 AAAI Spring Symposium Series,
       2010. [Online]. Available: http://dx.doi.org/10.2139/ssrn.1446862
[76]   M. Squarcina, M. Tempesta, L. Veronese, S. Calzavara, and
       M. Maffei, “Can i take your subdomain? exploring Same-Site
       attacks in the modern web,” in 30th USENIX Security Symposium
       (USENIX Security 21). USENIX Association, Aug. 2021, pp.
       2917–2934. [Online]. Available: https://www.usenix.org/conference/
       usenixsecurity21/presentation/squarcina
[77]   O. Starov and N. Nikiforakis, “Xhound: Quantifying the fingerprintabil-
       ity of browser extensions,” in IEEE Symposium on Security and Privacy
       (SP). IEEE, 2017, pp. 941–956.
[78]   P. Syverson and M. Traudt, “HSTS supports targeted surveillance,”
       in 8th USENIX Workshop on Free and Open Communications on
       the Internet (FOCI 18). Baltimore, MD: USENIX Association, Aug.
       2018. [Online]. Available: https://www.usenix.org/conference/foci18/
       presentation/syverson
[79]   T. Tiwari and A. Trachtenberg, “Alternative (ab)uses for HTTP
       alternative services,” in 13th USENIX Workshop on Offensive
       Technologies (WOOT 19). Santa Clara, CA: USENIX Association,
       Aug. 2019. [Online]. Available: https://www.usenix.org/conference/
       woot19/presentation/tiwari
[80]   Vimeo, “Favicon History Sniffer: Chrome,” 2022. [Online]. Available:
       https://vimeo.com/705259642
[81]   ——, “Favicon History Sniffer: Safari,” 2022. [Online]. Available:
       https://vimeo.com/705259659


                                                                                 16
                                                                            write (uniqueID, domainList) {
                          A PPENDIX                                           for (let i = 0; i < domainList.length; i++) {
                                                                                if(uniqueID[i] == '1') {
   In Table VII, we provide descriptions of the write()                             let image = document.createElement("img");
and read() actions for each evaluated mechanism. The                                image.src = `https://${domainList[i]}/
                                                                                        image`;
descriptions offer further insight into the unique quirks of each                   document.body.appendChild(image);}}}
approach, reframing accesses to these mechanisms as reading
and writing methods.                                                        read (domainList) {
                                                                              let uniqueID = '';
   Example implementation of a browser mechanism in                           for (let i = 0; i < domainList.length; i++) {
CanITrack. We use the Image Cache as an example browser                         // Request the image
mechanism to illustrate the testing process using CanITrack.                    let image = document.createElement("img");
                                                                                image.src = `https://${domainList[i]}/image`;
This example also provides an estimate of the workload                          document.body.appendChild(image);
required to add a new browser mechanism for testing with                        // Check if image was fetched from the server
CanITrack.                                                                      let response = await fetch(`https://${
                                                                                    domainList[i]}/accesses`);
    When a webpage makes a request for an image re-                             uniqueID += (await response.text()).trim();}
source, the browser caches the returned image based on the
Cache-Control header included in the response object.                           return uniqueID;
                                                                            }
This mechanism requires three components in order to be
tested using CanITrack.                                                     Listing 6: Sample Read and Write Methods for Image Cache.

 1) File Resource. The user provides an image file as a                       CanITrack’s framework then places and invokes the
    resource, whose path is accessible to the Web Server.                 write() and read() mechanisms in different first- and
 2) Network Requests. The user handles two paths relevant to              third-party contexts. Since those two methods interact with
    the browser mechanism on the Web Server:                              the mechanism-specific server-side requests and file resource,
    • Image Request. To be responded with the image file. If              the additional workload for the user includes handling those
       the request is received from the write() method, the               requests and providing the resource.
       response should include a Cache-Control header to
       ensure that the browser stores the image. If the request
       is received from the read() method, a global object
       should be updated to record the number of requests that
       were seen for the requesting domain.
    • Number of Accesses. To be responded with the number
       of times a request for the image was received from each
       requested domain.

       // Image Request
       if (request.url.includes("/image")) {
         if (testPhase == 'write') {
           response.set('Cache-Control', 'max-age
               =31536000');}
         if (testPhase == 'read') {
           imageAccesses[req.headers.host]+=1;}
         response.sendFile('/path/to/image');}
       // Number of Accesses
       if (request.url.includes("/accesses")) {
         response.send(imageAccesses[request.headers.
             host]);}

  Listing 5: Sample Network Request Handling for Image Cache.

 3) write() and read() methods. These JavaScript meth-
    ods will be called by various test scripts on the client-side.
    • write(): This method receives a unique, 32-bit iden-
      tifier, and a list of domains. For every bit of the
      identifier that is equal to ‘1’, it requests an image from
      the corresponding domain.
    • read(): This method receives a list of domains as
      an input. It requests an image from each of the 32
      domains. It then requests the server to respond with the
      number of requests that had been sent over the network
      for each domain. If the image for a domain was served
      from the cache, the server wouldn’t have observed any
      request for the corresponding domain (i.e., bit 1). All
      other domains correspond to bit 0 values.


                                                                     17
          TABLE VII: Overview of the caching mechanisms evaluated by CanITrack. Novel tracking vectors are indicated by :.
   API                           Write Mechanism                                       Read Mechanism                          Bits/Page   Notes
Cookies         Write the identifier using the document.cookie        Look at entries in the document.cookie API               32
                API
Storage API:
Local Stor- Call localStorage.setItem()                               Call localStorage.getItem()                              32
age
IndexedDB     Create a new Database and Object Store. Write the       Read the identifier from the same Object Store.          32
              identifier to the Object Store.
Cache Stor- Add identifier to URL path and cache the request          Access entries from the cache API.                       32
age           using the client-side API.
File-based Mechanisms:
CSS Cache     Create a new link element for a stylesheet. The         Request stylesheets from the server. Requests not        32
              server responds with a ’Cache-Control’ header.          observed at the server were served from the cache.
Font Cache    Add a new webfont and apply it to an HTML ele-          Apply the same webfont to an HTML element. The           32
              ment. The server responds with a ’Cache-Control’        server observes requests for fonts that were not
              header.                                                 served from the cache.
Image Cache Create a new img element, set the src, and add it         Create a new img element, set the same src, and          32
              to the DOM. The server responds with a ’Cache-          add it to the DOM. The server observes requests for
              Control’ header.                                        images that were not served from the cache.
HTTP Disk Create a new Fetch or XHR request for any re-               Send the same Fetch or XHR request. The server           32
Cache         source. The server responds with a ’Cache-Control’      observes requests that were not served from the
              header.                                                 cache.
Favicon       The browser requests a favicon based on the link el-    Revisit the same page. The server observes a request     1           [74]
Cache         ement. The server responds with a ’Cache-Control’       for favicons that were not served from the cache.
              header.
Service Workers:
Variable      Register a new service worker with is scope set to      Access the service worker and read back the value        32
Scope         ’/’, set a value in a variable.                         stored in the previously defined variable.
Cache         Register a new service worker with is scope set to      Create a fetch request that is intercepted by the        32
              ’/’. Add a cache entry that requests the server for a   service worker, and the identifier stored in the cache
              32-bit identifier.                                      entry is returned.
HTTP Headers and Network Config-based Mechanisms:
Alt-Svc       Send a network request for a domain. The server         Create the same network request. HTTP/2 or               32          [79]
              includes an Alt-Svc header in each response, in-        HTTP/3 requests observed at the server indicate
              dicating the availability of HTTP/2 and HTTP/3          entries in the Alt-Svc cache.
              services.
HSTS          Send a new HTTP request. The server ugrades the         Resend the same HTTP requests. The browser up-           32          [78]
              requests to HTTPS.                                      grades the request to HTTPS.
HTTP Auth     Send a network request including credentials in the     Send the same requests without providing creden-         32
              ’Authorization’ header.                                 tials. The browser adds the ’Authorization’ header
                                                                      from cache.
CORS Pre-       Send a cross-origin request. The browser sends a      Send the same cross-origin request. The browser          32          :
flight          preflight request before the actual request.          observes an existing preflight in the cache and does
                                                                      not send an OPTIONS request.
Accept-CH   The server includes client hint values in the ’Accept-    The server observes client hints added by the            5           :
            CH’ response header.                                      browser on future requests.
NEL         The server includes a reporting URL in the ’NEL’          The server receives reports from the browser at the      32
            and ’Report-To’ Headers.                                  reporting URL.
Chromium-specific Mechanisms:
File System Call the ’window.webkitRequestFileSystem’. Create         Call the ’window.webkitRequestFileSystem’. Ac-           32
            a new Directory and store the identifier in a new file.   cess the previously created directory and file. Return
                                                                      the identifier.
WebSQL          Access the DB using ’window.openDatabase’. Use        Access the DB and run a ’SELECT’ query to read           32
                SQL commands to create a new table and insert the     the identifier.
                identifier into a row.
FLEDGE          Add the browser to an interest group, whose owner     Run an auction, with a single domain as the buyer. If    8           :
API             is a specific domain.                                 the auction is successful, the browser has an interest
                                                                      group belonging to the domain.
Private State   Create a new fetch request, and issue a token from    Call the ’document.hasTrustToken()’ API to check         2           :
Token API       a domain.                                             if a token exists from the domain.




                                                                      18
