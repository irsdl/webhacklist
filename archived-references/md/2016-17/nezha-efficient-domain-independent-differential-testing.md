---
type: Whitepaper
title: "NEZHA: Efficient Domain-Independent Differential Testing"
description: NEZHA guides differential testing by delta-diversity, a measure of how differently several programs behave on the same input, instead of code coverage, so mutation heads for inputs that make implementations disagree. It found semantic bugs in X.509 validation across SSL/TLS libraries, in ClamAV versus the Linux ELF loader and in XZ parsing, where one program accepts what another rejects.
resource: "https://www.ieee-security.org/TC/SP2017/papers/390.pdf"
tags: [whitepaper, webseclist-reference, parser-differential, fuzzing, tls, filter-bypass, tooling, dynamic-analysis, owasp-a02-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T22:35:13+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ieee-security.org/TC/SP2017/papers/390.pdf"
    title: "NEZHA: Efficient Domain-Independent Differential Testing"
    author: Theofilos Petsios, Adrian Tang, Salvatore Stolfo, Angelos D. Keromytis, Suman Jana
also_at: []
authors:
  - Theofilos Petsios
  - Adrian Tang
  - Salvatore Stolfo
  - Angelos D. Keromytis
  - Suman Jana
canonical_url: ""
cited_by:
  - "2016-17.md:93"
commit: ""
content_sha256: ddf830ff5a38d34debb07b9f340cbc68c7e88a05761984a0b44e29dbc01986df
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ieee-security.org/TC/SP2017/papers/390.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: f2501b0313d9dcf31e408115651b7a3961871ae5337d96bc71f2fe1c9986b15a
retrieved_from: "https://www.ieee-security.org/TC/SP2017/papers/390.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T22:35:13+00:00"
slug: nezha-efficient-domain-independent-differential-testing
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# NEZHA: Efficient Domain-Independent Differential Testing

**NEZHA: Efficient Domain-Independent Differential Testing** - Theofilos Petsios, Adrian Tang, Salvatore Stolfo, Angelos D. Keromytis, Suman Jana, Publisher not stated.

- Published: date not stated
- Original: <https://www.ieee-security.org/TC/SP2017/papers/390.pdf>
- Preserved from: https://www.ieee-security.org/TC/SP2017/papers/390.pdf (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# NEZHA: Efficient Domain-Independent Differential Testing

N EZHA: Efficient Domain-Independent Differential Testing
               Theofilos Petsios∗ , Adrian Tang∗ , Salvatore Stolfo, Angelos D. Keromytis and Suman Jana
                                                 Department of Computer Science
                                              Columbia University, New York, USA
                                     {theofilos, atang, sal, angelos, suman}@cs.columbia.edu



   Abstract—Differential testing uses similar programs as cross-      PDF, or XZ (a popular archive format), according to their
referencing oracles to find semantic bugs that do not exhibit         respective specifications, in order to accurately detect mali-
explicit erroneous behaviors like crashes or assertion failures.      cious content hidden in such files [41]. Similarly, SSL/TLS
Unfortunately, existing differential testing tools are domain-
specific and inefficient, requiring large numbers of test inputs      implementations must validate X.509 certificates according to
to find a single bug. In this paper, we address these issues by       the appropriate protocol specifications for setting up a secure
designing and implementing N EZHA, an efficient input-format-         connection in the presence of network attackers [24], [33].
agnostic differential testing framework. The key insight behind          However, most semantic bugs in security-sensitive software
N EZHA’s design is that current tools generate inputs by simply
borrowing techniques designed for finding crash or memory             do not display any explicitly erroneous behavior like a crash
corruption bugs in individual programs (e.g., maximizing code         or assertion failure, and thus are very hard to detect without
coverage). By contrast, N EZHA exploits the behavioral asymme-        specifications. Unfortunately, specifications, even for highly
tries between multiple test programs to focus on inputs that are      critical software like SSL/TLS implementations or popular
more likely to trigger semantic bugs. We introduce the notion of      file formats like ELF, are usually documented informally in
δ-diversity, which summarizes the observed asymmetries between
the behaviors of multiple test applications. Based on δ-diversity,    multiple sources such as RFCs and developer manuals [10]–
we design two efficient domain-independent input generation           [18], [20], [62], [63]. Converting these informal descriptions
mechanisms for differential testing, one gray-box and one black-      to formal invariants is tedious and error-prone.
box. We demonstrate that both of these input generation schemes
                                                                         Differential testing is a promising approach towards over-
are significantly more efficient than existing tools at finding
semantic bugs in real-world, complex software.                        coming this issue. It finds semantic bugs by using differ-
   N EZHA’s average rate of finding differences is 52 times and 27    ent programs of the same functionality as cross-referencing
times higher than that of Frankencerts and Mucerts, two popular       oracles, comparing their outputs across many inputs: any
domain-specific differential testing tools that check SSL/TLS         discrepancy in the programs’ behaviors on the same input is
certificate validation implementations, respectively. Moreover,
                                                                      marked as a potential bug. Differential testing has been used
performing differential testing with N EZHA results in 6 times
more semantic bugs per tested input, compared to adapting             successfully to find semantic bugs in diverse domains like
state-of-the-art general-purpose fuzzers like American Fuzzy Lop      SSL/TLS implementations [24], [32], C compilers [65], and
(AFL) to differential testing by running them on individual test      JVM implementations [31]. However, all existing differential
programs for input generation.                                        testing tools suffer from two major limitations as described
   N EZHA discovered 778 unique, previously unknown discrep-          below.
ancies across a wide variety of applications (ELF and XZ
parsers, PDF viewers and SSL/TLS libraries), many of which               First, they rely on domain-specific knowledge of the in-
constitute previously unknown critical security vulnerabilities. In   put format to generate new test inputs and, therefore, are
particular, we found two critical evasion attacks against ClamAV,     brittle and difficult to adapt to new domains. For instance,
allowing arbitrary malicious ELF/XZ files to evade detection. The
                                                                      Frankencerts [24] and Mucerts [32] incorporate partial gram-
discrepancies N EZHA found in the X.509 certificate validation
implementations of the tested SSL/TLS libraries range from            mars for X.509 certificates and use domain-specific mutations
mishandling certain types of KeyUsage extensions, to incorrect        for input generation. Similarly, existing differential testing
acceptance of specially crafted expired certificates, enabling man-   tools for C compilers, Java virtual machines, and malware
in-the-middle attacks. All of our reported vulnerabilities have       detectors, all include grammars for the respective input format
been confirmed and fixed within a week from the date of
                                                                      and use domain-specific mutations [31], [41], [65].
reporting.
                                                                         Second, existing differential testing tools are inefficient at
                          I. I NTRODUCTION                            finding semantic bugs, requiring large numbers of inputs to
   Security-sensitive software must comply with different high-       be tested for finding each semantic bug. For example, in
level specifications to guarantee its security properties. Any        our experiments, Frankencerts required testing a total of 10
semantic bug that causes deviations from these specifications         million inputs to find 10 distinct discrepancies, starting from a
might render the software insecure. For example, a malware            corpus of 100, 000 certificates. Mucerts, starting from the same
detector must parse input files of different formats like ELF         100, 000 certificates, reported 19 unique discrepancies, using
(the default executable format in Linux/Unix-based systems),          2, 660 optimized certificates it generated from the corpus, but
                                                                      required six days to do so.
  ∗ Joint primary student authors.                                       In this paper, we address both the aforementioned prob-
lems by designing and implementing N EZHA1 , a differential                   unknown security vulnerabilities. For example, we found two
testing tool that uses a new domain-independent approach                      evasion attacks against ClamAV, one for each of the ELF and
for detecting semantic bugs. N EZHA does not require any                      XZ parsers. Moreover, N EZHA was able to pinpoint 14 unique
detailed knowledge of the input format, but still significantly               differences even among forks of the same code base like the
outperforms existing domain-specific approaches at finding                    OpenSSL, LibreSSL, and BoringSSL libraries.
new semantic bugs.                                                               In summary, we make the following contributions:
   Our key observation is that existing differential testing tools               • We introduce the concept of δ-diversity, a novel scheme
ignore asymmetries observed across the behaviors of all tested                      that tracks relative behavioral asymmetries between mul-
programs, and instead generate test inputs simply based on the                      tiple test programs to efficiently guide the input genera-
behaviors of individual programs in isolation. For instance,                        tion process of differential testing.
Mucerts try to maximize code coverage solely on a single                         • We build and open-source N EZHA , an efficient, domain-
program (e.g., OpenSSL) to generate inputs. However, this                           independent differential testing tool that significantly
approach cannot efficiently find high numbers of unique se-                         outperforms both existing domain-specific tools as well
mantic bugs since all information on the differences each input                     as domain-independent fuzzers adapted for differential
might introduce across the tested programs is ignored. As a                         testing.
result, despite using domain-specific guided input generation,                   • We demonstrate that N EZHA is able to find multiple
existing differential testing tools are inefficient. In this paper,                 previously unknown semantic discrepancies and security
we address this issue by introducing the notion of δ-diversity                      vulnerabilities in complex real-world software like SS-
—a method for summarizing the behavioral asymmetries of                             L/TLS libraries, PDF viewers, and the ClamAV malware
the tested programs. Under δ-diversity guidance, these asym-                        detector.
metries can be expressed in different ways, examining each                       The rest of the paper is organized as follows. We provide
individual program’s behavior in either a black-box (based on                 a high-level overview of our techniques with a motivating
program log/warning/error messages, program outputs, etc.) or                 example in Section II. Section III details our methodology.
gray-box (e.g., program paths taken during execution) manner.                 We describe the design and implementation of N EZHA in
   The main difference between our approach and prior dif-                    Section IV and present the evaluation results of our system
ferential testing tools is that we generalize the tracking of                 in Section V. We highlight selected case studies of the bugs
guidance information across all tested programs, examining                    N EZHA found in Section VI. Finally, we discuss related work
their behaviors relative to each other, not in isolation, for                 in Section VII, future work in Section VIII, and conclude in
guided input generation. For example, if two test programs                    Section X.
execute paths p1 and p2 , respectively, for the same input, a "δ-
diversity-aware" representation of the execution will consist of                                      II. OVERVIEW
the tuple hp1 , p2 i. Our guidance mechanism for input gener-                 A. Problem Description
ation is designed to maximize δ-diversity, i.e., the number of                   Semantic bugs are particularly dangerous for security-
such tuples. We demonstrate in Section V that our scheme is                   sensitive programs that are designed to classify inputs as either
significantly more efficient at finding semantic bugs than using              valid or invalid according to certain high-level specifications
standalone program testing techniques. We compare N EZHA                      (e.g., malware detectors parsing different file formats or SS-
with Frankencerts, Mucerts, as well as with two state-of-the-art              L/TLS libraries verifying X.509 certificates). If an input fails
fuzzers, namely AFL [66] and libFuzzer [4]. In our testing of                 to conform to these specifications, such programs typically
certificate validation using major SSL/TLS libraries, N EZHA                  communicate the failure to the user by displaying an error
finds 52 times, 27 times, and 6 times more unique semantic                    code/message. For the rest of the paper, we focus on using
bugs than Frankencerts, Mucerts, and AFL respectively.                        differential testing to discover program discrepancies in this
   N EZHA is input-format-agnostic and uses a set of initial                  setting, i.e., where at least one test program validates and ac-
seed inputs to bootstrap the input generation process. Note                   cepts an input and another program with similar functionality
that the seed files themselves do not need to trigger any                     rejects the same input as invalid. Attackers can exploit this
semantic bugs. We empirically demonstrate that NEZHA can                      class of discrepancies to mount evasion attacks on malware
efficiently detect subtle semantic differences in large, complex,             detectors. They can also compromise the security guarantees of
real-world software. In particular, we use N EZHA for testing:                SSL/TLS connections by making SSL/TLS implementations
(i) ELF and XZ file parsing in two popular command-line                       accept invalid certificates.
applications and the ClamAV malware detector, (ii) X.509
certificate validation across six major SSL/TLS libraries and                 B. A Motivating Example
(iii) PDF parsing/rendering in three popular PDF viewers.                        To demonstrate the basic principles of our approach, let
N EZHA discovered 778 distinct discrepancies across all tested                us consider the following example: suppose A and B are
families of applications, many of which constitute previously                 two different programs with similar functionality and that
   1 Nezha [5] is a Chinese deity commonly depicted in a “three heads and
                                                                              checkVer_A and checkVer_B are the functions validating
six arms” form. His multi-headed form is analogous to our tool, which peers   the version number of the input files used by A and B respec-
into different programs to pinpoint discrepancies.                            tively, as shown in Figure 1. Both of these functions return
                                                                        for checkVer_A as shown in Figure 1). We illustrate how
     1 int checkVer_A(int v) {         1 int checkVer_B(int v) {
     2   if (v % 2 != 0)               2   if (v < 3 || v > 7)          this information can be collectively tracked across multiple
     3     return -1;                  3     return -2;                 programs revisiting the example of Figure 1.
     4   if (v < 1 || v > 7)           4   if (v % 2 != 0)
     5     return -2;                  5     return -1;                    Suppose that our initial corpus of test files (seed corpus)
     6   return 0;                     6   return 0;
     7 }                               7 }                              consists of three input files, with versions 7, 0, and 1 (I0 =
                                                                        {7, 0, 1}). We randomly extract one input from I0 to start
        v % 2 != 0
                       A1     return
                                       v < 3 || v > 7
                                                         B1    return   our testing: suppose the input with v=7 is selected and then
                       true     −1                      true     −2
                                                                        passed to both checkVer_A and checkVer_B. As shown
         A3 false                         B3 false                      in Table I, the execution paths for programs A and B (i.e.,
                        A2    return                     B2    return
                                                                        the sequence of unique edges accessed during the execution
      v < 1 || v > 7                     v % 2 != 0
                       true     −2                      true     −1     of each program) are {A1 } and {B3 , B2 } respectively. The
         A4 false                         B4 false
                                                                        number of edges covered in each program is thus 1 and
                                                                        2 for A and B respectively, whereas the coverage achieved
          return                           return
            0                                0
                                                                        across both programs is 1 + 2 = 3. One may drive the
                       checkVer_A                       checkVer_B      input generation process favoring the mutation of inputs that
                                                                        increase coverage (i.e., exercise previously unexplored edges).
Fig. 1: (Top) Simplified example of a semantic discrepancy and          Since v=7 increased the code coverage, it is added to the
(Bottom) the corresponding simplified Control Flow Graphs.              corpus that will be used for the next generation: I1 = {7}.
                                                                        In the following stage of the testing, we pick any remaining
                                                                        inputs from the current corpus and pass them to programs
0 to indicate a valid version number or a negative number               A and B. Selecting v=0 as the next input will also increase
(−1 or −2) to indicate an error. While almost identical, the            coverage, since execution touches three previously-unseen
two programs have a subtle discrepancy in their validation              edges (A3 , A2 and B1 ), and thus the file is picked for further
behavior. In particular, checkVer_A accepts an input of v=2             mutations: I1 = {7, 0}. At this stage, the only input of I0 that
as valid while checkVer_B rejects it with an error code of              has not been executed is v=1. This input’s execution does
-2.                                                                     not increase coverage, since both edges A1 and B1 have been
   The above example, albeit simplified, is similar to the              visited again, and thus v=1 is not added to I1 and will not be
semantic bugs found in deployed, real-world applications.               considered for future mutations. However, we notice that v=1,
This leads us to the following research question: how can               with a single increment mutation, could be transformed to an
N EZHA efficiently generate test inputs that demonstrate dis-           input that would disclose the discrepancy between programs A
crepancies between similar programs? Our key intuition is               and B, had it not been discarded. This example demonstrates
that simultaneously testing multiple programs on the same               that simply maximizing edge-coverage often misses interesting
input offers a wide range of information that can be used               inputs that may trigger semantic bugs. By contrast, had we
to compare the tested programs’ behaviors relative to each              tracked the δ-diversity using path tuples across past iterations,
other. Such examples include error messages, debug logs,                input v=1 would invoke the path tuple h{A1 }, {B1 }i, which,
rendered outputs, return values, observed execution paths of            as a pair/combination, would have not been seen before. Thus,
each program, etc. Semantic discrepancies across programs               using a path δ-diversity state, instead of code coverage, results
are more likely for the inputs that cause relative variations of        in v=1 been considered for further mutations. As seen in
features like the above across multiple test programs. Adopting         Table I, the mutated input v=2 uncovers the semantic bug.
an evolutionary algorithm approach, N EZHA begins with a                   2) Scenario 2: Black-box Guidance: If program instrumen-
corpus of seed inputs, applies mutations to each input in the           tation or binary rewriting are not feasible options, we may
corpus, and then selects the best-performing inputs for further         still adapt the notion of program diversity to a black-box
mutations. The fitness of a given input is determined based on          setting. The key intuition is, again, to look for previously
the diversity it introduces in the observed behaviors across the        unseen patterns across the observed outputs of the tested
tested programs. N EZHA builds upon this notion of differential         programs. Depending on the context of the application being
diversity, utilizing two different δ-diversity guidance engines,        tested, available outputs may vary greatly. For instance, a
one black-box and one-gray box.                                         malware detector may only provide one bit of information
   1) Scenario 1: Gray-box Guidance: If program instrumen-              based on whether some input file contains a malware or not,
tation is a feasible option, we can collect detailed runtime            whereas other applications may offer richer sets of outputs
execution information from the test programs, for each input.           such as graphical content, error or debug messages, values
For instance, knowledge of the portions of the Control Flow             returned to the executing shell, exceptions, etc. In the context
Graph (CFG) that are accessed during each program execution,            of differential testing, the outputs of a single application A
can guide us into only mutating the inputs that are likely              can be used as a reference against the outputs of all other
to visit new edges in the CFG. An edge in a CFG exists                  applications being tested. For example, if browsers A, B, and C
between two basic blocks if control may flow from one basic             are differentially tested, one may use browser A as a reference
block to the other (e.g., A1 is an edge in the simplified CFG           and then examine the contents of different portions of the
                                  Execution Paths                                                              Add to Corpus           Report Bug
Generation Mutation Input           A           B               Path Tuple           δ -diversity State     Coverage δ -diversity Coverage δ -diversity
   seed          -       7        {A1 }    { B3 , B2 }   P1 = h{A1 }, {B3 , B2 }i          {P1 }               3          3           7          7
   seed          -       0      {A3 , A2 }    { B1 }     P2 = h{A3 , A2 }, {B1 }i       {P1 , P2 }             3          3           7          7
   seed          -       1        {A1 }       { B1 }     P3 = h{A1 }, {B1 }i          {P1 , P2 , P3 }          7          3           7          7
     1      increment    2      {A3 , A4 }    { B1 }     P4 = h{A3 , A4 }, {B1 }i    {P1 , P2 , P3 , P4 }      -          3           -          3

TABLE I: A semantic bug that is missed by differential testing using code coverage but can be detected by N EZHA’s path
δ-diversity (gray-box) during testing of the examples shown in Figure 1. N EZHA’s black-box δ-diversity input generation
scheme (not shown in this example) would also have found the semantic bug.


rendered Web pages with respect to A, using an arbitrary                     Algorithm 1 DiffTest: Report all discrepancies across appli-
number of values for the encoding (different values may                      cations A after n generations, starting from a corpus I
denote a mismatch in the CSS or HTML rendering etc.).                         1: procedure D IFF T EST(I, A, n, GlobalState)
   Regardless of the output formulation, however, for each                    2:    discrepancies = ∅ ;reported discrepancies
input used during testing, N EZHA may receive a corresponding                 3:    while generation ≤ n do
                                                                              4:       input = R ANDOM C HOICE(I)
set of output values and then only select the inputs that result              5:       mut_input = M UTATE(input)
in new output tuples for further mutations. In the context of the             6:       generation_paths = ∅
example of Figure 1, let us assume that the outputs passed to                 7:       generation_outputs = ∅
N EZHA are the values returned by routines checkVer_A and                     8:       for app ∈ A do
checkVer_B. If inputs 0, 7, and 1 are passed to programs                      9:           app_path, app_outputs = RUN(app, mut_input)
                                                                             10:           geneneration_paths ∪ = {app_path}
A and B, N EZHA will update its internal state with all unique               11:           geneneration_outputs ∪ = {app_outputs}
output tuples seen so far: {h−1, −1i, h−2, −2i, h−1, −2i}.                   12:       end for
Any new input which will result in a previously unseen tuple                 13:       if N EW PATTERN(generation_paths,
will be considered for future mutations, otherwise it will                                                generation_outputs,
be discarded (e.g., with the aforementioned output tuple set,                                             GlobalState) then
                                                                             14:             I ← I ∪ mut_input
input 2 resulting in tuple h0, −2i would be considered for                   15:        end if
future mutations, but input 9 resulting in h−1, −2i would be                 16:        if I S D ISCREPANCY(generation_outputs) then
discarded).                                                                  17:             discrepancies ∪ = mut_input
                                                                             18:        end if
                        III. M ETHODOLOGY                                    19:        generation = generation + 1
                                                                             20:    end while
   In each testing session, N EZHA observes the relative be-                 21:    return discrepancies
havioral differences across all tested programs to maximize                  22: end procedure
the number of reported semantic bugs. To do so, N EZHA
uses Evolutionary Testing (ET) [53], inferring correlations
between the inputs passed to the tested applications and their
observed behavioral asymmetries, and, subsequently, refines                     We present N EZHA’s core engine in Algorithm 1. In each
the input generation, favoring more promising inputs. Contrary               testing session, N EZHA examines if different inputs result in
to existing differential testing schemes that drive their input              previously unseen relative execution patterns across the tested
generation using monolithic metrics such as the code coverage                programs. N EZHA starts from a set of initial seed inputs I, and
that is maximized across some or all of the tested programs,                 performs testing on a set of programs A for a fixed number of
N EZHA utilizes the novel concept of δ-diversity: metrics that               generations (n). In each generation, N EZHA randomly selects
preserve the differential diversity (δ-diversity) of the tested              (line 4) and mutates (line 5) one input (individual) out of the
applications will perform better at finding semantic bugs than               population I, and tests it against each of the programs in A.
metrics that overlook relative asymmetries in the applications’              The recorded execution paths and outputs for each application
execution. The motivation behind δ-diversity becomes clearer                 are added to the sets of total paths and outputs observed during
if we examine the following example. Suppose we are per-                     the current generation (lines 8-12). Subsequently, if N EZHA
forming differential testing between applications A and B.                   determines that a new execution pattern is observed during this
Now, suppose an input I1 results in a combined coverage                      input execution, it adds the respective input to the input corpus,
C across A and B, exercising 30% of the CFG edges in A                       which will be used to produce the upcoming generation (lines
and 10% of the edges in B. A different input I2 , that results               13-14). Finally, if there is a discrepancy in the outputs of
in the same overall coverage C, however exercising 10% of                    the tested applications, N EZHA adds the respective input to
the edges in A and 28% of the edges of B, would not be                       the set of total discrepancies found (lines 16-18). Whether a
explored further under monolithic schemes, despite the fact                  discrepancy is observed in each generation depends on the
that it exhibits much different behavior in each application                 outputs of the tested programs: if at least one application
compared to input I1 .                                                       rejects an input and at least one other accepts it, a discrepancy
is logged.                                                                  consisting of all unique edges of pathp,i . Thus path_setp,i
                                                                            contains no duplicate edges, but instead holds only the
A. Guidance Engines                                                         CFG edges of p that have been accessed at least once
   In Algorithm 1, we demonstrated that N EZHA adds an input                during the execution. Given a set of programs P, the
to the active corpus only if that input exhibits a newly seen               (fine) path diversity of input i across P is the tuple
pattern. In traditional evolutionary algorithms, the fitness of             P DP,i = hpath_setp1 ,i , path_setp2 ,i , ..., path_setp|P| ,i i. Es-
an individual for producing future generations is determined                sentially, P DP,i acts as a "fingerprint" of the execution of
by its fitness score. In this section, we explain how δ-diversity           input i across all tested programs and encapsulates relative
can be used in N EZHA’s guidance engines, both in a gray-box                differences in the execution paths across applications. For an
and a black-box setting.                                                    entire testing session, starting from an initial input corpus I,
   1) Gray-box guidance: The most prevalent guidance mech-                  the (fine) path δ-diversity achieved is the cardinality
                                                                                                                              S         of the set
anism in gray-box testing frameworks is the code coverage                   containing all the above tuples: P DF ine = | i∈I {P DP,i }|.
achieved by individual inputs across the sets of tested applica-               To demonstrate how the above metrics can lead to different
tions. Code coverage can be measured using function coverage                discrepancies, let us consider a differential testing session
(i.e., the functions accessed in one execution run), basic                  involving two programs A and B. Let An , Bn denote edges
block coverage or edge coverage. However, as discussed in                   in the CFG of A and B, respectively, and let us assume that a
Section II, this technique is not well suited for finding semantic          given test input causes the paths hA1 , A2 , A1 i and hB1 i to be
bugs. By contrast, N EZHA leverages relative asymmetries                    exercised in A and B respectively. At this point, P DCoarse =
of the executed program paths to introduce two novel δ-                     {h3, 1i}, and P DF ine = {h{A1 , A2 }, {B1 }i}. Suppose we
diversity path selection guidance engines, suitable for efficient           mutate the current input, and the second (mutated) input now
differential testing.                                                       exercises paths hA1 , A2 i and hB1 i across the two applications.
   Suppose a program p is executing under an input i. We                    After the execution of this second input, P DF ine remains
call the sequence of edges accessed during this execution the               unchanged, because the tuple h{A1 , A2 }, {B1 }i is already in
execution path of p under i, denoted by pathp,i . Tracking                  the P DF ine set. Conversely, P DCoarse will be updated to
all executed paths (i.e., all the sequences of edges accessed in            P DCoarse = {h3, 1i, h2, 1i}. Therefore, the new input will be
the CFG) is impractical for large-scale applications containing             considered for further mutation under a coarse path guidance,
multiple loops and complex function invocations. In order                   since it increased the cardinality of the P DCoarse set, however
to avoid this explosion in tracked states, N EZHA’s gray-box                it will be rejected under fine δ-diversity guidance. Finally, note
guidance uses two different approximations of the execution                 that if we use total edge coverage as our metric for input
paths, one of coarse granularity and the other offering finer               selection, both the first and second inputs result in the same
tracking of the relative execution paths.                                   code coverage of 3 edges (two unique edges for A plus one
   Path δ-diversity (coarse): Given a set of programs P                     edge for B). Thus, under a coverage-guided engine, the second
that are executing under an input i, let P CP,i be the Path                 input will be rejected as it does not increase code coverage,
Cardinality tuple h|pathp1 ,i |, |pathp2 ,i |, ..., |pathp|P| ,i |i. Each   despite the fact that it executes in a manner that has not been
P CP,i entry represents the total number of edges accessed                  previously observed across the two applications.
in each program pk ∈ P, for one single input i. Notice                         2) Black-box guidance: As mentioned in Section II-B2,
that P CP,i differs from the total coverage achieved in the                 N EZHA’s input generation can be driven in a black-box manner
execution of programs P under i, in the sense that P CP,i does              using any observable and countable program output, such
not maintain a global, monolithic score, but a per-application              as error/debug messages, rendered or parsed outputs, return
count of the edges accessed, when each program is executing                 values etc. For many applications, especially those implement-
under input i. Throughout an entire testing session, starting               ing particular protocols or RFCs, such outputs often uniquely
from an initial input corpus I, the overall (coarse) path δ-                identify deterministic execution patterns. For example, when a
diversity achieved is the cardinality
                                    S of the set containing all             family of similar programs returns different error codes/mes-
the above tuples: P DCoarse = | i∈I {P CP,i }|.                             sages, any change in one test program’s returned error relative
   This representation expresses the maximum number of                      to the error codes returned by the other programs is highly
unique path cardinality tuples for all programs in P that                   indicative of the relative behavioral differences between them.
have been seen throughout the session. However, we notice                   Such output asymmetries can be used to guide N EZHA’s path
that, although the above formulation offers a semantically                  selection.
richer representation of the execution, compared to total edge                 Output δ-diversity: Let p be a program which, given an
coverage, it constitutes a coarse approximation of the (real)               input i, produces an output op,i . We define the output diversity
execution paths. A finer-grained representation of the execu-               of a family of programs P, executing with a single input
tion can be achieved if we take into account which edges,                   i, as the tuple ODP,i = hop1 ,i , op2 ,i , ..., op|P| ,i i. Across a
specifically, have been accessed.                                           testing session that starts from an input corpus I, output δ-
   Path δ-diversity (fine): Consider the path pathp,i , which               diversity tracks the number of unique output tuples that are
holds all edges accessed during an execution of each pro-                   observed throughout S   the execution of inputs i ∈ I across
gram pk ∈ P under input i. Let path_setp,i be the set                       all programs in P: | i∈I {ODP,i }|. Input generation based
on output δ-diversity aims to drive the tested applications to      Algorithm 3 N EZHA path selection routines
result in as many different output combinations across the           1: ; Path δ-diversity (coarse)
overall pool of programs, as possible. This metric requires          2: ; @generation_paths: paths for each tested app for current input
no knowledge about the internals of each application and is          3: ; @GS: GlobalState (bookkeeping of paths, scores etc.)
                                                                     4: procedure PDC OARSE(generation_paths, GS)
completely black-box. As a result, it can even be applied on         5:     path_card = ∅
applications running on a remote server or in cases were binary      6:     for path in generation_paths do
rewriting or instrumentation is infeasible. We demonstrate in        7:         path_card ∪ = {|path|}
Section V that this metric performs equally well as N EZHA’s         8:     end for
gray-box engines for programs that support fine-grained error        9:     ; See if the path_card tuple has been seen before:
                                                                    10:     ; check against stored tuples in the GlobalState
values.                                                             11:     new_card_tuple = {hpath_cardi} \ GS.P DC_tuples
                                                                    12:     if new_card_tuple 6= ∅ then
Algorithm 2 Determine if a new pattern has been observed            13:         ; If new, add to GlobalState and update score
 1: procedure N EW PATTERN(gen_paths,                               14:         GS.P DC_tuples ∪ = new_card_tuple
                             gen_outputs,                           15:         GlobalState.P DC_Score = |GS.P DC_tuples|
                             GlobalState)                           16:         return true
 2:    IsN ew =false                                                17:     end if
 3:    if GlobalState.U seP DCoarse then                            18:     return false
 4:        IsN ew | = PDC OARSE(gen_paths, GlobalState)             19: end procedure
 5:    end if
 6:    if GlobalState.U seP DF ine then                             20: ; Path δ-diversity (fine)
 7:        IsN ew | = PDF INE(gen_paths, GlobalState)               21: procedure PDF INE(generation_paths, GS)
 8:    end if                                                       22:     path_set = ∅
 9:    if GlobalState.U seOD then                                   23:     for path in generation_paths do
10:        IsN ew | = OD(gen_outputs, GlobalState)                  24:         path_set ∪ = {path}
11:    end if                                                       25:     end for
12:    return IsNew                                                 26:     new_paths = {hpath_seti} \ GS.P DF _tuples
13: end procedure                                                   27:     if new_path_tuple 6= ∅ then
                                                                    28:         GS.P DF _tuples ∪ = new_path_tuple
                                                                    29:         GlobalState.P DF _Score = |GS.P DF _tuples|
   As described in Algorithm 1, whenever a set of applications      30:         return true
                                                                    31:     end if
is tested under N EZHA, a mutated input that results in a           32:     return false
previously unseen pattern (Algorithm 1 - lines 13-15) is added      33: end procedure
to the active input corpus to be used in future mutations.
Procedure NewPattern is called for each input (at every             34: ; Output δ-diversity
generation), after all tested applications have executed, to        35: procedure OD(generation_outputs, GS)
                                                                    36:    new_output_tuple = {houtput_tuplei} \ GS.OD_tuples
determine if the input exhibits a newly observed behavior and       37:    if new_output_tuple 6= ∅ then
should be added in the current corpus. The pseudocode for           38:        GS.OD_tuples ∪ = new_output_tuple
the routine is described in Algorithm 2: for each of the active     39:        GlobalState.OD_Score = |GS.OD_tuples|
guidance engines in use, N EZHA calls the respective routine        40:        return true
listed in Algorithm 3 and, if the path δ-diversity and output δ-    41:    end if
                                                                    42:    return false
diversity is increased for each of the modes respectively (i.e.,    43: end procedure
the input results in a discovery of a previously unseen tuple),
the mutated input is added to the current corpus.
                                                                    discrepancies, N EZHA performs a bucketing of reported differ-
B. Automated Debugging                                              ences using the return values of the tested programs. Moreover,
   N EZHA is designed to efficiently detect discrepancies across    it reports the file similarity of reported discrepancies using
similar programs. However, the larger the number of reported        context-triggered piece-wise fuzzy hashing [45]. Automated
discrepancies and the larger the number of tested applications,     debugging and bug localization in the context of differential
the harder it is to identify unique discrepancies and to localize   testing is not trivial. Future additions in the current N EZHA
the root cause of each report. To aid bug localization, N EZHA      design, as well as limitations of existing techniques are dis-
stores each mutated input in its original form throughout the       cussed further in Section VIII.
execution of each generation. N EZHA compares any input                    IV. S YSTEM D ESIGN AND I MPLEMENTATION
that caused a discrepancy with its corresponding stored copy
(before the mutation occurred), and logs the difference be-         A. Architecture Overview
tween the two. As this input pair differs only on the part that       We present N EZHA’s architecture in Figure 2. N EZHA
introduced the discrepancy, the two inputs can subsequently         consists of two main components: its core engine and runtime
be used for delta-debugging [67] to pinpoint the root cause         components. The runtime component collects all information
of the difference. Finally, to aid manual analysis of reported      necessary for N EZHA’s δ-diversity guidance and subsequently
                                     Application Address Space                                 NEZHA Engine
                                                                                                                    8
                                                      NEZHA Runtime                                                             Input corpus
                                                                                                UpdateDiff
  Instrumentation
                          Program 1                Dynamic         Program                                              1
       Module               Program 1
                              Programs
                                                  Coverage          Return
                           (Instrumented)                                                         RunOne
                                                 Information        Values
                                                                                                                            Tested Applications
                                                                                                                    2
                                                                                       7                                    NEZHA_TestStart
   Program 1
    Program  1
      Programs                                                                              LLVMTestOneInput                                      4
      (Original)             Differential Execution               Discrepancy                                           3    Process_i (Data)
                                                                    Logging
                                                                                            LLVMFuzzerNezhaPaths
                                                                                                                                                  5
                                                                                                                    6        NEZHA_TestEnd
                                Input Mutation                   NEZHA Core                LLVMFuzzerNezhaOutputs
         Initial
         Seeds
                                                               Guidance
                                                               Engines
                               Corpus Refinement
                                                                                           libFuzzer backend                NEZHA components
     Input Corpora

                                                                                Fig. 3: Example of how an input is processed through N EZHA.
                     Fig. 2: System architecture.
                                                                                fuzzer or differential testing engine, whether black-box or
passes it to the core engine. The core engine then generates                    white-box/gray-box. Our choice of extending libFuzzer is due
new inputs through mutations, and updates the input corpus                      to its large adoption, as well as its modularity, which allows for
based on its δ-diversity guidance.                                              a real-world evaluation of N EZHA’s δ-diversity with a state-
   We implemented N EZHA using Clang v3.8. Our implemen-                        of-the-art code coverage-based framework.
tation consists of a total of 1545 lines of C++ code, of which                     LibFuzzer provides API support for custom input mutations,
1145 and 400 lines correspond to N EZHA’s core and runtime                      however it is not designed for differential testing nor does it
components, respectively.                                                       support modifications of its internal structures. With respect to
                                                                                mutations, we do not customize libFuzzer’s engine so that we
B. Instrumentation                                                              can achieve a fair comparison of N EZHA’s δ-diversity with
   To enable N EZHA’s gray-box guidance, the test programs                      the default coverage-based guidance of the fuzzer, keeping
must be instrumented to gather information on the paths                         all other components intact. Instead, N EZHA uses libFuzzer’s
executed for each test input. This can be achieved either                       built-in engine to apply up to a maximum of five of the
during compilation, using dynamic binary instrumentation, or                    following mutation operators in random order: i) create a new
using binary rewriting. For our prototype, we instrument pro-                   input by combining random substrings from different inputs,
grams at compile-time, using Clang’s SanitizerCoverage [6].                     ii) add/remove an existing byte from an input, iii) randomize
SanitizerCoverage can be combined with one or more of                           a bit/byte in the input, iv) randomly change the order of a
Clang’s sanitizers, namely AddressSanitizer (ASAN) [57], Un-                    subset of the input bytes and, v) only randomize the bytes
definedBehaviorSanitizer (UBSAN) [8], and MemorySanitizer                       whose value corresponds to the ASCII code of a digit character
(MSAN) [60], to achieve memory error detection during test-                     (i.e., 0x30-0x39). Finally, besides adding support for N EZHA’s
ing. In our implementation, we instrument the test programs                     δ-diversity to libFuzzer, we also extend its guidance engines
with Clang’s ASAN to reap the benefit of finding potential                      to support (global) code coverage guidance in the context of
memory corruption bugs in addition to discrepancies with a                      differential testing. As we will demonstrate in Section V, δ-
nominal overhead. We note that ASAN is not strictly required                    diversity outperforms code coverage, even when the latter is
for us to find discrepancies in our experiments.                                applied across all tested applications.
                                                                                   A N EZHA-instrumented program can be executed using
C. N EZHA Core Engine and Runtime                                               any of N EZHA’s guidance engines, as long as the binary
   N EZHA’s core engine is responsible for driving the input                    is invoked with the appropriate runtime flags. In libFuzzer,
generation process using the guidance engines described in                      customized test program invocation is achieved overriding
Section III-A. We implement the core N EZHA engine by                           the LLVMFuzzerTestOneInput function. We override
adapting and modifying libFuzzer [4], a popular coverage-                       this function to load N EZHA into a main driver program,
guided evolutionary fuzzer that has been successful in finding                  which then performs the differential testing across all ex-
large numbers of non-semantic bugs in numerous large-scale,                     amined applications. We also extend libFuzzer with two
real-world software. libFuzzer primarily focuses on library                     additional API calls, LLVMFuzzerNezhaOutputs and
fuzzing, however it can be adapted to fuzz whole applications,                  LLVMFuzzerNezhaPaths that provide interfaces for pass-
passing the path and output information needed to guide                         ing output values and path execution information between the
the generation of inputs as parameters to the main engine.                      core N EZHA engine and the N EZHA library running as part of
N EZHA’s δ-diversity engine is independent of the underlying                    the tested programs. Finally, the N EZHA runtime uses two API
testing framework, and can be applied as-is to any existing                     calls, namely N E Z H A _TestStart and N E Z H A _TestEnd,
that the core engine can use to perform per-program ap-               these, we sampled certificates to construct 100 distinct groups
propriate initialization and cleanup operations respectively          of 1000 certificates each. Initially, no certificate in any of the
(allocation and deallocation of buffers holding path and output       initial 100 groups introduced a discrepancy between the tested
information throughout the execution etc.).                           applications thus all reported discrepancies in our results are
   In Figure 3, we present an example of how an in-                   introduced solely due to the differential testing of the examined
put is used by N EZHA and how the various components                  frameworks.
interoperate. Assume that the N EZHA engine begins by                    ELF and XZ parsing: We evaluate N EZHA on parsers
selecting an input from the corpus at Step 1 . It then                of two popular file formats, namely the ELF and the XZ
mutates the input and dispatches it to the tested pro-                formats. For parsing of ELF files, we compare the parsing im-
grams through LLVMFuzzerTestOneInput at Step 2 .                      plementations in the ClamAV malware detector with that of the
At Step 3 , the N EZHA library initializes all its bookkeep-          binutils package, which is ubiquitous across Unix/Linux
ing data structures for each of the invoked applications via          systems. In each testing session, N EZHA loads a file and
the NEZHA_TestStart call, and subsequently invokes the                validates it using ClamAV and binutils (the respective
program-specific functionality under test at Step 4 . Upon            validation libraries are libclamav and libbfd), and either
completion, N EZHA deinitializes temporary bookkeeping data           reports it as a valid ELF binary or returns an appropriate error
at Step 5 . The runtime execution information is dispatched           code. Both programs, including all their exported libraries,
back to the N EZHA engine through the designated API invo-            are instrumented to work with N EZHA and are differentially
cations at Step 6 . Finally, at Step 7 , the δ-diversity engine       tested for a total of 10 million generations. In our experiments,
in use determines if the input will be added to the corpus            we use ClamAV 0.99.2 and binutils v.2.26-1-1_all. Our
for further testing. If so, the input is added to the corpus at       seed corpus consists of 1000 Unix malware files sampled from
Step 8 .                                                              VirusShare [9] and a plain ‘hello world’ program.
                                                                         Similar to the setup for ELF parsing, we compare the
                          V. E VALUATION                              XZ parsing logic of ClamAV and XZ Utils [19], the default
   In this section, we assess the effectiveness of N EZHA both in     Linux/Unix command-line decompression tool for XZ archive
terms of finding discrepancies in security-critical, real-world       files. The respective versions of the tested programs are
software, as well as in terms of its core engine’s efficiency         ClamAV 0.99.2 and xzutils v5.2.2. Our XZ seed corpus
compared to other differential testing tools. In particular,          uses the XZ files from the XZ Utils test suite (a total of 74
we evaluate N EZHA by differentially testing six major SSL            archives) and both applications are differentially tested for a
libraries, file format parsers, and PDF viewers. We also com-         total of 10 million generations.
pare N EZHA against two domain-specific differential testing             PDF Viewers: We evaluate N EZHA on three popular PDF
engines, namely Frankencerts [24] and Mucerts [32], and two           viewers, namely the Evince (v3.22.1), MuPDF (v1.9a) and
state-of-the-art domain-agnostic guided mutational fuzzers:           Xpdf (v3.04) viewers. Our pool of tested inputs consists of
American Fuzzy Lop (AFL) [66], and libFuzzer [4]. Our                 the PDFs included in the Isartor [3] testsuite. All applications
evaluation aims at answering the following research questions:        are differentially tested for a total of 10 million generations.
1) is N EZHA effective at finding semantic bugs? 2) does it           During testing, N EZHA forks a new process for each tested
perform better than domain-specific testing engines? 3) does it       program, invokes the respective binary through execlp, and
perform better than domain-agnostic coverage-guided fuzzers?          uses the return values returned by the execution to the parent
4) what are the benefits and limitations of each of N EZHA’s          process to guide the input generation using its output δ-
δ-diversity engines?                                                  diversity. Determined based on the return values of the tested
                                                                      programs, the discrepancies constitute a conservative estimate
A. Experimental Setup                                                 of the total discrepancies, because while the return values of
   X.509 certificate validation: We examine six major SSL             the respective programs may match, the rendered PDFs may
libraries, namely OpenSSL (v1.0.2h), LibreSSL (v2.4.0), Bor-          differ.
ingSSL (f0451ca2 ), wolfSSL (v3.9.6), mbedTLS (v2.2.1) and               All our measurements were performed on a system run-
GnuTLS (v3.5.0). Each of the SSL/TLS libraries is instru-             ning Debian GNU/Linux 4.5.5-1 while our implementation of
mented with SanitizerCoverage and AdressSanitizer so that             N EZHA was tested using Clang version 3.8.
N EZHA has access to the programs’ path and output informa-
tion. For each library, N EZHA invokes its built-in certificate       Q1: How effective is N EZHA in discovering discrepancies?
validation routines and compares the respective error codes: if
at least one library returns an error code on a given certificate        The results of our analysis with respect to the discrepancies
whereas another library accepts the same certificate, this is         and memory errors found are summarized in Table II. N EZHA
counted as a discrepancy.                                             found 778 validation discrepancies and 8 memory errors in
   For our experiments, our pool of seed inputs consists of           total. Each of the reported discrepancies corresponds to a
205,853 DER certificate chains scraped from the Web. Out of           unique tuple of error codes, where at least one application
                                                                      accepts an input and at least another application rejects it.
  2 This refers to a git commit hash from BoringSSL’s master branch   Examples of semantic bugs found are presented in Section VI.
            Type        SSL Certificate XZ Archive ELF Binary PDF File    particular, five of them were crashes due to invalid memory
   Discrepancies             764           5           2         7        accesses (four cases in wolfSSL and one in GnuTLS), one
Errors & Crashes              6            2           0         0        was a memory leak in GnuTLS and two were use-after-free
   TABLE II: Result summary for our analysis of N EZHA.                   bugs in ClamAV. As N EZHA’s primary goal is to find semantic
                                                                          bugs (not memory corruption issues), we do not describe them
                                                                          in detail here. Interested readers can find further details in
   We observe that, out of the total 778 discrepancies, 764               Section XI-A of the Appendix.
were reported during our evaluation of the tested SSL/TLS                 Q2: How does N EZHA perform compared to domain-specific
libraries. The disproportionately large number of discrepancies           differential testing frameworks like Frankencerts and Mucerts?
found for SSL/TLS is attributed to the fine granularity of
the error codes returned by these libraries, as well as to the               One may argue that being domain-independent, N EZHA
larger number of applications being tested (six applications for          may not be as efficient as successful domain-specific frame-
SSL/TLS versus three for PDF and two for ELF/XZ).                         works. To address this concern, we compared N EZHA against
   To provide an insight into the impact that the number of               Frankencerts [24], a popular black-box unguided differential
tested programs has over the total reported discrepancies, we             testing framework for SSL/TLS certificate validation, as well
measure the total discrepancies observed between every pair               as Mucerts [32], which builds on top of Frankencerts per-
of the six SSL/TLS libraries. In the pair-wise comparison of              forming Markov Chain Monte Carlo (MCMC) sampling to
Table III, two different return-value tuples that have the same           diversify certificates using coverage information. Frankencerts
error codes for libraries A and B are not counted twice for the           generates mutated certificates by randomly combining X.509
(A, B) pair (i.e., we regard the output tuples h0, 1, 2, 2, 2, 2i         certificate fields that are decomposed from a corpus of seed
and h0, 1, 3, 3, 3, 3i as one pairwise discrepancy with respect           certificates. Despite its unguided nature, Frankencerts suc-
to the first two libraries). We observe that even in cases of             cessfully uncovered a multitude of bugs in various SSL/TLS
very similar code bases (e.g., OpenSSL and LibreSSL which                 libraries. Mucerts adapt many of Frankencerts core compo-
are forks of the same code base), N EZHA successfully reports             nents but also stochastically optimize the certificate generation
multiple unique discrepancies.                                            process based on the coverage each input achieves in a
                                                                          single application (OpenSSL). Once the certificates have been
                                                                          generated from this single program, they are used as inputs to
              LibreSSL       BoringSSL    wolfSSL    mbedTLS     GnuTLS
                                                                          differentially test all SSL/TLS libraries.
 OpenSSL           10              1           8           33        25      To make a fair comparison between N EZHA, Frankencerts,
 LibreSSL          -               11          8           19        19   and Mucerts, we ensure that all tools are given the same sets
BoringSSL          -               -           8           33        25   of input seeds. Furthermore, since Frankencerts is a black-
  wolfSSL          -               -           -           6         8    box tool, we restrict N EZHA to only use its black-box output
 mbedTLS           -               -           -           -         31   δ-diversity guidance, across all experiments.
                                                                             Since the input generation is stochastic in nature due to the
TABLE III: Number of unique pairwise discrepancies between                random mutations, we perform our experiments with multiple
different SSL libraries. Note that the input generation is still          runs to obtain statistically sound results. In particular, for each
guided using all of the tested SSL/TLS libraries.                         of the input groups of certificates we created (100 groups
                                                                          of 1000 certificates each), we generate 100, 000 certificate
  The results presented in Table II are new reports and                   chains using Frankencerts, resulting in a total of 10 million
not reproductions of existing ones. They include multiple                 Frankencerts-generated chains. Likewise, passing as input each
confirmed, previously unknown semantic errors. Moreover,                  of the above 100 corpuses, we run N EZHA for 100, 000
N EZHA was more efficient at reporting discrepancies than all             generations (resulting in 10 million N EZHA-executed inputs).
guided or unguided frameworks we compared it against (see                 Mucerts also start from the same sets of inputs and execute in
Q2 & Q3 for further details on this analysis). We present some            mode 2, which according to [32] yields the most discrepancies
examples of semantic bugs that have already been identified               with highest precision. We use the return value tuples of
and patched by the respective software development teams in               the respective programs to identify unique discrepancies (i.e.,
Section VI.                                                               unique tuples of return values seen during testing).
                                                                             We present the relative number and distribution of dis-
   Result 1: N EZHA reported 778 previously unknown dis-                  crepancies found across Frankencerts, Mucerts and N EZHA
   crepancies (including confirmed security vulnerabilities               in Figures 4 and 5. Overall, N EZHA reported 521 unique
   and semantic errors), in total, across all the applications            discrepancies, compared to 10 and 19 distinct discrepancies
   we tested, even when the latter shared similar code bases.             for Frankencerts and Mucerts respectively. N EZHA reports 52
                                                                          times and 27 times more discrepancies than Frankencerts and
   In addition to finding semantic bugs, N EZHA was equally               Mucerts respectively, starting from the same sets of initial
successful in uncovering previously unknown memory corrup-                seeds and running for the same number of iterations, achieving
tion vulnerabilities and crashes in the tested applications. In           a respective coverage increase of 15.22% and 33.48%.
                      1.0
                                                         Frankencerts
                                                         Mucerts                                           Distributions of Discrepancies Found
                      0.8                                NEZHA (Black-box)
                                                                                                                                                   Mucerts
                      0.6                                                                 Frankencerts
        Probability



                      0.4                                                                                  3                 510          4
                                                                                                                7                                15

                      0.2

                      0.00   20    40      60      80      100     120   140
                                  Number of unique discrepancies                                                     NEZHA (Black-box)

   Fig. 4: Probability of finding at least n unique discrepancies              Fig. 5: Unique discrepancies observed by Frankencerts,
   starting from the same seed corpus of 1000 certificates and                 Mucerts and N EZHA (black-box). The results are averages
   running 100, 000 iterations. The results are averages of 100                of 100 runs each starting with a different seed corpus of
   runs each starting with a different seed corpus.                            1000 certificates.


   We observe that, while both Frankencerts and Mucerts                        Q3: How does N EZHA perform compared to state-of-the
reported a much smaller number of discrepancies than N EZHA,                   art coverage-guided domain-independent fuzzers like AFL/lib-
they found 3 and 15 discrepancies respectively that were                       fuzzer?
missed by N EZHA. We posit that this is due to the differences
in their respective mutation engines. Frankencerts and Mucerts
                                                                                                    1.0
start from a corpus of certificates, break all the certificates                                                                         Stand-alone (AFL)
in the corpus into the appropriate fields (extensions, dates,                                                                           Stand-alone (libFuzzer)
                                                                                                    0.8                                 Global coverage
issuer etc.), then randomly sample and mutate those fields to                                                                           (modified libFuzzer)
merge them back together in new chains, however respecting                                                                              NEZHA (Gray-box)
                                                                                                    0.6                                 NEZHA (Black-box)
                                                                                      Probability



the semantics of each field (for instance, Frankencerts might
mutate and merge the extensions of two or three certificates to
form the extensions field of a new chain but will not substitute                                    0.4
a date field with an extension field). On the contrary, N EZHA
performs its mutations sequentially, without mixing together                                        0.2
different components of the certificates in the seed corpus, as
it does not have any knowledge of the input format.                                                 0.00       50         100          150         200        250
                                                                                                                    Number of unique discrepancies
    It is noteworthy that, despite the fact that N EZHA’s mutation              Fig. 6: Probability of finding at least n unique discrepancies
operators are domain-independent, N EZHA’s guidance mech-                       after 100, 000 executions, starting from a corpus of 1000
anism allows it to favor inputs that are mostly syntactically                   certificates. The results are averages of 100 runs each
correct. Compared to Frankencerts or Mucerts that mutate cer-                   starting from a different seed corpus of 1000 certificates.
tificates at the granularity of X.509 certificate fields, without
violating the core structure of a certificate, N EZHA still yields                None of the state-of-the-art domain-agnostic fuzzers like
more bugs. Finally, when running N EZHA’s mutation engine                      AFL natively support differential testing. However, they can
without any guidance, on the same inputs, we observe that                      be adapted for differential testing by using them to generate
no discrepancies were found. Therefore, N EZHA’s efficacy in                   inputs with a single test application and then invoking the
finding discrepancies can only be attributed to its black-box                  full set of tested applications with the generated inputs. To
δ-diversity-based guidance.                                                    differentially test our suite of six SSL/TLS libraries, we
                                                                               first generate certificates using a coverage-guided fuzzer on
  Result 2: N EZHA reports 52 times and 27 times more                          OpenSSL, and then pass these certificates to the rest of the
  discrepancies than Frankencerts and Mucerts respectively,                    SSL libraries, similar to how differential testing is performed
  per input. In terms of testing performance, N EZHA an-                       by Mucerts. The discrepancies reported across all tested SSL
  alyzes more than 400 certificates per second, compared                       libraries, if we run AFL (v. 2.35b)3 and libFuzzer on a stan-
  to 271 and 0.08 certificates per second for Frankencerts                     dalone program (OpenSSL) are reported in Figure 6. We notice
  and Mucerts respectively.
                                                                                  3 Since version 2.33b, AFL implements the explore schedule as presented
                                                                               in AFLFast [23], thus we omit comparison with the latter.
                        1.0                                                                                                   100
                                                              Global coverage
                                                              (modified libFuzzer)
                                                              Path δ-diversity (coarse)
                        0.8                                                                                                    80
                                                              Path δ-diversity (fine)
                                                              Output δ-diversity




                                                                                                      Number of Differences
                        0.6                                                                                                    60
          Probability




                        0.4                                                                                                    40

                                                                                                                                                                        Global coverage
                                                                                                                                                                        (modified libFuzzer)
                        0.2                                                                                                    20                                       Path δ-diversity (coarse)
                                                                                                                                                                        Path δ-diversity (fine)
                                                                                                                                                                        Output δ-diversity
                        0.0                                                                                                     0
                              0   50        100            150          200               250                                       0   20000           40000        60000        80000        100000
                                       Number of unique discrepancies                                                                                       Generation


   Fig. 7: Probability of finding at least n unique discrepancies                               Fig. 8: Unique discrepancies observed for each of N EZHA’s
   for each of N EZHA’s δ-diversity engines after 100, 000                                      δ-diversity engines per generation. The results are averages
   executions. The results are averages of 100 runs each                                        of 100 runs each starting from a different seed corpus of
   starting from a different seed corpus of 1000 certificates.                                  1000 certificates.


that N EZHA yields 6 times and 3.5 times more differences per                                   setting, we notice that N EZHA reports at least 57 discrepancies
tested input, on average, than AFL and libFuzzer respectively.                                  with more than 90% probability regardless of the engine used.
   This demonstrates that driving input generation with a                                       Furthermore, all δ-diversity engines report more discrepancies
single application is ill-suited for differential testing. In the                               than global coverage. Figure 8 shows the rate at which each
absence of a widely-adopted domain-agnostic differential test-                                  engine finds discrepancies during execution. We observe that
ing framework, we modified libFuzzer’s guidance engine to                                       both δ-diversity guidance engines report differences at higher
support differential testing using global code coverage. Apart                                  rates than global coverage using the same initial set of inputs.
from its guidance mechanisms, this modified libFuzzer 4 is                                         Overall throughout this experiment, N EZHA’s output δ-
identical to N EZHA in terms of all other aspects of the engine                                 diversity yielded 521 discrepancies, while path δ-diversity
(mutations, corpus minimization etc.). Even so, as shown in                                     yielded 491 discrepancies, resulting in 30% and 22.75% more
Figure 6, N EZHA still yields 30% more discrepancies per                                        discrepancies than using global code coverage to drive the
tested input. Furthermore, N EZHA also achieves 1.3% more                                       input generation (global coverage resulted in 400 unique
code coverage.                                                                                  discrepancies). With respect to the coverage of the CFG that
                                                                                                is achieved, output δ-diversity and path δ-diversity guidance
  Result 3: N EZHA finds 6 times more discrepancies than                                        achieves 1.38% and 1.21% higher coverage then global cover-
  AFL adapted to differentially test multiple applications                                      age guidance (graphs representing the coverage and population
  using a single test program for input generation.                                             increase at each generation are presented in Section XI-B).

                                                                                                                                                 Distributions of Discrepancies Found

Q4: How does the performance of N EZHA’s δ-diversity black-
box and gray-box engines compare to each other?                                                                                                   26


   To compare the performance of N EZHA’s δ-diversity en-                                                                                                                       Output δ-diversity
gines, we run N EZHA on the six SSL/TLS libraries used in                                                                                                  143                  Path δ-diversity
our previous experiments, enabling a single guidance engine                                                                                                                     Global Coverage
at a time. Before evaluating N EZHA’s δ-diversity guidance, we                                                                          4
                                                                                                                                                  348

ensured that the discrepancies reported are a result of N EZHA’s
guidance and not attributed to N EZHA’s mutations. Indeed,                                                                                  48
when we use N EZHA without any δ-diversity guidance, no
discrepancies were found across the SSL/TLS libraries.
   Figures 7 and 8 show the relative performances of dif-                                         Fig. 9: Distribution of bugs found by N EZHA’s δ-diversity
ferent δ-diversity engines in terms of the number of unique                                       engines versus N EZHA using global-coverage-based guid-
discrepancies they discovered. Figure 7 shows the probability                                     ance.
of finding at least n unique discrepancies across the six tested
SSL/TLS libraries, starting from a corpus of 1000 certificates                                     The distribution of the discrepancies reported by the dif-
and performing 100, 000 generations. For this experimental                                      ferent engines is presented in Figure 9. We notice that 348
                                                                                                discrepancies have been found by all three guidance en-
  4 Corresponding git commit is 1f0a7ed0f324a2fb43f5ad2250fba68377076622                        gines, 121 discrepancies are reported using δ-diversity and
48 discrepancies are reported by our custom libFuzzer global                              1.0
code coverage engine. This result is a clear indication that                                                                               32
                                                                                                                                           64
δ-diversity performs differently than global code coverage                                0.8                                              128
with respect to input generation, generating a broader set of                                                                              256
discrepancies for a given time budget, while exploring similar                            0.6




                                                                            Probability
portions of the application CFG (1.21% difference in coverage
for the same setup).
                                                                                          0.4
   One notable result from this experiment is that output
δ-diversity, despite being black-box, achieves equally good
                                                                                          0.2
coverage with N EZHA’s gray-box engines and even reports
more unique discrepancies. This is a very promising result as
it denotes that the internal state of an application can, in some                         0.00   20     40        60         80      100     120
cases, be adequately approximated based on its outputs alone                                          Number of unique differences
assuming that there is enough diversity in the return values.         Fig. 10: Probability of finding at least n unique discrep-
                                                                      ancies across OpenSSL, LibreSSL, and BoringSSL with
  Result 4: N EZHA’s output and path δ-diversity guidance             N EZHA running under output δ-diversity, for varying num-
  finds 30% and 22.75% more discrepancies, respectively,              bers of error codes, after 100, 000 executions (average of
  than N EZHA using global-coverage-based guidance.                   100 runs, starting from a different seed corpus of 1000
                                                                      certificates in each run).
   However, we expect that output δ-diversity will perform
worse for applications for which the granularity of the outputs
is very coarse. For instance, the discrepancies that will be          In parsing ELF binaries, ClamAV differs from binutils
found in an application that provides debug messages or             when it encounters illegal values in e_ident[EI_CLASS].
fine-grained error codes are expected to be more than those         As shown in Listing 1, ClamAV treats ELF binaries config-
found in applications with less expressive outputs, (e.g., a web    ured with such illegal values as being of an invalid format
application firewall that only returns ACCEPT or REJECT             (CL_EFORMAT) and does not scan the respective files. By
based on its input). To verify this assumption, we perform          contrast, binutils correctly parses such ELF binaries. We
an experiment with only three SSL libraries, i.e., OpenSSL,         verified that such ELF binaries can in fact be successfully
LibreSSL and BoringSSL, in which all libraries are only             executed. In Listing 2, the Linux kernel’s ELF loader does not
returning a subset of their supported error codes, namely at        validate this field while loading a binary. As a result, a malware
most 32, 64, 128 and 256 error codes. Our results are presented     with such a corrupted ELF header can evade the detection of
in Figure 10. We notice that a limit of 32 error codes results in   ClamAV, while retaining its capability to execute in the host
significantly fewer discrepancies than a more expressive set of     OS.
error values. Finally, we should note that when we decreased         1    static int cli_elf_fileheader(...) {
                                                                     2      ...
this limit further, to only allow 16 possible error codes across     3      switch(file_hdr->hdr64.e_ident[4]) {
all three libraries, N EZHA did not find any discrepancies.          4        case 1:
                                                                     5          ...
                                                                     6        case 2:
                VI. C ASE S TUDIES OF B UGS                          7          ...
                                                                     8        default:
  In this section, we describe selected semantic and crash-          9          ...
inducing bugs that N EZHA found during our experiments.              10         return CL_EFORMAT;

A. ClamAV File Format Validation Bugs                               Listing 1: ClamAV code that parses the e_ident field.
   As described in Section II, discrepancies in the file format
                                                                     1    static int load_elf_binary(struct linux_binprm *bprm) {
validation logic across programs can have dire security impli-       2      ...
cations. Here we highlight two critical bugs, where ClamAV           3      retval = -ENOEXEC;
                                                                     4      if (memcmp(loc->elf_ex.e_ident, ELFMAG, SELFMAG) != 0)
fails to parse specially crafted ELF and XZ files and thus           5        goto out;
does not scan them, despite the fact that the programs that          6      if (loc->elf_ex.e_type != ET_EXEC &&
                                                                                 loc->elf_ex.e_type != ET_DYN)
commonly execute/extract these types of files process them           7        goto out;
correctly. These bugs allow an attacker to launch evasion            8      if (!elf_check_arch(&loc->elf_ex))
                                                                     9        goto out;
attacks against ClamAV by injecting malware into specially           10     ...
crafted files.                                                      Listing 2: Error checks for ELF loading in the Linux kernel
   1) ELF - Mishandling of Malformed Header: According              (the e_ident field is not checked).
to the ELF specification [1], the ELF header contains the
e_ident[EI_CLASS] field, which specifies the type of                   2) XZ - Mishandling of the Dictionary Size Field: Accord-
machine (32- or 64-bit) the ELF file is compiled to run on.         ing to the XZ specifications [62], the LZMA2 decompression
Values greater than 2 for this field are left undefined.            algorithm in an archive can use a dictionary size ranging from
4kB to 4GB. The dictionary size varies from file to file and        Indeed, some SSL libraries like OpenSSL and BoringSSL are
is stored in the XZ header of a file. ClamAV differs from XZ        more permissive while parsing such time fields.
Utils when parsing this dictionary size field.                         LibreSSL, on the other hand, tries to comply strictly with the
  1   extern lzma_ret lzma_lz_decoder_init(...) {                   standards when parsing the validity time fields in a certificate.
  2     ...                                                         However, while doing so, LibreSSL introduces a bug. Unlike
  3     // Allocate and initialize the dictionary.
  4     if (next->coder->dict.size != lz_options.dict_size) {       the other libraries, LibreSSL ignores the ASN.1 time format
  5       lzma_free(next->coder->dict.buf, allocator);              tag, and infers the time format type based on the length of
  6       next->coder->dict.buf
  7         = lzma_alloc(lz_options.dict_size, allocator);          the field (Lines 10 and 16 in Listing 5). In particular, the
  8       ...                                                       time fields in a certificate can be crafted to trick LibreSSL to
  9
 10   lzma_alloc(size_t size, const lzma_allocator                  erroneously parse the time fields using an incorrect type. For
           *allocator) {                                            instance, when the time field of ASN.1 GeneralizedTime
 11     ...
 12     if (allocator != NULL && allocator->alloc != NULL)          type is crafted to have the same length as the UTCTime (i.e.,
 13       ptr = allocator->alloc(allocator->opaque, 1, size);       13), LibreSSL treats the GeneralizedTime as UTCTime.
 14     else
 15       ptr = malloc(size);                                          As a result of this confusion, LibreSSL may erroneously
        ...
 16
                                                                    treat a valid certificate as not yet valid, when in fact it is valid;
 Listing 3: XZ Utils parses the dictionary size correctly.          or, it may erroneously accept an expired certificate. For exam-
                                                                    ple, while other libraries may interpret a GeneralizedTime
   As shown in Listing 3, XZ Utils strictly conforms to the         time in history, 201201010101Z as Jan 1 01:01:00
specifications and allocates a buffer based on the permitted        2012 GMT, LibreSSL will incorrectly interpret this time as a
dictionary sizes. On the other hand, ClamAV includes an             UTCTime time in future, i.e., as Dec 1 01:01:01 2020
additional check on the dictionary size that deviates from the      GMT. Note that finding time fields of non-standard lengths
specifications. It fails to parse archives with a dictionary size   in the wild suggests that CAs do not actively enforce these
greater than 182MB (line 15 in Listing 4). As a result of           standards length requirement. Furthermore, we also found
this bug, when parsing such an archive containing a malware,        certificates with GeneralizedTime times that are of the
ClamAV does not consider the file as an archive, and thus           length 13 in the SSL observatory dataset.
skips scanning the compressed malware.
                                                                     1    int asn1_time_parse(..., size_t len, ..., int mode) {
  1   SRes LzmaDec_Allocate(.., const Byte *props, ...) {            2      ...
  2     ...                                                          3      int type = 0;
  3     dicBufSize = propNew.dicSize;                                4      /* Constrain to valid lengths. */
  4     if (p->dic == 0 || dicBufSize != p->dicBufSize){             5      if (len != UTCTIME_LENGTH && len != GENTIME_LENGTH)
  5       ...                                                        6        return (-1);
  6       // Invoke __xz_wrap_alloc()                                7      ...
  7       p->dic = (Byte *)alloc->Alloc(alloc, dicBufSize);          8      switch (len) {
  8       if (p->dic == 0) {                                         9      case GENTIME_LENGTH:
  9         ...                                                      10       // mode is "ignored" -- configured to 0 here
 10         return SZ_ERROR_MEM;                                     11       if (mode == V_ASN1_UTCTIME)
 11         ...                                                      12         return (-1);
 12
                                                                     13       ...
 13   void *__xz_wrap_alloc(void *unused, size_t size) {             14       type = V_ASN1_GENERALIZEDTIME;
 14     // Fails if size > (182*1024*1024)                           15     case UTCTIME_LENGTH:
 15     if(!size || size > CLI_MAX_ALLOCATION)                       16       if (type == 0) {
 16       return NULL;                                               17         if (mode == V_ASN1_GENERALIZEDTIME)
 17       ...                                                        18           return (-1);
Listing 4: ClamAV’s additional erroneous check on                    19         type = V_ASN1_UTCTIME;
                                                                     20       }
dictionary size.                                                     21       ...

                                                                            Listing 5: LibreSSL time field parsing bug.
B. X.509 Certificate Validation Discrepancies
   In this Section, we present two examples of certificate            2) GnuTLS - Incorrect validation of activation time: As
validation semantic bugs found by N EZHA, one involving             shown in Listing 6, GnuTLS lacks a check for cases where
LibreSSL and one GnuTLS. Another example of a discrep-              the year is set to 0. As a result, while other SSL libraries reject
ancy between LibreSSL and BoringSSL is presented in the             a malformed certificate causing t to be 0, GnuTLS erroneously
Appendix.                                                           accepts it.
   1) LibreSSL - Incorrect parsing of time field types:              1    static unsigned int check_time_status(gnutls_x509_crt_t
The RFC standards for X.509 certificates restrict the Time                     crt, time_t now) {
                                                                     2        int status = 0;
fields to only two forms, namely the ASN.1 representations           3        time_t t = gnutls_x509_crt_get_activation_time(crt);
of UTCTime (YYMMDDHHMMSSZ) and GeneralizedTime                       4        if (t == (time_t) - 1 || now < t) {
                                                                     5            status |= GNUTLS_CERT_NOT_ACTIVATED;
(YYYYMMDDHHMMSSZ) [15] which are 13 and 15 characters                6            status |= GNUTLS_CERT_INVALID;
wide respectively. Time fields are also encoded with an              7            return status;
                                                                     8        ...
ASN.1 tag that specifies their format. Despite the standards, in
practice, we observe that 11- and 17-character time fields are            Listing 6: GnuTLS activation time parsing error.
used in the wild, by searching within the SSL observatory [7].
C. PDF Viewer Discrepancies                                         set of statistical techniques to drive input generation [23],
   As mentioned in Section V-A, N EZHA uncovered 7 unique           [31], [47], or leverage static and dynamic analysis to prioritize
discrepancies in the tested three PDF browsers (Evince, Xpdf        deeper paths [55]. However, most of these tools do not
and MuPDF) over a total of 10 million generations. Examples         support differential testing. Finally, Chen et al.’s tool perform
of the found discrepancies include PDF files that could be          differential testing of JVMs using MCMC sampling for input
opened in one viewer but not another and PDFs rendered with         generation [31]. However, their tool is domain-specific (i.e.,
different contents across viewers. One interesting discrepancy      requires details knowledge of the Java class files and uses
includes a PDF that Evince treats as encrypted (thus opening it     custom domain-specific mutations). Moreover, MCMC tends
with a password prompt) but Xpdf recognizes as unencrypted          to be computationally very expensive, significantly slowing
(MuPDF and Xpdf abort with errors trying to render the file).       down the input generation process. N EZHA, by contrast, uses
                                                                    a fast guidance mechanism well suited for differential testing
                    VII. R ELATED WORK                              that seeks to maximize the diversity of relative behaviors of
   Unguided Testing: Unguided testing tools generate test           the test programs in search of discrepancies-inducing inputs.
inputs independently across iterations without considering the          Symbolic execution: Symbolic execution [43] is a white-
test program’s behavior on past inputs. Domain-specific evo-        box technique that executes a program symbolically, computes
lutionary unguided testing tools have successfully uncovered        constraints along different paths, and uses a constraint solver to
numerous bugs across a diverse set of applications [2], [40],       generate inputs that satisfy the collected constraints along each
[42], [52], [56]. Another parallel line of work explored build-     path. KLEE [26] uses symbolic execution to generate tests that
ing different grammar-based testing tools that rely on a context    achieve high coverage for several popular UNIX applications,
free grammar for generating test inputs [48], [50]. LangFuzz        however, due to path explosion, it does not scale to large
[38] uses a grammar to randomly generate valid JavaScript           applications. UC-KLEE [43], [54] aims to tackle KLEE’s
code fragments and test JavaScript VMs, while GLADE [22]            scalability issues by performing under-constrained symbolic
synthesizes a context-free grammar encoding the language of         execution, i.e., directly executing a function by skipping the
valid program inputs and leverages it for fuzzing. TestEra          whole invocation path up to that function. However, this may
[49] uses specifications to automatically generate test inputs      result in an increase in the number of false positives.
for Java programs. lava [58] is a domain-specific language              To mitigate path explosion, several lines of work utilize
designed for specifying grammars that can be used to generate       symbolic execution only in portions of their analysis to aid
test inputs for testing Java VMs. Unlike N EZHA’s guided            the testing process, and combine it with concrete inputs [27].
approach, the input generation process of these tools does not      Another approach towards addressing the limitations of pure
use any information from past inputs and essentially creates        symbolic execution is to outsource part of the computation
new inputs at random from a prohibitively large input space.        away from the symbolic execution engine using fuzzing [28],
This makes the testing process highly inefficient, since large      [34]–[37], [61]. A major limitation of symbolic-execution-
numbers of inputs need to be generated to find a single bug.        assisted testing tools in the context of differential testing is
   Guided Testing: Evolutionary testing was designed to make        that the path explosion problem increases significantly as the
the input generation process more efficient by taking pro-          number of test programs increase. Therefore, it is very hard
gram behavior information for past inputs into account, while       to scale symbolic execution techniques to perform differential
generating new inputs [53]. Researchers have since explored         testing of multiple large programs.
different forms of code coverage heuristics (e.g., basic block,         Differential Testing: Differential testing [51] has been very
function, edge, or branch coverage) to efficiently guide the        successful in uncovering semantic differences between inde-
search for bug-inducing inputs. Coverage-based tools such           pendent implementations with similar intended functionality.
as AFL [66], libFuzzer [4], and the CERT Basic Fuzzing              Researchers have leveraged this approach to find bugs across
Framework (BFF) [39] refine their input corpus by maximizing        many types of programs, such as web applications [29], differ-
the code coverage with every new input added to the corpus.         ent Java Virtual Machine (JVM) implementations [31], various
However, these tools are not well suited for differential testing   security implementations of security policies for APIs [59],
as they do not exploit the relative differences across multiple     compilers [65] and multiple implementations of network pro-
test applications. In particular, to the best of our knowledge,     tocols [25]. KLEE [26] used symbolic execution to perform
N EZHA is the first testing framework to particularly design a      differential testing, however suffers from scalability issues.
path selection mechanism fitted towards to differential testing.    SFADiff [21] performs black-box differential testing using
Even if a state-of-the-art testing framework such as libFuzzer,     Symbolic Finite Automata (SFA) learning, however, contrary
was modified to perform differential testing using global cov-      to N EZHA, can only be applied to applications such as XSS
erage across multiple programs, it would still be outperformed      filters that can be modeled by an SFA.
by both N EZHA’s gray-box and black-box engines, as shown               Chen et al. performed coverage-guided differential testing
in Section V.                                                       of SSL/TLS implementations using Mucerts [32]. However,
   Another line of research builds on the observation that the      unlike N EZHA, Mucerts requires knowledge of the partial
problem of new input generation from existing inputs can be         grammar of the X.509 certificate format and applies MCMC
modeled as a stochastic process. These tools leverage a diverse     algorithm on a single application (i.e., OpenSSL) to drive
its input generation. The input generation of Mucerts is very       this problem is to utilize more complex schemes keeping
slow requiring multiple days to generate even 10,000 inputs.        track of all successful and failed executions across the tested
As demonstrated in Section V-A, N EZHA manages to find 27           applications (e.g., execution paths leading to successful and
times more discrepancies per input.                                 failed states may be stored in two distinct groups. Upon a
   Another similar work is Brubaker et al.’s unguided differen-     deviation from a previously unseen behavior, one may lookup
tial testing system that synthesizes frankencerts by randomly       the point at which the deviation occurred in both groups to
combining parts of real certificates [24]. They use these           pinpoint the root cause.
syntactically valid certificates to test for semantic violations
of SSL/TLS certificate validation across multiple implemen-
                                                                                   IX. D EVELOPER R ESPONSES
tations. However, unlike in N EZHA where the selection of
mutated inputs is guided by δ-diversity metrics, the creation          We have responsibly disclosed the vulnerabilities identified
and selection of Frankencerts is completely unguided and            in this work to the respective developers of the affected
therefore significantly inefficient compared to N EZHA.             programs. Each of our reports includes a description of the bug
   Besides testing software, researchers have applied differ-       alongside a Proof-of-Concept (PoC) test input and a suggested
ential testing to uncover program deviations that could lead        patch. The wolfSSL team assigned the highest priority to
to malicious evasion attacks on security-sensitive programs.        all the memory corruption errors we reported and addressed
Similar to the way we applied N EZHA to uncover evasion             all the bugs within six days of our disclosure, merging the
bugs in ClamAV malware detector, Jana et al. use differential       respective patches in wolfSSL v3.9.8. Likewise, ClamAV de-
testing (with manually crafted inputs) to look for discrepancies    velopers have confirmed the reported bugs and are planning to
in file processing across multiple antivirus scanners [41].         merge the relevant fixes in v0.99.3. The ClamAV evasions bugs
Recent works have applied differential testing to search for        have been assigned with CVE identifiers CVE-2017-6592 (XZ
inputs that can evade machine learning classifiers for malware      archive evasion) and CVE-2017-6593 (ELF binary evasion).
detection [46], [64]. However, unlike N EZHA, these projects        GnuTLS and LibreSSL developers likewise addressed the
require a detailed knowledge of the input format.                   reported bugs within three days from our disclosure, pushing
   Differential testing shares parallels with N-version program-    the respective patches to upstream.
ming [30]. Both aim to improve the reliability of systems by
using independent implementations of functionally equivalent
programs, provided that the failures (or bugs) of the multiple                            X. C ONCLUSION
versions are statistically independent. Therefore, N EZHA’s
                                                                       In this paper we design, implement, and evaluate N EZHA,
input generation scheme will also be helpful to efficiently
                                                                    a guided differential testing tool that realizes the concept of
identify uncorrelated failures in software written under the N-
                                                                    δ-diversity to efficiently find semantic bugs in large, real-
version programming paradigm. Both N-version programming
                                                                    world applications without knowing any details about the input
and differential testing suffer from similar limitations when
                                                                    formats. N EZHA can generate test inputs using both δ-diversity
different test programs demonstrate correlated buggy behaviors
                                                                    black-box and gray-box guidance. Our experimental results
as observed by Knight et al. [44].
                                                                    demonstrate that N EZHA is more efficient at finding discrepan-
                    VIII. F UTURE W ORK                             cies than all of the guided and unguided testing frameworks we
   We believe N EZHA is a crucial first step towards building ef-   compared it against. N EZHA discovered two evasion attacks
ficient differential testing tools. However, several components     against the ClamAV malware detector and 764 discrepancies
of the underlying engine offer fertile ground for future work.      between the implementations of X.509 certificate validation in
   Mutation Strategies: N EZHA’s current mutation strategies        six major SSL/TLS libraries.
are not tailored for differential testing and therefore present a      We have made N EZHA open-source so that the community
promising target for further optimization. Moreover, new gray-      can continue to build on it and advance the field of efficient
box guidance mechanisms that incorporate bookkeeping of             differential testing for security bugs. The framework can be
intermediate states explored during a test program’s execution      accessed at https://github.com/nezha-dt.
could be used to more efficiently generate promising inputs.
   Bug Localization: Similar improvements can be achieved                              ACKNOWLEDGMENTS
towards the problem of automated debugging and bug local-
ization. Prior research has performed bug bucketing for crash-        We would like to thank the anonymous reviewers for their
inducing bugs using stack trace hashes [28]. However, this          valuable feedback. This work is sponsored in part by the
method is not suitable for semantic bugs that do not result         Office of Naval Research (ONR) through contract N00014-15-
in crashes. Moreover, heuristics such as using the average          1-2180 and by the National Science Foundation (NSF) grants
stack trace depth in order to locate "deeper" bugs cannot be        CNS-13-18415 and CNS-16-17670. Any opinions, findings,
trivially adapted to differential testing, because the depth of     conclusions, or recommendations expressed herein are those
the root cause of a bug might not be correlated with the            of the authors, and do not necessarily reflect those of the US
maximum depth of the execution. One possible solution for           Government, ONR or NSF.
                               R EFERENCES                                         [29] P. Chapman and D. Evans, “Automated black-box detection of side-
                                                                                        channel vulnerabilities in web applications,” in Proceedings of the 18th
 [1] “Executable and Linkable Format (ELF),” http://www.skyfree.org/linux/              ACM conference on Computer and Communications Security (CCS).
     references/ELF_Format.pdf.                                                         ACM, 2011, pp. 263–274.
 [2] “Ioactive_elf_parsing_with_melkor.pdf,” http://www.ioactive.com/pdfs/         [30] L. Chen and A. Avizienis, “N-version programming: A fault-tolerance
     IOActive_ELF_Parsing_with_Melkor.pdf.                                              approach to reliability of software operation,” in Digest of Papers FTCS-
                                                                                        8: Eighth Annual International Conference on Fault Tolerant Computing,
 [3] “Isartor test suite (terms of use & download) - pdf association,” https:
                                                                                        1978, pp. 3–9.
     //www.pdfa.org/isartor-test-suite-terms-of-use-download/.
                                                                                   [31] Y. Chen, T. Su, C. Sun, Z. Su, and J. Zhao, “Coverage-directed
 [4] “libFuzzer - a library for coverage-guided fuzz testing - LLVM 3.9
                                                                                        differential testing of JVM implementations,” in Proceedings of the
     documentation,” http://llvm.org/docs/LibFuzzer.html.
                                                                                        37th ACM SIGPLAN Conference on Programming Language Design
 [5] “Nezha (chinese protection god),” http://www.godchecker.com/pantheo                and Implementation (PLDI). ACM, 2016, pp. 85–99.
     n/chinese-mythology.php?deity=NEZHA.
                                                                                   [32] Y. Chen and Z. Su, “Guided differential testing of certificate validation
 [6] “Santizercoverage - Clang 4.0 documentation,” http://clang.llvm.org/doc            in SSL/TLS implementations,” in Proceedings of the 10th Joint Meeting
     s/SanitizerCoverage.html.                                                          on Foundations of Software Engineering (FSE). ACM, 2015, pp. 793–
 [7] “The EFF SSL Observatory,” https://www.eff.org/observatory.                        804.
 [8] “Undefined behavior sanitizer - Clang 4.0 documentation,” http://clang.       [33] M. Georgiev, S. Iyengar, S. Jana, R. Anubhai, D. Boneh, and
     llvm.org/docs/UndefinedBehaviorSanitizer.html.                                     V. Shmatikov, “The most dangerous code in the world: validating SSL
 [9] “Virusshare.com,” https://virusshare.com/.                                         certificates in non-browser software,” in Proceedings of the 2012 ACM
[10] “Internet X.509 public key infrastructure certificate policy and certifica-        conference on Computer and Communications Security (CCS). ACM,
     tion practices framework,” http://www.ietf.org/rfc/rfc2527.txt, 1999.              2012, pp. 38–49.
[11] “The TLS protocol version 1.0,” http://tools.ietf.org/html/rfc2246, 1999.     [34] P. Godefroid, A. Kiezun, and M. Y. Levin, “Grammar-based whitebox
[12] “HTTP over TLS,” http://www.ietf.org/rfc/rfc2818.txt, 2000.                        fuzzing,” in Proceedings of the 29th ACM SIGPLAN Conference on
[13] “System v application binary interface,” https://refspecs.linuxfoundation          Programming Language Design and Implementation (PLDI), 2008, pp.
     .org/elf/gabi4+/contents.html, April 2001.                                         206–215.
[14] “The Transport Layer Security (TLS) protocol version 1.1,” http://tools.      [35] P. Godefroid, N. Klarlund, and K. Sen, “Dart: directed automated
     ietf.org/html/rfc4346, 2006.                                                       random testing,” in Proceedings of the 2005 ACM SIGPLAN conference
[15] “Internet X.509 public key infrastructure certificate and certificate revo-        on Programming Language Design and Implementation (PLDI), vol. 40,
     cation list (CRL) profile,” http://tools.ietf.org/html/rfc5280, 2008.              no. 6. ACM, 2005, pp. 213–223.
[16] “The Transport Layer Security (TLS) protocol version 1.2,” http://tools.      [36] P. Godefroid, M. Y. Levin, D. A. Molnar et al., “Automated whitebox
     ietf.org/html/rfc5246, 2008.                                                       fuzz testing.” in Proceedings of the 2008 Network and Distributed
[17] “Representation and verification of domain-based application service               Systems Symposium (NDSS), vol. 8, 2008, pp. 151–166.
     identity within Internet public key infrastructure using X.509 (PKIX)         [37] I. Haller, A. Slowinska, M. Neugschwandtner, and H. Bos, “Dowsing for
     certificates in the context of Transport Layer Security (TLS),” http:              overflows: A guided fuzzer to find buffer boundary violations,” in 22nd
     //tools.ietf.org/html/rfc6125, 2011.                                               USENIX Security Symposium (USENIX Security ’13). Washington,
[18] “The Secure Sockets Layer (SSL) protocol version 3.0,” http://tools.ietf           D.C.: USENIX, 2013, pp. 49–64.
     .org/html/rfc6101, 2011.                                                      [38] C. Holler, K. Herzig, and A. Zeller, “Fuzzing with code fragments,”
[19] “Xz utils,” http://tukaani.org/xz/, 2015.                                          in 21st USENIX Security Symposium (USENIX Security ’12), 2012, pp.
[20] “The Transport Layer Security (TLS) Protocol Version 1.3,” https://tool            445–458.
     s.ietf.org/html/draft-ietf-tls-tls13-14, 2016.                                [39] A. D. Householder and J. M. Foote, “Probability-based parameter
[21] G. Argyros, I. Stais, S. Jana, A. D. Keromytis, and A. Kiayias,                    selection for black-box fuzz testing,” in CMU/SEI Technical Report -
     “SFADiff: Automated evasion attacks and fingerprinting using black-                CMU/SEI-2012-TN-019, 2012.
     box differential automata learning,” in Proceedings of the 2016 ACM           [40] S. Jana, Y. Kang, S. Roth, and B. Ray, “Automatically Detecting Error
     SIGSAC Conference on Computer and Communications Security (CCS).                   Handling Bugs using Error Specifications,” in 25th USENIX Security
     ACM, 2016, pp. 1690–1701.                                                          Symposium (USENIX Security), Austin, August 2016.
[22] O. Bastani, R. Sharma, A. Aiken, and P. Liang, “Synthesizing program          [41] S. Jana and V. Shmatikov, “Abusing file processing in malware detectors
     input grammars,” in Proceedings of the 38th ACM SIGPLAN Conference                 for fun and profit,” in Proceedings of the 2012 IEEE Symposium on
     on Programming Language Design and Implementation (PLDI). ACM,                     Security and Privacy (S&P). IEEE Computer Society, 2012, pp. 80–
     2017.                                                                              94.
[23] M. Böhme, V.-T. Pham, and A. Roychoudhury, “Coverage-based grey-              [42] Y. Kang, B. Ray, and S. Jana, “APEx: Automated Inference of Error
     box fuzzing as markov chain,” in Proceedings of the 23rd ACM                       Specifications for C APIs,” in 31st IEEE/ACM International Conference
     Conference on Computer and Communications Security (CCS), 2016,                    on Automated Software Engineering (ASE), Singapore, September 2016.
     pp. 1–12.                                                                     [43] J. C. King, “Symbolic execution and program testing,” Communications
[24] C. Brubaker, S. Jana, B. Ray, S. Khurshid, and V. Shmatikov, “Using                of the ACM, vol. 19, no. 7, pp. 385–394, 1976.
     frankencerts for automated adversarial testing of certificate validation in   [44] J. C. Knight and N. G. Leveson, “An experimental evaluation of
     SSL/TLS implementations,” in Proceedings of the 2014 IEEE Sympo-                   the assumption of independence in multiversion programming,” IEEE
     sium on Security and Privacy (S&P). IEEE Computer Society, 2014,                   Transactions on Software Engineering, no. 1, pp. 96–109, 1986.
     pp. 114–129.                                                                  [45] J. Kornblum, “Identifying almost identical files using context triggered
[25] D. Brumley, J. Caballero, Z. Liang, J. Newsome, and D. Song, “Towards              piecewise hashing,” Digital Investigation, vol. 3, pp. 91–97, 2006.
     automatic discovery of deviations in binary implementations with appli-       [46] P. Laskov et al., “Practical evasion of a learning-based classifier: A case
     cations to error detection and fingerprint generation,” in 16th USENIX             study,” in 2014 IEEE Symposium on Security and Privacy (S&P). IEEE,
     Security Symposium (USENIX Security ’07). USENIX Association,                      2014, pp. 197–211.
     2007.                                                                         [47] V. Le, C. Sun, and Z. Su, “Finding deep compiler bugs via guided
[26] C. Cadar, D. Dunbar, D. R. Engler et al., “Klee: Unassisted and                    stochastic program mutation,” in Proceedings of the 2015 ACM SIG-
     automatic generation of high-coverage tests for complex systems pro-               PLAN International Conference on Object-Oriented Programming, Sys-
     grams.” in 8th USENIX Symposium on Operating Systems Design and                    tems, Languages, and Applications (OOPSLA), vol. 50, no. 10. ACM,
     Implementation (OSDI), vol. 8, 2008, pp. 209–224.                                  2015, pp. 386–399.
[27] C. Cadar and D. Engler, “Execution generated test cases: How to make          [48] B. A. Malloy and J. F. Power, “An interpretation of purdom’s algorithm
     systems code crash itself,” in International SPIN Workshop on Model                for automatic generation of test cases,” in International Conference on
     Checking of Software. Springer, 2005, pp. 2–23.                                    Computer and Information Science, 2001.
[28] S. K. Cha, M. Woo, and D. Brumley, “Program-adaptive mutational               [49] D. Marinov and S. Khurshid, “Testera: A novel framework for
     fuzzing,” in 2015 IEEE Symposium on Security and Privacy (S&P),                    automated testing of java programs,” in Proceedings of the 16th IEEE
     May 2015, pp. 725–741.                                                             International Conference on Automated Software Engineering (ASE).
     Washington, DC, USA: IEEE Computer Society, 2001, pp. 22–.                       2) wolfSSL memory errors: N EZHA uncovered four mem-
     [Online]. Available: http://dl.acm.org/citation.cfm?id=872023.872551          ory corruption bugs in wolfSSL, all of which were marked as
[50] P. M. Maurer, “Generating test data with enhanced context-free gram-
     mars,” IEEE Software, vol. 7, no. 4, pp. 50–55, 1990.                         critical by the wolfSSL developers and patched within six days
[51] W. M. McKeeman, “Differential testing for software,” Digital Technical        after we reported the bugs. Two of the bugs were caused by
     Journal, vol. 10, no. 1, pp. 100–107, 1998.                                   missing checks for malformed PEM certificate headers inside
[52] B. P. Miller, L. Fredriksen, and B. So, “An empirical study of the
     reliability of unix utilities,” Communications of the ACM, vol. 33, no. 12,   the PemToDer function, which converts a X.509 certificate
     pp. 32–44, 1990.                                                              from PEM to DER format. The missing checks resulted
[53] R. P. Pargas, M. J. Harrold, and R. R. Peck, “Test-data generation using      in out-of-bounds memory reads. The third bug was caused
     genetic algorithms,” Software Testing Verification and Reliability, vol. 9,
     no. 4, pp. 263–282, 1999.                                                     by a missing check for the return value of a PemToDer
[54] D. A. Ramos and D. R. Engler, “Practical, low-effort equivalence              call, inside the wolfSSL_CertManagerVerifyBuffer
     verification of real code,” in International Conference on Computer           routine, causing a segmentation fault. In this case, the structure
     Aided Verification. Springer, 2011, pp. 669–685.
[55] S. Rawat, V. Jain, A. Kumar, L. Cojocar, C. Giuffrida, and H. Bos,            holding the DER-converted certificate is corrupted. Finally the
     “Vuzzer: Application-aware evolutionary fuzzing,” in Proceedings of the       fourth bug, also occurring inside Pem2Der, resulted in an
     Network and Distributed System Security Symposium (NDSS), 2017.               out-of-bounds read, due to a missing check on the size of
[56] J. Ruderman, “Introducing jsfunfuzz,” https://www.squarefree.com
     /2007/08/02/introducing-jsfunfuzz/.                                           the PEM certificate to be converted. This can be triggered
[57] K. Serebryany, D. Bruening, A. Potapenko, and D. Vyukov, “Ad-                 by an intermediate certificate in a chain that has the correct
     dresssanitizer: a fast address sanity checker,” in 2012 USENIX Annual         PEM header but an empty body: the missing check will cause
     Technical Conference (USENIX ATC 2012), 2012, pp. 309–318.
[58] E. G. Sirer and B. N. Bershad, “Using production grammars in software         Pem2Der to not return any error, which in turn results in an
     testing,” in Proceedings of the 2nd conference on Domain-Specific             out-of-bounds memory access during the subsequent steps of
     Languages (DSL), vol. 35, no. 1. ACM, 1999, pp. 1–13.                         the verification process.
[59] V. Srivastava, M. D. Bond, K. S. McKinley, and V. Shmatikov, “A
     security policy oracle: Detecting security holes using multiple api              3) GnuTLS null pointer dereference: N EZHA found a miss-
     implementations,” ACM SIGPLAN Notices, vol. 46, no. 6, pp. 343–354,           ing check inside the gnutls_oid_to_ecc_curve routine
     2011.                                                                         of GnuTLS, where dereferenced pointers were not checked to
[60] E. Stepanov and K. Serebryany, “Memorysanitizer: fast detector of
     uninitialized memory use in C++,” in Proceedings of the 13th Annual           be not NULL. This bug resulted in a segmentation fault while
     IEEE/ACM International Symposium on Code Generation and Optimiza-             parsing an appropriately crafted certificate.
     tion (CGO). IEEE Computer Society, 2015, pp. 46–55.
[61] N. Stephens, J. Grosen, C. Salls, A. Dutcher, R. Wang, J. Corbetta,           B. Coverage and population size for N EZHA’s different guid-
     Y. Shoshitaishvili, C. Kruegel, and G. Vigna, “Driller: Augmenting
     fuzzing through selective symbolic execution,” in Proceedings of the          ance engines
     Network and Distributed System Security Symposium (NDSS), 2016.
[62] Tool Interface Standard, “The .xz File Format,” http://tukaani.org/xz/x
                                                                                      In Figures 11 and 12, we present the coverage and popu-
     z-file-format.txt, August 2009.                                               lation increases for the different engines of N EZHA for the
[63] Tool Interface Standard (TIS), “Executable and Linking For-                   experimental setup of Section V-A.
     mat (ELF) specification,” https://refspecs.linuxfoundation.org/elf/elf.pdf,
     May 1995.
[64] W. Xu, Y. Qi, and D. Evans, “Automatically evading classifiers a case                         25000
     study on PDF malware classifiers,” in Proceedings of the 2016 Network
     and Distributed Systems Symposium (NDSS), 2016.
[65] X. Yang, Y. Chen, E. Eide, and J. Regehr, “Finding and understanding                          20000
     bugs in c compilers,” in Proceedings of the 32nd ACM SIGPLAN
     Conference on Programming Language Design and Implementation                                                                     21000
                                                                                   Edge Coverage




     (PLDI). ACM, 2011, pp. 283–294.                                                               15000                              20000
[66] M. Zalewski, “american fuzzy lop,” http://lcamtuf.coredump.cx/afl/.
[67] A. Zeller, “Yesterday, my program worked. Today, it does not. Why?”                                                              19000
     in Proceedings of the Joint Meeting on Foundations of Software Engi-
                                                                                                   10000                              18000
     neering (ESEC/FSE). Springer, 1999, pp. 253–267.
                                                                                                               Global coverage        17000
                                                                                                                                            0    5000   10000   15000
                                                                                                               (modified libFuzzer)
                             XI. A PPENDIX                                                          5000       Path δ-diversity (coarse)
A. Memory Coruption Bugs Reported by N EZHA                                                                    Path δ-diversity (fine)
                                                                                                               Output δ-diversity
   1) ClamAV use-after-free: N EZHA disclosed a use-after-                                             0
                                                                                                           0   20000         40000       60000          80000      100000
free heap bug in ClamAV, which is invoked when parsing                                                                          Generation
a malformed XZ archive. As ClamAV parses the multiple
compression blocks in the archive, it makes a series of                                               Fig. 11: Coverage increase for each of N EZHA’s
allocation and freeing operations on a single memory buffer.                                          engines per generation (average of 100 runs with
ClamAV’s memory allocation routine will only do so when the                                           a seed corpus of 1000 certificates).
given memory pointer is NULL. However, the memory freeing
routine fails to nullify the memory pointer after freeing the
buffer. As a result, the bug will be triggered after a series of                   C. BoringSSL - Incorrect representation of KeyUsage
allocate-free-allocate operations. An attacker can exploit this                      According to the RFC standards, the KeyUsage extension
vulnerability by sending a malformed XZ archive that will                          defines the purpose of the certificate key and it uses a
crash ClamAV when ClamAV attempts to scan the archive.                             bitstring to represent the various uses of the key. A valid
                  450                                                                       exhibit this discrepancy during the parsing of a Certificate
                  400
                                                                                            Signing Request (CSR). This can have critical security impli-
                                                                                            cations. Consider the scenario where a CA using BoringSSL
                  350
                                                                                            parses such a CSR presented by an attacker and does not
                                                      420
                  300
                                                      410
                                                                                            interpret the extension correctly. The CA misinterprets the key
Population Size




                  250
                                                      400                                   usages and does not detect certain blacklisted ones. In this
                                                      390
                                                      380
                                                                                            situation, the CA might copy the malformed extension to the
                  200
                                                      370                                   issued certificate. Subsequently, when the issued certificate is
                                                      360
                  150
                              Global coverage         350
                                                                                            parsed by a client using LibreSSL, it will be parsed with a
                                                            0    5000   10000   15000
                              (modified libFuzzer)                                          valid keyUsage extension and thus the attacker can use the
                  100
                              Path δ-diversity (coarse)
                                                                                            certificate for purposes that were not intended by the CA.
                   50         Path δ-diversity (fine)
                              Output δ-diversity
                    0
                        0     20000         40000        60000          80000      100000
                                                Generation


                        Fig. 12: Population size increase for each of
                        N EZHA’s engines per generation (average of 100
                        runs, each starting from a seed corpus of 1000
                        certificates).


Certificate Authority (CA) certificate must have this extension
present with the keyCertSign bit set.
   BoringSSL and LibreSSL differ in the way they parse the
ASN.1 bitstring, which is used for storing the KeyUsage
extension in the X.509 certificates. Each bitstring is
encoded with a “padding” byte that indicates the number of
least significant unused bits in the bit representation of the
structure. This byte should never be more than 7. But if
the byte is set to a value greater than 7, BoringSSL fails to
parse the bitstring and throws an error in Listing 7, whereas
LibreSSL masks that byte with 0x07 and continues to parse
the bitstring as-is as shown in Listing 8.
      1           ASN1_BIT_STRING *c2i_ASN1_BIT_STRING(..., char **pp) {
      2             ...
      3             p = *pp;
      4             padding = *(p++);
      5             // returns an error if invalid padding byte
      6             if (padding > 7) {
      7               OPENSSL_PUT_ERROR(ASN1,
                           ASN1_R_INVALID_BIT_STRING_BITS_LEFT);
      8               goto err;
      9             }
10                  ret->flags &= ~(ASN1_STRING_FLAG_BITS_LEFT | 0x07);
11                  ret->flags |= (ASN1_STRING_FLAG_BITS_LEFT | i);
12                  ...

Listing 7: BoringSSL code for validating bitstrings.

      1           ASN1_BIT_STRING *c2i_ASN1_BIT_STRING(..., char **pp) {
      2             ...
      3             p = *pp;
      4             i = *(p++);
      5             // masks the padding byte, instead of with a check
      6             ret->flags&= ~(ASN1_STRING_FLAG_BITS_LEFT| 0x07);
      7             ret->flags|=(ASN1_STRING_FLAG_BITS_LEFT | (i&0x07));
      8             ...

 Listing 8: LibreSSL code for validating bitstrings.
   This subtle discrepancy results in two different interpreta-
tions of the same bitstring used in the extension. BoringSSL
fails to parse the bitstring and results in an empty KeyUsage
extension. LibreSSL, by masking the padding byte, success-
fully parses the extension. We also find that these libraries
