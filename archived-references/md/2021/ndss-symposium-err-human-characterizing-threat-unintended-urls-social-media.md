---
type: Article
title: "To Err.Is Human: Characterizing the Threat of Unintended URLs in Social Media"
resource: "https://www.ndss-symposium.org/ndss-paper/to-err-is-human-characterizing-the-threat-of-unintended-urls-in-social-media/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:46:28+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/to-err-is-human-characterizing-the-threat-of-unintended-urls-in-social-media/"
    title: "To Err.Is Human: Characterizing the Threat of Unintended URLs in Social Media"
    author: Beliz Kaleli, Brian Kondracki, Manuel Egele, Nick Nikiforakis, Gianluca Stringhini
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/ndss2021_3A-4_24322_paper.pdf"
authors:
  - Beliz Kaleli
  - Brian Kondracki
  - Manuel Egele
  - Nick Nikiforakis
  - Gianluca Stringhini
canonical_url: ""
cited_by:
  - "2021.md:66"
commit: ""
content_sha256: e76ae2de9aa3486a85bee97ba9a080ed20214453306f3d22ce45b8d6ddf645a5
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/to-err-is-human-characterizing-the-threat-of-unintended-urls-in-social-media/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 1071444305047a325156508de7eea5aad9c30a24302e92ffeacfc6e3acf109b1
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/ndss2021_3A-4_24322_paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:46:28+00:00"
slug: ndss-symposium-err-human-characterizing-threat-unintended-urls-social-media
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# To Err.Is Human: Characterizing the Threat of Unintended URLs in Social Media

**To Err.Is Human: Characterizing the Threat of Unintended URLs in Social Media** - Beliz Kaleli, Brian Kondracki, Manuel Egele, Nick Nikiforakis, Gianluca Stringhini, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/to-err-is-human-characterizing-the-threat-of-unintended-urls-in-social-media/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/ndss2021_3A-4_24322_paper.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/ndss2021_3A-4_24322_paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

To Err.Is Human: Characterizing the Threat of
             Unintended URLs in Social Media

     Beliz Kaleli                Brian Kondracki                  Manuel Egele         Nick Nikiforakis         Gianluca Stringhini
  Boston University            Stony Brook University            Boston University   Stony Brook University      Boston University
   bkaleli@bu.edu           bkondracki@cs.stonybrook.edu          megele@bu.edu      nick@cs.stonybrook.edu        gian@bu.edu


    Abstract—To make their services more user friendly, online so-       them and render them as clickable. For example, if Twitter
cial media platforms automatically identify text that corresponds        detects a URL in the text of a tweet, that part will be
to URLs and render it as clickable links. In this paper, we show         highlighted and users that have access to the tweet will be
that the techniques used by such services to recognize URLs are          able to visit the link by just clicking on it. If the target Web
often too permissive and can result in unintended URLs being             page contains a so-called Twitter Card, a preview of the link
displayed in social network messages. Among others, we show that
popular platforms (such as Twitter) will render text as a clickable
                                                                         will also be added to the tweet [1].
URL if a user forgets a space after a full stop at the end of a              In this paper, we identify a potential attack vector in the
sentence, and the first word of the next sentence happens to be a        way in which online social networks parse text and decide
valid Top Level Domain. Attackers can take advantage of these            which parts of it should be rendered as clickable URLs. We
unintended URLs by registering the corresponding domains and
exposing millions of Twitter users to arbitrary malicious content.
                                                                         show that it is not uncommon for social network users to
To characterize the threat that unintended URLs pose to social           supply text that is not supposed to be rendered as a clickable
media users, we perform a large-scale study of unintended URLs           URL, yet the automated means by the social network platform
in tweets over a period of 7 months. By designing a classifier           mistakenly render it as such. Figure 1 depicts three typical
capable of differentiating between intended and unintended URLs          examples of unintended URLs included in tweets. These
posted in tweets, we find more than 26K unintended URLs posted           examples showcase how unintended URLs enable third parties
by accounts with tens of millions of followers. As part of our study,    (well-meaning or malicious) to compromise the integrity of
we also register 45 unintended domains and quantify the traffic          Twitter messages and expose the followers of popular Twitter
that attackers can get by merely registering the right domains           accounts to arbitrary content. For example, when Rudy Giu-
at the right time. Finally, due to the severity of our findings,         liani (with 714.2K followers) tweeted the following on Novem-
we propose a lightweight browser extension which can, on the
fly, analyze the tweets that users compose and alert them of
                                                                         ber 30, 2018: “[...] as the President left for
potentially unintended URLs and raise a warning, allowing users          G-20.In July he indicted [...] [10],” the miss-
to fix their mistake before the tweet is posted.                         ing space between “G-20.” and “In” caused Twitter to
                                                                         interpret that part of the sentence (g-20.in) as a URL (even
                                                                         though that domain was not registered at the time) and made
                       I.    I NTRODUCTION
                                                                         that part clickable. The g-20.in domain was registered on
    Social media platforms like Twitter, Facebook, and                   the same day and served content that was critical of Mr.
Linkedin are increasingly becoming the main way in which                 Giuliani and his policies.
people obtain news and communicate with the rest of the
                                                                             We present the first analysis of the threat of unintended
world. Twitter, as one of the most popular of these platforms,
                                                                         URLs on social media, with a particular focus on Twitter. We
was shown to be able to shape political campaigns [29] and
                                                                         start by presenting a threat model detailing how unintended
even affect the number of citations that academic papers
                                                                         URLs can result from user posts which pose a threat to anyone
receive [23]. At the same time, the popularity of the platform
                                                                         who has access to these posts. As part of this process, we
has made it the ideal target for a variety of malicious activities,
                                                                         evaluate nine popular social media platforms and instant mes-
from spam [18], [25], [41], to online harassment [20], [32],
                                                                         saging applications (including Twitter, Facebook, LinkedIn,
[38], [46], to misinformation [16], [39], [53]. In the most
                                                                         and Slack) to understand their behavior and identify the logic
recent high-profile example (July 2020), a sophisticated tar-
                                                                         that they follow for expanding text into clickable URLs.
geted attack showed the consequences that a compromise of
the platform can have, resulting in multiple popular accounts                To characterize the threat of unintended URLs in the wild,
posting links to a Bitcoin scam [7].                                     we perform a large-scale measurement study on Twitter where
                                                                         we analyze public tweets from the 1% streaming API posted
   To improve the usability of their platforms, many online
                                                                         between January 2020 and July 2020, in search of unintended
social networks automatically recognize links as users type
                                                                         URLs. By manually analyzing tweets that include URLs, we
                                                                         build a ground truth dataset of intended and unintended URLs
                                                                         which we use to train a machine learning model that can
Network and Distributed Systems Security (NDSS) Symposium 2021           differentiate between these two classes with 94% accuracy.
21-25 February 2021, Virtual
ISBN 1-891562-66-5                                                       We use this model to set up a pipeline that automatically
https://dx.doi.org/10.14722/ndss.2021.24322                              identifies unintended URLs; over a period of 7 months, our
www.ndss-symposium.org                                                   pipeline identified 26,596 unintended URLs. In parallel to
                                                                           •    We conduct a large-scale analysis of unintended URL
                                                                                websites using an automated data-collection infras-
                                                                                tructure. By registering 45 domains that appear as un-
                                                                                intended URLs on Twitter, we find that these domains
                                                                                receive spikes in traffic after a tweet is published. We
                                                                                also discover malicious content present on unintended
                                                                                URL websites.
                                                                           •    We build a Chrome extension for Twitter as a counter-
                                                                                measure to the problem at hand that can preemptively
                                                                                predict unintended URLs in tweets and warns the
                                                                                author.

                                                                                   II.   M OTIVATION AND BACKGROUND
                                                                            In this section, we first present background information
                                                                        on the DNS system and then define unintended URLs. Next,
                                                                        we report on a number of experiments that we conducted to
                                                                        understand how different online services identify and render
                                                                        links. We then provide a rationale for why we focus on Twitter
                                                                        in this paper and provide background information about the
                                                                        platform. Finally, we present a threat model illustrating how an
                                                                        adversary could exploit unintended URLs for malicious gain.

                                                                        A. Top Level Domains (TLD)
                                                                            A top level domain (TLD) is the domain at the highest level
                                                                        in the hierarchical Domain Name System. The TLD is the last
                                                                        label in a domain name, e.g., in “www.twitter.com,” the
                                                                        com label is the TLD. ICANN controls generic TLDs such as
Fig. 1: Examples of unintentional URLs posted by popular accounts       .com and .net whereas country-code TLDs (such as, .it
on Twitter. (Rudy Giuliani: 714.2K followers, Urban Dictionary:         and .es) are controlled by institutions within their respective
300.1K followers, Kanye West: 30.6M followers.)                         countries. In this paper, we are mostly interested in the TLDs
                                                                        that are also valid dictionary words, either by chance (such
                                                                        as the article “it” also being the cc-TLD for Italy) or on
                                                                        purpose (such as “online” which is also a recent generic
scanning the unintended URLs for evidence of abuse, we use              TLD available to the public).
our model to register a total of 45 domains, within hours after
they were tweeted by popular accounts. Through this process,
we find that unintended URLs receive an average of 103.65               B. Unintended URLs
visitors within one day of appearing in a tweet, with our most              In this paper, we consider an unintended URL as any string
popular URL receiving 755 visits. Our results demonstrate               that is typed by a user on an online service and is rendered
the very real danger that unintended URLs pose to social                as a clickable link without the user intending it to be a URL.
media and how opportunistic attackers can hijack the content            To be interpreted as a URL by an online service, a string has
of social media posts, without compromising the user who                to contain at least two substrings, a dot and no spaces. In
posted them. Finally, to help users defend against unintended           particular, the last substring needs to be a TLD.
URLs, we implement our classifier in a browser extension that
warns users whenever they type an unintended URL before                      A common reason that causes unintended URLs to occur is
posting a tweet, allowing them to correct their mistake. We             users making a typo [12] omitting a space after a dot at the end
will publicly release the source code of this browser extension         of a sentence, where the first word of the next sentence happens
upon publication of this paper.                                         to be a TLD. For example, consider the following text extracted
                                                                        from a real tweet: “I will always support you.You always
In summary, the contributions of this paper are as follows:             support others.” Here the unintended URL is you.You and
                                                                        it is converted to a clickable link by Twitter since “You” is
   •    We show that automatically rendering unintended                 an actual TLD name.
        URLs can cause vulnerabilities in online services, and
        present a threat model in which an adversary abuses                 A similar error made by users is forgetting a space after
        this phenomenon to launch various attacks on users              a number when they are listing items. For example, in the
        who click on those unintentional links.                         following tweet: “1.Team Leader - Outlet 2.Assistant Manager
                                                                        - Outlet 3.Executive Housekeeper” the user forgot to put a
   •    We identify characteristics of unintended URLs by               space for all the list items. However, only “1.Team” is
        building a classifier that predicts those URLs in col-          converted to a URL since “Team” is a real TLD whereas
        lected Twitter data and analyzing our results.                  “Assistant” and “Executive” are not.

                                                                    2
    Another common way to cause an unintended URL is users              validity of a TLD. Skype and Google Hangouts only rendered
putting a dot between two words in the same sentence instead            a link if it starts with “www.”
of a space. Users sometimes use this method to emphasize
                                                                            Our experiments show that the most permissive platforms
these words. For instance, we excerpted the following from a
                                                                        are Linkedin, Twitter, Snapchat, and Whatsapp Web. To further
real tweet: “Dont you know who.I.am?” The proper punctua-
                                                                        understand the threats posed by unintended URLs we decide
tion would be to put spaces between the words “who,” “I” and
                                                                        to focus on Twitter for the rest of this paper. Our reasons for
“am”. The author put dots instead of spaces and caused the
                                                                        this decision have to do with the nature of social media vs.
unintended URL, “who.I.am” to be rendered as clickable by
                                                                        instant messaging applications as well as the overall popularity
Twitter.
                                                                        of the Twitter platform. Specifically, the potential threat posed
                                                                        by unintended URLs on instant messaging apps is lower than
C. Understanding the Link Rendering Behavior of Online                  on social media platforms, because only the users inside the
Services                                                                chat can access the unintended URLs. In terms of popularity,
                                                                        Twitter is not only more popular than LinkedIn (Alexa Rank
    In an effort to make their platforms more user friendly,
                                                                        50 vs. 63) but Twitter posts are public by default, thereby
online services automatically render the text that they identify
                                                                        exposing more users to the threat of unintended URLs.
as a URL, as clickable links. The precise algorithm for rec-
ognizing URLs in the user-provided text is something internal
                                                                        D. Twitter Features
to each online service and, to the best of our knowledge, not
known to the public.                                                        In this section we briefly describe the Twitter features
                                                                        relevant to the issue of unintended URLs, to allow unfamiliar
    In this section, we aim to understand the mechanisms used           readers to follow the remaining of the paper.
by different online services to identify and render clickable
links. To this end, we test nine popular social media and                       a) Link Preview and Rendering: Twitter detects links
instant messaging platforms for their automatic URL rendering           in plain text and automatically renders them as URLs. As a
functionality, applying 23 different test cases to each one. Our        user types a tweet, Twitter shows it as a link by turning that
test cases are essentially strings without spaces containing at         portion of the text blue. Twitter also provides a link preview
least one dot so that they can be interpreted as URLs. We               functionality. If a linked website uses Twitter Cards [1], the
try posting these strings in different platforms and observe            posted tweet will include a link preview consisting of an image,
whether the posted string is clickable (i.e., rendered as a URL         title and description of the posted link. These types of previews
by each platform). These strings are different combinations of          are generated by Twitter after the user posts a tweet, whereas
the following conditions:                                               the link highlighting happens as users type their tweets.

   •    Contains an existing domain name (XDOMAIN)                              b) Retweet Types: Retweeting is a mechanism that
                                                                        allows Twitter users to share another user’s tweet and making
   •    Contains a non-existing domain name (NXDOMAIN)                  it appear on their timeline, which is also accessible by the
                                                                        user’s followers. As a result, retweeting increases the impact
   •    Contains a capital letter after a dot                           of the tweet because it makes it visible to more users. Twitter
   •    Contains a traditional TLD (e.g., .net)                         allows two different types of retweets. The first one is simple
                                                                        retweeting, in which the other user’s tweet appears exactly as it
   •    Contains a new TLD (e.g., .dev)                                 is in the retweeter’s timeline. This method increases the retweet
   •    Contains an invalid TLD (i.e., .ttt)                            count of a tweet by one each time a different user retweets.
                                                                        The second method is retweeting with a comment. Here, the
   •    Contains a number as the domain name                            original tweet is compressed in a box and the comment is
                                                                        shown as a regular tweet on top of this box. The original tweet
   •    Starts with “www”                                               loses its features, such as the link preview, highlighted links
   •    Contains a subdomain                                            and images. This method does not increase the retweet count
                                                                        of a tweet.
    Our test results are shown in Table I. The platforms
that resulted in the exact same results for all 23 test cases           E. Threat Model
are grouped together. For all tested platforms, test cases that
                                                                            Twitter does not have a mechanism to check spelling or
contain NXDOMAIN and XDOMAIN (conjugates of each
                                                                        punctuation and anyone can create an account and post tweets
other) returned the same results. Thus, we conclude that
                                                                        in seconds. According to our data gathering, approximately
none of the platforms perform a name server lookup before
                                                                        400 million tweets are posted by users on a daily basis. Given
automatic rendering. We observe that Linkedin does not have
                                                                        the lack of native spell checking, the onus (or choice) of proper
any sort of mechanism to distinguish between an unintentional
                                                                        spelling falls unto the users. As a result, tweets including typos
and an intentional URL. Twitter, Snapchat and Whatsapp Web
                                                                        are not uncommon. Due to the aforementioned retweeting
do not render text as a link if the text contains an invalid TLD.
                                                                        mechanism, a typo in a tweet of an unpopular user can still
Slack, Facebook and Whatsapp Mobile do not render the links
                                                                        be shown to millions of users, if a popular user somehow
with the recent TLD .dev. The reason could be that those
                                                                        discovers and retweets that typo-including tweet. The same
platforms have not yet updated their TLD list in their servers
                                                                        goes for other types of unintended URLs.
since they also did not render the link with an invalid TLD.
Telegram was the only platform that has an algorithm that                  Figure 2 provides an example attack scenario for the
checks the occurrence of a capital letter after a dot and the           type of vulnerability studied in this paper. First, a Twitter

                                                                    3
                                                                Twitter                 Slack
                                                                                                                            Skype
    NX Test URLs               X Test URLs       Linkedin      Snapchat               Facebook           Telegram
                                                                                                                       Google Hangouts
                                                             Whatsapp Web          Whatsapp Mobile
     notdomain.net                php.net           C             C                       C                  C                 U
     notdomain.Net               php.Net            C             C                       C                  U                 U
     notdomain.dev               web.dev            C             C                       U                  C                 U
     notdomain.Dev               web.Dev            C             C                       U                  U                 U
   sub.notdomain.net         windows.php.net        C             C                       C                  C                 U
  sub.Notdomain.Net          windows.Php.Net        C             C                       C                  U                 U
   sub.notdomain.dev           auth.web.dev         C             C                       U                  C                 U
  sub.Notdomain.Dev           auth.Web.Dev          C             C                       U                  U                 U
          5.net                   123.net           C             C                       C                  C                 U
         5.dev                     1.dev            C             C                       U                  C                 U
  www.notdomain.dev           www.web.dev           C             C                       C                  C                 C
   notdomain.notatld                 -              C             U                       U                  U                 U

TABLE I: Unintended URL test results on different social media and messaging platforms. “U” depicts test URL is not clickable after posting
whereas “C” depicts test URL is clickable after posting on the particular platform.



         Alice                       Bob         Mallory                      In this section, we describe our process for curating this
                                                                         ground truth dataset and the features that we use for our clas-
                         1                                               sifier. We then present the accuracy of the resulting classifier
                                                                         and how we use it to measure the phenomenon and abuse
                                                                         of unintended URLs in the wild. Our analysis pipeline is
                                                        3                illustrated in Figure 3.
                                             5
         2                       4
                                                                         A. Automatically Detecting Unintended URLs on Twitter
                                                                            To study the threat of unintended URLs on Twitter at scale,
                 Alice@alice                                             we first need to be able to automatically distinguish between
                                                                         unintended and intended URLs. To this end, we develop a
      My paper got accepted at NDSS2021.How exciting!                    machine learning model.
                                                                             We manually label and analyze Twitter data to identify
                                                                         promising features for our model and develop a ground truth
Fig. 2: Attack scenario on how an attacker (Mallory) can weaponize       set. To build our model, we follow three steps: i) data gath-
the unintended URLs posted by a user (Alice) to expose Alice’s           ering, ii) prefiltering, and iii) feature engineering. These steps
followers (such as Bob) to malicious content.                            are described in detail in the rest of this section.
                                                                                 a) Data Gathering: We collect the 1% sample of all
                                                                         public tweets posted worldwide using the Twitter streaming
user (Bob) follows Alice on Twitter (Step 1) who, at some                API [3] between January 2020 and July 2020. To build our
point, posts a tweet containing an unintended URL (Step                  ground-truth dataset, we extract five days of data from the
2). Mallory observes this, registers the unintended domain               collected tweets. This set consists of approximately 20M
(NDSS2021.how in our example) controlling that URL, and                  tweets of which around 3M (15%) containing URLs.
points it to a malicious server (Step 3). Eventually, Alice’s
                                                                             We use this set to gain insights about the differences
tweet appears on Bob’s timeline (Step 4) who clicks on the link
                                                                         between unintended URLs and intentional URLs. Our obser-
and is now exposed to Mallory’s malicious content (Step 5).
                                                                         vations in this step helped us to identify prefiltering conditions
If Alice’s followers retweet Alice’s tweet (either because they
                                                                         and design model features.
did not pay attention to the URL or because they retweeted it
before Mallory registered it) the reach of that unintended URL                  b) Prefiltering: We first apply a prefiltering procedure
can increase exponentially.                                              to our set of tweets to remove links that are unlikely to be
                                                                         unintentional, based on our threat model and our preliminary
                                                                         observations. This step of our model-developing stage allows
                      III.     M ETHODOLOGY                              us to have a simpler and more accurate model without unnec-
    As we show in the previous sections, the threat of un-               essary features.
intended URLs in social media is a real one, not just for                   In this step, we first filter out the tweets that do not contain
the average Twitter user, but for accounts with millions of              any URL since those tweets are not of interest for this work.
followers. To be able to characterize this phenomenon in the             This leaves us with approximately 3 million tweets per day.
wild, we must first compile a ground truth dataset containing            Then we apply the following filters:
Tweets with intended and unintended URLs. We will then use
this ground truth to train a classifier able to automatically               •    URLs starting with “www”: We discard the tweets
identify unintended URLs on Twitter.                                             that have URLs starting with “www” since “www” is

                                                                     4
Fig. 3: System Diagram: Twitter data is collected daily throughout the experiment. We extract five days of tweets from the Twitter 1% streaming
API. We then apply prefiltering to this set. The resulting tweets are labeled manually to get the ground truth set and features are obtained.
We then train a linear SVM classifier to obtain the final model. We use this model to get unintended domain predictions for the rest of the
experiment. Then, we register unintended domains if suitable, and monitor the traffic to these domains. For those unintended domains that
have a third party website pointing to them, we crawl their home pages and record screenshots. From the obtained information, we cluster
unintended domains. Finally, we develop a mitigation by building a Chrome extension using our final model.



         not a dictionary word and therefore someone who                     •     URLs having TLDs that are not dictionary words:
         explicitly types “www” is clearly intending to post a                     Given that our intuition is that unintended URLs
         URL.                                                                      are constructed by concatenating real words, we also
                                                                                   filter URLs with TLDs that are not English dictionary
   •     Non-English tweets: For this paper, we focus on                           words.
         Twitter accounts that tweet in English. This allows
         us to reason about the intended/unintended nature of                 After prefiltering, we identify a set of 1,068 tweets that
         URLs using common grammar rules as well as later                 potentially contain unintended URLs. To determine which of
         utilize NLP tools that work best on English corpus.              these URLs are indeed unintended, we follow an inductive
         Understanding whether unintended URLs happen in                  approach, with three authors of this paper discussing them
         other languages is an interesting path for future work           until a good agreement is reached. After this process, our final
         but outside the scope of this paper. After filtering out         ground truth set is labeled as 644 tweets containing intended
         non-English texts, we keep approximately 1.1 million             URLs and 424 containing unintended URLs.
         tweets.                                                                   c) Feature Engineering: After determining our ground
                                                                          truth set, we aim to develop features that can characterize
   •     URLs with paths and/or subdomains higher than                    tweets containing intended and unintended URLs, with the
         third-level: We eliminate a tweet if it only con-                goal of performing automated detection of the latter class.
         tains URLs with paths and/or subdomains higher than              To determine the first batch of features, we go through our
         third-level. During our manual investigation of URL-             initial set of pre-filtered tweets and gather statistics for tweets
         including tweets we observe that in nearly all cases,            containing unintended URLs such as common TLDs, DNS
         URLs with paths and subdomains (higher than third-               responses, string properties, location of the URL inside tweet
         level) were clearly intentionally posted by users.               text, etc. Then, to refine our features, we manually investigate
                                                                          our ground truth dataset to identify new features and have
   •     URLs having “com” or “org” as TLDs: Even                         more accurate classification. We test our model on the labeled
         though “com” and “org” are part of the English                   ground truth set to fine-tune the features. We repeat the process
         dictionary (“com” as a prefix and “org” as an ab-                of investigating daily collected tweets and adding new features,
         breviation) they are not particularly popular outside            and removing features with low effect until we are satisfied
         intentional URLs. As such, we filter any URLs that               with the overall accuracy and the simplicity of our features.
         ended in these TLDs.                                             After this process is completed, we have the following features:

                                                                      5
•   DNS Response. We observe that many of the unin-                   •    TLD Type. Other than the prefiltering for “com”
    tended URLs correspond to non-existing domains. To                     and “org” TLDs, we use ten binary features for the
    figure out whether a domain is registered, we check                    following ten different TLDs: “net,” “co,” “gov,”
    whether that domain had name server (NS) records.                      “it,” “my,” “no,” “so,” “you,” “to” and “zip.”
    This allows us to conclude that a domain was either                    The reason for explicitly converting these TLDs into
    registered/un-registered, irrespective of whether that                 features is two-fold. First, the TLDs such as “it,” “my,”
    domain resolved when regular users were visiting (i.e.,                “no,” “so,” “you” and “to” are English words that
    had A/AAAA records in place).                                          are also likely to be used at the beginning of sentences.
                                                                           As such, URLs including these TLDs have a high
•   Sentence Segmentation. If the first part of a link                     likelihood of being unintended. Second, TLDs such as
    logically belongs to one sentence whereas the text of                  “net,” “co,” “gov” and “zip” are not usually used
    the remainder of that link belongs to the next sentence,               at the beginning of sentences and hence are likely to
    this link has a high likelihood to be an unintended                    be found in intended URLs.
    one. We use a tool called Deepsegment [4] to extract
    the sentences out of a tweet, treating URLs as regular             We train and test our model on our ground truth dataset.
    text. Our preliminary results with the tool indicate           We experiment with a random forest classifier [31], a decision
    that Deepsegment has a 97% segmenting accuracy                 tree classifier [44], a k-nearest neighbors classifier [9] and
    if the punctuation is correct, 71% accuracy if the             support vector machines (SVMs) with different kernels [49].
    punctuation is partially correct and 53% accuracy if           We use 10-fold cross-validation to test the performance of
    there is no punctuation in the tweet. For this binary          each classifier and obtained the highest accuracy with an SVM
    feature, we mark it as positive if parts of the URL            model using a linear kernel. Our classifier uses binary features
    is at the end of one sentence and the remaining part           and outputs a binary number corresponding to two classes
    forms the beginning of the next sentence.                      namely unintended (binary 1, positive) and intended (binary
                                                                   0, negative).
•   String Properties. We identify five characteristics of
    strings that are either indicative of intended or unin-            The resulting classifier achieves 94% accuracy, 94.3%
    tender URLs, and codify them as binary features. iThe          precision, 90.6% recall and 92.2% f1 score on our ground
    following characteristics are indicative of intended           truth dataset. Using this classifier, we can now process the 1%
    URLs:                                                          tweet stream and record the tweets that the classifier predicts to
                                                                   be including unintended URLs. To make sure that our features
       ◦ Any of the subdomains or the domain contains              do not overfit on our ground truth set, we perform a validation
            a dash.                                                on independent data in Section IV-A, showing that our model
       ◦ Subdomains and domains are in camelcase                   achieves similar performance on an unseen dataset. After run-
            (contains a mix of capital and non-capital             ning our model, we use the identified URLs both to understand
            letters).                                              whether attackers are already abusing them but also, when
    Whereas the following characteristics are indicative of        possible, to register them so that we can quantify the number of
    unintended URLs:                                               Twitter users that attackers can victimize. Note that the overall
       ◦ The length of both the subdomains and domain              goal for this classifier is to achieve reasonably high accuracy
            are at most two (i.e., contains two or fewer           while keeping the features interpretable. We, therefore, do not
            characters).                                           experiment with neural-network-based classifiers that require
       ◦ Subdomains and domains are English words or               significantly more ground truth and are difficult to interpret.
            numbers.
       ◦ The link contains a non-capital letter followed           B. Unintended URL Crawling
            by a dot followed by a capital letter (i.e., [a-
                                                                       Since unintended URLs in tweets can drive unsuspecting
            z].[A-Z])
                                                                   visitors to potentially malicious websites, we seek to determine
•   Repetition of URL. Another binary feature is set to            the kind of content that they serve, as well as the extent of
    True/False depending on whether a URL appears more             malicious activity that leverages this traffic source. Thus, we
    than once in the tweet. We consider it unlikely that a         implement an automated URL crawling infrastructure that col-
    user will accidentally introduce the same URL twice            lects data on all unintended URLs uncovered by our classifier.
    in a single tweet.                                                 Our crawling infrastructure visits each website with an in-
                                                                   strumented Chrome browser using Selenium [11], and records
•   Location of URL. We use three different binary
                                                                   the following information: (1) webpage HTML, (2) screenshot,
    features identifying the location of the URL inside
                                                                   (3) TLS certificate, (4) redirect URL and IP address, (5) IP
    tweet text. The URL can be at the beginning, in the
                                                                   address information, (6) URL blacklist information, and (7)
    middle, or at the end of the text. URLs that are at the
                                                                   Alexa rank.
    end of the text tend to be intended ones (such as when
    someone explains what they are posting and ending                  To reduce the ability of websites to fingerprint our crawler
    the tweet with a link to that post) whereas the ones           and cloak malicious content, we take measures to mask our use
    that are in the middle tend to be unintended. Here,            of browser instrumentation. This involves changing the HTTP
    the full stops that users are using to mark the end of         User-Agent to appear as though the browser is Google Chrome
    a sentence are more likely to be recognized as part of         on a Windows 10 desktop, as well as injecting JavaScript into
    a URL, when whitespace is missing after them.                  each rendered page that modifies global JavaScript variables

                                                               6
(such as navigator.webdriver) to hide signs of browser                    type and amount of traffic that attackers can get when they
automation.                                                               weaponize unintended URLs.
    Using the data gathered by our crawling infrastructure,
we cluster webpages based on the perceptual hashes of their               A. Validation of the Classifier
screenshots [54]. We then manually label these clusters based                 In Section III-A0c we performed a 10-fold cross validation
on the content that was recorded by our crawlers.                         on our ground truth set and obtained the following average
                                                                          performance scores: 94% accuracy, 94.3% precision, 90.6%
C. Unintended URL Registration                                            recall and 92.2% f1 score. To be that our classifier can gener-
                                                                          alize to unseen data and rule out overfitting concerns, however,
     To determine the traffic directed towards unintended URLs            we want to test our classifier on a different dataset than the
present in tweets, we register a subset of available domains              one the features were developed on. To this end, we collect
(i.e., unintended domain names that are part of tweets and                a week of unseen tweets, extract the URLs and apply our
are also available for registration) and forward traffic to web           prefiltering mechanism on this new set. After prefiltering, we
servers under our control. There, we record information about             manually label the resulting URLs as intentional/unintentional
each request including the client’s IP address and request                following the same process used to determine our ground truth.
headers.                                                                  This set consists of 1302 unintended and 1829 intended URLs.
    To decide which unintended domains to register, we man-               We then train our classifier on the ground truth set, and test
ually analyze all the unintended URLs from each previous day              it on this new dataset to get predictions. By comparing the
and focus on the ones that we reason will reach the most users.           model’s predictions and the manual labels of this set we obtain
Specifically, we determine the reach of a tweet by observing              93.3% accuracy, 94.5% precision, 89.1% recall and 91.7%
the follower count of the tweet’s author as well as the number            f1 scores. Since we obtained similar performance scores on
of the tweet’s likes and retweets.                                        our ground truth set and a completely unseen dataset, we
                                                                          conclude that our feature set does not overfit on the training
    In parallel to the tweets that our classifier discovers as part       set, and can therefore be run in the wild. We also observe that
of the 1% of global tweets that Twitter offers via its API,               around 40% of false positive URLs originate from spam tweets
we also deploy an infrastructure that specifically monitors the           belonging to betting, cryptocurrency, and gaming websites
tweets of the most popular Twitter users, searching for tweets            such as “IQ.Cash,” “GG.bet,” and “iBlocks.Games.”
that include domains which are available for registration. In             Particularly, we observe the same spam URL appearing among
total, we monitor the tweets of 20,000 users with follower                the false positives more than once because the spam Twitter
counts ranging from 11 thousand to 118 million. Whenever                  accounts post almost exact tweet containing the URL many
we encounter an unregistered domain tweeted by these top                  times throughout the day. Our analysis shows that 25% of false
accounts, the infrastructure — in real-time — automatically               negatives contain either “.so” or “.in” as TLD. These two
registers that domain and forwards traffic to our webservers.             words are commonly used to start sentences in spoken English
This allows us to observe traffic from tweets as soon as they             and having “.so” as TLD is among our features, however, that
are posted, even in the cases where users later discover their            was not enough by itself to classify these URLs correctly.
error and delete the unintended-URL-including tweets.
                                                                          B. Common Properties of Unintended URLs
D. Ethical Considerations
                                                                              We ran our daily pipeline for 7 months, between January
    Analyzing social media activity has important ethical im-             2020 and July 2020, recording a total of 26,596 unintended
plications. In this work, we only analyze data that is publicly           URLS. Figure 4 shows the daily number of unintended URLs
posted on Twitter. For our registered unintended domains, we              on Twitter identified by our analysis pipeline. Overall, 19,195
do not interact in any way with the users who click on those              (72% of the total) domains resulting from unintended URLs
links and visit the web pages that we set up. We merely                   are non existent (NXDOMAINs), while 7,401 (28% of the
count the number of visits that a page receives. Additionally,            total) domains are existing (XDOMAINs). On average, 75% of
we argue that by registering these domains we are reducing                the unintended URLs posted every day are non-existing. This
potential harm, since we prevent attackers from leveraging                result is expected since an unintentionally posted link would
them for malicious purposes. Since all the data that we use               only be an existing domain name due to pure coincidence.
is public and we do not interact with users in any way, this              Our results highlight the threat of adversaries opportunistically
research is not considered as human subjects research by our              registering these unintended domains and populating them with
institution’s IRB.                                                        arbitrary malicious content.

                       IV.   E VALUATION                                         a) Unintended URL placement: We next look at the
                                                                          placement of unintended URLs in tweets. We find that 23,813
    In the following, we first present an experiment to vali-             unintended URLs are in the middle of the tweet (89.5%), 2,388
date our classifier’s accuracy on unseen data. Then, we run               (9%) are at the beginning and 395 (1.5%) reside at the end
our model on the entire dataset and analyze the detected                  of the text. As we said previously, one of the reasons why
unintended URLs in detail, together with the characteristics              unintended URLs tend to appear in the middle of tweets is that
of the accounts that posted them. We also report on our                   users forget to put a space between two sentences, creating an
experiment involving the registration of 45 domains that appear           unintended URL that combines the last word of the previous
as unintended URLs in our dataset and were available for                  sentence and first word of the next sentence. This mistake may
registration. This experiment allowed us to characterize the              also cause unintended URLs at the beginning or at the end of

                                                                      7
                                                                         existing and existing domain names with the highest occur-
                                                                         rence throughout our experiments.
                                                                             Four of the existing domains shown in Figure 5 are false
                                                                         positives: “Iq.cash,” “Bonus.express,” “Of.today”
                                                                         and “Every.black.” The domain “Bonus.express”
                                                                         is promoted through spam and all 67 tweets are posted
                                                                         by the same account. Similarly, all 47 tweets containing
                                                                         “Of.today” are posted by the same account promoting
                                                                         a website with many subdomains. Moreover, tweets with
                                                                         “Every.black” domain are posted by 11 different accounts
                                                                         that all appear to belong to the owners of this domain in an
                                                                         attempt to advertise the website. The tweets containing the
                                                                         domain “Iq.cash” can also be considered spam since they
                                                                         all aim to promote a specific crypto currency. These domains,
                                                                         especially “Of.today” and “Every.black” carry many
Fig. 4: Number of unintended URLs per day as detected by of              of the unintended URL properties that we identified in our
our model over the whole duration of the experiment. Unregistered        preliminary analysis, and could be true positives in other
domains (NXDOMAINs) dominate the set of unintended URLs posted           scenarios.
on Twitter.
                                                                             Among the domains in the top 20, 6 of them are abbre-
                                                                         viations, which are commonly typed by users and result in
                                                                         unintended URLs: “B.tech,” “W.va,” “B.sc,” “Prod.by,”
                                                                         “M.sc” and “Co.ltd.”
                                                                             Unexpectedly, our analysis also revealed an additional
                                                                         cause for unintended URLs which we had not considered
                                                                         when we started this work. Instagram allows users to have
                                                                         a dot inside their profile names, while Twitter does not.
                                                                         This semantic difference makes it so that any time a Twitter
                                                                         user posts an Instagram profile name in their tweets, this
                                                                         may result in an unintentional URL if the final part of the
                                                                         profile name happens to be a valid TLD. “D.va,” “J.you,”
                                                                         “H.one,” “Jaybnow.hr” and “J.one” are examples of
                                                                         these incorrectly expanded Instagram handles. Again, since
                                                                         users do not intend to include a link when typing these profile
                                                                         names, we consider them as unintended URLs which can be
                                                                         weaponized by attackers by merely registering them.
                                                                             Among the top 20 domain in Figure 5, four are commonly
                                                                         appearing in tweets as a consequence of users making typos
                                                                         (e.g., using a dot instead of space to separate between two
                                                                         words): “Ac.it,” “You.you,” “I.am” and “Oh.my.” In
                                                                         total, we record 375 tweets for these URLs. To determine
Fig. 5: Number of tweets vs. Domain Names: The total number of           if they actually are unintended URLs or false positives, we
tweets posted containing the unintended domain name throughout           check a random sample of 10 tweets including each domain
our experiments. The graph shows the top 10 NX (non-existing) and
                                                                         (40 in total). We find that all the sampled tweets that include
X (existing) domains with the highest count.
                                                                         “Ac.it,” “You.you” and “Oh.my” contain links due to ty-
                                                                         pographical errors. Hence, we conclude that these three domain
                                                                         names are unintended URLs. For “I.am” we observe three
                                                                         different causes. This domain name is expanded when users
a sentence if the first or last sentence only contains one word.         mention “will.i.am” to refer to the name or the website
However, the likelihood of this happening is low since single-           of a famous American rapper. This domain can also be used
word sentences are uncommon. We observe that if a user wants             inside an Instagram handle or may occur due to a typo. Among
to intentionally post a link, one of the common ways to do that          the recorded 124 tweets containing the domain “I.am,” we
is to first write about the website and then place the link at the       observe that 73 of them are referring to the American rapper
end of the sentence usually following a punctuation character            “will.i.am” (and are therefore false positives), 20 of them
(e.g., “:”). Hence, our results are in line with this observation.       are typos, 3 are Instagram handles and 28 of those tweets are
                                                                         unavailable due to the author making their account private or
      b) Common Domain Names: We next focus on the                       deleting the tweet, possibly after realizing their mistake.
domain names that are frequently rendered by Twitter when
expanding unintended URLs. Our goal is to observe the                           c) Common TLDs: During our initial assessment of
most common mistakes and discover any active malicious                   the issue of unintended URLs in social media, we identified
campaigns abusing them. Figure 5 shows the top 10 non-                   several TLDs (e.g., “it,” “my,” “no,” “so,” “you” and “to”)

                                                                     8
                                                                                                             Unintended URL       Original Author   Follower Count
                                                                                                                 SEE.YOU            Harry Styles         34M
                                                                                                                Kobe.Osaka          Harry Styles         34M
                                                                                                                    c.bank            Reuters            22M
                                                                                                                    im.mo              9GAG              16M
                                                                                                                 kuba.black            9GAG              16M
                                                                                     NX
                                                                                                                 raminta.art           9GAG              16M
                                                                                                         PERMANENTLY.MORTGAGE        iamcardib           13M
                                                                                                                  sign.Hair          iamcardib           13M
                                                                                                                 shake.You           iamcardib           13M
                                                                                                              unexpected.Love        iamcardib           13M
                                                                                                                   thing.It            Oprah             42M
                                                                                                                 moment.In        deepikapadukone        27M
                                                                                                                  people.It          iamcardib           13M
                                                                                                               tongue.Today          iamcardib           13M
                                                                                                                pregnant.My          iamcardib           13M
                                                                                         X
                                                                                                                   street.It         JKCorden            11M
                                                                                                                   Rt.live          TechCrunch           10M
                                                                                                                movie.Best          dhanushkraja         8.9M
                                                                                                                  airbnb.To        anandmahindra         7.8M
                                                                                                                 violence.In         marcorubio          4.2M

                                                                            TABLE II: unintended URLs with highest original author follower
                                                                            count.



Fig. 6: Number of tweets vs. TLDs: The total number of tweets posted                                                                                     Median
containing the TLD name throughout our experiments. Red patch of
                                                                                                   500                                                   Min
                                                                                                                                                         Max
                                                                           Number of Occurrences
a bar shows the contribution from NX (non-existing) domains and the
green patch shows the contribution from X (existing) domains.                                      400

                                                                                                   300
that commonly occur in unintended URLs and we used them                                            200
as features in our machine learning model (Section III-A).
Figure 6 shows the top 15 TLDs that are used in unintended                                         100
URLs in our dataset.
    Our findings are aligned with our initial assessment since                                       0
the resulting top 15 TLDs contain the 6 TLDs that we used                                                  0       20        40          60         80         100
as features. Most of the TLDs plotted in Figure 6 are English                                                           Days Since Registration
dictionary words that are commonly used at the beginning of a
sentence. For example, “you,” “it,” “no,” “my,” “so,” “in,”                 Fig. 7: Average daily requests for all unintended domains registered.
“how,” “now,” “one,” “to,” “love” and “be” are usually
used at the beginning of a regular sentence whereas “am” and
“is” are used at the beginning of questions. Only “sc” is
not used as such but, as mentioned earlier, we can straightfor-             that posted it as well as how many times the tweet was
wardly conclude that the high occurrence count is due to the                shared (retweeted). In this section, we aim to investigate the
following abbreviations: “B.sc” and “M.sc.” From Figure 6                   relationship between the popularity of a Twitter account and
we notice that unintended URLs with TLDs that happen to be                  the impact of the unintended URLs that they post.
dictionary words tend to point to non-existing domains (e.g.,
“.you,” “.how”). TLDs that are dictionary words but also                        In Table II we record the top 20 unintended URLs that
correspond to a country code (e.g., “.it,” “.no”) point to a                we recorded, ranked by account popularity in terms of their
mixture of existing and non-existing domains.                               number of followers. The follower count of these authors
                                                                            ranges between 34M and 4.2M. For example, when Harry
    The “.you” TLD is an interesting case because, while                    Styles tweeted “SEE.YOU” from his Twitter account, there
the TLD is valid, registrations of domains ending in “.you”                 are potentially 34M users who can view the tweet on their
are not yet available to the public. As such, even though                   timelines and click on the unintended URL. If an attacker
Twitter renders .you-ending domains as clickable links, none                registered this domain name shortly after the tweet is posted,
of these domains actually serve any content. While this limits              up to 34M victims (ignoring re-tweets that could further
the immediate exploitation of these unintended URLs, it also                enlarge the users who are exposed to the tweet) could have
means that, when registrations open to the public, all of these             visited their website and be directed to a malicious page.
domains will be exploitable, essentially overnight.                         Therefore we say that the magnitude of the audience, in this
                                                                            case, is at least 34M.
C. Impact of an Unintended URL
                                                                               As described in Section III-C, part of our study involves
    Intuitively, one would expect that not all unintended URLs              the registration of the domains corresponding to unintended
have the same impact on Twitter users. Instead, their ability               URLs so that we can more precisely quantify the number of
to reach users is influenced by how popular was the account                 users that attackers could victimize.

                                                                       9
                          1.0                                                           Original Content                                            2663
                                                                                                  Parked                                        2422
                                                                                                    Error   334
Percentage of Typo URLs

                          0.8                                                                     Empty     319
                                                                                            Construction 145
                                                                                               Gambling 103
                                                                                                   Adult 41




                                                                                 Tag
                          0.6                                                              Server Setup 39
                                                                                            Rate Limited 34
                                                                                          File Download 24
                          0.4                                                                  Copyright 4
                                                                                       Deceptive Survey 2           Total          Top 3 Country Code TLDs
                                                                                                   Scam 1
                          0.2                                                                             0  500   1000     1500      2000     2500      3000
                                                                                                                    Number of Websites
                          0.0
                                0   2   4    6      8     10      12   14                      Fig. 9: Content of unintended URL websites.
                                        Number of Times Tweeted
 Fig. 8: Frequency unintended URLs are included in tweets throughout
 our study.                                                                      the perceptual hash clustering of screenshots and manual
                                                                                 labeling. We find that 43.4% of websites hosted on unintended
                                                                                 URLs in our dataset belong to benign entities hosting original
                                                                                 content such as small business webpages. A large percentage
     Figure 7 shows the number of daily requests to the 45                       of these domains are registered under one of the country TLDs
 unintended domains that we register during our data collection                  including “.it,” “.so” and “.is.” Given that these are the
 period. Our data shows that requests for unintended URLs are                    prominent TLDs of each respective country as well as com-
 at their peak immediately after appearing in a tweet, followed                  monly used words, we attribute this to the over-representation
 by a downward trend each day thereafter. The magnitude of the                   of such content in our dataset.
 spike in traffic after a tweet’s publishing is dependent on the
 following of the tweet’s author. Hence, we observe a number                         An additional 39.5% of our dataset is made up of domain
 of tweets from users with large followings directing hundreds                   parking webpages. Previous work has shown that domain
 of visitors to our web server promptly after registration and                   parking services commonly serve malicious content to visitors
 continually providing residual traffic for the days following.                  including malware and technical support scams [50], [15].
 The decrease in traffic over time to the domains we register                    Additionally, 171 webpages contain sensitive or malicious
 is indicative of the effect unintended URLs located in tweets                   content such as deceptive surveys and downloads. Thus, we
 have on driving views to websites. Attackers who register                       find 42.3% of the webpages in our dataset could expose users
 domains before (e.g., by predicting common unintended URLs)                     to potentially dangerous and unwanted content.
 or shortly after they appear in a tweet will receive significantly
 more requests compared to registering the same domains a few                            b) Unintended Domain Maliciousness: In total, 118
 days later.                                                                     target domains and an additional 40 landing domains appear on
                                                                                 at least one blacklist reported by VirusTotal [13]. Furthermore,
     We also discover isolated spikes in requests to unintended
                                                                                 we discovered a large-scale malvertising campaign consisting
 domains in the days following registration. These spikes can be
                                                                                 of 71 domains registered to the same IP address. When visiting
 attributed to the same unintended URLs appearing in additional
                                                                                 any one of these domains, the user is met with an attacker-
 tweets. Figure 8 shows the number of times that unintended
                                                                                 controlled Traffic Distribution System [30] which, through a
 URLs were included in tweets throughout our entire dataset.
                                                                                 series of redirections, lead users to one of many malicious
 We find that 20% of these URLs are tweeted more than once,
                                                                                 webpages. These webpages contain content including phishing,
 hence driving new traffic to the websites of potential attackers.
                                                                                 deceptive surveys, and file downloads. An example of the
                                                                                 malicious content served by this campaign can be found in
 D. Unintended Domain Properties                                                 Figure 10.
     As we discussed earlier, most unintended URLs (72%)
 belong to non-existing (i.e., available for registration) domain                    Our results show that users who follow URLs present in
 names. In this section, we focus on the minority of URLs                        tweets may be subjected to malicious content. The trust users
 (28%) pointing to domains that were registered, in an effort to                 have in the authors of tweets increases the potential damage a
 understand what kind of content is hosted on the websites and                   malicious webpage can cause, as more users will be confident
 whether these domain registrations are coincidental as opposed                  in the validity of the content.
 to motivated by tweets including unintended URLs. During
                                                                                         c) Unintended Domain Registration Date: For the un-
 our period of experiments, our data collection infrastructure
                                                                                 intended URLs that correspond to registered domain names, a
 visited and recorded information for 15,301 unintended URLs.
                                                                                 critical question is the following: were these domains already
 Analyzing the content and reputation of these webpages allows
                                                                                 registered at the time of the tweet, or were they registered
 us to uncover the dangers users face when visiting unintended
                                                                                 some time after the URL-including tweet? In the former case,
 URLs.
                                                                                 one could straightforwardly argue that these domains are most
        a) Unintended URL Website Content: Figure 9 shows                        likely benign and their matching with tweets is coincidental.
 the content of unintended-URL websites as determined through                    In the latter case, however, a domain that was registered after

                                                                            10
                                                                                                                Total Tweets       Tweets w/ URLs     Tweets Flagged


                                                                                                      100




                                                                                   Number of Tweets
                                                                                                      10




                                                                                                       1
                                                                                                                [0,50]               (50,100]           (100,inf]
  Fig. 10: Deceptive survey from malicious campaign found among                                                                User Tweets per Week
  unintended URLs.
                                                                                   Fig. 12: Statistics on tweets from users observed publishing at least
                                                                                   one tweet containing an unintended URL. Data is grouped by the
                                                                                   number of tweets each user publishes weekly.
Number of Unintended Domains




                               50
                                                                                                        V.   D EVELOPING A C OUNTERMEASURE AGAINST
                               40                                                                               U NINTENDED URL S ON T WITTER

                               30                                                      In Section III-A we showed that it is possible to train a
                                                                                   machine learning classifier to be able to detect unintended
                               20                                                  URLs on Twitter with high accuracy (94% on our ground truth
                                                                                   dataset). In the long run, we expect that Twitter as well as other
                               10                                                  social media platforms will adopt a classifier similar to the one
                                                                                   we proposed and alert users about unintended URLs before
                                                                                   posting them on their timelines. We argue that it is important
                                0
                                    8000     6000       4000       2000   0        that users are involved in this process, being warned about
                                           Days Relative to Detection              the potentially unintended URLs that they introduce and being
                                                                                   given a chance to correct their tweets. If Twitter (or another
  Fig. 11: Days between the registration of domains and detection by               social media platform) makes this decision automatically, users
  our infrastructure.                                                              whose flagged tweets were false positives, may consider the
                                                                                   forced change as a form of censorship.

                                                                                       In the mean time, however, given the potential threat posed
                                                                                   by unintended URLs, we want to equip users with tools that
  a tweet including a corresponding unintended URL is a clear                      they can use to protect themselves and their audience. Since we
  indication of malice.                                                            assume a non-cooperating social network, any solution must be
                                                                                   limited to the client side. Given Twitter’s software ecosystem,
      Figure 11 shows the registration date of domains in our                      a client-side solution can either be in the form of a special
  dataset relative to detection by our infrastructure. We observe                  Twitter client (that a user must install and adopt) or in the
  a long tail distribution with the majority of registrations                      form of a browser extension (for the users who operate Twitter
  occurring within five years of detection. We note a spike in                     through its web interface). Due to the non-intrusive nature of
  registrations occurring at around 6,000 days before detection.                   browser extensions, their cross-platform operation, and the fact
  These domains all belong to the .in TLD and were registered                      that they can be installed and uninstalled without requiring any
  after a relaxing of regulations for that TLD in 2005 [8]. As                     other changes to the user’s workflow, we opted to deploy our
  shown in Figure 9, most of the domains in our dataset belong                     countermeasure through a browser extension.
  to benign entities. These registrations are therefore most likely
  independent of tweets recorded by our infrastructure. However,                       Specifically, we developed a Chrome browser extension
  we also observe a spike in domain registrations shortly before                   that parses the text of tweets as users type them and runs our
  detection. Given the detection lag of our infrastructure as                      unintended URL classifier on that text. In the case of a positive
  well as the fact that some unintended domains are tweeted                        label (i.e., a discovered unintended URL) the extension will
  repeatedly by different users making the same mistake, the                       alert users so that they can correct their typos (or override our
  spikes at the right-hand side of the graph can be attributed to                  warning) before posting their tweets. In this section, we first
  attackers who observe these tweets and attempt to benefit from                   describe the functionality of our browser extension and then
  the traffic that they generate.                                                  analyze its performance impact on a user’s browser.

                                                                              11
A. Browser Extension
    Our Chrome browser extension analyzes the text of new
tweets as the user is typing them, identifying unintended
URLs. When enabled, our extension registers event handles
on the “Post Tweet” button in the Twitter Web interface. After
the user types the tweet text and clicks the post button, the
extension analyzes the tweet text and applies the prefiltering
step described in Section III-A. Tweets containing URLs that
pass the prefiltering steps are then evaluated using a pre-
trained machine learning model that uses most of the features
of our aforementioned classifier. Specifically, for our proof-
of-concept extension, we excluded the Sentence Segmentation
feature that our regular classifier uses. Our analysis of features
indicated that this feature had a low importance in our model,
in a way that did not justify the time investment that was
necessary to port it to the JavaScript language (a step that is
necessary for the extension to be self contained).
    If the model reports that the tweet contains one or more
unintended URLs, the browser extension shows a warning                     Fig. 13: Chrome extension response time for different test cases.
dialog containing all the unintended URLs (positive predic-
tions). This dialog enables the users to review the posted URLs
and optionally edit their text before posting. Alternatively,
in the case of a negative prediction, the tweet is posted as                 •    The posted tweet contains two links which do not get
usual. A video demonstrating our extension along with the                         filtered in Prefiltering step (tested for both positive
source code of our extension can be found in our public                           predictions and negative predictions)
GitHub repository: https://github.com/belizkaleli/TypoNoMo.                  •    The posted tweet contains three links which do not
Note that our browser extension only operates locally, and no                     get filtered in Prefiltering step (tested for both positive
data about the Twitter user or the text they typed is sent to a                   predictions and negative predictions)
third party. As such, our extension is not privacy invasive.
                                                                              For the tweets including negative predictions (i.e., the
B. Performance Impact                                                     URLs are classified to be intended ones), we record the time
                                                                          from the moment the user clicks the “Tweet” button to the
    A browser extension should not disrupt the overall user               tweet getting posted on the user’s timeline. For the tweets
experience if it is to be adopted by users. To understand                 including positive predictions (i.e., the URLs are classified
the number of alerts that Twitter users would experience, we              to be intended ones), we record the time from the moment
measure the frequency in which the average user (of those who             user clicks the “Tweet” button to the time they are shown
are prone to unintended URLs) would see an alert from our                 the extension’s warning dialog. The posting of tweets is
browser extension. We accomplish this by analyzing tweets                 automated using Selenium. Figure 13 shows the results of our
from each user we observed publishing a tweet containing an               performance tests, averaged over ten runs. The results show
unintended URL in SectionIV-C. For each user, we download                 that while our extension does add a delay to the posting of
all authored tweets using the Twitter API (maximum of 200                 tweets, this delay is typically under a second, even in the
per user) and record the following: the total number of tweets            extreme cases of a user posting three URLs (thereby causing
published, the number of tweets containing at least one URL,              three classification tasks) in the same tweet. We can therefore
and the number of tweets flagged as containing an unintended              conclude that our extension could protect users and their
URL by our extension. We divide our dataset into three groups,            followers from unintended URLs, for a minimal performance
based on the number of tweets users in each group publish                 overhead.
each week. Figure 12 demonstrates our findings. Overall, out of
93,187 total tweets in our dataset, only 51 would be flagged by                                 VI.    D ISCUSSION
our browser extension, with users on average seeing no more
than one alert each week. Moreover, we find that medium and                   In this section, we first discuss the implications of our
high-activity users post a similar number of tweets containing            results for online services. We then highlight the limitations
URLs, demonstrating an upper-bound on tweets which could                  of our study and sketch some future work directions.
potentially trigger an alert from our extension.
   Additionally, we measure the time overhead induced by                  A. Implications for Online Services
our extension in the following tweet-posting scenarios:                       In this paper, we show that the efforts expended by many
   •    The posted tweet does not contain any links.                      online services (including Twitter) to identify URLs in the text
                                                                          of their users and render them as clickable links, can produce
   •    The posted tweet contains only one link which does                unintended URLs with negative security consequences. There
        not get filtered in the Prefiltering step (tested for both        is an inherent tension between the usability of an online service
        positive predictions and negative predictions).                   and its security, leading to problems that platform designers

                                                                     12
need to face. Our advice to online services is to consider               social media and to characterize the threat that they pose to
the threats highlighted in this paper when designing and                 users.
updating their URL rendering systems. An option would be to
develop an unintended URL detection system similar to the one                Due to its popularity, Twitter has attracted large amounts of
proposed in this paper on their side. This deployment, however,          abuse and commensurate amounts of past research. Spam has
should follow a rigorous risk-benefit analysis weighing the              always been an issue which has inspired work that quantifies
security of users, the usability of the platform, and the user           the spam activity on the platform [25], [48], [21], [42] as
friction introduced by false positive alerts. Given that, accord-        well as methods to detect fake accounts [47], [43], [19] and
ing to our results in Section IV, 72% of unintended URLs                 differentiate them from compromised accounts [22], [51], both
point to unregistered domain names, we argue that showing a              on Twitter as well as other popular social networks [24],
warning whenever users post tweets including an unregistered             [6]. An important differentiator of our work is that the un-
domain name, would cover the majority of unintended URLs                 intended URLs are legitimately posted by benign users, not
posted by users with virtually no negative side effects.                 by spammers controlling fake and compromised accounts. As
                                                                         we showed in this paper, attackers can, after the fact, register
                                                                         the accidentally-introduced URLs and therefore expose the
B. Limitations                                                           followers of the original Twitter users to arbitrary malicious
    Our dataset comes from the 1% streaming API that Twitter             content.
provides to vetted researchers. As such, we expect that all the              Orthogonally to spam and account hijacking, researchers
numbers that we presented in this paper are lower bounds                 have also investigated the security side-effects of allowing
of the problem of unintended URLs. Another limitation is                 users to change their usernames on popular social network
that we focus on tweets authored in English for both our                 platforms [34] as well as whether attackers can confuse users
model as well as our mitigation. Since most of our features              about the nature of posted URLs via web cloaking [40].
depend on language, building a language-agnostic model is not
a straightforward task and therefore we chose not to pursue it                The negative consequences of typos to the security and pri-
in the scope of this work.                                               vacy of users have been extensively studied in the area of do-
                                                                         main squatting. Typosquatting specifically, refers to attackers
C. Future Work                                                           registering mistyped domain names (such as twitte.com)
                                                                         in an attempt to capture all the traffic from users who mistype
    In this paper, we presented a series of promising results            a website’s URL in their browsers. Past research has charac-
towards automatically detecting unintended URLs on Twitter.              terized the typosquatting abuse in the wild [14], [17], [28],
However, the accuracy of our machine learning algorithm                  [35], [52], [45] as well as the effects of typos in related areas,
could be further improved. Adding more complicated features              such as, website development [36], package managers [2], and
and potentially analyzing each tweet in the context of other             mobile app stores [27]. In this paper, we discovered that while
tweets from the same user, could lead to higher accuracy. At             typos are one of the reasons for unintended URLs (where a
the same time, heavyweight features will also considerably               Twitter user intends to tweet one URL but tweets another), the
increase the time needed for analysis and therefore increase             main culprit of unintended URLs is the semantic gap between
the performance overhead, particularly if it is to be applied at         what a user types (such as a sentence with a missing space or
the client side.                                                         an Instagram ID) and what Twitter infers that that user typed
                                                                         (i.e., a URL).
    A possible direction for future work is designing a system
that preemptively identifies future unintended domains, based                One of the reasons why Twitter and other social network
on commonly used words and the evolution of TLDs. These                  platforms are so eager to find URLs in user tweets, is the
domains could then be essentially “cached” by the classifier,            constant expansion of valid domain TLDs. Next to traditional
leading to classification speedups. This approach would be               generic TLDs (such as “.com” and “.org”) and country-code
conceptually similar to the work of Marchal et al. who                   TLDs (such as “.it” and “.es”), ICANN has, since 2013,
propose Markov chains built from past phishing websites, to              approved more than 1,200 new gTLDs, such as, “.life,”
proactively predict future phishing URLs [33]. Orthogonally              “.love” and “.beer” [5]. These new gTLDs combined
to predictive classification, a separate direction is to experi-         with user typos are making it more likely that a social network
ment with convolutional neural networks that have exhibited              platform will identify URLs when users never intended them.
immense accuracy improvements in other fields, compared to               For at least some of these TLDs, researchers have questioned
traditional machine-learning classifiers. These classifiers tend         whether they fulfill a real user need or are just creating more
to require significantly larger ground-truth datasets compared           opportunities for domain squatting and trademark abuse [26],
to traditional machine-learning algorithms which made them               [37].
inapplicable for us. We expect that our proposed classifier
(or our simplified heuristic of alerting on tweets including                                  VIII.   C ONCLUSION
unregistered domain names) could produce such a dataset and
therefore enable a transition to more advanced classifiers in                In this paper, we showed that the automatic link-rendering
the long run.                                                            feature of popular social media, combined with incorrect
                                                                         spelling and punctuation, can result in unintentional URLs.
                   VII.    R ELATED W ORK                                We presented a threat model on social media platforms in
                                                                         which an adversary abuses this phenomenon to launch attacks
    To the best of our knowledge, this paper is the first one            on users who click on those unintentional links. We evaluated
to draw attention to the phenomenon of unintended URLs in                the link-rendering behavior of several online platforms to show

                                                                    13
the extent of the problem and focused on the manifestation of                          [9]   “K-nearest      Neighbor,”       http://scholarpedia.org/article/K-nearest
unintended URLs on Twitter.                                                                  neighbor.
                                                                                      [10]   “Rudy Giuliani Accuses Twitter of Bias for Hyperlink-
    Given the volume of Twitter data, we proposed features that                              ing        Text,”        https://www.theverge.com/2018/12/5/18127063/
can be used in the context of supervised machine learning to                                 rudy-giuliani-twitter-bias-accusation-hyperlinked-text-president-trump.
identify unintended URLs in user tweets and used our classifier                       [11]   “Selenium,” https://selenium.dev.
over a period of 7 months, processing millions of tweets and                          [12]   “Typo - Dictionary Definition,” https://www.vocabulary.com/dictionary/
discovering a total of 26,596 unintended URLs. We analyzed                                   typo.
the properties of these unintended URLs and characterized the                         [13]   “VirusTotal,” https://virustotal.com.
abuse that attackers could inflict by registering 45 domains                          [14]   P. Agten, W. Joosen, F. Piessens, and N. Nikiforakis, “Seven Months’
found in unintended URLs. There, we discovered that, as long                                 Worth of Mistakes: A Longitudinal Study of Typosquatting Abuse,” in
                                                                                             Proceedings of Network and Distributed System Security Symposium
as attackers register unintended domains shortly after they                                  (NDSS), San Diego, CA, February 2015.
are posted on Twitter, they will receive visits from hundreds
                                                                                      [15]   S. Alrwais, K. Yuan, E. Alowaisheq, Z. Li, and X. Wang, “Understand-
of unsuspecting Twitter users who are merely following the                                   ing the Dark Side of Domain Parking,” in Proceedings of USENIX
links posted by trusted user accounts. Lastly, we presented                                  Security Symposium, San Diego, CA, August 2014.
a lightweight browser extension which will warn users when                            [16]   A. Badawy, E. Ferrara, and K. Lerman, “Analyzing the Digital Traces
they are about to tweet text that includes an unintended URL.                                of Political Manipulation: The 2016 Russian Interference Twitter Cam-
                                                                                             paign,” in Proceedings of IEEE/ACM International Conference on Ad-
    Our study sheds light on the previously unexplored issue                                 vances in Social Networks Analysis and Mining (ASONAM), Barcelona,
of unintended URLs which we hope will be used by online                                      Spain, August 2018.
platforms to re-evaluate their link-rendering algorithms and                          [17]   A. Banerjee, D. Barman, M. Faloutsos, and L. N. Bhuyan, “Cyber-Fraud
consider warning users when unintended URLs are about to be                                  is One Typo Away,” in Proceedings of ACM SIGSAC Conference on
                                                                                             Computer and Communications Security (CCS), Phoenix, AZ, April
posted. At the same time, our work highlights the importance                                 2008.
of being careful when authoring messages on social media,                             [18]   F. Benevenuto, G. Magno, T. Rodrigues, and V. Almeida, “Detecting
where the absence of a space can now be weaponized to expose                                 Spammers on Twitter,” in Proceedings of the International Conference
millions of users to malicious content.                                                      on Email and Anti-Spam (CEAS), Redmond, WA, July 2010.
                                                                                      [19]   Y. Boshmaf, D. Logothetis, G. Siganos, J. Lerı́a, J. Lorenzo, M. Ri-
                         IX.    AVAILABILITY                                                 peanu, and K. Beznosov, “Integro: Leveraging Victim Prediction for
                                                                                             Robust Fake Account Detection in OSNs,” in Proceedings of Network
   The code for our proposed browser extension can be                                        and Distributed System Security Symposium (NDSS), San Diego, CA,
found at the following URL: https://github.com/                                              February 2015.
belizkaleli/TypoNoMo.                                                                 [20]   D. Chatzakou, N. Kourtellis, J. Blackburn, E. De Cristofaro, G. Stringh-
                                                                                             ini, and A. Vakali, “Mean Birds: Detecting Aggression and Bullying on
                                                                                             Twitter,” in Proceedings of the Conference on Web Science (WebSci),
                        ACKNOWLEDGMENTS                                                      New York, NY, June 2017.
                                                                                      [21]   C. Chen, J. Zhang, X. Chen, Y. Xiang, and W. Zhou, “6 Million Spam
   We thank the anonymous reviewers for their helpful feed-                                  Tweets: A Large Ground Truth for Timely Twitter Spam Detection,” in
back. For Boston University, this work was supported by the                                  Proceedings of the International Conference on Communications (ICC),
National Science Foundation under grant CNS-1942610 and                                      London, UK, June 2015.
by a seed grant from the Center for Information & Systems                             [22]   M. Egele, G. Stringhini, C. Kruegel, and G. Vigna, “COMPA: Detecting
Engineering and the College of Engineering at BU. For Stony                                  Compromised Accounts on Social Networks,” in Proceedings of Net-
Brook University, this work was supported by the National Sci-                               work and Distributed System Security Symposium (NDSS), San Diego,
                                                                                             CA, February 2013.
ence Foundation under grants CNS-1941617, CNS-1813974,
                                                                                      [23]   G. Eysenbach, “Can Tweets Predict Citations? Metrics of Social Impact
and CMMI-1842020 as well as by the Office of Naval Research                                  Based on Twitter and Correlation with Traditional Metrics of Scientific
under grant N00014-20-1-2720.                                                                Impact,” J Med Internet Res, 2011.
                                                                                      [24]   H. Gao, J. Hu, C. Wilson, Z. Li, Y. Chen, and B. Y. Zhao, “Detecting and
                               R EFERENCES                                                   Characterizing Social Spam Campaigns,” in Proceedings of SIGCOMM
                                                                                             conference on Internet Measurement Conference (IMC), Melbourne,
[1]   “About         Twitter      Cards      -      Twitter       Developers,”               Australia, November 2010.
      https://developer.twitter.com/en/docs/tweets/optimize-with-
      cards/overview/abouts-cards.                                                    [25]   C. Grier, K. Thomas, V. Paxson, and M. Zhang, “@Spam: The
                                                                                             Underground on 140 Characters or Less,” in Proceedings of ACM
[2]   “Attackers Use Typo-Squatting To Steal npm Credentials,” https:                        SIGSAC Conference on Computer and Communications Security (CCS),
      //threatpost.com/attackers-use-typo-squatting-to-steal-npm-credentials/                Chicago, IL, October 2010.
      127235/.
                                                                                      [26]   T. Halvorson, K. Levchenko, S. Savage, and G. M. Voelker, “XXXtor-
[3]   “Consuming Streaming Data,” https://developer.twitter.com/en/docs/                     tion? Inferring Registration Intent in the. XXX TLD,” in Proceedings
      tutorials/consuming-streaming-data.                                                    of the International Conference on World Wide Web (WWW), Seoul,
[4]   “Deepsegment,” https://pypi.org/project/deepsegment/.                                  Korea, April 2014.
[5]   “Delegated Strings — ICANN New gTLDs,” https://newgtlds.icann.org/              [27]   Y. Hu, H. Wang, R. He, L. Li, G. Tyson, I. Castro, Y. Guo, L. Wu, and
      en/program-status/delegated-strings.                                                   G. Xu, “Mobile App Squatting,” in Proceedings of the Conference on
[6]   “Detecting Malicious Content on Facebook,” https://arxiv.org/abs/1501.                 Web Science (WebSci), Taipei, Taiwan, April 2020.
      00802.                                                                          [28]   M. T. Khan, X. Huo, Z. Li, and C. Kanich, “Every Second Counts:
[7]   “Hackers Tell the Story of the Twitter Attack From the In-                             Quantifying the Negative Externalities of Cybercrime via Typosquat-
      side,” https://www.nytimes.com/2020/07/17/technology/twitter-hackers-                  ting,” in Proceedings of IEEE Symposium on Security and Privacy
      interview.html.                                                                        (S&P), San Jose, CA, May 2015.
[8]   “.IN TLD Regulations,” https://web.archive.org/web/20080119113830/              [29]   S. Kruikemeier, “How Political Candidates Use Twitter and the Impact
      http://www.registry.in/policies/.                                                      on Votes,” Computers in Human Behavior, 2014.



                                                                                 14
[30]   Z. Li, S. Alrwais, Y. Xie, F. Yu, and X. Wang, “Finding the Linchpins of               on Online Services,” in Proceedings of USENIX Security Symposium,
       the Dark Web: A Study on Topologically Dedicated Hosts on Malicious                    Washington, DC, August 2015.
       Web Infrastructures,” in Proceedings of IEEE Symposium on Security              [43]   G. Stringhini, G. Wang, M. Egele, C. Kruegel, G. Vigna, H. Zheng,
       and Privacy (S&P), San Francisco, CA, May 2013.                                        and B. Y. Zhao, “Follow the Green: Growth and Dynamics in Twitter
[31]   A. Liaw and M. Wiener, “Classification and Regression by randomFor-                    Follower Markets,” in Proceedings of SIGCOMM conference on Internet
       est,” R News, 2002.                                                                    Measurement Conference (IMC), Barcelona, Spain, October 2013.
[32]   C. Ling, U. Balcı, J. Blackburn, and G. Stringhini, “A First Look at            [44]   P. H. Swain and H. Hauska, “The Decision Tree Classifier: Design and
       Zoombombing,” in Proceedings of IEEE Symposium on Security and                         Potential,” IEEE Transactions on Geoscience Electronics, 1977.
       Privacy (S&P), Virtual, May 2021.                                               [45]   R. Tahir, A. Raza, F. Ahmad, J. Kazi, F. Zaffar, C. Kanich, and M. Cae-
[33]   S. Marchal, J. François, and T. Engel, “Proactive Discovery of Phish-                 sar, “It’s All In the Name: Why Some URLs Are More Vulnerable to
       ing Related Domain Names,” in Proceedings of the International                         Typosquatting,” in Proceedings of IEEE International Conference on
       Symposium on Research in Attacks, Intrusions and Defenses (RAID),                      Computer Communications (INFOCOM), Honolulu, HI, April 2018.
       Amsterdam, Netherlands, September 2012.                                         [46]   K. Thomas, D. Akhawe, M. Bailey, D. Boneh, E. Bursztein, S. Con-
[34]   E. Mariconti, J. Onaolapo, S. S. Ahmad, N. Nikiforou, M. Egele,                        solvo, N. Dell, Z. Durumeric, P. G. Kelley, D. Kumar et al., “SoK:
       N. Nikiforakis, and G. Stringhini, “What’s in a Name? Understanding                    Hate, Harassment, and the Changing Landscape of Online Abuse,”
       Profile Name Reuse on Twitter,” in Proceedings of the International                    in Proceedings of IEEE Symposium on Security and Privacy (S&P),
       Conference on World Wide Web (WWW), Perth, Australia, April 2017.                      Virtual, May 2021.
[35]   T. Moore and B. Edelman, “Measuring the Perpetrators and Funders                [47]   K. Thomas, C. Grier, J. Ma, V. Paxson, and D. Song, “Design and Eval-
       of Typosquatting,” in Proceedings of the International Conference on                   uation of a Real-Time URL Spam Filtering Service,” in Proceedings of
       Financial Cryptography and Data Security (FC), Tenerife, Canary                        IEEE Symposium on Security and Privacy (S&P), Berkeley, CA, May
       Islands, January 2010.                                                                 2011.
[36]   N. Nikiforakis, L. Invernizzi, A. Kapravelos, S. Van Acker, W. Joosen,          [48]   K. Thomas, C. Grier, D. Song, and V. Paxson, “Suspended Accounts
       C. Kruegel, F. Piessens, and G. Vigna, “You Are What You Include:                      in Retrospect,” in Proceedings of SIGCOMM conference on Internet
       Large-Scale Evaluation of Remote Javascript Inclusions,” in Proceed-                   Measurement Conference (IMC), Berlin, Germany, November 2011.
       ings of ACM SIGSAC Conference on Computer and Communications                    [49]   S. V. M. Vishwanathan and M. Narasimha Murty, “SSVM: A Simple
       Security (CCS), Raleigh, NC, October 2012.                                             SVM Algorithm,” in Proceedings of the International Joint Conference
[37]   S. Pouryousef, M. D. Dar, S. Ahmad, P. Gill, and R. Nithyanand, “Extor-                on Neural Networks (IJCNN), Honolulu, HI, May 2002.
       tion or Expansion? An Investigation into the Costs and Consequences             [50]   T. Vissers, W. Joosen, and N. Nikiforakis, “Parking Sensors: Analyzing
       of ICANN’s gTLD Experiments,” in Proceedings of the Passive and                        and Detecting Parked Domains,” in Proceedings of Network and Dis-
       Active Measurement Conference (PAMC), Virtual, March 2020.                             tributed System Security Symposium (NDSS), San Diego, CA, February
[38]   H. Sanchez and S. Kumar, “Twitter Bullying Detection,” USENIX                          2015.
       Symposium on Network Systems Design and Implementation, 2011.                   [51]   B. Viswanath, M. A. Bashir, M. Crovella, S. Guha, K. P. Gummadi,
[39]   K. Starbird, A. Arif, and T. Wilson, “Disinformation as Collaborative                  B. Krishnamurthy, and A. Mislove, “Towards Detecting Anomalous
       Work: Surfacing the Participatory Nature of Strategic Information                      User Behavior in Online Social Networks,” in Proceedings of USENIX
       Operations,” in Proceedings of ACM on Human-Computer Interaction                       Security Symposium, San Diego, CA, August 2014.
       (PACM HCI), Taipei, Taiwan, October 2019.                                       [52]   Y.-M. Wang, D. Beck, J. Wang, C. Verbowski, and B. Daniels, “Strider
[40]   G. Stivala and G. Pellegrino, “Deceptive Previews: A Study of the                      Typo-Patrol: Discovery and Analysis of Systematic Typo-Squatting,” in
       Link Preview Trustworthiness in Social Platforms,” in Proceedings                      Proceedings of the Conference on Steps to Reducing Unwanted Traffic
       of Network and Distributed System Security Symposium (NDSS), San                       on the Internet (SRUTI), San Jose, CA, July 2006.
       Diego, CA, February 2020.                                                       [53]   S. Zannettou, T. Caulfield, W. Setzer, M. Sirivianos, G. Stringhini, and
[41]   G. Stringhini, C. Kruegel, and G. Vigna, “Detecting Spammers on                        J. Blackburn, “Who Let the Trolls Out? Towards Understanding State-
       Social Networks,” in Proceedings of the Annual Computer Security                       sponsored Trolls,” in Proceedings of the Conference on Web Science
       Applications Conference (ACSAC), Austin, TX, December 2010.                            (WebSci), Amsterdam, Netherlands, May 2019.
[42]   G. Stringhini, P. Mourlanne, G. Jacob, M. Egele, C. Kruegel, and G. Vi-         [54]   C. Zauner, “Implementation and Benchmarking of Perceptual Image
       gna, “EVILCOHORT: Detecting Communities of Malicious Accounts                          Hash Functions,” 2010.




                                                                                  15
