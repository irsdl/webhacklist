---
type: Article
title: "Automatic Insecurity: Exploring Email Auto-configuration in the Wild"
resource: "https://www.ndss-symposium.org/ndss-paper/automatic-insecurity-exploring-email-auto-configuration-in-the-wild/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:13:06+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/automatic-insecurity-exploring-email-auto-configuration-in-the-wild/"
    title: "Automatic Insecurity: Exploring Email Auto-configuration in the Wild"
    author: Shushang Wen, Yiming Zhang, Yuxiang Shen, Bingyu Li, Haixin Duan, Jingqiang Lin
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2025-1078-paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/8A-f1078-wen.pdf"
authors:
  - Shushang Wen
  - Yiming Zhang
  - Yuxiang Shen
  - Bingyu Li
  - Haixin Duan
  - Jingqiang Lin
canonical_url: ""
cited_by:
  - "2025.md:86"
commit: ""
content_sha256: 6107779267d022aa2259294445cd0b56fb0b74e945ed1726d8426bf1ad00ddf6
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/automatic-insecurity-exploring-email-auto-configuration-in-the-wild/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 6a7b572a23cafde6b50f3b036097401f763559cd8bce70ff63d2f4abddb26ec4
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2025-1078-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:13:06+00:00"
slug: ndss-symposium-automatic-insecurity-exploring-email-auto-configuration-wild
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Automatic Insecurity: Exploring Email Auto-configuration in the Wild

**Automatic Insecurity: Exploring Email Auto-configuration in the Wild** - Shushang Wen, Yiming Zhang, Yuxiang Shen, Bingyu Li, Haixin Duan, Jingqiang Lin, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/automatic-insecurity-exploring-email-auto-configuration-in-the-wild/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2025-1078-paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/8A-f1078-wen.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2025-1078-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Automatic Insecurity: Exploring Email
                      Auto-configuration in the Wild

           Shushang Wen∗ , Yiming Zhang† B, Yuxiang Shen∗ , Bingyu Li‡ , Haixin Duan†§ , Jingqiang Lin∗ B
                ∗ School of Cyber Science and Technology, University of Science and Technology of China, China
                                                        † Tsinghua University, China
                                 ‡ School of Cyber Science and Technology, Beihang University, China
                                                    § Zhongguancun Laboratory, China

                           {sswen, yuxiangshen}@mail.ustc.edu.cn, {zhangyiming, duanhx}@tsinghua.edu.cn,
                                              libingyu@buaa.edu.cn, linjq@ustc.edu.cn

    Abstract—Email clients that support auto-configuration mech-         respectively. Both mechanisms are designed to retrieve server
anisms automatically retrieve server configuration information,          configuration information automatically, allowing a user to log
such as the hostname, port number, and connection type, al-              in by simply entering the email address and password. Subse-
lowing users to log in by simply entering email addresses and            quently, in 2011, the IETF released a standard [23] for client
passwords. Auto-configuration mechanisms are being increasingly          auto-configuration, defining the use of DNS SRV records to
adopted. However, the security implications of these mechanisms,
both in terms of implementation and deployment, have not yet
                                                                         locate email submission and access services. In a typical login
been thoroughly studied. In this paper, we present the first             scenario that supports auto-configuration, server administrators
systematic analysis of security threats associated with email            publish configuration information on web servers. The client
auto-configuration and evaluate their impacts. We summarize 10           requests this configuration information by constructing specific
attack scenarios, covering 17 defects (including 8 newly identified      URLs using the user’s email address. Then, it establishes a
ones), along with 4 inadequate client UI notifications. These            connection with the mail server based on the server hostname,
attack scenarios can either cause a victim to connect to an              port, and connection type parameters in the configuration
attacker-controlled server or establish an insecure connection,          information.
putting the victim’s credentials at risk. Moreover, our large-scale
measurements and in-depth analysis revealed serious insecurity of            Although auto-configuration mechanisms significantly im-
auto-configuration applications in the wild. On the server-side, we      prove the usage convenience of email clients, they also in-
discovered 49,013 domains, including 19 of the Top-1K popular            troduce new attack vectors for the email system. Recent
domains, were misconfigured. On the client-side, 22 out of 29            studies [56], [8] have identified flawed Autodiscover imple-
clients were vulnerable to those threats. Moreover, 27 out of 29         mentations, which can cause email users to inadvertently
clients exhibited at least one UI-notification defect that facilitates
silent attacks. These defects arise from misconfiguration, mis-
                                                                         connect to attacker-controlled servers, thereby exposing their
management, flawed implementation and compatibility. We hope             credentials. To the best of our knowledge, no research has
this paper raises attention to email auto-configuration security.        been done to systematically analyze the security of email
                                                                         auto-configuration mechanisms and evaluate their real-world
                       I.    I NTRODUCTION                               impacts. While some threats have been discussed in the non-
                                                                         academic community [23], [14], they focus mainly on proto-
   Email has emerged as a crucial communication chan-                    col design and lack practical evaluation. Furthermore, auto-
nel globally [16]. Email clients are widely used for their               configuration remains an area without harmonized standards.
customization options and convenience, with 57.8% of all                 Microsoft’s Autodiscover and Thunderbird’s Autoconfig serve
emails opened through mobile or desktop clients in 2021 [36].            merely as industry references. Email vendors may imple-
However, email clients typically require users to specify the            ment their own defined or customized mechanisms, such as
configuration information of the mail server (e.g., hostname,            built-in lists, heuristic guessing, and default settings. Those
port number, connection type) and establish a connection                 mechanisms remain unclear to the public, and the security
with the target server based on the above parameters. This               implications are also understudied.
complicates the login process and impairs usability.
                                                                         Question. Our investigation is guided by two questions: What
   To improve the usability of email clients, Microsoft and              security threats exist in email auto-configuration? If defects
Thunderbird proposed their auto-configuration mechanisms,                are present, how extensive is their impact on email services?
Autodiscover [46] and Autoconfig [51] in 2007 and 2008,                  We focus our exploration on the standard email protocols
                                                                         (i.e., IMAP, POP3, and SMTP), with an emphasis on potential
  BCorresponding author.
                                                                         threats that could facilitate user credentials theft. In this
                                                                         paper, we define the web server as the entity responsible
                                                                         for publishing the configuration file to the client, and the
Network and Distributed System Security (NDSS) Symposium 2025            mail server as the server to which the client is expected
24-28 February 2025, San Diego, CA, USA
ISBN 979-8-9894372-8-3                                                   to log in. In a client-server communication scenario with
https://dx.doi.org/10.14722/ndss.2025.241078                             auto-configuration, we identified two key security factors: (1)
www.ndss-symposium.org                                                   the transmission of configuration information from the web
server to the client should be secured, and (2) the setting of                 Table I: Protocols and ports for email services.
configuration parameters should enforce a secure connection
(e.g., STARTTLS or implicit TLS) between the client and the                Protocol Port Defined in         Service          Implicit TLS
mail server. These factors correspond to two types of attacks
presented in our threat analysis.                                                     25     [63]     Relay and submission       No
                                                                            SMTP     587     [29]                                No
                                                                                                          Submission
Approach. To comprehensively assess security issues of email                         465     [50]                                Yes
auto-configuration, we analyzed potential threats and identified                     143     [19]                                No
defects in both servers and clients. Then, we conducted a large-            IMAP                            Access
                                                                                     993     [50]                                Yes
scale inspection of servers across 1,053,469 domains and 29
email clients on 5 operating platforms to evaluate the real-                         110     [55]                                No
                                                                            POP3                            Access
                                                                                     995     [50]                                Yes
world impact of these threats.
Findings. The auto-configuration process consists of two
phases: (1) configuration information retrieval, and (2) param-         • We conducted extensive measurements of auto-configuration
eter parsing and application. We analyze two threats (or attack           to evaluate the real-world impact of these threats, revealing
goals) in these two phases: victims connecting to attacker-               widespread flaws in server deployments and client imple-
controlled servers (Type-I) and leaking credentials (Type-II).            mentation, and discussing the root causes of the flaws.
Based on different attacker capabilities, we summarize 10
attack scenarios on these goals, with 8 newly identified defects.                             II.     BACKGROUND
    Our extensive experiments demonstrated that current email           A. Email Submission and Access
auto-configurations in the wild exhibit general defects on both
the server and client sides. Among the 1M domains tested,                   An email system consists of several components [22]
79,212 supported at least one auto-configuration mechanism.             that collaborate to send and receive email messages. Email
Of these domains, 61.88% (49,013) domains were misconfig-               submission [30] and access refer to the interactions between
ured. 55.0% (43,566) had defects leading to Type-I threats,             users and servers, while email relay involves the store-and-
such as delivering configuration files via plaintext HTTP               forward transmissions of messages between mail servers.
connections, allowing attackers to tamper with configurations               Simple Mail Transport Protocol (SMTP) [39] plays a
and redirect the email connections to servers they controlled.          vital role in transmitting messages across the Internet. Email
Meanwhile, 14.93% (11,824) of domains were affected by                  submission is a communication between a Mail User Agent
Type-II threats, including defects of configuration (e.g., in-          (MUA), which is also known as an email client (e.g., Thun-
correct parameter settings) and management (e.g., inconsistent          derbird), and a Mail Submission Agent (MSA). The MSA is
parameters among mechanisms), which downgrade the security              responsible for posting a message to the outgoing server, which
of connections to mail servers. 19 popular domains in the Top-          then delivers the message to the intended recipient through
1K list, including well-known vendors like Yandex and Onet,             email relay. Although both submission and relay use SMTP,
suffered from these issues.                                             the standard [29] specifies different ports for each service.
    In the client experiments, we tested 29 clients across 5 op-        Internet Message Access Protocol (IMAP) [19] and Post Office
erating platforms. Of these, 22 clients, including Thunderbird          Protocol v3 (POP3) [55] are email protocols for accessing
and Outlook, are affected by at least one threat. Specifically,         messages on servers.
13 clients were susceptible to Type-I threats, potentially con-
necting users to attacker-controlled servers. 19 clients were           B. STARTTLS and Implicit TLS
vulnerable to Type-II threats, resulting in connection down-
grades. Further, we examined client UI designs and found that               Email protocols like SMTP, IMAP, and POP3 were orig-
21 clients did not seek user confirmations when obtaining con-          inally designed without encryption, leaving data potentially
figurations, enabling silent attacks. We also identified client-        exposed. STARTTLS [33] was proposed to compensate for this
side defects that could leak user credentials on a server without       design weakness, which allows upgrading insecure connections
auto-configuration mechanisms. For instance, Nextcloud Mail             to secure ones on existing ports (i.e., 587, 143, and 110). Im-
did not verify domain formats when constructing configuration           plicit TLS, however, mandates encryption from the beginning
request URLs, mistakenly connecting to domains that could be            of the connection without requiring an explicit command to
registered by attackers. This defect could result in users from         initiate it. As it relies on dedicated ports (i.e., 465, 993, and
at least 24,149 domains being hijacked to attacker-controlled           995), it ensures that all data transmitted over the connection
servers. We have extensively reported to affected clients and           is encrypted by default, reducing the risk of transmitting data
servers, and some of them have confirmed and fixed related              in plaintext and eliminating attacks against STARTTLS [62].
issues (see Section VIII-C for details).                                Table I lists well-known ports of SMTP, IMAP, and POP3.
Contributions. Our main contributions include:                              Several security issues with STARTTLS [33], [57], [78],
                                                                        [40], [62] have been disclosed. The command injection vul-
• We systematically analyzed email auto-configuration defects           nerability (CVE-2011-0411) [78], which was first discovered
  across protocol design, server deployment, and client im-             in 2011, allows attackers to inject plaintext content into the
  plementation. We summarized 10 attack scenarios with 8                TCP packet containing the STARTTLS command, leading the
  new defects and 4 UI issues that resulted in connecting to            server to misinterpret it as part of the TLS session. The
  attacker-controlled servers or leaking credentials.                   primary cause of this vulnerability is that servers mishandle

                                                                    2
the state transition from unencrypted to encrypted commu-
nications, making plaintext commands buffered alongside the                                                                                 autodiscover.xml
STARTTLS negotiation. The complexity of STARTTLS makes                                                                        Web Server
it error-prone to implement, and implicit TLS is recommended                                         2
to be prioritized over STARTTLS for secure connections [50].                       Built-in list                                      1     config-v1.1.xml




C. Related Work                                                                                                   4   SMTP
                                                                                    Heuristic
                                                                                    guessing                      IMAP/POP3
Mismanagement of email protocol deployments. Measure-                                              Email Client               Mail Server
ment studies on the deployment of email protocols have been
                                                                                                                                      1
conducted, including sender authentication (e.g., SPF, DKIM,                         Default         2
                                                                                     setting
and DMARC) [28], [26], [11], [80], [10], [75], transport                                                                                          SRV
                                                                                        3
encryption (e.g., TLS, DANE, and MTA-STS) [28], [26], [34],
                                                                                                                                              SRV Record
[45], [43], [42], [74], [13] and end-to-end encryption (e.g.,                                                                 DNS Server

S/MIME and OpenPGP) [73]. A significant proportion of                                        Figure 1: Email auto-configuration.
SPF policies were found to be overly broad [26], weakening
their intended protections, while the use of the include
mechanism in SPF records has brought excessive DNS lookups              placing configuration files at specified URLs or by adding
during SPF evaluation [11]. Misconfigurations have also been            SRV [32] records to DNS. 2) When a user enters an email
found in the DKIM deployment, such as weak keys and signa-              address, the client that supports auto-configuration generates a
tures [80]. Recently, researchers analyzed the DMARC report-            list of candidate URLs based on the email address and attempts
ing mechanism and revealed that 26% of DMARC records with               to retrieve server configurations from these URLs. The client
external domains lacked proper authorizations, making them              can also query SRV records to obtain these settings. 3) If
vulnerable to reflection attacks [10]. On transport encryption          configurations are unavailable, the client resorts to a built-in
protocols, researchers analyzed the usage of TLS in email               list containing the settings of popular providers or heuristically
ecosystems for the entire IPv4 address space. They discovered           guesses the settings. If this fails, the client usually fills in some
that a large percentage of emails were transmitted unencrypted,         default parameters (e.g., the connection type) and prompts the
leaving content vulnerable to interception [34], [45]. Finally, a       user to enter the hostname manually. 4) After the user confirms
study on email encryption adoption at a university revealed that        the settings, the client uses them to log in to the mail server.1
only 0.06% of over 80M emails were encrypted, and 32.99%
of PGP keys lacked expiration dates [73]. Our work focuses              A. Autodiscover
on the deployment of email auto-configuration mechanisms,                   Autodiscover was first introduced in Exchange for Outlook
identifying security issues in configuration and management.            [46] and later extended to support others. This paper focuses on
Attacks on email mechanisms. Recent work has exposed                    Autodiscover for standard email protocols [47], [48]. Accord-
various exploitable vulnerabilities in email security protocols,        ing to the specification [48], Autodiscover requires a client to
including authentication bypass [44], [70], [17], [35], creden-         send an HTTP POST request with the email address for which
tial theft [62], signature spoofing [52] and even the decryp-           the configuration information will be retrieved. The Autodis-
tion of encrypted contents [38], [61], [53]. For example, the           cover response contains configuration information related to
difficulties in detecting and mitigating spoofing attacks, make         the mail server, including settings for IMAP, POP3, and SMTP
forged emails difficult to handle [35]. Additionally, weaknesses        services. For example, the connection type parameter (i.e.,
in S/MIME and OpenPGP email signature verification leave                SSL or Encryption element) specifies whether encryption
70% of the tested clients susceptible to forgery attacks [52].          is required to connect to servers (more details in Appendix A).
A novel attack technique called malleability gadgets [61] was               A client that supports Autodiscover performs as below:
introduced to exploit CBC and CFB modes in S/MIME and                   it firstly constructs a list of Autodiscover URLs based on
OpenPGP encryption, enabling the exfiltration of plaintext              the email address entered by a user [47]; then, the client
through backchannels, and such vulnerabilities were found in            sequentially requests each URL until it successfully obtains the
23 S/MIME and 10 OpenPGP clients.                                       configuration information. Table II shows an example and the
    Poddebniak et al. [62] performed the first structured anal-         user’s email address is user@example.com, patterned as <local
ysis of STARTTLS and uncovered over 40 issues that could                part>@<domain part> [20]. The client initially extracts the
be exploited to steal users’ login credentials. They developed          domain part (marked in red) and constructs an ordered list
a test tool and identified over 300,000 hosts vulnerable to the         of candidate URLs. The client then sends POST requests to
command injection. They concluded that STARTTLS should                  the URLs listed in Steps 1 or 2 to retrieve the configuration
be replaced with implicit TLS. Our work applied this conclu-            information. If the previous requests fail, in Step 3 the client
sion to the threat analysis of email auto-configuration.                queries the SRV record to obtain the destination hostname
                                                                        (e.g., target.com) of the Autodiscover server. The client then
            III.   E MAIL AUTO - CONFIGURATION                          constructs a new URL using that hostname (marked in blue)
                                                                        and sends a POST request. Finally, in Step 4, if all preceding
    Email auto-configuration automates the configuration pro-           attempts fail, the client sends an insecure (non-SSL) GET
cess in email clients that retrieves server settings, thus sim-         request to the URL from Step 2. If the server responds with a
plifying email account setup for users. Figure 1 shows the
typical workflow of email auto-configuration. 1) Email ad-                 1 In this paper, the discussion of mail servers is limited only to those involved
ministrators first publish server configuration information by          in the processes of email submission and access, excluding email relay.


                                                                    3
                              Table II: An example of configuration information retrieval via Autodiscover.

           Step                                 Candidate URL                                             Request method
              1               http://example.com/autodiscover/autodiscover.xml                              HTTP POST
              2       https://autodiscover.example.com/autodiscover/autodiscover.xml                        HTTP POST
            3.1       autodiscover. tcp.example.com. IN SRV          0 0 443 target.com.      DNS SRV request for Autodiscover server
            3.2                https://target.com/autodiscover/autodiscover.xml                             HTTP POST
              4       http://autodiscover.example.com/autodiscover/autodiscover.xml        HTTP GET for initial request, POST for redirection


                               Table III: An example of configuration information retrieval via Autoconfig.

          Step                                          Candidate URL                                         Request method
             1    https://autoconfig.example.com/mail/config-v1.1.xml?emailaddress=user@example.com              HTTP GET
             2                https://example.com/.well-known/autoconfig/mail/config-v1.1.xml                    HTTP GET
             3                        http://autoconfig.example.com/mail/config-v1.1.xml                         HTTP GET
            ∗4                        https://autoconfig.thunderbird.net/v1.1/example.com                        HTTP GET
           5.1                        example.com. IN MX         0 mx.backoff.target.com.               DNS MX request for mail provider
           5.2 https://autoconfig.backoff.target.com/mail/config-v1.1.xml?emailaddress=user@example.com          HTTP GET
           5.3     https://autoconfig.target.com/mail/config-v1.1.xml?emailaddress=user@example.com              HTTP GET
          ∗5.4                    https://autoconfig.thunderbird.net/v1.1/backoff.target.com                     HTTP GET
          ∗5.5                         https://autoconfig.thunderbird.net/v1.1/target.com                        HTTP GET
             6                    %USER CONFIGURATION DIR%/isp/example.com.xml                                  Local import
           ∗
               Retrieve configuration information through the public centralized database ISPDB [3], which maintained by Thunderbird.


302 redirect, the client then attempts to resend an HTTP POST                         Table IV: SRV labels for email submission and access.
request to the URL specified in the Location header of the
response. The specification [47] suggests that this step should                        Service label    Port       Alias         Encryption support
only be used for redirection and not for querying settings.
                                                                                       submission. tcp 587     SUBMISSION
B. Autoconfig                                                                             imap. tcp    143        IMAP    Plaintext or STARTTLS
                                                                                          pop3. tcp    110        POP3
    Although Autoconfig [15] has been proposed for over a
                                                                                      submissions. tcp 465 SUBMISSIONS
decade, formal specifications are still not finished. We refer                           imaps. tcp    993    IMAPS                     implicit TLS
to the only known authoritative source, the draft “Mail Au-                              pop3s. tcp    995    POP3S
toconfig” [14], to explain its workflow. Unlike Autodiscover,
Autoconfig allows the client to use the email address directly
as a query parameter in an HTTP GET request. The Autoconfig                       6, when the client cannot retrieve the configuration through the
response also contains a socketType element that specifies                        above requests, it can read a specific directory on the local disk
whether encryption is required (see Appendix A for details on                     to check for the presence of a configuration file.
the Autoconfig response elements).
                                                                                      Note that some of the candidate steps (i.e., Step 4 and Steps
    Table III shows an example of Autoconfig workflow, with                       5.4-5.5) actually retrieve the configuration information from
each step ordered by priority. In Steps 1-3, the client extracts                  the ISPDB. In this paper, we consider the ISPDB to be a kind
the domain part (i.e., example.com) of the email address and                      of “built-in provider list” (another auto-configuration mech-
constructs an order list of candidate query URLs. The client                      anism discussed in Section III-D). Therefore, we excluded
then sends HTTP GET requests for each URL in the list. To                         these steps in the subsequent analysis related to Autoconfig,
allow mail providers to provide user-specific configurations,                     and analyzed the configuration information of the ISPDB
the full email address may be included as a query parameter                       separately in Section VII (A8.1).
(e.g., the URL in Step 1). In Step 4, the client accesses a pub-
lic centralized database ISPDB [3], to retrieve configuration
information for most mail providers.                                              C. SRV Record for Locating Services
     If all of the above steps fail, Autoconfig provides a fallback                    DNS SRV resource records (RR) [32] are widely used to
mechanism. In Step 5, the client reconstructs requests based                      locate servers for specific services. RFC 6186 [23] and RFC
on the MX hostname (marked in blue) of the email domain.                          8314 [50] define the use of SRV records for locating email
Since MX hostnames may have multiple levels of subdomains,                        submission and access services without the “auto-discover”
Autoconfig provides two mechanisms for extracting the input                       process (e.g., Autodiscover or Autoconfig) as described above.
to construct the candidate URLs: 1) the parent domain of                          Table IV lists all the SRV service labels for email submission
the MX hostname (i.e., %MXFULLDOMAIN%), 2) the effective                          and access. Since a domain may have multiple mail services,
second-level domain (i.e., eTLD + 1) of the MX hostname                           the query name (QNAME) of an SRV record is a combination
(i.e., %MXMAINDOMAIN%). For example, the %MXFULLDO-                               of the service (e.g., IMAP, POP3, or SUBMISSION), protocol
MAIN% of mx.backoff.target.com is backoff.target.com and the                      (i.e., TCP or UDP), and domain name. For example, to request
%MXMAINDOMAIN% is target.com. Here, we refer to [8] and                           an SRV record for an IMAP server of example.com, QNAME
define this query process as a “back-off” query. Finally, in Step                 is formatted as _imap._tcp.example.com.

                                                                              4
     The SRV response contains one or more SRV RRs, each of             Steal the victim’s credentials, such as passwords. We explain
which consists of the following fields (details in [32]): Pri-          these attackers’ capabilities as below:
ority, Weight, Port, and Target. The Priority and
Weight fields determine the order of preference among the               Type-I Attacker. Such attackers target the auto-configuration
listed servers. Servers with lower Priority values are more             process, where various request methods are used to retrieve
preferred, while among servers with the same Priority,                  configuration information that determines which mail servers
those with higher Weight values are preferred.                          a client connects to. A Type-I attacker requires one of the fol-
                                                                        lowing capabilities, depending on the client’s request method:
                                                                        (1) Tampering with TCP packets, on-path attackers (e.g., those
D. Built-in Provider Lists                                              sharing a WiFi network) can modify TCP packets to alter
    Clients may contain a built-in list of configuration informa-       configuration information transmitted in plaintext; (2) Domain
tion for popular providers. The sources of these settings include       squatting, attackers can register and control domains that are
actively searching and discovering from the Internet [9], email         used in the auto-configuration process. These domains often
development frameworks [6], or central databases maintained             appear unrelated to mail services, making them overlooked by
by third parties (e.g., ISPDB [3]). When a client cannot retrieve       administrators.
settings for a domain through real-time queries, it refers to           Type-II Attacker. Type-II attackers focus on the connection
built-in lists to retrieve settings.                                    between a client and the mail servers after configuration
                                                                        information has been retrieved from the web server. Depending
E. Heuristic Guessing and Default Settings                              on whether the connection is plaintext or encrypted, a Type-
     Clients may use heuristic methods to guess the mail server         II attacker requires one of the following capabilities: (3)
settings, typically by prefixing the domain name with a relevant        Sniffing, on-path attackers can steal credentials by sniffing
protocol (e.g., “smtp”, “imap” or “pop3”) and attempting to             traffic; (4) Delaying or dropping packets, attackers can disrupt
connect to the constructed hostname via common ports (as                connections by dropping packets; (5) Hacking STARTTLS, an
listed in Table I). Clients that only assist users in filling out       attacker who can tamper with TCP packets as in Capability
hostnames on login forms, without connection attempts (e.g.,            (1), can inject plaintext contents into TCP packets sent to vul-
Gmail and iOS Mail), are excluded from this definition.                 nerable servers (e.g., CVE-2011-0411), allowing them to steal
                                                                        credentials. Details about hacking STARTTLS are discussed
   If none of the above mechanisms return settings, a user              in Section II-B.
has to manually enter the hostname and other configuration
parameters. In such cases, most clients preset the default              B. Attack Scenarios and Cases
value for connection type (e.g., STARTTLS) and authentication
method (e.g., password-cleartext) to minimize the user’s input.             Building on the above threat analysis and attacker capabil-
                                                                        ities, we summarize 10 possible attack scenarios in Table V,
          IV.   ATTACK A NALYSIS AROUND E MAIL                          each containing one or more specific attack cases. An attack
                   AUTO - CONFIGURATION                                 scenario refers to a category of cases that follow the same
                                                                        attack pattern, while a case (denoted as Ai.j) is a specific
    In this section, we analyze the security of communications          attack vector that may arise from configuration or management
between clients and servers that support auto-configuration             defects on servers or implementation defects on clients. In each
from two perspectives: (1) Is the configuration information             attack scenario, either the client or the server has a defect,
transmitted securely? For example, through an encrypted                 and sometimes both are necessary, as in A4. We also indicate
HTTPS connection. (2) Does the server-provided configuration            which mechanisms are vulnerable to these attack scenarios. For
instruct the client to establish secure connections with a              scenarios related to the Type-II attacks, we defined two levels
mail server? For example, setting the connection type to an             of downgrade: (1) the server configuration information allows
encrypted option. For the former, attackers could potentially           encrypted-only (i.e., implicit TLS) or STARTTLS connection
tamper with the configuration information; for the latter, they         type, but the client uses plaintext; (2) the server configuration
could sniff the connections to mail servers.                            information includes encrypted-only connection type, but the
    Starting from these two aspects, we analyzed the detailed           client uses STARTTLS. Depending on the result of the down-
steps of each email auto-configuration mechanism, including             grade, the capabilities required for an attacker vary. In the first
(1) configuration published by a web server, (2) configuration          case, the attacker only needs to sniff packets. In the second,
retrieved and parsed by a client, and (3) configuration applied         the attacker must hack STARTTLS.
to clients. We analyzed potential threats at each step based on             While some attack scenarios have been discussed from a
various possible attacker capabilities and outlined each attack         protocol design perspective in the non-academic community
scenario. Then, for every auto-configuration mechanism, an              (e.g., A1 in the Autoconfig draft [14]), our analysis also
attack scenario is instantiated into specific attack cases. We          considers attacks caused by client implementation and server
also conducted proof-of-concept experiments for some attack             deployment. Overall, we identified 7 new cases (involving
scenarios, demonstrating practical attack cases.                        8 defects, marked with ⋇ in Table V) that have not been
                                                                        discussed before. We categorize these attack scenarios into four
A. Threat Model                                                         groups.
    We assumed an attacker with two goals: (Type-I) Induce a                1) Broken external connection for configuration informa-
victim user to connect to attacker-controlled servers, enabling         tion retrieval: Autodiscover and Autoconfig request configu-
the manipulation of the victim’s mailbox, and/or (Type-II)              ration files using specific URL formats. The security of these

                                                                    5
                                                               Table V: Attack scenarios of email auto-configuration.
                                                                                                                   Attack                                                                                   Server defect5
     Attack goal                            Attack scenario                             Attacker capability               Applicability4                       Client defect5
                                                                                                                    case3                                                                            Web                            DNS
                                                                                                                     A1.1     AC                           Plain request                        Plain response6                      ∅
Type-I: Connecting to                                                            Tampering with
 attacker-controlled
                      A1: Client requests configuration information in plaintext
                                                                                 TCP packets                         A1.2     AD                           Plain request                        Plain response6                      ∅
        servers                                                                                                    ⋇A1.3    AC/AD                               ∅                           Redirection to HTTP                      ∅
                      A2: Client does not enforce eTLD verification              Domain squatting                  ⋇A2.1      AC                      Inadequate eTLD check                           ∅                              ∅
                                                                                 Sniffing                            A3.1   AC/AD                               ∅                           Plain-only connection                    ∅
                       A3: Server sets only the plaintext connection type          Sniffing or                                                                                                                             Plain or
                                                                                                                      A3.2          SR                               ∅                                ∅
                                                                                   hacking STARTTLS1                                                                                                                  STARTTLS connection
                       A4: Client fails to parse and defaults to plaintext          Sniffing                       ⋇A4.1    AC/AD    Plain fallback on parser error                      Incorrect connection type             ∅
      Type-II:         A5: Client fails to auto-configure and defaults to plaintext Sniffing                        A5.1 AC/AD/SR/BL          Plain default                                          ∅                         ∅
 Leaking credentials   A6: Client implements Autodiscover inadequately                                             ⋇A6.1     AD      Ignoring Encryption element                                     ∅                         ∅
                       A7: Client prioritizes SRV records incorrectly                                              ⋇A7.1     SR       Non-compliant SRV sorting                                      ∅                         ∅
                                                                                    Sniffing or
                       A8: Client maintains an outdated built-in list.                                             ⋇A8.1     BL          Outdated built-in list                                      ∅                         ∅
                                                                                    hacking STARTTLS2
                                                                                                                    A9.1                                                                             ∅               Insecure SRV priority
                       A9: Server prefers insecure connection type                                                                                 ∅
                                                                                                                    A9.2                                                                Insecure connection priority           ∅
                                                                                   Delaying or dropping packets        AC/AD/SR/BL
                       A10: Server sets inconsistent connection type               and, sniffing or             ⋇A10.1                                               ∅                               Inconsistent connection types
                                                                                   hacking STARTTLS2
 1
   When the server adds only SRV records for non-encrypted-only services, the capability required for an attacker depends on client implementations.
 2
   When a downgrade occurs, the capability required for an attacker depends on the downgrade result.
 3
   ⋇ Newly identified cases.
 4
   AC - Autoconfig. AD - Autodiscover. SR - SRV service discovery. BL - Built-in lists.
 5
   ∅ means no defect with the client implementation or server deployment in the corresponding scenario.
 6
   In A1.1 and A1.2, only client defect is required. Whether or not the server returns a plain response is irrelevant since a MITM attacker can manipulate the response.




connections depends on the use of TLS protocol [66], [65].                                                         • The MX hostname for example.com is an eTLD + 1 (e.g.,
Any data transmitted over plaintext HTTP is vulnerable to                                                            provider.co.uk).
modification by manipulator-in-the-middle (MITM) attackers                                                         • The attacker (can and) has registered autoconfig.co.uk.
and should be avoided. Additionally, clients must verify that
the query URLs are properly formatted; otherwise, they may                                                         When the user enters their email address, the client first
connect to incorrect or irrelevant domains. Security threats                                                       extracts example.com and constructs the query URL based on
related to DNS resolution (e.g., cache poisoning or hijacking)                                                     Steps 1-4 in Table III. If the query fails, the client queries the
are not considered, as they pertain to the DNS system itself                                                       MX record for example.com and extracts the parent domain of
and are not specific to email auto-configuration (see Section                                                      the MX hostname to construct a new URL (detailed in Sec-
VIII-D for more discussions).                                                                                      tion III-B). At this point, if the client does not verify whether
                                                                                                                   the extracted hostname is a TLD and queries autoconfig.co.uk,
A1: Client requests configuration information in plaintext.                                                        it could connect to an attacker-controlled server.
When the configuration file is transmitted in plaintext, an
attacker can modify the Server or hostname element to                                                                              admin@example.com
                                                                                                                                                                                   HTTP Request:                      example.com
                                                                                                                                                                    https://autoconfig.example.com/mail/config-
a fake server, causing the victim to send credentials directly                                                                                                      v1.1.xml?emailaddress=admin@example.com
                                                                                                                                                                                          …
to the attacker. Based on the request paths in Tables II and                                                                       Construct candidate list                                                            Web Server
                                                                                                                       Victim                                               404 Status, no config found.
III, we consider whether the client sends plain requests and                                                                                                              DNS MX Request: example.com
                                                                                                                                                                                                                     ns.example.com


whether the server transmits configuration information over                                                                            DNS MX Query
                                                                                                                                                                  DNS Response: example.com MX provider.co.uk
                                                                                                                                                                                                                       DNS Server
an unencrypted connection, and identify two distinct cases for                                                      Email Client                                                    HTTP Request:                    autoconfig.co.uk
                                                                                                                                                                         https://autoconfig.co.uk/mail/config-
Autoconfig (A1.1) and Autodiscover (A1.2). We also found a                                                                                                          v1.1.xml?emailaddress=admin@example.com
                                                                                                                                                                                           …
third case where the server redirects HTTPS client requests                                                                        Back-off MX, construct
                                                                                                                                       candidate list                                                                  Web Server
                                                                                                                                                                              200 Status, config found.
to HTTP (A1.3). In A1.1 and A1.2, as long as the client-                                                                                 Autoconfig
                                                                                                                                                                                                                             Register autoconfig.co.uk


side defect exists (i.e., sending HTTP requests), a MITM                                                                                                      * OK [CAPABILITY IMAP4rev1 AUTH=PLAIN] Dovecot ready
                                                                                                                                                                                                                         Attacker
attacker can tamper with the configuration regardless of the                                                                                                  V LOGIN admin passwords
                                                                                                                                                              …
server’s responses. Nevertheless, since the protocol (e.g., Au-
todiscover [47], [48]) requires servers to respond over HTTPS                                                            Figure 2: An example of the back-off query attack (A2).
even to plaintext requests, we also treat plaintext responses
from the server as a server-side defect (related but unnecessary)
                                                                                                                       2) Insecure parameter settings and parsing: Configuration
for this attack.
                                                                                                                   files list the services supported by the server and the specific
A2: Client does not enforce eTLD verification. Autoconfig                                                          parameter settings associated with those services, which clients
allows clients to request configuration files from the mail                                                        rely on to establish a connection (we provide detailed param-
provider. As detailed in Step 5 of Table III, a client generates                                                   eter definitions in Appendix A). For instance, the connection
multiple candidate URLs based on the MX hostname. If the                                                           type is determined by the SSL and Encryption elements
client fails to verify whether the extracted %MXFULLDOMAIN%                                                        in Autodiscover and the sockettype element in Autoconfig.
or %MXMAINDOMAIN% is an eTLD, it may mistakenly use                                                                Besides the parameters in configuration files, the service labels
the TLD as the domain name to construct the URLs. This                                                             in SRV queries (as shown in Table IV) can also be used
allows attackers to register domains like autoconfig.tld in bulk                                                   to distinguish between encrypted-only [50] and STARTTLS
to gain control of these domains. As shown in Figure 2, for an                                                     connections [23]. In this paper, we focus on parameters related
email address admin@example.com, the following conditions                                                          to the connection type (i.e., whether encryption is used), and
are required for this attack:                                                                                      ignore others.
• example.com has not deployed Autoconfig.                                                                         A3: Server sets only the plaintext connection type. When a

                                                                                                              6
server sets only the plaintext connection type in the configura-                          admin@example.com                       HTTP GET Request:                       example.com

                                                                                                                     https://autoconfig.example.com/mail/config-
tion file (e.g., socketType set to plain), a client establishes                                                      v1.1.xml?emailaddress=admin@example.com

an unencrypted connection, allowing attackers to steal creden-                Victim
                                                                                           Autoconfig Query 1
                                                                                                                                             Drop packet                  Web Server


tials through traffic sniffing (A3.1). For SRV service discovery,                                                                 HTTP GET Request:                       example.com
                                                                                                                https://example.com/.well-known/autoconfig/mail/config-
if a server does not add records for implicit TLS services,                                                            v1.1.xml?emailaddress=admin@example.com

                                                                                           Autoconfig Query 2
it implies that it supports plaintext and/or STARTTLS. In                  Email Client                                                      Drop packet                   Web Server

                                                                                                                                                                          example.com
such cases, it is up to the client implementation to decide                                                                       HTTP POST Request:
                                                                                                                https://autodiscover.example.com/autodiscover/autodisc
                                                                                                                                        over.xml
which connection type to use for the connection. We consider
                                                                                           Autodiscover Query
such servers as insecure if they only add SRV records for                                  Auto-configuration
                                                                                                                               200 Status, config found.
                                                                                                                                                                          Web Server

                                                                                                                                                                          example.com
services without implicit TLS (A3.2). If a client connects using
plaintext, attackers can steal credentials through traffic sniffing.                                                          Downgraded connection
                                                                                                                                                                          Mail Server
Even if the client upgrades the connection using STARTTLS,
attackers may further hack STARTTLS.                                       Figure 3: An example of a downgrade attack exploiting incon-
A4: Client fails to parse and defaults to plaintext. Server                sistent server configuration information (A10).
administrators must correctly set the SSL, Encryption, or
socketType elements in the configuration file [48], [14].                  indicate preferred services using the Priority and Weight
If the client cannot interpret a value (e.g., SSL is set to                fields in SRV records.
starttls, which is a valid Autoconfig setting but invalid in
                                                                           A9: Server prefers insecure connection type. If a server sets
Autodiscover), it may initiate a plaintext connection by default.
                                                                           STARTTLS or plaintext as the first option, followed by implicit
A5: Client fails to auto-configure and defaults to plaintext.              TLS, a compliant client will never establish a connection with
If a client cannot retrieve the server’s configuration through             the highest security strength. While server administrators may
external requests, built-in lists, or heuristic guessing, it typi-         prioritize STARTTLS for compatibility reasons, this is discour-
cally defaults to pre-set parameters for user convenience, only            aged in the context of email submission and access [62] and
requiring the user to enter the hostname. In cases where the               is not recommended by RFC standards [25], [50]. Therefore,
client defaults to a plaintext connection type, users (especially          we also consider it a security defect.
those unfamiliar with security) may accept the insecure default
settings, risking credentials exposure.                                        4) Inconsistency of configuration information across and
                                                                           within mechanisms: Clients often support multiple mecha-
A6: Client implements Autodiscover inadequately. Autodis-                  nisms simultaneously to enhance user experience. As described
cover introduces an Encryption element, which overrides                    in Section III, clients may prioritize certain mechanisms (e.g.,
the SSL element. A properly implemented client should check                prefer Autoconfig over Autodiscover), and there is also an
for Encryption first and choose the connection type ac-                    internal priority order for URL paths within a single mech-
cordingly. If a server sets the Encryption element but                     anism. Since these mechanisms differ in URL structures and
leaves SSL unset, the client that does not strictly follow                 configuration file definitions, it is crucial for administrators
the specification and ignores the Encryption element may                   to ensure that configuration information is consistent across
default to a plaintext connection. In this case, even if the server        all mechanisms. Specifically, considering the connection type
is correctly configured, the client’s faulty implementation leads          settings, inconsistencies in the security strength between mech-
to a downgrade.                                                            anisms can lead to a downgrade to less secure connections.
A7: Client prioritizes SRV records incorrectly. Clients                    A10: Server sets inconsistent connection types. If a server
supporting SRV records for auto-configuration must prioritize              sets different security strengths for connection types across
records correctly according to the standard [32]. If a server pri-         various auto-configuration mechanisms, an attacker could ex-
oritizes more secure options (e.g., favoring implicit TLS over             ploit this by delaying or dropping TCP packets, causing the
plaintext or STARTTLS) and correctly sets the Priority                     client to retrieve only the configuration with the least security
and Weight values for different services, a client incorrectly             strength. For example, as shown in Figure 3, this attack could
implementing the SRV record sorting may mistakenly select a                occur if an administrator sets implicit TLS for all Autoconfig
service with a higher, and therefore less preferred, Priority              configuration files but forgets to update the Autodiscover files,
value. This flaw in SRV record prioritization could lead to con-           which still use plaintext. If the client prioritizes Autoconfig
nections being established over less secure channels. Similar              and sends Query 1 and Query 2 to the server, a MITM attacker
to A3, the capabilities required for an attacker depend on how             could disrupt these requests by dropping packets. The client
a client processes SRV records.                                            would then fall back to an Autodiscover query, retrieving a
A8: Client maintains an outdated built-in list. When a client              configuration file with a plaintext connection type. As a result,
cannot retrieve configuration files in real time through external          the client would establish an insecure connection, allowing the
requests, it relies on a built-in list of providers. If this list is       attacker to steal credentials through traffic sniffing, effectively
outdated, the client may fail to establish a connection using              downgrading the connection from encrypted to plaintext.
the latest settings.
                                                                           C. Inadequate UI Notifications
     3) Discouraged priority settings for services: Configura-
tion files can contain settings for multiple services (e.g.,                   We analyzed the UI notifications related to various auto-
IMAP and POP3), and the order in which these services                      configuration mechanisms. In particular, a defect concerning
appear implies their priority. Clients typically prioritize the            user confirmation affects all the scenarios mentioned above and
first service listed. Additionally, RFC 6186 allows servers to             increases the likelihood of successful attacks. For instance, an

                                                                       7
                                                                                            Free-email                                           Connection
                                                                        GOV                              Autodiscover                 HTTP
                                                                                             provider                Autoconfig                     type
                                                                                                                                     request
                                                                          Bank                            DNS                                       Priority
                                                                                             Top100                                  Incorrect
                                                                                                          SRV                       Parameter         …
                                                                                 Tranco1M                                                                           Servers

                                                                        Download domain lists            Collect configuration     Analyze configuration
                                                                                                              information              information




                                                                                                          Extract built-in lists



                                                                                                                  Autoconfig
                                                                                                                 Autodiscover
                                                                                                                   DNS SRV                                          Clients
                                                                                                                Default settings

                                                                         Select email clients             Analyze client defects                               Evaluate impacts


Figure 4: UI notifications (U C and WP ) of auto-configuration         Figure 5: Our methodology to analyze and evaluate defects of
in Thunderbird.                                                        servers and clients.

attack can occur silently while the user does not realize it. We       popular email domains from Online Email Verification [54];
summarize 4 UI notifications (including 3 warnings) recom-             (3) GovDomain, a list of government websites worldwide [71];
mended by public documentations [14], [50], [47], [23] that            (4) BankDomain, a list of all bank domains provided by Fondy
should appear during the auto-configuration process. Ignoring          Payment Service Provider [1]; (5) FreeDisposableProvider, a
these notifications could lead to users unknowingly connecting         list of free and disposable email service providers (including
to attacker-controlled servers.                                        Guerrilla Mail, Temp Mail) [2]. In particular, we used PSL [7]
• User confirmation (U C). When a client successfully re-              to extract the registrable domain from GovDomain and cross-
  trieves the configuration information through any auto-              checked the FreeDisposableProvider list with data from Hub-
  configuration mechanisms as described above, it should               spot [37] and an open-source list [4]. Our experiments involved
  first prompt the user to confirm the correctness of the              a total of 1,053,469 unique domain names.
  configuration before attempting to log in [14]. If an attacker       Collect configuration information. We developed a Golang-
  has tampered with the configuration, the victim’s credentials        based crawler and conducted server scanning for Autodiscover,
  (e.g., passwords) could be silently leaked.                          Autoconfig, and DNS SRV records. The scan was performed
• Plain warning (WP ). In addition to user confirmation, the           from an ECS instance (located in Hong Kong) between March
  UI should also emphasize security-sensitive fields, i.e., dis-       26 and March 30, 2024. The request paths used are detailed
  tinguishing “SSL” and “PLAIN” connection types [50]. The             in Appendix B.
  “PLAIN” option should be highlighted to warn users that
  the connection will be unencrypted, as shown in Figure 4.            • Autodiscover. We generated a list of 10 candidate URLs
• Autodiscover redirect warning (WAD ). Autodiscover allows              according to the specifications [48], [47] published by
  a client to send an HTTP GET request (see Table II), fol-              Microsoft. Additionally, to retrieve as many configuration
  lowed by a 302 redirect response containing the destination            files as possible, we also included plaintext HTTP re-
  server URL in the Location header. Since the redirection               quests with the GET method. We heuristically set the
  response stems from an insecure request, attackers could               EmailAddress element in the body of the POST request
  exploit it to intercept configuration information. Therefore,          to info@example.com by referring to common aliases pub-
  the client should warn the user upon receiving the redirec-            lished by 101domain.com [81] and RFC 2142 [21].
  tion, and proceed only after the user permits it [47].               • Autoconfig. We constructed 6 candidate URLs following the
• SRV FQDN warning (WSR ). RFC 6186 [23] suggests that                   RFC draft [14] and used info@example.com as the query
  when the SRV record is not protected by a secure DNS                   parameter in all URLs.
  option, the client should verify whether the target FQDN             • DNS SRV. We queried all SRV records listed in Table IV
  (Fully Qualified Domain Name) of the SRV record matches                and used Unbound [41] as the DNS resolver.
  the queried domain name. Any mismatch should be reported,
  and let the user decide whether to connect to the host               Analyze configuration information. Based on the config-
  specified in the SRV record.                                         uration collected in the previous phase, we analyzed the
                                                                       deployment of auto-configuration across the scanned servers.
       V.    M ETHODOLOGY FOR I MPACT E VALUATION                      For configuration files obtained from Autodiscover or Auto-
                                                                       config, we parsed them based on their respective schemas [48],
    In this section, we present the methodology used to eval-          [14], excluding files with formatting errors. After that, we
uate the impact of the attack scenarios discussed above. Our           examined the defects of these servers respectively. Specifically,
evaluation involved a large-scale measurement of servers and           the analysis approach includes the following aspects:
an end-to-end security analysis of clients. Our methodology is
illustrated in Figure 5.                                               • Insecure responses. We recorded the URL redirection chain
Download domain lists. We downloaded the following lists:                during the request process. We checked if HTTP requests
(1) Tranco1M, a list from the Tranco ranking [60] generated              were redirected to HTTPS URLs. For HTTPS requests, we
on March 25, 2024,2 ; (2) Top100Provider, a list of the most             checked if any plaintext URLs appeared in the chain.
                                                                       • Plain-only connection types. We identified domains that sup-
  2 https://tranco-list.eu/download/Z33PG/1000000                        ported only plaintext connection types based on incoming

                                                                   8
  or outgoing server configurations. For SRV records, we                  corresponding directories of example.xyz. For clients that
  checked whether non-encrypted-only service records (e.g.,               support back-off queries, we checked if they were vulner-
    submission. tcp) were added.                                          able to A2. Specifically, we registered the domain names
• Incorrect parameter settings. We verified whether server-               example.xyz and autoconfig.xyz and set the MX record for
  provided connection types adhered to the values defined                 example.com to example.xyz, and published configuration in-
  in the specifications (see more details in Appendix A). In              formation at https://autoconfig.xyz/mail/config-v1.1.xml. We
  this work, we mainly focus on socketType, SSL, and                      set the hostname to 127.0.0.1 to prevent users affected by
  Encryption elements. Specifically, given the prioritiza-                this vulnerability from connecting to our server.
  tion of services outlined in the configuration file, only the         • Insecure configuration parsing. We tested how clients handle
  first service listed in the incoming and outgoing servers was           configuration parsing errors by setting the socketType
  evaluated.                                                              and SSL elements to “xxx” and observing the default con-
• Insecure priority settings. We analyzed if plaintext connec-            figurations. Since the Encryption element overrides SSL,
  tions were prioritized over STARTTLS or implicit TLS, or                we set SSL to “on” and Encryption to “off” to check
  whether STARTTLS was prioritized over implicit TLS.                     if clients supporting Autodiscover correctly interpreted the
• Inconsistent connection type. Since each mechanism defines              configuration, i.e., resulting in a plaintext connection. For
  connection types differently, we first unified the config-              clients that only support Autodiscover for Exchange [49],
  uration parameters and then evaluated consistency across                we skipped tests related to parameter parsing (A4 and A6).
  mechanisms (detailed in Appendix E).                                  • Non-compliant SRV sorting. We set SRV records with
                                                                          different Priority and Weight values according to the
Select email clients. We initially included all 7 clients listed          specification [32] and verified whether clients correctly
in the RFC draft [14]. Then, we searched online blogs and                 prioritized the records.
media sites using keywords like “most popular email clients             • Outdated built-in lists. We evaluated whether the extracted
for Android” or “best email clients for Android” on Google.               built-in lists were outdated by comparing them against the
We further extended the list using popularity rankings from               configurations obtained from our server scan results.
Google Play and the Apple App Store. Finally, we checked                • Inadequate UI notifications. We tested if Autodiscover-
whether these candidates were open-source by searching for                enabled clients displayed warnings when encountering
them on GitHub. We did not test cross-platform clients on                 HTTP GET redirects by returning a 302 redirect to a
different platforms, as auto-configuration runs primarily on the          domain we registered. We also added SRV records where
OS-independent application layer. In this work, we assumed                the Target field had a different FQDN from the queried
that their functionality would be consistent (our tests of Gmail          domain to check for warnings. For clients that retrieve
for Android and iOS confirmed this assumption). Overall, we               configuration through auto-configuration, we also verified if
selected 29 clients from Windows, Linux, Android, iOS, and                users were prompted to confirm settings before login and if
macOS, as listed in Table VII.                                            highlight warnings were displayed for plaintext connections.
Extract built-in lists. For open-source clients, we reviewed            Evaluate impacts. We evaluated the impact of the attack
their codebases and extracted built-in lists as separate files          scenarios outlined in Table V. We analyzed defects on both
if they existed. We also considered the ISPDB [3] a built-in            the server-side and the client-side and presented detailed eval-
list and merged all its configuration information into a single         uation results in Sections VI and VII, respectively. Although
file. For other clients that we could not extract built-in lists,       the impact of these defects is evaluated separately, practical
we determined their presence by analyzing whether the login             attacks sometimes require defects on both sides, such as the
screens offered multiple service providers for selection.               attacks in A4.
Analyze client defects. Our client analysis involved the fol-
lowing parts: (1) support for auto-configuration, (2) default                      VI.    S ERVER D EFECTS IN THE W ILD
connection types when auto-configuration fails, and (3) defect          Deployment status. We first present the real-world support
analysis. We first built a test platform (detailed in Appendix F)       for auto-configuration mechanisms. Overall, our scan included
that included a mail server, a web server, and a DNS server.            1,053,469 domains, with 79,212 (7.52%) deploying at least one
We combined the access logs from these servers to track                 auto-configuration mechanism: Autodiscover, Autoconfig, or
client requests. Additionally, we used Wireshark to capture             SRV records. The adoption of Autodiscover (49,538 domains)
packets and verify whether the client requests the ISPDB list           and Autoconfig (57,331 domains) was comparable, but only
or performs heuristic guessing. We then suspended all auto-             11,281 domains deployed SRV records. This limited adoption
configuration services on our test servers to observe the default       may be due to SRV supporting fewer field types [14], [5],
connection type clients used when auto-configuration failed.            making it less flexible. We provide more details about the
For Outlook, we used its built-in testing tools [67] to make            deployment result in Appendix C.
the results more intuitive and accurate. Our defect analysis
approach mainly includes the following:                                 Summary. As listed in Table V, we focused on five server-
                                                                        side defects: (1) A1 in Type-I, which could result in the
• Plain requests. We tracked client requests using Wireshark            victim’s email connection being hijacked to an attacker-
  and logs from our test servers.                                       controlled server, and (2) A3, A4, A9, and A10 in Type-II,
• Inadequate eTLD checking. We first tested whether the                 which could result in the victim’s credentials being exposed.
  client performs back-off queries. We added an MX record               Table VI summarizes our detection results for these defects.
  with subdomain.example.xyz for the test domain exam-                  Our analysis discovered a total of 49,013 domains with security
  ple.com and published configuration information in the                defects. For Type-I attacks, we identified defects in 43,566

                                                                    9
Table VI: The number of domains affected by different attacks                          Plain-only connection (A3.1) + Plain or STARTTLS con-
introduced by servers.                                                                 nection (A3.2). Analysis of the connection types in configu-
                                                                                       ration files revealed that 570 Autodiscover-enabled domains
                               Type-I                 Type-II                          and 503 Autoconfig-enabled domains provided only plain-
Domain list
                        A1.1     A1.2 A1.3 A3.1 A3.2 A4.1 A9.1 A9.2 A10.1              text connection settings. Among Autoconfig-enabled domains,
Tranco1M               36,417 28,902    400   762 7,021 1,225   368 1,827 3,220        we identified 3 providers (zonnet.nl, bigpond.com, and big-
Top100Provider              7      7      0     3    19     0     0     0     7        pond.net.au) from the Top100Provider list. For DNS SRV
GovDomain                 756    773      2     9    71    20     7    18    41
BankDomain                 64     69      1     1     3     0     0     1     3
                                                                                       records, unexpectedly, we found that 92.25% (6,805/7,377)
FreeDisposableProvider    553    185     10    81 253       2     1    20   197        of the Tranco1M domains did not add SUBMISSIONS. This
Total                          43,566                     11,824                       makes the connection type a client can establish with the
                                                                                       server dependent on the client’s implementation (as discussed
                                                                                       in Section IV-B). If the client defaults to plaintext, a plain-
(55.0%) domains, including 10 domains in the Tranco Top                                text connection will be established; otherwise, an encrypted
1K. This suggests that considerable domains still transmit                             connection (via STARTTLS) may be established. Fortunately,
configuration information over plaintext, allowing configura-                          none of the clients we tested established a plaintext connection
tion tampering and email communication hijacking. For Type-                            in this case.
II attacks, 11,824 (14.93%) domains were detected, with 15                             Incorrect connection type (A4.1). For Autodiscover, we
listed in the Top 1K. Misconfiguration or mismanagement                                found 925 domains in the Tranco1M list with incorrect param-
in these services weakens the security of email connections,                           eter values. Among these, 156 domains had Encryption set
downgrading them to insecure protocols. Specifically, 2,273                            to starttls, which is not a valid use of STARTTLS and can not
domains could be downgraded to plaintext connections and                               be recognized by clients. Further analysis showed that 112 of
5,120 to STARTTLS. We further examined services susceptible                            these domains were destined to the hosting provider cyber-
to STARTTLS attacks using a command injection testing tool                             folks.pl located in Poland. We suggested that the incorrect
from previous work [62], and found 128 servers (including                              configuration may be due to a lack of clear guidance on setting
Yandex’s) had buffering flaws. Attackers can further exploit                           STARTTLS in Autodiscover, leading providers to configure
those servers to compromise the victims’ credentials. Next, we                         it improperly. Additionally, we found 668 domains on the
detail the specifics of the affected domains in each category.                         Tranco1M list with SSL incorrectly set to yes instead of on.
                                                                                       Of these, 198 hostnames point to the provider of wpx.net
Plain responses (A1.1/A1.2) + Redirection to HTTP (A1.3).
                                                                                       and 113 to wpxhosting.com. For Autoconfig, we identified
We define a well-established server as one that balances secu-
                                                                                       300 domains with incorrect socketType values in the
rity and compatibility. This included two aspects: (1) for HTTP
                                                                                       Tranco1M list. Specifically, 237 domains set values such as
requests, the server redirects requests to an HTTPS URL, and
                                                                                       %server/imap/socket/% or %server/smtp/sock-
(2) for HTTPS requests, all response URLs in the redirection
                                                                                       et/%, which are meaningless. Further analysis revealed that
chain are HTTPS. We analyzed all scan results for Autodis-
                                                                                       the mail server hostnames for these domains pointed to the
cover and Autoconfig (Table XII in Appendix D) and found
                                                                                       service provider kinghost.net.
that 60.32% (28,905/47,917) and 66.57% (36,464/54,776) of
the domains in the Tranco1M list returned insecure responses                           Insecure SRV priority (A9.1) + Insecure connection pri-
(i.e., not well-established), respectively.                                            ority (A9.2). For SRV records, we identified 368 domains
                                                                                       in the Tranco1M with improper priority settings: 333 IMAP,
    For Autodiscover, 80.26% (38,456/47,917) of the domains                            88 POP3, and 37 SUBMISSION domains had records pri-
in the Tranco1M list provided configuration information via                            oritized higher than IMAPS, POP3S, and SUBMISSIONS,
HTTP requests, of which 75.16% (28,902/38,456) had inse-                               respectively. For Autodiscover, 584 domains in the Tranco1M
cure responses (i.e., returned configuration files directly in                         list had improper priority settings, with 288 domains relying
plaintext). Additionally, 12.80% (4,924/38,456) could only                             on email hosting provided by home.pl and 109 by cyber-
retrieve configuration information via HTTP requests. Of these,                        folks.pl. home.pl prioritized the plaintext connection type of
668 domains were redirected to the 1and1.info provider via                             POP3 (port 110) over IMAPS (port 993), while cyber-folks.pl
HTTP GET requests. Fortunately, they were all redirected                               supported POP3S (port 995) but favored IMAP (port 143).
with HTTPS URLs. From the HTTPS requests perspective,                                  For Autoconfig, we found 1,367 misconfigured domains. Two
38 domains redirected HTTPS to HTTP. For Autoconfig,                                   service providers, one.com and jino.ru, were particularly prob-
20.49% (11,222/54,776) of the domains in the Tranco1M                                  lematic, serving emails for 404 and 63 domains, respectively.
list could retrieve configuration information through MX                               Specifically, one.com’s SMTP server and jino.ru’s IMAP server
records. Among them, 36.37% (4,082/11,222) and 20.88%                                  prioritized STARTTLS over implicit TLS.
(2,343/11,222) had their MX hostname set to emx.mail.ru and
mx.yandex.ru, respectively. Overall, 78.94% (43,238/54,776)                            Inconsistent connection types (A10.1). Configuration in-
had their configuration information retrieved through HTTP                             consistencies can occur in two ways: (1) within different
requests. However, 84.22% (36,417/43,238) did not redirect                             paths of the same mechanism (as shown in Table X), and
to HTTPS URLs. In addition, 19.39% (8,383/43,238) could                                (2) between different mechanisms (e.g., autodiscover.xml vs.
only retrieve configuration information via HTTP requests. Of                          config-v1.1.xml). We conducted a detailed comparison of the
these, 604 domains were redirected to privateemail.com using                           configurations of Autodiscover, Autoconfig, and SRV records
HTTPS URLs. We also found 380 domains with HTTP URLs                                   (details are provided in Appendix E for space reasons). First,
in their HTTPS redirection chains, and 181 of these were                               we analyzed inconsistent settings within the same mecha-
redirected to myshoptet.com.                                                           nism. From the Tranco1M list, we found 5,365 Autodiscover-

                                                                                  10
enabled domains and 328 Autoconfig-enabled domains with                    within the top 10K domains in the Tranco ranking. It is
discrepancies. Particularly, we further analyzed the inconsis-             important to note that even if the server administrator does
tencies in connection-type parameters (e.g., SSL, Encryp-                  not deploy any auto-configuration mechanisms, errors in the
tion, socketType), as these could lead to downgrading                      client implementation can still put users at risk of credentials
of connection security. Among 146,046 autodiscover.xml files               disclosure. Since we only considered registrable TLDs from
from the Tranco1M list, 58 domains had inconsistencies, with               GoDaddy, our evaluation only represented the lower bound of
11 vulnerable to downgrades from STARTTLS or implicit TLS                  the actual impact of this attack.
to plaintext. For Autoconfig, among 90,850 config-v1.1.xml,
272 domains had inconsistent settings. Second, we compared                 Plain fallback on parser error (A4.1) + Plain default (A5.1).
domains with discrepancies between different configuration                 In scenarios where clients successfully retrieved configuration
mechanisms. Note that if a domain had internal inconsistencies             information through auto-configuration but failed to parse the
within a mechanism, that mechanism was excluded from                       parameters (A4.1), our experiments showed that 7 clients
comparison. Finally, we found 2,902 domains in the Tranco1M                defaulted to the plaintext connection type. In another scenario
list with inconsistent connection types across different mecha-            (A5.1), 6 clients defaulted to plaintext when they could not ob-
nisms, including 7 in the Tranco Top 1K list (e.g., yandex.com             tain the configuration information through auto-configuration.
and onet.pl). Of these, 625 domains could be downgraded to                 Our experiments revealed variations in default connection
plaintext connections due to these inconsistencies.                        types across clients. For example, 4 clients (including Kmail
                                                                           and Nextcloud Mail) defaulted to an encrypted connection type
                                                                           when no configuration file was available (A5.1) but defaulted
       VII.   A NALYSIS R ESULT OF C LIENT D EFECTS                        to plaintext upon parsing failure (A4.1).
Auto-configuration support. As shown in Table VII, all                     Ignoring the Encryption element (A6.1). We found that 5
29 tested clients supported at least one auto-configuration                clients, including Thunderbird and FairEmail, did not handle
mechanism. Of these, 13 supported Autoconfig, 12 supported                 the Encryption element when parsing the configuration
Autodiscover, and only 5 supported service discovery via                   files to determine the connection type. We analyzed config-
SRV records. Except for Claws Mail, 28 clients had built-in                uration files collected in the scanning module and found 3,942
lists, and 14 of them queried the centralized ISPDB database.              domains in the Tranco1M list only set the Encryption value
Additionally, 19 clients implemented heuristic guessing as an              without specifying SSL. Among them, 3 domains were from
auto-configuration mechanism.                                              the Top100Provider list.
Summary. Overall, 22/29 clients were vulnerable to at least                Non-compliant SRV sorting (A7.1). We found that FairEmail
one of the attack scenarios in Table V. Specifically, 13 clients           requested all SRV service records and performed a uniform
could lead to the victim connecting to an attacker-controlled              sort. While this did not raise security issues when following
server (i.e., A1 and A2), and 19 clients were susceptible to               the standard [32], FairEmail sorted SRV records by both
downgrades to STARTTLS or plaintext, risking credential ex-                Priority and Weight in descending order, which does not
posure (i.e., A4-A8). Furthermore, 21/29 clients did not prompt            conform to the specification. Fortunately, FairEmail always
users to confirm server configuration information (i.e., U C),             attempted to establish a secure connection regardless of the
meaning these attacks can be executed silently. Notably, clients           origin of the SRV record.
were not affected by these attacks mainly because they did not
support the relevant auto-configuration mechanisms. Thus, our              Outdated built-in lists (A8.1). We compared connection type
results are sufficient to conclude that client auto-configuration          parameters (i.e., whether encryption is used) and found that
implementations have widespread security defects.                          all extracted built-in lists were outdated. For example, the list
                                                                           from Mailspring was last updated three years ago. Taking the
Plain request (A1.1/A1.2). 13/20 clients that supported Au-                widely-used ISPDB as an example, it provided configurations
toconfig or Autodiscover sent plaintext HTTP requests. Sur-                for 873 domains. By comparing our scan results with ISPDB,
prisingly, 6/13 clients, including Postbox, Kmail, and Nine,               we found at least 71 domains in ISPDB had outdated config-
initiated only plaintext requests. 5 clients fell back to plaintext        urations. This was primarily due to one provider’s failure to
if encrypted requests failed. Notably, 9/13 clients used plaintext         update information timely, affecting 69 domains. Fortunately,
requests in Autoconfig, which aligns with our server scanning              no plaintext connection types were found in these files.
results, showing that transmitting configuration information in
plaintext is still prevalent in Autoconfig.                                UI notification. Our analysis showed that all clients, except
                                                                           Thunderbird and K-9 Mail, had at least one UI-related defect.
Inadequate eTLD check (A2.1). Except for Nextcloud Mail                    Only 8 clients prompted users to confirm the results obtained
and Thunderbird, none of the other clients implemented the                 from auto-configuration (U C). When configuration informa-
Autoconfig back-off query. However, Nextcloud Mail used a                  tion contained a plaintext connection type, only Thunderbird
period (‘.’) as the delimiter when extracting the %MXFULL-                 provided a highlighted warning (WP ), and K-9 Mail required
DOMAIN%, making it vulnerable in the A2 attack scenario.                   the user to enter the configuration manually. Our analysis
We particularly evaluated the impact of this attack against the            results show that, in a real-world scenario, an attacker could
Nextcloud Mail implementation in Groupware [58]. We found                  attack without the victim’s awareness. For instance, once a
that 31,281 domains (involving 675 TLDs) meet the attack                   client retrieves configuration, it proceeds directly to a login
conditions described in Section IV-B. Using the GoDaddy                    attempt using the credentials entered by the user, leaving
API [31], we identified 224 registrable autoconfig.tld domains,            the victim unaware of a connection to an attacker-controlled
including autoconfig.net and autoconfig.co. In total, 24,149               server. Additionally, clients that rely on built-in lists for auto-
domains were susceptible to this attack, 54 of which were                  configuration should also confirm the configuration with the

                                                                      11
                                                      Table VII: Evaluation results of 29 email clients.

                                         Auto-configuration Support2              Default Port [P/S]3                                                   UI Notification4
           Client1                                                                                                              Defect
                             Autoconfig Autodiscover DNS SRV Built-in list Guess Incoming Outgoing                                                  U C WP WAD WSR
Windows
Postbox (7.0.60)                   P                                         I                 143 S      587 S              A1.1, A8.1              ✓      ✗
Delta Chat (1.42.1) ∗                                                        I                 993 S      465 S              A6.1, A8.1              ✗
Outlook (16.0.10406.20006)                                                                     143 P       25 P              A4.1, A5.1              ✗             ✓
Mailbird (3.0.6.0)                                                                               −          −                  A1.2                  ✗
eM Client (9.2.2157)                                                                           143 S      587 S                                      ✗             ✗
The bat! (11.0.3.1)                                                                            143 P       25 P                  A5.1                ✓      ✗
Linux
Claws Mail (4.2.0git36) ∗                                                                      143 P       25 P                 A5.1                 ✓      ✗              ✗
Thunderbird (115.6.0) ∗                                                      I                 143 P      587 P     A1.1, A4.1, A5.1, A6.1, A8.1     ✓      ✓      ✓
Kmail (5.24.4) ∗                   P                                         I                 993 S       25 S           A1.1, A4.1, A8.1           ✓      ✗
Evolution (3.50.3) ∗                                                         I                 993 S      465 S           A1.1, A4.1, A8.1           ✓      ✗              ✗
Nextcloud Mail (3.5.3) ∗                                                     I                 993 S      587 S       A1.1, A2.1, A4.1, A8.1         ✗
Geary (44.1) ∗                                                               I                 993 S      465 S             A4.1, A8.1               ✗
Android
FairEmail (1.2149a) ∗                                                        I                 993 S      465 S        A1.1, A6.1, A7.1, A8.1        ✗                     ✗
Nine (4.9.5e)                      P                                         I                 993 S      465 S        A1.1, A1.2, A6.1, A8.1        ✗             ✗       ✗
MailTime (4.1.5.1218)              P                                         I                 993 S      465 S              A1.1, A8.1              ✗             ✗
K-9 Mail (6.714) ∗                                                           I                 993 S      465 S              A1.1, A8.1              ✓    N/A
Spark Mail (3.7.2)                                                           I                 993 S      587 S                A8.1                  ✗
ProfiMail Go (4.32.00)                                                       I                 143 P       25 P          A4.1, A5.1, A8.1            ✗
Maildroid (5.22)                                                             I                 143 P       25 P              A5.1, A8.1              ✗
iOS
myMail (14.71.0)                                                                               993 S      465 S                                       ✗
iOS Mail (17.1)                                                                                993 S      587 S                                       ✗
Edison Mail (1.53.14)                                                                          993 S      587 S                                       ✗            ✗
Gmail (6.0.240225)                                                                             993 S      465 S                                       ✗
Mailbus (3.3.11)                                                                               993 S      465 S                A1.2                   ✗
AltaMail (8.2.5)                                  P                                            143 S       25 S              A1.2, A6.1               ✗
MacOS
Apple Mail (13.5.2)                                                                            993 S      465 S                                      ✗
Airmail (5.7)                                                                                  993 S      465 S                                      ✗
Mailspring (1.13.3) ∗                                                                          993 S      465 S                  A8.1                ✓      ✗
Spike (3.8.0)                                     P                                            993 S      587 S                  A1.2                ✗      ✗      ✗       ✗
 1 ∗ Open-source client.
 2   - Not support. - Supported.       - Support Autodiscover for Exchange only. P indicates the client only initiates plaintext requests and I indicates the client queries the
  ISPDB.
 3 P - Default to plaintext. S - Encrypted connection through implicit TLS or STARTTLS. Mailbird does not provide a default connection type and port, requiring the user
  to enter manually.
 4 U C - User confirmation. W
                               P - Plaintext warning. WAD - Autodiscover redirect warning. WSR - SRV FQDN warning. ✓ means a UI notification, and ✗ means no UI
  notification. K-9 Mail requires the user to enter configuration parameters manually when the configuration information retrieved contains a plaintext connection type.


user before proceeding with the login, as built-in lists may not                           led to misconfigurations among administrators who intend to
always be up-to-date (e.g., Mailspring).                                                   provide encrypted-only services (i.e., implicit TLS). Our anal-
                                                                                           ysis showed that 50.35% (3,426/6,805) of the SUBMISSION
                          VIII.        D ISCUSSION                                         records from the Tranco1M list incorrectly had port 465 set,
                                                                                           contrary to the RFC standard [23].
    In this section, we first analyze the root causes of the se-
curity defects in auto-configuration mechanisms, then present                              Lack of guidance for client implementations. As described
mitigation recommendations, and discuss the ethical concerns                               in Section III, several auto-configuration mechanisms are
and limitations of this work.                                                              available for clients. However, these mechanisms are not all
                                                                                           well standardized and lack of clear guidance, which makes
                                                                                           client implementations of auto-configuration depend on the
A. Root Causes                                                                             developer’s knowledge of the implemented mechanism. Our
Defects and complexities in protocol design give rise to                                   client-side experiments revealed that many clients did not
disparate deployment. Beyond administrator negligence, we                                  strictly follow specifications, leading to two problems: (1)
believe the primary cause of defects stems from the protocols                              failing to retrieve configuration files, which impacted usability,
themselves. First, Autoconfig was originally designed without                              and (2) introducing security issues. For example, DeltaChat,
HTTPS [76], leaving the transmission of configuration files                                FairEmail, and Nine only sent GET requests for Autodiscover,
vulnerable to tampering. Second, Autodiscover does not define                              potentially preventing the correct retrieval of configuration
STARTTLS, which confuses administrators during setup. Our                                  files.3 Additionally, clients supporting multiple mechanisms
heuristic exploration also revealed that many administrators                               often introduce more security defects, making the security of
mistakenly equate the tls value in the Encryption element                                  the auto-configuration process dependent on its weakest link.
with starttls. Lastly, regarding SRV service records, RFC 6186                             Challenges of balancing usability and security. Our scan
(published in 2011) did not define encrypted-only records for
SMTP (i.e., SUBMISSIONS), which were added 7 years later                                     3 This work focuses on security issues, so usability-related issues are not
in RFC 8314 (published in 2018). This transition may have                                  included in Table VII.


                                                                                      12
results showed that most servers support insecure connections                    We contacted all affected clients using the following meth-
to ensure clients can retrieve configuration files. Moreover,                ods: (1) submitting reports to their SRC or HackerOne.4 (e.g.,
the need for compatibility across different client implemen-                 Outlook and Nextcloud Mail) (2) raising issues on forums
tations compels administrators to deploy multiple mechanisms                 (e.g., GNOME,5 Bugzilla6 ) or emailing maintainers via their
simultaneously, increasing the maintenance burden. Similarly,                provided security policy. (3) contacting security teams (e.g.,
to enhance user experience, clients tend to support as many                  security@address) or submitting forms on their web portals.
mechanisms as possible, potentially introducing more defects.                In general, we have contacted all 22 clients and received
Notably, our analysis revealed that most clients attempted to                responses from 10 clients so far (including Thunderbird,
log in without user confirmation of the configuration infor-                 Nextcloud Mail, and Mailspring), confirming some or all of
mation, prioritizing usability at the expense of security. As                the defects reported. Specifically, Nextcloud Mail and KMail
the saying goes, complexity is the enemy of security [69].                   assigned CVE identifiers to the vulnerabilities associated with
The community should aim for a simpler, more secure auto-                    A2 and A1.1, respectively. Nextcloud Mail also rewarded us
configuration mechanism that is easy to deploy and implement,                for our findings. FairEmail fixed all reported defects except
striking a balance between usability and security.                           for the plaintext request in Autoconfig, stating that many
                                                                             email providers still use insecure connections to transmit
B. Mitigations                                                               configuration files. For the centralized ISPDB database [3],
                                                                             we raised an issue on GitHub and attached all the domains
Enforcing secure connections, especially in clients. Most                    with outdated configurations, which was confirmed by the
servers and clients support insecure connections for compat-                 developers and has been updated.
ibility purposes. We believe that clients should take the lead
to enforce TLS in auto-configuration, similar to how browsers                    We also launched a notification campaign for all affected
enforced HTTPS [68]. Moreover, servers should migrate from                   domains. Following the practices from previous research [79],
plaintext or STARTTLS connection type to implicit TLS                        [72], we sent reports to their dedicated email addresses,
services and disable support for plaintext connections where                 including security@, support@, abuse@, postmaster@ and
possible. We also included such recommendations [50] in our                  info@. For reports that failed to deliver through the above
reports to mail providers.                                                   email addresses, we have contacted those domains by visiting
                                                                             their web portals and extracting email addresses [77]. Overall,
Checking and updating configurations regularly. Server                       we have received 1,340 response emails so far, including
administrators should regularly check and update their pub-                  753 automated responses from ticketing systems. 93 domains
lished configuration information. We have released a testing                 (including a ranked top 500 domain) acknowledged us for the
tool available at https://github.com/emailconfigtest/mailconfig,             report and are in the process of being fixed.
which supports querying and comparing mail domain con-
figuration information across different mechanisms. We also
included built-in lists of open-source projects in our tool to               D. Limitations
help administrators identify outdated and inconsistent configu-
rations. For client developers, it is essential to ensure that built-            First, we evaluated the security of email auto-configuration
in lists contain up-to-date configurations. While querying the               based on the configuration information provided by the server.
ISPDB [3] in real-time is a good practice, maintaining secure                We did not establish connections to mail servers to analyze
and reliable configuration information in the ISPDB requires                 which email service ports were opened and connection types
coordinated efforts from the community.                                      they supported. Second, for clients using HTTPS requests to
                                                                             download configuration files, we did not investigate whether
Implementing professional clients. A client should consider                  trusted root certificates were deployed and the client performed
the effectiveness and security of auto-configuration mecha-                  strict certificate validation, such as hostname matching. Lastly,
nisms. For effectiveness, the client should support multiple                 since Autoconfig is not yet standardized, our measurements
mechanisms to maximize its ability to retrieve configuration                 only represent a snapshot of its adoption across servers at the
information. For security, it must carefully extract domains                 time of the study. Future results may vary as the standard
(e.g., using tools like PSL [7]) to construct candidate URLs and             evolves and adoption patterns shift.
use HTTPS for configuration retrieval. Regardless of any fail-
ures (e.g., parsing issues), the client should provide encrypted                 This work does not consider DNS resolve-related security
connection types by default. Adequate UI notifications should                threats. While we assume that Type-I attackers can tamper with
also be implemented as a defense against attacks. Additionally,              TCP packets, we consider ISPs trustworthy since recursive
when employing multiple auto-configuration mechanisms, the                   resolution typically occurs within their network. Clients have
client should compare the results and, in the case of inconsis-              limited defenses against attacks at recursive resolution, and
tencies, apply the most secure connection type.                              even DNSSEC does not directly protect query results here.
                                                                             Although RFC 8314 [50] advises against connections based
C. Ethical Concerns and Responsible Disclosure                               on unsigned SRV records, an active attacker within ISPs
                                                                             could modify recursive DNS responses, including DNSSEC
   All our experiments focused on publicly accessible services               validation flags. Such threats are not specific to SRV records
without collecting personal information. We adhered to best                  and are applied to all network applications relying on domains.
practices for Internet measurements as outlined in [12], [27].
We declared the purpose of our measurements on web pages                       4 https://www.hackerone.com/
and set up a PTR record. Client analysis experiments were                      5 https://gitlab.gnome.org/GNOME

conducted on our own platform, and no users were affected.                     6 https://bugzilla.mozilla.org/home




                                                                        13
                          IX.     C ONCLUSION                                          [11]   ——, “SPF beyond the standard: Management and operational
                                                                                              challenges in practice and practical recommendations,” in 33rd
    In this paper, we performed the first systematic security                                 USENIX Security Symposium, USENIX Security 2024, Philadelphia,
analysis of email auto-configuration in the wild, revealing                                   PA, USA, August 14-16, 2024, D. Balzarotti and W. Xu, Eds. USENIX
                                                                                              Association, 2024. [Online]. Available: https://www.usenix.org/confere
widespread defects in server deployment and client imple-                                     nce/usenixsecurity24/presentation/ashiq
mentation. We summarized 10 attack scenarios, including 8
                                                                                       [12]   M. D. Bailey, D. Dittrich, E. Kenneally, and D. Maughan, “The menlo
newly identified defects. These attacks could result in victims                               report,” IEEE Secur. Priv., vol. 10, no. 2, pp. 71–75, 2012. [Online].
connecting to attacker-controlled servers or leaking credentials.                             Available: https://doi.org/10.1109/MSP.2012.52
Among the 79,212 domains supporting one or more auto-                                  [13]   B. Blechschmidt and B. Stock, “Extended hell(o): A comprehensive
configuration mechanisms, 49,013 domains were deployed                                        large-scale study on email confidentiality and integrity mechanisms in
with defects. Of these, 43,566 and 11,824 domains are vulner-                                 the wild,” in 32nd USENIX Security Symposium, USENIX Security
able to the two attacks, respectively. Among the 29 analyzed                                  2023, Anaheim, CA, USA, August 9-11, 2023, J. A. Calandrino
                                                                                              and C. Troncoso, Eds. USENIX Association, 2023, pp. 4895–4912.
clients, 22 were affected by at least one attack scenario, and 21                             [Online]. Available: https://www.usenix.org/conference/usenixsecurity
did not adequately prompt users to confirm the configurations.                                23/presentation/blechschmidt
                                                                                       [14]   B. Bucksch, “Mail Autoconfig,” Internet Engineering Task Force,
    These findings demonstrate that current server deployments                                Internet-Draft draft-bucksch-autoconfig-00, https://datatracker.ietf.o
and client implementations of email auto-configuration bring                                  rg/doc/draft-bucksch-autoconfig/00/, Work in Progress.
security weaknesses to email services. Professional practices                          [15]   B. Bucksch, “Proposal: Auto-configuration,” 2008, https://groups.googl
and implementation guidelines are imperative to address the                                   e.com/g/mozilla.dev.apps.thunderbird/c/6L2wrzGWGQg#a73bd97251b
defects due to misconfiguration, mismanagement, and flawed                                    18777, accessed: 2024-10-05.
implementation. Moreover, the community should prioritize                              [16]   L. Ceci, “Emails sent per day 2025,” https://www.statista.com/statistic
the security concerns surrounding auto-configuration and take                                 s/456500/daily-number-of-e-mails-worldwide/, accessed: 2024-04-29.
actions to eliminate the defects due to compatibility.                                 [17]   J. Chen, V. Paxson, and J. Jiang, “Composition kills: A case study
                                                                                              of email sender authentication,” in 29th USENIX Security Symposium,
                                                                                              USENIX Security 2020, August 12-14, 2020, S. Capkun and F. Roesner,
                          ACKNOWLEDGMENT                                                      Eds. USENIX Association, 2020, pp. 2183–2199. [Online]. Available:
                                                                                              https://www.usenix.org/conference/usenixsecurity20/presentation/chen
   We thank all the anonymous reviewers for their insightful                                  -jianjun
feedback on improving this paper. This research was partially                          [18]   I. S. Consortium, “BIND 9,” https://www.isc.org/bind/, accessed: 2024-
supported by National Key RD Plan of China under Grant                                        10-05.
2020YFB1005803, National Natural Science Foundation of                                 [19]   M. R. Crispin, “Internet message access protocol - version 4,”
China under Grant (62302258, 62472021), Beijing Natural                                       RFC, vol. 1730, pp. 1–77, 1994. [Online]. Available: https:
                                                                                              //doi.org/10.17487/RFC1730
Science Foundation under Grant 4242023, and Youth Top
                                                                                       [20]   D. Crocker, “Standard for the format of ARPA internet messages,”
Talent Support Program of Beihang University under Grant                                      RFC, vol. 822, pp. 1–49, Aug. 1982. [Online]. Available: https:
YWF-22-L-1272. Yiming Zhang is in part supported by the                                       //doi.org/10.17487/RFC0822
Shuimu Tsinghua Scholar Program.                                                       [21]   ——, “Mailbox names for common services, roles and functions,”
                                                                                              RFC, vol. 2142, pp. 1–6, May 1997. [Online]. Available: https:
                                                                                              //doi.org/10.17487/RFC2142
                              R EFERENCES
                                                                                       [22]   ——, “Internet mail architecture,” RFC, vol. 5598, pp. 1–54, Jul.
 [1]   “All banks domains and IPs,” https://github.com/cloudipsp/all banks i                  2009. [Online]. Available: https://doi.org/10.17487/RFC5598
       ps, accessed: 2024-04-16.                                                       [23]   C. Daboo, “Use of SRV records for locating email submission/access
 [2]   “Free or Disposable Email Providers Domains - Collected and combined                   services,” RFC, vol. 6186, pp. 1–9, 2011. [Online]. Available:
       from various resources primarily built on top of lists provided by                     https://doi.org/10.17487/RFC6186
       Okutbay & frankwarwick,” https://gist.github.com/drakodev/e85c1                 [24]   Dovecot, “The Secure IMAP server,” https://www.dovecot.org/downlo
       fd6d9ac8634786d6139e0066fa0, accessed: 2024-04-16.                                     ad/, accessed: 2024-10-05.
 [3]   “Ispdb - generic database of mail server configuration,” https://github         [25]   V. Dukhovni, “Opportunistic security: Some protection most of the
       .com/thunderbird/autoconfig/tree/master/ispdb, accessed: 2024-10-05.                   time,” RFC, vol. 7435, pp. 1–11, Dec. 2014. [Online]. Available:
 [4]   “A list of domains for disposable and temporary email addresses,” https:               https://doi.org/10.17487/RFC7435
       //gist.github.com/adamloving/4401361, accessed: 2024-04-16.                     [26]   Z. Durumeric, D. Adrian, A. Mirian, J. Kasten, E. Bursztein,
 [5]   “Mail account autoconfiguration via DNS SRV (possibly with                             N. Lidzborski, K. Thomas, V. Eranti, M. D. Bailey, and J. A.
       DNSSEC) rfc6186,” https://bugzilla.mozilla.org/show bug.cgi?id=                        Halderman, “Neither snow nor rain nor MITM...: an empirical
       342242, accessed: 2024-04-26.                                                          analysis of email delivery security,” in Proceedings of the 2015
 [6]   “Nodemailer,” https://github.com/nodemailer/nodemailer., accessed:                     ACM Internet Measurement Conference, IMC 2015, Tokyo, Japan,
       2024-03-31.                                                                            October 28-30, 2015, K. Cho, K. Fukuda, V. S. Pai, and
                                                                                              N. Spring, Eds. ACM, 2015, pp. 27–39. [Online]. Available:
 [7]   “Public suffix list,” https://publicsuffix.org/, accessed: 2024-04-09.                 https://doi.org/10.1145/2815675.2815695
 [8]   Amit Serper, “Autodiscovering the great leak,” Sep. 2021, https://ww            [27]   Z. Durumeric, E. Wustrow, and J. A. Halderman, “Zmap: Fast
       w.akamai.com/blog/security/autodiscovering-the-great-leak, accessed:                   internet-wide scanning and its security applications,” in Proceedings
       2024-10-05.                                                                            of the 22th USENIX Security Symposium, Washington, DC, USA,
 [9]   Apple Inc., “Mail - Official Apple Support,” https://support.apple.com/                August 14-16, 2013, S. T. King, Ed. USENIX Association, 2013, pp.
       mail, accessed: 2024-10-05.                                                            605–620. [Online]. Available: https://www.usenix.org/conference/usen
[10]   M. I. Ashiq, W. Li, T. Fiebig, and T. Chung, “You’ve got report:                       ixsecurity13/technical-sessions/paper/durumeric
       Measurement and security implications of DMARC reporting,” in                   [28]   I. D. Foster, J. Larson, M. Masich, A. C. Snoeren, S. Savage, and
       32nd USENIX Security Symposium, USENIX Security 2023, Anaheim,                         K. Levchenko, “Security by any other name: On the effectiveness
       CA, USA, August 9-11, 2023, J. A. Calandrino and C. Troncoso,                          of provider based email security,” in Proceedings of the 22nd ACM
       Eds. USENIX Association, 2023, pp. 4123–4137. [Online]. Available:                     SIGSAC Conference on Computer and Communications Security,
       https://www.usenix.org/conference/usenixsecurity23/presentation/ashiq                  Denver, CO, USA, October 12-16, 2015, I. Ray, N. Li, and


                                                                                  14
       C. Kruegel, Eds. ACM, 2015, pp. 450–464. [Online]. Available:                    [46]   Microsoft, “Exchange 2007 Autodiscover and certificates,” https://tech
       https://doi.org/10.1145/2810103.2813607                                                 community.microsoft.com/t5/exchange-team-blog/exchange-2007-aut
[29]   R. Gellens and J. C. Klensin, “Message submission,” RFC,                                odiscover-and-certificates/ba-p/593753?WT.mc id=M365-MVP-9501,
       vol. 2476, pp. 1–15, Dec. 1998. [Online]. Available: https:                             accessed: 2024-10-05.
       //doi.org/10.17487/RFC2476                                                       [47]   ——, “[MS-OXDISCO]: Autodiscover HTTP Service Protocol,” Aug.
[30]   ——, “Message submission for mail,” RFC, vol. 6409, pp. 1–20, Nov.                       2021, https://learn.microsoft.com/en-us/openspecs/exchange serve
       2011. [Online]. Available: https://doi.org/10.17487/RFC6409                             r protocols/ms-oxdisco/d912502b-c0e2-41a1-8b0e-f714ba523e08,
                                                                                               accessed: 2024-03-06.
[31]   Godaddy, “Domains API,” https://developer.godaddy.com/doc/endpoint
       /domains, accessed: 2024-04-26.                                                  [48]   ——, “[MS-OXDSCLI]: Autodiscover Publishing and Lookup Proto-
                                                                                               col,” Aug. 2021, https://learn.microsoft.com/en-us/openspecs/exchange
[32]   A. Gulbrandsen, P. Vixie, and L. Esibov, “A DNS RR for specifying                         server protocols/ms-oxdscli/78530279-d042-4eb0-a1f4-03b18143cd1
       the location of services (DNS SRV),” RFC, vol. 2782, pp. 1–12, Feb.                     9, accessed: 2024-03-06.
       2000. [Online]. Available: https://doi.org/10.17487/RFC2782
                                                                                        [49]   ——, “Autodiscover for Exchange,” Sep. 2022, https://learn.microsoft.
[33]   P. E. Hoffman, “SMTP service extension for secure SMTP over                             com/en-us/exchange/client-developer/exchange-web-services/autodisc
       transport layer security,” RFC, vol. 3207, pp. 1–9, 2002. [Online].                     over-for-exchange, accessed: 2024-04-26.
       Available: https://doi.org/10.17487/RFC3207
                                                                                        [50]   K. Moore and C. Newman, “Cleartext considered obsolete: Use of
[34]   R. Holz, J. Amann, O. Mehani, M. A. Kâafar, and M. Wachs, “TLS in                      transport layer security (TLS) for email submission and access,”
       the wild: An internet-wide analysis of tls-based protocols for electronic               RFC, vol. 8314, pp. 1–26, Jan. 2018. [Online]. Available: https:
       communication,” in 23rd Annual Network and Distributed System                           //doi.org/10.17487/RFC8314
       Security Symposium, NDSS 2016, San Diego, California, USA, February
                                                                                        [51]   MozillaWiki, “Thunderbird:Autoconfiguration - MozillaWiki,” 2021, ht
       21-24, 2016. The Internet Society, 2016.
                                                                                               tps://wiki.mozilla.org/Thunderbird:Autoconfiguration, accessed: 2024-
[35]   H. Hu and G. Wang, “End-to-end measurements of email spoofing                           10-05.
       attacks,” in 27th USENIX Security Symposium, USENIX Security 2018,               [52]   J. Müller, M. Brinkmann, D. Poddebniak, H. Böck, S. Schinzel,
       Baltimore, MD, USA, August 15-17, 2018, W. Enck and A. P. Felt,                         J. Somorovsky, and J. Schwenk, “”johnny, you are fired!” -
       Eds. USENIX Association, 2018, pp. 1095–1112. [Online]. Available:                      spoofing openpgp and S/MIME signatures in emails,” in 28th
       https://www.usenix.org/conference/usenixsecurity18/presentation/hu                      USENIX Security Symposium, USENIX Security 2019, Santa Clara,
[36]   K. Huang, “Email Client Market Share in August 2021: Email Clients                      CA, USA, August 14-16, 2019, N. Heninger and P. Traynor, Eds.
       Hold Steady,” Sep. 2021, https://www.litmus.com/blog/email-client-m                     USENIX Association, 2019, pp. 1011–1028. [Online]. Available: https:
       arket-share-august-2021, accessed: 2024-04-29.                                          //www.usenix.org/conference/usenixsecurity19/presentation/muller
[37]   Hubspot, “Internet message access from form submissions,” https://kn             [53]   J. Müller, M. Brinkmann, D. Poddebniak, S. Schinzel, and J. Schwenk,
       owledge.hubspot.com/forms/what-domains-are-blocked-when-using-t                         “Re: What’s up johnny? - covert content attacks on email end-
       he-forms-email-domains-to-block-feature, accessed: 2024-04-16.                          to-end encryption,” in Applied Cryptography and Network Security
[38]   F. Ising, D. Poddebniak, T. Kappert, C. Saatjohann, and S. Schinzel,                    - 17th International Conference, ACNS 2019, Bogota, Colombia,
       “Content-type: multipart/oracle - tapping into format oracles in email                  June 5-7, 2019, Proceedings, ser. Lecture Notes in Computer
       end-to-end encryption,” in 32nd USENIX Security Symposium, USENIX                       Science, R. H. Deng, V. Gauthier-Umaña, M. Ochoa, and M. Yung,
       Security 2023, Anaheim, CA, USA, August 9-11, 2023, J. A. Calandrino                    Eds., vol. 11464. Springer, 2019, pp. 24–42. [Online]. Available:
       and C. Troncoso, Eds. USENIX Association, 2023, pp. 4175–4192.                          https://doi.org/10.1007/978-3-030-21568-2 2
       [Online]. Available: https://www.usenix.org/conference/usenixsecurity            [54]   My-Addr, “List of most popular email domains (by number of live
       23/presentation/ising                                                                   emails),” 2016, https://email-verify.my-addr.com/list-of-most-popular
[39]   J. C. Klensin, “Simple mail transfer protocol,” RFC, vol. 5321, pp.                     -email-domains.php, accessed: 2024-10-05.
       1–95, Oct. 2008. [Online]. Available: https://doi.org/10.17487/RFC5321           [55]   J. G. Myers and M. T. Rose, “Post office protocol - version
[40]   J. Kundrát., “Trojita 0.4.1, a security update for CVE-2014-2567,” http:               3,” RFC, vol. 1939, pp. 1–23, May 1996. [Online]. Available:
       //jkt.flaska.net/blog/Trojita 0 4 1 a security update for CVE 201                       https://doi.org/10.17487/RFC1939
       4 2567.html, accessed: 2024-07-06.                                               [56]   I. Nesterov and M. Goncharov, “All your emails belong to us: exploiting
[41]   N. Labs, “Unbound DNS Resolver,” https://nlnetlabs.nl/projects/unbo                     vulnerable email clients via domain name collision,” Black Hat Asia,
       und/about/, accessed: 2024-04-26.                                                       2017.
[42]   H. Lee, M. I. Ashiq, M. Müller, R. van Rijswijk-Deij, T. T. Kwon,               [57]   C. Newman, “Using TLS with imap, POP3 and ACAP,” RFC,
       and T. Chung, “Under the hood of DANE mismanagement in SMTP,”                           vol. 2595, pp. 1–15, Jun. 1999. [Online]. Available: https:
       in 31st USENIX Security Symposium, USENIX Security 2022, Boston,                        //doi.org/10.17487/RFC2595
       MA, USA, August 10-12, 2022, K. R. B. Butler and K. Thomas,                      [58]   Nextcloud, “Nextcloud Groupware,” https://nextcloud.com/groupware/,
       Eds. USENIX Association, 2022, pp. 1–16. [Online]. Available:                           accessed: 2024-10-05.
       https://www.usenix.org/conference/usenixsecurity22/presentation/lee              [59]   Nginx, “Nginx Release Version,” https://nginx.org/en/download.html,
[43]   H. Lee, A. Gireesh, R. van Rijswijk-Deij, T. Kwon, and T. Chung,                        accessed: 2024-10-05.
       “A longitudinal and comprehensive study of the DANE ecosystem                    [60]   V. L. Pochat, T. van Goethem, S. Tajalizadehkhoob, M. Korczynski, and
       in email,” in 29th USENIX Security Symposium, USENIX Security                           W. Joosen, “Tranco: A research-oriented top sites ranking hardened
       2020, August 12-14, 2020, S. Capkun and F. Roesner, Eds. USENIX                         against manipulation,” in 26th Annual Network and Distributed
       Association, 2020, pp. 613–630. [Online]. Available: https://www.usen                   System Security Symposium, NDSS 2019, San Diego, California,
       ix.org/conference/usenixsecurity20/presentation/lee-hyeonmin                            USA, February 24-27, 2019. The Internet Society, 2019. [Online].
[44]   J. Ma, L. Chen, K. Xue, B. Luo, X. Huang, M. Ai, H. Zhang,                              Available: https://www.ndss-symposium.org/ndss-paper/tranco-a-resea
       D. S. L. Wei, and Y. Zhuang, “Fakebehalf: Imperceptible email                           rch-oriented-top-sites-ranking-hardened-against-manipulation/
       spoofing attacks against the delegation mechanism in email systems,”             [61]   D. Poddebniak, C. Dresen, J. Müller, F. Ising, S. Schinzel,
       in 33rd USENIX Security Symposium, USENIX Security 2024,                                S. Friedberger, J. Somorovsky, and J. Schwenk, “Efail: Breaking
       Philadelphia, PA, USA, August 14-16, 2024, D. Balzarotti and                            S/MIME and openpgp email encryption using exfiltration channels,” in
       W. Xu, Eds. USENIX Association, 2024. [Online]. Available: https:                       27th USENIX Security Symposium, USENIX Security 2018, Baltimore,
       //www.usenix.org/conference/usenixsecurity24/presentation/ma-jinrui                     MD, USA, August 15-17, 2018, W. Enck and A. P. Felt, Eds.
[45]   W. Mayer, A. Zauner, M. Schmiedecker, and M. Huber, “No need                            USENIX Association, 2018, pp. 549–566. [Online]. Available: https:
       for black chambers: Testing TLS in the e-mail ecosystem at large,”                      //www.usenix.org/conference/usenixsecurity18/presentation/poddebniak
       in 11th International Conference on Availability, Reliability and                [62]   D. Poddebniak, F. Ising, H. Böck, and S. Schinzel, “Why TLS is
       Security, ARES 2016, Salzburg, Austria, August 31 - September 2,                        better without STARTTLS: A security analysis of STARTTLS in the
       2016. IEEE Computer Society, 2016, pp. 10–20. [Online]. Available:                      email context,” in 30th USENIX Security Symposium, USENIX Security
       https://doi.org/10.1109/ARES.2016.11                                                    2021, August 11-13, 2021, M. D. Bailey and R. Greenstadt, Eds.


                                                                                   15
       USENIX Association, 2021, pp. 4365–4382. [Online]. Available: https:                NDSS 2024, San Diego, California, USA, February 26 - March
       //www.usenix.org/conference/usenixsecurity21/presentation/poddebniak                1, 2024. The Internet Society, 2024. [Online]. Available: https:
[63]   J. Postel, “Simple mail transfer protocol,” RFC, vol. 821, pp. 1–72,                //www.ndss-symposium.org/ndss-paper/breakspf-how-shared-infrastru
       Aug. 1982. [Online]. Available: https://doi.org/10.17487/RFC0821                    ctures-magnify-spf-vulnerabilities-across-the-internet/
[64]   Postfix, “Postfix Announcements,” https://www.postfix.org/announcem            [80] C. Wang, K. Shen, M. Guo, Y. Zhao, M. Zhang, J. Chen, B. Liu,
       ents.html, accessed: 2024-10-05.                                                    X. Zheng, H. Duan, Y. Lin, and Q. Pan, “A large-scale and longitudinal
                                                                                           measurement study of DKIM deployment,” in 31st USENIX Security
[65]   E. Rescorla, “HTTP over TLS,” RFC, vol. 2818, pp. 1–7, May 2000.                    Symposium, USENIX Security 2022, Boston, MA, USA, August 10-12,
       [Online]. Available: https://doi.org/10.17487/RFC2818                               2022, K. R. B. Butler and K. Thomas, Eds. USENIX Association,
[66]   ——, “The transport layer security (TLS) protocol version 1.3,”                      2022, pp. 1185–1201. [Online]. Available: https://www.usenix.org/con
       RFC, vol. 8446, pp. 1–160, Aug. 2018. [Online]. Available:                          ference/usenixsecurity22/presentation/wang-chuhan
       https://doi.org/10.17487/RFC8446                                               [81] G. Workspace, “The Most Common Email Aliases Backed by Data,”
[67]   P. Rice, “How to Test Autodiscover Functionality in Microsoft Outlook,”             Aug. 2022, https://blog.101domain.com/google-workspace/most-com
       Nov. 2018, https://www.prrcomputers.com/blog/how-to-test-autodisco                  mon-email-aliases, accessed: 2024-04-16.
       ver-functionality-in-microsoft-outlook/, accessed: 2024-07-01.
[68]   E. Schechter, “A milestone for Chrome security: marking HTTP as “not
       secure”,” Jul. 2018, https://blog.google/products/chrome/milestone-chr                                       A PPENDIX
       ome-security-marking-http-not-secure/, accessed: 2024-08-27.
                                                                                      A. Autodiscover Request Body and Parameter Definitions
[69]   B. Schneier, “Essays: A Plea for Simplicity - Schneier on Security,”
       https://www.schneier.com/essays/archives/1999/11/a plea for simplicit              The specification [48] provides an example of the Au-
       .html, accessed: 2024-10-05.
                                                                                      todiscover request body (as shown in List 1), which is a
[70]   K. Shen, C. Wang, M. Guo, X. Zheng, C. Lu, B. Liu, Y. Zhao, S. Hao,
       H. Duan, Q. Pan, and M. Yang, “Weak links in authentication chains:
                                                                                      formatted XML containing the EmailAddress element that
       A large-scale analysis of email sender spoofing attacks,” in 30th              identifies the email address (e.g., user@example.com) for
       USENIX Security Symposium, USENIX Security 2021, August 11-13,                 which the configuration information will be retrieved. The
       2021, M. D. Bailey and R. Greenstadt, Eds. USENIX Association,                 same specification [48] also defines the elements included in
       2021, pp. 3201–3217. [Online]. Available: https://www.usenix.org/con           the Autodiscover response (i.e., autodiscover.xml, as shown in
       ference/usenixsecurity21/presentation/shen-kaiwen
                                                                                      List 2). For Autoconfig, since there is currently no formal
[71]   S. Singanamalla, E. H. B. Jang, R. J. Anderson, T. Kohno, and
       K. Heimerl, “Accept the risk and continue: Measuring the long tail of
                                                                                      standard, we refer to the relevant RFC drafts [14] for the
       government https adoption,” in IMC ’20: ACM Internet Measurement               configuration file definitions (i.e., config-v1.1.xml). Tables VIII
       Conference, Virtual Event, USA, October 27-29, 2020. ACM, 2020, pp.            and IX show the definitions of some of the elements in these
       577–597. [Online]. Available: https://doi.org/10.1145/3419394.3423645          configuration files, respectively.
[72]   B. Stock, G. Pellegrino, F. Li, M. Backes, and C. Rossow, “Didn’t you
       hear me? - towards more successful web vulnerability notifications,”                  1 <?xml version=’1.0’ encoding=’utf-8’ ?>
       in 25th Annual Network and Distributed System Security Symposium,                     2 <Autodiscover xmlns="http://schemas.microsoft.com
       NDSS 2018, San Diego, California, USA, February 18-21, 2018. The                            /exchange/autodiscover/outlook/requestschema
       Internet Society, 2018.                                                                     /2006">
                                                                                             3     <Request>
[73]   C. Stransky, O. Wiese, V. Roth, Y. Acar, and S. Fahl, “27 years                       4         <EMailAddress>user@example.com</
       and 81 million opportunities later: Investigating the use of email                          EMailAddress>
       encryption for an entire university,” in 43rd IEEE Symposium                          5         <AcceptableResponseSchema>http://schemas.
       on Security and Privacy, SP 2022, San Francisco, CA, USA,                                   microsoft.com/exchange/autodiscover/outlook/
       May 22-26, 2022. IEEE, 2022, pp. 860–875. [Online]. Available:                              responseschema/2006a</
                                                                                                   AcceptableResponseSchema>
       https://doi.org/10.1109/SP46214.2022.9833755                                          6     </Request>
[74]   D. Tatang, R. Flume, and T. Holz, “Extended abstract: A first large-                  7 </Autodiscover>

       scale analysis on usage of MTA-STS,” in Detection of Intrusions and
                                                                                           Listing 1: An example of the body of POST request in
       Malware, and Vulnerability Assessment - 18th International Conference,
       DIMVA 2021, Virtual Event, July 14-16, 2021, Proceedings, ser. Lecture              Autodiscover.
       Notes in Computer Science, L. Bilge, L. Cavallaro, G. Pellegrino, and
       N. Neves, Eds., vol. 12756. Springer, 2021, pp. 361–370. [Online].
       Available: https://doi.org/10.1007/978-3-030-80825-9 18                               1  <AccountType>email</AccountType>
                                                                                             2  <Action>settings</Action>
[75]   D. Tatang, F. Zettl, and T. Holz, “The evolution of dns-based email                    3 <Protocol>
       authentication: Measuring adoption and finding flaws,” in RAID ’21:                    4     <Type>IMAP</Type>
       24th International Symposium on Research in Attacks, Intrusions and                    5     <Server>imap.example.com</Server>
       Defenses, San Sebastian, Spain, October 6-8, 2021, L. Bilge and                        6     <Port>993</Port>
       T. Dumitras, Eds. ACM, 2021, pp. 354–369. [Online]. Available:                         7     <SPA>off</SPA>
       https://doi.org/10.1145/3471621.3471842                                                8     <SSL>on</SSL>
                                                                                              9     <TTL>0</TTL>
[76]   Thunderbird, “Thunderbird Autoconfiguration,” https://www.bucksch.                    10     <Encryption>SSL</Encryption>
       org/1/projects/thunderbird/autoconfiguration/#ISPDB, accessed: 2024-                  11 </Protocol>
                                                                                             12 <Protocol>
       10-05.
                                                                                             13     <Type>SMTP</Type>
[77]   C. Utz, M. Michels, M. Degeling, N. Marnau, and B. Stock,                             14     <Server>smtp.example.com</Server>
       “Comparing large-scale privacy and security notifications,” Proc. Priv.               15     <Port>465</Port>
       Enhancing Technol., vol. 2023, no. 3, pp. 173–193, 2023. [Online].                    16     <SPA>off</SPA>
       Available: https://doi.org/10.56553/popets-2023-0076                                  17     <SSL>on</SSL>
                                                                                             18     <TTL>0</TTL>
[78]   W. Venema, “Plaintext command injection in multiple implementations                   19     <Encryption>SSL</Encryption>
       of STARTTLS (CVE-2011-0411),” https://www.postfix.org/CVE-201                         20 </Protocol>

       1-0411.html, accessed: 2024-04-09.
                                                                                           Listing 2: An example of autodiscover.xml. The bold text
[79]   C. Wang, Y. Kuranaga, Y. Wang, M. Zhang, L. Zheng, X. Li,                           indicates configuration information for IMAP and SMTP
       J. Chen, H. Duan, Y. Lin, and Q. Pan, “Breakspf: How shared                         servers.
       infrastructures magnify SPF vulnerabilities across the internet,” in
       31st Annual Network and Distributed System Security Symposium,


                                                                                 16
Table VIII: Definitions of key element values of autodis-                                   26.67% (8/30) and 9.94% (190/1,911) of domains that support
cover.xml.                                                                                  all three mechanisms simultaneously.

Element       Value          Meaning                                                        D. Evaluation Results of Autodiscover and Autoconfig for A1.
Server        any             The hostname of the mail server.                                 Table XII presents the evaluation results of Autodisocver
Port          any             Typically is a well-known port, e.g., 993, 995, 465.
SSL           on, off         Whether to establish an encrypted connection, default
                                                                                            and Autoconfig for A1 (refer to Section IV-B and Section VI).
                              is “on”.
SPA           on, off         Whether secure password authentication is required,           E. Comparison Method for Configuration Information
                              default is “on”.
Encryption    none, ssl, tls, If present, overrides the SSL element. “none” rep-                Considering the prioritization of services in the configura-
              auto            resents no encryption is used. “ssl” and “tls” stand
                              for Secure Sockets Layer (SSL) or Transport Layer             tion files, we extracted only the first parameter setting of the
                              Security (TLS) is used, respectively, where SSL is            incoming or outgoing server in each mechanism’s results for
                              superseded by TLS. “auto” represents using the most           comparison. Specifically, we focused on the sockettype,
                              secure encryption that both client and server support.
                                                                                            SSL, and Encryption elements related to connection types.
 1 Note that Autodiscover specification [47] does not define STARTTLS.
                                                                                            We aligned the configuration information obtained from Au-
  In our experiments, we determine whether the connection type is                           todiscover and SRV records with the value of socketType
  STARTTLS based on the well-known port.                                                    defined in Autoconfig as a reference. For Autodiscover, the
                                                                                            Encryption element, if present, overrides the SSL element
Table IX: Definitions of key element values of config-v1.1.xml.                             as defined in Table VIII.
                                                                                                When Encryption was set to ssl or tls, we further
 Element           Value                         Meaning                                    determined the connection type to be ssl or starttls based on
 hostname          any                           The hostname of the mail                   the port. By default, we set the connection type to starttls
                                                 server.                                    for ports 587, 143, and 110, and ssl for ports 465, 993, and
 port              any                           Typically is a well-known                  995. If Encryption was set to auto, we determined the
                                                 port, e.g., 993, 995, 465.                 connection type based on whether the port was well-known
 socketType        plain, starttls, ssl          Plaintext, or encrypted con-
                                                 nection via STARTTLS or                    (see Table I), defaulting to starttls for unfamiliar ports. We
                                                 SSL.                                       also applied this default setting if there were incorrect values in
 authentication password-cleartext,              Authentication methods.                    the sockettype, SSL, or Encryption elements. For SRV
                password-encrypted,                                                         service records, we prioritized encrypted-only service records
                GSSAPI,        NTLM,                                                        (IMAPS, POP3S, and SUBMISSIONS). If the server lacked
                client-IP-address,                                                          such records, we determined the connection type based on
                TLS-client-cert,                                                            the non-encrypted-only service records and whether their ports
                OAuth2, none
                                                                                            were familiar. Note that the analysis results presented in this
                                                                                            paper are based on the processing methods defined here. Actual
                                                                                            results may vary depending on specific client implementations.
B. Request Paths in Server Scanning
   As shown in Table X, our scanning module includes 10                                     F. Test Platform
candidate URLs for Autodiscover and 6 for Autoconfig.                                           Our platform was set up with a mail server running
                                                                                            Postfix [64] and Dovecot [24], and a web server running
C. Deployment of Auto-configuration                                                         Nginx [59] on CentOS 7. We applied certificates from Let’s
                                                                                            Encrypt for both servers. For the mail server, we enabled both
    We retrieved a total of 152,646 autodiscover.xml files from                             implicit TLS and STARTTLS services on the well-known ports
Autodiscover, 95,070 config-v1.1.xml files from Autoconfig,                                 for IMAP and SMTP protocols. We did not test the POP3
and 31,499 SRV records. We filtered out files that could not be                             protocol here since we were primarily concerned with the
parsed or had no configuration information. The results of our                              auto-configuration mechanism, and the exact protocol used is
scan are shown in Table XI. Specifically, among the 1,053,469                               trivial. We hosted both autodiscover.xml and config-v1.1.xml
domains scanned, 79,212 (7.52%) domains support at least one                                files in the appropriate directories on the web server and logged
auto-configuration mechanism (Autodiscover, Autoconfig, or                                  request paths and errors in access.log. To track DNS queries
SRV records). Autodiscover and Autoconfig were supported by                                 from clients, we set up an authoritative DNS server running
49,538 and 57,331 domains, respectively, while only 11,281                                  Bind9 [18] on Ubuntu 22.04.1. We added SRV records for all
domains supported SRV. From the perspective of different                                    services listed in Table IV. In addition, we also added an SRV
domain lists, as expected, the Top100Provider list showed                                   record for autodiscover. tcp to support Autodiscover queries.
the highest deployment rate, with 30% of domains supporting
auto-configuration.
     We further analyzed the distribution for auto-configuration
support. Our results showed that very few domains support all
three mechanisms at the same time. For example, only 2.23%
(1,695/76,104) domains in the Tranco1M list support all three
mechanisms. The Top100Provider and FreeDisposableProvier
lists, which are more closely tied to email services, have

                                                                                       17
                                     Table X: The request paths in Autodiscover and Autoconfig scanning module.

Path                                                  URL                                                         Request Method
Autodiscover
  1   http://autodiscover.example.com/autodiscover/autodiscover.xml                                                  HTTP POST
  2   https://example.com/autodiscover/autodiscover.xml                                                              HTTP POST
       autodiscover. tcp.example.com. IN SRV        0 0 443 target.com.                                DNS SRV request for Autodiscover server
  3
      https://target.com/autodiscover/autodiscover.xml                                                               HTTP POST
  4   http://autodiscover.example.com/autodiscover/autodiscover.xml                                 HTTP GET for initial request, POST for redirection
  5   https://autodiscover.example.com/autodiscover/autodiscover.xml                                                 HTTP POST
  6   http://example.com/autodiscover/autodiscover.xml                                                               HTTP POST
  7   https://autodiscover.example.com/autodiscover/autodiscover.xml                                                  HTTP GET
  8   https://example.com/autodiscover/autodiscover.xml                                                               HTTP GET
  9   http://autodiscover.example.com/autodiscover/autodiscover.xml                                                   HTTP GET
 10 http://example.com/autodiscover/autodiscover.xml                                                                  HTTP GET
Autoconfig
  1   https://autoconfig.example.com/mail/config-v1.1.xml?emailaddress=info@example.com                               HTTP GET
  2   https://example.com/.well-known/autoconfig/mail/config-v1.1.xml?emailaddress=info@example.com                   HTTP GET
  3   http://autoconfig.example.com/mail/config-v1.1.xml?emailaddress=info@example.com                                HTTP GET
  4   http://example.com/.well-known/autoconfig/mail/config-v1.1.xml?emailaddress=info@example.com                    HTTP GET
      example.com. IN MX         0 mx.mail.provider.com.                                                  DNS MX request for mail provider
  5   https://autoconfig.mail.provider.com/mail/config-v1.1.xml?emailaddress=info@example.com                         HTTP GET
      or https://autoconfig.provider.com/mail/config-v1.1.xml?emailaddress=info@example.com                           HTTP GET




                                 Table XI: The deployment rate of auto-configuration among different domain lists.

    Domain list                 Domains # (100%)             Intersection1            MX Records           Autodiscover          Autoconfig         SRV Records       Support2
    Tranco1M                               1,000,000     1,000,000 (100.00%)       646,895 (64.69%)       47,917 (4.79%)       54,776 (5.48%)      11,060 (1.11%)   76,104 (7.61%)
    Top100Provider                               100           100 (100.00%)          100 (100.00%)          15 (15.00%)          18 (18.00%)         22 (22.00%)      30 (30.00%)
    GovDomain                                 41,865          8,831 (21.10%)        19,882 (47.49%)        1,104 (2.64%)          973 (2.32%)         165 (0.40%)    1,446 (2.74%)
    BankDomain                                 7,021          1,943 (27.70%)         5,488 (78.17%)          112 (1.60%)           90 (1.28%)          11 (0.16%)      160 (2.28%)
    FreeDisposableProvider                    16,752            1,380 (8.24%)        8,293 (49.50%)          612 (3.65%)       1,754 (10.47%)         296 (1.77%)   1,911 (11.41%)
    Total                                  1,053,469       1,000,000 (94.92%)      670,709 (63.67%)       49,538 (4.70%)       57,331 (5.44%)      11,281 (1.07%)   79,212 (7.52%)
    1
      Intersection refers to the size of the intersection of the domain list with the Tranco1M list.
    2
      Support refers to how many domains support at least one auto-configuration mechanism.




                                           Table XII: Evaluation results of Autodiscover and Autoconfig in A1.

        (a) Number of Autodiscover-enabled domains returning configuration information per request method and the number of not well-established servers.
Domain List                Support    HTTP Return1 w/ HTTP Only1 HTTPS Return2 w/ HTTPS Only2 Not well-established3 w/o to-HTTPS redirection3 w/ to-HTTP redirection3
Tranco1M                     47,917 38,456 (80.26%)     4,924 (10.28%) 42,993 (89.72%)       9,461 (19.74%)         28,905 (60.32%)             28,902 (60.32%)           38 (0.08%)
Top100Provider                   15     14 (93.33%)          0 (0.00%)    15 (100.00%)            1 (6.67%)              7 (46.67%)                  7 (46.67%)            0 (0.00%)
GovDomain                     1,104    919 (83.24%)         37 (3.35%) 1,067 (96.65%)          185 (16.76%)            773 (70.02%)                773 (70.02%)            1 (0.09%)
BankDomain                      112     89 (79.46%)          7 (6.25%)    105 (93.75%)          23 (20.54%)             69 (61.61%)                 69 (61.61%)            0 (0.00%)
FreeDisposableProvider          612    552 (90.20%)         30 (4.90%)    582 (95.10%)           60 (9.80%)            185 (30.23%)                185 (30.23%)            0 (0.00%)


        (b) Number of Autoconfig-enabled domains returning configuration information per request method and the number of not well-established servers.
Domain List              Support (From MX)      HTTP Return1 w/ HTTP Only1 HTTPS Return2 w/ HTTPS Only2 Not well-established3 w/o to-HTTPS redirection3 w/ to-HTTP redirection3
Tranco1M                       54,776 (11,222) 43,238 (78.94%)   8,383 (15.30%) 46,393 (84.70%)   11,538 (21.06%)       36,464 (66.57%)           36,417 (66.48%)         380 (0.69%)
Top100Provider                          18 (1)     17 (94.44%)       2 (11.11%)     16 (88.89%)         1 (5.56%)            7 (38.89%)                7 (38.89%)           0 (0.00%)
GovDomain                            974 (121)    834 (85.63%)       58 (5.95%)    915 (93.94%)      139 (14.27%)          756 (77.62%)              756 (77.62%)           1 (0.10%)
BankDomain                             90 (16)     73 (81.11%)        2 (2.22%)     88 (97.78%)       17 (18.89%)           64 (71.11%)               64 (71.11%)           1 (1.11%)
FreeDisposableProvider           1,754 (1,061)    681 (38.83%)     209 (11.92%) 1,545 (88.08%)     1,073 (61.17%)          555 (31.64%)              553 (31.53%)          10 (0.57%)

1
  HTTP return indicates that configuration information can be retrieved via an HTTP request. HTTP only indicates that configurations can only be retrieved through an HTTP requ-
  est and not via HTTPS.
2
  HTTPS return indicates that configuration information can be retrieved via an HTTPS request. HTTPS only indicates that configurations can only be retrieved through an HTTPS
  request and not via HTTP.
3
  Not well-established indicates that servers do not redirect HTTP to HTTPS or include HTTP URLs in the redirection chain for HTTPS requests.




                                                                                           18
