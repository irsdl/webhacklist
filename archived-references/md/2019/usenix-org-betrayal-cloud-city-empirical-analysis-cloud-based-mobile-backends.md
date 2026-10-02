---
type: Article
title: "The Betrayal At Cloud City: An Empirical Analysis Of Cloud-Based Mobile Backends"
resource: "https://www.usenix.org/conference/usenixsecurity19/presentation/alrawi"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:26:20+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity19/presentation/alrawi"
    title: "The Betrayal At Cloud City: An Empirical Analysis Of Cloud-Based Mobile Backends"
    author: Omar Alrawi, Chaoshun Zuo, Ruian Duan, Ranjita Pai Kasturi, Zhiqiang Lin, Brendan Saltaformaggio
also_at:
  - "https://www.usenix.org/system/files/sec19-alrawi_0.pdf"
  - "https://www.usenix.org/sites/default/files/conference/protected-files/sec19_slides_alrawi.pdf"
authors:
  - Omar Alrawi
  - Chaoshun Zuo
  - Ruian Duan
  - Ranjita Pai Kasturi
  - Zhiqiang Lin
  - Brendan Saltaformaggio
canonical_url: ""
cited_by:
  - "2019.md:79"
commit: ""
content_sha256: fd7ef2ecd0c88e56f4be5c503892d74351a386ee4b5c9096c352063c86741e75
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity19/presentation/alrawi"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: f5962df8e5dd51f9dbda277e23939e8f98fa29626eafd43fe1654df7749970bb
retrieved_from: "https://www.usenix.org/system/files/sec19-alrawi_0.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:26:20+00:00"
slug: usenix-org-betrayal-cloud-city-empirical-analysis-cloud-based-mobile-backends
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# The Betrayal At Cloud City: An Empirical Analysis Of Cloud-Based Mobile Backends

**The Betrayal At Cloud City: An Empirical Analysis Of Cloud-Based Mobile Backends** - Omar Alrawi, Chaoshun Zuo, Ruian Duan, Ranjita Pai Kasturi, Zhiqiang Lin, Brendan Saltaformaggio, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity19/presentation/alrawi>
- Also published at: <https://www.usenix.org/system/files/sec19-alrawi_0.pdf>
- Also published at: <https://www.usenix.org/sites/default/files/conference/protected-files/sec19_slides_alrawi.pdf>
- Preserved from: https://www.usenix.org/system/files/sec19-alrawi_0.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# The Betrayal At Cloud City: An Empirical Analysis Of Cloud-Based Mobile Backends

--- page 1 ---

The Betrayal At Cloud City:
An Empirical Analysis Of Cloud-Based Mobile Backends
Omar Alrawi
*
Georgia Institute of Technology
Chaoshun Zuo
*
The Ohio State University
Ruian Duan
Georgia Institute of Technology
Ranjita Pai Kasturi
Georgia Institute of Technology
Zhiqiang Lin
The Ohio State University
Brendan Saltaformaggio
Georgia Institute of Technology
Abstract
Cloud backends provide essential features to the mobile
app ecosystem, such as content delivery, ad networks, ana-
lytics, and more. Unfortunately, app developers often disre-
gard or have no control over prudent security practices when
choosing or managing these services. Our preliminary study
of the top 5,000 Google Play Store free apps identied 983
instances of N-day and 655 instances of 0-day vulnerabilities
spanning across the software layers (OS, software services,
communication, and web apps) of cloud backends. The mo-
bile apps using these cloud backends represent between 1M
and 500M installs each and can potentially affect hundreds
of thousands of users. Further, due to the widespread use of
third-party SDKs, app developers are often unaware of the
backends affecting their apps and where to report vulnera-
bilities. This paper presents SkyWalker, a pipeline to auto-
matically vet the backends that mobile apps contact and pro-
vide actionable remediation. For an input APK, SkyWalker
extracts an enumeration of backend URLs, uses remote vet-
ting techniques to identify software vulnerabilities and re-
sponsible parties, and reports mitigation strategies to the app
developer. Our ndings suggest that developers and cloud
providers do not have a clear understanding of responsibil-
ities and liabilities in regards to mobile app backends that
leave many vulnerabilities exposed.
1 Introduction
Cloud-based mobile backends provide a wide array of
features, such as ad networks, analytics, content delivery,
and much more. These features are supported by multiple
layers of software and multiple parties including content
delivery networks (CDNs), hosting providers, and cloud
providers who offer virtual/physical hardware, provisioned
operating systems, and managed platforms. Due to the in-
herent complexity of cloud-based backends, deploying and
maintaining them securely is challenging. Consequently,*Authors contributed equally.
mobile app developers often disregard prudent security
practices when choosing cloud infrastructure, building, or
renting these backends.
Recent backend breaches of the British Airways [1] app
and Air Canada [2] app demonstrate how wide-spread these
incidents are. More recently, the hijacking of the Fortnite
mobile game [3] showed how incrementally-downloaded
content from mobile backends can allow an attacker to in-
stall additional mobile apps without the user's consent. Ad-
ditional cases [4] involving the exposure of 43TB of enter-
prise customer names, email addresses, phone numbers, PIN
reset tokens, device information, and password lengths was
due to
insecure mobile backends
and not the developer's mo-
bile app code.
Even for security-conscious developers, it is not clear
what backends their mobile app will interact with because
of third-party libraries. Third-party libraries do not expose
their backends to developers, instead, they offer an applica-
tion program interface (API) that developers use. Many of
these vulnerabilities can be identied ahead of time if de-
velopers have the right tools and resources to evaluate the
security of their backends. Further, identifying vulnerable
software layers and the responsible party can expedite reme-
diation and therefore lower the risk of exposure.
To deal with the complexities in cloud infrastructure, the
research community surveyed [5] and proposed several tax-
onomies [6], ontologies [7], assessment models [8], and
threat classications [9]. Unfortunately, these approaches
provide few practical recommendations for mobile app de-
velopers. Recent works on server-side vulnerability discov-
ery of mobile apps [10]–[12] have shown that a lack of secu-
rity awareness among app developers is a growing problem.
Yet, these works only scratch the surface by examining only
the software service layer of mobile backends.
A systematic study is needed to identify the most pressing
issues facing mobile backends. Moreover, to conduct such
a study, the analysis must be reproducible, transparent, and
easy to interpret for developers. The study should be done
on a representative mobile app ecosystem to provide real in-

--- page 2 ---

USENIX Association
28th USENIX Security Symposium 551

--- page 3 ---

sight into the backend vulnerability landscape. Finally, the
study should offer practical steps to guide and inform app
developers on the security of their mobile backends.
To this end, this paper presents the design and implemen-
tation of SkyWalker, an analysis pipeline to study mobile
backends. Using SkyWalker, we conducted an empirical
analysis of the top 5,000 free mobile apps in the Google Play
store from August 2018. Based on this study, we uncovered
655 0-day instances and 983 N-day instances affecting
thousands of apps. We used Google Play Store metadata to
measure the impact of our ndings and estimate the number
of affected users. We propose mitigation strategies for dif-
ferent types of vulnerabilities and guidelines for developers
to follow. Lastly, we offer the SkyWalker analysis pipeline
as a free public web-service to help developers identify
what backends their mobile apps interact with, the security
state of the backends, and recommendations to address any
detected issues.
Our empirical study found 983 N-day instances of 52
vulnerabilities affecting hypervisors, operating systems,
databases, mail servers, DNS servers, web servers, scripting
language interpreters, and others. We found 655 0-day in-
stances of SQL injection (SQLi), cross-site-scripting (XSS),
and external XML entity (XXE). These affected thousands
of mobile apps, with some apps having over 50M+ installs
and more than 332,000 reviews. We present two case studies
to demonstrate the vulnerabilities affecting a specic devel-
oper and vulnerabilities affecting a platform that is used by
many developers.
We found these backends to be geographically distributed
across the globe and hosted on 6,869 different networks.
We notied all affected parties about the ndings, and
were careful to follow ethical and legal guidelines when
conducting this study, additional details are in Section 8. We
propose mitigation strategies for developers to follow based
on the issues found and the types of backends. We conclude
with recommendations for deploying and maintaining secure
backends.
2 A Motivating Example
Mobile apps use cloud-based backend services to support ex-
tensive functions like ads, telemetry, content delivery, and
analytics. Unfortunately, a mobile app developer who wants
to audit the backends their app uses will quickly nd that this
is harder than it seems. The rst thing the developer must
do is simply enumerate those mobile backends. Consider
the
Crime City Real Police Driver
(
com.vg.crazypoliceduty
)
app, a mobile game with over 10M+ installs and 126,257
reviews. The mobile app uses several third-party SDK li-
braries including Amazon In-App Billing, SupersonicAds,
Google AdMob, Unity3D, Nuance Speech Recognition Kit,
and Xamarin Mono. The developer may not be aware of
many of the backends that are invoked from imported native
or Java libraries, i.e., the Unity3D backends. In most cases,
the developer will rst have to employ static binary analy-
sis tools or dynamically instrument the app to track multiple
levels of SDK inclusion. SkyWalker automatically identied
13 unique backends from this app's APK (shown in Table 1)
and mapped them to the modules they were found in, i.e.,
library backends versus developer backends.
Party Vendor Backend PurposeHybridVasco
Gamesandroidha.vascogames.com
Game
ContentThirdUnity3Dapi.uca.cloud.unity3d.com Telemetrycdn-highwinds.unityads.unity3d.com Adscong.uca.cloud.unity3d.com Telemetryimpact.applier.com TelemetrySizmekbs.serving-sys.com Adssecure-ds.serving-sys.com AdsMoatpx.moatads.com Analyticsz.moatads.com AdsGooglegoogleads.g.doubleclick.net Adspagead2.googlesyndication.com Adstpc.googlesyndication.com Adswww.google-analytics.com AnalyticsTable 1: Backends identied for
Crime City Real Police
Drive
and their purpose. The red cells indicate vulnerable
backends.
Backends have layers of software (components) that sup-
port the web application software (
AS
), including an oper-
ating system (
OS
), software services (
SS
), and communi-
cation services (
CS
). The developer now has to ngerprint
the backends to inventory the software layers and identify
the software type, version, and its purpose. Using this in-
formation, the developer can then check to see if any of
their software is outdated or affected by a known vulnera-
bility [13], a laborious and time-consuming task. SkyWalker
identied that the game content backend runs
Debian 6
for
the
OS
;
OpenSSH 6.5p1
,
Apache httpd 2.2.22
,
PHP/5.4.4-
14
, and
Apache-Coyote/1.1
for the
SS
; and uses the
HTTP
protocol for
CS
. SkyWalker's search of the national vulner-
ability database (NVD) [13] and correlation with the nger-
print results showed multiple common vulnerability expo-
sure (CVE) entries affecting PHP 5.4.4-14. Further, the De-
bian version running on the backend is no longer supported
and does not receive any updates from the vendor.
In addition to these issues, the developer's
AS
can contain
bugs that must be audited. The developer can check the
AS
by auditing the parameters passed to each API and testing
for SQLi, XSS, XXE, or any other applicable vulnerabilities
from OWASP's top 10 common issues [14]. This task re-
quires secure programming experience and security domain
expertise to identify bugs in the source code. SkyWalker
found that the game content backend interface is vulnera-
ble to SQLi for some parameters passed by the mobile app,
which is due to the
AS
not properly sanitizing the input.
The developer must now remediate or mitigate these risks,
but each backend layer may be operated by different entities
that provide hardware and software as a service. Therefore,

--- page 4 ---

552 28th USENIX Security Symposium
USENIX Association

--- page 5 ---

before xing any issues, they must gure out what party is re-
sponsible for each component. SkyWalker ngerprinted the
Crime City Real Police Driver
game content backend,
an-
droidha.vascogames.com
, as being hosted on a Google Com-
pute Engine Flexible Environment instance (which provides
virtual hardware, operating system, and PHP). We refer to
this type of backend model as
hybrid
since Google is par-
tially responsible for the virtual environment and the devel-
oper is responsible for the
AS
and
CS
.
The developer must come up with a remediation strategy
to address these problems. Google advertises that they patch
any vulnerable software affecting the
OS
and
SS
, but this is
only applicable to non-deprecated versions. In the case of
Crime City Real Police Driver
app, the developer is respon-
sible for all the software layers since the
OS
and
SS
versions
are deprecated. The developer must upgrade to a supported
OS
, apply patches to the PHP interpreter (
SS
), patch the
AS
source code against SQLi, and support
HTTPS
for secure
CS
.
The Unity3D, Sizmek, and Moat backends shown in Ta-
ble 1 are called
third-party
, since the developer has no con-
trol over them. This evaluation must also be carried out
on third-party backends to identify additional vulnerabilities
(potentially affecting all apps which use those shared ser-
vices). SkyWalker found that the
Crime City Real Police
Driver
app uses the
cong.uca.cloud.unity3d.com
backend,
which contains an XXE vulnerability, and the
bs.serving-
sys.com
backend that contains an XSS vulnerability. Ideally,
the developer could report those vulnerabilities to the plat-
form through a bug bounty program or migrate their app to
backends that are not vulnerable.
This manual assessment procedure is very involved and
requires extensive security domain knowledge, which many
app developers may not have. Instead, SkyWalker gives all
mobile app developers the ability to identify the backends
invoked by their app, assess their software layers, and sug-
gest remediation strategies to improve the security for their
mobile app backends.
3 Background
This section denes an abstraction to model mobile backends
for our empirical study. We also dene our labeling for back-
ends and create a mapping between responsible stakeholders
and resources. We outline how we count vulnerabilities and
dene them in the context of this work.
3.1 Mobile App Backend Model
We follow the standard denition for mobile backends used
by industry leaders [15]–[18], which encompass many cloud
features, such as storage, user management, notications,
and APIs for various services, regardless of who maintain-
s/owns them. We breakdown mobile backends into a stack
representation that consists of ve layers:

Hardware (
HW
)
refers to the physical or virtual hard-
ware that hosts the backend.

Operating System (
OS
)
refers to the OS running on the
hardware, i.e., Linux or Windows.

Software Services (
SS
)
refers to software services run-
ning in the OS, i.e., database service, web service, etc.

Application Software (
AS
)
refers to the custom appli-
cation interface used by mobile apps to interact with the
running services.

Communication Services (
CS
)
refers to the communi-
cation channel supported between the mobile app and
the mobile backend.
Our approach does not consider the hardware layer
because 1) we would need root-level access on the backend
to evaluate the hardware and 2) mobile app developers have
no direct way of addressing hardware vulnerabilities, i.e.,
manufacturers must issue rmware updates or replace the
hardware. It is important to note that this work does not
consider the mobile app security, instead we leverage the
mobile app to study the backend.
We differentiate between mobile backends by ownership,
which provides a granular mapping between stakeholders
and resources. We dene four labels for the mobile back-
ends with respect to the app developer:

First-Party (
B
1
st
)
refers to backends that are fully man-
aged by the mobile app developers (i.e., full control
over the backend).

Third-Party (
B
3
rd
)
refers to backends that are fully
managed by third-parties (i.e., no control over the
backend).

Hybrid (
B
hyb
)
refers to backends that are co-managed
by third-parties and developers such as cloud infras-
tructure (i.e., some control over the mobile backend).

Unknown (
B
ukn
)
refers to backends that ownership
could not be established with high condence.
In our model, there are two primary stakeholders, the app
developers (
D
) and the cloud service providers (
SP
). There
are additional stakeholders, like app users and internet ser-
vice providers (ISP), but they do not have direct remediation
oversight. We dene a mapping between backends layers,
labels, and ownership, shown in Table 2.
The nal piece of the model is the mitigation compo-
nent that maps vulnerable backends to the proper mitigation
strategies. There are ve mitigation strategies for developers:

Upgrade (
u
)
the software to vendor supported versions.

Patch (
p
)
vulnerable software with a vendor patch.

--- page 6 ---

USENIX Association
28th USENIX Security Symposium 553

--- page 7 ---

LabelHW OS SS AS CSFirst-Party (
B
1
st
)# # # # #
Third-Party (
B
3
rd
) 
Hybrid (
B
hyb
) H# H# # #
Table 2: Backend labels (rst-party -
B
1
st
, third-party
B
3
rd
, and hybrid -
B
hyb
) and cloud layers (hardware -
HW
,
operating system -
OS
, software services -
SS
, application
software -
AS
, and communication services -
CS
) mapping
to stakeholders (developers -
#
, service providers -
 
, and
shared -
H#
)

Block (
b
)
incoming internet trafc to exposed services.

Report (
r
)
the vulnerability to the responsible party.

Migrate (
m
)
the backend to secure infrastructure.
In many cases, the developer may not have control or
authority to x the issues but still has the option to report it
(
r
) or change service provider (
m
).
3.2 Counting Vulnerabilities
This work considers vulnerabilities which are software bugs
that exist in the backend software stack, including the oper-
ating system (
OS
), services (
SS
), application (
AS
), and com-
munication (
CS
). We consider
N-Day
vulnerabilities to be
those vulnerabilities which have an associated common vul-
nerabilities and exposure (CVE) number assigned by the na-
tional institute of standards and technology (NIST) and in-
dexed in the national vulnerability database (NVD) [13]. In
our ndings, we count
N-Day
vulnerabilities by class and
instance, where class refers to the CVE number of a partic-
ular vulnerability and an instance refers to the vulnerabil-
ity affecting a specic interface or software component on
a mobile backend. For example, Apache Struts vulnerabil-
ity
CVE-2017-5638
that affects Apache Struts 2
:
3
:
x
before
2
:
3
:
32 and 2
:
5
:
x
before 2
:
5
:
10
:
1 is counted as a single vul-
nerability (class), but it can affect multiple backends that run
different versions of Apache Struts (instances).
Some software versions are affected by multiple CVEs, in
this case, we
do not
count every CVE as an instance. We
generally assume patching the latest CVE should address all
previous unpatched CVEs. We only consider the latest CVE
affecting the vulnerable software and count it once. Further,
a vulnerability instance is a tuple of the backend's domain
name, IP address, and the vulnerable software version. As
for
0-Day
vulnerabilities, they are associated with the soft-
ware application (
AS
) running on the backend. This work
looks at three classes of
0-Day
vulnerabilities, SQLi, XSS,
and XXE and counts each instance per API interface end-
point on the mobile backend. The dened model, labels,
mitigations, mappings, and vulnerabilities are the basis for
our methodology, which we describe next.
4 Methodology
In this section, we provide an overview of our assessment
and details about implementing SkyWalker. Figure 1 is an
overview of SkyWalker's internal components. We divide
the implementation into four phases, namely binary analy-
sis, labeling, ngerprinting, and vulnerability analysis. Each
phase provides input to the next phase, starting from an input
app APK to the nal vulnerability/mitigation report.
4.1 Binary Analysis
SkyWalker leverages our prior work, Smartgen [19], to per-
form the binary analysis and extract query messages from
an APK binary. SkyWalker dynamically executes the code
paths to the network functions and extracts the native usage
of the backend APIs. The native usage of an API includes
the URI path and their parameter types/values.
4.2 Backend Labels
Backend labeling assigns one of the four labels dened in our
model. The labels are used to map the responsible parties
and the mitigation strategies needed (excluding unknown),
shown in Table 2. Moreover, the labels are used to iden-
tify where the most common issues are found. To perform
the labeling, we curate three unique lists using the ipcat [20]
datacenter dataset. The rst list is called
CP
and contains
cloud providers, content delivery networks (CDNs), and mo-
bile platform cloud services. The second list,
Colo
, contains
a list of collocation centers. The third list is a list of
SDK
libraries that we extracted using LibScout [21] (Table 3),
which help SkyWalker identify third-party backends. OS-
SPolice [22] provides a more comprehensive list, including
native libraries used by the mobile app, but our binary analy-
sis technique only instruments Java code, therefore, we limit
the third-party SDK identication to LibScout.
To perform the labeling we generate a tuple for each
extracted backend
B
that contains the effective-second level
domain
d
, IP address
ip
, a boolean ag
lib
indicating if
the backend belongs to an SDK library, and the developer
or vendor name
v
. We dene a function
owner
()
that
parses WHOIS, MaxMind [23], and ASN records to extract
ownership information. The
owner
()
function uses text
tokenization, normalization, and aliasing to consolidate
varying records.
SkyWalker uses Algorithm 1 to assign labels to each back-
end. Algorithm 1 takes as input a list of backends,
b
, con-
taining tuples
B
=
f
d
;
ip
;
lib
;
v
g
and returns a list of labeled
backends
b
0
. The algorithm uses the
CP
and
Colo
list to
check membership for the domains and IPs to determine the
appropriate label. The rst check is to determine the origin
of the backend (was it extracted from an SDK library?) then

--- page 8 ---

554 28th USENIX Security Symposium
USENIX Association

--- page 9 ---

Figure 1: SkyWalker Overview. Phase 1 (Binary Analysis) extracts backend URLs through a dynamic binary instrumentation
technique. Phase 2 labels backends into rst-party, third-party, and hybrid. Phase 3 discovers and ngerprints the backend
services to collect cloud layer information. Phase 4 (vulnerability analysis) uses the ngerprints and correlates them with
public vulnerabilities to identify vulnerable backends.Algorithm 1:
Assigning Labels to BackendsInput:
b
= List of backend tuple
B
=
f
d
;
ip
;
lib
;
v
g
Output:
b
0
= Ownership labeled backend list
SDK
: List of backend domains found in the SDK libraries;
CP
: List of cloud and hosting providers (domains, net prex, and ASNs);
Colo
: List of collocation providers (domains, net prex, and ASNs);
for
8
B
2
b
doif
B
:
lib
_
B
:
d
2
SDK
then// Backend from Java lib
B
:
label
 
“third-party”;
continue
end
if
owner
(
B
:
d
)
6
=
v
^
owner
(
B
:
d
)
=
2
CP
then// Backend domain not owned by developer or CP
B
:
label
 
“third-party”;
continue
end
if
B
:
ip
2
CP
then// Backend IP hosted by cloud provider
B
:
label
 
“hybrid”;
continue
end
if
B
:
ip
2
Colo
then// Backend IP hosted by collocation center
B
:
label
 
“rst-party”;
continue
end
B
:
label
 
“unknown”;
endassigns “third-party” label if
lib
`s value is true or the back-
end domain belongs to the list of SDK backends.
If none of the previous statements are true about the do-
main, then SkyWalker checks the
IP
membership against the
CP
and
Colo
list. If the IP address belongs to a network
on the
CP
list SkyWalker assigns “hybrid” label. If the IP
address belongs to a network on the
Colo
list SkyWalker as-
signs “rst-party” label. Otherwise, SkyWalker assigns an
“unknown” label since it cannot be determined. It is im-
portant to note that SkyWalker's labeling approach relies on
LibScout [21] to identify third-party backends based on the
SDK libraries. SkyWalker performs an additional check be-
fore setting the
lib
ag to exclude
SDK
libraries built by the
same vendor (Google, Facebook, etc.).
4.3 Service Discovery and Fingerprinting
Service discovery identies internet-facing services on back-
ends and ngerprinting identies the software type, version,
Third-Party SDKsACRA
AMoAd
AdColony
AdFalcon
Adrally
Amazon
Android
Apache
AppBrain
AppFlood
AppsFlyer
BeaconsInSpace
Bolts
Brightroll
Butter-Knife
Chartboost
CleverTap
Crashlytics
Crittercism
Dagger
EventBus
ExoPlayer
Facebook
Firebase
Flurry
Fresco
Fyber
Google
Gson
Guava
Guice
HockeyApp
InMobi
JSch
Joda-Time
MdotM
Millennial Media
Mixpanel
MoPub
New-Relic
OkHttp
Parse
Paypal
Picasso
Pollsh
Retrot
Segment
Stetho
Supersonic
Syrup
Tapjoy
Tremor Video
Twitter4J
Urban-Airship
Vungle
WeChat
ickrj
heyZap
ironSource
jsoup
roboguice
scribe
smaato
vkontakteTable 3: A list of third-party SDKs extracted by LibScout
from the top 5,000 apps, which is used to curate third-party
backends.
and conguration of each service. Our approach is a multi-
tier approach that starts by remotely pinging the backend,
then port scanning it, then interacting with the discovered
service, and nally collecting service congurations. For in-
stance, the scan rst checks to see if the host is reachable,
then it scans for all ports to identify available services, then
it tries to connect to the service to collect its banner, and -
nally, if the services use TLS/SSL, it would collect their con-
gurations and supported ciphers. For each step, our scanner
is congured to be non-intrusive, throttled (slow scan speed
and a light load on the remote server), and conservative (us-
ing techniques that yield low to no false positives).
First, SkyWalker groups all IP addresses into their net-
work prexes and in a random order picks a prex and a ran-
dom IP from the selected prex to scan. Prexes are grouped
by the autonomous system number (ASN) for each network.
If a network spans multiple ASNs, SkyWalker keeps each
ASN as a separate prex to distribute the scanning uniformly
across different IP segments. SkyWalker does a TCP ping
against common service ports (FTP, SSH, HTTP/S, IMAP,
SMTP, RDP, etc.) by sending out a SYN packet followed by

--- page 10 ---

USENIX Association
28th USENIX Security Symposium 555

--- page 11 ---

a RST packet. TCP ping scans are more reliable in detecting
the availability of the remote server (backend) because they
are not ltered by rewalls like ICMP scans.
Once SkyWalker establishes the host is reachable, Sky-
Walker conducts a TCP SYN scan (SYN-SYN/ACK-RST)
across
all
ports. This process identies candidate ports on
the target backend that will be used for a more thorough scan
(TCP connect). To be efcient, SkyWalker uses the list of
ports identied in the TCP SYN scan to conduct a TCP con-
nect scan (SYN-SYN/ACK-ACK) i.e., establish a complete
connection. Based on the port/service identied, SkyWalker
interactively grabs the banner, the header response, and any
available conguration. The retrieved information varies per
service type, for example, HTTP will have header informa-
tion unlike SSH, nonetheless, both help ngerprint the host.
Moreover, SkyWalker looks for TLS/SSL connections on all
candidate ports because many services like HTTP and IMAP
can run over TLS/SSL. Finally, to obtain the backend IP ad-
dress fronted by CDNs, SkyWalker looks up the IP address
in a manually curated CDN list and uses passive DNS to nd
historical records that existed just before the current records.
When SkyWalker cannot locate such record, the backend is
excluded from ngerprinting.
Once SkyWalker discovers all the services running on a
backend, SkyWalker uses the result to ngerprint the back-
end. The ngerprint identies the
OS
,
SS
, and
CS
type
(Linux, Windows; PHP, .NET, Python, Perl; FTP, SFTP,
HTTP, HTTPS, SSH, IMAP, etc.), version, and congura-
tion information if available. The ngerprinting uses open
source and commercial Nessus Attack Scripting Language
(NASL) scripts to identify the different layers of software
on the backend. For example, to identify the
OS
, the NASL
script inspects the banner string, analyzes the SSL certicate,
checks additional running services (SMB, RDP, SSH), per-
forms structured ICMP pings, inspects HTTP headers, and
uses TCP/IP ngerprinting algorithms [24]. Based on these
signals a condence score is provided based on matching a
set of pre-proled
OS
es. For example, if 90% of the signals
match a
Windows Server 2008 R2 Service Pack 1
prole, we
consider the
OS
layer for that backend in the vulnerability
analysis. Any condence level below 90% or ambiguity be-
tween the same
OS
but different versions will not be consid-
ered for the vulnerability analysis phase.
Web Applications.
Web apps (
AS
) are generally tailored
per mobile app, unlike
OS
,
SS
, and
CS
layers. The binary
phase performs in-context analysis for each API interface on
the backend, which provides API information used for n-
gerprinting. We reference the OWASP's top 10 vulnerability
issues [14] that can be passively tested within the ethical and
legal bounds discussed in Section 8. Specically, SkyWalker
uses side-channel SQLi through time delay, reective XSS,
and XXE callback to identify
candidate
issues in web apps.
It is important to note that other vulnerabilities such as au-
thentication bypass, broken access control, and sensitive data
exposure present a high risk that can violate legal obliga-
tions. Adding a module to SkyWalker to support additional
vulnerabilities is trivial and can be easily implemented.
For each backend interface, a number of parameters
(
p
) are associated with each request. SkyWalker tests
each interface
p
times to check every parameter for SQLi
and XSS. The XXE check is performed on all interfaces
because some
AS
can accept JSON or XML requests. As
mentioned earlier, the scan is slow and randomly done to
avoid congestion and degradation of service on production
backends. SkyWalker creates two queues, a job queue and
a processing queue. SkyWalker generates
p
requests for a
given backend interface and stores them in the job queue.
The job queue contains all backend requests, which are
shufed and loaded into the processing queue in batches
(128 requests per batch). Batches that contain requests with
the same domain or IP address are removed and replaced by
non-overlapping domains and IP address requests. There are
32 workers that ingest from the processing queue and store
the results for vulnerability analysis.
4.4 Vulnerability Analysis
The vulnerability analysis is two parts, N-day analysis, and
0-day analysis. For the N-day analysis, SkyWalker correlates
CVE entries with results from the ngerprinting to identify
possible issues. The condence level of the ngerprint re-
sults is also used to verify each vulnerability. SkyWalker
uses NASL scripts that take the output of the service dis-
covery,
OS
identication,
SS
identication, and
CS
identi-
cation as input and match them against known vulnerabili-
ties (CVEs). The NASL results are considered if they have
90% condence level or higher for
OS
detection, which pro-
vides high accuracy for vulnerability matching. Note, that
the condence level is calculated based on pre-proled
OS
es
by matching the ngerprint signals (collected from all lay-
ers) to the prole signals.
We manually veried all 983 N-days and found them to
be all true positives. The zero false positive results are due
to the Nessus conguration, which allows us to tune how
the scans are done and how they should be reported. For
example, we congure Nessus to perform the scan types
described above, consider
OS
type and version detection of
90% or higher and consider
SS
that have banner information
with version numbers. On the other hand, when we used
UDP scanning techniques and consider generic service
banner information we nd over 6
;
500 candidate N-day
instances with a large false positive rate. In theory, the back-
end can be congured to lie about the banner information,
which would make it hard for us to verify.
For the 0-day analysis, SkyWalker carefully triggers the
candidate vulnerability to verify the ndings. For each vul-
nerable parameter, SkyWalker generates a pair of request
messages, the original message and the vulnerable message.

--- page 12 ---

556 28th USENIX Security Symposium
USENIX Association

--- page 13 ---

For
SQLi
, SkyWalker baselines the original request message
several times throughout the week and at different times of
the day. Then SkyWalker performs the same measurement
on the vulnerable message in the same week but in non-
overlapping time intervals by triggering the vulnerable pa-
rameter through an SQLi sleep injection. SkyWalker calcu-
lates the response time deviation based on the sleep param-
eter passed in the SQL statement and the average response
time of the message pairs. If the deviation is equal to the
time delay parameter in the SQL statement, SkyWalker con-
cludes that the interface and parameter pair is vulnerable.
Similarly for
XSS
, SkyWalker triggers the vulnerable pa-
rameter and includes JavaScript code to creates a new
div
element with a unique
name
attribute. SkyWalker checks
the returned content by parsing the document object model
(DOM) to nd the
div
element containing the unique
name
attribute. If the
div
element with the set
name
attribute ex-
ists SkyWalker concludes that the interface and parameter
are vulnerable. Note that SkyWalker matches the returned
content with parameters sent to ensure that the
XSS
candi-
date vulnerability is of type 2 (reected). For
XXE
, Sky-
Walker generates a request message that contains an HTTP
callback request to a server we operate. The request mes-
sage is passed to the backend, which will parse the specially
crafted XML document. If the parser is vulnerable to XXE,
SkyWalker will log an HTTP request from the backend un-
der analysis, which indicates the interface is vulnerable. In
addition, we manually reviewed the request/return pairs for
all 655 0-day instances and found no false positives.
4.5 Open Access for Developers
One of our primary goals for this work is to empower app
developers with open access to SkyWalker via a free-to-use
web-service. The service currently supports Android mobile
apps but can be extended to support other mobile platforms,
e.g., Apple iOS. The web-interface takes as input a link to an
Android app in the Google Play store or a direct APK upload.
SkyWalker then performs binary analysis to extract the back-
ends, label them based on our curated dataset, ngerprint
them, and identify vulnerabilities that affect them. In addi-
tion to the analysis, the output report provides guidelines on
how to mitigate the identied issues using the strategies dis-
cussed earlier (upgrade, patch, block, report, and migrate).
SkyWalker summarizes vulnerability ndings across all
observed SDK and Java library backends, which developers
can turn to
proactively
to make an informed decision when
choosing third-party libraries to include in their future
apps. It is important to note that attackers can abuse this
system to attack mobile app backends. Therefore we
require the developers to disclose their afliation with the
target app before the analysis results are provided. Once
a user is manually vetted, they can only submit apps that
they develop. We do not consider third-party
SDK
s in
this process. The SkyWalker service can be found at:
https://MobileBackend.vet
.
5 Assessment Findings
5.1 Experiment Setup
Environmnet.
We use a local workstation running Ubuntu
14.04 with 24GB memory and 16 x 2.393GHz Intel Xeon
CPUs and four Nexus phones to run and instrument the mo-
bile apps. We use an Amazon Web Service (AWS) Elastic
Compute (EC2) instance with a reserved IP address to con-
duct the ngerprinting and run a web server with informa-
tion about our study along with an email address for backend
hosts to contact us if they want to opt-out.
Tools and Data Sets.
For the binary analysis tool im-
plementation, we relied on Soot [25], FlowDroid [26],
Z3-str [27], and Xposed [28] with custom code written in
Java (7
;
000 lines of code) and Python (900 lines of code).
For our backend labeling implementation, we relied on Team
Cymru IP-to-ASN [29], MaxMind Geolocation [23], Alexa
ranking [30], ipcat list [20], and Domaintools WHOIS [31]
with custom code written in Python (480 lines of code).
For ngerprinting, we relied on the Nessus scanner and
commercial plugins [32], sqlmap [33], and Acunetix [34].
We used Nessus plugins and custom Python code (1010 lines
of code) to perform the vulnerability analysis. For internet
measurements, we utilized honeypot scanning activity from
Greynoise [35].
5.2 Software Vulnerability Details
Table 4 shows the distribution of 0-day and N-day instances
across the software layers. We categorize the apps using the
Google Play store groups and present the number of vulnera-
bilities and backend labels. Overall, we analyzed 4
;
980 apps
with cloud-based backends and successfully extracted back-
ends for 4
;
740 mobile apps. The remaining 240 mobile apps
crashed and did not complete the full binary analysis.
Interestingly, the
OS
component reports the least vulner-
abilities, while the
AS
component reports the most vulnera-
bilities, across all mobile app categories. Recall from Sec-
tion 3.2, vulnerabilities affecting
AS
components are all con-
sidered
0-day
. The
OS
,
SS
, and
SC
components account for
N-day
vulnerabilities. Although the number of apps is not
uniform across the categories, we use the
raw
vulnerability
count for ranking. For
0-day
vulnerabilities, the top three
mobile app categories are tools, entertainment, and games.
For
N-day
vulnerabilities, the top three mobile app categories
are entertainment, tools, and games.
Ownership.
Table 4 presents the labels for the backends
used by mobile apps. The most common label is
hybrid
,
where 3,336 backends use hybrid infrastructure. The second

--- page 14 ---

USENIX Association
28th USENIX Security Symposium 557

--- page 15 ---

Category# Mob. AppsVulnerabiltiesLabels#
OS
#
SS
#
AS
#
CS
Total#
B
1
st
#
B
3
rd
#
B
hyb
#
B
ukn
TotalBooks & Reference33215 49 55 71 190365 653 501 354 1,873
Business1455 22 10 37 7493 258 150 113 614
Entertainment1,17736 108 158 170 472746 913 942 783 3,384
Games1,28334 81 147 106 368290 804 651 444 2,189
Lifestyle36320 50 79 72 221262 665 311 237 1,475
Misc1996 21 45 46 11876 422 163 105 766
Tools79219 84 184 115 402729 796 812 464 2,801
Video & Audio68924 46 89 98 257267 648 434 357 1,706Total4,980121 356 655 506 1,6382,492 1,089 3,336 2,506 9,423Table 4: An overview of the vulnerable mobile apps per genre along with the
raw
counts of vulnerabilities and labels.Party
Vulnerable ComponentOS SS AS CSTotalB
1
st
37 87 155 211490
B
3
rd
6 21 200 42269
B
hyb
47 150 154 184535
B
ukn
55 135 146 173509Table 5: Count of
apps
affected by vulnerabilities per cloud
layer and their corresponding labels.Comp. Vulnerability (Top 3) #AppsOS
Expired Lifecycle for Linux OS (various) 124
Windows Server RCE (MS15-034) 64
Expired Lifecycle for Windows Server 9SS
Vulnerable PHP Version 357
Expired Lifecycle for Web Server (various) 181
Vulnerable Apache Version 76AS
XSS (various) 262
SQLi (various) 160
XXE (various) 86CS
Support for Vulnerable SSL Version 2 and 3 997
OpenSSH Bypass (CVE-2015-5600) 16
Vulnerable OpenSSL (various) 15Table 6: The top three vulnerabilities found per cloud layer
along with the number of affected mobile apps.
largest is
rst-party
with 2,492 backends followed by
third-
party
with 1,089 backends. There are 2,506 backends that
we were not able to label due to ambiguities, but we labeled
approximately 73% of all backends we encountered.
More important is providing remediation guidance to the
responsible party. Table 5 shows the mapping between the
backend labels and the vulnerable apps. We cannot say much
about the
Unknown
category since the vulnerabilities may
belong to either
rst-party
or
hybrid
categories. We observe
that for rst-party backends, the highest number of vulnera-
ble apps are found in
AS
and
CS
components with 155 and
211 instances, respectively. Similarly, the hybrid backends
have 154 0-day vulnerability instances and 184 N-day in-
stances. In general, we observe that the components that app
developers are responsible for (
AS
and
CS
in the
B
1
st
and
B
hyb
) have more vulnerabilities.
Operating System (
OS
).
The
OS
component issues can
be summarized into two categories: legacy unsupported
OS
or unpatched
OS
. The difference is that the legacy
OS
are
no longer supported by the vendor, hence vulnerabilities will
not be addressed. We see from Table 6 that both
Linux
(vari-
ous avors) and
Windows
backends use expired lifecycle ver-
sions and 133 apps use these backends. The second most
common issue is the
Windows Server
vulnerability
MS15-
034
affecting 64 apps, which have patches by the vendor.
Overall, the top three
OS
vulnerabilities listed in Table 6 af-
fect 197 mobile apps.
We found the MS15-034 vulnerability affecting hybrid
backends (
B
hyb
) that run on
Amazon AWS
,
Akamai
,
OVH
,
Go
Daddy
,
Digital Ocean
, and other smaller hosting providers.
Further, some of the backends appear on CDN networks, like
Akamai
,
Fastly
, and
CloudFlare
, that offer “EdgeComput-
ing” services [36] which provide web app accelerator ser-
vices. This insight shows that some developers who deploy
vanilla versions of Windows Server
OS
are not maintaining
them. In Table 5 the rst-party
OS
component has 37 vulner-
able backends, which is much higher than third-party back-
ends (6). App developers who run and maintain their own
backends (
B
1
st
) have to be mindful of these bugs, which in
some cases require provisioning new backends with newer
OSes causing incompatibilities with existing services (
SS
)
and applications (
AS
). SkyWalker can inform the developer
of these issues and report mitigation strategies.
Software Services (
SS
).
SkyWalker identied multiple vul-
nerabilities affecting a range of PHP versions, which can be
used to cause denial of service (
CVE-2017-6004
), disclose
memory content (
CVE-2017-7890
), disclose sensitive infor-
mation (
CVE-2016-1903
), and execute arbitrary code (
CVE-
2017-11145
). Backends of 357 mobile apps affected by PHP
vulnerabilities, signicantly higher than the other two vul-
nerabilities. Further, even though some mobile app back-
ends had no
0-day
vulnerabilities, an attacker can still craft
special requests to trigger deep bugs within the interpreter to
compromise the backend. Although this might be a difcult
task, recent advancement in vulnerability fuzzing [37] can
uncover these deep bugs.

--- page 16 ---

558 28th USENIX Security Symposium
USENIX Association

--- page 17 ---

The second most common
SS
vulnerability was unsup-
ported versions of Apache web server (1.3.x and 2.0.x),
Tomcat server (8.0.x), and Microsoft IIS web server (5.0).
Similar to unsupported
OS
, web server vendors will not is-
sue security patches for unsupported software, which affects
backends of 181 mobile apps. For Apache web server ver-
sions less than 2.2.15, they are affected by several denial of
service bugs (
CVE-2010-0408, CVE-2010-0434
) and TLS
injection bug (
CVE-2009-3555
) affecting 76 mobile apps.
Additionally, Apache servers that use Apache Struts ver-
sions 2.3.5 - 2.3.31 or 2.5.10.1 and lower are vulnerable
to
CVE-2017-5638
, which allows remote code execution.
The same Apache Struts vulnerability was reportedly used
against Equifax's hack [38]. In total, the top three
SS
vulner-
abilities affect 614 mobile apps.
Applications (
AS
).
Table 7 has a breakdown of the number
of mobile apps, their number of install categories, and the
instances
of
0-day
bugs affecting them. Although
XSS
is the
largest category with 503 instances followed by
SQLi
(215)
and
XXE
(46), we note that not all of the bugs have the same
impact and some affect the same backend. For instance, an
SQLi
can be limited to an isolated instance of the app (e.g.,
a container), which would limit the attack to disclosing in-
formation from the application database or modifying preex-
isting records. Moreover,
XSS
vulnerabilities often have less
impact than
SQLi
and
XXE
.
XXE
vulnerabilities affect web apps that use XML for
their API communication. The fundamental aw that en-
ables XXE vulnerabilities to exist is a faulty implementation
of the XML parser. Based on our measurement, we found
1
XXE
instance in the top 100M, 5 in the top 50M, 15 in
the top 10M, 9 in the top 5M, and 17 in the top 1M. Table 7
shows the concentration of vulnerabilities found in lower
ranking apps. For example: 1
XXE
and 3
XSS
vulnerabil-
ities in the top 132 mobile apps; 4
SQLi
, 10
XSS
, and 5
XXE
vulnerabilities in the next 131 mobile apps (though
still representing over 50M+ installs each). However,
AS
vulnerabilities are not conned to lower ranking apps but do
affect higher ranking apps.# Installs # Apps # SQLi # XSS # XXE1B 5 0 0 0
500M 11 0 0 0
100M 116 0 3 1
50M 131 4 10 5
10M 1,049 25 85 15
5M 1,047 54 89 9
1M 2,621 132 316 17Table 7: The number of
0-day
vulnerabilities found per in-
stall category.
Table 8 shows the
AS
layer implementation language and
associated vulnerabilities.
AS
implemented in
PHP
have the
most
0-days
instances (284) affecting 108 different back-Language # Backends # 0-DaysPHP 108 284
ASP.NET 13 33
PERL 4 9
JS 4 8
JSP 2 5
Unknown 72 316Table 8: The number of identied languages associated with
0-day
vulnerable backends.
ends, followed by
ASP.NET
with 33
0-day
instances affect-
ing 13 different backends. We note that this trend does
not mean causation.
PHP
is the most popular language
used for web application development [39], hence it is ex-
pected to represent more vulnerabilities by being more pop-
ular. Furthermore, we found 9
0-day
instances in
PERL
, 8 in
JavaScript (NodeJS)
, 5 in
JSP
, and the rest of the 316 could
not be determined.
Communication (
CS
).
All mobile apps rely on the
HTTP/HTTPS protocol for communication with their back-
ends. The binary analysis phase extracted a total of 17
;
725
request messages from the 4
;
740 mobile apps. The request
messages are split into HTTP (8
;
118) request messages and
HTTPS (9
;
607) request messages. There are 446 mobile
apps that only use HTTP communication and another set of
147 mobile apps that only use HTTPS communication. The
remaining set of 4,147 apps mix between HTTP and HTTPS
communication.
Despite using HTTPS, over 20% of the backends (1,012)
have issues with TLS/SSL conguration (e.g., insecure ses-
sion renegotiation and resumption) or unpatched software
versions (e.g., SSL version 2 and 3). These aws can be ex-
ploited by an attacker to carry out a MITM attack by down-
grading the protocol negotiation using the POODLE [40] at-
tack. Additionally, the OpenSSH Bypass vulnerability ex-
poses the backend to compromise via SSH credential guess-
ing or secret key leak. The mobile apps using these vulnera-
ble backends do not use the
SSH
service and to remediate one
can turn off, patch, or block the incoming internet trafc to it.
Those backends which only use HTTP expose users to
eavesdropping and MITM attacks because it does not of-
fer integrity or condentiality. We manually inspected the
request messages sent from 3,253 apps that use HTTP and
found personally identiable information (PII) such as name,
gender, birth year, user ID, password, username, and country.
Additionally, we found device information like MAC, IMEI,
SDK version, make/model, SSID, Wi signal, cell signal,
screen resolution, carrier, root access, IP Address, and co-
ordinate location. Combining this information, a network
attacker can identify individuals and attribute behavior pro-
les to them. Furthermore, 6 apps we investigated perform a
password reset over HTTP. Interestingly, the Apple iOS App
Store enforces strict use of HTTPS through their
App Trans-

--- page 18 ---

USENIX Association
28th USENIX Security Symposium 559

--- page 19 ---

Figure 2: The gure shows the CDF of the number of back-
ends per mobile app.
port Security
[41] model. We recommend that the Android
platform adopt the same restriction.
5.3 Impact on Mobile Application Users
The overall impact for each vulnerability varies based on the
severity, the mobile app to backend usage, and the adversary
capability/visibility. Although it is important to understand
the impact of each vulnerability, it is not trivial to quantify
the impact of each vulnerable backend on mobile apps. For
N-day vulnerabilities, an attacker can perform an internet-
wide scan to identify and attempt to compromise these
backends. Even once identied, these N-days span many
different components (
OS
,
SS
, and
CS
) that have varying
impacts on the backend from basic information disclosure
to a full system compromise. For 0-day vulnerabilities the
attack impact varies based on the exploit type (
SQLi
,
XSS
, or
XXE
) and how the backend infrastructure is set up. More-
over, how the mobile app uses the backend directly impacts
the severity of the vulnerability. For example, if a mobile
app uses app slicing [3] or downloads additional libraries
from the mobile backend, an attacker who compromises the
backend can modify the content and attain code execution
on the mobile device.
Figure 3: The gure shows the distribution of backends
across internet networks.
In general, an attacker has a larger attack surface for
apps that have many backends. Figure 2 shows a CDF of
backends per mobile app. We can see that the majority of
the 5,000 apps studied have between one and 25 different
backends and in the worst case they have up to 203 different
backends. We also observe that these backends reside in
diverse networks as shown in Figure 3, which means the
infrastructure set up for the backends will be different
affecting the impact of the vulnerability.
Figure 4: The gure shows the distribution of all mobile
backends and vulnerable backends across the world.
Finally, the geographical distribution of the backends,
shown in Figure 4, affect the impact on mobile apps. Many
mobile apps deploy multiple backends that are geographi-
cally distributed to provide faster content for different user
segments. In some cases, the different backends may not
be fully synchronized in terms of the latest software patches
for
OS
,
SS
,
AS
, and
CS
layers, which results in a vulnerable
backend affecting only a segment of users for a particular
mobile app. Directly quantifying the impact of each vulner-
ability is an involved task and depends on many variables
such as the severity of the vulnerability, the mobile app to
backend usage, the adversary capability, and other nuance
factors (number of backends per app, network distribution,
and geographical distribution). We plan to perform a com-
prehensive analysis to understand this impact as future work.
5.4 Vulnerability Disclosure, Bug Bounties,
And In The Wild Threats
During our disclosure process, we identied two mobile
platform vendors that have a bounty program, namely
Unity3D
[42] and
Simpli.
[43]. In addition, the top third-
party platform providers, Google, Facebook, Crashlytics,
and Flurry, all participate in or run their own bug bounty
programs. Similarly, the cloud providers either run their
own program or use a third-party bug bounty program like
Bugcrowd [44] or Bounty Factory [45]. We submitted our
vulnerability disclosures through their bounty management
program (e.g.,
HackerOne
[46]) and received conrmation
of the bugs.

--- page 20 ---

560 28th USENIX Security Symposium
USENIX Association

--- page 21 ---

For smaller third-party and rst-party developers, they did
not have a formal way to contact them to report vulnerabil-
ities. We followed a tiered approach in our notication by
rst notifying the app developer directly using the contact
information in the Play Store. Our second attempt to report
the vulnerability is by contacting the domain owner using the
WHOIS information and following the mitigation strategy.
Our third attempt to report the vulnerability is by contacting
Google directly through their issue tracker portal. For parties
that did not conrm or respond to our multiple attempts, we
reported the vulnerabilities to US-CERT [47].Component# IP ScannersOperating System (
OS
)341,521
Services (
SS
)445,908
Application (
AS
)206,533Table 9: Number of IPs observed scanning the internet for
vulnerabilities reported by Greynoise.io [35] over a period
of a year (Sept 2017 to Sept 2018).
The N-day vulnerabilities we found are discoverable
and easy to exploit due to the availability of fast internet
scanners like ZMap [48] and MASSCAN [49]. We argue
that it is a matter of time until these vulnerabilities are found
and exploited. Table 9 shows the number of active scans
detected on the internet through Greynoise [35] honeypots
over a period of one year (Sept 2017 to Sept 2018). There
are 341,521 unique IPs scanning for
OS
related vulnerabil-
ities, 445,908 unique IPs scanning for
SS
vulnerabilities,
and 206,533 unique IPs scanning for
AS
vulnerabilities.
Many of these scans target
N-day
vulnerabilities, while
scans for
0-day
vulnerabilities cannot be accounted for.
Nonetheless, past events demonstrate that attackers are
prone to scan for and exploit 0-day vulnerable web apps like
Wordpress [50], Drupel [51], and PHPMyAdmin [52] when
publicly disclosed. Furthermore, a recent report [53] also
pointed out that the number of vulnerabilities in web apps
increased in 2018 and that support for PHP version 5
:
x
and
7
:
x
will end in 2019, which means we can anticipate more
unpatched and exposed backends in the future.
6 Case Studies
6.1 Case Study 1: Vulnerable Web App
The mobile app “Dailyhunt” has more than 50M+ installs
and is part of the “Books & Reference” category. The mo-
bile app interacts with nine different backends as shown in
Table 10. The backends are split into two labels, hybrid and
third-party. The hybrid backends are hosted on Akamai's
EdgeComputing [36] and run a custom web app to serve
the mobile app. The hybrid backends are used for CDN,
telemetry, and requesting app-specic data. Specically, theLabelBackendUseVulns.AS CSB
hybapi-news.dailyhunt.inApp Data0
1acq-news.dailyhunt.inApp Data &
Telemetry2
1bcdn.newshunt.comCDN0
1acdn.newshunt.comCDN0
1B
3
rdfonts.gstatic.comCDN0 0e.crashlytics.comTelemetry0 0settings.crashlytics.comTelemetry0 0t.appsyer.comAds0 0api.appsyer.comAds0 0Table 10: A list of backends and issues found for the mobile
app Dailyhunt.
api-news.*
domain registers the device and requests content,
where the
acq-news.*
backend captures user behavior and
offers promotion and the actual content is delivered by the
two CDN domains
acdn.*
and
bcdn.*
.
We were not able to ngerprint the
OS
and the
SS
be-
cause the Akamai servers respond only to web app spe-
cic responses, i.e., minimal header and banner informa-
tion. Nonetheless, we found two 0-day vulnerabilities in the
acq-news.*
backend on the same API interface. Since this
web application is specic to this mobile app, we looked for
other apps published by the same developer. We found that
the
eBooks by Dailyhunt
app (which has over 500K installs
but does not rank in the top 5,000 apps) also uses the same
vulnerable API interface. Additionally, the mobile apps use
HTTP to communicate with the hybrid backends and HTTPS
to communicate with third-party services.
As for the third-party services, we did not nd any vul-
nerabilities. The third-party backends serve requests on port
443 (HTTPS). The
appsyer.com
backend is a service for
ad analytics that provides different functions using the same
interface. The
t.appsyer.com
backend is a telemetry end-
point for the ad network and the
api.appsyer.com
backend
authenticates and associates the app with its prole.
Takeaway.
This case highlights several challenges to secur-
ing mobile app backends. First, backends are heterogeneous
and differ across their software stack, topology setup, cong-
uration, and custom application. Second, outsourcing cloud
management and provisioning (e.g., to cloud providers and
CDNs) benets security but comes with a lack of visibility,
limited per-app customization, and unclear incident liability.
Third, vulnerabilities can exist (and be scanned for) in any
software layer of the cloud and API interface on the web
app, which makes them challenging to identify and x. Un-
fortunately, app developers do not have the resources, time,
or personnel to fulll this task. Using SkyWalker, we aim to
provide guidance to where the most pressing issues exist and
map them to responsible parties as shown in Table 2.

--- page 22 ---

USENIX Association
28th USENIX Security Symposium 561

--- page 23 ---

App Name # Reviews # Installscom.icegame.fruitlink 332,907 50M+
com.unbrained.wipasswordgenerator 151,518 10M+
com.magdalm.wimasterpassword 148,355 10M+
com.unbrained.wipassgen.app 43,824 1M+
com.magdalm.freewipassword 35,552 1M+
apps.ignisamerica.gamebooster 23,725 500K+
com.icegame.crazyfruit 23,631 1M+
com.magdalm.wipasswordpro 22,113 1M+
apps.ignisamerica.bluelight 16,659 500K+
com.icegame.fruitsplash2 15,193 1M+Table 11: A list of the top 10 mobile apps using the
appnext
platform.LabelBackend UsageVulns.OS AS CSB
3
rdadmin.appnext.com App Data0
1 0global.appnext.com App Data0 0 0cdn.appnext.com CDN1 0
1cdn3.appnext.com CDN1 0
1Table 12: List of backends and vulnerable layers found in
the
appnext
platform.
6.2 Case Study 2: Vulnerable Platform
The
appnext
[54] platform integrates with mobile apps to in-
gest user behavior telemetry and provide predictive actions
that users might perform. Developers use this to upsell sub-
scription, ads, or recommend actions to app users. The
app-
next
platform is used by 6 mobile apps from the top 5,000
free apps. We analyzed all apps by the same developers that
are not in the top 5,000 and found 140 additional apps using
the
appnext
platform. The top 10 most reviewed apps using
the
appnext
platform can be found in Table 11. The top app
has 332,907 reviews and over 50M+ installs. These numbers
give us an indication of the the platform's signicant popu-
larity and daily use.
The
appnext
platform backends (shown in Table 12) are
labelled as third-party, because the backends are found in an
SDK library. We found two CDN domains that point to the
same server IP, which are hosted on
Limelight Networks
, a
CDN provider. This CDN backend is vulnerable to an
OS
integer overow in the HTTP protocol stack (MS15-034)
that can be remotely exploited. Further, the
CS
still offers
SSLv2 and SSLv3, which are vulnerable to insecure padding
scheme for
CBC
cipher.
appnext
's
admin.*
and
global.*
do-
mains run on Amazon AWS and provide app-specic data,
like authentication, telemetry ingestion, predictive actions,
and conguration. The infrastructures run Microsoft Win-
dows Server 2008 R2 for the
OS
, Microsoft-IIS/7.5 for its
web server (
SS
), and the
CS
uses
HTTPS
. The application
(
AS
) backend is a custom web application that is written in
ASP
and uses the
ASP.NET
framework. The
AS
has a vulner-
ability that allows an attacker to run arbitrary SQL queries.
We have notied the developers about these ndings and
awaiting remediation.
Takeaway.
This case highlights multiple vulnerabilities,
0-day
and
N-day
, that affect three of the four software
layers. This mobile platform collects sensitive information
about user behavior, including PII and device information.
Unfortunately, these backend vulnerabilities are inherited by
multiple apps and developers, and the app developers cannot
immediately remediate the vulnerabilities in third-party
services. The mitigation strategy for the app developer is
to report (
r
) these ndings to
appnext
or migrate (
m
) their
app to a different service. SkyWalker helps us label the
backends, identify the vulnerability, and guide the developer
to a clear action (report or migrate).
7 Mitigation
The goal of our empirical analysis was to bring attention
to this overlooked problem in mobile backends, but also to
provide guidance to app developers for building or choosing
secure backends. In this section, we discuss the general
mitigation strategies which SkyWalker recommends for app
developers and to help improve the security posture of their
app backends.
7.1 Remediation Strategies
App developers who rely on rst-party backends have to
up-
grade
,
patch
, and
block
as needed for each software layer
on their backend. If they rely on third-party backends they
can
report
the issue or
migrate
their backend to a more se-
cure provider. Ambiguity arises when the backend is hosted
by a cloud provider, a hybrid type backend. To resolve these
issues we further generalize the hybrid backends into IaaS
(cloud provider manages the virtual
HW
) and PaaS (cloud
provider manages
HW
,
OS
, and
SS
).
HybridStrategies HW OS SS AS CSUpgrade4 4 44
Patch4 4 44 44
Block4 4
Report44 4 4
Migrate44 4 4Table 13: A mapping of mitigation strategies for developers
hosting their hybrid backend on infrastructure (
IaaS
) or a
platform (
PaaS
).
Table 13 provides developers with a guideline on how to
mitigate vulnerable hybrid backends. For example: if the
hybrid backend is using a cloud provider's platform offer-
ing, developers should report and/or migrate their backend
if the vulnerabilities are found in
HW
,
OS
,
SS
and upgrade
or patch if the vulnerabilities
CS
or
AS
related, respectively.

--- page 24 ---

562 28th USENIX Security Symposium
USENIX Association

--- page 25 ---

This matrix provides a starting point for app developers to
explore their options, i.e., migrate or wait for a x. In some
cases, the offering from cloud providers includes
HW
and
OS
(as in the motivating example which uses Google Com-
pute Engine Flexible Environment). In this case, developers
have to make sure they use the latest
OS
images supported
by their cloud provider.
7.2 Recommendations
The empirical analysis provides insight not only about inse-
cure mobile backends, but also secure practices that devel-
opers can learn from. For developers who decide to build
their own rst-party backends, we recommend the follow-
ing: First, developers should
delegate
as much of the back-
end functionality to reputable third-party backends and min-
imize the number of features and functions their backend
needs to support. Second, developers should
dedicate
per-
sonnel to manage and maintain their backends including the
routine maintenance of
OS
,
SS
and
CS
, and timely xes of
known vulnerabilities affecting their cloud backends and mo-
bile apps using patching tools [55]–[57]. Third, developers
should
develop
an audit plan and a mitigation plan and be
familiar with it to execute during an incident or vulnera-
bility disclosure. Finally, developers should utilize
defense
tools like web app rewalls (WAF), DDoS mitigation, and
crawler/scanner blockers to protect from internet scanners,
DDoS threats, and web app attacks (SQLi, authentication by-
pass, etc.). We identied over 730 backends using defense
services, all of which had smaller footprints when nger-
printed and no vulnerabilities were detected.
8 Measurement Considerations
Ethical.
Because our work does not require or implicate hu-
man subjects, no IRB approval was required by our institute.
Our study identied a large number of
0-day
and
N-day
vul-
nerabilities in active mobile app backends through scanning
and probing. Our techniques include service scans, banner
grabs, and side-channel probes. We emphasize that no ac-
tive exploitation, disruption, or sensitive data access was at-
tempted against the mobile backends. Although there are no
set guidelines for vulnerability measurements in the commu-
nity, several previous works (e.g., [48], [58]–[60]) have set
some precedent. Our measurements followed the best prac-
tices used in previous work using the following approach:

Good Internet Citizenship:
Similar to the work of Li
et al. [58], we provided an opt-out page for our scanner
IP that gives targets an option to be removed from the
study. Further, we signal our benign intention by setting
the user-agent string in the scans and provide a reverse
DNS record for our IP to give targets additional infor-
mation about our study. We were contacted by one app
developer and requested that we remove their backends
and related infrastructure from our study.

Non-Exploit Payloads:
Similar to the work of Du-
rumeric et al. [59], our scanning and measurement tech-
niques did not include any active exploits against the
mobile app backends. We used side-channel measure-
ments with time delay probes to infer vulnerabilities.
The requests were carefully crafted to ensure that vul-
nerabilities are triggered for verication and not persis-
tent or full system exploitation. Further, our scanning
approach was throttled to ensure the availability of the
backend is not affected by the additional load.

Responsible Disclosure:
Lastly, we notied affected
mobile app developers and third-party mobile service
providers through the appropriate channels. For devel-
opers and third-party service providers who did not re-
spond to our communication, we reported the vulnera-
bilities through the US-CERT [47].
Legal.
Similar to Ristenpart et al. [60], we operate within
the legal bounds in conducting this study. In the US, the
Computer Fraud and Abuse Act (CFAA) is the governing law
that pertains to use and access of computer systems. The law
states, in brief, that access to any computer system must be
authorized, but does so in broad terms. The decision from the
case of Moulton v VC3 (2000) sets a precedent that service
discovery scanning does not cause damages or direct harm to
target systems. Additionally, we assume any internet-facing
service gives implicit permission to access the target com-
puter system, in particular, we refer to how web crawlers
and internet indexing services operate. As we outlined in
our ethical section earlier, we provide subjects the option
to opt-out, perform non-malicious measurement probes, and
use responsible disclosure to notify affected parties.
9 Related Work
Cloud Security.
Cloud security has been surveyed exten-
sively [61]–[65]. Xiao et al. [9] performed a comprehensive
analysis of the security issues in cloud services by surveying
high-level
provider
and
tenant
issues for the cloud-based ser-
vices in general. Singh et al. [66] presented a survey to iden-
tify common issues reported in third-party cloud services
and summarize the work from the architecture framework,
service and deployment, and cloud technologies perspective.
Our work looks at “in-the-wild” deployment of cloud
services from the
OS
,
SS
,
AS
, and
CS
perspectives to empiri-
cally study and uncover common issues in mobile backends.
Measurement Studies.
Durumeric et al. [67] conducted a
comprehensive internet-wide study of the HTTPS certicate
ecosystem. Later, Durumeric et al. [59] carried out a simi-
lar internet-wide study for the Heartbleed vulnerability [68].

--- page 26 ---

USENIX Association
28th USENIX Security Symposium 563

--- page 27 ---

Perez-Botero et al. [69] presented an in-depth study charac-
terizing hypervisor vulnerabilities in cloud services. Zuo et
al. [19] proposed a system to identify mobile app URLs and
examine their reputation with public blacklists to detect ma-
licious apps. Our work differs from prior work by studying
a range of vulnerabilities which may affect mobile app back-
ends on the internet.
Empirical Backend Analysis.
Zuo et al. [12] performed
an assessment of mobile app backend services by investigat-
ing the cloud offerings of Google, Amazon, and Microsoft.
Our work provides a wider analysis by going beyond just
the third-party service backends and by examining a diverse
set of cloud-based backends. Fernandes et al. [70] analyzed
the top apps found in the Samsung SmartThings platform to
identify permission issues. We follow a similar approach but
focus on the mobile app integration with cloud services in-
stead of IoT apps and cloud services. Alrawi et al. [71] pre-
sented a systematization security assessment of home-based
IoT devices and their companion cloud and mobile apps. Our
work encompasses a wider application, beyond only IoT mo-
bile apps, and a more focused assessment by looking at the
supporting backends provided by cloud services.
10 Conclusion
This paper presented SkyWalker, an analysis pipeline to
study mobile app backends. We used SkyWalker to empiri-
cally analyze the top 5,000 mobile apps in the Google Play
store and uncovered 655 0-days and 983 N-days instances
affecting thousands of apps. Lastly, we offer SkyWalker as
a public service to help app developers improve the security
of their backends, give insight on what platforms are vulner-
able, and guide developers to x issues found in their back-
ends:
https://MobileBackend.vet
.
Acknowledgement
We thank Manos Antonakakis, Yizheng Chen, Angelos
Keromytis, Panagiotis Kintis, Chaz Lever, Frank Li, Xi-
aojing Liao, Yinqian Zhang, and the anonymous reviewers
for their insightful comments. This work was partially
supported by AFOSR under grant FA9550-14-1-0119, NSF
awards 1834215, and 1834216.
References
[1] S. Ghosh,
British Airways customer data stolen from its web-
site
,
https://www.theguardian.com/business/2018/
sep/06/british-airways-customer-data-stolen-
from-its-website
, 2018.
[2] Z. Whittaker,
Air Canada conrms mobile app data breach
,
https://techcrunch.com/2018/08/29/air-canada-
confirms-mobile-app-data-breach/
, 2018.
[3] A. Martonik,
Epic`s rst Fortnite Installer allowed hack-
ers to download and install anything on your Android
phone silently
,
https : / / www . androidcentral . com /
epic-games-first-fortnite-installer-allowed-
hackers-download-install-silently
, 2018.
[4] K. Watkins, “HospitalGown: The Backend Exposure Putting
Enterprise Data at Risk,” Appthority, Tech. Rep., 2017.
[5] S. Subashini and v. Kavitha, “A survey on security issues
in service delivery models of cloud computing,”
Journal of
Network and Computer Applications
, 2011.
[6] C. H
¨
ofer and G. Karagiannis, “Cloud computing services:
Taxonomy and comparison,”
Journal of Internet Services
and Applications
, 2011.
[7] L. Youseff, M. Butrico, and D. Da Silva, “Toward a unied
ontology of cloud computing,” in
In Proc. IEEE Grid Com-
puting Environments Workshop (GCE)
, 2008.
[8] D. Gonzales, J. M. Kaplan, E. Saltzman, Z. Winkelman, and
D. Woods, “Cloud-trust-A security assessment model for in-
frastructure as a service (IaaS) clouds,”
IEEE Transactions
on Cloud Computing
, 2017.
[9] Z. Xiao and Y. Xiao, “Security and privacy in cloud comput-
ing,”
IEEE Communications Surveys & Tutorials
, 2013.
[10] K. Watkins and S. M. Kywe, “Unsecured Firebase
Databases: Exposing Sensitive Data via Thousands of Mo-
bile Apps,” Appthority, Tech. Rep., 2018.
[11] C. Zuo, Q. Zhao, and Z. Lin, “Authscope: Towards automatic
discovery of vulnerable authorizations in online services,” in
Proceedings of the 24th ACM Conference on Computer and
Communications Security (CCS)
, Dallas, TX, Oct. 2017.
[12] C. Zuo, Z. Lin, and Y. Zhang, “Why does your data leak?
uncovering the data leakage in cloud from mobile apps,” in
Proceedings of the 40th Symposium on Security and Privacy
(Oakland)
, San Francisco, CA, May 2019.
[13] National Institute of Standards and Technology,
NATIONAL
VULNERABILITY DATABASE
,
https://nvd.nist.gov
,
2019.
[14] OWASP,
OWASP Top 10 - 2017: The Ten Most Critical Web
Application Security Risks
,
https://www.owasp.org/
images/7/72/OWASP_Top_10-2017_%28en%29.pdf.
pdf
, 2018.
[15] Kony,
Kony Fabric
,
https://www.kony.com/products/
fabric/
, 2018.
[16] OutSystems,
Build Mobile Apps
,
https://www.outsyste
ms.com/platform/build-mobile-apps/
, 2018.
[17] Apache,
Architectural overview of Apache Cordova plat-
form
,
https://cordova.apache.org
, 2018.
[18] Backbase,
Backbase Enterprise Integration Framework
,
ht
tps://backbase.com/platform/integration/
, 2018.
[19] C. Zuo and Z. Lin, “Smartgen: Exposing server urls of mo-
bile apps with selective symbolic execution,” in
Proceed-
ings of the 26th International World Wide Web Conference
(WWW)
, 2017.

--- page 28 ---

564 28th USENIX Security Symposium
USENIX Association

--- page 29 ---

[20] N. Galbreath,
Categorization of IP Addresses
,
https : / /
github.com/client9/ipcat
, 2019.
[21] M. Backes, S. Bugiel, and E. Derr, “Reliable third-party
library detection in android and its security applications,”
in
Proceedings of the 23rd ACM Conference on Computer
and Communications Security (CCS)
, Vienna, Austria, Oct.
2016.
[22] R. Duan, A. Bijlani, M. Xu, T. Kim, and W. Lee, “Identify-
ing open-source license violation and 1-day security risk at
large scale,” in
Proceedings of the 24th ACM Conference on
Computer and Communications Security (CCS)
, Dallas, TX,
Oct. 2017.
[23] MaxMind,
About MaxMind
,
https://www.maxmind.com/
en/company
, 2018.
[24] R. Beverly, “A robust classier for passive TCP/IP nger-
printing,” in
Workshop on Passive and Active Network Mea-
surement
, Springer, 2004.
[25] E. Bodden,
A framework for analyzing and transforming
java and an- droid apps
,
https://sable.github.io/
soot/
, 2018.
[26] S. Arzt, S. Rasthofer, C. Fritz, E. Bodden, A. Bartel, J. Klein,
Y. Le Traon, D. Octeau, and P. McDaniel, “Flowdroid: Pre-
cise context, ow, eld, object-sensitive and lifecycle-aware
taint analysis for android apps,” in
Proceedings of the 2014
ACM SIGPLAN Conference on Programming Language De-
sign and Implementation (PLDI)
, Edinburgh, UK, Jun. 2014.
[27] Y. Zheng, X. Zhang, and V. Ganesh, “Z3-str: A z3-based
string solver for web application analysis,” in
Proceed-
ings of the 18th European Software Engineering Conference
(ESEC) / 21st ACM SIGSOFT Symposium on the Founda-
tions of Software Engineering (FSE)
, Saint Petersburg, Rus-
sia, Aug. 2013.
[28] X. Framework,
Xposed Module Repository
,
https://rep
o.xposed.info/module/de.robv.android.xposed.
installer
, 2018.
[29] T. Cymru,
IP TO ASN MAPPING
,
http://www.team-
cymru.com/IP-ASN-mapping.html
, 2018.
[30] Alexa,
Find Website Trafc, Statistics, and Analytics
,
https
://www.alexa.com/siteinfo
, 2018.
[31] DomainTools,
About Us
,
https://www.domaintools.
com/company/
, 2018.
[32] T. Security,
Nessus Professional
,
https://www.tenable.
com/products/nessus/nessus-professional
, 2018.
[33] S. Project,
sqlmap: automatic SQL injection and database
takeover tool
,
http://sqlmap.org
, 2018.
[34] Acunetix,
Audit Your Web Security with Acunetix Vulner-
ability Scanner
,
https : / / www . acunetix . com /
vulnerability-scanner/
, 2018.
[35] Geynoise,
About
,
https://greynoise.io/about/
, 2018.
[36] E. Nygren, R. K. Sitaraman, and J. Sun, “The akamai net-
work: A platform for high-performance internet applica-
tions,” in
Proceedings of the ACM SIGOPS Operating Sys-
tem Review
, vol. 44, Jul. 2010.
[37] W. You, P. Zong, K. Chen, X. Wang, X. Liao, P. Bian, and
B. Liang, “Semfuzz: Semantics-based automatic generation
of proof-of-concept exploits,” in
Proceedings of the 24th
ACM Conference on Computer and Communications Secu-
rity (CCS)
, Dallas, TX, Oct. 2017.
[38] D. Goodin,
Failure to patch two-month-old bug led to mas-
sive Equifax breach
,
https : / / arstechnica . com /
information - technology / 2017 / 09 / massive -
equifax- breach- caused- by- failure- to- patch-
two-month-old-bug/
, 2018.
[39] X. Li and Y. Xue, “A survey on server-side approaches to se-
curing web applications,”
ACM Computing Surveys (CSUR)
,
2014.
[40] B. M
¨
oller, T. Duong, and K. Kotowicz, “This poodle bites:
Exploiting the ssl 3.0 fallback,”
Security Advisory
, 2014.
[41]
App Transport Security
,
https://forums.developer.
apple.com/thread/6767
, 2015.
[42] Unity3D,
Imagine, build and succeed with Unity
,
https:
//unity3d.com
, 2018.
[43] Simpli.,
About Us
,
https://www.simpli.fi/about-
us/
, 2018.
[44] bugcrowd,
THE BUGCROWD DIFFERENCE
,
https://
www . bugcrowd . com / who - we - are / the - bugcrowd -
difference/
, 2018.
[45] B. Factory,
CREATE MY BUG BOUNTY PROGRAM
,
http
s://bountyfactory.io/en/mybugbounty.html
, 2018.
[46] HackerOne,
About HackerOne
,
https://www.hackerone
.com/about
, 2018.
[47] US-CERT,
About Us
,
https://www.us-cert.gov/abou
t-us
, 2018.
[48] Z. Durumeric, E. Wustrow, and J. A. Halderman, “Zmap:
Fast internet-wide scanning and its security applications.,” in
Proceedings of the 22th USENIX Security Symposium (Secu-
rity)
, Washington, DC, Aug. 2013.
[49] R. D. Graham,
MASSCAN
,
https://github.com/rober
tdavidgraham/masscan
, 2018.
[50] M. Veenstra,
Privilege Escalation Flaw In WP GDPR Com-
pliance Plugin Exploited In The Wild
,
https : / / www .
wordfence . com / blog / 2018 / 11 / privilege -
escalation - flaw - in - wp - gdpr - compliance -
plugin-exploited-in-the-wild/
, 2018.
[51] J. Mattsson,
Drupal core - Highly critical - Remote Code
Execution - SA-CORE-2018-002
,
https://www.drupal.
org/sa-core-2018-002
, 2018.
[52] C. Point,
Web servers PHPMyAdmin Misconguration Code
Injection
,
https://www.checkpoint.com/defense/
advisories/public/2014/cpai-17-mar1.html
, 2018.
[53] N. Avital,
The State of Web Application Vulnerabilities in
2018
,
https://www.imperva.com/blog/the-state-
of- web- application- vulnerabilities- in- 2018/
,
2019.
[54] Appnext,
The Appnext Discovery Platform
,
https://www.
appnext.com/platform/
, 2018.

--- page 30 ---

USENIX Association
28th USENIX Security Symposium 565

--- page 31 ---

[55] SecurityFTW - cs-suite,
Cloud Security Suite - One stop tool
for auditing the security posture of AWS/GCP/Azure infras-
tructure.
https : / / github . com / SecurityFTW / cs -
suite
, 2018.
[56] J. Arnold and M. F. Kaashoek, “Ksplice: Automatic reboot-
less kernel updates,” in
Proceedings of the 4th European
Conference on Computer Systems (EuroSys)
, Nuremberg,
Germany, Mar. 2009.
[57] R. Duan, A. Bijlani, Y. Ji, O. Alrawi, Y. Xiong, M. Ike, B.
Saltaformaggio, and W. Lee, “Automating patching of vul-
nerable open-source software versions in application bina-
ries,” in
Proceedings of the 2019 Annual Network and Dis-
tributed System Security Symposium (NDSS)
, San Diego,
CA, Feb. 2019.
[58] F. Li, Z. Durumeric, J. Czyz, M. Karami, M. Bailey, D. Mc-
Coy, S. Savage, and V. Paxson, “You`ve got vulnerability:
Exploring effective vulnerability notications,” in
Proceed-
ings of the 25th USENIX Security Symposium (Security)
,
Austin, TX, Aug. 2016.
[59] Z. Durumeric, F. Li, J. Kasten, J. Amann, J. Beekman, M.
Payer, N. Weaver, D. Adrian, V. Paxson, M. Bailey,
et al.
,
“The matter of heartbleed,” in
Proceedings of the 14th Inter-
net Measurement Conference (IMC)
, 2014.
[60] T. Ristenpart, E. Tromer, H. Shacham, and S. Savage, “Hey,
you, get off of my cloud: Exploring information leakage
in third-party compute clouds,” in
Proceedings of the 16th
ACM Conference on Computer and Communications Secu-
rity (CCS)
, Chicago, Illinois, Nov. 2009.
[61] S. Subashini and V. Kavitha, “A survey on security issues
in service delivery models of cloud computing,”
Journal of
network and computer applications
, vol. 34, no. 1, pp. 1–11,
2011.
[62] M. Almorsy, J. Grundy, and I. M
¨
uller, “An analysis of
the cloud computing security problem,”
arXiv preprint
arXiv:1609.01107
, 2016.
[63] Y. Sun, G. Petracca, X. Ge, and T. Jaeger, “Pileus: Protect-
ing user resources from vulnerable cloud services,” in
Pro-
ceedings of the 32th Annual Computer Security Applications
Conference (ACSAC)
, 2016.
[64] S. Iqbal, M. L. M. Kiah, B. Dhaghighi, M. Hussain, S. Khan,
M. K. Khan, and K.-K. R. Choo, “On cloud security at-
tacks: A taxonomy and intrusion detection and prevention as
a service,”
Journal of Network and Computer Applications
,
vol. 74, pp. 98–120, 2016.
[65] N. V. Juliadotter and K.-K. R. Choo, “Cloud attack and
risk assessment taxonomy,”
IEEE Cloud Computing
, vol. 2,
no. 1, pp. 14–20, 2015.
[66] A. Singh and K. Chatterjee, “Cloud security issues and chal-
lenges: A survey,”
Journal of Network and Computer Appli-
cations
, 2017.
[67] Z. Durumeric, J. Kasten, M. Bailey, and J. A. Halderman,
“Analysis of the https certicate ecosystem,” in
Proceedings
of the 13th Internet Measurement Conference (IMC)
, 2013.
[68] Codenomicon and Google,
The Heartbleed Bug
,
https://
heartbleed.com/
, 2017.
[69] D. Perez-Botero, J. Szefer, and R. B. Lee, “Characteriz-
ing hypervisor vulnerabilities in cloud computing servers,”
in
Proceedings of the 20th ACM Conference on Computer
and Communications Security (CCS)
, Berlin, Germany, Oct.
2013.
[70] E. Fernandes, J. Jung, and A. Prakash, “Security analysis of
emerging smart home applications,” in
Proceedings of the
37th Symposium on Security and Privacy (Oakland)
, San
Jose, CA, May 2016.
[71] O. Alrawi, C. Lever, M. Antonakakis, and F. Monrose, “Sok:
Security evaluation of home-based iot deployments,” in
Pro-
ceedings of the 40th Symposium on Security and Privacy
(Oakland)
, San Francisco, CA, May 2019.

--- page 32 ---

566 28th USENIX Security Symposium
USENIX Association

--- page 33 ---

!"!"! !"""! "!"!! !""#$%&'(')*#!+(,-.)./01),2#345678'9:;<#!=$$28+')>)*('):+&8,8*')?8&-@A3B0(*<8+2#C%D3B';(*'):+4:+.';()+'#$+.';1@8+'82E-+(@)*#!+(,-.).!"#$%&'()*+=:"1,('8#0(*<8+2F1",8#{d, ip, lib, v}G9+8;.H)"#3B';(*'):+D(A8,!..)I+@8+'%8@:'8#=)+I=:;'#&*(++",%-%'!"#$%&'()*+ $+'8;(*')?8#&8;?)*8$28+')>)*('):+D(-8;82#&:>'9(;8#$28+')>)*('):+ !"#$./&0%121/&3%'!"#$%&'%J)+I8;";)+'#4:+>)28+*8#&*:;80)+(;-#!+(,-.).0(*<8+2#D(A8,)+I&8;?)*8#E).*:?8;-#(+2#J)+I8;";)+')+I#K1,+8;(A),)'-#!+(,-.).#J)+I8;";)+'#L4K34:;;8,('):+K1,+8;(A),)'-K8;)>)*('):+%8":;'#0(*<8+2$..18. !""!=M

--- page 34 ---

/5<BHMQVY^`bcddeefffffffffffffffffffffeeedcba_][XTPJE?92,& 
	%+28?EJPTX[^`acddeefffffffffffffffffffffffeeedcba_ZVRNHB<6//6=CIOTX[^`bcdeeffffffffffffffffffffffffffffffeddca_]ZVRLG@:3,%
#*18?EKPUY_abddefffffffffffffffffffffffffffffffeedcb`^[XSNIB<5.' 	%,3:@GMRVZ]`bcdeeffffffffffffffffffffffffffffffffeddba_YUPJD>70

--- page 35 ---

*+,./001222222222110/.-,**,./123456667777777766544210/-+

--- page 36 ---

*+,-.....-,+*

--- page 37 ---

/6=CJOTX[^`bcdeefffffffffffffffffffffffffffffeedcb`^[XTOJD=6007>DJPUY_acddefffffffffffffffffffffffffffffffffeedca_YUPKE>7007>DJPUY_acddefffffffffffffffffffffffffffffffffeedca_YUPKE>70/6=DJOTX[^`bcdeefffffffffffffffffffffffffffffeedcb`^[XTOJD=60

--- page 38 ---

0
25
50
75
100
125
150
175
200
Number of Backends Per Mobile App
0.0
0.2
0.4
0.6
0.8
1.0

--- page 39 ---

:Ly%#%'2#2'E#E'¥'
