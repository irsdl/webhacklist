---
type: Article
title: "Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js"
description: "Prototype pollution lets an attacker write properties onto Object.prototype, and Node.js's own standard library then reads them back as trusted input. Combining CodeQL taint analysis with dynamic property probing, the authors find 11 universal gadgets (shell, env, main, exports) and eight end-to-end RCEs in NPM CLI, Parse Server and Rocket.Chat."
resource: "https://arxiv.org/abs/2207.11171"
tags: [article, webseclist-reference, en, arxiv-org, prototype-pollution, gadget-chain, rce, nodejs, javascript-runtime, static-analysis, cve, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T20:58:48+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://arxiv.org/abs/2207.11171"
    title: "Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js"
    author: Mikhail Shcherbakov, Musard Balliu, Cristian-Alexandru Staicu
also_at:
  - "https://www.usenix.org/system/files/usenixsecurity23-shcherbakov.pdf"
authors:
  - Mikhail Shcherbakov
  - Musard Balliu
  - Cristian-Alexandru Staicu
canonical_url: ""
cited_by:
  - "2022.md:76"
commit: ""
content_sha256: 3f209af22a97f6460b79681066cbabd53e05c942c52e50c360a8b3afd9d12345
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/2207.11171"
published: ""
publisher: arXiv.org
publisher_english: ""
raw_sha256: 9bb46082408fbbedebaf1dbd0cbd5c4c56b359a7a02b1a4a6f6d2b0173b221fc
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity23-shcherbakov.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-14T20:58:48+00:00"
slug: arxiv-org-silent-spring-prototype-pollution-leads-remote-code-execution-node-js
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js

**Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js** - Mikhail Shcherbakov, Musard Balliu, Cristian-Alexandru Staicu, arXiv.org.

- Published: date not stated
- Original: <https://arxiv.org/abs/2207.11171>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity23-shcherbakov.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity23-shcherbakov.pdf (stored) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Silent Spring: Prototype Pollution Leads
      to Remote Code Execution in Node.js
Mikhail Shcherbakov and Musard Balliu, KTH Royal Institute of Technology;
Cristian-Alexandru Staicu, CISPA Helmholtz Center for Information Security
   https://www.usenix.org/conference/usenixsecurity23/presentation/shcherbakov




      This paper is included in the Proceedings of the
            32nd USENIX Security Symposium.
                   August 9–11, 2023 • Anaheim, CA, USA
                                978-1-939133-37-3




                                       Open access to the Proceedings of the
                                        32nd USENIX Security Symposium
                                             is sponsored by USENIX.
    Silent Spring: Prototype Pollution Leads to Remote Code Execution in Node.js

                       Mikhail Shcherbakov                                   Musard Balliu
                  KTH Royal Institute of Technology                  KTH Royal Institute of Technology
                                             Cristian-Alexandru Staicu
                                   CISPA Helmholtz Center for Information Security


                          Abstract                                  NPM, is the world’s largest software repository with millions
                                                                    of packages. Researchers have studied this ecosystem exten-
Prototype pollution is a dangerous vulnerability affecting
                                                                    sively to discover several security risks [14, 20, 31, 44–47, 51],
prototype-based languages like JavaScript and the Node.js
                                                                    showing that these risks are further exacerbated by the inter-
platform. It refers to the ability of an attacker to inject prop-
                                                                    connected nature of the ecosystem [52]. While most prior
erties into an object’s root prototype at runtime and subse-
                                                                    work focuses on libraries, the problem of automatically de-
quently trigger the execution of legitimate code gadgets that
                                                                    tecting vulnerabilities in Node.js applications is still open.
access these properties on the object’s prototype, leading to
                                                                       Prototype pollution is a JavaScript-driven vulnerability that
attacks such as Denial of Service (DoS), privilege escalation,
                                                                    manifests itself powerfully in the Node.js ecosystem. The
and Remote Code Execution (RCE). While there is anecdo-
                                                                    vulnerability is rooted in the permissive nature of the lan-
tal evidence that prototype pollution leads to RCE, current
                                                                    guage, which allows the mutation of an important built-in
research does not tackle the challenge of gadget detection,
                                                                    object in the global scope – Object.prototype – called the
thus only showing feasibility of DoS attacks, mainly against
                                                                    root prototype. JavaScript’s prototype-based inheritance en-
Node.js libraries.
                                                                    ables accessing this important object through the prototype
   In this paper, we set out to study the problem in a holistic
                                                                    chain. Thus, attackers can instruct vulnerable code to mutate
way, from the detection of prototype pollution to detection
                                                                    the root prototype by providing well-crafted property names
of gadgets, with the ambitious goal of finding end-to-end
                                                                    to be accessed at runtime. As a consequence, every object
exploits beyond DoS, in full-fledged Node.js applications.
                                                                    that inherits from the root prototype, i.e., the vast majority
We build the first multi-staged framework that uses multi-
                                                                    of objects in the runtime, inherits the mutation on the root
label static taint analysis to identify prototype pollution in
                                                                    prototype, e.g, an attacker-controlled property. This vulner-
Node.js libraries and applications, as well as a hybrid ap-
                                                                    ability was first introduced by Arteau [12], showing that it
proach to detect universal gadgets, notably, by analyzing the
                                                                    is a widespread problem in Node.js libraries. Recently, Li et
Node.js source code. We implement our framework on top
                                                                    al. [31,32] explore static analysis to detect prototype pollution
of GitHub’s static analysis framework CodeQL to find 11
                                                                    vulnerabilities using object property graphs.
universal gadgets in core Node.js APIs, leading to code exe-
cution. Furthermore, we use our methodology in a study of 15           The few prior works [25, 27, 31, 32, 51] on prototype pol-
popular Node.js applications to identify prototype pollutions       lution consider a successful attack any mutation of the root
and gadgets. We manually exploit eight RCE vulnerabilities          prototype. An immediate consequence of such mutations is
in three high-profile applications such as NPM CLI, Parse           Denial of Service (DoS) due to the overwriting of important
Server, and Rocket.Chat. Our results provide alarming evi-          built-in APIs, e.g., toString. By contrast, our work studies
dence that prototype pollution in combination with powerful         the implications of prototype pollution beyond DoS. In par-
universal gadgets lead to RCE in Node.js.                           ticular, we propose a semi-automated approach for detecting
                                                                    Remote Code Execution (RCE) vulnerabilities pertaining to
                                                                    prototype pollution. While there is anecdotal evidence about
1   Introduction                                                    the possibility of such attacks [5, 12], we are the first to pro-
                                                                    pose a principled and systematic approach to detect them. Our
In recent years we have seen a growing interest in running          key focus is on gadget identification and end-to-end exploita-
JavaScript outside of the browser. A prime example is Node.js,      tion which no prior work has addressed thoroughly.
a popular server-side runtime that enables the creation of             Moreover, we note the important similarities between ob-
full-stack web applications. Its package management system,         ject injection vulnerabilities (OIVs) [17, 41] and RCEs based



USENIX Association                                                                     32nd USENIX Security Symposium           5521
on prototype pollution. These attacks work in two stages: (1)         We identify eight exploitable RCE vulnerabilities in highly-
there is an untrusted flow from an application’s untrusted entry      popular applications such as NPM CLI, Parse Server and
points to an injection sink, e.g., the property of an object; (2)     Rocket.Chat. We have responsibly disclosed these critical
there is a gadget that further propagates the attacker-controlled     vulnerabilities to developers and they are now fixed, acknowl-
data from the injection sink to a security-relevant attack sink.      edging our contributions with a high-severity advisory (e.g.,
In analogy, the attacker loads the gun in stage one (by placing       CVE-2022-24760) and bug bounties.
the payload into the injection sink), while letting someone              Contrary to established recommendations, this work em-
else (a gadget) pull the trigger in stage two and carry out the       braces false positives. We show that a motivated attacker can
attack (through an attack sink). We propose calling the class         sieve through the manageable amount of false positives to
of OIVs pertaining to prototype pollution, prototype-based            find critical zero-day exploits against well-tested, mature ap-
object injection vulnerabilities (POIV).                              plications. We believe that vulnerability detection tools tuned
   In statically-typed languages, OIVs are enabled by inse-           for offensive security can afford this luxury due to the high
cure deserialization, which allows instantiating objects of an        return on investment provided by a single true positive.
unexpected type, thus triggering otherwise unused methods.               In summary, the paper offers the following contributions:
Similarly, in a duck-typed language like JavaScript, if an at-        • We are the first to study the impact of prototype pollution
tacker mutates the root prototype, they change the dynamic              vulnerabilities in full-fledged Node.js applications, beyond
type of multiple objects in the runtime. This in turn activates         denial-of-service attacks.
otherwise unused code paths that correspond to the new type,          • We present a principled approach for detecting RCE vulner-
e.g., object foo having a property bar defined. Thus, code              abilities that are enabled by prototype pollution.
reuse is done at a finer granularity and in a less localized          • We show that our pipeline is directly applicable to real-
manner in dynamically typed languages. We also note that at-            world code: we find 11 universal gadgets in Node.js’ source
tackers can mutate several properties at once, hence chaining           code and eight RCEs in popular applications.
gadgets in the fashion of property-oriented programming [17].         • We provide initial evidence that unused code shipped with
   Our technical contribution is a multi-staged framework that          the application, e.g., third-party dependencies, can be lever-
uses multi-label static analysis for detecting prototype pollu-         aged as part of code reuse attacks in Node.js.
tion, and a hybrid solution, i.e., combining dynamic and static
analysis, for detecting gadgets. We observe that code patterns
that lead to prototype pollution, i.e., injection sinks, are rather   2     Context and Technical Background
rare in real-world code. Thus, different from prior work, we
propose tuning the static analysis for improved recall, rather        This section provides background information and discusses
than precision. Additionally, to emphasize the feasibility of         the targeted threat model.
the attack, we detect universal gadgets in Node.js’ source
code, which can be exploited in a wide-range of applications          2.1    Prototype-based OIV
as they come packaged with the Node.js runtime.
   Drawing on security advisories [10], we aggregate a set of         Prototypes are a key feature to implement inheritance of
100 vulnerable packages, which we use to design and validate          JavaScript properties and methods to form a prototype chain.
our pollution detection analysis. In comparison with the state-       When creating an empty object, e.g., const obj = {}, it al-
of-the-art tool ODGen [32], we empirically show that one can          ready contains many built-in properties and functions, for
significantly increase recall and scalability, while only paying      instance, the toString function. When invoking toString
a modest decrease in precision.                                       on an object, the runtime engine will first check if the function
   We then design and evaluate our novel gadget detection             is explicitly defined for the given object. If not, it will recur-
analysis against four widely-used APIs for handling code or           sively look for its definition on the object’s prototype chain.
command execution in Node.js. We find a total of 11 gadgets           Unfortunately, most objects share the same root prototype.
that can be triggered during typical execution of these APIs.         For example, all objects created via the literal {} or the new
While some gadgets enable code injection directly, others             Object() constructor share the same prototype unless it is
allow attackers to load arbitrary files from the disk into the        explicitly overridden. The following code snippet illustrates
runtime, by confusing the module resolution mechanism. We             the problem:
also conduct a quantitative study on packages to estimate the         1   const o1 = {};
prevalence of these gadgets in the Node.js ecosystem. We              2   const o2 = new Object () ;
believe that we are the first to show evidence that control flow      3   o1 . __proto__ .x = 42;
                                                                      4   console . log ( o2 .x);
can be hijacked in this way in Node.js, further emphasizing
the dangers of shipping unused code with applications [28].           Although objects o1 and o2 are unrelated, their prototype
   Finally, we analyze 15 popular Node.js applications, re-           properties __proto__ point to the same object. In fact, if we
porting on the effort to finding RCE with our methodology.            add the new property x to the prototype of object o1 it will



5522    32nd USENIX Security Symposium                                                                           USENIX Association
also affect object o2, resulting in a print of value 42 to the        default command cmd.exe. However, since the developer
console. Therefore, if we modify the root prototype shared by         passed an empty object to function gadget (line 7), the pro-
different objects, all these objects will reflect the modification.   gram is expected to execute the default command, because
   We now explain the two stages needed to carry out a                options.cmd is undefined (line 3).
prototype-based attack that leads to code execution.                     Consider now an execution of the program in Listing 1 such
Stage 1: Polluting the prototype. Listing 1 shows a contrived         that entryPoint("__proto__", "cmd", "calc.exe&");
example to illustrate key ingredients defining an injection           The attacker manipulates the cmd property of the root pro-
sink in a POIV. We assume that the attacker controls all three        totype, causing the undefined property options.cmd to fall
arguments of function entryPoint. The first ingredient is             back to the value in the prototype chain. Hence, the attacker
an object that inherits a prototype that the attacker wants           can control the command passed to execSync, which leads
to pollute, as shown by the object in line 2, which inherits          to code execution, launching a calculator via calc.exe&.
Object.prototype.
1   function entryPoint ( arg1 , arg2 , arg3 ) {                      2.2    Threat Model
2     const obj = {};
3     const p = obj [ arg1 ];                                         Our threat model targets an attacker that controls the un-
4     p[ arg2 ] = arg3 ;                                              trusted entry points of a Node.js application with the goal
5     return p; }
                                                                      of exploiting prototype-based OIVs to perform arbitrary code
           Listing 1: Prototype pollution example                     execution on the application. These untrusted entry points
                                                                      are application-specific, however, candidates include HTTP
   The second ingredient is the attacker-controlled access to
                                                                      connections, untrusted database reads, and the like. We also
the prototype property, as shown in line 3 via the bracket
                                                                      consider a weaker threat model targeting only universal gad-
notation. The attacker can pass __proto__ to arg1 to store
                                                                      gets that occur in the source code of Node.js. Because these
Object.prototype in variable p. The last two ingredients re-
                                                                      gadgets appear in code that executes with the Node.js runtime,
quire creating a target property in the prototype and assigning
                                                                      they are available for exploitation in any Node.js application.
an attacker-controlled value. In fact, line 4 assigns an attacker-
                                                                      For this threat model, we assume that the attacker controls the
controlled value to a property of Object.prototype. Since
                                                                      injection sinks pertaining to the execution of a gadget.
the attacker controls arg2 and arg3, they can write any value
to any property. The JavaScript engine will create a new prop-
erty, if such property does not exist. In general cases, the          3     Overview
attacker cannot fully control all the ingredients, e.g., the prop-
erty in arg2 or the value in arg3.                                    This section provides an overview of our multi-staged analy-
   An immediate effect of this vulnerable pattern is the at-          sis framework, illuminating on the key challenges in detecting
tacker’s ability to perform a DoS attack, e.g, by executing the       and exploiting prototype-based object injection vulnerabili-
function entryPoint("__proto__", "toString", 1);                      ties. We use our newly-detected vulnerability in NPM CLI
to alter the state to an unexpected integer value, i.e.,              to illustrate the complexity and challenges of such an en-
Object.prototype.toString = 1, thus, forcing an                       deavor. NPM CLI [9] is the command line client that allows
application that calls toString() to crash.                           developers to install and publish packages in NPM registries.
Stage 2: Executing the gadget. This stage requires identify-          It comes bundled with the Node.js runtime and consists of
ing gadgets that contain insecure flows from injection sinks          713,648 lines of code.
to attack sinks that perform security-sensitive actions.              Detecting prototype pollution. Figure 1 shows the simplified
1   const { execSync } = require (" child_process ");                 code fragment of the function diffApply from NPM CLI’s
2   function gadget ( args , options ) {                              codebase, which is subject to prototype pollution.
3     const cmd = options . cmd || " cmd . exe /k";                     The function takes the array path from the attacker-
4     return execSync ( ‘${ cmd } ${ args } ‘);
5   }                                                                 controlled parameter diff and calls the built-in function
6   const args = ...;                                                 shift() that returns the first element of the array. The
7   gadget ( args , {}) ;                                             data flow then goes through the loop storing a property
                  Listing 2: Gadget example                           value to the variable obj (red line). Because the attacker
                                                                      indirectly controls the property name thisProp in line 8,
   Consider the benign example in Listing 2, where a list of          the property read allows them to access the object’s root
arguments args and a command object options is passed                 prototype by setting thisProp to __proto__. Subsequently,
to a function gadget with the intention to execute command            the attacker can assign any value to any property of the root
options with arguments args. The intended use of function             prototype as illustrated by the assignment in line 11. As
gadget is to either execute the command that is specified             a result, the attacker has full control of the injection sink
via the property cmd of the options object or execute the             denoted by the blue dotted lines. For instance, the function call



USENIX Association                                                                      32nd USENIX Security Symposium           5523
                                                                       1    const { ArrayPrototypePush } = primordials ;
                                                                       2    const { Process } = internalBinding ( ’ process_wrap ’);
 1   function diffApply (obj , diff ) {                                3    function spawn ( file , args , opts ) {
 2     var lastProp = diff . path . pop () ;                           4      opts = normalizeSpawnArgs ( file , args , opts );
 3     var thisProp ;                                                  5      this. _handle = new Process () ;
 4     while (( thisProp = diff . path . shift () ) != null) {         6      this. _handle . spawn ( opts );
 5       if (!( thisProp in obj )) {                                   7    }
 6          obj [ thisProp ] = {};                                     8
 7       }                                                             9    function normalizeSpawnArgs ( file , args , opts ) {
 8       obj = obj [ thisProp ];                                      10      let envKeys = [] , envPairs = [];
 9     }                                                              11      const env = opts . env || process . env ;
10     if ( diff . op === REPLACE || diff . op === ADD ) {            12      /* ... */
11       obj [ lastProp ] = diff . value ;                            13      for (const key in env )
12     }                                                              14        ArrayPrototypePush ( envKeys , key );
13   }                                                                15
                                                                      16        for (const key of envKeys ) {
            Figure 1: Injection sink in NPM CLI                       17          const v = env [ key ];
                                                                      18          ArrayPrototypePush ( envPairs , ‘${ key }= ${v} ‘);
                                                                      19        }
                                                                      20
diffApply({}, {path: [’__proto__’, ’env’], value:                     21        return { /* ... ,*/ envPairs /* , ... */ };
’payload’, op: ADD}) injects into Object.prototype                    22    }
the environment property env with payload payload.
                                                                           Figure 2: Universal gadget in Node.js standard library
   This code fragment illustrates the challenges that a static
analysis should overcome. First, in contrast to standard taint
analysis, injection sinks cannot be identified syntactically as      identify property reads that delegate the lookup of the prop-
they require specialized data flow analysis that record ac-          erty to the prototype chain, while filtering out cases where
cesses to object properties, as illustrated by the blue dotted       the property is defined in the object itself. This is a compli-
line. The analysis should identify attacker-controlled inputs        cated task for a static analysis, hence we use dynamic analysis
that allow to control the prototype object, followed by uses         instead. We discuss the details in Section 4.2.
of this prototype object as a receiver in a property assign-            Further, the gadget contains intricate data flows from the
ment [31]. Second, the analysis should handle language con-          property read in line 11 to the attack sink in line 6 as de-
structs such as loops and model the JavaScript built-in func-        noted by the red arrows. Specifically, the for..in loop enu-
tions, e.g., shift() to correctly propagate data flows. Third,       merates the property names of the read object and passes
given the size of the targeted codebases, the analysis should        them to an array through the ArrayPrototypePush call.
be scalable, seeking the sweet spot between precision and            This is an internal function that implements the seman-
recall. While prior work achieves high precision, it reports         tics of Array.prototype.push and subsequently enumer-
low recall, thus increasing the possibility to miss flaws in real    ates the envKeys array, storing key-value pairs by the tem-
applications [31, 32]. These requirements lead us to our first       plate literal (line 18) and returning a new object with the
research question: How to design and implement a scalable            property envPairs. Therefore, an analysis should model
static analysis that effectively identifies prototype pollution in   the semantics of internal functions, template literals, the
real-world libraries and applications? To answer this ques-          for..in and for..of statements to propagate the attacked-
tion we develop a multi-label static taint analysis, which we        controlled values properly. Moreover, function spawn (line
discuss in Section 4.1 and evaluate in Section 6.1.                  3) passes the modified object opts to method spawn of
Detecting code gadgets. Recall that our threat model requires        the internal wrapper Process (line 6) that is implemented
identifying code gadgets that read the attacker payloads from        in the C++ component of Node.js. This method corre-
the injection sink and pass it into an attack sink. Figure 2         sponds to the actual attack sink. Specifically, if an attacker
shows a universal gadget we identified, stemming from the            uses {GIT_SSH_COMMAND: ’calc&’} as payload for func-
popular spawn function of the Node.js standard library. This         tion diffApply, they can simply wait for an invocation of
function first calls normalizeSpawnArgs and reads the value          the attack sink spawn from the git command. The latter
of property opts.env in line 11. This optional parameter con-        uses the specified command from the environment variable
tains key-value pairs of the environment variables of a new          GIT_SSH_COMMAND when connecting to a remote system. This
process. If a developer passes an object without property env,       leads us to our third research question: How to identify the
the JavaScript runtime will look up the property in the proto-       attack sinks and data flows from universal property reads
type chain. Alternatively, attacker can inject the environment       to these attack sinks in Node.js? Gadget detection is a new
variable directly using the for..in loop in line 13 to sub-          challenge with no prior research, except for some evidence
sequently read it either from the opts.env or process.env            provided by the practitioners’ community [5, 12]. To address
object in line 11.                                                   this question, we develop a taint-based static analysis that 1
   The reader may at this point wonder about our second re- 1        tracks flows from property reads to attack sinks, which we
search question: How to identify universal properties reads          discuss in Section 4.2 and evaluate in Section 6.2.3.
such as env? In fact, a prerequisite for gadget detection is to      Putting it all together. The presence of prototype pollution



5524    32nd USENIX Security Symposium                                                                            USENIX Association
                    Pollution Detection                                            4.1    Prototype Pollution Detection
 Application Code                       Patterns                  Pollution
                       Injection Sink              Entry Point
    Package Code                                                  Payload
                         Detection                 Detection
                                                                 Generation        Multi-label taint analysis. The detection of prototype
                                                                       Exploit     pollution requires specialized data flow analysis that
                  Gadget Detection                                    Generation   identifies injection sinks boiling down to the pattern
  Node.js Code                    Property
                      Dynamic
                                   Names
                                                   Attack Sink
                                                                  Gadget           obj[prototype][property] = value. We find these pat-
 Node.js Instance                                                 Payload
                      Analysis                      Detection
                                                                 Generation
                                                                                   terns by means of a flow- and context-sensitive multi-label
                                                                                   taint analysis. Specifically, we use two labels input and
                                                                                   proto to capture the temporal relationship between (attacker-
Figure 3: High-level workflow: automated steps (green) and                         controlled) property accesses in an object. We use label input
manual steps (blue).                                                               to mark parameters that are directly controlled by the attacker
                                                                                   and label proto to record that the attacker already controls the
                                                                                   prototype of the labeled object.
and gadgets is not sufficient to carry out an end-to-end RCE                          The analysis works as follows: initially, it marks the pa-
attack. The attacker needs to identify application-specific                        rameters of the analyzed function with the input label. Then,
untrusted entry points that enable the payload to reach the                        it performs (standard) taint analysis propagating this label
injection sinks, and to subsequently propagate this payload                        according to the JavaScript semantics until it reaches a prop-
to an attack sink via the gadget. This step requires us to                         erty read with a tainted value in the property name, e.g.,
combine data flow analysis with the call flow analysis, starting                   obj[prototype] with prototype having label input. This
at untrusted entry points, while driving the payload to reach an                   indicates that the attacker may control the property name and
attack sink. This leads to our final research question: How to                     get access to the root prototype. At this point, the label of the
identify public entry points and payloads to demonstrate the                       resulting property read, e.g., obj[prototype], is changed
feasibility of RCE attacks? We use a combination of manual                         to the label proto to record that the attacker can now con-
and automated analysis to drive the exploit towards success,                       trol the prototype. Subsequently, the analysis continues the
as detailed in Section 4.3 and evaluated in Section 6.3.                           taint propagation until it reaches a property assignment, e.g.,
                                                                                   obj[prototype][property] = value, where the object of
4     Methodology                                                                  the property assignment, i.e., obj[prototype], is marked
                                                                                   with the proto label, thus identifying the injection sink. We
We present a semi-automated analysis framework for detect-                         note that this a general characterization of injection sinks,
ing and exploiting prototype-based vulnerabilities. The frame-                     where the attacker does not necessarily control the accessed
work is divided into three major steps: (i) automated prototype                    property (property) and the assigned value (value), so long
pollution detection; (ii) automated gadget detection; and (iii)                    as they control the root prototype (prototoype). Because
manual exploit generation for end-to-end attacks. Figure 3                         this setting is more difficult to exploit, our analysis supports a
illustrates the sequence of steps and their dependencies.                          priority mode to identify attacker-controlled property names
   The prototype pollution detection step takes as input the                       and values in a property assignment. Specifically, it performs
code of an application or NPM package and performs a multi-                        two additional operations to check that the property read
label taint-based static analysis. Subsequently, the analysis                      (property) and the value (value) are marked with label in-
reconstructs the call graph of the application to find entry                       put, indicating that they may be controlled by the attacker. As
points that reach the prototype pollution, thus facilitating the                   expected, these priority injection sinks are an easier target for
task of identifying attacked-controlled entry points. The gad-                     exploitation in practice.
get detection step implements a hybrid solution. A dynamic                            Figure 1 illustrates the multi-label taint analysis for the pro-
analysis first detects which properties can be actually polluted                   totype pollution vulnerability in NPM CLI. We consider the
by executing Node.js APIs of interest in a testing environment                     function diffApply as target function and mark the parame-
that logs property accesses, ultimately returning a list of ac-                    ters with label input. The red arrows depict the propagation of
cessed property names. These property names, together with                         label input. The parameter diff is an object and the taint anal-
the source code of Node.js, are used as input to our second                        ysis passes the tainted label to all its properties. The method
static analysis to identify (universal) gadgets in Node.js. Each                   shift is a built-in method that returns the first element of the
gadget includes an entry point that reaches a targeted property                    array. The static analysis models JavaScript standard built-in
read and an attack sink that is called with values read from the                   objects, and thereby, propagates the input label to thisProp
target property. The last step of the approach is the end-to-end                   in line 4. The next node of the data flow is the property read
exploit generation. This is a manual step that requires an in-                     in line 8, hence the analysis changes its label to proto. The
vestigation of the target application’s workflow to validate the                   blue dotted lines then visualize the proto label propagation.
exploitability of the detected prototype pollution and gadget                      The tainted value reaches the property assignment, and the
to achieve code execution on the system.                                           algorithm reports this expression as the injection sink. This



USENIX Association                                                                                    32nd USENIX Security Symposium           5525
is also a priority sink because the parameters lastProp and         dynamic analysis defines a custom handler with a property get-
diff.value in line 11 have label input.                             ter in Object.prototype for each extracted property name.
   Methodology We define the (attacker-controlled) target           We systematically analyze the Node.js API documentation to
functions in two ways: (i) a package’s exported functions           identify functions that potentially run processes or evaluate
(dubbed Exported Functions) or (ii) any function of the an-         arbitrary code in the runtime. We then invoke these APIs to
alyzed codebase (dubbed Any Functions). We use the first            log their attempt of property reads from Object.prototype,
option for the package analysis only, assuming that the at-         which result in reading uninitialized properties and getting the
tacker controls any exported function and class of a package.       value undefined. This means that the values of these prop-
The second option allows us to analyze real-world applica-          erties can be tampered via prototype pollution. The dynamic
tions with no knowledge of the application’s entry points,          analysis passes the collected property names to the next step.
which usually depend on the specific threat model. We find          Static analysis. The analysis takes the Node.js’ source code
this option useful in practice to overcome inherent limitations     and the property names as input. The algorithm first performs
of static analysis for JavaScript, which does not always sup-       the call flow analysis of Node.js API functions, including in-
port the correct label propagation, e.g., due to callbacks or       formation about aliases, ultimately allowing us to reconstruct
dynamically-generated code. In this case, the analysis allows       a precise call graph of the analyzed functions. We then use the
us to detect injection sinks by propagating the input label         call flow analysis to identify paths from any exported function
from the nearest function on the call graph. Yet, the semantic      to polluted property reads (identified by the dynamic analy-
modeling of built-ins is key to increasing the true positive        sis) and subsequently combine it with context-sensitive taint
rate.                                                               tracking to identify paths from these property reads to attack
   Ideally, a taint analysis should provide precise and com-        sinks, represented as tainted arguments to internal function
plete models of JavaScript constructs. CodeQL features many         calls. Specifically, the analysis propagates the taints on return
person-hour contributions into the modeling of built-in func-       values only for functions that are reached by the Node.js API
tions. Nonetheless, we observe that in practice these models        on the analyzed call flow. Additionally, the analysis identifies
are still insufficient. Our approach relies on the ground truth     affected exported functions that were not analyzed dynami-
provided by known vulnerabilities to improve the tool in            cally. For instance, the analysis of function spawn reports a
modeling features that pertain to these vulnerabilities, thus       possible pollution of property env. The static analysis shows
reducing the number of false negatives. Concretely, we re-          the attack sinks that are affected by env include additional
view the CodeQL standard library to identify and fix language       Node.js API functions such as spawnSync, exec and fork.
features, e.g., Arrays and reflection calls (see Section 5) that       The taint analysis considers internal functions, i.e., func-
affect the taint semantics for the considered packages. We          tions for which the analyzer cannot resolve the function body,
applied this process iteratively to achieve high recall.            as candidate attack sinks. We conservatively cover all func-
Entry point detection. We propose a lightweight analysis to         tions with no implementation in the codebase. The taint analy-
detect application-level entry points that may trigger the in-      sis also uses multi-labels. For property assignments, the algo-
jection sinks. This helps with applications that receive tainted    rithm propagates the taint label polluted of the property and
data from external storage to find the external action that trig-   applies the new label receiver to the receiver recursively. For
gers the data acquisition from the storage. The static analysis     instance, if value in the assignment obj.prop = value has
first reconstructs a call graph where the functions with no         label polluted, then the analysis applies the receiver label to
callers are represented by nodes with outgoing edges only.          obj and the polluted label to its property prop. This is needed
The algorithm considers such nodes as potential application         because we cannot enumerate all properties of an object when
entry points and reports the code paths to the injection sink.      this object is used as parameter to an attack sink. Finally, the
   Summary This step provides information about the pollu-          static analysis reports internal functions with no arguments
tion patterns and application’s entry points for future manual      and either polluted or receiver labels as attack sinks.
validation and exploit generation. We contribute five analysis         Figure 2 shows the analysis in action for property env.
variants: one analysis for entry point detection; two priority      The blue dotted arrows illustrate the call flow analysis from
analyses (for each type of target function) that report injection   the exported function spawn to the first function call. The
sinks with all tainted ingredients; and two general analyses        normalizeSpawnArgs contains the property read env which
(for each type of target function) that report injection sinks      is the starting node of the taint analysis (red arrows). Initially,
with a tainted receiver only.                                       the taint analysis propagates the label polluted through the
                                                                    data flows. When the tainted value reaches the object creation
                                                                    statement in line 21, the analysis keeps the taint label for
4.2    Gadget Detection                                             the property envPairs and assigns the label receiver to the
                                                                    created object. This object is further propagated to the caller
Dynamic analysis. We first parse the Node.js’ source code           function and passed to the internal function _handler.spawn
and syntactically extract all directly-accessed properties. The     in line 6, thus reporting _handler.spawn as a candidate sink.



5526    32nd USENIX Security Symposium                                                                         USENIX Association
4.3    Exploit Generation                                            that describe the data flow between a source and a sink in
                                                                     the codebase. They support expandable taint tracking with
Our approach relies on the human-in-the-loop model for ex-           the possibility of using multiple flow labels. This is essen-
ploit generation. For gadget exploits, the information about         tial to implement our analysis algorithms described in Sec-
attack sinks allows us to evaluate the impact of a polluted          tion 4. Specifically, we develop the custom path queries for
property and filter out non-malicious sinks. The call flow and       pollution and gadget detection. We extend the taint tracking
taint analysis help to explore the code slice that reaches the       configuration to combine the call-flow and data-flow analy-
attack sink. We use this information to generate a payload and       ses, thus propagating tainted values through call flows in a
test it on the detected Node.js APIs. We validate the detected       context-sensitive way. This feature is essential for some of our
sinks and report new gadgets for Node.js in Section 6.2.3.           analyses, e.g., to analyze entry points that receive tainted data
   A security analyst first analyzes the prototype pollution         from a database and not propagate the taint labels through
patterns to filter out false positives and non-executable cases      code that is reachable from other entry points. We also model
in the regular application workflow, e.g., patterns in testing       the array built-in functions reduce, filter and more, to cor-
code and development tools. For suspicious cases, the analyst        rectly propagate tainted values via callback functions passed
uses the automatically-detected entry points to generate the         as arguments. This allows us to detect vulnerabilities that use
first version of a payload and validates it on the application. If   reduce in the injection sink. We also resolve new functions
an exploit fails, the analyst investigates the cause using other     created by bind call to propagate taints from the provided
tools (e.g., a debugger) and modifies the payload.                   values of the bind arguments to the bound function param-
   If the validation of the prototype pollution succeeds, then       eters. Other changes include support for parameter passing
the next step is to search for gadget triggers. We extend the        via apply() and call() function calls, as well as the rest pa-
universal gadget entry points (e.g., spawn) with functions           rameter syntax and the arguments object. We also improve
that evaluate JavaScript code represented as strings (eval(),        the detection of exported functions of Node.js packages. Our
new Function(), new vm.Script) and provide a call graph              analysis queries for pollution and gadget detection follow
analysis for these calls. The analyst may use the call graph         the methodology described in Section 6.1 and are publicly
analysis to detect calls to these functions as well as the appli-    available as complementary material [43].
cation’s entry points that reach these calls.
   If the analyst detects a gadget trigger, they need to validate
that it is executed after the injection sink and then generate a     6     Evaluation
payload that pollutes the required properties. If code evalua-
tion function is detected, the analyst investigates the precondi-    This section presents our experiments to validate the useful-
tions for invoking it with attacker-controlled data. The input       ness of our approach to detect and exploit POIVs. We perform
data can be read from the polluted property, or the function’s       the experiments on an Intel Core i7-8850H CPU 2.60GHz,
execution may be dependent on specific conditionals that use         16 GB of memory. The tool, the analysis results and data are
the polluted property. These steps lead to arbitrary code exe-       available in the GitHub repository [43].
cution inside the Node.js instance. We estimate the effort of
using such exploitation model in a study in Section 6.3.
                                                                     6.1    Evaluation of Prototype Pollution

5     Implementation                                                 This section evaluates the effectiveness of our tool to detect
                                                                     injection sinks, reporting on precision and recall. While re-
CodeQL [4] is a production-scale analysis engine to perform          cent approaches already target this problem [27, 31, 32] for
semantics-based search on a target codebase, essentially by          Node.js libraries, our key contribution is scalability with low-
treating code as data. The analysis first extracts a full hierar-    to-moderate precision loss, while achieving high recall. In
chical representation of code (e.g., the AST) into a relational      contrast to prior work on libraries, we find that injection sinks
database. It then runs analysis queries against the database         are rare in real-world applications, motivating the need for
to compute result tuples, for instance, pairs of source loca-        high recall to identify exploitable vulnerabilities.
tions and error messages for bug finding. CodeQL queries are         Benchmark. We compile an open-source dataset of 100
written in a declarative, object-oriented logic programming          vulnerable Node.js packages, collected from the Snyk
language called QL, which uses Datalog as underlying seman-          database [10]. By studying the proof-of-concept exploit pro-
tic model [13]. It also provides a standard library of queries       vided in the vulnerability report, we manually identify code
that implement control-flow and data-flow analyses, as well as       locations (file name and line number) of injection sinks per-
support for mainstream languages including JavaScript. The           taining to the assignment of an attacker-controlled value to
JavaScript model and the analyses are part of the open-source        the polluted property. We observe that some packages contain
QL standard library, making them amenable to extensions.             multiple exploitable injection sinks, which we also add to
   A key feature that we use in our analyses are path queries        our benchmark. This new dataset serves as ground truth to



USENIX Association                                                                     32nd USENIX Security Symposium           5527
evaluate the detection capabilities of static analyses. For com-     because of missing models of built-in functions. However, pre-
parison, we also consider the dataset of 19 packages provided        cision deteriorates because some detected patterns are not ac-
by the state-of-the-art work ODGen [32].                             tually reachable from the library API with attacker-controlled
Setup. We use our benchmark to calculate the rate of true pos-       arguments. We also notice the precision loss is much less than
itives (TP), false positives (FP), and false negatives (FN) in       one would expect from an analysis with the strong assump-
an effort to identify the sweet spot between the precision and       tion that any function’s arguments are attacker-controlled. We
recall of the analysis. The precision metric describes how well      believe this is due to the shape of injection sinks requiring
the tool identifies exploitable injection sinks, while recall rep-   patterns that are not very common in real-world code (see
resents the fraction of real vulnerabilities reported by a tool.     Section 4.1). While 31% precision in aggregate results is not
Following the methodology in Section 4.1, we run our tool            ideal, our analysis produces less than 10 false positives for
in four different modes with the goal of identifying the most        90% of the benchmarks.
effective approach for detecting injection sinks in real-world           Our third experiment is the evaluation of Priority queries
applications. Our benchmark shows that attackers can have            with Any Functions as entry points. In this setting, the attacker
different levels of control over the injection sinks. While in       controls the name and value of the polluted property, thus
general it can be sufficient to control the injection of the root    it can leverage any existing gadget. The analysis achieves
prototype only, we notice that most exploits target injection        40% precision and 93% recall. The additional restrictions on
sinks with attackers controlling both the name and value of a        arguments increase the precision metric and keep high recall.
polluted property. Therefore, our tool distinguishes between         Because the analysis starts from any function and does not
the two cases, respectively, denoted as General queries and          require specifying the entry points, we can easily apply it
Priority queries. Moreover, since our analysis considers tran-       to real-word application analysis. We identify this analysis
sitive dependencies, we distinguish between target functions         query as the sweet spot between precision and recall, and use
considering Exported Functions and Any Functions, with the           it to detect vulnerabilities in real applications (Section 6.3).
goal of identifying the best mode to analyze applications.               Our final experiment is a direct comparison with
   We also compare our results with three analysis queries           ODGen [32]. ODGen’s analysis corresponds to our General
which CodeQL recently made available publicly. We consider           queries with Exported Functions. ODGen is tailored towards
these CodeQL queries as baseline queries and run them on             high precision, while the authors recognize the need for high
our benchmarks. Moreover, we conduct a direct comparison             recall. In fact, our experiment shows that ODGen achieves
with ODGen [32] on the dataset of 119 libraries.                     100% precision and 50% recall on the dataset of 19 libraries,
Results. We report the evaluation results in Table 3 in Ap-          while our analysis achieves 95% precision and 95% recall
pendix and here discuss only the precision and recall metrics        (see the evaluation results in [43]). Nonetheless, ODGen
in comparison with CodeQL’s baseline queries and ODGen.              detects vulnerabilities in 17 out of the 19 libraries, but fails
   CodeQL provides three queries to detect prototype pollu-          to detect some variants of these vulnerabilities. We further
tion, one of which yields no results, hence we discard it. The       evaluate ODGen on our dataset of 100 packages to find that it
remaining two queries detect vulnerabilities in 57 packages,         achieves 87% precision and 33% recall.
with 47% and 67% precision and 42% and 21% recall, re-
spectively. While our analysis queries have been developed           6.2     Gadget Detection
independently, our main goal is to achieve high recall with
good precision. A fair comparison with the CodeQL baseline           We evaluate the feasibility of our universal gadget detection
corresponds to our General queries with Exported Functions,          analysis and discuss the most important gadgets. We run our
which yields 35% precision and 88% recall. The improved              analysis on Node.js version 16.13.1 and exploit each gadget
recall is due to better support for exported functions, array        both on Linux and on Windows operating systems.
built-in functions, and complete semantic modeling of re-
flective invocations through apply(), call() and build()             6.2.1   Dynamic Analysis
functions. These results confirm the challenge of statically
analyzing data flows in JavaScript without precise models of         We download the source code of Node.js and parse it to extract
the language semantics and built-in functions.                       all directly-accessed properties. We obtain a total of 18,741
   Our second experiment is an evaluation of General queries         property names for the analyzed codebase [8]. For each name,
with Any Functions as entry points. The analysis achieves 31%        we install a getter on Object.prototoype to detect any po-
precision and 97% recall, producing 5 false negatives. This          tential access to that property by Node.js’ internals.
false negatives are in packages such as Templ8 and total_js             Subsequently, we exercise the APIs under test with
with injection sinks into code that is generated dynamically         typical inputs from the Node.js documentation, e.g., exe-
via new Function(), which CodeQL does not support. The               cute the ls command with spawn [7], and log any poten-
high recall shows that injection sinks appear in a few adjacent      tial accesses observed by the getter. In total, we analyze
functions, which reduces the risk of losing the taint marks          three APIs, i.e., child_process.spawnSync, require, and



5528    32nd USENIX Security Symposium                                                                         USENIX Association
vm.runInNewContext, and obtain 10, 11, and 16 candidate            namic analysis step that the Node.js core performs a read
properties, respectively. The usage of these properties is fur-    from this universal property when the function spawnSync is
ther analyzed in the Node.js’ codebase, using static analysis.     invoked, but by running a call graph reachability analysis we
   We note that the inputs used for driving the dynamic anal-      identify four other APIs that reach one of the sources.
ysis are by no means exhaustive. We probably cover only a             We build a simple test case to first pollute the shell prop-
small part of the target APIs in our tests, potentially missing    erty with the value touch and then invoke one of the affected
property accesses that only happen when the API is invoked         JavaScript API, i.e., spawnSync. By observing the side-effect
with certain arguments. Nonetheless, for such cases, the re-       of this test case, i.e., the file creation in the current directory,
sulting gadgets would be of limited use, as they would require     we conclude that if an attacker can pollute shell, the API
the target application to pass those exact arguments to trigger    under test uses its value as command, instead of the argument
the gadget. Instead of being comprehensive in our test case,       passed by developers. We next discuss this gadget and others.
we focus on the typical usages of the target APIs, which we
believe yields easy-to-trigger gadgets.
                                                                   6.2.3   Universal Gadgets
   Given the low number of properties detected in this step,
one could directly fuzz these properties and build proof-of-       We open source all the detected gadgets for Node.js in a
concept exploits. However, we further trace their usage inside     GitHub repository [42]. Table 1 overviews the gadgets for the
the Node.js codebase to understand if they are exploitable.        target Node.js version. Some of the gadgets are OS-specific,
                                                                   while most of them run on both considered OSs. We empha-
                                                                   size the diverse set of universal properties involved, showing
6.2.2   Static Analysis
                                                                   that gadgets are not isolated buggy cases, but they are com-
As discussed in Section 4.2, our approach takes the JavaScript     mon place. These gadgets correspond to a handful of target
source code of Node.js and the property names from the             APIs inside the Node.js core, but that a motivated attacker
dynamic analysis phase as input, and reports a call chain          can probably find many more inside the codebase of a target
to reach a property read and a data flow from the property         application. Finally, as we discuss below, some gadgets allow
read to an internal function invocation. We only analyze the       arbitrary code execution with a relatively strong precondition,
JavaScript code from the folder lib of the repository [8]. The     while others allow hijacking the control flow with a weaker
analyzed codebase contains 70,493 lines of code (LOC).             precondition. More importantly, an attacker can combine two
   In total, we identify 778 exported functions that reach the     such gadgets to get the best of both worlds.
property reads (sources), and 342 in which values read from           We now discuss some of our most important gadgets and
these properties flow into internal functions (sinks). We note     their assumptions to be fulfilled. Let us consider an applica-
that while inspecting all these code locations rigorously re-      tion that invokes the execSync API with a string literal:
quires a significant amount of manual effort, we opt for prag-     1   const { execSync } = require ( ’ child_process ’);
matic exploration: we first analyze the sink and decide if the     2   console . log ( execSync ( ’ echo " hi " ’). toString () );
invoked API, usually a native binding to the C/C++ code, is a
relevant injection sink. If so, we continue with inspecting the    This benign looking code prints the string hi in the console.
sources to see which JavaScript APIs we can use to reach a         Staicu et al. [45] report that such API calls are prevalent in
particular code location.                                          the NPM ecosystem, but they consider safe all call sites with
   Let us consider the case of shell, a universal prop-            constants as arguments, like the one above. That is because
erty identified by our dynamic analysis. The static analy-         they assume an attacker cannot manipulate the command’s
sis identifies 8 sources, meaning that the reads of shell          value as it is set to a fixed value by developers. We find that
are reached from eight Node.js exported functions, mostly          this assumption does not hold in the presence of prototype
from the file lib/child_process.js. By propagating                 pollutions. If attackers can pollute arbitrary properties in the
taints from all detected property reads, we identify 11            runtime, they can hijack both the command to be executed and
function invocations in which the tainted value leaves             its environment variables. Consider the polluted properties:
the JavaScript world. One of them is located in the file           1   Object . prototype . shell = " node ";
lib/internal/child_process.js and is a call to the na-             2   Object . prototype . env = {};
                                                                   3   Object . prototype . env . NODE_OPTIONS =
tive spawnSync in the C++ bindings. By studying the bind-
                                                                           " -- inspect - brk =0.0.0.0:1337 ";
ings and the way they are invoked, we conclude that the shell
universal property is a candidate for developing a gadget.            They trick the benign code above into spawning a new
   We thus proceed to further study the operations performed       Node.js process with the debug port open, acting as a reverse
on the value stored in the universal property inside the Node.js   shell. This is because the polluted property shell overwrites
codebase. CodeQL provides great support in this step, allow-       the command given by developers and env.NODE_OPTIONS
ing us to jump at the relevant code locations where this value     is set as environment variable of the current process and sub-
is read and then manipulated. We already know from the dy-         sequently copied to all children processes.



USENIX Association                                                                    32nd USENIX Security Symposium            5529
    ID       Universal properties    Trigger                                       Impact                                     OS
    G1           shell, env          Call command injection API                    Execute an arbitrary command               L+W
    G2           shell, env          Call command injection API                    Execute an arbitrary command                L
    G3          shell, input         Call command injection API                    Execute an arbitrary command                W
    G4             main              Import a package without a declared "main"    Import an arbitrary file from the disk∗    L+W
    G5             main              Require a package without a declared "main"   Require an arbitrary file from the disk∗   L+W
    G6           exports, 1          Require a file using a relative path          Require an arbitrary file from the disk∗   L+W
    G7             ’=C:’             Resolve a file path                           Resolve the path to a different file        W
    G8       contextExtensions       Require a file using a relative path          Overwrite global variables of the file     L+W
    G9       contextExtensions       Compile function in a new context             Overwrite function’s global variables      L+W
    G10       shell, env, main       Require a package without a declared "main"   Execute an arbitrary command               L+W
    G11     shell, env, exports, 1   Require a file using a relative path          Execute an arbitrary command               L+W

Table 1: A summary of the identified Node.js universal gadgets. For each gadget, we show the properties that the attacker must
pollute beforehand, the action that triggers the gadget, and the produced effect. The last column shows the operating system on
which the gadget works: Linux (L), Windows (W), or both (L+W). ∗ denotes gadgets for which we have a Windows variant that
achieves arbitrary command execution using the SMB protocol.


   The presented gadget affects all the APIs for command             vates the need for debloating techniques like Mininode [28].
execution in Node.js: spawn, spawnSync, exec, execSync,                In addition to the already alarming findings, an attacker
execFileSync. A precondition for this attack is that the tar-        can combine the two gadgets discussed above to obtain a
get command execution call site should not explicitly set an         powerful universal gadget:
options argument, e.g., for an execSync call, there should            1   // pollutions for the first gadget
be no second argument passed. The existence of this gadget            2   Object . prototype . main = "/ path / to / npm / scripts /
implies that every Node.js application that is vulnerable to                  changelog . js ";
prototype pollution and uses a command execution API after            3   // pollutions for the second gadget
                                                                      4   Object . prototype . shell = " node ";
a pollution is vulnerable to remote code execution.                   5   Object . prototype . env = {};
   Now consider an application that does not directly use such        6   Object . prototype . env . NODE_OPTIONS =
APIs in user-facing code. An attacker can still leverage code                 " -- inspect - brk =0.0.0.0:1337 ";
                                                                      7   // trigger call
that is present on the machine to trigger a command execution         8   require (" bytes ");
API. We found three gadgets that exploit the require and
import methods. Consider the following example:                          When the bytes package is loaded, the first gadget in-
                                                                      structs the engine to load the changelog.js file. This file
1   Object . prototype . main = " ./../../ pwned . js "
2   // trigger call                                                   in turn invokes execSync, which triggers the second gadget,
3   require ( ’my - package ’)                                        starting a Node.js process with a debugging session.
                                                                         Finally, let us present another gadget that lets attackers
A precondition for this gadget is that my-package does not            load arbitrary files into the engine. By polluting the root
have a main property defined in its package.json. If the              prototype’s properties 1 and exports, an attacker can execute
main property of the root prototype is polluted, at require           an arbitrary file from the disk when a relative path is loaded:
time, the value of this property is used for retrieving the code
to be executed, instead of the legitimate code of the module.         1   let rootProto = Object . prototype ;
                                                                      2   rootProto [" exports "] = {".":" ./ changelog . js " };
The attacker can thus indicate an arbitrary file on the disk to be    3   rootProto ["1"] = "/ path / to / npm / scripts /";
loaded in the engine. In particular, they can specify a file that     4   // trigger call
contains calls to command execution APIs. For example, the            5   require (" ./ target . js ");
popular growl package [6] contains a file called test.js that          While performing relative path resolution, the require
invokes the package with different test values. Considering          method checks if the target path points to an ES6 module.
that growl uses spawn internally, the attacker can successfully      During this process, the polluted property 1 is inadvertently
trigger such APIs call by setting the main property to point         read when applying a destructuring operator in the file
to the growl’s test file. Moreover, we identified a file shipped     /internal/modules/cjs/loader.js:
with the NPM command line tool that can be used for the
same nefarious purpose: npm/scripts/changelog.js.                     1   const { 1: name , 2: expansion = "" } =
                                                                              StringPrototypeMatch (...) || [];
   To the best of our knowledge, the gadget above is the first
evidence ever reported that shows that hijacking control flow           Thus, the attacker-controlled value is assigned as the tar-
through code reuse attacks is possible in Node.js. This moti-         get module’s name. Thereafter, the require method wrongly



5530      32nd USENIX Security Symposium                                                                          USENIX Association
concludes that the relative path ./target.js resolves to the         points against a target application. The query reports the po-
attacker-controlled location /path/to/npm/scripts/ and               tential injection sinks and a list of the functions that pass
that the path corresponds to an ES6 module. The exports              tainted data to these sinks. The list contains functions that
property is used to confuse the require method further by            are actual entry points of the application and functions that
providing the entry point for this non-existing module. Al-          take data from the environment (e.g., a database) and pass
though at the attacker-controlled target location, there is no       it to the injection sink. For the latter, we perform a call flow
package.json file present, the require method still con-             analysis to detect the application entry points. Second, we
cludes that this is a valid module path. We note that this           manually classify all reported cases as either false positives
gadget is not portable to legacy Node.js versions, e.g., version     or locally exploitable. Based on the project structure, we also
14.15.0. Thus, an important precondition for exploitation is         filter out cases in testing and client-side code. We discard
that the target system must use a recent Node.js version.            these cases because the code does not execute on the server
   We emphasize once again how dangerous the identified              and cannot lead to RCE. Third, we study the application’s
gadgets are. Many fairly-large applications would probably           threat model to detect conditions for exploiting the remain-
meet the preconditions for an RCE, once a prototype pollution        ing (locally exploitable) cases. This is a manual process that
is in place: (i) require a file using a relative path or a package   requires studying the documentation and code of the applica-
with no main entry, and/or (ii) have a dependency that uses a        tion. We match the entry points pertaining to the threat model
command execution API when loaded.                                   with the detected entry points leading to the injection sinks.
   To further study the impact of our gadgets, we estimate the       Fourth, we verify the matched entry points dynamically by
prevalence of their triggers in an experiment with the 10,000        deploying the application locally and generating a payload to
most dependent-upon NPM packages. We measure that 1,958              pollute the toString property. Whenever the payload fails,
have no main entry in their package.json (G4 , G5 , G10 ), 4,420     we rely on the debugger by examining code transformations
use relatives paths inside require statements (G6 , G8 , G11 ),      and validations along the path, and modifying the payload ac-
and 355 directly use the command injection API (G1 , G2 , G3 ).      cordingly. Finally, once the pollution is confirmed, we search
This indicates that many of our gadgets could be deployed            for the gadgets that may lead to RCE, as described in Section
against clients of these packages, once a pollution is in place.     6.2. If the gadget can be triggered after the execution of the in-
However, this is an upper bound on the actual prevalence of          jection sink, we change the payload to pollute gadget-specific
the gadgets because: (i) the attacker may have a hard time           properties.
invoking the trigger’s code through the public interface of the      Results. Table 2 presents the analysis results for 15 widely-
package, e.g., the code using the command injection API, (ii)        used Node.js applications. Total provides the number of de-
some gadgets may not work out of the box because of side-            tected prototype pollutions in the application’s codebase and
effects in the target package, i.e., polluting the property 1 may    the total time for their manual analysis. The analysis finds
have many unintended side-effects that can prevent the gadget        cases in 8 applications, which we investigate and classify
from working, (iii) an attacker may find it difficult to deploy      manually. False Positives contains the false positives due
a pollution before the gadget, e.g., for the require gadgets,        to over-approximate analysis; Client-Side and Testing Code
very often, the pollution needs to happen in the application’s       show the cases that do not execute on a server-side directly.
initialization phase. Nonetheless, considering the power of             We mark the remaining cases (column Suspicious) for fur-
these gadgets and their widely-available triggers, prototype         ther investigation. Suspicious cases are locally exploitable
pollution should be considered a critical security vulnerability     patterns, i.e., they can be exploited if an attacker controls
in the current Node.js landscape.                                    all function parameters. We verified the suspicious cases to
                                                                     find eight prototype pollutions (in NPM CLI, Parse Server
6.3    End-to-End Exploitation                                       and Rocket.Chat) that are exploitable according to the threat
                                                                     model of these applications. We also found the gadgets that
We evaluate our approach on popular Node.js applications             lead to RCE as explained below. As a sanity check, we run
from GitHub to validate its usefulness in a practical setting.       the original CodeQL baseline queries for NPM CLI and Parse
Setup. We use the GitHub API to search for JavaScript repos-         Server applications, however, they do not detect exploitable
itories and order them by the number of stars. We then select        prototype pollutions.
for further analysis the top 14 web applications running on             To estimate the manual effort, we track the time to verify
Node.js, as well as NPM CLI, the JavaScript package man-             the reported cases by one of the authors. A false positive takes
ager, because it is installed on every machine with Node.js          an average of 2.6 minutes because the analysis affects a small
as default. NPM CLI is also the largest analyzed applica-            code fragment. Similarly, non server-side code and testing
tion in our dataset. We clone the GitHub repository of each          code take on average 3.8 minutes and 1.2 minutes, respec-
application locally and perform the analysis against it.             tively. The analysis of suspicious cases takes more time and
Methodology. Following the workflow described in Section 4,          depends on the quality of the documentation and application’s
we first run our Priority query with Any Functions as entry          code. The time in Suspicious column includes the study of the



USENIX Association                                                                      32nd USENIX Security Symposium           5531
                                                                 Total       Exploitable     Suspicious   Testing Code   Client-Side Code   False Positives
     Application’s Repository       Stars    Lines of code
                                                             Cases Time     Cases Time      Cases Time    Cases Time     Cases     Time     Cases Time
           typicode/json-server     57,257      2,374          0              -               -             -              -                  -
              expressjs/express     54,883     14,450          0              -               -             -              -                  -
                 meteor/meteor      42,673     202,213        26      255     0               5     210     4      10      8         5        9       30
                    strapi/strapi   40,724     168,998         3        5     0               0             0              0                  3        5
               TryGhost/Ghost       38,944     125,696         4       55     0               1      50     0              2         3        1        2
                    hexojs/hexo     33,666     21,073          1       40     0               1      40     0              0                  0
        sahat/hackathon-starter     32,431      2,326          0              -               -             -              -                  -
                       koajs/koa    31,910      4,596          0              -               -             -              -                  -
      RocketChat/Rocket.Chat        31,059     242,949         5     1555     1     1500      3      50     0              1         5        0
              balderdashy/sails     22,085     24,445          0              -               -             -              -                  -
              emberjs/ember.js      22,034     113,749         6       60     0               2      40     1      10      0                  3       10
                  fastify/fastify   21,043     37,049          0              -               -             -              -                  -
 parse-community/parse-server       19,045     107,909         7     3225     5     3220      0             0              0                  2        5
              docsifyjs/docsify     18,946      7,603          0              -               -             -              -                  -
                         npm/cli    5,371      713,648        15      603     2      360      6     230     1       3      0                  6       10

Table 2: Evaluation results for the applications’ analysis. Cases shows the number of detected cases of a certain category; Time
shows the time in minutes to manually classify and validate these cases.


threat model and the matching of detected entry points. The                        triggers. This scenario puts any available configuration at risk
Exploitable column includes the time to set up an application,                     for attacks including the default configuration.
debugging and verification of prototype pollution, search for                      Detecting sinks. Our static analysis framework detects 7
gadgets, and combination of all attack ingredients. For exam-                      unique injection sinks. We marked 5 cases as suspicious by
ple, most time for the Parse Server exploit was spend to find                      manual validation. One of the suspicious cases is located in
a race condition that triggers the injection and attack sinks                      the sanitizer of database records as shown in Listing 3.
in the correct order. For NPM CLI, a time-consuming task
                                                                                    1      function expandResultOnKeyPath (obj , key , res ) {
was to find a way to store the payload to NPM Registry via a                        2        if ( key . indexOf ( ’. ’) < 0) {
malicious package and subsequently parse it during the pack-                        3          obj [ key ] = res [ key ];
age installation. The analysis and exploitation of Rocket.Chat                      4          return obj ;
                                                                                    5        }
required an LDAP server setup that provides a payload to the                        6        const path = key . split ( ’. ’);
injection sink, and the configuration of a custom synchroniza-                      7        const firstKey = path [0];
tion with the LDAP server. This process is not fully described                      8        const nextPath = path . slice (1) . join ( ’. ’);
in the official documentation and required a lot of manual                          9        obj [ firstKey ] = expandResultOnKeyPath (
                                                                                   10          obj [ firstKey ] || {} ,
testing of various options.                                                        11          nextPath , res [ firstKey ]) ;
   We now describe the RCE exploits for two applications                           12        return obj ;
and refer to the extended material for full details [43].                          13      }
                                                                                                Listing 3: Injection sink in Parse Server
6.3.1    Parse Server RCEs                                                            This function can be abused to pollute Object.prototype.
                                                                                   If the attacker controls the input data and passes the value
Parse Server is an open source Backend-as-a-Service (BaaS)                         "obj.__proto__.evalFunctions" to the parameter key
framework that provides REST APIs to object and file stor-                         and the object {obj:{__proto__:{evalFunctions: 1}}}
age, user authentication, push notifications, dashboard, and                       to result, then sanitization sets the new property
uses MongoDB or PostgreSQL as database. The Parse Server                           evalFunctions to Object’s prototype.
has pioneered BaaS systems in 2011 and has brought the                                Following our methodology, we perform a call flow anal-
serverless, low-touch deployment model to web and mobile                           ysis to detect entry points for the injection sink. A handler
backends.                                                                          of the GET request triggers data reading from the database
Threat model. The Parse Server can be deployed as a self-                          and then executes the vulnerable sanitizing code. Other de-
hosted solution. In this scenario, an attacker can send any                        tected injection sinks may be triggered via a PUT request by
requests to the server, but cannot modify any settings on the                      a payload delivered from a third-party webhook application.
server. Therefore, we expect that an application must be se-                          In order to detect potential RCE gadgets, we search in
cure in the default configuration. In the second scenario, we                      Parse Server codebase for universal gadgets and functions that
consider the Parse Server as a part of cloud infrastructure,                       evaluate the code at runtime, e.g., eval. The analysis reports
e.g., Back4App [1]. The attacker can create their own account                      a gadget using the require function, where an attacker can
and become the administrator of that account. This allows the                      directly control its argument through a polluted property. The
attacker to change some settings, for example, the webhook                         analysis also reports an attack sink in the official MongoDB



5532     32nd USENIX Security Symposium                                                                                           USENIX Association
BSON parser [2] that deserializes objects from a database, and       CLI installs the package, it parses the configuration
can evaluate JavaScript code stored in this object. However,         file npm-shrinkwrap.json from the package regardless
the code evaluation is possible only if we set the configuration     of the option --ignore-scripts. NPM CLI then in-
parameter evalFunctions, see Listing 4. This option is not           vokes diff-apply and copyPath functions from the
defined by default, but the attacker can pollute the prototype       parse-conflict-json package to parse the configuration
and bypass the if-statement condition in line 5.                     file. Two of the suspicious cases are located in these functions.
1   const evalFunctions =                                            Section 3 describes the injection sink in diff-apply and the
2     options [ ’ evalFunctions ’] == null                           attack sink for the RCE exploitation. We verified manually
3     ? false                                                        that the exploitation in both cases leads to RCE.
4     : options [ ’ evalFunctions ’];
5   if ( evalFunctions )                                             Exploitation. The NPM CLI invokes the spawn function
6     eval ( functionString );                                       to run the git commands for git-located package depen-
            Listing 4: Attack sink in Parse Server                   dencies. This happens after parsing the configuration files,
                                                                     and therefore, after the injection sink execution. The git
Exploitation. The attacker should first pollute the prototype        supports the command execution via the environment
via the injection sink and then trigger the attack sink in a         variable GIT_SSH_COMMAND. If this environment variable
second request. A challenge to exploit prototype pollution is        is set, git uses the specified command, instead of ssh, to
that the polluted property may break the application workflow.       connect to a remote system. Thereby, the attacker can
In this setting, the web request handler throws an exception         craft the package configuration file to initiate the call
whenever Object.prototype is polluted. Thereby, the at-              diffApply({}, {path:[’__proto__’,’env’], value:
tacker cannot successfully handle the requests in the required       {GIT_SSH_COMMAND: ’calc &’}, op: ADD}) and wait
order. However, we could bypass it using a race condition in         for the spawn invocation of the git command. This payload
the application workflow.                                            triggers arbitrary code execution, here launching a calculator.
   Four of the RCE exploits for Parse Server use the same gad-
get and attack sink in Listing 4 as follows: First, the attacker
sends requests to store payloads in the database. Second, it         7    Related Work
sends the GET request to trigger the attack sink but delays
its execution in the database until the next request. Third, the     This section discusses closely related work targeting object
exploit sends the PUT request to trigger the injection sinks.        injection vulnerabilities in general and prototype pollution in
Because the first request takes longer, a payload triggers the in-   particular. We also discuss related security analyses for the
jection sink while another payload reaches the attack sink and       Node.js ecosystem and client-side JavaScript security.
executes arbitrary code. The fifth exploit adapts the require        Prototype pollution vulnerabilities. The security commu-
gadget discussed in Section 6.2.3.                                   nity became aware of prototype pollution vulnerabilities in
                                                                     2018 in a white paper of Arteau [12] which uses dynamic anal-
6.3.2   NPM CLI RCEs                                                 ysis to showcase feasibility in a number of Node.js libraries as
                                                                     well as an end-to-end exploit in the Ghost CMS platform. The
NPM CLI [9] is the command line client that allows develop-
                                                                     risks and the impact of prototype pollutions has been mainly
ers to install and publish packages to NPM registries. During
                                                                     discussed in security practitioner forums [3], with the excep-
a package installation, NPM CLI puts modules in place so
                                                                     tion of a handful of recent research papers [25, 27, 31, 32, 51].
that Node.js can load them, manages dependency conflicts,
                                                                     Notably, the work of Li et al. [31, 32] proposes object de-
and may run the pre- and post-install scripts from the package.
                                                                     pendence graphs to statically find injection vulnerabilities in
Threat model. The public NPM registry can be untrusted,              Node.js libraries, including prototype pollution. Object de-
e.g., by storing malicious packages. Since it is a shell tool that   pendent graphs allow identifying prototype injection sinks
is run on a developer’s machine, RCE attacks have the highest        similar to our multi-taint analysis, though with higher preci-
impact. NPM CLI has the option --ignore-scripts to dis-              sion due to the analysis of branch conditions. By contrast,
able running scripts specified in package.json files. There-         our approach trades precision for scalability to analyze fully-
fore, the threat model considers the arbitrary script execution      fledged applications and libraries. In addition, our key focus
that breaks out of the --ignore-scripts flag as unintended           is on universal gadget identification and end-to-end exploita-
RCEs. We have the following constraint: the injection and            tion which no prior work has addressed systematically so far.
attack sinks should be available during the execution of the         Kim et al. [27] develop DAPP, a static analysis tool to detect
command that installs a malicious package.                           prototype injection sinks in Node.js libraries by means of
Detecting sinks. The static analysis reports 15 unique               pattern analysis. DAPP’s lightweight analysis results in low
injection sinks. We marked 8 cases as suspicious. Due                precision and recall, while focusing only on libraries. The
to the restricted threat model, we then focus on match-              recent work by Kang et al. [25] explores prototype pollution
ing the detected cases to the threat model. When NPM                 on the client-side to exploit a range of vulnerabilities (XSS,



USENIX Association                                                                     32nd USENIX Security Symposium           5533
cookie and URL manipulation) by using dynamic taint track-           cies. Steffens and Stock [48] present PMForce, a lightweight
ing. Compared with static analysis, dynamic analysis may             dynamic analysis augmented with forced execution for study-
miss some gadgets because of code coverage limitations, yet          ing post message handlers. Khodayari and Pellegrino [26]
it can be helpful to validate the reachability of our injection      propose JAW, a hybrid analysis tool based on code property
and attack sinks, which we currently do manually. Xiao et            graph, showing its usefulness by studying client-side CSRF
al. [51] study hidden property attacks in Node.js applications,      vulnerabilities. None of the work above studies the relation
a type of vulnerability which is related to prototype pollution.     between prototype pollution and injection vulnerabilities.
Object injection vulnerabilities. We classify POIVs in the
general context of object injection vulnerabilities (OIVs).          8   Conclusion
Prior work studies OIVs targeting insecure deserialization
by mean of static analysis in a variety of languages includ-         We presented the first principled study on the impact of pro-
ing Java [24, 36], PHP [15, 17, 21], .NET [35, 41], and An-          totype pollution vulnerabilities in Node.js. We propose a
droid [39]. The work of Dahse et al. [16, 17] develops static        semi-automated approach for detecting end-to-end exploits,
analysis to systematically detect OIV gadgets in PHP applica-        consisting of three phases: (i) static analysis for detecting
tions. Shcherbakov and Balliu [41] propose a static analysis         pollutions, (ii) hybrid analysis for detecting gadgets, and (iii)
for detecting object injection patterns for .NET application,        static analysis with human-in-the-loop for developing end-to-
including the framework and libraries, and implement a tool          end exploits. We apply our approach to large codebases to
called SerialDetector. Arguably, our work faces similar chal-        find eight exploitable RCE vulnerabilities directly enabled by
lenges with scaling the static analysis to real-world languages,     prototype pollution, and eleven universal gadgets [42] that
though in the more intricate context of JavaScript.                  are shipped with the Node.js runtime. Finally, we show that
Node.js ecosystem security. There is an increasing interest          universal gadgets introduce a new threat in the Node.js ecosys-
in studying the security of Node.js, both in academia and in         tem: hijacking the control flow of a program to (ab)use unused
industry. Most prior work has concentrated on so-called soft-        code available in the application’s dependencies.
ware supply chain security, i.e., studying security problems
that are prevalent in libraries: injections [22, 32, 45], hidden     Acknowledgments Thanks are due to anonymous review-
property abuse [51], prototype pollution [31, 32], malicious         ers for the helpful feedback on this work. This work was
packages [20, 52], running untrusted code [11, 49, 50], Re-          partially supported by the Swedish Foundation for Strategic
DoS [18,19,33,44], code debloating [28]. There is also initial       Research (SSF) under projects CHAINS and Trustfull, Digital
evidence that these problems in libraries affect websites in         Futures, Google, and Wallenberg AI, Autonomous Systems
production [31, 44]. We are the first to show the existence          and Software Program (WASP) funded by the Knut and Alice
of universal gadgets in Node.js and to study the impact of           Wallenberg Foundation.
prototype pollution, beyond denial-of-service attacks.
Static analysis for Node.js. Madsen et al. [34] propose aug-
menting call graphs with information about event propagation         References
to find bugs in Node.js programs. Staicu et al. [45] advo-
                                                                      [1] Back4App. https://www.back4app.com.
cate using intra-procedural data flow analysis to infer run-
time policies for injection sinks. Nielsen et al. [37] introduce      [2] BSON Parser for node and browser. https://github.
feedback-driven abstract interpretation for detecting injec-              com/mongodb/js-bson.
tion vulnerabilities in Node.js code. More recently, Nielsen
et al. [38] show how modular call graphs can be used to re-           [3] Client-Side Prototype Pollution and useful Script
duce false positives alerts in software composition analysis.             Gadgets.          https://github.com/BlackFan/
Li et al. [31, 32] propose using object dependency graphs                 client-side-prototype-pollution.
for finding prototype pollution, injection, and path traversal
vulnerabilities. We are the first to propose using static taint       [4] CodeQL. https://codeql.github.com.
analysis for detecting universal gadgets.
                                                                      [5] Exploiting prototype pollution – RCE in Kibana (CVE-
Client-side JavaScript security. Lekies et al. [30] study XSS             2019-7609). https://research.securitum.com/
vulnerabilities on the web using fine-grained dynamic taint               prototype-pollution-rce-kibana-cve-2019-7609.
analysis. Hedin et al. [23] present JSFlow, a more sophisti-
cated information flow analysis for detecting integrity and           [6] Growl - NPM. Growl support for Node.js. https://
confidentiality problems in web applications. Recently, Lekies            www.npmjs.com/package/growl.
et al. [29] discuss how script gadgets can be used to bypass
existing cross-site scripting mitigation. Roth et al. [40] further    [7] Node.js documentation. https://nodejs.org/api/
study the effect of script gadgets on content security poli-              child_process.html.



5534    32nd USENIX Security Symposium                                                                         USENIX Association
 [8] Node.js JavaScript runtime v16.13.1. https://github.        [22] François Gauthier, Behnaz Hassanshahi, and Alexander
     com/nodejs/node/tree/v16.13.1/lib.                               Jordan. AFFOGATO: runtime detection of injection
                                                                      attacks for node.js. In International Symposium on Soft-
 [9] NPM - a JavaScript package manager.           https://           ware Testing and Analysis (ISSTA), 2018.
     github.com/npm/cli.
                                                                 [23] Daniel Hedin, Arnar Birgisson, Luciano Bello, and An-
[10] Snyk. https://snyk.io.                                           drei Sabelfeld. JSFlow: tracking information flow in
[11] Mohammad M. Ahmadpanah, Daniel Hedin, Musard                     JavaScript and its APIs. In Symposium on Applied Com-
     Balliu, Lars Eric Olsson, and Andrei Sabelfeld. Sand-            puting (SAC), 2014.
     Trap: Securing JavaScript-driven trigger-action plat-       [24] Philipp Holzinger, Stefan Triller, Alexandre Bartel, and
     forms. In USENIX Security Symposium, 2021.                       Eric Bodden. An in-depth study of more than ten years
[12] Olivier Arteau. Prototype pollution attack in NodeJS             of java exploitation. In Conference on Computer and
     application. NorthSec, 2018.                                     Communications Security (CCS), pages 779–790, 2016.

[13] Pavel Avgustinov, Oege De Moor, Michael Peyton              [25] Zifeng Kang, Song Li, and Yinzhi Cao. Probe the proto:
     Jones, and Max Schäfer. Ql: Object-oriented queries              Measuring client-side prototype pollution vulnerabili-
     on relational data. In 30th European Conference on               ties of one million real-world websites. In Network and
     Object-Oriented Programming (ECOOP 2016). Schloss                Distributed System Security Symposium (NDSS 2022),
     Dagstuhl-Leibniz-Zentrum fuer Informatik, 2016.                  2022.

[14] Fraser Brown, Shravan Narayan, Riad S. Wahby, Daw-          [26] Soheil Khodayari and Giancarlo Pellegrino. JAW: study-
     son R. Engler, Ranjit Jhala, and Deian Stefan. Finding           ing client-side CSRF with hybrid property graphs and
     and preventing bugs in JavaScript bindings. In Sympo-            declarative traversals. In USENIX Security Symposium,
     sium on Security and Privacy (S&P), 2017.                        2021.

[15] Johannes Dahse and Thorsten Holz. Static detection          [27] Hee Yeon Kim, Ji Hoon Kim, Ho Kyun Oh, Beom Jin
     of second-order vulnerabilities in web applications. In          Lee, Si Woo Mun, Jeong Hoon Shin, and Kyounggon
     USENIX Security 14, pages 989–1003, 2014.                        Kim. Dapp: automatic detection and analysis of proto-
                                                                      type pollution vulnerability in Node.js modules. Inter-
[16] Johannes Dahse and Thorsten Holz. Static detection               national Journal of Information Security, pages 1–23,
     of second-order vulnerabilities in web applications. In          2021.
     USENIX Security Symposium, 2014.
                                                                 [28] Igibek Koishybayev and Alexandros Kapravelos. Minin-
[17] Johannes Dahse, Nikolai Krein, and Thorsten Holz.                ode: Reducing the attack surface of Node.js applications.
     Code reuse attacks in PHP: automated POP chain gener-            In 23rd International Symposium on Research in Attacks,
     ation. In Conference on Computer and Communications              Intrusions and Defenses (RAID), 2020.
     Security (CCS), pages 42–53, 2014.
                                                                 [29] Sebastian Lekies, Krzysztof Kotowicz, Samuel Groß,
[18] James C. Davis, Christy A. Coghlan, Francisco Servant,           Eduardo A. Vela Nava, and Martin Johns. Code-reuse
     and Dongyoon Lee. The impact of regular expression               attacks for the web: Breaking cross-site scripting miti-
     denial of service (ReDoS) in practice: an empirical study        gations via script gadgets. In Conference on Computer
     at the ecosystem scale. In Joint Meeting on Foundations          and Communications Security (CCS), pages 1709–1723,
     of Software Engineering (ESEC/FSE), 2018.                        2017.

[19] James C. Davis, Francisco Servant, and Dongyoon Lee.        [30] Sebastian Lekies, Ben Stock, and Martin Johns. 25
     Using selective memoization to defeat regular expres-            million flows later: large-scale detection of DOM-based
     sion denial of service (ReDoS). In Symposium on Secu-            XSS. In Conference on Computer and Communications
     rity and Privacy (S&P), 2021.                                    Security (CCS), pages 1193–1204, 2013.

[20] Ruian Duan, Omar Alrawi, Ranjita Pai Kasturi, Ryan El-      [31] Song Li, Mingqing Kang, Jianwei Hou, and Yinzhi Cao.
     der, Brendan Saltaformaggio, and Wenke Lee. Towards              Detecting Node.js prototype pollution vulnerabilities
     measuring supply chain attacks on package managers               via object lookup analysis. In Proceedings of the 29th
     for interpreted languages. In Network and Distributed            ACM Joint Meeting on European Software Engineer-
     System Security Symposium (NDSS), 2021.                          ing Conference and Symposium on the Foundations of
                                                                      Software Engineering, ESEC/FSE 2021, page 268–279,
[21] Stefan Esser. Utilizing Code Reuse/ROP in PHP Ap-
                                                                      New York, NY, USA, 2021. Association for Computing
     plication Exploits. Proceedings of the Black Hat USA,
                                                                      Machinery.
     2010.


USENIX Association                                                                32nd USENIX Security Symposium         5535
[32] Song Li, Mingqing Kang, Jianwei Hou, and Yinzhi Cao.        [43] Mikhail Shcherbakov, Musard Balliu, and Cristian-
     Mining Node.js vulnerabilities via object dependence             Alexandru Staicu. Silent Spring: Prototype Pollution
     graph and query. In USENIX Security Symposium, 2022.             Leads to Remote Code Execution in Node.js - Artifacts.
                                                                      https://github.com/yuske/silent-spring.
[33] Yinxi Liu, Mingxue Zhang, and Wei Meng. Revealer:
     Detecting and exploiting regular expression denial-of-      [44] Cristian-Alexandru Staicu and Michael Pradel. Freezing
     service vulnerabilities. In Symposium on Security and            the web: A study of redos vulnerabilities in JavaScript-
     Privacy (S&P), 2021.                                             based web servers. In USENIX Security Symposium,
                                                                      2018.
[34] Magnus Madsen, Frank Tip, and Ondrej Lhoták. Static
     analysis of event-driven node.js javascript applications.   [45] Cristian-Alexandru Staicu, Michael Pradel, and Ben-
     In Proceedings of the 2015 ACM SIGPLAN Interna-                  jamin Livshits. SYNODE: understanding and auto-
     tional Conference on Object-Oriented Programming,                matically preventing injection attacks on Node.js. In
     Systems, Languages, and Applications, OOPSLA 2015,               Network and Distributed System Security Symposium
     part of SPLASH 2015, Pittsburgh, PA, USA, October                (NDSS), 2018.
     25-30, 2015, 2015.
                                                                 [46] Cristian-Alexandru Staicu, Sazzadur Rahaman, Ágnes
[35] Alvaro Muñoz and Oleksandr Mirosh. Friday the 13th               Kiss, and Michael Backes. Bilingual problems: Study-
     json attacks. Proceedings of the Black Hat USA, 2017.            ing the security risks incurred by native extensions in
                                                                      scripting languages. arXiv preprint arXiv:2111.11169,
[36] Alvaro Muñoz and Christian Schneider. Serial killer:             2021.
     Silently pwning your java endpoints, 2018.
                                                                 [47] Cristian-Alexandru Staicu, Daniel Schoepe, Musard Bal-
[37] Benjamin Barslev Nielsen, Behnaz Hassanshahi, and                liu, Michael Pradel, and Andrei Sabelfeld. An empirical
     François Gauthier. Nodest: feedback-driven static anal-          study of information flows in real-world JavaScript. In
     ysis of node.js applications. In Joint Meeting on Eu-            14th ACM SIGSAC Workshop on Programming Lan-
     ropean Software Engineering Conference and Sympo-                guages and Analysis for Security, PLAS, 2019.
     sium on the Foundations of Software Engineering, (FSE),
     2019.                                                       [48] Marius Steffens and Ben Stock. PMForce: System-
                                                                      atically analyzing postmessage handlers at scale. In
[38] Benjamin Barslev Nielsen, Martin Toldam Torp, and                Conference on Computer and Communications Security
     Anders Møller. Modular call graph construction for se-           (CCS), 2020.
     curity scanning of node.js applications. In International
     Symposium on Software Testing and Analysis (ISSTA),         [49] Nikos Vasilakis, Ben Karel, Nick Roessler, Nathan
     2021.                                                            Dautenhahn, André DeHon, and Jonathan M. Smith.
                                                                      Breakapp: Automated, flexible application compartmen-
[39] Or Peles and Roee Hay. One class to rule them all: 0-day         talization. In Network and Distributed System Security
     deserialization vulnerabilities in android. In WOOT’15,          Symposium, (NDSS), 2018.
     2015.
                                                                 [50] Nikos Vasilakis, Cristian-Alexandru Staicu, Grigoris
[40] Sebastian Roth, Michael Backes, and Ben Stock. As-               Ntousakis, Konstantinos Kallas, Ben Karel, André De-
     sessing the impact of script gadgets on CSP at scale.            Hon, and Michael Pradel. Preventing dynamic library
     In Asia Conference on Computer and Communications                compromise on Node.js via RWX-based privilege reduc-
     Security, (ASIA CCS), 2020.                                      tion. In Conference on Computer and Communications
                                                                      Security (CCS), 2021.
[41] Mikhail Shcherbakov and Musard Balliu. SerialDe-
     tector: Principled and Practical Exploration of Object      [51] Feng Xiao, Jianwei Huang, Yichang Xiong, Guangliang
     Injection Vulnerabilities for the Web. In 28th Annual            Yang, Hong Hu, Guofei Gu, and Wenke Lee. Abusing
     Network and Distributed System Security Symposium,               hidden properties to attack the Node.js ecosystem. In
     NDSS 2021, virtually, February 21-25, 2021, 2021.                USENIX Security Symposium, 2021.
[42] Mikhail Shcherbakov, Musard Balliu, and Cristian-           [52] Markus Zimmermann, Cristian-Alexandru, Cam Tenny,
     Alexandru Staicu.     Server-Side Prototype Pol-                 and Michael Pradel. Small world with high risks: A
     lution Gadgets.     https://github.com/yuske/                    study of security threats in the npm ecosystem. In
     server-side-prototype-pollution.                                 USENIX Security Symposium, 2019.




5536   32nd USENIX Security Symposium                                                                   USENIX Association
Appendix

8.1     Evaluation Results
In Table 3, we present the results of the evaluation of ODGen, the original CodeQL queries (Baseline queries) and our custom
queries (Priority queries and General queries) against our benchmark of 100 vulnerable NPM packages.

                                                   Baseline queries             Priority queries              General queries
                                                                                                                                      ODGen
            Package@Version           LoC      Prototype      Prototype
                                                                          Exported           Any        Exported          Any
                                               Polluting      Polluting
                                                                          Functions        Functions    Functions       Functions
                                              Assignment      Function
                                              TP      FP     TP      FP   TP      FP      TP       FP   TP      FP     TP       FP   TP    FP
                        101@1.6.3    2,366    0/2      0     0/2      0   2/2      0      2/2       0   2/2      2     2/2       2   0/2    0
   arr-flatten-unflatten@1.1.4        104     0/2      0     0/2      0   1/1      0      1/1       0   2/2      0     2/2       0   0/2    0
            asciitable.js@1.0.2       173     0/1      0     1/1      1   1/1      0      1/1       1   1/1      0     1/1       1   1/1    0
            assign-deep@1.0.0          56     0/1      0     1/1      0   1/1      0      1/1       0   1/1      1     1/1       1   0/1    0
                  bmoor@0.8.11       3,718    4/6      2     1/6      0   4/4      0      4/4       0   6/6      0     6/6       0   3/6    0
               bodymen@1.0.0         17,993   1/1      3     0/1      0   1/1      2      1/1       6   1/1      8     1/1      10   0/1    0
              changeset@0.1.0        1,427    3/3      1     0/3      0   1/1      0      1/1       0   3/3      0     3/3       0   0/3    0
      class-transformer@0.1.1         735     0/2      0     0/2      0   2/2      0      2/2       0   2/2      0     2/2       0   0/2    0
            confucious@0.0.12        7,046    7/7      1     0/7      0   4/4      3      4/4       5   7/7      4     7/7       4   1/7    1
                   connie@0.1.0      13,433   0/3      0     1/3      1   1/1      0      1/1       1   3/3      0     3/3       4   0/3    0
      controlled-merge@1.0.0          171     0/3      0     2/3      0   2/2      1      2/2       1   3/3      1     3/3       1   3/3    0
             copy-props@2.0.4         348     1/1      1     0/1      0   0/1      0      0/1       0   0/1      0     1/1       1   0/1    0
                      deap@1.0.0      698     0/2      0     2/2      0   0/2      0      2/2       1   0/2      0     2/2       1   1/2    2
          deep-defaults@1.0.5        17,475   0/1      3     1/1      0   1/1      2      1/1       4   1/1      8     1/1       8   0/1    1
          deep-override@1.0.0          73     0/1      0     0/1      0   1/1      2      1/1       5   1/1      9     1/1       9   0/1    0
                 deep-set@1.0.0        41     0/1      0     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
                  deephas@1.0.5       351     0/1      0     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   0/1    0
                   deeply@3.0.0       238     0/1      0     0/1      0   0/1      0      0/1       0   0/1      0     0/1       0   0/1    0
                  deepref@1.1.1       136     0/1      0     0/1      0   0/1      0      1/1       0   0/1      0     1/1       0   0/1    0
                     deeps@1.4.5      231     1/1      1     1/1      0   1/1      0      1/1       0   1/1      2     1/1       2   1/1    0
          defaults-deep@0.2.4          89     0/1      0     0/1      0   0/1      0      1/1       0   1/1      0     1/1       0   0/1    0
              dot-object@2.1.2       5,500    2/4      5     0/4      0   4/4      2      4/4       6   4/4     10     4/4      20   0/4    0
                 dot-prop@2.0.0        34     1/1      1     1/1      0   1/1      0      1/1       0   1/1      1     1/1       1   0/1    0
               dot-notes@3.2.0        223     1/1      1     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
                      dotty@0.0.1     475     1/1      1     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
                        dset@1.0.0     18     1/1      1     1/1      1   1/1      1      1/1       1   1/1      1     1/1       1   1/1    0
           expand-hash@1.0.1           36     0/1      0     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   0/1    0
                   extend@3.0.1        63     0/1      0     1/1      0   1/1      1      1/1       1   1/1      1     1/1       1   1/1    0
                       field@1.0.1     76     4/4      0     0/4      0   2/2      0      2/2       0   4/4      0     4/4       0   1/4    0
         @firebase/util@0.3.2        4,725    0/4      0     4/4      0   4/4      0      4/4       0   4/4      0     4/4       0   0/4    0
              flattenizer@0.0.5       436     0/1      0     0/1      0   1/1      0      1/1       1   1/1      1     1/1       3   0/1    0
           gammautils@0.0.81         6,919    1/1      3     0/1      1   1/1      1      1/1       1   1/1      4     1/1       4   1/1    0
                       gedi@1.6.3    7,160    1/1      6     0/1      2   1/1      2      1/1       3   1/1      7     1/1       8   0/1    0
                getobject@0.1.0       126     1/1      1     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   0/1    0
                      hoek@5.0.0      764     0/1      0     0/1      2   1/1      3      1/1       4   1/1      5     1/1       5   0/1    0
                    immer@8.0.0      5,136    0/5      0     0/5      0   0/5      1      5/5       2   0/5      1     5/5       2   0/5    0
               ini-parser@0.0.2        32     1/1      0     0/1      0   1/1      0      1/1       0   1/1      0     1/1       0   1/1    0
                   js-data@3.0.8     14,056   0/1      3     1/1      5   1/1     11      1/1      14   1/1     17     1/1      38   0/1    0
                js-extend@0.0.1        53     0/1      0     1/1      0   0/1      0      1/1       0   0/1      0     1/1       0   1/1    0
                     js_ini@1.2.0     537     0/1      0     0/1      0   1/1      0      1/1       0   1/1      0     1/1       0   0/1    0
                  json-ptr@1.1.0     1,630    1/1      3     0/1      0   1/1      5      1/1       5   1/1      5     1/1       5   0/1    0
    json8-merge-patch@1.0.1           635     0/1      0     1/1      0   1/1      0      1/1       0   1/1      0     1/1       0   0/1    0
             just-extend@3.0.0         36     0/1      0     0/1      0   0/1      0      0/1       0   0/1      0     0/1       0   1/1    0
                      keyd@1.3.4      265     0/1      0     0/1      0   0/1      0      1/1       1   0/1      0     1/1       1   1/1    0
                   keyget@2.2.0       389     1/4      0     0/4      0   2/2      2      2/2       2   4/4      1     4/4       1   2/4    0
                libnested@1.5.0       210     1/1      1     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
         linux-cmdline@1.0.0           42     0/1      0     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
                 locutus@2.0.11      14,994   1/1      1     0/1      0   1/1      2      1/1       2   1/1      3     1/1       4   0/1    0
                lodash@4.17.11       17,302   1/1      3     0/1      0   1/1      1      1/1       3   1/1      7     1/1       7   1/1    0
   madlib-object-utils@0.1.6           81     1/1      1     0/1      0   1/1      0      1/1       0   1/1      1     1/1       1   1/1    0
                    merge@2.1.0       103     0/1      0     1/1      0   1/1      0      1/1       0   1/1      0     1/1       0   0/1    0
            merge-deep@3.0.0          483     0/3      0     0/3      0   0/2      0      0/2       1   3/3      0     3/3       0   2/3    0




USENIX Association                                                                                  32nd USENIX Security Symposium            5537
        merge-recursive@0.0.3         58      1/1       1     0/1     0      1/1      0      1/1      0        1/1       1    1/1       1       1/1      0
              mixin-deep@2.0.0        29      0/1       0     1/1     0      1/1      0      1/1      0        1/1       0    1/1       0       0/1      0
           mout@2.0.0-alpha.1        9,337    0/2       2     0/2     0      2/2      0      2/2      0        2/2       1    2/2       1       0/2      0
                     mpath@0.4.1     1,839    1/1       2     0/1     0      1/1      2      1/1      2        1/1       2    1/1       2       1/1      2
              nconf_toml@0.0.1       4,743    0/1       0     0/1     0      1/1      0      1/1      1        1/1       2    1/1       2       0/1      0
        nested-property@0.0.5         97      0/1       0     0/1     0      1/1      0      1/1      0        1/1       1    1/1       1       0/1      0
                     nestie@1.0.0     66      0/1       0     0/1     0      1/1      0      1/1      0        1/1       1    1/1       1       0/1      0
                 nis-utils@0.6.10   35,669    2/2       0     1/2     1      1/1      9      1/1      15       2/2      18    2/2      18       2/2      0
             node.extend@2.0.0        958     0/1       0     1/1     0      1/1      1      1/1      1        1/1       1    1/1       1       1/1      0
               node-forge@0.9.0     17,978    1/1       5     0/1     0      1/1      2      1/1      4        1/1       7    1/1       7       1/1      0
              nodee-utils@1.2.2     22,385    2/2       0     1/2     0      1/1      5      1/1      12       2/2      11    2/2      15       2/2      0
          object-collider@1.0.3       143     0/2       0     0/2     0      2/2      1      2/2      1        2/2       1    2/2       1       0/2      0
         object-path-set@1.0.0        185     2/2       0     0/2     0      1/1      1      1/1      1        2/2       0    2/2       0       2/2      0
                    objnest@5.0.0     971     0/1       0     0/1     0      1/1      0      1/1      0        1/1       3    1/1       3       0/1      0
                   objtools@3.0.0   20,693    0/5       5     2/5     0      4/5      14     5/5      16       4/5      24    5/5      24       0/5      0
              patchmerge@1.0.0        138     0/1       0     1/1     0      1/1      2      1/1      2        1/1       6    1/1       6       0/1      0
        paypal-adaptive@0.4.1         203     0/1       0     1/1     1      1/1      1      1/1      2        1/1       2    1/1       2       0/1      0
                      phpjs@1.3.2   48,116    1/1       4     0/1     0      1/1      3      1/1      7        1/1       8    1/1      18       0/1      0
                 predefine@0.1.2      488     0/1       0     0/1     0      1/1      1      1/1      1        1/1       1    1/1       1       0/1      0
         promisehelpers@0.0.5         132     1/1       1     0/1     0      1/1      0      1/1      0        1/1       1    1/1       1       1/1      0
       properties-reader@2.0.0       1,293    0/1       0     0/1     0      1/1      2      1/1      2        1/1       7    1/1       7       0/1      0
           property-expr@2.0.2        196     1/1       0     0/1     0      0/1      0      1/1      0        1/1       0    1/1       0       1/1      0
            prototyped.js@2.0.0      7,911    0/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       1/1      0
              putil-merge@3.0.0       68      0/2       0     0/2     0      2/2      0      2/2      0        2/2       2    2/2       2       0/2      0
                querymen@2.1.3      18,205    1/1       3     0/1     0      1/1      2      1/1      6        1/1       8    1/1      10       0/1      1
                   safe-flat@2.0.0    298     0/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       0/1      0
             safe-object2@1.0.3       104     0/1       0     0/1     0      1/1      0      1/1      1        1/1       0    1/1       1       0/1      0
                   safe-obj@1.0.0     242     0/1       0     0/1     0      1/1      1      1/1      1        1/1       2    1/1       2       0/1      0
             safetydance@2.0.1        570     0/1       0     0/1     0      0/1      0      1/1      0        0/1       0    1/1       1       1/1      0
           set-deep-prop@1.0.0        11      1/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       1/1      0
                 set-getter@0.1.0     179     0/1       0     0/1     0      0/1      0      0/1      0        1/1       1    1/1       1       0/1      0
                     set-in@2.0.0     172     1/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       1/1      0
        set-object-value@0.0.5        113     0/2       0     0/2     0      2/2      4      2/2      4        2/2       6    2/2       6       1/2      0
               set-or-get@1.2.10      115     1/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       1/1      0
                 set-value@3.0.0      123     2/2       1     1/2     0      1/1      0      1/1      0        2/2       1    2/2       1       2/2      0
                       shvl@2.0.1     18      0/1       0     0/1     0      1/1      0      1/1      3        1/1       1    1/1       4       0/1      0
            smart-extend@1.7.3       8,949    0/1       0     1/1     1      1/1      2      1/1      3        1/1       2    1/1       3       0/1      0
       @strikeentco/set@1.0.0         27      1/1       1     0/1     0      1/1      0      1/1      0        1/1       1    1/1       1       0/1      0
              supermixer@1.0.3       9,843    0/1       2     0/1     0      0/1      5      0/1      9        0/1       8    0/1      12       0/1      0
                   Templ8@0.7.0       785     0/1       0     0/1     0      0/1      0      0/1      0        0/1       0    0/1       0       0/1      0
                 tiny-conf@1.1.0      255     4/4       0     0/4     0      2/2      0      2/2      1        4/4       0    4/4       1       1/4      0
                    total.js@3.4.6  40,699    0/1       3     0/1     1      0/1      1      0/1      2        0/1       4    0/1       7       0/1      0
                undefsafe@2.0.2       544     0/1       0     0/1     0      1/1      0      1/1      0        1/1       0    1/1       0       0/1      0
                  upmerge@0.1.7       124     0/4       0     3/4     0      3/3      1      3/3      1        4/4       0    4/4       0       2/4      0
             utils-extend@1.0.8       239     0/1       0     1/1     0      1/1      0      1/1      0        1/1       2    1/1       2       0/1      0
               worksmith@1.0.0      91,294    0/1       4     0/1     0      0/1      7      1/1      13       0/1      19    1/1      33       0/1      1
                      y18n@3.2.1      129     3/3       0     0/3     0      1/1      0      1/1      1        3/3       0    3/3       0       2/3      0
             yargs-parser@6.0.0       677     6/6       2     0/6     0      2/2      4      2/2      5        6/6       3    6/6       3       0/6      0
                                     Total: 42.1 46.6        21.3    67.3    82.2    49.6    93.3    40.1     88.4     35.3    97     30.9     32.9     87.1
Table 3: Evaluation results of our benchmark analysis. The TP columns contain the number of detected cases / the total number of true positives for the package.
The FP columns contain the number of false positive cases for the package. The Total row summarizes the data and presents the recall metric (in %) in the TP
columns and the precision (in %) for the FP columns.




5538      32nd USENIX Security Symposium                                                                                             USENIX Association
