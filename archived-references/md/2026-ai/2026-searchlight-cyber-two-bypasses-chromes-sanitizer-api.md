---
type: Article
title: Two Bypasses for Chrome’s Sanitizer API
description: "Two ways past Chrome's built-in Sanitizer API, including a javascript: URL that survives sanitisation because a U+2028 line separator splits the scheme token the parser checks against the one it later resolves."
resource: "https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/"
tags: [article, webseclist-reference, en, searchlight-cyber, sanitizer-bypass, xss, filter-bypass, url-parsing, unicode, dom, owasp-a03-2021, owasp-a05-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T01:05:45+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/"
    title: Two Bypasses for Chrome’s Sanitizer API
    author: Adam Kues, @searchlightsec
    last_modified: 2026-05-22
  - id: capture
    resource: "https://web.archive.org/web/20260712001200/https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/"
also_at: []
authors:
  - Adam Kues
  - "@searchlightsec"
canonical_url: ""
cited_by:
  - "2026-ai.md:73"
commit: ""
content_sha256: 92ecf35ef81a512d59dd87bf731a3580b336b016b31c27232ff45395dac746d7
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/"
published: 2026-05-22
publisher: Searchlight Cyber
publisher_english: ""
raw_sha256: 35b5757dbdfe64022dd5588acce612aebc9d9a177cbc51046076e2c069737b7d
retrieved_from: "https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/"
retrieved_kind: stored
retrieved_utc: "2026-08-14T01:05:45+00:00"
slug: 2026-searchlight-cyber-two-bypasses-chromes-sanitizer-api
snapshot: 20260712001200
title_english: ""
translation_file: ""
translation_of: ""
---

# Two Bypasses for Chrome’s Sanitizer API

**Two Bypasses for Chrome’s Sanitizer API** - Adam Kues, @searchlightsec, Searchlight Cyber.

- Published: 2026-05-22
- Original: <https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/>
- Preserved from: https://slcyber.io/research-center/two-bypasses-for-chromes-sanitizer-api/ (stored) on 2026-08-14
- Capture timestamp: 20260712001200
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

May 22, 2026

 Security research

 [Adam Kues](https://slcyber.io/author/akues/)

# Two Bypasses for Chrome’s Sanitizer API

 Stay current: Get research alerts for newly disclosed vulnerabilities and exposures

The Sanitizer API arrived [with much fanfare](https://hacks.mozilla.org/2026/02/goodbye-innerhtml-hello-sethtml-stronger-xss-protection-in-firefox-148/) in both Chrome 146 and Firefox 148 just a few months ago. The API provides two new ways to set HTML safely from within javascript; the default mode:

```js
node.setHTML(`<b>Hello, world!</b>`)
```

And the more customizable mode:

```js
const config = {
 "elements": ["p", "span", "b"],
 "attributes": ["class"]
};
const sanitizer = new Sanitizer(config);
node.setHTML(`<b>Hello, world!</b>`, {sanitizer: sanitizer});
```

The most permissive mode for this new API is the empty config `{}`, which means ‘allow anything, except scripts’:

```js
const sanitizer = new Sanitizer({});
node.setHTML(`<b>Hello, world!</b>`, {sanitizer: sanitizer});
```

The specification is clear: no matter how you configure the sanitizer, you should not be able to pass through HTML that results in XSS.

The sanitizer API is a strong security boundary and solves the biggest issue plaguing the industry-standard DOMPurify today – mutation XSS. The standard use of DOMPurify is something like this:

```js
const clean = DOMPurify.sanitize(`<b>Hello, world!</b>`);
node.innerHTML = clean;
```

This approach seems clean but has a very significant issue; the code involves a serialization from HTML to string (since `DOMPurify.sanitize` returns a string) and then the HTML is reparsed when it is assigned to `innerHTML`. Due to the complexity of the HTML parsing and serialization rules, this can result in a parsing differential between what DOMPurify sees and what ends up in the DOM tree, leading to XSS. This has been exploited [again](https://www.securitum.com/mutation-xss-via-mathml-mutation-dompurify-2-0-17-bypass.html) and [again](https://portswigger.net/research/bypassing-dompurify-again-with-mutation-xss) and [again](https://mizu.re/post/exploring-the-dompurify-library-bypasses-and-fixes). Significant hardening, such as the [mXSS protections in browsers](https://developer.chrome.com/blog/escape-attributes) and DOMPurify’s namespace sanitizer, has left the library safe for now, but there is no theoretical obstacle to another bypass.

The sanitizer API, on the other hand, returns the DOM tree directly. There is no serialization/reparsing round trip, and thus a lot of these issues are directly eliminated. (For what it’s worth, DOMPurify offers this as `RETURN_DOM`, but adoption in the wild is low). Therefore, bypassing this new API requires new ideas from the security community and new approaches. In this blog post, I present two bypasses for the Sanitizer API in Chrome 146; one of which was discovered and reported by myself, and one which I reverse engineered from a Chrome commit. These two bypasses use novel, disparate ideas and can hopefully inspire future security research on the Sanitizer API.

### Bypass #1 : xlink:href abuse

The main file that handles most of the sanitization is [`third_party/blink/renderer/core/sanitizer/sanitizer.cc`](https://source.chromium.org/chromium/chromium/src/+/075796a0e7faad0baefcda33a792ffd0e26d4354:third_party/blink/renderer/core/sanitizer/sanitizer.cc). After reading the file from top to bottom and the [associated specification from WICG](https://wicg.github.io/sanitizer-api/), one thing that stood out to me was this direct string comparison:

```cpp
void RemoveAttributeIfValueIsHref(Element* element,
                                  const QualifiedName& attribute) {
  const AtomicString& value = element->getAttribute(attribute);
  if (value == "href" or value == "xlink:href") {
    element->removeAttribute(attribute);
  }
}
```

Direct string comparisons rarely work in HTML-world for sanitization. But what is this meant to protect?

### SVG Animation

As is well known by now, SVG can not only handle static images but dynamic ones too. One of the ways of achieving animation is the `<animate>` tag, which looks something like this:

```html
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect id="foo" x="10" y="10" width="50" height="50" fill="tomato"/>
  <animate href="#foo" attributeName="x" from="10" to="140" dur="2s" repeatCount="indefinite"/>
</svg>
```

There are a couple of components here. We first define a `<rect>` with an ID of `foo`. Then, using the `<animate>` tag, we specify via the `attributeName` parameter that we are going to vary `x` over the values `10` to `140`. The effect of this is that we animate the square to move from left to right. If you were to query the `foo.x` property via Javascript, you would see that the value does indeed actually change over time.

Not every attribute can be animated. However, when these features were introduced, it was [quickly noticed](https://portswigger.net/research/svg-animate-xss-vector) that the `href` and `xlink:href` attributes are animatable. This means things like this are possible:

```html
<svg>
  <a id="foo"><text x=20 y=20>click me</text></a>
  <animate href="#foo" attributeName="href" values="javascript:alert(1)"/>
</svg>
```

This is the purpose of the sanitization routine above. This routine is called for all tags that can take an `attributeName`:

```cpp
void Sanitizer::SanitizeJavascriptNavigationAttributes(Element* element,
                                                       Mode safe) const {
  // ... SNIP ...
  if (...) {
    // ... SNIP ...
  } else if (qname == svg_names::kAnimateTag ||
             qname == svg_names::kAnimateMotionTag ||
             qname == svg_names::kAnimateTransformTag ||
             qname == svg_names::kSetTag) {
    RemoveAttributeIfValueIsHref(element, svg_names::kAttributeNameAttr);
  }
}
```

### The Bypass

Recall that the attribute comparison is done strictly and case sensitively – the attribute to animate must be exactly `href` or `xlink:href`. Those of you with hacker sense might already be scheming bypasses, and I had the same thought. I tried several variations, including:

```
HREF
hReF
 href (leading space)
href�
```

But nothing like this worked. Turns out, SVG is pretty strict about exact casing and spacing when it comes to attribute names!

I turned my attention to the other blocked attribute: `xlink:href` . This is a namespaced element, and it’s parsed by splitting the attribute on `:` – the first element is the namespace, and the second is the attribute name. I quickly hypothesized that this might be implemented by splitting on `:` and taking the first two elements. Thus, I tried `xlink:href:x`, and it worked! This achieves an XSS while bypassing the sanitizer. The final payload:

```html
<svg xmlns:xlink="http://www.w3.org/1999/xlink">
  <a id="foo"><text x=20 y=20>click me</text></a>
  <animate href="#foo" attributeName="xlink:href:x" values="javascript:alert(1)"/>
</svg>
```

Chrome fixed this in two ways:

- In the short term, they changed the logic in `RemoveAttributeIfValueIsHref` to use the actual SVG attribute parser, rather than do a string comparison.
- In the long term, they are changing namespace parsing to [explicitly only split on the first colon](https://github.com/whatwg/dom/issues/1134).

### Bypass #2: URL Reparsing

Two days after the patch landed for my sanitizer bypass, I noticed a suspicious commit which touched the `sanitizer.cc` file – [c7d115c0](https://source.chromium.org/chromium/chromium/src/+/c7d115c0878465398b7aa3ceea3841484010a25e). The commit has a few changes but the relevant one is this single line:

```diff
void RemoveAttributeIfProtocolIsJavaScript(Element* element,
                                           const QualifiedName& attribute) {
  const AtomicString& value = element->getAttribute(attribute);
-  if (value && KURL(value.GetString()).ProtocolIsJavaScript()) {
+  if (value && ProtocolIsJavaScript(value)) {
    element->removeAttribute(attribute);
  }
}
```

The commit description gives us a hint as to what it’s doing:

>

For checking the scheme there’s a fast-path scheme parser, so we don’t need to parse the entire URL.

Let’s understand what the change does. Firstly, `RemoveAttributeIfProtocolIsJavaScript` is used in this way:

```cpp
void Sanitizer::SanitizeJavascriptNavigationAttributes(Element* element,
                                                       Mode safe) const {
  // ... SNIP ...

  const QualifiedName& qname = element->TagQName();
  if (qname == html_names::kATag || qname == html_names::kAreaTag ||
      qname == html_names::kBaseTag) {
    RemoveAttributeIfProtocolIsJavaScript(element, html_names::kHrefAttr);
  } else if (qname == svg_names::kATag ||
             element->namespaceURI() == mathml_names::kNamespaceURI) {
    RemoveAttributeIfProtocolIsJavaScript(element, html_names::kHrefAttr);
    RemoveAttributeIfProtocolIsJavaScript(element, xlink_names::kHrefAttr);
  } else if (qname == html_names::kButtonTag ||
             qname == html_names::kInputTag) {
    RemoveAttributeIfProtocolIsJavaScript(element, html_names::kFormactionAttr);
  } else if (qname == html_names::kFormTag) {
    RemoveAttributeIfProtocolIsJavaScript(element, html_names::kActionAttr);
  } else if (qname == html_names::kIFrameTag) {
    RemoveAttributeIfProtocolIsJavaScript(element, html_names::kSrcAttr);
  }

  // ... SNIP ...
}
```

This is the function responsible for stripping the `javascript:` protocol from navigations. This protects against simple vectors like:

```html
<a href="#">click me</a>
<form><button type="submit" formaction="javascript:alert(1)"/></form>
<form action="javascript:alert(1)"><button type="submit"/></form>
```

Anyone who has spent any time looking at XSS knows that simply checking that a navigation attribute starts with `javascript:` is not sufficient; the URL has complex parsing rules which means that URLs like `jAvA
script:alert(1)` still work. To combat this, the old Chrome code used its own URL parser called `KURL` (the same one that handles constructing the navigation) to parse the URL, and strips the attribute if the protocol is `javascript`.

On the other hand, the patched code uses a special `ProtocolIsJavaScript` function. This function does not construct a full `KURL` object, but instead emulates the parsing of *just the protocol* part of `KURL` and uses that as a shortcut, resulting in a large efficiency gain over thousands of URLs; after all, the `KURL` object is only being used for checking the protocol and is then immediately discarded.

### The Bug

At first glance, you might guess there is some subtle difference in how the protocol is parsed between the browser on a navigation, `KURL`, and the free form `ProtocolIsJavaScript` function. But indeed, after checking the implementations carefully, the protocol parsing in all of them is the exact same. There is, however, one difference: if `KURL` thinks the URL is not valid, `KURL::ProtocolIsJavaScript` will always return false, but the free form version `ProtocolIsJavaScript` will return true.

Is there such a thing as an ‘invalid’ Javascript URL? Turns out, there is!

```js
new URL('javascript://://aaa')
// Uncaught TypeError: URL constructor: javascript://://aaa is not a valid URL.
```

This is because the `//:/` is treated as a `hostname:port` combo. Since you can’t have an empty host or port, the URL is considered invalid. Thus in Chrome 146, if you sanitize `<a href="#">click me</a>` using the Sanitizer API, it will actually leave the URL untouched. This is because the `KURL` constructor sees that the URL is invalid, and so `ProtocolIsJavaScript` returns false.

There is one problem with this ‘bypass’ – even though the `javascript` URL makes it to the DOM untouched, when you click on it, nothing happens. You may initially think this is because the `//` forms a comment, but you can verify this isn’t the case. Using a payload like `javascript://:// alert(1)` (where ` ` is a valid line separator) still doesn’t result in XSS on click. The real reason is that the URL is invalid, so the browser will refuse to navigate to it or execute. This makes sense; the browser is using the same construction under the hood to handle navigation, and so an invalid URL will result in no execution. You can doubly verify this by trying to navigate to the URL manually:

```js
document.location = 'javascript://://aaa'
// Uncaught SyntaxError: Failed to set the 'href' property on 'Location'
// 'javascript:///.//aaa' is not a valid URL.
```

The question then becomes; is there some HTML construction where the URL is *mutated* before click, in such a way that the invalid URL could become valid? As it turns out, there is indeed such a mechanism in HTML – forms. Consider the following HTML:

```html
<form action="https://example.com/path">
  <input name="foo" value="bar"/>
  <button type="submit">click me</button>
</form>
```

This is a GET-based form. When you click the `click me` button, you get sent to `https://example.com/path?foo=bar`. What happens is roughly as follows:

- Chrome will parse the URL in `action`.
- Chrome will append the query string `foo=bar` to the URL.
- *Chrome will re-serialize the newly constructed URL.*
- Chrome will then do a navigation to that URL.

We are lucky. In Chrome, if the URL is reserialized after having an invalid host, Chrome will treat the URL as if it had no host (just a path and query). This gives us the differential we need to conjure a working Javascript XSS out of the invalid URL.

After a bit of tweaking, I landed on this payload:

```html
<form action="javascript://://-alert(1)//">
  <button type="submit">click me</button>
</form>
```

Pre-patch, this would pass through the Sanitizer API untouched – but when you click on it, you get an alert. Let’s trace what happens:

- The URL `javascript://://-alert(1)//` looks like an absolute URL with an empty host. Since this is an invalid URL, it is passed through due to `KURL`‘s behavior.
- When you click on the `click me` button in the form, since this is a GET request, Chrome internally adds a query string (which is empty since the form has no inputs) to the URL. This doesn’t do anything much but does have the effect of appending a question mark `?` to the URL.
- Chrome then re-serializes the new URL to do the navigation. Here, since its internal URL representation has no authority (no host or port), it’s omitted from the serialized URL. Thus Chrome operates on a ‘path only’ URL that looks like `//-alert(1)//`
- Chrome has a special case for path only URLs that start with `//`, as this could be confused for the start of an absolute URL. Therefore it converts the leading `//` to `/.//`
- Thus the full, serialized URL including the empty query string is `javascript:/.//-alert(1)//?`
- Chrome navigates to this URL. This is a valid Javascript URL, consisting of a regex `/./`, followed by a division `/`, unary minus `-`, our payload `alert(1)`, and then a comment `//?`
- This pops an alert box.

Phew!

### Applications

While this is patched now for the sanitizer, it could be useful in other situations. I posted a challenge on X that looked like this:

```html
<html>
 <body>
  <form id="targetForm"></form>
  Please enter a url, like as follows: <a href="?url=https://example.com">?url=https://example.com</a>
 </body>
 <script defer="true">
  const url = new URLSearchParams(window.location.search).get('url');
  if (url && URL.parse(url)?.protocol != 'javascript:') {
      targetForm.action = url;
      targetForm.submit();
  }
 </script>
</html>
```

Here, it’s checking that if the URL is valid, that its protocol must not be `javascript:`. At first, this condition seems impossible to bypass for XSS. But using the invalid URL trick, we can indeed get XSS with `javascript://://-alert(1)//`! In general, any sanitizer that:

- Checks for `javascript` URLs using the `URL` constructor; and
- Allows invalid URLs

Could be fooled by this technique.

### Conclusions

The Sanitizer API has opened up a brand new surface for client side research. While the techniques described are patched now, I am sure there are other techniques waiting to be discovered. I am excited to see what the security research community comes up with!

Timeline:

- Feb 26, 2026: `xlink:href` bypass reported
- March 1, 2026: `xlink:href` patch landed
- March 3, 2026: `ProtocolIsJavaScript` patch landed
- April 7, 2026: Chrome 147 released with both fixes
