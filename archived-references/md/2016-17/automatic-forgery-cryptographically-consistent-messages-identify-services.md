---
type: Whitepaper
title: Automatic Forgery of Cryptographically Consistent Messages to Identify Security Vulnerabilities in Mobile Services
description: Mobile apps sign, hash or encrypt their API requests, so servers assume a client cannot forge a valid message. AUTOFORGE reverse-engineers how a client builds messages and automatically produces cryptographically consistent ones, letting an attacker brute-force passwords, probe leaked passwords and hijack Facebook access tokens against app backends.
resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf"
tags: [whitepaper, webseclist-reference, auth-bypass, oauth, android, rest-api, https, tooling, dynamic-analysis, measurement-study, owasp-a01-2021, owasp-a02-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T20:59:37+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf"
    title: Automatic Forgery of Cryptographically Consistent Messages to Identify Security Vulnerabilities in Mobile Services
    author: Chaoshun Zuo, Wubing Wang, Rui Wang, Zhiqiang Lin
also_at: []
authors:
  - Chaoshun Zuo
  - Wubing Wang
  - Rui Wang
  - Zhiqiang Lin
canonical_url: ""
cited_by:
  - "2016-17.md:69"
commit: ""
content_sha256: 507a12ae69197407b38e45ff83640998dbaf9ad2d71e26df3d8e172c928b5338
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 6d5ce4d54e9503712e36e8798aa7285752e9e84e75f3af3852ce4de59ac2896f
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-14T20:59:37+00:00"
slug: automatic-forgery-cryptographically-consistent-messages-identify-services
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Automatic Forgery of Cryptographically Consistent Messages to Identify Security Vulnerabilities in Mobile Services

**Automatic Forgery of Cryptographically Consistent Messages to Identify Security Vulnerabilities in Mobile Services** - Chaoshun Zuo, Wubing Wang, Rui Wang, Zhiqiang Lin, Publisher not stated.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/automatic-forgery-cryptographically-consistent-messages-identify-security-vulnerabilities.pdf (stored) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Automatic Forgery of Cryptographically Consistent
     Messages to Identify Security Vulnerabilities in
                    Mobile Services

               Chaoshun Zuo                                 Wubing Wang                        Rui Wang                      Zhiqiang Lin
       University of Texas at Dallas               University of Texas at Dallas             AppBugs, Inc            University of Texas at Dallas
        cxz153430@utdallas.edu                      wxw132530@utdallas.edu                  rui@appbugs.co            zxl111930@utdallas.edu


    Abstract—Most mobile apps today require access to remote                             To save client storage and energy consumption, there is usu-
services, and many of them also require users to be authenticated                    ally a remote party involved in mobile computing. Specifically,
in order to use their services. To ensure the security between the                   similar to the traditional desktop web-browser based computing,
client app and the remote service, app developers often use cryp-                    a mobile app also often needs to interact with a remote service,
tographic mechanisms such as encryption (e.g., HTTPS), hashing                       e.g., to retrieve the data of a user’s interest such as the weather
(e.g., MD5, SHA1), and signing (e.g., HMAC) to ensure the confi-
dentiality and integrity of the network messages. However, these
                                                                                     information where the user lives. To provide customized services
cryptographic mechanisms can only protect the communication                          and also prevent resource abuse, a typical step to get the access is
security, and server-side checks are still needed because malicious                  through user authentication. Therefore, many mobile apps today
clients owned by attackers can generate any messages they wish.                      require users to register with the service providers first, and then
As a result, incorrect or missing server side checks can lead to                     use their services after authentication.
severe security vulnerabilities including password brute-forcing,
leaked password probing, and security access token hijacking. To                         As a result, it is crucial to ensure the security of the authentica-
demonstrate such a threat, we present AUTO F ORGE, a tool that                       tion process. There are various ways that mobile app developers
can automatically forge valid request messages from the client side                  have used over the years to achieve this. For instance, they can
to test whether the server side of an app has ensured the security of                encrypt the traffic between the mobile app and the server (e.g.,
user accounts with sufficient checks. To enable these security tests,                through HTTPS), they can hash (e.g., through MD5, SHA1) the
a fundamental challenge lies in how to forge a valid cryptographi-                   user password before sending to the server for authentication, and
cally consistent message such that it can be consumed by the server.                 they can also sign (e.g., through HMAC) each message generated
We have addressed this challenge with a set of systematic tech-
niques, and applied them to test the server side implementation of
                                                                                     from the mobile app. Correspondingly, on the server side, the
76 popular mobile apps (each of which has over 1,000,000 installs).                  server needs to decrypt each message, validate the hash or the
Our experimental results show that among these apps, 65 (86%) of                     signature of the message, and reject all the invalid ones.
their servers are vulnerable to password brute-forcing attacks, all
(100%) are vulnerable to leaked password probing attacks, and 9                          While it appears to be secure if the server rejects all of
(12%) are vulnerable to Facebook access token hijacking attacks.                     the invalid messages, such security is based on the assumption
                                                                                     that a client cannot forge a valid message. Unfortunately, in
                                                                                     this paper we show that such an assumption is false, and a
                                                                                     client can completely break the message authentication including
                           I.    I NTRODUCTION                                       cryptographic hashing and signing and generate “legal” messages
                                                                                     for the server to consume. This is because an attacker can
    Today mobile apps are everywhere. They range from simple                         completely control a client app (e.g., running in an emulator),
information gathering applications, such as for retrieving email,                    analyze (i.e., reverse engineer) how a valid message is generated,
news, and weather, to feature rich applications, such as for                         and correspondingly generate forged messages.
mobile gaming, online banking/shopping, and blogging/chatting.
In Google Play, which is one of the most popular app stores,                             Consequently, in addition to message decryption, hashing and
there are over 1.6 million Android apps in total, with more than                     signature checking, the server also needs to perform additional
50 billion downloads [4]. Meanwhile, the popularity of mobile                        security checks. Otherwise, this can lead to a number of security
apps has continued to rise due to their increasingly prevalent                       vulnerabilities. One such vulnerability is password brute-forcing.
usage across mobile device (e.g., smartphone and tablet) users.                      In particular, if the server does not maintain the state of how
                                                                                     many passwords a user has tried while attempting to login within
                                                                                     a certain time window, an attacker would be able to figure out the
Permission to freely reproduce all or part of this paper for noncommercial
purposes is granted provided that copies bear this notice and the full citation
                                                                                     user’s password by continuously guessing it. Also, being able to
on the first page. Reproduction for commercial purposes is strictly prohibited       forge valid request messages would allow attackers to probe the
without the prior written consent of the Internet Society, the first-named author    existence of certain users using leaked usernames and passwords
(for reproduction of an entire paper only), and the author’s employer if the paper   (due to the common practice of password reuse among many
was prepared within the scope of employment.                                         users [15], [21]). Meanwhile, the lack of a server side security
NDSS ’16, 21-24 February 2016, San Diego, CA, USA
Copyright 2016 Internet Society, ISBN 1-891562-41-X                                  check can also lead to an access token hijacking attack [2],
http://dx.doi.org/10.14722/ndss.2016.23146                                           [36]. Specifically, an attacker can forge a valid message by
using a stolen token from other apps to bypass the server side                 GET /api/rest/app_server.php?sign_method=md5&client=android&ap
                                                                               p_key=A4H0P4JN&format=json&cv=3.9.0&country_code=US&country=US
authentication of the target app (if the server is vulnerable) and             A&currency=USD&timestamp=2015-08-05%2003%3A19%3A26&v=1.2&pwd=6
then use the target app’s service. In addition, there could also               95409430D3127CB158002B92FEC1831&email=testappserveralpha%40gma
                                                                               il.com&method=vela.user.login&app_secret=4ce19ca8fcd150a4w4pj9
exist a SQL injection attack if the server does not perform the                llah24991ut&language=en&sign=94056C9BE079510079D0BF9A372B4E65&
sanitation check of the “legal” messages from the client since an              keys=app_key%2Capp_secret%2Cclient%2Ccountry%2Ccountry_code%2C

attacker is now able to forge any messages.
                                                                               currency%2Ccv%2Cemail%2Cformat%2Clanguage%2Cmethod%2Cpwd%2Csig
                                                                               n_method%2Ctimestamp%2Cv&sid=ajnrr9b3b2ktg11dcucg66l683 HTTP/1.     用户名
                                                                                                                                                   密码：
                                                                               1
                                                                               x-newrelic-id: XAYCV1ZADgsAUFRTBQ==
    To demonstrate the threat of these security vulnerabilities                User-agent: LightInTheBox 3.9.0(Android; 16; 4.1.1; 480_752;
at the server side, this paper presents AUTO F ORGE, a tool that               WIFI; generic; en)
                                                                               Host: api.miniinthebox.com
can automatically forge cryptographically consistent messages                  Connection: Keep-Alive
                                                                               Accept-Encoding: gzip
for the security testing of mobile services when given a mobile                Cookie: cookie_test=please_accept_for_session;
app. It contains a set of black-box techniques including API                   AKAMAI_FEO_TEST=B; ASRV=A_201505081100
hooking, lightweight protocol field reverse engineering, and                                    (a) Client Request with a Wrong Password
request message forgery to automatically generate valid request
messages. At a high level, AUTO F ORGE works as follows: given                 {"result":"fail","code":"1001001","info":[],"error_msg":["Inva
an app and a few legal inputs (e.g., a username with a correct and             lid email or password (User)"]}

wrong password), it observes how the user input is processed                                   (b) Server Response for the Wrong Password
by only hooking a set of well known cryptographic APIs, and
                                                                               GET /api/rest/app_server.php?sign_method=md5&client=android&ap
intercepts the outgoing messages with a man-in-the-middle                      p_key=A4H0P4JN&format=json&cv=3.9.0&country_code=US&country=US
network proxy; next, it infers the message fields and their                    A&currency=USD&timestamp=2015-08-05%2003%3A20%3A01&v=1.2&pwd=A
                                                                               9672D9F5F7414D5B996964A7F07727E&email=testappserverbeta%40gmai
semantics by diffing the messages and measuring the degree of                  l.com&method=vela.user.login&app_secret=4ce19ca8fcd150a4w4pj9l
the differences; after that, it forges the messages by only mutating           lah24991ut&language=en&sign=D2A173BEB8F169DD1A81CA8D59AD2C69&k
                                                                               eys=app_key%2Capp_secret%2Cclient%2Ccountry%2Ccountry_code%2Cc
the protocol fields of interest (e.g., username and password) and              urrency%2Ccv%2Cemail%2Cformat%2Clanguage%2Cmethod%2Cpwd%2Csign
generating the cryptographically computed fields through an                    _method%2Ctimestamp%2Cv&sid=ajnrr9b3b2ktg11dcucg66l683 HTTP/1.
                                                                               1
out-of-box re-execution (i.e., replay) of the cryptographic APIs.              x-newrelic-id: XAYCV1ZADgsAUFRTBQ==
                                                                               User-agent: LightInTheBox 3.9.0(Android; 16; 4.1.1; 480_752;
                                                                               WIFI; generic; en)
                                                                                                                                                   用户名
    We have implemented AUTO F ORGE, and tested with 76
popular mobile services by running the corresponding mobile
                                                                               Host: api.miniinthebox.com
                                                                               Connection: Keep-Alive
                                                                                                                                                   密码：
                                                                               Accept-Encoding: gzip
apps. One criteria for selecting which service to test is based on             Cookie: cookie_test=please_accept_for_session;
                                                                               AKAMAI_FEO_TEST=B; ASRV=A_201505081100
whether the client apps have been installed over one million times.
We have obtained very encouraging experimental results. Among                                  (c) Client Request with a Correct Password
the 76 tested services, we found that 65 (86%) servers (including
                                                                               {"result":"success","code":"1000000","info":{"sessionkey":"6a6
CNN, Expedia, iHeartRadio, and Walmart) are vulnerable                         ac7ff985eb08524e89392ec1addcb"},"error_msg":[]}
to password brute-forcing attacks, all (100%) of them are
vulnerable to leaked password probing attacks, and 9 (12%) of                                 (d) Server Response for the Correct Password

them are vulnerable to Facebook access token hijacking attacks.            Fig. 1. Network Traces of the Login Attempts of miniinthebox App.

   In short, we make the following contributions:
                                                                                        II.    BACKGROUND AND OVERVIEW
   •     We show that the server side implementation of many                   The goal of this paper is to develop techniques that can auto-
         mobile apps lacks sufficient security checks and is vul-          matically forge valid cryptographically consistent client request
         nerable to a number of malicious login attacks including          messages, and apply them to find the security vulnerabilities
         password brute-forcing, leaked password probing, and              (such as password brute-forcing) in the server side. In this section,
         access token hijacking.                                           we provide the necessary background and give an overview of
                                                                           how we achieve this goal. We first start from a running example
   •     We present a set of lightweight techniques to auto-               (§II-A) to illustrate the challenges and present our observation
         matically forge cryptographically consistent messages.            (§II-B), and then we define our research problem and overview
         Our technique does not require sophisticated reverse              our system (§II-C).
         engineering of the mobile apps, and instead by only
         hooking a set of well known cryptographic APIs and                A. A Running Example
         using a lighweight protocol reverse engineering with                  To understand our problem better, Fig. 1 illustrates
         an out-of-the-box re-execution of the cryptographic               the network traces gathered from the popular Android
         functions we successfully forge valid request messages.           app miniinthebox. It is an online shopping app which
                                                                           has one-to-five million installs according to Google Play.
   •     We have implemented our techniques in AUTO F ORGE,                As shown in Fig. 1, we performed two tests: the first
         and applied it to test 76 popular mobile apps (each has           is to enter a wrong password (1234567890) for user
         over one million installs), and we have found that the ma-        testappserveralpha@gmail.com, and the client
         jority of these app servers are vulnerable to malicious lo-       request message and the server response message are
         gin attempts. We have made responsible disclosure and             illustrated in Fig. 1(a) and (b); the other is to enter a
         notified each vulnerable app vendor, and three of them            correct password (ThisIsPWD!) for a different user,
         have patched their service shortly after our notification.        testappserverbeta@gmail.com, whose request and

                                                                       2
response messages are illustrated in Fig. 1(c) and (d), respectively.          •    Generating the valid request messages. Having rec-
We can notice from the trace that this app uses the plain-text                      ognized the message fields of our interest, we also have
HTTP protocol, and there are many app-defined protocol fields                       to finally generate the new valid messages for our testing.
in this login request message such as sign_method, client,                          While it might be possible to dynamically instrument
app_key, format, pwd, email, sign, keys, and sid, etc.                              the app and use an in-context argument substitution of
                                                                                    the cryptographic APIs to generate the message, or just
    Among these protocol fields, a few of them are of special
                                                                                    fuzz the graphic user interface to generate the “legal”
interest to us such as pwd, email, and sign if we aim to
                                                                                    messages, these approaches appear to be more expensive
perform a password guessing test. That is, we can keep mutating
                                                                                    or lack flexibility (e.g., requiring recognizing and
a user password (from 1234567890 to some other dictionary
                                                                                    controlling of the user interface, rolling back the state of
guided guesses) and test whether the server accepts or rejects
                                                                                    the login event, or only substituting user visible fields)
our password. However, we can notice that the user entered
                                                                                    and instead we would like to have an out-of-the-box
password 1234567890 has been hashed (or encrypted) to value
                                                                                    approach to forge any “legal” messages as we wish.
695409430D3127CB158002B92FEC1831. Meanwhile,
there is a sign field that is a cryptographic signature of the client
request message, and the server will verify whether the sign                Key Insights and Solutions. At a high level, we can notice
field is correct or not. Also, we can notice that the value of the          that essentially we are performing protocol reverse engineering
sign field is significantly different in the two request messages.          in that we have to recognize the protocol fields, understand the
                                                                            request and response messages (to a certain degree), and generate
    Therefore, in order to generate valid request messages, we              valid messages with cryptographically computed fields. While
just need to recognize the message fields of interest to us such            we could adopt many of the existing protocol reverse engineering
as the pwd and sign field, mutate the corresponding field (e.g.,            techniques (e.g., [10], [14], [22], [25], [39]) to analyze at the
the pwd), and generate valid cryptographically consistent fields            instruction level how a message is generated, such an approach
(e.g., sign) of the request message. In addition, we also need              also appears to be more expensive since it tracks the data depen-
to monitor the response of the server packets, to terminate the             dency at the instruction level. Having analyzed the executions
test once we find a correct password.                                       of a number of apps manually, we have obtained the following
B. Observation                                                              insights to address those technical challenges discussed above:

Challenges. From our running example, we can notice that                       •    Inferring the message fields with diffed input. Al-
there are a number of challenges in order to perform server                         though it is challenging to recognize each field in a
side security testing:                                                              given message, we realize that we need to infer only a
                                                                                    few of them based on our interests (e.g., only the email,
    •    Recognizing the protocol fields. Typically a network                       pwd, and sign fields in our running example). Since
         message consists of a number of fields; some of them                       we control the app execution, we can feed the app with
         are standard protocol fields (e.g., GET), while some are                   controlled input such as a correct password and a wrong
         user defined. While it might be easier to identify the                     password. By observing the request message differences,
         standard fields for well-known protocols, it will be much                  we can identify the diffed fields. The fields of our
         more challenging to recognize the user defined fields,                     interest must be within the diffed fields. For instance,
         especially considering the fact that different developers                  as shown in Fig. 1(a) and (c), there are only four
         can name a field differently (e.g., they might use either                  diffed fields: timestamp, pwd, email, and sign,
         pwd, passwd, or password for a password field).                            and we can quickly narrow them down by using request
                                                                                    message diffing.
    •    Identifying the cryptographic functions. To
         encrypt or hash a password, different apps can                        •    Dynamically hooking well-known cryptographic
         also use different cryptographic functions (e.g.,                          APIs. While an app can use different types of
         MD5,SHA-1,AES,DES, etc.). Similarly, to generate                           cryptographic functions for encryption, hashing and
         the signature of a protocol message, apps can also                         signing of a message, there are only a limited number of
         use different message authentication code (MAC)                            them. Meanwhile, even though there might be some user
         generation functions (e.g., HMAC,HMAC-SHA-1). We                           defined cryptographic functions, these apps would be
         need to identify the functions that are used by the                        rare because of the “never-implement-your-own-crypto”
         testing app, so as to regenerate the corresponding                         practice [30]. Therefore, we can dynamically hook the
         password, hash, or signature. Meanwhile, an app might                      well-known cryptographic APIs used by an app, extract
         use their own private cryptographic functions, though                      their arguments (usually the user typed input such as
         this is not encouraged.                                                    the password or the fields that need to be digitally
                                                                                    digested or signed will appear in the arguments) and
    •    Deciding when to terminate. We cannot perform a                            return values that allow us to change only the arguments
         brute-force test forever, and we must terminate at some                    of our interest. Then, we can replay the execution of
         point. While it might appear to be very simple by parsing                  the cryptographic APIs with the new arguments to
         the response messages from the server (e.g., by looking                    re-generate new valid messages.
         at the success or fail string as shown in Figure 1
         (b) and (d)), such an approach would be too app-specific              •    Labeling response message with controlled input.
         since different apps can use different strings and differ-                 Similar to how we infer the message fields through
         ent encoding to represent a succeeded or failed attempt.                   diffed input, we can also infer the type of the response

                                                                        3
                                                    5                                                     6     Request      6
                         API Traces                                    Request Message Forgery                  Messagei

                                2
                                                Request                                                         Request
   Input0
                                                Message0                                                       Messageg0
               1         API Hooking        2              2           Message Field Inference            3                  3               Server
                                                Request                                                         Request
   Input1
                                                Message1                                                        Message1

                                                                                                          4     Response     4
                            App                                    Response Message Labeling                    Message


                         Emulator
Fig. 2. An Overview of How Our AUTO F ORGE Works.                Man‐in‐the‐Middle Proxy


            message (namely, the success or failure login messages          the protocol fields through input message diffing. Note that for
            sent by the server) with controlled input diffing. More         HTTPS, we can intercept their traffic and decrypt it by using a
            specifically, since we control the app, we can test the         man-in-the-middle proxy. This is because we can easily install
            app with a correct password and treat the response              a self-signed root certificate in our testing Android device, and
            message as a black box without looking at any of                intercept and decrypt the traffic in a network proxy.
            its content by assigning it a success tag; similarly,
            we can send a wrong password, and assign a failure
            tag for the corresponding response message. There               Overview. We have designed a set of systematic techniques in
            will be some other types of messages, such as a                 our prototype AUTO F ORGE. As illustrated in Fig. 2, there are
            too-many-login-attempts warning message sent from               four key components inside AUTO F ORGE: one is located inside
            the server, but we can just assign all of these messages        an Android emulator, and the other three are located inside a
            with an other tag regardless of their contents.                 man-in-the-middle (MitM) proxy. There are in total six major
                                                                            steps in order to forge a cryptographically consistent request
   •        Out-of-the-box re-execution of the cryptographic                message:
            functions. An interesting observation for cryptographic
            function is that their algorithms are well-known, and               •     Step ¶. To test a given app, we first need to provide
            different implementations by different programming                        the necessary input that generates the desired message
            languages such as Java, C, or Python would produce                        fields. For instance, to test whether a service is
            the same output when given the same input. Therefore,                     vulnerable to password brute-forcing attack, we need
            we can perform an out-of-the-box re-execution of the                      to enter two testing inputs1 : a testing username with the
            cryptographic functions to forge the desired request                      correct password for this user, and a testing username
            messages by feeding them with the corresponding                           with a wrong password for this user, respectively. To
            arguments.                                                                have the correct password, we need to register with
                                                                                      the service first. Therefore, Step ¶ is the only manual
                                                                                      step that involves human intervention. All other steps
C. Overview
                                                                                      in AUTO F ORGE are automatically executed.
Problem Statement. After describing the challenges and our
                                                                                •     Step ·. Once the app gets loaded and the input is fed
observations, next we would like to formally define our problem.
                                                                                      to the app, our first component, API Hooking, will in-
It can be summarized as follows: Given an app and traced
                                                                                      terpose the white-listed cryptographic APIs. Whenever
input messages, the goal of AUTO F ORGE is to automatically
                                                                                      one of the APIs is executed, we retrieve its input and
generate a new input message with mutated fields that satisfy
                                                                                      output of this API from its arguments and return values
the cryptographic constraints of the messages in an efficient and
                                                                                      based on the specification of the API. Such information
black-box manner.
                                                                                      is saved in a trace log. Later we will traverse the log file
                                                                                      to generate the new request message in Step º. Mean-
Scope and Assumptions. In this paper, we focus on testing the                         while, the execution of the app inside our emulator will
mobile services of Android apps. As to-be-demonstrated, we                            automatically generate a request message, which will be
only need the knowledge of publicly available cryptographic                           fed to our second component, Message Field Inference,
APIs (e.g., the parameters and return values) as well as the                          and the copy of this message will also be sent to the
capability of hooking these functions, and we assume these                            server at Step ¸ or right after the execution of Step ·.
information is available. In addition, since our goal is to generate
valid client side request messages, we need to reverse engineer                 •     Step ¸. By aligning the two request messages and
the protocol fields. In this paper, we focus on the apps that use                     diffing each message field, our Message Field Inference
text-based protocols including HTTP/HTTPS because we can                              directly identifies the diffed message fields. Then it
directly identify the protocol fields based on text differences.
                                                                              1 Strictly speaking, we need four inputs for the password brute-force testing.
  Interestingly, many mobile apps in Android do use                         For space reasons we do not show them completely in Fig. 2. We will explain
HTTP/HTTPS protocols, which makes it trivial in identifying                 why we need four inputs in §III-C.


                                                                        4
          measures the similarity of the values between each                                •    Encryption. To encrypt a message, an Android
          diffed field. Based on the degree of differences, it                                   app first needs to initialize a cryptographic
          identifies the cryptographically computed fields. A                                    key class (e.g., by calling new DesKeySpec
          few other fields can also be inferred based on the                                     and          SecretKeyFactory.getInstance
          pattern of the string (as we focus on text protocols),                                 to generate the DES keys), and then it calls
          e.g. the timestamp field, which has a certain string                                   cipher.getInstance with parameters such
          inside such as the date of the test. The request message                               as “DES/CBC/PKCS5Padding” to get a cipher
          generated at Step · is sent to the server if it has not                                instance, and then init this cipher with the
          been sent yet. Note that the execution of Step ¸ can                                   necessary parameters (e.g., the initialized keys). Then,
          be performed offline, and the system does not need to                                  app developers have to give the input message (using a
          wait until this step is finished to execute Step ¹.                                    byte array) to this cipher for encryption. There are
                                                                                                 two ways to do that: the first is to call API doFinal to
    •     Step ¹. The server sends a response message to the                                     pass the input and get output as cipher text; the second
          client, which is intercepted by our third component,                                   way is to call API update to pass the input, and then
          Response Message Labeling. Based on the type                                           call API doFinal to produce the cipher text.
          of the message (e.g., the correct password, or a
          wrong password) we sent to the server, it assigns a                               •    Hashing. Obtaining a digest of a message (without us-
          corresponding label (or tag) to the response message                                   ing any keys) is achieved by using MessageDigest
          (e.g., a success tag or a failure tag). We will                                        (e.g., md5, or sha1). In this case, the app calls
          also compare the tag for all later response messages                                   MessageDigest.getInstance with string “MD5”
          (generated after Step ») to decide whether we should                                   as argument to get a MD5 MessageDigest instance, and
          continue executing Step » based on the nature of the                                   then it calls the update method to add the message
          security testing we perform (e.g., repeatedly guessing                                 that needs to be digested. Finally, it calls digest to
          a password until we get a success response).                                           produce the desired hashing result.

    •     Step º. Having assigned the tag for the two                                       •    Signing. To sign a message (ensuring both integrity
          initial response messages, and meanwhile having                                        and authenticity), a message authentication code (i.e.,
          collected the input and output traces for each of the                                  Mac) is used. Similar to encryption, the app also has to
          executed cryptographic APIs, our last component,                                       generate the corresponding keys first (e.g., by calling
          Request Message Forgery, re-executes these executed                                    new SecretKeySpec with string “HmacSHA1”),
          cryptographic functions with the mutated input and                                     get a Mac instance by calling Mac.getInstance
          finally generates the valid request message by replacing                               with a string (e.g., “HmacSHA1”), and then initialize the
          the corresponding field in the initial request message.                                Mac with the generated key. Next, it calls doFinal,
                                                                                                 which takes the to be hashed messages as input and
    •     Step ». The newly generated request message is sent                                    finally produces the hashed messages as output. It could
          to the server, and its response will be intercepted by our                             also first call update to add the message, and then call
          MitM proxy. Then we continue the execution to Step ¹.                                  doFinal with an empty argument.

                       III.    D ETAILED D ESIGN                                            Therefore, we hook each of the APIs (the handler and the
                                                                                        function name) described in Table I, and log their arguments
   In this section, we present the detailed design of the four                          and return values. We log the arguments of these APIs right
key components of AUTO F ORGE, based on the order of their                              before their execution, and their return values as well as updated
execution.                                                                              arguments if there are any right after their execution. A sample
                                                                                        of our log is presented in Fig. 3.
A. API Hooking
                                                                                        B. Message Field Inference
     The first component of AUTO F ORGE hooks the well-defined
cryptographic functions to intercept their arguments and return                             Next, we need to identify the protocol fields of our interest
values such that we can replay their execution to produce the                           in the request message. We divide this problem into two
desired cryptographically consistent fields. The Android SDK                            sub-problems: (1) message field identification that splits the
provides a set of cryptographic Java APIs. Based on their                               messages into a set of fields, and (2) field semantic inference
specification as well as our manual analysis with a number of                           that infers the meaning of the identified fields. The outcome of
apps, we have obtained 61 commonly used cryptographic APIs.                             this step is the fields we aim to mutate, such as pwd and sign
Their prototypes are presented in Table I. Most apps2 directly use                      in our running example.
them to encrypt input data (with the crypto.cipher class),
generate a hash (with the security.MessageDigest class)
or sign the input by generating a message authentication code                           1) Message Field Identification. Since we only need to
(i.e., with the crypto.Mac class). Based on our manual                                  substitute a few fields in our security testing, there is no need to
analysis with a number of apps, we find these APIs are usually                          identify all protocol fields. In addition, since we control the input
used in the following way:                                                              to the testing app, we can observe the field differences in the
                                                                                        request messages if we feed different inputs to the app. Based
   2 There are apps that use native code and we need to hook the native code APIs       on these two insights, we can identify the fields that get changed
in this case.                                                                           by aligning the two request messages that are generated with

                                                                                    5
                    TABLE I.      T HE LIST OF THE HOOKED CRYPTOGRAPHIC API S , AND ITS PARAMETERS AND RETURN VALUES .
      Return Value         API name                                                Parameters
      SecretKeySpec        javax.crypto.spec.SecretKeySpec.SecretKeySpec<init>     (byte[] key, String algorithm)
      SecretKeySpec        javax.crypto.spec.SecretKeySpec.SecretKeySpec<init>     (byte[] key, int offset, int len, String algorithm)
      DESedeKeySpec        javax.crypto.spec.DESedeKeySpec.DESedeKeySpec<init>     (byte[] key)
      DESedeKeySpec        javax.crypto.spec.DESedeKeySpec.DESedeKeySpec<init>     (byte[] key, int offset)
      DESKeySpec           javax.crypto.spec.DESKeySpec.DESKeySpec<init>           (byte[] key)
      DESKeySpec           javax.crypto.spec.DESKeySpec.DESKeySpec<init>           (byte[] key, int offset)
      X509EncodedKeySpec   java.security.spec.X509EncodedKeySpec<init>             (byte[])
      SecretKeyFactory     javax.crypto.SecretKeyFactory.getInstance               (String algorithm)
      SecretKeyFactory     javax.crypto.SecretKeyFactory.getInstance               (String algorithm, String provider)
      SecretKeyFactory     javax.crypto.SecretKeyFactory.getInstance               (String algorithm, Provider provider)
      SecretKey            javax.crypto.SecretKeyFactory.generateSecret            (KeySpec keySpec)
      IvParameterSpec      javax.crypto.spec.IvParameterSpec.IvParameterSpec       (byte[] iv)
      KeyFactory           java.security.KeyFactory.getInstance                    (String algorithm)
      KeyFactory           java.security.KeyFactory.getInstance                    (String algorithm, String provider)
      KeyFactory           java.security.KeyFactory.getInstance                    (String algorithm, Provider provider)
      PublicKey            java.security.KeyFactory.generatePublic                 (KeySpec keySpec)
      Mac                  javax.crypto.Mac.getInstance                            (String algorithm)
      Mac                  javax.crypto.Mac.getInstance                            (String algorithm, String provider)
      Mac                  javax.crypto.Mac.getInstance                            (String algorithm, Provider provider)
      void                 javax.crypto.Mac.init                                   (Key key)
      void                 javax.crypto.Mac.init                                   (Key key, AlgorithmParameterSpec params)
      void                 javax.crypto.Mac.update                                 (byte input)
      void                 javax.crypto.Mac.update                                 (byte[] input)
      void                 javax.crypto.Mac.update                                 (ByteBuffer input)
      void                 javax.crypto.Mac.update                                 (byte[] input, int offset, int len)
      byte[]               javax.crypto.Mac.doFinal                                ()
      byte[]               javax.crypto.Mac.doFinal                                (byte[] input)
      void                 javax.crypto.Mac.doFinal                                (byte[] output, int outOffset)
      MessageDigest        java.security.MessageDigest.getInstance                 (String algorithm)
      MessageDigest        java.security.MessageDigest.getInstance                 (String algorithm, String provider)
      MessageDigest        java.security.MessageDigest.getInstance                 (String algorithm, Provider provider)
      void                 java.security.MessageDigest.update                      (byte input)
      void                 java.security.MessageDigest.update                      (byte[] input)
      void                 java.security.MessageDigest.update                      (ByteBuffer input)
      void                 java.security.MessageDigest.update                      (byte[] input, int offset, int len)
      byte[]               java.security.MessageDigest.digest                      ()
      byte[]               java.security.MessageDigest.digest                      (byte[] input)
      int                  java.security.MessageDigest.digest                      (byte[] buf, int offset, int len)
      Cipher               javax.crypto.Cipher.getInstance                         (String transformation)
      Cipher               javax.crypto.Cipher.getInstance                         (String transformation, String provider)
      Cipher               javax.crypto.Cipher.getInstance                         (String transformation, Provider provider)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key)
      void                 javax.crypto.Cipher.init                                (int opmod,Certificate certificate)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key,SecureRandom random)
      void                 javax.crypto.Cipher.init                                (int opmod,Certificate certificate,SecureRandom random)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key,AlgorithmParameterSpec params)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key,AlgorithmParameterSpec params,SecureRandom random)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key,AlgorithmParameters params)
      void                 javax.crypto.Cipher.init                                (int opmod,Key key,AlgorithmParameters params,SecureRandom random)
      byte[]               javax.crypto.Cipher.update                              (byte[] input)
      byte[]               javax.crypto.Cipher.update                              (byte[] input,int inputOffset,int inputLen)
      int                  javax.crypto.Cipher.update                              (ByteBuffer input, ByteBuffer output)
      int                  javax.crypto.Cipher.update                              (byte[] input,int inputOffset,int inputLen,byte[] output)
      int                  javax.crypto.Cipher.update                              (byte[] input,int inputOffset,int inputLen,byte[] output,int outputOffset)
      byte[]               javax.crypto.Cipher.doFinal                             ()
      byte[]               javax.crypto.Cipher.doFinal                             (byte[] input)
      int                  javax.crypto.Cipher.doFinal                             (byte[] output, int outputOffset)
      byte[]               javax.crypto.Cipher.doFinal                             (byte[] input,int inputOffset,int inputLen)
      int                  javax.crypto.Cipher.doFinal                             (byte[] input,int inputOffset,int inputLen,byte[] output)
      int                  javax.crypto.Cipher.doFinal                             (byte[] input,int inputOffset,int inputLen,byte[] output,int outputOffset)
      int                  javax.crypto.Cipher.doFinal                             (ByteBuffer input, ByteBuffer output)



the two controlled inputs. As shown in our running example, if                   login attempt, we can first enter a wrong password, and then enter
we directly align (with a global optimal matching) the messages                  a correct password. We would then just need to align the two most
in Fig. 1(a) and (c), we immediately identify four fields (three                 recently generated request messages. Though this is a heuristic
are of special interest to us).                                                  approach, it works well in practice, and in our all testing apps we
                                                                                 directly identify the two request messages desired for alignment.
    Then, the next question is how to find the two desired request
messages for the alignment. A straightforward approach would                         After that, we compare the two request messages by us-
be to align all request messages generated from the start of                     ing a pairwise string sequence alignment algorithm, namely
the app to the moment right after we trigger the login event.                    the Needleman-Wunsch algorithm [27]. It uses dynamic pro-
Presumably the two executions will share almost the same                         gramming and can achieve an optimal global matching, which
execution path except those code that handles input differences.                 perfectly fits our goal. Meanwhile, this algorithm has been used
While we can take such an approach, we realize that we can use                   in the Protocol Informatics (PI) [8] project, and showed great
a slightly better way to get the desired messages within only one                promise for text based protocol field inference. Therefore, we
execution of the app. In particular, after we load the app to test the           just integrate this algorithm by following how PI uses it.

                                                                           6
       TABLE II.    T HE L EVENSHTEIN S IMILARITY R ATIO OF THE
                             DIFFED - FIELDS .
                                                                            message (Fig. 1(b)), and a correct password response message
                                                                            (Fig. 1(d)). Then we can send another pair of messages, one with
       Field Name            String0 vs. String1           LSR
                                                                            a wrong password and the other with the correct password, and
                       2015-08-05%2003%3A19%3A26
       timestamp                                           0.84             use the following algorithm to label the response messages:
                       2015-08-05%2003%3A20%3A01
                    testappserveralpha%40gmail.com
         email
                     testappserverbeta%40gmail.com
                                                           0.88                •    If both the wrong (or correct) password response mes-
                    695409430D3127CB158002B92FEC1831                                sages are content identical to the previously observed
          pwd                                              0.34
                    A9672D9F5F7414D5B996964A7F07727E                                ones, then we directly use the corresponding entire
         sign
                    94056C9BE079510079D0BF9A372B4E65
                                                           0.28
                                                                                    message as a signature to classify whether it is a wrong
                    D2A173BEB8F169DD1A81CA8D59AD2C69                                (or correct) password response message.

                                                                               •    Otherwise, we align the two same type of response mes-
2) Field Semantic Inference. Having identified the diffed fields,                   sages (i.e., two correct password response messages, or
we then infer their meanings. There are mainly three sources that                   the two wrong password response messages) using again
lead to the field differences: (1) system data such as timestamp,                   the Needleman-Wunsch algorithm [27], but we keep the
(2) user input, and (3) the cryptographic computation. We                           common substring (instead of the diffed substring we
present the following three strategies to infer their meanings:                     used in Step ¸) and use it as a signature to represent a
                                                                                    correct password response message or a wrong password
   •      Pattern Matching. System data such as timestamp                           response message.
          usually has patterns, and we can then use the pre-defined
          patterns to match them. For instance, if we locate a
          date sub-string such as 2015-08-05 in the two diffed              After we have acquired the signatures for the correct password
          fields, then it is highly likely that this is a timestamp         response and wrong password response, next we keep sending
          field, as illustrated in our running example.                     the server a login request with mutated passwords for a given
                                                                            user. However, for ethical reasons, we would not keep sending
   •      Content Matching. Since we control the user input and             a large volume of mutated request messages to the server, and
          some user input would not get changed, such as the                in our experiment we set the maximum number of messages we
          username, then we directly search the diffed fields for           could send to the server as N + 1. During this testing window,
          the data we entered. In such a way, we can precisely              we could observe three types of messages sent from the server:
          locate the field that directly uses the user input, such as
          the email field in our running example.                              •    Correct password. We may break a user’s password
   •      Degree of Differences. By measuring the degree of                         within N + 1 guesses, and the server will send a
          the similarities between the two diffed fields, we can                    successful login response. Based on the already obtained
          easily identify the cryptographically computed fields.                    signature of the correct password response, we identify
          In our design, we use the Wagner-Fischer algorithm                        this case.
          [35], which computes the Levenshtein distance, or
          minimum number of edits needed to transform one                      •    Wrong password. Given the very small amount of
          string into the other, between two fields. We determine                   guesses, we likely cannot break a password. Therefore,
          whether a field is cryptographically computed if the                      most of the time, server will send a wrong password
          Levenshtein similarity ratio (LSR) is below 0.5, as                       response message. Similarly to how we identify the
          shown in Table II for our running example where we                        correct password response message, we identify this
          can easily locate the pwd and sign fields.                                case based on the already obtained wrong password
                                                                                    signature.
Note that field semantic inference is an optional step. In the
worst case, AUTO F ORGE can brute-force try each diffed field                  •    Unrecognized response message. In addition to the
(e.g., there are only 4 fields in our running example that needs                    two correct or wrong password responses, we could also
the brute-force trial) as crypto-field, system-field, or user-input                 encounter other types of response messages that do not
field, to finally generate the desired request messages. With field                 hold any signatures we observed before. The response
semantic inference, the benefit is that it can significantly narrow                 for these messages could be something indicating we
down and even directly pinpoint the field of our interest.                          have exceeded a limited number of login attempts, or
                                                                                    just an error message. Therefore, if we observe these
C. Response Message Labeling                                                        unrecognized response messages, we terminate the test
    Since we aim to test the server behavior, we have to also                       and conclude that the server is not vulnerable.
monitor the server responses to decide when to stop. It would
be very challenging to label a response message by parsing                  Note that there is also a caveat: if the server is not vulnerable,
its contents since different apps can use different encodings.              it may keep sending a wrong password response message even
Fortunately, we find that we can actually treat the response                though we have guessed a correct password (in fact we did find
message as a black box. Specifically, in our password login test,           two such servers in our experiment). Therefore, if we receive N
because the app is under our control, we can send the server two            wrong password responses, we will send a correct password for
more messages in addition to the two initial request messages               our testing user in the last request message. If the server blocks
we sent earlier. Back to our running example, we have already               (by sending some other unrecognized response or the wrong
collected two response messages: a wrong password response                  password response), we conclude the server is not vulnerable.

                                                                        7
Algorithm 1 Parsing the Cryptographic API trace and Tracking                                         and output, all that we need to do is to replay the execution of
the Backward Data Dependency                                                                         these functions with the input we modified. Since our replay is
1: Input: Log: the API execution log file; v0 : the value of the identified output field; u0 :       performed at the network proxy layer, we just need to re-execute
   user entered input;                                                                               the cryptographic functions of our interest with the corresponding
 2: procedure A PI T RACE PARSING(Log, v0 , u0 )
 3:    V ← v0                                                                                        parameters. To identify those functions and their arguments,
 4:    H ← ∅, R ← ∅                                                                                  we perform backward slicing atop cryptographic API traces
 5:    i← 0
 6:    while !feof(Log) do
                                                                                                     to identify the involved arguments and return values, and then
 7:         <handle.fname, input, output> ← fread (Log)                                              replay their execution using the corresponding alternative (e.g.,
 8:         AP Ii ← <handle.fname, input, output>                                                    Python) implementation of these APIs. A detailed algorithm on
 9:         i← i+1
10:     while i! = 0 do
                                                                                                     how we parse the API trace and perform the slicing to identify
11:          i← i−1                                                                                  the involved cryptographic functions is presented in Algorithm 1.
12:          if AP Ii .output ∈ V then
13:              V ← V \ {AP Ii .output}                                                                 Specifically, given a log file of the API trace (LOG), the
14:              P USH A RG A ND F UN NAME (AP Ii , V, H , u0 )
15:          if AP Ii .output ∈ H then
                                                                                                     value v0 of the identified cryptographically computed field
16:              H ← H \ {AP Ii .output}                                                             (e.g., “D2A173BEB8F169DD1A81CA8D59AD2C69” in our
17:              P USH A RG A ND F UN NAME (AP Ii , V, H , u0 )                                      running example), and the user input u0 (e.g., “ThisIsPWD”
18:          if empty(V ) and empty(H) then                                                          and “testappserverbeta@gmail.com”), we invoke the
19:              break
20:     if !empty(V ) or !empty(H) then                                                              A PI T RACE PARSING procedure to identify the functions that we
21:          return false                                                                            need to replay along with the corresponding arguments. Since
22:     else
                                                                                                     we start from the last executed API that generates the value of
23:          return true
24: procedure P USH A RG A ND F UN NAME(AP I, V , H, u0 )                                            our interest and use the backward slicing to identify the replayed
25:     if String (AP I.input) then                                                                  function, we use a stack structure (we call function state tracking
26:          vd ← GetDiffedArgValueFromTwoTraces()
27:          if uo ∈ AP I.input or vd ∈ AP I.input then                                              stack) to store these functions and their arguments (as shown in
28:              PUSH (ARG, Substitute(vd , u0 , AP I.input)))                                       line 27, line 30, line 33, and line 36 in Algorithm 1) and then we
29:              V ← V ∪ vd                                                                          just need to pop these arguments and invoke the corresponding
30:          else
31:              PUSH (ARG, String(AP I.input))                                                      alternative implementation of these cryptographic APIs to finally
32:     else                                                                                         produce the desired output.
33:          if CONST (AP I.input) then
34:              PUSH (ARG, CONST(AP I.input))                                                            Our backward slicing tracks two types of data dependen-
35:          else
36:              V ← V ∪ AP I.input                                                                  cies: (1) function handler dependencies (stored in set H),
37:              PUSH (ARG-t, AP I.input.temp)                                                       and (2) return value and argument dependencies (stored in
38:     if !empty(AP I.handle) then                                                                  set V ). As shown in line 12, starting from the return value
39:          H ← H ∪ AP I.handle
40:     PUSH (FNAME, AP I.handle.f name)
                                                                                                     of the last executed cryptographic API (e.g., the function
                                                                                                     0x53595658.digest illustrated in Fig. 3), if the return
                                                                                                     value belongs to V , then this function is of our interest; we
                                                                                                     therefore remove this return value from V (line 13) and push
D. Request Message Forgery                                                                           its argument and function name into our state tracking stack by
    Having collected the API traces and identified the fields                                        calling procedure P USH A RG A ND F UN NAME (line 14).
of our interest, we are then ready to forge the desired request                                          Inside P USH A RG A ND F UN NAME procedure, we will first
messages for our security testing. For each diffed-field identified                                  check its argument; if it is a string (line 25), then we again
by our Message Field Inference, we substitute them either                                            use the Needleman-Wunsch algorithm [27] to check whether
based on their inferred meaning or trying each of them one-                                          its argument contains any diffed-value of our interest (e.g.,
by-one in a brute force way to forge a request message. The                                          A9672D9F5F7414D5B996964A7F07727E as shown in
forgery of the request message is guided by the traced message                                       Fig. 3) by aligning the two corresponding arguments from
as well as the traces of the cryptographic APIs. Since there                                         the two traced API files, and storing the diffed value into vd
are two types of fields, non-cryptographically computed fields                                       if there is any (line 26). Next, we further check if the user
and cryptographically computed fields, we use the following                                          input u0 (e.g., testappserverbeta@gmail.com) is in
strategies to forge their values.                                                                    this argument, or if there is any diffed value vd . If so, we
                                                                                                     will replace u0 with either user specified input and meanwhile
1) Non-cryptographically computed fields. For non-                                                   substitute the argument with a temporary variable that stores
cryptographically computed user input fields such as email                                           the vd (line 28); we also track which function generates vd
we forge the value of this field without changing its content                                        by keeping it in V (line 29). Otherwise, we directly push this
(because we aim to test whether we can guess the password for                                        string argument (e.g., the “DES” string that is the argument
a given user). For system related fields, such as timestamp,                                         of SecretKeyFactory.getInstance in Fig. 3) on the
we configure AUTO F ORGE to slightly change it based on the                                          stack (line 31). If the argument is not a string (line 32-37),
pattern observed in the traced request messages.                                                     then we check whether it is a constant (e.g., the value 1 in
                                                                                                     0x536b7670.init’s argument). If so, we push this constant
                                                                                                     on the stack; otherwise, we will track which function generates
2) Cryptographically computed fields. The core problem AUT-                                          this argument by adding it into data dependence set V , and push
O F ORGE aims to solve is to generate the cryptographically                                          another temporary variable that will store the value generated
computed fields with mutated input. Once we have collected                                           by the dependent function. If the handler of this function is not
the traces of the cryptographic functions, including their input                                     empty (line 38), we track the dependence of the handler (line 39).

                                                                                                 8
   DESKeySpec(0x536b299c) = 0x536b2970                                             the vulnerable app servers. In particular, we show how we tested
      *0x536b299c: "4ce19ca8fcd150a4w4pj9llah24991ut"
                                                                                   whether an app server is vulnerable to password brute-forcing
   SecretKeyFactory.getInstance(0x107f2) = 0x535f66f4                              attacks in §IV-B, leaked username and password probing attacks
      *0x107f2: "DES"
                                                                                   in §IV-C, and the Facebook access token hijacking attack
   0x535f66f4.generateSecret(0x536b2970) = 0x265                                   in §IV-D. Our procedure for setting up our experiments is
   Cipher.getInstance(0x57f18baf) = 0x536b7670                                     presented in §IV-A.
      *0x57f18baf: "DES/CBC/PKCS5Padding"

   IvParameterSpec(0x535686bc) = 0x536c838c                                        A. Experiment Setup
       *0x535686bc: \x00\x00\x00\x00\x00\x00\x00\x00

   0x536b7670.init(1, 0x265, 0x536c838c )                                          Collecting the Mobile Apps for Testing. To test the app servers,
   0x536b7670.doFinal(0x536df6ec) = 0x536fc960                                     we needed to first download and install the corresponding apps
       *0x536df6ec: "ThisIsPWD!"                                                   in our emulator. We crawled the apps from the official Google
       *0x536fc960: \xa9\x67\x2d\x9f\x5f\x74\x14\xd5\xb9\x96\x96\x4a
                    \x7f\x07\x72\x7e                                               Play market. We crawled over 20, 000 apps within a three month
                                                                                   time window. Since we have to manually register with each
   MessageDigest:getInstance(0x1297e) = 0x53595658
       *0x1297e: {"MD5"}                                                           service in order to test whether their servers are vulnerable, we
                                                                                   cannot test all of them and therefore we instead focused on the
   0x53595658.digest(0x536c9234) = 0x5357d210
       *0x536c9234: "app_keyA4H0P4JNapp_secret4ce19ca8fcd150a4w4pj9l               most popular apps. We considered an app to be a most popular
   lah4991utclientandroidcountryUSAcountry_codeUScurrencyUSDcv3.9.0e               app if it has been installed more than one million times. We
   mailtestappserverbeta@gmail.comformatjsonlanguageenmethodvela.use
   r.loginpwdA9672D9F5F7414D5B996964A7F07727Esign_methodmd5timestamp               queried each app to check its number of installs on Google Play;
   2015-08-05 03:20:01v1.2"                                                        we found 320 apps falling into this category.
       *0x5357d210: \xd2\xa1\x73\xbe\xb8\xf1\x69\xdd\x1a\x81\xca\x8d
   \x59\xad\x2c\x69
                                                                                       Among these 320 apps, not all of them use cryptographic
                                                                                   functions to encrypt, hash, or sign the request messages, so we
                                                                                   had to filter them. It would be tedious to manually go through
Fig. 3. Crypto API traces and the illustration of their arguments and return
value dependencies of the miniinthebox App. Note that *addr denotes the            each app one-by-one to check whether it uses cryptographic
content stored in that addr.                                                       functions. We therefore developed a simple dynamic analysis
                                                                                   tool based on Monkey [5] to decide whether we should filter
                                                                                   an app. Specifically, we invoked the am command provided by
Note that after we iterate the API traces, both V and H should                     Monkey to run the app and stop executing it after 20 seconds. If
be empty (line 20); otherwise there is something wrong and we                      we observed any cryptographic functions (listed in Table I) get
will output that we cannot perform the replay.                                     called, we kept this app for further testing.
    After we have built the stack that tracks how the crypto-                          After filtering the non-encryption, non-hashing and non-
graphic functions should be executed, we then pop the arguments                    signing apps, we then had 105 apps to test. But still, we were
and the function names from the stack, and then invoke the                         not sure whether each app contained a user login interface since
corresponding alternative implementation of these cryptographic                    our test primarily concerns the security of user authentication.
functions to finally generate the desired field output. After that,                Currently, there is no automatic tool to recognize this, and
we replace the corresponding field in one of the request messages                  therefore we had to go through each of them. After manually
we traced (e.g, Request Message0 ) to finally forge the                            running the 105 apps one-by-one, we found that 15 of them do
desired request messages.                                                          not contain a user login interface, and 14 of them do not use
                                                                                   HTTP/HTTPS protocols. Therefore, we filtered these apps out
                          IV.    E VALUATION                                       and eventually had only 76 apps tested by AUTO F ORGE. The
                                                                                   name of the tested app, its version, the category, and the number
    We have implemented AUTO F ORGE using both Java and                            of installs, and the protocol (HTTP or HTTPS) are presented in
Python. We implemented our API Hooking in Java atop the                            Table V in Appendix. Also, we observed that 54 out of 76 (71%)
Xposed Framework [6], which provides convenient ways to                            apps in our data set use the HTTPS protocol.
find and hook a given API (findAndHookMethod) and
can intercept the point before (beforeHookedMethod) or
after (afterHookedMethod) execution of the API. This                               Other Settings. We used Genymotion [3] as our Android
implementation consists of 1, 200 lines of Java code. The rest                     emulator. Our host machine runs Ubuntu 12.04 with 8G memory
of the components of AUTO F ORGE are implemented using                             and Intel Core2 Duo CPU 2.53GHz, and our Android emulator
Python with 4, 500 lines of our own code. It is worth noting                       is version 4.2.2 with 2G memory. Meanwhile, the parameter N
that we implemented the Message Field Inference atop the                           is set to be 20.
Protocol Informatics [8] project, which is an open source Python
implementation of the Needleman-Wunsch algorithm [27], and                         B. Password Brute-forcing Testing
we just integrated this code based on our needs. Also, we did
not have to implement the algorithm to compute the Levenshtein                         We have illustrated through our running example how to
similarity ratio of two strings [35] because Python already has an                 break a user’s password by iteratively mutating her password
implementation for this algorithm. Meanwhile, we implemented                       until we hit a correct one. We have applied this methodology to
our MitM proxy atop the Burp Suite [1] using a Python plugin.                      test these 76 potential vulnerable app services. To launch our test,
                                                                                   we first registered two legal accounts in the corresponding servers
  There will be many security applications enabled by                              and sent four request messages (a wrong and correct password
AUTO F ORGE. In this section, we evaluate how we apply it to test                  pair for each registered user) and then mutating the password

                                                                               9
           TABLE III.        T HE DETAILED PASSWORD BRUTE - FORCING TESTING RESULT FOR 23 APP SERVERS BASED ON THE APP CATEGORY.
                                                                    Step ¶                         Step ·                                               Step ¸                                     Step ¹                                      Step º




                                                                                                                                                                                               EqualResponse?

                                                                                                                                                                                                                SysField Only?
                                                                                                                                                                                #CryptoField
                                                                                    #Traced API


                                                                                                   Encryption?




                                                                                                                                       #DiffedField




                                                                                                                                                                                                                                                            Vulnerable?
                                                                                                                                                                  #InputField




                                                                                                                                                                                                                                 #Sliced API
                                                                      #Input Msg




                                                                                                                                                      #SysField
                                                                                                                 Hashing?




                                                                                                                                                                                                                                                 #Request
                                                                                                                            Signing?
         Category                          App Package Name

         Books & Reference      com.sirma.mobile.bible.android          4          146             X             7          7           1              0            0             1               7             X                1               21         X
         Business                                com.sahibinden         4           89             X             X          7           4              1            2             1               7             X                15              21         X
         Casual                                      me.pou.app         4          169             7             X          7           2              0            1             1               7             X                7               21         X
         Comics                         jp.ebookjapan.ebireader         4           60             7             X          7           3              1            1             1               7             X                7               21         X
         Communication        com.browan.freeppmobile.android           4           40             X             X          7           2              0            1             1               7             X                18              21         X
         Education                    com.dictionary.flashcards         4           35             7             7          X           5              2            2             1               7             X                9               21         X
         Entertainment                         com.imdb.mobile          4          428             7             7          X           4              1            2             1               7             X                7               21         7
         Finance                                    com.netgate         4          505             X             7          7           3              1            0             2               7             X                28              6          7
         Health & Fitness                  com.fatsecret.android        4           41             7             X          7           2              0            1             1               7             X                7               21         X
         Lifestyle               com.cookpad.android.activities         4          342             7             7          X           4              1            2             1               7             X                1               21         X
         Media & Video                        com.youku.phone           4          771             7             X          7           4              1            1             2               7             X                7               5          7
         Medical                    com.aranoah.healthkart.plus         4          321             7             7          7           2              0            2             0               7             X                0               21         X
         Music & Audio                         com.slacker.radio        4          751             7             7          7           2              0            2             0               7             7                0               21         X
         News & Magazines        com.cnn.mobile.android.phone           4          213             7             7          7           2              0            2             0               7             7                0               21         X
         Photography                          com.picsart.studio        4          1292            7             7          7           2              0            2             0               7             X                0               21         X
         Productivity                 com.autodesk.autocadws            4          153             7             7          7           2              0            2             0               7             7                0               21         X
         Shopping                          com.biggu.shopsavvy          4          771             7             X          7           3              0            2             1               7             X                8               21         X
         Social                                      com.tumblr         4          172             7             7          X           5              2            2             1               7             X                7               21         X
         Sports                          com.espn.score_center          4          385             7             7          7           2              0            2             0               7             7                0               21         X
         Tools                     com.sohu.inputmethod.sogou           4          195             7             X          7           2              0            1             1               7             X                7               3          7
         Transportation                       taxi.android.client       4           35             7             X          7           1              0            0             1               7             X                8               21         X
         Travel & Local                   com.expedia.bookings          4          649             7             7          7           2              0            2             0               7             7                0               21         X
         Weather                              disasterAlert.PDC         4           58             7             7          7           2              0            2             0               7             X                0               21         X



for one of the registered legal users. It would be overwhelming                                    in total, we find 65 apps’ servers (86%) are vulnerable to
to show all of the testing results for these 76 apps in a single                                   this attack type. Among the 4 non vulnerable apps servers
table. We thus classify the apps based on their categories listed                                  in Table III, 3 of their servers (e.g., com.netgate) will
in Google Play, select the apps that have the highest number of                                    directly return “Unrecognized response message” after 3, 5 or
installs in each category, and present their experimental results in                               6 request messages; but com.imdb.mobile will not return
Table III. In total, these apps can be classified into 23 categories.                              such message, and we only found it is not vulnerable after the
Therefore, there are only 23 app server testing results in Table III,                              21st request message.From this table, we can also observe that
and the results for the rest of the app servers are presented in                                   we need four input messages for the test. Meanwhile, there are
Table VI in Appendix.                                                                              tens to several hundreds of cryptographic APIs executed for these
                                                                                                   tested apps. We have examined the traces and found that part of
    Specifically, we present the category of the app in the first                                  reason is because some of the apps heavily use cryptographic
column of Table III, followed by the app name. Since the                                           functions for integrity checking of the retrieved data such as
execution of AUTO F ORGE involves four key components, we                                          the images before login. There are 65% of the apps that use
present the internal results of these components in each key step                                  encryption, hashing, or signing to protect the authentication
from the 3rd column to the last column. In particular, the number                                  request message; 17% use encryption, 39% use hashing, and 17%
of inputs needed in Step ¶ is presented in the 3rd column. We                                      use signing. There are 8 apps (35%) whose #sliced API column
can see that they all require 4 inputs. The 4th column reports how                                 is 0, as they do not involve any cryptographic computation in
many APIs we traced, and the 5th to 7th column reports whether                                     the authentication request message, but they are included in our
this app uses encryption, hashing, or signing, respectively, based                                 test because their earlier communications involve cryptographic
on the execution of our API Hooking in Step ·; The number of                                       computation. Also, we can notice that there are just a few diffed
diffed fields by our Message Field Inference (Step ¸) is reported                                  fields (ranged from 1 to 5) in the request message. Among these
in the 8th column, and we also report the number of identified                                     diffed fields, 8 apps have one or two system fields (such as
system data fields (e.g., the timestamp), user input data fields                                   timestamp), 20 apps have user input (e.g., username), and 15 apps
(e.g., username), and cryptographic computed fields from the 9th                                   have cryptographically computed fields in the authentication
to the 11th columns. Whether our Response Message Labeling                                         request message. Meanwhile, all of their response messages are
(Step ¹) observes identical response messages is reported in                                       not identical, but 18 of them (78%) only contain system field
the 12th column; if they are not identical, whether the difference                                 differences in the response message (some other differences
only comes from the system field is reported in the 13th column.                                   include cookies, etc).
Finally, we report the number of sliced APIs by our Request
Message Generation (Step º) in the 14th column, the number
of the request messages we sent in the 15th column, and whether                                        Regarding how long AUTO F ORGE takes to test each app
the app server is vulnerable in the last column.                                                   server, we note that the most time consuming part is the user
                                                                                                   registration and the manual user login process. Usually these
    For these 23 apps’ servers, we can observe from Table III                                      processes took two to five minutes. The rest of the execution of
that 19 (83%) are vulnerable to password brute force attacks                                       AUTO F ORGE only took less than 10 seconds each to automati-
with our limited 20 guesses. Note that if we also include the                                      cally finish password brute-force testing under the setting of N
result (presented in Table VI) for the rest of the app servers,                                    being 20.

                                                                                              10
C. Leaked Username and Password Probing Testing                                 <script type="text/javascript">window.location.href="fbconnect:
                                                                                \/\/success#granted_scopes=email\u00252Ccontact_email\u00252Cp
                                                                                ublic_profile&denied_scopes=&access_token=CAAUbRqhb6ggBAEtOE6v
    The second test we performed is the leaked data probing                     cAjUGqfficRiVUj2WZALM330EBSqDIo98pFEVBgiIhVCgbHihV3qmjgDKr5eDG
attack. Being able to generate valid request messages, we would                 BqrhVotkGWQUbaIcXTpxAOHGPskQVLsuJ59PrysHMz6zzAZCx4GAovndOmZAb4
                                                                                EIXAlLSlvaZCGVyevED2B53FOpAtrPdlaDmh67wKjj56lO7epMtT69ZAXYCQZD
then be able to test whether a leaked username and password                     ZD&expires_in=5140807";</script>
exists in the remote mobile service. Through a one time forgery,
                                                                                                  (a) Facebook Confirmation Message
an attacker can easily find a victim’s username and password
without performing any brute-force guessing because of the                      GET /v2.2/me?access_token=CAAUbRqhb6ggBAEtOE6vcAjUGqfficRiVUj2
                                                                                WZALM330EBSqDIo98pFEVBgiIhVCgbHihV3qmjgDKr5eDGBqrhVotkGWQUbaIc
password reuse practice among many users [15], [21].                            XTpxAOHGPskQVLsuJ59PrysHMz6zzAZCx4GAovndOmZAb4EIXAlLSlvaZCGVye
                                                                                vED2B53FOpAtrPdlaDmh67wKjj56lO7epMtT69ZAXYCQZDZD&format=json&s
    In the past several years, there were hundreds of millions of               dk=android HTTP/1.1
                                                                                x-newrelic-id: XAYCV1ZADgsAUFRTBQ==
leaked passwords and user accounts [7], [31], and such a leaked                 User-Agent: FBAndroidSDK.3.20.0
data probing attack can be easily launched. While the server can                Content-Type: multipart/form-data; boundary=3i2ndDfv2rTHiSisAb
                                                                                ouNdArYfORhtTPEefj3q2f
limit the origin of the request message (e.g., by limiting a given              Accept-Language: en_US
                                                                                Host: graph.facebook.com
IP address with only limited number of login attempts, though                   Connection: Keep-Alive
this is not a good practice as it might cause trouble for some                  Accept-Encoding: gzip
campus networks when a network proxy is used), if an attacker                                   (b) Client Request Message to Facebook
performs distributed testing, such an attack is very challenging
to prevent.                                                                     {"id":"109829469364819","email":"testappserver2016\u0040gmail.
                                                                                com","first_name":"Fndss","gender":"male","last_name":"Lndss",
                                                                                "link":"https:\/\/www.facebook.com\/app_scoped_user_id\/109829
    To determine whether a service provider is vulnerable to                    469364819\/","locale":"en_US","name":"Fndss Lndss","timezone":
this leaked data probing attack, we performed a simple test. In                 -5,"updated_time":"2015-08-17T03:27:04+0000","verified":false}

particular, for ethical reasons, we did not use any of the leaked                                  (c) Facebook Response Message
database accounts, and instead we registered 19 more users in the
                                                                                POST /api/v1/socials/FACEBOOK/put?timestamp=2015-08-17%2001%3A
services we tested (in addition to the two users we registered in               16%3A23&sid=0bcd1165dbcc44718b95f35c6ee70fb9&v=1.1&client=andr
password brute-forcing testing). Starting from a single IP address,             oid&accessToken=CAAUbRqhb6ggBAEtOE6vcAjUGqfficRiVUj2WZALM330EB
                                                                                SqDIo98pFEVBgiIhVCgbHihV3qmjgDKr5eDGBqrhVotkGWQUbaIcXTpxAOHGPs
we keep mutating the the username and wrong password pair                       kQVLsuJ59PrysHMz6zzAZCx4GAovndOmZAb4EIXAlLSlvaZCGVyevED2B53FOp
in the first 20 request messages, with the 21st request message                 AtrPdlaDmh67wKjj56lO7epMtT69ZAXYCQZDZD&app_key=A4H0P4JN&langua
                                                                                ge=en&cv=3.10.0&currency=USD&sign=6992022E02F34E7ED5CD6CF19795
containing a correct username and password. If the server allows                BD86&providerUserId=109829469364819&email=testappserver2016%40
the login, then it means the server is vulnerable to this type of               gmail.com HTTP/1.1
                                                                                x-newrelic-id: XAYCV1ZADgsAUFRTBQ==
attack. Without any surprise, the server side of all the 76 apps                User-agent: LightInTheBox 3.10.0(Android; 17; 4.2.2; 480_752;
we tested are vulnerable to this leaked data probing attack.                    WIFI; generic; I9100; en)
                                                                                Host: api.miniinthebox.com
                                                                                Connection: Keep-Alive
                                                                                Accept-Encoding: gzip
D. Facebook Access Token Hijacking Testing                                      Content-Type: application/x-www-form-urlencoded
                                                                                Cookie: AKAMAI_FEO_TEST=B; ASRV=A_201505081100; cookie_test=pl
    The third test we performed is to identify the access token                 ease_accept_for_session; JSESSIONID=1qfesxjfnhxas1s1sbde9uut9n
                                                                                Content-Length: 0
hijacking vulnerability in the mobile service. Today, many
mobile apps support users logging in to their services with the                         (d) Client Authentication Request Message to App Server
users’ Facebook, Google, Microsoft, or Twitter accounts. For
instance, among the tested 76 apps, we found that 36 of them                Fig. 4. Access Token Hijacking Attack with miniinthebox App.
(47%) support Facebook Login, 28 (37%) support Google Login,
5 (7%) support Twitter Login. For a proof-of-concept, we focus
on the most popular Facebook Login and demonstrate how to                   of the fields of our interest can be inferred directly from the
launch an access token hijacking vulnerability test against it.             response messages sent by Facebook. For instance, as shown
Typically, when a user connects to the app service with Facebook            in Fig. 4(d), we need to recognize five fields: timestamp,
Login, the app will obtain an access token for that particular              accessToken, sign, providerUserId, and email.
user and that app, and this token can provide a temporary, secure           Among them, accessToken and providerUserId can be
access to Facebook APIs such as querying user’s information                 inferred directly from the Facebook response message, which is
stored in Facebook. However, this per-app issued access token is            well defined by the Facebook API.
portable, and other apps can use the same user’s Facebook token
to access the user’s private information if the app service does                In particular, during the Facebook Login process, Facebook
not check the origin of the token. This attack has been described           will send a response message as shown in Fig. 4(a) from
as an access token misuse attack [36] or access token hijacking             https://m.facebook.com/v2.2/dialog/oauth/, and we can directly
attack [2].                                                                 parse this response message to get the access_token
                                                                            (because the format is defined by Facebook and every app
     To perform this test, essentially what we want is to log in to         follows it). Next, a client app will use this token and send
a vulnerable app server by using the Facebook access token that             a request message to the Facebook server to query for more
is issued to other apps. Therefore, we just need to substitute an           information about this user; an example of this request message
access token (stolen) from other apps, and test whether the app             is shown in Fig. 4(b). Next, Facebook will reply to the client with
server still allows access and returns a user’s private data (again,        the queried information such as id, email, first_name, etc.,
the fundamental reason is because the app server mistakenly                 about this user. This response message, as shown in Fig. 4(c) also
uses the token as authentication [36]). While we could apply                has well-defined fields by Facebook, and we just need to parse
our Message Field Inference to infer the fields of our interest             them to retrieve the information of our interest such as the id
in the authentication request messages, we notice that many                 field. We can notice from Fig. 4(d) that id, access_token,

                                                                       11
                                   TABLE IV.        T HE DETAILED RESULT ON THE SECURITY TOKEN SUBSTITUTION TESTING
                                                   Step ¶                        Step ·                                                                        Step ¸                                                    Step ¹                                     Step º




                                                                                                                                                                                                                     EqualResonse?

                                                                                                                                                                                                                                     SysField Only?
                                                                                                                                                                               Access Token?
                                                                                                                                                                #CryptoField
                                                                   #Traced API


                                                                                 Encryption?




                                                                                                                      #DiffedField




                                                                                                                                                                                                                                                                                Vulnerable?
                                                                                                                                                 #InputField




                                                                                                                                                                                                                                                      #Sliced API
                                                     #Input Msg




                                                                                                                                     #SysField
                                                                                               Hashing?




                                                                                                                                                                                                                                                                     #Request
                                                                                                          Signing?




                                                                                                                                                                                                            Email?
                                                                                                                                                                                                    ID?
                  App Package Name

                        anews.com                      2           144             7           7          7            1              0            1              0            X                    7       7           7            7                 0              1         7
                     com.ad60.songza                   2           185             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         7
                        com.askfm                      2           790             7           7          X            2              0            1              1            X                    7       7           7            X                 7              1         7
                  com.biggu.shopsavvy                  2           611             7           X          7            2              0            1              1            X                    7       7           7            X                 7              1         X
                 com.bukalapak.android                 2           521             7           7          7            2              0            2              0            X                    X       7           7            X                 0              1         X
                  com.careerjet.android                2           231             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         X
         com.clearchannel.iheartradio.controller       2           800             7           7          7            1              0            1              0            7                    X       7           7            7                 0              1         7
               com.dictionary.flashcards               2           72              7           7          7            2              0            2              0            X                    X       X           7            X                 0              1         7
                 com.espn.score_center                 2           567             7           7          7            2              0            2              0            X                    X       X           7            7                 0              1         7
                 com.expedia.bookings                  2          1090             7           7          7            2              0            2              0            X                    X       7           7            7                 0              1         7
                    com.geeksoft.wps                   2           364             7           X          7            2              0            1              1            7                    X       7           7            X                 7              1         7
                     com.imdb.mobile                   2           947             7           7          X            3              1            1              1            X                    7       7           7            X                 7              1         7
                   com.jabong.android                  2           719             7           7          7            2              0            2              0            X                    X       X           7            X                 0              1         7
                 com.mediafire.android                 2           858             7           X          7            2              0            1              1            X                    7       7           7            X                 8              1         X
                     com.meucarrinho                   2           332             7           X          7            4              2            1              1            X                    7       7           7            X                 7              1         X
               com.miniinthebox.android                2           572             7           X          7            5              2            2              1            X                    X       X           7            X                 7              1         X
           com.mobilesrepublic.appygamer               2           204             7           7          7            1              0            1              0            7                    X       X           7            X                 0              1         7
            com.mobilesrepublic.appygeek               2           929             7           7          7            1              0            1              0            7                    X       X           7            X                 0              1         7
               com.myfitnesspal.android                2           958             7           7          7            2              0            2              0            X                    X       7           7            X                 0              1         7
                      com.noom.walk                    2           316             7           7          7            2              0            2              0            7                    X       X           7            7                 0              1         7
                    com.picsart.studio                 2          2622             7           7          7            4              0            4              0            X                    X       X           7            X                 0              1         7
                    com.rebtel.android                 2           421             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         7
                    com.skout.android                  2           583             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         7
                     com.slacker.radio                 2           529             7           7          7            2              0            2              0            X                    X       7           7            7                 0              1         7
                com.somcloud.somnote                   2           74              7           7          7            3              0            3              0            7                    X       X           7            X                 0              1         X
                com.soundcloud.android                 2           415             7           7          7            2              0            2              0            X                    7       7           7            X                 0              1         7
             com.stuckpixelinc.funnypics               2           243             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         X
                  com.textmeinc.textme                 2           34              7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         7
            com.zillow.android.zillowmap               2           921             7           7          7            2              0            2              0            X                    X       7           7            X                 0              1         X
                    taxi.android.client                2           490             7           7          7            1              0            1              0            X                    7       7           7            X                 0              1         7
                        wp.wpbeta                      2           202             7           7          7            1              0            1              0            X                    7       7           7            7                 0              1         7



and email have been used in the authentication request                                                               or signing. Also, we notice not all the request messages use
message even though the client app (our running example                                                              the access token, and some of them use the ID returned from
miniinthebox) uses different names for some of the fields.                                                           Facebook for the authentication. Meanwhile, all the response
For timestamp and sign fields, we will still rely on our                                                             messages for the same user’s login are not identical, but the
Message Field Inference to identify them.                                                                            major difference still comes from the timestamp field. Finally,
                                                                                                                     we only send one request message to the server and we only find
    We tested whether these 76 app servers in §IV-B are vulnera-                                                     9 out of 31 (29%) apps that are vulnerable to the Facebook token
ble to this access token hijacking attack. While we have found                                                       hijacking attack.
36 of them that use Facebook Login, in fact 5 apps were actually
buggy in this feature (and we cannot launch the Facebook Login
for them). Therefore, we only have 31 apps that were tested. The                                                                                                                               V.         D ISCUSSIONS
test is slightly different compared to our password brute force test                                                 A. Security Implications
in that we only need to register one user on Facebook (with the
testappserver2016@gmail.com account). After that,                                                                        AUTO F ORGE has demonstrated that lack of security checks at
we need to intercept the Facebook access token oauth con-                                                            the server side can lead to several severe attacks such as password
firmation message as shown in Fig. 4(a), and the Facebook user                                                       brute forcing, leaked username and password probing, and access
information query message as shown in Fig. 4(c), from which                                                          token hijacking. This is a very serious problem considering
we extract the fields of our interest such as access_token                                                           that a large volume of popular apps, including CNN, Expedia,
and id. Next, we send two authentication request messages to                                                         iHeartRadio, and Walmart as confirmed in our experiment are
the app server, and apply the message diffing to identify other                                                      vulnerable to these attacks. While it is true that an adversary
fields. After that, we substitute the access_token and id                                                            cannot sniff the password because of HTTPS, an attacker can
field in the client authentication request message, and replay                                                       launch a malicious login attack in an owned device to install self-
the execution of the cryptographically computed fields such as                                                       signed certificates and automatically forge the request messages
sign to test whether the server is vulnerable or not.                                                                even though there are cryptographic constraints. As such, we
                                                                                                                     would like to raise awareness for app developers: only using
    The detailed result of the tested 31 apps is presented in                                                        HTTPS cannot defeat password brute-forcing, and neither can
Table IV. Most columns share the same meaning as in Table III,                                                       hashing and (one-way) signing of client request messages.
except we added whether the request messages use Access Token,
ID, or Email from the 12th to 14th column. We can notice from                                                            Therefore, we need to examine the techniques that can be
Table IV that 21 (68%) of the apps use HTTPS, and we only                                                            used by app developers to mitigate or prevent the automatic
need to send two authentication request messages. Interestingly,                                                     forgery of user request messages, especially in the scenario of
only 7 out of 31 (23%) of the request messages involves hashing                                                      user authentication, and they can be summarized as follows:

                                                                                                           12
   •    Limiting the number of login attempts. One sim-                     is to perform fine-grained instruction level data flow tracking.
        ple solution app developers can adopt is to keep a                  Therefore, we plan to integrate a taint analysis engine such as
        login attempt state at the server side and limit the                TaintDroid [19] into AUTO F ORGE to track the user’s input such
        number of login attempts within a certain time win-                 that we can still recognize the input in the request messages.
        dow. We only found 11 out of 76 apps (14%), such
                                                                                Third, AUTO F ORGE currently only deals with the crypto-
        as com.imdb.mobile, that followed this approach.
                                                                            graphic APIs listed in Table I. If an app uses other APIs or
        While this solution cannot defeat leaked username and
                                                                            native code, AUTO F ORGE has to include them. We plan to
        password probing attacks, it can defeat at least user
                                                                            examine more apps and enrich the list with more APIs if there
        password brute forcing. Meanwhile, unlike CAPTCHA
                                                                            are any. Meanwhile, if an app uses its own private cryptographic
        and two factor-authentication discussed below, this
                                                                            functions, AUTO F ORGE has to perform additional analysis (such
        defense will not change any user’s experience.
                                                                            as those mentioned in Dispatcher [9], Aligot [11], or the methods
   •    Using CAPTCHA. Automatic data forgery is not a new                  described by Grobert et al. [20]) to recognize these functions.
        attack, and there are already solutions to mitigate this.
                                                                                Fourth, our security test might have false positives because
        One way that has been widely used on the desktop is
                                                                            of the limited number of tests we performed. For instance, an
        the CAPTCHA [34]. A CAPTCHA is a program that
                                                                            app service could block the user after the (N + 1)-th failure
        protects websites against automated resource abusing
                                                                            without us detecting it (because of our threshold of maximum N
        or login attempts. However, we have not seen much
                                                                            guesses), and we would have to enlarge N to prune this. Note
        usage in mobile apps. We believe one reason is that
                                                                            that we set the parameter N to small numbers just for ethical
        CAPTCHA might hurt user experience. However, as
                                                                            considerations, and a real attack would not be constrained by
        we have demonstrated in this paper, to really slow
                                                                            this.
        down attackers, CAPTCHA is a viable approach, though
        CAPTCHA can also be broken [33].                                        Finally, AUTO F ORGE will enable many other security tests,
                                                                            such as SQL injection by manipulating the corresponding
   •     Two-factor authentication. Another intuitive way to                request fields (e.g., we can append certain data to the username).
         slow down the forgery of user request messages (includ-            In fact, we did find one app that is vulnerable to SQL injection
         ing the authentication) is to adopt two-factor authen-             among the 76 apps. We leave the large scale systematic study
         tication [38]. Similar to CAPTCHA, it will certainly               of this type of vulnerability to our future work.
         hurt user experience, but it is unlikely for attackers to
         successfully compromise two channels.
                                                                            C. Ethics
   •    Two-way authentication. The most effective way to
                                                                                The goal of designing AUTO F ORGE is to apply it to find vul-
        prevent client side data forgery is to authenticate the
                                                                            nerabilities at the server side. In this case, we have to inevitably
        client as well using a two-way (i.e., mutual) authentica-
                                                                            send unnecessary packets to the service providers. We do take
        tion [16]. Two-way SSL is one such an example, and it
                                                                            ethics into consideration by minimizing the number of messages
        uses digital signatures to authenticate both the server and
                                                                            sent to the server (recall the maximum number of messages we
        the client with their corresponding certificates. However,
                                                                            sent is N + 1). Also, we have made responsible disclosure and
        it requires an extra effort of client certificate exchange
                                                                            notified all the vulnerable app vendors. In fact, shortly after we
        and imposes additional complexity and cost. Therefore,
                                                                            reported the vulnerabilities, three vendors patched their services
        we have not observed any apps that use this technique.
                                                                            by only allowing a limited number of failed logins. For instance,
                                                                            the iHeartRadio app has limited the maximum number of login
B. Limitations and Future Work                                              attempts to 15, the ESPN score center app limits it to 3, and the
                                                                            Slacker Radio app limits it to 6. We believe many other vendors
    While we have made a first step demonstrating the feasibility
                                                                            will also patch their services very soon.
of automatic forgery of cryptographically consistent messages
to identify security vulnerabilities in mobile services, there are a
number of avenues for future improvement. In the following, we                                   VI.   R ELATED W ORK
discuss the limitations of AUTO F ORGE and outline future work.                 At a high level, our work is related to protocol reverse
                                                                            engineering, application dialogue replay, password brute forcing,
    First, AUTO F ORGE currently only focuses on HTTP/HTTPS
                                                                            and mobile app vulnerability discovery. In this section, we review
protocols. There are certainly apps that use other protocols such
                                                                            these works and compare AUTO F ORGE with them.
as proprietary non-plaintext protocols. While our global optimal
sequence alignment algorithm (i.e., the Needleman-Wunsch
algorithm [27]) might be able to align the two diffed messages              Protocol Reverse Engineering. There is a large body of re-
to identify the diffed fields for non-plaintext protocols, we have          search focusing on protocol reverse engineering. Earlier efforts
not evaluated it yet. Our next step is to test how AUTO F ORGE              (e.g., [8], [12], [24]) inferred the protocol format from network
would perform with non-plaintext protocols.                                 traces. Protocol informatics [8] used the Needleman-Wunsch
                                                                            algorithm [27] to align the protocol messages and infer the pro-
    Second, AUTO F ORGE only performs lightweight API level
                                                                            tocol format. Discoverer [12] proposed tokenization, recursive
tracing of app’s execution, and assumes user input (such as the
                                                                            clustering, and merging techniques to handle both text and binary
entered username) would not be transformed (recall we use
                                                                            protocols from network traces.
content patching to identify the direct user inputs). However, a
user entered input could be translated into other forms. To really              Instead of only using the network traces, the other direction
track the possible transformations of the user input, a better way          of protocol reverse engineering is to use dynamic binary analysis

                                                                       13
(taint analysis in particular) to reveal the protocol formats. A           if app server developers do not perform the necessary security
number of systems or tools (e.g., [9], [10], [14], [25], [39]) have        checks.
been proposed. Among them, Polyglot [10] made the first attempt
of using binary code analysis to infer the protocol formats,                                        VII.     C ONCLUSION
Tupni [14] recovers more fine-grained protocol formats, and
Dispatcher [9] focused on encrypted protocol message reverse                   We have presented AUTO F ORGE, a tool that can
engineering. We plan to apply the techniques proposed by these             automatically forge cryptographically consistent messages from
efforts to recover the Android apps’ protocol in a more general            the client side to test whether the server side of an app contains
way such as also inferring binary data based protocols.                    security vulnerabilities such as brute-forcing, leaked username
                                                                           and password probing, and access token hijacking. To enable
Application Dialogue Replay. AUTO F ORGE employs crypto-                   our security test, we have developed a set of techniques to
graphic function replay to generate the authenticated messages,            automatically infer protocol fields, label response messages,
which is similar to the existing application dialogue replay               replay cryptographic function execution, and regenerate request
systems. Similar to protocol reverse engineering, there are also           messages. Our experimental results show that among the 76
two categories of techniques: purely network traces based, and             tested popular apps (each with millions of installs), 65 of their
binary code analysis based.                                                servers (86%) are vulnerable to password brute forcing attacks,
                                                                           all of them (100%) are vulnerable to leaked username and
    Similar to Protocol Informatics [8], RolePlayer [13] aligns            password probing attacks, and 9 of them (12%) are vulnerable to
the byte-wise sequences of the protocol messages from network              Facebook access token hijacking attacks. We have performed re-
traces, and then identifies and mutates some specific fields for           sponsible disclosure and notified each vulnerable app vendor, and
the application dialogue replay. By leveraging binary code                 three of the service providers, including ESPN and iHeartRadio,
analysis, Replayer [28] enables more automatic replay. While               have patched their services shortly after our notification.
AUTO F ORGE appears to be quite similar to these replay systems,
none of the existing efforts focused on cryptographic protocol
                                                                                                    ACKNOWLEDGMENT
fields mutation (RolePlayer assumed there is no such field in the
protocol message, and Replayer set cryptographic fields in its                 We are grateful to our shepherd Christopher Kruegel, and the
future work), which is the exact focus of AUTO F ORGE.                     anonymous reviewers for their extremely helpful feedback. We
                                                                           also would like to thank Erick Bauman and Murat Kantarcioglu
Password Brute Forcing. Password based authentication has                  for proof-reading of the paper. This work was partially supported
been the de facto standard to protect access to sensitive in-              by The Air Force Office of Scientific Research (AFOSR) under
formation, with no exceptions to mobile apps and services.                 Award No. FA-9550-12-1-0077. Any opinions, findings, conclu-
It has always been a major focus for attackers over years,                 sions, or recommendations expressed are those of the authors
and there are many efficient and practical ways of brute force             and not necessarily of the AFOSR.
cracking a user’s password. For instance, assuming access to the
password file, attackers can use a dictionary based attack to break                                      R EFERENCES
user passwords. Recently, there were also significant efforts to
                                                                            [1] “Burp suite,” https://portswigger.net/burp/.
make dictionary attacks smarter by employing Markov models
                                                                            [2] “Facebook token hijacking,” https://developers.facebook.com/docs/
(e.g., [26]), probabilistic context free grammars (e.g., [37]), and             facebook-login/security/#tokenhijacking.
history based guessing (e.g., [40]). There are also approaches              [3] “Genymotion,” https://www.genymotion.com/.
to make the password brute forcing much faster. Using rainbow
                                                                            [4] “Statistics         and       facts         about      app       stores,”
tables is one such approach, which consists of massive tables                   http://www.statista.com/topics/1729/app-stores/.
of pre-calculated hashes, trading increased memory storage for              [5] “Ui/application exerciser monkey,” https://developer.android.com/tools/
reduced computation time [29]. While AUTO F ORGE does focus                     help/monkey.html.
on password brute forcing, it shows the new context of brute                [6] “Xposed module repository,” http://repo.xposed.info/.
forcing user passwords for mobile apps with the techniques of               [7] “Hackers released the passwords of over 70 million chinese internet
automatically generating mutated passwords in the authenticated                 accounts,” https://dazzlepod.com/rootkit/, 2011.
request message.                                                            [8] M. Beddoe, “The protocol informatics project,” http://www.4tphi.net/
                                                                                ~awalters/PI/PI.html.
                                                                            [9] J. Caballero, P. Poosankam, C. Kreibich, and D. Song, “Dispatcher:
Mobile App Vulnerability Discovery. In the past several years,                  Enabling active botnet infiltration using automatic protocol reverse-
a considerable amount of efforts have focused on discovering                    engineering,” in CCS, Chicago, Illinois, USA, 2009, pp. 621–634.
various vulnerabilities in mobile apps. For instance, Taint-               [10] J. Caballero and D. Song, “Polyglot: Automatic extraction of protocol
Droid [18] detects privacy leakage vulnerabilities by tracking                  format using dynamic binary analysis,” in CCS, Alexandria, Virginia,
information flows. PiOS [17] uses static analysis to detect such                USA, 2007, pp. 317–329.
leaks in iOS apps. CHEX [23] detects component hajacking                   [11] J. Calvet, J. M. Fernandez, and J.-Y. Marion, “Aligot: cryptographic
vulnerabilities in Android apps by using a data-flow based                      function identification in obfuscated binary programs,” in CCS. ACM,
                                                                                2012, pp. 169–182.
static analysis approach. SMV-Hunter [32] detects man-in-the-
middle SSL/TLS vulnerabilities with a hybrid static and dynamic            [12] W. Cui, J. Kannan, and H. J. Wang, “Discoverer: Automatic protocol
                                                                                reverse engineering from network traces,” in USENIX Security Symposium,
analysis. However, few efforts have been focusing on identifying                Boston, MA, August 2007.
the vulnerabilities in an app’s server side. AUTO F ORGE made              [13] W. Cui, V. Paxson, N. Weaver, and R. H. Katz, “Protocol-independent
such a step in this direction and demonstrated that there are also              adaptive replay of application dialog,” in NDSS, San Diego, CA, February
serious security vulnerabilities such as password brute forcing                 2006.


                                                                      14
[14]   W. Cui, M. Peinado, K. Chen, H. J. Wang, and L. Irun-Briz, “Tupni:                  [39] G. Wondracek, P. Milani, C. Kruegel, and E. Kirda, “Automatic network
       Automatic reverse engineering of input formats,” in CCS, Alexandria,                     protocol analysis,” in NDSS, San Diego, CA, February 2008.
       Virginia, USA, October 2008, pp. 391–402.                                           [40] Y. Zhang, F. Monrose, and M. K. Reiter, “The security of modern
[15]   A. Das, J. Bonneau, M. Caesar, N. Borisov, and X. Wang, “The Tangled                     password expiration: An algorithmic framework and empirical analysis,”
       Web of Password Reuse,” in NDSS, February 2014.                                          in CCS, ACM, 2010, pp. 176–186.
[16]   W. Diffie, P. C. Van Oorschot, and M. J. Wiener, “Authentication and
       authenticated key exchanges,” Designs, Codes and cryptography, vol. 2,                                            A PPENDIX
       no. 2, pp. 107–125, 1992.
[17]   M. Egele, C. Kruegel, E. Kirda, and G. Vigna, “Pios: Detecting privacy                  In §IV-B, we presented the detailed experimental results
       leaks in ios applications,” in NDSS, 2011.                                          for 23 app servers, and these apps are selected based on their
[18]   W. Enck, P. Gilbert, B. Chun, L. Cox, J. Jung, P. McDaniel, and A. Sheth,           categories. The detailed app classification, their version, and
       “TaintDroid: an information-flow tracking system for realtime privacy               protocol information is presented in Table V. The result for
       monitoring on smartphones,” in OSDI, 2010.                                          the 53 other app servers is presented in Table VI. Note that
[19]   W. Enck, P. Gilbert, S. Han, V. Tendulkar, B.-G. Chun, L. P. Cox,                   one of the app vendors sent us special request to anonymize
       J. Jung, P. McDaniel, and A. N. Sheth, “Taintdroid: an information-flow             their name, after we made the responsible disclosure to all the
       tracking system for realtime privacy monitoring on smartphones,” ACM
       Transactions on Computer Systems (TOCS), vol. 32, no. 2, p. 5, 2014.                vulnerable app vendors. The name of this app package is denoted
[20]   F. Gröbert, C. Willems, and T. Holz, “Automated identification of crypto-
                                                                                           anonymized_due_to_special_request in both Table V and VI.
       graphic primitives in binary programs.” in RAID, vol. 6961. Springer,               We can see from Table V that these 76 apps fall into 21 categories
       2011, pp. 41–60.                                                                    ranging from Books&Reference to Weather. Also, most apps use
[21]   B. Ives, K. R. Walsh, and H. Schneider, “The domino effect of password              HTTPS protocol (54 out 76). Regarding Table VI, as its columns
       reuse,” Commun. ACM, vol. 47, no. 4, pp. 75–78, Apr. 2004. [Online].                share the same format as Table III and we have explained them
       Available: http://doi.acm.org/10.1145/975817.975820                                 in greater detail in §IV-B, detailed explanation of these results is
[22]   Z. Lin, X. Jiang, D. Xu, and X. Zhang, “Automatic protocol format reverse           elided for brevity.
       engineering through context-aware monitored execution,” in NDSS, San
       Diego, CA, February 2008.
[23]   L. Lu, Z. Li, Z. Wu, W. Lee, and G. Jiang, “Chex: statically vetting android
       apps for component hijacking vulnerabilities,” in CCS. ACM, 2012, pp.
       229–240.
[24]   J. Ma, K. Levchenko, C. Kreibich, S. Savage, and G. M. Voelker,
       “Unexpected means of protocol inference,” in IMC. Rio de Janeriro,
       Brazil: ACM Press, 2006, pp. 313–326.
[25]   P. Milani Comparetti, G. Wondracek, C. Kruegel, and E. Kirda, “Prospex:
       Protocol Specification Extraction,” in IEEE Symposium on Security &
       Privacy, Oakland, CA, 2009, pp. 110–125.
[26]   A. Narayanan and V. Shmatikov, “Fast dictionary attacks on passwords
       using time-space tradeoff,” in CCS, ACM, 2005, pp. 364–372
[27]   S. B. Needleman and C. D. Wunsch, “A general method applicable to
       the search for similarities in the amino acid sequence of two proteins,”
       Journal of molecular biology, vol. 48, no. 3, pp. 443–453, 1970.
[28]   J. Newsome, D. Brumley, J. Franklin, and D. Song, “Replayer: Automatic
       protocol replay by binary analysis,” in CCS, 2006.
[29]   P. Oechslin, “Making a faster cryptanalytic time-memory trade-off,” in
       Advances in Cryptology-CRYPTO 2003. Springer, 2003, pp. 617–630.
[30]   B. Schneier, “Cryptography: The importance of not being different,”
       Computer, vol. 32, no. 3, pp. 108–109,112, Mar. 1999.
[31]   M. Siegler, “One of the 32 million with a rockyou account? you may want
       to change all your passwords. like now,” http://techcrunch.com/2009/12/
       14/rockyou-hacked/, 2009.
[32]   D. Sounthiraraj, J. Sahs, G. Greenwood, Z. Lin, and L. Khan, “Smv-
       hunter: Large scale, automated detection of ssl/tls man-in-the-middle
       vulnerabilities in android apps,” in NDSS, San Diego, CA, February 2014.
[33]   J. Tam, J. Simsa, S. Hyde, and L. V. Ahn, “Breaking audio captchas,” in
       NIPS, 2008, pp. 1625–1632.
[34]   L. Von Ahn, M. Blum, N. J. Hopper, and J. Langford, “Captcha: Using
       hard ai problems for security,” in Advances in Cryptology — EUROCRYPT
       2003. Springer, 2003, pp. 294–311.
[35]   R. A. Wagner and M. J. Fischer, “The string-to-string correction problem,”
       Journal of the ACM (JACM), vol. 21, no. 1, pp. 168–173, 1974.
[36]   R. Wang, Y. Zhou, S. Chen, S. Qadeer, D. Evans, and Y. Gurevich, “Ex-
       plicating sdks: Uncovering assumptions underlying secure authentication
       and authorization.” in USENIX Security, 2013, pp. 399–314.
[37]   M. Weir, S. Aggarwal, B. d. Medeiros, and B. Glodek, “Password
       cracking using probabilistic context-free grammars,” in SP, 2009, pp.
       391–405.
[38]   K. P. Weiss, “Method and apparatus for positively identifying an individ-
       ual,” Jan. 19 1988, uS Patent 4,720,860.


                                                                                      15
TABLE V.    T HE CATEGORY, INSTALLS , APP NAME , VERSION , AND PROTOCOL INFORMATION FOR THE TESTED 76 APPS .
       Category                #install   App Package Name                                         Version    Protocol

       Books & Reference   100,000,000    com.sirma.mobile.bible.android                              6.0.3    HTTPS
       Books & Reference    50,000,000    com.kobobooks.android                                 6.3.13738      HTTPS
       Books & Reference     5,000,000    com.overdrive.mobile.android.mediaconsole                   3.4.0    HTTPS
       Books & Reference     5,000,000    wp.wpbeta                                                 6.1.0.8    HTTPS
       Business             10,000,000    com.sahibinden                                              2.4.0    HTTPS
       Business              5,000,000    com.timesgroup.magicbricks                                  6.1.2     HTTP
       Business              5,000,000    naukriApp.appModules.login                                  6.3.1    HTTPS
       Business              1,000,000    com.careerjet.android                                       5.1.3     HTTP
       Casual              500,000,000    me.pou.app                                                 1.4.67     HTTP
       Comics                5,000,000    jp.ebookjapan.ebireader                                  2.3.79.0    HTTPS
       Communication        50,000,000    com.browan.freeppmobile.android             FIAD.BRO.3.7.0.445        HTTP
       Communication        50,000,000    com.mx.browser                                        4.5.0.2000     HTTPS
       Communication        50,000,000    com.textmeinc.textme                                        2.8.8    HTTPS
       Communication        50,000,000    ru.mail.mailapp                                     3.1.2.11965      HTTPS
       Communication        10,000,000    com.my.mail                                         3.1.3.12222      HTTPS
       Communication         5,000,000    com.mx.browser.tablet                                 4.3.5.2000     HTTPS
       Communication         5,000,000    com.rebtel.android                                         3.11.0    HTTPS
       Education             5,000,000    com.dictionary.flashcards                                       1     HTTP
       Entertainment       100,000,000    com.imdb.mobile                                5.5.6.105561200       HTTPS
       Entertainment        50,000,000    com.cgv.android.movieapp                                    4.0.7    HTTPS
       Entertainment        50,000,000    com.dailymotion.dailymotion                                 4760     HTTPS
       Entertainment        10,000,000    com.viewster.androidapp                                     4.6.3    HTTPS
       Entertainment         5,000,000    com.gamefly.android.gamecenter                               3.49    HTTPS
       Entertainment         5,000,000    com.stuckpixelinc.funnypics                                 3.3.1     HTTP
       Finance               5,000,000    com.netgate                                                  8.22    HTTPS
       Health & Fitness     50,000,000    com.fatsecret.android                                     4.1.2.2     HTTP
       Health & Fitness     50,000,000    com.myfitnesspal.android                                    4.6.1    HTTPS
       Health & Fitness     10,000,000    com.noom.walk                                               1.1.3     HTTP
       Lifestyle            50,000,000    com.cookpad.android.activities                            5.2.1.0    HTTPS
       Lifestyle            50,000,000    com.zillow.android.zillowmap                          6.6.8.4011     HTTPS
       Lifestyle            10,000,000    com.dominospizza                                            2.7.0    HTTPS
       Lifestyle             5,000,000    cn.etouch.ecalendar2                                        6.1.5    HTTPS
       Media & Video        10,000,000    com.youku.phone                                             4.7.1     HTTP
       Media & Video         5,000,000    com.qiyi.video.market                                       6.5.1    HTTPS
       Media & Video         5,000,000    com.sohu.sohuvideo                                          4.3.5     HTTP
       Media & Video         1,000,000    tv.danmaku.bili                                             4.2.3    HTTPS
       Medical               5,000,000    com.aranoah.healthkart.plus                                 7.1.6     HTTP
       Medical               5,000,000    com.sigmaphone.topmedfree                                   5.8.1    HTTPS
       Medical               5,000,000    leafly.android                                              2.5.0     HTTP
       Music & Audio       100,000,000    com.slacker.radio                                       6.0.1816     HTTPS
       Music & Audio       100,000,000    com.soundcloud.android                          15.08.14-release     HTTPS
       Music & Audio        50,000,000    com.clearchannel.iheartradio.controller                     5.8.0    HTTPS
       Music & Audio        10,000,000    com.ad60.songza                                           5.2.0.0    HTTPS
       Music & Audio        10,000,000    com.kugou.android                                           7.6.1     HTTP
       Music & Audio        10,000,000    anonymized_due_to_special_request                               -    HTTPS
       News & Magazines     50,000,000    com.cnn.mobile.android.phone                                2.8.2    HTTPS
       News & Magazines     10,000,000    com.ideashower.readitlater.pro                              5.8.5    HTTPS
       News & Magazines      5,000,000    anews.com                                                2.7.166      HTTP
       News & Magazines      5,000,000    com.mobilesrepublic.appygamer                               5.1.4     HTTP
       News & Magazines      5,000,000    com.mobilesrepublic.appygeek                                5.1.3     HTTP
       Photography         500,000,000    com.picsart.studio                                          5.6.3    HTTPS
       Productivity         50,000,000    com.autodesk.autocadws                                        3.1    HTTPS
       Productivity         50,000,000    com.ecareme.asuswebstorage                            2.2.7.8664     HTTPS
       Productivity          5,000,000    com.mediafire.android                                       3.2.3    HTTPS
       Productivity          5,000,000    com.somcloud.somnote                                        2.2.1    HTTPS
       Productivity          1,000,000    com.geeksoft.wps                                            3.0.7     HTTP
       Shopping             50,000,000    com.biggu.shopsavvy                                         9.3.3    HTTPS
       Shopping             50,000,000    com.walmart.android                                         2.8.2    HTTPS
       Shopping             10,000,000    com.jabong.android                                          2.4.1    HTTPS
       Shopping              5,000,000    com.bukalapak.android                                       3.0.1    HTTPS
       Shopping              5,000,000    com.meucarrinho                                             5.6.1     HTTP
       Shopping              5,000,000    com.miniinthebox.android                                   3.10.0     HTTP
       Social              100,000,000    com.tumblr                                               3.9.0.50    HTTPS
       Social               50,000,000    com.askfm                                                   2.2.1    HTTPS
       Social               50,000,000    com.chatous.pointblank                                      3.5.1    HTTPS
       Social               50,000,000    com.skout.android                                          4.14.4     HTTP
       Social               50,000,000    com.unearby.sayhi                                            4.39     HTTP
       Social               10,000,000    com.match.android.matchmobile                               3.2.0    HTTPS
       Social                5,000,000    com.tenthbit.juliet                                         1.8.0    HTTPS
       Sports               50,000,000    com.espn.score_center                                     4.4.1.1    HTTPS
       Tools                10,000,000    com.sohu.inputmethod.sogou                                    7.6    HTTPS
       Tools                 5,000,000    xcxin.fehd                                                  2.3.0    HTTPS
       Transportation        5,000,000    taxi.android.client                                         5.4.5    HTTPS
       Travel & Local       50,000,000    com.expedia.bookings                                        6.3.1    HTTPS
       Travel & Local        5,000,000    com.viamichelin.android.michelintraffic                   4.3.0.4     HTTP
       Weather               1,000,000    disasterAlert.PDC                                             3.2    HTTPS




                                                            16
                TABLE VI.          T HE DETAILED PASSWORD BRUTE - FORCING TESTING RESULT FOR THE OTHER 53 APP SERVERS .
                                                                       Step ¶                        Step ·                                               Step ¸                                     Step ¹                                     Step º




                                                                                                                                                                                                 EqualResonse?

                                                                                                                                                                                                                 SysField Only?
                                                                                                                                                                                  #CryptoField
                                                                                       #Traced API


                                                                                                     Encryption?




                                                                                                                                         #DiffedField




                                                                                                                                                                                                                                                             Vulnerable?
                                                                                                                                                                    #InputField




                                                                                                                                                                                                                                  #Sliced API
                                                                         #Input Msg




                                                                                                                                                        #SysField
                                                                                                                   Hashing?




                                                                                                                                                                                                                                                  #Request
                                                                                                                              Signing?
Category                                     App Package Name

Books & Reference                        com.kobobooks.android             4           240           7             7          7           2              0            2             0               7            7                 0              21         X
Books & Reference   com.overdrive.mobile.android.mediaconsole              4           448           7             7          7           2              0            2             0               7            7                 0              21         X
Books & Reference                                        wp.wpbeta         4           333           7             7          7           2              0            2             0               7            7                 0              21         X
Business                                    com.careerjet.android          4           28            X             7          7           2              1            0             1               7            X                 9              21         X
Business                           com.timesgroup.magicbricks              4           89            7             7          X           2              0            0             2               7            X                20              21         X
Business                          naukriApp.appModules.login               4           115           7             7          7           2              0            2             0               7            X                 0              21         X
Communication                                      com.mx.browser          4           195           7             X          7           2              0            1             1               7            X                 7              21         X
Communication                              com.mx.browser.tablet           4           178           7             X          7           2              0            1             1               7            X                 7              21         X
Communication                                          com.my.mail         4           340           7             X          7           3              0            2             1               7            X                 7              21         X
Communication                                   com.rebtel.android         4           208           7             X          7           5              2            2             1               7            X                 8              21         7
Communication                               com.textmeinc.textme           4           241           7             X          7           2              0            1             1               7            X                 7              21         X
Communication                                       ru.mail.mailapp        4           83            7             X          7           3              0            2             1               7            X                 7              21         X
Entertainment                        com.cgv.android.movieapp              4           67            7             X          7           3              0            1             2               7            X                18              21         X
Entertainment                     com.dailymotion.dailymotion              4           34            7             7          X           4              1            2             1               7            X                12              21         X
Entertainment                 com.gamefly.android.gamecenter               4           86            7             7          X           4              1            2             1               7            X                 7              21         X
Entertainment                      com.stuckpixelinc.funnypics             4           31            7             X          7           2              0            1             1               7            X                 7              21         X
Entertainment                           com.viewster.androidapp            4           626           7             7          7           2              0            2             0               7            7                 0              21         X
Health & Fitness                       com.myfitnesspal.android            4           269           7             X          7           2              0            1             1               7            X                 7              21         X
Health & Fitness                                    com.noom.walk          4           48            7             X          7           3              0            2             1               7            7                18              21         X
Lifestyle                                    cn.etouch.ecalendar2          4          1232           X             7          7           1              0            0             1               7            X                11              21         X
Lifestyle                                       com.dominospizza           4           265           7             7          7           2              0            2             0               7            X                 0              21         X
Lifestyle                        com.zillow.android.zillowmap              4           242           7             7          7           2              0            2             0               7            X                 0              21         X
Media & Video                              com.qiyi.video.market           4          1169           7             X          7           4              1            2             1               7            X                18               3         7
Media & Video                                 com.sohu.sohuvideo           4           72            7             X          7           2              0            1             1               7            X                 7              10         7
Media & Video                                       tv.danmaku.bili        4          1294           X             X          7           3              0            1             2               7            X                15               3         7
Medical                            com.sigmaphone.topmedfree               4           49            X             7          7           1              0            0             1               7            X                 1              15         7
Medical                                               leafly.android       4           38            7             7          7           2              0            2             0               7            X                 0              21         X
Music & Audio                                     com.ad60.songza          4           132           7             7          7           2              0            2             0               7            7                 0              21         X
Music & Audio           com.clearchannel.iheartradio.controller            4          1237           7             7          7           2              0            2             0               7            X                 0              21         X
Music & Audio                                  com.kugou.android           4           637           X             X          7           4              1            1             2               7            X                22              21         X
Music & Audio                           com.soundcloud.android             4           60            7             7          7           2              0            2             0               7            X                 0              21         X
Music & Audio             anonymized_due_to_special_request                4          1792           7             7          X           5              2            2             1               7            X                 7              21         X
News & Magazines                                         anews.com         4           192           7             7          7           2              0            2             0               7            X                 0              21         X
News & Magazines                 com.ideashower.readitlater.pro            4           239           7             7          7           2              0            2             0               7            X                 0              21         X
News & Magazines               com.mobilesrepublic.appygamer               4           276           7             7          7           2              0            2             0               7            X                 0              21         X
News & Magazines                com.mobilesrepublic.appygeek               4           883           7             7          7           2              0            2             0               7            X                 0              21         X
Productivity                      com.ecareme.asuswebstorage               4           85            7             X          X           6              3            1             2               7            X                17              21         X
Productivity                                     com.geeksoft.wps          4           25            7             X          7           3              0            2             1               7            X                 7              21         X
Productivity                               com.mediafire.android           4           201           7             X          7           3              0            2             1               7            X                 8              12         7
Productivity                             com.somcloud.somnote              4           743           7             X          X           5              2            1             2               7            X                14              21         X
Shopping                                  com.bukalapak.android            4           430           X             7          7           1              0            0             1               7            X                 1              21         X
Shopping                                       com.jabong.android          4           780           7             7          7           2              0            2             0               7            X                 0              21         X
Shopping                                         com.meucarrinho           4           138           7             X          7           5              2            2             1               7            X                 7              21         X
Shopping                              com.miniinthebox.android             4           228           X             X          7           4              1            1             2               7            X                19              21         X
Shopping                                     com.walmart.android           4           343           7             7          7           2              0            2             0               7            7                 0              21         X
Social                                                   com.askfm         4           75            7             7          X           3              0            1             2               7            X                 7              21         X
Social                                   com.chatous.pointblank            4           43            7             7          7           1              0            0             0               7            X                 1              21         X
Social                        com.match.android.matchmobile                4           308           7             7          7           2              0            2             0               7            X                 0              21         X
Social                                          com.skout.android          4           115           7             X          7           3              0            2             1               7            X                 7               3         7
Social                                          com.tenthbit.juliet        4           24            7             7          7           2              0            2             0               7            X                 0              21         X
Social                                          com.unearby.sayhi          4           60            7             X          7           2              0            1             1               7            X                 7              21         X
Tools                                                    xcxin.fehd        4           73            X             7          7           2              0            1             1               7            X                 7              21         X
Travel & Local         com.viamichelin.android.michelintraffic             4           33            7             7          7           3              0            3             0               7            X                 0              21         X




                                                                                      17
