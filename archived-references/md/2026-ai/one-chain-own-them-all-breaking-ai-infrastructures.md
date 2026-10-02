---
type: Whitepaper
title: "One Chain to Own Them All: Breaking AI Infrastructures"
description: "A hunt across AI serving stacks that ends in PyTorch's model loader: the weights_only whitelist meant to make torch.load safe was bypassed once, then again after the fix, when a whitelisted function reached through persistent_load overflows and pickle's SETITEM opcodes give control of index and value, with Debian's non-PIE CPython supplying an address. vLLM's prompt_embeds, SGLang, OpenLLM, ComfyUI and NVIDIA Dynamo all feed attacker-supplied tensors into torch.load, so one chain reaches all."
resource: "https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf"
tags: [whitepaper, webseclist-reference, rce, deserialization, python, llm, cve, attack-chain, info-leak, memory-corruption, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:42:44+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf"
    title: "One Chain to Own Them All: Breaking AI Infrastructures"
    author: "Ji'an Zhou"
also_at: []
authors:
  - "Ji'an Zhou"
canonical_url: ""
cited_by:
  - "2026-ai.md:214"
commit: ""
content_sha256: cc0ad9810dc665ccfee7b45132e18691c60daf56b4ce5ee93d77c45bffd95cb7
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 0ab97ef76707c58a515d9ea2732e5cb33e69a9f9585016d390fb98cec1def43c
retrieved_from: "https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:42:44+00:00"
slug: one-chain-own-them-all-breaking-ai-infrastructures
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# One Chain to Own Them All: Breaking AI Infrastructures

**One Chain to Own Them All: Breaking AI Infrastructures** - Ji'an Zhou, Publisher not stated.

- Published: date not stated
- Original: <https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf>
- Preserved from: https://media.defcon.org/DEF%20CON%2034/DEF%20CON%2034%20presentations/DEF%20CON%2034%20presentations/DEF%20CON%2034%20-%20Ji%27an%20Zhou%2C%20Lei%20Lu%20-%20One%20Chain%20to%20Own%20Them%20All%20-%20Breaking%20AI%20Infrastructures%20-%20azraelxuemo%20v3.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

2026


One Chain to Own Them All
Breaking AI Infrastructures

Ji'an Zhou




                              1
            01   Introduction



                                02   Journey Begins




Agenda      03   Pwn it!



 CONTENTS                            One Chain,
                                04   All Owned


            05   Summary



                                                      2
Introduction



               3
LLM!




       4
Evolution: LLM → RAG → Agent




                               5
AI + Security




                6
AI For Security




                                               7
                  https://unpromptedcon.org/
Security For AI




                                             8
                  https://www.wiz.io/blog/
Security For AI




                  9
😀 Start of our journey




                         10
Journey Begins



                 11
Classifying AI Targets




                         12
New Security Contest Hosted by Wiz




                                     13
Summary of AI Targets & Categories




                                     14
Data & Vector Storage




                        15
Architecture




               16
Written in Rust




                  17
Pwned?




         18
My Discovery




               19
My Discovery




                                                                   20
               https://github.com/chroma-core/chroma/issues/6717
Pwned Again!




               21
Choose vLLM – Written in Python




                                  22
Latest Version Recap




                       23
Contest Environment Setup




                            24
Supported APIs




                 25
Simple Test




              26
Useless Endpoints




                    27
Common Vulnerability Patterns




                                28
Found A Potential Vulnerability?



                           🤑 SSTI?




                                     29
False Positive
                 😶🌫 Game Over




                                30
31
An Accidental Discovery




                          32
My Previous Finding
                        🤔 Can we succeed again?




                                                                    33
                https://github.com/advisories/GHSA-53q9-r3pm-6pq6
Pwn it!



          34
What is PyTorch?




                   Most popular deep learning framework




                                                          35
Model Save and Load Flow




                           36
Early Stage




              37
Introducing weights_only Mechanism




                                                                 38
                 https://github.com/pytorch/pytorch/pull/86812
Official Security Statement




                                                                             39
                https://github.com/pytorch/pytorch/blob/v2.5.1/SECURITY.md
😎 A bypass here would be massive




                                   40
My Previous Finding

                             CVE-2025-32434




                                                                    41
                https://github.com/advisories/GHSA-53q9-r3pm-6pq6
Attack Approach




                  42
Discovery Recap



             🤩 With this bypass, we can achieve RCE in vLLM!




                                                               43
Discovery Recap




                                                                                         44
          https://github.com/vllm-project/vllm/security/advisories/GHSA-ggpf-24jw-3fcw
Discovery Recap




                  45
     🤩 With this bypass, we can achieve RCE in vLLM!

😂 But they've already updated PyTorch to resolve the issue




                                                             46
47
The Fix




                                                                   48
          https://github.com/pytorch/pytorch/pull/143326/changes
Strict Whitelist




                   49
Simple Test




              50
Inspecting Whitelisted Functions




                   😭 Only these "useless" functions




                                                      51
Inspecting Whitelisted Functions




                        🤨 memory bugs?




                                         52
Quick Test




             🤤 "Overflow"?




                             53
🧐 Can we trigger and how to trigger
          in torch.load?




                                      54
Exploring Model File Format




                              55
Exploring Model File Format




                              56
Equivalent Pseudocode




                        57
Quick Test v2 Function

                         😆 "issue" exist too!




                                                58
Where to Patch?




                          1

                  2
                      3




                              59
Failed
  1. Patch & Save




                    😭 Why?



     2. Load




                             60
Root Cause




             61
False Positive




                 62
First Attempt Failed




                       😢 Not vulnerable




                                          63
First Attempt Failed


                       🤔 What about this part?




                                                 64
A Quick Look at persistent_load




                                  65
Try Again




            😱 Overflow




                         66
Why?




       67
Full Attack Flow
    1. Prepare base model
                            2. Evil pickle opcode




     3. Patch & Save




                                                    68
Full Attack Flow

                   4. Load & Trigger




                      Overflow




                                       69
🧐 Can we turn this memory vulnerability into RCE?




                                                    70
SETITEM & SETITEMS




             🤩 We can fully control the index and the value




                                                              71
Have a Try!




              72
Memory Structure




                   73
A Simple Way to Achieve RCE




                              74
A Simple Way to Achieve RCE


                      😢 How can we leak?




                                           75
All Supported Opcodes




                               😭
                        No opcode for leak




                                             76
77
An Accidental Discovery
                          🤣 No PIE!
                          🤔 But why?




                                       78
🤣 Amazing Feature




                                                                                      79
           https://salsa.debian.org/cpython-team/python3/-/blob/master/debian/rules
😄 We have system address!




                            80
81
Bypass Again!




                                                                                       82
          https://github.com/pytorch/pytorch/security/advisories/GHSA-63cw-57p8-fm3p
Back to vLLM




               83
84
🤕 I do not want this f***ing trick




                                     85
  🤕 I do not want this f***ing trick

😭 Direct torch.load attack with PIE ❌




                                        86
🤕 I do not want this f***ing trick

 🫠 What about vLLM with PIE?




                                     87
Inspiration




              88
Error Exfiltration

            ❌        ✅




                         89
It Works!




            90
Works in vLLM!




                 91
🤩 Bounty?




            92
😭 Not allowed to participate




                               93
Report it to the Official Team




                                 94
🤣 Fixed Before the Competition




                                 95
Unpwned




          96
PyTorch Fix




                                                               97
              https://github.com/pytorch/pytorch/pull/170085
PyTorch Fix




                                                               98
              https://github.com/pytorch/pytorch/pull/170085
Change the Security Statement




                                                                   99
                 https://github.com/pytorch/pytorch/pull/165645/
Final Fix




            100
One Chain, All Owned



                       101
🤨 Why did vLLM introduce this feature?




                                         102
Motivation Behind This Feature




                                                                         103
                https://docs.vllm.ai/en/latest/features/prompt_embeds/
Motivation Behind This Feature




                                                                                                       104
      https://docs.nvidia.com/nim/large-language-models/latest/advanced-use-cases/prompt-embeds.html
Other Affected Components




                            105
What is OpenLLM?




                   106
Configuration




                                                            107
                https://github.com/bentoml/openllm-models
Architecture




               108
Source -> Sink




                 109
What is SGLang?




                  110
Source -> Sink




                 111
Motivation Behind This Feature




                                                                      112
                 https://docs.sglang.io/docs/basic_usage/native_api
Crash? Why?




              113
The Difference




                 114
😬 No PIE required, only exploitable via the trick.




                                                     115
Upgrade PyTorch Version to Resolve This Issue




                                                116
What is ComfyUI?




                   117
Demo Web Page




                118
Feature




                                                                                       119
          https://comfyui-wiki.com/en/comfyui-nodes/loaders/checkpoint-loader-simple
The Vuln




           120
Leak Achieved




                121
Attack Flow




              122
123
Auto-Download Latest Version
             Not affected after PyTorch released the fixed version




                                                                     124
Pwn2Own 2026




               125
What is Dynamo?




                  126
Started Bug Hunting on Announcement Day




                                          127
Three Backends




                 128
Try to Deploy




                129
Errors When Run Directly




                           130
Deploy Successfully




                      131
Architecture




               132
The Vuln




           133
Leak Achieved




                134
🤣 No PIE too!




                135
136
This Target Remains Unchallenged




                                                                                                 137
        https://www.zerodayinitiative.com/blog/2026/5/13/pwn2own-berlin-2026-the-full-schedule
Fix




                                                              138
      https://github.com/ai-dynamo/dynamo/pull/8248/changes
Fix




                                                              139
      https://github.com/ai-dynamo/dynamo/pull/8228/changes
Summary



          140
141
          As more and more people focus on AI security, simple
          Python-level vulnerabilities will become increasingly rare.




          However, for performance reasons, many low-level AI
          components still have to be implemented in C/C++.
Summary

          As a result, memory vulnerabilities will gradually attract
          more attention in the field of AI security.




                                                                        142
2026



Thanks




         143
