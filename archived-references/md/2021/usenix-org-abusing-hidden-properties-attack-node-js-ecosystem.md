---
type: Article
title: Abusing Hidden Properties to Attack the Node.js Ecosystem
resource: "https://www.usenix.org/conference/usenixsecurity21/presentation/xiao"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:24:58+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity21/presentation/xiao"
    title: Abusing Hidden Properties to Attack the Node.js Ecosystem
    author: Feng Xiao, Jianwei Huang, Yichang Xiong, Guangliang Yang, Hong Hu, Guofei Gu, Wenke Lee
  - id: capture
    resource: "https://web.archive.org/web/20211025160957/https://www.usenix.org/conference/usenixsecurity21/presentation/xiao"
also_at:
  - "https://www.usenix.org/system/files/sec21-xiao.pdf"
  - "https://www.usenix.org/system/files/sec21fall-xiao.pdf"
  - "https://www.usenix.org/system/files/sec21_slides_xiao.pdf"
authors:
  - Feng Xiao
  - Jianwei Huang
  - Yichang Xiong
  - Guangliang Yang
  - Hong Hu
  - Guofei Gu
  - Wenke Lee
canonical_url: ""
cited_by:
  - "2021.md:58"
commit: ""
content_sha256: 11910e80ee8d215507238e26457210c4d82f378642012865bb94890ba694acf7
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity21/presentation/xiao"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: b443b6a2dcfc8447fb98ab0bbe158c1a8fd318596360f1382f73d521208e5365
retrieved_from: "https://www.usenix.org/system/files/sec21-xiao.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:24:58+00:00"
slug: usenix-org-abusing-hidden-properties-attack-node-js-ecosystem
snapshot: 20211025160957
title_english: ""
translation_file: ""
translation_of: ""
---

# Abusing Hidden Properties to Attack the Node.js Ecosystem

**Abusing Hidden Properties to Attack the Node.js Ecosystem** - Feng Xiao, Jianwei Huang, Yichang Xiong, Guangliang Yang, Hong Hu, Guofei Gu, Wenke Lee, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity21/presentation/xiao>
- Also published at: <https://www.usenix.org/system/files/sec21-xiao.pdf>
- Also published at: <https://www.usenix.org/system/files/sec21fall-xiao.pdf>
- Also published at: <https://www.usenix.org/system/files/sec21_slides_xiao.pdf>
- Preserved from: https://www.usenix.org/system/files/sec21-xiao.pdf (live) on 2026-08-19
- Capture timestamp: 20211025160957
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Abusing Hidden Properties to Attack the Node.js Ecosystem

--- page 1 ---

Abusing Hidden Properties to Attack the Node.js Ecosystem
Feng Xiao Jianwei Huang
y
Yichang Xiong

Guangliang Yang
Hong Hu
z
Guofei Gu
y
Wenke Lee
GeorgiaTech
y
Texas A&M
z
PennState

Independent
AbstractNowadays, Node.js has been widely used in the developmentof server-side and desktop programs (e.g., Skype), with itscross-platform and high-performance execution environmentof JavaScript. In past years, it has been reported other dynamicprogramming languages (e.g., PHP and Ruby) are unsafe onsharing objects. However, this security risk is not well studiedand understood in JavaScript and Node.js programs.In this paper, we ll the gap by conducting the rst system-atic study on the communication process between client- andserver-side code in Node.js programs. We extensively identifyseveral new vulnerabilities in popular Node.js programs. Todemonstrate their security implications, we design and de-velop a novel feasible attack, named hidden property abusing(HPA). Our further analysis shows HPA attacks are subtlydifferent from existing ndings regarding exploitation andattack effects. Through HPA attacks, a remote web attackermay obtain dangerous abilities, such as stealing condentialdata, bypassing security checks, and launching DoS (Denialof Service) attacks.To help Node.js developers vet their programs against HPA,we design a novel vulnerability detection and vericationtool, namedL
YNX, that utilizes hybrid program analysis toautomatically reveal HPA vulnerabilities and even synthesizeexploits. We applyL
YNXon a set of widely-used Node.jsprograms and identify 15 previously unknown vulnerabilities.We have reported all of our ndings to the Node.js community.10 of them have been assigned with CVE, and 8 of them arerated as “Critical” or “High” severity. This indicates HPAattacks can cause serious security threats.
1 IntroductionNode.js is a cross-platform and high-performance executionenvironment for JavaScript programs. It has been widely usedto develop server-side and desktop applications such as Skype,Slack, and WhatsApp [7,16]. According to a recent study [17],Node.js is the most widely-used technology among all kindsof developments for three years (2017-2019).The prominence of Node.js makes its security critical.Specically, once a widely-used module is found to be vul-nerable, a huge number of Node.js applications may be im-pacted due to the heavy reuse phenomenon [49]. By exploitingthese vulnerabilities, remote attackers may abuse powerfuland privileged APIs inside vulnerable server-side applicationsto launch severe attacks, like stealing condential data orexecuting arbitrary malicious code [23,29,37,38,43,44,49].Node.js programs are built in the dynamic programminglanguage – JavaScript. In the past few years, several dynamiclanguages, like PHP [28] and Ruby [14], suffer from a com-mon security risk CWE-915 [9], where an internal objectattribute is improperly modied by untrusted user input. De-spite the severe security consequence, this issue is not wellstudied and understood in JavaScript and Node.js programs.In this paper, we conduct the rst systematic study on theobject sharing and communication process between client-and server-side code in Node.js programs. We conrm that theabove security risk also exists in JavaScript and Node.js pro-grams. To demonstrate the security implications, we designa novel attack, namedhidden property abusing(HPA), thatenables remote web attackers to obtain dangerous abilities,such as stealing condential data, bypassing security checks,and launching denial-of-service attacks. Our further analysisshows HPA differs from existing ndings on PHP [28] andRuby [14] in many aspects such as exploitation and attackeffects (see more details in §3.4).An HPA attack example is shown in Figure 1. As the gureshows, a remote web attacker sends well-crafted JSON datawith an extra and unexpected property “I2” (calledhiddenproperty) to the target Node.js server program. Then, the vic-tim program deals with the malicious input payload as normal.Finally,I2propagates to an internal object. As indicated bythe red line,I2of input overwrites and replaces a key propertyof the victim internal object with the conicting name. Thus,the attacker may abuse the propagation process (i.e., propertypropagation) of a hidden property to powerfully manipulatecritical program logic associated with the compromised prop-erty, such as directly calling privileged APIs by assigningI2

--- page 2 ---

USENIX Association
30th USENIX Security Symposium 2951

--- page 3 ---

Figure 1: An example of HPA.
of input with the proper value (i.e., "admin").Our analysis shows that the victim property can be of anytype, such as critical functions or key program states. Due tothis feature, input validation cannot stop attackers launchingHPA attacks, as they may disable the validation logic by over-writing critical states or removing all security checks [24,32].We nd this attack scenario is very common in practice.To help Node.js developers detect and verify the emergingHPA issues in their Node.js applications and modules, we de-sign and implement a vulnerability detection and vericationtool, namedL
YNX
1.L
YNXcombines the advantages of staticand dynamic analysis to track property propagation, identifyhidden properties, and generate corresponding concrete ex-ploits for the verication purpose. We are releasing the sourcecode of L
YNX
at
https://github.com/xiaofen9/Lynx
.We evaluateL
YNXby applying it on 102 real Node.js ap-plications and modules widely used in practice. As a conse-quence,L
YNXuncovered 15 previously unknown vulnerabili-ties. We have made responsible disclosure of the discoveredvulnerabilities. By the time of paper writing, we have got 10CVEs assigned; 8 of them are rated as critical or high severityby NVD (National Vulnerability Database); 7 vulnerabilitieshave been patched by their vendors. This indicates HPA at-tacks can cause serious security threats. We are collaboratingwith Node.js community to mitigate HPA. We rst help anauthoritative public vulnerability database create a new notionto describe the new type of vulnerabilities. In addition, wepropose three potential HPA mitigation, with more details in§A.1.
In summary, we make the following contributions:
•We present thehidden property abusingattack againstNode.js applications, and demonstrate its severe securityconsequences.
•We design and implementL
YNX, a tool that automati-cally detects HPA issues and synthesizes exploits.
•Our evaluation reveals real-world HPA issues that canlead to serious security impacts.
2 Background
Node.js and its runtime engine.Node.js is used for ex-ecuting JavaScript code outside of browsers. Many event-driving servers/middlewares and traditional web applicationsare deployed in Node.js. To interpret and execute JavaScript,1
The lynx is a type of wildcat. In Greek myths, it is believed that lynxes
can see what others can't, and its role is revealing hidden truths.Node.js implements a runtime engine based on Chrome's V8JavaScript engine [19]. To satisfy the needs of server-sideapplication scenarios, the engine provides a set of APIs tolet JavaScript interact with host environment. With providedAPIs, the JavaScript code can perform sensitive operationssuch as le operations.However, Node.js does not enforce isolation to separatethe application from host environment. Thus, serious securityissues might be introduced if certain internal states of theNode.js application are compromised.
Object sharing.Most Node.js programs are deployed asweb-based applications according to the ofcial Node.js sur-vey [1]. Similar to traditional web applications in other lan-guages (e.g., PHP), network protocols like HTTP(S) and Web-Sockets are widely-used to exchange data between users andthe application.In the Node.js ecosystem, it is a common feature for ap-plications to convert received data into an object (i.e., dataserialization). With the help of this feature, Node.js appli-cations can send/receive a very complex data structure. Ac-cording to our investigation on npm, different programs areusing distinct methods/code implementations to share objects.Currently, most programs share objects via JSON serializa-tion or query-string serialization (more discussion in §4.4.1),while other channels may also be used such as HTTP headers(user-agent [18] and cookies [4]).
3 Hidden Property AbusingIn this section, we present the details of HPA attacks. First,we dene our threat model. Next, we walk through a real-world example to demonstrate HPA. Then, we dene thevulnerable behaviors and the associated attack vectors. In theend, we discussed the differences between HPA and otherrelated attacks.
3.1 Threat ModelWe assume that Node.js applications and modules are benignbut vulnerable. In addition, we assume the target applicationcorrectly implements object sharing (i.e., data deserialization).In this setting, a remote web attacker aims to compromisethe vulnerable server-side program using HPA. To exploit thevulnerability, the attacker sends a well-crafted payload to thevictim application through the legitimate interfaces. Whenthe malicious payload reaches the victim application, it istreated as normal data and dealt with as regular. Due to thelack of strict isolation between input and internal objects, themalicious payload is propagated to the internal objects of thevulnerable Node.js module. Finally, a critical internal objectis corrupted and the attack is launched.

--- page 4 ---

2952 30th USENIX Security Symposium
USENIX Association

--- page 5 ---

Figure 2: The attacker leverages HPA to bypass input vali-dation and attack sensitive services behind (For illustrationpurpose, we use a database service as the attack target).
3.2 Running ExampleTo illustrate the HPA attack, we walk through a real-worldexploit found in the high-prole Node.js framework “routing-controller” [13] (63,000+ monthly downloads on npm). In thisexample, we demonstrate although this vulnerable frameworkenforces a global input validation for unsafe external data, anattacker can still leverage HPA attacks to tamper its validationlogic and introduce arbitrary malicious payloads.Figure 2 shows the attack details. In the rst step, theattacker adds an additional property (i.e., hidden property)constructor:falseto the input object when accessing theauthentication web APIlogin()of the victim framework.Upon being called, the authentication module will instantiatean object namedparamand sends it to the parameter handler,which is responsible for validating user input. To this end,functiontransform()in the gure builds a validation candi-date by mergingparamwith the format specication objectschema. As indicated in the second step, when building sucha candidate, the hidden propertyconstructor:falsefurtherpropagates into the internal object
schema
.The above propagation process enables the attacker to dis-able the input validation logic by hijacking the inheritancechain ofconstructor. In JavaScript, every object has a link toa prototype object. When the program wants to access a prop-erty of an object, the property will not only be searched on theobject but on the prototype of the object, and even the proto-type of the prototype, until a property with a matching nameis found. As a result, every object has many inherited proper-ties besides its own properties. However, such an inheritancechain can be hijacked if there is a conicting name propertylocating at a higher level of the searching tree (Note that thehijacking process differs from prototype pollution [12]. Moredetails will be discussed at §3.3). In the third step, functionvalidate()checks all the properties within the candidate tosee if the input object is legitimate or not.validateinternallyinvokes functiongetSchema()to extract the format specica-tion fromcandidate. However, because of the hijack, func-tiongetSchema()accesses the forgedconstructor(pointedby the red dashed line) rather than the real one (pointed by theblack dashed line). As a result, the nal format object usedfor validation is controlled by the attacker through the hiddenproperty. To bypass the input validation, the attacker onlyneeds to setformatto an invalid value such as false. Finally,as indicated in the fourth step, the attacker can let a maliciousemailpass the validation and further performs SQL Injectionattacks against the database module.
3.3 Attack VectorsAs demonstrated in §3.2, a remote attacker can propagate ahidden property to tamper certain internal states. In general,there are two typical attack vectors. The rst one is calledapp-specic attribute manipulation, which involves tamperingcertain internal properties dened by the application develop-ers. The second one is prototype inheritance hijacking, whichhijacks the prototype inheritance chain. It is worth noting thatour second attack vector is different from existing attacks,like prototype pollution [12]. Prototype pollution requiresthe modication of the prototype. However, as shown in therunning example, the attacker of HPA does not need to tamperthe prototype.
App-specic attribute manipulation.This attack vector tar-gets the vulnerable code that falsely exposes certain app-specic attributes (e.g., access right) to a user-controlled ob-ject. As shown in Figure 1, theI2property is supposed to beinitialized and managed by internal functions. However, withHPA, attackers might propagate a same-name property to theinternal object, and thus access sensitive APIs. This attackvector can be used to abuse certain service such as order statusin large applications.
Prototype inheritance hijacking.This vector hijacks theprototype inheritance chain so that the attacker can trick thevulnerable program into referencing a user-controlled prop-erty rather than the one inherited from the prototype. Withthis vector, attackers may forge many built-in properties, andeven nested prototype properties (Two of our discovered vul-nerabilities are exploited using nested properties). In our run-ning example in §3.2, attackers forgeconstructor. If neces-sary, they can also forge other prototype properties such asconstructor.name. This vector is very useful because manyJavaScript developers tend to trust properties inherited fromprototype and make many security-sensitive decisions based
on them.
3.4 Comparing HPA with related attacksThe risks of improper modication of dynamic object at-tributes (CWE-915) have been identied in some dynamiclanguages such as Ruby and PHP. We are the rst to identifysuch risks in Node.js. Moreover, we nd HPA differs fromexisting vulnerabilities in multiple aspects.

--- page 6 ---

USENIX Association
30th USENIX Security Symposium 2953

--- page 7 ---

Table 1: Comparing HPA and Ruby mass assignment.Aspect Hidden Property Abusing Ruby Mass AssignmentAbused logics Object sharing Assignment
Payload Type Literal value/nested object Literal value
Capabilities Overwrite Overwrite/CreateTable 1 summarizes the difference between HPA and Rubymass assignment, a typical vulnerability resulting from CWE-915. First of all, they abuse different logics to pass payloads:HPA leverages the object sharing to pass malicious objectsinto the victim programs, while Ruby mass assignment abusesa framework-specic assignment feature to modify certainexisting properties on the left side of an assignment. Second,HPA can introduce hidden properties with either literal valueor nested objects while mass assignment payload is merelyliteral value. Third, since Ruby is a strong-typed language,mass assignment vulnerability cannot create new propertiesto the victim object. However, JavaScript is more exible andthus HPA can inject arbitrary properties to the victim objectand even allows hidden properties to propagate over severalvariables before they reach the target object. Our runningexample is such a case: the hidden propertyconstructorpropagates from the input object to the internal schema objectto attack the input validation logic.It is worth noting that vulnerabilities of CWE-915 are notdeserialization bugs (CWE-502 [5]). Specically, CWE-915is more narrowly scoped to object modication and does notnecessarily exploit the deserialization procedure. For instance,HPA does not attack the logics of object deserialization. In-stead, it aims at modifying the properties of internal objects.
4 L
YNX
Design and Implementation
4.1 DenitionsIn this section, we rst dene several important terms used inthe paper and then describe the problem we aim to address.
Hidden Property: Given a module, it contains an input objectO
inputand an internal objectO
internal. A hidden propertyP
hiddenexists inO
inputonly if all of the following threerequirements are satised:
•
P
hiddenbelongs toO
internaland it is referenced in themodule.
•
P
hiddenofO
internalcan be modied if a conictingproperty with the same name (i.e.,P
hidden) is added intoO
input
.
•
P
hiddenis not a default parameter ofO
input. This meansP
hiddenofO
inputis not initialized when the module isinvoked with default parameters
2
.To help describe the problem, we use“property carrier”to denote all the variables that carry hidden properties (includ-ing
O
internal
and
O
input
).2
Here “default parameters” means documented usage of the module
Harmful hidden property: A hidden property is consideredharmful if an attacker can abuse this property to introduce un-expected behaviors to the module. In this paper, we considerthe potential attack effects from the following three aspects:
•
Condentiality: The hidden property might lead to sen-sitive information leakage while being abused.
•
Integrity: The attacker could violate the consistency ortrustworthiness of a critical property in the module.
•
Availability: The attacker could violate the application'sexpectations for the property, leading to a denial-of-service attack due to an unexpected error condition.
4.2 Challenges and SolutionsWe aim to design and develop an end-to-end system that canautomatically and effectively detect the HPA security issueson the target Node.js programs. However, this is not a trivial
task due to the following two challenges.
C1.How to discover hidden properties for Node.js pro-grams?Existing techniques cannot perfectly solve this problem. Inparticular, static analysis can easily get the whole picture ofthe target program, but usually introduces high false positives,especially when dealing with points-to and callback issues.We nd such cases are very commonly faced in Node.js pro-grams. Dynamic analysis, like data ow tracking, is suitablefor 1) tracking input objects and their all propagation, andfurther 2) discovering and agging related property carriers,and treating their corresponding properties as potential hiddenproperties. However, in practice, we nd the dynamic track-ing often misses many critical execution paths and hiddenproperties, and thus causes false negatives.
Our Solution.We design a hybrid approach that leveragesthe advantages of both of dynamic and static analysis to dis-cover hidden properties. First, we utilize a lightweight labelsystem to dynamically track input objects and related prop-erties carriers, and dump all properties of properties carriersas a part of hidden property candidates. To discover as manyexecution paths as possible, especially critical paths, we recur-sively and extensively label input objects and test the targetprogram. Second, the above dynamic test inevitably causesfalse negatives. We nd in many cases, critical hidden proper-ties are still ignored even when the corresponding propertycarriers have been successfully agged (see more detail in§4.4). To mitigate the problem, we introduce static analysis bygreedily searching potentially ignored properties. Finally, wecollect results and obtain a list of hidden property candidates.C2.Among a large number of hidden properties, how todetermine which one is valuable and exploitable for at-tackers?

--- page 8 ---

2954 30th USENIX Security Symposium
USENIX Association

--- page 9 ---

Figure 3: L
YNX
Overview.We nd among the collected hidden property candidates, notall of them are valuable and exploitable for attackers. Manyof them do not even cause any attack consequence, and thusshould be ltered out. Furthermore, the corresponding valueof an identied hidden property often has specic require-ments and constraints. Therefore, given a hidden propertycandidate, attackers need to determine its harmfulness andcompute its corresponding value.
Our Solution.We leverage symbolic execution to exploreall related paths, collect path constraints, detect sensitive be-haviors, and nally generate exploits.
4.3 Design OverviewThe overview ofL
YNXarchitecture is shown in Figure 3. Asdiscussed in §4.2, our approach is two-fold. In the rst phase,L
YNXrst dynamically runs a label system for recursivelytracking input objects, and identifying as many property car-riers as possible. We implement the dynamic label system byinstrumenting the target Node.js code, and then executing theinstrumented code by triggering its APIs with regular inputdata (e.g., test cases). Then,L
YNXobtains hidden propertycandidates by collecting the above dynamic analysis resultsand applying static analysis to search ignored hidden proper-ties. In particular,L
YNXunitizes the necessary informationrecorded in the previous dynamic analysis step, analyzes AST(abstract syntax tree) of the target Node.js program, and de-tects the operations related to property access. Lastly, weprune the results based on our observations.In the second phase,L
YNXrst generates exploit templateswith detected hidden property candidates. Then,L
YNXrunssymbolic execution to reason the values of hidden propertiesand verify the corresponding harmfulness and attack conse-quences.
4.4 Identifying Hidden Properties
4.4.1 Discovering Property CarriersWe implement our dynamic analysis by instrumenting thetarget Node.js program. In this section, we rst present theinstrumentation details of labelling and tracking input, anddetecting property carriers. Then, we discuss how to driveand execute the instrumented code.
Labelling and Tracking Input.We add labels to allinput objects for tracking them. The newly added la-bel is a new property, which has a unique key-valuepair. For example, assuming the input objectO
input
=
{"email":"a@gmail.com"},L
YNXinstrumentsO
inputwitha new property. Hence, the new input objectO
0
inputis{"email":"a@gmail.com", unique_key: unique_value}
.This above simple label-adding process works whenO
inputhas a simple data structure. However, this method is notenough whenO
inputis complex. For example, whenO
inputhas multiple properties such asO
input
:
aandO
input
:
b, thesechild properties may propagate differently with distinct pro-gram states. If we only add one label forO
input, we will losetrack of all these child properties. Hence,L
YNXtraversesO
inputand recursively injects labels into different child prop-erties. For instance, consider the aboveO
inputwith two prop-erties,L
YNXinjects three different labels into the base ofO
input
,
O
input
:
a
, and
O
input
:
b
respectively.The labeling method outperforms classic data ow tracking(i.e., transparent tracking without changing input) in detectingproperty carriers since it better emulates the attack processof HPA. For example, there are cases that the tested programcontains a dispatcher which distributes the input by its type.When analyzing such cases,L
YNXwill modies the input inthe same way as the real attack process. If the modicationchanges the input type, the input may trigger another path.However, the classic method may still track the path for vanillainput. Hence, our method can more accurately pinpoint thereal execution paths that a real HPA payload may trigger.However, changing the original input may also bring nega-tive effects. For instance, assume there is a checking functionthat sanitizes a certain property of the input, ifL
YNXadds a la-bel to the property, the program may raise an error and exit. Tomitigate this problem,L
YNXapplies a one-label-at-one-timestrategy. In each round of analysis,L
YNXonly adds one labelto one of the properties, and then, repeats this step multipletimes for testing all properties and their child properties.
Identifying Property Carriers.After adding labels to theinput,L
YNXexecutes the program with the new input andobserves how the label property propagates. IfL
YNXndsthe label propagates to an internal object, it will mark the host-ing object as a property carrier. For this purpose, we instru-ment the target Node.js program by intercepting all variableread/write operations. When such an operation occurs on aninternal object,L
YNXrecursively examines all properties andchild properties of this object. If a label is detected, this objectwill be marked as a property carrier in the following form:h
O
;
L
;
S
i, whereOrecords the object name of property carrier,Lpoints to the JavaScript le that contains the detected object,andSrecords the visibility scope of the carrier. InL
YNX, “.”is used to represent the scope by concatenating different func-tion names. To differentiate function objects from variableobjects, we add special sufxes_funto function-type scopes.More details about the scope representation can be found in§A.2,

--- page 10 ---

USENIX Association
30th USENIX Security Symposium 2955

--- page 11 ---

Driving Dynamic Analysis.
L
YNXruns the instrumentedtarget Node.js program based on their types. More speci-cally, if the application is a web-based program (e.g., webapps),L
YNXdirectly runs it. If the target Node.js code is in aNode.js module,L
YNXneeds to embed it in a simple Node.jstest application. Then,L
YNXcalls the exposed APIs of thetarget Node.js module. However, in this case,L
YNXneeds tofeed the APIs with some proper input, which is often hard togenerate automatically. We mitigate this problem based onthe following observation: we nd most of Node.js modulesare released with use cases (45 out of 50 most depended-uponpackages on npm [11] have directly usable test cases). Hence,L
YNX
can directly use them to drive the analysis.For triggering APIs,L
YNXcurrently supports two typesof object sharing schemes. The rst is JSON serialization,which is also the most commonly used method. The secondmethod is query-string serialization. In the Node.js ecosystem,many request parsing modules also support transferring theURL query string to objects. For example, a request parsingmodule called qs (100M monthly downloads on npm) con-verts the query string into a single object (e.g., from?a=1&b=2to{a:1,b:2}).L
YNXdetects hidden properties in the querystring by recording and replaying web requests.
Running Example.To illustrate howL
YNXidenties prop-erty carriers, we revisit our running example. As indicated inFigure 4, the injected label property propagates in a path fol-lows the black dotted line. By tracking this ow,L
YNXiden-ties three property carriers (value,param, andobject) andrecords carrier entities for each of them. To give an exampleof the entity, we show how the entity ofobjectis synthesized:First, to getO,L
YNXchecks where the label property is identi-ed. In this case, the label property is identied from the baseofobject. As a result,L
YNXdirectly setsOto “object”. Sec-ond, to getL,L
YNXobtains the le path of the current script.Third, to getS,L
YNXextracts the visibility scope of the carrier.In this case, the carrier is found from an anonymous functionlocating from line 10 to line 22. Hence,L
YNXencodes thevisibility asanon.10_1.26_1_fun. Overall, the recorded entitywill be
h
object
;
script_path
;
anon.10_1.22_1._fun
i
.
4.4.2 Pinpointing Hidden Property CandidatesOur dynamic analysis can effectively detect property carriers.However, it inevitably has false negatives on detecting hiddenproperties. We nd in some cases important hidden propertiesare ignored even though the hidden property carriers havebeen uncovered. We mitigate the problem by applying staticanalysis as a complement. In this section, we rst discussthe reason why dynamic analysis has false negatives. Then,we present the design details of our static analysis. Last, wediscuss how to prune the analysis results.
Necessity of Static Analysis.To explain the weakness ofdynamic analysis, we use a dummy vulnerable code exampleListing 1 (abstracted from real code). In this example, thefunctionfoo()builds an internal variableconfbased on auser-controlled variableinput(line 2), which makesconfbecome a property carrier. The dynamic approach can capturepropertyA, but it will misspropertyBifconditionis not met.To address the issue,L
YNXimplements an intraproceduralstatic syntactic analysis that recognizes the indexing syntax,no matter if the actual code is executed or not.Listing 1
A example code vulnerable to HPA.1
function
foo (input){
2
var
conf =
new
Cong(input);
3
setA(conf.propertyA);
4
// other code
5
if
(condition){
6
conf.propertyB = getB();
7
}
8
return
conf;
9
}Extracting Hidden Property Candidates.Given a hiddenproperty carrier “<
O
;
L
;
S
>”,L
YNXrst identies it in thecorresponding AST (pointed byL).L
YNXsearches all theobject references within the visibility scope recorded inS.Finally,L
YNXpinpoints all the references that are child prop-erties ofOand marks them as hidden property candidates.Child properties are potential hidden properties due to thefollowing reason: A property carrierh
O
;
L
;
S
iis reported be-cause the label property can propagate to variableO. As aresult, it is possible that other properties underOcan also beforged/overwritten from the input. Note that not all the can-didates found here can always be manipulated using inputsdue to the greedy strategy. Hence,L
YNXwill use the nextcomponent to verify each candidate to ensure accuracy.Due to the dynamic feature of JavaScript, child propertiesmay be indexed in different ways. To improve the detectioncoverage of this module,L
YNXconcludes and recognizes thefollowing three indexing methods: (1) Static indexing: proper-ties indexed with a literal-type key (e.g.,obj.korobj['k']);(2) Function indexing: properties indexed with a built-infunction (e.g.,obj.hasOwnProperty('k')). (3) Dynamic in-dexing: properties indexed with a variable (e.g.,obj[kvar]).L
YNXrecognizes the rst two methods statically: it traversesthe AST to recover the indexing semantics. To recognize prop-erties in the third method,L
YNXextracts the actual value ofthekvarfrom previous execution traces. It is worth notingthat, sinceL
YNXrelies on previous dynamic execution tracesto support dynamic indexing, it cannot guarantee 100% cover-age. That is to say,L
YNXonly recognizes dynamic indexingproperties that are concretely indexed in the last step.
Running Example.Here we still use the example in Figure 4to illustrate how it works. Taking the carrierobjectat line11 as an example,L
YNXrst searches all its child propertyreferences within its visibility scope (the anonymous function

--- page 12 ---

2956 30th USENIX Security Symposium
USENIX Association

--- page 13 ---

from line 10 to line 22) and it detects that there exists a prop-erty reference (constructor) exactly at where the carrier isidentied. After nding this property,L
YNXneeds to furthercheck whether the input object can overwrite this property ornot. To this end,L
YNXchecks ifconstructoris a child prop-erty ofOor not. After this check is passed,L
YNXidentiesconstructor
as a hidden property candidate.
4.4.3 Pruning the ResultsAs described above, hidden property candidates are discov-ered. However, we nd some of them are known param-eters rather than unknown hidden properties. This is be-cause some Node.js modules implement optional parame-ters as properties of input objects. These documented prop-erties may also be extracted in the previous step. For ex-ample, an email module by default accepts input object like{"from": .., "to": ..}but also accepts more options suchas{"from": .., "to": .., "cc": ..}. It is apparent thatthese documented parameters are not the hidden properties.To correct the result, we introduce a context-based analyzerto automatically “infer” whether the identied property can-didate is a documented parameter or not. Our analysis is donebased on the following observation: documented parametersare usually processed together by a dispatcher (e.g., a seriesof if-else statements).Based on this observation, we divided the argument pro-cessing procedure into two classes: (1) The unused parametersand the used parameters (i.e., properties in original input) areprocessed by the same dispatcher. To deal with this case, theanalyzer records the used properties from arguments of theexposed API. Then, it pinpoints hidden property candidatesthat reside in the same dispatcher as used parameters. (2) Theunused parameters and the used parameters are processed bydifferent dispatchers. To detect such parameters, the analyzerexamines all the candidates to see if there are several candi-dates found from the same dispatcher. IfL
YNXdetects thatcertain candidates match any of the situations, it will removethem from the result.
4.5 Generating HPA ExploitsIn the previous component,L
YNXdiscovers the key name ofa hidden property. By injecting a property with such a key,the attacker may have changes overwriting/forging certain in-ternal objects. In this section, we leverage symbolic executionto reason if the discovered properties are exploitable or not.Given a hidden property candidate, we rst inject it into theinput to construct the test payload. Because its correspondingvalue is undetermined yet, we leave the value be symbolized.Then, to decide whether a hidden property is harmful or not,we explore as many paths as possible and pinpoint sensitivesinks along the uncovered paths.Figure 4: Illustrating the workow ofL
YNXwith a codesnippet from our running example in §3.2 (Code is simpliedfor demonstration purpose).
4.5.1 Generating Exploit TemplatesIn this step,L
YNXaims at generating the input data structurethat can reach the potentially vulnerable property. We denotesuch structures as exploit templates sinceL
YNXwill specifya symbolic value rather than a concrete value for the valueeld of each hidden property. To generate the template,L
YNXneeds to insert a property (with the discovered key name)at the right position of the input. To gure out the insertionposition (what eld of the input should be modied),L
YNXmaintains a map between the insertion location of the labeland the property carrier
O
.To illustrate, we reuse the example dis-cussed in §3.2: The original input is{"email":"aa@gmail.com", "passwd":"11"}. As dis-cussed,L
YNXneeds to gure out the insertion position:according to the mapping, any content added to the baseof the input will appear at the base ofobjectat line 11 inFigure 4. Then,L
YNXinserts a property namedconstructoraccording to the detected key name. Finally, the generatedtemplate is
{"email":"aa@gmail.com", "passwd":"11",
"constructor": SYMBOL}
.
4.5.2 Exploring Attack ConsequencesAfter generating the exploit template for each hidden propertycandidate,L
YNXstarts to analyze its potential security con-sequences. To this end,L
YNXrst symbolically executes thehidden properties to explore all possible paths. Then,L
YNXpinpoints sensitive sinks along the discovered paths to decidewhether a hidden property is harmful or not.According to the denition of harmful hidden property in

--- page 14 ---

USENIX Association
30th USENIX Security Symposium 2957

--- page 15 ---

Table 2: Sensitive sinks monitored by L
YNX
.Category
ID Sink ExampleCondentiality
C
1
sensitive database query The attacker leaks sensitive data from database by
methods manipulating the SQL. C
2
sensitive le system operation The attacker accesses condential les by abusing the
methods lesystem APIs.Integrity
I
1
Critical built-in properties and The attacker modies the built-in property
constructor
code execution APIs to abuse property-based type checks. I
2
Final results of the module The attacker manipulate sanitization results to bypass
invocation security checks.Availability
A
1
Global methods/variables The attacker overwrites login function to crash the
authentication service. A
2
Looping conditions The attacker introduce an innite loop to block the Node.js
event loop [29].§4.1, we conclude six sensitive sinks from three perspectives:condentiality, integrity, and availability. As shown in Table 2,different sinks are used for detecting different kinds of attackconsequences. In summary, sinks are implemented in twoways. The rst type is keyword-based sink. Based on ourobservations, certain parameters of sensitive APIs can be acommon sink for hidden properties. Hence, we collected alist of keywords by analyzing existing vulnerabilities reportedon known vulnerability database such as snyk vulnerabilityDB and npmjs security advisories. We made our best effort tocollect as many sensitive APIs as possible. Currently, the listcontains 24 sinks: 11 lesystem operation APIs, 9 databasequery methods and 4 code execution methods (The API listwill be released along with the source code ofL
YNX). Whilethe list may be not complete, it can be easily expanded overtime. Another type of sink is behavior-based sink. Many vul-nerabilities are highly dependent on the code context. Toidentify such vulnerabilities, we focus on the behaviors thatmay abuse the application logic. Currently,L
YNXhas coveredthe following three malicious behaviors. (1) Return value ma-nipulation. For vulnerabilities aiming at manipulating criticalstates,L
YNXchecks return values of the tested modules. Ifits return value is controllable to attackers,L
YNXags it asvulnerable. (2) Global variable tampering. IfL
YNXdetectsthat a hidden property can tamper certain global variable, itwill report it as a potential vulnerability. (3) Loop variable ma-nipulation. For vulnerabilities aiming at corrupting the serviceby causing an innite loop,L
YNXchecks looping conditionsto pinpoint whether they can be manipulated through hiddenproperties.After a sensitive sink is identied,L
YNXprepares proof-of-concept exploits which aim at verifying whether a sink isreachable for attack-controlled value. To collect exploit, weuse the input generated in the last step to re-executed the pro-gram. If the sink can be reached, the input is reported alongwith an attack indicator. The attack indicator is designed forhelping security analysts understand how the exploit affectsthe sink. For different sinks,L
YNXemploys different rules togenerate indicators. For keyword-based sinks,L
YNXrecordswhat type of contents that can reach the sensitive function-s/properties. For behavior-based sinks,L
YNXcompares exe-Algorithm 1
Attack Exploration AlgorithmRequire:
T
= a set of exploit templates for the vulnerable module
m
= the vulnerable module
Ensure:
PoC
=
¹
exp
;
ind
º
where
exp
i
is the exploit and
ind
i
is the corresponding
attack indicator.
1:
U
 fg
2:
for all
t
i
2
T
do
3:
paths
 
explore
¹
m
;
t
i
º
4:
P
 
P
[ f
paths
g
5:
end for
6:
for all
p
i
2
P
do
7:
if
has
_
sink
¹
p
i
º
then
8:
exp =
get
_
input
¹
p
i
º
9:
ind =
execute
¹
m
;
exp
º
10:
if
reach_sink(ind)
then
11:
PoC
 
PoC
[ f¹
exp
;
ind
ºg
12:
end if
13:
end if
14:
end forcution traces of attack input and benign input to pinpoint theexploitation impact. For example,L
YNXmonitors the changeof global objects to observe the exploitability of
A
1
.The whole attack exploration method is summarized inAlgorithm 1. The input to the search method is the testedprogrammand the set of exploit templatesTgenerated inthe previous step. The output of the method is the attackproof of concept denoted by¹
E
;
I
ºwhereEis the sets ofthe nal exploits andIis the corresponding attack effectindicators. In the rst phase of the algorithm, it collects thenew paths discovered during symbolic execution and extractsthe concrete input and the path intoU. In the second phase,the algorithm examines each pathP
i. After a sensitive sink isdetected, it will generate the corresponding exploit to reachthe sink. IfL
YNXdetects that the sink is reachable,L
YNXwill report both the exploitexpand the attack consequenceindicator
ind
.To demonstrate the entire process, we apply the al-gorithm to our running example. As shown Figure 4,L
YNXsymbolizes the hidden propertyconstructorinline 14. During the execution, two other variables are alsosymbolized due to the symbolic value propagation indicatedby the blue dotted line. By resolving the constraints forthe three symbolic values,L
YNXnds two possible paths

--- page 16 ---

2958 30th USENIX Security Symposium
USENIX Association

--- page 17 ---

(i.e., line 19 and line 21). Since the new path leads to thechange of nal module return (i.e., object or null), theexploitation hits
I
2. As a result,L
YNXconstructs an exploit{"email":SQLI, "passwd":"11", "constructor":false}(SQLIstands for a SQL Injection payload). After inputtingthe exploit to the program,L
YNXcollects the correspondingindicator: It detects that the return value can be changed bysetting the
constructor
to false.
4.6 ImplementationWe buildL
YNXas a Node.js application, and implement it byemploying several existing tools. In the rst analysis phase ofL
YNX(i.e., identifying hidden properties §4.4), we employJalangi [42] to instrument target Node.js code for implement-ing our label system. The instrumented Node.js code withlabels is dynamically executed to discover hidden propertycarriers (§4.4.1). We apply Esprima [6] to generate AST (Ab-stract Syntax Tree) for doing static analysis on identied prop-erty carriers and extracting hidden properties (§4.4.2). In thesecond analysis phase ofL
YNX(§4.5), we use ExpoSE [36] toperform symbolic execution for determining the harmfulnessof discovered hidden properties and generating exploits.To analyze web-based applications, we implement aproling-based pipeline that captures HTTP requests and gen-erates corresponding test cases.
5 EvaluationTo assess the security impacts of HPA, we applyL
YNXon aset of real Node.js applications and modules widely used inpractice. In the following sections, we discuss our evaluationresults with three research questions:
•
RQ1: Are the hidden properties prevalent in widely-usedNode.js programs? (§5.2.2)
•
RQ2: CanL
YNXeffectively detect harmful hidden prop-erties and generate corresponding exploits? (§5.2.3)
•
RQ3: How do the discovered vulnerabilities and exploitsenlarge the attack surface of the Node.js ecosystem?(§5.3, §5.5)
5.1 Data SetNode.js has made great progress and there are already manyNode.js programs available. However, we nd a large numberof them are rarely used or do not match our threat model.Therefore, to reduce the workload of our analysis, we re-strict our data set collection process. In particular, we collectNode.js programs based on the following two criteria: (1) Thetested programs should be used to interacting with externalinput, and their APIs should accept objects (via either JSONor query-string serialization). (2) The tested programs shouldbe widely-used or continuously maintained.Table 3: Overall detection results. The numbers within theparentheses indicate the number of programs that containhidden properties. #PC, #HP, and #DA respectively denotethe number of property carriers, hidden property candidates,and detected documented arguments.CategoryTested ProgramsDetection Results#PC#HP#DADatabase9 (8)323780Input Validation48 (30)9991220User Functionalities34 (26)58415624Web11 (7)1269950To satisfy the rst criteria, we collect programs from cat-egories that are most likely to be exposed to input. Thesecategories include database, input validation, user functionali-ties, and web-based application/middileware. To satisfy thesecond criteria, we collect programs from known vendors(e.g., MongoDB), and projects that have at least 1000+ star onGithub or 500 monthly downloads on npm (To guarantee thevolume of our samples, we might slightly lower this criteriawhen all the popular programs have been selected).In total, we collected 102 Node.js programs as our analy-sis dataset. There are 91 Node.js modules and 11 web-basedprograms. Among the 11 web-based programs, 4 are mini-mal web frameworks/middlewares and 7 are complete webapplications.
5.2 Analysis Results
5.2.1 OverviewWe runL
YNXon a Ubuntu 18.04 machine equipped with IntelCore i5-9600K (3.70GHz) and 32 GB memory. In total, wedetected 451 hidden property candidates and conrmed 15previously unknown HPA vulnerabilities. By the timing ofwriting, 10 CVEs have been assigned for our ndings. Morethan half of them are rated as “Critical” and “High” severity3
by NVD (national vulnerability database).Among these vulnerabilities, two of them are identiedfrom complete web applications. The other 13 vulnerabilitiesare identied from modules, which in total impact 20,402dependent applications/modules. The Node.js communitypays great attention to our ndings. An authoritative pub-lic vulnerability database creates a new notion to track relatedvulnerabilities.
5.2.2 Phase#1: Identifying Hidden PropertiesTo answer RQ1 (Are hidden properties prevalent in popularNode.js programs?), we analyze how many (and what kindof) hidden properties are detected from widely-used Node.js
programs.Table 3 summarizes our detection results (Table 7 lists thecomplete detection results). In Table 3, from the second col-3The well-known heartbleed vulnerability was also rated as “High” sever-ity.

--- page 18 ---

USENIX Association
30th USENIX Security Symposium 2959

--- page 19 ---

Table 4: Exploit results of L
YNX
.CategoryReportedExploitableMissedDatabase221Input Validation742User Functionalities540Web111umn “Tested Programs”, we can observe that hidden proper-ties widely exist in all categories that are likely to be exposedto external input. Overall, 69% (70/102) tested programs arefound to contain hidden properties.The rst two columns under “Detection Results” indicatethe number of property carriers hidden property candidates.In total,L
YNXidenties 451 hidden property candidates byanalyzing 3175 property carriers. We can observe that hid-den property candidates widely exist in all categories of ourdataset. The last column under “Detection Results” showshow many candidates are identied as documented argumentsbyL
YNX. To gure out the correctness of our documentedargument inferring rules, we compare the documented argu-ments from their ofcial documentations with our results. wefound our context-based rules correctly recognize all docu-mented arguments from identied hidden properties.Note that we drive our analysis based on the types ofNode.js programs being tested. For the 91 npm modules,we directly reuse the use cases provided on their npm home-pages as the test input. For the remaining 11 web-based pro-grams, we manually interact with applications and generatetest cases with our proling-based pipeline.L
YNXanalyzesboth JSON and query-string serialization channels for web-base programs. 7 out of these 11 web-based programs supportboth query-string and JSON serializations (in different APIs).5.2.3 Phase#2: Exploring Attack ConsequencesWe assess the effectiveness (RQ2) ofL
YNXfrom the follow-ing two aspects: (1) DoesL
YNXeffectively pinpoint poten-tial vulnerabilities from programs of different categories? (2)DoesL
YNXsuccessfully generate exploits that can directlyor be easily ported to introduce real-world attack effects?Table 4 shows the summarized exploit result during the sec-ond phase. In this table, the columns “Reported” record howmany sensitive sinks are reported to be vulnerable byL
YNX.The column “Exploitable” indicates how many of reportedsinks thatL
YNXautomatically exploit and are manually con-rmed to be real vulnerabilities. From the two columns, wecan observe thatL
YNXis capable of pinpointing potentiallyvulnerable sinks from different types of programs. Moreover,the “quality” of reported issues are good. Overall, we found11 out of 15 reported vulnerabilities are conrmed to be vul-nerable, and the other 4 cases are considered to be harmless.Among the 4 cases, although some hidden properties do leadto certain sensitive sinks, they are still constrained by theprogram semantics and thus no signicant attack effects canbe introduced. For instance, whenL
YNXexploiting a hiddenproperty from a validation library, it causes an execution ex-ception and thus triggers sink
I2(nal result manipulation).However, since the exception is later handled by the program,it does not enable any attack effects such as validation bypass.The last column (“Missed”) of Table 4 records the hiddenproperties thatL
YNXsuccessfully detects (phase#1) but failsto generate usable exploits (phase#2). To nd out such hiddenproperties, we manually examine all hidden property candi-dates reported byL
YNX. There are three types of failures.First, some hidden properties have a particular constraint thatis not presented in the code semantics. For example, taffyDB(a popular JavaScript database) has a hidden property thatcan leak arbitrary data by forging as the internal index. How-ever, the constraint associated with the index is in the memoryrather than in the code. Thus,L
YNXcannot construct a validindex even though the index is in an easily-guessable format(e.g., T000002R000001). This kind of failure results fromthe limitation of symbolic execution. To cover such failures,fuzzing techniques may be a good complement to cover thepart that symbolic execution fails to analyze. We leave im-proving our symbolic execution as our future work.Another type of failures result from multi-constraint issues:To exploit some hidden properties, some parameters of theinput must be set to certain values. Such failures can be ad-dressed by extendingL
YNXto explore multiple variables (notonly hidden properties but also documented parameters) si-multaneously. The last type of failure comes from the syntaxincompatibility problem. The incompatibility results from thefact that our underlying instrumentation framework (Jalangi)is not compatible with certain grammars after ECMAScript 6.We mitigated this problem by down-compiling incompatibleprograms with Babel [3] or avoiding instrumenting incompati-ble code. To ease the process of addressing the incompatibility,we built an automatic down-compiling tool, which will bereleased together with L
YNX
.
5.3 Impact Analysis of Identied HPA Vulner-
abilitiesIn this section, we seek to answer RQ3 by understandinghow HPA vulnerabilities introduce serious attack effects intothe Node.js ecosystem. As shown in Table 5, we detected15 HPA vulnerabilities. To x these vulnerabilities, we havemade responsible disclosure and notied the vendors. Theyreacted immediately. So far 10 vendors have conrmed thevulnerabilities, and 7 of them have released correspondingpatches. Next, we will explain the security impacts of HPAfrom the following three perspectives.
Condentiality.We found that 4 of the identied vulnerabil-ities (i.e.,HP-1,HP-2,HP-3, andHP-14) impact condential-ity of the program (e.g., leaking sensitive information fromthe database). The vulnerabilitiesHP-1andHP-2are foundfrom two widely-used mongoDB drivers. By exploitingHP-1andHP-2, the attacker can force database to always return

--- page 20 ---

2960 30th USENIX Security Symposium
USENIX Association

--- page 21 ---

Table 5: Vulnerabilities detected by L
YNX
(C: Condentiality; I: Integrity; A: Availability).#IDProduct NameAffected APIDescriptionImpactAttack EffectsDisclosureDownloadsDependentsCIAstatusseverity1mongoosendOne()SQL Injection2,740,3419,2114Fixed (CVE1)Critical2mongoDB drivernd()SQL Injection6,165,0758,4354Fixed (CvE2)-3taffyDBquery APIsSQL Injection1,628,8601084Conrmed (CVE3)High4class-validatorvalidate()Bypass input validation1,077,9541,6394Conrmed (CVE4)Critical5jpvvalidate()Bypass input validation48114Fixed (CVE5)Medium6jpvvalidate()Bypass input validation48114ReportedMedium7valibhasValue()Bypass input validation47984Reported-8schema-inspectorvalidate()Bypass input validation35,7831044Fixed (CVE6)High9schema-inspectorsanitize()Bypass input validation35,7831044Fixed(CVE6)High10bson-objectidObjectID()ID forging142,5622984Fixed (CVE7)High11component-typetype()Type manipulation943,5551404Reported-12component-typetype()Type manipulation943,5551404Reported-13kind-ofkindOf()Type manipulation196,448,5744584Fixed (CVE8)High14cezeringetValidDocumentForUpdate()Order state manipulation1871–4Conrmed (CVE9)High15mongo-expressaddDocument()Denial of service6,965–4Fixed(CVE10)Mediumdata/true regardless of the correctness of query condition.This can be abused to leak sensitive information or bypassaccess control. For example, an attacker might log into otheruser's accounts by forcing the authentication result to be true(we will demonstrate a real-world case of this vulnerabilityin §5.5). The vulnerabilityHP-3is found from taffyDB. Thisis a serious universal SQL Injection that can be abused toaccess arbitrary data items in the database: It is found that ahidden property can forge as taffyDB's internal index ID. Ifan index ID is found in the query, taffyDB will ignore otherquery conditions and directly return the indexed data item.Moreover, the index ID is in an easily-guessable format (e.g.,T000002R000001), so that attackers can use this vulnerabil-ity to access any data items in the DB. VulnerabilityHP-12is found from cezerin, an eCommerce web application. Itis found that a hidden property can modify the critical datastored in database (i.e., payment status
ispaid
).
Integrity.We found that 10 of the identied vulnerabilities(i.e.,HP-4,HP-5,HP-6,HP-7,HP-8,HP-9,HP-10,HP-11,HP-12, andHP-13) compromise the integrity of Node.js applica-tions. 4 widely-used input validation modules are impactedby HPA. Our running example, class-validator (HP-4), allowsattackers to overwrite the format schema object, which leadsto the arbitrary input validation bypass. Jpv (HP-5andHP-6)checks the type of unsafe objects on the their prototype. How-ever, since HPA can modify properties in the prototype, thevalidation result of jpv can be manipulated. The other threevalidation bypass vulnerabilities are found from one API (HP-6) from valib and two APIs (HP-7andHP-8) from schema-inspector: By modifyinghasOwnPropertyfunction under theunsafe object's prototype, security checks can be skipped.Note that these three cases have limited exploit scenario: At-tackers needs to pass valid function denitions, which is nota widely supported feature [8].The other 4 vulnerabilities (HP-10,HP-11,HP-12, andHP-13) that impact program integrity are from user functionalitiesmodules. These 4 vulnerabilities are exploited in a similarway: By manipulating some critical properties under the inputobject, attackers can manipulate the nal result of the moduleinvocation. Such manipulation might introduce serious risk tothe application. For example, clone-deep, an object cloningmodule used in 1,822,028 projects according to Github, usesvulnerable kind-of (HP-13) to perform type checking beforecloning. If the variablevarto be cloned is detected asarray,clone-deep recursively calls itselfvar.lengthtimes to cloneall elements undervar. WithHP-13, a malicious object canforge as an array with a very largelength. When cloningsuch an object, clone-deep will go into a super big loop, andthus freeze the whole application (Time-consuming tasks canblock Node.js applications due to its single-thread model).
Availability.We found that the availability of 1 web frame-work (i.e.,HP-15) can be affected by HPA. This vulnerabilityis detected from mongo-express, a web-based application. Itis found that a hidden property can introduce an innite loopto the application, which blocks the whole application. Wewill include more details of the case in §5.5.
Community Impact.Our ndings have been corroborated bythe Node.js community. To help developers be aware of thisnew risk, we proposed a new notion should be used to describeand track related issues. An authoritative public vulnerabilitydatabase maintained by snyk has accepted the proposal andstarts using the notion in related security issues [10].
Remark.Based on the impact analysis, we posit that theHPA attack indeed enlarges the attack surface of the Node.js

--- page 22 ---

USENIX Association
30th USENIX Security Symposium 2961

--- page 23 ---

ecosystem. The claim is supported by the following two in-sights. (1) By establishing unexpected data dependencies tointernal objects in the application, the HPA attack effectivelycompromises previously unreachable program states and in-troduces different kinds of attack effects. (2) Classic defensetechniques (e.g., input validation) can not mitigate the HPA.As shown in Table 5, some widely-used validation modulesare vulnerable to the HPA attack.
5.4 Analysis Coverage and PerformanceWe measure the code coverage ofL
YNXfor each Node.jsprogram based on ExpoSE [36]'s coverage monitoring, whichcomputes `LoC being executed' / `total LoC in executed les'(dependencies not counted). We discuss our coverage mea-surement results below, based on the different types of testedNode.js programs: modules and web-based programs.For Node.js modules, the code coverage varies (i.e., 10%- 80%). While a large portion of modules achieve decentcoverage (more than 40%), we argue the code coverage doesnot necessarily indicate the effectiveness ofL
YNX: To ndpractical vulnerabilities, we selectively test APIs that matchour threat model (likely to be exposed to external user andaccepting objects). As a result, even though test cases areavailable for most APIs, we are not blindly testing all of them.For instance, if an API does not accept parameters at all,we will not include it into our test, and the code coveragecontribute by such API testing does not help us vetting HPAfrom tested programs.For web-based programs,L
YNXachieves 21% code cov-erage on average. We nd this is because web applicationsusually have a large number of functionalities/APIs, and ourproling-based testing may not cover all of them. To helpL
YNXdiscover more web APIs, incorporating active webscanners [2] could be a promising future work.Besides code coverage, we also measure the running timeof each phase. As an ofine tool,L
YNXachieves reasonableanalysis speed: For detecting hidden properties, it typicallytakes no more than 10 seconds to analyzing one API (90%cases). For very large programs such as web applications,the analysis may take more than 200 seconds per API (nomore than 10 cases). For exploiting hidden properties, it takeslonger time becauseL
YNXneeds to explore multiple pathsfor each candidate. Typically, it takes around 50 seconds perhidden property. Detailed results can be found at §A.3.
5.5 Case Studies
Accessing Condential User Data.
L
YNXreports a harmfulhidden property (_bsontype) from mongoDB Node.JS driver.This property is used to decide the query type and should notbe provided by input. However, it is found that mongoDBallows input to modify this property via HPA. Since mon-goDB handles query objects according to pre-dened types.Listing 2The online game is vulnerable to HPA because itcalls vulnerable mongoDB APIs to handle input.1
GameServer.loadPlayer =
function
(socket,id){
2
GameServer.server.db.collection(

players

).ndOne({
3
_id:
new
ObjectId(id)},
4
function
(err,doc){...}
5
});
6
};The attacker can specify an unknown_bsontype(e.g., aaa) toforce mongoDB not serializing certain objects. For example,this can be abused to force the query result to be always true(i.e., by not serializing the query ler). By exploiting thisvulnerability, an attacker can launch unauthorized access tocondential data in the mongoDB.To demonstrate one of the attack vectors, we use PhaserQuest, an online game that uses the vulnerable mongoDBdriver module. As shown in Listing 2, the program load-s/deletes user prole by a user-provided secret identier (id).By abusing the discussed vulnerability, the attacker can forcethe database to return a valid user regardless of the correctnessof the identifer. By doing this, the attacker can log in/deletearbitrary player's accounts.We have made responsible disclosure to MongoDB team.They has patched the vulnerability and acknowledged us attheir security advisories.
Blocking the event handler.Since Node.js is based on asingle-thread model, the availability of its event handler isvery critical and has been discussed a lot [29,37,43]. In thesecond case, we would like to demonstrate how HPA canattack the event handler and thus freeze the entire program.
L
YNXreports a harmful hidden property (toBSON) frommongo-express, a web-based mongoDB admin interface. Byabusing this property, an authenticated user issues a time-consuming task to block the event handler of Node.js. Asshown in the upper part of Listing 3, a hidden propertytoBSONis identied in line 3. By tracking the data ow of this property,we found that it reaches a sensitive sink [15] in line 12, whichis for executing code in a sandbox. Hence, the attacker canpass a time-consuming function (e.g., an innite loop) toblock the event handler.After receiving our vulnerability report, the project teamconrmed it immediately and added this issue to their securityadvisories. By the time of paper writing, we are workingtogether with them on the bug xing.
6 Discussion
Countermeasures.We conclude three major countermea-sures against HPA. For example, one of them is validatinginput objects. Since the rst step of HPA is injecting additionalproperties, removing unwanted (malicious) properties couldbe a feasible mitigation. Due to the page limit, more details

--- page 24 ---

2962 30th USENIX Security Symposium
USENIX Association

--- page 25 ---

Listing 3HPA impacts the availability of this program byattacking the unique single-thread model of Node.js.1
// code from bson module
2
if
(object.toBSON) {
3
object = object.toBSON();
4
}
5
6
// code from mongodb-query-parser module
7
const
SANDBOX =
new
SaferEval(FILTER_SANDBOX);
8
SANDBOX.runInContext(input);about the three approaches are discussed in Appendix§A.1.
Limitations.First of all,L
YNXneeds external input (i.e.,module test cases or user interactions on the web) to triggeranalysis. Since APIs of different modules/applications havedifferent context dependencies and parameter formats, it ishard to automatically infer and resolve these prerequisites. Forexample, during our evaluation, we found that we need to loginto the tested web program to access certain APIs. To addressthe issue, we have implemented a pipeline that automaticallyreplays and mutates API invocations. To test web-based pro-grams, security analysts just need to act like normal usersto perform interactions. In the future, we are considering in-troducing an automatic input format reasoning componenttoL
YNXto ease the input generation process. Second, likemany other dynamic analysis tools,L
YNXmay have falsenegatives. For example, it is possible that the test input we usedoes not explore all the branches of certain tested programs.To improve coverage, we can combineL
YNXwith fuzzingtechniques. Third, Lynx does not cover all input channels ex-isted in the Node.js ecosystem: In the ecosystem, differentprograms may use distinct methods/code implementationsto share objects, so it is difcult to systematically cover allchannels and it is not the focus of this paper. While we ac-knowledge that Lynx does not cover all input lines, it doescover the two most popular methods and can support a largenumber of programs. As future work, we are considering tosupport more input channels.
7 Related Work
7.1 Vulnerabilities of Node.js EcosystemRecently, researchers have discovered many security issues inthe Node.js ecosystem. Existing offensive research in Node.jscan be divided into two categories: attacks launching fromexternal users and attacks launching from internal modules.In the rst category, Ojamaa et al. [37] studies the securityof Node.js and discussed potential risks such as commandinjection attack. Synode [44] further studies command injec-tion attack and presents an automatic mitigation approach.Staicu et al. [43] show how ReDoS (regular expression denialof service) affects real Node.js websites. Davis et al. [29]identify and mitigate a new type of denial of service (DoS)attack, Event Handler Poisoning (EHP), which targets theevent-driven architecture of Node.js. Arteau et al. identifyprototype pollution [12] (PP), a security risk that tampersobject prototypes in Node.js applications. PP and HPA dif-fer from the following two aspects. (i) Attack behavior: PPintroduces attack effects by tampering one special kind ofJavaScript data type (prototype), while HPA does not mod-ify prototype. (ii) Exploit condition: The exploitation of PPrequires the attacker to explicitly assign a value to the pro-totype. For example, the codeobj[__proto__] = inputis vulnerable to PP whileObject.assign(obj, input)isnot. In addition, we can observe that data serialization is notnecessary for PP. However, HPA does not require prototypeassignment. In contrast, it passes the attack payload throughdata serialization. Because of these differences, the abovecounterexample of PP is vulnerable to HPA sinceinputmaycarry “hidden” properties and propagates them to
obj
.In the second category [23,38,49], researchers study howmalicious/buggy third-party modules impact the Node.js ap-plications. Brown et al. [23] detect and prevent binding-layerbugs in both server-side and browser-side platforms. Patraet al. [38] dene and classify JavaScript module conictsand propose ConictJS to detect such risks. Zimmermann etal. [49] present a large-scale study on the Node.js ecosystemand identify several weak spots in the ecosystem. In con-trast to these vulnerabilities, HPA does not require plantingmalicious code into the victim application.
7.2 Analysis of JavaScript CodeResearchers also developed tools to help detect JavaScriptbugs/vulnerabilities. Many existing analysis tools [25,31,34,36,38–40,45,47] are based on information ow analysis. Forexample, Stock et al. [47] propose dynamic taint tracking toprevent DOM-based XSS. Lekies et al. [34] propose a systemthat leverages byte-level dynamic taint tracking to detect andvalidate DOM-based XSS. Typedevil [39] performs variable-level information ow analysis to report inconsistent types.AlthoughL
YNXalso performs data ow analysis, it subtlydiffers from existing tools [39, 45] by using a new labelingand tracking method to analyzes HPA related data structures(e.g., property carriers). Arteau et al. proposes a fuzzing ap-proach to detect prototype pollution [12], which injects a staticpayload into the test input and ags vulnerabilities if any pro-totypes are modied. However, the fuzzer cannot be used todetect HPA because (1) HPA does not necessarily need tomodify the prototype so that the fuzzer will not report anyvulnerabilities; (2) Hidden properties are internal states withvarious random name variable (e.g.,_bsontype), so syntacticanalysis is essential when we want to extract these hiddenproperties. However, the fuzzer does not have the capabilityto extract these syntax information (The fuzzer only runs withthe xed input
__proto__
).There are also tools in other language platforms designed

--- page 26 ---

USENIX Association
30th USENIX Security Symposium 2963

--- page 27 ---

to detect security issues similar to HPA. Dahse et. al [28]proposed a static object-sensitive approach to detect PHPobjection injection. However, this approach cannot be usedto detect HPA: (1) The analysis is designed for analyzingobject-oriented code, and it relies on the object-oriented pro-gramming (OOP) semantics such asnew()to guide its analy-sis. However, many of our analysis targets are not OOP; (2)The approach focuses on exploiting potentially vulnerablemagic methods, while HPA does not have a correspondingsink. Cristalli et. al [26] proposed a sandbox-based approachfor preventing Java deserialization vulnerabilities. The pro-posed approach traces benign deserialization executions anddetects suspicious Java method invocation based on the pre-vious execution traces. Since HPA exploits logic bugs ratherthan arbitrary command execution bugs, this approach is notsuitable for mitigating HPA.
7.3 Security vulnerabilities of Browser-side
JavaScriptSecurity researchers also discovered many vulnerabilities thebrowser-side scripts. One of the most important classes ofbrowser-side vulnerabilities is Cross-site scripting (XSS) [27,30,33–35,41,46,48]. Recently, Lekies et al. [35] systemati-cally investigate and mitigate a class of vulnerability, Cross-Site Script Inclusion attack (XSSI). XSSI is a browser-side at-tack that can leak sensitive user data by including a script froman attacker-controlled domain. Fass et al. [30] propose Hi-deNoSeek, a general camouage attack that evades syntactic-based malware detectors. Steffens et al. [46] propose Persis-tent Client-Side XSS attack and investigate its severity onthe Web. Schewarz et al. [41] propose two new side-channelattacks in JavaScript to automatically infer host information.In contrast to related work, we focus on vulnerabilities in theserver-side Node.js programs.
8 ConclusionIn this paper, we conduct the rst systematic study on theobject sharing of Node.js programs and design a new attacknamed hidden property abusing. By exposing previously un-reachable program states to adversaries, the new attack en-larges the attack surface of Node.js. The new attack surfaceleads to the discovery of 15 zero-day vulnerabilities, all ofwhich can be exploited to introduce serious attack effects. Todetect HPA, we buildL
YNX, a novel vulnerability nding andverication tool that combines static and dynamic analysistechniques to pinpoint and exploit vulnerable internal objectsin Node.js programs. UsingL
YNXagainst 102 widely-usedNode.js programs, we show thatL
YNXcan effectively detectHPA vulnerabilities.
AcknowledgementWe would like to thank our paper shepherd Giancarlo Pelle-grino and the anonymous reviewers, for their insightful feed-back that helped shape the nal version of this paper. Wealso thank Yuhang Wu for his contribution during the earlystage of the project. This material was supported in part bythe Ofce of Naval Research (ONR) under grants N00014-17-1-2895, N00014-15-1-2162, N00014-18-1-2662 and N00014-20-1-2734, the Defense Advanced Research Projects Agency(DARPA) under contract HR00112090031, and the NationalScience Foundation (NSF) under grants 1700544, 1617985.Any opinions, ndings, conclusions, or recommendations ex-pressed in this material are those of the authors and do notnecessarily reects the views of ONR, DARPA, or NSF.
References
[1]2018 Node.js User Survey Report.https://nodejs.org/en/user-
survey-report
.
[2]Acunetix: Web Application Security Scanner.https://www.
acunetix.com/
.
[3]
babel: A JavaScript Compiler
.
https://babeljs.io/
.
[4]cookies package on npm.https://www.npmjs.com/package/
cookies
.
[5]Deserialization of Untrusted Data.https://cwe.mitre.org/data/
definitions/502.html
.
[6]ECMAScript parsing infrastructure for multipurpose analysis.https:
//esprima.org/
.
[7]Electron (software framework).https://en.wikipedia.org/
wiki/Electron_(software_framework)
.
[8]Functions in JSON.https://teamtreehouse.com/community/
functions-in-json
.
[9]Improperly Controlled Modication of Dynamically-Determined Ob-ject Attributes.https://cwe.mitre.org/data/definitions/
915.html
.
[10]Internal Property Abusing in snyk.https://snyk.io/vuln/SNYK-
JS-BSON-561052
.
[11]npm most depended upon packages.https://www.npmjs.com/
browse/depended
.
[12]Prototype pollution attacks in NodeJS applications.https://www.
youtube.com/watch?v=LUsiFV3dsK8
.
[13]routing-controllers: A Typescript Routing Controllers Framework.https://github.com/typestack/routing-controllers
.
[14]Ruby mass assignment vulnerability on Github.https://cve.mitre.
org/cgi-bin/cvename.cgi?name=CVE-2012-2054
.
[15]safe-eval Documentation.https://www.npmjs.com/package/
safe-eval
.
[16]Skype, Slack, other Electron-based apps can be easilybackdoored.https://arstechnica.com/information-
technology/2019/08/skype-slack-other-electron-based-
apps-can-be-easily-backdoored/
.
[17]StackOverow Developer Survey.https://insights.
stackoverflow.com/survey/2019
.
[18]useragent package on npm.https://www.npmjs.com/package/
useragent
.
[19]
V8 JavaScript Engine
.
https://v8.dev/
.

--- page 28 ---

2964 30th USENIX Security Symposium
USENIX Association

--- page 29 ---

[20]Proceedings of the 23rd USENIX Security Symposium (Security), SanDiego, CA, August 2014.
[21]Proceedings of the 27th USENIX Security Symposium (Security), Balti-more, MD, August 2018.
[22]Proceedings of the 2019 Annual Network and Distributed System Secu-rity Symposium (NDSS)
, San Diego, CA, February 2019.
[23]Fraser Brown, Shravan Narayan, Riad S Wahby, Dawson Engler, RanjitJhala, and Deian Stefan. Finding and Preventing Bugs in JavaScriptBindings. InProceedings of the 38th IEEE Symposium on Security andPrivacy (Oakland)
, San Jose, CA, May 2017.
[24]Shuo Chen, Jun Xu, Emre C. Sezer, Prachi Gauriar, and Ravishankar K.Iyer. Non-Control-Data Attacks Are Realistic Threats. InProceedingsof the 14th USENIX Security Symposium (Security), Baltimore, MD,August 2005.
[25]Ravi Chugh, Jeffrey A Meister, Ranjit Jhala, and Sorin Lerner. Stagedinformation ow for javascript.ACM Sigplan Notices, 44(6):50–62,2009.
[26]Stefano Cristalli, Edoardo Vignati, Danilo Bruschi, and Andrea Lanzi.Trusted execution path for protecting java applications against deserial-ization of untrusted data. InInternational Symposium on Research inAttacks, Intrusions, and Defenses
, pages 445–464. Springer, 2018.
[27]Johannes Dahse and Thorsten Holz. Static Detection of Second-order Vulnerabilities in Web Applications. InProceedings of the 23rdUSENIX Security Symposium (Security)
[20].
[28]Johannes Dahse, Nikolai Krein, and Thorsten Holz. Code reuse attacksin php: Automated pop chain generation. InProceedings of the 2014ACM SIGSAC Conference on Computer and Communications Security,pages 42–53, 2014.
[29]James C Davis, Eric R Williamson, and Dongyoon Lee. A Sense ofTime for JavaScript and Node.js: First-class Timeouts as a Cure forEvent Handler Poisoning. InProceedings of the 27th USENIX SecuritySymposium (Security)
[21].
[30]Aurore Fass, Michael Backes, and Ben Stock. HideNoSeek: Camou-aging Malicious JavaScript in Benign ASTs. InProceedings of the26th ACM Conference on Computer and Communications Security(CCS)
, London, UK, November 2019.
[31]Liang Gong, Michael Pradel, Manu Sridharan, and Koushik Sen. DLint:Dynamically Checking Bad Coding Practices in JavaScript. InProceed-ings of the International Symposium on Software Testing and Analysis(ISSTA)
, Baltimore, Maryland, July 2015.
[32]Hong Hu, Shweta Shinde, Sendroiu Adrian, Zheng Leong Chua, PrateekSaxena, and Zhenkai Liang. Data-Oriented Programming: On theExpressiveness of Non-control Data Attacks. InProceedings of the37th IEEE Symposium on Security and Privacy (Oakland), San Jose,CA, May 2016.
[33]Adam Kieyzun, Philip J Guo, Karthick Jayaraman, and Michael DErnst. Automatic Creation of SQL Injection and Cross-site ScriptingAttacks. InProceedings of the 29th International Conference on Soft-ware Engineering (ICSE), Vancouver, British Columbia, Canada, May2009.
[34]Sebastian Lekies, Ben Stock, and Martin Johns. 25 Million FlowsLater: Large-scale Detection of DOM-based XSS. InProceedings ofthe 20th ACM Conference on Computer and Communications Security(CCS)
, Berlin, Germany, October 2013.
[35]Sebastian Lekies, Ben Stock, Martin Wentzel, and Martin Johns. Theunexpected dangers of dynamic javascript. In24thfUSENIXgSecuritySymposium (
f
USENIX
g
Security 15)
, pages 723–735, 2015.
[36]Blake Loring, Duncan Mitchell, and Johannes Kinder. Sound regularexpression semantics for dynamic symbolic execution of javascript. InProceedings of the 40th ACM SIGPLAN Conference on ProgrammingLanguage Design and Implementation
, pages 425–438. ACM, 2019.
[37]Andres Ojamaa and Karl Düüna. Assessing the Security of Node.jsPlatform. In2012 International Conference for Internet Technologyand Secured Transactions
, pages 348–355. IEEE, 2012.
[38]Jibesh Patra, Pooja N Dixit, and Michael Pradel. Conictjs: Finding andUnderstanding Conicts between JavaScript Libraries. InProceedingsof the 40th International Conference on Software Engineering (ICSE),Gothenburg, Sweden, May – June 2018.
[39]Michael Pradel, Parker Schuh, and Koushik Sen. Typedevil: Dynamictype inconsistency analysis for javascript. InProceedings of the 37thInternational Conference on Software Engineering-Volume 1, pages314–324. IEEE Press, 2015.
[40]Prateek Saxena, Steve Hanna, Pongsin Poosankam, and Dawn Song.FLAX: Systematic Discovery of Client-side Validation Vulnerabilitiesin Rich Web Applications. InProceedings of the 17th Annual Networkand Distributed System Security Symposium (NDSS), San Diego, CA,February–March 2010.
[41]Michael Schwarz, Florian Lackner, and Daniel Gruss. JavaScript Tem-plate Attacks: Automatically Inferring Host Information for TargetedExploits. InProceedings of the 2019 Annual Network and DistributedSystem Security Symposium (NDSS)
[22].
[42]Koushik Sen, Swaroop Kalasapur, Tasneem Brutch, and Simon Gibbs.Jalangi: a selective record-replay and dynamic analysis framework forjavascript. InProceedings of the 2013 9th Joint Meeting on Foundationsof Software Engineering
, pages 488–498. ACM, 2013.
[43]Cristian-Alexandru Staicu and Michael Pradel. Freezing the web:A study of redos vulnerabilities in javascript-based web servers. In27thfUSENIXgSecurity Symposium (fUSENIXgSecurity 18), pages361–376, 2018.
[44]Cristian-Alexandru Staicu, Michael Pradel, and Benjamin Livshits.SYNODE: Understanding and Automatically Preventing Injection At-tacks on Node.js. InProceedings of the 2018 Annual Network andDistributed System Security Symposium (NDSS), San Diego, CA, Febru-ary 2018.
[45]Cristian-Alexandru Staicu, Daniel Schoepe, Musard Balliu, MichaelPradel, and Andrei Sabelfeld. An Empirical Study of Information Flowsin Real-World JavaScript. InProceedings of the 14th ACM SIGSACWorkshop on Programming Languages and Analysis for Security, pages45–59, 2019.
[46]Marius Steffens, Christian Rossow, Martin Johns, and Ben Stock. Don'tTrust The Locals: Investigating the Prevalence of Persistent Client-SideCross-Site Scripting in the Wild. InProceedings of the 2019 AnnualNetwork and Distributed System Security Symposium (NDSS)
[22].
[47]Ben Stock, Sebastian Lekies, Tobias Mueller, Patrick Spiegel, and Mar-tin Johns. Precise Client-side Protection against DOM-based Cross-siteScripting. InProceedings of the 23rd USENIX Security Symposium(Security)
[20].
[48]Ben Stock, Stephan Pstner, Bernd Kaiser, Sebastian Lekies, and Mar-tin Johns. From Facepalm to Brain Bender: Exploring Client-sideCross-site Scripting. InProceedings of the 22nd ACM Conferenceon Computer and Communications Security (CCS), Denver, Colorado,October 2015.
[49]Markus Zimmermann, Cristian-Alexandru Staicu, Cam Tenny, andMichael Pradel. Small World with High Risks: A Study of SecurityThreats in the NPM Ecosystem. InProceedings of the 27th USENIXSecurity Symposium (Security)
[21].
A Appendix
A.1 Countermeasures
Validating Input Objects.First of all, objects generated from input shouldbe validated. Since the rst step of the HPA attack is to inject additionalproperties into the input data, one straightforward mitigation is to remove

--- page 30 ---

USENIX Association
30th USENIX Security Symposium 2965

--- page 31 ---

Table 6: Examples of
S
and their meaningsScope Refers to* the carrier is globally visible to the whole scriptlogin_fun the carrier is only visible to function
loginlogin_fun.is_admin_fun
the carrier is only visible to a nested function
is_admin
dened in function
loginanon.12.1.12.5._fun
the carrier is visible to an anonymous function locating
at line 12 from column 1 to column 5unwanted (malicious) properties by performing input validation. There aretwo possible validation methods. The rst method is using a blacklist toprevent properties that have the same name as the critical internal properties(e.g., constructor) from entering the application. The advantage of this methodis that it is exible to deploy and requires no major changes to the wholemodule. Several vulnerabilities we reported (e.g., CVE1 and CVE7) havebeen patched by this method. The disadvantage of this method is that itmay be bypassed due to an incomplete blacklist. The second method is toenforce a whitelist input format check for every API, which means it onlypermits known properties entering into the program. The advantage is that itensures better input validation coverage, while the disadvantage is that it ismore difcult to deploy since developers have to manually declare the inputschema case by case.However, we should be aware that input validation is not the cure for HPA,because the validation module itself might also be vulnerable to HPA. Asshown in Table 5, 5 HPA vulnerabilities are identied from input validationmodules. Hence, we suggest that the input validation module should becarefully designed (e.g., by following the other two suggestions below).
Avoiding packing multiple variables into one argument.Second, we ad-vocate that developers should avoid putting different variables into one objectand uses it as an argument when invoking APIs. This is a very commonprogramming style in Node.js because it complies with the classic classmodel in Object-oriented programming (OOP) which treats a variable as acertain instance that consists of different members. For example, we foundthat exposed APIs (e.g.,findOne()) of mongoDB's driver packs all querydata as a single object (i.e.,query). However, this practice could be risky inNode.js because: (1) Unlike other OOP languages that have member accesscontrol (e.g., modiers likeprivateandpublicin C++ and Java), JavaScriptenforces no property access control for its objects. Hence, arbitrary internalproperties can be overwritten when a user-controlled object is copied/as-signed to certain internal objects. (2) Developers adapting this style are likelyto dene some properties (e.g.,userRole) within the objects to store theirmeta information. An attacker might forge these properties to introduce se-curity risks. For example, mongoDB driver differentiates differentiate typesofqueryaccording a self-dened property_bsontype. It turns out that thisself-dened property can be forged to leak data from the database.
Isolating internal program state from input.It is important to put unsafeexternal objects and internal state objects into different domains so that theywill not affect each other. For example, one potential solution is to label datafrom the external interfaces (e.g., Network APIs) and perform validationwhen overwriting properties in internal objects at the Node.js runtime enginelevel. Though this solution fundamentally mitigates HPA, it also has twodisadvantages. First, it incurs overhead into the runtime engine becauseadditional data structures need to be attached to the object implementation.Second, in some scenarios, developers do want external input to changecertain properties of an internal object. Hence, developers will have to addadditional code to declare a permission for such cross-domain behaviors ifthis feature is implemented in the engine.
A.2 Scope Representation in L
YNXTable 6 shows several examples of the scope representations inL
YNXandthe corresponding meanings.
A.3 Complete ResultTable 7 shows the complete detection results of the 102 tested Node.jsprograms.

--- page 32 ---

2966 30th USENIX Security Symposium
USENIX Association

--- page 33 ---

Table 7:Complete detection results. Downloads with (g) are counted from github, the major release channel of these projects.Category
Program
Version LOC Downloads Coverage
Time Detection ResultsDetection Exploitation #PC #HPCDatabase
json-records 1.0.5 169 52 0.34 12s 37.3s 15 1
keyv 4.0.0 93 12,781,403 0.64 2.1s 52.5s 10 3
levelup 4.3.2 353 1,162,162 0.31 6.1s 39.2s 28 2
LokiJS 1.5.8 6372 1,025,170 0.10 27.2s 49.4s 53 3
Lowdb 1.0.0 486 857,106 0.60 540.7s N/A 7 0
mongoDB 3.3.3 22256 6,165,075 0.28 329.8s 74.2s 63 8
mongoose 5.8.1 41750 2,941,692 0.19 359.2s 328.1s 92 41
mongoist 2.4.0 2041 10,646 0.39 60.3s 239.7s 40 14
Taffydb 2.7.3 1478 1,628,860 0.12 10.9s 49.6s 15 6Input Validation
Ajv 6.10.2 10997 101,694,541 0.36 240s N/A 6 0
AnotherJsonSchema 3.8.2 10994 267 0.15 2.2s N/A 18 0
allow 2.1.0 658 132732 0.55 7.6s 17.1s 7 8
async-validator 3.4.0 1972 2,502,423 0.29 3.5s N/A 17 0
async-validate 1.0.1 4349 1,731 0.41 2.6s 14.6s 38 5
amanda 1.0.1 9281 30,392 0.22 2s N/A 28 0
assert-args 1.2.1 1792 146 0.35 13s 17.7s 21 2
class-validator 0.9.1 5668 1,077,954 0.45 1409.0s 91.4s 42 8
congruence 1.6.11 10268 146 0.14 446.5s N/A 48 0
Consono 1.0.6 564 1,107 0.43 8.8s 91.l7s 18 5
DataInspector 0.5.0 1349 29 0.41 33.3s 447s 11 4
enforce 0.1.7 1546 14,047 0.29 3s 15s 14 1
fastest-validator 1.7.0 2315 130,804 0.37 6.4s N/A 3 0
Forgjs 1.1.11 3562 167 (g) 0.61 16.1s 354.9s 31 4
eldify 1.2.2 2189 73 0.49 2.2s 41.0s 14 2
fefe 2.0.2 729 146 0.52 1.2s 55.8s 7 1
hannibal 0.6.2 2847 2,668 0.31 3.1s 21.8s 46 4
have 0.4.0 579 1,591 0.55 1.2s 15.3s 3 3
indicative 7.3.0 311 31,235 0.30 2.8s N/A 4 0
isMyJsonValid 2.20.0 554 6,428,255 0.34 1.5s N/A 4 0
is-extendable 1.0.1 8 103,501,348 0.36 1.0s 13.9s 3 1
is2 2.0.6 1969 2,944,841 0.28 1.2s N/A 4 0
joi 16.1.7 7435 12,575,750 0.31 142s N/A 16 0
jpv 2.0.1 206 481 0.20 1.6s 55.4s 25 14
Jsonschema 1.2.4 335 53,884,848 0.18 3.5s 57.5s 39 8
json-gate 0.8.23 732 2,228 0.29 1.3s 28.4s 18 2
legalize 1.3.0 2297 1,745 0.43 54.2s 55.3s 23 1
Object-inspect 1.7.0 701 40,736,308 0.44 5.6s 104.6s 31 6
obj-schema 1.6.2 511 207 0.24 5.6s N/A 23 0
OW 0.15.0 311 624,684 0.37 36.9s 43.5s 16 1
Property-Validator 0.9.0 4130 1,242 0.35 4.5s N/A 15 0
schema-inspector 1.6.8 5161 35,783 0.24 51.0s 53.8s 48 8
satpam 4.4.1 57151 4,256 0.51 47.8s 201.9s 27 1
typeof-properties 3.1.3 1047 1,184 0.43 2.6s N/A 20 0
typical 6.0.1 192 2,629,970 0.13 1.2s N/A 6 0
treat-like 1.0.0 767 47,832 0.36 0.9s N/A 31 0
themis 1.1.6 5081 942 0.26 45.7s 62.7s 28 1
validate.io-object 1.0.4 6 15,176 0.31 0.9s N/A 6 0
ValidatorJS 3.18.1 68823 106,038 0.19 3.9s 48.7s 33 3
validate.js 0.13.1 933 662,549 0.19 5.2s N/A 21 0
validate-arguments 0.0.8 725 1,788 0.08 257.4s 319.4s 21 3
validated 2.0.1 1561 2101 0.49 4.3s 72.4s 18 5
valida 2.4.1 2704 731 0.42 2.2s 57.1s 16 8
validall 3.0.17 1202 341 0.33 2.3s 50.6s 31 6
Valib 2.0.0 327 479 0.27 2.3s 51.2s 15 1
value-schema 3.0.0 1909525 1,900 0.46 2.1s N/A 31 0
Yup 0.27.0 2088 4,455,577 0.46 8.0s 24.2s 42 5
Z-schema 4.2.2 33221 2,434,914 0.29 15.6s 38.8s 19 1User functionalities
Avsc 5.4.16 6508 108,450 0.18 19s N/A 9 0
Analytics 3.4.0 185 105,510 0
*
19.7s 51.3s 20 8
bson-objectid 1.3.0 259 142,562 0.21 1.1s 40.7s 5 4
Cookies 0.8.0 503 2,549,728 0.46 46.7s 97.4s 6 1
component-type 1.2.1 2893 943,555 0.55 4.3s 48.0s 8 5*Our underlying instrumentation (Jalangi) does not detect any code execution in the module, which results in the 0 here. In fact, code in the moduledoes execute and we even detect hidden properties.

--- page 34 ---

USENIX Association
30th USENIX Security Symposium 2967

--- page 35 ---

Category
Program
Version LOC Downloads Coverage
Time Detection ResultsDetection Exploitation #PC #HPCcheck-types 11.1.2 573 9,983,393 0.36 26.5s 225.7s 88 2
DumperJS 1.3.1 284 6,797 0.57 2.9s 580.4s 28 18
deep-extend 0.6.0 83 39,395,270 0.35 5.5s 45.0s 3 6
deep-copy 1.4.2 60 402,884 0.44 1.2s 49.2s 22 3
deepmerge 4.2.2 325 39,856,800 0.58 4.9s 53.3s 12 3
fast-clone 1.5.13 87 23,424 0.43 1.3s 44.2s 11 4
fast-stringify 2.0.0 184 33,4536 0.34 1.3s N/A 4 0
immutability-helper 3.0.1 259 1,395,820 0.32 0.8s N/A 10 0
iap 1.1.1 1250 8,227 0.32 0.5s 17.5s 12 5
Js-yaml 3.13.1 5719 60,478,990 0.24 47.8s 172.4s 40 14
jsonle 5.0.0 110 5,637 0.29 1.5s N/A 42 0
js2xmlparser 4.0.1 364 2,796,779 0.47 67.4s 94.1s 45 2
json-to-pretty-yaml 1.2.2 163 1,052,996 0.34 2.1s 5.1s 19 2
just-extend 4.1.0 41 7,891,960 0.44 1.2s 13.46s 10 3
kind-of 6.0.2 97 196,448,574 0.56 1.2s 49.1s 16 16
mailgun-js 0.22.0 6569 1,200,173 0.61 614.0s 485.9s 22 6
map-obj 4.1.0 76 51,062,828 0.78 1.0s 26.8s 14 6
merge-deep 3.0.2 162 12,158,104 0.58 2.5s 15.2s 6 5
mongo-parse 2.1.0 1435 1,291 0.13 1s N/A 15 0
mongodb-extjson 3.0.3 8845 42,141 0.20 6s 75.5s 23 9
node-cache 5.1.0 618 2,917,617 0.33 1.3s 1.11s 14 6
object-hash 2.0.2 4277 20,002,794 0.33 4.2s 40.7s 15 2
Object-is 1.0.1 56 25,466,395 0.53 1.6s N/A 6 0
papaparse 5.1.1 4710 1,290,026 0.08 8.9s 32.6s 11 11
set-value 3.0.2 83 60,184,464 0.57 1.0s 17.1s 4 6
table 5.4.6 2283 36,535,762 0.38 11.5s 39.3s 7 3
WriteJsonFile 4.2.1 160 6,792,576 0.54 6.8s N/A 12 0
vnopts 1.0.2 2571 166,521 0.22 13s N/A 3 0
xtend 4.0.2 106 64,552,908 0.71 1.9s 78.5s 15 6Web
cezerin 0.33.0 48808 1,871 (g) 0.37 63s 740s 9 49
connect 3.7.0 125 15,621,960 0.20 46s N/A 4 0
derby 0.10.27 5060 1,156 0.12 237s N/A 5 0
Datalize 0.3.4 628 231 0.27 71s 91.2s 69 12
express 4.17.1 1829 55,134,711 0.14 62.0s 14.0s 1 2
Express-form 0.12.6 1569 4,183 0.31 1.3s 2.2s 17 2
express-cart 1.1.16 6904 1,554 (g) 0.14 45s N/A 8 0
ghost 3.39.3 58776 32,719 0.32 71s 88.4s 468 5
mongo-express 0.54.0 2789 6,965 0.30 75s 29s 45 25
nodebb 1.4.0 70549 55 0.14 38s N/A 637 0
total.js 3.3.0 38214 14,267 0.14 340s N/A 6 0

--- page 36 ---

2968 30th USENIX Security Symposium
USENIX Association

--- page 37 ---

Sharing ObjectsP1I2Node.js program internalinputRemote attackerI1I2en-USObject.assign(internal, input) if (Internal.I2 == admin) { privileged_api();}

--- page 38 ---

emailSQLIpasswdconstructorfalsequery(email)emailSQLIpasswdconstructorfalseparamlogin(req)metaDataconstructorfalse__proto__formatfalseformatcandidateparammetaData__proto__LoginSch.prototypeemailSQLIpasswdconstructorfalseschemaconstructor{isEmail...}AuthenticationParam HandlerDatabaseValidatortransform(schema,param){Object.assign(schema,param)}validate(candidate){format = getSchema(candidate)}

--- page 39 ---

Discovering Property CarriersPinpointing Hidden Property CandidatesGenerating Exploit TemplatesNode.jsprogramIdentifying Hidden PropertiesGenerating HPA ExploitsExploring Attack ConsequencesExploitsCandidate PruningHidden Property Candidates

--- page 40 ---

function transform(schema, param){ value = Object.assign( schema, param); return value;}function validate(object) { ... var targetMetadatas = getSchema( object.constructor); const groupedMetadatas = this.metadataStorage .groupByPropertyName(targetMetadatas); ... // validation based on metadatas Object.keys(groupedMetadatas) .forEach(function(propertyName) { if(illegal) return null; }); return object; }property carrierData flow ofData flow of12345678910111213141516171819202122two possible pathssymbolized variable

--- page 41 ---

A/Oþ#

--- page 42 ---

>0 
`g<_''?0!	�,“ž–ˆ2<H3c‘],“�—‡32!4c‘^zv‰‘‡o#z81J4!	#J+1H/ŒW!E+-$5#þ-_O2%;L
