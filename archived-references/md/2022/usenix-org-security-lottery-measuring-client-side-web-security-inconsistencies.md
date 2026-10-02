---
type: Article
title: "The Security Lottery: Measuring Client-Side Web Security Inconsistencies"
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/roth"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:24:23+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/roth"
    title: "The Security Lottery: Measuring Client-Side Web Security Inconsistencies"
    author: Sebastian Roth, Stefano Calzavara, Moritz Wilhelm, Alvise Rabitti, Ben Stock
  - id: capture
    resource: "https://web.archive.org/web/20221217202111/https://www.usenix.org/conference/usenixsecurity22/presentation/roth"
also_at:
  - "https://www.usenix.org/system/files/sec22-roth.pdf"
  - "https://www.usenix.org/system/files/usenixsecurity22-roth.pdf"
  - "https://www.usenix.org/system/files/sec22_slides-roth.pdf"
authors:
  - Sebastian Roth
  - Stefano Calzavara
  - Moritz Wilhelm
  - Alvise Rabitti
  - Ben Stock
canonical_url: ""
cited_by:
  - "2022.md:80"
commit: ""
content_sha256: 2ab51ff32cebe08445804d8b981bf3b5cce09553254cc9ee87185b34c4b34ee8
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/roth"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: ed083f55b12b7b1c25ac7a939942bac92cc850107fa7201cbf1a1c2685bef7b6
retrieved_from: "https://www.usenix.org/system/files/sec22-roth.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:24:23+00:00"
slug: usenix-org-security-lottery-measuring-client-side-web-security-inconsistencies
snapshot: 20221217202111
title_english: ""
translation_file: ""
translation_of: ""
---

# The Security Lottery: Measuring Client-Side Web Security Inconsistencies

**The Security Lottery: Measuring Client-Side Web Security Inconsistencies** - Sebastian Roth, Stefano Calzavara, Moritz Wilhelm, Alvise Rabitti, Ben Stock, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/roth>
- Also published at: <https://www.usenix.org/system/files/sec22-roth.pdf>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity22-roth.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22_slides-roth.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-roth.pdf (live) on 2026-08-19
- Capture timestamp: 20221217202111
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# The Security Lottery: Measuring Client-Side Web Security Inconsistencies

--- page 1 ---

The Security Lottery: Measuring Client-Side
 
Web Security InconsistenciesSebastian Roth, CISPA Helmholtz Center for Information Security;
 
Stefano Calzavara, Università Ca’ Foscari Venezia; Moritz Wilhelm,
 
CISPA Helmholtz Center for Information Security; Alvise Rabitti, 
Università Ca’ Foscari Venezia; Ben Stock, CISPA Helmholtz Center
 
for Information Securityhttps://www.usenix.org/conference/usenixsecurity22/presentation/roth

--- page 2 ---

This paper is included in the Proceedings of the 
31st USENIX Security Symposium.August 10–12, 2022 • Boston, MA, USA978-1-939133-31-1Open access to the Proceedings of the 
31st USENIX Security Symposium is 
sponsored by USENIX.

--- page 3 ---

The Security Lottery: Measuring Client-Side Web Security Inconsistencies
Sebastian Roth†, Stefano Calzavara‡, Moritz Wilhelm†, Alvise Rabitti‡, Ben Stock†
{sebastian.roth,moritz.wilhelm,stock}@cispa.de; {stefano.calzavara,alvise.rabitti}@unive.it
†
CISPA Helmholtz Center for Information Security
‡
Università Ca' Foscari Venezia
AbstractTo mitigate a myriad of Web attacks, modern browsers sup-port client-side security policies shipped through HTTP re-sponse headers. To enforce these defenses, the server needs tocommunicate them to the client, a seemingly straightforwardprocess. However, users may access the same site in variegateways, e.g., using different User-Agents, network access meth-ods, or language settings. All these usage scenarios shouldenforce the same security policies, otherwise asecurity lotterywould take place: depending on specic client characteristics,different levels of Web application security would be providedto users (inconsistencies). We formalize security guaranteesprovided through four popular mechanisms and apply this tomeasure the prevalence of inconsistencies in the security poli-cies of top sites across different client characteristics. Basedon our insights, we investigate the security implications ofboth deterministic and non-deterministic inconsistencies, andshow how even prominent services are affected by them.
1 IntroductionWeb applications are one of the primary access points tosecurity-sensitive data and functionality which we use on adaily basis, hence they represent a primary target for attackers.Unfortunately, the attack surface against Web applications isvery large and Web application security is a complicated topicwhich requires actions at very different levels, including theuse of transport layer encryption via HTTPS, the implemen-tation of server-side sanitization routines against attacks likeSQL injection, and much more. An important and increas-ingly popular defense layer of Web applications isclient-sideWeb security, i.e., the adoption of appropriate browser-sidedefenses to prevent or mitigate relevant Web threats [37].Examples of such defenses which are quite popular on high-prole Web sites include cookie security attributes, ContentSecurity Policy (CSP) and HTTP Strict Transport Security(HSTS). Several papers already studied (and criticized) theadoption of different client-side security mechanisms in thewild. For example, cookie security attributes turned out to beunderused by site operators [5,39], CSP is most often cong-ured incorrectly [28,43] and HSTS had a hard time gettingtraction even on top sites [22,33]. However, these studieswere performed in a xed and often unspecied measurementsetting, e.g., measuring security using a single crawler runninga specic browser on a machine with a static IP.In this paper, we investigate the client-side security of topsites from a new angle. Our analysis starts from the observa-tion that client-side security inherently depends on the correctcommunication of security policies from the server to theclient. This seemingly straightforward process might hidesubtleties, which can affect Web application security and itslarge-scale measurement [18]. In particular, we observe thatthere is no guarantee that two clients accessing the same URLreceive the same security policies. For example, clients ac-cessing the same Web application from different geolocationsmight be served by different servers, due to the existence ofseveral localized variants of the same site. Moreover, the sameperson might access the same Web application through dif-ferent User-Agents, e.g., Chrome on their desktop computerand Safari on their iOS mobile device, while the same clientmight access the same Web application using different formsof network access, e.g., through a VPN. Finally, even the sameHTTP request might receive different HTTP responses whenit is sent multiple times by the same client apparently underthe very same conditions, due to the DNS system resolvingthe same hostname to different IP addresses and the possibleintervention of load balancers and HTTP middleboxes [16].Intuitively, we (and Web users) would like all the responsesserved across these multiple legitimate scenarios to enforcethe same security policies, otherwise asecurity lotterywouldtake place: depending on specic client characteristics, differ-ent levels of Web application security would be provided tousers. We refer to this class of potential security aws asin-consistencies. Unfortunately, our research shows that multipleclient characteristics might inadvertently affect Web applica-tion security in the wild, thus leaving users of prominentservices unprotected against both Web and network attacks.

--- page 4 ---

USENIX Association
31st USENIX Security Symposium 2047

--- page 5 ---

ContributionsIn this paper we measure the prevalence of inconsistenciesin the security policies of top sites across different clientcharacteristics and we quantify their security implications:
1.We propose a data collection methodology tailored to ouranalysis and we build a dataset of 13,626,145 responsescollected from the 10,000 highest-ranking sites availablethrough HTTPS (based on Tranco [25]), while testinga number of different client characteristics. Our testsinclude the use of different User-Agents, network accessmethods and language settings.
2.We introduce general denitions of consistency for client-side security mechanisms and we instantiate them to a setof popular defenses available in modern browsers. Ourdenitions aresemantics-based, i.e., they only captureinconsistencies with a potential security import, ratherthan supercial syntactic differences or other types offalse positives coming from the different enforcementmodels of different security mechanisms.
3.We apply our denitions to the collected data and wereport on the key ndings. Our measurement shows thata signicant fraction of the analyzed Web sites suffersfrom different types of client-side security inconsisten-cies. Remarkably, the majority of them can be attributedto specic client characteristics, which identify weakspots in the security conguration, while the others canbe attributed to non-deterministic factors, which maynevertheless be exploited by attackers.
2 Background and Related WorkWe rst outline the relevant security mechanisms for our paperand then review the related work in this area.
2.1 Client-Side Security MechanismsAll the security mechanisms in the present section are acti-vated by means of HTTP response headers or (in some cases)by making use of meta tags within the HTML. In our analysiswe only focus on security policies set via response headers,which is the most common deployment scenario indicated byprior work [6, 28].Threat ModelThe client-side security mechanisms understudy are designed to prevent different threats coming fromWeb attackersandnetwork attackers, the standard threat mod-els of the Web security literature. Web attackers operate amalicious site, sayevil.com, and leverage it to launch at-tacks against target Web applications. Relevant Web threats in-clude Cross Site Scripting (XSS), Cross Site Request Forgery(CSRF) and click-jacking. Network attackers extend the capa-bilities of Web attackers with full control of the unencryptedHTTP trafc, e.g., because they have access to the accesspoint where the victim is connected.Cookie Security AttributesCookies are the traditionalstate management mechanism of the HTTP protocol, yet theysuffer from a range of security problems in their default con-guration. Site operators are thus recommended to improvethe level of protection of their cookies by marking them withappropriate
security attributes
.TheHttpOnlyattribute ensures that cookies are not accessi-ble from JavaScript, which prevents cookie theft through mali-cious scripts, e.g., injected through XSS. TheSecureattributeguarantees that cookies are never sent in plain HTTP requests,but only over encrypted HTTPS connections, which rules outnetwork snifng attempts. The combination of HttpOnly andSecure signicantly raises the condentiality guarantees ofcookies, which is particularly important to protect againstsession hijacking [5, 11].The latest addition to the set of attributes is calledSameSite,which is meant to protect against CSRF attacks. If the attributeis set to Lax, cookies are only sent on cross-site requests whenthe main frame is navigated using a safe method like GET.If instead the attribute is set to Strict, cookies are never sentacross sites. Some modern browsers like the latest versions ofChrome automatically promote all cookies to SameSite Lax,hence site operators can opt out from protection by settingthe SameSite attribute to None for compatibility reasons.Content Security PolicyContent Security Policy(CSP)is a security mechanism originally aimed at mitigating thedangers of XSS and later extended to cover additional threats.In essence, a CSP is meant to ensure that only resourcesexplicitly allowed by the developer of a page can be includedtherein. This is achieved by binding directives of the formtype-src (for different content types, e.g., scripts, images, etc.)to a set of allowed sources, which can be as specic as a fullURL or as unspecic ashttps://*. Script execution canalso be controlled by allowing only script tags bearing a validnonce attribute or matching a given hash, which should bepreferred over allowlists [43].Enforcing a CSP with a script-src (or alternatively a default-src) directive implicitly disables a page's ability to run in-line scripts, inline event handlers, and string-to-code trans-formation functions like eval, which are the most commonXSS vectors. These restrictions can be lifted by the 'unsafe-inline' or 'unsafe-eval' source-expression, respectively, al-though 'unsafe-inline' is voided by the use of nonces / hashesin modern browsers to authorize individual scripts. To supportdynamic inclusion of scripts, scripts with a valid nonce canpropagate trust to recursively included scripts via the 'strict-dynamic' source-expression. This source-expression voids

--- page 6 ---

2048 31st USENIX Security Symposium
USENIX Association

--- page 7 ---

any allowed hosts for script inclusion, forcing the exclusiveuse of nonces / hashes to control scripts.Other popular use cases of CSP includeframing controlandTLS enforcement[28]. To support the former, CSP in-troduced the frame-ancestors directive, which denes an al-lowlist for framing. For the latter, CSP supports two usefuldirectives: upgrade-insecure-requests forces an automatedupgrade from HTTP to HTTPS for all resources loaded bythe page, while block-all-mixed-content strengthens the tradi-tional mixed content policy implemented by major browsersto rule out all forms of HTTP communication from HTTPSpages. Note that upgrade-insecure-requests effectively sub-sumes block-all-mixed-content.X-Frame-OptionsX-Frame-Options (XFO) is one of theoldest security headers, originally introduced in Internet Ex-plorer to defend against click-jacking attacks by enforcing aframing control policy. Though now deprecated in favor ofthe frame-ancestors directive of CSP, XFO is still massivelydeployed in the wild [7].In modern browsers, XFO can be set to two different values:SAMEORIGIN allows framing only on pages with the sameorigin of the framed content; DENY instead forbids any formof framing. XFO also used to support a third option, calledALLOW-FROM, which could be used to allow framing onlyfrom a given URL, however major browsers like Chrome andFirefox do not support it anymore or even never supported it.HTTP Strict Transport SecurityAlthough the Web is fastprogressing towards a full usage of transport layer encryptionthrough TLS, browsers do not automatically upgrade all con-nections to HTTPS to avoid breakage. This introduces thedanger of attackers who force a victim's browser to make arequest towards the HTTP version of a site, thus allowing theattacker to perform impersonation attempts, e.g., for phishingor to sniff non-Secure cookies.To prevent these threats,HTTP Strict Transport Security(HSTS) was introduced. In particular, once set for a specicHTTPS host via the Strict-Transport-Security header, anyconnection towards that host is automatically upgraded toHTTPS by the browser for the duration specied in the max-age attribute (or until a HSTS header with max-age set to 0is received). Optionally, HSTS can specify the includeSub-Domains directive, which extends protection to all the subdo-mains of the host setting the security header. This is impor-tant to defend against network attackers who could otherwiseforge cookies from HTTP subdomains and to prevent theexltration of domain cookies lacking the Secure attribute.Due to its design, HSTS faces a Trust-On-First-Use(TOFU) problem because network attacks can be performedbefore TLS connections are enforced via the Strict-Transport-Security header in the rst response. In order to get rid of thisissue, hosts supporting HSTS can also ask for inclusion inthe HSTS preload list [26], which is a public list of knownhosts where browsers should activate HSTS by default. Tobe accepted into the HSTS preload list, a host must serve avalid HSTS header with max-age set to at least one year, haveenabled includeSubDomains, and include the preload direc-tive. Since preloading implies a fully functional HTTPS setupfor all of a site's subdomains, which might cause problems inpractice, the preload list offers a feature for removal. For thisremoval request to go through, a site has to serve a valid HSTSheader (i.e., at least specifying a max-age value)withoutthepreload directive [27]. After this, the site is removed from thepreload list without further notice to the site operator.
2.2 Related WorkWe categorize related work in three key areas: client-side Websecurity, Web security inconsistencies and Web measurementsfrom different vantage points.Client-Side Web SecurityClient-side Web security re-ceived an increasing amount of attention by the researchcommunity in the last few years. Prior research studied theadoption of different client-side security mechanisms, includ-ing cookie security attributes [5,39], CSP [6,28,43] andHSTS [22,33]. Stock et al.[37]investigated the historicalevolution of the most popular client-side security mechanismsusing archival data. However, none of these works focusedon client-side Web security inconsistencies, because they an-alyzed the considered security mechanisms using a single,xed client with a specic network access method.Web Security InconsistenciesOther related studies arethose on Web security inconsistencies, i.e., conicting con-gurations of protection mechanisms leading to insecurity.This problem has been explored from different angles. A rstwork investigated inconsistencies between the desktop andthe mobile version of the same site [21]. This work is largelycomplementary to ours, because it analyzes vulnerabilitiesenabled by security inconsistencies between a desktop sitelikewww.foo.comand its mobile variantm.foo.com. Ouranalysis instead disregards such cases, becausewww.foo.comandm.foo.comare not necessarily the same Web applica-tion, hence they might legitimately have different securityrequirements. Our methodology (see Section 5) is designedto minimize false positives by taking the specic enforcementmodels of existing security mechanisms into account and fo-cuses on security inconsistencies in the same Web applicationenabled by a wide range of different client characteristics(including the use of a mobile client, but not limited to that).Similar considerations apply to an analysis of HTTPS securitymismatches between
www.foo.com
and its parent [1].Another complementary piece of work includes a large-scale study of how different User-Agents enforce the sameclick-jacking protection policy differently [7]. This is a dif-ferent form of Web security inconsistency coming from the

--- page 8 ---

USENIX Association
31st USENIX Security Symposium 2049

--- page 9 ---

variegate cross-browser support of specic security mech-anisms [31,32], something which we abstract from by as-suming the use of a modern, fully compliant client. A lastwork on Web security inconsistencies is the recent Site Policyproposal, designed to tame inconsistent congurations of thesame security mechanism across different pages of the samesite, which is yet another orthogonal security issue [8].Web MeasurementsPrior work proposed the use of multi-ple vantage points for Web measurements [17,18] and severalpapers measured the impact of different vantage points onspecic aspects. Notable examples include papers analyz-ing how geolocation may affect the behavior of Web track-ers [13,14,30,40] and the security guarantees of HTTPS [29].The latter work also analyzes downgrades in the use of secu-rity headers as part of a broader study, though its treatment isnot nearly as comprehensive as that of our paper: it considersa more limited set of headers and use cases, it only coversa specic type of inconsistency (lack of header) and it onlyfocuses on a single factor (geolocation). Other work studiedsuspicious content manipulation performed by free proxies,VPNs and middleboxes [12,16,19,20,24,41,42]. Thesepapers identied a range of malicious behaviors and shadypractices, including script injection, cookie injection, TLSdowngrades and generic header manipulations. Orthogonally,we are only interested in server-side responseswithoutanynetwork manipulation, i.e., we measure the impact of differentlegitimate access methods on Web application security.
3 Motivation for Our StudyIn contrast to prior work, we measure client-side Web secu-rity across different client characteristics to identify specicconditions that attackers might exploit to identify weak spotsin protection. We discuss a few relevant examples below.A Web site may set the Secure attribute on its sessioncookies when it is accessed using Chrome, but may forget theattribute when it is accessed using Opera. This would leaveOpera users vulnerable to cookie snifng attempts over HTTP,which may enable session hijacking attacks against a specicuser population. In terms of exploitation, a network attackercould just try a traditional cookie leak attempt, e.g., injectingan HTTP image pointing to the target site, and prot from thepresence of Opera users on the network under her control.A Web site may congure its CSP differently when ac-cessed from different countries, e.g., due to the use of differ-ent ad networks, and there is no guarantee that all these CSPsenjoy the same security guarantees. For example, users fromspecic countries may be left unprotected against XSS, soa Web attacker might attempt targeted attacks where a linkcontaining an XSS payload is only shared on social mediaplatforms which are most popular on the vulnerable country.Additionally, security mechanisms might change whensites are accessed from different geolocations. These can ei-ther occur because a visitor originates from a specic countryor because they rely on a VPN or the Onion network to spooftheir geolocation. Both the geolocation and the fact that a useris connecting through the Onion network may have an impacton security, which can be leveraged by an attacker if thesechanges are deterministic based on the (spoofed) geolocation.An orthogonal issue is that sites may change security head-ers in a non-deterministic fashion. Indeed, we observed dif-ferent security policies on the same Web page even whenthe page was accessed under the very same client characteris-tics, due to non-deterministic factors like load balancers. Thismeans that users may occasionally enjoy different levels ofprotection even when no observable condition changes, hencein our threat model we also consider determined attackers whoactively try to abuse such inconsistencies opportunistically.In the following two sections, we lay the ground work forour analysis. First, we explain our measurement setup andchosen client characteristics, as well as how we selected sitesto ensure a measurement without network-level interference.Second, we formalize a denition of consistency and apply itto the previously outlined security mechanisms.
4 Data Collection FrameworkHere, we discuss which types of factors we investigate tounderstand differences in client-side Web security guarantees.We then outline which information we use to collect data foreach of the factors and we discuss our key design choices.
4.1 Scope of the StudyWe assume the use of a modern client implementing all thesecurity mechanisms in Section 2, e.g., the latest versions ofChrome and Firefox as of January 1, 2022. We thus excludethe use of legacy clients, because it is clear that this discour-aged practice may severely downgrade Web application secu-rity, e.g., because CSP is not supported by the browser. Wealso assume that modern clients correctly implement all thesecurity mechanisms according to their ofcial specications,i.e., if two different clients receive the same security headers,we assume they enforce the same intended level of protection.Finding bugs in the implementation of client-side securitymechanisms is an orthogonal issue [32].We identify threefactorswhich users may legitimatelymanipulate as part of their everyday Web browsing experi-ence, without realizing that they can unintendedly affect Webapplication security:
1.User-Agent: users have different tastes and might preferdifferent browsers, e.g., due to the privacy policies theyimplement by default. Moreover, the same user mightuse different browsers on different devices, possibly run-ning different operating systems. As long as users makeuse of a modern, up-to-date browser, they likely do not

--- page 10 ---

2050 31st USENIX Security Symposium
USENIX Association

--- page 11 ---

FactorSet of testsTestsUser-AgentWindows clientUser-Agent header: Chrome 96, Firefox 95, Edge 96, Opera 82Linux clientUser-Agent header: Chrome 96, Firefox 95, Opera 82macOS clientUser-Agent header: Chrome 96, Firefox 95, Edge 96, Opera 82, Safari 15.2Android clientUser-Agent header: Chrome 96, Firefox 95, Opera 96iOS clientUser-Agent header: Chrome 96, Firefox 95, Edge 86, Safari 15.2Vantage PointVPN serviceServers from
hidemyass.com
- 1 per country (218 countries)Onion networkStandard Onion client - 1 end-node per country (49 countries)Client CongurationLanguageAccept-Language header: en, es, cn, ru, deTable 1: Selected client conditions that might inuence the received security headersexpect Web application security to be affected, yet it ispossible that a site sets up different congurations basedon the value of the User-Agent header of the incomingrequests for generic reasons. This practice, known asUser-Agent snifng, might leave some User-Agents un-protected against specic classes of attacks. Note that weuse the terms
browser
and
User-Agent
interchangeably.
2.Vantage Point: users may access a given site from differ-ent geographical vantage points. Users may not expectthis practice to affect Web application security, yet it ispossible that the geolocation has an impact on dynami-cally loaded advertisement, which in turn might requirea different server-side conguration of CSP. Further, theexit nodes of the Onion network are publicly known,hence a connection through the Onion network mightresult in a different response, possibly introducing a dif-ference in security.
3.Client Conguration: some conguration settings mightinuence the way clients interact with Web sites. Forexample, the language of the client is normally adver-tised in the Accept-Language header and the site mightuse this information to redirect the client to a localizedhomepage served by a different host, possibly with adifferent security conguration. We only focus on thisaspect (language) in our analysis for simplicity.Table 1 identies for each factor a set of possibletests,which can be easily simulated in a black-box fashion by aWeb crawler. We identify the respective User-Agent strings forthe browsers in the table via a public online repository [45].
4.2 Challenges and Design ChoicesThe discussion in the previous section does not directly yielda dataset construction procedure, due to a couple of problemswe have to deal with. The rst is related to the sheernumberof requeststo send to each Web site, because it is possible thatsecurity policies are inuenced by a combination of multiplefactors. To mitigate this, we only cover a subset of all thepossible combinations by testing different factors in isolation:1.User-Agent: when testing different User-Agents, we ac-cess the network through a local machine with a GermanIP, and we do not set the Accept-Language header.
2.Vantage Point: when testing different vantage points,we set the User-Agent header to Chrome 96 for Win-dows and we do not set the Accept-Language header.We use hidemyass VPN1to access the sites from 218countries and additional 49 different countries throughfor the Onion network.
3.Client Conguration: when testing different languagesettings, we access the network through a local machinewith a German IP address and we set the User-Agentheader to Chrome 96 for Windows.This way, we can measure meaningfulintra-factorvaria-tions in the level of Web application security, e.g., by estimat-ing the impact of the choice of a specic User-Agent whenthe other two factors are xed.The second problem is related tonon-determinism, becausethe same request does not necessarily always receive the sameresponse. For example, DNS might resolve the same hostnameto different IP addresses at different times and load balancerscan forward requests for the same resource to different back-end servers to improve performance. In either case, there is noguarantee that all the hosts which might process the requestenforce the same security policies. Security inconsistenciesintroduced by non-deterministic factors are in the scope ofour study, yet they complicate theattributionof security aws.To exemplify the problem, assume that Chrome appears to beless protected than Firefox because it did not receive any secu-rity headers at all. In this case, the User-Agent itself may notbe the actual cause of insecurity because non-determinismmay have played a role on the received response, e.g., theDNS resolution accidentally redirected Chrome to a poorlycongured host. To mitigate this problem, each Web site isvisited multiple times (ve in our collection) for each test andall the corresponding responses are stored, which allows usto detect non-deterministic security inconsistencies.Our crawler takes as input a set ofFactors, a set ofTestsas-sociated to each factor, a set ofURLsto access and a numberof visitsnto perform for each test. For each factorf
2
Factorsand each associated testt
2
Tests
[
f
], eachu
2
URLsis visitedntimes settingftot. For the nally reached URL (after po-tential redirects), we resolve its originoand save the responserin the dataset at the entryD
[
u
;
t
], enriched with the origino.We refer to
o
as the
end origin
of the response
r
.1
https://www.hidemyass.com/

--- page 12 ---

USENIX Association
31st USENIX Security Symposium 2051

--- page 13 ---

5 Formalizing InconsistenciesBefore presenting the formal details, we present an overviewof our analysis methodology to explain its design and sub-tleties. A simple notion of consistent security might be asfollows: all the responses collected from the same URL mustenforce the same security policies. However, this intuitivedenition of consistency is too strong to be useful in practice.The rst point we make is that requiring thesamesecuritypolicies for all the collected responses is overly restrictive.As a matter of fact, two security policies can besyntacticallydifferent, yet provide an equivalent level of protection. For ex-ample, two syntactically different CSPs may both effectivelymitigate the dangers of XSS. As another example, a host maycongure HSTS with tiny uctuations in the value of the max-age attribute which do not play any role in terms of practicalsecurity. To abstract from syntactic differences without signif-icant security implications, we deneequivalencerelations
m
for each security mechanism
m
under study.A second challenge of our analysis is related tolegitimatelydifferent policies we might get for different client characteris-tics: for example, a Web site which activates CSP for desktopclients might redirect mobile clients to a static error pagewhich requires no protection and thus enforces no CSP. Wedo not want to consider these cases as security inconsistencies,because the Web pages are different and legitimately requirea different level of protection. To lter out false positives, wedenecompatibilityrelations./
mfor each security mecha-nismmunder study: incompatible responses cannot lead tosecurity inconsistencies, becausemprotects different objects.For the sake of generality, our framework supports differentcompatibility relations for different security mechanisms, be-cause they may be based on different enforcement models,e.g., CSP operates at the page level, while HSTS operates atthe host level. In our Web measurement, however, we use thesame compatibility denition./
mfor each security mecha-nismm, because we want to be conservative in our ndingsand avoid over-reporting (see Section 5.2).Finally, we observe that not all inconsistencies are equal interms of real-worldexploitation. Inconsistencies enabled bynon-deterministic factors can be exploited by attackers whoare determined (or lucky) enough to eventually stumble intothem, while inconsistencies enabled by deterministic factorslike the adoption of a specic User-Agent identify weak spotsthat knowledgeable attackers can more easily take advantageof. We discriminate these two cases by having two differentdenitions of consistency, as detailed below.
5.1 ConsistencyFor any security mechanismm, we assume a reexive andtransitive relationr
.
m
r
0reading as: responserconguresmno more securely than responser
0. We writer

m
r
0if andonly ifrconguresmequivalently tor
0, i.e., we have that bothChrome 96Firefox 95H
;
H
;
H
;
H
;
HH
;
H
;
H
;
H
;
H
H
;
H
;
H
;
L
;
HH
;
H
;
H
;
H
;
H
H
;
H
;
H
;
H
;
HL
;
L
;
L
;
L
;
L
Table 2: Example observations upon crawling
r
.
m
r
0andr
0
.
m
rhold. Finally, we assume reexive andsymmetric relationsr
./
m
r
0reading as: responserandr
0arecompatible with respect to the security mechanismm. We laterinstantiate.
mand./
mto the different security mechanismsconsidered in our study to capture specic security properties.The rst denition we introduce is calledintra-test consis-tency. It requires all compatible responses collected withinthe same test to provide an equivalent level of protection. Vi-olations to this consistency property are likely attributed tonon-deterministic factors, because all the observable clientconditions are the same across the received responses.Denition 1(Intra-Test Consistency).The page with URLusatisesintra-test consistencyfor the security mechanismmwithin the testtif and only if for all responsesr
2
D
[
u
;
t
]andr
0
2
D
[
u
;
t
]
such that
r
./
m
r
0
we have
r

m
r
0
.The second denition of consistency which we introduceis calledinter-test consistency. It requires all compatible re-sponses collected within two different tests (dened for thesame factor) to provide an equivalent level of protection. Werequire the two tests to satisfy intra-test consistency to ruleout inconsistencies enabled by non-deterministic factors, e.g.,occasionally missing headers on responses collected withinthe same test. This way, inter-test inconsistencies can be real-istically attributed to specic client characteristics.Denition 2(Inter-Test Consistency).The page with URLusatisesinter-test consistencyfor the security mechanismmacross the testst
;
t
0, dened for the same factor and satisfyingintra-test consistency, if and only if for all responsesr
2
D
[
u
;
t
]
and
r
0
2
D
[
u
;
t
0
]
such that
r
./
m
r
0
we have
r

m
r
0
.We exemplify the denitions at work on a few toy examples.Let us focus on just two tests for the User-Agent factor forsimplicity: Chrome 96 for Windows and Firefox 95 for Linux.Assume that pages are visited ve times for each test andmay be classied in two security levels: low (L) and high(H) withL
.
m
H. Consider now the example observations inTable 2, that we assume to be all pairwise compatible. Therst row models a straightforward scenario where both intra-test consistency and inter-test consistency are satised. Thesecond row models a scenario where intra-test consistencydoes not hold, due to theLobservation for Chrome, henceinter-test consistency is undened: this case captures a non-deterministic security downgrade. The third row representsa scenario where intra-test consistency is satised, but inter-test consistency is not: this captures a deterministic securitydowngrade occurring when the page is visited using Firefox.

--- page 14 ---

2052 31st USENIX Security Symposium
USENIX Association

--- page 15 ---

5.2 Compatibility RelationsArguably, certain security mechanisms such as CSP are notapplicable to an origin per se, but rather to thecontentpro-vided under a given URL. However, not every URL returnsthe same content on each load, in particular in the presence oferrors or block pages. For such pages, which might originatefrom CDNs like Cloudare, enforcing the CSP of the originalpage might not make sense. Hence, when we encounter aninconsistency, we need to ensure that this inconsistency isnot due to different content being delivered. We leverage asimilarity score
on Web pages for this task.Page SimilarityBased on preliminary analyses of the col-lected data, our page similarity score takes into account fourfactors: rst, we rely on JavaScript as a proxy to implementthe pages' functionality. Therefore we created sets of thehosts from which scripts are loaded and computed their Jac-card similarity. By manually investigating the script data thatwe got from analyzing our responses, we encountered caseswhere the Jaccard similarity of the script hosts was 1, e.g.,because the page only used inline scripts. Notably, the numberof inline scripts differed signicantly; hence, we also considerthe number of scripts for each host as a second factor forour similarity. However, these rst two factors do not workwell for pages that only rely on a few scripts or do not evenuse JavaScript on their main page. To lower the impact ofthis, we manually investigated those pages, and we observedthat the title of the page often changes in case of errors, e.g.,showing justdomain.com. We, therefore, compute the longestcommon substring between the titles of two documents andcompute the ratio of this overlap as our third factor. In addi-tion to that, we observed that the response size also differedbetween error/block pages and pages with content. Thus wedene the content size of the response as our fourth factorby assigning a value between 0 and 1 (indicating the relativesizes). We nally combine our factors by computing theiraverage. The resulting value (between 0 and 1) is then usedto determine the similarity between two pages. We considertwo pages as similar if their similarity score is at least 0.8.To nd the page similarity threshold, we computed thesimilarity score of pages where we have seensyntacticallydifferent security headers after normalization (e.g., normaliz-ing CSP nonces or report URLs). Specically, for each suchcase, we took the largest response as the baseline (under theassumption that content pages are larger than error pages).Then, we computed the similarity to this baseline for each ofthe other responses. Figure 1 shows the result of this, both asa histogram (bucket size 0.05), as well as the CDF for the en-tirety of comparisons. We nd that the peak of the histogramis in the right-most bucket, i.e., similarity above 0.95. In theCDF, we observe that the similarity for most of the cases inthat bucket is even beyond 0.98. Moreover, the shallow slopeof the CDF around 0.8 leads to taking this value as a candidateFigure 1: Histogram and CDF of the similarity values forsyntactically different header values.for a threshold to distinguish between content and error/blockpages. Notably, error or block pages are just one instance of apotential difference. Our notion generally discerns dissimilarpages, which could require differing levels of protection, so asto avoid reasoning about security inconsistencies when theseare in fact legitimate.To assess the effectiveness of the threshold, we performedanalyses to identify false negatives (similar pages markedas dissimilar) and false positives (dissimilar pages markedas similar). To conrm that pages below our threshold areindeed no content pages, we spawned Chromium instances torender those pagesbelowthe threshold and take screenshots(after 5s) for further analysis. We then manually looked atthose 1,939 cases: for the very vast majority, the pages wereclearly error pages or block pages showing information aboutrobot detection / CAPTCHAs. Among the edge cases thatwere close to the threshold, we found one site where thepage skeleton looked like the actual content pages for thedomain, but without any content. We conrmed this case as atrue negative, because the page was under the threshold andseemed different in terms of the content.Another case that was close to the threshold was a domainthat randomly showed a slightly different page that addition-ally included items in sale. Therefore their title changed fromMercado Libre ArgentinatoHot Sale 2021, and due to theadditional content, the le size increased, bringing the simi-larity down to 0.78. Nevertheless, both pages belonged to thesame application and were not empty, error, or block pages,and hence we consider this case as a false negative. Notably,we only faced this one false negative in our dataset.In order to also assess the number of false positives, weinvestigated the similarity of pages above the threshold andbelow 0.95. For the remaining cases beyond 0.95, we arecondent to have no error pages in there, given the signicantoverlap through all four metrics. By looking at those positive(similar) pages, we have seen one single false positive. Thiscase had a similarity score of 0.82, although one HTML lewas clearly an error page. This happened due to the error pagealso including the scripts from the content page. In addition,

--- page 16 ---

USENIX Association
31st USENIX Security Symposium 2053

--- page 17 ---

False NegativesFalse Positives1/1,939 (0.05%)1/93 (1.08%)Table 3: False positive & false negative rates for similaritythe pages were similar in size, yet different in the title (HostingPlatform of Choicevs404 Error | cPanel). Because this isclearly an error page, we manually removed this error casefrom our results. Except for this one case, we could not spotany false positives in the pages above 0.8.Our experiments show that the chosen threshold is appro-priate to reason about inconsistencies, because it might sufferfrom occasional false negatives, but produced just one falsepositive and one false negative in our experiments (see Ta-ble 3). This means that we might lose some inconsistencies,but we are condent not to incorrectly report on inconsisten-cies where there are, in fact, none (because the content to beprotected is different). We now use thispage similaritynotion,to dene the following compatibility relations:CompatibilityGiven two responsesrandr
0, we letr
./
m
r
0if and only if the end origins ofrandr
0are the same and,additionally, the page similarity betweenrandr
0reaches thestipulated threshold. Note that we use the same compatibilityrelation for each security mechanismm. This may be overlyconservative for host-based security mechanisms like HSTS,because different pages under the same host may enforce dif-ferent HSTS policies for the same object (host), hence onemay legitimately disregard page similarity in the compati-bility relation for HSTS. However, we empirically noticedthat this weaker compatibility notion leads to over-reportinginconsistencies for HSTS. In particular, for sites hosted byCDNs, depending on our vantage point or frequency of re-quests, we received block or CAPTCHA pages. For Cloud-are, these lacked HSTS. However, it can be argued that thishas no signicant security implications. In particular, if thesite normally uses HSTS, the browser will likely be aware thatcommunication should be performed over HTTPS and thelack of the HSTS header does not deactivate HSTS. For thisreason, we prefer to be conservative in our analysis and reusethe same compatibility relation (with page similarity) for allthe security mechanisms to avoid potential over-reporting.
5.3 Equivalence RelationsWe now dene the.
mrelations (“no more secure than”) forthe different security mechanisms considered in the paper,leading to corresponding security equivalence relations
m.These denitions are motivated by the semantics of the secu-rity mechanisms under study.Cookie Security AttributesDening inconsistencies forcookie security attributes is straightforward, because theHttpOnly and Secure attributes require no conguration, whilethe SameSite attribute has three different congurations withincreasing level of protection: None, Lax, Strict.We identify cookies with the triple including their name,Domain and Path, as mandated by the corresponding RFC [3].Formally, we letr
.
ck
r
0if and only if all cookiescoccurringin both
r
and
r
0
satisfy the following conditions:
1.Ifcis marked as HttpOnly inr, thencis marked asHttpOnly also in
r
0
.
2.Ifcis marked as Secure inr, thencis marked as Securealso in
r
0
.
3.Ifcis marked as SameSite inr, thencis marked as Same-Site also inr
0with at least the same level of protection,e.g., if the SameSite attribute ofcis set to Lax inr, thenit must be set to Lax or Strict in
r
0
.Content Security PolicyDening inconsistencies for CSPis more complicated, since it is an expressive security mecha-nism, which supports many use cases and can thus be analyzedfrom multiple angles. To address this, we build multiple equiv-alence relations for CSP to cover different use cases [28].A rst use case for CSP is XSS mitigation, which we studyby leveraging a denition ofsafe CSPfor CSP Level 3 [8].This denition ensures that the CSP puts some meaningfulrestrictions against XSS: policies which do not comply withthe denition can be trivially bypassed by an attacker uponany content injection.Denition 3(Safe CSP [8]).A CSP issafeif and only ifit contains a script-src directive (or a default-src directive inits absence) bound to a valuevsatisfying both the followingconditions:
1.
vdoes not contain the 'unsafe-inline' source-expression,unless nonces or hashes are also present in
v
.
2.
vdoes not contain the wildcard * or any full scheme fromthe following: http:, https:, data:, unless 'strict-dynamic'is also present in
v
.We letr
.
csp

xss
r
0if and only if, wheneverrsets a safeCSP, then also
r
0
sets a safe CSP.The second use case for CSP is framing control. To denean equivalence relation for this use case, we divide responsesin four classes based on the enforced framing restrictions:
1. Framing is allowed on all origins.
2.Cross-origin framing is allowed only on selected origins.3. Only same-origin framing is allowed.
4. Framing is not allowed on any origin.We then letr
.
csp

f rm
r
0if and only if the class ofris lessthan or equal to the class of
r
0
.The last use case for CSP is TLS enforcement. Its equiv-alence relation is dened by havingr
.
csp

tls
r
0if and onlyif, wheneverractivates upgrade-insecure-requests or block-all-mixed-content, then alsor
0does it. In other words, whenrforbids the use of HTTP, then alsor
0enforces the samesecurity restriction.

--- page 18 ---

2054 31st USENIX Security Symposium
USENIX Association

--- page 19 ---

X-Frame-OptionsWe just focus on SAMEORIGIN andDENY as possible values of XFO, since ALLOW-FROM isunsupported by the modern clients considered in the presentstudy. This implies that responses can be categorized in justthree different classes:
1. Framing is allowed on all origins.
2. Only same-origin framing is allowed.
3. Framing is not allowed on any origin.We then letr
.
x f o
r
0if and only if the class ofris less thanor equal to the class of
r
0
.Strict Transport SecurityDening inconsistencies forHSTS requires some care, due to possible differences in themax-age attribute which arguably have little to no impact interms of real-world security. Our choice is discriminating fourclasses of responses, as follows:
1.Responses with max-age set to 0, thus forcing HSTSdeactivation for their host.
2.Responses without any HSTS header. These responsesdo not activate HSTS, but do not forcibly deactivate it.
3.Responses with max-age enforcing protection for lessthan one year. This practice can be useful, but does notcomply with the minimal required duration for inclusionin the HSTS preload list.
4.Responses with max-age enforcing protection for at leastone year, qualifying the host for preload list inclusion.
We then let
r
.
hsts
r
0
iff all the following conditions hold:
1. The class of
r
is less than or equal to the class of
r
0
.
2. If
r
sets the includeSubDomains directive, so does
r
0
.
3. If
r
sets the preload directive, then also
r
0
sets it.Handling Multiple HeadersCareful readers may have no-ticed that the above denitions assume responses to contain atmost one header of each type, yet real-world responses mightviolate this assumption because headers can be set multipletimes. Our dataset still contains at most a single header ofeach type, because the Requests library used in our data col-lection folds multiple headers into a single header set to acomma-separated concatenation of their values. For handlingof multiple headers, we follow specications where possible:•If the same cookie (identied by name, Domain andPath) is set in multiple headers, the last one should beprioritized [3]. We thus normalize the collected headersto reect this behavior within a single header.
•If a response contains multiple CSP headers, all of themshould be enforced at the same time [44]. We thus nor-malize the collected headers by replacing them with asingle header enforcing the conjunction of all CSPs.
•If a response contains multiple XFO headers, the cor-rect browser behavior is undened in the specication.Since prior research showed that different clients handlemultiple XFO headers quite differently [7], we check forsyntactic differences if multiple values are present.
•If a response contains multiple HSTS headers, the rstone should be prioritized [15]. We thus clean our data tokeep just the rst HSTS header.
6 Measuring InconsistenciesWe use the data collection framework in Section 4 to collectdata from live Web sites and apply the formalization in Sec-tion 5 to measure inconsistencies. The focus of our study isto understand inconsistencies caused by the servers of highlyranked sites. To ensure that any data we collect could not betainted through network proxies or rewalls, we decided toonly include sites which were served through HTTPS. Specif-ically, we visited each of the sites in the Tranco list [25]throughhttps://site.comandhttps://www.site.com,disregarding those which were not accessible through HTTPS.Further, for each nal URL, we determined if this was stillunder the same eTLD+1 as the originally visited one and nota localized version, e.g.,https://site.eu, so as to avoidselecting a site which is actually not highly ranked. As a re-sult, this process yields the list of the 10,000 highest-rankedsites available over HTTPS.Based on this methodology, we arrived at the set of top10,000 HTTPS sites based on the Tranco list of January 1,20222. We ran our rst crawl, on which we report in thefollowing, from January 2 through January 4, 2022. To en-sure that our measurement was not merely a single measure-ment which is not repeatable, we ran three more conrmationcrawls (January 6, 10, and 14, 2022). For each crawl, we col-lected between 13,626,145 and 13,742,760 responses. Whilewe focus on the results of the rst crawl, the appendix lists theoverlap in ndings between the rst and the respective follow-up crawls (Appendix B), which highlights that our results canbe conrmed over multiple crawls within 12 days. To easethe conrmation and reproducibility of our ndings we madeour crawling and analytics pipeline publicly available [10].In the following, we outline the key results supported bythe analysis of the collected data. We rst present a high-leveloverview of the ndings and then discuss security inconsis-tencies introduced by different factors, as well as the securityimplications of the inconsistencies.
6.1 Overview of the FindingsUsage StatisticsTo give an overview of the deployed secu-rity mechanisms in the wild, we computed the number of siteswhich activated a specic security mechanism at least onceacross our data collection. Table 4 shows the resulting usagestatistics for each of the selected security mechanisms in thesecond column. Note that this is an aggregate over all differ-ent tests, i.e., it combines checks for different User-Agents,vantage points and languages. In total, 8,174 sites made use2
Available at
https://tranco-list.eu/list/XVWN

--- page 20 ---

USENIX Association
31st USENIX Security Symposium 2055

--- page 21 ---

MechanismUsage# Sites w/ intra-test inconsistencies# Sites w/ inter-test inconsistencies# Sites w/ only inter-test inconsistenciesUA Lang. VPN TorAnyUA Lang. VPN TorAnyUA Lang. VPN TorAnyContent Security Policy1,99812 11 31 233615 - 29 184715 - 11 328
- for XSS mitigation3601 - 1 139 - 1 1109 - 1 -10
- for framing control1,2886 5 15 9162 - 16 5202 - 9 112
- for TLS enforcement6617 7 19 14224 - 12 12174 - 1 26X-Frame-Options5,69220 18 43 22507 - 29 13377 - 9 520Strict-Transport-Security4,56215 13 28 23388 - 23 16358 - 12 522
- w/o page similarity-42 33 148 59369319 2 576 21864317 2 524 20552
- preload9203 3 6 610- - 9 410- - 6 -6

w/o page similarity-5 6 20 1131241 1 124 481371 1 117 2119Cookie Security3,87610 9 11 1216150 1 13 8167149 1 9 2160
- Secure attribute2,9374 4 5 68144 - 8 3152144 - 7 1151
- SameSite attribute7885 5 5 676 1 4 4146 1 2 -9
- HttpOnly attribute3,1041 - 2 232 - 3 262 - 2 15Any8,17451 44 103 75127177 1 82 49267174 1 34 12194Any (incl. HSTS w/o similarity)8,17477 64 222 634765188 3 631 252833183 3 541 26429Table 4: Detected intra-test and inter-test inconsistencies by factor (321 sites in total). We present the numbers with and withoutpage similarity for HSTS to highlight the impact of this choice on the measurement.of any of the security mechanisms. The most widely usedmechanism was X-Frame-Options with 5,692 occurrences.HSTS was used on 4,562 sites, whereas at least one cookiewas congured with any of the security attributes on 3,876sites. The vast majority of these cases stem from the usageof HttpOnly or Secure attributes, with only 788 sites makinguse of SameSite cookies. The least widely used header wasContent-Security-Policy with 1,998 sites which deployed it.Notably, the vast majority of sites used CSP for framing con-trol rather than for its original purpose of XSS mitigation [35].It is worth noting that for XSS mitigation, we only count thosecases which have a policy that is not trivial to bypass (Deni-tion 3). Since our denition of inconsistency revolves aroundsuch policies, any site that did not have any meaningful XSSmitigation is not counted. Note that the number of sites forthe subclasses of CSP and cookie security do not add to theoverall usage, since a site may, e.g., congure a CSP that bothmitigates XSS and enforces TLS.Detected InconsistenciesIn total we detected some incon-sistency in 321 sites. Table 4 further shows three groups ofcolumns: intra-test inconsistent, inter-test inconsistent, andonlyinter-test inconsistent sites. For the nal column group,we removed all those sites for which we found an intra-testinconsistency for the given mechanism. This is to ensure thata site exhibiting a non-deterministic behavior is not acciden-tally agged as suffering from inter-test inconsistencies, asrequired by our formal denition. Hence, the last column isa condent lower bound for the number of sites affected byinter-test inconsistencies. Overall, our crawl detected 127 siteswhich have some type of intra-test inconsistency and from194 to 267 sites with inter-test inconsistencies. Notably, ourconrmation crawls exhibited two interesting phenomena, i.e.,the instability of intra-test inconsistencies and the stability ofinter-test inconsistencies. Considering the union of all sitesthat suffered from intra-test inconsistencies at least once inour crawls, we found a total of 210 sites (Appendix Table 5).This likely means that the actual dangers of non-deterministicintra-test inconsistencies is more severe than what we couldmeasure through our ve observations. Conversely, the conr-mation crawls showed that the number of sites with inter-testinconsistencies is stable over time (Appendix Table 6).
6.2 Intra-Test InconsistenciesIntra-test inconsistencies come with particular security risks,as an attacker can abuse these to attack users opportunistically.In the following, we present case studies of intra-test inconsis-tencies for every mechanism and explain the correspondingsecurity implications.Cookie SecurityIf a cookie may non-deterministically lackthe HttpOnly attribute, an attacker could steal the cookie viamalicious JavaScript by performing an XSS attack multipletimes until access to the cookie succeeds. One of the threesites where we encountered this kind of inconsistency sets itsauthentication cookie namedauthcookie_loggedInsometimeswith and sometimes without the HttpOnly attribute.A non-deterministically missing Secure attribute, as ithappened on eight sites, allows a network attacker tosteal the corresponding cookie. One site for example non-deterministically set theircsrfTokencookie as Secure or not.Thus, attackers can steal this cookie and perform CSRF at-tacks because they know the anti-CSRF token. A similar issuehappens on another site, for which the Secure attribute is in-consistently set on the session identierJSESSIONID, thuspotentially leading to session hijacking.In seven sites, we found intra-test inconsistent deployments

--- page 22 ---

2056 31st USENIX Security Symposium
USENIX Association

--- page 23 ---

of the SameSite attribute, which is sometimes set to Lax andsometimes missing. This behavior might not be a problem formodern browsers, because Chromium-based browsers defaultto Lax in case of a missing SameSite attribute. However, allSafari-based browsers still face the problem that cross-site at-tacks such as CSRF are possible due to this misconguration.One site, for example, sometimes set theirASP.NET_SessionIdcookie with SameSite attribute set to Lax, and sometimes theSameSite attribute was not set, which enables an attacker toperform attacks such as CSRF.Content Security PolicyOverall, we found three sites forwhich XSS mitigation was enforced non-deterministically.For example, the responses from one site sometimes did nothave any CSP for clients from Germany or Australia. Thus,an attacker can succeed by performing the attack multipletimes until one of the responses does not carry a CSP.For framing control, we found a total of 16 inconsistentsites across our tests. Note that the majority of inconsisten-cies were detected in the VPN crawl. This is because, in theVPN crawl, we test from 218 vantage point (compared to 49tests for Onion, and 20 and ve respectively, for User-Agentand language), which increases the chances of eventuallygetting an inconsistent response. For example, a site non-deterministically deployed frame-ancestors or not, hence anattacker can perform the attack multiple times (or load thetarget in multiple iframes) until the attack succeeds.Finally, TLS was inconsistently enforced on 22 sites. Forexample, one site in our dataset deploys a CSP that aims toenforce TLS. However, irrespective of the factors that wechecked, this CSP is not present in some responses. Nowa-days, Chromium-based browsers auto-upgrade mixed con-tent [4], whereas Firefox and Safari merely block it. There-fore, the security implications of missing TLS enforcementis limited. However, inconsistencies in this feature can leadto functionality issues. In 2020, Roth et al.[28]showed that77/251 sites which use CSP for TLS enforcement have HTTPresources linked from their front page. Thus, these inconsis-tencies might lead to essential resources being blocked inFirefox and Safari.X-Frame-OptionsThe most common intra-test inconsis-tency for X-Frame-Options was alternating between a de-ployed header and not deploying XFO at all (41 sites). Thisbehavior enables an attacker to attempt the attack multipletimes (or load the target in multiple iframes) until it succeeds.For the other nine cases, the Web applications alternate be-tween a valid XFO header and a malformed one (e.g. some-times prepending a:to its XFO header) or one using anunsupported feature such as ALLOW-FROM. As with omit-ting the header, an attacker can opportunistically exploit this.Strict Transport SecurityOf the 38 sites with intra-test in-consistencies on HSTS, only six are present in the preload list,for which the issue has no implication on the client's security.For 23 sites the inconsistency is related to headers which aresometimes entirely omitted. For those not preloaded, this isproblematic since the non-deterministic absence of the headermight prolong the time frame where an attack is possible dueto the trust-on-rst-use problem of HSTS.While inconsistencies for preloaded sites have no directimpact on a client, they nevertheless pose a threat. In ourdataset seven hosts deploy an HSTS header sometimes with,sometimes without the preload directive. Here an attacker canremove the affected site from the HSTS preload list by askingfor removal of the site [27]. If the HSTS preload crawler hitsa case without preload being present in the HSTS header, thesite will be removed without the operator even noticing it.According to our tests with an author-owned preloaded site,there seems to be no rate-limiting in place to stop such abuse.An intra-test inconsistent deployment of the HSTS in-cludeSubdomains directive can also lead to problems, asit happened for four sites. For example, a payment serviceprovider showed this behavior on several islands (e.g., Falk-land Islands, Antigua and Barbuda, Bahamas, and Bermuda).Here an attacker could, in case of a lacking includeSubDo-mains directive, abuse the subdomains to attack the maindomain (e.g., using subdomains to inject cookies into thetop-level domain).The most critical inconsistency in terms of exploitability isa host that randomly alternates between enabled and disabledHSTS, or has multiple enabled and disabled HSTS headersin random order (only the rst entry is processed). Threesites have this kind of intra-test inconsistency. They, for ex-ample, alternate betweenmax-age=0, max-age=15768001andmax-age=15768001. Since the HSTS specication man-dates adhering to the rst observed HSTS header, the rstcase always deactivates HSTS. Similarly, one site non-deterministically disabled HSTS in certain (mostly easternEurope) countries such as Lithuania, Moldova, Romania, andUkraine. In both cases, an attacker could perform the attackseveral times until it succeeds because HSTS has been dis-abled in the last response. We also identied one site thatalternate between a short max-age (<= 5 min) and a properlycongured header. In those cases, the site allows an attacker toabuse the HSTS TOFU problem at a higher frequency becauseif the last HSTS header received was a short one, the nextvisit after a short time period (e.g., 5 min) will be vulnerableagain, because the browser no longer enforces TLS.Reasons for Intra-Test InconsistenciesIn order to nd thecause behind the intra-test inconsistencies, we took a closerlook into the gathered data from the responses, such as peer IPaddresses or cache headers. Here we noticed that indeed someof the different response headers were caused by caching,because all miscongured header values also had a differ-

--- page 24 ---

USENIX Association
31st USENIX Security Symposium 2057

--- page 25 ---

entcache-controlheader (18 sites) or a differentx-cacheheader (ve sites). For two sites, our data indicate that de-pending on the geolocation, we were redirected to a differentend URL (under the same origin), which then causes the in-consistency. In the case of ve sites, we were also able toattribute the inconsistency to certain peer IP addresses, whichindicates that miscongured origin servers might be the un-derlying problem. This hypothesis is also supported by oneanswer from the notication campaign, which indicates that“one of the origin servers seems to be congured differently”.However, here we observed that this inconsistency does notdepend on the peer IP address, which indicated that what wesee as the peer IP might only be a load balancer, sending ourrequest to different origin servers on a back channel. Notably,the probability of getting a different origin server is muchhigher in the case of different geolocations. This, togetherwith the fact that the number of crawls for VPN and onion aremuch higher than in the case of user-agent and language set-tings, explains the comparatively higher number of intra-testinconsistencies.One inconsistency that is standing out, due to its prevalencein our dataset, was the inconsistent setting of SameSite fortheASP.NET_SessionIdcookie. According to Microsoft, theframework does not support “.NET versions lower than 4.7.2for writing the same-site cookie attribute”[23]. Thus, if someof the origin servers have a new version of .NET while othersstill use the old version, the cookie would show exactly thebehavior we observed, which is why we believe this to be acontributing factor.
6.3 Inter-Test InconsistenciesThis section sheds light on the inter-test inconsistencies, i.e.,for a single deterministic factor such as the User-Agent, ourcrawls revealed different security guarantees (see middle col-umn of Table 4).Cookie SecurityThe vast majority of sites (144/150) thathave inter-test inconsistencies for cookie security are thosethat deterministically gave back cookies without the Secureattribute to some User-Agents. Notably, the cause of thisinconsistency is in most cases (130), special handling for theUser-Agent for Firefox on iOS. For example, one site set theirsidcookie Secure for all clients except Firefox on iOS, leavingthose clients unprotected against network attackers. Othersites gave non-Secure cookies to a group of User-Agents thatvisited their page, another site for Safari-based clients, onefor mobile clients, and another one for all iOS clients.Two sites inconsistently deployed HttpOnly cookies fortheir clients. In one case, a site deliveredCM_SESSIONIDwithout HttpOnly attribute to clients that use Firefox on iOS.In another case a site only gave out HttpOnly cookies tonon-Safari-based clients. In both cases, attackers can steal ormanipulate cookies via an XSS attack and eventually performstate-changing actions on behalf of the user.For inconsistencies of the SameSite attribute, we found 14cases where sites either send cookies with the attribute ordo not set it at all. One site, for example, only gives Same-Site cookies if the Accept-Language header of the client isnotset to English. As mentioned in the intra-test inconsis-tencies, this behavior might not be a problem in Chromium-based browsers, because those browsers default to Lax in caseof a missing SameSite attribute. However, all Safari-basedbrowsers and Firefox still face the problem that cross-site at-tacks such as CSRF are possible due to this misconguration.Content Security PolicyXSS mitigation as the originaluse-case of CSP also faced inter-test inconsistencies in tencases. In general, if a site's CSP alternates between a safepolicy and a trivially bypassable one based on some clientcharacteristics, an attacker can specically target the affecteduser population. Due to the (at the time of writing) poroussupport for the 'strict-dynamic' source-expression, some siteshad inter-test inconsistencies that only deployed a CSP withthis source-expression to clients that actually support it. Nu-merous sites removed 'strict-dynamic' from their CSP for allSafari (and thus all iOS) clients. The problem here is thathttps:is also present in the policy, i.e., clients without sup-port for 'strict-dynamic' would allow script inclusion from anyHTTPS host, which is insecure. Removing 'strict-dynamic'is a bad practice, because the CSP design is backward com-patible and unknown source-expressions are just ignored bybrowsers. Importantly, Safari recently announced support for'strict-dynamic' and already supports it in its technology pre-view [9], hence dropping 'strict-dynamic' may unduly leaveSafari users unprotected. Other sites dropped their entire CSPfor XSS mitigation for all Safari clients, while again othersdid not send a CSP at all for Android clients. One Web siteonly deployed XSS mitigation to some countries (like Russia,Spain, or Sweden), but did not deploy CSP for others (e.g.,US, Pakistan, or South Africa).CSP for framing control is also used inter-test inconsis-tently across different clients (two sites) and geolocations (18sites). For example, one site did not send a CSP controllingframing via frame-ancestors to all iOS clients, leaving thoseusers unprotected against framing-based attacks.Like for the case of intra-test inconsistent deployment ofCSP for TLS enforcement, the inter-test inconsistent deploy-ment of this CSP feature does not have a security impact buta functionality impact. However, while it is a randomly occur-ring problem for the intra-test inconsistencies, the problemdeterministically occurs for parts of the user-base on 17 sites.X-Frame-OptionsAn inter-test inconsistent deployment ofX-Frame-Options exposes a part of the user base to framing-based attacks. In seven out of 37 cases, this type of inconsis-tency occurred due to specic operating systems or browsers

--- page 26 ---

2058 31st USENIX Security Symposium
USENIX Association

--- page 27 ---

are getting different congurations. Some sites deployed XFOfor desktop clients, but mobile browsers got no protection atall, making them vulnerable to framing-based attacks. In othercases specic browsers were excluded from the protection:one site did not deploy XFO for Opera clients, while anotherexcluded Firefox browsers. This behavior was also presentagainst users of a specic operating system, as some sitesonly gave XFO to non-iOS clients. In addition to that, 13 sites(Onion) and 29 sites (VPN) decided to exclude specic ge-olocations from the protection against framing based-attacks.Strict Transport SecurityIn case of inter-test inconsis-tencies in HSTS it makes no difference if HSTS is disabled(max-age=0) or not present because the affected clients/coun-tries will deterministically get the same insecure conguration.While cross-checking the inconsistent sites with the HSTSpreload list, we observed that only ve out of the 35 inter-inconsistent sites are actually preloaded.
There are eight Web sites that handle browsers differently.For example, one site only gives enabled HSTS to desktopclients but not to mobile clients, another does not send HSTSto Firefox and Safari-based clients, which exposes parts ofthe user-base to possible network attacks. In addition to that,30 sites deploy HSTS inconsistently depending on the geolo-cation. Another site deploys a proper HSTS for all countriesexcept for clients from India, which do not get an HSTSheader. Also, six sites have the inter-test inconsistent deploy-ment of HSTS with/without the includeSubdomains directive.One site, for example, deployed an HSTS header with thedirective for clients from some countries such as Hungary orIreland, but not for others such as Germany or Japan. Herean attacker could abuse subdomains to attack the main do-main (e.g., using subdomains to inject cookies into the parentdomain).Reasons for Inter-Test InconsistenciesInter-test inconsis-tencies are naturally attributed to deterministic factors, how-ever a few observations are interesting. In many cases awedUser-Agent parsing or wrong handling of the parsed browserinformation seem to be a problem. Surprisingly many inter-test inconsistencies happened specically for Firefox on iOS.Therefore we tested this User-Agent in different parsing li-braries. All of them showed Firefox with version 40 (releasedAugust 11, 2015) as output for our Firefox iOS User-Agentstring. In the case of Firefox, the version numbers for theiOS client are different from other operating systems, pos-sibly due to the fact Firefox is based on WebKit instead ofGecko on iOS, so the User-Agent is incorrectly recognizedas a legacy client. Notably, the Firefox iOS version numberrecently jumped from 40.2 to 96.0 on January 18, 2022 [2].Not only the version number of Firefox, but also the iOSversion number present in the User-Agent was the reason forsome of the inconsistencies. The User-Agent from an onlinerepository used in our crawler had an old iOS version num-ber (12.1, October 2018). However, with the same Firefoxand WebKit version, but a newer iOS version (15.2, Decem-ber 2021), these inconsistencies were not present, althoughthey are still concerning for a specic user population. In-deed, users may not have control of their OS version due tohardware restrictions.Also, as mentioned in Section 6.3, some sites deliver aCSP without the 'strict-dynamic' expression to Safari-basedclients. During our notication campaign, a videotelephonyservice conrmed that they are doing this because thoseclients lack support for this CSP feature. In either case, noneof those special handling for browsers is actually neces-sary; unknown cookie attributes and unknown CSP source-expressions are simply ignored by browsers. Furthermore ifcertain features are going to be supported in future release(like 'strict-dynamic' in Safari's current Technology Preview),the special handling for certain browsers might cause secu-rity issues because the browser switches are not updated orremoved. This highlights that having browser switches forsecurity mechanisms is a dangerous practice, at least if theprovided level of security differs.In case of network related inter-test inconsistencies, pos-sible reasons are similar to those from the intra-test incon-sistencies. If miscongured origin servers are only used forrequests from specic countries, or if CDNs cache responsesfor certain countries longer than for others, we can observe in-consistent deployment of security mechanisms depending onthe geolocation. We detected three sites with different peer IPadresses that seem to cause the issue, ten sites with differentcache-controlheader, and two with differentx-cache. Forexample, based on thex-cacheheader sent by one site wehypothesize that for certain countries like France they havea cache in place, because all requests from there produced acache hit, while other requests for example from Australiaonly produces cache errors/misses.
6.4 DisclosureOur ndings imply that certain users of the sites under testmight be at risk; either because an attacker can target thembased on certain properties (e.g., their User-Agent) or canopportunistically exploit the non-determinism of the server.To enable site operators to x the inconsistencies, but also togain knowledge about the root cause of the inconsistencies,we attempted to disclose the issues to all sites usingsecurity@andwebmaster@aliases. The email that we sent containedinformation about our institutions and us, as well as a detaileddescription of the individual inconsistent headers and howthey were collected. Also, we informed site operators that weare interested in the reason for the inconsistency such thatwe can better help others that face similar issues and offeredthem our assistance and further information.In total, we sent out 256 emails (see Appendix A for the

--- page 28 ---

USENIX Association
31st USENIX Security Symposium 2059

--- page 29 ---

template). For 197 domains, we received an email deliveryfailed message. Notably, we sent the email to both aliases(security@ and webmaster@), so we might have received afailure message, although one of the two addresses receivedour email. Research has shown that scaling up noticationsis a known problem [36,38], also due to the low availabilityof generic aliases [34]. In addition to that, only 25 out ofthe 256 domains hosted asecurity.txt, with 7 of thosesetting their contact email tosecurity@. Thus, we only got21 answers that were more than just an automatic responsemessage. Seven operators asked us to provide more details,like the IP addresses of the servers that we connected to. Oneof those even asked us to provide a demo video that shows theinconsistency problem. In all cases, we were happy to providethem with more detailed data in order to ease their searchfor the reason behind the issue. Additional seven claimedthat they can conrm the issue and will get right back tous, which nearly none of them have done so far. The otherseven answered us that they conrmed and xed the issue orexplained to us that this is out of their control, e.g., becausethey are not self-hosting their sites in some countries.Many of those that answered instructed us to contactHackerOne to report vulnerabilities. Notably, our messagedid not include the word “vulnerability” or similar words like“exploit”. Therefore, we answered those emails that we werenot interested in any bug bounty, because we only wanted tohelp and raise attention for the inconsistent behavior such thatall clients can be secured consistently. Notably, none of thenotied parties answered that this issue is not present in theiroption, which further strengthens our condence in the results.The previousReasons forsubsections have outlined some ofthe answers from our disclosure campaign that we used toreason about the inconsistencies in some of the case studies.To increase remediation rates, we tested the problematic sitesagain in May 2022. Here, we found that 184 still containedthe issues we attempted to disclose before. By manually inves-tigating those sites, we were able to nd 105 email addresses.In this second round, only four of the manually curated emailaddresses responded with a failure message.
7 DiscussionHere, we discuss limitations of the work and summarize thesecurity impact of our ndings.
7.1 LimitationsOur analysis already shows that client characteristics play arelevant role for Web application security, however it couldbe improved along different directions. One limitation of ourstudy is the assumption that all the tested browsers implementall the security mechanisms according to their ofcial speci-cations, which simplied the technical development. Thisassumption is motivated by our focus on modern clients, yetwe are well aware that it is not entirely accurate, e.g., at thetime of writing Safari does not support the 'strict-dynamic'source-expression of CSP Level 3 and browsers might sufferfrom bugs (like all software), especially in corner cases. Thatsaid, we manually vetted most of the detected security incon-sistencies and we conrm that they are not subtle enough toinvalidate the general ndings of our study due to our assump-tion on browser behavior.Another limitation of our work is the best-effort attributionof the identied security inconsistencies. Discussing correla-tion rather than causation is a common and accepted limitationof Web measurements. We crawled each page multiple timesand formalized different denitions of consistency to mitigatethe effects of non-determinism, however we cannot entirelyrule out non-determinism, e.g., due to the presence of server-side load balancers. It is possible that we collected ve timesthe same response from a Web page due to non-determinism,rather than due to our testing conditions, however all the casesexplicitly named in Section 6 have been manually vetted andconrmed as vulnerable.
7.2 Overall Security ImpactIn general, an attacker can abuse the inter-test inconsistentbehavior of some sites to attack a certain part of the user baseby specically targeting the less secured clients like specicUser-Agents or users from certain geolocations. For the intra-test inconsistent sites, an opportunistic attacker can exploitthe non-determinism of the deployed security mechanism byexecuting the attack multiple times. The individual advantageof the attacker in both cases depend on the mechanism that isdeployed inconsistently.ForCookies, a missing security attribute enables an at-tacker to access the cookie via XSS (HttpOnly) or to steal thecookie by downgrading the connection security and eaves-dropping on the trafc (Secure). Also, missing or inconsis-tently deployedSameSiteAttributes allows attackers to suc-cessfully execute cross-site attacks such as CSRF. In eithercase, the difference between inter-test and intra-test inconsis-tencies in the case of cookies does not change the attack itselfbut only the way it can be successfully executed, because theattacker either needs to target a certain group of users (inter),or perform the attack multiple times (intra). Therefore theuser-base (or party of it) of more than 172 Web sites can beattacked due to inconsistencies.In case of an inconsistentContent Security Policyheaderan attacker can perform XSS attacks (inconsistentXSS miti-gation), framing-based attacks such as Clickjacking (incon-sistentframe-ancestors), or perform network-based attacks(inconsistentTLS enforcement). While the latter is only rele-vant for functionality rather than security, because Chromium-based browsers nowadays auto-upgrade mixed content [4]and Firefox and Safari block it, the other two cases can indeedbe exploited by an attacker. Thus in case of inconsistent XSS

--- page 30 ---

2060 31st USENIX Security Symposium
USENIX Association

--- page 31 ---

mitigation and/or inconsistent framing control, the attackercan exploit a certain group of users (inter), or try the attackmultiple times (
intra
) on 41 different Web sites.Similar to the exploitability of inconsistent CSPframe-ancestors, inconsistent deployment of theX-Frame-Optionsheader can lead to framing-based attacks such as Clickjack-ing. Notably, however, XFO will be ignored by CSP Level2 supporting browsers as soon as CSPframe-ancestorsispresent. Still, only ten sites that showed inconsistencies inXFO have deployed a CSP that restricts framing. Thus, theusers of 43 sites would still be exploitable by performing theattack multiple times (intra), and a specic group of userswould be attackable on 17 sites.ForStrict Transport Securitywe have cases that leadto different attacks depending on the type of inconsistency.If, for example, thepreloaddirective is deployed intra-testinconsistently, an attacker can remove this site from the HSTSpreload list by asking for removal of the site multiple timesuntil the HSTS checker encounters the header without preload.For inconsistencies in theincludeSubDomainsor inconsistentmax-ageduration, an attacker can run network attacks againsta certain group of users (inter), or perform the attack multipletimes (intra) on 60 different Web sites. Notably, those sitesare only cases where thepage similaritywas considered, sothe number of potentially exploitable sites could be higher,as HSTS protects the connection security between client andserver, and does not care about the actual content of that isdelivered via the server.
8 ConclusionIn this paper we investigated the inconsistent congurationof client-side security mechanisms on top sites across differ-ent client characteristics (inter-test) or even across multiplecommunications of the same HTTP request (
intra-test
).Our measurement has highlighted that client-side securitymechanisms are not equally delivered to all clients. Speci-cally, we found several sites in our dataset that returned dif-ferent security policies with different semantics in at leastsome of our tests. Our ndings have implications in threedimensions: rst, Web users may receive different protectionbased on subtle differences in their browser or vantage point(inter-test inconsistencies). Second,intra-test inconsistenciesmay enable an adversary to launch attacks in an opportunisticfashion, given that the responses for the same request maynon-deterministically enforce different security. Acquiringthis knowledge is an easy task for the attacker, as they canprobe for non-deterministic behavior of the server as we did.Third, our analysis has shown that prior measurements (seerelated work in Section 2.2) may have inadvertently under- orover-reported ndings with respect to the deployment of secu-rity mechanisms. Specically, we identied intra-test securityinconsistencies in 127 sites and inter-test security inconsis-tencies in 194 sites. Our semantics-based analysis gives clearevidence of the potential security implications of the detectedinconsistencies, by identifying characteristics which mightenable exploitation, while being expressive enough to gen-eralize over previous studies which only focus on missingsecurity headers [29].To the best of our knowledge, we are the rst to systemati-cally study the problem of intra-test inconsistencies. Luckily,dealing with such inconsistencies in Web security measure-ments appears relatively easy: since most of them (80.4%) aredue to unexpectedly missing headers, it sufces to crawl thesame page multiple times to detect and x these omissions.Nevertheless, prior Web measurements on the impact of clientcharacteristics on Web security and privacy might have per-formed an incorrect attribution of security downgrades, sincea single page access does not sufce to assess the impact ofnon-determinism. Luckily, the number of sites suffering fromintra-test inconsistencies is not high enough to invalidate thebig picture drawn by prior studies.Inter-test inconsistencies are likely less surprising to re-searchers working on Web measurements, due to the pub-lication of papers studying variations of the topic [17,18].However, inter-test inconsistencies are particularly concern-ing to site operators, because they identify weak spots intheir security policies reported by our analysis. We observethat inter-test inconsistencies across network access methodsmight arise due to miscongured origin server for specicgeolocations. Also, User-Agent snifng leads to security in-consistencies on 177 sites, which can all be attributed to siteoperators. Notably, due to backwards compatibility of theinvestigated security mechanisms, none of the individual re-sponses for specic browsers were actually necessary.
AcknowledgmentsWe would like to thank the reviewers for their advices on howto improve the presentation and reproducibility of our paper.In particular, we thank Yinzhi Cao for his guidance duringthe shepherding process.This work was conducted in the scope of a dissertation atthe Saarbrücken Graduate School of Computer Science andwas partially supported by DAIS - Università Ca' FoscariVenezia within the IRIDE program.
References
[1]Eman Salem Alashwali, Pawel Szalachowski, and An-drew Martin. Does" www." mean better transport layersecurity? In
ARES
, 2019.
[2]Mozilla Mobile Applications. Releases of Firefox-iOS.GitHub.
[3]Adam Barth. RFC6265: HTTP State ManagementMechanism. 2011.

--- page 32 ---

USENIX Association
31st USENIX Security Symposium 2061

--- page 33 ---

[4]Chromium Blog. No More Mixed Messages AboutHTTPS. chromium.org.
[5]Michele Bugliesi, Stefano Calzavara, Riccardo Focardi,and Wilayat Khan. Cookiext: Patching the browseragainst session hijacking attacks.
Journal of Computer
Security (IOS Press)
, 2015.
[6]Stefano Calzavara, Alvise Rabitti, and Michele Bugliesi.Semantics-based analysis of content security policy de-ployment.
ACM TWEB
, 2018.
[7]Stefano Calzavara, Sebastian Roth, Alvise Rabitti,Michael Backes, and Ben Stock. A tale of two headers:A formal analysis of inconsistent click-jacking protec-tion on the web. In
USENIX Security
, 2020.
[8]Stefano Calzavara, Tobias Urban, Dennis Tatang, MariusSteffens, and Ben Stock. Reining in the web's inconsis-tencies with site policy. In
NDSS
, 2021.
[9]CanIUse.com. headers HTTP header: csp: Content-Security-Policy: strict-dynamic. CanIUse.com.
[10] CISPA. The Security Lottery. GitHub.
[11]Kostas Drakonakis, Sotiris Ioannidis, and Jason Polakis.The cookie hunter: Automated black-box auditing forweb authentication and authorization aws. InACMCCS
, 2020.
[12]Zakir Durumeric, Zane Ma, Drew Springall, RichardBarnes, Nick Sullivan, Elie Bursztein, Michael Bailey,J Alex Halderman, and Vern Paxson. The security im-pact of https interception. In
NDSS
, 2017.
[13]Steven Englehardt, Dillon Reisman, Christian Eubank,Peter Zimmerman, Jonathan Mayer, Arvind Narayanan,and Edward W Felten. Cookies that give you away: Thesurveillance implications of web tracking. InWWW,2015.
[14]Nathaniel Fruchter, Hsin Miao, Scott Stevenson, andRebecca Balebako. Variations in tracking in relation togeographic location.
W2SP
, 2015.
[15]Jeff Hodges, Collin Jackson, and Adam Barth.RFC6797: Strict-Transport-Security Response HeaderField Processing. 2012.
[16]Shan Huang, Félix Cuadrado, and Steve Uhlig. Mid-dleboxes in the internet: a http perspective. InTMA,2017.
[17]Jordan Jueckstock, Shaown Sarker, Peter Snyder, Panagi-otis Papadopoulos, Matteo Varvello, Benjamin Livshits,and Alexandros Kapravelos. The blind men and theinternet: Multi-vantage point web measurements.arXivpreprint arXiv:1905.08767
, 2019.
[18]Jordan Jueckstock, Shaown Sarker, Peter Snyder, AidanBeggs, Panagiotis Papadopoulos, Matteo Varvello, Ben-jamin Livshits, and Alexandros Kapravelos. Towardsrealistic and reproducible web crawl measurements. InWWW
, 2021.
[19]Mohammad Taha Khan, Joe DeBlasio, Geoffrey MVoelker, Alex C Snoeren, Chris Kanich, and NarseoVallina-Rodriguez. An empirical analysis of the com-mercial vpn ecosystem. In
IMC
, 2018.
[20]Akshaya Mani, Tavish Vaidya, David Dworken, andMicah Sherr. An extensive evaluation of the internet'sopen proxies. In
ACSAC
, 2018.
[21]Abner Mendoza, Phakpoom Chinprutthiwong, andGuofei Gu. Uncovering http header inconsistenciesand the impact on desktop/mobile websites. InWWW,2018.
[22]K Michael and B Joseph. Upgrading https in mid-air:an empirical study of strict transport security and keypinning. In
NDSS
, 2015.
[23]Rick Anderson (Microsoft). Work with SameSite cook-ies in ASP.NET. microsoft.com.
[24]Diego Perino, Matteo Varvello, and Claudio Soriente.Long-term measurement and analysis of the free proxy
ecosystem.
ACM TWEB
, 2019.
[25]Victor Le Pochat, Tom Van Goethem, Samaneh Tajal-izadehkhoob, Maciej Korczy´nski, and Wouter Joosen.Tranco: A research-oriented top sites ranking hardenedagainst manipulation.
NDSS
, 2019.
[26]Chromium Project. HSTS preload list. hstspreload.org,.
[27]Chromium Project. HSTS preload list removal. hst-spreload.org, .
[28]Sebastian Roth, Timothy Barron, Stefano Calzavara,Nick Nikiforakis, and Ben Stock. Complex securitypolicy? a longitudinal analysis of deployed content se-curity policies. In
NDSS
, 2020.
[29]Eman Salem Alashwali, Pawel Szalachowski, and An-drew Martin. Exploring https security inconsistencies:A cross-regional perspective.
arXiv e-prints
, 2020.
[30]Nayanamana Samarasinghe and Mohammad Mannan.Towards a global perspective on web tracking.Elsevier:Computers & Security
, 2019.
[31]Jörg Schwenk, Marcus Niemietz, and Christian Mainka.Same-origin policy: Evaluation in modern browsers. InUSENIX Security
, 2017.

--- page 34 ---

2062 31st USENIX Security Symposium
USENIX Association

--- page 35 ---

[32]Kapil Singh, Alexander Moshchuk, Helen J Wang, andWenke Lee. On the incoherencies in web browser accesscontrol policies. In
IEEE S&P
, 2010.
[33]Suphannee Sivakorn, Angelos D Keromytis, and JasonPolakis. That's the way the cookie crumbles: Evaluatinghttps enforcing mechanisms. In
ACM WPES
, 2016.
[34]Wissem Soussi, Maciej Korczynski, Sourena Maroo,and Andrzej Duda. Feasibility of large-scale vulner-ability notications after gdpr. InIEEE EuroS&PW,2020.
[35]Sid Stamm, Brandon Sterne, and Gervase Markham.Reining in the web with content security policy. InWWW
, 2010.
[36]Ben Stock, Giancarlo Pellegrino, Christian Rossow, Mar-tin Johns, and Michael Backes. Hey, you have a problem:On the feasibility offLarge-Scalegweb vulnerabilitynotication. In
USENIX Security
, 2016.
[37]Ben Stock, Martin Johns, Marius Steffens, and MichaelBackes. How the web tangled itself: Uncovering thehistory of client-side web (in) security. InUSENIXSecurity
, 2017.
[38]Ben Stock, Giancarlo Pellegrino, Frank Li, MichaelBackes, and Christian Rossow. Didn't you hearme?—towards more successful web vulnerability no-tications. 2018.
[39]Shuo Tang, Nathan Dautenhahn, and Samuel T King.Fortifying web-based applications automatically. InACM CCS
, 2011.
[40]Martino Trevisan, Stefano Traverso, Eleonora Bassi, andMarco Mellia. 4 years of eu cookie law: Results andlessons learned.
PETS
, 2019.
[41]Giorgos Tsirantonakis, Panagiotis Ilia, Sotiris Ioannidis,Elias Athanasopoulos, and Michalis Polychronakis. Alarge-scale analysis of content modication by open httpproxies. In
NDSS
, 2018.
[42]Gareth Tyson, Shan Huang, Felix Cuadrado, IgnacioCastro, Vasile C Perta, Arjuna Sathiaseelan, and SteveUhlig. Exploring http header manipulation in-the-wild.In
WWW
, 2017.
[43]Lukas Weichselbaum, Michele Spagnuolo, SebastianLekies, and Artur Janc. Csp is dead, long live csp! onthe insecurity of whitelists and the future of contentsecurity policy. In
ACM CCS
, 2016.
[44] Mike West. Content Security Policy Level 3. w3.org.
[45]WhatIsMyBrowser.com. Latest user agents for webbrowsers & operating systems. whatismybrowser.com.
A Disclosure Email
Hello,
We are a team of security researchers from the CISPA Helmholtz
Center for Information Security located in Saarland, Germany
and Università Ca

Foscari Venezia, Italy. In our current
research project, we investigate inconsistent behavior in the
deployment of security headers for Web applications.
,
!
,
!
,
!
,
!
For that, we have visited your site through different vantage
points (VPN and Tor) as well as with different configurations
(User-Agents and Accept-Language request headers).
,
!
,
!
In our automated tests, we detected both non-deterministic
differences (e.g., we received different levels of security
even with the same user agent) or those differences which
seemed related to the vantage point or configuration.
,
!
,
!
,
!
We would like to raise your attention to one of those
inconsistencies that occurred on <DOMAIN>:
,
!
<DETAILS_ABOUT_INCONSISTENCY>
We would appreciate if you can check the reason for the issue,
address it to ensure consistent security, and also let us know
about what such a reason might have been, since this will allow
us to better help others in the future.
,
!
,
!
,
!
If you have any questions or need further information, please do
not hesitate to contact us by answering this email.
,
!
B Overview of Additional CrawlsOur conrmation crawls offer two additional insights: on thestability of inter-test inconsistent sites and on theinstabilityof the intra-test inconsistent cases. The data, which is shownin the following tables, highlights that even 12 days after ouroriginal crawl, we could still detect 194 inter-test inconsis-tent sites (see Table 6). Intersecting the sites withintra-testinconsistencies, however, shows that the numbers seeminglydecline (through 100 sites down to 96). This is to be expected,as we are measuring non-deterministic behavior. However, ifwe take theunionof all sites which had at least one intra-testinconsistency across any of our crawls, this sums up to 210(see Table 5) sites instead of only 127. This likely means thatthe actual dangers of non-deterministic header deployment ismore severe than what we are able to measure through ourlimited number of observations.MechanismUsage# Sites w/ intra-test inconsistenciesUA Lang. VPN TorAnyContent Security Policy2,02920 16 42 3250
- for XSS mitigation3641 - 3 14
- for framing control1,31311 10 23 1728
- for TLS enforcement67312 10 23 1625X-Frame-Options5,75130 30 64 3974Strict-Transport-Security4,60727 22 49 5080
w/o page similarity*4,60780 57 365 9471,152Cookie Security3,97522 16 26 2833
- Secure attribute3,0099 8 13 1317
- SameSite attribute81213 8 13 1718
- HttpOnly attribute3,1962 - 2 23Any8,23790 73 163 135210Table 5: Union of all intra-test inconsistencies snapshots.

--- page 36 ---

USENIX Association
31st USENIX Security Symposium 2063

--- page 37 ---

MechanismUsage# Sites w/ intra-test inconsistencies# Sites w/ inter-test inconsistencies# Sites w/ only inter-test inconsistenciesUA Lang. VPN TorAnyUA Lang. VPN TorAnyUA Lang. VPN TorAnyIntersection of January 2 and January 6
Content Security Policy1,9877 4 27 182915 - 25 154315 - 8 427
- for XSS mitigation3571 - - 129 - 1 1109 - 1 -10
- for framing control1,2813 3 14 7142 - 13 5172 - 6 210
- for TLS enforcement6594 1 16 11174 - 11 9164 - 1 27X-Frame-Options5,66215 13 35 17447 - 22 7307 - 7 215Strict-Transport-Security4,55313 12 23 17308 - 17 9288 - 9 319
w/o page similarity-37 23 75 32239418 2 515 14558317 2 489 27520
- preload9183 3 6 610- - 8 39- - 6 -6

w/o page similarity-5 4 12 59671 1 115 291291 1 109 4112Cookie Security3,8369 7 10 1115147 1 9 4158147 1 8 1156
- Secure attribute2,9074 2 5 68142 - 6 3148142 - 6 1148
- SameSite attribute7775 5 5 575 1 3 1105 1 2 -8
- HttpOnly attribute3,069- - 1 122 - 2 142 - 2 -4Any8,14539 31 86 59100174 1 64 30244172 1 26 8191
Intersection of January 2 and January 10
Content Security Policy1,9869 4 27 183015 - 26 164315 - 10 429
- for XSS mitigation354- - - 129 - 1 1109 - 1 -10
- for framing control1,2855 3 15 8152 - 14 5182 - 7 110
- for TLS enforcement6585 1 16 10184 - 11 10154 - 2 39X-Frame-Options5,65414 12 35 19437 - 20 12307 - 6 517Strict-Transport-Security4,54912 12 21 16308 - 17 9278 - 10 420
w/o page similarity-32 24 77 37044318 2 512 13957317 2 480 18503
- preload9142 3 5 59- - 8 49- - 6 17

w/o page similarity-4 4 11 71811 1 114 281301 1 108 3112Cookie Security3,84110 8 11 1016147 1 10 4159146 1 7 1154
- Secure attribute2,9144 3 5 58141 - 6 3147141 - 5 1146
- SameSite attribute7815 5 5 576 1 4 1126 1 2 -9
- HttpOnly attribute3,0751 - 2 132 - 2 142 - 2 -4Any8,14239 30 86 58100174 1 66 35244173 1 29 12194
Intersection of January 2 and January 14
Content Security Policy1,9858 5 26 203115 - 26 164315 - 10 429
- for XSS mitigation359- - - 119 - 1 1109 - 1 -10
- for framing control1,2785 2 15 8162 - 13 5172 - 6 210
- for TLS enforcement6594 3 15 12184 - 12 10164 - 3 29X-Frame-Options5,65414 8 32 18386 - 18 11266 - 7 515Strict-Transport-Security4,54812 10 19 17267 - 15 7247 - 11 219
w/o page similarity-33 22 65 36942417 2 535 13659516 2 512 20535
- preload9133 2 5 69- - 8 49- - 6 -6

w/o page similarity-5 5 10 66731 1 119 291311 1 114 2116Cookie Security3,82510 9 11 1116148 1 11 4161147 1 9 1157
- Secure attribute2,8974 4 5 68143 - 8 3151143 - 7 1150
- SameSite attribute7785 5 5 575 1 3 1105 1 2 -8
- HttpOnly attribute3,0661 - 2 132 - 2 142 - 2 -4Any8,13538 27 79 6196174 1 61 33239173 1 31 10194Table 6: Overview of overlap with additional snapshots of our analysis

--- page 38 ---

2064 31st USENIX Security Symposium
USENIX Association
