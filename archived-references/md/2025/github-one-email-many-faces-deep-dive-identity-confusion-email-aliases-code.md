---
type: Repository
title: "One Email, Many Faces: A Deep Dive into Identity Confusion in Email Aliases (Source code)"
resource: "https://github.com/lab-rynth/OriginMail"
tags: [repo, webseclist-reference, github]
generated:
  by: webseclist-refs/1
  at: "2026-09-09T23:36:09+00:00"
status: stable
stale_after: 2027-09-09
sources:
  - id: original
    resource: "https://github.com/lab-rynth/OriginMail"
    title: "One Email, Many Faces: A Deep Dive into Identity Confusion in Email Aliases (Source code)"
    author: Mengying Wu, Geng Hong, Jiatao Chen, Baojun Liu, Mingxuan Liu, Min Yang
  - id: commit
    resource: "https://github.com/lab-rynth/OriginMail"
also_at: []
authors:
  - Mengying Wu
  - Geng Hong
  - Jiatao Chen
  - Baojun Liu
  - Mingxuan Liu
  - Min Yang
canonical_url: ""
cited_by:
  - "2025.md:104"
commit: cc46fa9a5c0c963021d82a6b74300c50f70e5830
content_sha256: 9be6827a1c4146ade12822c740b4076e3cef7c95a45188fba8575dfcd903d6c3
depth: full
depth_reason: default
kind: repo
language: ""
licence: see the repository
original_url: "https://github.com/lab-rynth/OriginMail"
published: ""
publisher: GitHub
publisher_english: ""
raw_sha256: ""
retrieved_from: "https://github.com/lab-rynth/OriginMail"
retrieved_kind: git
retrieved_utc: "2026-09-09T23:36:09+00:00"
slug: github-one-email-many-faces-deep-dive-identity-confusion-email-aliases-code
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# One Email, Many Faces: A Deep Dive into Identity Confusion in Email Aliases (Source code)

**One Email, Many Faces: A Deep Dive into Identity Confusion in Email Aliases (Source code)** - Mengying Wu, Geng Hong, Jiatao Chen, Baojun Liu, Mingxuan Liu, Min Yang, GitHub.

- Published: date not stated
- Original: <https://github.com/lab-rynth/OriginMail>
- Preserved from: https://github.com/lab-rynth/OriginMail (git) on 2026-09-09
- Repository commit: cc46fa9a5c0c963021d82a6b74300c50f70e5830
- Licence: see the repository

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

This reference is a source-code repository. The archive preserves its
documentation at an exact commit; the code itself stays in a private
mirror and is never checked out, built or run.

- Repository: <https://github.com/lab-rynth/OriginMail>
- Commit: `cc46fa9a5c0c963021d82a6b74300c50f70e5830`
- Documents preserved: 2

## `LICENSE`

_Blob `03e398125e09`, 1064 bytes, at commit `cc46fa9a5c0c`._

MIT License

Copyright (c) 2025 oyasumi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## `README.md`

_Blob `a3f6532ea31a`, 2739 bytes, at commit `cc46fa9a5c0c`._

# OriginMail
This is the official repository for our paper "One Email, Many Faces: A Deep Dive into Identity Confusion in Email Aliases".

```OriginMail``` is tool to get the base email addresses of a syntactic alias, e.g. you can get ```alice@gmail.com``` while your input is ```al.ice@gmail.com``` or ```alice+test@gmail.com```.

## Usage
Run the tool
```shell
python3 OriginMail.py [Email address]
```
The parameter Email address is the syntactic alias, and the output is as follow.
```
Base email addresses: [List of base email addresses]
```
If the output is ```None```, please check the format of the input(```username@example.com```).

Note that ```OriginMail``` ***do not*** supports all domains. If the format of your input is correct but output is still ```None```, the reason may be that OriginMail does not support the domain of the email address you input.

## Source Files
### OriginMail.py
This is the main module of the ```OriginMail``` tool. It takes an email address as input and performs domain-specific normalization rules to identify and return its base email address(es). It is designed to handle a wide range of syntactic aliasing techniques across different email providers.

### test.py
This file provides a simple usage example of the ```OriginMail``` tool. You can run it directly to see how ```OriginMail``` works with some predefined alias email addresses. It is useful for testing and demonstration purposes.

Run the example:
```shell
python3 test.py
```

## Supported Domains
The domains supported by `OriginMail` are collected from 28 major email service providers discussed in our paper.
| Domain | | | | | | | |
|---------|---------|--------|-------|------|-|-|-|
| gmx.com | foxmail.com | mail.ru | mailhouse.biz | runbox.biz | runbox.io | runbox.uk | eclipso.it |
| mail.com | yahoo.com | gmail.com | messagebox.email | runbox.bz | runbox.is | runbox.us | eclipso.me |
| 163.com | myyahoo.com | googlemail.com | offshore.rocks | runbox.ch | runbox.it | runbox7.com | eclipso.nl |
| qq.com | tutamail.com | yandex.com | rbox.co | runbox.co | runbox.ky | runbox.la | xobnur.uk | eclipso.uk |
| 126.com | op.pl | yandex.ru | rbox.me | runbox.co.in | runbox.li | eclipso.eu | eclipso.email |
| 139.com | aliyun.com | yandex.by | rbx.email | runbox.com | runbox.me | eclipso.de | eclipsomail.com |
| sina.com | zohomail.com | yandex.kz | rbx.life | runbox.cz | runbox.nl | eclipso.at | eclipsomail.de |
| yeah.net | outlook.com | ya.ru | rbx.run | runbox.dk | runbox.no | eclipso.ch | teamvielfalt.eu |
| sohu.com | hotmail.com | 2925.com | rnbx.uk | runbox.email | runbox.pt | eclipso.dk | protonmail.com |
| 2980.com | icloud.com | mailhost.work | runbox.at | runbox.eu | runbox.rocks | eclipso.es |  |
