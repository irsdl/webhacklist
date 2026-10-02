---
type: Article
title: "Counting in Regexes Considered Harmful: Exposing ReDoS Vulnerability of Nonbacktracking Matchers"
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/turonova"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:23:13+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/turonova"
    title: "Counting in Regexes Considered Harmful: Exposing ReDoS Vulnerability of Nonbacktracking Matchers"
    author: Lenka Turoňová, Lukáš Holík, Ivan Homoliak, Ondřej Lengál, Margus Veanes, Tomáš Vojnar
  - id: capture
    resource: "https://web.archive.org/web/20221217234228/https://www.usenix.org/conference/usenixsecurity22/presentation/turonova"
also_at:
  - "https://www.usenix.org/system/files/sec22-turonova.pdf"
  - "https://www.usenix.org/system/files/sec22fall_turonova.pdf"
  - "https://www.usenix.org/system/files/sec22_slides-turonova.pdf"
authors:
  - Lenka Turoňová
  - Lukáš Holík
  - Ivan Homoliak
  - Ondřej Lengál
  - Margus Veanes
  - Tomáš Vojnar
canonical_url: ""
cited_by:
  - "2022.md:74"
commit: ""
content_sha256: 4e8d60d4cfe7dfd80ea3866a174dfa6936281b2c2d65d753de1b84f9d139a9ed
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/turonova"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: b4adce45414d68db54bffd5cf117deda3b8d9b0d3a7b27b8ab3c6c027f68f8d4
retrieved_from: "https://www.usenix.org/system/files/sec22-turonova.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:23:13+00:00"
slug: usenix-org-counting-regexes-considered-harmful-exposing-redos-matchers
snapshot: 20221217234228
title_english: ""
translation_file: ""
translation_of: ""
---

# Counting in Regexes Considered Harmful: Exposing ReDoS Vulnerability of Nonbacktracking Matchers

**Counting in Regexes Considered Harmful: Exposing ReDoS Vulnerability of Nonbacktracking Matchers** - Lenka Turoňová, Lukáš Holík, Ivan Homoliak, Ondřej Lengál, Margus Veanes, Tomáš Vojnar, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/turonova>
- Also published at: <https://www.usenix.org/system/files/sec22-turonova.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22fall_turonova.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22_slides-turonova.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-turonova.pdf (live) on 2026-08-19
- Capture timestamp: 20221217234228
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Counting in Regexes Considered Harmful:
    Exposing ReDoS Vulnerability of
      Nonbacktracking Matchers
Lenka Turoňová, Lukáš Holík, Ivan Homoliak, and Ondřej Lengál,
 Faculty of Information Technology, Brno University of Technology;
  Margus Veanes, Microsoft Research Redmond; Tomáš Vojnar,
 Faculty of Information Technology, Brno University of Technology
https://www.usenix.org/conference/usenixsecurity22/presentation/turonova


 This paper is included in the Proceedings of the
        31st USENIX Security Symposium.
              August 10–12, 2022 • Boston, MA, USA
                           978-1-939133-31-1




                                  Open access to the Proceedings of the
                                   31st USENIX Security Symposium is
                                         sponsored by USENIX.
                         Counting in Regexes Considered Harmful:
                 Exposing ReDoS Vulnerability of Nonbacktracking Matchers

    Lenka Turoňová1 , Lukáš Holík1 , Ivan Homoliak1 , Ondřej Lengál1 , Margus Veanes2 , Tomáš Vojnar1
        1 Faculty of Information Technology, Brno University of Technology, Brno, Czech Republic

                    {ituronova, holik, ihomoliak, lengal, vojnar}@fit.vutbr.cz
                              2 Microsoft Research, Microsoft, Redmond, USA

                                         margus@microsoft.com

                         Abstract                                  satisfactory analytical means for distinguishing vulnerable
                                                                   regexes do not exist. Since very specific and rare texts may be
In this paper, we study the performance characteristics of non-
                                                                   needed to trigger an extreme behaviour, vulnerable regexes are
backtracking regex matchers and their vulnerability against
                                                                   easily missed even by thorough testing (moreover, regexes are
ReDoS (regular expression denial of service) attacks. We fo-
                                                                   seldom thoroughly tested, as concluded in [48, 49]). A mani-
cus on their known Achilles heel, which are extended regexes
                                                                   festation of such vulnerability might then have serious conse-
that use bounded quantifiers (e.g., ‘(ab){100}’). We propose
                                                                   quences, such as a failed input validation against SQL injec-
a method for generating input texts that can cause ReDoS
                                                                   tion or cross-site scripting attacks (cf. [52]).
attacks on these matchers. The method exploits the bounded
                                                                      Vulnerable regexes are also a doorway for denial of ser-
repetition and uses it to force expensive simulations of the de-
                                                                   vice attacks based on overwhelming a matching engine by
terministic automaton for the regex. We perform an extensive
                                                                   crafting a vulnerability-triggering text, the so-called ReDoS
experimental evaluation of our and other state-of-the-art Re-
                                                                   (regular expression denial of service) attacks. For instance,
DoS generators on a large set of practical regexes with a com-
                                                                   in 2016, ReDoS caused an outage of StackOverflow [15] or
prehensive set of backtracking and nonbacktracking matchers,
                                                                   rendered vulnerable websites that used the popular Express.js
as well as experiments where we demonstrate ReDoS attacks
                                                                   framework [4]. The fact that ReDoS is indeed a common and
on state-of-the-art real-world security applications contain-
                                                                   serious threat is argued by several works such as [10, 11].
ing S NORT with Hyperscan and the HW-accelerated regex
                                                                   Therefore, stress testing of regex matchers, the topic of this
matching engine on the NVIDIA BlueField-2 card. Our ex-
                                                                   work, is an active research area.
periments show that bounded repetition is indeed a notable
weakness of nonbacktracking matchers, with our generator              Several methods and tools have been developed that at-
being the only one capable of significantly increasing their       tempt to determine whether a given regex is vulnerable to
running time.                                                      a ReDoS and to generate a triggering text (also referred to as
                                                                   evil text hereafter). Existing ReDoS analyzers [35, 39, 50, 53]
                                                                   focus on the most common family of matchers: those based
1    Introduction                                                  on the backtracking algorithm.1 These include, e.g., the regex
                                                                   matching engines of wide-spread programming languages
Matching regexes (regular expressions) is a ubiquitous task of     .NET, Python, Perl, PHP, Java, JavaScript, and Ruby. The ba-
various software, used, e.g., for searching, data validation,      sic backtracking algorithm is simple and easily extensible
detection of information leakage, parsing, replacing, data         with advanced features, however, it is at worst exponential in
scraping, or syntax highlighting. It is commonly used and          the text length. Regexes prone to extreme running times are
natively supported in most programming languages [7]. For          easily constructed and found in practice [11]. ReDoS analyz-
instance, about 30–40 % of Java, JavaScript, and Python soft-      ers can often find triggering texts for regexes used in practice,
ware uses regex matching (as reported in multiple studies;         and even some analytical methods for identifying regexes
see, e.g., [10]).                                                  vulnerable to backtracking were proposed (cf. Section 3).
   Regex matching is a computationally intensive process of-          In contrast to the above mentioned works on vulnera-
ten applied on large texts. Predictability of its efficiency has
                                                                       1 Essentially, a backtracking matcher descends through the syntactic struc-
a significant impact on the overall usability of software ap-
                                                                   ture of the regex, finds a mapping of the letters from the text to the atomic
plications. However, no matching algorithm is perfect, and         regex sub-expressions. Seen through the lens of a non-deterministic automa-
an unlucky combination of a regex and text may increase the        ton compiled from the regex, backtracking is a depth-first exploration of the
matching time by a few orders of magnitude. Unfortunately,         tree of all runs along the input line.




USENIX Association                                                                        31st USENIX Security Symposium                   4165
bility of backtracking-based matching, we present the first                  S NORT [25]), which tells the matcher that after seeing ‘%’, it
systematic study of the vulnerability of nonbacktracking                     can accept after exactly 1000 characters other than carriage
automata-based matchers. Automata-based matchers evolved                     return ‘\x0d’ and line feed ‘\x0a’. The NFA of the regex is
from Thompson’s algorithm [43] (also referred to as NFA-                     heavily non-deterministic and has more than 1,000 states. The
simulation, where NFA stands for nondeterministic finite au-                 minimal DFA has more than 21000 states (it needs to always
tomaton). In essence, the algorithm is a breadth-first explo-                “remember” all positions of the character ‘%’ within the last
ration of the runs of the NFA for the given regex along the                  seen 1,000 characters other than ‘\x0d’ and ‘\x0a’). The
input text. In combination with caching, it becomes an on-                   DFA states produced by the determinisation during matching
the-fly subset construction of the DFA (deterministic finite                 may also be large, namely, they are sets of up to 1000 NFA
automaton), also called online DFA-simulation. Forms of                      states. A text on which the DFA would reach many different
online DFA-simulation are implemented in Google’s RE2 li-                    large DFA states is highly problematic for most matchers,
brary [17], the standard GNU grep program [19], the Rust                     backtracking as well as online DFA-based. Such a text is,
standard regex matcher [14], or Symbolic Regex Matcher                       however, also highly specific and the probability of generating
(SRM) [38].2 Intel’s Hyperscan [8] uses a variation of NFA-                  it randomly is low (the text must contain sub-strings of 1,000
simulation algorithm as one of its components, among a num-                  characters other then ‘\x0d’ and ‘\x0a’ with varying and
ber of other techniques.                                                     frequent placements of ‘%’). Our evil text generator is the only
    The automata-based approaches are harder to implement,                   automated tool we know of that can discover such text.
and thus less flexible. On the other hand, there are years of                    Our generator is based on heuristics that generate expensive
empirical evidence showing much more stable performance                      runs of the DFA of the regex. Besides a general algorithm
of these approaches, implemented, e.g., in Google’s RE2 en-                  applicable to any regex, it features a heuristic specialising
gine [17]. Their worst-case complexity is linear in the length               on bounded repetition, based on an analysis of the so-called
of the input text. Therefore, automata-based matchers are over-              counting-set automata [46]. Especially with extended regexes
whelmingly preferred when avoiding regex vulnerabilities is                  such as the regex ‘%[^\x0d\x0a]{1000}’ from above, it is
a priority, and they are now prevailing in performance-critical              capable of forcing creation of many large DFA states—the
industrial applications such as network intrusion detection                  number of these states may be exponential and their size may
systems (NIDSes) [25, 30] and credential scanning [27].                      be linear in the repetition bound (i.e., 1,000 in our example),
    We present the first systematic large-scale study of vul-                dramatically increasing the matching time. 3
nerability of automata-based matching, focused especially                        We evaluate our generator on a comprehensive database
on online DFA-simulation. We focus on what seems to be                       of regexes (from software projects at GitHub [12], net-
the main weakness of the online DFA-simulation approach:                     work intrusion detection systems [2, 25, 37], detection of
bounded repetition (or bounded quantifier/counting operator),                security breaches [20, 45], academic papers [47, 54], posts
which is a commonly used feature of extended regexes. The                    on Stack Overflow [31], and the RegExLib database [36])
bounded repetition operator allows to concisely express that                 against a set of major industrial regex matchers (RE2,
some pattern is repeated a specified number of times, e.g.,                  grep, Hyperscan [8, 17, 19], as well as standard library
in the regex ‘(ab){100}’, the bounded quantifier ‘{100}’                     matchers of .NET, Python, Perl, PHP, Java, JavaScript,
specifies 100 repetitions of the string ‘ab’. It has been rec-               Rust, and Ruby) and compare its performance against ex-
ognized that regexes that use bounded quantifiers can suffer                 isting ReDoS generators (RXXR2 [35], RegexStatic [50],
from performance problems both in backtracking (cf. [32])                    RegexCheck [53], and Rescue [39]). The results of
and nonbacktracking matchers (cf. [21]). To the best of our                  the evaluation substantiate the following conclusions,
knowledge, until now, this problem has, however, never been                  which are also the main contributions of the paper:
studied systematically, and concrete possibilities of exploiting
it for ReDoS have not been analyzed.                                           1. Bounded repetition is an Achilles heel of automata-based
                                                                                  matchers and our novel generator is the only one that
Our approach. We present an algorithm for generating evil                         can effectively generate ReDoS texts for them.
texts that target automata-based matchers. We target mainly                    2. On the other hand, without bounded repetition, Re-
matchers based on online DFA-simulation, but our techniques
                                                                                 3 Bounded repetition may be expressed without the counting, by simply
can also be effective with other kinds of automata-based
                                                                             repeating the pattern the needed number of times, leading to the same DFA.
matchers, such as Hyperscan (cf. Section 6.6). Our exper-                    This is, however, impractical and almost never used. The pitfalls of counting
iments confirm that our generator is the first one effective in              show even in the worst case complexity of the DFA and matching algorithms.
finding evil texts for automata-based matchers.                              In contrast to basic regexes, where the DFA is exponential and the matching
                                                                             time is linear to the size of the regex (when matching by automata algorithms
   As an example, consider the regex ‘%[^\x0d\x0a]{1000}’                    such as online DFA simulation), bounded repetition leads to a doubly expo-
(from the database of regexes of the intrusion detection system              nential DFA and singly exponential matching time. This is because the DFA
                                                                             for a bounded repetition is exponential in the repetition bounds (or their mul-
   2 SRM is based on symbolic Antimirov derivatives [3] constructed on the   tiple in the case of nested bounded repetitions, as in ‘((a{10}){10}){10}’),
fly, also in the spirit of online DFA construction.                          which is again exponential in the size of their decadic numerals.




4166     31st USENIX Security Symposium                                                                                         USENIX Association
       DoS generators have none or negligible success with          Finite automata. We consider nondeterministic finite au-
       automata-based matchers.                                     tomata (NFAs) over Σ of the form A = (Q, δ, q0 , F) where Q
    3. Our new ReDoS generator can indeed generate attacks          is a finite set of states, δ is a set of transitions of the form
       on practical applications where the performance of regex     q→  →r with q, r ∈ Q and a ∈ Σ, q0 ∈ Q is the initial state,
                                                                       (a)
       matching is critical, namely on S NORT 3 with enabled        and F ⊆ Q is the set of final states. The language of the au-
       Hyperscan [25] as well as hardware accelerated regex         tomaton, denoted L(A), is the set of all words a1 . . . an , n ≥ 0,
       matching on the NVIDIA BlueField-2 DPU [29]. For             for which the automaton has an accepting run, a sequence of
       both technologies, we achieved a slowdown of regex           transitions q0 → (a1→
                                                                                        ) q1 →(a2→ ) ··· → (an→
                                                                                                              ) qn with qn ∈ F.
       matching engines by a few orders of magnitude, tested           The automaton is deterministic (DFA) if for every state q
       on regexes from real-world S NORT rulesets.                  and symbol a, δ has at most one transition q →        →r. Any NFA
                                                                                                                         (a)
                                                                    can be determinised by the subset construction, which creates
Organization. After preliminaries and related work in Sec-
                                                                    the DFA A0 = (Q0 , δ0 , q00 , F 0 ) with Q0 = 2Q , i.e., with subsets
tions 2 and 3, we present our main technical contribution,
                                                                    of A as the new states, the singleton {q0 } as the initial state q00 ,
the ReDoS generator targeting automata-based matchers, in
                                                                    with sets intersecting with F being final, i.e., F 0 = {S ⊆ Q |
Sections 4 and 5. Section 4.1 analyses a model of an online
                                                                               / and with the successor of a state S ⊆ Q under
                                                                    S ∩ F 6= 0},
DFA-simulation based matcher. The analysis gives grounds to
                                                                    a symbol a constructed as the set of a-successors of the NFA
develop our novel ReDoS generator in Section 4.2, based on
analysing the regex’s DFA. Section 5 then presents its speciali-
                                                                    states in S, S → →S0 ∈ δ0 for S0 = {s0 | s ∈ S ∧ s →
                                                                                    (a)                                       →s0 ∈ δ}.
                                                                                                                             (a)

sation to bounded repetition. Section 6 details the experiments,    Pattern matching. In its simplest form, pattern matching is
giving evidence of vulnerability of automata-based matching         the problem of deciding whether a given word (line) w has an
against bounded repetition, including concrete practical im-        infix conforming to a given regex R. In other words, it decides
plications, and Section 7 suggests possibilities of mitigating      whether w can be written as a concatenation x.v.y such that
the implied security risks.                                         v ∈ L(R), i.e., w ∈ L(.* R .*). Anchors, ‘^’ at the start of the
                                                                    regex and ‘$’ at the end, can be used to force the match v start
2     Preliminaries                                                 at the beginning of the line (the prefix x is empty) or end at
                                                                    the end of the line (the suffix y is empty), respectively.
We will recall needed formal concepts: words, languages,               Besides the simplest problem of deciding whether a match
regular expressions and automata as well as the essentials          appears on a single input line, which is the single-line mode
of pattern matching, matching algorithms, ReDoS and the             of matching, we will also consider matching in the multi-line
considered attacker model.                                          mode, in which the matcher is supposed to filter all lines of
Words, languages, regular expressions. We consider                  the input text that match the regex.
a fixed finite alphabet of characters/symbols Σ (presumably         Approaches to pattern matching. We distinguish two fam-
a large one such as Unicode). Words are sequences of charac-        ilies of pattern matching algorithms used in practice: back-
ters from Σ, with the empty sequence denoted by ε. Languages        tracking and nonbacktracking automata-based algorithms.
are sets of words. The operators of concatenation · and itera-         (1) Backtracking [40] algorithms in their simplest form
tion ∗ applied on words or languages have the usual meaning.        use a recursive procedure that descends the syntactic tree of
We consider the usual basic syntax of regular expressions           the regex while reading the text from the left to the right
(a.k.a., regexes) generated by the grammar                          and matching its characters against sub-expressions of the
         R ::= α | (R) | R R | R|R | R* | R{n,m}                    regex. Since disjunction and iteration offer a choice, the re-
                                                                    cursion backtracks to the last unexplored choice when the
where n, m ∈ N, 0 ≤ n, 0 < m, n ≤ m, and α is a charac-             matching fails. It is in fact very similar to a depth-first ex-
ter class, i.e, a set of characters from Σ. A character class       ploration of all runs following the input line through an NFA
is most often of the form a, ., [a1 -b1 a2 -b2 ...an -bn ], or      corresponding to the regex. Since such matchers are concep-
[^a1 -b1 a2 -b2 ...an -bn ], denoting a singleton containing        tually very simple (a basic implementation takes a few lines
the character a ∈ Σ, the entire set Σ, a union of n intervals of    of functional code (e.g. [34], page 7) and since they are pro-
characters, or the complement of the same, respectively.            cessing a single path through the NFA at a time, backtracking
   The language of a regex R, denoted L(R), is constructed          algorithms are flexible and amenable to easy extensions with
inductively to the structure of R, from its atomic sub-             features such as priority of matched sub-expressions, sub-
expressions, character classes, using the language operations       matching, or back-references. Nonetheless, as the number of
denoted by the regex combinators. They are understood as            NFA runs over a single line is in the worst case exponential
usual: two regexes in a sequence stand for the concatenation        in its length, the worst-case complexity of matching using
of their languages, ‘|’ is the choice or union, ‘*’ is the itera-   a backtracking matcher is exponential in the length of the
tion, and ‘{n,m}’, is the bounded iteration, equivalent to the      text. Extreme matching times do not occur often if regexes
union of i-fold concatenations of its operand for n ≤ i ≤ m.        are written defensively, and modern implementations are fast,



USENIX Association                                                                       31st USENIX Security Symposium            4167
especially when an accepting path is guessed early. How-          cally, we assume a remote service utilizing a regex matcher
ever, overlooking a dangerous regex is easy and writing such      with a set of deployed regexes that are required for the oper-
a regex intentionally is even easier. For instance, when run      ation of the service. We assume that some of the deployed
on the regex ‘(a|b|ab)*bc’ against the input string (ab)n ac      regexes contain bounded repetition. The attacker knows which
with n = 50, standard matchers in Java, Python, and .NET be-      regexes are deployed at the service, or has a way of informed
come unresponsive [34]. Examples of industrial backtracking       guessing (e.g., Snort regexes are public or easily obtainable
matchers include regex matchers in the standard libraries of      via subscription, open source web development frameworks
.NET, Python, Perl, PHP, Java, JavaScript, and Ruby.              have known regex input validators, etc.).
    (2) A basic and naive automata-based matching alterna-           The attacker can access the service in a way that enables
tive to backtracking is the (offline) DFA-simulation, which is    triggering remote execution of the regex matcher (with de-
based on constructing a DFA for the regex. Having the DFA         ployed regexes) on an arbitrary (i.e., provided by the attacker)
at hand is the best scenario for matching since every character   input text. The goal of the attacker is to pass into the service
is then processed in constant time by simply following the        an (evil) text that will render the service unavailable (causing
unique transition from the current DFA state to the successor.    a denial of service) or impose a significant performance drop
The problem is that determinisation may explode exponen-          due to the consumption of an exceptionally high amount of
tially, rendering matching slow or unfeasible (the matcher        computational resources. In such cases, we say that the regex
may time out already during the DFA construction). This           is vulnerable for the respective matcher, and we consider three
approach is therefore seldom used in practice.                    different views on vulnerability. Given a fixed length of text,
    A more practical alternative to DFA-simulation is based       it can mean one of the following (a detailed description is
on Thompson’s algorithm [43] aka NFA-simulation. NFA-             given in Section 6.1):
simulation essentially differs from the backtracking algo-         (a) exceeding a certain time interval for processing of a text
rithm by replacing the depth-first NFA exploration strategy             of the given length,
by a breadth-first search strategy. Reading each symbol of the     (b) exceeding a certain ratio of the measured time w.r.t. ‘nor-
text means updating the set of all NFA states reached by runs           mal’ time for the given matcher, or
over the so far processed prefix of the line. The time needed      (c) exceeding a certain ratio of the measured time w.r.t. ‘nor-
to process each symbol is thus linear to the size of the NFA            mal’ time for the given matcher relative to the particular
(an iteration through all transitions over the symbol starting          regex, assuming some knowledge of a normal matching
in the current set of states), and the entire matching is only          time for each regex.
linear in the length of the line. An advanced implementation
of NFA-simulation is a part of Intel’s Hyperscan [8] (among
                                                                  3   Related Work on ReDoS
a number of other techniques such as advanced use of the
Boyer-Moore algorithm [5] for string-matching, innovative         ReDoS [32] vulnerabilities have typically been attributed to
parallelisation, or using specialised processor instructions).    backtracking-based matching, as discussed in depth in [10,11].
    A crucial ingredient for the performance of several practi-   Backtracking regex matching engines are essentially Turing
cal matchers is caching. The reached sets of NFA states are       complete (cf. [24]) and therefore most analysis questions
actually states of the DFA constructed by the subset construc-    about them are difficult or undecidable. All prior research on
tion, while a DFA state and its successor reached after read-     ReDoS generators has focused on methods that attempt to
ing a symbol constitute a DFA transition. The encountered         generate inputs that essentially cause excessive backtracking
DFA states and transitions are cached. When the matching          at runtime, effectively causing non-termination of matching.
algorithm stays inside the cache of transitions, it is exactly    Here we summarize main such approaches.
the same as the offline DFA simulation, with constant per-           We focus mainly on static ReDoS generators, which anal-
character complexity. We will call the version with caching       yse a regex statically, as opposed to dynamic generators,
online DFA-simulation (following the terminology of [14]).        which analyse a profile of a regex matcher run. Static ReDoS
Online DFA-simulation can achieve much better performance         generators are primarily based on the NFA representation of
and especially stability and resilience against ReDoS than        regexes [22] and exploit different techniques, such as pump-
backtracking. The disadvantage is perhaps a less straightfor-     ing analysis [22, 34], transducer analysis [42], adversarial
ward implementation, which implies lower flexibility. Also,       automata construction [53], and NFA ambiguity analysis [51].
it is not clear how to extend online DFA-simulation with ad-      Such techniques can be sound and even complete for certain
vanced regex features such as back-references. Well-known         classes of regexes. Their main disadvantages are a high rate
examples of industrial matchers based on DFA-simulation           of false positives and ineffectiveness against nonbacktrack-
include RE2 [17], grep [19], SRM [38], or the regex matcher       ing regex matching engines. An overview of existing ReDoS
in Rust [14].                                                     generators follows:
ReDoS and associated attacker model. This paper deals                RegexStatic [51] classifies the worst-case simulation
with vulnerability of regex matchers against ReDoS. Specifi-      cost for a regex on an input as linear, polynomial, or expo-



4168   31st USENIX Security Symposium                                                                      USENIX Association
nential based on how the depth-first search tree is predicted        4.1    Hypothetical Matcher
to evolve during backtracking. It supports also nonregular
features like back-references.                                       We first discuss a hypothetical matcher, which will serve as
                                                                     a model target for our ReDoS generator described later in
    RegexCheck [53] also identifies if a regex has linear,
                                                                     Section 4.2. The model was created by studying the imple-
super-linear, or exponential time complexity based on its NFA.
                                                                     mentations of the regex matchers in grep, Rust, SRM, and
Moreover, it can construct an attack automaton capturing all
                                                                     RE2. It uses online DFA-simulation with a specific manage-
those strings that trigger the worst-case behaviour. It also
                                                                     ment of the DFA cache, similarly to the mentioned match-
combines static and dynamic analysis to avoid false positives.
                                                                     ers. Our model does not take into account specific advanced
It has limited support for extended (nonregular) features.
                                                                     optimizations and implementation techniques used in real
    RXXR2 [34, 35] constructs an NFA from a given regex and          performance-oriented matchers. Taking them into account
then it searches for instances of a pattern in the NFA using         might, of course, improve the performance of the generator
an efficient pattern matching algorithm. It searches all sub-        for a specific matcher, but our goal is a ReDoS generator that
expressions for exponential vulnerability in a form of e1 e∗2 e3     is universal and simple; therefore we use a model that cap-
where e1 is a prefix expression, e3 is a suffix expression, and      tures only the most important common aspects. Despite that,
e∗2 is a vulnerable expression. The result is an attack string       the real-world matchers are quite close to this hypothetical
xyn z such that x ∈ L(e1 ), y ∈ L(e3 ) and xyn z 6∈ L(e1 e∗2 e3 ).   matcher (only Hyperscan is related more loosely, since it uses
    SlowFuzz [33] is a dynamic fuzzing tool. It is based on          the most radical innovations, combined with NFA-simulation
an evolutionary fuzzer [23] that searches for those inputs that      instead of online DFA-simulation).
can trigger a large number of edges in the control flow graph
                                                                     The matching algorithm and its complexity. The hypo-
of the program under testing. However, it lacks knowledge
                                                                     thetical matcher implements the online DFA-simulation algo-
of regex structures, which may lead to false negatives. The
                                                                     rithm with the following management of the cache: (i) When
results in [33] compare matching slowdown among individual
                                                                     the cache exceeds some size, it is reset and (ii) if the cache
iterations of the algorithm. Out of the tools mentioned here, it
                                                                     utilization is too low or is reset too often, the matcher disables
is the most general tool for generating evil texts, since it can
                                                                     the cache completely and reverts to pure NFA-simulation.
handle most of the extended features supported in regexes.
                                                                        Algorithm 1 describes the hypothetical matcher in pseu-
    Rescue [39] combines dynamic and static techniques us-           docode. It simulates a run of the DFA obtained by subset
ing a genetic search algorithm as a guide. The aim is to find        construction from the input NFA A = (Q, δ, q0 , F) along the
an input string that maximizes the number of matching steps,         input word w. In order to do this without constructing the
using regex search profiling data. The maximum string length         entire DFA up-front, it uses the class DFA, which constructs
is set to 128. A string is classified as exposing a ReDoS vul-       DFA transitions and encountered DFA states lazily, on de-
nerability if it causes more than 108 matching steps.                mand, and saves them for further use. Namely, it stores integer
    Finally, let us note that existing generators sometimes          IDs of the encountered DFA states (subsets of Q) in a hash
aim at extremely severe vulnerabilities, for instance, where         table state2id, paired with the inverse mapping id2state of
a backtracking-based matcher gets completely stuck on a text         the DFA states back to their IDs. A discovered DFA state is
hundreds of characters long (e.g. [39]). Automata-based              identified with the number of the so far identified states plus
matchers do not exhibit vulnerabilities this severe, but they        one (Line 17). The ID of the target state of each used DFA
can still be slowed down by several orders of magnitude, for         transition is saved in the map successor, accessible under the
which they need a long-enough input text (in the order of            ID of the source state and the symbol on the transition. The
megabytes). These are the vulnerabilities that we target.            map final records whether an ID belongs to a final state.
                                                                        The i-th character w[i] of the input line is processed in
                                                                     a single iteration of the for loop on Line 3. The cost of the
4   ReDoS Generation                                                 iteration depends on whether the DFA transition is in the
                                                                     cache or not. If yes, then successor[q, w[i]] on Line 22 simply
We now discuss our ReDoS generator, i.e., a tool that gener-         returns the ID q0 of the successor of the current state ID q.
ates an evil text for a given regex. We target primarily non-        The lookup has a small constant cost (accessing the index w[i]
backtracking automata-based matchers, mainly those based             of an array of successors associated with q).
on online DFA-simulation (although, as we show in Sec-                  On the other hand, if the DFA transition is not cached, then
tion 6, our technique works for backtracking matchers as             it must be constructed, which is expensive: The construction
well, and it can be tweaked to cause significant troubles also       requires to iterate through all w[i]-transitions originating from
to Hyperscan, which uses NFA-simulation).                            the NFA states in the current DFA state S (Line 25). The cost
   The generator, combined with a technique that exploits            of this iteration depends on the size of S and the number of the
counting presented subsequently in Section 5, is the main            used NFA transitions, both of which can be bounded by |A|
technical contribution of our paper.                                 (the size of A, |A| = |Q| + |δ|). Furthermore, the book-keeping



USENIX Association                                                                      31st USENIX Security Symposium           4169
costs of the cache of DFA states, paid after every cache miss      them a set of up to k + 1 states of the NFA.4
on Line 22, is also significant (although dominated by the            The algorithm manages limited resources available for
cost of constructing the transition on Line 25). Looking up        the cache on Lines 7 and 8. The cache is reset on Line 7
a DFA state on Line 14 and adding a DFA state on Line 26           if it grows beyond some predefined bound (given by the
both take time proportional to the size of the DFA state.          method dfa.big(), whose implementation would be matcher-
 Algorithm 1: Hypothetical matcher                                 specific). The size of the cache is computed as the sum
                                                                   of sizes of cached DFA states plus the number of cached
  Input :NFA A = (Q, δ, s0 , F), word w
                                                                   transitions, ∑{|S| : DFA.state2id[S] 6= None} + |{(id, a) :
  Output :true iff w ∈ L(A), otherwise false
                                                                   DFA.successor[id, a] 6= None}| (note that larger DFA states
1 dfa ← new DFA()                                                  hence contribute more to the size of the cache). Line 8 may
2 q ← dfa.init({s0 })                                              then entirely disable caching if the cache is reset too often
3 for i ← 1 to |w| do                    // O (|w| · |A|)          or if its utilisation is too low (given by a matcher specific
4     if dfa.final[q] then return true                             implementation of dfa.ineffective()). Disabling the cache
5     q0 ← dfa.get_successor_id(q,w[i]) //O (|A|)                  means reverting to NFA-simulation in which every step must
6     q ← q0                                                       iterate through all NFA states in the current set and all their
 7      if dfa.big() then q ← dfa.init(dfa.id2state[q])            transitions with the current letter.
 8      if dfa.ineffective() then disable DFA caching              Multi-line mode. The matcher described above works in
9    return false                                                  the single-line mode. In the multi-line mode, the for loop
                                                                   on Line 3 is wrapped in an iteration over all lines and every
10 class DFA:                                                      matched line is reported. Importantly, the DFA cache is not
11     state2id : 2Q → N; id2state : N → 2Q ;                      reset after processing one line, but is re-used when processing
12     successor : N × Σ → N; final : N → {true, false}            subsequent lines.
13     method get_state_id(S ⊆ Q):
14         q ← state2id[S]                    // O (|S|)           4.2     ReDoS Generation Algorithm
15         if q = None then                                        As follows from the analysis above, our best shot to stress
16              q ← state2id.cardinality + 1                       the hypothetical matcher is to attempt to increase its runtime
17              state2id[S] ← q               // O (|S|)           close to O (|w| · |A|) by rendering the cache ineffective and
18              id2state[q] ← S                                    forcing construction of many large DFA states and transi-
19              final[q] ← (S ∩ F 6= 0)
                                     /                             tions whose computation is expensive. For that, recall that
20          return q                                               every newly discovered DFA state S ⊆ Q is searched for and
                                                                   inserted into the cache, with a cost linear to its size, and sub-
21      method get_successor_id(q ∈ N, a ∈ Σ):                     sequently causes a cache miss and forces the construction of
22         q0 ← successor[q, a]                 // O (1)           a transition on Line 25, with a cost linear to the number of
23         if q0 = None then                                       w[i]-transitions starting in S. The size of S also determines
24              S ← id2state[q]                                    the cost of looking up and inserting DFA states to the cache
25              S0 ← {s0 | s ∈ S, s →→s0 ∈ δ} // O (|A|)
                                    (a)                            on Lines 14 and 26. The cost of creating the DFA transition,
26              q0 ← get_state_id(S0 )        // O (|S0 |)         that is, at most the number of the NFA transitions, is usually
27              successor[q, a] ← q0                               strongly correlated with the size of the source state S (even
28          return q0                                              though it is not precisely determined by it since it depends on
                                                                   the transition relation).
29      method init(S ⊆ Q):                                           Our aim is, therefore, to produce a text that discovers many
30         id2state ← state2id ← successor ← final ← 0/            different large DFA states as fast as possible. In other words,
31         return get_state_id(S)                                  we want to force a DFA run (or a sequence of runs in the case
                                                                   of multi-line matching) with a high ratio of the sum of sizes of
   The complexity of matching with a high utilization of the       newly discovered DFA states and the text length. We will call
cache is therefore approaching O (|w|), but in the worst case,     this ratio the evilness of the text. Highly evil texts cause a low
with a low cache utilisation, it increases to O (|w| · |A|). The   cache hit/miss ratio, the cache also fills up quickly, must be
multiplicative factor |A| may be especially high with extended     reset frequently, and there is a high chance that the utilisation
regexes with the bounded repetition operator, where the size       of the cache drops to the point where it is completely disabled.
of |A| is linearly dependent on the repetition bounds (this is
                                                                   ReDoS generator overview. Our ReDoS generator con-
exponential in the size of the regex, assuming that the bound
                                                                   structs a text w with high evilness as a concatenation w1 · · · wn
is given as a decadic or similar numeral). For instance, the
NFA for the regex ‘.*a.{k}’ needs k + 1 states and the DFA            4 The ‘.*’ in the regex is included for clarity, but note that it is redundant

obtained by the subset construction has 2k+1 states, each of       in the absence of anchors.




4170     31st USENIX Security Symposium                                                                                 USENIX Association
of lines, each line wi generated by a run ρi starting at the        in the form q0 →   (a1→
                                                                                          ) q1 →(a2→
                                                                                                   ) ... →(an→
                                                                                                             ) qn by taking qn = q,
initial state of the DFA. Each run ρi first takes the shortest      qi = pre(qi+1 ), and ai = σ(qi ) for all 0 ≤ i < n, and return
possible path through the already visited part of the DFA to        the word a1 . . . an read along this run. The starting state q of
a largest discovered but so far unvisited state, referred to as     ρi is chosen on Line 8 from unvisited by selecting the DFA
the starting state of ρi , from where it navigates to new unvis-    state (obtained as dfa.id2state[q]) of the largest size with the
ited DFA states through DFA transitions chosen according to         smallest distance d(q).
some successor selection criterion.                                    The suffix of the run, ρ0i , is where the text supposed to
   The run ρi is thus a concatenation ρ1i .ρ2i of a prefix ρ1i      increase the cost of matching is generated. The algorithm
through already visited DFA states and a suffix ρ2i through         navigates through unexplored DFA states according to the
unvisited states. The criterion for navigating the second phase,    strategy given by the input parameter S TRATEGY as long as
that is, for selecting unvisited successors while constructing      the current state q has some unexplored non-final successor p
the suffix, is a parameter of the algorithm. The basic strategy,    (Line 20). Namely, the for-loop on Line 13 collects into succ
called G REEDY, simply selects the largest unvisited successor.     all transitions leading to non-final and not yet visited DFA
(alternatives will be discussed later). This drives the explo-      states from the current state q (as pairs consisting of the target
ration towards large new states. The run ρi then ends when it       state p and symbol a). The particular transition is selected
cannot continue to any unvisited and non-final state.               from there according to the criterion S TRATEGY on Line 21.
   Avoiding final states has the following rationale. Obvi-
                                                                      Algorithm 2: DFA-based text generation
ously, continuing a line after reaching a final state would be
counterproductive because the matcher has already returned             Input: An NFA A = (Q, δ, s0 , F),
true. Avoiding final states altogether additionally means that                  successor selection criterion S TRATEGY
we generate only non-matching lines, which is motivated                Output: evil text w (concatenation of several lines)
by the fact that we ideally want texts that are hard for on-         1 dfa ← new DFA

line DFA-simulation-based as well as backtracking matchers.          2 q0 ← dfa.init({s0 })

Non-matching lines are generally harder for backtracking             3 unvisited.enqueue(q0 )

matchers. They cannot terminate early after finding a single         4 d(q0 ) ← 0

accepting NFA run but are forced to explore the entire tree of       5 visited ← 0  /
runs over the input line.                                            6 w←ε
                                                                     7 while unvisited 6= 0    / do
ReDoS generator in detail. We present the algorithm for              8      q ← unvisited.dequeue_nearest_largest()
generating ReDoS attacks in detail as Algorithm 2. Since             9      visited.add(q)
constructing the entire DFA may be infeasible due to its size,      10      w ← w · prefix(q)
the algorithm again uses the implicit DFA that is a part of         11      while true do
the hypothetical online DFA matcher in Algorithm 1 and thus         12           succ ← 0/
constructs only those parts of the DFA used to process the          13           for a ∈ Σ do
generated text.                                                     14                p ← dfa.get_successor_id[q, a]
   Every iteration of the while-loop on Line 7 generates one        15                if dfa.final[p]∨ p ∈ visited then continue
line of the text, namely, the i-th iteration generates wi by con-   16                succ.add(p, a)
structing the run ρi . The algorithm maintains a set visited        17                unvisited.enqueue(p)
of IDs of DFA states that were visited by some run ρi , and         18                if d(q) + 1 < d(p) ∨ d(p) = None then
a set unvisited of IDs of discovered but yet unvisited states.      19                     (d(p), σ(p), pre(p)) ← (d(q)+1, a, q)
The while loop terminates when there are no states remaining
in unvisited. To select the starting state q of ρi (Line 8) and     20         if succ = 0/ then break
construct the shortest run to q quickly (via function prefix        21         (q0 , a) ← succ.choose(S TRATEGY)
on Line 10), the algorithm uses a mechanism analogous to            22         unvisited.remove(q0 )
the one used in Dijkstra’s algorithm for computing the short-       23         visited.add(q0 )
est paths from a given source: Every discovered DFA state           24         q ← q0
p ∈ visited ∪ unvisited remembers the last transition in the        25         w ← w·a
shortest discovered run from the initial state to p, namely, the    26      w ← w · \n
predecessor state pre(p) on the run and the symbol σ(p) on
its last transition. The state p also remembers the length (dis-    27   return w
tance) d(p) of the shortest run. The values of pre(p), d(p),
and σ(p) are updated whenever a transition to the state p           Exploration strategies. The ReDoS generation algorithm
is taken (Lines 18 and 19). If the run ending by that tran-         is parameterized by the strategy of exploration of unvisited
sition is shorter than the current shortest run, the function       DFA states, represented by the successor selection criterion
prefix(q) can then construct the shortest discovered run to q       S TRATEGY. We will consider the following three strategies.



USENIX Association                                                                       31st USENIX Security Symposium         4171
   The first strategy, R ANDOM, picks from succ a random            NCA runs from Figure 1a on the word a100 generates config-
successor. This produces mostly random but still ‘reasonable’       urations (q, c = 0), (s, c = 0), (s, c = 1), . . . , (s, c = 99), but the
texts, for which the matcher does not return false before the       NCA can postpone the transition into s arbitrarily, leading
line ends, because the DFA run never leaves the area of useful      to different values values of c. It is easy to see that one can
DFA states. We use R ANDOM as the baseline to confirm that          construct an NFA whose set of states is the set of reachable
the reasoning behind our other two selection criteria, supposed     configurations of an NCA; the runs of such an NFA would go
to generate highly evil texts, works.                               precisely through the same configurations as the runs of the
   The simpler of the two strategies, G REEDY, navigates the        NCA over the same word.
search towards large DFA states by always choosing the suc-            The so-called naive determinisation of the NCA then pro-
cessor corresponding to the largest set of states. On the other     duces a standard DFA that would be obtained by the subset
hand, the more complex strategy C OUNTING is then opti-             construction from the induced NFA described above. The
mized towards generating texts for regexes with bounded             states of the DFA are thus sets of the configurations. For the
repetition; it is discussed in detail in the following section.     example from Figure 1a, a run of the DFA on the word a100
                                                                    would traverse through the following sequence of DFA states
5   ReDoS Generation for Bounded Repetition                         (recall that each set of configurations is one state of the DFA):
We will now discuss the specialisation of the ReDoS generator               {(q, c = 0)},
from the previous section for regexes with counting. That is,
                                                                            {(q, c = 0), (s, c = 0)},
we will specify the successor selection criterion C OUNTING
used as the parameter S TRATEGY in Algorithm 2.                             {(q, c = 0), (s, c = 0), (s, c = 1)},
   Regexes with bounded repetition are the main focus of our                ...
work since their DFAs tend to have extremely many large                     {(q, c = 0), (s, c = 0), (s, c = 1), . . . , (s, c = 99)}.
states. This shows even in the worst case complexity of on-
line DFA-simulation (as well as of NFA-simulation), where           Our ReDoS generator therefore navigates through a space
processing each input character can take a number of steps          of such DFA states. The states may be extraordinarily large
exponential to the size of the regex (the complexity is linear to   especially when the NCA configurations within them have
the repetition bounds, which are represented using a logarith-      many distinct counter values, such as in our example, where
mic number of bits). The general idea of generating evil texts      the run on the word a100 ends in a DFA state where the control
for bounded repetition is the same as for normal regexes—to         state s is paired with 100 values.
force many different and large DFA states. We propose an
optimized strategy for navigating towards them.                     Counting-set automata. Our heuristic for navigating
                                                                    through such DFAs towards large states attempts to increase
Counting automata. To explain the strategy, let us first            the number of counter values. To do that, we take advan-
have another look at compilation of bounded repetition to au-       tage of our earlier work on determinisation of NCAs into the
tomata. Since the NFAs for bounded repetition might already         so-called counting-set automata (CSAs) [46]. Namely, [46]
be too large (linear in the repetition bounds, exponential in       shows how an NCA can be determinised into a CSA of a size
the size of the regex), we use succinct automata with counters      independent of the counter bounds (unlike DFA, which may
that count repetitions of the counted sub-expressions at run-       be exponentially large). The CSA is a deterministic machine
time. Since the counter values are not a part of the automata       that simulates the DFA but achieves succinctness by comput-
control state, they are only computed at runtime, the size of       ing the counter values only at runtime, as values of a certain
these automata is independent of the counter bounds and only        kind of registers. Since a single DFA state contains many
linear in the size of the regex.                                    counter values paired with NCA control states, these registers
   We use a formalisation of these automata as nondeterminis-       must be capable of holding a set of integer values. We call
tic counting automata (NCAs) from [46], which also discusses        these registers, which store sets of integers, counting sets. A
their compilation from regexes with bounded repetition. See         transition may then update a counting set c by increment-
an example NCA for the regex ‘.*a.{100}’ in Figure 1a. As           ing all its elements, resetting it to the singleton {0}, adding
seen in the figure, a transition of the NCA can reset a counter     the element 0 or 1 to it, and test whether the minimal or the
to 0, keep it unchanged, increment it, and test whether its         maximal value in the set belongs to some constant interval.5
value belongs to a specified constant interval. The values          A counting set for a counter c is also restricted to only con-
of every counter c can only reach values in between 0 and           tain values between 0 and maxc (the set-increment operation
some maxc ∈ N (the maximum number which c is compared               removes values greater than maxc ). An example of a CSA
against). A run of an NCA over a word goes through a se-                5 These operations can actually be implemented to work in constant time,
quence of configurations, pairs of the form (q, ν) where q          hence simulation of CSA gives a fast matching algorithm for bounded rep-
is a control state and ν is a counter valuation, a mapping          etition. We have implemented and tested a prototype matcher based on the
of counters to their integer values. For instance, one of the       CSA simulation in Section 6.




4172    31st USENIX Security Symposium                                                                               USENIX Association
                                                                                                               c := {0} 997.5        998                998.5             999
                                                                                                                                H               O                 S
                                                                                                                          1           2                   3                4
            . ∧ c < 100/c := c + 1          [^a]                         a/c := {0} ∪ c + 1
                                                            a
                                   c:={0}                                                                                [^\x09\x20] / c:={1}                               T
 c := 0 q      a                            {q}                          {q, s} {Max(c)≥100}
                       s
                                                                                                   0                                                1000
                   {c ≥ 100}                       [^a] ∧ Min(c) ≥ 100/
       .                                                                [^a] ∧ Min(c) < 100/       7                                                  6          5
                                                         c := {0}                                      [^\x09\x20] ∧ Min(c)<1000 / c:={1}∪c+1              \x09/ c:={1}
                                                                              c := c + 1                                                                       999.5
                                                                                                [^\x20] ∧ Min(c)<1000/c:=c+1           \x09 ∧ Min(c)<1000/c:={1}∪c+1

 (a) NCA for ‘.*a.{100}’ (b) CSA from determinization of (a)                                  (c) CSA with weights for the regex ‘^HOST\x09*[^\x20]{1000}’

Figure 1: NCA and CSA. The transitions are labeled by their guard, which specifies the input character class (‘ ’ stands for “any                   .
character”) and possibly restricts counter (or counting set) values, separated by ‘/’ from the counter update (an unspecified
update means that the value stays the same). In (b) and (c), the notation {0} ∪ c + 1 stands for the set of values obtained by
incrementing each value in c, adding 0, and removing values larger than the upper bound of the counter, 100 for (b) and 1000
for (c). The edges denoting initial states are labelled with initial values of the counters. Final states are in (a) and (b) labelled
with an acceptance condition on counters, e.g. {c ≥ 100} in (a). In (c), the final condition at states 6 and 7 is Max(c) = 1000.


is the automaton obtained by determinizing the NCA from                                       four times per every addition of 0/1 is actually filling it with
Figure 1a, shown in Figure 1b. Its run on the word a100 would                                 multiples of 4, hence it can generate a set of the size at most
                                                                                              maxc +1
generate the following sequence of configurations:                                                4   . In summary, the weight of the cycle for the counter c
                                                                                              is non-zero only if the cycle does not reset c and increments c
                           ({q}, c = {0}),                                                    at least once, and then it equals maxc multiplied by the num-
                           ({q, s}, c = {0}),                                                 ber add_cntc of additions of 0/1 to c divided by the number
                           ({q, s}, c = {0, 1}),                                              inc_cntc of increments of c, i.e. weightc = (maxcincr_cnt
                                                                                                                                                   +1)·add_cntc
                                                                                                                                                         c
                                                                                                                                                                .
                           ...                                                                The final weight of a cycle is then computed as a sum of
                                                                                              weights for individual counters ∑c∈C weightc with C being
                           ({q, s}, c = {0, . . . , 99}).                                     the set of all counters used in the automaton.
Note that the sets of values for c precisely correspond to the                                   The weights of cycles are assigned to states and propa-
values of c that s appear with in the run of the DFA shown                                    gated through the transitions of the CSA. Initially, all states
above. The run-time configurations of a run of a CSA are                                      have weight 0. We then process the cycles in the CSA one
(encodings of) states of the DFA that would be generated by                                   by one. For each of them, the first step is setting all weights
a run reading the same word.                                                                  of all states in the cycle to the maximum of their previous
                                                                                              weight and the weight of the cycle. The weight of the cycle is
Navigation towards large counting sets. Since CSAs are
                                                                                              then propagated backwards through paths reaching the cycle.
still small (relative to the DFA), they can be pre-computed
                                                                                              Namely, the weight of a state r, weight(r), propagates through
and analysed as a whole. We use such an analysis to obtain
                                                                                              a transition q →  →r so that weight(q) is assigned the maxi-
                                                                                                               (a)
guiding criteria that lead a run through their configuration
                                                                                              mum of weight(q) and weight(r) − 0.5. This is iterated as
space towards configurations with many different counter
                                                                                              long as some weight can be increased. In the end, transitions
values. Runs of CSAs simulate runs of DFAs, so such guiding
                                                                                              with heavy target states point in the direction of short paths
criteria may be directly used to navigate runs of the DFAs as
                                                                                              towards heavy cycles (the shortness is achieved through the
the successor selection criterion C OUNTING.
                                                                                              subtraction of 0.5 for every transition that the weight of the
   Particularly, in the CSA for a given regex, we try to navigate
                                                                                              cycles is propagated through).
towards cycles that are likely to create large counting sets. For
every counter c, every cycle in the CSA is assigned a weight
weightc , which represents an estimate of the maximum count-                                  Example 5.1. Consider the CSA for the regex
ing set for c that iterations of the cycle can generate. The                                  ‘^HOST\x09*[^\x20]{1000}’ (a simplified regex from
number reflects the following intuitions:                                                      S NORT [25]) in Figure 1c. States of the CSA have assigned
   First, since the counting set c can contain only values be-                                weights according to the algorithm described above. Figure 2
tween 0 and maxc , it can have at most maxc +1 elements.                                      shows the tree of DFA states obtained by Algorithm 2.
Second, the cycle is pumping up the set if (i) it does not re-                                    The underlying NFA would look similar as the CSA in
set it, (ii) it adds 0 or 1 and also increments the elements                                  Figure 1c, with the difference that there are copies of states 6
of the set (without the increment, it would be only repeat-                                   and 7 for each value of counter c between 1 and 1000
edly adding 0/1’s to a set already containing it). Third, it is                               (and there is a nondeterministic choice over ‘\x09’ in
better if only a few increments happen in between additions                                   states (6, c=i) whether to stay in (6, c=i) or go to (6, c=i +
of 0/1’s. For instance, a cycle that increments the counting set                              1)).



USENIX Association                                                                                                 31st USENIX Security Symposium                     4173
                         {(1, c=0)}          H     {(2, c=0)}       O      {(3, c=0)}        S       {(4, c=0)}       T         {(5, c=0)}
                       d:0, s:1, w:997.5          d:1, s:1, w:998        d:2, s:1, w:998.5          d:3, s:1, w:999           d:4, s:1, w:999.5

                                                                                                                          a
                {(7, c=1)}                  {(6, c=1)}
                 d:5, s:1, w:0             d:5, s:1, w:1000                                                            \x09
                        a                                               \x09
                                                    b
                {(7, c=2)}          {(7, c=1), (7, c=2)}                       {(6, c=1), (6, c=2)}
                 d:6, s:1, w:0              d:6, s:2, w:0                          d:6, s:2, w:1000
                        a                           b                                        c
                {(7, c=3)}          {(7, c=2), (7, c=3)}                  {(7, c=1), (7, c=2), (7, c=3)}
                 d:7, s:1, w:0              d:7, s:2, w:0                           d:7, s:3, w:0


               {(7, c=999)}       {(7, c=998), (7, c=999)}          {(7, c=997), (7, c=998), (7, c=999)}              {(6, c=1), . . . , (6, c=999)}
               d:1003, s:1, w:0            d:1003, s:2, w:0                        d:1003, s:3, w:0                           d:1003, s:999, w:1000

                   Figure 2: DFA states explored by Algorithm 2 on the regex ‘^HOST\x09*[^\x20]{1000}’.

   If traversed using the G REEDY strategy (assuming that                            ing efficiency problem (ReDoS attack) for the state-of-the-art
whenever there is a choice in Figure 2 between two DFA                               regex matchers especially with regexes that contain a bounded
states with the same sizes, the strategy picks the left one,                         repetition and compared with existing ReDoS generators.
e.g., when choosing between {(7, c=1)} and {(6, c=2)},                               Matchers. We experiment with the matchers introduced in
G REEDY would choose {(7, c=1)}) the traversal would first                           Section 2. We have automata-based matchers grep [19] (ver-
select the branch that goes to state 7 as soon as possible with                      sion 3.3), RE2 [17], SRM [38], and the standard regex matcher
DFA states of size 1 (the left-most branch), then it would                           in Rust [14], all four based on online DFA-simulation,
select the branch with DFA states of size 2 (the second branch                       Hyperscan [8], which uses NFA simulation, and also the
from the left), etc., generating the text:                                           prototype matcher CA [46], based on counting set automata
   HOSTaaa . . . a\n                                                                 (cf. Section 5), which specialises in handling bounded quanti-
   HOST\x09bbb . . . b\n                                                             fiers (CA implements offline CSA-simulation, i.e., it simulates
   HOST\x09\x09ccc . . . c\n                                                         a pre-constructed deterministic CSA on the input text). Then,
   ...                                                                               representing backtracking matchers, we have standard library
   HOST\x09\x09 . . . \x09yy\n                                                       regex matching engines of a wide spectrum of program-
   HOST\x09\x09 . . . \x09\x09z\n
   HOST\x09\x09 . . . \x09\x09\x09\n                                                 ming languages: .NET [26], Python [16], Perl [44], PHP [18],
The generated text is sub-optimal because it first targets “easy”                    Java [13], JavaScript [9], and Ruby [6]. We note that grep,
DFA states of size 1 and explores the most difficult path (with                      RE2, Rust, and Hyperscan are performance-oriented match-
the longest sequence of \x09) only as the last one.                                  ers containing many high- and low-level optimizations.
   On the other hand, the C OUNTING strategy avoids this by                             In Section 6.6, we also experiment with the NIDS
using the weights computed for the DFA states, which causes                          S NORT [25], which internally uses Hyperscan, and with the
that the paths are explored in the reversed order, preferring                        hardware-accelerated regex matching engine on the NVIDIA
state 6 because it has a higher weight:                                              BlueField-2 [29] card.
   HOST\x09\x09 . . . \x09\x09\x09\n                                                    Except the experiments in Section 6.6, we run our bench-
   HOST\x09\x09 . . . \x09\x09z\n                                                    marks on a machine with the Intel(R) Xeon(R) CPU E3-1240
   HOST\x09\x09 . . . \x09yy\n                                                       v3@3.40 GHz running Debian GNU/Linux (we run .NET
   ...                                                                               tools on the Mono platform [1]).
   HOST\x09\x09ccc . . . c\n                                                         Size of ReDoS text. In order to avoid low-level noise in
   HOST\x09bbb . . . b\n                                                             the measured times of matchers, we generate texts of the size
   HOSTaaa . . . a\n                                                                 ∼50 MB. We use this value since we observed that at around
Indeed, in our experiments, for this regex, RE2 took 23 times                        50 MB, the ratio between the performance of a matcher on
longer to process the text generated by C OUNTING than the                           a random text and on a generated ReDoS candidate start to
text generated by G REEDY.                                                           stabilize for many of the used matchers. Larger text sizes may
                                                                                     still increase the slowdown, but using them would rise the
6   Experimental Results                                                             cost of our experiments beyond what we can manage.
We have implemented our approach in a C# prototype called                            GadgetCA. Our generator GadgetCA generates a text for
GadgetCA and evaluated its capability of generating text caus-                       a potential ReDoS attack using our approach presented in



4174    31st USENIX Security Symposium                                                                                                            USENIX Association
Sections 4 and 5. In particular, we run the ReDoS text genera-                 is in NOCOUNTERS (395,752).
tor for 10 mins or until it completely explores the state space.                  ABOVE20 (8,099) is a subset of COUNTERS with regexes
(We emphasize that generating the ReDoS texts is not a time                    where the sum of upper bounds of bounded repetition is above
critical task, since they can be prepared in advance before an                 20 (i.e., regexes where the use of bounded repetition may
attack.) Then, we take the obtained text and copy it as many                   potentially lead to state space explosion). The rest of COUN-
times as needed in order to obtain a ∼50 MB long text.                         TERS is put into BELOW20 (39,414).
   The particular ReDoS generation algorithm used depends
on the chosen search strategy: G REEDY, C OUNTING, R AN -                      6.1    Methodology
DOM , or O NE L INE (which is yet another strategy used to                     Let us now elaborate on the criteria we use to classify ReDoS
target S NORT’s Hyperscan in Section 6.6).                                     attacks. In the literature, we found the following used criteria:
                                                                               Shen et al. [39] generate strings at most 128 symbols long and
Other generators. We compared GadgetCA against state-                          consider a string a ReDoS if Java’s regex library matcher
of-the-art generators, which are mainly focused on back-                       makes at least 108 steps on it. Davis et al. [11] generate
tracking matchers (indeed, as far as we know, GadgetCA                         strings of lengths 100 kB–1 MB and call a string a ReDoS
is the first generator targeting nonbacktracking matchers),                    if the matcher takes more than 10 s to match it. Staicu and
namely RXXR2 [35], RegexStatic [50], RegexCheck [53],                          Pradel [41] generate pairs of random and crafted strings of
and Rescue [39].6 These generators use different algorithms                    an increasing length and measure the differences of the times
to generate a ReDoS text. The generators may consume ex-                       the matcher takes for the random and the crafted string in
cessive time while analysing the regex and generating a Re-                    each pair, obtaining a sequence d1 , d2 , . . . , dn . They consider
DoS text, hence, we limited their running time to 10 mins                      a crafted string a ReDoS if d1 < d2 < · · · < dn . Rathnayake
(the same as for our generator). Note that all of these tools                  and Thielecke [35], Wüstholz et al. [53], and Weideman et
are research prototypes, so they do not support all regex fea-                 al. [51] define that a regex is ReDoS-vulnerable if it meets
tures. The generators generate a ReDoS text template in the                    some condition that causes super-linear behaviour (they do
form of a triple (prefix, pump, suffix) so that a concrete ReDoS               not examine the run time of the matchers in detail).
text can be obtained by instantiating prefix · pumpk · suffix for                 We base our ReDoS criteria on the criteria in [11], but nor-
some k. Therefore, we set k for each of the ReDoS texts so                     malize it w.r.t. the significantly lower average matching times
that |prefix| + |pump| · k + |suffix| ≈ 50 MB.                                 for automata-based matchers ( [11] only considers backtrack-
Dataset. The regexes that we targeted in the experiment                        ing matchers). Our ReDoS criteria are the following:
were selected from the following sources: (a) the database                         • >10s: The matching takes over 10 s. This corresponds
of over 500,000 real-world regexes coming from an Internet-                          to the throughput of <5 MB/s.
wide analysis of regexes collected from over 190,000 soft-                         • > 100s: The matching takes over 100 s. This corresponds
ware projects [12]; (b) the databases of regexes used by                             to the throughput of <0.5 MB/s.
network intrusion detection systems (NIDSes), in particu-                          • > 100× AVGREGEX : The matcher takes at least 100 times
lar, S NORT [25], Bro [37], Sagan [2], and the academic pa-                          longer than usual on the given regex. The usual time is
pers [47, 54]; (c) the RegExLib database of regexes [36],                            computed as the average runtime of the same matcher
which is a website dedicated to regexes for various domain-                          on 10 different ∼50 MB-long random texts. This is rel-
specific languages (DSLs); (d) regexes from posts on Stack                           evant when the user has some idea about the average
Overflow [31]; (e) industrial regexes from Microsoft used for                        performance of the matcher on the regex, presumably
security purposes [20]; and (f) industrial regexes from Trust-                       from testing.
Port [45] for detecting security breaches. This gave us a set of                   • > 100× AVGMATCHER : The matcher takes at least 100
609,992 regexes that we denote as ALL. We then categorized                           times more than usual globally. The usual time is the av-
the regexes in ALL into several classes as follows:                                  erage time the same matcher takes on a random ∼50 MB-
                                                                                     long text across all regexes. However, we include only
   SUPPORTED (443,265) is a subset of ALL of syntactically
                                                                                     regexes without the anchors ‘ˆ’ and ‘$’ since match-
correct regexes without features not supported by our tool—
                                                                                     ing regexes with anchors in a random text mostly ends
e.g., look-arounds, back-references, etc. Moreover, our tool
                                                                                     by declaring non-match after processing the first few
also does not support regexes with the bounded repetition that
                                                                                     characters. Average matching times (in seconds) for the
yield a non-uniform NCA7 (there were 101 such regexes).
                                                                                     matchers are given in Table 1.
   COUNTERS (47,513) is a subset of SUPPORTED contain-
ing regexes with bounded repetition. The rest of SUPPORTED
                                                                               6.2    Summary of Results
   6 We do not include SlowFuzz [33] into the evaluation since we were not
                                                                               Let us quickly summarize results obtained in our experimental
able to run it in our test environment. According to [39], Rescue, which we    evaluation, described in detail in the following sections:
include, is more effective than SlowFuzz.
    7 Due to the technical difficulty of characterizing such regexes and the   R1: Regexes with bounded repetition with higher bounds
relatively small number of regexes affected by this, we refer the interested        are potentially vulnerable to ReDoS attacks even for
reader to the description in [46, Section 6.4].                                     automata-based matchers.



USENIX Association                                                                                 31st USENIX Security Symposium           4175
            Table 1: The average matching time [s] of a random 50 MB-long text for each of the matchers (averaged over all regexes)
                         hyper-
                 grep               re2    srm     ca      rust    ruby      php      perl     python      java     javaScript       .NET
                          scan
                  0.04    0.07     0.14   1.02    1.32     0.07     2.13     3.10     0.09       0.69      1.11         0.93          2.59

Table 2: Numbers of regexes from ABOVE20 for which various generators successfully generated > 100s and > 10s-ReDoS texts.
Red (darker) colour emphasizes higher numbers. For each ReDoS criterion, matchers are split into groups based on their types.
                                         > 100s-ReDoS attacks                                                > 10s-ReDoS attacks
       Generators                  hyper-                               java-                         hyper-                                java-
                 grep re2 rust srm         ca ruby php perl python java        .NET grep re2 rust srm          ca ruby php perl python java        .NET
                                    scan                                Script                         scan                                 Script
       G REEDY 192 72 76 238          0   61 1087 1408 56     200 215 210 390 1058 703 274 311           1    135 5050 6580 837 1027 485 955 2629
 GadgetCA




      C OUNTING 216 110 96 272        0   45 1724 1979 89     218 242 211 419 1181 1116 295 391          3    121 5440 6289 1294 1503 532 1317 3000
       R ANDOM 126 28 48 123          0   46 682 885 60       160 181 111 334 713 135 259 242            1    106 4405 5389 361 523 385 410 2025
      O NE L INE 192 17 32 23         0   56 333 40 187 433 414 378 584 576 17 78 30                     6    130 540 69 402 678 637 485 1448
       RXXR2       7   0   2    0     0     1 24    0     4    30   11    11     34  11   0   2    0     0     1    26   0     5  33    12    13     35
    RegexCheck 14 0        2    0     0     0   7   1     1     9    8    4      16  25   0   3    0     1     0    7    3     7  18    15     9     36
   RegexStatic 34 1        5    0     0     8 160 63 69       262 253 243 285        78   1   9    0     0     19 182 70 78       287 274 254 333
      Rescue      12 0     3    0     0     2 23    3     4    23   13    12     27  11   0   3    0     0     4    24   2     5  26    13    13     28
    random text   52 4 11 17          0   82 33 47 23         109 162 36        231 153 10 70 27         2    137 175 47 147 272 255 228 698


R2: If a regex does not contain counting, it mostly cannot                     search, confirming R3. The table also shows that Hyperscan,
    be used to perform a ReDoS attack on automata-based                        SRM, and CA are more robust towards being attacked by our
    matchers.                                                                  ReDoS texts: SRM has a special support for counters and CA
R3: Our informed exploration strategy C OUNTING is bet-                        is a matcher that uses counting set automata (cf. Section 5).
    ter at generating ReDoS texts than the (less informed)                     We will discuss Hyperscan in Section 6.6. See Appendix A
    strategies G REEDY and R ANDOM.                                            for examples of evil texts generated by GadgetCA using the
R4: Other state-of-the-art ReDoS generators are not able to                    C OUNTING strategy.
    generate ReDoS text for automata-based matchers.                              In the left-hand side of Table 3, we provide a comparison of
R5: Our techniques can be used to attack mature real-world                     the number of > 100× AVGMATCHER -ReDoS texts generated
    security solutions.                                                        by the tools. Again, note that a slowdown of >100 times wrt.
                                                                               the global average for the matcher was achieved on many
                                                                               regexes for online DFA-simulation-based matchers (2,457 for
6.3             R1: Vulnerability of Counting Regexes                          grep, 742 for RE2, 1,016 for Rust, and 300 for SRM). Since
In our first experiment, we show that the use of bounded                       the global average matching time for PHP was 3.1 s and we
repetition with a higher bound in regexes creates a possible                   used the timeout of 300 s for matchers, in this table, the PHP
attack surface for ReDoS even for online DFA-simulation-                       column contains the number of timeouts instead. A more
based matchers. We used the set of regexes ABOVE20 and                         detailed analysis for other slowdown ratios is in Figure 3.
tried to generate ReDoS attacks using GadgetCA and other                       Notice that although Hyperscan looks almost invincible in
matchers using the methodology described above.                                the results in Table 2, we are able to slow it down by a factor
   First, see the top part of left-hand side of Table 2, which                 of 10–50 in many instances (543).
shows how many successful > 100s-ReDoS texts different                            On the other hand, the right-hand side of Table 3 compares
settings of GadgetCA were able to generate for online DFA-                     the numbers of generated > 100× AVGREGEX -ReDoSes. In
simulation-based matchers. Notice that we were able to gen-                    this case, a slowdown of >100 times wrt. the average time for
erate 216 ReDoS texts for grep, 110 ReDoS texts for RE2,                       the matcher and the regex was also achieved often for online
96 ReDoS texts for Rust, and 272 ReDoS texts for SRM (using                    DFA-simulation-based matchers (1,157 for grep, 1,465 for
the C OUNTING strategy).                                                       RE2, 1,066 for Rust, and 279 for SRM).
   Next, the right-hand side of the table shows data for the                      We conclude that many counting regexes can be success-
weaker ReDoS criterion > 10s. The number of generated suc-                     fully attacked using ReDoS texts created by our generator.
cessful ReDoS-texts is significantly higher: 1,181 for grep,
1,116 for RE2, 295 for Rust, and 391 for SRM (all using the                    6.4     R2: Regexes Without Counting
C OUNTING strategy).                                                           The second experiment shows that when targeting automata-
   Under both ReDoS criteria above, the C OUNTING strategy                     based matchers, it is indeed important to exploit counting.
achieves the best results for online DFA-simulation-based                         Since the set SUPPORTED is too large for us to run a Re-
matchers and, moreover, for the >10s criterion also for back-                  DoS generator for each regex, we use a quick filter based on
tracking matchers. Further, G REEDY obtains significantly bet-                 the intuition that ReDoS in these matchers is caused by gener-
ter results than R ANDOM, proving that our informed search                     ating many large DFA states. Hence we run DFA construction
strategies are better in generating hard texts than uninformed                 for each regex from the set. If the construction terminates



4176            31st USENIX Security Symposium                                                                                 USENIX Association
            Table 3: Numbers of regexes with successfully generated > 100× AVGMATCHER and > 100× AVGREGEX -ReDoS texts.
                                 > 100× AVGMATCHER -ReDoS attacks                                   > 100× AVGREGEX -ReDoS attacks
       Generators                 hyper-                              java-                          hyper-                              java-
                    grep re2 rust srm    ca ruby php perl python java        .NET grep re2 rust srm         ca ruby php perl python java        .NET
                                    scan                              Script                          scan                               Script
      G REEDY 1741 15 95 18           2  40 260 38 382 367 328 314 431 878 14 57 12                     0    0 164 9 174 232 190 194 203
 GadgetCA




     C OUNTING 2457 742 1016 300      5  67 1355 1596 1473 277 279 258 416 1157 1465 1066 279           2    3 1085 796 1252 407 142 140 171
      R ANDOM 2033 120 122 289        3  46 348 388 412 176 177 117 258 1066 320 292 130                0    0 153 156 266      91   63    60     72
      O NE L INE 1796 17 99 23       20 53 322 34 441 448 405 379 521 966 15 57 16                     23    0 199 9 208 277 232 228 238
       RXXR2      13 0    2   0       0   1 24     0    5     30  10    10     34   1   0   2    0      0    0 10     0   4     22    8     8     20
    RegexCheck 104 0      5   0       1   0   7    1    7     11   8    4      14   4   0   4    0      0    0   3    0   0      4    3     2      2
   RegexStatic 93 1       9   0       1   7 159 50 80        263 253 243 279       47   5   5    0      0    0 80 14 49        137 125 134        90
      Rescue      12 0    3   0       0   2 23     2    5     23  13    12     26   1   2   4    0      0    1 12     2   6     15    7     6     14


with less than 1,000 states, we consider the regex safe. After                 matchers slow down (both for automata-based and backtrack-
1,000 DFA states, the construction is stopped, and the regex                   ing matchers). The same holds for the > 100× AVGMATCHER
is marked as possibly vulnerable. This test is quick, since                    and > 100× AVGREGEX -ReDoS criteria in Table 3.
constructing 1,000 DFA states is fast, and the vast majority                      Second, compare the bottom part (random text) with the
of the regexes have even much smaller DFAs.                                    middle part of the table. For counting regexes, a random text
   To assess the accuracy of the test in predicting that a regex               is in the majority of cases actually better in creating a Re-
is not vulnerable for automata-based matchers, we apply the                    DoS than current state-of-the-art ReDoS generators (only
test on the regexes from ABOVE20 for which we did manage                       RegexStatic can keep up with the random text on some
to generate a ReDoS text for automata-based matchers (cf.                      matchers). Relating this to GadgetCA in the top part of the ta-
the experiment in R1). From ∼2,000 of them, only grep and                      ble reveals that the numbers of successfully attacked regexes
Rust had cases with DFA smaller than 1,000 states, namely                      for the two criteria differ significantly, hence GadgetCA in-
24 cases, 6 for grep and 18 for Rust (RE2, CA, Hyperscan,                      deed succeeds in exploiting the critical feature of the regex.
and SRM had none). These counterexample cases witness that                        Third, the comparison of the top part with the middle part
our filter is not always right, at least for grep and Rust, and                of the table shows that GadgetCA significantly outperforms
ReDoS with automata-based matchers might be possible even                      other matchers on online DFA-simulation-based matchers and
with small DFA. Still, the scarcity of these cases confirms that               most of the other generators even on backtracking matchers
the test is a good predictor even for grep and Rust.8                          (the only exception being RegexStatic, which is comparable
   Running the test on SUPPORTED resulted in the following                     on some backtracking matchers).
numbers of regexes with DFAs with >1,000 states:
                                                                               6.6    R5: Real-World Security Solutions
              NOCOUNTERS            BELOW20         ABOVE20                    Our final experiment demonstrates that the results obtained in
               175 (0.04 %)        343 (0.8 %)     1,600 (20 %)                R1 carry over to real-world security solutions which should
We then used GadgetCA to generate ReDoS candidates for                         be prepared for being targeted by (Re)DoS. We carried out an
the regexes in NOCOUNTERS ∪ BELOW20 whose DFAs had                             extensive evaluation of the abilities of S NORT 3 [25], a popu-
more than 1,000 states. Only 7 regexes caused > 100s-ReDoS                     lar and often used NIDS, which internally uses Hyperscan, to
for automata-based matchers, two for grep— ‘\^.{20}\$’                         withstand ReDoS attacks generated by GadgetCA. Instead of
and ‘\^_.{19}\$’ (note that both also contain “higher                          using some of the previously introduced datasets, which might
bounds” for the quantifiers)—and 5 for SRM. A > 10s-ReDoS                      contain regexes created by people unaware of the dangers of
was caused by 24 regexes for grep and ∼6 regexes for each                      ReDoS, we used regexes from rulesets provided with S NORT,
of RE2, Rust, and SRM. The relative sizes of the sets indicate                 which are written by security experts and tested in production.
that regexes without higher repetition bounds are much less                    In particular, we used regexes from the following four rulesets:
vulnerable to ReDoS for automata-based matchers (518 vul-                      (i) Emerging Threats Pro, (ii) Emerging Threats 3CORESec
nerable from 435,166 in NOCOUNTERS ∪ BELOW20 while                             (versions 157 and 164), and (iii) Talos LightSPD (version
1,600 vulnerable from 8,099 in ABOVE20).                                       2021-03-11-001). We call the obtained set of 1,112 PCRE
                                                                               regexes SNORT (from the original 22,425 original regexes we
6.5           R4: Comparison with Other Generators
Our next experiment confirms that our generator can create                     removed 16,094 regexes not supported by our tool, and then fil-
new ReDoS attacks much more effectively than existing tools.                   tered the 1,112 regexes with quantifier bounds at least 20). The
   First, compare the middle part of the left- and right-hand                  experiment was run in two different settings: (i) on a commod-
side of Table 2. For other generators, the ten-fold stronger                   ity x86_64 machine with S NORT using Hyperscan and (ii) on
> 100s-ReDoS criterion makes almost no difference: they can-                   a computer with an NVIDIA BlueField-2 card [28], which pro-
not find and exploit the features of the regex that make the                   vides its own hardware-accelerated regex matching solution.
    8 The 24 cases are probably caused by specific implementation techniques   Modified ReDoS Generator. In this experiment, we use
or different interpretation of the regexes. The 18 cases of Rust seem to be    a modified version of our ReDoS generator for the reason that
related to handling of large character classes (\w appears in all 18 cases).   although Hyperscan, used within S NORT, can be counted



USENIX Association                                                                                31st USENIX Security Symposium             4177
           Figure 3: Histogram of ratios between times of matchers for random and ReDoS text generated by GadgetCA.

as an automata-based matcher, it is not based on online                            that, unlike for online DFA simulation, it does not matter that
DFA-simulation. Experiments discussed in the previous sec-                         the encountered DFA states are likely to be found repeatedly
tions indeed show that our ReDoS generator, which targets                          in the repeating instances of u since NFA simulation is not
mainly online DFA-simulation, is only mildly successful                            caching the DFA.
with Hyperscan. We therefore use here a modification of
GadgetCA tailored for Hyperscan.                                                   6.6.1 S NORT with Hyperscan on x86_64
   We specifically target the following coarse abstraction of                      We installed S NORT 3 with enabled performance monitor and
Hyperscan’s matching algorithm: the regex is split into a se-                      Hyperscan on a commodity x86_64 machine (we used Intel
quence of sub-strings (not containing any regex operator) and                      i7-10510U CPU@1.80 GHz with 4 Hyper-Threading cores).
sub-regexes (or a choice of such sequences) so that a word is                      Then, we were running S NORT on 100 MB-large PCAP files
matched if it is a concatenation w = v1 · · · vn of the sub-strings                with random and ReDoS IPv4 traffic that we generated and
of the given regex and words matched by the sub-regexes. The                       captured the processing time of the regex matching engine,
first phase of matching tests whether w contains all the sub-                      as provided in the output of the performance monitor mod-
strings in the right order, by an extension of the Boyer-Moore                     ule. We ran two experiments with two different sizes of IP
algorithm. The second phase tests whether the remaining                            packets for two selected Ethernet frames’ MTUs: 1,500 B and
sub-words are matched by the respective sub-regexes. The op-                       9,000 B (we note that bigger sizes of the payload could be
portunity for slowing Hyperscan down is in the second phase,                       used to attack S NORT with TCP reassembly turned on). See
which uses NFA-simulation to match the sub-expressions.9                           Figures 4a and 4b for the slowdown that we achieved with
   We therefore aim at generating evil texts that contain the                      our ReDoS text over random text.
needed sequence of sub-strings and therefore pass the first                           The histograms clearly show the S NORT rulesets we used
phase of matching, and where the second phase is also hard.                        contain many possibilities for slowing S NORT down (see Ap-
To do that, we use our generator to get a single evil word u                       pendix B for the most vulnerable regexes). In particular, using
over a run that takes the CSA from the initial to a final state.                   packet size of 1,500 B, in 43 cases we achieved a slowdown
The word is essentially generated by the first iteration of the                    of over 40×, with 2 regexes slowing the matcher down over
while-loop on Line 11 of Algorithm 2 parameterised with the                        100×. The number of vulnerable regexes is even higher for
strategy C OUNTING (a single CSA run that aims at maximis-                         the packet size 9,000 B: 91 regexes yield a slowdown of over
ing the sizes of counting sets). The word u is then iterated to                    50× and 32 regexes over 100×.
get the output text w = uuuu . . . of the required length.                            We contacted the development team of S NORT and did the
   A word w generated this way is likely to be evil for the                        responsible disclosure of the discovered vulnerable regexes.
following two reasons: (i) every occurrence of u in w contains                     S NORT development team stated that the vulnerability is stem-
all sub-strings, generating many possible splits of w into the                     ming from the Hyperscan library, and they mitigate it by
sub-strings and the parts to be matched by the sub-regexes;                        restricting the length of packets on which the matching is
(ii) the word u, generated by our generator, is likely to force                    performed as well as by using timeouts (the standard configu-
large DFA states, expensive for NFA simulation. Note also                          ration of S NORT comes with the backtracking-based PCRE en-
                                                                                   gine enabled, which is, however, even more prone to attacks).
   9 Our abstraction of Hyperscan is coarse, but it is simple and sufficient for
                                                                                   This might, however, lead to skipping the malicious content
our needs: to show that methods similar to those for online DFA-simulation
can be used to find vulnerabilities of Hyperscan too. A specialised ReDoS
                                                                                   that can be presented at the end of the packet/data, making
generator based on a more thorough analysis of Hyperscan’s algorithm               the NIDS ineffective: malicious packets may get passed to
might yield better results, but is already out of the scope of this paper.         applications behind the NIDS.



4178     31st USENIX Security Symposium                                                                                     USENIX Association
                    (a) S NORT 3@Hyperscan (1,500 B)   (b) S NORT 3@Hyperscan (9,000 B)         (c) NVIDIA BlueField-2
Figure 4: Histograms of slowdowns for S NORT 3 with Hyperscan (packet sizes 1,500 B and 9,000 B) and BlueField-2 regex
matching for ReDoS texts over random texts.

6.6.2 NVIDIA BlueField-2                                                   ters) of the regex matcher. Although such techniques can avert
In the second part of this experiment, we used an NVIDIA                   the scenario of a server becoming unresponsive, they leave
BlueField-2 data processing unit (BF2) MBF2H332A-                          a part of the input traffic not classified and potentially harmful
AEEOT [29], which integrates eight 64-bit ARMv8 Cortex-                    or unnecessarily dropped. A mitigation specific for regexes
A72 cores and houses two 25 GbE interfaces. BF2 provides                   with the counting operator is to substitute it by the star * op-
hardware-accelerated regex matching capabilities, accessible               erator, which over-approximates the language of the original
via NVIDIA’s data plane development kit (DPDK) [28]: in                    regex (this might yield other issues, such as increasing the
our experiments, we used the regex compiler rxpc and the                   number of false positives in an NIDS).
testbed for the regex matching engine called rxpbench. In                     There are, however, two ways how users of regex matchers
this experiment, we ran rxpbench on blocks of random and                   can mitigate the attacks without the mentioned disadvantages:
ReDoS texts of the length 100 GB (this time, we did not need                 1. Use our ReDoS generator GadgetCA to evaluate whether
to chunk the texts into packets and provided the text directly                   a regex is ReDoS-vulnerable.
in memory) and measured the throughput of the matcher. We                      2. Use a matching algorithm that can handle counting effi-
measured that the regex matching engine itself enables in-                        ciently, the one implemented in the tool CA or possibly
memory processing at ∼40 Gbps. For the evaluation, we used                        also SRM (these matchers are still too immature to be
a subset of SNORT rules containing 617 regexes that we name                       used in production, but an efficient implementation of
SNORT-BF2 (we took all regexes from SNORT that could be                           the techniques they use within RE2 or Hyperscan should
compiled by rxpc, which does not support some advanced                            give rise to a robust regex matching solution).
features of PCRE, such as negative look-ahead).
   See Figure 4c for histograms of slowdowns we obtained                   8     Conclusion and Future Work
with our ReDoS text as compared to random text. Observe that               We have shown that nonbacktracking automata-based regex
we obtained a slowdown of more than 100× on the ReDoS                      matchers, which are sometimes suggested as a mitigation
text in over 92 cases. Moreover, for 16 cases, we obtained                 of ReDoS, are still ReDoS-vulnerable. We have developed
a slowdown over 500× (with the highest slowdown ratio be-                  a method for constructing inputs for these matchers that make
ing 2,194×). See Appendix B for a list of regexes on which                 them perform poorly and cause significant slowdown on
we obtained the largest slowdown. We have reported the vul-                a large class of regexes, in particular those with counting.
nerability to NVIDIA, which confirmed it to be caused by                      In future, we plan to focus on developing robust regex
a conceptual limitation of their regex matching engine. We                 matchers that could prevent these kinds of attacks. A first
plan to cooperate on a possible mitigation.                                proof of concept is the matcher CA from [46], but the class of
   Our results indicate that ReDoS attacks are in general suc-             counting regexes it support is quite restricted; we will there-
cessful in slowing down the throughput of the most recent                  fore explore formal models that can deal with more general
hardware utilized for NIDS in the industry. Moreover, we                   classes of counting regexes efficiently.
emphasize that for a successful ReDoS attack on an NIDS, it                Acknowledgment. We thank the reviewers for their com-
suffices to have a single vulnerable rule in the used rulesets.            ments on how to improve the quality of the paper and the Cy-
                                                                           berGrid group from FEEC BUT for lending us the NVIDIA
7    Mitigation Techniques                                                 BF2 card. This work was supported by the Czech Min-
Standard techniques for mitigation of ReDoS attacks are the                istry of Education, Youth and Sports project LL1908 of the
following: (i) setting a resource limit (e.g., a timeout) and              ERC.CZ programme, the Czech Science Foundation project
(ii) limiting the size of the input (e.g., to the first 100 charac-        20-07487S, and the FIT BUT internal project FIT-S-20-6427.



USENIX Association                                                                             31st USENIX Security Symposium          4179
References                                                        [18] The PHP Group. PCRE patterns - PHP. https://www.
                                                                       php.net/manual/en/regexp.introduction.php,
 [1] Mono. https://www.mono-project.com/.                              2021.
 [2] The Sagan Log Analysis Engine.                 https://      [19] Mike Haertel et al. GNU grep. https://www.gnu.
     quadrantsec.com/sagan_log_analysis_engine/.                       org/software/grep/.
 [3] Valentin Antimirov. Partial derivatives of regular expres-   [20] Lukáš Holík, Ondřej Lengál, Olli Saarikivi, Lenka Tur-
     sions and finite automaton constructions. Theoretical             oňová, Margus Veanes, and Tomáš Vojnar. Succinct
     Computer Science, 155(2):291 – 319, 1996.                         determinisation of counting automata via sphere con-
 [4] Adam       Baldwin.               Regular expression              struction. In Proc. of APLAS’19, volume 11893 of LNCS,
     denial     of     service      affecting      Express.js.         pages 468–489. Springer, 2019.
     https://medium.com/node-security/regular-                    [21] Intel. Hyperscan 5.4 developer’s reference guide, per-
     expression-denial-of-service-affecting-                           formance considerations. http://intel.github.io/
     express-js-9c397c164c43, 2016.                                    hyperscan/dev-reference/performance.html,
 [5] Robert S. Boyer and J. Strother Moore. A fast string              2021.
     searching algorithm. Commun. ACM, 20(10):762–772,            [22] James Kirrage, Asiri Rathnayake, and Hayo Thielecke.
     1977.                                                             Static analysis for regular expression denial-of-service
 [6] James Britt and Neurogami Secret Laboratory. Reg-                 attacks. In NSS’13, volume 7873 of LNCS, pages 135–
     exp - Ruby. https://ruby-doc.org/core-2.3.1/                      148. Springer, 2013.
     Regexp.html, 2021.                                           [23] LLVM project. libFuzzer: A library for coverage-guided
 [7] Wikipedia contributors. Regular expression—wikipedia.             fuzz testing. https://llvm.org/docs/LibFuzzer.
     https://en.wikipedia.org/w/index.php?title=                       html.
     Regular_expression&%20oldid=852858998, 2019.                 [24] Blake Loring, Duncan Mitchell, and Johannes Kinder.
 [8] Intel Corporation.      https://github.com/intel/                 Sound regular expression semantics for dynamic sym-
     hyperscan, 2021.                                                  bolic execution of JavaScript. In PLDI’19, pages 425–
 [9] Oracle Corporation. Regexp - JavaScript. https:                   438. ACM, 2019.
     //developer.mozilla.org/en-US/docs/Web/                      [25] M. Roesch et al. Snort: A Network Intrusion Detection
     JavaScript/Reference/Global_Objects/RegExp,                       and Prevention System,. http://www.snort.org.
     2021.                                                        [26] Microsoft. https://docs.microsoft.com/en-us/
[10] James C. Davis. Rethinking regex engines to address               dotnet/api/system.text.regularexpressions.
     ReDoS. In ESEC/FSE’19, pages 1256–1258. ACM,                      regex.match, 2020.
     2019.                                                        [27] Microsoft.       CredScan.     https://secdevtools.
[11] James C. Davis, Christy A. Coghlan, Francisco Servant,            azurewebsites.net/helpcredscan.html, 2021.
     and Dongyoon Lee. The impact of regular expression           [28] NVIDIA. Data plane development kit (dpdk). https:
     denial of service (ReDoS) in practice: An empirical               //developer.nvidia.com/networking/dpdk.
     study at the ecosystem scale. In ESEC/FSE’18, pages          [29] Nvidia.        Nvidia BlueField-2 DPU.           https:
     246–256. ACM, 2018.                                               //www.nvidia.com/content/dam/en-zz/
[12] James C. Davis, Louis G. Michael IV, Christy A. Cogh-             Solutions/Data-Center/documents/
     lan, Francisco Servant, and Dongyoon Lee. Why aren’t              datasheet-nvidia-bluefield-2-dpu.pdf, 2020.
     regular expressions a lingua franca? An empirical study      [30] Open Information Security Foundation. Suricata.
     on the re-use and portability of regular expressions. In          https://suricata.io/.
     ESEC/FSE’19, pages 1256–1258. ACM, 2019.                     [31] Stack Overflow. Question and answer site for program-
[13] MDN Web Docs. Class pattern - java. https:                        mers. http://stackoverflow.com/.
     //docs.oracle.com/en/java/javase/11/docs/                    [32] OWASP. Regular expression denial of service — ReDoS.
     api/java.base/java/util/regex/Pattern.html,                       https://owasp.org/www-community/attacks/
     2021.                                                             Regular_expression_Denial_of_Service_-_
[14] docs.rs. regex - rust. https://docs.rs/regex/1.5.                 ReDoS, 2020.
     4/regex/, 2021.                                              [33] Theofilos Petsios, Jason Zhao, Angelos D. Keromytis,
[15] Stack Exchange.         Outage postmortem.          http:         and Suman Jana. Slowfuzz: Automated domain-
     //stackstatus.net/post/147710624694/                              independent detection of algorithmic complexity vul-
     outage-postmortem-july-20-2016, 2016.                             nerabilities. In CCS’17, pages 2155–2168. ACM, 2017.
[16] Python Software Foundation. re - Python. https:              [34] Asiri Rathnayake. Semantics, analysis and security of
     //docs.python.org/3.6/library/re.html, 2021.                      backtracking regular expression matchers. PhD thesis,
[17] Google. RE2. https://github.com/google/re2.                       University of Birmingham, UK, 2015.



4180   31st USENIX Security Symposium                                                                    USENIX Association
[35] Asiri Rathnayake and Hayo Thielecke. Static analysis       [52] Matthias Wübbeling. Regular expression security. AD-
     for regular expression exponential runtime via substruc-        MIN, 55, 2020.
     tural logics. CoRR, abs/1405.7058, 2014.                   [53] Valentin Wüstholz, Oswaldo Olivo, Marijn J. H. Heule,
[36] RegExLib.com. The Internet’s first Regular Expression           and Isil Dillig. Static detection of DoS vulnerabilities
     Library. http://regexlib.com/.                                  in programs that use regular expressions. In TACAS’17,
[37] Robin Sommer et al. The Bro Network Security Monitor.           volume 10206 of LNCS, pages 3–20, 2017.
     http://www.bro.org.                                        [54] Liu Yang, Rezwana Karim, Vinod Ganapathy, and Randy
[38] Olli Saarikivi, Margus Veanes, Tiki Wan, and Eric Xu.           Smith. Improving NFA-based signature matching using
     Symbolic regex matcher. In TACAS’2019, volume 11427             ordered binary decision diagrams. In Recent Advances
     of LNCS, pages 372–378. Springer, 2019.                         in Intrusion Detection, pages 58–78. Springer Berlin
[39] Yuju Shen, Yanyan Jiang, Chang Xu, Ping Yu, Xiaoxing            Heidelberg, 2010.
     Ma, and Jian Lu. Rescue: crafting regular expression
     DoS attacks. In ASE’18, pages 225–235. ACM, 2018.
[40] Henry Spencer. Software solutions in C. chapter            A    Examples of Generated Evil Texts
     A Regular-expression Matcher, pages 35–71. Academic        Example 1. For the regex Oid=[^\0D\x0A]{1000} (origi-
     Press Professional, Inc., 1994.                            nating from S NORT) GadgetCA (strategy: C OUNTING) gener-
[41] Cristian-Alexandru Staicu and Michael Pradel. Freezing     ates a text of several lines, each of the length 1,003 characters
     the web: A study of ReDoS vulnerabilities in JavaScript-   and containing full or unfinished copies of the string ‘Oid=’:
     based web servers. In USENIX’18, pages 361–376.               (Oid=)250 Oid
     USENIX Association, 2018.                                     (Oid=)249 OidOid=
[42] Satoshi Sugiyama and Yasuhiko Minamide. Checking               ...
     time linearity of regular expression matching based on     Each new copy of Oid= adds a new value to the counting-set
     backtracking. IPSJ Online Transactions, 7:82–92, 2014.     and since all characters of the string ‘Oid=’ belong to the
[43] Ken Thompson. Programming techniques: Regular ex-          character class [^\0D\x0A], which is being counted, all ex-
     pression search algorithm. Commun. ACM, 11(6):419–         isting values in the counting-set are also incremented. The
     422, 1968.                                                 variety of full or unfinished copies of the prefix Oid= forces
[44] Iain Truskett.        Perl regular expressions refer-      creation of many large DFA states with different counter val-
     ence - perl. https://perldoc.perl.org/5.22.0/              ues. The length of the shortest string matched by the regex is
     perlreref, 2021.                                           1,004 characters, however, we aim at generating the longest
[45] TrustPort. World class cyber security. https://www.        non-matching lines, and so the length of the generated lines
     trustport.com/, 2021.                                      is 1,003 characters. The generated text is demanding for most
[46] Lenka Turoňová, Lukáš Holík, Ondřej Lengál, Olli         automata-based matchers (matching time for 50 MB input:
     Saarikivi, Margus Veanes, and Tomáš Vojnar. Regex          grep: 0.83 s, Hyperscan: 0.06 s, RE2: 228.28 s, SRM: 46.54 s,
     matching with counting-set automata. Proc. ACM Pro-        CA: 2.77 s, Rust: 96.7 s).
     gram. Lang., 4(OOPSLA):218:1–218:30, 2020.                 Example 2. For the regex <[^>\x20]{500} (originating
[47] Milan Češka, Vojtěch Havlena, Lukáš Holík, Ondřej       from S NORT) GadgetCA generates a text containing sub-
     Lengál, and Tomáš Vojnar. Approximate reduction of         strings of the length 500 (the length of a minimal match is 501)
     finite automata for high-speed network intrusion detec-    with many different placements of ‘<’:
     tion. In Proc. of TACAS’18, volume 10806 of LNCS.             (<)500
     Springer, 2018.                                               (<)99 Q(<)400
[48] Peipei Wang, Chris Brown, Jamie A. Jennings, and               ...
     Kathryn T. Stolee. Demystifying regular expression         where Q is an arbitrary character other than ‘<’. This text
     bugs. Empir. Softw. Eng., 27(1):21, 2022.                  also forces matchers to generate many DFA states with dif-
[49] Peipei Wang and Kathryn T. Stolee. How well are            ferent counter values, yielding the following matching times
     regular expressions tested in the wild? In FSE’18, pages   (on 50 MB texts): grep: 0.11 s, Hyperscan: 0.1 s, RE2: TO,
     668–678. ACM, 2018.                                        SRM: TO, GadgetCA: 2.8 s, Rust: 112.34 s.
[50] Nicolaas Weideman. RegexStatic. https://github.
     com/NicolaasWeideman/RegexStaticAnalysis,                  B    Attacks on Real-world Security Solutions
     2015.                                                      In Tables 4 and 5, we provide examples of regexes for which
[51] Nicolaas Weideman, Brink van der Merwe, Martin             we managed to obtain a significant slowdown of S NORT (with
     Berglund, and Bruce W. Watson. Analyzing matching          Hyperscan as the regex matching engine) and the NVIDIA
     time behavior of backtracking regular expression match-    BlueField-2 DPU respectively.
     ers by using ambiguity of NFA. In CIAA’16, volume
     9705 of LNCS, pages 322–334. Springer, 2016.



USENIX Association                                                                 31st USENIX Security Symposium          4181
                             Table 4: Slowdown of regex matching in Snort3 with Hyperscan on x86_64.

              Slowdown        Slowdown
   SID                                                                                        Regex
            (MTU=9000B)     (MTU=1500B)
 46310      213.95          78.89           [?&]u=[^&\s]{35}
 31068      172.32          50.49           <hostname>.{0,250}[\x60\x3b\x7c\x24\x28\x26]
 2644       165.81          65.57           \(\s*TIMESTAMP\s*(\s*(\x27[^\x27]+’|\x22[^\x22]+\x22)\s*,)\s*((\x27[^\x27]{1000,})|(\x22[^\x22]{1000,}))
 13364      163.52          71.15           src\s*\x3D(3D)?\s*[’"][^’"]{244}
 19925      160.95          58.7            value\s*=\s*[\x27\x22][^\x27\x22]{257}
 2102614    157.95          52.68           TIME_ZONE\s*=\s*((\x27[^\x27]{1000,})|(\x22[^\x22]{1000,}))
 17659      157.41          79.18           \s*\x28(\x27[^\x27]{64}|\x27[^\x27]*\x27\s*,\s*\x27[^\x27]{64})
 2611       157.39          49.67           USING\s*((\x27[^\x27]{1000})|(\x22[^\x22]{1000}))
 46309      152.34          65.7            [?&]p=[^&\s]{260}
 39982      145.5           55.61           [?&]sn=[^&]{129}
 2651       140.95          51.26           NUMTO(DS|YM)INTERVAL\s*\(\s*\d+\s*,\s*((\x27[^\x27]{1000,})|(\x22[^\x22]{1000,}))
 2102699    138.15          49.25           TO_CHAR\s*\(\s*SYSTIMESTAMP\s*,\s*(\x27[^\x27]{256}|\x22[^\x22]{256})
 19121      136.82          63.89           SET\s*EXPLAIN\s*FILE\s*TO\s*[\x22\x27][^\x22\x27]{927}
 2640       135.24          56.41           \(\s*(\x27[^\x27]*’|\x22[^\x22]+\x22)\s*,\s*(true|false)\s*,\s*((\x27[^\x27]{1000,})|(\x22[^\x22]{1000,}))
 15114      135.06          51.46           embed src=\s*(\x27[^\x27]{1000}|\x22[^\x22]{1000}|[^\s\x22\x27]{1000})
                                            document\.execCommand \(\s*[\x22\x27]InsertUnorderedList[\x22\x27]\s*\)\s*\x3B.{0,250}\s*\w+\.swapNode
 29679      133.17          77.16
                                            \(\s*[A-Za-z\(\)\"\’\.\=\]{1,75}\s*\)\s*document\.execCommand\(\s*[\x22\x27]Undo[\x22\x27]\s*\)\s*\x3B
 39707      131.81          48.37           folder\s*name\s*=\s*[\x22][^\x22]{200}
 39709      125.72          49.06           folder\s*name\s*=\s*[\x27][^\x27]{200}
 27805      123.9           45.19           \/3001[0-9A-F]{262,304}
 20889      122.09          47.98           <\s*valitem[^>]*\s(value|name)\s*=\s*([\x22\x27])[^\x22\x27]{104}
 16516      121.4           44.42           sys\x2eolapimpl\x5ft\x2eodcitablestart\x28[^\x2c]+\x2c[^\x2c]+\x2c\s*\x27?[^\x2c\x27]{303}
 29184      120.92          54.3            encoding\x3D[\x22\x27][^\x22\x27]{1024}
 14991      120.65          61.81           select\s+xmlquery\s*\x28\s*(\x27|\x22)[^\x27\x22]{512}
 43005      120.52          35.49           [?&]psk=[^&]{256}
 29185      118.76          50.13           version\x3D[\x22\x27][^\x22\x27]{1024}
 33310      117.95          54.87           \x3C\x21ENTITY\s+.*\s+\x22\x26[^\x22]{700}
 27808      110.1           29.94           \x2f\?[a-f0-9]{60,66}
 42078      108.17          43.24           [?&](cmd|pwd|usr)=[^&]{64}
 2488       106.01          43.94           name=\s*[^\r\n\x3b\s\x2c]{300}



                                  Table 5: Slowdown of regex matching at an NVIDIA BlueField-2 card.

           Thourghput on   Thourghput on
  SID       Random Text     Redos Text     Slowdown                                                 Regex
               [Gbs]           [Gbs]
2046       41.24           0.02            2,193.76      /\sPARTIAL.*BODY\.PEEK\[[^\]]\1024\/
19213      41.19           0.02            1,681.04      /Subject\x3a\x20[^\n]*\x3fQ\x3f[^\n]{512}/
17367      40.30           0.03            1,174.83      /\d{3}\s+[^\n]{1019}/
6507       41.09           0.04            957.74        /\x2fnds[^\r\n]{1000}/
1021       41.21           0.04            956.06        /\s{230,}\.htr/
20241      40.66           0.04            947.72        /Oid\x3D[^\x0D\x0A]{1000}/
15489      40.58           0.04            920.28        /\x3cimg[^\x3e]*src\x3d(\x22|\x27)?[^\x22\x27\s]{300}/
3547       40.79           0.05            829.08        /php.*\x3f[^\n]{256}/
25586      41.03           0.06            732.67        /host=[^&]{1024}/
8060       41.31           0.06            728.49        /GET\s\x2f[^\r\n]{900}/
31354      41.14           0.06            656.15        /\x28\x3f\x3d[^)]{300}/
3149       41.22           0.06            655.34        /object\s[^>]*type\s*=\s*[\x22\x27][^\x22\x27]*\x2f{32}/
17568      41.11           0.06            641.29        /\w{3}\x25\x30\x30[^\r\n]{2000}/
4127       41.15           0.08            545.82        /\x2fnds\x2f[^&\r\n\x3b]{500}/
38287      40.97           0.08            543.40        /akey=[^&]{500}/
18484      41.14           0.08            536.42        /https?\x3a\x2f\x2f[^\n\r]{1000}/
43545      41.22           0.08            485.54        /-group[^\r\n\s]{1280}/
33310      40.96           0.09            469.76        /\x3C\x21ENTITY\s+.*\s+\x22\x26[^\x22]{700}/
2701       41.20           0.09            434.18        /sid=[^&\x3b\r\n]{255}/
2107       41.21           0.10            427.53        /\sCREATE\s[^\n]{1024}/
18579      41.18           0.10            426.76        /(Context|Action)\x3D[^\x26\x3b]{1024}/
20889      40.87           0.10            419.58        /<\s*valitem[^>]*\s(value|name)\s*=\s*([\x22\x27])[^\x22\x27]{104}/
                                                         /(\(\s*(\x27[^\x27]*\x27|\x22[^\x22]+\x22)\s*,\s*(\x27[^\x27]{1075,}|\x22[^\x22]{1075,})
2826       41.28           0.10            416.17        |\(\s*(\x27[^\x27]{1075,}|\x22[^\x22]{1075,})|\(\s*((\x27[^\x27]*\x27|\x22[^\x22]+\x22)
                                                         \s*,\s*){2}(\x27[^\x27]{1075,}|\x22[^\x22]{1075,}))/
                                                         /(\(\s*(\x27[^\x27]*\x27|\x22[^\x22]+\x22)\s*,\s*(\x27[^\x27]{1075,}|\x22[^\x22]{1075,})
2826       40.73           0.10            410.57        |\(\s*(\x27[^\x27]{1075,}|\x22[^\x22]{1075,})|\(\s*((\x27[^\x27]*\x27|\x22[^\x22]+\x22)\s*,\s*)
                                                         {2}(\x27[^\x27]{1075,}|\x22[^\x22]{1075,}))/
21671      41.16           0.10            403.94        /zip\x3a\x2f\x2f[^\x0A\x20\x09\x0B\x0C\x85\x3E\x3C]{400}/
20240      41.20           0.11            375.87        /Template\x3D[^\x0D\x0A]{1000}/
27940      41.08           0.11            374.44        /password=[^\x26]{1024}/
2103070    41.00           0.11            361.25        /\sFETCH\s[^\n]{500}/
36195      41.21           0.12            338.07        /actserver=[^&]{982}/
36196      40.86           0.12            335.47        /actserver=[^&]{987}/




4182      31st USENIX Security Symposium                                                                                                 USENIX Association
