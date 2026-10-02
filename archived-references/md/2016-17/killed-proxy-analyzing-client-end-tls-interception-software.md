---
type: Whitepaper
title: "Killed by Proxy: Analyzing Client-end TLS Interception Software"
description: "A framework for testing the TLS proxies that antivirus and parental-control products insert into a host's traffic, covering root-certificate handling, certificate validation, TLS parameters and client transparency. Of 14 products tested, several accepted forged certificates or had extractable private keys, letting a network attacker impersonate any HTTPS server."
resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf"
tags: [whitepaper, webseclist-reference, tls, https, proxy, measurement-study, case-study, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:37:27+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf"
    title: "Killed by Proxy: Analyzing Client-end TLS Interception Software"
    author: Xavier de Carné de Carnavalet, Mohammad Mannan
also_at: []
authors:
  - Xavier de Carné de Carnavalet
  - Mohammad Mannan
canonical_url: ""
cited_by:
  - "2016-17.md:81"
commit: ""
content_sha256: 6f254ced65d4d1b5491c49d3b44c55ca5fd612de8940b45a0e4d0dd5e5973180
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 98ef30314cbd7976c6e61dad52788da55de49da3157ec07cdcc1949417a7e7c7
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:37:27+00:00"
slug: killed-proxy-analyzing-client-end-tls-interception-software
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Killed by Proxy: Analyzing Client-end TLS Interception Software

**Killed by Proxy: Analyzing Client-end TLS Interception Software** - Xavier de Carné de Carnavalet, Mohammad Mannan, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/killed-proxy-analyzing-client-end-tls-interception-software.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Killed by Proxy: Analyzing Client-end TLS Interception Software

Killed by Proxy:
       Analyzing Client-end TLS Interception Software

                                          Xavier de Carné de Carnavalet and Mohammad Mannan
                                          Concordia Institute for Information Systems Engineering
                                                  Concordia University, Montreal, Canada
                                                 {x_decarn, mmannan}@ciise.concordia.ca
    Abstract—To filter SSL/TLS-protected traffic, some antivirus                    proxy and proxy-to-web server. First, such a tool grants itself
and parental-control applications interpose a TLS proxy in the                      signing authority over any TLS certificate by importing its
middle of the host’s communications. We set out to analyze such                     own root certificate into the client’s trusted CA stores. Then,
proxies as there are known problems in other (more matured)                         when a TLS connection is initiated by a client application (e.g.,
TLS processing engines, such as browsers and common TLS                             browser, email client) to a remote server, the TLS proxy forges
libraries. Compared to regular proxies, client-end TLS proxies
impose several unique constraints, and must be analyzed for
                                                                                    a certificate for that server to “impersonate” it in the protocol.
additional attack vectors; e.g., proxies may trust their own root                   Client encryption effectively terminates at the proxy, which
certificates for externally-delivered content and rely on a custom                  dutifully forms a second TLS connection to the remote server.
trusted CA store (bypassing OS/browser stores). Covering existing                   The proxy inspects messages between the two connections,
and new attack vectors, we design an integrated framework to                        and forwards, blocks or modifies traffic as deemed appropriate.
analyze such client-end TLS proxies. Using the framework, we                        However, the use of such a proxy may weaken TLS security
perform a thorough analysis of eight antivirus and four parental-                   in several ways.
control applications for Windows that act as TLS proxies, along                         First, if the proxy’s root certificate is pre-generated (i.e.,
with two additional products that only import a root certificate.
Our systematic analysis uncovered that several of these tools
                                                                                    fixed across different installations), users could be vulnerable
severely affect TLS security on their host machines. In particular,                 to impersonation by an active MITM network adversary,
we found that four products are vulnerable to full server                           having access to the signing key, if the proxy accepts external
impersonation under an active man-in-the-middle (MITM) attack                       site certificates issued by its own root certificate; see Fig. 1.
out-of-the-box, and two more if TLS filtering is enabled. Several                   In Feb. 2015, the advertisement-inserting tool SuperFish [5]
of these tools also mislead browsers into believing that a TLS                      was found to be vulnerable to such an attack due to its
connection is more secure than it actually is, by e.g., artificially                use of the Komodia SDK, which pre-generates a single root
upgrading a server’s TLS version at the client. Our work is                         certificate per product. As this SDK is used by other products,
intended to highlight new risks introduced by TLS interception                      independent work tracked their root certificates and associated
tools, which are possibly used by millions of users.                                private keys.1 In Nov. 2015, two Dell laptop models were
                                                                                    found to be shipped with the same root certificate along with
                      I. I NTRODUCTION                                              its private key [21]. The same attack is also possible, if the
    Several antivirus and parental control software tools an-                       private signing key of a per-installation root certificate can be
alyze client-end traffic, including HTTPS traffic, before it                        accessed by unprivileged malware in a targeted machine. Note
reaches browsers for reasons including: eliminating drive-                          that, unlike advertisement-related products, removing antivirus
by downloads, removing unwanted advertisements, protecting                          and parental control tools may not be feasible or desirable.
children’s online activities by blocking access to unwanted                             Second, as the TLS proxy itself connects to the server, it
websites, or simply hiding swear words. Such tools are pos-                         is in charge of the certificate validation process, which may
sibly used by millions of users (cf. [30]); sometimes they are                      be vulnerable to several known problems, including: accepting
installed by OEMs on new computers (perhaps unbeknownst                             any certificate (cf. Privdog [15]), failing to verify the certificate
to the user), often downloaded/purchased by users, and after                        chain, relying on an outdated list of trusted CAs, or failing
installation, remain active by default (although may not always                     to check revocation status. Brubaker et al. [12] show that
perform filtering).                                                                 certificate validation is a particularly error-prone task, even
    To analyze encrypted traffic, these tools generally insert an                   for well-known and tested TLS libraries and clients.
active man-in-the-middle (MITM) proxy to split the browser-                             Third, the TLS proxy introduces a new TLS client (w.r.t.
to-web server encrypted connection into two parts: browser-to-                      the remote server) in the end-to-end client-server connection.
                                                                                    Similar to browsers, these proxies must be kept updated with
                                                                                    the latest patches as developed against newly discovered vul-
Permission to freely reproduce all or part of this paper for noncommercial
purposes is granted provided that copies bear this notice and the full citation     nerabilities (e.g., BEAST [20], CRIME [55], POODLE [41],
on the first page. Reproduction for commercial purposes is strictly prohibited      FREAK [9], and Logjam [1]). Outdated proxies may also lack
without the prior written consent of the Internet Society, the first-named author   support for safe protocol versions and cipher suites, undermin-
(for reproduction of an entire paper only), and the author’s employer if the        ing the significant effort spent on securing web browsers.
paper was prepared within the scope of employment.
NDSS ’16, 21-24 February 2016, San Diego, CA, USA
Copyright 2016 Internet Society, ISBN 1-891562-41-X
                                                                                      1 https://gist.github.com/Wack0/17c56b77a90073be81d3
http://dx.doi.org/10.14722/ndss.2016.23374
Fig. 1. Illustration of a man-in-the-middle (MITM) attack against a content-control application performing TLS interception that accepts its own root certificate
as the issuer of externally-delivered certificates. In addition, TLS parameters are not transparent to browsers, and may be lowered by the proxy to an unwanted
level. All SSL/TLS versions shown are the highest ones that can be negotiated between two parties, assuming the MITM supports at most TLS 1.2.

     Fourth, the proxy may not faithfully reproduce a connection                   the first version we analyzed, then changed to prompting the
to the browser with the same parameters as the proxy’s                             user for each and every certificate presented on email ports
connection to the server. For example, the proxy may not                           (secure POP3, IMAP and SMTP), leaving users unprotected or
match the use of extended validation (EV) certificates, and                        in charge of critical security decisions. Another antivirus fails
mislead the browser to believe that the connection uses lower                      to verify the certificate signatures, allowing a trivial MITM
or higher standards than it actually does; hence, the proxy may                    attack when filtering is enabled. A third antivirus leaves its host
trigger unnecessary security warnings or suppress the critical                     vulnerable to server impersonation under a trivial MITM attack
ones. We refer to the capacity of a TLS proxy to reflect TLS                       after the product license is expired (accepts all certificates,
parameters between both ends as proxy transparency (not to                         valid or otherwise). Due to the expired license, this product
be confused with Certificate Transparency [24]).                                   also cannot be automatically updated to a newer version that
     Graham [26] shows how easy it is to retrieve the private                      fixes the vulnerability. We contacted the affected companies
key for SuperFish, and consequently to eavesdrop communica-                        and report their responses.
tions from clients using SuperFish in specific Lenovo laptops.                         Finally, our framework can be applied to client-end proxies
Recently, Böck [11] listed several observations about three                        for Mac and on mobile platforms, found e.g., in Mobile Device
antiviruses, including vulnerability to CRIME and FREAK                            Management (MDM) solutions. Also, as an integrated frame-
attacks, and the use of old SSL/TLS versions. Other studies                        work, it can guide more comprehensive testing of other TLS
(e.g., [16], [19]) also highlight the possible dangers of filtering                proxies, such as network appliances in business organizations
by dedicated TLS interception appliances, targeted for enter-                      used to ensure compliance with policies, e.g., US Health
prise environments.                                                                Insurance Portability and Accountability Act (HIPAA).
     In this work, we present a framework to analyze client-end
                                                                                   Contributions.
TLS proxies, and report our results on 14 well-known antivirus
and parental control tools for Windows (including two from                         1) We design a hybrid TLS testing framework for client-
the same vendor, and sometimes multiple versions), tested                             end TLS proxy applications, combining our own certificate
between March and August 2015. Analyzing these proxies                                validation tests with tests that can be reliably performed
poses additional challenges compared to testing regular clients                       through existing test suites (see Section V). Using this
(e.g., browsers), servers (e.g., HTTPS web servers), or stand-                        framework, we analyzed 14 leading antivirus and parental
alone enterprise proxy appliances. Such challenges include:                           control products under Windows that offer HTTPS/secure
the lack of Server Name Indication (SNI) support (requiring                           email filtering, or at least install a root certificate in
one IP address per test) and filtering on specific ports only,                        the client’s trusted CA stores (OS/browsers) to expose
both of which limit the applicability of existing online TLS                          potential TLS-related weaknesses introduced by these tools
test-suites; and difficulties to make a proxy trust our test root                     to their hosting systems.
certificate due to the use of custom CA trusted stores (often                      2) We investigate whether the tools generate product-specific
encrypted/obfuscated in an undocumented manner). Following                            root certificates dynamically, and to what extent they pro-
the structure of a TLS proxy, we use the framework to analyze                         tect the associated private keys. We perform an extensive
client proxies from four perspectives: (a) root certificates of                       analysis of certain products to recover their private keys,
proxies, and protections of corresponding private keys; (b)                           requiring non-trivial reverse-engineering and deobfuscation
certificate validation; (c) server-end TLS parameters; and (d)                        efforts (although one-time only, for each product). When
client-end transparency.                                                              the same key is used on all systems using the same product,
     We found that all the analyzed products in some way                              simple MITM attacks are possible (see Section III).
weaken TLS security on their host. Three of the four parental                      3) We expose flaws in the certificate validation process of the
control applications we analyzed are vulnerable to server                             TLS proxies, given only a small corpus of carefully-crafted
impersonation because they either import a pre-generated cer-                         invalid certificates, which include expired and revoked
tificate into the OS/browser trusted stores during installation,                      certificates along with chains of trust that are broken
lack any certificate validation, or trust a root certificate “for                     for various reasons (see Section VI). While testing our
testing purpose only” with a factorable 512-bit RSA key.                              invalid certificates, we faced several challenges that are
The remaining one imports a pre-generated certificate when                            not generally considered in existing client TLS tests (cf.
filtering is enabled for the first time, and never removes it                         Qualys [52] and others [10], [64]; see Section IV).
even after uninstalling the product, leaving the host perpetually                  4) We analyze the TLS proxies against known attacks, and
vulnerable. One antivirus did not validate any certificate in                         test their support for the latest and older TLS versions.


                                                                               2
   We also test whether the TLS version negotiated with the                   that those TLS applications thereafter automatically trust any
   server differs from what the browser sees (as supplied                     web content signed by that certificate, not simply the filtered
   by the proxy), along with various other parameters, e.g.,                  content. When the CCA is manually disabled or uninstalled,
   certificate key size, signature hashing algorithm, EV cer-                 or the CCA stops filtering due to an expired license, the
   tificates. We observe that browsers (and in turn, users) are               root certificate may still remain in the trusted store. Also,
   often misled by these proxies (see Section VI).                            we observed that these CCA root certificates are valid for
5) We discuss implications of our findings in terms of efforts                a period of one to 20 years (11 out of 14 are valid for 10
   required for launching practical attacks (see Section VII),                years). As a consequence, TLS clients may be vulnerable
   and outline a few preliminary suggestions for safer TLS                    to impersonation attacks when the private key for the root
   proxying (see Section VIII).                                               certificate is not suitably protected. Example scenarios include:
                                                                              CCAs that simply reuse the same public/private key pair across
           II. BACKGROUND AND THREAT MODEL                                    installations; CCAs that do not remove a root certificate from
    In this section, we provide details of our product selection,             the trusted stores and the corresponding private key becomes
terminologies and threat model as used in this paper.                         compromised later (e.g., a RSA-1024 root certificate valid
                                                                              for 10 years leaves plenty of time for a dedicated attacker
A. Terminologies                                                              to factor the key). Compared to installing a new application,
    We refer to content-control applications as CCAs, or simply               inserting a root certificate in a trusted store has more security
products; these include antivirus and parental control applica-               implications that may span even beyond the product’s lifespan.
tions when they perform some form of traffic filtering. Products              Such insertions are also mostly invisible to users, i.e., no
that support TLS filtering are termed as TLS proxies, or simply               explicit message is displayed by the OS, CCAs, or browsers,
proxies. Each product imports a root certificate in the OS                    beyond granting generic admin privileges to the CCAs.
trusted CA store for the proper functioning of their proxy, and
possibly other third-party stores (primarily browser CA stores).              D. Threat model
    A proxy acts between a client application and a remote                        To exploit the vulnerabilities identified in our analysis, we
server. Client applications include web browsers, email clients,              primarily consider two types of attacks (see below). In both
OS services, and any other TLS clients. We mostly discuss                     cases, we assume an attacker can perform an active MITM
the consequences of bad TLS proxies from a browser’s per-                     attack on the target (e.g., an ISP, a public WiFi operator), and
spectives, considering browsers as the most critical TLS client               the goal is to impersonate a server in a TLS connection, or
application for users; however, other applications/services may               at least extract authentication cookies from a TLS session.
also be affected. We use the terms browsers and client appli-                 Attackers cannot run privileged malware (e.g., rootkits) in a
cations interchangeably. For browsers, we consider Microsoft                  target system, as such malware can easily defeat any end-to-
Internet Explorer (IE), Mozilla Firefox and Google Chrome.                    end encryption. However, attackers can execute privileged code
                                                                              in their own machines to study the target products.
B. Product selection                                                              Generic MITM: The attacker may learn (e.g., from network
    We relied on AV-comparatives.org [6], [7], Wikipedia2 and                 access log) whether a vulnerable CCA is installed on a target
other comparatives [65] to select well-known antivirus and                    system; otherwise, a generic MITM attack can be launched
client-end parental control products under Windows. When                      against all users in the network, with the risk of being detected
a vendor offers multiple versions of an antivirus or network                  by users who are not vulnerable. Typically, CCAs that install
firewall, we review the specifications of each product to                     pre-generated certificates may enable such a powerful attack, if
find the simplest or cheapest one that supports TLS/HTTPS                     the corresponding private keys can be retrieved (on an attacker
interception; if the specifications are unclear, we try several               controlled machine). No malicious code needs to be executed
versions. Our preliminary test-set includes a total of 55 prod-               on the target system.
ucts (see Table V in Appendix D): 37 antiviruses and 18                           Targeted MITM: The attacker can run unprivileged code
parental control applications. Fourteen of these tools import                 on the target system, prior to the attack (e.g., via drive-
their own root certificates in the OS/browser trusted CA stores,              by-downloads, social engineering). Such malicious code can
and 12 of them actually proxy TLS traffic. The rest of our                    extract a dynamic, proxy-generated private key, which can then
analysis focuses on these 14 applications/12 proxies. Several                 be used to impersonate any server at that specific target system.
of these proxies have also been identified as a major source of
real-world traffic filtering (see e.g., [30], [51]).                                        III. P RIVATE KEY EXTRACTION
C. Insertions in trusted stores: implications                                     Most CCAs implement various protection mechanisms
                                                                              to safeguard their private keys on-disk. In this section, we
    There are several trusted stores that can be affected by                  discuss our methodologies to identify the types of protection
CCAs. Windows provides a trusted store that we refer to                       as used by CCAs, and how we extract plaintext private keys
as the OS trusted CA store, while third-party applications                    from application-protected storage. OS-protected private key
may maintain their own store (e.g., Mozilla Firefox, Opera);                  extraction requires admin privileges, excluded in our threat
see Appendix A. CCAs install a root certificate in a trusted                  model for targeted attacks (see Appendix B).
store so that TLS applications relying on that store accept
TLS connections filtered by the proxy without any warning                     Overview. Our primary goal here is to extract private keys
or error. However, an imported CCA root certificate implies                   from disk on a user’s machine, using only unprivileged code.
                                                                              Extracting private keys from memory requires admin privi-
  2 https://en.wikipedia.org/wiki/Comparison_of_antivirus_software, and       leges, and we consider such an approach for two cases: to
/wiki/Comparison_of_content-control_software_and_providers                    extract private keys associated to pre-generated certificates,

                                                                          3
and to understand the application process dealing with an in-             CCA, by finding services with related names or identifying
memory private key to identify how the key is stored/protected            new running processes following the CCA installation; (b)
on disk. We discuss the protection mechanisms used by our                 Dump the process memory of each of these processes; (c)
tested CCAs; we circumvented the two main on-disk protection              Search the memory dumps for a private key that matches the
mechanisms without requiring admin privileges on the target               root certificate’s public key; and (d) Identify the process that
system. We then discuss some contextual security aspects.                 handles the TLS filtering, i.e., the one that holds the private
                                                                          key in its memory space. As all CCAs in our study use RSA
A. Locating private keys in files and Windows registry                    key pairs, and those that do not rely on OS-provided key
     Most CCAs (optionally generate and) import their root cer-           storage use the OpenSSL library for handling keys, we use the
tificates into OS/browser trusted stores during installation. Us-         heartleech tool [27] to search for a private key in the memory
ing Process Monitor (“procmon” from Microsoft/SysInternals),              dumps, by specifying the corresponding root certificate.
we monitor all the application processes of a CCA during in-
                                                                               2) Retrieving passphrases: We discuss three techniques
stallation. After installation, we manually check for any newly
                                                                          used to extract a passphrase or the derived encryption
added trusted CA using the Windows Certificate Manager.
                                                                          key, to recover a target private key from an on-disk en-
If a new entry in the Windows store is inserted, searching
                                                                          crypted/obfuscated container. When a specific method is suc-
for the SHA1 fingerprint of that certificate in procmon’s log
                                                                          cessful against a given CCA, it yields a static “secret” that
identifies the exact event where the entry was created. We
                                                                          allows for decryption of the private key using unprivileged
can thus identify the specific application process that inserted
                                                                          operations, satisfying our threat model for targeted MITM
the new certificate, and possibly identify other affected files
                                                                          attacks (see Section II-D).
and registry locations, and which may potentially contain
the associated private key. Specifically, we perform manual               Method 1: Extracting strings. We extract strings of printable
analysis (e.g., searching for keywords such as “certificate”) on          characters from the binaries of the TLS filtering process, and
file and registry operations (potentially hundreds), executed             use them as candidate passphrases. This method was used to
right before and after the root certificate insertion. When a             recover the SuperFish private key (cf. Graham [26]).
CCA leverages the Windows CAPI/CNG, we find obvious                       Method 2: Disassembling/Decompiling. We disassemble the
traces in the log; and we can then easily identify the correct            process binaries using IDA Pro, and search for selected
key in a protected container with a label that is often similar           OpenSSL functions related to private keys; we label such
to the CCA’s name.                                                        functions as passphrase consumer functions.3 Then, we follow
     We also explore a CCA’s installation directory for files that        the source of the argument representing a passphrase, and
appear to be certificates or keys (with extensions such as .cer,          locate potentially hardcoded passphrases. This method is quite
.crt, .cert, .pem, .key; or filenames containing cert or CA). If          effective as all tested CCAs use the OpenSSL library for
a private key is found, we match it to the root certificate for           private key operations, and IDA FLIRT can reliably identify
confirmation. We also check whether the key file is accessible            such OpenSSL functions from process binaries.
by unprivileged code, allowing targeted MITM attacks.                     Method 3: Execution tracing. Some CCAs may obfuscate a
     If no root certificate is imported during installation, we           hardcoded encryption passphrase/key by performing additional
explore the application’s settings for the availability of TLS            computation on it, prior to calling a consumer function. These
filtering, and enable filtering when found. We then reboot                computations may not be accurately disassembled by IDA
the system (sometimes required to activate filtering), and visit          Pro, due to e.g., the use of ad-hoc calling conventions. In
an HTTPS website in a browser to trigger TLS interception,                such cases, we rely on execution tracing. However, instead of
forcing the proxy to access its private key. At this point, if no         debugging a live proxy process, we trace only selected parts
root certificate is installed and no sample HTTPS connections             from a proxy, by executing those parts independently.4 We
are filtered, we discard the application from the rest of our             first load a candidate binary containing consumer functions
analysis. In the end, we fully analyze 14 products that support           into a debugger (Immunity Debugger5 in our case), and set
filtering and/or import a root certificate in the OS trusted store.       breakpoints on these functions. Then, we change the binary’s
                                                                          entry point to a function that is two/three function calls away
B. Application-protected private keys                                     from a consumer function, as we do not know the precise
    Instead of using the OS-protected key storage, some CCAs              location of instructions processing the passphrase/key. Using
store their private keys protected by the application itself, using       this method, we identified all remaining runtime-generated
encryption and sometimes additional obfuscation. After locat-             passphrases that could not be extracted through Methods 1
ing the on-disk protected private keys (Section III-A), we try            and 2. Note that if the encryption key is dynamically generated
to defeat such custom protections to extract the keys. Here, we           from runtime parameters (as opposed to hardcoded), further
detail our methodology to bypass two main protection mech-                reverse-engineering is needed to extract the logic to generate
anisms we encountered, requiring some reverse-engineering                 the correct key on a target machine. In practice, we only
effort (non-trivial, but one-time only for each mechanism).               encountered static encryption keys.
    1) Identify the process responsible for TLS filtering: First,
we find the application process responsible for handling a                   3 Examples: SSL_CTX_use_PrivateKey, SSL_CTX_use_PrivateKey_file,

private key, and then investigate the corresponding binary files          PEM_write_RSAPrivateKey, X509_check_private_key, PKCS8_decrypt.
                                                                             4 Debugging a live proxy is complicated by several factors: a proxy often
(DLLs) involved in this process to extract the passphrase/key
used in encrypting the private key. As the private key must               operates as a Windows service, requiring kernel-level debugging; services are
                                                                          often started early in the boot process and may access the private key before
be in memory when a proxy is performing TLS filtering,                    we can debug the execution; services may not be restarted afterwards without
we can identify the specific process responsible for filtering            rebooting; and services may use anti-debugging techniques.
as follows: (a) Identify all the running processes of a target               5 http://immunityinc.com/products/debugger/index.html




                                                                      4
    3) Encrypted containers: Some CCAs protect on-disk pri-              browsers/applications may be filtered. Self-acceptance is only
vate keys using encrypted database containers such as SQL-               relevant when the proxy is actively filtering. It may happen that
Cipher, an extension of SQLite with AES-256 encryption                   the proxy is not enabled by default; however its root certificate
support. While techniques from Section III-B2 are mostly                 is already imported in trusted stores.
effective against SQLCipher, we develop a generic method that            Expired product licenses. CCAs may stop filtering traffic
can possibly be used with any encrypted SQLite variant. This             when their license or trial period is expired. If a proxy’s root
method helped us unlock an encrypted container that uses a               certificate is still present in trusted stores, it leaves browsers
modified version of SQLCipher. We locate SQL queries in the              vulnerable to potential generic or targeted MITM attacks. This
target binary that are executed immediately after the database           is especially relevant if the TLS proxy does not accept its own
is opened. By modifying such a query to PRAGMA rekey=‘’,                 root certificate as a valid issuer for site certificates before li-
we instruct the SQL engine to reencrypt the database with an             cense expiration; i.e., users are not vulnerable to MITM attacks
empty key, essentially decrypting the database containing the            involving a proxy-signed certificate before license expiration
intended private key. When we need to make a CCA operate                 but become vulnerable afterwards. Alternatively, a CCA may
with our decrypted/modified database, we also patch the CCA’s            decide to continue filtering traffic even in an expired state.
binary not to require a passphrase when opening the database.            In this case, we test whether the proxy’s certificate validation
This is particularly useful for CCAs relying on their own                process is still functional (e.g., rejects invalid certificates).
trusted stores saved within a SQLCipher database, which we               Uninstallation. When a CCA is uninstalled, its root certificate
must modify to insert our test root certificate (see Section V-C).       should be removed from OS/browser trusted stores. Otherwise,
                                                                         it may continue to expose browsers to MITM attacks, e.g., if
C. Security considerations                                               the certificate is pre-generated, or the private key of an install-
    When the private key corresponding to a proxy’s root                 time generated certificate has previously been compromised.
certificate is retrieved, new security considerations emerge, as
discussed below; a proxy must be tested accordingly.                         IV. L IMITATIONS OF EXISTING TLS TEST SUITES
Time of generation. Some CCAs come with a preloaded root                    Existing test suites possess certain limitations that prevent
                                                                         them from being used directly to test client-end TLS proxies.
certificate that they import during installation or when TLS fil-
                                                                         Note that such test suites have not been designed for the TLS
tering is activated. We label such certificates as pre-generated,
which may enable generic MITM attacks. In contrast, others               proxies we target. We summarize these limitations below, and
                                                                         address them in our framework.
may generate a fresh root certificate unique to the local
machine; we label such certificates as install-time generated.           A. Certificate verification
If the private key of an install-time generated certificate is               After the Komodia incident [5], to check whether users are
accessible from unprivileged code, a targeted MITM attack                affected by Komodia-based interception tools, several web-
becomes possible. We verify whether a certificate is generated           based test sites appeared (e.g., [67], [10]). These tests are
at install-time or pre-generated by simply installing the product        based on loading a CSS or JavaScript file hosted on a server
on two different machines with distinct environments (e.g.,              with an invalid certificate (e.g., signed by the pre-generated
different hardware, x86 vs. x86-64), and compare the installed           root certificate of a broken TLS interception tool). If the
certificates. We also search for pre-generated certificate files         CSS/JavaScript resource is successfully fetched, the client is
and private keys in the installer.                                       then notified about the vulnerability. To test client-end TLS
Entropy during generation. It is possible that the entropy               proxies, the following limitations must be addressed.
used during the generation of a new public/private key pair              Unimplemented SNI extension. Certificate validation tests are
in install-time generated certificates is inadequate. In practice,       often served on subdomains that are hosted from the same
since most products we analyzed generate a root certificate              IP address since it is usually costly to use a unique IPv4
with RSA keys using OpenSSL, the generation process is                   address per test. To distinguish multiple domain names, the
expected to call certain known functions, e.g., RAND_seed(),             server implicitly relies on the Server Name Indication (SNI)
RAND_event(), RSA_generate_key_ex(); we found                            TLS extension to receive the hostname requested by the client
calls to the last function in many cases. However, we did not            at connection time. SNI has been widely adopted in modern
investigate further the key generation algorithm in CCAs.                browsers and TLS clients [18]. However, we encountered a
Self-acceptance. For TLS interception, there is no need for a            few proxies that use ad-hoc ways to relay a TLS connection
TLS proxy to accept proxy-signed remote certificates, as the             to the real server, without using the SNI extension. Test servers
proxy’s root certificate is intended only to be used in the local        are thus unable to properly identify the requested host and are
machine. A proxy must not accept such remote certificates;               forced to deliver a default certificate, and eventually a 4xx
otherwise, it becomes vulnerable to generic (for pre-generated           error. For example, while badcert-superfish.tlsfun.de delivers
root certificates), or targeted (for install-time generated root         a certificate signed by SuperFish’s pre-generated certificate
certificates) MITM attacks that use a forged certificate, signed         when the SNI extension is used, lacking SNI results in a
by the proxy’s private key.                                              400 Bad Request webpage owned by the hosting company,
Filtering conditions. CCAs may only filter TLS traffic under             served under their own domain name’s certificate. Thus, the
specific conditions. For example, filtering may be activated             test would report that a carefully-crafted invalid certificate was
by default after installation, or offered as an optional fea-            not accepted (i.e., the proxy is not vulnerable), while the real
ture disabled by default. Filtering may be applied only for              reason is due to the wrong domain name. As a result, the
selected categories of websites (especially for parental con-            invalid certificate is never tested against the proxy.
trol tools), or for all websites. Filtering could also be port-          Caching-incompatible. A TLS proxy may cache certificates
dependent, or applied to any TCP port. Finally, only specific            as seen from an initial connection to a server and reuse

                                                                     5
them upon further visits to the same website. Some suites are            A. Test environment
apparently incompatible with caching proxies, especially when                We setup a target TLS proxy in a virtual machine running
numerous certificates must be tested (e.g., Frankencert [12]             Windows 7 SP1, and a test web server in the host OS. To
uses 8,127,600 test certificates presented on localhost).                address the lack of SNI support in proxies, we assign multiple
Undetected passthrough. Certain proxies only filter selected             IP addresses to a single network interface to map various test
connections, e.g., only specific categories of websites or sup-          domain names to different IP addresses. We also instrument
ported TLS versions; other connections are simply forwarded              a DNS server on the host to serve predefined IP addresses in
to a browser, letting the browser to deal with untrusted                 response to a query for our test domain names. For example,
certificates or unsupported configurations. To test whether a            we map wrong-cn.local.test to 192.168.80.10, assign this IP to
proxy trusts its own root certificate, we must verify that content       the network interface, and configure the web server to serve the
delivered by a web server with a proxy-signed certificate is             corresponding certificate with a wrong CN field for requests
successfully inspected. If the proxy chooses to passthrough this         made to that IP address. While private IPv4 address spaces
connection, the browser will simply accept the proxy-signed              can assign up to 16,387,064 individual addresses (far enough to
certificate (as if the proxy has generated the certificate as part       map all our tests), a few CCAs do not to filter traffic from these
of an active filtering process). We must make sure that the              address spaces. Thus, we also configure our test environment
proxy was trying to filter the connection, and that it detected          to use Internet-addressable IPs from a randomly picked range.
its own root certificate as the issuer, or simply did not find the           If all ports are filtered by the target TLS proxy (or ports are
issuer in its trusted store, and decided to let the browser deal         configurable), we simply leverage existing online testing suites
with an untrusted issuer error. When successfully inspecting             to analyze the proxy for security-sensitive TLS parameters.
the connection, the proxy re-generates a similar certificate on-         Otherwise, we use a TCP proxy on the host to forward traffic
the-fly with a different key. Hence, the certificate received by         addressed to these test suites from a proxy filtered port to the
the browser must be verified, e.g., by its fingerprint.                  real server port. In this setup, we must preserve the correct
Fragile implementations. Proxies may behave inconsistently               domain names to avoid HTTP 300 redirections. While testing
in specific test cases, leading to nondeterministic test results.        the TLS proxy on multiple server ports, we effectively need
For example, if several simultaneous connections are attempted           to serve several tests through the same test IP and port of
to web servers with invalid certificates, a proxy may crash, or          our TCP proxy. To avoid caching issues, we restart the VM
deny all future connections. Even a simple invalid certificate           (with the TLS proxy) after each test. Our testing environment
could lead to timeouts and incorrect test outcomes. Special              is made to conduct all tests within a single physical machine,
care must be taken to test such buggy proxies.                           requiring the CCA to be installed within a VM. Alternatively,
Client-dependent filtering. Proxies may filter or accept only            two physical machines could also be used.
specific clients; e.g., while common browsers are filtered, we
found that the OpenSSL toolkit launched from the command
line was not filtered by half of the proxies. Sometimes,                 B. Certificate validation testing
only selected browsers are filtered. This restriction is im-                 We generate test certificates signed by the private key
plemented simply by checking process names, or through a                 corresponding to our root certificate; we also make the proxies
more involving mechanism (e.g., using non-obvious program                to trust our root certificate (see Section V-C). We visit test
characteristics). Thus, a proxy-testing client application must          web pages using a browser filtered by the proxy under test
make sure that its connections are processed by the proxy.               (preferably Chrome, since it relies on the OS trusted store and
                                                                         provides details about the main connection). We use a couple
B. TLS security parameters                                               of valid, control certificates to verify that a TLS proxy accepts
                                                                         our root certificate, or does not perform any filtering in a given
    Existing test suites, e.g., Qualys [52] and howsmyssl.com,
                                                                         setting (e.g., an unfiltered IP range, domain name or TLS ver-
perform an extensive test of TLS parameters (and relevant
                                                                         sion). When filtering is active, we test each TLS proxy with 9
features), including: protocol versions, cipher suites, TLS
                                                                         certificates with a broken chain of trust, including: self-signed
compression, and secure renegotiation. Various sites also eval-
                                                                         certificate, signature mismatch, non-trusted authority with the
uate high-impact vulnerabilities; e.g., freakattack.com for the
                                                                         same name as a valid authority, wrong domain name, unknown
FREAK attack and weakdh.org for Logjam. As TLS param-
                                                                         issuer, non-CA intermediate authority, X.509v1, revoked and
eters are generally tied to a server rather than a domain,
                                                                         expired certificates; see Appendix C.
online test suites resort to serving these tests on several TCP
ports (e.g., [52], [64]). However, this solution is inadequate,              We also examine whether the proxies accept certificates
as CCAs generally filter only specific ports (e.g., 80 and 443),         with deprecated algorithms (e.g., RSA-512 and MD5), or
sometimes non-configurable. We also found an antivirus that              algorithms that are being gradually phased out (e.g., RSA-
only analyzes encrypted emails on ports 465, 993 and 995.                1024, SHA1).6 Regarding proxy transparency of a certificate’s
Thus, existing sites cannot properly test these TLS proxies.             extensions and parameters, we examine how the proxy deals
                                                                         with Extended-Validation (EV) certificates, and whether the
         V. O UR TLS PROXY TESTING FRAMEWORK                             key length and hashing algorithm in a proxy-signed certificate
                                                                         are identical to the original server certificate.
    We design a hybrid solution combining our own certificate
validation tests with tests that can be reliably performed
                                                                            6 Firefox 42.0 and Chrome 47.0 still accept RSA-1024 keys in leaf certifi-
through existing test suites. We discuss our methodology
                                                                         cates (as of December 2015); however, the trust in CAs using 1024-bit keys is
for testing certificate validation engines of the proxies, TLS           being progressively revoked [45]. The use of MD5 for certificate signature has
parameters as apparent to browsers and remote servers, and               also been banned by modern browsers during 2011 (e.g., [42]) due to obvious
known TLS attacks against each proxy.                                    forgery attacks [60]. SHA1 is also gradually being phased out (e.g., [25]).


                                                                     6
    Our small corpus of 15 certificates is intended to identify            embedded stores (if readable), and check for issues such as
the most obvious validation errors. More comprehensive anal-               globally distrusted CAs (e.g., DigiNotar), expired CAs, and
ysis (cf. [12]) can be performed by identifying the TLS library            CAs with weak keys (below RSA 1024 bits). When we find
and version used by a CCA, and running more tailored tests                 expired CAs, we verify that the proxy correctly checks the
against the library. In practice, we observed that most CCAs               period of validity of its trusted store by (a) importing our own
rely on OpenSSL or Microsoft Secure Channel (Schannel);                    expired root certificate into the store, (b) attempting to connect
however, more reverse-engineering is needed to accurately                  to a test page serving a valid certificate signed by that expired
report which library is effectively used as the TLS stack by               CA. If the page loads, the proxy introduces vulnerabilities
a given CCA. Additional certificates can also be generated to              through its custom store.
test whether the proxies interfere with recent enhancements to
TLS (e.g., key pinning, HSTS). Note that in Chrome 47 (the                 D. TLS versions and known attacks
latest version, as of December 2015), key pinning is overridden                 We test support for SSL 3.0, TLS 1.0, 1.1 and 1.2. We
when a local TLS proxy filters connections.7                               rely on Qualys to perform the version check, when a proxy’s
                                                                           filtering is not port-specific. Otherwise, if we can generate a
C. Proxy-embedded trusted stores                                           valid certificate for the proxy, using our own or the proxy’s
    To validate server certificates, proxies may rely on the               root certificate, we run an instance of the OpenSSL tool as
OS trusted store, or on a custom embedded store. Below we                  a TLS server, configured to accept only specific versions of
discuss testing considerations related to such custom stores.              SSL/TLS on desired ports. Finally, if we cannot provide a valid
                                                                           certificate, we simply proxy traffic from a proxy-filtered port to
Trusting our own root certificate. A valid issuer is re-                   the Qualys server’s real port. Following this methodology, we
quired for signing several of our test certificates (e.g., expired,        can detect vulnerabilities to POODLE, CRIME and insecure
wrong CN, weak keys, or testing TLS support); we sign such                 renegotiation. We also check how TLS versions are mapped
certificates with a well-formed X.509v3 root certificate we                between a browser and the proxy, and the proxy and the remote
generated (with RSA-2048). We make the proxies trust our root              server (cf. Fig. 1). Any discrepancy in mapping would mislead
certificate, when possible. Note that a valid wildcard certificate         the browser into believing that the visited website offered
(issued by a real CA) is insufficient for our purpose. Rather,             better/worse security than it actually does. This problem is par-
we require a certificate that can be used to issue additional              ticularly important when SSL 3.0 connections are masqueraded
certificates (i.e., similar to an intermediate CA certificate); at         as higher versions of TLS.
the end, we did not obtain such certificates from a real CA
as we do not meet the eligibility requirements (e.g., being a                   Browsers support an out-of-specification downgrade mech-
middle/large organization with a substantial net worth).                   anism for compatibility with old/incompatible server imple-
                                                                           mentations [41], [13]. When a browser attempts a connection
    Usually, it is sufficient to import our root certificate into          and advertises a TLS version unsupported by the server
the OS/browser trusted stores. However, several CCAs rely on               (e.g., TLS 1.2 in the ClientHello message), a broken server
their own embedded stores (sometimes obfuscated), effectively              implementation may simply close the connection. The browser
introducing a new independent trusted CA store without any                 may then iterate the process by presenting a lower TLS
documented policy (cf. Mozilla [43]). We tried to insert our               version (e.g., TLS 1.1). This mechanism can be abused by
certificate in the proxy-trusted stores (see Section III-B3).              an active MITM attacker to downgrade the protocol version
    If we cannot make a proxy trust our root certificate, we               used in a TLS communication, while both parties actually
generate relevant test certificates using the proxy’s root certifi-        support a higher version. Abusing this mechanism is at the
cate (with its retrieved private key). However, not all proxies            core of the POODLE attack. We verified whether proxies also
trust their own root certificates to sign arbitrary certificates (as       implement this behavior by simulating such a broken server
expected). In such cases, we search for external web servers               implementation (by simply closing the connection after receiv-
with similar certificates, and visit them to test the proxy. Since         ing ClientHello, and inspecting further ClientHello messages).
we do not control external test websites, there is a possibility                We then analyze the list of ciphers presented by the proxy
that our local tests yield different results than the online ones.         to the remote server using Qualys and howsmyssl.com. Weak,
We still provide both methods as the local tests can be made               export-grade and anonymous Diffie-Hellman (DH) ciphers can
more comprehensive while online tests can serve as a backup                be detected by these tests. When supporting TLS 1.0 (or lower)
solution to test at least certain available cases.                         and CBC-mode ciphers without implementing mitigations (cf.
    For example, an expired certificate can be tested at ex-               record splitting [61]), proxies are vulnerable to the BEAST
pired.badssl.com, if the proxy supports SNI. A wrong CN                    attack [20]. howsmyssl.com allows to test this scenario only
can be tested thanks to misconfigured DNS entries (e.g.,                   when a proxy does not support TLS 1.1 or 1.2. We patched
tv.eurosport.com pointing to Akamai’s CDN servers, delivering              howsmyssl [28] and deployed it locally to test for the remain-
a certificate for the CDN’s domain name). For weak RSA                     ing cases. If the TLS version is not made transparent by the
keys and deprecated signature algorithms, we were unable                   proxy, the cipher suites cannot be transparent either. Finally,
to find online tests. This is an expected limitation, as valid             we verify the proxy’s vulnerability to FREAK and Logjam
CAs currently do not issue such certificates. Hence, these tests           attacks using freakattack.com and weakdh.org.
cannot be performed when the proxy does not trust its own root
certificate or the root certificate we generate; we had one such                              VI. R ESULTS ANALYSIS
proxy among our tested products.                                               In this section, we provide the results of our analysis of
Store analysis. We try to determine the provenance of proxy-               the CCAs we considered, using our framework. We uncover
                                                                           several flaws that can significantly undermine a host’s TLS
  7 https://www.chromium.org/Home/chromium-security/security-faq           security; we discuss practical attacks in Section VII.

                                                                       7
                                                                           TABLE I.         P ROTECTIONS FOR A ROOT CERTIFICATE ’ S PRIVATE KEY
A. Root certificates
     We discuss the results of 14 products (out of the 55 initially                             Location         Protection                Access
                                                                             Avast              CAPI             Exportable key            Admin
analyzed) that install a root certificate in the OS/browser                  AVG                Config file      Obfuscation               Unknown
trusted CA stores; see Table IV in Appendix for a summary.                   BitDefender        DER file         Hardcoded passphrase      User
                                                                             BullGuard AV       DER reg key      Hardcoded passphrase      User
     1) Certificate generation: CYBERsitter and PC Pandora                   BullGuard IS       DER reg key      Hardcoded passphrase      User
use pre-generated certificates; the remaining 12 CCAs use                    CYBERsitter        CER file         Plaintext                 User
install-time generated certificates, two of which do not perform             Dr. Web            CAPI-cert1       Exportable key            Admin
                                                                             ESET               CAPI             Non-exportable key        Admin
any TLS-filtering (BullGuard AntiVirus (AV) and ZoneAlarm).                  G DATA             Registry         Obfuscated encryption     User
For ZoneAlarm, we could not find any option to enable                        Kaspersky          DER file         Plaintext                 User
TLS interception in its settings. Since its antivirus engine                 KinderGate         CER file         Plaintext                 User
                                                                             Net Nanny          Database         Modified SQLCipher        User
is based on the Kaspersky SDK, we could find a file tree                     PC Pandora         CAPI-cert        Non-exportable key        Admin
structure similar to Kaspersky Antivirus. In particular, the files           ZoneAlarm          DER file         Plaintext                 User
storing the root certificate along with its plaintext private key            1 CAPI-cert means that the private key is associated with the certificate

reside in similar locations in both cases. For ZoneAlarm, the
certificate file is named after what seems to be an undefined             customers who installed the vulnerable product version and did
variable name, “(fake)%PersonalRootCertificateName%.cer”.                 not uninstall it, remain vulnerable to a generic MITM attack
Apparently, ZoneAlarm developers were unaware that the SDK                as they do not benefit from automatic updates that could solve
generates and installs this root certificate (or chose to ignore          the issues (since their license has expired). Other CCAs either
it), readable from unprivileged processes.                                disable their proxy after expiration, or continue filtering with
                                                                          similar validation capabilities as before.
     Additionally, when activating ZoneAlarm’s parental control
feature, a rebranded version of Net Nanny is installed. We                    6) Uninstallation: Eight CCAs do not remove their root
also separately analyze the original version of Net Nanny (an             certificates from the OS/browser trusted stores after uninstal-
independent parental control application). In turn, this bundled          lation, leaving the system exposed to potential attacks.
Net Nanny installs a second (pre-generated) root certificate;
however, we were unable to trigger TLS filtering.                         B. Private key protections
     2) Third-party trusted stores: Among third-party trusted                 We provide below the results of our analysis on retrieving
stores, we only verify and report our results for Mozilla                 protected private keys; see Table I for a summary. We also
Firefox; other applications such as Opera (and Mozilla Thun-              explain how we retrieved four passphrase-protected private
derbird when CCAs also target emails) may have also been                  keys and a key stored in a custom encrypted SQLCipher
affected. Eight of the 14 CCAs import their root certificates in          database; our mechanisms illustrate why such protections are
the Firefox trusted store.                                                unreliable (although require non-trivial effort to defeat).
     3) Self-acceptance: From the 12 products that support                Summary. CCAs store private keys as follows: plain-
filtering, BullGuard Internet Security (IS) and AVG do not                text (CYBERsitter, Kaspersky, KinderGate and ZoneAlarm);
accept certificates signed by its own root certificate. However,          CAPI/CNG encrypted (Avast, Dr. Web, ESET and PC Pan-
AVG lets browsers continue the communication without any                  dora); and application encrypted (six applications). Out of the
filtering. The browser is then left to accept site certificates           six application-encrypted private keys, we are able to decrypt
signed by the proxy’s root certificate as if they were issued by          five with our methodology from Section III-B2. AVG appears
the local proxy. Others happily trust any site certificate issued         to store its private key in a custom configuration file with an
by their root certificates.                                               obfuscated structure. The types of protection we encountered
     We searched all the certificates from a ZMap [22] scan on            are static, i.e., the secret used to protect a private key is fixed
July 21, 20158 to find certificates issued by any of the 14 root          across all installations, requiring only a one-time effort. The
certificates from our CCAs. Finding such certificates would               results here are reported for the latest versions of the CCAs
indicate exploitation of proxies supporting self-acceptance. We           (August 2015); some results are for March 2015 versions
found only one such certificate at a Russian hosting site (signed         (explicitly stated).
by the “Kaspersky Antivirus Personal Root Certificate”).                      1) Passphrase-protected private keys: BitDefender stores
     4) Filtering conditions: Eight CCAs activate TLS filtering           its private key protected by a simple hardcoded passphrase
upon installation, four provide an option, and the two others             typically found in cracking dictionaries; we retrieved the
perform no filtering. Six CCAs only filter traffic from/to                passphrase using Method 1. G DATA also protects its private
specific browsers. PC Pandora disallows browsers other than               key stored in registry using a custom format and a random-
IE by aborting connections. KinderGate only filters specific              looking hardcoded passphrase (Method 1). Using Method 2,
categories of websites by default (related to, e.g., advertise-           we found that BullGuard AV/IS generate the final passphrase
ment, dating, forums, nudity, social networking). Finally, the            at runtime based on a hardcoded string, as a form of simple
March 2015 version of Kaspersky lacks certificate validation              obfuscation. In all cases, the passphrases are fixed across
for at least a minute after Windows is started up.                        installations, and the protected private keys are readable by
                                                                          unprivileged processes, enabling targeted MITM attacks as
     5) Expired product licenses: The version of Kaspersky we
                                                                          defined in Section II-D. We do not report the plaintext
analyzed in March 2015 continues to act as a TLS proxy when
                                                                          passphrases to avoid obvious misuse.
a 30-day trial period is expired; however, after the license
expiration, it accepts all certificates, including the invalid                2) Encrypted containers: Net Nanny relies on a modified
ones. The August 2015 version corrected both issues; however,             SQLCipher encrypted database to protect its settings (scattered
                                                                          in multiple database files), including its private key. We provide
  8 https://scans.io/series/443-https-tls-full_ipv4                       details on Net Nanny to highlight the challenges posed by cus-

                                                                      8
tom obfuscation techniques, which can be defeated with some                           overriding procedure), or simply refuse to connect. AVG also
effort (i.e., achieve less protection than OS-protected keys).                        detected the 6 invalid certificates we tested. We could not
    We noticed that one of Net Nanny’s DLLs (db.dll) exports                          perform the remaining tests on AVG, as it is immune to self-
a few functions with meaningful names, apparently relating to                         acceptance, and we could not make it trust our own root
SQLite. Following some differences in the functions names                             certificate; online tests were also inapplicable.
with the official sqlite3 project, we realized that the DLL                                In contrast, CYBERsitter, KinderGate and PC Pandora
actually uses IcuSqlite3.9 A quick search revealed that the                           accepted nearly all invalid certificates we presented. The March
IcuSqlite3 developer apparently works for ContentWatch, the                           2015 version of G DATA also accepted all certificates, while
company developing Net Nanny. From this connection, we as-                            the August version requires user confirmation (via an alert
sumed that IcuSqlite3 was used in Net Nanny, which benefited                          window) for all certificates, including valid ones signed by
us by complementing the disassembly of db.dll by IDA Pro.                             legitimate CAs. BullGuard IS fails to validate the signature
    We were able to extract Net Nanny’s passphrase using                              of a certificate, and accepts our signature mismatch and fake
Method 3, which contained the name of the developing                                  GeoTrust certificates. Apparently, BullGuard IS verifies the
company. We failed however to simply leverage SQLCipher                               chain of trust only by the subject name, allowing trivial generic
to open the encrypted databases.10 Using the method from                              MITM attacks. Finally, we found that 9 proxies do not check
Section III-B3, we could successfully decrypt the first two                           for the revocation status of a certificate.
databases before the program crashed. We rotated the database                         Proxy transparency. Validation errors such as wrong CN, self-
files until all were decrypted, and then found Net Nanny’s                            signed, expired certificate, and unknown issuer, may cause
root certificate and private key in a database. In the March                          modern browsers to notify users (and allow the connection
2015 version, we found that the proxy was using a pre-                                when confirmed via complex UI); most proxies modify these
generated certificate, which made it vulnerable to a generic                          errors, causing browsers to react differently. For example,
MITM attack in its default configuration. In the August 2015                          BitDefender turns a wrong CN into a certificate signed by
version, the private key is install-time generated. A targeted                        an unknown issuer, and CYBERsitter changes the CN field
MITM attack is still possible (the databases are readable                             to make the certificate valid. Most other proxies relay the
from unprivileged processes). Furthermore, the private key                            CN field as-is, or ask for user confirmation. Avast, AVG,
is passphrase-protected by a long random string, also stored                          BitDefender and Dr. Web change self-signed certificates to
in the database. We also made Net Nanny to trust our root                             certificates issued by an untrusted CA. Conversely, BullGuard
certificate by inserting it in Net Nanny’s custom root CA list,                       IS turns certificates signed by an unknown issuer into self-
stored in the encrypted databases.                                                    signed. The behavior for unknown CA, non-CA intermediate
                                                                                      and X.509v1 intermediate is always identical for a given proxy,
C. Certificate validation and trusted stores                                          with the exception of Avast that blocks connections for the
    Our certificate validation analysis reveals various flaws in                      last two cases. Finally, we observed that all proxies but Avast
nine out of 12 proxies.                                                               filter HTTPS communications when the servers offer an EV
    1) Invalid chain of trust: We use nine test certificates                          certificate and present it as a DV certificate to browsers.
with various errors in their chain of trust; see Table II. We                              2) Weak and deprecated encryption/signing algorithms:
highlight the dangerous behaviors in the table (“Accept” and                          We tested proxies against certificates using MD5 or SHA1 as
“Changed”). If a proxy can detect a certificate error, it may                         the signature hashing algorithm, combined with weak (RSA-
react as follows: send the browser a certificate issued by an un-                     512) or soon-to-be-deprecated keys (RSA-1024). Nine out of
trusted CA (“u-CA” in the table), typically named “untrusted”                         12 proxies accept MD5 and SHA1, implying that if an attacker
along with the proxy’s name; send a self-signed certificate (“S-                      can obtain a valid certificate using MD5 signed by any proxy-
S”); ask confirmation from the user by delivering a warning                           trusted CA, she can forge new certificates for any website
webpage or an alert dialog (“Ask”); or, terminate the connec-                         (generic MITM). Seven proxies also accept RSA-512 keys
tion altogether (“Block”). For expired certificates, the period                       in the leaf certificate. An attacker in possession of a valid
of validity may be passed as-is to the client (“Mapped”), or                          certificate using a 512-bit RSA key for a website could recover
updated to reflect a working period (“Changed”); in the latter                        the private key “at most in weeks” [9] and impersonate the
case, the browser cannot detect if the original certificate has                       website to the proxy. We could not test the behavior of AVG
expired. For certificates issued for the wrong domain name,                           due to limitations explained in Section V-C.
the CN field may be passed as-is to the browser, or may be                                 Browser-trusted CAs are known to have stopped issuing
changed to the domain name expected by the browser. Finally,                          RSA-512 certificates (some have even been sanctioned and
proxies may entirely fail to detect invalid certificates, exposing                    distrusted for doing so, see e.g., [23]), and certificates using
browsers to generic MITM attacks (“Accept”).                                          MD5 were not issued past 2008 [49]. Recently, Malhotra et
    Only Kaspersky and Net Nanny successfully detected all                            al. [36] showed that attacks on the Network Time Protocol can
our invalid certificates; however, when detected, the user is                         trick a client system to revert its clock back in time by several
asked to handle the error. In contrast, most browsers now make                        years. Such attacks may revive expired certificates with weak
it significantly difficult to bypass such errors (e.g., complex                       RSA keys (easily broken), and weak hashing algorithms (i.e.,
                                                                                      re-enabling any certificate colliding with a previously-valid
  9 An sqlite3 derivative: https://github.com/NuSkooler/ICUSQLite3.                   certificate, e.g., the colliding CA certificate forged in [60]).
   10 Note that, such databases can be encrypted using various ciphers, and the
                                                                                           3) Proxy-embedded trusted store: AVG, BitDefender, Bull-
encryption key could be derived from the passphrase by an arbitrary number
of iterations of SHA1 using PBKDF2; these parameters are unavailable to us.
                                                                                      Guard IS, and Net Nanny solely rely on their own trusted
We failed to decipher the databases using the extracted passphrase with several       stores. For Net Nanny, we managed to insert our root certificate
common ciphers, and the number of iterations from 1 to half a million.                in its encrypted database (see Section VI-B2). BullGuard IS

                                                                                  9
                TABLE II.       R ESULTS OF THE CERTIFICATE VALIDATION PROCESS AGAINST 9 INVALID CERTIFICATES . F OR LEGENDS , SEE
                                                     S ECTION VI-C1; “N/A” MEANS NOT TESTED .
                                                                                        Invalid certificate tests
                                 Trusted       Self-       Signature         Fake         Wrong             Unknown CA /
                                                                                                                                Revoked      Expired
                                  store       signed       mismatch        GeoTrust         CN            Non-CA / v1 inter.
              Avast                OS          u-CA          Block          u-CA            Pass         u-CA / Block / Block    Accept      Mapped
              AVG                 Own          u-CA           N/A            N/A            Pass           u-CA / N/A / N/A     Unfiltered   Mapped
              BitDefender         Own          u-CA          u-CA           u-CA           u-CA                   u-CA           Accept       u-CA
              BullGuard IS        Own           S-S         Accept          Accept          Pass                   S-S           Accept      Mapped
              CYBERsitter         None        Accept        Accept          Accept        Change                 Accept          Accept      Mapped
              Dr. Web              OS          u-CA          u-CA           u-CA            Pass                  u-CA           Accept       u-CA
              ESET                 OS           Ask           Ask            Ask            Pass                   Ask           Accept        Ask
              G DATA (old)        None        Accept        Accept          Accept        Change                 Accept          Accept      Change
              G DATA (new)        None          Ask           Ask            Ask            Ask                    Ask            Ask          Ask
              Kaspersky            OS           Ask           Ask            Ask            Ask                    Ask            Ask          Ask
              KinderGate          None        Accept        Accept          Accept          Pass                 Accept          Accept      Change
              Net Nanny           Own           Ask           Ask            Ask            Ask                    Ask            Ask          Ask
              PC Pandora          None        Accept        Accept          Accept          Pass                 Accept          Accept      Change


prevents modifications to its list of trusted CAs. If modified, it                     by default [53], [46], [59]. However, as of August 2015, we
triggers an update to restore the original version. An option in                       found half of the 12 proxies still support SSL 3.0.
its configuration allowed us to stop this protection. BitDefender                           Only Avast and Kaspersky support TLS 1.0, 1.1, 1.2, and
adopts a similar mechanism, with no option to disable it; we                           map them appropriately; other proxies upgrade the SSL/TLS
bypassed this protection and changed the trusted store file by                         versions for the proxy-browser connection, and/or do not
booting Windows in safe-mode (without BitDefender being                                support recent versions. AVG, BitDefender and CYBERsitter
started). Finally, more reverse-engineering is needed to make                          upgrade all versions to TLS 1.2. G DATA also upgrades TLS
AVG accept our root certificate.                                                       1.0, 1.1 and 1.2 to TLS 1.2. Net Nanny, which supports only
     Except for AVG, we were able to retrieve all proxy-trusted                        SSL 3.0 and TLS 1.0 to connect to a server, communicates with
CAs. BitDefender’s trusted store contains 161 CA certificates,                         TLS 1.2 with the browser. Similarly, BullGuard IS supports
41 with a 1024-bit key (most are now deprecated by browsers).                          only TLS 1.0 but maps it to TLS 1.2 for browsers. Finally, Dr.
As a comparison, Mozilla Firefox trusted store contains 180                            Web, ESET, KinderGate and PC Pandora support only TLS
certificates, including 13 RSA-1024 as of August 2015. Ten                             1.0, along with SSL 3.0 for the former two. The fictitious
of BitDefender’s trusted CA certificates have already expired                          upgrade of TLS versions as done by a majority of these
as of August 2015; however, BitDefender does not accept                                proxies mislead browsers to believe that the server provides
certificates issued by an expired trusted root certificate. Most                       stronger/weaker security than it actually does.
importantly, BitDefender’s trusted store includes the DigiNotar                             We test whether protocol downgrade attacks as seen against
certificate, distrusted by major browsers since August 2011,                           certain browser implementations are possible, and we found
due to a security breach. It also includes the CNNIC certificate                       that no proxies in our test implement such a version downgrad-
that was at the center of another breach in March 2015,                                ing. These proxies are thus not vulnerable to POODLE [41] via
subsequently distrusted by Firefox and Chrome.11                                       a downgrade attack. However, when connecting to servers that
     BullGuard IS trusted store was apparently generated in                            only support SSL 3.0 or lower, and offer CBC-mode ciphers,
May 2009, from Mozilla’s list of trusted CAs; as expected,                             the practical padding oracle attack proposed in POODLE
this 6 year-old store has been outdated long ago. Among its                            still applies to proxies with SSL 3.0. Six proxies accepted
140 CAs, there is a CA with a 1000-bit key and 43 CAs                                  connections to such servers (disallowed by modern browsers)
with a 1024-bit key. Similar to BitDefender, BullGuard IS also                         and presented the connections as TLS 1.0 or above to browsers.
includes the distrusted DigiNotar root certificate. It also fails at                        We did not test whether the TLS proxies support SSL 2.0;
verifying the expiration dates of its root CAs during certificate                      note that, proxies that support SSL 2.0 (if any), may pose
validation, leaving the 13 expired root certificates in its store                      additional risks against servers that also support this version.
still active.                                                                          For completeness, such testing may also be incorporated.
     Net Nanny’s trusted store contains 173 certificates; one CA                            2) Certificate security parameters: All proxies, except
with 512-bit key (named “Root Agency”), and 27 CAs with                                Avast and PC Pandora, generate certificates with fixed RSA
a 1024-bit key. Thus, Net Nanny is vulnerable to a generic                             keys to communicate with browsers. Six use RSA-1024 and the
MITM attacker, who can recover the private key for the 512-                            remaining four use RSA-2048. While RSA-1024 still does not
bit certificate (requires only trivial effort [9]). In addition, 16                    pose an immediate security risk, proxies may need to remove
CAs are expired, but Net Nanny effectively does not trust such                         RSA-1024 to avoid warning/blocking by browsers (cf. [45]).
root certificates when validating a site certificate.                                  Regarding the hashing algorithm used for the certificate sig-
                                                                                       nature, 7 proxies replace the original certificate’s signing
D. TLS parameters                                                                      algorithm with SHA1, triggering security warnings in Chrome
   In this section, we provide the results of our analysis of                          when the certificate expiration date is past December 31, 2015.
TLS parameters; see Table III.                                                         BitDefender, ESET and Kaspersky use SHA256, effectively
   1) SSL/TLS versions: At the end of 2014, following the                              suppressing potential warnings for server certificates with
POODLE attack, major browsers dropped support for SSL 3.0                              SHA1 or MD5. Other proxies map hash algorithms properly.
                                                                                            3) Cipher suites: SSL 3.0 and TLS 1.0 support ciphers
   11 https://blog.mozilla.org/security/2015/03/23/revoking-trust-in-one-cnnic-        that are vulnerable to various attacks. For example, CBC-mode
intermediate-certificate/                                                              ciphers are vulnerable to the Lucky-13 and BEAST attacks;

                                                                                  10
   TABLE III.    R ESULTS FOR TLS PARAMETERS , PROXY TRANSPARENCY AND KNOWN ATTACKS . U NDER “P ROTOCOL MAPPING ” WE LIST THE TLS
        VERSIONS AS OBSERVED BY BROWSERS WHEN A TLS PROXY CONNECTS TO A SERVER USING TLS 1.2, 1.1, 1.0, SSL 3.0 (“—” MEANS
   UNSUPPORTED ). F OR “C IPHER SUITE PROBLEMS ”, WE USE : “W” FOR WEAK ( ACCORDING TO Q UALYS ); “E” FOR EXPORT- GRADE CIPHERS ; “A” FOR
  ANONYMOUS D IFFIE -H ELLMAN . “ × ” REPRESENTS VULNERABILITY TO THE LISTED ATTACKS ; “*” INDICATES THAT THE VULNERABILITY TO BEAST
                             OR FREAK COULD BE DUE TO THE UNPATCHED S CHANNEL LIBRARY USED IN OUR TESTING .

                                       Protocol mapping                 Certificate mapping                                Vulnerabilities
                      Filtered                                                                       Cipher     Insecure
                                 TLS     TLS    TLS       SSL    Key          Hash
                       ports                                                             EV cert.    suite      renego-    BEAST    CRIME    FREAK   Logjam
                                 1.2     1.1    1.0       3.0    size       algorithm
                                                                                                     problems    tiation
   Avast              Specific   1.2      1.1    1.0      —     Mapped      Mapped      Unfiltered
   AVG                Specific   1.2      1.2    1.2      1.2    2048       Mapped        DV           W
   BitDefender        Specific   1.2      1.2    1.2      1.2    2048       SHA256        DV           W                    ×
   BullGuard IS       Specific   —        —      1.2      —      1024        SHA1         DV           W                    ×                         ×
   CYBERsitter        Specific   1.2      1.2    1.2      1.2    1024        SHA1         DV          W, E                  ×                 ×
   Dr. Web              All      —        —      1.0      1.0    1024        SHA1         DV           W                    ×*                ×*
   ESET               Specific   —        —      1.0      1.0    2048       SHA256        DV           W                    ×*                ×*
   G DATA             Specific   1.2      1.2    1.2      —      1024        SHA1         DV           A                                      ×       ×
   Kaspersky            All      1.2      1.1    1.0      —      2048       SHA256        DV                                           ×
   KinderGate         Specific   —        —      1.0      —      1024        SHA1         DV           W
   Net Nanny            All      —        —      1.2      1.2    1024        SHA1         DV           W                    ×                 ×       ×
   PC Pandora           All      —        —      1.0      —     Mapped       SHA1         DV           W          ×         ×

and RC4 is known to have statistical biases [3]. To mitigate                         Nanny and PC Pandora), since they do not implement proper
BEAST from the server-side, the preferred ciphers for SSL                            mitigations with CBC (record splitting) or do not individually
3.0/TLS 1.0 were based on RC4. However, as modern browsers                           proxy each TLS record from the browser/Java client.
now mitigate this attack by using record splitting [61], servers                         BullGuard IS, Dr. Web, ESET, Kaspersky, Net Nanny and
continue to use CBC-mode ciphers in TLS 1.0 to avoid                                 PC Pandora may allow MITM attackers to decrypt partial
RC4 [54] (considering recent practical attacks against RC4                           traffic (typically authentication cookies, leading to session
used in a TLS setting [68]).                                                         hijacking) because of their vulnerability to BEAST, CRIME,
    We test TLS proxies for their supported cipher suites by                         or insecure renegotiation.
using a browser that does not support any weak ciphers. When
the Qualys test reports that weak ciphers are presented to the
                                                                                                        VII. P RACTICAL ATTACKS
server, this indicates that the proxy negotiated its own cipher
suite with problematic ciphers. Weak ciphers as ranked by the                             In this section, we summarize how an attacker may exploit
Qualys test include the ones relying on RC4, as presented by                         the reported vulnerabilities, and turn them into practical attacks
most proxies. Other used weak cipher suites include: export-                         against a target running Windows 7 SP1. For example, even
grade ciphers with 40 bits of entropy (CYBERsitter); 56-bit                          if a CCA relies on a pre-generated root certificate, it may not
DES (BullGuard IS and CYBERsitter); ciphers relying on                               become instantly vulnerable to a generic MITM attack. Other
anonymous Diffie-Hellman, which lacks authentication and                             factors must also be considered, e.g., whether the certificate
may enable a generic MITM attack (G DATA). PC Pandora                                is imported in the OS/browser stores during installation, or
only supports three ciphers, two of which are based on RC4.                          later when the filtering option is enabled; whether the proxy
                                                                                     is enabled after installation by default and in this case, if
    4) Known attacks: All proxies, except Avast, BitDefender
                                                                                     it accepts its own root certificate. We discuss such nuances
(March 2015 version) and Kaspersky, are vulnerable to at least
                                                                                     when considering what attackers can realistically gain from the
one of the following attacks: insecure renegotiation, BEAST,
                                                                                     flaws we uncovered, and give a preliminary ranking of CCAs
CRIME, FREAK, or Logjam.
                                                                                     according to the level of effort required for launching practical
    BullGuard IS, CYBERsitter, Dr. Web, ESET, G DATA and                             attacks. We contacted the 12 affected companies; only four of
Net Nanny are vulnerable to FREAK and/or Logjam against                              them provided a detailed feedback, sometimes demonstrating
vulnerable servers. When the browser connects to a vulnerable                        a poor understanding of TLS security; see Appendix D.
server, an active MITM attacker could force the use of export-
                                                                                          An attacker who can launch a generic MITM attack can
grade DH or RSA keys to access plaintext traffic. As of August
                                                                                     impersonate any server with very little or no effort to hosts that
2015, 8.4% of servers from the Alexa Top 1 million domains
                                                                                     have any of the following four CCAs installed. (a) PC Pandora,
are vulnerable to Logjam [1], and 8.5% to FREAK.12 While
                                                                                     as it imports a pre-generated root certificate in the Windows
Logjam and FREAK attacks are relatively recent (less than
                                                                                     store during installation, and does not filter TLS traffic by
a year old at the time of our tests in August 2015), other
                                                                                     default (i.e., allowing external site certificates signed by the PC
attacks are known for several years. Kaspersky is vulnerable to
                                                                                     Pandora private key to be directly validated by clients relying
CRIME; and PC Pandora to insecure renegotiation. In the latter
                                                                                     on the OS store, e.g., IE). It also remains vulnerable when
case, an active MITM attacker could request server resources
                                                                                     filtering is enabled, as it accepts external certificates signed by
using the client’s authentication cookies.
                                                                                     its own root certificate. (b) KinderGate, for selected categories
    Although BEAST requires bypassing the Same-Origin                                of websites, due to its lack of any certificate validation. (c) G
Policy (SOP) and the support for Java applets, the main                              DATA (for emails only), as the March version does not perform
mitigation relies on Java’s TLS stack implementation [54].                           certificate validation, and both March/August versions support
These mitigations are however canceled by five proxies that                          anonymous DH ciphers. (d) Net Nanny, as its March version
support TLS 1.0 at most (BullGuard IS, Dr. Web, ESET, Net                            uses a pre-generated certificate, and both March/August ver-
                                                                                     sions trust a root certificate with a factorable RSA-512 key
  12 https://freakattack.com/                                                        (only one factorization is required to impersonate any server).

                                                                                11
    The following three CCAs become vulnerable to full server               VIII. R ECOMMENDATIONS FOR SAFER TLS PROXYING
impersonation when filtering is manually activated (disabled                 Encryption as provided by TLS is by design end-to-end,
by default), or when the product’s trial period is over. The             and insertion of any filtering MITM proxy is bound to interfere
attacker simply needs to wait for these attack opportunities, and        with TLS security guarantees. In this section, we discuss a
requires no additional effort. (a) Kaspersky’s March version,            few recommendations that may reduce negative interference
as it does not perform any validation after the product license          of proxies/filtering. We also briefly discuss how browsers can
is expired. Also, no automatic update of the product is possible         help make proxying safer.
(requires a valid license), thus leaving customers with the                  We first discuss the use of a special SSL key logging
March version vulnerable until they manually upgrade or                  feature provided by recent browsers that would avoid the
uninstall the product. (b) BullGuard IS, if the parental control         need for TLS proxies in CCAs, while allowing filtering to
feature is enabled, due to its lack of certificate signature             some extent. If proxies are still used (e.g., for clients without
validation. (c) CYBERsitter, when its TLS filtering option is            SSL key logging support), we then discuss how they may
enabled as it does not perform any certificate validation.               be designed to function safely. We believe following these
    By exploiting the CRIME vulnerability, with limited effort           guidelines may significantly improve CCAs in general, but
(see e.g., [55]), attackers can retrieve authentication cookies          we want to stress that more careful scrutiny is required to
under a generic MITM attack from hosts where Kaspersky                   assess security, functionality and performance impacts. Note
is installed (both March/August versions). However, only the             that, some TLS security features will be affected, no matter
servers that still support TLS compression can be exploited.             how the proxies are designed. For example, EV certificates
According to the SSL Pulse project [66], 4.4% of the TLS                 cannot be served to browsers, if a proxy is used for filtering
servers surveyed remain vulnerable, as of August 2015.                   traffic from websites with EV certificates.
    If attackers can launch the BEAST attack, they can retrieve          TLS key-logging. Recent Firefox and Chrome browsers sup-
authentication cookies from hosts with Dr. Web (out-of-the-              port saving TLS parameters in a file to recreate a TLS session
box), ESET (when filtering is enabled) and BitDefender (both             key that can be used to decrypt/analyze TLS traffic (e.g., via
versions, for servers supporting at most TLS 1.0). As esti-              Wireshark); the key file is referenced by the SSLKEYLOG-
mated [62], a PayPal cookie can be extracted using BEAST in              FILE environment variable [44]. TLS proxies can offload all
about 10 minutes. According to SSL Pulse [66], 86.8% of TLS              TLS validation checks to browsers, by configuring the key
servers present CBC-mode ciphers in SSL 3.0/TLS 1.0, as of               file and using the session key to decrypt the TLS encrypted
August 2015 (mostly due to mitigations being implemented in              traffic originating from supporting browsers. Thus, proxies
recent browsers, see e.g., [54]).                                        can passively intercept the traffic, and perform filtering as
    Attackers can exploit the FREAK attack against BitDe-                usual, without interfering with TLS security. This mechanism
fender’s March version against servers that support TLS 1.1              should be sufficient for antiviruses to protect browsers from
or above (other FREAK-vulnerable CCAs can be exploited                   active exploits, and parental control applications to block
with simpler attacks). It will allow server impersonation for            access to restricted content. We found no CCAs leveraging
all websites served from a vulnerable web server. Note that              this functionality.
8.5% of Alexa’s top 1 million domain names are reported to                   If TLS key logging is used, modification of the traffic
be vulnerable to FREAK, as of August 2015 [9].                           may not be possible (e.g., censor swear words, remove ads).
    If the attacker can execute unprivileged code on a target            Also, browsers and other TLS applications (e.g., Microsoft IE,
machine to retrieve private keys (not protected by the OS), she          Safari, email clients) that currently do not support TLS key
can further impersonate any server to seven CCAs (including              logging, cannot be filtered; note that, most CCAs filter traffic
BullGuard AV, BitDefender (August version) and ZoneAlarm).               from selected applications only (see Table IV).
BullGuard IS and Kaspersky (March versions) could already                Private keys. Most CCAs attempt to manage their private keys
be targeted by an opportunistic attack mentioned above, or the           independently (i.e., without relying on OS-protected storage),
CRIME attack; however, a targeted attack requires no waiting             making the keys accessible to unprivileged code. Several keys
and does not depend on server compatibility. BitDefender                 are stored in plaintext, and others are protected by application-
(March version), Kaspersky (August version) and Dr. Web                  specific encryption/obfuscation techniques, which can be de-
can already be exploited for selected vulnerable websites,               feated with a one-time moderate effort. Instead, proxies can
now it extends the attacker’s ability to target any website.             simply use the OS-provided API (CNG) to securely store
Finally, KinderGate also facilitates this attack, even after             private keys, which would then require an attacker to run
uninstallation (recall that KinderGate is already vulnerable to          admin-privileged code to access the keys. Of course, OS APIs
server impersonation under a generic MITM attack).                       should be used properly for effective protections (e.g., non-
    A more powerful attacker could further exploit RC4 weak-             exportable key). Also, proxies must generate a separate root
nesses against systems with AVG installed (for selected web-             certificate for each installation, i.e., must never use a pre-
sites only). More than 55% of servers surveyed by SSL Pulse              generated certificate to avoid generic MITM attacks.
in August 2015 present a cipher suite that includes RC4. The             Certificate validation. To perform filtering, proxies must use
attack however is costly; it is reported by Vanhoef et al. [68]          dynamically generated server certificates for the proxy-browser
to require 75 hours to recover a single cookie.                          TLS communication channel. Thus, proxies cannot transpar-
    For Avast, the only way to impersonate a server is to                ently forward a server certificate to the browser. However, they
trick/compromise a CA to issue valid certificates for targeted           must properly validate the received server certificates, with no
websites. Even if the breach is later discovered and the                 less rigor than popular browsers, and relay certificate errors to
certificates are revoked, Avast would continue to accept them.           browsers, as closely as possible. These are no easy tasks, but


                                                                    12
must not be sidestepped by proxies, as they become the effec-                       Recommendations for browser manufacturers. As TLS
tive Internet-facing TLS engine for the filtered applications.                      filtering obviously breaks end-to-end security, we recommend
    Validation: Proxies that perform validation checks (albeit                      a few additional active roles for browsers, specifically, to
incomplete), apparently rely on the validation mechanisms                           reduce harm from broken proxies. For example, browsers can
offered by their respective TLS library. Such mechanisms as                         warn users when a root certificate is inserted to a browser-
provided by, e.g., OpenSSL, may require additional support to                       specific trusted store (e.g., the Firefox store), or when filtering
ensure the chain of trust, and revocation status, and to enforce                    is active (e.g., via a warning page, once in each browsing
supplementary policies.13 The revocation status of certificates                     session); connections via proxies may also be contingent
(via CRL or OCSP) should also be checked (e.g., through the                         upon user confirmation. Such warnings may be undesirable
OpenSSL ocsp interface).                                                            for parental-control applications, which may be mitigated by
    Errors: Communicating non-critical validation errors such                       having the warning feature as an option, turned on by default.
as expired certificate or wrong CN should be done in a way                          At least, browsers should make active filtering apparent to
that users still have a choice to accept or reject them, similar                    users through security indicators. Note that browsers can easily
to common browsers. Other invalid scenarios, e.g., non-CA                           detect the presence of proxies, e.g., from the received proxy-
and X.509v1 intermediate, could also be replicated; however,                        signed certificate, and recent browsers already accommodate
simply refusing such certificates might also be acceptable                          several UI indicators, to show varying levels of trust in a given
(reflecting how browsers deal with such error cases).                               TLS connection.15 Some users may ignore such indicators,
                                                                                    but others may indeed be benefited (cf. [2]). Recently, Ruoti
Transparency. For the browser-proxy connection, proxies                             et al. [56] surveyed user attitudes toward traffic inspection,
should not use a fixed-size key or a fixed hashing algo-                            and reported that users are generally concerned about TLS
rithm, which we observed for most products. When certificate
                                                                                    proxies (in organizations, public places, or operated by the
attributes are not properly mapped, browsers may remain                             government); 90.7% of participants expected to be notified
unaware of the true TLS security level of an intended server.                       when such proxying occurs.
Achieving transparency of certificate attributes includes at least
the replication of the same signature hashing algorithm and key                          As the most used interface to web, browser manufacturers
type/size. Regarding the TLS version and other parameters                           in the recent years have taken a more pro-active role in
such as the cipher suite, a transparent TLS handshake is                            improving online security than simply faithfully implementing
possible that satisfies constraints from both the browser and                       the TLS specifications, e.g., deploying optional/experimental
server. Below, we outline a simple protocol to achieve this                         extensions to TLS, such as HSTS and key pinning; blocking
goal; see also Fig. 2.                                                              malware and phishing sites; and restricting misbehaving CAs,
                                                                                    such as CNNIC [4] and TURKTRUST [48]. We thus expect
C                                    P                                     S        browser manufacturers to force companies behind the most
                                                                                    offending CCAs to fix obvious vulnerabilities, by blocking
                Vc , Cc                    min(Vc , Vp ), Cc ∩ Cp
                                     /                                     /        connections when a known, broken proxy is involved.
                 min(Vc , Vp , Vs ), c ∈ Cc ∩ Cp ∩ Cs                                                     IX. R ELATED WORK
  o
                                                                                        Most testing suites related to our framework are presented
Fig. 2.   Optimal handshake for TLS ClientHello and ServerHello when                in Section IV. Here we briefly report additional studies on TLS
proxying a connection                                                               interception, proxying, and TLS security in general.
     In this three-party TLS handshake, the client (C) sends                            Dell SecureWorks Counter Threat Unit [16] propose a
a ClientHello message with its supported TLS version (Vc )                          framework for testing dedicated, network-based TLS inter-
and cipher suite (Cc ). The proxy (P ) intercepts the message                       ception appliances as used in enterprise environment; several
and attempts a connection with the remote server (S) using                          security flaws were also reported. CERT [19] lists a few
the best version that both the client and the proxy support,                        common vulnerabilities in TLS proxies, and identifies possibly
i.e., min(Vc , Vp ), along with a cipher suite that is compat-                      affected products (mostly for enterprises). In the past, such
ible with both the client and proxy (Cc ∩ Cp ). Finally, the                        devices used to receive certificate signing authority from an
server naturally chooses a TLS version and a cipher (c) that                        existing client-trusted CA to avoid user configuration; however,
would transparently satisfy both the proxy and the client, i.e.,                    many OS/browser vendors disallow this practice, and have
min(Vc , Vp , Vs ) and c ∈ Cc ∩ Cp ∩ Cs respectively (Vs is                         removed/sanctioned the issuing CA when discovered, e.g.,
the best version supported by the server and Cs is the server’s                     Trustwave [63], TURKTRUST [48], ANSSI [47] and CN-
cipher suite). The proxy simply relays the ServerHello message                      NIC [4]. Such enterprise proxies require users/administrators
to the client, and continues the two handshakes (client- and                        to independently install the proxy’s root certificate into their
server-end) separately.                                                             clients. Our work is focused on client-end interception proxies,
                                                                                    which poses additional challenges, and are installed and used
     The proxy achieves complete transparency, if its supported                     by everyday users. Also, Dell’s framework is mostly oriented
cipher suite is a superset of the client’s (Cp ⊇ Cc ), and if it                    towards certificate validation, while we extend the focus to
supports at least a TLS version as high as the client (Vp ≥ Vc ).                   TLS versions and various recent attacks.
Such a handshake requires the proxy to be at par with the latest
TLS standards. This requirement is also necessary to help deter                         Frankencert [12] generates artificial certificates that are
newly discovered attacks (e.g., Heartbleed,14 FREAK).                               composed of a combination of existing extensions and con-
                                                                                      15 See e.g., Chrome: https://support.google.com/chrome/answer/95617;
  13 https://www.openssl.org/docs/apps/ocsp.html, /docs/apps/verify.html
                                                                                    and     Firefox:   https://support.mozilla.org/en-US/kb/how-do-i-tell-if-my-
  14 http://heartbleed.com/                                                         connection-is-secure.


                                                                               13
straints, randomly chosen from a large corpus of input cer-                                      X. C ONCLUSION
tificates. The generated certificates are then tested against                  We propose a framework for the evaluation of client-end
TLS clients. Errors are uncovered through differential testing             TLS proxies, by addressing limitations of regular TLS test
between at least two implementations. Frankencert has been                 suites, and adding more tests specifically relevant to such
tested mainly on open-source TLS libraries (not much testing               proxies. We use the framework to comprehensively analyze
on browsers), and uncovered several high-impact validation                 14 antiviruses and parental control applications, specifically
flaws. The authors use a script to instrument browsers and                 their TLS proxies. While these applications may require
TLS libraries to generate a web request and log the status                 TLS interception capabilities for their functionality, they must
of the reply (i.e., to check certificate rejection errors). We             avoid introducing new weaknesses into the already fragile
provide a simple mechanism to make Frankencert compatible                  browser/SSL ecosystem. However, we found that not a single
with client-end TLS proxies; however, we do not use/modify                 TLS proxy implementation is secure with respect to all of our
Frankencert as obvious validation errors are already apparent              tests, sometimes leading to trivial server impersonation under
from simple tests.                                                         an active man-in-the-middle attack, as soon as the product is
     In a preliminary work, Böck [11] analyzes three antiviruses,          installed on a system. Our analysis calls the purpose of such
and reports that they are vulnerable to CRIME and FREAK                    proxies into question, especially in the case of antiviruses,
attacks, and support only old SSL/TLS versions. Böck also                  which are tasked to enhance host security. Indeed, these prod-
tracks commercial products that leverage the Netfilter SDK16               ucts in general, appear to significantly undermine the benefits
to intercept HTTPS traffic using pre-generated certificates. Our           of recent security fixes and improvements as deployed in the
work is more comprehensive in terms of the number of tested                browser/SSL ecosystem. We suggest preliminary guidelines for
products, and tests we perform in our framework.                           safer implementations of TLS proxies based on our findings.
     Huang et al. [30] study TLS traffic filtering by investigating        However, due to the foreseeable implementation complex-
Facebook’s server certificate as seen from browsers. They                  ities of our proposed guidelines, we suggest the adoption
found that 0.2% of the 3 million TLS connections they mea-                 of interfaces that would let client-end TLS proxies monitor
sured were tampered with interception tools, mostly antiviruses            encrypted traffic originating from browsers in a more secure
and enterprise CCAs, but also parental control tools and mal-              way, e.g., using the SSL key log file feature. Our work is
ware. O’Neill et al. [51] leverage a Google AdWords campaign               intended to highlight weaknesses in current TLS proxies, and
to study connections to their own server and several popular               to motivate better proposals for safe filtering. Finally, our
websites. They found that 0.41% of 15 million connections                  findings also call into question the so-called security best-
were proxied, by similar types of intercepting tools.                      practice of using antiviruses on client systems, as commonly
     Various proposals introduce extensions to TLS and new                 advised by IT professionals, and even required by some online
encryption schemes that enable transparent inspection of en-               banking websites.
crypted traffic, see e.g., [58], [50]. Liang et al. [35] show the                                ACKNOWLEDGMENTS
architectural difficulties faced by CDNs to deploy HTTPS, as
they are automatically placed in a man-in-the-middle position.             For comments and suggestions, we are grateful to anony-
                                                                           mous CCS2015 and NDSS2016 reviewers, Paul Van Oorschot,
     Meyer and Schwenk [37] survey theoretical and practical               Jeremy Clark, Tao Wan, our shepherd Joseph Bonneau, and
cryptographic attacks against SSL/TLS, along with problems                 the members of Concordia’s Madiba Security Research Group.
with the PKI infrastructure. They gather lessons learned from              The first author is supported in part by a Vanier Canada Gradu-
these attacks, e.g., the need for reliable cryptographic primi-            ate Scholarship (CGS). The second author is supported in part
tives and awareness for side-channel attack origins. In parallel,          by an NSERC Discovery Grant and an OPC Contributions
Clark and van Oorschot [13] survey issues related to SSL/TLS               Program (Office of the Privacy Commissioner of Canada).
from a cryptographic point of view in the context of HTTPS,
as well as general issues related to current PKI and trust                                                R EFERENCES
model proposals. Recent proposals, e.g., key pinning and                    [1] D. Adrian, K. Bhargavan, Z. Durumeric, P. Gaudry, M. Green, J. A.
HSTS variants, OCSP stapling and short-lived certificates, have                 Halderman, N. Heninger, D. Springall, E. Thomé, L. Valenta, B. Van-
also been evaluated against known issues. Authors note a shift                  derSloot, E. Wustrow, S. Zanella-Béguelink, and P. Zimmermann,
from cryptographic attacks against TLS to attacks on the trust                  “Imperfect forward secrecy: How Diffie-Hellman fails in practice,” in
                                                                                CCS’15, 2015.
model, where valid certificates can be issued by attackers.                 [2] D. Akhawe and A. P. Felt, “Alice in warningland: A large-scale field
     HTTP Strict Transport Security (HSTS [31]) is a simple                     study of browser security warning effectiveness,” in USENIX Security
mechanism to protect against SSL stripping attacks. Kranch                      Symposium, 2013.
                                                                            [3] N. J. AlFardan, D. J. Bernstein, K. G. Paterson, B. Poettering, and
and Bonneau [34] studied how HSTS and key pinning are de-                       J. C. Schuldt, “On the security of RC4 in TLS,” in USENIX Security
ployed in practice, and found that even such simple proposals                   Symposium, 2013.
to enhance the HTTPS security are challenging to implement.                 [4] ArsTechnica.com, “Google Chrome will banish Chinese certificate
We note that key pinning is overridden by Chrome 47.0 when                      authority for breach of trust,” news article (Apr. 1, 2015). http://
the server certificate is signed by an imported root certificate.               arstechnica.com/security/2015/04/google-chrome-will-banish-chinese-
                                                                                certificate-authority-for-breach-of-trust/.
     Huang et al. [29] study the deployment of forward secrecy              [5] ——, “Lenovo PCs ship with man-in-the-middle adware that breaks
(FS) compatible ciphers from the server perspective, and found                  HTTPS connections,” news article (Feb. 19, 2015).
that despite their wide-scale adoption, weak parameters (weak               [6] AV-comparatives.org, “Independent tests of anti-virus software - sum-
keys) are still often negotiated. We did not test whether TLS                   mary reports,” http://www.av-comparatives.org/summary-reports/.
                                                                            [7] ——, “Parental control reviews,” http://www.av-comparatives.org/
proxies interfere with such FS-ciphers.                                         parental-control/.
                                                                            [8] M. Benham, “IE SSL vulnerability,” Bugtraq mailing list (Aug. 5, 2002).
  16 http://netfiltersdk.com/                                                   http://seclists.org/bugtraq/2002/Aug/111.


                                                                      14
 [9] B. Beurdouche, K. Bhargavan, A. Delignat-Lavaud, C. Fournet,                       [41] B. Moeller, T. Duong, and K. Kotowicz, “This POODLE bites: Exploit-
     M. Kohlweiss, A. Pironti, P.-Y. Strub, and J. K. Zinzindohoue, “A messy                 ing the SSL 3.0 fallback,” technical report (Sept. 2014). https://www.
     state of the union: Taming the composite state machines of TLS,” in                     openssl.org/~bodo/ssl-poodle.pdf.
     IEEE S&P, 2015.                                                                    [42] Mozilla, “Dates for phasing out MD5-based signatures and 1024-
[10] H. Böck, “Check for bad certs from Komodia/Superfish,” https://                         bit moduli,” wiki article (Oct. 3, 2013). https://wiki.mozilla.org/CA:
     superfish.tlsfun.de/.                                                                   MD5and1024.
[11] ——, “How Kaspersky makes you vulnerable to the FREAK attack and                    [43] ——, “Mozilla CA certificate policy,” https://www.mozilla.org/en-US/
     other ways antivirus software lowers your HTTPS security,” https://                     about/governance/policies/security-group/certs/policy/.
     blog.hboeck.de/archives/869-How-Kaspersky-makes-you-vulnerable-                    [44] ——, “NSS key log format,” https://developer.mozilla.org/en-US/docs/
     to-the-FREAK-attack-and-other-ways-Antivirus-software-lowers-                           Mozilla/Projects/NSS/Key_Log_Format.
     your-HTTPS-security.html.                                                          [45] ——, “Phasing out certificates with 1024-bit RSA keys,” blog article
[12] C. Brubaker, S. Jana, B. Ray, S. Khurshid, and V. Shmatikov, “Using                     (Sept. 8, 2014). https://blog.mozilla.org/security/2014/09/08/phasing-
     frankencerts for automated adversarial testing of certificate validation                out-certificates-with-1024-bit-rsa-keys/.
     in SSL/TLS implementations,” in IEEE S&P, 2014.
                                                                                        [46] ——, “The POODLE attack and the end of SSL 3.0,” blog arti-
[13] J. Clark and P. C. van Oorschot, “SSL and HTTPS: Revisiting past
                                                                                             cle (Oct. 14, 2014). https://blog.mozilla.org/security/2014/10/14/the-
     challenges and evaluating certificate trust model enhancements,” in
                                                                                             poodle-attack-and-the-end-of-ssl-3-0/.
     IEEE S&P, 2013.
                                                                                        [47] ——, “Revoking trust in one ANSSI certificate,” blog article (Dec.
[14] Comodo.com, “Comodo SSL affiliate the recent RA compromise,” blog
                                                                                             13, 2013). https://blog.mozilla.org/security/2013/12/09/revoking-trust-
     article (Mar. 23, 2011). https://blog.comodo.com/other/the-recent-ra-
                                                                                             in-one-anssi-certificate/.
     compromise/.
[15] ComputerWeekly.com, “PrivDog SSL compromise potentially worse                      [48] ——, “Revoking trust in two TurkTrust certificates,” blog article
     than Superfish,” news article (Apr. 24, 2015).                                          (Jan. 3, 2013). https://blog.mozilla.org/security/2013/01/03/revoking-
[16] Dell.com, “SSL/TLS interception proxies and transitive trust,” http://                  trust-in-two-turktrust-certficates/.
     secureworks.com/cyber-threat-intelligence/threats/transitive-trust/.               [49] P. Mutton, “Governments and banks still using weak MD5-signed SSL
[17] B. Delpy, “mimikatz,” http://blog.gentilkiwi.com/.                                      certificates,” news article (Aug. 31, 2012). http://news.netcraft.com/
[18] DigiCert.com, “Apache SNI browser support,” https://www.digicert.                       archives/2012/08/31/governments-and-banks-still-using-weak-md5-
     com/ssl-support/apache-secure-multiple-sites-sni.htm.                                   signed-ssl-certificates.html.
[19] W. Dormann, “The risks of SSL inspection,” online article (Mar. 13,                [50] D. Naylor, K. Schomp, M. Varvello, I. Leontiadis, J. Blackburn, D. R.
     2015). https://www.cert.org/blogs/certcc/post.cfm?EntryID=221.                          López, K. Papagiannaki, P. Rodriguez Rodriguez, and P. Steenkiste,
[20] T. Duong and J. Rizzo, “Here come the ⊕ ninjas,” technical report (May                  “Multi-Context TLS (mcTLS): Enabling secure in-network functionality
     2011). http://www.hpcc.ecs.soton.ac.uk/~dan/talks/bullrun/Beast.pdf.                    in TLS,” in SIGCOMM’15, 2015.
[21] DuoSecurity.com, “Dude, you got Dell’d,” technical report (Nov. 24,                [51] M. O’Neill, S. Ruoti, K. Seamons, and D. Zappala, “TLS proxies:
     2015). https://duosecurity.com/static/pdf/Dude,_You_Got_Dell_d.pdf.                     Friend or foe?” http://arxiv.org/abs/1407.7146v3.
[22] Z. Durumeric, E. Wustrow, and J. A. Halderman, “ZMap: Fast internet-               [52] Qualys, Inc., “SSL/TLS capabilities of your browser,” https://ssllabs.
     wide scanning and its security applications.” in USENIX Security                        com/ssltest/viewMyClient.html.
     Symposium, 2013.                                                                   [53] M. Qureshi, “April 2015 security updates for Internet Explorer,” blog
[23] D. Fisher, “Malaysian CA Digicert revokes certs with weak keys,                         article (Apr. 14, 2015).
     Mozilla moves to revoke trust,” news article (Nov. 3, 2011).                       [54] I. Ristić, “Is BEAST still a threat?” blog article (Sept. 10,
     https://threatpost.com/malaysian-ca-digicert-revokes-certs-weak-keys-                   2013). https://community.qualys.com/blogs/securitylabs/2013/09/10/is-
     mozilla-moves-revoke-trust-110311/75847.                                                beast-still-a-threat.
[24] Google, “Certificate transparency,” http://certificate-transparency.org.           [55] J. Rizzo and T. Duong, “The crime attack,” in Ekoparty, 2012, http://
[25] ——, “Gradually sunsetting SHA-1,” blog article (Sept. 5, 2014).                         netifera.com/research/crime/CRIME_ekoparty2012.pdf.
     http://googleonlinesecurity.blogspot.ca/2014/09/gradually-sunsetting-              [56] S. Ruoti, M. O’Neil, D. Zappala, and K. Seamons, “At least tell me:
     sha-1.html.                                                                             User attitudes toward the inspection of encrypted traffic,” https://isrl.
[26] R. D. Graham, “Extracting the SuperFish certificate,” http://blog.                      byu.edu/pubs/ruoti2016at.pdf.
     erratasec.com/2015/02/extracting-superfish-certificate.html.                       [57] M. Russinovich, “Inside Windows 7 User Account Control,” 2009,
[27] ——, “Heartleech,” https://github.com/robertdavidgraham/heartleech.                      magazine article. https://technet.microsoft.com/en-us/magazine/2009.
[28] J. Hodges, “howsmyssl,” https://github.com/jmhodges/howsmyssl.                          07.uac.aspx?rss_fdn=TNTopNewInfo.
[29] L. S. Huang, S. Adhikarla, D. Boneh, and C. Jackson, “An experimental              [58] J. Sherry, C. Lan, R. A. Popa, and S. Ratnasamy, “BlindBox: Deep
     study of TLS forward secrecy deployments,” Internet Computing, IEEE,                    packet inspection over encrypted traffic,” in SIGCOMM’15, 2015.
     vol. 18, no. 6, pp. 43–51, 2014.                                                   [59] Softpedia.com, “Chrome 39 disables SSLv3 fallback,” news article
[30] L. S. Huang, A. Rice, E. Ellingsen, and C. Jackson, “Analyzing forged                   (Nov. 19, 2014).
     SSL certificates in the wild,” in IEEE S&P, 2014.
                                                                                        [60] A. Sotirov, M. Stevens, J. Appelbaum, A. Lenstra, D. Molnar, D. A.
[31] IETF, “Internet-Draft: HTTP strict transport security (HSTS),” 2012,                    Osvik, and B. de Weger, “MD5 considered harmful today,” blog article
     RFC 6797 (Standards Track).                                                             (Dec. 30, 2008). https://www.win.tue.nl/hashclash/rogue-ca/.
[32] A. Junestam, C. Clark, and J. Copenhaver, “Jailbreak 4.0,” https://
                                                                                        [61] X. Su, “(CVE-2011-3389) Rizzo/Duong chosen plaintext attack
     github.com/iSECPartners/jailbreak.
                                                                                             (BEAST) on SSL/TLS 1.0 (facilitated by websockets -76),” https://
[33] G. Kopf and P. Kehrer, “CVE-2011-0228 – iOS certificate chain                           bugzilla.mozilla.org/show_bug.cgi?id=665814#c59.
     validation issue in handling of X.509 certificates.”
                                                                                        [62] TheRegister.co.uk, “Hackers break SSL encryption used by millions of
[34] M. Kranch and J. Bonneau, “Upgrading HTTPS in mid-air: An empir-
                                                                                             sites,” news article (Sept. 19, 2011). http://www.theregister.co.uk/2011/
     ical study of strict transport security and key pinning,” in NDSS’15.
                                                                                             09/19/beast_exploits_paypal_ssl/.
[35] J. Liang, J. Jiang, H. Duan, K. Li, T. Wan, and J. Wu, “When HTTPS
     meets CDN: A case of authentication in delegated service,” in USENIX               [63] ——, “Revoking trust in two TurkTrust certificates,” news article (Feb.
     Security Symposium, 2014.                                                               14, 2012). http://www.theregister.co.uk/2012/02/14/trustwave_analysis/.
[36] A. Malhotra, I. E. Cohen, E. Brakke, and S. Goldberg, “Attacking the               [64] TLS-O-Matic.com, “Self testing for web and application developers,”
     Network Time Protocol,” in NDSS’16, 2016.                                               https://www.tls-o-matic.com/.
[37] C. Meyer and J. Schwenk, “SoK: Lessons learned from SSL/TLS                        [65] TopTenReviews.com, “Parental software review,” http://parental-
     attacks,” in Information Security Applications (WISA’13), 2013.                         software-review.toptenreviews.com/.
[38] Microsoft, “CA certificates tools and settings,” https://technet.microsoft.        [66] Trustworthy Internet Movement, “SSL Pulse,” survey (retrieved on Aug.
     com/en-us/library/cc783813%28v=ws.10%29.aspx.                                           3, 2015). https://www.trustworthyinternet.org/ssl-pulse/.
[39] ——, “Key storage and retrieval,” https://msdn.microsoft.com/en-us/                 [67] F. Valsorda, “Superfish, Komodia, PrivDog vulnerability test,” https://
     library/windows/desktop/bb204778%28v=vs.85%29.aspx.                                     filippo.io/Badfish/.
[40] ——, “System store locations,” https://msdn.microsoft.com/en-us/                    [68] M. Vanhoef and F. Piessens, “All your biases belong to us: Breaking
     library/windows/desktop/aa388136%28v=vs.85%29.aspx.                                     RC4 in WPA-TKIP and TLS,” in USENIX Security Symposium, 2015.


                                                                                   15
                       TABLE IV.         S ECURITY ASPECTS RELATED TO ROOT CERTIFICATES INSERTION / REMOVAL , AND FILTERING
                        Certificate gener-   Filtering en-   Reject own root      Insertion in Firefox    Removal during
                                                                                                                            Filtered clients
                        ation time           rollment           certificate          trusted store         uninstallation
   Avast                Installation         Mandatory                                    X                     X           Internet Explorer, Chrome, Firefox
   AVG                  Installation         Mandatory              X1                                          X           Internet Explorer, Chrome
   BitDefender          Installation         Mandatory                                    X                     X           Internet Explorer, Chrome, Firefox
   BullGuard AV         Installation         Unsupported            —                     X                                 —
   BullGuard IS         Installation         Opt-in                 X                     X                                 All
   CYBERsitter          Pre-generated2,3     Opt-in                                       X                                 All
   Dr. Web              Installation         Mandatory                                                                      All
   ESET                 Installation3        Opt-in                                       X                                 All
   G DATA               Installation         Mandatory                                                          X           All
   Kaspersky            Installation         Mandatory                                    X                                 Internet Explorer, Chrome, Firefox
   KinderGate           Installation         Mandatory                                                                      All
   Net Nanny            Installation         Mandatory                                    X                     X           Internet Explorer, Chrome, Firefox
   PC Pandora           Pre-generated        Opt-in                                                             X           Internet Explorer
   ZoneAlarm            Installation         Unsupported            —                                                       —
   1 The product does not filter connections with a proxy-signed certificate, leaving clients to accept the certificate
   2 A pre-generated public key is wrapped in a new certificate during its creation
   3 A root certificate is installed when the relevant option is activated (and removed when deactivated for ESET)



                            A PPENDIX                                                B. OS-provided APIs for key storage
A. Trusted root CA stores                                                                 The legacy Microsoft CryptoAPI (CAPI) and the new
System CA store. All versions of Windows starting from                               Cryptography API: Next Generation (CNG) provide spe-
Windows 2000 [38], provide a Trusted Root Certification                              cialized functions to store, retrieve, and use cryptographic
Authorities certificate store that comes preloaded with a list                       keys [39]. Cryptographic Service Providers (CSP) such as the
of trusted CAs, meeting the requirements of the Microsoft                            Strong Cryptographic Provider in the previous CAPI, and the
Root Certificate Program.17 Updates to this list are generally                       CNG Key Storage Provider (KSP) offer such features. For TLS
provided by Microsoft, but applications and users can add                            filtering, CCAs must store their private keys (corresponding to
additional certificates (only via specific Windows APIs or the                       their root certificates) in the host system to sign site certificates
Windows Certificate Manager). We refer to this store as the                          for browsers on-the-fly. If a CCA uses CSP/KSP to securely
OS trusted (CA) store, which can either be user-dependent,                           store its private key, Windows encrypts the private key using a
service-dependent or machine-wide. The machine-wide trusted                          master key only available to the OS, and stores the ciphertext in
store is located in Windows registry as (key, value) pairs [40]: a                   %ProgramData%\Microsoft\Crypto\RSA\MachineKeys in the
key (Certificates) hosting each trusted certificate as a subkey,                     case of machine-wide RSA private keys. For CCAs using
labeled with the certificate’s SHA1 fingerprint; and a value                         CSP/KSP, we check whether a key is marked as exportable
(Blob) hosting the certificate in the ASN.1 DER format. CCAs                         (by the CCA). Machine-wide keys are exportable only with
import their root certificates in the machine-wide store, making                     admin privileges. If a key is marked non-exportable, it is not
those certificates trusted by the OS and all applications relying                    supposed to be exported even with admin privileges. However,
on the OS trusted store. Importing a root certificate into the                       tools requiring admin/system privileges are available to bypass
machine-wide store requires admin privileges, in which case                          this restriction, e.g., Jailbreak [32] and Mimikatz [17] as we
Windows does not warn users about the security implications                          tested on Windows 7 SP1. Non-exportable keys can be used by
of such a certificate. Importing a root certificate to the current-                  the CAPI or CNG to directly encrypt or decrypt data without
user’s trusted store by a userland application however triggers                      letting the application access the key. Such a method should
a detailed warning, and requires explicit user acceptance. As                        be preferred by CCAs; however our results show otherwise
CCAs obtain admin privileges during installation (e.g., via a                        (see Section VI). In this paper, we consider that exporting
UAC prompt), the insertion of a root certificate into the OS                         OS-protected private keys requires admin privileges. Note that,
trusted store remains transparent to the user.                                       an unprivileged application running under an admin account,
Third-party CA stores. TLS applications may choose to use                            can open the Windows Certificate Manager (run with admin
their own CA store, instead of relying on the OS-provided                            privileges), and then instrument the UI to access an exportable
store (possibly due to not fully trusting the validation process                     private key; such an attempt will not trigger the Windows UAC
as used by Microsoft to accept a root certificate). For example,                     prompt under default UAC settings (under Windows 7, 8.1
Firefox uses an independent root CA list, populated according                        and 10 as we tested), which allow auto-elevating whitelisted
to the Mozilla CA Certificate Policy [43]. In addition to the                        Microsoft tools [57].
OS store, several CCAs also insert their root certificates into                      C. Test certificates with a broken chain of trust
the application stores to filter traffic to/from those applications.
CCAs may check for such applications during installation, and                         1) Self-signed: A simple self-signed certificate. If accepted,
automatically insert their root certificates into selected third-                        trivial generic MITM attacks are possible.
party stores (transparently to users), or simply instruct users                       2) Signature mismatch: The signature of a valid certificate is
to manually add root certificates to application stores.                                 altered. If accepted, the proxy lacks signature verification,
Table IV summarizes which CCA (from the list of tested prod-                             and may allow simple certificate forgery.
ucts in Table V) imports its root certificate in Firefox trusted                      3) Fake GeoTrust CA: A certificate signed by an untrusted
store, along with various details discussed in Section VI-A.                             root certificate that has the same subject name as the
                                                                                         GeoTrust root CA (any OS/browser trusted CA can be
  17 https://technet.microsoft.com/en-ca/library/cc751157.aspx                           used). We also include this fake CA certificate in the


                                                                                16
    certificate chain. The leaf certificate does not specify an            vulnerability or MITM-attack.” Finally, the companies behind
    Authority Key Identifier (AKI), limiting the identification            the most offending products did not reply after four months,
    of the issuer certificate to only its subject name. The                even after a reminder.
    goal is to check if the proxy refers to the correct root
    certificate.                                                           TABLE V.   L IST OF PRODUCTS TESTED . H IGHLIGHTED ENTRIES ARE
 4) Wrong CN: Incorrect Common Name (CN) not matching                       PRODUCTS THAT MAY INSTALL A ROOT CERTIFICATE AND PROXY TLS
                                                                                  CONNECTIONS ; WE ANALYZED ALL SUCH PRODUCTS .
    the domain where it is served from. If accepted, a valid
    certificate for any website could be used to impersonate                 Company               Product                                  Version
    any server.                                                                                           Antiviruses
 5) Unknown CA: A certificate signed by an untrusted root                    Agnitum               Outpost Security Suite Pro                    9.1
                                                                             AhnLab                V3 Internet Security                          8.0
    certificate (e.g., generated by us).                                     Avast                 Internet Security               2015 10.2.2218
 6) Non-CA intermediate: A valid leaf certificate is used as                                                                              10.3.2225
    an intermediate CA to sign a new certificate. If accepted,               AVG                   Internet Security                       2015.0.?
                                                                                                                                       2015.0.6122
    a valid certificate for any website could be used to issue               Baidu                 Antivirus                            2015 5.0.3
    valid certificates for any other websites (cf. early versions            BitDefender           Antivirus Plus                          2015 v8
                                                                             BullGuard             Antivirus                               15.0.297
    of IE [8] and iPhone [33]).                                                                    Internet Security                       15.1.302
 7) X.509v1 intermediate: An X.509 version 1 certificate                                                                                 15.1.307.2
    acting as an intermediate CA certificate. X.509v1 does                   Checkpoint            ZoneAlarm Security Suite         2015 13.4.261
                                                                             Comodo                Antivirus Advanced                            8.1
    not support setting a basicConstraints parameter to limit a                                    Internet Security                             8.1
    certificate to be a leaf. If accepted, any valid v1 certificate          CMC                   Internet Security                           2012
    could be used to issue any other certificates.                           Dr. Web               Security Space                                 10
                                                                             Emsisoft              Anti-Malware                                  9.0
 8) Revoked: We rely on https://revoked.grc.com to test the                  eScan                 Internet Security Suite                      14.0
    revocation support. This website delivers a revoked certifi-             ESET                  Smart Security                         8.0.312.0
                                                                                                                                          8.0.319.0
    cate with the necessary extensions to refer to the signing               F-Secure              SAFE                             2.15 build 364
    CA’s CRL list and OCSP server (both would report the                     G DATA                Antivirus                         2015 25.0.0.2
    certificate as revoked). Revocation is particularly useful                                                                              25.1.0.3
                                                                             K7 Computing          K7 Internet Security                  14.2.0.249
    in cases where legitimate certificates are issued after a                                      K7 Total Security Pro                 14.2.0.249
    security breach at a CA, e.g., Comodo [14].                              Kaspersky             Antivirus                             15.0.2.361
 9) Expired: A certificate with a past “valid-before” date.                                                                              16.0.0.614
                                                                             Kingsoft              Antivirus                                   2010
                                                                             McAfee                Internet Security                            12.8
D. Company responses                                                         Norman                Security Suite                                 11
    The companies behind the products that we tested are listed              Output                Total Security                        1.1.4304.0
                                                                             Panda Security        Antivirus Pro                               2015
in Table V. We contacted all affected companies except Avast                                       Internet Security                           2015
(as its lack of revocation checking is not serious enough).                  Qihoo                 360 Internet Security                 5.0.0.5104
Among the 12 emails we sent, we received an acknowledgment                                         360 Total Security                    6.0.0.1140
                                                                             Quick Heal            Internet Security               16.00 (9.0.0.20)
from seven companies (beyond a simple automatic reply), and                  Sophos                Endpoint Security                            10.3
received a detailed reply in four cases. Among these four                    TGSoft                VirIT                              Lite 7.8.51.0
                                                                             Total Defense         Internet Security Suite                9.0.0.141
replies, two antivirus companies were already aware of the                   TrendMicro            Internet Security                             8.0
bugs we reported and had fixed them in more recent releases of               TrustPort             Total Security                 2014 14.0.5.5273
their software. One reply from a parental control software com-                                    Internet Security              2015 15.0.3.5432
                                                                             VIPRE                 Internet Security                 2015 8.2.1.16
pany highlighted several discrepancies and misconceptions.                   Webroot               SecureAnywhere                           8.0.7.33
For example, our tests on the latest version of the product                                       Parental control applications
on Windows 7 SP1 with patches for Schannel against BEAST                     Awareness Tech        WebWatcher                           8.2.30.1147
                                                                             BlueCoat              K9 Web Protection                         4.4.276
and FREAK reveal that it supports at most TLS 1.0 when                       ContentWatch          Net Nanny                                  7.2.4.2
connecting to remote websites. However, the company states                                                                                    7.2.6.0
that “In fact, Net Nanny supports up to TLS v1.2.”, and further              Cybits Ag             JuSProg                                 6.1.0.106
                                                                             Fortinet              FortiClient                                    5.2
adds that the “*real* server connection is established with                  Entensys              KinderGate Parental Control        3.1.10058.0.1
the highest settings we can use without being rejected.” Also,               KinderServer AG       KinderServer                                   1.1
                                                                             LavaSoft              Ad-Aware Total Security                         11
while the FREAK attack is an implementation flaw in some                     McAfee                SafeEyes                                6.2.119.1
TLS libraries that allows an attacker to force both parties                  Norton                Family                                       3.2.1
to agree on export-grade ciphers, the company states that                    Pandora Corp          PC Pandora                                  7.0.22
                                                                             Profil                Parental Filter                                  2
“FREAK and logjam are again, due to having to support old                    Salfeld               Child Control                       2014 14.644
browsers/servers.” The last parental control software company                Solid Oak Software    CYBERsitter                                     11
simply downplayed the risks as their software does not filter                SpyTech               SpyAgent                                         8
                                                                             TuEagles              AntiPorn                                      2.15
sensitive websites by default (but can be configured to do so).              Verify                Parental Control                              1.15
They wrote: “That’s why our users are not affected by any                    Witigo                Parental Filter                                  ?




                                                                      17
