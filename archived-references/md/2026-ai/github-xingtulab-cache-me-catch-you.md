---
type: Repository
title: Code
description: "Code for an NDSS 2026 study of caches in LLM serving stacks. A meet-in-the-middle birthday search collides the Python tuple hash used for KV prefix-cache keys in vLLM and SGLang, so an attacker's prompt takes a victim's cached prefix; image caches key on raw tobytes or SHA-256, so palette-mode PNGs and equal-size differing images collide; and GPTCache serves a stored answer for a semantically near but opposite request, bypassing content filters. Several CVEs were assigned."
resource: "https://github.com/XingTuLab/Cache_Me_Catch_You"
tags: [repo, webseclist-reference, github, cache-poisoning, hash-collision, llm, cache, filter-bypass, cve, info-leak, tooling, owasp-a02-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-08T18:46:57+00:00"
status: stable
stale_after: 2027-08-08
sources:
  - id: original
    resource: "https://github.com/XingTuLab/Cache_Me_Catch_You"
    title: Code
    author: XiangFan Wu, Lingyun Ying, Guoqiang Chen, Yacong Gu, Haipeng Qu
  - id: commit
    resource: "https://github.com/XingTuLab/Cache_Me_Catch_You"
also_at: []
authors:
  - XiangFan Wu
  - Lingyun Ying
  - Guoqiang Chen
  - Yacong Gu
  - Haipeng Qu
canonical_url: ""
cited_by:
  - "2026-ai.md:212"
commit: 480d9ad4b9798b3a42b9441a11d2e8a1c0ea70ca
content_sha256: 3fbd9c32176f1314e64ebff4253bfef0934f62d4986e446d6b3d985c30b25eb1
depth: full
depth_reason: default
kind: repo
language: ""
licence: see the repository
original_url: "https://github.com/XingTuLab/Cache_Me_Catch_You"
published: ""
publisher: GitHub
publisher_english: ""
raw_sha256: ""
retrieved_from: "https://github.com/XingTuLab/Cache_Me_Catch_You"
retrieved_kind: git
retrieved_utc: "2026-08-08T18:46:57+00:00"
slug: github-xingtulab-cache-me-catch-you
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Code

**Code** - XiangFan Wu, Lingyun Ying, Guoqiang Chen, Yacong Gu, Haipeng Qu, GitHub.

- Published: date not stated
- Original: <https://github.com/XingTuLab/Cache_Me_Catch_You>
- Preserved from: https://github.com/XingTuLab/Cache_Me_Catch_You (git) on 2026-08-08
- Repository commit: 480d9ad4b9798b3a42b9441a11d2e8a1c0ea70ca
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

- Repository: <https://github.com/XingTuLab/Cache_Me_Catch_You>
- Commit: `480d9ad4b9798b3a42b9441a11d2e8a1c0ea70ca`
- Documents preserved: 1

## `README.md`

_Blob `7da608dd5666`, 5948 bytes, at commit `480d9ad4b979`._

# Cache Me, Catch You

**Cache Me, Catch You: Cache Related Security Threats in LLM Serving Frameworks**

*Accepted at NDSS 2026*

---

## Overview

This repository contains the implementation and experimental materials for our NDSS 2026 paper. We conducted a comprehensive security analysis of caching mechanisms in Large Language Model (LLM) serving frameworks such as vLLM, SGLang, and GPTCache, and discovered several critical vulnerabilities in:

- **KV Cache (Prefix Caching)**: Hash collision attacks on prefix caching mechanisms
- **Image Cache**: Hash collision attacks on image preprocessing pipelines in multimodal models
- **Semantic Cache**: Semantic inconsistency issues where requests with high similarity scores may have completely different or even opposite meanings

Our research demonstrates that these caching mechanisms introduce significant security risks, enabling attackers to perform **cache poisoning attacks** that can lead to incorrect model outputs, information leakage, and content filter bypasses.

---

## Repository Structure

```
.
├── image/                    # Image Hash Collision Attacks
│   ├── P-image/              # PNG Palette-based collision attack
│   ├── sha256_coll/          # SHA-256 hash collision for image preprocessing
│   └── size-image/           # Dimension-based image collision attack
├── kv_cache/                 # KV Cache Hash Collision Attack Tools
│   ├── omp_collision_cd.cpp  # C++ collision search core (OpenMP)
│   ├── hash_coll.py          # Cross-prompt hash collision script
│   ├── selfhash.py           # Self-hash collision script
│   └── README.md
├── prompts/                  # Semantic Cache Experiment Prompts
│   ├── customer_prompt/      # Customer support scenario prompts
│   └── LLM_Security_Analyst/ # Security analysis scenario prompts
└── README.md                 # This file
```

---

## Image Hash Collision Attacks (`image/`)

This directory contains three different attack vectors targeting image caching mechanisms in multimodal LLM serving frameworks.

### 1. P-image: PNG Palette-based Collision (`image/P-image/`)

Exploits PNG palette-mode to construct visually different images with identical hash values. See [P-image/README.md](image/P-image/README.md) for details.

### 2. SHA-256 Collision for Image Preprocessing (`image/sha256_coll/`)

High-performance collision search targeting SHA-256 hashes in image preprocessing pipelines (e.g., SGLang). See [sha256_coll/readme.md](image/sha256_coll/readme.md) for details.

### 3. Size-based Image Collision (`image/size-image/`)

Dimension-based collision where identical raw pixel data displays different content. See [size-image/README.md](image/size-image/README.md) for details.

---

## KV Cache Hash Collision Attack (`kv_cache/`)

Tools for performing **Meet-in-the-Middle (Bidirectional Birthday) Attack** on the KV Cache prefix hashing mechanism in LLM inference engines.

| File | Description |
|------|-------------|
| `omp_collision_cd.cpp` | C++ collision search core with OpenMP parallelization |
| `hash_coll.py` | Cross-prompt collision: attacker's prompt collides with victim's prompt |
| `selfhash.py` | Self-collision: different positions within same prompt produce identical hash |

See [kv_cache/README.md](kv_cache/README.md) for technical details and usage.

---

## Semantic Cache Experiments (`prompts/`)

This directory contains prompt templates used in our semantic cache security experiments. We discovered that requests with high semantic similarity scores may actually have inconsistent or even opposite meanings, leading to incorrect cache hits.

| Scenario | Directory | Description |
|----------|-----------|-------------|
| Customer Support | `customer_prompt/` | System prompts and semantic cache filtering experiments |
| Security Analyst | `LLM_Security_Analyst/` | Code vulnerability analysis prompts |

---

## Attack Summary

| Attack Type | Target | Framework | Hash Type |
|-------------|--------|-----------|-----------|
| Palette Collision | Image Cache | vLLM | tobytes() |
| SHA-256 Collision | Image Cache | SGLang | SHA-256 |
| Size Collision | Image Cache | Multiple | tobytes() |
| KV Cache Collision | Prefix Cache | SGLang/vLLM | Python tuple hash |
| Semantic Collision | Semantic Cache | GPTCache | Embedding similarity |

---

## Responsible Disclosure

We have responsibly disclosed these vulnerabilities to the affected framework maintainers. Below are the security advisories and CVE IDs:

### vLLM Cache Vulnerabilities

| Vulnerability | Advisory | CVE |
|---------------|----------|-----|
| Kv Cache Collision| [GHSA-rm76-4mrf-v9r8](https://github.com/advisories/GHSA-rm76-4mrf-v9r8) | [CVE-2025-25183](https://nvd.nist.gov/vuln/detail/CVE-2025-25183) |
| Kv Cache Collision|-| [CVE-2025-1953](https://nvd.nist.gov/vuln/detail/CVE-2025-1953)|
| Image Hash Collision (tobytes) | [GHSA-c65p-x677-fgj6](https://github.com/advisories/GHSA-c65p-x677-fgj6) | [CVE-2025-46722](https://nvd.nist.gov/vuln/detail/CVE-2025-46722) |
| PNG tRNS Transparency Bypass | [GHSA-8jr5-v98p-w75m](https://github.com/vllm-project/vllm/security/advisories/GHSA-8jr5-v98p-w75m) |- |

### GPTCache Semantic Cache Vulnerability

| Vulnerability | Fix |
|---------------|-----|
| Semantic Cache Inconsistency | [PR #669](https://github.com/zilliztech/GPTCache/pull/669) |

---

## Citation

```bibtex
@inproceedings{cachemecatchyou2026,
  title={Cache Me, Catch You: Cache Related Security Threats in LLM Serving Frameworks},
  author={Wu, XiangFan and Ying, Lingyun and Chen, Guoqiang and Gu, Yacong and Qu, Haipeng},
  booktitle={Proceedings of the Network and Distributed System Security Symposium (NDSS)},
  year={2026}
}
```

---

## License

This project is for research purposes only. Please use responsibly and in accordance with applicable laws and regulations.
