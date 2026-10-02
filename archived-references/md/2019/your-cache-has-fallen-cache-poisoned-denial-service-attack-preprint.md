---
type: Whitepaper
title: "Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack (Preprint)"
description: The paper introduces Cache-Poisoned Denial of Service, where a cache forwards a request that an origin rejects and then stores the resulting error under a benign cache key. It develops method-override, oversized-header, and meta-character variants, evaluates 15 caches and numerous origin stacks, and demonstrates practical impact against websites and firmware delivery.
resource: "https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf"
tags: [whitepaper, webseclist-reference, cache-poisoning, dos, parser-differential, http, cdn, reverse-proxy, measurement-study, large-scale-scan]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T21:51:28+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf"
    title: "Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack (Preprint)"
    author: Hoai Viet Nguyen, Luigi Lo Iacono, Hannes Federrath
also_at: []
authors:
  - Hoai Viet Nguyen
  - Luigi Lo Iacono
  - Hannes Federrath
canonical_url: ""
cited_by:
  - "2019.md:28"
commit: ""
content_sha256: 16ed915d803acc19640abb3d8aa10832b9de51cf240322c55aa4ba65f7107104
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 815338db1c746ed4f04c3bc2a05cc9a622d3fc9f6d9613c958aaaf4933c2a9a9
retrieved_from: "https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf"
retrieved_kind: stored
retrieved_utc: "2026-10-02T21:51:28+00:00"
slug: your-cache-has-fallen-cache-poisoned-denial-service-attack-preprint
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack (Preprint)

**Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack (Preprint)** - Hoai Viet Nguyen, Luigi Lo Iacono, Hannes Federrath, Publisher not stated.

- Published: date not stated
- Original: <https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf>
- Preserved from: https://cpdos.org/paper/Your_Cache_Has_Fallen__Cache_Poisoned_Denial_of_Service_Attack__Preprint_.pdf (stored) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack
                Hoai Viet Nguyen, Luigi Lo Iacono                                                                    Hannes Federrath
                 Data & Application Security Group                                                        Security in Distributed Systems Group
          Cologne University of Applied Sciences, Germany                                                    University of Hamburg, Germany
             {viet.nguyen,luigi.lo_iacono}@th-koeln.de                                                    federrath@informatik.uni-hamburg.de

ABSTRACT                                                                                         1   INTRODUCTION
Web caching enables the reuse of HTTP responses with the aim                                     Contemporary distributed software systems require to scale at large
to reduce the number of requests that reach the origin server, the                               in order to efficiently handle the sheer magnitude of requests stem-
volume of network traffic resulting from resource requests, and                                  ming, e.g., from human users all over the globe or sensors scattered
the user-perceived latency of resource access. For these reasons,                                around in an environment. A common architectural approach to
a cache is a key component in modern distributed systems as it                                   cope with this requirement is to design the system in layers com-
enables applications to scale at large. In addition to optimizing                                posed of distinct intermediaries. Application-level messages travel
performance metrics, caches promote additional protection against                                through such intermediate systems on their path between a client
Denial of Service (DoS) attacks.                                                                 and a server. Common intermediaries include caches, firewalls, load
   In this paper we introduce and analyze a new class of web cache                               balancers, document routers and filters.
poisoning attacks. By provoking an error on the origin server that                                  The caching of frequently used resources reduces network traffic
is not detected by the intermediate caching system, the cache gets                               and optimizes application performance and is one major pillar of
poisoned with the server-generated error page and instrumented                                   success of the web. Caches store recyclable responses with the aim
to serve this useless content instead of the intended one, rendering                             to reuse them for recurring client requests. The origin server usually
the victim service unavailable. In an extensive study of fifteen web                             rules whether a resource is cacheable and under which conditions
caching solutions we analyzed the negative impact of the Cache-                                  it can be provided by a caching intermediate. Cached resources
Poisoned DoS (CPDoS) attack—as we coined it. We show the practi-                                 are unambiguously identified by the cache key that consists most
cal relevance by identifying one proxy cache product and five CDN                                commonly of the HTTP method and the URL, both contained in the
services that are vulnerable to CPDoS. Amongst them are prominent                                request. In case a fresh copy of a requested resource is contained in
solutions that in turn cache high-value websites. The consequences                               an intermediate cache, the client receives the cached copy directly
are severe as one simple request is sufficient to paralyze a victim                              from the cache. By this, web caching systems can contribute to
website within a large geographical region. The awareness of the                                 an increased availability as they can serve client requests even
newly introduced CPDoS attack is highly valuable for researchers                                 when the origin server is offline. Moreover, distributed caching
for obtaining a comprehensive understanding of causes and coun-                                  systems such as Content Distribution Networks (CDNs) can provide
termeasures as well as practitioners for implementing robust and                                 additional safeguards against Distributed DoS (DDoS) attacks.
secure distributed systems.                                                                         A general problem in layered systems is the different interpre-
                                                                                                 tation when operating on the same message in sequence. As we
CCS CONCEPTS                                                                                     will discuss in detail in Section 3, this is the root cause for attacks
                                                                                                 belonging to the family of "semantic gap" attacks [18]. These at-
• Security and privacy → Network security; Denial-of-service                                     tacks exploit the difference in interpreting an object by two or more
attacks; Web application security.                                                               entities. In the context of this paper the problem arises when an
                                                                                                 attacker can generate an HTTP request for a cacheable resource
KEYWORDS                                                                                         where the request contains inaccurate fields that are ignored by
HTTP; Web Caching; Cache Poisoning; Denial of Service                                            the caching system but raise an error while processed by the origin
                                                                                                 server. In such a setting, the intermediate cache will receive an error
                                                                                                 page from the origin server instead of the requested resource. In
ACM Reference Format:
Hoai Viet Nguyen, Luigi Lo Iacono and Hannes Federrath. 2019. Your Cache
                                                                                                 other words, the cache can get poisoned with the server-generated
Has Fallen: Cache-Poisoned Denial-of-Service Attack. In 2019 ACM SIGSAC                          error page and instrumented to serve this useless content instead
Conference on Computer and Communications Security (CCS ’19), November                           of the intended one, rendering the victim service unavailable. This
11–15, 2019, London, United Kingdom. ACM, New York, NY, USA, 16 pages.                           is why we denoted this novel class of attacks "Cache-Poisoned
https://doi.org/10.1145/3319535.3354215                                                          Denial-of-Service (CPDoS)".
                                                                                                    We conduct an in-depth study to understand how inconsistent
                                                                                                 interpretation of HTTP requests in caching systems and origin
                                                                                                 servers can manifest in CPDoS. We analyze the caching behavior
CCS ’19, November 11–15, 2019, London, United Kingdom                                            of error pages of fifteen web caching solutions and contrast them
© 2019 Association for Computing Machinery.                                                      to the HTTP specifications [13]. We identify one proxy cache prod-
This is the author’s version of the work. It is posted here for your personal use. Not for
redistribution. The definitive Version of Record was published in 2019 ACM SIGSAC                uct and five CDN services that are vulnerable to CPDoS. We find
Conference on Computer and Communications Security (CCS ’19), November 11–15, 2019,              that such semantic inconsistency can lead to severe security con-
London, United Kingdom, https://doi.org/10.1145/3319535.3354215.                                 sequences as one simple request is sufficient to paralyze a victim
                                                                                             1
                                                                                      private                                             shared                                            private/shared
website within a large geographical region requiring only very
basic attacker capabilities. Finally, we show that the CPDoS attack
raises the paradox situation in which caching services proclaim an




                                                                                                  Cache




                                                                                                                                                                                            Cache
                                                                               Web-                                                                                                                    Web-
increased availability and proper defense against DoS attacks while            Client                                                                                                                 Server
they can be exploited to affect both qualities.
   Overall, we make three main contributions:
    (1) We present a class of new attacks, "Cache-Poisoned Denial-                                 he                      e                 e
                                                                                                ac he)                  ch e)              ch )                            e
                                                                                                                                                                         ch e)                   e
        of-Service (CPDoS)", that threaten the availability of the web.                     al C ac                   Ca ch             Ca DN
                                                                                                                                       e .C                            Ca h
                                                                                                                                                                    e ac
                                                                                                                                                                                               ch )
                                                                                                                                                                                             Ca HE
                                                                                          rn er  c
                                                                                                                  ide y ca            n
                                                                                                                                    bo e.g                        id y c                   al AC
        We systematically study the cases in which error pages are                 nt br
                                                                                        te
                                                                                     -in ow
                                                                                                                -s
                                                                                                              nt ox
                                                                                                            ie pr               Ba
                                                                                                                                  ck (
                                                                                                                                                           rv pr
                                                                                                                                                                 s
                                                                                                                                                                - x
                                                                                                                                                              er o
                                                                                                                                                                                         rn
                                                                                                                                                                                       te HC
                                                                                                                                                                                    -in E
                                                                                 ie b                    Cl ard                                         Se rse                    er ,
        generated by origin servers and then stored and distributed           Cl we
                                                                                .g                      o rw
                                                                                                                                                         ev e                 erv che
                                                                                                                                                                             S Ca
                                                                              (e                      .f                                               .r
        by caching systems. We introduce three concrete attack vari-                              (e
                                                                                                    .g
                                                                                                                                                   (e
                                                                                                                                                     .g
                                                                                                                                                                           Su
                                                                                                                                                                             pe
                                                                                                                                                                                r

        ations that are caused by the inconsistent treatment of the                                                                                                .g
                                                                                                                                                                     . W
                                                                                                                                                                         P

        X-HTTP-Method-Override header, header size limits and                                                                                                    (e

        the parsing of meta characters.
                                                                              Figure 1: Different types of web caching systems classified
    (2) We empirically study the behavior of fifteen available web
                                                                              by location and resource access policy [31]
        caching solutions in their handling of HTTP requests con-
        taining inaccurate fields and caching of resulting error pages.
        We find one proxy cache product and five CDN services that            to permit a certain content to be saved by private caches only, it
        are vulnerable to CPDoS. We have disclosed our findings               adds the private directive to the Cache-Control header. Content
        to the affected solution vendors and have reported them to            providers which do not want that a certain response is stored and
        CERT/CC.                                                              reused by any cache have to include the keyword no-store in the
    (3) We discuss possible CPDoS countermeasures ranging from                Cache-Control header. The control directives must-revalidate,
        cache-ignoring instant protections to cache-adhering safe-            proxy-revalidate and no-cache in the Cache-Control header
        guards.                                                               instruct how to verify the freshness of a response, in case a con-
                                                                              tent is expired or no freshness lifetime information is available. All
2    FOUNDATIONS                                                              mentioned control directives enable a content provider to define
The web is considered as the world’s largest distributed system.              caching policies in an explicit manner.
With the continuous growing amount of data traveling around the                  If no explicit caching directive is present in a response, a web
web, caching systems become an important pillar for the scalability           caching system may store and reuse responses implicitly when cer-
of the web [3]. Web caching systems can occur in various in-path              tain conditions are met. One requirement which permits caches to
locations between client and origin server (see Figure 1). Another            store content implicitly is a response to a GET request. Responses to
distinction point is the classification in private and shared caches.         unsafe methods including POST, DELETE and PUT are not allowed
Private caches are only allowed to store and reuse content for                to be cached. Moreover, responses to GET method must contain
one particular user. Client-internal caches of web browsers are               defined status codes including, e.g., 200 Ok, 204 No Content and
one typical example of private cache as they store responses for a            301 Moved Permanently. Here, caches are allowed to derive a
dedicated user only. On the other hand, client-side and server-side           freshness lifetime by using heuristics. Many web applications in-
caches—also known as proxy caches—as well as CDNs deployed in                 struct web caching systems to define an implicit freshness lifetime
the backbone of the web belong to the family of shared caches, since          for images, scripts and stylesheets as these file types are consid-
they provide content for multiple clients. Some web applications              ered as static content. Static content refers to data which does not
may also include a server-internal cache. These caching systems               change frequently. Therefore, storing and reusing such resources is
usually support both access policies, i.e., they are able to serve            considered as best practice for optimizing the performance.
cached resources to multiple users or to one client exclusively.                 In some cases, it is also very useful for content providers to
    The cache policy is governed by the content provider by specify-          cache certain error messages. For instance, the status code 404
ing caching declarations defined in RFC 7234 [11]. The web caching            Not Found, which indicates that the origin server does not have
standard defines a set of control directives for instructing caches           a suitable representation for the requested resource, is permitted
how to store and reuse recyclable responses. The max-age and s-               to be cached implicitly. The 405 Method Not Allowed declaring
maxage attributes in the Cache-Control response header define,                the request action is not supported for the targeted resource can be
e.g., the maximum duration in seconds that the targeted content               cached implicitly as well.
is allowed to reside in a cache. The keyword max-age is applicable
to private and shared caches whereas s-maxage only applies to
                                                                              3        SECURITY THREATS IN WEB CACHING
shared web caching systems. Content providers can also use the                         SYSTEMS
Expires header with an absolute date to define a freshness life-              Using web caching systems provides many advantages in terms of
time. As with max-age, the Expires is adoptable for private and               optimizing communication and application performance. However,
shared caches. A stored response in a cache is considered as fresh,           much work has shown that web caches can also be exploited to
if it does not exceed the freshness lifetime specified by max-age,            affect the privacy and reliability of applications. Web cache poi-
s-maxage and the Expires header. If a content provider wishes                 soning attacks, e.g., are a serious threat that has been emerging
                                                                          2
over the past years. Amongst them is the request smuggling [24]               request to the origin server. To create a DoS attack, the authors
attack which occurs when the web caching system and the origin                send multiple requests with different random query strings to all
server do not strictly conform to the policies specified by RFC 7234.         edge cache servers within the CDN. As the edge cache servers
In this particular attack, the attacker can send a request with two           forward all of these requests to the origin server, the huge amount
Content-Length headers to impair a shared cache. Even though                  of requests reaching the origin server generates a high workload
the presence of two Content-Length headers is forbidden as per                with the consequence that the web application cannot process any
RFC 7234, some HTTP engines in caches and origin servers still                further legitimate request.
parse the request. Due to the duplicate headers, the malformed                    The root cause of almost all of the presented attacks lies in the
request is able to confuse the origin server and the cache so that a          different interpretation of HTTP messages by two or more distinct
harmful crafted response can be injected to the web caching system.           message processing entities, which is known as the semantic gap
This malicious response is then reused for recurring requests.                [18]. Vulnerabilities stemming from the semantic gap are mani-
    The host of troubles [7] attack is another vulnerability targeting        fold [7, 23, 37]. In relation to web caches the request smuggling,
shared caches. As with the previous attack, it exploits a violation           host of troubles and response splitting attacks exploit this gap be-
of the web caching standard that gets interpreted differently by              tween a cache and an origin server. Here, a discrepancy in parsing
the involved system layers. Here, the attacker constructs a request           duplicate headers or line breaks leads to cache poisoning.
with two Host headers. These duplicate headers induce a similar                   In the next section we introduce a new class of attacks against
misbehavior in the cache and origin server as the request smuggling           web caches, the Cache-Poisoned Denial-of-Service (CPDoS) attack.
attack. Likewise, a malicious response is injected to poison the              It exploits the semantic gap between a shared cache and a origin
cache.                                                                        server for poisoning the cache with error pages. As a consequence,
    Another attack that targets to poison web caches is the response          the cache distributes error pages instead of the legitimate content
splitting [23] attack. Unlike the two aforementioned vulnerabilities,         after being poisoned. Users perceive this as unavailable resources
where a flaw in the shared cache itself is one reason why the attack          or services. In contrast to the DDoS attack introduced by Triukose
is successful, the response splitting attack exploits a parsing issue         et al., CPDoS require only very basic attack skills and resources.
in the origin server only. Here, an attacker utilizes the fact that
the HTTP engine of the origin server does not escape or block line
breaks when replaying a request header value in the corresponding
                                                                              4   POISONING WEB CACHES WITH ERROR
response header. A malicious client can exploit this by dividing                  PAGES
the response in two responses. The aim of this attack is to poison            The general attack idea is to exploit the semantic gap in two distinct
the intermediate cache with the malicious content contained in the            HTTP engines—one contained in a shared cache and the other in an
second response.                                                              origin server. More specifically, the baseline of the newly introduced
    James Kettle [22] presented a set of cache poisoning attacks              variant of web cache poisoning takes advantage of the circumstance
which result from a misbehavior in web application frameworks                 that the deployed caching system is more lax or focused in process-
and content management systems respectively. With the intro-                  ing requests than the origin server (see Figure 2). An attacker can
duced techniques, James Kettle was able to compromise shared web              make use of this discrepancy by including a customized malicious
caching systems of well-known companies.                                      header or multiple harmful headers in the request. Such headers
    All introduced attacks aim at poisoning shared caches with ma-            are usually forwarded without any changes to the origin server. As
licious content that gets served by the victim caches for recurring           a consequence, the attacker crafted request runs through the cache
requests of benign clients. Private caches such as the web browser            without any issue, while the server-side processing results in an
cache are not affected by the mentioned attacks. However, browser             error. Henceforth, the server’s response is a respective error, which
caches are not immune to this class of attacks. Jia et al. [19] present       will be stored and reused by the cache for recurring requests. Each
browser cache poisoning (BCP) attacks. In their study they find               benign client making a subsequent GET request to the infected URL
that many desktop web browsers are susceptible to BCP attacks.                will receive a stored error message instead of the genuine resource
    The web cache deception [15] attack targets to poison a shared            form the cache.
cache with sensitive content. Here, the attacker exploits a RFC 7234             It is worth noting that one simple request is sufficient to replace
violation of a shared cache which still stores responses even though          the genuine content in the cache by an error page. This means that
it is prohibited. In combination with an issue in the request rout-           such a request remains below the detection threshold of web appli-
ing of the origin server, the author was able to retrieve account             cation firewalls (WAFs) and DDoS protection means in particular,
information of third parties out of the cache.                                as they scan for large amounts of irregular network traffic.
    Triukose et al. [39] showed another attack vector that utilizes              The consequences for the web application depend on the content
web caching systems to paralyze a web application. Unlike the                 being illegitimately replaced with error pages. It will always affect
presented threats, this attack does not intend to poison a cache with         the service’s availability—either parts of it or entirely. The most
harmful content or to steal sensitive data. The goal of Triukose et al.       harmless CPDoS renders images or style resources unavailable. This
was to provoke a DoS attack with the aid of a mounted CDN. The                influences the visual appearance of parts of the application. In terms
authors utilized the infrastructure of a CDN, which comprises of              of functionality it is still working, however. More serious attacks
many collaborating edge cache servers. With the use of a random               targeting the start page or vital script resources can render the
string appended to the URL query, Triukose et al. were able to                entire web application inaccessible instead. Moreover, CPDoS can
bypass any edge cache servers so that the CDN forwards every                  be exploited to block, e.g., patches or firmware updates distributed
                                                                          3
  Benign                                                   Shared                               Origin       these observations, we investigated further in order to discover
                     Attacker
  Client                                                   Cache                                Server
                                                                                                             vulnerable constellations. We were able to identify three concrete
                                                                                                             instantiations of the general CPDoS attack that we present in the
                      1   GET /index.html HTTP/1.1         2   GET /index.html HTTP/1.1
                          Host: example.org                    Host: example.org                             following subsections.
                          X-Malicious-Header: Some value       X-Malicious-Header: Some value



                                  HTTP/1.1 400 Bad Request
                                                               4        HTTP/1.1 400 Bad Request
                                                                                                    3
                                                                                                             4.1        HTTP Method Override (HMO) Attack
                                  Content-Length: 10                    Content-Length: 10
                                  Content-Type: text/plain              Content-Type: text/plain             The HTTP standard [13] defines a set of request methods for the
                                  Some error                            Some error                           client to indicate the desired action to be performed for a given
                                                                                                             resource. GET, POST, DELETE, PUT and PATCH are arguably the
   5   GET /index.html HTTP/1.1
                                                                                                             most used HTTP methods in web applications and REST-based
       Host: example.org
                                                                                                             web services [36] in particular. Some intermediate systems such as
                                   HTTP/1.1 400 Bad Request     6                                            proxies, load balancer, caches or firewalls, however, only support
                                   Content-Length: 10
                                   Content-Type: text/plain                                                  GET and POST. This means DELETE, PUT and PATCH requests
                                   Some error                                                                are simply blocked. To circumvent this restriction many REST-
                                                                                                             based APIs or web frameworks provide auxiliary headers such as X-
Figure 2: General construction of the Cache-Poisoned                                                         HTTP-Method-Override, X-HTTP-Method or X-Method-Override
Denial-of-Service (CPDoS) attack                                                                             for passing through an unrecognized HTTP method. These headers
                                                                                                             will usually be forwarded by any intermediate systems. Once the
                                                                                                             request reaches the server, a method override header instructs the
via caches, preventing vulnerabilities in devices and software from                                          web application to replace the method in the request line with the
being fixed. Attackers can also disable important security alerts or                                         one in the method overriding header value.
messages on mission-critical websites such as online banking or                                                 These method override headers are very useful in scenarios when
official governmental websites. Imagine, e.g., a situation in which                                          intermediate systems block distinct HTTP methods. However, if a
a CPDoS attack prevents alerts about phishing emails or natural                                              web application supports such a header and also uses a shared web
catastrophes from being displayed to the respective user.                                                    caching system, a malicious client can exploit this semantic gap for
   When considering the low efforts for attackers, the high proba-                                           performing a CPDoS attack. In a typical HTTP Method Override
bility of success, the low chance of being detected and the relatively                                       (HMO) attack flow, a malicious client crafts a GET request including
high consequences of a DoS then the introduced CPDoS attack poses                                            an HTTP method overriding header as shown in Figure 3.
a high risk. Hence, it is worthwhile investigating under which con-
ditions CPDoS attacks can occur in the wild. For this reasons we
first compiled a complete overview on cacheable error codes as                                                 Benign
                                                                                                               Client
                                                                                                                                 Attacker
                                                                                                                                                                         Shared
                                                                                                                                                                         Cache
                                                                                                                                                                                                               Origin
                                                                                                                                                                                                               Server

specified in relevant RFCs [16], [25], [32], [9], [8], [34], [13], [11],
[4] and [5] (see Table 1). Moreover, we analyzed whether popu-                                                                    1   GET /index.html HTTP/1.1            2   GET /index.html HTTP/1.1
                                                                                                                                      Host: example.org                       Host: example.org
lar proxy caches as well as CDNs do store and reuse error codes                                                                       X-HTTP-Method-Override: POST            X-HTTP-Method-Override: POST

returned from the origin server. This exploratory study has been
conducted with the approach of Nguyen et al. [30, 31]. They pro-                                                                              HTTP/1.1 404 Not Found
                                                                                                                                              Content-Length: 29
                                                                                                                                                                              4    HTTP/1.1 404 Not Found
                                                                                                                                                                                   Content-Length: 29
                                                                                                                                                                                                                   3

vide a freely available cache testing tool for analyzing web browser                                                                          Content-Type: text/plain             Content-Type: text/plain


caches, proxy caches and CDNs in a systematically manner. The                                                                                 POST on /index.html not found        POST on /index.html not found


cache testing tool also offers a test suite containing 397 test cases
that can be customized by a test case specification language. We                                               5   GET /index.html HTTP/1.1
                                                                                                                   Host: example.org
extended the suite by adding new tests for evaluating the caching
of responses containing error status codes. In our study we concen-                                                                           HTTP/1.1 404 Not Found
                                                                                                                                              Content-Length: 29
                                                                                                                                                                              6

trated on the five well-known proxies caches Apache HTTP Server                                                                               Content-Type: text/plain

(Apache HTTPD) v2.4.18, Nginx v1.10.3, Varnish v6.0.1, Apache                                                                                 POST on /index.html not found

Traffic Server (Apache TS) v8.0.2 and Squid v3.5.12 as well as the
CDNs Akamai, CloudFront, Cloudflare, Stackpath, Azure, CDN77,                                                Figure 3: Flow and example construction of the HTTP
CDNSun, Fastly, KeyCDN and G-Core Labs.                                                                      Method Override (HMO) attack
   Even though the cacheability of error codes are well-defined by
the series of RFC specifications given above, our analysis reveals                                              A CDN or reverse proxy cache interprets the request in Figure 3
that some web caching systems violates some of these policies.                                               as a benign GET request targeting http://example.org/index.html.
For instance, CloudFront and Cloudflare do store and reuse error                                             Hence, it forwards the request with the X-HTTP-Method-Override
messages such as 400 Bad Request, 403 Forbidden and 500                                                      header to the origin server. The endpoint, however, interprets this
Internal Server Error although being not permitted. The vi-                                                  request as a POST request, since the X-HTTP-Method-Override
olation of web caching policies is a severe issue and needs to be                                            header instructs the server to replace the HTTP method in the
taken into account by content providers and web caching system                                               request line with the one contained in the header. Accordingly,
vendors. Recent publications have revealed that non-adherence                                                the web application returns a response based on POST. Let’s as-
may otherwise lead to caching vulnerabilities [7, 15, 24]. Following                                         sume that the target web application does not implement any POST
                                                                                                         4
            Legend: ✓ cacheable status code according to HTTP Standard,              stored by web caching system, # not stored by web caching system,                                                storing not cacheable status code




                                                                                                 Apache HTTPD




                                                                                                                                                                                                                               G-Core Labs
                                                                                                                                                                                                         CloudFront
                                                                                                                                                                                         Cloudflare
                                                                                                                Apache TS




                                                                                                                                                                                                                                                      Stackpath
                                                                                                                                                                                CDNSun




                                                                                                                                                                                                                                             KeyCDN
                                                                                                                                                       Akamai
                                                                                                                                             Varnish




                                                                                                                                                                        CDN77
                                                                                                                                                                Azure
                                                                                                                            Nginx




                                                                                                                                                                                                                      Fastly
                                                                                                                                    Squid
             Error Code                                                              Cacheable



             400 Bad Request                                                            –          #             #           #       #        #         #        #       #       #         #                           #         #            #        #
             401 Unauthorized                                                           –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             402 Payment Required                                                       –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             403 Forbidden                                                              –          #             #           #       #        #         #        #       #       #                         #           #         #            #        #
             404 Not Found                                                              ✓          #             #           #       #                           #               #                                               #            #        #
             405 Method Not Allowed                                                     ✓          #             #           #       #        #                  #       #       #         #                           #         #            #        #
             406 Not Acceptable                                                         –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             407 Proxy Authentication Required                                          –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             408 Request Timeout                                                        –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             409 Conflict                                                               –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             410 Gone                                                                   ✓          #                         #       #                                   #       #                                               #            #        #
             411 Length Required                                                        –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             412 Precondition Failed                                                    –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             413 Payload Too Large                                                      –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             414 Request-URI Too Long                                                   ✓          #             #           #       #                  #        #       #       #         #                           #         #            #        #
             415 Unsupported Media Type                                                 –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             416 Requested Range Not Satisfiable                                        –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             417 Expectation Failed                                                     –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             418 I’m a teapot                                                           –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             421 Misdirected Request                                                    ✓          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             422 Unprocessable Entity                                                   –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             423 Locked                                                                 –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             424 Failed Dependency                                                      –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             426 Upgrade Required                                                       –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             428 Precondition Required                                                  –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             429 Too Many Requests                                                      –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             431 Request Header Fields Too Large                                        –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             444 Connection Closed Without Response                                     –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             451 Unavailable For Legal Reasons                                          ✓          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             499 Client Closed Request                                                  –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             500 Internal Server Error                                                  –          #             #           #       #        #         #                #       #         #                           #         #            #        #
             501 Not Implemented                                                        ✓          #             #           #       #        #         #                #       #         #                           #         #            #        #
             502 Bad Gateway                                                            –          #             #           #       #        #         #                #       #         #                           #         #            #        #
             503 Service Unavailable                                                    –          #             #           #       #        #         #                #       #         #                           #         #            #        #
             504 Gateway Timeout                                                        –          #             #           #       #        #         #                #       #         #                           #         #            #        #
             505 HTTP Version Not Supported                                             –          #             #           #       #        #         #                #       #         #               #           #         #            #        #
             506 Variant Also Negotiates                                                –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             507 Insufficient Storage                                                   –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             508 Loop Detected                                                          –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             510 Not Extended                                                           –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             511 Network Authentication Required / Status Code and Captive Portals      –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #
             599 Network Connect Timeout Error                                          –          #             #           #       #        #         #        #       #       #         #               #           #         #            #        #

Table 1: Overview of cacheable error status codes according to [4, 5, 8, 9, 11, 13, 16, 25, 32, 34] and empirical study results
showing whether the status codes are cached by the analyzed web caching systems



endpoint for /index.html. In such a case, web frameworks usually                                                               This semantic gap in terms of different request header size limits
returns an error message, e.g., the status code 404 Not Found                                                               can be exploited to conduct a CPDoS attack. To execute an HTTP
or 405 Method Not Allowed. The shared cache assigns the re-                                                                 Header Oversize (HHO) attack, a malicious client needs to send a
turned response with the error code to the GET request target-                                                              GET request including a header larger than the limit of the origin
ing http://example.org/index.html. Since the status codes 404 Not                                                           server but smaller than the one of the cache. To do so, an attacker
Found and 405 Method Not Allowed are cacheable according to                                                                 has two options. First, she crafts a request header with many ma-
the HTTP Caching RFC 7231 as shown in Table 1, caches store and                                                             licious headers. The other option is to include one single header
reuse this error response for recurring requests. Each benign client                                                        with an oversized key or value as shown in Figure 4.
making a subsequent GET request to http://example.org/index.html                                                               The web caching system forwards this request including the
receives the cached error message instead of the legitimated web                                                            oversized header to the endpoint, since the header size is under
application’s start page.                                                                                                   the limit of the intermediary. The web server, however, blocks this
                                                                                                                            request and returns an error page, as the request exceeds the header
                                                                                                                            size limit. This returned error page is stored and will be reused for
4.2    HTTP Header Oversize (HHO) Attack                                                                                    equivalent requests.
The HTTP standard does not define any size limit for request head-
ers. Hence, intermediate systems, web servers and web frameworks
specify their own limit. Most web servers and proxy caches provide
a request header limit of about 8,000 bytes in order to avoid security                                                      4.3             HTTP Meta Character (HMC) Attack
threats such as request header overflow [26] or ReDoS [38] attacks.                                                         The HTTP Meta Character (HMC) works similar to the HHO attack.
However, there are also intermediate systems, which specify a limit                                                         Instead of sending an oversized header, this attack tries to bypass
larger than 8,000 bytes. For instance, the Amazon CloudFront CDN                                                            a cache with a request header containing a harmful meta charac-
allows up to 24,713 bytes. In an exploratory study we gathered the                                                          ter. Meta characters can be e.g. control characters such as the line
default HTTP request header limits deployed by various HTTP                                                                 break/carriage return (\n), line feed (\r) or any other Unicode con-
engines and cache systems (see Table 3).                                                                                    trol characters. As the \n and \r characters are used by the response
                                                                                                                 5
    Benign                                                 Shared                              Origin         Benign                                                   Shared                               Origin
                      Attacker                                                                 Server                            Attacker                                                                   Server
    Client                                                 Cache                                              Client                                                   Cache



                       1   GET /index.html HTTP/1.1        2   GET /index.html HTTP/1.1                                           1   GET /index.html HTTP/1.1         2   GET /index.html HTTP/1.1
                           Host: example.org                   Host: example.org                                                      Host: example.org                    Host: example.org
                           X-Oversized-Header: Big value       X-Oversized-Header: Big value                                          X-Metachar-Header: \n                X-Metachar-Header: \n



                                   HTTP/1.1 400 Bad Request             HTTP/1.1 400 Bad Request                                              HTTP/1.1 400 Bad Request              HTTP/1.1 400 Bad Request
                                   Content-Length: 20
                                                               4        Content-Length: 20
                                                                                                   3                                          Content-Length: 21
                                                                                                                                                                           4        Content-Length: 21
                                                                                                                                                                                                                3
                                   Content-Type: text/plain             Content-Type: text/plain                                              Content-Type: text/plain              Content-Type: text/plain

                                   Header size exceeded                 Header size exceeded                                                  Character not allowed                 Character not allowed




    5   GET /index.html HTTP/1.1                                                                               5   GET /index.html HTTP/1.1
        Host: example.org                                                                                          Host: example.org


                                    HTTP/1.1 400 Bad Request    6                                                                              HTTP/1.1 400 Bad Request     6
                                    Content-Length: 20                                                                                         Content-Length: 21
                                    Content-Type: text/plain                                                                                   Content-Type: text/plain

                                    Header size exceeded                                                                                       Character not allowed



Figure 4: Flow and example construction of the HTTP                                                         Figure 5: Flow and example construction of the HTTP Meta
header oversize (HHO) attack                                                                                Character (HMC) attack


splitting attack to poison a cache, some HTTP implementations                                               reverse proxies, web servers, web frameworks, cloud services or
block requests containing these symbols.                                                                    other intermediate systems as well as another cache.
   HTTP implementations, which drop such characters, mostly                                                     In our first experiment, we analyzed the method override header
return an error message signaling that they do not parse this request.                                      support in web frameworks. Additionally, we also evaluated what
However, there are some cache intermediaries which do not care                                              error page is returned when sending a method override header
about certain control characters. They simply forward the request                                           containing an HTTP method which is not implemented by corre-
including the meta character to the origin server which return                                              sponding resource endpoint. Based on the findings in Table 1 where
an error code. The resulting error page is then stored and reused                                           we know what error page is stored by what web caching systems,
by the cache. This constellation can be exploited by a malicious                                            we inferred what web framework in combination with what web
client to conduct another form of CPDoS attack. We declare this                                             caching systems might be vulnerable to HMO attacks. For this em-
vulnerability as HTTP Meta Character (HMC) attack. To do so, the                                            pirical analysis we chose 13 web frameworks based on the most
attacker crafts a request with a meta character, e.g. \n, as shown                                          popular programming languages according to IEEE Spectrum [17].
in Figure 5. The goal of this example attack in is to fool the origin                                       The analyzed collection of web frameworks includes ASP.NET v2.2,
server into believing that it is attacked by a response splitting                                           BeeGo v1.10.0, Django v2.1.7, Express.js v.4.16.4, Flask v1.0.2, Gin
request. As with the previously presented vulnerabilities, the HMO                                          v1.3.0, Laravel v5.7, Meteor.js v1.8, Rails v5.2.2, Play Framework 1
request traverses the cache without any issues. Once the request                                            (Play 1) v1.5.1, Play Framework 2 (Play 2) v2.7, Spring Boot v2.1.2
reaches the endpoint, it is blocked and an according error page is                                          and Symfony v4.2.
returned, since the web server is aware of the implications regarding                                           The second experiment investigated the request header size lim-
suspicious characters such as \n. This error message is then stored                                         its of the web caching systems in Table 1 as well as the 13 web
and recycled by the corresponding web caching system.                                                       frameworks. As the web frameworks ASP.NET and Spring Boot re-
                                                                                                            quires an underlying web server to be deployed in production mode,
                                                                                                            we additionally also evaluate the request header limits of Microsoft
5       PRACTICABILITY OF CPDOS ATTACKS
                                                                                                            Internet Information Services (IIS) v10.0.17763.1 and Tomcat v9.0.14.
In order to explore the existence of CPDoS weaknesses in the wild,                                          Moreover, we also evaluated popular cloud services including Ama-
we conducted a series of experiments. A crucial prerequisite for a                                          zon S3, Github Pages, Gitlab Pages, Google Storage and Heroku.
potential CPDoS vulnerability is a web caching system that stores                                           As with the first experiment, we also tested which error code is
and reuses error pages produced by the origin server. Table 1 high-                                         returned when the request header size limit is exceeded. With these
lights that Varnish, Apache TS, Akamai, Azure, CDN77, Cloudflare,                                           findings we figured out what HTTP implementations in conjunc-
CloudFront and Fastly do so. Based on these findings, we conducted                                          tion with what web caching systems are potentially vulnerable to
three experiments—one for each introduced CPDoS variant—to ex-                                              HHO attacks.
amine whether these intermediate systems are vulnerable to CPDoS                                                The last experiment evaluated the feasibility of HMC attacks.
attacks.                                                                                                    Here, we evaluated the handling of meta characters in all mentioned
                                                                                                            web caching systems, web frameworks, web servers and cloud ser-
5.1          Experiments Setup                                                                              vices. To test as many meta characters as possible we collected as
The first step to analyze whether CPDoS vulnerabilities exist in                                            list of 520 potentially irritating strings. This collection contains
practical environments is to figure out vulnerable HTTP implemen-                                           control, special, international and other unicode characters as well
tations which are utilized as the origin server. HTTP implementa-                                           as strings comprising attack vectors including cross site scripting
tions on the origin server can be diverse systems including, e.g.,                                          (XSS), SQL injections and remote execution attacks. The goals of
                                                                                                        6
this study was to analyze what characters and strings are blocked,               Our obtained results reveal many varieties in terms of request
sanitized and processed or forwarded without any issues. Moreover,            header size limits among the HTTP implementations. The evalu-
we also evaluated what error page is triggered when a character or            ation shows that CloudFront provides a request header size limit,
string is blocked. Based on our findings we were able to conclude             which is much higher than the one of the many other HTTP im-
what characters and what symbols need to be send to what constel-             plementations we tested. Moreover, Amazon’s CDN also caches
lation of HTTP engine and web caching system to induce an HMC                 the error code 400 Bad Request by default (see Table 1), which is
attack.                                                                       triggered by most of the HTTP implementations when the request
                                                                              header size limit is exceeded. Hence, in our experiments we figured
                                                                              out that when using CloudFront as CDN any HTTP implementa-
5.2    Feasibility of HMO attacks                                             tion that has a request header size limit lower than CloudFront and
Table 2 shows the results of the first experiment. It highlights that         returns the status code 400 Bad Request if the limit is exceeded
Symfony, Laravel and Play 1 support method override headers by                is vulnerable to HHO CPDoS atacks. For instance, the web caching
default. Django and Express.js instead do not consider method over-           systems Apache HTTPD and Nginx, which can also be used as web
ride headers by default, but provide plugins to add this feature.             server or reverse proxy provide a lower request header size limit
Flask does not offer any plugin for the integration of method over-           than CloudFront.
ride headers, but provides an official tutorial how to enable it [14].           Besides the fact that Apache HTTPD and Nginx are amongst
Table 2 also points out what error code is returned when the web              the most used web servers according to a survey of Netcraft [28],
framework receives a method override header with an action that               both systems are often deployed with other intermediate systems.
is not implemented by the addressed resource endpoint.                        When using one of these HTTP implementations in conjunction
    Even though the web frameworks with a method overriding                   with CloudFront, these systems can be affected by an HHO CPDoS
header support return cacheable error codes, we observed that only            attack. This also means if Apache HTTPD and Nginx is configured
Play 1 and Flask are vulnerable to HMO CPDoS attacks. However,                as intermediate reverse proxy in front of other web applications,
both web frameworks can only be affected if Fastly, Akamai, Cloud-            then these systems are vulnerable to HHO CPDoS as well. More-
flare, CloudFront, CDN77 and Varnish are used as intermediate                 over, Apache HTTPD and Nginx are often utilized as web server
cache. The reason why these web frameworks are vulnerable lies in             and deployment environment for web frameworks such as Rails,
the fact that Play 1 and Flask do perform an HTTP method change               Django, Flask, Symfony and Lavarel. All these web frameworks
for GET as well as POST requests in case an HTTP method override              are vulnerable to HHO CPDoS likewise if they are deployed with
header is present. Laravel, Symfony and the plugins for Django and            Apache HTTPD or Nginx. Spring Boot and ASP.NET can also be
Express.js are not vulnerable to HMO CPDoS, since they ignore                 affected by HHO CPDoS attacks, as both web frameworks require
HTTP method override headers in GET requests and restrict them-               a web server in production mode. Spring Boot can be deployed
selves to transform the method for POST requests only. Attackers              with Tomcat and ASP.NET can use IIS as the underlying deploy-
cannot poison the tested web caching systems with a POST request,             ment environment. Tomcat and IIS have request header size limits
since responses to POST requests are not stored by any of them.               lower than CloudFront. Both web servers return the error 400 Bad
    Malicious clients can attack web applications implemented with            Request for oversized header likewise. The cloud service Heroku
the Play 1 by sending a GET request with the method override                  is another deployment platform for web frameworks. It supports,
header including, e.g., POST as value. If the corresponding resource          e.g., Django, Flask, Laravel, Rails, Laravel and Symfony. As Heroku
endpoint does not implement any functionality for POST, then the              provides a request header size limit lower than CloudFront, web
web framework returns the error code 404 Not Found. Akamai,                   applications using the cloud service in conjunction with the CDN
Fastly, CDN77, Cloudflare, CloudFront and Varnish cache this status           can be vulnerable as well. Other HTTP implementations which can
code by default (see Table 1). Flask is also vulnerable to HMO                be affected by HHO CPDoS attacks when using CloudFront as CDN
CPDoS attacks, if the support of HTTP method override headers                 are Play 2 as well as the cloud services Amazon S3, Github Pages
is implemented with the official tutorial of the web framework’s              and Heroku. Play 1 is also vulnerable to HHO CPDoS attacks, even
website. However, HMO attacks are only possible, if Akamai and                though it does not return an error page when the request header
CloudFront are utilized as CDN, since Flask returns the status code           size limit is exceeded. The web framework does not return any
405 Method Not Allowed. Akamai and CloudFront are the only                    response if it receives an oversized header. Here, the TCP socket
analyzed web caching systems, which store and reuse error pages               remains open until the web application shuts down. If CloudFront
with this code.                                                               notices such an idle communication channel, then the CDN returns
                                                                              the error code 502 Bad Gateway. This error message is stored
                                                                              and reused for recurring requests likewise. According to our ex-
5.3    Feasibility of HHO attacks                                             periments, Google storage in conjunction with CloudFront is not
Table 3 depicts the results of our study on request header size limits.       vulnerable to HHO CPDoS although the cloud service has lower
If available, it moreover lists the request header size limit specified       request header size limit than the CDN. Google storage returns the
in the documentation of the corresponding HTTP implementation.                error code 413 Payload Too Large for oversized headers and this
Note, that we omit the web frameworks ASP.NET, Django, Flask,                 error message is not cached by any of the analyzed web caching
Laravel, Rails, Symfony and Spring Boot in this table, as we found            systems. Table 3 also contains a result obtained when using Nginx
out that the request header limits depend on the used web server              with the WAF plugin ModSecurity. In such a configuration, con-
and deployment environment.                                                   ducting a successful HHO CPDoS attack is even easier as without
                                                                          7
                                              Legend: # must be implemented manually, by default, G
                                                                                                  # not by default but by extension
                                  Web framework     Programming lang.    Method overriding support   Error code when method not implemented
                                  Rails             Ruby                 #                           undefined
                                  Django            Python               G
                                                                         #                           405
                                  Flask             Python               G
                                                                         #                           405
                                  Express.js        JavaScript           G
                                                                         #                           405
                                  Meteor.js         JavaScript           #                           undefined
                                  BeeGo             Go                   #                           undefined
                                  Gin               Go                   #                           undefined
                                  Play 1            Java                                             404
                                  Play 2            Java/Scala           #                           undefined
                                  Spring Boot       Java                 #                           undefined
                                  Symfony           PHP                                              405
                                  Lavarel           PHP                                              405
                                  ASP.NET           C#                   #                           undefined
                            Table 2: HTTP method overriding headers support of tested web frameworks


                                          HTTP implementation          Documented limit         Tested limit            Limit exceed error code
                         CDN              Akamai                       undefined                32,760 bytes            No Response
                                          Azure                        undefined                24,567 bytes            400
                                          CDN77                        undefined                16,383 bytes            400
                                          CDNSun                       undefined                16,516 bytes            400
                                          Cloudflare                   undefined                ≈ 32,395 bytes          400
                                          Cloudfront                   20,480 bytes             ≈ 24,713 bytes          494
                                          Fastly                       undefined                69,623 bytes            No Response
                                          G-Core Labs                  undefined                65,534 bytes            400
                                          KeyCDN                       undefined                8,190 bytes             400
                                          StackPath                    undefined                ≈ 85,200 bytes          400
                          HTTP engine     Apache HTTPD                 8,190 bytes              8,190 bytes             400
                                          Apache HTTPD + ModSecurity   undefined                8,190 bytes             400
                                          Apache TS                    131,072 bytes            65,661 bytes            400
                                          Nginx                        undefined                20,584 bytes            400
                                          Nginx + ModSecurity          undefined                8,190 bytes             400
                                          IIS                          undefined                16,375 bytes            400, (404)
                                          Squid                        65,536 bytes             65,527 bytes            400
                                          Tomcat                       undefined                8,184 bytes             400
                                          Varnish                      8,192 bytes              8,299 bytes             400
                         Cloud Service    Amazon S3                    undefined                ≈ 7,948 bytes           400
                                          Github Pages                 undefined                8,190 bytes             400
                                          Gitlab Pages                 undefined                >500,000 bytes          undefined
                                          Google Cloud Storage         undefined                16,376 bytes            413
                                          Heroku                       8,192 bytes              8,154 bytes             400
                         Web Framework    BeeGo                        undefined                >500,000 bytes          undefined
                                          Express.js                   undefined                81,867 bytes            No Response
                                          Gin                          undefined                >500,000 bytes          undefined
                                          Meteor.js                    undefined                81,770 bytes            400
                                          Play 1                       undefined                8,188 bytes             No Response
                                          Play 2                       8,192 bytes              8,319 bytes             400

                                         Table 3: Request header size limits of HTTP implementations



the security extension. The tested request header limit of Nginx                              blocked or sanitized by at least one of the tested HTTP implemen-
is around 20,000 bytes but when ModSecurity is added to both                                  tations. Moreover, we omit the web frameworks ASP.NET, Django,
systems, it reduces the restriction to 8,190 bytes. Even though the                           Flask, Laravel, Spring Boot and Symfony in this table, since the
usage of ModSecurity should actually avoid web application attacks                            handling of meta characters depends on the used web server and
such as DoS, it eases to conduct an HHO CPDoS attack in this case.                            deployment environment.
   As mentioned before, IIS and web frameworks such as APS.NET                                   The evaluation highlights that the many analyzed systems con-
running on this web server are vulnerable to HHO CPDoS attacks                                sider control characters as a threat. Suspicious characters or strings
when using CloudFront as CDN. However, in certain circumstances,                              are either blocked by the denoted error code or are sanitized from
they might also be vulnerable when Akamai, Fastly, CDN77, Cloud-                              the request header. However, the handling of meta strings and
flare and Varnish are utilized. The IIS web server provides an option                         characters are very diverse. For instance, CloudFront blocks the
to set a size limit for a distinct request header. Some web applica-                          character \u0000 and sanitizes \n, \v, \f, \r, but forwards other
tions require such a configuration option to block, e.g., an oversized                        control characters such as \a, \b and \e without modifying them.
Cookie header. If this restriction is defined for a request header and                        If Apache HTTPD, IIS or Varnish is used with CloudFront, then
this limit is exceeded, then the web server return the error code                             the corresponding systems block the forwarded header contain-
404 Not Found. This error message is cached by Akamai, Fastly,                                ing forbidden characters with the status code 400 Bad Request.
CDN77, CloudFront, Cloudflare and Varnish.                                                    CloudFront stores such an error message. This means when us-
                                                                                              ing CloudFront as CDN, all tested HTTP implementations, which
                                                                                              blocked harmful strings and characters that are not rejected or
                                                                                              sanitize by CloudFront, are vulnerable to HMC CPDoS attacks. Be-
5.4    Feasibility of HMC attacks                                                             sides Apache HTTPD, IIS and Varnish, this includes Github Pages,
Table 4 shows the results of our third experiments where we ana-                              Gitlab Pages, BeeGo, Gin, Meteor.js and Play 2. Express.js is vul-
lyzed the handling of strings containing meta characters. For the                             nerable to HMC CPDoS attacks as well, even though it does not
sake of readability, we only list the characters and strings that are                         block any tested string by an error code. The issue here is similar to
                                                                                          8
                                                                      Legend: # processed/forwarded without error and sanitization
 Meta character in request header              Akamai         Azure         CDN77           CDNSun                Cloudflare         Cloudfront       Fastly          G-Core Labs    KeyCDN     Stackpath
 \u0000                                        400            400           400             400                   400                400              No Response     400            400        Sanitized
 \u0001 ... \u0006                             #              400           Sanitized       #                     #                  #                400             #              #          #
 \a                                            #              400           Sanitized       #                     #                  #                400             #              #          #
 \b                                            #              400           Sanitized       #                     #                  #                400             #              #          #
 \t                                            #              #             #               #                     #                  #                #               #              #          #
 \n                                            #              400           Sanitized       Sanitized             Sanitized          Sanitized        Sanitized       Sanitized      #          Sanitized
 \v                                            #              400           Sanitized       #                     #                  Sanitized        400             #              #          Sanitized
 \f                                            #              400           Sanitized       #                     #                  Sanitized        400             #              #          Sanitized
 \r                                            #              400           Sanitized       #                     Sanitized          Sanitized        400             Sanitized      #          Sanitized
 \u000e ... \001f, \u007f                      #              400           Sanitized       #                     #                  #                400             #              #          #
 Multiple Unicode control character            #              400           Sanitized       #                     #                  #                400             #              #          #
 (e.g.\u0001\u0002)
 (){0;}; touch /tmp/blns.shellshock1.fail;     #              #             #               #                     403                #                #               #              #          #
 ()     {     _;    }    >_[$($())] {  touch   #              #             #               #                     403                #                #               #              #          #
 /tmp/blns.shellshock2.fail; }
 Meta character in request header              Apache HTTPD +         Apache TS         Nginx +             IIS                  Tomcat           Squid             Varnish         Amazon S3   Google
                                               (ModSecurity)                            (ModSecurity)                                                                                           Storage
 \u0000                                        400                    400               400                 400                  #                #                 400             #           #
 \u0001 ... \u0006                             400                    #                 #                   400                  #                #                 400             #           #
 \a                                            400                    #                 #                   400                  #                #                 400             #           #
 \b                                            400                    #                 #                   400                  #                #                 400             #           #
 \t                                            #                      #                 #                   400                  #                #                 400             #           #
 \n                                            400                    #                 Sanitized           #                    #                #                 Sanitized       #           #
 \v                                            400                    #                 #                   400                  #                #                 400             #           #
 \f                                            400                    #                 #                   400                  #                #                 400             #           #
 \r                                            400                    #                 #                   400                  #                #                 400             #           #
 \u000e ... \001f, \u007f                      400                    #                 #                   400                  #                #                 400             #           #
 Multiple Unicode control character            400                    #                 #                   400                  #                #                 400             #           #
 (e.g.\u0001\u0002)
 (){0;}; touch /tmp/blns.shellshock1.fail;     #                      #                 #                   #                    #                #                 #               #           #
 ()     {     _;    }    >_[$($())] {  touch   #                      #                 #                   #                    #                #                 #               #           #
 /tmp/blns.shellshock2.fail; }
 Meta character in request header              Github Pages           Gitlab Pages      Heroku              Beego                Express.js       Gin               Meteor          Play 1      Play 2
 \u0000                                        No Response            400               #                   400                  #                400               400             #           400
 \u0001 ... \u0006                             400                    400               #                   400                  #                400               400             #           400
 \a                                            400                    400               #                   400                  #                400               400             #           400
 \b                                            400                    400               #                   400                  #                400               400             #           400
 \t                                            400                    #                 #                   #                    #                #                 #               #           #
 \n                                            400                    #                 400                 #                    #                #                 #               #           #
 \v                                            400                    400               #                   400                  #                400               400             #           400
 \f                                            400                    400               #                   400                  #                400               400             #           400
 \r                                            400                    400               #                   400                  #                400               #               #           400
 \u000e ... \001f                              400                    400               #                   400                  #                400               400             #           400
 \u0007f                                       400                    400               #                   400                  #                400               400             #           #
 Multiple Unicode control character            400                    400               #                   400                  No Response      400               No Response     #           400
 (e.g.\u0001\u0002)
 (){0;}; touch /tmp/blns.shellshock1.fail;     #                      #                 #                   #                    #                #                 #               #           #
 ()     {     _;    }    >_[$($())] {  touch   #                      #                 #                   #                    #                #                 #               #           #
 /tmp/blns.shellshock2.fail; }

                                      Table 4: Meta string handling in request header of HTTP implementations



the problem of oversized header in Play 1. When sending a request                                                 Not Found is a proper and compliant approach for optimizing web-
header with multiple control characters Express.js does not reply                                                 site performance. In this case, there is no malfunction in Varnish,
at all. Accordingly, CloudFront returns the error message 502 Bad                                                 Akamai, CDN77, Cloudflare and Fastly. The reason for a successful
Gateway to the client. This error code is also stored and reused for                                              CPDoS attack lies in the fact that, Play 1 and Microsoft IIS allows to
subsequent requests.                                                                                              provoke 404 Not Found error pages on resource endpoints which
                                                                                                                  do not return an error message when sending a benign request.

                                                                                                                  5.6          Practical Impact
5.5       Consolidated Review of Analysis Results
                                                                                                                  In the first step to estimate the practical impact of CPDoS attacks, we
Based on our findings of all three experiments, we detected many
                                                                                                                  determined the amount of websites that use one of the vulnerable
CPDoS attack vectors in various different combinations of web
                                                                                                                  web caching systems and HTTP implementations listed in Table 5.
caching systems and HTTP implementations. Most of the attacks
                                                                                                                  Our approach to find vulnerable real world websites is to inspect
are executable on CloudFront as shown in Table 5. This overview
                                                                                                                  the response header.
summarizes what pair of web caching system and HTTP implemen-
                                                                                                                     Many HTTP implementations append informational headers to
tation is vulnerable to what CPDoS attack. The experiments’ results
                                                                                                                  the response for declaring that a message is processed by this entity.
show that web applications using CloudFront are highly vulnerable
                                                                                                                  For instance, CloudFront includes the values Hit from CloudFront
to CPDoS attacks, since the CDN caches the error code 400 Bad
                                                                                                                  or Miss from CloudFront to the x-cache header and Microsoft IIS
Request by default. Many server-side HTTP implementations re-
                                                                                                                  adds the string Microsoft-IIS to the Server header. By means of
turn this error message when sending a request with an oversized
                                                                                                                  this information an attacker can unambiguously detect what cache
header or meta characters. The likelihood to be affected by CPDoS
                                                                                                                  or what server-side HTTP implementation is used by the target web
attacks when utilizing the other analyzed caches including Varnish,
                                                                                                                  application respectively. Based on this approach, we analyzed the
Akamai, CDN77, Cloudflare or Fastly is rather lower. These web
                                                                                                                  websites of the U.S. Department of Defense (DoD)1 and the Alexa
caching systems do store the error code 404 Not Found but not
400 Bad Request. The caching of error pages with status code 404                                                  1 https://dod.defense.gov/About/Military-Departments/DoD-Websites/

                                                                                                        9
                                                                                                         Legend: # no CPDoS attack dectected
                                                                                                                                                                                  Web caching system
        Apache HTTPD




                                                                                                                                               G-Core Labs
                                                                                                               CloudFront
                                                                                                 Cloudflare
                       Apache TS




                                                                                                                                                                      StackPath
                                                                                       CDNSun




                                                                                                                                                             KeyCDN
                                                             Akamai
                                                   Varnish




                                                                              CDN77
                                                                      Azure
                                   Nginx




                                                                                                                                      Fastly
                                           Squid
                                                                                                                                                                                                         Origin server HTTP implemenation
          #             #           #       #       #         #        #       #        #          #             HHO, HMC              #         #            #        #          Apache HTTPD + (ModSecurity)
          #             #           #       #       #         #        #       #        #          #             #                     #         #            #        #          Apache TS
          #             #           #       #       #         #        #       #        #          #             HHO                   #         #            #        #          Nginx + (ModSecurity)
          #             #           #       #       (HHO)     (HHO)    #       (HHO)    #          (HHO)         HHO, HMC              (HHO)     #            #        #          IIS
          #             #           #       #       #         #        #       #        #          #             HHO                   #         #            #        #          Tomcat
          #             #           #       #       #         #        #       #        #          #             #                     #         #            #        #          Squid
          #             #           #       #       #         #        #       #        #          #             HHO, HMC              #         #            #        #          Varnish
          #             #           #       #       #         #        #       #        #          #             HHO                   #         #            #        #          Amazon S3
          #             #           #       #       #         #        #       #        #          #             #                     #         #            #        #          Google Cloud Storage
          #             #           #       #       #         #        #       #        #          #             HHO, HMC              #         #            #        #          Github Pages
          #             #           #       #       #         #        #       #        #          #             HMC                   #         #            #        #          Gitlab Pages
          #             #           #       #       #         #        #       #        #          #             HHO                   #         #            #        #          Heroku
          #             #           #       #       (HHO)     (HHO)    #       (HHO)    #          (HHO)         (HHO), (HMC)          (HHO)     #            #        #          ASP.NET
          #             #           #       #       #         #        #       #        #          #             HMC                   #         #            #        #          BeeGo
          #             #           #       #       #         #        #       #        #          #             (HHO), (HMC)          #         #            #        #          Django
          #             #           #       #       #         #        #       #        #          #             HMC                   #         #            #        #          Express.js
          #             #           #       #       #         (HMO)    #       #        #          #             HMO, (HHO), (HMC)     #         #            #        #          Flask
          #             #           #       #       #         #        #       #        #          #             HMC                   #         #            #        #          Gin
          #             #           #       #       #         #        #       #        #          #             (HHO), (HMC)          #         #            #        #          Laravel
          #             #           #       #       #         #        #       #        #          #             HMC                   #         #            #        #          Meteor.js
          #             #           #       #       HMO       HMO      #       HMO      #          HMO           HHO, HMO              HMO       #            #        #          Play 1
          #             #           #       #       #         #        #       #        #          #             HHO, HMC              #         #            #        #          Play 2
          #             #           #       #       #         #        #       #        #          #             (HHO), (HMC)          #         #            #        #          Rails
          #             #           #       #       #         #        #       #        #          #             HHO                   #         #            #        #          Spring Boot
          #             #           #       #       #         #        #       #        #          #             (HHO), (HMC)          #         #            #        #          Symfony

                                                                                       Table 5: CPDoS vulnerability overview



Top 500 websites. In addition to this, we used the Google Big Query                                                                  change the default configuration of a cache in order to adapt the
service to investigate over 365 million URLs stored in the HTTP                                                                      caching policy to the respective needs. Moreover, real world web
Archive data set httparchive.summary_requests.2018_12_15_-                                                                           applications also utilize other intermediate systems such as load
desktop. Table 6 shows the number of websites and URLs of the                                                                        balancers or WAFs. All these settings influence the practicability of
DoD, the Alexa Top 500 and the HTTP Archive where the response                                                                       CPDoS attacks in any direction. To get a clearer picture on the real
header indicates that the content is processed by a vulnerable HTTP                                                                  life impact of CPDoS attacks, we took some samples based on the
implementation.                                                                                                                      URLs from the Alexa Top 500, DoD, and HTTP Archive data sets.
                                                                                                                                     Overall, we found twelve vulnerable resources within a few days.
                                                             DoD      Alexa Top 500             HTTP Archive                         These also include mission-critical websites such as ethereum.org,
   Total number of web sites/URLs                            414      500                       365.112.768
   Varnish                                                   2        40                        4.658.950                            marines.com, and nasa.gov which use CloudFront as CDN. At all
   Akamai                                                    2        38                        1.031.535                            these websites, we were able to block multiple resources including
   CDN77                                                     0        0                         321.456                              scripts, style sheets, images, and even dynamic content such as the
   Cloudflare                                                7        34                        18.236.800
   CloudFront                                                8        23                        12.140.461
                                                                                                                                     start page. The visual damage of a CPDoS attack is shown by the
   Fastly                                                    0        9                         4.013.578                            Figures 6 and 7 in the Appendix A. In Figure 6, the CPDoS attack is
   IIS                                                       27       9                         17.792.692                           first applied to an image referenced in the start page of the victim
   Flask                                                     0        0                         5.765
   Play 1                                                    0        0                         10.491
                                                                                                                                     website ethereum.org. Then the style sheet file is denied and finally,
                                                                                                                                     an error page replaces the whole start page. Figure 7 illustrates the
Table 6: Number of websites/URLs using Varnish, Akamai,
                                                                                                                                     affected start page of marines.com which displays an error page to
CDN77, Cloudflare, CloudFront, Fastly, IIS, Flask and Play 1
                                                                                                                                     the user instead of the genuine content. Moreover, we were also
                                                                                                                                     able to conduct a successful CPDoS attack on the update files of
                                                                                                                                     IKEA’s Smart Home devices. IKEA uses CloudFront in conjunction
   The results highlight that eight websites of the DoD, 23 of the                                                                   with S3 to distribute remote control firmware and driver updates
Alexa Top 500 and over twelve million URLs stored in the men-                                                                        for their wireless bulbs. As CloudFront in combination with S3 is
tioned data set of the HTTP Archive are served via CloudFront.                                                                       vulnerable to HHO CPDoS attacks, an attacker can block the re-
Moreover, all eight websites of the DoD, 16 websites of the Alexa                                                                    mote control devices of IKEA from fetching security patches. These
Top 500 and over nine million URLs of the HTTP Archive point out                                                                     evidences show that CPDoS attacks can affect static as well as dy-
that CloudFront in combination with Apache HTTPD, Nginx, Ama-                                                                        namic resources. Most of the vulnerable websites use CloudFront
zon S3, Microsoft IIS and Varnish is used. Our experiments revealed                                                                  as CDN. However, the real world impact of CPDoS attacks is not
that these constellations are vulnerable to CPDoS attacks (see Ta-                                                                   only bound to CloudFront. We also found vulnerable websites in
ble 5). However, it is very difficult to estimate the exact number                                                                   our sample which utilize other CDNs such as Akamai or Cloudflare
of vulnerable websites without inspecting each of them individu-                                                                     in conjunction with Play 1. We have uncovered these examples in
ally. Moreover, the experiments have been done with the default                                                                      a few days only. An advanced attacker with political and financial
configuration and without taking any other intermediate system                                                                       motivation is easily able to gather much more vulnerable resources
into account. It is, however, very common that content providers
                                                                                                                             10
as they only need to investigate the response headers in order to             on several CDNs which also included WAFs and DDoS protections.
estimate whether a target website or resource is potentially vulnera-         Since we only used a single client to perform the attack, none of
ble to CPDoS attacks. Moreover, the freely available HTTP Archive             CDNs detected the malicious requests.
data sets via Google Big Query include millions of URLs which                     Many web applications configure the proxy cache or the CDN
can be investigated by an attacker. For instance, HTTP Archive                to serve the whole website. This means all resources including dy-
data set httparchive.summary_requests.2018_12_15_desktop                      namic pages and static files are forwarded and processed by the
contains over 9 millions URLs which we considered as highly vul-              cache. To exclude dynamic pages from being implicitly cached,
nerable since the response headers of these resources indicate that           content providers include no-store or max-age=0 to the response
CloudFront in conjunction with Apache HTTPD, Nginx, Amazon                    header, so that each request must be forwarded to the origin server.
S3, Microsoft IIS, and Varnish is used. Among them are also many              If a vulnerable cache in conjunction with a vulnerable server-side
critical websites and resources including Amazon itself, the website          HTTP implementation is used, these resources can be attacked with-
dowjones.com, as well as Logitech which distributes firmware via              out the need to wait and any automation of sending requests. One
CloudFront.                                                                   single malicious request is enough to paralyze the target resource,
                                                                              since each request is forwarded to the origin server. Vulnerable
                                                                              websites which configure the CDN to serve all resources are, e.g.,
5.7    Practical Considerations                                               marines.com, ethereum.org and nasa.gov.
Caches are only vulnerable to CPDoS attacks if they store and reuse               There also many web applications which only configure the
error pages. Web caching systems such as Stackpath, CDNSun,                   cache to store and reuses responses of certain URL paths such as for
KeyCDN and G-Core labs cannot be affected by CPDoS attacks,                   static files in the javascript or images directory. Other URL paths
since these CDNs do not cache error messages at all. This is also             are accordingly not cached at all. Many content providers also
true for Apache HTTPD, Nginx and Squid when using them as an                  maintain subdomains (e.g. static.example.org) or a specific domain
intermediate cache without involving any other vulnerable web                 for static files which are served via a cache. In these cases, only
caching systems.                                                              resources within the cached URL paths or the specific domain can be
   As with other cache poisoning vulnerabilities, CPDoS attacks               affected. To find out whether a distinct response traverses a cache,
are only possible when a vulnerable web caching system does not               an attacker can inspect the response headers. For instance, the Age
contain a fresh copy of the to be attacked resource. That is, if a            response header indicate that a cache is utilized. The main website
shared cache still maintains and reuses a stored fresh response for           of IKEA (ikea.com) does not use CloudFront or any other vulnerable
recurring requests, a malicious request is not able to poison the             HTTP implementations which indicates that this homepage is most
intermediary. The web caching system serves all requests to the               likely not vulnerable to CPDoS attacks. However, IKEA uses a
target resource. None of the requests are forwarded to the origin             specific domain (fw.ota.homesmart.ikea.net) in conjunction with
server until the freshness lifetime is expired, so that no error page         CloudFront to host the update files of their Internet of Things
can be triggered. This means if a cache still owns a fresh response,          devices.
an attacker has to wait until the cached content is stale. The most               Another important limitation of CPDoS attacks is that the web
straightforward information to find out the expiration time is the            caching systems except Fastly do only cache error pages for few
Expires header which indicates the absolute expiration date. If the           minutes or seconds. Fastly stores and reuses the error page for one
response does not contain an Expires header or the expiration time            hour. If this time span is over, then the first benign request to the
of this header is overridden by the max-age or s-maxage directive             target resource is forwarded to origin server and refreshed again.
control directive, the attacker can make use of the Age header. The           Still, to extend the duration of CPDoS attacks, malicious clients can
Age header declares the seconds of stay in the cache. The value of the        resend harmful requests in accordance to the fixed interval.
Age header subtracted from the value of the max-age or s-maxage
directive is the relative expiration time of the cached response. If          6   RESPONSIBLE DISCLOSURE
the cached response is expired, the attacker’s request must be the            All discovered vulnerabilities have been reported to the HTTP
very first request so that it can reach the origin server to trigger          implementation vendors and cache providers on February 19, 2019.
an error page. To increase the likelihood for being the first request,        We worked closely with these organizations to support them in
we send automatized requests with a one second interval when the              eliminating the detected threats. We did not notify the website
response is close to expire. With this technique we were able to              owners directly, but left it to the contacted entities to inform their
successfully attack all twelve vulnerable websites of our spot check          customers.
experiment. Sending regularly performed requests with one second
distance of time is also a useful approach for cached responses               Amazon Web Services (AWS). We reported this issue to the AWS-
which does contain any expiration time information, i.e., resources           Security team. They confirmed the vulnerabilities on CloudFront.
which are implicitly cached. Such responses usually do not contain            The AWS-Security team stopped caching error pages with the status
any max-age or s-maxage directives and Expire headers. Here,                  code 400 Bad Request by default. However, they took over three
the attacker needs to send automatized requests until one of the              months to fix our CPDoS reportings. Unfortunately, the overall
requests is forwarded to the origin server. Moreover, automatized             disclosure process was characterized by a one-way communica-
requests with a one second interval are not considered as harmful             tion. We periodically asked for the current state, without getting
even when they are sent over a long time, since health checks                 much information back from the AWS-Security team. They never
requests can also have the same interval. We tested this technique            contacted us to keep us up to date with the current process. For
                                                                         11
example, we only got noticed about the changed default caching                headers are legitimate auxiliaries to tunnel HTTP methods which
policy by checking back the revision history of their respective              are not supported by WAFs or web browsers. Play 1 and Flask re-
documentation hosted in Github. Thus, we do not have much in-                 turns the error code 404 Not Found or 405 Method Not Allowed
formation on the noticeable amount of time required to resolve                when an unsupported action in X-HTTP-Method-Override header
our reported CPDoS vulnerability, although having asked for it                is received. Both error messages are allowed to be cached according
explicitly. We can only assume that this delay has to do with the             to RFC 7231. Akamai, CDN77, Fastly, Cloudflare, CloudFront, and
large number of affected users they had to test after implementing            Varnish follow this policy and cache such error codes. If these web
according countermeasures. Moreover, Amazon suggests users to                 caching systems are used in combination with one of the mentioned
deploy an AWS WAF in front of the corresponding CloudFront                    web frameworks, these combinations have an actual risk of falling
instance. AWS WAF allows defining rules which drop malicious                  victim to CDPoS attacks, even though they are in conformance with
requests before they reach the origin server.                                 the HTTP standard and do not have any implementation issues.
                                                                              Therefore, the HMO CPDoS attack can be considered as a new kind
Microsoft. Microsoft was able to reproduce the reported issues and
                                                                              of cache poisoning attack which does not exploit any implementa-
published an update to mitigate this vulnerability. They assigned
                                                                              tion issues or RFC violations. This shows that CPDoS attacks do
this case to CVE-2019-0941 [27] which is published in June 2019.
                                                                              not always result from programming mistakes or unintentional
Play 1. The developers of the Play 1 confirmed the reported issues            violations of specification policies, but can also be the exploit of
and provided a security patch which limits the impact of the X-               the conflict between two legitimate concepts. In case of HMO CP-
HTTP-Method-Override header [6]. The security patch is included               DoS attacks, this conflict refers to the usage of method overriding
in the versions 1.5.3 and 1.4.6. Older version are not maintained by          headers and the caching of allowed error messages.
this security patch. Web applications which use older versions of                 Even though we did not detect attack vectors in other web
Play 1 therefore should update to the newest versions in order to             caching systems and HTTP implementations, this does not mean
mitigate CPDoS attacks.                                                       that other constellations are not vulnerable to CPDoS attacks. As
                                                                              shown by Table 1 eight of fifteen tested web caching systems do
Flask. We reported the HMO attack to the developer team of Flask              store error pages and some of them even cache error pages which
multiple times. Unfortunately, we have not received any answer                are not allowed. If an attacker is able to initiate other error pages
form them so far and hence we have to assume, that Flask-based                or even cacheable error code at the target URL, then she may af-
web applications are still vulnerable to CPDoS.                               fect other web caching systems and HTTP implementations with
                                                                              CPDoS attacks as well. James Kettle, for instance, discovered two
7   DISCUSSION                                                                other forms of CPDoS attacks which fortunately are only successful
Using malformed requests to damage web applications is a well-                due to specific implementation issues of the corresponding web
known threat. Request header size limits and blocking meta charac-            application. The first CPDoS attack utilized the X-Forwarded-Port
ters are therefore vital means of protection to avoid known cache             header [21]. This header usually informs the endpoint about the
poisoning attacks as well as other DoS attacks such as request                port that the client uses to connect to the intermediate system,
header buffer flow [26] and ReDoS [38]. Also, many security guide-            which operates in front of the origin server. In the revealed attack,
lines such as the documentation of Apache HTTPD [2], OWASP                    the cached response contained the redirect. A DoS was caused by
[35], and the HTTP standard [12] recommend to block oversized                 the user’s browser trying to follow the cached redirect and timing
headers and meta characters in headers. CPDoS attacks, however,               out. The second attack was able to create a DoS at www.tesla.com
aims to beat these security mechanisms with their own weapons.                due to a faulty WAF configuration [20]. Tesla configured their WAF
HHO and HMC CPDoS attacks intentionally send a request with                   to block certain strings which have been used by other cache poison
an oversized header or harmful meta character with the intent to              attacks. Unfortunately, requests with such strings were blocked by a
get blocked by an error page which will be cached. Along these                403 Forbidden error page which was also cached. This shows that
lines, it is interesting to see that CDN services, which claim to be          HMO, HHO, and HMC are not the only variations of CPDoS attacks.
an effective measure to defeat DoS and especially DDoS attacks,               There are, certainly, many other ways to provoke an error page on
desperately fail when it comes to CPDoS.                                      the origin server. To the best of our knowledge and according to
    According to our experiment results, most of the presented at-            our experiences in developing web applications, it is not unlikely
tack vectors are only feasible when CloudFront is deployed as the             to provoke an 500 Internal Server Error status code or other
underlying CDN, since it is the only analyzed cache which illicitly           5xx errors in real world web applications and services. Akamai and
stores the error code 400 Bad Request. Such a non-conformance                 Cloudflare do cache 5xx error codes. At this point, we did not find
is the main reason for the HHO and HMC attacks. The other major               a way to provoke such error messages in our experiments.
issue for both attacks is fact that the cache forwards oversized head-            Moreover, we need to consider that contemporary web appli-
ers and requests with harmful meta characters. Violations of the              cations and distributed systems in particular are usually layered.
HTTP standard and implementation issues are also the main rea-                That is, they often utilize other intermediate components such as
son for many other cache-related vulnerabilities including request            load balancer, WAFs or other security gateways which are located
smuggling, host of troubles, response splitting, and web deception            between cache and endpoint. Such middleboxes or middleware
attacks. The HMO CPDoS attack is, however, a vulnerability which              may provide other request header size limits, meta character han-
does not exploit any implementation issues and violations of the              dling or header overriding features. Such systems may also react to
HTTP standard. The X-HTTP-Method-Override header or similar                   malicious requests with error codes that could be cached.
                                                                         12
8   COUNTERMEASURES                                                         integrated at the origin server such as ModSecurity do not help
The most intuitive, as well as effective countermeasure, against CP-        against CPDoS attacks. Requests which are blocked by a WAFs at
DoS attacks is to exclude error pages from being cached. However,           the origin can still trigger an error page that is stored by the cache.
content providers which exclude cacheable error codes such as 404              Moreover, we recommend adding a subsection to the "Security
Not Found from being stored, need to consider that this setting             Considerations" section of the RFC 7230 [12] to discuss the con-
may impair the performance and scalability. There two ways to               sequences of non-compliance with the protocol specification in
exclude error pages from being cached. The first approach is to             order to avoid HHO, HMC and other web cache poisoning attacks.
configure the web caching systems to omit the storage of error              The "Security Considerations" section of RFC 7230 mentions cache-
responses. Akamai, CDN77, CloudFront, CloudFront, Fastly, and               poisoning attacks including response splitting and request smug-
Varnish provide options to do so. Content providers can also add the        gling. However, the standard only makes recommendations that
no-store directive to the Cache-Control response header which               relate to these two specific attacks. The specification does not men-
prohibits all caches from storing the content. According to our own         tion that the source of many cache-related attacks lies in violations
evaluation, all tested web caching systems except CloudFront hon-           of the standard. Such an additional description would increase de-
ored the keyword no-store in error pages and still do so. At the            velopers’ awareness of compliance with the specifications. HMO
time of our experiments in February 2019, CloudFront cached error           attacks, on the other hand, cannot be avoided by complying with
pages for five minutes by default and even did so when no-store             the standard, as they are based on non-standard means which is
was included in the error response header. The only way to avoid            the X-HTTP-Method-Override header in this case. To avoid HMO
storing error pages in CloudFront was to disable each error code            attacks while maintaining the scalability, content providers do not
from caching via the CDN’s configuration interface. Fortunately,            need to exclude the 404 Not Found and 405 Method Not Allowed
AWS changed the behavior of caching error pages after our CPDoS             error code from caching. Here, vulnerable web frameworks must
reporting. One important change is that 400 Bad Request error               follow the approach of Symfony, Lavarel as well as the plugins of
pages are not cached by default anymore. CloudFront only caches             Django and Express.js. These HTTP implementations support the
400 Bad Request error messages if they include a max-age or                 method overriding headers, but only consider to change the action
s-maxage control directive [1].                                             when the method in the request line is POST. By this, a 404 Not
   As mentioned before, the disobey of the HTTP standard in terms           Found error page cannot be triggered by malicious GET request,
of ignoring control directives is the main cause for many cache-            since method overriding headers are ignored. When trying to poi-
related vulnerabilities. Beside the consideration of cache-related          son the cache with a POST request with a method override header
control directives, web caching systems must, therefore, only store         including GET, the returning response is not stored by any tested
error codes which are permitted by the HTTP standard. Status codes          cache. Also, the use of non-standard headers is a general approach
such as 400 Bad Request are not allowed to be cached, since this            to conduct other cache-poisoning attacks as described by James
error message is only dedicated to a request which is malformed or          Kettle [22]. It is the responsibility of HTTP implementations to
invalid. Other error codes such as 404 Not Found, 405 Method Not            carefully integrate non-standard headers to avoid such attacks. To
Allowed or 410 Gone can be cached, since they provide error infor-          analyze impact of standardized or non-standard headers in respect
mation which is valid for all clients. Also, HTTP implementations           to caches, developers and software testers can use, e.g., the testing
have to use the appropriate status code for the corresponding error         tools of Nguyen et al. [31] and Mark Nottingham [33].
case. Table 3 shows that almost all tested system return the status
code 400 Bad Request for an oversized request header. IIS even
                                                                            9   CONCLUSION AND OUTLOOK
replies with status the cacheable 404 Not Found error code when a
limit for a specific request header is exceeded. Both error messages        Vulnerabilities stemming from the semantic gap result in serious
are not the appropriate one for requests exceeding the header size          security threats. Distributed systems are especially prone to such
limit. According to HTTP standard, the appropriate error code is            attacks as they are composed by distinct layers. Their existence is
431 Request Header Fields Too Large. Such error information                 one major prerequisite for the different interpretation of an object,
is not stored and reused by any of the tested web caching systems.          in this case the application messages floating through the interme-
To test the compliance and behavior of caches, we recommend to              diaries.
use the cache testing tool of Nguyen et al. [31] or Mark Nottingham            In this paper we extended the known vulnerabilities rooted
[33].                                                                       in a semantic gap by introducing a class of new attacks, "Cache-
   Another very effective countermeasure against CPDoS attacks is           Poisoned Denial-of-Service (CPDoS)". We systematically study how
the usage of WAFs. Many CDNs provide the option to enable WAFs              to provoke errors during request processing on an origin server
in order to protect web applications against malicious requests. To         and the case, in which error responses get stored and distributed
avoid CPDoS attacks, content providers can configure the WAF to             by caching systems. We introduce three concrete CPDoS attack
explicitly block oversized requests, requests with meta characters          variations that are caused by the inconsistent treatment of the
or malicious headers. Using WAFs is, however, only effective if the         HTTP method override header, header size limits and the parsing
WAF is implemented in the cache or in front of the cache, so that           of meta characters. We show the practical relevance by identifying
harmful requests can be eliminated before they are forwarded to the         the amount of available web caching systems that are vulnerable to
origin server. The experiments in Section 5 and the CPDoS attack            CPDoS. The consequences can be severe as one simple request is
of James Kettle on www.tesla.com [20] show that WAFs which are              sufficient to paralyze a victim website within a large geographical
                                                                            region (see Figure 8 in Appendix B). Depending on the resource
                                                                       13
that is being blocked by an error page, the web page or web service                             [18] Suman Jana and Vitaly Shmatikov. 2012. Abusing File Processing in Malware
can be disabled piecemeal (see Figure 6 in Appendix A).                                              Detectors for Fun and Profit. In 33rd IEEE Symposium on Security and Privacy.
                                                                                                     80–94. https://doi.org/10.1109/SP.2012.15
   According to our experiments 11% of the DoD web sites, 30% of                                [19] Y. Jia, Y. Chen, X. Dong, P. Saxena, J. Mao, and Z. Liang. 2015. Man-in-the-
the Alexa Top 500 websites and 16% of the URLs in the analyzed                                       browser-cache. Computers and Security 55, C (2015), 62–80. https://doi.org/10.
                                                                                                     1016/j.cose.2015.07.004
HTTP Archive data set are potentially vulnerable to CPDoS attacks.                              [20] J. Kettle. 2018. Bypassing Web Cache Poisoning Countermeasures. https:
These cached contents include also mission-critical firmware and                                     //portswigger.net/blog/practical-web-cache-poisoning
update files. Considering the fact that modern distributed appli-                               [21] J. Kettle. 2018. Denial of service via cache poisoning . https://hackerone.com/
                                                                                                     reports/409370
cations often follow the Mircoservices [29] and Service-Oriented                                [22] J. Kettle. 2018. Practical Web Cache Poisoning. In Blackhat USA. https:
Architecture (SOA) [10] design principles where services are imple-                                  //portswigger.net/blog/practical-web-cache-poisoning
mented with different programming languages and are operated by                                 [23] A. Klein. 2004. Divide and Conquer - HTTP Response Splitting, Web Cache
                                                                                                     Poisoning Attacks, and Related Topics. White Paper. Sanctum, Inc. https:
distinct entities, more semantic gap vulnerabilities may appear in                                   //dl.packetstormsecurity.net/papers/general/whitepaper_httpresponse.pdf
the future. Hence, a more in-depth understanding of such vulnera-                               [24] C. Linhart, A. Klein, R. Heled, and S. Orrin. 2005. HTTP REQUEST SMUGGLING.
                                                                                                     http://www.cgisecurity.com/lib/HTTP-Request-Smuggling.pdf
bilities needs to be gathered in order to develop robust safeguards                             [25] L. Masinter. 1998. Hyper Text Coffee Pot Control Protocol (HTCPCP/1.0). RFC 2324.
that do not depend on particular implementation and concatenation                                    IETF. https://tools.ietf.org/html/rfc2324
of system layers.                                                                               [26] NATIONAL VULNERABILITY DATABASE. 2010. CVE-2010-2730 Detail. CVE
                                                                                                     2010-2730. Nist. https://nvd.nist.gov/vuln/detail/CVE-2010-2730
                                                                                                [27] NATIONAL VULNERABILITY DATABASE. 2019. CVE-2019-0941 Detail. CVE
                                                                                                     2019-0941. Nist. https://nvd.nist.gov/vuln/detail/CVE-2019-0941
ACKNOWLEDGMENT                                                                                  [28] Netcraft. 2019. January 2019 Web Server Survey. https://news.netcraft.com/
First of all, we would like to thank all reviewers for their thoughtful                              archives/2019/01/24/january-2019-web-server-survey.html
                                                                                                [29] S. Newman. 2015. Building microservices: designing fine-grained systems. O’Reilly.
remarks and comments. Moreover, we would especially like to thank                               [30] H. V. Nguyen, L. Lo Iacono, and H. Federrath. 2018. Systematic Analysis of Web
Shuo Chen and James Kettle for their feedback and suggestions.                                       Browser Caches. In 2nd International Conference on Web Studies (WS). https:
                                                                                                     //doi.org/10.1145/3240431.3240443
Finally, we appreciated the disclosure processes with the AWS-                                  [31] H. V. Nguyen, L. Lo Iacono, and H. Federrath. 2019. Mind the Cache: Large-Scale
Security team, the Microsoft Security Response Center and the Play                                   Analysis of Web Caching. In 34rd ACM/SIGAPP Symposium on Applied Computing
Framework development team.                                                                          (SAC). https://doi.org/10.1145/3297280.3297526
                                                                                                [32] H. Nielsen and S. Lawrence. 2000. An HTTP Extension Framework. RFC 2774.
   This work has been funded by the German Federal Ministry of                                       IETF. https://tools.ietf.org/html/rfc2774
Education and Research within the funding program "Forschung                                    [33] M. Nottingham. 2019. HTTP Caching Tests. https://cache-tests.fyi/
an Fachhochschulen" (contract no. 13FH016IX6).                                                  [34] M. Nottingham and R. Fielding. 2012. Additional HTTP Status Codes. RFC 6585.
                                                                                                     IETF. https://tools.ietf.org/html/rfc6585
                                                                                                [35] OWASP. 2017. Denial of Service Cheat Sheet. https://www.owasp.org/index.
                                                                                                     php/Denial_of_Service_Cheat_Sheet#Mitigation_3:_Limit_length_and_size
REFERENCES                                                                                      [36] L. Richardson and S. Ruby. 2008. RESTful web services. O’Reilly Media, Inc.
 [1] Amazon. 2019. How CloudFront Processes and Caches HTTP 4xx and 5xx Status                  [37] J. Somorovsky, M. Heiderich, M. Jensen, J. Schwenk, N. Gruschka, and L. Lo Iacono.
     Codes from Your Origin. https://docs.aws.amazon.com/AmazonCloudFront/                           2011. All Your Clouds Are Belong to Us: Security Analysis of Cloud Management
     latest/DeveloperGuide/HTTPStatusCodes.html                                                      Interfaces. In 3rd ACM Workshop on Cloud Computing Security Workshop. ACM,
 [2] Apache HTTP Server Project. 2019. Security Tips. https://httpd.apache.org/                      New York, NY, USA, 3–14. https://doi.org/10.1145/2046660.2046664 http://doi.
     docs/trunk/misc/security_tips.html                                                              acm.org/10.1145/2046660.2046664.
 [3] G. Barish and K. Obraczke. 2000. World Wide Web caching: trends and techniques.            [38] C.-A. Staicu and M.l Pradel. 2018. Freezing the Web: A Study of ReDoS Vulnera-
     IEEE Communications Magazine 38, 5 (2000), 178–184. https://doi.org/10.1109/                    bilities in Javascript-based Web Servers. In 27th USENIX Conference on Security
     35.841844                                                                                       Symposium (USENIX Security). USENIX Association, Berkeley, CA, USA, 361–376.
 [4] M. Belshe, R. Peon, and M. Thomson. 2015. Hypertext Transfer Protocol Version 2                 http://dl.acm.org/citation.cfm?id=3277203.3277231
     (HTTP/2). RFC 7540. IETF. https://tools.ietf.org/html/rfc7540                              [39] S. Triukosea, Z. Al-Qudad, and M. Rabinovich. 2009. Content Delivery Networks:
 [5] T. Bray. 2016. An HTTP Status Code to Report Legal Obstacles. RFC 7725. IETF.                   Protection or Threat?. In 14th European Symposium on Research in Computer
     https://tools.ietf.org/html/rfc7725                                                             Security (ESORICS). https://doi.org/10.1007/978-3-642-04444-1_23
 [6] A. Chatiron. 2019. Define allowed methods used in ’X-HTTP-Method-Override’.
     https://github.com/playframework/play1/issues/1300
 [7] J. Chen, J. Jiang, H. Duan, N. Weaver, T. Wan, and V. Paxson. 2016. Host of
     Troubles: Multiple Host Ambiguities in HTTP Implementations. In 23th ACM
     SIGSAC Conference on Computer and Communications Security (CCS). https:
     //doi.org/10.1145/2976749.2978394
 [8] G. Clemm and J. Whitehead J. Crawford, J. Reschke. 2010. Binding Extensions
     to Web Distributed Authoring and Versioning (WebDAV). RFC 5842. IETF. https:
     //tools.ietf.org/html/rfc5842
 [9] L. Dusseault. 2007. HTTP Extensions for Web Distributed Authoring and Versioning
     (WebDAV). RFC 4918. IETF. https://tools.ietf.org/html/rfc4918
[10] T. Erl. 2007. SOA Principles of Service Design. Prentice Hall PTR.
[11] R. Fielding, M. Nottingham, and J. Reschke. 2014. Hypertext Transfer Protocol
     (HTTP/1.1): Caching. RFC 7234. IETF. https://tools.ietf.org/html/rfc7234
[12] R. Fielding and J. Reschke. 2014. Hypertext Transfer Protocol (HTTP/1.1): Message
     Syntax and Routing. RFC 7230. IETF. https://tools.ietf.org/html/rfc7230
[13] R. Fielding and J. Reschke. 2014. Hypertext Transfer Protocol (HTTP/1.1): Semantics
     and Content. RFC 7231. IETF. https://tools.ietf.org/html/rfc7231
[14] Flask. 2010. Adding HTTP Method Overrides. http://flask.pocoo.org/docs/1.0/
     patterns/methodoverrides/
[15] O. Gil. 2017. WEB CACHE DECEPTION ATTACK. In Blackhat USA. https:
     //blogs.akamai.com/2017/03/on-web-cache-deception-attacks.html
[16] K. Holtman and A. Mutz. 1998. Transparent Content Negotiation in HTTP. RFC
     2295. IETF. https://tools.ietf.org/html/rfc2295
[17] IEEE Spectrum. 2018. Interactive: The Top Programming Languages 2018. https:
     //spectrum.ieee.org/static/interactive-the-top-programming-languages-2018
                                                                                           14
APPENDIX A: ILLUSTRATIVE EXAMPLES OF CPDOS ATTACK
A.1 Ethereum-website




Figure 6: These screenshots show the start page of the website ethereum.org and how parts as well as the whole page are
rendered inaccessible due to a successful CPDoS attack. More specifically, this website has been vulnerable to HHO CPDoS.



A.2 Marines-website




Figure 7: These two screenshots show the start page of the website marines.com before a) and after b) a successful CPDoS
attack. More specifically, this website has been vulnerable to HHO CPDoS.


                                                           15
APPENDIX B: CPDOS ATTACK SPREAD

                        Legend:   none-affected region,   affected region,   attacker,   origin server




                                                             (a)




                                                             (b)

Figure 8: Affected CDN regions when sending a CPDoS attack from a) Frankfurt, Germany and b) Northern Virginia, USA to
a victim origin server in Cologne, Germany.




                                                             16
