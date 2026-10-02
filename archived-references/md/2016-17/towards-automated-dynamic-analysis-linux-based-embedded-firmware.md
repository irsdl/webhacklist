---
type: Whitepaper
title: Towards Automated Dynamic Analysis for Linux-based Embedded Firmware
description: FIRMADYNE emulates Linux-based firmware images from routers, cameras and other network devices so their services can be exercised dynamically at scale rather than only read statically. Run against 23,035 images from 42 vendors, it confirmed exploitable flaws including command injection and remote code execution in hundreds of devices.
resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf"
tags: [whitepaper, webseclist-reference, dynamic-analysis, tooling, command-injection, rce, large-scale-scan, measurement-study, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:35:40+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf"
    title: Towards Automated Dynamic Analysis for Linux-based Embedded Firmware
    author: Daming D. Chen, Manuel Egele, Maverick Woo, David Brumley
also_at: []
authors:
  - Daming D. Chen
  - Manuel Egele
  - Maverick Woo
  - David Brumley
canonical_url: ""
cited_by:
  - "2016-17.md:68"
commit: ""
content_sha256: 1c2ba94ee38376ff5cce6c78c9222a5a59beee2bae319a836f45c580798312f7
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: a88844595fe037215474deb87860cf29ebd3b68d5b832d3b3089b24ef800f888
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:35:40+00:00"
slug: towards-automated-dynamic-analysis-linux-based-embedded-firmware
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Towards Automated Dynamic Analysis for Linux-based Embedded Firmware

**Towards Automated Dynamic Analysis for Linux-based Embedded Firmware** - Daming D. Chen, Manuel Egele, Maverick Woo, David Brumley, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/towards-automated-dynamic-analysis-linux-based-embedded-firmware.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Towards Automated Dynamic Analysis for Linux-based Embedded Firmware

Towards Automated Dynamic Analysis for
                   Linux-based Embedded Firmware

                                Daming D. Chen∗ , Manuel Egele† , Maverick Woo∗ , and David Brumley∗
                                                                ∗ Carnegie Mellon University

                                                          {ddchen, pooh, dbrumley}@cmu.edu
                                                                   † Boston University

                                                                   {megele}@bu.edu

   Abstract—Commercial-off-the-shelf (COTS) network-enabled                         to the Internet at an alarming rate. Commodity networking
embedded devices are usually controlled by vendor firmware                          equipment such as routers and network-attached storage boxes
to perform integral functions in our daily lives. For example,                      are joined by IP cameras, thermostats, or even remotely-
wireless home routers are often the first and only line of defense                  controllable power outlets. These devices frequently share
that separates a home user’s personal computing and information                     certain technical characteristics, such as embedded system
devices from the Internet. Such a vital and privileged position in
the user’s network requires that these devices operate securely.
                                                                                    on a chip (SOC) designs based on ARM or MIPS CPUs,
Unfortunately, recent research and anecdotal evidence suggest                       network connectivity via Ethernet or WiFi, and a wide variety
that such security assumptions are not at all upheld by the devices                 of communication interfaces such as GPIO, I2C, or SPI.
deployed around the world.                                                          Nevertheless, many of these devices are controlled by vendor
                                                                                    and chipset-specific firmware that is rarely, if ever, updated to
     A first step to assess the security of such embedded device
                                                                                    address security vulnerabilities affecting these devices.
firmware is the accurate identification of vulnerabilities. However,
the market offers a large variety of these embedded devices,                            Unfortunately, the poor security practices of these device
which severely impacts the scalability of existing approaches in                    vendors are only further exacerbated by the privileged network
this area. In this paper, we present FIRMADYNE, the first                           position that many of these devices occupy. For example, a
automated dynamic analysis system that specifically targets Linux-                  wireless router is frequently the first and only line of defense
based firmware on network-connected COTS devices in a scalable
                                                                                    between a user’s computing equipment (e.g., laptops, mobile
manner. We identify a series of challenges inherent to the dynamic
analysis of COTS firmware, and discuss how our design decisions                     phones, and tablets) and the Internet. An attacker that succeeds
address them. At its core, FIRMADYNE relies on software-based                       in compromising such a networking device is able to gain
full system emulation with an instrumented kernel to achieve the                    access to the user’s network, and can further reconfigure the
scalability necessary to analyze thousands of firmware binaries                     device to tamper with arbitrary network traffic. Since most
automatically.                                                                      vendors have not taken any initiative to improve the security of
    We evaluate FIRMADYNE on a real-world dataset of 23,035
                                                                                    their devices, millions of home and small business networks are
firmware images across 42 device vendors gathered by our system.                    left vulnerable to both known and unknown threats. As a first
Using a sample of 74 exploits on the 9,486 firmware images that                     step towards improving the security of commodity computer
our system can successfully extract, we discover that 887 firmware                  equipment, we propose to address the challenge of accurately
images spanning at least 89 distinct products are vulnerable to one                 identifying vulnerabilities in embedded firmware head-on.
or more of the sampled exploit(s). This includes 14 previously-
unknown vulnerabilities that were discovered with the aid of
                                                                                        Previous research on the security of embedded firmware
our framework, which affect 69 firmware images spanning at                          can be categorized based on various analysis approaches. For
least 12 distinct products. Furthermore, our results show that                      example, Zaddach et al. [19] perform dynamic analysis by
11 of our tested attacks affect firmware images from more than                      partially offloading execution of firmware to actual hardware.
one vendor, suggesting that code-sharing and common upstream                        While such an approach is precise, it incurs significant hurdles
manufacturers (OEMs) are quite prevalent.                                           for large-scale analysis. First, the requirement that the analyst
                                                                                    must obtain the physical hardware for the device under
                           I.    I NTRODUCTION                                      test poses a significant financial burden. Second, and more
                                                                                    importantly, the manual effort needed to identify and interface
    With the proliferation of the so-called “Internet of Things”,
                                                                                    with the debugging port on the device places strict limits on the
an increasing number of embedded devices are being connected
                                                                                    scalability of this technique, especially for consumer equipment
                                                                                    that may not support hardware debugging functionality.
Permission to freely reproduce all or part of this paper for noncommercial
purposes is granted provided that copies bear this notice and the full citation
                                                                                       In contrast, Costin et al. [8] utilize static analysis techniques
on the first page. Reproduction for commercial purposes is strictly prohibited      to unpack the firmware of embedded devices and identify
without the prior written consent of the Internet Society, the first-named author   potentially vulnerable code or binaries inside. While this
(for reproduction of an entire paper only), and the author’s employer if the        approach scales to thousands of firmware images, it suffers
paper was prepared within the scope of employment.                                  from the classic trade-offs of static analysis. Namely, either the
NDSS ’16, 21-24 February 2016, San Diego, CA, USA
Copyright 2016 Internet Society, ISBN 1-891562-41-X                                 analysis is very generic and produces a large number of false
http://dx.doi.org/10.14722/ndss.2016.23415                                          positives [5], or the analysis is too specific and results in many
false negatives. Additionally, static analysis techniques based on                           FTP
program analysis usually target a specific problem domain, such                              Sites
as the C, PHP, or Java programming language, or alternatively                           Support
                                                                                        Websites                                                  Filesystem      Kernel
binary code. Unfortunately, commodity networking equipment
typically contains an amalgamation of various programs and
scripts, written in a variety of compiled or interpreted pro-
gramming languages. Oftentimes, custom modifications are
even made to the language runtime to cater to the unique
requirements of embedded systems.                                                                                          MIPS
                                                                                                                      Little-Endian
    To overcome the shortcomings of previous work in this area,              Architecture                                                                        Initial
we leverage software-based full system emulation to enable                  Identification                                                                     Emulation

large-scale and automated dynamic analysis for commodity
                                                                                                eth0: 192.168.1.100
embedded firmware. Since our approach does not rely on                                          eth1: 192.168.1.101                   && cat 0xDEADBEEF
                                                                                                eth2: 192.168.1.102
physical hardware to perform the analysis, it scales with
                                                                              Exploit                                  Network                              Network
additional computational resources. Additionally, our full                  Verification                              Reachable                           Identification
system emulation approach transparently provides dynamic
analysis capabilities, regardless of the programming language
used to develop a specific application or script. Furthermore, we
inherit the precision of other dynamic analysis techniques—if            Fig. 1: Architectural diagram of FIRMADYNE showing
the analysis finds that a firmware image contains a vulnerability,       the emulation life-cycle for an example firmware image, as
then it provides actionable results in the form of a successful          described in §II-A.
exploit. Finally, we address a number of challenges that are
characteristic for embedded devices, such as the presence of
various hardware-specific peripherals, storage of persistent con-
figuration in non-volatile memory (NVRAM), and dynamically-
                                                                         FIRMADYNE is automated, it was straightforward to integrate
generated configuration files.
                                                                         a subset of the existing exploits from the popular Metasploit
    We implemented FIRMADYNE to demonstrate our ap-                      Framework [2].
proach to automated dynamic analysis. Using firmware image
files distributed on vendor support websites, we automatically               Using these results, we observe that the most prolific exploit
unpack the contents to identify the kernel and extract the               affects the firmware of up to five different vendors, and the most
filesystem. Since the majority of these extracted firmware are           effective exploit affects 10% of all network inferred firmware
Linux-based, we initially focus on support for Linux-based               images in our dataset. While code-reuse of vulnerable open-
firmware by pre-compiling modified Linux kernels. Using                  source applications is one explanation, our attacks also affect
the QEMU [4] full system emulator, we are able to boot our               applications whose source is not publicly available, suggesting
instrumented kernels with the extracted filesystem from the              that code-sharing and common upstream manufacturers (OEMs)
original firmware images. In order to collect a dataset of these         are quite prevalent.
firmware images, FIRMADYNE includes a web crawler that
automatically downloads metadata and firmware images from
various vendor websites, which are then fed into the dynamic                To summarize, the contributions of this work are as follows:
analysis system.
                                                                           • We present FIRMADYNE, our implementation of an
     However, even with full system emulation, an emulated
                                                                             automated and scalable dynamic analysis technique specif-
environment must be configured correctly to interact with the
                                                                             ically designed to accurately identify vulnerabilities in
network interfaces of the guest firmware. Therefore, our system
                                                                             Linux-based embedded firmware (§II).
initially emulates the guest in an isolated network environment,
                                                                           • Our implementation of FIRMADYNE addresses char-
and monitors all network interactions to infer the correct
                                                                             acteristic challenges of embedded systems, such as the
configuration for subsequent analyses. Once this information
                                                                             presence of hardware-specific peripherals, usage of non-
is collected, FIRMADYNE will re-configure the emulated
                                                                             volatile memory (NVRAM), and creation of dynamically-
environment with the inferred network configuration, enabling
                                                                             generated files (§IV).
network interaction between the emulated guest firmware and
                                                                           • We gathered a dataset of 23,035 firmware images down-
the analysis host.
                                                                             loaded from 42 different vendors, and evaluated FIR-
    With the aid of our analysis and introspection capabilities,             MADYNE on the 9,486 firmware images that were
we identified 14 previously-unknown vulnerabilities for which                successfully extracted, using a set of 14 previously-
we were able to manually develop proof-of-concept exploits.                  unknown and 60 known exploits (§V).
Of these, across our dataset of 23,035 firmware images                     • In support of open science, we make our system available
gathered from 42 device vendors, we identified 69 vulnerable                 to the research community under an open-source license
firmware images spanning at least 12 distinct products from                  to encourage further research into embedded systems.
the 9,486 firmware images that were successfully extracted.                  For more information, please see https://github.com/
Since the process of emulating and testing firmware images in                firmadyne/.


                                                                     2
                       II.   OVERVIEW                                   of FIRMADYNE by seamlessly integrating 60 known exploits
                                                                        mostly from the popular Metasploit [2] exploit framework. In
    In this section we describe the design of various components
                                                                        total, both vulnerability types affect 887 firmware images from
that comprise FIRMADYNE, and our motivations for such an
                                                                        our dataset.
architectural design.
                                                                        B. Motivation
A. Components
                                                                            Dynamic analysis targeting embedded system firmware
   As depicted in Fig. 1, FIRMADYNE consists of four major
                                                                        addresses a variety of design points in the abstraction hierarchy
components.
                                                                        of embedded systems. We discuss a selection of potential
    1) Crawling Firmware: The first and largely independent             vantage points for such analysis, illustrate challenges and
component is a web crawler, which downloads firmware images             shortcomings, and argue why dynamic analysis based on full
from vendor websites. At present, we support 42 device vendors          system emulation is the most promising approach to tackle this
(see §IV-A). We manually wrote parsing templates for each of            challenge.
these websites, allowing us to distinguish between firmware
                                                                            1) Application-Level: Perhaps the most straightforward
images and other binary content. This targeted crawling effort
                                                                        approach is to statically extract application-specific data, and
provided us with metadata for each gathered firmware image,
                                                                        execute it natively with a supported application. For example, it
including information such as the build date, release version,
                                                                        is possible to copy the webpages served by a web server within
and links to Management Information Base (MIB) files for
                                                                        an embedded system, and serve the content using a regular
the Simple Network Management Protocol (SNMP). Such
                                                                        web server such as Apache. Unfortunately, this approach has
metadata proved useful for our automated analyses and exploit
                                                                        multiple drawbacks that are incompatible with our design goal
development (see §V-B3). For dynamic websites that were
                                                                        of creating a generic platform for dynamic analysis of embedded
difficult to crawl automatically, we instead crawled the vendor’s
                                                                        firmware.
FTP site, at the expense of no metadata.
                                                                            An analysis of the firmware images in our dataset shows
    2) Extract Firmware Filesystem: In the second step, FIR-
                                                                        that many of these contain webpages which rely on non-
MADYNE uses a custom-written extraction utility built around
                                                                        standard extensions to server-side scripting languages (e.g.,
the binwalk [1] API to extract the kernel (optional) and the
                                                                        PHP) for access to hardware-specific functionality, such as
root filesystem contained within a firmware image (see §IV-B).
                                                                        NVRAM values. For example, hundreds of images in our
     3) Initial Emulation: Once a filesystem is extracted, FIR-         dataset make use of the custom functions get_conf()
MADYNE identifies the hardware architecture of the firmware             in PHP and nvram_get() in ASP.NET to obtain device
image; in Fig. 1, we have chosen MIPS Little-Endian                     configuration values. Unfortunately, this functionality is a
as an example. Then, our system uses a pre-built Linux kernel           custom addition to the web server that is not supported by
in an instance of the QEMU full system emulator that matches            their upstream open-source counterparts. Additionally, other
the architecture, endianness, and word-width of the target              firmware images do not place these webpages on the filesystem,
firmware image. Currently three combinations are supported:             but instead embed their HTML content within the binary of a
little-endian ARM, little-endian MIPS, and big-endian MIPS.             custom web server.
An initial emulation is performed to infer the system and
                                                                            Finally, an analysis approach focused on application-data
network configuration, shown as three IP address assignments
                                                                        can only detect vulnerabilities within the application-specific
to eth0, eth1, and eth2 for the example in Fig. 1. This
                                                                        data (e.g., command injection vulnerabilities in PHP files), but
is achieved by intercepting system calls to the filesystem,
                                                                        not those present within the original application or other system
networking, and other relevant kernel subsystems.
                                                                        components.
    4) Dynamic Analysis: The forth and final step can be
                                                                            2) Process-Level: Another feasible approach for analyzing
repeated for any dynamic analysis supported by FIRMADYNE.
                                                                        embedded systems is to emulate the behavior of individual
To this end, the environment is dynamically reconfigured to
                                                                        processes within the context of the original filesystem. This
match the expectations of the firmware image (see §IV-C)
                                                                        can be achieved by executing QEMU in user-mode as a single
as inferred in the previous step. Note that FIRMADYNE
                                                                        process emulator, constrained using chroot to the original
is designed for easy extensibility to include new dynamic
                                                                        filesystem. Thus, one could simply launch the original web
analyses or exploits. The results of each individual analysis are
                                                                        server from the firmware image in QEMU, and then that process
aggregated in a database for ease of inspection. In the example
                                                                        would emulate the router web interface.
above, shown in Fig. 1, a command injection vulnerability is
being tested on the target firmware image.                                  Unfortunately, this approach only partially obviates the
                                                                        concerns mentioned above. While an application would be
    To illustrate this versatility, we have developed three
                                                                        able to execute within the context of the filesystem, specific
vulnerability detection passes, which are able to assist in
                                                                        hardware peripherals (e.g., NVRAM) are still unavailable. As
finding vulnerabilities and precisely identify whether a given
                                                                        a result, when an application attempts to access the NVRAM
exploit succeeds by monitoring events from our instrumented
                                                                        peripheral via /dev/nvram, it will likely terminate in error.
kernel. These passes helped us detect 14 previously unknown
vulnerabilities, which were automatically confirmed to affect               Similarly, minor differences in the execution environment
69 firmware images, based on proof-of-concept exploits that             can have a significant effect on program behavior. For example,
we developed (see §V-B). We further demonstrate the flexibility         the alphafs web server used by multiple firmware images

                                                                    3
verifies hardware-dependent product and vendor IDs before                 hardware platform. Using the system boot sequence provided
accessing NVRAM. If these values are not present at prede-                by the init and rcS binaries on the original filesystem, we
termined physical memory addresses, the web server ceases                 are able to initialize user space to a state consistent with the
operation and terminates with an error message. To this end, the          original device, despite platform changes.
web server uses the mmap() system call to access memory via
                                                                              Our results (see §V-A) show that this approach is successful
/dev/mem, and checks specific offsets for the ProductID
                                                                          for initial emulation of over 96.6% of all Linux-based firmware
and VendorID of supported EEPROM chips.
                                                                          images in our dataset. This is likely due to the stable and
    Emulating such behavior with a user-mode emulator would               consistent interface between user-space and kernel on Linux
be complex, as the emulator would need to track file handles and          systems, with the exception of custom IOCTL’s introduced by
system calls that map memory to determine program behavior.               vendor-specific kernel modules. In fact, Linux kernel developers
Then, the emulator would need to identify the semantic                    will revert kernel changes that break backwards-compatibility
definition of various memory addresses, and replace the values            for user-space applications; for example, programs built for
as appropriate (e.g., a valid ProductID and VendorID).                    pre-0.9 (pre-1992) kernels will still function correctly even on
                                                                          the latest kernel releases.1
    Additionally, due to limited write cycles on the primary
storage device, many firmware images mount a temporary                        However, this does not hold for kernel modules; indeed,
memory-backed filesystem at boot for volatile data. This                  one of the drawbacks of our current implementation is the lack
filesystem is mounted and generated dynamically. As a result,             of emulation support for out-of-tree kernel modules located on
the directories /dev/ and /etc/ may be symbolic links to                  the filesystem and so differences in kernel version may result
subdirectories within the temporary filesystem, thus appearing            in system instability. Nevertheless, our dataset shows that such
broken when examined statically. For example, the firmware                support is generally not necessary, as more than 99% of all
for the D-Link DIR-865L wireless router uses a startup                    out-of-tree kernel modules within the firmware images in our
script to populate configuration for applications, including the          dataset are not useful for our system (§V-A3). One major reason
lighttpd web server. This configuration file is then passed to            is because newer kernels, such as those that we build, provide
the web server binary with the ‘-c’ command line argument.                in-tree equivalents for functionality previously developed as
As a result, simple dynamic emulation of the lighttpd binary              out-of-tree extensions. In particular, 58.8% of out-of-tree kernel
will fail, even with the original filesystem in place.                    modules are used to implement various networking protocols
                                                                          and filtering mechanisms that may not have been present in
    These types of environmental differences can have a                   older kernels, and 12.7% provide support for specific hardware
significant effect on the presence of vulnerabilities. For example,       peripherals. For example, older 2.4-series mainline kernels
many information disclosure vulnerabilities can simply be fixed           lacked netfilter connection tracking and NAT support for
with proper access control policies. Likewise, the effect of              various application-specific protocols such as TFTP, G.323,
a directory traversal attack on a web server can be greatly               and SIP, which became available in-tree around kernel version
affected by the system configuration.                                     2.6.20. In comparison, the third-party NetUSB kernel module,
    Although this approach is clearly more accurate than the              which was recently identified to contain a remotely-exploitable
previous approach, it should be apparent that it suffers from a           buffer overflow vulnerability, comprises less than 0.2% of all
number of shortcomings due to low emulation fidelity. Without             kernel modules from our dataset (§V-A3).
precise knowledge of the runtime system environment, the
host environment can inadvertently affect dynamic analysis of                                        III.    C ONCEPT
individual processes by altering program execution.                           This section provides an overview of the concept behind our
    3) System-Level: In comparison, a system-level emulation              dynamic analysis framework for Linux-based firmware images.
approach is able to overcome the aforementioned challenges.               For specific challenges encountered and implementation details,
Expected interfaces to hardware peripherals will be present,              please see §IV.
allowing their functionality to be gracefully emulated. Accurate
emulation of the system environment permits dynamically-                  A. Architecture
generated data to be created in the same manner as on the real                As shown in Fig. 1, our system features a firmware
device. All processes launched by the system can be analyzed,             repository server that is used to store the binaries corresponding
including various daemons responsible for protocols such as               to each firmware image and a database that keeps track of
HTTP, FTP, and Telnet.                                                    information pertaining to each firmware image. This includes
    During the design process, we explicitly chose full system            the extraction status, architecture, brand of each image, as well
emulation as the basis for FIRMADYNE for these reasons.                   as each file within a given image.
By leveraging the built-in hardware abstraction provided by                   A set of virtualized worker nodes are used to extract the
the kernel, we replace the existing kernel with our modified              root filesystem and kernel (optional) from each firmware image.
kernel specifically designed and instrumented for our emulation           Throughout this process, the database is updated with the
environment. Then, in conjunction with a custom user-space                current experiment progress. If the extraction is successful,
NVRAM implementation, we boot the extracted filesystem                    the firmware repository will cache the archived filesystem.
and our pre-built kernel within the QEMU full system emulator.            Next, these workers enter the learning phase, where firmware
Otherwise, booting the original kernel would result in a fatal
execution crash, since it is only compiled to support a specific            1 https://www.kernel.org/doc/Documentation/stable_api_nonsense.txt




                                                                      4
images are assigned a default configuration and the networking           FIRMADYNE launches the emulated firmware image and
interactions are recorded. This allows our system to infer the           performs a series of network connectivity checks.
correct emulated network environment. Finally, the workers
enter the analysis phase, where each firmware image is emulated          E. Automated Analyses
with the inferred network environment, and individual analyses
are performed.                                                               We implemented three basic automated analysis passes
                                                                         within our dynamic analysis framework in order to demonstrate
B. Acquisition                                                           the effectiveness of our system. These contributed to our
                                                                         detection of 14 previously-unknown vulnerabilities that affect
    In order to gather a representative dataset of firmware              69 firmware images, and a total of 74 vulnerabilities that affect
images, we developed a custom web crawler. Instead of using              887 firmware images (see §V).
a blind crawling methodology, we wrote smart parsers for the
support pages of each of our 42 preselected vendors (§A). This
allowed us to distinguish between firmware updates and unde-                                IV.   I MPLEMENTATION
sired binaries such as drivers, configuration utilities, and other           This section discusses the implementation behind each of
binaries. Additionally, with a better semantic understanding             the components mentioned in §II-A and §III.
of the target website, we recovered important metadata about
each firmware image, such as vendor, product name, release
date, version number, changelog, etc.                                    A. Acquisition

    Where applicable, this was supplemented with probable                    Our custom web crawler was developed using the Scrapy
firmware images that were mirrored from the FTP websites                 framework, with an individual spider written for each of
of target vendors. Although this latter source of firmware was           the 42 vendors in our dataset. To increase representativeness,
less rich in metadata, it provided us with additional binaries           our dataset includes vendors for networking products ranging
that were not directly accessible for all end-users, including           from consumer to professional network equipment, such as
betas and test binaries with limited releases. A few brands of           IP cameras, routers, access points, NAS’s, smart TV’s, cable
firmware images, for which it was difficult to automate, or              modems, satellite modems, and even third-party or open-source
when the vendors did not provide direct firmware downloads               firmware. We created individual parsers for the support pages
for end-users, were gathered by hand.                                    of each vendor using XPath selectors to enumerate and expand
                                                                         specific elements of input webpages. In addition, we also
                                                                         attempted to crawl multiple geographic locations of each
C. Extraction
                                                                         vendor’s website, including United States (English), China
    We developed a custom extraction utility using the API               (Chinese), Russia (Russian), European (English), Germany
of the binwalk firmware extraction tool to recover the root              (German), and South Africa (English).
filesystem and (optionally) kernel from each firmware image.
                                                                             Some vendors that made heavy use of dynamically-
These were normalized by storing them as compressed TAR
                                                                         generated content on their websites, such as D-Link and ZyXEL,
archives within our firmware repository.
                                                                         were crawled through their FTP mirror site instead. Only
                                                                         FTP files that appeared relevant were downloaded, which was
D. Emulation                                                             generally limited to the following filename extensions: img,
    Once the root file system has been extracted from a firmware         chk, bin, stk, zip, tar, sys, rar, pkg, and rmt. Other
image, FIRMADYNE performs a series of analysis steps to                  vendors, such as Cisco, which made their website difficult to
infer the system configuration expected by the firmware image.           automatically crawl, or limited most firmware downloads to
                                                                         customers with valid support contracts, were manually crawled.
    First, we examine the ELF header of binaries located within          Supported metadata fields that were automatically gathered
the extracted root filesystem to identify the target architecture        from vendor websites include the product name, vendor name,
and endianness. For each firmware image, we use the QEMU                 version, build, date, changelog, SNMP MIB file, source code
full system emulator for the corresponding architecture to boot          URL, and firmware image URL. This allows us to distinguish
the extracted filesystem with a matching kernel. Currently, we           between multiple products that share the same firmware image,
have pre-compiled kernels for ARM little-endian, MIPS little-            since we deduplicate downloaded firmware image binaries.
endian, and MIPS big-endian platforms, as our data shows that            However, not all vendors had such information available, and
these architectures constitute 90.8% of our dataset (§V-A1).             no metadata was available for vendors crawled through FTP
                                                                         or manually.
   Next, during the initial emulation phase, the system is
executed in a special “learning” mode, in which our modified
kernel records all system interactions with the networking               B. Extraction
subsystem, including IP address assignments for individual
network interfaces.                                                          Through manual experimentation, we determined that the
                                                                         built-in recursive extraction mechanism (“Matryoshka”) within
   Finally, after collecting this information, FIRMADYNE                 binwalk was insufficient for our purposes. In particular, this
enters the actual emulation phase, in which a matching                   extraction was vulnerable to path explosion by attempting
network environment is configured to communicate with the                to recursively extract compressed data from within an ELF
emulated firmware. To verify successful network configuration,           executable or every file within a filesystem, and not guaranteed

                                                                     5
to terminate, especially in the presence of false positive                    In contrast, we utilize tools that are specifically written
signature matches.                                                        to extract the contents of these modified filesystems from
                                                                          userspace. sasquatch, which was developed by the author
    Instead, we developed a custom goal-driven extraction utility         of binwalk, is designed to support as many modified
using the binwalk API that minimized disk space and runtime               SquashFS implementations as possible by adapting to changes
by terminating when our extraction goals were achieved; namely            in compression algorithms, and recognizing the structure of
obtaining root filesystem and (optionally) kernel from within             SquashFS filesystems instead of specific magic strings.
each firmware image. In addition, we implemented a set of
heuristics for early detection of non-firmware files, which                   During this process, we identified a number of bugs and
would otherwise waste computational resources. This included              made improvements to both binwalk and jefferson,
blacklisting input files that were any type of structured binary,         which were submitted to the respective upstream projects. The
including PE32 executables for Windows, ELF executables for               majority of our submitted patches have already been merged
Linux, and universal binaries for Macintosh, as well as bytecode          into the official release, and some are still pending maintainer
and relocatable objects. Other common formats that were                   review.
excluded included PDF files and Microsoft Office documents,                   Although these improvements contribute to our success
which would otherwise appear as compressed archives that                  rates, not all firmware images can be extracted by our current
require recursive extraction.                                             implementation. For example, some vendors only distribute
    After blacklist verification, the extraction process used a set       partial firmware images for their products, preventing us from
of priority-ranked signatures that were executed sequentially in          reconstructing the root filesystem. Other vendors distribute
the order of confidence. These signatures can be categorized              firmware images with multiple embedded or partial filesystems,
as follows: archive formats, firmware headers, kernel magic               which require additional logic to reassemble partial filesystems,
or version strings, UNIX-like root filesystems, and finally               or filesystems mounted on top of one another. Furthermore,
compressed data. Matches for archive formats or compressed                other vendors distribute encrypted firmware images, firmware
data were then extracted recursively. We verify that UNIX-like            images within a binary updater executable, non-Linux-based
root filesystems are successfully extracted by checking for the           firmware images, or Linux-based firmware images with un-
presence of at least four standard root directories from a subset         recognized filesystems, all of which we do not support. As a
of the Filesystem Hierarchy Standard2 .                                   result, these images are categorized as unknown in Table II.

    Our method allowed us to reduce the effect of false positive          C. Emulation
signature matches by prioritizing higher-confidence signature                 1) NVRAM: From a cursory inspection, at least 52.6% of
matches (e.g., firmware headers) over more generic signature              all extracted firmware images (4,992 out of 9,486) access a
matches (e.g., compressed GZIP data). For example, if upstream            hardware non-volatile memory (NVRAM) using a shared library
binwalk detects compressed data within the kernel image of                named libnvram.so to persist device-specific configuration
a firmware image and recursive extraction is enabled, it will             parameters. For routers and other networking equipment,
waste resources attempting to fully extract this data.                    this includes settings shown on the web-based configuration
    Another improvement that we made to the extraction process            interface, which can include wireless network settings, network
was utilizing the third party jefferson and sasquatch                     adapter MAC addresses, and access credentials for the web
extraction tools for JFFS2 and SquashFS filesystems, re-                  interface.
spectively, which can be difficult to extract. This is because the            Since this peripheral is typically abstracted as a key-
userspace extraction utilities provided by filesystem developers,         value store, we developed a custom userspace library that
jffsdump and unsquashfs, frequently fail to extract real-                 intercepts calls to NVRAM-related functions, such as const
world filesystems of these types.                                         char *nvram_get(const char* key) and int
                                                                          nvram_set(const char* key, char *val), which
    In part, this is because these user-mode extraction utilities
                                                                          are respectively used to get and set parameters from NVRAM.
are rarely updated and can lag behind the in-kernel filesystem
                                                                          By modifying the system environment passed by the kernel
code in terms of filesystem support. More importantly, many
                                                                          to the init binary to include this library via LD_PRELOAD,
device manufacturers have modified existing compression
                                                                          we ensure that all userspace processes inherit the same
algorithms or even implemented new compression algorithms
                                                                          environment, since they are child processes of init. A
for these filesystems, making their variants incompatible with
                                                                          temporary mountpoint on the filesystem is used as the root of
other implementations.
                                                                          our key-value store, allowing us to reimplement this interface
    To resolve this problem, other firmware extraction utilities          in userspace without emulating hardware-specific peripherals.
such as bat and firmware-mod-kit rely on a set of                             During testing, a common challenge we encountered was
heuristics and precompiled unsquashfs binaries gathered                   that our dataset of firmware images was compiled with different
from the GPL source code releases for various routers. However,           C toolchains, some of which we do not have access to. As
this approach is incomplete and ineffective, as maintainers for           shown in §V-A, this diversity was problematic for our shared
these extraction utilities need to manually compile new binaries          library, since all dynamically-loaded ELF binaries must specify
and implement the appropriate heuristics.                                 the path to the dynamic loader for which they were compiled,
                                                                          as well as the filenames of dynamically-loaded dependencies,
  2 http://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.pdf               which were different depending on the system.

                                                                      6
    Initially, we attempted to resolve this problem by compiling        custom data structure on a MTD partition, which we currently
our NVRAM implementation statically. However, we soon                   cannot initialize to a valid state. We believe failures in NVRAM
discovered that not only did these C runtime libraries use              emulation are likely to be a significant contributor to the drop
incompatible implementations of built-in C features such as             in emulation progress between columns two and three of Fig. 2.
thread-local storage, but they were also not built as position-         As an inconvenient truth, improving the emulation success
independent code (PIC) to support static compilation. As a              rates or fixing network configuration detection for firmware
result, we could neither build our NVRAM library statically             images from, e.g., Tomato by Shibby, is a manual process. It
against a single C runtime library, nor could we dynamically            requires an analyst to manually examine system logs in order
build our shared library specifically for each firmware image.          to identify and classify emulation failures based on root cause,
                                                                        then make the changes that are necessary to support these
    Fortunately, ELF dynamic loaders for Linux systems support          images. Oftentimes, this may be a cyclic process, as there can
lazy linking, which allows the resolution of external function          be multiple causes of emulation failure.
symbols to be delayed until usage. Typically, the compiler
implements this by placing stub code within the Procedure                   2) Kernel: As mentioned in §II-B, we do not utilize the
Linkage Table (PLT) that initializes the Global Offset Table            extracted kernel, but instead replace it with our own custom
(GOT) entry for a given imported function when the function             pre-built kernels for the ARM and MIPS architectures, which
is called for the first time.                                           together account for 90.8% of our dataset.
    Since the ELF loader uses a global symbol lookup scope                  During the kernel compilation process, we implement our
during resolution [12], we were able to compile our NVRAM               analysis within our custom Linux kernel module that is used to
library with the -nostdlib compiler flag, delaying resolution           aid debugging and emulating the original system environment.
of external symbols until after the calling process had already         By hooking 20 system calls using the kernel dynamic probes
loaded the system C runtime library. Effectively, this allowed          (kprobes) framework, we are able to intercept calls that
our shared library to appear as a static binary while dynamically       alter the execution environment. This includes operations
utilizing functions made available by the calling process,              such as assigning MAC addresses, creating a network bridge,
including the standard C runtime library.                               rebooting the system, and executing a program, all of which are
                                                                        monitored by our framework to properly configure the emulated
    Another challenge we encountered was the fact that our              networking environment. This functionality can also be used to
NVRAM implementation was not useful without a set of system-            provide automatic confirmation of vulnerabilities, especially in
specific default values. Unfortunately, these values are normally       conjunction with predefined poison values (e.g., 0xDEADBEEF,
embedded within the hardware NVRAM peripheral at the                    0x41414141) that should never appear in system calls.
factory, and having a hardware dependency for our system
would preclude our goal of performing a large-scale analysis.               Since some firmware images expect certain filesystems
Simply returning NULL or the empty string was also insufficient,        to be mounted at boot, e.g., /dev or /proc, we use the
as this would eventually cause the system to crash at startup or        rdinit kernel parameter to run a custom script that initializes
enter an erroneous state, e.g., by calling itoa() or strcpy()           these filesystems before init is executed. Additionally, we
on a NULL pointer, or inserting bad arguments to program                load the nandsim kernel module at startup, which emulates
invocations such as ifconfig. Initially, we attempted to                the memory technology device (MTD) partitions accessed
hardcode a set of default NVRAM values into our library, but            via /dev/mtdX that are frequently used on these embedded
we soon discovered that this was infeasible since an average            devices.
firmware image can reference hundreds of NVRAM keys at                      In addition, since our emulation of NVRAM is volatile, we
startup.                                                                prohibit the guest from rebooting the system and emulate this
     After manually examining firmware images that failed to            behavior by restarting the init process. This kernel module
emulate, we realized that most images embedded a set of default         also emulates vendor-specific or device-specific interfaces, such
NVRAM values into a few common locations, e.g., within a text           as custom device nodes, procfs entries, or non-standard
file named /etc/nvram.default, /etc/nvram.conf,                         IOCTL’s by returning success with a generic stub.
or /var/etc/nvram.default. Others would export a                            For the MIPS architecture, we build separate kernels for
symbol router_defaults or Nvrams of type char                           big-endian and little-endian systems, both targeting the MIPS
*[] within built-in libraries such as libnvram.so or                    Malta development platform, which is well-supported by both
libshared.so. We were able to access these symbols by                   QEMU and the Linux kernel. In fact, this platform even supports
declaring them as weak references and checking if they were             MIPS 64-bit code, although we have not implemented support
initialized, since we could not utilize libdl.so (not typically         for it since it comprises less than 0.6% of our dataset. This
loaded by the calling executable) or leave them as regular              kernel is currently at version 2.6.32.68, which is a long-term
references (external data symbol resolution is not lazy).               support release, and includes our backported commits for full
    Unfortunately, our NVRAM emulation implementation does              kprobes support.
not work for all firmware images. This can be due to a                      For the ARM architecture, we support only little-endian
wide variety of reasons. For example, some images may call              systems, since big-endian systems comprise less than 1.1% of
NVRAM-related functions that we do not emulate; others                  our dataset and are unsupported by mainline QEMU3 . We target
may expect different semantics from these emulated functions            the ARM Versatile Express development platform, which uses
in terms of parameter passing, return values, or caller/callee
memory allocation; some others may implement NVRAM as a                   3 https://lists.gnu.org/archive/html/qemu-devel/2014-06/msg03257.html




                                                                    7
an emulated Cortex-A9 (ARMv7-A) processor. This platform               assign a corresponding VLAN ID to the TAP interface, in order
offers better hardware compatibility than the standard ARM             to communicate successfully with emulated network services.
Versatile Platform Baseboard development board, which uses an          Next, the TAP interface is configured with an IP address that
emulated ARM926 (ARMv5) processor that does not support                resides in the same subnet as the IP address assigned to the
newer ARM instructions found in some firmware images.                  emulated interface by the firmware. Finally, we check for
Unfortunately, this platform supports only up to one emulated          network connectivity by sending ICMP requests and performing
Ethernet device due to the lack of an emulated PCI bus in              a port scan using the Nmap [3] utility.
QEMU. In the future, we plan to switch to the ARM Virtual
                                                                           4) QEMU: Aside from NVRAM, we expect embedded
Machine platform, which supports multiple virtualized devices
                                                                       systems to rely on other hardware-specific peripherals such as
via VirtIO, but this will require a kernel upgrade from 3.10.92
                                                                       watchdog timers or additional flash storage devices. Unfortu-
to 4.1.12, a newer long-term support release that fully supports
                                                                       nately, some device manufacturers do not follow good software
VirtIO functionality on ARM.
                                                                       engineering practices and implement such functionality directly
    As the above discussion suggests, adding support for a             in userspace, instead of using a device driver in kernelspace.
new hardware architecture, such as x86, is not an automated                As a result, we cannot simply abstract away these devices
process. In particular, selecting a supported hardware platform        and cleanly emulate this behavior within our custom kernel
in QEMU can be tricky, as support for either VirtIO or an              module. For example, the alphafs webserver mentioned in
emulated PCI bus is typically required to attach more than             §II-B maps part of physical memory from the /dev/mem
one virtual networking interface. At the same time, the chosen         device node directly into its own address space. It expects con-
hardware platform in QEMU must be supported by the selected            figuration information for the flash memory chip to be mapped
version of the Linux kernel, which needs to be sufficiently            at 0x1e000000, with the VendorID and ProductID
up-to-date for kprobes and VirtIO support. Developing a                identification parameters matching a chip supported by the
compatible configuration for the kernel can also be tricky, as         software; otherwise it simply terminates.
we need to enable all the features that off-the-shelf firmware
relies on. Furthermore, we need to rebase our custom kernel               To support the 138 affected firmware images in FIRMA-
module implementation to the chosen kernel version, which              DYNE, we modified the appropriate sixteen bytes in QEMU’s
may require manual compatibility fixes to account for internal         source code for the emulated platform flash device to respond
kernel API changes.                                                    with known good values.

    3) System Configuration: Since we are mainly interested in         D. Automated Analyses
firmware that implements network functionality, such as routers,
network attached storage, or surveillance equipment, we need to            Currently, we have implemented three basic automated
make device-specific changes to the emulated hardware. Ideally,        dynamic analysis passes within our system. Each is registered
all network devices would automatically configure themselves           as a callback within our system, such that when a firmware
via the DHCP protocol. Unfortunately, certain network devices,         image enters the network inferred state, registered callbacks
especially routers and some managed switches, are designed             are triggered sequentially. These contributed to our detection of
to provide DHCP services to other devices. Additionally, these         14 previously-unknown vulnerabilities that affect 69 firmware
devices tend to have different numbers of network interfaces;          images, and 74 known vulnerabilities that affect 887 firmware
for example typical consumer routers have at least four Ethernet       images (see §V).
interfaces, in comparison to just one on an IP camera.                     1) Accessible Webpages: To help detect various information
    Our system initially executes each emulated firmware               disclosure, buffer overflow, and command injection vulnera-
in a “learning” phase for 60 seconds. In this phase, the               bilities, we wrote a simple analysis that looks for publicly
emulator is configured with the default hardware peripherals           accessible webpages from the LAN interface of firmware
for the emulated target platform (MIPS Malta or ARM Virtual            images. A custom-written Python test harness iterates through
Express), plus up to four emulated network adapters, using             each file within the firmware image that appears to be served
the built-in socket networking backend within QEMU. During             by a webserver (e.g., located within /www/), verifies that it is
this time, information is gathered about the expected network          not a static resource (e.g., *.png, *.css, *.js), and attempts to
configuration. In particular, we keep track of IP addresses that       access it directly over the web interface.
are assigned to network interfaces, as well as the presence                Responses that contained non-2xx HTTP status codes were
of IEEE 802.1d bridges used to aggregate multiple network              ignored, since these were typically inaccessible web pages
interfaces. Additionally, we check for tagging and separation          (403/404), web pages that required authentication (401), or
of Ethernet frames using IEEE 802.1Q VLANs, which is used              invalid responses caused by socket timeouts or incomplete reads.
by some routers to segregate wireless guest networks from the          Successful responses that contained redirects were flagged as
physical network.                                                      lower confidence results, since we experimentally determined
                                                                       that a large number of these were used to implement soft-
    This information is then fed back into our emulation
                                                                       authentication pages.
framework to develop a more accurate QEMU configuration
for this system. We instantiate a network tap (TAP) device on              Perhaps as a more user-friendly authentication mechanism,
the host, which is associated with one of the emulated network         these soft-authentication pages checked whether client requests
interfaces within the firmware (e.g., eth0) that correspond to         were authenticated using a client cookie or server IP address
a LAN interface. For firmware images that use VLANs, we                log instead of the basic or digest authentication mechanisms

                                                                   8
built-into the HTTP protocol (which would return 401). Thus,             vulnerabilities within the collected firmware samples. Using
these pages were marked with lower confidence, while all other           proof-of-concept exploits that we developed for each of these
web pages were marked with regular confidence. These results             vulnerabilities, we use our system to assess their prevalence
were aggregated across our firmware dataset to determine which           and impact on our dataset. Finally, we demonstrate the analysis
URLs were most accessible, and then prioritized for further              flexibility of our system by supplementing it with 60 known
analysis in order of popularity.                                         exploits, mostly from the Metasploit Framework [2], and assess
                                                                         the prevalence and impact of these known exploits on our
    2) SNMP Information: We were curious about the preva-
                                                                         dataset.
lence and security of Simple Network Management Protocol
(SNMP) implementations across our dataset, and so we wrote a                 It is important to note that the distribution of firmware
basic analysis using our framework to dump all unauthenticated           images across product lines and device vendors is not uniform,
SNMP information from the “public” and “private” communi-                and thus may skew interpretation of the results. In particular,
ties using the snmpwalk tool. Using MIB files gathered by                although we attempt to scrape metadata about the model number
the crawler, the results for a subset of these were manually             and version number of each firmware image, this information
interpreted to check for the presence of sensitive information.          is not always available, nor is it present in a format that can
The corresponding object identifiers (OIDs) were recorded, and           easily establish a temporal ordering. For example, vendors may
a simple proof-of-concept was developed for each, based on               re-release a given product with different hardware, or release
whether information was returned when the OID was queried.               a product with different hardware or firmware in each region,
                                                                         preventing direct comparisons between two firmware images
    3) Vulnerabilities: Using 60 known exploits, mostly from
                                                                         with the exact same model. As a result, it is difficult to identify
the Metasploit Framework, we initially checked all firmware im-
                                                                         which firmware images are deprecated, and which firmware
ages across our dataset for known security vulnerabilities. Each
                                                                         image(s) is (are) the current version(s).
exploit was executed sequentially, with a remote shell payload
if applicable, then the corresponding exploit log was checked                Furthermore, it is difficult to establish a mapping between
for success. This provided a lower-bound on the number of                firmware images and products, since there is not a direct one-
vulnerabilities within our dataset, since an exploit may fail even       to-one correspondence. For example, some vendors, such as
if a vulnerability is present. The tested vulnerabilities were           Mikrotik, distribute a single firmware image for each hard-
manually selected for relevance to applications and daemons              ware architecture whereas other vendors, such as OpenWRT,
known to be present on embedded devices, and spanned various             distribute a single firmware image for each hardware chipset.
exploit categories such as buffer overflow, command injection,           Additionally, some vendors, such as QNAP and Synology,
information disclosure, and denial of service.                           develop a master firmware image that is only lightly customized
                                                                         for each product in terms of hardware support and product
    For the new vulnerabilities that we discovered, we manually
                                                                         strings, whereas other vendors, such as OpenWRT, distribute
developed proof-of-concepts exploits, which leveraged our
                                                                         different binary releases of the same firmware image using
predefined poisoned arguments such as 0xDEADBEEF. Then,
                                                                         various encapsulation formats. Given two different firmware
we specified a verification condition for each exploit, which
                                                                         binaries, this raises the question of how functionally identical
was typically the presence of the poisoned argument in our in-
                                                                         they may be, which we do not address. Nevertheless, we attempt
strumented kernel log; other examples included a segmentation
                                                                         to provide a lower-bound on the number of affected products,
fault at 0x41414141 or a WPS PIN in a webpage.
                                                                         where possible.
E. Additional Capabilities
                                                                         A. Statistics
    We also developed a number of additional capabilities that
assisted the development and debugging of our emulation                      1) Architectures: For all firmware images with extracted
framework and exploits. These include dynamic tracing of                 root filesystems, we were able to identify the architecture of
code execution, which can be imported into existing reverse              the corresponding firmware image by examining the format
engineering tools, such as IDA Pro. Our custom kernel was                header of the busybox binary on the system, or alternatively
modified to disable inlining of the context_switch()                     binaries in /sbin/ if we could not locate busybox.
function, which allowed the emulator to trace the execution                  Table I shows that the majority of our firmware images are
of given userspace processes. Additionally, at startup we                32-bit MIPS (both big-endian and little-endian), which consti-
also launch a special console application on the device node             tute approximately 79.4%. The next most popular architecture
/dev/ttyS1, which is forwarded by QEMU to a temporary                    type is 32-bit little-endian ARM, which constitutes approx-
socket on the host system. This provided us with a convenient            imately 8.9%. Combined, these two architectures constitute
mechanism for modifying the emulated firmware image at                   90.8% of all firmware images, with the remainder forming
runtime, especially if no default console is launched.                   the little-tail of this distribution, suggesting that additional
                                                                         development effort to support the remaining architectures would
                       V.   E VALUATION                                  require some other strong justifications.
    In this section, we evaluate our implementation of FIR-                  2) Operating Systems: By combining our statistics for root
MADYNE. First, we examine the composition of our input                   filesystem extraction and signature matches for the Linux and
dataset, and analyze its effect on the emulation fidelity at every       VxWorks kernels, we noticed that the largest proportion of
stage in the emulation pipeline. Second, we demonstrate how              our firmware images were UNIX-based at 48%, as shown in
we leveraged our system to identify 14 previously-unknown                Table II. If the filesystem of a firmware image was positively

                                                                     9
identified as UNIX-based, but failures were encountered during                                  Architecture (Endian)     # Image(s)
the kernel extraction process, then the image was labeled as                                         TILE (LE)                 1
UNIX-like. Potential causes for this include path exploration                                        ARC (LE)                  10
constraints, unsupported compression algorithms, or even the                                     Motorola 68k (BE)             10
lack of a kernel within the firmware image. Barely 3.5% of                                            x86 (LE)                 31
our firmware images were identified as VxWorks, showing that                                     MIPS 64-bit (BE)              50
implementing support for these devices is a low priority.                                            PPC (BE)                  84
    As discussed previously in the last paragraph of §IV-B,                                         ARM (BE)                  102
the unknown firmware images can be attributed to a number                                           x86-64 (LE)               147
of extraction failures. These include firmware images that                                            Unknown                 439
appeared to be Linux-based, but for which we were unable                                             ARM (LE)                 843
to reassemble the entire filesystem, extracted only a partial                                       MIPS (BE)                3,137
UNIX-like filesystem, or extracted a filesystem that did not                                        MIPS (LE)                4,632
meet our threshold to be deemed UNIX-like. Some of these                                                Total                9,486
are known to use ZynOS, a proprietary real-time operating                          TABLE I: Breakdown of firmware images by architecture, based
system developed by ZyXEL Communications. ZynOS uses                               on binary fingerprinting of extracted root filesystems.
the ThreadX kernel and an unknown filesystem type, for which
we lack a kernel version signature and filesystem extraction
utility.
                                                                                                         Type               # Images
    Other unknown firmware images are monolithic firmware                                                Linux                9,379
images that do not utilize a distinct kernel or filesystem. As a                               Unidentified (UNIX-like)       2,187
result, emulating these firmware images would be extremely                                            VxWorks                  857
difficult without hardware documentation, as chipset-specific                                         Unknown                10,612
code may be distributed throughout the binary. This type of                                              Total               23,035
firmware image is known to be used by u-blox, which is
included in our dataset.                                                           TABLE II: Breakdown of firmware images by operating system,
                                                                                   based on kernel fingerprinting and root filesystem extraction.
    3) Kernel Modules: Across all of our extracted firmware
images, we performed a basic categorization of all out-of-
tree kernel modules based on filename, shown in Table III.
These numbers indicate that 58.8% of these modules implement                                           Category         # Modules
various network-related functionality, such as packet filtering                                        NetUSB               853
(iptables, xtables, netfilter, ebtables), protocol                                                   Unclassified          1,384
implementations (pptp, ppp, adsl), and interface support                                            Cryptography          12,603
(mii, tun, tap). The next largest subset of 12.7% were used                                              USB              30,683
to provide support for various peripherals, including wireless                                       Filesystems          43,271
adapters (wl, ath9k, sierra), platform chipsets (ar7240,                                            Miscellaneous         55,344
ar7100, bcm963xx), and various other devices (acos_nat,                                           Peripheral Drivers      64,085
pl2303). Many of the remaining kernel modules appeared to                                            Networking          296,592
be in-tree kernel modules that were compiled as loadable mod-                                            Total           504,815
ules, including generic USB interface implementations (ehci,
                                                                                   TABLE III: Breakdown of kernel modules by category, based
uhci, xhci), filesystems (fat, fuse, ext3), cryptographic
                                                                                   on path and filename.
functions (sha512, crypto), and various other miscellaneous
kernel routines (ts_fsm, sch_hfsc). Less than 0.2% of
these kernel modules were identified as the KCodes NetUSB
kernel module, a proprietary USB over IP kernel module that                                # Images    TCP Port/Service      # Vendor(s)
is known to contain a remotely-exploitable buffer overflow                                    928           80/http              9
vulnerability.4                                                                               708          23/telnet             7
                                                                                              536         53/domain              6
    4) Network Services: To assess the prevalence of listening                                250       3333/dec-notes           1
network services on our firmware image dataset, we used the                                   188          443/https             7
nmap network scanning tool to check the 1,971 images that                                     187         5000/upnp              2
respond to ICMP echo requests. We scanned all TCP ports with                                  136         1900/upnp              1
known services from the nmap-services file, as well as the                                    162       49152/unknown            4
continuous port range 1–1024, which is the default scanning                                    63          2602/ripd             2
behavior of nmap. The top ten results, shown in Table IV,                                      57        5555/freeciv            3
indicate that out of the 1,971 devices that were network
reachable, 47.3% likely support a web-based configuration                          TABLE IV: Breakdown of listening network services by number
  4 https://www.sec-consult.com/fxdata/seccons/prod/temedia/advisories_txt/
                                                                                   of firmware images and number of vendors.
20150519-0_KCodes_NetUSB_Kernel_Stack_Buffer_Overflow_v10.txt


                                                                              10
                                                                               in the last paragraph of §IV-B can also affect success of
   10000                                                                       the initial emulation. Since we only extract the first UNIX-
                                                                               like filesystem from firmware images that contain multiple
                                                                               filesystems, it is likely that only part of the filesystem has been
    8000                                                                       extracted, leading to a boot failure. Reassembling such systems
                                                                               into a single filesystem is not straightforward because each
                                                                               filesystem can potentially be mounted on top of another at
    6000                                                                       arbitrary locations.

    4000                                                                           Of the 8,591 firmware images that entered the “learning”
                                                                               phase, only 32.3% (2,797) had their networking configuration
                                                                               successfully inferred. We believe that this decrease occurred
    2000                                                                       due to failures in the boot process while attempting to infer the
                                                                               network configuration. As we previously discussed in the last
                                                                               paragraph of §IV-C1, problems with NVRAM emulation are
       0                                                                       a significant contributor to these failures. For example, some
           Architecture    Initially   Network     Network    Exploited
            Identified    Emulated     Inferred   Reachable                    routers may not initialize correctly if our NVRAM implemen-
                                                                               tation was not able to override the built-in implementation,
Fig. 2: Breakdown of firmware images by emulation progress,                    if insufficient default NVRAM values were loaded by our
colored by vendor.                                                             implementation, or if the built-in NVRAM implementation
                                                                               expected different semantics from NVRAM-related functions.
                                                                               These manifest as various crashes or hangs during the boot
                                                                               process, especially if memory or string manipulation functions
interface (HTTP or HTTPS). Of these, only 9.5% supported
                                                                               (memcpy(), strcpy(), etc.) are called on NULL values
HTTPS for the configuration interface, which is 19.8% of the
                                                                               returned by our NVRAM implementation for nonexistent
devices that support HTTP.
                                                                               keys. Additionally, it is also possible that some images do
    Remote shell access is supported by 37.4% of devices over                  not use a NVRAM hardware peripheral, but instead write
either the Telnet or SSH protocols. Note, however, that SSH                    configuration values directly to a MTD partition, which we
is not among the top ten results; in fact, it ranks 13th at 2.2%,              may not successfully emulate.
or 1.9% of the devices that support Telnet. This is worse
than the percentage of devices supporting HTTPS out of the                         Other potential sources of networking failures include
devices that support HTTP.                                                     different naming conventions for networking devices. For
    Based on the presence of the DNS service, it appears that                  example, devices that utilize Atheros or Ralink chipsets may
at least 27.2% of these firmware images are routers, which                     expect platform networking devices to be named similarly
typically act as a local DNS proxy. Another 16.4% ship with                    to ath0 or ra0, respectively, instead of the generic eth0.
Universal Plug and Play (UPnP) enabled by default, which                       Likewise, other devices may expect the presence of a wireless
allows LAN devices to automatically configure port forwarding                  networking interface such as wlan0, and fail otherwise. In
from the WAN interface.                                                        addition, since our ARM little-endian emulation platform
                                                                               currently supports only up to one emulated Ethernet device, this
    Port 2602 is known to be used by the Routing Informa-                      may prevent some firmware images from correctly configuring
tion Protocol (RIP) protocol, which is typically enabled on                    networking.
enterprise-class routers for automatic network routing.
    According to various customer support forums, ports 3333                       Only 70.8% (1,971) of the 2,797 images with an inferred
and 5555 are known to be open on certain Netgear devices,                      network configuration are actually reachable from the network
although we have not checked our Netgear firmware images                       using ping. This may be caused by firewall rules on the
to identify the responsible service. Port 49152 is known to be                 emulated guest that filter ICMP echo requests, resulting in
the first port in the dynamic port address range forwarded by                  false negatives, or various other network configuration issues.
various applications through UPnP, though we do not have any                   For example, our system may have mistakenly assigned the
UPnP clients in our network configuration and are uncertain                    host TAP interface in QEMU to the WAN interface of the
of the default forwarding state.                                               emulated device instead of a LAN interface, or identified the
    5) Emulation Progress: As shown in Fig. 2, of the 8,617 ex-                default IP address of the WAN interface instead of the LAN
tracted firmware images for which we identified an architecture,               interface. Similarly, firmware may change the MAC address of
our system initially emulated 96.6% (8,591) successfully. The                  the emulated network device after it has booted, resulting in
failures can be attributed to a number of causes, including the                stale ARP cache entries and a machine that appears unreachable.
lack of an init binary in a standard location (/bin/init,
/etc/init, or /sbin/init), or an unbootable filesystem.                            Surprisingly, our results show that 45% (887 out of 1,971
For example, certain images containing Ralink chipsets are                     firmware images) of the network reachable firmware images
known to name their init binary ralink_init, which we                          are vulnerable to at least one exploit. We discuss this further
currently do not support. Likewise, extraction failures discussed              in §V-B, where we give a breakdown by exploit.

                                                                          11
 Exploit ID    # Images    # Products     Affected Vendor(s)                By tabulating the results from Table V for each firmware
    47            282          16              21, 22, 37               image, we obtain Table VI, which provides a breakdown of
    56            169          14              16, 21, 35               the firmware images by the number of successful exploits.
    64            169          27              12, 21, 37               This shows that a small number of these firmware images are
    45            136          13                  21                   vulnerable to more than two exploits, with the least secure
    43             88          10                  12                   image suffering from five exploits. Interestingly, all 40 of these
    202            49          11        12, 16, 21, 36, 37, 42         firmware images vulnerable to more than two exploits are
    207            35          6                   21                   routers and access points manufactured by D-Link and Netgear;
    60             31          9           7, 12, 19, 21, 37            however, this data may be skewed by the distribution of our
    205            16          5                   21                   exploits and firmware images, which is not uniform. These
    206            14          4                   21                   results initially seem to decay exponentially, with less than half
    203            13          5                   12                   (39.8%) of firmware images vulnerable to zero exploits being
    59              9         N/A                  12                   vulnerable to one exploit, but then there is a long-tail in the
    200             8          1                   21                   vulnerability distribution, with only 4.5% (126) of firmware
    201             7          1                   21                   images affected by more than one exploit.
    210             7          2                   12
     4              6         N/A                  12                       1) Command Injection (#200, #201, #204 – #206, #208):
    24              5          1                 19, 42                 While analyzing the aggregate results of our automated
    213             4          1                   21                   accessible webpages analysis (§IV-D1), we discovered six
    214             4          1                   21                   previously-unpublished command injection vulnerabilities that
    39              3         N/A                  12                   affect 24 firmware images for wireless routers and access points
    209             3          1                   12                   manufactured by Netgear. All six vulnerabilities were within
    212             3          1                   21                   PHP server-side scripts that provided debugging functionality
    61              2          1                   42                   but appeared to be accidentally included within production
    204             1         N/A                  21                   firmware releases. In particular, five of these were used to
    211             1          1                   21                   change system parameters such as the MAC address of the
                                                                        WLAN adapter, and the region of the firmware image (e.g.,
TABLE V: Breakdown of exploits by number of affected
                                                                        World Wide [WW], United States [US], or Japan [JP]). The
firmware images, number of affected products, and affected
                                                                        remaining one was used to write manufacturing data such as
vendor(s), indexed into Table VII. Note: N/A indicates that we
                                                                        MAC address, serial number, or hardware version into flash
do not have sufficient metadata to compute a lower-bound on
                                                                        memory. Our manual analysis of the PHP source code revealed
affected products.
                                                                        that all were straightforward command injection vulnerabilities
                                                                        through the $_REQUEST super-global and unsafe use of the
     # Exploits    # Images    # Vendor(s)    # Products                exec() function. After discovering these potential vulnera-
                                                                        bilities, we leveraged FIRMADYNE to automatically verify
         5             2            1              1
                                                                        their exploitability across our entire dataset.
         4             8            1              3
         3             30           2             10
                                                                            2) Buffer Overflow (#203): Another new vulnerability that
         2             86           5             14
                                                                        we manually discovered, using the results of our automated
         1            761           9             77
                                                                        accessible webpages analysis, was a buffer overflow vulnera-
         0           1,910         22            263
                                                                        bility within firmware images for certain D-Link routers. To
       Total         2,797         42            322                    implement user authentication, the webserver sets a client-side
TABLE VI: Breakdown of successful exploits by number of                 cookie labeled dlink_uid to a unique value that is associated
firmware images, number of vendor(s), and number of affected            with each authenticated user. Instead of verifying the value
products.                                                               of this cookie within the server-side scripting language of the
                                                                        webpage, this authentication functionality was actually hard-
                                                                        coded within the webserver, which uses the standard library
                                                                        functions strstr(), strlen(), and memcpy() to copy
B. Results                                                              the value of the cookie. As a result, we were able to set the value
                                                                        of this cookie to an overly-long value to cause the webserver
    In Table V, we provide a breakdown of all successful                to crash at 0x41414141, another poisoned argument that we
exploits by exploit. Exploits in the range #0 – #100 are sourced        monitor for.
from the Metasploit Framework, whereas most exploits greater
than or equal to #200 are previously-unknown vulnerabilities for            3) Information Disclosure (#207, #209 – #214): Using the
which we developed proof-of-concepts (POC’s). This excludes             automated webpage analysis, we also discovered seven new
#202, which is a known vulnerability but not sourced from               information disclosure vulnerabilities across our dataset that
the Metasploit Framework. Each of these previously-unknown              affect 51 firmware images for various routers manufactured
vulnerabilities has been reported to the respective vendor,             by both D-Link and Netgear. One of these (#207) was within
following the policies of responsible disclosure. We discuss            an unprotected webpage that provides diagnostic information
a few specific vulnerabilities below in greater detail as case          for the router, including the WPS PIN and passphrases for all
studies.                                                                locally-broadcast wireless networks.

                                                                   12
    The remaining six vulnerabilities (#209 – #214) were within              process in all versions of OpenSSL before 0.9.8za, 1.0.0m,
the Simple Network Management Protocol (SNMP) daemon of                      and 1.0.1h. Exploitation of this vulnerability allows an attacker
both manufacturers. This feature was enabled by default likely               to downgrade the cipher specification between a client and
because these routers were targeted towards small businesses                 a server, potentially permitting a man-in-the-middle (MITM)
rather than home users. To interpret results obtained from                   attack. Our results show that 8.5% of all network reachable
SNMP queries, one needs access to a Management Information                   firmware images are vulnerable to this attack, which is 89.9%
Base (MIB) file that describes the semantics of each individual              of all firmware images that accept HTTPS connections. This
object (OID) field. As discussed in §III-B, our crawlers record              exploit also affects 8.4% of all products in our dataset, the most
links to MIB files in the collected metadata, enabling manual                out of all exploits. Affected vendors include D-Link, Netgear,
verification of the obtained results.                                        and TRENDnet.
    Our automated exploit verification showed that these
firmware images would respond to unauthenticated SNMP                        C. Discussion and Limitations
v2c queries for the public and private communities, and
return values for the OID’s that contain web-based access                        Although FIRMADYNE performed well in our experi-
credentials for all users on the device, and wireless credentials            ments, there is certainly room for improvement. As discussed
for all locally-broadcast wireless networks.                                 previously in §IV-B, §IV-C1, and §IV-C2, additional manual
                                                                             effort can improve the system by, e.g., fixing extraction failures,
    4) Sercomm Configuration Dump (#47): This exploit, re-                   adding support for additional hardware architectures, or cor-
ported as CVE-2014-06595 and sourced from the Metasploit                     recting emulation failures. These changes require an analyst to
Framework, attacks undocumented and badly-designed features                  manually classify failures by root cause and perform the changes
of the scfgmgr service to remotely dump system configuration                 that are necessary to increase compatibility. Implementing a
variables from NVRAM and obtain a shell. Public documenta-                   new analysis pass also requires manual labor, though we can
tion for this vulnerability suggests that, as of 2015-01-28, it was          potentially reap a large benefit from it because each newly-
known to affect firmware for networking devices manufactured                 implemented analysis can be automatically executed on all
by Cisco, Linksys, Netgear, and a variety of smaller vendors.                supported firmware images from our dataset.
This is corroborated by our automated analysis, which also
confirmed the presence of this vulnerability within devices                      In addition, as mentioned in §V, our results can be difficult
manufactured by On Networks and TRENDnet. More precisely,                    to evaluate due to the lack of a mechanism for quantifying real-
our results suggest that this single vulnerability affects 14.3%             world impact in terms of unique products (instead of unique
of all network reachable firmware images from our dataset.                   firmware images). Likewise, our results are affected by skew
This is because Sercomm Corporation is likely the original                   caused by differences in vendor composition of our dataset,
equipment manufacturer (OEM) for these devices, which were                   and of network reachable firmware images.
then re-branded and re-sold by various vendors.
                                                                                 Other limitations of FIRMADYNE include the usage of
   5) MiniUPnPd Denial of Service (#56): Reported as CVE-                    custom pre-built kernels, which currently do not load out-
2013-02296 , this exploit takes advantage of parsing flaws for the           of-tree kernel modules from the filesystem. As a result, our
Simple Service Discovery Protocol (SSDP) within MiniUPnP7 ,                  system cannot be used to confirm vulnerabilities in kernels or
an open-source UPnP daemon implementation, to trigger a                      kernel modules shipped by the vendor within firmware images.
denial of service attack on this service.                                    For example, we are unable to assess the prevalence of the
                                                                             KCodes NetUSB kernel module buffer-overflow across our
    According to our results, 8.5% of all network reachable                  dataset because of this limitation.
firmware images from our dataset are vulnerable to this attack,
which was fixed on 2009-10-30 with the release of MiniUPnP                       Likewise, we do not identify which network port is used
1.4. Affected vendors include Huawei, Netgear, and Tomato by                 as the uplink (or WAN) port, and which network port(s) are
Shibby, which is a community-developed third-party firmware                  used for the downlink (or LAN) port(s). This prevents us from
for various wireless routers. Statistics released by Rapid7,                 determining whether detected vulnerabilities are exploitable
the developers of the Metasploit Framework and the original                  from the Internet, or only by locally-connected clients.
reporters of this vulnerability, indicate that as of 2013-01-
29, 332 products used MiniUPnP 1.0, with over 69% of all                         Nevertheless, a number of techniques can be used by remote
MiniUPnP fingerprints corresponding to version 1.0 or older.                 attackers to pivot from the WAN interface to the LAN interface
Again, these results emphasize the prevalence of cross-vendor                over a web browser, including Cross-Site Request Forgery
vulnerabilities due to shared software components, whether                   (CSRF), Cross-Site Scripting (XSS), or even DNS rebinding
open-source or proprietary.                                                  attacks. Additionally, with the increasing deployment of IPv6,
                                                                             local machines are now being assigned globally-routable IP
   6) OpenSSL ChangeCipherSpec (#64): This vulnerability                     addresses. This potentially allows attackers to access the LAN
was reported as CVE-2014-02248 , and takes advantage of a                    interface of consumer devices, even though routers can still
bad state machine implementation for the SSL/TLS handshake                   act as firewalls. An increasing number of wireless routers and
  5 https://github.com/elvanderb/TCP-32764                                   access points also now support network isolation or client
  6 https://community.rapid7.com/servlet/JiveServlet/download/2150-1-        isolation features, which can segregate traffic between various
16596/SecurityFlawsUPnP.pdf                                                  wireless or physical interfaces. However, the presence of these
  7 http://miniupnp.free.fr/                                                 vulnerabilities within the gateway router clearly compromises
  8 http://ccsinjection.lepidum.co.jp/                                       this protection.

                                                                        13
                        VI.     R ELATED W ORK                               Recently, Zaddach et al. [19] have also developed a
                                                                         framework for performing dynamic analysis of embedded
    With the increasing prevalence of embedded devices, several          firmware by forwarding I/O accesses from within an emulator
related works have performed large-scale analyses of firmware            the actual hardware for execution. However, this approach does
images, using a variety of analysis techniques. For exam-                not scale in terms of analysis cost and time, which is why
ple, Heffner9 performed large-scale extraction of embedded               we have designed FIRMADYNE to perform robust hardware
firmware images to gather a database of over 2, 000 hardcoded            emulation and vulnerability verification in an automatic manner.
SSL private keys. Likewise, Rapid710 used a similar analysis
for hardcoded SSH private keys, albeit on a smaller scale.
                                                                                      VII.     C ONCLUSION & F UTURE W ORK
    Using static analysis, Costin et al. [8] recently analyzed
a dataset of approximately 32, 000 firmware images. They                     By developing FIRMADYNE, our automated dynamic
discovered a total of 38 previously-unknown vulnerabilities,             analysis framework, we hope to lower the bar for discovering
including hard-coded back-doors, embedded private key-pairs,             new vulnerabilities within embedded systems. At the same time,
and XSS vulnerabilities, all of which were obtained “without             FIRMADYNE implements an automated approach to assess
performing sophisticated static analysis”.                               the prevalence of newly-discovered security vulnerabilities
                                                                         in a large population of embedded device firmware images.
    Another effective technique for large-scale measurement of           Given the weak security posture of these devices, we believe
embedded device security is network scanning, which avoids               that greater attention to these devices by security researchers,
direct analysis of firmware images. Using tools such as Nmap,            hobbyists, and other interested parties can motivate device
Cui and Stolfo [10] identified approximately 540, 000 publicly-          manufacturers to address security issues in their products more
accessible embedded devices with default access credentials.             swiftly. This is especially true for OEMs, who are responsible
Over the course of a 4-month longitudinal study, they discovered         for a significant fraction of the vulnerabilities in existing
that less than 3% of access credentials were changed, which              deployed devices.
suggests that user awareness is lacking. Likewise, using the
ZMap [13] network scanner, Heninger et al. [14] showed that                  As shown in Fig. V-A, the next-largest category (after
embedded devices can also suffer from entropy problems.                  Linux) of embedded firmware from our dataset are from
Their results indicate that 2.45% of TLS certificates may                various proprietary real-time operating systems (RTOS) such
be vulnerable to brute-force attacks due to faulty RSA key               as VxWorks. This presents a potential avenue for future work,
generation, and that 1.03% of DSA private keys are factorable            especially given the existence of published vulnerabilities that
due to nontrivial common factors.                                        affect these platforms. In particular, we would be interested in
                                                                         developing a compatibility layer for these applications using
    Additionally, previous work has discovered specific vul-             existing real-time Linux development frameworks such as
nerabilities that affect various classes of embedded devices.            Xenomai on our emulation platform.
Using HP LaserJet printers as a case study, Cui et al. [9]
demonstrated that remote firmware update functionality can                   A considerable number of source code releases are available
be exploited by attackers to insert malware. Weinmann [18]               for many Linux-based embedded firmware due to the terms
showed that deployed cellular baseband implementations suffer            of common open-source software licenses. Since our dataset
from remotely exploitable memory corruption vulnerabilities,             includes links to applicable source code for each firmware
which can be used to execute arbitrary code on the baseband              image, this could provide a mechanism for implementing
processor. Similarly, Bonkoski et al. [6] showed that remote             effective static analysis, in conjunction with our existing
management functionality on server motherboards is riddled               framework for performing dynamic analysis.
with security vulnerabilities, allowing a remote attacker to take            Finally, statistical analysis techniques could be utilized to
control of the system. Finally, Maskiewicz et al. [16] and Nohl          improve the firmware extraction component of our framework.
et al. [17] showed that malicious functionality can be inserted          Firmware images that appear obfuscated or encrypted could be
into the firmware of USB peripherals, allowing an attacker to            handled by a separate extraction pathway. For example, it is
take control of host systems and exfiltrate data.                        well-known that firmware for Buffalo LinkStation devices are
                                                                         encrypted, but passwords and decryption utilities are publicly
    To defend against this attack vector, several different
                                                                         available.11 The same applies to various firmware distributed
techniques have been developed to find vulnerabilities in
                                                                         for QNAP devices.12
embedded devices. For example, Davidson et al. [11] have
developed a symbolic executor using the KLEE [7] symbolic                    Acknowledgment: This work was supported in part by
execution engine to detect vulnerabilities in embedded devices.          grants from the Department of Defense through the National
Their work discovered 21 memory safety bugs across a corpus              Defense Science & Engineering Graduate Fellowship Program
of 99 open-source firmware programs for the MSP430 family                and under contract no. N66001-13-2-4040, and the Office of
of 8-bit embedded micro-controllers. At a lower level, Li                Naval Research under grant N00014-15-1-2948. Any opinions,
et al. [15] ported the QEMU emulator into the BIOS to model              findings and conclusions or recommendations expressed in this
hardware peripherals for validation of an embedded SoC during            material are those of the authors and do not necessarily reflect
development.                                                             those of the sponsor.
  9 https://github.com/devttys0/littleblackbox                             11 http://buffalo.nas-central.org/wiki/Firmware_update
  10 https://github.com/rapid7/ssh-badkeys                                 12 http://pastebin.com/KHbX85nG




                                                                    14
                        R EFERENCES                                          execution,” in Proceedings of the 22nd USENIX
                                                                             Security Symposium. USENIX, 2013, pp. 463–478.
 [1] “Binwalk.” [Online]. Available: http://binwalk.org/
                                                                             [Online]. Available: https://www.usenix.org/conference/
 [2] “Metasploit.” [Online]. Available: http://www.metasploit.
                                                                             usenixsecurity13/technical-sessions/paper/davidson
     com/
                                                                        [12] U. Drepper, “How to write shared libraries,” 2006.
 [3] “Nmap security scanner.” [Online]. Available: https:               [13] Z. Durumeric, E. Wustrow, and J. A. Halderman,
     //nmap.org/                                                             “ZMap: Fast internet-wide scanning and its security
 [4] F. Bellard, “QEMU, a fast and portable dynamic translator,”             applications,” in Proceedings of the 22nd USENIX
     in Proceedings of the USENIX 2005 Annual Technical                      Security Symposium. USENIX, 2013, pp. 605–619.
     Conference. USENIX, 2005, pp. 41–46. [Online].                          [Online]. Available: https://www.usenix.org/conference/
     Available: https://www.usenix.org/legacy/publications/                  usenixsecurity13/technical-sessions/paper/durumeric
     library/proceedings/usenix05/tech/freenix/bellard.html             [14] N. Heninger, Z. Durumeric, E. Wustrow, and J. A.
 [5] A. Bessey, K. Block, B. Chelf, A. Chou, B. Fulton,                      Halderman, “Mining your Ps and Qs: Detection
     S. Hallem, C. Henri-Gros, A. Kamsky, S. McPeak,                         of widespread weak keys in network devices,” in
     and D. Engler, “A few billion lines of code later,”                     Proceedings of the 21st USENIX Security Symposium.
     Communications of the ACM, vol. 53, no. 2, pp. 66–75,                   USENIX, 2012, pp. 205–220. [Online]. Avail-
     2010. [Online]. Available: http://portal.acm.org/citation.              able: https://www.usenix.org/conference/usenixsecurity12/
     cfm?doid=1646353.1646374                                                technical-sessions/presentation/heninger
 [6] A. Bonkoski, R. Bielawski, and J. A. Halderman,                    [15] H. Li, D. Tong, K. Huang, and X. Cheng, “FEMU:
     “Illuminating the security issues surrounding                           A firmware-based emulation framework for SoC
     lights-out server management,” in Proceedings                           verification,” in Proceedings of the 2010 IEEE/ACM/IFIP
     of the 7th USENIX Workshop on Offensive                                 International Conference on Hardware/Software Codesign
     Technologies. USENIX, 2013, pp. 1–9. [Online].                          and System Synthesis, no. 257. IEEE, 2010, pp. 257–266.
     Available: https://www.usenix.org/conference/woot13/                    [Online]. Available: http://ieeexplore.ieee.org/xpls/abs_all.
     workshop-program/presentation/bonkoski                                  jsp?arnumber=5751510&tag=1
 [7] C. Cadar, D. Dunbar, and D. Engler, “KLEE: Unassisted              [16] J. Maskiewicz, B. Ellis, J. Mouradian, and H. Shacham,
     and automatic generation of high-coverage tests for                     “Mouse trap: Exploiting firmware updates in USB
     complex systems programs,” in Proceedings of the 8th                    peripherals,” in Proceedings of the 8th USENIX Workshop
     USENIX Symposium on Operating System Design and                         on Offensive Technologies. USENIX, 2014, pp. 1–10.
     Implementation. USENIX, 2008, pp. 209–224. [Online].                    [Online]. Available: https://www.usenix.org/conference/
     Available: https://www.usenix.org/legacy/events/osdi08/                 woot14/workshop-program/presentation/maskiewicz
     tech/                                                              [17] K. Nohl and J. Lell, “BadUSB—on acces-
 [8] A. Costin, J. Zaddach, A. Francillon, and D. Balzarotti,                sories that turn evil,” 2014. [Online]. Avail-
     “A large-scale analysis of the security of embedded                     able: https://www.blackhat.com/us-14/briefings.html#
     firmwares,” in Proceedings of the 23rd USENIX                           badusb-on-accessories-that-turn-evil
     Security Symposium. USENIX, 2014, pp. 95–110.                      [18] R.-P. Weinmann, “Baseband attacks: Remote exploitation
     [Online]. Available: https://www.usenix.org/conference/                 of memory corruptions in cellular protocol stacks,”
     usenixsecurity14/technical-sessions/presentation/costin                 in Proceedings of the 6th USENIX Workshop on
 [9] A. Cui, M. Costello, and S. J. Stolfo, “When                            Offensive Technologies. USENIX, 2012, pp. 1–10.
     firmware modifications attack: A case study of                          [Online]. Available: https://www.usenix.org/conference/
     embedded exploitation,” in Proceedings of the 20th                      woot12/workshop-program/presentation/weinmann
     Annual Network and Distributed System Security                     [19] J. Zaddach, L. Bruno, A. Francillon, and D. Balzarotti,
     Symposium. The Internet Society, 2013. [Online]. Avail-                 “Avatar: A framework to support dynamic security analysis
     able: http://www.internetsociety.org/doc/when-firmware-                 of embedded systems’ firmwares,” in Proceedings of the
     modifications-attack-case-study-embedded-exploitation                   2014 Network and Distributed System Security Symposium.
[10] A. Cui and S. J. Stolfo, “A quantitative analysis of the                The Internet Society, 2014, pp. 23–26. [Online]. Available:
     insecurity of embedded network devices: Results of a                    http://dx.doi.org/10.14722/ndss.2014.23229
     wide-area scan,” in Proceedings of the 26th Annual
     Computer Security Applications Conference, 2010, pp.
     97–106. [Online]. Available: http://www.scopus.com/                                           A PPENDIX
     inward/record.url?eid=2-s2.0-78751540482&partnerID=
     40&md5=759904ebe0eca35e4297072f7224cf55                            A. Dataset Breakdown
[11] D. Davidson, B. Moench, S. Jha, and T. Ristenpart,
                                                                           In Table VII to follow, we show the progress of FIRMA-
     “FIE on firmware: Finding vulnerabilities in
                                                                        DYNE in analyzing the firmware images in our dataset, grouped
     embedded systems using symbolic execution finding
                                                                        by vendor. Approximately 10% of all extracted firmware images
     vulnerabilities in embedded systems using symbolic
                                                                        were exploited.




                                                                   15
                                                                                                                                   Index         Vendor         Download        Extracted    Arch. Identified   Initial Emulation   Network Inferred   Network Reachable   Exploited
                                                                                                                                      1        Actiontec           14 (6)          8 (4)          5 (3)                8 (4)               0 (0)              0 (0)           0 (0)
                                                                                                                                      2        Airlink101         15 (12)          1 (1)          1 (1)                1 (1)               1 (1)              0 (0)           0 (0)
                                                                                                                                      3           Apple           9 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                      4            Asus             3 (1)          1 (1)          1 (1)                1 (1)               0 (0)              0 (0)           0 (0)
                                                                                                                                      5           AT&T             25 (1)          6 (1)          4 (1)                6 (1)               2 (1)              0 (0)           0 (0)
                                                                                                                                      6           AVM           132 (N/A)        7 (N/A)         7 (N/A)              7 (N/A)              0 (0)              0 (0)           0 (0)
                                                                                                                                      7           Belkin         140 (61)         55 (29)        55 (29)              53 (29)              7 (4)              3 (2)           2 (2)
                                                                                                                                      8          Buffalo         143 (61)          6 (5)          5 (4)                6 (5)               4 (3)              0 (0)           0 (0)
                                                                                                                                      9       CenturyLink          31 (4)          9 (4)          9 (4)                9 (4)               1 (1)              1 (1)           0 (0)
                                                                                                                                     10         Cerowrt          14 (N/A)        14 (N/A)       14 (N/A)              8 (N/A)            8 (N/A)              0 (0)           0 (0)
                                                                                                                                     11           Cisco          61 (N/A)        43 (N/A)       39 (N/A)             34 (N/A)            2 (N/A)              0 (0)           0 (0)
                                                                                                                                     12          D-Link        4,688 (434)     1,124 (113)    1,089 (109)          1,121 (119)          609 (65)            458 (48)       219 (32)
                                                                                                                                     13        Forceware          2 (N/A)        2 (N/A)         2 (N/A)               0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     14          Foscam           56 (23)          5 (5)          5 (5)                5 (5)               5 (5)              0 (0)           0 (0)
                                                                                                                                     15        Haxorware          7 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     16          Huawei           29 (17)          5 (3)          5 (3)                5 (3)               3 (2)              2 (1)           2 (1)
                                                                                                                                     17         Inmarsat         47 (N/A)        2 (N/A)         2 (N/A)              2 (N/A)            2 (N/A)              0 (0)           0 (0)
                                                                                                                                     18          Iridium         17 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     19         Linksys          126 (29)        105 (24)       101 (21)             105 (24)             43 (9)              36 (8)          5 (3)
                                                                                                                                     20        MikroTik            13 (4)        5 (N/A)         4 (N/A)              2 (N/A)              0 (0)              0 (0)           0 (0)
                                                                                                                                     21          Netgear       5,280 (372)     2,135 (156)    2,109 (155)          2,054 (149)         1,297 (92)          1,078 (79)      628 (47)




16
                                                                                                                                     22      On Networks         28 (N/A)        15 (N/A)       15 (N/A)             15 (N/A)           11 (N/A)            10 (N/A)        7 (N/A)
                                                                                                                                     23      Open Wireless        1 (N/A)        1 (N/A)         1 (N/A)              1 (N/A)            1 (N/A)              0 (0)           0 (0)
                                                                                                                                     24        OpenWrt          1,498 (41)      1,303 (27)     1,303 (27)           1,295 (25)           326 (8)              8 (4)           0 (0)
                                                                                                                                     25          pfSense         256 (60)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)




     not have sufficient metadata to compute a lower-bound on affected products.
                                                                                                                                     26         Polycom           644 (6)          24 (1)         7 (1)                7 (1)               0 (0)              0 (0)           0 (0)
                                                                                                                                     27          QNAP            464 (88)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     28       RouterTech         12 (N/A)        12 (N/A)         0 (0)              12 (N/A)              0 (0)              0 (0)           0 (0)
                                                                                                                                     29            Seiki          16 (10)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     30       Supermicro         150 (77)         26 (17)        26 (17)              26 (17)              0 (0)              0 (0)           0 (0)
                                                                                                                                     31        Synology        2,094 (170)       181 (51)        34 (12)              16 (12)              0 (0)              0 (0)           0 (0)
                                                                                                                                     32           Tenda          244 (55)         59 (22)        52 (19)              59 (22)              1 (1)              1 (1)           0 (0)
                                                                                                                                     33           Tenvis           49 (4)          26 (3)         26 (3)               26 (3)             17 (3)              17 (3)          0 (0)
                                                                                                                                     34         Thuraya          18 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     35    Tomato by Shibby      2,942 (6)      2,940 (6)       2,940 (6)            2,940 (6)            21 (2)              20 (2)          1 (1)
                                                                                                                                     36         TP-Link        1,072 (367)      302 (103)      302 (103)            300 (102)           245 (81)            206 (73)          3 (1)
                                                                                                                                     37       TRENDnet          822 (162)        272 (46)       269 (45)             270 (46)           132 (26)             94 (17)         15 (1)
                                                                                                                                     38         Ubiquiti          51 (11)          36 (8)         25 (5)               36 (8)              0 (0)              0 (0)           0 (0)
                                                                                                                                     39           u-blox         16 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     40          Verizon           37 (1)        2 (N/A)         1 (N/A)              2 (N/A)              0 (0)              0 (0)           0 (0)
                                                                                                                                     41     Western Digital       1 (N/A)          0 (0)          0 (0)                0 (0)               0 (0)              0 (0)           0 (0)
                                                                                                                                     42          ZyXEL         1,768 (252)       161 (38)       159 (38)             159 (39)            59 (18)             37 (13)          5 (1)
                                                                                                                                   Total            42        23,035 (2,331)   8,893 (667)    8,617 (611)          8,591 (625)        2,797 (322)         1,971 (252)      887 (89)




     TABLE VII: Breakdown of analysis progress by vendor, in terms of firmware images (products). Note: N/A indicates that we do
