---
type: Article
title: "365-Day: https Cookie Stealing"
description: "Session cookies set over HTTPS but lacking the Secure bit are handed out on any plaintext request. Inject an <img src=\"http://mail.google.com/mail\"> into any HTTP page the victim loads on a shared network and the gmail cookie arrives in the clear, days after they last logged in."
resource: "https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf"
tags: [article, webseclist-reference, cookie, https, tls, auth-bypass, info-leak, tooling, owasp-a01-2021, owasp-a02-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-09T20:44:24+00:00"
status: stable
stale_after: 2027-08-09
sources:
  - id: original
    resource: "https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf"
    title: "365-Day: https Cookie Stealing"
    author: Mike Perry
also_at: []
authors:
  - Mike Perry
canonical_url: ""
cited_by:
  - "2008.md:92"
commit: ""
content_sha256: 1e6c5cd7aa732226aa039e6bbf93366089a8aec5f5620cc2890d5c177e8b1ac8
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: c7b263260d8c91e252365655d6c1b72ea21380cf05e42c6de78c34ad347671d6
retrieved_from: "https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf"
retrieved_kind: manual-import
retrieved_utc: "2026-08-09T20:44:24+00:00"
slug: 365-day-https-cookie-stealing
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# 365-Day: https Cookie Stealing

**365-Day: https Cookie Stealing** - Mike Perry, Publisher not stated.

- Published: date not stated
- Original: <https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf>
- Preserved from: https://fscked.org/talks/ActiveHTTPSCookieStealing.pdf (manual-import) on 2026-08-09
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

365-Day: https Cookie Stealing




           Mike Perry
           Defcon 2007
Who am I?

 ●   Volunteer Tor developer
     – Work on Torbutton, TorFlow

 ●   Privacy advocate, censorship opponent
 ●   Forward+Reverse engineer at Riverbed
 ●   Flexitarian
 ●   Random Hacker
     – Wrote a page-based malloc debugger

     – Wrote an IRC bot that got quoted as a human in a
       major magazine
Why am I doing this?

 Exploit is not new or complicated... However:
 ●   Vector is not narrow or wifi-only
     – Sophisticated attackers can drain bank accounts with
       custom cable/DSL modems
     – It also harms safe Tor usage, and that pisses me off

 ●   Many sites are vulnerable, and don't seem to care.
 ●   Response: Release a tool, lower the bar even
     more.
     – Encourage (correct and secure) SSL adoption
Cookie Basics


 ●   Variables set by websites in your browser
     – Used for authentication, tracking, storage

 ●   Several properties that govern when transmitted
     – Domain

     – Path

     – Expiration

     – SSL bit (seldom used, this is where the fun begins)
The 'SideJacking' Attack

 ●   Glorified sniffer
     – Sniffs cookies transmitted via plaintext http

 ●   Janky proxy based approach to do control+saving
 ●   Completely passive: User must visit target site
 ●   Able to save domain and path info
     – Path info may be too specific

     – Can lead to issues

 ●   Admirable PR machine for such a simple hack
     – Waay exceeds my PR abilities. Little help? :)
Active HTTP Cookie Hijacking
 ●   Like CSRF, but we want the data transmitted, not
     any particular result
     – In fact, the server can reject the request

 ●   Scenario:
     – Yesterday: User logs in to mail.yahoo.com. Checks
       "Remember me."
     – Today: User visits www.cnn.com via open wifi

     – Today: We inject <img src="http://mail.yahoo.com">

     – Today: Browser transmits yahoo cookies for image

     – Today: We sniff cookies, write them to cookies.txt

     – Tomorrow: Use cookies.txt to read their mail
Active HTTPS Cookie Hijacking

 ●   New Scenario:
     – Yesterday: User logs in to httpS://mail.google.com

     – Today: User visits www.cnn.com via open wifi

     – Today: We inject <img
       src=”http://mail.google.com/mail">
     – Today: Browser transmits unprotected gmail GX
       cookie for http image fetch
     – Today: We sniff cookies, write them to cookies.txt

     – Tomorrow: Use cookies.txt to read their mail

 ●   User never even checks gmail on hostile network!
Vectors

 ●   Not just open wifi
 ●   ARP poisoning
 ●   DHCP spoofing
 ●   DSL+Cable modem networks?
     – Possible to sniff+inject on cable networks?
        ●   Some use DOCSIS auth+encryption now, but many modes
            are weak
     – May require two modems
        ●   One custom with TX/RX frequencies switched
'Manual' Attack


 ●   Aka: How people were owned for the past 365
     days.
 ●   Fire up wireshark
 ●   Fire up airpwn/netsed with custom rule
 ●   Copy cookies out of wireshark.
 ●   Lame.
Introducing CookieChaos

 Fully automated pylorcon tool for cookie gathering
 ●   Caches DNS responses
 ●   Listens for 443 connections
     – Uses cache to map IP to domain name

 ●   Stores IP+host into injection queue
 ●   Next time IP connects to ANY website:
     – Inject <img src=”http://dnsname”>

 ●   Gathers any resulting cookies and writes
     cookies.txt file for use in Firefox
Ok, so there is some configuration..



 ●   Need cookie path for injection for some sites
     – No worries. List of paths for popular sites provided!

 ●   Might want to steal other non-ssl sites too
     – No worries. Additional target list can be provided!
Demo




       Demo
