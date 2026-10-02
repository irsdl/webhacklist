---
type: Article
title: "Hertzbleed: Turning Power Side-Channel Attacks Into Remote Timing Attacks on x86"
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:23:46+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen"
    title: "Hertzbleed: Turning Power Side-Channel Attacks Into Remote Timing Attacks on x86"
    author: Yingchen Wang, Riccardo Paccagnella, Elizabeth Tang He, Hovav Shacham, Christopher W. Fletcher, David Kohlbrenner
  - id: capture
    resource: "https://web.archive.org/web/20221221114311/https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen"
also_at:
  - "https://www.usenix.org/system/files/sec22-wang-yingchen.pdf"
  - "https://www.usenix.org/system/files/usenixsecurity22-wang-yingchen.pdf"
authors:
  - Yingchen Wang
  - Riccardo Paccagnella
  - Elizabeth Tang He
  - Hovav Shacham
  - Christopher W. Fletcher
  - David Kohlbrenner
canonical_url: ""
cited_by:
  - "2022.md:60"
commit: ""
content_sha256: e90f34fd5c05cea4a30188eb3ee84d823d2d385d957279c6263022c213d92f05
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: d05c0d742226a805a38505f346944eca7c932a33416299abc8a589777ca7ab1b
retrieved_from: "https://www.usenix.org/system/files/sec22-wang-yingchen.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:23:46+00:00"
slug: usenix-org-hertzbleed-turning-power-side-channel-attacks-remote-timing-x86
snapshot: 20221221114311
title_english: ""
translation_file: ""
translation_of: ""
---

# Hertzbleed: Turning Power Side-Channel Attacks Into Remote Timing Attacks on x86

**Hertzbleed: Turning Power Side-Channel Attacks Into Remote Timing Attacks on x86** - Yingchen Wang, Riccardo Paccagnella, Elizabeth Tang He, Hovav Shacham, Christopher W. Fletcher, David Kohlbrenner, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen>
- Also published at: <https://www.usenix.org/system/files/sec22-wang-yingchen.pdf>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity22-wang-yingchen.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-wang-yingchen.pdf (live) on 2026-08-19
- Capture timestamp: 20221221114311
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Hertzbleed: Turning Power Side-Channel Attacks
      Into Remote Timing Attacks on x86
   Yingchen Wang, University of Texas at Austin; Riccardo Paccagnella and
Elizabeth Tang He, University of Illinois Urbana-Champaign; Hovav Shacham,
  University of Texas at Austin; Christopher W. Fletcher, University of Illinois
      Urbana-Champaign; David Kohlbrenner, University of Washington
   https://www.usenix.org/conference/usenixsecurity22/presentation/wang-yingchen




       This paper is included in the Proceedings of the
              31st USENIX Security Symposium.
                    August 10–12, 2022 • Boston, MA, USA
                                 978-1-939133-31-1




                                        Open access to the Proceedings of the
                                         31st USENIX Security Symposium is
                                               sponsored by USENIX.
                                Hertzbleed: Turning Power Side-Channel Attacks
                                      Into Remote Timing Attacks on x86

                            Yingchen Wang∗               Riccardo Paccagnella∗         Elizabeth Tang He
                              UT Austin                         UIUC                         UIUC
                        Hovav Shacham                   Christopher W. Fletcher           David Kohlbrenner
                          UT Austin                             UIUC                             UW


                               Abstract                                on many of today’s general-purpose processors, have been
   Power side-channel attacks exploit data-dependent varia-            abused to fingerprint websites [95], recover RSA keys [70],
tions in a CPU’s power consumption to leak secrets. In this            break KASLR [63], and even recover AES-NI keys [64].
paper, we show that on modern Intel (and AMD) x86 CPUs,                   Fortunately, software-based power-analysis attacks can be
power side-channel attacks can be turned into timing attacks           mitigated and easily detected by blocking (or restricting [10])
that can be mounted without access to any power measure-               access to power measurement interfaces. Up until today, such
ment interface. Our discovery is enabled by dynamic voltage            a mitigation strategy would effectively reduce the attack sur-
and frequency scaling (DVFS). We find that, under certain              face to physical power analysis, a significantly smaller threat
circumstances, DVFS-induced variations in CPU frequency                in the context of modern general-purpose x86 processors.
depend on the current power consumption (and hence, data)                 In this paper, we show that, on modern Intel (and AMD)
at the granularity of milliseconds. Making matters worse,              x86 CPUs, power-analysis attacks can be turned into timing
these variations can be observed by a remote attacker, since           attacks—effectively lifting the need for any power measure-
frequency differences translate to wall time differences!              ment interface. Our discovery is enabled by the aggressive dy-
   The frequency side channel is theoretically more powerful           namic voltage and frequency scaling (DVFS) of these CPUs.
than the software side channels considered in cryptographic            DVFS is a commonly-used technique that consists of dynami-
engineering practice today, but it is difficult to exploit because     cally adjusting CPU frequency to reduce power consumption
it has a coarse granularity. Yet, we show that this new channel        (during low CPU loads) and to ensure that the system stays
is a real threat to the security of cryptographic software. First,     below power and thermal limits (during high CPU loads). We
we reverse engineer the dependency between data, power,                find that, under certain circumstances, DVFS-induced CPU
and frequency on a modern x86 CPU—finding, among other                 frequency adjustments depend on the current power consump-
things, that differences as seemingly minute as a set bit’s            tion at the granularity of milliseconds. Therefore, since the
position in a word can be distinguished through frequency              power consumption is data dependent, it follows transitively
changes. Second, we describe a novel chosen-ciphertext at-             that CPU frequency adjustments are data dependent too.
tack against (constant-time implementations of) SIKE, a post-             Making matters worse, we show that data-dependent fre-
quantum key encapsulation mechanism, that amplifies a sin-             quency adjustments can be observed without the need for any
gle key-bit guess into many thousands of high- or low-power            special privileges and even by a remote attacker. The reason is
operations, allowing full key extraction via remote timing.            that CPU frequency differences directly translate to execution
                                                                       time differences (as 1 hertz = 1 cycle per second). The security
                                                                       implications of this finding are significant. For example, they
1     Introduction                                                     fundamentally undermine constant-time programming, which
                                                                       has been the bedrock defense against timing attacks since their
Power-analysis attacks have been known for decades to be
                                                                       discovery in 1996 [58]. The premise behind constant-time
a powerful source of side channel information leakage. His-
                                                                       programming is that by writing a program to only use “safe”
torically, these attacks were used to leak cryptographic se-
                                                                       instructions, whose latency is invariant to the data values, the
crets from embedded devices like smart cards using physical
                                                                       program’s execution time will be data-independent. With the
probes [3,39,59,68,74,75]. Recently, however, power-analysis
                                                                       frequency channel, however, timing becomes a function of
attacks have been shown to be exploitable also via software
                                                                       data—even when only safe instructions are used.
power measurement interfaces. Such interfaces, available
                                                                          Despite its theoretical power, it is not obvious how to con-
    ∗ These authors contributed equally to this work.                  struct practical exploits through the frequency side channel.



USENIX Association                                                                         31st USENIX Security Symposium         679
This is because DVFS updates depend on the aggregate power          and to AMD in Q1 2022. The attack was assigned CVE-2022-
consumption over millions of CPU cycles and only reflect            23823 and CVE-2022-24436 and held under embargo until
coarse-grained program behavior. Yet, we show that the fre-         June 14, 2022. Intel committed to awarding us a bug bounty.
quency side channel is a real threat to the security of crypto-     Cloudflare and Microsoft deployed a mitigation to CIRCL
graphic software, by (i) reverse engineering a precise leakage      and PQCrypto-SIDH, respectively.
model for this channel on modern x86 CPUs, and (ii) showing
that some cryptographic primitives admit amplification of
single key bit guesses into thousands of high- or low-power         2     Background and Related Work
operations, enough to induce a measurable timing difference.
   To construct a leakage model, we reverse engineer the de-        Intel P-States In Intel processors, dynamic voltage and fre-
pendency between data being computed on and power con-              quency scaling (DVFS) works at the granularity of P-states.
sumption / frequency on modern x86 Intel CPUs. Our results          P-states correspond to different operating points (voltage-
reveal that power consumption and CPU frequency depend on           frequency pairs) in 100 MHz frequency increments [49]. The
both the Hamming weight (HW) of data being processed and            number of P-states varies across different CPU models. Mod-
the Hamming distance (HD) of data across computations. We           ern Intel processors offer two mechanisms to control P-states,
show, for the first time, that these two effects are distinct and   namely SpeedStep and Speed Shift / Hardware Controlled Per-
additive on modern Intel CPUs. Further, the HW effect is non        formance States (HWP). With SpeedStep, P-states are man-
uniform. That is, computing on data with the same HW results        aged by the operating system (OS) using hardware coordina-
in differences in power consumption / frequency depending           tion feedback registers. With HWP, P-states are managed en-
on the position of individual 1s within data values. The take-      tirely by the processor, increasing the overall responsiveness.
away is that computing on data with different bit patterns          HWP was introduced with the Skylake microarchitecture [78].
depending on a secret can result in different power consump-        When HWP is enabled, the OS can only give hints to the pro-
tions and frequencies depending on that secret. We expect that      cessor’s internal P-state selection logic, including restricting
this information will also be useful towards building future,       the range of available P-states [91]. Otherwise, the available
Intel-specific power leakage emulators [11, 60, 72, 87, 89]. We     range of P-states depends only on the number of active cores
find that AMD x86 CPUs also feature a similar leakage model,        and on whether “Turbo Boost” is enabled [55]. Our P-state
but leave reverse engineering its details to future work.           naming convention follows the one used in Linux [91].1 The
                                                                    lowest P-state corresponds to the lowest supported CPU fre-
   We then describe a novel attack, including new cryptana-
                                                                    quency. The highest P-state corresponds to the “max turbo”
lytic techniques, on two production-ready, constant-time im-
                                                                    frequency for the processor. However, when Turbo Boost is
plementations of SIKE (Supersingular Isogeny Key Encap-
                                                                    disabled, the highest available P-state is the base frequency.
sulation [52]). SIKE is a decade old, widely studied key en-
                                                                    We use the term P-state and frequency interchangeably.
capsulation mechanism. Unlike other finalists in NIST’s Post-
                                                                       P-state management is also related to power management.
Quantum Cryptography competition, SIKE has both short
                                                                    Each Intel processor has a Thermal Design Point (TDP), indi-
ciphertexts and short public keys — and a “well-understood”
                                                                    cating the expected power consumption at steady state under
side channel posture [20]. In our attack, we show that, when
                                                                    a sustained workload [22, 40]. While in the max turbo mode,
provided with a specially-crafted input, SIKE’s decapsula-
                                                                    the processor can exceed its nominal TDP [47]. However, if
tion algorithm produces anomalous 0 values that depend on
                                                                    the CPU hits a certain power and thermal limit while in max
single bits of the key. Worse so, these values cause the algo-
                                                                    turbo mode, the hardware will automatically downclock the
rithm to get stuck and operate on intermediate values that are
                                                                    frequency to stay at TDP for the duration of the workload.
also 0 for the remainder of the decapsulation. When this hap-
pens, the processor consumes less power and runs at a higher
                                                                    Data-Dependent Power Consumption It is well-known
frequency than usual, and therefore decapsulation takes a
                                                                    that a processor’s power consumption depends on the data
shorter wall time. This timing signal is so robust that key
                                                                    being processed [46, 68]. The precise dependency between
extraction is possible across a network, as we demonstrate
                                                                    data and power consumption depends on the processor’s im-
for the SIKE implementations in both Cloudflare’s Interop-
                                                                    plementation, but can be approximated using leakage mod-
erable Reusable Cryptographic Library (CIRCL) [28] and
                                                                    els. Two commonly-used leakage models are the Hamming
Microsoft’s PQCrypto-SIDH [66]. Our unoptimized version
                                                                    distance (HD) [9, 61, 68, 71, 77] and the Hamming weight
of the attack recovers the full key from these libraries in 36
                                                                    (HW) [56, 61, 67, 71, 73, 74, 88] models. In the HD model,
and 89 hours, respectively. Finally, we show that the frequency
                                                                    power consumption depends to the number of 1 → 0 and
side channel can also be used to mount timing attacks without
                                                                    0 → 1 bit transitions occurring in the data during a computa-
a timer, such as a KASLR break and a covert channel.
                                                                    tion. In the HW model, power consumption just depends on
                                                                    the number of bits that are 1 in the data being processed.
Disclosure We disclosed our findings, together with proof-
of-concept code, to Intel, Cloudflare and Microsoft in Q3 2021          1 However, Intel refers to higher frequencies as lower P-states [48, 50].




680   31st USENIX Security Symposium                                                                                    USENIX Association
       Table 1: CPUs tested in our experimental setups.                           4.5                         Frequency (GHz)
                                                                                                                                4.5                            Frequency (GHz)
                                                                                  4.4                                           4.4
                                                                                  4.3                                           4.3
                                                                                  4.2                                           4.2
                                                      Base      Max Turbo         4.1                                           4.1
    CPU Model       Microarchitecture    Cores                                    4.0                                           4.0
                                                   Frequency    Frequency         3.9                                           3.9
    i7-8700       Coffee Lake              6       3.20 GHz      4.60 GHz         120                              Power (W)    120                                 Power (W)
                                                                                  110                                           110
    i7-9700       Coffee Lake Refresh      8       3.00 GHz      4.70 GHz         100                                           100
    i9-10900K     Comet Lake               10      3.70 GHz      5.30 GHz          90                                            90
                                                                                   80                                            80
    i7-11700      Rocket Lake               8      2.50 GHz      4.90 GHz          70                                            70
    i7-10850H     Ice Lake (mobile)        6       2.70 GHz      5.10 GHz          60                                            60
    i7-1185G7     Tiger Lake (mobile)      4       3.00 GHz      4.80 GHz
                                                                                        0     5              10           15           0       5              10           15
                                                                                                  Time (s)                                         Time (s)
                                                                                  (a) Run of the int32-float test                     (b) Run of the int32 test
Power Side-Channel Attacks Power side-channel attacks                             Figure 1: Example of distinguishing workloads using fre-
against cryptosystems were first publicly discussed by Kocher                     quency traces on our i7-9700 CPU. The lighter workload
in 1998 [59]. His work introduced analytical techniques that                      (int32) allows for longer runtimes at higher frequencies than
exploit the data dependency of power consumption to reveal                        the heavier workload (int32-float).
secret keys. Following works demonstrated power-analysis
attacks against several cryptographic algorithms including
AES [14, 67], DES [74], RSA [30, 75, 80, 94], and ElGa-
mal [16,30].2 However, all these attacks were targeted against                    of our CPUs. We pick two workloads from the stress-ng
smart cards and required physical access to the device. More                      benchmark suite [57]. The first workload consists of 32-bit
recently, power side-channel attacks have been applied also to                    integer and floating-point operations (int32float method),
more complex devices such as smartphones [15,35,76,92,93]                         while the second workload consists of only 32-bit integer oper-
and PCs [36, 63, 64, 70, 95]. Some of these attacks rely only                     ations (int32 method). We run both benchmarks on all cores
on software power measurement interfaces, meaning that they                       and starting from an idle machine. We sample the CPU fre-
do not need proximity to the device. However, while some                          quency and the (package domain) power consumption every
of these works use the HW and HD leakage models [64, 70],                         5 ms during the benchmark’s execution.
none of them presents a systematic reverse engineering of the
                                                                                     Figure 1a shows the results for the int32float test on our
dependency between power consumption and data on modern
                                                                                  i7-9700 CPU. The frequency starts at 4.5 GHz, the highest
Intel x86 CPUs. Further, all these attacks can be blocked by
                                                                                  P-state available when all cores are active on our CPU. This
restricting access to such power measurement interfaces.
                                                                                  frequency is sustained for about 8 seconds, during which the
                                                                                  power consumption is allowed to exceed the TDP. Then, the
3     CPU Frequency Leakage Channel                                               CPU drops to a lower P-state, bringing the power consumption
                                                                                  down to TDP (65 W on our CPU). From there onwards, the
In this section, we analyze the leakage from CPU frequency                        CPU remains in steady state and power stays around the TDP
variations on modern Intel processors. We show that, un-                          level for the duration of the workload. In our example, at
der certain circumstances, the distribution of a processor’s                      steady state the frequency oscillates between two P-states,
frequencies leaks information about the instructions being                        corresponding to the frequencies of 3.9 GHz and 4.0 GHz.
executed as well as the data being processed.
                                                                                     Figure 1b shows the results for the int32 stress test. Here
Experimental Setup We run our experiments on several                              too, the frequency starts at 4.5 GHz and later drops to a lower
different machines. The characteristics of the CPU of each                        P-state. However, compared to Figure 1a, (i) the drop occurs
machine are reported in Table 1. All our machines run Ubuntu                      later, after 10 seconds, and (ii) the P-states used after the drop
with versions either 18.04 or 20.04, kernel either 4.15 or 5.4,                   are higher, corresponding to 4.0 GHz and 4.1 GHz. This is
and the latest microcode patches installed. Unless otherwise                      because the power consumption of the int32 test is lower. As
noted, we use the default system configuration, without re-                       a consequence, not only can the processor sustain the highest
stricting the P-states. To monitor CPU frequency, we use the                      available P-state for longer, but it can also use higher P-states
MSR_IA32_MPERF and MSR_IA32_APERF registers, as done in                           in steady state without exceeding the TDP.
the Linux kernel [62]. To monitor power consumption, we                              The key takeaway from the above results is that both (i)
use the MSRs of the RAPL interface, following Weaver [90].                        the time that a processor can spend at the maximum available
                                                                                  P-state and (ii) the distribution of P-states at steady state de-
3.1    Distinguishing Instructions                                                pend on the CPU power consumption. Since the CPU power
As a first step for our analysis, we set out to understand how                    consumption depends on the workload, by the transitive prop-
running different workloads affects the P-state selection logic                   erty it follows that P-states depend on the workload too. This
                                                                                  implies that dynamic scaling of P-states leaks information
    2 For a comprehensive survey of these attacks, we refer to prior work [68].   about the current workload running on the processor.



USENIX Association                                                                                           31st USENIX Security Symposium                             681
              0.8                                                                                      hw=16
                                             hw=16                         6                                      4     CPU Frequency Leakage Model




                                                     Probability density
                                             hw=32                                                     hw=32
              0.6                            hw=48                                                     hw=48
Probability



                                                                           4
              0.4                                                                                                 We saw that the power consumption and the distribution of
              0.2                                                          2                                      P-states in Intel CPUs depend on the data being processed.
              0.0                                                          0                                      The goal of this section is to construct a leakage model of this
                       4.3             4.4                                         19.5        20.0        20.5   behavior. To this end, we reverse engineer the dependency be-
                         Frequency (GHz)                                       Seconds before steady state
                                                                                                                  tween power consumption/frequency and data on the ALU of
         (a) Frequency at steady state                       (b) Seconds before steady state                      modern Intel CPUs. As we show in Section 5, this information
                                                                                                                  can help an attacker construct side-channel attacks.
  Figure 2: Distinguishing data (in the source register to a shlx
  instruction) using frequency traces on our i7-9700 CPU. Fig-                                                    Scope Precisely understanding where power is dissipated
  ure 2a is over 30,000 samples. Figure 2b is over 100 traces.                                                    as a function of data on general-purpose x86 processors is a
                                                                                                                  challenging task. The reason is that the microarchitecture of
                                                                                                                  modern x86 processors is (i) highly complex and (ii) largely
  3.2               Distinguishing Data                                                                           undocumented. Fortunately, studying the power consumption
  We saw that P-state information leaks information about the                                                     across all microarchitectural units is not necessary to build
  instructions being executed (i.e., the workload). We now ex-                                                    attacks. This is because the vast majority of computations
  plore if the frequency leakage channel can leak information                                                     performed by modern, constant-time cryptographic software
  about the data being processed by instructions. Our question                                                    occurs in the arithmetic logic unit (ALU). Since our primary
  is motivated by the fact that power consumption on x86 pro-                                                     goal is to build a model that is useful to leak secrets from
  cessors is known to be data dependent [64]. It is thus natural                                                  constant-time cryptographic code, the analysis in this section
  to ask: do data-dependent differences in power consumption                                                      focuses specifically on the ALU component.
  show in the distribution of P-states?                                                                           Methodology We use the experimental setup of Section 3.
     To answer this question, we monitor the CPU frequency                                                        In each experiment, we run a fixed set of ALU instructions
  while executing the same instructions and only changing the                                                     (the sender) in a loop on all cores, while varying the input
  content of the input registers. For example, we use the shlx                                                    contents. We carefully design our senders to target specific
  instruction to continuously shift left the bits of a source regis-                                              behaviors and minimize side effects. First, to reduce power
  ter and write the result into different destination registers in a                                              consumption from other core units such as the cache, we
  loop, while only varying the content of the source register. We                                                 always use register to register instructions without any mem-
  run this experiment on all cores and compare the distribution                                                   ory access. Second, to avoid any datapath contamination ef-
  of the P-states in steady state. Figure 2a shows the results                                                    fects caused by incrementing the loop counter variable and
  when we set the content of the source register to have 16, 32                                                   evaluating loop conditions, we run our sender in an infinite
  or 48 ones. In all cases the P-state oscillated between 4.3 GHz                                                 loop that we manually terminate at the end of the experiment.
  and 4.4 GHz. However, the larger the Hamming weight, the                                                        Third, to avoid introducing unintended HD effects, we inter-
  more the frequency stayed at the lower P-state. We also saw                                                     leave different instructions in such a way that encourages full
  a data-dependent difference in terms of when the frequency                                                      throughput on all available ports [1, 2]. Finally, we run each
  drops to steady state if we start from idle (cf. Figure 2b). The                                                sender in two setups. In the first setup, we use the default
  larger the Hamming weight, the quicker the frequency drops                                                      system configuration, warm up the machine until it enters
  to steady state. This is because, as we show in Section 4, pro-                                                 steady state, and monitor the frequency. In the second setup,
  cessing data with larger Hamming weights consumes more                                                          we disable SpeedStep / HWP (this way, our processor stays
  power than processing data with lower Hamming weights.                                                          at the base frequency for the duration of the workload) and
     We get similar results with other instructions too. For ex-                                                  monitor the (core domain) power consumption. We sample
  ample, we observed data-dependent effects when running or,                                                      power/frequency every 1 ms, collect 30, 000 data points for
  xor, and, imul, add, sub, as well as when computing on data                                                     each experiment and use their mean for our analyses.
  loaded from memory. The only caveat is that, for some in-
  structions, the power consumption of just running the target
                                                                                                                  4.1   Hamming Distance (HD) Effect
  instruction in a loop on all cores was not large enough to
  cause the P-state to ever drop to steady state. In these cases,                                                 To start, we set out to understand if the number of 1 → 0
  we ran an additional, fixed workload in the background to                                                       and 0 → 1 transitions affects power consumption / frequency.
  push the total power consumption up.                                                                            Recall that these transitions depend on the number of bits
     The key takeaway of the above results is that dynamic                                                        that differ (also known as the HD) between consecutive data
  scaling of P-states leaks information about the data being                                                      values being processed. To study the dependency between HD
  processed. In the following sections, we use the distribution                                                   and power consumption / frequency, we then need a sender
  of P-states at steady state as our leakage channel.                                                             that offers fine-grained control over the number of transitions,



  682               31st USENIX Security Symposium                                                                                                         USENIX Association
                         rax = COUNT                                                      rax = LEFT                                   rax = rcx = rdx = rsi = rdi = FIRST
                         rbx = 0x0000FFFFFFFF0000                                         rcx = … = r11 = RIGHT                        rbx = r8 = r9 = r10 = r11 = SECOND
                         loop:                                                            loop:                                        loop:
                             shlx %rax,%rbx,%rcx        // rcx = rbx << rax                 or %rax,%rcx    // rcx = rax | rcx           or %rax,%rcx     // rcx = rax | rcx
                             shlx %rax,%rbx,%rdx        // rdx = rbx << rax                 or %rax,%rdx    // rdx = rax | rdx           or %rax,%rdx     // rdx = rax | rdx
                             shrx %rax,%rbx,%rsi        // rsi = rbx >> rax                 or %rax,%rsi    // rsi = rax | rsi           or %rax,%rsi     // rsi = rax | rsi
                             shrx %rax,%rbx,%rdi        // rdi = rbx >> rax                 or %rax,%rdi    // rdi = rax | rdi           or %rax,%rdi     // rdi = rax | rdi
                             shlx %rax,%rbx,%r8         // r8       = rbx << rax            or %rax,%r8     // r8   = rax | r8           or %rbx,%r8      // r8   = rbx | r8
                             shlx %rax,%rbx,%r9         // r9       = rbx << rax            or %rax,%r9     // r9   = rax | r9           or %rbx,%r9      // r9   = rbx | r9
                             shrx %rax,%rbx,%r10        // r10 = rbx >> rax                 or %rax,%r10    // r10 = rax | r10           or %rbx,%r10     // r10 = rbx | r10
                             shrx %rax,%rbx,%r11        // r11 = rbx >> rax                 or %rax,%r11    // r11 = rax | r11           or %rbx,%r11     // r11 = rbx | r11
                         jmp loop                                                         jmp loop                                     jmp loop


                              (a) Sender for our HD experiments.                          (b) Sender for our HW experiments.         (c) Sender for our HW+HD experiments.

    Figure 3: Different sets of instructions (senders) used to reverse engineer the dependency between data and power consumption /
    frequency on our CPUs. Different senders are designed to target different effects. Each sender can be run with variable inputs.


                  4.29                                                  23.8
                                                                                                                Figure 4 shows the results when we vary the COUNT value.
Frequency (GHz)




                                                                                                             We see that the power consumption grows and the frequency
                  4.28
                                                            Power (W)




                                                                        23.6
                                                                                                             drops when COUNT grows, confirming that the number of bit
                  4.27                                                  23.4                                 transitions directly affects power consumption and frequency.
                  4.26                                                  23.2                                 In Appendix A.1, we corroborate this observation with an ad-
                         0          5       10     15                          0   5       10        15      ditional experiment where transitions occur in the ALU input.
                                        COUNT                                          COUNT                 These results are consistent on all the CPUs of Table 1.
                   (a) Frequency vs COUNT                                  (b) Power vs COUNT
                                                                                                                  1. Larger Hamming distances between data values being
    Figure 4: Effect of increasing COUNT in Figure 3a’s sender                                                    processed contribute to larger power consumptions and
    on our i7-9700 CPU. Higher COUNT values cause higher HDs                                                      lower steady-state frequencies.
    in the ALU output. As the HD increases, the mean power con-
    sumption grows and the mean steady-state frequency drops.                                                4.2     Hamming Weight (HW) Effect
                                                                                                             We now set out to understand if the HW of the data values be-
  while avoiding other potential side effects. For example, test-                                            ing processed affects power consumption / frequency. Recall
  ing different HDs should not require changing the number of                                                that the idea behind the HW model is that power consumption
  1s in the input (which, as we show below, is a separate effect).3                                          depends on the number of 1s in the data being processed. To
     We design our sender to use interleaved shlx and shrx                                                   study the dependency between HW and power consumption /
  instructions, as shown in Figure 3a. These instructions shift                                              frequency, we need a sender that offers fine-grained control
  the bits of the second source register to the left or right by a                                           over the number of 1s, while avoiding other potential side
  COUNT value stored in the first source register. The result is                                             effects. For example, testing different HWs should not require
  written to a separate destination register. Since on our CPUs                                              bit transitions in the data (i.e., the HD effect).
  shlx and shrx execute on port 0 and port 6 [1], we interleave                                                 To satisfy the above requirements, we design a sender that
  them in groups of two. We fix the content of the second source                                             uses or logic instructions, as shown in Figure 3b. These in-
  register to 0x0000ffffffff0000, corresponding to 16 zeros,                                                 structions perform a bitwise inclusive or operation between
  followed by 32 ones, followed by 16 zeros. We then shift this                                              the source register and the destination register, and store the
  register left and right by COUNT (with 0 ≤ COUNT ≤ 16).                                                    result in the destination register. We always use the same
     By construction, the HD in the ALU output between a shlx                                                input and output registers for all the or instructions in the
  and a shrx is 4 × COUNT. For example, when COUNT = 8,                                                      loop. We fix the content of the source register to LEFT, and
  the output of each shlx is 0x00ffffffff000000, and the                                                     set the initial content of the output register to RIGHT.
  output of each shrx is 0x000000ffffffff00, translating to                                                     By construction, the number of bit transitions occurring on
  4 × 8 bit transitions in the ALU output. Yet, the ALU input                                                the ALU input and output during the execution of the above
  remains unchanged and the number of 1s in the source and                                                   sender is zero. The reason is that all or instructions take the
  the destination registers is fixed.4                                                                       same inputs and produce the same output during an experi-
                                                                                                             ment. Hence, we can test different HW in the source registers
        3 This requirement implies that approaches such as using a xor instruction                           without introducing any HD effects. An added benefit of us-
    to cause bit transitions are not suitable, because triggering different numbers                          ing or instructions is that they allow us to study the effects
    of transitions would also require using different numbers of 1s in the input.
        4 The only other variable is the number of 1s in the COUNT register itself,                          which varies between 1 and 4. However, this effect is negligible.




    USENIX Association                                                                                                               31st USENIX Security Symposium              683
                                              From LSB               27.25                                                  4.16
                  4.16                        From MSB
                                                                                 From LSB
                                                                                 From MSB
                                                                                                                                                                          27.25
Frequency (GHz)




                                                                                                          Frequency (GHz)
                                                                     27.00
                                                                                                                                                                          27.00




                                                                                                                                                              Power (W)
                                                         Power (W)
                                                                     26.75                                                  4.14
                  4.14                                                                                                                                                    26.75
                                                                     26.50
                                                                                                                                                                          26.50
                  4.12                                               26.25                                                  4.12                                          26.25
                         0    20     40          60                          0       20     40       60                            0     2     4     6    8                       0      2     4     6    8
                             Hamming weight                                         Hamming weight                                       Hamming weight                                  Hamming weight
                     (a) Frequency vs HW                                     (b) Power vs HW                                   (a) Frequency vs HW                                (b) Power vs HW

    Figure 5: Effect of varying the number of consecutive 1s in                                               Figure 6: Effect of varying the number of non-consecutive 1s
    the LEFT = RIGHT input to Figure 3b’s sender on our i7-9700                                               in the LEFT = RIGHT input to Figure 3b’s sender on our i7-
    CPU. As we increase the number of 1s, the mean power con-                                                 9700 CPU. The results confirm that larger HWs cause higher
    sumption grows and the mean steady-state frequency drops.                                                 power consumptions and lower steady-state frequencies.

                                                                                                                             0.004




                                                                                                          Frequency (GHz)
    of changing some bits of the input register (LEFT) without                                                                                                            0.20




                                                                                                                                                              Power (W)
    affecting the contents of the output register (RIGHT). We use                                                            0.006                                        0.15
    this sender to perform multiple experiments.
                                                                                                                             0.008                                        0.10
   Consecutive 1s We start our analysis of the HW effect by
                                                                                                                                       0 1 2 3 4 5 6 7                            0 1 2 3 4 5 6 7
   checking if the number of leading or trailing 1s in the data af-                                                                         Byte index                                 Byte index
   fects power consumption / frequency. We set LEFT = RIGHT
                                                                                                                (a) Effect of 0xFF to frequency                           (b) Effect of 0xFF to power
   such that the inputs and outputs of all or instructions are al-
   ways the same. We then run the sender with a varying HW in                                                 Figure 7: Effect of setting single bytes to 0xff in the LEFT =
   the LEFT = RIGHT values. Figure 5 shows the results when                                                   RIGHT input to Figure 3b’s sender on our i7-9700 CPU. The
   the HW grows from 0 to 64, both when the 1s start from the                                                 effect varies depending on the position of 1s within the inputs.
   least significant bit (LSB) and when they start from the most                                              HW differences in the MSBs have the strongest effect; HW
   significant bit (MSB). In both cases, the power consumption                                                differences in the bits right below 32 have the weakest effect.
   grows and the frequency drops when the HW grows.

                  2. A larger number of leading or trailing 1s in the data                                   vary the HW within each byte. Increasing the HW within
                  values being processed contributes to larger power con-                                    each byte allows us to measure the impact of different num-
                  sumptions and lower steady-state frequencies.                                              bers of non-consecutive 1s. For example, when the HW for
                                                                                                             each byte is 2, we set 2 bits of each byte to 1, for a total HW
      We also see that the changes in power consumption and                                                  of 2 × 8 = 16. Figure 6 shows the results, clearly indicating
   frequency appear to be nonlinear. That is, the plots of Figure 5                                          that a larger number of non-consecutive 1s contributes to a
   have a “bow” shape, suggesting that the HW effect is stronger                                             larger power consumption and lower CPU frequency.
   for the most significant 32 bits than for the least significant 32                                                       3. A larger Hamming weight (number of 1s) in the data
   bits. For example, when the input is 0xffffffff00000000                                                                  values being processed contributes to larger power con-
   (HW=32, orange line), the HW effect is larger than when it                                                               sumptions and lower steady-state frequencies regardless
   is 0x00000000ffffffff (HW=32, blue line). This suggests                                                                  of whether the 1s are consecutive or not.
   that given data values with the same HW, their contribution
   power / frequency may also depend on the position of 1s. We
   thoroughly examine this observation later in this subsection.                                             Non-uniformity of the HW Effect To analyze the impact
                                                                                                             of the position of 1s within the data, we run another variant
   Non-consecutive 1s The above experiment shows that                                                        of our previous experiment. We break the 64-bit registers
   power consumption and frequency can depend on the HW of                                                   LEFT = RIGHT into 8 bytes. Each byte can be set to 0x00 (all
   the data being processed. However, it only focuses on a bit                                               0s) or 0xff (all 1s). When we target byte i, we fix the value of
   pattern of consecutive 1s and 0s. In reality, 1s and 0s might                                             the other 7 bytes and compute the delta of power consumption
   occur in anywhere in the data. For our model to be useful, we                                             / frequency between setting byte i to 0xff and 0x00. For each
   need to test if the HW effect applies to arbitrary bit patterns.                                          byte, we repeat this test with all the 27 combinations of the
     To analyze the HW effect in the presence of non-                                                        other 7 bytes. We compute the average and standard deviation
   consecutive 1s, we run a variant of our previous experiment,                                              of the deltas for each byte and show the result in Figure 7.
   where we increase the HW at byte granularity. That is, we                                                     We immediately see that the HW effect is non-uniform
   break the 64-bit registers LEFT = RIGHT into 8 bytes and                                                  across different bytes. At a high level, the 4 most significant



    684                  31st USENIX Security Symposium                                                                                                                               USENIX Association
bytes have a stronger HW effect than the 4 least significant                                    4.04                        A               31.0
                                                                                                                            B




                                                                              Frequency (GHz)
bytes, and bytes closer to the 32nd bit have a weaker HW                                                                    C
                                                                                                                                            30.5
                                                                                                4.02




                                                                                                                                Power (W)
                                                                                                                            D
effect than bytes farther from the 32nd bit. This is consis-                                                                                30.0
tent with our previous observation that an input where the                                      4.00                                                                    A
                                                                                                                                                                        B
                                                                                                                                            29.5                        C
most significant 32 bits are 1 consumes more power than an                                      3.98                                                                    D
input where the least significant 32 bits are 1, even if their                                         0    20       40    60                      0    20       40    60
HWs are the same. Further, the standard deviations are rel-                                                 HW of SECOND                                HW of SECOND
atively small, suggesting that the HW effect of each byte                                          (a) Frequency vs HW                             (b) Power vs HW
is independent of the values of other bytes. For example,
the power/frequency deltas between 0x0000ff0000000000                            Figure 8: Effect of increasing the HW of SECOND in Fig-
and 0x000000000000000 are the same as the ones between                           ure 3c’s sender, while fixing FIRST to different values on our
0xff00ffff00ffffff and 0xff0000ff00ffffff. We sus-                               i7-9700 CPU. Power consumption grows and steady-state
pect that these properties also hold a bit granularity, but are                  frequency drops when both HW and HD increase at the same
unable to confirm because it would require collecting data for                   time (net effect of HW + HD). However, power consumption
264 bit combinations for a runtime of more than 1013 years.                      drops and steady-state frequency grows when HW increments
Note that the difference in the HW effect due to the position                    correspond to HD decrements (net effect of HW − HD).
of 1s is relatively small (e.g., ≤ 0.12 W in Figure 7b) com-
pared to the difference in the HW effect due to the number of
1s (e.g., ≤ 1.11 W in Figures 5b and 6b) and the HD effect                       4.3                   Additivity of the HW and HD Effects
due to bit transitions (e.g., ≤ 0.75 W in Figure 4b).                            Finally, we set out to understand if the HD and HW effects are
                                                                                 additive. To this end, we design our sender to use or instruc-
  4. The HW effect is non-uniform. 1s in the most signifi-                       tions with interleaved operand contents, as shown in Figure 3c.
  cant bytes affect power and frequency more than 1s in                          In this sender, half of the instructions computes FIRST|FIRST
  the least significant bytes. Additionally, the HW effect                       and the other half computes SECOND|SECOND. We in-
  at each byte is independent of the values of other bytes.                      terleave these instructions in groups of four, since on
                                                                                 our CPUs or instructions use four ports [1]. We then
   The above experiments show that power consumption and                         test setting FIRST to be A = 0x000000000000ffff, B =
frequency depend both on the number and the positions of                         0xffff000000000000, C = 0x00000000ffffffff, or D =
1s in the data being processed. However, both experiments                        0xffffffff00000000, and increase the HW of SECOND
were designed using LEFT = RIGHT, meaning that all the                           from 0 to 64, starting from the least significant bit.
source and destination registers used by the sender during                          Figure 8 shows the results. Consider the case when FIRST
an experiment were the same. It is then natural to ask: does                     = C. As the HW of SECOND increases from 0 to 32, the HD
the HW effect occur even when LEFT 6= RIGHT? To answer                           between FIRST and SECOND decreases, causing the power
this question, we repeated the above two experiments, but                        consumption to drop and the frequency to grow. However, as
this time set LEFT = 0 and only varied the HW of RIGHT.5                         HW of SECOND increases from 32 to 64, the HD between
Both experiments yielded results similar to the ones where                       FIRST and SECOND increases, causing the opposite effect.
LEFT = RIGHT, albeit with smaller increments/decrements in                       The slope between 0 and 32 is smaller than the one between
power/frequency. This result shows that the HW effect on an                      32 and 64. This is because the former is a net effect of HW
operand is independent of the contents of other operands.                        minus HD whereas the latter is a net effect of HD plus HW.
                                                                                 For the other values of FIRST, we see analogous effects but
  5. The HW effect occurs on each operand independently.                         with different constant offsets. This result (consistent across
                                                                                 the CPUs of Table 1) shows that the HW and the HD effects
   To sum up, the HW effect may be approximated as a linear                      can simultaneously contribute to power and frequency.
combination of two vectors. The first vector is the number of
                                                                                                6. The HD and HW effects are additive and can simulta-
1s per byte, and the second vector is the non-uniform power
                                                                                                neously contribute to differences in power consumption
consumption / frequency “cost” of 1s in that byte (based on
                                                                                                and steady-state frequency.
the deltas of Figure 7). In Appendix A.1 we discuss additional
experiments in support of this model. We verified that this
model applies to all the CPUs of Table 1. However, the non-
uniform “costs” per byte of the HW effect can be different                       5                 Remote Timing Attack on SIKE
across CPU models. For example, in the 11th gen CPUs, the
HW effect is more uniform compared to Figure 7.                                  The previous sections have shown that carefully crafted in-
                                                                                 struction sequences can trigger data-dependent power con-
   5 Whether LEFT = 0 or LEFT = RIGHT, the result of the or is still RIGHT.      sumption and frequency differences. In this section, we show



USENIX Association                                                                                                  31st USENIX Security Symposium                     685
that the frequency side channel threat extends to in-the-wild          Taken together, our findings mean that the server’s secret
software. Specifically, we show how to use the frequency side       key can be recovered by an adaptive chosen-ciphertext attack,
channel, combined with novel cryptanalysis, for a full key          using execution time as a side channel. Having extracted the
recovery attack through remote timing on two production-            first i bits of m, the adversary repeatedly queries the server
ready, side-channel hardened implementations of Supersingu-         with ciphertexts that should cause decapsulation to get stuck
lar Isogeny Key Encapsulation (SIKE) [52], a post-quantum           in the (i + 1)st round. If the server responds faster than a
key encapsulation mechanism based on the Supersingular              baseline (established through profiling), the adversary con-
Isogeny Diffie-Hellman (SIDH) [53] key exchange protocol.           cludes that bit mi is the opposite of bit mi−1 ; otherwise bit
                                                                    mi is the same. The attacker then proceeds to the next bit. In
Attack Model We assume a chosen-ciphertext attack model
                                                                    Section 5.2, we show that the timing signal is so robust that
(CCA). The goal of the attacker (client) is to recover the
                                                                    key extraction is possible across a network. We demonstrate
static secret key used by the victim (server) to decapsulate
                                                                    full recovery of the (378-bit) private key from the SIKE-751
ciphertexts. The attacker can send many ciphertexts to the
                                                                    implementations in two popular, production-ready crypto-
victim, which always tries to compute the shared secret with
                                                                    graphic libraries: Cloudflare’s Interoperable Reusable Crypto-
the decapsulation procedure using its static secret key.
                                                                    graphic Library (CIRCL) [28], written in Go, and Microsoft’s
Attack Idea The server’s static secret key is an integer m          PQCrypto-SIDH [66], written in C. Both of libraries are hard-
with bit expansion m = (m`−1 , . . . , m0 )2 , where ` = 378 (for   ened against previously known software side channels and
SIKE-751, the parameter selection we target in our experi-          meant to run in constant time. Our attack is practical; an un-
ments). During decapsulation, the server computes P + [m]Q          optimized version recovers the full key from a CIRCL server
for elliptic curve points P and Q included in the ciphertext;       in 36 hours and from a PQCrypto-SIDH server in 89 hours.
the SIKE standard prescribes a particularly efficient algorithm
for evaluating this expression, the Montgomery three-point          5.1   P-State and SIKE implementation
ladder [29]. We show that an attacker who knows the i least
significant bits of m can construct points P and Q such that:       We start by verifying that a correct key-bit guess in our chosen-
                                                                    ciphertext attack—one that causes the Montgomery ladder
 • If mi 6= mi−1 , then the (i + 1)st round of the Montgomery
                                                                    and the remainder of SIKE decapsulation to repeatedly pro-
   three-point ladder produces an anomalous 0 value. Once
                                                                    duce 0 values—causes the processor to execute at a higher
   that anomalous 0 value appears, the decapsulation algo-
                                                                    frequency than an incorrect key-bit guess does. Our local ex-
   rithm gets stuck: every intermediate value produced for the
                                                                    periment uses 10 randomly generated SIKE-751 server keys.
   remainder of the ladder is 0. Additionally, every intermedi-
                                                                    For each key m = (m`−1 , . . . , m0 )2 , we target 4 out of the 378
   ate value produced for the function (isogeny computation)
                                                                    bit positions. We choose the target bit positions uniformly at
   following the ladder is also 0.
                                                                    random, to validate that the frequency difference is observable
 • If, however, mi = mi−1 , or if the attacker was wrong about      even for bits accessed late in the Montgomery ladder loop.
   the i least significant bits of m when constructing the chal-       Suppose we target bit i in a secret key m. Provided that
   lenge ciphertext, then the (i + 1)st round generates a non-0     mi 6= mi−1 , we can craft a challenge ciphertext that will trigger
   value. Heuristically, the remainder of the computation pro-      an anomalous 0 value in the Montgomery ladder iteration that
   ceeds without producing an anomalous 0 value except with         accesses bit i. However, if mi = mi−1 , then there is no chal-
   negligible probability.                                          lenge ciphertext that can trigger the anomalous 0 value. To
This observation is new, and it represents a core contribution      make sure we are measuring the effect of anomalous 0 values,
of our work. Because SIKE is built on somewhat abstruse             and not some other unknown effect, we set up our experiment
math, we defer the details of how to construct points P and Q       as follows. For each key m and each target bit index i, we
that trigger an anomalous 0 value, and why a 0 value causes         create a variant key m0 that agrees with m at every bit posi-
the decapsulation algorithm to get stuck, to Section 5.3.           tion except index i, where it has the opposite bit value.6 In
   The values operated on by SIKE decapsulation are large           other words, m0 = m`−1 , . . . , mi+1 , (1 − mi ), mi−1 , . . . , m0 2 .
(a single element of the field underlying SIKE-751 takes            A challenge ciphertext crafted as described in Section 5.3.2
188 bytes to express) and the operations themselves are com-        will induce an anomalous 0 against exactly one of m and m0 .
plex: the inner loop of the Montgomery ladder comprises                For each key, m or m0 , and for each target bit position i,
thousands of lines of hand-optimized assembly. Nevertheless,        we launch a multithreaded SIKE decapsulation server. The
in Section 5.1, we show that SIKE decapsulation behaves             server spawns 300 concurrent goroutines (CIRCL) or pthreads
like the much simpler, synthetic senders of Section 4. When         (PQCrypto-SIDH). Each thread handles a single decapsula-
mi 6= mi−1 and the decapsulation algorithm gets stuck, repeat-      tion and then exits; when all threads have joined, we relaunch
edly producing and operating on 0 values, the processor con-        the server. We allow execution to continue until 800 seconds
sumes less power and runs at a higher steady-state frequency           6 Every integer between 0 and 2378 − 1 is a valid SIKE-751 server private

(and therefore decapsulation takes a shorter wall time).            key. Given a private key we can compute the corresponding public key.




686   31st USENIX Security Symposium                                                                                 USENIX Association
                                                   mi = mi 1                         1.00                      mi = mi 1      We configure a SIKE target server with a randomly gen-
                      0.8                          mi mi 1                                                     mi mi 1
                                                                                                                           erated static 378-bit key for SIKE-7517 , revealed for com-
                                                                                     0.75
Probability




                                                               Probability
                      0.6                                                                                                  parison only after the attack completes. Our server accepts a
                                                                                     0.50
                      0.4                                                                                                  client decapsulation request over HTTP (Go) or TCP (C) and
                      0.2                                                            0.25
                                                                                                                           spawns a goroutine (Go) or pthread (C) to handle the request.
                      0.0                                                            0.00
                              3.8         3.9       4.0                                       3.6             3.7          The thread reads in the ciphertext and performs the decapsula-
                                    Frequency (GHz)                                             Frequency (GHz)            tion computation, after which it sends a message back to the
                                                   mi = mi 1                         0.3                       mi = mi 1   client indicating the establishment of a shared secret but no
Probability density




                                                               Probability density
                                                   mi mi 1                                                     mi mi 1
                      0.2                                                                                                  other information. The target server and the attacker are both
                                                                                     0.2
                                                                                                                           connected to the same network, and we measure an average
                      0.1                                                            0.1                                   round-trip time of 688 µs between the two machines.
                                                                                                                              The attacker simultaneously sends n requests with a chal-
                      0.0                                                            0.0
                            30          35       40                                             40          45             lenge ciphertext meant to trigger an anomalous 0 and mea-
                                 Power consumption (W)                                      Power consumption (W)
                                                                                                                           sures the time t it takes to receive responses for all n re-
                             (a) CIRCL data                                           (b) PQCrypto-SIDH data               quests. When an anomalous 0 is triggered, power decreases,
                                                                                                                           frequency increases, SIKE decapsulation executes faster, and t
     Figure 9: Distribution of the power consumption and the fre-                                                          should be smaller. Based on the observed t and the previously
     quency when the challenge ciphertext introduces an anoma-                                                             recovered secret key bits, the attacker can infer the value of
     lous 0 (mi 6= mi−1 ) or not (mi = mi−1 ), using the setups from                                                       the target bit, then repeat the attack for the next bit.
     Section 4 on our i7-9700 CPU. The results are over 10 ran-                                                               For the attack to be successful, we must overcome a number
     domly generated keys, where, for each key, we target 4 out of                                                         of practical difficulties. First, we must set a value for n, the
     the 378 bit positions. For each key and each bit, we launch the                                                       number of requests, that allows us to observe a clear timing
     server with 300 goroutines (CIRCL) or pthreads (PQCrypto-                                                             signal when we trigger the anomalous 0s. We experimentally
     SIDH), each of which handles a single decapsulation request.                                                          find an n big enough that the frequency increase is remotely
                                                                                                                           observable, but not so big that we induce thrashing.
                                                                                                                              Second, we must set a time cutoff to distinguish when
    have elapsed. As in Section 4, we run each experiment in
                                                                                                                           anomalous 0s are triggered and when they are not. To this
    two setups. In the first setup, we use the default system con-
                                                                                                                           end, we collect the decapsulation times when querying the
    figuration, and monitor the steady-state CPU frequency. In
                                                                                                                           server with a random ciphertext, and use these times to set
    the second setup, we disable SpeedStep/HWP (this way, our
                                                                                                                           a cutoff for queries not triggering anomalous 0s. We then
    CPU stays at the base frequency during the experiment) and
                                                                                                                           query the server with the challenge ciphertexts for the first
    monitor (core domain) power consumption. We sample both
                                                                                                                           few bits of the key until we see a speedup compared to the
    the CPU frequency and the power consumption every 1 ms.
                                                                                                                           random ciphertext, and use these times to set a cutoff for
       We group the measured data points according to whether
                                                                                                                           queries triggering anomalous 0s.
    we expect the challenge ciphertext to induce an anomalous 0
    or not. For each key m and target bit position i, exactly one of                                                          Third, we must detect and recover from mistakes caused
    m and m0 contributes to the anomalous-0 grouping.                                                                      by random variations in the server’s decapsulation time. Re-
                                                                                                                           call that a challenge ciphertext constructed using a wrong
       The results, shown in Figures 9a and 9b, confirm that
                                                                                                                           value for the i least significant bits of m will never trigger
    the steady-state frequency is higher and the power consump-
                                                                                                                           anomalous 0s regardless of the relationship of mi and mi−1 .
    tion is lower when an anomalous 0 is triggered (mi 6= mi−1 )
                                                                                                                           Measuring no timing reduction in many consecutive rounds
    than when it is not (mi = mi−1 ), for both the CIRCL and
                                                                                                                           is evidence either that many consecutive key bits all have
    the PQCrypto-SIDH decapsulation servers. As noted above,
                                                                                                                           the same value (unlikely since key bits are independent and
    both these libraries are hardened against previously known
                                                                                                                           uniformly distributed), or that the value we are using for the
    software side channels and meant to run in constant time.
                                                                                                                           least significant bits of the key is wrong (cf. Appendix A.4).
       The signal we obtain from PQCrypto-SIDH is fainter than
                                                                                                                           In our experiments, we backtrack when experiments for 40
    the one we obtain from CIRCL, because PQCrypto-SIDH
                                                                                                                           consecutive bit positions show no timing reduction.
    uses a different strategy for Montgomery reduction that causes
    the value 0 to be represented in memory sometimes as 0 and                                                                Finally, there is a chance that a challenge ciphertext con-
    sometimes as a prime number of size 751 bits.                                                                          structed as in Section 5.3.2 will accidentally trigger an anoma-
                                                                                                                           lous 0 later in the decapsulation process even if it does not at
                                                                                                                           the target bit index i of the Montgomery ladder. This will hap-
     5.2                    SIKE Key Remote Recovery
                                                                                                                               7 The SIKE standard and the implementations we examined place the
    We now show that the secret-dependent power consumption                                                                long-term keypair in the 3-torsion and the ephemeral key used for forming
    and frequency differences observed in Section 5.1 translate to                                                         a ciphertext in the 2-torsion, so this is the case we studied. A variant of our
    a remotely observable secret-dependent timing difference.                                                              attack applies also if the roles are swapped.




     USENIX Association                                                                                                                             31st USENIX Security Symposium                   687
                      0.15
                                              mi = mi 1                                             mi = mi 1               663                                                    663
Probability density




                                                          Probability density
                                              mi mi 1                           0.10                mi mi 1
                                                                                                                            662




                                                                                                                Time (ms)




                                                                                                                                                                       Time (ms)
                      0.10                                                                                                                                 mi mi 1                 662                         mi mi 1
                                                                                                                            661                            mi = mi 1                                           mi = mi 1
                                                                                0.05                                                                                               661
                      0.05
                                                                                                                            660                                                    660
                      0.00                                                      0.00
                             650   660       670                                       1550 1560 1570 1580                         0    3      6 9 12 15 18                              345 348 351 354 357 360 363
                                   Time (ms)                                                Time (ms)                                       Secret key bit index                               Secret key bit index
                         (a) CIRCL histogram                      (b) PQCrypto-SIDH histogram                                 (a) CIRCL first 20 bits                                (b) CIRCL last 20 bits

     Figure 10: Distribution of the timings measured by the at-                                                   Figure 11: Median times used to extract the first 20 bits (0
     tacker during the remote key extraction attack, with the server                                              to 19) and the last 20 bits (345 to 364) of the key for the
     running on an i7-9700 CPU. The attacker makes 300 (CIRCL)                                                    same attack against CIRCL SIKE-751 as in Figure 10a. The
     and 1000 (PQCrypto-SIDH) connections (all with the same                                                      timings depend on whether the challenge ciphertext triggered
     challenge ciphertext, constructed as per Section 5.3.2) and                                                  an anomalous 0 (mi 6= mi−1 ) or not (mi = mi−1 ).
     measures the time until the last connection completes. We
     group the execution time (filtered) of each key bit extraction                                                         1560                                                              mi mi 1
                                                                                                                                                                                              mi = mi 1
     based on whether it should have triggered an anomalous 0 in
                                                                                                                            1558                                                   1558




                                                                                                                Time (ms)




                                                                                                                                                                       Time (ms)
     the Montgomery ladder (i.e., whether mi = 1 − mi−1 or not).                                                                                           mi mi 1
                                                                                                                                                           mi = mi 1
                                                                                                                            1556                                                   1556
                                                                                                                            1554
     pen with exponentially small probability for most bit indices,                                                                 0   3 6 9 12 15 18                                    345 348 351 354 357 360 363
     but larger probability for the last few bit indices. We defer                                                                       Secret key bit index                                   Secret key bit index
     a detailed explanation to Appendix A.3. It may be possible                                                   (a) PQCrypto-SIDH first 20 bits                        (b) PQCrypto-SIDH last 20 bits
     to avoid triggering this misbehavior with a different way of
     constructing the challenge key. We instead sidestep it by stop-                                             Figure 12: Median times used to extract the first 20 bits (0 to
     ping our interaction with the server after extracting all but the                                           19) and the last 20 bits (345 to 364) of the key for the same
     last 14 bits; we recover these last bits by brute-force search.                                             attack against PQCrypto-SIDH SIKE-751 as in Figure 10b.
                                                                                                                 The timings depend on whether the challenge ciphertext trig-
    Attack Setup We run the SIKE target server on our i7-9700                                                    gered an anomalous 0 (mi 6= mi−1 ) or not (mi = mi−1 ).
    CPU using the default system configuration. In the attack
    on CIRCL, the server is an HTTP server written using Go’s
    net.http library, which handles each request in a goroutine.                                                  cording to whether the challenge ciphertext of that run trig-
    In the attack on PQCrypto-SIDH, the server is a TCP server                                                    gered an anomalous 0 (mi 6= mi−1 ) or not (mi = mi−1 ).
    written in C, which handles each request in a pthread.                                                           For the first and the last 20 bit positions of the key that we
       We configure the attacker to send n = 300 concurrent re-                                                   extract by interacting with the server (bits 0–19 and 345–364,
    quests in the CIRCL case, and n = 1000 requests in the                                                        respectively), we plot, in Figure 11 (CIRCL) and Figure 12
    PQCrypto-SIDH case. In both cases, concurrent requests are                                                    (PQCrypto-SIDH), the median time among the 400 measure-
    sent all with the same challenge ciphertext (constructed as                                                   ments for that bit and whether the run triggered an anoma-
    described in Section 5.3.2), and the attacker measures the                                                    lous 0 (mi 6= mi−1 ) or not (mi = mi−1 ) at that bit position. The
    time until the last connection completes. We experimentally                                                   signal is strong for both the top bits and the bottom bits.
    determine the expected timings when the CPU frequency in-                                                        Both attacks successfully recovered the full secret key. The
    creases because of anomalous 0s and when it does not: for                                                     attack on CIRCL completed in 36 hours, while the attack on
    CIRCL, at most 660.2 ms and at least 662.5 ms, respectively;                                                  PQCrypto-SIDH completed in 89 hours. We expect that the at-
    for PQCrypto-SIDH at most 1556 ms and at least 1558 ms,                                                       tack running time could be reduced with careful optimization.
    respectively. We repeat the measurement 400 times, exclude                                                    Unlike our attack on CIRCL, our attack on PQCrypto-SIDH
    outliers (CIRCL: below 650 ms or above 675 ms; PQCrypto-                                                      made 1 mistake and needed to backtrack; see Appendix A.4
    SIDH: below 1500 ms or above 1580 ms), compute the me-                                                        for our error correction strategy.
    dian of the remaining values, and compare to the cutoffs. If
    the result is inconclusive for a bit, we repeat the attack on that                                            5.3              Anomalous 0s in SIKE Decapsulation
    bit. We use our side channel to extract the key up to bit 364
    and recover the last 14 bits by brute force search.                                                           We now explain how an attacker can construct SIKE cipher-
                                                                                                                  texts that trigger an anomalous 0 in the (i + 1)st iteration
     Results In Figure 10a and Figure 10b, we show the timing                                                     of the Montgomery ladder when mi 6= mi−1 , and why that
     distribution of the 300-connection runs (CIRCL) and 1000-                                                    anomalous 0, once generated, causes the remainder of the
     connection runs (PQCrypto-SIDH) respectively, grouped ac-                                                    decapsulation algorithm to also produce 0s repeatedly.



     688                     31st USENIX Security Symposium                                                                                                                                 USENIX Association
   We briefly recall some relevant mathematical background           Algorithm 1: Three point ladder ( [52], Appendix A)
in Appendix A.2. We recommend that readers review a longer
                                                                    1 function Ladder3pt
introduction to the math behind elliptic curves, isogenies, and
                                                                          Input: m = (m`−1 , . . . , m0 )2 ∈ Z, (xP , xQ , xQ−P ),
SIKE; Costello’s tutorial expositions of elliptic curves [18]
                                                                                  and (A : 1)
and isogenies [19] are especially good choices.                                                             
                                                                          Output: XP+[m]Q : ZP+[m]Q
   The first subroutine in the SIKE decapsulation algorithm                                              
recovers (the Montgomery coefficient A of) the curve E00 on         1 (X0 : Z0 ), (X1 : Z1 ), (X2 : Z2 ) ← (xQ : 1), (xP :
                                                                                       
which the points P, Q, and Q − P, included in the ciphertext           1), (xQ−P : 1)
                                                                       +
provided by the attacker, lie. This subroutine is fast and inde-    2 a24 ← (A + 2)/4
pendent of the secret key; we do not consider it further.           3 for i = 0 to ` − 1 do
   The second subroutine uses the Montgomery three-point            4     if mi = 1 then              
ladder to compute P + [m]Q on the curve E00 recovered by            5           (X0 : Z0 ), (X1 : Z1 ) ← xDBLADD(X0 :
the first subroutine. This is the subroutine in which a correct                 Z0 ), (X1 : Z1 ), (X2 : Z2 ), (a+
                                                                                                                24 : 1)
key-bit guess (mi 6= mi−1 ) can trigger the generation of an        6     else                        
anomalous 0 value. We explain how in Section 5.3.2.                 7           (X0 : Z0 ), (X2 : Z2 ) ← xDBLADD(X0 :
   The third subroutine evaluates the isogeny corresponding                     Z0 ), (X2 : Z2 ), (X1 : Z1 ), (a+
                                                                                                                24 : 1)
to the point P + [m]Q, computing (the Montgomery coeffi-
cient of) the curve Ee0 3 that is the image of E00 under that       8   return (X1 : Z1 )
isogeny. The fourth subroutine computes the j-invariant of the
curve Ee0 3 ; this j-invariant is the shared SIDH secret. In Sec-
tion 5.3.3 and Appendix A.3, we explain how an anomalous 0          both equal to 0 is a point of order 2 with special significance
value output by the Montgomery ladder causes the isogeny            to arithmetic on a Montgomery curve; it is denoted by T .
evaluation (third subroutine) and the j-invariant computation          To minimize the need for (expensive) modular inversions,
(fourth subroutine) to produce additional anomalous 0s.             implementations typically work using projective rather than
   The final step in SIKE decapsulation is a Fujisaki–Okamoto       affine x-coordinate representation. For a point P, we write
consistency check [31, 44] that checks that the ciphertext was      xP for its affine x-coordinate and (XP : ZP ) for its projective
properly generated. If the check fails, the recipient generates     x-coordinate representation, where xP = XP · ZP−1 . As usual,
a random session key instead of the one prescribed by the           there are many equivalent (X : Z) pairs that represent the same
(invalid) ciphertext. The Fujisaki–Okamoto check immunizes          affine point. We write (X : Z) ∼ (X 0 : Z 0 ) to mean that there
SIKE against attacks, such as that due to Galbraith et al. [32],    exists a scaling factor r such that X = rX 0 and Z = rZ 0 .
that require partial information about the j-invariant computed        The point T is represented as (0 : 1) when using projective
when decapsulating (invalid) ciphertexts.                           x-coordinates; the point at infinity, O , as (1 : 0). The projective
   We do not claim to invalidate SIKE’s proof of security.          pair (0 : 0) is not considered the valid projective x-coordinate
None of the ciphertexts we construct in our attack passes the       representation of any point. This is important to our attack.
Fujisaki–Okamoto check. Nevertheless, our attack recovers
the server’s secret key, because we obtain the information          5.3.2     Anomalous 0s in the Montgomery Ladder
we need from the running time of the subroutines performed
before the Fujisaki–Okamoto check.                                  The Montgomery three-point ladder is implemented using
   While our paper was under embargo (cf. Section 1), our           Ladder3pt shown in Algorithm 1, reproduced from the SIKE
chosen-ciphertext attack triggering anomalous 0s in SIKE            specification [52]. The inputs are an integer m, curve points
decapsulation, described in this subsection, was independently      P, Q, and Q − P (in affine x-coordinate representation), and
rediscovered by De Feo et al. [25].                                 the curve parameter A. The output is the point P + [m]Q (in
                                                                    projective x-coordinate representation).
                                                                       The subroutine invoked inside the loop, xDBLADD, when
5.3.1   Affine and Projective X-Coordinate Point Repre-             applied to points U, V , and U −V , returns a tuple consisting
        sentations on Montgomery Curves                             of [2]U and U +V . As the names suggest, invoking xDBLADD
A Montgomery curve is defined by the equation EA,B : By2 =          is equivalent to invoking xDBL to compute [2]U and xADD to
x3 + Ax2 + x, with parameters A, B ∈ Fp2 such that B(A2 −           compute U +V , but the combined algorithm evaluates some
4) 6= 0. Montgomery curves have properties that make them           repeated subexpressions just once.
suitable for efficient, side-channel resistant implementations.        The points P, Q, and Q − P, as well as the curve parameter
In particular, many operations needed in cryptography can           A, are supplied by the attacker, whereas the integer m is the
be computed using just the x-coordinate of a point (ignoring        secret key. The goal of the attacker is to leak m.8
the y-coordinate) and just the curve parameter A (ignoring              8 As written, algorithm Ladder3pt is not constant time, but the branch in

the curve parameter B). The point with x- and y-coordinate          line 4 is implemented in practice using constant-time conditional swaps.




USENIX Association                                                                           31st USENIX Security Symposium                 689
   Consider the algorithm xADD that, given points U, V , and W                 Then, at iteration k of the Ladder3pt loop, we will have (X2 :
in projective x-coordinate form where W = U −V , computes                      Z2 ) ∼ T . If mk = 1, T will be passed as the third argument
the point U +V in projective x-coordinate form, as:                            to xDBLADD, triggering the misbehavior as described above.
                                                  2                             If mk−1 = 1, the attacker instead sets
 X ← ZW (XU − ZU )(XV + ZV ) + (XU + ZU )(XV − ZV )                                                             
                                                   2                                                P ← T − 𝜇k Q .                     (2)
 Z ← XW (XU − ZU )(XV + ZV ) − (XU + ZU )(XV − ZV ) .
                                                                               Then, at iteration k of the Ladder3pt loop, we will have (X1 :
   When U −V is any point except O or T , xADD(U,V,U −V )                      Z1 ) ∼ T . If mk = 0, T will be passed as the third argument
correctly returns U + V . However, when U − V is O or T ,                      to xDBLADD, triggering the misbehavior.
xADD(U,V,U −V ) misbehaves and returns the invalid projec-                        To summarize, if mk 6= mk−1 , the crafted input ciphertext
tive representation (0 : 0) instead of U +V [21].9                             will trigger the anomalous 0 misbehavior.
   Worse, xADD(U,V,W ) will also return (0 : 0) if called with                    When generated according to the SIKE specification, P
any of U, V , or W equal to (0 : 0), regardless of the value                   and Q are always linearly independent points of order 3e3 and
of the other two inputs.10 Repeated applications of xADD can                   never produce T or O during the execution of Ladder3pt.
thus get stuck at (0 : 0). We use exactly this fact for our attack.            When generated according to our algorithm above but with
   Suppose that we can arrange that, at the beginning of iter-                 an incorrect key-bit guess, we expect that T or O will be
ation k in Ladder3pt, (X2 : Z2 ) ∼ T , i.e., that X2 = 0 and Z2                produced only with negligible probability.11 This conjecture
is nonzero. There are 2 cases to consider:                                     is supported by our experiments.
 • if mk = 1, then T will be passed into the third argument of
   xDBLADD, triggering the misbehavior in xADD and causing                     5.3.3     Anomalous 0s in Isogeny Evaluation and j-
   (X1 : Z1 ) to be set to (0 : 0).                                                      Invariant Calculation

 • otherwise, if mk = 0, then T will instead be passed into                    The next task in SIKE decapsulation, isogeny evaluation, is
   the second argument of xDBLADD. This will not trigger                       carried out by algorithm 3_e_iso, which takes as input the
   the misbehavior in xADD and not produce (0 : 0) as an                       point P + [m]Q (in projective x-coordinate form) as output
   output. The point (X2 : Z2 ), which was equal to T , will be                by Ladder3pt, expecting it to be a point of exact order 3e3 .
   overwritten with whatever xADD returns.                                     In Appendix A.3, we show that, when invoked on the invalid
                                                                               input (0 : 0), 3_e_iso and its subroutines repeatedly operate
In the first case, xADD will get stuck; the second element                     on and produce 0 values. Isogeny evaluation in 3_e_iso thus
of the tuple returned by xDBLADD will be (0 : 0) in every                      acts as an amplifier for the signal produced by the ladder
subsequent iteration of Ladder3pt’s loop, and Ladder3pt                        evaluation in Ladder3pt, making it possible to observe even
will eventually return (0 : 0). In the second case, it is likely               an anomalous 0 produced in a late Ladder3pt loop iteration.
that 0 values will not recur during the ladder computation.                       After isogeny evaluation, the next task in SIKE decapsula-
   It remains to show how the attacker can arrange for (X2 : Z2 )              tion is j-invariant calculation, using algorithm jInvariant.
to equal T at loop iteration k. Let 𝜇i = (mi−1 , . . . , m0 )2 rep-            When 3_e_iso returns (0 : 0), jInvariant is invoked with
resent the least significant i bits of m. Algorithm Ladder3pt                  input (0 : 0), every intermediate value it computes is 0, and
maintains the invariant that, at the beginning of iteration i of               its return value (the SIDH shared secret) is 0.12
the loop, the points (X0 : Z0 ), (X1 : Z1 ), and (X2 : Z2 ) satisfy
                                                                               5.4     Mitigations
                (X0 : Z0 ) ∼ [2i ]Q
                                                                               We now describe the mitigation that Cloudflare and Microsoft
                (X1 : Z1 ) ∼ P + [𝜇i ]Q                                        deployed after we disclosed our attack on SIKE.
                (X2 : Z2 ) ∼ (X0 : Z0 ) − (X1 : Z1 ) .                            The mitigation, which was originally proposed by De Feo
                                                                               et al. [25], consists of validating that the ciphertext (public
Suppose that that the attacker, proceeding bit-by-bit, has ex-                 key) consists of a pair of linearly independent points of the
tracted 𝜇k . The attacker picks an arbitrary curve and sets Q to               correct order 3e3 . This check is performed before running the
be an arbitrary point on the curve.                                            three-point ladder and prevents attack ciphertexts from being
   If mk−1 = 0, the attacker sets                                              further processed, thus hindering the attack. When running
                                                                               decapsulation on a single thread on our i7-9700 CPU, we
                     P ← 2k − 𝜇 k Q − T .
                                  
                                                             (1)
                                                                                  11 This fact allows us not only to distinguish a correct from an incorrect bit
   9 If U − V = O then U = V       and therefore (XU : ZU ) ∼ (XV : ZV ). If   guess for bit mk but also to detect and recover from mistakes in determining
U − V = T then U = 𝜏T (V ) where 𝜏T is the translation-by-T map; by a          the earlier bits 𝜇k ; see Appendix A.4.
property of Montgomery curves, it follows that (XU : ZU ) ∼ (ZV : XV ).           12 Note that this output depends on the result of inverting 0 in F in step 15
                                                                                                                                                    p2
  10 In this case it does not matter — indeed, does not make sense to ask —    of jInvariant. The Montgomery inversion algorithms in the implementa-
whether W = U −V .                                                             tions we examined have 1/0 = 0 (see Savas and Koç [83]).




690    31st USENIX Security Symposium                                                                                               USENIX Association
found that the mitigation adds a performance overhead of 5%        with an error rate of 0.03% (average across 10 runs). This
for CIRCL and of 11% for PQCrypto-SIDH.                            bandwidth is similar to the one of prior covert channels relying
                                                                   on software-based power measurement interfaces [63, 64].
6   Timer-free Attacks
                                                                   7   Discussion
We now show that not only can we use the frequency side
channel to turn power attacks into remote timing attacks (as       Affected CPUs We successfully reproduced our attack on
we saw in Section 5), but we can also use it to mount timing       Intel CPUs from the 8th to the 11th generation of the Core
attacks without a timer. To this end, we use the frequency side    microarchitecture (reported in Table 1). We also tested two
channel to mount a KASLR break and a covert channel.               desktop CPUs from older generations, namely the i7-6700K
KASLR Break Like prior work [12,13,37,43,45,51,63,64],             (Skylake) and i7-7700K (Kaby Lake), and we found that both
the goal of the (unprivileged) attacker is to de-randomize the     models only support Turbo frequencies on single core work-
kernel base address. Knowledge of the kernel base address is       loads: as soon as more than 1 core is active, the P-state is
useful to mount memory corruption exploits.                        capped at the base frequency. In our experiments, we were
   In Linux, the kernel text is placed at a 2 MB boundary in the   not able to force the frequency into steady state (i.e., below the
0xffffffff80000000 – 0xffffffffc0000000 range [13].                max turbo frequency) with single-core workloads, and were
Hence, the kernel can be placed at one of 512 possible offsets.    therefore unable to reproduce our attack on these models.
Prior work has shown that, on Intel and AMD processors,               Besides CPUs from the (client-class) Core microarchitec-
there is a timing and power consumption difference when ex-        ture, our attack should also work on Intel Xeon CPUs (server-
ecuting prefetch instructions on a memory address depending        class) since they also use similar P-state management tech-
on whether that address is mapped or not [43, 63]. This dif-       niques. Additionally, other CPU vendors implement similar
ference can be used to infer the location of the kernel within     DVFS mechanisms and are likely vulnerable. For example,
its predefined region. We show that this power consumption         we verified that the AMD Ryzen processors are also vulnera-
difference manifests also as a CPU frequency difference.           ble to our attack, featuring a similar HW/HD leakage model
   To this end, we build a sender process similar to the ones      and enabling the same SIKE vulnerability that we described
of Figure 3, but using only prefetcht0 instructions. While         in Section 5. We leave reverse engineering the specific char-
the sender runs, a separate thread measures the current CPU        acteristics of the AMD leakage model to future work.
frequency using the unprivileged scaling_cur_freq inter-
face from the cpufreq driver. We ran the sender with all           Mitigating Leakage via the Frequency Channel Our at-
the 512 possible kernel base addresses, for 10 different ran-      tack is enabled by data-dependent frequency adjustments at
domizations (i.e., repeating across 10 reboots) on our Intel       steady state. As we showed, the affected CPUs enter this state
i7-9700 CPU. In all 10 cases, we were able to identify the         when certain power and thermal limits are hit during a work-
base address successfully (as verified by checking the privi-      load’s execution. Thus, one approach to mitigate the attack is
leged /proc/kallsyms interface). We measured an average            to reduce the likelihood that the CPU hits these limits. One
steady-state CPU frequency of 4.04 GHz when repeatedly             workload-independent way to do so is to either disable Turbo
prefetching mapped addresses, and 4.24 GHz when repeat-            Boost, or to disable SpeedStep and HWP from the BIOS. We
edly prefetching unmapped addresses. The runtime of our un-        verified that, with otherwise standard system configurations,
optimized, proof-of-concept implementation is of 2 minutes.        both methods cause the frequency to stay fixed at the base
This runtime is larger than state-of-the-art KASLR breaks,         frequency during workload execution and never enter steady
but could be reduced with additional engineering effort.           state, preventing leakage via the frequency side channel. How-
                                                                   ever, this approach significantly reduces system performance.
Covert Channel Like prior work, our covert channel uses            Moreover, this approach may not be sufficient on system con-
a sender and a receiver. To transmit a 0, the sender executes      figurations with custom power limits. Indeed, in concurrent
a loop of or instructions with high HD and HW in their data        work, Liu et al. show that a privileged adversary can extract
flow. This loop increases the power consumption and results        AES-NI keys using the frequency side channel after reducing
in lower CPU frequency values. To transmit a 1, the sender         the power limits to fractions of their default values [65].
executes a loop of shlx instructions with low HD and HW in
their data flow. This loop decreases the power consumption         Mitigating Leakage in Ciphers Another mitigation strat-
and results in higher CPU frequency values. The receiver           egy consists of removing secret-dependent leakage in crypto-
measures the current CPU frequency using the unprivileged          graphic software. For example, SIKE’s mitigation discussed
scaling_cur_freq interface from the cpufreq driver.                in Section 5.4 hinders our attack by preventing attack cipher-
   We evaluated our covert channel by transmitting 1 kB of         texts from triggering secret-dependent computations on 0s.
random data on our i7-9700 CPU. Our unoptimized, proof-               For cryptographic software in general, mitigating the power
of-concept implementation achieved a bandwidth of 30 bps           leakage itself would naturally close the frequency channel.



USENIX Association                                                                      31st USENIX Security Symposium          691
True decoupling would require that all operands have no sta-        Availability
tistical correlation with secrets, which is only feasible with
techniques like fully homomorphic encryption. A more realis-        We have open sourced the code of all the experiments of this
tic approach takes advantage of the fact that it is not the power   paper at https://github.com/FPSG-UIUC/hertzbleed.
usage of each operand that is leaked, but an average of the
power usage across all operands in a time period. This goal         References
may be achieved using masking/blinding techniques. Prior
                                                                     [1] Andreas Abel and Jan Reineke. uops.info: Characterizing latency,
works have introduced protocol-specific masking techniques               throughput, and port usage of instructions on Intel microarchitectures.
for ciphers such as AES [8,38,82,86] and blinding techniques             In ASPLOS, 2019.
for elliptic-curve cryptography [54]. Automatic masking tech-        [2] Andreas Abel and Jan Reineke. uiCA: Accurate throughput prediction
niques have also been proposed either in software [7, 17, 27]            of basic blocks on recent Intel microarchitectures. In ICS, 2022.
or leveraging additional hardware support [26, 33, 41, 42, 79].      [3] Ross Anderson. Security Engineering: A Guide to Building Dependable
However, masked/blinded implementations may still leak in                Distributed Systems, 3rd Edition. John Wiley & Sons, 2020.
practice via power side channels [4, 5, 34, 69, 81, 84, 85].         [4] Josep Balasch, Benedikt Gierlichs, Vincent Grosso, Oscar Reparaz, and
   Future defenses could also examine the potential of fus-              François-Xavier Standaert. On the cost of lazy engineering for masked
                                                                         software implementations. In CARDIS, 2014.
ing unrelated loops, vectorizing operations, or other meth-
                                                                     [5] Sven Bauer. Attacking exponent blinding in RSA without CRT. In
ods of interleaving different computations. These approaches             COSADE, 2012.
could be done by combining multiple, normally sequential,
                                                                     [6] Daniel J. Bernstein and Tanja Lange. Montgomery curves and the
computations in the program or by introducing an additional              Montgomery ladder. In Topics in Computational Number Theory
complementary kernel. Effective blinding will require that               Inspired by Peter L. Montgomery. Cambridge University Press, 2017.
the combined computation’s power trace is not related to any         [7] Alex Biryukov, Daniel Dinu, Yann Le Corre, and Aleksei Udovenko.
secret computation. For example, if we can construct a bit-              Optimal first-order boolean masking for embedded iot devices. In
inverted version of a cryptographic kernel, we can interleave            CARDIS, 2017.
the real kernel and the blinding kernel. Our model of HW and         [8] Johannes Blömer, Jorge Guajardo, and Volker Krummel. Provably
                                                                         secure masking of AES. In SAC, 2004.
HD provides a starting point for future work on blinding.
                                                                     [9] Eric Brier, Christophe Clavier, and Francis Olivier. Correlation power
                                                                         analysis with a leakage model. In CHES, 2004.
8     Conclusion                                                    [10] Len Brown. powercap: restrict energy meter to root access. https:
                                                                         //git.kernel.org/pub/scm/linux/kernel/git/torvalds/lin
                                                                         ux.git/commit/?id=949dd0104c496fa7c14991a23c03c62e4463
We discovered that in modern Intel (and AMD) x86 CPUs,                   7e71, 2020. Accessed on Jun 7, 2022.
DVFS-induced frequency variations depend on the current
                                                                    [11] Ileana Buhan, Lejla Batina, Yuval Yarom, and Patrick Schaumont. SoK:
power consumption, and hence on the data being processed.                Design tools for side-channel-aware implementions. In ASIACCS,
We showed, for the first time, that the HD and HW of data                2022.
individually and non-uniformly contribute to power consump-         [12] Claudio Canella, Daniel Genkin, Lukas Giner, Daniel Gruss, Moritz
tion and frequency on modern x86 CPUs. We described a                    Lipp, Marina Minkin, Daniel Moghimi, Frank Piessens, Michael
novel chosen-ciphertext attack against SIKE, which uses this             Schwarz, Berk Sunar, Jo Van Bulck, and Yuval Yarom. Fallout: Leaking
                                                                         data on Meltdown-resistant CPUs. In CCS, 2019.
knowledge to leak full cryptographic keys via remote timing.
                                                                    [13] Claudio Canella, Michael Schwarz, Martin Haubenwallner, Martin
   The security implications of our findings are significant.            Schwarzl, and Daniel Gruss. KASLR: Break it, fix it, repeat. In
Not only do they expand the attack surface of power side-                ASIACCS, 2020.
channel attacks by removing the need for power measurement          [14] Suresh Chari, Charanjit Jutla, Josyula R Rao, and Pankaj Rohatgi. A
interfaces, but they also show that, even when implemented               cautionary note regarding evaluation of AES candidates on smart-cards.
as constant time, cryptographic code can still leak via remote           In AES2, 1999.
timing analysis. The takeaway is that current cryptographic         [15] Yimin Chen, Xiaocong Jin, Jingchao Sun, Rui Zhang, and Yanchao
                                                                         Zhang. POWERFUL: Mobile app fingerprinting via power analysis.
engineering practices for how to write constant-time code are
                                                                         In INFOCOM, 2017.
no longer sufficient to guarantee constant time execution of
                                                                    [16] Jean-Sébastien Coron. Resistance against differential power analysis
software on modern, variable-frequency processors.                       for elliptic curve cryptosystems. In CHES, 1999.
                                                                    [17] Jean-Sébastien Coron, Johann Großschädl, Mehdi Tibouchi, and
                                                                         Praveen Kumar Vadnala. Conversion from arithmetic to boolean mask-
Acknowledgments                                                          ing with logarithmic complexity. In FSE, 2015.
                                                                    [18] Craig Costello. Pairings for beginners. Online: https://www.craigc
This work was funded in part through NSF grants 1942888                  ostello.com.au/s/PairingsForBeginners.pdf, 2012.
and 1954521, and gifts from Google, Mozilla, and Qualcomm.          [19] Craig Costello. Supersingular isogeny key exchange for beginners. In
Wang was partly supported by a Packard Fellowship (via                   SAC, 2019.
Brent Waters). We thank our shepherd Michael Schwarz and            [20] Craig Costello. The case for SIKE: A decade of the supersingular
the anonymous reviewers for their valuable feedback.                     isogeny problem. Cryptology ePrint Archive, Report 2021/543, 2021.




692    31st USENIX Security Symposium                                                                                USENIX Association
[21] Craig Costello and Benjamin Smith. Montgomery curves and their             [43] Daniel Gruss, Clémentine Maurice, Anders Fogh, Moritz Lipp, and
     arithmetic - the case of large characteristic fields. J. Cryptogr. Eng.,        Stefan Mangard. Prefetch side-channel attacks: Bypassing SMAP and
     8(3), 2018.                                                                     kernel ASLR. In CCS, 2016.
[22] Ian Cutress. Why Intel processors draw more power than expected:           [44] Dennis Hofheinz, Kathrin Hövelmanns, and Eike Kiltz. A modular
     TDP and Turbo explained. https://www.anandtech.com/show/1                       analysis of the Fujisaki-Okamoto transformation. In TCC, 2017.
     3544/why-intel-processors-draw-more-power-than-expec
                                                                                [45] Ralf Hund, Carsten Willems, and Thorsten Holz. Practical timing side
     ted-tdp-turbo, 2018. Accessed on Jun 7, 2022.
                                                                                     channel attacks against kernel space ASLR. In S&P, 2013.
[23] Luca De Feo. Mathematics of isogeny based cryptography. Preprint,
     arXiv:1711.04062 [cs.CR], 2017.                                            [46] Intel. Running average power limit energy reporting / cve-2020-8694 ,
                                                                                     cve-2020-8695 / intel-sa-00389. https://www.intel.com/conten
[24] Luca De Feo. Exploring isogeny graphs. Habilitation thesis, Université          t/www/us/en/developer/articles/technical/software-secu
     de Versailles Saint-Quentin-en-Yvelines, 2018.                                  rity-guidance/advisory-guidance/running-average-power-
[25] Luca De Feo, Nadia El Mrabet, Aymeric Genêt, Novak Kalud̄erović,               limit-energy-reporting.html. Accessed on Jun 7, 2021.
     Natacha Linard de Guertechin, Simon Pontié, and Élise Tasso. SIKE          [47] Intel. Thermal design power (TDP) in Intel processors. https://www.
     channels. Cryptology ePrint Archive, Report 2022/054, 2022.                     intel.com/content/www/us/en/support/articles/000055611
[26] Elke De Mulder, Samatha Gummalla, and Michael Hutter. Protecting                /processors.html. Accessed on Jun 7, 2022.
     RISC-V against side-channel attacks. In DAC. IEEE, 2019.                   [48] Intel. Intel 64 and IA-32 Architectures Optimization Reference Manual,
[27] Hassan Eldib and Chao Wang. Synthesis of masking countermeasures                June 2021.
     against side channel attacks. In CAV, 2014.                                [49] Intel. Intel 64 and IA-32 Architectures Software Developer’s Manual,
[28] Armando Faz-Hernández and Kris Kwiatkowski. Introducing CIRCL:                  June 2021.
     An Advanced Cryptographic Library. Cloudflare, 2019. https://gi
                                                                                [50] Intel. Power management - technology overview. https://builders
     thub.com/cloudflare/circl. Accessed on Jun 7, 2022.
                                                                                     .intel.com/docs/networkbuilders/power-management-techn
[29] Armando Faz-Hernández, Julio López, Eduardo Ochoa-Jiménez, and                  ology-overview-technology-guide.pdf, 2021. Accessed on Jun
     Francisco Rodríguez-Henríquez. A faster software implementation of              7, 2022.
     the supersingular isogeny Diffie-Hellman key exchange protocol. IEEE
                                                                                [51] Yeongjin Jang, Sangho Lee, and Taesoo Kim. Breaking kernel address
     Transactions on Computers, 67(11), 2018.
                                                                                     space layout randomization with Intel TSX. In CCS, 2016.
[30] Pierre-Alain Fouque and Frédéric Valette. The doubling attack–why
     upwards is better than downwards. In CHES, 2003.                           [52] David Jao, Reza Azarderakhsh, Matthew Campagna, Craig Costello,
                                                                                     Luca De Feo, Basil Hess, Amir Jalali, Brian Koziel, Brian LaMacchia,
[31] Eiichiro Fujisaki and Tatsuaki Okamoto. Secure integration of asym-             Patrick Longa, Michael Naehrig, Joost Renes, Vladimir Soukharev,
     metric and symmetric encryption schemes. Journal of Cryptology,                 David Urbanik, Geovandro Pereira, Koray Karabina, and Aaron
     26(1), 2013.                                                                    Hutchinson. SIKE. Technical report, National Institute of Standards
[32] Steven D. Galbraith, Christophe Petit, Barak Shani, and Yan Bo Ti. On           and Technology, 2020.
     the security of supersingular isogeny cryptosystems. In ASIACRYPT,         [53] David Jao and Luca De Feo. Towards quantum-resistant cryptosystems
     2016.                                                                           from supersingular elliptic curve isogenies. In PQCrypto, 2011.
[33] Si Gao, Johann Großschädl, Ben Marshall, Dan Page, Thinh Pham,             [54] Marc Joye and Christophe Tymen. Protections against differential
     and Francesco Regazzoni. An instruction set extension to support                analysis for elliptic curve cryptography. In CHES, 2001.
     software-based masking. Cryptology ePrint Archive, Report 2020/773,
     2020.                                                                      [55] Manuel Kalmbach, Mathias Gottschlag, Tim Schmidt, and Frank Bel-
                                                                                     losa. TurboCC: A practical frequency-based covert channel with Intel
[34] Si Gao, Ben Marshall, Dan Page, and Elisabeth Oswald. Share-slicing:
                                                                                     Turbo Boost. Preprint, arXiv:2007.07046 [cs.CR], 2020.
     Friend or foe? TCHES, 2020.
                                                                                [56] Nikolaos Kavvadias, Periklis Neofotistos, Spiridon Nikolaidis, CA Kos-
[35] Daniel Genkin, Lev Pachmanov, Itamar Pipman, Eran Tromer, and
                                                                                     matopoulos, and Theodore Laopoulos. Measurements analysis of the
     Yuval Yarom. ECDSA key extraction from mobile devices via nonin-
                                                                                     software-related power consumption in microprocessors. IEEE Trans-
     trusive physical side channels. In CCS, 2016.
                                                                                     actions on Instrumentation and Measurement, 53(4), 2004.
[36] Daniel Genkin, Itamar Pipman, and Eran Tromer. Get your hands off
     my laptop: Physical side-channel key-extraction attacks on PCs. In         [57] Colin Ian King. stress-ng. https://github.com/ColinIanKing/
     CHES, 2014.                                                                     stress-ng, 2022. Accessed on Jun 7, 2022.

[37] Enes Göktas, Kaveh Razavi, Georgios Portokalidis, Herbert Bos, and         [58] Paul Kocher. Timing attacks on implementations of Diffie-Hellman,
     Cristiano Giuffrida. Speculative probing: Hacking blind in the Spectre          RSA, DSS, and other systems. In CRYPTO, 1996.
     era. In CCS, 2020.                                                         [59] Paul Kocher, Joshua Jaffe, and Benjamin Jun. Differential power anal-
[38] Jovan D Golić and Christophe Tymen. Multiplicative masking and                 ysis. In CRYPTO, 1999.
     power analysis of AES. In CHES, 2002.                                      [60] Yann Le Corre, Johann Großschädl, and Daniel Dinu. Micro-
[39] Louis Goubin and Jacques Patarin. DES and differential power analysis           architectural power simulator for leakage assessment of cryptographic
     the “duplication” method. In CHES, 1999.                                        software on ARM Cortex-M3 processors. In COSADE, 2018.
[40] Corey Gough, Ian Steiner, and Winston Saunders. Energy Efficient           [61] Sheayun Lee, Andreas Ermedahl, Sang Lyul Min, and Naehyuck Chang.
     Servers: Blueprints for Data Center Optimization. Apress, 2015.                 An accurate instruction-level energy consumption model for embedded
                                                                                     RISC processors. ACM SIGPLAN Notices, 36(8), 2001.
[41] Hannes Groß, Manuel Jelinek, Stefan Mangard, Thomas Unterluggauer,
     and Mario Werner. Concealing secrets in embedded processors designs.       [62] Linux. aperfmperf.c. https://git.kernel.org/pub/scm/lin
     In CARDIS, 2016.                                                                ux/kernel/git/torvalds/linux.git/tree/arch/x86/kernel/
                                                                                     cpu/aperfmperf.c. Accessed on Jun 7, 2022.
[42] Hannes Groß, Stefan Mangard, and Thomas Korak. Domain-oriented
     masking: Compact masked hardware implementations with arbitrary            [63] Moritz Lipp, Daniel Gruss, and Michael Schwarz. AMD prefetch
     protection order. In TIS, 2016.                                                 attacks through power and time. In USENIX Security, 2022.




USENIX Association                                                                                      31st USENIX Security Symposium                693
[64] Moritz Lipp, Andreas Kogler, David Oswald, Michael Schwarz, Cather-     [87] Madura A Shelton, Niels Samwel, Lejla Batina, Francesco Regazzoni,
     ine Easdon, Claudio Canella, and Daniel Gruss. PLATYPUS: Software-           Markus Wagner, and Yuval Yarom. Rosita: Towards automatic elimina-
     based power side-channel attacks on x86. In S&P, 2021.                       tion of power-analysis leakage in ciphers. NDSS, 2021.
[65] Chen Liu, Abhishek Chakraborty, Nikhil Chawla, and Neer Roggel.         [88] Ankush Varma, Eric Debes, Igor Kozintsev, and Bruce Jacob.
     Frequency throttling side-channel attack. Preprint, arXiv:2206.07012         Instruction-level power dissipation in the Intel XScale embedded mi-
     [cs.CR], 2022.                                                               croprocessor. In Embedded Processors for Multimedia and Communi-
[66] Patrick Longa. Post-quantum Cryptography. Microsoft, 2019. Avail-            cations II, 2005.
     able at https://github.com/microsoft/PQCrypto-SIDH. Ac-                 [89] Nikita Veshchikov. SILK: high level of abstraction leakage simulator
     cessed on Jun 7, 2022.                                                       for side channel analysis. In PPREW, 2014.
[67] Stefan Mangard. A simple power-analysis (SPA) attack on implemen-       [90] Vince Weaver. Reading RAPL energy measurements from linux. http:
     tations of the AES key expansion. In ICISC, 2002.                            //web.eece.maine.edu/~vweaver/projects/rapl/. Accessed
[68] Stefan Mangard, Elisabeth Oswald, and Thomas Popp. Power Analysis            on Jun 7, 2022.
     Attacks: Revealing the Secrets of Smart Cards, volume 31. Springer      [91] Rafael J. Wysocki. intel_pstate CPU performance scaling driver.
     Science & Business Media, 2008.                                              https://www.kernel.org/doc/html/v4.19/admin-guide/pm/i
[69] Stefan Mangard, Norbert Pramstaller, and Elisabeth Oswald. Success-          ntel_pstate.html. Accessed on Jun 7, 2022.
     fully attacking masked AES hardware implementations. In CHES,           [92] Lin Yan, Yao Guo, Xiangqun Chen, and Hong Mei. A study on power
     2005.                                                                        side channels on mobile devices. In Internetware, 2015.
[70] Heiko Mantel, Johannes Schickel, Alexandra Weber, and Friedrich
                                                                             [93] Qing Yang, Paolo Gasti, Gang Zhou, Aydin Farajidavar, and Kiran
     Weber. How secure is green IT? the case of software-based energy side
                                                                                  Balagani. On inferring browsing activity on smartphones via USB
     channels. In ESORICS, 2018.
                                                                                  power analysis side-channel. IEEE Trans. Inf. Forensics Secur., 12(5),
[71] Rita Mayer-Sommer. Smartly analyzing the simplicity and the power            2016.
     of simple power analysis on smartcards. In CHES, 2000.
                                                                             [94] Sung-Ming Yen, Wei-Chih Lien, SangJae Moon, and JaeCheol Ha.
[72] David McCann, Elisabeth Oswald, and Carolyn Whitnall. Towards                Power analysis by exploiting chosen message and internal collisions -
     practical tools for side channel aware software engineering:’grey            vulnerability of checking mechanism for RSA-decryption. In Mycrypt,
     box’modelling for instruction leakages. In USENIX Security, 2017.            2005.
[73] Thomas Messerges. Using second-order power analysis to attack DPA       [95] Zhenkai Zhang, Sisheng Liang, Fan Yao, and Xing Gao. Red alert
     resistant software. In CHES, 2000.                                           for power leakage: Exploiting Intel RAPL-induced side channels. In
[74] Thomas Messerges, Ezzy Dabbish, and Robert Sloan. Investigations of          ASIACCS, 2021.
     power analysis attacks on smartcards. In USENIX Smartcard, 1999.
[75] Thomas Messerges, Ezzy Dabbish, and Robert Sloan. Power analysis
     attacks of modular exponentiation in smartcards. In CHES, 1999.         A     Appendix
[76] Yan Michalevsky, Aaron Schulman, Gunaa Arumugam Veerapandian,
     Dan Boneh, and Gabi Nakibly. PowerSpy: Location tracking using          A.1    Leakage Model—Additional Experiments
     mobile device power analysis. In USENIX Security, 2015.
                                                                             HD in the ALU Input In Section 4.1, we saw that increas-
[77] Jeremy Morse, Steve Kerrison, and Kerstin Eder. On the limitations of
     analyzing worst-case dynamic energy of processing. ACM Transactions     ing the number of bit transitions in the ALU output causes an
     on Embedded Computing Systems (TECS), 17(3):1–22, 2018.                 increase in power consumption and a decrease in frequency.
[78] Hassan Mujtaba. [IDF15]Intel’s 6th gen Skylake unwrapped - CPU          Here, we set out to understand if the same effect happens when
     microarchitecture, Gen9 graphics core and Speed Shift hardware P-       bit transitions occur in the ALU input. We need a sender that
     state. https://wccftech.com/idf15-intel-skylake-analysis-               offers fine-grained control over the number of transitions in
     cpu-gpu-microarchitecture-ddr4-memory-impact/4/, 2015.
     Accessed on Jun 7, 2022.
                                                                             the ALU input, while avoiding potential side-effects such as
                                                                             the HW effect or bit transitions in the ALU output.
[79] Svetla Nikova, Christian Rechberger, and Vincent Rijmen. Threshold
     implementations against side-channel attacks and glitches. In ICICS,       We design a sender that is symmetric to the one of Figure 3a.
     2006.                                                                   Our sender still uses shlx and shrx instructions, as shown
[80] Roman Novak. SPA-based adaptive chosen-ciphertext attack on RSA         in Figure 13a. However, it is designed such that the output
     implementation. In PKC, 2002.                                           of all shlx and shrx instructions is always the same, and
[81] Kostas Papagiannopoulos and Nikita Veshchikov. Mind the gap: To-        only their input varies as a function of COUNT. Hence, any
     wards secure 1st-order masking in software. In COSADE, 2017.            HD effect is caused by bit transitions on the ALU input only.
[82] Matthieu Rivain and Emmanuel Prouff. Provably secure higher-order       For example, when COUNT = 8, the source register to each
     masking of AES. In CHES, 2010.                                          shlx contains 0x000000ffffffff00, and the source register
[83] Erkay Savas and Çetin Kaya Koç. Montgomery inversion. J. Cryptogr.      to each shrx contains 0x00ffffffff000000, the alternation
     Eng., 8(3), 2018.
                                                                             of which translates to a HD of 4 × 8 in the ALU input.
[84] Werner Schindler and Andreas Wiemers. Power attacks in the presence
                                                                                Figure 14 shows the results for increasing COUNT values.
     of exponent blinding. J. Cryptogr. Eng., 4(4), 2014.
                                                                             We see that the power consumption grows and the frequency
[85] Werner Schindler and Andreas Wiemers. Generic power attacks on
     RSA with CRT and exponent blinding: new results. J. Cryptogr. Eng.,     drops when COUNT grows, confirming that the number of
     7(4), 2017.                                                             bit transitions (i.e., the HD) in the ALU input directly affects
[86] Kai Schramm and Christof Paar. Higher order masking of the AES. In      power consumption and CPU frequency. We also see that the
     CT-RSA, 2006.                                                           changes in power / frequency become more significant when



694    31st USENIX Security Symposium                                                                                         USENIX Association
                                            rax = COUNT                                                 rax = 1
                                            rbx = 0x0000FFFFFFFF0000 >> COUNT                           rsp = pointer_to_memory
                                            rcx = 0x0000FFFFFFFF0000 << COUNT                           rbx = … = r15 = INPUT
                                            loop:                                                       loop:
                                              shlx %rax,%rbx,%rdx             // rdx = rbx << rax                  mov %rax,(%rsp)   // store rax to memory
                                              shlx %rax,%rbx,%rsi             // rsi = rbx << rax                  mov %rax,(%rsp)   // store rax to memory
                                              shrx %rax,%rcx,%rdi             // rdi = rcx >> rax                  mov %rax,(%rsp)   // store rax to memory
                                              shrx %rax,%rcx,%r8              // r8   = rcx >> rax                 mov %rax,(%rsp)   // store rax to memory
                                              shlx %rax,%rbx,%r9              // r9   = rbx << rax                 mov %rax,(%rsp)   // store rax to memory
                                              shlx %rax,%rbx,%r10             // r10 = rbx << rax                  mov %rax,(%rsp)   // store rax to memory
                                              shrx %rax,%rcx,%r11             // r11 = rcx >> rax                  mov %rax,(%rsp)   // store rax to memory
                                              shrx %rax,%rcx,%r12             // r12 = rcx >> rax                  mov %rax,(%rsp)   // store rax to memory
                                            jmp loop                                                    jmp loop


                                           (a) Variant of sender for the HD experiments.             (b) Sender for the HW at rest experiments.

   Figure 13: Additional sets of instructions (senders) used to reverse engineer the dependency between data and power consumption
   / frequency on our CPUs. Different senders are designed to target different effects. Each sender can be run with variable inputs.


                  4.295                                                                                                                                              27.2                       8 ones
                                                                   23.1                                                4.15                                                                     16 ones




                                                                                                     Frequency (GHz)
Frequency (GHz)




                  4.290                                                                                                                                              27.0                       32 ones
                                                       Power (W)




                                                                                                                                                         Power (W)
                                                                                                                                                                                                48 ones
                  4.285                                            23.0                                                4.14                                          26.8
                  4.280                                            22.9                                                4.13                    8 ones
                                                                                                                                               16 ones               26.6
                                                                                                                                               32 ones
                  4.275                                            22.8                                                4.12                    48 ones               26.4
                          0   5       10      15                          0    5       10     15                              20         40        60                          20         40        60
                                  COUNT                                            COUNT                                        Shift Offset                                     Shift Offset
                     (a) Mean frequencies.                (b) Mean power consumptions.                             (a) Frequency vs shift offset                      (b) Power vs shift offset

    Figure 14: Effect of increasing COUNT in Figure 13a’s sender                                         Figure 15: Effect of shifting consecutive 1s in the LEFT =
    on our i7-9700 CPU. Higher COUNT values cause higher HDs                                             RIGHT input to Figure 3b’s sender on our i7-9700 CPU. As
    in the ALU output. As the HD increases, the mean power con-                                         we shift the 1s towards the MSB, the mean power consump-
    sumption grows and the mean steady-state frequency drops.                                           tion grows and the mean steady-state frequency drops.


    the COUNT > 8, as a result of the non-uniform HW cost of                                            Similarly, when the number of consecutive 0s in shift0 is 32, a
    having 1s closer to the MSB in the fixed source register rcx.                                       shift offset of 16 refers to input value 0xffff00000000ffff.
                                                                                                           Figure 15 shows the results for the shift1 experiment when
    Non-uniform HW In Section 4.2, we saw that the HW ef-                                               we fix the number of 1s to 8, 16, 32, or 48. Consider the
    fect it depends on the position of 1s in the data (i.e., it is                                      case when the number of 1s is 16. When the shift offset is
    non-uniform). We now discuss two experiments that provide                                           between 0 to 16, we see almost no variation in the mean power
    additional evidence that the HW effect is non-uniform. We                                           / frequency. This is because as we shift in this range, 1s are
    refer to these experiments as shift0 and shift1 . Both experi-                                      still all the low 32 bits, and we know from Figure 7 that there
    ments use the same sender of Section 4.2, shown in Figure 3b.                                       is little difference in the HW effect for 1s that are in the low
    In shift1 , we fix the number of consecutive 1s and measure                                         32 bits. However, when the shift offset increases from 16 to
    the impact of changing the position of these consecutive 1s                                         48, the power consumption grows and the frequency drops.
    in the LEFT = RIGHT input, when all surrounding bits are                                            This is because we start gaining 1s in the high 32 bits and
    0s. In shift0 , we do the opposite: we fix the number of con-                                       approaching the MSB. This is consistent with what we saw
    secutive 0s and measure the impact of changing the position                                         in Figure 7, where 1s closer to the MSB have a stronger HW
    of these consecutive 0s in the LEFT = RIGHT input, when                                             effect than 1s closer to the 32nd bit. The results are similar
    all surrounding bits are 1s. By construction, since the HW is                                       when the number of 1s is 8. When the number of 1s is 32 or 48,
    fixed and the sender does not introduce any HD effect, any                                          the HW effect increases every time the shift offset increases.
    differences in the results depend only on the position of 1s.                                       This is because, in these cases, shifting means that we lose 1s
       We label different positions of the consecutive bit patterns                                     in the low 32 bits and gain 1s in the high 32 bits, and we know
    based on their “shift offset” starting from the LSB. For exam-                                      from Figure 7 that 1s in the high 32 bits have a stronger HW
    ple, when the number of consecutive 1s in shift1 is 32, a shift                                     effect than 1s in the low 32 bits. The HW increments in these
    offset of 0 refers to input value 0x00000000ffffffff and a                                          cases are also more significant, because the delta between the
    shift offset of 16 refers to input value 0x0000ffffffff0000.                                        HW effect of the bits we gain and the bits we lose is larger.



    USENIX Association                                                                                                                   31st USENIX Security Symposium                          695
                  4.15                          8 zeros                                                                        4.37                                        22.0
                                                16 zeros               27.2




                                                                                                             Frequency (GHz)
Frequency (GHz)



                  4.14                          32 zeros                                                                       4.36                                        21.8




                                                           Power (W)




                                                                                                                                                               Power (W)
                                                48 zeros
                                                                       27.0
                  4.13                                                                                                         4.35                                        21.6
                                                                       26.8                       8 zeros
                                                                                                                               4.34
                                                                                                  16 zeros                                                                 21.4
                  4.12                                                 26.6                       32 zeros
                                                                                                  48 zeros                     4.33                                        21.2
                               20         40         60                          20         40         60                             0    20       40    60                      0      20       40    60
                                 Shift Offset                                      Shift Offset                                             HW of INPUT                                   HW of INPUT
              (a) Frequency vs shift offset                             (b) Power vs shift offset                                 (a) Frequency vs HW                             (b) Power vs HW

    Figure 16: Effect of shifting consecutive 0s in the LEFT =                                                  Figure 17: Effect of increasing the HW of INPUT (at rest)
    RIGHT input to Figure 3b’s sender on our i7-9700 CPU. As                                                    in Figure 13b’s sender on our i7-9700 CPU. As we increase
   we shift the 0s towards the MSB, the mean power consump-                                                     HW from 0 to 64, the mean power consumption and the mean
   tion drops and the mean steady-state frequency grows.                                                        steady-state frequency do not change.


       Figure 16 shows the results for the shift0 experiment. These                                             grows. This result suggests that the HW effect does not occur
    results are symmetrical to the shift1 ones and can be explained                                             when simply keeping data stored inside registers.
    by the same reasons described for the shift1 experiment.
       In summary, the shift0 and shift1 experiments support our                                                A.2                   Mathematical Preliminaries for SIKE
    observation that the HW effect is non-uniform.
                                                                                                                SIKE is an isogeny-based key encapsulation method which in-
   HW Root Cause In Section 4.3, we saw that the HD effect                                                      volves arithmetic operations of elliptic curves over finite fields.
   and the HW effect are additive. Recall that the HD effect                                                    In particular, SIKE uses Montgomery elliptic curves. Its se-
   is due to 1 → 0 and 0 → 1 bit transitions in the data being                                                  curity relies on the hardness of finding a specific isogeny be-
   processed. This is a well-understood effect in the literature,                                               tween two such elliptic curves. Here, we provide an overview
   and can be attributed to the fact that when more bits flip during                                            of the details of SIKE that are relevant to our attack.14
   a computation, more transistors are switched in the datapath,                                                   Let p be a prime of the form 2e2 3e3 − 1. SIKE works in
   which causes dynamic power consumption to grow [46, 68].                                                     the field Fp2 = Fp (i) with i2 = −1 (mod p) and uses the su-
   However, it is difficult to pinpoint the root cause of the HW                                                persingular elliptic curves over Fp2 that have (2e2 3e3 )2 points.
   effect on x86 Intel CPUs. For example, it is unclear if the HW                                               The set of points P ∈ E(Fp ) that satisfy [n]P = O is called
   effect occurs only when data is actively computed on, or if it                                               the n-torsion of E. The curves of interest were chosen so that
   is due to any data-dependent power cost of simply keeping                                                    the entire (2e2 3e3 )-torsion is already defined over Fp2 , and
   data stored inside registers. Our sender from Figure 3b cannot                                               we have E[2e2 3e3 ] ∼= Z/(2e2 3e3 )Z × Z/(2e2 3e3 )Z; as a result,
   distinguish between these two cases because it is designed to                                                for each curve of interest, E[2e2 ] can be generated by linear
   continuously compute on and overwrite identical data values.                                                 combinations of two points P2 and Q2 with coefficients in Fp2 ;
   Here, we design a new sender to test if the HW effect occurs                                                 and likewise E[3e3 ] can be generated by linear combinations
   also when data values with different HWs are simply stored                                                   of two points P3 and Q3 with coefficients in Fp2 .
   into registers (at rest), but not actively computed on.                                                         An isogeny 𝜙 : E1 (Fp2 ) → E2 (Fp2 ) is a group homomor-
      Our sender, shown in Figure 13b, is designed as follows.                                                  phism from E1 (Fp2 ) to E2 (Fp2 ) and a non-constant rational
   First, it sets the content of rax to 1, rsp to a memory location,                                            map defined over Fp2 that preserves the point at infinity O .
   and all other architectural registers to a fixed INPUT value.                                                The kernel of an isogeny is ker 𝜙 = {P ∈ E1 : 𝜙(P) = O }.
   Then, it enters an infinite loop of stores that write the content                                               Every finite subgroup H of a curve E(Fp2 ) defines an
   of rax into the memory location pointed to by rsp.13                                                         isogeny 𝜙 : E → E/H, unique up to isomorphism, such that
      By construction, the store operations in the loop are always                                              ker 𝜙 = H. The cardinality of H is also the degree of the ra-
   the same and independent of the value of INPUT. Changing                                                     tional map 𝜙. Given H, Vélu’s algorithm allows the rational
   the value of INPUT only affects the content of registers that                                                map for the isogeny corresponding to H to be computed; the
   are initialized, but not actively computed on by the sender.                                                 computation is tractable when |H| is small.
   Any difference in power consumption due to different INPUT                                                      An `-isogeny is defined as 𝜙` : E → E/hPi, where P has
   values would then be due to HW effect at rest.                                                               exact order `. The order of 𝜙(Q) in E/hPi is the same as
      Figure 17 shows the results when we increase the HW of                                                    the order of Q in E unless Q lies above ker 𝜙 (meaning that
   INPUT from 0 to 64. We see no differences in the mean power                                                     14 For more information on SIKE, we refer to the SIKE tutorial by
   consumption and mean steady-state frequency when the HW                                                      Costello [19] and to the SIKE specification [52]. For more information on
                                                                                                                elliptic curves and isogenies, we refer to the pairings tutorial by Costello [18]
                  13 We use a store so that the register file is constantly being read from, in                 and to De Feo’s lecture notes [23] and habilitation thesis [24]. For more
    the offchance an inactive register file could be powered down.                                              information on Montgomery ladders, we refer to Bernstein and Lange [6].




    696                  31st USENIX Security Symposium                                                                                                                               USENIX Association
 Algorithm 2: Computing and evaluating a 3e -isogeny,                             the methods of Section 5.3.2, Ladder3pt, which is supposed
 simple version ( [52], Appendix A)                                               to return P + [sk3 ]Q in projective x-coordinate form, instead
                                                                                  returns the invalid value (0 : 0). This is not a valid projec-
1   function 3_e_iso
       Static parameters: Integer e3 from the public                              tive representation of any point on E00 , and certainly not the
                             parameters                                           representation of a point of exact order 3e3 .
       Input: Constants (A+        −                                                 An examination of the subroutines invoked by 3_e_iso
                             24 : A24 ) corresponding to a
               curve EA/C , (XS : ZS ) where S has exact                          reveals some remarkable facts:
               order 3e3 on EA/C                                                   • If xTPL or xTPLe is called with (0 : 0) as its first argument,
                      0   −0                                                          every intermediate value it computes is 0, and its return
       Output: (A+ 24 : A24 ) coresponding to the curve                               value is (0 : 0), regardless of its second argument.
                 EA0 /C0 = E/hSi                                                   • If 3_iso_curve is called with (0 : 0) as its argument, every
1 for e = e3 − 1 downto 0 by −1 do                                                    intermediate value it computes is 0, and it returns (0 : 0)
                                               +     −                                             −
                                                                                      for (A+
                                                            
2     (XT : ZT ) ← xTPLe (X        S : ZS ), (A24 : A24 ), e                                 24 : A24 ) and (0, 0) for (K1 , K2 ).
                  −
        (A+
                                 
3          24: A24 ), (K1 , K2 ) ← 3_iso_curve (XT :                              • If 3_iso_eval is called with (0 : 0) as its first argument,
        ZT )                                                                          every intermediate value it computes is 0, and its return
4     if e 6= 0 then                                                                  value is (0 : 0), regardless of the value of its second argu-
                                                                                      ment (which, in this case, is (0, 0)).
                                                              
5           (XS : ZS ) ← 3_iso_eval (K1 , K2 ), (XS : ZS )
                                                                                     As a result, when 3_e_iso is invoked on input (XS : ZS ) =
                   −
6   return (A+
             24 : A24 )                                                           (0 : 0), every single intermediate value computed during every
                                                                                  loop iteration of 3_e_iso is a 0, including every intermediate
                                                                                  value computed in every subroutine that 3_e_iso calls.
[n]Q ∈ ker 𝜙 \ {O } for some n), in which case the order of                          For inputs generated according to our algorithm in Sec-
𝜙(Q) is reduced by a factor of `.                                                 tion 5.3.2 above but with an incorrect key-bit guess, the point
   Two curves are isogenous (meaning that there exists an                         (XS : ZS ) on which 3_e_iso is called will not be (0 : 0), but
isogeny from one to the other) if they have the same number                       it will also not be a point of exact order 3e3 , so the behavior
of points. The curves of interest are all isogenous. If there                     of 3_e_iso on it is unspecified. On such inputs, we expect
is an isogeny 𝜙 from E1 to E2 then there is also an inverse                       that 3_e_iso will get stuck on (0 : 0) only with negligible
isogeny 𝜙−1 from E2 to E1 ; the composition 𝜙−1 ◦ 𝜙 is the                        probability. This conjecture is likewise supported by our ex-
map [deg 𝜙] on E1 , and likewise 𝜙 ◦ 𝜙−1 on E2 .                                  periments, with one caveat noted above: there is some chance
   If isogenies 𝜙 and 𝜙−1 between E1 and E2 are such that                         that the challenge ciphertext we form to target a bit accessed
  −1
𝜙 ◦ 𝜙 is the identity map [1] then E1 and E2 are isomorphic.                      late in the ladder will cause Ladder3pt to output a point of
Isomorphic curves share the same j-invariant; the j-invariant                     order 3e for some e e3 .16 Evaluating 3_e_iso on such a
of a curve can be computed given a description of the curve.                      point will trigger isogenies computed with kernel as the group
                                                                                  formed by point of infinity O , which will trigger a frequency
A.3      Anomalous 0s in Isogeny Evaluation: Details                              increase. We sidestep this problem by recovering the last
                                                                                  14 bits of the key by brute-force search.
Algorithm 2 reproduces the implementation of 3_e_iso from
the specification [52] with optional arguments omitted.15                         A.4     SIKE Error correction
   3_e_iso calls xTPLe to compute [3e ](XS : ZS ), by repeated
                                                                                  During our attack, a mistake made at bit position k invalidates
application of the tripling map xTPL; if (XS : ZS ) has ex-
                                                                                  measurements targeting all subsequent bit positions. With
act order 3e3 then (XT : ZT ) is a point of exact order 3.
                                                                                  mk correct, we expect to observe frequency increases (and
3_iso_curve expects a point of exact order 3 as input and
                                                                                  thus mk 6= mk−1 ) with probability 1/2. By contrast, with mk
uses Vélu’s algorithm to compute the isogeny corresponding
                                                                                  incorrect we expect to never to observe frequency increases.
to the group (XT : ZT ) . It also outputs the curve constant
                                                                                     After a sufficiently long run without observing frequency
for the curve that is the image of E under that isogeny. Fi-
                                                                                  increases, we backtrack to find the misinterpreted bit. In Sec-
nally, 3_iso_eval uses the values returned by 3_iso_curve
                                                                                  tion 5’s experiments, we set the backtrack threshold to 40 bits.
to compute the image of (XS : ZS ) under the isogeny. Because
(XS : ZS ) lies above (XT : ZT ), which is in the kernel of the
isogeny, the order of the image of (XS : ZS ) is 3e−1 . We refer
                                                                                     16 In our challenge ciphertext, we set Q = P + P , so Q is a point of order
to the SIKE specification [52] for a more detailed description                                                                     2    3
                                                                                  2e2 3e3 . The output of Ladder3pt is a linear combination of T and [2i ]Q,
of the xTPLe, 3_iso_curve and 3_iso_eval algorithms.                                            i
                                                                                  [a]T + [b][2 ]Q, where a and b depend on the secret m. When i is large,
   When the attacker has made a correct key-bit guess using                       [2i ]P2 will have small order 2e2 −i . Since T is a point of order 2, [a]T and
                                                                                  [b][2i ]P2 might happen to cancel each other, and [a]T + [b][2i ]Q will end up
    15 In fact, optimized implementations evaluate the isogeny using a more       as [b][2i ][P3 ]. If b happens to be a multiple of 3, the output of Ladder3pt
complicated but more efficient strategy. Our attack applies to either approach.   would be a point of order smaller than 3e3 .




USENIX Association                                                                                         31st USENIX Security Symposium                 697
