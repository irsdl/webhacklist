---
type: Whitepaper
title: "“You Might Also Like:” Privacy Risks of Collaborative Filtering"
description: "Public recommender output - item-similarity lists and item-to-item covariances - shifts measurably when a single user acts. The authors monitor those shifts over time and combine them with a little known auxiliary history for a target, inferring that user's non-public purchases and ratings. Evaluated passively against Hunch, LibraryThing, Last.fm and Amazon."
resource: "https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf"
tags: [whitepaper, webseclist-reference, info-leak, side-channel, measurement-study, case-study]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:42:07+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf"
    title: "“You Might Also Like:” Privacy Risks of Collaborative Filtering"
    author: Joseph A. Calandrino, Ann Kilzer, Arvind Narayanan, Edward W. Felten, Vitaly Shmatikov
also_at: []
authors:
  - Joseph A. Calandrino
  - Ann Kilzer
  - Arvind Narayanan
  - Edward W. Felten
  - Vitaly Shmatikov
canonical_url: ""
cited_by:
  - "2011.md:67"
commit: ""
content_sha256: cad421512caefcac2a1162cbf7e84533794eaa6b43ce60fb6b663878a577a320
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: ae46e858db0e4481e7761dafe7e203c8eda0f02cc26fdc73462b0fb3e879e08e
retrieved_from: "https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:42:07+00:00"
slug: you-might-also-like-privacy-risks-collaborative-filtering
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# “You Might Also Like:” Privacy Risks of Collaborative Filtering

**“You Might Also Like:” Privacy Risks of Collaborative Filtering** - Joseph A. Calandrino, Ann Kilzer, Arvind Narayanan, Edward W. Felten, Vitaly Shmatikov, Publisher not stated.

- Published: date not stated
- Original: <https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf>
- Preserved from: https://www.ieee-security.org/TC/SP2011/PAPERS/2011/paper015.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

2011 IEEE Symposium on Security and Privacy




                             “You Might Also Like:”
                      Privacy Risks of Collaborative Filtering
           Joseph A. Calandrino1 , Ann Kilzer2 , Arvind Narayanan3 , Edward W. Felten1 , and Vitaly Shmatikov2
                  1
                   Dept. of Computer Science, Princeton University {jcalandr,felten}@cs.princeton.edu
            2
                Dept. of Computer Science, The University of Texas at Austin {akilzer,shmat}@cs.utexas.edu
                           3
                             Dept. of Computer Science, Stanford University arvindn@cs.utexas.edu

    Abstract—Many commercial websites use recommender sys-                    observation that temporal changes in aggregate recommenda-
 tems to help customers locate products and content. Modern                   tions enable accurate inference of individual inputs.
 recommenders are based on collaborative filtering: they use
                                                                                 Our algorithms require only passive, “black-box” access to
 patterns learned from users’ behavior to make recommendations,
 usually in the form of related-items lists. The scale and complexity         the public outputs of a recommender system, as available to
 of these systems, along with the fact that their outputs reveal only         any Internet user. The attacker need not create fake customers
 relationships between items (as opposed to information about                 or enter purchases or ratings into the system. We do not assume
 users), may suggest that they pose no meaningful privacy risk.               that customers’ transactions are available in either identifiable
    In this paper, we develop algorithms which take a moderate
                                                                              or anonymized form. Our approach is thus fundamentally
 amount of auxiliary information about a customer and infer this
 customer’s transactions from temporal changes in the public                  different from the techniques for re-identifying anonymized
 outputs of a recommender system. Our inference attacks are                   transactional records [26]. Re-identification assumes that the
 passive and can be carried out by any Internet user. We evaluate             attacker has direct access to customers’ records. By contrast,
 their feasibility using public data from popular websites Hunch,             our attacks rely only on indirect access: the records are fed into
 Last.fm, LibraryThing, and Amazon.
                                                                              a complex collaborative filtering algorithm and the attacker’s
                        I. I NTRODUCTION                                      view is limited to the resulting outputs.
    Recommender systems are ubiquitous on the Web. When                          Our algorithms monitor changes in the public outputs of rec-
 you buy products from Amazon, rent movies on Netflix,                        ommender systems—item similarity lists or cross-item correla-
 listen to music on Last.fm, or perform myriad other tasks                    tions—over a period of time. This dynamic information is then
 online, recommender systems make suggestions based on your                   combined with a moderate amount of auxiliary information
 behavior. They typically rely on collaborative filtering, or                 about some of the transactions of a particular “target” user. The
 patterns learned from other users: for example, “customers                   combination is used to infer many of the target user’s unknown
 who buy item X (as you just did) often buy item Y .”                         transactions with high accuracy. Auxiliary information can be
    We investigate the privacy risks of recommender systems                   obtained by analyzing the user’s publicly revealed behavior;
 based on collaborative filtering. By design, such systems                    we discuss this in more detail in Section III.
 do not directly reveal behavior of individual users or any                   Overview of results. We evaluate our algorithms on real-world
 “personally identifiable information.” Their recommendations                 recommender systems which produce different types of rec-
 are based on aggregated data involving thousands to millions                 ommendations. Our goal is not to claim privacy flaws in these
 of users, each with dozens to thousands of transactions. More-               specific sites—in fact, we often use data voluntarily disclosed
 over, modern collaborative filtering leverages relationships                 by their users to verify our inferences—but to demonstrate the
 between items rather than relationships between users, creating              general feasibility of inferring individual transactions from the
 an extra level of indirection between public recommendations                 outputs of collaborative filtering systems.
 and individual transactions. One might therefore assume that it                 Some recommender systems make item-to-item correlations
 is infeasible to draw meaningful inferences about transactions               available. An example is Hunch, a popular recommendation
 of specific users from the public outputs of recommender                     and personalization website. There is a tradeoff between the
 systems. We show that this assumption is wrong.                              number of inferences and their accuracy. When optimized for
 Our contributions. We develop a set of practical algorithms                  accuracy, our algorithm infers a third of the test users’ secret
 that allow accurate inference of (partial) individual behavior               answers to Hunch questions with no error.
 from the aggregate outputs of a typical recommender system.                     Other recommender systems make only item similarity or
 We focus on item-to-item collaborative filtering, in which the               “related items” lists available, with or without numeric similar-
 system recommends items similar to a given item. Our key                     ity scores. Examples include Last.fm, an online music service,
 insight is to exploit the dynamics of public recommendations                 and LibraryThing, an online book cataloging service and
 in order to make the leap from aggregate to individual data.                 recommendation engine. The results from our LibraryThing
 This paper is the first to make and quantitatively evaluate the              experiment illustrate the yield-accuracy tradeoff, ranging from


1081-6011/11 $26.00 © 2011 IEEE                                         231
DOI 10.1109/SP.2011.40
58 inferences per user with 50% accuracy to 6 inferences per                how many times he listened to a song, or what rating he gave
user with 90% accuracy. Another example of item similarity                  to a movie. Because the item set is typically far larger than a
lists is the “Customers who bought this item also bought . . . ”            single user can consume and evaluate, this matrix is “sparse:”
feature on Amazon. Our ability to evaluate our algorithms on                only a small fraction of entries are filled in. A recommender
Amazon’s recommender system is constrained by the lack of                   system takes this matrix as input, along with any available
a “ground-truth oracle” for verifying our inferences, but we                metadata about users (such as demographics) and items (such
conducted a limited experiment to demonstrate the feasibility               as item categories). The goal of the system is to extrapolate
of adversarial inference against Amazon’s recommendations.                  users’ “true” preferences over the full item set.
   By necessity, our experiments on real-world systems involve                 Recommender systems can provide several types of rec-
only a limited sample of users. To demonstrate that our                     ommendations. If the system suggests items to an individual
inference algorithms also work at scale, we implemented an                  user based on its knowledge of the user’s behavior, it provides
item-to-item collaborative filtering engine very similar to that            user-to-item recommendations. If the system helps users find
used by Amazon, and ran it on the Netflix Prize dataset of                  similar users, it provides user-to-user recommendations. If,
movie-rating histories [28]. This allowed us to simulate a                  given an item, the system suggests similar items, it provides
complete system, producing public recommendations as well                   item-to-item recommendations. The system may even list users
as auxiliary information about users. The underlying dataset                who are strongly associated with a given item, thus providing
of individual ratings served as the “ground-truth oracle” for               item-to-user recommendations. The same system may provide
verifying inferences made by our algorithm. Our algorithm                   several types of recommendations: for example, Last.fm pro-
was able to infer 4.5% of transactions of sufficiently active               vides both item-to-item and user-to-user recommendations.
users with an accuracy of 90%.                                                 We focus on item-to-item recommendations, both because
   There is a passing similarity between our inference algo-                they are supported by essentially all popular online recom-
rithms and actual collaborative filtering. Both use statistical             mender systems and because their output is typically public
methods to reach probabilistic conclusions about unknown                    and thus the most feasible avenue for an attack.
aspects of users’ behavior. Our algorithms, however, are tech-                 A thorough technical survey of the literature on recom-
nically different and pursue a fundamentally different goal: not            mender systems can be found in [1]. Recommender systems
to predict future events, but to infer past events. This translates         can be classified as content-based, collaborative, and hybrid.
into several concrete differences, discussed in Section V. For              Content-based systems identify relationships between items
example, in contrast to prediction algorithms, ours perform                 based on metadata alone and recommend items which are
best when a user deviates from normal patterns and if his                   similar to the user’s past transactions. Purely content-based
transactions involve less popular items. We can also infer an               recommender systems pose no privacy risks under our attacks,
approximate date when a transaction occurred.                               since the system does not consider other users’ transactions
   For completeness with respect to different types of recom-               when making recommendations to a user.
mender systems, we present a simple active attack on user-                     Collaborative filtering is much more robust and domain-
based collaborative filtering. In broad terms, the attacker cre-            agnostic, and hence far more popular. Collaborative filtering
ates multiple sybil users whose transactional profile is similar            identifies relationships between items based on the preferences
to what he knows about the target user’s profile and infers                 of all users. Traditional collaborative filtering methods are
the target’s non-public transactions from the recommendations               user-based. For a given user, the system finds other users
made by the system to these sybils.                                         with a similar transaction history. In the user-to-user case, the
   In summary, this work is the first to develop a generic                  system recommends these similar users; in the user-to-item
method for inferring information about individual users’ trans-             case, it recommends items selected by the similar users.
actions from the aggregate outputs of collaborative filtering.                 The alternative is item-based collaborative filtering, which
We show that public outputs of common recommender al-                       was first described by Sarwar et al. [31] and has become the
gorithms may expose non-public details of individual users’                 dominant approach [2, 20, 21]. It generates recommendations
behavior—products they purchase, news stories and books                     using item similarity scores for pairs of items, which are based
they read, music they listen to, videos they watch, and other               on the likelihood of the pair being purchased by the same
choices they make—without their knowledge or consent.                       customer. Although some systems make raw similarity scores
                                                                            public, their main uses are internal: for example, to find items
          II. S URVEY OF RECOMMENDER SYSTEMS                                which are similar to a user’s previously purchased items in
   Recommender systems have become a vital tool for attract-                order to make user-to-item recommendations.
ing and keeping users on commercial websites. Their utility
is supported by research [14] as well as common practice.                   A. Item-to-item recommendations
   The task of a recommender system can be abstractly de-                      It has become standard practice for online recommender
scribed as follows. Consider a matrix in which rows corre-                  systems to publish item-to-item recommendations, usually in
spond to users and columns correspond to items. Each value                  the form of item similarity lists produced from item similarity
in this matrix represents a user’s revealed or stated preference            scores. Given an item, these lists help find related items
(if any) for an item: for example, whether he purchased a book,             (see [6] for a survey of algorithms). On Amazon, this is seen as



                                                                      232
the “Customers who bought this item also bought . . . ” feature.                          For completeness, we also briefly consider active attacks,
Similar features are found on many commercial websites,                                where the attacker creates fake, “sybil” users and manipulates
including iTunes, Last.fm, Pandora, Netflix, YouTube, Hulu,                            their entries in the corresponding rows of the transaction
and Google Reader. Item similarity lists even appear on many                           matrix. Depending on the system, this includes adding new
sites that do not have traditional user-to-item recommenda-                            entries (easy in the case of ratings and stated preferences,
tions, such as IMDb, CNN, and the New York Times.1 Item                                more expensive for purchases), modifying existing entries, or
similarity lists may be limited to top N items or contain an                           deleting them (easy in the case of ratings and preferences
ordered list of hundreds or thousands of items.                                        and may also be possible for purchases; for example, one
   Many systems reveal additional information. Amazon re-                              can instruct Amazon to ignore certain purchases when making
veals not only the relative popularity of items via bestseller                         recommendations). Observable outputs include items recom-
lists and “sales rank,” but also the percentage of users pur-                          mended by the system to the sybil users and, in the case of
chasing certain other items after viewing the given item.2 For                         systems like Last.fm or LibraryThing, also user similarity lists
every song, Last.fm provides the number of listeners and how                           which explicitly identify users with similar histories.
many times it was played by each listener. Given a book,
LibraryThing provides several ordered lists of related books,                          Auxiliary information. We assume that for some users, a
including more common and more obscure recommendations;                                subset of their transaction history is available to the attacker.
some lists also contain detailed transaction information, such                         We refer to this as the attacker’s auxiliary information. An
as the precise number of users who have both books. Finally,                           inference attack is successful if it enables the attacker to learn
Hunch gives all users access to the entire item-to-item co-                            transactions which are not part of the auxiliary information.
variance matrix via an API.                                                            In other words, the attacker’s objective is to “leverage” his
                                                                                       prior knowledge of some of the target user’s transactions to
B. User-to-item recommendations                                                        discover transactions that he did not know about.
   User-to-item recommendations may be user-based (finding                                There are many sources of auxiliary information. The first is
similar users and recommending their items) or item-based                              the target system itself. On many websites, users publicly rate
(finding items related to ones that the user chose in the past).                       or comment on items, revealing a high likelihood of having
Amazon provides several personalized lists with up to 1,000                            purchased them. The system may even publicly confirm the
items to logged-in users. LibraryThing, Last.fm, and Netflix                           purchase, e.g., “verified purchase” on Amazon. Alternatively,
also provide recommendation lists to their users.                                      on sites with granular privacy controls, some of the transac-
                      III. ATTACK MODEL                                                tions may be publicly visible, while others remain private.
   We view the data that the system uses to make recommenda-                              The second source is users revealing partial information
tions as a matrix where rows correspond to users and columns                           about themselves via third-party sites. This is increasingly
to items. Each cell represents a transaction (e.g., the user’s                         common: for example, music websites allow embedding of
purchase or stated preference for an item). Entries may be                             tracks or playlists on blogs or other sites, while Amazon
dated; the date may or may not be sensitive from a privacy                             Kindle allows “tweeting” a selected block of text; the identity
perspective. As users interact with the system, the matrix is                          of the book is automatically shared via the tweet.3
continually updated and new recommendations are generated.
                                                                                          The third source is data from other sites which are not
   Our primary focus is on passive inference attacks. The
                                                                                       directly tied to the user’s transactions on the target site,
attacker has access to the public outputs of the recommender
                                                                                       but leak partial information about them. For example, books
system, which, depending on the system, may include item
                                                                                       listed in a Facebook user profile reveal partial information
similarity lists, item-to-item covariances, and/or relative pop-
                                                                                       about purchases on Amazon. Linking users across different
ularity of items (see Section II). The outputs available to the
                                                                                       sites is a well-studied problem [17, 27]. On blippy.com, “a
attacker are available to any user of the system. Crucially, the
                                                                                       website where people obsessively review everything they buy,”
attacker observes the system over a certain period and can
                                                                                       individual purchase histories can be looked up by username,
thus capture changes in its outputs: an increase in covariance
                                                                                       making linkages to other sites trivial. Note that the third (and
between certain items, appearance of an item on the similarity
                                                                                       to a lesser extent, the second) source of auxiliary information
list of another item, an increase in an item’s sales rank, etc.
                                                                                       is outside the control of the recommender system.
Note, however, that each update incorporates the effects of
hundreds or thousands of transactions. With the exception                                 Furthermore, information about users’ behavior is con-
of auxiliary information (described below), inputs into our                            stantly leaked through public mentions on online fora, real-
inference algorithms are based on aggregate statistics and con-                        world interactions with friends, coworkers, and acquaintances,
tain neither personally identifiable information nor information                       etc. Therefore, we do not consider the availability of auxiliary
about specific transactions.                                                           information to be a significant impediment to our attacks.
  1 Even offline retailers such as supermarkets frequently deploy item-to-item
similarity analysis to optimize store layout [3].
  2 We do not exploit the latter information for the inference attacks in this           3 The stream of such tweets can be conveniently accessed in real time by
paper. This is an interesting topic for future research.                               searching Twitter for “amzn.com/k/”.




                                                                                 233
 Algorithm 1: R ELATED I TEMS L IST I NFERENCE                             where users share the books they read. Classics such as To
  Input: Set of target items T , set of auxiliary items A, scoring         Kill a Mockingbird or Catcher in the Rye are so common that
         function : R|A| → R                                               changes in their similarity lists tend to result from widespread
  Output: Subset of items from T which are believed by the                 trends, not actions of a single user. Movement of a book
           attacker to have been added to the user’s record                in a list associated with an obscure book reveals more than
  inf erredItems = {}                                                      movement in a list associated with a bestseller.
  foreach observation time τ do
      ∆ = observation period beginning at τ                                B. Inference attack on the covariance matrix
      N∆ = delta matrix containing changes in positions of
      items from T in lists associated with items from A                       In this setting of the problem, the item-to-item covariance
      foreach target item t in N∆ do                                       matrix is visible to any user of the system. An example of an
          scorest = S CORE F UNCTION(N∆ [t])                               online recommender system that reveals the covariance matrix
          if scorest ≥ threshold and t ∈   / A then                        is Hunch (see Section VI-A). We also explain complications,
               inf erredItems = inf erredItems ∪ {t}
  return inf erredItems                                                    such as asynchronous updates to the system’s public outputs,
                                                                           which apply to the related-items scenario as well.
                                                                               Let I be the set of items. The recommender system main-
                                                                           tains an item-to-item matrix M . For any two distinct items
             IV. G ENERIC INFERENCE ATTACKS                                i, j ∈ I, the (i, j) cell of M contains a measure of the
A. Inference attack on related-items lists                                 similarity between i and j. In the setting of this section, (i, j)
   In this setting of the problem, the recommender system                  and (j, i) contain the covariance between i and j. In the setting
outputs, for each item, one or more lists of related items.                of Section IV-A, the (i, j) cell contains the position, if any, of
For example, for each book, LibraryThing publishes a list of               item i in j’s related-items list, along with additional informa-
popular related books and a list of obscure related books.                 tion such as numeric similarity strength. As users interact with
   The description of the inference algorithm in this section is           the recommender system by making purchases, entering their
deliberately simplified with many details omitted for clarity.             preferences, etc., the system continually accumulates more
Intuitively, the attacker monitors the similarity list(s) associ-          data and updates M at discrete intervals.
ated with each auxiliary item (i.e., item that he knows to be                  For each user u, the recommender system maintains a
associated with the target user). The attacker looks for items             “record” Su ⊂ I. As the user interacts with the system, some
which either appear in the list or move up, indicating increased           item t may be added to Su , reflecting that t is now related to
“similarity” with the auxiliary item. If the same target item              the user. In some systems, the same item may be added to Su
t appears and/or moves up in the related-items lists of a                  multiple times: for example, the user may listen to a particular
sufficiently large subset of the auxiliary items, the attacker             song, watch a movie, or purchase a product more than once.
infers that t has been added to the target user’s record.                  The system may also remove items from Su , but this is less
   Algorithm 1 shows the inference procedure. Intuitively, delta           common and not used for our attack.
matrices N∆ store information about the movement of each                       Consider a toy case when a single user u interacts with the
target item t in the related-items lists of auxiliary items A              system between time τ1 and τ2 = τ1 + ∆, and t is added to
(we defer the discussion of matrix construction). The attacker             the user’s item list Su . Covariance between t and all other
computes a score for each t using a scoring function. The                  items in Su must increase. Let M1 be the matrix at time τ1 ,
simplest scoring function counts the number of auxiliary items             M2 the matrix at time τ2 , and M∆ = M2 − M1 . Then, for
in whose related-items lists t has appeared or risen. If the final         all items si ∈ Su , the (si , t) entry of M∆ will be positive. Of
score exceeds a predefined threshold, the attacker concludes               course, real-world recommender systems interact concurrently
that t has been added to the user’s record.                                with multiple users whose item sets may overlap.
   Scoring can be significantly more complex, taking into                      Intuitively, the attack works as follows. The attacker has
account full dynamics of item movement on related-items                    auxiliary information about some items in the target user’s
lists or giving greater weight to certain lists. To reduce                 record (Section III). By observing simultaneous increases in
false positives and improve inference accuracy, the scoring                covariances between auxiliary items and some other item t, the
function must be fine-tuned for each system. For example,                  attacker can infer that t has been added to the user’s record.
recommender systems tend to naturally cluster items. Netflix                   Formally, the attacker’s auxiliary information is a subset
users who watched the DVD of the first season of “The Office”              A ⊆ Su . It helps—but is not necessary—if A is uniquely
also tend to watch the second season. Suppose that some movie              identifying, i.e., for any other user uj of the recommender
rises in the similarity lists of both seasons’ DVDs. Because               system, A * Suj . This is possible if items in A are less
the overlap in viewers across seasons is so great, this does               popular or if A is large enough [26].
not reveal much more information than a movie rising in the                    The attacker monitors the recommender system and obtains
list associated with a single DVD. In fact, it may reveal less if          the covariance matrix M at each update. Let T ⊆ I \A be the
users who watch only one of the two seasons are very unusual.              set of items the user may have selected. The attacker observes
   Our scoring functions prefer sets of auxiliary items which              the submatrix of M formed by rows corresponding to the items
span genres or contain obscure items. Consider LibraryThing,               in T ∪ A and columns corresponding to the items in A. Call



                                                                     234
this submatrix N . Since A ⊆ Su , when an item t ∈ T is                         Algorithm 2: M ATRIX I NFERENCE
added to Su , covariances between t and many ai ∈ A will                         Input: Set of target items T , set of auxiliary items A,
increase. If the attacker can accurately recognize this event,                          P ROPAGATEDAUX returns a subset of A,
he can infer that t has been added to Su .                                              implementation-specific parameters
   The inference procedure is significantly complicated by the                          thresholdsupport,score
                                                                                 Output: Subset of items from T which are believed by the
fact that when an item is added to Su , not all of its covariances                        attacker to have been added to Su
are updated at the same time due to processing delays. In
                                                                                 inf erredItems = {}
particular, (t, ai ) covariances for ai ∈ A may update at                        foreach observation time τ do
different times for different auxiliary items ai . Furthermore,                      propagatedτ = P ROPAGATEDAUX(A, τ )
auxiliary items may enter the system at or around the same                           ∆ = observation period beginning at τ
time as t. We cannot use the (t, ai ) covariance unless we are                       N∆ = delta matrix containing changes in covariances
                                                                                     between items in T ∪ A
certain that the addition of item ai to u’s record has been
                                                                                     foreach item t in T do
reflected in the system. Before attempting an inference, we                              scoreSett = subset of a ∈ A such that N∆ [t][a] > 0
compute the subset of auxiliary items which “propagated”                                 supportt = |scoreSett ∩ propagatedτ |
                                                                                                      |supportt |
into the covariance matrix. The algorithm works by measuring                             scoret = |propagated    τ|
increases in pairwise covariances between auxiliary items; we                            if scoret ≥ thresholdscore and
omit the details due to space limitations. In the following, we                          supportt ≥ thresholdsupport then
refer to this algorithm as P ROPAGATEDAUX.                                                    inf erredItems = inf erredItems ∪ {t}
                                                                                 return inf erredItems
Constructing delta matrices. Suppose the attacker observes
the covariance submatrices Nτ1 , Nτ2 , . . . at times τ1 , τ2 , . . ..
For each observation, the attacker creates a delta matrix N∆
                                                                               the k-nearest neighbor (kNN) recommendation algorithm [1].
which captures the relevant changes in covariances. There are
                                                                               Consider the following user-to-item recommender system. For
several ways to build this matrix. In the following, τmax is a
                                                                               each user U , it finds the k most similar users according to some
parameter of the algorithm, representing the upper bound on
                                                                               similarity metric (e.g., the Pearson correlation coefficient or
the length of inference windows.
                                                                               cosine similarity). Next, it ranks all items purchased or rated
Strict time interval. For each τi , set N∆ = Nτi+1 − Nτi . Since               by one or more of these k users according to the number of
not all covariances may update between τi and τi+1 , some                      times they have been purchased and recommends them to U
entries in N∆ may be equal to 0.                                               in this order. We assume that the recommendation algorithm
First change. For each τi , N∆ consists of the first changes in                and its parameters are known to the attacker.
covariance after τi . Formally, for each entry (x, y) of N , let                  Now consider an attacker whose auxiliary information con-
τk > τi be the first time after τi such that τk ≤ τmax and                     sists of the user U ’s partial transaction history, i.e., he already
Nτk [x][y] 6= Nτi [x][y]. Set N∆ [x][y] = Nτk [x][y] − Nτi [x][y].             knows m items that U has purchased or rated. His goal is to
                                                                               learn U ’s transactions that he does not yet know about.
Largest change. Similar to first change.
                                                                                  The attacker creates k sybil users and populates each sybil’s
Making an inference. The attacker monitors changes in                          history with the m items which he knows to be present in
the submatrix N . For each relevant interval ∆, the attacker                   the target user U ’s history. Due to the sparsity of a typical
computes the delta matrix N∆ as described above and uses                       transaction dataset [26], m ≈ O(log N ) is sufficient for the
P ROPAGATEDAUX to compute which auxiliary items have                           attack on an average user, where N is the number of users.
propagated into N . Then he applies Algorithm 2. In this                       (In practice, m ≈ 8 is sufficient for datasets with hundreds
algorithm, scoreSett is the set of all auxiliary items whose                   of thousands of users.) With high probability, the k nearest
pairwise covariances with t increased, supportt is the sub-                    neighbors of each sybil will consist of the other k − 1 sybils
set of scoreSett consisting of auxiliary items which have                      and the target user U . The attacker inspects the list of items
propagated, scoret is the fraction of propagated items whose                   recommended by the system to any of the sybils. Any item
covariances increased. If scoret and supportt exceed certain                   which appears on the list and is not one of the m items
thresholds (provided as parameters of the algorithm), the                      from the sybils’ artificial history must be an item that U has
attacker concludes that t has been added to the user’s record.                 purchased. Any such item was not previously known to the
   Inference algorithms against real-world recommender sys-                    attacker and learning about it constitutes a privacy breach.
tems require fine-tuning and adjustment. Algorithm 2 is only a                    This attack is even more powerful if the attacker can
high-level blueprint; there are many system-specific variations.               adaptively change the fake history of his sybils after observing
For example, the algorithm may look only for increases in                      the output of the recommender system. This capability is
covariance that exceed a certain threshold.                                    supported by popular systems—for example, Netflix users
                                                                               can change previously entered ratings, while Amazon users
C. Inference attack on kNN recommender systems                                 can tell the site to ignore certain transactions when making
  Our primary focus is on passive attacks, but for complete-                   recommendations—and allows the attacker to target multiple
ness we also describe a simple, yet effective active attack on                 users without having to create new sybils for each one.


                                                                         235
D. Attack metrics                                                        populate lower ranges of auxiliary items’ similarity lists, where
   Our attacks produce inferences of this form: “Item Y was              a single transaction has the biggest impact. Section VII shows
added to the record of user X during time period T .” The                that transactions involving obscure items are more likely to be
main metrics are yield and accuracy. Yield is the number of              inferred by our algorithms.
inferences per user per each observation period, regardless                 Prediction quality can be seen as a baseline for feasible
of whether those inferences are correct. Accuracy is the                 inference quality. A prediction is effectively an expected
percentage of inferences which are correct. We use yield rather          probability that a user with item a will select some target
than alternative metrics that focus on the number of correct             item t at any time. If a user with item a selects item t during
inferences because the attacker can adjust the parameters to             a given time period, he exceeds this expected probability,
control the number of inferences made by our algorithm but               causing a temporary rise (until other users balance the impact).
cannot directly control the number or proportion that are                By looking at changes in predictions over short periods of
correct. Where it makes sense, we also express yield as the              time, we can reconstruct how user behavior deviated from the
percentage of the user’s transactions inferred by our algorithm,         predictions to produce the observed changes. This yields more
but in general, we focus on the absolute number of inferences.           accurate information than predictions alone. As Sections VI-A
   High yield and high accuracy are not simultaneously nec-              and VII show, our algorithms not only outperform a Bayesian
essary for an attack to be dangerous. A single accurate                  predictor operating on the same data, but also infer items
inference could be damaging, revealing anything from a                   ranked poorly by a typical prediction algorithm.
medical condition to political affiliation. Similarly, a large              Finally, it is worth mentioning that we use some machine-
number of less accurate inferences could be problematic if               learning techniques for tuning inference algorithms that oper-
their implications are uniformly negative. While the victim              ate on related-items lists (see Section VI-C). These techniques
may retain plausible deniability for each individual inference,          are very different from collaborative filtering. Whereas collab-
this provides little or no protection against many privacy               orative filtering attempts to predict future behavior based on
violations. For example, plausible deniability does not help in          past behavior of other users, our models are backward-facing.
situations where judgments are based on risk (e.g., insurance)           We know that an item has risen in a similarity list, but we
or prejudice (e.g., workplace discrimination), or where the              don’t know why. To produce accurate inferences, we must
inferred information further contributes to a negative narrative         learn which observations are sufficient to conclude that this
(e.g., confirms existing concerns that a spouse is cheating).            rise signals addition of the item to the target user’s record. In
   There is an inherent tradeoff between yield and accuracy.             summary, we use machine learning to learn the behavior of
The higher the yield, the higher the number of incorrect infer-          the recommender system itself, not the behavior of its users.
ences (“false positives”). Different combinations of parameters
                                                                                VI. E VALUATION ON REAL - WORLD SYSTEMS
for our algorithms produce either more inferences at the cost
of accuracy, or fewer, but more accurate inferences. Therefore,             We evaluated our inference algorithms on several real-world
we evaluate our algorithms using the yield-accuracy curve.               recommender systems. Our goal was not to carry out an actual
                                                                         attack, but to demonstrate the feasibility and measure the
              V. I NFERENCE VS . PREDICTION                              accuracy of our algorithms. Therefore, all experiments were set
   At first glance, our inference algorithms may look similar            up so that we knew each user’s record in advance because the
to standard collaborative filtering algorithms which attempt to          user either revealed it voluntarily through the system’s public
predict the items that a user may like or purchase in the future         interface or cooperated with us. This provided the “ground-
based on his and other users’ past transactions.                         truth oracle,” enabling us to measure the accuracy of our
   The two types of algorithms are completely different, both            inferences without violating anyone’s privacy.
technically and conceptually. We infer the user’s actual trans-
actions—as opposed to using the known behavior of similar                A. Hunch
users to guess what he may do or have done. Prediction algo-                Hunch.com provides personalized recommendations on a
rithms discover common patterns and thus have low sensitivity            wide range of topics. For each topic, Hunch poses a se-
to the presence or absence of a single user. Our algorithms are          ries of multiple-choice questions to the user and uses the
highly sensitive. They (1) work better if there are no similar           responses to predict the user’s preferences. Hunch also has
users in the database, but (2) do not work if the target user is         a large set of generic personal questions in the category
not the database, even if there are many similar users.                  “Teach Hunch About You” (THAY), intended to improve
   Collaborative filtering often exploits covariances between            topic recommendations. Hunch aggregates collected data and
items; our algorithms exploit changes in covariance over time.           publishes statistics which characterize popular opinions in
The accuracy of predictions produced by collaborative filtering          various demographics. For example, according to responses
does not change dramatically from period to observation                  given to Hunch, “birthers” are 94% more likely to say that
period; by contrast, we infer the approximate date when the              cultural activities are not important to them and 50% more
transaction occurred, which is very hard to discover using               likely to believe in alien abductions [16].
collaborative filtering. Finally, our algorithms can infer even             Statistics collected by Hunch are accessible via an API.
transactions involving very obscure items. Such items tend to            They include the number of users responding to each THAY



                                                                   236
question, the percentage selecting each possible answer, the               Algorithm 3: H UNCH I NFERENCE
number of users who responded to each pair of questions, and                Input: Set Q of non-overlapping sets Rq containing all
covariances between each pair of possible answers.                                  possible answers to each TARGET question q, set of
   We show that aggregate statistics available via the Hunch                        known responses to AUX questions A,
API can be used to infer an individual user’s responses to                          P ROPAGATEDAUX returns a subset of A,
                                                                                    implementation-specific parameters
THAY questions, even though these responses are not made
                                                                                    thresholdsupport,score
public by Hunch. Suppose the attacker knows some auxiliary                  Output: Inferred responses to TARGET questions q
information about a Hunch user (e.g., height, hair color,                   inferredResponses = {}
age, hometown, political views) which allows the attacker to                foreach answer set Rq in Q do
reliably predict how the user will respond to the corresponding                 maxScore = thresholdscore
THAY questions. We refer to the latter as AUX questions. See                    maxSupport = thresholdsupport
Section III for possible sources of auxiliary information.                      foreach observation time τ do
                                                                                     propagatedτ = P ROPAGATEDAUX(A, τ )
Setup. The attacker forms a list of questions consisting of both                     ∆ = observation period beginning at τ
AUX questions and questions for which he does not know the                           N∆ = delta matrix containing changes in covariances
                                                                                     between items in Rq ∪ A
user’s responses. We refer to the latter as TARGET questions;
                                                                                     foreach TARGET answer r in Rq do
the objective of the experiment is to infer the user’s responses                         scoreSetr = subset of a ∈ A such that
to them. For our experiment, we chose questions with at least 4                          N∆ [r][a] > 0
possible answers. There were 375 such questions in the THAY                              supportr = |scoreSetr ∩ propagatedτ |
                                                                                                       |supportr |
set at the time of our experiment with simulated users (see                              scorer = |propagated     τ|
below), but new THAY questions are continually added and                                 if scorer ≥ thresholdscore then
users may even suggest new questions.                                                         if supportr > maxSupport then
                                                                                                  inf erredResponses[q] = {r}
   Immediately prior to the attack, the attacker uses the API                                     maxSupport = supportr
function responsePairStats to collect all pairwise co-                                            maxScore = scorer
variances between possible answers to questions on his list.                                  else if supportr = maxSupport then
Next, he directs the target user to specific questions from his                                   if scorer > maxScore then
                                                                                                       maxScore = scorer
list via links of the form http://hunch.com/people/husernamei
                                                                                                       inf erredResponses[q] = {r}
/edit-answer/?qid=hqidi where husernamei is replaced by the                                       else if scorer == maxScore then
target user’s username and hqidi is replaced with the ques-                                            inf erredResponses[q] =
tion id. The attacker must know the username, but the site                                             inf erredResponses[q] ∪ {r}
provides a social networking feature with profile pages where               return inferredResponses
usernames can be linked to real names, interests, and other
personal information. We assume that the user responds to
all questions at the same time and that his responses to most                The above covariances are not updated simultaneously,
AUX questions match the attacker’s auxiliary information (our             which greatly complicates the attacker’s task. Hunch appears
inference algorithms are robust to some mistakes in AUX).                 to split THAY questions into chunks and update pairwise
   Our goal is to show that individual responses can be inferred          answer statistics one chunk at a time. For instance, covariances
from the public outputs of recommender systems, not to                    between possible answers to question 1 and question 2 may
conduct an actual attack. Therefore, we omit discussion of                update on Tuesday and Friday, while covariances between
mechanisms for convincing a Hunch user to respond to a set                answers to question 1 and question 3 update on Thursday.
of THAY questions. Similarly, it is a matter of opinion which             The attacker must be able to detect when the covariances he
questions and answers constitute sensitive information about              is interested in have “propagated” (see Section IV-B).
an individual. For our purposes, it is sufficient to show that
                                                                          Inferring secret responses. Algorithm 3 shows the inference
the attacker can infer the values of the user’s secret responses
                                                                          procedure. Intuitively, the algorithm looks for a subset of AUX
to questions chosen by the attacker.
                                                                          answers whose cross-covariances have increased (indicating
Data collection. Hunch does not update the covariance matrix              that they propagated into the covariance matrix), and then
immediately after the user responds to the attacker-supplied              for a single answer to each of the TARGET questions whose
questions. At the time of our experiment, Hunch had approx-               covariances with most of the AUX responses in the propagated
imately 5,000 possible answers to THAY questions and thus                 subset have increased simultaneously.
had to keep statistics on 12.5 million answer pairs. The update              For the algorithm to work, it is essential that large chunks
cycle of pairwise statistics varies, but seems to be on the order         of AUX responses propagate into the covariance matrix at
of 2-3 weeks. Each day during this period, for each known                 the same time (as is the case for Hunch). The attacker can
AUX response ai , the attacker uses responsePairStats                     expect to see large positive shifts in covariance between the
to collect the covariances between (1) ai and all possible                user’s (known) responses to AUX questions and (unknown)
answers to TARGET questions, and (2) ai and aj , where i 6= j             responses to TARGET questions soon after both AUX and
(i.e., cross-covariances between all AUX responses).                      TARGET have propagated. The larger the number of AUX


                                                                    237
                                                                                                 100
             100                                                                                                                         ●       ●            ●
                                                                                                                                                                           ●

                                                                                                                                                                                        ● ● ●
                                                                                                                                                                                                             ●
                                                                                                                                                                                                    ●        ●




                                                                                                 80
             80




                                                                                    % Accuracy
% Accuracy




                                                                                                                                                                                                             ●




                                                                                                 60
             60




                                                                                                                                                                                                             ●




                                                                                                 40
             40




                                                                                                                                                                                   All




                                                                                                 20
             20




                                                                                                                                                                           ●       Low Activity
                                                                                                                                                                                   High Activity




                                                                                                 0
             0




                   0   20        40        60          80        100                                   0                    20                   40                60                  80                   100

                        % Yield (total inferences made)                                                                      % Yield (total inferences made)


Fig. 1. Hunch: Accuracy vs. yield for real users. Each point represents a          Fig. 2.    Hunch: Accuracy vs. yield for simulated users: average of 8
particular tuning of the algorithm, thresholdscore ranges from 45% to 78%,         users, 4 users assigned low-activity questions, 4 users assigned high-activity
thresholdsupport ranges between 32% and 57% of AUX size.                           questions, thresholdscore ranges from 40% to 75%, thresholdsupport
                                                                                   ranges between 28% and 55% of AUX size.



questions for which this pattern is observed, the higher the
attacker’s confidence that the TARGET answer for which
covariances have increased is the user’s true response.
                                                                                                 100



Results. For the experiment with real users, we used 5
volunteers and chose THAY questions with at least 4 possible
                                                                                                 80




answers. Questions were ordered by sample size, and each user
was assigned 20 questions in a round-robin fashion; 15 were
                                                                                                 60
                                                                                   % Yield




randomly designated as AUX and 5 as TARGET. We requested
                                                                                                                        ●
that users respond honestly to all questions and collected                                                     ●
                                                                                                                    ●
                                                                                                                                 ●
                                                                                                                                             ●
                                                                                                                                                      ●
                                                                                                                                                              ●
                                                                                                                                                                       ●   ●
                                                                                                                                                                               ●
                                                                                                                                                                                                            ●
                                                                                                                                                 ●        ●        ●
                                                                                                 40




their responses to serve as the “ground-truth oracle.” After                                           ●
                                                                                                                             ●
                                                                                                                                     ●                                             ●    ●   ●   ●       ●

                                                                                                           ●
all responses were entered into Hunch, we collected pairwise
answer statistics via the API as described above and applied
                                                                                                 20




Algorithm 3 to infer the responses to TARGET questions.                                                                                                       ●        Correct Inferences
                                                                                                                                                                       Total Inferences
   Results are shown in Fig. 1 in the form of a yield-accuracy
                                                                                                 0




curve, with each point corresponding to a particular setting
of the algorithm’s parameters. We constructed a linear rela-                                                   10                    15                       20                   25                       30
tion between thresholdscore and thresholdsupport parameters                                                                                       AUX Size
which produced good results across all experiments. We use
this relation for all Hunch graphs. Parameter ranges are listed                    Fig. 3. Hunch: Yield vs. size of AUX for simulated users. thresholdscore
in captions. Here yield is the fraction of unknown responses                       is 70%, thresholdsupport is 51.25% of AUX size.
for which the algorithm produces candidate inferences and
accuracy is the fraction of candidate inferences that are correct.
   For the experiment on simulated users, we used all 375
Hunch THAY questions with at least 4 possible answers. We                          following the actual distribution obtained from Hunch, e.g.,
monitored the number of users responding to each question                          if 42% of real users respond “North America” to some
(calculated as change in sample size) for 1 week prior to                          question, then the simulated user selects this answer with 0.42
the experiment and ranked questions by activity level. The                         probability. Results are in Fig. 2. As expected, the inference
40 questions with the lowest activity were assigned to user A,                     algorithm performs better on less active questions. Overall,
the next 40 to user B, etc., for a total of 9 users. Due to a data                 our algorithm achieves 78% accuracy with 100% yield.
collection error, the data for one user had to be discarded.                          Fig. 3 shows, for a particular setting of parameters, how
   For each user, 30 questions were randomly assigned as AUX                       yield and accuracy vary with the size of auxiliary information.
and 10 as TARGET. The simulated users “selected” answers                           As expected, larger AUX reduces the number of incorrect




                                                                             238
239
240
241
   For a setting at which 5 users had a minimum of 100 correct                          t appears or rises in the related-items lists associated with
inferences, accuracy was over 31% for 1 user, over 19% for 3                            at least K auxiliary items for the customer. We call the
users, and over 9% for all 5 users. These results suggest that                          corresponding auxiliary items the supporting items for each
there exist classes of users for whom high-yield and moderate-                          inference. The algorithm made a total of 290,182 unique (user,
accuracy inferences are simultaneously attainable.                                      item) inferences based on a month’s worth of data; of these,
                                                                                        787 had at least five supporting items.
D. Amazon
                                                                                           One interesting aspect of Amazon’s massive catalog and
   We conducted a limited experiment on Amazon’s recom-
                                                                                        customer base is that they make items’ sales ranks useful
mender system. Without access to users’ records, we do not
                                                                                        for improving the accuracy of inferences. Suppose (case 1)
have a “ground-truth oracle” to verify inferences (except when
                                                                                        that you had previously purchased item A, and today you
users publicly review an inferred item, thus supporting the
                                                                                        purchased item B. This has the same effect on their related-
inference). Creating users with artificial purchase histories
                                                                                        items lists as if (case 2) you had previously purchased B and
would have been cost-prohibitive and the user set would not
                                                                                        today purchased A. Sales rank can help distinguish between
have been representative of Amazon users.
                                                                                        these two cases, as well as more complicated varieties. We
   The primary public output of Amazon’s recommender sys-
                                                                                        expect the sales rank for most items to stay fairly consistent
tem is “Customers who bought this item also bought . . . ” item
                                                                                        from day to day given a large number of items and customers.
similarity lists, typically displayed when a customer views
                                                                                        Whichever item was purchased today, however, will likely see
an item. Amazon reveals each item’s sales rank, which is a
                                                                                        a slight boost in its sales rank relative to the other. The relative
measure of the item’s popularity within a given category.
                                                                                        boost will be influenced by each item’s popularity, e.g., it may
   Amazon customers may review items, and there is a public
                                                                                        be more dramatic if one of the items is very rare.
list of tens of thousands of “top reviewers,” along with links to
their reviews. Each reviewer has a unique reviewer identifier.                          Case studies. Amazon does not release individual purchase
Reviews include an item identifier, date, and customer opinions                         records, thus we have no means of verifying our inferences.
expressed in various forms. Customers are not required to                               The best we can do is see whether the customer reviewed
review items that they purchase and may review items which                              the inferred item later (within 2 months after the end of our
they did not purchase from Amazon.                                                      data collection). Unfortunately, this is insufficient to measure
Setup. Amazon allows retrieval of its recommendations and                               accuracy. Observing a public review gives us a high confidence
sales-rank data via an API. The data available via the API are                          that an inference is correct, but the lack of a review does not
only a subset of that available via the website: only the 100                           invalidate an inference. Furthermore, the most interesting cases
oldest reviews of each customer (vs. all on the website) and                            from a privacy perspective are the purchases of items for which
only the top 10 similar items (vs. 100 or more on the website).                         the customer would not post a public review.
   We chose 999 customers who initially formed a contiguous                                Therefore, our evidence is limited to a small number of
block of top reviewers outside the top 1,000. We used the                               verifiable inferences. We present three sample cases. Names
entire set of items previously reviewed by each customer as                             and some details have been changed or removed to protect
auxiliary information. The average number of auxiliary items                            the privacy of customers in question. To avoid confusion, the
per customer varied between 120 and 126 during our experi-                              inferred item is labeled t in all cases, and the supporting
ment. Note that this auxiliary information is imperfect: it lacks                       auxiliary items are labeled a1 , a2 , and so on.
items which the customer purchased without reviewing and                                   Mr. Smith is a regular reviewer who had written over 100
may contain items the customer reviewed without purchasing.                             reviews by Day 1 of our experiment, many of them on gay-
   Data collection ran for a month. We created a subset of                              themed books and movies. Item t is a gay-themed movie. On
our list containing active customers, defined as those who had                          Day 20, its sales rank was just under 50,000, but jumped
written a public review within 6 months immediately prior to                            to under 20,000 by Day 21. Mr. Smith’s previous reviews
the start of our experiment (518 total). If a previously passive                        included items a1 , a2 , a3 , a4 , and a5 . Item t was not in the
reviewer became active during the experiment, we added                                  similarity lists for any of them on Day 19 but had moved into
him to this subset, so the experiment ended with 539 active                             the lists for all five by Day 20. Based on this information,
customers. For each auxiliary item of each active customer,                             our algorithm inferred that Mr. Smith had purchased item t.
we retrieved the top 10 most related items (the maximum                                 Within a month, Mr. Smith reviewed item t.
permitted by the API)6 daily. We also retrieved sales-rank data                            Ms. Brown is a regular reviewer who had commented on
for all items on the related-item lists.7                                               several R&B albums in the past. Item t is an older R&B album.
Making inferences. Our algorithm infers that a customer has                             On Day 1, its rank was over 70,000, but decreased to under
purchased some target item t during the observation period if                           15,000 by Day 2. Ms. Brown had previously reviewed items
                                                                                        a1 , a2 , and a3 , among others. Item A moved into item a1
   6 The set of inferences would be larger (and, likely, more accurate) for an
                                                                                        and item a2 ’s similarity lists on Day 2, and also rose higher
attacker willing to scrape complete lists, with up to 100 items, from the site.         in item a3 ’s list that same day. Based on this information,
   7 Because any item can move into and off a related-items list, we could
not monitor the sales ranks of all possible target items for the full month.            our algorithm inferred that Ms. Brown had purchased item t.
Fortunately, related-items lists include sales ranks for all listed items.              Within two months, Ms. Brown reviewed item t.



                                                                                  242
243
244
If users habitually chose to opt out, however, recommendation               DNA [15]. The attack exploits the fact that DNA is very high-
quality could suffer significantly.                                         dimensional, thus the number of attributes is much greater
                                                                            than the number of records under consideration. Wang et al.
  While each mitigation strategy has limitations, a careful
                                                                            strengthened the attack of Homer et al. and also developed a
combination of several techniques may provide substantial
                                                                            second type of attack, which uses a table of pairwise correla-
practical benefits with only modest drawbacks.
                                                                            tions between allele frequencies (also frequently published in
                                                                            GWA studies) to disaggregate the table into individual input
                     IX. R ELATED WORK                                      sequences [34]. By contrast, the inference attacks described in
Privacy and collaborative filtering. To our knowledge, this is              this paper are not based on disaggregation.
the first paper to show how to infer individual behavior from
the public outputs of recommender systems. Previous work                                          X. C ONCLUSIONS
on privacy risks of recommenders focused on “straddlers”
                                                                               Recommender systems based on collaborative filtering have
whose tastes span unrelated genres and assumed that the
                                                                            become an essential component of many websites. In this
attacker is given the entire (anonymized) database of user
                                                                            paper, we showed that their public recommendations may
transactions [30]. This model may be applicable in scenarios
                                                                            leak information about the behavior of individual users to an
where collaborative filtering is outsourced, but is unrealistic for
                                                                            attacker with limited auxiliary information. Auxiliary informa-
real-world recommender systems. Similarly, de-anonymization
                                                                            tion is routinely revealed by users, but these public disclosures
attacks require access to static datasets [13, 26].
                                                                            are under an individual’s control: she decides which items
   Shilling attacks on collaborative filtering systems [24, 25]
                                                                            to review or discuss with others. By contrast, item similarity
aim to influence the system by causing certain items to be rec-
                                                                            lists and item-to-item covariances revealed by a recommender
ommended more often. We briefly mention an active attack on
                                                                            system are based on all transactions, including ones that
user-to-item collaborative filtering which is somewhat similar,
                                                                            users would not disclose voluntarily. Our algorithms leverage
but pursues a completely different goal.
                                                                            this to infer users’ non-public transactions, posing a threat
   Research on “social recommendations”—made solely based                   to privacy. We utilize aggregate statistics which contain no
on a social graph—has shown that accurate recommendations                   “personally identifiable information” and are widely available
necessarily leak information about the existence of edges                   from popular sites such as Hunch, Last.fm, LibraryThing, and
between specific nodes in the graph [22]. This work differs                 Amazon. Our attacks are passive and can be staged by any
from ours in that it (i) does not model user transactions, only             user of the system. An active attacker can do even more.
edges in the social graph, (ii) does not consider temporal
                                                                               We study larger, established sites as well as smaller and/or
dynamics, and (iii) analyzes recommendations made to a user
                                                                            newer sites. Our results in the latter category are stronger, sup-
rather than public recommendations.
                                                                            porting the intuitive notion that customers of larger sites are
   Previous work on protecting privacy in collaborative recom-              generally safer from a privacy perspective and corroborating
mender systems aimed to hide individual user records from                   the findings in [23]. Smaller datasets increase the likelihood
the system itself [4, 29, 32, 36]. These papers do not address              that individual transactions have a perceptible impact on the
the risk that individual actions can be inferred from temporal              system’s outputs.
changes in the system’s public recommendations and do not
                                                                               Our work concretely demonstrates the risk posed by data
appear to provide much protection against this threat.
                                                                            aggregated from private records and undermines the widely
Privacy of aggregated data. Our attacks belong to a broad                   accepted dichotomy between “personally identifiable” indi-
class of attacks that infer individual inputs from aggregate                vidual records and “safe,” large-scale, aggregate statistics.
statistics. Disclosure of sensitive data from statistical sum-              Furthermore, it demonstrates that the dynamics of aggregate
maries has long been studied in the context of census data [33].            outputs constitute a new vector for privacy breaches. Dynamic
Dinur and Nissim showed theoretically that an attacker who                  behavior of high-dimensional aggregates like item similarity
can query for arbitrary subsets of rows of a private database               lists falls beyond the protections offered by any existing
can learn the entire database even if noise has been added                  privacy technology, including differential privacy.
to aggregated answers [7]. Differential privacy was developed                  Modern systems have vast surfaces for attacks on privacy,
in part to provide a rigorous methodology for protecting                    making it difficult to protect fine-grained information about
privacy in statistical databases [8, 9]. Attacks on statistical             their users. Unintentional leaks of private information are akin
databases often exploit the aggregates that happen to involve               to side-channel attacks: it is very hard to enumerate all aspects
too few individuals. By contrast, we show that even with large              of the system’s publicly observable behavior which may re-
aggregates, temporal changes can reveal underlying inputs.                  veal information about individual users. Increasingly, websites
   Homer et al. showed that given a statistical summary of                  learn from—and indirectly expose—aggregated user activity in
allele frequencies of a DNA pool—such as might be published                 order to improve user experience, provide recommendations,
in a genome-wide association study (GWAS)—it is possible to                 and support many other features. Our work demonstrates the
detect whether or not a target individual is represented in the             inadequacy of current theory and practice in understanding the
pool, provided that the attacker has access to the individual’s             privacy implications of aggregated data.



                                                                      245
                   ACKNOWLEDGEMENTS                                       [16] http://blog.hunch.com/?p=8264 (Accessed Nov 19,
   We thank Ilya Mironov for useful discussions and Ian                        2010).
Davey, Benjamin Delaware, Ari Feldman, Josh Kroll, Joshua                 [17] D. Irani, S. Webb, K. Li, and C. Pu. Large online social
Leners, and Bill Zeller for helpful comments on earlier drafts                 footprints–an emerging threat. In CSE, 2009.
of this paper. The research described in this paper was partially         [18] http://blog.last.fm/2009/03/24/
supported by the NSF grants CNS-0331640, CNS-0716158,                          lastfm-radio-announcement (Accessed Nov 2, 2010).
and CNS-0746888, Google research awards, the MURI pro-                    [19] http://www.librarything.com/press/ (Accessed Nov 10,
gram under AFOSR grant no. FA9550-08-1-0352, and the                           2010).
DHS Scholarship and Fellowship Program under DOE contract                 [20] G. Linden, J. Jacobi, and E. Benson. Collaborative rec-
no. DE-AC05-06OR23100.                                                         ommendations using item-to-item similarity mappings.
                                                                               U.S. Patent 6266649. http://www.patentstorm.us/patents/
                         R EFERENCES                                           6266649/fulltext.html, 2008.
 [1] G. Adomavicius and A. Tuzhilin. Toward the next                      [21] G. Linden, B. Smith, and J. York. Amazon.com recom-
     generation of recommender systems: A survey of the                        mendations: Item-to-item collaborative filtering. In IEEE
     state-of-the-art and possible extensions. TKDE, 17(6),                    Internet Computing, January-February 2003.
     2005.                                                                [22] A. Machanavajjhala, A. Korolova, and A. Sarma. Per-
 [2] R. Bell, Y. Koren, and C. Volinsky. The BellKor solution                  sonalized social recommendations - accurate or private?
     to the Netflix Prize. http://www.netflixprize.com/assets/                 Manuscript, 2010.
     ProgressPrize2007 KorBell.pdf.                                       [23] F. McSherry and I. Mironov. Differentially private
 [3] A. Borges. Toward a new supermarket layout: From                          recommender systems. In KDD, 2009.
     industrial categories to one stop shopping organization              [24] B. Mehta and W. Nejdl.            Unsupervised strategies
     through a data mining approach. In SMA Retail Sympo-                      for shilling detection and robust collaborative filtering.
     sium, 2003.                                                               UMUAI, 19(1–2), 2009.
 [4] J. Canny. Collaborative filtering with privacy. In S & P,            [25] B. Mobasher, R. Burke, R. Bhaumik, and C. Williams.
     2002.                                                                     Effective attack models for shilling item-based collabo-
 [5] H. Chan, E. Shi, and D. Song. Private and continual                       rative filtering systems. In WebKDD, 2005.
     release of statistics. In ICALP, 2010.                               [26] A. Narayanan and V. Shmatikov.                Robust de-
 [6] M. Deshpande and G. Karypis. Item-based top-n recom-                      anonymization of large sparse datasets. In S & P, 2008.
     mendation algorithms. TISSEC, 22(1), 2004.                           [27] A. Narayanan and V. Shmatikov. De-anonymizing social
 [7] I. Dinur and K. Nissim. Revealing information while                       networks. In S & P, 2009.
     preserving privacy. In PODS, 2003.                                   [28] http://www.netflixprize.com/rules (Accessed Nov 19,
 [8] C. Dwork. Differential privacy. In ICALP, 2006.                           2010).
 [9] C. Dwork. Differential privacy: a survey of results. In              [29] H. Polat and W. Du. Privacy-preserving top-n rec-
     TAMC, 2008.                                                               ommendation on horizontally partitioned data. In Web
[10] C. Dwork, M. Naor, T. Pitassi, and G. Rothblum. Dif-                      Intelligence, 2005.
     ferential privacy under continual observation. In STOC,              [30] N. Ramakrishnan, B. Keller, B. Mirza, A. Grama, and
     2010.                                                                     G. Karypis. Privacy risks in recommender systems. In
[11] L. Fortnow. Outed by Amazon. http://weblog.fortnow.                       IEEE Internet Computing, November-December 2001.
     com/2008/02/outed-by-amazon.html (Accessed Nov 17,                   [31] B. Sarwar, G. Karypis, J. Konstan, and J. Riedl. Item-
     2010).                                                                    based collaborative filtering recommendation algorithms.
[12] E. Frank and I. H. Witten. Generating accurate rule sets                  In WWW, 2001.
     without global optimization. In ICML, 1998.                          [32] R. Shokri, P. Pedarsani, G. Theodorakopoulous, and J-
[13] D. Frankowski, D. Cosley, S. Sen, L. Terveen, and                         P. Hubaux. Preserving privacy in collaborative filtering
     J. Riedl. You are what you say: privacy risks of public                   through distributed aggregation of offline profiles. In
     mentions. In SIGIR, 2006.                                                 RecSys, 2009.
[14] R. Garfinkel, R. Gopal, B. Pathak, R. Venkatesan, and                [33] C. Sullivan. An overview of disclosure principles. U.S.
     F. Yin. Empirical analysis of the business value of                       Census Bureau Research Report, 1992.
     recommender systems. http://ssrn.com/abstract=958770,                [34] R. Wang, Y Li, X. Wang, H. Tang, and X. Zhou.
     2006.                                                                     Learning your identity and disease from research papers:
[15] N. Homer, S. Szelinger, M. Redman, D. Duggan,                             information leaks in genome wide association study. In
     W. Tembe, J. Muehling, J. Pearson, D. Stephan, S. Nel-                    CCS, 2009.
     son, and D. Craig. Resolving individuals contributing                [35] Weka 3 - data mining software in Java. http://www.cs.
     trace amounts of DNA to highly complex mixtures using                     waikato.ac.nz/ml/weka/ (Accessed Nov 3, 2010).
     high-density SNP genotyping microarrays. PLoS Genet,                 [36] J. Zhan, C. Hsieh, I. Wang, T. Hsu, C. Liau, and D. Wang.
     4, 2008.                                                                  Privacy-preserving collaborative recommender systems.
                                                                               In SMC, 2010.



                                                                    246
