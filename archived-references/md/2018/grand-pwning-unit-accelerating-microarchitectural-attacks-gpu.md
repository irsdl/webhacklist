---
type: Whitepaper
title: "Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU"
description: "Integrated mobile GPUs, reachable from JavaScript through WebGL, supply the primitives for microarchitectural attacks: precise timers, a side channel over the GPU cache, and control over physical memory. The authors reverse engineer the Adreno 330 cache and mount the first reliable Rowhammer bit flips from a mobile browser, compromising a phone in under two minutes."
resource: "https://download.vusec.net/papers/glitch_sp18.pdf"
tags: [whitepaper, webseclist-reference, side-channel, timing-attack, javascript, android, sandbox-escape]
generated:
  by: webseclist-refs/1
  at: "2026-08-12T16:01:49+00:00"
status: stable
stale_after: 2027-08-12
sources:
  - id: original
    resource: "https://download.vusec.net/papers/glitch_sp18.pdf"
    title: "Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU"
    author: Pietro Frigo, Cristiano Giuffrida, Herbert Bos, Kaveh Razavi
also_at: []
authors:
  - Pietro Frigo
  - Cristiano Giuffrida
  - Herbert Bos
  - Kaveh Razavi
canonical_url: ""
cited_by:
  - "2018.md:72"
commit: ""
content_sha256: 22ceb541d0c1e8c48acb39f3576578c5d77dd4d3c5252627ede9a0d1e8ce77c4
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://download.vusec.net/papers/glitch_sp18.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: e94b5190652323c2e2fe26472fc1a36b60365600a749d250e2c4953e8d17124d
retrieved_from: "https://download.vusec.net/papers/glitch_sp18.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-12T16:01:49+00:00"
slug: grand-pwning-unit-accelerating-microarchitectural-attacks-gpu
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU

**Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU** - Pietro Frigo, Cristiano Giuffrida, Herbert Bos, Kaveh Razavi, Publisher not stated.

- Published: date not stated
- Original: <https://download.vusec.net/papers/glitch_sp18.pdf>
- Preserved from: https://download.vusec.net/papers/glitch_sp18.pdf (stored) on 2026-08-12
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU

--- page 1 ---

Grand Pwning Unit: Accelerating Microarchitectural
Attacks with the GPU
Pietro Frigo
Vrije Universiteit
Amsterdam
p.frigo@vu.nl
Cristiano Giuffrida
Vrije Universiteit
Amsterdam
giuffrida@cs.vu.nl
Herbert Bos
Vrije Universiteit
Amsterdam
herbertb@cs.vu.nl
Kaveh Razavi
Vrije Universiteit
Amsterdam
kaveh@cs.vu.nl
Abstract
—Dark silicon is pushing processor vendors to add
more specialized units such as accelerators to commodity pro-
cessor chips. Unfortunately this is done without enough care to
security. In this paper we look at the security implications of
integrated Graphical Processor Units (GPUs) found in almost
all mobile processors. We demonstrate that GPUs, already
widely employed to accelerate a variety of benign applications
such as image rendering, can also be used to “accelerate”
microarchitectural attacks (i.e., making them more effective) on
commodity platforms. In particular, we show that an attacker
can build all the necessary primitives for performing effective
GPU-based microarchitectural attacks and that these primitives
are all exposed to the web through standardized browser ex-
tensions, allowing side-channel and Rowhammer attacks from
JavaScript. These attacks bypass state-of-the-art mitigations and
advance existing CPU-based attacks: we show the rst end-to-
end microarchitectural compromise of a browser running on
a mobile phone in under two minutes by orchestrating our
GPU primitives. While powerful, these GPU primitives are not
easy to implement due to undocumented hardware features. We
describe novel reverse engineering techniques for peeking into the
previously unknown cache architecture and replacement policy
of the Adreno 330, an integrated GPU found in many common
mobile platforms. This information is necessary when building
shader programs implementing our GPU primitives. We conclude
by discussing mitigations against GPU-enabled attackers.
I. I
NTRODUCTION
Microarchitectural attacks are increasingly popular for leak-
ing secrets such as cryptographic keys [39], [52] or compro-
mising the system by triggering bit ips in memory [42], [45],
[48], [51]. Recent work shows that these attacks are even
possible through malicious JavaScript applications [7], [18],
[20], [38], signicantly increasing their real-world impact. To
counter this threat, the research community has proposed a
number of sophisticated defense mechanisms [8], [9], [29].
However, these defenses implicitly assume that the attacker's
capabilities are limited to those of the main CPU cores.
In this paper, we revisit this assumption and show that it
is insufcient to protect only against attacks that originate
from the CPU. We show, for the rst time, that the Graphics
Processing Units (GPUs) that manufacturers have been adding
to most laptops and mobile platforms for years, do not just
accelerate video processing, gaming, deep learning, and a host
of other benign applications, but also boost microarchitectural
attacks. From timers to side channels, and from control over
physical memory to efcient Rowhammer attacks, GPUs offer
all the necessary capabilities to launch advanced attacks.
Worse, attackers can unlock the latent power of GPUs even
from JavaScript code running inside the browser, paving the
way for a new and more powerful family of remote microarchi-
tectural attacks. We demonstrate the potential of such attacks
by bypassing state-of-the-art browser defenses [9], [29], [44]
and presenting the rst reliable GPU-based Rowhammer attack
that compromises a browser on a phone in under two minutes.
We specically focus on mobile platforms given that, on
such platforms, triggering Rowhammer bit ips in sandboxed
environments is particularly challenging and has never been
demonstrated before. Yet, mobile devices are particularly
exposed to Rowhammer attacks given that catch-all defenses
such as ANVIL [5] rely on efcient hardware monitoring
features that are not available on ARM.
Integrated Processors
While transistors are becoming ever
smaller allowing more of them to be packed in the same chip,
the power to turn them all on at once is stagnating. To mean-
ingfully use the available dark silicon for common, yet com-
putationally demanding processing tasks, manufacturers are
adding more and more specialized units to the processors, over
and beyond the general purpose CPU cores [12], [14], [49].
Examples include integrated cryptographic accelerators, audio
processors, radio processors, network interfaces, FPGAs, and
even tailored processing units for articial intelligence [43].
Unfortunately, the inclusion of these special-purpose units in
the processor today appears to be guided by a basic security
model that mainly governs access control, while entirely ig-
noring the threat of more advanced microarchitectural attacks.
GPU-based Attacks
One of the most commonly integrated
components is the Graphics Processing Unit (GPU). Most
laptops today and almost all mobile devices contain a pro-
grammable GPU integrated on the main processor's chip [26].
In this paper, we show that we can build all necessary
primitives for performing powerful microarchitectural attacks
directly from this GPU. More worrying still, we can perform
these attacks directly from JavaScript, by exploiting the We-
bGL API which exposes the GPU to remote attackers.
More specically, we show that we can program the GPU
to construct very precise timers, perform novel side channel
attacks, and, nally, launch more efcient Rowhammer attacks
from the browser on mobile devices. All steps are relevant.

--- page 2 ---

300350400450
Counter value0.020.040.06FrequencyUncachedCached

--- page 3 ---

DEFG
