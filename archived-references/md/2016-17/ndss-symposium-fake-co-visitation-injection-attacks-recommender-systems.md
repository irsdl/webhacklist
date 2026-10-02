---
type: Article
title: Fake Co-visitation Injection Attacks to Recommender Systems
resource: "https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/fake-co-visitation-injection-attacks-recommender-systems/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:27:34+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/fake-co-visitation-injection-attacks-recommender-systems/"
    title: Fake Co-visitation Injection Attacks to Recommender Systems
    author: Guolei Yang, Neil Zhenqiang Gong, Ying Cai
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02B-4_Yang_paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02b_4_yang-gong_slides.pdf"
authors:
  - Guolei Yang
  - Neil Zhenqiang Gong
  - Ying Cai
canonical_url: ""
cited_by:
  - "2016-17.md:106"
commit: ""
content_sha256: b17fb1b75b185cf1ede44a030b1c3425fab963c3e8c3a28078e9b75926fe120b
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/fake-co-visitation-injection-attacks-recommender-systems/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: ceb0afd278128a32f7db02da64dc6078c2c108c92eb05f20843072df900a79f5
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02B-4_Yang_paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:27:34+00:00"
slug: ndss-symposium-fake-co-visitation-injection-attacks-recommender-systems
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Fake Co-visitation Injection Attacks to Recommender Systems

**Fake Co-visitation Injection Attacks to Recommender Systems** - Guolei Yang, Neil Zhenqiang Gong, Ying Cai, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss2017/ndss-2017-programme/fake-co-visitation-injection-attacks-recommender-systems/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02B-4_Yang_paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02b_4_yang-gong_slides.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02B-4_Yang_paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Fake Co-visitation Injection Attacks to
                             Recommender Systems

                      Guolei Yang                                   Neil Zhenqiang Gong                            Ying Cai
                  Iowa State University                             Iowa State University                    Iowa State University
                   yanggl@iastate.edu                               neilgong@iastate.edu                      yingcai@iastate.edu
    Abstract—Recommender systems have become an essential                           category of recommender system to implement the two rec-
component in a wide range of web services. It is believed that                      ommendation tasks, which we call co-visitation recommender
recommender systems recommend a user items (e.g., videos on                         system, is likely being widely used by web service providers
YouTube, products on Amazon) that match the user’s preference.                      (e.g., YouTube [2], Amazon [3]) due to its effectiveness and
In this work, we propose new attacks to recommender systems.                        simplicity. Co-visitation recommender systems leverage co-
Our attacks exploit fundamental vulnerabilities of recommender
systems and can spoof a recommender system to make recom-
                                                                                    visitation information between items, and the key idea is that
mendations as an attacker desires. Our key idea is to inject fake                   two items that were frequently co-visited in the past are likely
co-visitations to the system. Given a bounded number of fake                        to be co-visited in the future.
co-visitations that an attacker can inject, two key challenges are                      It was widely believed that recommender systems should
1) which items the attacker should inject fake co-visitations to,
and 2) how many fake co-visitations an attacker should inject
                                                                                    recommend a user items that match the user’s preference.
to each item. We address these challenges via modelling our                         However, Xing et al. [4] recently proposed pollution attacks
attacks as constrained linear optimization problems, by solving                     to user-to-item recommendation, in which the recommender
which the attacker can perform attacks with maximal threats. We                     system is spoofed to recommend any target item (e.g., a video
demonstrate the feasibility and effectiveness of our attacks via                    advertisement on YouTube) to a victim user. Their key idea
evaluations on both synthetic data and real-world recommender                       is to inject fake information, which is related to the target
systems on several popular web services including YouTube,                          item, into the victim user’s profile via cross-site request forgery
eBay, Amazon, Yelp, and LinkedIn. We also discuss strategies                        (CSRF) [5] attacks. However, pollution attacks suffer from
to mitigate our attacks.                                                            the following limitations: 1) pollution attacks rely on CSRF,
                                                                                    which makes it hard to perform the attacks at a large scale,
                           I.   I NTRODUCTION                                       and 2) pollution attacks are not applicable to item-to-item
                                                                                    recommendation because the attacker cannot change the item
    In the era of information explosion, people face an over-
                                                                                    that the user is currently visiting.
whelming number of choices when looking for information
of their interests on the Internet. “... a wealth of information                        In this work, we propose new attacks to spoof recom-
creates a poverty of attention and a need to allocate that                          mender systems to make recommendations as an attacker
attention efficiently ...” [1]. Recommender systems play a curial                   desires. Our attacks do not rely on CSRF, can be performed
role to allocate user attention and help users locate relevant                      at a large scale, and are applicable to both user-to-item and
information in a wide range of web services such as YouTube,                        item-to-item recommendations. In particular, we focus on co-
eBay, and Amazon.                                                                   visitation recommender systems. Our key idea is to inject fake
                                                                                    co-visitations to the system, and we call our attacks fake co-
    In a recommender system, we have a set of users (e.g.,                          visitation injection attacks. We note that attacking co-visitation
registered users, unregistered visitors) and items (e.g., videos                    recommender systems via injecting fake co-visitations is a
on YouTube, products on eBay). Two widely used recom-                               natural idea. Our key contribution is to perform the first formal
mendation tasks are user-to-item recommendation and item-                           and systematic study on fake co-visitation injection attacks.
to-item recommendation. In a user-to-item recommendation,
the system recommends items to a user based on the user’s                               First, we propose a novel threat model. In our threat model,
profile (e.g., the browsing history, the items the user liked                       we define two attacks to recommender systems. They are
or disliked). In an item-to-item recommendation, a list of                          promotion attacks and demotion attacks. A promotion attack is
items are recommended to a user when the user is visiting an                        to spoof the recommender system to recommend a target item
item. This recommendation is commonly known as features                             (e.g., a video advertisement on YouTube, a product on eBay)
like “People who viewed this also viewed”. One particular                           to as many users as possible. Recommending a target item to
                                                                                    more users increases the item’s user impression, which in turn
                                                                                    could lead to more user visits/clicks of the item and eventually
Permission to freely reproduce all or part of this paper for noncommercial
purposes is granted provided that copies bear this notice and the full citation
                                                                                    purchases of certain products. On the contrary, a demotion
on the first page. Reproduction for commercial purposes is strictly prohibited      attack is to spoof the recommender system to recommend an
without the prior written consent of the Internet Society, the first-named author   item to as few users as possible. An attacker can use demotion
(for reproduction of an entire paper only), and the author’s employer if the        attacks to demote its competitors’ items. Moreover, we con-
paper was prepared within the scope of employment.                                  sider three categories of attackers with different background
NDSS ’17, 26 February - 1 March 2017, San Diego, CA, USA
Copyright 2017 Internet Society, ISBN 1-891562-46-0                                 knowledge (i.e., high knowledge, medium knowledge, and low
http://dx.doi.org/10.14722/ndss.2017.23020                                          knowledge). These background knowledge model a variety of
web services and attack scenarios. For instance, in a high                   •    We demonstrate the feasibility and effectiveness of our
knowledge scenario, the attacker knows the recommendation                         attacks on both synthetic and real-world recommender
system’s model details, which represents an upper bound of                        systems used by several popular web services. We also
what an attacker can achieve; in a low knowledge scenario,                        discuss strategies to mitigate our attacks.
the attacker only knows the publicly available recommendation
lists made by the system.                                                          II.        BACKGROUND AND R ELATED W ORK
    Second, we propose fake co-visitation injection attacks
to implement promotion and demotion attacks for different                 A. Co-visitation Recommender Systems
background knowledge. Our key idea is to use scripts to                       Recommender system has become an essential component
automatically co-visit a target item and some items, which                in many web services (e.g., YouTube, eBay, Amazon, and
we call anchor items, such that the target item appears in the            Yelp). In a recommender system, we have a set of users and
anchor items’ item-to-item recommendation lists. In practice,             items. A user could be a registered user or an unregistered
the number of fake co-visitations that an attacker can inject             visitor of a web service. Items are different on different web
is often bounded (though it is still large) due to resource               services, e.g., items are videos on YouTube, while they are
constraints and some mitigation techniques deployed by the                products on Amazon. The goal of a recommender system is
service providers [6]. Given a bounded number of fake co-                 to recommend a user items that match the user’s preference.
visitations, two key challenges for an attacker are 1) which
items should be selected as anchor items, and 2) how many                     Many recommender systems (e.g., content-based systems
fake co-visitations should be injected between the target item            [7, 8] and collaborative filtering based systems [2, 3, 9–12])
and each anchor item, such that the threat of the attack is               have been developed in the past two decades. We refer readers
maximized, e.g., the target item is recommended to the largest            to surveys [13, 14] on recommender systems for details.
number of users for promotion attacks. We address these                   Among these systems, one particular collaborative filtering
challenges via modelling our attacks as constrained linear                based system, which we call co-visitation recommender sys-
optimization problems, by solving which an attacker obtains               tem, is likely being widely used by web services because
the anchor items and the number of fake co-visitations for                of its effectiveness and simplicity. For instance, co-visitation
each anchor item.                                                         recommender system is used by YouTube to recommend
                                                                          videos according to Google’s official report [2], and it is used
    Third, we demonstrate the feasibility and effectiveness               by Amazon to recommend products according to Amazon’s
of our attacks via performing extensive evaluations on both               publication [3]. In this work, we focus on co-visitation recom-
synthetic recommender systems and real-world recommender                  mender systems.
systems. In particular, we demonstrate that the recommender
systems used by several popular web services including
YouTube, eBay, Amazon, Yelp, and LinkedIn are vulnerable to
                                                                                                                       27
our attacks. For instance, in the experiment of YouTube, using                                      22
                                                                                                             8
a single computer with moderate computing power, we are able                                                                5
to promote 20 target videos within three weeks, each of which                                                     12
                                                                                                4        6                      13
appears in the item-to-item recommendation lists of more than                                                          9
200 anchor videos on average; for each target video, the total                           11         7        35
number of views of the anchor videos is more than 6 × 105
on average. We note that, after our attacks, a target video is
going to be shown to any user who views any of these anchor               Fig. 1: Illustration of a co-visitation graph. The weight on edge
videos. Moreover, our attack can promote a target video to be             (i, j) is the number of times that items i and j were co-visited,
in the user-to-item recommendation list of a newly registered             while the weight on node i is the total number of times that i
user with a small number of fake co-visitations.                          was visited.
    Finally, we discuss strategies to mitigate our attacks. For in-
stance, for web services like YouTube, one mitigation strategy            Co-visitation graph: Two items were co-visited by a user if
to balance between security against our attacks and usability is          the user visited both of them. For instance, on YouTube, two
to hide the exact number of views for a video and only shows              videos are co-visited by a user if the user watched one video
its range. We demonstrate, via evaluations on synthetic data,             after watching the other one in the same browser session [2].
that this strategy can mitigate our attacks significantly.                The key component of a co-visitation recommender system
                                                                          is a data structure that we call co-visitation graph. Fig. 1
   We summarize our main contributions as follows:                        illustrates an example co-visitation graph. We denote a co-
                                                                          visitation graph as G = (V, E), where each node i is an item
   •    We present the first formal and systematic study about
                                                                          and an edge (i, j) means that items i and j were co-visited by
        fake co-visitation injection attacks to co-visitation
                                                                          at least one user. Each edge (i, j) in the co-visitation graph has
        recommender systems.
                                                                          a weight, which is the number of times that i and j were co-
   •    We propose a novel threat model to cover a variety of             visited. We call the number of times that an item i was visited
        attackers with different goals and background knowl-              the popularity of i. In the co-visitation graph, we represent the
        edge. We formulate the fake co-visitation injection               popularity of an item i as the node weight of i. Note that, in
        attacks as constrained linear optimization problems,              the co-visitation graph, the node weight (i.e., popularity) of a
        by solving which an attacker can perform attacks with             node i is no less than its weighted degree, which is the sum
        maximal threats.                                                  of the weights of its edges. This is because users could visit

                                                                      2
                         YouTube                                                                   ebay                                                      Amazon

                                                    Fig. 2: Item-to-item recommendation in YouTube, eBay, and Amazon.


                       Co-­‐visita)on	
      Other	
                                                      services might use different such functions. For instance,
                       graph	
            informa)on	
                                                    YouTube [2] uses f (wi , wj ) = wi · wj . Amazon [3] uses
                                                           item-­‐to-­‐item	
  recommenda-on	
  
                                                                                                          Cosine Similarity between the view vectors (i.e., an entry of the
                            Recommenda)on	
                                                               vector is 1 if the corresponding user viewed the corresponding
       Item	
  i	
                                          Top-­‐N	
  recommended	
  items	
  
                                engine	
  
                                                                                                          item, otherwise the entry is 0) of two items as their similarity.
                                                                                                          Since the entries of the view vectors have binary values, Cosine
                       Co-­‐visita)on	
      Other	
                                                      Similarity between two items is reduced to be Equation 1 with
                       graph	
            informa)on	
                                                                   √
                                                           user-­‐to-­‐item	
  recommenda-on	
            f (wi , wj ) = wi · wj .
    Proﬁle	
  of	
          Recommenda)on	
                                                                   Given an item i that a user is visiting, the system first ranks
                                                            Top-­‐N	
  recommended	
  items	
  
     user	
  u	
                engine	
                                                                  the items using their similarities with i and then recommends
                                                                                                          the top-N items with the largest similarities to the user. We
                                                                                                          denote the top-N recommended items for the item i as a
Fig. 3: Item-to-item recommendation vs. user-to-item recom-                                               sorted list Li . Note that this item-to-item recommendation
mendation.                                                                                                method favours unpopular items. Specifically, an item with
                                                                                                          a small popularity is more likely to be recommended than an
                                                                                                          item with a large popularity if they have the same number
the item i without visiting other items. We denote by wij and                                             of co-visitations with the item i. YouTube’s co-visitation rec-
wi the weights of edge (i, j) and node i, respectively.                                                   ommender system [2] avoids recommending highly unpopular
                                                                                                          items via excluding items whose popularities are smaller than
    A co-visitation recommender system mainly leverages such                                              a popularity threshold τ when preparing the top-N recommen-
co-visitation graph to recommend items to a user. The key                                                 dation list.
intuition is that items that were frequently co-visited in the
past are likely to be co-visited in the future. Specifically,                                                 We note that, although co-visitation graph is the core
two popular recommendation tasks are item-to-item recommen-                                               information that is leveraged by co-visitation recommender
dation and user-to-item recommendation. In an item-to-item                                                systems, other information (e.g., item diversity [2]) could also
recommendation, when a user is visiting an item i, the system                                             be considered to tune the recommended items. However, in
shows the top-N recommended items that are similar to i. In a                                             this work, we focus on co-visitation graph and as we will
user-to-item recommendation, the system recommends top-N                                                  demonstrate, manipulating co-visitation graph is sufficient to
items to a user via considering the user’s visiting history. The                                          attack co-visitation recommendation systems at scale.
visiting history could include all items the user has visited if
the user logs in the web service, or it could include items the                                               Fig. 2 shows item-to-item recommendations in YouTube1 ,
user has visited in a browser session if the user does not log                                            eBay, and Amazon. Although the details of the recommender
in or the user is an unregistered visitor. Fig. 3 compares item-                                          systems used by eBay and Amazon are not publicly known,
to-item recommendation and user-to-item recommendation.                                                   from their service names (e.g., “People who viewed this also
                                                                                                          viewed”), we suspect that they are very likely using co-
Item-to-item recommendation: The service provider com-                                                    visitation recommender systems. The parameters N are usually
putes the similarity between each co-visited pair of items (each                                          20, 5, and 4 in the three web services, respectively.
edge in the co-visitation graph corresponds to such a pair)
via the co-visitation graph. Intuitively, items i and j are more                                          User-to-item recommendation: The profile of a user con-
similar if they are more frequently co-visited; given the number                                          sists of the items that the user has visited. User-to-item
of co-visitations between i and j, they tend to be less similar if                                        recommendation considers the user profile when making rec-
they are more popular. To capture such intuitions, the similarity                                         ommendations. The details of how to leverage user profile
sij between item i and item j is calculated as follows [2]:                                               might be different for different web services. For instance, on
                                  wij                                                                        1 According to Xing et al. [4], for logged-in users, at most two of the top-N
                        sij =              ,                  (1)
                              f (wi , wj )                                                                recommended items on YouTube are chosen by user-to-item recommendation
                                                                                                          instead of item-to-item recommendation. For simplicity, we treat all of them
where f (wi , wj ) is a function of wi and wj . Different web                                             as item-to-item recommendation.


                                                                                                     3
YouTube [2], for each item i that was visited by the user, the             Specifically, in their privacy attacks, an attacker first obtains
system computes its top-N recommended items Li via item-                   a partial profile of a user. For instance, on Amazon, some
to-item recommendation. Then YouTube treats the union of                   users will review the products that they purchased. Through
these items Li as a candidate set and recommends the user                  collecting these publicly available reviews, the attacker can
top-N items among the candidate set. To increase diversity                 obtain a subset of products that the target user purchased.
of recommended items, YouTube enlarges the candidate set                   Then the attacker monitors the temporal changes of item-to-
via repeatedly adding in the top-N recommended items of the                item recommendation lists of these products. If an item appears
current items in the candidate set [2]. Again, apart from the              in the recommendation lists of a large number of products that
core co-visitation graph, other information could be considered            are in the target user’s partial profile, the attacker infers that
to tune the top-N recommended items.                                       the user purchased the item. The authors demonstrated that
                                                                           this privacy attack is feasible on various popular web services
   This work focuses on item-to-item recommendation, but                   including Amazon, LibraryThing, Hunch, and Last.fm.
our attacks are also applicable to user-to-item recommendation.
                                                                                            III.      P ROBLEM D EFINITION
B. Attacks to Recommender Systems
    1) Security Attacks: We first review existing security at-             TABLE I: Categorization of an attacker’s background knowl-
tacks to recommender systems.                                              edge
Pollution attacks to user-to-item recommender sys-                                         Scenario               Explanation
tems: Xing et al. [4] recently proposed pollution attacks                                                    Co-visitation graph G,
                                                                                      High knowledge
to the user-to-item recommendation and demonstrated that                                                     popularity threshold τ
YouTube, Amazon, and Google search are vulnerable to the                                                    Recommendation lists L,
                                                                                     Medium knowledge
attacks. The goal of pollution attacks is to spoof the system                                                 item popularities W
to recommend a target item to a specific victim user. The                              Low knowledge        Recommendation lists L
key idea is to inject fake information into the victim user’s
profile (e.g., browsing history) via cross-site request forgery
(CSRF) [5]. Pollution attacks suffer from two key limitations:             A. Attacker’s Background Knowledge
1) pollution attacks rely on CSRF, which makes it hard to
perform the attacks at a large scale, and 2) pollution attacks                 We consider three scenarios where attackers can access
are not applicable to item-to-item recommendation because the              different background knowledge of the recommender system.
attacker cannot change the item that the user is visiting. Our
attacks do not rely on CSRF, can be performed at scale, and                High knowledge: In this scenarios, an attacker has access to
are applicable to both item-to-item recommendation and user-               the co-visitation graph G and the popularity threshold τ that is
to-item recommendation.                                                    used to tune the top-N recommended items. This represents a
                                                                           strong attacker because the attacker knows the key components
Profile injection attacks to recommender systems using                     of the co-visitation recommender system. An attacker could
user-item rating matrices: A few studies [15–17] have                      obtain these information from an insider of the web service
demonstrated that recommender systems (e.g., [3, 9, 10])                   through underground market or the attacker itself could be an
leveraging a user-item rating matrix are vulnerable to profile             insider. This scenario represents an upper bound of the threats
injection attacks (also called shilling attacks). Specifically, in a       introduced by our attacks. We represent high knowledge as a
user-item rating matrix, each row corresponds to a registered              pair (G, τ ).
user and each column corresponds to an item; an entry in
the matrix is the rating score that the corresponding user                 Medium knowledge: In this scenario, an attacker writes a
gave to the corresponding item; a rating score represents the              web crawler to collect some items and their item-to-item top-
corresponding user’s preference to the corresponding item;                 N recommendation lists from the web service. We note that
and most entries of the matrix are missing since a user only               web services often make the item-to-item recommendation lists
provides feedback about a small number of items. Given such                publicly available so unlogged-in visitors can also see them.
a matrix, these recommender systems infer the values of the                Therefore, an attacker can collect these recommendation lists.
missing entries and then recommend users items with the                    Recall that we denote by Li the item-to-item top-N recom-
largest inferred values.                                                   mendation list of an item i. We denote the recommendation
                                                                           lists collected by an attacker as a set L = {L1 , L2 , · · · , Lm },
    Profile injection attacks aim to make a target item be                 where m is the number of items whose recommendation lists
recommended to more users. Specifically, in a profile injection            are collected by the attacker.
attack, an attacker first registers a large number of fake
accounts in the service. Then each fake account gives certain                  Some web services show items’ popularity to users/visitors,
rating scores to a carefully chosen subset of items. These                 and thus an attacker has access to items’ popularities. For
profile injection attacks are not applicable to co-visitation              instance, YouTube shows visitors the number of views (i.e.,
recommender systems that do not rely on the rating matrices.               popularity) of a video. For convenience, we denote by a set
                                                                           W = {(i, wi )|i ∈ I} the popularities of all the items that
    2) Privacy Attacks: Calandrino et al. [18] proposed privacy            the attacker encountered when collecting L, where the set I
attacks to infer a user’s profile (e.g., the products that the user        consists of all the items that the attacker encountered (i.e., the
purchased on Amazon) via analyzing the publicly available                  m items whose recommendation lists were collected by the
recommendations that are made by the recommender system.                   attacker and items in these recommendation lists), and wi is

                                                                       4
the popularity of item i. We represent medium knowledge as                  2) User Impressions: The metric number of items does not
a pair (L, W ).                                                         consider item popularities. Appearing in the recommendation
                                                                        list of a more popular item means that the target item is
Low knowledge: In this scenario, an attacker writes a crawler           going to be recommended to more users/visitors. Therefore,
to collect L = {L1 , L2 , · · · , Lm }, the item-to-item top-N          we propose new metrics, which incorporate item popularities,
recommendation lists of m items. However, we assume the                 to evaluate the threats of promotion and demotion attacks.
service does not provide item popularities, and thus the attacker
does not have access to them. This scenario represents the              Top-k user impression: When a target item it appears in
least knowledge that a co-visitation recommendation system              an item i’s item-to-item recommendation list, the target item
can leak to an attacker. For instance, eBay and Amazon belong           is exposed to any user who visits item i. In other words, the
to this category of services.                                           target item obtains one user impression for any user visit to i.
                                                                        If the item i has more visits in the future, the target item will
B. Definition of Attacks                                                obtain more user impressions. Having more user impressions
                                                                        could lead to more visits of the target item, which subsequently
    We consider two families of attacks to co-visitation rec-
                                                                        could lead to more purchases (if the item is a product or an
ommender systems, namely promotion attacks and demotion
                                                                        ads about a product).
attacks. In a promotion attack, an attacker aims to make a
target item (e.g., a video on YouTube) be recommended to as                 We note the likelihood of turning a user impression to a
many users as possible, while the attacker’s goal is to make a          visit or even purchase could depend on the specific ranking
target item be recommended to as few users as possible in a             position of the target item in the recommendation list. For
demotion attack. Formally, we define them as follows:                   instance, the highest ranked item might have a higher visit rate
    Definition 1 (Promotion Attacks): Given a target item and           than the lowest ranked item. To incorporate the impact of item
an attacker with certain background knowledge about the co-             ranks in the recommendation list, we define a user impression
visitation recommender system, a promotion attack is to abuse           as a top-k user impression if the target item is ranked top-k
the recommender system so that it recommends the target item            on the recommendation list, where k ≤ N .
to as many users as possible.
                                                                        Probability of top-k user impression: Measuring top-k
    Definition 2 (Demotion Attacks): Given a target item and            user impressions for a target item requires knowledge about
an attacker with certain background knowledge about the co-             the number of visits to certain items in the future, which
visitation recommender system, a demotion attack is to abuse            might not be available at the time of attacks. Therefore, we
the recommender system so that it recommends the target item            propose probability of top-k user impression (UI), which is
to as few users as possible.                                            the probability the target item obtains a top-k user impression
                                                                        for a random user visit. Suppose a random user visits an item
Limited resources: We consider an attacker injects fake co-             in a web service, we denote by pi the probability that this
visitations between the target item and other selected items            random user visits item i. Let Iit be the set of items whose
to perform promotion and demotion attacks. We assume the                top-k recommended items include the target item itP   . Then the
number of fake co-visitations that an attacker can inject is            probability of top-k user impression of it is U I = i∈Ii pi .
                                                                                                                                     t
limited. We adopt this threat model for two reasons. First,
an attacker could have limited resources, e.g., IP addresses,               Although the exact pi is not available at the time of attacks,
computing resources. If an attacker injects a very large amount         we can estimate it using the popularity of the item i in the past.
of fake co-visitations from a single IP address, the service            Several studies [19–22] found that many natural phenomena
provider can easily detect the attack and block the attacker [6].       follow a power law. In our case, power law phenomena implies
Therefore, the attacker can inject a bounded number of fake co-         that an item that was popular in the past is likely to be
visitations without being detected, though this bounded number          popular in the future. More specifically, the probability pi is
could still be large. Second, suppose an attacker deploys our           proportional to the current popularity of the item i in power
attacks as a service. An organization wants to use this service         law phenomena. Formally, pi is estimated as follows [23]:
to promote its product, but this organization has a limited                                              wi
budget to pay for the service. In this scenario, the limited                              pi =                         ,               (2)
                                                                                                w1 + w2 + · · · + wn
budget can be translated to a bounded number of fake co-
visitations. An attacker’s goal is to maximize the threats of           where n is the total number of items and wi is the popularity
the promotion or demotion attacks, when the number of fake              of i in the past. Therefore, we have:
co-visitations that can be injected is fixed.                                                        P
                                                                                                        i∈Iit wi
                                                                                          UI =                       .            (3)
C. Evaluation Metrics                                                                           w1 + w2 + · · · + wn
    1) Number of Items: One natural metric to measure promo-            Intuitively, UI = x% indicates that x% of website visitors will
tion attacks and demotion attacks is to use the increased (for          see the item in the recommendation lists of some other items.
promotion attacks) or decreased (for demotion attacks) number
of items whose item-to-item recommendation lists include the            Measuring threat of promotion attacks: Suppose a target
target item. For instance, suppose the target item originally           item it is originally among the top-k recommendation list in
appears in the recommendation lists of 10 items, and the                a set of items which we denote as Iit , where k ≤ N . After
number increases to be 30 after the promotion attack, then              a promotion attack, this set of items is enlarged to be Jit .
the promotion attack’s threat is 20 items.                              We define the threat of this promotion attack as increased

                                                                    5
probability of top-k user impression (IUI), which we formally           between j and the items in Lj keeps unchanged, then the
represent as follows:                                                   recommendation list Lj and the relative rankings of the items
                            P                                           in Lj keep unchanged. In order to make the target item it
                      IUI = i∈Ji −Ii pi                   (4)           appear in the top-k recommendation list of j, the attacker needs
                                   t   t

                                                                        to inject mjk fake co-visitations between the items it and j,
Measuring threat of demotion attacks: Suppose the set of                where mjk satisfies two conditions:
items whose top-k recommended items include the target item
                                                                                                      s0jit > s0jkj                     (6)
is reduced to be Jit after a demotion attack. We define the
threat of this demotion attack as decreased probability of top-                                 wit + mjk ≥ τ,                          (7)
k user impression (DUI), which we define as follows:                    where s0jit is the similarity between j and the target item it ,
                                                                        and s0jkj is the similarity between j and the k-th ranked item
                             P
                     DUI = i∈Ii −Ji pi                      (5)
                                   t    t
                                                                        kj after the attack. Formally, we have s0jit = (wjit + mjk )
    An attacker’s goal is to maximize the IUI or DUI for a              /f (wj + mjk , wit +mjk ) and s0jkj = wjkj /f (wj +mjk , wkj ),
target item with given background knowledge and resource.               where wjit is the number of co-visitations between j and it ,
We note that when all item popularities are known, we will              wj is j’s popularity, wit is it ’s popularity before the attack, and
always use IUI or DUI to measure our attacks. For instance,             the function f is the normalization factor that we discussed in
a service provider, who has access to popularities of all its           Section II-A. In our formulation, we assume that the number
items, can calculate IUI and DUI to measure the security of             of co-visitations between the item j and each item in its
its recommender system against our attacks.                             recommendation list does not increase significantly during the
                                                                        attacking process.
         IV.   C O - VISITATION I NJECTION ATTACKS                           Intuitively, Equation 6 guarantees the similarity between
    We discuss fake co-visitation injection attack strategies for       the item j and the target item is larger than that between j and
attackers with different background knowledge.                          the k-th ranked item in j’s recommendation list after the attack,
                                                                        while Equation 7 guarantees the target item’s popularity passes
A. Promotion Attacks                                                    the threshold testing. The two conditions can be transformed to
                                                                        linear constraints on mjk for various normalization functions
    In promotion attacks, an attacker selects a set of items            f , e.g., the widely used product normalization function (i.e.,
whose recommendation lists haven’t included the target item             f (wi , wj ) = wi · wj ) and sqrt-product normalization function
yet. We call these items anchor items. Then the attacker                                     √
                                                                        (i.e., f (wi , wj ) = wi · wj ). Details of such transformations
injects fake co-visitations between the target item and each            are given in Appendix A. These two linear constraints enable
anchor item to make the target item appear in its top-k                 us to compute the minimum value of mjk that is required to
recommendation list. Specifically, to inject fake co-visitations        attack the anchor item j.
between items, the attacker can write a script and use it
to automatically and repeatedly visit them simultaneously or            Attacking multiple anchor items: The attacker selects a
consecutively (e.g., view the two items in the same browser             set of anchor items that can be successfully attacked using
session). We note that, in practice, attacker’s resources are           bounded resources to maximize the threat. For convenience,
bounded, and thus the number of fake co-visitations that an             we use a binary variable aj to represent whether the item j is
attacker can inject is bounded. Therefore, in promotion attacks,        selected as an anchor item or not, i.e., aj = 1 means j is an
the attacker’s goal is to maximize the increased probability            anchor item. With these variables, we formulate the promotion
of top-k user impression (IUI) for a given number of fake               attack as an optimization problem:
co-visitations that can be injected. Two key challenges in                                      P
                                                                              maximize IU I = j∈Vk aj · pj                         (8)
promotion attacks are: 1) how to select the anchor items, and                           P
2) how many fake co-visitations should be injected for each                   subject to j∈Vk aj · mjk ≤ m                         (9)
anchor item.                                                                             s0jit > s0jkj ,                ∀j ∈ Vk        (10)
    We first show how to solve the challenges with high                                  wit + mjk ≥ τ,                 ∀j ∈ Vk        (11)
knowledge; then we transform a medium-knowledge attack to                                aj ∈ {0, 1},                   ∀j ∈ Vk        (12)
a high knowledge attack by estimating the missing parameters;
and finally we transform a low-knowledge attack to a medium-            where Vk is the set of items whose top-k recommendation lists
knowledge attack by estimating the item popularities.                   do not include the target item.
    1) High Knowledge: With this background knowledge, an                   Intuitively, in our formulation, Equation 8 indicates that
attacker can access the co-visitation graph G and the popularity        the attacker aims to maximize the IUI; Equation 9 encodes
threshold τ used to filter out unpopular items when producing           the resource constraint; Equation 10 and 11 are the constraints
the recommendation lists. Suppose the attacker can inject               that the number of fake co-visitations mjk should satisfy to
totally m fake co-visitations. The probability pi that a random         attack anchor item j. We transform the optimization problem
user visits the item i is determined by Equation 2.                     to a linear programming problem. Specifically, we first derive
                                                                        the minimum value of mjk using Equation 10 and 11. Then,
Attacking one anchor item: Suppose j is a selected anchor               we replace the variable mjk with its minimum value in Equa-
item and Lj is the top-k recommendation list for j. Further-            tion 9. The resulting problem is a standard linear programming
more, we denote by kj the ranked k-th item in Lj . We note that         problem, which has been studied extensively and can be solved
if we add visitations to j while the number of co-visitations           efficiently by various algorithms (e.g., Ellipsoid method [24]).

                                                                    6
   •     Step 1: The attacker solves the optimization problem               that item popularity is a linear regression of
                                                                                                                         Pthe feature values.
                                                                                                                           F
         in Equation 8, e.g., using Ellipsoid method [24]. After            Specifically, g(f1 , f2 , · · · , fF ) = a0 + t=1 at ft . From a
         this step, the attacker obtains the set of anchor items            machine learning perspective, the parameters (e.g., a0 , a1 , · · · ,
         (i.e., an item with aj = 1 is an anchor item) and the              aF for linear regression) in the function g can be learnt with
         number of fake co-visitations that the attacker needs              a training dataset, which consists of some items with both
         to inject to each anchor item.                                     popularities and feature values. However, with low knowledge,
   •     Step 2: The attacker uses a script to automatically                the attacker does not know the item popularities.
         inject mjk fake co-visitations between the target item                 To address this challenge, we propose the attacker grad-
         it and each anchor item j.                                         ually injects fake co-visitations and monitors the changes of
    2) Medium Knowledge: With medium knowledge, the at-                     the recommendation lists, during which the attacker refines the
tacker can access the popularity of each item and see its                   parameters of g. For a web service, the attacker only needs to
recommendation list, but the attacker cannot obtain the number              estimate g once and use it for future attacks.
of co-visitations between items (i.e., edge weights of the co-
visitation graph) nor the popularity threshold τ . Once the                 Learning parameters of g: The attacker first collects a set
attacker has access to the popularity threshold τ and the                   of publicly available features of some items. Then the attacker
similarity sjkj for each item j in the set of items that the                starts with random initial parameter values for the function g
attacker has collected, the attacker can use our attacks that               and uses g to compute the estimated item popularities. With
we develop for high knowledge. Therefore, our key idea is to                the estimated popularities, the attacker performs attacks with
transform attacks with medium knowledge to attacks with high                medium knowledge. However, the key difference is that the
knowledge via estimating the missing parameters.                            attacker injects fake co-visitations to anchor items one by one
                                                                            and monitors the changes of the recommendation lists. For
     Specifically, we estimate upper bounds of the missing                  an anchor item j, if the target item it appears in its top-k
parameters, which gives a lower bound of the threat an attacker             recommendation list before injecting mjk fake co-visitations,
can achieve with a given number of fake co-visitations that can             which indicates j’s popularity might be overestimated, the
be injected. First, we estimate the popularity threshold τ as the           attacker decreases the parameters of g by half; if the target item
popularity of the least popular item on the recommendation                  does not appear in the top-k recommendation list after mjk
lists. Second, we have sjkj ≤ sj(k−1)j ≤ sj(k−2)j ≤ · · · ≤                 fake co-visitations, which means the popularity of j might be
sj1j , i.e., the similarity between j and the kth ranked item kj in         underestimated, the attacker doubles the parameters of g. Via
j’s recommendation list is smaller than those between j and the             repeatedly adjusting the parameters of g, the attacker is able to
(k − 1)th, (k − 2)th, · · · , 1st ranked items of j’s recommenda-           learn a predictor to estimate item popularity. With the function
                                  w         max{wj ,wx }
tion list. Moreover, sjx = f (wjjx  ,wx ) ≤  f (wj ,wx ) . Therefore,
                                                                            g, the attacker transforms an attack with low knowledge to an
we can estimate an upper bound of sjkj . In particular, we                  attack with medium knowledge, and then follows the procedure
first compute the upper bound of sjx for all items x that are               in Section IV-A2 to perform attacks.
ranked higher than kj , and then take the minimum of these
upper bounds as an upper bound for sjkj . With these estimated
parameters, the attacker follows the steps in attacks with high             B. Demotion Attacks
knowledge to perform attacks. However, since the number of                       Demotion attack aims at decreasing UI of a target item
injected co-visitations mjk are estimated, they might be larger             it . We achieve this goal via removing it from the top-k
than what are really needed. Therefore, the attacker gradually              recommendation lists of the selected anchor items. Let Lj be
injects co-visitations and monitors the recommendation lists                the recommendation list of an anchor item j that contains it
of the anchor items; if the target item appears in the top-                 as the uth ranked item (u ≤ k). The attacker cannot remove
k recommendation list of an anchor item, the attacker stops                 existing co-visitations, but it can improve the ranking of the
injecting co-visitations to this anchor item.                               (u + 1)th, (u + 2)th, · · · , (k + 1)th ranked items until it is
     We note that we assume the recommendation list is a sorted             not on the top-k recommendation list. This can be viewed as
list when estimating the parameters. However, if the list is not            a promotion attack which treats these items as target items.
sorted, we can still estimate upper bounds of these parameters.             Therefore, we apply the promotion attacks that we discuss in
For details, please refer to Appendix B. Moreover, techniques               the previous section to perform demotion attacks. The only
like XRay [25] could also be used to estimate the missing                   difference is that the selected anchor items should contain the
parameters.                                                                 target item it . With this difference, we formulate the demotion
                                                                            attack (with high knowledge) as the following optimization
    3) Low Knowledge: With low knowledge, the attacker only                 problem:
obtains the recommendation lists of a set of items. We propose
to estimate the item popularities and transform the attack                                           P
                                                                                maximize DU I = j∈Vk aj · pj                            (14)
to an attack with medium knowledge. Specifically, previous                                 P            Pk+1
work [26] has shown that item popularity can be represented                     subject to j∈Vk aj · x=u+1 mjx ≤ m                      (15)
as a function of a set of features (e.g., number of user reviews,                           k+1
number of purchases) about the item. Formally, we have                                     min {s0jx } > s0jit ,                ∀j ∈ Vk     (16)
                                                                                          x=u+1
                    wj = g(f1 , f2 , · · · , fF ),              (13)                       k+1
                                                                                           min {wx + mjx } ≥ τ,                 ∀j ∈ Vk     (17)
                                                                                          x=u+1
where F is the number of features. For instance, in our
experiments we assume g is a linear function, which means                                 aj ∈ {0, 1},                          ∀j ∈ Vk     (18)


                                                                        7
where Vk is the set of items that contain it in their top-k                                       0.2
                                                                                                            Promition attacks                                          Promition attacks




                                                                                                                                   Attack success rate (%)
recommendation lists, Equation 16 guarantees the similarity




                                                                         Average IUI / DUI (%)
                                                                                                            Demotion attacks                                           Demotion attacks
score of any of the (u + 1)th, (u + 2)th, · · · , (k + 1)th ranked                               0.15
                                                                                                                                                             100
item is greater than that of the target item it , and Equation 17                                                                                             80
                                                                                                  0.1
guarantees that these promoted items can appear in the recom-                                                                                                 60
mendation list. Then the attacker applies our promotion attacks                                  0.05                                                         40
with different background knowledge to perform demotion                                                                                                       20
attacks with the corresponding background knowledge. The                                           0                                                           0
only difference is that the optimization problem in Equation 8                                               High Medium Low                                           High Medium     Low

is replaced with Equation 14.                                                                               Background knowledge                                      Background knowledge

                                                                                                        (a) IUI / DUI of attacks                                   (b) Attack success rate
          V.   E XPERIMENTS ON S YNTHETIC DATA                                                   Fig. 4: Impact of the attacker’s background knowledge.
    We evaluate fake co-visitation injection attacks using syn-
thesized datasets in this section.                                       system produces a top-10 item-to-item recommendation list
                                                                         with a popularity threshold τ = 500. The attacking parameter
A. Experiment Design                                                     k is set to be 5 (e.g., the attacker wants to promote a target
                                                                         item to be among top-5 in the recommendation list of the
Design goals: We aim to answer the following questions:                  anchor items), and the attacker has resources to inject 5000
   •    How does different background knowledge (i.e., high,             fake co-visitations. We assume product normalization function
        medium, and low knowledge) impact the threats of                 to compute similarity. When we study the impact of one factor
        fake co-visitation injection attacks?                            (e.g., attacker’s background knowledge), we will vary this
                                                                         factor while fixing other parameters.
   •    How does the structure of the co-visitation graph im-
        pact the threats of fake co-visitation injection attacks?        Simulating background knowledge: In high knowledge,
                                                                         the attacker knows the co-visitation graph and the popularity
   •    How do the attacker’s resources (i.e., the number of             threshold. In medium knowledge, the attacker knows the item
        fake co-visitations that the attacker can inject) and the        popularities and the top-10 recommendation list for each item.
        attacking parameter k impact the threats of fake co-             In low knowledge, the attacker knows the top-10 recommen-
        visitation injection attacks?                                    dation list for each item; we assume the number of reviews
                                                                         about each item is available to the attacker, and the attacker
Synthesizing co-visitation graphs: The key component of a                uses it as a feature to estimate item popularities. Specifically,
co-visitation recommender system is the co-visitation graph.             we randomly generate the number of reviews for each item
We generate a co-visitation graph with 100,000 nodes. Differ-            such that the correlation coefficient between item popularities
ent structures of this graph could have different impact on our          and reviews equals 0.8.
attacks. We leverage three popular graph generation models
(i.e., regular graph, Erdos-Renyi (ER) random graph [27], and            B. Results
power-law random graph [23]), which are developed by the
network science community, to generate the structure of the                  We assume 10 new target items which are not in the
co-visitation graph. Specifically, in a regular graph, each node         co-visitation graph for promotion attacks, while we pick 10
has the same degree; to generate a ER graph or a power law               items uniformly at random from the co-visitation graph for
graph, we gradually add nodes to the graph and each new                  demotion attacks. Our reported results are averaged among the
node is linked to d existing nodes. These d nodes are picked             corresponding 10 target items.
uniformly at random in ER graph model while they are picked
with probabilities that are proportional to their current degrees        Impact of the attacker’s background knowledge: Fig. 4
in power-law graph model. In our experiments, we assume                  shows the results for attackers with different background
d = 10. Recall that an edge in the co-visitation graph means             knowledge. The attack success rate is defined as the number of
that the two corresponding items were co-visited at least once.          successfully attacked anchor items over the number of anchor
                                                                         items that are selected by our attacks. An anchor item is
    The co-visitation graph also has node weights (i.e., item            successfully attacked if the target item appears in its top-k
popularities) and edge weights (i.e., number of co-visitations           recommendation list. Formally, we define Attack Success Rate
between two items). Since item popularity often follows a                (AST) as:
power-law distribution in real-world recommender systems, we                                                   #successf ully attacked anchor items
generate item popularities from a power-law distribution with                                     AST =                                                                                      (19)
exponent 2 and they range from 100 to 20,000. Since an item                                                          #selected anchor items
that are co-visited with more items might be more popular, we
assign a larger generated popularity to an item with larger node             First, as expected, attacks with high knowledge achieve
degree in the co-visitation graph. Then we randomly assign               larger threats (i.e. IUI for promotion attacks and DUI for
integer edge weights such that the weighted node degree is no            demotion attacks) than attacks with medium knowledge, which
larger than the node weight for each node in the graph.                  in turn achieve larger threats than attacks with low knowledge.
                                                                         However, we also find that, even if only low knowledge is
  Unless otherwise mentioned, we use power-law graph                     available, the attacks can still achieve threats that are almost
model to generate the co-visitation graph, the recommender               1/3 of those achieved with high knowledge.

                                                                     8
                         0.2                                                                                                                                         0.3                                                                      0.3
                                    Promition attacks                                            140           Promition attacks                                                    High knowledge                                                         High knowledge




                                                                       Attack success rate (%)
                                    Demotion attacks                                                           Demotion attacks                                     0.25          Medium knowledge                                      0.25             Medium knowledge
Average IUI / DUI (%)




                                                                                                 120
                        0.15                                                                                                                                                         Low knowledge                                                          Low knowledge




                                                                                                                                                                                                                     Average DUI (%)
                                                                                                                                                  Average IUI (%)
                                                                                                 100                                                                 0.2                                                                      0.2

                         0.1                                                                      80                                                                0.15                                                                0.15
                                                                                                  60
                                                                                                                                                                     0.1                                                                      0.1
                        0.05                                                                      40
                                                                                                  20                                                                0.05                                                                0.05

                          0                                                                        0                                                                     0                                                                     0
                                   Regular    ER    PowerLaw                                                  Regular   ER     PowerLaw                                      2        4          6     8      10                                    2        4      6          8   10
                                 Co-visitation graph structure                                            Co-visitation graph structure                                                          k                                                                  k

                               (a) IUI / DUI of attacks                                                  (b) Attack success rate                                                 (a) Promotion attack                                                   (b) Demotion attack

                          Fig. 5: Impact of the co-visitation graph’s structure.                                                                                                                     Fig. 7: Impact of k.


                         0.3                                                                      0.3                                                                0.3                                                                      0.25
                                    High knowledge                                                              High knowledge                                                            Our attack                                                              Our attack
                        0.25      Medium knowledge                                               0.25         Medium knowledge                                      0.25         Popular-item-attack                                           0.2       Popular-item-attack
                                                                       Average DUI (%)




                                                                                                                                                  Average IUI (%)




                                                                                                                                                                                                                            Average IUI (%)
Average IUI (%)




                                     Low knowledge                                                               Low knowledge                                                   Random-item-attack                                                      Random-item-attack
                         0.2                                                                      0.2                                                                0.2
                                                                                                                                                                                                                                              0.15
                        0.15                                                                     0.15                                                               0.15
                                                                                                                                                                                                                                               0.1
                         0.1                                                                      0.1                                                                0.1

                        0.05                                                                     0.05                                                               0.05                                                                      0.05

                          0                                                                            0                                                                 0                                                                      0
                          2000       4000    6000     8000     10000                                   2000     4000    6000     8000     10000                          2000       4000    6000      8000   10000                                          High Medium Low
                               Number of injected co-visitations                                        Number of injected co-visitations                                    Number of injected co-visitations                                             Background knowledge

                                (a) Promotion attack                                                      (b) Demotion attack                                                              (a)                                                                    (b)

                          Fig. 6: Impact of the number of fake co-visitations.                                                                                                      Fig. 8: Comparing with baseline attacks.


    Second, the attack success rate is 100% with high knowl-                                                                                                         •           Popular-item-attack. This attack injects co-
edge, because the attacker knows all necessary information,                                                                                                                      visitations between a target item and the most
and our attack algorithm can accurately compute the number                                                                                                                       popular item until the target item appears in its
of fake co-visitations need to be injected. With medium                                                                                                                          top-k recommendation list, and then attacks the next
knowledge, the attack success rate slightly decreases because                                                                                                                    most popular item, until there are no more fake
the key parameters are estimated. With low knowledge, the                                                                                                                        co-visitations to inject.
attack success rate further decreases as the item popularities
                                                                                                                                                                     •           Random-item-attack. This attack randomly selects an
are estimated by a linear regression.
                                                                                                                                                                                 anchor item, injects co-visitations until the target item
Impact of co-visitation graph’s structure: We compared                                                                                                                           appears in its top-k recommendation list. This process
our attacks for three types of co-visitation graphs, i.e., reg-                                                                                                                  is repeated until no more fake co-visitations to inject.
ular graph, Erdos-Renyi (ER) random graph, and power-law                                                                                              Fig. 8a shows the average IUI of our promotion attack
random graph. The result is showed in Fig. 5. We find graph                                                                                       and the baseline attacks under medium knowledge. Our attack
structures have relatively small impact on our attacks, though                                                                                    achieves the highest threat when the same amount of fake
the attacker can achieve slightly better results when the co-                                                                                     co-visitations are injected. Fig. 8b compares the performance
visitation graph is close to a ER graph.                                                                                                          of our proposed attack with the baseline attacks where the
Impact of the attacker’s resources and k: Fig. 6 shows the                                                                                        attackers have different background knowledge. Our attack
impact of the number of fake co-visitations that can be injected                                                                                  substantially outperforms the baseline attacks in all situations.
on the threats of our attacks. Not surprisingly, our attacks have                                                                                 Summary: We have the following observations:
larger threats when the attacker has resources to inject more
fake co-visitations. Fig. 7 shows the attacking results as a                                                                                                         •           High-knowledge attacks are more effective than
function of k. A user impression is counted when the target                                                                                                                      medium-knowledge attacks, which in turn are more
item appears in top-k recommendation list of an anchor item.                                                                                                                     effective than low-knowledge attacks.
Our results verify that when k is smaller, both IUI and DUI
become smaller. This is because, when the number of fake co-                                                                                                         •           Graph structures have small impact on our attacks.
visitations is fixed, the attacker can attack less anchor items                                                                                                      •           Our attacks have larger success rates when the attacker
and each anchor item needs more fake co-visitations.                                                                                                                             has resources to inject more fake co-visitations or a
                                                                                                                                                                                 larger k is considered as a threat.
Comparing with baseline attacks: An attacker may also
perform simple attacks on co-visitation recommender systems,                                                                                                         •           Our attacks achieve significantly larger success rates
e.g., inject co-visitations with randomly selected anchor items.                                                                                                                 than the baseline attacks that simply select the most
We compare our promotion attacks with two baseline attacks.                                                                                                                      popular items or random items as anchors.

                                                                                                                                              9
         VI.   ATTACKING R EAL - WORLD S YSTEMS
                                                                                             600                                                                              120
A. Experiment Overview                                                                                     Anchors selected                                                                 Anchors selected
                                                                                             500          Successful attacks                                                  100          Successful attacks




                                                                         Number of anchors




                                                                                                                                                 Number of anchors
    We evaluate our fake co-visitation injection attacks on                                  400                                                                               80
real-world recommender systems of several popular websites,                                  300                                                                               60
including YouTube (the feature “Up Next video”), eBay (the
                                                                                             200                                                                               40
feature “People who viewed this item also viewed”), Amazon
(the feature “People who viewed this also viewed”), Yelp                                     100                                                                               20
(the feature “People also viewed”), and LinkedIn (the feature                                  0                                                                                0
“People Also Viewed”). Among these websites, YouTube is                                               3       6       9     12    15   18   21                                         3     6    9     12   15   18   21
                                                                                                                          Day                                                                         Day
categorized as medium knowledge because its item popularity
                                                                                                      (a) Promotion attacks                                                            (b) Demotion attacks
is publicly visible. All the other websites provide only recom-
mendation lists, and thus they are categorized as low knowl-
                                                                                             8x10^5                                                                           1x10^3
edge. We consider view-based co-visitation, because injecting                                             Promotion attacks                                                                Promotion attacks




                                                                                                                                                 Fake co-visitations needed
purchase-based co-visitation (e.g., features like “People also                                            Demotion attacks                                                    8x10^2       Demotion attacks




                                                                         Sum of popularity
                                                                                             6x10^5
purchased”) is too expensive as the attacker needs to purchase
                                                                                                                                                                              6x10^2
the items.                                                                                   4x10^5
                                                                                                                                                                              4x10^2
    We implemented an automatic co-visitation injection sys-
                                                                                             2x10^5
tem using C#. We integrate the open source web crawler                                                                                                                        2x10^2

GRUB into our system to collect item information from
                                                                                             0x10^0                                                                           0x10^0
the websites. Our experiment platform is a windows server                                                 3       6       9     12 15 18 21                                            0    1000 2000 3000 4000 5000
with Intel Xeon 64-bit 8-core CPU running on 2.93GHz and                                                                      Day                                                             Anchor popularity

32GB RAM. Our system automatically injects co-visitations by             (c) Popularity of successfully attacked                                                               (d) Cost vs. anchor popularity
repeatedly opening item web pages consecutively within the               anchors
same browser session (and using the same user account when                                                                    Fig. 9: Attacking YouTube.
login is required). Since none of the attacked web services
provides high-knowledge, we first used approximately 1 week
to estimate missing parameters on all these recommender
systems with our proposed methods. We then continue to attack            Ethical considerations: To the best of our knowledge, there
these web services for 3 weeks, and record the accumulated               is no known methodology that could obtain our results without
attacking results. We divide the 3 weeks period into multiple            any effect on the real-world recommender systems, though we
12 hour attacking windows. At the beginning of each 12 hour              want to stress that our experiments have very low risks to
window, our system evaluates the attacking results, updates              the service providers and users. For the service providers, our
its budget, and then re-selects anchor items if necessary. This          attacks will affect their co-visitation graphs via changing the
includes selecting new anchors if the attack on some anchors             weights of a very small number of edges. For a user, the risk
failed after 2 or more attacking windows.                                is that some items are recommended to him/her due to our
                                                                         attacks.
     We also attempted to avoid the injected co-visitations being
filtered out by the web services. To this end, we inject co-                 We take several actions to mitigate such risks. First, we
visitations with random time intervals to avoid any fixed                limit our experiments to small scale attacks that are enough
patterns. Additionally, consecutively injected co-visitations are        to demonstrate effectiveness and feasibility of our attacks.
generated to include different items. We also disguised the IP           Second, we reported our attacks to the service providers. Our
address of our experiment platform. Specifically, we purchased           experiments strictly followed the responsible disclosure policy
a VPN service which provides more than 100 VPN servers                   for vulnerability testing of the web services. We confirmed that
with IP addresses all over the world. Our system frequently              our research is IRB exempt.
switches between these servers to visit the websites, in order to
avoid an IP address being blocked due to abnormal activities.            B. Attacking Results
The cost of such VPN service is around 10$ per month at the
time we conducted the experiments.                                       YouTube: Before attacks, we randomly crawled information
                                                                         of approximately 100,000 videos using the same video selec-
    For each web service, we randomly select a set of 40 target          tion method as introduced in [26]. We collected title, view
items, 20 for promotion attacks and the rest for demotion                count (popularity), and recommendation list of each video.
attacks. Anchor items are selected among the set of items                All target items are selected from these videos. Anchor items
that we collected from each web service according to our                 are selected according to our attacks, but we avoid extremely
attacks. Specifically, for each target item, we first generate a         popular items, e.g., items being viewed for over 1 million
set of candidate anchor items. These candidates are selected             times. This is because attacking such items requires more
by searching items containing similar keywords and/or falls              resources (i.e., time or computing power) than our experiment
in the same category as the target item. This is to make the             platform has, but our attacks are also applicable to such popular
attacks more realistic. Because it might be suspicious if users          items. Specifically, we select anchor items with the number of
co-visit two items that are completely unrelated. We average             total views between 500 to 10,000. We set k to be 9 because
our results over the target items for promotion and demotion             top-9 videos in a recommendation list are shown when a video
attacks, respectively.                                                   is being watched.

                                                                    10
                              (%)




                                                                                                              (%)
                                    100                                                                             100                                                    300                                                                                   100
                        items(%)




                                                                                                        items(%)
                                                                                                                                                                           270        Anchors selected                                                            90         Anchors selected
                      victims




                                                                                                      victims
                                                                                                                                                                                     Successful attacks                                                                     Successful attacks
                                     80                                                                              80                                                    240                                                                                    80




                                                                                                                                                       Number of anchors




                                                                                                                                                                                                                                             Number of anchors
                                                                                                                                                                           210                                                                                    70




                                                                                              attacked
              attacked




                                     60                                                                              60                                                    180                                                                                    60
Successfully attacked




                                                                                Successfully attacked
                                                                                                                                                                           150                                                                                    50
                                     40                                                                              40                                                    120                                                                                    40




                                                                                Successfully
Successfully




                                                                                                                                                                            90                                                                                    30
                                     20                                                                              20                                                     60                                                                                    20
                                                                                                                                                                            30                                                                                    10
                                                                                                                                                                             0                                                                                     0
                                             2500 5000 7500 10000                                                         20   15        10   5                                  3     6    9         12              15       18       21                              3     6     9     12   15   18   21
                                            Number of injected co-visitations                                                        k                                                              Day                                                                                 Day
                                          Number of injected co-visitations                                                          k
                                                      (a)                                                                      (b)                                               (a) Promotion attack                                                                   (b) Demotion attacks

Fig. 10: Attacking user-to-item recommendation in YouTube.                                                                                                                                                     1600
                                                                                                                                                                                                                               Promotion attacks
                                                                                                                                                                                                               1400
                                                                                                                                                                                                                               Demotion attacks




                                                                                                                                                                                             Sum of purchase
                                                                                                                                                                                                               1200
    We limit the number of injected co-visitations to approx-
                                                                                                                                                                                                               1000
imately 2400 per 12 hour window. To make our injected co-
                                                                                                                                                                                                                800
visitations be more likely to be counted by YouTube, our
                                                                                                                                                                                                                600
system kept playing the opened video streams for about 3
                                                                                                                                                                                                                400
minutes. Note that computing the exact IUI or DUI requires                                                                                                                                                      200
knowledge of precise popularity of every video on YouTube,                                                                                                                                                        0
which we do not have access to. Thus we report two related                                                                                                                                                                 3        6    9     12                  15   18     21
                                                                                                                                                                                                                                             Day
measurements. The first one is the number of selected anchor
items and the number of anchor items that are successfully                                                                                                                                  (c) Purchases of successfully attacked
attacked. For promotion attacks, an anchor item is successfully                                                                                                                             anchors
attacked if the target item appears in its recommendation list                                                                                                                                                  Fig. 11: Attacking eBay.
after the attack; while for demotion attacks, it means the target
item disappears from its recommendation list. The second one
is sum of popularity of successfully attacked anchor items.                                                                                            user viewed are not publicly available, each user does have an
Fig. 9 shows our results. The results are averaged over the                                                                                            open list of videos he/she “liked” and “subscribed”, which can
20 target items for promotion attacks and demotion attacks,                                                                                            be used as anchor items in our attacks.
respectively. We have observed a delay of 24-48 hours between
attacks and affected recommendation lists update. Such a delay                                                                                             To evaluate our attack without affecting real users, we
is also widely observed on other attacked web services.                                                                                                registered 25 fake accounts. We had each of them watch up to
                                                                                                                                                       100 randomly selected videos, as well as like and/or subscribe
    We observe that more than a half of selected anchor                                                                                                an arbitrary number of the watched videos. YouTube has then
items are successfully attacked for both promotion attacks and                                                                                         generated a list of recommendations for each fake account.
demotion attacks. For promotion attacks, the sum of popularity                                                                                         We use these fake accounts as victims to perform attacks.
of the successfully attacked anchor videos reaches more than                                                                                           The attack goal is to make a randomly selected target video
6 × 105 . A target item will be shown to any user who visits                                                                                           to appear on top-k user-to-item recommendation lists of the
a successfully attacked anchor video in the future. Fig. 9d                                                                                            victims, i.e., promoting a specific video to a targeted group of
shows that more co-visitations are needed to attack anchor                                                                                             users. The attacker only requires the list of videos the victims
videos with larger popularities. This is because videos that                                                                                           liked and subscribed, which we demonstrate to be sufficient to
appeared on the recommendation list of a popular anchor video                                                                                          launch effective attacks in our experiments.
are also likely to be popular, and thus have higher number
of co-visitations with the anchor video. A larger number                                                                                                    Fig. 10a shows the fraction of successfully attacked victims
of co-visitations is needed for the target video to compete                                                                                            whose user-to-item recommendation lists contain the target
with popular videos on the recommendation list. Nevertheless,                                                                                          video as we inject more fake co-visitations. The k is set to be
attacking popular anchor items is not our attack’s goal. Our                                                                                           10 since it is the size of the first page of the recommendation
attacks aim to optimize user impressions of target items,                                                                                              list. We repeated the attack for 10 times, each time using a
and popular items may or may not be selected as anchors.                                                                                               different target video, and we report the average results. As
Moreover, demotion attacks require larger number of fake co-                                                                                           expected, the fraction of successfully attacked victims grows
visitations than promotion attacks, since demotion attacks need                                                                                        as the number of fake co-visitations increases.
to promote multiple videos in order to exclude the target item
                                                                                                                                                           We also studied the impact of k value on the attack success.
from the recommendation list.
                                                                                                                                                       In this experiment, the total number of fake co-visitations is
    In addition to experiments on the item-to-item recom-                                                                                              fixed to be 5000. The k value is adjusted from 20 to 5 and
mendation, we also evaluate our attacks for the user-to-item                                                                                           the result is showed in Fig. 10b. As expected, the fraction of
recommendation on YouTube. According to [2], the user-                                                                                                 successfully attacked victims drops when we decrease k.
to-item recommendation list generated for a registered user
is based on the co-visitation information of videos the user                                                                                           eBay: We collected information of over 7,000 items on
viewed before. Therefore, user-to-item recommendation is also                                                                                          eBay with a crawler and use them as candidates for target
vulnerable to our attacks. Although the exact list of videos a                                                                                         and anchor items. These items are randomly crawled from

                                                                                                                                                  11
                    200                                                            30                                                                100                                                            30
                    180        Anchors selected                                              Anchors selected                                                   Anchors selected                                              Anchors selected
                    160       Successful attacks                                            Successful attacks                                        80       Successful attacks                                            Successful attacks
Number of anchors




                                                               Number of anchors




                                                                                                                                 Number of anchors




                                                                                                                                                                                                Number of anchors
                    140                                                            20                                                                                                                               20
                    120                                                                                                                               60
                    100
                     80                                                                                                                               40
                     60                                                            10                                                                                                                               10
                     40                                                                                                                               20
                     20
                      0                                                             0                                                                  0                                                             0
                          3     6    9     12   15   18   21                            3    6    9     12   15   18   21                                  3     6    9     12   15   18   21                            3    6    9     12   15   18   21
                                         Day                                                          Day                                                                 Day                                                          Day

                          (a) Promotion attacks                                         (b) Demotion attacks                                               (a) Promotion attacks                                         (b) Demotion attacks

                                         Fig. 12: Attacking Amazon.                                                                                                       Fig. 14: Attacking LinkedIn.



                    100                                                            30                                            Amazon: We found that Amazon shows a “People who
                               Anchors selected                                              Anchors selected
                              Successful attacks                                            Successful attacks                   viewed this also viewed” recommendation list, but only for
                     80
Number of anchors




                                                               Number of anchors




                                                                                                                                 items that are purchased by less than about 5 times within
                                                                                   20
                     60                                                                                                          a certain time period. Once the item sales increase, this
                                                                                                                                 recommendation list is replaced by a purchase-based recom-
                     40
                                                                                   10                                            mendation list (“Items frequently bought together”). In our
                     20                                                                                                          experiments, we found that some successfully attacked anchor
                                                                                                                                 items no longer have the view-based recommendation lists.
                      0                                                             0
                          3     6    9     12   15   18   21                            3    6    9     12   15   18   21        This makes it hard to track attacking results and to perform
                                         Day                                                          Day                        adaptive attacks for such items. Therefore, we remove these
                          (a) Promotion attacks                                         (b) Demotion attacks                     items from our experiment statistics, and report results of
                                                                                                                                 items with stable recommendation lists. The result is shown
                                           Fig. 13: Attacking Yelp.                                                              in Fig. 12. k is set to be 4, and the number of injected fake
                                                                                                                                 co-visitations is 3000 per 12 hour.
all categories on eBay. When an item is sold out on eBay,
it will be removed from recommendation lists. Therefore, it                                                                      Yelp: Items on Yelp are location-sensitive, e.g., a restaurant
is meaningless to use sold out items as target or anchor.                                                                        will appear in the recommendation list of another restaurant
Additionally, the feature “People who viewed this also viewed”                                                                   only if they locate in the same city. Therefore, we require
feature is not enabled for all items at all time. Taking these                                                                   the selection of target and anchor items to be in the same
features into consideration, we limit our target and anchor item                                                                 city. We crawled information of over 4000 restaurants in New
selection process to items with stable supply (i.e., they have                                                                   York city, San Francisco, Los Angeles, and Chicago as item
more than one hundred in stock and/or being listed for more                                                                      set. Yelp didn’t explicitly state if the recommender system
than 30 days) and with the recommendation feature enabled                                                                        considers co-visitation from registered users only, but for the
at the time of attack. The number of views of each item is                                                                       best result, we used multiple fake accounts to launch the attack.
not visible so it is estimated based on item features including                                                                  We estimate item popularity using the number of reviews as
the number of purchases and the number of reviews. The k                                                                         well as their rank in local restaurant list, and the number
value is set to be 5, which is the size of recommendation                                                                        of fake co-visitations injected is 3000 per 12 hour. The size
lists on eBay. Our system injects 2400 co-visitations per 12                                                                     of recommendation list is only 3, thus we also set k to be
hour. In our preliminary experiments, we observed that eBay                                                                      3. The attacking result is illustrated in Fig. 13. On average
strongly favors co-visitations generated by registered users                                                                     our attack can successfully make a target item appear in the
over anonymous visitors. Thus, we manually registered 10 fake                                                                    recommendation list of more than 20 restaurants. Note that the
accounts to perform the attacks.                                                                                                 item set of Yelp is significantly smaller comparing to YouTube
                                                                                                                                 or eBay, making it harder to find suitable anchor items. We also
    We report the number of selected anchor items and success-                                                                   observed that some items in the recommendation list appear to
fully attacked anchor items in Fig. 11. Since item popularity is                                                                 be immune from our co-visitation injection attacks. We suspect
not known, we also report the sum of purchases of successfully                                                                   that such items might be from a sponsor, who pays Yelp to
attacked anchor items as a related measurement for popular-                                                                      always show its item in recommendation list. It is also possible
ity (Fig. 11c). Overall, compared with YouTube, attacks on                                                                       that the recommendation list is not generated completely based
eBay demonstrate a smaller number of selected anchor items                                                                       on the number of co-visitations, but also involves other factors
and a smaller fraction of successfully attacked anchor items.                                                                    such as user reviews.
The reason is that eBay is a low-knowledge attack scenario,
and some fake co-visitations are wasted on failed attacking                                                                      LinkedIn: Finally, we test our attacking system against the
attempts. In contrast, YouTube is a medium-knowledge attack                                                                      “People Also Viewed” list on LinkedIn. LinkedIn requires very
scenario since it shows item popularity. This result indicates                                                                   complete personal information and valid email address. Thus,
that limiting an attacker’s background knowledge about item                                                                      we used 5 actual user accounts for our attack. Using these
popularity is an useful way to mitigate our attacks.                                                                             5 users as seeds, we crawled publicly available information

                                                                                                                            12
of about 200 people, and used these people and their direct
connections as item set which include about 1200 people. The                                       0.2
                                                                                                             Promition attacks                                               Promition attacks




                                                                                                                                         Attack success rate (%)
                                                                          Average IUI / DUI (%)
result (Fig. 14) shows that our attacks are effective and increase                                           Demotion attacks                                                Demotion attacks
                                                                                                  0.15
the number of a target item’s appearance in recommendation                                                                                                         100
list by approximately 15 on average.                                                               0.1                                                              80
                                                                                                                                                                    60
                 VII.    C OUNTERMEASURES                                                         0.05                                                              40
                                                                                                                                                                    20
A. Limiting Background Knowledge                                                                    0                                                                0
                                                                                                            None 500 1000 2000                                             None 500    1000 2000
    Our experiments in Section V show that limiting the                                                        Discrete granularity                                          Discrete granularity
attacker’s background knowledge can substantially reduce the
                                                                                                         (a) IUI / DUI of attacks                                        (b) Attack success rate
threats of our attacks. For instance, when the service provider
shows the recommendation lists of the items but does not show                                        Fig. 15: Effect of discretizing popularity of items.
the item popularities, i.e., the attacker has low knowledge about
the recommender system, threats of our attacks are reduced,
though they are still feasible and effective. This implies that
service provider can hide item popularities in order to mitigate          fake co-visitations (because the attacker needs time to solve
our attacks. However, in certain web services (e.g., YouTube),            CAPTCHAs and it is challenging for the attacker to solve them
item popularities are useful information for users; hiding item           with 100% accuracy) and increase the costs for attackers.
popularities may affect user experience.
                                                                          Detecting fake co-visitations: Another mitigation strategy
    We propose to discretize item popularities and show the               is to detect fake co-visitations. Once fake co-visitations are
popularity range instead of the exact popularity for each                 detected, the service provider can remove them from the co-
item. This could achieve a trade-off between security of the              visitation graph or reduce their importance if the detector
recommender system against our attacks and user experience.               is not very accurate. From a machine learning perspective,
Fig. 15 shows our attack results with medium knowledge when               detecting fake co-visitations is an anomaly detection problem.
we discretize item popularities using different granularities.            For instance, if an unpopular item suddenly has many co-
The co-visitation graph and experimental settings are the same            visitations with some items, then it is possible that an attacker
with those we used in Section V. When the item popularity                 is trying to promote this item via our fake co-visitation
is discretized, our attacks sample a random number in the                 injection attacks. Via analyzing temporal dynamics (e.g., using
popularity range of an item and treat it as the item popularity.          similar techniques in Viswanath et al. [31]) of visits and
We observe that, when item popularity is discretized with a               co-visits, the service provider could detect certain fake co-
granularity of 2000, the threats of our attacks drop by about             visitations and mitigate our attacks. We were not able to
40%, making an attack with medium knowledge similar to an                 explore this mitigation strategy since we do not have access
attack with low knowledge.                                                to the visits and co-visits with temporal information.
                                                                          Using co-visitations from registered users: The service
B. Limiting Fake Co-visitations
                                                                          provider can also choose to distinguish between visits from
   Another direction of mitigating our attacks is to limit the            registered users and those from unlogged-in visitors, and give
number of fake co-visitations that an attacker can inject.                higher weights to visits from registered users. Moreover, the
                                                                          service provider can constrain that a registered user can only
CAPTCHA: CAPTCHA is a widely used security technique                      contribute to a limited number of co-visitations to each pair
to distinguish between human and computer. We note that                   of items. As a result, fake co-visitation injection attacks rely
none of the real-world recommender systems that we attacked               on registering a large amount of fake accounts and using
has deployed CAPTCHAs. A web service can show a visitor                   them to perform co-visitations. These fake accounts could be
CAPTCHA challenges if the number of visiting requests from                detected via Sybil detection methods. For instance, when social
the same IP address within a given short period of time is larger         relationships between accounts are available, we can leverage
than a threshold. The threshold achieves a trade-off between              SybilBelief [32] to detect fake accounts.
user experience and attacker’s success. Specifically, legitimate
users/visitors might be affected by CAPTCHAs if the threshold                                                               VIII.     D ISCUSSION
is too small, while a too large threshold allows attackers
to inject many fake co-visitations. Setting a good threshold              Other attacks: We note that web services often provide a
requires analyzing behaviors of users in the recommender                  search functionality to help users locate relevant items. An at-
system. For instance, if a majority of users issue 10 visiting            tacker could leverage this functionality to perform attacks. For
requests within 5 minutes, then the threshold can be set to be            instance, an attacker could add popularly searched keywords
10 for 5 minutes.                                                         to the title of the target item to perform promotion attacks.
                                                                          Such methods, usually called Search Engine Optimization
    We note that recent studies [28, 29] demonstrated that
                                                                          (SEO) [33], is complementary to our fake co-visitation based
CAPTCHA challenges can be automatically solved by machine
                                                                          methods, and they can be used together in practice.
learning techniques with relatively high accuracies, and an at-
tacker can outsource CAPTCHA challenges to human workers                      Moreover, an attacker could simply visit a target item to
using crowdsourcing platforms [30]. However, CAPTCHA is                   make it more popular, and presumably it will appear in search
easy to deploy and it can still slow down the injection of                results more frequently, which serves as a promotion attack.

                                                                     13
However, it is hard for this method to perform optimized                       Pollution attacks on personalized services. In USENIX
attacks. This is because how an item’s popularity is related                   Security, pages 671–686, 2013.
to its ranking in the search results is not publicly known and             [5] William Zeller and Edward W. Felten. Cross-site request
may vary from service to service, which implies that it is hard                forgeries: Exploitation and prevention. Technical report,
for an attacker to optimize the number of visits to a target item              Princeton University, 2008.
in order to promote it to be a certain rank in the search results.         [6] Miriam Marciel, Rubén Cuevas, Albert Banchs, Roberto
Furthermore, it is hard to evaluate the success of this method                 Gonzalez, Stefano Traverso, Mohamed Ahmed, and Ar-
because how exactly users use the search functionality is also                 turo Azcorra. Understanding the detection of view fraud
not publicly known. This limitation implies that, when an                      in video content portals. In WWW, pages 357–368, 2016.
attacker develops the attacks as a service, the attacker cannot            [7] K. Lang. Newsweeder: Learning to filter netnews. In
quantify the success of the attacks to an organization who pays                ICML, 1995.
for the service.                                                           [8] M. Pazzani and D. Billsus. Learning and revising
                                                                               user profiles: The identification of interesting web sites.
Attacking YouTube’s deep learning based recommender                            Machine Learning, 27:313–331, 1997.
systems: Google researchers recently proposed a deep learn-                [9] P. Resnick, N. Iacovou, M. Sushak, P. Bergstrom, and
ing based user-to-item recommender system for YouTube                          J. Riedl. Grouplens: An open architecture for collabora-
(especially for mobile version of YouTube) [34]. This new                      tive filtering of netnews. In CSCW, 1994.
recommender system is much more complex than the co-                      [10] Y Koren, R Bell, and C Volinsky. Matrix factorization
visitation recommender system that we focus on. It is unclear                  techniques for recommender systems. Computer, 8:30–
whether our attacks are also effective at attacking such user-to-              37, 2009.
item recommender systems. Nevertheless, it is an interesting              [11] Bin Liu, Deguang Kong, Lei Cen, Neil Zhenqiang Gong,
future work to study security of such deep learning based                      Hongxia Jin, and Hui Xiong. Personalized mobile app
recommender systems.                                                           recommendation: Reconciling app functionality and user
                                                                               privacy preference. In WSDM, 2015.
          IX.    C ONCLUSION AND F UTURE W ORK                            [12] Bin Liu, Yao Wu, Neil Zhenqiang Gong, Junjie Wu,
                                                                               Hui Xiong, and Martin Ester. Structural analysis of
    In this work, we perform the first formal and systematic                   user choices for mobile app recommendation. ACM
study on fake co-visitation injection attacks to recommender                   Transactions on Knowledge Discovery from Data, 11(2),
systems. First, we propose a novel threat model, which covers                  2016.
a variety of attackers with different goals and background                [13] Gediminas Adomavicius and Alexander Tuzhilin. Toward
knowledge. Second, we formulate fake co-visitation injection                   the next generation of recommender systems: A survey of
attacks as constrained optimization problems. An attacker can                  the state-of-the-art and possible extensions. IEEE TKDE,
perform attacks with maximum threats via solving the opti-                     17(6), 2005.
mization problems. Third, we demonstrate the feasibility and              [14] J. Bobadilla, F. Ortega, A. Hernando, and A. Gutiérrez.
effectiveness of our attacks via evaluations on both synthetic                 Recommender systems survey. Knowledge-Based Sys-
recommender systems and real-world recommender systems                         tems, 46:109–132, 2013.
used by popular web services such as YouTube, eBay, and                   [15] M. O’Mahony, N. Hurley, N. Kushmerick, and G. Sil-
Amazon. We plan to explore new methods to defend and                           vestre. Collaborative recommendation: A robustness
mitigate our attacks in the future.                                            analysis. ACM Transactions on Internet Technology,
                                                                               4(4):344–377, 2004.
                    ACKNOWLEDGEMENTS                                      [16] Shyong K Lam and John Riedl. Shilling recommender
    We thank the anonymous reviewers for their insightful                      systems for fun and profit. In WWW, 2004, pages 393–
comments, which have helped improve the paper substantially.                   402.
This work is supported by the Department of Electrical and                [17] Bamshad Mobasher, Robin Burke, Runa Bhaumik, and
Computer Engineering of the Iowa State University through a                    Chad Williams. Toward trustworthy recommender sys-
startup package.                                                               tems: An analysis of attack models and algorithm robust-
                                                                               ness. ACM Transactions on Internet Technology, 7(4):23,
                         R EFERENCES                                           2007.
                                                                          [18] Joseph A. Calandrino, Ann Kilzer, Arvind Narayanan,
 [1] Herbert A Simon.       Designing organizations for an                     Edward W. Felten, and Vitaly Shmatikov. “you might
     information-rich world. 1971.                                             also like:” privacy risks of collaborative filtering. In IEEE
 [2] James Davidson, Benjamin Liebald, Junning Liu, Palash                     Symposium on Security and Privacy, 2011.
     Nandy, Taylor Van Vleet, Ullas Gargi, Sujoy Gupta,                   [19] Meeyoung Cha, Haewoon Kwak, Pablo Rodriguez,
     Yu He, Mike Lambert, Blake Livingston, et al. The                         Yongyeol Ahn, and Sue Moon. I tube, you tube, ev-
     youtube video recommendation system. In ACM confer-                       erybody tubes: Analyzing the world’s largest user gen-
     ence on Recommender systems, pages 293–296. ACM,                          erated content video system. In ACM/USENIX Internet
     2010.                                                                     Measurement Conference, 2007.
 [3] Greg Linden, Brent Smith, and Jeremy York. Ama-                      [20] Michalis Faloutsos, Petros Faloutsos, and Christos
     zon.com recommendations item-to-item collaborative fil-                   Faloutsos. On power-law relationships of the internet
     tering. IEEE Internet Computing, 7(1):76–80, 2003.                        topology. In SIGCOMM, 1999.
 [4] Xinyu Xing, Wei Meng, Dan Doozan, Alex C Snoeren,                    [21] Aaron Clauset, Cosma Rohilla Shalizi, and M. E. J.
     Nick Feamster, and Wenke Lee. Take this personally:                       Newman. Power-law distributions in empirical data.

                                                                     14
     SIAM Rev., 51(4):661–703, 2009.                                 we have the following linear constraint:
[22] Neil Zhenqiang Gong, Wenchang Xu, Ling Huang, Pra-
     teek Mittal, Emil Stefanov, Vyas Sekar, and Dawn Song.
     Evolution of social-attribute networks: Measurements,                          wjit + mjk               wjkj
                                                                                                      >                          (23)
     modeling, and implications using google+. In IMC, 2012.                  (wj + mjk )(wit + mjk )   (wj + mjk )wkj
[23] A.-L. Barabási and R. Albert. Emergence of scaling in                               wjit + mjk    wjkj
     random networks. Science, 286:509–512, 1999.                                                     >                          (24)
                                                                                          wit + mjk     wkj
[24] Leonid G Khachiyan. Polynomial algorithms in linear                                      
                                                                                          wjkj          wit wjkj
     programming. USSR Computational Mathematics and                                  1−         mjk >           − wjit          (25)
     Mathematical Physics, 20(1):53–72, 1980.                                              wkj            wkj
[25] Mathias Lécuyer, Guillaume Ducoffe, Francis Lan, An-
     drei Papancea, Theofilos Petsios, Riley Spahn, Augustin            For the sqrt-product normalization function, the transfor-
     Chaintreau, and Roxana Geambasu. Xray: Enhancing                mation is similar. After substituting with the sqrt-product
     the web’s transparency with differential correlation. In        function, we get:
     23rd USENIX Security Symposium (USENIX Security
     14), 2014.
                                                                                  wjit + mjk                   wjkj
[26] Gloria Chatzopoulou, Cheng Sheng, and Michalis Falout-               p                           >p                         (26)
     sos. A first step towards understanding popularity in                   (wj + mjk )(wit + mjk )      (wj + mjk )wkj
     youtube. In IEEE INFOCOM Workshops, pages 1–6.                                    (wjit + mjk )2    2
                                                                                                        wjkj
     IEEE, 2010.                                                                                      >                          (27)
[27] P. Erdős and A. Rényi. On random graphs i. Publ. Math.                            wit + mjk      wkj
                                                                                                             2
                                                                                                        wit wjk
                                                                                              
     Debrecen, 6, 1959.                                                          wjkj
[28] Elie Bursztein, Matthieu Martin, and John C. Mitchell.             m2jk −         + 2wjit mjk >           j
                                                                                                                 − wjit          (28)
                                                                                 wkj                      wkj
     Text-based captcha strengths and weaknesses. In ACM
     CCS, pages 125–138, 2011.                                       Since only non-negative real root of Equation 28 is meaningful
[29] Elie Bursztein, Romain Beauxis, Hristo Paskov, Daniele          in our context, we can approximate it as a corresponding linear
     Perito, Celine Fabry, and John Mitchell. The failure            constraint:
     of noise-based non-continuous audio captchas. In IEEE                                          p
                                                                                               α1 + α12 − 4α2
     Symposium on Security and Privacy, pages 19 – 31, 2011.                           mjk >                      ,             (29)
[30] Inside india’s captcha-solving economy. http://blogs.                                             2
                                                                                                                      wjk
     zdnet.com/security/?p=1835. 2016-02-07.                         where the two constant coefficients are α1 = wk j +2wjit and
                                                                                                                        j
[31] Bimal Viswanath, Muhammad Ahmad Bashir, Mark                                  2
                                                                              wit wjk
                                                                                      j
     Crovella, Saikat Guha, Krishna P. Gummadi, Balachander          α2 = −     wkj       + wjit .
     Krishnamurthy, and Alan Mislove. Towards detecting
     anomalous user behavior in online social networks. In           B. Unsorted Recommendation List
     Usenix Security, 2014.
[32] Neil Zhenqiang Gong, Mario Frank, and Prateek Mittal.               In our attacks with medium and low knowledge, we assume
     Sybilbelief: A semi-supervised learning approach for            that the recommendation lists are sorted by the similarity
     structure-based sybil detection. IEEE Transactions on           between items. In the case that the list is unsorted, we assume
     Information Forensics and Security, 9(6):976–987, 2014.         the N items in the recommendation list are still the top-N
[33] Harold Davis. Search engine optimization. ” O’Reilly            items with highest similarity scores, only the orderings among
     Media, Inc.”, 2006.                                             them are random. The attacker’s goal, however, is to make the
[34] Paul Covington, Jay Adams, and Emre Sargin. Deep neu-           target item appear in the top-N recommendation list. k is no
     ral networks for youtube recommendations. In RecSys,            longer a meaningful attacking parameter. We modify Equation
     2016.                                                           6 accordingly to reflect the new constraint:
                                                                                                        N
                         A PPENDIX                                                              s0jit > min{s0jkj }              (30)
                                                                                                       k=1

A. Formulating Linear Constrains                                     Additionally, the parameter estimation process for medium
                                                                     knowledge attacker also needs to be modified. Without order
    We show details of transforming two common normal-
                                                                     information, the attacker can only estimate a loose upper bound
ization functions into corresponding linear constrains (as in                            max{wj ,wx }
Equation 6) in formulating the optimization problem. First,          for sjx by sjx ≤ f (wj ,w   x)
                                                                                                      . Nevertheless, this loose upper
for the product normalization function, we have:                     bound can be updated during the aforementioned adaptive
                                                                     attacking process.
                         s0jit > s0jkj                  (20)
Via substituting with
                           wjit + mjk
              s0jit =                                   (21)
                     (wj + mjk ) · (wit + mjk )
                          wjkj
             s0jkj =                   ,                (22)
                     (wj + mjk ) · wkj


                                                                15
