---
type: Article
title: "GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes"
resource: "https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:21:03+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen"
    title: "GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes"
    author: Eric Cornelissen, Mikhail Shcherbakov, Musard Balliu
also_at:
  - "https://www.usenix.org/system/files/usenixsecurity24-cornelissen.pdf"
  - "https://www.usenix.org/system/files/usenixsecurity24_slides-cornelissen.pdf"
authors:
  - Eric Cornelissen
  - Mikhail Shcherbakov
  - Musard Balliu
canonical_url: ""
cited_by:
  - "2024.md:139"
commit: ""
content_sha256: d3a7efec4b45951302b85b3db93063f3e6b18d49e63afb199ed4bc132c635dff
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 8ca30903fa9fb02e7e3400408d329845fbee3ecbe0ff9500322e0887b2df2cb9
retrieved_from: "https://www.usenix.org/system/files/usenixsecurity24-cornelissen.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:21:03+00:00"
slug: usenix-org-ghunter-universal-prototype-pollution-gadgets-javascript-runtimes
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes

**GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes** - Eric Cornelissen, Mikhail Shcherbakov, Musard Balliu, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity24-cornelissen.pdf>
- Also published at: <https://www.usenix.org/system/files/usenixsecurity24_slides-cornelissen.pdf>
- Preserved from: https://www.usenix.org/system/files/usenixsecurity24-cornelissen.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# GHunter: Universal Prototype Pollution Gadgets in JavaScript Runtimes

--- page 1 ---

GHUNTER: Universal Prototype Pollution
 
Gadgets in JavaScript RuntimesEric Cornelissen, Mikhail Shcherbakov, and Musard Balliu, 
KTH Royal Institute of Technologyhttps://www.usenix.org/conference/usenixsecurity24/presentation/cornelissen

--- page 2 ---

This paper is included in the Proceedings of the 
33rd USENIX Security Symposium.August 14–16, 2024 • Philadelphia, PA, USA978-1-939133-44-1Open access to the Proceedings of the 
33rd USENIX Security Symposium
 
is sponsored by USENIX.

--- page 3 ---

GH
UNTER
: Universal Prototype Pollution Gadgets in JavaScript Runtimes
Eric Cornelissen
KTH Royal Institute of Technology
Mikhail Shcherbakov
KTH Royal Institute of Technology
Musard Balliu
KTH Royal Institute of Technology
AbstractPrototype pollution is a recent vulnerability that affectsJavaScript code, leading to high impact attacks such as arbi-trary code execution and privilege escalation. The vulnera-bility is rooted in JavaScript's prototype-based inheritance,enabling attackers to inject arbitrary properties into an ob-ject's prototype at runtime. The impact of prototype pollu-tion depends on the existence of otherwise benign pieces ofcode (gadgets), which inadvertently read from these attacker-controlled properties to execute security-sensitive operations.While prior works primarily study gadgets in third-party li-braries and client-side applications, gadgets in JavaScript run-time environments are arguably more impactful as they affectany application that executes on these runtimes.In this paper we design, implement, and evaluate a pipeline,GHUNTER, to systematically detect gadgets in V8-basedJavaScript runtimes with prime focus on Node.js and Deno.GHUNTERsupports a lightweight dynamic taint analysis toautomatically identify gadget candidates which we validatemanually to derive proof-of-concept exploits. We implementGHUNTERby modifying the V8 engine and the targeted run-times along with features for facilitating manual validation.Driven by the comprehensive test suites of Node.js and Deno,we useGHUNTERin a systematic study of gadgets in theseruntimes. We identied a total of 56 new gadgets in Node.jsand 67 gadgets in Deno, pertaining to vulnerabilities such asarbitrary code execution (19), privilege escalation (31), pathtraversal (13), and more. Moreover, we systematize, for therst time, existing mitigations for prototype pollution andgadgets in terms of development guidelines. We collect a listof vulnerable applications and revisit the xes through thelens of our guidelines. Through this exercise, we also identi-ed one high-severity CVE leading to remote code execution,which was due to incorrectly xing a gadget.
1 IntroductionJavaScript's widespread adoption as a go-to programminglanguage for full-stack development speaks to its popularity,but it also exposes the applications to heightened securityrisks. Researchers and practitioners are well-aware of theseissues, as witnessed by a multitude of prior studies [17,46,48,51]. JavaScript runtime environments, such as Node.js [4]and Deno [3], which lie at the heart of server-side JavaScriptapplications, become appealing targets for attackers [9,11,17,29, 43, 45, 49]. Vulnerabilities in the runtime environmentscan compromise the security of applications running atop.In this paper, we set out to study the security implicationsof a recent vulnerability, prototype pollution, in JavaScriptruntime environments.Prototype pollution is a vulnerability affecting theJavaScript language [10]. JavaScript's prototype-based in-heritance allows an object to inherit properties from its ances-tors via the prototype chain. When accessing a property notpresent on the object, the prototype chain will be queried forthat property instead. Unless explicitly changed, this chainconnects all objects to a common root prototype. Pollutioncan occur when an attacker-controlled value is used to nav-igate an object's structure. Since each object has a runtimeaccessible reference to its prototype, the attacker may be ableto pick that reference and add a new property. By doing this,the attacker can cause a change in behavior in another part ofthe application.The security implications of prototype pollution depend onthe presence of otherwise benign pieces of code (gadgets) thatinadvertently read attacker-controlled properties from the rootprototype to execute sensitive operations, e.g., arbitrary code.Gadgets in JavaScript runtime environments are particularlydangerous because they are shared by all applications, thusincreasing the attack surface.The vast majority of prior works focus on the detection ofprototype pollution by static analysis [26,29,30,43,49], whilethe existence of gadgets remains largely unexplored [24,31,43,44]. This work is inspired by the recent pioneering of workof Shcherbakov et al. [43], which uses static taint analysis forthree Node.js APIs to nd (combinations of) three gadgets,dubbeduniversal gadgets, leading to arbitrary code execution.Our thesis is that dynamic analysis should be preferable for

--- page 4 ---

USENIX Association
33rd USENIX Security Symposium 3693

--- page 5 ---

identifying universal gadgets for these reasons: (a) the sourcesof the analysis pertain to accesses of properties from theprototype, which is hard to identify statically; (b) the highly-dynamic nature of JavaScript poses signicant challengesfor static analysis, resulting in low precision and recall, andhigh manual effort [43]; (c) realistic gadgets should trigger incommon use cases of API usages, which is best captured bythe comprehensive test suite of runtime environments.To address these challenges, we design, implement, andevaluate a semi-automated pipeline,GHUNTER, to compre-hensively and systematically detect universal gadgets in V8-based JavaScript runtimes, Node.js and Deno. Deno is a par-ticularly interesting target because it is proposed as a security-rst runtime to counter the shortcomings of Node.js. Speci-cally,GHUNTERcustomizes Deno, Node.js, and the V8 en-gine to implement a lightweight dynamic taint analysis forautomatically identifying gadget candidates, which we val-idate manually to derive proof-of-concept exploits. Drivenby the test suite of a runtime environment,GHUNTERde-tects property accesses from an object's prototype, it injects ataint value, and monitors the execution to identify the effectsof the taint value on security-sensitive sinks and unexpectedterminations. Moreover,GHUNTERsupports processing andrepresentation of gadget candidates in SARIF format [36] forvisualization to facilitate the manual analysis.We useGHUNTERin a comprehensive study of Node.jsand Deno to identify universal gadgets pertaining to a rangeof vulnerabilities, including arbitrary code execution, server-side request forgery, privilege escalation, cryptographic down-grade, and more. After processing,GHUNTERautomaticallyidenties 301 and 418 gadget candidates in Node.js and Deno,respectively. We manually veried the gadget candidates tond 56 universal gadgets in Node.js and 67 universal gadgetsin Deno for a total of 28 person-hours. We further compareGHUNTERwith Silent Spring [43], showing that it providesincreased precision and recall, while reporting less gadgetcandidates for manual analysis. To support further researchon the topic, we make available publicly bothGHUNTER[14]and the gadgets [20].We have responsibly disclosed our ndings to the Node.jsand Deno development teams. Both acknowledged our reportbut neither considers them within their current thread model.Node.js suggested a public discussion with their developers'community on the dangers of gadgets.In light of these results, we systematize, for the rst time,existing mitigations for prototype pollution and gadgets interms of development guidelines. We then collect a list ofapplications with end-to-end exploits pertaining to prototypepollution, and revisit the xes through the lens of our guide-lines. Through this exercise, we also identify existing issues,including one high-severity CVE-2023-31414 leading to re-mote code execution, which was due to incorrectly xing agadget.
Our contributions can be summarized as follows:
1
const
users = { };
2
router.post("/:uid", (req , res) => {
3
users[req.uid][req.key] = req.value;
4
exec("echo 'A value was stored at' $(date)");
5
res.status (200).send();
6
});
7
function
exec(cmd , opts) {
8
opts = opts || {};
9
const
shell = opts.shell || "/bin/sh";
10
op_spawn(`${shell} -c '${sanitize(cmd)}'`);
11
}
Listing 1: Example of prototype pollution and gadget.
•We design and implement a semi-automated pipeline,GHUNTER, to systematically detect universal gadgets inJavaScript runtimes (Section 4).
•We conduct a comprehensive analysis of Node.js and Denoto nd 123 universal gadgets subject to a range of vulnera-bilities (Section 5).
•We systematize existing mitigations against prototype pollu-tion and gadgets, and outline directions for future work, in-cluding an in-depth case study leading to RCE (Section 6).2 Technical BackgroundIn this section, we overview the life cycle of exploits per-taining to prototype pollution vulnerabilities, and discuss theJavaScript runtime of interest and the threat model.
2.1 Prototype Pollution and GadgetsPrototype pollution is a vulnerability that occurs in prototype-based languages like JavaScript [10]. An attacker manipulatesa program's prototype-based inheritance, leading to runtimemodication of objects and potentially causing otherwise be-nign code sequences, called gadgets, to execute dangerousoperations. End-to-end exploitation of gadgets based in pro-totype pollution requires two steps. The prototype must bepolluted rst, for example when processing untrusted userdata incorrectly, and then the gadget must be triggered.To illustrate the vulnerability, Listing 1 shows an articialserver application which provides an in-memory key-valuestore for its users, logging every request to standard output. Itis vulnerable to prototype pollution and uses functionexecas a gadget.exec(line 7-11) is an otherwise benign runtime-provided function to execute a command. It accepts the com-mand to execute as a string and an optional objectoptstocongure the shell in which to execute the command.A request atvuln.com/uid?key=valuecauses the serverto invoke the handler on line 2-6. It extracts the user ID andthe key-value pair from the URL and stores it in memory (line3). It then logs the time of the request (line 4) and respondswith a
200
status code (line 5).

--- page 6 ---

3694 33rd USENIX Security Symposium
USENIX Association

--- page 7 ---

An attacker can use this handler to per-form prototype pollution. The malicious requestvuln.com/__proto__?shell=node -e '...'willadd the propertyshellwith the value"node -e '...';"to the root object prototype on line 3. This happensbecause the request instantiates the statement on line 3 asusers["__proto__"]["shell"] = "node -e '...';".In particular,users["__proto__"]gives a referencetoObject.prototypewhich is then extended with theproperty
shell
.The attacker can capitalize on the pollution of theshellproperty to turn the benign call toexecinto a remotecode execution gadget. In particular, because the applica-tion provides no options on line 4, line 8 assigns tooptsanempty JavaScript object. When evaluating the expressionopts.shellon line 9, theshellproperty, missing fromopts, will be looked up in the prototype chain where it ex-ists because of the pollution. Thus,opts.shellevaluatesto"node -e='...';"and is used instead of the default"/bin/sh"
to evaluate arbitrary JavaScript code.
2.2 JavaScript Runtimes: Node.js and DenoIn this work, we study universal gadgets in JavaScript runtimeenvironments. Two such runtime environments are Node.jsand Deno. Both are open source software projects built ontop of the V8 JavaScript engine from Chromium. Node.js isa popular JavaScript runtime [4] written in C++, commonlyused for server application development. Deno was created inresponse to Node.js with a focus on security [3]. It is writtenin Rust and uses TypeScript. The native (C++/Rust) parts ofthese runtimes are what provides access to system resourcesand common functionality such as buffers and cryptographylibraries. In this work we focus on these runtimes because oftheir popularity and shared JavaScript engine.Deno's focus on security is interesting for our work be-cause it adds guardrails for both pollution and gadgets. On thepollution side, Deno removed the__proto__property, ren-dering the attack described on Listing 1 infeasible. However,prototype pollution is still possible through, e.g., object mergefunctions, a common source of prototype pollution. On thegadget side, Deno has a permission system to reduce accessto system resources and by extension the impact of gadgets.However, we observe that the presence of a gadget impliessome access to the corresponding resource must have beengranted to the application, thus allowing exploits nonetheless.2.3 Threat ModelOur threat model focuses on server-side JavaScript/TypeScriptapplications running on either Node.js or Deno. We assumethe application is vulnerable to prototype pollution, eitherdirectly or through third-party code. Our aim is to nd ex-ploitable universal gadgets present in the JavaScript runtimefor the purpose of one of (directly or indirectly):
•Arbitrary Code/Command Execution (ACE). Gadgets thatallow an attacker to execute arbitrary JavaScript code orstart an arbitrary command.
•Server Side Request Forgery (SSRF). Gadgets that allowan attacker to make arbitrary network requests.
• Privilege Escalation. Gadgets that allow an attacker to per-
form an action their normal privileges do not allow.
•Cryptographic Downgrade. Gadgets that downgrade thecryptography used by the application to be weaker.
•Path Traversal. Gadgets that allow the attacker to manipu-late the path of le system operations.
•Unauthorized Modications. Gadgets that allow the at-tacker to trigger modications that should not happen as aresult of normal operation.
•Log Pollution. Gadgets that change or control the contentsof program logs.
•Denial of Service (DoS). Gadgets that deny access to theapplication.We posit that many applications use some of these APIs inpractice because of the importance of the functionality theyprovide. Furthermore, we assume that the runtime's own testsuite contains a representative sample of ways to use the APIs.As a direct consequence, the presence of a gadget in a runtimeimplies vulnerabilities in real-world applications.
3 OverviewAt a high level we develop a semi-automated dynamic anal-ysis pipeline,GHUNTER, for nding gadgets in runtime en-vironments, as depicted in Figure 1. To achieve this goal,GHUNTERoperates in three automated steps and one manualstep. Driven by the runtime's test suite, the rst step identi-es candidate properties for prototype pollution by detectingundened property accesses. In the second and third step,GHUNTERuses these candidate properties to simulate pollu-tion and detect reachability of dangerous sinks and unexpectedtermination, respectively. These steps also rely on the run-time's test suite and generate output for gadget identication.The nal step consists in manually verifying the results of thesecond step, after preprocessing, using visualization of SARIFles in IDEs, and generating proof-of-concept exploits.Listing 2 shows a universal gadget in Deno, which we willuse to illustrate the workow ofGHUNTERalong with the dif-ferent challenges we have to tackle. Consider an applicationthat uses the runtime APIfetch, dened in Listing 2, to fetchuser details from another service, for a given trusted user iden-tieruid. The application will eventually execute the com-mandfetch("https://192.168.3.14/users/"+uid)tosafely retrieve user information. Given the assumption thatthe application is vulnerable to prototype pollution, our goalis to nd out how we can use prototype pollution to turn thisseemingly benign request into a malicious gadget.

--- page 8 ---

USENIX Association
33rd USENIX Security Symposium 3695

--- page 9 ---

Figure 1: Architecture and workow of GH
UNTER
.Step 1: Collecting source propertiesA key requirement isto nd properties that inuence the behavior of a runtime API.These properties must not be dened so that they are lookedup in the prototype chain and a polluted value is used instead.Hence,GHUNTERneeds to determine which undened prop-erty accesses happen as a result of normal usage of a targetruntime API. This is achieved by observing the runtime be-havior of code and taking note of undened property accesses.Moreover,GHUNTERuses the runtime environment's testsuite as a representative sample of normal usage of the API.For thefetchAPI in Listing 2,GHUNTERruns Deno'stest suite to collect a list of undened properties that includesmethod(line 3) andsignal(line 9). This leads us to our rstchallenge of automatically identifying undened propertyaccesses driven by the test suite of runtime APIs, which wediscuss in Section 4.1.Step 2: Identifying source-to-sink owsGHUNTERuses thelist of undened property accesses from the previous step assources for further analysis. To determine if a property is usedfor a purpose that is exploitable,GHUNTERimplements alightweight taint analysis that identies the reachability of val-ues of polluted properties into dangerous sinks. Driven by thetest suite, it pollutes the undened properties with taint valuesand checks whether these values affect the native (C++/Rust)code of the runtime environment, which conservatively repre-sents security-relevant sinks.The function call toop_fetchin Listing 2 (line 13) exe-cutes Deno's native networking implementation forfetch. Todetermine if a polluted value can reachop_fetch,GHUNTERsimulates prototype pollution and detects the polluted prop-erty value in the call toop_fetch. For the propertymethod,GHUNTERpollutes the property with a taint value and runsthe corresponding test case, while intercepting every call toop_fetchand checking all arguments for the presence of thetaint value used for pollution. Indeed, given the list of prop-erties forfetch,GHUNTERnds that the propertymethodreaches the sinkop_fetchon line 13. This leads us to oursecond challenge of automatically identifying ows from un-dened properties to sinks, which we discuss in Section 4.2.Step 3: Unexpected terminationIf normal usage of a run-1
class
Request {
2
constructor(input , init = {}) {
3
this
.method = init.method || "GET";
4
// ...
5
}
6
}
7
function
fetch(input , init = {}) {
8
const
request =
new
Request(input , init);
9
const
promise = mainFetch(request ,
false
,
request.signal);
10
//...
11
}
12
async function
mainFetch(req , recursive ,
terminator) {
13
const
res = op_fetch(req.method , /*...*/);
14
terminator[abortSignal.add]();
15
//...
16
}
Listing 2: Simplied Deno fetch implementation.time API (as represented by the test suite) does not result in acrash but the pollution of an undened property does causethe API to crash, it implies that an attacker can use the APIto cause Denial of Service (DoS) attacks. Similarly to Step2,GHUNTERleverages the runtime's test suite to detect DoSattacks pertaining to prototype pollution. When polluting thepropertysignalon line 9,GHUNTERcauses thefetchAPIto crash due to a type error on line 14. This leads us to ourthird challenge of automatically identifying fatal crashes thatcause DoS attacks on applications that use the APIs underpollution, which we discuss in Section 4.3.Step 4: Manual validationThe previous automated stepsyield a list of potential sinks and unexpected program crashespertaining to pollution of undened properties. These resultsdo not necessarily imply that a runtime API is exploitable,but require manual validation. To aid the security analyst,GHUNTERsupports processing (e.g., removal of duplicatesfrom different test cases) and representation of results inSARIF format for visualization within an IDE.In our example, the SARIF le contains two results,called gadget candidates, for thefetchAPI: One forpropertymethodreaching the sinkop_fetchand onefor propertysignalresulting in a program crash. Themanual analysis ofmethodreveals that an attacker canoverride the default HTTP method fromGETat wish,revealing a true gadget. For instance, they can pollutemethodwith valueDELETE, thus causing the commandfetch("https://192.168.3.14/users/"+uid)to deleteuser records (in Section 5 we extend this attack to full ServerSide Request Forgery). The analysis of the program crash duetosignalreveals an attacker can perform a DoS attack, thusdenying users of access to data. In Section 4.4 we discuss thisnal challenge of effectively validating gadget candidates.

--- page 10 ---

3696 33rd USENIX Security Symposium
USENIX Association

--- page 11 ---

4 System Design and ImplementationWe designGHUNTERto overcome the challenges outlinedin Section 3. In line with the architecture and workow ofFigure 1, this section describes and motivates our design andexplains how it supports comprehensive analysis of JavaScriptruntime environments for nding gadgets. First, we discusssource properties and detail our approach to capturing themexhaustively. Second, we show how to achieve comprehen-sive coverage for sinks into native runtime code and how toidentify source-to-sink ows by our lightweight taint analysis.Third, we discuss unexpected termination and how to detectfatal terminations leading to DoS attacks. Finally, we discussthe process of preprocessing and manually validating results,as well as the current limitations of GH
UNTER
.Along with the discussion of the design we also describethe implementation ofGHUNTER, which we implementagainst Node.jsv21.0.0and Denov1.37.2. These are themost recent versions of the respective runtimes that share acommon V8 engine version, namely
v11.8.172.17
.
4.1 Source PropertiesIn this work we consider undened property accesses assources. At a high level, an undened property access happenswhen code tries to read a property that is not one of the ob-ject's own properties. There are many ways in which this canhappen in JavaScript, includingobj.propas seen on line 3 ofListing 2, computed property names such asobj[str_var],array-indexed properties such asobj[1], for-in loops, andvarious syntactic sugar forms such as destructuring assign-ment. These features pose signicant challenges for staticanalysis approaches [43], leading to both false positives (dueto conservatively computing undened properties) and falsenegatives (due to computed property names).To ensure we comprehensively capture all undened prop-erty accesses we modify the V8 runtime to trap on propertyaccesses that are looked up but not present in the root object'sprototype object. This conservatively covers all property ac-cesses that may be inuenced by prototype pollution, exclud-ing pollutions with other side effects (i.e. existing prototypeproperties) and circumstantial pollutions of specic types.Because gadgets are pre-existing runtime API functioncalls in application code, we are interested in undened prop-erty accesses that happen as a result of normal API usage.Thus, we leverage the runtime's test suite as a proxy of realAPI usage and capture all undened property access that oc-cur during test execution. We store the observed propertynames on a per-test basis for use in the next steps.For our example of Section 3 this step yields 95 propertiesfor
fetch
from the
fetch_test.ts
test suite in Deno.ImplementationTo intercept all property accesses, wemodify the code ofRuntime::GetObjectPropertyandLoadIC::Loadmethods, which look up the property namein an object's prototype chain to read a property value. If theproperty is not found in the chain we log the access attempt.However, V8 implements optimizations to avoid slow callsto these methods when the property name can be easilydetermined, as inobj.prop. Thus, we deoptimize the in-line caches [12] and remove the bytecode handlers in themethodsAccessorAssembler::LoadIC_NoFeedbackfornamed properties andAccessorAssembler::KeyedLoadICfor array-indexed properties. This allows us to trap on everyproperty access, albeit with some performance degradation.We also implement a separate le logger to dump the re-sults of our tests and extend the globals object with thelogfunction. This enables our modications in the test suite touse the same logs for dumping call stacks as described laterin this section. The changes to V8 are limited to 8 les andmodify 233 lines of code in total.
4.1.1 Simulating PollutionGiven the names of undened properties that are accessed fora test, we want to simulate pollution of these properties toobserve how it affects the behavior of the runtime. To this endwe extend the test runners to automatically modify test lesby injecting a code snippet that simulates prototype pollution.To maximize effectiveness, the polluting snippet is injectedat the top of the test le. This ensures the entire test executionis affected by the pollution. In comparison to injection usingpreloaded modules (e.g. through--requireor--moduleinNode.js) this avoids affecting irrelevant accesses that happenbefore the test is started.We use this prototype pollution simulation in the next twosteps. In particular, ifNunique undened property accesseswere detected for a test, we run for both the second and thirdstage ofGHUNTERwithNdifferent instances of that test,each with a different property polluted.For our example this means thefetch_test.tstest lein Deno is dynamically updated on the y with a snippet thatpollutes one of the 95 detected properties at a time.ImplementationWe use two types for the injected val-ues: strings and objects. To assign the property we useObject.definePropertyto add gettable (and settable)value. This allows us to output a stack trace for all accessesto that property. Additionally, we utilize this getter to returna unique identier (incremental number) for every access sothat we can match sources and sinks by the tainted value. List-ing 9 shows the injected snippet for string values, while thesnippet for object values is similar [14].One of the values we use is a hexadecimal string so that itcan be converted into a number, if needed. To support codethat expectsObjectas the type for polluted values, we injectobjects built based on JavaScriptProxy. These tainted valuesemulate the reading of arbitrary properties viaProxyHandler,access to an iterator to support for-of loop against this object,

--- page 12 ---

USENIX Association
33rd USENIX Security Symposium 3697

--- page 13 ---

and conversion to primitive types. Each of these access meth-ods also produces a tainted value to propagate the taint mark.4.2 Source-to-Sink Flows
We consider function calls where JavaScript executions owinto the runtime's native code assinks. To be able to exhaus-tively cover such sinks we study the ECMAScript standard [7]to determine function calls that ow into V8 as well as theruntime's development documentation to understand wheresuch ows occur for the runtime's native modules.For V8, we nd that functions such asevalandnew Function()are the sinks that create a function at run-time from their string arguments. In particular, both functionscreate and subsequently execute JavaScript code. Thus, if apolluted value is used as (part of the) input to these functions,an attacker can potentially execute arbitrary code.For Node.js, based on its contributor documentation [1]and source code, we identied internal APIs that interoper-ate with the C++ implementation from JavaScript:linkedbindingsandinternal bindings. After conducting tests, weconrmed thatlinked bindingsare intended for develop-ers to extend Node.js with additional C++ bindings, andthis method is not used for Node.js runtime APIs. Conse-quently, we determined thatinternal bindingscomprehen-sively cover all data ows from JavaScript to the C++ partof Node.js and are implemented in a single JavaScript le:lib/internal/bootstrap/realm.js
.For Deno, similar to Node.js, we identifybindingsas theonly bridge between JavaScript and Rust. This is based onthe contributor documentation for#[op]and#[op2]Rustattributes used throughout the Deno code base. As a resultwe identify a single template le written in JavaScript in thedeno_corecodebase that comprehensively covers all owsfrom JavaScript to Rust:
core/runtime/bindings.js
.When the sink receives a tainted value as one of its argu-ments, it logs information about the sink being reached. Thisincludes the sink name, call stack, tainted value with an iden-tier for source matching, and the access path if the taintedvalue is detected in a nested property of the argument.
For the running example of Section 3 this step yields onlyone result in Deno, namely that of pollution of themethod
property into the
op_fetch
binding.ImplementationTo capture ows involved in cre-ating functions at runtime, we modied the methodCompiler::GetFunctionFromEval(). This method gener-ates a function from a string passed into its rst argument. Pub-lic APIs such asevalandnew Function()use this method.We test the value of the rst argument, and if it contains ourtainted mark as a substring, we log the argument's value alongwith a record that this sink was triggered.To capture the ows via binding code we implement awrapping layer that we apply to all bindings for both runtimes.This wrapper recursively replaces all functions on a JavaScriptobject with a new function that inspects the arguments fortainted values, calls the original function, and returns its result.If a tainted value is detected we log the sink name, the argu-ment index, the current stack trace, and (if applicable) the pathto the tainted value for objects (e.g.xif the value of propertyo.xwas tainted). This wrapper consists of approximately 380lines of JavaScript code and is used in bothrealm.jsandbindings.js
for Node.js and Deno respectively.
4.3 Unexpected TerminationBesides dangerous sinks we are also interested in pollutionsthat result in unexpected or non-termination of the program,indicating potential DoS attack. We focus on fatal crashesthat JavaScript code cannot catch and thus terminates the ap-plication immediately. Because crashes may happen with notainted value reaching a sink, we perform this evaluation sepa-rately.GHUNTERcan also detect non-fatal crashes (catchablein JavaScript), which we do not include in our results.To comprehensively cover unexpected termination as aresult of pollution, we monitor all test executions and look forprocesses that exit with a non-zero exit code. If a non-zeroexit code is detected we evaluate the stdout and stderr of theprocess to lter out expected failures such as test failures inorder to report only unexpected errors such as segfaults/panics,Out Of Memory (OOM), and timeouts.To avoid reporting crashes that may happen as a resultof our runtime modications, we perform this analysis onthe original runtimes. This works because this stage reliesexclusively on externally available information, namely thepreviously-obtained list of undened property accesses.
For the running example of Section 3 this step yields onlyone result in Deno, namely that of pollution of thesignal
property leading to an unexpected
TypeError
.ImplementationTo perform this part of the analysis, were-use the test runner that modies test les with prototypepollution and instruct it to use the unmodied version ofthe runtime. We extend the test runner to examine the exitcode and output (stdoutandstderr) for each test it runs.In particular, if the exit code is nonzero, it will check if theoutput matches an expected error (e.g. a test failed) and if itdoes not, log the polluted property name and process output.
4.4 Manual ValidationTo effectively validate and create proof-of-concept exploitsfrom the results of Section 4.2 and Section 4.3, we producea SARIF le with all necessary information for manual vali-dation. The SARIF le format, in combination with a SARIFle viewer, provides a convenient way for an analyst to inter-actively view results and browse relevant code locations.We preprocess the output of stages 2 and 3 to obtain agadget candidatefor each unique detected sink or unexpectedtermination. For a reached sink, this is determined by the

--- page 14 ---

3698 33rd USENIX Security Symposium
USENIX Association

--- page 15 ---

property name and the stack trace for the sink call or thestack trace for the polluted property access. For unexpectedtermination, this is determined by the termination output.For each gadget candidate, we include all relevant infor-mation for validation and creation of a proof of concept. Fordetected sinks the gadget candidate is presented as a tripleconsisting of the polluted property name as well as the APIand sink represented by the stack trace for the source and sink(SARIF viewers allow for interactively browsing the stack).We also provide the value observed at the sink which helpsthe analyst understand if the runtime manipulates the pollutedvalue. For unexpected terminations, we are limited to provid-ing the program output after the crash, but additionally weprovide the name of the polluted property as well as the testle that crashed.While each result represents only a single polluted property,if multiple properties affect the same API and sink theseresults will be co-located in the generated SARIF le. Thisallows the analyst to combine multiple properties in a proofof concept. Thus, in contrast to a gadget candidate, agadgetis a triple consisting of the set of properties, API and sink. Weremark thatGHUNTERonly detects that a value reaches thesink but not the intended type or structure of that value. Theanalyst has to analyze the API documentation and code tounderstand what values to use in the proof-of-concept exploit.For the running example of Section 3, the SARIF le con-tains two entries, one for the detected ow from the propertymethodto the sinkop_fetchand one for the unexpectederror as a result of polluting the property
signal
.ImplementationWe generate the SARIF le from the logsof the second and third stages. For the second stage we lookfor sinks where a tainted value was observed and the corre-sponding source (property access for that exact value). As aresult any source that does not reach a sink is automaticallydiscarded. If no source can be found for a taint value at a sink(e.g. due to modications to the value), it is reported to theanalyst separately. For the third stage we report any test runresulting in a non-zero exit code with a stderr message otherthan a test failure, excluding tests that failed in the initial run.4.5 LimitationsFull-edged taint trackingOur lightweight taint analysisfavours performance. This can be seen as a limitation withrespect to manual validation because the complete ow fromsource to sink is not readily available. In practice, we nd thatthe runtime code is relatively simple for most cases, and theow from source to sink can be identied quickly. Secondly,our lightweight taint tracking may miss ows from sourcesto sinks in the event that the taint value is removed in certainoperation (e.g. splice). Again, we observe that most runtimecode does not perform modications on values beyond simpletransformations such as converting a string to uppercase.Polluted typesThe pollution simulation only pollutes usingstrings and objects. We could additionally cover numbers andarrays for pollutions (booleans cannot be taint tracked with ourapproach). This would only nd ows where an explicit typecheck prevents the tainted value from reaching a sink. Besidespolluting with different types, techniques such as concolicexecution [31,47] could be used to improve coverage too.Gadget chainsIn contrast to works on gadget detection inlibraries and frameworks [31, 44],GHUNTERcannot ndgadget chains where one pollution enables another. This isbecauseGHUNTERpollutes only a single property at the time.Running an analysis where multiple properties are polluted atthe same time is possible in theory, but infeasible in practice
due to the number of possible combinations of properties.Binding coverageFor Node.js we are unable to cover 25 bind-ings because they exist at a property that is not congurableor not writable, thus preventing us from wrapping them. Weevaluated these functions and nd them to have little securityrelevance. For Deno we were unable to wrap 4 bindings, allasync, because they do not take any arguments. Such sinks arenot interesting for our analysis so we consider this a non-issue.Test suite limitationsOur approach relies on the comprehen-siveness of the runtime's test suite. We are thus limited inour analysis by the coverage of the source code by the testsuite. We evaluate the coverage statistics and nd 95.8% and91.4% function coverage in Node.js and the Deno standardlibrary respectively. These percentages give condence in thecomprehensiveness of our analysis.
5 EvaluationThis section describes the results of our comprehensive evalu-ation on Node.js and Deno, answering the research questions:•RQ1:How can we effectively identify exploitable universalgadgets in the Node.js and Deno runtimes?
•
RQ2:
How does GH
UNTER
compare to Silent Spring?
•RQ3:What is the performance overhead of our taint-enhanced runtimes as compared to the original runtimes?How to empirically validate transparency of our taint-enhanced runtime with respect to the original runtimes?Experimental setupWe conduct our experiments on an AMDEPYC 7742 64-Core 2.25 GHz server with 512 GB of RAM.To optimize server resource utilization, we execute tests inparallel. We utilize a modied test runner script that runs testles in parallel with a 20 second timeout per test le. ForNode.js we adopt the existingtest.pyrunner, for Deno wewrite a custom runner that invokes
deno test
.
5.1 Universal Gadgets in Node.js and DenoWe demonstrate the effectiveness ofGHUNTERthrough thenumber of detected gadgets in light of the number of outputsfor intermediate analysis steps.

--- page 16 ---

USENIX Association
33rd USENIX Security Symposium 3699

--- page 17 ---

Analysis of Node.jsThe target of our analysis of Node.js isthe standard library built into the Node.js binary. The rst stepof our analysis produced 509,481 unique test-property combi-nations for 3,782 test les. The second and third steps of ouranalysis found 22,860,092 sinks reached, 9,743 segfaults, and6 tests that timeout. Preprocessing of results reduced the num-ber of sink-source pairs to 13,029 unique pairs and segfaults to13 (no reduction in test timeouts). Furthermore, we excludedsource-sink pairs that could only lead to Denial of Service:11,730 sinks related to infrastructure code such as type check-ing, internal utils, asynchronous call wrappers, exception anderror message builders; 120 inbuffer.byteLengthUtf8;258 inmessaging.postMessage, which sends messages be-tween workers; and 101 in thebufferparameter infs.readwhich is used for output of the sink call. After ltering, thereare 820 gadget candidates out of which we conrmed 56 tobe exploitable. The manual verication process required 31person hours.Analysis of DenoOur analysis of the Deno runtime coversthe core API (accessible byDeno), the Node.js compatibilitymodule, and the Deno standard library. We ran our pipelineon each separately, but accounted for duplicates when aggre-gating the results, which we report here.
The rst step of our analysis produced 21,786 unique test-property combinations for 596 test les. The second and thirdsteps of our analysis found 13,519 sinks reached, 1 panic, and139 tests that timeout. Preprocessing of results reduced thenumber sink-source pairs to 399 unique pairs, 18 tests thattimeout, and no reduction in panics. As a result, we obtained418 gadget candidates out of which we conrmed 67 to beexploitable. The manual validation took 15 person hours.Node.js vs DenoWe observe quite a large difference in num-bers when comparing Node.js to Deno. First, Node.js pro-duces signicantly more results. One reason for this is thatNode.js has a larger test suite (both in terms of test les andtest cases). Despite Deno's security focus, we nd similarnumber of exploitable gadgets. One reason for this is thatDeno has a larger API surface. Another is that prior work ongadgets has resulted in some protections being implementedin Node.js, in fact some of the gadgets we nd in Deno werepreviously identied and addressed in Node.js.Result classicationWe categorize our universal gadgetsby the strongest exploit they can be used for. If multipleproperties can be combined to achieve a stronger exploit, weconsider only the combination and not the weaker exploits per-taining to a subset of properties. Table 1 shows the aggregatenumber of gadgets per exploit category.We omit gadgets without a security impact or that onlycause a JavaScript exception (they have limited impact sinceapplications can catch such exceptions). We include gadgetsthat presume an existing vulnerability (e.g. to write a le onthe systems) and call these
second order
gadgets.New detected gadgetsWe highlight 4 gadgets here and referAttack TypeNode.jsDenoArbitrary Code/Command Execution145Server Side Request Forgery63Privilege Escalation724Cryptographic Downgrade20Path Traversal310Unauthorized Modications010Log Pollution01Panic/Segfault121Out of Memory03Innite Loop02Second Order128Total5667Table 1: Number of gadgets found by type per runtime.to Table 5 and Table 6 in Appendix, and code artifact [14] forthe complete list of gadgets.Listing 3 shows a proof of concept (PoC) of thefetchgadget from Section 3. In addition to the propertymethod,polluting the propertiesbodyandheadersallows attackersto control all aspects of the request to the application-specicURL. Moreover, due to the way Deno'sfetchimplementa-tion stores request URLs internally, the pollution of property0allows the attacker to override the URL and achieve SSRF.This gadget transforms a simple benign-looking request likefetch("http://example.com")into a completely unre-lated HTTP request.
1
// send a POST request to http ://fake.com
2
// /////////////////////////////////////////////
3
// PROTOTYPE POLLUTION:
4
Object.prototype [0] = 'http ://fake.com'
5
Object.prototype.method = 'POST'
6
Object.prototype.body = '{"pwned ":"yes"}'
7
Object.prototype.headers = {"content -type":"
application/json"}
8
// /////////////////////////////////////////////
9
// GADGET:
10
fetch('http :// example.com')
Listing 3: PoC of
fetch
gadget (Deno).Similarly, we found that thefetchAPI of Node.js can alsoexploited to achieve SSRF attacks. In addition to controllingmethodandbody, an attacker is able to pollutesocketPathto redirect HTTP requests to a local socket rather than thespecied URL. This gadget can be exploited to target localdaemons, such as Docker.Another universal gadget in Deno allows for path traversalon temporary les. Pollutingdirallows an attacker to controlwhereDeno.makeTempDirandDeno.makeTempFilecreatetemporary le system entries. Even ifdiris specied by theapplication,prefixstill allows for path traversal by using astring like../as a prex (prior to Deno v1.41.1). Dependingon how the temporary le is used, this gadget can be a setupfor a stronger attack.We also identify two new Arbitrary Code Execution (ACE)gadgets in Node.js, located in the commonly usedrequireandimportfunctions. The gadget inrequirehas been xed

--- page 18 ---

3700 33rd USENIX Security Symposium
USENIX Association

--- page 19 ---

APIGTSilent SpringGH
UNTERGCTP/FPFNGCTP/FPFNcp.exec2201/19132/10cp.execFile1160/16121/10cp.execFileSync4213/18174/30cp.execSync4133/10174/30cp.fork2251/24162/40cp.spawn3142/12153/20cp.spawnSync4113/8174/30import100/0151/40require3192/17141/32vm.compileFunction141/3050/51Total2514316/12795122/293Table 2: Silent Spring vsGHUNTERon Node.js v16.13.1 with propertiesused in Silent Spring gadgets as ground truth.as of Node.js v18.19.0. We detail this gadget and its x inSection 6.3. The gadget associated withimport, shown inListing 4, can be exploited by polluting thesourcepropertywith JavaScript code and invoking theimportfunction onany.mjsle. This causes the code from the property to beevaluated.
1
// /////////////////////////////////////////////
2
// PROTOTYPE POLLUTION:
3
Object.prototype.source ='console.log("PWNED")'
4
// /////////////////////////////////////////////
5
// GADGET:
6
import('./ any_file.mjs')
Listing 4: PoC of
import
gadget (Node.js).
5.2 GHunter vs Silent SpringWe compare the effectivess ofGHUNTERand SilentSpring [43] in nding universal gadgets. Silent Spring can de-tect prototype pollution statically and also universal gadgetsin Node.js using a mix of dynamic and static taint analysis.The two approaches differ in non-trivial ways.GHUNTERuses dynamic analysis to detect pollutable properties at run-time and it is driven by the test suite of a runtime environment.In contrast, Silent Spring syntactically identies any propertyreads and uses them in a dynamic analysis to check if theyare pollutable. This causes challenges with properties thatare not identiable statically, for example computed proper-ties. Moreover,GHUNTERanalyzes all APIs systematically(subject to coverage by the test suite), while Silent Springanalyzes only 3 APIs.Because of these differences and the fact that some of thegadgets from Silent Spring have since been xed, we per-form the following comparison: we use the gadgets identiedby both toolchains as a basis for ground truth and evaluatewhether or not each tool nds a gadget candidate (GC) foreachpropertyused in the gadgets for a given API. This isbecause both toolchains can only taint/pollute one propertyat a time and report one GC per property. We focus only onACE gadgets as was the case in Silent Spring.Our rst experiment uses the gadgets of Silent Spring asa ground truth on Node.js v16.13.1. We recreated PoCs forAPIGTSilent SpringGH
UNTERGCTP/FPFNGCTP/FPFNcp.exec190/9121/10cp.execFile190/9121/10cp.execFileSync4113/8174/30cp.execSync231/2132/10cp.fork150/5111/00cp.spawn392/7153/20cp.spawnSync463/3174/30import100/0111/00vm.SyntheticModule331/2211/02Total205510/45102918/112Table 3: Silent Spring vsGHUNTERon Node.js v21.0.0 with properties usedin GH
UNTER
ACE gadgets as ground truth.all its gadgets to determine the affected APIs and necessaryproperties. Based on this we created new test cases in the styleof Silent Spring's dynamic analysis. We reran both SilentSpring andGHUNTERon Node.js v16.13.1 using these newtest cases to obtain the results shown in Table 2. Ground truth(GT) is the number of GCs required to identify all gadgets ofan API. False negatives (FN) represent the number of GCsthat were identied manually (and not by a tool), but are in theGT of a gadget. We see thatGHUNTERis more precise (0.43compared to 0.11) and has better recall (0.88 compared to0.64). This is due to the underlying dynamic analysis, whichguarantees that a polluted property reaches a sink.GHUNTERhas three FNs because it lacks features necessary to detect thesink (therequiregadget requires a chain of pollution; thevmgadget requires array support). For Silent Spring we ndnine FNs. The FNs for child process (cp) are due to the lackof support forfor-inanalysis, causing it to miss one variantof the gadgets. Forimportit fails to detect the gadget APIand forrequireit fails to detect one property; in these casesthe true and false positives would have allowed the analyst toextrapolate the properties reported as FNs here.Our second experiment uses the gadgets ofGHUNTERas aground truth on Node.js v21.0.0. For a fair comparison, wecreated test cases for ACE gadgets from Table 5 in the style ofSilent Spring's dynamic analysis. We reran bothGHUNTERand Silent Spring on Node.js v21.0.0 using these new testcases to obtain the results shown in Table 3. For this selectionof gadgets,GHUNTERnds more gadgets while reportingfewer gadget candidates, again showing better precision (0.62compared to 0.18) and recall (0.90 compared to 0.50), requir-ing less manual work. Silent Spring again exhibits FNs forall child process APIs because it lacks support forfor-inconstruct. For theimportgadget, Silent Spring fails to detectthe API that triggers the gadget.In summary, these experiments show thatGHUNTERismore precise, resulting in less manual work required andhigher accuracy. We believe this is primarily due to the fullydynamic approach used byGHUNTER, which guarantees ev-ery GC reaches a sink and provides support for dynamiclanguage features. The shortcomings ofGHUNTERare dueto the limitations discussed in Section 4.5.

--- page 20 ---

USENIX Association
33rd USENIX Security Symposium 3701

--- page 21 ---

5.3Performance Overhead and TransparencyWe evaluated the performance overhead incurred byGHUNTERin comparison with the unmodied JavaScriptruntimes. To evaluate the effect of the customized runtimesand the customized V8 engines on the behavior of runtimeAPIs, referred to as transparency, we use the test suites asoracles to identify behavioral changes.Node.jsRunning the full Node.js test suite, which contains3,810 tests, using our modications increased runtime by111.72% (from 252s to 542s). The success rate decreasedfrom 3,782 to 3,669 cases, marking a 2.99% reduction. Thenumber of tests failing due to timeout increased from 2 to 44cases.DenoRunning the three different test suites using our mod-ications increased runtime by 4.46% (from 157s to 164s)for Deno core, by 43.85% (from 130s to 187s) for Deno'sNode.js compatibility module, and by 5.93% (from 253s to268s) for Deno std. In total that is 14.63% (from 540s to619s). The success rate decreased by by 0.17% (from 1,145to 1,143 out of 1,340) for Deno core, by nothing for Deno'sNode.js compatibility module, and by 0.27% (from 2,207 to2,201 out of 2,258) for Deno std. In total that is 0.15% (from5,364 to 5,356 out of 5,648). The number of tests failing dueto timeout increased from 1 to 2 cases.EvaluationThe main reason for the decreased performanceand higher failure rate is the code responsible for checkingtainted values in internal sinks. This code recursively traversesreceived values of each argument of the sink. Unexpectedexceptions in the traversed objects' code, such as in propertygetters, lead to failures. Additionally, the modied versionextends
globalThis
with
log
, causing some tests to fail.
6 Defense Best PracticesWhile previous works provide convincing evidence on thedangers of prototype pollution, as of today, there is no com-prehensive defense against this vulnerability. In this section,we systematize the current proposals and mitigations andoutline directions for future work. Since our universal gad-gets require the existence of prototype pollution, a reasonablequestion to ask is whether we should mitigate the impactof the vulnerability by xing the gadgets. Given the lack ofcomprehensive defenses against prototype pollution, we thinkthat gadgets should be treated similarly to memory corruptionvulnerabilities such as return-oriented programming (ROP)and jump-oriented programming (JOP), due to their high im-pact. Developers of runtimes or libraries are unaware of thepresence of prototype pollution in the applications using theircode. Therefore, it stands to reason to assume the presenceof vulnerabilities and treat the prototype objects as untrusteddata, thus guaranteeing security by xing gadgets in theircode. Similarly, application developers are unaware of pro-totype pollution in third-party libraries or runtimes of theirapplication, hence they should mitigate gadgets.
6.1 Gadget MitigationsGadget can be mitigated by avoiding the use of potentiallypolluted properties in the code. A solution is to ensure that anyaccess to the properties of an object does not fall back to theobject's prototype chain. We distinguish different mitigationsdepending on where in the code an object with a pollutedprototype may becreated. This can be either the developer'sown code (e.g., a library or module) or third-party code (e.g.dependencies or application code that use APIs provided bythe developer). This leads us to the rst guideline.G1: Explicit access to own propertiesIf the code accesses a property in only a few instances,developers should verify each access explicitly.Developers should check if an object denes an own prop-erty before accessing it. This can be achieved with built-inmethods such asObject.hasOwn(obj, 'prop'). We en-countered this pattern regularly during our analysis of for-inloops to prevent reading unexpected properties. These checksshould be added every time a potentially undened property isaccessed, thus preventing access to a polluted property. Thisguideline can be applied regardless of where the object be-ing checked was created. However, overuse of these checksincreases the codebase's complexity. Therefore, developersshould follow other recommendations whenever their codemakes use of many property accesses. We also recommendusing the methodObject.keys, which returns the object'sown enumerable properties rather than for-in loops, whichadditionally iterate over properties in the prototype chain.G2: Safe object creationWhen creating an object, developers should use eithernull
prototypes or built-in objects
Map
and
Set
.The method callObject.create(null)and the objectliteral{__proto__:null}allow to create objects that do notinherit from the prototype hierarchy. In this case, any propertyaccessobj.propreturnsundefinedunlesspropis an ownproperty of objectobj. On the downside, this solution canlead to unexpected exceptions. For example, code patterns likeobj + "str"will throw an exception because notoString
method is available without the prototype.When the created object is returned by the underlying func-tion or it is passed as an argument to a third-party function,developers should copy the object to a new object that in-cludesObject.prototypeto ensure backward compatibility.We recommend assigning default values to unused propertiesto prevent pollution with attacker-controlled values in third-party code. This operation can be facilitated by, e.g., using

--- page 22 ---

3702 33rd USENIX Security Symposium
USENIX Association

--- page 23 ---

the methodObject.assign({}, defaultObj, obj). Weremark that the prototypes of nested objects require cloningthe object by means of a deep copy algorithm, for example,using the global method
structuredClone()
.An alternative solution is to use built-in objects that providesafe access to properties. For instance, theMapobject holdskey-value pairs and provides methods such asMap.getthatdo not use the prototype chain to look up the stored values.Hence,map.get('prop')can serve as a replacement foraccesses to objects.G3: Safe copy of input dataWhenever an object is received as input data, developersshould copy the object's properties to a safe object.If a developer uses an object as a function argument (forexample,optionsin Listing 5), or an object originating froma deserialization function (for example,JSON.parsein List-ing 7), they should assume that the object's prototype can bepolluted. A safe solution is to copy the expected propertiesto a new object withnullprototype. This can be achievedby creating a copy with only own properties, using the ex-pression{__proto__:null,...obj}. If the code returns thereceived object back, the developers should use the originalvalue instead of the copied one to avoid compatibility issues.The guidelines G1 and G3 may be backward incompatiblewhen an object relies on a prototype chain to dene propertieswithin nested prototypes. We expect this design pattern tobe used for functions rather than data-type properties, whichare subject to prototype pollution. An empirical evaluation isnecessary to validate this claim.As we can see, systematic mitigation of gadgets is an openproblem. Developers are expected to identify all gadgets touniversally apply mitigation techniques to any potentially un-dened property, which is infeasible in practice. Moreover,gadget mitigation can be hard to apply to existing code basessince it requires identifying every access to undened proper-ties. These considerations motivate the need for solutions likethe one proposed in this paper but we believe the guidelinescan be automated as suggestions for quick xes in IDEs orsimilar tooling. Detection may require inter-procedural analy-sis, yet we expect that G1 and G2 can be implemented basedon quick intra-procedural analysis.
6.2 Prototype Pollution MitigationsPrototype pollution is the root cause for exploitation of gad-gets, hence a comprehensive mitigation technique would solvethe problem altogether. As with gadget mitigations, this re-quires striking a balance between security and usability, whichmakes it a challenging task. Here we discuss recommenda-tions for developers and opportunities for researchers.Guidelines for developersA general solution is to pre-vent any accesses to the prototypes of objects, which canbe achieved by the above-mentioned guidelines for gadgetmitigation. Following guideline G1, developers should avoidaccesses to object prototypes through property reading ex-pressions. This is because properties such as__proto__andconstructor.prototype, which give accesses to the proto-type chain, are not dened in the object itself. Alternatively,this can also be achieved by explicitly checking accesses toproperties__proto__,constructor, andprototype. Sim-ilar to own property checks for gadget mitigation, this miti-gation introduces additional verbosity. Following guidelineG2, one can instead use data structures with eithernullpro-totypes or safe
get
and
set
functions.Another solution is to prevent unintended modicationto the prototype object itself, which can be achieved withbuilt-in functions such asfreeze,preventExtension, andseal[5]. These functions offer a mechanism to prevent thecreation of new properties on an object. Thefreezefunctionadditionally prevents overwriting. Node.js provides the ex-perimental command-line feature,--frozen-intrinsics,which freezes the prototypes of built-in objects likeArrayandObject. Similarly, Deno removes__proto__fromObject.prototype
by default.While mitigating prototype pollution, these solutions canbe problematic for third-party packages that rely on chang-ing the prototype to implement, e.g., polylls. Also, they re-quire coverage of all prototype object, including user-denedclasses which makes it verbose and hard to maintain for largeprojects. We recommend these solution for the developmentof a new project while existing project should perform regres-sion testing to ensure that no functionalities are disrupted.Research opportunitiesMitigation of prototype pollutionand gadgets remains an open problem. A recent proposaldriven by Google aims to prevent prototype pollution at thelanguage- and runtime-level [6]. It proposes an opt-insecuremode, which, if enabled, prevents accesses to prototypes withdynamic string keys. It allows prototype access through reec-tion APIs instead of strings, thus only requiring changes to__proto__andconstructor, whenever they are accessedpurposefully. While an important step in the right direction,this solution poses challenges of backward compatibility forserver- and client-side applications.
6.3 Case StudiesWe evaluate xes of known server-side prototype pollutionvulnerabilities and their gadgets to identify common issuesin mitigations that permit attackers to bypass the xes. Weconducted our search through public vulnerability reportson HackerOne, blog posts, and publications related to open-source applications over the past 5 years, summarizing ourndings in Table 4. Our results contain 12 exploitable casesleading to Remote Code Execution (RCE) in 4 popular appli-cations. The root cause of their exploitability, namely codepatterns that allow to pollute prototypes, has been addressed

--- page 24 ---

USENIX Association
33rd USENIX Security Symposium 3703

--- page 25 ---

ApplicationVersionVulnerability ReportPP FixGadgetGadget FixApp MitigationsKibana6.6.0CVE-2019-7609Ëchild_process.spawnéË
G2, G3
7.6.2HackerOne #852613Ëlodash.templateéé7.7.0HackerOne #861744Ëlodash.templateéË
G38.7.0CVE-2023-31415Ënodemaileréénpm-cli8.1.0Reported by [43]Ëchild_process.spawnË
G2éParse Server4.10.6CVE-2022-24760ËbsonéË
Denylisting5.3.1CVE-2022-39396ËbsonéË
Denylisting5.3.1CVE-2022-41878ËbsonéË
Denylisting5.3.1CVE-2022-41879ËbsonéË
Denylisting5.3.1Reported by [43]ËrequireË
G2

, G3é6.2.1CVE-2023-36475ËbsonË–Rocket.Chat5.1.5CVE-2023-23917ËbsonË–Table 4: A summary of the RCEs exploited via prototype pollution. For each application, we list the vulnerable version, a reference to the report, and theexploited gadget.PP Fixshows whether the prototype pollution was xed;Gadget Fixshows whether the gadget was xed, including any applied guidelines;App Mitigationsdetails if mitigations against the attack were implemented in the application.éindicates that no x has been applied;Ëindicates that a x wasapplied but later bypassed;
Ë
indicates that a x was applied and effectively protects against similar attacks. (

) denotes a guideline that might be bypassed.in all cases. These vulnerabilities involve 5 unique gadgets toachieve RCEs. For 4 of these gadgets, developers proposedeither xes or mitigations for the attacks.We identify 6 vulnerabilities that exploit a gadget in thebsonpackage. The Parse Server developers xed 5 vulnera-bilities that use this gadget with input data validation throughdenylisting. However, these mitigations were bypassed sev-eral times through unexpected means, e.g. with les metadata.Ultimately, the dangerous feature was removed frombson,thereby xing the gadget. Both Parse Server and Rocket.Chatxed their vulnerabilities through this method. This highlightsthe need to x gadgets because mitigation is difcult and oftenleaves room for exploitation by other means.The gadgets inlodash.templateandnodemailerre-main unaddressed and could be exploited given new proto-type pollutions. The maintainers of Kibana banned the useoflodash.templatein their code and mitigated it by inter-ceptingtemplatecalls and validating the polluted propertywhen the package is included as a transitive dependency.However, as illustrated, it can be dangerous to leave gadgetsunxed. Next, we detail two interesting gadgets and highlightissues in their xes to demonstrate the risk.child_process.spawnThe rst mention of thespawngad-get appears in the report CVE-2019-7609 by Micha Ben-tkowski, outlining a prototype pollution vulnerability inKibana. Kibana spawns anodeprocess, and the securityresearcher discovered a method to execute arbitrary codethrough crafted environment variables of the new process.Listing 5 presents the necessary code of thespawnfunc-tion to understand the attack. If an application invokesspawnwith two arguments,fileandargs, then the third argumentoptionsis undened. Line 3 creates a new object that inher-itsObject.prototype, making it susceptible to prototypepollution. Line 4 makes a shallow copy ofoptionsto preventchanging the user's options object if passed. In our scenarios,this copy operation is inconsequential becauseoptionsisan empty object created within the function itself. Line 5 re-trieves the value of theenvproperty. If the value is undened,1
function
spawn(file , args , options) {
2
if
(options === undefined)
3
options = {}
4
options = Object.assign({}, options)
5
options.env = options.env || process.env
6
options.file = options.shell || file
7
//...
8
internalSpawn ({
9
file: options.file ,
10
env: options.env ,
11
//...
12
})
13
}
Listing 5: Simplied Node.js
spawn
implementation.the code defaults toprocess.env, assigning this to theenvproperty of options. Line 6 similarly handles theshellprop-erty from options and thefileparameter. Subsequently, thecode passes the aggregated options to the internal implemen-tation of thespawnfunction, which initiates a new process. Ifan attacker pollutes theenvproperty inObject.prototype,line 5 will read the attacker-controlled value instead of sys-tem environment variables. It allows the attacker to executearbitrary code, leading to RCE in Kibana.The Kibana team xed the prototype pollution vulnerabil-ity and mitigated the gadget in PR #55697 to prevent sim-ilar attacks in later versions. Because the gadget is part ofNode.js' source code, application developers are limited tointerceptingspawncalls and altering the arguments. Listing 6provides a simplied version of this mitigation. The codeuses a JavaScript Proxy to invoke thepatchfunction, therebysecuring the options. It evaluates passed arguments from thezero-based arrayargs. If the argument at position 1 is anarray, line 5 simply advances the position. If the subsequentargument at position 2 is an object, it is treated as the options,and theprototypelessfunction then copies the options'own properties to new objects with null prototypes.This mitigation follows our guidelines G2 and G3. Lines

--- page 26 ---

3704 33rd USENIX Security Symposium
USENIX Association

--- page 27 ---

1
cp.spawn =
new
Proxy(cp.spawn , {apply: patch})
2
function
patch(target , thisArg , args) {
3
var
pos = 1;
4
if
(Array.isArray(args[pos]))
5
pos++ // fn(file , args , ...)
6
if
(
typeof
args[pos] === 'object') {
7
// fn(file , options , ...)
8
// fn(file , args , options , ...)
9
args[pos] = prototypeless(args[pos])
10
}
11
//...
12
return
target.apply(thisArg , args)
13
}
14
function
prototypeless(obj) {
15
var
newObj = Object.assign(
16
Object.create(
null
), obj)
17
newObj.env = Object.assign(
18
Object.create(
null
), newObj.env)
19
return
newObj
20
}
Listing 6: Simplied
spawn
gadget mitigation in Kibana.16 and 18 create new objects with null prototypes in accor-dance with G2, ensuring that care is also taken for nestedobjects to prevent pollution ofenvwhen the value is readfromprocess.env. The use ofObject.assignin lines 15and 17 copies only own properties from the original objectsto the new objects with null prototypes, following G3.However, this mitigation has two critical weaknesses thatallow the attacker to bypass it. Developers are constrainedto validating arguments and lack control over modicationsto arguments after passing them to Node.js functions. Asobserved in line 5 of Listing 5, thespawnfunction makes acopy of the received options into a common empty object thatshares its prototype with others. Consequently, any propertiesof the options might be polluted again. Fortunately,spawndoes not copy theenvproperty, so environment variablesare not affected. The other weakness is more dangerous andallows for bypassing all mitigations and even security xesin Node.js, as we will see later. Lines 6 and 9 of Listing 6are also exploitable by prototype pollution. The arrayargs,like any array, hasObject.prototypein its prototype chainand looks up an undened property. Therefore, polluting theproperty2allows the attacker to control the options. For thisexploit, a gadget trigger might look as follows:
1
Object.prototype [2] = { env:
2
{NODE_OPTIONS: '--inspect -brk =0.0.0.0:1337 '}
3
}
4
spawn('node', ['any_file.js'])Thus, thespawngadget is still exploitable in Kibana aftermitigations. This case highlights the importance for devel-opers to exercise caution with security-critical code, such asgadget mitigations, and to test it against other gadgets usingtools likeGHUNTERto avoid introducing new exploitationows into the code.Shcherbakov et al. [43] introduce a variation of thespawn
1
// lib\internal\modules\cjs\loader.js
2
function
readPackage(dir) {
3
const
jsonPath = resolve(dir , 'package.json')
4
const
json = packageJsonReader.read(jsonPath)
5
if
(json === undefined)
6
return false
7
return
JSON.parse(json)
8
}
9
function
tryPackage(requestPath) {
10
const
pkg = readPackage(requestPath)?.main
11
if
(!pkg) {
12
const
js = resolve(requestPath , 'index.js')
13
return
loadFile(js)
14
}
15
loadFile(pkg)
16
}
Listing 7: Simplied Node.js
require
implementation.gadget. They nd that the name of a running process can bemanipulated through the polluted propertyshell, as shown inline 6 of Listing 5. Additionally, they disclose new payloadsfor the exploit that operate without controlling environmentvariables and controlling only one variable. They identify avulnerability in the JavaScript package manager npm-cli, andexploit it to demonstrate the practical feasibility of using thisgadget. Although npm-cli contributors addressed the reportedprototype pollution, they did not mitigate the gadget.In June 2022, the Node.js team attempted to x thisgadget in PR #43159. In terms of our terminology,they implemented guideline G2 by assigning the valueObjectFreeze(ObjectCreate(null))to options in line 3of Listing 5 and eliminatedObject.assign()in line 4 tomaintain the usage of options with a null prototype. As dis-cussed in Section 6.1, G2 alone is insufcient to prevent allforms of gadget exploitation, and G2 should be used in con-junction with G3.GHUNTERreports a gadget forspawnwhena user supplies their own options object to
spawn
:
1
Object.prototype.shell = 'node'
2
Object.prototype.env =
3
{NODE_OPTIONS: '--inspect -brk =0.0.0.0:1337 '}
4
spawn('app', ['file.log'], {cwd: '/tmp'})This case illustrates the importance of a consistent ap-proach in implementing gadget xes. When applying guide-line G2, it is crucial to carefully handle input data and copy itsafely, while also applying G3. Relying on validating security-critical parameters outside the gadget proves to be insecure.requireShcherbakov et al. [43] report a gadget inrequire,a built-in function in Node.js for including external modulesfrom separate les as well as Node.js modules, and utilizethis gadget in one of the Parse Server exploits. Listing 7illustrates a gadget based on simplied Node.js code. ThefunctiontryPackagereceives a directory path for a moduleand invokesreadPackage()in line 10. The code in line 4attempts to readpackage.jsonfrom the given directory. Ifthe read operation is successful,readPackage()parses the

--- page 28 ---

USENIX Association
33rd USENIX Security Symposium 3705

--- page 29 ---

content of the le as JSON and returns the parsed object in line7.tryPackagethen accesses themainproperty in line 10,loads a le based on the path specied in themainproperty,and evaluates its JavaScript code in line 15. Consequently,ifpackage.jsonlacks the main property, line 10 looks upthe property in the prototype chain of the returned object,allowing a polluted property fromObject.prototypeto beassigned topkg. This leads to the evaluation of JavaScriptcode from an attacker-controlled le in line 15.The Node.js team attempted to x this gadget by applyingguidelines G2 and G3 toreadPackagefunction. They cor-rectly make a safe copy of the parsed object in line 7 to an ob-ject with a null prototype. However,GHUNTERdetects a vari-ation of the gadget in v18.13.0. IfpackageJsonReadercannot nd thepackage.jsonle, the function returnsfalsein line 6. Since Boolean is a primitive type and all primi-tive types in JavaScript inherit fromObject.prototype, theexpression(false)?.mainin line 10 accesses the pollutedvalue inObject.prototypeand assigns it topkg, achievingthe same attack. This makes therequirefunction exploitable,albeit through a different gadget.End-to-end exploitTo demonstrate the impact of this gadget,we analyze Kibana version 8.7.0 for end-to-end exploits. Weinitially utilized the Silent Spring [43] toolchain to detect pro-totype pollution vulnerabilities. The analysis reports 44 casesin the server-side code, with 6 being potentially exploitable.The simplied code of one of the cases is presented in List-ing 8. Kibana loads a cong le, parses it into an object, andexpands the properties from dot notation into nested objects(e.g.,{a.b:0}to{a:{b:0}}) with theensureDeepObjectfunction. This code is vulnerable to prototype pollution. Online 19, the rst argument allows an attacker to get a referenceto the prototype and then assign a value to any property of theprototype in line 14.To exploit this prototype pollution, an attacker should up-load a conguration le with a payload via the Web UI formand restart Kibana to trigger the parsing of the new congura-tion le. During the restart process, Kibana crashed at an earlystage due to an unexpected polluted property that preventedgadget execution via another web request. However, the ap-plication invokedrequiremultiple times during loading,allowing us to trigger it and achieve RCE. The investigationprocess took 8 hours for one author already familiar withKibana. We reported this vulnerability, and the Kibana teamacknowledged the issue, assigning CVE-2023-31414 with acritical CVSS 9.1, and rewarding a substantial bounty. TheNode.js team xed the
require
gadget in version 18.19.0.TakeawaysIf developers x only the prototype pollution vul-nerabilities while leaving its associated gadget exploitable,they remain at risk. Our case studies show that many develop-ers are aware of this risk and attempt to mitigate the gadgetsand similar attacks. However, this task is far from trivial. Weidentied numerous gadgets and common coding issues thatlead to new gadgets, emphasizing the need for more princi-1
function
ensureDeepObject(obj: any): any {
2
return
Object.keys(obj).reduce((res , key)=>{
3
const
val = obj[key];
4
if
(!key.includes('.'))
5
res[key] = ensureDeepObject(val);
6
else
7
walk(res , key.split('.'), val);
8
return
res;
9
}, {} as any);
10
}
11
function
walk(obj:any , keys:string[], val:any){
12
const
key = keys.shift()!;
13
if
(keys.length === 0) {
14
obj[key] = val;
15
return
;
16
}
17
if
(obj[key] === undefined)
18
obj[key] = {};
19
walk(obj[key], keys , ensureDeepObject(val));
20
}
Listing 8: Prototype pollution vulnerability in Kibana.pled solutions. Our proposed guidelines are a step forward inthis direction.
7 Related WorkWe discuss our work in the context of closely-related worksthat address prototype pollution vulnerabilities and positionour contributions in the area of web application security.Universal gadgets in JavaScript runtimesThe problem ofidentifying universal gadgets in JavaScript runtimes remainslargely unexplored. To the best of our knowledge, only thework of Shcherbakov et al. [43] studies universal gadgets inNode.js. Section 5.2 compares their work to GH
UNTER
.Recent work by Shcherbakov et al. [44] uses dynamic taintanalysis via program instrumentation to nd gadgets in NPMpackages. This approach cannot be used to identify universalgadgets which require modications of runtime environments(Node.js and Deno) and the underlying V8 engine. Our univer-sal gadgets are complementary and contribute with additionaldangerous sinks for analysis such as [44], thus increasingtheir attack surface coverage. Kang et al. [24] study proto-type pollution on the client-side application by dynamic tainttracking. Their analysis is implemented at the V8 JavaScriptengine by adapting the tool of Melicher et al. [32]. Their focuson client-side vulnerabilities is incompatible with server-sideruntimes such as Node.js and Deno.Other work [31, 47] uses concolic execution to nd gad-gets in client-side JavaScript code. Concolic execution is apromising enhancement of dynamic analysis. Liu et al. [31]focus specically on nding gadget chains where one gadgetunlocks the use of another gadget (e.g. by forcing a branch). Itwould be interesting to apply these ideas to backend systems.Prototype pollutionIn recent years, we have seen increased

--- page 30 ---

3706 33rd USENIX Security Symposium
USENIX Association

--- page 31 ---

attention on prototype pollution vulnerabilities by bothacademia and practitioners [2,10,21,24,26,29,30,43,50]. Thework of Arteau [10] is the rst to demonstrate the feasibilityof prototype pollution in a number of libraries. On the aca-demic front, the vast majority of research contributions focuson the detection of prototype pollution [26, 29, 30]. Theseworks use static taint analysis to nd zero-day vulnerabilitiesleading to DoS attacks. Our contributions are complementaryas they focus on the detection of universal gadgets rather thanprototype pollution. The security impact of prototype pollu-tion is discussed in practitioner forums [2,21,50]. Heyes [21]describes how prototype pollution can be exploited in Node.jsto nd vulnerabilities beyond DoS in black-box scenarios.Their semi-automated approach uses PP-nder [50] to reportall undened properties encountered during the execution andconducts manual inspection of packages for vulnerabilities.This approach is practical for a few specic targets, yet it isneither feasible at scale nor able to identify universal gadgets.Code reuse attacks for the webPrototype pollution is anew class of code reuse vulnerabilities in web applicationsand, as such, it shares similarities with object injection vul-nerabilities. Several works use static taint analysis to detectcode reuse vulnerabilities for a variety of languages includingPHP [15,16,18,37], .NET [33,42], and Java [22,34]. Xiaoet al. [49] study a related type of vulnerability coined hid-den property attacks. Lekies et al. [27] and Roth et al. [38]study the implications of script gadgets in bypassing existingXSS and CSP mitigations. While all of these vulnerabilitiesrely on the reuse of code gadgets, their precise connectionis yet to be studied systematically.GHUNTERimplementsa lightweight form of dynamic taint analysis at the level ofJavaScript runtimes and V8 engine. Dynamic taint analy-sis [39,40] is a popular technique used to identify web-relatedvulnerabilities, including instrumentations at both program-and runtime-level [8,13,19,23,25,28,35,41].
8 ConclusionWe have presented a semi-automated pipeline,GHUNTER,able to nd exploitable universal gadgets in Node.js andDeno by lightweight dynamic taint analysis. We have usedGHUNTERin a comprehensive study of universal gadgets,nding a total 123 exploitable gadgets. In absence of compre-hensive defenses, we have systematized existing mitigationfor prototype pollution and gadgets in the form of guidelines.We have used these guidelines in a study of existing exploitsin real applications to illuminate the current status, nding ahigh-severity exploit due to the lack of principled mitigations.AcknowledgmentsWe thank anonymous reviewers for thehelpful suggestions and feedback. This work was partiallysupported by the Swedish Foundation for Strategic Research(SSF) under project CHAINS, the Swedish Research Council(VR) under project WebInspector, and Wallenberg AI, Au-tonomous Systems and Software Program (WASP) fundedby the Knut and Alice Wallenberg Foundation under projectShiftLeft.
References
[1]Adding v8 fast api.https://github.com/nodej
s/node/blob/v21.0.0/doc/contributing/addin
g-v8-fast-api.md
.
[2]Client-Side Prototype Pollution and useful Script Gad-gets.https://github.com/BlackFan/client-sid
e-prototype-pollution
.
[3]Deno, the next-generation JavaScript runtime.https:
//deno.com/
.
[4] Node.js JavaScript runtime.
https://nodejs.org/
.
[5]Object - JavaScript - MDN.https://developer.mo
zilla.org/en-US/docs/Web/JavaScript/Refere
nce/Global_Objects/Object
.
[6]Prototype pollution mitigation / symbol.proto.https:
//github.com/tc39/proposal-symbol-proto
.
[7]Standard ecma-335 common language infrastructure(cli).https://www.ecma-international.org/pub
lications/standards/Ecma-335.htm
.
[8]Marco Abbadini, Dario Facchinetti, Gianluca Oldani,Matthew Rossi, and Stefano Paraboschi. Cage4deno: Ane-grained sandbox for deno subprocesses. 2023.
[9]Mohammad M. Ahmadpanah, Daniel Hedin, MusardBalliu, Lars Eric Olsson, and Andrei Sabelfeld. Sand-Trap: Securing JavaScript-driven trigger-action plat-forms. In
USENIX Security Symposium
, 2021.
[10]Olivier Arteau. Prototype pollution attack in NodeJSapplication.
NorthSec
, 2018.
[11]Fraser Brown, Shravan Narayan, Riad S. Wahby, Daw-son R. Engler, Ranjit Jhala, and Deian Stefan. Findingand preventing bugs in JavaScript bindings. InSympo-sium on Security and Privacy (S&P)
, 2017.
[12]Mathias Bynens. Javascript engine fundamentals:Shapes and inline caches.https://mathiasbynens.
be/notes/shapes-ics
.
[13]Darion Cassel, Wai Tuck Wong, and Limin Jia.Nodemedic: End-to-end analysis of node.js vulnerabil-ities with provenance graphs. In8th IEEE EuropeanSymposium on Security and Privacy, EuroS&P 2023,Delft, Netherlands, July 3-7, 2023
. IEEE, 2023.

--- page 32 ---

USENIX Association
33rd USENIX Security Symposium 3707

--- page 33 ---

[14]Eric Cornelissen, Mikhail Shcherbakov, and Musard Bal-liu. Ghunter: Universal prototype pollution gadgets injavascript runtimes.https://github.com/KTH-Lan
gSec/ghunter
.
[15]Johannes Dahse and Thorsten Holz. Static detectionof second-order vulnerabilities in web applications. InUSENIX Security 14
, 2014.
[16]Johannes Dahse, Nikolai Krein, and Thorsten Holz.Code reuse attacks in PHP: automated POP chain gener-ation. InConference on Computer and CommunicationsSecurity (CCS)
, 2014.
[17]Ruian Duan, Omar Alrawi, Ranjita Pai Kasturi, Ryan El-der, Brendan Saltaformaggio, and Wenke Lee. Towardsmeasuring supply chain attacks on package managersfor interpreted languages. InNetwork and DistributedSystem Security Symposium (NDSS)
, 2021.
[18]Stefan Esser. Utilizing Code Reuse/ROP in PHP Ap-plication Exploits.Proceedings of the Black Hat USA,2010.
[19]François Gauthier, Behnaz Hassanshahi, and AlexanderJordan. AFFOGATO: runtime detection of injectionattacks for node.js. InInternational Symposium on Soft-ware Testing and Analysis (ISSTA)
, 2018.
[20]Language-Based Security group at KTH Royal Insti-tute of Technology. Server-side prototype pollutiongadgets.https://github.com/KTH-LangSec/ser
ver-side-prototype-pollution
, 2024.
[21]Gareth Heyes. Server-side prototype pollution: Black-box detection without the dos.https://portswigge
r.net/research/server-side-prototype-pollu
tion
.
[22]Philipp Holzinger, Stefan Triller, Alexandre Bartel, andEric Bodden. An in-depth study of more than ten yearsof java exploitation. InConference on Computer andCommunications Security (CCS)
, 2016.
[23]Jordan Jueckstock and Alexandros Kapravelos. Visi-bleV8: In-browser Monitoring of JavaScript in the Wild.InProceedings of the ACM Internet Measurement Con-ference (IMC)
, October 2019.
[24]Zifeng Kang, Song Li, and Yinzhi Cao. Probe the proto:Measuring client-side prototype pollution vulnerabili-ties of one million real-world websites. InNetwork andDistributed System Security Symposium (NDSS 2022),2022.
[25]Rezwana Karim, Frank Tip, Alena Soch	urková, andKoushik Sen. Platform-independent dynamic taint anal-ysis for javascript.IEEE Transactions on Software En-gineering
, 46(12), 2020.
[26]Hee Yeon Kim, Ji Hoon Kim, Ho Kyun Oh, Beom JinLee, Si Woo Mun, Jeong Hoon Shin, and KyounggonKim. Dapp: automatic detection and analysis of proto-type pollution vulnerability in Node.js modules.Inter-national Journal of Information Security
, 2021.
[27]Sebastian Lekies, Krzysztof Kotowicz, Samuel Groß,Eduardo A. Vela Nava, and Martin Johns. Code-reuseattacks for the web: Breaking cross-site scripting miti-gations via script gadgets. InConference on Computerand Communications Security (CCS)
, 2017.
[28]Sebastian Lekies, Ben Stock, and Martin Johns. 25million ows later: large-scale detection of DOM-basedXSS. InConference on Computer and CommunicationsSecurity (CCS)
, 2013.
[29]Song Li, Mingqing Kang, Jianwei Hou, and Yinzhi Cao.Detecting Node.js prototype pollution vulnerabilitiesvia object lookup analysis. InProceedings of the 29thACM Joint Meeting on European Software Engineer-ing Conference and Symposium on the Foundations ofSoftware Engineering
, ESEC/FSE 2021, 2021.
[30]Song Li, Mingqing Kang, Jianwei Hou, and Yinzhi Cao.Mining Node.js vulnerabilities via object dependencegraph and query. InUSENIX Security Symposium, 2022.[31]Zhengyu Liu, Kecheng An, and Yinzhi Cao. Undened-oriented programming: Detecting and chaining proto-type pollution gadgets in node. js template engines formalicious consequences. In2024 IEEE Symposiumon Security and Privacy (SP). IEEE Computer Society,2024.
[32]William Melicher, Anupam Das, Mahmood Sharif, LujoBauer, and Limin Jia. Riding out DOMsday: Towarddetecting and preventing DOM cross-site scripting. InNDSS 2018
, 2018.
[33]Alvaro Muñoz and Oleksandr Mirosh. Friday the 13thjson attacks.
Proceedings of the Black Hat USA
, 2017.
[34]Alvaro Muñoz and Christian Schneider. Serial killer:Silently pwning your java endpoints, 2018.
[35]Benjamin Barslev Nielsen, Behnaz Hassanshahi, andFrançois Gauthier. Nodest: feedback-driven static anal-ysis of node.js applications. InJoint Meeting on Eu-ropean Software Engineering Conference and Sympo-sium on the Foundations of Software Engineering, (FSE),2019.
[36]OASIS. Static analysis results interchange format (sarif)version 2.1.0.https://docs.oasis-open.org/sa
rif/sarif/v2.1.0/sarif-v2.1.0.html
.

--- page 34 ---

3708 33rd USENIX Security Symposium
USENIX Association

--- page 35 ---

[37]Sunnyeo Park, Daejun Kim, Suman Jana, and SooelSon. FUGIO: automatic exploit generation for PHPobject injection vulnerabilities. In31st USENIX SecuritySymposium, USENIX Security 2022, Boston, MA, USA,August 10-12, 2022
.
[38]Sebastian Roth, Michael Backes, and Ben Stock. As-sessing the impact of script gadgets on CSP at scale.InAsia Conference on Computer and CommunicationsSecurity, (ASIA CCS)
, 2020.
[39]D. Schoepe, M. Balliu, B. C. Pierce, and A. Sabelfeld.Explicit secrecy: A policy for taint tracking. InEu-roS&P
, 2016.
[40]Edward J. Schwartz, Thanassis Avgerinos, and DavidBrumley. All you ever wanted to know about dynamictaint analysis and forward symbolic execution (but mighthave been afraid to ask). In
IEEE S&P
, 2010.
[41]Koushik Sen, Swaroop Kalasapur, Tasneem Brutch, andSimon Gibbs. Jalangi: A selective record-replay anddynamic analysis framework for javascript. InProceed-ings of the 37th IEEE/ACM International Conference onAutomated Software Engineering, ASE '22, New York,NY, USA, 2013.
[42]Mikhail Shcherbakov and Musard Balliu. SerialDe-tector: Principled and Practical Exploration of ObjectInjection Vulnerabilities for the Web. In28th AnnualNetwork and Distributed System Security Symposium,NDSS 2021, virtually, February 21-25, 2021
, 2021.
[43]Mikhail Shcherbakov, Musard Balliu, and Cristian-Alexandru Staicu. Silent spring: Prototype pollutionleads to remote code execution in node.js. In32ndUSENIX Security Symposium, USENIX Security 2023,Anaheim, CA, USA, August 9-11, 2023. USENIX Asso-ciation, 2023.
[44]Mikhail Shcherbakov, Paul Moosbrugger, and MusardBalliu. Unveiling the invisible: Detection and evaluationof prototype pollution gadgets with dynamic taint anal-ysis. InProceedings of the ACM on Web Conference2024, WWW '24, New York, NY, USA, 2024. Associa-tion for Computing Machinery.
[45]Cristian-Alexandru Staicu, Michael Pradel, and Ben-jamin Livshits. SYNODE: understanding and auto-matically preventing injection attacks on Node.js. InNetwork and Distributed System Security Symposium(NDSS)
, 2018.
[46]Cristian-Alexandru Staicu, Daniel Schoepe, Musard Bal-liu, Michael Pradel, and Andrei Sabelfeld. An empiricalstudy of information ows in real-world JavaScript. In14th ACM SIGSAC Workshop on Programming Lan-guages and Analysis for Security, PLAS
, 2019.
[47]Marius Steffens. Understanding emerging client-sideweb vulnerabilities using dynamic program analysis.2021.
[48]Ben Stock, Martin Johns, Marius Steffens, and MichaelBackes. How the web tangled itself: Uncovering thehistory of client-side web (in)security. In26th USENIXSecurity Symposium, USENIX Security 2017, Vancouver,BC, Canada, August 16-18, 2017. USENIX Association,2017.
[49]Feng Xiao, Jianwei Huang, Yichang Xiong, GuangliangYang, Hong Hu, Guofei Gu, and Wenke Lee. Abusinghidden properties to attack the Node.js ecosystem. InUSENIX Security Symposium
, 2021.
[50]YesWeHack. Server side prototype pollution, how todetect and exploit.https://blog.yeswehack.com/t
alent-development/server-side-prototype-p
ollution-how-to-detect-and-exploit/
.
[51]Markus Zimmermann, Cristian-Alexandru, Cam Tenny,and Michael Pradel. Small world with high risks: Astudy of security threats in the npm ecosystem. InUSENIX Security Symposium
, 2019.
A Appendix
1
let
__pollutedValue = '0xEFFACED ',
__accessIndex = 0;
2
Object.defineProperty(Object.prototype , '${prop
}', {
3
get:
function
() {
4
const
returnValue = __pollutedValue +
__accessIndex;
5
__accessIndex += 1;
6
try
{
7
throw new
Error();
8
}
catch
(error) {
9
globalThis.log(returnValue + ' source stack:
' + error.stack);
10
}
11
return
returnValue;
12
},
13
set:
function
(newValue) {
14
Object.defineProperty(
this
, '${prop}', {
15
value: newValue ,
16
writable:
true
,
17
enumerable:
true
,
18
configurable:
true
19
});
20
},
21
enumerable: ${prop === FORIN_SYMBOL ? "true" :
"false"},
22
configurable:
true
,
23
});
Listing 9: Injected snippet for polluting with a string value.

--- page 36 ---

USENIX Association
33rd USENIX Security Symposium 3709

--- page 37 ---

GadgetPropertiesAttack Typecluster.forkNODE_OPTIONSACEcp.execNODE_OPTIONSACEcp.execFileNODE_OPTIONSACEcp.execFileSyncshell
,
NODE_OPTIONSACEshell
,
inputACEuidPEgidPEcwdPTcp.execSyncNODE_OPTIONSACEinputACEcp.forkNODE_OPTIONSACEcp.spawnshell
,
NODE_OPTIONSACEuidPEgidPEcwdPTcp.spawnSyncshell
,
NODE_OPTIONSACEshell
,
inputACEuidPEgidPEcwdPTcrypto.privateEncryptpaddingCDcrypto.publicEncryptpaddingCDcrypto.subtle.encryptktySegfaultcrypto.publicKey.exportktySegfaultcrypto.privateKey.exportktySegfaultcrypto.createPrivateKeytypeSegfaultpassphraseSegfaultcrypto.createPublicKeytypeSegfaultpassphraseSegfaultfetchsocketPath
,
body
,
method
,
referrerSSRFfs.createWriteStreammodePEhttps.gethostname
,
headers
,
method
,
path
,
port
,
NODE_TLS_REJEC...SSRFhttps.requesthostname
,
headers
,
method
,
path
,
port
,
NODE_TLS_REJEC...SSRF0Segfaulthttp.gethostname
,
headers
,
method
,
path
,
portSSRFhttp.requesthostname
,
headers
,
method
,
path
,
portSSRFhttp.Server.listenbacklogSegfaultimportsourceACErequire (v18.13.0)mainACESocket.sendaddressSSRFstream.DuplexreadableObjectModeSegfaulttls.TLSSocket.connectpathSegfaultvm.SyntheticModulesourceText
,
lineOffset
,
columnOffsetACEzlib.createGzip().writewritableObjectModeSegfaultTable 5: A summary of the exploitable rst-order gadgets inNode.js.Gadgetidenties the public API that triggers a gadget;Propertiesspecies whichproperties must be polluted;Attack Typespecies one of Arbitrary Code/-Command Execution (ACE), Cryptographic Downgrade (CD), Path Traversal(PT), Privilege Escalation (PE), Server Side Request Forgery (SSRF), or Seg-fault.GadgetPropertiesAttack Typefetchbody
,
headers
,
method
,
0SSRFWorkerenvPEffiPEhrtimePEnetPEreadPErunPEsysPEwritePEDeno.makeTempDirdirPTprefixPTDeno.makeTempDirSyncdirPTprefixPTDeno.makeTempFiledirPTprefixPTDeno.makeTempFileSyncdirPTprefixPTDeno.mkdirmodePEDeno.mkdirSyncmodePEDeno.openappendUMmodePEtruncateUMDeno.openSyncappendUMmodePEtruncateUMDeno.writeFileappendUMmodePEDeno.writeFileSyncappendUMmodePEDeno.writeTextFileappendUMmodePEDeno.writeTextFileSyncappendUMmodePEDeno.runcwdPTgidPEuidPEDeno.CommandcwdPTgidPEuidPEcp.execshell
,
envACEcp.execFileSyncshell
,
envACEcp.execSyncshell
,
envACEcp.spawnshell
,
envACEgidPEuidPEcp.spawnSyncshell
,
envACEfs.appendFilelengthLoopoffsetOOMfs.writeFilelengthLoopoffsetOOMhttp.requesthostname
,
method
,
path
,
portSSRFhttps.requesthostname
,
method
,
path
,
portSSRFzlib.createBrotliCompressparamsPanicjson.JsonStringifyStreamprefixUMsuffixUMlog.FileHandlerformatterLPtar.Tar.appendgidPEuidPEyaml.stringifyindentOOMTable 6: A summary of the exploitable rst-order gadgets inDeno.Gadgetidenties the public API that triggers a gadget;Propertiesspecies whichproperties must be polluted;Attack Typespecies one of Arbitrary Code/-Command Execution (ACE), Log Pollution (LP), Loop, Out of Memory(OOM), Panic, Path Traversal (PT), Privilege Escalation (PE), Server SideRequest Forgery (SSRF), or Unauthorized Modications (UM).

--- page 38 ---

3710 33rd USENIX Security Symposium
USENIX Association

--- page 39 ---

+-.011222333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333322210/-,*+,-.//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////..-,*
