---
type: Article
title: "Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild"
description: "HCache mutates the request line, headers and body to find fields the cache omits from its key but the origin still reacts to, then sends normal, attack and validation requests behind a cache buster to confirm the error response is cached and served. Across Tranco top 1,000 domains and subdomains, 1,354 sites were poisonable through 14 vector families, 7 of them new: CDN internal-route headers, Authorization, If-*, X-Forwarded-Proto and Range. Caches are shared between HTTP/1.1 and HTTP/2."
resource: "https://doi.org/10.1145/3658644.3690361"
tags: [article, webseclist-reference, cache-poisoning, http, measurement-study, large-scale-scan, cdn, dos, http2, tooling]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T21:05:37+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://doi.org/10.1145/3658644.3690361"
    title: "Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild"
    author: Yuejia Liang, Jianjun Chen, Run Guo, Kaiwen Shen, Hui Jiang, Man Hou, Yue Yu, Haixin Duan
also_at: []
authors:
  - Yuejia Liang
  - Jianjun Chen
  - Run Guo
  - Kaiwen Shen
  - Hui Jiang
  - Man Hou
  - Yue Yu
  - Haixin Duan
canonical_url: ""
cited_by:
  - "2024.md:143"
commit: ""
content_sha256: 84e484ea38f7f268a9314a4f7d339e56e2115fd604231f229ff29835987f16bd
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://doi.org/10.1145/3658644.3690361"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: b674794b413376bfd17af6bfbd568ef845c966a1ef810aefb278dde0a6b16cd4
retrieved_from: "https://doi.org/10.1145/3658644.3690361"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T21:05:37+00:00"
slug: internet-s-invisible-enemy-detecting-measuring-web-cache-poisoning-wild
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild

**Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild** - Yuejia Liang, Jianjun Chen, Run Guo, Kaiwen Shen, Hui Jiang, Man Hou, Yue Yu, Haixin Duan, Publisher not stated.

- Published: date not stated
- Original: <https://doi.org/10.1145/3658644.3690361>
- Preserved from: https://doi.org/10.1145/3658644.3690361 (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Internet's Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild

Internet’s Invisible Enemy: Detecting and Measuring Web Cache
                       Poisoning in the Wild
                    Yuejia Liang                                            Jianjun Chen∗                                            Run Guo
                Tsinghua University                           Tsinghua University; Zhongguancun                                Tsinghua University
                   Beijing, China                                         Laboratory                                              Beijing, China
            liangyj21@tsinghua.org.cn                                    Beijing, China                                       gr15@tsinghua.org.cn
                                                                   jianjun@tsinghua.edu.cn

                    Kaiwen Shen                                                 Hui Jiang                                            Man Hou
     Tsinghua University; Clouditera Inc                          Tsinghua University; Baidu Inc                           Zhongguancun Laboratory
               Beijing, China                                              Beijing, China                                       Beijing, China
         kaiwenshen17@gmail.com                                       jianghui01@baidu.com                                  houman@zgclab.edu.cn

                                                        Yue Yu                                           Haixin Duan
                                      Beijing University of Posts and                         Tsinghua University; Quancheng
                                           Telecommunications                                           Laboratory
                                              Beijing, China                                          Beijing, China
                                         yuyue_999@bupt.edu.cn                                    duanhx@tsinghua.edu.cn

ABSTRACT                                                                                     ACM Reference Format:
Web cache poisoning (WCP) has posed significant threats to Internet                          Yuejia Liang, Jianjun Chen, Run Guo, Kaiwen Shen, Hui Jiang, Man Hou,
                                                                                             Yue Yu, and Haixin Duan. 2024. Internet’s Invisible Enemy: Detecting and
security by causing the cache server to deliver malicious responses
                                                                                             Measuring Web Cache Poisoning in the Wild. In Proceedings of the 2024
to innocent users. This results in widespread denial of access to                            ACM SIGSAC Conference on Computer and Communications Security (CCS
website resources and potential injection of harmful payloads. How-                          ’24), October 14–18, 2024, Salt Lake City, UT, USA. ACM, New York, NY, USA,
ever, prior works on WCP vulnerability have been fragmented and                              15 pages. https://doi.org/10.1145/3658644.3690361
conducted in a case-by-case form, lacking a systematic analysis
of the threat landscape. In this paper, we fill this research gap by                         1    INTRODUCTION
conducting a systematic evaluation of WCP vulnerabilities at scale.
We propose HCache, a novel testing methodology to facilitates the                            To prevent unnecessary Internet traffic and enhance data transmis-
widespread identification of WCP vulnerabilities. We evaluated                               sion efficiency, web caching facilities are extensively used. They
our methodology against Tranco Top 1000 domains and their sub-                               store frequently requested data resources, reducing the need for
domains, and found that over 1,000 websites across 172 domains,                              repeated data transfers. Given web cache’s advantages, it has be-
representing 17% of the evaluated domains, are vulnerable to WCP.                            come a critical infrastructure component of the Internet. How-
In particular, we have identified 7 new attack vectors stemming                              ever, when compromised by malicious actors, web caching facilities
from previously unexplored caching headers. We have responsibly                              pose significant risks to the Internet. Research indicates that issues
disclosed the vulnerabilities to the affected websites and received ac-                      with web caching can lead various security consequences, such as
knowledgements and bug bounties from world-famous companies,                                 Denial-of-Service (DoS), Cross-site scripting (XSS), and information
such as Alibaba, Adobe, Huawei, and Microsoft.                                               leakage [4, 16, 17, 19, 28].
                                                                                                Attacks against web cache typically fall into two categories, the
CCS CONCEPTS                                                                                 web cache deception (WCD) and the web cache poisoning (WCP) [24,
                                                                                             25]. WCD aim to deceive the cache into making confidential in-
• Networks → Network measurement; • Security and privacy
                                                                                             formation publicly available online, whereas WCP involve poi-
→ Network security; Web application security.
                                                                                             soning the cache with harmful payloads that are then distributed
                                                                                             to unsuspecting users. In recent years, Mirheidar et al. [24, 25]
KEYWORDS                                                                                     studied the severity of WCD by measuring Alexa Top websites,
Network Security, Measurement, Web Cache, Web Cache Poisoning                                demonstrating the widespread threats on the Internet. However,
∗ Corresponding author.                                                                      due to the complexity, WCP have been studied in a case-by-case
                                                                                             form [4, 16, 17, 19, 24, 28], focusing on revealing the specific vul-
                          This work is licensed under a Creative Commons Attribution         nerabilities while lacking a global Internet view of the severity. As
                          International 4.0 License.                                         the WCP poses a severe threat to the Internet, it is urgent to detect
                                                                                             and prevent the vulnerabilities ahead of the attacker on the global
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                        scale.
© 2024 Copyright held by the owner/author(s).
ACM ISBN 979-8-4007-0636-3/24/10                                                                In this paper, we aim to fill this gap by performing a system-
https://doi.org/10.1145/3658644.3690361                                                      atic detection of WCP vulnerabilities at scale. To achieve this goal,




                                                                                       452
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                                          Yuejia Liang et al.


we need to address three research questions: (1) How can we gen-
erate testing requests that systematically probe cache poisoning                         ① GET /account.php/notexist.jpg

vulnerabilities? (2) How can we accurately detect potential web                                                                           ② 200 OK
                                                                                Victim                                                      Cache-Control: no-store
cache poisoning? (3) How can we assess the impact of web cache                                                             Web Cache
                                                                                                                                            account.php <!>
                                                                                                                                                                        Web Server


poisoning while minimizing disruption to normal users?                                           ③ GET /profile/notexist.jpg          200 OK
                                                                                                                                      account.php <!>
   To address these questions, we introduce a novel testing method-
ology, HCache, designed to detect WCP vulnerabilities. For the
first question, we employ a cache-key-aware approach that sys-
tematically generates and mutates requests to identify fields not                                                              Attacker

included in cache keys, thereby exposing potential inconsistencies.
For the second question, we utilize a three-step detection strategy                          Figure 1: Process of web cache deception
involving the issuance of a normal request, an attack request, and a
validation request. This strategy allows us to analyze differences in
the response’s status code, content, and length to detect potential           categorized into private caching and shared proxy caching. Private
WCP vulnerabilities. For the third question, we incorporate cache             caches are caching mechanisms within the web client itself (e.g., the
buster variables in our request parameters, ensuring that our testing         browser cache[30]) and within the web server (e.g., the WordPress
does not disrupt normal website operations while maintaining the              plugin cache[36]). Shared proxy caching mainly includes various
efficacy of our detection approach.                                           proxy servers and CDNs.
   We evaluated HCache against Tranco Top 1,000 domains in-                      The reports released by the three major CDN providers, Akamai,
volving 22,114 subdomains with 51,596 distinct URL links. Our                 Cloudflare, and Fastly, indicate that a significant amount of network
evaluation discovers more than 1,000 websites across 172 domains,             traffic passes through caching proxy communication each year [34].
constituting 17% of the domains evaluated, are vulnerable to WCP.             A measurement study by Guo et al. [6] shows that among the top
Moreover, we identify 7 new attack variants to trigger WCP, includ-           1,000 domains in the Alexa ranking list, 74% of websites utilize
ing HTTP protocol headers, scope requests, conditional requests,              CDN services for content distribution and network acceleration.
and so on. Meanwhile, we investigated the caching differences be-             Additionally, there are many independent caching proxies (such as
tween HTTP/2 and HTTP/1.1 and found that the WCP problem is                   Squid [32], Varnish [33]) and caching servers (such as Apache [10],
also prevalent in HTTP/2. Therefore, WCP is still a serious prob-             Nginx [26]) distributed throughout the Internet, indicating that
lem, and network operators and caching service providers should               web caching devices have become critical infrastructure for the
take appropriate measures to solve this problem. To the best of our           Internet.
knowledge, this study represents the first systematic, large-scale               Cache servers typically store static and commonly accessed re-
evaluation of WCP within a scientific framework. We reported                  sources like HTML, JS, CSS, images, and other media. Most web
the vulnerabilities to the affected websites and received acknowl-            caches, due to their shared nature, do not cache dynamic, person-
edgements from over 15 companies, including globally renowned                 alized, or sensitive content. The HTTP/1.1 specification’s “Cache-
ones like Adobe, Alibaba, Huawei, and Microsoft. Additionally, we             Control” header directs caching devices on handling responses,
received bug bounties totalling over $1,000 from these entities.              such as “Cache-Control: no-store” to prevent storage. Despite RFC
   In summary, we make the following contributions:                           mandates for adherence to these headers, some caching devices and
     • We introduced a novel testing methodology for large-scale              CDNs offer options to bypass them. A prevalent caching strategy
       evaluation of websites for WCP on the Internet, along with             involves rules based on resource paths and extensions, like caching
       a practical detection system named HCache1 .                           only JPG, ICO, CSS, or JS files.
     • We carried out a comprehensive analysis of the Tranco Top
       1,000 domains and their subdomains, discovering over 1,000             2.2        Web Cache Attack
       websites across 172 domains vulnerable to WCP, indicating              As an important infrastructure in the Internet, web cache requires
       that 17% of measured domains are at risk.                              utmost security. There are primarily two attack vectors targeting
     • We discovered 7 new attack vectors that can cause WCP at-              cache servers based on their caching characteristics [25].
       tacks and found the WCP issues are still prevalent in HTTP/2.             Web Cache Deception (WCD) is an attack that tricks the appli-
       We have responsibly reported the vulnerabilities to the af-            cation into storing sensitive content belonging to other users in the
       fected websites and received acknowledgements and over                 cache. Subsequently, the attacker retrieves this content from the
       $1,000 bug bounties from many companies such as Adobe,                 cache. Figure 1 shows the process of WCD: 1)The attacker tricks the
       Alibaba, Huawei, and Microsoft.                                        victim into visiting a URL that requests /account.php/nonexist.jpg.
                                                                              2)The request reaches the web server and ignore the non-existent
2 BACKGROUND                                                                  part of the URL. Web server send back a successful response with
                                                                              account.php, which has victim’s private account. The web cache
2.1 Web Cache                                                                 store the response, interpreting it as a static image. 3)The attacker
Web cache reduces network traffic and optimizes application per-              visits the same URL accessing the victim’s information stored in
formance by caching frequently used network resources. It can be              the cache.
                                                                                 Web Cache Poisoning (WCP) is to induce the application to
1 https://github.com/phantomnothingness/HCache                                store malicious content in the cache. The normal requests from




                                                                        453
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                                           CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


                ① Send Malicious
                 HTTP Request
                                                         ② Forward
                                                      Malicious Request
                                                                                              DoS attack [28]. Mirheidari et al. conducted large-scale measure-
                                                                                              ments on the impact of WCD on the Internet [24, 25].
                                                 ③ Return Error Response                         These studies have two main limitation: (1) They are case-by-
  Attacker                         Web Cache                               Web Server
                                                                                              case studies and do not systematically analyze the cache poisoning
                                        ③ Cacheable
                 ④ Send Normal
                                                                                              vectors that may result from different HTTP fields, which could
                 HTTP Request                                                                 miss many new attack vectors, as we demonstrate later; (2) They
                                                                                              lack large-scale measurements. Existing studies have either only
                ④ Hit Malicous Cache
  Victim
                                                                                              conducted manual testing for CDNs and HTTP implementations, or
                                                                                              only conducted small-scale testing for certain attack types, leading
             Figure 2: Process of web cache poisoning                                         to many vulnerability instance undiscovered. Therefore, there is an
                                                                                              urgent need for a systematic tool capable of conducting large-scale
                                                                                              measurements to identify WCP vulnerabilities.
other users may hit the cache, resulting in access to malicious                               3 OVERVIEW
content. Figure 2 shows the process of WCP: 1)The attacker sends a
carefully crafted malicious HTTP request. 2)The cache server fails                            3.1 Threat Model
to filter the malicious request and forwards it to the web server.                            Essentially, web cache poisoning (WCP) attacks stem from the prob-
3)The malicious request triggers an exception at the web server,                              lem with cache key. The cache key serves as the unique identifier
resulting in a harmful response that the cache server stores. 4)A                             to locate and isolate cached objects, determining whether a request
normal request initiated by the victim hits the cached malicious                              hits the cache or not. Figure 3 presents an example of cache keys
resource.                                                                                     in HTTP requests. It typically consists of the request method, host-
   These two attacks have two main differences. (1) The attack                                name, and URI. A cache hit occurs when a new request matches the
techniques are different: WCD achieves its goal by constructing                               cache key of a previous stored object that still remains valid within
abnormal URLs, it requires the victim to click on the malicious                               the cache; if not, the resource is retrieved from the web server.
URL to deceive the cache. WCP can exploit various parts of the
HTTP request to poison the cache, directly resulting in the victim                                        Is Cache Key  GET /1.css?x=1 HTTP/1.1
receiving abnormal responses. (2) The attack objectives are different:                                                  Host: example.com
                                                                                                          Not Cache Key User-Agent: Mozilla/5.0 Windows NT 10.0
WCD aims to steal sensitive information from the cache, whereas                                                         Accept: text/html,*/*
WCP aims to make the victim access error responses in the cache.                                                        Accept-Language: zh-CN,zh
Researchers have conducted extensive measurement studies on                                                    Cache Key: GET | example.com | /1.css?x=1
WCD [24, 25]. However, there is currently a lack of large-scale
measurements regarding WCP. This study focuses on the research
                                                                                              Figure 3: A example schema for cache keys in HTTP request
gap in the deficit of a global WCP threat overview, by designing
and implementing the HCache to study the severity on the Internet.
   WCP has the merit of a wide-range attacking impact with just
a simple attack. Specifically, attackers only need to send a single
attacking request, while affecting numerous global Internet users.
                                                                                               Attacker                                  Web Cache
The larger the traffic of a website, the greater the impact it can                                           GET /a/ HTTP/1.1
                                                                                                             Host: example.com                    MISS
                                                                                                                                                                                     Web Server


cause. In the entire attack chain, WCP can be conducted in conjunc-                                          X-Malicious-Header: value            Forward the request

tion with other attacking techniques to broaden the attack surface,                                                                                     HTTP/1.1 400 Bad Request
                                                                                                                                                        …
and their final impact closely depends on the injected malicious                                                           Malicious Response A
                                                                                                                                                        some error

payloads. If an error response is returned, it can lead to a Denial                                                                                                   OR
                                                                                                                                                        HTTP/1.1 301 Moved Permanently
of Service (DoS) attack. If the response is dynamically generated,                                                         Malicious Response B
                                                                                                                                                        Location: attack.com

injection of JavaScript code can result in Cross-Site Scripting (XSS)                                                                                   <html>
                                                                                                                                                                      OR
                                                                                                                                                        ...
attacks. If the location of redirect responses can be manipulated,                                                         Malicious Response C         <script>alert(1);</script>

arbitrary page replacement can occur. In a word, when combin-                                                        Cache with Cache Key : GET | /a/ | example.com
ing WCP with other attack methods, the severity can be further
expanded.                                                                                                       GET /a/ HTTP/1.1
                                                                                                                Host: example.com
                                                                                                Victim
                                                                                                                ...


2.3        Limitation of Existing Research                                                                                                        Has the same Cache Key
                                                                                                                   Malicious Response             HIT
Current studies share a common limitation as they are all case-by-
case investigations heavily reliant on empirical knowledge. Chen et
al. proposed a new method for WCP by exploiting the Host header,
termed "Host of Trouble" [1]. James Kettle introduced a novel tech-                                       Figure 4: An example of web cache poisoning
nique to execute such attacks using HTTP request fields, including
X-Forwarded-Host, request parameters, fat get request [16, 17].                                  Figure 4 presents a example of WCP, where an attacker con-
Nguyen et al. proposed CPDoS, using three methods to conduct a                                structs a malicious request with evil content in the headers. The




                                                                                        454
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                Yuejia Liang et al.


cache server forwards this request, triggering a malicious response            4 HCACHE: DESIGN AND IMPLEMENTATION
from the web server. Malicious responses could be an error page, a
                                                                               4.1 Workflow
redirection to a 3rd-party website controlled by the attacker, or a
page containing malicious content. Finally, the cache server then              Based on the above methodology, we developed HCache, a large-
caches this evil response, and victim requests with the same cache             scale detection system to detect web cache poisoning (WCP), de-
key hit the poisoned cache, leading to a WCP attack. While WCP                 picted in Figure 5. HCache comprises three core modules: the Pre-
has posed a severe threat to the Internet, there is lack of systematic         processing Module, the Test-case Generation Module, and the Cache-
evaluation of such vulnerabilities at scale.                                   poisoning Detection Module.
                                                                                  (1) The Preprocessing Module processes the seed domain list
                                                                               through expansion, survivability checks, deduplication, and cacheable
                                                                               URL identification, outputting detectable URLs.
                                                                                  (2) The Test-case Generation Module identifies cache keys, pro-
                                                                               duces standard requests, and generates test cases for potential WCP.
                                                                                  (3) The Cache-poisoning Detection Module synthesizes the prior
3.2     Methodology                                                            modules’ outputs to craft attack requests and assesses WCP vulner-
In this paper, we present a novel testing methodology to detect                abilities using varied attack payloads.
WCP on the Internet. However, developing such a methodology                       The following paragraphs present detailed information on the
needs to answer the following research questions.                              related working steps and specific modules.
   Q1: How can we generate testing requests to systematically
probe web cache poisoning vulnerabilities?                                     4.2    Stage A. Preprocessing
   Previous works [24, 25, 27] usually utilize manual approaches               First, the list of URLs to be tested needs to be determined before the
or collect known exploits to generate testing requests, and do not             following real-world measurement. Thus, the Preprocessing Module
systematically explore various HTTP fields and specific caching                includes the initial three steps, including subdomain extension,
behaviors. This can lead to incomplete testing and the potential               target URL finding, and URL deduplication.
oversight of new attack vectors. To address this, we have developed               Step A.1) Subdomain Extension. Starting from initial domains,
a cache-key-aware approach to systematically generate and mu-                  this process recursively crawls related HTTP/HTTPS pages to
tate HTTP requests to uncover WCP vulnerabilities. We start with               gather subdomains with a 200 status code, thereby expanding the
standardized HTTP requests to incorporate typical header fields by             domain list for further steps. Domains that do not return a 200
leveraging syntax rules derived from HTTP RFCs. We then enumer-                status code are disregarded, as they are not typically accessed by
ate different HTTP fields such as request line, headers, and body to           web clients. The next step then generates the initial set of URLs for
uncover those fields not included in cache keys. Then we mutate                testing based on the collected subdomains.
non-cache-key fields and body of requests to probe inconsistencies                Step A.2) Target URL Finding. This component is a website
between web caches and web servers, aiming to uncover potential                crawler that uncovers URL resources through deep traversal and
exploits. This allows for a more targeted and systematic generation            automates website visits using Python’s Requests library. To en-
of test cases for essentially identifying potential WCP issues.                hance efficiency for large-scale detection of popular websites, it
   Q2: How can we detect Web Cache Poisoning accurately?                       operates with multiple concurrent threads. In summary, the pro-
   We design a three-phase testing approach to detect WCP ac-                  gram sequentially crawls the target domain’s homepage, extracting
curately. First, we send a normal request to establish a baseline              static resources such as JavaScript, images, and videos.
response. This is followed by a especially crafted request, where                 Relevant studies indicate that using the HTTP header fields in
potential vulnerabilities are systematically tested. The response to           the response (e.g. ’age’, ’x-cache’) to determine whether a page is
this request is then compared to the baseline response, identifying            cached is a relatively accurate method[25]. Pages detected using
discrepancies that may indicate a successful poisoning attack. Fi-             this approach form a true subset of all cached pages, as certain
nally, a validation request is sent to confirm the initial assessment          websites may omit cache-related information in their responses. We
of WCP vulnerability. This approach allows us to pinpoint the exact            referenced official documentation from major caching vendors to
conditions under which WCP can occur, providing a reliable means               understand the specific caching behavior of different cache identity
of assessment.                                                                 headers. Additionally, the crawler discovers numerous related URLs
   Q3: How can we assess the impact of WCP while minimiz-                      on third-party websites, including OSS storage, JS hosting, and self-
ing disruption to normal users?                                                built CDN services, and automatically adds these domains into the
   Minimizing the impact on normal users while assessing WCP                   domain discovery list.
is crucial. To achieve this, we employ cache buster variables in our              Step A.3) URL Deduplication. The deduplication module en-
request parameters to isolate web caches. These variables, crafted             hances the efficiency of large-scale cache-poisoning detection. Many
as unique random values and cache keys, ensure that normal user                web applications generate customized pages based on query strings
requests do not intersect with our crafted testing requests, thereby           or URL path parameters, leading to similar URL structures being
preventing access to potentially poisoned caches. This technique               cached together with the same vulnerabilities. Exhaustive testing
ensures that our testing process does not disrupt the normal oper-             of each URL is time-consuming and resource-intensive. To avoid re-
ations of the website or the access of legitimate users, while still           dundant detection of similar URLs, obtained URL lists are processed.
maintaining the high efficacy of WCP detection.                                Utilizing the SimHash algorithm [31], we developed a program for




                                                                         455
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                            CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


                                                  A. Preprocessing                                       C. Cache Poisoning Detection

 Tranco Top
     1k
                             ①Subdomain            ②Target URL Finding         ③URL Deduplication
                              Extension
                                                                                                               Target URL List

                                             B. Test Case Generation

                                                   ②HTTP Request Line Mutation                                                                              Bugs
                                                                                                                                    Web Server
                                                                                                          ①Detecting Request
                                                  ③HTTP Request Headers Mutation         Cache Buster        Generation

                                                  ④HTTP Request Body Mutation
                    ①Standard HTTP
                    Request Creation
                                              … ⑤Other Illegal HTTP Request Mutation                                               ③Poisoning
                                                                                                        ②Response Difference
                                                                                                             Analysis              Validation


                                       Figure 5: Overview of our large-scale measurement system:HCache


fuzzy matching and URL similarity calculation to consolidate simi-                     server errors. For parameter mutation, we collect a list of com-
lar URLs.                                                                              mon parameters, which HCache utilizes to mutate HTTP request
   For example, example.com/users/bob/blog1 and example.com/users                      parameters.
/alice/article2 may exhibit high similarity. Initially, we generalize                     Step B.3) HTTP Request Headers Mutation. The request
them based on letters (represented by C), numbers (represented by                      header includes fields both from standard RFC specifications and
D), and special characters (represented by S): example.com/CCCCC                       popular web servers and CDN vendors. This complexity, coupled
/CCC/CCCCD. Subsequently, we assign weights according to the                           with variations between middlebox and web server, often leads to
hierarchical levels of the path, where higher-level directories have                   inconsistencies and potential WCP vulnerabilities. It also brings
greater weights. Next, we use a directory of different levels as                       a great challenge to the detection of WCP: how to cover as many
keywords to calculate feature vectors. We compute similarity by                        types of attacks as possible? To this end, we propose the following
utilizing the Hamming distance between feature vectors, and URLs                       variants based on the characteristics of different headers.
with excessively high similarity are deduplicated. In the end, this                       i.Request Headers Scanning: Some fields in the HTTP request
process yields a set of URLs for testing, and filtering out URLs in this               header may also affect the web server’s execution logic. A common
manner significantly reduces the testing workload. It also avoids                      trick is to utilize forwarding headers (e.g., ‘X-Forwarded-Host’, ‘X-
overconsumption of the target server’s resources with redundant                        Forwarded-Scheme’, ‘X-Forward-Port’), which are often used to pass
scans.                                                                                 information among multi-hop HTTP servers. WCP occurs when
                                                                                       the cache server uses these fields for routing without adding them
                                                                                       to the cache key. Similarly, web server that fetches cookie fields
4.3     Stage B. Test Case Generation                                                  to generate readback data dynamically is vulnerable. Meanwhile,
The test case generation is the core module of HCache that outputs                     numerous real-world headers may dynamically affect the caching
different request variations to comprehensively cover different WCP                    results, and different CDN vendors have their customized headers
methods. It includes standard HTTP request generation, cache key                       for access control. This method involves gathering common request
detection, and multiple request mutation methods.                                      headers on the Internet and systematically altering HTTP requests
   Step B.1) Standard HTTP Request Creation. Informed by                               with these headers to evaluate their effect on WCP.
expert insights and traffic analysis, we’ve crafted standard HTTP                         ii.Special Headers Scanning: Certain HTTP request headers, as
request templates for common methods like HEAD, GET, and POST.                         defined in RFCs, have specific value requirements, such as the ‘If-
These templates are designed to avoid rejection by mimicking nor-                      Unmodified-Since’ header specifying a date format. Besides, web
mal HTTP traffic, including typical header fields like ‘Host’, ‘User-                  servers will format the header of a request, if a header’s value does
Agent’, ‘Cookie’, and ‘Accept-Encoding’, with the ‘Host’ field adapt-                  not conform (e.g., a random string), it’s disregarded by web servers,
ing to the target domain automatically. This equips HCache with a                      hindering WCP detection. To address this, we generate syntax-
basic suite of HTTP requests.                                                          compliant values that adhere to RFC specifications for testing.
   Step B.2) HTTP Request Line Mutation. The HTTP request                                 iii.Blacklist HTTP Request Mutation: While WAFs block scanners
Line, comprising the Method, URI, and Protocol Version, is often a                     or crawlers by common filtering mechanisms (eg. return 403 Illegal
cache key, thus we explore the impact of different fields of non-                      Access Response when detecting ‘User-Agent’ as SQLMap), some
cache keys, such as method case insensitivity, parameter changes,                      cache servers may not include ‘User-Agent’ in the cache key, cre-
and protocol version arbitrarily specified variants. WCP can occur                     ating an opportunity for WCP. HCache employs a blacklist-based
when a non-cache key field affects content generation or causes




                                                                                 456
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                Yuejia Liang et al.


mutation mechanism that assesses the impact of security scanners              response matches the last poisoned content, and the cache identity
(e.g. Nuclei) and web crawlers (e.g. PyCurl) on the cache. Addition-          field should display ”HIT”.
ally, it tests the cache’s resilience to malicious ‘Referer’ messages            False positives in the measurement process are caused by mul-
from phishing sites and common blacklist strings used by WAFs                 tiple similar requests from the same client being rejected by the
(e.g. <script>alert(1)</script>).                                             web server. When both an attack request and a validation request
   Step B.4) HTTP Request Body Mutation. While GET requests                   return the same error response, HCache mistakenly assumes that
typically lack a body, some HTTP services process bodies in GET               the error request was cached. In order to eliminate false positives,
requests, causing abnormal behaviors like redirects or 400 error              HCache will initiate two subsequent tests of the potential WCP
responses. Additionally, rewriting methods like ‘X-HTTP-Method-               vulnerability detected after a certain period. And all discovered
Override’ can extend the attack payload. When a cache server trans-           potential vulnerabilities will be cross-validated on clients in differ-
parently forwards such requests, and the web server responds with             ent regions. Finally, we also manually verified the discovered WCP
an exception consequently, it becomes susceptible to WCP.                     vulnerabilities.
   Step B.5) Other Illegal HTTP Request Mutation. Beyond
mutating the three main components of the HTTP request, we                    5 MEASUREMENT STUDY AND FINDINGS
crafted other illegal HTTP requests to probe WCP vulnerabilities,             5.1 Data Collection
examining the effects of overly long headers and invalid characters.
   Cache Buster. To finalize the test requests for WCP, we em-                Our work use Tranco Top 1,000 domains as seeds, and extracts
ployed a cache buster with two objectives: on the one hand, mod-              a total of 114,560 subdomain information, among which 31,350
ifying the value of the cache buster avoids interactions between              surviving websites can be accessed via HTTP(S). On this basis,
targeting the same URL and prevents invalidation caused by new                more resource is crawled on these websites by the crawler, thus
attack requests hitting the previous cache. On the other hand, it en-         expanding the target domains to 4,427,590 different URL links. To
sures that normal user requests do not trigger responses poisoned             increase the testing efficiency, URLs with similar paths are de-
by our tests, as they do not carry our randomly generated cache               emphasized during the experiment, and finally, 1,417,004 URL links
buster.                                                                       are obtained. Then, the websites that contain the cache identity
                                                                              header in the HTTP response packet are selected as targets for
                                                                              testing. A total of 22,114 domains containing 51,596 different URL
4.4     Stage C. Cache Poisoning Detection                                    links were tested in this chapter. Then we conducted detection
Under this component, HCache first initiates WCP detection for                measurements from 7 different VPS servers across the world, such
each URL in the pending list, then analyzes the response to identify          as New York, Frankfurt, Sydney and Tokyo. For each detected case,
vulnerabilities. HCache performs multiple rounds of WCP testing               multiple repeated experiments are conducted across different geo-
rapidly using multi-threading, encompassing request generation,               locations to eliminate accidental false positives that may arise. In
response analysis, and cache poisoning validation.                            the end, more than 1,300 websites were found to have web cache
   Step C.1) Detecting Request Generation. This module is used                poisoning (WCP) vulnerabilities, containing 1,556 different URL
to generate three HTTP requests, which are normal request, attack             links.
request and validation request. The normal request is obtained by
adding the request parameter A to the standard request generated in
                                                                              5.2    Cache Key Detection
Step B.1), which aims to check whether the cache buster is effective          To prevent the poisoned cache from affecting normal users during
and collect the normal response of the target website for subsequent          testing, we use a cache buster to isolate the cache. The test request
analysis. The attack request is obtained by adding the different              must carry a crafted cache key different from the normal user’s
request parameter B from the test cases generated in the previous             request, and the cache key used for the cache buster should be
stage. The validation request is similar to the normal request, the           "irrelevant" and its modification must not affect the normal response
only difference is it has the same request parameter B as the attack          content. To this end, we designed a pre-experiment on cache key
request.                                                                      detection to find the best cache buster.
   Step C.2) Response Difference Analysis. HCache identifies                     We determine which fields are commonly used as cache keys by
potential WCP by analyzing differences between the response re-               modifying different parts of the HTTP request. From all the cachable
turned by a normal request and an attack request. It assesses three           URLs detected, URLs were randomly selected for each accessible
types of information: a) whether the status code of the HTTP re-              domain of the Tranco top 1,000. In most cases, if the parameter
sponse has changed; b) whether the length of the HTTP response                cannot be recognised by the server, it will ignore without affecting
body has changed; c) whether the HTTP response contains addi-                 the corresponding content, indicating that the request parameter is
tional content of the poisoning request compared with the normal              a kind of effective cache buster. It will be used in the subsequent
request. If one of the above conditions occurs, HCache determines             large-scale cache poisoning measurement to avoid affecting the
that the target server may be threatened by WCP.                              normal user’s access.
   Step C.3) Poisoning Validation. When HCache finds a website
that may have WCP vulnerabilities, it will use the validation request         5.3    Overview
to verify if the cache will be poisoned. This validation request is           We conducted large-scale WCP detection experiments on popular
sent within 1 second to verify that the WCP vulnerability can be              websites on the Internet, and found 1,354 WCP vulnerabilities,
successfully exploited. If the website is vulnerable, the validation          affecting some world-famous websites, which have high Tranco




                                                                        457
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                            CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


                                                 Table 1: Newly discovered attack vectors by HCache

                                   Type                      Common Attack payloads                                 Vulnerable Websites*
                                                             X-Request-Id: 123456789                                              wikia.com
                                                             Fastly-Client-Ip: 123456789                                       fandom.com
                                                             Gpt-Tags-Enabled: 123456789                                          ipage.com
                     Internal Route Header Attack
                                                             X-Amz-Request-Id: 123456789                                      stanford.edu
                                                             Fastly-Soc-X-Request-Id: 123456789                                domain.com
                                                             X-Amz-Website-Redirect-Location: 123456                         marriott.com
                                                             Auth-Key: 123456789                                                 sinaimg.cn
                                                             X-Auth-User: 123456789                                                 bing.com
                  HTTP Identification Header Attack          Authorization:123456789                                            wsimg.com
                                                             X-Authorization: 123456789                                      ziffdavis.com
                                                             Client-Proxy-Auth-Required:123456789                               ccmbg.com
                                                             If-Match: 123456789                                                      usa.gov
                                                             If-Range: 123456789                                                      aig.com
                         HTTP If Header Attack
                                                             If-None-Match: 123456789                                        bluehost.com
                                                             If-Modified-Since: 123456789                                   starbucks.com
                                                             X-Forwarded-SSL: on/off/nonsense                                   pcmag.com
                                                             X-Forwarded-Scheme: nothttps/http(s)                                  cisco.com
                     HTTP Protocol Header Attack
                                                             X-Forwarded-Proto: http(s)/ssl/nonsense                        mashable.com
                                                             X-Forwarded-Protocol: http(s)/nothttps/nonsense              getflywheel.com
                                                             Range: bytes=cow                                                       stats.com
                                                             Range: bytes=9-4                                                   miele.co.nz
                      HTTP Range Header Attack
                                                             Range: bytes=-1024,0                                           starbucks.com
                                                             Range: bytes=0-,0-,0-,0-                                      chiltondiy.com
                                                             Upgrade: 123456789                                                    lefigaro.fr
                                                             Upgrade: HTTP/0.9                                               smtp2go.com
                     HTTP Upgrade Header Attack
                                                             Upgrage: Websocket, RTA/x11                                    salesforce.com
                                                             Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9                                   disney.io
                                                             Accept: 123456789                                                         fcc.gov
                                                             Accept-Encoding: 12345                                               house.gov
                      HTTP Coding Header Attack
                                                             Transfer-Encoding: error                                             europa.eu
                                                             zTRANSFER-ENCODING: asdf                                landmarkcinemas.com
                     *: The vulnerable websites in the table only show the base domain. The subdomains and paths were redacted for
                     ethical considerations.

                                           Table 2: Detection datasets and vulnerable websites statistics

                                           Initial domain name        Domain name extension        Cache pages    Cache Poisoning Vulnerabilities
          Number of domain names                    1,000                       114,560               22,114                      1,354
             Number of URLs                           -                        1,417,004              51,596                      1,556


rankings and a large amount of web traffic, as shown in Table 1                        various vendors are still not in place to protect against known
and Table 2. Besides, some websites may even have more than                            WCP attacks. In addition to the known issues, we also found that
one vulnerabilities. Once an attacker compromises these websites                       many other new HTTP fields may lead to WCP. This suggests that
through one of the identified WCP vulnerabilities, it will affect a                    any non-cache key could potentially be at risk of WCP. Protection
large number of global Internet end-users.                                             against a single attack method is not enough to fully defend against
   We compare our detection results with existing studies in Table                     the effects of WCP.
3 and Table 4. Compared with previous work, our study is more                             Figure 7 presents the distribution of vulnerable websites with
systematic and comprehensive in terms of attack vector coverage                        respect to their Tranco ranks, exhibiting a fairly uniform. This
and measurement scale, with many new attack methods and vul-                           suggests that Web Cache Poisoning is pervasive among the websites
nerabilities discovered. In total, 14 types of attack techniques are                   in our dataset with no strong connection to their popularity ranking.
discovered by HCache, 7 of which are newly discovered vectors.                            Moreover, we tested the impact of WCP in HTTP/2, using the
   Figure 6 shows the percentage of different attacks, from which                      same variant of the scanning test on websites deployed with HTTP/2.
we can find that known attacks still account for more than half                        We found that all the vulnerabilities that existed in HTTP/1.1 still
of the websites found to have WCP vulnerabilities, indicating that                     existed in HTTP/2. About 90% of the websites share caches between




                                                                                 458
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                                                       Yuejia Liang et al.


Table 3: Number of websites with ≥ 1 vulnerabilities found                                                            5.4    Findings
by HCache
                                                                                                                      We present an overview of our findings about attack vectors. We
                                                                                                                      identified 14 types of attack vectors that could lead to cache poison-
                                                   Attack type                                  Number                ing, among which 7 types are newly discovered. Table 1 shows the
                                                   Internal Route Header Attack                          237          new attack vectors we discovered and lists some specific payloads
                                                   Identify Header Attack                                118          that can cause poisoning as well as the affected websites.
                                                   If Request Attack                                      79              Internal Route Header Attack. A CDN is a large distributed
        New Attack Vectors                         Protocol Header Attack                                 69          network with a large number of internal nodes that perform dif-
                                                   Range Request Attack                                   46          ferent transmission and caching functions. Therefore, CDNs also
                                                   Upgrade Request Attack                                 25          implement some special headers to pass routing information during
                                                   Coding Header Attack                                   19          internal transmission. Attackers can abuse these headers to trigger
                                                   HTTP Header Oversize (HHO)                            269          CDNs to throw exceptions, ultimately leading to WCP. These head-
                    Vectors in CPDoS               HTTP Method Override (HMO)                            149          ers include Fastly-Client-Ip, Fastly-Soc-X-Request-Id, X-Amz-Website-
                                                   HTTP Meta Character (HMC)                              56          Redirect-Location, X-Amzn-CDN-Cache, etc. This is the attack found
                                                   Forwarded Header Attack                                 96         to affect most websites besides the HTTP Header Oversize Attack,
                                                   HTTP Parameter Attack                                   84         with 234 websites affected.
                     Vectors in Blogs                                                                                     HTTP Authentication Header Attack. In certain APIs or gate-
                                                   Fat Get Request Attack                                  67
                                                   Blacklist Attack                                        40         way systems, authenticating HTTP requests is a common require-
                                                                                                                      ment. Some services use headers like Authorization, X-Auth-User
                                                                                                                      and Auth-Key for this purpose. An attacker can exploit this by send-
               Upgrade Request Attack 2%                            Coding Header Attack 1%                           ing a request to the cache server with these headers. The cache
             Range Request Attack 3%
         Protocol Header Attack 5%
                                                                              HTTP Header Oversize 20%                server forwards them to the web server. The web server finds that
          If Request Attack 6%                                                                                        the value of the header is illegal and returns a response with a
 Identify Header Attack 9%
                                                                                                                      denial of access. The cache server retains the incorrectly cached
                                                                                   HTTP Method Override 11%
                                                                                                                      resource, returning it for equivalent requests. HCache found 118
                                                                                                                      websites have this problem.
                    Internal Route Header…
                                                                                   Forwarded Header Attack 7%             HTTP Protocol Header Attack. Cache servers use headers like
                                                                                 HTTP Parameter Attack 6%             X-Forwarded-SSL, X-Forwarded-Scheme, X-Forwarded-Proto, and X-
                                 Blacklist Attack 3%
                                                                             Fat Get Request Attack 5%
                                                              HTTP Meta Character 4%
                                                                                                                      Forwarded-Protocol to identify client connection protocols. However,
                                                                                                                      these headers may impact web server processing. Some servers
                                                                                                                      respond with a 301 redirect. If the redirect request retains these
                          Figure 6: Impact ratio of different attack vectors
                                                                                                                      headers and redirects to the URL itself, it causes a DoS attack due
                                                                                                                      to excessive redirects. As per the HTTP standard, 301 responses
                    25                                                                                                are cached, leading victims to hit the cache. In this scenario, if
                                                                                                                      an attacker utilizes headers such as X-Forwarded-Host to control
                    20
                                                                                                                      the redirected link address, it becomes easy to direct victims to a
                                                                                                                      malicious site for subsequent attacks. A total of 69 websites are
                                                                                                                      vulnerable.
 Vulnerable Sites




                    15
                                                                                                                          HTTP Range Header Attack. Clients utilize the Range header
                                                                                                                      to request specific portions of a resource, widely supported by
                    10                                                                                                most intermediate servers for tasks like multi-threaded downloads.
                                                                                                                      However, certain web servers lack support, leading to potential
                      5                                                                                               semantic differences with cache servers. Some web servers may
                                                                                                                      support Range requests but report errors when processing mal-
                      0                                                                                               formed ones (e.g. Range: bytes=100-90). HCache found 46 websites
                             100     200     300       400    500     600
                                                             Tranco Rank
                                                                             700     800      900   1000
                                                                                                                      have this problem.
                                                                                                                          HTTP If Header Attack. HTTP standard headers like If-Match,
                                                                                                                      If-Range, and If-Modified-Since determine if a web server meets spec-
Figure 7: Distribution of vulnerable websites in Tranco rank-
                                                                                                                      ified conditions. However, HCache discovered some web servers
ing
                                                                                                                      generate 4xx or 5xx errors when processing these requests. If the
                                                                                                                      cache server caches this status code, it will result in WCP. HCache
                                                                                                                      found 79 websites have this problem.
HTTP/1.1 and HTTP/2, i.e., after sending an HTTP/1.1 request to                                                           HTTP Upgrade Header Attack. HTTP protocol allows up-
poison a cache, a normal HTTP/2 request afterward will still hit                                                      grading an established connection to a new, incompatible protocol
the poisoned cache, and vice versa. This suggests that an HTTP/2                                                      using mechanisms like Upgrade: Websocket. If an attacker initiates
to HTTP/1.1 transition may have occurred, implying that attacks
targeting HTTP/1.1 could affect services utilizing HTTP/2.




                                                                                                                459
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                               CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


                                                      Table 4: Comparison with existing research

                   Research                              Attack Vector                                   Target                             Vulnerable Websites
               CPDoS [27]                             HHO HMO HMC                                      Alexa top 500                                   12
    Redefining Unexploitable blog[16]                 Forwarded Attack                                Manual testing                                  11*
  Novel Pathways to Poisoning blog [17]          Para, Blacklist, and Fat GET                         Manual testing                                   8*
                Our work                              14 types of attack              Tranco top 1,000 domains and their subdomains                  1,354
    *: The authors did not fully disclose the number of vulnerabilities in their blogs, and the statistics in the table are derived from the cases in their
    report.


an unsupported upgrade request (e.g., Upgrade: HTTP/3.0) or a mal-                      against vulnerable websites. HCache found 56 websites vulnerable
formed one (e.g., Upgrade: HTTP/0.9), web server may return an                          to this attack.
incorrect status code, potentially leading to a WCP. HCache found                          Fat GET Attack. Cache servers usually cache GET requests by
25 websites have this problem.                                                          default, excluding the HTTP request body as a cache key. Despite
   HTTP Coding Header Attack. The HTTP protocol uses head-                              the HTTP standard prohibiting GET requests from having a body,
ers like Accept, Accept-Encoding, and Transfer-Encoding to identify                     some web applications parse fat GET request bodies, allowing dy-
encoding formats. If an attacker sets a malformed or illegal value                      namic responses. This opens the door to WCP. HCache enhances
in these headers, it may trigger an exception at the web server,                        detection with headers like X-HTTP-Method-Override, expanding
potentially resulting in WCP. HCache found 19 websites have this                        the attack vector. The web server, influenced by X-HTTP-Method-
problem.                                                                                Override, treats the request as a POST, attempting to generate a
   What’s more, HCache also found many websites have known                              dynamic link from the body. The cache server, ignoring this, uses
attacks. Although these attacks have been presented in previous                         the cache key of the original GET request and URL. When a user
articles[16, 17, 28], they still account for more than half of all vul-                 triggers a regular request hitting the attacker’s tainted cache, con-
nerabilities, so it is necessary to analyze how such attacks are                        tent hijacking occurs. HCache found 67 websites has this problem.
exploited.                                                                                 HTTP Parameters Attack. There are many applications that
   HTTP Header Oversize Attack. The HTTP protocol standard                              choose to extract parameter values from requests to dynamically
does not impose a limit on the length of the request header. There-                     generate response content. If the web server uses the values in the
fore, different Web middleboxes implement different restrictions.                       request parameters to dynamically generate content, and the web
A DoS attack may exist if the request length allowed by the cache                       server does not perform any filtering on the string, an attacker can
server exceeds the limitations of the web server. An attacker can                       construct an XSS attack payload to launch an attack. If the cache
initiate an HTTP request with a length between the cache server                         server’s cache key does not contain the request parameter fields
and web server. The cache server forwards the malicious request to                      in the URL, the cache is hit when a normal user initiates a request,
the web server, and an error response triggered at the web server                       resulting in malicious cache samples being distributed to the client,
that would have resulted in a DoS attack had it been cached by                          ultimately causing an XSS attack. Similar flaws were found on 84
the cache server. Although this vulnerability is a known one and                        websites.
has been disclosed for many years, it still affects the most targeted                      HTTP Forwarded Header Attack. Reverse proxies (e.g., load
websites with a total of 269.                                                           balancers, CDNs) rely on routing host information to determine
   HTTP Method Override Attack. HTTP defines request meth-                              the web server for fetching web resources. RFC7239 introduces
ods like GET, POST, DELETE, and PUT. Some systems only support                          the Forward header for this purpose. However, headers like Host,
GET and POST. To overcome this, web frameworks use helper head-                         X-Forwarded-Host, X-Forwarded-Port, and Forwarded are commonly
ers like X-HTTP-Method-Override. Attackers may exploit this by                          used by reverse proxies to identify the original routing host. This
sending a GET request with an override field set to DELETE. If the                      can be exploited for WCP. Attackers can manipulate these headers
server doesn’t handle DELETE requests, it returns a 405 error. As                       to control the cache server’s routes back to the source, potentially
per RFC9110, cache servers cache this error, causing subsequent                         causing the cache server to read malicious data or the web server
equivalent requests to result in a DoS attack. A total of 149 websites                  to reject responses. As these headers are not part of the cache key,
were found to have this issue.                                                          victims may unwittingly hit the attacker’s poisoned cache, leading
   HTTP Meta Character Attack. This attack utilizes a request                           to an attack. HCache found 96 websites have this vulnerability.
header with harmful metacharacters, exploiting semantic differ-                            Blacklist Attack. WAFs often use blacklists to block malicious
ences between the cache server and the web server. The cache                            traffic. HCache explores three blacklisting mechanisms: manipulat-
server may tolerate certain special characters, forwarding them,                        ing User-Agent with security scanners (e.g., sqlmap) and crawlers
while the web server, processing the request, triggers an error page,                   (e.g., Crawler), inserting known phishing site domain names (e.g.
resulting in a DoS attack. Metacharacters involved could include                        spam.com) into the Referer header, and randomly adding common
control characters like newline (\r), carriage return (\n), or any                      attack payloads (e.g. <script>alert(1)</script>) to certain headers.
Unicode control character. Attackers leverage this to launch WCP                        HCache exploits inconsistencies in blacklist support between cache




                                                                                 460
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                Yuejia Liang et al.


server and web server. An attacker sends a request with a mali-                generates a response using the request parameters or request body,
cious string, triggering an exception on the web server. The web               but the cache server caches these dynamically generated responses
server’s WAF responds with a 403 Forbidden Access. The cache                   as static pages. Therefore, the attacker can inject malicious XSS
server incorrectly caches the resource, blocking even normal users             payloads into the response. HCache found that some websites will
from accessing the target site. HCache found 40 websites have this             include parameters or request body in the response. Our further
problem.                                                                       validation revealed that some websites do not filter request con-
                                                                               tent and can inject XSS payloads. edu.sina.com.cn, in.ign.com and
6     THREAT ANALYSIS                                                          blackfriday.com have such vulnerabilities.
The victim website can suffer from various losses, such as reputation             Cache Poisoned Arbitrary URL Redirection. Previous re-
degradation, supply chain attacks, or even monetary loss. In this              search found X-Forwarded-Host can be used to control the actual re-
paper, we further categorized these WCP vulnerabilities based on               sponse page, but our results show that when websites receive these
the specific attacking threats. Table 5 shows the vulnerabilities that         headers containing unknown URLs (such as X-Forwarded-Host: at-
can result from different types of attacks.                                    tack.com), they will ignore them or return an error response such as
                                                                               400 Bad Request. It suggests that many websites have already fixed
    Table 5: Threats that stem from different attack vectors                   this vulnerability. However, we newly discovered X-Forwarded-
                                                                               Proto header can re-establish the connection, and will return 301
                                                DoS     XSS   AUR*             redirect responses. Combined with the X-Forwarded-Host header,
                                                                               the redirected page can be controlled, resulting in an arbitrary page
          Internal Route Header Attack           !                             redirect attack. The attacker can implement subsequent higher-
          Identify Header Attack                 !                             order attacks if the victim accesses the attacker-controlled page.
          If Request Attack                      !                                Take one of the subpages in themeforest.net as an example. First,
          Protocol Header Attack                 !             !               we establish an HTTPS connection with it. Then we can send
          Range Request Attack                   !                             a request with X-Forwarded-Scheme: http and X-Forwarded-Host:
          Upgrade Request Attack                 !                             attack.com. The former changes the protocol to HTTP and returns
          Coding Header Attack                   !                             a redirection response, while the latter specifies the response’s
          HTTP Header Oversize (HHO)             !                             location, redirecting to an attacker-controlled website. 301 Moved
          HTTP Method Override (HMO)             !                             Permanently is cached by the cache server, causing subsequent
          HTTP Meta Character (HMC)              !                             victim requests to be redirected to attacker-controlled pages as
          Forwarded Header Attack                !      !      !               well.
          HTTP Parameter Attack                         !
          Fat Get Request Attack                        !
          Blacklist Attack                       !
                                                                               7 DISCUSSION
            *AUR: Arbitrary URL Redirection
                                                                               7.1 Responsible Disclosure
   Cache Poisoned Denial of Service. DoS attack is the most                    We try our best to responsibly disclose the related vulnerabilities
basic attack that can be caused by web cache poisoning (WCP). It               to the vendors of affected websites. First, we actively contacted the
can be caused by simply constructing an attack request that triggers           affected vendors through several third-party vulnerability disclo-
an error at the web server. We found that even though CPDoS has                sure platforms (e.g., Hackerone, Bugcrowd, and Intigriti), discussing
been disclosed for many years, there are still many websites that              the security issues and related mitigations. Second, we have sent
are subject to such attacks, such as harvard.edu, taobao.com, mail.ru,         notification emails to the administrators of the affected websites,
and huawei.com.                                                                disclosing the vulnerabilities and the specific detection methodolo-
   We have also found many other HTTP headers that can lead to                 gies. According to the rank of vulnerable websites, we summarize
DoS attacks. All of the 7 new attack vectors discovered by us can              the related responses to responsible disclosure below:
cause service inaccessibility on subdomains of adobe.com, intuit.com,             Microsoft microsoft.com (6th in Tranco Top 1,000): Responded
skype.com, and sina.com.cn, etc. A common feature of this type of              that they have shared the report with the inner responsible team,
attack is that the cache server does not comply with the RFCs                  and they will take appropriate actions as needed to help their cus-
and caches error status codes that should not be cached. Even if               tomers be well protected.
the RFCs were followed, X-HTTP-Method-Override: NONSENSE can                      AliBaBa taobao.com (23th in Tranco Top 1,000): Confirmed and
be used to poisonvisualstudio.microsoft.com with 405 Method Not                patched the discovered DoS attack vulnerability, assessed the vul-
Allowed. nvidia.com and sap.com will return 404 Not Found when                 nerability as Medium Critical, providing a vulnerability bounty of
processing a request with X-Forwarded-Host: attack.com. Both 404               about 100$.
and 405 response status codes are heuristically cacheable in RFC.                 Adobe adobe.com (65th in Tranco Top 1,000): Confirmed the vul-
   Cache Poisoned Cross-Site Scripting.An attacker can exploit                 nerability and discussed the scope of the attack. They responded
these WCP vulnerabilities to launch beyond DoS attacks on vic-                 that they are evaluating the vulnerability internally and will provide
tim websites. When exploited in conjunction with other attacking               a fix for the vulnerability in the near future.
techniques, it may also lead to more severe damage. In fat GET                    NetEase 163.com (187th in Tranco Top 1,000): Rated the vulnera-
attack and request parameter attack, the web server dynamically                bility as Medium Critical.




                                                                         461
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                            CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


   Yelp yelp.com (207th in Tranco Top 1,000): Thanked for the results                  the RFCs, and returning other status codes directly for requests
of this research and acknowledged the issues identified in this                        that should not be cached.
paper. They will continue to monitor the subsequent impact of the                         Enhance exception handling at the web server: Based on our find-
vulnerability and fix the issue when appropriate.                                      ings, an attacker can proactively trigger error responses at the
   Mashable mashable.com (426th in Tranco Top 1,000): Confirmed                        website web server, which results in WCP. Thus, to avoid returning
the vulnerability and highly praised the work, and suggested look-                     an error response for malformed HTTP requests, we suggest the
ing deeper into the potential harm of the attack, such as using                        website server enhance a good exception handling design, which
the ‘X-Forwarded-Host’ header to discover more vulnerable assets                       just ignores the problematic request headers and returns a benign
internally.                                                                            response instead, or directly returns an error code indicating that
   HuaWei huawei.com (537th in Tranco Top 1,000): Confirmed                            the response should not be cached by any on-path cache servers.
this problem and agreed that it was caused by irregularities in the                    Thus, normal users still obtain the correct response, invalidating
Nginx cache configuration. They rated our reported vulnerability                       WCP.
as Medium Critical and awarded about 200$ for the vulnerability.                          Disable caching of dynamic resources: Web caching should only
   SAP sap.com (969th in Tranco Top 1,000): SAP has released the                       be applied to accelerate static resources, not dynamically generated
fix for this issue, and they offer acknowledgment by publishing our                    pages. Therefore, caching should be disabled for resources that
team information on its webpage.                                                       need to be dynamically generated according to request parameters.
   Knowyourteam: They specifically thanked the researcher for                          HCache has found that, although resources (such as CSS and JS)
the vulnerability report and have started the vulnerability remedia-                   are normally categorized as static resources, some websites gen-
tion process. Also added our team to the list of vulnerability-fixing                  erate these resources using dynamic templates, actually turning
acknowledgments and gave some vulnerability bounty 100$.                               these static-looking resources into dynamic resources. Hence, the
   Street Context: They rated the vulnerability found in this paper                    best way to fix this is to directly change these resources to static
as Medium Critical and awarded about 300$ for the vulnerability.                       resources. If this dynamic generation feature is essential for the
   VidaXL: They thanked the work of this paper and considered it                       website operation, we suggest clearly indicating the dynamic nature
valuable research. They evaluated our discovered vulnerabilities as                    of these resources to disable the caching behavior. Besides, the web-
High Risk and gave a vulnerability reward of about 300$.                               site can also add various XSS filters to proactively defend against
   BlackFriday, Asana, YoYoGames, Ziff Davis, Nutanix, Star-                           WCP resulting from the dynamically generated web content.
bucks, WP Engine: Acknowledged and thanked us for the vul-                                Reduce the caching time of error pages: The caching system can
nerability report and advised that “The issue has been identified                      also reduce the impact by only caching error response within a
internally and is in the process of being fixed”.                                      short time, such as 1 second. This approach can proactively limit the
                                                                                       effective time of WCP and greatly increase the attacking difficulty.


7.2     Mitigation
WCP is a complex and severe security problem, it is not a vulnera-                     7.3    Limitation
bility within a single caching system, but rather the vulnerability of                 Due to the complexity of WCP and the scale of our measurements,
parsing differences between multiple caching systems. As a result,                     our work still has the following limitations, which can be further
traditional static analysis and white-box testing techniques on a                      optimized in future works.
single system are difficult to detect and eliminate the problem. A                        Testing scope. Our research only analyzes individual websites
recommended solution is to employ several methods together in                          from the top 1,000 Tranco domains. However, our proposed tool
production environments to minimize the cache poisoning problem.                       HCache is also applicable to wider measurement, which apparently
   Add additional headers as the cache key: From our discoveries,                      can further reveal the severe threat of WCP on the Internet.
when exploiting headers that have not been implemented as the                             Detection on caching behaviors. HCache detection presupposes
cache keys within the caching systems, such as ‘X-HTTP-Method-                         that the target caching system adopts relevant header identifiers
Override’ and ‘X-Forwarded-Host’, a successful web cache poisoning                     for cache operations. However, there are still some cache servers in
(WCP) happens. Therefore, it is applicable and beneficial to enforce                   real web environments that do not use such identifiers. Therefore,
these headers as the cache keys within the caching systems. With                       the websites covered by the tests in this chapter are a subset of
this mitigation, even if the attacker has successfully poisoned the                    websites running cache servers in the real world.
cache with an error response, this poisoned cache is only private                         Evaluation on web pages with crucial functionality. HCache does
to the specific request with the problematic headers. As a normal                      not consider user permissions in detecting WCP. Commonly, web-
request does not contain the problematic header, it will not hit the                   sites have service-critical or data-sensitive pages that are only ac-
poisoned cache thus invalidating the attack.                                           cessible to users that require log in, while which are not included in
   Adhere to the RFC specifications: Most vulnerabilities found by                     our work. We believe more severe threats can be discovered when
the HCache are caused by the caching of error responses that are                       further works incorporate the detection of login-related web pages.
maliciously triggered by attackers, while these caching behaviors                         Measurements of poisoning techniques. Our work mainly focuses
are implementation-specific and not specified by the related RFCs.                     on the well-known WCP that mostly threatens the Internet, thus
Therefore, the effective mitigation is to strictly follow the RFC                      HCache’s request variant module is based on four types of variant
standards, only caching the error status codes that are allowed by                     patterns defined by expert knowledge. Although our framework




                                                                                 462
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                                             Yuejia Liang et al.


has attempted to include various attacking techniques as much as                   Two detection tools are most relevant to the work in this paper.
possible, there may still be WCP that HCache does not cover.                    One is Param Miner[15], designed by James Kettle, which is used
                                                                                to scan whether some headers and parameters are included in
7.4     Ethical Consideration                                                   cache keys to detect potential WCP. Another one is Web Cache
                                                                                Vulnerability Scanner[9], which summarizes some of the previously
In this study, we have taken our uttermost care to avoid any ethical
                                                                                proposed methods of WCP, and allows for the detection of known
concerns both in the design and implementation.
                                                                                attack methods. HCache works as a superset of these two tools,
   For security concerns, the exception requests generated by
                                                                                it analyses the request line, request header, and request body of
our tests conform to the HTTP syntax specification and are only
                                                                                an HTTP request to generate corresponding test cases that can
likely to cause the web server to return an incorrect response and
                                                                                comprehensively test the different aspects of WCP.
then close the connection, without affecting the normal operation
                                                                                   Since James Kettle demonstrated the severity and prevalence of
of the server. We use cache buster to avoid the impact on normal
                                                                                request smuggling in 2019, researchers have come up with several
users; the request parameters of the test request are randomly
                                                                                tools to detect attacks on request smuggling[2, 5, 29]. T-reqs is
generated, and normal user requests will not hit the poisoned cache
                                                                                a novel grammar-based differential fuzzer to test HTTP request
because of the different cache key. In addition, our tests found that
                                                                                smuggling[12]. Frameshifter aim to discover the security impli-
most of error responses have much shorter cache times relative
                                                                                cations of HTTP/2-to-HTTP/1 conversion anomalies[11]. Large-
to normal responses, and unlike an attacker continuously sending
                                                                                scale measurements of web cache[27], HTTP(S)[3, 23], CDN[13]
attack requests to poison the cache, our experiments sent only one
                                                                                e-mails[35] or other web attacks[25], provides insights into the
attack request, thus the poisoned caches will not survive for more
                                                                                current security problems on the Internet, allowing us to better
than 10 minutes according to the cache time in all experiments.
                                                                                address potential security risks. To our knowledge, our work is
Further, to ensure that the poisoned caches will not continue to
                                                                                the first large-scale examination of the WCP attack, revealing the
exist, we sent normal requests to each potentially poisoned site after
                                                                                prevalence of this threat on the Internet.
our experiments, to make sure that the caches had been refreshed
                                                                                   In addition to WCP, cache servers, especially CDN, have other
to normal responses. For performance concerns, we filtered a large
                                                                                security issues. Its working mechanisms can also bring WCP [1, 24],
number of target URL links using URL similarity detection. We
                                                                                DoS attacks[8], or other forms of attacks[7, 21, 22]. Compared to
strictly limit the request rate, a single URL to 5 requests per second,
                                                                                the above research on "forwarding", our work focuses on "caching",
which will not place an excessive performance load on the websites
                                                                                revealing the pervasive security risks posed by the inconsistent
and CDNs.
                                                                                processing of requests between websites and cache servers. Our
   For privacy concerns, only URL information related to cache
                                                                                work highlights this widespread systemic problem, which can mo-
poisoning was captured and analyzed, and no privacy data of the
                                                                                tivate cache vendors and webmasters to properly implement and
target website was saved locally, nor was any content of the tar-
                                                                                configure the caching, strictly adhering to HTTP standards specifi-
get website indexed and otherwise made public. In addition, we
                                                                                cations.
use an HTTP header (User-Agent) embedded with our research
purpose and contact information during the scanning process. If
                                                                                9    CONCLUSION
website administrators notice any adverse effects caused by the
automated scanning on their websites, they can timely contact us,               Web cache poisoning (WCP) has been a significant threat on the
and we will promptly cease the automated scanning of the target                 Internet, however, it still lacks a global view of the severe impact at
website. We strictly followed the principle of responsible disclosure           scale. We have proposed a systematic measuring platform HCache,
to report discovered vulnerabilities to affected websites, by actively          which enables a large-scale evaluation of WCP threats on the real-
contacting through various channels such as email and third-party               world Internet. Based on Tranco Top 1K domains and their sub-
security disclosure communities. The case mentioned in the article              domains, we have discovered more than 1,000 websites across 172
has already been fixed.                                                         domains (17% of measured domains) with WCP vulnerabilities. Our
                                                                                work first reveals that WCP threat is a widespread security issue on
                                                                                the Internet, and discloses that WCP threat still exists in the new
8     RELATED WORK                                                              incoming protocols. We have responsibly reported the vulnerabili-
Our research focuses on web cache poisoning (WCP) caused by                     ties to the affected websites, receiving acknowledgments and over
non-cache keys in HTTP requests, and delves deep into various                   $1,000 bug bounties from world-famous companies such as Adobe,
details of actual poisoning attacks and exploits. In addition, there            Alibaba, Huawei, and Microsoft.
are several other attacking tricks to perform WCP or to exploit
cache flaws for other purposes. Host-of-Trouble attack exploits                 ACKNOWLEDGMENTS
inconsistencies in the parsing of the host header in HTTP requests              We sincerely thank all anonymous reviewers and our shepherd for
between the cache server and the web server, to perform WCP and                 their insightful and constructive feedback to improve the paper.
WAF bypassing[1].                                                               This work is supported by the National Natural Science Foundation
   HTTP Desync Attack poisons the cache by smuggling an addi-                   of China (grant #62272265).
tional request to disrupt the responses with malicious payloads[14,
18, 20]. WCD tricks a web cache into erroneously storing sensitive              REFERENCES
content, thereby making it widely accessible on the Internet[4, 24,              [1] Jianjun Chen, Jian Jiang, Haixin Duan, Nicholas Weaver, Tao Wan, and Vern
25].                                                                                 Paxson. Host of troubles: Multiple host ambiguities in http implementations. In




                                                                          463
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                                              CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


     Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications                  [18] James Kettle. Http desync attacks: Smashing into the cell next door. Black Hat
     Security, pages 1516–1527, 2016.                                                                   USA, 2019.
 [2] Evan Custodio. Smuggler. https://github.com/defparam/smuggler, 2020.                          [19] Amid Klein. Divide and conquer. HTTP Response Splitting, Web Cache Poisoning
 [3] Zakir Durumeric, James Kasten, Michael Bailey, and J Alex Halderman. Analysis                      Attacks and Related Topics, Sanctum whitepaper, 2004.
     of the https certificate ecosystem. In Proceedings of the 2013 conference on Internet         [20] Amit Klein. Http request smuggling in 2020–new variants, new defenses and
     measurement conference, pages 291–304, 2013.                                                       new challenges. Black Hat Briefings USA, 8, 2020.
 [4] Omer Gil. Web cache deception attack. Black Hat USA, 2017, 2017.                              [21] Weizhong Li, Kaiwen Shen, Run Guo, Baojun Liu, Jia Zhang, Haixin Duan, Shuang
 [5] Mattias Grenfeldt, Asta Olofsson, Viktor Engström, and Robert Lagerström. At-                      Hao, Xiarun Chen, and Yao Wang. Cdn backfired: amplification attacks based on
     tacking websites using http request smuggling: empirical testing of servers and                    http range requests. In 2020 50th Annual IEEE/IFIP International Conference on
     proxies. In 2021 IEEE 25th International Enterprise Distributed Object Computing                   Dependable Systems and Networks (DSN), pages 14–25. IEEE, 2020.
     Conference (EDOC), pages 173–181. IEEE, 2021.                                                 [22] Jinjin Liang, Jian Jiang, Haixin Duan, Kang Li, Tao Wan, and Jianping Wu. When
 [6] Run Guo, Jianjun Chen, Baojun Liu, Jia Zhang, Chao Zhang, Haixin Duan, Tao                         https meets cdn: A case of authentication in delegated service. In 2014 IEEE
     Wan, Jian Jiang, Shuang Hao, and Yaoqi Jia. Abusing cdns for fun and profit:                       Symposium on Security and Privacy, pages 67–82. IEEE, 2014.
     Security issues in cdns’ origin validation. In 2018 IEEE 37th Symposium on Reliable           [23] Abner Mendoza, Phakpoom Chinprutthiwong, and Guofei Gu. Uncovering http
     Distributed Systems (SRDS), pages 1–10. IEEE, 2018.                                                header inconsistencies and the impact on desktop/mobile websites. In Proceedings
 [7] Run Guo, Jianjun Chen, Yihang Wang, Keran Mu, Baojun Liu, Xiang Li, Chao                           of the 2018 World Wide Web Conference, pages 247–256, 2018.
     Zhang, Haixin Duan, and Jianping Wu. Temporal { CDN-Convex } lens: A { CDN-                   [24] Seyed Ali Mirheidari, Sajjad Arshad, Kaan Onarlioglu, Bruno Crispo, Engin Kirda,
     Assisted } practical pulsing { DDoS } attack. In 32nd USENIX Security Symposium                    and William Robertson. Cached and confused: Web cache deception in the wild.
     (USENIX Security 23), pages 6185–6202, 2023.                                                       In 29th USENIX Security Symposium (USENIX Security 20), pages 665–682, 2020.
 [8] Run Guo, Weizhong Li, Baojun Liu, Shuang Hao, Jia Zhang, Haixin Duan, Kaiwen                  [25] Seyed Ali Mirheidari, Matteo Golinelli, Kaan Onarlioglu, Engin Kirda, and Bruno
     Sheng, Jianjun Chen, and Ying Liu. Cdn judo: Breaking the cdn dos protection                       Crispo. Web cache deception escalates! In 31st USENIX Security Symposium
     with itself. In NDSS, 2020.                                                                        (USENIX Security 22), pages 179–196, 2022.
 [9] Hackmanit. Web cache vulnerability scanner. https://github.com/Hackmanit/W                    [26] Nginx. Nginx content caching. https://docs.nginx.com/nginx/admin-guide/cont
     eb-Cache-Vulnerability-Scanner.                                                                    ent-cache/content-caching/.
[10] Apache http server project. caching guide. https://httpd.apache.org/docs/2.4/ca               [27] Hoai Viet Nguyen, Luigi Lo Iacono, and Hannes Federrath. Mind the cache: large-
     ching.html.                                                                                        scale explorative study of web caching. In Proceedings of the 34th ACM/SIGAPP
[11] Bahruz Jabiyev, Steven Sprecher, Anthony Gavazzi, Tommaso Innocenti, Kaan                          Symposium on Applied Computing, pages 2497–2506, 2019.
     Onarlioglu, and Engin Kirda. { FRAMESHIFTER } :fram security implications of                  [28] Hoai Viet Nguyen, Luigi Lo Iacono, and Hannes Federrath. Your cache has fallen:
     { HTTP/2-to-HTTP/1 } conversion anomalies. In 31st USENIX Security Symposium                       Cache-poisoned denial-of-service attack. In Proceedings of the 2019 ACM SIGSAC
     (USENIX Security 22), pages 1061–1075, 2022.                                                       Conference on Computer and Communications Security, pages 1915–1936, 2019.
[12] Bahruz Jabiyev, Steven Sprecher, Kaan Onarlioglu, and Engin Kirda. T-reqs: Http               [29] PortSwigger. Exploiting http request smuggling vulnerabilities. https://portswig
     request smuggling with differential fuzzing. In Proceedings of the 2021 ACM                        ger.net/web-security/request-smuggling/exploiting, 2020.
     SIGSAC Conference on Computer and Communications Security, pages 1805–1820,                   [30] Mike Reddy and Graham P Fletcher. An adaptive mechanism for web browser
     2021.                                                                                              cache management. IEEE Internet Computing, 2(1):78–81, 1998.
[13] Lin Jin, Shuai Hao, Haining Wang, and Chase Cotton. Unveil the hidden presence:               [31] Caitlin Sadowski and Greg Levin. Simhash: Hash-based similarity detection,
     Characterizing the backend interface of content delivery networks. In 2019 IEEE                    2007.
     27th International Conference on Network Protocols (ICNP), pages 1–11. IEEE, 2019.            [32] Squid. Squid: Optimising web delivery. http://www.squid-cache.org/.
[14] James Kettle. Http/2: The sequel is always worse. https://portswigger.net/resear              [33] Varnish. Varnish http cache. https://varnish-cache.org/.
     ch/http2.                                                                                     [34] w3techs. Cloudflare vs. akamai vs. fastly usage statistics. https://w3techs.com/te
[15] James Kettle. Parem miner. https://github.com/PortSwigger/param-miner.                             chnologies/comparison/cn-akamai,cn-cloudflare,cn-fastly.
[16] James Kettle. Practical web cache poisoning: Redefining ’unexploitable’. https:               [35] Chuhan Wang, Kaiwen Shen, Minglei Guo, Yuxuan Zhao, Mingming Zhang,
     //portswigger.net/research/practical-web-cache-poisoning.                                          Jianjun Chen, Baojun Liu, Xiaofeng Zheng, Haixin Duan, Yanzhong Lin, et al. A
[17] James Kettle. Web cache entanglement: Novel pathways to poisoning. https:                          large-scale and longitudinal measurement study of { DKIM } deployment. In 31st
     //portswigger.net/research/web-cache-entanglement.                                                 USENIX Security Symposium (USENIX Security 22), pages 1185–1201, 2022.
                                                                                                   [36] WordPress. Wp super cache. https://wordpress.org/plugins/wp-super-cache/.




                                                                                             464
CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA                                                                    Yuejia Liang et al.


A     CACHE IDENTIFICATION FIELD

                                      Table 6: Common caching status fields used by major service vendors


          Cache Service/Software                  Response Header               Hit                      Miss
          Azure                                   X-Cache                       TCP_HIT                  TCP_MISS
          Fastly                                  X-Cache                       HIT                      MISS
          Akamai                                  X-Cache, Server-Timing        desc=HIT                 desc=MISS
          CDN77                                   X-Cache, X-77-Cache           HIT                      MISS
          CloudFront                              X-Cache                       Hit from cloudfront      Miss from cloudfront
          UDomain                                 X-Cache-Status                HIT                      MISS
          KeyCDN                                  X-Cache                       HIT                      MISS
          Cloudflare                              CF-Cache-Status               HIT                      MISS
          GCoreLabs                               Cache                         HIT                      MISS
          ChinaCache                              X-cc-via                      *[H,*]                   *[M,*]
          Github Pages                            X-Cache                       HIT                      MISS
          Google Cloud                            cdn_cache_status              hit                      mis
          Incapsula CDN                           X-Iinfo                       ...0CNN...               ...PNNN...
          AlibabaCloud                            X-Cache                       HIT TCP_IMS_HIT          MISS TCP_MISS
          Tencent Cloud                           X-Cache-Lookup                Hit From * / Cache Hit   Cache Miss
          HUAWEI CLOUD                            X-Cache-Lookup                Hit From *               Miss From *
          Baidu AI Cloud CDN                      X-Cache-Status                HIT                      MISS
          Apache Traffic Server                   X-Cache                       HIT                      MISS
          Squid                                   X-Cache                       Hit From *               Miss From *
          Varnish                                 X-Cache                       HIT                      MISS
          Nginx                                   Cache_status, X-Proxy-Cache   HIT                      MISS
          Apache                                  X-Cache                       HIT                      MISS
          Rack Cache                              X-Rack-Cache                  Hit                      Fresh/Miss




                                                                       465
Internet’s Invisible Enemy: Detecting and Measuring Web Cache Poisoning in the Wild                CCS ’24, October 14–18, 2024, Salt Lake City, UT, USA


B    KNOWN ATTACK VECTORS

                                       Table 7: Examples of known attack vectors discovered by HCache

                            Type                      Common Attack payloads                          Vulnerable Websites*
                                                                                                                  taobao.com
                                                      X-Oversized-Header-[1-N]:                                    nvidia.com
                HTTP Header Oversize
                                                      Big-Value-000000000000...000000000000                            mail.ru
                                                                                                                dropbox.com
                                                      X-HTTP-Method: PUT                                            house.gov
                                                      X-HTTP-Method: TRACE                                          bmw.com
               HTTP Method Override                   X-Method-Override: TRACE                               mailchimp.com
                                                      X-HTTP-Method-Override: POST                               huawei.com
                                                      X-HTTP-Method-Override: DELETE                          microsoft.com
                                                      Header\uffff:1234                                       aadcoinst.com
                 HTTP Meta Character                  X-Metachar-Header: \0                                         house.gov
                                                      X-Metachar-Header: \b                                         house.gov
                                                      GET /?id=1 HTTP/1.1                                              nih.gov
                                                      X-HTTP-Method-Override: POST                               sina.com.cn
                          Fat GET
                                                      ...                                                  gouvernement.lu
                                                      attack=<script>alert(1);</script>                            adobe.com
                                                      /app?config=<script>alert(1);</script>//                        ign.com
                    HTTP Parameters                   /base.css?exp=<script>alert(1);<script>           hotelscombined.com
                                                      /index.js?utm_medium=x;callback=alert(1)//                     cdlvr.net
                                                      Host: example.com:1337                                     grab.careers
                                                      Forwarded: Host=attack.com                                     bing.com
              HTTP Forwarded Header
                                                      X-Forwarded-Host: attack.com                          blackfriday.com
                                                      X-Forwarded-Port: 1337                                yoyogames.com
                                                      Referer: spam.com                                              yelp.com
                                                      Referer: <script>alert(1)</script>                  alipayobjects.com
                          Blacklist                   Any-Header:.burpcollaborator.net                        salesforce.com
                                                      User-Agent: sqlmap/1.3.11#stable                       jfrogchina.com
                                                      User-Agent: Nmap Scripting Engine                            alipay.com
                 *: The vulnerable websites in the table only show the base domain. The subdomains and paths were
                 redacted for ethical considerations.




                                                                                 466
