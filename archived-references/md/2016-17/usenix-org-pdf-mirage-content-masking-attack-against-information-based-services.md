---
type: Article
title: "PDF Mirage: Content Masking Attack Against Information-Based Online Services"
resource: "https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:43:45+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood"
    title: "PDF Mirage: Content Masking Attack Against Information-Based Online Services"
    author: Ian Markwood, Dakun Shen, Yao Liu, Zhuo Lu
  - id: capture
    resource: "https://web.archive.org/web/20170821173301/https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood"
also_at:
  - "https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-markwood.pdf"
  - "https://www.usenix.org/sites/default/files/conference/protected-files/usenixsecurity17_slides_markwood.pdf"
authors:
  - Ian Markwood
  - Dakun Shen
  - Yao Liu
  - Zhuo Lu
canonical_url: ""
cited_by:
  - "2016-17.md:104"
commit: ""
content_sha256: bf295b853378cf09f6247303cf79d028899da313811eb9aef54f7ed07f622412
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: 309ba18bca2051c083297858bc963622ce298c1e35d86e90be12744954118e10
retrieved_from: "https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-markwood.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:43:45+00:00"
slug: usenix-org-pdf-mirage-content-masking-attack-against-information-based-services
snapshot: 20170821173301
title_english: ""
translation_file: ""
translation_of: ""
---

# PDF Mirage: Content Masking Attack Against Information-Based Online Services

**PDF Mirage: Content Masking Attack Against Information-Based Online Services** - Ian Markwood, Dakun Shen, Yao Liu, Zhuo Lu, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood>
- Also published at: <https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-markwood.pdf>
- Also published at: <https://www.usenix.org/sites/default/files/conference/protected-files/usenixsecurity17_slides_markwood.pdf>
- Preserved from: https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-markwood.pdf (live) on 2026-08-19
- Capture timestamp: 20170821173301
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

PDF Mirage: Content Masking Attack Against
    Information-Based Online Services
 Ian Markwood, Dakun Shen, Yao Liu, and Zhuo Lu, University of South Florida
https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/markwood




          This paper is included in the Proceedings of the
                 26th USENIX Security Symposium
                    August 16–18, 2017 • Vancouver, BC, Canada
                                  ISBN 978-1-931971-40-9




                                              Open access to the Proceedings of the
                                               26th USENIX Security Symposium
                                                    is sponsored by USENIX
                           PDF Mirage: Content Masking Attack
                         Against Information-Based Online Services

                                           †                †            †                  †
                        Ian Markwood∗ , Dakun Shen∗ , Yao Liu , and Zhuo Lu
                              †
                                  University of South Florida, Tampa, FL, U.S.A
                                                * Co-First Authors



Abstract                                                    oped dealing with arbitrary code execution through some
                                                            allowances made by Adobe to execute JavaScript within
We present a new class of content masking attacks           the rendering process of a PDF file [1] [2] or from other
against the Adobe PDF standard, causing documents to        rendering vulnerabilities [3] [4]. These typically allow
appear to humans dissimilar to the underlying content ex-   data exfiltration, botnet creation, or other objectives un-
tracted by information-based services. We show three at-    related to the PDF file itself aside from using it as a de-
tack variants with notable impact on real-world systems.    livery mechanism [5] [6] [7] [8]. We present a class of
Our first attack allows academic paper writers and re-      attacks against the content integrity of PDF documents
viewers to collude via subverting the automatic reviewer    themselves, and following this, describe and test a com-
assignment systems in current use by academic confer-       prehensive defense method against these attacks. With-
ences including INFOCOM, which we reproduced. Our           out changing the appearance of a PDF, we are able to
second attack renders ineffective plagiarism detection      alter how several information-based services see it, with
software, particularly Turnitin, targeting specific small   the following implications:
plagiarism similarity scores to appear natural and evade
                                                               1. We demonstrate how academic paper writers can
detection. In our final attack, we place masked con-
                                                            collude with multiple conference reviewers, by altering
tent into the indexes for Bing, Yahoo!, and DuckDuckGo
                                                            a paper invisibly to humans, to be assigned to those re-
which renders as information entirely different from the
                                                            viewers by automatic reviewer assignment systems, such
keywords used to locate it, enabling spam, profane, or
                                                            as that used by the IEEE International Conference on
possibly illegal content to go unnoticed by these search
                                                            Computer Communications (INFOCOM) [9] that openly
engines but still returned in unrelated search results.
                                                            publishes its automated algorithm. We simulate this re-
Lastly, as these systems eschew optical character recog-
                                                            viewer assignment system using 100 sample academic
nition (OCR) for its overhead, we offer a comprehensive
                                                            papers and a corpus of 2094 papers from 114 reviewers
and lightweight alternative mitigation method.
                                                            of a past security conference, finding that we can cause
                                                            any of said sample papers to match with any reviewer.
1   Introduction                                               2. We show how an unethical student can invisibly
                                                            alter a document to avoid plagiarism detection, namely
Designed as a solution for displaying formatted infor-      the dominant market share Turnitin [10], and general-
mation consistently on computers with myriad hardware       ize methods to target specific small plagiarism similarity
and software configurations, Adobe’s Portable Docu-         scores to simulate the few false positives such systems
ment Format (PDF) has become the standard for elec-         typically detect. We illustrate this attack by inducing pla-
tronic documents. Academic and collegiate papers, busi-     giarism scores, as measured by Turnitin, from 0-100% in
ness write-ups and fact sheets, advertisements for print,   10 academic papers without changing their appearance.
and anything else meant to be viewed as a final product        3. Lastly, we show real-world examples of mak-
make use of the PDF standard. Indeed, there is an ele-      ing leading search engines display arbitrary (potentially
ment of constancy implied in the creation of a PDF doc-     spam, offensive material, etc.) results for innocuous key-
ument. End users cannot easily change the text of a PDF     words. We have successfully caused Bing, Yahoo!, and
document, so most come to expect a degree of integrity      DuckDuckGo to index five documents under keywords
present in all PDF documents encountered.                   not displayed in those documents.
   Attacks are studied and corresponding defenses devel-       These systems have in common the need to scrape



USENIX Association                                                           26th USENIX Security Symposium        833
PDFs for their content for further processing or search-     make perfect sense to the human eye, while the underly-
ing within. Online conference paper or other document        ing text read by the machine has many substituted words
repositories and companies that index the Internet re-       which would not make sense to a human reader. This
quire text from PDFs so they may be located via search.      exploit has the technical challenges of replacing words
Natural language processing tools scrape PDFs to dis-        of differing lengths (larger and smaller replacements re-
cover the topics within, and this information is used in     quire different methods) and also constructing multiple
several large conferences to assign unpublished work to      fonts required for different mappings of the same letter
conference reviewers as well as in document repositories     (for example, to map the word “green” to “brown” re-
to categorize large volumes of works without manual ef-      quires two different font mappings for e). A naive de-
fort. Finally, plagiarism checkers require text from new     fense could check the number of fonts embedded, so in
articles for comparison against currently published work     Section 4 we design algorithms to minimize the num-
to detect impermissible similarity.                          ber of auxiliary fonts used, in order to avoid detection.
   Scraping of PDF documents can be done in an au-           To evaluate, we construct our own automatic reviewer
tomated setting by text extraction tools such as the         assignment system reproducing the current INFOCOM
PDFMiner package [11]. However, fonts of any name            system [9], and show that for 100 test papers, targeting
may be embedded in the PDF document, and these tools         a specific reviewer is possible by masking 4-9 unique
cannot check the fonts’ authenticity. A font is actu-        words in most papers and no more than 12 for all tested.
ally akin to an encoding mechanism, which maps keys             This content masking attack also undermines plagia-
pressed on a keyboard to glyphs representing those keys.     rism detection. In this case, we need only switch out iso-
Without some way to check the validity of fonts in a PDF,    lated characters to change plagiarized text to text never
which glyphs a font maps keys to is arbitrary. Moreover,     written before, while again masking these changes as the
humans reading a PDF read the rendered version of what       original text to the human reader. In fact, as most pa-
a tool such as PDFMiner reads, meaning that machines         pers have a small (false positive) percentage of similarity
and humans are on opposite ends of this encoding mech-       present due to common phrases within the English lan-
anism and may be caused to read different information.       guage, this method simulates that by varying the number
   Consequently, the various PDF document scraping en-       of characters changed, to simulate the usual small but
vironments may be misused through the remapping of           nonzero plagiarism percentage. Only one font is required
keys to arbitrary rendered glyphs. Using one or more         to make this mapping, as the resultant text does not need
custom fonts, an attacker may cause a word to be ren-        to make sense to the plagiarism detector. Thus, say, all
dered as another word by switching the glyph mapping         rendered e’s may be represented by some other letter in
within the font file, or rather change the underlying text   a font that maps that key to the glyph e, and other letters
while keeping a constant rendered output. That is to         may be changed similarly, building a one-to-one map-
say, in a document containing the word “kind” an at-         ping covering at most all letters. The challenge is to tar-
tacker may force that to be rendered as “mean” with a        get a small plagiarism percentage, but accomplishing that
custom font mapping k to m, i to e, n to a, and d to n,      as we do in Section 5, a single embedded font bearing the
so the human now sees “mean” while the machine still         name of a popular font will cause no suspicion.
sees “kind”; or to avoid human detection an attacker can        Finally, search engines and document repositories may
change the underlying text to “mean” and use a font with     be subverted to display unexpected content also. Here,
the reverse mapping to render it as “kind” for the human     we may replace the entire text of a PDF without changing
to see. The latter tactic subverts aforementioned end ap-    the rendered view, with a variety of implications. One
plications, while still rendering PDFs in all appearances    may hide advertisements in academic papers or business
normal to humans. We refer to this as a content masking      fact sheets, for example, to spam users searching for in-
attack, as humans are caused to view a masked version        formation. In this exploit, the attacker should replace an
of the content these computer systems read.                  entire document with the fewest number of fonts neces-
   To assign papers to reviewers for a conference, several   sary, to avoid seeming particularly unusual. This must
large conferences employ automated systems to com-           be done in a different way than for the topic matching
pare the subject paper with a corpus of papers written       exploit, due to changing the entire document rather than
by each reviewer to find the best match. This matching       a few words, so we outline another method in Section 6.
is executed upon the most important topics, or keywords,     We then test it on popular search engines, finding that
found in the paper via natural language processing meth-     Yahoo!, Bing, and DuckDuckGo are susceptible.
ods. If an author replaces the keywords of a paper with         Having enumerated these vulnerabilities, as these sys-
those of a reviewer’s paper, a high match is guaranteed,     tems eschew optical character recognition (OCR) for its
and the two may thereby collude. By creating custom          overhead, we offer a comprehensive and lightweight al-
glyph mappings for characters, the masked paper can          ternative mitigation method in Section 7. While a naive



834   26th USENIX Security Symposium                                                              USENIX Association
method would perform OCR over the full document, we            collections of related words, using supervised learning.
instead render the unique characters used within the doc-      The probability of a document corresponding to each of
ument and perform OCR on these. This font verification         the predefined topics is calculated based on how well
method has several technical challenges in its implemen-       the words within the document correspond to the words
tation, due to the number and variety of glyphs within         within each topic [15, 16].
font files, and all these issues are overcome in the algo-        Topic matching is used within the automation of the
rithm we provide. We find it performs at a roughly con-        review assignment process for several large conferences,
stant speed regardless of document length (a tenth of that     such as the ACM Conference on Computer and Commu-
for full document OCR at 10 pages), with glyph distinc-        nications Security (CCS) or the IEEE International Con-
tion accuracy just under 100%, and with 100% content           ference on Computer Communications (INFOCOM).
masking attack detection rate.                                 These conferences receive many submissions and have
                                                               many reviewers, and the manual task of finding the most
2   Background Information                                     suitable reviewers for each paper is onerous, so they au-
                                                               tomate by comparing topics extracted from subject pa-
PDF Text Extraction: The Adobe PDF standard con-               pers and papers published by reviewers. The authors
tains eight basic types of objects, including strings.         of [9] execute a performance comparison between LSI
Strings house the text in a document, including plain text,    and LDA for use in the present (as of 2016) INFOCOM
octal or hexadecimal representations of plain text, or text    reviewer assignment system, which uses PDFMiner for
with some type of encoding [12]. PDF rendering soft-           text extraction, finding LSI to work well with the aca-
ware treats each string as a series of character identifiers   demic papers submitted to that conference. We accord-
(CIDs), each mapping to its corresponding glyph within         ingly perform our experiments using LSI to determine
the font associated with that string via the Character Map     the important keywords of each paper, and note that the
(CMap) [13]. A series of glyphs is thus displayed.             attack functions equivalently using LDA.
   Text information extracted from PDF files by using             Plagiarism Detection: Turnitin, LLC has the domi-
tools like the Python package PDFMiner. These tools ex-        nant market share for plagiarism detection software. Its
tract text by copying the plaintext from all string objects    software is proprietary, but current documentation states
in a PDF file. Though these tools can extract the font         “Turnitin will not accept PDF image files, forms, or port-
name for each string as well, a whitelist will not defend      folios, files that do not contain highlightable text...” [10],
against this attack, as fonts may be given any name.           indicating that PDFMiner or some similar internally de-
   Topic Matching: The exponential growth of human             veloped tool is used to scrape the text from PDF docu-
knowledge/record keeping and the ease of its access de-        ments. We may assume from the lack of support for im-
mands an efficient means of providing context-relevant         age files that optical character recognition (OCR) is not
search results, stemming the research field of natural lan-    used, meaning that our proposed attack should succeed,
guage processing. This field extracts the specific subject     which is proved in Section 5.2.
of a document without the need for human classification.          Additionally, the Turnitin documentation states that
The ultimate goal of useful search results prompts the         “All document data must be encoded using UTF-8 char-
companion research field of matching keywords to top-          acter set” [17]. As mentioned in Section 2, text may have
ics which has been tackled by the leading search engines.      custom encodings, but here we find they are not permit-
   Latent Semantic Indexing (LSI) is a popular natu-           ted by Turnitin. This disallows any attack where text,
ral language processing algorithm for extracting topics        gibberish in appearance, is translated via decoding into
from documents. The LSI approach infers synonymous             legible text. However, no restriction on fonts is in place,
words/phrases to be those with similar surrounding con-        due to the necessary ability for Turnitin’s client institu-
texts, rather than constructing a thesaurus. These de-         tions to specify their own format requirements.
tected patterns can allow singular value decomposition            Document Indexing: Extracting topics from a docu-
to reduce the number of important words in a document          ment is somewhat of a subproblem to the larger issue of
such that it may be represented by a small subset. This        document indexing. As information highly relevant to a
small subset, of cardinality k, then contains frequency        search may appear in a small portion of a document, sim-
data for each element, such that the document may be           ply relying on the overall topic of every document to in-
represented by a dot in k-space. Similarity between doc-       fer relevancy to a search may miss some useful results. A
uments is easily calculated via their Euclidean distances      search engine should do more than simply topic model-
apart in this geometric representation [14].                   ing to show results for a query. In fact, Google uses more
   Latent Dirichlet Allocation is a newer popular topic        than 200 metrics to determine search relevancy [18], in-
extraction algorithm, which is generally speaking a prob-      cluding its famous PageRank system of inferring quality
abilistic extension of LSI [9]. Topics are generated as        of a site based on the number of sites linking to it [19].



USENIX Association                                                              26th USENIX Security Symposium          835
   Though documentation is sparse on other search en-           ument. Assignment of conference paper submissions to
gines such as Bing or Yahoo, Google does host some              reviewers is accomplished by finding the highest similar-
discussion of its treatment of PDF files. It states that        ity between detected topics within submissions and those
they can index “textual content . . . from PDF files that       within a corpus of reviewers’ papers. Meanwhile, a lazy
use various kinds of character encodings” [20] but that         paper writer may wish to collude with specific review-
aren’t encrypted. “If the text is embedded as images, we        ers, know of some more generous to papers, or just think
may process the images with OCR algorithms to extract           reviewers may be less critical of papers not within their
the text” [20], but for our content masking attack, text is     specializations. This lazy writer needs to change the pa-
not embedded as images, so logically the system would           per topic to target a specific reviewer, replacing words
not perform OCR. Our experiment finds out for sure for          corresponding to the topic of the paper with words com-
Google, Bing, Yahoo, and DuckDuckGo in Section 6.2.             prising the topic of a paper from the reviewer’s corpus,
                                                                while being masked as the original words to still make
                                                                visual sense. We now discuss the challenges for this at-
3     Masking Font Creation                                     tack and methods to target one or more reviewers, and
                                                                subsequently evaluate the attack efficacy.
The content masking attack is facilitated by the ability
to embed custom fonts within PDF documents. In fact,
having all fonts embedded is a formatting requirement           4.1     Construct Word and Character Maps
for the submission of academic papers to conferences.
However, no integrity check is performed on those fonts         We primarily require a list of original words within the
as to the proper correlation between text strings within        subject document to change, and a list of words from the
the PDF file and the respective glyphs rendered in the          target document to which to change these original words.
PDF viewer. An attacker may map characters to arbitrary         The new words will then be masked to display as the
glyphs and alter the text extracted from a PDF document         original words using the masking fonts described in Sec-
while it appears unchanged to humans in a PDF viewer.           tion 3. First, any stopwords within the document should
This requires two steps, firstly to create the requisite font   be eliminated from consideration. These are common
files and secondly to encode the text via these font files.     words within the paper’s language, such as “the,” “of,”
   The first step may employ one of the multiple open           “her,” or “from.” Stopwords may be removed by using
source multi-platform font editing tools such as Font-          existing tools like the Natural Language Toolkit (NLTK)
Forge [21]. With this tool, one can open a font and di-         Python package [24]. From here an attacker can replace
rectly edit the character glyphs with the typical vector        the most frequently used words in the subject paper with
graphics toolbox, or copy the glyph for a character and         the most frequently used words in the target reviewers
paste it into the entry for another character. One can then     paper. This will result in the most frequently used words
edit the PDF file directly with open source tools such          in the target paper also appearing in the subject paper, for
as QPDF [22], or in the case of manipulating academic           a high similarity score as measured by the LSI method
papers, quicken the process by adding custom fonts in           within the automatic reviewer assignment system.
LATEX, and aliasing each to a simple command [23]. We               Consider word lists A and B having constituent words
employ the latter method for its greater ease. It em-           {a1 , a2 , ..., an } and {b1 , b2 , ..., bn } which are in descend-
ploys the program ttf2tfm, included with LATEX, to con-         ing order of appearance within the subject and target pa-
vert TrueType fonts to “TeX font metric” fonts which are        pers, respectively. An attacker wishes to replace words
usable by LATEX. Two LATEXcode files are supplied by            A with topic B and must therefore replace each word
[23]: T1-WGL4.enc for encoding, and t1custom.fd for             ai within the text of the subject paper with a word
easy importing of the font into a LATEXdocument.                bi , encoded using some font(s) to render bi the same
   The second step of choosing how to mask this con-            graphically as ai (a word mapping). No other words
tent and what in a document to encode with custom fonts         should/need be changed. Consequently, the objective is
depends on the system targeted, and the technique and           to construct a mapping between the letters of each bi
evaluation for each of the three scenarios introduced in        and ai (a character mapping). If ai and bi are character
Section 1 appears in the following three sections.              arrays {ai [1], ai [2], ..., ai [pi ]} and {bi [1], bi [2], ..., bi [qi ]},
                                                                then the attacker should construct a masking font such
                                                                that the character bi [1] maps to the glyph ai [1], bi [2] to
4     Content Masking Attack Against Con-                       ai [2], etc. We may consider this analogous to a map data
      ference Reviewer Assignment Systems                       structure, where bi [1] is a key and ai [1] its value, and so
                                                                on. Two challenges naturally arise in constructing the
As learned in Section 2, topic matching works from              required character mappings:
groups of words constituting the main topic of the doc-             One-to-Many Character Mapping: From the brief



836    26th USENIX Security Symposium                                                                          USENIX Association
                                                                  example in Section 1 of changing the word green to
           Original        Masked
                                                                  brown, we know that in terms of a map data structure
            Text            Text
                                                                  there is a collision for the key e and the values o and
                                         blank                    w, such that an attacker will require two masking font
                                      (clearing font)
                                                                  “maps” to render green as brown. The first challenge is to
          Favorable Mapping                                       minimize the number of fonts required in the document,
                                                                  so as to avoid suspicion, while fully switching topic A
                                                                  for B. This problem is not delimited by word: some
                                                                  character mappings may be reused in the same or other
            Unfavorable Mapping
                                                                  words, and many may not. Additionally, changing all of
                                                                  the words in A to those in B may be unnecessary, which
Figure 1: Handling the word length disparity challenge.
                                                                  also impacts the number of one-to-many mappings and
Each box represents a character.
                                                                  resultant number of required font files. If fewer words
                                                                  must be changed while ensuring the required similarity
                                                                  between papers, fewer fonts may be required, and a naive
Algorithm 1 Build Character Map                                   font count threshold defense will be less effective.
Input: subject paper s, target paper t                               Word Length Disparity: Further, the lengths pi and
Output: character mapping C : B → A, encoding fonts               qi of words ai and bi may differ, causing ai to be longer
    F = { f1 , f2 , ..., fx }                                     than bi or vice versa. If pi > qi , to render bi as ai , a font
 1: A ← top k topic words of LSI(s)                               file entry is necessary for the letter bi [qi ] mapping to the
 2: B ← top k topic words of LSI(t)                               last pi − qi + 1 letters of ai . Several additional fonts may
 3: C ← empty character map                                       be necessary if some bi ∈ B have the same last character.
 4: for i ← 1 to k do                                             Thus, we define a favorable keyword mapping as a word
 5:     pi ← length(ai )                                          mapping bi → ai such that pi < qi . In this case, only
 6:     qi ← length(bi )                                          a single clearing font is needed, wherein all characters
 7:     if pi < qi then                  . favorable mapping      map to a blank glyph of no width. Figure 1 illustrates
 8:          for j ← 1 to pi do                                   handling favorable and unfavorable mappings. In prac-
 9:              C ← C ∪ {(bi [ j], ai [ j])}                     tice, a blank glyph of no width is in fact a single dot, of
10:          for j ← pi + 1 to qi do                              width (and height) equal to the smallest unit of measure
11:              C ← C ∪ {(bi [ j], 0)}
                                     /                            within a font drawing program. In contrast, an i is 569
12:     else if pi > qi then         . unfavorable mapping        units wide (and a w is 1500 units wide), so this dot will
13:          for j ← 1 to qi − 1 do                               not be rendered at all. And because this clearing font has
14:              C ← C ∪ {(bi [ j], ai [ j])}                     all letters map to no-width blanks, it will be the only ad-
                                                                  ditional font required if ∀i, pi < qi , hence its favorability.
15:          rest ← combine {ai [qi ], ..., ai [pi ]}
16:          C ← C ∪ {(bi [qi ], rest)}
17:     else                              . equal word length     4.2    Matching One or More Papers to One
18:          for j ← 1 to qi do                                          Reviewer
19:              C ← C ∪ {(bi [ j], ai [ j])}
20: x ← largest number of key collisions in C
                                                                  Mapping of words from B to A is by their original de-
21: temp ← C
                                                                  scending order of frequency within the target and subject
22: for i ← 1 to x do                             . build fonts   papers, respectively. Algorithm 1 shows the overall en-
23:      fi ← empty font                                          coding process and begins by running the LSI model on
24:     for each c ∈ C do                                         the subject and target papers, then constructing a map be-
25:          if value in c is 0/ then                             tween characters in k of the topic words returned. Then,
26:              C ← C \ {c}                                      the mapping is added to C for each character, for each
27:              use clearing font for key in c                   word of B, to the corresponding character(s) in the cor-
28:          else if no key collision between c, fi then          responding word of A. Here, comments (Lines 7, 12,
29:              C ← C \ {c}                                      17) indicate the steps taken for favorable and unfavorable
30:               fi ← fi ∪ {c}                                   mappings and the case when both words are of the same
                                                                  length. Finally at Line 22, the mappings in C are bro-
31:     F ← F ∪ fi                                                ken up into collections to be made into custom masking
32: C ← temp                                                      fonts, with the exception of those characters from favor-
33: return C, F                                                   able mappings which map to null, for which the previ-
                                                                  ously introduced single clearing font is used. Resulting



USENIX Association                                                                 26th USENIX Security Symposium           837
from this algorithm are fonts to be used for each charac-         Matching one paper to one reviewer: The automatic
ter of the words in B to mask them as the words in A. If       reviewer assignment process compares a subject paper
the attacker has multiple papers under submission, this        with every paper from the collection of reviewers’ papers
process may be repeated independently for each paper.          to gather a list of similarity scores. The reviewer with the
                                                               highest similarity score is assigned the paper to judge (if
                                                               available). We therefore aim to change a testing paper
4.3    Matching One Paper to Multiple Re-                      topic to a training paper topic, and to examine how well
       viewers                                                 this works with all papers. For each such pair of papers,
                                                               then, we replace the frequently appearing words A in the
For a better chance at cheating the peer review process        testing paper with those frequently appearing words B
and to collude with multiple reviewers, the content mask-      in the training paper via Algorithm 1. We test the topic
ing attack can be adapted to split up the masked words         matching of each of the 100 testing papers against our
among two (or more) different lists of frequently used         training data to see what is required to induce a match.
words. Instead of mapping between word lists A and B,             For each pair of training and testing papers, we re-
the attacker will map between A and B and A and C, such        place important words in the testing paper one by one, to
that a1 will be replaced with b1 part of the time and c1 the   see how many replacements are needed to make that pair
rest of the time, and so on. The method is otherwise the       the most similar. Figure 2 illustrates this iterative pro-
same as shown in Algorithm 1, but has its own challenge.       cess for one example training/testing paper pair, showing
   Intuition would suggest replacing a1 half of the time       resultant similarity scores. The box plots show where
with b1 and half of the time with c1 . However, the re-        the greatest concentration of the 2094 similarity scores
quirement for the attacker’s paper to be the most similar      dwell, while red pluses show outliers. The blue stars
of a large number of papers to a reviewer’s paper and          which emerge to the top correspond to the similarity
also the most similar of all others to another reviewer’s      scores between the testing paper and the target training
paper is quite stringent. The intuitive method fails as        paper. Figure 2 shows a clear separation of that similarity
the similarity score for one target reviewer will be high      score from the rest after replacing 9 words, meaning that
enough but the other too low. So we use an iterative re-       for this pair, content masking all appearances of those 9
finement method which tunes the replacement percent-           unique words in the testing paper will result in its assign-
ages according to the calculated similarity scores until       ment to the reviewer who wrote that training paper.
they are both the highest among their peers. This is gen-
                                                                  Performing this process for all 100 testing papers, we
eralizable to more than two reviewers, by refining the
                                                               compile the results into Figure 3, which displays the cu-
percentages proportionally according to the successive
                                                               mulative distribution function (CDF) for the number of
differences in similarity scores between the subject pa-
                                                               words requiring replacement. Evidently, all 100 papers
per and each of the target papers. We match one paper to
                                                               may be matched with the target with 12 words or fewer
three reviewers in Section 4.4, the typical number of re-
                                                               masked. The sharp jump appearing from 4-9 words indi-
viewers to which papers are assigned (barring contention
                                                               cates that most papers can be successfully targeted to a
in reviews, which would not happen during collusion).
                                                               specific reviewer masking between 4 and 9 words. The
                                                               font requirements for replacing these words is then rep-
4.4    Experiment                                              resented in Figure 4. A majority of papers require 3 or
                                                               fewer masking fonts, while almost all of them need only
We have built a conference simulation system reproduc-         as many as 5. This is a comparatively small number and
ing the INFOCOM automatic assignment process de-               should go unnoticed among the collection of fonts nat-
scribed in [9]. We imported into this system 114 TPC           ural to academic papers. For example, this paper has
members from a well-known recent security conference           some 19 embedded fonts, between bold/italic variants,
as reviewers, and downloaded a collection of each of           fonts used in figures, and one picture font used in Table
these reviewers’ papers published in recent years. In to-      1.
tal, this comprised 2094 papers used as training data for         Matching multiple papers to a single reviewer:
the automatic reviewer assignment system. For testing          Should an author wish to have multiple submitted papers
data, we also downloaded 100 papers published in the           all assigned to a target reviewer, the author may simply
greater Computer Science field. Our experiment, then,          repeat the content masking process on each paper. While
is to test the topic matching of the test papers with the      in the previous case we find that an average of 3 or 4
training papers, via our content masking attack. Follow-       fonts is necessary to make a single test paper sufficiently
ing are evaluations of the content masking attack match-       similar to the target training paper, that needs not directly
ing one paper to one reviewer, multiple papers to one          translate to 3 or 4 fonts per paper with multiple papers.
reviewer, and one paper to multiple reviewers.                 Some fonts may be reused among papers, resulting in



838   26th USENIX Security Symposium                                                                 USENIX Association
             0.8                                                                          1                                                  1

             0.6                                                                         0.8                                                0.8
Similarity



             0.4                                                                         0.6                                                0.6




                                                                                                                                      CDF
                                                                                   CDF
                                                                                         0.4                                                0.4
             0.2
                                                                                         0.2                                                0.2
              0
                   1    3            5           7       9   11 13 15                     0                                                  0
                                                                                               0        5        10         15                    2      4      6       8       10
                       Number of words masked
                                                                                                   Number of words masked                             Number of masking fonts
Figure 2: Similarity scores relative
                                                                                   Figure 3: Word masking require-                    Figure 4: Masking font require-
to amount of words masked. Blue
                                                                                   ments for all 100 testing papers.                  ments for all 100 testing papers.
stars show the desired matching.

                                               100
                                                                                                                5     Content Masking Attack Against Plagia-
                            Number of papers




                                                80                                                                    rism Detection
                                                60
                                                                                                                While a method similar to the topic matching subver-
                                                40
                                                                                                                sion technique just outlined may be used to hide plagia-
                                                20                                                              rism, fewer requirements constrain the plagiarist than the
                                                 0                                                              lazy author targeting a specific reviewer in a conference.
                                                     0             50                100
                                                                                                                Specifically, an attacker needs only make the underlying
                                                         Number of masking fonts
                                                                                                                text different than the rendered, plagiarized text. The un-
Figure 5: Masking font requirements for matching from                                                           derlying text does not need to be actual words, and so
1 to all 100 testing papers to a single reviewer.                                                               only one font is needed, ensuring the naive defense of
                                                                                                                limiting fonts is defeated. This scrambling font is just a
                                                                                                                random scrambling of the characters. Each original letter
                                               0.8                                                              is replaced with the letter which displays as the original.
                                                                                                                Resulting is a human-legible PDF document which ap-
                                               0.6                                                              pears as gibberish to Turnitin and necessarily has a sim-
                            Similarity




                                                                                                                ilarity score of 0%. Details and options for this method
                                               0.4
                                                                                                                are below, followed by an evaluation of each option.
                                               0.2

                                                0                                                               5.1    Targeting a Specific Plagiarism Score
                                                     1 10 20 30 40 50 60 70 80 90
                                                         Number of words masked                                 Because Turnitin is a similarity checker, not a plagiarism
                                                                                                                detector, it relies on the human factor to actually detect
Figure 6: Similarity scores relative to amount of words
                                                                                                                plagiarism. Turnitin informs the individual with grad-
masked, between a paper and three reviewers. Blue
                                                                                                                ing duties of any pieces of similar prose, which naturally
stars, black circles, and green triangles show the desired
                                                                                                                arise due to the plethora of written work in existence and
matchings.
                                                                                                                the human tendency toward common patterns and figures
                                                                                                                of speech. It is unlikely then, and would stand out to
                                                                                                                the grader, that a submission would have 0% similarity
                                                                                                                with anything ever written. We offer and evaluate two
fewer overall fonts used. Figure 5 confirms this, show-
                                                                                                                methods an attacker can use to target a specific (low but
ing a trend more logarithmic than linear.
                                                                                                                non-zero) similarity score and more likely go unnoticed.
   Matching a paper to multiple reviewers: Finally, we                                                             By Letter: Here, the attacker begins with a scram-
evaluate the iterative refinement method to split masked                                                        bling font and removes characters from being scrambled
words among three reviewers’ papers as discussed in                                                             successively until a target percentage of the text is not
Section 4.3. Figure 6 shows that the similarity scores                                                          being replaced. Intuitively, this small target percentage
for the three target reviewers (blue star, black circle,                                                        would then appear plagiarized, yielding a credible simi-
and green triangle) consistently increase; after some 70                                                        larity score. This may be done in a calculated fashion us-
words masked, the subject paper is more similar to the                                                          ing the known frequency of usage of letters in the English
three target papers than any others.                                                                            (or other) language. The letters may be listed by their



USENIX Association                                                                                                               26th USENIX Security Symposium                  839
                       1                                             curve that is too steep to be manageable for selecting a
                                         Frequency descending
                                         Random replacment           small range of similarity scores. In contrast, the other
                      0.8                Letter usage descending
                                                                     two methods are very suitable for comfortably picking a
         Similarity
                      0.6                                            specific range. Any probability between 17% and 20%
                                                                     will net a similarity score in our desired 5-15% range in
                      0.4                                            the case of randomly chosen masking. When words are
                      0.2
                                                                     replaced in order of their frequency of appearance, the 5-
                                                                     15% range may be achieved by replacing anywhere be-
                       0
                            0   0.1      0.2        0.3        0.4
                                                                     tween 20 and 40% of the words, offering a very wide
                                      Percentage                     range of safety for the plagiarist.
Figure 7: Effects of the percentage of text changed upon
plagiarism similarity scores for 10 sample documents.                6     Document Indexing Subversion
                                                                     The final direction of this attack is against search en-
frequency in ascending or descending order (we evaluate              gines, whether for the entire web or for small document
both) and then excluded from scrambling in that order                repositories or websites. Websites can implement a sim-
until the target percentage of unaltered text is reached.            ple search returning pages housing the query text, or they
   By Word: This method is similar to the previous, but              can use custom search engines offered by Google [25] or
instead of leaving some characters unscrambled in the                Yahoo! [26]. Microsoft Bing also offers its API [27].
custom font, the attacker leaves some words unaltered by             As small sites are unlikely to have a more sophisticated
not applying the custom scrambling font to them. Here,               search mechanism than the leading search engines, we
words within the document may be listed in frequency                 target and demonstrate our attack against these.
of appearance, ascending or descending, and excluded
from the scrambling font in that order (we again evaluate            6.1    Method
both). We also consider changing words at random with a
probability targeting some similarity score. This method             We here consider modifying the entire content of a PDF
may be more effective for an attacker in the long run, if            to render as something else. Both the underlying text
Turnitin implements a requirement that some percentage               extracted by PDFMiner (or otherwise) and the rendered
of words be found in a dictionary, English or otherwise.             text should make sense in this case, so that an individual
In that case, this attack may be augmented by the previ-             searching for certain terms will be caused to find a PDF
ously described method of replacing real words for other             holding those words but displaying something entirely
real words rendered as the originals.                                different. This results in a more extreme version of the
                                                                     one-to-many character mapping challenge from the at-
                                                                     tack against topic matching. Instead of masking a small
5.2   Experiment
                                                                     finite number of words, we now examine masking the en-
We use 10 already published papers retrieved from the                tire content. However, this is facilitated by the realization
Internet and mask the content in varying degrees to see              that these masks are not necessarily delineated by spaces
the effects on Turnitin’s returned similarity scores. We             as before; the attacker can treat the entire document as
vary the amount a scrambling font is applied to the text             a single word to be masked. It consequently encounters
according to the previously described methods and up-                the word length disparity challenge, to treat the variation
load the resultant papers to Turnitin. Again, we target a            in length between real and rendered text, but only once.
specific range of similarity scores, between 5% and 15%,                Nevertheless, the strategy of adding new fonts, ad hoc,
such that a human grader is unlikely to suspect foul play.           to cover each new mapping quickly balloons out of con-
   Figure 7 plots the three methods. “Frequency descend-             trol, in terms of the attacker needing to keep track of what
ing” refers to the method of masking words in the order              mappings appear in what font. The number of fonts will
of their frequency of appearance in the document, while              increase with the number of characters to be masked, to
“Letter usage descending” refers to masking letters by               an upper limit of every character needing a map to every
their frequency of usage. Ascending order proved un-                 other. Considering (for English) upper and lower case
wieldy in both cases and not worth displaying. Finally,              letters, numbers, and common punctuation (22 symbols,
“Random replacement” refers to the method of iterating               dependent upon count), all 26 + 26 + 10 + 22 = 84 char-
over all words and masking them with a probability of                acters must each map to the other 83 different characters,
1-100% in increments of 1%. These are all plotted in                 as well as themselves for those cases which a character
terms of the percentage of text changed. Masking let-                and its mask are the same. This requires 84 fonts and
ters by their frequency of usage results in a similarity             represents 842 = 7056 mappings. Code can certainly be



840   26th USENIX Security Symposium                                                                       USENIX Association
       Search Engine     Indexed Papers     Attack Successful     Evades Spam Detection        Not Later Removed
          Google               3                    7                       7                          7
           Bing                3                    3                      3                           3
          Yahoo!               3                    3               Flagged / Cleared                  3
       DuckDuckGo              3                    3                      3                           3

                             Table 1: Results of content masking attack on search engines.



written to automatically construct all these mappings, but
to make this more efficient, we offer an alternative - 84
fonts, in each of which all characters map to one masking
character. For example, in font “MaskAsA” character a
maps to a, b to a, 4 to a, ! to a, etc. To mask a document
as another, the attacker may simply apply fonts, charac-
ter by character, that correspond to the desired mask. At
the end of the documents, the three end behavior options
presented as part of Algorithm 1 and illustrated in Figure
                                                                                   (a) Gibberish paper
1 function here as well, to handle the length variation.

6.2    Experiment
To demonstrate the efficacy of this attack, we obtained
a handful of well-known academic papers, masked their
content, and then placed them on one author’s university
website to be indexed by several leading search engines.
For this simple proof of attack, we only used one mask-                   (b) Bing result for the gibberish paper
ing font which scrambled the letters for rendering. The
resulting papers have legible text that renders to gibber-
ish, meaning that if they can be located by searching for
that legible text, the search engine is fooled.
   We submitted the site housing these papers to Google,
Bing, and Yahoo! and searched for them some days
later. Search engine DuckDuckGo does not accept web-
site submissions but we searched there as well. Table 1               (c) DuckDuckGo result for the gibberish paper
lists the results of our content masking attack on these
search engines. “Indexed Papers” indicates the search
engine listed the papers in its index. “Attack Successful”
means they are indexed using the underlying text, not
the rendered gibberish. After a successful attack, the pa-
pers may later be put behind a spam warning or removed
from the index, as shown in the last two columns. We
                                                                         (d) Yahoo! result for the gibberish paper
found similar results for each of the 5 papers tested: that
Bing, Yahoo!, and DuckDuckGo all indexed the papers
according to the masked legible text, and none removed
them later (at time of writing). Yahoo! did mark them as
spam after two days but confusingly some days after that
removed the spam warning.
   Figure 8 illustrates this for one of tested paper. The                  (e) Temporary Yahoo! spam warning
masked paper is shown in Figure 8a and contains no ren-
dered English words beyond what is shown. Figures 8b,           Figure 8: Results of the content masking attack against
8c, and 8d show the search results for the legible underly-     popular search engines. The attack was not successful
ing text, and Figure 8e shows the spam warning appear-          against Google.
ing days later but later disappearing. Each query was



USENIX Association                                                             26th USENIX Security Symposium         841
appended with “site:XXX.edu” to isolate the university         OCR can distinguish and how to handle those it can’t.
website where they are hosted for this proof of concept.       Theoretically, OCR may mature to the point where it can
   Interestingly, Google indexed the papers, but accord-       distinguish any sort of accent mark over normal letters,
ing to the rendered gibberish, not the underlying text.        any characters used in languages other than English, and
This indicates, of these four engines, only it performs        any additional special characters used in typeset mathe-
OCR on PDF files it indexes rather than extracting the         matics, etc., and some OCR software may be currently
text through PDFMiner or the like. After two days, the         in development working on a subset of these problems.
papers were removed from Google’s index, before the            However, we aim to provide a defense method readily in-
authors obtained screenshots. We conclude that Google          tegrable into current systems. Additionally, such an ad-
has a robust defense against the content masking attack,       vanced software will likely incur overhead beyond that
while the other three engines remain susceptible.              of a current OCR package to achieve the requisite preci-
                                                               sion, where our solution must be sufficiently lightweight
                                                               to fit within systems where full-document OCR has not
7     Defense Against Content Masking
                                                               been applied due to computational complexity. We de-
As intoned through this paper, Optical Character Recog-        fine a normal set of character codes as those represent-
nition (OCR) is able to move the text extraction process       ing upper and lowercase English letters, numbers, and
from targeting the underlying text to the rendered ver-        common punctuation, which English OCR packages tar-
sion, preventing this masking attack. OCR is required          get, and then we check if the extracted character codes
for print documents scanned to PDF, but for documents          appear in this normal set or not. A letter in the normal
with rendered text, system designers have been loath to        set appearing as something other than itself is evidence
use OCR in lieu of PDFMiner or its ilk. OCR is far more        of the content masking attack, as is a letter outside the
complex and requires more processing time than simply          normal set having the glyph of one inside. OCR is per-
running the PDF file through a lightweight parser to col-      formed on all used characters in the font, as previously
lect its strings. We propose here a lightweight font veri-     mentioned, and those within the normal set are required
fication method that enables the use of OCR in a highly        to have the correct respective glyph, while those outside
efficient way to prevent the content masking attack. The       the normal set are constrained not to have a distinguish-
intuition is simple; we render each character in the fonts     able glyph (i.e. one appearing in the normal set).
embedded in the subject PDF file and then perform OCR             The third issue arises with the fact that many special
on those characters rather than the rendered PDF file it-      characters have high similarity with normal characters,
self. Where an academic paper may be some 50,-75,000           especially for those fonts in common use which have
characters, the fonts embedded therein usually contain at      many thousands of available characters. If one such spe-
most just a couple hundred characters.                         cial character is used legitimately in the text, the scheme
   Challenges and Technical Details: While the intu-           just described will flag it as a content masking attack
ition is simple, some challenges arise in its realization.     due to its similar appearance with a normal set character.
First, while most PDF generation tools will embed only         Worse, common OCR tools available presently will con-
those letters used in the document, it is possible through     flate characters which humans can easily tell apart but
Adobe InDesign, as one example, to embed the whole             for which the software is not precise enough to do so.
font. Some fonts accommodate many characters used in           For example, it is easy to tell visually that π and n are
many other languages, and the upper limit on font char-        different characters, but not by common OCR tools.
acter capacity is 216 = 65, 536 because characters have           Font Training Step: We therefore introduce a training
a two-byte index. Clearly, performing OCR on a font of         step, wherein OCR is performed on the font and lists of
that size will be equivalent to performing OCR on an aca-      intersections compiled. When we perform OCR on each
demic paper in terms of computational overhead. Conse-         represented character and the detected glyph for a spe-
quently, we scan the document to extract the characters        cial character but appears like a normal letter, we check
used, and only render those characters (in their respective    the list of characters similar to that normal letter. If the
fonts) for OCR verification. This requires iterating over      special character appears on that list, we recognize that it
the entire document, but the overhead introduced here is       may be valid and that we cannot know if it is being used
much less than with full-document OCR, as the process          legitimately or as part of a content masking attack. As
just builds a list from the series of character codes rather   the purpose of the content masking attack is to disguise
than executing image processing techniques on all char-        the visually rendered text as some other text for the com-
acter glyphs. OCR is then performed on the series of           puter to see, we simply replace the extracted character
character codes used in each font only.                        code for this letter as the normal letter it looks like, and
   Second, the existence of many special characters            pass this on to the end application. If content masking
within a font prompts the question of what characters          is occurring, the rendered text is sent to the plagiarism



842    26th USENIX Security Symposium                                                                USENIX Association
detector, reviewer assignment system, etc., thwarting the        Algorithm 2 Extract Rendered Text
attack. Otherwise, the string in which this special charac-      Input: font list F = { f1 , f2 , ..., f p }, normal character
ter appears is with high probability not an English word             index set N = {n1 , n2 , ..., nq }, special character in-
and would not be useful to the end application anyway. A             dex set S = {s1 , s2 , ..., sr }, document character list
reviewer assignment system or plagiarism detector will               D = {d1 , d2 , ..., ds }
not make use of mathematical equations when assigning            Output: extracted text T = {t1 ,t2 , ...,ts }
reviewers, as these are not discernible words, so if πr2 is       1: Unique character index/font map list U = 0/
extracted as nrz , no loss of function is suffered.               2: for i ← 1 to s do
                                                                  3:     if di ∈ / U then
   This training solution prompts one further issue,              4:           U ← U ∪ (di , FONT(di ))
which is that different fonts will need to be trained in-         5: m ← |U|
dependently as their nuances cause different sets of char-        6: OCR-extracted            character index set O =
acters to appear similar. For the reviewer assignment and            {o1 , o2 , ..., om }
plagiarism detection problems, we know a limited num-             7: for i ← 1 to m do
ber of fonts should be used, due to academic formatting           8:     oi ← OCR(ui )
requirements favoring a small set of fonts. Nevertheless,         9:      f ← ui . f ont
for other applications, such as search indexing, the only        10:     L ← list of similar character lists {l1 , l2 , ..., lv }
limit on the number of fonts that can be trained is that             for f
those fonts must be legible enough for an OCR tool to            11:     if ui .index ∈ N then
parse. These lists do not occupy too much space; for ex-         12:           if oi 6= ui .index then       . Attack Detected
ample our lists for Times New Roman and Arial fonts are          13:                 break
29.4KB and 36.2KB, respectively. This database com-              14:     else if ui .index ∈ S then
piled, the OCR tool will be used to discern the real name        15:           if ui .index ∈ loi then       . Attack Possible
of each font used in the document, to counteract the prob-       16:                 ui ← oi
lem mentioned early in this paper, that an attacker may          17:           else                          . Attack Detected
name a font anything desired. Open source OCR tools              18:                 break
such as Tesseract OCR [28] provide this functionality.           19: T ← Apply modified U to D
                                                                 20: return T

   Font Verification Overview: The training process be-
gins by gathering a collection of fonts and training the            Font Verification Performance: The implementation
system on each. For each character in a font’s normal set,       for this defense method is written in Python and employs
all special characters are tested for OCR similarity, and        PDF-Extract [29] to extract font files from PDFs, tex-
any identified as similar are added to the list for that nor-    tract [30] to extract the text strings, and pytesseract [31],
mal character. Testing a new PDF file is outlined in Al-         a Python wrapper for Tesseract OCR [28]. The alterna-
gorithm 2, wherein the list of characters and their fonts is     tive to our font verification method is to perform OCR
reduced to unique combinations of those attributes, and          on the entire document, so we use Tesseract OCR for
each then tested with OCR. Content masking attacks are           this purpose also for a fair comparison. This comparison
detected in lines 12 and 17 when the underlying char-            will illustrate not only that our method detects/mitigates
acter index is a normal character other than the OCR-            the content masking attack as well as the naive full docu-
extracted character or when the underlying character in-         ment OCR method, but that it performs far better in sev-
dex is a special character that does not appear in the simi-     eral scenarios common to PDFs both in and out of the
larity list for the OCR-extracted character. In these cases,     presence of our content masking attack.
this pseudocode exits to notify of the attack, though other         First, we compare the performance of the two meth-
behavior could be inserted here. This protects all end           ods with differing amounts of masked content. We gen-
applications, except in the attack against plagiarism de-        erate 10 PDF files with masked characters varying from
tection in which the attacker replaces normal characters         5-20% in frequency of appearance, and apply both meth-
with special characters similar in appearance. That spe-         ods to each of these file. The results are shown in Fig-
cific attack is identified as possible at line 15, in the case   ure 9 and show a distinct benefit to our font verifica-
that the underlying character is a special character which       tion method compared with the traditional full document
does appear in the similarity list for the OCR-extracted         OCR. Here, detection rate refers to the correct extraction
character; in this case all instances of this character in the   of rendered text and the consequent ability to prevent the
text extracted from this file are replaced with the OCR-         content masking attack from occurring. For full docu-
extracted character for use in the end application.              ment OCR, we generate 10 PDF documents with no con-



USENIX Association                                                                26th USENIX Security Symposium            843
                                                                                                                                     50
                                                                                                                                          Full document OCR




                                                            Detection rate (%)
Detection rate (%)
                     100                                                         100                                                      Font verification
                                                                                                                                     40




                                                                                                                           Seconds
                      50                                                                                                             30
                                                                                  90
                                                                                                                                     20
                       0
                            Full document OCR                                     80   Full document OCR                             10
                            Font verification                                          Font verification
                                                                                                                                     0
                       20    17     14    11    8   5                                  2     4      6      8   10                           5        10       15   20
                       Percentage of masked characters                                     Number of pages                                      Number of pages

Figure 9: Attack detection under                            Figure 10: Attack detection on                                 Figure 11: Attack detection time
varying degrees of attack.                                  PDFs of different sizes.                                       relationship with PDF size.


tent masking and measure the error in character recog-                                               the previous experiment, additional pages of text steadily
nition, and then we use this error as a threshold, such                                              allow more masked text to go unnoticed. The font verifi-
that the attack is flagged for one of the content masked                                             cation appears to be 100% throughout, but actually dips
PDF files if it is determined to have a larger difference                                            to 99.8% halfway through. Our method is not immune
between characters and their glyphs. That threshold was                                              to the errors inherent to OCR as it also uses OCR, but its
measured at 7%, and more than 20% of characters had                                                  more judicious approach minimizes those errors. In this
to be masked before the full document OCR method de-                                                 case, OCR is confusing the ’;’ and ’:’ characters; these
tected the content masking attack (after this, detection                                             are rare but eventual in prose.
was 100%). The attack is considered detected by the                                                     Finally, we demonstrate the performance gain of our
font verification method if Algorithm 2 flags it or the                                              font verification method over the full document OCR
edge case approach we take of replacing special char-                                                method, on 20 PDF files ranging from 1-20 pages in
acters that look like normal letters with those normal let-                                          length and having a 30% distribution of masked char-
ters will enable the end application (plagiarism/spam de-                                            acters. In Figure 11, the full document OCR method in-
tector) to process the text properly and thereby flag the                                            creases linearly with pages added while the font verifi-
attack. In all cases, our algorithm detected the attack or                                           cation method unsurprisingly remains largely static, in-
constructed the proper English words required by the end                                             creasing by roughly a second compared to the 45 expe-
application to detect it.                                                                            rienced by the full document OCR method. In all, our
   The disparity here between the methods’ accuracy in                                               method requires about 6 seconds to check a 20 page doc-
the 5-20% character masking range has a few aspects in-                                              ument, rather than 50 seconds, using one core on a laptop
volved. Fewer masked characters will appear in a sparser                                             processor (Intel i7 at 2.7GHz). This provides far better
distribution, which make them less visible among legit-                                              scalability for the target systems than the alternative, and
imate characters. OCR is affected by the distance be-                                                is easily applied to current systems without requiring up-
tween characters and the resolution of the image, among                                              grades.
other things, which we can control in the case of font
verification but which are not controlled when perform-
                                                                                                     8     Related Work
ing OCR over an entire document. We can generate an
optimal image of all relevant characters, check their va-
                                                                                                     Most exploit research targeting the PDF standard has
lidity, flag detected attacks, and in the case of special
                                                                                                     been in bugs surrounding various programs rendering,
characters which appear identical to normal letters, re-
                                                                                                     displaying, exporting, or otherwise handling PDF docu-
place them with those normal letters for proper use in the
                                                                                                     ments. The not-for-profit MITRE Corporation lists in its
end application.
                                                                                                     Common Vulnerabilities and Exposures (CVE) collec-
   We also analyze the effects of document length on the                                             tion 431 entries involving the keyword “PDF” and having
detection rate for each method, by comparing their re-                                               to do with these external programs [5]. These allow for
sults on 10 PDF files ranging from 1-10 pages in length                                              arbitrary code execution on the host computer and all the
and having an even 30% distribution of masked charac-                                                associated security risks [6], including establishment of
ters. Figure 10 illustrates that while the font verification                                         botnets, data exfiltration, and other high-impact security
method is almost perfectly static, full document OCR                                                 issues. They are, however, limited to basic hacking-type
gradually performs more poorly, reaching 14% misde-                                                  exploits, zero-days chased by patches, and the PDF itself
tection by page 10. The aforementioned OCR error rate                                                is essentially a vehicle for the hack [7]. These attacks are
explains this problem, where while 30% masked charac-                                                not thematically novel, and the patches indeed follow the
ters is above the required 20% to guarantee detection in                                             zero-days with reasonable speed [8].



844                        26th USENIX Security Symposium                                                                                           USENIX Association
   Similarly, some exploration has been performed on              Section 2 introduces the Character Map (CMap),
the JavaScript execution ability within the PDF standard.      through which letters are mapped to entries within fonts,
When abused, this too allows for arbitrary code execu-         ultimately displaying the associated glyphs. During our
tion. Security researcher Didier Stevens offers a series       literature search, we found a work [13] from a social
of blogs discussing how to misuse this JavaScript exe-         science journal of Assessment & Evaluation in Higher
cution, including how to encode the strings involved to        Education which touches on a similar topic from a non-
create polymorphic malware resisting simple signature-         scientific stance. [13] discusses how the CMap can be
based antivirus products [32]. Some research finds             altered to make letters map to different characters within
that writing polyglots (code valid in multiple languages)      a font. In this way, plagiarism detection can be fooled
within PDFs can expose security concerns depending on          by mapping to obscure characters whose glyphs are sim-
what language the reader uses to interpret the code [2].       ilar in appearance to those for the typically used charac-
Successive updates to the PDF standard implement mea-          ters. After devising our attacks, we discovered this work
sures to block certain functions, such as reaching out to      also contains cursory mention of the ability to modify the
the Internet, placing their function behind a confirmation     glyphs within a font, but does not explore this possibility
window for the user to view [12]. Additionally, most cur-      or demonstrate its practicality as we do. We evaluate new
rent antivirus products offer real-time protection using       methods to target specific similarity scores such that the
heuristics that can detect potentially malicious behaviors     resultant PDF does not appear unnatural with a 0% sim-
despite simple code obfuscation.                               ilarity score. Further, we show how these custom fonts
   Some academic research regarding PDF security ana-          can be used to subvert conference reviewer-assignment
lyzes the JavaScript being executed to verify safety. One      systems and search indexing, developing new and dis-
work analyzes a set of static features extracted from the      tinct attack methods specific to each of these very dif-
PDF, and then instruments with context monitoring code         ferent targets. Additionally, we provide a robust defense
the JavaScript within. This combination static and run-        method, including a defense against the slightly differ-
time approach is tested on a collection of 18623 PDF           ent attack proposed in [13] involving the use of existing
documents without malware and 7370 with, resulting in          characters similar in appearance to normal letters.
few false negatives and no false positives [1]. Other
research targets attacks not dependent on JavaScript or
other parsing vulnerabilities, including one that works to
detect these attacks using machine learning on existing        9   Conclusion
flagged PDF files using data extracted from the structure
of the file as well as its content [3]. One may expect         In this paper, we have presented a new class of content
this strategy to suffer from the same difficulties experi-     masking attacks against the Adobe PDF standard. Af-
enced by signature-based antivirus products, namely an         ter creating algorithms for each of three content mask-
inability to detect malware not already discovered by re-      ing attack variants, we perform a comprehensive evalu-
searchers. Another work allows PDF documents to be             ation showing that each lives up to its theory and oper-
opened in an emulated environment to track how they            ates in present state-of-the-art systems. Our first attack
behave before doing so in the host environment [4].            allows academic paper writers and reviewers to collude
   Some works slightly closer to ours examine the pos-         via subverting the automatic reviewer assignment sys-
sibility of causing PDF documents to be rendered differ-       tems in current use by academic conferences including
ently on different computers, showing how to restrict the      INFOCOM, which we simulated. This requires no visi-
syntax of the PDF standard to prevent this from occur-         ble changes to the paper being reviewed and the addition
ring [33] [34]. This attack against data consistency has       of just 3-5 custom masking fonts for almost all of the 100
some vague similarity to the concept of content mask-          papers tested, easily lost in any paper’s natural fonts. We
ing - displaying different content for the human than the      show a second attack that renders ineffective plagiarism
machine. However, we provide several real-world exam-          detection software, particularly Turnitin, to the point of
ples of how our content masking attack can subvert real        being able to target specific small plagiarism similarity
systems, while the impact of the attack in this work is rel-   scores to appear natural and evade detection. In our fi-
atively limited to the document looking different to hu-       nal attack, we successfully place masked content into the
mans using different computers. Some works [35] [36]           indexes for Bing, Yahoo!, and DuckDuckGo which ren-
[37] examine poisoning search results, but this is from        ders as information entirely different from the keywords
the perspective of presenting false data to the machine        used to locate it. Lastly, we provide and test a robust font
through website code or manipulations of the PageRank          verification algorithm which is more accurate than full
algorithm via botnets, an existing threat vector for which     document OCR and requires considerably less computa-
defenses have been continually adapting.                       tion power.



USENIX Association                                                             26th USENIX Security Symposium         845
References                                                   [13] J. Heather, “Turnitoff: Identifying and Fixing a
                                                                  Hole in Current Plagiarism Detection Software,”
 [1] D. Liu, H. Wang, and A. Stavrou, “Detecting Mali-            Assessment & Evaluation in Higher Education,
     cious Javascript in PDF through Document Instru-             vol. 35, no. 6, pp. 647–660, 2010.
     mentation,” in 2014 44th Annual IEEE/IFIP Inter-
     national Conference on Dependable Systems and           [14] S. T. Dumais, G. W. Furnas, T. K. Landauer,
     Networks, pp. 100–111, June 2014.                            S. Deerwester, and R. Harshman, “Using Latent
                                                                  Semantic Analysis to Improve Access to Textual
 [2] J. Magazinius, B. K. Rios, and A. Sabelfeld, “Poly-          Information,” in Proceedings of the SIGCHI Con-
     glots: crossing origins by crossing formats,” in Pro-        ference on Human Factors in Computing Systems,
     ceedings of the 2013 ACM SIGSAC conference on                CHI ’88, (New York, NY, USA), pp. 281–285,
     Computer & communications security, pp. 753–                 ACM, 1988.
     764, ACM, 2013.
                                                             [15] M. D. Blei, A. Y. Ng, and M. I. Jordan, “Latent
 [3] D. Maiorca, D. Ariu, I. Corona, and G. Giacinto,             Dirichet Allocation,” Journal of machine learning
     “A structural and content-based approach for a pre-          research, vol. 3, no. Jan, pp. 993–1022, 2003.
     cise and robust detection of malicious PDF files,”
     in 2015 International Conference on Information         [16] L. K. Pritchard, M. Stephens, and P. Donnelly, “In-
     Systems Security and Privacy (ICISSP), pp. 27–36,            ference of Population Structure Using Multilocus
     Feb 2015.                                                    Genotype Data,” Genetics, vol. 155, no. 2, pp. 945–
                                                                  959, 2000.
 [4] F. Schmitt, J. Gassen, and E. Gerhards-Padilla,
                                                             [17] “Student   Paper   Migrations.”  https:
     “PDF Scrutinizer: Detecting JavaScript-based at-
                                                                  //guides.turnitin.com/01_Manuals_and_
     tacks in PDF documents,” in Privacy, Security and
                                                                  Guides/Administrator/Administrator_
     Trust (PST), 2012 Tenth Annual International Con-
                                                                  User_Guide/22_Student_Paper_Migrations,
     ference on, pp. 104–111, July 2012.
                                                                  2016.
 [5] MITRE Corporation,     “CVE - Common
                                                             [18] “How    Search   Works:      Algorithms.”
     Vulnerabilities and    Exposures (CVE).”
                                                                  https://www.google.com/insidesearch/
     https://cve.mitre.org/cgi-bin/cvekey.
                                                                  howsearchworks/algorithms.html, 2016.
     cgi?keyword=pdf, 2016.
                                                             [19] S. Brin and L. Page, “Reprint of: The Anatomy of
 [6] K. Selvaraj and N. F. Gutierrez, The Rise of PDF
                                                                  a Large-Scale Hypertextual Web Search Engine,”
     Malware. Symantec, Recurity Response, 2010.
                                                                  Computer networks, vol. 56, no. 18, pp. 3825–
 [7] R. Brandis and L. Steller, Threat Modelling Adobe            3833, 2012.
     PDF. DSTO Defence Science and Technology Ori-           [20] “PDFs in Google Search Results.” https:
     ganisation, 2012.                                            //webmasters.googleblog.com/2011/09/
 [8] Adobe Security, PDF Security Reaches New Lev-                pdfs-in-google-search-results.html,
     els with Adobe Reader XI and Adobe Acrobat XI.               2011.
     Adobe, 2013.                                            [21] G. Williams, “FontForge.” https://fontforge.
                                                                  github.io/, 2017.
 [9] B. Li and Y. T. Hou, “The New Automated IEEE
     INFOCOM Review Assignment System,” IEEE                 [22] J.  Berkenbilt,   “QPDF.”          http://qpdf.
     Network, vol. 30, no. 5, pp. 18–24, 2016.                    sourceforge.net/, 2015.
[10] “Submitting a Paper.” https://guides.                   [23] J. Zhao, “Custom Fonts in Latex.” http://math.
     turnitin.com/01_Manuals_and_Guides/                          stanford.edu/~jyzhao/latexfonts.php,
     Student/Classic_Student_User_Guide/09_                       2012.
     Submitting_a_Paper, 2016.
                                                             [24] E. L. Bird, Steven and E. Klein, Natural Language
[11] Y. Shinyama, “PDFMiner.” https://euske.                      Processing with Python. OReilly Media Incorpo-
     github.io/pdfminer/, 2013.                                   rated, 2009.

[12] Adobe, PDF Reference. Adobe Systems Incorpo-            [25] Google, “Custom Search Engine.” https://cse.
     rated, 2006.                                                 google.com/cse/, 2016.



846   26th USENIX Security Symposium                                                            USENIX Association
[26] Yahoo!, “BOSS Hosted Search.” https://boss.
     yahoo.com/hosted-web-search, 2016.
[27] Microsoft, “Bing Search API.” https:
     //datamarket.azure.com/dataset/
     5BA839F1-12CE-4CCE-BF57-A49D98D29A44,
     2016.
[28] R. Smith and Z. Podobny, “Tesseract OCR.”
     https://github.com/tesseract-ocr, 2017.
[29] K. J. Ward and V. Costan, “PDF-Extract.” https:
     //github.com/CrossRef/pdfextract, 2015.
[30] D. Malmgren, “textract.” https://textract.
     readthedocs.io/en/stable/, 2014.
[31] S. Hoffstaetter, J. Bochi, and M. Lee, “pytesser-
     act.”        https://pypi.python.org/pypi/
     pytesseract/0.1, 2014.
[32] D. Stevens, “PDF, Let Me Count the Ways
     .” https://blog.didierstevens.com/2008/
     04/29/pdf-let-me-count-the-ways/, 2008.

[33] G. Endignoux, O. Levillain, and J. Y. Migeon,
     “Caradoc: A Pragmatic Approach to PDF Parsing
     and Validation,” in 2016 IEEE Security and Privacy
     Workshops (SPW), pp. 126–139, May 2016.
[34] J. Wolf, “Omg wtf pdf,” 2010.

[35] N. Leontiadis, T. Moore, and N. Christin, “A nearly
     four-year longitudinal study of search-engine poi-
     soning,” in Proceedings of the 2014 ACM SIGSAC
     Conference on Computer and Communications Se-
     curity, pp. 930–941, ACM, 2014.

[36] D. Y. Wang, S. Savage, and G. M. Voelker, “Juice:
     A longitudinal study of an seo botnet.,” in NDSS,
     2013.
[37] K. Du, H. Yang, Z. Li, H. Duan, and K. Zhang,
     “The ever-changing labyrinth: A large-scale anal-
     ysis of wildcard dns powered blackhat seo,” in
     25th USENIX Security Symposium (USENIX Secu-
     rity 16), USENIX Association.




USENIX Association                                         26th USENIX Security Symposium   847
