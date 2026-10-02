---
type: Article
title: Measuring and Analyzing Search Engine Poisoning of Linguistic Collisions
description: "Misspellings that happen to be real words, often in another language, slip past search engines' auto-correction, so attackers can rank malicious pages against those queries. A crawl of 1.77 million misspelled searches on Google and Baidu, with a neural model to pick candidates, finds about 1.19 percent return malicious first-page results, concentrated in gambling, drugs and adult terms."
resource: "https://doi.org/10.1109/SP.2019.00025"
tags: [article, webseclist-reference, doi-org, typosquatting, measurement-study, large-scale-scan, detection, owasp-a06-2021, owasp-a09-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T21:05:34+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://doi.org/10.1109/SP.2019.00025"
    title: Measuring and Analyzing Search Engine Poisoning of Linguistic Collisions
    author: Matthew Joslin, Neng Li, Shuang Hao, Minhui Xue, Haojin Zhu
also_at: []
authors:
  - Matthew Joslin
  - Neng Li
  - Shuang Hao
  - Minhui Xue
  - Haojin Zhu
canonical_url: ""
cited_by:
  - "2019.md:81"
commit: ""
content_sha256: 7bf379c853c9c766dc6596e73a41e8b9fcb314b196d0731a4edf584094de412d
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://doi.org/10.1109/SP.2019.00025"
published: ""
publisher: doi.org
publisher_english: ""
raw_sha256: f165aff35386eb570171f7b352a0f759a04d217ab7fd57f0e649c5771bc90496
retrieved_from: "https://doi.org/10.1109/SP.2019.00025"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T21:05:34+00:00"
slug: doi-org-measuring-analyzing-search-engine-poisoning-linguistic-collisions
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Measuring and Analyzing Search Engine Poisoning of Linguistic Collisions

**Measuring and Analyzing Search Engine Poisoning of Linguistic Collisions** - Matthew Joslin, Neng Li, Shuang Hao, Minhui Xue, Haojin Zhu, doi.org.

- Published: date not stated
- Original: <https://doi.org/10.1109/SP.2019.00025>
- Preserved from: https://doi.org/10.1109/SP.2019.00025 (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Measuring and Analyzing Search Engine Poisoning of Linguistic Collisions

2019 IEEE Symposium on Security and Privacy


  Measuring and Analyzing Search Engine Poisoning
              of Linguistic Collisions
                            Matthew Joslin∗ , Neng Li† , Shuang Hao∗ , Minhui Xue‡ , Haojin Zhu†
                  ∗ University of Texas at Dallas            † Shanghai Jiao Tong University              ‡ Macquarie University

                  {matthew.joslin, shao}@utdallas.edu              {ln-fjpt, zhu-hj}@sjtu.edu.cn          minhuixue@gmail.com


    Abstract—Misspelled keywords have become an appealing          engines, including Google and Baidu, have taken multiple
 target in search poisoning, since they are less competitive to    actions, ranging from displaying warning messages to bring
 promote than the correct queries and account for a consid-        users’ attention when there are potential misspellings in the
 erable amount of search trafﬁc. Search engines have adopted
 several countermeasure strategies, e.g., Google applies automated search queries, to automatically returning search results of the
 corrections on queried keywords and returns search results of     correct versions. As shown in Figure 1(a), suppose a user makes a
 the corrected versions directly. However, a sophisticated class   misspelled search for adoeb on Google (misspelling of adobe).
 of attack, which we term as linguistic-collision misspelling, can The search is automatically changed to adobe (the correct
 evade auto-correction and poison search results. Cybercriminals   search term) and the user will not receive any search result for
 target special queries where the misspelled terms are existent
 words, even in other languages (e.g., “idobe”, a misspelling of   the misspelled input. However, adversaries crave to continue
 the English word “adobe”, is a legitimate word in the Nigerian    preying on the misspelled query trafﬁc that users generate. Even
 language).                                                        large vendors attempt to leverage misspelled keywords. For
    In this paper, we perform the ﬁrst large-scale analysis on     example, Amazon used misspellings to advertise products on
 linguistic-collision search poisoning attacks. In particular, we  their website [7], and Snickers targeted misspelled keywords
 check 1.77 million misspelled search terms on Google and Baidu
 and analyze both English and Chinese languages, which are         in the “You are Not You When You’re Hungry” advertisement
 the top two languages used by Internet users [1]. We leverage     campaign [8]. The rapid adoption of mobile devices, such as
 edit distance operations and linguistic properties to generate    smart phones and tablets, exacerbates chances of incorrect inputs,
 misspelling candidates. To more efﬁciently identify linguistic-   presumably due to typing on small screens. A recent report
 collision search terms, we design a deep learning model that can  shows that around 60% of search queries are attributed to mobile
 improve collection rate by 2.84x compared to random sampling.
 Our results show that the abuse is prevalent: around 1.19% of     devices [9].
 linguistic-collision search terms on Google and Baidu have results   To bypass automated corrections of search engines, attackers
 on the ﬁrst page directing to malicious websites. We also ﬁnd thatcan employ a new attack scheme, namely linguistic-collision
 cybercriminals mainly target categories of gambling, drugs, and   misspelling, which abuses the mistyped search queries coinciding
 adult content. Mobile-device users disproportionately search for  with legitimate existent words, even in a different language. For
 misspelled keywords, presumably due to small screen for input.
 Our work highlights this new class of search engine poisoning     example, “idobe” is a misspelling of the English word “adobe”,
 and provides insights to help mitigate the threat.                but also happens to be an existent Nigerian word (meaning
                                                                   “dropping”); “平锅” in Chinese (meaning “frying pan”) is a
                       I. I NTRODUCTION                            mistake input of “苹果” (meaning “Apple” company). Search
    Search engines serve an important role in people’s daily lives engines do not enforce automated corrections on such cases,
 and drive the majority of web trafﬁc. Indeed, 50%–70% of the which introduces exploitation opportunities for cybercriminals
 trafﬁc to websites come through search engines [2]. Website to launch search engine poisoning attacks.
 developers and administrators go to great lengths to improve         In this work, we perform the ﬁrst large-scale analysis of
 the rankings of their pages by following benign search engine linguistic-collision search engine poisoning. We focus on both
 optimization (SEO) guides [3]. On the other hand, cybercriminals English and Chinese languages, which are the top two languages
 attempt to use search engine poisoning techniques (such as used by Internet users [1]. We collect target keywords from
 keyword stufﬁng [4] and link farms [5]) to poison popular a variety of categories, such as drugs, gambling, clothing,
 search keywords, falsely promote rankings, and divert users to and food. We also include Alexa top 10,000 names in the
 their websites for malicious purposes. Such abuses not only English target-keyword corpus. Two main challenges that
 deteriorate users’ experience to navigate web content, but also we face are: (1) how to generate misspelled words, and
 cause substantial loss of visitors and revenue from legitimate (2) how to effectively determine whether a particular search
 businesses.                                                       term will be auto-corrected/suggested by search engines. For
    Misspelled keywords have increasingly become the target English-word analysis, we ﬁrst use edit distances to generate
 in SEO attacks [6], since they are less competitive to poison potential misspelling candidates. To make the experiment scale
 compared to the correct popular queries and can capture large (particularly for Alexa top 10,000 names), we adapt a deep
 numbers of users who accidentally make typographical errors. learning model–the Recurrent Neural Network framework–
 To combat the hassle of abusing misspelled keywords, search to predict how likely a misspelling candidate will not be


© 2019, Matthew Joslin. Under license to IEEE.                            1311
DOI 10.1109/SP.2019.00025
           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                                                                                                       




(a) Showing-results-for case (high conﬁdence about (b) Including-results-for case (medium conﬁdence (c) Did-you-mean case (low conﬁdence about mis-
misspellings), where the returned search results are about misspellings), where the top returned results spellings), where the returned search results are for the
automatically changed for the corrected search term are changed for the corrected search term adobe misspelled keyword. Meanwhile, users are displayed
adobe. Users do not receive search results for the and the rest of the results are for the originally input with a highlighted warning banner to indicate the
misspelled keyword.                                  term.                                                  corrected term.


Figure 1: Examples of Google’s auto-correction and auto-suggestion mechanisms on searches with misspelled keywords (original target keyword
is adobe). Users receive various notiﬁcations or corrected results for the misspelled searches.


automatically corrected. Our approach can improve the collection       to bypass existing auto-correction tools and poison large
rate by 2.84 times compared to random sampling. For Chinese-           numbers of search results.
word analysis, we use a phonetic approach (pinyin input) • We design a novel approach using deep learning to collect
to convert Chinese characters to Roman letters and generate            linguistic-collision misspellings in the wild. Based on our
misspelling candidates. To reduce online checking, we compare          experiment on the Alexa top 10,000 case, we ﬁnd that our
the candidate words against Chinese word dictionaries, since a         model outperforms random sampling by 2.84x.
misspelled Chinese word must still be another valid Chinese • Using our crawling framework, we perform the ﬁrst large-
word. Finally, we crawl search results showing on the ﬁrst             scale study of linguistic-collision misspellings collecting 1.77
page from Google and Baidu, and check whether the URLs are             million search results for misspellings generated for 18,234
blacklisted.                                                           original keywords across English and Chinese.
   In this work, we have the following key ﬁndings.                  • Our results show that linguistic-collision misspellings are

   • We ﬁnd that linguistic-collision misspellings are widely          widely abused on both Google and Baidu, with around 1.19%
      abused by attackers with 1.19% of non-auto-corrected             results on the ﬁrst search page directing to malicious websites.
      terms returning malicious results on the ﬁrst page from          We further perform detailed characterization of this class of
      both Google and Baidu.                                           search poisoning, including the poisoned word categories,
   • Cybercriminals primarily target keywords related to drugs,        effectiveness of misspelling generation approaches, and search
      gambling, and adult terms, with searches poisoned at four        volume   distribution.
      times the rate of less easily monetized categories (like
      clothing or food).                                                                    II. BACKGROUND
   • Poisoning activity exhibits a long-tail effect with search     A. Chinese Pinyin and Input Approach
      results across the Alexa top 10,000 dataset containing
                                                                       Hanyu Pinyin (abbreviated as pinyin) is the phonetic system
      around 0.54% poisoning rate on the ﬁrst page.
                                                                    to represent Chinese characters with Roman letters. Pinyin
   • Among various misspelling generation methods, vowel
                                                                    provides a convenient way to learn Chinese and input Chinese
      substitution for English produces a 50% higher non-auto-
                                                                    characters on computers. For example, the Chinese character
      corrected rate compared to average, and the Chinese
                                                                    “果” can be encoded as the pinyin symbol Guo. Typically each
      methods yield a 2.4x improvement for same pronunciation
                                                                    Chinese character is mapped to one pinyin (though there are
      and 2.3x for fuzzy pinyin.
                                                                    polyphonic Chinese characters), but one pinyin can represent
   • According to the trafﬁc comparison from Google Adwords
                                                                    many different Chinese characters. This can introduce ambiguity
      and Baidu Index, mobile-device users provide a signiﬁcant
                                                                    when transforming pinyin to Chinese characters. Moreover,
      proportion of the trafﬁc to linguistic-collision misspellings
                                                                    pronunciations of pinyin have four tones, which can be indicated
      presumably through fat-ﬁnger errors. The increase in trafﬁc
                                                                    by a number following the pinyin. The aforementioned Chinese
      further incentivizes attackers to target this class of search
                                                                    character “果” (meaning “fruit”) maps to pinyin with the third
      engine poisoning.
                                                                    tone Guo3. Another Chinese character “锅” (meaning “pan”)
   To summarize, we make the following contributions in this has the same pinyin spelling but a different tone Guo1.
paper.                                                                 Pinyin input method is the most widely used Chinese-input
 • We systematically measure and understand a new threat— approach [10] (compared to other input methods, like stroke-
    linguistic-collision misspellings, which allows attackers based input method). Since the input is based on pronunciations,


                                                                              1312

            Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
it is easy for Chinese speakers to master. Any English keyboard
can type pinyin. After users type pinyin of a Chinese character,
the input method will display a list of characters corresponded
to that pinyin for users to select and use. For convenience,
pinyin input system typically does not provide selection of tone
marks. The presented possible Chinese characters match the
same pinyin spelling and do not distinguish tones. For example,
the above “果” and “锅” will be shown simultaneously, once
a user types the pinyin Guo (since they have the same pinyin
spelling).

B. Deep Learning and Recurrent Neural Networks
    Deep learning has been applied to a wide range of problems
as computing power has grown signiﬁcantly. Neural networks
in particular have seen incredible successes in many application
domains. A neural network contains layers of neurons, which
provide the computation elements to predict future outputs. The
parameters of the neurons provide the memory and are adjusted
during training.
    In this paper, we focus on a particular type of neural network,
the Recurrent Neural Network (RNN), which has been shown
to work well with sequential data [11, 12]. An RNN accepts an
input sequence of vectors and outputs a vector sequence. The
input and output symbols are generally converted to a one-hot
representation that allows the model to more easily learn the Figure 2: Search results of misspelling cilis on Google (original
relationships between the input and the output. The output target search word is cialis). Top results lead to illicit pharmaceutical
vectors encode the RNN’s estimate of the probability that a websites. Our investigation shows that some of these websites are
given symbol should be selected in the output sequence. During reported at blacklists and they have cloaking or redirection.
training, the correlation between input and output sequences is
learned using Long Short-Term Memory (LSTM) [13]. For text
input, RNNs are typically used to deal with text at the word
                                                                    1) Showing-results-for (high conﬁdence about mis-
level and have proven remarkably successful in generating text.
                                                                       spellings). When search engines have high conﬁdence in what
However, character-based RNNs deal with text at the alphabet
                                                                       the correct keyword should be, results for the corrected term
level and thus can be more robust when dealing with extremely
                                                                       are directly returned. This is the strongest-level mitigation
large vocabularies that may be difﬁcult to collect.
                                                                       against misspellings in queries, where the results of the
               III. S EARCH E NGINE P OISONING OF                      suspect misspelled keyword will not be shown at all. Users
                     M ISSPELLED K EYWORDS                             are notiﬁed that search has been modiﬁed with the sign
                                                                      “Showing results for”. As shown in Figure 1(a), search for
    Misspelled keywords have been extensively exploited to             adoeb (transposition of b and e) will return all results for
illicitly seize search trafﬁc and gain proﬁt [6, 8]. Recent reports    adobe instead. Users still have the option to modify to
show that 10%–20% of queries on search engines contain                 search for the previous query by explicitly clicking adoeb
misspellings [14, 15]. These alternative keywords are typically        in the notiﬁcation “Search instead for”.
less expensive to purchase or less competitive to promote in 2) Including-results-for (medium conﬁdence about
the search results, making misspellings attractive targets for         misspellings). If the spelling mistakes are less evident, search
cybercriminals.                                                        engines may include results for the assumed correct keyword
    To counteract misspelling abuse and improve users’ experience,     as the top results with notiﬁcation “Including results for”.
over the past several years, major search engines, such as Google      The rest of the returned results are still for the misspelled
and Baidu, have taken signiﬁcant strategy changes to provide           keyword. The motive is that users are more likely to click
auto-suggestion or auto-correction [16, 17]. We use search             on the results of the corrected keyword (which show as the
results from Google to illustrate different levels of correction       top results). As shown in Figure 1(b), search for adobec
that search engines offer when a spelling mistake is detected.         (appending letter c) has the ﬁrst result of adobe and the
As an example, for a original keyword adobe, misspelled                rest results for adobec. By clicking the suggested word
variants result in the following four search return types from         adobe in “Including result for” or the original misspelled
Google (sorted from high to low regarding mitigation against           input adobec in “Search only for”, users can reﬁne which
misspellings in queries).                                              word they indeed hope to search for.


                                                                         1313

          Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                                                                                  
                                                                                                  
                                                                                  
                                                                                                    
                                                                                  


                                                                                                
                                                             
                                                                                                                     
                                                                                      
                                                 




                                                                                   
                                                                                               

Figure 3: Workﬂow of ﬁnding linguistic-collision keywords for search engine poisoning. Based on a set of selected target keywords, we design
algorithms to generate potential misspelling candidates (), expanding to a larger word set. Then we reduce the candidate sets to identify
the linguistic-collision keywords () and collect the corresponding non-auto-corrected results from search engines. Last we check on
blacklists to ﬁnd linguistic-collision keywords associated with malicious websites with high rankings in search results for subsequent analysis ().

3) Did-you-mean (low conﬁdence about misspellings).                           conduct the ﬁrst large-scale empirical analysis to characterize
   When search engines suspect the spelling may contain errors,               linguistic-collision SEO attacks.
    a warning banner of “Did you mean” with a suggested
    keyword is displayed to users. However, users receive only                Pharmaceutical examples of linguistic-collision SEO. Pro-
    search results for the misspelled keyword. Though the                     moting illicit pharmacy websites is a major target of cybercrim-
    notiﬁcation banner can blend in with search results and be                inals [18]. We illustrate the scheme with a search on cilis, a
    ignored, it raises the chances for users to realize misspellings          misspelling of the pharmaceutical drug cialis (missing one
    in the queries and correct them. As shown in Figure 1(c),                 letter a in the middle). The misspelled variant exists in the
    search for adube (misspelling of adobe by replacing letter                language of Esperanto and means “chilis”. Figure 2 shows the
    o with u) on Google leads to search results based on the                  Google search results. We note that obviously the top search
    misspelling. If users click on the suggested query adobe                  results contain links to pharmacy websites. In particular, there are
    in “Did you mean”, the search will be re-run for the revised              three interesting observations. (1) The paid ads on the top refers
    version adobe and the warning message will disappear.                     to a website selling pharmaceutical drugs. Vendors intentionally
4) Non-auto-corrected (no detection of misspellings).                         purchase misspelled keywords for advertising on search engines
    If search engines have no suspicion of misspellings in the                to gain trafﬁc and proﬁt. (2) The ﬁrst returned result is a
    search terms, the query is performed for the keyword that                 website under terrypaulson.com, ﬂagged as malicious by
    users originally submit. In particular, if a misspelling is               VirusTotal [19]. The website deploys cloaking mechanisms to
    coincidentally an existent word, even possibly in a different             hide the true intention. If users directly visit the URL, the website
    language, search engines will not modify the original query               shows a page full of text. If users click through the Google
    or display any notiﬁcation to users. The semantic gap is that             search result, the website turns to make online pharmacy sales
    search engines have no prior knowledge about the original                 (as shown in Figure 2). (3) The third search result shows a URL
    keywords that users intend to search. For example, search                 under oversand.es. Clicking the link will follow redirection
    for idobe (replacing the ﬁrst letter a with i) yields regular             to reach a website online-pharmacyrx-canada.com,
    search results for the word. The page will show no special                which sells illicit drugs. The entry page is hosted at Spain, while
    notiﬁcation or hint about potential misspellings. In fact, the            the landing page locates at Lithuania. The above ﬁndings show
   word idobe (misspelling of adobe) is an existent word in                   that through linguistic-collision SEO, it is comparatively easier
    a Nigerian language, meaning “dropping”.                                  for cybercriminals to achieve high rankings on search engines
For the ﬁrst three cases, users receive notiﬁcations or corrected             and evade ﬁltering from authorities.
search results automatically, which diminishes chances of
attackers to manipulate and monetize the search results of                       Another interesting example of linguistic-collision SEO is
misspellings. However, for the non-auto-corrected case,                       clalis (replacing the ﬁrst i with l in cialis), which
mistyped search queries coincide with legitimate existent words               does not trigger auto-correction on Google search. Similarly,
and users receive results of the misspelled input. Therefore, it              the returned results have a purchased ads linking to an online
is more likely that users cannot realize that they make query                 pharmacy website goodrx.com. Moreover, U.S. Food & Drug
misspellings and are tricked into clicking on the returned results.           Administration (FDA) has advised consumers not to fall victim
Such misspelled keywords remain susceptible to search poisoning               to clalis scams [20] (which is not cialis). Abuse of linguistic-
attacks, which we coin as linguistic-collision misspellings. In this          collision keywords causes negative impact to users and degrades
paper, we focus on the non-auto-corrected cases and                           the results’ quality for search engines.


                                                                          1314

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                       IV. M ETHODOLOGY                                      Damerau-Levenshtein edit operations with distance one contain
                                                                             about 80% of all single mistake misspellings [24].
   In this section, we describe how we generate linguistic-
                                                                             Non-auto-corrected identiﬁcation (). We ﬁrst introduce two
collision misspellings and establish ground truth data. We select
                                                                             straw-man approaches to identify linguistic-collision words for
English and Chinese as our analyzed languages, since they
                                                                             English misspellings. (1) Mapping to explicit vocabulary in
are the top two languages used by Internet users [1]. The
                                                                             dictionaries. The approach has two main limitations. One is
experiments are performed for Google and Baidu respectively,
                                                                             that linguistic-collision misspellings may be legitimate words
which represent the largest search engine market share [21].
                                                                             in non-English languages, which requires to include numerous
Figure 3 outlines the overall design of our methodology. The
                                                                             multi-language dictionaries. Another issue is that users keep
workﬂow applies to both the English and Chinese experiments.
                                                                             inventing plausible words to describe new phenomena. For
The circles represent the data sets that we generate during
                                                                             instance, “Linsanity” follows most English spelling rules, but was
the process. The descriptions about the data are shown above
                                                                             not in popular use until 2012. As we will show in Section V-B,
each circle, and in the circles we show word examples. In
                                                                             strict dictionary checking results in poor coverage of conﬁrmed
Figure 3, the English word example is cialis, referring to a
                                                                             linguistic-collision misspellings. (2) Brute-force checking on
classic pharmaceutical drug. The Chinese word example is “麻
                                                                             search engines. The approach is to perform online checking for
将” (Pinyin as Ma2Jiang4), meaning a traditional Chinese
                                                                             all misspelling candidates on search engines. For a selected set of
gambling game. The sizes of the circles simulate whether the
                                                                             keywords (Alexa top 1K and manually selected categories), we
data size will increase or shrink compared to the data at the
                                                                             conduct exhaustive checking to obtain comprehensive analysis
previous step. In Section VI, we investigate details of the change
                                                                             (see Section V). However, the approach cannot scale for large-
ratios of data sizes along the process.
                                                                             scale experiments (Alexa top 10K). For example, enumerating
   The process has three main steps. Given a set of target
                                                                             all possible insertions (one of the Damerau-Levenshtein edit
keywords, we develop mechanisms to transform them into
                                                                             operations) requires performing 26 queries per input character.
misspelling candidates (). Note that the generated candidates
                                                                             Such a high-level of overhead cannot be supported for web-scale
are not necessarily linguistic-collision misspellings, and may
                                                                             datasets, and we need to develop a method for eliminating
cause auto-suggestion/correction on search engines. Typically
                                                                             auto-corrected candidates more efﬁciently.
one target keyword will correspond to multiple misspelling
                                                                                We adapt a Recurrent Neural Network (RNN) framework to
candidates, therefore the dataset at this step will expand
                                                                             estimate how likely a word will not be auto-corrected by search
considerably. Next we ﬁlter to obtain the candidates that produce
                                                                             engines. RNNs have been widely applied to natural language
non-auto-corrected search results (), which will shrink the
                                                                             processing (as described in Section II ) and used to predict
keyword set. We collect the search results and the corresponding
                                                                             sequential text outputs. Our primary insight is that a formally
URLs showing on the ﬁrst search page, typically around 10
                                                                             recognized word should display character-level patterns similar
results. Previous studies show that 70%–90% of user clicks
                                                                             to the rest of dictionary vocabulary for users to adopt it. RNNs
happen at the ﬁrst page of search results [22, 23]. We then
                                                                             can generate high-quality language models for character-level
examine whether the URLs of the ﬁrst-page search results are
                                                                             representations [27, 28]. Our developed approach effectively
ﬂagged as malicious by public blacklists (). Correspondingly,
                                                                             addresses the challenges of recognizing new words (not covered
we discern which misspelled keywords are abused for search
                                                                             in dictionaries) and linguistic-collision words in non-English
poisoning attacks and further characterize various facets of the
                                                                             languages.
attacks.
                                                                                Figure 4 demonstrates our framework for training an adapted
                                                                             RNN and generating conﬁdence estimates on misspelling
A. English-language Design
                                                                             candidates. The system consists of two phases, training phase
   Since English and Chinese languages have distinct lingual                 and prediction phase. (1) In the training phase, we adapt to train
properties, we use different design strategies, in particular for            with individual words from dictionaries. We use dictionaries
the ﬁrst two steps. We introduce our design of English language              to learn from a large corpus of words and capture the general
for misspelling generation and non-auto-corrected identiﬁcation.             English lexical patterns. We append a null character to the
Misspelling generation (). To generate misspellings from the                beginning and end of the word to allow the RNN to learn about
English keywords, we use a modiﬁed version of the Damerau-                   word boundaries. With the popular Tensorﬂow library [29], we
Levenshtein edit operations [24, 25]. The Damerau-Levenshtein                train a character-based RNN to recognize the typical structure of
edit operations can (1) insert a character, (2) replace a character,         legitimate words. After randomly initializing the model weights,
(3) transpose two adjacent characters, or (4) delete a character.            we use the Adam optimization algorithm [30] with gradient
To restrict the number of the generated candidates, we use the               clipping to reduce the cross-entropy during training. (2) In
approach proposed by Moore and Edelman [26], which limits the                the prediction phase, our goal is not to generate arbitrary text
character replacement operation to characters that are adjacent to           content, but to predict whether particular misspellings that we
the original key on a QWERTY keyboard (i.e., fat-ﬁnger errors).              have generated will not be auto-corrected by search engines (i.e.,
In addition, we allow replacement of any English alphabet                    coincidentally legitimate words). Given an input preﬁx x (e.g.,
vowels, including letters a, e, i, o, u and y. We focus on edit              goog in Figure 4), an RNN outputs a probability distribution p
distances with one, as previous work has suggested that the                  for the alphabet on which character is most likely (in the example


                                                                         1315

          Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
            7UDLQLQJ                                            3UHGLFWLRQ


            6      (   $   5     &
                                                                                                                                           
  /670                                                               .                                                                     
  +LGGHQ                                7UDLQHG5110RGHO                           (QWURS\
  /D\HU                                                               /      
                                                                                    (VWLPDWRU                                                   
                                                                      0                                                                     
            ?     6   (   $     5       ?     *   2    2      *         
                                                                                                                                               
                                                                       2XWSXW
                                                                      3UHGLFWLRQ                                                                 
                 5DQGRPL]DWLRQ
                                                0LVVSHOOLQJ                                                                                    
                   9HFWRUL]H                    *HQHUDWRU                                                                                         
                                                                                                                                                  
        9RFDEXODU\LQ'LFWLRQDU\              7DUJHW.H\ZRUGV
                                                                                                                                               

Figure 4: RNN framework to predict how likely misspelling candidates                               Figure 5: Fuzzy pinyin and anatomical parts to produce the sounds.
for English original keywords will cause non-auto-corrected results on                             We include pinyin strings that are easy to confuse with each other.
search engines.
                                                                            words. Therefore, we directly check whether a misspelling
letter l has the highest probability). We adapt to calculate the candidate exists in Chinese dictionaries. For valid Chinese
average entropy of the RNN’s prediction over each output words, search engines will not apply auto-correction/suggestion.
character. Suppose the candidate word has n letters, the size of As the examples in Figure 3 demonstrate, even if all Chinese
the character set is l, and the distribution output of the RNN characters are valid, the combination may not form meaningful
at letter position k (1 ≤ k ≤ n) is pk =      (pk1 , pk2 , . . . , pkl ). Chinese words. The identiﬁcation procedure can be performed
                                                  l
The entropy at the position k is H(    pk ) = i=1 pki log2 (pki ). ofﬂine. We collect commonly used Chinese words from four
The                                                                         popular word dictionaries of Sogou pinyin input method [31].
n average entropy for a given prediction can be calculated as In total, the dataset contains 1,166,765 Chinese words.
   j=1 H( pj )/n. Intuitively, the average entropy is a normalized
estimate of the RNN’s conﬁdence that the misspelling could
plausibly be used as an existent word. Low entropy values C. Crawling Tasks
indicate misspellings which should be more likely to be non-                   To perform the experiment at a large enough scale, we
corrected.                                                                  designed a framework to collect search results, search volumes,
                                                                            translation data, and blacklist information. Figure 6 gives a
B. Chinese-language Design                                                  high-level view of these tasks and how they relate to each other.
   The linguistic properties of Chinese words require different We begin by collecting the search results for input keywords,
strategies to generate misspelling candidates and identify non- and then check the search volumes, Google Translate API,
auto-corrected search keywords.                                             and blacklist for search terms. Together, these datasets provide
Misspelling generation (). For each target keyword, we ﬁrst a comprehensive view of linguistic-collision misspellings. To
convert the Chinese characters into pinyin, which is composed of ensure that the search engine servers would not be overloaded,
English letters. Then we apply same edit distance operations (as we rate-limited our crawlers.
for English misspelling generation) to spawn new pinyin strings. 1) Search results. To determine whether or not the search results
According to pinyin’s lexical rules, some generated pinyin                     were auto-corrected, we checked the returned page for the
strings may not be valid (we still count them as candidates                    notices described in Section III. If the keyword was not
to match existent pinyin). We transform pinyin strings to all                  corrected by the search provider, we parsed the search result
possible Chinese characters with that pronunciation. In particular,            page and collected the ﬁrst 10 search result entries in a
there exist two phenomena. (1) Same pinyin. As introduced                      database for later analysis. In particular, we saved the title,
in Section II, many different Chinese characters map to the                    description, and URL for each entry. We used the URL to
same pinyin. When we transform back from pinyin to Chinese                     check if the result was blacklisted and the title and description
characters, the number will increase considerably. Different                   proved invaluable to understanding the SEO techniques used
tones further exaggerate the phenomenon, given that most pinyin                with linguistic-collision misspellings. In addition, we captured
input methods do not provide tone selection to users. (2) Fuzzy                the estimated number of search results to understand how
pinyin. Some pinyin have close pronunciations, including nasal,                difﬁcult the SEO is for particular keywords. Because the
retroﬂex, and alveolar sounds. Figure 5 shows the anatomical                   search results can change quickly for pages with malicious
parts to make the pronunciations and the confusing pinyin                      entries, we also captured the raw HTML to allow for later
strings. Many people cannot distinguish the differences. Pinyin                manual inspection.
input methods also automatically include Chinese characters 2) Search volumes. To analyze how users are exposed to non-
that match fuzzy pinyin for users to select. More analysis on                  auto-corrected misspellings we queried Baidu Index [32] and
misspelling generation comparison will be shown in Section VI.                 Google Adwords [33]. To estimate search volume for Chinese
Non-auto-corrected identiﬁcation (). In contrast to the En-                   terms, we used Baidu Index to collect daily search volumes
glish case, linguistic-collision Chinese words will still be Chinese           for the previous week and month. While Baidu Index allows


                                                                                                1316

                 Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                              3XEOLF%ODFNOLVW                                July 2018. Speciﬁcally, we conducted two parallel studies
                                                                              targeting Chinese and English terms. We follow the approach
                   &UDZOHU                          *RRJOH                    in Section IV to generate candidate keywords and fetch search
                                      6HDUFK                                 results from Google and Baidu respectively. For the English
                                                    %DLGX
                                      5HVXOWV                                 study, we generated misspellings from 11,520 original keywords
                                                                              and collected 1,044,711 searches using the Google search service.
                                                    *RRJOH$GV
                                                                              For the Chinese study, we generated misspellings from 6,714
       ,QSXW                          6HDUFK
                                      9ROXPHV
                                                    %DLGX,QGH[               original keywords and collected 724,865 searches from Baidu.
       .H\ZRUGV
                                                                              We use two strategies to select original target keywords: (1)
                                                    *RRJOH
                                                                              manually collected categories, and (2) Alexa list of popular
                                      /DQJXDJH      7UDQVODWH$3,             websites, for which we will describe details below.
                                      7\SHV
                                                                              Keyword collection per category. Miscreants intend to target
Figure 6: Crawling framework that contains four tasks, collecting search      speciﬁc sets of keywords to gain illicit proﬁt, so we manually
results, search volumes, language types, and public blacklist.                select 13 different categories in English and 12 different
                                                                              categories in Chinese for analysis. Previous work indicates
   users free access to search volumes, Google Adwords has                    that cybercriminals target more on prescription drugs, gambling
   recently restricted search volume data to paid customers. As               terms, adult terms, and software categories [18, 39] (results
   a result, we only use Google Adwords data to investigate                   in Section VI conﬁrm the conjecture). We collect terms in
   questions that only require comparing the predictions, such                such categories for analysis. We also include general consumer
   as from what types of devices users are searching. Using                   product categories, such as food, cards, clothing, cosmetics,
   relative Google Adwords data allows us to compare mobile                   and jewelry, to allow for a comprehensive comparison. For
   and desktop searches, but not exact volumes for large lists                English analysis, we collected the terms from the user-ranked
   of words.                                                                  forums [40], and other lists curated for speciﬁc topics [41–43]. In
3) Language types. Because we are interested in what percentage               addition, the discovery of a parked domain using the misspelling
   of English linguistic-collision misspellings are coexistent                of a major US defense company led to the inclusion of defense
   within the same language vs. other languages, we decided to                contractor’s names as this type of more targeted misspelling could
   use the Google Translate API to detect the language of the                 be used by more sophisticated attackers for phishing. In total, the
   misspellings [34]. Knowing the language of a misspelling                   English per-category keywords contain 1,520 terms, and lead to
   allows us to determine whether the misspelling is between                  563,555 misspelling candidates. For Chinese analysis, we mainly
   two languages or within the same language. In addition to                  obtain the target keywords from the website china-10.com,
   returning the detected language, the Google Translate API                  which contains terms for various categories. We totally collect
   returns a conﬁdence score which allows us to understand                    6,714 Chinese target keywords, and generate 718,151 misspelling
   why Google would fail to correct the misspelling.                          candidates. A detailed breakdown of the per-category statistics is
4) Public blacklist. Finally, we scanned all of the URLs                      shown in Table I. The ﬁrst column is the names of the categories,
   returned for the uncorrected misspellings found during task                the second column shows the numbers of the collected target
   1). To determine whether a URL is malicious, we checked                    keywords of English, and the sixth column shows the counts of
   VirusTotal [19]. VirusTotal currently aggregates 68 antivirus              the target terms of Chinese. We will describe the other columns
   scanning engines to identify malicious URLs, including                     of the table in Section VI.
   Google Safebrowsing [35], Yandex Safebrowsing [36],
   Spamhaus [37], and Baidu-International [38]. To avoid             Keyword collection based on Alexa top list. In domain
   introducing high false positive rates, we also implemented        typosquatting attacks, cybercriminals target names of popular
   manual spot checking to ensure that the accuracy remained         websites [44, 45]. Similarly, we include the top names of Alexa
   high.                                                             domain list [46] in our analysis. Because it is difﬁcult to ﬁnd a
                                                                     counterpart list for Chinese, we only collected the Alexa top
                          V. E XPERIMENT                             list for English analysis. Table II shows the statistics of Alexa
   In this section, we describe our experiment settings, keyword top 100, 1,000, and 10,000 names respectively. The second
selection, and statistics of the collected data. We also demonstrate column represents the numbers of the generated misspelling
the performance of the adapted RNN approach to generate candidates that we search on Google. For Alexa top 1,000 terms,
eligible search keywords (i.e., those that are not auto-corrected we use brute-force search results of misspelling candidates for
by search engines).                                                  comprehensive analysis and evaluation of RNN performance
                                                                     (Section V-B). To examine the long-tail effect [47], we also
A. Data Collection and Validation                                    consider the Alexa top 10,000 domains, which lead to 2,105,218
   To understand the characteristics of linguistic-collision mis- misspelling candidates. However, it is inefﬁcient to exhaustively
spelling SEO, we perform a large scale data collection and crawl all these keywords. Instead, we deploy the RNN approach
analysis. We ran the experiment on a cluster of 26 servers that we design in Section IV to identify keywords likely to cause
with 2 CPUs and 4 GB of RAM from December 2017 to linguistic collision and not to be auto-corrected by Google.


                                                                          1317

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                                                 English                                                       Chinese
                                 #    # Misspell   % Non-Auto-        %                        #    # Misspell   % Non-Auto-      %
      Category                 Target Candidates    Corrected     Poisoning                 Target Candidates      Corrected  Poisoning
      Drugs                      205     57,255   4.59% (2.6K) 1.95% (51)                        46     3,738 11.85% (443) 3.61% (16)
      Adult Terms                214     73,089 37.57% (27.5K) 3.47% (950)                     181     32,047 11.41% (3.7K) 2.71% (99)
      Gambling                   192     79,464   7.33% (5.8K) 2.88% (168)                       42     1,951 18.14% (354) 2.54% (9)
      Software                   288    126,622   6.96% (8.8K) 0.57% (50)                      700     84,008 6.29% (5.3K) 0.72% (38)
      Cars                         68    16,675 11.40% (1.9K) 0.68% (13)                     1,767    218,697 4.74% (10.4K) 0.94% (97)
      Food                         98    43,668   8.49% (3.7K) 0.38% (14)                    1,738    159,825 6.62% (10.6K) 0.87% (92)
      Jewelry                      49    16,613   9.53% (1.6K)   0.19% (3)                     148     24,956 6.17% (1.5K) 0.97% (15)
      Women’s Clothing             43    14,235   8.33% (1.2K)   0.59% (7)                     199     25,365 10.18% (2.6K) 0.74% (19)
      Men’s Clothing               55    18,781   9.99% (1.9K)   0.43% (8)                     440     40,903 8.85% (3.6K) 1.00% (36)
      Cosmetics                    47    17,706   5.72% (1.0K)   0.50% (5)                     439     75,844 6.86% (5.2K) 0.75% (39)
      Baby Products                46    15,484 14.09% (2.2K)    0.32% (7)                     394     51,935 6.62% (3.4K) 0.93% (32)
      Daily Necessities          126     42,638   6.10% (2.6K) 0.54% (14)                      620     68,176 8.92% (6.1K) 0.76% (46)
      Defense Contractors          89    40,984   6.65% (2.7K) 0.70% (19)                      —-          —-              —-       —-
Table I: Detailed breakdown of per-category collection statistics. “# Target” is the number of original terms used to generate misspellings for that
category, “# Misspell Candidates” is the number of generated misspelling variants of the target keywords. “% Non-Auto-Corrected” is calculated
as the number of queries for which the search engine does not offer auto-correction either automatically or as a suggestion, and “% Poisoning”
is calculated as the percentage of non-auto-corrected queries which contain malicious URLs on the ﬁrst page of search results. For the “%
Non-Auto-Corrected” and “% Poisoning”, we also show the raw numbers of searches in parentheses.




                     (a) English experiment (on Google).                                        (b) Chinese experiment (on Baidu).


Figure 7: Comparison of search poisoning rates among different misspelling types per keyword category. The y-axis indicates the percentage of
searches that contained malicious URLs on the ﬁrst page of search results (for a given keyword category and misspelling protection type).
From left to right for each category, Original refers to searches made for the correctly spelled terms, while Showing-results-for,
Including-results-for, Did-you-mean, and Linguistic-collision (Non-auto-corrected) refer to types of auto-
correction offered for the searches as described in Section III. The different categories are described in Section V-A, note that “Defense Contractors”
is only present in the English experiment. The search poisoning rates of Linguistic-collision (Non-auto-corrected) are the
same values as “% Poisoning” columns in Table I.

Auxiliary information collection. In addition to the search                   105,978 predictions for the uncorrected misspellings in an attempt
results collected from Google and Baidu, we also collected                    to understand the distribution of how the language distribution
information from VirusTotal, Google Adwords, Google Translate,                varies across different categories. The details for our language
and Baidu Index. We used VirusTotal to identify URLs with                     results can be seen in Table III.
suspicious activity and then investigated further into the ﬂagged
results. In total, we collected scans for 2.06M URLs of which                 B. Results of RNN
1.18% (24.4k) had been detected by at least one scanner. To
improve the accuracy, we manually spot-checked the ﬂagged                        The ﬁnal model used 150 hidden layers with a sequence
URLs for malicious activity using a virtual machine which                     length of 5 characters. The vocabulary consisted of lower-case
eventually obtained 5,256 malicious URLs under 2,743 domains.                 alphanumerics and a null character for a total vocabulary size of
For the English search results, we checked the device breakdown               37 characters. To train the RNN model for different parameters,
estimates for 117,791 uncorrected misspellings and 12,943                     we used 4 servers with 24 GB RAM and 16 CPU cores each.
original keywords using the Google Adwords Keyword Planner                    The training set we used was a wordlist with 675,903 unique
tool [48]. Using the Google Detect Language API we collected                  words taken from several wordlists [49–52]. To select optimal
                                                                              parameters, we checked each setting on completely separate

                                                                          1318

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
          Category   # Misspell   % Non-Auto-        %
         (Alexa Top) Candidates    Corrected     Poisoning
              1–100     20,192 16.29% (3.2K) 0.85% (28)
          101–1,000    216,157 13.28% (28.7K) 0.78% (221)
 (RNN) 1,001–10,000     61,088 38.04% (23.2K) 0.50% (116)
Table II: Data collection statistics based on Alexa top list (similar
header meanings as in Table I). Note that the results for the Alexa top
1,001–10,000 are collected using the RNN model’s predictions.

validation data taken from the ground truth data on the Alexa
top 1,000 misspellings.
   To evaluate the RNN’s performance and investigate mis-
spellings affecting less popular domains, we used the trained
RNN with the best performance on the Alexa 1,000 misspellings
to generate predictions for the 2.4 million misspellings from the
Alexa 10,000. From these predictions, we selected the keywords Figure 8: Longitudinal view of the poisoned non-auto-corrected search
                                                                     result rate over Alexa terms (1,001–10,000 using the RNN predictions).
with the lowest entropy from the predictions and used the The results are binned by the original term’s Alexa rank with the x-axis
crawling framework to collect search results. The ground truth labels denoting the bucket lower and upper bounds, e.g., 2k covers the
data collected for the Alexa top 1,000 indicates that randomly range of 1,001–2,000.
sampling the misspellings would yield a hit rate of about 13.28%.
Dictionary checking exhibited even lower performance on the
Alexa top 1,000 ground truth set with a 2.6% hit rate. The poor linguistic-collision misspelling SEO has widespread impact, and
performance of dictionary checking vs. random sampling can be cybercriminals can comparatively easily manipulate rankings and
explained by the fact that many of the words are new, obscure, promote their pages index by linguistic-collision misspellings.
or only in use as slang. Our RNN approach also outperforms Per-category results. As mentioned in Section V, the English
the naive Bayes and random forest algorithms. Due to space misspellings were split into two major sets, per-category
limitation, more details are shown in Appendix A. Crawling keywords and Alexa domains. Table I describes the per-category
the 61,088 highest conﬁdence predictions from the RNN gave datasets for Chinese and English. The ﬁrst column shows
a non-auto-corrected rate of 38.04% with 23,236 uncorrected the category names. We have 13 categories, and 12 of them
misspellings. Compared to random sampling, the RNN gave a are present in both Chinese and English (“Defense” category
performance improvement of 2.84x.                                    only has keywords in English and contains the names of the
                                                                     100 largest defense contractors around the world). The fourth
            VI. M EASUREMENT AND D ISCOVERIES                        and eighth columns “% Non-Auto-Corrected” represent the
   In this section, we present ﬁndings from our study, including proportion of misspelling queries not auto-corrected by search
landscape of the abuses, characteristics of the linguistic-collision engines, regarding English and Chinese respectively. The ﬁfth
misspellings, and estimates of search volumes for cybercriminals. and last columns “% Poisoning” indicate the percentage of
We also provide deep analysis of two interesting cases.              non-auto-corrected queries containing VirusTotal blacklisted
                                                                     URLs on the ﬁrst-page search results, regarding English and
A. Landscape and Comparison of Misspelling Search Results Chinese respectively. We also include raw numbers of searches
   First, we examine how pervasive the linguistic-collision in parentheses in Table I. There are two observations: (1) A
misspelling SEO is. In fact, we ﬁnd linguistic collisions are considerable portion of misspellings (> 4.5% for all categories)
widely existent: 15.16% of the English misspelling keywords result in linguistic collisions that will not be auto-corrected by
that we generate using edit distance 1 are not auto-corrected, and search engines, and (2) many linguistic-collision misspelling
7.69% of the Chinese misspelling terms based on the fat-ﬁnger, searches lead to malicious websites appearing on the ﬁrst pages
fuzzy pinyin, and same pronunciation generation methods are of search results.
not auto-corrected. Because users primarily click search results        To compare linguistic-collision misspelling to other types
returned on the ﬁrst page [53], we only checked to see whether misspelling searches, we queried all misspell candidates that
the ﬁrst page of search results has been poisoned.                   we generated (column “# Misspell Candidates” in Table I) and
Blacklist statistics. To determine whether or not a URL was the original target keywords (column “# Target” in Table I)
potentially malicious, we checked VirusTotal for reports of from the search engines. Figure 7 shows the poisoning rates
malicious activity from that URL. In total, we determine that for English and Chinese by category and level of correction
1,511 URLs from ﬁrst-page results (10 results per ﬁrst page) of from the search engines. We ﬁnd that indeed attackers more suc-
non-auto-corrected searches are malicious. Correspondingly, cessfully target linguistic-collision (Non-auto-corrected)
0.98% (1,872) of English linguistic-collision search terms on misspellings than misspellings that are protected by the different
Google result in ﬁrst-page blacklisted URLs, and 1.39% (538) types of auto-correction discussed in Section III. On average
of Chinese linguistic-collision terms show poisoned results linguistic-collision misspellings are poisoned at a rate of
on the ﬁrst pages on Baidu. The observation indicates that 1.19% across English and Chinese categories as compared to

                                                                          1319

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
  All Results             Alexa top 1K                Drugs                   Software              Gambling                  Adult Terms
  English       57.44%    English          40.67%     English      49.28%     English     74.04%    English        66.44%     English           81.67%
  Arabic        2.76%     Arabic           5.42%      Latin        3.69%      Italian     1.91%     Spanish        2.69%      French            1.96%
  Spanish       1.66%     Hindi            2.19%      Spanish      2.82%      Arabic      1.44%     Norwegian      2.14%      Spanish           1.30%
  Hindi         1.56%     Welsh            2.18%      Italian      2.47%      Spanish     1.33%     Italian        1.78%      Indonesia         1.05%
  Italian       1.53%     Danish           1.68%      Romanian     2.25%      Hindi       1.01%     French         1.68%      Polish            0.79%
                                            Table III: Per-category breakdown of language statistics.


0.16% for Original, 0.18% for Showing-results-for, RNN’s entropy estimator. The Alexa 1,000 ground truth dataset
0.23% for Including-results-for, and 0.47% for blacklist rate is 0.78% with 221 poisoned searches. Interestingly,
Did-you-mean terms.                                                  we see the rate of blacklisted results remains fairly constant
   We observe that the “Drugs”, “Gambling”, and “Adult Terms” based on the RNN results with an average of 0.50% in the
categories exhibit higher rates of poisoned non-auto-corrected Alexa top 1,000–10,000 (116 poisoned searches). Figure 8 shows
searches at 2.86% on average than other categories which the longitudinal distribution of attacker activity. On average,
exhibit average rates of 0.66%. These terms are more easily 0.54% of the non-auto-corrected results in the Alexa dataset are
monetized than searches for more benign terms such as “Food” or poisoned. Longitudinally, we ﬁnd that the level maliciousness
“Cosmetic” products, as the attackers can easily enroll in afﬁliate is high for the Alexa 100 and 1K, indicating cybercriminals
ad programs [54]. Additionally, malicious attackers (as opposed target more on popular domains. After reaching the lowest for
to those simply looking for ad revenue) may rationalize that the 3K domains, the poison rate slowly increases over the long-
users performing these searches may be more willing to ignore tail. Szurdi et al. observed similar long-tail effect on domain
suspicious patterns in URLs or even explicit warning messages typosquatting [47]. Lower popularity domains may have fewer
by browsers to access the advertised content. Finally, other search resources to check for poisoned search results, less risk of
engine products such as Google Autocomplete have avoided litigation, and less competition from other cybercriminals.
optimizing and maintaining “inappropriate” predictions for search
queries such as adult terms [55]. In contrast to the aforementioned B. Characteristics of Linguistic-collision Search Results
three categories, “Software” linguistic-collision misspellings do      Next we investigate the detailed properties of misspelling
not result in high poisoning rates. The comparatively lower search results that lead to malicious websites.
exploitation is presumably due to current success of traditional Comparison of misspelling generation. Intuitively, we would
SEO methods for these keywords (note the high poisoning rates expect users to generate some types of misspellings more
for Original terms in the English “Software” category). frequently than others either through mistyping or confusing the
However, because cybercriminals have historically targeted spelling of the original term. For the English results, we compare
software terms [18, 39], we continue to include “Software” the non-auto-corrected rate for the wrong vowel substitution
in our analyzed categories in Section VI-B.                          method to the average for all misspelling generation, while for
   While the English “Drugs”, “Gambling”, and “Adult Terms” Chinese we compare the same pronunciation terms and fuzzy
categories include poisoned searches for misspellings with every pinyin method to the rest of the misspellings. Because these
type of correction, the corresponding Chinese categories contain methods produce misspellings that are closer to the original
poisoned searches almost exclusively for linguistic-collision keyword than the edit-distance 1 heuristics, we would expect
misspellings. The disparity between the two is conjectured as these methods to produce more linguistic-collision misspellings.
an artifact of Baidu’s ranking algorithm to prioritize URLs Indeed, we ﬁnd that for English the wrong vowel method
under reputed domains. We ﬁnd that on Baidu 91.3% of produces a non-auto-corrected rate of 22.85% as compared to the
search results for the Original, Showing-results-for, edit-distance 1 misspellings which showed a non-auto-corrected
Including-results-for, and Did-you-mean terms rate of 15.16%. Similarly, for Chinese the more realistic methods
are under only 1,000 domains (with baidu.com alone outperform the fat-ﬁnger misspellings with same pronunciation
accounting for 42.7% of results). In contrast, these 1,000 domains keywords uncorrected 18.21% of the time and fuzzy pinyin
account for 83.3% of the results in linguistic-collision misspelling escaping auto-correction for 17.63% of misspellings. Meanwhile,
searches. The observations indicate that Baidu exercises less for Chinese the edit distance 1 data set resulted in a non-auto-
caution on linguistic-collision misspelling searches and is likely corrected rate of 7.69%.
to include malicious results.                                        Language distribution of linguistic collisions. To determine
Alexa top list results. Table II describes the results from the why Google would fail to correct so many misspellings, we
Alexa misspellings (with similar header meanings as in Table I). used the Google Translate API to detect the language which
To investigate the trends and long-tail effect, we use the Alexa returned the detected language and the prediction conﬁdence. The
top 100, 1,000, and 10,000 website names as target keywords Google Translate API reported that the uncorrected misspellings
respectively. As mentioned in Section V, the results for the contained words from 74 languages, while many of the non-
Alexa domains ranked between 1,000 and 10,000 are selected English predictions had lower conﬁdence manual spot-checking
using the RNN described in Section IV. In particular, we crawled shows that many of these misspellings are actually valid words
61,088 misspellings which received the lowest entropy from the in other languages. To better understand the breakdown, we

                                                                         1320

          Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
                            # of
                          Poisoned # of   Trafﬁc
              Domain name Searches URLs monetization
            *.0catch.com       732 109 malvertising
          *.atspace.name         63  17 malvertising
            hdvidzpro.me         58  58 malvertising
           wannajizz.com         49  48 malvertising
theunderweardrawer.co.uk         40  38 malvertising
Table IV: The top ﬁve malicious domains using non-auto-corrected
misspellings to poison English search terms. The websites typically
contain malicious software download or collect personal information.
While domains 0catch.com and atspace.name themselves are
not intended for malicious activities, cybercriminals utilize the sites’
free hosting to promote malicious content through misspelled keywords.        Figure 9: Cumulative distribution function of the number of indexed
                                                                              misspelled keywords that were poisoned by the same domain. Note that
                                                                              38.6% of Chinese domains poisoned more than one misspelling search
                                                                              result, while only 14.1% of the English domains appeared for multiple
present the top ﬁve languages in Table III for the whole dataset,             misspelling searches. The disparity between the English and Chinese
the Alexa domains, and the categories with higher malicious                   results indicates that the English attackers target individual terms, while
activity. The international ﬂavor of the Alexa domain dataset                 the Chinese domains contain a wider variety of misspellings.
probably explains the low percentage of English predictions
for the Alexa misspellings as many of the top sites serve non-                                         English                Chinese
English speakers. Similarly, the lower prevalence of English                                              Misspellings           Misspellings
predictions for the drug’s misspellings likely stems from the                                   Original    Targeted   Original    Targeted
many unusual drug product names.                                                 Device Type    Keywords by Attackers Keywords by Attackers
Domains (with blacklisted URLs) indexed by multiple                                 Desktop      36.05 %      11.96 % 39.74 %        21.22 %
                                                                                     Mobile      56.56 %      84.56 % 60.26 %        78.78 %
misspelled keywords. To better understand how attackers apply                         Tablet      7.40 %       3.48 %       —-            —-
linguistic-collision misspelling SEO, we analyze the mapping
                                                                              Table V: Device breakdown estimates obtained from the Google
between misspelled keywords and domains containing blacklisted
                                                                              Adwords Keyword Planner (we only use the relative numbers returned
URLs. Figure 9 displays the CDF of the number of non-auto-                    by Google Adwords as most of the data is imprecise) and Baidu Index.
corrected misspellings poisoned by the same domains.                          “Original Keywords” estimates market segmentation for all original
   In total, for English we saw 1,872 poisoned searches and                   English and Chinese terms, while “Misspellings Targeted by Attackers”
538 for Chinese. We observed a distinct difference in SEO                     estimates device usage for user searching for the linguistic-collision
                                                                              English and Chinese misspellings in the gambling, drugs, software,
tactics with Chinese attackers carefully using paid infrastructure            and adult term categories.
(e.g., xinnet.com) and English search poisoners utilizing free
hosting services (e.g., atspace.name). While only 14.1% of                    by enumerating hundreds of misspellings. While the resulting
the English domains appeared for more than one misspelling,                   text does not appear coherent to a human, the content is
38.6% of Chinese domains appeared more than once. For English                 obviously sophisticated enough to convince the search algorithms.
we observed 1,404 malicious domains that together used 2,394                  Together, these sites provide an interesting view into how the
unique blacklisted URLs indicating that some search results                   truly successful attackers achieve SEO for linguistic-collision
contained several blacklisted URLs. While some URLs were                      misspellings and also how they monetize their trafﬁc.
optimized to rank for several misspellings, the majority of URLs
were targeted at a single misspelling. Rather than attempt to                 C. Search Volume Analysis
build content with many misspellings, which might cause search                   To understand how attackers are able to achieve proﬁtability
engines and users to conclude the content is low quality, the                 with the linguistic-collision technique, we used the Google
attackers create over 100 webpages, each targeting different                  Adwords [33] toolsuite for the English dataset and Baidu
misspellings. The Chinese dataset contained 179 domains that                  Index [32] for the Chinese dataset.
deployed 264 URLs. In contrast to the English attacker’s reliance             Mobile and desktop trafﬁc breakdown. The device break-
on free hosting services to create many highly targeted pages,                down provides insight into how users arrive at the linguistic-
the Chinese domains tend to be paid and optimized for a wider                 collision misspelling results. While in general the device
variety of search terms.                                                      breakdown has similar characteristics between the original and
   In addition to considering the high level statistics, we also ex-          misspelled keywords, Table V shows that keywords from the
amined the ﬁve most successful second-level domains in the En-                traditional spam categories (gambling, drugs, software, and adult
glish dataset, which are shown in Table IV. Examining how these               terms) attract a much higher percentage of mobile users. These
sites achieve such effectiveness, we ﬁnd that wannajizz.com,                  results indicate that attackers may tend to target mobile users
hdvidzpro.me, and theunderweardrawer.co.uk use                                who are much more likely to misspell words by fat-ﬁngering.
misspelled URLs and page titles to appear in the ﬁrst page. On                Average search volume. To estimate how many users are
the other hand, the *.0catch.com and *.atspace.name                           exposed to blacklisted search results, we collected search volume
campaigns each used pages targeted at a single original term                  for the Chinese non-auto-corrected misspellings from Baidu

                                                                          1321

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
Figure 10: Trafﬁc volume estimates obtained from Baidu Index tool-            Figure 11: Cumulative percentage of blacklisted URLs in search results
suite for the Chinese results. The x-axis is the estimated number of          for decreasing search result position. Note that some URLs appeared
searches per day and the y-axis is the cumulative distribution function       in several search pages so we treat each appearance separately when
of individual category. From top to bottom, the curves represent all          calculating the CDF.
of the Chinese uncorrected misspellings and the Chinese poisoned
misspellings. Note that poisoned misspellings actually receive higher
                                                                      By searching small snippets of text from collected attacks, we
trafﬁc than the other cases indicating that the attackers carefully choose
the optimum misspellings.                                          easily ﬁnd over 100 other attack URLs using the same snippets
                                                                   to promote a variety of products. Because the resulting pages
Index (unfortunately Google Adwords no longer offers API have valid words (albeit in different languages), the attackers
access to trafﬁc volumes). Figure 10 displays the average daily are able to rank in the top 10 search results of misspellings
search volume for all of the uncorrected misspellings and the for adult sites, payday loans, gambling, writing services, and
poisoned misspellings. Although many of the poisoned search options trading kits. To monetize the trafﬁc, each site uses
terms receive little trafﬁc, some may achieve proﬁtability as afﬁliate marketing programs that lead to malicious downloads or
21.5% of the poisoned terms receive over 1,000 searches a phishing pages. For instance, a search for “hayday loans online”
day. The respectable search volumes per misspelling coupled (originally “payday loans online”) returns gin.890m.com,
with the fact that many of these attackers can appear for many where “hay” is a Spanish word meaning “there are”. The website
misspellings could allow attackers to accumulate signiﬁcant hosts a sign-up form from leadapi.net which asks users
trafﬁc volumes. Even more worrisome, the search volume results for social security numbers, date of birth, and bank account
suggest that the attackers are now incentivized to increase their information. We ﬁnd the campaign contains at least 20 websites
attacks and that the remaining attack surface is actually rather similar to gin.890m.com.
large.                                                             XieHe media (“协 和 影 视”). A malicious website
Rankings of search results. One might hope that the blacklisted sds.ccbkr.com has the title “协 和 影 视”. The website
URLs would be relegated to the bottom of the search results. induces users to install malicious software with free movies,
However, we ﬁnd that the attackers have managed to be ranked and also displays various advertisements related with gambling
ﬁrst for 9.5% of the English results. The Chinese blacklisted and adult content. However, the title “协和” is the same as the
URLs were less successful with only 2.7% as the ﬁrst result. As name of a large, well-known hospital in China. If a user directly
shown in Figure 11, the positions of blacklisted search results searches for “协和” on Baidu, most of the returned results are
for the English URLs appear to follow a uniform distribution, related to that hospital. Indeed, the website sds.ccbkr.com
while the Chinese results show comparatively lower ranking. will be positioned as the 93rd in the search results (far away
The disparity between the English and Chinese again seems to from the ﬁrst page) and it is unlikely that users will reach and
indicate that the Baidu ranking algorithm prioritizes reputed click the search result. On the other hand, if a user searches the
content sources (see Section VI-A).                                misspelled keyword “谐和” (which has the same pronunciation
                                                                   as “协和”), the malicious website will show as the ﬁrst in the
D. Case Studies                                                    search results. Cybercriminals abuse the Chinese misspelling
   To further explain how the attackers use linguistic-collision with the same pinyin to achieve higher rank in the search engine.
misspelling, we investigate two interesting cases that highlight In addition, we ﬁnd ccbkr.com sets wildcard DNS records
both attacker incentives and methods.                              to display the illicit content on arbitrary subdomains.
“Gambling siti” and “hayday loans online”. A campaign
                                                                                   VII. M ITIGATION D ISCUSSION
(involving 89 URLs ) mixes content in several languages
(with an emphasis on Germanic languages such as English,              Based on our ﬁndings, we propose several potential mitigation
Finish, and German) to promote advertisements. For example, strategies. Although afﬁliate networks should hold their afﬁliates
raswearsh.890m.com appears as the fourth result of the responsible for participating in linguistic-collision misspelling
search“gambling siti” which is a misspelling of “gambling site” SEO, the afﬁliate programs may lack the incentive to enforce
where “siti” is Italian for site. The webpage uses “Siti Gambling” such a policy. Realistically, the search engine providers are
as the title.                                                      probably in the best position to defend against linguistic-collision


                                                                          1322

           Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
misspelling by proactively correcting search variants to better to change owners more frequently and few trademark own-
protect users from attackers. While auto-correction services have ers protect themselves by registering typosquatting domains.
improved signiﬁcantly, the services could potentially beneﬁt Nikiforakis et al. [61] studied bit ﬂips in DNS requests (i.e., bit-
from other data sources. For example, Google Translate data squatting), where random bit-errors occurring in the memory of
could be used to identify illogical word combinations, words commodity hardware can redirect Internet trafﬁc to compromised
that are outside of the user’s normal language, and words that domains. Khan et al. [45] quantiﬁed the harm of typosquatting
are existent within the language but very rarely used. In addition, and found that a typical user loses a second when visiting a
search engine providers, such as Google and Baidu, could put typosquatting domain. Kintis et al. [62] studied a speciﬁc type
forward a more restrictive policy to limit users from purchasing of domain squatting, termed “combosquatting,” where attackers
misspelled search keywords and further disincentive afﬁliate register domains that combine a popular trademark with one or
networks caught using linguistic-collision misspellings.            more phrases. They found that combosquatting is used to perform
   Finally, free hosting services should more strictly enforce the a spectrum of different types of abuse including phishing, social
terms and conditions of use for attackers that are utilizing these engineering, afﬁliate abuse, trademark abuse, and even advanced
services to obtain free infrastructure. While we only mentioned persistent threats. In addition, several studies have suggested
0-catch.com and atspace.name previously, we observed domain squatters often use domain parking services to monetize
several other hosting sites (uol.com.br was another repeat their holdings [63–65]. Though the attack that we study has a
offender) that were allowing attackers to promote dangerous similar incentive to monetize on misspelled user inputs, unlike
or misleading ads (including at least one pyramid scheme). traditional domain typosquatting, linguistic-collision misspellings
Enforcing the terms and conditions for these hosting sites could circumvent current auto-correction defenses by using legitimate
make linguistic-collision misspelling SEO less proﬁtable for the words in other languages.
attackers and associating attacker activity to payment details Security analysis using deep learning. Recently, recurrent
should make the miscreants think twice.                             neural networks (RNNs) were used as a tool for generating fake
                                                                    Yelp reviews that are able to evade detection by humans and
                     VIII. R ELATED W ORK                           existing algorithms [12]. Long Short-Term Memory (LSTM)
                                                                    networks are a special type of RNN that have the ability
Search engine poisoning. A number of studies examine search to remember long-term dependencies over sequences. LSTM
engine poisoning where cybercriminals illicitly manipulate search networks have been applied to solve various security problems,
engine results. deSEO [56] generated URL signatures to detect such as vulnerability detection [66], website ﬁngerprinting [67],
malicious pages that are hosted on compromised legitimate and system logs anomaly identiﬁcation [11]. In our work, we
web servers for SEO attacks. SURF [57] designed a browser adapt an RNN architecture to predict misspellings that are likely
plugin to detect redirection chains and poisoned search results. to avoid auto-correction, to more efﬁciently identify linguistic-
Leontiadis et al. [58] conducted a measurement based study collision search terms.
on search redirection attacks for online illicit products and
found that the conversion rate was higher than email spam.                                IX. C ONCLUSION
Extending the initial work, Leontiadis et al. [39] performed a        In this paper, we conduct the ﬁrst large-scale measurement
four-year longitudinal study to examine the evolution of search analysis of search engine poisoning, evaluating over 1.77
engine poisoning, which highlighted a set of trafﬁc redirectors million searches on Google and Baidu. By using linguistics
and showed that the overall scale of search poisoning attacks and measurement techniques, we systematically analyze the
had increased steadily. Liao et al. [59] focused on long-tail linguistic-collision misspelling attack for English and Chinese.
search-result manipulation that uses cloud hosting platforms. We further develop a deep learning model to more efﬁciently
Wang et al. [60] studied the problem of exploiting autocomplete select non-auto-corrected misspelled keywords.
of suggested queries on search engines to promote illicit content.    Our ﬁndings reveal that linguistic-collision misspellings
Our research differs from previous search poisoning work in widely exist in search engines with 1.19% of search results
that we focus on linguistic-collision misspellings, a sophisticated on the ﬁrst page directing to blacklisted websites. We also
class of attacks, which evade current auto-correction defenses to discover the primary target is drug, gambling, and adult terms.
poison search results. We conduct the ﬁrst large-scale analysis In addition, we observe that mobile users disproportionately
to understand and characterize the abuse of linguistic-collision search for misspellings. Although search engine providers
misspellings to spread malicious content via search results.        have already reduced the attack surface of typosquatting by
Domain typosquatting. In domain typosquatting, attackers adding auto-correction, linguistic-collision misspellings present
register domain names that are purposefully similar to reputed a vulnerability that attackers can exploit to promote malicious
domains. Szurdi et al. [47] investigated long-tail typosquatting links. Our study sheds light on this new threat and provides
registrations, by combining both passive and active domain insights to ultimately mitigate the problem.
features to categorize typosquatting domains. Agten et al. [44]
focused on a sizeable set of typosquatting targets by using                             ACKNOWLEDGMENTS
crawled data over a seven-month monitoring period. They               We thank the anonymous reviewers for their valuable
found that typosquatting versions of popular domains appear comments to improve the paper. We thank Christian Kreibich


                                                                         1323

          Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
and the International Computer Science Institute for providing                              [20]   FDA. Public Notiﬁcation: “Clalis” Contains Hidden Drug Ingredient.
Spamhaus data. Minhui Xue is supported by the Optus Macquarie                                      https : / / www . fda . gov / Drugs / ResourcesForYou / Consumers /
                                                                                                   BuyingUsingMedicineSafely / MedicationHealthFraud / ucm359070 .
University Cyber Security Hub.
                                                                                                   htm. 2015.
                                 R EFERENCES                                                [21]   Search Engine Market Share. https : / / netmarketshare . com / search -
                                                                                                   engine-market-share.aspx. 2018.
 [1]   Internet World Stats. Number of Internet Users by Language. http :                   [22]   Philip Petrescu. Google Organic Click-Through Rates in 2014. https:
       //www.internetworldstats.com/stats7.htm. June 2017.                                         //moz.com/blog/google-organic-click-through-rates-in-2014. 2014.
 [2]   Amy Gesenhues. Organic Search Drives 51% Of Trafﬁc, Social Only                      [23]   Eric Sharp. The First Page of Google’s Search Results Is the Holy
       5%. http://searchengineland.com/study- organic- search- drives- 51-                         Grail for Marketers. https://www.protofuse.com/blog/details/ﬁrst-
       trafﬁc-social-5-202063. Aug. 2014.                                                          page-of-google-by-the-numbers/. Apr. 2014.
 [3]   Google. Search Engine Optimization Starter Guide. https : / / www .                  [24]   Fred J. Damerau. “A Technique for Computer Detection and Correc-
       google . com / webmasters / docs / search - engine - optimization - starter-                tion of Spelling Errors”. In: Communications of the ACM 7.3 (Mar.
       guide.pdf. Sept. 2017.                                                                      1964).
 [4]   Alexandros Ntoulas, Marc Najork, Mark Manasse, and Dennis Fet-                       [25]   V. I. Levenshtein. “Binary Codes Capable of Correcting Deletions,
       terly. “Detecting Spam Web Pages through Content Analysis”. In: 15th                        Insertions and Reversals”. In: Soviet Physics Doklady 10 (Feb. 1966).
       International Conference on World Wide Web (WWW). May 2006.                          [26]   Tyler Moore and Benjamin Edelman. “Measuring the Perpetrators
 [5]   Baoning Wu and Brian D Davison. “Identifying Link Farm Spam                                 and Funders of Typosquatting”. In: 14th International Conference on
       Pages”. In: 14th International World Wide Web Conference (WWW).                             Financial Cryptography and Data Security. Feb. 2010.
       May 2005.                                                                            [27]   Kazuya Kawakami, Chris Dyer, and Phil Blunsom. “Learning to
 [6]   Jennifer Slegg. Targeting Keyword Variations for Increased Search &                         Create and Reuse Words in Open-Vocabulary Neural Language Mod-
       Pay per Click Trafﬁc. http : / / www. jenniferslegg . com / 2007 / 04 / 06 /                eling”. In: Annual Meeting of the Association for Computational
       targeting- keyword- variations- for- increased- search- pay- per- click-                    Linguistics (ACL). July 2017.
       trafﬁc/. Apr. 2007.                                                                  [28]   Yoon Kim, Yacine Jernite, David Sontag, and Alexander M. Rush.
 [7]   David Z. Morris. German Court Orders Amazon to Stop ‘Typo-                                  “Character-Aware Neural Language Models”. In: 13th AAAI Confer-
       Targeting’ Ads for Birkenstocks. http : / / fortune . com / 2017 / 12 / 30 /                ence on Artiﬁcial Intelligence (AAAI). Feb. 2016.
       amazon-typo-targeting-birkenstock-advertising/. Dec. 2017.                           [29]   Martin Abadi, Ashish Agarwal, Paul Barham, Eugene Brevdo,
 [8]   Shubham Grover. Snickers Misspelling Search Keyword Campaign                                Zhifeng Chen, Craig Citro, Greg S. Corrado, Andy Davis, Jeffrey
       Reached 50K People In 3 Days. http : / / www . digitalvidya . com /                         Dean, Matthieu Devin, Sanjay Ghemawat, Ian Goodfellow, Andrew
       blog/snickers- misspelling- search- keyword- campaign- reached- 50k-                        Harp, Geoffrey Irving, Michael Isard, Yangqing Jia, Rafal Jozefowicz,
       people-in-3-days/. Oct. 2015.                                                               Lukasz Kaiser, Manjunath Kudlur, Josh Levenberg, Dan Mane, Rajat
 [9]   Greg Sterling. Nearly 60 Percent of Searches Now from Mobile                                Monga, Sherry Moore, Derek Murray, Chris Olah, Mike Schuster,
       Devices. http : / / searchengineland . com / report - nearly - 60 - percent -               Jonathon Shlens, Benoit Steiner, Ilya Sutskever, Kunal Talwar, Paul
       searches-now-mobile-devices-255025. Aug. 2016.                                              Tucker, Vincent Vanhoucke, Vijay Vasudevan, Fernanda Viegas, Oriol
[10]   Chen Yuan. Chinese Language Processing. Shanghai Education Pub-                             Vinyals, Pete Warden, Martin Wattenberg, Martin Wicke, Yuan Yu,
       lishing Company, 1997.                                                                      and Xiaoqiang Zheng. TensorFlow: Large-Scale Machine Learning
[11]   Min Du, Feifei Li, Guineng Zheng, and Vivek Srikumar. “DeepLog:                             on Heterogeneous Systems. 2015. URL: https://www.tensorﬂow.org/.
       Anomaly Detection and Diagnosis from System Logs through Deep                        [30]   Diederik P. Kingma and Jimmy Ba. “Adam: A Method for Stochastic
       Learning”. In: 24th ACM Conference on Computer and Communica-                               Optimization”. In: CoRR abs/1412.6980 (2014). URL: http://arxiv.org/
       tions Security (CCS). Oct. 2017.                                                            abs/1412.6980.
[12]   Yuanshun Yao, Bimal Viswanath, Jenna Cryan, Haitao Zheng, and                        [31]   Sogou Pinyin Input Dictionaries. https : / / pinyin . sogou . com / dict/.
       Ben Y. Zhao. “Automated Crowdturﬁng Attacks and Defenses in                                 2018.
       Online Review Systems”. In: 24th ACM Conference on Computer and                      [32]   Baidu Index. https://zhishu.baidu.com/. Jan. 2018.
       Communications Security (CCS). Oct. 2017.                                            [33]   Google. Google Adwords. https : / / adwords . google . com / home/. Jan.
[13]   Sepp Hochreiter and Jurgen Schmidhuber. “Long Short-Term Mem-                               2018.
       ory”. In: Neural Computation 9.8 (Nov. 1997).                                        [34]   Google. Google Translate API. https : / / cloud . google . com / translate.
[14]   Jennifer Valentino-DeVries. What Words Get Misspelled in Web                                Mar. 2018.
       Searches? https : / / blogs . wsj . com / digits / 2010 / 06 / 04 / what - words -   [35]   Google. Google Safe Browsing API. https://safebrowsing.google.com/.
       get-misspelled-in-web-searches/. June 2010.                                                 Mar. 2018.
[15]   Christopher Mele. Is Wisconsin Really That Hard to Spell? https : / /                [36]   Yandex. Safe Browsing API. https://tech.yandex.com/safebrowsing/.
       www.nytimes.com/2017/05/31/us/misspelled-words-states.html. May                             Mar. 2018.
       2017.                                                                                [37]   Spamhaus. Spamhaus. http://www.spamhaus.org/. Mar. 2018.
[16]   Marjory Meechan. Google’s Algorithm Update for Misspelled Words:                     [38]   Baidu. Baidu-International Antivirus. http://antivirus.baidu.com/en/.
       A Big Change for SEO. https://www.morevisibility.com/blogs/seo/                             Mar. 2018.
       googles- algorithm- update- for- misspelled- words- a- big- change- for-             [39]   Nektarios Leontiadis, Tyler Moore, and Nicolas Christin. “A Nearly
       seo.html. Dec. 2008.                                                                        Four-Year Longitudinal Study of Search-Engine Poisoning”. In: 21st
[17]   Xiaoqing Hu. “The Examples Analysis of Chinese-Error Correction                             ACM Conference on Computer and Communications Security (CCS).
       Function in Search Engines”. In: Library and Information Service                            Oct. 2014.
       Online (2008).                                                                       [40]   Ranker. https://www.ranker.com. Mar. 2018.
[18]   Kirill Levchenko, Neha Chachra, Brandon Enright, Mark Felegyhazi,                    [41]   Defense News. http://people.defensenews.com/top-100/. Nov. 2017.
       Chris Grier, Tristan Halvorson, Chris Kanich, Christian Kreibich,                    [42]   Pharmaceutical Spam Keywords. http://www.localseoguide.com/the-
       He Liu, Damon McCoy, Andreas Pitsillidis, Nicholas Weaver, Vern                             ultimate-list-of-pharmaceutical-spam-keywords/. Nov. 2017.
       Paxson, Geoffrey M. Voelker, and Stefan Savage. “Click Trajectories:                 [43]   Kaggle. Kaggle Datasets. https : / / www. kaggle . com / datasets. Nov.
       End-to-End Analysis of the Spam Value Chain”. In: 32nd IEEE                                 2017.
       Symposium on Security and Privacy. May 2011.                                         [44]   Pieter Agten, Wouter Joosen, Frank Piessens, and Nick Nikiforakis.
[19]   VirusTotal. VirusTotal. https://www.virustotal.com. Mar. 2018.                              “Seven Months’ Worth of Mistakes: A Longitudinal Study of Ty-
                                                                                                   posquatting Abuse”. In: 22nd Annual Network & Distributed System
                                                                                                   Security Symposium (NDSS). Feb. 2015.



                                                                                       1324

            Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
[45]   Mohammad Taha Khan, Xiang Huo, Zhou Li, and Chris Kanich.               [66]   Zhen Li, Deqing Zou, Shouhuai Xu, Xinyu Ou, Hai Jin, Sujuan Wang,
       “Every Second Counts: Quantifying the Negative Externalities of                Zhijun Deng, and Yuyi Zhong. “VulDeePecker: A Deep Learning-
       Cybercrime via Typosquatting”. In: 36th IEEE Symposium on Security             Based System for Vulnerability Detection”. In: 25th Annual Network
       and Privacy. May 2015.                                                         & Distributed System Security Symposium (NDSS). Feb. 2018.
[46]   Alexa. Alexa List. https://www.alexa.com/topsites. Nov. 2017.           [67]   Vera Rimmer, Davy Preuveneers, Marc Juarez, Tom Van Goethem,
[47]   Janos Szurdi, Balazs Kocso, Gabor Cseh, Jonathan Spring, Mark                  and Wouter Joosen. “Automated Website Fingerprinting through Deep
       Felegyhazi, and Chris Kanich. “The Long “Taile” of Typosquatting               Learning”. In: 25th Annual Network & Distributed System Security
       Domain Names”. In: 23rd USENIX Security Symposium. Aug. 2014.                  Symposium (NDSS). Feb. 2018.
[48]   Google. Google Adwords Keyword Planner. https : / / support . google.
       com/adwords/answer/2999770?hl=en. Jan. 2018.                                                           A PPENDIX
[49]   Peter Norvig. Peter Norvig N-grams Dataset. http : / / norvig . com /
                                                                               A. RNN Comparison to Random Forest and Naive Bayes
       ngrams/. Jan. 2018.
[50]   Open Ofﬁce Dictionary. https://extensions.openofﬁce.org/en/project/        We compare the accuracy of non-auto-corrected predictions of
       us-english-spell-checking-dictionary. Jan. 2018.                        our RNN model with random forest and naive Bayes algorithms
[51]   Assorted English Words List. https://github.com/dwyl/english-words.
                                                                               using two approaches for each algorithm.
       Jan. 2018.
[52]   John Lawler. An English Word List. http://www-personal.umich.edu/       Approach 1. The ﬁrst approach directly classiﬁes whether a
       ∼jlawler/wordlist.html. Mar. 1999.                                      misspelling string is likely to be non-auto-corrected by Google.
[53]   Michael Hodgdon. Value of Organic First-Page Results. https://www.      The brute-force search results of manually selected categories
       infront.com/blog/the- infront- blog/2015/06/17/value- of- ﬁrst- page-   contain both positive and negative cases, which we use as the
       google-results. June 2015.
[54]   Damon McCoy, Andreas Pitsillidis, Jordan Grant, Nicholas Weaver,
                                                                               training dataset. Because both of the classiﬁcation algorithms
       Christian Kreibich, Brian Krebs, Geoffrey Voelker, Stefan Savage,       require ﬁxed length input vectors, we pad the variable length
       and Kirill Levchenko. “PharmaLeaks: Understanding the Business of       words with null values. After training, the algorithms estimate
       Online Pharmaceutical Afﬁliate Program”. In: 21st USENIX Security       the probability that a given misspelling will be autocorrected.
       Symposium. Aug. 2012.
                                                                               However, because the ground truth data is generated from
[55]   Google. Google Autocomplete Policies. https://support.google.com/
       websearch/answer/7368877. Mar. 2018.                                    relatively few original terms (compared to all possible words in
[56]   John P John, Fang Yu, Yinglian Xie, Arvind Krishnamurthy, and           use on the Internet), the algorithms struggle to generalize for
       Martin Abadi. “deSEO: Combating Search-Result Poisoning”. In:           misspellings generated from other original terms.
       20th USENIX Security Symposium. Aug. 2011.                              Approach 2. The second approach is similar to the one that
[57]   Long Lu, Roberto Perdisci, and Wenke Lee. “SURF: Detecting and
       Measuring Search Poisoning”. In: 18th ACM Conference on Computer        we developed in Section IV. In this approach, we generate a
       and Communications Security (CCS). Oct. 2011.                           training dataset from dictionary words. The classiﬁer learns the
[58]   Nektarios Leontiadis, Tyler Moore, and Nicolas Christin. “Measuring     future character distribution based on the preﬁxes. The entropy
       and Analyzing Search-Redirection Attacks in the Illicit Online Pre-     of a prediction estimate the likelihood whether a misspelling
       scription Drug Trade”. In: 20th USENIX Security Symposium. Aug.
       2011.
                                                                               candidate will be automatically corrected.
[59]   Xiaojing Liao, Chang Liu, Damon McCoy, Elaine Shi, Shuang Hao,             For misspellings from Alexa top 1,001–10,000 terms, our
       and Raheem Beyah. “Characterizing Long-tail SEO Spam on Cloud           RNN approach achieves a hitting rate of 38.04% (as shown
       Web Hosting Services”. In: 25th International Conference on World       in Table II). At the same hitting rate on the Alexa top 1K
       Wide Web (WWW). May 2016.                                               ground truth, we need to collect 127,438 searches with the best
[60]   Peng Wang, Xianghang Mi, Xiaojing Liao, XiaoFeng Wang, Kan
       Yuan, Feng Qian, and Raheem Beyah. “Game of Missuggestions:             predictions from the RNN. When crawling the same number of
       Semantic Analysis of Search-Autocomplete Manipulations”. In: 25th       searches, the naive Bayes model with approach 1 yields a hit
       Annual Network & Distributed System Security Symposium (NDSS).          rate of 13.6% . We hypothesize that the naive Bayes model’s
       Feb. 2018.                                                              poor performance stems from the strong dependency between
[61]   Nick Nikiforakis, Steven Van Acker, Wannes Meert, Lieven Desmet,
       Frank Piessens, and Wouter Joosen. “Bitsquatting: Exploiting Bit-ﬂips
                                                                               adjacent characters. For approach 2, naive Bayes achieves a
       for Fun, or Proﬁt?” In: 22nd International Conference on World Wide     hit rate of 15.2% (most likely due to the reduced input size).
       Web (WWW). May 2013.                                                    Since random forests can capture dependencies between input
[62]   Panagiotis Kintis, Najmeh Miramirkhani, Charles Lever, Yizheng          features, the random forest classiﬁer outperforms naive Bayes
       Chen, Rosa Romero-Gomez, Nikolaos Pitropakis, Nick Nikiforakis,         for both approach 1 and approach 2. For approach 1, random
       and Manos Antonakakis. “Hiding in Plain Sight: A Longitudinal Study
       of Combosquatting Abuse”. In: 24th ACM Conference on Computer           forest exhibits a hit rate of 29.9%, and for approach 2 the hit
       and Communications Security (CCS). Oct. 2017.                           rate is 22.8%, both of which are less efﬁcient than the RNN
[63]   Sumayah Alrwais, Kan Yuan, Eihal Alowaisheq, Zhou Li, and Xi-           predictions.
       aoFeng Wang. “Understanding the Dark Side of Domain Parking”. In:
       23rd USENIX Security Symposium. Aug. 2014.
[64]   Thomas Vissers, Wouter Joosen, and Nick Nikiforakis. “Parking Sen-
       sors: Analyzing and Detecting Parked Domains”. In: 22nd Annual
       Network & Distributed System Security Symposium (NDSS). Feb.
       2015.
[65]   Najmeh Miramirkhani, Oleksii Starov, and Nick Nikiforakis. “Dial
       One for Scam: A Large-Scale Analysis of Technical Support Scams”.
       In: 24th Annual Network & Distributed System Security Symposium
       (NDSS). Feb. 2017.



                                                                           1325

            Authorized licensed use limited to: IEEE Xplore. Downloaded on August 09,2026 at 08:36:45 UTC from IEEE Xplore. Restrictions apply.
