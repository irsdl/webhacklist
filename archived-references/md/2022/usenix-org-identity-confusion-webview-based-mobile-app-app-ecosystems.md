---
type: Article
title: Identity Confusion in WebView-based Mobile App-in-app Ecosystems
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/zhang-lei"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:23:53+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/zhang-lei"
    title: Identity Confusion in WebView-based Mobile App-in-app Ecosystems
    author: Lei Zhang, Zhibo Zhang, Ancong Liu, Yinzhi Cao, Xiaohan Zhang, Yanjun Chen, Yuan Zhang, Guangliang Yang, Min Yang
also_at:
  - "https://www.usenix.org/system/files/sec22-zhang-lei.pdf"
  - "https://www.usenix.org/system/files/sec22_slides-zhang_lei.pdf"
authors:
  - Lei Zhang
  - Zhibo Zhang
  - Ancong Liu
  - Yinzhi Cao
  - Xiaohan Zhang
  - Yanjun Chen
  - Yuan Zhang
  - Guangliang Yang
  - Min Yang
canonical_url: ""
cited_by:
  - "2022.md:67"
commit: ""
content_sha256: 367c5f6026f322944140564fcc6c29ad33a514992eae045c384280de1b76fd17
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/zhang-lei"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 76a11ce70280851ab89beba7dfbf22927d4d6413f38f4dc26a8b88fa8e79f7f1
retrieved_from: "https://www.usenix.org/system/files/sec22-zhang-lei.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:23:53+00:00"
slug: usenix-org-identity-confusion-webview-based-mobile-app-app-ecosystems
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Identity Confusion in WebView-based Mobile App-in-app Ecosystems

**Identity Confusion in WebView-based Mobile App-in-app Ecosystems** - Lei Zhang, Zhibo Zhang, Ancong Liu, Yinzhi Cao, Xiaohan Zhang, Yanjun Chen, Yuan Zhang, Guangliang Yang, Min Yang, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/zhang-lei>
- Also published at: <https://www.usenix.org/system/files/sec22-zhang-lei.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22_slides-zhang_lei.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-zhang-lei.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Identity Confusion in WebView-based
        Mobile App-in-app Ecosystems
Lei Zhang, Zhibo Zhang, and Ancong Liu, Fudan University; Yinzhi Cao,
 Johns Hopkins University; Xiaohan Zhang, Yanjun Chen, Yuan Zhang,
          Guangliang Yang, and Min Yang, Fudan University
  https://www.usenix.org/conference/usenixsecurity22/presentation/zhang-lei




   This paper is included in the Proceedings of the
          31st USENIX Security Symposium.
                August 10–12, 2022 • Boston, MA, USA
                             978-1-939133-31-1




                                     Open access to the Proceedings of the
                                      31st USENIX Security Symposium is
                                            sponsored by USENIX.
          Identity Confusion in WebView-based Mobile App-in-app Ecosystems


          Lei Zhang1,⋆ , Zhibo Zhang1,⋆ , Ancong Liu1 , Yinzhi Cao2 , Xiaohan Zhang1 , Yanjun Chen1
                                  Yuan Zhang1 , Guangliang Yang1 , Min Yang1
                               1: Fudan University, 2: Johns Hopkins University
    1: {zxl, zhibozhang19, acliu19, xh_zhang, yanjunchen20, yuanxzhang, yanggl, m_yang}@fudan.edu.cn
                                             2: yinzhi.cao@jhu.edu
                         ⋆: The first two authors have contributed equally to this work.



                         Abstract                                  community developing and maintaining sub-apps is called a
Mobile applications (apps) often delegate their own functions      mobile “app-in-app” ecosystem. Some “app-in-app” ecosys-
to other parties, which makes them become a super ecosystem        tems are extremely popular, e.g., WeChat [1] is hosting >3.8
hosting these parties. Therefore, such mobile apps are being       million sub-apps, which is even more than the number (3.04
called super-apps, and the delegated parties are subsequently      million) of Android apps in Google Play [7].
called sub-apps, behaving like “app-in-app”. Sub-apps not             Figure 1 illustrates a typical architecture of an app-in-app
only load (third-party) resources like a normal app, but also      ecosystem based on our study of 47 popular super-apps. When
have access to the privileged APIs provided by the super-app.      a user clicks a Universal Resource Identifier (URI) specifying
This leads to an important research question—determining           the super-app protocol and a sub-app ID, the super-app loads
who can access these privileged APIs.                              the sub-app from its server into a WebView instance. After
   Real-world super-apps, according to our study, adopt three      that, there are two important steps for a sub-app. First, a sub-
types of identities—namely web domains, sub-app IDs, and           app may load third-party resources with different identities
capabilities—to determine privileged API access. However,          into web frames of the WebView [11] instance. For example,
existing identity checks of these three types are often not well   Pagoda [8], a fruit franchise with 4,000+ stores nationwide in
designed, leading to a disobey of the least privilege principle.   China, loads a cloud provider’s domain for remote backup and
That is, the granted recipient of a privileged API is broader      an advertisement provider domain. Second, a sub-app may
than intended, thus defined as an “identity confusion” in this     access privileged APIs provided by the super-app with sensi-
paper. To the best of our knowledge, no prior works have           tive and powerful functionalities. Examples of these APIs are
studied this type of identity confusion vulnerability.             access to saved user data (e.g., account, friends, and phone
   In this paper, we perform the first systematic study of iden-   number used in registration) and utilization of OS-level re-
tity confusion in real-world app-in-app ecosystems. We find        sources reserved for the super-app (e.g., location, camera, and
that confusions of the aforementioned three types of identities    microphone).
are widespread among all 47 studied super-apps. More impor-
tantly, such confusions lead to severe consequences such as           One crucial security research question in an app-in-app
manipulating users’ financial accounts and installing malware      ecosystem is determining who can call specific privileged
on a smartphone. We responsibly reported all of our findings       APIs provided by the super-app, given the existence of multi-
to developers of affected super-apps, and helped them to fix       party resources and the access to privileged APIs in one sub-
their vulnerabilities.                                             app. This “who” question is an access control issue or, more
                                                                   specifically, an identity check problem. That is, the super-
1     Introduction                                                 app needs to check the identity of a runtime API invocation
Nowadays, mobile applications (apps) bring significant con-        and determine whether the invocation is legitimate. While
venience to people’s work and daily lives with rich func-          the problem is intuitively simple, the challenge is that many
tionalities. To better serve existing users and keep attract-      different definitions of identities exist in a super-app. The
ing new users, these mobile apps—or called super- or host-         first is the domain name, one crucial element in the web
apps—often delegate some of their functions to other parties       origin triple because WebView is used to render sub-apps.
for content and functionality enrichment. These parties with       The second type of identity is a sub-app ID assigned by the
delegated functions are thus defined as “sub-apps”, and the        super-app because the super-app loads sub-apps from their



USENIX Association                                                                    31st USENIX Security Symposium         1597
     Other                      Sub-app                  Super-app             End User     ● Domain name confusion. Such confusion could arise
  Web Resources                 Developer                Developer
 Web Server      Content
                                                                                              when a malicious sub-app with an unprivileged app ID
                                                                                              loads a privileged web domain, and the super-app only
  a.com                                                                                       checks the domain name for identity. Particularly, we find
                              Sub-app Server          Super-app Server
                                                                                              that there exist race conditions among rendering the web
  b.com                                                                                       content, obtaining the domain name, and checking the
                       load                    load                  install     App          domain name. When the rendered content has a different
  c.com                                     on the fly                                        domain name from what is being checked, domain name
        ······                   Sub-app                 Super-app
                                                                                              confusion arises.
                                       download                  download                   ● App ID confusion. Such confusion could arise when an
                                                                                              unprivileged web domain resides in a privileged sub-app,
                              Sub-app Market             App Store                            and the super-app only checks the app ID. We design a
                                                                                              mimicry attack to achieve this purpose in loading mali-
Figure 1: Simplified relationships of participants in the app-                                cious URLs into a privileged sub-app. The attack first
in-app ecosystem.                                                                             abuses webpage redirections of some sub-apps and then
                                                                                              exploits flawed URI loading checks of super-apps, e.g.,
                                                                                              string matching that checks suffixes and insecure regular
                                                                                              expressions.
servers hosting the sub-app code. The last is a secret, called a
                                                                                            ● Capability confusion. Such capability confusion may
capability, shared between a super-app and a sub-app.
                                                                                              come from either a malicious app ID or a malicious do-
   Existing super-apps often adopt one of the aforementioned                                  main name with a privileged capability. We design leak
three types of identities to check privileged API invocation.                                 attacks to steal or obtain the capability that can be used to
However, none of these identities, at least those adopted by                                  invoke privileged APIs. Specifically, we find that the APIs
existing super-apps, are atomic, thus disobeying the least priv-                              to obtain capabilities can often be reverse-engineered and
ilege principle. For example, a privileged web domain may be                                  called without any protections against adversaries.
embedded in an unprivileged sub-app; a sub-app with a priv-                                  Our systematic study involves 47 high-profile super-apps
ileged sub-app ID as the identity may contain unprivileged,                               collected from three leading app stores and ranked by their
third-party web domains; similarly, a privileged capability                               popularity. Our results show that they (both the Android and
may be obtained by an unprivileged sub-app as well. That is,                              iOS versions) are all vulnerable to at least one type of identity
when a super-app grants a privilege to identity in an app-in-                             confusion attack despite the diversity in identity checks. We
app ecosystem, the intended recipient can be broader than, or                             then explore and study the further consequences of identity
different from, the identity that actually represents. Therefore,                         confusion beyond breaking identity checks. We find that such
an adversary can often disguise her own identity to be one                                confusion vulnerabilities lead to consequences such as phish-
with the granted permission, confusing the super-app that per-                            ing, privacy leaks, and privilege escalation. Specifically, 31
forms the identity check. Such a vulnerability, if it exists in                           are further vulnerable to phishing, 35 privacy leaks, and 38
an app-in-app ecosystem, is defined as identity confusion in                              privilege escalations. We report all the vulnerabilities to cor-
the paper.                                                                                responding super-app developers and help them with the fix.
   To the best of our knowledge, no prior works have studied                              As an example, we have a regular monthly meeting schedule
identity confusion vulnerabilities in the app-in-app ecosys-                              with Alipay for half a year before fixing the vulnerability.
tem. There are two categories of prior works on WebView                                      We summarize the contributions of this paper as below:
vulnerabilities. The first category [21, 31, 33, 36] assumes that                           ● We conduct the first systematic study on identity confu-
WebView as a whole is untrusted, which needs to be isolated                                   sion vulnerabilities in super-apps with app-in-app ecosys-
from the host app. In such a threat model, identities are clearly                             tems by analyzing their design and implementation flaws.
defined and separated, i.e., WebView vs. the host app. The                                    We find three types of confusion vulnerabilities: app ID,
second category [35, 45, 48, 52] explores vulnerabilities in                                  domain name, and capability.
WebView itself, e.g., URL display of WebView content. In                                    ● We collect and analyze 47 popular real-world super-apps,
this threat model, identities are clearly defined as web origins.                             which exceed 46 billion downloads in total. Our analysis
Fundamentally, our identity confusion vulnerability is due to                                 confirms that they are all vulnerable to different types
the introduction of sub-apps, which overlaps with the classic                                 of identity confusion vulnerabilities. Such vulnerabilities
origin identity introduced by WebView from the Web.                                           can further lead to severe consequences, such as stealing
    In this paper, we perform the first systematic study of iden-                             bank accounts and remote installation of malicious apps.
tity confusion vulnerabilities and their exploits in the real-                              ● We thoroughly study why such identity confusion vul-
world app-in-app ecosystems. The adoption of different iden-                                  nerabilities exist and propose corresponding mitigation
tities naturally categorizes vulnerabilities into three types:                                strategies based on the causes.



1598      31st USENIX Security Symposium                                                                                            USENIX Association
Table 1: Top 15 popular super-apps and their sub-app markets.
"-" means there are no public statistics, and it is hard to esti-                                  Cloud
                                                                                                             Ads. …
                                                                                                  Provider
mate the number of sub-apps in the corresponding market.               Market     App              3rd-party Web Content
                                                                            Developer Server
      Super-app Name       Category         Downloads   Market Size
           TikTok             Social         18.8B+          -                            Sub-app                        Sub-app
           WeChat        Communication        2.1B+       3.8M+
          Snapchat            Social           1B+          6+              Sub-app                         Other
          Kuaishou            Social         780M+           -               trusted                        web
           Alipay            Finance         690M+         2M+              content                        content
            Line         Communication       500M+           -
         UC Browser      Communication       500M+         1K+
            Baidu             Tools           410M        420K+                                                                    Super-app
        JinRiTouTiao    News & Magazines     220M+           -                                                       Sub-app
      Microsoft Teams       Business         100M+         911+               Worker          app ID WebView         runtime
            Grab        Maps & Navigation    100M+           -                                        domain
             VK               Social         100M+         219+                                       capability
           Paytm             Finance         100M+         176+                   web-to-mobile bridge
           Go-Jek        Travel & Local       50M+         15+                                                          Access
          UnionPay           Finance         39.7M+        705+                         runtime APIs                    Control
                                                                                                                                    Super-app Server
                                                                                                 access
                                                                                       user
                                                                             UI                  network     …
                                                                                       data
2      App-in-app Ecosystem: A Survey Study
                                                                                                 IPC
In this section, we present a brief survey study of existing                                    System Services
app-in-app ecosystems. The purpose here is to present how
popular such ecosystems are, what structures (including iden-           Figure 2: A Typical Structure of App-in-app Ecosystem
tity checks) super-apps use, and how sub-apps are running
atop super-apps.
                                                                         First, the embedded browser instance (e.g., WebView1 for
2.1     Popular Super-app Runtimes                                    Android and WKWebView [12] for iOS) provides an isolated
                                                                      environment for a sub-app. Such an instance often includes a
In this subsection, we perform a survey study to crawl and            customized worker to load and execute pre-defined sub-app
analyze popular app-in-app ecosystems. Our methodology is             code. Second, runtime privileged APIs provide access to vari-
semi-automatic with three steps. First, we randomly crawl             ous resources, such as user data and network access, which
6,000 popular Android apps from two leading Android app               are sometimes unique to the super-app. Third, the web-to-
stores (i.e., Google Play and WanDouJia [10]) and automati-           mobile bridge connects sub-app code with the native Java
cally analyze these apps for the presence of WebViews. Sec-           code and, most importantly, enforces identity checks for the
ond, if WebViews are present, we manually analyze these               sub-app. While details of the bridge vary among different
apps, e.g., search them in online engines, to understand              super-apps, a typical implementation encapsulates all privi-
whether they support any sub-apps. Lastly, we also study              leged API invocations from the web side into a message sent
other markets, e.g., iOS’s App Store, to find the counterpart         to the mobile side via a dispatch method registered through
super-app and the ecosystem.                                          “addJavaScriptInterface”. The mobile side parses the received
   Table 1 shows a list of the top 15 popular super-apps ranked       message, finds the corresponding APIs, checks identities, and
by total downloads according to our survey study. These super-        then invokes them if the check passes.
apps are diversified, which ranges from communication and             2.2    Typical Sub-app Programming Model and Lifecycle
social to finance and business and spans across different coun-
tries, such as WeChat (China), Line (Korea) [4], and Microsoft        This subsection describes the general programming model
Teams (U.S.) [5]. The number of sub-apps in each ecosystem            of sub-apps running atop super-app runtimes as described
also varies from several million to a few hundred. Note that          in Section 2.1. Such sub-apps are usually programmed as
the number value for some super-apps is “unknown” (marked             mini web applications with JavaScript, HTML, and CSS and
as “-”) because we cannot find a reliable source to estimate          have possible access to privileged APIs via the web-to-mobile
the market size, and the super-app disallows broader sub-app          bridge. Sub-apps not only are hosted on a super-app market,
crawling.                                                             but also fetch content from their own or third-party servers.
   We further analyze these super-apps and summarize them                Now we describe a typical lifecycle of a sub-app when be-
into a typical structure of an app-in-app ecosystem in Figure 2.      ing loaded by a super-app. First, an end user will either click
A super-app provides a runtime for sub-apps with three major          on or scan a QR code [2] with a deep link [3] pointing to a sub-
components: (i) an embedded browser instance, (ii) runtime               1 Without loss of generality, we use WebView to refer to such embedded

privileged APIs, and (iii) a web-to-mobile bridge.                    web browsers in the paper.




USENIX Association                                                                               31st USENIX Security Symposium                1599
Table 2: The process of identity checks in the top 15 super-                     Let us summarize all identities and their checking policies
apps. D or A means the whitelist of Domain or AppID and                        found in these super-apps below:
their subscripts sub or super mean who provides them. Sym-                       ● Domain Name. A domain name, as part of web origin,
bol → means the check happens in the Server or Native side.                        represents a server and contents delivered from the server.
 Super-app      Identifier                Check Policy             Location
                                                                                   We find two main types of domain name based identity
 TikTok
                Domain       Endswith(targetURL, {d∣∀d∈Dsub })    Loading          checks: (i) strict whitelist and (ii) vague matching. First,
                AppID        appID∈Asuper                         API access
                             targetURL → (Server,Dsub )           Loading
                                                                                   some super-apps use a strict method to exactly match a
                Domain                                                             whitelist of web domains. Second, some super-apps adopt
                             targetURL → Server                   API access
 WeChat
                AppID        appID → Server                       API access       a vague matching method, e.g., an Endswith to check the
                Capability   Equal(Scaller ,Ssuper )              API access
                             RegMatch(targetURL, {d∣∀d∈Dsub ]})   Loading          suffix of a web domain and a regular expression to match
                Domain
                             RegMatch(callerURL,{d∣∀d∈Dsuper })   API access       domains with certain patterns.
 Alipay
                             appID∈Asuper                         API access
                AppID                                                            ● App ID. A sub-app ID (or called AppID for short) is
                             appID → Server                       API access
                             RegMatch(targetURL,{d∣∀d∈Dsub })     Loading          an identifier assigned by a super-app to the sub-app. The
                Domain
                             RegMatch(callerURL,{d∣∀d∈Dsuper })   API access
 UC Browser                                                                        checking of AppID is usually strict based on a whitelist,
                             appID∈Asuper                         API access
                AppID
                             appID → Server                       API access       and the checking could be performed at either the super-
                Domain       Endswith(targetURL,{d∣∀d∈Dsub })     Loading
 Baidu                                                                             app (native and Java) or the remote server.
                AppID        appID → Server                       API access
                Domain       Endswith(targetURL, {d∣∀d∈Dsub })    Loading        ● Capability. A capability is a secret issued by either a
 JinRiTouTiao
                AppID        appID∈Asuper                         API access
                             Equal(targetURL,{d∣∀d∈Dsub })        Loading          super-app or a server and checked based on exact match.
 Teams          Domain
                             RegMatch(callerURL,{d∣∀d∈Dsuper })   API access       There are two ways of obtaining a capability in existing
 VK             AppID        appID → Server                       API access
                             Equal(targetURL,{d∣∀d∈Dsub })        Loading          super-apps. First, a sub-app obtains a capability on the
 Go-Jek         Domain
                             Equal(callerURL,{d∣∀d∈Dsuper })      API access       mobile side via a hidden runtime API. Second, a sub-
                Domain       targetURL → (Native,Dsub )           Loading
 UnionPay
                Capability   Equal(Scaller ,Ssuper )              API access       app obtains a capability from its cloud after a two-way
                                                                                   authentication.
                                                                                  Then, let us describe details of our survey study results, i.e.,
app of a super-app’s app-in-app ecosystem. Second, the super-                  how these identity checks exist in real-world super-apps, in
app will find the sub-app based on the app ID embedded in the                  Table 2. First, most super-apps adopt more than one identity in
deep link and then download a bundle of web content from                       the check to ensure security. Second, most super-apps adopt
the super-app’s market. Such downloaded content is often                       identity checks at both the content loading and the API access
rendered in a customized worker provided by the WebView.                       to ensure that the loaded contents are correct and the APIs,
Third, the sub-app, e.g., these running in a worker, will further              especially privileged ones, are accessed with a correct identity.
fetch contents from its own or third-party servers and render                  Lastly, identity check policies are very diversified from one
them in a WebView instance. Lastly, the sub-app’s code, in-                    super-app to another, making the checks fragmented and local
cluding those downloaded from the super-app’s market, its                      to a specific super-app.
own server, and third-party server, may access privileged APIs                 2.4   Super-app Runtime API Analysis
via the web-to-mobile bridge.
                                                                               In this subsection, we perform a study on runtime APIs pro-
   Note that there are two locations where an identity check                   vided by super-apps. The challenges are three-fold. First,
can happen. First, when web contents are fetched from sub-                     these APIs are different from one super-app to another. That
app or third-party servers and then rendered in a WebView                      is, we need to analyze each super-app. Second, many APIs are
instance, the super-app will check the identity of fetched                     hidden, i.e., undocumented, and cannot be discovered by read-
contents. Second, when a WebView instance accesses privi-                      ing documents. Lastly, many APIs are not directly invoked
leged APIs provided by the super-app, the super-app will also                  but triggered by a web-to-mobile message via an API pool.
check whether the access is allowed based on the WebView
                                                                                   Our detailed steps in discovering these APIs contain both
instance’s identity.
                                                                               static and dynamic analysis. First, we analyze super-apps
2.3      Existing Identity Checks                                              statically to find direct hidden API invocations via standard
                                                                               WebView interfaces or event handlers (e.g., methods anno-
In this subsection, we perform a survey study on how identity                  tated by “@JavaScriptInterface” or “onConsoleMessage()”).
checks in existing super-apps work. Our methodology is as                      Specifically, we conduct a static control-flow analysis by uti-
follows. We manually review all the 15 super-app’s source                      lizing both “addJavaScriptInterface” and WebView callbacks
code in Table 1 with the help of static analysis tools and                     as entries. Then, we identify all container objects (e.g., maps,
explore the super-app using dynamic analysis. Our purpose                      arrays, and sets) during static analysis as potential API pools.
is to understand an important question on what identity and                        Second, we use dynamic instrumentation to discover in-
corresponding checking policy are used in real-world super-                    direct hidden API calls. Specifically, we hook statically-
apps.                                                                          identified container objects (e.g., via Xposed [13]) and then



1600      31st USENIX Security Symposium                                                                                  USENIX Association
                           Public API          Hidden API                 contents from the web domain may be loaded in a malicious
                                                                          sub-app. That is, one notable reason for such confusion is
         TikTok        91                           129
        WeChat                581                          336
                                                                          that web content (loaded in sub-apps) is highly flexible and
       Snapchat           25                           24                 potentially changes every moment, e.g., web navigation and
      Kuaishou                  54                           23           even sub-app redirection. Thus, it is challenging for the super-
         Alipay     371                          781
            Line  8                           37                          app layer to obtain the correct identities, especially when a
   UC Browser                 363                          203            change happens in the sub-app layer.
          Baidu                    275                          54
  JinRiTouTiao         91                           129                      Oftentimes, an identity confusion needs to be combined
Microsoft Teams                 31                           13           with another vulnerability, e.g., an incorrect domain check
           Grab                    29                           7         or a race condition, for exploitation. Let us take a look at
             VK       45                           79
          Paytm 8                         112                             the aforementioned two examples in the previous paragraph
         Go-Jek                 4                            2            again. When the super-app has an incorrect domain check,
      UnionPay             71                           62
           Total         2047                         1991
                                                                          the adversary can trick a sub-app to load contents from a ma-
               0%     20%         40%         60%        80%       100%   licious domain. Similarly, when there exists a race condition
                                      Percentage
                                                                          in checking domain names, the contents loaded in a malicious
                                                                          sub-app can be recognized as from a permitted web domain.
      Figure 3: API statistics among top 15 super-apps.                   Once identity confusion is exploited, the consequences could
                                                                          be severe because identities are often associated with high
                                                                          privileges, e.g., these APIs accessing user data.
generate test cases to trigger documented public runtime APIs.
                                                                             To summarize, a remote adversary (e.g., malicious web
If these container objects are accessed during a public API
                                                                          content and sub-app provider) with unprivileged identities
call, we will consider them as API pools and read all the
                                                                          can disguise own identities, confuse access control enforced
stored APIs from the pool. Next, if a hidden API is protected
                                                                          in super-apps, and finally call privileged runtime APIs. This
by manually verified identity checks, we will consider it as a
                                                                          can be done by leveraging the privilege assignment and man-
privileged hidden API.
                                                                          agement problem and the asynchronous design between the
   Figure 3 illustrates the results of the top 15 super-apps,
                                                                          sub-app and mobile layers. We define such a vulnerability as
which show that about 50% of APIs are not well-documented.
                                                                          identity confusion.
We also manually sample 200 hidden APIs and check whether
they are privileged. Our analysis results show that at least              3.2    A Motivating Example
80% of them, i.e., 160 APIs, are privileged and should not                In this subsection, we describe a motivating example of a
be used by arbitrary sub-apps. For example, a hidden API—                 super-app WeChat and its sub-app Pingduoduo2 to illustrate
named “rpc"—can be used to access the super-app’s cloud-                  identity confusion vulnerability, which eventually leads to
side interfaces, like manipulating user accounts. For another             privilege escalation attacks, such as arbitrary APK download
example, a hidden API called "getUsageRecord" in TikTok                   and installation on the Android platform.
can be abused by sub-apps to monitor users’ actions on other
                                                                             Let us describe the steps of the end-to-end attack as shown
sub-apps.
                                                                          in Figure 4. The attack has 12 detailed steps that can be
3     Identity Confusion: An Overview                                     grouped into three major phases: (i) loading contents in the
                                                                          customized worker, (ii) loading contents in the WebView
In this section, we give an overview of identity confusion                instance, and (iii) downloading malicious apks.
vulnerability by presenting the definition of identity confusion,
                                                                             First, let us look at the first phase in loading con-
a motivating example, and our threat model.
                                                                          tents into the customized worker. In Step (0a), a vic-
3.1   Definition                                                          tim is tricked into clicking on a malicious deep link
An identity confusion is a type of vulnerability where a per-             such as weixin://encoded(pingduoduo-appID,path,
mission (e.g., the access to a privileged API and the loading             malicious-url). WeChat will recognize the deep link for
of web content) is granted to an identity that is broader than            preparing the runtime for Pingduoduo’s sub-app in Step (0b).
(or different from) the intended target, leading to a confusion.          Starting from Step (1a), WeChat downloads and executes
An identity confusion is often a disobey of the least privi-              Pingduoduo’s sub-app code from its own market. Next, in
lege principle. In an app-in-app ecosystem, identity confusion            Step (1b), Pingduoduo sends the request for loading the URL
arises when multiple definitions of identities co-exist for a             embedded in the malicious deep link. Note that the original
given entity, such as a WebView instance. For example, say                design of this dynamic URL request is for convenient switches
a permission is granted to an AppID. Then, an identity con-               between different online shops maintained by Pingduoduo.
fusion happens when the sub-app with the AppID is tricked                 This request is hooked by WeChat, which will further send
into loading contents from a malicious web domain. For an-                   2 Pingduoduo is a popular online customer-to-manufacturer market man-

other example, if a permission is granted to a web domain,                aging over 8.6 million virtual shops.




USENIX Association                                                                               31st USENIX Security Symposium            1601
                                                                                             Note that there exist two types of identity confusion vul-
   Attacker     WeChat                WeChat                  Sub-app         Sub-app     nerability for the invocation of addDownloadTask(), which
    Server      Server                                        Runtime          Server
                      0a. Click
                                         0b. Initiate runtime
                                                               Worker
                                                                                          are AppID and capability confusions, because the API in-
                                         with appid
                      malicious deeplink
                                                                     1a. Download         vocation requires the checking of both the AppID and the
                      (appid, path, url) 1b. Request for              sub-app
                                         loading url                  from market
                                                                                          capability. The former AppID confusion happens when a ma-
                     1c. Send url to check                                                licious domain is loaded in a sub-app with an authenticated
             Identity Check                                                               AppID. This vulnerability has to be combined with the incor-
                           Flaw 1                                                         rect policy checking, i.e., Flaw 1 between Steps (1c) and (1d).
       1d. Permitted                                             WebView
                       2a. Load                                                           The latter capability confusion happens when a malicious
                       malicious content                                2b. Request for   domain from the correct sub-app can request for a capability
                                                                        capability
                                                                                          from the server, i.e., Flaw 2 between Steps (2a) and (2b), and
                                             2c. Negotiate capability        Flaw 2
                                                                                          the requested capability is accepted by WeChat, i.e., Flaw 3
                                              3a. Invoke privileged     2d. Response
                                              runtime API                (capability)     between Steps (3a) and (3b).
                                    Identity Check
                                                                                          3.3   Threat Model
                                                  Flaw 3
                                              3b. execute()                               In this subsection, we describe the threat model adopted in
                                                                                          the paper. We assume that the super-app and the underlying
Figure 4: Motivating example for a remote attacker to exploit                             mobile Operating System (OS) are benign and with no ma-
WeChat app-in-app ecosystem.                                                              licious mobile apps installed. Specifically, we consider the
                                                                                          following two scenarios:
the URL to its own server for security check in Step (1c).                                 ● Vulnerable Sub-app. A vulnerable sub-app is benign
However, the design and implementation to check the URL                                      code running atop a super-app with an identity confusion
are flawed, which leads to our first identity confusion vulner-                              vulnerability (e.g., an AppID or a capability confusion).
ability.                                                                                     The adversary in this scenario is a malicious web domain,
   Here is a description of the flaw. The security check is                                  which has the capability to send a victim user a malicious,
flawed because the server-side URL parser cannot distinguish                                 phishing deep link pointing to the vulnerable sub-app
the username and the hostname of a common URI. For exam-                                     inside a super-app.
ple, a URL like https://benign.com:x@malicious.com                                         ● Malicious Sub-app. A malicious sub-app is code with
will be considered benign.com. Therefore, in Step (1d), the                                  malicious intent and being crafted by an adversary. The
WeChat server grants permission for loading this URL.                                        adversary in this scenario is a malicious sub-app devel-
   Second, let us look at the second phase in loading contents                               oper, which has the capability to upload malicious content
into a WebView instance. Because the WeChat obtains a green                                  to the market of the super-app and trigger an identity con-
light for loading the malicious URL, in Step (2a), WebChat                                   fusion vulnerability (e.g., a domain name confusion) of
loads the contents from malicious.com to Pingduoduo’s                                        the super-app.
runtime. At this moment, the loaded malicious contents still                                 Note that the former scenario—a vulnerable sub-app case—
have no high privileges, because they are isolated in a We-                               is considered as a stronger threat model compared with the
bView instance. Although the AppID of Pingduoduo has a                                    latter. The reasons are two-fold. First, although both threat
high privilege, the access to high privileged APIs still needs a                          models need that a victim user clicks on a malicious deep
capability, i.e., a secret token.                                                         link, the link itself is pointing to a recognized, benign sub-
   Here comes our second flaw in the ecosystem. The ca-                                   app in the former scenario, but an unrecognized, potentially-
pability is obtained from a Web service API provided by                                   malicious sub-app in the latter. Second, the threat model of
Pingduoduo, which does not have any access control. That is,                              the malicious sub-app requires that the adversary uploads
any client can call this API to obtain a capability for a higher                          the malicious code (potentially obfuscated) to the super-app
privilege at WeChat. Specifically, in Step (2b), the malicious                            market, which boosts the chance of being detected.
contents loaded in the WebView instance can request for a
capability from Pingduoduo, which will negotiate with the                                 4     Identity Confusion: A Taxonomy Study
WeChat server in Step (2c) and then deliver the capability to                             In this section, we perform a taxonomy study to break down
the WebView in Step (2d).                                                                 existing identity confusions into three major types: domain
   Third, let us describe the third phase, i.e., downloading                              name, AppID and capability-based.
and installing a malicious APK. In Step (3a), the malicious
contents invoke a privileged API with the obtained capability.                            4.1   Domain Name Confusion
Particularly, we use addDownloadTask(), a hidden, undocu-                                 A domain name confusion is that the web domain that invokes
mented API, as an example in Step (3b), which can download                                a privileged API from WebView is different from the domain
and install any APKs on the Android platform.                                             that a super-app obtains and checks for identity. Specifically,



1602     31st USENIX Security Symposium                                                                                            USENIX Association
we classify domain name confusions into two types: timing-                              WebView                                      Super-app
based (due to race condition) and frame-based (due to the          Thread_Render                 Thread_Browser         Thread_Get       Thread_Check
existence of multiple domains). Table 3 shows the high-level                                            Trigger
                                                                                    Load privileged.com onPageStarted()     url=privileged.com
results of whether event handlers of different Android classes                                                                     get
                                                                                                           download




                                                                   malicious.com
are vulnerable to these two types of timing and frame-based                                          LOAD content              GET domain
                                                                                     Invoke                                        identity
race conditions. If super-apps use any of these tested Web-                          runtime API
View APIs and callbacks to implement domain-based identity                                                  time window for        Return Result CHECK
checks are all vulnerable. We now describe the details.                                                     domain confusion
                                                                                                                                                   Check url
                                                                                       Finish Load
                                                                                                                                                   and
4.1.1   Type 1: Timing-based Confusion                                                                                                             execute()




                                                                   privileged.com
                                                                                     Display
The first type—called timing-based—is because of a race                              New Page
condition between different threads of WebView and super-
app from a high level. That is, as a simplification of the race
condition, when a WebView thread invokes a privileged API
and passes the control to a super-app thread, the identity is     Figure 5: [Domain Name Confusion: Type 1] An illustration
from say malicious.com; but when another super-app thread         of timing-based confusion using onPageStarted API due
checks the identity, the identity changes to say privileged.      to race conditions between WebView’s Rendering (called
com due to redirection, leading to confusion.                     Render) and Loading (called Browser) Threads.
   We now describe the details. Before that, we need to explain
different threads that reside in WebView instances and super-
apps.                                                             identity. Lastly, the same JavaScript from malicious.com
  ● WebView Threads. A WebView instance usually has               invokes a privileged API call, but the identity has already
    two types of threads, one used for rendering web contents     become privileged.com.
    (called a render thread) and the other used for loading web      Next, Figure 6 shows another variation. First, a thread of
    contents (called a browser thread).                           the super-app calls loadUrl(), which instructs the browser
  ● Super-app Threads. A super-app may have three types           thread to load an URL (privileged.com) and returns the
    of threads: (i) a thread that obtains the WebView’s do-       new domain name as the identity. Second, the JavaScript code
    main name as an identity, (ii) a thread that checks the       from the old URL (malicious.com) invokes a privileged
    obtained identity and decides whether to allow the exe-       API, which is checked by a thread of the super-app but consid-
    cution, and (iii) a thread that dispatches privileged API     ered as from privileged.com. This leads to domain name
    calls in an asynchronous queue. Note that the existence       confusion.
    of these three types of threads depends on the design and        It is worth noting that many WebView APIs and callbacks
    implementation of super-apps.                                 are either interacting with or triggered by the browser thread
   Next, we illustrate two case studies.                          instead of the render thread. That is, the race condition is very
Case 1: Race between WebView’s rendering and loading              common among many WebView APIs. To understand how
threads. This race condition is because WebView’s render-         prevalent such race conditions are, we collect all the Web-
ing and loading threads may be dealing with content from          View APIs from Android’s documentation, and then perform
different web domains. Specifically, on the WebView end,          a small-scale study on WebView APIs that return URLs and
when the loading thread starts to load contents from a new        WebView callbacks that have URLs as a parameter. Specifi-
URL after redirection, the rendering thread may still execute     cally, we first either register a callback and then redirect the
contents from the old URL. Then, on the super-app end, there      webpage to another URL. Then, we measure whether there
are two threads, one that obtains a new web domain after redi-    exists inconsistency between the callback and the webpage’s
rection from the loading thread of WebView as an identity,        URL from two perspectives: (1) whether the old webpage can
and the other that checks the new domain name but allows a        still execute JavaScript code but the URL has been updated
privileged API call from the old domain.                          to the new one and (2) whether the new webpage can execute
   There are two variations of this race condition depending      JavaScript code but the URL is still the old one.
on the initiation of the URL loading. Figure 5 shows one             Here are the detailed steps in measuring the aforementioned
variation. First, the JavaScript from malicious.com running       two points. We create a webpage that has an endless loop for
in WebView’s rendering thread starts to redirect the webpage      printing its URL together with the timestamp (i.e., T js ), and let
to privileged.com. Second, the redirection is sent to the         the WebView’s callbacks print its own URL (i.e., URLcb ) with
loading thread, which starts to load privileged.com and           the timestamp (i.e., Tcb ). Then, for (1), we measure whether
triggers the callback (e.g., onPageStarted()) registered by       max(T js ) is larger than Tcb and URLcb is the new webpage’s;
the super-app. Third, the corresponding super-app thread trig-    for (2), we measure whether min(T js ) is smaller than Tcb and
gered by the callback obtains the new domain name as the          URLcb is the old webpage’s.



USENIX Association                                                                                   31st USENIX Security Symposium                      1603
Table 3: The domain name confusion in using WebView’s event handlers to obtain identity information. We measure them at
time and frame dimensions.

                                                                                                                                                                 Domain Name Confusion
                  Class Name                                            Method Signature of Event Handlers
                                                                                                                                                               Timing-based  Frame-based
                                                                                             Getter Method:
                                     getOriginalUrl ()                                                                                                              ✔                      ✔
          WebView
                                     getUrl ()                                                                                                                      ✔                      ✔
                                                                                       Callback Method:
                                     doUpdateVisitedHistory (WebView view, String url, boolean isReload)                                                            ✔                      ✔
                                     onLoadResource (WebView view, String url)                                                                                      ✔
                                     onPageCommitVisible (WebView view, String url)                                                                                 ✔                      ✔
                                     onPageFinished (WebView view, String url)                                                                                      ✔                      ✔
                                     onPageStarted (WebView view, String url, Bitmap favicon)                                                                       ✔                      ✔
          WebViewClient              onReceivedClientCertRequest (WebView view, ClientCertRequest request)                                                          ✔                      ✔
                                     onReceivedError (WebView view, WebResourceRequest request, WebResourceError error)                                             ✔
                                     onReceivedHttpAuthRequest (WebView view, HttpAuthHandler handler, String host, String realm)                                   ✔
                                     onReceivedHttpError (WebView view, WebResourceRequest request, WebResourceResponse errorResponse)                              ✔
                                     shouldInterceptRequest (WebView view, WebResourceRequest request)                                                              ✔
                                     shouldOverrideUrlLoading (WebView view, WebResourceRequest request)                                                            ✔
          WebChromeClient            onReceivedTouchIconUrl (WebView view, String url, boolean precomposed)                                                         ✔                      ✔



                      WebView                                     Super-app                                   WebView                                    Super-app
 Thread_Render                   Thread_Browser          Thread_Get           Thread_Check               Thread_WebView                        Thread_Dispatch      Thread_Check
                   Invoke                           loadUrl()




                                                                                                              malicious.com
                   runtime API                                  url=privileged.com                                               Invoke runtime API
                                                                 get domain
 malicious.com




                                                                                                                                   time window for
                                                             GET identity
                         download      time window for
                                  LOAD domain confusion                                                                            domain confusion DISPATCH
                         content                                                                                                                               dispatch()     url=privileged.com
                                                                 Return Result CHECK                                            Display                                          get domain
                                                                                                                                New Page                                    GET identity
                                                                                                              privileged.com


                     Finish Load                                                     Check url
                                                                                     and
                                                                                     execute()                                                                          CHECK
 privileged.com




                   Display
                   New Page                                                                                                                                                        Check url
                                                                                                                                                                                   and
                                                                                                                                                                                   execute()


                                                                                                       Figure 7: [Domain Name Confusion: Type 1] An illustration
Figure 6: [Domain Name Confusion: Type 1] An illustration                                              of timing-based confusion due to race conditions between
of timing-based confusion using loadUrl() API due to race                                              super-app’s dispatching (called Dispatch) and domain check-
conditions between WebView’s Rendering (called Render)                                                 ing (called Check) Threads.
and Loading (called Browser) Threads. Although GET and
CHECK threads are separate in the figure, they can reside in                                           queue and executes it with identity checks, the obtained iden-
the same one.                                                                                          tity is privileged.com instead of malicious.com.
                                                                                                          Note that when the super-app finishes the execution of the
                                                                                                       invoked API, the old webpage (i.e., malicious.com) can-
Case 2: Race between super-app’s dispatch and check-                                                   not obtain the return value because the webpage is now
ing threads. This race condition is summarized as follows.                                             privileged.com. Nevertheless, the attack still succeeds as
When super-app’s dispatch thread receives a privileged API                                             the privileged API finishes its execution. For example, the
call, it does not check the identity but instead dispatches to an                                      addDownloadTask API can still download a malicious APK
asynchronous queue. Then, when the checking thread fetches                                             and the mute API can silence the mobile phone.
the API call from the queue and checks the identity, the iden-
tity obtained from the WebView is out of date.                                                         4.1.2                   Type 2: Frame-based Confusion
   Figure 7 illustrates such a race condition. First, the                                              The second type—called frame-based—is that an iframe acts
JavaScript from malicious.com in the WebView render                                                    on behalf of the top frame’s identity. The reason is that many
thread calls a privileged runtime API. Next, the WebView                                               WebView’s APIs and callback functions only return the top
thread passes the call to a super-app thread. Then, the super-                                         frame’s URL when multiple sub-frames are embedded as
app thread dispatches the API call to a queue without check-                                           part of a top frame. Then, no matter what identity checks
ing its identity. Next, the JavaScript in the WebView’s render                                         a super-app adopts and how it performs such checks, the
thread redirects the webpage to privileged.com. Lastly,                                                super-app can only obtain the top frame’s identity if such
when another super-app thread fetches the API call from the                                            APIs and callbacks are used. That is, an advertisement from



1604                31st USENIX Security Symposium                                                                                                                    USENIX Association
malicious.com embedded as an iframe of privileged.com             ● JavaScript protocol. This parsing error is that the super-
can act on behalf of the latter.                                    app does not recognize JavaScript as a protocol. Thus,
   We also perform a similar study as we do for timing-based        an attacker can use the URL javascript://payloads
confusions to understand the spread of frame-based confu-           to exploit the URL parsing, resulting in code injection
sions among WebView APIs and callbacks. Specifically, we            attacks and the loading of arbitrary domains.
create a webpage with an iframe from a different web do-         Type 3: Missing URL checks. This flaw is that super-apps
main and run these APIs and callbacks to determine whether       do not check web domains when a sub-app loads a third-party
they will return multiple domains. Table 3 shows the results:    URL into either an iframe or a top frame. Therefore, an adver-
eight out of 14 APIs and callbacks are vulnerable to frame-      sary can either embed a malicious URL as an advertisement
based confusions. This list includes commonly-used ones like     or trick the top frame into visiting a malicious URL and then
onPageStarted, onPageFinished, and getUrl.                       accesses privileged APIs, such as reading user contacts.
4.2   App ID Confusion                                           4.3     Capability Confusion
An AppID confusion is that a malicious domain with a privi-      A capability confusion is that the privileged capability used
leged AppID invokes a privileged runtime API, thus confusing     for protecting runtime APIs is leaked to a malicious entity.
the super-app’s identity checks. We call it AppID confusion      Specifically, we find two cases of capability confusion: un-
because the malicious domain has the correct AppID, but the      protected client-side and server-side APIs.
domain itself is malicious. The key step for AppID confusion
                                                                 Type 1: Unprotected client-side API. This flaw is that
is to load a malicious domain within a privileged sub-app.
                                                                 super-apps use a hidden, unprotected API to transfer capabili-
In practice, we find three cases of such AppID confusions in
                                                                 ties. The super-app assumes that the API is undocumented and
loading malicious URLs into privileged sub-apps.
                                                                 will not be used by an adversary, but the API can be reverse-
Type 1: Flawed URL whitelist matching. This flaw is that         engineered from privileged sub-apps and used by an adversary.
the URL whitelist used for loading is flawed, thus being able    It is worth noting that hidden APIs are a widespread problem
to allow potential malicious URLs to load. The deep reason is    in super-apps, which takes up to about half of all the runtime
the lack of coordination and proper documents between super-     APIs (details are in Figure 3 of §5).
app and sub-apps. Specifically, the URL whitelist checking       Type 2: Unprotected server-side API. This flaw is that a
algorithm is provided by the super-app, but the whitelist is     privileged sub-app server exposes unprotected APIs to sign
provided by the sub-app. Therefore, a misunderstanding of the    an invocation request that can be accepted by a super-app.
check algorithm often leads to flaws and we list two scenarios   Specifically, here is how the attack works. malicious.com
here.                                                            first sends a request to the sub-app’s back-end servers to
 ● endswith being misunderstood as strict matching. In           sign the invocation request and then forwards the request to
   this scenario, the super-app provides endswith as the         super-apps. Because the request is signed by a privileged sub-
   matching algorithm, but the sub-app developer thinks it       app server, the super-app will allow the API invocation. Our
   is a strict matching. Therefore, when the sub-app uses        motivating example in Figure 4 has such a flaw.
   benign.com in the whitelist, an adversary can bypass the      5     Measurement: Prevalence & Consequence
   check using a domain like maliciousbenign.com.
                                                                 In this section, we describe our measurement methodology
 ● Regular expression (regex) being misunderstood as strict
                                                                 and results in analyzing the prevalence and consequence of
   matching. In this scenario, the super-app uses regex
                                                                 identity confusion vulnerabilities of existing super-apps. We
   in the matching, but the sub-app developer still thinks it
                                                                 also give a few case studies at the end.
   is a strict matching. Therefore, when the sub-app uses
   benign.a.com, the dot matches an arbitrary character.         5.1     Methodology
   That is, an adversary can bypass the check using a domain     In this subsection, we describe our overall measurement
   like benignXa.com.                                            methodology, which has three semi-automatic steps with man-
Type 2: Flawed URL parsing. This flaw is that super-apps         ual efforts.
have logic errors in parsing URLs and extracting web domains.    5.1.1    Step I: Super-app Discovery
We listed two types of parsing errors.
                                                                 In this step, we use a semi-automatic method to discover
 ● Username and password fields. This parsing error is           more super-apps beyond these that we find in §2. The high-
   that the super-app does not recognize username and pass-      level insight is that super-apps often define many templates
   word fields or a URL. Take https://benign.com:x@              (e.g., “miniapp0” and “miniapp1” for process names, and
   malicious.com as an example. A logic error is to extract      “AbsMakePhoneCallApiHandler” and “AbsChooseAddress-
   benign.com as the domain name instead of malicious.           ApiHandler” for class names) in running different sub-apps,
   com.                                                          which can be used to find app-in-app ecosystem.



USENIX Association                                                                  31st USENIX Security Symposium       1605
   Specifically, there are three sub-steps. First, we use static     1        // JavaScript
analysis by utilizing Soot [9], to identify apps with Web-           2        window . setInterval ( function () {
                                                                     3        res = nativeInterface . framelessPostMessage ( ’
Views and JavaScript bridges, e.g., detecting whether they re-
                                                                             {" id ":1 ," func ":" authentication . getAuthToken " ,"
implement addJavaScriptInterface. Second, we conduct                         args ":[[" privileged . com "]]} ’);
a class name similarity analysis to find super-app runtimes.         4        // res can be leaked to malicious server
Specifically, we collect the class name of the activity which        5        ... ...
                                                                     6        } ,1500) ;
contains WebView instances and keep those apps containing            7        window . location . href = " https :// privileged .
at least five similar (i.e., sharing keywords) class or process              com /";
names as potential super-apps. Then, we use the keyword-
based package name matching to filter ads-related WebView
instances, which may have bridge implementation but are not          Figure 8: Example for verifying domain name confusion. The
sub-apps runtime. Third, we manually verify whether they             getAuthToken is a privileged API of Microsoft Teams. This
are truly super-apps with app-in-app ecosystem.                      figure exhibits a race condition: although the webpage is set
                                                                     to navigate to https://privileged.com, and so does the
5.1.2   Step II: Vulnerability Analysis
                                                                     domain name, the code is still executed under the old context
In this step, we analyze each super-app for different identity       before the new page is loaded. The return value is accessed
confusion vulnerabilities. The high-level idea is that we man-       by the old page controlled by the adversary during the small
ually write test cases and exploits by the identity confusion        interval.
taxonomy and check the existence of each vulnerability. Al-
though our analysis is performed on Android, we use the Proof        URL scheme), making WebView execute its error-handling
of Vulnerability (PoV) for Android versions of super-apps to         code, thus enlarging the time window of race condition for
verify whether their iOS versions are also vulnerable.               onPageStarted.
Domain name confusion analysis. The analysis has two                 AppID confusion analysis. This analysis checks whether
major steps: (i) determination of whether a vulnerable API           an adversary can ask a super app to load any malicious do-
or callback in Table 3 is used, and (ii) manually generating         main in a sub-app. Specifically, we create a sub-app and set a
exploits triggering the vulnerability. Let us start with the first   whitelist for benign domains. Then, we generate a variety of
step. There are two types of WebViews: Android WebView               URLs by mutating several initial seeds. Next, we randomly
or iOS counterpart, and customized WebView (e.g., UCWeb-             select URLs that cannot match the whitelist to test the sub-
View). If it is an unchanged WebView, we can directly look           app. During the test, we hijack the network traffics and return
up Table 3; otherwise, if it is a customized WebView, we             the same webpage we crafted for invoking privileged run-
will perform an analysis (as we did in §4.1.1) to determine          time APIs, when requesting these URLs. Thus, if any of these
the vulnerable implementation on API or callback for this            URLs is successfully loaded and the JavaScript executed, an
WebView.                                                             AppID confusion is confirmed.
   Second, we create a malicious webpage that invokes priv-
ileged runtime APIs with an endless loop, and let the web-           Capability confusion analysis. This analysis checks
page trigger the event handlers, e.g., jumping to a privileged       whether the API of transferring secret is exposed. Specifi-
domain. Next, if any of the privileged API executes success-         cally, we first collect ten sub-apps for each super-app. Then,
fully, it indicates that the super-app is vulnerable to domain       we check how they invoke privileged APIs: (1) we first con-
name confusion. Let us use onPageStarted as an exam-                 duct a backward control-flow analysis and extract the adjacent
ple to explain more clearly. Figure 8 illustrates the web-           API calls before the invocation of privileged APIs; (2) we
page we crafted for testing Microsoft Teams—This JavaScript          cluster the extracted API calls; and (3) if there exists an API
starts a repeated asynchronous loop to invoke the privileged         which always is invoked before privileged APIs, it may be a
runtime API “getAuthToken” with “window.setInterval()”,              secret API. Then, we further check it with manual verification.
and then uses “window.location.href” to jump to https:               5.1.3     Step III: Consequence Analysis
//privileged.com for triggering WebView’s event handler
onPageStarted. Because there exists a race condition, the            In this step, we analyze the security consequence for each
return result from the privileged API is accessed by the old         vulnerable super-app. In practice, we find three kinds of such
page controlled by the adversary.                                    consequences of identity confusion vulnerabilities. We now
   Note that we need to generate different exploit codes for         explain our analysis methodology (mostly manual) below:
onPageStarted in WebViews with a >72 Chromium kernel.                    ● Privilege Escalation. We manually inspect whether an
The reason is that the time window for domain name confu-                  adversary can access privileged APIs after successfully
sion in Figure 5 becomes very small and the race condition is              confusing the super-app and disguising itself as a privi-
difficult to trigger. Specifically, we ask the webpage to load             leged identity. We consider the consequence that exists if
an error URL (i.e., either a very long URL or an unregistered              the adversary can access at least one of such APIs.



1606    31st USENIX Security Symposium                                                                          USENIX Association
Table 4: # of remaining apps in locating super-apps after                            Table 6: The customized WebViews affected by [Domain
applying each filter.                                                                Name Confusion: Type 1], including the iOS’s WebView. We
              Filtering Methods                                 # Super-apps
                                                                                     collect the iOS version of these 47 super-apps.
                                                                                      Platform        WebView         Domain Name Confusion    Affected Apps
              Filter 1: Containing WebView                          5,436                           UCWebView                  ✔                     10
              Filter 2: Redefining addJavaScriptInterface           3,463                           Tencent TBS                ✔                      4
                                                                                       Android
              Filter 3: Class name clustering                        291                              Baidu T5                 ✔                      6
              Filter 4: Manual analysis                               47                           ToutiaoWebview              ✔                      4
                                                                                                     KsWebView                 ✔                      2
                                                                                                        others                 ✔                      2
                                                                                         iOS        WKWebView                  ✔                     47
Table 5: Breakdown of Identity Confusion Vulnerabilities of
47 Super-apps
                                                                                     Table 7: The system WebViews of stock Android with the
 Identity Confusion                       # Super-apps          Examples
                                                                                     latest security patches. ∗ means attackers should use an error
 Domain




                Type 1: Timing-based          15              WeChat, Alipay
                Type 2: Frame-based           15          Microsoft Teams, Go-Jek    URL to exploit the identity checks implemented on WebView
                Total                         15
                                                                                     API onPageStarted.
                                                                                       Android      Patch Level         WebView’s       Domain Name
                Type 1: Flawed matching       26               TikTok, Baidu
 AppID




                                                                                                                     Chromium Version     Confusion
                Type 2: Flawed parsing         2              WeChat, Go-Jek
                                                                                                                  < Version 72
                Type 3: Missing checks        10         Microsoft Teams, UnionPay
                                                                                       Android 6    2017-10-01               52               ✔
                Total                         38                                       Android 7    2019-03-01               51               ✔
                                                                                       Android 8    2019-06-05               61               ✔
 Capability




                Type 1: Client-side            1                 UnionPay
                                                                                       Android 9    2019-08-01               66               ✔
                Type 2: Server-side            1                  WeChat
                                                                                                                  > Version 72
                Total                          2                                      Android 10    2019-09-05               74               ✔⋆
                                                                                      Android 11    2021-07-05               83               ✔⋆
 No identity checks                            9            Snapchat, Kuaishou
 Total                                        47
                                                                                     Table 8: Breakdown of Identity Confusion Consequences of
                                                                                     47 Super-apps
 ● Phishing. We manually inspect whether a sub-app can                                       Consequences         # Super-apps          Examples
   load web contents from a malicious domain, with phishing                             Privilege Escalation           38              Go-Jek, Grab
   contents.                                                                            Phishing                       31             TikTok, WeChat
 ● Privacy Leaks. We manually inspect whether an adversary                              Privacy Leaks                  35         Alipay, Microsoft Teams
   (e.g., a malicious domain) can access sensitive user data,
   e.g., via some privileged APIs like getContacts.                                  Second, we evaluate WebViews with Chromium as its kernel
5.2             Measurement Results                                                  in the stock Android from version 6 to the latest 11. The
                                                                                     results in Table 7 show that they are all vulnerable.
In this part, we describe our measurement results. The first
step gives us 47 super-apps: The number of remaining apps af-                        5.2.2     Vulnerability Consequence
ter applying each filter is shown in Table 4. Next, we describe                      Table 8 illustrates the overall results of our consequence anal-
the results from Steps II and III.                                                   ysis. It shows that such confusion vulnerabilities can lead
5.2.1             Vulnerability Prevalence                                           to phishing, privacy leaks, and privilege escalation. Here are
                                                                                     breakdowns: (i) 38 super-apps are vulnerable to privilege
Table 5 illustrates the overall results of our vulnerability analy-
                                                                                     escalation; (ii) 31 phishing; and (iii) 35 privacy leaks. This
sis. It shows that they (both the Android and iOS versions) are
                                                                                     demonstrates the severity of identity confusion.
all vulnerable to at least one type of identity confusion attack
                                                                                        Interestingly, during our manual inspection, we also find
despite the diversity in identity checks used in these super-
                                                                                     some security consequences that are independent of identity
apps. Here are the breakdowns. Nine super-apps adopt no
                                                                                     confusion. We list three types below:
identity checks at all, thus being all vulnerable; all 38 super-
apps with AppID checks are vulnerable; all 15 super-apps                              ● Permission re-delegation. When a benign domain applies
with domain name checks are vulnerable; two super-apps with                             for permission and the user grants it, the super-app will
capability checks, all are vulnerable. Note that the overlaps                           give this permission to the sub-app, but not the domain.
are because one super-app may adopt more than one identity                              Then, any other domain, e.g., malicious.com, in this sub-
check.                                                                                  app can use this permission. We find and confirm that 21
   Additionally, there are two things worth noting for domain                           super-apps have this vulnerability.
confusion vulnerabilities. First, we evaluate the security of                         ● Data leakage. It is the disclosure of sensitive information
customized WebViews used by some super-apps and show the                                to an adversary, such as token and account information.
results in Table 6. To summarize, despite the customization,                            The reason is that a sub-app does not check the destination
they have the same vulnerabilities as Android’s WebView.                                webpage when sending sensitive data. For example, an



USENIX Association                                                                                          31st USENIX Security Symposium             1607
Table 9: The overall result of our flaws detection tool tested on the total 47 super-apps. Symbol "∅" means the host app does not
have this type of security enforcement. ✔ means it is vulnerable to our attack.
                                   Domain Name Confusion                                                            Security Consequences
      #ID       Super-app                                  AppID Confusion   Capability Confusion
                                  Time-based Frame-based                                            Privilege Escalation Phishing Attack Privacy Leaks
      01           TikTok             ✔           ✔              ✔                    ∅                      ✔                  ✔              ✔
      02           WeChat             ✔           ✔              ✔                    ✔                      ✔                  ✔              ✔
      03          Snapchat            ∅           ∅              ∅                    ∅                      ✔                                 ✔
      04          Kuaishou            ∅           ∅              ∅                    ∅
      05            Alipay            ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      06             Line             ∅           ∅              ∅                    ∅                     ✔                                 ✔
      07         UC Browser           ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      08            Baidu             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      09        JinRiTouTiao          ∅           ∅              ✔                    ∅                                       ✔
      10      Microsoft Teams         ✔           ✔              ✔                    ∅                     ✔                                 ✔
      11             Grab             ∅           ∅              ∅                    ∅                     ✔                                 ✔
      12             VK               ∅           ∅              ✔                    ∅                     ✔                                 ✔
      13            Paytm             ∅           ∅              ✔                    ∅                     ✔                                 ✔
      14           Go-Jek             ✔           ✔              ∅                    ∅                     ✔                 ✔               ✔
      15          UnionPay            ✔           ✔              ✔                    ✔                     ✔                                 ✔
      16            Kugou             ∅           ∅              ∅                    ∅
      17             QQ               ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      18          JingDong            ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      19          DingTalk            ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      20       Quark Browser          ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      21            Youku             ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      22           Cainiao            ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      23           Taobao             ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      24           Koubei             ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      25            Gaode             ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔
      26            iQIYI             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      27            Tieba             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      28         Baidu Map            ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      29        XiaoHongShu           ∅           ∅              ✔                    ∅                     ✔                                 ✔
      30        KanDuoDuo             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      31        Baidu Netdisk         ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      32           Haokan             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      33           Meituan            ∅           ∅              ✔                    ∅                     ✔
      34    NetEase Cloud Music       ∅           ∅              ∅                    ∅
      35            Feishu            ∅           ∅              ✔                    ∅                                       ✔
      36            Yippi             ∅           ∅              ∅                    ∅                     ✔
      37          Dianping            ∅           ∅              ✔                    ∅                     ✔
      38       Kuaishou-Mini          ∅           ∅              ∅                    ∅
      39     JinRiTouTiao-Mini        ∅           ∅              ✔                    ∅                                       ✔
      40         Tiktok-Mini          ∅           ∅              ✔                    ∅                                       ✔
      41       Suning Finance         ∅           ∅              ∅                    ∅
      42          QQ-Mini             ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      43         BaiduBaiKe           ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      44       Baidu Browser          ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      45        BaiduHanYu            ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      46         Baidu-Mini           ∅           ∅              ✔                    ∅                     ✔                 ✔               ✔
      47             YiLu             ✔           ✔              ✔                    ∅                     ✔                 ✔               ✔


      adversary can craft a deep link with the victim app ID and               the vulnerability types and security consequences. Nine super-
      a malicious URL, and then the sub-app will leak sensitive                apps adopt no identity checks, thus all being vulnerable to our
      user data to the malicious URL controlled by the adversary.              attack. Several super-apps have privileged hidden APIs (e.g.,
      We randomly collected 200 popular sub-apps and found                     “fetchAuthToken” in Snapchat) without any identity checks,
      that 21.5% of them are vulnerable to this attack.                        thus being vulnerable to privilege escalation or privacy leaks.
 ● Data over-collection. Data over-collection is when a                        Kuaishou, Kugou, NetEase Cloud Music, and Suning Finance
   super-app collects more data than it needs from a sub-                      have little API support and none of them is privileged ac-
   app, leading to a privacy concern. Specifically, we find                    cording to our manual analysis. JinRitouTiao has an AppID
   that WeChat hooks all the requests coming from sub-apps,                    confusion, but it redirects the hidden API invocation to an-
   which include sub-app sensitive data, and sends them to                     other sandbox WebView restricting the actual API calls. Thus,
   WeChat’s server.                                                            we failed to launch privilege escalation or exploit privacy
                                                                               leaks.
5.3     Results and Case Studies                                                  Now, we illustrate two specific interesting examples.
In this subsection, we present the overall results and perform                  Example 1 [Alipay]: Manipulating Super-apps’ Backend
case studies of some identity confusion vulnerabilities. Ta-                    Servers. The first example is the domain name and AppID
ble 9 shows the statistics of collected 47 super-apps, including                confusions of Alipay, the most popular payment app in China



1608        31st USENIX Security Symposium                                                                                        USENIX Association
Table 10: The trigger conditions of WebView’s error codes.                “window.location.href = htttp://maliciousbenign.com”. Since
                                                                          “htttp” is not a supported scheme, this URL will trigger the
         WebViewErrorCode                  Trigger Condition              race condition of onPageStarted.
 ERR_CLEARTEXT_NOT_PERMITTED       Set usesCleartextTraffic as false
      ERR_NAME_NOT_RESOLVED        Use a wrong sub-domain name            6   Lessons learned, Mitigation and Discussion
       ERR_CONNECTION_CLOSED       Use long URL, e.g., > 4,000 chars
    ERR_UNKNOWN_URL_SCHEME         Use unregistered scheme, e.g., Htttp   The most important lesson learned from our research is that
                                                                          the identity checks of sub-apps (e.g., for allowing sensitive
                                                                          API invocations) should follow the least privilege principle.
with about 690 million downloads. An adversary can further                That is, the definition of identity in the app-in-app ecosystem
manipulate Alipay’s backend servers by exploiting them.                   needs to be atomic, providing clear coordination between
   Let us start with identity confusion vulnerabilities. First,           developers of super-apps, sub-apps, and WebView.
Alipay is vulnerable to domain name confusion due to race                    From our point of view, the atomic definition free of identity
conditions of a customized WebView called UCWebView.                      confusions is a combination of all three identities used in
Second, sub-apps of Alipay have AppID confusion due to a                  the wild, i.e., domain name, sub-app ID, and capability. The
flaw in Alipay’s URL whitelist matching. Particularly, Alipay             former two provide a definition of an atomic unit in an Access
uses regular expression on string matching, but many sub-apps             Control List (ACL), and the latter provides a capability in
think it is a strict matching and add domain names directly to            invoking specific privileged APIs. Specifically, when a sub-
their whitelist.                                                          app tries to invoke a privileged API of a super-app, the sub-
   Next, we describe the security consequences of Alipay’s                app will provide a secret signed by the private key from the
identity confusion. Alipay only checks AppID for any priv-                sub-app’s server like a digital signature. Next, the super-app
ileged API calls and therefore an adversary can access any                obtains the secret using the public key and then verifies the
privileged API after successful identity confusion exploita-              secret, the domain name, and the sub-app ID before allowing
tion. Specifically, Alipay has about 781 undocumented but                 the invocation.
accessible APIs as shown in Figure 3. One of them, namely                    Other than the atomic identity definition, the mitigation of
“rpc()”, is privileged and can access Alipay’s backend cloud              identity confusions will also benefit from a domain synchro-
sever. Note that this API is designed to be only used by Alipay           nization between the mobile and web layers of WebView. The
itself, but in fact, it can be accessed by any sub-app.                   mobile code should be empowered to transparently obtain
   Now take a sub-app, 1688, an online wholesale market man-              the correct, synchronized, up-to-date domain of any frame in
aging over 920,000 virtual shops, for example, to illustrate              WebView. Draco [42] provides a good example of such a do-
the attack and consequence. An attacker can first craft a phish-          main synchronization. Specifically, Draco modifies the native
ing deep link, e.g., alipays://platformapi/startapp?                      code of WebView and supports JavaScript to send the domain
appId=[1688]&url=malicious.com.... Then, when a mo-                       information from the render thread. We believe that such a
bile user clicks the link, the 1688 sub-app will start and exe-           practice should be integrated into the mainstream design of
cute the malicious JavaScript from malicious.com, which                   WebView.
invokes the API “rpc()” to access Alipay’s cloud servers, e.g.,              Last but not least, sub-app developers should also pay more
managing user’s financial and account data.                               attention to its security, especially on sensitive but exposed
Example 2 [TikTok]: Bypassing Security Patches with an                    interfaces like the launching webpage. They should also care-
Error URL. This second example is the AppID and domain                    fully read the documents of super-apps to understand the
name confusions of TikTok, a popular social app with about 18             security checks, e.g., URL whitelisting.
billion downloads. The app ID confusion is from the matching              Ethics. We discuss ethical issues of our study, including
of URLs using endswith as we discussed in §4.2. Then, the                 vulnerability disclosure and experimental setups. First, we
domain name confusion is from the check implemented on                    have informed all the 47 super-apps of their vulnerabilities.
customized WebView being vulnerable to the race condition                 Currently, 29 super-apps have confirmed their vulnerabilities,
of onPageStarted. We reported the vulnerability to TikTok,                and 19 have already fixed them. Take Alipay, for an example.
which then deployed a patch to update its chromium kernel                 We had regular monthly meetings with their developers for
to the latest. However, the patch is still vulnerable because             half a year. In the end, Alipay not only fixed the vulnerabil-
we can utilize an error URL, delay the webpage rendering,                 ity but also rewarded us $2,500 as part of their bug bounty
and enlarge the time window for the race condition. Note that             program. Second, all the attacks are tested on our own de-
we further analyzed all WebView’s error codes, and found                  vices with our test accounts, which does not harm sub-apps,
four of them can be easily triggered by attackers as shown in             super-apps, or any of their servers.
Table 10.
   Here are the detailed steps to exploit TikTok’s domain name            7   Related Work
confusion. First, attackers create a malicious webpage, which             App-in-App Ecosystem. Recent years witnessed several
abuses benign.com’s identity by executing the JavaScript                  techniques to support app-in-app ecosystems, such as web



USENIX Association                                                                           31st USENIX Security Symposium          1609
apps, hybrid apps, instant apps, and virtual apps. Numerous          among multi-origin web pages. NoFrak [23] points out the
studies [14, 27, 30, 41, 44, 46, 49–51] have looked into their       importance of protecting the web-to-mobile bridge. Then,
designs, prevalence, usages, and flaws. For example, DCV-            Draco [42], MobileIFC [37], WIREframe [22], and Hybrid-
Hunter [46] focuses on differential context vulnerabilities for      Guard [34] present frameworks to extend the same origin
hybrid apps. Lee et al. [27] investigate privacy issues and          policy (SOP) to protect web-to-mobile bridges in hybrid appli-
side-channel flaws in progressive web apps. MIAFinder [41]           cations and enforce fine-grained access control mechanisms.
studies the link hijacking attacks to instant apps. Zhang et         Moreover, prior works [19, 20] discover additional flawed
al. [49] reveal the weak isolation between different virtual         URL parsing and matching examples in different scenarios,
apps. Lu et al. [30]. focus on analyzing the resource man-           such as email senders.
agement flaws of app-in-app. Zhang et al. [51] design and               As a comparison, such app-level identification (e.g., UID-
implement a novel, scalable crawler, called MiniCrawler, to          based permission validation) and domain-based (e.g., cross-
index over 1.3 million WeChat mini-apps and measure their            site validation) authorization in mobile apps are different
aggregated statistics, such as resource consumption, API/li-         from identity check problems in sub-apps of an app-in-app
brary usage, obfuscation rate, and app categorization/ratings.       ecosystem. Specifically, it is much more complicated for Web-
As a comparison, our paper focuses on a special type of vul-         View based app-in-app ecosystem to integrate both app-level
nerability, called identity confusion, with a different threat       identification and domain verification.
model from prior works, which has not been studied before.
WebView Security. WebView is becoming a widely-used                  8   Conclusion
component for loading web contents in mobile apps and has
been studied by many research works [6, 21, 25, 26, 29, 31,          In this paper, we perform the first systematic study of so-
32, 36, 39, 40, 43]. For example, Jin et al. [25], Li et al. [29],   called identity confusions in real-world app-in-app ecosys-
Wang et al. [43] show that attackers can inject malicious            tems. We categorize and taxonomize existing identity confu-
code into victim apps by exploiting insecure app communi-            sions into three types—domain name, app ID, and capabil-
cation channels (e.g., scheme and intent) in WebView-based           ity confusions—based on the identity check adopted in the
hybrid apps. Son et al. [39] analyze WebView-based adver-            app-in-app ecosystem. Such identity confusion could lead
tisement apps and find that malicious ads can hijack mobile          to severe consequences such as manipulating users’ finan-
apps. As a comparison, our work focuses on identity confu-           cial accounts and malware installation on smartphones. Then,
sion vulnerabilities, e.g., how super-apps protect their APIs in     we study 47 most popular super-apps supporting app-in-app
WebView-based sub-app runtime and whether the protection             ecosystems and find that they are all vulnerable to at least
is insecure.                                                         one type of aforementioned identity confusion. We also re-
   Past works also study the race condition attacks in Web-          sponsibly report all of the vulnerabilities to corresponding
View. Lau et al. [26] present a semi-automated approach to           super-app developers.
analyze the concurrency flows in the PhoneGap framework
and discover event-based race conditions of JavaScript APIs.         Acknowledgement
Another research work [6] also reports several race conditions
in WebView’s event handlers. As a comparison, our threat             We would like to thank the anonymous reviewers for their
model is different from theirs because our sub-app may also          insightful comments that helped improve the quality of the
include third-party resources. More importantly, our domain          paper. This work was supported in part by National Science
name confusion part is much broader research on the Web-             Foundation (NSF) under grants CNS-20-46361 and CNS-
View’s event handlers, which demonstrates the root causes            18-54001, National Natural Science Foundation of China
in design flaws and shows more varieties of exploiting such          (U1736208, U1836210, U1836213, 62172104, 62172105,
vulnerabilities. Moreover, we also introduce a measurement           61972099, 61902374, 62102093, 62102091), Natural Science
study to reveal how these event handlers affect the identity         Foundation of Shanghai (19ZR1404800), and China Postdoc-
checks of real-world mobile apps.                                    toral Science Foundation (BX2021079, 2021M690706). Yuan
                                                                     Zhang was supported in part by the Shanghai Rising-Star Pro-
Identity Checks. Many research works investigate iden-               gram under Grant 21QA1400700. The views and conclusions
tity check flaws in mobile and web apps. We start from               contained herein are those of the authors and should not be
the mobile part. Smalley et al. [38] demonstrate the limi-           interpreted as necessarily representing the official policies
tation of UID-based Discretionary Access Control (DAC)               or endorsements, either expressed or implied, of NSF. Min
and bring much more complicated Mandatory Access con-                Yang is the corresponding author, and a faculty of Shanghai
trol (MAC) to the mobile system. Hernandez et al. [24] an-           Institute of Intelligent Electronics & Systems, Shanghai In-
alyze the issues of enforced security policies. We then de-          stitute for Advanced Communication and Data Science, and
scribe web apps and their connection with mobile systems.            Engineering Research Center of Cyber Security Auditing and
Prior works [15–18, 28, 45, 47] focus on the security issues         Monitoring, Ministry of Education, China.



1610    31st USENIX Security Symposium                                                                       USENIX Association
References                                                      [15] Yinzhi Cao, Zhichun Li, Vaibhav Rastogi, Yan Chen,
 [1] China bytes vol. 1: Wechat, new trends and chinese wis-         and Xitao Wen. Virtual browser: a virtualized browser
     dom. https://reurl.cc/L769ka Accessed October                   to sandbox third-party javascripts with enhanced secu-
     6, 2021.                                                        rity. In Proceedings of the 7th ACM Symposium on
                                                                     Information, Computer and Communications Security,
 [2] Getting mini program code. https://developers.                  pages 8–9, 2012.
     weixin.qq.com/miniprogram/dev/framework/
     open-ability/qr-code.html Accessed October 6,              [16] Yinzhi Cao, Vaibhav Rastogi, Zhichun Li, Yan Chen,
     2021.                                                           and Alexander Moshchuk. Redefining web browser
                                                                     principals with a configurable origin policy. In 2013
 [3] Getting url link. https://developers.weixin.qq.                 43rd Annual IEEE/IFIP International Conference on
     com/miniprogram/dev/framework/open-ability/                     Dependable Systems and Networks (DSN), pages 1–12.
     url-scheme.html Accessed October 6, 2021.                       IEEE, 2013.

 [4] Line, messenger app. https://line.me/en/ Ac-               [17] Yinzhi Cao, Yan Shoshitaishvili, Kevin Borgolte,
     cessed October 6, 2021.                                         Christopher Kruegel, Giovanni Vigna, and Yan Chen.
                                                                     Protecting web-based single sign-on protocols against
 [5] Microsoft teams on google play.          https:                 relying party impersonation attacks through a ded-
     //play.google.com/store/apps/details?id=                        icated bi-directional authenticated secure channel.
     com.microsoft.teams Accessed October 6, 2021.                   In International Workshop on Recent Advances in
 [6] Mind the bridge — new attack model in hybrid                    Intrusion Detection, pages 276–298. Springer, 2014.
     mobile application.    https://conference.hitb.
                                                                [18] Yinzhi Cao, Vinod Yegneswaran, Phillip A Porras, and
     org/hitbsecconf2021ams/materials/D2T1%20-%
                                                                     Yan Chen. Pathcutter: Severing the self-propagation
     20A%20New%20Attack%20Model%20for%20Hybrid%
                                                                     path of xss javascript worms in social web networks. In
     20Mobile%20Applications%20-%20Ce%20Qin.pdf
                                                                     NDSS, 2012.
     Accessed October 6, 2021.

 [7] Number of available applications in the google play        [19] Jianjun Chen, Jian Jiang, Haixin Duan, Tao Wan, Shuo
     store from december 2009 to december 2020. https:               Chen, Vern Paxson, and Min Yang. We still don’t
     //reurl.cc/ox5Oj3 Accessed October 6, 2021.                     have secure cross-domain requests: an empirical study
                                                                     of CORS. In 27th USENIX Security Symposium
 [8] Pagoda company profile. https://www.pagoda.com.                 (USENIX Security 18), pages 1079–1093, 2018.
     cn/en Accessed October 6, 2021.
                                                                [20] Jianjun Chen, Vern Paxson, and Jian Jiang. Composition
 [9] Soot. https://github.com/soot-oss/soot Ac-                      kills: A case study of email sender authentication. In
     cessed October 6, 2021.                                         29th USENIX Security Symposium (USENIX Security
                                                                     20), pages 2183–2199, 2020.
[10] Wandoujia. https://www.wandoujia.com/ Accessed
     October 6, 2021.                                           [21] Erika Chin and David Wagner. Bifocals: Analyz-
                                                                     ing webview vulnerabilities in android applications.
[11] Webview.         https://developer.android.com/
                                                                     In International Workshop on Information Security
     reference/android/webkit/WebView       Accessed
                                                                     Applications, pages 138–159. Springer, 2013.
     October 6, 2021.

[12] Wkwebview, apple development documentations.               [22] Drew Davidson, Yaohui Chen, Franklin George, Long
     https://developer.apple.com/documentation/                      Lu, and Somesh Jha. Secure integration of web con-
     webkit/wkwebview Accessed October 6, 2021.                      tent and applications on commodity mobile operat-
                                                                     ing systems. In Proceedings of the 2017 ACM on
[13] Xposed module repository. https://repo.xposed.                  Asia Conference on Computer and Communications
     info/ Accessed October 6, 2021.                                 Security, pages 652–665, 2017.

[14] Yasemin Acar, Michael Backes, Sven Bugiel, Sascha          [23] Martin Georgiev, Suman Jana, and Vitaly Shmatikov.
     Fahl, Patrick McDaniel, and Matthew Smith. Sok:                 Breaking and fixing origin-based access control in hy-
     Lessons learned from android security research for appi-        brid web/mobile application frameworks. In Proc. of the
     fied software platforms. In 2016 IEEE Symposium on              Network and Distributed System Security Symposium
     Security and Privacy (SP), pages 433–451. IEEE, 2016.           (NDSS’14), 2014.



USENIX Association                                                                31st USENIX Security Symposium      1611
[24] Grant Hernandez, Dave Jing Tian, Anurag Swarnim Ya-        [33] Patrick Mutchler, Adam Doupé, John Mitchell, Chris
     dav, Byron J Williams, and Kevin RB Butler. Bigmac:             Kruegel, and Giovanni Vigna. A large-scale study of
     Fine-grained policy analysis of android firmware. In            mobile web app security. In Proceedings of the Mobile
     29th USENIX Security Symposium (USENIX Security                 Security Technologies Workshop (MoST), page 50,
     20), pages 271–287, 2020.                                       2015.

[25] Xing Jin, Xuchao Hu, Kailiang Ying, Wenliang Du,           [34] Phu H Phung, Abhinav Mohanty, Rahul Rachapalli, and
     Heng Yin, and Gautam Nagesh Peri. Code injec-                   Meera Sridhar. Hybridguard: A principal-based permis-
     tion attacks on html5-based mobile apps: Character-             sion and fine-grained policy enforcement framework for
     ization, detection and mitigation. In Proceedings of            web-based mobile applications. In 2017 IEEE Security
     the 2014 ACM SIGSAC Conference on Computer and                  and Privacy Workshops (SPW), pages 147–156. IEEE,
     Communications Security, pages 66–77, 2014.                     2017.

[26] Phi Tuong Lau. Static detection of event-driven races in   [35] Vaibhav Rastogi, Rui Shao, Yan Chen, Xiang Pan, Shi-
     html5-based mobile apps. In International Conference            hong Zou, and Ryan Riley. Detecting hidden attacks
     on Verification and Evaluation of Computer and                  through the mobile app-web interfaces. In Proc. of the
     Communication Systems, pages 32–46. Springer.                   Network and Distributed System Security Symposium
                                                                     (NDSS’16), 2016.
[27] Jiyeon Lee, Hayeon Kim, Junghwan Park, Insik Shin,         [36] Claudio Rizzo, Lorenzo Cavallaro, and Johannes Kinder.
     and Sooel Son.       Pride and prejudice in pro-                Babelview: Evaluating the impact of code injection at-
     gressive web apps: Abusing native app-like fea-                 tacks in mobile webviews. In International Symposium
     tures in web applications. In Proceedings of the                on Research in Attacks, Intrusions, and Defenses, pages
     2018 ACM SIGSAC Conference on Computer and                      25–46. Springer, 2018.
     Communications Security, pages 1731–1746, 2018.
                                                                [37] Kapil Singh. Practical context-aware permission con-
[28] Song Li, Mingqing Kang, Jianwei Hou, and Yinzhi Cao.            trol for hybrid mobile applications. In International
     Detecting Node.Js Prototype Pollution Vulnerabilities           Workshop on Recent Advances in Intrusion Detection,
     via Object Lookup Analysis, page 268–279. Associa-              pages 307–327. Springer, 2013.
     tion for Computing Machinery, New York, NY, USA,
     2021.                                                      [38] Stephen Smalley and Robert Craig. Security enhanced
                                                                     (se) android: Bringing flexible mac to android. In
[29] Tongxin Li, Xueqiang Wang, Mingming Zha, Kai                    Proc. of the Network and Distributed System Security
     Chen, XiaoFeng Wang, Luyi Xing, Xiaolong Bai,                   Symposium (NDSS’13), 2013.
     Nan Zhang, and Xinhui Han. Unleashing the walk-
     ing dead: Understanding cross-app remote infec-            [39] Sooel Son, Daehyeok Kim, and Vitaly Shmatikov. What
     tions on mobile webviews. In Proceedings of the                 mobile ads know about mobile users. In Proc. of the
     2017 ACM SIGSAC Conference on Computer and                      Network and Distributed System Security Symposium
     Communications Security, pages 829–844, 2017.                   (NDSS’16), 2016.
                                                                [40] Wei Song, Qingqing Huang, and Jeff Huang. Under-
[30] Haoran Lu, Luyi Xing, Yue Xiao, Yifan Zhang, Xiao-              standing javascript vulnerabilities in large real-world an-
     jing Liao, XiaoFeng Wang, and Xueqiang Wang. De-                droid applications. IEEE Transactions on Dependable
     mystifying resource management risks in emerging                and Secure Computing, 17(5):1063–1078, 2018.
     mobile app-in-app ecosystems. In Proceedings of
     the 2020 ACM SIGSAC Conference on Computer and             [41] Yutian Tang, Yulei Sui, Haoyu Wang, Xiapu Luo, Hao
     Communications Security, pages 569–585, 2020.                   Zhou, and Zhou Xu. All your app links are be-
                                                                     long to us: understanding the threats of instant apps
[31] Tongbo Luo, Hao Hao, Wenliang Du, Yifei Wang, and               based attacks. In Proceedings of the 28th ACM
     Heng Yin. Attacks on webview in the android system.             Joint Meeting on European Software Engineering
     In Proceedings of the 27th Annual Computer Security             Conference and Symposium on the Foundations of
     Applications Conference, pages 343–352, 2011.                   Software Engineering, pages 914–926, 2020.
[32] Tongbo Luo, Xing Jin, Ajai Ananthanarayanan, and           [42] Guliz Seray Tuncay, Soteris Demetriou, and Carl A
     Wenliang Du. Touchjacking attacks on web in android,            Gunter. Draco: A system for uniform and fine-grained
     ios, and windows phone. In International Symposium              access control for web code on android. In Proceedings
     on Foundations and Practice of Security, pages 227–             of the 2016 ACM SIGSAC Conference on Computer
     243. Springer, 2012.                                            and Communications Security, pages 104–115, 2016.



1612   31st USENIX Security Symposium                                                                    USENIX Association
[43] Rui Wang, Luyi Xing, XiaoFeng Wang, and Shuo                 [52] Zicheng Zhang, Daoyuan Wu, Lixiang Li, and Debin
     Chen. Unauthorized origin crossing on mobile plat-                Gao. On the usability (in)security of in-app browsing
     forms: Threats and mitigation. In Proceedings of                  interfaces in mobile apps. In International Symposium
     the 2013 ACM SIGSAC conference on Computer &                      on Research in Attacks, Intrusions, and Defenses, 2021.
     Communications Security, pages 635–646, 2013.

[44] Guangliang Yang and Jeff Huang. Automated genera-
     tion of event-oriented exploits in android hybrid apps. In
     Proc. of the Network and Distributed System Security
     Symposium (NDSS’18), 2018.

[45] GuangLiang Yang, Jeff Huang, and Guofei Gu.
     Iframes/popups are dangerous in mobile webview:
     studying and mitigating differential context vulnerabil-
     ities. In 28th USENIX Security Symposium (USENIX
     Security 19), pages 977–994, 2019.

[46] GuangLiang Yang, Jeff Huang, and Guofei Gu.
     Iframes/popups are dangerous in mobile webview:
     studying and mitigating differential context vulnerabil-
     ities. In 28th USENIX Security Symposium (USENIX
     Security 19), pages 977–994, 2019.

[47] Guangliang Yang, Jeff Huang, Guofei Gu, and Abner
     Mendoza. Study and mitigation of origin stripping vul-
     nerabilities in hybrid-postmessage enabled mobile ap-
     plications. In 2018 IEEE Symposium on Security and
     Privacy (SP), pages 742–755. IEEE, 2018.

[48] Guangliang Yang, Abner Mendoza, Jialong Zhang, and
     Guofei Gu. Precisely and scalably vetting javascript
     bridge in android hybrid apps.      In International
     Symposium on Research in Attacks, Intrusions, and
     Defenses, pages 143–166. Springer, 2017.

[49] Lei Zhang, Zhemin Yang, Yuyu He, Mingqi Li, Sen
     Yang, Min Yang, Yuan Zhang, and Zhiyun Qian. App in
     the middle: Demystify application virtualization in an-
     droid and its security threats. Proceedings of the ACM
     on Measurement and Analysis of Computing Systems,
     3(1):1–24, 2019.

[50] Xiaohan Zhang, Yuan Zhang, Qianqian Mo, Hao Xia,
     Zhemin Yang, Min Yang, Xiaofeng Wang, Long Lu,
     and Haixin Duan. An empirical study of web resource
     manipulation in real-world mobile applications. In 27th
     USENIX Security Symposium (USENIX Security 18),
     pages 1183–1198, 2018.

[51] Yue Zhang, Bayan Turkistani, Allen Yuqing Yang,
     Chaoshun Zuo, and Zhiqiang Lin. A measurement
     study of wechat mini-apps. In Proceedings of the
     2021 ACM SIGMETRICS/International Conference
     on Measurement and Modeling of Computer Systems,
     2021.



USENIX Association                                                                  31st USENIX Security Symposium      1613
