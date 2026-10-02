---
type: Article
title: Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications
description: "PAPAS, a Firefox-driven black-box scanner, injects an encoded query delimiter into each existing parameter and checks whether it reappears inside the page's links and form actions. A 13-day crawl of 5,016 popular sites found about 30% with injectable parameters and confirmed 46.8% of those exploitable, including Google, PayPal, Symantec and Microsoft."
resource: "https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/"
tags: [article, webseclist-reference, ndss-symposium, large-scale-scan, measurement-study, dynamic-analysis, http, csrf, tooling, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T15:07:35+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/"
    title: Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications
    author: Marco Balduzzi, Carmen Torrano Gimenez, Davide Balzarotti, Engin Kirda
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2017/09/Bald.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/2017/09/bald2.pdf"
authors:
  - Marco Balduzzi
  - Carmen Torrano Gimenez
  - Davide Balzarotti
  - Engin Kirda
canonical_url: ""
cited_by:
  - "2011.md:75"
commit: ""
content_sha256: fa2225fa77ee6fd48422fbe74bf810b57c1cf4abe0a6e4421e35e35fd8f531dd
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 4ad4bf71e8701368f5545f452a8a206b3c3638d7c19ed9f643825d8b391b4a83
retrieved_from: "https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T15:07:35+00:00"
slug: ndss-symposium-automated-discovery-parameter-pollution-applications
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications

**Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications** - Marco Balduzzi, Carmen Torrano Gimenez, Davide Balzarotti, Engin Kirda, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/Bald.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/bald2.pdf>
- Preserved from: https://www.ndss-symposium.org/ndss2011/automated-discovery-of-parameter-pollution-vulnerabilities-in-web-applications/ (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications

Automated Discovery of Parameter Pollution Vulnerabilities in Web Applications

           Marco Balduzzi∗, Carmen Torrano Gimenez ‡, Davide Balzarotti∗, and Engin Kirda∗ §
                                         ∗
                                             Institute Eurecom, Sophia Antipolis
                                       {balduzzi,balzarotti,kirda}@eurecom.fr

                                   ‡
                                       Spanish National Research Council, Madrid
                                                 carmen.torrano@iec.csic.es

                                             §
                                                 Northeastern University, Boston
                                                        ek@ccs.neu.edu



                        Abstract                                  1   Introduction

    In the last twenty years, web applications have grown            In the last twenty years, web applications have grown
from simple, static pages to complex, full-ﬂedged dynamic         from simple, static pages to complex, full-ﬂedged dynamic
applications. Typically, these applications are built using       applications. Typically, these applications are built using
heterogeneous technologies and consist of code that runs          heterogeneous technologies and consist of code that runs
both on the client and on the server. Even simple web ap-         on the client (e.g., Javascript) and code that runs on the
plications today may accept and process hundreds of dif-          server (e.g., Java servlets). Even simple web applications
ferent HTTP parameters to be able to provide users with           today may accept and process hundreds of different HTTP
interactive services. While injection vulnerabilities such as     parameters to be able to provide users with rich, interactive
SQL injection and cross-site scripting are well-known and         services. As a result, dynamic web applications may con-
have been intensively studied by the research community, a        tain a wide range of input validation vulnerabilities such
new class of injection vulnerabilities called HTTP Parame-        as cross site scripting (e.g., [4, 5, 34]) and SQL injec-
ter Pollution (HPP) has not received as much attention. If        tion (e.g., [15, 17]).
a web application does not properly sanitize the user input          Unfortunately, because of their high popularity and a
for parameter delimiters, exploiting an HPP vulnerability,        user base that consists of millions of Internet users, web
an attacker can compromise the logic of the application to        applications have become prime targets for attackers. In
perform either client-side or server-side attacks.                fact, according to SANS [19], attacks against web applica-
    In this paper, we present the ﬁrst automated approach for     tions constitute more than 60% of the total attack attempts
the discovery of HTTP Parameter Pollution vulnerabilities         observed on the Internet. While ﬂaws such as SQL injec-
in web applications. Using our prototype implementation           tion and cross-site scripting may be used by attackers to
called PAPAS (PArameter Pollution Analysis System), we            steal sensitive information from application databases and
conducted a large-scale analysis of more than 5,000 pop-          to launch authentic-looking phishing attacks on vulnerable
ular websites. Our experimental results show that about           servers, many web applications are being exploited to con-
30% of the websites that we analyzed contain vulnerable           vert trusted websites into malicious servers serving content
parameters and that 46.8% of the vulnerabilities we discov-       that contains client-side exploits. According to SANS, most
ered (i.e., 14% of the total websites) can be exploited via       website owners fail to scan their application for common
HPP attacks. The fact that PAPAS was able to ﬁnd vulnera-         ﬂaws. In contrast, from the attacker’s point of view, auto-
bilities in many high-proﬁle, well-known websites suggests        mated tools, designed to target speciﬁc web application vul-
that many developers are not aware of the HPP problem.            nerabilities simplify the discovery and infection of several
We informed a number of major websites about the vulner-          thousand websites.
abilities we identiﬁed, and our ﬁndings were conﬁrmed.               While injection vulnerabilities such as SQL injection and
                                                                  cross-site scripting are well-known and have been inten-
sively studied, a new class of injection vulnerabilities called   can put in the document root of her website.
HTTP Parameter Pollution (HPP) has not received as much
attention. HPP was ﬁrst presented in 2009 by di Paola and            In summary, the paper makes the following contribu-
Carettoni at the OWASP conference [27]. HPP attacks con-          tions:
sist of injecting encoded query string delimiters into other
existing parameters. If a web application does not prop-              • We present the ﬁrst automated approach for the detec-
erly sanitize the user input, a malicious user can compro-              tion of HPP vulnerabilities in web applications. Our
mise the logic of the application to perform either client-             approach consists of a component to inject parameters
side or server-side attacks. One consequence of HPP attacks             into web applications and a set of tests and heuristics to
is that the attacker can potentially override existing hard-            determine if the pages that are generated contain HPP
coded HTTP parameters to modify the behavior of an appli-               vulnerabilities.
cation, bypass input validation checkpoints, and access and
                                                                      • We describe the architecture and implementation of the
possibly exploit variables that may be out of direct reach.
                                                                        prototype of our approach that we call PAPAS (PA-
    In this paper, we present the ﬁrst automated approach for
                                                                        rameter Pollution Analysis System). PAPAS is able to
the discovery of HTTP Parameter Pollution vulnerabilities
                                                                        crawl websites and generate a list of HPP vulnerable
in web applications. Our prototype implementation, that we
                                                                        URLs.
call PArameter Pollution Analysis System (PAPAS), uses a
black-box scanning technique to inject parameters into web            • We present and discuss the large-scale, real-world ex-
applications and analyze the generated output to identify               periments we conducted with more than 5,000 popu-
HPP vulnerabilities. We have designed a novel approach                  lar websites. Our experiments show that HPP vulner-
and a set of heuristics to determine if the injected parame-            abilities are prevalent on the web and that many well-
ters are not sanitized correctly by the web application under           known, major websites are affected. We veriﬁed that at
analysis.                                                               least 46.8% of the vulnerabilities we discovered could
    To the best of our knowledge, no tools have been pre-               be exploited on the client-side. Our empirical results
sented to date for the detection of HPP vulnerabilities in              suggest that, just like in the early days of cross site
web applications, and no studies have been published on                 scripting and cross site request forgery [1], many de-
the topic. At the time of the writing of this paper, the most           velopers are not aware of the HPP problem, or that they
effective means of discovering HPP vulnerabilities in web-              do not take it seriously.
sites is via manual inspection. At the same time, it is unclear
how common and signiﬁcant a threat HPP vulnerabilities               The paper is structured as follows: The next section give
are in existing web applications.                                 an explanation of parameter pollution attacks and provides
    In order to show the feasibility of our approach, we used     examples. Section 3 describes our approach and presents
PAPAS to conduct a large-scale analysis of more than 5,000        the main components of PAPAS. Section 4 presents and
popular websites. Our experimental results demonstrate            discusses the evaluation of PAPAS. Section 5 lists related
that there is reason for concern as about 30% of the websites     work, and Section 6 brieﬂy concludes the paper.
that we analyzed contained vulnerable parameters. Further-
more, we veriﬁed that 14% of the websites could be ex-            2     HTTP Parameter Pollution Attacks
ploited via client-side HPP attacks. The fact that PAPAS
was able to ﬁnd vulnerabilities in many high-proﬁle, well-
                                                                     HTTP Parameter Pollution attacks (HPP) have only re-
known websites such as Google, Paypal, Symantec, and Mi-
                                                                  cently been presented and discussed [27], and have not re-
crosoft suggests that many developers are not aware of the
                                                                  ceived much attention so far. An HPP vulnerability allows
HPP problem.
                                                                  an attacker to inject a parameter inside the URLs generated
    When we were able to obtain contact information, we
                                                                  by a web application. The consequences of the attack de-
informed the vulnerable websites of the vulnerabilities we
                                                                  pend on the application’s logic, and may vary from a simple
discovered. In the cases where the security ofﬁcers of the
                                                                  annoyance to a complete corruption of the application’s be-
concerned websites wrote back to us, our ﬁndings were con-
                                                                  havior. Because this class of web vulnerability is not widely
ﬁrmed.
                                                                  known and well-understood yet, in this section, we ﬁrst ex-
    We have created an online service based on PAPAS1
                                                                  plain and discuss the problem.
(currently in beta version) that allows website maintainers
                                                                     Even though injecting a new parameter can sometimes
to scan their sites. As proof of ownership of a site, the web-
                                                                  be enough to exploit an application, the attacker is usually
site owner is given a dynamically-generated token that she
                                                                  more interested in overriding the value of an already exist-
  1 The PAPAS service is available at: http://papas.iseclab.      ing parameter. This can be achieved by “masking” the old
org                                                               parameter by introducing a new one with the same name.
For this to be possible, it is necessary for the web applica-   has to manually parse the query string to extract each single
tion to “misbehave” in the presence of duplicated parame-       value.
ters, a problem that is often erroneously confused with the         However, the problem arises when the developer expects
HPP vulnerability itself. However, since parameter pollu-       to receive a single item and, therefore, invokes methods
tion attacks often rely on duplicated parameters in practice,   (such as getParameter in JSP) that only return a sin-
we decided to study the parameter duplication behavior of       gle value. In this case, if more than one parameter with the
applications, and measure it in our experiments.                same name is present in the query string, the one that is re-
                                                                turned can either be the ﬁrst, the last, or a combination of
2.1   Parameter Precedence in Web Applications                  all the values. Since there is no standard behavior in this sit-
                                                                uation, the exact result depends on the combination of the
    During the interaction with a web application, the client   programming language that is used, and the web server that
often needs to provide input to the program that generates      is being deployed. Table 1 shows examples of the parameter
the requested web page (e.g., a PHP or a Perl script). The      precedence adopted by different web technologies.
HTTP protocol [12] allows the user’s browser to transfer            Note that the fact that only one value is returned is not a
information inside the URI itself (i.e., GET parameters),       vulnerability per se. However, if the developer is not aware
in the HTTP headers (e.g., in the Cookie ﬁeld), or inside       of the problem, the presence of duplicated parameters can
the request body (i.e., POST parameters). The adopted           produce an anomalous behavior in the application that can
technique depends on the application and on the type and        be potentially exploited by an attacker in combination with
amount of data that has to be transferred.                      other attacks. In fact, as we explain in the next section,
                                                                this is often used in conjunction with HPP vulnerabilities to
    For the sake of simplicity, in the following, we focus on
                                                                override hard-coded parameter values in the application’s
GET parameters. However, note that HPP attacks can be
                                                                links.
launched against any other input vector that may contain
parameters controlled by the user.
    RFC 3986 [7] speciﬁes that the query component (or          2.2   Parameter Pollution
query string) of a URI is the part between the “?” character
and the end of the URI (or the character “#”). The query            An HTTP Parameter Pollution (HPP) attack occurs when
string is passed unmodiﬁed to the application, and consists     a malicious parameter Pinj , preceded by an encoded query
of one or more field=value pairs, separated by either an        string delimiter, is injected into an existing parameter Phost .
ampersand or a semicolon character. For example, the URI        If Phost is not properly sanitized by the application and its
http://host/path/somepage.pl?name=john                          value is later decoded and used to generate a URL A, the
&age=32 invokes the verify.pl script, passing the val-          attacker is able to add one or more new parameters to A.
ues john for the name parameter and the value 32 for the            The typical client-side scenario consists of persuading a
age parameter. To avoid conﬂicts, any special characters        victim to visit a malicious URL that exploits the HPP vul-
(such as the question mark) inside a parameter value must       nerability. For example, consider a web application that al-
be encoded in its %FF hexadecimal form.                         lows users to cast their vote on a number of different elec-
    This standard technique for passing parameters is           tions. The application, written in JSP, receives a single pa-
straightforward and is generally well-understood by web         rameter, called poll id, that uniquely identiﬁes the elec-
developers. However, the way in which the query string is       tion the user is participating in. Based on the value of the pa-
processed to extract the single values depends on the appli-    rameter, the application generates a page that includes one
cation, the technology, and the development language that       link for each candidate. For example, the following snippet
is used.                                                        shows an election page with two candidates where the user
    For example, consider a web page that contains a check-     could cast her vote by clicking on the desired link:
box that allows the user to select one or more options in a                                                                       
form. In a typical implementation, all the check-box items      Url: http://host/election.jsp?poll_id=4568
share the same name, and, therefore, the browser will send      Link1: <a href="vote.jsp?poll_id=4568&candidate=white">
a separate homonym parameter for each item selected by                  Vote for Mr. White</a>
the user. To support this functionality, most of the pro-       Link2: <a href="vote.jsp?poll_id=4568&candidate=green">
                                                                        Vote for Mrs. Green</a>
gramming languages used to develop web applications pro-                                                                          
vide methods for retrieving the complete list of values as-
sociated with a certain parameter. For example, the JSP            Suppose that Mallory, a Mrs. Green supporter, is inter-
getParameterValues method groups all the values to-             ested in subverting the result of the online election. By ana-
gether, and returns them as a list of strings. For the lan-     lyzing the webpage, he realizes that the application does not
guages that do not support this functionality, the developer    properly sanitize the poll id parameter. Hence, Mallory
                       Technology/Server                         Tested Method                       Parameter Precedence
                       ASP/IIS                   Request.QueryString("par")                   All (comma-delimited string)
                       PHP/Apache                              $ GET["par"]                                           Last
                       JSP/Tomcat               Request.getParameter("par")                                           First
                       Perl(CGI)/Apache                        Param("par")                                           First
                       Python/Apache                        getvalue("par")                                      All (List)

                    Table 1: Parameter precedence in the presence of multiple parameters with the same name



can use the HPP vulnerability to inject another parameter of                    good security practice when developing a web application
his choice. He then creates and sends to Alice the following                    is to accept parameters only from the input channel (e.g.,
malicious Url:                                                                  GET, POST, or Cookies) where they are supposed to be
                                                                                supplied. That is, an application that receives data from a
                                                                           
http://host/election.jsp?poll_id=4568%26candidate%4Dgreen                       POST request should not accept the same parameters if they
                                                                              are provided inside the URL. In fact, if this safety rule is ig-
                                                                                nored, an attacker could exploit an HPP ﬂaw to inject arbi-
   Note how Mallory “polluted” the poll id parameter                            trary parameter-value pairs into a channel A to override the
by injecting into it the candidate=green pair. By click-                        legitimate parameters that are normally provided in another
ing on the link, Alice is redirected to the original election                   channel B. Obviously, for this to be possible, a necessary
website where she can cast her vote for the election. How-                      condition is that the web technology gives precedence to A
ever, since the poll id parameter is URL-decoded and                            with respect to B.
used by the application to construct the links, when Alice
visits the page, the malicious candidate value is injected
into the URLs2 :                                                                HPP to bypass CSRF tokens One interesting use of HPP
                                                                                attacks is to bypass the protection mechanism used to pre-
                                                                              vent cross-site request forgery. A cross-site request forgery
http://host/election.jsp?poll_id=4568%26candidate%3Dgreen
                                                                                (CRSF) is a confused deputy type of attack [16] that works
Link 1: <a href=vote.jsp?poll_id=4568&candidate=green                           by including a malicious link in a page (usually in an im-
        &candidate=white>Vote for Mr. White</a>
Link 2: <a href=vote.jsp?poll_id=4568&candidate=green                           age tag) that points to a website in which the victim is sup-
        &candidate=green>Vote for Mrs. Green</a>                                posed to be authenticated. The attacker places parameters
                                                                           
                                                                                into the link that are required to initiate an unauthorized ac-
                                                                                tion. When the victim visits the attack page, the target ap-
    No matter which link Alice clicks on, the applica-
                                                                                plication receives the malicious request. Since the request
tion (in this case the vote.jsp script) will receive two
                                                                                comes from a legitimate user and includes the cookie asso-
candidate parameters. Furthermore, the ﬁrst parameter
                                                                                ciated with a valid session, the request is likely to be pro-
will always be set to green.
                                                                                cessed.
    In the scenario we discussed, it is likely that the devel-
                                                                                    A common technique to protect web applications against
oper of the voting application expected to receive only one
                                                                                CSRF attacks consists of using a secret request token (e.g.,
candidate name, and, therefore, relied on the provided ba-
                                                                                see [20, 25]). A unique token is generated by the applica-
sic Java functionality to retrieve a single parameter. As a
                                                                                tion and inserted in all the sensitive links URLs. When the
consequence, as shown in Table 1, only the ﬁrst value (i.e.,
                                                                                application receives a request, it veriﬁes that it contains the
green) is returned to the program, and the second value
                                                                                valid token before authorizing the action. Hence, since the
(i.e., the one carrying the Alice’s actual vote) is discarded.
                                                                                attacker cannot predict the value of the token, she cannot
    In summary, in the example we presented, since the vot-
                                                                                forge the malicious URL to initiate the action.
ing application is vulnerable to HPP, it is possible for an
                                                                                    A parameter pollution vulnerability can be used to inject
attacker to forge a malicious link that, once visited, tam-
                                                                                parameters inside the existing links generated by the appli-
pers with the content of the page, and returns only links that
                                                                                cation (that, therefore, include a valid secret token). With
force a vote for Mrs. Green.
                                                                                these injected parameters, it may be possible for the attacker
                                                                                to initiate a malicious action and bypass CSRF protection.
Cross-Channel Pollution HPP attacks can also be used                                A CSRF bypassing attack using HPP was demonstrated
to override parameters between different input channels. A                      in 2009 against Yahoo Mail [10]. The parameter injection
   2 URLs in the page snippets have the injected string emphasized by us-       permitted to bypass the token protections adopted by Ya-
ing a red, underlining font.                                                    hoo to protect sensitive operations, allowing the attacker to
delete all the mails of a user.                                          All the collected information is stored in a database that
   The following example demonstrates a simpliﬁed ver-               is later analyzed by a statistics component that groups to-
sion of the Yahoo attack:                                            gether information about the analyzed pages, and generates
                                                                     a report for the vulnerable URLs.
                                                                
Url:
                                                                         The general architecture of the system is summarized in
showFolder?fid=Inbox&order=down&tt=24&pSize=25&startMid=0            Figure 1. In the following, we describe the approach that is
%2526cmd=fmgt.emptytrash%26DEL=1%26DelFID=Inbox%26
cmd=fmgt.delete
                                                                     used to detect HPP vulnerabilities and each component in
                                                                     more detail.
Link:
showMessage?sort=date&order=down&startMid=0
%26cmd%3Dfmgt.emptytrash&DEL=1&DelFID=Inbox&                         3.1   Browser and Crawler Components
cmd=fmgt.delete&.rand=1076957714
                                                                
                                                                         Whenever the crawler issues a command such as the vis-
    In the example, the link to display the mail message is          iting of a new webpage, the instrumented browser in PA-
protected by a secret token that is stored in the .rand pa-          PAS ﬁrst waits until the target page is loaded. After the
rameter. This token prevents an attacker from including the          browser is ﬁnished parsing the DOM, executing the client-
link inside another page to launch a CSRF attack. How-               side scripts, and loading additional resources, a browser ex-
ever, by exploiting an HPP vulnerability, the attacker can           tension (i.e., plugin) extracts the content, the list of links,
still inject the malicious parameters (i.e., deleting all the        and the forms in the page.
mails of a user and emptying the trash can) into the legiti-             In order to increase the depth that a website can be
mate page. The injection string is a concatenation of the two        scanned with, the instrumented browser in PAPAS uses a
commands, where the second command needs to be URL-                  number of simple heuristics to automatically ﬁll forms (sim-
encoded twice in order to force the application to clean the         ilarly to previously proposed scanning solutions such as
trash can only after the deletion of the mails.                      [24]). For example, random alphanumeric values of 8 char-
                                                                     acters are inserted into password ﬁelds and a default e-
                                                                     mail address is inserted into ﬁelds with the name email,
3   Automated HPP Vulnerability Detection                            e-mail, or mail.
    with PAPAS                                                           For sites where the authentication or the provided inputs
                                                                     fail (e.g., because of the use of CAPTCHAs), the crawler
    Our PArameter Pollution Analysis System (PAPAS) to               can be assisted by manually logging into the application us-
automatically detect HPP vulnerabilities in websites con-            ing the browser, and then specifying a regular expression to
sists of four main components: A browser, a crawler, and             be used to prevent the crawler from visiting the log-out page
two scanners.                                                        (e.g., by excluding links that include the cmd=logout pa-
    The ﬁrst component is an instrumented browser that is            rameter).
responsible for fetching the webpages, rendering the con-
tent, and extracting all the links and form URLs contained           3.2   P-Scan: Analysis of the Parameter Prece-
in the page.                                                               dence
    The second component is a crawler that communicates
with the browser through a bidirectional channel. This                   The P-Scan component analyzes a page to determine
channel is used by the crawler to inform the browser on              the precedence of parameters if multiple occurrences of the
the URLs that need to be visited, and on the forms that need         same parameter are injected into an application. For URLs
to be submitted. Furthermore, the channel is also used to            that contain several parameters, each one is analyzed until
retrieve the collected information from the browser.                 the page’s precedence has been determined or all available
    Every time the crawler visits a page, it passes the ex-          parameters have been tested.
tracted information to the two scanners so that it can be                The algorithm we use to test the precedence of parame-
analyzed. The parameter Precedence Scanner (P-Scan) is               ters starts by taking the ﬁrst parameter of the URL (in the
responsible for determining how the page behaves when it             form par1=val1), and generates a new parameter value
receives two parameters with the same name. The Vulnera-             val2 that is similar to the existing one. The idea is to gen-
bility Scanner (V-Scan), in contrast, is responsible for test-       erate a value that would be accepted as being valid by the
ing the page to determine if it is vulnerable to HPP attacks.        application. For example, a parameter that represents a page
V-Scan does this by attempting to inject a new parameter             number cannot be replaced with a string. Hence, a number
inside one of the existing ones and analyzing the output.            is cloned into a consecutive number, and a string is cloned
The two scanners also communicate with the instrumented              into a same-length string with the ﬁrst two characters mod-
browser in order to execute the tests.                               iﬁed.
                                                Figure 1: Architecture of PAPAS


    In a second step, the scanner asks the browser to gen-            domain iFrames, and client-side scripts. It also uses regular
erate two new requests. The ﬁrst request contains only the            expressions to identify and remove “timers” that are often
newly generated value val2. In contrast, the second re-               used to report how long it takes to generate the page that
quest contains two copies of the parameter, one with the              is being accessed. In a similar way, all the date and time
original value val1, and one with the value val2.                     strings on the page are removed.
    Suppose, for example, that a page accepts two parame-                 The last part of the sanitization step consists of removing
ters par1 and par2. In the ﬁrst iteration, the ﬁrst parameter         all the URLs that reference the page itself. The problem is
is tested for the precedence behavior. That is, a new value           that as it is very common for form actions to submit data to
new val is generated and two requests are issued. In sum,             the same page, when the parameters of a page are modiﬁed,
the parameter precedence test is run on that pages that are           the self-referencing URLs also change accordingly. Hence,
the results of the three following requests:                          to cope with this problem, we also eliminate these URLs.
                                                                        After the pages have been stripped off their dynamic
    Page0 - Original Url: application.php?                            components, P-Scan compares them to determine the prece-
                            par1=val1&par2=val2                       dence of the parameters. Let P0’, P1’, and P2’ be the
    Page1 - Request 1:    application.php?
                            par1=new val&par2=val2                    sanitized versions of Page0, Page1, and Page2. The
    Page2 - Request 2:    application.php?                            comparison procedure consists of ﬁve different tests that are
                            par1=val1&par1=new val&par2=val2
                                                                    applied until one of the tests succeeds:

    A naive approach to determine the parameter precedence            I. Identity Test - The identity test checks whether the pa-
would be to simply compare the three pages returned by                     rameter under analysis has any impact on the content
the previous requests: If Page1 == Page2, then the sec-                    of the page. In fact, it is very common for query strings
ond (last) parameter would have precedence over the ﬁrst.                  to contain many parameters that only affect the inter-
If, however, Page2 == Page0, the application is giving                     nal state, or some “invisible” logic of the application.
precedence to the ﬁrst parameter over the second.                          Hence, if P0’ == P1’ == P2’, the parameter is
    Unfortunately, this straightforward approach does not                  considered to be ineffective.
work well in practice. Modern web applications are very               II. Base Test - The base test is based on the assumption
complex, and often include dynamic content that may still                  that the dynamic component stripping process is able
vary even when the page is accessed with exactly the same                  to perfectly remove all dynamic components from the
parameters. Publicity banners, RSS feeds, real-time statis-                page that is under analysis. If this is the case, the sec-
tics, gadgets, and suggestion boxes are only a few examples                ond (last) parameter has precedence over the ﬁrst if
of the dynamic content that can be present in a page and that              P1’==P2’. The situation is the opposite if P2’ ==
may change each time the page is accessed.                                 P0’. Note that despite our efforts to improve the dy-
    The P-Scan component resolves the dynamic content                      namic content stripping process as much as possible, in
problem in two stages. First, it pre-processes the page and                practice, it is rarely the case that the compared pages
tries to eliminate all dynamic content that does not depend                match perfectly.
on the values of the application parameters. That is, P-Scan
removes HTML comments, images, embedded contents, in-                 III. Join Test - The join test checks the pages for indica-
teractive objects (e.g., Java applets), CSS stylesheets, cross-             tions that show that the two values of the homonym
     parameters are somehow combined together by the ap-                    usually happens when the application does not expect
     plication. For example, it searches P2’ for two values                 to receive multiple parameters with the same name.
     that are separated by commas, spaces, or that are con-                 Hence, it receives an array (or a list) of parameters in-
     tained in the same HTML tag. If there is a positive                    stead of a single value. An error occurs if the value is
     match, the algorithm concludes that the application is                 later used in a function that expects a well-deﬁned type
     merging the values of the parameters.                                  (such as a number or a string). In this test, we search
                                                                            the page under analysis for strings that are associated
IV. Fuzzy Test - The fuzzy test is designed to cope with
                                                                            with common error messages or exceptions. In par-
     pages whose dynamic components have not been per-
                                                                            ticular, we adopted all the regular expressions that the
     fectly sanitized. The test aims to handle identical pages
                                                                            SqlMap project [13] uses to identify database errors in
     that may show minor differences because of embedded
                                                                            MySQL, PostgreSQL, MS SQL Server, Microsoft Ac-
     dynamic parts. The test is based on conﬁdence inter-
                                                                            cess, Oracle, DB2, and SQLite.
     vals. We compute two values, S21 and S20 , that repre-
     sent how similar P2’ is to the pages P1’ and P0’ re-                If none of these ﬁve tests succeed, the parameter is dis-
     spectively. The similarity algorithm we use is based on          carded from the analysis. This could be, for example, be-
     the Ratcliff/Obershelp pattern recognition algorithm,            cause of content that is generated randomly on the server-
     (also known as gestalt pattern matching [28]), and re-           side. The parameter precedence detection algorithm is then
     turns a number between 0 (i.e, completely different) to          run again on the next available parameter.
     1 (i.e., perfect match). The parameter precedence de-
     tection algorithm that we use in the fuzzy test works as
                                                                      3.3    V-Scan: Testing for HPP vulnerabilities
     follows:
                                                                        In this section, we describe how the V-Scan component
     if ABS(S21-S20) > DISCRIMINATION_THRESHOLD:
       if (S21 > S20) and (S21 > SIMILARITY_THRESHOLD):               tests for the presence of HTTP Parameter Pollution vulner-
         Precedence = last                                            abilities in web applications.
       else (S20 > S21) and (S20 > SIMILARITY_THRESHOLD):
         Precedence = first                                               For every page that V-Scan receives from the crawler,
       else:                                                          it tries to inject a URL-encoded version of an innocuous
         Unknown precedence
     else:                                                            parameter into each existing parameter of the query string.
       Unknown precedence                                             Then, for each injection, the scanner veriﬁes the presence
                                                                 
                                                                      of the parameter in links, action ﬁelds and hidden ﬁelds of
                                                                      forms in the answer page.
     To draw a conclusion, the algorithm ﬁrst checks if the               For example, in a typical scenario, V-Scan injects the
     two similarity values are different enough (i.e., the val-       pair “%26foo%3Dbar” into the parameter “par1=val1”
     ues show a difference that is greater than a certain dis-        and then checks if the “&foo=bar” string is included in-
     crimination threshold). If this is the case, the closer          side the URLs of links or forms in the answer page.
     match (if the similarity is over a minimum similarity                Note that we do not check for the presence of the vul-
     threshold) determines the parameter precedence. In               nerable parameter itself (e.g., by looking for the string
     other words, if the page with the duplicated parameters          “par1=val1&foo=bar”). This is because web applica-
     is very similar to the original page, there is a strong          tions sometimes use a different name for the same parame-
     probability that the web application is only using the           ter in the URL and in the page content. Therefore, the pa-
     ﬁrst parameter, and ignoring the second. However, if             rameter “par1” may appear under a different name inside
     the similarity is closer to the page with the artiﬁcially        the page.
     injected parameter, there is a strong probability that the
                                                                          In more detail, V-Scan starts by extracting the list
     application is only accepting the second parameter.
                                                                      PU RL = [PU 1 , PU 2 , . . . PU n ] of the parameters that
     The two threshold values have been determined by                 are present in the page URL, and the list PBody =
     running the algorithm on one hundred random web-                 [PB1 , PB2 , . . . PBm ] of the parameters that are present in
     pages that failed to pass the base test, and for which           links or forms contained in the page body.
     we manually determined the precedence of parame-                 It then computes the following three sets:
     ters. The two experimental thresholds (set respectively
     to 0.05 and 0.75) were chosen to maximize the accu-                • PA = PU RL ∩ PBody is the set of parameters that ap-
     racy of the detection, while minimizing the error rate.              pear unmodiﬁed in the URL and in the links or forms
                                                                          of the page.
V. Error Test - The error test checks if the application
     crashes, or returns an ”internal” error when an identi-            • PB = p | p ∈ PU RL ∧ p ∈      / PBody contains the
     cal parameter is injected multiple times. Such an error              URL parameters that do not appear in the page. Some
       of these parameters may appear in the page under a
       different name.
                                                                       A parameter is used to store the URL of the target page.
    • PC = p | p ∈   / PU RL ∧ p ∈ PBody is the set of              Hence, performing an injection in that parameter is equiva-
      parameters that appear somewhere in the page, but that        lent to modifying its value to point to a different URL. Even
      are not present in the URL.                                   though this technique is syntactically very similar to an HPP
    First, V-Scan starts by injecting the new parameter in          vulnerability, it is not a proper injection case. Therefore, we
the PA set. We observed that in practice, in the majority           decided to consider this case as a false positive of the tool.
of the cases, the application copies the parameter to the              The second case that generates false alarms is the op-
page body and maintains the same name. Hence, there                 posite of the ﬁrst case. In some pages, the entire URL of
is a high probability that a vulnerability will be identi-          the page becomes a parameter in one of the links. This
ﬁed at this stage. However, if this test does not discover          can frequently be observed in pages that support printing or
any vulnerability, then the scanner moves on to the sec-            sharing functionalities. For example, imagine an applica-
ond set (PB ). In the second test, the scanner tests for the        tion that contains a link to report a problem to the website’s
(less likely) case in which the vulnerable parameter is re-         administrator. The link contains a parameter page that ref-
named by the application. Finally, in the ﬁnal test, V-Scan         erences the URL of the page responsible for the problem:
takes the parameters in the PC group, attempts to add these
to the URL, and use them as a vector to inject the ma-                                                                               
licious pair. This is because webpages usually accept a             Url: search.html?session_id=jKAmSZx5%26foo%3Dbar&q=shoes
very large number of parameters, not all of which are nor-          Link: service_request.html?page=search%2ehtml%3f
mally speciﬁed in the URL. For example, imagine a case in                 session_id%3djKAmSZx5&foo=bar&q=shoes
                                                                                                                                     
which we observe that one of the links in the page con-
tains a parameter “language=en”. Suppose, however,
that this parameter is not present in the page URL. In the
ﬁnal test, V-Scan would attempt to build a query string like           Note that by changing the URL of the page, we also
“par1=var1&language=en%26foo%3Dbar”.                                change the page parameter contained in the link. Clearly,
    Note that the last test V-Scan applies can be executed on       this is not an HPP vulnerability.
pages with an empty query string (but with parameterized               Since the two previous implementation techniques are
links/forms), while the ﬁrst two require pages that already         quite common in web applications, PAPAS would erro-
contain a query string.                                             neously report these sites as being vulnerable to HPP. To
    In our prototype implementation, the V-Scan component           eliminate such alarms and to make PAPAS suitable for
encodes the attacker pair using the standard URL encod-             large-scale analysis, we integrated heuristics into the V-
ing schema3 . Our experiments show that this is sufﬁcient           Scan component to cross-check and verify that the vulner-
for discovering HPP ﬂaws in many applications. However,             abilities that are identiﬁed do not correspond to these two
there is room for improvement as in some cases, the attacker        common techniques that are used in practice.
might need to use different types of encodings to be able to           In our prototype implementation, in order to eliminate
trigger a bug. For example, this was the case of the HPP            these false alarms, V-Scan checks that the parameter in
attack against Yahoo (previously described in Section 2)            which the injection is performed does not start with a
where the attacker had to double URL-encode the “clean-             scheme speciﬁer string (e.g., http://). Then, it veri-
ing of the trash can” action.                                       ﬁes that the parameter as a whole is not used as the tar-
                                                                    get for a link. Furthermore, it also checks that the entire
Handling special cases In our experiments, we identiﬁed             URL is not copied as a parameter inside a link. Finally,
two special cases in which, even though our vulnerability           our vulnerability analysis component double-checks each
scanner reported an alert, the page was not actually vulner-        vulnerability by injecting the new parameter without url-
able to parameter pollution.                                        encoding the separator (i.e., by injecting &foo=bar in-
    In the ﬁrst case, one of the URL parameters (or part of         stead of %26foo%3Dbar). If the result is the same, we
it) is used as the entire target of a link. For example:            know that the query string is simply copied inside another
                                                                  URL. While such input handling is possibly a dangerous
Url:  index.php?v1=p1&uri=apps%2Femail.jsp%3Fvar1%3Dpar1            design decision on the side of the developer, there is a high
                                 %26foo%3Dbar
Link: apps/email.jsp?var1=par1&foo=bar
                                                                    probability that it is intentional so we ignore it and do not
                                                                  report it by default. However, such checks can be deacti-
    3 URL
        Encoding Reference,   http://www.w3schools.com/             vated anytime if the analyst would like to perform a more
TAGS/ref urlencode.asp                                              in-depth analysis of the website.
3.4   Implementation                                              analogous to reﬂected XSS attacks) where the user needs
                                                                  to click on a link prepared by the attacker. Some HPP vul-
    The browser component of PAPAS is implemented as a            nerabilities can also be used to exploit server-side compo-
Firefox extension, while the rest of the system is written in     nents (when the malicious parameter value is not included
Python. The components communicate over TCP/IP sock-              in a link but it is decoded and passed to a back-end com-
ets.                                                              ponent). However, testing for server-side attacks is more
    Similar to other scanners, it would have been possible to     difﬁcult than testing for client-side attacks as comparing re-
directly retrieve web pages without rendering them in a real      quests and answers is not sufﬁcient (i.e., similar to the dif-
browser. However, such techniques have the drawback that          ﬁculty of detecting stored SQL-injection vulnerabilities via
they cannot efﬁciently deal with dynamic content that is of-      black-box scanning). We leave the detection of server-side
ten found on Web pages (e.g., Javascript). By using a real        attacks to future work.
browser to render the pages we visit, we are able to analyze
the page as it is supposed to appear to the user after the dy-    4     Evaluation
namic content has been generated. Also, note that unlike
detecting cross site scripting or SQL injections, the ability         We evaluated our detection technique by running two ex-
to deal with dynamic content is a necessary prerequisite to       periments. In the ﬁrst experiment, we used PAPAS to au-
be able to test for HPP vulnerabilities using a black-box ap-     tomatically scan a list of popular websites with the aim of
proach.                                                           measuring the prevalence of HPP vulnerabilities in the wild.
    The browser extension has been developed using the            We then selected a limited number of vulnerable sites and,
standard technology offered by the Mozilla development            in a second experiment, performed a more in-depth analysis
environment: a mix of Javascript and XML User Interface           of the detected vulnerabilities to gain a better understanding
Language (XUL). We use XPConnect to access Firefox’s              of the possible consequences of the vulnerabilities our tool
XPCOM components. These components are used for in-               automatically identiﬁed.
voking GET and POST requests and for communicating
with the scanning component.
    PAPAS supports three different operational modes: fast        4.1    HPP Prevalence in Popular Websites
mode, extensive mode and assisted mode. The fast mode
aims to rapidly test a site until potential vulnerabilities are       In the ﬁrst experiment, we collected 5,000 unique URLs
discovered. Whenever an alert is generated, the analysis          from the public database of Alexa. In particular, we ex-
continues, but the V-Scan component is not invoked to im-         tracted the top ranked sites from each of the Alexa’s cate-
prove the scanning speed. In the extensive mode, the entire       gories [3]. Each website was considered only once – even
website is tested exhaustively and all potential problems and     if it was present in multiple distinct categories, or with dif-
injections are logged. The assisted mode allows the scanner       ferent top-level domain names such as google.com and
to be used in an interactive way. That is, the crawler pauses     google.fr.
and speciﬁc pages can be tested for parameter precedence              The aim of our experiments was to quickly scan as many
and HPP vulnerabilities. The assisted mode can be used by         websites as possible. Our basic premise was that it would
security professionals to conduct a semi-automated assess-        be likely that the application would contain parameter in-
ment of a web application, or to test websites that require a     jection vulnerabilities on many pages and on a large number
particular user authentication.                                   of parameters if the developers of the site were not aware of
    PAPAS is also customizable and settings such as scan-         the HPP threat and had failed to properly sanitize the user
ning depths, numbers of injections that are performed, wait-      input.
ing times between requests, and page loading timeouts are             To maximize the speed of the tests, we conﬁgured the
all conﬁgurable by the analyst.                                   crawler to start from the homepage and visit the sub-pages
                                                                  up to a distance of three (i.e., three clicks away from the
3.5   Limitations                                                 website’s entry point). For the tests, we only considered
                                                                  links that contained at least one parameter. In addition, we
    Our current implementation of PAPAS has several limi-         limited the analysis to 5 instances per page (i.e., a page with
tations. First, PAPAS does not support the crawling of links      the same URL, but a different query string was considered
embedded in active content such as Flash, and therefore, is       a new instance). The global timeout was set to 15 minutes
not able to visit websites that rely on active content tech-      per site and the browser was customized to quickly load
nologies to navigate among the pages.                             and render the pages, and run without any user interaction.
    Second, currently, PAPAS focuses only on HPP vulner-          Furthermore, we disabled pop-ups, image loading, and any
abilities that can be exploited via client-side attacks (e.g.,    plug-ins for active content technologies such as Flash, or
                               Categories     # of Tested               Categories     # of Tested
                                             Applications                             Applications
                                 Internet             698              Government              132
                                   News               599        Social Networking             117
                                Shopping              460                    Video             114
                                  Games               300                 Financial            110
                                  Sports              256             Organization             106
                                  Health              235                University             91
                                 Science              222                   Others           1401
                                  Travel              175

                                        Table 2: TOP15 categories of the analyzed sites



Silverlight. An external watchdog was also conﬁgured to              nately, as shown in the rest of the section, the results of our
monitor and restart the browser in case it became unrespon-          experiments suggest that many developers are not aware of
sive.                                                                HPP.
    In 13 days of experiments, we successfully scanned                   Figure 2 shows that for 4% of the websites we analyzed,
5,016 websites, corresponding to a total of 149,806 unique           our scanner was not been able to automatically detect the
pages. For each page, our tool generated a variable amount           parameter precedence. This is usually due to two main rea-
of queries, depending on the number of detected parame-              sons. The ﬁrst reason is that the parameters do not affect
ters. The websites we tested were distributed over 97 coun-          (or only minimally affect) the rendered page. Therefore,
tries and hundreds of different Alexa categories. Table 2            the result of the page comparison does not reach the dis-
summarizes the 15 categories containing the higher number            crimination threshold. The second reason is the opposite
of tested applications.                                              of the ﬁrst. That is, the page shows too many differences
                                                                     even after the removal of the dynamic content, and the re-
Parameter Precedence For each website, the P-Scan                    sult of the comparison falls below the similarity threshold
component tested every page to evaluate the order in which           (see Section 3.2 for the full algorithm and an explanation of
the GET parameters were considered by the application                the threshold values).
when two occurrences of the same parameter were spec-                    The scanner found 238 applications that raised an SQL
iﬁed. The results were then grouped together in a per-site           error when they were tested with duplicated parameters.
summary, as shown in Figure 2. The ﬁrst column reports the           Quite surprisingly, almost 5% of the most popular websites
type of parameter precedence. Last and First indicate that           on the Internet failed to properly handle the user input, and
all the analyzed pages of the application uniformly consid-          returned an ”internal” error page when a perfectly-legal pa-
ered the last or the ﬁrst speciﬁed value. Union indicates that       rameter was repeated twice. Note that providing two param-
the two parameters were combined together to form a sin-             eters with the same name is a common practice in many ap-
gle value, usually by simply concatenating the two strings           plications, and most of the programming languages provide
with a space or a comma. In contrast, the parameter prece-           special functionalities to access multiple values. Therefore,
dence is set to inconsistent when different pages of the web-        this test was not intended to be an attack against the appli-
site present mismatching precedences (i.e., some pages fa-           cations, but only a check to verify which parameter’s value
vor the ﬁrst parameter’s value, others favor the last). The          was given the precedence. Nevertheless, we were surprised
inconsistent state, accounting for a total of 25% of the ana-        to note error messages from the websites of many major
lyzed applications, is usually a consequence of the fact that        companies, banks and government institutions, educational
the website has been developed using a combination of het-           sites, and others popular websites.
erogeneous technologies. For example, the main implemen-
tation language of the website may be PHP, but a few Perl            HPP Vulnerabilities PAPAS discovered that 1499 web-
scripts may still be responsible for serving certain pages.          sites (29.88% of the total we analyzed) contained at least
    Even though the lack of a uniform behavior can be suspi-         one page vulnerable to HTTP Parameter Injection. That is,
cious, it is neither a sign, nor a consequence of a vulnerable       the tool was able to automatically inject an encoded param-
application. In fact, each parameter precedence behavior             eter inside one of the existing parameters, and was then able
(even the inconsistent case) is perfectly safe if the applica-       to verify that its URL-decoded version was included in one
tion’s developers are aware of the HPP threat and know how           of the URLs (links or forms) of the resulting page.
to handle a parameter’s value in the proper way. Unfortu-                However, the fact that it is possible to inject a parameter
           Parameter Precedence      WebSites
                            Last       2,237     (44.60%)
                           First         946     (18.86%)
                          Union          381     (7.60%)                                                        
                                                                                                                
                    Inconsistent       1,251     (24.94%)                                                        
                                                                                                                           
                      Unknown            201     (4.00%)                                                               
                           Total       5,016     (100.00%)
                Database Errors          238     (4.74%)



                            Figure 2: Precedence when the same parameter occurs multiple time



does not reveal information about the signiﬁcance and the               The ﬁnal result was that at least 702 out of the 872 ap-
consequences of the injection. Therefore, we attempted to           plications of the ﬁrst group were exploitable. For the re-
verify the number of exploitable applications (i.e., the sub-       maining 170 pages, we were not able, through a parameter
set of vulnerable websites in which the injected parameter          injection, to affect the behavior of the application.
could potentially be used to modify the behavior of the ap-             For the applications in the second group, the impact of
plication).                                                         the vulnerability is more difﬁcult to estimate in an auto-
    We started by splitting the vulnerable set into two sepa-       mated fashion. In fact, since modern browsers automati-
rate groups. In 872 websites (17.39%), the injection was on         cally encode all the form ﬁelds, the injected parameter will
a link or a form’s action ﬁeld. In the remaining 627 cases          still be sent in a url-encoded form, thus making an attack
(12.5%), the injection was on a form’s hidden ﬁeld.                 ineffective.
    For the ﬁrst group, our tool veriﬁed if the parameter in-           In such a case, it may still be possible to exploit the appli-
jection vulnerability could be used to override the value of        cation using a two-step attack where the malicious value is
one of the existing parameters in the application. This is          injected into the vulnerable ﬁeld, it is propagated in the form
possible only if the parameter precedence of the page is con-       submission, and it is (possibly) decoded and used in a later
sistent with the position of the injected value. For example,       stage. In addition, the vulnerability could also be exploited
if the malicious parameter is always added to the end of the        to perform a server-side attack, as explained in Section 3.5.
URL and the ﬁrst value has parameter precedence, it is im-          However, using a black-box approach, it is very difﬁcult to
possible to override any existing parameter.                        automatically test the exploitability of multi-step or server-
    When the parameter precedence is not favorable, a vul-          side vulnerabilities. Furthermore, server-side testing might
nerable application can still be exploitable by injecting a         have had ethical implications (see Section 4.3 for discus-
new parameter (that differs from all the ones already present       sion). Therefore, we did not perform any further analysis in
in the URL) that is accepted by the target page.                    this direction.
    For example, consider a page target.pl that accepts             To conclude, we were able to conﬁrm that in (at least) 702
an action parameter. Suppose that, on the same page, we             out of the 1499 vulnerable websites (i.e., 46.8%) that PA-
ﬁnd a page poor.pl vulnerable to HPP:                               PAS identiﬁed, it would have been possible to exploit the
                                                                    HPP vulnerability to override one of the hard-coded param-
                                                               
Url: poor.pl?par1=val1%26action%3Dreset
                                                                    eters, or to inject another malicious parameter that would
Link: target.pl?x=y&w=z&par1=val1&action=reset                      affect the behavior of the application.
                                                               
                                                                        Figure 3 shows the fraction of vulnerable and exploitable
                                                                    applications grouped by the different Alexa categories. The
   Since in Perl the parameter precedence is on the ﬁrst            results are equally divided, suggesting that important ﬁnan-
value, it is impossible to override the x and w parameters.         cial and health institutions do not seem to be more security-
However, as shown in the example, the attacker can still            aware and immune to HPP than leisure sites for sporting
exploit the application by injecting the action parameter           and gaming.
that she knows is accepted by the target.pl script. Note
that while the parameter overriding test was completely au-
tomated, this type of injection required a manual supervi-          False Positives In our vulnerability detection experi-
sion to verify the effects of the injected parameter on the         ments, the false positives rate was 1.12% (10 applications).
web application.                                                    All the false alarms were due to parameters that were used
                                           Figure 3: Vulnerability rate for category



by the application as an entire target for one of the links.      cases.
The heuristic we implemented to detect these cases (ex-
plained in Section 3.3) failed because the applications ap-
                                                                  Facebook Share Facebook, Twitter, Digg and other so-
plied a transformation to the parameter before using it as a
                                                                  cial networking sites offer a share component to easily share
link’s URL.
                                                                  the content of a webpage over a user proﬁle. Many news
    Note that, to maximize efﬁciency, our results were ob-        portals nowadays integrate these components with the in-
tained by crawling each website at a maximum depth of             tent of facilitating the distribution of their news.
three pages. In our experiments, we observed that 11% of
                                                                      By reviewing the vulnerability logs of the tested appli-
the vulnerable pages were directly linked from the home-
                                                                  cations, we noticed that different sites allowed a parameter
page, while the remaining 89% were equally distributed be-
                                                                  injection on the links referencing the share component of
tween the distance of 2 and 3. This trend suggests that it
                                                                  Facebook. In all those cases, a vulnerable parameter would
is very probable that many more vulnerabilities could have
                                                                  allow an attacker to alter the request sent to Facebook and to
been found by exploring the sites in more depth.
                                                                  trick the victim into sharing a page chosen by the attacker.
                                                                  For example, it was possible for an attacker to exploit these
                                                                  vulnerabilities to corrupt a shared link by overwriting the
4.2   Examples of Discovered Vulnerabilities                      reference with the URL of a drive-by-download website.
                                                                      In technical terms, the problem was due to the fact that
    Our ﬁnal experiments consisted of the further analysis of     it was possible to inject an extra url-to-share parameter that
some of the vulnerable websites that we identiﬁed. Our aim        could overwrite the value of the parameter used by the ap-
was to gain an insight into the real consequences of the HPP      plication. For example:
vulnerabilities we discovered.
                                                                                                                                  
    The analysis we performed was assisted by the V-Scan          Url:
component. When invoked in extensive mode, V-Scan was             <site>/shareurl.htm?PG=<default url>&zItl=<description>
                                                                                %26url-to-share%3Dhttp://www.malicious.com
able to explore in detail the web application, enumerating        Link:
all the vulnerable parameters. For some of the websites, we       http://www.facebook.com/sharer.php?
also registered an account and conﬁgured the scanner to test            url-to-share=<default url>&t=<description>&
                                                                        url-to-share=http://www.malicious.com
the authenticated part of the website.                                                                                            
    HPP vulnerabilities can be abused to run a wide range of
different attacks. In the rest of this section, we discuss the        Even though the problem lies with the websites that use
different classes of problems we identiﬁed in our analysis        the share component, Facebook facilitated the exploitation
with the help of real-world examples.                             by accepting multiple instances of the same parameter, and
    The problems we identiﬁed affected many important and         always considering the latest value (i.e., the one on the
well-known websites such as Microsoft, Google, VMWare,            right).
About.com, Symantec, history.com, ﬂickr, and Paypal.                  We notiﬁed the security team of Facebook and proposed
Since, at the time of writing, we have not yet received con-      a simple solution based on the ﬁltering of all incoming shar-
ﬁrmation that all of the vulnerabilities have been ﬁxed, we       ing requests that include duplicate parameters. The team
have anonymized the description of the following real-word        promptly acknowledged the issue and informed us that they
were willing to put in place our countermeasure.                  the attacker to tamper with the data provided by the vulner-
                                                                  able website, and to present to the victim some information
CSRF via HPP Injection Many applications use hidden               chosen by the attacker.
parameters to store a URL that is later used to redirect the         On several popular news portals, we managed to modify
users to an appropriate page. For example, social networks        the news search results to hide certain news, to show the
commonly use this feature to redirect new users to a page         news of a certain day with another date, or to ﬁlter the news
where they can look up a friend’s proﬁle.                         of a speciﬁc source/author. An attacker can exploit these
    In some of these sites, we observed that it was possible      vulnerabilities to promote some particular news, or conceal
for an attacker to inject a new redirect parameter inside the     news that can hurt his person/image, or even subvert the
registration or the login page so that it could override the      information by replacing an article with an older one.
hard-coded parameter’s value. On one social-network web-             Also some multimedia websites were vulnerable to HPP
site, we were able to inject a custom URL that had the effect     attacks. In several popular sites, an attacker could over-
of automatically sending friend requests after the login. In      ride the video links and make them point to a link of his
another site, by injecting the malicious pair into the regis-     choice (e.g., a drive-by download site), or alter the results
tration form, an attacker could perform different actions on      of a query to inject malicious multimedia materials. In one
the authenticated area.                                           case, we were able to automatically register a user to a spe-
    This problem is a CSRF attack that is carried out via an      ciﬁc streaming event.
HPP injection. The advantages compared to a normal CSRF              Similar problems also affected several popular search en-
is that the attack URL is injected into the real login/regis-     gines. We noticed that it would have been possible to tam-
tration page. Moreover, the user does not have to be already      per with the results of the search functionality by adding
logged into the target website because the action is auto-        special keywords, or by manipulating the order in which
matically executed when the user logs into the application.       the results are shown. We also noticed that on some search
However, just like in normal CSRF, this attack can be pre-        engines, it was possible to replace the content of the com-
vented by using security tokens.                                  mercial suggestion boxes with links to sites owned by the
                                                                  attacker.
Shopping Carts We discovered different HPP vulnerabil-
ities in online shopping websites that allow the attacker to
tamper with the user interaction with the shopping cart com-      4.3   Ethical Considerations
ponent.
    For example, in several shopping websites, we were able           Crawling and automatically testing a large number of ap-
to force the application to select a particular product to be     plications may be considered an ethically sensitive issue.
added into the user’s cart. That is, when the victim checks       Clearly, one question that arises is if it is ethically accept-
out and would like to pay for the merchandise, she is actu-       able and justiﬁable to test for vulnerabilities in popular web-
ally paying for a product that is different from the ones she     sites.
actually selected. On an Italian shopping portal, for exam-           Analogous to the real-world experiments conducted by
ple, it was even possible to override the ID of the product       Jakobsson et al. in [21, 22], we believe that realistic exper-
in such a way that the browser was still showing the image        iments are the only way to reliably estimate success rates
and the description of the original product, even when the        of attacks in the real-world. Unfortunately, criminals do
victim was actually buying a different one.                       not have any second thoughts about discovering vulnerabil-
                                                                  ities in the wild. As researchers, we believe that our ex-
Financial Institutions We ran PAPAS against the authen-           periments helped many websites to improve their security.
ticated and non-authenticated areas of some ﬁnancial web-         Furthermore, we were able to raise some awareness about
sites and the tool automatically detected several HPP vul-        HPP problems in the community.
nerabilities that were potentially exploitable. Since the links       Also, note that:
involved sensitive operations (such as increasing account
limits and manipulating credit card operations), we imme-           • PAPAS only performed client-side checks. Similar
diately stopped our experiments and promptly informed the             client-side vulnerability experiments have been pe-
security departments of the involved companies. The prob-             formed before in other studies (e.g., for detecting
lems were acknowledged and are currently being ﬁxed.                  cross site scripting, SQL injections, and CSRF in the
                                                                      wild [24, 29]). Furthermore, we did not perform any
Tampering with Query Results In most cases, the HPP                   server-side vulnerability analysis because such experi-
vulnerabilities that we discovered in our experiments allow           ments had the potential to cause harm.
    • We only provided the applications with innocuous pa-      reveals that the tool only looks for behavioral differences
      rameters that we knew that the applications were al-      when HTTP parameters are duplicated (i.e., not a sufﬁcient
      ready accepting, and did not use any malicious code as    test by itself to detect HPP). Unfortunately, we were not
      input.                                                    able to obtain more information about the inner-workings
                                                                of the tool as Cenzic did not respond to our request for an
    • PAPAS was not powerful enough to inﬂuence the per-        evaluation version.
      formance of any website we investigated, and the scan         The injection technique we use is similar to other black-
      activities was limited to 15 minutes to further reduce    box approaches such as SecuBat [24] that aim to discover
      the generated trafﬁc.                                     SQL injection, or reﬂected cross site scripting vulnerabili-
    • We informed the concerned sites of any critical vulner-   ties. However, note that conceptually, detecting cross site
      abilities that we discovered.                             scripting or SQL injection is different from detecting HPP.
                                                                In fact, our approach required the development of a set of
    • None of the security groups of the websites that we       tests and heuristics to be able to deal with dynamic content
      interacted with complained to us when we informed         that is often found on webpages today (content that is not
      them that we were researchers, and that we had dis-       an issue when testing for XSS or SQL injection). Hence,
      covered vulnerabilities on their site with a tool that    compared to existing work in literature, our approach for
      we were testing. On the contrary, many people were        detecting HPP, and the prototype we present in this paper
      thankful to us that we were informing them about vul-     are unique.
      nerabilities in their code, and helping them make their       With respect to white-box testing of web applications,
      site more secure.                                         a large number of static source code analysis tools (e.g.,
                                                                [23, 31, 34]) that aim to identify vulnerabilities have been
5     Related work                                              proposed. These approaches typically employ taint tracking
                                                                to help discover if tainted user input reaches a critical func-
                                                                tion without being validated. We believe that static code
   There are two main approaches [14] to test software
                                                                analysis would be useful and would help developers iden-
applications for the presence of bugs and vulnerabilities:
                                                                tify HPP vulnerabilities. However, to be able to use static
white-box testing and black-box testing. In white-box test-
                                                                code analysis, it is still necessary for the developers to un-
ing, the source code of an application is analyzed to ﬁnd
                                                                derstand the concept of HPP. Previous research has shown
ﬂaws. In contrast, in black-box testing, input is fed into
                                                                that the sanitization process can still be faulty if the devel-
a running application and the generated output is analyzed
                                                                oper does not understand a certain class of vulnerability [4].
for unexpected behavior that may indicate errors. PAPAS
                                                                    Note that there also exists a large body of more general
adopts a black-box approach to scan for vulnerabilities.
                                                                vulnerability detection and security assessment tools (e.g.,
   When analyzing web applications for vulnerabilities,
                                                                Nikto [26], and Nessus [32]). Such tools typically rely on
black-box testing tools (e.g., [2, 8, 24, 33]) are the most
                                                                a repository of known vulnerabilities and test for the exis-
popular. Some of these tools (e.g., [2]) claim to be generic
                                                                tence of these ﬂaws. In comparison, our approach aims to
enough to identify a wide range of vulnerabilities in web
                                                                discover previously unknown HPP vulnerabilities in the ap-
applications. However, recent studies ([6, 11]) have shown
                                                                plications that are under analysis.
that scanning solutions that claim to be generic have seri-
                                                                    With respect to scanning, there also exist network-level
ous limitations, and that they are not as comprehensive in
                                                                tools such as nmap [18]. Tools like nmap can determine the
practice as they pretend to be.
                                                                availability of hosts and accessible services. However, they
   Two well-known, older web vulnerability detection and
                                                                cannot detect higher-level application vulnerabilities.
mitigation approaches in literature are Scott and Sharp’s
                                                                    In comparison to the work we present in this paper, to
application-level ﬁrewall [30] and Huang et al.’s [17] vul-
                                                                the best of our knowledge, no large-scale study has been
nerability detection tool that automatically executes SQL
                                                                performed to date to measure the prevalence and the signif-
injection attacks. Scott and Sharp’s solution allows to de-
                                                                icance of HPP vulnerabilities in popular websites.
ﬁne ﬁne-grained policies manually in order to prevent at-
tacks such as parameter tampering and cross-site scripting.
However, it cannot prevent HPP attacks and has not been         6   Conclusion
designed with this vulnerability in mind. In comparison,
Huang et al.’s work solely focuses on SQL injection vulner-        Web applications are not what they used to be ten years
ability detection using fault injection.                        ago. Popular web applications have now become more dy-
   To the best of our knowledge, only one of the available      namic, interactive, complex, and often contain a large num-
black-box scanners, Cenzic Hailstorm [9], claims to support     ber of multimedia components. Unfortunately, as the pop-
HPP detection. However, a study of its marketing material       ularity of a technology increases, it also becomes a target
for criminals. As a result, most attacks today are launched          [5] D. Bates, A. Barth, and C. Jackson. Regular Expressions
against web applications.                                                Considered Harmful in Client-Side XSS Filters. In 19th
    Vulnerabilities such as cross site scripting, SQL injec-             International World Wide Web Conference. (WWW 2010),
tion, and cross site request forgery are well-known and                  2010.
have been intensively studied by the research community.             [6] J. Bau, E. Burzstein, D. Gupta, and J. C. Mitchell. State of
Many solutions have been proposed, and tools have been                   the Art: Automated Black-Box Web Application Vulnerabil-
                                                                         ity Testing. In Proceedings of IEEE Security and Privacy,
released. However, a new class of injection vulnerabili-
                                                                         May 2010.
ties called HTTP Parameter Pollution (HPP) that was ﬁrst
                                                                     [7] T. Berners-Lee, R. Fielding, and L. Masinter. Rfc 3986, uni-
presented at the OWASP conference [27] in 2009 has not                   form resource identiﬁer (uri): Generic syntax, 2005. http:
received as much attention. If a web application does not                //rfc.net/rfc3986.html.
properly sanitize the user input for parameter delimiters, us-       [8] Burp Spider.      Web Application Security.       http://
ing an HPP vulnerability, an attacker can compromise the                 portswigger.net/spider/, 2008.
logic of the application to perform client-side or server-side       [9] Cenzic. Cenzic Hailstormr. http://www.cenzic.
attacks.                                                                 com/, 2010.
    In this paper, we present the ﬁrst automated approach for       [10] S. di Paola and L. Carettoni. Client side Http Parameter
the discovery of HPP vulnerabilities in web applications.                Pollution - Yahoo! Classic Mail Video Poc, May 2009.
Our prototype implementation called PArameter Pollution                  http://blog.mindedsecurity.com/2009/05/
Analysis System (PAPAS) is able to crawl websites and dis-               client-side-http-parameter-pollution.
cover HPP vulnerabilities by parameter injection. In order               html.
to determine the feasibility of our approach and to assess          [11] A. Doupé, M. Cova, and G. Vigna. Why Johnny Cant Pen-
the prevalence of HPP vulnerabilities on the Internet today,             test: An Analysis of Black-Box Web Vulnerability Scanners.
                                                                         Detection of Intrusions and Malware, and Vulnerability As-
we analyzed more than 5,000 popular websites. Our results
                                                                         sessment, pages 111–131, 2010.
show that about 30% of the sites we analyzed contain vul-
                                                                    [12] R. Fielding, J. Gettys, J. Mogul, H. Frystyk, L. Masinter,
nerable parameters and that at least 14% of them can be
                                                                         P. Leach, and T. Berners-Lee. Rfc 2616, hypertext trans-
exploited using HPP. A large number of well-known, high-                 fer protocol – http/1.1, 1999. http://www.rfc.net/
proﬁle websites such as Symantec, Google, VMWare, and                    rfc2616.html.
Microsoft were among the sites affected by HPP vulnera-             [13] B. D. A. G. and M. Stampar. sqlmap. http://sqlmap.
bilities that we discovered. We informed the sites for which             sourceforge.net.
we could obtain contact information, and some of these sites        [14] C. Ghezzi, M. Jazayeri, and D. Mandrioli. Fundamentals of
wrote back to us and conﬁrmed our ﬁndings.                               Software Engineering. Prentice-Hall International, 1994.
    We hope that this paper will help raise awareness and           [15] W. G. J. Halfond and A. Orso. Preventing SQL injection
draw attention to the HPP problem.                                       attacks using AMNESIA. In ICSE ’06: Proceedings of
                                                                         the 28th international conference on Software engineering,
                                                                         2006.
Acknowledgments This work has been supported by
                                                                    [16] N. Hardy. The Confused Deputy: (or why capabilities might
the POLE de Competitivite SCS (France) through the
                                                                         have been invented). ACM SIGOPS Operating Systems Re-
MECANOS project and by the French National Research
                                                                         view, 22(4), October 1988.
Agency through the VAMPIRE project. The work has also
                                                                    [17] Y. Huang, S. Huang, and T. Lin. Web Application Secu-
received support from the Secure Business Austria in Vi-                 rity Assessment by Fault Injection and Behavior Monitor-
enna.                                                                    ing. 12th World Wide Web Conference, 2003.
                                                                    [18] Insecure.org. NMap Network Scanner. http://www.
References                                                               insecure.org/nmap/, 2010.
                                                                    [19] S. Institute.            Top Cyber Security Risks,
 [1] C. A. A-2000-02. Malicious HTML Tags Embedded in                    September 2009.                http://www.sans.org/
     Client Web Requests, 2000. http://www.cert.org/                     top-cyber-security-risks/summary.php.
     advisories/CA-2000-02.html.                                    [20] A. B. C. Jackson and J. C. Mitchell. Robust Defenses for
 [2] Acunetix. Acunetix Web Vulnerability Scanner. http:                 Cross-Site Request Forgery. In 15th ACM Conference on
     //www.acunetix.com/, 2008.                                          Computer and Communications Security, 2007.
 [3] I. Alexa Internet. Alexa - Top Sites by Category: Top.         [21] M. Jakobsson, P. Finn, and N. Johnson. Why and How
     http://www.alexa.com/topsites/category.                             to Perform Fraud Experiments. Security & Privacy, IEEE,
 [4] D. Balzarotti, M. Cova, V. Felmetsger, D. Balzarotti, N. Jo-        6(2):66–68, March-April 2008.
     vanovic, C. Kruegel, E. Kirda, and G. Vigna. Saner: Com-       [22] M. Jakobsson and J. Ratkiewicz. Designing ethical phishing
     posing Static and Dynamic Analysis to Validate Sanitization         experiments: a study of (ROT13) rOnl query features. In
     in Web Applications. In IEEE Symposium on Security and              15th International Conference on World Wide Web (WWW),
     Privacy, 2008.                                                      2006.
[23] N. Jovanovic, C. Kruegel, and E. Kirda. Pixy: A Static              request forgery ﬂaws and unveil tools to protect against
     Analysis Tool for Detecting Web Application Vulnerabilities         these attacks, 2008.      http://www.darkreading.
     (Short Paper). In IEEE Symposium on Security and Privacy,           com/security/app-security/showArticle.
     2006.                                                               jhtml?articleID=211201247.
[24] S. Kals, E. Kirda, C. Kruegel, and N. Jovanovic. SecuBat: A    [30] D. Scott and R. Sharp. Abstracting Application-level Web
     Web Vulnerability Scanner. In World Wide Web Conference,            Security. 11th World Wide Web Conference, 2002.
     2006.                                                          [31] Z. Su and G. Wassermann. The Essence of Command Injec-
[25] N. J. E. Kirda and C. Kruegel. Preventing Cross Site Re-            tion Attacks in Web Applications. In Symposium on Princi-
     quest Forgery Attacks. In IEEE International Conference             ples of Programming Languages, 2006.
     on Security and Privacy in Communication Networks (Se-         [32] Tenable Network Security. Nessus Open Source Vulnerabil-
     cureComm), Baltimore, MD, 2006.                                     ity Scanner Project. http://www.nessus.org/, 2010.
[26] Nikto. Web Server Scanner. http://www.cirt.net/                [33] Web Application Attack and Audit Framework. http://
     code/nikto.shtml, 2010.                                             w3af.sourceforge.net/.
[27] OWASP AppSec Europe 2009. HTTP Parameter Pollution,            [34] Y. Xie and A. Aiken. Static Detection of Security Vulner-
     May 2009. http://www.owasp.org/images/b/                            abilities in Scripting Languages. In 15th USENIX Security
     ba/AppsecEU09 CarettoniDiPaola v0.8.pdf.                            Symposium, 2006.
[28] J. Ratcliff and D. Metzener. Pattern matching: The gestalt
     approach. Dr. Dobbs Journal, 7:46, 1988.
[29] D. Reading. CSRF Flaws Found on Major Websites: Prince-
     ton University researchers reveal four sites with cross-site
