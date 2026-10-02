---
type: Whitepaper
title: "Security Risks in Asynchronous Web Servers: When Performance Optimizations Amplify the Impact of Data-Oriented Attacks"
description: Asynchronous web servers like Nginx serve every client from one long-lived process, so a single memory bug reaches all of them. The paper traces memory to locate configuration structures, beats ASLR with a Heartbleed-style linear heap leak, then uses arbitrary writes to repoint the config pointer table at faux structures, disabling logging and security headers and leaking the private key.
resource: "https://fabianmonrose.github.io/papers/morton18.pdf"
tags: [whitepaper, webseclist-reference, info-leak, auth-bypass, attack-chain, case-study, tls, cve, owasp-a01-2021, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T20:59:31+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://fabianmonrose.github.io/papers/morton18.pdf"
    title: "Security Risks in Asynchronous Web Servers: When Performance Optimizations Amplify the Impact of Data-Oriented Attacks"
    author: Micah Morton, Jan Werner, Panagiotis Kintis, Kevin Snow, Manos Antonakakis, Michalis Polychronakis, Fabian Monrose
also_at: []
authors:
  - Micah Morton
  - Jan Werner
  - Panagiotis Kintis
  - Kevin Snow
  - Manos Antonakakis
  - Michalis Polychronakis
  - Fabian Monrose
canonical_url: ""
cited_by:
  - "2018.md:88"
commit: ""
content_sha256: 34950025a031df307cfcd8ceba5f0ff495490efb7d454c36917cc2f9571040b5
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://fabianmonrose.github.io/papers/morton18.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 83c8c5cf4fcca88a25523579521e66b1f772a34f53be9e37ba735b6e5df88930
retrieved_from: "https://fabianmonrose.github.io/papers/morton18.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-14T20:59:31+00:00"
slug: security-risks-asynchronous-web-servers-when-performance-optimizations-attacks
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Security Risks in Asynchronous Web Servers: When Performance Optimizations Amplify the Impact of Data-Oriented Attacks

**Security Risks in Asynchronous Web Servers: When Performance Optimizations Amplify the Impact of Data-Oriented Attacks** - Micah Morton, Jan Werner, Panagiotis Kintis, Kevin Snow, Manos Antonakakis, Michalis Polychronakis, Fabian Monrose, Publisher not stated.

- Published: date not stated
- Original: <https://fabianmonrose.github.io/papers/morton18.pdf>
- Preserved from: https://fabianmonrose.github.io/papers/morton18.pdf (stored) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

2018 IEEE European Symposium on Security and Privacy




    Security Risks in Asynchronous Web Servers: When Performance Optimizations
                      Amplify the Impact of Data-Oriented Attacks

                                 Micah Morton,∗ Jan Werner,∗ Panagiotis Kintis,† Kevin Snow,‡
                                Manos Antonakakis,† Michalis Polychronakis,§ Fabian Monrose∗
                    ∗ University of North Carolina at Chapel Hill; email: {micah,jjwerner,fabian}@cs.unc.edu,
                                  † Georgia Institute of Technology; email: {kintis,manos}@gatech.edu,
                                       ‡ Zeropoint Dynamics; email: kevin@zeropointdynamics.com,
                                        § Stony Brook University; email: mikepo@cs.stonybrook.edu




 Abstract—Over the past decade, many innovations have been                        1. Introduction
 achieved with respect to improving the responsiveness of
 highly-trafﬁcked servers. These innovations are fueled by a                      Since the earliest memory corruption attacks emerged as
 desire to support complex and data-rich web applications                         serious threats to the security of computer systems, security
 while consuming minimal resources. One of the chief ad-                          professionals have been tirelessly trying to stay ahead of
 vancements has been the emergence of the asynchronous web                        exploitation tactics. Much of this defensive effort has fo-
 server architecture, which is built from the ground up for                       cused on thwarting attacks that corrupt application control
 scalability. While this architecture can offer a signiﬁcant boost                structures in order to hijack the execution of running soft-
 in performance over classic forking servers, it does so at the                   ware. Data Execution Prevention (DEP), which enforces that
 cost of abandoning memory space isolation between client
                                                                                  writeable data sections of a program (e.g., the stack) are not
 interactions. This shift in design, that delegates the handling
                                                                                  also executable, and Address Space Layout Randomization
                                                                                  (ASLR) are two prominent examples of widespread defenses
 of many unrelated requests within the same process, enables
                                                                                  that have been incorporated into mainstream systems. How-
 powerful and covert data-oriented attacks that rival complete
                                                                                  ever, these defenses were later shown to be less effective
 web server takeover — without ever hijacking the control ﬂow
                                                                                  than ﬁrst thought given a single memory disclosure [33].
 of the server application.
                                                                                      Accepting the fact that there will be exploitable bugs
                                                                                  in complex programs, the designers of modern browsers
     To demonstrate the severity of this threat, we present                       have chosen to limit exploitation by delegating buggy ren-
 a technique for identifying security-critical web server data                    dering code to unprivileged sandbox processes. Similarly,
 by tracing memory accesses committed by the program in
                                                                                  contemporary web servers are built in a way that delegates
 generating responses to client requests. We further develop a
                                                                                  connection parsing and processing to lower-privilege worker
                                                                                  processes. In both cases, these design decisions force adver-
 framework for performing live memory analysis of a running
                                                                                  saries to further employ privilege escalation attacks to gain
 server in order to understand how low-level memory structures
                                                                                  system-level access, which in turn adds an extra layer of
 can be corrupted for malicious intent. A fundamental goal of
                                                                                  sophistication in order to successfully exploit an application.
 our work is to assess the realism of such data-oriented attacks
                                                                                  While not perfect, these mitigations signiﬁcantly raise the
 in terms of the types of memory errors that can be leveraged
                                                                                  bar for control-hijacking attacks.
 to perform them, and to understand the prominence of these
                                                                                      That being said, as system compromise through control
 errors in real-world web servers. Our case study on a leading
                                                                                  ﬂow hijacking becomes more difﬁcult due to the myriad of
 asynchronous architecture, namely Nginx, shows how data-                         defenses that have been deployed in this space, adversaries
 oriented attacks allow an adversary to re-conﬁgure an Nginx                      will undoubtedly explore new paths of least resistance.
 instance on the ﬂy in order to degrade or disable services (e.g.,                One such path is via the so-called data-oriented attacks
 error reporting, security headers like HSTS, access control),                    that leverage the power of memory corruption to target
 steal sensitive information, as well as distribute arbitrary                     non-control data for the purpose of exploiting applications
 web content to unsuspecting clients — all by manipulating                        without ever corrupting control ﬂow [11, 21, 22, 23, 30].
 only a few bytes in memory. Our empirical ﬁndings on the                             We take a multi-step approach in demonstrating the fea-
 susceptibility of modern asynchronous web servers to two well-                   sibility of data-oriented attacks against modern web servers.
 known CVEs show that the damage could be severe. To address                      We show that these attacks are made easy because of per-
 this threat, we also discuss several potential mitigations. Taken                formance versus security tradeoffs that have been made by
 as a whole, our work tells a cautionary tale regarding the risks                 web server architectures. To elucidate these issues, we ﬁrst
 of blindly pushing forward with performance optimizations.                       describe a method for locating security-critical conﬁguration

© 2018, Micah Morton. Under license to IEEE.                                167
DOI 10.1109/EuroSP.2018.00020


   Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
data structures by tracing server execution during request                                Synchronous Web Server
                                                                                               (e.g., Apache)
                                                                                                                                 Asynchronous Web Server
                                                                                                                                       (e.g., Nginx)
processing. We then propose an automated framework for
live memory analysis which can be used to expose the low-                                        Parent Process                         Parent Process
level state of critical data structures at runtime, matching
different live memory states with different conﬁguration ﬁle                                                                          

parameters on disk. Next, we show how our automated
                                                                                           Worker                  Worker                Long-running
framework can be used to produce faux copies of key server                               Process #1              Process #N             Worker Process

data structures without any need for manual source code                                                    

analysis or reverse engineering. Using this framework, we
demonstrate how an adversary can leverage real-world mem-
ory disclosure and corruption vulnerabilities to re-conﬁgure




                                                                                                   Resp.




                                                                                                                         Resp.




                                                                                                                                          Resp.




                                                                                                                                                                  Resp.
                                                                                          Req.




                                                                                                                 Req.




                                                                                                                                 Req.




                                                                                                                                                        Req.
a running web server on the ﬂy, by redirecting data pointers
to faux structures, instead of redirecting code pointers to                                 Client 1           Client N         Client 1             Client N
malicious code. We present a complete case study of such
data-oriented attacks against the contemporary Nginx web
                                                                                  Figure 1: Synchronous vs. asynchronous web servers.
server, and evaluate the covertness of our demonstrated
attack in the face of common real-world security-hardened
deployment scenarios. Our speciﬁc innovations include:
                                                                                of a process object, as well as the overhead of context
   • A ﬂexible and robust instrumentation technique for
                                                                                switching between processes, means that this model is not
     identifying security-critical data in web server memory.                   satisfactory for web servers that must handle hundreds or
   • An approach for bypassing ASLR using only a linear
                                                                                thousands of incoming connections concurrently.
     heap memory disclosure vulnerability.
                                                                                     In response to demands for highly concurrent web
   • Highlighting how an adversary can signiﬁcantly reduce
                                                                                servers, traditional process-based architectures such as
     the work factor involved in server takeover (compared
                                                                                Apache have begun to offer thread-based concurrency that
     to what is typically considered necessary using con-
                                                                                allows a single process to service multiple concurrent con-
     temporary approaches).
                                                                                nections by dedicating a unique thread to each connection.
   • Evaluating the feasibility of such attacks by studying
                                                                                In this way, one thread in a process can block while waiting
     the widespread susceptibility of deployed web servers
                                                                                for an I/O operation to complete at the same time that other
     to vulnerabilities that enable such attacks.
                                                                                threads continue to service other requests. This approach,
                                                                                called worker mode by Apache [4], is a popular alternative
2. Background                                                                   to process preforking when scalability to many connections
Although modern web servers generally carry out a set                           is important, but allocating a thread for each connection is
of straightforward tasks when handling incoming requests                        still considered inefﬁcient for many real-world servers [24].
(e.g., accepting network connections, parsing client requests,                       As the demand for web server concurrency has in-
fetching content from a datastore, and generating responses),                   creased, a new architecture emerged: the asynchronous
there have been a number of proposed approaches to imple-                       (event-driven) web server. Under this model, requests
menting this workﬂow. The differences can be attributed to                      are serviced asynchronously by a single (single-threaded)
varying standards for scalability, performance, robustness,                     worker process, which uses event-based callback functions
and simplicity in design. Designing a web server architec-                      to carry out server functionality when needed (e.g., parse
ture that is optimized for any of these high-level attributes                   request headers, construct response headers). Since blocking
involves awareness of how to leverage lower-level operating                     on synchronous I/O is not necessary, connections do not
system features (e.g., processes, threads, asynchronous I/O).                   need to be associated with a scheduling unit that can be
    One approach relies on using a different process or                         suspended, providing greater scalability. Note that the func-
thread for each connection being serviced. This greatly                         tionality that enables asynchronous request processing (e.g.,
improves the scalability of servicing requests through syn-                     chaining processing modules together via callback func-
chronous I/O, since the process or thread associated with                       tions) must be at the core of the overall server architecture
a given request can be suspended while waiting for an I/O                       and must be incorporated into many design aspects.
operation to complete — freeing resources which can be                               Despite the challenges of refactoring its core syn-
dedicated to processing additional requests. In recent years,                   chronous processing implementation, Apache recently of-
this model has been popularized by the Apache web server,                       fered a processing mode known as event [4], which makes
which forks a separate process to handle each incoming con-                     further strides to optimize the number of clients that can
nection, terminating it upon connection closure. One notable                    be handled simultaneously by a single worker process. As
optimization of Apache’s process-per-request architecture                       we show later, the risks of abandoning web server memory
involves preforking a pool of processes on startup to avoid                     space isolation between client requests, will only become
the overhead of forking upon each incoming connection.                          more relevant as Apache continues to refactor its server de-
While using multiple processes for handling concurrent                          sign to match the impressive scalability performance offered
requests indeed beneﬁts scalability, the heavyweight nature                     by asynchronous architectures.



                                                                          168



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
    Nginx (pronounced engine-x), the market’s most popular                      write capabilities against popular server programs, thereby
asynchronous web server, has garnered widespread adop-                          conﬁrming the generally accepted notion that motivated
tion as a result of its ground-up design for asynchronous                       adversaries will ﬁnd ways to leverage memory corruption
scalability [39]. In fact, although Apache still holds the                      exploits (e.g., buffer overﬂow, use-after-free, double free) in
largest market share, many sites have switched to Nginx in                      order to achieve the so-called write-what-where capabilities
recent years (potentially also incorporating other back-end                     [26]. This scenario — which affords the ability to write an
processing solutions). At the start of the decade in 2010,                      arbitrary value at an arbitrary location in process memory
Apache claimed 71.5% of the web server market, while                            — can be enacted in a variety of ways, such as corrupting
Nginx was only used by 3.9% of sites. However, as of                            stack or heap objects that will be written to in the future.
January 2017, only 50.9% of sites still use Apache, while                       Like Hu et al. [22], we assume the existence of an arbitrary
32.1% use Nginx. The popularity of Nginx is especially                          write vulnerability in Nginx for the proof of concept exploits
apparent for the busiest websites, as the majority of the                       presented in Section 6.
busiest 100,000 sites use Nginx over Apache [41].                                    Although we assume such arbitrary write capabilities,
    Figure 1 shows the high-level architectural differences                     we do not assume the ability to use memory corruption to
between the industry’s two most popular web servers. Crit-                      gain arbitrary read capabilities. In particular, after extensive
ically, the ﬁgure shows the difference in how Apache uses                       research, we found no practical exploits or exploit method-
process-based isolation to logically separate request process-                  ologies that can be leveraged to disclose server memory at
ing, while Nginx handles all requests in a single process.                      an arbitrary address. Although such exploits may exist, we
This key difference in architectural models has major im-                       restrict ourselves from asserting the theoretically powerful
plications in terms of the susceptibility of these web servers                  assumption of arbitrary read capabilities due to their rarity
to non-control-data oriented attacks.                                           and to keep with our goal (§4) of presenting attacks that are
                                                                                feasible in the real world.
2.1. Exploiting Web Servers                                                          On the other hand, there have been instances of server
Exploiting a web server can be a desirable feat for mounting                    vulnerabilities that disclose a linear swath of heap memory
widespread attacks against unsuspecting clients. Web server                     (e.g., Heartbleed (CVE-2014-0160), Cloudbleed [18], Ya-
exploitation is often the ﬁrst step in a drive-by download                      hoobleed (CVE-2017-9098), CVE-2014-0226, CVE-2012-
campaign, where the ultimate goal is to use the popularity                      1180) at an unspeciﬁed address. The Heartbleed vulnera-
of a legitimate website to distribute malware once the web                      bility, for example, was one of the most impactful security
server has been compromised. To put the ﬁndings of                              issues in the last decade, with 24–55% of HTTPS servers in
this work in perspective, it is important to understand the                     the Alexa Top 1 million sites being initially vulnerable [14].
requirements for a modern-day exploit chain that seeks to                       In early 2017, researchers uncovered the Cloudbleed vul-
gain system level control of a victim machine. Due to                           nerability in Cloudﬂare’s CDN service, due to a memory
ubiquitously deployed mitigations such as DEP and ASLR,                         error in an Nginx module used for parsing and modifying
full system exploitation generally requires an adversary to:                    HTML pages on-the-ﬂy [18]. This vulnerability serves as a
                                                                                reminder that complex and memory-error-prone processing
  1) Exploit a memory corruption vulnerability to modify                        is employed by cloud-based services within the conﬁnes
      the contents of an application’s memory.                                  of Nginx’s asynchronous architecture. While Heartbleed,
  2) Leverage a memory disclosure bug to circumvent ad-                         Cloudbleed, and similar vulnerabilities do not give the ad-
      dress space randomization.                                                versary as powerful of a primitive as arbitrary read, we
  3) Prepare a code re-use payload in memory and pivot the                      show that even a partial linear read of heap memory (whose
      stack pointer to the start of this chain.                                 location is not controlled by the adversary) can be leveraged
  4) Use the ROP chain to map the location of injected                          to undermine ASLR and locate key application structures as
      shellcode as executable.                                                  a ﬁrst step in performing powerful data-oriented attacks.
  5) Launch a privilege escalation attack against higher-
      privilege components.
                                                                                3. Other Related Work
     Each of these steps in the exploit chain provide unique
challenges to an adversary. In particular, accepting the fact                   Over a decade ago, Chen et al. [11] highlighted the power of
that memory errors will inevitably occur in complex ap-                         leveraging memory corruption exploits to subvert systems
plications written in type-unsafe C/C++ code, the research                      through the manipulation of security-critical non-control-
community has focused heavily on raising the bar for steps                      data — all without ever corrupting the control ﬂow struc-
3–5 through DEP and code reuse defenses, sandbox devel-                         tures of an application. They demonstrated data-oriented
opment, kernel hardening and many others.                                       attacks against an assortment of widely-used server-side
     Interestingly, while the absence of untrusted script exe-                  applications, but their approach required manual source code
cution protects web servers from many associated vulnera-                       analysis to obtain in-depth semantic knowledge regarding
bilities, the non-trivial logic implementing complex request                    the layout of security-critical data and how its corruption
processing and dynamic content generation exposes a con-                        could be leveraged in each application. More recently, Hu
siderable attack surface to adversaries. Indeed, Hu et al.                      et al. [21] showed how to lessen the amount of a-priori
[22] recently showed the feasibility of achieving arbitrary                     knowledge needed for pulling off the same attacks pre-



                                                                          169



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
sented by Chen et al. [11]. Their approach, termed data-                        web servers and the ability to trivially defeat ASLR given
ﬂow stitching, utilizes taint tracking to compute data ﬂows                     these primitives. However, our extensive research into the
that occur during application runtime. This approach treats                     actual remote server exploits seen in the wild — as well as
ﬁle inputs to the application as data sources and ﬁle outputs                   published research on the matter [22] — led us to question
as data sinks, tracing how critical data is imported to an                      that assumption, and instead limit our adversarial model to
application from the ﬁle system as well as how information                      one in which the adversary has the powers of arbitrary write,
generated by the program ﬂows out to the ﬁlesystem. Shortly                     but only linear heap disclosure. Critically, unlike prior work,
thereafter, Hu et al. [22] highlighted the feasibility of using                 we do not assume the adversary can read data from arbitrary
commonly occurring memory corruption vulnerabilities to                         addresses in memory since we see no supporting evidence
gain arbitrary write capabilities in server programs. That                      for this ability in real-world server exploits. Our attacks are
work shows how memory errors can be leveraged to achieve                        demonstrated against Nginx, the industry leader in scalable,
write-what-where [26] capabilities in process memory.                           event-based server architectures. For simplicity, we assume
    None of these works provide a general technique for                         the adversary has access to debug symbols, which is a
overcoming ASLR, but rather require that a pointer to                           realistic assumption given that the two most popular web
security-critical data is somehow leaked to the adversary by                    servers1 , namely Apache and Nginx, are both open source.
the same memory error that allows for the arbitrary write.
Thus, it is unclear how an adversary would adapt the opaque                     5. Approach
payloads generated by these approaches, even if the loca-
tions of modules in the process address space were known                        Even under the assumption that an adversary can leak heap
through traditional ASLR-bypass techniques. Empowered                           memory and overwrite arbitrary data in process memory,
by the write-what-where [26] capabilities demonstrated in                       there are several hurdles that must be overcome to achieve
Hu et al. [22], we explore the importance of server process                     viable data-only attacks against asynchronous web servers.
architectures and how they affect data-oriented attacks. This                   First among these is identifying data that when overwritten
connection has been critically overlooked, and we believe                       will have the intended high-level effect of injecting mali-
this oversight has dire consequences moving forward.                            cious web content that would result in drive-by downloads
                                                                                or disabling services that provide privacy and conﬁdentiality.
3.1. Defenses Against Control-Flow Hijacking                                    Next, having identiﬁed this data, we must ﬁnd ways to
                                                                                reliably overwrite it to meet the desired objective. Lastly,
As the security community has largely acknowledged that
                                                                                to fully explore the power of this threat, we seek ways to
memory corruption vulnerabilities in complex software are
                                                                                automate the steps as much as possible.
inevitable, defensive mitigations have most prominently tar-
geted the control-ﬂow hijacking steps of the exploit chain                      5.1. Memory Access Tracing
— including return-oriented programming tactics [34] and
related variants. These solutions employ varied techniques                      To address the ﬁrst challenge, we provide a technique for
to thwart attacks, such as ensuring control-ﬂow integrity                       tracing the memory accesses committed by a web server in
(CFI) [1, 29] or employing code diversiﬁcation (e.g., [5]).                     servicing a request, and explain how these accesses can be
These approaches do not protect against data-oriented at-                       inspected to identify data that is critical to server execution
tacks as they are exclusively directed towards protecting the                   as conﬁgured by website administrators. In other words, we
executable section of a program from being repurposed for                       aim to identify data consulted on every incoming request
malicious means, and do nothing to enforce the integrity of                     that when overwritten will cause the server to behave differ-
non-control data that is read or written by the application.                    ently than expected. Unexpected behaviors include serving
                                                                                malicious drive-by download content along with the original
4. Goals And Adversarial Model                                                  benign web pages, or downgrading the connection security
                                                                                of HTTPS without warning.
Given the fact that asynchronous server architectures such                          Our solution uses Intel’s Pin framework [25] to record all
as Nginx handle many client connections in the same long-                       reads directed at the .data section of the main executable’s
lived server process, our goal is to show realistic attack sce-                 memory from the time the server receives an incoming
narios in which data-oriented attacks have expressive power                     HTTP request until the service of this request is complete.
rivaling that of control-ﬂow hijacking exploits against web                     For each read, we also record the instruction pointer which
servers. Moreover, we seek to show that in some respect,                        issued the read. Next, in an ofﬂine phase, we use debug
data-only attacks are more attractive from an adversarial                       symbols to construct a timeline of data accesses made when
perspective than attacking control ﬂow, since they tend to be                   servicing a request, including the variable name and offset in
especially covert from a system-monitoring perspective, and                     the .data section that was accessed as well as the function
also obviate the need for further privilege escalation attacks                  name and offset that issued the access. We trace accesses to
once the server worker process has been exploited.                              the .data section (rather than the heap) because they tend
4.1. Adversarial Model                                                          to offer better insight into the high-level operations that take
                                                                                place while a server is processing a request. Speciﬁcally, the
As alluded to earlier, recent work [31] has assumed the
full powers of arbitrary read and write exploitation against                      1. Together, these servers account for 83% of the market share [42].




                                                                          170



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
                       .data section                                .text section                                            Heap

                                                                                                             Config. data
                                                                                                             pointer table
                                                                                     Core config.
                                                                                                  
                                                          
                                                                                                            
                                                                                                                               



                                                                                                                Log config.
                                                                   
                                                                                                  
                                                          
                               
                                                                                                                               


                                               Retrieve                                                                       Access control config.
                                                
                                                offset
                                                                                   Reference
                                                                                             config. data
                                                                                                                            



                                                                                                                Headers filter config.
                                                                                                              
                                                            
                                                       
                               
                                                                                                                              




                                     Learned through program instrumentation                                  Learned through memory analysis

Figure 2: NGINX exploit diagram. Through program instrumentation and memory analysis, an attacker can locate the entries
of interest in the conﬁguration data pointer table, and overwrite them to point to malicious entries.


.data section often contains top-level pointers to complex                                towards generating a response. Thus, following the control
per-module data structures which are spread throughout the                                ﬂow and data accesses of asynchronous web servers through
heap, and this top-level is generally a good starting point                               manual source code inspection is a difﬁcult task, and for
for the live memory analysis techniques explained shortly.                                that reason, we resorted to program instrumentation to help
Moreover, the heap is accessed thousands of times more                                    identify security-critical data.
often during request processing than the .data section,                                       For pedagogical reasons, we note that a sample memory
and thus it is more difﬁcult to associate high-level server                               trace for Nginx to service an HTTP GET request contains
operations with individual memory accesses. Lastly, even                                  less than 150 accesses to the data section, so it is feasible
while instrumenting a program it is often difﬁcult to as-                                 to manually identify data of interest. For example, the 96th
sociate individual allocations with the type of object that                               access directed at the data section in our trace originated
will reside at the given heap location, thus lessening the                                from ngx http access handler(), which accesses
advantages provided by debug symbols.                                                     data at offset 0 within the ngx http access module
     The reader may be wondering why we do not simply                                     structure. With a quick inspection, it becomes clear that
conduct manual source code analysis to identify where                                     the function is referencing an access control conﬁgura-
critical conﬁguration data is accessed in the server program.                             tion data structure on the heap, using an index stored at
In fact, we initially took this manual approach, but soon re-                             ngx http access module + 0 to retrieve the pointer
alized that the complex nature of asynchronous web servers                                to this data. Given such a memory trace, an adversary can
(in the way they chain modules and functionality together                                 easily hone in on some important access control related
through callback functions) made for much difﬁculty in                                    conﬁguration data in memory. While this example may
manually tracing the ﬂow of execution that occurs while                                   seem overly simple, we found that additional code paths
handling even the simplest of requests. Said another way,                                 we identiﬁed in Nginx, that consult in-memory conﬁguration
the performance optimization gained by asynchronous server                                data structures for other modules (e.g., SSL module, security
architectures comes at the cost of code simplicity, as every                              headers module, error and access logging modules), are just
small module of processing that takes place in servicing                                  as straightforward to analyze.
a request must be chained together through complex data
                                                                                          5.2. Corrupting Data for a Desired Effect
structures rather than following a simple, sequential order.
Such modular code design is an essential component of                                     Armed with the ability to locate sensitive data within a
asynchronous web servers, as there are no thread or process                               program, the next challenge involves determining how to
objects to save the code execution state of a partially-formed                            overwrite that data for the intended degradation of server
response while waiting on some resource (e.g., a ﬁle from                                 security — without introducing unstable behavior to the
disk). Instead, small code modules accomplish simple tasks                                server. In this work, we restrict our attacks to inﬂuencing the
that can be asynchronously invoked to perform some step                                   in-memory representation of conﬁguration data. Speciﬁcally,



                                                                                    171



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
                                                                                                                             
we seek to understand how different server conﬁguration                            (a)                                 
options cause in-memory data structures to be populated                                                                             #"!%$

with different data. This objective could conceivably be                                     
                                                                                                                                   

                                                                                                           $                
achieved through manual source-code analysis, tracking the
                                                                                                                  
data ﬂow of information from conﬁguration ﬁle to in-                                          
memory structures. However, as discussed in Section 5.1,                                                            
                                                                                                                                          
                                                                                                                                            
the complex nature of callback functionality to support                                                                                #"! &
                                                                                             
asynchronous server processing means such manual analysis                          (b)                                  

                                                                                                                   &                
is a non-trivial task. Alternatively, related work by Hu et al.
                                                                                                                       
[21] uses taint tracking to identify data in a server that is                                
                                                                                              
inﬂuenced by directives in a conﬁguration ﬁle, but this is                                   
an unnecessarily complex approach that generates a vast                                    

search space,2 and at times requires the adversary to fall
back on manually specifying the security-sensitive data in                       Figure 3: Extracted data structures by our memory analysis
an application.                                                                  framework when conﬁguring Nginx (a) to deny all access,
    Instead, we leverage the information gained from the                         and (b) to not perform any access control.
memory tracing step to conduct live memory analysis of a
running server application in order to provide intelligence
on the low-level state of security-critical data structures and                  human-readable printout of the data structure as well as a
how they can be manipulated. Speciﬁcally, our solution for                       copy of the data structure in binary format. There are two
live memory analysis assumes that step one of our attack                         distinct abilities that this memory analysis approach affords
workﬂow has identiﬁed a spot in the code that references the                     the user. First, the framework can identify places in a given
given in-memory conﬁguration data structure in question.                         conﬁguration data structure that vary for different conﬁg-
Considering Nginx in particular, we observe that it has                          uration settings. Running a program multiple times with
unique data structures representing the conﬁguration for                         different conﬁgurations and performing a simple diff on the
its different processing modules (e.g., SSL module, GZIP                         output of the memory analysis allows the user to quickly get
module, access control module), and that each of these                           a sense of the changes in low-level data structures that oc-
modules consult those data structures in determining how                         cur in response to issuing different high-level conﬁguration
to respond to a request.                                                         directives to the application. This is useful for determining
    In this way, for an arbitrary server processing module,                      the elements in a data structure whose runtime modiﬁcation
we can set a breakpoint on a location in the program                             will essentially re-conﬁgure the server, causing it to behave
that obtains a pointer to that module’s conﬁguration data,                       differently than was intended by the conﬁguration settings.
and run the server with different conﬁguration options set,                      For many of Nginx’s processing modules, it is a non-trivial
investigating how those different high-level conﬁguration                        task to hone in on which ﬁelds in the associated conﬁgu-
directives map onto the low level in-memory data structures                      ration data structure must be (recursively) altered to cause
once they have been populated in process memory (these in-                       the server to operate insecurely without introducing some
memory data structures are shown on the right in Figure 2).                      unexpected behavior. This is because the same conﬁguration
With the application paused at a place where we have a                           structures often appear very differently in process memory,
reference to this process memory, we can combine debug                           depending on the directives given in the conﬁguration ﬁle.
symbols with access to raw process memory to construct                           Our framework relieves the burden of needing to understand
an image of how the different conﬁguration data structures                       all of these complex interdependencies in the conﬁguration
for given modules are populated based on different spec-                         data structures, instead forcing the application to generate
iﬁcations in the conﬁguration ﬁle. In essence, we build a                        the different versions of the structure and making it easy to
memory analysis framework that produces a live snapshot                          observe the differences.
of a given structure, including following pointers to other                          Figure 3 shows example outputs of running our mem-
structures and capturing their snapshots recursively. The left                   ory analysis framework on the access control conﬁguration
side of Figure 2 shows how our instruction tracing step helps                    structure after having conﬁgured the server to (a) deny all
us hone in on spots in the code that reference conﬁguration                      access and (b) to not impose any access control (default
data structures — speciﬁcally via the conﬁg data pointer                         behavior). Many of the conﬁguration structures in Nginx
table. Together with the results of our live memory analysis                     are much more complex with many levels and members,
technique (shown on the right), these two frameworks help                        but this example illustrates how the memory representation
us leverage our assumptions of linear heap disclosure and                        of a structure changes for different conﬁguration directives.
arbitrary write to locate security-critical objects in memory                    The differences in these structures for different conﬁguration
and corrupt them for malicious effect.                                           directives completely determine how the server responds to
    The output of our memory analysis framework is a                             a given request in terms of access control. We refer to a
                                                                                 snapshot of the data structure our framework creates as
  2. A signiﬁcant fraction of all data in a web server depends on the            a deep copy of that structure since it recursively records
conﬁguration ﬁle in one way or another.                                          pointers to other structures and their values.



                                                                           172



  Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
     A second beneﬁt of our framework is the ability to                         be interpreted as multiple types. This problem is an easier
extract from memory a full copy of a given data structure,                      version of the issue with void pointers, and as such we use
outputting a ﬂattened version of the arbitrarily deep multi-                    the same approach as described above.
level structure. Implementation-wise, this involves arranging                       Pointers treated as the base of an array. When an array
all the objects from the multiple levels of the data structure                  is deﬁned as part of a structure, we can use its statically
into a contiguous buffer and ensuring pointers from one level                   determined size to know how many objects are contained
to another target the correct offsets. The ability to output this               in it, and recursively process them accordingly. On the
ﬂattened structure is especially useful when considering that                   other hand, using only debug symbols, there is no way to
we assume an adversary to be lacking the ability to read                        distinguish when a program treats a pointer type as the base
arbitrary server memory. If an adversary is able to control                     of an array containing multiple items versus simply treating
a pointer to the top level of some multilevel conﬁguration                      it as a pointer to a single object of the given type. Luckily,
structure, they only need to redirect this top level pointer to                 this most often occurs with null-terminated C-style strings of
a full deep copy of the conﬁguration structure in question.                     type char*, and thus we treat char* variables as arrays by
The full copy is necessary since the adversary does not have                    default, processing memory until a null byte is encountered.3
the ability to follow pointers in the data structure to the                         Overall, our memory analysis framework vastly de-
elements they desire to modify, due to our assumption of                        creases the amount of semantic knowledge necessary for
lacking arbitrary memory disclosure capability (see §4). In                     observing the runtime memory layout of security-critical
this scenario, the adversary would use our framework to                         data structures. While not perfect, the framework was suf-
generate a ﬂattened copy of some conﬁguration structure                         ﬁciently effective to enable a wide range of attacks against
featuring the desired insecure directives, write this buffer                    Nginx without performing manual source code analysis to
to server memory, and redirect the top-level pointer to                         reason about the structures used in the application.
reference this injected structure.
                                                                                6. Case Study
5.3. Memory Analysis Framework                                                  As shown in Figure 2, our program tracing and memory
Our live memory analysis framework for processing                               analysis frameworks enable the identiﬁcation of critical
conﬁguration-related data structures is implemented as a                        conﬁguration data in Nginx, and provide an understanding of
GDB Python plugin. With this framework in hand, one                             how that data is accessed by the program. A key realization
can take live deep copy snapshots of a given data structure                     is that given the ability to control the conﬁg data pointer
and compare them across different conﬁgurations, thereby                        table, an adversary could trick the server into referencing
understanding how differences in conﬁguration directives                        any spot in process memory and interpreting it as the given
map to differences in process memory state for. Our memory                      type of conﬁguration data structure. Moreover, since Nginx’s
analysis framework is effective in that it is generic to any                    asynchronous worker processes are long-lived and handle
arbitrary structure in the memory of a program for which                        many connections, corrupting this data in a worker process
debug symbols are available. However, there are a few                           will affect all future requests. In the case of Nginx, although
limitations that are consequences of the C programming                          this conﬁguration data (and associated pointer table) is on
language, which is the source language for both Nginx and                       the heap, there is only a single copy that is referenced
Apache. In what follows, we discuss hurdles we encountered                      throughout the lifetime of the process. Therefore, an adver-
when using our framework on Nginx. While these obstacles                        sary who could corrupt the pointer table and control some
could be overcome through manual inspection of the source                       part of process memory could write fake conﬁguration data
code, we present the techniques we used to overcome them                        structures into memory, cause entries in the pointer table
without such manual effort.                                                     to point to these fake structures, and trick the program into
    Void pointers. At the ﬁrst instance when our recursive                      behaving differently from the way it was conﬁgured.
memory analysis encounters a member of a struct that is of                          In order to accomplish this attack, the adversary must
type void*, we will not know how to treat the structure ref-                    be able to (1) locate the single unique copy of the conﬁg
erenced by that pointer given only debug symbols. However,                      data pointer table on the heap, (2) write a data payload
there is a straightforward workaround for this issue: we can                    somewhere in memory such that it will neither be corrupted
use the tracing technique (§5.1) to pause execution at a place                  in the future by the process nor itself corrupt any meaningful
where the structure is referenced and then set a memory                         data in use by the process, and (3) create a faux conﬁguration
access breakpoint on the location of the void* pointer.                         data structure containing the desired malicious parameters.
Upon resuming execution and triggering the breakpoint, we                       Armed with these capabilities, an adversary can coax the
record the line of code associated with the current program                     server into behaving as desired, without ever hijacking its
counter and note the corresponding source code for the                          control ﬂow. Worse yet, by corrupting this conﬁguration
destination type of the cast from void. Thenceforth, we add                     data, the adversary can have a long-lived effect on the server,
a rule to the memory analysis framework to always treat a                       leaving behind little forensic evidence.
speciﬁc void member in a given structure as a given type
                                                                                  3. There are more complex heuristics that could be performed to predict
for the application under inspection.                                           whether a given variable points to an array, but we did not ﬁnd this to
    Unions. Similarly, we will not know initially how to treat                  be necessary for the security-critical data structures analyzed in this work.
a variable of type union; in which case a single variable can                   Such an exercise is left for future work.




                                                                          173



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
6.1. Experimental Setup                                                         the contents of an ngx http request t object from
                                                                                the heap would allow an adversary to learn the location
Before describing the details of this case study for Nginx, we                  of the conﬁg data pointer table. With the location of the
ﬁrst relay some background experiment setup in terms of the                     table known, an adversary could overwrite particular offsets
deployment scenario that we use to evaluate the feasibility                     (which correspond to different modules and are determined
of our approach in real-world scenarios. A vitally important                    at compile-time) to point to an injected payload comprising
aspect of evaluating the behavior of a web server is the                        a faux conﬁguration data structure. While this will be
ability to interact with that server from client endpoints                      discussed in more detail shortly, we now focus on how an
such that the type and frequency of client interactions are                     adversary can reliably use a linear heap memory disclosure
controlled for all experiments conducted. Importantly, we                       (e.g.,CVE-2014-0160, CVE-2014-0226, CVE-2012-1180)
enable various kinds of functionality on the Nginx server                       to leak an ngx http request t object from the heap.
which we believe is an accurate reﬂection of common real-                           We use the Heartbleed vulnerability in our experiments
world use cases. Speciﬁcally, we ensure that the server                         to show that given a linear heap disclosure (in the case
handles a mixture of HTTP and HTTPS connections, serves                         of Heartbleed, 32KB), its is realistic to assume that an
different types of static content (e.g., HTML and JPEG ﬁles),                   adversary can disclose an ngx http request t object
and serves different types of dynamic content including PHP                     from the heap with high likelihood — even though the
scripts. Likewise, we ensure that any time we issue client                      location of heap data that is disclosed by Heartbleed is
requests to the server, the requests are a diverse mixture of                   unpredictable and different every time. While this may
GET/POST requests, HTTP/HTTPS connections, requests                             seem odd at ﬁrst blush, the chances of success are im-
for different types of static content, requests for URLs that                   proved by the fact that one of these objects is allocated
exist on the server as well as some that do not (triggering                     on the heap for each incoming request, so a server handling
an Error 404 response), and requests for different types                        many requests simultaneously will have many instances of
of dynamic content. The distribution of these requests is                       this object on the heap. Our approach involves triggering
derived from server logs from a popular campus server. Our                      the heap disclosure in the server, followed by identifying
Nginx server ran on a quad core, 8 thread, Intel i7-2600                        an ngx http request t structure within the disclosed
processor with 16 GB of main memory.                                            32KB of arbitrary heap data. To validate the right structure
    Our goal in the experimental setup was to exercise many                     has been found, we perform pattern matching based on
code paths on the server. This is essential for several of                      predictable data contents of the ngx http request t
the experiments we run, including evaluating the feasibility                    structure. In the experiments that follow, we evaluated the
of using heap disclosure to leak speciﬁc objects, as well                       success rate of leaking the desired structure on a moderately
as of ﬁnding safe areas in process memory into which we                         loaded server averaging 25 connections per second — a
can write fake data structures. For the rest of this section,                   number derived from data we collected for one of the main
whenever we mention issuing requests that target our Nginx                      web servers on our campus.
server, those requests are distributed according to the real-                       If no other clients are interacting with the server at
world variations above.                                                         the time a disclosure is performed, there may be only a
6.2. Locating the Conﬁg Data Pointer Table                                      few ngx http request t objects on the process heap.
                                                                                However, adversaries can increase their chances of success
Recall that our program instrumentation step allows us to                       by preparing the process heap with innocuous HTTP re-
hone in on locations in the code that retrieve pointers to                      quests before performing the disclosure. It is important that
conﬁguration data from the conﬁg data pointer table. In-                        these requests are performed in parallel, so that multiple
vestigation of the macro in Nginx that conducts this pointer                    ngx http request t objects are allocated on the heap
retrieval shows that the location of the table is stored as                     for the different requests. Therefore, in each run of the
part of every HTTP request structure in the program. The                        experiment, we allow the adversary to prime the server by
HTTP request structure, called ngx http request t in                            ﬁrst issuing n ∈ 0 . . . 30 simultaneous HTTP requests before
the source code and referred to by r in the following                           performing a disclosure. That exercise is repeated for d = 50
example, is an object (allocated on the heap for each in-                       disclosure attempts for each value of n, and to ensure there
coming connection) that gets passed along to the different                      are no lingering side effects, the server is restarted before
processing modules in Nginx as they prepare the appropriate                     proceeding to the next value of n.
response. The following macro depicts how Nginx retrieves                           Figure 4 (top) shows the average success rate of ﬁnding
a conﬁguration data pointer from the conﬁg data pointer                         an ngx http request t structure after prepping the
table for a given module. This line of code represents the                      server and subsequently performing a disclosure. Notice that
action that is depicted in Figure 2:                                            without prepping the server, we achieve an average success
   #define ngx http get module loc conf(r,                                      rate of 12.4%. That success rate peaks to just under 33.7% at
module)                                                                         n = 7 innocuous requests, before stabilizing. We believe the
(r)->loc conf[module.ctx index]                                                 ﬂuctuations after around n = 7 are due to intricacies of how
   As shown, the loc conf ﬁeld within an                                        Nginx handles connections. The attacker can increase her
ngx http request t structure holds a pointer to                                 success rate — though at the risk of raising suspicion server-
the conﬁg data pointer table, and thus the ability to disclose                  side — by instead prepping the server with requests targeted



                                                                          174



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
                                                                                   success rate for ﬁnding the ngx http request t object.
                                                                                   We veriﬁed that we attained and maintained a threshold of
                                                                                   heavy use on the server by monitoring the connection logs
                                                                                   with Splunk [40]. Even then, the observed success rate (not
                                                                                   shown) at n = 7 was 12% with no prepping, 16% when the
                                                                                   innocuous HTTP requests target an HTML ﬁle, and 32%
                                                                                   for the PHP target.

                                                                                   6.3. Writing Faux Data Structures

                                                                                   After leaking an ngx http request t object and de-
                                                                                   termining the location of the conﬁg data pointer table,
                                                                                   an attacker can use an arbitrary write vulnerability to re-
                                                                                   conﬁgure the server by overwriting an offset in this table and
                                                                                   redirecting the program to accessing a fake conﬁguration
                                                                                   data structure. Recall that the need for creating an entire fake
                                                                                   data structure (rather than simply overwriting elements in
                                                                                   an existing structure) revolves around the fact that our heap
                                                                                   disclosure and ability to ﬁnd the ngx http request t
                                                                                   object only allows for knowing the base location of the
                                                                                   conﬁg data pointer table. Since we do not assume the ability
                                                                                   to read arbitrary process memory in our attacks, we are
                                                                                   restricted to overwriting offsets in this table without being
                                                                                   able to read the pointers that exist at given offsets in this
                                                                                   table. Therefore, our only choice is to write an entire fake
                                                                                   copy of a given conﬁguration data structure to memory and
                                                                                   redirect a pointer in the table to this location.
                                                                                       Having obtained the data structure format that corre-
Figure 4: Disclosure success (a) for increased stealth, with                       sponds to some unsecure conﬁguration of a given module,
adversarial prepping following the distribution of request                         we need to ﬁgure out how to write this fake structure into a
types for varied content, and (b) when prepping targets only                       safe place that will not disrupt the execution of the server.
a PHP script. Performing 10 disclosures at a 25% individual                        Equally importantly, we do not want the server to corrupt
success rate gives an overall likelihood of greater than 94%.                      our fake data structures at any time in the future. Although
                                                                                   it may be possible to write these fake data structures to the
                                                                                   process stack or heap, in our approach we elect to write
at a speciﬁc server-side PHP script, for example, that ties                        our payload into an unused portion of the data section. This
up resources slightly longer than for simply returning a                           location is attractive because (i) knowing the base address of
static HTML page (i.e., ≈ 250ms versus 50ms). Figure 4                             the data section allows an adversary to have full knowledge
(bottom) shows that in this case, the success rate improves                        of the offsets (determined at compile time) of different
dramatically. In any event, our disclosure technique does                          variables and structures in it, and certain swaths of memory
not need to have a 100% success rate, since triggering the                         in the data section may never be used by the worker process
Heartbleed leak does not crash the server worker process and                       in the Nginx model; (ii) the size of the data section does not
thus can simply be exercised multiple times until the struc-                       dynamically change, unlike the process stack/heap; (iii) in
ture is successfully disclosed.4 Even placing a conservative                       general, any part of the stack/heap that is allocated by the
estimate of the individual disclosure success rate at 25%,                         worker process will be used/reclaimed at some point, which
performing 10 disclosures would raise the overall likelihood                       may present challenges for persistence of the written data
of success to above 94%.                                                           without introducing incorrect behavior to the server.
    Lastly, we explored what happens on a more heav-                                   For two key reasons, the attack techniques we demon-
ily loaded server scenario by issuing numerous requests                            strate hinge on the ability to overcome ASLR. First, we
from many different physical machines until a threshold                            need to know the absolute address of the .data section to
is reached where our Nginx server is operating at max                              determine where to write our faux data structures inside it.
capacity (servicing around 130 requests per second). While                         Second, we need to ﬁx up any pointers (e.g., references to
maintaining this max throughput threshold on the server, we                        function addresses) in the faux data structures we generate
triggered d disclosures at random periods and examined the                         to point to the correct offsets in the given module. Beyond
                                                                                   defeating ASLR, we must also identify offsets within the
   4. Even with a linear memory disclosure vulnerability that does cause a         .data section that can be effectively used as scratch space
crash, this does not present much of an issue as Nginx worker processes            to write our data structure payloads without worrying about
are restarted automatically after a crash.                                         touching data that is actually used by the application.



                                                                             175



  Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
    It turns out that the ﬁrst requirement has a sim-
ple solution. The ngx http request t object leaked
from the heap contains multiple function pointers to pre-
dictable offsets. Speciﬁcally, its read event handler,
write event handler, and log handler members
predictably point to three respective functions in the main
executable. Critically, ASLR moves around modules in such
a way that knowing the absolute address of the text section
of the main executable gives the absolute address of the data
section as well. In this way, our heap disclosure also allows
us to compute the base address of the data section in the
main executable.
    To identify offsets in the data section that fulﬁll our
second requirement, we propose a strategy for tracing mem-
ory accesses committed by the parent and worker processes
during server execution. A motivating realization for this
approach is that parts of the data section are likely only
used by the parent process in Nginx, and therefore after
the worker process is forked to handle connections, these
zones can be freely written by the worker and will never
be accessed by normal program execution in the worker.
Moreover, there are likely zones which are never accessed
by either the worker or the parent (e.g., static error pages in
memory for errors that will never be triggered), which also
implies the adversary can safely write to these regions.
    To trace memory accesses to the data section, we in-
strument the server to record accesses in both the parent
and worker processes from the time the parent process is
started to when both processes are terminated when the
server is shut down. Figure 5 shows accesses to the data
section by the parent and worker processes, respectively.
The heatmaps correspond to starting the server, handling
10,000 HTTP requests, then shutting down. Dark regions                          Figure 5: Heatmap showing (a) accesses in the parent pro-
represent no access, while white regions denote areas that                      cess, and (b) accesses in the worker process
are heavily accessed.
    The plots show that the parent process accesses the
data section more extensively than the worker, so a remote                      set the conﬁguration for Nginx to some insecure setting,
attacker exploiting the worker process has many options for                     analyze the conﬁguration data structure containing that in-
places within the data section to write their fake data struc-                  secure setting with our memory analysis tool, and obtain
tures. Moreover, the predictable code paths of the worker                       the binary format of that structure which can be written
process mean that the same offsets are accessed over and                        into process memory during an exploit. To successfully
over, so the adversary can be conﬁdent large swaths of                          use the framework, the adversary must provide the abso-
memory will not be touched by the worker. There are even                        lute virtual address offset where the binary data structure
places in the data section that are not touched at all by either                payload will be written in memory. Also, if any pointers
process (e.g., in pages 1, 4, 5, 14, 15). This is due to the fact               in the faux structure need to reference a given module (e.g.,
that some data compiled into the server (e.g., static strings                   function pointers in to the .text section of the executable),
representing canned error page responses for unusual errors)                    the adversary must provide the offset of this module. In
go un-accessed even for long running instances.                                 particular, for the attacks we demonstrate, some of the
                                                                                faux structures that our framework successfully generates
6.4. Creating Valid Faux Data Structures                                        (shown in Table 1) must contain function pointers into the
Next, we discuss how an adversary can construct fake data                       main Nginx executable. We provide this through disclosure
structures and write them into process memory in such a                         of the ngx http request t structure as discussed in
way that they will be semantically valid fake versions of                       Section 6.2, which contains function pointers that allow us
the corresponding conﬁguration data structures. To high-                        to compute the location of the main Nginx executable.
light the ease with which this can be done, we built our                        6.5. Findings
automated memory analysis framework with the capability
of outputting conﬁguration structures in a semantically valid                   The end-to-end exploits we performed that aptly demon-
binary format. This way, in an ofﬂine step, an adversary can                    strate the power of the attacks are listed below. These ex-



                                                                          176



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
ploits were performed against a running Nginx instance vul-                         are due to limitations of the current implementation of our
nerable to Heartbleed and a simulated remotely exploitable                          memory analysis framework (see §5.3).
arbitrary 8-byte write vulnerability.5                                                  Critically, we note that both a) disabling server logging
  1) Reconﬁgure the server to cease logging connections.                            and b) disabling all security headers can be done with a
  2) Re-enable logging on the server (useful for achieving                          single top level pointer overwrite in the conﬁg data pointer
      stealthiness after exploitation is complete).                                 table and do not require generating a fake structure at all.
  3) Reconﬁgure the server to use a higher error alert                              This is because each of these data structures contain a
      level, in essence causing the server to cease reporting                       variable in their top level that when assigned a speciﬁc value
      anything but the most extreme errors.                                         causes the server to completely forgo using the associated
  4) Reconﬁgure the server to use the document root path                            module to process a request. Thus, redirecting the associated
      / rather than the default path, allowing for leaks from                       entry in the conﬁg data pointer table to point to any memory
      the ﬁle system, including the server’s private RSA key.                       in the .data section which contains the given value (zero
  5) Restore normal conﬁguration after attacks 3 and 4.                             in case a, true (non-zero) in case b) at the given offset is
  6) Control what headers are appended to HTTP responses                            semantically just as effective as writing the whole faux data
      by the server (e.g., causing the server to omit secu-                         structure to memory — since in both of these cases the
      rity critical headers such as HSTS, X-XSS-Protection,                         certain value in a single variable is all that is necessary
      X-Frame-Options, Referrer Policy) to disastrous ef-                           for achieving the desired re-conﬁguration. We veriﬁed that
      fect [17, 35].                                                                this optimization works in practice. This saves the adversary
  7) Enable or disable access control on the server.                                a few bytes-worth of memory overwrites and simpliﬁes
  8) Change the maximum SSL protocol version that will                              the attack payload as much as possible for these powerful
      be supported by the server (e.g., limiting the server to                      attacks. Importantly for case a, this means that only a single
      use TLS 1.0 or SSLv3).6                                                       pointer overwrite to the given offset in the table is sufﬁcient
In the case of web-based malware distribution, the ability                          for completely disabling the access logs in Nginx. Thus an
to enable access control in Nginx turns out to be especially                        adversary could do this as a ﬁrst step and then proceed
powerful. Since the default Error 403 page served by Ng-                            to perform any number of connections required in order to
inx is stored at a pre-determined compile-time location in                          write faux data structures to memory for re-conﬁguring other
the data section, an adversary can overwrite elements of                            processing modules, all while evading detection by server
this simple HTML page with a custom page containing                                 monitoring mechanisms.
malicious web content (e.g., a JavaScript exploit within a                              The rightmost column of Table 1 shows the number of
hidden frame). Then, by re-conﬁguring access control on                             connections required to write the other faux data structures
the server to deny access to all clients (or particular IP                          to memory once logging has been disabled. Assuming an
addresses), the adversary can force the custom Error 403                            8 byte overwrite per HTTP request and 100 requests per
page to be distributed by the server en masse. This capability                      keepalive connection (default on Nginx), we can overwrite
would be a springboard for adversaries to gain widespread                           800 bytes per connection.8 This is an important consider-
distribution of web malware or perform targeted attacks                             ation in the context of network trafﬁc monitoring systems
against a web service. Notice that with logging temporarily                         which seek to detect anomalous connection behavior. We
disabled during the attack, server-side monitors that operate                       note that even in a less-ideal situation where the speciﬁc
off the error or access logs will not notice the attack, thereby                    vulnerability requires multiple requests to trigger the arbi-
making it extremely difﬁcult for network operators to detect                        trary write or only affords an overwrite of lesser size, the
or diagnose7 the malfeasance.                                                       approach could still be extended to evade detection as even
    Without a doubt, these attacks demonstrate the serious                          if we increase the number of connections required by an
threat of non-control-data oriented attacks against asyn-                           order of magnitude, the attack would likely go undetected
chronous web servers. Table 1 shows the sizes of the conﬁg-                         on a busy server (e.g., twitter handled 200–300 connections
uration data structures that were written into memory for the                       per second, on average, in 2009).9
various exploitation scenarios. For all cases but the SSL con-                      6.6. Empirical Analysis
ﬁguration data structure, our memory analysis tool was able
to automatically produce a fake conﬁguration data structure                         To assess the potential impact of attacks of the kind dis-
that is semantically acceptable in order to re-conﬁgure the                         closed herein, we performed an empirical evaluation using
server without introducing unexpected behavior. The difﬁ-                           data provided by a cloud-based service, called Censys [15].
culties posed by the particular SSL conﬁguration structure                          Censys maintains an up-to-date snapshot of the hosts and
                                                                                    services running across the public IPv4 address space.
   5. The realism of this threat model in real-world deployment scenarios           Starting in August 2015, Censys routinely scans the public
is discussed throughout this work, including in Sections 2, 3, 4 and 6.6.           address space across a range of ports and protocols, and
   6. TLS 1.0 is supported by all major browsers and even the insecure
SSLv3 was supported in recent browser versions, including Safari for OS               8. Per Hu et al. [22], CVE-2013-2028 can be used to accomplish this
X 10.10 and iOS 8 [44].                                                             arbitrary write, in addition to leveraging the Heartbleed bug for a linear
   7. For example, Cloudﬂare’s analysts relied almost exclusively on server         memory disclosure.
logs to understand what might have been leaked. See https://blog.cloudﬂare.           9. See http://highscalability.com/scaling-twitter-making-twitter-10000-
com/quantifying-the-impact-of-cloudbleed/.                                          percent-faster.




                                                                              177



  Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
                                       TABLE 1: Size of data structures for different conﬁgurations.
                                                                Initial State                                      New State      Automatic
                                                                                                                                                  No.
             Structure                 Initial State             Struct Size                  New State            Struct Size    Generation
                                                                                                                                                 Conns.
                                                                   (Bytes)                                           (Bytes)      Successful?
          Logs Conﬁg                Normal Logging                       802             No Logging                         401      Yes              1
          Logs Conﬁg                   No Logging                          401         Normal Logging                     794        Yes              1
           Core Conﬁg           Default Error Alert Level               1417      Elevated Error Alert Level             1417        Yes              2
           Core Conﬁg          Default Document Root Path               1417       Document Root Path: /                 1397        Yes              2
         Headers Conﬁg                 No Headers                          32       Use Security Headers2                 534        Yes              1
         Headers Conﬁg            Use Security Headers2                  534             No Headers                         32       Yes              1
           SSL Conﬁg               Use up to TLS 1.2                  12615+          Use up to TLS 1.0                12615+         No            16+
           SSL Conﬁg               Use up to TLS 1.0                  12615+          Use up to TLS 1.2                12615+         No            16+
        Access Ctrl Conﬁg          No Access Control                       16             Deny All                        112        Yes              1
        Access Ctrl Conﬁg               Deny All                         112          No Access Control                     16       Yes              1
    1                                                                                  2
        See Section 6.4 on how creating a faux structure is not necessary here.            HSTS, XSS-Protection, X-Frame-Options and Referrer Policy.



validates the resulting data via application-layer handshakes.
The framework also dissects the handshakes to produce
structured data about each host and protocol. We use data
from Censys to examine the number of hosts that were
vulnerable to Heartbleed (CVE 2014-0226) or were running
versions 1.39 or 1.40 of Nginx that were affected10 by CVE-
2013-2028. We examined data for the earliest day (i.e.,
7/8/2015) for which Censys provides scans for Heartbleed
and port 80 scans for the IPv4 address space.
    The results are quite troubling — even 16 months after
the initial disclosure on April 7, 2014 [14], 255,161 servers
were still vulnerable to Heartbleed, and 3599 servers were
running vulnerable versions of Nginx. This is quite disheart-
ening given that there were no less than ﬁve major releases
of Nginx after version 1.4 and before the snapshot date,
yet still several major websites were running a signiﬁcantly
                                                                                                          Figure 6: DNS resolutions
outdated version. While only 75 network objects (i.e., 2
domains in the Alexa’s top 1 million on 7/8/2015 and 73 IPs)
were potentially vulnerable on the day of the Censys scan                             potential affected client population would have been like on
to both of the CVEs relied upon in this paper, the results                            7/8/2015 because we are effectively sampling as the passive
would certainly have been far worse closer to ground zero.                            DNS data is from the vantage point of a single provider in
The fact that there are only limited automatic updates for                            the US, and several of those domains are popular in regions
web servers (unlike the browser market), coupled with the                             outside our purview.11
observation that many servers may go unattended for long
periods once deployed, may be contributing factors to why                             6.7. On the Assumption of Arbitrary Write Capabilities
these servers went unpatched for so long.                                             in Multi-Core Scenarios
    To understand how many clients may have been exposed                              Recall that on an 8-core system, for example, Nginx starts
to these potentially vulnerable servers, we used a large                              one main parent process which then spawns 8 different long-
passive DNS [43] datastore to analyze 6 days worth of DNS                             running worker processes. This might seem a problem for
lookups in May 2017. We only analyzed the subset of 3133                              an adversary when performing multiple arbitrary writes to
vulnerable servers that were in the Alexa Top 1 million                               worker process memory, as the writes may be spread across
on 7/8/2015. Figure 6 shows the observed DNS resolutions                              multiple processes, thereby disrupting the attack. Yet, the
attempted by clients to these network objects during the                              adversary can easily sidestep this potential issue by taking
monitored period. We observed 481,122,464 resolution at-                              advantage of the HTTP connection keepalive functionality.
tempts from 5,607,805 clients to servers that were subject to                         Speciﬁcally, a given keepalive connection will always reside
either vulnerability. The lookup volume to the 75 network                             in the same Nginx worker process for the lifetime of that
objects with both vulnerabilities was far less — only 19                              connection. Additionally, we found that all the security-
on average, but several of these servers are now defunct.                             critical conﬁguration data structures are instantiated on the
We note that our statistics are lower bounds on what the                              heap by the parent process as part of server start-up (i.e.,
                                                                                      before the fork() calls that spawn the worker processes),
  10. Note that from the Censys data it is impossible to tell where the sites
were running patched versions and so the numbers reported here could be                 11. Therefore, lookups for domain names that, e.g., may be popular in
an over-estimate.                                                                     Asia or Europe, will not be well represented in the estimates we provide.



                                                                                178



  Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
so all the worker processes inherit the same address space                                  .text section                                                                          Heap

                                                                                                                                                                   Config. data
containing the structures (e.g., the conﬁg data pointer table)                     ap_http_filter() {
                                                                                                                                    Server configuration struct
                                                                                                                                    server_rec on the heap         pointer table
                                                                                                                                                                                    Core config.

at the same addresses. Thus, even in a multicore setting, a                        }
                                                                                       ...                                                                          Offset 0

                                                                                                                                                                    Offset i
disclosure that leaks the address of a structure in one worker                                                                                                                       ...




is sufﬁcient for knowing the location in all processes.                            ssl_engine_init() {
                                                                                       ...
                                                                                                                                         module_config
                                                                                                                                                                    Offset j
                                                                                                                                                                                    Log config.


                                                                                   }
                                                                                                                     Reference
6.8. Applicability To Other Modern Web Servers                                                                       config. data
                                                                                                                                                                                     ...


                                                                                                                                                                                    Access control config.


As a step toward assessing the generalizability of our tech-
niques, we applied a similar analysis to another web server                                                                                                         Offset k
                                                                                                                                                                                     ...


                                                                                                                                                                                    Headers filter config.
that also supports processing simultaneous connections —
namely, Apache. Speciﬁcally, using our program tracing and                                                                                                                           ...




memory analysis frameworks (§5), we investigated whether
the key architectural weaknesses we brought to light earlier
                                                                                                                                                      Learned through memory analysis
are also central to the way Apache processes connections.                       Learned through program instrumentation
                                                                                       and source code analysis                                     supplemented by source code analysis

    We remind the reader that the classic processing model
employed by Apache provides isolation between clients                                            Figure 7: Connected structures in Apache.
and is less vulnerable to memory corruption attacks that
trigger bugs in one connection to affect the processing of a                    our suspicion that modifying the conﬁguration structure
different connection. However, Apache no longer runs in the                     on the heap will affect the processing of all subsequent
classic mode by default, preferring to employ thread-based                      connections for a given process. As a speciﬁc example,
connection processing, in which many different connections                      notice that the function ap http filter() accesses
share global data that is not speciﬁc to a given thread.                        the global server rec structure when deciding how to
Thus, to gain insight into the susceptibility of Apache, we                     respond to a GET request (e.g., core server config
analyzed its multithreaded “event” and multi-process “pre-
                                                                                *conf = (core server config *)
fork” worker models.                                                            ap get module config(f->r->server->
    Given that an end-to-end proof of concept against                           module config, &core module)).
Apache would be beyond the scope of this paper, we focused                         Digging deeper, analysis of the httpd source
our cursory analysis on answering two questions that we                         code revealed that two data structures (conn rec and
believe are key to understanding the susceptibility of Apache                   request rec representing HTTP connection and HTTP
servers, speciﬁcally: (i) does Apache store a single copy of                    request, respectively, contain pointers to the global
its global conﬁguration data in such a way that corruption                      server rec data structure. Given the observation that
of this data affects how all threads in the process service                     each HTTP connection will result in a conn rec struc-
their respective connections? (ii) are there readily accessible                 ture, and possibly multiple request rec structures are
data structures on the heap that point to such global data,                     allocated on the heap, we believe that leaking a pointer to
such that a linear heap disclosure could reliably identify the                  the global server conﬁguration should be as viable as in the
location of the conﬁguration data? In short, the answer to                      Nginx case. Successfully exploiting this at runtime is left as
both of these questions is yes.                                                 an exercise for future work. Conceptually, after locating the
    In the same fashion as was done for Nginx, we used
                                                                                server rec structure containing the server conﬁguration,
our program instrumentation workﬂow to identify global
                                                                                the attack would simply proceed as in the Nginx case, i.e.,
conﬁguration data structures in Apache that are referenced
                                                                                one needs to create faux data structures and ﬁnd a suitable
by each thread during the processing of client connections.
                                                                                place to write them in the process memory.
We supplemented our analysis with a review of the source
                                                                                    These ﬁndings suggest that the framework provided in
code and found that Apache stores the server conﬁguration
                                                                                this paper can be extremely helpful in diagnosing security
in a global data structure server rec on the heap. The
                                                                                weaknesses in modern servers. In summary, our analysis of
conﬁguration-related data is initialized during server startup
                                                                                two major asynchronous web servers lead to similar ﬁnd-
by the control process (routine init server config()
                                                                                ings: performance optimizations that drive the architectural
in server/config.c)), and resides in the memory of the
                                                                                design decisions in these applications signiﬁcantly amplify
child processes after forking.
                                                                                their susceptibility to data-oriented attacks.
    Among the basic conﬁguration ﬁelds, we found that the
server conﬁguration contains a module config vector
                                                                                7. Mitigations
that stores pointers to conﬁguration data structures of
all enabled modules. Apache relies on a set of macros                           Enforcing full memory safety to unsafe languages can essen-
operating on the vector module config to obtain the                             tially block all memory corruption exploits. Unfortunately,
conﬁguration of each registered module. This pattern                            this entails both spatial and temporal safety, which results
closely resembles the module conﬁguration code in Nginx.                        in a prohibitively high cost. Indicatively, when CETS [28]
Instrumentation of the web server process using our program                     is coupled with SoftBound [27] to achieve full memory
tracing and memory analysis framework indicated multiple                        safety, the resulting approach incurs an average overhead of
accesses to the server conﬁguration struct, conﬁrming                           116% for the SPEC benchmarks [28]. Even when focusing



                                                                          179



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
on spatial safety alone, runtime overheads are considerable.                    algorithms are ineffective in many scenarios and do not yet
By trading some extra memory for performance, baggy                             handle the complexities of real-world software [36].
bounds checking [3] is currently one of the most efﬁcient                           As a case in point, WIT [2] uses points-to analysis to
object-based bounds checking approaches, although its per-                      compute the set of objects that can be modiﬁed by each
formance overhead is still prohibitively high, at an average                    instruction in the program. Given that pointer analysis is
of 60% for the SPEC benchmarks.                                                 only an approximation algorithm and cannot provide strong
    Thankfully, although the impact of web server process                       security guarantees on its own, WIT supplements pointer
models on securing against memory corruption attacks has                        analysis with software guards between objects that pre-
been largely overlooked, there has been a renewed interest                      vent overﬂows from corrupting adjacent objects. Still, these
in techniques that seek to thwart data-oriented attacks in                      guards are not supported in the heap, which is left vulner-
general [6, 7, 8, 9, 13, 16, 32, 37, 38]. These defenses                        able. Importantly, Akritidis et al. [2] note that WIT should
attempt to ensure that the data ﬂow of a program follows                        be capable of preventing attacks that violate write integrity,
paths intended by the programmer. To see why that is                            but the number of attacks that violate this property depends
important, recall that a key aspect of the recent data-oriented                 on the precision of the points-to analysis. Similarly, the
attacks is the ability to launch an exploit by corrupting                       approach of Bhatkar and Sekar [6] hinges on the accuracy of
heap memory. For the most part, the defenses proposed to                        pointer analysis in order to provide any security assurance.
counter such attacks seek to enforce the integrity of data                      The idea of that work is to associate a mask with each
ﬂow in a program by assuring that memory references only                        memory object in a program, so that in order to reference
access data in the manner intended by the programmer.                           memory correctly, a code path must be instrumented to ﬁrst
For instance, several defenses have been proposed based                         unmask the memory before using it in an operation. In
on source-compatible solutions [2, 6, 8, 37] that require                       circumstances where pointer analysis is not effective, the
no assistance from the programmer. At a high level, these                       approach of Bhatkar and Sekar [6] must resort to sharing
approaches instrument data accesses (e.g., using compiler                       the same mask between many objects.
frameworks like Phoenix12 ) combined with pointer analysis                          In a related effort, Song et al. [37, 38] suggest ap-
techniques [19, 20] to determine whether a given data                           proaches for protecting security-critical data in operating
access should be allowed at runtime. Alternatively, other                       system kernels. Essentially, they propose an automated ap-
approaches [7, 10, 32] leverage programmer assistance to                        proach for locating security-critical data in memory as well
identify security critical data, after which a multitude of                     as a solution for isolating the data by means of a shadow
strategies for hardening the program against corruption or                      address space and context switching at runtime. Unfortu-
leakage of that data are deployed. We discuss each in turn.                     nately, as their approach builds upon techniques like WIT
                                                                                [2] to enforce data ﬂow integrity in the protected shadow
Data Flow Integrity Through Instrumentation                                     context, it suffers from signiﬁcant drawbacks when dealing
(without programmer assistance)                                                 with dynamic memory allocations.
Most contemporary defenses against data only attacks rely                       Protection of Speciﬁc Critical Objects
on pointer (points-to) analysis [36] to ensure the integrity                    (as speciﬁed by the programmer)
of data ﬂows in an application. For example, KENALI [37]
uses an automated approach for identifying security critical                    The second category of mitigations against data-oriented
data paths and sequestering them in their own address                           attacks includes approaches that steer clear of the prob-
space, which is then protected by a data ﬂow integrity                          lems imposed by complex pointer analysis approximation
solution [2]. The goal of pointer analysis is to compute an                     algorithms. That is, rather than enforcing ﬁne-grained data
approximation of the set of program objects that a pointer                      ﬂow integrity, defenses in this category separate sensitive
variable or expression can refer to. Although pointer analysis                  (as denoted by the programmer) and non-sensitive objects
is (in general) an undecidable problem, there are heuristics                    into two regions, and ensure that data does not ﬂow between
for approximating which pointers point to what objects                          regions or between objects in the sensitive region [7]. For
[19, 20, 36]. While these approximation algorithms are                          ease of annotation and data ﬂow tracking, data structures are
generally thought of as best effort compiler techniques for                     often labelled with the same sensitivity as their sub-objects,
eliminating dead code and identifying programmer errors,                        and implicit sensitivity is applied by the compiler to objects
their use for enforcing data ﬂow integrity was nonetheless                      that interact with sensitive objects.
popularized by Castro et al. [8] and Akritidis et al. [2]. The                       To determine the taint propagation of object sensitivity,
idea is that given the list of objects that each pointer in                     all the explicitly and implicitly sensitive variables are found
a program can access, it should be possible to instrument                       at compile time using inter-procedural and ﬁeld insensitive
programs to ensure at runtime that memory objects are                           data-ﬂow analysis. Given the hardness of such data-ﬂow
only accessed through pointers that are allowed to reference                    tracking, most proposed algorithms are forced to be conser-
the given memory. Although effective in certain scenarios                       vative in their approximations to avoid crashing the program
[2, 6, 8, 37], pointer analysis is not a holistic approach                      if two objects that interact at runtime were labeled with
for enforcing data ﬂow integrity, due to the fact that the                      different sensitivity levels at compile time. Consequently,
                                                                                the amount of data marked as sensitive in an application
  12. See https://en.wikipedia.org/wiki/Phoenix (compiler framework)            can easily blow up, even if the programmer only marks



                                                                          180



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
a single object as sensitive. Hence, such defenses simply                       9. Acknowledgments
reduce to memory safety policies like SoftBound [27] that                       We express our gratitude to our shepherd, Robert N. M.
performs bounds checking on memory accesses to objects,                         Watson, and the anonymous reviewers for their suggestions
and as such, are ineffective in honing in on the truly critical                 on how to improve the paper. We also thank Murray An-
security data of the application, or protecting just the subset                 deregg and Chaz Lever for their efforts in deploying the
of memory as originally speciﬁed by the programmer.                             infrastructure used in this study, and their assistance with the
                                                                                collection and analysis of DNS data. This work is supported
Container and Microservices Architectures                                       in part by the Department of Defense (DoD) under awards
                                                                                FA8750-16-C-0199 and FA8750-17-C-0016, as well as the
Recently, there has been tremendous interest in microser-
                                                                                Ofﬁce of Naval Research (ONR) under awards N00014-15-
vices (i.e., architectural patterns in which complex appli-
                                                                                1-2378 and N00014-17-1-2891. Any opinions, ﬁndings, and
cations are composed of small, independent processes that
                                                                                conclusions expressed herein are those of the authors and
communicate with each other in a secure manner). Indeed,
                                                                                do not necessarily reﬂect the views of the DoD or ONR.
there are now academic conferences with sessions focused
almost exclusively on best software engineering practices for                   References
microservices (e.g., The Software Architecture Conference).                     [1]   M. Abadi, M. Budiu, U. Erlingsson, and J. Ligatti. Control-Flow
    One direction could be to follow the lead taken by mod-                           Integrity. In ACM CCS, 2005.
ern browser designs for providing process isolation [12]. In-                   [2]   P. Akritidis, C. Cadar, C. Raiciu, M. Costa, and M. Castro. Pre-
deed, although the browser security community has learned                             venting Memory Error Exploits with WIT. In IEEE Security &
to heavily rely on code refactoring, sandboxing, and multi-                           Privacy, pages 263–277, 2008.
process architectures to protect its users from attacks, to date                [3]   P. Akritidis, M. Costa, M. Castro, and S. Hand. Baggy bounds
the process architectures for web servers seem to have only                           checking: An efﬁcient and backwards-compatible defense against
considered performance and robustness, but not security.                              out-of-bounds errors. In USENIX Security, pages 51–66, 2009.
That said, even for the browser community where security                        [4]   Apache. Core features and multi-processing modules, 2017. URL
has been a longtime concern, data-only attacks still pose                             https://httpd.apache.org/docs/2.4/mod/.
a daunting threat and have been recently used to disclose                       [5]   E. Bhatkar, D. C. Duvarney, and R. Sekar. Address obfuscation:
sensitive data from a victim domain that resides in the                               an efﬁcient approach to combat a broad range of memory error
                                                                                      exploits. In USENIX Security, pages 105–120, 2003.
same process as the attacker domain [23, 30]. Nevertheless,
although the right balance is difﬁcult to achieve in practice,                  [6]   S. Bhatkar and R. Sekar. Data space randomization. In Detection
                                                                                      of Intrusions, Malware and Vulnerability Assessment, 2008.
the landscape for defenses has not been well explored and is
an area ripe for research. We hope our ﬁndings will stimulate                   [7]   S. A. Carr and M. Payer. Datashield: Conﬁgurable data conﬁden-
                                                                                      tiality and integrity. In ACM Asia CCS, 2017.
further research in that direction.
                                                                                [8]   M. Castro, M. Costa, and T. Harris. Securing software by enforc-
                                                                                      ing data-ﬂow integrity. In USENIX OSDI, 2006.
8. Conclusion                                                                   [9]   Q. Chen, A. M. Azab, G. Ganesh, and P. Ning. Privwatcher: Non-
                                                                                      bypassable monitoring and protection of process credentials from
Taken as a whole, our instruction tracing method and live                             memory corruption attacks. In ACM Asia CCS, 2017.
memory analysis framework demonstrate the ease with                             [10] Q. Chen, A. M. Azab, G. Ganesh, and P. Ning. Privwatcher: Non-
which an adversary can perform powerful attacks against                              bypassable monitoring and protection of process credentials from
asynchronous web servers that service many clients in the                            memory corruption attacks. In ACM CCS, pages 167–178, 2017.
same process. We demonstrate how the control-ﬂow hi-                            [11] S. Chen, J. Xu, E. C. Sezer, P. Gauriar, and R. K. Iyer. Non-
jacking and privilege escalation steps in the web server                             control-data attacks are realistic threats. In USENIX Security,
exploit chain can be circumvented to signiﬁcantly increase                           2005.
the realism of using memory corruption attacks to subvert                       [12] Chrome Team. Site isolation summit:. Overview Videos, 2015.
these critical systems. Moreover, as the rest of the server                     [13] I. Diez-Franco and I. Santos. Data is ﬂowing in the wind: A
industry has been trying to keep up with the impressive                              review of data-ﬂow integrity methods to overcome non-control-
scalability provided by Nginx through its asynchronous                               data attacks. In Complex, Intelligent, and Software Intensive
architecture, Apache and other competing server solutions                            Systems, 2016.
are refactoring themselves to be more aligned with the                          [14] Z. Durumeric, J. Kasten, D. Adrian, J. A. Halderman, M. Bailey,
model of handling many different client requests within the                          F. Li, N. Weaver, J. Amann, J. Beekman, M. Payer, and V. Paxson.
                                                                                     The matter of heartbleed. In ACM IMC, pages 475–488, 2014.
same server process. This drive in server architectures to-
wards scalability and away from memory isolation between                        [15] Z. Durumeric, D. Adrian, A. Mirian, M. Bailey, and J. A. Halder-
                                                                                     man. A search engine backed by Internet-wide scanning. In ACM
requests opens the door for the feasibility of non-control                           CCS, 2015.
data attacks against web servers that were previously not
                                                                                [16] U. Erlingsson, M. Abadi, M. Vrable, M. Budiu, and G. C. Necula.
vulnerable to such attacks in their classic architecture. As the                     XFI: Software guards for system address spaces. In USENIX
increasing majority of the World Wide Web’s most trafﬁcked                           OSDI, pages 75–88, 2006.
server side applications share critical data between many                       [17] S. Fogie, J. Grossman, R. Hansen, A. Rager, and P. Petkov. XSS
mutually distrusting clients, we expect this issue to only                           Attacks: Cross Site Scripting Exploits and Defense. Syngress
become more prominent going forward.                                                 Publishing, 2007.



                                                                          181



 Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
[18] J. Graham-Cumming.          Incident report on memory leak                        Symposium on Security and Privacy, 2017.
     caused by cloudﬂare parser bug, Feb 2017.                URL                [31] R. Rudd, R. Skowyra, D. Bigelow, V. Dedhia, T. Hobson,
     https://blog.cloudﬂare.com/incident-report-on-memory-leak-                       S. Crane, C. Liebchen, P. Larsen, L. Davi, M. Franz, A.-R.
     caused-by-cloudﬂare-parser-bug/.                                                 Sadeghi, and H. Okhravi. Address oblivious code reuse: On the
[19] M. Hind. Pointer analysis: Haven’t we solved this problem yet?                   effectiveness of leakage resilient diversity. In ISOC NDSS, 2017.
     In ACM Workshop on Program Analysis for Software Tools and                  [32] C. Schlesinger, K. Pattabiraman, N. Swamy, D. Walker, and
     Engineering, pages 54–61, 2001.                                                  B. Zorn. Modular protections against non-control data attacks.
[20] M. Hind and A. Pioli. Which Pointer Analysis Should I Use?                       In IEEE Computer Security Foundations Symposium, 2011.
     SIGSOFT Softw. Eng. Notes, 25(5):113–123, Aug. 2000.                        [33] F. J. Serna. The info leak era on software exploitation. In Black
[21] H. Hu, Z. L. Chua, S. Adrian, P. Saxena, and Z. Liang. Automatic                 Hat USA, 2012.
     generation of data-oriented exploits. In USENIX Security, pages             [34] H. Shacham. The geometry of innocent ﬂesh on the bone: Return-
     177–192, 2015.                                                                   into-libc without function calls (on the x86). In ACM CCS, pages
[22] H. Hu, S. Shinde, S. Adrian, Z. L. Chua, P. Saxena, and                          552–561, 2007.
     Z. Liang. Data-oriented programming: On the expressiveness of               [35] S. Sivakorn, I. Polakis, and A. D. Keromytis. The cracked cookie
     non-control data attacks. In IEEE Security & Privacy, 2016.                      jar: HTTP cookie hijacking and the exposure of private informa-
[23] Y. Jia, Z. L. Chua, H. Hu, S. Chen, P. Saxena, and Z. Liang.                     tion. In IEEE Security & Privacy, pages 724–742, 2016.
     The “web/local” boundary is fuzzy: A security study of chrome’s             [36] Y. Smaragdakis and G. Balatsouras. Pointer analysis. Found.
     process-based sandboxing. In ACM CCS, pages 791–804, 2016.                       Trends Program. Lang., 2(1):1–69, Apr. 2015.
[24] D. Kegel. The c10k problem, 2014. URL http://www.kegel.com/                 [37] C. Song, B. Lee, K. Lu, W. Harris, T. Kim, and W. Lee. Enforcing
     c10k.html.                                                                       kernel security invariants with data ﬂow integrity. In ISOC NDSS,
[25] C.-K. Luk, R. Cohn, R. Muth, H. Patil, A. Klauser, G. Lowney,                    2016.
     S. Wallace, V. J. Reddi, and K. Hazelwood. Pin: Building cus-                    Y. Paek. HDFI: Hardware-assisted data-ﬂow isolation. In IEEE
     tomized program analysis tools with dynamic instrumentation. In                  Security & Privacy, 2016.
     ACM PLDI, pages 190–200, 2005.                                              [39] R. Soni. Nginx: from beginner to pro. Apress, 2016.
[26] MITRE. CWE-123: Write-What-Where Condition. Available                       [40] Splunk. Operational intelligence, log management, application
     from MITRE, CWE-123: Write-what-where Condition, 2017.                           management, enterprise security and compliance. Splunk, 2005.
     URL https://cwe.mitre.org/data/deﬁnitions/123.html.                              URL https://www.splunk.com/.
[27] S. Nagarakatte, J. Zhao, M. M. Martin, and S. Zdancewic. Soft-              [41] W3techs. Comparison of the usage of apache vs. nginx vs.
     bound: Highly compatible and complete spatial memory safety                      microsoft-iis for websites. Apache vs. Nginx vs. Microsoft-IIS
     for C. In ACM PLDI, pages 245–258, 2009.                                         usage statistics, 2009. URL https://w3techs.com/technologies/
[28] S. Nagarakatte, J. Zhao, M. M. Martin, and S. Zdancewic. CETS:                   comparison/ws-apache,ws-microsoftiis,ws-nginx.
     Compiler enforced temporal safety for C. In Symposium on                    [42] W3techs. Historical yearly trends in the usage of web servers for
     Memory Management, pages 31–40, 2010.                                            websites. Historical yearly trends in the usage of web servers,
[29] V. Pappas, M. Polychronakis, and A. D. Keromytis. Transparent                    April 2017, 2010.      URL https://w3techs.com/technologies/
     ROP exploit mitigation using indirect branch tracing. In USENIX                  history overview/web server/ms/y.
     Security, pages 447–462, 2013.                                              [43] F. Weimer. Passive DNS Replication. In Conference on Computer
[30] R. Rogowski, M. Morton, F. Li, K. Z. Snow, M. Polychronakis,                     Security Incident Handling, June 2005.
     and F. Monrose. Revisiting browser security in the modern                   [44] Wikipedia. Transport layer security, 2017.         URL https://en.
     era: New data-only attacks and defenses. In IEEE Euroupean                       wikipedia.org/wiki/Transport Layer Security.
[38] C. Song, H. Moon, M. Alam, I. Yun, B. Lee, T. Kim, W. Lee, and




                                                                           182



  Authorized licensed use limited to: Georgia Institute of Technology. Downloaded on August 12,2022 at 16:32:50 UTC from IEEE Xplore. Restrictions apply.
