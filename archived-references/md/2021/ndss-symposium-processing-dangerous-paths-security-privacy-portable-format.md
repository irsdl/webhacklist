---
type: Article
title: Processing Dangerous Paths – On Security and Privacy of the Portable Document Format
resource: "https://www.ndss-symposium.org/ndss-paper/processing-dangerous-paths-on-security-and-privacy-of-the-portable-document-format/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:41:55+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/processing-dangerous-paths-on-security-and-privacy-of-the-portable-document-format/"
    title: Processing Dangerous Paths – On Security and Privacy of the Portable Document Format
    author: Jens Müller, Dominik Noss, Christian Mainka, Vladislav Mladenov, Jörg Schwenk
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/ndss2021_1B-2_23109_paper.pdf"
authors:
  - Jens Müller
  - Dominik Noss
  - Christian Mainka
  - Vladislav Mladenov
  - Jörg Schwenk
canonical_url: ""
cited_by:
  - "2021.md:60"
commit: ""
content_sha256: 9f936e6d23326734a39e2c523f04b3fb7404c5a13a5c1269d23241b12c7c5536
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/processing-dangerous-paths-on-security-and-privacy-of-the-portable-document-format/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 7b0b1cf44cca444604025867e3e1e71be14fae9d9f9ff86cd781e9c0aa829c5a
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/ndss2021_1B-2_23109_paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:41:55+00:00"
slug: ndss-symposium-processing-dangerous-paths-security-privacy-portable-format
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Processing Dangerous Paths – On Security and Privacy of the Portable Document Format

**Processing Dangerous Paths – On Security and Privacy of the Portable Document Format** - Jens Müller, Dominik Noss, Christian Mainka, Vladislav Mladenov, Jörg Schwenk, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/processing-dangerous-paths-on-security-and-privacy-of-the-portable-document-format/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/ndss2021_1B-2_23109_paper.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/ndss2021_1B-2_23109_paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Processing Dangerous Paths
   – On Security and Privacy of the Portable Document Format

       Jens Müller               Dominik Noss              Christian Mainka         Vladislav Mladenov            Jörg Schwenk
  Ruhr University Bochum      Ruhr University Bochum     Ruhr University Bochum     Ruhr University Bochum     Ruhr University Bochum
   jens.a.mueller@rub.de       dominik.noss@rub.de       christian.mainka@rub.de   vladislav.mladenov@rub.de    joerg.schwenk@rub.de


    Abstract—PDF is the de-facto standard for document ex-             JavaScript [2], up to form fields [6]. A PDF document can be
change. It is common to open PDF files from potentially untrusted      updated or annotated without losing previous revisions [7] and
sources such as email attachments or downloaded from the               define specific actions [4], for example, to display a specific
Internet. In this work, we perform an in-depth analysis of the         page once the viewer opens the document. On top of this,
capabilities of malicious PDF documents. Instead of focusing on        PDF is enriched with different data formats which can be
implementation bugs, we abuse legitimate features of the PDF
standard itself by systematically identifying dangerous paths in
                                                                       embedded into documents, such as XML [8], or Flash [3]. Each
the PDF file structure. These dangerous paths lead to attacks          of the formats has its strengths, but allowing their inclusion
that we categorize into four generic classes: (1) Denial-of-           also enables their weaknesses and concerns. In this work, we
Service attacks affecting the host that processes the document.        analyze the security of native PDF functions.
(2) Information disclosure attacks leaking personal data out of the
victim’s computer. (3) Data manipulation on the victim’s system.       B. Security and Privacy Threats
(4) Code execution on the victim’s machine. An evaluation of 28
popular PDF processing applications shows that 26 of them are             We present a systematic and structured analysis of standard
vulnerable at least one attack. Finally, we propose a methodology      PDF features relevant for the security and privacy of users.
to protect against attacks based on PDF features systematically.       Even though PDF is a relatively old and well-established data
                                                                       format, our study reveals novel insights regarding the abuse of
                                                                       dangerous features, which are induced by opening a malicious
                       I.   I NTRODUCTION
                                                                       PDF document. We categorize our attacks into four classes:
    The Portable Document Format (PDF) is arguably the most
                                                                         1) Denial-of-Service (DoS) attacks affecting the processing
widely used data format for office document exchange. While
                                                                            application and the host on which the PDF file is opened.
the total number of PDF files is impossible to guess, Adobe
                                                                         2) Information disclosure attacks leak personal data from the
announced that 250 billion documents have been opened
                                                                            victim’s computer to the attacker, such as PDF document
by Adobe products in 2018 [59]. Being true or not, PDF
                                                                            form data, local files on disk, or NTLM user credentials.
documents are heavily used in business to business as well
                                                                         3) Data manipulation attacks modify PDF form values, write
as consumer use cases. Exchanging, creating, and archiving
                                                                            local files on the host system, or mask the displayed
invoices and contracts, submitting scientific papers, or collab-
                                                                            content of a document based on the opening application.
orating and reviewing texts, are only some scenarios which are
                                                                         4) Execution of code on the victim’s machine, by silently
hardly imaginable without PDF.
                                                                            launching an executable, embedded within the document.
    The advantage of using PDF over other document formats,
such as Microsoft Word, is its availability on all platforms,          C. Responsible Disclosure
including mobile and web. PDF processors are even used on                 We reported our attacks and findings to the affected vendors
the server-side. For example, uploaded PDF files are converted         and proposed appropriate countermeasures, resulting in CVE-
into images to preview them in forums, wikis, or cloud storage.        2020-28352, CVE-2020-28353, CVE-2020-28354, CVE-2020-28355,
Modern printers also directly support native PDF processing            CVE-2020-28356, CVE-2020-28357, CVE-2020-28358, CVE-2020-
without the requirement for printer drivers to convert input           28359, CVE-2020-28410, CVE-2020-28411, and CVE-2020-28412.
files to a special data format understood by the printer.              While it is possible to mitigate most of the attacks on the
                                                                       implementation-level, all of them are based on legitimate
A. Powerful Document Features                                          features defined in the PDF standard. To sustainably eliminate
                                                                       the root cause of these vulnerabilities in future implementation,
    Introduced in 1993 by Adobe, PDF was designed to provide
                                                                       the authors recommend to remove dangerous functionality
a consistent representation of documents, independent of the
                                                                       from the PDF specification or add proper implementation
platform. It supports numerous advanced features, ranging
                                                                       advice to its security considerations.
from cryptography to calculation logic [44], 3D animations [5],
                                                                       D. Contributions
Network and Distributed Systems Security (NDSS) Symposium 2021             Our contributions can be summarized as follows:
21-25 February 2021, Virtual
ISBN 1-891562-66-5                                                        • We present a systematic analysis on the security of native
https://dx.doi.org/10.14722/ndss.2021.23109                                 PDF features. Therefore, we distillate dangerous paths
www.ndss-symposium.org                                                      from the 1300-page PDF specification. (section V)
       • Based on this methodology, we craft our attack vectors,                      C. Actions & JavaScript
         resulting in an overall of 209 different attack variants that
         can be generalized into four attack classes. (section VI)                        The PDF specification defines multiple Actions for various
       • We evaluate 28 popular PDF viewers and show that 26 of                       purposes. These actions can be used, for example, to navigate
         them are vulnerable to at least one attack. (section VII)                    to a certain page in the document (GoTo action). Actions are
       • We present techniques for JavaScript-based fingerprinting                    often combined with form elements or Annotations (e.g., click-
         of PDF viewers and bypassing Digital Rights Management,                      able hyperlinks referencing a website are technically realized
         and discuss the consequences of hidden data added by                         by combining a Link annotation with a URI action). However,
         legitimate PDF editors to every document. (section VIII)                     actions can also be set to trigger automatically based on various
       • We discuss countermeasures for PDF implementations as                        events such as opening, printing, or closing the document.
         well as the specification, and propose a methodology to                          A special action in PDF is the execution of JavaScript code.
         systematically protect against attack variants. (section IX)                 Adobe defined a basic set of functions [2], but PDF applica-
       • We release our comprehensive suite of malicious PDF files                    tions often choose to implement a subset of Adobe’s standard
         which can be used by developers to test their software.1                     as well as to extend their feature set with proprietary functions
                                                                                      (see section VIII). JavaScript provides a huge flexibility for
                               II.   PDF BASICS                                       documents, for example, complex input validation of forms or
                                                                                      changing their values depending on specific conditions.
        This section briefly introduces the PDF document structure.
    For reasons of clarity, we only describe the building blocks                      1 0 obj                                                                       1
                                                                                      << /Type /Catalog          % the first processed PDF object                   2
    relevant for understanding the attacks of this paper.                                /OpenAction <<      % action executed after opening file                   3
                                                                                         /Type /Action                 % definition of the action                   4
                                                                                         /S /JavaScript             % this is a Javascript action                   5
    A. Basic Blocks                                                                      /JS (JavaScript code) >>               % JavaScript code                   6
                                                                                      >>                                                                            7
        A PDF document consists of four basic sections:                               endobj                                                                        8


      1) A header defining the PDF document version (1.1 to 2.0).                     Listing 2.   PDF document executing JavaScript after opening (excerpt).
      2) A body containing the content, a bundle of PDF objects.
      3) An index table with references to each object in the body.                   In Listing 2, an example of a PDF action containing JavaScript
      4) A trailer defining the root element of the document and                      is shown. The document Catalog, which is the first processed
         a reference to the index table.                                              object in a PDF document, contains the entry OpenAction. The
                                                                                      OpenAction event defines an action which is executed directly
       The most important section is the body which contains the                      after the document is being opened. In the given example, the
    PDF objects – the actual content of the document. An object                       JavaScript code defined in Line 6 will be executed.
    can, for example, define a headline, a text block, or an image.
1   10 0 obj
2   << /Length 10 >>                                  % stream length
                                                                                      D. PDF File Handles
3   stream                                      % start of the stream
4    Content                % content (e.g., text, image, font, file)                     A file handle (or PDF File Specification) is a multi-purpose
5   endstream                                     % end of the stream                 object that can be either an embedded file (i.e., a data stream
6   endobj
                                                                                      within the document), a local file on disk, a remote URL, or
    Listing 1.   PDF object 10, including a 10-byte content stream.                   a network share, depending on given parameters and context.
                                                                                      File handles define the targets of many PDF actions such as
        Every object is enclosed by the delimiters obj and                            where to submit form data to (via SubmitForm action) or which
    endobj and has has an identifier. In Listing 1, the object’s                      hyperlinks to follow in a document (via URI or GoToR action).
    identifier is 10 with generation number 0. Content can be
    provided as a string, or – as shown in Listing 1 – as a                                                   III.   R ELATED W ORK
    stream enclosed by stream and endstream. It can be pref-
    aced with additional information, such as encoding or length.                         PDF documents have been considered as relatively secure
    Streams can optionally be compressed. Many documents use                          against malware and other security threats until 2001 [56],
    FlatDecode for this purpose, meaning that the zlib Deflate                        when the Peachy virus misused PDF features to run malicious
    algorithm is used.                                                                VBScript [57]. In the following years, PDF malware grew to
                                                                                      an importance, mostly based on implementation bugs in viewer
                                                                                      applications [58, 52]. During this period, PDF malware focused
    B. PDF Forms
                                                                                      mainly on abusing JavaScript. To estimate the importance of
        With PDF version 1.2, Adobe introduced AcroForms in                           JavaScript-based vulnerabilities in PDF documents we filtered
    1996. Similarly to HTML forms, AcroForms allow to define                          the CVE database for entries relating to 28 PDF processing
    input fields, checkboxes, and buttons. The user-input can                         applications. Since 2003, there are 1325 relevant CVE IDs, of
    either be stored directly into the document (using incremental                    which 73 lead to code execution – the rest being DoS, data
    updates) or be submitted to a dedicated server. In the latter                     leakage, or other vulnerabilities. Of all PDF-related CVE IDs,
    case, AcroForms use the Forms Data Format (FDF), which is                         138 entries are due to JavaScript.2 Laskov et al. [34] outline
    based on raw PDF objects, for transmitting the data.                              two classes of JavaScript PDF exploits: either the JavaScript
      1 Our test suite of PDF documents can be found at https://pdf-insecurity.         2 The total number of JavaScript related issues may be higher because
    org/download/pdf-dangerous-paths/exploits-and-helper-scripts.zip.                 JavaScript engine bugs usually do not get separate CVE IDs for integrators.


                                                                                  2
API is targeted directly or the API is abused to target other            to the PDF specification, although the attacker targets basic
software components.                                                     functionality and features of the PDF standard. The attacker
                                                                         has full control over the document structure and its content.
    In 2008, Filiol et al. analyzed for the first time malicious
                                                                         While the attacker can easily craft a malicious document
PDF features beyond JavaScript. Their work was extended in
                                                                         which looks benign once opened and interpreted by the PDF
the following years by multiple researches which found new
                                                                         application (i.e., similar to a document that the victim would
methods to carry out DoS, URI invocation, code execution,
                                                                         expect), this is not assumed to be necessary, because all attacks
and information leakage using PDF files [48, 16, 49, 63, 51,
                                                                         are automatically triggered once the file is opened. The only
31, 32]. Even though, the security impact of specific attack
                                                                         interaction of the victim is to open the malicious document on
variants based on insecure PDF features was understood and
                                                                         their computer.
fixed in many implementations, new variants were reported in
2018 [24, 30, 50]. In contrast to our work, previous research on
insecure features of PDF documents focused on single features,           C. Winning Condition
and mainly on single applications such as Acrobat Reader and                 An attack is classified as successful if its winning condition
Foxit Reader, and was not driven by a systematic approach.               is fulfilled. The winning condition – the goal of the attacker
    To prevent harm, different security tools were proposed, in          – is dependent on the attack class and documented in the cor-
order to identify maliciously crafted documents [34, 37, 53, 18,         responding section. For example, in the DoS attack class, the
38, 55, 15]. Such tools rely on the detection of known attack            winning condition is reached if the PDF processing application
patterns and on a structural analysis of PDF files. In 2017,             can be forced to consume all available resources (i.e., memory
Tong et al. introduced a concept for PDF malware detection               or CPU time). In the information disclosure class of attacks, the
based on machine learning and its implementation [62, 61].               winning condition is fulfilled if the attacker manages to obtain
Maiorca et al. provided an overview of current PDF malware               sensitive data, such as local files from the victim’s disk.
techniques and compared existing security tools [36]. In our
research, we focus on the security of the PDF viewers and                                        V.    M ETHODOLOGY
not on additional protection tools. Thus, we do not evaluate
                                                                             To identify attack vectors, we systematically surveyed which
whether third party tools are able to detect our attacks.
                                                                         potentially dangerous features exist in the PDF specification.
    While studying the related work on PDF security, we                  We started by creating a comprehensive survey with all PDF
determined two gaps which we address in this paper. First,               Actions that can be called. As a base, we used the list provided
there is no systematic approach on how to find attacks based             in the PDF specification, see [60, section 8.5.3]. This list
on insecure PDF features since all relevant work, which is               contains 18 different actions which we carefully studied. We
widespread in multiple scientific papers, technical reports, and         selected eight actions (see Call Action in Figure 1) – the ones
blogposts, focuses on single features or attack variants. Second,        that directly or indirectly allow access to a file handle (see
there is no comprehensive evaluation of a large set of popular           File in Figure 1) and may therefore be abused for dangerous
PDF viewers, beyond Acrobat Reader and Foxit Reader.                     features such URL invocation or writing to files.
                                                                             Having a list of security sensitive actions, we proceeded by
                   IV.   ATTACKER M ODEL                                 investigating all objects and related events which can trigger
    In this section, we describe the attacker model, including           these actions. This process was the most time-consuming part
the attacker’s capabilities and the winning condition.                   of our investigation since the entire specification was analyzed.
                                                                             We identified four PDF objects which allow to call arbitrary
A. Actions of the Victim                                                 actions (Page, Annotation, Field, and Catalog), as shown in
    The victim is an individual who retrieves and opens a mali-          the upper part of Figure 1. For calling them, most objects
cious PDF document from an attacker controlled source. This              offer multiple alternatives. The Catalog object, for example,
is a realistic attack scenario, because even sophisticated users         defines the OpenAction or additional actions (AA) as events.
download and open PDF files from untrusted sources such                  Each event can launch any sequence of PDF actions, which are
as email attachments or the Internet. For example, invoices              depicted in the middle part in Figure 1 (Launch, Thread, etc.).
or academic papers are usually shared as PDF documents.                  In addition, JavaScript actions can be embedded within doc-
PDF is often considered as relatively “safe” by end-users [14],          uments, opening a new area for attacks. By using JavaScript,
compared to other file formats such as Word documents, which             for example, new annotations can be created, which can have
are well-known to contain potentially dangerous macros [25].             actions that once again lead to accessing file handles.
    To open the PDF document, the victim uses a pre-installed                If a path from an event over an action to file handle3
application which processes the file in order to display its             exists and is not explicitly blocked by the application opening
content. Different applications may process the file, or interpret       the document, we denote it as a “dangerous path”, resulting,
features of the PDF standard, differently, thereby enabling or           for example, in file system access or URL invocation. Our
disabling the various attack vectors described in this paper.            approach is comprehensive in the sense that all attacks based
                                                                         on such dangerous paths are covered, because all existing paths
B. Attacker’s Capabilities                                               in the PDF specification down to a file handle are mapped.
                                                                         Another kind of dangerous path arises, when the specification
    The attacker can create a new PDF file or modify an                  enables objects to create reference circles, resulting in infinite
existing document which we denote as the malicious document.
We do not require the malicious document to be compliant                   3 File handles can be embedded files, local files, URLs, or network shares.




                                                                     3
        Page                                 Annotation                                        Field                                  Catalog

        /AA                                     /A                                             /AA                                    /Names

        /Contents                               /AA                                                                                   /AA

                                                /Link                                                                                 /OpenAction

                                                                               Call Action



       Launch              Thread               GotoE               GotoR                    ImportData        SubmitForm              URI                  JavaScript

        /Print                                                                                                                        /Base

        /Open                                                                                                                         /URI



                                                                                  File



                                            Embedded File         Local File                   URL           Network Share


Fig. 1. Dangerous paths identified by studying the PDF specification (simplified). There are different special PDF objects (Catalog, Page, ...) defined that
allow to call various actions (Launch, Thread, ...) which can read from or write to a PDF File Specification.


loops. Further discovered attacks – deflate bombs and content                                 • Novel attack variants:6 infinite loop, deflate bomb, URL
masking – are based on flaws on the document structure level,                                   invocation, credential theft, content masking.
which we observed during our study of the specification.                                      • Previously unknown attacks: form data leakage, local file
                                                                                                leakage, form modification, file write access
    Finally, we systematized our results, created a list of all
possible attacks, and classified them accordingly. To generate                              Previous work relevant to a specific attack is provided in
our test suite of malicious PDF documents, we chose a semi-                              each corresponding attack section.
automated approach: we hand-crafted the payloads to test for a
particular weakness and wrote a set of helper tools in Python,                           A. Denial-of-Service
to generate a broad set of attack variants as well as a valid
PDF structure for each test case. To improve the impact of the                               The goal of this class of attacks is to build a specially
attacks, we also build exploits by chaining multiple actions.                            crafted PDF document which enforces processing applications
For example, an attacker can craft a document that first reads                           to consume all available resources (i.e., computing time or
data from a local file using the Import action and then sends the                        memory) or causes them to crash7 . Note that while the impact
content to the attacker’s server using the SubmitForm action.                            of DoS is limited for end-users, it can lead to severe business
                                                                                         impairment if the document is processed on a server, for
    Our efforts resulted in 209 unique PDF files4 , which we                             example, by a library that generates preview thumbnails of
manually opened in 28 PDF applications to observe the result.                            PDF files uploaded to cloud storage.
This process can be automated by launching each test for each
PDF viewer in a batch script and logging the program’s behavior,                             1) Infinite Loop: Inducing an endless loop causes the
depending on the attack class (e.g., CPU or memory exhaustion                            program execution to get stuck. The PDF standard allows
for DoS, file exists checks for file write access attacks, etc.).                        various elements of the document structure to reference to
                                                                                         themselves, or to other elements of the same type. This can
                             VI.     ATTACKS                                             lead to cycles, if not explicitly handled by the implementation.
                                                                                         For example, a Pages object may reference to other pages,
    Out this section, we introduce the attacks that we elab-                             which is a known problem of the specification, discovered in
orated during our security analysis. The “dangerous path” is                             CVE-2007-0104. We systematically studied the PDF standard
given at the end of each attach description.                                             for further constructs that allow for reference cycles, recursion,
        Clarification of Novelty: Of course, this work is not the                        or other kinds of loops, and found the following novel variants:
first research on PDF security (see section III). However, we
are the first covering the entire specification for attacks based                             • Action loop. PDF actions allow to specify a Next action
on the dangerous path. While variants of some attacks have                                      to be performed, thereby resulting in “action cycles”.
been presented before, our work goes far beyond systematizing                                 • ObjStm loop. Object streams may extend other object
existing results. It provides many new insights as well as novel                                streams allows the crafting of a document with cycles.
attacks. The novelty level for each attack is given below.                                    • Outline loop. PDF documents may contain an outline. Its
                                                                                                entries, however, can refer to themselves or each other.
   • Well known attacks: code execution via Launch action5                                 6 Only a small number of variants was known because previous research did
  4 Note that we combined multiple triggering events into single PDF files,              not systematically investigate the PDF specification or test all possible paths.
thereby testing various paths in parallel and reducing the overall number of               7 Crashes are classified as a winning condition, because they affect the user
required test documents.                                                                 experience, especially if further, legitimate documents are already opened by
   5 Note that even though the danger of the PDF Launch action is well known             the same PDF application (in multiple tabs/windows) and if there are unsaved
in the sense that it has been publicly documented, security gaps still exist in          changes, resulting in data loss. Furthermore, crashes have lead to code overflow
multiple implementations, as confirmed by our evaluation (see section VII).              vulnerabilities in the past, which have been classified as critical by Adobe [19].


                                                                                    4
   • Calculations. PDF defines “Type 4” calculator functions,                      can certainly contain sensitive information (e.g., financial or
     for example, to transform colors. Processing hard-to-solve                    medical records). Therefore, the question arises if an attacker
     mathematical formulas may lead to high demands of CPU.                        can access and leak such information. The idea of this attack
   • JavaScript. Finally, in case the PDF application processes                    is as follows: the victim downloads a form – a PDF document
     scripts within documents, infinite loops can be induced.                      which contains form fields – from an attacker controlled source
                                                                                   and fills it out on screen, for example, in order to print it. Note
      Dangerous paths (examples)                                                   that there are legitimate cases where a form is obtained from
   Action ⇒ /Next ⇒ Action                                                         a third party, while the user input should not be revealed to
   ObjStm ⇒ /Extends ⇒ ObjStm                                                      this party. For example, European SEPA remittance slips can
                                                                                   be downloaded from all over the web9 – even though they
     2) Deflate Bomb: Data amplification attacks based on                          have to be manually signed to be accepted by a local bank.
malicious zip archives are well-known (see [12, 22, 45]). The                      The form is manipulated by the attacker in such a way that
first publicly documented DoS attack using a “zip bomb” was                        it silently, without the user noticing, sends input data to the
conducted in 1996 against a Fidonet BBS administrator [1].                         attacker’s server. To the best of our knowledge, we are the first
However, not only zip files but also stream objects within PDF                     to demonstrate such attacks, which can be carried out using
documents can be compressed using various algorithms such as                       the PDF SubmitForm action, or by reading and exfiltrating the
Deflate [20] to reduce the overall file size. The question arises                  form values using standard JavaScript functions.
if compression bombs based on malicious PDF documents can                                Dangerous path
be built, in order to cause processing applications to allocate all
                                                                                      Page ⇒ (on close) ⇒ SubmitForm ⇒ URL
available memory. We intend to achieve this goal by a chaining
a compressed stream to one or multiple FlateDecode filters.
                                                                                      3) Local File Leakage: The PDF standard defines various
       Dangerous path                                                              methods to embed external files into a document or otherwise
   Filter ⇒ /FlateDecode ⇒ [...] ⇒ /FlateDecode                                    access files on the host’s file system, as documented below.
                                                                                      • External streams. Documents can contain stream objects
B. Information Disclosure                                                               (e.g., images) to be included from external files on disk.
                                                                                      • Reference XObjects. This features allows a document to
    The goal of this class of attacks is to track the usage of a
                                                                                        import content from another (external) PDF document.
document by silently invoking a connection to the attacker’s
                                                                                      • Open Prepress Interface. Before printing a document,
server once the file is opened, or to leak PDF document form
                                                                                        local files can be defined as low-resolution placeholders.
data, local files, or NTLM credentials to the attacker.
                                                                                      • Forms Data Format (FDF). Interactive form data can be
    1) URL Invocation: Tracking pixels in HTML emails are                               stored in, and auto-imported from, external FDF files.
well documented,8 but the existence of similar technologies for                       • JavaScript functions. The Adobe JavaScript reference
PDF files is largely unknown to the general public. However,                            enables documents to read data from or import local files.
PDF documents that silently “phone home” should be con-
sidered as privacy-invasive. They can be used, for example, to                         If a malicious document managed to firstly read files
deanonymize reviewers, journalists, or activists behind a shared                   from the victim’s disk and secondly, send them back to the
mailbox. The goal of this attack is to open a backchannel                          attacker,10 such behavior would arguably be critical. However,
to an attacker controlled server once the PDF file is opened                       standard PDF functions can be chained together to achieve
by the victim. Besides learning when the file was opened                           exactly this. For example, form values can be references to
and by whom (i.e., by which IP address), the attacker may                          stream objects and every stream, on its part, can reference to
learn additional (limited) information such as the victim’s PDF                    an external file. Moreover, forms can be crafted to auto-submit
viewer application and operating system, derived from the                          themselves using various events as documented in Figure 1 in
User-Agent HTTP header. The possibility of malicious URI                           section IX. Furthermore, standard JavaScript functions can be
resolving in PDF documents has been introduced by Hamon                            used to access local files and leak their content. We give a
[27] who gave an evaluation for URI and SubmitForm actions                         systematic overview on this new chaining technique in terms
in Acrobat Reader. We extend their analysis to all standard                        of a directed graph containing all chains detected during our
PDF features that allow to open a URL, such as ImportData,                         evaluation, and are the first to demonstrate these attacks.
Launch, GoToR, JavaScript, and to a to a broad set of viewers.                            Dangerous path
                                                                                      [All events] ⇒ ImportData ⇒ local file
      Dangerous path                                                                     ⇒ /Next ⇒ SubmitForm ⇒ URL
   [All events] ⇒ [All actions] ⇒ URL
                                                                                      4) Credential Theft: In 1997, Aaron Spangler posted a
   2) Form Data Leakage: Documents can contain forms                               vulnerability in Windows NT on the Bugtraq mailing list [54]:
to be filled out by the user – a feature introduced with                           any client program can trigger a connection to a rogue
PDF version 1.2 in 1996 and used on a daily basis for                                9 E.g., https://www.ibancalculator.com/fileadmin/EU-Ueberweisung.pdf.
routine offices tasks, such as travel authorization or vacation                       10 Note that exfiltration does not necessarily have to occur via the network:
requests. Depending on the nature of the form, user input                          For example, if a cloud storage service generates thumbnail images from
                                                                                   uploaded PDF documents, the backchannel can be the rendered image itself.
  8 A recent study of Poddebniak et al. [47] revealed backchannels in 40 out       If a reviewer adds comments to a malicious PDF document, local files may
of 48 tested email clients.                                                        unintentionally be included when saving, exporting or printing the document.


                                                                               5
SMB server. If the server requests authentication, Windows                          defined using a PDF File Specification. This ambiguity in the
will automatically try to log in with a hash of the user’s                          standard may be interpreted by implementations in such a way
credentials. Such captured NTLM hashes allow for efficient                          that they enable documents to submit PDF form data to a
offline cracking11 and can be re-used by applying pass-the-                         local file, thereby writing to this file. Furthermore, there are
hash or relay attacks [29, 43] to authenticate under the user’s                     various JavaScript functions which allow to write to local files
identity. This design flaw in the Windows operating system                          on disk. If successful, this feature can be used to overwrite
is not solved until today.12 Back in 1997, Spangler used a                          arbitrary files on the victim’s file system and thereby purge
remote image to trick web browsers into making a connection                         their content. Furthermore, write access to local files may even
to and thereby authenticate to the attacker’s host. In April                        be escalated to code execution if the attacker has write access
2018, Check Point Research [50] showed that a similar attacks                       to certain startup scripts (e.g., autoexec.bat on Windows,
can be performed with malicious PDF files. They found                               .bashrc on macOS and Linux). JavaScript based attacks to
that the target of GoToR and GoToE actions can be set                               write to local files have previously been shown, for example,
to \\\\attacker.com\\dummyfile,13 thereby leaking                                   in CVE-2018-14280 and CVE-2018-14281 for Foxit Reader.
credentials in the form of NTLM hashes. The issue was fixed                         We evaluate write access for a broad range of standard PDF
quickly by Adobe and Foxit. We describe novel variants of                           and JavaScript functions. To the best of our knowledge, we
this attack, for example, by using various other techniques to                      are the first to propose the attack variant based on PDF forms
access a network share such as by including it as external                          that automatically submit data to a local file.
content stream or by testing different PDF actions, thereby
bypassing existing protection mechanisms.                                                 Dangerous path
      Dangerous path                                                                   [All events] ⇒ SubmitForm ⇒ local file
   [All events] ⇒ [All actions] ⇒ network share
                                                                                        3) Content Masking: The goal of this attack is to craft a
                                                                                    document that renders differently, depending on the applied
C. Data Manipulation                                                                PDF interpreter. This can be used, for example, to show
   This attack class deals with the capabilities of malicious                       different content to different reviewers, to trick content filters
documents to silently modify form data, to write to local files                     (AI-based machines as well as human content moderators),
on the host’s file system, or to show a different content based                     plagiarism detection software, or search engines, which index
on the application that is used to open the document.                               a different text than the one shown to users when opening the
                                                                                    document. Content masking attacks using polyglot files have
    1) Form Modification: The idea of this attack is as follows:                    been shown in the past by [35, 10]; for example, PDF files that
similar to “form data leakage” as described above, the victim                       are also a valid JPEG images, if opened by image processing
obtains a harmlessly looking PDF document from an attacker                          software. Recently, [39] presented “PDF mirage”, which ap-
controlled source, for example, a remittance slip or a tax                          plies font encoding to present a different displayed content to
form. The goal of the attacker is to dynamically, and without                       humans than to text exfiltration software. We propose a new
knowledge of the victim, manipulate form field data. This can                       approach which targets edge cases in the PDF specification,
be achieved by crafting the malicious document in such a                            leading to different parts of the document actually being
way that it “modifies itself”, and changes certain form fields                      processed by different implementations. To achieve this, we
immediately before it is printed or saved. Interesting form                         systematically studied the PDF standard for ambiguities at the
fields to manipulate could be, for example, the recipient of                        syntax and structural level, as documented below.
a wire transfer or the declarations regarding taxable income.
Technically, form field values can be set using an ImportData
action which imports form data from an external source or an                          • Stream confusion. It is unclear how content streams are
embedded file, or with JavaScript included in the document.                             parsed if their Length value does not match the offset of
This novel attack technique can be used by an attacker to either                        the endstream marker, or if syntax errors are introduced.
get the victim into trouble (e.g., tax fraud suspicion) or to gain                    • Object confusion. An object can overlay another object.
financial advantages (e.g., by adding herself as recipient of a                         The second object may not be processed if it has a
tax refund).                                                                            duplicate object number, if it is not listed in the XRef
                                                                                        table, or if other structural syntax errors are introduced.
      Dangerous path                                                                  • Document confusion. A PDF file can contain yet another
   Catalog ⇒ (on print) ⇒ ImportData ⇒ embedded file                                    document (e.g., as embedded file), multiple XRef tables,
                                                                                        etc., which results in ambiguities on the structural level.
                                                                                      • PDF confusion. Objects before the PDF header or after
    2) File Write Access: As previously described, the PDF
                                                                                        an EOF marker may be processed by implementations,
standard enables documents to submit form data to external
                                                                                        introducing ambiguities in the outer document structure.
webservers. However, technically the webserver’s URL is
  11 For NTLMv2, it is estimated that cracking eight character passwords of
                                                                                        There are numerous variants of the four test classes men-
any complexity takes around 2,5 hrs on a modern GPU [17]. Previous versions         tioned above, resulting in a total of 94 different edge cases.
(NTLMv1, LM) are trivial to crack and can be considered as broken [40].
  12 Microsoft introduced the possibility to define “NTLM blocking” in the
Windows security policy, but is has to be actively enabled by administrators.            Dangerous path
Furthermore, some ISPs block port 445, however this cannot be relied on.               None (document structure level flaws)
  13 Note that the \ character must be escaped in PDF strings, leading to \\.




                                                                                6
     D. Code Execution: Launch Action                                                     to native PDF viewers, we evaluated the most popular web
                                                                                          browsers because modern browsers have the ability to directly
        The goal of this attack is to execute attacker controlled code.
                                                                                          render PDF files (e.g., from a website). If a “viewer” and
     This can be achieved by silently launching an executable file,
                                                                                          an “editor” version was available we tested both. All appli-
     embedded within the document, to infect the host with malware.14
                                                                                          cations were tested in the default settings, neither relaxing nor
         The PDF specification defines the Launch action, which                           hardening their security policies. We only classified attacks as
     allows documents to launch arbitrary applications. The file                          successful, if they did not require any kind of user interac-
     to be launched can either be specified by a local path, a                            tion besides opening the malicious document. For example,
     network share, a URL, or a file embedded within the PDF                              PDF applications which present a confirmation dialog before
     document itself. The standard does not provide any security                          performing a certain attack were labeled as not vulnerable.
     considerations regarding this obviously dangerous feature; it                        Evaluation results are depicted in Table I.
     even specifies how to pass command line parameters to the
     launched application. Therefore, it can be said that PDF                             Obviously, the criticalness of each attack differs. For example,
     offers “command execution by design” – if the standard is                            the impact of code execution based on a malicious document
     implemented in a straightforward manner. An example of a                             is much higher than DoS. As one can see, PDF applications
     malicious document which contains an embedded executable                             for macOS and Linux, which implement only a subset of
     file (evil.exe) that is launched once the document is opened                         PDF standard features, can be considered as relatively secure.
     (OpenAction) is depicted in Listing 3.                                               This also holds for web browsers, which apply additional
                                                                                          sandboxing mechanisms (e.g., to prevent file system access).
 1   1 0 obj
 2   << /Type /Catalog /Names <<
 3      /EmbeddedFiles << /Names [(evil.exe) 2 0 R] >> >>                                 B. Denial-of-Service
 4      /OpenAction << /S /Launch /F (evil.exe) >>
 5   >>
 6   endobj                                                                                   In the following section, we discuss the results for DoS
 7                                                                                        attacks. Due to the large number of test cases, a fully detailed
 8   2 0 obj                                                                              evaluation is given in Table VI in the appendix. We classify
 9   << /Type /EmbeddedFile /Length 1337 >>
10   stream                                                                               an application as vulnerable if it either hangs (e.g., consuming
11   [executable code]                                                                    unusually large amounts of CPU or memory) or if the program
12   endstream
                                                                                          crashes. A controlled program termination (i.e., raising an
     Listing 3.   PDF document to launch an embedded executable.                          exception before closing) is not considered as a vulnerability.
                                                                                              1) Infinite Loop: Each of the tested applications running
         The danger of Launch actions is well-known and has first
                                                                                          natively on Windows, macOS, or Linux, except PDF Studio
     been discussed in 2008 by Blonce et al. [13] for Acrobat
                                                                                          Viewer/Pro and Evince, was vulnerable to at least one attack
     Reader. Modern PDF viewers should warn the user before
                                                                                          variant and could be tricked into an endless loop. It is notewor-
     executing potentially malicious files – or stop supporting this
                                                                                          thy that CVE-2007-0104 still works in six applications until
     insecure feature at all. We extend the analysis of Blonce et
                                                                                          today. Our novel attack variants, such as GoTo loops (9 vulner-
     al. to a broad set of 28 modern PDF implementations and to
                                                                                          able), Action loops (9 vulnerable), Outline loops (9 vulnerable)
     all potentially dangerous paths and thereby show that attack
                                                                                          and JavaScript (13 vulnerable) cause endless loops in various
     variants leading to code execution are possible until today.
                                                                                          PDF interpreters. The impact is either a crash of the program,
           Dangerous path                                                                 or the application becoming completely unresponsive, often
        [All events] ⇒ Launch ⇒ embedded/local file or URL                                combined with a high consumption of CPU time. Browser
                                                                                          based PDF viewers instead perform much better. We observed
                                                                                          that for Chrome, Firefox, and Opera only the current tab gets
                               VII.    E VALUATION                                        stuck in an endless loop and becomes unresponsive, which
                                                                                          is why we classified the vulnerability as “limited” here. We
     A. Denial-of-Service
                                                                                          assume this is because modern browsers sandbox each tab and
         In the following section, we discuss the results for DoS                         enforce resource limits, thereby restricting the impact of, for
     attacks. Due to the large number of test cases, a fully detailed                     example, a malicious or runaway website.
     evaluation is given in Table VI in the appendix. We classify
     an application as vulnerable if it either hangs (e.g., consuming                          2) Deflate Bomb: To evaluate the impact of compression
     unusually large amounts of CPU or memory) or if the program                          bombs, we crafted a valid PDF file containing a long string
     crashes. A controlled program termination (i.e., raising an                          of 10 GB of repeated characters, “AAA...”, within a Deflate
     exception before closing) is not considered as a vulnerability.                      compressed content stream. To display this string to the user,
                                                                                          a PDF processing application must first decompress it. The
         To evaluate the attacks introduced in section VI, we tested                      maximum compression ratio that can be achieved with the
     them on 28 popular PDF processing applications that were                             Deflate algorithm is 1023:1. However, the PDF file size can be
     assembled from public software directories for the major                             drastically reduced by applying multiple Deflate filters to the
     platforms (Windows, Linux, macOS, and Web).15 In addition                            same stream, resulting in an amplification factor of 18 470 265
        14 Note that there are other methods to gain code execution (e.g., based on
                                                                                          (i.e., 578 bytes on disk are decompressed to 10 GB in memory).
                                                                                          The attack resulted in memory exhaustion in 20 applications,
     memory corruption); however, they are out of scope in this paper. Our focus
     is on abusing of legitimate features, not bugs in PDF viewer implementations.        of which three applications crashed after a short period of time.
        15 Note that some PDF applications are available for multiple platforms. In       In various cases, the operating system slowed down noticeably
     such cases we limited our tests to the platform with the highest market share.       or became completely unresponsive. In contrast to attacks

                                                                                      7
                      Attack Category                                                 DoS                                        Information Disclosure                                           Data Manipulation                                         RCE




                                                                                                                                      Form data leakage




                                                                                                                                                                                                  Form modification
                                                                                                                                                          Local file leakage




                                                                                                                                                                                                                                          Content masking
                                                                                                                                                                                                                      File write access
                                                                                                                URL invocation




                                                                                                                                                                               Credential theft




                                                                                                                                                                                                                                                             Code execution
                                                                                            Deflate bomb
                                                                      Infinite loop
   Application                    Version
   Acrobat Reader                 (2019.012.20035)                                                                                    #                   #                    #                                      #                   #                 #
   Foxit Reader                   (9.7.1)                                                                       #                     #                   #                                       #                   #                   #                 #
   PDF-XChange Viewer             (2.5.322.9)                                                                                                                                                                         #                                     #
   Perfect PDF Reader             (8.0.3.5)                                                                                                               #                                                           #                   #                 #
   PDF Studio Viewer              (2018.4.3)                          #                                                                                   G
                                                                                                                                                          #                    #                  #                   #                   #
   Nitro Reader                   (5.5.9.2)                                                                                                               #                                       #                   #
   Acrobat Pro                    (2019.012.20035)                                                                                    #                   #                    #                                      #                   #                 #


                                                          Windows
   Foxit PhantomPDF               (9.7.1)                                                                       #                     #                   #                                       #                   #                   #                 #
   PDF-XChange Editor             7.0.326.1                                                                                                                                                                                               #                 #
   Perfect PDF Premium            (10.0.0.1)                                                                                                              #                                                           #                   #                 #
   PDF Studio Pro                 (2018.4.3)                          #                                                                                   G
                                                                                                                                                          #                    #                  #                   #                   #
   Nitro Pro                      (13.24.1.467)                                             #                                                             #                                       #                   #
   Nuance Power PDF               (3.0.0.17)                                                                                          #                                                           #                   #
   iSkysoft PDF Editor            (6.5.0.3929)                                              #                   #                     #                   #                    #                  #                   #                   #                 #
   Master PDF Editor              (5.1.36)                                                  #                                                             G
                                                                                                                                                          #                                       #                                       #                 #
   Soda PDF Desktop               (11.0.16.2797)                                                                                      #                   #                                       #                   #
   PDF Architect                  (7.0.30.3196)                                                                                       #                   #                                       #                   #                                     #
   PDFelement                     (6.8.0.3523)                                              #                   #                     #                   #                    #                  #                   #                   #                 G
                                                                                                                                                                                                                                                            #
                                                                                                                #                     #                   #                    #                  #                   #                   #                 #
                                                          Mac




   Preview                        (10.0.944.4)
   Skim                           (1.4.41)                                                                      #                     #                   #                    #                  #                   #                   #                 #
   Evince                         (3.34.1)                            #                                         #                     #                   #                    #                  #                   #                   #                 G
                                                                                                                                                                                                                                                            #
                                                          Linux




   Okular                         (1.3.2)                                                                       #                     #                   #                    #                  #                   #                   #                 G
                                                                                                                                                                                                                                                            #
   MuPDF                          (1.16.0)                                                  #                   #                     #                   #                    #                  #                   #                   #                 G
                                                                                                                                                                                                                                                            #
   Chrome                         (70.0.3538.77)                      G
                                                                      #                                                                                   #                    #                  #                   #                   #                 #
   Firefox                        (72.0.2)                            G
                                                                      #                                                               #                   #                    #                  #                   #                   #                 #
                                                          Web




   Safari                         (13.1.2)                            #                     #                   #                     #                   #                    #                  #                   #                   #                 #
   Opera                          (57.0.3098.106)                     G
                                                                      #                     #
                                                                                            G                                                             #                    #                  #                   #                   #                 #
   Edge                           (44.18362.1.0)                      #                     #                   #                     #                   #                    #                  #                   #                   #                 #
                                             Application vulnerable                    G
                                                                                       # Vulnerability limited                                               # Not vulnerable

             TABLE I.        E VALUATION RESULTS : O UT OF 28 TESTED PDF APPLICATIONS , 26 ARE VULNERABLE TO AT LEAST ONE ATTACK .



based on infinite loops, even browsers such as Chrome and                                                      and file-hosting solutions such as Seafile17 in order to generate
Firefox were fully affected, while in Opera only the current tab                                               preview images of uploaded PDF documents.
became unresponsive. The remaining seven PDF applications
did refuse to decompress the whole stream, but instead aborted                                                 C. Information Disclosure
decompression after a reasonable amount of time – probably
after a watchdog limit was reached.                                                                                1) URL Invocation: To evaluate if malicious documents
                                                                                                               can enforce PDF applications to trigger a connection to an
    It is noteworthy that we did not even have to actually                                                     attacker controlled server, we combined various PDF features
open the malicious document on Windows and Linux in order                                                      with techniques to automatically call them once the document
to cause DoS to the operating system. Both Windows File                                                        was opened. The results for auto-triggered PDF actions re-
Explorer and Gnome Nautilus file manager try to preview the                                                    sulting in URL invocation are as follows: URI action (9 vul-
document if the containing directory is opened, and thereby                                                    nerable), GoToR (1 vulnerable), Launch (6 vulnerable), and
process its content resulting in resource exhaustion. MacOS                                                    SubmitForm (11 vulnerable). For seven applications, we could
(Finder) was not vulnerable, because it stopped thumbnail                                                      use standard JavaScript functions to invoke a connection. In
generation, probably after a resource limit was hit.                                                           one viewer, we could set a URL as the external content stream
                                                                                                               of an image, which was loaded from the attacker’s server.
    Although DoS attacks against web servers were not tested                                                   In two viewers, we were able to inject a subset of XHTML,
for ethical reasons, applications processing PDF files on the                                                  leading to XHTML tags being being processed which triggered
server-side are likely to be affected too. For example, Evince                                                 a remote connection. Altogether, 17 PDF applications could
and Okular, which are both vulnerable, are based on Poppler,16                                                 be tricked into (silently) invoking a connection to our server,
a popular PDF library used by various cloud storage providers                                                  once a malicious document was opened by the user. It can be
  16 See https://poppler.freedesktop.org/.                                                                         17 See https://www.seafile.com/.




                                                                                                           8
concluded that it is relatively easy to craft a PDF document                      connection to the rogue network shared drive on 12 out of the
which reports back to the author (or a third party) when the                      18 Windows based PDF viewers. Using hashcat,21 we could
document is opened, in a majority of the tested applications.                     perform successful brute force attacks on the hashes of simple
                                                                                  5-character passwords within within seconds.22 Note that, by
    Note that for vulnerable PDF interpreters in web browsers                     design, only applications running on Windows are affected. We
this issue can lead to further, web-security weaknesses. For                      used a mixture of techniques to accomplish this goal: external
example, a malicious document uploaded by the attacker to                         streams, standard PDF actions, as well as JavaScript. Various
a social media website can trigger same-site requests18 if                        readers were affected by multiple test cases. It is interesting
viewed by the victim. This would otherwise be forbidden by                        to note that, although Foxit fixed this issue in 2018 for
the browser and may be exploited to perform actions in the                        PhantomPDF/Reader, we could identity bypasses using four
context of the user’s account, in case same-site cookies [64]                     different techniques. This is because – apparently – accessing
are used by the web application to protect against cross-site                     a share invocation via GoToR actions (as documented in the
request forgery (CSRF).                                                           original exploit) was prohibited, however, using other action
    2) Form Data Leakage: To test if form data can be leaked                      types, such as auto-printing a file on a network shared drive,
silently, without the user knowing, we modified the standard                      we were again able to enforce NTLM hashes being leaked.
U.S. individual tax return form 104019 to send all user input to
our webserver once the document is either printed or closed.                      D. Data Manipulation
This can be done by combining the DP (“did print”) and PC
(“page closed”) events of the Catalog and Annotation objects                          1) Form Modification: To test the feasibility of crafting
with a SubmitForm action or JavaScript. We classify the attack                    PDF documents that silently manipulate their own form data,
as successful if a PDF application passes filled-in form data                     we once again modified the U.S. tax return form 1040. We
without the user being made aware of it (i.e., no warning                         added an ImportData action that changes the refund account
message or confirmation dialog displayed). Nine applications                      number to the attacker’s account number once the document
are vulnerable to this attack, using forms that auto-submit                       is printed.23 We used the WP (“will print”) event for this
themselves. For two additional applications, we were able to                      purpose. Unfortunately, from an attacker’s point of view, none
use JavaScript to access form data and silently exfiltrate it to                  of the tested applications supports importing form data from
our server. Nine applications did ask the user before sending                     an embedded file within the document itself – or from an
the data, which we consider as sane behavior. Another eight                       external URL. By using standard PDF JavaScript functions
PDF interpreters (e.g., on macOS and Linux) did not support                       (getAnnots()[i].contents), we were however able to
the feature of submitting PDF form data at all.                                   modify PDF form data in six applications. JavaScript also
                                                                                  allowed us to temporarily store the original user data and undo
    3) Local File Leakage: Although part of the standard,                         our manipulation immediately after the document had been
only two applications (i.e., PDF-XChange Editor and Nuance                        printed, using the DP (“did print”) event, and to enforce that
Power PDF) support the feature of external streams. For                           these modifications are only performed until a certain date,
both applications, we were able to craft a document which                         thereby making it more difficult to reproduce the manipulation.
embeds arbitrary files on disk into the document and silently
leaks them to an external server using both auto-submitting                           2) File Write Access: Only three applications allowed to
forms and JavaScript. Exfiltration happens in the background                      submit form data to a local file. While Foxit PhantomPDF and
once the document is opened, without the user noticing and                        Foxit Reader explicitly ask the user before writing to disk,
without any visible changes to the document. For another three                    Master PDF Editor silently writes to or overwrites arbitrary
applications, we were able to include and automatically leak                      files with attacker controlled content by auto-submitting the
the contents of FDF files and XML-based XFDF files (using                         form data to a PDF File Specification. We also tested six
the ImportData action or the ImportFDF JavaScript function).                      standard PDF JavaScript functions to write to disk. The
We classify this vulnerability as limited, because it is restricted               extractPages() function allowed us to write data to
by file type – yet it should be clear that such behavior is not                   arbitrary locations on disk in PDF-XChange Editor. The other
desired either. Note that this attack is different from “form                     applications did not support writing files with JavaScript at all,
data leakage” as mentioned before, because although (X)FDF                        asked the user for confirmation, or showed a “Save as” dialog,
files usually contain PDF form data, this attack results in the                   instead of automatically writing the file to a given location.
contents of external (X)FDF files from disk being leaked,                             3) Content Masking: We define an application as vulner-
which is may be completely unrelated to the form data of                          able if we can create a document that displays certain text
the currently opened (malicious) document. For PDF-XChange                        in this, and only in this, application, while a completely
Viewer, we were additionally able to use standard JavaScript                      different text is displayed in all other tested PDF viewers
functions to access arbitrary files and the leak them.                            – with the exception of two applications utilizing the same
    4) Credential Theft: We installed Responder20 as a rogue                      underlying PDF interpreter (e.g., Evince/Okular are both based
authentication server to obtain the client’s NTLM hashes                          on Poppler). Furthermore, if a vendor produces a “viewer”
when opening the malicious document. We were able to                              and an “editor” version of an application, both may also
leak the hashes of NTLM credentials to our server without                           21 See https://hashcat.net/hashcat/.
the user noticing or being asked for confirmation to open a                          22 Of course, it is up to the configuration of the victim’s setup (e.g., password
                                                                                  strength and security policy) if efficient cracking attacks are actually feasible.
  18 HTTP POST requests in Chrome and Opera, GET requests in Firefox.                23 It must be noted that, in practice, this attack does not only have a technical
  19 Available for download from https://www.irs.gov/pub/irs-pdf/f1040.pdf.
                                                                                  component. It will only work if the attacker’s bank accepts the deposit, see
  20 See https://github.com/SpiderLabs/Responder.                                 https://www.irs.gov/faqs/irs-procedures/refund-inquiries/refund-inquiries-18.


                                                                              9
display the same text. Of our 94 hand-crafted edge cases, 63                                the VirusTotal database,29 we conclude that the Launch action
rendered differently when opened in different applications. Full                            is rarely used in the wild and its support should be removed
details are given in Table VII in the appendix. For three PDF                               by PDF implementations as well as the standard.
interpreter engines (six applications), we found a case where
certain text was displayed only in this interpreter. For other                                                VIII.     A DDITIONAL F INDINGS
PDF interpreters, we could not find edge cases that resulted in
a unique appearance (i.e., no other interpreter displaying the                                 In this section, we present additional insights related to
same text), therefore we did not classify them as vulnerable.                               JavaScript, Digital Rights Management, and hidden data in
It must, however, be noted that test cases can potentially be                               PDF documents.
chained together, which may result in getting more applications
to render unique content. This challenge is considered as future                            A. JavaScript-based Fingerprinting
work. Another interesting use of this technique would be                                        While the syntax of JavaScript code embedded in PDF
fingerprinting PDF interpreters applied in web applications to                              documents is based on the ECMA standards [21], there is
process or preview documents based on the rendered result of                                no specification of the Document Object Model (DOM) for
PDF file uploads.                                                                           PDF documents. Furthermore, the API provided by Adobe [2]
                                                                                            is rather descriptive than prescriptive, i.e., lacking any form
E. Code Execution: Launch Action                                                            of IDL definitions. Thus, the objects and properties visible to
    In theory, by chaining PDF standard features, an attacker                               JavaScript differ widely between different viewers. This results
can easily get code execution “by design”. We combined a                                    in embedded JavaScript engines of PDF viewers being easily
LaunchAction with an OpenAction event to achieve this goal                                  fingerprinted via their provided functionality. As a simple proof
and launch an executable file. Surprisingly, this worked out of                             of concept, we show that one can distinguish every JavaScript
the box on six applications. The .exe file was launched without                             supporting PDF viewer already by recursively enumerating and
any confirmation dialog being displayed. The other tested                                   counting the properties of the execution environment.
applications asked the user for confirmation (5 viewers) before                                 We show that the surface of the JavaScript API differs
executing the file, denied to launch executable files (Acrobat                              significantly between viewers. Using a crawler written in
Reader/Pro),24 or did not support the LaunchAction at all in                                JavaScript we automated the enumeration of the API. The
the default settings (11 viewers). Three Linux based viewers                                results, containing various details on all encountered prop-
(Evince, Okular, and MuPDF) use xdg-open25 to handle the                                    erties, are extracted as JSON. Table II shows the number
file to be launched, thereby delegating the security decision                               of properties grouped by their type. The greatly varying
to a third-party application. On our Debian GNU/Linux test                                  number of available functions highlights the disparity between
system, this resulted in code execution with minimal user                                   implementation; this ranges from viewers only being capable
interaction; by referencing an .exe from a Link annotation,                                 of running loops and simple arithmetic without any further API
the file was executed with /usr/bin/mono, an emulator                                       (e.g., Evince), to viewers with only a handful of functions (e.g.,
for .NET executables, if the user clicked somewhere into the                                PDF XChange Viewer: 114), to an almost complete coverage
document.26 This was also a requirement for PDFelement.                                     of the Adobe API (e.g., Acrobat Reader: 6742).
We classify these vulnerabilities as “limited” because – even                               Additionally, many of the identified functions are not docu-
though no confirmation dialog is presented to the user –                                    mented in the Adobe PDF JavaScript standard and do not
the exploit is not fully automated.27 PDF Architect 6, which                                yield any result on public search engines. The absence of
we initially tested, was also vulnerable to code execution.                                 public knowledge of these properties indicates that they are
However, version 7 had removed support for the Launch action.                               not intended to be used by authors of PDF documents. It is
Finally, it must be said that, even if a confirmation dialog is                             questionable whether these hidden APIs are well tested. We
presented, attackers may apply social engineering techniques                                used the extracted JSON results as input for JavaScript code
to trick the victim into launching the file.                                                which simply calls every available function in the API with
    Because the Launch action can be considered as a danger-                                zero to four empty-string parameters. This already was enough
ous feature, we conducted a large-scale evaluation of 294 586                               to crash four PDF applications, thereby enabling DoS attacks.
PDF documents downloaded from the Internet28 , in order to                                      Identifying the application is a useful preparation stage for
research if there are any legitimate use cases at all. Of those                             attacks. It allows an attacker to send a first PDF document
documents, only 532 files (0.18%) contained a Launch action.                                to the victim that replies back (e.g., using JavaScript APIs)
While none of the files was classified as malicious according to                            which PDF viewer is used by the victim, and then exploit
   24 Note that Adobe products use a blacklist of potentially “dangerous” file              the vulnerabilities of this specific viewer by sending a second
extensions. However, various bypasses have been identified in the past [49].                specially crafted attack PDF file to the victim.
   25 See https://www.freedesktop.org/wiki/Software/xdg-utils/.
   26 Readers may ask themselves: How often did I click in this document to
                                                                                            B. Digital Rights Management
jump to a certain section? Would I anticipate this can lead to code execution?
   27 Note that this is the only vulnerability described in this paper that requires
                                                                                                PDF documents can be “protected” based on questionable
a bit of user interaction and is not automatically triggered once the document              client-side security mechanisms. For example, the specifica-
is opened, because such events are not supported by Linux based readers.
   28 We obtained the dataset from the Cisco Umbrella 1 Million list of domains             tion allows to restrict certain document capabilities, such as
(see https://s3-us-west-1.amazonaws.com/umbrella-static/index.html). Instead                printing, copying text, or editing content. Technically, a special
of crawling each website directly for PDF documents, we searched the Internet               permissions object is added to the document which, according
Archive (see https://web.archive.org) for links to PDF files in each each domain
and then retrieved all linked PDF documents from the original (live) website.                 29 See https://www.virustotal.com/.




                                                                                       10
                                     # functions
                                                                                                                                                          Access Permissions




                                                                                           # booleans
                                                                 # numbers
                                                    # objects




                                                                              # strings
                                                                                                                Application                          Print       Copy       Edit
 Application                                                                                                    Acrobat Reader DC                     #           #            –
 Acrobat Reader DC                 6742            320          398          492          357                   Foxit Reader                          #           #            –
 Foxit Reader                      1900            130           79          146           30                   PDF-XChange Viewer                    #           #            –
 PDF-XChange Viewer                 114             58           68          183            1                   Perfect PDF Reader                    #           #            –
 Perfect PDF Reader¹                 F              F            F            F            F                    PDF Studio Viewer                     #           #            –
 PDF Studio Viewer                   F              F            F            F            F                    Nitro Reader                          #           #            –
 Nitro Reader                      1067            159           55           84           10                   Acrobat Pro DC                        #           #            #
 Acrobat Pro DC                    6851            714          388          482          358                   Foxit PhantomPDF                      #           #            #




                                                                                                                                           Windows
 Foxit PhantomPDF                  1902            130           79          146           30                   PDF-XChange Editor                    #           #            #
                         Windows



 PDF-XChange Editor                3529            166          219          270           61                   Perfect PDF Premium                   #           #            #
 Perfect PDF Premium¹                F              F            F            F            F                    PDF Studio Pro                        #           #            #
 PDF Studio Pro                      F              F            F            F            F                    Nitro Pro                             #           #            #
 Nitro Pro                           F              F            F            F            F                    Nuance Power PDF                      #           #            #
 Nuance Power PDF                   206             88          109          730            0                   iSkysoft PDF Editor                   #           #            #
 iSkysoft PDF Editor                  –              –            –            –            –                   Master PDF Editor                     #           #            #
 Master PDF Editor                 1134             75           57           94           10                   Soda PDF Desktop                      #           #            #
 Soda PDF Desktop                  2559            117          156          214          141                   PDF Architect                         #           #            #
 PDF Architect                     2317            112          146          194          135                   PDFelement                            #           #            #
 PDFelement                           –              –            –            –            –                                                         #           #




                                                                                                                                           Mac
                                                                                                                Preview                                                        –
                                                                                                                Skim                                  #                        –
                         Mac




 Preview                              –                –          –              –          –
 Skim                                 –                –          –              –          –                   Evince                                                         –




                                                                                                                                           Linux
 Evince                                                                                                         Okular                                                         –
                         Linux




 Okular                                                                                                         MuPDF                                 –                        –
 MuPDF                                –                –          –              –          –                   Chrome                                #           #            –
                                   1183            73           46           87            21                   Firefox                                                        –




                                                                                                                                           Web
 Chrome
 Firefox                              –             –            –            –             –                   Safari                                            #            –
                         Web




 Safari                                                                                                         Opera                                                          –
 Opera                             1182            73           46           87            21                   Edge                                  #           #            –
 Edge                                 –             –            –            –             –                      Permissions ignored   # Permissions honored    – Not available
   ¹ JavaScript must be enabled in settings   No feedback channel
    – JavaScript support is not available   F Application crashes                                             TABLE III.      ACCESS PERMISSION ENFORCEMENT IN PDF VIEWERS .

 TABLE II.     JAVA S CRIPT EXECUTION ENVIRONMENT DIFFERENCES .

                                                                                                             The metadata of the PDF document revealed a Duke University
                                                                                                             political scientist as the original author of the document [33].
to the standard, should be respected by consumer applications.                                               Afterwards, the NSA published best practices addressing risks
As it is completely up to the client application (i.e., the                                                  involved with hidden data and metadata in PDF files [9].
PDF viewer) to enforce PDF permissions, they cannot be                                                       This example shows that there are valid use-cases where the
considered as effective security mechanisms. In reality, various                                             author of a document prefers to remain anonymous. The issue
PDF applications, especially on Linux, do not interpret PDF                                                  of unwanted metadata in various file formats is well-known
permissions at all. To evaluate which viewers “conform to                                                    and has been discussed in [11, 46]. Even though metadata
the standard” and enforce PDF access permissions, we saved                                                   is a feature of the PDF standard, from a privacy perspective,
a document using Adobe Acrobat Reader, with “printing”,                                                      creator software should avoid to include excessive metadata
“copying text”, and “editing” disabled. The results are given                                                by default and instead let users opt-in. Although many PDF
in Table III.                                                                                                documents are created with non-PDF software (e.g., LaTeX,
    Of the tested 28 applications, five viewers completely                                                   office suites, or system printers), all professional PDF editors
ignore the user access permissions. For another two viewers,                                                 offer the creation of PDF files as well. They are especially used
we could observe inconsistent behavior. For example, Safari                                                  when designing complex PDF documents that, for example,
allows to print the document but prohibits copying its text, in                                              include forms and JavaScript. During the creation process,
a document where both actions are prohibited.                                                                these editors generate special PDF metadata objects, which
                                                                                                             can contain sensitive information (e.g., usernames or dates).
C. Hidden Data in PDF Documents                                                                                   To identify which amount of information is included by
                                                                                                             modern applications, we created a minimal document with
    In this section we discuss two privacy-related PDF issues –
                                                                                                             each PDF editor and identified the metadata in the saved
evitable metadata and revision recovery – which allow anyone
                                                                                                             file, which can either be found in the Document Information
obtaining the file to reveal potentially sensitive information.
                                                                                                             Dictionary or within a Metadata Stream. The results are given
   1) Evitable Metadata in PDF Documents: In 2005, the                                                       in Table IV. All tested PDF editors store the date of creation
former US President Bush gave a speech on the war in Iraq and                                                and modification, as well as the creator software, including its
published a strategy document on the White House website.                                                    version number. Eight editors store the author’s name, derived

                                                                                                        11
from the name of the currently (at creation time) logged in                                                                Evitable       Revision
                                                                                       Application
user. We classify the level of data exposure as “full”, if a PDF                                                           Metadata       Recovery
editor silently stores the author’s name (i.e., the username) and
                                                                                       Acrobat Pro DC                         G
                                                                                                                              #              #
                                                                                                                                             G
as “limited” if only dates or creator software strings are stored.
                                                                                       Foxit PhantomPDF                                      #
   We also performed a large-scale evaluation, of 294 586                              PDF-XChange Editor                     G
                                                                                                                              #              #
                                                                                       Perfect PDF Premium                                   #
PDF files downloaded from the Internet of which 173 112
                                                                                       PDF Studio Pro                         G
                                                                                                                              #              #




                                                                                                                 Windows
(58%) contained an author name. Of course, we cannot make                              Nitro Pro                                             G
                                                                                                                                             #
any statement if this information was included on purpose or                           Nuance Power PDF                                      G
                                                                                                                                             #
by accident. The single largest creator software of documents                          iSkysoft PDF Editor                                   G
                                                                                                                                             #
containing an author was Microsoft Office with 64 167 files.                           Master PDF Editor                      G
                                                                                                                              #              #
                                                                                       Soda PDF Desktop                                      #
    2) Revision Recovery: The PDF standard allows editing                              PDF Architect                                         #
applications to modify existing documents while only append-                           PDFelement                                            G
                                                                                                                                             #
ing to the file and leaving the original data intact. Whenever                            Full data exposure   G
                                                                                                               # Limited data exposure   # No exposure
new content is added to the document, it is not simply
inserted into the existing body section. Instead, a new body                                  TABLE IV.        H IDDEN DATA IN PDF DOCUMENTS .
section is appended at the end of the PDF file containing
new objects.30 This feature is called “incremental updates”.
It enables authors, for example, to undo changes. However, it
also enables third parties to restore previous versions of the                                          IX.    C OUNTERMEASURES
document, which may not be desired in the context of privacy                            In this section, we discuss short-term mitigations as well
and document security. Especially when sensitive content is                          as more generic in-depth countermeasures to be considered by
explicitly redacted/blackened in a document to be published,                         implementations and future versions of the PDF standard.
this can be dangerous. Instead of deleting the underlying text
object, PDF editors may simply overlay a black rectangle,                            A. Towards an Unambiguous Specification
allowing for easy “unredaction”. Poorly redacted documents
revealing classified information have been published by the                              To counter infinite loops, constructs that can lead to cycles
Washington Post [23], the Pentagon [41], Facebook [42],                              or recursion, such as self-referencing objects, must be prohib-
and many others. Although this is a well-known problem                               ited in implementations (e.g., by remembering their path) and
and has been researched for PDF documents generated by                               ambiguous formulations should be removed from the standard.
various office suites [26], modern PDF editors have an explicit                      A clearly stated specification would also help to prevent
“redact” function, which has not yet been comprehensively                            content masking attacks. In practice, this is not trivial as it
evaluated. Therefore, we systematically analyze how document                         would require a formal model of the PDF standard, in order to
modification and text redaction is implemented in PDF editors.                       prove that the model is cycle free, and that a certain document
                                                                                     can only be processed in one single way. Furthermore, it must
    To test if sensitive information can be recovered from a                         be noted that an unambiguous PDF specification would only
document redacted by a PDF editor, we used two PDF files –                           protect the document structure, not embedded data formats
one containing selectable text, the other containing a scanned                       such as calculator functions, XML, JavaScript, Flash, etc.
document (i.e., an image).31 We applied the PDF editor’s
“redact” function to draw a black rectangle over parts of the                        B. Resource Limitation and Sandboxing
document as well as the “delete” function to remove the text
or image. In all tested PDF editors, the “redaction” feature                             To counter compression bombs, [45] propose to halt de-
was found to be secure, because the actual content of the text                       compression once the size of the decompressed data exceeds an
or image object was modified, thereby overwriting potentially                        upper limit. This strategy should be applied by PDF processing
sensitive content in the file. However, we determined potential                      applications. It must, however, be noted that a single document
security issues in Acrobat Pro and and four other PDF editors,                       can contain thousands of streams to be processed in a row.
whereby we deleted the content (text or image). The removed                          In general, the authors think that limiting the resources to be
content is not displayed anymore, but it is still contained in                       consumed by a single document, by sandboxing it – similar
the file and can be extracted. We do classify the level of data                      to a tab in a modern web browser – is a good approach,
exposure as “limited” in our evaluation (see Table IV), because                      thereby preventing a malicious document to affect the whole
the “delete” function is not explicitly promoted as a secure                         application or even the whole operating system.
feature, even though users may misinterpret it as such. To
conclude, redaction tools in PDF viewers can be considered as                        C. Identification of Dangerous Paths
well-developed these days. The only identified risk is caused
by removing sensitive information without explicitly using the                           Considering Figure 1, our attacks took a path from the
redact feature of the PDF editors. This approach does not                            top to the file handle. If the path was neither blocked nor
provide the same security level and should be avoided.                               required user consent, the attack was successful. Many viewer
                                                                                     applications blocked particular paths, but failed to block all
  30 A new XRef index table and a new trailer must also be appended.                 of them, thereby allowing us to bypass existing protection
   31 We used the scan of a document from WWI, describing cipher techniques,         mechanisms. This reveals the need for a systematic approach
which was recently declassified by the CIA and can be downloaded from:               to analyze insecure features in PDF documents. Two positive
https://www.cia.gov/library/readingroom/docs/Secret-writing-document-one.pdf.        examples for blocking dangerous paths are Safari and Edge.

                                                                                12
These application blocked all but one path: Annotation ⇒(link)                      E. Implementing Privacy by Default
⇒ URI Action ⇒ URL. In addition, this path required user
                                                                                        PDF editors should not include excessive metadata such
interaction by actively clicking on a Link Annotation. This
                                                                                    as usernames in the default settings. Furthermore, all editing
example illustrates how a secure PDF application should work.
                                                                                    functions (redaction, modification, and deletion of elements)
We would like to see more applications that restrict the danger-
ous paths systematically (e.g., by removing them completely or                      should be performed on the actual object to prevent a third
by asking the user for consent). This would reliably prevent                        party from recovering previous versions of the document. Such
all possible variants of URL invocation, form data leakage,                         best practices regarding metadata and text redaction should not
local file leakage, credential theft, form modification, file write                 only be applied by PDF editors, but by all applications that
access, and code execution attacks discussed in this paper.                         allow to export content to PDF (e.g., office suites).

                                                                                                          X.   C ONCLUSION
Launch Thread GoToE GoToR SubmitForm ImportData URI
                                                                                        PDF is more than a simple document format. Each standard
532       4416      0         693       64           0             46 612           compatible PDF viewer must support a large set of additional
(0.18%)   (1.49%)   (0.00%)   (0.23%)   (0.02%)      (0.00%)       (15.82%)
                                                                                    features. While PDF exploitation caused by implementation
   TABLE V.         PDF ACTIONS IN 294 586 ANALYZED DOCUMENTS .                     bugs, such as buffer overflow based code execution, has been
                                                                                    a long-standing research area with many important results, a
                                                                                    security evaluation of standard PDF features has just started.
    As part of this work, we conducted a large-scale evaluation
of 294 586 publicly available PDF documents. We analyzed                            A. Systematization of PDF Processing Model
these files for the various PDF action types by first uncom-
                                                                                        The research presented in this paper can be seen as a first
pressing all contained streams and then searching for the
                                                                                    step towards a systematization of research on PDF security
patterns which define a certain action (e.g., /SubmitForm).
                                                                                    within the PDF data processing model. All of our test cases
Results on how many documents contain a certain action are
                                                                                    fall within the PDF specification, and mitigations against the
depicted in Table V. As one can see, the only action-based PDF
                                                                                    described attacks often consist in omitting certain standard
feature that is widely in practice is the URI action, which can
                                                                                    PDF features (e.g., the Launch action). However, research
be restricted to a Link Annotation. Insecure features instead
                                                                                    in this direction, until now, was limited to picking some
are rarely used in real-world PDF documents. Therefore, it
                                                                                    functionality, evaluating it and in case of successful attacks,
can be concluded that PDF viewers should drop support for
                                                                                    (partially) disabling this single functionality. This will close
potentially dangerous features such as the Launch action or at
                                                                                    single security holes, but will not result in a provably secure
least disable them in the default settings.
                                                                                    PDF viewer specification. Instead, we have to fully understand
                                                                                    the data processing model behind the PDF standard to be able
                                                                                    to define what secure PDF rendering means.
D. Removing or Restricting JavaScript
                                                                                    B. Future Research Directions
    JavaScript support in PDF applications is extremely varied.
The absence of a sound test suite to accompany the standard                             1) Printers and PDF Libraries Used by Web Applications:
makes it difficult for developers to create compliant and robust                    Modern printers are able to natively process PDF files and
implementations. In addition, the great disparity between PDF                       print them to paper. Some of our attack classes are highly
viewers regarding their feature support complicates the effec-                      relevant to these embedded interpreters. Examples are DoS,
tive utilization of JavaScript by authors of PDF documents.                         local file leakage, content masking, or code execution. Sending
While we could observe some viewers to borrow a stable                              a PDF document to a company employee which does render
JavaScript engine from other projects, such as SpiderMonkey                         on a desktop PDF viewer, but causes a DoS attack on network
or V8, multiple viewers provide very unstable homebrewed                            printers, may have a large attack potential. Web applications
solutions which can be crashed with ease. Unrelated to the                          which parse uploaded PDF files (e.g., to generate preview
used engine, many viewers implement obscure JavaScript API                          images) also may show security weaknesses. While we did
functions without providing public documentation. Neither                           not evaluate PDF parser libraries used in printers or in web
their purpose nor resistance to exploitation is clear.                              applications, our attack vectors may still be applicable here.

    Given that PDF is supposed to be a format for portable                              2) Automatic Test Vector Generation: Automatically gener-
documents, the need to embed a full programming language                            ating test vectors from a human-readable specification remains
is debatable. Many legitimate use cases of JavaScript in                            an open problem in software engineering. This especially
PDF, such as input validation of form fields, can be covered                        holds for compliance tests. Even if such generation tools were
without a programming language, as established and proven                           available, it would be questionable whether the test suite of
in HTML5.32 . Any scenario exceeding the declarative markup                         PDF files used in our evaluation could be generated by them.
features of PDF should be considered to be implemented as                           Although our test cases are valid PDF documents, they are
a web application instead of a PDF document, given that                             edge cases and are not necessarily reproduced by specification
JavaScript support and the security of modern web browsers                          coverage [28]. We conclude that an open question for the
is well researched and robustly implemented.                                        research community is to generate such security test cases
                                                                                    automatically, not only relying on compliance test vectors.
  32 See https://html.spec.whatwg.org/multipage/input.html#input-impl-notes.




                                                                               13
                             R EFERENCES                                                     Conference on Computer & Communications Security. ACM. 2013,
                                                                                             pp. 753–764.
 [1]   Access Denied. DFS Issue 55. http://textfiles.com/magazines/DFS/               [36]   D. Maiorca and B. Biggio. “Digital Investigation of PDF Files:
       dfs055.txt. May 1996.                                                                 Unveiling Traces of Embedded Malware”. In: IEEE Security and
 [2]   Adobe Systems. Acrobat JavaScript Scripting Guide. 2005.                              Privacy: Special Issue on Digital Forensics (2017).
 [3]   Adobe Systems. Adobe Supplement to the ISO 32000, BaseVersion:                 [37]   D. Maiorca, G. Giacinto, and I. Corona. “A Pattern Recognition
       1.7, ExtensionLevel: 3. 2008.                                                         System for Malicious PDF Files Detection”. In: International Work-
 [4]   Adobe Systems. Applying Actions and Scripts to PDFs. https://helpx.                   shop on Machine Learning and Data Mining in Pattern Recognition.
       adobe.com/acrobat/using/applying-actions-scripts-pdfs.html. 2019.                     Springer. 2012, pp. 510–524.
 [5]   Adobe Systems. Displaying 3D Models in PDFs. https://helpx.adobe.              [38]   D. Maiorca et al. “A Structural and Content-Based Approach for
       com/acrobat/using/displaying-3d-models-pdfs.html. 2017.                               a Precise and Robust Detection of Malicious PDF Files”. In: 2015
 [6]   Adobe Systems. How to fill in PDF forms. https://helpx.adobe.com/                     International Conference on Information Systems Security and Privacy
       en/acrobat/using/filling-pdf-forms.html. 2019.                                        (ICISSP). IEEE. 2015, pp. 27–36.
 [7]   Adobe Systems. Starting a PDF review. https : / / helpx . adobe . com /        [39]   I. Markwood et al. “PDF Mirage: Content Masking Attack Against
       acrobat/using/starting-pdf-review.html. 2019.                                         Information-Based Online Services”. In: 26th USENIX Security Sym-
 [8]   Adobe Systems. XMP Specification Part 1. 2012.                                        posium (USENIX Security 17), (Vancouver, BC). 2017, pp. 833–847.
 [9]   National Security Agency. Hidden Data and Metadata in Adobe PDF                [40]   M. Marlinspike. “Divide and Conquer: Cracking MS-CHAPv2 with a
       Files: Publication Risks and Countermeasures. 2008.                                   100% success rate”. In: CloudCracker [online] 29 (2012).
[10]   A. Albertini. “This PDF is a JPEG; or, This Proof of Concept is a              [41]   K. McCarthy. That classified US military report’s secrets in full. https:
       Picture of Cats”. In: PoC 11 GTFO 0x03 (2014). URL: https://www.                      //theregister.co.uk/2005/05/03/military_report_secrets/. 2005.
       alchemistowl.org/pocorgtfo/pocorgtfo03.pdf.                                    [42]   A. Nusca. Facebook settlement revealed via poor PDF redaction.
[11]   C. Alonso et al. Disclosing Private Information from Metadata,                        https : / / www. zdnet . com / article / facebook - settlement - revealed - via -
       Hidden Info and Lost Data. 2008.                                                      poor-pdf-redaction/. 2009.
[12]   P. Bieringer. Decompression Bomb Vulnerabilities. 2001.                        [43]   N. Ochoa. Pass-The-Hash Toolkit-Docs & Info. 2008.
[13]   A. Blonce, E. Filiol, and L. Frayssignes. “Portable Document Format            [44]   Parker, T. How to do (not so simple) form calculations. https : / /
       Security Analysis and Malware Threats”. In: BlackHat Europe (2008).                   acrobatusers . com / tutorials / print / how - to - do - not - so - simple - form -
[14]   Boxcryptor. Malware in Email Attachments: Which File Extensions                       calculations. July 2006.
       are Dangerous? https://boxcryptor.com/blog/post/malware-in-email-              [45]   G. Pellegrino et al. “In the Compression Hornet’s Nest: A Security
       attachments/. 2019.                                                                   Study of Data Compression in Network Services”. In: 24th USENIX
[15]   C. Carmony et al. “Extract Me If You Can: Abusing PDF Parsers in                      Security Symposium (USENIX Security 15). 2015, pp. 801–816.
       Malware Detectors.” In: NDSS. The Internet Society, 2016.                      [46]   C. Pesce. Document Metadata, the Silent Killer...
[16]   A. Castiglione, A. De Santis, and C. Soriente. “Security and Privacy           [47]   D. Poddebniak et al. “Efail: Breaking S/MIME and OpenPGP Email
       Issues in the Portable Document Format”. In: Journal of Systems and                   Encryption using Exfiltration Channels”. In: 27th USENIX Security
       Software 83.10 (2010), pp. 1813–1822.                                                 Symposium (USENIX Security 18). 2018, pp. 549–566.
[17]   T. Claburn. Use an 8-char Windows NTLM password? https://www.                  [48]   S. Rautiainen. “A Look at Portable Document Format Vulnerabilities”.
       theregister.co.uk/2019/02/14/password_length/. Feb. 2019.                             In: Information Security Technical Report 14.1 (2009), pp. 30–33.
[18]   I. Corona et al. “Lux0r: Detection of Malicious PDF-Embedded                   [49]   F. Raynal, G. Delugré, and D. Aumaitre. “Malicious Origami in PDF”.
       JavaScript Code through Discriminant Analysis of API References”.                     In: Journal in Computer Virology 6.4 (2010), pp. 289–315. URL: http:
       In: Proceedings of the 2014 Workshop on Artificial Intelligent and                    //esec-lab.sogeti.com/static/publications/08-pacsec-maliciouspdf.pdf.
       Security Workshop. ACM. 2014, pp. 47–57.                                       [50]   Check Point Research. NTLM Credentials Theft via PDF Files. https:
[19]   CVE Details. Adobe Acrobat Reader: Security Vulnerabilities (DoS).                    //research.checkpoint.com/ntlm-credentials-theft-via-pdf-files/. 2018.
       https://www.cvedetails.com/vulnerability-list/vendor_id-53/product_            [51]   B. Rios, F. Lanusse, and M. Gentile. Adobe Reader Same-Origin
       id-497/opdos-1/Adobe-Acrobat-Reader.html. 2006.                                       Policy Bypass. http://www.sneaked.net/adobe- reader- same- origin-
[20]   P. Deutsch. DEFLATE Compressed Data Format Specification. 1996.                       policy-bypass. Jan. 18, 2013.
[21]   ECMA. ECMAScript Language Specification, 3rd Edition. 1999.                    [52]   K. Selvaraj and N. Gutierrez. The Rise of PDF Malware. Tech. rep.
[22]   E. Ellingsen. ZIP File Quine: Droste.zip. https://web.archive.org/web/                Symantec, 2010. URL: https : / / www. symantec . com / content / dam /
       20160130230432/http://www.steike.com/code/useless/zip-file-quine/.                    symantec/docs/security- center/white- papers/security- response- rise-
[23]   K. Foss. Washington Post’s scanned-to-PDF Sniper Letter More Re-                      of-pdf-malware-10-en.pdf.
       vealing Than Intended. http://web.archive.org/web/20040204141449/              [53]   C. Smutz and A. Stavrou. “Malicious PDF Detection Using Metadata
       http://planetpdf.com/mainpage.asp?webpageid=2434. 2002.                               and Structural Features”. In: Proceedings of the 28th Annual Computer
[24]   G. Franken, T. Van Goethem, and W. Joosen. “Who Left Open                             Security Applications Conference. ACM. 2012, pp. 239–248.
       the Cookie Jar? A Comprehensive Evaluation of Third-Party Cookie               [54]   Aaron Spangler. WinNT/Win95 Automatic Authentication Vulnerability
       Policies”. In: 27th USENIX Security Symposium (USENIX Security                        (IE Bug #4). https : / / insecure . org / sploits / winnt . automatic .
       18). Baltimore, MD: USENIX Association, 2018, pp. 151–168.                            authentication.html. Mar. 1997.
[25]   J. Gajek. “Macro Malware: Dissecting a Malicious Word Document”.               [55]   N. Šrndić and P. Laskov. “Hidost: A Static Machine-Learning-Based
       In: Network Security 2017.5 (2017), pp. 8–13.                                         Detector of Malicious Files”. In: EURASIP Journal on Information
[26]   S. Garfinkel. “Leaking Sensitive Information in Complex Document                      Security 2016.1 (2016), p. 22.
       Files – and How to Prevent It”. In: IEEE Security & Privacy 12.1               [56]   Sutherland, E. First Reported PDF Virus Is Not ’Peachy’. http://web.
       (2013), pp. 20–27.                                                                    archive.org/web/20030617154329/http://www.osopinion.com/perl/
[27]   V. Hamon. “Malicious URI resolving in PDF documents”. In: Journal                     story/12626.html. 2001.
       of Computer Virology and Hacking Techniques 9.2 (2013), pp. 65–76.             [57]   Symantec. VBS/PeachyPDF@MM. Aug. 2001. URL: https : / / www.
[28]   Michael Harder, Benjamin Morse, and Michael D Ernst. “Specifica-                      symantec.com/security-center/writeup/2001-080705-1926-99.
       tion Coverage as a Measure of Test Suite Quality”. In: (2001).                 [58]   Symantec. W32/.Yourde-A. Apr. 2003. URL: https://www.symantec.
[29]   Chris Hummel. “Why Crack When You Can Pass The Hash”. In:                             com/security-center/writeup/2003-050108-4923-99.
       SANS Institute InfoSec Reading Room 21 (2009).                                 [59]   Adobe Systems. Fast Facts. 2018. URL: https : / / www. adobe . com /
[30]   A. Inführ. Adobe Reader PDF - Client Side Request Injection. 2018.                    content/dam/cc/en/fast-facts/pdfs/fast-facts.pdf.
[31]   A. Inführ. Multiple PDF Vulnerabilities – Text and Pictures on                 [60]   Adobe Systems. PDF Reference, version 1.7. sixth edition. Nov. 2006.
       Steroids. 2014.                                                                [61]   L. Tong et al. A Framework for Validating Models of Evasion Attacks
[32]   A. Inführ. PDF – Mess with the Web. Sept. 2015.                                       on Machine Learning, with Application to PDF Malware Detection.
[33]   B. Krebs. Document Security 101. http://voices.washingtonpost.com/             [62]   L. Tong et al. “Feature Conservation in Adversarial Classifier Evasion:
       securityfix/2005/12/document_security_101_1.html. 2005.                               A Case Study”. In: CoRR abs/1708.08327 (2017).
[34]   P. Laskov and N. Šrndić. “Static Detection of Malicious JavaScript-           [63]   H. Valentin. “Malicious URI Resolving in PDF Documents”. In:
       bearing PDF Documents”. In: Proceedings of the 27th Annual Com-                       BlackHat Abu Dhabi (2012).
       puter Security Applications Conference. ACM. 2011, pp. 373–382.                [64]   M. West and M. Goodwin. “Same-site Cookies”. In: Internet Engi-
[35]   J. Magazinius, B. Rios, and A. Sabelfeld. “Polyglots: Crossing Origins                neering Task Force Secretariat (2016), pp. 1–14.
       by Crossing Formats”. In: Proceedings of the 2013 ACM SIGSAC


                                                                                 14
                                        Pages                  GoTo                Action         Calculator   Outline   ObjStm     JavaScript       Deflate
                                        loop                   loop                 loop          functions     loop      loop         loop          bomb

 Application                     A1 A2 A3        A4     B1    B2 B3 B4 C1 C2                C3    D1 D3        E2 E3      F1      G1    G2 G3          –
 Acrobat Reader DC               #    #    #     #       #    #    #    F    #      #       /     #     #      #   #       /      /     F    /         /
 Foxit Reader                    #    #    /     #       #    F    F    F    #      F       F     #     #      #   #       #      /     #    /         /
 PDF-XChange Viewer              F    F    F     F       #    #    #    #    #      #       #     #     #      #   #       #      #     #    #         /
 Perfect PDF Reader              #    #    F     F       #    #    #    #    #      #       #     #     #      #   /       #      #     #    #         /
 PDF Studio Viewer               #    #    #     #       #    #    #    #    #      #       #     #     #      #   #       #      #     #    #         /
 Nitro Reader                    #    #    #     #       F    #    #    #    #      #       #     #     #      F   F       #      /     /    /         #
 Acrobat Pro DC                  #    #    #     #       #    #    #    F    #      #       #     #     #      #   #       /      /     F    /         /
                                 #    #    /     #       F    F    F    F    #      F       F     #     #      #   #       #      /     #    /         /
                       Windows



 Foxit PhantomPDF
 PDF-XChange Editor              #    #    #     #       #    /    /    #    #      F       F     #     #      #   #       #      /     #    /         /
 Perfect PDF Premium             #    #    F     F       #    #    #    #    #      #       #     #     /      #   /       #      #     #    #         /
 PDF Studio Pro                  #    #    #     #       #    #    #    #    #      #       #     #     #      #   #       #      #     #    #         /
 Nitro Pro                       #    #    #     #       F    #    #    #    #      #       #     #     #      F   F       #      /     /    /         #
 Nuance Power PDF                #    #    F     F       F    #    #    F    F      F       F     F     #      F   F       #      /     #    /         F
 iSkysoft PDF Editor             #    #    #     #       #    #    #    #    #      #       #     #     #      /   /       #      #     #    #         #
 Master PDF Editor               #    #    #     #       F    #    #    #    #      #       #     #     #      #   #       #      /     #    /         #
 Soda PDF Desktop                #    #    #     #       #    #    #    #    #      F       F     #     #      F   F       #      /     F    F         /
 PDF Architect                   #    #    #     #       #    #    #    #    #      F       F     #     #      F   F       #      /     F    F         /
 PDFelement                      #    #    #     #       #    #    #    #    #      #       #     #     #      F   /       #      #     #    #         #
                                 #     #   #     #       #    #    #    #    F      F       F     #     #      #    #      #      #     #        #     /
                       Mac




 Preview
 Skim                            #     #   #     #       #    #    #    #    F      F       F     #     #      #    #      #      #     #        #     /
 Evince                          #     #   #     #       #    #    #    #     #     #       #     #     #      #    #      #      #     #        #     F
                       Linux




 Okular                          #     #   #     #       #    #    #    #     #     #       #     #     #      #    #      #      /     #        /     F
 MuPDF                           #     #   #     #       #    #    #    #     #     #       #     #     #      #    #      #      /     /        /     #
 Chrome                          #     #   #      # (/)       #    #    #     #     #       (/)   #     #      #    #      #      (/)   #        #     /
 Firefox                         #     #   #     (/) #        #    #    #     #     #        #    #     #      #    #      #       #    #        #     /
                       Web




 Safari                          #     #   #      #  #        #    #    #     #     #        #    #     #      #    #      #       #    #        #     #
 Opera                           #     #   #      # (/)       #    #    #     #     #       (/)   #     #      #    #      #      (/)   #        #    (/)
 Edge                            #     #   #      #  #        #    #    #     #     #        #    #     #      #    #      #       #    #        #     #
                  F Application crashes               / Applications hangs        (/)   Only current tab hangs       # Not vulnerable

                                     TABLE VI.    D ETAILED RESULTS FOR THE D ENIAL - OF -S ERVICE CLASS OF ATTACKS .



                                 A PPENDIX                                        Acknowledgements
A. Availability of Artifacts                                                          Jens Müller was supported by the research training group
                                                                                  “Human Centered System Security”, sponsored by the state
    We released a comprehensive test suite of malicious PDF                       of North Rhine-Westfalia. Dominik Noss was supported by
files which can be used by developers to test their software.                     the research project “MITSicherheit.NRW” funded by the Eu-
All proof of concept exploit files are available for download                     ropean Regional Development Fund North Rhine-Westphalia
from https://pdf-insecurity.org/download/pdf-dangerous-paths/                     (EFRE.NRW). In addition, this work was supported by the
exploits-and-helper-scripts.zip, to allow for easy reproduction.                  German Research Foundation (DFG) within the framework of
                                                                                  the Excellence Strategy of the Federal Government and the
                                                                                  States – EXC 2092 CASA.
B. Evaluation Details: Denial of Service
    In Table VI, full evaluation details for the DoS class of
attacks are given. Test cases (e.g., A1) follow the same naming
convention as the proof-of-concept files provided as artifacts,
which are available online.


C. Evaluation Details: Content Masking
    Table VII shows detailed evaluation results for content
masking attacks. Each column corresponds to a test case
in the artifacts. Columns which did not produce ambiguous
results (i.e., render similar in all tested applications) have been
stripped for reasons of clarity.

                                                                             15
     Application               A1 A3 A4 A5 B1 C1 C2 C3 C4 C6 C7 C8 CX D1 D2 D4 E3 E4 F1 F3 G1 G3 H2 H3 H5 H6 I3 J1 K1 K4 K5 K6 K7 K8 M3 M4 N1 N2 N3 N4 N5 P1 P3 P4 P6 P7 P8 P9 PX Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 QX

     Acrobat Reader/Pro        2   2   1   1   1   –   1   1   –   1   1   –   1    2   2   2   2   1   2    2   –   –   –   –   –   –   2   –   –   1   –   2   2   2   1   2   2   2   1   1   1   –   –   –   2   2   2   –   –   –   –   –   –   2   2   –   –   –   –
     Foxit Reader              2   2   2   1   2   1   1   1   1   1   1   1   1    2   2   2   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   1   1   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     Foxit PhantomPDF          2   2   2   1   2   1   1   1   1   1   1   1   1    2   2   2   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   2   1   1   1   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     PDF-XChange Viewer        2   2   2   2   2   1   1   1   1   1   1   1   1    2   2   2   2   2   2    2   1   1   2   1   2   1   2   1   1   2   1   2   2   2   2   2   2   1   2   2   2   1   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2
     PDF-XChange Editor        2   2   2   1   2   2   1   1   2   1   1   2   1    2   2   2   2   –   2    2   2   2   2   1   2   1   2   1   2   2   1   2   2   2   1   2   2   1   2   2   2   1   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2
     Nitro Reader/Pro          2   2   2   1   2   2   2   2   2   2   2   2   2    2   2   2   2   1   2    2   1   1   –   1   –   1   2   1   2   1   1   2   2   2   1   1   2   1   2   2   2   1   2   2   2   2   2   –   –   –   –   2   2   2   2   2   2   2   2
     Nuance Power PDF          2   2   1   1   1   1   1   1   1   1   1   1   1    2   2   2   1   1   1    2   1   1   –   2   –   2   2   2   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2
     Soda PDF Desktop          2   2   2   1   2   2   1   1   2   1   1   2   1    2   2   2   2   –   1    1   1   1   1   1   1   1   2   1   1   1   1   1   1   1   2   2   1   1   2   2   2   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1
     PDF Architect             2   2   2   1   2   2   1   1   2   1   1   2   1    2   2   2   2   –   1    1   1   1   1   1   1   1   2   1   1   1   1   1   1   1   2   2   1   1   2   2   2   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1   1
     Poppler (Evince/Okular)   2   2   2   1   2   1   –   –   1   –   –   1   –    2   2   2   2   1   2    2   –   –   –   –   –   –   2   –   2   1   2   2   2   2   2   2   2   1   2   2   2   2   –   –   2   2   2   2   2   2   2   –   –   2   2   –   –   –   –
     Chrome                    2   2   2   1   2   1   1   1   1   1   1   1   1    2   2   2   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   2   2   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     Firefox                   2   2   2   1   2   1   1   1   1   1   1   1   1    2   2   2   2   2   1    2   –   –   1   –   1   –   –   –   –   1   –   2   2   2   –   –   1   1   2   2   2   –   –   –   –   2   2   2   2   2   2   –   –   2   2   –   –   –   –
     Opera                     2   2   2   1   2   1   1   1   1   1   1   1   1    2   2   2   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   2   2   1   1   1   2   2   2   2   2   2   2   2   2   2   2   –   –   –   –
     Perfect PDF Reader        1   1   2   –   1   1   1   2   1   1   2   1   1    1   1   1   1   1   2    2   1   2   1   1   1   1   2   1   1   1   1   2   2   2   –   –   2   1   2   2   2   1   2   –   –   2   –   2   –   2   –   2   –   –   –   2   –   –   –




16
     Perfect PDF Premium       1   1   2   1   2   1   1   2   1   1   2   1   1    1   1   1   2   1   2    2   1   2   1   1   1   1   2   1   1   1   1   2   2   2   –   –   2   1   2   2   2   1   –   –   –   2   –   2   –   2   –   –   –   2   2   –   –   –   –
     PDF Studio Viewer/Pro     1   2   2   1   2   2   –   –   2   –   –   2   –    2   2   2   2   –   2    2   1   1   1   1   1   1   –   1   1   1   1   1   1   1   2   2   2   1   2   2   2   1   1   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2
     iSkysoft PDF Editor       1   1   2   1   2   1   1   1   1   1   1   1   1    1   1   1   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   2   2   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     Master PDF Editor         1   1   2   1   2   1   1   1   1   1   1   1   1    1   1   1   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   2   2   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     PDFelement                1   1   2   1   2   1   1   1   1   1   1   1   1    1   1   1   2   2   2    2   1   1   1   1   1   1   1   1   1   2   1   2   2   2   1   2   2   1   1   2   2   1   1   1   2   2   2   2   2   2   2   2   2   2   2   1   1   1   1
     Preview                   1   2   2   1   2   1   –   –   1   –   –   1   –    2   2   2   2   1   2    2   –   –   –   –   –   –   2   –   –   1   –   2   2   2   2   2   2   1   2   2   2   –   –   –   2   2   2   2   2   2   2   –   –   2   2   –   –   –   –
     Skim                      1   2   2   1   2   1   –   –   1   –   –   1   –    2   2   2   2   1   2    2   –   –   –   –   –   –   2   –   –   1   –   2   2   2   2   2   2   1   2   2   2   –   –   –   2   2   2   2   2   2   2   –   –   2   2   –   –   –   –
     MuPDF                     1   2   2   1   2   2   1   1   2   1   1   2   1    2   2   2   2   2   2    2   1   1   2   1   2   1   2   1   2   1   1   2   2   2   1   1   2   1   2   2   2   1   1   1   2   2   2   2   2   1   1   1   1   2   2   1   1   1   1
     Safari                    1   2   2   1   2   1   –   –   1   –   –   1   –    2   2   2   2   1   2    2   –   –   –   –   –   –   2   –   –   1   –   2   2   2   2   2   2   1   2   2   2   –   –   –   2   2   2   2   2   2   2   –   –   2   2   –   –   –   –
     Edge                      1   1   2   –   2   –   –   –   –   –   –   –   –    2   2   2   2   2   2    2   2   2   –   –   –   –   –   –   2   2   2   2   2   2   1   1   2   1   2   2   2   2   2   –   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2

                                                                                   1 First text is displayed                 2 Second text is displayed                  – No text is displayed

                                                                                   TABLE VII.               D ETAILED RESULTS FOR THE CONTENT MASKING CLASS OF ATTACKS .
