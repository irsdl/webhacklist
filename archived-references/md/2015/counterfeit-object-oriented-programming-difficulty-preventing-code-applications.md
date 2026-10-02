---
type: Whitepaper
title: "Counterfeit Object-oriented Programming: On the Difficulty of Preventing Code Reuse Attacks in C++ Applications"
description: "Counterfeit object-oriented programming chains a C++ program's own virtual functions, driven through an existing loop over attacker-forged objects, so a code-reuse payload needs no return addresses and no injected gadgets. It bypasses coarse-grained CFI and the C++-aware defences CPS, T-VIP, vfGuard and VTint, shown with working exploits for Internet Explorer 10 and Firefox 36."
resource: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf"
tags: [whitepaper, webseclist-reference, gadget-chain, rce, attack-chain, case-study, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T21:00:13+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf"
    title: "Counterfeit Object-oriented Programming: On the Difficulty of Preventing Code Reuse Attacks in C++ Applications"
    author: Felix Schuster, Thomas Tendyck, Christopher Liebchen, Lucas Davi, Ahmad-Reza Sadeghi, Thorsten Holz
also_at: []
authors:
  - Felix Schuster
  - Thomas Tendyck
  - Christopher Liebchen
  - Lucas Davi
  - Ahmad-Reza Sadeghi
  - Thorsten Holz
canonical_url: ""
cited_by:
  - "2015.md:64"
commit: ""
content_sha256: 0f0ae09fa2efdd350540cc2093f88a7140ebc52700c0c806dd16d0775323b3d2
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: ccc4c9e312cc6cb7af726d0db9814ae7a52cea173375b5a9ed0122e0f652a3be
retrieved_from: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-14T21:00:13+00:00"
slug: counterfeit-object-oriented-programming-difficulty-preventing-code-applications
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Counterfeit Object-oriented Programming: On the Difficulty of Preventing Code Reuse Attacks in C++ Applications

**Counterfeit Object-oriented Programming: On the Difficulty of Preventing Code Reuse Attacks in C++ Applications** - Felix Schuster, Thomas Tendyck, Christopher Liebchen, Lucas Davi, Ahmad-Reza Sadeghi, Thorsten Holz, Publisher not stated.

- Published: date not stated
- Original: <https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf>
- Preserved from: https://www.ieee-security.org/TC/SP2015/papers-archived/6949a745.pdf (stored) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

2015 IEEE Symposium on Security and Privacy



                  Counterfeit Object-oriented Programming
                        On the Difﬁculty of Preventing Code Reuse Attacks in C++ Applications

   Felix Schuster∗ , Thomas Tendyck∗ , Christopher Liebchen† , Lucas Davi† , Ahmad-Reza Sadeghi† , Thorsten Holz∗
                                 ∗                                                   †
                                 Horst Görtz Institut (HGI)                         CASED
                            Ruhr-Universität Bochum, Germany       Technische Universität Darmstadt, Germany



     Abstract—Code reuse attacks such as return-oriented program-      be instantiated, if spatial memory corruptions like buffer
  ming (ROP) have become prevalent techniques to exploit memory        overﬂows and temporal memory corruptions like use-after-free
  corruption vulnerabilities in software programs. A variety of        conditions are prevented in the ﬁrst place [51]. Indeed, a large
  corresponding defenses has been proposed, of which some have
  already been successfully bypassed—and the arms race continues.      number of techniques have been proposed that provide means
     In this paper, we perform a systematic assessment of recently     of spatial memory safety [5], [6], temporal memory safety [4],
  proposed CFI solutions and other defenses against code reuse         or both [13], [31], [36], [45]. On the downside, for precise
  attacks in the context of C++. We demonstrate that many of these     guarantees, these techniques typically require access or even
  defenses that do not consider object-oriented C++ semantics pre-     changes to an application’s source code and may incur consid-
  cisely can be generically bypassed in practice. Our novel attack
  technique, denoted as counterfeit object-oriented programming        erable overhead. This hampers their broader deployment [51].
  (COOP), induces malicious program behavior by only invoking             Orthogonally, several defenses have been proposed that do
  chains of existing C++ virtual functions in a program through        not tackle the initial control-ﬂow hijacking, but rather aim
  corresponding existing call sites. COOP is Turing complete in        at containing or detecting the subsequent malicious control-
  realistic attack scenarios and we show its viability by developing   ﬂow transitions of code reuse attacks. A popular line of work
  sophisticated, real-world exploits for Internet Explorer 10 on
  Windows and Firefox 36 on Linux. Moreover, we show that              impedes code reuse attacks by hiding [7], shufﬂing [55], or
  even recently proposed defenses (CPS, T-VIP, vfGuard, and VTint)     rewriting [39] an application’s code or data in memory; often
  that speciﬁcally target C++ are vulnerable to COOP. We observe       in a pseudo-random manner. For example, the widely de-
  that constructing defenses resilient to COOP that do not require     ployed address space layout randomization (ASLR) technique
  access to source code seems to be challenging. We believe that       ensures that the stack, the heap, and executable modules of
  our investigation and results are helpful contributions to the
  design and implementation of future defenses against control-        a program are mapped at secret, pseudo-randomly chosen
  ﬂow hijacking attacks.                                               memory locations. This way, among others, the whereabouts of
                                                                       useful code chunks are concealed from an attacker. Bypassing
                           I. I NTRODUCTION                            these defenses often requires the exploitation of an additional
     For more than two decades, attackers have been exploit-           memory disclosure—or information leak—vulnerability [51].
  ing memory-related vulnerabilities such as buffer overﬂow               A complementary line of work concerns a generic security
  errors to hijack the control ﬂow of software applications            principle called control-ﬂow integrity (CFI). It enforces the
  developed in unsafe programming languages like C or C++.             control ﬂow of the program to adhere to a pre-determined
  In the past, attackers typically immediately redirected the          or at runtime generated control-ﬂow graph (CFG) [3]. Pre-
  hijacked control ﬂow to their own injected malicious code.           cise CFI—also known as ﬁne-grained CFI—is conceptually
  This changed through the broad deployment of the well-known          sound [1]. However, similar to memory safety techniques,
  data execution prevention (DEP) countermeasure [33] that             there are practical obstacles like overhead or required access to
  renders immediate code injection attacks infeasible. However,        source code that hinder its broad deployment. Consequently,
  attackers adapted quickly and are typically resorting to code        different instantiations of imprecise CFI—or coarse-grained
  reuse attacks today.                                                 CFI—and related runtime detection heuristics have been pro-
     Code reuse attack techniques, such as return-oriented pro-        posed, oftentimes working on binary code only. However,
  gramming (ROP) [46] or return-to-libc [37], avoid injecting          several researchers have recently shown that many of these
  code. Instead, they induce malicious program behavior by             solutions [3], [14], [23], [40], [56], [58], [59] can be bypassed
  misusing existing code chunks (called gadgets) residing in           in realistic adversary settings [11], [16], [25], [26], [43].
  the attacked application’s address space. In general, one can           Contributions: In this paper, we present counterfeit object-
  distinguish between two phases of a runtime exploit: (1) the         oriented programming (COOP), a novel code reuse attack
  exploitation of a memory corruption vulnerability initially          technique against applications developed in C++. With COOP
  allowing the adversary to hijack the control ﬂow of an               we demonstrate the limitations of a range of proposed defenses
  application, and (2) the actual adversary-chosen malicious           against code reuse attacks in the context of C++. We show
  computations and program actions that follow. A generic              that it is essential for code reuse defenses to consider C++
  mitigation of code reuse attacks is to prevent the initial           semantics like the class hierarchy carefully and precisely.
  exploitation step. In other words, code reuse attacks cannot         As recovering these semantics without access to source code


© 2015, Felix Schuster. Under license to IEEE.                       745
DOI 10.1109/SP.2015.51
can be challenging or sometimes even impossible, our results         to access its own address. Addressing relative to the this
demand for a rethinking in the assessment of binary-only             pointer implies that COOP cannot be mitigated by defenses that
defenses and make a point for the deployment of precise              prevent the stack pointer to point to the program’s heap [23],
source code-based defenses where possible.                           which is typically the case for ROP-based attacks launched
   Our observation is that COOP circumvents virtually all CFI        through a heap-based memory corruption vulnerability.
solutions that are not aware of C++ semantics. Further, we also         The counterfeit objects used in a COOP attack typically
ﬁnd a range of other types of defenses that do not consider          overlap such that data can be passed from one gadget to
these semantics precisely to be prone to attacks. In fact, we        another. Even in a simple COOP program, positioning coun-
show that even several recently and concurrently proposed            terfeit objects manually can become complicated. Hence, we
defenses against control-ﬂow hijacking/code reuse attacks that       implemented a programming framework that leverages the Z3
speciﬁcally target C++ applications (CPS [31], T-VIP [24],           SMT solver [18] to derive the object layout of a COOP program
vfGuard [41], and VTint [57]) offer at most partial protection       automatically.
against COOP, and we can successfully bypass all of them                             II. T ECHNICAL BACKGROUND
in realistic attack scenarios. We also discuss how COOP can
reliably be prevented by precise C++-aware CFI, defenses that          Before presenting the ideas and concepts behind COOP in
provide (spatial and temporal) integrity for C++ objects, or         detail, we review the background necessary for understanding
defenses that prevent certain common memory disclosures.             our approach and its relation to existing work.
   We demonstrate the viability of our attack approach by            A. Code Reuse Attack Techniques
implementing working low-overhead exploits for real-world
vulnerabilities in Microsoft Internet Explorer 10 (32-bit and           Return-oriented programming (ROP) [46] is a widely used
64-bit) on Windows and a proof-of-concept vulnerability in           code reuse attack technique. The basic idea is to hijack the
Firefox 36 on Linux x64. To launch our attacks against               control ﬂow of an application and redirect it to existing
modern applications, we inspected and identiﬁed easy-to-use          short instruction sequences ending in a return instruction
gadgets in a set of well-known Windows system libraries—             (called gadgets) residing in the executable modules of a
among them the standard Microsoft Visual C/C++ runtime               target application. Gadgets are oftentimes not aligned with
that is dynamically linked to many applications—using basic          the original instruction stream of an executable module. Each
symbolic execution techniques. We also show that COOP is             gadget fulﬁlls a speciﬁc task such as performing an addition,
Turing complete under realistic conditions.                          or storing a value to memory. In order to execute a malicious
   Attack Technique Overview: Existing code reuse attacks            ROP program, the adversary injects a chunk of code pointers
typically exhibit unique characteristics in the control ﬂow (and     into the address space of an application, where each pointer
the data ﬂow) that allow for generic protections regardless of       references one gadget. Finally, the attacker, abusing a memory
the language an application was programmed in. For example,          corruption vulnerability, pivots a thread’s stack pointer to that
if one can afford to monitor all return instructions in an           area. In the following, the injected code pointers on the (fake)
application while maintaining a full shadow call stack, even         stack are interpreted as return addresses making the control
advanced ROP-based attacks [11], [16], [25], [26], [43] cannot       ﬂow “return” from one attacker-chosen gadget to another.
be mounted [2], [17], [22]. This is different for COOP: it           ROP can be considered a generalization of the older return-to-
exploits the fact that each C++ virtual function is address-         libc [37] code reuse attack technique where the attacker makes
taken, which means that a constant pointer exists to it. Ac-         the hijacked control ﬂow immediately “return” to the entry of
cordingly, C++ applications usually contain a high ratio of          a sensitive library functions residing for example in libc.
address-taken functions; typically a signiﬁcantly higher one            Jump-oriented programming (JOP) is a variant of ROP that
compared to C applications. If, for example, an imprecise CFI        uses indirect jumps and calls rather than return instructions [9],
solution does not consider C++ semantics, these functions are        [12]. In basic JOP, return instructions are emulated by using
all likely valid indirect call targets [3] and can thus be abused.   a combination of a pop-jmp pair. In addition, JOP attacks
COOP exclusively relies on C++ virtual functions that are            do not necessarily require the stack pointer as base register
invoked through corresponding calling sites as gadgets. Hence,       to reference code pointers. In particular, an “update-load-
without deeper knowledge of the semantics of an application          branch” sequence with general purpose registers can be used
developed in C++, COOP’s control ﬂow cannot reasonably be            instead [12]. The term call-oriented programming (COP) is
distinguished from a benign one. Another important difference        also sometimes used to refer to ROP-derived techniques that
to existing code reuse attacks is that in COOP conceptually no       employ indirect calls [11], [25].
code pointers (e. g., return addresses or function pointers) are        Although these code reuse attack techniques are very pow-
injected or manipulated. As such, COOP is immune against             erful and return-to-libc, ROP, and JOP have even been shown
defenses that protect the integrity and authenticity of code         to enable Turing complete (i. e., arbitrary) malicious computa-
pointers. Moreover, in COOP, gadgets do not work relative            tions [12], [46], [53] in realistic scenarios, they differ in several
to the stack pointer. Instead, gadgets are invoked relative to       subtle aspects from ordinary program execution, which can be
the this pointer on a set of adversary-deﬁned counterfeit            exploited to detect their execution. This is discussed in more
objects. Note that in C++, the this pointer allows an object         detail in §III-A.


                                                                 746
B. Control-Flow Integrity                                            beginning (offset +0). This pointer is called vptr. Typically,
   Abadi et al. introduced the principle of Control-Flow In-         a vcall on Windows x64 is translated by a compiler to an
tegrity (CFI) [3] as a generic defense technique against code        instruction sequence similar to the following:
reuse attacks. Since then, it has been generally used to refer to    mov     rdx, qword ptr [rcx]
                                                                     call    qword ptr [rdx+8]
the concept of instrumenting indirect branches in native pro-
grams to thwart code reuse attacks. Usually, the enforcement         Here, rcx is the object’s this pointer—also referred to as
of CFI is a two-step process:                                        this-ptr in the following. First, the object’s vptr is temporarily
  1) determination of a program’s approximate control-ﬂow            loaded from offset +0 from the this-ptr to rdx. Next, in the
      graph (CFG) X  .                                              given example, the second entry in the object’s vtable is called
  2) instrumentation of (a subset of) the program’s indirect         by dereferencing rdx+8. Compilers generally hardcode the
      branches with runtime checks that enforce the control          index into a vtable at a vcall site. Accordingly, this particular
      ﬂow to be compliant with X  .                                 vcall site always invokes the second entry of a given vtable.
The approximate CFG X  can be determined statically or                III. C OUNTERFEIT O BJECT- ORIENTED P ROGRAMMING
dynamically; on source code or on binary code. X  should be
                                                                        COOP is a code reuse attack approach targeting applications
a supergraph of the intrinsic CFG X encoded in the original
                                                                     developed in C++ or possibly other object-oriented languages.
source code of a program. If X  is equal to X, it is in general
                                                                     We note that many of today’s notoriously attacked applications
difﬁcult for an attacker to divert control ﬂow in a way that is
                                                                     are written in C++ (or contain major parts written in C++);
not conform to the semantics of a program’s source code. CFI
                                                                     examples include, among others, Microsoft Internet Explorer,
checks are often implemented by assigning IDs to all possible
                                                                     Google Chrome, Mozilla Firefox, Adobe Reader, Microsoft
indirect branch locations in a program. At runtime, a check
                                                                     Ofﬁce, LibreOfﬁce, and OpenJDK.
before each indirect branch validates if the target ID is in
                                                                        In the following, we ﬁrst state our design goals and our
compliance with X  . When the same ID is assigned to most
                                                                     attacker model for COOP before we describe the actual build-
of a program’s address-taken functions and returns are not
                                                                     ing blocks of a COOP attack. For brevity reasons, the rest
restricted to comply with the call stack at runtime, one often
                                                                     of this section focuses on Microsoft Windows and the x86-
speaks of coarse-grained CFI. It has recently been shown that
                                                                     64 architecture as runtime environment. The COOP concept
certain coarse-grained CFI solutions for binary code [3], [58],
                                                                     is generally applicable to C++ applications running on any
[59] cannot prevent advanced ROP-based attacks [16], [25].
                                                                     operating system; it also extends to other architectures.
C. C++ Code on Binary Level
                                                                     A. Goals
   As our attack approach targets C++ applications, we provide
                                                                        With COOP we aim to demonstrate the feasibility of creating
a brief introduction to the basic concepts of C++ and describe
                                                                     powerful code reuse attacks that do not exhibit the revealing
how they are implemented by compilers in the following.
                                                                     characteristics of existing attack approaches. Even advanced
   In C++ and other object-oriented programming languages,
                                                                     existing variants of return-to-libc, ROP, JOP, or COP [8], [10],
programmers deﬁne custom types called classes. Abstractly, a
                                                                     [11], [16], [25], [26], [43], [53] rely on control ﬂow and data-
class is composed of a set of member data ﬁelds and member
                                                                     ﬂow patterns that are rarely or never encountered for regular
functions [50]. A concrete instantiation of a class at runtime
                                                                     code; among these are typically one or more of the following:
is called object. Inheritance and polymorphism are integral
concepts of the object-oriented programming paradigm: new            C-1 indirect calls/jumps to non address-taken locations
classes can be derived from one or multiple existing ones,           C-2 returns not in compliance with the call stack
inheriting at least all visible data ﬁelds and functions from        C-3 excessive use of indirect branches
their base classes. Hence, in the general case, an object can        C-4 pivoting of the stack pointer (possibly temporarily)
be accessed as instance of its actual class or as instance of        C-5 injection of new code pointers or manipulation of existing
any of its (immediate and not immediate) base classes. In                  ones
C++, it is possible to deﬁne a member function as virtual.              These characteristics still allow for the implementation of
The implementation of an inherited virtual function may be           effective, low-level, and programming language-agnostic pro-
overridden in a derived class. Invoking a virtual function on        tections. For instance, maintaining a full shadow call stack [2],
an object always invokes the speciﬁc implementation of the           [17], [22] sufﬁces to fend off virtually all ROP-based attacks.
object’s class even if the object was accessed as instance of           With COOP we demonstrate that it is not sufﬁcient to
one of its base classes. This is referred to as polymorphism.        generally rely on the characteristics C-1–C-5 for the design of
   C++ compilers implement calls to virtual functions (vcalls)       code reuse defenses; we deﬁne the following goals for COOP
with the help of vtables. A vtable is an array of pointers to        accordingly:
all, possibly inherited, virtual functions of a class; hence, each   G-1 do not expose the characteristics C-1–C-5.
virtual function is address-taken in an application. (For brevity,   G-2 exhibit control ﬂow and data ﬂow similar to those of
we do not consider the case of multiple inheritance here.)                 benign C++ code execution.
   Every object of a class with at least one virtual function        G-3 be widely applicable to C++ applications.
contains a pointer to the corresponding vtable at its very           G-4 achieve Turing completeness under realistic conditions.


                                                                 747
B. Adversary Model                                                    attack through source code analysis or reverse engineering
   In general, code reuse attacks against C++ applications            of binary code. Even when source code is available, it is
oftentimes start by hijacking a C++ object and its vptr.              necessary to determine the actual object layout of a vfgadget’s
Attackers achieve this by exploiting a spatial or temporal            class on binary level as the compiler may remove or pad cer-
memory corruption vulnerability such as an overﬂow in a               tain ﬁelds. Only then the attacker is able to inject compatible
buffer adjacent to a C++ object or a use-after-free condition.        counterfeit objects.
When the application subsequently invokes a virtual function             We identiﬁed a set of vfgadget types that allows to imple-
on the hijacked object, the attacker-controlled vptr is deref-        ment expressive (and Turing complete) COOP attacks in x86
erenced and a vfptr is loaded from a memory location of the           and x64 environments. These types are listed in Table I. In
attacker’s choice. At this point, the attacker effectively controls   the following, we gradually motivate our choice of vfgadget
the program counter (rip in x64) of the corresponding thread          types based on typical code examples. These examples revolve
in the target application. Generally for code reuse attacks,          around the simple C++ classes Student, Course, and
controlling the program counter is one of the two basic               Exam, which reﬂect some common code patterns that we
requirements. The other one is gaining (partial) knowledge on         found to induce useful vfgadgets. From §III-C3 to §III-C5,
the layout of the target application’s address space. Depending       we ﬁrst walk through the creation of a COOP attack code
on the context, there may exist different techniques to achieve       that writes to a dynamically calculated address; along the
this [8], [28], [44], [48].                                           way, we introduce COOP’s integral concepts of The Main
   For COOP, we assume that the attacker controls a C++               Loop, Counterfeit Vptrs, and Overlapping Counterfeit Ob-
object with a vptr and that she can infer the base address of         jects. After that, from §III-D to §III-F, extended concepts for
this object or another auxiliary buffer of sufﬁcient size under       Passing Arguments to Vfgadgets, Calling API Functions, and
her control. Further, she needs to be able to infer the base          Implementing Conditional Branches and Loops in COOP are
addresses of a set of C++ modules whose binary layouts are            explained.
(partly) known to her. For instance, in practice, knowledge on           The reader might be surprised to ﬁnd more C++ code
the base address of a single publicly available C++ library in        listings than actual assembly code in the following. This is
the target address space can be sufﬁcient.                            owed to the fact that most of our vfgadgets types are solely
   These assumptions conform to the attacker settings of most         deﬁned by their high-level C++ semantics rather than by the
defenses against code reuse attacks. In fact, many of these           side effects of their low level assembly code. These types of
defenses assume far more powerful adversaries that are, e. g.,        vfgadgets are thus likely to survive compiler changes or even
able to read and write large (or all) parts of an application’s       the transition to a different operating system or architecture. In
address space with respect to page permissions.                       the cases where assembly code is given, it is the output of the
                                                                      Microsoft Visual C++ compiler (MSVC) version 18.00.30501
C. Basic Approach                                                     that is shipped with Microsoft Visual Studio 2013.
   Every COOP attack starts by hijacking one of the target               3) The Main Loop: To repeatedly invoke virtual functions
application’s C++ objects. We call this the initial object. Up        without violating goals G-1 and G-2, every COOP program
to the point where the attacker controls the program counter,         essentially relies on a special main loop vfgadget (ML-G).
a COOP attack does not deviate much from other code reuse             The deﬁnition of an ML-G is as follows:
attacks: in a conventional ROP attack, the attacker typically            A virtual function that iterates over a container (e. g., a C-
exploits her control over the program counter to ﬁrst manipu-         style array or a vector) of pointers to C++ objects and invokes
late the stack pointer and to subsequently execute a chain of         a virtual function on each of these objects.
short, return-terminated gadgets. In contrast, in COOP, virtual          Virtual functions that qualify as ML-G are common in
functions existing in an application are repeatedly invoked on        C++ applications. Consider for example the code in Figure 1:
counterfeit C++ objects carefully arranged by the attacker.           the class Course has a ﬁeld students that points to
   1) Counterfeit Objects: Typically, a counterfeit object car-       a C-style array of pointers to objects of the abstract base
ries an attacker-chosen vptr and a few attacker-chosen data           class Student. When a Course object is destroyed (e. g.,
ﬁelds. Counterfeit objects are not created by the target appli-       via delete), the virtual destructor1 Course::˜Course is
cation, but are injected in bulk by the attacker. Whereas the         executed and each Student object is informed via its virtual
payload in a ROP-based attack is typically composed of fake           function decCourseCount() that one of the courses it was
return addresses interleaved with additional data, in a COOP          subscribed to does not exist anymore.
attack, the payload consists of counterfeit objects and possibly            a) Layout of the Initial Object: The attacker shapes the
additional data. Similar to a conventional ROP payload, the           initial object to resemble an object of the class of the ML-
COOP payload containing all counterfeit objects is typically          G. For our example ML-G Course::˜Course, the initial
written as one coherent chunk to a single attacker-controlled         object should look as depicted in Figure 2: its vptr is set
memory location.                                                      to point into an existing vtable that contains a reference to
   2) Vfgadgets: We call the virtual functions used in a COOP         the ML-G such that the ﬁrst vcall under attacker control
attack vfgadgets. As for other code reuse attacks, the attacker         1 It is common practice to declare a virtual destructor when a C++ class
identiﬁes useful vfgadgets in an application prior to the actual      has virtual functions.



                                                                  748
 Vfgadget type   Purpose                                                                                                  Code example
 ML-G            The main loop; iterate over container of pointers to counterfeit object and invoke a virtual function    see Figure 1
                 on each such object.
 ARITH-G         Perform arithmetic or logical operation.                                                                 see Figure 4
 W-G             Write to chosen address.                                                                                 see Figure 4
 R-G             Read from chosen address.                                                                                no example given, similar to W-G
 INV-G           Invoke C-style function pointer.                                                                         see Figure 8
 W-COND-G        Conditionally write to chosen address. Used to implement conditional branching.                          see Figure 6
 ML-ARG-G        Execute vfgadgets in a loop and pass a ﬁeld of the initial object to each as argument.                   see Figure 6
 W-SA-G          Write to address pointed to by ﬁrst argument. Used to write to scratch area.                             see Figure 6
 MOVE-SP-G       Decrease/increase stack pointer.                                                                         no example given
 LOAD-R64-G      Load argument register rdx, r8, or r9 with value (x64 only).                                             see Figure 4

TABLE I: Overview of COOP vfgadget types that operate on object ﬁelds or arguments; general purpose types are atop;
auxiliary types are below the double line.


 class Student {                                                                                  vptr                               Course::vtable
 public:                                                                                 Student **students                                1st entry
     virtual void incCourseCount() = 0;
                                                                                            size_t nStudents                               2nd entry
     virtual void decCourseCount() = 0;
 };
                                                                                            Student *object0                         ClassA::vtable
 class Course {
                                                                                            Student *object1                               1st entry
 private:
     Student **students;                                                                            ...                                    2nd entry
     size_t nStudents;
                                                                                                                                           3rd entry
 public:                                                                                          vptr
     /* ... */                                                                                                                             4th entry
     virtual ~Course() {                                                                         object1
          for (size_t i = 0; i < nStudents; i++)
              students[i]->decCourseCount();                     ML-G                             vptr                               ClassB::vtable
          delete students;
     }                                                                                           object0
                                                                                                                                                   …
 };

                                                                                        attacker controlled memory                          .rdata
Fig. 1: Example for ML-G: the virtual destructor of the class
Course invokes a virtual function on each object pointer in                    Fig. 2: Basic layout of attacker controlled memory (left) in a
the array students.                                                            COOP attack using the example ML-G Course::˜Course.
                                                                               The initial object (dark gray, top left) contains two ﬁelds from
                                                                               the class Course. Arrows indicate a points-to relation.
leads to the ML-G. In contrast, in a ROP-based attack, this
ﬁrst vcall under attacker control typically leads to a gadget                                         initial attacker-
moving the stack pointer to attacker controlled memory. The                                           controlled vcall                   vfgadget 0
                                                                                                               0             3
initial object contains a subset of the ﬁelds of the class of                           2, 4,
                                                                                        6, ...                               5           vfgadget 1
the ML-G; i. e., all data ﬁelds required to make the ML-G                                                 Main Loop
                                                                                                           (ML-G)                            ...
work as intended. For our example ML-G, the initial object
contains the ﬁelds students and nStudents of the class
                                                                               Fig. 3: Schematic control ﬂow in a COOP attack; transitions
Course; the ﬁeld students is set to point to a C-style
                                                                               are labeled according to the order they are executed.
array of pointers to counterfeit objects (object0 and object1
in Figure 2) and nStudents is set to the total number
of counterfeit objects. This makes the Course::˜Course                         abstract class Student. For each counterfeit object, the
ML-G invoke a vfgadget of the attacker’s choice for each                       2nd entry—corresponding to decCourseCount()—in the
counterfeit object. Note how the attacker controls the vptr of                 supplied vtable is invoked. (The 1st entry corresponds to
each counterfeit object. Figure 3 schematically depicts the                    incCourseCount().) Here, a COOP attack would ideally
control-ﬂow transitions in a COOP attack.                                      only use vfgadgets that are the 2nd entry in an existing vtable.
   4) Counterfeit Vptrs: The control ﬂow and data ﬂow in a                     Naturally, this largely shrinks the set of available vfgadgets.
COOP attack should resemble those of a regular C++ program                        This constraint can be sidestepped by relaxing goal G-2 and
(G-2). Hence, we avoid introducing fake vtables and reuse                      letting vptrs of counterfeit objects not necessarily point to the
existing ones instead. Ideally, the vptrs of all counterfeit                   exact beginning of existing vtables but to certain positive or
objects should point to the beginning of existing vtables.                     negative offsets as is shown for object1 in Figure 2. When
Depending on the target application, it can though be difﬁcult                 such counterfeit vptrs are used, any available virtual function
to ﬁnd vtables with a useful entry at the offset that is ﬁxed                  can be invoked from a given ML-G.
for a given vcall site. Consider for example our ML-G from                        5) Overlapping Counterfeit Objects: So far we have shown
Figure 1: counterfeit objects are treated as instances of the                  how, given an ML-G, an arbitrary number of virtual functions


                                                                           749
                                                                                                                              vptr




                                                                     data-flow: Exam::getAbsoluteScore()
 class Exam {
 private:




                                                                                                                                                    object0
                                                                                                                                                    (Exam)
      size_t scoreA, scoreB, scoreC;                                                                                   size_t scoreA
 public:
      /* ... */                                                                                                        size_t scoreB
      char *topic;
      size_t score;                                                                                                    size_t scoreC
      virtual void updateAbsoluteScore() {                                                                                  ...
          score = scoreA + scoreB + scoreC;




                                                                                                                                                              (SimpleString)
      }                                             ARITH-G
                                                                                                           +   char *topic                   vptr




                                                                                                                                                                  object1
      virtual float getWeightedScore() {                                                                       size_t score          char* buffer
          return (float)(scoreA*5+scoreB*3+scoreC*2) / 10;
      }                                                                                                                 size_t len
 };
                                                LOAD-R64-G

 struct SimpleString {
                                                                    Fig. 5: Overlapping counterfeit objects of types Exam and
      char* buffer;                                                 SimpleString
      size_t len;
      /* ... */
      virtual void set(char* s) {                                   §V) operate on both ﬁelds and arguments as is the case for
          strncpy(buffer, s, len);                      W-G
      }
                                                                    SimpleString::set().
 };                                                                    Due to divergent default calling conventions, we describe
                                                                    different techniques for passing arguments to vfgadgets for
Fig. 4: Examples for ARITH-G, LOAD-R64-G, and W-G; for              x64 and x86 in the following.
simpliﬁcation, the native integer type size_t is used.                 1) Approach Windows x64: In the default x64 calling
                                                                    convention on Windows, the ﬁrst four (non-ﬂoating point)
                                                                    arguments to a function are passed through the registers rcx,
(vfgadgets) can be invoked while control ﬂow and data ﬂow
                                                                    rdx, r8, and r9 [35]. In case there are more than four
resemble those of the execution of benign C++ code.
                                                                    arguments, the additional arguments are passed over the stack.
   Two exemplary vfgadgets of types ARITH-G (arithmetic)            For C++ code, the this-ptr is passed through rcx as the
and W-G (writing to memory) are given in Figure 4: in               ﬁrst argument. All four argument registers are deﬁned to be
Exam::updateAbsoluteScore() the ﬁeld score is set                   caller-saved; regardless of the actual number of arguments a
to the sum of three other ﬁelds; in SimpleString::set()             callee takes. Accordingly, virtual functions often use rdx, r8,
the ﬁeld buffer is used as destination pointer in a write           and r9 as scratch registers and do not restore or clear them
operation. In conjunction, these two vfgadgets can be used to       on returning. This circumstance makes passing arguments to
write attacker-chosen data to a dynamically calculated memory       vfgadgets simple on x64: ﬁrst, a vfgadget is executed that
address. For this, two overlapping counterfeit objects are          loads one of the corresponding counterfeit object’s ﬁelds into
needed and their alignment is shown in Figure 5.                    rdx, r8, or r9. Next, a vfgadget is executed that interprets
   The key idea here is that the ﬁelds score in object0             the contents of these registers as arguments.
and buffer in object1 share the same memory. This way,                 We refer to vfgadgets that can be used to load argument
the result of the summation of the ﬁelds of object0 in              registers as LOAD-R64-G. For the x64 arguments passing
Exam::updateAbsoluteScore() is written to the ﬁeld                  concept to work, a ML-G is required that itself does not
buffer of object1. Note how here, technically, also ob-             pass arguments to the invoked virtual functions/vfgadgets. Of
ject0.topic and object1.vptr overlap. As the attacker does not      course, the ML-G must also not modify the registers rdx,
use object0.topic this not a problem and she can simply make        r8, and r9 between such invocations. In our example, the
the shared ﬁeld carry object1.vptr. Of course, in our example,      attacker can control the source pointer s of the write operation
the attacker would likely not only wish to control the desti-       (namely strncpy()) by invoking a LOAD-R64-G that loads
nation address of the write operation through object1.buffer        rdx before SimpleString::set().
but also the source address. For this, she needs to be able to         As an example for a LOAD-R64-G, consider
set the argument for the vfgadget SimpleString::set().              Exam::getWeightedScore() from Figure 4; MSVC
How this can be achieved in COOP is described next.                 compiles this function to the following assembly code:
                                                                    mov rax, qword ptr [rcx+10h]
D. Passing Arguments to Vfgadgets                                   mov r8, qword ptr [rcx+18h]
                                                                    xorps   xmm0, xmm0
                                                                    lea rdx, [rax+rax*2]
   The overlapping of counterfeit objects is an important           mov rax, qword ptr [rcx+8]
concept in COOP. It allows for data to ﬂow between vfgadgets        lea rcx, [rax+rax*4]
                                                                    lea r9, [rdx+r8*2]
through object ﬁelds regardless of compiler settings or calling     add r9, rcx
conventions. Unfortunately, we found that useful vfgadgets          cvtsi2ss    xmm0, r9
                                                                    addss   xmm0, dword ptr [__real0]
that operate exclusively on object ﬁelds are rare in practice.      divss   xmm0, dword ptr [__real1]
In fact, most vfgadgets we use in our real world exploits (see      ret



                                                              750
In condensed from, this LOAD-R64-G provides the following               class Student2 {
useful semantics to the attacker:                                       private:
                                                                           std::list<Exam> exams;
          rdx ← 3 · [this + 10h]                                        public:
                                                                           /* ... */
           r8 ← [this + 18h]                                               virtual void subscribeCourse(int id) { /* ... */ }
           r9 ← 3 · [this + 18h] + 2 · [this + 10h]                        virtual void unsubscribeCourse(int id) { /* ... */ }

                                                                              virtual bool getLatestExam(Exam &e) {
   Thus, by carefully choosing the ﬁelds at offsets 10h and                      if (exams.empty()) return false;              W-SA-G
18h from the this-ptr of the corresponding counterfeit object,                   e = exams.back();
the attacker can write arbitrary values to the registers rdx,                    return true;                            W-COND-G
                                                                              }
r8, and r9.                                                             };
   In summary, to control the source pointer in the writing
operation in SimpleString::set(), the attacker would                    class Course2 {
                                                                        private:
ﬁrst invoke Exam::getWeightedScore() for a counter-
                                                                           Student2 **students;
feit object carrying the desired source address divided by 3               size_t nStudents;
at offset 10h. This would load the desired source address to               int id;
rdx, which would next be interpreted as the argument s in               public:
                                                                           /* ... */
the vfgadget SimpleString::set().                                          virtual ~Course2() {
      a) Other Platforms: In the default x64 C++ calling                      for (size_t i = 0; i < nStudents; i++)
convention used by GCC [32], e. g., on Linux, the ﬁrst six                       students[i]->unsubscribeCourse(id);
                                                                              delete students;
arguments to a function are passed through registers instead of            }                                              ML-ARG-G
only the ﬁrst four registers. In theory, this should make COOP          };
attacks simpler to create on Linux x64 than on Windows x64,
as two additional registers can be used to pass data between                Fig. 6: Examples for W-SA-G, W-COND-G, ML-ARG-G
vfgadgets. In practice, during the creation of our example
exploits (see §V), we did not experience big differences                     push    ebp
between the two platforms.                                                   mov ebp, esp
                                                                             cmp dword ptr [ecx+8], 0
   Although we did not conduct experiments on RISC plat-                     jne copyExam
forms such as ARM or MIPS, we expect that our x64 approach              5    xor al, al
                                                                             pop ebp
directly extends to these because in RISC calling conventions                ret 4
arguments are also primarily passed through registers.                       copyExam:
                                                                             mov eax, dword ptr [ecx+4]
   2) Approach Windows x86: The standard x86 C++ calling            10       mov ecx, dword ptr [ebp+8]
convention on Windows is thiscall [35]: all regular arguments                mov edx, dword ptr [eax+4]
                                                                             mov eax, dword ptr [edx+0Ch]
are passed over the stack whereas the this-ptr is passed in the              mov dword ptr [ecx+4], eax
register ecx; the callee is responsible for removing arguments               mov eax, dword ptr [edx+10h]
                                                                    15       mov dword ptr [ecx+8], eax
from the stack. Thus, the described approach for x64 does not                mov eax, dword ptr [edx+14h]
work for x86.                                                                mov dword ptr [ecx+0Ch], eax
                                                                             mov eax, dword ptr [edx+18h]
   In our approach for Windows x86, contrary to x64, we rely                 mov dword ptr [ecx+10h], eax
on a main loop (ML-G) that passes arguments to vfgadgets.           20       mov al, 1
                                                                             pop ebp
More precisely, a 32-bit ML-G should pass one ﬁeld of the                    ret 4
initial object as argument to each vfgadget. In practice, any
number of arguments may work; for brevity we only discuss           Listing 1: Optimized x86 assembly code produced by
the simplest case of one argument here. We call this ﬁeld the       MSVC for Student2::getLatestExam().
argument ﬁeld and refer to this variant of ML-G as ML-ARG-
G. For an example of an ML-ARG-G, consider the virtual
destructor of the class Course2 in Figure 6: the ﬁeld id is
passed as argument to each invoked virtual function. Given          x86 assembly code shown in Listing 1 for the function. In
such an ML-ARG-G, the attacker can employ one of the two            condensed form, lines 9–22 of the assembly code provide the
following approaches to pass chosen arguments to vfgadgets:         following semantics:
A-1 ﬁx the argument ﬁeld to point to a writable scratch area.
A-2 dynamically rewrite the argument ﬁeld.                                             [arg0 + 4] ← [[[this + 4] + 4] + Ch]
   In approach A-1, the attacker relies on vfgadgets that                              [arg0 + 8] ← [[[this + 4] + 4] + 10h]
interpret their ﬁrst argument not as an immediate value                              [arg0 + Ch] ← [[[this + 4] + 4] + 14h]
but as a pointer to data. Consider for example the virtual
                                                                                    [arg0 + 10h] ← [[[this + 4] + 4] + 18h]
function Student2::getLatestExam() from Figure 6
that copies an Exam object; MSVC produces the optimized


                                                                  751
Note that for approach A-1, arg0 always points to the scratch using ML-ARG-Gs that do not pass one but many control-
area. Accordingly, this vfgadget allows the attacker to copy lable arguments to vfgadgets. Conceptually, passing too many
16 bytes (corresponding to the four 32-bit ﬁelds of Exam) arguments to a function does not corrupt the stack in the
from the attacker-chosen address [[this + 4] + 4+] + Ch to cdecl calling convention. Alternatively, ML-ARG-Gs could be
the scratch area. We refer to this type of vfgadget that writes switched during an attack depending on which arguments to
attacker-controlled ﬁelds to the scratch area as W-SA-G.         a vfgadget need to be controlled.
   Using Student2::getLatestExam() as W-SA-G in
conjunction with a ML-ARG-G allows the attacker, for exam- E. Calling API Functions
ple, to pass a string of up to 16 characters as ﬁrst argument       The ultimate goal of code reuse attacks is typically to
to the vfgadget SimpleString::set().                             pass attacker-chosen arguments to critical API functions or
   In approach A-2, the argument ﬁeld of the initial object system calls, e. g., Windows API (WinAPI) functions such
is not ﬁxed as in approach A-1. Instead, it is dynamically as WinExec() or VirtualProtect(). We identiﬁed the
rewritten during the execution of a COOP attack. This allows following ways to call a WinAPI function in a COOP attack:
the attacker to pass arbitrary arguments to vfgadgets; as W-1 use a vfgadget that legitimately calls the WinAPI function
opposed to a pointer to arbitrary data for approach A-1.              of interest.
For this approach, naturally, a usable W-G is required. As W-2 invoke the WinAPI function like a virtual function from
stated above, we found vfgadgets working solely with ﬁelds            the COOP main loop.
to be rare. Hence, the attacker would typically initially follow W-3 use a vfgadget that calls a C-style function pointer.
approach A-1 and implement A-2-style argument writing on            While approach W-1 may be practical in certain scenarios
top of that when required.                                       and for certain WinAPI functions, it is unlikely to be feasible
     a) Passing Multiple Arguments and Balancing the Stack: in the majority of cases. For example, virtual functions that
So far, we have described how a single argument can be passed call WinExec() should be close to non-existent.
to each vfgadget using a ML-ARG-G main loop gadget on               Approach W-2 is simple to implement: a counterfeit object
Windows x86. Naturally, it can be desirable or necessary to can be crafted whose vptr does not point to an actual vtable
pass more than one argument to a vfgadget. Doing so is simple: but to the import table (IAT) or the export table (EAT) [42]
the ML-ARG-G pushes one argument to each vfgadget. In of a loaded module such that the ML-G invokes the WinAPI
case a vfgadget does not expect any arguments, the pushed function as a virtual function. Note that IATs, EATs, and
argument remains on the top of the stack even after the vtables are all arrays of function pointers typically lying
vfgadget returned. This effectively moves the stack pointer in read-only memory; they are thus in principle compatible
permanently one slot up as depicted in Figure 7 .      3 This data structures. As simple as it is, the approach has two
technique allows the attacker to gradually “pile up” arguments important drawbacks: (i) it goes counter to our goal G-2 as
on the stack as shown in Figure 7        4 before invoking a a C function is called at a vcall site without a legitimate
vfgadget that expects multiple arguments. This technique only vtable being referenced; and (ii) for x64, the this-ptr of the
works for ML-ARG-Gs that use ebp and not esp to access corresponding counterfeit object is always passed as the ﬁrst
local variables on the stack (i.e., no frame-pointer omission) argument to the WinAPI function due to the given C++ calling
as otherwise the stack frame of the ML-ARG-G is destroyed. convention. This circumstance for example effectively prevents
   Analogously to how vfgadgets without arguments can be the passing of a useful command line to WinExec(). This
used to move the stack pointer up under an ML-ARG-G, can be different for other WinAPI functions, though. For
vfgadgets with more than one argument can be used to move example, calling VirtualProtect() with a this-ptr as
the stack pointer down as shown in Figure 7 .     2 This may ﬁrst argument still allows the attacker to mark the memory
be used to compensate for vfgadgets without arguments or of the corresponding counterfeit object as executable. Note
to manipulate the stack. We refer to vfgadgets with little or that VirtualProtect() changes the memory access rights
no functionality that expect less or more than one argument for a memory region pointed to by the ﬁrst argument. Other
as MOVE-SP-Gs. Ideally, a MOVE-SP-G is an empty virtual arguments than the ﬁrst one can be passed as described in
function that just adjusts the stack pointer.                    §III-D1 for x64. For x86, all arguments can be passed using
   The described technique for passing multiple arguments to the technique from §III-D2.
vfgadgets in 32-bit environments can also be used to pass more      For approach W-3 a special type of vfgadget is re-
than three arguments to vfgadgets in 64-bit environments.        quired: a virtual function that calls a C-style function
     b) Other Platforms: The default x86 C++ calling con- pointer with non-constant arguments. We refer to this type
vention used by GCC, e. g., on Linux, is not thiscall but of vfgagdet as INV-G, an example is given in Figure 8:
cdecl [35]: all arguments including the this-ptr are passed over the virtual function GuiButton::clicked() invokes the
the stack; instead of the callee, the caller is responsible for ﬁeld GuiButton::callbackClick as C-style function
cleaning the stack. The technique of “piling up” arguments pointer. This particular vfgadget allows for the invocation of
described in §III-D2a does thus not apply to GCC-compiled arbitrary WinAPI functions with at least three attacker-chosen
(and compatible) C++ applications on Linux x86 and other arguments. Note that, depending on the actual assembly code
POSIX x86 platforms. Instead, for these platforms, we propose of the INV-G, a fourth argument could possibly be passed


                                                              752
                                                                                                                         arg.       esp
                 arg.                             arg.                                    arg.       esp                 arg.       after
   esp                      esp      esp                                       esp                   after    esp
  before      ML-ARG-G      after   before                      esp           before    ML-ARG-G             before    ML-ARG-G
                                               ML-ARG-G
             stack frame                                        after                  stack frame                    stack frame
                                              stack frame

      1     vfgadget( x )              2     vfgadget( x, x )                   3      vfgadget( )             4      vfgadget( )
                                                                                                                      vfgadget( )
Fig. 7: Examples for stack layouts before and after invoking vfgadgets under an ML-ARG-G (thiscall calling convention). The
stack grows upwards.  1 vfgadget with one argument: the stack is balanced.  2 vfgadget with two arguments: esp is moved
down.  3 vfgadget without arguments: esp is moved up.    4 two vfgadgets without arguments: two arguments are piled up.


 class GuiButton {
                                                                          can be implemented given a conditional write vfgadget, which
 private:                                                                 we refer to as W-COND-G. An example for this vfgadget type
       int id;                                                            is again Student2::getLatestExam() from Figure 6.
       void(*callbackClick)(int, int, int);
 public:
                                                                          As can be seen in lines 3–7 of the function’s assembly code
       void registerCbClick(void(*cb)(int, int, int)) {                   in Listing 1, the controllable write operation is only executed
          callbackClick = cb;                                             in case [this-ptr + 8] = 0. With this semantics, the attacker
       }                                                                  can rewrite the COOP program counter or upcoming pointers
           virtual void clicked(int posX, int posY) {                     to counterfeit objects under the condition that a certain value
                 callbackClick(id, posX, posY);                           is not null. In case the program counter is stored on the stack
           }                                                INV-G         (e. g., in the stack frame of the ML-G) and the address of the
 };
                                                                          stack is unknown, the technique for moving the stack pointer
Fig. 8: Example for INV-G: clicked invokes a ﬁeld of                      described in §III-D2a can be used to rewrite it.
GuiButton as C-style function pointer.                                       Given the ability to conditionally rewrite the program
                                                                          counter, implementing loops with an exit condition also be-
                                                                          comes possible.
through r9 for x64. Additional stack-bound arguments for
x86 and x64 may also be controllable depending on the actual                            IV. A F RAMEWORK FOR C OUNTERFEIT
layout of the stack. Calling WinAPI functions through INV-                                O BJECT- ORIENTED P ROGRAMMING
Gs should generally be the technique of choice as this is more               Implementing a COOP attack against a given application
ﬂexible than approach W-1 and stealthier than W-2. An INV-                is a three step process: (i) identiﬁcation of vfgadgets, (ii)
G also enables seemingly legit transfers from C++ to C code               implementation of attack semantics using the identiﬁed vfgad-
(e. g., to libc) in general. On the downside, we found INV-               gets, and (iii) arrangement of possibly overlapping counterfeit
Gs to be relatively rare overall. For our real-world example              objects in a buffer. Since the individual steps are cumbersome
exploits discussed in §V, we could though always select from              and hard to perform by hand, we created a framework in the
multiple suitable ones.                                                   Python scripting language that automates steps (i) and (iii).
                                                                          This framework greatly facilitated the development of our
F. Implementing Conditional Branches and Loops                            example exploits for Internet Explorer and Firefox (see §V). In
   Up to this point, we have described all building blocks                the following, we provide an overview of our implementation.
required to practically mount COOP code reuse attacks. As
we do not only aim for COOP to be stealthy, but also to be                A. Finding Vfgadgets Using Basic Symbolic Execution
Turing complete under realistic conditions (goal G-4), we now                For the identiﬁcation of useful vfgadgets in an application,
describe the implementation of conditional branches and loops             our vfgadget searcher relies on binary code only and optionally
in COOP.                                                                  debug symbols. Binary x86-64 C++ modules are disassembled
   In COOP, the program counter is the index into the con-                using the popular Interactive Disassembler (IDA) version
tainer of counterfeit object pointers. The program counter is             6.5. Each virtual function in a C++ module is considered a
incremented for each iteration in the ML-G’s main loop. The               potential vfgadget. The searcher statically identiﬁes all vtables
program counter may be a plain integer index as in our exem-              in a C++ module using debug symbols or, if these are not
plary ML-G Course::˜Course or may be a more complex                       available, a set of simple but effective heuristics. Akin to other
data structure such as an iterator object for a C++ linked list.          work [41], [57], our heuristics consider each address-taken
Implementing a conditional branch in COOP is generally possi-             array of function pointers a potential vtable. The searcher
ble in two ways: through (i) a conditional increment/decrement            examines all identiﬁed virtual functions whose number of
of the program counter or (ii) a conditional manipulation of the          basic blocks does not exceed a certain limit. In practice, we
next-in-line counterfeit object pointers in the container. Both           found it sufﬁcient and convenient to generally only consider


                                                                        753
virtual functions with one or three basic blocks as potential        within the ﬁxed-size buffer such that, if possible, all label-
vfgadgets; the only exception being ML-Gs and ML-ARG-                related constraints are satisﬁed. At the baseline, we model
Gs that due to the required loop often consist of more basic         the ﬁxed-size buffer as an array mapping integers indexes to
blocks. Using short vfgadgets is favorable as their semantics        integers in Z3. To prevent unwanted overlaps, for each byte in
are easier to evaluate automatically and they typically exhibit      each ﬁeld, we add a select constraint [19] in Z3 of the form
fewer unwanted side effects. Including long vfgadgtes can,
however, be necessary to fool heuristics-based code reuse                     select(offset-obj + reloffset-byte) = id-ﬁeld
attack detection approaches (see §VI).                               where offset-obj is an integer variable to be determined by
   The searcher summarizes the semantics of each basic block         Z3 and reloffset-byte and id-ﬁeld are constant integers that
in a vfgadget in single static assignment (SSA) form. These          together uniquely identify each byte. For each desired overlap
summaries reﬂect the I/O behavior of a basic block in a com-         (e. g., between objects A and B using label X), we add a
pact and easy to analyze form. The searcher relies for this on       constraint of the form
the backtracking feature of the METASM binary code analysis
toolkit [27], which performs symbolic execution on the basic           offset-objA + reloffset(A,X) = offset-objB + reloffset(B,X)
block level. An example of a basic block summary as used by
                                                                     where offset-objA and offset-objB are integer variables to
our searcher was already provided in the listed semantics for
                                                                     be determined by Z3 and reloffset(A,X) = 136 and
the second basic block of Exam::getWeightedScore()
                                                                     reloffset(B,X) = 8 are constants.
in §III-D1. To identify useful vfgadgets, the searcher applies
                                                                        In the programming environment, for convenience, symbolic
ﬁlters on the SSA representation of the potential vfgadgets’
                                                                     pointers to labels can be added to counterfeit objects. Symbolic
basic blocks. For example, the ﬁlter: “left side of assignment
                                                                     pointers are automatically replaced with concrete values once
must dereference any argument register; right side must deref-
                                                                     the offsets of all labels are determined by Z3. This way, mul-
erence the this-ptr” is useful for identifying 64-bit W-Gs; the
                                                                     tiple levels of indirection can be implemented conveniently.
ﬁlter: “indirect call independent of [this]” is useful for ﬁnding
INV-Gs; and the ﬁlter: “looped basic block with an indirect                       V. P ROOF OF C ONCEPT E XPLOITS
call dependent on [this] and a non-constant write to [esp-4]”
                                                                        To demonstrate the practical viability of our approach, we
can in turn be used to ﬁnd 32-bit ML-ARG-Gs.
                                                                     implemented exemplary COOP attacks for Microsoft Internet
B. Aligning Overlapping Objects Using an SMT Solver                  Explorer 10 (32-bit and 64-bit) and Mozilla Firefox 36 for
   Each COOP “program” is deﬁned by the order and posi-              Linux x64. In the following, we discuss different aspects of our
tioning of its counterfeit objects of which each corresponds         attack codes that we ﬁnd interesting. We used our framework
to a certain vfgadget. As described in §III-C5, the overlap-         described in §IV for the development of all three attack codes.
ping of counterfeit objects is an integral concept of COOP;          Each of them ﬁts into 1024 bytes or less. All employed
it enables immediate data ﬂows between vfgadgets through             vfgadgets and their semantics are listed in Tables A.I–A.IV
ﬁelds of counterfeit objects. Manually obtaining the align-          in the Appendix.
ment of overlapping counterfeit objects right on the binary             For our Internet Explorer 10 examples, we used a publicly
level is a time-consuming and error-prone task. Hence, we            documented vulnerability related to an integer signedness error
created a COOP programming environment that automatically,           in Internet Explorer 10 [30] as foundation. The vulnerability
if possible, correctly aligns all given counterfeit objects in       allows a malicious website to perform arbitrary reads at any
a ﬁxed-size buffer. In our programming environment, the              address and arbitrary writes within a range of approximately
“programmer” deﬁnes counterfeit objects and labels. A label          64 pages on the respective heap using JavaScript code. This
may be assigned to any byte within a counterfeit object. When        gives the attacker many options for hijacking C++ objects
bytes within different objects are assigned the same label,          residing on the heap and injecting her own buffer of counterfeit
the programming environment takes care that these bytes are          objects; it also enables the attacker to gain extensive knowl-
mapped to the same location in the ﬁnal buffer, while assuring       edge on the respective address space layout. We successfully
that bytes with different labels are mapped to distinct locations.   tested our COOP-based exploits for Internet Explorer 10 32-bit
Fields without labels are in turn guaranteed to never overlap.       and 64-bit on Windows 7. Note that our choice of Windows 7
These constraints are often satisﬁable, as actual data within        as target platform is only for practical reasons; the described
counterfeit objects is typically sparse.                             techniques also apply to Windows 8. To demonstrate the
   For example, the counterfeit object A may only contain its        ﬂexibility of COOP, we implemented different attack codes
vptr (at relative offset +0), an integer at the relative offset      for 32-bit and 64-bit. Both attack codes could be ported to the
+16 and have the label X for its relative offset +136; the           respective other environment without restrictions.
counterfeit object B may only contain its vptr and have the
same label X for its relative offset +8. Here, the object B ﬁts      A. Internet Explorer 10 64-bit
comfortably and without conﬂicts inside A such that B +8                Our COOP attack code for 64-bit only relies on vfgadgets
maps to the same byte as A +136.                                     contained in mshtml.dll that can be found in every Internet
   Our programming environment relies on the Z3 SMT                  Explorer process; it implements the following functionality:
solver [18] to determine the alignment of all counterfeit objects    (1) read pointer to kernel32.dll from IAT; (2) calculate pointer


                                                                 754
to WinExec() in kernel32.dll; (3) read the current tick count                                    loop
from the KUSER_SHARED_DATA data structure; (4) if tick
count is odd, launch calc.exe using WinExec() else, execute                       *next         *next          *next
                                                                                                                        ...
alternate execution path and launch mspaint.exe.                                  *obj           *obj          *obj
   The attack code consists of 17 counterfeit objects with
counterfeit vptrs and four counterfeit objects that are pure                       obj0          obj1          obj2     ...
data containers. Overall eight different vfgadgets are used;
including one LOAD-R64-G for loading rdx through the               Fig. 9: Schematic layout of the linked list of object pointers
dereferencing of a ﬁeld that is used ﬁve times. The attack         the ML-ARG-G traverses in the Internet Explorer 10 32-
code is based on a ML-G similar to our exemplary one given         bit exploit; dashed arrows are examples for dynamic pointer
in Figure 1 that iterates over a plain array of object pointers.   rewrites for the implementation of conditional branches.
With four basic blocks, the ML-G is the largest of the eight
vfgadgets. The conditional branch depending on the current
                                                                   another pointer to the actual object. This layout allows for
tick count is implemented by overwriting the next-in-line
                                                                   the low-overhead implementation of conditional branches and
object pointer such that the ML-G is recursively invoked for
                                                                   loops. For example, to implement the loop in our attack code,
an alternate array of counterfeit object pointers. In summary,
                                                                   we simply made parts of the linked list circular as shown in
the attack code contains eight overlapping counterfeit objects
                                                                   Figure 9. Inside the loop in our attack code, a counter within
and we used 15 different labels to create it in our programming
                                                                   a counterfeit object is incremented for each iteration. Once
environment.
                                                                   the counter overﬂows, a W-COND-G rewrites the backward
   1) Attack Variant Using only Vptrs Pointing to the Begin-
                                                                   pointer such that the loop is left and execution proceeds along
ning of Vtables: The described 64-bit attack code relies on
                                                                   another linked list. Our attack code consists of 11 counterfeit
counterfeit vptrs (see §III-C4) that do not necessarily point to
                                                                   objects, and 11 linked list items of which two point to the same
the beginning of existing vtables but to positive or negative
                                                                   counterfeit object. Four counterfeit objects overlap and one
offset from them. As a proof of concept, we developed a
                                                                   counterfeit object overlaps with a linked list item to implement
stealthier variant of the attack code above that only uses vptrs
                                                                   the conditional rewriting of a next pointer.
that point to the beginning of existing vtables. Accordingly,
at each vcall site, we were restricted to the set of virtual          This example highlights how powerful linked list-based ML-
functions compatible with the respective ﬁxed vtable index.        Gs/ML-ARG-Gs are in general.
Under this constraint, our exploit for the given vulnerability     C. Firefox 36.0a1 for Linux x64
is still able to launch calc.exe through an invocation of
WinExec(). The attack code consists of only ﬁve counterfeit           To demonstrate the wide applicability of COOP, we also
objects, corresponding to four different vfgadgets (including      created an attack code for the GCC-compiled Firefox 36.0a1
the main ML-G) from mshtml.dll. Corresponding to the given         for Linux x64. For this proof of concept, we created an
vulnerability, the used main ML-G can be found as fourth           artiﬁcial vulnerable application and loaded Firefox’s main
entry in an existing vtable whereas, corresponding to the vcall    library libxul.so into the address space. Our COOP attack code
site of the ML-G, the other three vfgadgets can be found as        here invokes system("/bin/sh"). It is comprised of nine
third entries in existing vtables. The task of calculating the     counterfeit objects (of which two overlap) corresponding to
address of WinExec is done in JavaScript code beforehand.          ﬁve different vfgadgets. The attack code reads a pointer to
                                                                   libc.so from the global offset table (GOT) and calculates the
B. Internet Explorer 10 32-bit                                     address of system() from that.
   Our 32-bit attack code implements the following function-
ality: (1) read pointer to kernel32.dll from IAT; (2) calculate                           VI. D ISCUSSION
pointer to WinExec() in kernel32.dll; (3) enter loop that            We now analyze the properties of COOP, discuss different
launches calc.exe using WinExec() n times; (4) ﬁnally, enter       defense concepts against it, and review our design goals G-1–
an inﬁnite waiting loop such that the browser does not crash.      G-4 from §III-A. The effectiveness against COOP of several
   The attack code does not rely on an array-based ML-             existing defenses is discussed afterwards in §VII.
ARG-G (recall that in 32-bit ML-ARG-Gs are used instead
of ML-Gs); instead, it uses a more complex ML-ARG-G                A. Preventing COOP
that traverses a linked list of object pointers using a C++            We observe that the characteristics C-1–C-5 of existing
iterator. We discovered this ML-ARG-G in jscript9.dll that is      code reuse attack approaches cannot be relied on to defend
available in every Internet Explorer process. The ML-ARG-          against COOP (goal G-1): in COOP, control ﬂow is only
G consists of four basic blocks and invokes the function           dispatched to existing and address-taken functions within an
SListBase::Iterator::Next() to get the next object                 application through existing indirect calls. In addition, COOP
pointer from a linked list in a loop. The assembly code of the     does neither inject new nor alter existing return addresses as
ML-ARG-G is given in Listing A.1 in the Appendix.                  well as other code pointers directly. Instead, only existing vptrs
   Figure 9 depicts the layout of the linked list: each item in    (i. e., pointers to code pointers) are manipulated or injected.
the linked list consists of one pointer to the next item and       Technically, depending on the choice of vfgadgets, a COOP


                                                               755
attack may however execute a high ratio of indirect branches        locations of binary code, e. g., on function, basic block, or
and thus exhibit characteristic C-3. But we note that ML-Gs         instruction level. This is because in a COOP attack, other than
(which are used in each COOP attack as central dispatchers)         for example in a ROP attack, knowing the exact locations
are legitimate C++ virtual functions whose original purpose         of certain instruction sequences is not necessary but rather
is to invoke many (different) virtual functions in a loop. Any      only the locations of certain vtables. Moreover, in COOP, the
heuristics attempting to detect COOP based on the frequency         attacker mostly misuses the actual high-level semantics of ex-
of indirect calls will thus inevitably face the problem of high     isting code. Most vfgadget types, other than ROP gadgets, are
numbers of false positive detections. Furthermore, similar to       thus likely to be unaffected by semantics-preserving rewriting
existing attacks against behavioral-based heuristics [16], [26],    of binary code. Only LOAD-R64-Gs that are used to load x64
it is straightforward to mix-in long “dummy” vfgadget to            argument registers could be broken by such means. However,
decrease the ratio of indirect branches.                            the attacker could probably oftentimes fall back to x86-style
    As a result, COOP cannot be effectively prevented by (i) CFI    ML-ARG-G-based COOP in such a case.
that does not consider C++ semantics or (ii) detection heuris-         2) C++ Semantics-aware Defense Techniques: We observe
tics relying on the frequency of executed indirect branches and     that the control ﬂow and data ﬂow in a COOP attack are
is unaffected by (iii) shadow call stacks that prevent rogue        similar to those of benign C++ code (goal G-2). However,
returns and (iv) the plain protection of code pointers.             there are certain deviations that can be observed by C++-aware
    On the other hand, a COOP attack can only be mounted            defenders. We now discuss several corresponding defenses.
under the preconditions given in §III-B. Accordingly, COOP                a) Veriﬁcation of Vptrs: In basic COOP, vptrs of coun-
is conceptually thwarted by defense techniques that prevent         terfeit objects point to existing vtables but not necessarily to
the hijacking or injection of C++ objects or conceal necessary      their beginning. This allows for the implementation of viable
information from the attacker, e. g., by applying ASLR and          defenses against COOP when all legitimate vcall sites and
preventing information leaks.                                       vtables in an application are known and accordingly each
    1) Generic Defense Techniques: We now discuss the ef-           vptr access can be augmented with sanity checks. Such a
fectiveness of several other possible defensive approaches          defense can be implemented without access to source code by
against COOP that do not require knowledge of precise C++           means of static binary code rewriting as concurrently shown
semantics and can thus likely be deployed without analyzing         by Prakash et al. [41]. While such a defense signiﬁcantly
an application’s source code or recompiling it.                     shrinks the available vfgadget space, our exploit code from
       a) Restricting the Set of Legitimate API Invocation Sites:   §V-A1 demonstrates that COOP-based attacks are still possible,
A straightforward approach to tame COOP attacks is to restrict      at least for large C++ target applications.
the set of code locations that may invoke certain sensitive            Ultimately, a defender needs to know the set of allowed
library functions. For example, by means of binary rewriting        vtables for each vcall site in an application to reliably prevent
it is possible to ensure that certain WinAPI functions may only     malicious COOP control ﬂow (or at least needs to arrive at
be invoked through constant indirect branches that read from a      an approximation that sufﬁciently shrinks the vfgadget space).
module’s IAT (see CCFIR [58]). In the best case, this approach      For this, the defender needs (i) to infer the global hierarchy
could effectively prevent the API calling techniques W-2 and        of C++ classes with virtual functions and (ii) to determine
W-3 described in §III-E. However, it is also common for             the C++ class (within that hierarchy) that corresponds to each
benign code to invoke repeatedly used or dynamically resolved       vcall site. Both can easily be achieved when source code is
WinAPI functions through non-constant indirect branches like        available. Without source code, given only binary code and
call rsi. Accordingly, in practice, it can be difﬁcult to           possibly debug symbols or RTTI metadata2 , the former can
precisely identify the set of a module’s legitimate invocation      be achieved with reasonable precision while, to the best of
sites for a given WinAPI function. We also remark that even         our knowledge, the latter is generally considered to be hard
without immediate access to WinAPI functions or systems             for larger applications by means of static analysis [20], [21],
calls COOP is still potentially dangerous, because, for example,    [24], [41].
it could be used to manipulate or leak critical data.                     b) Monitoring of Data Flow: COOP also exhibits a
       b) Monitoring of the Stack Pointer: In 64-bit COOP,          range of data-ﬂow patterns that can be revealing when C++
the stack pointer is virtually never moved in an irregular          semantics are considered. Probably foremost, in basic COOP,
or unusual manner. For the 32-bit thiscall calling convention       vfgadgtes with varying number of arguments are invoked
though, this can be hard to avoid as long as not only vfgadgets     from the same vcall site. This can be detected when the
with the same ﬁxed number of arguments are invoked. This            number of arguments expected by each virtual function in an
is a potential weakness that can reveal a COOP attack on            application is known. While trivial with source code, deriving
Windows x86 to a C++-unaware defender that closely observes         this information from binary code can be challenging [41].
the stack pointer. However, we note that it may be difﬁcult to      An even stronger (but also likely costlier) protection could be
always distinguish this behavior from the benign invocation of      created by considering the actual types of arguments.
functions in the cdecl calling convention.                            2 Runtime Type Information (RTTI) metadata is often linked into C++
       c) Fine-grained Code Randomization: COOP is con-             applications for various purposes. RTTI includes the literal names of classes
ceptually resilient against the ﬁne-grained randomization of        and the precise class hierarchy.



                                                                756
   In a COOP attack, counterfeit objects are not created and        TokenRegistration_TaskProc::_Exec() that con-
initialized by legitimate C++ constructors, but are injected by     sists of one basic block and is suitable for x86 and x64 COOP.
the attacker. Further, the concept of overlapping objects creates      Given the vfgadget types deﬁned in Table I, COOP has the
unusual data ﬂows. To detect this, the defender needs to be         same expressiveness as unrestricted ROP [46]. Hence, it allows
aware of the life-cycle of C++ objects in an application. This      for the implementation of a Turing machine (goal G-4) based
requires knowledge of the whereabouts of (possibly inlined)         on memory load/store, arithmetic, and branches. In particular,
constructors and destructors of classes with virtual functions.     the COOP examples in §V show that complex semantics like
      c) Fine-grained Randomization of C++ Data Structures:         loops can be implemented under realistic conditions.
In COOP, the layout of each counterfeit object needs to be
                                                                               VII. COOP AND E XISTING D EFENSES
byte-compatible with the semantics of its vfgadget. Accord-
ingly, randomizing C++ object layouts on application start-            Based on the discussions in §VI, we now assess a selection
up, e. g., by inserting randomly sized paddings between the         of contemporary defenses against code reuse attacks and
ﬁelds of C++ objects, can hamper COOP. Also, the ﬁne-grained        discuss whether they are vulnerable to COOP in our adversary
randomization of the positions or structures of vtables could       model. A summary of our assessment is given in Table II.
be a viable defense against COOP.                                   A. Generic CFI
   We conclude that COOP can be mitigated by a range of
                                                                       We ﬁrst discuss CFI approaches that do not consider C++
means that do not require knowledge of C++ semantics. But
                                                                    semantics for the derivation of the CFG that should be
we regard it as vital to consider and to enforce C++ semantics
                                                                    enforced. We observe that all of them are vulnerable to COOP.
to reliably prevent COOP. Doing so by means of static binary
                                                                       The basic implementation of the original CFI work by
analysis and rewriting only is challenging as the compilation
                                                                    Abadi et al. [3] instruments binary code such that indirect
of C++ code is in most cases a lossy process. For example, in
                                                                    calls may only go to address-taken functions (coarse-grained
binary code, distinguishing the invocation of a virtual function
                                                                    CFI). This scheme and a closely related one [59] have re-
from the invocation of a C-style function pointer that happens
                                                                    cently been shown to be vulnerable to advanced ROP-based
to be stored in a read-only table can be difﬁcult. Hence,
                                                                    attacks [16], [25]. Abadi et al. also proposed to combine their
unambiguously recovering essential high-level C++ semantics
                                                                    basic implementation with a shadow call stack that prevents
afterwards can be hard or even impossible. In fact, as we
                                                                    call/return mismatches. This extension effectively mitigates
discuss in more detail in §VII, we know of no binary-only
                                                                    these advanced ROP-based attacks while, as discussed in §VI,
CFI solution that considers C++ semantics precisely enough
                                                                    it does not prohibit COOP.
to fully protect against COOP.
                                                                       Davi et al. described a hardware-assisted CFI solution for
                                                                    embedded systems that incorporates a shadow call stack and
B. Applicability and Turing Completeness
                                                                    a certain set of runtime heuristics [15]. However, the indirect
   We have shown that COOP is applicable to popular C++             call policy only validates whether an indirect call targets a
applications on different operating systems and hardware            valid function start. As COOP only invokes entire functions, it
architectures (goal G-3). Naturally, a COOP attack can only         can bypass this hardware-based CFI mechanism.
be mounted in case at least a minimum set of vfgadgets is              CCFIR [58], a CFI approach for Windows x86 binaries,
available. We did not conduct a quantitative analysis on the        uses a randomly arranged “springboard” to dispatch all indirect
general frequency of usable vfgadgets in C++ applications: de-      branches within a code module. On the baseline, CCFIR
termining the actual usefulness of potential vfgadgets in an au-    allows indirect calls and jumps to target all address-taken
tomated way is challenging and we leave this for future work.       locations in a binary and restricts returns to certain call-
In general, we could choose from many useful vfgadgets in the       preceded locations. One of CCFIR’s core assumptions is that
libraries mshtml.dll (around 20 MB) and libxul.so (around 60        the attacker is unable to “[...] selectively reveal [s]pringboard
MB) and found the basic vfgadget types ARITH-G, W-G, R-             stub addresses of their choice” [58]. Göktaş et al. recently
G, LOAD-R64-G, and W-SA-G to be common even in smaller              showed that ROP-based bypasses for CCFIR are possible given
binaries. The availability of ML-Gs/ML-ARG-Gs is vital to ev-       an up-front information leak from the springboard [25]. In con-
ery COOP attack. While sparser than the more basic types, we        trast, COOP breaks CCFIR without violating its assumptions:
found well-usable representatives, e. g., in Microsoft’s standard   the springboard technique is ineffective against COOP as we
C/C++ runtime libraries msvcr120.dll and msvcp120.dll (both         do not inject code pointers but only vptrs (pointers to code
smaller than 1 MB; dynamically linked to many C and C++             pointers). CCFIR though also ensures that sensitive WinAPI
applications on Windows): the virtual function Scheduler-           functions (e. g., CreateFile() or WinExec()) can only
Base::CancelAllContexts() with ﬁve basic blocks in                  be invoked through constant indirect branches. However, as
msvcr120.dll is a linked list-based ML-G and the virtual func-      examined in §VI-A1a, this measure does not prevent dangerous
tion propagator_block::unlink_sources() with                        attacks and can probably also be sidestepped in practice. In
eight basic blocks in msvcp120.dll is an array-based ML-            any case, COOP can be used in the ﬁrst stage of an attack to
ARG-G. Interestingly, this particular ML-ARG-G is also de-          selectively readout the springboard.
ﬁned in Visual Studio’s standard header ﬁle agents.h. In               Many system modules in the Microsoft Windows 10 Tech-
msvcr120.dll, we also found the INV-G Cancellation-                 nical Preview are compiled with Control Flow Guard (CFG),


                                                                757
 Category                              Scheme                                  Realization                                     Effective against COOP ?
                                       Original CFI + shadow call stack [3]    Binary + debug symbols                                      
                                       CCFIR [58]                              Binary                                                      
                                       O-CFI [54]                              Binary                                                      
 Generic CFI
                                       SW-HW Co-Design [15]                    Source code + specialized hardware                          
                                       Windows 10 Tech. Preview CFG            Source code                                                 
                                       LLVM IFCC [52]                          Source code                                                 ?
                                       —various— [5], [29], [52]               Source code                                               
                                       T-VIP [24]                              Binary                                                      
 C++-aware CFI
                                       VTint [57]                              Binary                                                      
                                       vfGuard [41]                            Binary                                                      ?
                                       —various— [14], [40], [56]              CPU debugging/performance monitoring features              
 Heuristics-based detection            HDROP [60]                              CPU performance monitoring counters                         
                                       Microsoft EMET 5 [34]                   WinAPI function hooking                                     
                                       STIR [55]                               Binary                                                      
 Code hiding, shufﬂing, or rewriting   G-Free [38]                             Source code                                                 
                                       XnR [7]                                 Binary / source code                                        ?
                                       —various— [4]–[6], [13], [36], [45]     Mostly source code                                 () - see §VII-E
 Memory safety
                                       CPI/CPS [31]                            Source code                                                /

TABLE II: Overview of the effectiveness of a selection of code reuse defenses and memory safety techniques (below double
line) against COOP;  indicates effective protection and  indicates vulnerability; ? indicates at least partial protection.

a simple form of CFI. We analyzed the proprietary implemen-                   lutions exist that prevent COOP, e. g., GCC VTV as described
tation of Microsoft CFG. In summary, Microsoft CFG ensures                    above, Safedispatch [29], or WIT [5].
that protected indirect calls may only go to a certain set of                    Recently and concurrently, three C++-aware CFI approaches
targets. This set is speciﬁed in a module’s PE header [42].                   for legacy binary code have been proposed: T-VIP [24],
If multiple CFG-enabled modules reside in a process, their                    vfGuard [41], and VTint [57]. They follow a similar basic
sets are merged. For system libraries (written in C), this                    approach:
set is mostly comprised of exported functions. For the C++                      1) identiﬁcation of vcall sites and vtables (only vfGuard and
mshtml.dll we discovered that all virtual functions are                            VTint) using heuristics and static data-ﬂow analysis
contained in the set and can thus be invoked from any indirect                  2) instrumentation of vcall sites to restrict the set of allowed
call site. Accordingly, Microsoft CFG in its current form does                     vtables.
not prevent COOP, but also likely not advanced ROP-based                      T-VIP ensures at each instrumented vcall site that the vptr
attacks like the one by Göktaş et al.                                       points to read-only memory. Optionally, it also checks if a
   Tice et al. recently described two variants of Forward-Edge                random entry in the respective vtable points to read-only
CFI for the GCC and LLVM compiler suites [52] that solely                     memory. Similarly, VTint copies all identiﬁed vtables into
aim at constraining indirect calls and jumps but not returns. As              a new read-only section and instruments each vcall site to
such, taken for itself, forward-edge CFI does not prevent ROP                 check if the vptr points into that section. Both effectively
in any way. One of the proposed variants is the C++-aware                     prevent attacks based on the injection of fake vtables, but as
virtual table veriﬁcation (VTV) technique for GCC. It tightly                 in a COOP attack only actual vtables are referenced, they do
restricts the targets of each vcall site according to the C++                 not prevent COOP. VfGuard instruments vcall sites to check
class hierarchy and thus prevents COOP. VTV is available                      if the vptr points to the beginning of any known vtable. As
in mainline GCC since version 4.9.0. However, the variant                     discussed §VI-A2a, such a policy restricts the set of available
for LLVM called indirect function-call checks (IFCC) “[...]                   vfgadgets signiﬁcantly, but still cannot reliably prevent COOP.
does not depend on the details of C++ or other high-level                     VfGuard also checks the compatibility of calling conventions
languages” [52]. Instead, each indirect call site is associated               and consistency of the this-ptr at vcall sites, but this does
with a set of valid target functions. A target is valid if (i) it is          not affect COOP. Nonetheless, we consider vfGuard to be one
address-taken and (ii) its signature is compatible with the call              of the strongest available binary-only defenses against COOP.
site. Tice et al. discuss two deﬁnitions for the compatibility of             VfGuard signiﬁcantly constraints attackers and we expect it to
function signatures for IFCC: (i) all signatures are compatible               be a reliable defense in at least some attack scenarios, e. g.,
or (ii) signatures with the same number of arguments are                      for small to medium-sized x86 applications.
compatible. We observe that the former conﬁguration does not
prevent COOP, whereas the latter can still allow for powerful                 C. Heuristics-based Detection
COOP-based attacks in practice as discussed in §VI-A2b.                         Microsoft EMET [34] is probably the most widely deployed
                                                                              exploit mitigation tool. Among others, it implements different
B. C++-aware CFI                                                              heuristics-based strategies for the detection of ROP [23].
                                                                              Additionally, several related heuristics-based defenses have
  As discussed in §VI, COOP’s control ﬂow can be reliably                     been proposed that utilize certain debugging features avail-
prevented when precise C++ semantics are considered from                      able in modern x86-64 CPUs [14], [40], [56]. All of these
source code. Accordingly, various source code-based CFI so-                   defenses have recently been shown to be unable to detect more


                                                                         758
advanced ROP-based attacks [11], [16], [26], [43]. Similarly,        In CPS, sensitive pointers are not protected recursively, but it
the HDROP [60] defense utilizes the performance monitoring           is still enforced that “[...] (i) code pointers can only be stored
counters of modern x86-64 CPUs to detect ROP-based attacks.          to or modiﬁed in memory by code pointer store instructions,
The approach relies on the observation that a CPU’s internal         and (ii) code pointers can only be loaded by code pointer
branch prediction typically fails in abnormal ways during the        load instructions from memory locations to which previously
execution of common code reuse attacks.                              a code pointer store instruction stored a value” [31] where
   As discussed in §VI-A, such heuristics are unlikely to be         code pointer load/store instructions are ﬁxed at compile time.
practically applicable to COOP and we can in fact conﬁrm             Kuznetsov et al. argue that the protection offered by CPS
that our Internet Explorer exploits (§V-A and §V-B) are not          could be sufﬁcient in practice as it conceptually prevents recent
detected by EMET version 5.                                          advanced ROP-based attacks [11], [16], [26]. We observe
                                                                     that CPS does not prevent our attack, because COOP does
D. Code Hiding, Shufﬂing, or Rewriting
                                                                     not require the injection or manipulation of code pointers.
   STIR [55] is a binary-only defense approach that randomly         In the presence of CPS, it is though likely hard to invoke
reorders basic blocks in an application on each start-up to          library functions not imported by an application. But we
make the whereabouts of gadgets unknown to an attacker—              note that almost all applications import critical functions. The
even if she has access to the exact same binary. As discussed        invocation of library functions through an INV-G could also
in §VI-A1c, approaches like this do conceptually not affect          be complicated or impossible in the presence of CPS. This
our attack, as COOP only uses entire functions as vfgadgets          is however not a hurdle, because, as CPS does not consider
and only knowledge on the whereabouts of vtables is required.        C++ semantics, imported library functions can always easily
This applies also to the recently proposed O-CFI approach [54]       be called without taking the detour through an INV-G as
that combines the STIR concept with coarse-grained CFI.              described in §III-E in approach W-2.
   Execute-no-Read (XnR) [7] is a proposed defense against
so-called JIT-ROP [49] attacks that prevents code pages from                             VIII. R ELATED W ORK
being read. We note that, depending on the concrete scenario,           Since we covered related work throughout the paper, we
a corresponding JIT-COOP attack could not always be thwarted         only brieﬂy review contributions similar to ours in this section.
by such measures as it can sufﬁce to readout vtables and             Closely related to our work, several advanced ROP-based
possibly RTTI metadata (which contains the literal names of          attacks were recently demonstrated [11], [16], [25], [26],
classes) from data sections and apply pattern matching to            [43] that bypassed certain coarse-grained CFI systems [3],
identify the addresses of the vtables of interest.                   [58], [59] or heuristics-based systems [14], [23], [40], [56].
   G-Free [38] is an extension to the GCC compiler. G-               However, to the best of our knowledge, we are the ﬁrst
Free produces x86 native code that (largely) does not contain        to demonstrate bypasses of the latest defenses CPS [31],
unaligned indirect branches. Additionally, it aims to prevent        T-VIP [24], vfGuard [41], and VTint [57] and the coarse-
attackers from misusing aligned indirect branches: return            grained CFI + shadow call stack [3] concept. We also regard
addresses on the stack are encrypted/decrypted on a function’s       COOP’s tolerance against the ﬁne-grained rewriting, shufﬂing,
entry/exit and a “cookie” mechanism is used to ensure that           and hiding of executable code as unique.
indirect jump/call instructions may only be reached through             Bosman and Bos presented Sigreturn Oriented Program-
their respective function’s entry. While effective even against      ming (SROP) [10], a distinct code reuse attack approach
many advanced ROP-based attacks [11], [16], [25], [26], [43],        that misuses UNIX signals. SROP is Turing complete and in
G-Free does not affect COOP.                                         contrast to ROP does not chain short chunks of instructions
                                                                     sequences. In SROP, the UNIX system call sigreturn is re-
E. Memory Safety                                                     peatedly invoked on an attacker supplied signal frames lying
   Systems that provide forms of memory safety for C/C++             on the stack. Accordingly, as prerequisites, the attacker needs
applications [4]–[6], [13], [31], [36], [45] can constitute strong   to control the stack and needs to be able to divert the control
defenses against control-ﬂow hijacking attacks in general. As        ﬂow such that sigreturn is invoked. SROP was not speciﬁcally
our adversary model explicitly foresees an initial memory            designed to circumvent modern protection techniques, but
corruption and information leak (see §III-B), we do not explore      rather as an easy-to-use and portable alternative to ROP and
the defensive strengths of these systems in detail. Instead, we      for implementing stealthy backdoors.
exemplarily discuss two recent approaches in the following.             Tran et al. demonstrated that Turing complete return-to-libc
   Kuznetsov et al. proposed Code-Pointer Integrity (CPI) [31]       attacks are possible [53]. In their described attack, a thread’s
as a low-overhead control-ﬂow hijacking protection for C/C++.        stack is prepared in such a way that certain functions from
On the baseline, CPI guarantees the spatial and temporal             libc such as longjmp() or wordexp() are subsequently
integrity of code pointers and, recursively, that of pointers to     executed for varying arguments, where each function returns
code pointers. As in C++ applications typically many pointers        to the entry point of its successor. At its core, their approach
to code pointers exist (i. e., each object’s vptr), CPI can          shares similarities with ours. However, it can conceptually
still impose a signiﬁcant overhead there. As a consequence,          not be used to bypass modern CFI systems. Skowyra et
Kuznetsov et al. also proposed Code-Pointer Separation (CPS)         al. demonstrated how the attack by Tran et al. can also be
as a less expensive variant of CPI that speciﬁcally targets C++.     implemented using other libraries than libc [47].


                                                                 759
                       IX. C ONCLUSION                                          [14] Y. Cheng, Z. Zhou, M. Yu, X. Ding, and R. H. Deng. ROPecker: A
                                                                                     generic and practical approach for defending against ROP attacks. In
   In this paper, we introduced counterfeit object-oriented                          Symposium on Network and Distributed System Security (NDSS), 2014.
programming (COOP), a novel code reuse attack technique to                      [15] L. Davi, P. Koeberl, and A.-R. Sadeghi. Hardware-assisted ﬁne-grained
bypass almost all CFI solutions and many other defenses that                         control-ﬂow integrity: Towards efﬁcient protection of embedded systems
                                                                                     against software exploitation. In DAC, 2014.
do not consider object-oriented C++ semantics. We discussed                     [16] L. Davi, D. Lehmann, A.-R. Sadeghi, and F. Monrose. Stitching the
the speciﬁcs of object-oriented programming and explained                            gadgets: On the ineffectiveness of coarse-grained control-ﬂow integrity
the technical details behind COOP. We believe that our results                       protection. In USENIX Security Symposium, 2014.
contribute to the ongoing research on designing practical and                   [17] L. Davi, A.-R. Sadeghi, and M. Winandy. ROPdefender: A detection
                                                                                     tool to defend against return-oriented programming attacks. In ACM
secure defenses against control-ﬂow hijacking attacks, a severe                      Symposium on Information, Computer and Communications Security
threat that has been around for more than two decades. Our                           (ASIACCS), 2011.
basic insight that higher-level programming language-speciﬁc                    [18] L. De Moura and N. Bjørner. Z3: An efﬁcient SMT solver. In Conference
                                                                                     on Tools and Algorithms for the Construction and Analysis of Systems
semantics need to be taken into account is a valuable guide for                      (TACAS), 2008.
the design and implementation of future defenses. In particular,                [19] L. De Moura and N. Bjørner. Generalized, efﬁcient array decision
our results demand for a rethinking in the assessment of                             procedures. In Formal Methods in Computer Aided Design (FMCAD),
                                                                                     2009.
defenses that rely solely on binary code.                                       [20] D. Dewey and J. T. Gifﬁn. Static detection of C++ vtable escape
                                                                                     vulnerabilities in binary code. In Symposium on Network and Distributed
                     ACKNOWLEDGMENT                                                  System Security (NDSS), 2012.
   We thank the anonymous reviewers and Herbert Bos for                         [21] A. Fokin, E. Derevenetc, A. Chernov, and K. Troshina. SmartDec:
                                                                                     Approaching C++ decompilation. In Working Conference on Reverse
their constructive comments that guided the ﬁnal version of                          Engineering (WCRE), 2011.
this paper. This work has been supported by several organiza-                   [22] M. Frantzen and M. Shuey. StackGhost: Hardware facilitated stack
tion: the German Federal Ministry of Education and Research                          protection. In USENIX Security Symposium, 2001.
(BMBF) under support code 16BP12302 (EUREKA project                             [23] I. Fratric. Runtime Prevention of Return-Oriented Programming Attacks.
                                                                                     http://ropguard.googlecode.com/svn-history/r2/trunk/doc/ropguard.pdf.
SASER), the German Science Foundation as part of project                        [24] R. Gawlik and T. Holz. Towards automated integrity protection of C++
S2 within the CRC 1119 CROSSING, and the European                                    virtual function tables in binary programs. In Anual Computer Security
Unions Seventh Framework Programme under grant agreement                             Applications Conference (ACSAC), 2014.
                                                                                [25] E. Göktaş, E. Athanasopoulos, H. Bos, and G. Portokalidis. Out of
No. 609611, PRACTICE project.                                                        control: Overcoming control-ﬂow integrity. In IEEE Symposium on
                                                                                     Security and Privacy, 2014.
                             R EFERENCES                                        [26] E. Göktaş, E. Athanasopoulos, M. Polychronakis, H. Bos, and G. Por-
 [1] M. Abadi, M. Budiu, Ú. Erlingsson, and J. Ligatti. A theory of                 tokalidis. Size does matter: Why using gadget-chain length to prevent
     secure control-ﬂow. In International Conference on Formal Engineering           code-reuse attacks is hard. In USENIX Security Symposium, 2014.
     Methods (ICFEM), pages 111–124, 2005.                                      [27] Y. Guillot and A. Gazet. Automatic binary deobfuscation. Journal in
 [2] M. Abadi, M. Budiu, U. Erlingsson, and J. Ligatti. Control-ﬂow                  Comp. Virology, 2010.
     integrity: Principles, implementations, and applications. ACM Trans-       [28] R. Hund, C. Willems, and T. Holz. Practical timing side channel
     actions on Information and System Security (TISSEC), 13(1), 2009.               attacks against kernel space ASLR. In IEEE Symposium on Security
 [3] M. Abadi, M. Budiu, lfar Erlingsson, and J. Ligatti. Control-ﬂow                and Privacy, 2013.
     integrity. In Proceedings of ACM Conference on Computer and Com-           [29] D. Jang, Z. Tatlock, and S. Lerner. SAFEDISPATCH: Securing C++
     munications Security (CCS), 2005.                                               virtual calls from memory corruption attacks. In Symposium on Network
 [4] P. Akritidis. Cling: A memory allocator to mitigate dangling pointers.          and Distributed System Security (NDSS), 2014.
     In USENIX Security Symposium, 2010.                                        [30] N. Joly. Advanced exploitation of Internet Explorer 10 / Windows
 [5] P. Akritidis, C. Cadar, C. Raiciu, M. Costa, and M. Castro. Preventing          8 overﬂow (Pwn2Own 2013).                   http://www.vupen.com/blog/
     memory error exploits with WIT. In IEEE Symposium on Security and               20130522.Advanced Exploitation of IE10 Windows8 Pwn2Own
     Privacy, 2008.                                                                  2013.php, 2013.
 [6] P. Akritidis, M. Costa, M. Castro, and S. Hand. Baggy bounds checking:     [31] V. Kuznetsov, L. Szekeres, M. Payer, G. Candea, R. Sekar, and D. Song.
     An efﬁcient and backwards-compatible defense against out-of-bounds              Code-pointer integrity. In USENIX Symposium on Operating Systems
     errors. In USENIX Security Symposium, 2009.                                     Design and Implementation (OSDI), 2014.
 [7] M. Backes, T. Holz, B. Kollenda, P. Koppe, S. Nürnberger, and J. Pewny.   [32] M. Matz, J. Hubicka, A. Jaeger, and M. Mitchell. System V Application
     You can run but you cant read: Preventing disclosure exploits in                Binary Interface: AMD64 architecture processor supplement. http://x86-
     executable code. In Proceedings of ACM Conference on Computer and               64.org/documentation/abi.pdf, 2013.
     Communications Security (CCS), 2014.
                                                                                [33] Microsoft.          Data Execution Prevention (DEP).               http:
 [8] A. Bittau, A. Belay, A. Mashtizadeh, D. Mazieres, and D. Boneh.
                                                                                     //support.microsoft.com/kb/875352/EN-US/, 2006.
     Hacking blind. In IEEE Symposium on Security and Privacy, 2014.
 [9] T. Bletsch, X. Jiang, V. W. Freeh, and Z. Liang. Jump-oriented             [34] Microsoft Corp. Enhanced mitigation experience toolkit (EMET) 5.1.
     programming: A new class of code-reuse attack. In ACM Symposium on              http://technet.microsoft.com/en-us/security/jj653751, November 2014.
     Information, Computer and Communications Security (ASIACCS), 2011.         [35] Microsoft Developer Network. Argument passing and naming conven-
[10] E. Bosman and H. Bos. Framing signals—a return to portable shellcode.           tions. http://msdn.microsoft.com/en-us/library/984x0h58.aspx.
     In IEEE Symposium on Security and Privacy, 2014.                           [36] S. Nagarakatte, J. Zhao, M. M. Martin, and S. Zdancewic. CETS:
[11] N. Carlini and D. Wagner. ROP is still dangerous: Breaking modern               Compiler enforced temporal safety for C. In International Symposium
     defenses. In USENIX Security Symposium, 2014.                                   on Memory Management, 2010.
[12] S. Checkoway, L. Davi, A. Dmitrienko, A.-R. Sadeghi, H. Shacham,           [37] Nergal. The advanced return-into-lib(c) exploits: PaX case study. http:
     and M. Winandy. Return-oriented programming without returns. In                 //phrack.org/issues/58/4.html, 2001.
     Proceedings of ACM Conference on Computer and Communications               [38] K. Onarlioglu, L. Bilge, A. Lanzi, D. Balzarotti, and E. Kirda. G-Free:
     Security (CCS), 2010.                                                           Defeating return-oriented programming through gadget-less binaries. In
[13] X. Chen, A. Slowinska, D. Andriesse, H. Bos, and C. Giuffrida.                  Anual Computer Security Applications Conference (ACSAC), 2010.
     StackArmor: Comprehensive protection from stack-based memory error         [39] V. Pappas, M. Polychronakis, and A. D. Keromytis. Smashing the
     vulnerabilities for binaries. In Symposium on Network and Distributed           gadgets: Hindering return-oriented programming using in-place code
     System Security (NDSS), 2015.                                                   randomization. In IEEE Symposium on Security and Privacy, 2012.



                                                                            760
[40] V. Pappas, M. Polychronakis, and A. D. Keromytis. Transparent ROP                                       A PPENDIX
     exploit mitigation using indirect branch tracing. In USENIX Security
     Symposium, 2013.                                                             mov     edi, edi
[41] A. Prakash, X. Hu, and H. Yin. vfGuard: Strict protection for virtual        push    ebp
     function calls in COTS C++ binaries. In Symposium on Network and             mov     ebp, esp
     Distributed System Security (NDSS), 2015.                                    push    ecx
                                                                                  push    ecx
[42] M. Russinovich, D. A. Solomon, and A. Ionescu. Windows Internals,
                                                                                  push    esi
     Part 1. Microsoft Press, 6th edition, 2012.                                  mov     esi, ecx
[43] F. Schuster, T. Tendyck, J. Pewny, A. Maaß, M. Steegmanns, M. Contag,        lea     eax, [esi+3ACh]
     and T. Holz. Evaluating the effectiveness of current anti-ROP defenses.      ; -- inlined constructor of iterator --
     In Symposium on Research in Attacks, Intrusions and Defenses (RAID),         mov     [ebp+iterator.end], eax
     2014.                                                                        mov     [ebp+iterator.current], eax
[44] J. Seibert, H. Okhravi, and E. Söderström. Information leaks without       ; --
     memory disclosures: Remote side channel attacks on diversiﬁed code.
                                                                                  loop:
     In Proceedings of ACM Conference on Computer and Communications
                                                                                  lea     ecx, [ebp+iterator]
     Security (CCS), 2014.                                                        call    SListBase::Iterator::Next()
[45] K. Serebryany, D. Bruening, A. Potapenko, and D. Vyukov. Address-            test    al, al
     Sanitizer: A fast address sanity checker. In USENIX Annual Technical         jnz     end
     Conference, 2012.
[46] H. Shacham. The geometry of innocent ﬂesh on the bone: Return-               mov     eax, [ebp+iterator.current]
     into-libc without function calls (on the x86). In Proceedings of ACM         push    [esi+140h] ; push argument field
     Conference on Computer and Communications Security (CCS), 2007.              mov     ecx, [eax+4] ; read object pointer from iterator
                                                                                  mov     eax, [ecx]
[47] R. Skowyra, K. Casteel, H. Okhravi, N. Zeldovich, and W. Streilein.
                                                                                  call    [eax+4] ; call 2nd virtual function
     Systematic analysis of defenses against return-oriented programming.         jmp     loop
     In Symposium on Research in Attacks, Intrusions and Defenses (RAID),
     2013.                                                                        end:
[48] K. Z. Snow, F. Monrose, L. Davi, A. Dmitrienko, C. Liebchen, and A.-         pop     esi
     R. Sadeghi. Just-in-time code reuse: On the effectiveness of ﬁne-grained     mov     esp, ebp
     address space layout randomization. In IEEE Symposium on Security            pop     ebp
     and Privacy, 2013.                                                           ret
[49] K. Z. Snow, F. Monrose, L. Davi, A. Dmitrienko, C. Liebchen, and A.-
     R. Sadeghi. Just-in-time code reuse: On the effectiveness of ﬁne-grained     Listing A.1: Assembly code of ML-ARG-G in jscrip9.dll
     address space layout randomization. In IEEE Symposium on Security            version 10.0.9200.16521 used in exemplary Internet Explorer
     and Privacy, 2013.                                                           10 32-bit exploit: a linked list of object pointers is traversed; a
[50] B. Stroustrup. The C++ Programming Language, 4th Edition. Addison-
     Wesley, 4th edition, 2013.                                                   virtual function with one argument is invoked on each object.
[51] L. Szekeres, M. Payer, T. Wei, and D. Song. Sok: Eternal war in memory.
     In IEEE Symposium on Security and Privacy, 2013.
[52] C. Tice, T. Roeder, P. Collingbourne, S. Checkoway, Ú. Erlingsson,
     L. Lozano, and G. Pike. Enforcing forward-edge control-ﬂow integrity
     in GCC & LLVM. In USENIX Security Symposium, 2014.
[53] M. Tran, M. Etheridge, T. Bletsch, X. Jiang, V. Freeh, and P. Ning. On
     the expressiveness of return-into-libc attacks. In Symposium on Research
     in Attacks, Intrusions and Defenses (RAID), 2011.
[54] M. Vishwath, P. Larsen, S. Brunthaler, K. W. Hamlen, and M. Franz.
     Opaque control-ﬂow integrity. In Symposium on Network and Dis-
     tributed System Security (NDSS), 2015.
[55] R. Wartell, V. Mohan, K. W. Hamlen, and Z. Lin. Binary stirring:
     Self-randomizing instruction addresses of legacy x86 binary code. In
     Proceedings of ACM Conference on Computer and Communications
     Security (CCS), pages 157–168, 2012.
[56] Y. Xia, Y. Liu, H. Chen, and B. Zang. CFIMon: Detecting violation
     of control ﬂow integrity using performance counters. In IEEE/IFIP
     Conference on Dependable Systems and Networks (DSN), 2012.
[57] C. Zhang, C. Song, K. Z. Chen, Z. Chen, and D. Song. VTint:
     Defending virtual function tables integrity. In Symposium on Network
     and Distributed System Security (NDSS), 2015.
[58] C. Zhang, T. Wei, Z. Chen, L. Duan, L. Szekeres, S. McCamant,
     D. Song, and W. Zou. Practical control ﬂow integrity and randomization
     for binary executables. In IEEE Symposium on Security and Privacy,
     2013.
[59] M. Zhang and R. Sekar. Control ﬂow integrity for COTS binaries. In
     USENIX Security Symposium, 2013.
[60] H. Zhou, X. Wu, W. Shi, J. Yuan, and B. Liang. HDROP: Detecting ROP
     attacks using performance monitoring counters. In Information Security
     Practice and Experience. Springer International Publishing, 2014.




                                                                                761
 Symbol name of vfgadget (mshtml.dll Win. 7 64-bit)        # in attack code   Vfgadget type     Function
 CExtendedTagNamespace::Passivate                                1, 9b        ML-G              array-based main loop
 CCircularPositionFormatFieldIterator::Next                2, 5, 7, 9a, 10b   LOAD-R64-G        load rdx from dereferenced ﬁeld
 XHDC::SetHighQualityScalingAllowed                                3          ARITH-G           store rdx&1
 CWigglyShape::OffsetShape                                         4          LOAD-R64-G        load r9 from ﬁeld
 CStyleSheetArrayVarEnumerator::MoveNextInternal                   6          LOAD-R64-G        load r8 from ﬁeld
 CDataCache<class CBoxShadow>::InitData                            8          W-COND-G          write r8 to [rdx] if r9 is not zero
 CRectShape::OffsetShape                                       10a, 11b       ARITH-G           add [rdx] to ﬁeld
 Ptls6::CLsBlockObject::Display                                11a, 12b       INV-G             invoke ﬁeld as function pointer

TABLE A.I: Vfgadgets in mshtml.dll 10.0.9200.16521 used in exemplary Internet Explorer 10 64-bit exploit (§V-A); execution
splits into paths a and b after index 8.




 Symbol name of vfgadget (mshtml.dll Win. 7 64-bit)                   # in attack code    Vfgadget type    Function
 CExtendedTagNamespace::Passivate                                             1           ML-G             array-based main loop
 CMarkupPageLayout::IsTopLayoutDirty                                        2, 4          LOAD-R64-G       load edx from ﬁeld
 HtmlLayout::GridBoxTrackCollection::GetRangeTrackNumber                      3           ARITH-G          r8 = 2 · rdx
 CAnimatedCacheEntryTyped<float>::UpdateValue                                 4           INV-G            invoke ﬁeld from argument as
                                                                                                           function pointer

TABLE A.II: Vfgadgets in mshtml.dll 10.0.9200.16521 used in exemplary Internet Explorer 10 64-bit exploit that only uses
vptrs pointing to the beginning of existing vtables (§V-A1)




 Symbol name of vfgadget                # in attack code     Vfgadget type               Function
 jscript9!ThreadContext::                       1            ML-ARG-G                    linked list-based main loop
 ResolveExternalWeakReferencedObjects
 CDataTransfer::Proxy                           2            W-SA-G                      write deref. ﬁeld to scratch area
 CDCompSwapChainLayer::SetDesiredSize           3            R-G                         load ﬁeld from scratch area
 CDCompSurfaceTargetSurface::GetOrigin          4            ARITH-G and W-SA-G          write summation of two ﬁelds to scratch area
 CDCompLayerManager::                           5            R-G                         load ﬁeld from scratch area
 SetAnimationCurveToken
 HtmlLayout::SvgBoxBuilder::           loop entry: 6, 11     W-G                         rewrite argument ﬁeld
 PrepareBoxForDisplay
 CDXTargetSurface::OnEndDraw                   7, 8          MOVE-SP-G                   move stack pointer up
 ieframe!Microsoft::WRL::                       9            INV-G                       invoke function pointer with 2 arguments
 Callback::ComObject::Invoke
 CMarkupPageLayout::AddLayoutTaskOwnerRef 10                 ARITH-G                     increment ﬁeld
 Ptls6::CLsDnodeNonTextObject::                 12           W-COND-G                    conditionally write argument to ﬁeld; rewrites
 SetDurFmtCore                                                                           linked list; resumes at loop entry or loop exit
 CDispRecalcContext::                       loop exit        NOP                         nop; loops to self
 OnBeforeDestroyInitialIntersectionEntry

TABLE A.III: Vfgadgets used in exemplary Internet Explorer 10 32-bit exploit (§V-B); vfgadgets taken from mshtml.dll (if
not marked differently), jscript9.dll, or ieframe.dll version 10.0.9200.16521.




 Symbol name of vfgadget (libxul.so Linux 64-bit)          # in attack code               Vfgadget type     Function
 nsMultiplexInputStream::Close                                     1                      ML-G              array-based main loop
 mozilla::a11y::xpcAccessibleGeneric::˜xpcAccessibleGeneric      2, 4                     LOAD-R64-G        load rsi from memory
 and
 js::jit::MVariadicInstruction::getOperand
 nsDisplayItemGenericGeometry::MoveBy                              3                      ARITH-G           add [rsi] to ﬁeld
 ProfileSaveEvent::AddSubProfile                                   5                      INV-G             invoke ﬁeld as function pointer

                     TABLE A.IV: Vfgadgets used in exemplary Firefox 36.0a1 64-bit exploit (§V-C)




                                                             762
