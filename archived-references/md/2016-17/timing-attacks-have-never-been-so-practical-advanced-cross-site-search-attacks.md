---
type: Whitepaper
title: "Timing Attacks Have Never Been So Practical: Advanced Cross-Site Search Attacks"
description: "Cross-site search asks a victim's logged-in service a boolean question with a cross-origin request and reads the answer from response time, since the same-origin policy hides the body. Where a reflected parameter inflates the response it is easy; otherwise the browser-based variant caches responses once and re-times them from cache, and second-order attacks plant match-all and inflating records so the empty answer becomes the larger one. Gmail names and card digits recovered."
resource: "https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf"
tags: [whitepaper, webseclist-reference, xsleak, timing-attack, side-channel, info-leak, same-origin-policy, cache, deanonymization, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-12T16:05:35+00:00"
status: stable
stale_after: 2027-08-12
sources:
  - id: original
    resource: "https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf"
    title: "Timing Attacks Have Never Been So Practical: Advanced Cross-Site Search Attacks"
    author: Nethanel Gelernter
also_at: []
authors:
  - Nethanel Gelernter
canonical_url: ""
cited_by:
  - "2016-17.md:72"
commit: ""
content_sha256: 62a2923935e4b9e7ffe3cc5704fb2e2744bfdbd159c599c86c730281b0993a4b
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 0ae9a0ceb1d4e7005ab4f06635791447030cfca52069497d6ad59b82ac4cf015
retrieved_from: "https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-12T16:05:35+00:00"
slug: timing-attacks-have-never-been-so-practical-advanced-cross-site-search-attacks
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Timing Attacks Have Never Been So Practical: Advanced Cross-Site Search Attacks

**Timing Attacks Have Never Been So Practical: Advanced Cross-Site Search Attacks** - Nethanel Gelernter, Publisher not stated.

- Published: date not stated
- Original: <https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf>
- Preserved from: https://www.blackhat.com/docs/us-16/materials/us-16-Gelernter-Timing-Attacks-Have-Never-Been-So-Practical-Advanced-Cross-Site-Search-Attacks.pdf (stored) on 2026-08-12
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Timing Attacks Have Never Been So Practical:
 Advanced Cross-Site Search
         Attacks
             Nethanel Gelernter
About me:
      Vic Tim
              Nethanel Gelernter
• Security Researcher / Hacker
  – Web application security
  – Ph.D., hacks, research papers, talks, etc.

• Cyberpion
  – Exploring new attack vectors &
    developing defenses against them


• Leading the cyber-security
  studies & research in the College
  of Management, Israel
    AgendaVic–Timpractical timing attacks
   • Cross-site search (XS-search) attacks &
     Response inflation
   • Challenges
       – When response inflation is impossible
   • Browser-based XS-search attacks
   • Second-order XS-search attacks




Nethanel Gelernter
    Cross-Site Search Attacks
   • Gelernter & Herzberg, CCS’ 2015
   • Exploit ‘search’ timing side-channel
   • ‘Search’ in private-data kept by web-service
   • Practical:
       – Tested on hundreds of Gmail users
           • Real world conditions
   • Example: find user name
       – From lists of 2000 common (first and last) names
       – Takes about a minute

Nethanel Gelernter
    Cross-site attacker model
   • Main model for web attacks
   • The victim’s browser is authenticated to services
     that hold private records (e.g., Gmail)
   • The victim visits the attacker’s website



          ...<script>…

                         Cross-site request



Nethanel Gelernter
    Cross-site attacker model
   • Cross-site search over user’s data in service
       – Attacker cannot access the content of the response
           • Same Origin Policy
       – The attacker can measure the response time (T)




          ...<script>…

                                  GET SEARCH request
                         𝑻        Response



Nethanel Gelernter
    XS-Search
           Vic Tim
                  example: user name
   • Find out whether the user is Alice or Bob…
   • Compare:
       – T(Bob): response time for ‘messages sent by Bob’
       – T(Alice): response time for ‘messages sent by Alice’



          ...<Script….>
                              GET q=in:sent&from:Bob
                     𝑻(𝑩𝒐𝒃)   Not found

                              GET q=in:sent&from:Alice
                 𝑻(𝑨𝒍𝒊𝒄𝒆)     result 1, result 2, ….

Nethanel Gelernter
   What else can XS-Search expose?
                             Email content
  Structured                    Search
  information                   History

                         Contacts
                     Name


   Relationships
   (follows, …)             Search History
Nethanel Gelernter
    XS-Search:
           Vic Tim
                   Basic Flow
   • Find the answer for a Boolean question

   • Three steps:
       – Transform the question into a search request
       – Send search requests and collect samples
       – Analyze response times  answer the question!




Nethanel Gelernter
    XS-Search:
           Vic Tim
                   Basic Flow – 1st Step
   • Is the name of the user Alice?
       – in:sent from:Alice
   • Is she related to bob@gmail.com?
       – bob@gmail.com&st=100
   • Does Alice have an affair with Charlie
       – “I love you” to:Charlie from:Alice




Nethanel Gelernter
    XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step
   • Send a Challenge request
       – Is the user name Alice?
           • True: a Full response is returned (has some content)
           • False: an empty response is returned



          ...<Script….>
                               GET q=in:sent&from:Alice
            𝑻(𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆)           ?   Unknown response




Nethanel Gelernter
    XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step
   • Send a Dummy request
       – Is the user name fdjakdhasd?
           • The response is expected to be empty




          ...<Script….>
                              GET q=in:sent&from:Alice
            𝑻(𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆)          ?    Unknown response

                              GET q=in:sent&from:fdjakdhasd
              𝑻(𝑫𝒖𝒎𝒎𝒚)                Empty response

Nethanel Gelernter
    XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step

          ...<Script….>
                                  GET q=in:sent&from:Alice
            𝑻(𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆)                ?    Unknown response
Repeat
several                           GET q=in:sent&from:fdjakdhasd
times         𝑻(𝑫𝒖𝒎𝒎𝒚)                      Empty response




                          𝑻 𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆         𝑻 𝒅𝒖𝒎𝒎𝒚
                          Sample             Sample

Nethanel Gelernter
    XS-Search: Basic Flow – 3rd Step
                           Statistical Test
                            𝑻 𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆   𝑻 𝒅𝒖𝒎𝒎𝒚
                             Sample       Sample

                     Significant difference between the
                               distributions?


                      YES                           NO
  • Dist(Challenge) ≠ Dist(Dummy)         • Dist(Challenge) = Dist(Dummy)
  •  Response for challenge is full      •  Response for challenge is empty




          User name is Alice                   User name is NOT Alice


Nethanel Gelernter
    Practical timing attacks: challenges
    • Timing attacks
        – Delays depend on dynamically-changing factors, e.g.:
          Congestion and concurrent processes in client and server


    • Practical attacks
        – Minimal time
            • Exploit also short visits of users
        – Minimal number of requests
            • Avoid detection and blocking
                – E.g., by server’s anti-DoS defenses




Nethanel Gelernter
    Response Inflation
   • Increase the size difference between full and
     empty responses
   • Larger difference in size  Larger difference in
     time




                     Larger  Slower
Nethanel Gelernter
    Response Inflation
   • Search requests have many parameters
   • Some of them are reflected in the responses as
     a function of the number of results
    https://example.com/search?reflected_parameter=value


                                      value   value   value
                                      value   value   value
        value                         value   value   value
          Empty response                Full response



Nethanel Gelernter
    Response Inflation
   • Sometimes, the attacker send very long strings
     as the value of the reflected parameter
  https://example.com/search?reflected_parameter=Long string
                                               Long string.........................
                                               Long string.........................
                                               Long string.........................
                                               Long string.........................
                                               Long string.........................
                                               Long string.........................
        Long string.........................   Long string.........................
          Empty response                       Long string.........................
                                               Long string.........................
                                                  Full response
Nethanel Gelernter
  Response inflation example
   • Exploiting Gmail search in the HTML view
   • The query itself!
       – Appears once for each entry (50 max by default)
       – Can be inflated to 8KB
   • Up to 400KB response size inflation!




Nethanel Gelernter
  But…




Nethanel Gelernter
  What if there is no response inflation?




Nethanel Gelernter
  What if there is no response inflation?
   • Browser-based XS-search
       – When there is some difference in the response size
   • Second-order XS-search
       – When there is no difference in the response size!




Nethanel Gelernter
  Browser-based (BB) XS-Search
• Statistical tests and divide and conquer
  algorithms
    – Gelernter & Herzberg, CCS’ 2015
• Browser-based timing
  side channel
    – Van Goethem et al.,
      CCS’ 2015
• Algorithmic
  improvements
Nethanel Gelernter
  Classical vs. BB timing attacks
• Classical timing attacks:
   – Load the resources from the server several
     times to collect time measurements

• Browser-based timing attacks:
   – Load all the resources from the server once
     and cache them
   – Then load them from the cache many times
     to collect time measurements
Nethanel Gelernter
  Classical vs. BB timing attacks
• Exploiting / measurements affected by
    – Classical: network delay, server processing time,
      browser processing time
    – Browser-based: browser processing time


• Can be used to differentiate between
    – Classical: large/small resources, high/low server
      processing time
    – Browser-based: large/small resources

Nethanel Gelernter
    BB XS-Search:
           Vic Tim
                   Basic Flow
   • Find the answer for a Boolean question

   • Changing only the second step of the original
     XS-Search attack




Nethanel Gelernter
    BB XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step
   • Send a Challenge request
       – Is the user name Alice?
           • True: a Full response is returned (has some content)
           • False: an empty response is returned



          ...<Script….>
                               GET q=in:sent&from:Alice

                   Cache           ?   Unknown response
                 response




Nethanel Gelernter
    BB XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step
   • Send a Dummy request
       – Is the user name fdjakdhasd?
           • The response is expected to be empty




          ...<Script….>
                              GET q=in:sent&from:Alice

                   Cache          ?    Unknown response
                 response
                              GET q=in:sent&from:fdjakdhasd

                   Cache              Empty response
                 response
Nethanel Gelernter
    BB XS-Search:
           Vic Tim
                   Basic Flow – 2nd Step

          ...<Script….>
                                GET q=in:sent&from:Alice

            Unknown and             ?    Unknown response
                empty
                                GET q=in:sent&from:fdjakdhasd
            responses are
               cached
                                        Empty response


            𝑻(𝑪𝒉𝒂𝒍𝒍𝒆𝒏𝒈𝒆)    ?    Unknown response
Repeat
many
times          𝑻(𝑫𝒖𝒎𝒎𝒚)         Empty response


Nethanel Gelernter
  Browser-based (BB) XS-Search
• Algorithmic improvements
• Not for Boolean questions
    – Basic flow – only Boolean questions
        • Is the victim’s name Alice?
• Answering multiple choice questions
    – E.g., which names out of many options are matching
      the victim?
• Optimally use the browser-based timing side-
  channel

Nethanel Gelernter
  Browser-based (BB) XS-Search
• Evaluation compared to both the previous works
• Repeating attacks/experiments done in each of
  them
    – Original XS-Search: extract victim’s names from Gmail
    – BB timing attacks: extract victim’s age from Facebook
• Significant improvement!
• In this talk: only one example



Nethanel Gelernter
  BB XS-Search vs. original XS-Search
• Gmail example
    – The goal of the attacker: extract the first and last
      names of the victim out of a list of 2000 names
    – XS-Search results:
       • 90% success rate (both first and last name
         found)
       • 1 minute on average
       • 2.6% false positive



Nethanel Gelernter
  BB XS-Search vs. original XS-Search
• How to answer multiple-answer questions
  efficiently?
• The optimized multiple term identification
  (OMTI) algorithm
    – Divide and conquer algorithm
        • Relying on the OR operator
    – Different dummy search request is sent every
      round



Nethanel Gelernter
  BB XS-Search vs. original XS-Search
• Rely on browser-based timing side-channel to
  optimize the OMTI algorithm

• Observation: empty responses are (almost)
  identical
    – No need to send dummy requests in every round
    – No need to reload the empty response in every
      round
        • Rely on previous measurements!

Nethanel Gelernter
  BB XS-Search vs. original XS-Search
• Evaluation of the attack on 5 different Gmail
  accounts
    – 15-16 times on each of them

• Significant improvement!
    – 41.6 seconds on average (compared to 1 minute)
    – 92.3% success (compared to 89.7%)
    – 1.3% false positive (compared to 2.6%)


Nethanel Gelernter
  BB XS-Search vs. original XS-Search
• DEMO




Nethanel Gelernter
  Second-order (SO) XS-Search attacks
• The problem: sometimes the size difference is
  negligible

• For example: a sentence that appears in a
  single email

                                value

          Empty response          Full response



Nethanel Gelernter
  Second-order (SO) XS-Search attacks
• Second-order attacks
    – First, manipulate the attacked web application
        • Make it (more) vulnerable
    – Exploit the vulnerability

• Second-order XS-search attacks
    – First manipulate the attacked storage
        • Create significant response inflation
    – Launch browser-based XS-search attack

Nethanel Gelernter
  Second-order (SO) XS-Search attacks
• Two SO XS-search attacks
    – Simple
    – Inflating




Nethanel Gelernter
  Second-order (SO) XS-Search attacks
• Model
    – Storage
    – Many records
    – A secret appears in one of the records


• Attacker can manipulate the storage remotely
    – E.g., email accounts
    – Another example later…


Nethanel Gelernter
  Simple SO XS-Search attack
• The problem: the secret appears only once in
  the storage

• Simple solution: the attacker will add
  additional records that contain the secret!




Nethanel Gelernter
  Simple SO XS-Search attack




Nethanel Gelernter
  Simple SO XS-Search attack
• Example: extracting Facebook password-reset
  code from Yahoo! email
                             Victim


               HTTP GET
           malicious Javascript
Repeat                                  Send reset
several                               password code
times                                                 6-digit reset code

                XS-search
                attack

            6-digit reset code

Nethanel Gelernter
  Inflating SO XS-Search attack
• Creates significant response inflation effect
    – Increase the size difference between empty and
      full response


• Unlike all the previous attacks: the empty
  response will be (significantly) larger than the
  full response



Nethanel Gelernter
  Inflating SO XS-Search attack
• The challenge of the attacker:
    – Find a secret out of a large dictionary of possible
      values

• Notations
    – M - maximal number of results
    – Match-all record – a record that contains all the
      possible values for the secret
    – Inflating record – a record that significantly
      inflates the size of every response containing it

Nethanel Gelernter
  Inflating SO XS-Search attack
• Attack process
    First part:
    – Plant one match-all inflating record in the
      storage
    – Plant additional M-1 match-all records
    – Additional record(s) may be added as a result of
      the victim's operations, or via operations
      triggered by the attacker
    Second part:
    – Launch BB XS-search attack!
Nethanel Gelernter
  Inflating SO XS-Search attack
                 Response for searching the right secret

                      New record (contains secret)
                            Match-all record

                M-1         Match-all record


                            Match-all record

                      Inflating match-all record

                Response for searching the wrong secret
Nethanel Gelernter
  Inflating SO XS-Search attack
• Inflating record in email service providers
    – Email headers
        • From
        • To




Nethanel Gelernter
  Inflating SO XS-Search attack
• Example: extracting Visa/Mastercard credit
  card number
    – Structured information
        • VVVV-XXXX-YYYY-ZZZZ


• First and last names: extract 2 out of 2000
    – Done successfully!
• Credit card number: extract 4 out of 10000
    – Should not be much harder

Nethanel Gelernter
  Inflating SO XS-Search attack
• Example: extracting Visa/Mastercard credit
  card number

• Match-all record – a record that contains all
  the possible 4-digit sequences
    – Possibly as an attachment
• Inflating match-all record – a match-all
  record with very long From field


Nethanel Gelernter
  Inflating SO XS-Search attack
• Gmail example
• How?
    – Cross-site search requests are now blocked in
      both the HTML and standard views
• Cross-site search attack without sending
  cross-site search requests?




Nethanel Gelernter
  Inflating SO XS-Search attack
• Gmail example
• Exploiting the autocomplete feature!




                                         M=4
                                         (M = maximal
                                         number of
                                         results)




Nethanel Gelernter
  Inflating SO XS-Search attack
• Gmail example: the manipulated storage




  New record (contains secret)
            Match-all record
 M-1        Match-all record
            Match-all record

  Inflating match-all record


Nethanel Gelernter
  Inflating SO XS-Search attack
• Gmail example: full response (size is small)


 New record (contains secret)

           Match-all record

M-1        Match-all record

           Match-all record




Nethanel Gelernter
  Inflating SO XS-Search attack
• Gmail example: empty response (size is very large)

          Match-all record

M-1       Match-all record

          Match-all record

 Inflating match-all record




Nethanel Gelernter
  Inflating SO XS-Search attack
• DEMO




Nethanel Gelernter
  Inflating SO XS-Search attack
• Evaluation results
    – 96% success rate within less than 50 seconds
        • Yet, in the other 4% percent, 3 out of 4 sequences
          were found, and it was possible to detect the error and
          to fix it




Nethanel Gelernter
  Stealthy SO XS-Search attacks
• The challenge: manipulations on the storage
  can be detected!

• Solution: manipulate the storage in a way that
  will not be detected by the user

• HOW?


Nethanel Gelernter
  Stealthy SO XS-Search attacks
• Emails solution: abuse anti-spam mechanisms

• The planted emails will be marked as spam
    – Users do not get notifications for spam emails
    – Users (usually) do not visit their spam folder

• Only when it is possible to search in the spam
  and in the other folders using the same request
    – E.g., Gmail
        • in:inbox OR in:spam

Nethanel Gelernter
  Stealthy SO XS-Search attacks
• Search history

• Two requirement for inflating SO XS-
  Search attack:
    – Inject records to the search history log
        • DONE: Gelernter & Grinstein & Herzberg, ACSAC
          2015
    – Inject an inflating record


Nethanel Gelernter
  Stealthy SO XS-Search attacks
• Bing
  example:
  inflating SO
  XS-Search
  attack to
  extract
  search
  history


Nethanel Gelernter
  Defenses (briefly)
• If possible - blocking cross-site search requests

• In other cases – make it harder to exploit
    – Block inflation techniques
    – Rate limit


• Like (almost) every other web-application attack
  the challenge is to find all the vulnerable spots

Nethanel Gelernter
  Conclusions
• Advanced cross-site search attacks
    – Browser-based
    – Second order
• Practical!
• Many vulnerable websites
    – Including popular ones




Nethanel Gelernter
    Thank you!



Nethanel Gelernter
                     Questions?

Nethanel Gelernter
